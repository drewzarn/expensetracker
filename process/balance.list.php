<?php
$beans = R::find('account', 'site=? ORDER BY name', [SITE]);
$balances = [];
foreach($beans as $account) {
	$balanceBeans = R::find('balance', 'account_id=?', [$account->id]);
	$balances = array_merge($balances, $balanceBeans);
}
jsonheader();
echo json_encode($balances);