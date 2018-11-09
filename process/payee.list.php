<?php

$output = [];
$payees = R::find( 'payee', 'deleted=0 AND site=:site ORDER BY name', [':site' => SITE]);
foreach($payees as $payee) {
	$output[$payee->id] = $payee->name;
}

echo json_encode($output);
