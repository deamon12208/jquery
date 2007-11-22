(function($) {
  
  $.ec.blind = function(o) {

    this.each(function() {

      // Create element
      var el = $(this), props = ['position'];
      
      // Set options
      var mode = o.options.mode || 'hide'; // Default Mode
      var direction = o.options.direction || 'vertical'; // Default direction
      
      // Adjust
      $.ec.save(el, props); el.show(); // Save & Show
      var wrapper = $.ec.createWrapper(el).css({overflow:'hidden'}); // Create Wrapper
      var ref = (direction == 'vertical') ? 'height' : 'width';
      var distance = (direction == 'vertical') ? wrapper.height() : wrapper.width();
      if(mode == 'show') wrapper.css(ref, 0); // Shift
      
      // Animation
      var animation = {};
      animation[ref] = mode == 'show' ? distance : 0;
      
      // Animate
      wrapper.animate(animation, o.speed, o.options.easing, function() {
        if(mode == 'hide') el.hide(); // Hide
        $.ec.restore(el, props); $.ec.removeWrapper(el); // Restore
        if(o.callback) o.callback.apply(this, arguments); // Callback
      });
      
    });
    
  }
  
})(jQuery);