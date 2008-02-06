
	var uiTestDialog = {
		"dialog": {
			"default": {
				"" : "$('#foo').dialog();",
				"clone" : "$('#foo').clone().dialog();",
				"empty" : "$([]).dialog();",
				"detached" : "$('<div/>').dialog();"
			},
			"options": {
				"buttons" : {
					"OkCancel" : "$('#foo').dialog({ width: 650, height: 300,\n\tbuttons: {\n\t\t'Ok': function() {\n\t\t\t$(this).dialog('close');\n\t\t},\n\t\t'Cancel': function() {\n\t\t\t$(this).dialog('close');\n\t\t}\n\t}\n});"
				},
				"draggable" : {
					"true" : "$('#foo').dialog({\n\t draggable: true \n});",
					"false" : "$('#foo').dialog({\n\t draggable: false \n});"
				},
				"height" : {
					"400" : "$('#foo').dialog({\n\t height: 400 \n});",
					"600" : "$('#foo').dialog({\n\t height: 600 \n});"
				},
				"maxHeight" : {
					"40" : "$('#foo').dialog({\n\t maxHeight: 40 \n});",
					"400" : "$('#foo').dialog({\n\t maxHeight: 400 \n});",
					"600" : "$('#foo').dialog({\n\t maxHeight: 600 \n});"
				},
				"minHeight" : {
					"40" : "$('#foo').dialog({\n\tminHeight: 40 \n});",
					"400" : "$('#foo').dialog({\n\tminHeight: 400 \n});",
					"600" : "$('#foo').dialog({\n\tminHeight: 600 \n});"
				},
				"maxWidth" : {
					"40" : "$('#foo').dialog({\n\t maxWidth: 40 \n});",
					"400" : "$('#foo').dialog({\n\t maxWidth: 400 \n});",
					"600" : "$('#foo').dialog({\n\t maxWidth: 600 \n});"
				},
				"minWidth" : {
					"40" : "$('#foo').dialog({\n\t minWidth: 40 \n});",
					"400" : "$('#foo').dialog({\n\t minWidth: 400 \n});",
					"600" : "$('#foo').dialog({\n\t minWidth: 600 \n});"
				},
				"modal" : {
					"false" : "$('#foo').dialog({\n\t modal: false \n});",
					"true" : "$('#foo').dialog({\n\t modal: true \n});",
					"Css-BgWhiteOpacity0.5" : "$('#foo').dialog({\n\t modal: { backgroundColor: 'white', opacity: 0.5 } \n})"
				},
				"position" : {
					"center" : "$('#foo').dialog({\n\t position: 'center' \n});",
					"top" : "$('#foo').dialog({\n\t position: 'top' \n});",
					"right" : "$('#foo').dialog({\n\t position: 'right' \n});",
					"bottom" : "$('#foo').dialog({\n\t position: 'bottom' \n});",
					"left" : "$('#foo').dialog({\n\t position: 'left' \n});",
					"Array-10-20" : "$('#foo').dialog({\n\t position: [10, 20] \n});",
					"Array-300-80" : "$('#foo').dialog({\n\t position: [300, 80] \n});",
					"Array-80-300" : "$('#foo').dialog({\n\t position: [80, 300] \n});",
					"foo" : "$('#foo').dialog({\n\t position: 'foo' \n});"
				},
				"resizable" : {
					"true" : "$('#foo').dialog({\n\t resizable: true \n});",
					"false" : "$('#foo').dialog({\n\t resizable: false \n});"
				},
				"title" : {
					"attribute" : "$('#foo')\n  .attr( 'title', 'Dialog Title' )\n  .dialog();",
					"option" : "$('#foo').dialog({\n\t title: 'Dialog Title' \n});"
				},
				"width" : {
					"400" : "$('#foo').dialog({\n\t width: 400 \n});",
					"600" : "$('#foo').dialog({\n\t width: 600 \n});"
				}
			},
			"callbacks": {
				"open" : "$('#foo').dialog({\n  open: function() {\n    alert('opened');\n  }\n});",
				"close" : "$('#foo').dialog({\n  close: function() {\n    alert('closed');\n  }\n});"
			},
			"methods": {
				"dialogOpen" : "$('#foo').dialog({ width: 450, autoOpen: false });\n setTimeout(\"$('#foo').dialog('open');\", 1000)",
				"dialogClose" : "$('#foo').dialog({ width: 450 });\n setTimeout(\"$('#foo').dialog('close');\", 1000);"
			},
			"tickets": {
				"1876" : "$('#foo').hide().dialog({width:800});"
			}
		}
	};
