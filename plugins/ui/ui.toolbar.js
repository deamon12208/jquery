(function($) {
/* ui.toolbar.js
 *
 *  Written:  01/09/07 7:25:06 PM
 *  Revision: 1.0.0
 *
 *
 * Credits:
 *  Miksago: Implementation and coding.
 */

	//If the UI scope is not availalable, add it
	$.ui = $.ui || {};
  
  $.fn.toolbar = function(options){
    return $(this).each(function() {
      new $.ui.toolbar(this, options);
    });
  }
  /* might be worth while keeping : */
  $.ui.toolbarInstance = function(){
    return $(this[0]).is(".ui-toolbar") ? $.data(this[0], "ui-toolbar") : false;
  }
  
  $.fn.toolbarApply = function(m, args) {
    var apply = $(this).filter(".ui-toolbar").each(function() {
  		var inst = $.data(this, "ui-toolbar");
      inst[m].apply(inst, args);
  	}).end();
    return apply;
  };
  
  var uiToolbarFunctions = ['Add', 'Remove', 'Empty', 'Get', 'Enable', 'Disable', 'Mode', 'Orient'];
  
  $.each(uiToolbarFunctions, function(i,m) {
  	$.fn['toolbar'+m] = new Function('this.toolbarApply("'+m.toLowerCase()+'",arguments);');
  });
  
  $.ui.toolbar = function(el, o){
    this.element = el;
    this.options = $.extend({
			orient: 'horizontal',
			mode: 'both',
			tooltips: false,
      items: {}
		}, o);

    this.items = $("ul:first", this.element).length ? $("ul:first") : $("<ul>");
    
    this.items.addClass("ui-toolbar-items");
    
    $(this.element).addClass("ui-toolbar").append(this.items);
    
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
    
    if(typeof this.options.items == Array && this.options.items.length > 0){}
    
    $.data(this.element, "ui-toolbar", this);
  }
$.extend($.ui.toolbar.prototype, {
    get: function(n) {
      var item;
    	if (n && n.constructor == Number) {
    		item = $(this.items).children().slice(n-1, n);
      }else{
        item = $(this.items).children().slice($(this.items).children().length-1, $(this.items).children().length);
      }
      return item;
    },
    enable: function(n){
      var item;
      if(n){
        item = $(this.get(n)).removeClass('ui-toolbar-btn-disabled');
      }else{
        item = $(this.element).removeClass('ui-toolbar-btn-disabled');
      }
      return item;
    },
    disable: function(n){
      var item;
      if(n){
        item = $(this.get(n)).addClass('ui-toolbar-btn-disabled');
      }else{
        item = $(this.element).addClass('ui-toolbar-btn-disabled');
      }
      return item;
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
          var iconEl;
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
              iconEl = $(btn).find(".ui-toolbar-btn-center").prepend('<span class="ui-toolbar-btn-icon '+icon+'">&nbsp;</span>');
            }else{
              iconEl = $(btn).find(".ui-toolbar-btn-center").prepend('<span class="ui-toolbar-btn-icon">&nbsp;</span>').find(".ui-toolbar-btn-icon").css("background-image","url("+icon+")");
            }
          }
          return iconEl;
        },
        remove: function(btn){
          $(btn).find(".ui-toolbar-btn-icon").remove();
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
          onClick: function(item, options){
            alert("Fired: "+options.caption);
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
                '<button><span class="ui-toolbar-btn-desc">'+options.caption+'</span></button>',
              '<'+'/span>',
              '<span class="ui-toolbar-btn-right"><i>&#160;<'+'/i><'+'/span>',
            '</li>'
          );
          
        var template = toolbarBtn_tpl.join('');
        
        var item = $(template).bind("click", function(){
          var o = $.data(item, 'options');
          if ($.isFunction(o.onClick) && !($(this).is('.ui-toolbar-btn-disabled'))) {
            o.onClick(item, o);
          }
        })
        .bind("mouseover", function(){
          $(this).addClass('ui-toolbar-btn-over');
          var o = $.data(item, 'options');
          if ($.isFunction(o.onMouseOver)) {
            o.onMouseOver(item);
          }
        })
        .bind("mouseout", function(){
          $(this).removeClass('ui-toolbar-btn-over');
          var o = $.data(item, 'options');
          if ($.isFunction(o.onMouseOut)) {
            o.onMouseOut(item);
          }
        });
        
        $.ui.toolbar.prototype.factory.icon.add(item, desc.icon);
        
        if($(this.element).is(".ui-toolbar-btn-hidingText")){
          $(item).find(".ui-toolbar-btn-center").addClass('ui-toolbar-btn-hideText');
        }
        $.data(item, 'options', options);
        return item;
      }
    }
});
  
})(jQuery); 