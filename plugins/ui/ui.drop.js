(function($) {

	$.fn.droppable = function(o) {
		return this.each(function() {
			new $.ui.droppable(this,o);
		});
	}
	
	$.fn.undroppable = function() {
		
	}
	
	$.ui.droppable = function(el,o) {

		if(!o) var o = {};			
		this.element = el; if($.browser.msie) el.droppable = 1;
		
		this.options = {};
		$.extend(this.options, o);
		
		var accept = o.accept;
		$.extend(this.options, {
			accept: o.accept && o.accept.constructor == Function ? o.accept : function(d) {
				return $(d).is(accept);	
			},
			tolerance: o.tolerance ? o.tolerance : 'intersect'
		});
		o = this.options;

		
		$.ui.ddmanager.droppables.push({ item: this, over: 0, out: 1 }); // Add the reference and positions to the manager
		
		var self = this;
		
		$(this.element).bind("mousemove", function(e) {
			return self.move.apply(self, [e]);	
		});
		
		$(this.element).bind("mouseup", function(e) {
			return self.drop.apply(self, [e]);	
		});
		
		if(o.name) $.ui.add(o.name, 'droppable', this); //Append to UI manager if a name exists as option
			
	};
	
	$.extend($.ui.droppable.prototype, {
		plugins: {},
		execPlugins: function(type) {
			var o = this.options;
			if(this.plugins[type]) {
				for(var i=0;i<this.plugins[type].length;i++) {
					if(this.options[this.plugins[type][i][0]]) {
						this.plugins[type][i][1].call(this);	
					}
				}	
			}			
		},
		destroy: function() {
			
		},
		move: function(e) {

			if(!$.ui.ddmanager.current) return;

			var o = this.options;
			var c = $.ui.ddmanager.current;
			
			/* Save current target, if no last target given */
			var findCurrentTarget = function(e) {
				if(e.currentTarget) return e.currentTarget;
				var element = e.srcElement;
				do {
					if(element.droppable) return element; //This is only used in IE! references in DOM are evil!
					element = element.parentNode;
				} while (element);
			}
			if(c && o.accept(c.element)) c.currentTarget = findCurrentTarget(e);
			
			c.drag.apply(c, [e]);
			e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
			
		},
		over: function(e) {

			var c = $.ui.ddmanager.current;
			if (!c || c.element == this.element) return; // Bail if draggable and droppable are same element
			
			var o = this.options;
			if (o.accept(c.element)) {
				this.execPlugins('over');
				if (o.over) o.over.apply(this.element, [c.element, c.helper, c]); //Fire callback
			}
			
		},
		out: function(e) {

			var c = $.ui.ddmanager.current;
			if (!c || c.element == this.element) return; // Bail if draggable and droppable are same element

			var o = this.options;
			if (o.accept(c.element)) {
				this.execPlugins('out');
				if (o.out) o.out.apply(this.element, [c.element, c.helper, c]); //Fire callback
			}
			
		},
		drop: function(e) {

			var c = $.ui.ddmanager.current;
			if (!c || c.element == this.element) return; // Bail if draggable and droppable are same element
			
			var o = this.options;
			if(o.accept(c.element)) { // Fire callback
				if(o.greedy && !c.slowMode) {
					if(c.currentTarget == this.element) {
						this.execPlugins('drop');
						if(o.drop) o.drop.apply(this.element, [c.element, c.helper, c]);
					}
				} else {
					this.execPlugins('drop');
					if(o.drop) o.drop.apply(this.element, [c.element, c.helper, c]);	
				}
			}
			
		},
		activate: function(e) {

			var c = $.ui.ddmanager.current;

			var o = this.options;
			this.execPlugins('activate');
			if(c && o.activate) o.activate.apply(this.element, [c.element, c.helper, c]); //Fire callback
			
		},
		deactivate: function(e) {

			var c = $.ui.ddmanager.current;

			var o = this.options;
			this.execPlugins('deactivate');
			if(c && o.deactivate) o.deactivate.apply(this.element, [c.element, c.helper, c]); //Fire callback	
			
		}
	});
	
	$.ui.intersect = function(oDrag, oDrop, toleranceMode) {
		if (!oDrop.offset)
			return false;
		var x1 = oDrag.rpos[0] - oDrag.options.cursorAt.left, x2 = x1 + oDrag.helper.offsetWidth,
		    y1 = oDrag.rpos[1] - oDrag.options.cursorAt.top , y2 = y1 + oDrag.helper.offsetHeight;
		var l = oDrop.offset.left, r = l + oDrop.item.element.offsetWidth, 
		    t = oDrop.offset.top,  b = t + oDrop.item.element.offsetHeight;
		switch (toleranceMode) {
			case 'fit':
				return (   l < x1 && x2 < r
					&& t < y1 && y2 < b);
				break;
			case 'intersect':
				return (   l < x1 + (oDrag.helper.offsetWidth  / 2)        // Right Half
					&&     x2 - (oDrag.helper.offsetWidth  / 2) < r    // Left Half
					&& t < y1 + (oDrag.helper.offsetHeight / 2)        // Bottom Half
					&&     y2 - (oDrag.helper.offsetHeight / 2) < b ); // Top Half
				break;
			case 'pointer':
				return (   l < oDrag.rpos[0] && oDrag.rpos[0] < r
					&& t < oDrag.rpos[1] && oDrag.rpos[1] < b);
				break;
			case 'touch':
				return (   (l < x1 && x1 < r && t < y1 && y1 < b)    // Top-Left Corner
					|| (l < x1 && x1 < r && t < y2 && y2 < b)    // Bottom-Left Corner
					|| (l < x2 && x2 < r && t < y1 && y1 < b)    // Top-Right Corner
					|| (l < x2 && x2 < r && t < y2 && y2 < b) ); // Bottom-Right Corner
				break;
			default:
				return false;
				break;
		}
	}
	
})($);

