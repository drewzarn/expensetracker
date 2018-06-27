<?php
$transactions = [];
if(isset($args['preset'])) {
	switch($args['preset']) {
		case 'spendbymonth':
			$sql = "SELECT _day AS Day, SUM(Income) AS Income, SUM(Expense) AS Expense
FROM (SELECT _day,
CASE WHEN cat_income_flag=1 THEN -1 * IFNULL(trn_amount, 0) ELSE 0 END AS Income,
CASE WHEN cat_income_flag=0 THEN IFNULL(trn_amount, 0) ELSE 0 END AS Expense
FROM _days
LEFT JOIN `transaction` ON DAY(trn_date)=_day AND YEAR(trn_date)=:year AND MONTH(trn_date)=:month
LEFT JOIN category ON cat_id=trn_cat_id
WHERE _day<=LAST_DAY(CONCAT(:year, '-', :month, '-01'))
) a
GROUP BY _day
ORDER BY _day";
			$sqlVars['year'] = isset($args['year']) ? $args['year'] : date('Y');
			$sqlVars['month'] = isset($args['month']) ? $args['month'] : date('n');
			break;
		case 'mtdcompare':
			$sql = "SELECT 'Current' AS Month, (SELECT -1*SUM(trn_amount) FROM `transaction`
JOIN category ON cat_id=trn_cat_id
WHERE cat_income_flag=1
AND YEAR(trn_date)=YEAR(NOW())
AND MONTH(trn_date)=MONTH(NOW())) AS Income,
(SELECT SUM(trn_amount) FROM `transaction`
JOIN category ON cat_id=trn_cat_id
WHERE cat_income_flag=0
AND YEAR(trn_date)=YEAR(NOW())
AND MONTH(trn_date)=MONTH(NOW())
AND DAY(trn_date)<=DAY(NOW())) AS Expenses,
-1*((SELECT SUM(trn_amount) FROM `transaction`
JOIN category ON cat_id=trn_cat_id
WHERE cat_income_flag=1
AND YEAR(trn_date)=YEAR(NOW())
AND MONTH(trn_date)=MONTH(NOW())
AND DAY(trn_date)<=DAY(NOW())) + (SELECT SUM(trn_amount) FROM `transaction`
JOIN category ON cat_id=trn_cat_id
WHERE cat_income_flag=0
AND YEAR(trn_date)=YEAR(NOW())
AND MONTH(trn_date)=MONTH(NOW())
AND DAY(trn_date)<=DAY(NOW()))) AS Net
UNION
SELECT 'Previous', (SELECT -1*SUM(trn_amount) FROM `transaction`
JOIN category ON cat_id=trn_cat_id
WHERE cat_income_flag=1
AND YEAR(trn_date)=YEAR(DATE_ADD(NOW(), INTERVAL -1 MONTH))
AND MONTH(trn_date)=MONTH(DATE_ADD(NOW(), INTERVAL -1 MONTH))
AND DAY(trn_date)<=DAY(NOW())) AS Income,
(SELECT SUM(trn_amount) FROM `transaction`
JOIN category ON cat_id=trn_cat_id
WHERE cat_income_flag=0
AND YEAR(trn_date)=YEAR(DATE_ADD(NOW(), INTERVAL -1 MONTH))
AND MONTH(trn_date)=MONTH(DATE_ADD(NOW(), INTERVAL -1 MONTH))
AND DAY(trn_date)<=DAY(NOW())) AS Expenses,
-1*((SELECT SUM(trn_amount) FROM `transaction`
JOIN category ON cat_id=trn_cat_id
WHERE cat_income_flag=1
AND YEAR(trn_date)=YEAR(DATE_ADD(NOW(), INTERVAL -1 MONTH))
AND MONTH(trn_date)=MONTH(DATE_ADD(NOW(), INTERVAL -1 MONTH))
AND DAY(trn_date)<=DAY(NOW())) + (SELECT SUM(trn_amount) FROM `transaction`
JOIN category ON cat_id=trn_cat_id
WHERE cat_income_flag=0
AND YEAR(trn_date)=YEAR(DATE_ADD(NOW(), INTERVAL -1 MONTH))
AND MONTH(trn_date)=MONTH(DATE_ADD(NOW(), INTERVAL -1 MONTH))
AND DAY(trn_date)<=DAY(NOW()))) AS Net";
			break;
	}
	$stmt = $DB->prepare($sql);
	$stmt->execute($sqlVars);
	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		$transactions['data'][] = $row;
	}
} else {
	$columns = isset($args['cols']) ? $args['cols'] : '*';
	$sql = "SELECT {$columns} FROM transaction JOIN category ON cat_id=trn_cat_id JOIN payee ON pay_id=trn_pay_id WHERE 1=1 ";
	$sqlWhere = [];
	$sqlVars = [];
	$limit = isset($args['limit']) ? $args['limit'] : 10;
	$orderby = isset($args['order']) ? $args['order'] : "trn_date DESC";

	if(isset($args['category'])) {
		$sqlWhere[] = "trn_cat_id=:cat_id";
		$sqlVars["cat_id"] = $args['category'];
	}
	if(isset($args['payee'])) {
		$sqlWhere[] = "trn_pay_id=:pay_id";
		$sqlVars["pay_id"] = $args['payee'];
	}
	if(isset($args['datefrom'])) {
		$sqlWhere[] = "trn_date>=:datefrom";
		$sqlVars["datefrom"] = $args['datefrom'];
	}
	if(isset($args['dateto'])) {
		$sqlWhere[] = "trn_date<=:dateto";
		$sqlVars["dateto"] = $args['dateto'];
	}
	foreach($sqlWhere as $where) {
		$sql .= " AND {$where} ";
	}
	$sql .= " ORDER BY {$orderby}";
	if($limit != 0) {
		$sql .= " LIMIT {$limit} ";
	}

	$stmt = $DB->prepare($sql);
	$stmt->execute($sqlVars);
	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		$row['trn_date'] = substr($row['trn_date'], 0, 10);
		if(isset($args['datatable'])) {
			$transactions['data'][] = $row;
		} else {
			$transactions[] = $row;
		}
	}
}

echo json_encode($transactions);
