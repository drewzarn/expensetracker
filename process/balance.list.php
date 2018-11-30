<?php
$accountBeans = R::find('account', 'site=? ORDER BY name', [SITE]);
$balances = ['timestamp' => time(), 'list' => [], 'byaccount' => [], 'byaccounttype' => [], 'net' => []];
$allDates = [];
foreach ($accountBeans as $account) {
	$accountType = R::findOne('accounttype', 'id=?', [$account->type_id]);
	$balanceBeans = R::find('balance', 'account_id=?', [$account->id]);
	$balances['list'] = array_merge($balances['list'], $balanceBeans);

	foreach ($balanceBeans as $bean) {
		$allDates[$bean->date] = $bean->date;
		$balances['byaccount'][$account->id][$bean->date] = $bean->amount;
		if ($account->excludenetworth == 0) {
			$balances['byaccounttype'][$account->type_id][$bean->date] += $bean->amount;
			$balances['net'][$bean->date] += $accountType->asset == "1" ? $bean->amount : -$bean->amount;
		}
	}
	$balances['byaccount'][$account->id] = array_reverse($balances['byaccount'][$account->id]);
	$balances['byaccounttype'][$account->type_id] = array_reverse($balances['byaccounttype'][$account->type_id]);
}
$balances['net'] = array_values(array_reverse($balances['net']));

ksort($allDates);
foreach ($balances['byaccount'] as $accountId => $accountBalances) {
	foreach ($allDates as $date) {
		if (!array_key_exists($date, $accountBalances)) {
			$accountBalances[$date] = null;
		}
	}
	ksort($accountBalances);
	$balances['byaccount'][$accountId] = array_values($accountBalances);
}
foreach ($balances['byaccounttype'] as $accountTypeId => $accountTypeBalances) {
	foreach ($allDates as $date) {
		if (!array_key_exists($date, $accountTypeBalances)) {
			$accountTypeBalances[$date] = null;
		}
	}
	ksort($accountTypeBalances);
	$balances['byaccounttype'][$accountTypeId] = array_values($accountTypeBalances);
}
jsonheader();
echo json_encode($balances);
