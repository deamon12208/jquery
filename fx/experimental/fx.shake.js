(function($) {
  
  $.ec.shake = function(o) {

    this.each(function() {
      
      // Create element
      var el = $(this);
      var props = ['position'];
      
      // Set options
      var times = o.options.times || 3;
      speed = o.speed || 75;
      var direction = o.options.direction || 'left';
      var s = $.ec.findSides(el), refs = { left: s[0], right: s[0], up: s[1], down: s[1] }, ref = refs[direction];
      props.push(ref); // Add side to props
      var motion = (direction == 'up' || direction == 'left') ? 'neg' : 'pos';
      var distance = o.options.distance || 20;
      if (o.method == 'hide') distance = distance / (times * 2);
      var shift = parseInt(el.css(ref)) || 0;
      
      // Adjust
      $.ec.save(el, props);
      el.makeRelative();
      
      // Animate
      var animation = {};
      var animation1 = {};
      var animation2 = {};
      animation[ref] = (motion == 'pos' ? '-=' : '+=')  + distance;
      animation1[ref] = (motion == 'pos' ? '+=' : '-=')  + distance * 2;
      animation2[ref] = (motion == 'pos' ? '-=' : '+=')  + distance * 2;
      el.animate(animation, speed, o.options.easing);
      for (var i = 1; i < times; i++) {
        el.animate(animation1, speed * 2, o.options.easing).animate(animation2, speed * 2, o.options.easing)
      };
      el.animate(animation1, speed * 2, o.options.easing).animate(animation, speed, o.options.easing, function(){
        $.ec.restore(el, props);
        if(o.callback) o.callback.apply(this, arguments);
      });
      
    });
    
  }
  
})(jQuery);