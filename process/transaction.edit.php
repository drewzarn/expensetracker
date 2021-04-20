<?php
$category = R::findOrCreate('category', ['name' => $POSTDATA['category'], 'site' => SITE, 'deleted' => 0]);
$payee = R::findOrCreate('payee', ['name' => $POSTDATA['payee'], 'site' => SITE]);

$amount = $POSTDATA['amount'];
$trnDate = new DateTime($POSTDATA['date']);

$transaction = R::load('transaction', $POSTDATA['id']);
$transaction->category = $category;
$transaction->payee = $payee;
$transaction->amount = $amount;
$transaction->description = $POSTDATA['description'];
$transaction->date = $trnDate;
$transaction->change_date = new DateTime();
R::store($transaction);