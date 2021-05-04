<?php
include dirname(dirname(__FILE__)) . '/php/config.php';

// на какие данные рассчитан этот скрипт
header("Content-Type: application/json");
// разбираем JSON-строку на составляющие встроенной командой
$cupboard = json_decode(file_get_contents("php://input"));

$path = '../orders/';
$nameFile = $cupboard->loginInstagram . '.txt';

date_default_timezone_set("Europe/Minsk"); 
$date_today = date("d.m.y H:i:s");

//Шкаф начало
$price = round($cupboard->price * COEFFICIENT, 0, PHP_ROUND_HALF_DOWN);

$compartments = $cupboard->compartments;

$support = $cupboard->support;

$shelfs = $cupboard->shelfs->count > 0 ? PHP_EOL ."	Полки: Количество: " . $cupboard->shelfs->count . " Цена: " . $cupboard->shelfs->price:'';	

$separation = $cupboard->separation->count > 0 ? PHP_EOL ."	Стойки: Количество: " . $cupboard->separation->count . " Цена: " . $cupboard->separation->price:'';	

$facadeAndresol = $cupboard->facadeAndresol->count > 0 ? PHP_EOL ."	Фасадов антресолей: Количество: " . $cupboard->facadeAndresol->count . " Цена: " . $cupboard->facadeAndresol->price:'';	

$rollonDrawer = $cupboard->rollonDrawer->count > 0 ? PHP_EOL ."	Шариковые шуфляды: Количество: " . $cupboard->rollonDrawer->count . " Цена: " . $cupboard->rollonDrawer->price:'';	

$tandemDrawer = $cupboard->tandemDrawer->count > 0 ? PHP_EOL ."	Tandem шуфляды: Количество: " . $cupboard->tandemDrawer->count . " Цена: " . $cupboard->tandemDrawer->price:'';	
//Шкаф конец



//Двери начало
$doorsText = '';
if (!empty($cupboard->doors)){
$index = 1;
foreach ($cupboard->doors as $door) {
	$openingSystem = $door->openingSystem;

	$material = $door->material . ' Цена: ' . $door->priceMaterial;

	$zFacade = '';
	if (property_exists($door->zFacade, 'price')) {
		$material = $door->material . ' Цена:' . $door->zFacade->price;
		$mirror = $door->zFacade->mirror;
		$assemblyFacad = $door->zFacade->assemblyFacad;
		$corners = $door->zFacade->corners;
		$zFacade = PHP_EOL .<<<ZFACADE
				Наполнение двери: $mirror->name Цена: $mirror->price
				Сборка фасада Количество: $assemblyFacad->count Цена: $assemblyFacad->price
				Уголки Количество: $corners->count Цена: $corners->price
		ZFACADE;
	}

	$handles = $door->furnitureDoors->handles;
	$handles = $handles->count > 0 ? PHP_EOL ."		Ручки ($handles->name): Количество: " . $handles->count . " Цена: " . $handles->price:'';	

	$loops = $door->furnitureDoors->loops;
	$loops = $loops->count > 0 ? PHP_EOL ."		Петли: Количество: " . $loops->count . " Цена: " . $loops->price:'';	

	$rectifier = $door->furnitureDoors->rectifier;
	$rectifier = $rectifier->count > 0 ? PHP_EOL ."		Выпрямители: Количество: " . $rectifier->count . " Цена: " . $rectifier->price:'';

		$doorsText .= PHP_EOL . PHP_EOL . <<<DOORS
			Двери №$index Цена: $door->price
			Система открывания: $openingSystem->name Цена: $openingSystem->price
			Высота: $door->height
			Ширина: $door->width
			Количество: $door->count
			$material (Площадь: $door->square, Периметр: $door->perimeter) $zFacade $handles $loops $rectifier
	DOORS;
	$index++;
}
}
//Двери конец

//Антресоль начало
$antresolText = '';
if (!empty($cupboard->antresol)){
$index = 1;
foreach ($cupboard->antresol as $antresol) {
	$facade = $antresol->facade;

	$miracle = $facade->miracle ? PHP_EOL . "		Наполнение двери: $facade->miracle Цена: $facade->priceMiracle" : '';
	$assemblyFacad = $facade->assemblyFacad->count > 0 ? PHP_EOL . '		Сборка фасада: Количество: ' . $facade->assemblyFacad->count .' Цена: '.$facade->assemblyFacad->price : '';	
	$corners = $facade->corners->count > 0 ? PHP_EOL . '		Уголки: Количество: ' . $facade->corners->count . ' Цена: ' . $facade->corners->price : '';	

	$facadePrice = $facade->price;
	if($facade->name === 'Z-фасад'){
		$facadePrice = $facade->priceZprofile;
	}

	$antresolText .= PHP_EOL . PHP_EOL . <<<ANTRESOL
			Антресоль №$index Цена: $antresol->price
			Высота: $antresol->height
			Ширина: $antresol->width
			Количество: $antresol->count
			Корпус Цена: $antresol->priceBody
			$facade->name Количество: $facade->count (Площадь: $facade->square, Периметр: $facade->perimeter) Цена: $facadePrice $miracle $assemblyFacad $corners
			Фурнитура: Цена: $antresol->priceFurniture
	ANTRESOL;
	$index++;
}
}
//Антресоль начало


