<?php
declare(strict_types=1);

$configFile = __DIR__ . '/myphp-db.php';
$db = require $configFile;

try {
    $dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=%s', $db['host'], $db['port'], $db['database'], $db['charset']);
    $pdo = new PDO($dsn, $db['username'], $db['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);

    $pdo->exec("ALTER TABLE team ADD COLUMN sort_order INT DEFAULT 0");
    echo "Successfully added sort_order to team table.\n";
} catch (PDOException $e) {
    if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
        echo "Column sort_order already exists.\n";
    } else {
        echo "Error: " . $e->getMessage() . "\n";
    }
}
