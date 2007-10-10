<?php
	//
	// Constants
	define('wcDebug', false);
	define('wcLogfile', '../ui.upload.log');

	/**
	 * HTTP/1.1 Protocol defined status codes
	 * @param int $intNumber
	 */
	function HTTPStatus($intNumber) {
		$arrHTTP = array(
				       100 => 'Continue',
				       101 => 'Switching Protocols',
				       200 => 'OK',
				       201 => 'Created',
				       202 => 'Accepted',
				       203 => 'Non-Authoritative Information',
				       204 => 'No Content',
				       205 => 'Reset Content',
				       206 => 'Partial Content',
				       300 => 'Multiple Choices',
				       301 => 'Moved Permanently',
				       302 => 'Found',
				       303 => 'See Other',
				       304 => 'Not Modified',
				       305 => 'Use Proxy',
				       307 => 'Temporary Redirect',
				       400 => 'Bad Request',
				       401 => 'Unauthorized',
				       402 => 'Payment Required',
				       403 => 'Forbidden',
				       404 => 'Not Found',
				       405 => 'Method Not Allowed',
				       406 => 'Not Acceptable',
				       407 => 'Proxy Authentication Required',
				       408 => 'Request Time-out',
				       409 => 'Conflict',
				       410 => 'Gone',
				       411 => 'Length Required',
				       412 => 'Precondition Failed',
				       413 => 'Request Entity Too Large',
				       414 => 'Request-URI Too Large',
				       415 => 'Unsupported Media Type',
				       416 => 'Requested range not satisfiable',
				       417 => 'Expectation Failed',
				       500 => 'Internal Server Error',
				       501 => 'Not Implemented',
				       502 => 'Bad Gateway',
				       503 => 'Service Unavailable',
				       504 => 'Gateway Time-out'
				   );

		//
		// Return HTTP error code
		if (isset($arrHTTP[$intNumber])) {
			$intNumber = 501;
		}

		//
		// Return correct error code
		return 'HTTP/1.1 '.$intNumber.' '.$arrHTTP[$intNumber];
	}

	/**
	 * Helper function
	 */
	function writeLog($strMessage, $strFile) {
		$strLogfile = file_get_contents(wcLogfile);
		$strLogfile.= strftime('%A %d %B %Y %H:%M:%S').' - '.wcDemo.' - '.$strMessage.' ('.gethostbyaddr($_SERVER['REMOTE_ADDR']).' / '.$strFile.')'."\n";
		file_put_contents(wcLogfile, $strLogfile);
	}
?>