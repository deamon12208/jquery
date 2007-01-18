/*
 * Tree - jQuery plugin expandable tree view
 *
 * Copyright (c) 2006 Jörn Zaefferer, Myles Angell
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Revision: $Id$
 *
 */

/**
 * Select an unordered list (without list-style) and apply.
 *
 * Adds invisible that can be clicked and classes to apply background-images.
 *
 * @example $("ul.makeMeATree").Tree();
 * @before <ul class="makeMeATree">
 * 	<li>Item 1
 *  	<ul>
 * 			<li>Item 1.1</li>
 *    	</ul>
 *  </li>
 *  <li>Item 2
 * 		<ul>
 * 			<li>Item 2.1
 * 				<ul>
 * 					<li>Item 2.1.1</li>
 * 					<li>Item 2.1.2</li>
 * 				</ul>
 * 			</li>
 * 			<li>Item 2.2</li>
 * 	 	</ul>
 *	</li>
 *	<li>Item 3</li>
 * </ul>
 */
(function($) {

	$.fn.swapClass = function(c1,c2) {
		return this.each(function() {
			var $this = $(this);
			if ( $this.is("." + c1) ) {
				$(this).removeClass(c1);
				$(this).addClass(c2);
			} else if ( $this.is("."  + c1) ) {
				$(this).removeClass(c2);
				$(this).addClass(c1);
			}					
		});
	};
	
	// create functions for toggle, the only difference is the direction to slide
	function toggle(direction) {
		return function() {
			$(this).parent()
				.swapClass("tvic", "tvie")
				.swapClass("tvilc", "tvile")
				.find(">ul")["slide" + direction]();
		};
	}
	
	// define plugin method, currently no options
	$.fn.Tree = function() {
		this
			.find("li:last-child")
			.addClass("tvil")
		this.find("li[ul]")
			.addClass("tvic")
			.swapClass("tvil", "tvilc")
			.append("<div class=\"tvca\">")
			.find("div.tvca")
			.toggle( toggle("Up"), toggle("Down") );
		return this;
	}
})(jQuery);