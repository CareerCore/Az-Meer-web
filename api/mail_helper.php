<?php
declare(strict_types=1);

function sendNotification(string $type, array $data, $pdo = null): bool {
    $config = require __DIR__ . '/mail_config.php';
    if (!$config['enabled']) return false;

    $to = [];
    $subject = "";
    $message = "";

    // 1. Determine Recipients and Content based on type
    switch ($type) {
        case 'new_order':
            $subject = "New Order Placed: #" . ($data['order_id'] ?? '');
            $to[] = $data['client_email'] ?? '';
            $to[] = $config['admin_email'];
            $to[] = $config['owner_email'];
            $message = "A new order has been placed.\nOrder ID: " . ($data['order_id'] ?? '') . "\nService: " . ($data['service_title'] ?? '') . "\nPrice: $" . ($data['price'] ?? '');
            break;

        case 'status_change':
            $subject = "Order Status Updated: #" . ($data['order_id'] ?? '');
            $to[] = $data['client_email'] ?? '';
            if (!empty($data['freelancer_email'])) $to[] = $data['freelancer_email'];
            $to[] = $config['admin_email'];
            $message = "Your order status has been updated to: " . strtoupper($data['status'] ?? 'pending');
            break;

        case 'new_message':
            $subject = "New Message in Project: #" . ($data['order_id'] ?? 'General');
            $to[] = $data['recipient_email'] ?? '';
            $message = "You have received a new message from " . ($data['sender_name'] ?? 'System') . ":\n\n\"" . ($data['message'] ?? '') . "\"";
            break;

        case 'order_assigned':
            $subject = "Order Assigned to You: #" . ($data['order_id'] ?? '');
            $to[] = $data['freelancer_email'] ?? '';
            $message = "You have been assigned a new project.\nOrder ID: " . ($data['order_id'] ?? '') . "\nClient: " . ($data['client_name'] ?? '');
            break;

        case 'general_alert':
            $subject = $data['subject'] ?? "System Alert";
            $to[] = $config['owner_email'];
            $message = $data['alert_text'] ?? "General system alert.";
            break;
    }

    if (empty($to)) return false;

    // Filter out empty emails and duplicates
    $to = array_unique(array_filter($to));

    // 2. Prepare HTML Template
    $htmlContent = "
    <html>
    <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
        <div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;'>
            <div style='text-align: center; margin-bottom: 20px;'>
                <h2 style='color: #2563eb;'>Az Meer Notifications</h2>
            </div>
            <p>" . nl2br(htmlspecialchars($message)) . "</p>
            <div style='margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px; font-size: 0.8rem; color: #888;'>
                <p>This is an automated notification from Az Meer(SMC-Private) Limited.</p>
                <p>&copy; 2024 Az Meer. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>";

    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: " . $config['from_name'] . " <" . $config['from_email'] . ">" . "\r\n";

    // 3. Send Emails
    $success = true;
    foreach ($to as $recipient) {
        if (!mail($recipient, $subject, $htmlContent, $headers)) {
            $success = false;
        }
    }

    return $success;
}
