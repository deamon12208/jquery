jQuery.fn.asynctree = function() {
	return this.treeview({
		unique: true, 
        collapsed: false, 
        toggle: function() { 
            var li = this; 
            if (!li.org_unit_key) return; 
            if (!$(li).hasClass('collapsable')) return; 
            var $ul = $('ul:first',li); 
            if (!$('li:first:contains("placeholder")', $ul).length) return; 
            $ul.empty(); 
            var args = {org_unit_key: li.org_unit_key}; 
            $.get("/subtree", args, function(str) { 
                var $branches = $(str).contents(); 
                $branches.appendTo($ul); 
                $("ul.treeview2").treeview({add: $branches}) 
            }) 
        }
	});
}

[

 	{

 	  "text" : "1. New Item  (56 min)",

 	  "id" : "4028b2481584aa0c011584c996200001",

 	  "cls" : "folder",

 	  expanded : true,

 	  draggable : true,

 	  "icon" : "/.SP_Meeting/images/default/tree/leaf.gif",

 	  "children":[

 	{

 	  "text" : "1.1 New Item  (0 min)",

 	  "id" : "4028b24815a357d00115a446fb880006",

 	  "cls" : "folder",

 	  expanded : true,

 	  draggable : true,

 	  "icon" : "/.SP_Meeting/images/default/tree/leaf.gif",

 	  "children":[

	]},

 	{

 	  "text" : "1.2 New Item  (0 min)",

 	  "id" : "4028b24815a357d00115a446f8d90004",

 	  "cls" : "folder",

 	  expanded : true,

 	  draggable : true,

 	  "icon" : "/.SP_Meeting/images/default/tree/leaf.gif",

 	  "children":[

			]}

			]}

			,

 	{

 	  "text" : "2. New Item  (0 min)",

 	  "id" : "4028b24815a357d00115a446f88a0002",

 	  "cls" : "folder",

 	  expanded : true,

 	  draggable : true,

 	  "icon" : "/.SP_Meeting/images/default/tree/leaf.gif",

 	  "children":[

	]}

]