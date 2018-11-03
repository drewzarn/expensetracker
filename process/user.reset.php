<?php
if($_REQUEST['password'] == $_REQUEST['confirm']) {
	User::ResetPassword($_REQUEST['reset'], $_REQUEST['password']);
}
header('Location: /');