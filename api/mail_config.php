<?php
declare(strict_types=1);

// Email Configuration
return [
    'enabled' => true,
    'method' => 'mail', // 'mail' or 'smtp'

    // For SMTP method (e.g. Gmail)
    'smtp' => [
        'host' => 'smtp.gmail.com',
        'port' => 587,
        'auth' => true,
        'username' => 'your-email@gmail.com',
        'password' => 'your-app-password',
        'secure' => 'tls',
    ],

    // Default Sender
    'from_email' => 'no-reply@azmeer.com',
    'from_name' => 'Az Meer Notifications',

    // Admin & Owner emails for system alerts
    'admin_email' => 'admin@azmeer.com',
    'owner_email' => 'teamabhpk@gmail.com', // Primary notification email
];
