<?php

namespace App\Http\Controllers\Customer;

use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\PaymentRequest;
use App\Models\User;
use App\Utils\Helpers;
use App\Http\Controllers\Controller;
use App\Library\Payer;
use App\Library\Payment as PaymentInfo;
use App\Library\Receiver;
use App\Models\ShippingAddress;
use App\Models\ShippingType;
use App\Models\BusinessSetting;
use App\Models\Cart;
use App\Models\CartShipping;
use App\Models\Currency;
use App\Traits\Payment;
use App\Utils\CartManager;
use App\Utils\Convert;
use App\Utils\OrderManager;
use Brian2694\Toastr\Facades\Toastr;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Redirector;
use Illuminate\Support\Facades\Validator;


use function App\Utils\currency_converter;

class PaymentController extends Controller
{
    use Payment;

    public function payment(Request $request): JsonResponse|Redirector|RedirectResponse
    {
        // Get customer information based on the request (could be session or API token-based).
        $user = Helpers::get_customer($request);

        // Initialize an array to hold additional data for the order.
        $orderAdditionalData = [];

        // Validate the 'payment_method' and 'payment_platform' fields are required.
        $validator = Validator::make($request->all(), [
            'payment_method' => 'required',
            'payment_platform' => 'required',
        ]);

        // Conditionally require 'customer_id' if the request is coming from an app.
        $validator->sometimes('customer_id', 'required', function ($input) {
            return in_array($input->payment_request_from, ['app']);
        });

        // Conditionally require 'is_guest' field if the request is coming from an app.
        $validator->sometimes('is_guest', 'required', function ($input) {
            return in_array($input->payment_request_from, ['app']);
        });

        // If validation fails:
        if ($validator->fails()) {
            // For API requests: Return JSON response with validation errors.
            if (in_array($request['payment_request_from'], ['app'])) {
                return response()->json(['errors' => Helpers::error_processor($validator)], 403);
            } else {
                // For non-API (web): Show error message and redirect back to the previous page.
                $errors = Helpers::error_processor($validator);
                foreach ($errors as $value) {
                    Toastr::error(translate($value['message']));
                }
                return back();
            }
        }

        // Get the cart group IDs from the request and filter only 'checked' items.
        $cartGroupIds = CartManager::get_cart_group_ids(request: $request, type: 'checked');

        // Retrieve the cart items based on the cart group IDs.
        $carts = Cart::whereIn('cart_group_id', $cartGroupIds)->where(['is_checked' => 1])->get();

        // Check if products in the cart are still in stock.
        $productStockCheck = CartManager::product_stock_check($carts);

        // If out of stock, handle error for API request:
        if (!$productStockCheck && in_array($request['payment_request_from'], ['app'])) {
            return response()->json(['errors' => ['code' => 'product-stock', 'message' => 'The following items in your cart are currently out of stock']], 403);
        } elseif (!$productStockCheck) {
            // For non-API requests: Show error and redirect to cart page.
            Toastr::error(translate('the_following_items_in_your_cart_are_currently_out_of_stock'));
            return redirect()->route('shop-cart');
        }

        // Verify that the order meets the minimum order amount requirement.
        $verifyStatus = OrderManager::minimum_order_amount_verify($request);

        // If the order does not meet the minimum, handle error for API request:
        if ($verifyStatus['status'] == 0 && in_array($request['payment_request_from'], ['app'])) {
            return response()->json(['errors' => ['code' => 'Check the minimum order amount requirement']], 403);
        } elseif ($verifyStatus['status'] == 0) {
            // For non-API requests: Show info message and redirect to cart page.
            Toastr::info('Check the minimum order amount requirement');
            return redirect()->route('shop-cart');
        }

        // Additional checks for API requests, focusing on shipping details:
        if (in_array($request['payment_request_from'], ['app'])) {
            // Get the shipping method (could be 'inhouse_shipping' or external).
            $shippingMethod = Helpers::get_business_settings('shipping_method');
            $physicalProductExist = false;

            // Loop through each cart item.
            foreach ($carts as $cart) {
                // Check if there are physical products in the cart.
                if ($cart->product_type == 'physical') {
                    $physicalProductExist = true;
                }

                // Determine the shipping type based on whether it's inhouse or seller's shipping.
                if ($shippingMethod == 'inhouse_shipping') {
                    $adminShipping = ShippingType::where('seller_id', 0)->first();
                    $getShippingType = isset($adminShipping) ? $adminShipping->shipping_type : 'order_wise';
                } else {
                    if ($cart->seller_is == 'admin') {
                        $adminShipping = ShippingType::where('seller_id', 0)->first();
                        $getShippingType = isset($adminShipping) ? $adminShipping->shipping_type : 'order_wise';
                    } else {
                        $seller_shipping = ShippingType::where('seller_id', $cart->seller_id)->first();
                        $getShippingType = isset($seller_shipping) ? $seller_shipping->shipping_type : 'order_wise';
                    }
                }

                // If shipping is 'order_wise' but no shipping info exists, return an error for API.
                if ($getShippingType == 'order_wise') {
                    $cartShipping = CartShipping::where('cart_group_id', $cart->cart_group_id)->first();
                    if (!isset($cartShipping) && $physicalProductExist) {
                        return response()->json(['errors' => ['code' => 'shipping-method', 'message' => 'Data not found']], 403);
                    }
                }
            }

            // If user is 'offline' and requests account creation during checkout:
            if (($user == 'offline' && $request['is_check_create_account'])) {
                // Call API process to register a new customer.
                $getAPIProcess = self::getRegisterNewCustomerAPIProcess($request);

                // If registration fails, return a JSON error response.
                if ($getAPIProcess['status'] == 0) {
                    return response()->json(['message' => translate('Already_registered ')], 403);
                }

                // Add new customer info to order additional data.
                $orderAdditionalData += [
                    'new_customer_info' => $getAPIProcess['data'],
                ];
            }
        }

        // If the payment method is abapay, process it directly without redirection

        if ($request->payment_method === 'abapay' && !in_array($request['payment_request_from'], ['app'])) {
            // Generate the payment request data without redirection
            $paymentData = $this->getCustomerPaymentRequest($request, $orderAdditionalData);

            return response()->json([
                'message' => 'Payment data fetched successfully',
                'payment_data' => $paymentData,
                'redirect_link' => $paymentData,
            ], 200);
        }
        // Generate the payment request link.
        $redirectLink = $this->getCustomerPaymentRequest($request, $orderAdditionalData);


        // Return JSON response with the payment redirect link for API requests.
        if (in_array($request['payment_request_from'], ['app'])) {
            return response()->json([
                'redirect_link' => $redirectLink,
                'new_user' => isset($orderAdditionalData['new_customer_info']) && $orderAdditionalData['new_customer_info'] != null ? 1 : 0,
            ], 200);
        } else {
            // For non-API requests: Redirect the user to the payment link.
            return redirect($redirectLink);
        }
    }


