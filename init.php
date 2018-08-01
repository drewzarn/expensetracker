<?php
require("db.config.php");
try {
	$DB = new PDO("mysql:dbname={$DBNAME};host={$DBHOST}", $DBUSER, $DBPASS);
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
	exit();
}

$DUPECHECK = ['before' => -8, 'after' => 6];