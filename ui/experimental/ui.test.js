(function($) {

	//If the UI scope is not availalable, add it
	$.ui = $.ui || {};
	
	$.ui.test = function(o) {
		
		$.extend(this, o);

		this.path = [];
		this.cursor = $('<img src="images/cursor.png" style="position: absolute; z-index: 1000;">').appendTo("body").hide();
		if(this.logger) $(this.logger)[0].value = "";
	
	}
	
	$.extend($.ui.test.prototype, {
		bind: function(w) {
			
			var self = this;
			$(document).bind(w, function(e) {
				
				var cur = [e.pageX,e.pageY];
				var button = self.button(e);
				var modifiers = self.modifiers(e);
				
				$(self.logger)[0].value += "['"+w+"',["+cur[0]+","+cur[1]+"],"+e.button+",["+e.ctrlKey+","+e.shiftKey+","+e.altKey+"], window],\n";
				self.path.push([w,cur,e.button,[e.ctrlKey,e.shiftKey,e.altKey],window]);
				
			});
	
		},
		record: function(e) {
			
			var org = [e.pageX,e.pageY];
			var self = this;
			
			self.bind("click");
			self.bind("mousedown");
			self.bind("mouseup");
			
		},
		recordStop: function(e) {
			$(document).unbind("click").unbind("mousedown").unbind("mouseup");
		},
		play: function(e,path) {

			$('*').css('cursor', 'url(images/blank.cur), crosshair');
			this.cursor.show();
			
			
			var prev = [e.pageX,e.pageY];
			var self = this;
			this.path = path || this.path;
			
			
			for(var i=0;i<this.path.length;i++) {
	
				distance = Math.sqrt(
					  Math.pow(prev[0] - this.path[i][1][0], 2)
					+ Math.pow(prev[1] - this.path[i][1][1], 2)
				);
	
				prev = this.path[i][1];
				var f = function(c) {
					return function() {
						self.fire(c);
					}
				}(this.path[i+1] || null);
				$(this.cursor).animate({ left: this.path[i][1][0], top: this.path[i][1][1] }, distance*5, "linear", f);
				
			}

		},
		stop: function() {
			$('*').css('cursor', '');
			this.cursor.hide();
		},
		fire: function(e) {
			switch(e) {
				case null:
					this.stop();
					break;
				default:
					var evt = document.createEvent("MouseEvents");
					evt.initMouseEvent(e[0], true, true, window, 0, 0, 0, e[1][0], [1][1], e[3][0], e[3][2], e[3][1], false, e[2], null);
					e[4].dispatchEvent(evt);
					
					if(e[0] == "click") {
						var img = $("<img src='images/click.png' width='1'>")
						.appendTo("body").css({ position: "absolute", zIndex: 999, left: e[1][0], top: e[1][1] })
						.animate({ width: 80, height: 80, left: e[1][0]-40, top: e[1][1]-40, opacity: 'hide' }, 1000, function() { $(this).remove(); });
					}
					
			}
		},
		button: function(e) {
			switch(e.button) {
				case 0:
					return "left";
				case 1:
					return "middle";
				case 2:
					return "right";
			}		
		},
		modifiers: function(e) {
			var str = [];
			if(e.ctrlKey) str.push("Ctrl");
			if(e.altKey) str.push("Alt");
			if(e.shiftKey) str.push("Shift");
			return str.join(", ");
		}
	});
	
})(jQuery);
