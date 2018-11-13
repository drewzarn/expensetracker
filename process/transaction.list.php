<?php
$transactions = [];
if(isset($args['preset'])) {
	switch($args['preset']) {
		case 'spendbymonth':
			$sql = "SELECT _day AS Day, SUM(Income) AS Income, SUM(Expense) AS Expense
FROM (SELECT _day,
CASE WHEN income=1 THEN -1 * IFNULL(amount, 0) ELSE 0 END AS Income,
CASE WHEN income=0 THEN IFNULL(amount, 0) ELSE 0 END AS Expense
FROM _days
LEFT JOIN `transaction` ON DAY(date)=_day AND YEAR(date)=:year AND MONTH(date)=:month
LEFT JOIN category ON id=category_id
WHERE _day<=LAST_DAY(CONCAT(:year, '-', :month, '-01'))
) a
GROUP BY _day
ORDER BY _day";
			$sqlVars['year'] = isset($args['year']) ? $args['year'] : date('Y');
			$sqlVars['month'] = isset($args['month']) ? $args['month'] : date('n');
			break;
	}
	$stmt = $DB->prepare($sql);
	$stmt->execute($sqlVars);
	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		$transactions['data'][] = $row;
	}
} else {
	$beans = R::find('transaction', 'site=? AND date BETWEEN ? AND ?', [SITE, $args['datefrom'], $args['dateto']]);
	foreach($beans as $transaction) {
		$transactions[] = [
			'id' => $transaction->id,
			'date' => substr($transaction->date, 0, 10),
			'payee' => $transaction->payee->name,
			'category' => $transaction->category->name,
			'amount' => $transaction->amount,
			'description' => $transaction->description
		];
	}
	$output = new stdClass();
	$output->data = $transactions;
	$transactions = $output;
}

echo json_encode($transactions);
