<?php

$date = $POSTDATA['date'];
unset($POSTDATA['date']);
$accounts = [];
foreach ($POSTDATA as $accountId => $amount) {
	if ($amount == '')
		continue;
	$accountId = str_replace('account', '', $accountId);
	if (!isset($accounts[$accountId])) {
		$accounts[$accountId] = r::load('account', $accountId);
		$accounts[$accountId]->accounttype = r::load('accounttype', $accounts[$accountId]->id);
	}
	$lastBalance = R::findOne('balance', 'account_id=? AND date<? ORDER BY date DESC LIMIT 1', [$accountId, $date]);

	$balance = R::dispense('balance');
	$balance->date = $date;
	$balance->amount = $amount;
	$balance->account = $accounts[$accountId];
	$balance->netgain = 0;
	if ($lastBalance->amount != $amount) {
		if ($accounts[$accountId]->accounttype->asset == "1") {
			$balance->netgain = ($lastBalance->amount > $amount) ? -1 : 1;
		} else {
			$balance->netgain = ($lastBalance->amount > $amount) ? 1 : -1;
		}
	}
	R::store($balance);
}

exit();
