var uid = 0;

var uiRenderDemo = function(model) {

	var title = model.title, container = $(model.renderAt);

	container.append('<h1>' + title + '</h1><br>');

	$.each(model.demos, function(i, demo) {
		if (!demo) return;
		
		var html = $('<div class="ui-html-demo"></div>');
		
		if (model.onRenderStart) model.onRenderStart.apply(window);
		
		var _uid = 'ui-gen-' + uid++, generated = $('<div id="'+ _uid +'">');

		container.append(generated);

		var details = $(
			'<br><div class="details"><div class="menutitle">' + demo.title + '</div></div>'
		);
		
		var desc = $(
			'<div class="demo-description">'+ (demo.desc || '') +'</div>'
		);
		
		var ocontainer = $(
			'<div class="demo-options"><label for="select-' + _uid + '">More options:</label></div>'
		);
		
		// Render simple HTML
		if (typeof demo.html == 'string') {
			html = demo.html;
		}
		// Render data html by URL
		if (typeof demo.html == 'object' && demo.html.url) {
			
			$.ajax({ 
				type: "GET", 
				url: demo.html.url,
				cache: false,
				success: function(data) {
					html.html(data);
					$.each(demo.options, function(x, o) {
						// eval the first source of <select>
						if (!x) jQuery.globalEval(o.source);
					});
					if (model.onRenderEnd) model.onRenderEnd.apply(window);
				}
			});
			
		}

		var spanCode = $(
			'<span id="code-'+ _uid +'">').css({ display: 'none' }
		);

		var source = $(
			'<div class="demo-view-code">Code</div>'
		);
		
		var pre = $(
			'<pre></pre>'
		);

		var select = $('<select id="select-' + _uid + '">').change(function() {
			var ecode = $(this).val();

			jQuery.globalEval(demo.destroy);

			jQuery.globalEval(ecode);

			source.html(pre.html(ecode));

		});

		var a = $('<a>View Source</a>').attr('href', 'javascript:void(0);').addClass('link-view-source').click(function() {
        el = this;
				spanCode.slideToggle("slow", function(){
          var text = $(el).text();
          if(/view source/i.test(text)) $(el).text("Hide Source");
          else $(el).text("View Source");
        });
		});

		generated.append(
			details, desc, html, ocontainer.append(
				select, a, '<br>', spanCode.append('<br>', source)
			)
		);

		$.each(demo.options, function(x, o) {
			if (o && o.desc) {
	  		select.append($('<option>' + o.desc + '</option>').val(o.source));
	  		// eval the first source of <select>
				if (!x) {
					source.html(pre.html(o.source));
					jQuery.globalEval(o.source);
				}
			}
		});
		
		if (typeof demo.html != 'object' && model.onRenderEnd) model.onRenderEnd.apply(window);
		
	});
};

var loadDemo = function(comp) {
	$('#containerDemo').html("<img src='img/loading.gif'>");
	
	 $("#containerDemo").ajaxError(function(request, settings){ 
	   $(this).html("<b>Ops!</b> There is no template file for this component."); 
	 });
	
	$.get(comp+'.html', function(data) {
		$('#containerDemo').html(data);
	});
};