$.ui = {
	manager: {},
	get: function(n, t) {
		return $.ui.manager[t] ? $.ui.manager[t][n] : null;	
	},
	add: function(n, t, w) {
		if(!$.ui.manager[t]) $.ui.manager[t] = {};

		if($.ui.manager[t][n])
			$.ui.manager[t][n].push(w);
		else
			$.ui.manager[t][n] = [w];
	},
	plugin: {
		add: function(what, calltime, option, plugin) {
			if(!$.ui[what].prototype.plugins[calltime]) $.ui[what].prototype.plugins[calltime] = [];
			$.ui[what].prototype.plugins[calltime].push([option,plugin]);
		},
		call: function(type, self, self2) {
			if(!self2) self2 = self;
			if (self.plugins[type]) {
				for (var i = 0; i < self.plugins[type].length; i++) {
					if (self2.options[self.plugins[type][i][0]]) {
						self.plugins[type][i][1].call(self2, self);
					}
							
				}	
			}		
		}	
	},
	trigger: function(name, self, e, obj) {
		var o = self.options;
		if(!o[name]) return false;
		
		var nobj = { options: self.options }
		$.extend(nobj, obj);
		
		return o[name].apply(self.element, [e, nobj]);
	},
	num: function(el, prop) {
		return parseInt($.css(el.jquery?el[0]:el,prop))||0;
	},
	getPointer: function(e) {
		var x = e.pageX || (e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft)) || 0;
		var y = e.pageY || (e.clientY + (document.documentElement.scrollTop || document.body.scrollTop)) || 0;
		return [x,y];
	},
}