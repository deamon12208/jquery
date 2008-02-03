
	var uiTestDraggable = {
		"draggable": {
			"default": {
				"" : "$('#foo').draggable();",
				"clone" : "$('#foo').clone().draggable();",
				"empty" : "$([]).draggable();",
				"detached" : "$('<'+'div/>').draggable();"
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
				},
				"dragPrevention" : {
					"a,input,textarea" : "$('#foo').draggable({ dragPrevention: 'a,input,textarea' });"
				},
				"grid" : {
					"x50y10" : "$('#foo').draggable({ grid: [50, 10] });",
					"x10y50" : "$('#foo').draggable({ grid: [10, 50] });"
				},
				"handle" : {
					"div" : "$('#foo').draggable({ handle: 'div' });",
					"code" : "$('#foo').draggable({ handle: 'code' });"
				},
				"helper" : {
					"clone" : "$('#foo').draggable({ helper: 'clone' });",
					"function" : "$('#foo').draggable({ helper: function() {\n\t return $('<'+'div/>').addClass('bar')[0]; \n} });"
				},
				"opacity" : {
					"0.6" : "$('#foo').draggable({ opacity: 0.6 });",
					"0.3" : "$('#foo').draggable({ opacity: 0.3 });",
					"0.4helperclone" : "$('#foo').draggable({ opacity: 0.4, helper: 'clone' });"
				},
				"preventionDistance" : {
					"40" : "$('#foo').draggable({ preventionDistance: 40 });"
				},
				"revert" : {
					"true" : "$('#foo').draggable({ revert: true });",
					"truehelperclone" : "$('#foo').draggable({ revert: true, helper: 'clone' });"
				},
				"scroll" : {
					"true" : "$('#foo').draggable({ scroll: true });",
					"false" : "$('#foo').draggable({ scroll: false });"
				},
				"appendTo" : {
					"body" : "$('#foo').draggable({ helper: 'clone', appendTo: 'body' });",
					"''" : "$('#foo').draggable({ helper: 'clone' });"
				}
			},
			"callbacks": {
				"start" : "$('#foo').draggable({ start: function() {\n\t uiTestLog('start'); \n} });",
				"drag" : "$('#foo').draggable({ drag: function() {\n\t uiTestLog('drag'); \n} });",
				"stop" : "$('#foo').draggable({ stop: function() {\n\t uiTestLog('stop'); \n} });"
			},
			"methods": {
			}
		}
	};
