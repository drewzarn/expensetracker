<?php

$output = [];
$categories = R::find( 'category', 'deleted=0 AND site=:site ORDER BY name', [':site' => SITE]);
foreach($categories as $category) {
	$output[$category->id] = $category->name;
}

echo json_encode($output);
