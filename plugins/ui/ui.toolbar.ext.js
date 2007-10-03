$.extend($.ui.toolbar.prototype.factory, {
  slider: function(args){
    return false;
    
    var item = $('<li class="ui-toolbar-slider">'
                    +'<div class="ui-toolbar-slider-track">'
                      +'<div class="ui-toolbar-slider-handle"></div>'
                    +'</div>'
                 +'</li>');
    
    $(item).append(this.items);
    $(item).find(".ui-toolbar-slider").slider(args.slider);
  
    return item;
  },
  toggle: function(desc, tb){
    options = {
      onActivate: function(){
        alert("Toggled "+desc.caption+" to active.");
      },
      onDeactivate: function(){
        alert("Toggled "+desc.caption+" to inactive");
      },
      onMouseOver: function(){},
      onMouseOut: function(){}
    };
    $.extend(desc, options);
    
    var toolbarBtnT_tpl = new Array();
    
    toolbarBtnT_tpl.push(
      '<li class="ui-toolbar-btn">',
        '<span class="ui-toolbar-btn-left"><i>&#160;<'+'/i><'+'/span>',
          '<span class="ui-toolbar-btn-center">',
            '<button><span>{{text}}</span></button>',
          '<'+'/span>',
        '<span class="ui-toolbar-btn-right"><i>&#160;<'+'/i><'+'/span>',
      '</li>'
    );
    
    template = $.ui.template(toolbarBtnT_tpl, {'text': desc.caption});
    
    var toggled = false;
    
    var item = $(template).bind("click", function(){
      if(!($(this).is('.ui-toolbar-btn-disabled'))){
        if(!toggled){
          $(this).addClass('ui-toolbar-btn-active');
          if ($.isFunction(desc.onActivate) ) {
            desc.onActivate();
          }
          toggled = true;
        }else{
          $(this).removeClass('ui-toolbar-btn-active');
          if ($.isFunction(desc.onDeactivate) ) {
            desc.onDeactivate();
          }
          toggled = false;
        }
      }
    })
    .bind("mouseover", function(){
      $(this).addClass('ui-toolbar-btn-over');
      if ($.isFunction(desc.onMouseOver)) {
        desc.onMouseOver();
      }
    })
    .bind("mouseout", function(){
      $(this).removeClass('ui-toolbar-btn-over');
      if ($.isFunction(desc.onMouseOut)) {
        desc.onMouseOut();
      }
    });
    
    return item;
  }
});