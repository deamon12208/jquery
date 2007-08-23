<?php
	/**
	 * ---------------------------------------------------------------------------
	 * Demo 3: Unobtrusive file uploads using uiUpload and one PHP script.
	 * ---------------------------------------------------------------------------
	 * Not possible without help from this blog:
	 *
	 * PHP, FileReference, and sessions: a bug from hell
	 * <http://www.5etdemi.com/blog/archives/2006/10/php-filereference-and-sessions-a-bug-from-hell/>
	 *
	 * In retrospect: if you plan to use sessions in conjunction with FileReference, do the following:
	 * - Use session_start() in the container html file and pass the session id using
	 *   echo session_id() in the FlashVars to the Flash file
	 * - Append the session id to the url for any and all calls to the server made within Flash
	 * - Call session_id($_GET['PHPSESSID']) before session_start() in any of the php files which with
	 *   Flash communicates with
	 * ---------------------------------------------------------------------------
	 */
	define('wcDemo', 'demo3');
	require_once('../php/shared.php');



//====================================================================================================
// HELPER FUNCTIONS
	/**
	 * Checks to see if the current request is an AJAX request
	 */
	function isAjax() {
		return (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && ($_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest'));
	}



//====================================================================================================
// START SCRIPT
	//
	// Solves bug with sessions and fileReference from flash (see blog).
	// WARNING: THIS IS A SECURITY HOLE, SINCE YOU NORMALLY DON'T WANT TO ALTER THE SESSION_ID!!!
	// - You should check to see if the user agent is "Flash" (although this can be spoofed)
	// - You should store the sessions in a database (not via cookies or on the server harddisk)
	// - You should only put file upload data in this session (nothing sensitive!)
	if ((strtolower($_SERVER['HTTP_USER_AGENT']) == 'shockwave flash') && isset($_GET['PHPSESSID'])) {
		session_id($_GET['PHPSESSID']);
	}
	session_start();

	//
	// Reset session data in case of reload
	if (!isAjax() && empty($_POST) && empty($_FILES)) {
		$_SESSION[wcDemo]['uiUpload'] = array();
		$_SESSION[wcDemo]['uiUpload']['active'] = false;
		$_SESSION[wcDemo]['uiUpload']['files'] = array();
	}



//====================================================================================================
// UIUPLOAD FUNCTIONS
	//
	// Form validation using AJAX
	if (isAjax()) {
		//
		// Clear array so the $_POST knows we're calling from uiUpload
		$_SESSION[wcDemo]['uiUpload']['active'] = true;


		//
		// Normally, you would do some processing and in case of no errors, you would trigger the file upload from the uiUpload widget.
		header('content-type: application/x-javascript');

		//
		// VERY simple validation
		if (trim($_POST['test1']) == '') {
			echo "alert('Message from uiUpload (backend):".'\n'."You forgot to enter a value for the field: test1');";
		} else {
			//
			// Process the uploads, trigger the upload from the backend
			echo "jQuery('#uiUploadDemo3')[0].upload();";
		}

		//
		// Stop processing, since we don't want the HTML to be printed.
		die();
	}

	//
	// uiUpload: Flash File upload. File upload completed
	if (isset($_FILES['Filedata']['name'])) {
		$strFile = $_FILES['Filedata']['tmp_name'];
		$intError = -1;

		//
		// Not an uploaded file
		if (!is_uploaded_file($strFile)) {
			$intError = 400;
		}

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
			$_SESSION[wcDemo]['uiUpload']['files'][] = $_FILES['Filedata'];

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

		//
		// Write session variables!
		session_write_close();
		die();
	}

	//
	// Process uploads from
	if (!empty($_POST) && ($_SESSION[wcDemo]['uiUpload']['active'] == true)) {
		echo 'Form processing (uiUpload)<br />';

		echo '<strong>Submitted data:</strong><br />';
		echo '<pre>';
		print_r($_POST);
		echo '</pre>';
		echo '<br /><br />';

		echo '<strong>Uploaded files:</strong><br />';
		echo '<pre>';
		print_r($_SESSION);
		echo '</pre>';
		echo '<br /><br />';
		die();
	}



//====================================================================================================
// UNOBTRUSIVE FUNCTIONS
	//
	// In case of default file upload (e.g. unobtrusive)
	if (!empty($_POST)) {
		// Normally you would process the form here:
		// - first check the form
		// - print errors
		//
		// (or)
		//
		// process the form in case of no errors:
		// - move file uploads
		// - add DB record etc.
		echo 'Form processed, but not checked in any way! (normal)<br />';

		echo '<strong>Submitted data:</strong><br />';
		echo '<pre>';
		print_r($_POST);
		echo '</pre>';
		echo '<br /><br />';

		echo '<strong>Uploaded files:</strong><br />';
		echo '<pre>';
		print_r($_FILES);
		echo '</pre>';
		echo '<br /><br />';
		die();
	}

?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<title>uiUpload | Demo</title>
	<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">

	<!-- Stylesheet (core) -->
	<link rel="stylesheet" type="text/css" href="../css/style.css" />

	<!-- Javascript (core) -->
	<script type="text/javascript" src="../js/jquery-svn.js"></script>
	<script type="text/javascript" src="../js/script.js"></script>
	<script type="text/javascript">
	// <![CDATA[
		$.ui = {};
	// ]]>
	</script>
	<script type="text/javascript" src="../_src/ui.upload.js"></script>

	<!-- Javascript (demo) -->
	<script type="text/javascript">
	// <![CDATA[
		jQuery(document).ready(function() {
				jQuery('.inputWrapper').upload({
						bDebug: false,
						sName: 'uiUploadDemo3',
						oBrowse: jQuery('#btnBrowse'),
						oUpload: null,
						oReset: jQuery('#btnReset'),
						sScript: jQuery('form:eq(0)').attr('action')+'?PHPSESSID=<?=session_id();?>',
						sMovie: '/_src/ui.upload.swf',
						dMaxSize: 5120000,
						sFileFilters: [
										'All files (*.*)|*.*',
										'Images (*.gif,*.png,*.jpg)|*.gif;*.png;*.jpg'
									],
						aCallback: {
							swfInitialized: function(oUI) {
									// Flash movie succesfully created, now remove old file objects
									jQuery('.inputWrapper').remove();

									// And show the UI upload
									jQuery('.uiUpload').show();

									//
									// DEMO3: Replace the default submit function, after the uiUpload was initialized.
									jQuery('#frmUpload').submit(function() {
											return false;
										});

									//
									// DEMO3: Add new submit handler to function
									jQuery("#btnSubmit").click(function() {
											hshOptions = {
												url: jQuery('#frmUpload').attr('action'),
												target: '#result',
												dataType: 'script',
												beforeSubmit: function() {
													alert('Message from ajaxSubmit:\nthe form will now be submitted using AJAX (form validation)');
												}
											};

											// Assign submit code to the first found form
											jQuery('#frmUpload').ajaxForm(hshOptions);
										});
								},
							queueEmpty: function(oUI) {
									alert('Queue was empty, but form is now submitted!');
									jQuery("#frmUpload")[0].submit();
								},
							fileAdded: function(oUI) {
									sHTML = '<div class="uiUploadItem" id="' + oUI.oFile.id + '">';
									sHTML+= '<div class="uiUploadItemWrapper">';
									sHTML+= '<a href="javascript://" title="Delete upload">' + oUI.oFile.name + '</a> <span class="cbInformation">(' + $.ui.upload.formatSize(oUI.oFile.size) + ')</span>';
									sHTML+= '<div class="uiUploadProgress"><div class="uiUploadProgressBar"> 0% </div></div>';
									sHTML+= '&#0187; <strong>Processed:</strong> <span class="cBytesProcessed">0 bytes</span> of <span class="cBytesTotal">' + $.ui.upload.formatSize(oUI.oFile.size) + '</span> <span class="cSpeedTime">&nbsp;</span>';
									sHTML+= '</div>';
									oHTML = jQuery(sHTML);
									jQuery('.uiUploadQueue').append(oHTML);

									// Add CSS class
									jQuery('A', oHTML).attr('class', 'uploadDelete');

									// Add handler
									var _oUI = oUI;
									jQuery('A', oHTML).click(function() {
											// Callback to Flash to remove the file from the queue
											jQuery('#' + _oUI.options.sName)[0].cancelFile(_oUI.oFile.id);

											// If the file was succesfully removed, Flash calls back to Javascript
											return false;
										});
								},
							fileCancelled: function(oUI) {
									jQuery('#' + oUI.oFile.id).remove();												
									alert('The file you\'ve selected (' + oUI.oFile.name + ') was removed from the queue');
								},
							fileRemoved: function(oUI) {
									jQuery('#' + oUI.oFile.id).remove();
									alert('The file you\'ve selected (' + oUI.oFile.name + ') was removed from the queue');
								},
							queueCompleted: function(oUI) {
									sStatus = 'Upload queue: Uploaded ' + oUI.oProgress.qIndex + ' of ' + oUI.oProgress.qCount + ' files. ';
									sStatus+= $.ui.upload.formatSize(oUI.oProgress.qbDone) + ' at ';
									sStatus+= $.ui.upload.formatSize(oUI.oProgress.qbSpeed) + '/sec (' + oUI.oProgress.qProgress + '%)';
									jQuery('h2.uiUploadStatus').html(sStatus);

									alert('complete current queue (' + oUI.oProgress.qCount + ' items) uploaded, form is now submitted!');
									jQuery("#frmUpload")[0].submit();
								},
							fileStarted: function(oUI) {
									jQuery('#' + oUI.oFile.id).addClass('active').animate({ height: 80 }, 200);
									jQuery('span.cbInformation', '#' + oUI.oFile.id).html('&nbsp;');
								},
							fileProgress: function(oUI) {
									sStatus = 'Upload queue: uploading ' + oUI.oProgress.qIndex + ' of ' + oUI.oProgress.qCount + ' files. ';
									sStatus+= $.ui.upload.formatSize(oUI.oProgress.qbDone) + ' at ';
									sStatus+= $.ui.upload.formatSize(oUI.oProgress.qbSpeed) + '/sec (' + oUI.oProgress.qProgress + '%) ';
									sStatus+= $.ui.upload.formatTime(oUI.oProgress.qtRemain) + ' remaining...';
									jQuery('h2.uiUploadStatus').html(sStatus);

									// Other shite
									jQuery('div.uiUploadProgressBar', '#' + oUI.oFile.id).css('width', oUI.oProgress.cProgress + '%').html('&nbsp;' + oUI.oProgress.cProgress + '%&nbsp;');
									jQuery('span.cBytesProcessed', '#' + oUI.oFile.id).html($.ui.upload.formatSize(oUI.oProgress.cbDone));
									jQuery('span.cSpeedTime', '#' + oUI.oFile.id).html('at ' + $.ui.upload.formatSize(oUI.oProgress.cbSpeed) + '/sec; ' + $.ui.upload.formatTime(oUI.oProgress.ctRemain));
								},
							fileCompleted: function(oUI) {
									jQuery('#' + oUI.oFile.id).removeClass('active').animate({ height: 40 }, 200);
									jQuery('span.cbInformation:eq(0)', '#' + oUI.oFile.id).html('(' + $.ui.upload.formatSize(oUI.oFile.size) + ' uploaded at ' + $.ui.upload.formatSize(oUI.oProgress.cbSpeed) + '/sec; ' + $.ui.upload.formatTime(oUI.oProgress.ctBusy) + ')');
									jQuery('A', '#' + oUI.oFile.id).attr('class', 'uploadSuccess').unclick();
								}
						}
					});
			});
	// ]]>
	</script>
</head>
<body>
	<h1>uiUpload &quot;demo 3&quot;</h1>
	<strong>Complete working example of a script which handles both uploads and the form. Backend is completely unobtrusive, try disabling the javascript.</strong><br />
	<br />

	<div class="blue">
		<strong>Notes:</strong><br />
		<ul>
			<li>We use the default submit and reset buttons which where present in the form!</li>
			<li>Communication is done using SESSIONS</li>
		</ul>
	</div>
	<br />

	In case Javascript (and/or) Flash is disabled, this form works like a normal HTML form:<br />
	<ul>
		<li>Files are uploaded to the server</li>
		<li>The backend script processed form validation</li>
		<li>In case there are form validation errors, the user has to reselect the files and try again</li>
	</ul>
	<br />

	In case Javascript (and/or) Flash are NOT disabled, this form works like this:<br />
	<ol>
		<li>First, the form is validated using AJAX.</li>
		<li>Second,the uploads are processed.</li>
		<li>Third, the form is submitted.</li>
	</ol>
	Basicly you could also switch action 2 and 3, meaning first submit the form (using AJAX) and then process the uploads, but that is upto you. It is merely a matter of how you save the data in the session and code your backend.<br />
	<br />

	<div id="result">
	</div>

	<form action="/demo3/" enctype="multipart/form-data" method="post" id="frmUpload">
		<fieldset>
			<legend>Some text entry fields</legend>

			<label for="test1">Label for field 1:</label><br />
			<input type="text" name="test1" id="test1" /><br />
			<br />

			<label for="test1">Label for field 2:</label><br />
			<input type="text" name="test2" id="test2" /><br />
			<br />

			<label for="test1">Label for field3:</label><br />
			<input type="text" name="test3" id="test3" /><br />
			<br />
		</fieldset>
		<br />

		<fieldset>
			<legend>Some file upload fields</legend>

			<div class="inputWrapper">
				<label for="upload1">Upload field 1</label>
				<input type="file" id="upload1" name="upload1" />
			</div>

			<div class="inputWrapper">
				<label for="upload2">Upload field 2</label>
				<input type="file" id="upload2" name="upload2" />
			</div>

			<div class="inputWrapper">
				<label for="upload3">Upload field 3</label>
				<input type="file" id="upload3" name="upload3" />
			</div>

			<div class="inputWrapper">
				<label for="upload4">Upload field 4</label>
				<input type="file" id="upload4" name="upload4" />
			</div>

			<div class="inputWrapper">
				<label for="upload5">Upload field 5</label>
				<input type="file" id="upload2" name="upload5" />
			</div>

			<!-- uiUpload -->
			<!-- Doesn't need to be inside the form tag, but for this demo, we will! -->
			<div class="uiUpload">
				<h2 class="uiUploadStatus">Upload queue:</h2>
				Please choose <strong>ZERO</strong> (or more :p) files with the Browse button.<br />
				<div class="uiUploadQueue">
				</div>
				<br />

				<button id="btnBrowse">Browse!</button>
			</div>
		</fieldset>
		<br />

		<fieldset>
			<legend>Submit buttons</legend>

			<input type="submit" id="btnSubmit" /> &nbsp; <input type="reset" id="btnReset" />
		</fieldset>
	</form>
</body>
</html>
