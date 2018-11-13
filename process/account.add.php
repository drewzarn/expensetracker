<?php
if($POSTDATA['type'] == '' || $POSTDATA['name'] == '') exit();
$type = R::load('accounttype', $POSTDATA['type']);
$account = R::dispense('account');
$account->site = SITE;
$account->name = $POSTDATA['name'];
$account->active = 1;
$account->type = $type;
R::store($account);

exit();