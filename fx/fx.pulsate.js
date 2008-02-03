(function($) {
  
  $.ec.pulsate = function(o) {

    return this.each(function() {
      
      // Create element
      var el = $(this);
      
      // Set options
      var mode = o.options.mode || 'show'; // Default mode
      var times = o.options.times || 5; // Default # of times
      
      // Adjust
      if (mode != 'hide') times--;
      if (el.is(':hidden')) { // Show fadeIn
        el.css('opacity', 0);
        el.show(); // Show
        el.animate({opacity: 1}, o.speed / 2, o.options.easing);
        times--;
      }
      
      // Animate
      for (var i = 0; i < times; i++) { // Pulsate
        el.animate({opacity: 0}, o.speed / 2, o.options.easing).animate({opacity: 1}, o.speed / 2, o.options.easing);
      };
      if (mode == 'hide') { // Last Pulse
        el.animate({opacity: 0}, o.speed / 2, o.options.easing, function(){
          el.hide(); // Hide
          if(o.callback) o.callback.apply(this, arguments); // Callback
          el.dequeue();
        });
      } else {
        el.animate({opacity: 0}, o.speed / 2, o.options.easing).animate({opacity: 1}, o.speed / 2, o.options.easing, function(){
          if(o.callback) o.callback.apply(this, arguments); // Callback
        });
      };
      el.queue('fx', function() { el.dequeue(); })
    });
    
  };
  
})(jQuery);