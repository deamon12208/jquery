$.fn.wrapAll = function() {
    // There needs to be at least one matched element for this to work
    if ( !this.length ) return this;

    // Find the element that we're wrapping with
    var b = jQuery.clean(arguments)[0];

    // Make sure that its in the right position in the DOM
    this[0].parentNode.insertBefore( b, this[0] );

    // Find its lowest point
    while ( b.firstChild ) b = b.firstChild;

    // And add all the elements there
    return this.appendTo(b);
};

$(function() {
    $('#main').tabs();
    $('#navigation a').Tooltip();
    $(".escape").each(function() {
    	$(this).text($(this).html());
    });
    $('#samples').tabs( { selectedClass: 'sample-tab-selected', bookmarkable: false });
    
    $("div.example[+script]").each(function() {
    	var content = $.trim($(this).html());
    	var script = $(this).next().html().replace(/^\s*\$\(function\(\)\s*\{|\s*\}\);\s*$/g, "");
    	$("<h3>Markup:</h3>").appendTo(this);
    	$("<code class='mix'>").text(content).wrap("<pre></pre>").parent().appendTo(this);
    	$("<h3>Script:</h3>").appendTo(this);
    	$("<code class='mix'>").html(script).wrap("<pre></pre>").parent().appendTo(this);
    });
    //var script = $("script.example").html().replace(/^\s*\$\(function\(\)\s*\{|\s*\}\);\s*$/g, "");
    //$("<code class='mix'>").html(script).wrap("<pre></pre>").parent().appendTo("#code-samples");
});