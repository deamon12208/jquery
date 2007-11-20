(function($) {
  
  $.ec.bounce = function(o) {

    this.each(function() {
      
      // Create element
      var el = $(this);
      var props = ['position','opacity'];
      
      // Set options
      var mode = o.options.mode || 'effect';
      var times = o.options.times || 5;
      times --;
      o.speed = o.speed || 1000;
      speed = o.speed / (times * 2);
      var direction = o.options.direction || 'up';
      var s = $.ec.findSides(el), refs = { left: s[0], right: s[0], up: s[1], down: s[1] }, ref = refs[direction];
      props.push(ref); // Add side to props
      var motion = (direction == 'up' || direction == 'left') ? 'neg' : 'pos';
      var distance = o.options.distance || ((direction == 'up' || direction == 'down') ? (el.height() / 3) : (el.width() / 3));
      if (mode == 'hide') distance = distance / (times * 2);
      var shift = parseInt(el.css(ref)) || 0;
      
      // Adjust
      $.ec.save(el, props);
      el.makeRelative();
      if (mode == 'show') el.css('opacity', 0).css(ref, shift + (motion == 'pos' ? -distance : distance));
      el.show();
      
      // Animate
      if (mode == 'show') { // Show Bounce
        var animation = {opacity: 1};
        animation[ref] = (motion == 'pos' ? '+=' : '-=')  + distance;
        el.animate(animation, speed, o.options.easing);
        distance = (mode == 'hide') ? distance * 2 : distance / 2;
        times--;
      }
      
      for (var i = 0; i < times; i++) { // Bounces
        var animation1 = {};
        var animation2 = {};
        animation1[ref] = (motion == 'pos' ? '-=' : '+=')  + distance;
        animation2[ref] = (motion == 'pos' ? '+=' : '-=')  + distance;
        el.animate(animation1, speed, o.options.easing).animate(animation2, speed, o.options.easing);
        distance = (mode == 'hide') ? distance * 2 : distance / 2;
      };
      
      if (mode == 'hide') { // Last Bounce
        var animation = {opacity: 0};
        animation[ref] = (motion == 'pos' ? '-=' : '+=')  + distance;
        el.animate(animation, speed, o.options.easing, function(){
          el.hide();
          $.ec.restore(el, props);
          if(o.callback) o.callback.apply(this, arguments);
        });
      } else {
        var animation1 = {};
        var animation2 = {};
        animation1[ref] = (motion == 'pos' ? '-=' : '+=')  + distance;
        animation2[ref] = (motion == 'pos' ? '+=' : '-=')  + distance;
        el.animate(animation1, speed, o.options.easing).animate(animation2, speed, o.options.easing, function(){
          $.ec.restore(el, props);
          if(o.callback) o.callback.apply(this, arguments);
        });
      }
      
    });
    
  }
  
})(jQuery);
