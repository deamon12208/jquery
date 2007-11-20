(function($) {
  
  $.ec.scale = function(o) {

    // Create element
    var el = $(this);
    o.speed= 3000;
    // Set options
    var mode = o.options.mode || 'effect';
    var percent = parseInt(o.options.percent) || 100;
    var axis = o.options.axis || 'both';
    var factor = { // set scaling factor
      from: {y: (mode == 'show') ? 0 : 1, x: (mode == 'show') ? 0 : 1},
      to: {y: (mode == 'hide') ? 0 : (percent / 100), x: (mode == 'hide') ? 0 : (percent / 100)}
    }
    if (axis == 'horizontal') factor.to.y = factor.from.y; 
    if (axis == 'vertical') factor.from.x = factor.from.x;
    
    var original = {height: el.height(), width: el.width()};
    
    el.from = {height: original.height * factor.from.y, width: original.width * factor.from.x};
    el.to = {height: original.height * factor.to.y, width: original.width * factor.to.x};
    
    if (mode != 'effect') {
      o.options.baseline = o.options.baseline || ['middle','center']; //Default baseline for show/hide
      o.options.restore = true;
    }
    
    // Do baseline scaling
    if (o.options.baseline) {
      var baseline = o.options.baseline;
      // get baseline values (move to a helper function?)
      var y, x;
      switch (baseline[0]) {
        case 'top': y = 0; break;
        case 'middle': y = 0.5; break;
        case 'bottom': y = 1; break;
        default: y = baseline[0] / original.height;
      }
      switch (baseline[1]) {
        case 'left': x = 0; break;
        case 'center': x = 0.5; break;
        case 'right': x = 1; break;
        default: x = baseline[1] / original.width;
      }
      baseline = [y,x];
      
      var s = $.ec.findSides(el), ref = {left: s[0], top: s[1]};
      original[ref.top] = parseInt(el.css(ref.top)) || 0;
      original[ref.left] = parseInt(el.css(ref.left)) || 0;
      
      var distance = {
        from: {y: (original.height - el.from.height) * baseline[0], x: (original.width - el.from.width) * baseline[1]},
        to: {y: (original.height - el.to.height) * baseline[0], x: (original.width - el.to.width) * baseline[1]}
      }
      
      // Do scaling baseline calcs
      el.from[ref.top] = original[ref.top] + (ref.top == 'top' ? distance.from.y : -distance.from.y);
      el.to[ref.top] = original[ref.top] + (ref.top == 'top' ? distance.to.y : -distance.to.y);
      el.from[ref.left] = original[ref.left] + (ref.top == 'left' ? distance.from.x : -distance.from.x);
      el.to[ref.left] = original[ref.left] + (ref.top == 'left' ? distance.to.x : -distance.to.x);

    };
    
    o.options.from = el.from; o.options.to = el.to;
    
    // Animate
    el.effect('size', o.options, o.speed, function(){
      if (mode == 'hide') el.hide();
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
      
      var original = {height: el.height(), width: el.width()};
      
      el.from = o.options.from || original;
      el.to = o.options.to || original;
      
      // add side props
      if (el.from.top || el.to.top) props.push('top');
      if (el.from.left || el.to.left) props.push('left');
      if (el.from.bottom || el.to.bottom) props.push('bottom');
      if (el.from.right || el.to.right) props.push('right');
      
      var factor = { // set scaling factor
        from: {y: el.from.height / original.height, x: el.from.width / original.width},
        to: {y: el.to.height / original.height, x: el.to.width / original.width}
      }
      
      var props2 = props;
      var cProps = ['fontSize'];
      var vProps = ['borderTopWidth', 'borderBottomWidth', 'paddingTop', 'paddingBottom', 'marginTop', 'marginBottom'];
      var hProps = ['borderLeftWidth', 'borderRightWidth', 'paddingLeft', 'paddingRight', 'marginLeft', 'marginRight'];
      
      // Scale the parent
      if (scale == 'box' || scale == 'both') {
        if (factor.from.y != factor.to.y) { // Vertical props scaling
          props = props.concat(vProps);
          el.from = $.ec.setTransition(el, vProps, factor.from.y, el.from);
          el.to = $.ec.setTransition(el, vProps, factor.to.y, el.to);
        };
        if (factor.from.x != factor.to.x) { // Horizontal props scaling
          props = props.concat(hProps);
          el.from = $.ec.setTransition(el, hProps, factor.from.x, el.from);
          el.to = $.ec.setTransition(el, hProps, factor.to.x, el.to);
        };
      };
      if (scale == 'content' || scale == 'both') {
        if (factor.from.y != factor.to.y) { // Vertical props scaling
          props = props.concat(cProps);
          el.from = $.ec.setTransition(el, cProps, factor.from.y, el.from);
          el.to = $.ec.setTransition(el, cProps, factor.to.y, el.to);
        };
      }
      
      // Adjust
      if (restore) $.ec.save(el, props);
      el.makeRelative();
      el.css('overflow','hidden').css(el.from);
      el.show();
      
      // Scale the contents
      if (scale == 'content' || scale == 'both') {
        vProps = vProps.concat(cProps);
        props2 = props.concat(vProps).concat(hProps);
        el.find("*[width]").each(function(){
          child = $(this);
          if (restore) $.ec.save(child, props2);
          child.from = {height: child.height() * factor.from.y, width: child.width() * factor.from.x};
          child.to = {height: child.height() * factor.to.y, width: child.width() * factor.to.x};
          if (factor.from.y != factor.to.y) { // Vertical props scaling
            child.from = $.ec.setTransition(child, vProps, factor.from.y, child.from);
            child.to = $.ec.setTransition(child, vProps, factor.to.y, child.to);
          };
          if (factor.from.x != factor.to.x) { // Horizontal props scaling
            child.from = $.ec.setTransition(child, hProps, factor.from.x, child.from);
            child.to = $.ec.setTransition(child, hProps, factor.to.x, child.to);
          };
          child.css(child.from); // Adjust children
          child.animate(child.to, o.speed, o.options.easing, function(){
            if (restore) $.ec.restore(child, props2);
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