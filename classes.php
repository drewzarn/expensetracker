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
		global $DB;
		$stmt = $DB->prepare("SELECT * FROM user WHERE usr_email=:email");
		$args = [
			'email' => $email
		];
		$stmt->execute($args);
		$result = $stmt->fetch(PDO::FETCH_ASSOC);
		if($result === false || password_verify($password, $result['usr_password']) !== true) {
			header("Location: /");
			exit();
		}
		return new static($result['usr_id'], $result['usr_name'], $result['usr_email'], $result['usr_site']);
	}

	static function RequestReset($email) {
		global $DB;
		$reset = time() . 'z' . bin2hex(random_bytes(16));
		$stmt = $DB->prepare("UPDATE user SET usr_reset=:reset WHERE usr_email=:email");
		$args = [
			'email' => $email,
			'reset' => $reset
		];
		$stmt->execute($args);

		$headers = "From: Expenses <expenses@amovita.net>\r\n";
		$headers .= "MIME-Version: 1.0\r\n";
		$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
		$msg = "<a href='https://expenses.amovita.net/reset/{$reset}'>Reset your Expenses password here</a>";
		mail($email, "Password Reset", $msg, $headers);
		header("Location: /");
		exit();
	}

	static function ResetPassword($reset, $password) {
		global $DB;
		$stmt = $DB->prepare("SELECT usr_email FROM user WHERE usr_reset=:reset");
		$args = [
			'reset' => $reset
		];
		$stmt->execute($args);
		$result = $stmt->fetch(PDO::FETCH_ASSOC);
		if($result['usr_email'] == '') {
			header("Location: /");
			exit();
		}

		$stmt = $DB->prepare("UPDATE user SET usr_reset=null, usr_password=:password WHERE usr_reset=:reset");
		$args = [
			'password' => password_hash($password, PASSWORD_DEFAULT),
			'reset' => $reset
		];
		$stmt->execute($args);

		$headers = "From: Expenses <expenses@amovita.net>\r\n";
		$headers .= "MIME-Version: 1.0\r\n";
		$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
		$msg = "Your Expenses password has been changed";
		mail($result['usr_email'], "Password Changed", $msg, $headers);
		header("Location: /");
		exit();
	}
}
