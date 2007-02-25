/*
 * Ext - JS Library 1.0 Alpha 2
 * Copyright(c) 2006-2007, Jack Slocum.
 * 
 * http://www.extjs.com/license.txt
 */

/**
 * @class Ext.grid.EditorGrid
 * @extends Ext.grid.Grid
 * Shortcut class for creating and editable grid.
 * @param {String/HTMLElement/Ext.Element} container The element into which this grid will be rendered - 
 * The container MUST have some type of size defined for the grid to fill. The container will be 
 * automatically set to position relative if it isn't already.
 * @param {Object} dataSource The data model to bind to
 * @param {Object} colModel The column model with info about this grid's columns
 */
Ext.grid.EditorGrid = function(container, config){
    Ext.grid.EditorGrid.superclass.constructor.call(this, container, config);
    this.container.addClass("xedit-grid");

    if(!this.selModel){
        this.selModel = new Ext.grid.CellSelectionModel();
    }

    this.activeEditor = null;

	Ext.apply(this.events, {
	    /**
	     * @event beforeedit
	     * Fires before a cell is edited
	     * @param {Grid} this
	     * @param {Number} rowIndex
	     * @param {Number} columnIndex
	     */
	    "beforeedit" : true,
	    /**
	     * @event afteredit
	     * Fires after a cell is edited
	     * @param {Grid} this
	     * @param {Number} rowIndex
	     * @param {Number} columnIndex
	     */
	    "afteredit" : true
	});
    this.on("bodyscroll", this.stopEditing,  this);
    this.on(this.clicksToEdit == 1 ? "cellclick" : "celldblclick", this.onCellDblClick,  this);
};

Ext.extend(Ext.grid.EditorGrid, Ext.grid.Grid, {
    isEditor : true,
    clicksToEdit: 2,
    
    onCellDblClick : function(g, row, col){
        this.startEditing(row, col);
    },

    onEditComplete : function(ed, value, startValue){
        this.editing = false;
        ed.un("specialkey", this.onEditorKey, this);
        if(value != startValue){
            var r = this.dataSource.getAt(ed.row);
            var field = this.colModel.getDataIndex(ed.col);
            if(this.fireEvent("afteredit", this, r, field, ed.row, ed.col) !== false){
                r.set(field, value);
            }
        }
        this.view.focusCell(ed.row, ed.col);
    },

    /**
     * Starts editing the specified for the specified row/column
     * @param {Number} rowIndex
     * @param {Number} colIndex
     */
    startEditing : function(row, col, buf){
        this.stopEditing();
        if(this.colModel.isCellEditable(col, row)){
            this.view.focusCell(row, col);
            var r = this.dataSource.getAt(row);
            var field = this.colModel.getDataIndex(col);
            if(this.fireEvent("beforeedit", this, r, field, row, col) !== false){
                this.editing = true; // flag for buffering of orphan key strokes
                (function(){ // complex but required for focus issues in safari, ie and opera
                    var ed = this.colModel.getCellEditor(col, row);
                    ed.row = row; ed.col = col;
                    ed.on("complete", this.onEditComplete, this, {single: true});
                    ed.on("specialkey", this.selModel.onEditorKey, this.selModel);
                    this.activeEditor = ed;
                    var v;
                    if(buf){
                        v = buf.join("");
                        buf.splice(0, buf.length);
                    }else{
                        v = r.data[field];
                    }
                    ed.startEdit(this.view.getCell(row, col), v);
                }).defer(50, this);
            }
        }
    },
        
    /**
     * Stops any active editing
     */
    stopEditing : function(){
        if(this.activeEditor){
            this.activeEditor.completeEdit();
        }
        this.activeEditor = null;
    }
});