(function($) {

	//Make nodes selectable by expression
	$.extend($.expr[':'], { resizable: "(' '+a.className+' ').indexOf(' ui-resizable ')" });
	
	$.fn.resizable = function(o) {
		return this.each(function() {
			if(!$(this).is(".ui-resizable")) new $.ui.resizable(this,o);	
		});
	}
	
	$.ui.resizable = function(element, options) {

		//Initialize needed constants
		var self = this;
		
		this.element = $(element);
		
		$.data(element, "ui-resizable", this);
		this.element.addClass("ui-resizable");
		
		//Prepare the passed options
		this.options = $.extend({
			proxy: "proxy",
			preventDefault: true,
			animate: false,
			duration: 'fast',
			easing: 'swing'
		}, options);
		
		//Force proxy if animate is enable
		this.options.proxy = this.options.animate ? "proxy" : this.options.proxy;

		var o = this.options;
		
		//Position the node
		if(!o.proxy && (this.element.css('position') == 'static' || this.element.css('position') == ''))
			this.element.css('position', 'relative');

		//Wrap the element if it cannot hold child nodes
		if(element.nodeName.match(/textarea|input|select|button|img/i)) {
			
			//Create a wrapper element and set the wrapper to the new current internal element
			this.element.wrap('<div class="ui-wrapper"  style="position: relative; width: '+this.element.outerWidth()+'px; height: '+this.element.outerHeight()+';"></div>');
			var oel = this.element; element = element.parentNode; this.element = $(element);
			
			//Move margins to the wrapper
			this.element.css({
				marginLeft: oel.css("marginLeft"),
				marginTop: oel.css("marginTop"),
				marginRight: oel.css("marginRight"),
				marginBottom: oel.css("marginBottom")
			});
			
			oel.css({ marginLeft: 0, marginTop: 0, marginRight: 0, marginBottom: 0});
			
			var b = [parseInt(oel.css('borderTopWidth')),parseInt(oel.css('borderRightWidth')),parseInt(oel.css('borderBottomWidth')),parseInt(oel.css('borderLeftWidth'))];
			
			//Prevent Safari textarea resize
			if ($.browser.safari && o.preventDefault) oel.css('resize', 'none');
			
			o.proportionallyResize = o.proportionallyResize || [];
			o.proportionallyResize.push(oel);
			
		} else {
			var b = [0,0,0,0];	
		}
		
		if(!o.handles) o.handles = !$('.ui-resizable-handle', element).length ? "e,s,se" : { n: '.ui-resizable-n', e: '.ui-resizable-e', s: '.ui-resizable-s', w: '.ui-resizable-w', se: '.ui-resizable-se', sw: '.ui-resizable-sw', ne: '.ui-resizable-ne', nw: '.ui-resizable-nw' };
		if(o.handles.constructor == String) {

			if(o.handles == 'all') o.handles = 'n,e,s,w,se,sw,ne,nw';
			var n = o.handles.split(","); o.handles = {};
			
			var insertions = {
				n: 'top: '+b[0]+'px;',
				e: 'right: '+b[1]+'px;'+(o.zIndex ? 'z-index: '+o.zIndex+';' : ''),
				s: 'bottom: '+b[1]+'px;'+(o.zIndex ? 'z-index: '+o.zIndex+';' : ''),
				w: 'left: '+b[3]+'px;',
				se: 'bottom: '+b[2]+'px; right: '+b[1]+'px;'+(o.zIndex ? 'z-index: '+o.zIndex+';' : ''),
				sw: 'bottom: '+b[2]+'px; left: '+b[3]+'px;',
				ne: 'top: '+b[0]+'px; right: '+b[1]+'px;',
				nw: 'top: '+b[0]+'px; left: '+b[3]+'px;'
			};
			
			for(var i=0; i<n.length;i++) {
				var dir = $.trim(n[i]);
				this.element.append("<div class='ui-resizable-"+dir+" ui-resizable-handle' style='"+insertions[dir]+"'></div>");
				o.handles[dir] = '.ui-resizable-'+dir;
			}

		}
		
		this._renderAxis = function() {
			for(var i in o.handles) {
				if(o.handles[i].constructor == String) o.handles[i] = $(o.handles[i], element).show();		
				if(!$(o.handles[i]).length) continue;
			}
		};
		
		this._applyAxisOffset = function(target) {
			target = target || this.element;
			
			for(var i in o.handles) {
				if(o.handles[i].constructor == String) o.handles[i] = $(o.handles[i], element).show();
				
				//Apply pad to wrapper element, needed to fix axis position (textarea, scrolls)
				if (this.element.is('.ui-wrapper')) {
					var axis = $(o.handles[i], element), padWrapper = 0;
					
					//Checking the correct pad
					padWrapper = axis.css(/sw|ne|nw|se|n|s/.test(i) ? 'height' : 'width');
					
					//The padding type i have to apply...
					var padPos = [ 'padding', 
						/ne|nw|n/.test(i) ? 'Top' :
						/se|sw|s/.test(i) ? 'Bottom' : 
						/^e$/.test(i) ? 'Right' : 'Left' ].join(""); 
					
					target.css(padPos, padWrapper);
				}
				
				if(!$(o.handles[i]).length) continue;
			}
		};
		
		this._renderAxis();
		this._applyAxisOffset(this.element);
	
		//Initialize mouse events for interaction
		this.element.mouseInteraction({
			executor: this,
			delay: 0,
			distance: 0,
			dragPrevention: ['input','textarea','button','select','option'],
			start: this.start,
			stop: this.stop,
			drag: this.drag,
			condition: function(e) {
				if(this.disabled) return false;
				for(var i in this.options.handles) {
					if($(this.options.handles[i])[0] == e.target) return true;
				}
				return false;
			}
		});
		
	}
	
	$.extend($.ui.resizable.prototype, {
		plugins: {},
		ui: function() {
			return {
				instance: this,
				axis: this.options.axis,
				options: this.options
			};			
		},
		_renderProxy: function() {
			var el = this.element;
			
			if(this.options.proxy) {
				this.offset = el.offset();
				this.helper = this.helper || $('<div></div>');
				
				this.helper.addClass(this.options.proxy).css({
					width: el.outerWidth(),
					height: el.outerHeight(),
					position: 'absolute',
					left: this.offset.left +'px',
					top: this.offset.top +'px'
				});
				
				this.helper.appendTo("body");
						
			} else {
				this.helper = el;	
			}
		},
		propagate: function(n,e) {
			$.ui.plugin.call(this, n, [e, this.ui()]);
			this.element.triggerHandler(n == "resize" ? n : "resize"+n, [e, this.ui()], this.options[n]);
		},
		destroy: function() {
			this.element.removeClass("ui-resizable ui-resizable-disabled").removeMouseInteraction();
		},
		enable: function() {
			this.element.removeClass("ui-resizable-disabled");
			this.disabled = false;
		},
		disable: function() {
			this.element.addClass("ui-resizable-disabled");
			this.disabled = true;
		},
		start: function(e) {
			
			var iniPos = this.element.position(), ele = this.element;
			
			if (ele.is('.ui-draggable') || /absolute/.test(ele.css('position')))
				ele.css({ position: 'absolute', top: iniPos['top'], left: iniPos['left'] });
			
			//Opera fixing relative position
			if (/relative/.test(ele.css('position')) && $.browser.opera)
				ele.css({ position: 'relative', top: 'auto', left: 'auto' });
			
			this._renderProxy();
			
			//Matching axis name
			if (e.target && e.target.className)
				var axis = e.target.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);
			
			//Axis, default = se
			this.options.axis = axis && axis[1] ? axis[1] : 'se';
			
			//Store needed variables
			$.extend(this.options, {
				currentSize: { width: this.element.outerWidth(), height: this.element.outerHeight() },
				currentSizeDiff: { width: this.element.outerWidth() - this.element.width(), height: this.element.outerHeight() - this.element.height() },
				startPosition: { left: e.pageX, top: e.pageY },
				currentPosition: {
					left: parseInt(this.helper.css('left')) || 0,
					top: parseInt(this.helper.css('top')) || 0
				}
			});
			
			this.propagate("start", e);		
			return false;
			
		},
		stop: function(e) {			
			var o = this.options;

			if(o.proxy) {
				var style = { 
				  width: this.helper.width() - o.currentSizeDiff.width,
				  height: this.helper.height() - o.currentSizeDiff.height,
				  top: (parseInt(this.element.css('top')) || 0) + (parseInt(this.helper.css('top')) - this.offset.top),
				  left: (parseInt(this.element.css('left')) || 0) + (parseInt(this.helper.css('left')) - this.offset.left)
				};
				
				if (o.animate) {
					$.extend(style, (typeof o.animate == 'object') ? o.animate : {} );
					this.element.animate(style, { duration: o.duration, easing: o.easing });					
				} else {
					this.element.css(style);
				}
				
				// TODO
				if (o.proportionallyResize && 
						o.proportionallyResize.constructor == Array) {
					
					var prTrigger = function(x, prel) {
						var b = [ parseInt(prel.css('borderTopWidth')), parseInt(prel.css('borderRightWidth')),	parseInt(prel.css('borderBottomWidth')), parseInt(prel.css('borderLeftWidth')) ];
						var p = [ parseInt(prel.css('paddingTop')), parseInt(prel.css('paddingRight')),	parseInt(prel.css('paddingBottom')), parseInt(prel.css('paddingLeft')) ];
						
						var diff = $.map(b, function(i){
							return b[i] + p[i]; 
						});
						
						console.log(diff);
						
						prel.css({ 
							width: this.element.outerWidth()  + "px",
							height: this.element.outerHeight() + "px",
							top: (parseInt(this.element.css('top')) || 0) + (parseInt(this.helper.css('top')) - this.offset.top), 
							left: (parseInt(this.element.css('left')) || 0) + (parseInt(this.helper.css('left')) - this.offset.left)
						});
						
						this._applyAxisOffset(prel);
						//prel.css({ marginLeft: 0, marginTop: 0, marginRight: 0, marginBottom: 0});
						//this._renderAxis();
						
					}, that = this;
					
					$.each(o.proportionallyResize, function(x, prel) {
						prTrigger.apply(that, [x, prel]);
					});
				}
				
				this.helper.remove();
			}
			
			this.propagate("stop", e);	
			return false;
			
		},
		drag: function(e) {

			var el = this.helper, o = this.options, props = {};
			
			var change = function(a,b) {
				//Parsing regex once, increase performance
				var isTopHeight = /(top|height)/.test(a); 
				
				//Avoid opera's syntax bug
				//Concatenation performance
				var	curSizePos = ['current', (/(height|width)/.test(a) ? 'Size' : 'Position')].join(""),
						pageAxis = ['page', (isTopHeight ? 'Y' : 'X')].join(""),
						startPos = (isTopHeight ? 'top' : 'left');
				
				var mod = (e[pageAxis] - o.startPosition[startPos]) * (b ? -1 : 1);
				
				el.css(a, o[curSizePos][a] - mod);
			};
			
			//Change the height
			if(/(n|ne|nw)/.test(o.axis)) change("height");
			if(/(s|se|sw)/.test(o.axis)) change("height", 1);
			
			//Measure the new height and correct against min/maxHeight
			var curheight = parseInt(el.css('height'));			
			if(o.minHeight && curheight <= o.minHeight) el.css('height', o.minHeight);  
			if(o.maxHeight && curheight >= o.maxHeight) el.css('height', o.maxHeight);
			
			//Change the top position when picking a handle at north
			if(/n|ne|nw/.test(o.axis)) change("top", 1);
			
			//Measure the new top position and correct against min/maxHeight
			var curtop = parseInt(el.css('top'));
			if(o.minHeight && curtop >= (o.currentPosition.top + (o.currentSize.height - o.minHeight))) el.css('top', (o.currentPosition.top + (o.currentSize.height - o.minHeight)));
			if(o.maxHeight && curtop <= (o.currentPosition.top + (o.currentSize.height - o.maxHeight))) el.css('top', (o.currentPosition.top + (o.currentSize.height - o.maxHeight)));


			//Change the width
			if(/(e|se|ne)/.test(o.axis)) change("width", 1);
			if(/(sw|w|nw)/.test(o.axis)) change("width");
			
			//Measure the new width and correct against min/maxWidth
			var curwidth = parseInt(el.css('width'));			
			if(o.minWidth && curwidth <= o.minWidth) el.css('width', o.minWidth);  
			if(o.maxWidth && curwidth >= o.maxWidth) el.css('width', o.maxWidth);
				
			//Change the left position when picking a handle at west
			if(/(sw|w|nw)/.test(o.axis)) change("left", 1);
			
			//Measure the new left position and correct against min/maxWidth
			var curleft = parseInt(el.css('left'));
			if(o.minWidth && curleft >= (o.currentPosition.left + (o.currentSize.width - o.minWidth))) el.css('left', (o.currentPosition.left + (o.currentSize.width - o.minWidth)));
			if(o.maxWidth && curleft <= (o.currentPosition.left + (o.currentSize.width - o.maxWidth))) el.css('left', (o.currentPosition.left + (o.currentSize.width - o.maxWidth)));
			
			this.propagate("resize", e);	
			return false;
			
		}
	});

})(jQuery);
