<?php
$category = R::findOrCreate('category', ['name' => $POSTDATA['category'], 'site' => SITE]);
$payee = R::findOrCreate('payee', ['name' => $POSTDATA['payee'], 'site' => SITE]);

$amount = $category->income ? -1 * $POSTDATA['amount'] : $POSTDATA['amount'];
$trnDate = $POSTDATA['date'];

$transaction = R::load('transaction', $POSTDATA['id']);
$transaction->category = $category;
$transaction->payee = $payee;
$transaction->amount = $amount;
$transaction->description = $POSTDATA['description'];
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