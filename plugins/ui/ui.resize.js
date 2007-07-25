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
		
		options.handles = options.handles ? options.handles : {};
		
		$.extend(options, {
			helper: helper,
			nonDestructive: true,
			dragPrevention: 'input,button,select',
			startCondition: function(e) {
				for(var i in options.handles) {
					if($(options.handles[i])[0] == e.target) return true;
				}
				return false;
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
		

		for(var i in options.handles) {
			$(options.handles[i]).bind('mousedown', function(e) {
				self.interaction.options.axis = this.resizeAxis; return self.interaction.trigger(e);
			})[0].resizeAxis = i;
		}
		
		this.interaction = new $.ui.mouseInteraction(el,options);
		if(options.name) $.ui.add(options.name, 'resizable', this); //Append to UI manager if a name exists as option
		
	}
	
	$.extend($.ui.resizable.prototype, {
		start: function(that) {
			this.options.originalSize = [$(this.element).width(),$(this.element).height()];			
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
			var co = o.curOffset;
			var p = o.originalSize;

			this.pos = [this.rpos[0]-(o.cursorAt.left ? o.cursorAt.left : 0), this.rpos[1]-(o.cursorAt.top ? o.cursorAt.top : 0)];

			var nw = p[0] + (this.pos[0] - co.left);
			var nh = p[1] + (this.pos[1] - co.top);
			
			if(o.axis) {
				switch(o.axis) {
					case 'e':
						nh = p[1];
						break;
					case 's':
						nw = p[0];
						break;
					case 'n':
						nw = p[0]; var mod = (this.pos[1] - co.top); nh = nh - (mod*2);
						mod = nh <= o.minHeight ? p[1] - o.minHeight : (nh >= o.maxHeight ? 0-(o.maxHeight-p[1]) : mod);
						$(this.helper).css('top', co.top + mod);
						break;
					case 'w':
						nh = p[1]; var mod = (this.pos[0] - co.left); nw = nw - (mod*2);
						mod = nw <= o.minWidth ? p[0] - o.minWidth : (nw >= o.maxWidth ? 0-(o.maxWidth-p[0]) : mod);
						$(this.helper).css('left', co.left + mod);
						break;						
				}	
			}
			
			if(o.minWidth) nw = nw <= o.minWidth ? o.minWidth : nw;
			if(o.minHeight) nh = nh <= o.minHeight ? o.minHeight : nh;
			
			if(o.maxWidth) nw = nw >= o.maxWidth ? o.maxWidth : nw;
			if(o.maxHeight) nh = nh >= o.maxHeight ? o.maxHeight : nh;

			
			$(this.helper).css({
				width: nw,
				height: nh
			});
			return false;
			
		}
	});

 })($);
