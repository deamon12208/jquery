var uid = 0;

var uiRenderDemo = function(model) {

	var title = model.title, container = $(model.renderAt);

	container.append('<h1>' + title + '</h1><br>');

	$.each(model.demos, function(i, demo) {
		var _uid = 'ui-gen-' + uid++, generated = $('<div id="'+ _uid +'">');

		container.append(generated);

		var details = $(
			'<br><div class="details"><div class="menutitle">' + demo.title + '</div></div>'
		);

		var ocontainer = $(
			'<div class=" demo-options"><label for="select-' + _uid + '">More options:</label></div>'
		);

		var html = $(demo.html);

		var spanCode = $('<span id="code-'+ _uid +'">').css({ display: 'none' });

		var source = $(
			'<div class="demo-view-code">Code</div>'
		);

		var select = $('<select id="select-' + _uid + '">').change(function() {

			jQuery.globalEval(demo.destroy);

			var ecode = $(this).val();

			jQuery.globalEval(ecode);

			source.html(ecode);

		});

		var a = $('<a>View Source</a>').attr('href', 'javascript:void(0);').addClass('link-view-source').click(function() {
			spanCode.slideToggle("slow", function(){
                var text = $(this).text();
                if(text.toLowerCase()=="view source"){
                    $(this).text("Hide Source");
                }else{
                    $(this).text("View Source");
                }
            });
		});

		generated.append(
			details, html, ocontainer.append(
				select, a, '<br>', spanCode.append('<br>', source)
			)
		);

		$.each(demo.options, function(x, o) {
			select.append( $('<option>' + o.desc + '</option>').val(o.source) );
			// eval the first source of <select>
			if (!x) {
				source.html(o.source);
	  		jQuery.globalEval(o.source);
	  	}
		});
	});
};
