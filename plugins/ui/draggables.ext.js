$.ui.plugin("draggable","stop", function(h, p, op, cla) {

	if(cla.options.revert) {
		h.keepMe = true;
		$(h).animate({left: op[0], top: op[1]}, 500, function(){$(this).remove()});	
	}
	
});