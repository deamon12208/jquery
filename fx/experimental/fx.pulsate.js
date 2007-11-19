(function($) {
  
  $.ec.pulsate = function(o) {

    this.each(function() {
      
      // Create element
      var el = $(this);
      
      // Set options
      var times = o.options.times || 5;
      
      // Adjust
      if (jQuery(el).is(':hidden')) {
        el.fadeIn(o.speed, o.options.easing);
        times--;
      }
      
      // Animate
      for (var i = 0; i < times; i++) {
        el.fadeOut(o.speed, o.options.easing).fadeIn(o.speed, o.options.easing);
      };
      if (o.method == 'hide') el.fadeOut(o.speed, o.options.easing);
      if(o.callback) callback.apply(this, arguments);
    });
    
  }
  
})(jQuery);