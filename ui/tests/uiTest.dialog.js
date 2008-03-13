
	var uiTestDialog = {
		"dialog": {
			"default": {
				"" : "$('#foo').dialog();",
				"clone" : "$('#foo').clone().dialog();",
				"empty" : "$([]).dialog();",
				"detached" : "$('<div/>').dialog();"
			},
			"options": {
				"autoOpen" : {
					"true" : "$('#foo').dialog({\n\t autoOpen: true \n});",
					"false" : "$('#foo').dialog({\n\t autoOpen: false \n})\n setTimeout(\"$('#foo').dialog('open');\", 1000);"
				},
				"buttons" : {
					"OkCancel" : "$('#foo').dialog({ width: 650, height: 300,\n\tbuttons: {\n\t\t'Ok': function() {\n\t\t\t$(this).dialog('close');\n\t\t},\n\t\t'Cancel': function() {\n\t\t\t$(this).dialog('close');\n\t\t}\n\t}\n});"
				},
				"draggable" : {
					"true" : "$('#foo').dialog({\n\t draggable: true \n});",
					"false" : "$('#foo').dialog({\n\t draggable: false \n});",
					"set-true" : "$('#foo').dialog({\n\t draggable: false \n});\nsetTimeout(\n\t\"$('#foo').data('draggable.dialog', true);\"\n, 3000);",
					"set-false" : "$('#foo').dialog({\n\t draggable: true \n});\nsetTimeout(\n\t\"$('#foo').data('draggable.dialog', false);\"\n, 3000);"
				},
				"height" : {
					"400" : "$('#foo').dialog({\n\t height: 400 \n});",
					"600" : "$('#foo').dialog({\n\t height: 600 \n});",
					"set-600" : "$('#foo').dialog();\nsetTimeout(\n\t\"$('#foo').data('height.dialog', 600);\"\n, 3000);"
				},
				"maxHeight" : {
					"100" : "$('#foo').dialog({\n\t maxHeight: 100 \n});",
					"400" : "$('#foo').dialog({\n\t maxHeight: 400 \n});",
					"600" : "$('#foo').dialog({\n\t maxHeight: 600 \n});",
					"set-600" : "$('#foo').dialog();\nsetTimeout(\n\t\"$('#foo').data('maxHeight.dialog', 600);\"\n, 3000);"
				},
				"minHeight" : {
					"100" : "$('#foo').dialog({\n\t minHeight: 100 \n});",
					"400" : "$('#foo').dialog({\n\t minHeight: 400 \n});",
					"600" : "$('#foo').dialog({\n\t minHeight: 600 \n});",
					"set-400" : "$('#foo').dialog();\nsetTimeout(\n\t\"$('#foo').data('minHeight.dialog', 400);\"\n, 3000);"
				},
				"maxWidth" : {
					"40" : "$('#foo').dialog({\n\t maxWidth: 40 \n});",
					"400" : "$('#foo').dialog({\n\t maxWidth: 400 \n});",
					"600" : "$('#foo').dialog({\n\t maxWidth: 600 \n});",
					"set-600" : "$('#foo').dialog();\nsetTimeout(\n\t\"$('#foo').data('maxWidth.dialog', 600);\"\n, 3000);"
				},
				"minWidth" : {
					"40" : "$('#foo').dialog({\n\t minWidth: 40 \n});",
					"400" : "$('#foo').dialog({\n\t minWidth: 400 \n});",
					"600" : "$('#foo').dialog({\n\t minWidth: 600 \n});",
					"set-400" : "$('#foo').dialog();\nsetTimeout(\n\t\"$('#foo').data('minWidth.dialog', 400);\"\n, 3000);"
				},
				"modal" : {
					"false" : "$('#foo').dialog({\n\t modal: false \n});",
					"true" : "$('#foo').dialog({\n\t modal: true \n});"
				},
				"overlay" : {
					"BgWhiteOpacity0.5" : "$('#foo').dialog({\n\t modal: true, \n\t overlay: { backgroundColor: 'white', opacity: 0.5 } \n})"
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
					"foo" : "$('#foo').dialog({\n\t position: 'foo' \n});",
					"set-center" : "$('#foo').dialog({\n\t position: 'top' \n});\nsetTimeout(\n\t\"$('#foo').data('position.dialog', 'center');\"\n, 3000);",
					"set-Array-300-80" : "$('#foo').dialog();\nsetTimeout(\n\t\"$('#foo').data('position.dialog', [300, 80]);\"\n, 3000);"
				},
				"resizable" : {
					"true" : "$('#foo').dialog({\n\t resizable: true \n});",
					"false" : "$('#foo').dialog({\n\t resizable: false \n});",
					"set-true" : "$('#foo').dialog({\n\t resizable: false \n});\nsetTimeout(\n\t\"$('#foo').data('resizable.dialog', true);\"\n, 3000);",
					"set-false" : "$('#foo').dialog({\n\t resizable: true \n});\nsetTimeout(\n\t\"$('#foo').data('resizable.dialog', false);\"\n, 3000);"
				},
				"title" : {
					"attribute" : "$('#foo')\n  .attr( 'title', 'Dialog Title' )\n  .dialog();",
					"option" : "$('#foo').dialog({\n\t title: 'Dialog Title' \n});",
					"set" : "$('#foo').dialog();\nsetTimeout(\n\t\"$('#foo').data('title.dialog', 'Dialog Title');\"\n, 3000);"
				},
				"width" : {
					"400" : "$('#foo').dialog({\n\t width: 400 \n});",
					"600" : "$('#foo').dialog({\n\t width: 600 \n});",
					"set-400" : "$('#foo').dialog();\nsetTimeout(\n\t\"$('#foo').data('width.dialog', 400);\"\n, 3000);",
					"set-600" : "$('#foo').dialog();\nsetTimeout(\n\t\"$('#foo').data('width.dialog', 600);\"\n, 3000);"
				}
			},
			"callbacks": {
				"open" : "$('#foo').dialog({\n  open: function() {\n    alert('opened');\n  }\n});",
				"close" : "$('#foo').dialog({\n  close: function() {\n    alert('closed');\n  }\n});"
			},
			"methods": {
				"open" : "$('#foo').dialog({ width: 450, autoOpen: false });\n setTimeout(\"$('#foo').dialog('open');\", 1000)",
				"close" : "$('#foo').dialog({ width: 450 });\n setTimeout(\"$('#foo').dialog('close');\", 1000);",
				"destroy" : "$('#foo').dialog({ width: 450 });\n setTimeout(\"$('#foo').dialog('destroy');\", 1000);"
			},
			"tickets": {
				"1876" : "$('#foo').hide().dialog({width:800});"
			}
		}
	};
