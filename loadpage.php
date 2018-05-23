<?php
$page = $_REQUEST['page'];
if($page == '') $page = 'index';

require('init.php');

if($_SERVER["HTTP_X_REQUESTED_WITH"] != 'XMLHttpRequest') {
	include("pages/_head.php");
}

include("pages/{$page}.php");

if($_SERVER["HTTP_X_REQUESTED_WITH"] != 'XMLHttpRequest') {
	include("pages/_tail.php");
}