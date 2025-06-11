<?php
namespace App\Enums;

enum GlobalConstant{

    //countries
    const COUNTRIES = [
        ["name" => 'Cambodia', "code" => 'KH'],
        ["name" => 'United Kingdom', "code" => 'GB'],
        ["name" => 'United States', "code" => 'US'],
        ["name" => 'Viet Nam', "code" => 'VN']
    ];

    const SOFTWARE_VERSION = '14.2';

    const THEME_RATIO = [
        'default' => [
            'Main Banner'=>'(2400 x 996 px)',
            'Footer Banner'=>'Ratio 2:1 (2000 x 1000 px)',
            'Popup Banner'=>'Ratio 1:1 (1200 x 1200 px)',
            'Main Section Banner'=>'Ratio 4:1 (2000 x 500 px)',
            'Store cover Image'=>'Ratio 4:1 (2000 x 500 px)',
            'Main website Logo'=>'(1000 x 308 px)',
            'Product Image'=>'Ratio 1:1 (500 x 500 px)',
            'Category Image'=>'Ratio 1:1 (500 x 500 px)',
            'Brand Image'=>'Ratio 1:1 (500 x 500 px)',
            'Seller Image'=>'Ratio 1:1 (500 x 500 px)',
            'Meta Thumbnail' => '(Ratio 2:1)'
        ],
        'theme_aster' => [
            'Main Banner'=>'Ratio 2:1 (2000 x 1000 px)',
            'Footer Banner'=>'(2500 x 602 px)',
            'Popup Banner'=>'Ratio 1:1 (1200 x 1200 px)',

            'Main Section Banner'=>'(2000 x 618 px)',
            'Store cover Image'=>'Ratio 4:1 (2000 x 500 px)',
            'Store Banner Image'=>'(2000 x 377 px)',
            'Header Banner'=>'(585 x 160 px)',
            'Sidebar Banner'=>'(280 x 500 px)',
            'Top Side Banner'=>'(205 x 500 px)',

            'Main website Logo'=>'(1000 x 308 px)',
            'Product Image'=>'Ratio 1:1 (500 x 500 px)',
            'Category Image'=>'Ratio 1:1 (500 x 500 px)',
            'Brand Image'=>'Ratio 1:1 (500 x 500 px)',
            'Seller Image'=>'Ratio 1:1 (500 x 500 px)',
            'Meta Thumbnail' => '(Ratio 2:1)'
        ],
        'theme_fashion' => [
            'Main Banner'=>'Ratio 1:1 (Transparent PNG)',
            'Footer Banner'=>'Ratio 4:1',
            'Popup Banner'=>'Ratio 2:1',
            'Main Section Banner'=>'Ratio 4:1',
            'Store cover Image'=>'Ratio 4:1 (1500 x 500 px)',
            'Store Banner Image'=>'Ratio 3:1 (1500 x 500 px)',
            'Promo Banner Left'=>'Ratio 1:1 (1000 x 1000 px)',
            'Promo Banner Middle Top'=>'Ratio 3:1 (1000 x 330 px)',
            'Promo Banner Middle Bottom'=>'Ratio 3:1 (1000 x 330 px)',
            'Promo Banner Right'=>'Ratio 1:1.5 (1000 x 1500 px)',
            'Promo Banner Bottom'=>'Ratio 8:1',

            'Main website Logo'=>'(1000 x 308 px)',
            'Product Image'=>'Ratio 1:1.3 (400 x 500 px)',
            'Category Image'=>'Ratio 1:1 (500 x 500 px)',
            'Brand Image'=>'Ratio 1:1 (500 x 500 px)',
            'Seller Image'=>'Ratio 1:1 (500 x 500 px)',
            'Meta Thumbnail' => '(Ratio 2:1)'
        ],

    ];

    //payment methods
    const GATEWAYS_PAYMENT_METHODS = [
    
        ['key' => 'abapay', 'value' => 'ABA KHQR'],
    ];

    //countries
    const GATEWAYS_COUNTRIES = [
        ["name" => 'Cambodia', "code" => 'KH'],
        ["name" => 'United Kingdom', "code" => 'GB'],
        ["name" => 'United States', "code" => 'US'],
        ["name" => 'Viet Nam', "code" => 'VN']
    ];

    const FILE_PATH = [
        'product' => [
            'thumbnail' => 'storage/app/public/product/thumbnail',
        ],
    ];

    // Default payment gateways to use when is_published is not 1
    const DEFAULT_PAYMENT_GATEWAYS = [
        'cash_on_delivery', 'digital_payment',  'abapay'
    ];

    const DEFAULT_SMS_GATEWAYS = [
        'twilio',
    ];

    const VENDOR_ROUTES = [
        'vendor.auth.registration.index' => '/',
        'vendor.auth.login' => '/',
        'vendor.dashboard.index' => '/',
        'vendor.dashboard.profile' => '/',
        'vendor.auth.registration.store' => '/'
    ];

    const DOCUMENT_EXTENSION = [
        '.doc', '.docx', '.txt', '.csv', '.xls', '.xlsx', '.rar', '.tar', '.tar.gz', '.zip', '.pdf'
    ];
    const IMAGE_EXTENSION = [
       '.jpg', '.jpeg', '.jpe', '.jif', '.jfif', '.jfi','.png','.gif','.webp','.tiff','.tif','.bmp','.svg',
    ];
}
