/* 
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 * 
 * $LastChangedDate$
 * $Rev$
 */

/**
 * Returns the css height value for the first matched element.
 * If used on document, returns the document's height (innerHeight)
 * If used on window, returns the viewport's (window) height
 *
 * @example $("#testdiv").height()
 * @result 200
 *
 * @example $(document).height()
 * @result 800
 *
 * @example $(window).height()
 * @result 400
 * 
 * @name height
 * @type Object
 * @cat Plugins/Dimensions
 */
jQuery.fn.height = function() {
	if ( this.get(0) == window )
		return self.innerHeight ||
			jQuery.boxModel && document.documentElement.clientHeight ||
			document.body.clientHeight;
	
	if ( this.get(0) == document ) 
		return Math.max( document.body.scrollHeight, document.body.offsetHeight );
	
	return arguments[0] != undefined ? this.css("height", arguments[0]) : parseInt( this.css("height") );
};

/**
 * Returns the css width value for the first matched element.
 * If used on document, returns the document's width (innerWidth)
 * If used on window, returns the viewport's (window) width
 *
 * @example $("#testdiv").width()
 * @result 200
 *
 * @example $(document).width()
 * @result 800
 *
 * @example $(window).width()
 * @result 400
 * 
 * @name width
 * @type Object
 * @cat Plugins/Dimensions
 */
jQuery.fn.width = function() {
	if ( this.get(0) == window )
		return self.innerWidth ||
			jQuery.boxModel && document.documentElement.clientWidth ||
			document.body.clientWidth;
	
	if ( this.get(0) == document )
		return Math.max( document.body.scrollWidth, document.body.offsetWidth );
	
	return arguments[0] != undefined ? this.css("width", arguments[0]) : parseInt( this.css("width") );
};

/**
 * Returns the inner height value (without border) for the first matched element.
 * If used on document, returns the document's height (innerHeight)
 * If used on window, returns the viewport's (window) height
 *
 * @example $("#testdiv").innerHeight()
 * @result 800
 * 
 * @name innerHeight
 * @type Number
 * @cat Plugins/Dimensions
 */
jQuery.fn.innerHeight = function() {
	return this.get(0) == window || this.get(0) == document ?
		this.height() :
		this.get(0).offsetHeight - parseInt(this.css("borderTopWidth") || 0) - parseInt(this.css("borderBottomWidth") || 0);
};

/**
 * Returns the inner width value (without border) for the first matched element.
 * If used on document, returns the document's Width (innerWidth)
 * If used on window, returns the viewport's (window) width
 *
 * @example $("#testdiv").innerWidth()
 * @result 1000
 * 
 * @name innerWidth
 * @type Number
 * @cat Plugins/Dimensions
 */
jQuery.fn.innerWidth = function() {
	return this.get(0) == window || this.get(0) == document ?
		this.width() :
		this.get(0).offsetWidth - parseInt(this.css("borderLeftWidth") || 0) - parseInt(this.css("borderRightWidth") || 0);
};

/**
 * Returns the outer height value (including border) for the first matched element.
 * Cannot be used on document or window.
 *
 * @example $("#testdiv").outerHeight()
 * @result 1000
 * 
 * @name outerHeight
 * @type Number
 * @cat Plugins/Dimensions
 */
jQuery.fn.outerHeight = function() {
	return this.get(0) == window || this.get(0) == document ?
		this.height() :
		this.get(0).offsetHeight;	
};

/**
 * Returns the outer width value (including border) for the first matched element.
 * Cannot be used on document or window.
 *
 * @example $("#testdiv").outerWidth()
 * @result 1000
 * 
 * @name outerWidth
 * @type Number
 * @cat Plugins/Dimensions
 */
jQuery.fn.outerWidth = function() {
	return this.get(0) == window || this.get(0) == document ?
		this.width() :
		this.get(0).offsetWidth;
};

/**
 * Returns how many pixels the user has scrolled to the right (scrollLeft).
 * Works on containers with overflow: auto and window/document.
 *
 * @example $("#testdiv").scrollLeft()
 * @result 100
 * 
 * @name scrollLeft
 * @type Number
 * @cat Plugins/Dimensions
 */
