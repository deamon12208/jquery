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

/*
TODO
- mixing multiple with autofill doesn't work yet, only for the first term
- modify callbacks to pass additional data as arguments, instead of binding it to dom elements
*/

/**
 * Provide autocomplete for one text-input or textarea (the first from the matched elements).
 *
 * @example $("#input_box").autocomplete("my_autocomplete_backend.php");
 * @before <input id="input_box" />
 * @desc Autocomplte a text-input with remote data. For small to giant datasets.
 *
 * When the user starts typing, a request is send to the specified backend ("my_autocomplete_backend.php"),
 * with a GET parameter named q that contains the current value of the input box.
 *
 * A value of "foo" would result in this request url: my_autocomplete_backend.php?q=foo
 *
 * The result must return with one value on each line. The result is presented in the order
 * the backend sends it.
 *
 * @example $("#input_box").autocomplete(["Cologne", "Berlin", "Munich"]);
 * @before <input id="input_box" />
 * @desc Autcomplete a text-input with local data. For small datasets.
 *
 * @example $.getJSON("my_backend.php", function(data) {
 *   $("#input_box").autocomplete(data);
 * });
 * @before <input id="input_box" />
 * @desc Autcomplete a text-input with data received via AJAX. For small to medium sized datasets.
 *
 * @example $("#mytextarea").autocomplete(["Cologne", "Berlin", "Munich"], {
 *  multiple: true
 * });
 * @before <textarea id="mytextarea" />
 * @desc Autcomplete a textarea with local data (for small datasets). Once the user chooses one
 * value, a separator is appended (by default a comma, see multipleSeparator option) and more values
 * are autocompleted.
 *
 * @name autocomplete
 * @type jQuery.Autocompleter
 * @param String|Array urlOrData Pass either an URL for remote-autocompletion or an array of data for local auto-completion
 * @param Map options Optional settings
 * @option String inputClass This class will be added to the input box. Default: "ac_input"
 * @option String resultsClass The class for the UL that will contain the result items (result items are LI elements). Default: "ac_results"
 * @option String loadingClass The class for the input box while results are being fetched from the server. Default: "ac_loading"
 * @option String lineSeparator The character that separates lines in the results from the backend. Default: "\n"
 * @option String cellSeparator The character that separates cells in the results from the backend. Default: "|"
 * @option Number minChars The minimum number of characters a user has to type before the autocompleter activates. Default: 1
 * @option Number delay The delay in milliseconds the autocompleter waits after a keystroke to activate itself. Default: 400 for remote, 10 for local
 * @option Number cacheLength The number of backend query results to store in cache. If set to 1 (the current result), no caching will happen. Do not set below 1. Default: 10
 * @option Boolean matchSubset Whether or not the autocompleter can use a cache for more specific queries. This means that all matches of "foot" are a subset of all matches for "foo". Usually this is true, and using this options decreases server load and increases performance. Only useful with cacheLength settings bigger then one, like 10. Default: true
 * @option Boolean matchCase Whether or not the comparison is case sensitive. Only important only if you use caching. Default: false
 * @option Boolean matchContains Whether or not the comparison looks inside (i.e. does "ba" match "foo bar") the search results. Only important if you use caching. Default: false
 * @option Booolean mustMatch If set to true, the autocompleter will only allow results that are presented by the backend. Note that illegal values result in an empty input box. In the example at the beginning of this documentation, typing "footer" would result in an empty input box. Default: false
 * @option Object extraParams Extra parameters for the backend. If you were to specify { bar:4 }, the autocompleter would call my_autocomplete_backend.php?q=foo&bar=4 (assuming the input box contains "foo"). Default: {}
 * @option Boolean selectFirst If this is set to true, the first autocomplete value will be automatically selected on tab/return, even if it has not been handpicked by keyboard or mouse action. If there is a handpicked (highlighted) result, that result will take precedence. Default: true
 * @option Function formatItem Provides advanced markup for an item. For each row of results, this function will be called. The returned value will be displayed inside an LI element in the results list. Autocompleter will provide 3 parameters: the results row, the position of the row in the list of results, and the number of items in the list of results. Default: none
 * @option Function onSelectItem Called when an item is selected. The autocompleter will specify a single argument, being the LI element selected. This LI element will have an attribute "extra" that contains an array of all cells that the backend specified. Default: none
 * @option Boolean multiple Whether to allow more then one autocomplted-value to enter. Default: false
 * @option String multipleSeparator Seperator to put between values when using multiple option. Default: ", "
 * @option Number width Specify a custom width for the select box. Default: width of the input element
 * @option Boolean autoFill Fill the textinput while still selecting a value, replacing the value if more is type or something else is selected. Default: false
 * @option Number maxItemsToShow Limit the number of items to show. Default: 10
 */
