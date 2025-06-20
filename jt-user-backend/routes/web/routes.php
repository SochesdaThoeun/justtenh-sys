<?php

use App\Enums\ViewPaths\Web\Chatting;
use App\Enums\ViewPaths\Web\ProductCompare;
use App\Enums\ViewPaths\Web\ShopFollower;
use App\Http\Controllers\Customer\SystemController;
use App\Http\Controllers\Web\CartController;
use App\Http\Controllers\Web\ChattingController;
use App\Http\Controllers\Web\CouponController;
use App\Http\Controllers\Web\DigitalProductDownloadController;
use App\Http\Controllers\Web\HomeController;
use App\Http\Controllers\Web\ProductCompareController;
use App\Http\Controllers\Web\ProductDetailsController;
use App\Http\Controllers\Web\ProductListController;
use App\Http\Controllers\Web\Shop\ShopFollowerController;
use App\Http\Controllers\Web\ShopViewController;
use App\Http\Controllers\Web\UserProfileController;
use App\Http\Controllers\Web\WebController;
use Illuminate\Support\Facades\Route;
use App\Enums\ViewPaths\Web\Pages;
use App\Enums\ViewPaths\Web\Review;
use App\Enums\ViewPaths\Web\UserLoyalty;
use App\Http\Controllers\Web\CurrencyController;
use App\Http\Controllers\Web\PageController;
use App\Http\Controllers\Web\ReviewController;
use App\Http\Controllers\Web\UserLoyaltyController;
use App\Http\Controllers\Payment_Methods\SslCommerzPaymentController;
use App\Http\Controllers\Payment_Methods\StripePaymentController;
use App\Http\Controllers\Payment_Methods\PaymobController;
use App\Http\Controllers\Payment_Methods\FlutterwaveV3Controller;
use App\Http\Controllers\Payment_Methods\PaytmController;
use App\Http\Controllers\Payment_Methods\PaypalPaymentController;
use App\Http\Controllers\Payment_Methods\PaytabsController;
use App\Http\Controllers\Payment_Methods\LiqPayController;
use App\Http\Controllers\Payment_Methods\RazorPayController;
use App\Http\Controllers\Payment_Methods\SenangPayController;
use App\Http\Controllers\Payment_Methods\MercadoPagoController;
use App\Http\Controllers\Payment_Methods\BkashPaymentController;
use App\Http\Controllers\Payment_Methods\PaystackController;
use App\Http\Controllers\Payment_Methods\AbaPayController;
use App\Http\Controllers\SharedController;
use App\Http\Controllers\Web\UserWalletController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::controller(WebController::class)->group(function () {
    Route::get('maintenance-mode', 'maintenance_mode')->name('maintenance-mode');
});

Route::group(['namespace' => 'Web', 'middleware' => ['maintenance_mode', 'guestCheck']], function () {
    Route::group(['prefix' => 'product-compare', 'as' => 'product-compare.'], function () {
        Route::controller(ProductCompareController::class)->group(function () {
            Route::get(ProductCompare::INDEX[URI], 'index')->name('index');
            Route::post(ProductCompare::INDEX[URI], 'add');
            Route::get(ProductCompare::DELETE[URI], 'delete')->name('delete');
            Route::get(ProductCompare::DELETE_ALL[URI], 'deleteAllCompareProduct')->name('delete-all');
        });
    });
    Route::post(ShopFollower::SHOP_FOLLOW[URI], [ShopFollowerController::class, 'followOrUnfollowShop'])->name('shop-follow');
});

