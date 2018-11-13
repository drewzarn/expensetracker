<?php
$account = R::load('account', $POSTDATA['id']);
$account->name = $POSTDATA['name'];
R::store($account);

exit();