//Встроенная тумба начало
$builtinTumbaText = '';
if (!empty($cupboard->builtinTumba)){
$index = 1;
foreach ($cupboard->builtinTumba as $builtinTumba) {
	$openingSystem = $builtinTumba->openingSystem;
	$facade = $builtinTumba->facade;
	$plunging = $builtinTumba->plunging ? ' Навесная' : '';
	$builtinTumbaText .= PHP_EOL . PHP_EOL . <<<BUILTINTUMBA
			Встроенная тумба$plunging №$index Цена: $builtinTumba->price
			Высота: $builtinTumba->height
			Ширина: $builtinTumba->width
			Количество: $builtinTumba->count
			Система открывания: $openingSystem->name Цена: $openingSystem->price
			Корпус Цена: $builtinTumba->priceBody
			$facade->name Количество фасадов: $builtinTumba->countDoors (Площадь: $builtinTumba->squareFacade, Периметр: $builtinTumba->perimeterFacade) Цена: $facade->price
	BUILTINTUMBA;
	$index++;
}
}
//Встроенная тумба конец

//Рейки начало
$railText = '';
if (!empty($cupboard->rail)){
$index = 1;
foreach ($cupboard->rail as $rail) {
	$length = round($rail->length / 90, 0, PHP_ROUND_HALF_DOWN);
	$railText .= PHP_EOL . PHP_EOL . <<<BUILTINTUMBA
			Рейки №$index Цена: $rail->price
			Длина: $rail->length
			Количество: $length
	BUILTINTUMBA;
	$index++;
}
}
//Рейки конец

//Металлоконструкция начало
$metalStructuresText = '';
if (!empty($cupboard->metalStructures)){
$index = 1;
foreach ($cupboard->metalStructures as $metalStructures) {
	$metalStructuresText .= PHP_EOL . PHP_EOL . <<<METALSTRUCTURES
			Металлоконструкция №$index Цена: $metalStructures->price
			Длина: $metalStructures->length
	METALSTRUCTURES;
	$index++;
}
}
//Металлоконструкция конец

//Зеркало начало
$mirrorText = '';
if (!empty($cupboard->mirror)){
$index = 1;
foreach ($cupboard->mirror as $mirror) {
	$mirrorText .= PHP_EOL . PHP_EOL . <<<MIRROR
			Зеркало $mirror->name №$index Цена: $mirror->price
			Площадь: $mirror->square
	MIRROR;
	$index++;
}
}
//Зеркало конец



//Подсветка начало
$backlightText = '';
if (!empty($cupboard->backlight)){
$index = 1;
foreach ($cupboard->backlight as $backlight) {
	$backlightText .= PHP_EOL . PHP_EOL . <<<BACKLIGHT
			Подсветка №$index Цена: $backlight->price
			Длина в метрах: $backlight->length
	BACKLIGHT;
	$index++;
}
}
//Подсветка конец



$textTelegram = <<<CUPBOARD
Логин: $cupboard->loginInstagram
Ссылка: https://www.instagram.com/$cupboard->loginInstagram/
Цена: $price
Себестоимость: $cupboard->price
Высота: $cupboard->height
Ширина: $cupboard->width
Глубина: $cupboard->depth

	Корпус Цена: $cupboard->priceBody
	Отсеки Ширина: $compartments->width Количество: $compartments->count Цена: $compartments->price
	Опоры: Количество: $support->count Цена: $support->price $shelfs $separation $facadeAndresol $rollonDrawer $tandemDrawer $doorsText $antresolText $builtinTumbaText $railText $metalStructuresText $mirrorText $backlightText
CUPBOARD;

$textFile = <<<CUPBOARD
____________________________________________________________________________________________________
$date_today
$textTelegram
____________________________________________________________________________________________________
CUPBOARD;

file_put_contents($path . $nameFile, PHP_EOL . $textFile, FILE_APPEND);


echo

$token = TELEGRAM_TOKEN;

$chat_id = TELEGRAM_CHAT_ID;

// Отправка сообщения
$response = array(
	'chat_id' => $chat_id,
	'text' => $textTelegram,
);	
$ch = curl_init('https://api.telegram.org/bot' . $token . '/sendMessage');  
curl_setopt($ch, CURLOPT_POST, 1);  
curl_setopt($ch, CURLOPT_POSTFIELDS, $response);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, false);
curl_exec($ch);
curl_close($ch);

// отправляем в ответ строку с подтверждением
echo $price;