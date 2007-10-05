(function($) {
$.fn.themer = function(supported){
  var el = this;
  // Add Your Themes HERE
  var themes = ["light", "dark", "flora", "tango", "warm"];
  
  var support = function(i){
    if(supported.constructor == Array){
      if(themes.join().indexOf(supported[i]) >= 0){
        return supported[i];
      }else{
        return themes[0];
      }
    }
    else{return themes[0];}
  }
  var _t = 0;
  var theme = support(_t);
  
  $("body").prepend('<div id="theme"><span>Theme: <a href="#">'+theme+'</a></span></div>');
  
  var changer = $("#theme a");
  $(changer).bind("click", function(){
    $(el).removeClass(theme);
    ++_t;
    theme = support(_t);
    $(el).addClass(theme);
    $(this).text(theme);
    if(_t == supported.length) _t = 0;
  });
}
})(jQuery); 