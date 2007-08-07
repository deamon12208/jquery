(function($) {

	$.fn.slider = function(o) {
		return this.each(function() {
			new $.ui.slider(this, o);
		});
	}
	
	$.fn.unslider = function() {
		
	}
	
	$.ui.slider = function(el, o) {
		
		var options = {};
		o = o ? o : {};
		$.extend(options, o);
		$.extend(options, {
			axis: o.axis ? o.axis : (el.offsetWidth < el.offsetHeight ? 'vertical' : 'horizontal'),
			maxValue: o.maxValue ? o.maxValue : 100,
			minValue: o.minValue ? o.minValue : 0,
			curValue: o.startValue ? o.startValue : 0,
			_start: function(h, p, c, t, e) {
				self.start.apply(t, [self, e]); // Trigger the start callback				
			},
			_beforeStop: function(h, p, c, t, e) {
				self.stop.apply(t, [self, e]); // Trigger the start callback
			},
			_drag: function(h, p, c, t, e) {
				self.drag.apply(t, [self, e]); // Trigger the start callback
			}			
		});

		var self = this;
		var o = options;
		o.stepping = o.stepping ? o.stepping : (o.steps ? o.maxValue/o.steps : 0);
		o.realValue = (o.maxValue - o.minValue);


		this.handle = options.handle ? $(options.handle, el)[0] : $('.ui-slider-handle', el)[0];
		this.interaction = new $.ui.mouseInteraction(this.handle, options);
		this.element = el;
		
		
		if(o.axis == 'horizontal') {
			this.parentSize = $(this.element).outerWidth() - $(this.handle).outerWidth();
			this.prop = 'left';
		}
		
		if(o.axis == 'vertical') {
			this.parentSize = $(this.element).outerHeight() - $(this.handle).outerHeight();
			this.prop = 'top';
		}
		
		$(el).bind('click', function(e) { self.click.apply(self, [e]); });
		
		if (options.name)
			$.ui.add(options.name, 'slider', this); //Append to UI manager if a name exists as option
		
	}
	
	$.extend($.ui.slider.prototype, {
		currentTarget: null,
		lastTarget: null,
		prepareCallbackObj: function(self,m) {
			return {
				handle: self.helper,
				pixel: m,
				value: self.options.curValue+self.options.minValue,
				slider: self	
			}			
		},
		click: function(e) {
			var o = this.interaction.options;
			var pointer = [e.pageX,e.pageY];
			var offset = $(this.interaction.element).offsetParent().offset({ border: false });
			if(this.interaction.element == e.target) return;
			
			o.pickValue = o.curValue;
			this.drag.apply(this.interaction, [this, e, [pointer[0]-offset.left,pointer[1]-offset.top]]);
			if(o.pickValue != o.curValue) $.ui.trigger('change', this.interaction, e, this.prepareCallbackObj(this.interaction));
				
		},
		start: function(that, e) {
			
			var o = this.options;
			$.ui.trigger('start', this, e, that.prepareCallbackObj(this));
			o.pickValue = o.curValue;
			
			return false;
						
		},
		stop: function(that, e) {			
			
			var o = this.options;
			$.ui.trigger('stop', this, e, that.prepareCallbackObj(this));
			if(o.pickValue != o.curValue) $.ui.trigger('change', this, e, that.prepareCallbackObj(this));

			return false;
			
		},
		drag: function(that, e, pos) {

			var o = this.options;
			this.pos = pos ? pos : [this.pos[0]-(o.cursorAt.left ? o.cursorAt.left : 0), this.pos[1]-(o.cursorAt.top ? o.cursorAt.top : 0)];
			
			if(o.axis == 'horizontal') var m = this.pos[0];
			if(o.axis == 'vertical')   var m = this.pos[1];
			
			
			var p = that.parentSize;
			var prop = that.prop;

			if(m < 0) m = 0;
			if(m > p) m = p;

			o.curValue = (Math.round((m/p)*o.realValue));
			if(o.stepping) {
				o.curValue = Math.round(o.curValue/o.stepping)*o.stepping;
				m = ((o.curValue)/o.realValue) * p;
			}
			
			$(this.element).css(prop, m+'px');
			
			$.ui.trigger('slide', this, e, that.prepareCallbackObj(this,m));
			return false;
			
		},
		goto: function(value,scale,changeslide) {
			var o = this.interaction.options;
			var offset = $(this.interaction.element).offsetParent().offset({ border: false });
			o.pickValue = o.curValue;
			
			var modifier = scale ? scale : o.realValue;
			
			var p = this.parentSize;
			var prop = this.prop;
			
			m = Math.round(((value)/modifier) * p);

			if(m < 0) m = 0;
			if(m > p) m = p;
			
			o.curValue = (Math.round((m/p)*o.realValue));
			if(o.stepping) {
				o.curValue = Math.round(o.curValue/o.stepping)*o.stepping;
				m = ((o.curValue)/o.realValue) * p;
			}

			$(this.interaction.element).css(prop, m+'px');
			if(!changeslide && o.pickValue != o.curValue) $.ui.trigger('change', this.interaction, null, this.prepareCallbackObj(this.interaction));
			if(changeslide) $.ui.trigger('slide', this.interaction, null, this.prepareCallbackObj(this.interaction));

		}
	});

})($);
