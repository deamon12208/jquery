/**
 * uiUpload: unobtrusive file uploads using Flash and jQuery.
 * Largely based on SWFUpload <http://profandesign.se/swfupload/>
 *
 * SWFUpload is (c) 2006-2007 Lars Huring, Olov Nilzén and Mammon Media and is
 * released under the MIT License.
 *
 * uiUpload is (c) 2007 Gilles van den Hoven (http://webunity.nl) and is dual
 * licensed under the MIT and GPL licenses.
 *
 * Documentation:
 * Please refer to the wiki on <http://docs.jquery.com> for up to date
 * documentation and Frequently Asked Questions.
 *
 * Licensing information:
 * MIT license <http://www.opensource.org/licenses/mit-license.php>
 * GPL license <http://www.opensource.org/licenses/gpl-license.php>
 */
(function($) {
	/**
	 * Helper function to build strings
	 */
	$.ui.sBuilder = function(sJoin) {
		this.aStrings = new Array;
		this.sJoin = (!sJoin) ? '' : sJoin;

		$.ui.sBuilder.prototype.add = function(sData) {
			if (!sData) return;
			this.aStrings.push(sData);
		};

		$.ui.sBuilder.prototype.toString = function() {
			return this.aStrings.join(this.sJoin);
		};
	};

	//
	// Generate UI upload object
	$.ui.upload = {
		locker: new Array(),
		/**
		 * This function is called from the Flash movie.
		 * @param string Callback name
		 * @param string Movie identifier
		 * @param variable Either a boolean or a "file" object
		 * @param variable If supplied, an object containing upload progress information
		 */
		callback: function(sWhat, sMovieID, vP1, vP2, vP3) {
				var oUI = $.ui.upload.locker[sMovieID];
				var fCb = oUI.aCallback[sWhat];

				//
				// Check for valid function, and fire callback!
				if ($.isFunction(fCb)) {
					//
					// Base UI callback options (as discussed on the jQuery-UI mailinglist)
					oOpt = {
							event: null,
							options: oUI
						};

					//
					// Additional options, depending on the callback
					if ((sWhat == 'swfInitialized') || (sWhat == 'dialogPostShow'))
						oOpt.success = vP1;
					else if (sWhat == 'fileErrorHTTP')
						oOpt.errCode = vP3;
					else if (sWhat == 'fileErrorSecurity')
						oOpt.errString = vP3;

					// File and progress objects
					if (typeof vP1 == 'object')
						oOpt.oFile = vP1;

					if (typeof vP2 == 'object')
						oOpt.oProgress = vP2;

					//
					// Callback
					fCb(oOpt);
				}
			},
		/**
		 * Debug function
		 * @param string value to log
		 * @param boolean if we have to force the message
		 */
		debug: function(sValue, bForce) {
				if (!bForce || (bForce == false))
					return;

				if (window.console)
					console.log(sValue);
				else
					alert(sValue);
			},
		/**
		 * Prints the settings of a person uiUpload object
		 * @param object the object to "read"
		 */
		debugSettings: function(oUpload) {
				var oSbDebug = new $.ui.sBuilder("\n");
				oSbDebug.add('----- DEBUG SETTINGS START ----');
				oSbDebug.add('ID: ' + oUpload.opt.sName);
				for (var sKey in oUpload.opt) {
					oSbDebug.add(sKey + ': ' + oUpload.opt[sKey]);
				}
				oSbDebug.add('----- DEBUG SETTINGS END ----');
				$.upload.debug(oSbDebug.toString(), true);
			},
		/**
		 * Formats the input to a readable filesize
		 * @param integer
		 */
		formatSize: function(iInput) {
				var aSize = Array('B', 'KB', 'MB', 'GB', 'TB');
				var iSize = iInput;
				var iIndex = 0;
				while (iSize > 1024) {
					iIndex++;
					iSize/=1024;
				}
				return (Math.round(iSize * 100) /100) + ' ' + aSize[iIndex];
			},
		/**
		 * Formats the input to a readable time format
		 * @param integer
		 */
		formatTime: function(iInput) {
				var sTime,iSeconds,iMinutes,iHours;
				iSeconds = Math.round(iInput % 60);
				iMinutes = Math.round((iInput / 60) % 60);
				iHours = Math.round(iInput / 3600);

				// Build the time
				sTime = '';
				if (iHours > 0)
					sTime+= ((iHours < 10) ? '0' + iHours : iHours) + ':';
				sTime+= ((iMinutes < 10) ? '0' + iMinutes : iMinutes) + ':';
				sTime+= ((iSeconds < 10) ? '0' + iSeconds : iSeconds);
				return sTime;
			},
		/**
		 * The actual constructor
		 */
		build: function(oOptions) {
			// Default options.
			// Callbacks, marked with an asterix are new for uiUpload
			this.oUI = {
					bDebug: false,
					sName: 'uiUpload' + ($.ui.upload.locker.length + 1),
					oBrowse: null,
					oUpload: null,
					oReset: null,
					sFileFilters: [ 'All files (*.*)|*.*' ],	// Allowed file types
					dMaxSize: 250,								// Max filesize (250kb)
					sScript: '',								// Path to upload script (backend, e.g. PHP/Perl/CGI/ASP/.NET)
					sMovie: '',									// Path to flash movie with upload functionality
					aCallback: {
							swfCallback: '',					// (callback) Flash file successfully loaded
							dialogPreShow: '',					// (callback*) Show dialog (just before dialog is shown, e.g. for lightbox :) :)
							dialogPostShow: '',					// (callback*) Hide dialog (just after dialog is shown, e.g. for lightbox :) :)
							queueStarted: '',					// Start uploading new queue
							queueEmpty: '',						// Was starting, but queue is empty!
							fileAdded: '',						// File added to queue
							fileRemoved: '',					// File removed from the queue
							fileCancelled: '',					// File was cancelled during upload
							queueCancelled: '',					// Complete queue cancelled
							queueCompleted: '',					// Queue completed
							fileStarted: '',						// Start with a new file
							fileProgress: '',					// Processing file
							fileCompleted: '',					// File complete
							fileErrorSize: '',					// File error (Size)
							fileErrorIO: '',					// File error (IO)
							fileErrorSecurity: '',				// File error (Security)
							fileErrorHTTP: ''					// File error (HTTP)
						}
				};

			if (oOptions)
				$.extend(this.oUI, oOptions);

			// Encode file filers
			this.oUI.sFileFilters = this.oUI.sFileFilters.join('||');

			//
			// Check for passed objects
			if (!this.oUI.oBrowse ||!this.oUI.sScript) {
				alert('Configuration error!!\nPlease make sure you specify jQuery objects for a "browse for file" button, and specify an upload script.');
				return;
			}

			// Save reference to settings, it's all we need for further reference from Flash back to Javascript
			$.ui.upload.locker[this.oUI.sName] = this.oUI;

			//
			// Build the HTML
			var oSbVars = new $.ui.sBuilder('&');
			oSbVars.add('movieID=' + this.oUI.sName);
			oSbVars.add('uploadScript=' +  escape(this.oUI.sScript));
			oSbVars.add('fileFilters=' + escape(this.oUI.sFileFilters));
			oSbVars.add('maximumFilesize=' + this.oUI.dMaxSize);
			sVars = oSbVars.toString();

			// Flash HTML
			var oSbFlash = new $.ui.sBuilder();
			if ($.browser.msie) {
				oSbFlash.add('<object id="' + this.oUI.sName + '" type="application/x-shockwave-flash" width="1" height="1">');
				oSbFlash.add('<param name="movie" value="' + this.oUI.sMovie + '" />');
				oSbFlash.add('<param name="wmode" value="transparent" />');
				oSbFlash.add('<param name="menu" value="false" />');
				oSbFlash.add('<param name="FlashVars" value="' + sVars + '" />');
				oSbFlash.add('</object>');
			} else {
				oSbFlash.add('<embed');
				oSbFlash.add(' type="application/x-shockwave-flash"');
				oSbFlash.add(' id="' + this.oUI.sName + '"');
				oSbFlash.add(' width="1"');
				oSbFlash.add(' height="1"');
				oSbFlash.add(' src="' + this.oUI.sMovie + '"');
				oSbFlash.add(' wmode="transparent"');
				oSbFlash.add(' menu="false"');
				oSbFlash.add(' FlashVars="' + sVars + '" />');
			}

			//
			// Build the DOM nodes to hold the flash;
			var oContainer = document.createElement("div");
			oContainer.style.position = "absolute";
			oContainer.style.left = "0px";
			oContainer.style.top = "0px";
			oContainer.style.width = "0px";
			oContainer.style.height = "0px";
			$('body').append(oContainer);
			oContainer.innerHTML = oSbFlash.toString();

			// Assign click handlers
			var _this = this;
			this.oUI.oBrowse.click(function() {
					$('#' + _this.oUI.sName)[0].browse();
					return false;
				});

			if (this.oUI.oUpload) {
				this.oUI.oUpload.click(function() {
						$('#' + _this.oUI.sName)[0].upload();
						return false;
					});
			}

			if (this.oUI.oReset) {
				this.oUI.oReset.click(function() {
						// First, reset the queue
						$('#' + _this.oUI.sName)[0].cancelQueue();
						
						//
						// In case the form was reset
						if (this.type == 'reset') {
							this.form.reset();
						}
						return false;
					});
			}

			//
			// Return created object
			return this;
		}
	};

	/**
	 * Public function
	 */
	$.fn.upload = function(oUI) {
		return new $.ui.upload.build(oUI);
	};
})($);
