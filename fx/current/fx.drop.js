(function($) {
	
	$.fx.drop = function(type, set, speed, callback) {

		this.each(function() {

			if(!set.direction) set.direction = "left"; //Default direction
			var s = $.fx.findSides($(this)), dir = { left: s[0], right: s[0], up: s[1], down: s[1] };
			var cur = $(this);

			if(type == "show") {
				var animation = { opacity : 1 }, after = {};
				var prefix = { left: (s[0] == 'left' ? '+=' : '-='), right: (s[0] == 'left' ? '-=' : '+='), up: (s[1] == 'top' ? '+=' : '-='), down: (s[1] == 'top' ? '-=' : '+=')};

				animation[dir[set.direction]] = prefix[set.direction]+200;
				cur.show().css("opacity", 0).css(dir[set.direction], parseInt(cur.css(dir[set.direction])) + (prefix[set.direction] == "+=" ? -200 : 200));
			} else {
				var animation = { opacity : 0 }, after = { display: 'none' };
				var prefix = { left: (s[0] == 'left' ? '-=' : '+='), right: (s[0] == 'left' ? '+=' : '-='), up: (s[1] == 'top' ? '-=' : '+='), down: (s[1] == 'top' ? '+=' : '-=')};
				
				animation[dir[set.direction]] = prefix[set.direction]+200;
				after[dir[set.direction]] = $(this).css(dir[set.direction]);
			}

			cur.animate(animation, speed, set.easing, function() { //Animate
				cur.css(after);
				if(callback) callback.apply(this, arguments);
			});		
	
		});
		
	}
	
})(jQuery);