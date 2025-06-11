<?php

namespace App\Traits;

use Illuminate\Pagination\LengthAwarePaginator;

trait PaymentGatewayTrait
{
    public function getPaymentGatewaySupportedCurrencies($key = null): array
    {
        $paymentGateway = [
            "abapay" => [
                "USD" => "United States Dollar",
                "KHR" => "Khmer Riel"
            ]
        ];

        if ($key) {
            return $paymentGateway[$key];
        }
        return $paymentGateway;
    }

}
