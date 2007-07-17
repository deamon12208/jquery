(function($) {

	$.fn.resizable = function(o) {
		return this.each(function() {
			new $.ui.resizable(this,o);	
		});
	}
	
	
	$.ui.resizable = function(el,o) {
		
		var options = {};
		$.extend(options, o);
		
		if(options.proxy) {
			var helper = function(e,that) {
				var helper = $('<div></div>').css({
					width: $(this).width(),
					height: $(this).height(),
					position: 'absolute',
					left: that.options.curOffset.left,
					top: that.options.curOffset.top
				}).addClass(that.options.proxy);
				return helper;
			}	
		} else {
			var helper = "original";	
		}
		
		$.extend(options, {
			helper: helper,
			nonDestructive: true,
			dragPrevention: 'input,button,select',
			startCondition: function(e) {
				var tp = $(e.target).parents().add(e.target);
				return true;	
			},
			_start: function(h,p,c,t) {
				self.start.apply(t, [self]); // Trigger the start callback				
			},
			_beforeStop: function(h,p,c,t) {
				self.stop.apply(t, [self]); // Trigger the start callback
			},
			_stop: function(h,p,c,t) {
				var o = t.options;
				if(o.stop) o.stop.apply(t.element, [t.helper, t.pos, o.cursorAt, t]);
			},
			_drag: function(h,p,c,t) {
				self.drag.apply(t, [self]); // Trigger the start callback
			}			
		});
		var self = this;
		
		if(options.handles) {
			if(options.handles.s)
				$(options.handles.s).bind('mousedown', function(e) { self.interaction.options.axis = 's'; return self.interaction.trigger(e); });
			if(options.handles.o)
				$(options.handles.o).bind('mousedown', function(e) { self.interaction.options.axis = 'o'; return self.interaction.trigger(e); });
		}
		
		this.interaction = new $.ui.mouseInteraction(el,options);
		if(options.name) $.ui.add(options.name, 'resizable', this); //Append to UI manager if a name exists as option
		
	}
	
	$.extend($.ui.resizable.prototype, {
		start: function(that) {
			
			var o = this.options;
			if(o.start) o.start.apply(this.element, [this.helper, this.pos, o.cursorAt, this]);
			
			o.oWidth = $(this.element).width();
			o.oHeight = $(this.element).height();
			
			return false;
						
		},
		stop: function(that) {			
			
			var o = this.options;
			if(o.proxy) {
				$(this.element).css({
					width: $(this.helper).width(),
					height: $(this.helper).height()
				});
			}
			return false;
			
		},
		drag: function(that) {

			var o = this.options;


			this.pos = [this.rpos[0]-(o.cursorAt.left ? o.cursorAt.left : 0), this.rpos[1]-(o.cursorAt.top ? o.cursorAt.top : 0)];

			var nw = o.oWidth + (this.pos[0] - o.curOffset.left);
			var nh = o.oHeight + (this.pos[1] - o.curOffset.top);
			
			if(o.minWidth) var nw = nw <= o.minWidth ? o.minWidth : nw;
			if(o.minHeight) var nh = nh <= o.minHeight ? o.minHeight : nh;
			
			if(o.maxWidth) var nw = nw >= o.maxWidth ? o.maxWidth : nw;
			if(o.maxHeight) var nh = nh >= o.maxHeight ? o.maxHeight : nh;
			
			if(o.axis) {
				switch(o.axis) {
					case 'o':
						nh = o.oHeight;
						break;
					case 's':
						nw = o.oWidth;
						break;	
				}	
			}
			
			
			if(o.drag) var nv = o.drag.apply(this.element, [this.helper, this.pos, o.cursorAt, this]);
			var nl = (nv && nv.x) ? nv.x :  this.pos[0];
			var nt = (nv && nv.y) ? nv.y :  this.pos[1];
			
			$(this.helper).css({
				width: nw,
				height: nh
			});
			return false;
			
		}
	});

 })($);
