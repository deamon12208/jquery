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
      if(!($(this).is('.ui-toolbar-btn-disabled'))){
        if(!toggled){
          $(this).addClass('ui-toolbar-btn-active');
          if ($.isFunction(options.onActivate) ) {
            options.onActivate(item);
          }
          toggled = true;
        }else{
          $(this).removeClass('ui-toolbar-btn-active');
          if ($.isFunction(options.onDeactivate) ) {
            options.onDeactivate(item);
          }
          toggled = false;
        }
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
    
    return item;
  },
  radiogroup: function(desc, tb){
    var self = this;
    var options  = {
      selected: 0 // 0 equals none selected
    };
    $.extend(options, desc);
    
    if(desc.items){
      var item = $('<li class="ui-toolbar-radioGrp"></li>');
      $(item).append("<ul>").find("ul").addClass(self.orient);
      
      $.each(desc.items, function(i){
        var currentItem = desc.items[i];
        
        var options = {
          caption: 'button',
          onSelect: function(){
            alert("selected: "+options.caption);
          },
          onDeselect: function(){
            alert("deselected: "+options.caption);
          },
          onMouseOver: function(){},
          onMouseOut: function(){}
        }
        $.extend(options, currentItem);
        
        console.log(currentItem)
        
        var toolbarBtnT_tpl = new Array();
        toolbarBtnT_tpl.push(
          '<li class="ui-toolbar-btn">',
            '<span class="ui-toolbar-btn-left"><i>&#160;<'+'/i><'+'/span>',
              '<span class="ui-toolbar-btn-center">',
                '<button><span>'+currentItem.caption+'</span></button>',
              '<'+'/span>',
            '<span class="ui-toolbar-btn-right"><i>&#160;<'+'/i><'+'/span>',
          '</li>'
        );
        var template = toolbarBtnT_tpl.join('');
        
        
        
        var _item = $(template).bind("click", function(){
          if(!($(this).is('.ui-toolbar-btn-disabled'))){
            if($(this).is('.ui-toolbar-btn-active')){
              $(this).removeClass("ui-toolbar-btn-active");
              if ($.isFunction(options.onDeselect) ) {
                options.onDeselect(item);
              }
            }else{
              $(this).parent().children().each(function(){
                $(this).removeClass("ui-toolbar-btn-active");
              });
              $(this).addClass("ui-toolbar-btn-active");
              if ($.isFunction(options.onSelect) ) {
                options.onSelect(item);
              }
            }
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
        }).appendTo($(item).find("ul"));
        
        if(i+1 == desc.selected){
          $(_item).addClass("ui-toolbar-btn-active");
        }
      });

      return item;
    }
  }
});