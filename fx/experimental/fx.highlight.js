(function($) {
  
  $.fx.highlight = function(o) {

    this.each(function() {
      
      // Create element
      var el = $(this);
      $.fx.save(el, ["backgroundImage","backgroundColor","opacity"]);
      
      // Set options
      var color = o.options.color || "#ffff99"
      
      // Adjust
      el.css({backgroundImage: 'none', backgroundColor: color})
      el.show();
      
      // Animation
      var animation = {};
      animation['backgroundColor'] = $.data(this, "fx.storage.backgroundColor");
      if (o.method == "hide") animation['opacity'] = 0;
      
      // Animate
      el.animate(animation, o.speed, o.options.easing, function() { //Animate
        if(o.method == "hide") el.hide();
        $.fx.restore(el, ["backgroundImage","backgroundColor","opacity"]);
        if(o.callback) callback.apply(this, arguments);
      });
      
    });
    
  }
  
})(jQuery);