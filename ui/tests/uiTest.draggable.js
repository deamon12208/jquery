
	var uiTestDraggable = {
		"draggable": {
			"default": {
				"" : "$('#foo').draggable();",
				"clone" : "$('#foo').clone().draggable();",
				"empty" : "$([]).draggable();",
				"detached" : "$('<div/>').draggable();"
			},
			"options": {
				"axis" : {
					"x" : "$('#foo').draggable({ axis: 'x' });",
					"y" : "$('#foo').draggable({ axis: 'y' });"
				},
				"containment" : {
					"document" : "$('#foo').draggable({ containment: 'document' });",
					"parent" : "$('#foo').draggable({ containment: 'parent' });"
				},
				"cursor" : {
					"crosshair" : "$('#foo').draggable({ cursor: 'crosshair' });",
					"move" : "$('#foo').draggable({ cursor: 'move' });"
				},
				"cursorAt" : {
					"top2left2" : "$('#foo').draggable({ cursorAt: {top: 2, left: 2} });",
					"bottom20right14" : "$('#foo').draggable({ cursorAt: {bottom: 20, right: 14} });"
				}
			},
			"callbacks": {
			},
			"methods": {
			}
		}
	};
