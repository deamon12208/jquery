(function($) {

	//If the UI scope is not available, add it
	$.ui = $.ui || {};
	
	//Add methods that are vital for all mouse interaction stuff (plugin registering)
	$.extend($.ui, {
		plugin: {
			add: function(module, option, set) {
				var proto = $.ui[module].prototype;
				for(var i in set) {
					proto.plugins[i] = proto.plugins[i] || [];
					proto.plugins[i].push([option, set[i]]);
				}
			},
			call: function(instance, name, arguments) {
				var set = instance.plugins[name]; if(!set) return;
				for (var i = 0; i < set.length; i++) {
					if (instance.options[set[i][0]]) set[i][1].apply(instance.element, arguments);
				}
			}	
		},
		cssCache: {},
		css: function(name) {
			if ($.ui.cssCache[name]) return $.ui.cssCache[name];
			
			var tmp = $('<div class="ui-resizable-gen">').addClass(name).css(
				{position:'absolute', top:'-5000px', left:'-5000px', display:'block'}
			).appendTo('body');
			
			//Opera and Safari set width and height to 0px instead of auto
			//Safari returns rgba(0,0,0,0) when bgcolor is not set
			$.ui.cssCache[name] = !!(
				((/^[1-9]/).test(tmp.css('height')) || (/^[1-9]/).test(tmp.css('width')) || 
				!(/none/).test(tmp.css('backgroundImage')) || !(/transparent|rgba\(0, 0, 0, 0\)/).test(tmp.css('backgroundColor')))
			);
			try { $('body').get(0).removeChild(tmp.get(0));	} catch(e){}
			return $.ui.cssCache[name];
		},
		disableSelection: function(e) {
			if (!e) return;
			e.unselectable = "on";
			e.onselectstart = function() {	return false; };
			if (e.style) e.style.MozUserSelect = "none";
		},
		enableSelection: function(e) {
			if (!e) return;
			e.unselectable = "off";
			e.onselectstart = function() { return true; };
			if (e.style) e.style.MozUserSelect = "";
		},
		hasScroll: function(e, a) {
      		var scroll = /top/.test(a||"top") ? 'scrollTop' : 'scrollLeft', has = false;
      		if (e[scroll] > 0) return true; e[scroll] = 1;
      		has = e[scroll] > 0 ? true : false; e[scroll] = 0;
      		return has; 
    	}
	});
	
	//Modify native plugins
	var old = $.fn.remove;
	$.fn.remove = function(){ this.trigger("remove"); return old.apply(this, arguments ); };

	// Create scrollLeft and scrollTop methods (if not coming from dimensions already)
	$.each( ['Left', 'Top'], function(i, name) {
		if(!$.fn['scroll'+name]) $.fn['scroll'+name] = function(v) {
			return v != undefined ?
				this.each(function() { this == window || this == document ? window.scrollTo(name == 'Left' ? v : $(window)['scrollLeft'](), name == 'Top'  ? v : $(window)['scrollTop']()) : this['scroll'+name] = v; }) :
				this[0] == window || this[0] == document ? self[(name == 'Left' ? 'pageXOffset' : 'pageYOffset')] || $.boxModel && document.documentElement['scroll'+name] || document.body['scroll'+name] : this[0][ 'scroll' + name ];
		};
	});
	
	//Create position() and offsetParent if not already coming from dimensions
	$.fn.extend({
		position: function() {
			var offset       = this.offset();
			var offsetParent = this.offsetParent();
			var parentOffset = offsetParent.offset();

			return {
				top:  offset.top - num(this[0], 'marginTop')  - parentOffset.top - num(offsetParent, 'borderTopWidth'),
				left: offset.left - num(this[0], 'marginLeft')  - parentOffset.left - num(offsetParent, 'borderLeftWidth')
			};
		},
		offsetParent: function() {
			var offsetParent = this[0].offsetParent;
			while ( offsetParent && (!/^body|html$/i.test(offsetParent.tagName) && $.css(offsetParent, 'position') == 'static') )
				offsetParent = offsetParent.offsetParent;
			return $(offsetParent);
		}
	});
	
	function num(el, prop) {
		return parseInt($.curCSS(el.jquery?el[0]:el,prop,true))||0;
	};
	
 })(jQuery);