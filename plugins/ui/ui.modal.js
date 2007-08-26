/**
 * Kudos to Konstantin Käfer (kkaefer)
 */
jQuery.fn.innerWrap = function(u) {
  return this.each(function() {
    var w = $(u)[0], v = w;
    while (v.firstChild) v = v.firstChild;
    while (this.firstChild) v.appendChild(this.firstChild);
    this.appendChild(w);
  });
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
      .innerWrap("<div class='center pane'></div>")
      .innerWrap("<div class='middle pane'></div>")
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
        se: 'div.bottom.pane span.ui-modal-resize-se',
      }
    },
    // Options specific to $().draggable
    drag: {
      handle: 'div.top.pane'
    },
    // Allow overflow/scrolling
    overflow: true,
    // Override button markup optionally
    buttonMarkup: '<a class="ui-modal-button-close">X</a>',
    // Width of the modal
    width: 400,
    // Height
    height: 350,
    // Animation.  Look at open above for possible values
    animation: 'none',
    // Animation speed
    speed: 'fast',
    // Remove when exiting
    outRemove: false
  };
  $.extend(options, o);
  var self = this;
  // Ensure the options carry through
  self.options = options;
  // Buttons
  var bu = $("<span>").addClass('ui-modal-buttons').addClass('ui-modal-buttons-'+ options.buttons).html(options.buttonMarkup);
  // Title
  var ti = $('<span>').addClass('ui-modal-title').html(options.title);
  // Title bar
  var t = $('<div>').addClass('ui-modal-title-bar');
  if(options.buttons == 'left') {
    // Append the buttons and then the title,
    // because the buttons are on the left
    t.append(bu).append(ti);
  }
  else {
    // Other way around
    t.append(ti).append(bu);
  }
  // Attach close
  t.find('.ui-modal-buttons a.ui-modal-button-close').click(function(e) {
    // Trigger the close function
    $.ui.trigger('close', self, e, {options: self.options, modal: el});
  });
  // Resize item
  var b = $('<span>').html('').addClass("ui-modal-resize-se");
  // Open the modal
  $.ui.trigger('open', self, {}, {options: self.options, modal: el });
  $.extend(options, {
    uiBox: {
      top: t,
      bottom: b,
      left: '&nbsp;'
    }
  });
  // Add a uibox
  $(el).uiBox(options.uiBox)
  .addClass('ui-modal')
  .css({ position: "absolute", width: options.width, height: options.height })
  .resizable(options.resize)
  .draggable(options.drag)
  .appendTo("body");
  // What to add to the manager
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
    $.ui.add(options.name, 'modal', uiobj);
  }
  return el;
}

})(jQuery);
