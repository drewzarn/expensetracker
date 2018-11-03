<?php
require("db.config.php");
require('classes.php');
session_start();

if($page == 'user' && $command == 'logout') {
	session_destroy();
	header('Location: /');
	exit();
}


try {
	$DB = new PDO("mysql:dbname={$DBNAME};host={$DBHOST}", $DBUSER, $DBPASS);
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
	exit();
}

if(!$_SESSION['user'] instanceof User && array_search($page, ['user', 'reset']) === false) {
	unset($_SESSION['user']);
	$page = 'login';
}

$PWRESETLIMIT = 60 * 15;
$DUPECHECK = ['before' => -8, 'after' => 6];