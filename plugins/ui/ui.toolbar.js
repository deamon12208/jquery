(function($) {
/* ui.toolbar.js
 *
 *  Written:  01/09/07 7:25:06 PM
 *  Revision: 1.0.0
 *
 *
 * Credits:
 *  Eis_os: ideas and semi-implementation of the factory and addition of functions (the instances and all that)
 *  Miksago: Implementation and recoding.
 */

	//If the UI scope is not availalable, add it
	$.ui = $.ui || {};
  
  // Add the UI Naming seed if it doesn't exist, this is a custom function used in plugin.
	var uiIdSeed = uiIdSeed || 0;
	// the Naming seed based function:
	// 	@ returns a string like: myId-1
	$.ui.uuid = function(prefix){
		return prefix +"-" + (++uiIdSeed);
	}
/*
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
*/
  
  $.fn.toolbar = function(options){
    return this.each(function() {
      new $.ui.toolbar(this, options);
    });
  }
  /* might be worth while keeping : */
  $.ui.toolbarInstance = function(){
    return $(this[0]).is(".ui-toolbar") ? $.data(this[0], "ui-toolbar") : false;
  }
  
  $.fn.toolbarApply = function(m, args) {
  	return this.filter(".ui-toolbar").each(function() {
  		var inst = $.data(this, "ui-toolbar");
      inst[m].apply(inst, args);
  	}).end();
  };
  $.each(['Add', 'Remove', 'Empty', 'Get', 'Enable', 'Disable', 'Mode', 'Orient'], function(i,m) {
  	$.fn['toolbar'+m] = new Function('this.toolbarApply("'+m.toLowerCase()+'",arguments);');
  });
  
  $.ui.toolbar = function(el, o){
    this.element = el;
    this.options = $.extend({
			theme: 'default',
			orient: 'horizontal',
			mode: 'both',
			tooltips: false,
      items: {}
		}, o);

    this.items = $("ul:first", el).length ? $("ul:first") : $("<ul>");
    $(this.element).addClass("ui-toolbar").append(this.items.addClass("ui-toolbar-items"));
    
    if(this.options.orient == "vertical"){
      $(this.element).find("ul").addClass("ui-toolbar-vert");
      this.orient = "ui-toolbar-vert";
    }else{
      $(this.element).find("ul").addClass("ui-toolbar-horiz");
      this.orient = "ui-toolbar-horiz";
    }
    
    if(this.options.mode=='icons'){
      $(this.element).toolbarMode('icons');
    }
    
    this.iconState = 1;
    
    $.data(this.element, "ui-toolbar", this);
  }
$.extend($.ui.toolbar.prototype, {
    get: function(n) {
    	if (n && n.constructor == Number) {
    		return this.items.children().slice(n-1, n);
      }else{
        return this.items.children().slice(this.items.children().length-1, this.items.children().length);
      }
    },
    disable: function(n){
      if(n){
        $(this.get(n)).addClass('ui-toolbar-btn-disabled');
      }else{
        $(this.element).addClass('ui-toolbar-btn-disabled');
      }
    },
    enable: function(n){
      if(n){
        $(this.get(n)).removeClass('ui-toolbar-btn-disabled');
      }else{
        $(this.element).removeClass('ui-toolbar-btn-disabled');
      }
    },
    remove: function(n) {
    	this.get(n).remove();
    },
    add: function(){
      var item;
      for(var i=0; i<arguments.length; i++) {
        var item, arg = arguments[i];
        if(arg.constructor == String && arg == '-'){
          arg = {};
          desc = {};
          arg.type = 'sep';
          desc.type = 'sep';
        }else{
          var desc = {
            type: 'button'
          };
          $.extend(desc, arg);
          if(desc.type=='-') arg.type = 'sep';
        }
        if ($.isFunction(this.factory[arg.type])) {
          item = this.factory[arg.type](arg, this);
        }
        if (item == undefined) return;
        
        var children = this.items.children();
        if (desc.pos <= children.length) {
        	$(item).insertBefore(this.get(desc.pos));
        } else {
        	this.items.append(item);
        }
      }
    },
    mode: function(s){
      if(s && s == 'icons'){
        $(this.element).find("ul").addClass("ui-toolbar-icons");
        this.iconState++;
      }
      if(s && s != 'icons' && s == 'text'){
        $(this.element).find("ul").removeClass("ui-toolbar-icons");
        $(this.element).find("ul").addClass("ui-toolbar-text");
        this.iconState++;
      }
      else{
        if(this.iconState<2){
          $(this.element).find("ul").addClass("ui-toolbar-icons").removeClass("ui-toolbar-text");
        }
        if(this.iconState>1 && this.iconState<3){
          $(this.element).find("ul").addClass("ui-toolbar-text").removeClass("ui-toolbar-icons");
        }
        if(this.iconState>2){
          $(this.element).find("ul").removeClass("ui-toolbar-icons").removeClass("ui-toolbar-text");  
        }
        this.iconState++;
      }
      if(this.iconState>3){
        this.iconState = 1;
      }
    },
    orient: function(orient){
      if(orient && orient=='vert'){
        $(this.element).find("ul").addClass("ui-toolbar-vert").removeClass("ui-toolbar-horiz");
        this.orient = 'ui-toolbar-horiz';
      }if(orient && orient!='vert'){
        $(this.element).find("ul").addClass("ui-toolbar-horiz").removeClass("ui-toolbar-vert");
        this.orient = 'ui-toolbar-horiz';
      }else{
        $(this.element).find("ul").toggleClass("ui-toolbar-vert").toggleClass("ui-toolbar-horiz");
        if($(this.element).find("ul").attr("class").match("ui-toolbar-vert")){
          this.orient = 'ui-toolbar-vert';  
        }else{
          this.orient = 'ui-toolbar-horiz';
        }
      }
      return this.orient;
    },
    factory: {
      icon: {
        add: function(btn, icon, size){
          if(icon){
            switch(size){
              case 16: size = 'sixteen';
                break;
              case 24: size = 'twentyfour';
                break;
              case 32: size = 'thirtytwo';
                break;
              case 48: size= 'fortyeight';
                break;
              default: size = 'sixteen';
                break;
            }
            $(btn).addClass("ui-toolbar-btn-icon-"+size);
            
            if(icon.substr(0,1) == '.'){
              return $(btn).find(".ui-toolbar-btn-center").prepend('<span class="ui-toolbar-btn-icon '+icon+'">&nbsp;</span>');
            }else{
              return $(btn).find(".ui-toolbar-btn-center").prepend('<span class="ui-toolbar-btn-icon">&nbsp;</span>').find(".ui-toolbar-btn-icon").css("background-image","url("+icon+")");
            }
          }
        },
        remove: function(btn){
          return $(btn).find(".ui-toolbar-btn-icon").remove();
        },
        show: function(btn){
          return $(btn).find(".ui-toolbar-btn-icon").show();
        },
        hide: function(hide){
          return $(btn).find(".ui-toolbar-btn-icon").show();
        },
        toggle: function(btn){
          return $(btn).find(".ui-toolbar-btn-icon").toggle();
        }
      },
      sep: function(desc, o, tb) {
        var item = $(
          '<li class="ui-toolbar-sep">'+
            '<span>'+
            '</span>'+
          '</li>'
        );
        return item;
      },
      button: function(desc, tb) {
        options = {
          caption: 'button',
          icon: null,
          onClick: function(){
            alert("Fired: "+desc.caption);
          },
          onMouseOver: function(){},
          onMouseOut: function(){}
        };
        $.extend(options, desc);
          var toolbarBtn_tpl = new Array();
          toolbarBtn_tpl.push(
            '<li class="ui-toolbar-btn">',
              '<span class="ui-toolbar-btn-left"><i>&#160;<'+'/i><'+'/span>',
              '<span class="ui-toolbar-btn-center">',
                '<button><span class="ui-toolbar-btn-desc">'+desc.caption+'</span></button>',
              '<'+'/span>',
              '<span class="ui-toolbar-btn-right"><i>&#160;<'+'/i><'+'/span>',
            '</li>'
          );
          
        var template = toolbarBtn_tpl.join('');
        
        var item = $(template).bind("click", function(){
          if ($.isFunction(options.onClick) && !($(this).is('.ui-toolbar-btn-disabled'))) {
            options.onClick(item);
          }
        })
        .bind("mouseover", function(){
          $(this).addClass('ui-toolbar-btn-over');
          if ($.isFunction(options.onMouseOver)) {
            options.onMouseOver(item);
          }
        })
        .bind("mouseout", function(){
          $(this).removeClass('ui-toolbar-btn-over');
          if ($.isFunction(options.onMouseOut)) {
            options.onMouseOut(item);
          }
        });
        
        $.ui.toolbar.prototype.factory.icon.add(item, desc.icon);
        
        if($(this.element).is(".ui-toolbar-btn-hidingText")){
          $(item).find(".ui-toolbar-btn-center").addClass('ui-toolbar-btn-hideText');
        }
        
        return item;
      }
    }
});
  
})(jQuery); 