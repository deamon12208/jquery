(function($) {
$.fn.themer = function(supported){
  // Variables:
    var el = this;
    var _t = 0;
  
  // THEMES: you can add one here.
    var themes = ["light", "dark", "flora", "tango", "warm"];
    
  // Support Checker
    var support = function(i){
      if(supported.constructor == Array){
        if(themes.indexOf(supported[i]) != -1){
          return supported[i];
        }else{
          return themes[0];
        }
      }
      else{return themes[0];}
    }
    
  // Check Support Of Theme
    var theme = support(_t);
  
  // Initialize..
    $("body").addClass(theme);
  // Build...
    $("body").prepend('<div id="theme"><span>Theme: <a href="#">'+theme+'</a></span></div>');
    var changer = $("#theme a");
  // Hook
    $(changer).bind("click", function(){
    // Remove Existing
      $("body").removeClass(theme);
    // Goto Next Theme
      _t++;
    // If next theme has a greater index then the supported themes, goto 0.
      if(_t == supported.length) _t = 0;
    // Check Support of Theme
      theme = support(_t);
    // Add the ClassName of that theme
      $("body").addClass(theme);
    // Update The Text.
      $(this).text(theme);
    });
  }
})(jQuery); 