(function($) {

	var uiIdSeed = 0;

  $.fn.toolbar = function(name, options, extraOptions){
    return this.each(function(i,n) {
      new $.ui.toolbar(n, name, options, extraOptions);
    });
  }

	$.ui.uuid = function(prefix){
		return prefix +"-" + (++uiIdSeed);
	}
  $.ui.toolbar = function(el, name, setting, options) {
	// create the toolbar
		id = $.ui.uuid("ui-toolbar");
		if(name=='' || name == null){
			name = id;
		}

		$(el).append('<div class="ui-toolbar" rel="'+name+'" id="'+id+'" ><ul><'+'/ul></'+'div>');

		var tbOptions = $.extend({
			theme: 'default', // This sets the theme for the menu, currently only one.
			direction: 'horizontal',  // This means the menu will have the default class of horizontal -- can equal horizontal || vertical
			mode: 'both',
			tooltips: false   // No tooltips when you hover.
		}, options);

		$(el).find("#"+id).attr("mode",tbOptions.mode);
		$(el).find("#"+id).addClass(tbOptions.theme);
		$(el).find("#"+id+" ul").addClass(tbOptions.direction);
  
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
				$.ui.addItem(el, 'toolbar_btn', {'name': name, 'options': settings});
			});
		}
  }
	
	$.ui.addItem = function(el, type, settings){
		$.extend({
			name: '',
			options: {}
		}, settings);
		if(type == 'toolbar_btn' && settings.name!=''){
			
			var toolbarId = $("div[@rel="+settings.name+"]").attr("id");
			var id = $.ui.uuid("ui-btn");
			var tbMode = $(el).find("#"+toolbarId).attr('mode');
// @@ This is still needed, as a catch.
			if(tbMode == 'icons-only'){
				settings.options.text = '';
			}
			if(settings.options.type=="dropdown"){
				
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
	}
	
	
/* THIS is stolen but doesn't work.	
	$.fn.template = function(html){
    return this.each(function(i,n) {
      new $.ui.template(html);
    });
  }
	$.fn.templateApply = function(values){
    return this.each(function(){
			$.ui.template.apply(this, values)
		})
  }
	
	$.ui.template = function(html){
		if(html instanceof Array){
			html = html.join("");	
		}
		this.html = html;
	}
	$.ui.template.prototype = {
		// The regex.
		re: /\{([\w-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g,
			
		apply: function(values){
      if(this.compiled){
        return this.compiled(values);
      }
      var tpl = this;
      var fn = function(m, name, format, args){
        return values[name] !== undefined ? values[name] : "";
      };

      return $(this.html.replace(this.re, fn));
		},
		compile : function(){
			var sep = $.browser.mozilla ? "+" : ",";
			var fn = function(m, name, format, args){
					args= '', format = "(values['" + name + "'] == undefined ? '' : ";
					return "'"+ sep + format + "values['" + name + "']" + args + ")"+sep+"'";
			};
			var body;
			// branched to use + in gecko and [].join() in others
			if($.browser.mozilla){
					body = "this.compiled = function(values){ return '" +
								 this.html.replace(/(\r\n|\n)/g, '\\n').replace("'", "\\'").replace(this.re, fn) +
									"';};";
			}else{
					body = ["this.compiled = function(values){ return ['"];
					body.push(this.html.replace(/(\r\n|\n)/g, '\\n').replace("'", "\\'").replace(this.re, fn));
					body.push("'].join('');};");
					body = body.join('');
			}
			eval(body);
			return this;
		}
	}*/
})(jQuery);