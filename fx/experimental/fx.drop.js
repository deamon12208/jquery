(function($) {
  
  $.ec.drop = function(o) {

    this.each(function() {
      
      // Create element
      var el = $(this);
      var props = ['position','opacity'];
      
      // Set options
      var direction = o.options.direction || 'left';
      var s = $.ec.findSides(el), refs = { left: s[0], right: s[0], up: s[1], down: s[1] }, ref = refs[direction];
      props.push(ref); // Add side to props
      var motion = (direction == 'up' || direction == 'left') ? 'neg' : 'pos';
      var distance = o.options.distance || ((direction == 'up' || direction == 'down') ? (el.height() / 2) : (el.width() / 2));
      var shift = parseInt(el.css(ref)) || 0;
      
      // Adjust
      $.ec.save(el, props);
      el.makeRelative();
      if (o.method == 'show') el.css('opacity', 0).css(ref, shift + (motion == 'pos' ? -distance : distance));
      el.show();
      
      // Animation
      var animation = {};
      animation['opacity'] = o.method == 'show' ? 1 : 0;
      animation[ref] = (o.method == 'show' ? (motion == 'pos' ? '+=' : '-=') : (motion == 'pos' ? '-=' : '+='))  + distance;
      
      // Animate
      el.animate(animation, o.speed, o.options.easing, function() {
        if(o.method != 'show') el.hide();
        $.ec.restore(el, props);
        if(o.callback) o.callback.apply(this, arguments);
      });
      
    });
    
  }
  
})(jQuery);
