$.ui = {
	manager: {},
	get: function(n, t) {
		return $.ui.manager[t] ? $.ui.manager[t][n] : null;	
	},
	add: function(n, t, w) {
		var a = $.ui.manager; if(!a[t]) a[t] = {};
		a[t][n] ? a[t][n].push(w) : a[t][n] = [w];
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
	trigger: function(n, s, e, p) {
		var o = s.options;
		if(!o[n]) return false;
		
		var a = { options: s.options }; $.extend(a, p);
		return o[n].apply(s.element, [e, a]);
	},
	num: function(e, p) {
		return parseInt($.css(e.jquery?e[0]:e,p))||0;
	},
	webforms: true
}