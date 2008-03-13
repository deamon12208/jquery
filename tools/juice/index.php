<?php
	require_once("init.php");
?>
<html>
<head>
	<title>jUIce - The jQuery UI Testing Center</title>
	<link rel="stylesheet" href="lib/css/style.css" type="text/css" media="screen">
	
	<script src="http://code.jquery.com/jquery-latest.min.js" type="text/javascript"></script>
	<script src="../../plugins/corner/jquery.corner.js" type="text/javascript"></script>
	<script src="../../plugins/dimensions/jquery.dimensions.js" type="text/javascript"></script>
	
	
	<!-- jQuery UI -->
	<script src="../../ui/ui.mouse.js" type="text/javascript" charset="utf-8"></script>
	<script src="../../ui/ui.draggable.js" type="text/javascript" charset="utf-8"></script>
	<script src="../../ui/ui.draggable.ext.js" type="text/javascript" charset="utf-8"></script>
	<script src="../../ui/ui.droppable.js" type="text/javascript" charset="utf-8"></script>
	<script src="../../ui/ui.droppable.ext.js" type="text/javascript" charset="utf-8"></script>
	<script src="../../ui/ui.resizable.js" type="text/javascript" charset="utf-8"></script>
	<script src="../../ui/ui.resizable.ext.js" type="text/javascript" charset="utf-8"></script>
	<script src="../../ui/ui.sortable.js" type="text/javascript" charset="utf-8"></script>
	<script src="../../ui/ui.sortable.ext.js" type="text/javascript" charset="utf-8"></script>
	<script src="../../ui/ui.tabs.js" type="text/javascript" charset="utf-8"></script>
	<script src="../../ui/ui.tabs.ext.js" type="text/javascript" charset="utf-8"></script>
	<script src="../../ui/ui.dialog.js" type="text/javascript" charset="utf-8"></script>
	<script src="../../ui/ui.slider.js" type="text/javascript" charset="utf-8"></script>
	<script src="../../ui/ui.accordion.js" type="text/javascript" charset="utf-8"></script>
	<script src="../../ui/datepicker/core/ui.datepicker.js" type="text/javascript" charset="utf-8"></script>
	<link rel="stylesheet" href="../../ui/datepicker/core/ui.datepicker.css" type="text/css">

	
	
	<script src="lib/js/juice.js"></script>
	
	
	
</head>
<body>
	
<div id="topbar">
	<div id="instructions"><strong>Current instructions:</strong> <span id="instruction_field"></span></div>
	<?php include("content/loginstatus.php"); ?>
	<?php include("content/loginbar.php"); ?>
</div>
	
<?php

	
	if($_GET["test"]) {
		$test = $_GET["test"];
	} else {
		$test = "index";
	}
	
	if($_GET["random"]) {
		$tests = dir("tests");
		$test_array = array();
		while($file = $tests->read()) {
		  if($file != ".." && $file != "." && $file != "index.inc.php" && $file != ".svn") {
		  	$test_array[] = $file;
		  }
		}
		$tests->close();
		
		shuffle($test_array);
		include("tests/".$test_array[0]);
		
	} else {
		if(file_exists("tests/".$test.".inc.php")) {
			include("tests/".$test.".inc.php");
		}
	}


?>	
	
	
<div id="bottombar">
<div class="bg">
	<div id="expectations">
		Can you agree to the following?
		<div id="expectation_field"></div>
	</div>
	
	<div id="result_buttons">
		<div class="link" style="background: #AE0000; color: #fff; width: 100px;"><a href="javascript:submit(3)" style="color: #fff;">It sucks so bad.</a></div>
		<div class="link" style="background: #D9D900; width: 200px;"><a href="javascript:submit(2)">Partially, some glitches/issues!</a></div>
		<div class="darkgreen link" style="width: 120px;"><a href="javascript:submit(1)">Yes, completely!</a></div>
	</div>
<div>
</div>
	

	
</body>
</html>