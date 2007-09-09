
load('../../../jquery/build/runtest/env.js');

window.location = "run.html";

load("../../../jquery/src/core.js");
load("../../../jquery/src/selector.js");
load("../../../jquery/src/event.js");
load("../../../jquery/src/ajax.js");
load("../../../jquery/src/fx.js");
load("chili/chili.ss.js");


ChiliBook.recipeFolder = "chili/";
ChiliBook.stylesheetFolder = "chili/";

function highlightCode(code, lang) {
  var o = $('body').html('<code class="'+ lang +'"></code>').find('code').text(code).chili().html();
  $('code').remove();
  return o;
}

function sanitize(str) {
  var s = str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/>/g, '&gt;').replace(/</g, '&lt;');
  return s;
  //throw s;
}
function id(str1, str2) {
  return str1.toLowerCase().replace(/[^0-9a-zA-Z]/g, '_') +'-'+ str2.toLowerCase().replace(/[^0-9a-z]/, '_');
}


$.fn.listRender = function() {
  var list = $(this), output = $('<ul></ul>');
  list.children().each(function() {
    if (this.tagName == 'list') {
      output.append("<li><h3>"+ $(this).attr('title') +"</h3>" + $(this).listRender() +"</li>");
    }
    else {
      output.append('<li><a href="#'+ $(this).attr('rel') +'">'+ $(this).text() +"</a></li>");
    }
  });
  return $(output).outerHTML();
}

$.fn.demoRender = function() {
  var output = { js: "", html: "" }, _o = {}, __o = {}, _t = "", _h = "";
  $(this).children().each(function() {
    if ($(this)[0].tagName == 'demoset') {
      var self = this;
      _t = '<ul>';
      $(this).children().each(function() {
        var i = id($(self).attr('name'), $(this).attr('title'));
        _t += '<li><a href="#'+ i +'">'+ $(this).attr('title') +'</a></li>';
        __o = $(this)._demoRender();
        _o.js += __o.js;
        _h += '<div id="'+ i +'">'+ __o.html +'</div>';
      });
      _t += "</ul>";
      _o.html = '<div class="tabset" id="'+ $(this).attr('name') +'">'+ _t + _h +'</div>';
    }
    else {
      __o = $(this)._demoRender();
      __o.html = '<div class="demo" id="'+ $(this).attr('name') +'">'+ __o.html +'</div>';
      _o = __o;
    }
    output.js += _o.js;
    output.html += _o.html;
  });
  return output;
}

$.fn._demoRender = function() {
  var output = {};
  output.js = $(this).find('javascript').html();
  output.html = '<div class="description">'+ $(this).find('description').html() +'</div>';
  output.html += '<div class="chilihtml">HTML:<pre class="html">'+  highlightCode($(this).find('html').html(), 'html') +'</pre></div>';
  output.html += '<div class="chilijs">JavaScript:<pre class="javascript">'+  highlightCode($(this).find('javascript').html(), 'javascript') +'</pre></div>';
  output.html += 'Demo:<div class="actual-demo">'+ $(this).find('html').html() +'</div>';
  return output;
}

/**
 * http://blog.brandonaaron.net/2007/06/17/jquery-snippets-outerhtml/
 */
jQuery.fn.outerHTML = function() {
    return $('<div></div>').append( this.slice(0,1).clone()).html();
};

function demoize() {
  
  var file = readFile('demo.xml');
  
  var rendered_demos = $(file).find('individual_demos').demoRender();
  
  print('<html>\n\t<head>\n');
  // TODO: We still have to work out where in the directory stucture this will be placed.
  // Temporary fix for now
  var files = [
    "../../../jquery/src/core.js",
    "../../../jquery/src/selector.js",
    "../../../jquery/src/event.js",
    "../../../jquery/src/ajax.js",
    "../../../jquery/src/fx.js",
    "../../../jquery/src/offset.js",
    "../ui.accordion.js",
    "../ui.demo.js",
    "../ui.download.js",
    //"../ui.draggable.ext.js",
    "../ui.draggable.js",
    //"../ui.droppable.ext.js",
    "../ui.droppable.js",
    "../ui.effects.js",
    "../ui.form.js",
    "../ui.magnifier.js",
    "../ui.menu.js",
    "../ui.modal.js",
    "../ui.mouse.js",
    "../ui.resizable.js",
    "../ui.selectable.js",
    "../ui.shadow.js",
    "../ui.slider.js",
    "../ui.sortable.js",
    "../ui.tabs.js",
    "../ui.test.js",
    "../ui.toolbar.js",
    "../ui.tree.js"
    //"chili/chili.pack.js"
  ];
  for (i = 0; i < files.length; i++) {
    print('\t\t<script type="text/javascript" src="'+ files[i] +'"></script>');
  }
  
  print('\t\t<script type="text/javascript">\n\t\t\t$(function(){');
  print(rendered_demos.js);
  print("$('.tabset').tabs();");
  print('\t\t\t});\n\t\t</script>');
  
  
  var styles = [
    '../../../themes/light/light.css',
    '../../../themes/light/light.tabs.css',
    '../../../themes/dark/dark.css',
    '../../../themes/dark/dark.tabs.css',
    '../../../themes/ui/ui.css',
    '../../../themes/ui/ui.resizable.css'
  ];
  for (i = 0; i < styles.length; i++) {
    print('\t\t<style>@import url('+ styles[i] +');</style>');
  }
  
  print('\n\t</head>\n\t<body class="dark">\n\t\t<div id="main">');
  print('\n\t\t\t<div id="nav">');
  
  print($(file).find('demolist').children().listRender());
  
  print('\n\t\t\t</div>');
  
  print('\t\t\t<div id="demos">');
  
  print(rendered_demos.html);
  
  print('\t\t\t</div>');
  
  print('\t\t</div>\n\t</body>\n</html>');
}
demoize();