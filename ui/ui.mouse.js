(function($) {

	$.fn.extend({
		mouseInteraction: function(o) {
			return this.each(function() {
				new $.ui.mouseInteraction(this, o);
			});
		},
		removeMouseInteraction: function(o) {
			return this.each(function() {
				if($.data(this, "ui-mouse"))
					$.data(this, "ui-mouse").destroy();
			});
		}
	});
	
	$.ui.mouseInteraction = function(element, options) {
	
		var self = this;
		this.element = element;
		$.data(this.element, "ui-mouse", this);
		this.options = $.extend({}, options);
		
		$(element).bind('mousedown.draggable', function() { return self.click.apply(self, arguments); });
		if($.browser.msie) $(element).attr('unselectable', 'on'); //Prevent text selection in IE
		
	};
	
	$.extend($.ui.mouseInteraction.prototype, {
		
		destroy: function() { $(this.element).unbind('mousedown.draggable'); },
		trigger: function() { return this.click.apply(this, arguments); },
		click: function(e) {
			
			if(
				   e.which != 1 //only left click starts dragging
				|| $.inArray(e.target.nodeName.toLowerCase(), this.options.dragPrevention || []) != -1 // Prevent execution on defined elements
				|| (this.options.condition && !this.options.condition.apply(this.options.executor || this, [e, this.element])) //Prevent execution on condition
			) return true;
			
			var self = this;
			var initialize = function() {
				self._MP = { left: e.pageX, top: e.pageY }; // Store the click mouse position
				$(document).bind('mouseup.draggable', function() { return self.stop.apply(self, arguments); });
				$(document).bind('mousemove.draggable', function() { return self.drag.apply(self, arguments); });
			};

			if(this.options.delay) {
				if(this.timer) clearInterval(this.timer);
				this.timer = setTimeout(initialize, this.options.delay);
			} else {
				initialize();
			}
			
			return false;
			
		},
		stop: function(e) {			
			
			var o = this.options;
			if(!this.initialized) return $(document).unbind('mouseup.draggable').unbind('mousemove.draggable');

			if(this.options.stop) this.options.stop.call(this.options.executor || this, e, this.element);
			$(document).unbind('mouseup.draggable').unbind('mousemove.draggable');
			this.initialized = false;
			return false;
			
		},
		drag: function(e) {

			var o = this.options;
			if ($.browser.msie && !e.button) return this.stop.apply(this, [e]); // IE mouseup check
			
			if(!this.initialized && (Math.abs(this._MP.left-e.pageX) >= o.distance || Math.abs(this._MP.top-e.pageY) >= o.distance)) {
				if(this.options.start) this.options.start.call(this.options.executor || this, e, this.element);
				this.initialized = true;
			} else {
				if(!this.initialized) return false;
			}

			if(o.drag) o.drag.call(this.options.executor || this, e, this.element);
			return false;
			
		}
	});

 })(jQuery);