<?php
declare(strict_types=1);
session_start();

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

// Silence errors to prevent corrupting JSON output
ini_set('display_errors', '0');
error_reporting(E_ALL);

function jsonResponse(array $payload, int $statusCode = 200): void {
    http_response_code($statusCode);
    echo json_encode($payload);
    exit;
}

$configFile = __DIR__ . '/../myphp-db.php';
if (!file_exists($configFile)) {
    jsonResponse(['ok' => false, 'message' => 'Config file missing'], 500);
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
        $dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=%s', $db['host'], $db['port'], $db['database'], $db['charset']);
        $pdo = new PDO($dsn, $db['username'], $db['password'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    }
} catch (Throwable $e) {
    jsonResponse(['ok' => false, 'message' => 'Database Connection Error: ' . $e->getMessage()], 500);
}

try {
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    $raw = file_get_contents('php://input');
    $body = json_decode((string)$raw, true) ?? [];
    $action = $_GET['action'] ?? $body['action'] ?? '';

    // Guest Init Chat
    if ($action === 'init') {
        // If logged in, prioritize user info
        $userId = $_SESSION['user_id'] ?? null;
        $sessionId = $_SESSION['chat_session_id'] ?? bin2hex(random_bytes(16));
        $_SESSION['chat_session_id'] = $sessionId;

        $checkOnly = (bool)($body['check_only'] ?? false);

        // Try to find an open chat for this session or user
        if ($userId) {
            // Priority: Find by email first (for returning logged-in users)
            $uStmt = $pdo->prepare("SELECT email FROM users WHERE id = ?");
            $uStmt->execute([$userId]);
            $userEmail = $uStmt->fetchColumn();

            $stmt = $pdo->prepare("SELECT * FROM live_chats WHERE (guest_email = ? OR session_id = ?) AND status = 'open' ORDER BY id DESC LIMIT 1");
            $stmt->execute([$userEmail, $sessionId]);
        } else {
            $stmt = $pdo->prepare("SELECT * FROM live_chats WHERE session_id = ? AND status = 'open' ORDER BY id DESC LIMIT 1");
            $stmt->execute([$sessionId]);
        }

        $chat = $stmt->fetch();

        if ($checkOnly) {
            jsonResponse(['ok' => true, 'chatId' => ($chat && isset($chat['id'])) ? (int)$chat['id'] : null]);
        }

        if ($chat && isset($chat['id'])) {
            $chatId = (int)$chat['id'];
        } else {
            $name = trim((string)($body['guest_name'] ?? 'Guest'));
            $email = trim((string)($body['guest_email'] ?? ''));
            $orderId = (int)($body['orderId'] ?? 0);

            if ($userId) {
                $uStmt = $pdo->prepare("SELECT username, email FROM users WHERE id = ?");
                $uStmt->execute([$userId]);
                $user = $uStmt->fetch();
                if ($user) {
                    $name = $user['username'];
                    $email = $user['email'];
                }
            }

            // One more check for order-specific chat
            if ($orderId) {
                $oStmt = $pdo->prepare("SELECT id FROM live_chats WHERE order_id = ? LIMIT 1");
                $oStmt->execute([$orderId]);
                $existing = $oStmt->fetch();
                if ($existing) {
                    jsonResponse(['ok' => true, 'chatId' => (int)$existing['id'], 'sessionId' => $sessionId]);
                }
            }

            $stmt = $pdo->prepare("INSERT INTO live_chats (session_id, guest_name, guest_email, order_id) VALUES (?, ?, ?, ?)");
            $stmt->execute([$sessionId, $name, $email, $orderId ?: null]);
            $chatId = (int)$pdo->lastInsertId();
        }

        jsonResponse(['ok' => true, 'chatId' => $chatId, 'sessionId' => $sessionId]);
    }

    // Send Message
    if ($action === 'send') {
        $chatId = (int)($body['chatId'] ?? 0);
        $message = trim((string)($body['message'] ?? ''));
        $senderId = $_SESSION['user_id'] ?? null;

        if (!$chatId || !$message) {
            jsonResponse(['ok' => false, 'message' => 'Missing data'], 400);
        }

        $stmt = $pdo->prepare("INSERT INTO live_messages (chat_id, sender_id, message) VALUES (?, ?, ?)");
        $stmt->execute([$chatId, $senderId, $message]);

        // Send Email Notification
        require_once __DIR__ . '/mail_helper.php';

        // Find recipient(s) for this message
        // If sender is staff, notify client. If sender is client, notify staff.
        $chatStmt = $pdo->prepare("SELECT guest_email, guest_name, assigned_to, order_id FROM live_chats WHERE id = ?");
        $chatStmt->execute([$chatId]);
        $chat = $chatStmt->fetch();

        if ($chat) {
            $senderStmt = $pdo->prepare("SELECT username, role, email FROM users WHERE id = ?");
            $senderStmt->execute([$senderId]);
            $sender = $senderStmt->fetch();

            $isStaff = $sender && in_array($sender['role'], ['admin', 'owner', 'manager', 'freelancer']);

            if ($isStaff) {
                // Staff sent message -> Notify Client
                sendNotification('new_message', [
                    'order_id' => $chat['order_id'],
                    'recipient_email' => $chat['guest_email'],
                    'sender_name' => $sender['username'],
                    'message' => $message
                ]);
            } else {
                // Client/Guest sent message -> Notify Assigned Staff and/or Admin
                $recipientEmail = '';
                if ($chat['assigned_to']) {
                    $staffStmt = $pdo->prepare("SELECT email FROM users WHERE id = ?");
                    $staffStmt->execute([$chat['assigned_to']]);
                    $recipientEmail = $staffStmt->fetchColumn();
                }

                sendNotification('new_message', [
                    'order_id' => $chat['order_id'],
                    'recipient_email' => $recipientEmail, // If empty, mail_helper will fallback to admin/owner if configured or skip
                    'sender_name' => $sender ? $sender['username'] : ($chat['guest_name'] ?: 'Guest'),
                    'message' => $message
                ]);
            }
        }

        jsonResponse(['ok' => true]);
    }

    // Fetch Messages
    if ($action === 'fetch') {
        $chatId = (int)($_GET['chatId'] ?? 0);
        if (!$chatId) jsonResponse(['ok' => false], 400);

        $stmt = $pdo->prepare("
            SELECT m.*, u.username as sender_name, u.role as sender_role
            FROM live_messages m
            LEFT JOIN users u ON m.sender_id = u.id
            WHERE m.chat_id = ?
            ORDER BY m.created_at ASC
        ");
        $stmt->execute([$chatId]);
        $messages = $stmt->fetchAll();

        foreach ($messages as &$m) {
            $m['is_staff'] = !empty($m['sender_role']) && in_array($m['sender_role'], ['admin', 'owner', 'manager', 'freelancer']);
        }

        jsonResponse(['ok' => true, 'messages' => $messages]);
    }

    // Upload Receipt
    if ($action === 'upload') {
        $chatId = (int)($_POST['chatId'] ?? 0);
        $senderId = $_SESSION['user_id'] ?? null;

        if (!$chatId || !isset($_FILES['receipt'])) {
            jsonResponse(['ok' => false, 'message' => 'Missing data'], 400);
        }

        $file = $_FILES['receipt'];
        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $allowed = ['jpg', 'jpeg', 'png', 'pdf'];
        if (!in_array(strtolower($ext), $allowed)) {
            jsonResponse(['ok' => false, 'message' => 'Invalid file type'], 400);
        }

        $uploadDir = __DIR__ . '/../uploads/receipts/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

        $filename = 'receipt_' . $chatId . '_' . time() . '.' . $ext;
        $target = $uploadDir . $filename;

        if (move_uploaded_file($file['tmp_name'], $target)) {
            $filePath = 'uploads/receipts/' . $filename;
            $msgText = "Uploaded a receipt.";

            // We use the message column to store the path if it's an image,
            // but let's check if we have image_path column
            try {
                $stmt = $pdo->prepare("INSERT INTO live_messages (chat_id, sender_id, message, image_path) VALUES (?, ?, ?, ?)");
                $stmt->execute([$chatId, $senderId, $msgText, $filePath]);
            } catch (Exception $e) {
                // Fallback if image_path doesn't exist yet
                $stmt = $pdo->prepare("INSERT INTO live_messages (chat_id, sender_id, message) VALUES (?, ?, ?)");
                $stmt->execute([$chatId, $senderId, "[IMAGE]$filePath"]);
            }

            jsonResponse(['ok' => true, 'filePath' => $filePath]);
        } else {
            jsonResponse(['ok' => false, 'message' => 'Upload failed'], 500);
        }
    }

    // Staff actions...
    if ($action === 'list_staff') {
        if (!isset($_SESSION['user_id'])) jsonResponse(['ok' => false, 'message' => 'Unauthorized'], 401);
        $role = $_SESSION['role'];
        $userId = $_SESSION['user_id'];

        $sql = "SELECT c.*, u.username as freelancer_name
                FROM live_chats c
                LEFT JOIN users u ON c.assigned_to = u.id";

        if (in_array($role, ['admin', 'owner', 'manager'])) {
            // Admin/Owner/Manager can see everything
            $stmt = $pdo->query("$sql ORDER BY c.created_at DESC");
            $chats = $stmt->fetchAll();
        } else {
            // Freelancers see chats assigned to them OR unassigned chats so they can pick them up
            $stmt = $pdo->prepare("$sql WHERE c.assigned_to = ? OR c.assigned_to IS NULL ORDER BY c.created_at DESC");
            $stmt->execute([$userId]);
            $chats = $stmt->fetchAll();
        }
        jsonResponse(['ok' => true, 'chats' => $chats]);
    }

    if ($action === 'assign') {
        if (!isset($_SESSION['user_id'])) jsonResponse(['ok' => false, 'message' => 'Unauthorized'], 401);

        $role = $_SESSION['role'];
        $userId = $_SESSION['user_id'];
        $targetFreelancerId = $body['freelancerId'] ?? 0;
        $chatId = $body['chatId'] ?? 0;

        // Permission: Only Admin/Owner can assign to anyone.
        // Freelancers can only "Claim" (assign to themselves).
        if (!in_array($role, ['admin', 'owner'])) {
            if ((string)$targetFreelancerId !== (string)$userId) {
                jsonResponse(['ok' => false, 'message' => 'You can only assign chats to yourself.'], 403);
            }
        }

        $stmt = $pdo->prepare("UPDATE live_chats SET assigned_to = ? WHERE id = ?");
        $stmt->execute([$targetFreelancerId, $chatId]);
        jsonResponse(['ok' => true]);
    }

    jsonResponse(['ok' => false, 'message' => 'Action not found: ' . $action], 404);

} catch (Throwable $e) {
    jsonResponse(['ok' => false, 'message' => $e->getMessage()], 500);
}
