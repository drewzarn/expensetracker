<?php
$transactions = [];
if(isset($args['preset'])) {
	switch($args['preset']) {
		case 'spendingbymonth':
			$sql = "SELECT *, income-expenses AS net FROM (
SELECT MONTHNAME(trn_date) AS `month`,
SUM(CASE WHEN cat_income_flag=0 AND trn_amount>0 THEN trn_amount ELSE 0 END) AS `expenses`,
-SUM(CASE WHEN cat_income_flag=1 THEN trn_amount ELSE 0 END) AS income
FROM `transaction`
JOIN category ON cat_id=trn_cat_id
WHERE trn_date BETWEEN DATE_FORMAT(DATE_ADD(NOW(), INTERVAL -6 MONTH) ,'%Y-%m-01') AND LAST_DAY(NOW())
GROUP BY MONTH(trn_date)
ORDER BY MONTH(trn_date)) a";
			break;
		case 'spendingbymonthandtype':
			$sql = "SELECT * FROM (
SELECT
cat_name AS category,
SUM(
	CASE
	WHEN :type='income' AND cat_income_flag=1 THEN trn_amount
	WHEN :type='returns' AND cat_income_flag=0 AND trn_amount<0 THEN trn_amount
	WHEN :type='expenses' AND cat_income_flag=0 AND trn_amount>0 THEN trn_amount
	END
) AS amount
FROM `transaction`
JOIN category ON cat_id=trn_cat_id
WHERE MONTH(trn_date)=:month AND YEAR(trn_date)=:year
GROUP BY cat_name
) a
WHERE amount IS NOT NULL
ORDER BY amount DESC";
			$sqlVars['year'] = $args['year'];
			$sqlVars['month'] = $args['month'];
			$sqlVars['type'] = $args['type'];
			break;
		case 'mtdcomparison':
			$sql = "SELECT MONTHNAME(trn_date) AS `month`,
-SUM(CASE WHEN cat_income_flag=1 THEN trn_amount ELSE 0 END) AS income,
SUM(CASE WHEN cat_income_flag=0 AND trn_amount>0 AND DAY(trn_date)<=DAY(NOW()) THEN trn_amount ELSE 0 END) AS `expensestodate`,
SUM(CASE WHEN cat_income_flag=0 AND trn_amount>0 THEN trn_amount ELSE 0 END) AS `expenses`
FROM `transaction`
JOIN category ON cat_id=trn_cat_id
WHERE trn_date BETWEEN DATE_FORMAT(DATE_ADD(NOW(), INTERVAL -6 MONTH) ,'%Y-%m-01') AND LAST_DAY(NOW())
GROUP BY MONTH(trn_date)
ORDER BY MONTH(trn_date) DESC";
			break;
	}
	$stmt = $DB->prepare($sql);
	$stmt->execute($sqlVars);
	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		$transactions['data'][] = $row;
	}
}

echo json_encode($transactions);
