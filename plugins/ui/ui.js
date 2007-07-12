$.ui = {
	getPointer: function(e) {
		var x = e.pageX || (e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft)) || 0;
		var y = e.pageY || (e.clientY + (document.documentElement.scrollTop || document.body.scrollTop)) || 0;
		return [x,y];
	},
	plugin: function(what, calltime, option, plugin) {
		if(!$.ui[what].prototype.plugins[calltime]) $.ui[what].prototype.plugins[calltime] = [];
		$.ui[what].prototype.plugins[calltime].push([option,plugin]);
	},
	num: function(el, prop) {
		return parseInt($.css(el.jquery?el[0]:el,prop))||0;
	},
	//Generic methods for object oriented plugins
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
	}
}