(function($) {
  
  $.ec.highlight = function(o) {

    return this.queue(function() {
      
      // Create element
      var el = $(this), props = ['backgroundImage','backgroundColor','opacity'];
      
      // Set options
      var mode = o.options.mode || 'show'; // Default mode
      var color = o.options.color || "#ffff99"; // Default highlight color
      
      // Adjust
      $.ec.save(el, props); el.show(); // Save & Show
      el.css({backgroundImage: 'none', backgroundColor: color}); // Shift
      
      // Animation
      var animation = {backgroundColor: $.data(this, "ec.storage.backgroundColor")};
      if (mode == "hide") animation['opacity'] = 0;
      
      // Animate
      el.animate(animation, o.speed, o.options.easing, function() { //Animate
        if(mode == "hide") el.hide();
        $.ec.restore(el, props);
        if(o.callback) o.callback.apply(this, arguments);
        el.dequeue();
      });
      
    });
    
  };
  
})(jQuery);