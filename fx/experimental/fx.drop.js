(function($) {
  
  $.fx.drop = function(o) {

    this.each(function() {
      
      // Create element
      var el = $(this);
      $.fx.relativize(el);
      $.fx.save(el, ["top","left","opacity"]);
      
      // Set options
      var direction = o.options.direction || "left";
      var ref = (direction == "up" || direction == "down") ? "top" : "left";
      var motion = (direction == "up" || direction == "left") ? "pos" : "neg";
      var distance = o.options.distance || ref == "top" ? (el.height() / 2) : (el.width() / 2);
      var shift = !parseInt(el.css(ref)) ? 0 : parseInt(el.css(ref)); // Need this for IE
      
      // Adjust
      if (o.method == "show") el.css('opacity', 0).css(ref, shift + (motion == "pos" ? -distance : distance));
      el.show();
      
      // Animation
      var animation = {};
      animation['opacity'] = o.method == "show" ? 1 : 0;
      animation[ref] = (o.method == "show" ? (motion == "pos" ? '+=' : '-=') : (motion == "pos" ? '-=' : '+='))  + distance;
      
      // Animate
      el.animate(animation, o.speed, o.options.easing, function() { //Animate
        if(o.method != "show") el.hide();
        $.fx.restore(el, ["left","top","opacity"]);
        if(o.callback) callback.apply(this, arguments);
      });
      
    });
    
  }
  
})(jQuery);
