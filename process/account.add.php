<?php
if($POSTDATA['type'] == '' || $POSTDATA['name'] == '') exit();
$type = R::load('accounttype', $POSTDATA['type']);
$account = R::dispense('account');
$account->site = SITE;
$account->name = $POSTDATA['name'];
$account->active = 1;
$account->type = $type;
$account->excludenetworth = $POSTDATA['excludenetworth'] == 'true';
$account->change_date = new DateTime();
R::store($account);

exit();