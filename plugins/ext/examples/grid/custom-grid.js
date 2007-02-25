/*
 * Ext - JS Library 1.0 Alpha 2
 * Copyright(c) 2006-2007, Jack Slocum.
 */

var Example = {
    init : function(){
        var propsGrid = new Ext.grid.PropsGrid('props-grid');
		// The props grid takes an object as a data source
		propsGrid.setSource({
			"(name)": "Properties Grid",
			"grouping": false,
			"autoFitColumns": true,
			"productionQuality": false,
			"created": new Date(Date.parse('10/15/2006')),
			"tested": false,
			"version": .01,
			"borderWidth": 1
		});
		propsGrid.render();
    }    
}
Ext.EventManager.onDocumentReady(Example.init, Example, true);