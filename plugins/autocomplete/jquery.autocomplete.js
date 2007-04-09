/*
 * Autocomplete - jQuery plugin
 *
 * Copyright (c) 2007 Dylan Verheul, Dan G. Switzer, Anjesh Tuladhar, Jörn Zaefferer
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Revision: $Id$
 *
 */

jQuery.autocomplete = function(input, options) {

	// Create jQuery object for input element
	var $input = $(input).attr("autocomplete", "off");

	// Apply inputClass if necessary
	if (options.inputClass) $input.addClass(options.inputClass);

	// Create results
	var $results = jQuery("<div>")
		.hide()
		.addClass(options.resultsClass)
		.css("position", "absolute")
		.appendTo("body");
		
	if( options.width > 0 )
		$results.css("width", options.width);

	input.autocompleter = this;
	input.lastSelected = $input.val();
	
	var timeout = null;
	var prev = "";
	var active = -1;
	var cache = new jQuery.autocomplete.Cache(options);
	var keyb = false;
	var hasFocus = false;
	var lastKeyPressCode = null;
	
	// if there is a data array supplied
	if( options.data ){
		var sFirstChar = "", stMatchSets = {};

		// no url was specified, we need to adjust the cache length to make sure it fits the local data store
		if( !options.url ) options.cacheLength = 1;

		// loop through the array and create a lookup structure
		jQuery.each(options.data, function(i, value) {
			// if row is a string, make an array otherwise just reference the array
			var row = (typeof value == "string") ? [value] : value;

			// if the length is zero, don't add to list
			if( row[0].length > 0 ){
				// get the first character
				sFirstChar = row[0].charAt(0).toLowerCase();
				// if no lookup array for this character exists, look it up now
				if( !stMatchSets[sFirstChar] )
					stMatchSets[sFirstChar] = [];
				// if the match is a string
				stMatchSets[sFirstChar].push(row);
			}
		});

		// add the data items to the cache
		jQuery.each(stMatchSets, function(i, value) {
			// increase the cache size
			options.cacheLength++;
			// add to the cache
			cache.add(i, value);
		});
	}

	$input
	.keydown(function(e) {
		// track last key pressed
		lastKeyPressCode = e.keyCode;
		switch(e.keyCode) {
			case 38: // up
				e.preventDefault();
				moveSelect(-1);
				break;
			case 40: // down
				e.preventDefault();
				moveSelect(1);
				break;
			case 9:  // tab
			case 13: // return
				if( selectCurrent() ){
					// make sure to blur off the current field
					if( !options.multiple )
						$input.blur();
					e.preventDefault();
				}
				break;
			default:
				active = -1;
				if (timeout) clearTimeout(timeout);
				timeout = setTimeout(function(){onChange();}, options.delay);
				break;
		}
	})
	.focus(function(){
		// track whether the field has focus, we shouldn't process any results if the field no longer has focus
		hasFocus = true;
	})
	.blur(function() {
		// track whether the field has focus
		hasFocus = false;
		hideResults();
	});

	hideResultsNow();

	function onChange() {
		if( ignoreKeypress() )
			return $results.hide();
		
		var v = $input.val();
		if ( !hasInputChanged(v) )
			return;
		
		rememberInput(v);
		
		if (v.length >= options.minChars) {
			$input.addClass(options.loadingClass);
			if (!options.matchCase)
				v = v.toLowerCase();
			requestData(v);
		} else {
			$input.removeClass(options.loadingClass);
			$results.hide();
		}
	};
	
	function ignoreKeypress(key) {
		// ignore if the following keys are pressed: [del] [shift] [capslock]
		// why shift etc.?
		// how about selecting the first entry when pressing enter?
		return lastKeyPressCode == 46; // || (lastKeyPressCode > 8 && lastKeyPressCode < 32);
	}
	
	function rememberInput(value) {
		prev = value;
	}
	
	function hasInputChanged(newValue) {
		return newValue != prev;
	}

 	function moveSelect(step) {
		var lis = $results.find("li");
		
		active += step;

		// wrap around
		if (active < 0) {
			active = lis.size() - 1;
		} else if (active >= lis.size()) {
			active = 0;
		}

		lis.indexClass(active, "ac_over");
	};
	
	function selectCurrent() {
		var li = jQuery("li.ac_over", $results)[0];
		if (!li) {
			var $li = $results.find("li");
			if (options.selectOnly) {
				if ($li.length == 1) li = $li[0];
			} else if (options.selectFirst) {
				li = $li[0];
			}
		}
		if (li) {
			selectItem(li);
			return true;
		} else {
			return false;
		}
	};

	function selectItem(li) {
		if (!li) {
			li = document.createElement("li");
			li.extra = [];
			li.selectValue = "";
		}
		var v = jQuery.trim(li.selectValue ? li.selectValue : li.innerHTML);
		input.lastSelected = v;
		prev = v;
		$results.html("");
		
		if ( options.multiple ) {
			var old_value = $input.val();
			if(old_value.lastIndexOf(options.multipleSeparator) >= 1) {
				var sep_pos = old_value.lastIndexOf(options.multipleSeparator);
				value = old_value.substr(0,sep_pos+1);
				v = value + v + options.multipleSeparator;
			} else {
				v += options.multipleSeparator;
			}
		}
		
		$input.val(v);
		hideResultsNow();
		if (options.onItemSelect) setTimeout(function() { options.onItemSelect(li) }, 1);
	};

	// selects a portion of the input string
	function createSelection(start, end){
		// get a reference to the input element
		var field = $input.get(0);
		if( field.createTextRange ){
			var selRange = field.createTextRange();
			selRange.collapse(true);
			selRange.moveStart("character", start);
			selRange.moveEnd("character", end);
			selRange.select();
		} else if( field.setSelectionRange ){
			field.setSelectionRange(start, end);
		} else {
			if( field.selectionStart ){
				field.selectionStart = start;
				field.selectionEnd = end;
			}
		}
		field.focus();
	};

	// fills in the input box w/the first match (assumed to be the best match)
	function autoFill(sValue){
		// if the last user key pressed was backspace, don't autofill
		if( lastKeyPressCode != 8 ){
			// fill in the value (keep the case the user has typed)
			$input.val($input.val() + sValue.substring(prev.length));
			// select the portion of the value not typed by the user (so the next character will erase)
			createSelection(prev.length, sValue.length);
		}
	};

	function showResults() {
		// get the position of the input field right now (in case the DOM is shifted)
		var pos = findPos(input);
		// either use the specified width, or autocalculate based on form element
		var iWidth = (options.width > 0) ? options.width : $input.width();
		// reposition
		$results.css({
			width: parseInt(iWidth) + "px",
			top: (pos.y + input.offsetHeight) + "px",
			left: pos.x + "px"
		}).show();
	};

	function hideResults() {
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(hideResultsNow, 200);
	};

	function hideResultsNow() {
		if (timeout) clearTimeout(timeout);
		$input.removeClass(options.loadingClass);
		if ($results.is(":visible")) {
			$results.hide();
		}
		if (options.mustMatch) {
			var v = $input.val();
			if (v != input.lastSelected) {
				selectItem(null);
			}
		}
	};

	function receiveData(q, data) {
		if (data) {
			$input.removeClass(options.loadingClass);
			$results.html("");

			// if the field no longer has focus or if there are no matches, do not display the drop down
			if( !hasFocus || data.length == 0 ) return hideResultsNow();

			$results.append(dataToDom(data)).bgiframe();
			// autofill in the complete box w/the first match as long as the user hasn't entered in more data
			if( options.autoFill && ($input.val().toLowerCase() == q.toLowerCase()) ) autoFill(data[0][0]);
			showResults();
		} else {
			hideResultsNow();
		}
	};

	function parseData(data) {
		if (!data) return null;
		var parsed = [];
		var rows = data.split(options.lineSeparator);
		for (var i=0; i < rows.length; i++) {
			var row = jQuery.trim(rows[i]);
			if (row) {
				parsed[parsed.length] = row.split(options.cellSeparator);
			}
		}
		return parsed;
	};

	function dataToDom(data) {
		var ul = jQuery("<ul>");
		var num = data.length;

		// limited results to a max number
		if( (options.maxItemsToShow > 0) && (options.maxItemsToShow < num) ) num = options.maxItemsToShow;

		for (var i=0; i < num; i++) {
			var row = data[i];
			if (!row) continue;
			var li = document.createElement("li");
			li.innerHTML = options.formatItem 
				? options.formatItem(row, i, num)
				: row[0];
			li.selectValue = row[0];
			var extra = null;
			if (row.length > 1) {
				extra = [];
				for (var j=1; j < row.length; j++) {
					extra[extra.length] = row[j];
				}
			}
			li.extra = extra;
			ul.append(li);
			jQuery(li).hover( function() {
				active = ul.find("li").removeClass("ac_over").index(this);
				jQuery(this).addClass("ac_over");
			}, function() {
				jQuery(this).removeClass("ac_over");
			}).click(function() {
				selectItem(this);
				return false;
			});
		}
		return ul[0];
	};

	function requestData(q) {
		var data = options.cacheLength ? cache.load(q) : null;
		// recieve the cached data
		if (data) {
			receiveData(q, data);
		// if an AJAX url has been supplied, try loading the data now
		} else if( (typeof options.url == "string") && (options.url.length > 0) ){
			jQuery.get(makeUrl(q), function(data) {
				data = parseData(data);
				cache.add(q, data);
				receiveData(q, data);
			});
		// if there's been no data found, remove the loading class
		} else {
			$input.removeClass(options.loadingClass);
		}
	};

	function makeUrl(q) {
		if ( options.multiple ) {
			if(q.lastIndexOf(options.multipleSeparator) >= 1) {
				sep_pos = q.lastIndexOf(options.multipleSeparator);
				q = q.substr(sep_pos+1);
			} 
		}
		var url = options.url + "?q=" + q;
		for (var i in options.extraParams) {
			url += "&" + i + "=" + options.extraParams[i];
		}
		return url;
	};

	this.findValue = function(){
		var q = $input.val();

		if (!options.matchCase) q = q.toLowerCase();
		var data = options.cacheLength ? cache.load(q) : null;
		if (data) {
			findValueCallback(q, data);
		} else if( (typeof options.url == "string") && (options.url.length > 0) ){
			jQuery.get(makeUrl(q), function(data) {
				data = parseData(data)
				cache.add(q, data);
				findValueCallback(q, data);
			});
		} else {
			// no matches
			findValueCallback(q, null);
		}
	}

	function findValueCallback(q, data){
		if (data) $input.removeClass(options.loadingClass);

		var num = (data) ? data.length : 0;
		var li = null;

		for (var i=0; i < num; i++) {
			var row = data[i];

			if( row[0].toLowerCase() == q.toLowerCase() ){
				li = document.createElement("li");
				if (options.formatItem) {
					li.innerHTML = options.formatItem(row, i, num);
					li.selectValue = row[0];
				} else {
					li.innerHTML = row[0];
					li.selectValue = row[0];
				}
				var extra = null;
				if( row.length > 1 ){
					extra = [];
					for (var j=1; j < row.length; j++) {
						extra[extra.length] = row[j];
					}
				}
				li.extra = extra;
			}
		}

		if( options.onFindValue ) setTimeout(function() { options.onFindValue(li) }, 1);
	}

	function findPos(obj) {
		var curleft = obj.offsetLeft || 0;
		var curtop = obj.offsetTop || 0;
		while (obj = obj.offsetParent) {
			curleft += obj.offsetLeft
			curtop += obj.offsetTop
		}
		return {x:curleft,y:curtop};
	}
}

