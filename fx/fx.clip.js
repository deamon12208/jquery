(function($) {
  
  $.ec.clip = function(o) {

    this.each(function() {

      // Create element
      var el = $(this), props = ['position','top','left','width','height'];
      
      // Set options
      var mode = o.options.mode || 'hide'; // Default Mode
      var direction = o.options.direction || 'vertical'; // Default direction
      
      // Adjust
      $.ec.save(el, props); el.show(); // Save & Show
      $.ec.createWrapper(el).css({overflow:'hidden'}); // Create Wrapper
      var ref = {
        size: (direction == 'vertical') ? 'height' : 'width',
        position: (direction == 'vertical') ? 'top' : 'left'
      };
      var distance = (direction == 'vertical') ? el.height() : el.width();
      if(mode == 'show') { el.css(ref.size, 0); el.css(ref.position, distance / 2); } // Shift
      
      // Animation
      var animation = {};
      animation[ref.size] = mode == 'show' ? distance : 0;
      animation[ref.position] = mode == 'show' ? 0 : distance / 2;
        
      // Animate
      el.animate(animation, o.speed, o.options.easing, function() {
        if(mode == 'hide') el.hide(); // Hide
        $.ec.restore(el, props); $.ec.removeWrapper(el); // Restore
        if(o.callback) o.callback.apply(this, arguments); // Callback
      }); 
      
    });
    
  }
  
})(jQuery);
