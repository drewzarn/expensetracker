<?php
$account = R::load('account', $POSTDATA['account']);

$balance = R::load('balance', $POSTDATA['id']);
if($POSTDATA['DELETE'] == 'true') {
	R::trash($balance);
	exit();
}
$balance->date = new DateTime($POSTDATA['date']);
$balance->amount = $POSTDATA['amount'];
$balance->account = $account;
$balance->change_date = new DateTime();
R::store($balance);

exit();