(function($)
{
	
	//Make nodes selectable by expression
	$.extend($.expr[':'], { selectable: "(' '+a.className+' ').indexOf(' ui-selectable ')" });
	$.extend($.expr[':'], { selectee: "(' '+a.className+' ').indexOf(' ui-selectee ')" });

	$.fn.selectable = function(o) {
		return this.each(function() {
			if (!$(this).is(".ui-selectable")) new $.ui.selectable(this, o);
		});
	}

	$.ui.selectable = function(el, o) {
		
		var options = {
			filter: '*'
		};
		var o = o || {}; $.extend(options, o); //Extend and copy options
		this.element = el; var self = this; //Do bindings

		$.extend(options, {
			helper: function() { return $(document.createElement('div')).css({border:'1px dotted black'}); },
			_start: function(h,p,c,t,e) {
				self.start.apply(t, [self, e]); // Trigger the start callback
			},
			_drag: function(h,p,c,t,e) {
				self.drag.apply(t, [self, e]); // Trigger the drag callback
			}
		});

		//Initialize mouse interaction
		this.mouse = new $.ui.mouseInteraction(el, options);

		//Add the class for themeing
		$(this.element).addClass("ui-selectable").css({cursor:'default'});
		$(this.element).children(options.filter).addClass("ui-selectee");

		$(this.element).mouseup(function(ev) {
			self.selectTarget(self, ev, options);
		});

	}

	$.extend($.ui.selectable.prototype, {
		plugins: {},
		prepareCallbackObj: function(self) {
			return {
				selectable: self,
				options: self.options
			}
		},
		start: function(self, ev) {
			$(self.element).triggerHandler("selectablestart", [ev, self.prepareCallbackObj(this)], this.options.start);
			$(self.mouse.helper).css({position: 'absolute', left:self.mouse.opos[0], top:self.mouse.opos[1], width:0, height: 0});
			self.selectTarget(self, ev, this.options);
			return false;
		},
		drag: function(self, ev) {
			var x1 = self.mouse.opos[0], y1 = self.mouse.opos[1], x2 = ev.pageX, y2 = ev.pageY;
			if (x1 > x2) { var tmp = x2; x2 = x1; x1 = tmp; }
			if (y1 > y2) { var tmp = y2; y2 = y1; y1 = tmp; }
			$(self.mouse.helper).css({left: x1, top: y1, width: x2-x1, height: y2-y1});
			self.andSelectTarget(self, ev, this.options);
		},
		unselect: function(self, ev, options) {
			$('.ui-selected', self.element).each(function() {
				if (this != ev.target) {
					$(this).removeClass('ui-selected');
					$(self.element).triggerHandler("selectableselect", [ev, {
						selectable: self.element,
						unselected: this,
						options: options
					}], options.unselect);
				}
			});
		},
		selectTarget: function(self, ev, options) {
			self.unselect(self, ev, options);
			self.andSelectTarget(self, ev, options);
		},
		andSelectTarget: function(self, ev, options) {
			var target = $(ev.target);
			if (target.is('.ui-selectee:not(.ui-selected)')) {
				target.addClass('ui-selected');
				$(self.element).triggerHandler("selectableselect", [ev, {
					selectable: self.element,
					selected: target,
					options: options
				}], options.select);
			}
		}
	});
	
})(jQuery);