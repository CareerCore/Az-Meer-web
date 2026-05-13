<?php
declare(strict_types=1);

// Ensure session cookie is valid for the entire site
session_set_cookie_params([
    'path' => '/',
    'samesite' => 'Lax'
]);
session_start();

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

// Silence errors but allow logging
ini_set('display_errors', '0');
error_reporting(E_ALL);

function jsonResponse(array $payload, int $statusCode = 200): void {
    http_response_code($statusCode);
    echo json_encode($payload);
    exit;
}

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
    jsonResponse(['ok' => false, 'message' => 'DB Connection Error'], 500);
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$raw = file_get_contents('php://input');
$body = json_decode((string)$raw, true) ?? [];
$action = $_GET['action'] ?? $body['action'] ?? '';

// Check Session
if ($action === 'check') {
    if (isset($_SESSION['user_id'])) {
        jsonResponse(['ok' => true, 'authenticated' => true, 'user' => [
            'id' => $_SESSION['user_id'],
            'username' => $_SESSION['username'],
            'role' => $_SESSION['role']
        ]]);
    }
    jsonResponse(['ok' => true, 'authenticated' => false]);
}

// Signup Logic
if ($method === 'POST' && $action === 'signup') {
    $username = trim((string)($body['username'] ?? ''));
    $email = trim((string)($body['email'] ?? ''));
    $password = trim((string)($body['password'] ?? ''));
    $role = trim((string)($body['role'] ?? 'user'));

    $allowedRoles = ['user', 'freelancer', 'manager', 'admin', 'owner'];
    if (!in_array($role, $allowedRoles)) $role = 'user';

    if (!$username || !$email || !$password) {
        jsonResponse(['ok' => false, 'message' => 'All fields required.'], 400);
    }

    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        jsonResponse(['ok' => false, 'message' => 'Email already registered.'], 409);
    }

    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    $status = in_array($role, ['freelancer', 'admin']) ? 'pending' : 'active';

    $stmt = $pdo->prepare('INSERT INTO users (username, email, password, role, status) VALUES (?, ?, ?, ?, ?)');

    try {
        $stmt->execute([$username, $email, $hashedPassword, $role, $status]);
        $userId = $pdo->lastInsertId();

        // Send Email Notification
        require_once __DIR__ . '/mail_helper.php';
        sendNotification('general_alert', [
            'subject' => "New User Registration",
            'alert_text' => "A new user has registered.\nUsername: $username\nEmail: $email\nRole: $role\nStatus: $status"
        ]);

        // Only log them in immediately if active
        if ($status === 'active') {
            $_SESSION['user_id'] = $userId;
            $_SESSION['username'] = $username;
            $_SESSION['role'] = $role;
            jsonResponse(['ok' => true, 'user' => ['username' => $username, 'role' => $role], 'status' => $status]);
        } else {
            jsonResponse(['ok' => true, 'message' => 'Account created! Please wait for admin approval.', 'status' => $status]);
        }
    } catch (Throwable $e) {
        jsonResponse(['ok' => false, 'message' => 'Signup failed.'], 500);
    }
}

// Login Logic
if ($method === 'POST' && $action === 'login') {
    $userVal = trim((string)($body['email'] ?? $body['username'] ?? ''));
    $passVal = trim((string)($body['password'] ?? ''));

    if (!$userVal || !$passVal) {
        jsonResponse(['ok' => false, 'message' => 'Enter email and password.'], 400);
    }

    // Look for user by email OR username
    $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ? OR username = ?');
    $stmt->execute([$userVal, $userVal]);
    $user = $stmt->fetch();

    if ($user && password_verify($passVal, $user['password'])) {
        if (($user['status'] ?? 'active') === 'pending') {
            jsonResponse(['ok' => false, 'message' => 'Your account is pending approval.'], 403);
        }

        if (($user['status'] ?? 'active') === 'rejected') {
            jsonResponse(['ok' => false, 'message' => 'Your account application was rejected.'], 403);
        }

        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['role'] = $user['role'];

        jsonResponse([
            'ok' => true,
            'user' => ['username' => $user['username'], 'role' => $user['role']]
        ]);
    }

    jsonResponse(['ok' => false, 'message' => 'Invalid email or password.'], 401);
}

if ($action === 'logout') {
    session_destroy();
    jsonResponse(['ok' => true]);
}

if ($method === 'POST' && $action === 'update_profile') {
    if (!isset($_SESSION['user_id'])) jsonResponse(['ok' => false, 'message' => 'Unauthorized'], 401);

    $userId = $_SESSION['user_id'];
    $username = trim((string)($body['username'] ?? ''));

    if (!$username) {
        jsonResponse(['ok' => false, 'message' => 'Username cannot be empty.'], 400);
    }

    try {
        $stmt = $pdo->prepare('UPDATE users SET username = ? WHERE id = ?');
        $stmt->execute([$username, $userId]);
        $_SESSION['username'] = $username;
        jsonResponse(['ok' => true, 'message' => 'Profile updated successfully!']);
    } catch (Throwable $e) {
        jsonResponse(['ok' => false, 'message' => 'Update failed.'], 500);
    }
}