Route::group(['namespace' => 'Web', 'middleware' => ['maintenance_mode', 'guestCheck']], function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');

    Route::controller(WebController::class)->group(function () {
        Route::get('quick-view', 'getQuickView')->name('quick-view');
        Route::get('searched-products', 'getSearchedProducts')->name('searched-products');
    });

    Route::group(['middleware' => ['customer']], function () {
        Route::controller(ReviewController::class)->group(function () {
            Route::post(Review::ADD[URI], 'add')->name('review.store');
            Route::post(Review::ADD_DELIVERYMAN_REVIEW[URI], 'addDeliveryManReview')->name('submit-deliveryman-review');
            Route::post(Review::DELETE_REVIEW_IMAGE[URI], 'deleteReviewImage')->name('delete-review-image');
        });
    });

    Route::controller(WebController::class)->group(function () {
        Route::get('checkout-details', 'checkout_details')->name('checkout-details');
        Route::get('checkout-shipping', 'checkout_shipping')->name('checkout-shipping');
        Route::get('checkout-payment', 'checkout_payment')->name('checkout-payment');
        Route::get('checkout-review', 'checkout_review')->name('checkout-review');
        Route::get('checkout-complete', 'getCashOnDeliveryCheckoutComplete')->name('checkout-complete');
        Route::post('offline-payment-checkout-complete', 'getOfflinePaymentCheckoutComplete')->name('offline-payment-checkout-complete');
        Route::get('order-placed', 'order_placed')->name('order-placed');
        Route::get('shop-cart', 'shop_cart')->name('shop-cart');
        Route::post('order_note', 'order_note')->name('order_note');
        Route::get('digital-product-download/{id}', 'getDigitalProductDownload')->name('digital-product-download');
        Route::post('digital-product-download-otp-verify', 'getDigitalProductDownloadOtpVerify')->name('digital-product-download-otp-verify');
        Route::post('digital-product-download-otp-reset', 'getDigitalProductDownloadOtpReset')->name('digital-product-download-otp-reset');
        Route::get('pay-offline-method-list', 'pay_offline_method_list')->name('pay-offline-method-list')->middleware('guestCheck');

        //wallet payment
        Route::get('checkout-complete-wallet', 'checkout_complete_wallet')->name('checkout-complete-wallet');

        Route::post('subscription', 'subscription')->name('subscription');
        Route::get('search-shop', 'search_shop')->name('search-shop');

        Route::get('categories', 'getAllCategoriesView')->name('categories');
        Route::get('category-ajax/{id}', 'categories_by_category')->name('category-ajax');

        Route::get('brands', 'getAllBrandsView')->name('brands');
        Route::get('vendors', 'getAllVendorsView')->name('vendors');
        Route::get('seller-profile/{id}', 'seller_profile')->name('seller-profile');

        Route::get('flash-deals/{id}', 'getFlashDealsView')->name('flash-deals');
    });

    Route::controller(PageController::class)->group(function () {
        Route::get(Pages::ABOUT_US[URI], 'getAboutUsView')->name('about-us');
        Route::get(Pages::CONTACTS[URI], 'getContactView')->name('contacts');
        Route::get(Pages::HELP_TOPIC[URI], 'getHelpTopicView')->name('helpTopic');
        Route::get(Pages::REFUND_POLICY[URI], 'getRefundPolicyView')->name('refund-policy');
        Route::get(Pages::RETURN_POLICY[URI], 'getReturnPolicyView')->name('return-policy');
        Route::get(Pages::PRIVACY_POLICY[URI], 'getPrivacyPolicyView')->name('privacy-policy');
        Route::get(Pages::CANCELLATION_POLICY[URI], 'getCancellationPolicyView')->name('cancellation-policy');
        Route::get(Pages::TERMS_AND_CONDITION[URI], 'getTermsAndConditionView')->name('terms');
    });

    Route::controller(ProductDetailsController::class)->group(function () {
        Route::get('/product/{slug}', 'index')->name('product');
    });

    Route::controller(ProductListController::class)->group(function () {
        Route::get('products', 'products')->name('products');
    });

    Route::post('ajax-filter-products', [ShopViewController::class, 'ajax_filter_products'])->name('ajax-filter-products'); // Theme fashion, ALl purpose

    Route::controller(WebController::class)->group(function () {
        Route::get('orderDetails', 'orderdetails')->name('orderdetails');
        Route::get('discounted-products', 'discounted_products')->name('discounted-products');
        Route::post('/products-view-style', 'product_view_style')->name('product_view_style');

        Route::post('review-list-product', 'review_list_product')->name('review-list-product');
        Route::post('review-list-shop', 'getShopReviewList')->name('review-list-shop'); // theme fashion
        //Chat with seller from product details
        Route::get('chat-for-product', 'chat_for_product')->name('chat-for-product');

        Route::get('wishlists', 'viewWishlist')->name('wishlists')->middleware('customer');
        Route::post('store-wishlist', 'storeWishlist')->name('store-wishlist');
        Route::post('delete-wishlist', 'deleteWishlist')->name('delete-wishlist');
        Route::get('delete-wishlist-all', 'deleteAllWishListItems')->name('delete-wishlist-all')->middleware('customer');

        // end theme_aster compare list
        Route::get('searched-products-for-compare', 'getSearchedProductsForCompareList')->name('searched-products-compare'); // theme fashion compare list
    });

    Route::controller(CurrencyController::class)->group(function () {
        Route::post('/currency', 'changeCurrency')->name('currency.change');
    });

    // Support Ticket
    Route::controller(UserProfileController::class)->group(function () {
        Route::group(['prefix' => 'support-ticket', 'as' => 'support-ticket.'], function () {
            Route::get('{id}', 'single_ticket')->name('index');
            Route::post('{id}', 'comment_submit')->name('comment');
            Route::get('delete/{id}', 'support_ticket_delete')->name('delete');
            Route::get('close/{id}', 'support_ticket_close')->name('close');
        });
    });

    Route::controller(UserProfileController::class)->group(function () {
        Route::group(['prefix' => 'track-order', 'as' => 'track-order.'], function () {
            Route::get('', 'track_order')->name('index');
            Route::get('result-view', 'track_order_result')->name('result-view');
            Route::get('last', 'track_last_order')->name('last');
            Route::any('result', 'track_order_result')->name('result');
            Route::get('order-wise-result-view', 'track_order_wise_result')->name('order-wise-result-view');
        });
    });

    // Profile Route
    Route::controller(UserProfileController::class)->group(function () {
        Route::get('user-profile', 'user_profile')->name('user-profile')->middleware('customer'); //theme_aster
        Route::get('user-account', 'user_account')->name('user-account')->middleware('customer');
        Route::post('user-account-update', 'getUserProfileUpdate')->name('user-update')->middleware('customer');
        Route::post('user-account-picture', 'user_picture')->name('user-picture');
        Route::get('account-address-add', 'account_address_add')->name('account-address-add');
        Route::get('account-address', 'account_address')->name('account-address');
        Route::post('account-address-store', 'address_store')->name('address-store');
        Route::get('account-address-delete', 'address_delete')->name('address-delete');
        ROute::get('account-address-edit/{id}', 'address_edit')->name('address-edit');
        Route::post('account-address-update', 'address_update')->name('address-update');
        Route::get('account-payment', 'account_payment')->name('account-payment');
        Route::get('account-oder', 'account_order')->name('account-oder')->middleware('customer');
        Route::get('account-order-details', 'account_order_details')->name('account-order-details')->middleware('customer');
        Route::get('account-order-details-vendor-info', 'account_order_details_seller_info')->name('account-order-details-vendor-info')->middleware('customer');
        Route::get('account-order-details-delivery-man-info', 'account_order_details_delivery_man_info')->name('account-order-details-delivery-man-info')->middleware('customer');
        Route::get('account-order-details-reviews', 'getAccountOrderDetailsReviewsView')->name('account-order-details-reviews')->middleware('customer');
        Route::get('generate-invoice/{id}', 'generate_invoice')->name('generate-invoice');
        Route::get('account-wishlist', 'account_wishlist')->name('account-wishlist'); //add to card not work
        Route::get('refund-request/{id}', 'refund_request')->name('refund-request');
        Route::get('refund-details/{id}', 'refund_details')->name('refund-details');
        Route::post('refund-store', 'store_refund')->name('refund-store');
        Route::get('account-tickets', 'account_tickets')->name('account-tickets');
        Route::get('order-cancel/{id}', 'order_cancel')->name('order-cancel');
        Route::post('ticket-submit', 'submitSupportTicket')->name('ticket-submit');
        Route::get('account-delete/{id}', 'account_delete')->name('account-delete');
        Route::get('refer-earn', 'refer_earn')->name('refer-earn')->middleware('customer');
        Route::get('user-coupons', 'user_coupons')->name('user-coupons')->middleware('customer');
    });

    // Chatting start
    Route::controller(ChattingController::class)->group(function () {
        Route::get(Chatting::INDEX[URI] . '/{type}', 'index')->name('chat')->middleware('customer');
        Route::get(Chatting::MESSAGE[URI], 'getMessageByUser')->name('messages');
        Route::post(Chatting::MESSAGE[URI], 'addMessage');
    });
    // chatting end

    Route::get('wallet-account', [UserWalletController::class, 'my_wallet_account'])->name('wallet-account'); //theme fashion
    Route::get('wallet', [UserWalletController::class, 'index'])->name('wallet')->middleware('customer');

    Route::controller(UserLoyaltyController::class)->group(function () {
        Route::get(UserLoyalty::LOYALTY[URI], 'index')->name('loyalty')->middleware('customer');
        Route::post(UserLoyalty::EXCHANGE_CURRENCY[URI], 'getLoyaltyExchangeCurrency')->name('loyalty-exchange-currency');
        Route::get(UserLoyalty::GET_CURRENCY_AMOUNT[URI], 'getLoyaltyCurrencyAmount')->name('ajax-loyalty-currency-amount');
    });

    Route::controller(DigitalProductDownloadController::class)->group(function () {
        Route::group(['prefix' => 'digital-product-download-pos', 'as' => 'digital-product-download-pos.'], function () {
            Route::get('/', 'index')->name('index');
        });
    });

    Route::controller(ShopViewController::class)->group(function () {
        Route::get('shopView/{id}', 'seller_shop')->name('shopView');
        Route::get('ajax-shop-vacation-check', 'ajax_shop_vacation_check')->name('ajax-shop-vacation-check');
    });

    Route::controller(WebController::class)->group(function () {
        Route::post('shopView/{id}', 'seller_shop_product');
        Route::get('top-rated', 'top_rated')->name('topRated');
        Route::get('best-sell', 'best_sell')->name('bestSell');
        Route::get('new-product', 'new_product')->name('newProduct');
    });

    // Route::post('shop-follow', 'ShopFollowerController@shop_follow')->name('shop_follow');

    Route::group(['prefix' => 'contact', 'as' => 'contact.'], function () {
        Route::controller(WebController::class)->group(function () {
            Route::post('store', 'contact_store')->name('store');
            Route::get('/code/captcha/{tmp}', 'captcha')->name('default-captcha');
        });
    });
});

