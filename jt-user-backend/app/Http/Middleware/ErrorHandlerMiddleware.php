<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use App\Utils\Helpers;
use App\Models\BusinessSetting;
use App\Models\SocialMedia;
use App\Models\Currency;
use App\Models\Shop;

class ErrorHandlerMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        try {
            return $next($request);
        } catch (\Exception $e) {
            // Share web_config with error views
            $this->shareWebConfigWithErrorViews();
            throw $e; // Re-throw the exception to maintain normal error handling
        }
    }

    /**
     * Share web_config with error views
     */
    private function shareWebConfigWithErrorViews()
    {
        try {
            $web = BusinessSetting::all();
            $settings = Helpers::get_settings($web, 'colors');
            $data = json_decode($settings['value'] ?? '{}', true);

            $web_config = [
                'primary_color' => $data['primary'] ?? '#132442',
                'secondary_color' => $data['secondary'] ?? '#000000',
                'primary_color_light' => $data['primary_light'] ?? '#CFDFFB',
                'name' => Helpers::get_settings($web, 'company_name'),
                'phone' => Helpers::get_settings($web, 'company_phone'),
                'web_logo' => getWebConfig('company_web_logo'),
                'mob_logo' => getWebConfig('company_mobile_logo'),
                'fav_icon' => getWebConfig('company_fav_icon'),
                'email' => Helpers::get_settings($web, 'company_email'),
                'social_media' => SocialMedia::where('active_status', 1)->get()->toArray(),
                'currencies' => Currency::where('status', 1)->get()->toArray(),
                'shops' => Shop::whereHas('seller', function ($query) {
                    return $query->approved();
                })->take(9)->get()->toArray(),
            ];

            View::share('web_config', $web_config);
        } catch (\Exception $e) {
            // If anything fails, provide minimal default values to prevent errors
            View::share('web_config', [
                'primary_color' => '#132442',
                'secondary_color' => '#000000',
                'primary_color_light' => '#CFDFFB',
            ]);
        }
    }
} 