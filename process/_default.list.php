<?php
$beans = R::find($page, 'site=? ORDER BY name', [SITE]);
jsonheader();
echo json_encode($beans);