<?php
$beanCount = R::count('transaction', "site=:site", [':site' => SITE]);

$beans = R::find('transaction', "site=:site ORDER BY date DESC LIMIT :pagestart, :pagesize", [':site' => SITE, ':pagestart' => $paging->start, 'pagesize' => $paging->size]);
$transactions = ['timestamp' => time(), 'object' => 'transactions', 'paged' => $paging->start > 0, 'nextpage' => $paging->last > $beanCount ? null : ('transactions/list/' . $paging->next), 'list' => []];
$groupTotals = [];

$payees = [];
$categories = [];

foreach ($beans as $transaction) {
	$transaction->shortdate = substr($transaction->date, 0, 10);
	if (!isset($categories[$transaction->category_id])) {
		$categories[$transaction->category_id] = R::load('category', $transaction->category_id);
	}
	if (!isset($payees[$transaction->payee_id])) {
		$payees[$transaction->payee_id] = R::load('payee', $transaction->payee_id);
	}
	$transaction->category = $categories[$transaction->category_id];
	$transaction->payee = $payees[$transaction->payee_id];

	if ($transaction->group != null) {
		if (!isset($groupTotals[$transaction->group])) $groupTotals[$transaction->group] = 0;
		$groupTotals[$transaction->group] += $transaction->amount;
	}

	$transactions['list'][] = $transaction;
}
foreach ($beans as &$transaction) {
	if ($transaction->group != null) {
		$transaction->grouptotal = $groupTotals[$transaction->group];
	}
}
jsonheader();
echo json_encode($transactions, JSON_NUMERIC_CHECK);
exit();
