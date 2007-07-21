(function($) {

	$.fn.draggable = function(o) {
		return this.each(function() {
			new $.ui.draggable(this, o);
		});
	}
	
	$.ui.ddmanager = {
		current: null,
		droppables: [],
		prepareOffsets: function(that) {
			var dropTop = $.ui.ddmanager.dropTop = [];
			var dropLeft = $.ui.ddmanager.dropLeft;
			var m = $.ui.ddmanager.droppables;
			for (var i = 0; i < m.length; i++) {
				m[i].offset = $(m[i].item.element).offset({ border: false });
				if (that) { //Activate the droppable if used directly from draggables
					if (m[i].item.options.accept(that.element))
						m[i].item.activate.call(m[i].item);
				}
			}
						
		},
		prepareOffsetsAsync: function(that) {

			var m = $.ui.ddmanager.droppables;
			var ml = m.length;
			var j = 0; var i= 0;
			
			var func = (function() {
				for (; i < ml; i++) {
					m[i].offset = $(m[i].item.element).offsetLite({ border: false });
					if (that) { //Activate the droppable if used directly from draggables
						if (m[i].item.options.activate && m[i].item.options.accept(that.element))
							m[i].item.activate.call(m[i].item);
					}
					
					if (i == j * 20 + 19) { //Call the next block of 20
						j++;
						var c = arguments.callee;
						window.setTimeout(function() { c(); }, 0);
						break;
					}
				}
			})();

		},
		fire: function(oDrag) {
			var oDrops = $.ui.ddmanager.droppables;
			var oOvers = $.grep(oDrops, function(oDrop) {
				var toleranceMode = oDrop.item.options.tolerance;
				var isOver = $.ui.intersect(oDrag, oDrop, toleranceMode)
				if (isOver)
					oDrop.item.drop.call(oDrop.item);
			});
			$.each(oDrops, function(i, oDrop) {
				if (oDrop.item.options.accept(oDrag.element)) {
					oDrop.out = 1;
					oDrop.over = 0;
					oDrop.item.deactivate.call(oDrop.item);
				}
			});
		},
		update: function(oDrag) {
			var oDrops = $.ui.ddmanager.droppables;
			var oOvers = $.grep(oDrops, function(oDrop) {
				var toleranceMode = oDrop.item.options.tolerance;
				var isOver = $.ui.intersect(oDrag, oDrop, toleranceMode)
				if (!isOver && oDrop.over == 1) {
					oDrop.out = 1;
					oDrop.over = 0;
					oDrop.item.out.call(oDrop.item);
				}
				return isOver;
			});
			$.each(oOvers, function(i, oOver) {
				if (oOver.over == 0) {
					oOver.out = 0;
					oOver.over = 1;
					oOver.item.over.call(oOver.item);
				}
			});
		}
	};
	
	$.ui.draggable = function(el, o) {
		
		var options = {};
		$.extend(options, o);
		$.extend(options, {
			_start: function(h, p, c, t) {
				self.start.apply(t, [self]); // Trigger the start callback				
			},
			_beforeStop: function(h, p, c, t) {
				self.stop.apply(t, [self]); // Trigger the start callback
			},
			_stop: function(h, p, c, t) {
				var o = t.options;
				if (o.stop) {
					o.stop.apply(t.element, [t.helper, t.pos, o.cursorAt, t]);
				}
			},
			_drag: function(h, p, c, t) {
				self.drag.apply(t, [self]); // Trigger the start callback
			}			
		});
		var self = this;
		
		if (options.ghosting == true)
			options.helper = 'clone'; //legacy option check

		this.interaction = new $.ui.mouseInteraction(el, options);
		
		if (options.name)
			$.ui.add(options.name, 'draggable', this); //Append to UI manager if a name exists as option
		
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
		execPlugins: function(type, self) {
			var o = self.options;
			if (this.plugins[type]) {
				for (var i = 0; i < this.plugins[type].length; i++) {
					if (self.options[this.plugins[type][i][0]]) {
						this.plugins[type][i][1].call(self, this);
					}
							
				}	
			}			
		},
		start: function(that) {
			
			var o = this.options;
			$.ui.ddmanager.current = this;
			
			that.execPlugins('start', this);
			
			if (this.slowMode && $.ui.droppable && !o.dropBehaviour)
				$.ui.ddmanager.prepareOffsets(this);
				
			if (o.start)
				o.start.apply(this.element, [this.helper, this.pos, o.cursorAt, this]);
			
			return false;
						
		},
		stop: function(that) {			
			
			var o = this.options;
			
			that.execPlugins('stop', this);

			if (this.slowMode && $.ui.droppable && !o.dropBehaviour) //If cursorAt is within the helper, we must use our drop manager
				$.ui.ddmanager.fire(this);

			$.ui.ddmanager.current = null;

			return false;
			
		},
		drag: function(that) {

			var o = this.options;

			$.ui.ddmanager.update(this);

			this.pos = [this.pos[0]-(o.cursorAt.left ? o.cursorAt.left : 0), this.pos[1]-(o.cursorAt.top ? o.cursorAt.top : 0)];
			that.execPlugins('drag', this);

			if (o.drag)
				var nv = o.drag.apply(this.element, [this.helper, this.pos, o.cursorAt, this]);
			var nl = (nv && nv.x) ? nv.x : this.pos[0];
			var nt = (nv && nv.y) ? nv.y : this.pos[1];
			
			$(this.helper).css('left', nl+'px').css('top', nt+'px'); // Stick the helper to the cursor
			return false;
			
		}
	});

})($);