// Check done
Route::group(['prefix' => 'cart', 'as' => 'cart.', 'namespace' => 'Web'], function () {
    Route::controller(CartController::class)->group(function () {
        Route::post('variant_price', 'getVariantPrice')->name('variant_price');
        Route::post('add', 'addToCart')->name('add');
        Route::post('update-variation', 'update_variation')->name('update-variation'); //theme fashion
        Route::post('remove', 'removeFromCart')->name('remove');
        Route::get('remove-all', 'remove_all_cart')->name('remove-all'); //theme fashion
        Route::post('nav-cart-items', 'updateNavCart')->name('nav-cart');
        Route::post('floating-nav-cart-items', 'update_floating_nav')->name('floating-nav-cart-items'); // theme fashion floating nav
        Route::post('updateQuantity', 'updateQuantity')->name('updateQuantity');
        Route::post('updateQuantity-guest', 'updateQuantity_guest')->name('updateQuantity.guest');
        Route::post('order-again', 'orderAgain')->name('order-again')->middleware('customer');
        Route::post('select-cart-items', 'updateCheckedCartItems')->name('select-cart-items');
    });
});


Route::group(['prefix' => 'coupon', 'as' => 'coupon.', 'namespace' => 'Web'], function () {
    Route::controller(CouponController::class)->group(function () {
        Route::post('apply', 'apply')->name('apply');
        Route::get('remove', 'removeCoupon')->name('remove');
    });
});

