/* Copyright (c) 2006 Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 */

/**
 * Much like the wrap method but wraps the contents of the element.
 * See the docs for wrap...
 * @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 */
jQuery.fn.innerWrap = function(u) {
	return $(this).html($(u).html($(this).html()));
};

jQuery.fn.uiBox = function(arg){
  return typeof arg == "string" ?
    this.pushStack(jQuery.map(this, function(elem){
      var middle = elem.firstChild.nextSibling;
      return  arg == "top" && elem.firstChild ||
        arg == "bottom" && elem.lastChild ||
        arg == "middle" && middle ||
        arg == "left" && middle.firstChild ||
        arg == "center" && middle.firstChild.nextSibling ||
        arg == "right" && middle.lastChild ||
        null;
    })) :
    this
      .addClass("uiBox")
      .innerWrap("<div class='middle pane'><div class='center pane'></div></div>")
      .prepend("<div class='top pane'></div>")
      .append("<div class='bottom pane'></div>")
      .uiBox("middle")
        .prepend("<div class='left pane'></div>")
        .append("<div class='right pane'></div>")
      .end().each(function(i,elem){
        jQuery.each( arg || {}, function(name, value){
          jQuery(elem).uiBox(name)
            [jQuery.isFunction(value) ? "each" : "append"](value);
        });
      });
};
(function($) {
$.fn.modal = function(o){
  return $(this).each(function() {
    $.ui.modal(this, o);
  });
}
$.ui.modal = function(el, o) {
  var options = {
    // Internal name - used in $.ui.get
    name: '',
    // Title
    title: '',
    // Location of the buttons
    buttons: 'right',
    // Open event
    open: function(e, ui) {
      // If it's an object, pass it to $().animate();
      if(typeof ui.options.animation == 'Object') {
        $(ui.modal).animate(ui.options.animation, ui.options.speed);
      }
      // No animation
      else if(ui.options.animation == 'none') {
        $(ui.modal).show(0);
      }
      // Fade
      else if(ui.options.animation == 'fade') {
        $(ui.modal).fadeIn(ui.options.speed);
      }
      // Scale
      else if(ui.options.animation == 'scale') {
        $(ui.modal).find('*').each(function(i, n) {
          $(n).css('overflow', $(n).attr('modalRestoreOverflow'));
        });
        $(ui.modal).show(ui.options.speed);
      }
      else {
        // Custom animation
        $(ui.modal)[ui.options.animation](ui.options.speed);
      }
    },
    close: function(e, ui) {
      // Optionally remove it when animation is done
      if(ui.options.outRemove == true) {
        var f = function() {
          $(this).remove();
        };
      }
      else {
        var f = function() {};
      }
      // Refer to the open above for all these options
      if(typeof ui.options.animation == 'Object') {
        $(ui.modal).animate(ui.options.animation, ui.options.speed);
      }
      else if(ui.options.animation == 'none') {
        $(ui.modal).remove();
      }
      else if(ui.options.animation == 'fade') {
        $(ui.modal).fadeOut(ui.options.speed, f);
      }
      else if(ui.options.animation == 'scale') {
        // We set the overflow to hidden on every element to prevent scrolling when scaling.
        // The overflow is restored when the window is opened
        $(ui.modal).find('*').each(function(i, n) {
          var c = $(n).css('overflow');
          $(n).attr('modalRestoreOverflow', c);
          $(n).css('overflow', 'hidden');
        });
        $(ui.modal).hide(ui.options.speed, f);
      }
      else if(ui.options.animation == 'slide') {
        // Ditto to above
        $(ui.modal).find('*').each(function(i, n) {
          var c = $(n).css('overflow');
          $(n).attr('modalRestoreOverflow', c);
          $(n).css('overflow', 'hidden');
        });
        $(ui.modal).slideUp(ui.options.speed, f);
      }
      else {
        $(ui.modal)[ui.options.animation](ui.options.speed, f);
      }
    },
    // Options specific to $().resizable
    resize: {
      handles: {
        s: 'div.bottom.pane',
        se: 'div.bottom.pane span.se',
        e: 'div.right.pane' 
      }
    },
    // Options specific to $().draggable
    drag: {
      handle: 'div.top.pane'
    },
    // Allow overflow/scrolling
    overflow: true,
    // Override button markup optionally
    buttonMarkup: '<a class="close">x</a>',
    // Width of the modal
    width: 400,
    // Height
    height: 400,
    // Animation.  Look at open above for possible values
    animation: 'none',
    // Animation speed
    speed: 'fast',
    // Remove when exiting
    outRemove: false
  };
  $.extend(options, o);
  var self = this;
  self.options = options;
  var bu = $("<span>").addClass('buttons').addClass(options.buttons).html(options.buttonMarkup);
  var ti = $('<span>').addClass("title").html(options.title);
  var t = $('<div>');
  if(options.buttons == 'left') {
    t.append(bu).append(ti);
  }
  else {
    t.append(ti).append(bu);
  }
  t.find('.buttons a.close').click(function(e) {
    $.ui.trigger('close', self, e, {options: self.options, modal: el});
  });
  var b = $('<span>').html('').addClass("se");
  $.ui.trigger('open', self, {}, {options: self.options, modal: el });
  $(el).uiBox({top:t,bottom:b})
  .css({ position: "absolute", top: 20, left: 30, width: options.width, height: options.height })
  .resizable(options.resize)
  .draggable(options.drag)
  .appendTo("body");
  var uiobj = {};
  uiobj.options = this.options;
  uiobj.el = $(el);
  uiobj.close = function() {
    this.options.close({}, {options: this.options, modal: this.el });
  }
  uiobj.open = function() {
    this.options.open({}, {options: this.options, modal: this.el });
  }
  if(options.name != '') {
    // Add it to $.ui.manager here
    $.ui.add(options.name, 'modal', uiobj);
  }
  return el;
}

})(jQuery);