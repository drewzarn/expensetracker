<?php
$categories = [];
$stmt = $DB->query("SELECT cat_id, cat_name FROM category WHERE cat_delete_flag=0 ORDER BY cat_name");
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
	$categories[$row['cat_id']] = $row['cat_name'];
}

echo json_encode($categories);
