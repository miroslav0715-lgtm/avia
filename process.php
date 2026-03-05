<?php
// process.php
// Устанавливаем заголовок, чтобы вернуть JSON
header('Content-Type: application/json');

// Проверяем, что запрос пришёл методом POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Метод не поддерживается']);
    exit;
}

// Получаем и фильтруем данные
$from = isset($_POST['from']) ? trim($_POST['from']) : '';
$to = isset($_POST['to']) ? trim($_POST['to']) : '';
$depart = isset($_POST['depart']) ? trim($_POST['depart']) : '';
$return = isset($_POST['return']) ? trim($_POST['return']) : '';
$passengers = isset($_POST['passengers']) ? (int)$_POST['passengers'] : 1;
$class = isset($_POST['class']) ? trim($_POST['class']) : 'economy';

// Простейшая валидация
$errors = [];
if (empty($from)) {
    $errors[] = 'Укажите город вылета';
}
if (empty($to)) {
    $errors[] = 'Укажите город назначения';
}
if (empty($depart)) {
    $errors[] = 'Укажите дату вылета';
}
if ($passengers < 1 || $passengers > 9) {
    $errors[] = 'Количество пассажиров должно быть от 1 до 9';
}

// Если есть ошибки, возвращаем их
if (!empty($errors)) {
    echo json_encode(['success' => false, 'message' => implode('. ', $errors)]);
    exit;
}

// Симулируем успешное бронирование (в реальном проекте здесь была бы запись в БД, отправка email и т.д.)
$responseMessage = "Билет успешно забронирован! Рейс $from → $to, дата: $depart" . 
                   (!empty($return) ? ", обратно: $return" : "") . 
                   ", пассажиров: $passengers, класс: $class. Спасибо, что выбрали SkyWings!";

// Возвращаем успешный ответ
echo json_encode(['success' => true, 'message' => $responseMessage]);
exit;
?>