/**
 * Add a class to the selected index, and remove it from the other matched elements.
 *
 * @name indexClass
 * @param Number index The index of the element to match
 * @param String className The className to add and remove
 */
jQuery.fn.indexClass = function(index, className) {
	return this.removeClass(className).eq(index).addClass(className).end();
};

jQuery.autocomplete.Cache = function(options) {

	this.flush = function() {
		this.data = {};
		this.length = 0;
	}
	
	this.flush();
	
	function matchSubset(s, sub) {
		if (!options.matchCase) s = s.toLowerCase();
		var i = s.indexOf(sub);
		if (i == -1) return false;
		return i == 0 || options.matchContains;
	};
	
	this.add = function(q, data) {
		if (!this.length || this.length > options.cacheLength) {
			this.flush();
			this.length++;
		} else if (!this[q]) {
			this.length++;
		}
		this.data[q] = data;
	};
	this.load = function(q) {
		if (!q)
			return null;
		if (this.data[q])
			return this.data[q];
		if (options.matchSubset) {
			for (var i = q.length - 1; i >= options.minChars; i--) {
				var qs = q.substr(0, i);
				var c = this.data[qs];
				if (c) {
					var csub = [];
					for (var j = 0; j < c.length; j++) {
						var x = c[j];
						var x0 = x[0];
						if (matchSubset(x0, q)) {
							csub[csub.length] = x;
						}
					}
					return csub;
				}
			}
		}
		return null;
	};
};