    function getRegisterNewCustomerAPIProcess($request)
    {
        $newCustomerRegister = [];
        $shippingAddress = ShippingAddress::where(['customer_id' => $request['guest_id'], 'is_guest' => 1, 'id' => $request->input('address_id')])->first();
        if ($request->has('address_id') && $request['address_id'] && $shippingAddress) {
            if (User::where(['email' => $shippingAddress['email']])->orWhere(['phone' => $shippingAddress['phone']])->first()) {
                return ['status' => 0];
            } else {
                $newCustomerRegister = [
                    'status' => 1,
                    'data' => self::getRegisterNewCustomer(
                        request: $request,
                        address: $shippingAddress,
                        shippingId: $request['address_id'],
                        billingId: $request->has('billing_address_id') && $request['billing_address_id'] ? $request['billing_address_id'] : null
                    )
                ];
            }
        }

        $billingAddress = ShippingAddress::where(['customer_id' => $request['guest_id'], 'is_guest' => 1, 'id' => $request->input('billing_address_id')])->first();
        if ($request['address_id'] == null && $request->has('billing_address_id') && $request['billing_address_id'] && $billingAddress) {
            if (User::where(['email' => $billingAddress['email']])->orWhere(['phone' => $billingAddress['phone']])->first()) {
                return ['status' => 0];
            } else {
                $newCustomerRegister = [
                    'status' => 1,
                    'data' => self::getRegisterNewCustomer(
                        request: $request,
                        address: $billingAddress,
                        shippingId: null,
                        billingId: $request['billing_address_id'],
                    )
                ];
            }
        }

        return $newCustomerRegister;
    }


