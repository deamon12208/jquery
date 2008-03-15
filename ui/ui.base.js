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
	$.fn.remove = function(){ this.trigger("remove"); return old.call(this, arguments ); };

	
 })(jQuery);