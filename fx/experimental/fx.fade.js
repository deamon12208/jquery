(function($) {
  
  $.ec.fade = function(o) {

    this.each(function() {
      
      // Create element
      var el = $(this), props = ['opacity'];
      
      // Set options
      var mode = o.options.mode || 'effect'; // Default mode
      var opacity = o.options.opacity || 0; // Default fade opacity
      
      // Adjust
      $.ec.save(el, props); el.show(); // Save & Show
      if(mode == 'show') el.css({opacity: 0}); // Shift
      
      // Animation
      var animation = {opacity: mode == 'show' ? 1 : opacity};
      
      // Animate
      el.animate(animation, o.speed, o.options.easing, function() {
        if(mode == 'hide') el.hide(); // Hide
        if(mode == 'hide') $.ec.restore(el, props); // Restore
        if(o.callback) o.callback.apply(this, arguments); // Callback
      });
      
    });
    
  }
  
})(jQuery);