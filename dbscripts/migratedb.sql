--Move to redBean
INSERT INTO user (id, name, email, site, password, reset)
SELECT usr_id, usr_name, usr_email, usr_site, usr_password, usr_reset FROM xuser

INSERT INTO category (id, site, name, deleted, income)
SELECT cat_id, cat_site, cat_name, cat_delete_flag, cat_income_flag FROM xcategory

INSERT INTO payee (id, site, name, deleted)
SELECT pay_id, pay_site, pay_name, pay_delete_flag FROM xpayee

INSERT INTO transaction (id, site, date, category_id, payee_id, description, amount)
SELECT trn_id, trn_site, trn_date, trn_cat_id, trn_pay_id, trn_description, trn_amount FROM xtransaction

--Add netgain to balance
SELECT b1.id, amount, (SELECT b2.amount FROM balance b2 WHERE b2.account_id=b1.account_id AND b2.date<b1.date ORDER BY b2.date DESC LIMIT 1) AS lastamt,
CASE WHEN asset=0 THEN
	CASE
	WHEN (SELECT b2.amount FROM balance b2 WHERE b2.account_id=b1.account_id AND b2.date<b1.date ORDER BY b2.date DESC LIMIT 1)=amount THEN 0
	WHEN (SELECT b2.amount FROM balance b2 WHERE b2.account_id=b1.account_id AND b2.date<b1.date ORDER BY b2.date DESC LIMIT 1)>amount THEN 1
	WHEN (SELECT b2.amount FROM balance b2 WHERE b2.account_id=b1.account_id AND b2.date<b1.date ORDER BY b2.date DESC LIMIT 1)<amount THEN -1
	END
ELSE
	CASE
	WHEN (SELECT b2.amount FROM balance b2 WHERE b2.account_id=b1.account_id AND b2.date<b1.date ORDER BY b2.date DESC LIMIT 1)=amount THEN 0
	WHEN (SELECT b2.amount FROM balance b2 WHERE b2.account_id=b1.account_id AND b2.date<b1.date ORDER BY b2.date DESC LIMIT 1)>amount THEN -1
	WHEN (SELECT b2.amount FROM balance b2 WHERE b2.account_id=b1.account_id AND b2.date<b1.date ORDER BY b2.date DESC LIMIT 1)<amount THEN 1
	END
END AS netgain,
CONCAT(
'UPDATE balance SET netgain=', CASE WHEN asset=0 THEN
	CASE
	WHEN (SELECT b2.amount FROM balance b2 WHERE b2.account_id=b1.account_id AND b2.date<b1.date ORDER BY b2.date DESC LIMIT 1)=amount THEN 0
	WHEN (SELECT b2.amount FROM balance b2 WHERE b2.account_id=b1.account_id AND b2.date<b1.date ORDER BY b2.date DESC LIMIT 1)>amount THEN 1
	WHEN (SELECT b2.amount FROM balance b2 WHERE b2.account_id=b1.account_id AND b2.date<b1.date ORDER BY b2.date DESC LIMIT 1)<amount THEN -1
	END
ELSE
	CASE
	WHEN (SELECT b2.amount FROM balance b2 WHERE b2.account_id=b1.account_id AND b2.date<b1.date ORDER BY b2.date DESC LIMIT 1)=amount THEN 0
	WHEN (SELECT b2.amount FROM balance b2 WHERE b2.account_id=b1.account_id AND b2.date<b1.date ORDER BY b2.date DESC LIMIT 1)>amount THEN -1
	WHEN (SELECT b2.amount FROM balance b2 WHERE b2.account_id=b1.account_id AND b2.date<b1.date ORDER BY b2.date DESC LIMIT 1)<amount THEN 1
	END
END, ' WHERE id=', b1.id, ';') AS cmd
FROM balance b1
JOIN account ON account.id=account_id
JOIN accounttype ON accounttype.id=type_id
WHERE parity IS NULL

--Update transaction amount for income categories to be positive
UPDATE `transaction`
SET amount=(amount * -1)
WHERE category_id IN (SELECT id FROM category WHERE income=1)
AND amount<0