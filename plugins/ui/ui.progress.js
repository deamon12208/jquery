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
		  complete: function(){},// called when the bar is complete
		  increment: 1,// increments if it's timed
		  time:1000
		};
		$.extend(options, o);
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
	    this.sendPing(this);
	  },
	  sendPing: function(item) {
	    $.ajax({
	      url: item.o.url,
	      dataType: item.o.message? 'json':'text',
	      data: 'currentPercent='+ item.percent,
	      type: "POST",
	      success: function(data) {
	        if (item.o.message) {
	          data = data.percent;
	        }
	        item._update(data, item);
	        window.setTimeout(function() { item.sendPing(item) }, item.o.time);
	      }
	    });
	  },
	  startTimed: function() {
	    this._start();
	    var item = this;
	    this.timer = window.setTimeout(function(){item.timeTick(item)}, 0);
	  },
	  timeTick: function(item) {
	    if (item.percent >= 100) return;
	    item.percent += 1;
	    item._update(item.percent, item);
	    item.timer = window.setTimeout(function(){item.timeTick(item)}, item.o.time / 100);
	  },
	  _start: function() {
	    this.o.start();
	  },
	  _update: function(percent, item) {
	    var p = parseInt(percent);
	    item.percent = percent;
      $(item.el).find('.bar .inner').css('width', p +'%');
	  }
	});
	
})($);