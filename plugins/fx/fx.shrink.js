(function($) {

	var save = function(el,props) {
		var obj = {};
		for(var i in props) obj[i] = el.css(i) == "auto" ? 0 : el.css(i);
		return obj;
	};
	
	$.fn.grow = function(speed, easing, callback) {
		this.each(function() {

			$('*', this).each(function() {
				if(!$.data(this, 'fx.scale.original')) return;
				var props = $.data(this, 'fx.scale.original');
				$(this).animate(props, speed, easing, callback); //TODO: Set overflow back to original state
			});

			if(!$.data(this, 'fx.scale.original')) return;
			var props = $.data(this, 'fx.scale.original');
			$(this).animate(props, speed, easing, callback); //TODO: Set overflow back to original state

		});
	}
	
	$.fn.shrink = function(speed, easing, callback) {
		
		this.each(function() {
	
			if($(this).css("position") == "static" || $(this).css("position") == '') $(this).css("position", "relative");
	
			$('*', this).each(function() {
				var props = { width: 0, height: 0 };
				$.data(this, 'fx.scale.original', save($(this),props)); //Store the original properties in expando
				$.data(this, 'fx.scale.overflow', $(this).css("overflow")); //Store the original properties in expando					
				$(this).css("overflow", "hidden").animate(props, speed, easing, callback);
			});
			
			var props = {
				fontSize: 0,
				width: 0, height: 0,
				borderLeftWidth: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomWidth: 0,
				paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0,
				marginTop: 0, marginLeft: 0, marginBottom: 0, marginRight: 0,
				left: '+='+($(this).width() / 2), top: '+='+($(this).height() / 2)
			};
			
			$.data(this, 'fx.scale.original', save($(this),props)); //Store the original properties in expando
			$.data(this, 'fx.scale.overflow', $(this).css("overflow")); //Store the original properties in expando
			$(this).css("overflow", "hidden").animate(props, speed, easing, callback);	
			
		});
		
	}
	
})(jQuery);