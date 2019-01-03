<?php
$category = R::load('category', $POSTDATA['id']);
$category->name = $POSTDATA['name'];
$category->parity = $POSTDATA['parity'];
$category->deleted = $POSTDATA['deleted'] == 'true';
R::store($category);

exit();