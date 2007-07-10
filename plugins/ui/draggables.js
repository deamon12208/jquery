(function($) {
	
	var num = function(el, prop) {
		return parseInt($.css(el.jquery?el[0]:el,prop))||0;
	};
	
	$.ui.ddmanager = {
		current: null,
		droppables: [],
		prepareOffsets: function(that) {
			
			var m = $.ui.ddmanager.droppables;
			for(var i=0;i<m.length;i++) {
				m[i].offset = $(m[i].item.element).offset({ border: false });
				if(that) { //Activate the droppable if used directly from draggables
					if(m[i].item.options.accept(that)) m[i].item.activate.call(m[i].item);
				}
			}
						
		},
		prepareOffsetsAsync: function(that) {

			var m = $.ui.ddmanager.droppables; var ml = m.length; var j = 0; var i= 0;
			
			var func = (function() {
				for(;i<ml;i++) {
					m[i].offset = $(m[i].item.element).offsetLite({ border: false });
					if(that) { //Activate the droppable if used directly from draggables
						if(m[i].item.options.onActivate && m[i].item.options.accept(that)) m[i].item.activate.call(m[i].item);
					}
					
					if(i == j*20+19) { //Call the next block of 20
						j++;
						var c = arguments.callee;
						window.setTimeout(function() { c(); }, 0);
						break;
					}
				}
			})();

		},
		fire: function(that) {
			
			var m = $.ui.ddmanager.droppables;
			for(var i=0;i<m.length;i++) {
				if(!m[i].offset) continue;
				if($.ui.intersect(that, m[i], m[i].item.options.tolerance)) {
					m[i].item.drop.call(m[i].item);
				}
				if(m[i].item.options.accept(that)) m[i].item.deactivate.call(m[i].item);
			}
						
		},
		update: function(that) {
			
			var m = $.ui.ddmanager.droppables;
			for(var i=0;i<m.length;i++) {
				if(!m[i].offset) continue;
				if($.ui.intersect(that, m[i], m[i].item.options.tolerance)) {
					if(m[i].over == 0) { m[i].out = 0; m[i].over = 1; m[i].item.hover.call(m[i].item); }
				} else {
					if(m[i].out == 0) { m[i].out = 1; m[i].over = 0; m[i].item.out.call(m[i].item); }
				}
				
			}
						
		}
	};

	
	$.fn.draggable = function(o) {
		
		return this.each(function() {
			new $.ui.draggable(this,o);	
		});
		
	}
	
	$.ui.draggable = function(el,o) {
	
		
		this.options = {};
		$.extend(this.options, o);
		var self = this;
		
		if(o.ghosting == true) o.helper = 'clone'; //legacy option check
		this.interaction = new $.ui.mouseInteraction(el,{
			handle : o.handle ? ($(o.handle, el)[0] ? $(o.handle, el) : $(el)) : $(el),
			helper: o.helper ? o.helper : 'original',
			preventionDistance: o.preventionDistance ? o.preventionDistance : 0,
			dragPrevention: o.dragPrevention ? o.dragPrevention.toLowerCase().split(',') : ['input','textarea','button','select','option'],
			cursorAt: { top: ((o.cursorAt && o.cursorAt.top) ? o.cursorAt.top : 0), left: ((o.cursorAt && o.cursorAt.left) ? o.cursorAt.left : 0), bottom: ((o.cursorAt && o.cursorAt.bottom) ? o.cursorAt.bottom : 0), right: ((o.cursorAt && o.cursorAt.right) ? o.cursorAt.right : 0) },
			cursorAtIgnore: (!o.cursorAt) ? true : false, //Internal property
			appendTo: o.appendTo ? o.appendTo : 'parent',
			onStart: function(h,p,c,t) {
				self.start.apply(t, [null]); // Trigger the onStart callback				
			},
			beforeStop: function(h,p,c,t) {
				self.stop.apply(t, [null]); // Trigger the onStart callback
			},
			onStop: function(h,p,c,t) {
				//self.start.apply(t, [null]); // Trigger the onStart callback
			},
			onDrag: function(h,p,c,t) {
				self.drag.apply(t, [null]); // Trigger the onStart callback
			}
		});
		
	}
	
	$.extend($.ui.draggable.prototype, {
		plugins: {},
		pos: null,
		opos: null,
		currentTarget: null,
		lastTarget: null,
		helper: null,
		timer: null,
		slowMode: false,
		element: null,
		init: false,
		execPlugins: function(type) {
			var o = this.options;
			if(this.plugins[type]) {
				for(var i=0;i<this.plugins[type].length;i++) {
					if(this.options[this.plugins[type][i][0]])
						this.plugins[type][i][1].call(this);	
				}	
			}			
		},
		destroy: function() {
			this.options.handle.unbind('mousedown', this.mousedownfunc);
		},
		start: function(e) {
			
			var o = this.options;
			$.ui.ddmanager.current = this;
			
			//this.execPlugins('start');
			
			if(this.slowMode && $.ui.droppable && !o.dropBehaviour)
				$.ui.ddmanager.prepareOffsets(this);
			
			return false;
						
		},
		stop: function(e) {			
			
			var o = this.options;
			
			//this.execPlugins('stop');

			if(this.slowMode && $.ui.droppable && !o.dropBehaviour) //If cursorAt is within the helper, we must use our drop manager
				$.ui.ddmanager.fire(this);

			return false;
			
		},
		drag: function(e) {

			var o = this.options;

			if(this.slowMode && $.ui.droppable && !o.dropBehaviour) // If cursorAt is within the helper, we must use our drop manager to look where we are
				$.ui.ddmanager.update(this);

			this.pos = [this.pos[0]-(o.cursorAt.left ? o.cursorAt.left : 0), this.pos[1]-(o.cursorAt.top ? o.cursorAt.top : 0)];
			//this.execPlugins('drag');

			$(this.helper).css('left', this.pos[0]+'px').css('top', this.pos[1]+'px'); // Stick the helper to the cursor
			return false;
			
		}
	});

 })($);
