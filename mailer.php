<?php
include('init.php');
$subject = "Your Financial Situation";
$headers = "From: Expenses <expenses@amovita.net>\r\n";
$headers .= "CC: {$MAILCC}\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";

$trnList = file_get_contents("https://expenses.amovita.net/transaction/list/datatable/cols=trn_date,pay_name,trn_amount,trn_description,cat_name/limit=10/orderby=trn_date desc");
$trnList = json_decode($trnList);

$trnTable = "";
foreach($trnList->data as $trn) {
	$trnTable .= "<tr><td>{$trn->trn_date}</td><td>{$trn->pay_name}</td><td>{$trn->trn_amount}</td></tr>";
}

$sql = "SELECT SUM(trn_amount) AS etd
FROM `transaction`
WHERE trn_amount>0
AND MONTH(trn_date)=MONTH(NOW()) AND YEAR(trn_date)=YEAR(NOW())";
$stmt = $DB->prepare($sql);
$stmt->execute();
$row = $stmt->fetch(PDO::FETCH_ASSOC);

$msg = "<html><body><p>So far this month, you've spent \${$row['etd']}. Your last 10 transactions:</p>";
$msg .= '<table cellpadding="3" border="1"><tr><th>Date</th><th>Payee</th><th>Amount</th></tr>';
$msg .= $trnTable;
$msg .= '</table></html></body>';

mail($MAILTO, $subject, $msg, $headers);