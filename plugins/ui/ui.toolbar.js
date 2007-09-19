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
		return $.ui.toolbarAddItem(this, 'toolbar_btn', options);
	}
	$.fn.toolbarDelItem = function(item){
		return $.ui.toolbarDelItem(this, item);
	}

	$.fn.toolbarDisableItem = function(item){return $.ui.toolbarDisableItem(this, item);}
	$.fn.toolbarEnableItem = function(item){return $.ui.toolbarEnableItem(this, item);}

	var toolbarItems = new Array(); // This is a global var.

	$.ui.toolbar = function(el, options) {
	// create the toolbar
		id = $.ui.uuid("ui-toolbar");

		$('<div class="ui-toolbar" id="'+id+'" ><ul><'+'/ul></'+'div>').appendTo(el);
		
		var tbOptions = $.extend({
			theme: 'default', // This sets the theme for the menu, currently only one.
			direction: 'horizontal', // This means the menu will have the default class of horizontal -- can equal horizontal || vertical
			mode: 'both',
			linkedTo: null,
			tooltips: false // No tooltips when you hover.
		}, options);

		
		if(tbOptions.linkedTo!=null){
			var linkedHeight = $(tbOptions.linkedTo).height();
			var linkedWidth = $(tbOptions.linkedTo).width();
			switch(tbOptions.direction){
				case 'horizontal':
					$(el).css("width", (linkedWidth+4)+"px");
					break;
				case 'vertical':
					$(el).css("height", (linkedHeight+4)+"px");
					break;
			}
		}
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
					handlerType: "click" // When to fire the event, defaults to "click".
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
		var settings = $.extend({
			name: $.ui.uuid("ui-toolbarItem"),
			text: 'Button',
			handler: function(){alert("Fired: "+settings.text);}, // Function to be run when fired.
			handlerType: "click", // When to fire the event, defaults to "click".
			icon: null
		}, settings);
		
		switch(settings.type){
			case 'toolbarBtn':
				if($(el))
				var idBtn = $.ui.uuid("ui-toolbarBtn");		// The unique id of the item.
				var name = settings.name || idBtn; 							// Used for later references.
				
				var text = settings.text;								// The text to be displayed
				var icon = settings.icon;								// Icon for the button
				var iconOnly = settings.iconOnly;				// Use only an icon for the item.
				if(icon == null){
					iconOnly = false;
				}
				if(icon != null){
					iconified = true;
				}else{
					iconified = false;
				}
				// Handler to be Called onEvent
				var handlerType = settings.handlerType;	// The event on which to call the handler.
				
				var toolbarBtn_tpl = new Array();
				toolbarBtn_tpl.push(
					'<li class="ui-btn" id="{{id}}" class="{{name}}">',
						'<span class="ui-btn-left"><i>&#160;<'+'/i><'+'/span>',
						'<span class="ui-btn-center">',
						'<input type="button" value="{{text}}" name="{{name}}"/>',
						'<'+'/span>',
						'<span class="ui-btn-right"><i>&#160;<'+'/i><'+'/span>',
					'</li>'
				);
				
				template = $.ui.tbTemplate(toolbarBtn_tpl, ['id', 'text', 'name'], [idBtn, text, name]);
				
				

				if(iconified){
					$(template).appendTo(el)
										 .bind(handlerType, function(){settings.handler();})
										 .find(".ui-btn-center").addClass("ui-btn-icon")
										 .css("background", "url("+icon+") top left no-repeat");
				}else{
					$(template).appendTo(el)
										 .bind(handlerType, function(){settings.handler();})
										 .find(".ui-btn-center").removeClass("ui-btn-icon");
				}
				
				toolbarItems.push({'item': idBtn, 'domEl': el+" #"+id});
				
				return idBtn;
			break;
		}
	}
	$.ui.toolbarDelItem = function(el,_item){
		$.each(toolbarItems, function(i){
			if(toolbarItems[i].item == _item){
				$("#"+toolbarItems[i].item).remove();
				toolbarItems.splice(i, i+1);
			}
		});
	}

	$.ui.toolbarDisableItem = function(el,_item){
		$.each(toolbarItems, function(i){
			if(toolbarItems[i].item == _item){
				$("#"+toolbarItems[i].item).addClass('ui-toolbarBtn-disabled');
			}
		});
	}
	$.ui.toolbarEnableItem = function(el,_item){
		$.each(toolbarItems, function(i){
			if(toolbarItems[i].item == _item){
				$("#"+toolbarItems[i].item).removeClass('ui-toolbarBtn-disabled');
			}
		});
	}

})(jQuery);