(function($) {
	
	$.fx.blind = function(o) {

		this.each(function() {

			var cur = $(this).show(); $.fx.relativize(cur);
			var modifier = o.options.direction != "vertical" ? "width" : "height"; //Use the right modifier (width/height)
			$.fx.save(cur, ["overflow", modifier]); //Save values that need to be restored after animation
			
			var ani = {}; ani[modifier] = (o.method == "show" ? $.data(this, "fx.storage."+modifier) : 0); //This will be our animation
			
			if(o.method == "show") cur.css(modifier, 0);
			cur.animate(ani, o.duration, o.options.easing, function() {
				if(o.method != "show") cur.hide(); //if we want to hide the element, set display to none after the animation
				$.fx.restore(cur, ["overflow", (o.method == "show" ? null : modifier)]); //Then restore changed values
				if(o.callback) o.callback.apply(this, arguments); //And optionally apply the callback
			});		
	
		});
		
	}
	
})(jQuery);