<?php
$stmt = $DB->prepare("INSERT INTO category (cat_name) VALUES (:cat_name)");
$stmt->execute(['cat_name' => $_REQUEST['cat_name']]);

header('Location: add');