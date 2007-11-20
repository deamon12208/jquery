(function($) {

  $.ec = $.ec || {}; //Add the 'ec' scope

  $.extend($.ec, {
    save: function(el, set) {
      for(var i=0;i<set.length;i++) {
        if(set[i] !== null) $.data(el[0], "ec.storage."+set[i], el.css(set[i]));  
      }
    },
    restore: function(el, set, ret) {
      if(ret) var obj = {};
      for(var i=0;i<set.length;i++) {
        if(ret) obj[set[i]] = $.data(el[0], "ec.storage."+set[i]);
        if(set[i] !== null && !ret) el.css(set[i], $.data(el[0], "ec.storage."+set[i]));  
      }
      if(ret) return obj;
    },
    findSides: function(el) { //Very nifty function (especially for IE!)
      return [ !!parseInt(el.css("left")) ? "left" : "right", !!parseInt(el.css("top")) ? "top" : "bottom" ];
    },
    setTransition: function(el, list, factor, val) {
      val = val || {};
      $.each(list,function(i, x){
        unit = el.cssUnit(x);
        if (unit[0] > 0) val[x] = unit[0] * factor + unit[1];
      });
      return val;
    },
    animateClass: function(value, duration, easing, callback) {
  
      var cb = (typeof easing == "function" ? easing : (callback ? callback : null));
      var ea = (typeof easing == "object" ? easing : null);
      
      this.each(function() {
        
        var offset = {}; var that = $(this); var oldStyleAttr = that.attr("style") || '';
        if(typeof oldStyleAttr == 'object') oldStyleAttr = oldStyleAttr["cssText"]; /* Stupidly in IE, style is a object.. */
        if(value.toggle) { that.hasClass(value.toggle) ? value.remove = value.toggle : value.add = value.toggle; }
        
        //Let's get a style offset
        var oldStyle = $.extend({}, (document.defaultView ? document.defaultView.getComputedStyle(this,null) : this.currentStyle));
        if(value.add) that.addClass(value.add); if(value.remove) that.removeClass(value.remove);
        var newStyle = $.extend({}, (document.defaultView ? document.defaultView.getComputedStyle(this,null) : this.currentStyle));
        if(value.add) that.removeClass(value.add); if(value.remove) that.addClass(value.remove);
    
        // The main function to form the object for animation
        for(var n in newStyle) {
          if( typeof newStyle[n] != "function" && newStyle[n] /* No functions and null properties */
            && n.indexOf("Moz") == -1 && n.indexOf("length") == -1 /* No mozilla spezific render properties. */
            && newStyle[n] != oldStyle[n] /* Only values that have changed are used for the animation */
            && (n.match(/color/i) || (!n.match(/color/i) && !isNaN(parseInt(newStyle[n])))) /* Only things that can be parsed to integers or colors */
            && (oldStyle.position != "static" || (oldStyle.position == "static" && !n.match(/left|top|bottom|right/))) /* No need for positions when dealing with static positions */
          ) offset[n] = newStyle[n];
        }
  
        that.animate(offset, duration, ea, function() { // Animate the newly constructed offset object
          // Change style attribute back to original. For stupid IE, we need to clear the damn object.
          if(typeof $(this).attr("style") == 'object') { $(this).attr("style")["cssText"] = ""; $(this).attr("style")["cssText"] = oldStyleAttr; } else $(this).attr("style", oldStyleAttr);
          if(value.add) $(this).addClass(value.add); if(value.remove) $(this).removeClass(value.remove);
          if(cb) cb.apply(this, arguments);
        });
  
      });
    }
  });
 
  //Extend the methods of jQuery
  $.fn.extend({
    //Save old methods
    _show: $.fn.show,
    _hide: $.fn.hide,
    _toggle: $.fn.toggle,
    _addClass: $.fn.addClass,
    _removeClass: $.fn.removeClass,
    _toggleClass: $.fn.toggleClass,
    // New ec methods
    effect: function(fx,o,speed,callback) { 
      if($.ec[fx]) {
        elem = this.get(0);
        elem.fx = elem.fx || {};
        if (!elem.fx[fx]) { // Prevent double-click
          elem.fx[fx] = true;
          return $.ec[fx].apply(this, [{method: fx, options: o || {}, speed: speed, callback: function(){if (callback) callback.apply(this.arguments); elem.fx[fx] = null;} }]);
        }
      }
    },
    show: function(obj,speed,callback){
      if (typeof obj == 'string' || typeof obj == 'undefined')
        return this._show(obj, speed);
      else {
        obj['mode'] = 'show';
        return this.effect(obj.method, obj, speed, callback);
      };
    },
    hide: function(obj,speed,callback){
      if (typeof obj == 'string' || typeof obj == 'undefined')
        return this._hide(obj, speed);
      else {
        obj['mode'] = 'hide';
        return this.effect(obj.method, obj, speed, callback);
      };
    },
    toggle: function(obj,speed,callback){
      return this.is(':hidden') ? this.show(obj,speed,callback) : this.hide(obj,speed,callback)
    },
    addClass: function(classNames,speed,easing,callback) {
      return speed ? $.ec.animateClass.apply(this, [{ add: classNames },speed,easing,callback]) : this._addClass(classNames);
    },
    removeClass: function(classNames,speed,easing,callback) {
      return speed ? $.ec.animateClass.apply(this, [{ remove: classNames },speed,easing,callback]) : this._removeClass(classNames);
    },
    toggleClass: function(classNames,speed,easing,callback) {
      return speed ? $.ec.animateClass.apply(this, [{ toggle: classNames },speed,easing,callback]) : this._toggleClass(classNames);
    },
    morph: function(remove,add,speed,easing,callback) {
      return $.ec.animateClass.apply(this, [{ add: add, remove: remove },speed,easing,callback]);
    },
    switchClass: function() { 
      this.morph.apply(this, arguments);
    },
    // helper functions
    makeRelative: function() { //Relativize
      var pos = this.css('position');
      if (!pos || pos == 'static') {
        this.css('position', 'relative');
        if (window.opera) {
          element.style.top = 0;
          element.style.left = 0;
        };
      };
    },
    cssUnit: function(key) { 
      var style = this.css(key), val = [];
      $.each( ['em','px','%','pt'], function(i, unit){
      if(style.indexOf(unit) > 0)
        val = [parseFloat(style), unit];
      });
      return val
    }
  });
  
})(jQuery);