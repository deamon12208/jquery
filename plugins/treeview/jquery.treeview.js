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
 * @example $("ul.makeMeATree").Treeview();
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
 * @option closed String Mark li elements with this class to collapse them at first. Default: "closed"
 * @type TreeController
 * @name Treeview
 * @cat Plugins/Treeview
 */
 
/**
 * Takes a TreeController and applies it to a group of three links.
 *
 * TODO: Example
 *
 * @name TreeControl
 * @type jQuery
 * @cat Plugins/Treeview
 */ 
 
/**
 * Hides all branches of the tree.
 *
 * @name TreeController.collapseAll
 * @type TreeController
 * @cat Plugins/Treeview
 */
 
/**
 * Shows all branches of the tree.
 *
 * @name TreeController.expandAll
 * @type TreeController
 * @cat Plugins/Treeview
 */
 
/**
 * Toggles all branches of the tree, showing collapsed and hiding expanded.
 *
 * @name TreeController.toggleAll
 * @type TreeController
 * @cat Plugins/Treeview
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
	
	$.fn.TreeControl = function(controller) {
		function build(method) {
			return function() {
				controller[method]();
				return false;
			}
		}
		$(":eq(0)", this).click( build("collapseAll") );
		$(":eq(1)", this).click( build("expandAll") );
		$(":eq(2)", this).click( build("toggleAll") ); 
		return this;
	}
	
	// define plugin method, currently no options
	$.fn.Treeview = function(settings) {
	
		function TreeController(tree) {
			function build(filter) {
				return function() {
					toggler( $("div." + settings.hitarea, tree).filter(function() {
						return filter ? $(this).parent("." + filter).length : true;
					}) );
					return this;
				}
			}
			this.collapseAll = build(settings.collapsable);
			this.expandAll = build(settings.expandable);
			this.toggleAll = build();
		}
	
		// handle toggle event
		function toggler(start) {
			$(start.type ? this : start).parent()
				.swapClass(settings.collapsable, settings.expandable)
				.swapClass(settings.lastCollapsable, settings.lastExpandable)
				.find(">ul")
				.toggle(settings.speed);
		}
	
		// allow everyone to define their own classes, and animations
		settings = $.extend({
			speed: null,
			control: null,
			closed: "closed",
			expandable: "expandable",
			collapsable: "collapsable",
			lastCollapsable: "lastCollapsable",
			lastExpandable: "lastExpandable",
			last: "last",
			hitarea: "hitarea"
		}, settings);
		
		this.addClass("treeview");
		
		// mark last tree items
		$("li:last-child", this).addClass("last");
		
		// hide items marked as closed
		$("li." + settings.closed + ">ul", this).hide();
		
		// find all tree items with child lists
		$("li[ul]", this)
			// handle closed ones first
			.filter("." + settings.closed)
				.addClass(settings.expandable)
				.swapClass(settings.last, settings.lastExpandable)
				.end()
			// handle open ones
			.not("." + settings.closed)
				.addClass(settings.collapsable)
				.swapClass(settings.last, settings.lastCollapsable)
				.end()
			// append hitarea
			.append("<div class=\"" + settings.hitarea + "\">")
			// find hitarea
			.find("div." + settings.hitarea)
			// apply toggle event to hitarea
			.toggle( toggler, toggler );
		
		var control = new TreeController(this);
		if(settings.control)
			$(settings.control).TreeControl(control)
		
		return control;
	}
})(jQuery);