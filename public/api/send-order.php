<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(['success' => false, 'error' => 'Invalid JSON']);
    exit;
}

$name    = htmlspecialchars($input['name'] ?? '', ENT_QUOTES, 'UTF-8');
$phone   = htmlspecialchars($input['phone'] ?? '', ENT_QUOTES, 'UTF-8');
$email   = filter_var($input['email'] ?? '', FILTER_SANITIZE_EMAIL);
$date    = htmlspecialchars($input['date'] ?? '', ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($input['message'] ?? '', ENT_QUOTES, 'UTF-8');
$items   = $input['items'] ?? [];
$total   = floatval($input['total'] ?? 0);

if (empty($name) || empty($email)) {
    echo json_encode(['success' => false, 'error' => 'Brakuje wymaganych pól.']);
    exit;
}

$isContactOnly = empty($items);

$to = 'atrakcjenapanienski@gmail.com';
$subject = $isContactOnly
    ? "Nowa wiadomość od {$name}"
    : "Nowe zamówienie od {$name} — {$total} PLN";

// Build items HTML
$itemsHtml = '';
$itemsBlock = '';
if (!$isContactOnly) {
    foreach ($items as $i => $item) {
        $num = str_pad($i + 1, 2, '0', STR_PAD_LEFT);
        $itemName = htmlspecialchars($item['name'] ?? '', ENT_QUOTES, 'UTF-8');
        $price = floatval($item['price'] ?? 0);
        $priceType = $item['priceType'] ?? 'pcs';
        $guests = intval($item['guests'] ?? 1);
        $subtotal = floatval($item['subtotal'] ?? 0);

        $qtyInfo = $priceType === 'person'
            ? "{$guests} os. × {$price} PLN/os."
            : "{$price} PLN";

        $itemsHtml .= "
        <tr style='border-bottom: 1px solid #2a2a30;'>
            <td style='padding: 12px 16px; color: #fff; font-size: 14px;'>{$num}</td>
            <td style='padding: 12px 16px; color: #fff; font-size: 14px; font-weight: 600;'>{$itemName}</td>
            <td style='padding: 12px 16px; color: #aaa; font-size: 14px; text-align: center;'>{$qtyInfo}</td>
            <td style='padding: 12px 16px; color: #f472b6; font-size: 14px; font-weight: 600; text-align: right;'>{$subtotal} PLN</td>
        </tr>";
    }
}

$messageBlock = '';
if (!empty($message)) {
    $messageBlock = "
    <div style='padding: 24px 32px; border-bottom: 1px solid rgba(255,255,255,0.06);'>
        <h2 style='margin: 0 0 12px; color: #fff; font-size: 16px; font-weight: 600;'>Wiadomość od klienta</h2>
        <p style='margin: 0; color: rgba(255,255,255,0.6); font-size: 14px; line-height: 1.6; white-space: pre-wrap;'>{$message}</p>
    </div>";
}

$guests = htmlspecialchars($input['guests'] ?? '', ENT_QUOTES, 'UTF-8');

$dateRow = '';
if (!empty($date)) {
    $dateRow = "
    <tr>
        <td style='padding: 6px 0; color: rgba(255,255,255,0.4); font-size: 13px;'>Data wieczoru:</td>
        <td style='padding: 6px 0; color: #fff; font-size: 14px; font-weight: 500;'>{$date}</td>
    </tr>";
}

$guestsRow = '';
if (!empty($guests)) {
    $guestsRow = "
    <tr>
        <td style='padding: 6px 0; color: rgba(255,255,255,0.4); font-size: 13px;'>Liczba osób:</td>
        <td style='padding: 6px 0; color: #fff; font-size: 14px; font-weight: 500;'>{$guests}</td>
    </tr>";
}

$html = "
<div style='background: #0c0c10; padding: 40px 0; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif;'>
    <div style='max-width: 600px; margin: 0 auto; background: #131318; border-radius: 16px; border: 1px solid rgba(255,255,255,0.06); overflow: hidden;'>

        <div style='padding: 32px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.06);'>
            <h1 style='margin: 0; color: #f472b6; font-size: 24px; font-weight: 700;'>" . ($isContactOnly ? 'Nowa wiadomość' : 'Nowe zamówienie') . "</h1>
            <p style='margin: 8px 0 0; color: rgba(255,255,255,0.4); font-size: 14px;'>The Hen Experience</p>
        </div>

        <div style='padding: 24px 32px; border-bottom: 1px solid rgba(255,255,255,0.06);'>
            <h2 style='margin: 0 0 16px; color: #fff; font-size: 16px; font-weight: 600;'>Dane klienta</h2>
            <table style='width: 100%;'>
                <tr>
                    <td style='padding: 6px 0; color: rgba(255,255,255,0.4); font-size: 13px; width: 120px;'>Imię:</td>
                    <td style='padding: 6px 0; color: #fff; font-size: 14px; font-weight: 500;'>{$name}</td>
                </tr>
                <tr>
                    <td style='padding: 6px 0; color: rgba(255,255,255,0.4); font-size: 13px;'>Telefon:</td>
                    <td style='padding: 6px 0; color: #fff; font-size: 14px; font-weight: 500;'>{$phone}</td>
                </tr>
                <tr>
                    <td style='padding: 6px 0; color: rgba(255,255,255,0.4); font-size: 13px;'>Email:</td>
                    <td style='padding: 6px 0; color: #fff; font-size: 14px; font-weight: 500;'>{$email}</td>
                </tr>
                {$dateRow}
                {$guestsRow}
            </table>
        </div>

        " . ($isContactOnly ? "" : "
        <div style='padding: 24px 32px; border-bottom: 1px solid rgba(255,255,255,0.06);'>
            <h2 style='margin: 0 0 16px; color: #fff; font-size: 16px; font-weight: 600;'>Zamówione atrakcje</h2>
            <table style='width: 100%; border-collapse: collapse;'>
                <thead>
                    <tr style='border-bottom: 1px solid rgba(255,255,255,0.1);'>
                        <th style='padding: 8px 16px; color: rgba(255,255,255,0.3); font-size: 11px; text-align: left; text-transform: uppercase;'>#</th>
                        <th style='padding: 8px 16px; color: rgba(255,255,255,0.3); font-size: 11px; text-align: left; text-transform: uppercase;'>Atrakcja</th>
                        <th style='padding: 8px 16px; color: rgba(255,255,255,0.3); font-size: 11px; text-align: center; text-transform: uppercase;'>Cena</th>
                        <th style='padding: 8px 16px; color: rgba(255,255,255,0.3); font-size: 11px; text-align: right; text-transform: uppercase;'>Suma</th>
                    </tr>
                </thead>
                <tbody>
                    {$itemsHtml}
                </tbody>
            </table>
            <div style='margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1); text-align: right;'>
                <span style='color: rgba(255,255,255,0.4); font-size: 14px;'>Łącznie: </span>
                <span style='color: #f472b6; font-size: 22px; font-weight: 700;'>{$total} PLN</span>
            </div>
        </div>") . "

        {$messageBlock}

        <div style='padding: 24px 32px; text-align: center;'>
            <p style='margin: 0; color: rgba(255,255,255,0.25); font-size: 12px;'>
                Wiadomość wygenerowana automatycznie przez system rezerwacji The Hen Experience
            </p>
        </div>
    </div>
</div>";

$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
$headers .= "From: Wieczór Panieński Warszawa <biuro@wieczorpanienskiwarszawa.pl>\r\n";
$headers .= "Reply-To: {$email}\r\n";

$sent = mail($to, $subject, $html, $headers);

if ($sent) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Nie udało się wysłać wiadomości.']);
}
