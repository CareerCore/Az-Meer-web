<?php
session_set_cookie_params([
    'path' => '/',
    'samesite' => 'Lax'
]);
session_start();

if (!isset($_SESSION['user_id'])) {
    header('Location: auth.html');
    exit;
}

$role = $_SESSION['role'] ?? 'user';

switch ($role) {
    case 'owner':
        header('Location: owner.html');
        break;
    case 'admin':
        header('Location: admin.html');
        break;
    case 'manager':
        header('Location: admin.html'); // Managers use admin.html now
        break;
    case 'freelancer':
        header('Location: freelancer.html');
        break;
    case 'user':
    default:
        header('Location: profile.html');
        break;
}
exit;
