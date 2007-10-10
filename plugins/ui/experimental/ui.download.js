$.ui = $.ui || {};

$.ui.plugins = {
	"plugins": {
		"dimensions": {
			"name": "Dimensions",
			"dependencies": []
		},
		"mouse": {
			"name": "Mouse system",
			"dependencies": ["dimensions"]
		},
		"tree": {
			"name": "Tree",
			"dependencies": []
		},
		"tabs": {
			"name": "Tabs",
			"dependencies": []
		},
		"effects": {
			"name": "Effects",
			"dependencies": ["dimensions"]
		},
		"magnifier": {
			"name": "Magnifier",
			"dependencies": ["dimensions"]
		},
		"draggable": {
			"name": "Draggables",
			"dependencies": ["mouse"]
		},
		"sortable": {
			"name": "Sortables",
			"dependencies": ["mouse"]
		},
		"resizable": {
			"name": "Resizables",
			"dependencies": ["mouse"]
		},
		"slider": {
			"name": "Slider",
			"dependencies": ["mouse"]
		},
		"droppable": {
			"name": "Droppables",
			"dependencies": ["draggable"]
		},
		"modal": {
			"name": "Modal dialogs",
			"dependencies": ["draggable", "resizable"]
		}
	},
	"themes": {
		"light": {
			"name": "Light theme",
			"elements": ["form", "modal", "tabs", "tree"]
		},
		"dark": {
			"name": "Dark theme",
			"elements": ["form", "modal", "tabs", "tree"]
		},
		"tango": {
			"name": "Tango",
			"elements": ["tree"]
		}
	}
};
$.fn.draggable = function(o) {
	return this.each(function() {
		new $.ui.draggable(this, o);
	});
}
$.fn.download = function(plugins) {
  return this.each(function() {
    new $.ui.download(this, plugins);
  });
};
$.ui.download = function(el, plugins) {
  var self = this;
  var markup = $('<div class="downloadChooser"><ul><li><a href="#plugins"><span>Plugins</span></a></li><li><a href="#themes"><span>Themes</span></a></li><li><a href="#settings"><span>Settings</span></a></li></ul><div id="plugins"><ul></ul></div><div id="themes"><ul></ul></div><div id="settings"></div></div>');
  for (plugin in plugins.plugins) {
    var pluginInfo = plugins.plugins[plugin];
    $(markup).find('#plugins ul').append('<li><input type="checkbox" name="files[]" value="'+ plugin +'" class="download-plugin" id="download-checkbox-'+ plugin +'"/><label for="download-checkbox-'+ plugin +'">'+ pluginInfo.name +'</label></li>');
  }
  for (theme in plugins.themes) {
    var themeInfo = plugins.themes[theme];
    $(markup).find('#themes ul').append('<li><input type="checkbox" name="themes[]" value="'+ theme +'" class="download-theme" id="download-checkbox-'+ theme +'"/><label for="download-checkbox-'+ theme +'">'+ themeInfo.name +'</label><br /><small>Elements themed: '+ themeInfo.elements.join(', ') +'</small></li>');
  }
  $(markup).find('#settings').html('<ul><li class="selected"><input type="checkbox" name="encode" value="true" id="encode-result" checked="checked" class="setting" /><label for="encode-result">Pack result (shrinks file size)</label></li>' +
  '<li><input type="checkbox" name="jquery" value="true" id="add-jquery" class="setting" /><label for="add-jquery">Include jQuery in the download</label></li></ul>').end()
  .find('.download-theme, .setting').change(function() {
    if ($(this).attr('checked') == true) {
      $(markup).find('label[@for='+ $(this).attr('id') +']').parent().addClass('selected');
    }
    else {
      $(markup).find('label[@for='+ $(this).attr('id') +']').parent().removeClass('selected');
    }
  }).end().find('.download-plugin').change(function() {  
    var plugin = $(this).attr('value');
    if ($(this).attr('checked') == true) {
      $(markup).find('label[@for='+ $(this).attr('id') +']').parent().addClass('selected');
    }
    else {
      for (ancestor in self.findDescendants(plugin, plugins.plugins)) {
        self.machineUnCheck(ancestor, markup);
      }
      $(markup).find('label[@for='+ $(this).attr('id') +']').parent().removeClass('selected');
    }
    for (ancestor in self.findAncestors(plugin, plugins.plugins)) {
      self.machineCheck(ancestor, markup);
    }
  }).end().appendTo(el);
};
$.extend($.ui.download.prototype, {
  findAncestors: function(plugin, plugins, ancestors) {
    if (ancestors == window.undefined) {
      ancestors = {};
    }
    for (i in plugins[plugin].dependencies) {
      var dependant = plugins[plugin].dependencies[i];
      ancestors[dependant] = dependant;
      ancestors = this.findAncestors(dependant, plugins, ancestors);
    }
    return ancestors;
  },
  machineCheck: function(value, markup) {
    markup.find('[@value='+ value +']').attr('checked', 'checked').parent().addClass('selected');
  },
  machineUnCheck: function(value, markup) {
    markup.find('[@value='+ value +']').attr('checked', '').parent().removeClass('selected');
  },
  findDescendants: function(plugin, plugins, descendants) {
    if (descendants == window.undefined) {
      descendants = {};
    }
    for (iplugin in plugins) {
      var index = $.inArray(plugin, plugins[iplugin].dependencies);
      if (index != -1) {
        descendants[iplugin] = iplugin;
        descendants = this.findDescendants(iplugin, plugins, descendants);
      }
    }
    return descendants;
  }
});