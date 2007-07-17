/**
 * @author Christian
 */
$(function() {
	$("div.section").each(function() {
		
		// add item to toc
		$("#toc").append(
			$("<a></a>").attr("href","#" + $(this).attr("id")).html($("h2",this).text())
		
		);
		
		var $table = $("div.demo",this),
		$script = $("script",this),
		$tab = $("div.tab",this);
		
		//.append($("<h3>").html("Javascript:"))
		$("div.js",this).append($("<pre></pre>").addClass("javascript").text($.trim($script.html())));
		
		//.append($("<h3>").html("HTML:"))
		$("div.html",this).append($("<pre></pre>").addClass("html").text($.trim($table.html())));	
		
		
		// append tabs structure
		var id = $(this).attr("id");
		var idArr = ['-demo','-js','-html'];
		$tab.find('div.js').attr('id',id + '-js');
		$tab.find('div.html').attr('id',id + '-html');
		$tab.find('div.demo').attr('id',id + '-demo');
		$('li',this).each(function(i){
			var t = $(this).html();
			$(this).empty().append(
				$('<a>').attr('href','#' + id + idArr[i]).append($('<span>').html(t))
			
			
			)
			

		});
		$tab.tabs(); 
	});
	$("pre.javascript").chili();
	$("pre.html").chili();
});