jQuery.fn.scrollLeft = function() {
	if ( this.get(0) == window || this.get(0) == document )
		return self.pageXOffset ||
			jQuery.boxModel && document.documentElement.scrollLeft ||
			document.body.scrollLeft;
	
	return this.get(0).scrollLeft;
};

/**
 * Returns how many pixels the user has scrolled to the bottom (scrollTop).
 * Works on containers with overflow: auto and window/document.
 *
 * @example $("#testdiv").scrollTop()
 * @result 100
 * 
 * @name scrollTop
 * @type Number
 * @cat Plugins/Dimensions
 */
jQuery.fn.scrollTop = function() {
	if ( this.get(0) == window || this.get(0) == document )
		return self.pageYOffset ||
			jQuery.boxModel && document.documentElement.scrollTop ||
			document.body.scrollTop;

	return this.get(0).scrollTop;
};

/**
 * Returns the location of the element (including it's border) in pixels from the top left corner of the viewport.
 * The cumulative scroll offset is calculated by default and can be referenced by two properties in the returned 
 * object, .scrollTop and .scrollLeft. These two properties are the cumulative offset. When scroll offset calculation
 * is turned off, then the returned object does not contain the .scrollTop and .scrollLeft properties.
 * 
 * For accurate readings make sure to use pixel values for margins, borders and padding.
 * 
 * @example $("#testdiv").offset()
 * @result { top: 100, left: 100, scrollTop: 10, scrollLeft: 10 }
 *
 * @example $("#testdiv").offset(false)
 * @result { top: 100, left: 100 }
 *
 * @name offset	
 * @param Boolean includeScrollOffsets True by default but set to false to exclude the calculation of scroll offsets. This should boost performance if not needed and turned off.
 * @type Object
 * @cat Plugins/Dimensions
 * @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 */
jQuery.fn.offset = function(includeScrollOffsets) {
	var x = 0, y = 0, elem = this[0], parent = this[0], sl = 0, st = 0, s = (includeScrollOffsets !== false);
	do {
		x += parent.offsetLeft || 0;
		y += parent.offsetTop  || 0;

		// Mozilla and IE do not add the border
		if (jQuery.browser.mozilla || jQuery.browser.msie) {
			// get borders
			var bt = parseInt(jQuery.css(parent, 'borderTopWidth')) || 0;
			var bl = parseInt(jQuery.css(parent, 'borderLeftWidth')) || 0;
			
			// add borders to offset
			x += bl;
			y += bt;
			
			// Mozilla removes the border if the parent has overflow hidden
			if (jQuery.browser.mozilla && jQuery.css(parent, 'overflow') == 'hidden') {
				x += bl;
				y += bt;
			}
		}
		
		var op = parent.offsetParent;
		if (op && (op.tagName == 'BODY' || op.tagName == 'HTML')) {
			// Safari and IE don't add the body margin for elments positioned with static or relative
			if ((jQuery.browser.safari || jQuery.browser.msie) && jQuery.css(parent, 'position') != 'absolute') {
				x += parseInt(jQuery.css(op, 'marginLeft')) || 0;
				y += parseInt(jQuery.css(op, 'marginTop'))  || 0;
			}
			break;
		}

		if (s) {
			// Need to get scroll offsets in-between offsetParents
			var op = parent.offsetParent;
			do {
				sl += parent.scrollLeft || 0;
				st += parent.scrollTop  || 0;
				parent = parent.parentNode;
			} while (parent != op);
		} else {
			parent = parent.offsetParent;
		}
	} while (parent);

	// Safari and Opera do not add the border for the element
	if (jQuery.browser.safari || jQuery.browser.opera) {
		x += parseInt(jQuery.css(elem, 'borderLeftWidth')) || 0;
		y += parseInt(jQuery.css(elem, 'borderTopWidth'))  || 0;
	}

	return s ? { top: y - st, left: x - sl, scrollTop:  st, scrollLeft: sl }
			 : { top: y, left: x };
};