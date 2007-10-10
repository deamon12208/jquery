<?php
	define('wcDemo', 'demo1');
	require_once('../php/shared.php');

	/**
	 * Actual script processing
	 */
	if (isset($_FILES['Filedata']['name'])) {
		$strFile = $_FILES['Filedata']['tmp_name'];
		$intError = -1;

		//
		// Not an uploaded file
		if (!is_uploaded_file($strFile)) {
			$intError = 400;
		}
/*
		//
		// Check filesize
		if (($intError == -1) && ($_FILES['Filedata']['size'] > (256 * 1024))) {
			$intError = 413;
		}

		//
		// Check image condition
		if ($intError == -1) {
			$arrSize = @getimagesize($strFile);
			if (!$arrSize) {
				$intError = 409;
			}

			//
			// Check image dimensions
			if (($intError == -1) && (($arrSize[0] < 25) || ($arrSize[1] < 25))) {
				$intError = 412;
			}

			//
			// Check filetype
			if (($intError == -1) && (!in_array($arrSize[2], array(1, 2, 3, 7, 8)))) {
				$intError = 415;
			}
		}
*/

		//
		// Check to see if we have to report a critical error.
		// This error is sent back to Flash, and Flash fires it back to Javascript.
		if (!$intError == -1) {
			//
			// Find HTTP error
			$strError = HTTPStatus($intError);

			//
			// Write log entry
			writeLog('Upload failed ('.$strError.')', $_FILES['Filedata']['name']);

			//
			// Send headers
			header($strError);
		} else {
			//
			// Move file
			//move_uploaded_file($_FILES['Filedata']['tmp_name'], $_SERVER['DOCUMENT_ROOT'].'/'.$_FILES['Filedata']['name']);

			//
			// Upload valid and succesfull
			writeLog('Upload completed', $_FILES['Filedata']['name']);
		}

		//
		// For demo: ALWAYS REMOVE UPLOAD
		@unlink($strFile);

		//
		// Prevent bug in Mac OS 8 flash player
		echo ' ';
	}
?>