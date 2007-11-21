(function($) {
  
  $.ec.fold = function(o) {

    this.each(function() {

      // Create element
      var el = $(this);
      el.show(); // Show
      
      // Set options
      var mode = o.options.mode || 'hide'; // Default Mode
      var size = o.options.size || 15; // Default fold size
      var ref = (mode == 'show') ? ['width', 'height'] : ['height', 'width'];
      
      // Adjust
      var wrapper = $.ec.createWrapper(el).css({overflow:'hidden'}); // Create Wrapper
      var distance = (mode == 'show') ? [wrapper.width(), wrapper.height()] : [wrapper.height(), wrapper.width()];
      if(mode == 'show') wrapper.css({height: size, width: 0}); // Shift
      
      // Animation
      var animation1 = {}; animation1[ref[0]] = mode == 'show' ? distance[0] : size;
      var animation2 = {}; animation2[ref[1]] = mode == 'show' ? distance[1] : 0;
      
      // Animate
      wrapper.animate(animation1, o.speed / 2, o.options.easing)
      .animate(animation2, o.speed / 2, o.options.easing, function() {
        if(mode == 'hide') el.hide(); // Hide
        $.ec.removeWrapper(el); // Restore
        if(o.callback) o.callback.apply(this, arguments); // Callback
      });
      
    });
    
  }
  
})(jQuery);