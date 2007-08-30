/* jQuery UI Toolbar
 *	Adds a toolbar by being given params.
 *
 *	Todo:
 *		- Better Templating and code formatting!!
 *		
 *		- AddItem: adds items to named toolbar on the fly.
 *		- DelItem: removes or deletes items from the named toolbar on the fly.
 */

(function($) {
	//If the UI scope is not availalable, add it
	$.ui = $.ui || {};
	
	// Add the UI Naming seed, this is a custom function used in plugin.
	var uiIdSeed = 0;
	// the Naming seed based function:
	// 	@ returns a string like: myId-1
	$.ui.uuid = function(prefix){
		return prefix +"-" + (++uiIdSeed);
	}

  $.fn.toolbar = function(options){
    return $.ui.toolbar(this, options);
  }
	
	$.fn.toolbarAddItem = function(options){
		return this.each(function(i,n) {
			$.ui.toolbarAddItem(this, 'toolbar_btn', options);
		});
	}

  $.ui.toolbar = function(el, options) {
	// create the toolbar
		id = $.ui.uuid("ui-toolbar");

		$('<div class="ui-toolbar" id="'+id+'" ><ul><'+'/ul></'+'div>').appendTo(el);
		
		var tbOptions = $.extend({
			theme: 'default', // This sets the theme for the menu, currently only one.
			direction: 'horizontal',  // This means the menu will have the default class of horizontal -- can equal horizontal || vertical
			mode: 'both',
			tooltips: false   // No tooltips when you hover.
		}, options);

		$(el).find("#"+id).addClass("ui-toolbar").addClass(tbOptions.mode).addClass(tbOptions.theme);
		$(el).find("#"+id+" ul").addClass(tbOptions.direction);
		
		/*  
	  if(setting){
			$.each(setting, function(i){
				var settings = $.extend({
					text: 'Button',
					type: "button",
					icon: null,
					handler: function(){}, // Function to be run when fired.
					handlerType: "click"  // When to fire the event, defaults to "click".
				}, setting[i]);
				if(tbOptions.mode == 'text-only'){
					settings.icon == null;
				}
				//$.ui.toolbarAddItem(el, 'toolbar_btn', {'name': name, 'options': settings});
			});
		}
		*/
		
		return $("#"+id+" ul");
	}
	
	
	$.ui.tbTemplate = function(template, keys, values){
		if(template instanceof Array){
			template = template.join("");
		}
	
		$.each(keys, function(i){
			regex = eval('/\{\{'+keys[i]+'\}\}/g');
			template = template.replace(regex, values[i]);
		});
		return template;
	}
	
	$.ui.toolbarAddItem = function(el, type, settings){
		$.extend({
			name: '',
			iconOnly: 'false'
		}, settings);
		
		switch(settings.type){
			case 'toolbarBtn':
				if($(el))
				var idBtn = $.ui.uuid("ui-toolbarBtn");		// The unique id of the item.
				var name = settings.name; 							// Used for later references.
				
				var text = settings.text;								// The text to be displayed
				var icon = settings.icon || "images/blank.gif";								// Icon for the button
				var iconOnly = settings.iconOnly;				// Use only an icon for the item.
				
				var handler = settings.handler;					// Handler to be Called onEvent
				var handlerType = settings.handlerType;	// The event on which to call the handler.
				
				var toolbarBtn_tpl = new Array();
				toolbarBtn_tpl.push(
					'<li class="ui-btn" id="{{id}}" class="{{name}}">',
						'<span class="ui-btn-left"><i>&#160;<'+'/i><'+'/span>',
						'<span class="ui-btn-center">',
						'<input type="button" value="{{text}}" style="background: url( {{icon}} ) top left no-repeat;"/>',
						'<'+'/span>',
						'<span class="ui-btn-right"><i>&#160;<'+'/i><'+'/span>',
					'</li>'
				);
				
				template = $.ui.tbTemplate(toolbarBtn_tpl, ['id', 'text', 'name', 'icon'], [idBtn, text, name, icon]);
				
				

				if(icon!="images/blank.gif"){
					$(template).appendTo(el)
										 .bind(handlerType, function(){ handler(); })
										 .find(".ui-btn-center").addClass("ui-btn-icon");
				}else{
					$(template).appendTo(el)
										 .bind(handlerType, function(){ handler(); });
				}
				
				return $(el+" #"+id);
			break;
		}
	}
/*
		if(type == 'toolbar_btn' && settings.name!=''){
			
			var toolbarId = $("div[@rel="+settings.name+"]").attr("id");
			var id = $.ui.uuid("ui-btn");
			var tbMode = $(el).find("#"+toolbarId).attr('mode');
// @@ This is still needed, as a catch.
			if(tbMode == 'icons-only'){
				settings.text = '';
			}
			if(settings.type=="dropdown"){
				
			}else{
				$('<li class="ui-btn" id="'+id+'"><span class="ui-btn-left"><i>&#160;<'+'/i><'+'/span><span class="ui-btn-center"><'+'/span><span class="ui-btn-right"><i>&#160;<'+'/i><'+'/span><'+'/li>')
					.appendTo($(el).find("#"+toolbarId+" ul"));
			}
			$(el).find("#"+toolbarId+" ul #"+id+" .ui-btn-center").html('<input type="'+settings.options.type+'" value="'+settings.options.text+'"/>');
			$(el).find("#"+toolbarId+" ul #"+id+" .ui-btn-center input")
				.bind(settings.options.handlerType, function(){ settings.options.handler(); });
			if(settings.options.icon != null){
				$(el).find("#"+id).addClass("ui-btn-icon");
				$(el).find("#"+id+" .ui-btn-center input").css("background","url("+settings.options.icon+") top left no-repeat");

// Make the icon full width, for some reason, css doesn't do it.
				if(tbMode == 'icons-only'){
					$(el).find("#"+id+" .ui-btn-center input").css("width", "20px")
				}
			}
		}
		

	//}	*/
})(jQuery);