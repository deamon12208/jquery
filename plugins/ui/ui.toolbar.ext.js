$.extend($.ui.toolbar.prototype.factory, {
  slider: function(args, tb){
    var item = $('<li class="ui-toolbar-slider">'
                    +'<div class="ui-toolbar-slider-track ui-slider-track">'
                      +'<div class="ui-slider-handle"></div>'
                    +'</div>'
                 +'</li>');
    
    $(tb.items).append(item);
    $(item).find(".ui-toolbar-slider").slider(args.slider);
  
    return item;
  },
  label: function(o, tb) {
    $.extend({
      caption: 'label'
    }, o);
    var item = $(
      '<li class="ui-toolbar-label">'+
        '<span>'+
          o.caption+
        '</span>'+
      '</li>'
    );
    return item;
  },
  input: function(desc, tb){
    /*var options  = {
      keyDown: function(){},
      keyUp: function(){},
      focus: function(){},
      blur: function(){}
    };
    $.extend(options, desc);
    
    var tpl = new Array();
    tpl.push(
      '<li class="ui-toolbar-input">',
        '<span class="ui-toolbar-input-left"><i>&#160;<'+'/i><'+'/span>',
        '<span class="ui-toolbar-input-center">',
          '<input type="text" value=""/>',
        '<'+'/span>',
        '<span class="ui-toolbar-input-right"><i>&#160;<'+'/i><'+'/span>',
      '</li>'
    );
    var template = tpl.join('');
    
    var item = $(template);
    
    $.data(item, 'options', options);
    return item;*/
    alert("disabled");
  },
  toggle: function(desc, tb){
    options = {
      caption: 'button',
      onActivate: function(){
        alert("Toggled "+desc.caption+" to active.");
      },
      onDeactivate: function(){
        alert("Toggled "+desc.caption+" to inactive");
      },
      onMouseOver: function(){},
      onMouseOut: function(){}
    };
    $.extend(options, desc);
    
    var toolbarBtnT_tpl = new Array();
    
    toolbarBtnT_tpl.push(
      '<li class="ui-toolbar-btn">',
        '<span class="ui-toolbar-btn-left"><i>&#160;<'+'/i><'+'/span>',
          '<span class="ui-toolbar-btn-center">',
            '<button><span>'+desc.caption+'</span></button>',
          '<'+'/span>',
        '<span class="ui-toolbar-btn-right"><i>&#160;<'+'/i><'+'/span>',
      '</li>'
    );
    
    var template = toolbarBtnT_tpl.join('');
    
    var toggled = false;
    
    var item = $(template).bind("click", function(){
      var o = $.data(item, 'options');
      if(!($(this).is('.ui-toolbar-btn-disabled'))){
        if(!toggled){
          $(this).addClass('ui-toolbar-btn-active');
          if ($.isFunction(o.onActivate) ) {
            o.onActivate(item);
          }
          toggled = true;
        }else{
          $(this).removeClass('ui-toolbar-btn-active');
          if ($.isFunction(o.onDeactivate) ) {
            o.onDeactivate(item);
          }
          toggled = false;
        }
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
    $.data(item, 'options', options);
    return item;
  },
  radiogroup: function(desc, tb){
    var self = this;
    var options  = {
      selected: 0 // 0 equals none selected
    };
    $.extend(options, desc);
    
    if(options.items){
      var item = $('<li class="ui-toolbar-radioGrp"></li>');
      $(item).append("<ul>").find("ul").addClass(self.orient);
      
      $.each(options.items, function(i){
        var currentItem = options.items[i];
        
        var cOptions = {
          caption: 'button',
          onSelect: function(el,options){
            alert("selected: "+options.caption);
          },
          onDeselect: function(el, options){
            alert("deselected: "+options.caption);
          },
          onMouseOver: function(){},
          onMouseOut: function(){}
        };
        $.extend(cOptions, currentItem);
        
        var toolbarBtnT_tpl = new Array();
        toolbarBtnT_tpl.push(
          '<li class="ui-toolbar-btn">',
            '<span class="ui-toolbar-btn-left"><i>&#160;<'+'/i><'+'/span>',
              '<span class="ui-toolbar-btn-center">',
                '<button><span>'+cOptions.caption+'</span></button>',
              '<'+'/span>',
            '<span class="ui-toolbar-btn-right"><i>&#160;<'+'/i><'+'/span>',
          '</li>'
        );
        var template = toolbarBtnT_tpl.join('');
        
        
        
        var _item = $(template).bind("click", function(){
          var o = $.data(_item, 'options');
          if(!($(this).is('.ui-toolbar-btn-disabled'))){
            if($(this).is('.ui-toolbar-btn-active')){
              $(this).removeClass("ui-toolbar-btn-active");
              if ($.isFunction(o.onDeselect) ) {
                o.onDeselect(item, o);
              }
            }else{
              $(this).parent().children().each(function(){
                $(this).removeClass("ui-toolbar-btn-active");
              });
              $(this).addClass("ui-toolbar-btn-active");
              if ($.isFunction(o.onSelect) ) {
                o.onSelect(item,o);
              }
            }
          }
        })
        .bind("mouseover", function(){
          var o = $.data(_item, 'options');
          $(this).addClass('ui-toolbar-btn-over');
          if ($.isFunction(o.onMouseOver)) {
            o.onMouseOver(item);
          }
        })
        .bind("mouseout", function(){
          var o = $.data(_item, 'options');
          $(this).removeClass('ui-toolbar-btn-over');
          if ($.isFunction(o.onMouseOut)) {
            o.onMouseOut(item);
          }
        }).appendTo($(item).find("ul"));
        
        if(i+1 == options.selected){
          $(_item).addClass("ui-toolbar-btn-active");
        }
        $.data(_item, 'options', cOptions);
      });
      return item;
    }
  }
});