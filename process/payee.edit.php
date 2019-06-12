<?php
$payee = R::load('payee', $POSTDATA['id']);
$payee->name = $POSTDATA['name'];
$payee->deleted = $POSTDATA['deleted'] == 'true';
R::store($payee);

exit();