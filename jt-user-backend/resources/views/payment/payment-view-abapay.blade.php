<!DOCTYPE html>
<html lang="en">

<head>
    <title>Aba Checkout</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <meta name="author" content="PayWay">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
</head>

<body>
    <form method="POST" target="aba_webservice" action="{{ $apiurl }}" id="aba_merchant_request">
        @csrf
        <input type="hidden" name="req_time" value="{{ $req_time }}" />
        <input type="hidden" name="merchant_id" value="{{ $merchant_id }}" />
        <input type="hidden" name="tran_id" value="{{ $tran_id }}" id="tran_id" />
        <input type="hidden" name="amount" value="{{ $amount }}" id="amount" />
        <input type="hidden" name="firstname" value="{{ $firstname }}" />
        <input type="hidden" name="email" value="{{ $email }}" />
        <input type="hidden" name="phone" value="{{ $phone }}" />
        <input type="hidden" name="type" value="{{ $type }}" />
        <input type="hidden" name="payment_option" value="{{ $payment_option }}" />
        <input type="hidden" name="return_url" value="{{ $return_url }}" />
        <input type="hidden" name="cancel_url" value="{{ $cancel_url }}" />
        <input type="hidden" name="continue_success_url" value="{{ $continue_success_url }}" />
        <input type="hidden" name="return_deeplink" value="{{ $return_deeplink }}" />
        <input type="hidden" name="currency" value="{{ $currency }}" />
        <input type="hidden" name="hash" value="{{ $hash }}" id="hash" />
    </form>

    <script src="https://checkout.payway.com.kh/plugins/checkout2-0.js"></script>

    <script>
         let triggerCount = 1;

function triggerCheckout() {

    console.log("Checkout trigger count: " + triggerCount);

    // Only trigger the checkout if this is the first call
    if (triggerCount === 1) {
        // Check if AbaPayway.checkout is available
        if (typeof AbaPayway !== 'undefined' && typeof AbaPayway.checkout === 'function') {
            triggerCount++;
            $('#aba_merchant_request').append($(".payment_option:checked"));
            AbaPayway.checkout();
        } else {
            // Retry after 100ms if AbaPayway is not loaded yet
            setTimeout(triggerCheckout, 100);
        }
    } else if (triggerCount >= 2) {
        // For any call after the first one, trigger redirection
        //redirectAfterClose();
    }
}

function redirectAfterClose() {
    console.log("Redirecting to the payment success page...");
    window.location.href = 'http://127.0.0.1:8000/checkout-payment';
}

$(document).ready(function () {
    // Prevent the form from submitting and refreshing the page
    $('#aba_merchant_request').on('submit', function(e) {
        e.preventDefault(); // Stop form submission
    });

    // Call the triggerCheckout function when the page loads
    triggerCheckout();

    // Detect when the AbaPayway modal is closed
    window.addEventListener('message', function (event) {
        if (event.data === 'checkout_closed') {
            triggerCheckout(); // Increment the count and check for redirect
        }
    });
});
    </script>
</body>

</html>
