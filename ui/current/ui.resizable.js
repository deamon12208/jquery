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
		this.options = $.extend({}, options);
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
			this.element.css({ marginLeft: oel.css("marginLeft"), marginTop: oel.css("marginTop"), marginRight: oel.css("marginRight"), marginBottom: oel.css("marginBottom")});
			oel.css({ marginLeft: 0, marginTop: 0, marginRight: 0, marginBottom: 0});
			
			var b = [parseInt(oel.css('borderTopWidth')),parseInt(oel.css('borderRightWidth')),parseInt(oel.css('borderBottomWidth')),parseInt(oel.css('borderLeftWidth'))];

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
				this.element.append("<div class='ui-resizable-"+n[i]+" ui-resizable-handle' style='"+insertions[n[i]]+"'></div>");
				o.handles[n[i]] = '.ui-resizable-'+n[i];
			}

		}

		for(var i in o.handles) {
			if(o.handles[i].constructor == String) o.handles[i] = $(o.handles[i], element);
			if(!$(o.handles[i]).length) continue;
		}
	
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

			if(this.options.proxy) {
				this.offset = this.element.offset();
				this.helper = $('<div></div>').css({
						width: $(this.element).width(),
						height: $(this.element).height(),
						position: 'absolute',
						left: this.offset.left+'px',
						top: this.offset.top+'px'
					}).addClass(this.options.proxy).appendTo("body");	
			} else {
				this.helper = this.element;	
			}

			var axis = e.target.className.split(' ');
			for(var i=0; i<axis.length; i++) { if(axis[i] != "ui-resizable-handle") this.options.axis = axis[i].split('-')[2]; }

			//Store needed variables
			$.extend(this.options, {
				currentSize: { width: this.element.width(), height: this.element.height() },
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
			this.propagate("stop", e);		

			if(o.proxy) {
				this.element.css({ width: this.helper.css('width'), height: this.helper.css('height') });
				this.element.css({ top: (parseInt(this.element.css('top')) || 0) + (parseInt(this.helper.css('top')) - this.offset.top), left: (parseInt(this.element.css('left')) || 0) + (parseInt(this.helper.css('left')) - this.offset.left) });
				this.helper.remove();
			}
			
			return false;
			
		},
		drag: function(e) {

			var el = this.helper, o = this.options;
			var change = function(a,b) {
				var mod = (e['page'+(/(top|height)/.test(a) ? 'Y' : 'X')] - o.startPosition[(/(top|height)/.test(a) ? 'top' : 'left')]) * (b ? -1 : 1);
				el.css(a, o['current'+(/(height|width)/.test(a) ? 'Size' : 'Position')][a] - mod);
			};
			
			//Change the height
			if(/(n|ne|nw)/.test(o.axis)) change("height");
			if(/(s|se|sw)/.test(o.axis)) change("height", 1);
			
			//Measure the new height and correct against min/maxHeight
			var curheight = parseInt(el.css('height'));			
			if(o.minHeight && curheight <= o.minHeight) el.css('height', o.minHeight);  
			if(o.maxHeight && curheight >= o.maxHeight) el.css('height', o.maxHeight);
			
			//Change the top position when picking a handle at north
			if(/(n|ne|nw)/.test(o.axis)) change("top", 1);
			
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
