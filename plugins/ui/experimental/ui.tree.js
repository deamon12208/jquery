(function($) {

	// Plugin to wrap html around all non-empty text nodes within an element: (ignores text in child elements)
	// By George Adamson, SoftwareUnity.com, March 2007. 
	$.fn.wrapText = function(html){
		return this.each(function(){
			$(this.childNodes).filter("[@nodeType=3]").each(function(){
				if($.trim(this.nodeValue).length > 0)
					$(this).wrap(html);
			})
		});
	};
  
  
	//If the UI scope is not availalable, add it
	$.ui = $.ui || {};

	$.fn.tree = function(o) {
		return this.each(function() {
			new $.ui.tree(this,o);	
		});
	}
	
	
	$.ui.tree = function(el, o) {

		var self = this;

		self.options = {};
		$.extend(self.options, o);
		
		var SHIFT = false;
		var CTRL = false;
		var ALT = false;
		var CUT = false;
		var shiftSelPos = 0;
		var dragging = false;
		var dragNode = $([]);
		var dragNodes = $([]);
		var dragStartX = -1;
		var dragStartY = -1;
		var dragIndented = false;
		var selecting = false;
		var selectStartNode = $([]);
		var selectStartX = -1;
		var selectStartY = -1;
	
		var tree = el;
		var outline = $(document.createElement('a'));
		outline.attr('href', '#').addClass('ui-tree-outline').css({display: 'block !important', 'text-decoration': 'none' });
		$(tree).wrap(outline);
		outline = $(tree).parent('a.ui-tree-outline');
		$(tree).addClass('ui-tree').addClass('ui-tree-nodes').children('li').addClass('ui-tree-node');
		outline.css('MozUserSelect', 'none').attr('unselectable', 'on');
		var nodes = $('ul',tree).addClass('ui-tree-nodes')
			.css('MozUserSelect', 'none').attr('unselectable', 'on');
		var node = $('li',tree).addClass('ui-tree-node')
			.css('MozUserSelect', 'none').attr('unselectable', 'on');

		$("<span class='ui-tree-node-button'>&bull;&nbsp;</span>")
			.prependTo(node);
		$('.ui-tree-node-button')
			.click(function() {
				toggle(parent($(this)));
				select($('.ui-tree-node-selected',tree));
				return false;
			});
	
		node
			.wrapText("<span class='ui-tree-node-text'></span>")
			.each(function() {
				var node = $(this);
				if (node.children('.ui-tree-nodes').length) {
					node.addClass('ui-tree-node-expanded');
					node.children('.ui-tree-node-button').text('- ');
				}
			})
			.click(function() {
				return false;
			});
	
		$(".ui-tree-node-text", tree)
			.mousedown(function(ev) {
				var node = parent($(this));
				if (node.is('.ui-tree-node-selected')) {
					if (node.is('.ui-tree-node-moving')) {
						$('.ui-tree-node-moving').removeClass('ui-tree-node-moving');
					} else {
						dragNode = node;
						dragNodes = dragNode.siblings('.ui-tree-node-selected').add(node);
						dragNodes.addClass('ui-tree-node-moving');
						dragging = true;
						dragStartX = ev.pageX;
						dragStartY = ev.pageY;
					}
					return false;
				} else {
					outline.focus();
					if (!ev.ctrlKey && !ev.shiftKey)
						unselect($('.ui-tree-node-selected'));
					select(node);
					selectStartNode = node;
					selecting = true;
					return false;
				}
			})
			.mousemove(function(ev) {
				var target = parent($(this));
				if (dragging) {
					if (target.parents('.ui-tree-node-moving').length)
						return false;
					if (target.is('.ui-tree-node-moving')) {
						if (ev.pageX - dragStartX > 15) {
							if (!dragIndented) {
								indent(dragNodes);
								dragIndented = true;
							}
						} else {
							if (dragIndented) {
								unindent(dragNodes);
								dragIndented = false;
							}
						}
					} else {
						if (dragIndented) {
							unindent(dragNodes);
							dragIndented = false;
						}
						var oldParent = parent(dragNodes);
						dragNodes.insertBefore(target);
						update(oldParent);
						dragStartX = ev.pageX;
						dragStartY = ev.pageY;
					}
				} else {
					if (!ev.altKey) {
						ALT = false;
						$('.ui-tree-node-moving').removeClass('ui-tree-node-moving');
					}
					if (selecting) {
						var parentNode = parent(selectStartNode);
						var nodes = parentNode.children('.ui-tree-nodes').children('.ui-tree-node');
						var a, b;
						var on = false;
						nodes.each(function(i) {
							if ($(this)[0] == selectStartNode[0]) a = i;
							if ($(this)[0] == target[0]) b = i;
						});
						if (a && b) {
							if (b > a)
								{ var swp = a; a = b; b = swp; }
							//TODO: Shift-Select
						}
						if (parent(selectStartNode)[0] == parent(target)[0]) {
							//target.addClass('ui-tree-node-selected');
							andSelect(target);
							return false;
						}
					}
				}
			})
			.mouseup(function(ev) {
				if (dragging) {
					dragNodes = $('.ui-tree-node-moving');
					dragNodes.removeClass('ui-tree-node-moving');
					dragNode = dragNodes = $([]);
					dragging = false;
					dragStartX = dragStartY = -1;
				} else if (selecting) {
					selecting = false;
					selectStartNode = $([]);
					selectStartX = selectStartY = -1;
				} else {
					var node = parent($(this));
					if (node.is('.ui-tree-node-selected')) {
						var selected = $('.ui-tree-node-selected');
						selected.addClass('ui-tree-node-moving');
					} else {
						if (ev.ctrlKey) {
							andSelect(node);
						} else {
							select(node);
						}
					}
				}
				return false;
			})
			.dblclick(function() {
				toggle(parent($(this)));
				return false;
			});

		outline
		.keydown(function(ev) {
			if (ev.keyCode == 16) { SHIFT = true; }
			if (ev.keyCode == 17) { CTRL = true; }
			if (ev.keyCode == 18) {
				ALT = true;
				$('.ui-tree-node-selected').addClass('ui-tree-node-moving');
			}
			if (ALT && !ev.altKey) {
				ALT = false;
				if (!CUT)
					$('.ui-tree-node-moving').removeClass('ui-tree-node-moving');
			}
			var TAB = (ev.keyCode == 9), HOME = (ev.keyCode == 36), END = (ev.keyCode == 35); var SPACE = (ev.keyCode == 32);
			var LEFT = (ev.keyCode == 37), UP = (ev.keyCode == 38), RIGHT = (ev.keyCode == 39), DOWN = (ev.keyCode == 40);
			var DEL = (ev.keyCode == 46);
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
			var upNode;// = (isFirst) ? parentNode : (expanded(prevNode)) ? last(prevNode) : prevNode;
			if (isFirst) {
				upNode = parentNode;
			} else {
				if (expanded(prevNode)) {
					upNode = last(prevNode);
					while (expanded(upNode)) {
						upNode = last(upNode);
					}
				} else {
					upNode = prevNode;
				}
			}
			var downNode; // = (isLast && !expanded(node)) ? next(parentNode) : (expanded(node)) ? first(node) : nextNode ;
			if (isLast && !expanded(node.filter(':last'))) {
				var firstNonLastAncestor = node.filter(':last').parents('.ui-tree-node').filter(function() {
					return (next($(this)).length);
				}).eq(0);
				downNode = next(firstNonLastAncestor);
			} else {
				downNode = (expanded(node.filter(':last'))) ? first(node.filter(':last')) : nextNode;
			}

			if (DEL) {
				node.each(function() {
					var eachNode = $(this);
					var eachParentNode = parent(eachNode);
					eachNode.remove();
					update(eachParentNode);
				});
			}

			if (CTRL && X) {
				CUT = true;
				node.addClass('ui-tree-node-moving');
			}

			if (CTRL && V) {
				CUT = false;
				node.removeClass('ui-tree-node-moving');
			}

			if ((CUT || ALT) && HOME) {
				node.insertBefore(firstNode);
			} else if (HOME) {
				if (!isFirst) select(firstNode);
			}

			if ((CUT || ALT) && END) {
				node.insertAfter(lastNode);
			} else if (END) {
				if (!isLast) select(lastNode);
			}

			if ((CUT || ALT) && LEFT) {
				unindent(node);
			} else if (SHIFT && LEFT) {

			} else if (LEFT) {
				if (expanded(node)) {
					collapse(node);
				} else {
					select(parentNode);
				}
			}

			if ((CUT || ALT) && UP) {
				prevNode.insertAfter(node.filter(':last'));
			} else if (SHIFT && UP) {
				if (!isFirst) {
					shiftSelPos--;
					if (shiftSelPos < 0) {
						andSelect(prevNode);
					} else {
						unselect(node.filter(':last'));
					}
				}
			} else if (UP) {
				shiftSelPos = 0;
				select(upNode.filter(':first'));
			}

			if ((CUT || ALT) && RIGHT) {
				indent(node);
			} else if (SHIFT && RIGHT) {

			} else if (RIGHT) {
				if (expanded(node)) {
					select(downNode)
				} else {
					expand(node);
				}
			}

			if ((CUT || ALT) && DOWN) {
				nextNode.insertBefore(node.filter(':first'));
			} else if (SHIFT && DOWN) {
				if (!isLast) {
					shiftSelPos++;
					if (shiftSelPos > 0) {
						andSelect(nextNode);
					} else {
						unselect(node.filter(':first'));
					}
				}
			} else if (DOWN) {
				shiftSelPos = 0;
				select(downNode.filter(':last'));
			}

			if (UP || DOWN || HOME || END) { // Prevent Page/container scroll
				return false;
			}
			if (SHIFT && LEFT || RIGHT) { // Prevent text selection
				return false;
			}
			if (ALT && LEFT || RIGHT) { // Prevent forward and back navigation
				ev.preventDefault();
			}
		})
		.keyup(function(ev) {
			if (ev.keyCode == 16) {
				SHIFT = false;
			}
			if (ev.keyCode == 17) {
				CTRL = false;
			}
			if (ev.keyCode == 18) {
				ALT = false;
				if (!CUT)
					$('.ui-tree-node-moving').removeClass('ui-tree-node-moving');
				return false;
			}
		})
		.focus(function(ev) {
			if ($('.ui-tree-node-selected', this).length == 0)
				select($('.ui-tree-node:first', this));
			$('.ui-tree', this).addClass('ui-tree-active');
		})
		.blur(function(ev) {
			$('.ui-tree', this).removeClass('ui-tree-active');
			$('.ui-tree-node-moving', this).removeClass('ui-tree-node-moving');
			CUT = false;
			SHIFT = false;
		})
		;

		function collapse(node) {
			var nodes = node.children('.ui-tree-nodes');
			if (nodes.length) {
				node.removeClass('ui-tree-node-expanded').addClass('ui-tree-node-collapsed');
				node.children('.ui-tree-nodes').hide();
				node.children('.ui-tree-node-button').text('+ ');
				node.each(function() {
					$(this).triggerHandler("treecollapse", [null, {node:this}], self.options.collapse);
				})
			}
		}

		function expand(node) {
			var nodes = node.children('.ui-tree-nodes');
			if (nodes.length) {
				node.removeClass('ui-tree-node-collapsed').addClass('ui-tree-node-expanded');
				nodes.show();
				node.children('.ui-tree-node-button').text('- ');
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
			andSelect(node);
		}

		function unindent(node) {
			var parentNode = parent(node.filter(':last'));
			var dummy = $(document.createElement('li'));
			dummy.insertAfter(parentNode);
			node.insertBefore(dummy);
			dummy.remove();
			update(parentNode);
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
			node.children('.ui-tree-node-text').css('outline', 'none');
		}

		function select(node) {
			if (node.length) {
				$('.ui-tree-node-selected').removeClass('ui-tree-node-selected').removeClass('ui-tree-node-moving')
					.children('.ui-tree-node-text').css('outline', 'none');
				shiftSelPos = 0;
				node.addClass('ui-tree-node-selected');
				node.children('.ui-tree-node-text').css('outline', '1px dotted black');
			}
		}

		function andSelect(node) {
			node.addClass('ui-tree-node-selected')
				.children('.ui-tree-node-text').css('outline', '1px dotted black');
		}

		function update(node) {
			var nodes = node.children('.ui-tree-nodes');
			if (nodes.length && nodes.children('.ui-tree-node').length) { 
				node.addClass('ui-tree-node-expanded');
				node.children('.ui-tree-node-button').text('- ');
			} else {
				node.removeClass('ui-tree-node-expanded').removeClass('ui-tree-node-collapsed');
				node.children('.ui-tree-node-button').html('&bull;&nbsp;');
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

})(jQuery);
