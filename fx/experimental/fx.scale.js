(function($) {
  
  $.ec.scale = function(o) {
    
    // Create element
    var el = $(this);
    
    // Set options
    var percent = parseInt(o.options.percent) || 100;
    var axis = o.options.axis || 'both';
    
    if (o.method == 'show' || o.method == 'hide') o.options.restore = true;
    
    var factor = { // set scaling factor
      from: [(o.method == 'show') ? 0 : 1, (o.method == 'show') ? 0 : 1],
      to: [(o.method == 'hide') ? 0 : (percent / 100), (o.method == 'hide') ? 0 : (percent / 100)]
    }
    if (axis == 'horizontal') factor.to[0] = factor.from[0]; 
    if (axis == 'vertical') factor.to[1] = factor.from[1];
    
    o.options.from = o.options.from || {height: el.height() * factor.from[0], width: el.width() * factor.from[1]};
    o.options.to = {height: el.height() * factor.to[0], width: el.width() * factor.to[1]};
    
    // Animate
    el.effect('size', o.options, o.speed, function(){
      if (o.method == 'hide') el.hide();
      if(o.callback) o.callback.apply(this, arguments);
    });
    
  };
  
  $.ec.size = function(o) {

    this.each(function() {
      
      // Create element
      var el = $(this);
      var props = ['position','width','height'];
      
      // Set options
      var restore = o.options.restore || false;
      var scale = o.options.scale || 'both';
      var s = $.ec.findSides(el), ref = [s[0], s[1]];
      props.push(ref); // Add side to props
      
      el.original = {height: el.height(), width: el.width()};
      el.from = o.options.from || el.original;
      el.to = o.options.to || el.original;
      
      var factor = { // set scaling factor
        from: [el.from.height / el.original.height, el.from.width / el.original.width],
        to: [el.to.height / el.original.height, el.to.width / el.original.width]
      }
      
      // Scale the box model
      if (scale == 'box' || scale == 'both') {
        if (factor.from[0] != factor.to[0]) { // Vertical props scaling
          var vProps = ['fontSize', 'borderTopWidth', 'borderBottomWidth', 'paddingTop', 'paddingBottom'];
          props = props.concat(vProps);
          el.from = $.ec.setTransition(el, vProps, factor.from[0], el.from);
          el.to = $.ec.setTransition(el, vProps, factor.to[0], el.to);
        };
        if (factor.from[1] != factor.to[1]) { // Horizontal props scaling
          var hProps = ['borderLeftWidth', 'borderRightWidth', 'paddingLeft', 'paddingRight'];
          props = props.concat(hProps);
          el.from = $.ec.setTransition(el, hProps, factor.from[1], el.from);
          el.to = $.ec.setTransition(el, hProps, factor.to[1], el.to);
        };
      };
      
      // Adjust
      if (restore) $.ec.save(el, props);
      el.css('overflow','hidden').css(el.from);
      el.show();
      
      // Scale the contents
      if (scale == 'contents' || scale == 'both') {
        el.find("*[width]").each(function(){
          child = $(this);
          if (restore) $.ec.save(child, props);
          child.from = {height: child.height() * factor.from[0], width: child.width() * factor.from[1]};
          child.to = {height: child.height() * factor.to[0], width: child.width() * factor.to[1]};
          if (factor.from[0] != factor.to[0]) { // Vertical props scaling
            child.from = $.ec.setTransition(child, vProps, factor.from[0], child.from);
            child.to = $.ec.setTransition(child, vProps, factor.to[0], child.to);
          };
          if (factor.from[1] != factor.to[1]) { // Horizontal props scaling
            child.from = $.ec.setTransition(child, hProps, factor.from[1], child.from);
            child.to = $.ec.setTransition(child, hProps, factor.to[1], child.to);
          };
          child.css(child.from); // Adjust children
          child.animate(child.to, o.speed, o.options.easing, function(){
            if (restore) $.ec.restore(child, props);
          }); // Animate children
        });
      };
      
      // Animate
      el.animate(el.to, o.speed, o.options.easing, function() {
        if(restore) $.ec.restore(el, props);
        if(o.callback) o.callback.apply(this, arguments);
      }); 
      
    });
    
  }
  
})(jQuery);