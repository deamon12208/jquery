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
		$.extend(options, o);
		$.extend(options, {
			axis: o.axis ? o.axis : (el.offsetWidth < el.offsetHeight ? 'vertical' : 'horizontal'),
			percent: 0,
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
		
		if (options.name)
			$.ui.add(options.name, 'slider', this); //Append to UI manager if a name exists as option
		
	}
	
	$.extend($.ui.slider.prototype, {
		currentTarget: null,
		lastTarget: null,
		prepareCallbackObj: function(self) {
			return {
				handle: self.helper,
				position: { left: self.pos[0], top: self.pos[1] },
				percent: self.percent,
				slider: self	
			}			
		},
		start: function(that, e) {
			
			var o = this.options;
			$.ui.trigger('start', this, e, that.prepareCallbackObj(this));
			
			return false;
						
		},
		stop: function(that, e) {			
			
			var o = this.options;
			$.ui.trigger('stop', this, e, that.prepareCallbackObj(this));

			return false;
			
		},
		drag: function(that, e) {

			var o = this.options;
			this.pos = [this.pos[0]-(o.cursorAt.left ? o.cursorAt.left : 0), this.pos[1]-(o.cursorAt.top ? o.cursorAt.top : 0)];
			
			if(o.axis == 'horizontal') var m = this.pos[0];
			if(o.axis == 'vertical')   var m = this.pos[1];
			
			
			var p = that.parentSize;
			var prop = that.prop;

			if(m < 0) m = 0;
			if(m > p) m = p;

			this.percent = (Math.round((m/p)*100));
			if(o.stepping) {
				this.percent = Math.round(this.percent/o.stepping)*o.stepping;
				m = ((this.percent)/100) * p;
			}
			
			$(this.element).css(prop, m+'px');
			
			$.ui.trigger('slide', this, e, that.prepareCallbackObj(this));
			return false;
			
		},
		goto: function(percent) {
			var o = this.interaction.options;
			
			var p = this.parentSize;
			var prop = this.prop;
			
			m = ((percent)/100) * p;
			
			$(this.interaction.element).css(prop, m+'px');

		}
	});

})($);
