<?php
declare(strict_types=1);
session_start();

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

ini_set('display_errors', '0');
error_reporting(E_ALL);

function jsonResponse(array $payload, int $statusCode = 200): void {
    http_response_code($statusCode);
    echo json_encode($payload);
    exit;
}

// 1. Authenticate Staff
$user_id = $_SESSION['user_id'] ?? null;
$role = $_SESSION['role'] ?? '';

if (!$user_id || !in_array($role, ['admin', 'owner', 'manager', 'freelancer'])) {
    jsonResponse(['ok' => false, 'message' => 'Unauthorized. Staff access required.'], 403);
}

// 2. Database Connection
$configFile = __DIR__ . '/../myphp-db.php';
$db = require $configFile;

try {
    $dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=%s', $db['host'], $db['port'], $db['database'], $db['charset']);
    $pdo = new PDO($dsn, $db['username'], $db['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (Throwable $e) {
    jsonResponse(['ok' => false, 'message' => 'Database connection failed'], 500);
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$raw = file_get_contents('php://input');
$body = json_decode((string)$raw, true) ?? [];
$action = $body['action'] ?? $_GET['action'] ?? '';
$type = $body['type'] ?? $_GET['type'] ?? '';

// Allowed Tables
$validTypes = ['services', 'portfolio', 'blogs', 'faqs', 'team', 'site_settings', 'top_services', 'users', 'orders'];

if ($method === 'POST') {
    // Permission Checks
    if ($type === 'users' && !in_array($role, ['admin', 'owner'])) {
        jsonResponse(['ok' => false, 'message' => 'Only Admin/Owner can manage users.'], 403);
    }

    if ($type === 'site_settings' && !in_array($role, ['admin', 'owner'])) {
        jsonResponse(['ok' => false, 'message' => 'Only Admin/Owner can change settings.'], 403);
    }

    if ($action === 'save') {
        if (!in_array($type, $validTypes)) jsonResponse(['ok' => false, 'message' => 'Invalid type'], 400);
        $data = $body['data'] ?? [];
        $id = (int)($data['id'] ?? 0);
        unset($data['id']);

        // Rank Hierarchy: owner (10) > admin (5) > manager (3) > freelancer (2) > user (1)
        $rankMap = ['owner' => 10, 'admin' => 5, 'manager' => 3, 'freelancer' => 2, 'user' => 1];
        $myRank = $rankMap[$role] ?? 0;

        // Permissions Check
        $isSelf = ($id === (int)$user_id);

        if (!$isSelf) {
            if ($myRank < 5) jsonResponse(['ok' => false, 'message' => 'Unauthorized'], 403);

            // If editing another user, check ranks
            if ($id > 0) {
                $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
                $stmt->execute([$id]);
                $targetRole = $stmt->fetchColumn();
                $targetRank = $rankMap[$targetRole] ?? 0;

                if ($myRank <= $targetRank && $role !== 'owner') {
                    jsonResponse(['ok' => false, 'message' => 'Cannot edit higher or equal rank.'], 403);
                }
            }
        }

        // Prevent non-owners from changing roles to owner
        if (isset($data['role']) && $data['role'] === 'owner' && $role !== 'owner') {
            unset($data['role']);
        }

        // Prevent anyone from changing their own role (except owner maybe, but safer to block)
        if ($isSelf && isset($data['role']) && $role !== 'owner') {
            unset($data['role']);
        }

        if ($id) {
            $fields = []; $values = [];
            foreach ($data as $k => $v) { $fields[] = "`$k` = ?"; $values[] = $v; }
            $values[] = $id;
            $stmt = $pdo->prepare("UPDATE `$type` SET " . implode(', ', $fields) . " WHERE id = ?");
            $stmt->execute($values);
        } else {
            if (!$isSelf && $myRank < 5) jsonResponse(['ok' => false, 'message' => 'Unauthorized creation'], 403);
            $cols = implode('`, `', array_keys($data));
            $plots = implode(', ', array_fill(0, count($data), '?'));
            $stmt = $pdo->prepare("INSERT INTO `$type` (`$cols`) VALUES ($plots)");
            $stmt->execute(array_values($data));
        }
        jsonResponse(['ok' => true]);
    }

    if ($action === 'update_order_status') {
        if (!in_array($role, ['admin', 'owner', 'manager', 'freelancer'])) jsonResponse(['ok' => false, 'message' => 'Unauthorized'], 403);
        $order_id = $body['id'] ?? 0;
        $status = $body['status'] ?? 'pending';
        try {
            $stmt = $pdo->prepare("UPDATE orders SET status = ? WHERE id = ?");
            $stmt->execute([$status, $order_id]);

            // Send Notification
            require_once __DIR__ . '/mail_helper.php';
            $info_stmt = $pdo->prepare("
                SELECT o.id, u.email as client_email, f.email as freelancer_email
                FROM orders o
                JOIN users u ON o.user_id = u.id
                LEFT JOIN users f ON o.assigned_to = f.id
                WHERE o.id = ?
            ");
            $info_stmt->execute([$order_id]);
            $info = $info_stmt->fetch();

            if ($info) {
                sendNotification('status_change', [
                    'order_id' => $order_id,
                    'client_email' => $info['client_email'],
                    'freelancer_email' => $info['freelancer_email'],
                    'status' => $status
                ]);
            }

            jsonResponse(['ok' => true]);
        } catch (Exception $e) {
            jsonResponse(['ok' => false, 'message' => $e->getMessage()], 500);
        }
    }

    if ($action === 'assign_order') {
        if (!in_array($role, ['admin', 'owner'])) jsonResponse(['ok' => false, 'message' => 'Unauthorized'], 403);
        $order_id = $body['id'] ?? 0;
        $freelancer_id = $body['freelancer_id'] ?? null;
        try {
            $stmt = $pdo->prepare("UPDATE orders SET assigned_to = ? WHERE id = ?");
            $stmt->execute([$freelancer_id, $order_id]);

            // Send Notification
            require_once __DIR__ . '/mail_helper.php';
            $info_stmt = $pdo->prepare("
                SELECT o.id, f.email as freelancer_email, u.username as client_name
                FROM orders o
                JOIN users u ON o.user_id = u.id
                JOIN users f ON f.id = ?
                WHERE o.id = ?
            ");
            $info_stmt->execute([$freelancer_id, $order_id]);
            $info = $info_stmt->fetch();

            if ($info) {
                sendNotification('order_assigned', [
                    'order_id' => $order_id,
                    'freelancer_email' => $info['freelancer_email'],
                    'client_name' => $info['client_name']
                ]);
            }

            jsonResponse(['ok' => true]);
        } catch (Exception $e) {
            jsonResponse(['ok' => false, 'message' => $e->getMessage()], 500);
        }
    }

    if ($action === 'delete') {
        $stmt = $pdo->prepare("DELETE FROM `$type` WHERE id = ?");
        $stmt->execute([$body['id']]);
        jsonResponse(['ok' => true]);
    }

    if ($action === 'approve_user') {
        if (!in_array($role, ['admin', 'owner'])) jsonResponse(['ok' => false], 403);
        $userId = $body['id'] ?? 0;
        $status = $body['status'] ?? 'active';
        $stmt = $pdo->prepare("UPDATE users SET status = ? WHERE id = ?");
        $stmt->execute([$status, $userId]);
        jsonResponse(['ok' => true]);
    }

    if ($action === 'save_settings') {
        if (!in_array($role, ['admin', 'owner'])) jsonResponse(['ok' => false], 403);

        $ownerOnlyKeys = ['maintenance_mode', 'service_fee', 'primary_color', 'api_secret_key'];

        foreach ($body['settings'] as $k => $v) {
            // Block non-owners from saving sensitive keys
            if (in_array($k, $ownerOnlyKeys) && $role !== 'owner') continue;

            $stmt = $pdo->prepare("INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?");
            $stmt->execute([$k, $v, $v]);
        }
        jsonResponse(['ok' => true]);
    }
}

// Stats for Dashboard
if ($action === 'stats') {
    if ($role === 'freelancer') {
        $stats = [
            'tasks' => $pdo->query("SELECT COUNT(*) FROM orders WHERE assigned_to = $user_id AND status != 'completed'")->fetchColumn(),
            'completed' => $pdo->query("SELECT COUNT(*) FROM orders WHERE assigned_to = $user_id AND status = 'completed'")->fetchColumn(),
            'balance' => $pdo->query("SELECT SUM(price) FROM orders WHERE assigned_to = $user_id AND status = 'completed'")->fetchColumn() ?? 0,
            'reviews' => 4.9 // Dummy for now
        ];
    } else {
        $stats = [
            'users' => $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn(),
            'orders' => $pdo->query("SELECT COUNT(*) FROM orders")->fetchColumn(),
            'revenue' => $pdo->query("SELECT SUM(price) FROM orders WHERE status = 'completed'")->fetchColumn() ?? 0,
            'pending' => $pdo->query("SELECT COUNT(*) FROM orders WHERE status = 'pending'")->fetchColumn(),
            'services' => $pdo->query("SELECT COUNT(*) FROM services")->fetchColumn()
        ];
    }
    jsonResponse(['ok' => true, 'stats' => $stats]);
}

if ($action === 'activity_log') {
    // Return last 20 actions from orders and users for a "pseudo" activity log
    $logs = [];

    // Recent Orders
    $orders = $pdo->query("SELECT created_at as time, 'System' as user, CONCAT('New Order #', id) as action, status FROM orders ORDER BY id DESC LIMIT 10")->fetchAll();
    // Recent Users
    $users = $pdo->query("SELECT created_at as time, username as user, 'New Registration' as action, status FROM users ORDER BY id DESC LIMIT 10")->fetchAll();

    $logs = array_merge($orders, $users);
    usort($logs, function($a, $b) { return strcmp($b['time'], $a['time']); });

    jsonResponse(['ok' => true, 'logs' => array_slice($logs, 0, 15)]);
}

jsonResponse(['ok' => false, 'message' => 'Invalid Request'], 400);
