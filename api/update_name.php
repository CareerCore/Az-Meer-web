<?php
declare(strict_types=1);
header('Content-Type: text/plain');

$configFile = __DIR__ . '/../myphp-db.php';
$db = require $configFile;

try {
    $dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=%s', $db['host'], $db['port'], $db['database'], $db['charset']);
    $pdo = new PDO($dsn, $db['username'], $db['password'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

    $name = 'Az Meer(SMC-Private) Limited';

    // Update Site Name
    $stmt = $pdo->prepare("INSERT INTO site_settings (setting_key, setting_value) VALUES ('site_name', ?) ON DUPLICATE KEY UPDATE setting_value = ?");
    $stmt->execute([$name, $name]);

    // Update Hero Title if it contains old name
    $stmt = $pdo->prepare("UPDATE site_settings SET setting_value = REPLACE(setting_value, 'Az Meer®', ?) WHERE setting_key = 'hero_title'");
    $stmt->execute([$name]);

    echo "SUCCESS: Database updated with '$name'\n";
    echo "You can now delete this file for security.";

} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage();
}
