<?php

namespace App\Http\Controllers\RestAPI\v3\seller;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\DeliveryMan;
use App\Models\Order;
use App\Models\OrderTransaction;
use App\Models\Product;
use App\Models\Review;
use App\Models\ReviewReply;
use App\Models\Seller;
use App\Models\SellerWallet;
use App\Models\Shop;
use App\Models\WithdrawalMethod;
use App\Models\WithdrawRequest;
use App\Models\User;
use App\Utils\BackEndHelper;
use App\Utils\Convert;
use App\Utils\Helpers;
use App\Utils\ImageManager;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use phpDocumentor\Reflection\Types\Boolean;

class SellerController extends Controller
{
    public function shop_info(Request $request)
    {
        $seller = $request->seller;
        
        if (!$seller) {
            return response()->json(['errors' => [['code' => 'seller', 'message' => translate('Invalid seller credential')]]], 403);
        }

        $product_ids = Product::where(['user_id' => $seller['id'], 'added_by' => 'seller'])->pluck('id')->toArray();
        $shop = Shop::where(['seller_id' => $seller['id']])->first();
        
        if (!$shop) {
            return response()->json(['errors' => [['code' => 'shop', 'message' => translate('Shop not found')]]], 404);
        }
        
        $shop['rating'] = round(Review::whereIn('product_id', $product_ids)->avg('rating'), 3);
        $shop['rating_count'] = Review::whereIn('product_id', $product_ids)->count();

        return response()->json($shop, 200);
    }

    public function seller_delivery_man(Request $request)
    {
        $seller = $request->seller;
        
        if (!$seller) {
            return response()->json(['errors' => [['code' => 'seller', 'message' => translate('Invalid seller credential')]]], 403);
        }
        
        $delivery_men = DeliveryMan::where(['seller_id' => $seller['id']])->get();

        return response()->json($delivery_men, 200);
    }

    public function shop_product_reviews(Request $request)
    {
        $seller = $request->seller;
        
        if (!$seller) {
            return response()->json(['errors' => [['code' => 'seller', 'message' => translate('Invalid seller credential')]]], 403);
        }
        
        $validator = Validator::make($request->all(), [
            'limit' => 'required|numeric|min:1',
            'offset' => 'required|numeric|min:1',
            'product_id' => 'nullable|numeric',
            'customer_id' => 'nullable|numeric',
            'status' => 'nullable|in:1,0',
            'from' => 'nullable',
            'to' => 'nullable',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => Helpers::error_processor($validator)], 403);
        }
        
        $product_ids = Product::where(['user_id' => $seller['id'], 'added_by' => 'seller'])->pluck('id')->toArray();

        if ($request->has('search')) {
            $key = explode(' ', $request['search']);
            $product_id = Product::where('added_by', 'seller')
                ->where('user_id', $seller->id)
                ->where(function ($q) use ($key) {
                    foreach ($key as $value) {
                        $q->where('name', 'like', "%{$value}%");
                    }
                })->pluck('id')->toArray();

            $customer_id = User::where(function ($q) use ($key) {
                foreach ($key as $value) {
                    $q->orWhere('f_name', 'like', "%{$value}%")
                        ->orWhere('l_name', 'like', "%{$value}%");
                }
            })->pluck('id')->toArray();

            $reviews = Review::whereHas('product', function ($query) use ($seller) {
                    $query->where('added_by', 'seller')->where('user_id', $seller->id);
                })
                ->with(['product', 'reply'])
                ->where(function ($q) use ($product_id, $customer_id) {
                    $q->whereIn('product_id', $product_id)->orWhereIn('customer_id', $customer_id);
                });
        } else {
            $reviews = Review::with(['product', 'customer', 'reply'])
                ->whereHas('product', function ($query) use ($seller) {
                    $query->where('user_id', $seller->id)->where('added_by', 'seller');
                })
                ->when(($request['product_id'] != null && $request['product_id'] != 0), function ($query) use ($request) {
                    $query->where('product_id', $request['product_id']);
                })
                ->when($request->customer_id != null, function ($query) use ($request) {
                    $query->where('customer_id', $request->customer_id);
                })
                ->when($request->status != null, function ($query) use ($request) {
                    $query->where('status', $request->status);
                })
                ->when($request->from && $request->to, function ($query) use ($request) {
                    $query->whereBetween('created_at', [$request->from . ' 00:00:00', $request->to . ' 23:59:59']);
                });
        }

        $reviews = $reviews->latest()
            ->paginate($request['limit'], ['*'], 'page', $request['offset']);

        $reviews->map(function ($data) {
            $data['attachment_full_url'] = $data->attachment_full_url;
            $data['product'] = Helpers::product_data_formatting($data['product']);
            return $data;
        });

