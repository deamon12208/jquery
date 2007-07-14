(function($) {

	$.fn.draggable = function(o) {
		return this.each(function() {
			new $.ui.draggable(this,o);	
		});
	}
	
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
						if(m[i].item.options.activate && m[i].item.options.accept(that)) m[i].item.activate.call(m[i].item);
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
					if(m[i].over == 0) { m[i].out = 0; m[i].over = 1; m[i].item.over.call(m[i].item); }
				} else {
					if(m[i].out == 0) { m[i].out = 1; m[i].over = 0; m[i].item.out.call(m[i].item); }
				}
				
			}
						
		}
	};
	
	
	$.ui.draggable = function(el,o) {
		
		var options = {};
		$.extend(options, o);
		$.extend(options, {
			_start: function(h,p,c,t) {
				self.start.apply(t, [self]); // Trigger the onStart callback				
			},
			_beforeStop: function(h,p,c,t) {
				self.stop.apply(t, [self]); // Trigger the onStart callback
			},
			_stop: function(h,p,c,t) {
				var o = t.options;
				if(o.stop) o.stop.apply(t.element, [t.helper, t.pos, o.cursorAt, t]);
			},
			_drag: function(h,p,c,t) {
				self.drag.apply(t, [self]); // Trigger the onStart callback
			}			
		});
		var self = this;
		
		if(options.ghosting == true) options.helper = 'clone'; //legacy option check
		this.interaction = new $.ui.mouseInteraction(el,options);
		
		if(options.name) $.ui.add(options.name, 'draggable', this); //Append to UI manager if a name exists as option
		
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
		execPlugins: function(type,self) {
			var o = self.options;
			if(this.plugins[type]) {
				for(var i=0;i<this.plugins[type].length;i++) {
					if(self.options[this.plugins[type][i][0]]) {
						this.plugins[type][i][1].call(self, this);
					}
							
				}	
			}			
		},
		start: function(that) {
			
			var o = this.options;
			$.ui.ddmanager.current = this;
			
			that.execPlugins('start', this);
			
			if(this.slowMode && $.ui.droppable && !o.dropBehaviour)
				$.ui.ddmanager.prepareOffsets(this);
				
			if(o.start) o.start.apply(this.element, [this.helper, this.pos, o.cursorAt, this]);
			
			return false;
						
		},
		stop: function(that) {			
			
			var o = this.options;
			
			that.execPlugins('stop', this);

			if(this.slowMode && $.ui.droppable && !o.dropBehaviour) //If cursorAt is within the helper, we must use our drop manager
				$.ui.ddmanager.fire(this);

			$.ui.ddmanager.current = null;

			return false;
			
		},
		drag: function(that) {

			var o = this.options;

			if(this.slowMode && $.ui.droppable && !o.dropBehaviour) // If cursorAt is within the helper, we must use our drop manager to look where we are
				$.ui.ddmanager.update(this);

			this.pos = [this.pos[0]-(o.cursorAt.left ? o.cursorAt.left : 0), this.pos[1]-(o.cursorAt.top ? o.cursorAt.top : 0)];
			that.execPlugins('drag', this);

			if(o.drag) var nv = o.drag.apply(this.element, [this.helper, this.pos, o.cursorAt, this]);
			var nl = (nv && nv.x) ? nv.x :  this.pos[0];
			var nt = (nv && nv.y) ? nv.y :  this.pos[1];
			
			$(this.helper).css('left', nl+'px').css('top', nt+'px'); // Stick the helper to the cursor
			return false;
			
		}
	});

 })($);
