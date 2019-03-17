<?php
$account = R::load('account', $POSTDATA['id']);
$account->name = $POSTDATA['name'];
$account->excludenetworth = $POSTDATA['excludenetworth'] == 'true';
$account->active = $POSTDATA['active'] == 'true';
$account->change_date = new DateTime();
R::store($account);

exit();