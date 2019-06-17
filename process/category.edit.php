<?php
$category = R::load('category', $POSTDATA['id']);
$category->name = $POSTDATA['name'];
$category->parity = $POSTDATA['parity'];
$category->deleted = $POSTDATA['deleted'] == 'true';
$category->change_date = new DateTime();
R::store($category);

exit();