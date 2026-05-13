<?php
declare(strict_types=1);
session_start();
header('Content-Type: application/json; charset=utf-8');

// Security Check: Any authenticated user can upload (for profile images or receipts)
if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'message' => 'Unauthorized. Please login.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Method not allowed.']);
    exit;
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['ok' => false, 'message' => 'No file uploaded or upload error.']);
    exit;
}

$file = $_FILES['file'];
$uploadDir = __DIR__ . '/../uploads/';

// Ensure directory exists
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
$allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];

if (!in_array($ext, $allowed)) {
    echo json_encode(['ok' => false, 'message' => 'Invalid file type. Allowed: ' . implode(', ', $allowed)]);
    exit;
}

$newName = uniqid('img_', true) . '.' . $ext;
$targetPath = $uploadDir . $newName;

if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    // Return relative path from root
    echo json_encode(['ok' => true, 'path' => 'uploads/' . $newName]);
} else {
    echo json_encode(['ok' => false, 'message' => 'Failed to save file on server. Check permissions.']);
}