<?php

use App\Enums\GlobalConstant;

if (!function_exists('dump')) {
    /**
     * Override dump function to prevent output corruption in production
     */
    function dump(...$vars)
    {
        // In production, don't dump anything that could corrupt the output
        if (app()->environment('production', 'live')) {
            return;
        }
        
        // In other environments, use Laravel's original dump
        foreach ($vars as $var) {
            \Symfony\Component\VarDumper\VarDumper::dump($var);
        }
    }
}

if (!function_exists('dd')) {
    /**
     * Override dd function to prevent output corruption in production
     */
    function dd(...$vars)
    {
        // In production, just return without dumping or dying
        if (app()->environment('production', 'live')) {
            return;
        }
        
        // In other environments, use Laravel's original dd
        dump(...$vars);
        die(1);
    }
}

if (!function_exists('vendor_route')) {
    /**
     * Get the URL for a vendor route that has been removed
     * Fallback to homepage or specified route
     *
     * @param string $name
     * @param array $parameters
     * @param bool $absolute
     * @return string
     */
    function vendor_route($name, $parameters = [], $absolute = true)
    {
        if (isset(GlobalConstant::VENDOR_ROUTES[$name])) {
            $fallbackRoute = GlobalConstant::VENDOR_ROUTES[$name];
            return $fallbackRoute === '/' ? url('/') : route($fallbackRoute, $parameters, $absolute);
        }
        
        // Default fallback to home page if route not found in mapping
        return url('/');
    }
} 