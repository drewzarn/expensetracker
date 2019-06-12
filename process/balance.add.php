<?php

$date = new DateTime($POSTDATA['date']);
unset($POSTDATA['date']);
$accounts = [];
foreach ($POSTDATA as $accountId => $amount) {
	if ($amount == '')
		continue;
	$accountId = str_replace('account', '', $accountId);
	if (!isset($accounts[$accountId]) || !isset($accounts[$accountId]->accounttype)) {
		$accounts[$accountId] = r::load('account', $accountId);
		$accounts[$accountId]->accounttype = r::load('accounttype', $accounts[$accountId]->type_id);
	}
	$lastBalance = R::findOne('balance', 'account_id=? AND date<? ORDER BY date DESC LIMIT 1', [$accountId, $date->format(MYSQL_DATETIME)]);

	$balance = R::dispense('balance');
	$balance->date = $date;
	$balance->amount = $amount;
	$balance->account = $accounts[$accountId];
	$balanceAccountAsset = $balance->account->accounttype->asset == "1";
	unset($balance->account->accounttype);
	$balance->netgain = 0;
	if ($lastBalance->amount != $amount) {
		if ($balanceAccountAsset) {
			$balance->netgain = ($lastBalance->amount > $amount) ? -1 : 1;
		} else {
			$balance->netgain = ($lastBalance->amount > $amount) ? 1 : -1;
		}
	}
	R::store($balance);
}

exit();
