<?php

class User {

	public $id;
	public $name;
	public $email;
	public $site;
	private $loginTime;

	private function __construct($id, $name, $email, $site) {
		$this->id = $id;
		$this->name = $name;
		$this->email = $email;
		$this->site = $site;
		$this->loginTime = time();
	}

	public function GetLoginAgeSeconds() {
		return time() - $loginTime;
	}

	static function Login($email, $password) {
		$user = R::findOne('user', 'email = ?', [$email]);
		if ($user === false || password_verify($password, $user->password) !== true) {
			header("Location: /");
			exit();
		}
		return new static($user->id, $user->name, $user->email, $user->site);
	}

	static function RequestReset($email) {
		$user = R::findOne('user', 'email = ?', [$email]);
		if ($user === FALSE) {
			return;
		}
		$reset = time() . 'z' . bin2hex(random_bytes(16));
		$user->reset = $reset;
		R::store($user);

		$headers = "From: Expenses <expenses@amovita.net>\r\n";
		$headers .= "MIME-Version: 1.0\r\n";
		$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
		$msg = "<a href='https://expenses.amovita.net/reset/{$reset}'>Reset your Expenses password here</a>";
		mail($email, "Password Reset", $msg, $headers);
		header("Location: /");
		exit();
	}

	static function ResetPassword($reset, $password) {
		$user = R::findOne('user', 'reset = ?', [$reset]);
		if ($user === FALSE) {
			header("Location: /");
			exit();
		}
		$user->password = password_hash($password, PASSWORD_DEFAULT);
		$user->reset = null;
		R::store($user);

		$headers = "From: Expenses <expenses@amovita.net>\r\n";
		$headers .= "MIME-Version: 1.0\r\n";
		$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
		$msg = "Your Expenses password has been changed";
		mail($result['usr_email'], "Password Changed", $msg, $headers);
		header("Location: /");
		exit();
	}

}