        return response()->json([
            'total_size' => $reviews->total(),
            'limit'      => $request['limit'],
            'offset'     => $request['offset'],
            'reviews'    => $reviews->items()
        ], 200);
    }

    public function shopProductReviewReply(Request $request): JsonResponse
    {
        $seller = $request->seller;
        
        if (!$seller) {
            return response()->json(['errors' => [['code' => 'seller', 'message' => translate('Invalid seller credential')]]], 403);
        }
        
        $validator = Validator::make($request->all(), [
            'review_id' => 'required|exists:reviews,id',
            'reply_text' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => Helpers::error_processor($validator)], 403);
        }
        
        $review = ReviewReply::where([
            'review_id'   => $request['review_id'],
            'added_by'    => 'seller',
            'added_by_id' => $seller['id']
        ])->first();

        if (!$review) {
            ReviewReply::insert([
                'review_id'   => $request['review_id'],
                'added_by'    => 'seller',
                'added_by_id' => $seller['id'],
                'reply_text'  => $request['reply_text'],
                'created_at'  => Carbon::now(),
                'updated_at'  => Carbon::now(),
            ]);
        } else {
            ReviewReply::where([
                'review_id'   => $request['review_id'],
                'added_by'    => 'seller',
                'added_by_id' => $seller['id']
            ])->update([
                'reply_text' => $request['reply_text'],
                'updated_at' => Carbon::now(),
            ]);
        }

        return response()->json(['message' => translate('Review_reply_successfully')], 200);
    }

    public function shop_product_reviews_status(Request $request)
    {
        $seller = $request->seller;
        
        if (!$seller) {
            return response()->json(['errors' => [['code' => 'seller', 'message' => translate('Invalid seller credential')]]], 403);
        }
        
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:reviews,id',
            'status' => 'nullable|in:1,0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => Helpers::error_processor($validator)], 403);
        }
        
        $reviews = Review::find($request->id);
        
        // Verify the review belongs to one of this seller's products
        $productBelongsToSeller = Product::where('id', $reviews->product_id)
            ->where('user_id', $seller['id'])
            ->where('added_by', 'seller')
            ->exists();
            
        if (!$productBelongsToSeller) {
            return response()->json(['errors' => [['code' => 'unauthorized', 'message' => translate('You are not authorized to update this review')]]], 403);
        }
        
        $reviews->status = $request->status;
        $reviews->save();
        
        return response()->json(['message' => translate('status updated successfully!!')], 200);
    }

    /**
     * UPDATED SELLER INFO METHOD:
     * Now returns the same kind of dashboard data in JSON.
     */
    public function seller_info(Request $request)
    {
        $seller = $request->seller;
        
        if (!$seller) {
            return response()->json(['errors' => [['code' => 'seller', 'message' => translate('Invalid seller credential')]]], 403);
        }

        // 1) Basic Seller + Wallet + product/order counts (existing logic).
        $data = Seller::with(['wallet'])->withCount(['product', 'orders'])->find($seller['id']);
        
        if (!$data) {
            return response()->json(['errors' => [['code' => 'seller', 'message' => translate('Seller not found')]]], 404);
        }

        // 2) Additional business settings or custom fields.
        $data['free_delivery_features_status']   = Helpers::get_business_settings('free_delivery_status');
        $data['free_delivery_responsibility']    = Helpers::get_business_settings('free_delivery_responsibility');
        $data['minimum_order_amount_by_seller']  = Helpers::get_business_settings('minimum_order_amount_by_seller');
        $data['minimum_order_amount']            = Convert::default($data->minimum_order_amount);
        $data['free_delivery_over_amount']       = Convert::default($data->free_delivery_over_amount);

        // -----------------------------------------
        // The following block integrates logic that
        // mimics a dashboard's data (top-sell, top-rated, etc.).
        // -----------------------------------------

        $vendorId = $seller->id;
        

       

        // For a yearly range (Jan - Dec) to show monthly sums
        $from  = Carbon::now()->startOfYear()->format('Y-m-d');
        $to    = Carbon::now()->endOfYear()->format('Y-m-d');
        $range = range(1, 12);

        // Summation of Seller (Vendor) Earning
        $vendorEarning  = $this->getVendorEarning($vendorId, $from, $to, $range, 'month');

        // Summation of Admin Commission
        $commissionEarn = $this->getAdminCommission($vendorId, $from, $to, $range, 'month');

        // Seller's Wallet
        $wallet = SellerWallet::where('seller_id', $vendorId)->first();

        // Chart labels for months
        $labels  = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        $dateType = 'yearEarn';

         // Summarized dashboard data
        $dashboardData = [
            'orderStatus'            => $this->getOrderStatusArray($vendorId, 'overall'),
            'products_count'         => $data->product_count ?? 0,
            'orders_count'           => $data->orders_count ?? 0,
            'total_earning'          => $wallet->total_earning          ?? 0,
            'withdrawn'              => $wallet->withdrawn              ?? 0,
            'pending_withdraw'       => $wallet->pending_withdraw       ?? 0,
            'admin_commission'       => $wallet->commission_given       ?? 0,
            'delivery_charge_earned' => $wallet->delivery_charge_earned ?? 0,
            'collected_cash'         => $wallet->collected_cash         ?? 0,
            'total_tax_collected'    => $wallet->total_tax_collected    ?? 0,
        ];

        // Merge basic seller data with dashboard data
        $responseData = array_merge($data->toArray(), [
            'vendorEarning'       => array_values($vendorEarning),
            'commissionEarn'      => array_values($commissionEarn),
            'labels'              => $labels,
            'dateType'            => $dateType,
            'dashboardData'       => $dashboardData,
        ]);

        // Return everything in a single JSON response
        return response()->json($responseData, 200);

    }

    public function shop_info_update(Request $request)
    {
        $seller = $request->seller;
        
        if (!$seller) {
            return response()->json(['errors' => [['code' => 'seller', 'message' => translate('Invalid seller credential')]]], 403);
        }
        
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'address' => 'required',
            'contact' => 'required',
            'logo' => 'sometimes|image|mimes:jpg,jpeg,png,gif|max:2048',
            'banner' => 'sometimes|image|mimes:jpg,jpeg,png,gif|max:2048',
            'bottom_banner' => 'sometimes|image|mimes:jpg,jpeg,png,gif|max:2048',
            'offer_banner' => 'sometimes|image|mimes:jpg,jpeg,png,gif|max:2048',
            'minimum_order_amount' => 'sometimes|numeric|min:0',
            'free_delivery_status' => 'sometimes|boolean',
            'free_delivery_over_amount' => 'sometimes|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => Helpers::error_processor($validator)], 403);
        }

        $shop = Shop::where(['seller_id' => $seller['id']])->first();
        
        if (!$shop) {
            return response()->json(['errors' => [['code' => 'shop', 'message' => translate('Shop not found')]]], 404);
        }

        // bottom_banner
        $old_bottom_banner = $shop->bottom_banner;
        $image = $request->file('bottom_banner');
        if ($image != null) {
            $bottom_banner = ImageManager::upload('shop/banner/', 'webp', $request->file('bottom_banner'));
        } else {
            $bottom_banner = $old_bottom_banner;
        }

        // offer_banner
        $old_offer_banner = $shop->offer_banner;
        $image = $request->file('offer_banner');
        if ($image != null) {
            $offer_banner = ImageManager::upload('shop/banner/', 'webp', $request->file('offer_banner'));
        } else {
            $offer_banner = $old_offer_banner;
        }

        // banner
        $old_banner = $shop->banner;
        $image = $request->file('banner');
        if ($image != null) {
            $banner = ImageManager::upload('shop/banner/', 'webp', $request->file('banner'));
        } else {
            $banner = $old_banner;
        }

        // logo
        $old_image = $shop->image;
        $image = $request->file('logo');
        if ($image != null) {
            $imageName = ImageManager::update('shop/', $old_image, 'webp', $request->file('logo'));
        } else {
            $imageName = $old_image;
        }

        if ($request->has('minimum_order_amount')) {
            Seller::where(['id' => $seller['id']])->update([
                'minimum_order_amount' => BackEndHelper::currency_to_usd($request['minimum_order_amount'])
            ]);
        }

        if ($request->has('free_delivery_status')) {
            Seller::where(['id' => $seller['id']])->update([
                'free_delivery_status' => $request['free_delivery_status']
            ]);
        }

        if ($request->has('free_delivery_over_amount')) {
            Seller::where(['id' => $seller['id']])->update([
                'free_delivery_over_amount' => BackEndHelper::currency_to_usd($request['free_delivery_over_amount'])
            ]);
        }

        Shop::where(['seller_id' => $seller['id']])->update([
            'name'           => $request['name'],
            'address'        => $request['address'],
            'contact'        => $request['contact'],
            'image'          => $imageName,
            'banner'         => $banner,
            'bottom_banner'  => $bottom_banner,
            'offer_banner'   => $offer_banner,
            'updated_at'     => now()
        ]);

        // Fetch the updated shop record
        $updatedShop = Shop::where(['seller_id' => $seller['id']])->first();
        // Compute rating and rating_count
        $product_ids = Product::where(['user_id' => $seller['id'], 'added_by' => 'seller'])->pluck('id')->toArray();
        $updatedShop['rating'] = round(Review::whereIn('product_id', $product_ids)->avg('rating'), 3);
        $updatedShop['rating_count'] = Review::whereIn('product_id', $product_ids)->count();

        // Return success message and updated shop data
        return response()->json([
            'message' => translate('Shop info updated successfully!'),
            'shop'    => $updatedShop
        ], 200);
    }

    public function seller_info_update(Request $request)
    {
        $seller = $request->seller;
        
        if (!$seller) {
            return response()->json(['errors' => [['code' => 'seller', 'message' => translate('Invalid seller credential')]]], 403);
        }
        
        $validator = Validator::make($request->all(), [
            'f_name' => 'required|string|max:100',
            'l_name' => 'required|string|max:100',
            'bank_name' => 'nullable|string|max:255',
            'branch' => 'nullable|string|max:255',
            'account_no' => 'nullable|string|max:50',
            'holder_name' => 'nullable|string|max:255',
            'phone' => 'required|string|max:20',
            'password' => 'nullable|string|min:6',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => Helpers::error_processor($validator)], 403);
        }

        $old_image = Seller::where(['id' => $seller['id']])->first()->image;
        $image = $request->file('image');
        if ($image != null) {
            $imageName = ImageManager::update('seller/', $old_image, 'webp', $request->file('image'));
        } else {
            $imageName = $old_image;
        }

        Seller::where(['id' => $seller['id']])->update([
            'f_name'       => $request['f_name'],
            'l_name'       => $request['l_name'],
            'bank_name'    => $request['bank_name'],
            'branch'       => $request['branch'],
            'account_no'   => $request['account_no'],
            'holder_name'  => $request['holder_name'],
            'phone'        => $request['phone'],
            'password'     => $request['password'] != null ? bcrypt($request['password']) : Seller::where(['id' => $seller['id']])->first()->password,
            'image'        => $imageName,
            'updated_at'   => now()
        ]);

        if ($request['password'] != null) {
            Seller::where(['id' => $seller['id']])->update([
                'auth_token' => Str::random('50')
            ]);
        }

        return response()->json(translate('Info updated successfully!'), 200);
    }

    public function withdraw_method_list(Request $request)
    {
        $seller = $request->seller;
        
        if (!$seller) {
            return response()->json(['errors' => [['code' => 'seller', 'message' => translate('Invalid seller credential')]]], 403);
        }
        
        $methods = WithdrawalMethod::ofStatus(1)->get();
        return response()->json($methods, 200);
    }

    public function withdraw_request(Request $request)
    {
        $seller = $request->seller;
        
        if (!$seller) {
            return response()->json(['errors' => [['code' => 'seller', 'message' => translate('Invalid seller credential')]]], 403);
        }
        
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:1',
            'withdraw_method_id' => 'required|exists:withdrawal_methods,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => Helpers::error_processor($validator)], 403);
        }

        $method = WithdrawalMethod::find($request['withdraw_method_id']);
        
        if (!$method) {
            return response()->json(['errors' => [['code' => 'method', 'message' => translate('Withdrawal method not found')]]], 404);
        }
        
        $fields = array_column($method->method_fields, 'input_name');
        $values = $request->all();

        // Validate required fields from withdrawal method
        foreach ($fields as $field) {
            if (!array_key_exists($field, $values) || empty($values[$field])) {
                return response()->json([
                    'errors' => [['code' => 'field_missing', 'message' => translate('Please provide all required information for') . ' ' . $field]]
                ], 403);
            }
        }

        $data['method_name'] = $method->method_name;
        foreach ($fields as $field) {
            if (array_key_exists($field, $values)) {
                $data[$field] = $values[$field];
            }
        }

        $wallet = SellerWallet::where('seller_id', $seller['id'])->first();
        
        if (!$wallet) {
            return response()->json(['errors' => [['code' => 'wallet', 'message' => translate('Wallet not found')]]], 404);
        }

        if (($wallet->total_earning) >= Convert::usd($request['amount']) && $request['amount'] > 1) {
            DB::table('withdraw_requests')->insert([
                'seller_id'                => $seller['id'],
                'amount'                   => Convert::usd($request['amount']),
                'transaction_note'         => null,
                'withdrawal_method_id'     => $request['withdraw_method_id'],
                'withdrawal_method_fields' => json_encode($data),
                'approved'                 => 0,
                'created_at'               => now(),
                'updated_at'               => now()
            ]);

            $wallet->total_earning -= BackEndHelper::currency_to_usd($request['amount']);
            $wallet->pending_withdraw += BackEndHelper::currency_to_usd($request['amount']);
            $wallet->save();

            return response()->json(translate('Withdraw request sent successfully!'), 200);
        }
        return response()->json(['errors' => [['code' => 'amount', 'message' => translate('Invalid withdraw request')]]], 400);
    }

    public function close_withdraw_request(Request $request)
    {
        $seller = $request->seller;
        
        if (!$seller) {
            return response()->json(['errors' => [['code' => 'seller', 'message' => translate('Invalid seller credential')]]], 403);
        }
        
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:withdraw_requests,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => Helpers::error_processor($validator)], 403);
        }

        $withdraw_request = WithdrawRequest::find($request['id']);
        
        // Check if the withdraw request belongs to this seller
        if ($withdraw_request->seller_id != $seller['id']) {
            return response()->json(['errors' => [['code' => 'unauthorized', 'message' => translate('You are not authorized to close this withdraw request')]]], 403);
        }
        
        $wallet = SellerWallet::where('seller_id', $seller['id'])->first();
        
        if (!$wallet) {
            return response()->json(['errors' => [['code' => 'wallet', 'message' => translate('Wallet not found')]]], 404);
        }

        if (isset($withdraw_request) && $withdraw_request->approved == 0) {
            $wallet->total_earning += BackEndHelper::currency_to_usd($withdraw_request['amount']);
            $wallet->pending_withdraw -= BackEndHelper::currency_to_usd($withdraw_request['amount']);
            $wallet->save();
            $withdraw_request->delete();

            return response()->json(translate('Withdraw request has been closed successfully!'), 200);
        }

        return response()->json(['errors' => [['code' => 'invalid', 'message' => translate('Withdraw request is invalid')]]], 400);
    }

    public function transaction(Request $request)
    {
        $seller = $request->seller;
        
        if (!$seller) {
            return response()->json(['errors' => [['code' => 'seller', 'message' => translate('Invalid seller credential')]]], 403);
        }
        
        $validator = Validator::make($request->all(), [
            'status' => 'nullable|in:pending,approve,deny',
            'from' => 'nullable|date_format:Y-m-d',
            'to' => 'nullable|date_format:Y-m-d|after_or_equal:from',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => Helpers::error_processor($validator)], 403);
        }
        
        $status = $request->status;
        if ($status == 'pending') {
            $status = 0;
        } elseif ($status == 'approve') {
            $status = 1;
        } elseif ($status == 'deny') {
            $status = 2;
        }

        $transaction = WithdrawRequest::where('seller_id', $seller['id'])
            ->when(in_array($status, ['0', 1, 2]), function ($query) use ($status) {
                $query->where('approved', $status);
            })
            ->when(($request->from && $request->to), function ($query) use ($request) {
                $query->whereBetween('created_at', [$request->from . ' 00:00:00', $request->to . ' 23:59:59']);
            })
            ->latest()->get();

        return response()->json($transaction, 200);
    }

    public function monthly_earning(Request $request)
    {
        $seller = $request->seller;
        
        if (!$seller) {
            return response()->json(['errors' => [['code' => 'seller', 'message' => translate('Invalid seller credential')]]], 403);
        }
        
        $from = Carbon::now()->startOfYear()->format('Y-m-d');
        $to   = Carbon::now()->endOfYear()->format('Y-m-d');

        $seller_data = '';
        $seller_earnings = OrderTransaction::where([
            'seller_is' => 'seller',
            'seller_id' => $seller['id'],
            'status'    => 'disburse'
        ])
        ->select(
            DB::raw('IFNULL(sum(seller_amount),0) as sums'),
            DB::raw('YEAR(created_at) year, MONTH(created_at) month')
        )
        ->whereBetween('created_at', [$from, $to])
        ->groupBy('year', 'month')
        ->get()
        ->toArray();

        for ($inc = 1; $inc <= 12; $inc++) {
            $default = 0;
            foreach ($seller_earnings as $match) {
                if ($match['month'] == $inc) {
                    $default = $match['sums'];
                }
            }
            $seller_data .= $default . ',';
        }

        return response()->json($seller_data, 200);
    }

    public function monthly_commission_given(Request $request)
    {
        $seller = $request->seller;
        
        if (!$seller) {
            return response()->json(['errors' => [['code' => 'seller', 'message' => translate('Invalid seller credential')]]], 403);
        }
        
        $from = Carbon::now()->startOfYear()->format('Y-m-d');
        $to   = Carbon::now()->endOfYear()->format('Y-m-d');

        $commission_data = '';
        $commission_earnings = OrderTransaction::where([
            'seller_is' => 'seller',
            'seller_id' => $seller['id'],
            'status'    => 'disburse'
        ])->select(
            DB::raw('IFNULL(sum(admin_commission),0) as sums'),
            DB::raw('YEAR(created_at) year, MONTH(created_at) month')
        )
        ->whereBetween('created_at', [$from, $to])
        ->groupby('year', 'month')
        ->get()
        ->toArray();

        for ($inc = 1; $inc <= 12; $inc++) {
            $default = 0;
            foreach ($commission_earnings as $match) {
                if ($match['month'] == $inc) {
                    $default = $match['sums'];
                }
            }
            $commission_data .= $default . ',';
        }

        return response()->json($commission_data, 200);
    }

    public function monthly_orders(Request $request)
    {
        $seller = $request->seller;
        
        if (!$seller) {
            return response()->json(['errors' => [['code' => 'seller', 'message' => translate('Invalid seller credential')]]], 403);
        }
        
        $from = Carbon::now()->startOfYear()->format('Y-m-d');
        $to   = Carbon::now()->endOfYear()->format('Y-m-d');

        $order_data = [];
        $order_counts = Order::where([
            'seller_is' => 'seller',
            'seller_id' => $seller['id']
        ])->select(
            DB::raw('COUNT(*) as count'),
            DB::raw('YEAR(created_at) year, MONTH(created_at) month')
        )
        ->whereBetween('created_at', [$from, $to])
        ->groupby('year', 'month')
        ->get()
        ->toArray();

        for ($inc = 1; $inc <= 12; $inc++) {
            $order_data[$inc] = 0;
            foreach ($order_counts as $match) {
                if ($match['month'] == $inc) {
                    $order_data[$inc] = $match['count'];
                }
            }
        }

        return response()->json(array_values($order_data), 200);
    }

    public function update_cm_firebase_token(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'cm_firebase_token' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => Helpers::error_processor($validator)], 403);
        }
        
        $seller = $request->seller;
        
        if (!$seller) {
            return response()->json(['errors' => [['code' => 'seller', 'message' => translate('Invalid seller credential')]]], 403);
        }

        DB::table('sellers')->where('id', $seller->id)->update([
            'cm_firebase_token' => $request['cm_firebase_token'],
        ]);

        return response()->json(['message' => translate('successfully updated!')], 200);
    }

    public function account_delete(Request $request)
    {
        $seller = $request->seller;
        
        if (!$seller) {
            return response()->json(['errors' => [['code' => 'seller', 'message' => translate('Invalid seller credential')]]], 403);
        }
        
        if ($this->getCountOfOngoingOrderStatus($seller->id) > 0) {
            return response()->json([
                'status'  => 'error',
                'key'     => 'ongoing_order_left',
                'message' => translate('please_make_sure_you_don`t_have_any_ongoing_order')
            ], 403);
        }
        if ($this->checkAdminCommissionAmountClearance($seller->id) === false) {
            return response()->json([
                'status'  => 'error',
                'key'     => 'admin_commission_not_paid',
                'message' => translate('please_clear_all_the_transaction_with_admin')
            ], 403);
        }
        if ($this->getCountOfDeliveryManTransactionNotClearWithSeller($seller->id) > 0) {
            return response()->json([
                'status'  => 'error',
                'key'     => 'delivery_man_transaction_left',
                'message' => translate('please_clear_all_the_transaction_with_delivery_man')
            ], 403);
        }

        if ($seller->id) {
            Coupon::where(['coupon_bearer' => 'seller', 'seller_id' => $seller->id])->delete();
            ImageManager::delete('/seller/' . $seller['image']);
            $seller->delete();
            return response()->json(['message' => translate('Your_account_deleted_successfully!!')], 200);
        } else {
            return response()->json(['errors' => [['code' => 'unauthorized', 'message' => translate('access_denied!!')]]], 403);
        }
    }

    /**
     * Check if the seller has cleared all admin commission.
     * Return TRUE if commission is fully cleared, FALSE otherwise.
     */
    protected function checkAdminCommissionAmountClearance($sellerId): bool
    {
        $adminCommission    = OrderTransaction::where(['seller_is' => 'seller', 'seller_id' => $sellerId])
            ->sum('admin_commission');
        $sellerGivenToAdmin = SellerWallet::where('seller_id', $sellerId)->first()->admin_commission;

        // If total commission from orders is the same as already given to admin, clearance is complete.
        return ($adminCommission == $sellerGivenToAdmin);
    }

    protected function getCountOfDeliveryManTransactionNotClearWithSeller($sellerId): int
    {
        return DeliveryMan::with('wallet')
            ->whereHas('wallet', function ($query) {
                $query->where('current_balance', '!=', 0)
                      ->orWhere('cash_in_hand', '!=', 0);
            })
            ->where('seller_id', $sellerId)
            ->count();
    }

    protected function getCountOfOngoingOrderStatus($sellerId): int
    {
        return Order::whereIn('order_status', ['pending', 'confirmed', 'out_for_delivery', 'processing'])
            ->where(['seller_is' => 'seller', 'seller_id' => $sellerId])
            ->count();
    }

    public function get_earning_statitics(Request $request)
    {
        $seller = $request->seller;
        
        if (!$seller) {
            return response()->json(['errors' => [['code' => 'seller', 'message' => translate('Invalid seller credential')]]], 403);
        }
        
       
        $dateType = $request->type;
        $seller_data_final = [];

        $seller_data = [];
        if ($dateType == 'yearEarn') {
            $number = 12;
            $from   = Carbon::now()->startOfYear()->format('Y-m-d');
            $to     = Carbon::now()->endOfYear()->format('Y-m-d');

            $seller_earnings = OrderTransaction::where([
                'seller_is' => 'seller',
                'seller_id' => $seller->id,
                'status'    => 'disburse'
            ])->select(
                DB::raw('IFNULL(sum(seller_amount),0) as sums'),
                DB::raw('YEAR(created_at) year, MONTH(created_at) month')
            )->whereBetween('created_at', [$from, $to])
            ->groupby('year','month')
            ->get()
            ->toArray();

            for ($inc = 1; $inc <= $number; $inc++) {
                $seller_data[$inc] = 0;
                foreach ($seller_earnings as $match) {
                    if ($match['month'] == $inc) {
                        $seller_data[$inc] = $match['sums'];
                    }
                }
            }

            $seller_data_final = array_values($seller_data);
        } elseif ($dateType == 'MonthEarn') {
            $from   = date('Y-m-01');
            $to     = date('Y-m-t');
            $number = date('d', strtotime($to));

            $seller_earnings = OrderTransaction::where([
                'seller_is' => 'seller',
                'seller_id' => $seller->id,
                'status'    => 'disburse'
            ])->select(
                DB::raw('seller_amount'),
                DB::raw('YEAR(created_at) year, MONTH(created_at) month, DAY(created_at) day')
            )->whereBetween('created_at', [$from, $to])
            ->groupby('day')
            ->get()
            ->toArray();

            for ($inc = 1; $inc <= $number; $inc++) {
                $seller_data[$inc] = 0;
                foreach ($seller_earnings as $match) {
                    if ($match['day'] == $inc) {
                        $seller_data[$inc] += $match['seller_amount'];
                    }
                }
            }
            $seller_data_final = array_values($seller_data);
        } elseif ($dateType == 'WeekEarn') {
            $from = Carbon::now()->startOfWeek()->format('Y-m-d');
            $to   = Carbon::now()->endOfWeek()->format('Y-m-d');

            $number_start = date('d', strtotime($from));
            $number_end   = date('d', strtotime($to));

            $seller_earnings = OrderTransaction::where([
                'seller_is' => 'seller',
                'seller_id' => $seller->id,
                'status'    => 'disburse'
            ])->select(
                DB::raw('seller_amount'),
                DB::raw('YEAR(created_at) year, MONTH(created_at) month, DAY(created_at) day')
            )->whereBetween('created_at', [$from, $to])
            ->get()
            ->toArray();

            for ($inc = $number_start; $inc <= $number_end; $inc++) {
                $seller_data[$inc] = 0;
                foreach ($seller_earnings as $match) {
                    if ($match['day'] == $inc) {
                        $seller_data[$inc] += $match['seller_amount'];
                    }
                }
            }
            $seller_data_final = array_values($seller_data);
        }

        $commission_data = [];
        $commission_data_final = [];
        if ($dateType == 'yearEarn') {
            $number = 12;
            $from   = Carbon::now()->startOfYear()->format('Y-m-d');
            $to     = Carbon::now()->endOfYear()->format('Y-m-d');

            $commission_earnings = OrderTransaction::where([
                'seller_is' => 'seller',
                'seller_id' => $seller->id,
                'status'    => 'disburse'
            ])->select(
                DB::raw('IFNULL(sum(admin_commission),0) as sums'),
                DB::raw('YEAR(created_at) year, MONTH(created_at) month')
            )->whereBetween('created_at', [$from, $to])
            ->groupby('year', 'month')
            ->get()
            ->toArray();

            for ($inc = 1; $inc <= $number; $inc++) {
                $commission_data[$inc] = 0;
                foreach ($commission_earnings as $match) {
                    if ($match['month'] == $inc) {
                        $commission_data[$inc] = $match['sums'];
                    }
                }
            }
            $commission_data_final = array_values($commission_data);
        } elseif ($dateType == 'MonthEarn') {
            $from   = date('Y-m-01');
            $to     = date('Y-m-t');
            $number = date('d', strtotime($to));

            $commission_earnings = OrderTransaction::where([
                'seller_is' => 'seller',
                'seller_id' => $seller->id,
                'status'    => 'disburse'
            ])->select(
                DB::raw('admin_commission'),
                DB::raw('YEAR(created_at) year, MONTH(created_at) month, DAY(created_at) day')
            )->whereBetween('created_at', [$from, $to])
            ->groupby('day')
            ->get()
            ->toArray();

            for ($inc = 1; $inc <= $number; $inc++) {
                $commission_data[$inc] = 0;
                foreach ($commission_earnings as $match) {
                    if ($match['day'] == $inc) {
                        $commission_data[$inc] += $match['admin_commission'];
                    }
                }
            }
            $commission_data_final = array_values($commission_data);
        } elseif ($dateType == 'WeekEarn') {
            $from = Carbon::now()->startOfWeek()->format('Y-m-d');
            $to   = Carbon::now()->endOfWeek()->format('Y-m-d');

            $number_start = date('d', strtotime($from));
            $number_end   = date('d', strtotime($to));

            $commission_earnings = OrderTransaction::where([
                'seller_is' => 'seller',
                'seller_id' => $seller->id,
                'status'    => 'disburse'
            ])->select(
                DB::raw('admin_commission'),
                DB::raw('YEAR(created_at) year, MONTH(created_at) month, DAY(created_at) day')
            )->whereBetween('created_at', [$from, $to])
            ->get()
            ->toArray();

            for ($inc = $number_start; $inc <= $number_end; $inc++) {
                $commission_data[$inc] = 0;
                foreach ($commission_earnings as $match) {
                    if ($match['day'] == $inc) {
                        $commission_data[$inc] += $match['admin_commission'];
                    }
                }
            }
            $commission_data_final = array_values($commission_data);
        }

        $data = [
            'seller_earn'     => $seller_data_final,
            'commission_earn' => $commission_data_final
        ];

        return response()->json($data, 200);
    }

    public function order_statistics(Request $request)
    {
        $seller = $request->seller;
        
        if (!$seller) {
            return response()->json(['errors' => [['code' => 'seller', 'message' => translate('Invalid seller credential')]]], 403);
        }
        
    
        
        $today       = $request->statistics_type == 'today' ? 1 : 0;
        $this_month  = $request->statistics_type == 'this_month' ? 1 : 0;

        $pending = Order::where(['seller_is' => 'seller', 'seller_id' => $seller->id])
            ->where(['order_status' => 'pending'])
            ->when($today, function ($query) {
                return $query->whereDate('created_at', Carbon::today());
            })
            ->when($this_month, function ($query) {
                return $query->whereMonth('created_at', Carbon::now());
            })
            ->count();

        $confirmed = Order::where(['seller_is' => 'seller', 'seller_id' => $seller->id])
            ->where(['order_status' => 'confirmed'])
            ->when($today, function ($query) {
                return $query->whereDate('created_at', Carbon::today());
            })
            ->when($this_month, function ($query) {
                return $query->whereMonth('created_at', Carbon::now());
            })
            ->count();

        $processing = Order::where(['seller_is' => 'seller', 'seller_id' => $seller->id])
            ->where(['order_status' => 'processing'])
            ->when($today, function ($query) {
                return $query->whereDate('created_at', Carbon::today());
            })
            ->when($this_month, function ($query) {
                return $query->whereMonth('created_at', Carbon::now());
            })
            ->count();

        $out_for_delivery = Order::where(['seller_is' => 'seller', 'seller_id' => $seller->id])
            ->where(['order_status' => 'out_for_delivery'])
            ->when($today, function ($query) {
                return $query->whereDate('created_at', Carbon::today());
            })
            ->when($this_month, function ($query) {
                return $query->whereMonth('created_at', Carbon::now());
            })
            ->count();

        $delivered = Order::where(['seller_is' => 'seller', 'seller_id' => $seller->id])
            ->where(['order_status' => 'delivered'])
            ->when($today, function ($query) {
                return $query->whereDate('created_at', Carbon::today());
            })
            ->when($this_month, function ($query) {
                return $query->whereMonth('created_at', Carbon::now());
            })
            ->count();

        $canceled = Order::where(['seller_is' => 'seller', 'seller_id' => $seller->id])
            ->where(['order_status' => 'canceled'])
            ->when($today, function ($query) {
                return $query->whereDate('created_at', Carbon::today());
            })
            ->when($this_month, function ($query) {
                return $query->whereMonth('created_at', Carbon::now());
            })
            ->count();

        $returned = Order::where(['seller_is' => 'seller', 'seller_id' => $seller->id])
            ->where(['order_status' => 'returned'])
            ->when($today, function ($query) {
                return $query->whereDate('created_at', Carbon::today());
            })
            ->when($this_month, function ($query) {
                return $query->whereMonth('created_at', Carbon::now());
            })
            ->count();

        $failed = Order::where(['seller_is' => 'seller', 'seller_id' => $seller->id])
            ->where(['order_status' => 'failed'])
            ->when($today, function ($query) {
                return $query->whereDate('created_at', Carbon::today());
            })
            ->when($this_month, function ($query) {
                return $query->whereMonth('created_at', Carbon::now());
            })
            ->count();

        $data = [
            'pending'         => $pending,
            'confirmed'       => $confirmed,
            'processing'      => $processing,
            'out_for_delivery'=> $out_for_delivery,
            'delivered'       => $delivered,
            'canceled'        => $canceled,
            'returned'        => $returned,
            'failed'          => $failed
        ];

        return response()->json($data, 200);
    }

    public function language_change(Request $request)
    {
        $seller = $request->seller;
        
        if (!$seller) {
            return response()->json(['errors' => [['code' => 'seller', 'message' => translate('Invalid seller credential')]]], 403);
        }
        
        $validator = Validator::make($request->all(), [
            'current_language' => 'required|string|max:10',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => Helpers::error_processor($validator)], 403);
        }
        
        $seller->app_language = $request->current_language;
        $seller->save();

        return response()->json(['message' => translate('Successfully change')], 200);
    }

    // -----------------------------------------------------
    // Additional Private/Protected Helper Methods
    // -----------------------------------------------------

    /**
     * Example aggregator to build array sums (month or day based) for earnings or commission.
     * $items is a collection of rows that have "month" or "day" fields, plus the target $column.
     */
    private function dateWiseSum($items, $range, $type, $column = 'amount'): array
    {
        $data = [];
        foreach ($range as $index) {
            $data[$index] = 0; // Default zero
        }

        foreach ($items as $item) {
            if ($type === 'month') {
                $month = (int) $item->month;
                $data[$month] = ($data[$month] ?? 0) + $item->{$column};
            } elseif ($type === 'day') {
                $day = (int) $item->day;
                $data[$day] = ($data[$day] ?? 0) + $item->{$column};
            }
        }

        return $data;
    }

    /**
     * Retrieve vendor earnings for the given date range. 
     */
    private function getVendorEarning(int $vendorId, string $from, string $to, array $range, string $type): array
    {
        // Query all disbursed transactions for the seller
        $earnings = OrderTransaction::where([
                'seller_is' => 'seller',
                'seller_id' => $vendorId,
                'status'    => 'disburse'
            ])
            ->whereBetween('created_at', [$from, $to])
            ->select(
                DB::raw('seller_amount as amount'),
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month'),
                DB::raw('DAY(created_at) as day')
            )
            ->get();

        // Summation
        return $this->dateWiseSum($earnings, $range, $type, 'amount');
    }

    /**
     * Retrieve total admin commission from the seller for the given date range.
     */
    private function getAdminCommission(int $vendorId, string $from, string $to, array $range, string $type): array
    {
        $commissions = OrderTransaction::where([
                'seller_is' => 'seller',
                'seller_id' => $vendorId,
                'status'    => 'disburse'
            ])
            ->whereBetween('created_at', [$from, $to])
            ->select(
                DB::raw('admin_commission as amount'),
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month'),
                DB::raw('DAY(created_at) as day')
            )
            ->get();

        return $this->dateWiseSum($commissions, $range, $type, 'amount');
    }

    /**
     * Example method to return an array of order statuses with count.
     *
     * @param  int    $vendorId
     * @param  string $type ('overall','today','thisMonth')
     * @return array
     */
    private function getOrderStatusArray(int $vendorId, string $type): array
    {
        $statuses = ['pending','confirmed','processing','out_for_delivery','delivered','canceled','returned','failed'];
        $statusWiseOrders = [];

        foreach ($statuses as $status) {
            $query = Order::where([
                'seller_is'   => 'seller',
                'seller_id'   => $vendorId,
                'order_status'=> $status
            ]);

            if ($type === 'today') {
                $query->whereDate('created_at', Carbon::today());
            } elseif ($type === 'thisMonth') {
                $query->whereMonth('created_at', Carbon::now()->month);
            }
            // 'overall' does not add date constraints

            $statusWiseOrders[$status] = $query->count();
        }

        return $statusWiseOrders;
    }
}
