<?php
$db = require 'myphp-db.php';
try {
    if ($db['driver'] === 'sqlite') {
        $dsn = 'sqlite:' . $db['sqlite_path'];
        $pdo = new PDO($dsn);
    } else {
        $dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=%s', $db['host'], $db['port'], $db['database'], $db['charset']);
        $pdo = new PDO($dsn, $db['username'], $db['password']);
    }
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $queries = [
        "ALTER TABLE blogs ADD COLUMN category VARCHAR(100)"
    ];

    foreach ($queries as $q) {
        try {
            $pdo->exec($q);
            echo "Success: $q\n";
        } catch (Exception $e) {
            echo "Skipped: $q (" . $e->getMessage() . ")\n";
        }
    }
    echo "\nBlogs table updated with category column!";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
