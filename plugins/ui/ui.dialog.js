(function($)
{
	//If the UI scope is not availalable, add it
	$.ui = $.ui || {};

	$.fn.dialog = function(o) {
		return this.each(function() {
			if (!$(this).is(".ui-dialog")) new $.ui.dialog(this, o);
		});
	}
	$.fn.dialogOpen = function() {
		return this.each(function() {
			if ($(this).parents(".ui-dialog").length) $.ui.dialogOpen(this);
		});
	}
	$.fn.dialogClose = function() {
		return this.each(function() {
			if ($(this).parents(".ui-dialog").length) $.ui.dialogClose(this);
		});
	}

	$.ui.dialog = function(el, o) {
		
		var options = {
			width: 300,
			height: 200,
			position: 'center'
		};
		var o = o || {}; $.extend(options, o); //Extend and copy options
		this.element = el; var self = this; //Do bindings
		$.data(this.element, "ui-dialog", this);

		var uiDialogContent = $(el).addClass('ui-dialog-content')
			.wrap(document.createElement('div'))
			.wrap(document.createElement('div'));
		var uiDialogContainer = uiDialogContent.parent().addClass('ui-dialog-container').css({position: 'relative'});
		var uiDialog = uiDialogContainer.parent().addClass('ui-dialog').css({position: 'absolute', width: options.width, height: options.height});

		uiDialogContainer.prepend('<div class="ui-dialog-titleBar"/></div>');
		var uiDialogTitleBar = $('.ui-dialog-titleBar', uiDialogContainer);
		uiDialogTitleBar.append('<span class="ui-dialog-title">' + uiDialogContent.attr('title') + '</span>');

		// Hide on init. Show using dialogOpen()
		uiDialog.hide();

		this.open = function() {
			var wnd = $(window), top = 0, left = 0;
			switch (options.position) {
				case 'center':
					top = (wnd.height() / 2) - (uiDialog.height() / 2);
					left = (wnd.width() / 2) - (uiDialog.width() / 2);
					break;
			}
			uiDialog.css({top: top, left: left});
			uiDialog.appendTo('body').show();
		};

		this.close = function() {
			uiDialog.hide();
		};

	}

	$.ui.dialogOpen = function(el) {
		$.data(el, "ui-dialog").open();
	}

	$.ui.dialogClose = function(el) {
		$.data(el, "ui-dialog").close();
	}

})(jQuery);
