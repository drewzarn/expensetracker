<?php

require('rb.php');
require("db.config.php");
require('classes.php');
session_start();
$DEVELOPMENT = strpos($_SERVER['SERVER_NAME'], 'dev.') >= 0;

if ($page == 'user' && $command == 'logout') {
	session_destroy();
	header('Location: /');
	exit();
}


try {
	R::setup("mysql:host={$DBHOST};dbname={$DBNAME}", $DBUSER, $DBPASS);
	$DB = new PDO("mysql:dbname={$DBNAME};host={$DBHOST}", $DBUSER, $DBPASS);
} catch (PDOException $e) {
	echo 'Connection failed: ' . $e->getMessage();
	exit();
}
if (!$DEVELOPMENT) {
	R::freeze(TRUE);
}

$PWRESETLIMIT = 60 * 15;
$DUPECHECK = ['before' => -8, 'after' => 6];
$modalContent = '';


if (!$_SESSION['user'] instanceof User && array_search($page, ['user', 'reset']) === false) {
	unset($_SESSION['user']);
	$page = 'login';
} else {
	define('SITE', $_SESSION['user']->site);

	$files = scandir(getcwd() . '/modals/');
	foreach ($files as $file) {
		if ($file == '.' || $file == '..' || file == 'modals.php')
			continue;
		$modalContent .= file_get_contents(getcwd() . '/modals/' . $file);
	}
}