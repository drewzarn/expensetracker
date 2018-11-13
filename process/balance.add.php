<?php
$date = $POSTDATA['date'];
unset($POSTDATA['date']);
$accounts = [];
foreach($POSTDATA as $accountId => $amount) {
	if($amount == '')		continue;
	$accountId = str_replace('account', '', $accountId);
	if(!isset($accounts[$accountId])) {
		$accounts[$accountId] = r::load('account', $accountId);
	}
	$balance = R::dispense('balance');
	$balance->date = $date;
	$balance->amount = $amount;
	$balance->account = $accounts[$accountId];
	R::store($balance);
}

exit();