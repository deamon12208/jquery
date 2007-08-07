(function($) {

	$.fn.resizable = function(o) {
		return this.each(function() {
			new $.ui.resizable(this,o);	
		});
	}
	
	
	$.ui.resizable = function(el,o) {
		
		var options = {};
		o = o ? o : {};
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
		
		//Destructive mode wraps the original element
		if(el.nodeName.match(/textarea|input|select|button/i)) options.destructive = true;
		if(options.destructive) {
			$(el).wrap('<div class="ui-wrapper"  style="position: relative; border: 0; margin: 0; padding: 0; width: '+$(el).outerWidth()+'px; height: '+$(el).outerHeight()+';"></div>');
			var oel = el;
			el = el.parentNode;

			var t = function(a,b) { $(el).append("<div class='ui-"+a+"-resize ui-resize-handler' style='position: absolute; "+b+"'></div>"); };
			var b = [parseInt($(oel).css('borderTopWidth')),parseInt($(oel).css('borderRightWidth')),parseInt($(oel).css('borderBottomWidth')),parseInt($(oel).css('borderLeftWidth'))];
			t('n','top: '+b[0]+'px;');
			t('e','right: '+b[1]+'px;');
			t('s','bottom: '+b[1]+'px;');
			t('w','left: '+b[3]+'px;');
			t('se','bottom: '+b[2]+'px; right: '+b[1]+'px;');
			t('sw','bottom: '+b[2]+'px; left: '+b[3]+'px;');
			t('ne','top: '+b[0]+'px; right: '+b[1]+'px;');
			t('nw','top: '+b[0]+'px; left: '+b[3]+'px;');
			
			o.proportionallyResize = o.proportionallyResize ? o.proportionallyResize : [];
			o.proportionallyResize.push(oel);
		}
		
		//If other elements should be modified, we have to copy that array
		options.modifyThese = [];
		if(o.proportionallyResize) {
			options.proportionallyResize = o.proportionallyResize.slice(0);
			var propRes = options.proportionallyResize;

			for(var i in propRes) {
				
				if(propRes[i].constructor == String)
					propRes[i] = $(propRes[i], el);
				
				if(!$(propRes[i]).length) continue;
				
				
				var x = $(propRes[i]).width() - $(el).width();
				var y = $(propRes[i]).height() - $(el).height();
				options.modifyThese.push([$(propRes[i]),x,y]);
			}

		}
		
		options.handles = {};
		if(!o.handles) o.handles = { n: '.ui-n-resize', e: '.ui-e-resize', s: '.ui-s-resize', w: '.ui-w-resize', se: '.ui-se-resize', sw: '.ui-sw-resize', ne: '.ui-ne-resize', nw: '.ui-nw-resize' };
		
		for(var i in o.handles) { options.handles[i] = o.handles[i]; } //Copying the object
		
		for(var i in options.handles) {
			
			if(options.handles[i].constructor == String)
				options.handles[i] = $(options.handles[i], el);
			
			if(!$(options.handles[i]).length) continue;
				
			$(options.handles[i]).show().bind('mousedown', function(e) {
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
			
			this.options.modifyThese.push([$(this.helper),0,0]);
			
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
			
			for(var i in this.options.modifyThese) {
				var c = this.options.modifyThese[i];
				c[0].css({
					width: modifier.width ? modifier.width+c[1] : nw+c[1],
					height: modifier.height ? modifier.height+c[2] : nh+c[2]
				});
			}
			return false;
			
		}
	});

 })($);
