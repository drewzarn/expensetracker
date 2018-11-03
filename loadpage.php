<?php
$page = $_REQUEST['page'];
if($page == '') $page = 'index';
if(isset($_REQUEST['cmd'])) $command = $_REQUEST['cmd'];

$args = [];
if(isset($_REQUEST['extra'])) {
	$_args = explode('/', $_REQUEST['extra']);
	foreach($_args as $arg) {
		if(strpos($arg, "=") !== false) {
			$_arg = explode("=", $arg);
			$args[$_arg[0]] = $_arg[1];
		} else {
			$args[$arg] = $arg;
		}
	}
}

require('init.php');

if($command == 'list') {
	jsonheader();
}

if($_SERVER["REQUEST_METHOD"] == "POST" || file_exists("process/{$page}.{$command}.php")) {
	include("process/{$page}.{$command}.php");
	exit();
}
if(!file_exists("pages/{$page}.php")) {
	header("HTTP/1.0 404 Not Found");
	echo "404";
	exit();
}


if($_SERVER["HTTP_X_REQUESTED_WITH"] != 'XMLHttpRequest') {
	include("pages/_head.php");
}

include("pages/{$page}.php");

if($_SERVER["HTTP_X_REQUESTED_WITH"] != 'XMLHttpRequest') {
	include("pages/_tail.php");
}

function jsonheader() {
	header("Content-type: application/json;");
}