/* Themes - Sean Catchpole - MIT License */
(function($){

	$.fn.themes = function(o) {
		return $.themes(this,o);	
	}

  $.themes = function(el, o){
    if(!el.jquery) el = $(el);
    el = el || $("body");
    o = $.extend({},o);
    var t = function(){ for(i in o) el.removeClass(i); el.addClass(this.value); };
    var d,i,s = $("<select>").addClass("themes").change(t).keyup(t);
    for(i in o) {
      $("<option>").val(i).html(o[i]).appendTo(s);
      if(t=el.filter('.'+i),t.length) d=i;
    }
    t = (d)?$("[@value='"+d+"']",s):$(":first",s);
    t.attr('selected',true);
    return s;
  }

  $.themes.version = "1.0";

})(jQuery);
