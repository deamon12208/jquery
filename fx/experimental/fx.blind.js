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
      var direction = o.options.direction || 'vertical';
      var ref = (direction == 'vertical') ? 'height' : 'width';
      var distance = (direction == 'vertical') ? wrapper.height() : wrapper.width();
      
      // Adjust
      if(o.method == 'show') wrapper.css(ref, 0);
      el.show();
      
      // Animation
      var animation = {};
      animation[ref] = o.method == 'show' ? distance : 0;
      
      // Animate
      wrapper.animate(animation, o.speed, o.options.easing, function() {
        if(o.method != 'show') el.hide();
        wrapper.replaceWith(el);
        if(o.callback) callback.apply(this, arguments);
      });   
  
    });
    
  }
  
})(jQuery);