    function getRegisterNewCustomer($request, $address, $shippingId = null, $billingId = null): array
    {
        return [
            'name' => $address['contact_person_name'],
            'f_name' => $address['contact_person_name'],
            'l_name' => '',
            'email' => $address['email'],
            'phone' => $address['phone'],
            'is_active' => 1,
            'password' => $request['password'],
            'referral_code' => Helpers::generate_referer_code(),
            'shipping_id' => $shippingId,
            'billing_id' => $billingId,
        ];
    }

    public function success(Request $request): JsonResponse
    {
        return response()->json(['message' => 'Payment succeeded'], 200);
    }

    public function fail(): JsonResponse
    {
        return response()->json(['message' => 'Payment failed'], 403);
    }

    public function web_payment_success(Request $request)
    {
        if($request->flag == 'success') {
            if (session()->has('payment_mode') && session('payment_mode') == 'app') {
                return response()->json(['message' => 'Payment succeeded'], 200);
            } else {
                Toastr::success(translate('Payment_success'));
                $isNewCustomerInSession = session('newCustomerRegister');
                session()->forget('newCustomerRegister');
                return view(VIEW_FILE_NAMES['order_complete'], compact('isNewCustomerInSession'));
            }
        }else{
            if(session()->has('payment_mode') && session('payment_mode') == 'app'){
                return response()->json(['message' => 'Payment failed'], 403);
            }else{
                Toastr::error(translate('Payment_failed').'!');
                return redirect(url('/'));
            }
        }

    }

