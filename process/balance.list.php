<?php
$beans = R::find('account', 'site=? ORDER BY name', [SITE]);
$balances = ['timestamp' => time(), 'list' => [], 'byaccount' => []];
$allDates = [];
foreach($beans as $account) {
	$balanceBeans = R::find('balance', 'account_id=?', [$account->id]);
	$balances['list'] = array_merge($balances['list'], $balanceBeans);

	foreach ($balanceBeans as $bean) {
		$allDates[$bean->date] = $bean->date;
		$balances['byaccount'][$account->id][$bean->date] = $bean->amount;
	}
	$balances['byaccount'][$account->id] = array_reverse($balances['byaccount'][$account->id]);
}
ksort($allDates);
foreach($balances['byaccount'] as $accountId => $accountBalances) {
	foreach($allDates as $date) {
		if(!array_key_exists($date, $accountBalances)) {
			$accountBalances[$date] = 0;
		}
	}
	ksort($accountBalances);
	$balances['byaccount'][$accountId] = array_values($accountBalances);
}
jsonheader();
echo json_encode($balances);