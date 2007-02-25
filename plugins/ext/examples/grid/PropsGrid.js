/*
 * Ext - JS Library 1.0 Alpha 2
 * Copyright(c) 2006-2007, Jack Slocum.
 */

Ext.grid.PropsDataModel = function(propertyNames, source){
    Ext.grid.PropsDataModel.superclass.constructor.call(this, []);
    if(source){
        this.setSource(source);
    }
    this.names = propertyNames || {};
};
Ext.extend(Ext.grid.PropsDataModel, Ext.grid.DefaultDataModel, {
    setSource : function(o){
        this.source = o;
        var data = [];
        for(var key in o){
            if(this.isEditableValue(o[key])){
                var vals = [key, o[key]];
                vals.key = key;
                data.push(vals);
            }
        }
        this.removeAll();
        this.addRows(data);
    },
    
    getRowId: function(rowIndex){
        return this.data[rowIndex].key;  
    },
    
    getPropertyName: function(rowIndex){
        return this.data[rowIndex].key;  
    },
    
    isEditableValue: function(val){
        if(val && val instanceof Date){
            return true;
        }else if(typeof val == 'object' || typeof val == 'function'){
            return false;
        }
        return true;
    },
    
    setValueAt : function(value, rowIndex, colIndex){
        var origVal = this.getValueAt(rowIndex, colIndex);
        if(typeof origVal == 'boolean'){
            value = (value == 'true' || value == '1');
        }
        Ext.grid.PropsDataModel.superclass.setValueAt.call(this, value, rowIndex, colIndex);
        var key = this.data[rowIndex].key;
        if(key){
            this.source[key] = value;
        }
    },
    
    getName : function(propName){
        if(typeof this.names[propName] != 'undefined'){
            return this.names[propName];
        }
        return propName;
    },
    
    getSource : function(){
        return this.source;
    }
});
Ext.grid.PropsColumnModel = function(dataModel, customEditors){
    Ext.grid.PropsColumnModel.superclass.constructor.call(this, [
        {header: this.nameText, sortable: true},
        {header: this.valueText, resizable:false} 
    ]);
    this.dataModel = dataModel;
    this.bselect = Ext.DomHelper.append(document.body, {
        tag: 'select', cls: 'x-grid-editor', children: [
            {tag: 'option', value: 'true', html: 'true'},
            {tag: 'option', value: 'false', html: 'false'}
        ]
    });
    Ext.id(this.bselect);
    this.editors = {
        'date' : new Ext.grid.DateEditor(),
        'string' : new Ext.grid.TextEditor(),
        'number' : new Ext.grid.NumberEditor(),
        'boolean' : new Ext.grid.SelectEditor(this.bselect)
    };
    this.customEditors = customEditors || {};
    this.renderCellDelegate = this.renderCell.createDelegate(this);
};

Ext.extend(Ext.grid.PropsColumnModel, Ext.grid.DefaultColumnModel, {
    nameText : 'Name',
    valueText : 'Value',
    
    isCellEditable : function(colIndex, rowIndex){
        return colIndex == 1;
    },
    
    getRenderer : function(col){
        if(col == 1){
            return this.renderCellDelegate;
        }
        return Ext.grid.DefaultColumnModel.defaultRenderer; 
    },
    
    renderCell : function(val, rowIndex, colIndex){
        if(val instanceof Date){
            return this.renderDate(val);
        }else if(typeof val == 'boolean'){
            return this.renderBool(val);
        }else{
            return val;
        }
    },
    
    getCellEditor : function(colIndex, rowIndex){
        var propName = this.dataModel.getPropertyName(rowIndex);
        if(this.customEditors[propName]){
            return this.customEditors[propName];
        }
        var val = this.dataModel.getValueAt(rowIndex, colIndex);
        if(val instanceof Date){
            return this.editors['date'];
        }else if(typeof val == 'number'){
            return this.editors['number'];
        }else if(typeof val == 'boolean'){
            return this.editors['boolean'];
        }else{
            return this.editors['string'];
        }
    },
    
    getCellEditor : function(colIndex, rowIndex){
        var val = this.dataModel.getValueAt(rowIndex, colIndex);
        if(val instanceof Date){
            return this.editors['date'];
        }else if(typeof val == 'number'){
            return this.editors['number'];
        }else if(typeof val == 'boolean'){
            return this.editors['boolean'];
        }else{
            return this.editors['string'];
        }
    }
});

Ext.grid.PropsColumnModel.prototype.renderDate = function(dateVal){
    return dateVal.dateFormat('m/j/Y');
};

Ext.grid.PropsColumnModel.prototype.renderBool = function(bVal){
    return bVal ? 'true' : 'false';
};

Ext.grid.PropsGrid = function(container, propNames){
    var dm = new Ext.grid.PropsDataModel(propNames);
    var cm =new Ext.grid.PropsColumnModel(dm);
    dm.sort(cm, 0, 'ASC');
    Ext.grid.PropsGrid.superclass.constructor.call(this, container, dm, cm);
    this.container.addClass('x-props-grid');
    this.lastEditRow = null;
    this.on('cellclick', this.onCellClick, this);
    this.on('beforeedit', this.beforeEdit, this);
    this.on('columnresize', this.onColumnResize, this);
};
Ext.extend(Ext.grid.PropsGrid, Ext.grid.EditorGrid, {
    onCellClick : function(grid, rowIndex, colIndex, e){
        if(colIndex == 0){
            this.startEditing(rowIndex, 1);
        }
    },
    
    render : function(){
        Ext.grid.PropsGrid.superclass.render.call(this);
        this.getView().fitColumns();
    },
    
    autoSize : function(){
        Ext.grid.PropsGrid.superclass.autoSize.call(this);
        this.getView().fitColumns();
    },
    
    onColumnResize : function(){
        this.colModel.setColumnWidth(1, this.getView().getScrollBody().clientWidth - this.colModel.getColumnWidth(0));
    },
    
    beforeEdit : function(grid, rowIndex, colIndex){
        if(this.lastEditRow && rowIndex != this.lastEditRow.rowIndex){
            YAHOO.util.Dom.removeClass(this.lastEditRow, 'x-grid-prop-edting');
        }
        this.lastEditRow = this.getRow(rowIndex);
        YAHOO.util.Dom.addClass(this.lastEditRow, 'x-grid-prop-edting');
    },
    
    setSource : function(source){
        this.dataModel.setSource(source);
    },
    
    getSource : function(){
        return this.dataModel.getSource();
    }
});