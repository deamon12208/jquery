<?php
$request = trim(strtolower($_REQUEST['value']));
$users = array('asdf', 'Peter', 'George');
$valid = 'true';
foreach($users as $user) {
	if( strtolower($user) == $request )
		$valid = 'false';
}
echo $valid;
?>