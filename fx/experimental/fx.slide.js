(function($) {
  
  $.ec.slide = function(o) {

    this.each(function() {

      // Create element
      var el = $(this);
      var props = [];
      
      // Create a wrapper
      el.wrap('<div id="fxWrapper"></div>');
      var wrapper = el.parent();
      wrapper.css({overflow: 'hidden', height: el.outerHeight(), width: el.outerWidth()});
      
      // Set options
      var mode = o.options.mode || 'show';
      var direction = o.options.direction || 'left';
      var ref = (direction == 'up' || direction == 'down') ? 'marginTop' : 'marginLeft';
      props.push(ref);
      var motion = (direction == 'down' || direction == 'right') ? 'pos' : 'neg';
      var distance = distance || ref == 'marginTop' ? wrapper.height() : wrapper.width();
      var shift = parseInt(el.css(ref)) || 0;
      
      // Adjust
      $.ec.save(el, props);
      if (mode == 'show') el.css(ref, shift + (motion == 'pos' ? distance : -distance));
      el.show();
      
      // Animation
      var animation = {};
      animation[ref] = (mode == 'show' ? (motion == 'pos' ? '-=' : '+=') : (motion == 'pos' ? '+=' : '-=')) + distance;
      
      // Animate
      el.animate(animation, o.speed, o.options.easing, function() { //Animate
        if(mode == 'hide') el.hide();
        $.ec.restore(el, props);
        wrapper.replaceWith(el);
        if(o.callback) o.callback.apply(this, arguments);
      });
      
    });
    
  }
  
})(jQuery);