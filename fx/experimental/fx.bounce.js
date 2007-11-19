(function($) {
  
  $.ec.bounce = function(o) {

    this.each(function() {
      
      // Create element
      var el = $(this);
      var props = ['position'];
      
      // Set options
      var times = o.options.times || 5;
      o.speed = o.speed || 1000;
      speed = o.speed / (times * 2);
      var direction = o.options.direction || 'up';
      var s = $.ec.findSides(el), refs = { left: s[0], right: s[0], up: s[1], down: s[1] }, ref = refs[direction];
      props.push(ref); // Add side to props
      var motion = (direction == 'up' || direction == 'left') ? 'neg' : 'pos';
      var distance = o.options.distance || ((direction == 'up' || direction == 'down') ? (el.height() / 3) : (el.width() / 3));
      if (o.method == 'hide') distance = distance / (times * 2);
      var shift = parseInt(el.css(ref)) || 0;
      
      // Adjust
      $.ec.save(el, props);
      el.makeRelative();
      
      // Animate
      for (var i = 0; i < times; i++) {
        var animation1 = {};
        var animation2 = {};
        animation1[ref] = (motion == 'pos' ? '-=' : '+=')  + distance;
        animation2[ref] = (motion == 'pos' ? '+=' : '-=')  + distance;
        if (i == 0 && el.is(':hidden')) animation2['opacity'] = 'show'; 
        if (o.method == 'hide' && times == i+1) animation1['opacity'] = 'hide'; 
        el.animate(animation1, speed, o.options.easing).animate(animation2, speed, o.options.easing, function(){
          if (times == i+1){
            $.ec.restore(el, props);
            if(o.callback) callback.apply(this, arguments);
          }
        });
        distance = (o.method == 'hide') ? distance * 2 : distance / 2;
        
      };
      
    });
    
  }
  
})(jQuery);
