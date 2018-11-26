<?php
$beans = R::find('account', 'site=? ORDER BY name', [SITE]);
$balances = ['timestamp' => time(), 'list' => [], 'byaccount' => []];
$allDates = [];
foreach($beans as $account) {
	$balanceBeans = R::find('balance', 'account_id=?', [$account->id]);
	$balances['list'] = array_merge($balances['list'], $balanceBeans);

	foreach ($balanceBeans as $bean) {
		$allDates[$bean->date] = $bean->date;
		$balances['byaccount'][$account->id][] = $bean->amount;
	}
	$balances['byaccount'][$account->id] = array_reverse($balances['byaccount'][$account->id]);
}
jsonheader();
echo json_encode($balances);