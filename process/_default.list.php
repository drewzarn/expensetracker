<?php
$beans = R::find($page, 'site=? ORDER BY name', [SITE]);
$output = ['timestamp' => time(), 'list' => $beans];
jsonheader();
echo json_encode($output);