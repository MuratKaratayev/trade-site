<?php
// Обработчик формы «Оставить заявку» для хостинга PS Cloud (Plesk, PHP 7.4+).
// Заявка уходит письмом на почту компании — как на старом сайте. На самом сайте данные не сохраняются.
// Форма (components/sections/LeadForm.tsx) отправляет сюда POST через fetch и ждёт JSON {status, fields?}.
// Тексты ошибок показывает форма на языке страницы, здесь — только коды.

declare(strict_types=1);

const LEAD_TO = 'info@trade-engeeniring.kz';
// Отправитель — ящик того же домена: письмо уходит с сервера домена, SPF (+a +mx) его пропускает
const LEAD_FROM = 'info@trade-engeeniring.kz';
const HONEYPOT = 'hp_extra_field_7';
const RATE_LIMIT = 5;        // заявок
const RATE_WINDOW = 600;     // за 10 минут с одного IP

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function reply(int $code, array $body): void
{
    http_response_code($code);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    reply(405, ['status' => 'error']);
}

// Только со страниц этого сайта (браузер присылает Origin при fetch)
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
// Сравниваем имена хостов без порта: Host может прийти как «example.kz:443»
$host = strtolower((string) preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST'] ?? ''));
if ($origin !== '' && strtolower((string) parse_url($origin, PHP_URL_HOST)) !== $host) {
    reply(403, ['status' => 'error']);
}

$field = static function (string $name, int $max): string {
    $v = $_POST[$name] ?? '';
    if (!is_string($v)) {
        return '';
    }
    $v = trim(str_replace("\0", '', $v));
    return mb_substr($v, 0, $max);
};

// Бот заполнил скрытое поле — отвечаем «успех», ничего не отправляем
if ($field(HONEYPOT, 200) !== '') {
    reply(200, ['status' => 'success']);
}

// Имя и телефон — в одну строку
$name = trim((string) preg_replace('/\s+/u', ' ', $field('name', 200)));
$phone = trim((string) preg_replace('/\s+/u', ' ', $field('phone', 50)));
$message = $field('message', 2100);
$consent = ($_POST['consent'] ?? '') === 'on';
$lang = ($_POST['lang'] ?? '') === 'kk' ? 'kk' : 'ru';

// Те же правила, что в браузере (lib/lead-validate.ts)
$errors = [];
$nameLen = mb_strlen($name);
if ($nameLen < 2 || $nameLen > 100) {
    $errors[] = 'name';
}
$digits = strlen(preg_replace('/\D/', '', $phone));
if ($digits < 10 || $digits > 15) {
    $errors[] = 'phone';
}
if (mb_strlen($message) > 2000) {
    $errors[] = 'message';
}
if (!$consent) {
    $errors[] = 'consent';
}
if ($errors) {
    reply(422, ['status' => 'error', 'fields' => $errors]);
}

// Простое ограничение частоты по IP (файл во временной папке хостинга)
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$bucket = sys_get_temp_dir() . '/trade-lead-' . hash('sha256', $ip);
$now = time();
$hits = [];
if (is_file($bucket)) {
    $hits = array_filter(
        array_map('intval', explode(',', (string) file_get_contents($bucket))),
        static function (int $t) use ($now): bool {
            return $t > $now - RATE_WINDOW;
        }
    );
}
if (count($hits) >= RATE_LIMIT) {
    reply(429, ['status' => 'failed']);
}
$hits[] = $now;
@file_put_contents($bucket, implode(',', $hits), LOCK_EX);

// Письмо. Данные посетителя — только в теле письма, не в заголовках (защита от подстановки заголовков).
$subject = 'Заявка с сайта trade-engeeniring.kz: ' . preg_replace('/[\r\n]+/', ' ', mb_substr($name, 0, 60));
$body = implode("\n", [
    'Новая заявка с сайта trade-engeeniring.kz',
    '',
    'Имя: ' . $name,
    'Телефон: ' . $phone,
    'Сообщение: ' . ($message !== '' ? "\n" . $message : '—'),
    '',
    'Язык страницы: ' . ($lang === 'kk' ? 'казахский' : 'русский'),
    'Согласие на обработку персональных данных: да',
    'Время: ' . (new DateTime('now', new DateTimeZone('Asia/Almaty')))->format('d.m.Y H:i'),
    'IP: ' . $ip,
]);
$headers = implode("\r\n", [
    'From: =?UTF-8?B?' . base64_encode('Сайт TRADE-Инжиниринг') . '?= <' . LEAD_FROM . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
]);
$sent = mail(LEAD_TO, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers, '-f' . LEAD_FROM);

reply($sent ? 200 : 500, ['status' => $sent ? 'success' : 'failed']);
