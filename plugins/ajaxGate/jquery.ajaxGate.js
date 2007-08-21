(function($) {
	
	var request = {};
	
	jQuery.ajaxGate = function(port, settings) {
		if ( request[port] ) {
			request[port].abort();
		}
		request[port] = jQuery.ajax(settings);
	};
	
})(jQuery);