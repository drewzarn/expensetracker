<?php
$account = R::load('account', $POSTDATA['id']);
$account->name = $POSTDATA['name'];
$account->excludenetworth = $POSTDATA['excludenetworth'] != '';
R::store($account);

exit();