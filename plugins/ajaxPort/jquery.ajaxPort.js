(function($) {
	
	var ajax = $.ajax;
	var request = {};
	
	$.ajax = function(settings) {
		var port = settings.port; 
		if ( port && request[port] ) {
			request[port].abort();
		}
		var result = ajax.apply(this, arguments);
		if ( port )
			request[port] = result;
		return result;
	};
	
})(jQuery);