$(function() {
    $('#main').tabs();
    $('#navigation a').Tooltip();
    $(".escape").each(function() {
    	$(this).text($(this).html());
    });
    $('#samples, #getting-started-main').tabs( { selectedClass: 'sample-tab-selected', bookmarkable: false });
    
    $("div.example[+script]").each(function() {
    	var content = $.trim($(this).html());
    	var script = $(this).next().html().replace(/^\s*\$\(function\(\)\s*\{|\s*\}\);\s*$/g, "");
    	$("<h3>Markup:</h3>").appendTo(this);
    	$("<code class='mix'>").text(content).wrap("<pre></pre>").parent().appendTo(this);
    	$("<h3>Script:</h3>").appendTo(this);
    	$("<code class='mix'>").html(script).wrap("<pre></pre>").parent().appendTo(this);
    });
});