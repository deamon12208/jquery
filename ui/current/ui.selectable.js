(function($)
{
	
	//Macros for external methods that support chaining
	var methods = "destroy,enable,disable,toggle".split(",");
	for(var i=0;i<methods.length;i++) {
		var cur = methods[i], f;
		eval('f = function() { var a = arguments; return this.each(function() { if(jQuery(this).is(".ui-selectable")) jQuery.data(this, "ui-selectable")["'+cur+'"](a); }); }');
		$.fn["selectable"+cur.substr(0,1).toUpperCase()+cur.substr(1)] = f;
	};

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
			filter: '*',
			tolerance: 'touch'
		};
		var o = o || {}; $.extend(options, o); //Extend and copy options
		this.element = el; var self = this; //Do bindings
		$.data(this.element, "ui-selectable", this);
		self.dragged = false;

		$.extend(options, {
			appendTo: 'body',
			helper: function() { return $(document.createElement('div')).css({border:'1px dotted black'}); },
			_start: function(h,p,c,t,e) {
				self.start.apply(t, [self, e]); // Trigger the start callback
			},
			_drag: function(h,p,c,t,e) {
				self.dragged = true;
				self.drag.apply(t, [self, e]); // Trigger the drag callback
			},
			_stop: function(h,p,c,t,e) {
				self.stop.apply(t, [self, e]); // Trigger the end callback
				self.dragged = false;
			}
		});

		//Initialize mouse interaction
		this.mouse = new $.ui.mouseInteraction(el, options);

		//Add the class for themeing
		$(this.element).addClass("ui-selectable");
		$(this.element).children(options.filter).addClass("ui-selectee");

	}

	$.extend($.ui.selectable.prototype, {
		toggle: function() {
			if(this.disabled){
				this.enable();
			} else {
				this.disable();
			}
		},
		destroy: function() {
			$(this.element).removeClass("ui-selectable").removeClass("ui-selectable-disabled");
			this.mouse.destroy();
		},
		enable: function() {
			$(this.element).removeClass("ui-selectable-disabled");
			this.disabled = false;
		},
		disable: function() {
			$(this.element).addClass("ui-selectable-disabled");
			this.disabled = true;
		},
		start: function(self, ev) {
			if (self.disabled)
				return;

			$(self.element).triggerHandler("selectablestart", [ev, {
				selectable: self.element,
				options: this.options
			}], this.options.start);

			self.childBoxes = []; // reset the child info
			$(this.options.filter, self.element).each(function() {
				var el = $(this), pos = el.offset();
				self.childBoxes.push([this,
						      pos.left, pos.left + el.width(),
						      pos.top, pos.top + el.height()]);
			});

			$(self.mouse.helper).css({'z-index': 100, position: 'absolute', left: ev.clientX, top: ev.clientY, width:0, height: 0});
			if (ev.ctrlKey) {
				if ($(ev.target).is('.ui-selected')) {
					$(ev.target).removeClass('ui-selected').addClass('ui-unselecting');
					$(self.element).triggerHandler("selectableunselecting", [ev, {
						selectable: self.element,
						unselecting: ev.target,
						options: this.options
					}], this.options.unselecting);
				}
			} else {
				self.unselecting(self, ev, this.options);
			}
		},
		childBoxes: [],
		drag: function(self, ev) {

			if (self.disabled)
				return;

			var x1 = self.mouse.opos[0], y1 = self.mouse.opos[1], x2 = ev.pageX, y2 = ev.pageY;
			if (x1 > x2) { var tmp = x2; x2 = x1; x1 = tmp; }
			if (y1 > y2) { var tmp = y2; y2 = y1; y1 = tmp; }
			$(self.mouse.helper).css({left: x1, top: y1, width: x2-x1, height: y2-y1});

			for (var i=0, len=self.childBoxes.length; i<len; i++) {
				var box = self.childBoxes[i], hit = false;
				var bL = box[1], bR = box[2], bT = box[3], bB = box[4];

				if (this.options.tolerance == 'touch') {
					hit = ( !(bL > x2 || bR < x1 || bT > y2 || bB < y1) );
				} else if (this.options.tolerance == 'fit') {
					hit = (bL > x1 && bR < x2 && bT > y1 && bB < y2);
				}
				if (hit) {
					self.selecting(self, ev, this.options, box[0]);
				} else {
					self.unselecting(self, ev, this.options, box[0]);
				}
			}

		},
		stop: function(self, ev) {

			var options = this.options;

			$('.ui-unselecting', self.element).each(function() {
				$(this).removeClass('ui-unselecting');
				$(self.element).triggerHandler("selectableunselected", [ev, {
					selectable: self.element,
					unselected: this,
					options: options
				}], options.unselected);
			});
			$('.ui-selecting', self.element).each(function() {
				$(this).removeClass('ui-selecting').addClass('ui-selected');
				$(self.element).triggerHandler("selectableselected", [ev, {
					selectable: self.element,
					selected: this,
					options: options
				}], options.selected);
			});
			$(self.element).triggerHandler("selectablestop", [ev, {
				selectable: self.element,
				options: this.options
			}], this.options.stop);
		},
		selecting: function(self, ev, options, selectee) {
			if ($(selectee).is('.ui-selectee:not(.ui-selecting)')) {
				$(selectee).removeClass('ui-selected').removeClass('ui-unselecting').addClass('ui-selecting');
				$(self.element).triggerHandler("selectableselecting", [ev, {
					selectable: self.element,
					selecting: selectee,
					options: options
				}], options.selecting);
			}
		},
		unselecting: function(self, ev, options, selectee) {
			if ($(selectee).is('.ui-selected') || $(selectee).is('.ui-selecting')) {
				$(selectee).removeClass('ui-selected').removeClass('ui-selecting').addClass('ui-unselecting');
				$(self.element).triggerHandler("selectableunselecting", [ev, {
					selectable: self.element,
					unselecting: selectee,
					options: options
				}], options.unselecting);
			}
		}
	});
	
})(jQuery);