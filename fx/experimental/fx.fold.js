(function($) {
  
  $.ec.fold = function(o) {

    this.each(function() {
    
      // Create element
      var el = $(this);
      
      // Create a wrapper
      el.wrap('<div id="fxWrapper"></div>');
      var wrapper = el.parent();
      wrapper.css({overflow: 'hidden', height: el.outerHeight(), width: el.outerWidth()});
      
      // Set options
      var ref = (o.method == 'show') ? ['width', 'height'] : ['height', 'width'];
      var size = o.options.size || 15;
      var distance = (o.method == 'show') ? [wrapper.width(), wrapper.height()] : [wrapper.height(), wrapper.width()];
      
      // Adjust
      if(o.method == 'show') wrapper.css({height: size, width: 0});
      el.show();
      
      // Animation
      var animation1 = {}; animation1[ref[0]] = o.method == 'show' ? distance[0] : size;
      var animation2 = {}; animation2[ref[1]] = o.method == 'show' ? distance[1] : 0;
      
      // Animate & Restore
      wrapper.animate(animation1, o.speed, o.options.easing)
      .animate(animation2, o.speed, o.options.easing, function() {
        if(o.method != 'show') el.hide();
        wrapper.replaceWith(el);
        if(o.callback) callback.apply(this, arguments);
      });   
  
    });
    
  }
  
})(jQuery);