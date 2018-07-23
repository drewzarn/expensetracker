<?php
$transactions = [];
if(isset($args['preset'])) {
	switch($args['preset']) {
		case '12monthrein':
			$sql = "SELECT *, income+`returns`-expenses AS net FROM (
SELECT MONTHNAME(trn_date) AS `month`,
-SUM(CASE WHEN cat_income_flag=0 AND trn_amount<0 THEN trn_amount ELSE 0 END) AS `returns`,
SUM(CASE WHEN cat_income_flag=0 AND trn_amount>0 THEN trn_amount ELSE 0 END) AS `expenses`,
-SUM(CASE WHEN cat_income_flag=1 THEN trn_amount ELSE 0 END) AS income
FROM `transaction`
JOIN category ON cat_id=trn_cat_id
WHERE trn_date BETWEEN DATE_FORMAT(DATE_ADD(NOW(), INTERVAL -6 MONTH) ,'%Y-%m-01') AND LAST_DAY(NOW())
GROUP BY MONTH(trn_date)
ORDER BY MONTH(trn_date)) a";
			break;
	}
	$stmt = $DB->prepare($sql);
	$stmt->execute($sqlVars);
	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		$transactions['data'][] = $row;
	}
}

echo json_encode($transactions);
