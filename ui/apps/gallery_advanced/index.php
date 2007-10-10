<?php
$albums = array();
$album_dir = dir("images/albums");
$i = 0;
while($file = $album_dir->read()) {
	if($file != "." && $file != ".." && $file != ".svn") {
		$images = array();
		$sub_dir = dir("images/albums/".$file);
		while($image = $sub_dir->read()) {
			if($image != "." && $image != ".." && $image != ".svn" && !preg_match('/_tn_/', $image)) array_push($images, $image);
		}
		$sub_dir->close();
		array_push($albums, array('id' => $i++, 'name' => $file, 'path' => "images/albums/".$file, 'images' => $images, 'length' => count($images)));
  	}
}
$album_dir->close();
echo '<?xml version="1.0" encoding="UTF-8"?>';
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<meta http-equiv="Content-Language" content="en" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>jQuery UI Demo Application: Gallery</title>
<link rel="stylesheet" href="../../../../themes/flora/flora.all.css" type="text/css">
<link rel="stylesheet" href="css/style.css" type="text/css">

<script type="text/javascript" src="../../../../jquery/src/core.js"></script>
<script type="text/javascript" src="../../../../jquery/src/selector.js"></script>
<script type="text/javascript" src="../../../../jquery/src/event.js"></script>
<script type="text/javascript" src="../../../../jquery/src/ajax.js"></script>
<script type="text/javascript" src="../../../../jquery/src/fx.js"></script>
<script type="text/javascript" src="../../../../jquery/src/offset.js"></script>
<script type="text/javascript" src="../../../dimensions/jquery.dimensions.js"></script>
<script type="text/javascript" src="../../../mousewheel/jquery.mousewheel.js"></script>


<script type="text/javascript" src="../../ui.mouse.js"></script>
<script type="text/javascript" src="../../ui.slider.js"></script>
<script type="text/javascript" src="../../ui.draggable.js"></script>
<script type="text/javascript" src="../../ui.draggable.ext.js"></script>
<script type="text/javascript" src="../../ui.droppable.js"></script>
<script type="text/javascript" src="../../ui.droppable.ext.js"></script>
<script src="jquery.ifixpng.js" type="text/javascript"></script>

<script type="text/javascript" src="behaviour.js"></script>
</head>
<body class="flora">	
	<div class="gallery container">

		<div class="left">
			<ul class="items">
				<?php
					foreach($albums as $album) {
						echo '<li><a href="javascript:showContainer(\'#container-'.$album['id'].'\', \''.$album['name'].'\')"><div class="thumb" stripelength="'.$album['length'].'" container="#container-'.$album['id'].'" style="background-image: url(\'stripes.php?path='.$album['path'].'&width=80&height=60\');"></div><span>'.$album['name'].'</span></a></li>';
					}
				?>
			</ul>
		</div>
		
		<div class="overlay"></div>

		<?php
		foreach($albums as $album) {
			echo '<div class="right" style="display: none;" id="container-'.$album['id'].'">';
			foreach($album['images'] as $image) {
				echo '<img class="thumb" src="thumb.php?i='.$album['path'].'/'.$image.'&size=270" path="'.$album['path'].'/'.$image.'">';
			}
			echo '</div>';
		}
		?>
		
		<div class="bottom">
			<a href="http://ui.jquery.com"><img src="images/ui.png" id="logo" /></a>
			<div id="heading">Animals</div>
			<div class="slider">
				<div class="handle ui-slider-handle">
			</div>
		</div>

	</div>
</body>
</html>
