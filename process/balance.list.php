<?php
$beans = R::find('account', 'site=? ORDER BY name', [SITE]);
$balances = ['timestamp' => time(), 'list' => []];
foreach($beans as $account) {
	$balanceBeans = R::find('balance', 'account_id=?', [$account->id]);
	$balances['list'] = array_merge($balances['list'], $balanceBeans);
}
jsonheader();
echo json_encode($balances);