<?php
try {
	$DB = new PDO("mysql:dbname=avdb_expenses;host=data.amovita.net", "avdb_expenseuser", "quietpaper64");
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
	exit();
}

$DUPECHECK = ['before' => -8, 'after' => 6];