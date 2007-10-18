jQuery.fn.asyncTreeview = function(settings) {
	var container = this;
	$.getJSON(settings.url, function(response) {
		function createNode(node, parent) {
			var current = $("<li/>").attr("id", node.id).html(node.text).appendTo(parent);
			if (node.children.length) {
				var branch = $("<ul/>").appendTo(current);
				$.each(node.children, function(i, child) {
					createNode(child, branch);
				});
			}
		}
		var parent = $("<li/>");
		$.each(response, function(i, node) {
			createNode(node, parent);
		})
		container.append(parent);
        $(container).treeview({add: parent});
    })
	return this.treeview(settings);
}

/*
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
 */