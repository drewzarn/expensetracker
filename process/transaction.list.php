<?php

$transactions = [];
if (isset($args['preset'])) {
	switch ($args['preset']) {
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
	$where[] = "site=:site";
	$sqlArgs[':site'] = SITE;
	if (isset($args['datefrom'], $args['dateto'])) {
		$where[] = "date BETWEEN :datefrom AND :dateto";
		$sqlArgs[':datefrom'] = $args['datefrom'];
		$sqlArgs[':dateto'] = $args['dateto'];
	}
	if (isset($args['category'])) {
		$where[] = "category_id=:category";
		$sqlArgs[':category'] = $args['category'];
	}
	if (isset($args['payee'])) {
		$where[] = "payee_id=:payee";
		$sqlArgs[':payee'] = $args['payee'];
	}

	$sql = implode(' AND ', $where);

	$sql .= ' ORDER BY date DESC, payee_id, amount DESC';
	if (isset($args['limit'])) {
		$sql .= ' LIMIT :limit';
		$sqlArgs[':limit'] = intval($args['limit']);
	}
	
	$beans = R::find('transaction', $sql, $sqlArgs);

	foreach ($beans as $transaction) {
		$transaction->shortdate = substr($transaction->date, 0, 10);
		$transaction->category = R::load('category', $transaction->category_id);
		$transaction->payee = R::load('payee', $transaction->payee_id);
		$transactions[] = $transaction;
	}
	$output = new stdClass();
	$output->data = $transactions;
}

echo json_encode($output);
