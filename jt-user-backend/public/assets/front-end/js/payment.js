"use strict";

setTimeout(function () {
    $('.stripe-button-el').hide();
    $('.razorpay-payment-button').hide();
}, 10)
$(function() {
    $('.proceed_to_next_button').addClass('disabled');
});
const radioButtons = document.querySelectorAll('input[type="radio"]');
radioButtons.forEach(radioButton => {
    radioButton.addEventListener('change', function() {
        if (this.checked) {
            $('.proceed_to_next_button').removeClass('disabled');

            radioButtons.forEach(otherRadioButton => {
                if (otherRadioButton !== this) {
                    otherRadioButton.checked = false;
                }
            });
            this.setAttribute('checked', 'true');
            const field_id = this.id;
            if(field_id == "pay_offline"){
                $('.pay_offline_card').removeClass('d-none')
                $('.proceed_to_next_button').addClass('disabled');

            }else{
                $('.pay_offline_card').addClass('d-none');
                $('.proceed_to_next_button').removeClass('disabled');

            }
        }else{
        }
    });
});

// Function to fetch payment data
function fetchPaymentData(paymentId) {
    // Define the new URL with the payment ID as a query parameter
    const fetchUrl = `/payment/abapay/pay?payment_id=${paymentId}`;

    $.ajax({
        url: fetchUrl, // Use the new GET route with payment_id as a query parameter
        method: 'GET', // Set the method to GET
        success: function(response) {
            console.log('Payment Data:', response);

            // Update the form action URL dynamically with payment_id (if needed)
            $('#aba_merchant_request').attr('action', response.apiurl);


            $('#aba_merchant_request input[name="req_time"]').val(response.req_time);
            $('#aba_merchant_request input[name="merchant_id"]').val(response.merchant_id || '');
            $('#aba_merchant_request input[name="tran_id"]').val(response.tran_id);
            $('#aba_merchant_request input[name="amount"]').val(response.amount);
            $('#aba_merchant_request input[name="firstname"]').val(response.firstname);
            $('#aba_merchant_request input[name="email"]').val(response.email);
            $('#aba_merchant_request input[name="phone"]').val(response.phone);
            $('#aba_merchant_request input[name="type"]').val(response.type || 'purchase');
            $('#aba_merchant_request input[name="payment_option"]').val(response.payment_option || '');
            $('#aba_merchant_request input[name="return_url"]').val(response.return_url || '');
            $('#aba_merchant_request input[name="cancel_url"]').val(response.cancel_url || '');
            $('#aba_merchant_request input[name="continue_success_url"]').val(response.continue_success_url || '');
            $('#aba_merchant_request input[name="return_deeplink"]').val(response.return_deeplink || '');
            $('#aba_merchant_request input[name="currency"]').val(response.currency);
            $('#aba_merchant_request input[name="hash"]').val(response.hash);

            $('#aba_merchant_request').append($(".payment_option:checked"));
            AbaPayway.checkout();


        },
        error: function(xhr, status, error) {
            console.error('Error fetching payment data:', error);
        }
    });
}


function checkoutFromPayment(){
    let checked_button_id = $('input[type="radio"]:checked').attr('id');


    if (checked_button_id === 'abapay') {
        var formAction = $('#abapay_form').attr('action');
        //console.log(formAction);
        // Submit the form and fetch payment data via AJAX
        $.ajax({
            url: formAction,
            method: 'POST',
            data: $('#' + checked_button_id + '_form').serialize(), // Include the form data
            success: function(response) {

                console.log('Payment data for abapay:', response.payment_data);
                let url = new URL(response.payment_data);
                let paymentId = url.searchParams.get("payment_id");
                //console.log('ID:', paymentId);
                fetchPaymentData(paymentId)
                // Process the payment data here (e.g., populate the form fields or trigger the payment)
            },
            error: function(xhr, status, error) {
                console.error('Error processing abapay payment:', error);
            }
        });
    } else {
        // Submit the form for other payment methods
        $('#' + checked_button_id + '_form').submit();
    }

}


const buttons = document.querySelectorAll('.offline_payment_button');
const selectElement = document.getElementById('pay_offline_method');
buttons.forEach(button => {
    button.addEventListener('click', function() {
        const buttonId = this.id;
        pay_offline_method_field(buttonId);
        selectElement.value = buttonId;
    });
});

$('#pay_offline_method').on('change', function () {
    pay_offline_method_field(this.value);
});
function pay_offline_method_field(method_id){

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: $('#route-pay-offline-method-list').data('url') + "?method_id=" + method_id,
        data: {},
        processData: false,
        contentType: false,
        type: 'get',
        success: function (response) {
            $("#payment_method_field").html(response.methodHtml);
            $('#selectPaymentMethod').modal().show();
        },
        error: function () {
        }
    });
}
