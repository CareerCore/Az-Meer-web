<?php
declare(strict_types=1);
session_start();

header('Content-Type: application/json');

// --- CONFIGURATION ---
define('BINANCE_PAY_API_KEY', 'bU7jl5i96E8O5viZZegKb7IApu8OGwmVcPW5xS8wQHNLnohbZPDeoD3NgfVa640E');
define('BINANCE_PAY_SECRET_KEY', 'TbHtLF9HYjzdznYFwxiQA4cMGhbDyB4qcuBdVMrnqoki7QjElbn1dYiFnHMsCfg');
define('BINANCE_PAY_CERTIFICATE_SN', '000000000'); // Update this from your Binance Merchant Profile
define('BINANCE_PAY_API_URL', 'https://bpay.binanceapi.com');

function jsonResponse(array $payload, int $statusCode = 200): void {
    http_response_code($statusCode);
    echo json_encode($payload);
    exit;
}

$action = $_GET['action'] ?? '';

if ($action === 'create_order') {
    $raw = file_get_contents('php://input');
    $body = json_decode((string)$raw, true) ?? [];

    $amount = (float)($body['amount'] ?? 0);
    $orderId = (string)($body['orderId'] ?? bin2hex(random_bytes(8)));
    $productName = (string)($body['productName'] ?? 'Project Deposit');

    if ($amount <= 0) jsonResponse(['ok' => false, 'message' => 'Invalid amount'], 400);

    // Prepare Request Body for Binance
    $requestBody = [
        'env' => [
            'terminalType' => 'WEB'
        ],
        'merchantTradeNo' => $orderId,
        'orderAmount' => $amount,
        'currency' => 'USDT',
        'goods' => [
            'goodsType' => '01',
            'goodsCategory' => 'Software',
            'referenceGoodsId' => 'project_01',
            'goodsName' => $productName,
        ],
        'returnUrl' => 'https://' . $_SERVER['HTTP_HOST'] . '/Az%20Meer%20Web/profile.html',
        'cancelUrl' => 'https://' . $_SERVER['HTTP_HOST'] . '/Az%20Meer%20Web/payments.html'
    ];

    $jsonPayload = json_encode($requestBody);
    $timestamp = round(microtime(true) * 1000);
    $nonce = bin2hex(random_bytes(16));

    // Generate Signature
    $payloadToSign = $timestamp . "\n" . $nonce . "\n" . $jsonPayload . "\n";
    $signature = strtoupper(hash_hmac('sha512', $payloadToSign, BINANCE_PAY_SECRET_KEY));

    // Execute CURL
    $ch = curl_init(BINANCE_PAY_API_URL . '/binancepay/openapi/v2/order');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonPayload);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'BinancePay-Timestamp: ' . $timestamp,
        'BinancePay-Nonce: ' . $nonce,
        'BinancePay-Certificate-SN: ' . BINANCE_PAY_CERTIFICATE_SN,
        'BinancePay-Signature: ' . $signature
    ]);

    $response = curl_exec($ch);
    $err = curl_error($ch);
    curl_close($ch);

    if ($err) jsonResponse(['ok' => false, 'message' => 'CURL Error: ' . $err], 500);

    $data = json_decode($response, true);

    if (isset($data['status']) && $data['status'] === 'SUCCESS') {
        jsonResponse(['ok' => true, 'checkoutUrl' => $data['data']['checkoutUrl']]);
    } else {
        jsonResponse(['ok' => false, 'message' => $data['errorMessage'] ?? 'Binance API Error', 'debug' => $data]);
    }
}

jsonResponse(['ok' => false, 'message' => 'Invalid action'], 404);
