<?php
$page = $_REQUEST['page'];
if($page == '') $page = 'index';
if(isset($_REQUEST['cmd'])) $command = $_REQUEST['cmd'];

require('init.php');

if($command == 'list') {
	header("Content-type: application/json;");
}

if($_SERVER["REQUEST_METHOD"] == "POST" || file_exists("process/{$page}.{$command}.php")) {
	include("process/{$page}.{$command}.php");
	exit();
}


if($_SERVER["HTTP_X_REQUESTED_WITH"] != 'XMLHttpRequest') {
	include("pages/_head.php");
}

include("pages/{$page}.php");

if($_SERVER["HTTP_X_REQUESTED_WITH"] != 'XMLHttpRequest') {
	include("pages/_tail.php");
}