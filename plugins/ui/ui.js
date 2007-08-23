(function($) {

	$.ui = { manager: {} };
	var m = $.ui.manager;
	
	$.extend($.ui, {
		register: function(o) {
			if(o.state) { //if there is certain element state available, add a expression for selecting
				var o2 = {}; o2[o.state] = "a.className.match(/(?:^|\s+)ui-"+o.name+"(?:\s+|$)/)";
				$.extend($.expr[':'], o2);
			}
		},
		is: function(el, type) {
			return $(el).is(".ui-"+type);
		},
		get: function(name, type) {
			return m[type] ? m[type][name] : [];	
		},
		add: function(name, type, instance) {
			m[type] = m[type] || {}; 
			m[type][name] ? m[type][name].push(instance) : m[type][name] = [instance];
			$(instance.element).addClass("ui-"+type);
		},
		remove: function(n, t, w) {
			if(!m[t] || !m[t][n]) return false;
			for(var i=0;i<m[t][n].length;i++) {
				if(m[t][n][i] != w) continue;
				$(m[t][n][i].element).removeClass("ui-"+t);
				m[t][n].splice(i,1);
				return true;
			}
		},
		destroy: function(name, type) {
			return $.ui._execute(name, type, "destroy", function(e) { $.ui.remove(name, type, e); });
		},
		enable: function(name, type) {
			return $.ui._execute(name, type, "enable", function(e) { $(e.element).removeClass("ui-"+type+"-disabled"); });	
		},
		disable: function(name, type) {
			return $.ui._execute(name, type, "disable", function(e) { $(e.element).addClass("ui-"+type+"-disabled"); });
		},
		_execute: function(name, type, func, callback) {
			if(!m[type] || !m[type][name]) return false;
			for(var i=0;i<m[type][name].length;i++) {
				if(m[type][name][i][func]) m[type][name][i][func]();
				if(callback) callback(m[type][name][i]);
			}
			return true;
		},
		plugin: {
			add: function(w, c, o, p) {
				var a = $.ui[w].prototype; if(!a.plugins[c]) a.plugins[c] = [];
				a.plugins[c].push([o,p]);
			},
			call: function(t, a, b) {
				var c = a.plugins[t]; if(!b) b = a;
				if(!c) return;
				
				for (var i = 0; i < c.length; i++) {
					if (b.options[c[i][0]]) c[i][1].call(b, a, b.options);
				}	
			}	
		},
		trigger: function(name, s, e, p) {
			var o = s.options;
			if(!o[name]) return false;
			
			var a = { options: s.options }; $.extend(a, p);
			return o[name].apply(s.element, [e, a]);
		},
		num: function(e, p) {
			return parseInt($.css(e.jquery?e[0]:e,p))||0;
		},
		webforms: true
	});
	
})(jQuery);