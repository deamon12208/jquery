(function($) { 
  //If the UI scope is not availalable, add it
  $.ui = $.ui || {};

  $.fn.form = function(o) {
    return this.each(function() {
      new $.ui.form(this,o);  
    });
  }
  $.ui.form = function(el, o) {
    if(!(' '+el.className+' ').indexOf(" ui-form ")) return false;
    var $span,$el = $(el);
    var wrap = function(c,e){
      var $e = (e)?$(e):$el;
      var $s = $('<span><span class="ui-form-inner"></span></span>')
               .addClass(el.className).addClass(c);
      return $e.wrap($s).parent().parent();
    }
    switch(el.nodeName.toLowerCase()) {
    case "button": case "input":
      //TODO: style buttons
    break; case "select":
      //TODO: style select
    break; case "textarea":
      $span=wrap("ui-form-textarea");
    break; case "fieldset":
      $span=wrap("ui-form-fieldset");
      $("legend",el).addClass("ui-form")
      .each(function(){ wrap("ui-form-legend",this) });
    default: 
      $el.find("input, select, textarea, fieldset, button").form(o);
    break;
    }
    $el.addClass("ui-form");
    if($span) $el
      .mouseover(function(){ $span.addClass("hover"); })
      .mouseout(function(){ $span.removeClass("hover"); })
      .focus(function(){ $span.addClass("focus"); })
      .blur(function(){ $span.removeClass("focus"); });
    return true;
  }

})($);


//Speed Test
var speed = function(time,a,b){
  var t = new Date(); for(var i=0; (new Date())-t<time; i++) a(); i--;
  var t = new Date(); for(var j=0; (new Date())-t<time; j++) b(); j--;
  console.log("Speed Test("+time+"ms): ",Math.round(((j-i)/j)*100)+'% ',[i,j]);
  return [i,j];
};

var speedtest = function(times){
  var f = $("form:first"); var l=[]; var c=0,d=0;
  var a = function(){ f.clone().form(false); };
  var b = function(){ f.clone().form(true); };
  for(var i=0; i<times.length; i++) l.push(speed(times[i],a,b));
  for(var i=l.length; i-->0;) { c+=l[i][0]; d+=l[i][1]; }
  console.log("Average: ",Math.round(((d-c)/d)*100)+'% ',[c,d]);
}

var repeat = function(v,x){ var l=[]; for(var i=x; i-->0;) l.push(v); return l; }
var test = function(){ speedtest([400,600,800]); }
var longtest = function(){ speedtest([4000,4000,4000]); }
//$(test);
