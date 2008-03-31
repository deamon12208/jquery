;(function($) {

	$.fn.extend({
		spinner: function(options) {
			var args = Array.prototype.slice.call(arguments, 1);
			return this.each(function() {
				if (typeof options == "string") {
					var inst = $.data(this, "spinner");
					if(inst) inst[options].apply(inst, args);
				} else if(!$.data(this, "spinner"))
					new $.ui.spinner(this, options);
			});
		}
	});
	
	$.ui.spinner = function(element, options) {

		//Initialize needed constants
		var self = this;
		this.element = $(element).addClass("ui-spinner");
		$.data(element, "spinner", this);

		var o = this.options = $.extend({}, $.ui.spinner.defaults, options);
		this.element[0].value = this.options.start;
		
		var pickerHeight = this.element.innerHeight() / 2 - parseInt(this.element.css("borderTopWidth"),10) - 2;
		this.element
		.wrap("<div>")
		.parent()
			.css({
				position: this.element.css("position") == "static" ? "relative" : this.element.css("position"),
				left: this.element.css("left"),
				top: this.element.css("top"),
				width: this.element.outerWidth(),
				height: this.element.outerHeight()
			})
			.css("float", this.element.css("float"))
			.append('<div class="ui-spinner-up"></div>')
			.find("div.ui-spinner-up")
				.bind("mousedown", function() { if(!self.counter) self.counter = 1; self.mousedown(100, "up"); })
				.bind("mouseup", function(e) { self.counter = 0; if(self.timer) window.clearInterval(self.timer); self.element[0].focus(); self.propagate("change", e); })
				.css({ height: pickerHeight, top: parseInt(this.element.css("borderTopWidth"),10)+1, right: parseInt(this.element.css("borderRightWidth"),10)+1 })
			.end()
			.append('<div class="ui-spinner-down"></div>')
			.find("div.ui-spinner-down")
				.bind("mousedown", function() { if(!self.counter) self.counter = 1; self.mousedown(100, "down"); })
				.bind("mouseup", function(e) { self.counter = 0; if(self.timer) window.clearInterval(self.timer); self.element[0].focus(); self.propagate("change", e); })
				.css({ height: pickerHeight, bottom: parseInt(this.element.css("borderBottomWidth"),10)+1, right: parseInt(this.element.css("borderRightWidth"),10)+1 })
			.end()
		;
		
		this.element
		.bind("keydown", function(e) {
			if(!self.counter) self.counter = 1;
			self.keydown.call(self, e);
		})
		.bind("keyup", function(e) {
			self.counter = 0;
			self.cleanUp();
			self.propagate("change", e);
		})
		;
		
		$(element).bind("setData.spinner", function(event, key, value){
			self.options[key] = value;
		}).bind("getData.spinner", function(event, key){
			return self.options[key];
		});

		
	};
	
	$.extend($.ui.spinner.prototype, {
		plugins: {},
		constrain: function() {
			if(this.options.min != undefined && this.element[0].value < this.options.min) this.element[0].value = this.options.min;
			if(this.options.max != undefined && this.element[0].value > this.options.max) this.element[0].value = this.options.max;
		},
		cleanUp: function() {
			this.element[0].value = this.element[0].value.replace(/[^0-9\-]/g, '');
			this.constrain();
		},
		down: function(e) {
			if(isNaN(parseInt(this.element[0].value,10))) this.element[0].value = this.options.start;
			this.element[0].value -= (this.options.incremental && this.counter > 100 ? (this.counter > 200 ? 100 : 10) : 1) * this.options.stepping;
			this.constrain();
			if(this.counter) this.counter++;
			this.propagate("spin", e);
		},
		up: function(e) {
			if(isNaN(parseInt(this.element[0].value,10))) this.element[0].value = this.options.start;
			this.element[0].value = parseFloat(this.element[0].value) + (this.options.incremental && this.counter > 100 ? (this.counter > 200 ? 100 : 10) : 1) * this.options.stepping;
			this.constrain();
			if(this.counter) this.counter++;
			this.propagate("spin", e);
		},
		mousedown: function(i, d) {
			var self = this;
			i = i || 100;
			if(this.timer) window.clearInterval(this.timer);
			this.timer = window.setInterval(function() {
				self[d]();
				if(self.counter > 20) self.mousedown(20, d);
			}, i);
		},
		keydown: function(e) {
			if(e.keyCode == 38 || e.keyCode == 39) this.up(e);
			if(e.keyCode == 40 || e.keyCode == 37) this.down(e);
			if(e.keyCode == 36) this.element[0].value = this.options.min || this.options.start; //Home key goes to min, if defined, else to start
			if(e.keyCode == 35 && this.options.max != undefined) this.element[0].value = this.options.max; //End key goes to maximum
		},
		ui: function(e) {
			return {
				instance: this,
				options: this.options,
				element: this.element				
			};
		},
		propagate: function(n,e) {
			$.ui.plugin.call(this, n, [e, this.ui()]);
			return this.element.triggerHandler(n == "spin" ? n : "spin"+n, [e, this.ui()], this.options[n]);
		},
		destroy: function() {
			if(!$.data(this.element[0], 'spinner')) return;
			this.element
				.removeClass("ui-spinner ui-spinner-disabled")
				.removeData("spinner")
				.unbind(".spinner");
		},
		enable: function() {
			this.element.removeClass("ui-spinner-disabled");
			this.options.disabled = false;
		},
		disable: function() {
			this.element.addClass("ui-spinner-disabled");
			this.options.disabled = true;
		}
	});
	
	$.ui.spinner.defaults = {
		stepping: 1,
		start: 0,
		incremental: true
	};
	
})(jQuery);