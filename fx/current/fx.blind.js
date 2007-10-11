(function($) {
	
	$.fx.blind = function(type, set, speed, callback) {

		this.each(function() {

			var cur = $(this).show(); $.fx.relativize(cur);
			var modifier = set.direction != "vertical" ? "width" : "height"; //Use the right modifier (width/height)
			$.fx.save(cur, ["overflow", modifier]); //Save values that need to be restored after animation
			
			var ani = {}; ani[modifier] = (type == "show" ? $.data(this, "fx.storage."+modifier) : 0); //This will be our animation
			
			if(type == "show") cur.css(modifier, 0);
			cur.animate(ani, speed, set.easing, function() {
				if(type != "show") cur.hide(); //if we want to hide the element, set display to none after the animation
				$.fx.restore(cur, ["overflow", (type == "show" ? null : modifier)]); //Then restore changed values
				if(callback) callback.apply(this, arguments); //And optionally apply the callback
			});		
	
		});
		
	}
	
})(jQuery);