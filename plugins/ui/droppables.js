(function($) {

	$.fn.droppable = function(o) {
		this.each(function() {
			new $.ui.droppable(this,o);	
		});
	}
	
	$.fn.undroppable = function() {
		
	}
	
	$.ui.droppable = function(el,o) {

		if(!o) var o = {};			
		this.element = el;
		if($.browser.msie) el.droppable = 1;
		
		this.options = {};
		$.extend(this.options, o);
		
		var accept = o.accept;
		$.extend(this.options, {
			accept: o.accept && o.accept.constructor == Function ? o.accept : function(d) {
				return $(d.element).is(accept);	
			}
		});
		o = this.options;

		/* Add the reference and positions to the manager */
		$.ui.ddmanager.droppables.push({ item: this, over: 0, out: 1 });
	
		
		var self = this;
		$(this.element).hover(function(e) { //bind the hovering events
			return self.hover.apply(self, [e]);	
		},function(e) {
			return self.out.apply(self, [e]);	
		});
		
		$(this.element).bind("mousemove", function(e) { //bind the mouseover event
			return self.move.apply(self, [e]);	
		});
		
		$(this.element).bind("mouseup", function(e) { //bind the drop event
			return self.drop.apply(self, [e]);	
		});
			
	};
	
	$.extend($.ui.droppable.prototype, {
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
			if(c && o.accept(c)) c.currentTarget = findCurrentTarget(e);
			
			c.drag.apply(c, [e]);
			e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
			
		},
		hover: function(e) {

			if(!$.ui.ddmanager.current) return;
			
			var o = this.options;
			var c = $.ui.ddmanager.current;			

			/* Fire the callback if we are dragging and the accept function returns true */
			if(o.onHover && o.accept(c)) o.onHover.apply(this, [c.element, c.helper]);
			
		},
		out: function(e) {

			var o = this.options;
			var c = $.ui.ddmanager.current;
		
			/* Fire the callback if we are dragging and the accept function returns true */
			if(c && o.onOut && o.accept(c)) o.onOut.apply(this, [c.element, c.helper]);	
			
		},
		drop: function(e) {

			var o = this.options;
			var c = $.ui.ddmanager.current;
			
			if(c && o.onDrop && o.accept(c)) { // Fire the callback if we are dragging and the accept function returns true
				if(o.greedy && !c.slowMode) {
					if(c.currentTarget == this.element) o.onDrop.apply(this, [c.element, c.helper]);
				} else {
					o.onDrop.apply(this, [c.element, c.helper]);	
				}
			}
			
		}	
	});
	
 })($);