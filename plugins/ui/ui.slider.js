(function($) {

	
	//Web Forms 2.0
	if($.ui.webforms) {
		$(document).ready(function() {
			
			$("input").each(function() {
				if(this.getAttribute("type") == "range") {
					var cur = $(this);
					var slider = $("<div class='ui-slider'></div>").css({ width: cur.innerWidth()+"px", height: cur.innerHeight()+"px" }).insertAfter(cur);
					var handle = $("<div class='ui-slider-handle'></div>").appendTo(slider);


					slider.css({
						"position": cur.css("position") == "absolute" ? "absolute" : "relative",
						"left": cur.css("left"),
						"right": cur.css("right"),
						"zIndex": cur.css("zIndex"),
						"float": cur.css("float"),
						"clear": cur.css("clear")
					});
					cur.css({ position: "absolute", opacity: 0, top: "-1000px", left: "-1000px" });
					
					var name = (new Date()).getTime()+Math.random();
					slider.slider({
						maxValue: cur.attr("max"),
						minValue: cur.attr("min"),
						startValue: this.getAttribute("value"),
						stepping: cur.attr("step"),
						change: function(e, ui) { cur[0].value = ui.value; cur[0].setAttribute("value", ui.value); },
						name: name
					});
					slider = $.ui.get(name, "slider")[0];
					
					cur.bind("keydown", function(e) {
						var o = slider.interaction.options;
						switch(e.keyCode) {
							case 37:
								slider.goto(o.curValue+o.minValue-(o.stepping || 1));
								break;
							case 39:
								slider.goto(o.curValue+o.minValue+(o.stepping || 1));
								break;	
						}
						if(e.keyCode != 9) return false;
					});
					
				};	
			});
				
		});
	}
	
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
			maxValue: parseInt(o.maxValue) ? parseInt(o.maxValue) : 100,
			minValue: parseInt(o.minValue) ? parseInt(o.minValue) : 0,
			curValue: parseInt(o.startValue) ? parseInt(o.startValue) : 0,
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
		o.stepping = parseInt(o.stepping) ? parseInt(o.stepping) : (o.steps ? o.maxValue/o.steps : 0);
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
		if(!isNaN(o.curValue)) this.goto(o.curValue,options.realValue, null, false);
		
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
		goto: function(value,scale,changeslide,p) {
			var o = this.interaction.options;
			var offset = $(this.interaction.element).offsetParent().offset({ border: false });
			o.pickValue = o.curValue;
			value = value-o.minValue;
			
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
			if(!changeslide && o.pickValue != o.curValue && !p) $.ui.trigger('change', this.interaction, null, this.prepareCallbackObj(this.interaction));
			if(changeslide) $.ui.trigger('slide', this.interaction, null, this.prepareCallbackObj(this.interaction));

		}
	});

})($);
