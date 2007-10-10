<?php 

$filename      = $_GET['i'];
$size = $_GET['size'];


//Path info
$path = explode(".", $_GET['i']);
$ext = array_pop($path);
$thumb = implode($path); 

if(!file_exists($thumb."_tn_".$size.".".$ext)) {

	// Set a maximum height and width
	$width  = $size;
	$height = $size;
	
	// Get new dimensions
	list($width_orig, $height_orig) = getimagesize($filename);
	
	if ($width && ($width_orig < $height_orig)) {
		$width = ($height / $height_orig) * $width_orig;
	} else {
		$height = ($width / $width_orig) * $height_orig;
	}
	
	// Resample
	$image_p = imagecreatetruecolor($width, $height);
	$image   = imagecreatefromjpeg($filename);
	imagecopyresampled($image_p, $image, 0, 0, 0, 0, $width, $height, $width_orig, $height_orig);
	
	// Output
	imagejpeg($image_p, $thumb."_tn_".$size.".".$ext);
	imagedestroy($image);
	imageDestroy($image_p);
	
}


// Content type
header('Content-type: image/jpeg');

$fp = fopen($thumb."_tn_".$size.".".$ext, "r");
echo fread($fp, filesize($thumb."_tn_".$size.".".$ext));
fclose($fp);
?>