<?php

$date = new DateTime($POSTDATA['date']);
unset($POSTDATA['date']);
$accounts = [];
foreach ($POSTDATA as $accountId => $amount) {
	if ($amount == '')
		continue;
	$accountId = str_replace('account', '', $accountId);
	if (!isset($accounts[$accountId])) {
		$accounts[$accountId] = r::load('account', $accountId);
		$accounts[$accountId]->accounttype = r::load('accounttype', $accounts[$accountId]->type_id);
	}
	$lastBalance = R::findOne('balance', 'account_id=? AND date<? ORDER BY date DESC LIMIT 1', [$accountId, $date->format(MYSQL_DATETIME)]);

	$balance = R::dispense('balance');
	$balance->date = $date;
	$balance->amount = $amount;
	$balance->account = $accounts[$accountId];
	unset($balance->account->accounttype);
	$balance->netgain = 0;
	if ($lastBalance->amount != $amount) {
		if ($accounts[$accountId]->accounttype->asset == "1") {
			$balance->netgain = ($lastBalance->amount > $amount) ? -1 : 1;
		} else {
			$balance->netgain = ($lastBalance->amount > $amount) ? 1 : -1;
		}
	}
    $balance->change_date = new DateTime();
	R::store($balance);
}

exit();
