
// Plugin to wrap html around all non-empty text nodes within an element: (ignores text in child elements)
// By George Adamson, SoftwareUnity.com, March 2007. 
jQuery.fn.wrapText = function(html){
	return this.each(function(){
		$(this.childNodes).filter("[@nodeType=3]").each(function(){
			if($.trim(this.nodeValue).length > 0)
				$(this).wrap(html)
		})
	});
};

(function($) {

	$.fn.tree = function(o) {
		return this.each(function() {
			new $.ui.tree(this,o);	
		});
	}
	
	
	$.ui.tree = function(el,o) {
		
		var SHIFT = false;
		var CTRL = false;
		var CUT = false;
	
		var tree = el;
		$(tree).addClass('ui-tree-nodes').children('li').addClass('ui-tree-node');
		var nodes = $('ul',tree).addClass('ui-tree-nodes')
			.css('MozUserSelect', 'none').attr('unselectable', 'on');
		var node = $('li',tree).addClass('ui-tree-node')
			.css('MozUserSelect', 'none').attr('unselectable', 'on');

		$("<a href='#' class='ui-tree-node-button'>&bull;</a>")
			.prependTo(node);
		$('.ui-tree-node-button')
			.click(function() {
				toggle(parent($(this)));
				select($('.ui-tree-node-selected',tree));
				return false;
			})
			.focus(function() {
				select(parent($(this)));
				return false;
			})
	
		node
			.wrapText("<a href='#' class='ui-tree-node-text'></a>")
			.each(function() {
				var node = $(this);
				if (node.children('.ui-tree-nodes').length) {
					node.addClass('ui-tree-node-expanded');
					node.children('.ui-tree-node-button').text('-');
				}
			})
			.click(function() {
				return false;
			});
	
		$("a.ui-tree-node-text",tree)
			.click(function() {
				select(parent($(this)));
				return false;
			})
			.dblclick(function() {
				toggle(parent($(this)));
				return false;
			});
					
		select($('.ui-tree-node:first', tree));

		$(tree)
		.keydown(function(ev) {
			if (ev.keyCode == 16) { SHIFT = true; }
			if (ev.keyCode == 17) {
				CTRL = true;
				$('.ui-tree-node-selected').addClass('ui-tree-node-moving');
			}
			var TAB = (ev.keyCode == 9), HOME = (ev.keyCode == 36), END = (ev.keyCode == 35);
			var LEFT = (ev.keyCode == 37), UP = (ev.keyCode == 38), RIGHT = (ev.keyCode == 39), DOWN = (ev.keyCode == 40);
			var X = (ev.charCode == 88 || ev.charCode == 120 || ev.keyCode == 88 || ev.keyCode == 120);
			var V = (ev.charCode == 86 || ev.charCode == 118 || ev.keyCode == 86 || ev.keyCode == 118);
			var node = $('.ui-tree-node-selected',this);
			var prevNode = prev(node.filter(':first'));
			var nextNode = next(node.filter(':last'));
			var parentNode = parent(node);
			var firstNode = node.siblings('.ui-tree-node:first');
			var lastNode = node.siblings('.ui-tree-node:last');
			var isFirst = (prevNode.length == 0);
			var isLast = (nextNode.length == 0);
			var upNode = (isFirst) ? parentNode : (expanded(prevNode)) ? last(prevNode) : prevNode;
			var downNode = (isLast && !expanded(node)) ? next(parentNode) : (expanded(node)) ? first(node) : nextNode ;

			if (CTRL && X) {
				CUT = true;
				node.addClass('ui-tree-node-moving');
			}

			if (CTRL && V) {
				CUT = false;
				node.removeClass('ui-tree-node-moving');
			}

			if (TAB) {
				if ((CUT || CTRL) && TAB) {
					if (SHIFT) {
						unindent(node);
					} else {
						indent(node);
						return false;
					}
				} else if (SHIFT && TAB) {
					if (!CTRL)
						select(upNode);
				}
			}

			if ((CUT || CTRL) && HOME) {
				node.insertBefore(firstNode);
				select(node);
			} else if (HOME) {
				select(firstNode);
			}

			if ((CUT || CTRL) && END) {
				node.insertAfter(lastNode);
				select(node);
			} else if (END) {
				select(lastNode);
			}

			if ((CUT || CTRL) && LEFT) {
				unindent(node);
			} else if (LEFT) {
				collapse(node);
			}

			if ((CUT || CTRL) && UP) {
				prevNode.insertAfter(node.filter(':last'));
			} else if (SHIFT && UP) {
				shiftSelect(prevNode);
			} else if (UP) {
				select(upNode.filter(':first'));
			}

			if ((CUT || CTRL) && RIGHT) {
				indent(node);
			} else if (RIGHT) {
				expand(node);
			}

			if ((CUT || CTRL) && DOWN) {
				nextNode.insertBefore(node.filter(':first'));
			} else if (SHIFT && DOWN) {
				shiftSelect(nextNode);
			} else if (DOWN) {
				select(downNode.filter(':last'));
			}

			if (UP || DOWN || HOME || END) { // Prevent Page/container scroll
				return false;
			}
		})
		.keyup(function(ev) {
			if (ev.keyCode == 16) {
				SHIFT = false;
			}
			if (ev.keyCode == 17) {
				CTRL = false;
				if (!CUT)
					$('.ui-tree-node-moving').removeClass('ui-tree-node-moving');
			}
		});

		function collapse(node) {
			var nodes = node.children('.ui-tree-nodes');
			if (nodes.length) {
				node.removeClass('ui-tree-node-expanded').addClass('ui-tree-node-collapsed');
				node.children('.ui-tree-nodes').hide();
				node.children('.ui-tree-node-button').text('+');
			}
		}

		function expand(node) {
			var nodes = node.children('.ui-tree-nodes');
			if (nodes.length) {
				node.removeClass('ui-tree-node-collapsed').addClass('ui-tree-node-expanded');
				nodes.show();
				node.children('.ui-tree-node-button').text('-');
			}
		}

		function indent(node) {
			var prevNode = prev(node.filter(':first'));
			if (!prevNode.children('.ui-tree-nodes').length) {
				prevNode.append($(document.createElement('ul')).addClass('ui-tree-nodes'));
			} else if (!expanded(prevNode)) {
				expand(prevNode);
			}
			prevNode.children('.ui-tree-nodes').append(node);
			update(prevNode);
			select(node);
		}

		function unindent(node) {
			var parentNode = parent(node.filter(':last'));
			node.insertAfter(parentNode);
			update(parentNode);
			select(node);
		}

		function toggle(node) {
			if (expanded(node)) {
				collapse(node);
			} else {
				expand(node);
			}
		}

		function unselect(node) {
			node.removeClass('ui-tree-node-selected');
		}

		function select(node) {
			if (node.length) {
				$('.ui-tree-node-selected').removeClass('ui-tree-node-selected');
				node.addClass('ui-tree-node-selected');
				node.children('.ui-tree-node-text').focus();
			}
		}

		function shiftSelect(node) {
			node.addClass('ui-tree-node-selected');
		}

		function update(node) {
			var nodes = node.children('.ui-tree-nodes');
			if (nodes.length && nodes.children('.ui-tree-node').length) { 
				node.addClass('ui-tree-node-expanded');
				node.children('.ui-tree-node-button').text('-');
			} else {
				node.removeClass('ui-tree-node-expanded').removeClass('ui-tree-node-collapsed');
				node.children('.ui-tree-node-button').html('&bull;');
				nodes.remove();
			}
		}

		function expanded(node) { return !!node.children('.ui-tree-nodes:visible').length; }
		function first(node)	{ return node.children('.ui-tree-nodes').children('.ui-tree-node:first'); }
		function last(node)	 { return node.children('.ui-tree-nodes').children('.ui-tree-node:last'); }
		function next(node)	 { return node.next('.ui-tree-node'); }
		function parent(node)   { return node.parents('.ui-tree-node:first') }
		function prev(node)	 { return node.prev('.ui-tree-node'); }
		
	}

 })($);
