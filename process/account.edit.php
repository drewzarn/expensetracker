<?php
$account = R::load('account', $POSTDATA['id']);
$account->name = $POSTDATA['name'];
$account->excludenetworth = $POSTDATA['excludenetworth'] == 'true';
$account->active = $POSTDATA['active'] == 'true';
R::store($account);

exit();