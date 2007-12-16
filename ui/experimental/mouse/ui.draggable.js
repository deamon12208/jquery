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
			distance: o.preventionDistance || 0,
			dragPrevention: o.dragPrevention ? o.dragPrevention.toLowerCase().split(',') : ['input','textarea','button','select','option'],
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

			this.offsetParent = (function(cp) {
				while(cp) {
					if(cp.style && /(absolute|relative|fixed)/.test($.css(cp,'position'))) return $(cp);
					cp = cp.parentNode ? cp.parentNode : null;
				}; return $("body");		
			})(this.helper[0].parentNode);

			//We generate a offset that will be later subtracted from pageX/Y
			if(this.helper.css('position') == 'relative') {
				this.offset = {
					left: e.pageX - (parseInt(this.helper.css('left')) || 0),
					top: e.pageY - (parseInt(this.helper.css('top')) || 0)
				};
			} else {
				this.elementPosition = this.element.position();
				this.offset = {
					left: e.pageX - this.elementPosition.left - this.offsetParent[0].scrollLeft,
					top: e.pageY - this.elementPosition.top - this.offsetParent[0].scrollTop
				};
			}

			$.ui.plugin.call(this, 'start', [e]);
			this.element.triggerHandler("dragstart", [e], o.start);
			
			if (this.slowMode && $.ui.ddmanager && !o.dropBehaviour)
				$.ui.ddmanager.prepareOffsets(this, e);

			this.helperProportions = { width: this.helper.outerWidth(), height: this.helper.outerHeight() };
			return false;
						
		},
		stop: function(that, e) {			
			
			var o = this.options;
			
			$.ui.plugin.call(this, 'stop', [e]);
			this.element.triggerHandler("dragstop", [e], o.stop);

			if (this.slowMode && $.ui.ddmanager && !o.dropBehaviour)
				$.ui.ddmanager.drop(this, e);

			if(o.helper != 'original' && !this.cancelHelperRemoval)
				this.helper.remove();
			
			if($.ui.ddmanager) {
				$.ui.ddmanager.current = null;
				$.ui.ddmanager.last = this;				
			}
			this.helper = null; this.offset = null; this.positionCurrent = null;

			return false;
			
		},
		drag: function(e) {

			var o = this.options;

			//Compute the helpers position
			this.position = { top: e.pageY - this.offset.top, left: e.pageX - this.offset.left };

			$.ui.plugin.call(this, 'drag', [e]);
			this.element.triggerHandler("drag", [e], o.drag);
			
			this.helper.css({ left: this.position.left+'px', top: this.position.top+'px' }); // Stick the helper to the cursor
			if($.ui.ddmanager) $.ui.ddmanager.drag(this, e);
			return false;
			
		}
	});

})(jQuery);
