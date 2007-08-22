(function($) {

	$.ui = { manager: {} };
	var m = $.ui.manager;
	
	$.extend($.ui, {
		is: function(e, t) {
			return $(e).is(".ui-"+t);
		},
		get: function(n, t) {
			return m[t] ? m[t][n] : [];	
		},
		add: function(n, t, w) {
			if(!m[t]) m[t] = {};
			m[t][n] ? m[t][n].push(w) : m[t][n] = [w];
			$(w.element).addClass("ui-"+t);
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
		destroy: function(n, t) {
			if(!m[t] || !m[t][n]) return false;
			for(var i=0;i<m[t][n].length;i++) {
				if(m[t][n][i].destroy) m[t][n].destroy();
				$.ui.remove(n, t, m[t][n][i]);
			}
			return true;	
		},
		enable: function(n, t) {
			if(!m[t] || !m[t][n]) return false;
			for(var i=0;i<m[t][n].length;i++) {
				if(m[t][n][i].enable) m[t][n][i].enable();
				$(m[t][n][i].element).removeClass("ui-"+t+"-disabled");
			}
			return true;	
		},
		disable: function(n, t) {
			if(!m[t] || !m[t][n]) return false;
			for(var i=0;i<m[t][n].length;i++) {
				if(m[t][n][i].disable) m[t][n][i].disable();
				$(m[t][n][i].element).addClass("ui-"+t+"-disabled");
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
	});
	
})(jQuery);