<?php

declare(strict_types=1);

session_start();

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

function jsonResponse(array $payload, int $statusCode = 200): void
{
    http_response_code($statusCode);
    echo json_encode($payload);
    exit;
}

$configFile = __DIR__ . '/../myphp-db.php';
if (!file_exists($configFile)) {
    jsonResponse([
        'ok' => false,
        'message' => 'Database config file not found.'
    ], 500);
}

/** @var array $db */
$db = require $configFile;
$driver = $db['driver'] ?? 'mysql';

try {
    if ($driver === 'sqlite') {
        $dsn = 'sqlite:' . $db['sqlite_path'];
        $pdo = new PDO($dsn, null, null, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    } else {
        $dsn = sprintf(
            'mysql:host=%s;port=%d;dbname=%s;charset=%s',
            $db['host'],
            $db['port'],
            $db['database'],
            $db['charset']
        );

        $pdo = new PDO($dsn, $db['username'], $db['password'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    }
} catch (Throwable $e) {
    jsonResponse([
        'ok' => false,
        'message' => 'Database connection failed.',
        'error' => $e->getMessage(),
    ], 500);
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// GET - Fetch all services or single service
if ($method === 'GET') {
    $id = $_GET['id'] ?? null;
    
    if ($id) {
        $stmt = $pdo->prepare('SELECT * FROM services WHERE id = ?');
        $stmt->execute([$id]);
        $service = $stmt->fetch();
        
        if (!$service) {
            jsonResponse(['ok' => false, 'message' => 'Service not found.'], 404);
        }
        
        jsonResponse(['ok' => true, 'service' => $service]);
    } else {
        $stmt = $pdo->query('SELECT id, title, category, description, price, image FROM services ORDER BY created_at DESC LIMIT 50');
        $services = $stmt->fetchAll();
        jsonResponse(['ok' => true, 'services' => $services]);
    }
}

// Only authenticated admins can modify services
if (!isset($_SESSION['user_id'])) {
    jsonResponse(['ok' => false, 'message' => 'Unauthorized. Please login.'], 401);
}

// Check if user is admin
$stmt = $pdo->prepare('SELECT role FROM users WHERE id = ?');
$stmt->execute([$_SESSION['user_id']]);
$user = $stmt->fetch();

if (!$user || $user['role'] !== 'admin') {
    jsonResponse(['ok' => false, 'message' => 'Admin access required.'], 403);
}

if ($method !== 'POST') {
    jsonResponse(['ok' => false, 'message' => 'Method not allowed.'], 405);
}

$raw = file_get_contents('php://input');
$body = is_string($raw) && trim($raw) !== '' ? json_decode($raw, true) : [];
if (!is_array($body)) {
    jsonResponse(['ok' => false, 'message' => 'Invalid JSON body.'], 400);
}

$action = (string)($body['action'] ?? '');

// CREATE/UPDATE service
if ($action === 'upsert') {
    $service = $body['service'] ?? null;
    if (!is_array($service)) {
        jsonResponse(['ok' => false, 'message' => 'Missing service payload.'], 400);
    }

    $id = $service['id'] ?? null;
    $title = trim((string)($service['title'] ?? ''));
    $category = trim((string)($service['category'] ?? ''));
    $description = trim((string)($service['description'] ?? ''));
    $price = (float)($service['price'] ?? 0);
    $image = trim((string)($service['image'] ?? ''));

    if (!$title || !$category || !$description || $price <= 0) {
        jsonResponse(['ok' => false, 'message' => 'All fields required and price must be > 0.'], 400);
    }

    if ($id) {
        // Update
        $stmt = $pdo->prepare('UPDATE services SET title = ?, category = ?, description = ?, price = ?, image = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
        $stmt->execute([$title, $category, $description, $price, $image, $id]);
        jsonResponse(['ok' => true, 'message' => 'Service updated.', 'id' => $id]);
    } else {
        // Create
        $stmt = $pdo->prepare('INSERT INTO services (title, category, description, price, image, created_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)');
        $stmt->execute([$title, $category, $description, $price, $image]);
        $newId = $pdo->lastInsertId();
        jsonResponse(['ok' => true, 'message' => 'Service created.', 'id' => $newId]);
    }
}

// DELETE service
if ($action === 'delete') {
    $id = (int)($body['id'] ?? 0);
    if (!$id) {
        jsonResponse(['ok' => false, 'message' => 'Service ID required.'], 400);
    }

    $stmt = $pdo->prepare('DELETE FROM services WHERE id = ?');
    $stmt->execute([$id]);
    jsonResponse(['ok' => true, 'message' => 'Service deleted.']);
}

jsonResponse(['ok' => false, 'message' => 'Invalid action.'], 400);
