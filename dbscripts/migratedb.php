<?php

$sql['user'] = <<<'EOD'
	INSERT INTO user (id, name, email, site, password, reset)
	SELECT usr_id, usr_name, usr_email, usr_site, usr_password, usr_reset FROM xuser
EOD;

$sql['category'] = <<<'EOD'
	INSERT INTO category (id, site, name, deleted, income)
	SELECT cat_id, cat_site, cat_name, cat_delete_flag, cat_income_flag FROM xcategory
EOD;

$sql['payee'] = <<<'EOD'
	INSERT INTO payee (id, site, name, deleted)
	SELECT pay_id, pay_site, pay_name, pay_delete_flag FROM xpayee
EOD;

$sql['transaction'] = <<<'EOD'
	INSERT INTO transaction (id, site, date, category_id, payee_id, description, amount)
	SELECT trn_id, trn_site, trn_date, trn_cat_id, trn_pay_id, trn_description, trn_amount FROM xtransaction
EOD;


foreach($sql as $table => $cmd) {
	echo $table . '<br />';
	$stmt = $DB->prepare($cmd);
	$stmt->execute();
}