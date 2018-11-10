<?php
$category = R::findOrCreate('category', ['name' => $_REQUEST['category'], 'site' => SITE]);
$payee = R::findOrCreate('payee', ['name' => $_REQUEST['payee'], 'site' => SITE]);

$amount = $category->income ? -1 * $_REQUEST['amount'] : $_REQUEST['amount'];
$trnDate = $_REQUEST['date'];

$transaction = R::load('transaction', $_REQUEST['id']);
$transaction->category = $category;
$transaction->payee = $payee;
$transaction->amount = $amount;
$transaction->description = $_REQUEST['description'];
$transaction->date = $trnDate;
R::store($transaction);

jsonheader();
echo json_encode([
			'id' => $transaction->id,
			'date' => substr($transaction->date, 0, 10),
			'payee' => $transaction->payee->name,
			'category' => $transaction->category->name,
			'amount' => $transaction->amount,
			'description' => $transaction->description
		]);

exit();