<?php

return [
    /*
    |--------------------------------------------------------------------------
    | WateenSoft & Wateen Book Corporate & Platform Configuration
    |--------------------------------------------------------------------------
    */

    'company' => [
        'name' => 'WateenSoft',
        'name_ar' => 'وتين سوفت',
        'tagline' => 'WateenSoft HealthTech Solutions',
        'support_email' => env('WATEEN_SUPPORT_EMAIL', 'support@wateensoft.com'),
        'contact_email' => env('WATEEN_CONTACT_EMAIL', 'contact@wateensoft.com'),
    ],

    'app' => [
        'name' => 'Wateen Book',
        'name_ar' => 'وتين بوك',
        'short_name' => 'Wateen Book',
        'bundle_id' => 'com.wateensoft.wateenbook',
        'deep_link_scheme' => 'wateenbook',
        'web_domain' => env('WATEEN_WEB_DOMAIN', 'book.wateensoft.com'),
        'api_domain' => env('WATEEN_API_DOMAIN', 'api.wateensoft.com'),
    ],

    'colors' => [
        'primary' => '#008668',
        'aqua' => '#33CCCC',
        'accent' => '#FF9B33',
        'surface_light' => '#F2F2F2',
        'surface_dark' => '#0B131E',
    ],
];
