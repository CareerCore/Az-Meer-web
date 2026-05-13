<?php
declare(strict_types=1);
session_start();
header('Content-Type: application/json');

$configFile = __DIR__ . '/../myphp-db.php';
$db = require $configFile;

try {
    if (isset($db['driver']) && $db['driver'] === 'sqlite') {
        $dsn = 'sqlite:' . $db['sqlite_path'];
        $pdo = new PDO($dsn);
    } else {
        $dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=%s', $db['host'] ?? 'localhost', $db['port'] ?? 3306, $db['database'] ?? '', $db['charset'] ?? 'utf8mb4');
        $pdo = new PDO($dsn, $db['username'] ?? 'root', $db['password'] ?? '');
    }
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (Throwable $e) {
    echo json_encode(['ok' => false, 'message' => 'DB Connection Error']);
    exit;
}

$action = $_GET['action'] ?? '';

if ($action === 'create') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['ok' => false, 'message' => 'Please login to place an order.']);
        exit;
    }

    $user_id = $_SESSION['user_id'];
    $service_id = $data['service_id'] ?? 0;
    $price = $data['price'] ?? 0;
    $description = $data['description'] ?? '';

    try {
        $stmt = $pdo->prepare("INSERT INTO orders (user_id, service_id, price, status, project_description) VALUES (?, ?, ?, 'pending', ?)");
        $stmt->execute([$user_id, $service_id, $price, $description]);
        $order_id = $pdo->lastInsertId();

        // Send Email Notification
        require_once __DIR__ . '/mail_helper.php';

        // Fetch extra info for email
        $client_stmt = $pdo->prepare("SELECT username, email FROM users WHERE id = ?");
        $client_stmt->execute([$user_id]);
        $client = $client_stmt->fetch();

        $service_stmt = $pdo->prepare("SELECT title FROM services WHERE id = ?");
        $service_stmt->execute([$service_id]);
        $service_title = $service_stmt->fetchColumn();

        sendNotification('new_order', [
            'order_id' => $order_id,
            'client_email' => $client['email'],
            'service_title' => $service_title,
            'price' => $price
        ]);

        echo json_encode(['ok' => true, 'message' => 'Order placed successfully!', 'order_id' => $order_id]);
    } catch (Exception $e) {
        echo json_encode(['ok' => false, 'message' => 'Failed to place order: ' . $e->getMessage()]);
    }
} elseif ($action === 'my_orders') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['ok' => false, 'message' => 'Unauthorized']);
        exit;
    }

    $user_id = $_SESSION['user_id'];
    $stmt = $pdo->prepare("
        SELECT o.*, s.title as service_title, u.username as freelancer_name, u.email as freelancer_email, u.role as freelancer_role
        FROM orders o
        JOIN services s ON o.service_id = s.id
        LEFT JOIN users u ON o.assigned_to = u.id
        WHERE o.user_id = ?
        ORDER BY o.id DESC
    ");
    $stmt->execute([$user_id]);
    echo json_encode(['ok' => true, 'orders' => $stmt->fetchAll()]);
} elseif ($action === 'update') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['ok' => false, 'message' => 'Unauthorized']);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $order_id = $data['id'] ?? 0;
    $description = $data['description'] ?? '';

    if (!$order_id || !$description) {
        echo json_encode(['ok' => false, 'message' => 'Missing data']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("UPDATE orders SET project_description = ? WHERE id = ? AND user_id = ?");
        $stmt->execute([$description, $order_id, $_SESSION['user_id']]);
        echo json_encode(['ok' => true, 'message' => 'Order updated successfully!']);
    } catch (Exception $e) {
        echo json_encode(['ok' => false, 'message' => 'Update failed: ' . $e->getMessage()]);
    }
}
