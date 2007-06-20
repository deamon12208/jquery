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
		this.element = el; if($.browser.msie) el.droppable = 1;
		
		this.options = {};
		$.extend(this.options, o);
		
		var accept = o.accept;
		$.extend(this.options, {
			accept: o.accept && o.accept.constructor == Function ? o.accept : function(d) {
				return $(d.element).is(accept);	
			},
			tolerance: o.tolerance ? o.tolerance : 'intersect'
		});
		o = this.options;

		
		$.ui.ddmanager.droppables.push({ item: this, over: 0, out: 1 }); // Add the reference and positions to the manager
	
		
		var self = this;
		$(this.element).hover(function(e) {
			return self.hover.apply(self, [e]);	
		},function(e) {
			return self.out.apply(self, [e]);	
		});
		
		$(this.element).bind("mousemove", function(e) {
			return self.move.apply(self, [e]);	
		});
		
		$(this.element).bind("mouseup", function(e) {
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
			
			var o = this.options; var c = $.ui.ddmanager.current;
			if(o.onHover && o.accept(c)) o.onHover.apply(this, [c.element, c.helper, c]); //Fire callback
			
		},
		out: function(e) {

			var o = this.options; var c = $.ui.ddmanager.current;
			if(c && o.onOut && o.accept(c)) o.onOut.apply(this, [c.element, c.helper, c]); //Fire callback
			
		},
		drop: function(e) {

			var o = this.options; var c = $.ui.ddmanager.current;
			
			if(c && o.onDrop && o.accept(c)) { // Fire callback
				if(o.greedy && !c.slowMode) {
					if(c.currentTarget == this.element) o.onDrop.apply(this, [c.element, c.helper, c]);
				} else {
					o.onDrop.apply(this, [c.element, c.helper, c]);	
				}
			}
			
		},
		activate: function(e) {

			var o = this.options; var c = $.ui.ddmanager.current;
			if(c && o.onActivate) o.onActivate.apply(this, [c.element, c.helper, c]); //Fire callback
			
		},
		deactivate: function(e) {

			var o = this.options; var c = $.ui.ddmanager.current;
			if(c && o.onDeactivate) o.onDeactivate.apply(this, [c.element, c.helper, c]); //Fire callback	
			
		}
	});
	
	$.ui.intersect = function(t, mi, o) {
		
		var cO = mi.offset;
		var add = [0,0];
		switch(o) {
			case 'pointer':
				return (t.pos[0] > cO.left && t.pos[0] < cO.left + mi.item.element.offsetWidth) && (t.pos[1] > cO.top && t.pos[1] < cO.top + mi.item.element.offsetHeight);
				break;
			case 'intersect':
				add = [t.element.offsetWidth/2,t.element.offsetHeight/2];
				break;
			case 'fit':
				add = [0,0];
				break;
			case 'touch':
				add = [t.element.offsetWidth,t.element.offsetHeight];
				break;
			default:
				return false;
				break;
		}
		
		return (
			   cO.left < t.rpos[0]-t.options.cursorAt.left + add[0]
			&& cO.left + mi.item.element.offsetWidth > t.rpos[0]-t.options.cursorAt.left + t.element.offsetWidth - add[0]
			&& cO.top < t.rpos[1]-t.options.cursorAt.top + add[1]
			&& cO.top + mi.item.element.offsetHeight > t.rpos[1]-t.options.cursorAt.top + t.element.offsetHeight - add[1]
		);
							
	}
	
 })($);