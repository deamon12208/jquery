(function($) {

	//Make nodes selectable by expression
	$.extend($.expr[':'], { draggable: "(' '+a.className+' ').indexOf(' ui-draggable ')" });

	$.fn.draggable = function(o) {
		return this.each(function() {
			if(!$(this).is(".ui-draggable")) new $.ui.draggable(this, o);
		});
	}
	
	$.ui.draggable = function(element, options) {
		
		//Initialize needed constants
		var self = this;
		this.element = $(element);
		$.data(element, "ui-draggable", this);
		this.element.addClass("ui-draggable");
		
		//Prepare the passed options
		this.options = $.extend({}, options);
		var o = this.options;
		$.extend(o, {
			helper: o.ghosting == true ? 'clone' : (o.helper || 'original'),
			handle : o.handle ? ($(o.handle, element)[0] ? $(o.handle, element) : this.element) : this.element,
			appendTo: o.appendTo || 'parent'		
		});
		
		//Initialize mouse events for interaction
		$(o.handle).mouseInteraction({
			executor: this,
			delay: o.delay,
			distance: o.distance || 0,
			dragPrevention: o.prevention ? o.prevention.toLowerCase().split(',') : ['input','textarea','button','select','option'],
			start: this.start,
			stop: this.stop,
			drag: this.drag,
			condition: function(e) { return !(e.target.className.indexOf("ui-resizable-handle") != -1 || self.disabled); }
		});
		
		//Position the node
		if(o.helper == 'original' && (this.element.css('position') == 'static' || this.element.css('position') == ''))
			this.element.css('position', 'relative');
		
	}
	
	$.extend($.ui.draggable.prototype, {
		plugins: {},
		ui: function(e) {
			return {
				helper: this.helper,
				position: { left: this.position, top: this.position },
				absolutePosition: this.positionAbs,
				instance: this,
				options: this.options					
			};
		},
		propagate: function(n,e) {
			$.ui.plugin.call(this, n, [e, this.ui()]);
			this.element.triggerHandler(n == "drag" ? n : "drag"+n, [e, this.ui()], this.options[n]);
		},
		destroy: function() {
			this.element.removeClass("ui-draggable ui-draggable-disabled");
			this.handle.removeMouseInteraction();
		},
		enable: function() {
			this.element.removeClass("ui-draggable-disabled");
			this.disabled = false;
		},
		disable: function() {
			this.element.addClass("ui-draggable-disabled");
			this.disabled = true;
		},
		start: function(e) {
			
			var o = this.options;
			if($.ui.ddmanager) $.ui.ddmanager.current = this;
			
			//Create and append the visible helper
			this.helper = typeof o.helper == 'function' ? $(o.helper.apply(this.element[0], [e])) : (o.helper == 'clone' ? this.element.clone().appendTo((o.appendTo == 'parent' ? this.element[0].parentNode : o.appendTo)) : this.element);
			if(this.helper[0] != this.element[0]) this.helper.css('position', 'absolute');

			//Find out the next positioned parent
			var offsetParent = (function(cp) {
				while(cp) {
					if(cp.style && /(absolute|relative|fixed)/.test($.css(cp,'position'))) return $(cp);
					cp = cp.parentNode ? cp.parentNode : null;
				}; return $("body");		
			})(this.helper[0].parentNode);
			
			//Prepare variables for position generation
			this.elementOffset = this.element.offset();
			this.clickOffset = { left: e.pageX - this.elementOffset.left, top: e.pageY - this.elementOffset.top };
			var elementPosition = this.element.position();
			var r = this.helper.css('position') == 'relative';
			
			//Generate a flexible offset that will later be subtracted from e.pageX/Y
			this.offset = {
				left: e.pageX - (r ? parseInt(this.helper.css('left')) || 0 : elementPosition.left + offsetParent[0].scrollLeft),
				top: e.pageY - (r ? parseInt(this.helper.css('top')) || 0 : elementPosition.top + offsetParent[0].scrollTop)
			};

			//Call plugins and callbacks
			this.propagate("start", e);

			this.helperProportions = { width: this.helper.outerWidth(), height: this.helper.outerHeight() };
			if (this.slowMode && $.ui.ddmanager && !o.dropBehaviour) $.ui.ddmanager.prepareOffsets(this, e);
			return false;
						
		},
		stop: function(e) {

			//Call plugins and callbacks
			this.propagate("stop", e);

			if (this.slowMode && $.ui.ddmanager && !this.options.dropBehaviour) $.ui.ddmanager.drop(this, e);
			if(this.options.helper != 'original' && !this.cancelHelperRemoval) this.helper.remove();
			
			if($.ui.ddmanager) {
				$.ui.ddmanager.current = null;
				$.ui.ddmanager.last = this;				
			}
			this.helper = null; this.offset = null; this.positionCurrent = null;
			return false;
			
		},
		drag: function(e) {

			//Compute the helpers position
			this.position = { top: e.pageY - this.offset.top, left: e.pageX - this.offset.left };
			this.positionAbs = { left: e.pageX + this.clickOffset.left, top: e.pageY + this.clickOffset.top };

			//Call plugins and callbacks
			this.propagate("drag", e);
			
			this.helper.css({ left: this.position.left+'px', top: this.position.top+'px' }); // Stick the helper to the cursor
			if($.ui.ddmanager) $.ui.ddmanager.drag(this, e);
			return false;
			
		}
	});

})(jQuery);
