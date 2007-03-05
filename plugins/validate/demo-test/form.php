<?php
// wait a second to simulate a some latency
sleep(1);
$user = $_REQUEST['user'];
$pw = $_REQUEST['password'];
if($user && $pw && $pw == "foobar")
	echo "{'status': 0, 'data':'Hi $user, welcome back.'}";
else
	echo "{'status': 1, 'data': {'password': 'Your password is wrong (must be foobar).'}}";
?>