/*
 * Treeview - jQuery plugin to hide and show branches of a tree
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
 * Takes an unordered list and makes all branches collapsable.
 *
 * Mark initially closed branches with "closed", open with "open".
 *
 * The following styles are necessary in your stylesheet. Modify them to fit your needs.
 *
 * .treeview, .treeview ul { 
 * 	padding: 0;
 * 	margin: 0;
 * 	list-style: none;
 * }	
 * 
 * .treeview li { 
 * 	position: relative;
 * 	margin: 0;
 * 	padding: 4px 0 3px 20px;
 * 	z-index: 10;
 * }
 * 
 * .treeview li { background: url(images/tv-item.gif) 0 0 no-repeat; }
 *
 * .treeview .collapsable { background-image: url(images/tv-collapsable.gif); }
 *
 * .treeview .expandable { background-image: url(images/tv-expandable.gif); }
 *
 * .treeview .last { background-image: url(images/tv-item-last.gif); }
 *
 * .treeview .lastCollapsable { background-image: url(images/tv-collapsable-last.gif); }
 *
 * .treeview .lastExpandable { background-image: url(images/tv-expandable-last.gif); }
 *
 * @example $("ul").Treeview();
 * @before <ul>
 * 	<li>Item 1
 *  	<ul>
 * 			<li>Item 1.1</li>
 *    	</ul>
 *  </li>
 *  <li class="closed">Item 2 (starts as closed)
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
 * @option String|Number speed Speed of animation, see animate() for details. Default: null, no animation
 * @option String closed Mark li elements with this class to collapse them at first. Default: "closed"
 * @option Boolean collapsed Start with all branches collapsed. Default: false, all expanded
 * @type TreeController
 * @name Treeview
 * @cat Plugins/Treeview
 */

(function($) {

	// classes used by the plugin, need to be styled via external stylesheet
	var CLASSES = {
		open: "open",
		closed: "closed",
		expandable: "expandable",
		collapsable: "collapsable",
		lastCollapsable: "lastCollapsable",
		lastExpandable: "lastExpandable",
		last: "last",
		hitarea: "hitarea"
	}
	
	// styles for hitareas
	var hitareaCSS = {
		height: 15,
		width: 15,
		position: "absolute",
		top: 1,
		left: -1,
		cursor: "pointer",
		zIndex: 50
	}
	// ie specific stlyes for hitareas
	if( $.browser.msie )
		$.extend( hitareaCSS, {
			background: "#fff",
			filter: "alpha(opacity=0)",
			left: -21
		});

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
	$.fn.Treeview = function(settings) {
	
		function treeController(tree, control) {
			function build(filter) {
				return function() {
					toggler( $("div." + CLASSES.hitarea, tree).filter(function() {
						return filter ? $(this).parent("." + filter).length : true;
					}) );
					return false;
				}
			}
			$(":eq(0)", control).click( build(CLASSES.collapsable) );
			$(":eq(1)", control).click( build(CLASSES.expandable) );
			$(":eq(2)", control).click( build() ); 
		}
	
		// handle toggle event
		function toggler(start) {
			$(start.type ? this : start).parent()
				.swapClass(CLASSES.collapsable, CLASSES.expandable)
				.swapClass(CLASSES.lastCollapsable, CLASSES.lastExpandable)
				.find(">ul")
				.toggle(settings.speed);
		}
	
		this.addClass("treeview");
		
		// mark last tree items
		$("li:last-child", this).addClass(CLASSES.last);
		
		// collapse whole tree or only those marked as closed, except those marked as open
		$( (settings.collapsed ? "li" : "li." + CLASSES.closed) + ":not(." + CLASSES.open + ") > ul", this).hide();
		
		// find all tree items with child lists
		$("li[ul]", this)
			// handle closed ones first
			.filter("[ul:hidden], ." + CLASSES.closed).not("[ul:visible]")
				.addClass(CLASSES.expandable)
				.swapClass(CLASSES.last, CLASSES.lastExpandable)
				.end().end()
			// handle open ones
			.not("." + CLASSES.closed)
				.addClass(CLASSES.collapsable)
				.swapClass(CLASSES.last, CLASSES.lastCollapsable)
				.end()
			// append hitarea
			.append("<div class=\"" + CLASSES.hitarea + "\">")
			// find hitarea
			.find("div." + CLASSES.hitarea)
			.css(hitareaCSS)
			// apply toggle event to hitarea
			.toggle( toggler, toggler );
		
		if(settings.control)
			treeController(this, settings.control);
		
		return this;
	}
})(jQuery);