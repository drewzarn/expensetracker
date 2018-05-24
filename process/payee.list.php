<?php
$payees = [];
$stmt = $DB->query("SELECT pay_name FROM payee WHERE pay_delete_flag=0 ORDER BY pay_name");
while ($row = $stmt->fetch()) {
	$payees[] = $row['pay_name'];
}

echo json_encode($payees);
