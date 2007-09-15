(function($) {

	//If the UI scope is not availalable, add it
	$.ui = $.ui || {};
	
	$.fn.progress = function(o) {
		var options = {
		  size: 'medium',// small, medium, large
		  type: 'determined',// determined, indetermined, throbber
		  url: '',// set a URL to ping - should return either a number for percent or a json object of message and percent
		  message: false,// set to true to display a message
		  timed: false,// set to true to complete in a certain amount of time, not updating from ajax
		  start: function(){},// called when starting movement
		  step: function(){},// called every time the percent changes
		  complete: function(){}// called when the bar is complete
		};
		$.extend(options, o);
		if (o.timed == false) {
		  var op = {
		    time: 50
		  }
		  $.extend(op, options);
		  options = op;
		}
		else {
		  var op = {
		    time: 2000
		  }
		  $.extend(op, options);
		  options = op;
		}
		console.log(options);
	  new $.ui.progress(this, options);
	};
	
	$.ui.progress = function(el, o) {
	  this.percent = 0;
	  this.o = o;
	  this.el = el;
		if (o.url != '') {
		  this.startPing();
		}
		else if(o.timed == true) {
	    this.remainingTime = o.time;
		  this.startTimed();
		}
	};
	
	$.extend($.ui.progress.prototype, {
	  startPing: function() {
	    this._start();
	    this.sendPing();
	  },
	  sendPing: function() {
	    var self = this;
	    $.ajax({
	      url: this.o.url,
	      dataType: this.o.message? 'json':'text',
	      success: function(data) {
	        if (self.o.message) {
	          data = data.percent;
	        }
	        self._update(percent);
	        window.setTimeout(self.sendPing(), this.o.time);
	      }
	    })
	  },
	  startTimed: function() {
	    this._start();
	    var item = this;
	    this.timer = window.setTimeout(function(){item.timeTick(item)});
	  },
	  timeTick: function(item) {
	    if (item.percent >= 100) return;
	    
	    item.percent += 5;
	    item._update(item.percent);
	    item.timer = window.setTimeout(function(){item.timeTick(item)}, 100);
	  },
	  _start: function() {
	    this.o.start();
	  },
	  _update: function(percent) {
	    var p = parseInt(percent);
//	    if (p == percent) {
	      $(this.el).find('.bar .inner').css('width', p +'%');
  	    alert(percents);
//  	  }
	  }
	});
	
})($);