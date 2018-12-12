<?php

if ($POSTDATA['amount'] == '' || $POSTDATA['category'] == '' || $POSTDATA['payee'] == '' || $POSTDATA['date'] == '')
	exit();
$payee = R::findOrCreate('payee', ['name' => $POSTDATA['payee'], 'site' => SITE, 'deleted' => 0]);

$baseTransaction = [
	'payee' => $POSTDATA['payee'],
	'date' => new DateTime($POSTDATA['date'])
];
$subTransactions[] = $baseTransaction + [
	'category' => $POSTDATA['category'],
	'amount' => $POSTDATA['amount'],
	'description' => $POSTDATA['description'],
];

$s = 1;
while ($POSTDATA["amount_{$s}"] != '') {
	$subTransactions[] = $baseTransaction + [
		'category' => $POSTDATA["category_{$s}"],
		'amount' => $POSTDATA["amount_{$s}"],
		'description' => $POSTDATA["description_{$s}"],
	];
	$s++;
}
if(count($subTransactions) > 1) {
	$transactionGroup = SITE . $payee->id . time();
}

foreach($subTransactions as $tran) {
	if($tran['amount'] == 0) continue;
	$category = R::findOrCreate('category', ['name' => $tran['category'], 'site' => SITE, 'deleted' => 0]);

	$transaction = R::dispense('transaction');
	$transaction->site = SITE;
	$transaction->category = $category;
	$transaction->payee = $payee;
	$transaction->amount = $tran['amount'];
	$transaction->description = $tran['description'];
	$transaction->date = $tran['date'];
	if($transactionGroup != null) {
		$transaction->group = $transactionGroup;
	}
	R::store($transaction);
}

echo json_encode('OK');
exit();
