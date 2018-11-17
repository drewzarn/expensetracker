<?php
$category = R::load('category', $POSTDATA['id']);
$category->name = $POSTDATA['name'];
$category->income = $POSTDATA['income'] == 'true';
$category->deleted = $POSTDATA['deleted'] == 'true';
R::store($category);

exit();