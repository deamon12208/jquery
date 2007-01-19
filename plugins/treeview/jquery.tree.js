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
 *
 * @param Map options
 * @option speed String|Number Speed of animation, see animate() for details. Default: null, no animation
 * @option closedClass Mark li elements with this class to collapse them at first. Default: "closed"
 */
(function($) {

	$.fn.swapClass = function(c1,c2) {
		return this.each(function() {
			var $this = $(this);
			if ( $.className.has(this, c1) ) {
				$this.removeClass(c1).addClass(c2);
			} else if ( $.className.has(this, c2) ) {
				$this.removeClass(c2).addClass(c1);
			}					
		});
	};

	// define plugin method, currently no options
	$.fn.Tree = function(settings) {
		// create functions for toggle, the only difference is the direction to slide
		function toggle(direction) {
			$(this).parent()
				.swapClass("collapsable", "expandable")
				.swapClass("lastCollapsable", "lastExpandable")
				.find(">ul")
				.toggle(settings.speed);
		}
	
		settings = $.extend({
			speed: null,
			closed: "closed",
			expandable: "expandable",
			collapsable: "collapsable",
			lastCollapsable: "lastCollapsable",
			lastExpandable: "lastExpandable",
			last: "last",
			hitarea: "hitarea"
		}, settings);
		$("li:last-child", this).addClass("last");
		$("li." + settings.closed + ">ul").hide();
		this.find("li[ul]")
			.filter("." + settings.closed)
				.addClass(settings.expandable)
				.swapClass(settings.last, settings.lastExpandable)
				.end()
			.not("." + settings.closed)
				.addClass(settings.collapsable)
				.swapClass(settings.last, settings.lastCollapsable)
				.end()
			.append("<div class=\"" + settings.hitarea + "\">")
			.find("div." + settings.hitarea)
			.toggle( toggle, toggle );
		return this;
	}
})(jQuery);