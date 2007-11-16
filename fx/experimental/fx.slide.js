(function($) {
  
  $.fx.slide = function(o) {

    this.each(function() {

      // Create element
      var el = $(this);
      $.fx.save(el, ["marginTop","marginLeft"]);
      
      // Create a wrapper
      el.wrap('<div id="fxWrapper"></div>');
      var wrapper = el.parent();
      wrapper.css({overflow: 'hidden', height: el.outerHeight(), width: el.outerWidth()});
      
      // Set options
      var direction = o.options.direction || "left";
      var ref = (direction == "up" || direction == "down") ? "marginTop" : "marginLeft";
      var motion = (direction == "down" || direction == "right") ? "pos" : "neg";
      var distance = distance || ref == "marginTop" ? wrapper.height() : wrapper.width();
      var shift = !parseInt(el.css(ref)) ? 0 : parseInt(el.css(ref)); // Need this for IE
      
      // Adjust
      if (o.method == "show") el.css(ref, shift + (motion == "pos" ? distance : -distance));
      el.show();
      
      // Animation
      var animation = {};
      animation[ref] = (o.method == "show" ? (motion == "pos" ? '-=' : '+=') : (motion == "pos" ? '+=' : '-=')) + distance;
      
      // Animate
      el.animate(animation, o.speed, o.options.easing, function() { //Animate
        if(o.method != "show") el.hide();
        $.fx.restore(el, ["marginTop","marginLeft"]);
        wrapper.replaceWith(el);
        if(o.callback) callback.apply(this, arguments);
      });
      
    });
    
  }
  
})(jQuery);