jQuery.autocomplete.defaults = {
	inputClass: "ac_input",
	resultsClass: "ac_results",
	loadingClass: "ac_loading",
	lineSeparator: "\n",
	cellSeparator: "|",
	minChars: 1,
	delay: 400,
	matchCase: false,
	matchSubset: true,
	matchContains: false,
	cacheLength: 10,
	mustMatch: false,
	extraParams: {},
	selectFirst: false,
	selectOnly: false,
	maxItemsToShow: -1,
	autoFill: false,
	width: 0,
	multiple: false,
	multipleSeparator: ", "
};

/**
 * Apply to one or more text inputs or textareas to provide 
 * autocompletion.
 *
 * @example $("#input_box").autocomplete("my_autocomplete_backend.php");
 * @before <input id="input_box" />
 * @desc When a user starts typing in the input box, the autocompleter
 * will request my_autocomplete_backend.php with a GET parameter
 * named q that contains the current value of the input box.
 * Let's assume that the user has typed "foo"(without quotes).
 * Autocomplete will then request my_autocomplete_backend.php?q=foo.
 *
 * The backend should output possible values for the autocompleter, each
 * on a single line. Output cannot contain the pipe symbol "|", since that
 * is considered a separator (more on that later).
 *
 * Note that the autocompleter will present the options in the order the backend sends them.
 *
 * @name autocomplte
 * @type jQuery
 * @param String|Array urlOrData Pass either an URL for remote-autocompletion
 *		 or an array of data for local auto-completion
 * @param Map options Optional settings
 * @option String inputClass This class will be added to the input box. Default: "ac_input"
 * @option String resultsClass The class for the UL that will contain the result items (result items are LI elements). Default: "ac_results"
 * @option String loadingClass The class for the input box while results are being fetched from the server. Default: "ac_loading"
 * @option String lineSeparator The character that separates lines in the results from the backend. Default: "\n"
 * @option String cellSeparator The character that separates cells in the results from the backend. Default: "|"
 * @option Number minChars The minimum number of characters a user has to type before the autocompleter activates. Default: 1
 * @option Number delay The delay in milliseconds the autocompleter waits after a keystroke to activate itself. Default: 400
 * @option Number cacheLength The number of backend query results to store in cache. If set to 1 (the current result), no caching will happen. Do not set below 1. Default: 10
 * @option Boolean matchSubset Whether or not the autocompleter can use a cache for more specific queries. This means that all matches of "foot" are a subset of all matches for "foo". Usually this is true, and using this options decreases server load and increases performance. Only useful with cacheLength settings bigger then one, like 10. Default: true
 * @option Boolean matchCase Whether or not the comparison is case sensitive. Only important only if you use caching. Default: false
 * @option Boolean matchContains Whether or not the comparison looks inside (i.e. does "ba" match "foo bar") the search results. Only important if you use caching. Default: false
 * @option Booolean mustMatch If set to true, the autocompleter will only allow results that are presented by the backend. Note that illegal values result in an empty input box. In the example at the beginning of this documentation, typing "footer" would result in an empty input box. Default: false
 * @option Object extraParams Extra parameters for the backend. If you were to specify { bar:4 }, the autocompleter would call my_autocomplete_backend.php?q=foo&bar=4 (assuming the input box contains "foo"). Default: {}
 * @option Boolean selectFirst If this is set to true, the first autocomplete value will be automatically selected on tab/return, even if it has not been handpicked by keyboard or mouse action. If there is a handpicked (highlighted) result, that result will take precedence. Default: false
 * @option Boolean selectOnly If this is set to true, and there is only one autocomplete when the user hits tab/return, it will be selected even if it has not been handpicked by keyboard or mouse action. This overrides selectFirst. Default: false
 * @option Function formatItem Provides advanced markup for an item. For each row of results, this function will be called. The returned value will be displayed inside an LI element in the results list. Autocompleter will provide 3 parameters: the results row, the position of the row in the list of results, and the number of items in the list of results. Default: none
 * @option Function onSelectItem Called when an item is selected. The autocompleter will specify a single argument, being the LI element selected. This LI element will have an attribute "extra" that contains an array of all cells that the backend specified. Default: none
 * @option Boolean multiple Whether to allow more then one autocomplted-value to enter. Default: false
 * @option String multipleSeparator Seperator to put between values when using multiple option. Default: ", "
 * @option Number width Width to use for both the textinput and the selectbox. Default: none
 * @option Boolean autoFill Fill the textinput while still selecting a value, replacing the value if more is type or something else is selected. Default: false
 * @option Number maxItemsToShow Limit the number of items to show. Default: no limit
 */
jQuery.fn.autocomplete = function(urlOrData, options) {

	options = jQuery.extend({}, jQuery.autocomplete.defaults, options);

	// Set url or data as option
	options[ typeof urlOrData == "string" ? 'url' : 'data' ] = urlOrData;

	this.each(function() {
		new jQuery.autocomplete(this, options);
	});

	// Don't break the chain
	return this;
}