jQuery.fn.autocomplete = function(urlOrData, options) {
	var isUrl = typeof urlOrData == "string";
	options = jQuery.extend({}, jQuery.Autocompleter.defaults, {
		url: isUrl ? urlOrData : null,
		data: isUrl ? null : urlOrData,
		delay: isUrl ? jQuery.Autocompleter.defaults.delay : 10
	}, options);
	return new jQuery.Autocompleter(this[0], options);
}

/**
 * Call to find the current selected value. The callback is the same as for the onSelectItem callback.
 *
 * @name jQuery.Autocompleter.findValue
 * @param Function callback Executed when the current value (possibly request via ajax) is found
 * @type undefined
 */
jQuery.Autocompleter = function(input, options) {

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

	input.lastSelected = $input.val();
	
	var timeout = null;
	var prev = "";
	var active = -1;
	var cache = new jQuery.Autocompleter.Cache(options);
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
				clearTimeout(timeout);
				timeout = setTimeout(onChange, options.delay);
				break;
		}
	}).focus(function(){
		// track whether the field has focus, we shouldn't process any
		// results if the field no longer has focus
		hasFocus = true;
	}).blur(function() {
		hasFocus = false;
		hideResults();
	});

	hideResultsNow();
	
	this.findValue = function(callback) {
		function findValueCallback(q, data) {
			if( data && data.length )
				for (var i=0; i < data.length; i++)
					if( data[i][0].toLowerCase() == q.toLowerCase() )
						// todo: pass additional data directly to callback
						callback(createListItem(data[i], i, data.length)[0]);
			else
				callback();
		}
		request($input.val(), findValueCallback, findValueCallback);
	}

	function onChange() {
		if( ignoreKeypress() ) {
			$results.hide()
			return;
		}
		
		var v = $input.val();
		if ( !hasInputChanged(v) )
			return;
		
		rememberInput(v);
		
		v = lastWord(v);
		if ( v.length >= options.minChars) {
			$input.addClass(options.loadingClass);
			if (!options.matchCase)
				v = v.toLowerCase();
			request(v, receiveData, stopLoading);
		} else {
			stopLoading();
			$results.hide();
		}
	};
	
	function lastWord(value) {
		return options.multiple
			? value.substring( value.lastIndexOf(options.multipleSeparator) + (value.lastIndexOf(options.multipleSeparator) != -1 ? options.multipleSeparator.length : 0) )
			: value;
	}
	
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
		var listItems = $results.find("li");
		active += step;
		wrapSelection(listItems);
		listItems.indexClass(active, "ac_over");
	};
	
	function wrapSelection(listItems) {
		if (active < 0) {
			active = listItems.size() - 1;
		} else if (active >= listItems.size()) {
			active = 0;
		}
	}
	
	function selectCurrent() {
		var listItems = $results.find("li");
		var selected = listItems.filter(".ac_over")[0];
		if ( !selected && options.selectFirst ) {
			selected = listItems[0];
		}
		if (selected) {
			selectItem(selected);
			return true;
		} else
			return false;
	};

	function selectItem(li) {
		var v = jQuery.trim(li.selectValue ? li.selectValue : li.innerHTML);
		input.lastSelected = v;
		prev = v;
		$results.html("");
		
		if ( options.multiple ) {
			var old_value = $input.val();
			if(old_value.lastIndexOf(options.multipleSeparator) >= 1) {
				var sep_pos = old_value.lastIndexOf( options.multipleSeparator ) + options.multipleSeparator.length;
				v = old_value.substr(0, sep_pos) + v + options.multipleSeparator;
			} else {
				v += options.multipleSeparator;
			}
		}
		
		$input.val(v);
		hideResultsNow();
		// todo: pass additional data directly to callback
		options.onSelectItem && options.onSelectItem(li);
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
	function autoFill(q, sValue){
		// autofill in the complete box w/the first match as long as the user hasn't entered in more data
		// if the last user key pressed was backspace, don't autofill
		if( options.autoFill && ($input.val().toLowerCase() == q.toLowerCase()) && lastKeyPressCode != 8 ){
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
			width: iWidth,
			top: pos.y + input.offsetHeight,
			left: pos.x
		}).show();
	};

	function hideResults() {
		clearTimeout(timeout);
		timeout = setTimeout(hideResultsNow, 200);
	};

	function hideResultsNow() {
		clearTimeout(timeout);
		stopLoading();
		$results.hide();
		if (options.mustMatch) {
			if ($input.val() != input.lastSelected) {
				selectItem(null);
			}
		}
	};

	function receiveData(q, data) {
		if ( data && data.length && hasFocus ) {
			stopLoading();
			$results.empty().append(dataToDom(data)).bgiframe();
			autoFill(q, data[0][0]);
			showResults();
		} else {
			hideResultsNow();
		}
	};

	function parseAndCacheData(q, data) {
		var parsed = [];
		var rows = data.split(options.lineSeparator);
		for (var i=0; i < rows.length; i++) {
			var row = jQuery.trim(rows[i]);
			if (row) {
				parsed[parsed.length] = row.split(options.cellSeparator);
			}
		}
		cache.add(q, parsed);
		return parsed;
	};

	function dataToDom(data) {
		var ul = document.createElement("ul");
		var num = limitNumberOfItems(data.length);
		for (var i=0; i < num; i++) {
			if (!data[i])
				continue;
			createListItem(data[i], i, num).appendTo(ul).hover( function() {
				active = jQuery("li", ul).removeClass("ac_over").index(this);
				jQuery(this).addClass("ac_over");
			}, function() {
				jQuery(this).removeClass("ac_over");
			}).click(function() {
				selectItem(this);
				$input.focus();
				return false;
			});
		}
		return ul;
	};
	
	function limitNumberOfItems(available) {
		return (options.maxItemsToShow > 0) && (options.maxItemsToShow < available)
			? options.maxItemsToShow
			: available;
	}
	
	function createListItem(row, i, num) {
		var item = document.createElement("li");
		item.innerHTML = options.formatItem 
				? options.formatItem(row, i, num)
				: row[0];
			item.selectValue = row[0];
		var extra = null;
		if (row.length > 1) {
			extra = [];
			for (var j=1; j < row.length; j++) {
				extra[extra.length] = row[j];
			}
		}
		item.extra = extra;
		return jQuery(item);
	}
	
	function request(q, success, failure) {
		if (!options.matchCase)
			q = q.toLowerCase();
		var data = cache.load(q);
		// recieve the cached data
		if (data && data.length) {
			success(q, data);
		// if an AJAX url has been supplied, try loading the data now
		} else if( (typeof options.url == "string") && (options.url.length > 0) ){
			jQuery.get(makeUrl(q), function(data) {
				//receiveData(q, parseAndCacheData(q, data));
				success(q, parseAndCacheData(q, data));
			});
		} else {
			failure(q);
		}
	}

	function makeUrl(q) {
		if ( options.multiple ) {
			if ( q.lastIndexOf(options.multipleSeparator) >= 1 ) {
				q = q.substr( q.lastIndexOf(options.multipleSeparator) + 1);
			} 
		}
		var url = options.url + "?q=" + q;
		for (var i in options.extraParams) {
			url += "&" + i + "=" + options.extraParams[i];
		}
		return url;
	};

	function stopLoading() {
		$input.removeClass(options.loadingClass);
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

jQuery.Autocompleter.defaults = {
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
	selectFirst: true,
	maxItemsToShow: 10,
	autoFill: false,
	width: 0,
	multiple: false,
	multipleSeparator: ","
};

/**
 * Add a class to the selected index, and remove it from the other matched elements.
 *
 * @private
 * @name indexClass
 * @param Number index The index of the element to match
 * @param String className The className to add and remove
 */
jQuery.fn.indexClass = function(index, className) {
	return this.removeClass(className).eq(index).addClass(className).end();
};

jQuery.Autocompleter.Cache = function(options) {

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
		if (this.length > options.cacheLength) {
			this.flush();
		}
		if (!this.data[q]) {
			this.length++;
		}
		this.data[q] = data;
	};
	this.load = function(q) {
		if (!q || !options.cacheLength || !this.length)
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
