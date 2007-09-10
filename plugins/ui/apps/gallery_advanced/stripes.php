<?php 

// Content type

$path = $_GET['path'];
$width = $_GET['width'];
$height = $_GET['height'];



//Look for images in directory
$images = array();
$dir = dir($path);
while($file = $dir->read()) {
	if($file != "." && $file != ".." && $file != ".svn" && !preg_match('/_tn_/', $file)) {
		array_push($images, $file);
  	}
}
$dir->close();
$cachename = $path.'/cache_tn_'.md5(join('', $images))."_".$width."_".$height.".jpg";




if(!file_exists($cachename)) {
	$stripe = imagecreatetruecolor($width * count($images), $height);
	
	$i = 0;
	foreach($images as $filename) {
		$image   = imagecreatefromjpeg($path."/".$filename);
		imagecopyresampled($stripe, $image, $i++ * $width, 0, 0, 0, $width, $height, imagesx($image), imagesy($image));
	}
	
	imagejpeg($stripe, $cachename);
	imagedestroy($stripe);
}


// Content type
header('Content-type: image/jpeg');

readfile($cachename);

?>