(function($) {
  
  $.ec.highlight = function(o) {

    this.each(function() {
      
      // Create element
      var el = $(this);
      var props = ['backgroundImage','backgroundColor','opacity'];
      
      // Set options
      var color = o.options.color || "#ffff99"
      
      // Adjust & Save
      $.ec.save(el, props);
      el.css({backgroundImage: 'none', backgroundColor: color});
      el.show();
      
      // Animation
      var animation = {};
      animation['backgroundColor'] = $.data(this, "ec.storage.backgroundColor");
      if (o.method == "hide") animation['opacity'] = 0;
      
      // Animate
      el.animate(animation, o.speed, o.options.easing, function() { //Animate
        if(o.method == "hide") el.hide();
        $.ec.restore(el, props);
        if(o.callback) o.callback.apply(this, arguments);
      });
      
    });
    
  }
  
})(jQuery);