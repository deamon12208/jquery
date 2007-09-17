<?php
$albums = array();
$album_dir = dir("images/albums");
$i = 0;
while($file = $album_dir->read()) {
	if($file != "." && $file != ".." && $file != ".svn") {

		$images = array();
		$sub_dir = dir("images/albums/".$file);
		while($image = $sub_dir->read()) {
			if($image != "." && $image != ".." && $image != ".svn" && !preg_match('/_tn_/', $image)) {
				array_push($images, $image);
		  	}
		}
		$sub_dir->close();

		//Add folder
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


<style type="text/css">

  @import url(../../../../themes/flora/flora.all.css);

</style>

<style type="text/css" media="all">

body { background: #000; margin: 0; padding: 50px; font-family: Lucida Sans, Arial; font-size: 12px; }
.container { height: 615px; width: 974px; margin: 0 auto; position: relative; background-image: url(images/bg.png); }

/* Inner container definitions */
div.gallery div.left { background-image: url(images/left.png); width: 185px; height: 565px; position: absolute; top: 25px; left: 25px; overflow-y: auto; overflow-x: hidden; }
div.gallery div.bottom { height: 50px; left: 220px; right: 25px; position: absolute; bottom: 25px;}
div.gallery div.right { position: absolute; top: 25px; right: 25px; bottom: 80px; padding-bottom: 20px; left: 220px; overflow: auto; border: 1px solid #777; border-bottom: 0; border-right: 0; }

div.gallery div.overlay { display: none; background: #000; position: absolute; top: 25px; right: 25px; bottom: 25px; padding-bottom: 20px; left: 220px; overflow: auto; z-index: 20; text-align: center; border: 1px solid #777; border-bottom: 0; border-right: 0; }
div.gallery div.overlay img { cursor: pointer; cursor: hand; border: 1px solid #fff; padding: 5px; background-color: #666; position: absolute; }
div.gallery div.overlay img:hover { border: 1px solid #fff; background-color: #fff; }

/* Styling the left hand navigation */
div.gallery ul.menue { list-style-type: none; margin: 0; padding: 0; }
div.gallery ul.menue a.selected { background: #bbb; }
div.gallery ul.menue a.over { background: #aaa; }
div.gallery ul.menue ul.items { list-style-type: none; margin: 0; padding: 10px; }
div.gallery ul.menue ul.items a { text-decoration: none; display: block; position: relative; color: #333; height: 80px; margin-bottom: 10px; }
div.gallery ul.menue ul.items a:hover { background: #ccc; }
div.gallery ul.menue ul.items a:focus { background: #ccc; }
div.gallery ul.menue ul.items a.over { background: #ccc; }
div.gallery ul.menue ul.items a span { position: absolute; top: 35px; left: 95px; display: block; width: 90px; }
div.gallery ul.menue ul.items li div.thumb { border: 1px solid #333; width: 80px; height: 60px; position: absolute; top: 10px; left: 5px; }
div.gallery ul.tree { list-style-type: none; margin: 0; padding-left: 10px; }

/* The slider control at bottom */
div.gallery div.bottom div.slider { height: 22px; width: 200px; position: absolute; top: 15px; right: 60px; background-image: url(images/slider_bg.png); background-position: 0px 1px; }
div.gallery div.bottom div.slider div.handle { position: absolute; top: 2px; left: 0px; height: 22px; width: 23px; background-image: url(images/slider.png); }

#heading { color: #ff9900; position: absolute; top: 10px; left: 10px; font-size: 22px; letter-spacing:1px; font-family: Verdana; }
#logo { position: absolute; top: 10px; right: 0px; }

/* The main thumbnails */
div.gallery div.right img.thumb { border: 1px solid #333; width: 100px; float: left; position: relative; margin-left: 10px; margin-top: 10px; cursor: pointer; cursor: hand; }
div.gallery div.right img.hover { border: 1px solid #fff; z-index: 5;}


/* Drag & Drop */
div.draggable img { width: 100px; border: 1px solid #AED5EA; }

</style>


<script type="text/javascript" src="../../../../jquery/src/core.js"></script>
<script type="text/javascript" src="../../../../jquery/src/selector.js"></script>
<script type="text/javascript" src="../../../../jquery/src/event.js"></script>
<script type="text/javascript" src="../../../../jquery/src/ajax.js"></script>
<script type="text/javascript" src="../../../../jquery/src/fx.js"></script>
<script type="text/javascript" src="../../../../jquery/src/offset.js"></script>
<script type="text/javascript" src="../../../dimensions/jquery.dimensions.js"></script>
<script type="text/javascript" src="../../../mousewheel/jquery.mousewheel.js"></script>


<script type="text/javascript" src="../../ui.accordion.js"></script>
<script type="text/javascript" src="../../ui.tabs.js"></script>
<script type="text/javascript" src="../../ui.effects.js"></script>
<script type="text/javascript" src="../../ui.mouse.js"></script>
<script type="text/javascript" src="../../ui.resizable.js"></script>
<script type="text/javascript" src="../../ui.slider.js"></script>
<script type="text/javascript" src="../../ui.draggable.js"></script>
<script type="text/javascript" src="../../ui.draggable.ext.js"></script>
<script type="text/javascript" src="../../ui.droppable.js"></script>
<script type="text/javascript" src="../../ui.droppable.ext.js"></script>
<script type="text/javascript" src="../../ui.magnifier.js"></script>
<script type="text/javascript" src="../../ui.tree.js"></script>


<script type="text/javascript" src="behaviour.js"></script>
</head>
<body class="flora">
	
	<div class="gallery container">
		

		<div class="left">
			<ul class="menue">
				<li>
					<ul class="items">
<?php
foreach($albums as $album) {
	echo '<li><a href="javascript:showContainer(\'#container-'.$album['id'].'\', \''.$album['name'].'\')"><div class="thumb" stripelength="'.$album['length'].'" container="#container-'.$album['id'].'" style="background-image: url(\'stripes.php?path='.$album['path'].'&width=80&height=60\');"></div><span>'.$album['name'].'</span></a></li>';
}
?>
					</ul> 
				</li>
			</ul>
		</div>
		
		<div class="overlay">
		</div>

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

			<img src="images/ui.png" id="logo" />
			
			<div id="heading">Animals</div>

			<div class="slider">
				<div class="handle ui-slider-handle">
			</div>
		</div>
		
		
	</div>
	
</body>
</html>
