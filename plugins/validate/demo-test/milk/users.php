<?php
$request = trim(strtolower($_REQUEST['value']));
$users = array('asdf', 'Peter', 'George');
$found = 'false';
foreach($users as $user) {
	if( strtolower($user) == $request )
		$found = 'true';
}
echo $found;
?>