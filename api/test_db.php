<?php
header('Content-Type: application/json');
$configFile = __DIR__ . '/../myphp-db.php';
if (!file_exists($configFile)) {
    echo json_encode(['ok' => false, 'message' => 'Config not found']);
    exit;
}
$db = require $configFile;
try {
    $dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=%s', $db['host'], $db['port'], $db['database'], $db['charset']);
    $pdo = new PDO($dsn, $db['username'], $db['password'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    echo json_encode(['ok' => true, 'message' => 'Connected successfully']);
} catch (Exception $e) {
    echo json_encode(['ok' => false, 'message' => $e->getMessage()]);
}
