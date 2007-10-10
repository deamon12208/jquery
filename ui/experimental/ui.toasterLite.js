$.toasterLite = function(settings) {
		settings = $.extend({
				timeout: 3000,
				title: '',
				text: '',
				animationSpeed: 3000,
				location: 'tr',
				container: 'body',
				manualClose: false,
				open: function() {},
				close: function() {},
				afterClose: function() {}
		}, settings);
		
		var html = '<div class="ui-toasterLite ui-resizable"><div class="ui-toasterLite-container">';
		if(!!settings.title || settings.manualClose) {
				html += '<div class="ui-toasterLite-titlebar">';
				if (!!settings.title) html += '<span class="ui-toasterLite-title">'+ settings.title +'</span>';
				if (settings.manualClose) html += '<div class="ui-toasterLite-titlebar-close"></div>';
				html += '</div>';
		}
		html += '<div class="ui-toasterLite-content">'+ settings.text +'</div></div>'+
		'<div class="ui-toasterLite-n ui-toasterLite-corner"/>'+
		'<div class="ui-toasterLite-s ui-toasterLite-corner"/>'+
		'<div class="ui-toasterLite-e ui-toasterLite-corner"/>'+
		'<div class="ui-toasterLite-w ui-toasterLite-corner"/>'+
		'<div class="ui-toasterLite-ne ui-toasterLite-corner"/>'+
		'<div class="ui-toasterLite-se ui-toasterLite-corner"/>'+
		'<div class="ui-toasterLite-sw ui-toasterLite-corner"/>'+
		'<div class="ui-toasterLite-nw ui-toasterLite-corner"/>'+
		'</div>';
		html = $(html);
		
		if ($('.ui-toasterLite-holder-pos-'+ settings.location, settings.container).size()) {
			$('.ui-toasterLite-holder-pos-'+ settings.location, settings.container).append(html);
		}
		else {
			$(settings.container).append('<div class="ui-toasterLite-holder ui-toasterLite-holder-pos-'+ settings.location +'"></div>').find('.ui-toasterLite-holder-pos-'+ settings.location).append(html);
		}
		
		$(html).find('.ui-toasterLite-titlebar-close').hover(function() { $(this).addClass('ui-toasterLite-titlebar-close-hover') }, function() { $(this).removeClass('ui-toasterLite-titlebar-close-hover'); }).click(function() {
				settings.close(html);
				
				html.fadeOut(settings.animationSpeed, function() {
						html.remove();
						settings.afterClose(html);
							if (($('.ui-toasterLite-holder-pos-'+ settings.location, settings.container).children().size() < 1)) 
								$('.ui-toasterLite-holder-pos-'+ settings.location, settings.container).remove();
				});
				
		});
		
		window.setTimeout(function() { html.slideDown(); }, 0);
		if (!settings.manualClose) window.setTimeout(function() {
				settings.close(html);
				html.slideUp(settings.animationSpeed, function() {
						html.remove();
						settings.afterClose(html);
						if (($('.ui-toasterLite-holder-pos-'+ settings.location, settings.container).children().size() < 1)) 
							$('.ui-toasterLite-holder-pos-'+ settings.location, settings.container).remove();
				});
		}, settings.timeout);
}

$.fn.toasterLite = function(settings) {
	settings.container = this;
	$.toasterLite(settings);
}
