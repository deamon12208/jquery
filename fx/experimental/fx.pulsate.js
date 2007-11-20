(function($) {
  
  $.ec.pulsate = function(o) {

    this.each(function() {
      
      // Create element
      var el = $(this);
      
      // Set options
      var mode = o.options.mode || 'effect';
      var times = o.options.times || 5;
      if (mode != 'hide') times--;
      
      // Animate
      if (el.is(':hidden')) { // Show fadeIn
        el.show();
        el.animate({opacity: 1}, o.speed / 2, o.options.easing);
        times--;
      }
      
      for (var i = 0; i < times; i++) { // Pulsate
        el.animate({opacity: 0}, o.speed / 2, o.options.easing).animate({opacity: 1}, o.speed / 2, o.options.easing);
      };
      
      if (mode == 'hide') { // Last Pulse
        el.animate({opacity: 0}, o.speed / 2, o.options.easing, function(){
          el.hide();
          if(o.callback) o.callback.apply(this, arguments);
        });
      } else {
        el.animate({opacity: 0}, o.speed / 2, o.options.easing).animate({opacity: 1}, o.speed / 2, o.options.easing, function(){
          if(o.callback) o.callback.apply(this, arguments);
        });
      };
    });
    
  }
  
})(jQuery);