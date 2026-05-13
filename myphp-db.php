<?php

/**
 * Database Configuration
 *
 * To use MySQL: Set 'driver' => 'mysql' and provide host/user/pass.
 * To use SQLite: Set 'driver' => 'sqlite' (No installation required!).
 */

return [
    'driver'   => 'mysql',

    // XAMPP (Local) settings
    'host'     => 'localhost',
    'port'     => 3306,
    'database' => 'ezyro_41821031_azmeer',
    'username' => 'root',
    'password' => '',
    'charset'  => 'utf8mb4',

    /*
    // Real Server MySQL settings (sql303.ezyro.com)
    'host'     => 'sql303.ezyro.com',
    'port'     => 3306,
    'database' => 'ezyro_41821031_azmeer',
    'username' => 'ezyro_41821031',
    'password' => 'f3ddd57640',
    'charset'  => 'utf8mb4',
    */

    // SQLite settings (Fallback)
    'sqlite_path' => __DIR__ . '/database.sqlite',
];
