(function($) {
  
  $.ec.slide = function(o) {

    this.each(function() {

      // Create element
      var el = $(this)
      var props = ['position','top','left'];
      
      // Set options
      var mode = o.options.mode || 'show'; // Default Mode
      var direction = o.options.direction || 'left'; // Default Direction
      var ref = (direction == 'up' || direction == 'down') ? 'top' : 'left';
      var motion = (direction == 'up' || direction == 'left') ? 'pos' : 'neg';
      
      // Adjust
      $.ec.save(el, props); el.show(); // Save
      $.ec.createWrapper(el).css({overflow:'hidden'}); // Create Wrapper
      var distance = o.options.distance || (ref == 'top' ? el.outerHeight({margin:true}) : el.outerWidth({margin:true}));
      if (mode == 'show') el.css(ref, motion == 'pos' ? -distance : distance); // Shift
      
      // Animation
      var animation = {};
      animation[ref] = (mode == 'show' ? (motion == 'pos' ? '+=' : '-=') : (motion == 'pos' ? '-=' : '+=')) + distance;
      
      // Animate
      el.animate(animation, o.speed, o.options.easing, function() {
        if(mode == 'hide') el.hide(); // Hide
        $.ec.restore(el, props); $.ec.removeWrapper(el); // Restore
        if(o.callback) o.callback.apply(this, arguments); // Callback
      });
      
    });
    
  }
  
})(jQuery);