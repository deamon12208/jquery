/* Copyright (c) 2006 Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 */

/**
 * Much like the wrap method but wraps the contents of the element.
 * See the docs for wrap...
 * @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 */
jQuery.fn.innerWrap = function() {
	var a, args = arguments;
	return this.each(function() {
		if (!a)
			a = jQuery.clean(args, this.ownerDocument);
		// Clone the structure that we're using to wrap
		var b = a[0].cloneNode(true),
		  c = b;
		// Find the deepest point in the wrap structure
		while ( b.firstChild )
			b = b.firstChild;
		// append the child nodes to the wrapper
		jQuery.each(this.childNodes, function(i, node) { 
			b.appendChild(node); 
		});
		jQuery(this)
			// clear the element
			.empty()
			// add the new wrapper with the previous child nodes appeneded
			.append(c);
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
    name: '',
    title: '',
    buttons: 'right',
    open: function(e, ui) {
      if(typeof ui.options.animation == 'Object') {
        // Not sure if this works...
        $(ui.modal).animate(ui.options.animation, ui.options.speed);
      }
      else if(ui.options.animation == 'none') {
        $(ui.modal).show(0);
      }
      else if(ui.options.animation == 'fade') {
        $(ui.modal).fadeIn(ui.options.speed);
      }
      else if(ui.options.animation == 'scale') {
        $(ui.modal).find('*').each(function(i, n) {
          $(n).css('overflow', $(n).attr('modalRestoreOverflow'));
        });
        $(ui.modal).show(ui.options.speed);
      }
      else {
        $(ui.modal)[ui.options.animation](ui.options.speed);
      }
    },
    close: function(e, ui) {
      if(ui.options.outRemove == true) {
        var f = function() {
          $(this).remove();
        };
      }
      else {
        var f = function() {};
      }
      if(typeof ui.options.animation == 'Object') {
        // Not sure if this works...
        $(ui.modal).apply('animation', ui.options.animation);
      }
      else if(ui.options.animation == 'none') {
        $(ui.modal).remove();
      }
      else if(ui.options.animation == 'fade') {
        $(ui.modal).fadeOut(ui.options.speed, f);
      }
      else if(ui.options.animation == 'scale') {
        $(ui.modal).find('*').each(function(i, n) {
          var c = $(n).css('overflow');
          $(n).attr('modalRestoreOverflow', c);
          $(n).css('overflow', 'hidden');
        });
        $(ui.modal).hide(ui.options.speed, f);
      }
      else if(ui.options.animation == 'slide') {
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
    resize: {
      handles: {
        s: 'div.bottom.pane',
        se: 'div.bottom.pane span.se',
        e: 'div.right.pane' 
      }
    },
    drag: {
      handle: 'div.top.pane'
    },
    overflow: true,
    buttonMarkup: '<a class="close">x</a>',
    width: 400,
    height: 400,
    animation: 'none',
    speed: 'fast',
    outRemove: false
  };
  $.extend(options, o);
  this.options = options;
  var self = this;
  var bu = $("<span>").addClass('buttons').html(options.buttonMarkup);
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