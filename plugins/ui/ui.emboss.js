(function($) {

	$.fn.emboss = function(options) {
		options = $.extend({
			top: 1,
			left: 1
		}, options);
  	var a = $(this).clone().insertBefore($(this)).css({ position: 'absolute', color: '#000', zIndex: 6 });
		$(this).css({ position: 'absolute', color: '#ffffff', top: options.top, left: options.left, zIndex: 5 }).add(a);
	};

})(jQuery);
