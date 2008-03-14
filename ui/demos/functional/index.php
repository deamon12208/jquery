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
			
			<div class="menutitle">Component</div>
			
			<a class="link" href="#Resizable">Resizable</a>
			<a class="link" href="#Draggable">Draggable</a>
			<a class="link" href="#Droppable">Droppable</a>
			<a class="link" href="#Sortable">Sortable</a>
			<a class="link" href="#Selectable">Selectable</a>
			<a class="link" href="#Accordion">Accordion</a>
			<a class="link" href="#Dialog">Dialog</a>
			<a class="link" href="#Slider">Slider</a>
			<a class="link" href="#Tabs">Tabs</a>
		
			<br/><br/>
			
			<div class="menutitle">Options</div>
			<div id="options">
				<a class="link" href="#Droppable">Droppable</a>
				<a class="link" href="#Sortable">Sortable</a>
			</div>
		</div>
	</div>
	
	<div id="maincontent">
		
		<div id="topbar">
			<h1>jQuery UI 1.5 - Demos</h1>
		</div>
		
		<div class="innertube">
			<p>dsfasdf sadf asd</p><p>dsfasdf sadf asd</p><p>dsfasdf sadf asd</p><p>dsfasdf sadf asd</p><p>dsfasdf sadf asd</p><p>dsfasdf sadf asd</p><p>dsfasdf sadf asd</p><p>dsfasdf sadf asd</p>
			<p>dsfasdf sadf asd</p><p>dsfasdf sadf asd</p><p>dsfasdf sadf asd</p><p>dsfasdf sadf asd</p><p>dsfasdf sadf asd</p><p>dsfasdf sadf asd</p><p>dsfasdf sadf asd</p><p>dsfasdf sadf asd</p><p>dsfasdf sadf asd</p>
			<p>dsfasdf sadf asd</p><p>dsfasdf sadf asd</p><p>dsfasdf sadf asd</p><p>dsfasdf sadf asd</p>
		</div>

		<div id="bottombar">
			<h1>jQuery UI 1.5 - Demos</h1>
			teste
		</div>
		
	</div>
		
	</body>

</html>

<script type="text/javascript">
	
	$(function() {
		
		$('#topbar').resizable({transparent:true});
		
		
	});
	
</script>