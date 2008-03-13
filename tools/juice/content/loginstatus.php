<?php
	
	$login = $_SESSION["__user"];

?>
<div id="loginstatus">
	
	<? if (empty($login['username'])) { ?>	
	
		Not logged in. <a href="javascript:login()">Login now!</a>
	
	<? }else{ ?>
	
		Logged as <b><?= $login['username'] ?></b>, <a href="javascript:signout()">Sign out!</a>
	
	<? } ?>
	
</div>

<div id="sign_out_confirm" style="display: none;"></div>