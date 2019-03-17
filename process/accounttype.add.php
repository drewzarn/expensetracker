<?php
if($POSTDATA['name'] == '') exit();
$accounttype = R::dispense('accounttype');
$accounttype->site = SITE;
$accounttype->name = $POSTDATA['name'];
$accounttype->asset = $POSTDATA['asset'] == 'true';
$accounttype->change_date = new DateTime();
R::store($accounttype);

exit();