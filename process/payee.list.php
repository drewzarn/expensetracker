<?php
$payees = [];
$stmt = $DB->query("SELECT pay_id, pay_name FROM payee WHERE pay_delete_flag=0 ORDER BY pay_name");
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
	$payees[$row['pay_id']] = $row['pay_name'];
}

echo json_encode($payees);
