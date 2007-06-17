(function($) {
	
	if(!$.i2) $.i2 = {};
	
	$.i2._drop = {
		manager: [],
		init: function(o) {

			if(!o) var o = {};			
			return this.each(function() {
				this.dropOptions = {
					accept: o.accept && o.accept.constructor == Function ? o.accept : function(dragEl) {
						return dragEl.className.match(new RegExp('(\\s|^)'+o.accept+'(\\s|$)'));	
					},
					onHover: o.onHover && o.onHover.constructor == Function ? o.onHover : false,
					onOut: o.onOut && o.onOut.constructor == Function ? o.onOut : function(drag,helper) {
						$(helper).html(helper.oldContent);					
					},
					onDrop: o.onDrop && o.onDrop.constructor == Function ? o.onDrop : false,
					greedy: o.greedy ? o.greedy : false
				}

				/* Add the reference and positions to the manager */
				d.manager.push({ item: this, over: 0, out: 1 });
			
				/* Bind the hovering events */
				$(this).hover(d.evHover,d.evOut);
				
				/* Bind the mouseover event */
				$(this).bind("mousemove", d.evMove);
				
				/* Bind the Drop event */
				$(this).bind("mouseup", d.evDrop);
				
			});
		},
		destroy: function() {
			
		},
		evMove: function(e) {
			
			if(!f.current) return;

			var o = this.dropOptions;
			
			/* Save current target, if no last target given */
			var findCurrentTarget = function(e) {
				if(e.currentTarget) return e.currentTarget;
				var element = e.srcElement;
				do {
					if(element.dropOptions) return element;
					element = element.parentNode;
				} while (element);
			}
			if(f.current && o.accept(f.current)) f.currentTarget = findCurrentTarget(e);
			
			f.evDrag.apply(document, [e]);
			e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
				
		},
		evHover: function(e) {

			if(!f.current) return;
			
			var o = this.dropOptions;
			
			/* Save helper content in the oldContent property */
			f.helper.oldContent = $(f.helper).html();			

			/* Fire the callback if we are dragging and the accept function returns true */
			if(o.onHover && o.accept(f.current)) o.onHover.apply(this, [f.current, f.helper]);

		},
		evOut: function(e) {

			var o = this.dropOptions;
		
			/* Fire the callback if we are dragging and the accept function returns true */
			if(f.current && o.onOut && o.accept(f.current)) o.onOut.apply(this, [f.current, f.helper]);	

		},
		evDrop: function(e) {

			var o = this.dropOptions;
			/* Fire the callback if we are dragging and the accept function returns true */
			if(f.current && o.onDrop && o.accept(f.current)) {
				if(o.greedy && !f.slowMode) {
					if(f.currentTarget == this) o.onDrop.apply(this, [f.current, f.helper]);
				} else {
					o.onDrop.apply(this, [f.current, f.helper]);	
				}
			}			

		}
	}
	
	/* Map keyword 'd' to $.i2._drop for convienence */
	var d = $.i2._drop;
	
	/* Extend $'s methods, map two of our internals */
	$.fn.extend({
		undroppable : $.i2._drop.destroy,
		droppable : $.i2._drop.init
	});
	
 })($);