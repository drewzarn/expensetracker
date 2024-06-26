<?php
$page = $_REQUEST['page'];
if($page == '') $page = 'index';
if(isset($_REQUEST['cmd'])) $command = $_REQUEST['cmd'];

$paging = (object)[
	'page' => isset($_REQUEST['pagenum']) && is_int($_REQUEST['pagenum']) ? $_REQUEST['pagenum'] : 0,
	'size' => $_REQUEST['pagenum'] == 'all' ? ($page == 'transactions' ? 500 : 100000) : 500
];
$paging->next = isset($_REQUEST['pagenum']) ? (int)$_REQUEST['pagenum'] + 1 : 1;
$paging->start = isset($_REQUEST['pagenum']) ? $paging->size * (int)$_REQUEST['pagenum'] : 0;
$paging->last = $paging->start + $paging->size;

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

if($page == 'dbscripts' && $DEVELOPMENT) {
	if(file_exists("dbscripts/{$command}.php")) {
		require("dbscripts/{$command}.php");
		echo $command . ' Done';
	}
	exit();
}

if($command == 'list') {
	jsonheader();
}

if($_SERVER["REQUEST_METHOD"] == "POST" && isset($_REQUEST['data'])) {
	$POSTDATA = $_REQUEST['data'];
}

if($_SERVER["REQUEST_METHOD"] == "POST" || file_exists("process/{$page}.{$command}.php")) {
	require("process/{$page}.{$command}.php");
	exit();
}
if($command == 'list' && !file_exists("process/{$page}.{$command}.php")) {
	include("process/_default.{$command}.php");
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