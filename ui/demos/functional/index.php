<?php

$demo = $_GET['demo'].".php";

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">

	<head>
		<meta http-equiv="Content-Language" content="en" />
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>jQuery UI Demo</title>

		<?php
			include_once("init.php");
		?>

		<link rel="stylesheet" href="css/demo.css" type="text/css" />

	</head>

	<body>

	<div id="leftbar">
		<div class="innertube" style="margin: 2px;">

			<div class="menutitle">Components</div>

			<a class="link" href="?demo=ui.resizable">Resizable</a>
			<a class="link" href="?demo=ui.draggable">Draggable</a>
			<a class="link" href="?demo=ui.droppable">Droppable</a>
			<a class="link" href="?demo=ui.sortable">Sortable</a>
			<a class="link" href="?demo=ui.selectable">Selectable</a>
			<a class="link" href="?demo=ui.accordion">Accordion</a>
			<a class="link" href="?demo=ui.dialog">Dialog</a>
			<a class="link" href="?demo=ui.slider">Slider</a>
			<a class="link" href="?demo=ui.tabs">Tabs</a>

			<br/><br/>

		</div>
	</div>

	<div id="maincontent">

		<div id="topbar">
			<h1>jQuery UI 1.5 - Demos</h1>
		</div>

		<div id="main" class="innertube" style="padding: 10px;">
			<?
                if (file_exists($demo)){
                    include($demo);
                }
                else {
                    echo("<p>Welcome to jQuery UI Demo's, an interactive page for looking at and playing with each jQuery UI component.</p>");
                }

            ?>
		</div>

	</div>

	</body>

</html>

<script type="text/javascript">

	$(function() {


	});

</script>