    public function getCustomerPaymentRequest(Request $request, $orderAdditionalData = []): mixed
    {
        $additionalData = [
            'business_name' => getWebConfig(name: 'company_name'),
            'business_logo' => getStorageImages(path: getWebConfig('company_web_logo'), type:'shop'),
            'payment_mode' => $request->has('payment_platform') ? $request['payment_platform'] : 'web',
        ];

        $user = Helpers::get_customer($request);

        $getGuestId = $request['is_guest'] ? $request['guest_id'] : (session('guest_id') ?? 0);
        $isGuestUser = ($user == 'offline') ? 1 : 0;
        $getCustomerID = null;
        $isGuestUserInOrder = $isGuestUser;
        if ($user == 'offline' && session('newCustomerRegister')) {
            $additionalData['new_customer_info'] = session('newCustomerRegister') ?? null;
            $additionalData['customer_id'] = $getGuestId;
            $additionalData['address_id'] = session('newCustomerRegister')['address_id'] ?? null;
            $additionalData['billing_address_id'] = session('newCustomerRegister')['billing_address_id'] ?? null;
            $getCustomerID = $getGuestId;
            $isGuestUserInOrder = 0;
        } elseif ($user == 'offline' && !session('newCustomerRegister') && isset($orderAdditionalData['new_customer_info'])) {
            $additionalData['new_customer_info'] = $orderAdditionalData['new_customer_info'];
            $getCustomerID = $getGuestId;
            $isGuestUserInOrder = 0;
        } elseif ($user != 'offline') {
            $getCustomerID = 0;
            $isGuestUserInOrder = 0;
        }

        $additionalData['is_guest'] = $isGuestUser;
        if (in_array($request['payment_request_from'], ['app'])) {
            $additionalData['customer_id'] = $request['customer_id'];
            $additionalData['is_guest'] = $request['is_guest'];
            $additionalData['order_note'] = $request['order_note'];
            $additionalData['address_id'] = $request['address_id'];
            $additionalData['billing_address_id'] = $request['billing_address_id'];
            $additionalData['coupon_code'] = $request['coupon_code'];
            $additionalData['coupon_discount'] = $request['coupon_discount'];
            $additionalData['payment_request_from'] = $request['payment_request_from'];
        } else {
            $additionalData['customer_id'] = $user != 'offline' ? $user->id : $getCustomerID;
            $additionalData['order_note'] = session('order_note') ?? null;
            $additionalData['address_id'] = session('address_id') ?? 0;
            $additionalData['billing_address_id'] = session('billing_address_id') ?? 0;

            $additionalData['coupon_code'] = session('coupon_code') ?? null;
            $additionalData['coupon_discount'] = session('coupon_discount') ?? 0;
            $additionalData['payment_request_from'] = $request['payment_mode'] ?? 'web';
        }
        $additionalData['new_customer_id'] = $getCustomerID;
        $additionalData['is_guest_in_order'] = $isGuestUserInOrder;

        $currency_model = Helpers::get_business_settings('currency_model');
        if ($currency_model == 'multi_currency') {
            $currency_code = 'USD';
        } else {
            $default = getWebConfig(name: 'system_default_currency');
            $currency_code = Currency::find($default)->code;
        }

        if (in_array($request['payment_request_from'], ['app'])) {
            $cart_group_ids = CartManager::get_cart_group_ids(request: $request, type: 'checked');
            $cart_amount = 0;
            $shippingCostSaved = 0;
            foreach ($cart_group_ids as $group_id) {
                $cart_amount += CartManager::api_cart_grand_total($request, $group_id);
                $shippingCostSaved += CartManager::get_shipping_cost_saved_for_free_delivery(groupId: $group_id, type: 'checked');
            }
            $payment_amount = $cart_amount - $request['coupon_discount'] - $shippingCostSaved;
        } else {
            $discount = session()->has('coupon_discount') ? session('coupon_discount') : 0;
            $orderWiseShippingDiscount = CartManager::order_wise_shipping_discount();
            $shippingCostSaved = CartManager::get_shipping_cost_saved_for_free_delivery(type: 'checked');
            $payment_amount = CartManager::cart_grand_total(type: 'checked') - $discount - $orderWiseShippingDiscount - $shippingCostSaved;
        }

        $customer = Helpers::get_customer($request);

        if ($customer == 'offline') {
            $address = ShippingAddress::where(['customer_id' => $request['customer_id'], 'is_guest' => 1])->latest()->first();
            if ($address) {
                $payer = new Payer(
                    $address->contact_person_name,
                    $address->email,
                    $address->phone,
                    ''
                );
            } else {
                $payer = new Payer(
                    'Contact person name',
                    '',
                    '',
                    ''
                );
            }
        } else {
            $payer = new Payer(
                $customer['f_name'] . ' ' . $customer['l_name'],
                $customer['email'],
                $customer['phone'],
                ''
            );
            if (empty($customer['phone'])) {
                Toastr::error(translate('please_update_your_phone_number'));
                return route('checkout-payment');
            }
        }

        $paymentInfo = new PaymentInfo(
            success_hook: 'digital_payment_success',
            failure_hook: 'digital_payment_fail',
            currency_code: $currency_code,
            payment_method: $request['payment_method'],
            payment_platform: $request['payment_platform'],
            payer_id: $customer == 'offline' ? $request['customer_id'] : $customer['id'],
            receiver_id: '100',
            additional_data: $additionalData,
            payment_amount: $payment_amount,
            external_redirect_link: $request['payment_platform'] == 'web' ? $request['external_redirect_link'] : null,
            attribute: 'order',
            attribute_id: idate("U")
        );

        $receiverInfo = new Receiver('receiver_name', 'example.png');
        return $this->generate_link($payer, $paymentInfo, $receiverInfo);
    }

