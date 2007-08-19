/**
 * Copyright Yehuda Katz
 * with assistance by Jay Freeman
 * 
 * You may distribute this code under the same license as jQuery (BSD or GPL
 **/

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
      jQuery(function ($) {
          $("a.updateTemplate").click(function() {
            $(this.rel).loadTemplate(this.href);
            return false;
          });
          $("._template").templatize();
      });
    </script>
  </head>
  <body>
    <div class="_template" id="myTemplate">
      <![CDATA[
        <{{tag}} href={{href}}>{{first}} {{last}}</{{tag}}>
        <p>Bar</p>
        <div>First Name: {{first}}</div>
        <div>Last Name: {{last}}</div>
      ]]>
    </div>
    <a href="foo" rel="#myTemplate" class="updateTemplate">Click</a>
  </body>
</html>
  
*/

(function ($) {
    $.makeTemplate = function(template) {
        var code = "with (_context) { return \'" + template
            .replace(/^<!(--)?\[CDATA\[/, '')
            .replace(/]]((--)?>|\&gt;)$/, '')
            .replace(/\n/g, '\\n')
            .replace(/'/g, "\\'")
            .replace(/\{\{(.*?)\}\}/g, "' + $1 + '")
        + "\' }";
        return new Function("_context", code);
    };

    $.fn.updateTemplate = function (json) {
      this.each(function () {
        $(this).html(this.$template(json));
      });
    };
    
    $.fn.templatize = function() {
      this.each(function () {
        this.$template = $.makeTemplate($(this).html());
        $(this).empty();
      });
    };
    
    $.fn.loadTemplate = function(href, callback) {
      return this.each(function() { 
        var self = this;
        $.getJSON(href, function(json) {
          $(self).html(self.$template(json));
          callback(json);
        });
      });
    };    
})(jQuery);