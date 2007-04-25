
(function($) {
	$.interfaceTooltip = {
		helper: null,
		timer: null,
		delay: 300,
		hide: function(){
			$.interfaceTooltip.helper.hide();
		}
	};
	$.fn.tooltip = function(options) {
		
		options = $.extend({
			showDelay: function(e) {
				var ttContent = false;
				options.targetEl = $(this);
				$.interfaceTooltip.helper.stopAll().empty().attr('class','').attr('style','position: absolute;z-index: 300').hide();
				//reset visbility marker
				options.visible = false;
				//stop timer
				clearTimeout($.interfaceTooltip.timer);
				// if html it is passed then use it for content
				if (options.html) {
					ttContent = $(options.html);
				// if attribute it is passed then use its content
				} else if(options.attribute) {
					if (!options.restoreAttribute) {
						options.restoreAttribute = options.targetEl.attr(options.attribute);
						options.targetEl.removeAttr(options.attribute);
					}
					ttContent = $('<div>' + options.restoreAttribute + '</div>');
				}
				// if no content was defined so far then use the default title attribute
				if (ttContent === false) {
					if (!options.restoreAttribute) {
						options.restoreAttribute = options.targetEl.attr('title');
						options.targetEl.removeAttr('title');
					}
					var html = '<div class="title">' + options.restoreAttribute + '</div>';
					if (options.url) {
						var url = options.targetEl.attr('href');
						html += '<div class="url">' + url + '</div>';
					}
					ttContent = $(html);
				}
				//wrapp tooltip's content
				if(options.wrapper) {
					ttContent.wrap(options.wrapper);
				}
				// append content to tooltip
				ttContent.appendTo($.interfaceTooltip.helper.get(0));
				if (options.className) {
					$.interfaceTooltip.helper.addClass(options.className);
				}
				options.cursor = {
					x: e.pageX,
					y: e.pageY
				};
				// in case of trackking mouse movement then consider cursor as reference position
				if (options.track) {
					options.elPos = options.cursor;
					options.elSize = {wb: 0, hb: 0};
				// in case of trackking mouse movement then consider target elements as reference position
				} else {
					options.elPos = $.iUtil.getPosition(options.targetEl[0]);
					options.elSize = $.iUtil.getSize(options.targetEl[0]);
				}
				
				// define the timer for the delay
				$.interfaceTooltip.timer = setTimeout(options.show, options.delay);
				$.interfaceTooltip.delay = options.delay;
				return options.beforeShow.apply(this, [e]);
			},
			hideDelay: function(e) {
				// stop timer
				clearTimeout($.interfaceTooltip.timer);
				// define the timer for the delay
				$.interfaceTooltip.timer = setTimeout(options.hide, options.delay);
				return options.beforeHide.apply(this, [e]);
			},
			show: function() {
				//show tooltip now since the delay expired
				$.interfaceTooltip.helper.stopAll().show().css('visibility', 'hidden');
				// mark tooltip as visible
				options.visible = true;
				options.size = {
					w: $.interfaceTooltip.helper[0].offsetWidth,
					h: $.interfaceTooltip.helper[0].offsetHeight
				};
				// move to position
				options.positionTo();
				$.interfaceTooltip.helper.css('visibility', 'visible');
				return options.onShow.apply(this, [$.interfaceTooltip.helper[0]]);
			},
			hide: function() {
				// mark tooltip as hidden
				options.visible = false;
				$.interfaceTooltip.helper.hide();
				return options.onHide.apply(this, [$.interfaceTooltip.helper[0]]);
			},
			positionTo: function(pos) {
				//calculate position base on position setting
				switch (options.position) {
					case 'n':
						pos = {
							x: options.elPos.x - (options.size.w - options.elSize.wb)/2,
							y: options.elPos.y - options.size.h
						};
						break;
					case 'ne':
						pos = {
							x: options.elPos.x + options.elSize.wb,
							y: options.elPos.y - options.size.h
						};
						break;
					case 'e':
						pos = {
							x: options.elPos.x + options.elSize.wb,
							y: options.elPos.y - (options.size.h - options.elSize.hb)/2
						};
						break;
					case 'se':
						pos = {
							x: options.elPos.x + options.elSize.wb,
							y: options.elPos.y + options.elSize.hb
						};
						break;
					case 's':
						pos = {
							x: options.elPos.x - (options.size.w - options.elSize.wb)/2,
							y: options.elPos.y + options.elSize.hb
						};
						break;
					case 'sw':
						pos = {
							x: options.elPos.x - options.size.w,
							y: options.elPos.y + options.elSize.hb
						};
						break;
					case 'w':
						pos = {
							x: options.elPos.x - options.size.w,
							y: options.elPos.y - (options.size.h - options.elSize.hb)/2
						};
						break;
					case 'nw':
						pos = {
							x: options.elPos.x - options.size.w,
							y: options.elPos.y - options.size.h
						};
						break;
					default:
						pos = pos||options.cursor;
						break;
				}
				// add offset
				pos.x += options.offset.x;
				pos.y += options.offset.y;
				
				// calculate viewport's limits
				var clientScroll = $.iUtil.getScroll();
				var limits = {
					x: clientScroll.l,
					y: clientScroll.t
				};
				limits.w = limits.x + Math.min(clientScroll.w,clientScroll.iw) - options.size.w;
				limits.h = limits.y + Math.min(clientScroll.h,clientScroll.ih) - options.size.h;
				// get position based on limits
				/*pos.x = Math.max(limits.x, Math.min(pos.x, limits.w));
				pos.y = Math.max(limits.y, Math.min(pos.y, limits.h));*/
				
				if (pos.x < limits.x) {
					pos.x = options.elPos.x + options.elSize.wb + (options.elPos.x  - pos.x);
				} else if (pos.x > limits.w ) {
					pos.x = options.elPos.x - (pos.x - options.elPos.x) + options.size.w;
				}
				if (pos.y < limits.y) {
					pos.y = options.elPos.y + options.elSize.hb + (options.elPos.y  - pos.y);
				} else if (pos.y > limits.h ) {
					pos.y = options.elPos.y - (pos.y - options.elPos.y) + options.size.h;
				}
				
				//move tooltip
				$.interfaceTooltip.helper.css({
					left: pos.x + 'px',
					top: pos.y + 'px'
				});
			},
			trackMouse: function(e) {
				//mark cursor position
				options.elPos = {x: e.pageX , y: e.pageY };
				// position the tooltip
				options.positionTo(options.elPos);
			},
			beforeShow: function(e) {return;},
			beforeHide: function(e) {return;},
			onShow: function() {return;},
			onHide: function() {return;},
			attribute: false,
			url: false,
			html: false,
			delay: 0,
			event: false,
			position: 'mouse',
			size: {w: 0, h: 0},
			offset: {x: 18, y:18},
			track: false,
			wrapper: false,
			restoreAttribute: false,
			visible: false
		}, options||{});
		
		return this.each(function(){
			// change offset based on position
			switch (options.position) {
				case 'n':
					options.offset.x = 0;
					options.offset.y = - options.offset.y;
					break;
				case 'ne':
					options.offset.y = - options.offset.y;
					break;
				case 'e':
					options.offset.y = 0;
					break;
				case 'se':
					break;
				case 's':
					options.offset.x = 0;
					break;
				case 'sw':
					options.offset.x = - options.offset.x;
					break;
				case 'w':
					options.offset.y = 0;
					options.offset.x = - options.offset.x;
					break;
				case 'nw':
					options.offset.x = - options.offset.x;
					options.offset.y = - options.offset.y;
					break;
			}
			if (!$.interfaceTooltip.helper) {
				$('<div id="tooltip"></div>')
					.css({
						position: 'absolute',
						zIndex: 3000
					})
					.appendTo('body');
				$.interfaceTooltip.helper = $('#tooltip')
				.bind('mouseover', function(){clearTimeout($.interfaceTooltip.timer);})
				.bind('mouseout',function(){$.interfaceTooltip.timer = setTimeout($.interfaceTooltip.hide, $.interfaceTooltip.delay)});
			}
			if (options.event == 'click') {
				$(this).toggle(options.showDelay, options.hideDelay);
			} else {
				$(this).bind('mouseover', options.showDelay);
				$(this).bind('mouseout', options.hideDelay);
			}
			if (options.track) {
				$(this).bind('mousemove', options.trackMouse);
			}
		});
	};
	$.fn.tooltipSetContent = function(html){
		return this.each(function(){
			if (options.visible == true) {
				var ttContent = $(html);
				if (!ttContent) {
					ttContent = $('<div class="title">' + html + '</div>');
				}
				//wrapp tooltip's content
				if(options.wrapper) {
					ttContent.wrap(options.wrapper);
				}
				ttContent.appendTo($.interfaceTooltip.helper.get(0));
			}
		});
	};
	$.fn.tooltipShow = function(){
		return this.each(function(){
			if (options.event == 'click') {
				$(this).trigger('click', options.showDelay);
			} else {
				$(this).trigger('mouseover', options.showDelay);
			}
		});
	};
	$.fn.tooltipHide = function(){
		return this.each(function(){
			if (options.event == 'click') {
				$(this).trigger('click', options.hideDelay);
			} else {
				$(this).trigger('mouseout', options.hideDelay);
			}
		});
	};
	
})(jQuery);