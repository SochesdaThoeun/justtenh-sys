<?php

namespace App\Traits;

use App\Models\PaymentRequest;
use InvalidArgumentException;

trait Payment
{
    public static function generate_link(object $payer, object $payment_info, Object $receiver)
    {
        if ($payment_info->getPaymentAmount() === 0) {
            throw new InvalidArgumentException('Payment amount can not be 0');
        }

        if (!in_array(strtoupper($payment_info->getCurrencyCode()), array_column(GATEWAYS_CURRENCIES, 'code'))) {
            throw new InvalidArgumentException('Need a valid currency code');
        }

        if (!in_array($payment_info->getPaymentMethod(), array_column(GATEWAYS_PAYMENT_METHODS, 'key'))) {
            throw new InvalidArgumentException('Need a valid payment gateway');
        }

        if (!is_array($payment_info->getAdditionalData())) {
            throw new InvalidArgumentException('Additional data should be in a valid array');
        }

        $payment = new PaymentRequest();
        $payment->payment_amount = $payment_info->getPaymentAmount();
        $payment->success_hook = $payment_info->getSuccessHook();
        $payment->failure_hook = $payment_info->getFailureHook();
        $payment->payer_id = $payment_info->getPayerId();
        $payment->receiver_id = $payment_info->getReceiverId();
        $payment->currency_code = strtoupper($payment_info->getCurrencyCode());
        $payment->payment_method = $payment_info->getPaymentMethod();
        $payment->additional_data = json_encode($payment_info->getAdditionalData());
        $payment->payer_information = json_encode($payer->information());
        $payment->receiver_information = json_encode($receiver->information());
        $payment->external_redirect_link = $payment_info->getExternalRedirectLink();
        $payment->attribute = $payment_info->getAttribute();
        $payment->attribute_id = $payment_info->getAttributeId();
        $payment->payment_platform = $payment_info->getPaymentPlatForm();
        $payment->save();

       
        if($payment->payment_method == 'abapay'){
            return url("payment/abapay/pay/?payment_id={$payment->id}");
        }

        return false;
    }
}
