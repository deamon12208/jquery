$.ui = {
	getPointer: function(e) {
		var x = e.pageX || (e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft)) || 0;
		var y = e.pageY || (e.clientY + (document.documentElement.scrollTop || document.body.scrollTop)) || 0;
		return [x,y];
	},
	plugin: function(what,calltime,plugin) {
		if(!$.ui[what].prototype.plugins[calltime]) $.ui[what].prototype.plugins[calltime] = [];
		$.ui[what].prototype.plugins[calltime].push(plugin);
	}
}