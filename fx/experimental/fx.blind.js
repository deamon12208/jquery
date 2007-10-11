(function($) {
	
	$.fx.blind = function(type, set, speed, callback) {

		this.each(function() {

			var el = $(this), cur = $.fx.wrap(this);
			if(el.css("position") == "static" || el.css("position") == '') el.css("position", "relative"); //Relativize
			if(!set.direction) set.direction = "left"; //Default direction

			if(type == "show") {

				var animation = { width: el.width() }, after = function() { $.fx.unwrap(el); };
				cur.css("width", 0); el.show();
				
			} else {
	
				var animation = { width: 0 }, after = function() { el.hide(); $.fx.unwrap(el); };
				
			}

			//Animate
			cur.animate(animation, speed, set.easing, function() {
				after();
				if(callback) callback.apply(this, arguments);
			});		
	
		});
		
	}
	
})(jQuery);