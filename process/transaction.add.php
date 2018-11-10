<?php
$category = R::findOrCreate('category', ['name' => $_REQUEST['category'], 'site' => SITE]);
$payee = R::findOrCreate('payee', ['name' => $_REQUEST['payee'], 'site' => SITE]);

$amount = $category->income ? -1 * $_REQUEST['amount'] : $_REQUEST['amount'];
$trnDate = $_REQUEST['date'];

$dupe = R::find('transaction', 'site=? AND category_id=? AND payee_id=? AND amount=? AND date BETWEEN DATE_ADD(?, INTERVAL ? DAY) AND DATE_ADD(?, INTERVAL ? DAY)',
	[ SITE, $category->id, $payee->id, $amount, $trnDate, $DUPECHECK['before'], $trnDate, $DUPECHECK['after'] ]);
if(count($dupe) > 0) {
	$dupe = $dupe[array_keys($dupe)[0]];
	header("HTTP/1.0 409 Conflict");
	jsonheader();
	echo json_encode(['dupe' => ['date' => $dupe->date, 'description' => $dupe->description]]);
	exit();
}

$transaction = R::dispense('transaction');
$transaction->site = SITE;
$transaction->category = $category;
$transaction->payee = $payee;
$transaction->amount = $amount;
$transaction->description = $_REQUEST['description'];
$transaction->date = new DateTime();
R::store($transaction);

exit();