<?php
$income = false;
$stmt = $DB->prepare("SELECT cat_id, cat_income_flag FROM category WHERE cat_name=:cat_name");
$stmt->execute(['cat_name' => $_REQUEST['add_category']]);
$result = $stmt->fetch(PDO::FETCH_ASSOC);
if($result === false) {
	$stmt = $DB->prepare("INSERT INTO category (cat_name) VALUES (:cat_name)");
	$stmt->execute(['cat_name' => $_REQUEST['add_category']]);
	$catID = $DB->lastInsertId();
} else {
	$catID = $result['cat_id'];
	$income = $result['cat_income_flag'] == 1;
}
$stmt = $DB->prepare("SELECT pay_id FROM payee WHERE pay_name=:pay_name");
$stmt->execute(['pay_name' => $_REQUEST['add_payee']]);
$result = $stmt->fetch(PDO::FETCH_ASSOC);
if($result === false) {
	$stmt = $DB->prepare("INSERT INTO payee (pay_name) VALUES (:pay_name)");
	$stmt->execute(['pay_name' => $_REQUEST['add_payee']]);
	$payID = $DB->lastInsertId();
} else {
	$payID = $result['pay_id'];
}
$amount = $income ? (-1 * $_REQUEST['add_amount']) : $_REQUEST['add_amount'];

if($_REQUEST['skipdupe'] != 1) {
	$stmt = $DB->prepare("SELECT trn_date, trn_description FROM transaction WHERE trn_pay_id=:trn_payee AND trn_amount=:trn_amount AND trn_date BETWEEN DATE_ADD(:trn_date, INTERVAL :dupebefore DAY) AND DATE_ADD(:trn_date, INTERVAL :dupeafter DAY)");
	$args = [
		'trn_date' => $_REQUEST['add_date'],
		'trn_payee' => $payID,
		'trn_amount' => $amount,
		'dupebefore' => $DUPECHECK['before'],
		'dupeafter' => $DUPECHECK['after']
	];
	$stmt->execute($args);
	$dupeResult = $stmt->fetch(PDO::FETCH_ASSOC);
	if($dupeResult !== false) {
		header("HTTP/1.0 409 Conflict");
		jsonheader();
		echo json_encode(['dupe' => $dupeResult]);
		exit();
	}
}

$stmt = $DB->prepare("INSERT INTO transaction (trn_date, trn_cat_id, trn_pay_id, trn_amount, trn_description) VALUES (:trn_date, :trn_cat_id, :trn_pay_id, :trn_amount, :trn_description)");
$args = [
	'trn_date' => $_REQUEST['add_date'],
	'trn_cat_id' => $catID,
	'trn_pay_id' => $payID,
	'trn_amount' => $amount,
	'trn_description' => $_REQUEST['add_description']
];
$stmt->execute($args);

header('Location: /');