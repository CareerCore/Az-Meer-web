<?php
declare(strict_types=1);
session_start();
header('Content-Type: application/json; charset=utf-8');

// Disable error reporting for clean JSON output, but log them
ini_set('display_errors', '0');
error_reporting(E_ALL);

$configFile = __DIR__ . '/../myphp-db.php';
if (!file_exists($configFile)) {
    echo json_encode(['ok' => false, 'message' => 'Config file missing']);
    exit;
}
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
    // You might want to log $e->getMessage() to a file
    exit;
}

$type = $_GET['type'] ?? 'services';
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 0;
$validTypes = ['services', 'portfolio', 'blogs', 'faqs', 'team', 'settings', 'top_services', 'users', 'orders'];

if (!in_array($type, $validTypes)) {
    echo json_encode(['ok' => false, 'message' => 'Invalid type']);
    exit;
}

// Special case for team (Unified with Users)
if ($type === 'team') {
    try {
        // Use CASE statement for cross-driver compatibility (works on both MySQL and SQLite)
        $stmt = $pdo->query("
            SELECT id, username, display_name, role, bio, info, about, image, skills, competencies, experience, education, projects, awards, languages, linkedin, github, twitter, created_at
            FROM users
            WHERE role IN ('owner', 'admin', 'manager', 'freelancer')
            ORDER BY
                CASE role
                    WHEN 'owner' THEN 1
                    WHEN 'admin' THEN 2
                    WHEN 'manager' THEN 3
                    WHEN 'freelancer' THEN 4
                    ELSE 5
                END, id DESC
        ");
        echo json_encode(['ok' => true, 'team' => $stmt->fetchAll()]);
        exit;
    } catch (Exception $e) {
        echo json_encode(['ok' => true, 'team' => []]);
        exit;
    }
}

// Special case for orders (JOIN for detailed info)
if ($type === 'orders') {
    $role = $_SESSION['role'] ?? 'user';
    $userId = $_SESSION['user_id'] ?? 0;

    try {
        $sql = "
            SELECT o.*, s.title as service_name, u.username as client_name, u.email as client_email, f.username as assigned_name
            FROM orders o
            LEFT JOIN services s ON o.service_id = s.id
            LEFT JOIN users u ON o.user_id = u.id
            LEFT JOIN users f ON o.assigned_to = f.id
        ";

        if ($role === 'freelancer') {
            // Freelancers only see orders assigned to them
            $stmt = $pdo->prepare($sql . " WHERE o.assigned_to = ? ORDER BY o.id DESC");
            $stmt->execute([$userId]);
        } else {
            // Admins/Owners see everything
            $stmt = $pdo->query($sql . " ORDER BY o.id DESC");
        }
        echo json_encode(['ok' => true, 'orders' => $stmt->fetchAll()]);
        exit;
    } catch (Exception $e) {
        echo json_encode(['ok' => false, 'message' => 'Orders fetch error: ' . $e->getMessage()]);
        exit;
    }
}

// General case for other tables
try {
    $orderBy = ($type === 'team') ? 'sort_order ASC, id DESC' : 'id DESC';

    // Support filtering for users (Moderation Queue)
    if ($type === 'users' && isset($_GET['status'])) {
        $stmt = $pdo->prepare("SELECT id, username, email, role, status, created_at FROM users WHERE status = ? ORDER BY id DESC");
        $stmt->execute([$_GET['status']]);
        echo json_encode(['ok' => true, 'users' => $stmt->fetchAll()]);
        exit;
    }

    // Use backticks for table name to prevent SQL errors with reserved words
    $query = "SELECT * FROM `$type` ORDER BY $orderBy";
    if ($limit > 0) {
        $query .= " LIMIT $limit";
    }
    $stmt = $pdo->query($query);
    echo json_encode(['ok' => true, $type => $stmt->fetchAll()]);
} catch (Throwable $e) {
    echo json_encode(['ok' => true, $type => []]); // Return empty if table doesn't exist yet
}