/*Auth::routes();*/
Route::get('authentication-failed', function () {
    $errors = [];
    array_push($errors, ['code' => 'auth-001', 'message' => 'Unauthorized.']);
    return response()->json([
        'errors' => $errors
    ], 401);
})->name('authentication-failed');

Route::group(['namespace' => 'Customer', 'prefix' => 'customer', 'as' => 'customer.'], function () {

    Route::group(['namespace' => 'Auth', 'prefix' => 'auth', 'as' => 'auth.'], function () {
        Route::get('/code/captcha/{tmp}', 'LoginController@captcha')->name('default-captcha');
        Route::get('login', 'LoginController@login')->name('login');
        Route::post('login', 'LoginController@submit');
        Route::get('logout', 'LoginController@logout')->name('logout');
        Route::get('get-login-modal-data', 'LoginController@get_login_modal_data')->name('get-login-modal-data');

        Route::get('sign-up', 'RegisterController@register')->name('sign-up');
        Route::post('sign-up', 'RegisterController@submit');

        Route::get('check/{id}', 'RegisterController@check')->name('check');

        // Customer Default Verify
        Route::post('verify', 'RegisterController@verify')->name('verify');

        // Customer Ajax Verify for theme except default
        Route::post('ajax-verify', 'RegisterController@ajax_verify')->name('ajax_verify');
        Route::post('resend-otp', 'RegisterController@resend_otp')->name('resend_otp');

        Route::get('update-phone/{id}', 'SocialAuthController@editPhone')->name('update-phone');
        Route::post('update-phone/{id}', 'SocialAuthController@updatePhone');

        Route::get('login/{service}', 'SocialAuthController@redirectToProvider')->name('service-login');
        Route::get('login/{service}/callback', 'SocialAuthController@handleProviderCallback')->name('service-callback');

        Route::get('recover-password', 'ForgotPasswordController@reset_password')->name('recover-password');
        Route::post('forgot-password', 'ForgotPasswordController@reset_password_request')->name('forgot-password');
        Route::get('otp-verification', 'ForgotPasswordController@otp_verification')->name('otp-verification');
        Route::post('otp-verification', 'ForgotPasswordController@otp_verification_submit');
        Route::get('reset-password', 'ForgotPasswordController@reset_password_index')->name('reset-password');
        Route::post('reset-password', 'ForgotPasswordController@reset_password_submit');
        Route::post('resend-otp-reset-password', 'ForgotPasswordController@ajax_resend_otp')->name('resend-otp-reset-password');
    });

    Route::group([], function () {

        Route::controller(SystemController::class)->group(function () {
            Route::get('set-payment-method/{name}', 'setPaymentMethod')->name('set-payment-method');
            Route::get('set-shipping-method', 'setShippingMethod')->name('set-shipping-method');
            Route::post('choose-shipping-address', 'getChooseShippingAddress')->name('choose-shipping-address');
            Route::post('choose-shipping-address-other', 'getChooseShippingAddressOther')->name('choose-shipping-address-other');
            Route::post('choose-billing-address', 'choose_billing_address')->name('choose-billing-address');
        });

        Route::group(['prefix' => 'reward-points', 'as' => 'reward-points.', 'middleware' => ['auth:customer']], function () {
            Route::get('convert', 'RewardPointController@convert')->name('convert');
        });
    });
});