    public function customer_add_to_fund_request(Request $request): JsonResponse|Redirector|RedirectResponse
    {
        if (Helpers::get_business_settings('add_funds_to_wallet') != 1) {
            if (in_array($request['payment_request_from'], ['app'])) {
                return response()->json(['message' => 'Add funds to wallet is deactivated'], 403);
            }
            Toastr::error(translate('add_funds_to_wallet_is_deactivated'));
            return back();
        }

        $validator = Validator::make($request->all(), [
            'amount' => 'required',
            'payment_method' => 'required',
            'payment_platform' => 'required',
        ]);

        if ($validator->fails()) {
            $errors = Helpers::error_processor($validator);
            if (in_array($request->payment_request_from, ['app'])) {
                return response()->json(['errors' => $errors]);
            } else {
                foreach ($errors as $value) {
                    Toastr::error(translate($value['message']));
                }
                return back();
            }
        }

        $currency_model = Helpers::get_business_settings('currency_model');
        if ($currency_model == 'multi_currency') {
            $default_currency = Currency::find(Helpers::get_business_settings('system_default_currency'));
            $currency_code = $default_currency['code'];
            $current_currency = $request->current_currency_code ?? session('currency_code');
        } else {
            $default = BusinessSetting::where(['type' => 'system_default_currency'])->first()->value;
            $currency_code = Currency::find($default)->code;
            $current_currency = $currency_code;
        }


        $minimum_add_fund_amount = Helpers::get_business_settings('minimum_add_fund_amount') ?? 0;
        $maximum_add_fund_amount = Helpers::get_business_settings('maximum_add_fund_amount') ?? 0;

        if (!(Convert::usdPaymentModule($request->amount, $current_currency) >= Convert::usdPaymentModule($minimum_add_fund_amount, 'USD')) || !(Convert::usdPaymentModule($request->amount, $current_currency) <= Convert::usdPaymentModule($maximum_add_fund_amount, 'USD'))) {
            $errors = [
                'minimum_amount' => $minimum_add_fund_amount ?? 0,
                'maximum_amount' => $maximum_add_fund_amount ?? 1000,
            ];
            if (in_array($request->payment_request_from, ['app'])) {
                return response()->json($errors, 202);
            } else {
                Toastr::error(translate('the_amount_needs_to_be_between') . ' ' . currency_converter($minimum_add_fund_amount) . ' - ' . currency_converter($maximum_add_fund_amount));
                return back();
            }
        }

        $additional_data = [
            'business_name' => BusinessSetting::where(['type' => 'company_name'])->first()->value,
            'business_logo' => getWebConfig('company_web_logo')['path'],
            'payment_mode' => $request->has('payment_platform') ? $request->payment_platform : 'web',
        ];

        $customer = Helpers::get_customer($request);

        if (in_array($request->payment_request_from, ['app'])) {
            $additional_data['customer_id'] = $customer->id;
            $additional_data['payment_request_from'] = $request->payment_request_from;
        }

        $payer = new Payer(
            $customer->f_name . ' ' . $customer->l_name,
            $customer['email'],
            $customer->phone,
            ''
        );

        $payment_info = new PaymentInfo(
            success_hook: 'add_fund_to_wallet_success',
            failure_hook: 'add_fund_to_wallet_fail',
            currency_code: $currency_code,
            payment_method: $request->payment_method,
            payment_platform: $request->payment_platform,
            payer_id: $customer->id,
            receiver_id: '100',
            additional_data: $additional_data,
            payment_amount: Convert::usdPaymentModule($request->amount, $current_currency),
            external_redirect_link: $request->payment_platform == 'web' ? $request->external_redirect_link : null,
            attribute: 'add_funds_to_wallet',
            attribute_id: idate("U")
        );

        $receiver_info = new Receiver('receiver_name', 'example.png');


        $redirect_link = Payment::generate_link($payer, $payment_info, $receiver_info);


        if (in_array($request['payment_request_from'], ['app'])) {
            return response()->json(['redirect_link' => $redirect_link], 200);
        } else {
            return redirect($redirect_link);
        }
    }
}
