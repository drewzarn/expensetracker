<?php
if(!$DEVELOPMENT) die();

$user = R::dispense('user');
$user->name = str_pad('', 30);
$user->email = str_pad('', 60);
$user->site = 0;
$user->password = str_pad('', 100);
$user->reset = str_pad('', 50);
R::store($user);

$category = R::dispense('category');
$category->site = 0;
$category->name = str_pad('', 60);
$category->income = false;
$category->deleted = false;
R::store($category);

$payee = R::dispense('payee');
$payee->site = 0;
$payee->name = str_pad('', 60);
$payee->deleted = false;
R::store($payee);

$transaction = R::dispense('transaction');
$transaction->site = 0;
$transaction->date = new DateTime();
$transaction->category = $category;
$transaction->payee = $payee;
$transaction->description = str_pad('', 100);
$transaction->amount = 1000000.00;
R::store($transaction);

$account = R::dispense('account');
$account->site = 0;
$account->name = str_pad('', 30);
$account->type = str_pad('', 15);
$account->active = 0;
R::store($account);

$balance = R::dispense('balance');
$balance->account = $account;
$balance->date = new DateTime();
$balance->amount = 1000000.00;
R::store($balance);