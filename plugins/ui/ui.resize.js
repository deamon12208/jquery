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
					left: that.options.co.left,
					top: that.options.co.top
				}).addClass(that.options.proxy);
				return helper;
			}	
		} else {
			var helper = "original";	
		}
		
		options.handles = {};
		if(!o.handles) o.handles= {};
		for(var i in o.handles) { options.handles[i] = o.handles[i]; } //Copying the object
		
		for(var i in options.handles) {
			
			if(options.handles[i].constructor == String)
				options.handles[i] = $(options.handles[i], el);
				
			$(options.handles[i]).bind('mousedown', function(e) {
				self.interaction.options.axis = this.resizeAxis;
				return self.interaction.trigger(e);
			})[0].resizeAxis = i;
		}

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
			_start: function(h,p,c,t,e) {
				self.start.apply(t, [self, e]); // Trigger the start callback				
			},
			_beforeStop: function(h,p,c,t,e) {
				self.stop.apply(t, [self, e]); // Trigger the start callback
			},
			_drag: function(h,p,c,t,e) {
				self.drag.apply(t, [self, e]); // Trigger the start callback
			}			
		});
		var self = this;
		
		this.interaction = new $.ui.mouseInteraction(el,options);
		if(options.name) $.ui.add(options.name, 'resizable', this); //Append to UI manager if a name exists as option
		
	}
	
	$.extend($.ui.resizable.prototype, {
		plugins: {},
		prepareCallbackObj: function(self) {
			return {
				helper: self.helper,
				resizable: self,
				axis: self.options.axis
			}			
		},
		start: function(that, e) {
			this.options.originalSize = [$(this.element).width(),$(this.element).height()];
			this.options.originalPosition = $(this.element).css("position");
			$.ui.plugin.call('start', that, this);
			$.ui.trigger('start', this, e, that.prepareCallbackObj(this));			
			return false;
		},
		stop: function(that, e) {			
			
			var o = this.options;

			$.ui.plugin.call('stop', that, this);
			$.ui.trigger('stop', this, e, that.prepareCallbackObj(this));

			if(o.proxy) {
				$(this.element).css({
					width: $(this.helper).width(),
					height: $(this.helper).height()
				});
				
				if(o.originalPosition == "absolute" || o.originalPosition == "fixed") {
					$(this.element).css({
						top: $(this.helper).css("top"),
						left: $(this.helper).css("left")
					});					
				}
			}
			return false;
			
		},
		drag: function(that, e) {

			var o = this.options;
			var co = o.co;
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
					case 'ne':

						if(!o.proxy && (o.originalPosition != "absolute" && o.originalPosition != "fixed"))
							return false;
						
						if(o.axis == 'n') nw = p[0];
						var mod = (this.pos[1] - co.top); nh = nh - (mod*2);
						mod = nh <= o.minHeight ? p[1] - o.minHeight : (nh >= o.maxHeight ? 0-(o.maxHeight-p[1]) : mod);
						$(this.helper).css('top', co.top + mod);
						break;
						
					case 'w':
					case 'sw':

						if(!o.proxy && (o.originalPosition != "absolute" && o.originalPosition != "fixed"))
							return false;
						
						if(o.axis == 'w') nh = p[1];
						var mod = (this.pos[0] - co.left); nw = nw - (mod*2);
						mod = nw <= o.minWidth ? p[0] - o.minWidth : (nw >= o.maxWidth ? 0-(o.maxWidth-p[0]) : mod);
						$(this.helper).css('left', co.left + mod);
						break;
						
					case 'nw':
						
						if(!o.proxy && (o.originalPosition != "absolute" && o.originalPosition != "fixed"))
							return false;
	
						var modx = (this.pos[0] - co.left); nw = nw - (modx*2);
						modx = nw <= o.minWidth ? p[0] - o.minWidth : (nw >= o.maxWidth ? 0-(o.maxWidth-p[0]) : modx);
						
						var mody = (this.pos[1] - co.top); nh = nh - (mody*2);
						mody = nh <= o.minHeight ? p[1] - o.minHeight : (nh >= o.maxHeight ? 0-(o.maxHeight-p[1]) : mody);

						$(this.helper).css({
							left: co.left + modx,
							top: co.top + mody
						});
						
						break;
				}	
			}
			
			if(o.minWidth) nw = nw <= o.minWidth ? o.minWidth : nw;
			if(o.minHeight) nh = nh <= o.minHeight ? o.minHeight : nh;
			
			if(o.maxWidth) nw = nw >= o.maxWidth ? o.maxWidth : nw;
			if(o.maxHeight) nh = nh >= o.maxHeight ? o.maxHeight : nh;

			$.ui.plugin.call('resize', that, this);
			var modifier = $.ui.trigger('resize', this, e, that.prepareCallbackObj(this));
			if(!modifier) modifier = {};
			
			$(this.helper).css({
				width: modifier.width ? modifier.width : nw,
				height: modifier.height ? modifier.height: nh
			});
			return false;
			
		}
	});

 })($);
