/*

  <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
    "http://www.w3.org/TR/html4/loose.dtd">
  <html>
    <head>
      <meta http-equiv="Content-type" content="text/html; charset=utf-8">
      <title>Templating</title>
      <script src="../../jquery/dist/jquery.min.js"></script>
      <script src="jquery.templating.js"></script>
      <script>
        jQuery(function($) {
          $("a.loadTemplate").click(function() {
            $(this.rel).loadTemplate(this.href);
            return false;
          })
        });
      </script>
    </head>
    <body>
      <div id="nameTemplate" template='My name is {{first}} {{last}} -- {{parseInt(number)}}'></div>
      <a href="foo" class="loadTemplate" rel="#nameTemplate">Load template</button>  
    </body>
  </html>
  
*/

(function($) {
  
  $.makeTemplate = function(str) {
    str = str.replace("'", "\\'"); 
    return new Function("_obj", "with(_obj) { return '" + str.replace(/\{\{(.*?)\}\}/g, "' + $1 + '") + "' }");
  };
  
  $.fn.loadTemplate = function(href) {
    return this.each(function() { 
      var self = this;
      $.getJSON(href, function(json) {
        var template = $.makeTemplate($(self).attr("template"));
        console.log(template.toSource());
        $(self).html(template(json));
      });
    });
  };

})(jQuery);