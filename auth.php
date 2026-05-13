<?php

declare(strict_types=1);

session_start();

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

$configFile = __DIR__ . '/myphp-db.php';
if (!file_exists($configFile)) {
    jsonResponse(['ok' => false, 'message' => 'Database config missing.'], 500);
}

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
    jsonResponse(['ok' => false, 'message' => 'DB connection failed.', 'error' => $e->getMessage()], 500);
}

function jsonResponse(array $payload, int $statusCode = 200): void
{
    http_response_code($statusCode);
    echo json_encode($payload);
    exit;
}

function sanitizeUser(array $user): array
{
    return [
        'id' => $user['id'] ?? null,
        'username' => $user['username'] ?? '',
        'email' => $user['email'] ?? '',
        'role' => $user['role'] ?? 'user',
        'createdAt' => $user['created_at'] ?? null,
    ];
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = $_GET['action'] ?? '';
$body = [];

if ($method === 'POST') {
    $raw = file_get_contents('php://input');
    if ($raw !== false && trim($raw) !== '') {
        $decoded = json_decode($raw, true);
        if (is_array($decoded)) {
            $body = $decoded;
        }
    }
    $action = $body['action'] ?? $action;
}

if ($action === 'session') {
    if (!isset($_SESSION['user_id'])) {
        jsonResponse(['ok' => false, 'session' => null]);
    }

    $stmt = $pdo->prepare('SELECT * FROM users WHERE id = ?');
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch();

    jsonResponse([
        'ok' => true,
        'session' => [
            'username' => $_SESSION['username'] ?? $user['username'] ?? 'User'
        ],
        'user' => $user ? sanitizeUser($user) : ['username' => $_SESSION['username'], 'profile' => []]
    ]);
}

if ($action === 'logout') {
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
    }
    session_destroy();
    jsonResponse(['ok' => true]);
}

if ($method !== 'POST') {
    jsonResponse(['ok' => false, 'message' => 'Method not allowed.'], 405);
}

if ($action === 'register') {
    $username = trim((string)($body['username'] ?? ''));
    $password = (string)($body['password'] ?? '');
    $profile = $body['profile'] ?? [];

    if ($username === '' || $password === '') {
        jsonResponse(['ok' => false, 'reason' => 'invalid', 'message' => 'Username and password are required.'], 400);
    }

    $users = readUsers($usersFile);
    foreach ($users as $existing) {
        if (($existing['username'] ?? '') === $username) {
            jsonResponse(['ok' => false, 'reason' => 'exists', 'message' => 'Username already exists.'], 409);
        }
    }

    $newUser = [
        'username' => $username,
        'passwordHash' => password_hash($password, PASSWORD_DEFAULT),
        'profile' => is_array($profile) ? $profile : [],
        'createdAt' => date(DATE_ATOM),
    ];

    $users[] = $newUser;

    if (!writeUsers($usersFile, $users)) {
        jsonResponse(['ok' => false, 'message' => 'Unable to save user.'], 500);
    }

    $_SESSION['username'] = $username;

    jsonResponse([
        'ok' => true,
        'user' => sanitizeUser($newUser)
    ]);
}

if ($action === 'login') {
    $username = trim((string)($body['username'] ?? ''));
    $password = (string)($body['password'] ?? '');

    if ($username === '' || $password === '') {
        jsonResponse(['ok' => false, 'message' => 'Username and password are required.'], 400);
    }

    // Find user by username or email
    $stmt = $pdo->prepare('SELECT * FROM users WHERE username = ? OR email = ?');
    $stmt->execute([$username, $username]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password'])) {
        jsonResponse(['ok' => false, 'message' => 'Invalid credentials.'], 401);
    }

    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['role'] = $user['role'];

    jsonResponse([
        'ok' => true,
        'user' => sanitizeUser($user)
    ]);
}

jsonResponse(['ok' => false, 'message' => 'Unknown action.'], 400);
