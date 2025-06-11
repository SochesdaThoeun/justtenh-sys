<?php

namespace App\Http\Controllers\RestAPI\v3\seller;

use App\Events\OrderStatusEvent;
use App\Http\Controllers\Controller;
use App\Models\BusinessSetting;
use App\Models\DeliveryManTransaction;
use App\Models\DeliverymanWallet;
use App\Models\DeliveryZipCode;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\OrderStatusHistory;
use App\Models\Product;
use App\Traits\CommonTrait;
use App\Models\User;
use App\Utils\BackEndHelper;
use App\Utils\Convert;
use App\Utils\CustomerManager;
use App\Utils\Helpers;
use App\Utils\ImageManager;
use App\Utils\OrderManager;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Ramsey\Uuid\Uuid;


class OrderController extends Controller
{
    use CommonTrait;
    public function __construct(
        private DeliveryZipCode $delivery_zip_code,
        private Order $order,
    ){

    }
    public function list(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'nullable',
            'searchValue' => 'nullable|string',
            'customer_id' => 'nullable|integer',
            'from_date' => 'nullable|date',
            'to_date' => 'nullable|date',
            'order_status' => 'nullable|string',
            'limit' => 'nullable|integer',
            'offset' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => Helpers::error_processor($validator)], 403);
        }

        $seller = $request->seller;
        $status = $request->status;
        $searchValue = $request->searchValue;
        $customer_id = $request->customer_id;
        $from_date = $request->from_date;
        $to_date = $request->to_date;
        $order_status = $request->order_status;

        $orders = Order::with('offlinePayments')->with(['customer', 'shipping', 'deliveryMan', 'orderDetails'])
            ->when($status != 'all' && !empty($status), function ($q) use ($status) {
                $q->where(function ($query) use ($status) {
                    if (is_array($status)) {
                        foreach ($status as $orderStatus) {
                            $query->orWhere('order_status', $orderStatus);
                        }
                    } else {
                        $query->orWhere('order_status', $status);
                    }
                });
            })
            ->when($searchValue, function ($q) use ($searchValue) {
                $q->where(function ($query) use ($searchValue) {
                    $query->where('id', 'like', "%{$searchValue}%")
                        ->orWhereHas('customer', function ($customerQuery) use ($searchValue) {
                            $customerQuery->where('f_name', 'like', "%{$searchValue}%")
                                         ->orWhere('l_name', 'like', "%{$searchValue}%")
                                         ->orWhere('phone', 'like', "%{$searchValue}%");
                        });
                });
            })
            ->when($customer_id, function ($q) use ($customer_id) {
                $q->where('customer_id', $customer_id);
            })
            ->when($order_status, function ($q) use ($order_status) {
                $q->where('order_status', $order_status);
            })
            ->when($from_date && $to_date, function ($q) use ($from_date, $to_date) {
                $q->whereDate('created_at', '>=', $from_date)
                  ->whereDate('created_at', '<=', $to_date);
            })
            ->where(['seller_is' => 'seller', 'seller_id' => $seller['id']])
            ->orderBy('id', 'desc')
            ->paginate($request['limit'], ['*'], 'page', $request['offset']);

        $orders?->map(function ($data) {
            if (isset($data['offlinePayments'])) {
                $data['offlinePayments']->payment_info = $data->offlinePayments->payment_info;
            }

            $totalTaxAmount = 0;
            $totalProductPrice = 0;
            $totalProductDiscount = 0;
            if (isset($data['orderDetails']) && count($data['orderDetails']) > 0) {
                $totalTaxAmount = $data['orderDetails']->sum('tax');
                $totalProductPrice = $data['orderDetails']->sum('price');
                $totalProductDiscount = $data['orderDetails']->sum('discount');
            }
            $data['total_tax_amount'] = $totalTaxAmount;
            $data['total_product_price'] = $totalProductPrice;
            $data['total_product_discount'] = $totalProductDiscount;
            return $data;
        });

        return response()->json([
            'total_size' => $orders->total(),
            'limit' => (int)$request['limit'],
            'offset' => (int)$request['offset'],
            'orders' => $orders->items(),
            'filters' => [
                'status' => $status ?? 'all',
                'search_value' => $searchValue,
                'customer_id' => $customer_id,
                'from_date' => $from_date,
                'to_date' => $to_date,
                'order_status' => $order_status,
            ]
        ], 200);
    }

    public function details(Request $request, $id): JsonResponse
    {
        $validator = Validator::make(['id' => $id], [
            'id' => 'required|integer|exists:orders,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => Helpers::error_processor($validator)], 403);
        }

        $seller = $request->seller;
        $detailsList = OrderDetail::with('order.customer','order.deliveryMan','verificationImages')->where(['seller_id' => $seller['id'], 'order_id' => $id])->get();
        
        if ($detailsList->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => translate('Order not found or does not belong to this seller')
            ], 404);
        }
        
        foreach ($detailsList as $detail) {
            $product = json_decode($detail['product_details'], true);
            $product['thumbnail_full_url'] = $detail?->productAllStatus?->thumbnail_full_url;
            if ($product['product_type'] == 'digital' && $product['digital_product_type'] == 'ready_product' && $product['digital_file_ready']) {
                $checkFilePath = storageLink('product/digital-product', $product['digital_file_ready'], ($product['storage_path'] ?? 'public'));
                $product['digital_file_ready_full_url'] = $checkFilePath;
            }
            $detail['product_details'] = Helpers::product_data_formatting_for_json_data($product);
        }

        $histories = OrderStatusHistory::where(['order_id' => $id])
            ->latest()
            ->get();

        // Add histories to each detail in the detailsList
        foreach ($detailsList as $detail) {
            $detail->histories = $histories;
    }

        return response()->json($detailsList, 200);
    }

    public function assign_delivery_man(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'order_id' => 'required',
            'delivery_man_id' => 'required',
        ]);

        if ($validator->errors()->count() > 0) {
            return response()->json(['errors' => Helpers::error_processor($validator)]);
        }

        $seller = $request->seller;
        $order = Order::with('deliveryMan')->where(['seller_id' => $seller['id'], 'id' => $request['order_id']])->first();

        $order->delivery_man_id = $request['delivery_man_id'];
        $order->delivery_type = 'self_delivery';
        $order->delivery_service_name = null;
        $order->third_party_delivery_tracking_id = null;
        $order->save();
        OrderStatusEvent::dispatch('new_order_assigned_message', 'delivery_man', $order);
        return response()->json(['success' => 1, 'message' => translate('order_deliveryman_assigned_successfully')], 200);
    }

    public function amount_date_update(Request $request){
        $validator = Validator::make($request->all(), [
            'order_id' => 'required|integer|exists:orders,id',
            'deliveryman_charge' => 'nullable|numeric|min:0',
            'expected_delivery_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => Helpers::error_processor($validator)], 403);
        }

        $seller = $request->seller;
        $deliveryman_charge = $request->deliveryman_charge;

        $order = Order::with('deliveryMan')->find($request->order_id);
        
        if (!$order || $order->seller_id != $seller['id']) {
            return response()->json([
                'success' => false, 
                'message' => translate('Order not found or does not belong to this seller')
            ], 404);
        }
        
        $db_expected_date  = $order->expected_delivery_date;

        $order->deliveryman_charge = $deliveryman_charge;
        $order->expected_delivery_date = $request->expected_delivery_date;

        try {
            DB::beginTransaction();

            if(!empty($request->expected_delivery_date) && $db_expected_date != $request->expected_delivery_date){
                CommonTrait::add_expected_delivery_date_history($request->order_id, $seller['id'], $request->expected_delivery_date, 'seller');
            }
            $order->save();

            DB::commit();
        }catch(\Exception $ex){
            DB::rollback();
            return response()->json(['success' => 0, 'message' => translate('Update fail!')], 403);
        }

        if(!empty($request->expected_delivery_date) && $db_expected_date != $request->expected_delivery_date){
            OrderStatusEvent::dispatch('expected_delivery_date', 'delivery_man', $order);
        }

        return response()->json(['success' => 0, 'message' => translate('Updated successfully!')], 200);
    }

    /**
     *  Digital file upload after sell
     */
    public function digital_file_upload_after_sell(Request $request)
    {
        $seller = $request->seller;

        $validator = Validator::make($request->all(), [
            'order_id' => 'required',
            'digital_file_after_sell' => 'required|mimes:jpg,jpeg,png,gif,zip,pdf',
        ]);

        if ($validator->errors()->count() > 0) {
            return response()->json(['errors' => Helpers::error_processor($validator)]);
        }

        $order_details = OrderDetail::find($request->order_id);
        if($order_details){
            $order_details->digital_file_after_sell = ImageManager::update('product/digital-product/', $order_details->digital_file_after_sell, $request->digital_file_after_sell->getClientOriginalExtension(), $request->file('digital_file_after_sell'), 'file');
            $order_details->save();
            return response()->json(['success' => 1, 'message' => translate('File_upload_successfully')], 200);
        }else{
            return response()->json(['success' => 0, 'message' => translate("File_upload_fail!")], 202);
        }
    }

    public function order_detail_status(Request $request, $id)
    {

        $validator = Validator::make($request->all(), [
            'order_status' => 'required|string|in:pending,confirmed,processing,out_for_delivery,delivered,returned,failed,canceled'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => Helpers::error_processor($validator)], 403);
        }

        $seller = $request->seller;
        $order = Order::with(['customer','seller.shop', 'deliveryMan'])->find($request->id);
        
        if (!$order || $order->seller_id != $seller['id']) {
            return response()->json([
                'success' => false, 
                'message' => translate('Order not found or does not belong to this seller')
            ], 404);
        }
        
        if(!$order->is_guest && empty($order->customer))
        {
            return response()->json(['success' => 0, 'message' => translate("Customer_account_has_been_deleted").' '.translate("you_cant_update_status")], 202);
        }

        $wallet_status = Helpers::get_business_settings('wallet_status');
        $loyalty_point_status = Helpers::get_business_settings('loyalty_point_status');

        if ($order->order_status == 'delivered') {
            return response()->json(['success' => 0, 'message' => translate('order is already delivered')], 200);
        }

        event(new OrderStatusEvent(key: $request['order_status'], type: 'customer', order: $order));
        if ($request->order_status == 'canceled'){
            event(new OrderStatusEvent(key: 'canceled', type: 'delivery_man', order: $order));
        }


        $order->order_status = $request->order_status;
        if ($request->order_status == 'delivered'){
            $order->payment_status = 'paid';
            OrderDetail::where('order_id', $order->id)->update(['delivery_status'=>'delivered','payment_status'=>'paid']);
        }
        OrderManager::stock_update_on_order_status_change($order, $request->order_status);
        if ($request->order_status == 'delivered' && $order['seller_id'] != null) {
            OrderManager::wallet_manage_on_order_status_change($order, 'seller');

        }

        $order->save();

        if ($order->delivery_man_id && $request->order_status == 'delivered') {
            $dm_wallet = DeliverymanWallet::where('delivery_man_id', $order->delivery_man_id)->first();
            $cash_in_hand = $order->payment_method == 'cash_on_delivery' ? $order->order_amount : 0;

            if (empty($dm_wallet)) {
                DeliverymanWallet::create([
                    'delivery_man_id' => $order->delivery_man_id,
                    'current_balance' => BackEndHelper::currency_to_usd($order->deliveryman_charge) ?? 0,
                    'cash_in_hand' => BackEndHelper::currency_to_usd($cash_in_hand),
                    'pending_withdraw' => 0,
                    'total_withdraw' => 0,
                ]);
            } else {
                $dm_wallet->current_balance += BackEndHelper::currency_to_usd($order->deliveryman_charge) ?? 0;
                $dm_wallet->cash_in_hand += BackEndHelper::currency_to_usd($cash_in_hand);
                $dm_wallet->save();
            }

            if($order->deliveryman_charge && $request->order_status == 'delivered'){
                DeliveryManTransaction::create([
                    'delivery_man_id' => $order->delivery_man_id,
                    'user_id' => $seller->id,
                    'user_type' => 'seller',
                    'credit' => BackEndHelper::currency_to_usd($order->deliveryman_charge) ?? 0,
                    'transaction_id' => Uuid::uuid4(),
                    'transaction_type' => 'deliveryman_charge'
                ]);
            }
        }

        if(!$order->is_guest && $wallet_status == 1 && $loyalty_point_status == 1)
        {
            if($request->order_status == 'delivered'){
                CustomerManager::create_loyalty_point_transaction($order->customer_id, $order->id, Convert::default($order->order_amount-$order->shipping_cost), 'order_place');
            }
        }

        $ref_earning_status = BusinessSetting::where('type', 'ref_earning_status')->first()->value ?? 0;
        $ref_earning_exchange_rate = BusinessSetting::where('type', 'ref_earning_exchange_rate')->first()->value ?? 0;

        if(!$order->is_guest && $wallet_status == 1 && $ref_earning_status == 1 && $request->order_status == 'delivered'){

            $customer = User::find($order->customer_id);
            $is_first_order = Order::where(['customer_id'=>$order->customer_id,'order_status'=>'delivered','payment_status'=>'paid'])->count();
            $referred_by_user = User::find($customer->referred_by);

            if ($is_first_order == 1 && isset($customer->referred_by) && isset($referred_by_user)){
                CustomerManager::create_wallet_transaction($referred_by_user->id, floatval($ref_earning_exchange_rate), 'add_fund_by_admin', 'earned_by_referral');
            }
        }

        CommonTrait::add_order_status_history($order->id, $seller->id, $request->order_status, 'seller');

        return response()->json(['success' => 1, 'message' => translate('order_status_updated_successfully')], 200);
    }

    public function assign_third_party_delivery(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_id' => 'required|integer|exists:orders,id',
            'delivery_service_name' => 'required|string|max:255',
            'third_party_delivery_tracking_id' => 'nullable|string|max:255',
        ]);

        if ($validator->errors()->count() > 0) {
            return response()->json(['errors' => Helpers::error_processor($validator)], 403);
        }

        $seller = $request->seller;
        $order = Order::find($request->order_id);
        
        if (!$order || $order->seller_id != $seller['id']) {
            return response()->json([
                'success' => false, 
                'message' => translate('Order not found or does not belong to this seller')
            ], 404);
        }
        
        $order->delivery_type = 'third_party_delivery';
        $order->delivery_service_name = $request->delivery_service_name;
        $order->third_party_delivery_tracking_id = $request->third_party_delivery_tracking_id;
        $order->delivery_man_id = null;
        $order->deliveryman_charge = 0;
        $order->expected_delivery_date = null;
        $order->save();

        return response()->json(['success' => 1, 'message' => translate('third_party_delivery_assigned_successfully')], 200);
    }

    public function update_payment_status(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_id' => 'required',
            'payment_status' => 'required|in:paid,unpaid'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => Helpers::error_processor($validator)], 403);
        }
        if ($request->payment_status != 'paid') {
            return response()->json(['success' => 0, 'message' => translate('When payment status paid then you can`t change payment status paid to unpaid') . '.'], 200);
        }
        $order = Order::find($request['order_id']);
        if (isset($order)) {
            if ($order->is_guest == '0' && empty($order->customer)) {
                return response()->json(['success' => 0, 'message' => translate("Customer account has been deleted. you can't update status!")], 202);
            }

            if ($order['payment_method'] == 'cash_on_delivery' && $order['order_status'] != 'delivered' && $request['payment_status'] == 'paid') {
                return response()->json([
                    'errors' => [
                        ['code' => 'order', 'message' => translate('Can not change payment status before order delivered!')]
                    ]
                ], 404);
            }

            $order->payment_status = $request['payment_status'];
            $order->save();
            return response()->json(['message' => translate('Payment status updated')], 200);
        }
        return response()->json([
            'errors' => [
                ['code' => 'order', 'message' => translate('not found!')]
            ]
        ], 404);
    }

    public function address_update(Request $request){
        $validator = Validator::make($request->all(), [
            'order_id' => 'required|integer|exists:orders,id',
            'address_type' => 'required|string|in:shipping,billing',
            'contact_person_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'city' => 'required|string|max:255',
            'zip' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'required|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => Helpers::error_processor($validator)], 403);
        }

        $seller = $request->seller;
        $order = $this->order->find($request->order_id);
        
        if (!$order || $order->seller_id != $seller['id']) {
            return response()->json([
                'success' => false, 
                'message' => translate('Order not found or does not belong to this seller')
            ], 404);
        }
        
        $order = $order->toArray();
        $shipping_address_data = $order['shipping_address_data'] ? json_decode(json_encode($order['shipping_address_data']), true) : [];
        $billing_address_data = $order['billing_address_data'] ? json_decode(json_encode($order['billing_address_data']), true) : [];

        $common_address_data = [
            'contact_person_name' => $request->contact_person_name,
            'phone' => $request->phone,
            'city' => $request->city,
            'zip' => $request->zip,
            'email' => $request->email,
            'address' => $request->address,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'updated_at' => now(),
        ];

        if ($request->address_type == 'shipping') {
            $shipping_address_data = array_merge($shipping_address_data, $common_address_data);
        } elseif ($request->address_type == 'billing') {
            $billing_address_data = array_merge($billing_address_data, $common_address_data);
        }
        $update_data = [];

        if ($request->address_type == 'shipping') {
            $update_data['shipping_address_data'] = json_encode($shipping_address_data);
        } elseif ($request->address_type == 'billing') {
            $update_data['billing_address_data'] = json_encode($billing_address_data);
        }

        if (!empty($update_data)) {
            DB::table('orders')->where('id', $request->order_id)->update($update_data);
        }

        return response()->json(['message' => 'Address updated successfully'], 200);
    }

    private function getProductDiscount($product, $price)
    {
        if ($product['discount_type'] == 'percent') {
            return ($price / 100) * $product['discount'];
        }
        return $product['discount'];
    }

    private function getOrderDetailsAddData($cartItem, $product): array
    {
        $variant = $cartItem['variant'];
        $unitPrice = $product['unit_price'];
        $tax = Helpers::tax_calculation(product: $product, price: $product['unit_price'], tax: $product['tax'], tax_type: $product['tax_type']);
        $price = $product['tax_model'] == 'include' ? $product['unit_price'] - $tax : $product['unit_price'];
        $productDiscount = $this->getProductDiscount(product: $product, price: $product['unit_price']);
        $productSubtotal = ($product['unit_price']) * $cartItem['quantity'];

        if ($cartItem['variant'] != null) {
            foreach (json_decode($product['variation'], true) as $variation) {
                if ($cartItem['variant'] == $variation['type']) {
                    $tax = Helpers::tax_calculation(product: $product, price: $variation['price'], tax: $product['tax'], tax_type: $product['tax_type']);
                    $unitPrice = $variation['price'];
                    $price = $product['tax_model'] == 'include' ? $variation['price'] - $tax : $variation['price'];
                    $productDiscount = $this->getProductDiscount(product: $product, price: $variation['price']);
                    $productSubtotal = $variation['price'] * $cartItem['quantity'];
                }
            }
        }

        if ($product['product_type'] == 'digital' && $product['digital_product_type'] == 'ready_product' && !empty($product['digital_file_ready']) && !isset($cartItem['variant_key'])) {
            $product['storage_path'] = $product['digital_file_ready_storage_type'] ??  'public';
        }

        $product['unit_price_amount'] = $unitPrice;
        return [
            'tax' => $tax,
            'price' => $price,
            'variant' => $variant,
            'product' => $product,
            'productDiscount' => $productDiscount,
            'productSubtotal' => $productSubtotal,
        ];
    }

    private function getProductStockCalculate($cartItem, $product): void
    {
        if ($cartItem['variant'] != null) {
            $variationStore = [];
            foreach (json_decode($product['variation'], true) as $variation) {
                if ($cartItem['variant'] == $variation['type']) {
                    $variation['qty'] -= $cartItem['quantity'];
                }
                $variationStore[] = $variation;
            }
            Product::where('id', $product['id'])->update(['variation' => json_encode($variationStore)]);
        }

        if ($product['product_type'] == 'physical') {
            Product::where('id', $product['id'])->update([
                'current_stock' => $product['current_stock'] - $cartItem['quantity']
            ]);
        }
    }

    private static function getOrderNewId()
    {
        $generateOrderID = 100000 + Order::all()->count() + 1;
        if (Order::find($generateOrderID)) {
            $generateOrderID = Order::orderBy('id', 'DESC')->first()->id + 1;
        }
        return $generateOrderID;
    }

    private function isDigitalProductExist($cartList): bool
    {
        $cartIDs = [];
        $isDigitalProduct = false;
        foreach ($cartList as $cart) {
            if (is_array($cart)) {
                $cartIDs[] = $cart['id'];
            }
        }

        if (!empty($cartIDs) && Product::whereIn('id', $cartIDs)->where(['product_type' => 'digital'])->count() > 0) {
            $isDigitalProduct = true;
        }
        return $isDigitalProduct;
    }

    public function place_order(Request $request): JsonResponse
    {
        $seller = $request->seller;

        $validator = Validator::make($request->all(), [
            'customer_id' => 'required',
            'cart' => 'required|array',
            'cart.*.tax' => 'nullable|numeric',
            'cart.*.tax_model' => 'nullable|string|in:include,exclude',
            'payment_method' => 'required|string',
            'order_amount' => 'nullable|numeric',
            'order_date' => 'nullable|date',
            'order_status' => 'nullable|string|in:pending,confirmed,processing,out_for_delivery,delivered,returned,failed,canceled',
            'shipping_method_id' => 'nullable|string',
            'shipping_cost' => 'nullable|numeric',
            'delivery_type' => 'nullable|string|in:self_delivery,third_party_delivery,self_pickup',
            'order_note' => 'nullable|string',
            'discount_amount' => 'nullable|numeric',
            'discount_type' => 'nullable|string|in:amount,percent',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => Helpers::error_processor($validator)], 403);
        }

        $customerId = $request['customer_id'];
        $carts = $request['cart'];
        $extraDiscount = $request['extra_discount'] ?? 0;
        $extraDiscountType = $request['extra_discount_type'] ?? null;
        $couponDiscountAmount = $request['coupon_discount_amount'] ?? $request['discount_amount'] ?? 0;
        $couponCode = $request['coupon_code'] ?? null;
        $paymentMethod = $request['payment_method'];
        $orderType = $request['order_type'] ?? 'regular';
        $orderStatus = $request['order_status'] ?? 'pending';
        $orderDate = $request['order_date'] ?? now();
        $deliveryType = $request['delivery_type'] ?? 'self_delivery';
        $shippingMethodId = $request['shipping_method_id'] ?? null;
        $shippingCost = $request['shipping_cost'] ?? 0;
        $orderNote = $request['order_note'] ?? null;
        $shippingAddress = $request['shipping_address'] ?? null;
        $billingAddress = $request['billing_address'] ?? null;

        $isDigitalProduct = $this->isDigitalProductExist(cartList: $carts);
        if ($customerId == 0 && $isDigitalProduct) {
            return response()->json([
                'success' => false,
                'message' => translate('To_order_digital_product') . ',' . translate('_kindly_provide_customer_information') . '.'
            ], 400);
        }

        $cartsTotalAmount = 0;
        $generateOrderID = self::getOrderNewId();
        
        try {
            DB::beginTransaction();
            
            foreach ($carts as $cartItem) {
                if (is_array($cartItem)) {
                    $product = Product::where(['id' => $cartItem['id']])->withCount('reviews')->first();
                    if ($product) {
                        // If cart item contains price, use it otherwise calculate from product
                        if (isset($cartItem['price']) && is_numeric($cartItem['price'])) {
                            $price = $cartItem['price'];
                            $tax = isset($cartItem['tax']) && is_numeric($cartItem['tax']) ? $cartItem['tax'] : 0;
                            $productDiscount = isset($cartItem['discount']) && is_numeric($cartItem['discount']) ? $cartItem['discount'] : 0;
                            $taxModel = isset($cartItem['tax_model']) ? $cartItem['tax_model'] : $product['tax_model'];
                            
                            $getOrderDetailsArray = [
                                'product' => $product,
                                'price' => $price,
                                'tax' => $tax,
                                'productDiscount' => $productDiscount,
                                'variant' => $cartItem['variant'] ?? null,
                                'tax_model' => $taxModel,
                            ];
                        } else {
                            $getOrderDetailsArray = $this->getOrderDetailsAddData(cartItem: $cartItem, product: $product);
                        }
                        
                        $cartsTotalAmount += $getOrderDetailsArray['price'] * $cartItem['quantity'];
                        $cartsTotalAmount += $getOrderDetailsArray['tax'] * $cartItem['quantity'];

                        $orderDetailsData = [
                            'order_id' => $generateOrderID,
                            'product_id' => $cartItem['id'],
                            'product_details' => json_encode($getOrderDetailsArray['product']),
                            'qty' => $cartItem['quantity'],
                            'price' => $getOrderDetailsArray['price'],
                            'seller_id' => $product['user_id'],
                            'tax' => $getOrderDetailsArray['tax'] * $cartItem['quantity'],
                            'tax_model' => $getOrderDetailsArray['tax_model'] ?? $product['tax_model'],
                            'discount' => $getOrderDetailsArray['productDiscount'] * $cartItem['quantity'],
                            'discount_type' => 'discount_on_product',
                            'delivery_status' => $orderStatus, 
                            'payment_status' => $paymentMethod == 'cash_on_delivery' ? 'unpaid' : 'paid',
                            'variant' => $getOrderDetailsArray['variant'],
                            'variation' => json_encode($cartItem['variation'] ?? []),
                            'created_at' => now(),
                            'updated_at' => now()
                        ];
                        $this->getProductStockCalculate(cartItem: $cartItem, product: $product);
                        DB::table('order_details')->insert($orderDetailsData);
                    }
                }
            }

            // Use provided order_amount if available
            $finalOrderAmount = $request['order_amount'] ?? BackEndHelper::currency_to_usd($cartsTotalAmount);
            
            $orderData = [
                'id' => $generateOrderID,
                'customer_id' => $customerId,
                'customer_type' => 'customer',
                'payment_status' => $paymentMethod == 'cash_on_delivery' ? 'unpaid' : 'paid',
                'order_status' => $orderStatus,
                'seller_id' => $seller->id,
                'seller_is' => 'seller',
                'is_guest' => 1,
                'payment_method' => $paymentMethod,
                'order_type' => $orderType,
                'checked' => 1,
                'extra_discount' => $extraDiscount,
                'extra_discount_type' => $extraDiscountType,
                'order_amount' => $finalOrderAmount,
                'shipping_cost' => BackEndHelper::currency_to_usd($shippingCost),
                'discount_amount' => BackEndHelper::currency_to_usd($couponDiscountAmount),
                'coupon_code' => $couponCode,
                'discount_type' => $request['discount_type'] ?? ($couponCode ? 'coupon_discount' : NULL),
                'coupon_discount_bearer' => $request['coupon_bearer'] ?? 'inhouse',
                'shipping_address_data' => $shippingAddress ? json_encode($shippingAddress) : null,
                'billing_address_data' => $billingAddress ? json_encode($billingAddress) : null,
                'order_note' => $orderNote,
                'delivery_type' => $deliveryType,
                'delivery_service_name' => $deliveryType == 'third_party_delivery' ? $shippingMethodId : null,
                'created_at' => $orderDate,
                'updated_at' => now(),
            ];
            DB::table('orders')->insert($orderData);

            if ($isDigitalProduct) {
                $order = Order::with(['details.productAllStatus', 'customer'])->find($generateOrderID);
                $data = [
                    'userName' => $order->customer->f_name,
                    'userType' => 'customer',
                    'templateName' => 'digital-product-download',
                    'order' => $order,
                    'subject' => translate('download_Digital_Product'),
                    'title' => translate('Congratulations') . '!',
                    'emailId' => $order->customer['email'],
                ];
                event(new \App\Events\DigitalProductDownloadEvent(email: $order->customer['email'], data: $data));
            }

            // Add order status history
            CommonTrait::add_order_status_history($generateOrderID, $seller->id, $orderStatus, 'seller');
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => translate('order_placed_successfully'),
                'order_id' => $generateOrderID
            ], 200);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function edit_order(Request $request): JsonResponse
    {
        $seller = $request->seller;

        $validator = Validator::make($request->all(), [
            'order_id' => 'required|integer|exists:orders,id',
            'customer_id' => 'required|integer',
            'cart' => 'required|array',
            'cart.*.id' => 'required|integer|exists:products,id',
            'cart.*.quantity' => 'required|integer|min:1',
            'cart.*.tax' => 'nullable|numeric',
            'cart.*.tax_model' => 'nullable|string|in:include,exclude',
            'payment_method' => 'required|string|in:cash_on_delivery,digital_payment,offline_payment,abapay',
            'order_amount' => 'nullable|numeric',
            'order_date' => 'nullable|date',
            'order_status' => 'nullable|string|in:pending,confirmed,processing,out_for_delivery,delivered,returned,failed,canceled',
            'shipping_method_id' => 'nullable|string',
            'shipping_cost' => 'nullable|numeric',
            'delivery_type' => 'nullable|string|in:self_delivery,third_party_delivery,self_pickup',
            'order_note' => 'nullable|string',
            'discount_amount' => 'nullable|numeric',
            'discount_type' => 'nullable|string|in:amount,percent',
            'order_type' => 'nullable|string',
            'extra_discount' => 'nullable|numeric|min:0',
            'extra_discount_type' => 'nullable|string|in:amount,percent',
            'coupon_discount_amount' => 'nullable|numeric|min:0',
            'coupon_code' => 'nullable|string',
            'shipping_address' => 'nullable|array',
            'billing_address' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => Helpers::error_processor($validator)], 403);
        }

        $orderId = $request['order_id'];
        $customerId = $request['customer_id'];
        $carts = $request['cart'];
        $extraDiscount = $request['extra_discount'] ?? 0;
        $extraDiscountType = $request['extra_discount_type'] ?? null;
        $couponDiscountAmount = $request['coupon_discount_amount'] ?? $request['discount_amount'] ?? 0;
        $couponCode = $request['coupon_code'] ?? null;
        $paymentMethod = $request['payment_method'];
        $orderType = $request['order_type'] ?? 'regular';
        $orderStatus = $request['order_status'] ?? 'pending';
        $orderDate = $request['order_date'] ?? now();
        $deliveryType = $request['delivery_type'] ?? 'self_delivery';
        $shippingMethodId = $request['shipping_method_id'] ?? null;
        $shippingCost = $request['shipping_cost'] ?? 0;
        $orderNote = $request['order_note'] ?? null;
        $shippingAddress = $request['shipping_address'] ?? null;
        $billingAddress = $request['billing_address'] ?? null;

        // Verify the order belongs to this seller
        $order = Order::with(['details'])->where(['id' => $orderId, 'seller_id' => $seller['id']])->first();
        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => translate('Order not found or does not belong to this seller')
            ], 404);
        }

        $isDigitalProduct = $this->isDigitalProductExist(cartList: $carts);
        if ($customerId == 0 && $isDigitalProduct) {
            return response()->json([
                'success' => false,
                'message' => translate('To_order_digital_product') . ',' . translate('_kindly_provide_customer_information') . '.'
            ], 400);
        }

        $cartsTotalAmount = 0;
        
        try {
            DB::beginTransaction();
            
            // First, restore stock for current order details (treat as canceled)
            OrderManager::stock_update_on_order_status_change($order, 'canceled');
            
            // Delete existing order details after restoring stock
            OrderDetail::where('order_id', $orderId)->delete();
            
            // Create new order details
            foreach ($carts as $cartItem) {
                if (is_array($cartItem)) {
                    $product = Product::where(['id' => $cartItem['id']])->withCount('reviews')->first();
                    if ($product) {
                        // If cart item contains price, use it otherwise calculate from product
                        if (isset($cartItem['price']) && is_numeric($cartItem['price'])) {
                            $price = $cartItem['price'];
                            $tax = isset($cartItem['tax']) && is_numeric($cartItem['tax']) ? $cartItem['tax'] : 0;
                            $productDiscount = isset($cartItem['discount']) && is_numeric($cartItem['discount']) ? $cartItem['discount'] : 0;
                            $taxModel = isset($cartItem['tax_model']) ? $cartItem['tax_model'] : $product['tax_model'];
                            
                            $getOrderDetailsArray = [
                                'product' => $product,
                                'price' => $price,
                                'tax' => $tax,
                                'productDiscount' => $productDiscount,
                                'variant' => $cartItem['variant'] ?? null,
                                'tax_model' => $taxModel,
                            ];
                        } else {
                            $getOrderDetailsArray = $this->getOrderDetailsAddData(cartItem: $cartItem, product: $product);
                        }

                        $cartsTotalAmount += $getOrderDetailsArray['price'] * $cartItem['quantity'];
                        $cartsTotalAmount += $getOrderDetailsArray['tax'] * $cartItem['quantity'];

                        $orderDetailsData = [
                            'order_id' => $orderId,
                            'product_id' => $cartItem['id'],
                            'product_details' => json_encode($getOrderDetailsArray['product']),
                            'qty' => $cartItem['quantity'],
                            'price' => $getOrderDetailsArray['price'],
                            'seller_id' => $product['user_id'],
                            'tax' => $getOrderDetailsArray['tax'] * $cartItem['quantity'],
                            'tax_model' => $getOrderDetailsArray['tax_model'] ?? $product['tax_model'],
                            'discount' => $getOrderDetailsArray['productDiscount'] * $cartItem['quantity'],
                            'discount_type' => 'discount_on_product',
                            'delivery_status' => $orderStatus,
                            'payment_status' => $paymentMethod == 'cash_on_delivery' ? 'unpaid' : 'paid',
                            'variant' => $getOrderDetailsArray['variant'],
                            'variation' => json_encode($cartItem['variation'] ?? []),
                            'is_stock_decreased' => 1,
                            'created_at' => now(),
                            'updated_at' => now()
                        ];
                        $this->getProductStockCalculate(cartItem: $cartItem, product: $product);
                        DB::table('order_details')->insert($orderDetailsData);
                    }
                }
            }

            // Use provided order_amount if available
            $finalOrderAmount = $request['order_amount'] ?? BackEndHelper::currency_to_usd($cartsTotalAmount);

            // Update order data
            $orderData = [
                'customer_id' => $customerId,
                'customer_type' => 'customer',
                'payment_status' => $paymentMethod == 'cash_on_delivery' ? 'unpaid' : 'paid',
                'order_status' => $orderStatus,
                'payment_method' => $paymentMethod,
                'order_type' => $orderType,
                'extra_discount' => $extraDiscount,
                'extra_discount_type' => $extraDiscountType,
                'order_amount' => $finalOrderAmount,
                'shipping_cost' => BackEndHelper::currency_to_usd($shippingCost),
                'discount_amount' => BackEndHelper::currency_to_usd($couponDiscountAmount),
                'coupon_code' => $couponCode,
                'discount_type' => $request['discount_type'] ?? ($couponCode ? 'coupon_discount' : NULL),
                'coupon_discount_bearer' => $request['coupon_bearer'] ?? 'inhouse',
                'shipping_address_data' => $shippingAddress ? json_encode($shippingAddress) : null,
                'billing_address_data' => $billingAddress ? json_encode($billingAddress) : null,
                'order_note' => $orderNote,
                'delivery_type' => $deliveryType,
                'delivery_service_name' => $deliveryType == 'third_party_delivery' ? $shippingMethodId : null,
                'updated_at' => now(),
            ];
            
            // Update order date if provided
            if ($request->has('order_date')) {
                $orderData['created_at'] = $orderDate;
            }
            
            DB::table('orders')->where('id', $orderId)->update($orderData);

            // Add order edit history
            CommonTrait::add_order_status_history($orderId, $seller->id, 'order_edited', 'seller');
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => translate('order_updated_successfully'),
                'order_id' => $orderId
            ], 200);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
