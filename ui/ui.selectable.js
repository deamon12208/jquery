(function($) {

	//If the UI scope is not available, add it
	$.ui = $.ui || {};

	//Make nodes selectable by expression
	$.extend($.expr[':'], { selectable: "(' '+a.className+' ').indexOf(' ui-selectable ')" });
	$.extend($.expr[':'], { selectee: "(' '+a.className+' ').indexOf(' ui-selectee ')" });

	$.fn.extend({
		selectable: function(options) {
			return this.each(function() {
				if (typeof options == "string") {
					var select = $.data(this, "ui-selectable");
					select[options].apply(select, args);

				} else if(!$.data(this, "ui-selectable"))
					new $.ui.selectable(this, options);
			});
		}
	});

	$.ui.selectable = function(element, options) {
		var self = this;
		
		this.element = $(element);
		
		$.data(this.element, "ui-selectable", this);
		this.element.addClass("ui-selectable");
		
		this.options = $.extend({
			appendTo: 'body',
			autoRefresh: true,
			filter: '*',
			tolerance: 'touch'
		}, options, {
			helper: function() {
				return $(document.createElement('div')).css({border:'1px dotted black'});
			},
			_start: function(h,p,c,t,e) {
				// Trigger the start callback
				self.start.apply(t, [self, e]);
			},
			_drag: function(h,p,c,t,e) {
				self.dragged = true;
				// Trigger the drag callback
				self.drag.apply(t, [self, e]);
			},
			_stop: function(h,p,c,t,e) {
				// Trigger the end callback
				self.stop.apply(t, [self, e]); 
				self.dragged = false;
			}
		});
		
		$(element).bind("setData.selectable", function(event, key, value){
			self.options[key] = value;
		}).bind("getData.selectable", function(event, key){
			return self.options[key];
		});
		
		this.dragged = false;

		// cache selectee children based on filter
		var selectees;
		this.refresh = function() {
			selectees = $(options.filter, self.element);
			selectees.each(function() {
				var $this = $(this);
				var pos = $this.offset();
				$.data(this, "ui-selectee", {
					element: this,
					$element: $this,
					left: pos.left,
					top: pos.top,
					right: pos.left + $this.width(),
					bottom: pos.top + $this.height(),
					startselected: false,
					selected: $this.hasClass('ui-selected'),
					selecting: $this.hasClass('ui-selecting'),
					unselecting: $this.hasClass('ui-unselecting')
				});
			});
		}
		this.refresh();

		this.selectees = selectees.addClass("ui-selectee");

		//Initialize mouse interaction
		this.mouse = new $.ui.mouseInteraction(el, options);
	};

	$.extend($.ui.selectable.prototype, {
		toggle: function() {
			if(this.disabled){
				this.enable();
			} else {
				this.disable();
			}
		},
		destroy: function() {
			this.element
				.removeClass("ui-selectable ui-selectable-disabled")
				.removeData("ui-selectable")
				.unbind(".selectable");
			this.mouse.destroy();
		},
		enable: function() {
			this.element.removeClass("ui-selectable-disabled");
			this.disabled = false;
		},
		disable: function() {
			this.element.addClass("ui-selectable-disabled");
			this.disabled = true;
		},
		start: function(self, ev) {
			if (self.disabled)
				return;

			var options = this.options;

			self.selectees = $(options.filter, self.element);

			// selectable START callback
			$(self.element).triggerHandler("selectablestart", [ev, {
				"selectable": self.element,
				"options": options
			}], options.start);

			// position helper (lasso)
			$(self.mouse.helper).css({
				"z-index": 100,
				"position": "absolute",
				"left": ev.clientX,
				"top": ev.clientY,
				"width": 0,
				"height": 0
			});

			if (options.autoRefresh) {
				self.refresh();
			}

			self.selectees.filter('.ui-selected').each(function() {
				var selectee = $.data(this, "ui-selectee");
				selectee.startselected = true;
				if (!ev.ctrlKey) {
					selectee.$element.removeClass('ui-selected');
					selectee.selected = false;
					selectee.$element.addClass('ui-unselecting');
					selectee.unselecting = true;
					// selectable UNSELECTING callback
					$(self.element).triggerHandler("selectableunselecting", [ev, {
						selectable: self.element,
						unselecting: selectee.element,
						options: options
					}], options.unselecting);
				}
			});
		},
		drag: function(self, ev) {
			if (self.disabled)
				return;

			var options = this.options;

			var x1 = self.mouse.opos[0], y1 = self.mouse.opos[1], x2 = ev.pageX, y2 = ev.pageY;
			if (x1 > x2) { var tmp = x2; x2 = x1; x1 = tmp; }
			if (y1 > y2) { var tmp = y2; y2 = y1; y1 = tmp; }
			$(self.mouse.helper).css({left: x1, top: y1, width: x2-x1, height: y2-y1});

			self.selectees.each(function() {
				var selectee = $.data(this, "ui-selectee");
				//prevent helper from being selected if appendTo: selectable
				if (selectee.element == self.mouse.helper)
					return;
				var hit = false;
				if (options.tolerance == 'touch') {
					hit = ( !(selectee.left > x2 || selectee.right < x1 || selectee.top > y2 || selectee.bottom < y1) );
				} else if (options.tolerance == 'fit') {
					hit = (selectee.left > x1 && selectee.right < x2 && selectee.top > y1 && selectee.bottom < y2);
				}

				if (hit) {
					// SELECT
					if (selectee.selected) {
						selectee.$element.removeClass('ui-selected');
						selectee.selected = false;
					}
					if (selectee.unselecting) {
						selectee.$element.removeClass('ui-unselecting');
						selectee.unselecting = false;
					}
					if (!selectee.selecting) {
						selectee.$element.addClass('ui-selecting');
						selectee.selecting = true;
						// selectable SELECTING callback
						$(self.element).triggerHandler("selectableselecting", [ev, {
							selectable: self.element,
							selecting: selectee.element,
							options: options
						}], options.selecting);
					}
				} else {
					// UNSELECT
					if (selectee.selecting) {
						if (ev.ctrlKey && selectee.startselected) {
							selectee.$element.removeClass('ui-selecting');
							selectee.selecting = false;
							selectee.$element.addClass('ui-selected');
							selectee.selected = true;
						} else {
							selectee.$element.removeClass('ui-selecting');
							selectee.selecting = false;
							if (selectee.startselected) {
								selectee.$element.addClass('ui-unselecting');
								selectee.unselecting = true;
							}
							// selectable UNSELECTING callback
							$(self.element).triggerHandler("selectableunselecting", [ev, {
								selectable: self.element,
								unselecting: selectee.element,
								options: options
							}], options.unselecting);
						}
					}
					if (selectee.selected) {
						if (!ev.ctrlKey && !selectee.startselected) {
							selectee.$element.removeClass('ui-selected');
							selectee.selected = false;

							selectee.$element.addClass('ui-unselecting');
							selectee.unselecting = true;
							// selectable UNSELECTING callback
							$(self.element).triggerHandler("selectableunselecting", [ev, {
								selectable: self.element,
								unselecting: selectee.element,
								options: options
							}], options.unselecting);
						}
					}
				}
			});
		},
		stop: function(self, ev) {
			var options = this.options;

			$('.ui-unselecting', self.element).each(function() {
				var selectee = $.data(this, "ui-selectee");
				selectee.$element.removeClass('ui-unselecting');
				selectee.unselecting = false;
				selectee.startselected = false;
				$(self.element).triggerHandler("selectableunselected", [ev, {
					selectable: self.element,
					unselected: selectee.element,
					options: options
				}], options.unselected);
			});
			$('.ui-selecting', self.element).each(function() {
				var selectee = $.data(this, "ui-selectee");
				selectee.$element.removeClass('ui-selecting').addClass('ui-selected');
				selectee.selecting = false;
				selectee.selected = true;
				selectee.startselected = true;
				$(self.element).triggerHandler("selectableselected", [ev, {
					selectable: self.element,
					selected: selectee.element,
					options: options
				}], options.selected);
			});
			$(self.element).triggerHandler("selectablestop", [ev, {
				selectable: self.element,
				options: this.options
			}], this.options.stop);
		}
	});
	
})(jQuery);