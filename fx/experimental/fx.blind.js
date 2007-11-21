(function($) {
  
  $.ec.blind = function(o) {

    this.each(function() {
    
      // Create element
      var el = $(this);
      
      // Create a wrapper
      el.wrap('<div id="fxWrapper"></div>');
      var wrapper = el.parent();
      wrapper.css({overflow: 'hidden', height: el.outerHeight(), width: el.outerWidth()});
      
      // Set options
      var mode = o.options.mode || 'hide';
      var direction = o.options.direction || 'vertical';
      var ref = (direction == 'vertical') ? 'height' : 'width';
      var distance = (direction == 'vertical') ? wrapper.height() : wrapper.width();
      
      // Adjust
      if(mode == 'show') wrapper.css(ref, 0);
      el.show();
      
      // Animation
      var animation = {};
      animation[ref] = mode == 'show' ? distance : 0;
      
      // Animate
      wrapper.animate(animation, o.speed, o.options.easing, function() {
        if(mode == 'hide') el.hide();
        wrapper.replaceWith(el);
        if(o.callback) o.callback.apply(this, arguments);
      });   
  
    });
    
  }
  
})(jQuery);

(function($) {
  
  $.ec.blind = function(o) {

    this.each(function() {

      // Create element
      var el = $(this);
      el.show(); // Show
      
      // Set options
      var mode = o.options.mode || 'hide'; // Default Mode
      var direction = o.options.direction || 'vertical'; // Default direction
      var ref = (direction == 'vertical') ? 'height' : 'width';
      
      // Adjust
      var wrapper = $.ec.createWrapper(el).css({overflow:'hidden'}); // Create Wrapper
      var distance = (direction == 'vertical') ? wrapper.height() : wrapper.width();
      if(mode == 'show') wrapper.css(ref, 0); // Shift
      
      // Animation
      var animation = {};
      animation[ref] = mode == 'show' ? distance : 0;
      
      // Animate
      wrapper.animate(animation, o.speed, o.options.easing, function() {
        if(mode == 'hide') el.hide(); // Hide
        $.ec.removeWrapper(el); // Restore
        if(o.callback) o.callback.apply(this, arguments); // Callback
      });
      
    });
    
  }
  
})(jQuery);