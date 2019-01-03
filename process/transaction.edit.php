<?php
$category = R::findOrCreate('category', ['name' => $POSTDATA['category'], 'site' => SITE, 'deleted' => 0, 'parity' => -1]);
$payee = R::findOrCreate('payee', ['name' => $POSTDATA['payee'], 'site' => SITE]);

$amount = $POSTDATA['amount'];
$trnDate = $POSTDATA['date'];

$transaction = R::load('transaction', $POSTDATA['id']);
$transaction->category = $category;
$transaction->payee = $payee;
$transaction->amount = $amount;
$transaction->description = $POSTDATA['description'];
$transaction->date = $trnDate;
R::store($transaction);