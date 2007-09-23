/*
 (9:31:00 AM) Miksago:  (9:21:24 AM) Miksago:  this error with them appearing in the wrong places is really odd.
(9:31:00 AM) Miksago:  (9:23:09 AM) Miksago:  this is the firebug console, i'm logging all the info the command is given.
(9:31:00 AM) Miksago:  (9:23:10 AM) Miksago:  http://pastebin.digitalspaghetti.me.uk/?show=15
(9:31:00 AM) Miksago:  (9:24:12 AM) Miksago:  and this the generated DOM http://pastebin.digitalspaghetti.me.uk/?show=16
(9:31:00 AM) Miksago:  (9:24:20 AM) Miksago:  can anyone explain it?
(9:32:10 AM) Miksago:  hangon.. wtf? it's being inserted at two spots
(9:32:40 AM) Miksago:  it's being in inserted in .toaster.tr in both the body and the inner
 
 
*/
(function($) {
  $.fn.log = function(array){
    if(typeof window.console != "undefined"){
      console.log(array);
    }
  }
  // It's messy but..
  
  //If the UI scope is not availalable, add it
	$.ui = $.ui || {};
  
  	
	// Add the UI Naming seed, this is a custom function used in plugin.
	// the Naming seed based function:
	// 	@ returns a string like: myId-1

	var uiIdSeed = uiIdSeed || 0;
	$.ui.uuid = function(prefix){
		return prefix +"-" + (++uiIdSeed);
	}
  $.ui.template = function(template, items){
    if(template instanceof Array){
      template = template.join("");
    }
    $.each(items, function(key, value){
      regex = eval('/\{\{'+key+'\}\}/g');
      template = template.replace(regex, value);
    });
    return template;
  }

  

  $.fn.toaster = function(settings){
    element = this;
    $(document).log([element, settings]);
    return $.ui.toaster(element, settings);
  }
  var positions = new Array();
  positions[0] = "tr";
  positions[1] = "tl";
  positions[2] = "br";
  positions[3] = "bl";
  
  $.ui.toasterInit = function(el, p){
    if(!$(el).find(".toaster").is("."+positions[p])){
      $('<div class="toaster '+positions[p]+'"></div>').appendTo(el);
    }
  }
  
  var toasterCount = 0;
  
  $.ui.toaster = function(el, settings){
    toasterCount++;
    var options = $.extend({
      name: '',
      data: '',
      timeout: 3,
      position: 2, // tr: 0, tl: 1, br: 2, bl: 3.
      closable: false,
      requireClose: false,
      //animation: "slideDown", // slidedown, slideup
      animationSpeed: 500,
      // callbacks
      show: function(){$(document).log(options.name +" : shown");},
      hide: function(){$(document).log(options.name +" : hidden");}
    }, settings);
    
    var p = options.position;
    var id = $.ui.uuid("ui-toast");
    
    
    // set up toasters on the page.
    $.ui.toasterInit(el, p);
    
    var template = new Array();
    
    template.push(
      '<div id="{{id}}" class="toast" style="display:none;">'
      +'<div class="toastName">{{name}}'
    );
    if(options.closable){
      template.push('<div class="ui-toast-close" style="display:none;">X</div>');
    }
    template.push('</div>'
      +'<div class="toastData">{{data}}</div>'
      +'</div>'
    );
    
    html = $.ui.template(template, {'id':id,'name': options.name, 'data': options.data});
    html = $(html);
    
    $(el).find(".toaster."+positions[p]).append(html);
    $("#"+id).slideToggle(500, function(){$("#"+id).find('.ui-toast-close').css('display','block'); options.show();});
    
    if(options.closable){
      $("#"+id).find(".ui-toast-close").click(function(){
        justClosed = false;
        $("#"+id).slideToggle(500, function(){
          $(this).css("display","none").css("visibility","hidden").css("height", "0px");
          $(this).remove();
          options.hide();
          if(toasterCount==0){
            setTimeout(function(){
              $(el).find(".toaster."+positions[p]).remove();
            }, 250);
          }
          toasterCount--;
        });
      });
    }
    
    var justClosed = true;
    
    if(!options.requireClose && justClosed){
      window.setTimeout(function(){
        $("#"+id).slideToggle(500, function(){
          $(this).css("display","none").css("visibility","hidden").css("height", "0px");
          $(this).remove();
          options.hide();
          if(toasterCount==0){
            setTimeout(function(){
              $(el).find(".toaster."+positions[p]).remove();
            }, 250);
          }
          justClosed = false;
          window.setTimeout(function(){justClosed = true;}, 1000*options.timeout);
          toasterCount--;
        });
      }, 1000*options.timeout);
    }
  }
  
})(jQuery);