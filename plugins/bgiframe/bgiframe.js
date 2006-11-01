/* Copyright (c) 2006 Brandon Aaron (http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 */

/**
 * The bgiframe applies the iframe hack to get around zIndex
 * issues in IE6. It will only apply itself in IE and adds
 * a class to the iframe called 'bgiframe'.
 * 
 * It does take borders into consideration but all values
 * need to be in pixels and the element needs to have
 * position relative or absolute.
 *
 * @example $('div').bgiframe();
 * @before <div><p>Paragraph</p></div>
 * @result <div><iframe class="bgiframe".../><p>Paragraph</p></div>
 *
 * @name bgiframe
 * @type jQuery
 * @cat DOM
 * @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 */
jQuery.fn.bgiframe = function() {
	// This is only for IE6
	if ( !(jQuery.browser.msie && typeof XMLHttpRequest == 'function') ) return this;
	
	return this.each(function() {
		var html = '<iframe class="bgiframe" tabindex="-1" '
		 					+'style="display:block; position:absolute; '
							+'top: expression(((parseInt(this.parentNode.currentStyle.borderTopWidth)  || 0) * -1) + \'px\'); '
							+'left:expression(((parseInt(this.parentNode.currentStyle.borderLeftWidth) || 0) * -1) + \'px\'); '
							+'z-index:-1; filter:Alpha(Opacity=\'0\'); '
							+'width:expression(this.parentNode.offsetWidth + \'px\'); '
							+'height:expression(this.parentNode.offsetHeight + \'px\')"/>';
		this.insertBefore( document.createElement(html), this.firstChild );
	});
};