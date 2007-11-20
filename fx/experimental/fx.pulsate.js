(function($) {
  
  $.ec.pulsate = function(o) {

    this.each(function() {
      
      // Create element
      var el = $(this);
      
      // Set options
      var mode = o.options.mode || 'show';
      var times = o.options.times || 5;
      
      // Adjust
      if (el.is(':hidden')) {
        el.fadeIn(o.speed, o.options.easing);
        times--;
      }
      
      // Animate
      for (var i = 0; i < times; i++) {
        el.fadeOut(o.speed, o.options.easing).fadeIn(o.speed, o.options.easing);
      };
      if (mode == 'hide') el.fadeOut(o.speed, o.options.easing);
      if(o.callback) o.callback.apply(this, arguments);
    });
    
  }
  
})(jQuery);