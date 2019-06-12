<?php
$object = $page;
if(substr($page, -1) == 's') {
    $page = $page == 'categories' ? 'category' : substr($page, 0, -1);
}
if(file_exists("process/{$page}.list.php")) {
    require("process/{$page}.list.php");
    exit();
}
$beans = R::find($page, 'site=? ORDER BY name', [SITE]);
$output = ['timestamp' => time(), 'object' => $object, 'list' => $beans];
jsonheader();
echo json_encode($output, JSON_NUMERIC_CHECK);