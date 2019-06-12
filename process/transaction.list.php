<?php
$beans = R::find('transaction', "site=:site", [':site' => SITE]);
$transactions = ['timestamp' => time(), 'object' => 'transactions', 'list' => []];
$groupTotals = [];

$payees = [];
$categories = [];

foreach ($beans as $transaction) {
	$transaction->shortdate = substr($transaction->date, 0, 10);
	if(!isset($categories[$transaction->category_id])) {
		$categories[$transaction->category_id] = R::load('category', $transaction->category_id);
	}
	if(!isset($payees[$transaction->payee_id])) {
		$payees[$transaction->payee_id] = R::load('payee', $transaction->payee_id);
	}
	$transaction->category = $categories[$transaction->category_id];
	$transaction->payee = $payees[$transaction->payee_id];

	if($transaction->group != null) {
		if(! isset($groupTotals[$transaction->group])) $groupTotals[$transaction->group] = 0;
		$groupTotals[$transaction->group] += $transaction->amount;
	}

	$transactions['list'][] = $transaction;
}
foreach ($beans as &$transaction) {
	if($transaction->group != null) {
		$transaction->grouptotal = $groupTotals[$transaction->group];
	}
}
jsonheader();
echo json_encode($transactions, JSON_NUMERIC_CHECK);
exit();