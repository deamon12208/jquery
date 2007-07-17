$.fn.magnify = function(options) {
	return this.each(function() {
		new $.ui.magnifier(this,options);	
	});
};

$.ui.magnifier = function(el,options) {
	
	var self = this;
	this.items = [];
	this.options = options ? options : {};
	this.options.distance = this.options.distance ? this.options.distance : 150;
	this.options.magnification = this.options.magnification ? this.options.magnification : 2;
	this.options.baseline = this.options.baseline ? this.options.baseline : 0;
	
	$('> *', el).each(function() {
		var co = $(this).offset({ border: false });
		if(self.options.overlap) var cp = $(this).position();
		self.items.push([this, co, [$(this).width(),$(this).height()], (cp ? cp : null)]);	
	});

	if(this.options.overlap) {
		for(var i=0;i<this.items.length;i++) {
			//Absolute stuff
			$(this.items[i][0]).css({
				position: "absolute",
				top: this.items[i][3].top,
				left: this.items[i][3].left
			});
		};
	}
	
	$(document).bind("mousemove", function(e) {
		self.magnify.apply(self, [e]);
	});
	
}

$.extend($.ui.magnifier.prototype, {
	magnify: function(e) {
		var p = $.ui.getPointer(e);
		var o = this.options;
		var c;
		for(var i=0;i<this.items.length;i++) {
			c = this.items[i];
			
			var distance = Math.sqrt(
				  Math.pow(p[0] - c[1].left - (c[0].offsetWidth/2), 2)
				+ Math.pow(p[1] - c[1].top  - (c[0].offsetHeight/2), 2)
			);
			
			//console.log(distance);
			
			if(distance < o.distance) {

				$(c[0]).css({
					width: c[2][0]+ (c[2][0] * (o.magnification-1)) - (((distance/o.distance)*c[2][0]) * (o.magnification-1)),
					top: (o.baseline-0.5) * ((c[2][0] * (o.magnification-1)) - (((distance/o.distance)*c[2][0]) * (o.magnification-1))),
					left: (c[3] ? (c[3].left + -0.5 * ((c[2][1] * (o.magnification-1)) - (((distance/o.distance)*c[2][1]) * (o.magnification-1)))) : 0)
				});
				
			} else {
				
				$(c[0]).css({
					width: c[2][0],
					top: 0,
					left: (c[3] ? c[3].left : 0)
				});	
							
			}

		}
	}
});

