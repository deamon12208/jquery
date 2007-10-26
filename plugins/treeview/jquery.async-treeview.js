function load(url, root, child, container) {
	$.getJSON(url, {root: root}, function(response) {
		function createNode(node, parent) {
			var current = $("<li/>").attr("id", node.id).html("<span>" + node.text + "</node>").appendTo(parent);
			if (node.hasChildren || node.children.length) {
				var branch = $("<ul/>").appendTo(current);
				if (node.hasChildren && !node.children.length) {
					current.addClass("hasChildren");
					createNode({
						text:"placeholder",
						id:"placeholder",
						children:[]
					}, branch);
				}
				$.each(node.children, function(i, child) {
					createNode(child, branch);
				});
			}
		}
		$.each(response, function(i, node) {
			createNode(node, child);
		})
        $(container).treeview({add: child});
    });
}

jQuery.fn.asyncTreeview = function(settings) {
	var container = this;
	load(settings.url, "source", this, container);
	return this.treeview($.extend({}, settings, {
		collapsed: true,
		toggle: function() {
			var $this = $(this);
			if ($this.hasClass("hasChildren")) {
				var childList = $this.removeClass("hasChildren").find("ul");
				childList.empty();
				load(settings.url, this.id, childList, container);
			}
		}
	}));
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