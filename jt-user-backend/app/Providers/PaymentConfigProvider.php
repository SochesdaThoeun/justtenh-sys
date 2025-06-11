<?php

namespace App\Providers;

use App\Utils\Helpers;
use App\Models\BusinessSetting;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\ServiceProvider;

class PaymentConfigProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        try {
            $data = BusinessSetting::where(['type' => 'aba_payment'])->first();
            $aba = json_decode($data['value'] ?? '{}', true);
            if ($aba) {
                $config = array(
                    // ABA payment configuration
                    'merchant_id' => $aba['merchant_id'] ?? '',
                    'api_key' => $aba['api_key'] ?? '',
                    'api_url' => $aba['api_url'] ?? '',
                    'environment' => $aba['environment'] ?? 'sandbox',
                );
                Config::set('aba', $config);
            }
        } catch (\Exception $ex) {
            // Handle exceptions
        }
    }
}
