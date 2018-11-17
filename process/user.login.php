<?php
if(isset($_REQUEST['reset'])) {
	User::RequestReset($_REQUEST['email']);
} else {
	$_SESSION['user'] = User::Login($_REQUEST['email'], $_REQUEST['password']);
}
header('Location: /');
exit();