Route::group(['namespace' => 'Customer', 'prefix' => 'customer', 'as' => 'customer.'], function () {
    Route::post('/web-payment-request', 'PaymentController@payment')->name('web-payment-request');
    Route::post('/customer-add-fund-request', 'PaymentController@customer_add_to_fund_request')->name('add-fund-request');
});

$is_published = 0;
try {
    $full_data = include('Modules/Gateways/Addon/info.php');
    $is_published = $full_data['is_published'] == 1 ? 1 : 0;
} catch (\Exception $exception) {
}

if (!$is_published) {
    Route::group(['prefix' => 'payment'], function () {

        //ABA PAY
        Route::group(['prefix' => 'abapay', 'as' => 'abapay.'], function () {
            Route::get('pay', [AbaPayController::class, 'index'])->name('index');
            Route::get('success', [AbaPayController::class, 'success']);
            Route::get('failed', [AbaPayController::class, 'failed']);
            Route::get('cancel', [AbaPayController::class, 'cancel']);
            Route::post('postsuccess',[AbaPayController::class, 'postsuccess']);
        });

       
    });
}

Route::get('web-payment', 'Customer\PaymentController@web_payment_success')->name('web-payment-success');
Route::get('payment-success', 'Customer\PaymentController@success')->name('payment-success');
Route::get('payment-fail', 'Customer\PaymentController@fail')->name('payment-fail');

Route::get('/test', function () {
    return view('welcome');
});

Route::post('change-language', [SharedController::class, 'changeLanguage'])->name('change-language');
