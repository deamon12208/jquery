if (window.Node && Node.prototype && !Node.prototype.contains) {
	Node.prototype.contains = function (arg) {
		return !!(this.compareDocumentPosition(arg) & 16);
	};
}

(function($) {

	//Make nodes selectable by expression
	$.extend($.expr[':'], { sortable: "(' '+a.className+' ').indexOf(' ui-sortable ')" });

	$.fn.sortable = function(o) {
		return this.each(function() {
			new $.ui.sortable(this,o);	
		});
	};
	
	$.ui.sortable = function(element,options) {
	
		//Initialize needed constants
		var self = this;
		this.element = $(element);
		$.data(element, "ui-sortable", this);
		this.element.addClass("ui-sortable");

		//Prepare the passed options
		this.options = $.extend({}, options);
		var o = this.options;
		$.extend(o, {
			items: this.options.items || '> *',
			zIndex: this.options.zIndex || 1000,
			startCondition: function() {
				return !self.disabled;	
			}		
		});
		
		//Get the items
		this.refresh();

		//Let's determine if the items are floating
		this.floating = /left|right/.test(this.items[0].item.css('float'));
		
		//Let's determine the parent's offset
		if(!/(relative|absolute|fixed)/.test(this.element.css('position'))) this.element.css('position', 'relative');
		this.offset = this.element.offset({ border: false });

		//Initialize mouse events for interaction
		this.element.mouseInteraction({
			executor: this,
			delay: o.delay,
			distance: o.distance || 0,
			dragPrevention: o.prevention ? o.prevention.toLowerCase().split(',') : ['input','textarea','button','select','option'],
			start: this.start,
			stop: this.stop,
			drag: this.drag,
			condition: function(e) {

				if(this.disabled) return false;

				//Find out if the clicked node (or one of its parents) is a actual item in this.items
				var currentItem = null, nodes = $(e.target).parents().andSelf().each(function() {
					if($.data(this, 'ui-sortable-item')) currentItem = $(this);
				});
				if(currentItem) {
					this.currentItem = currentItem;
					return true;
				} else return false; 

			}
		});

	};
	
	$.extend($.ui.sortable.prototype, {
		plugins: {},
		ui: function() {
			return {
				helper: this.helper,
				position: this.position,
				absolutePosition: this.positionAbs,
				instance: this,
				options: this.options
			};		
		},
		propagate: function(n,e) {
			$.ui.plugin.call(this, n, [e, this.ui()]);
			this.element.triggerHandler(n == "sort" ? n : "sort"+n, [e, this.ui()], this.options[n]);
		},
		intersectsWith: function(item) {
			
			var x1 = this.positionAbs.left, x2 = x1 + this.helperProportions.width,
			    y1 = this.positionAbs.top, y2 = y1 + this.helperProportions.height;
			var l = item.left, r = l + item.width, 
			    t = item.top,  b = t + item.height;

			return (   l < x1 + (this.helperProportions.width  / 2)        // Right Half
				&&     x2 - (this.helperProportions.width  / 2) < r    // Left Half
				&& t < y1 + (this.helperProportions.height / 2)        // Bottom Half
				&&     y2 - (this.helperProportions.height / 2) < b ); // Top Half
			
		},
		refresh: function() {
			this.items = [];
			var items = this.items;
			$(this.options.items, this.element).each(function() {
				$.data(this, 'ui-sortable-item', true); // Data for target checking (mouse manager)
				items.push({
					item: $(this),
					width: 0, height: 0,
					left: 0, top: 0
				});
			});
		},
		refreshPositions: function() {
			for (var i = this.items.length - 1; i >= 0; i--){
				this.items[i].width = this.items[i].item.outerWidth();
				this.items[i].height = this.items[i].item.outerHeight();
				var p = this.items[i].item.offset();
				this.items[i].left = p.left;
				this.items[i].top = p.top;
			};
		},
		destroy: function() {
			this.element.removeClass("ui-sortable ui-sortable-disabled");
			this.element.removeMouseInteraction();
		},
		enable: function() {
			this.element.removeClass("ui-sortable-disabled");
			this.disabled = false;
		},
		disable: function() {
			this.element.addClass("ui-sortable-disabled");
			this.disabled = true;
		},
		start: function(e) {
			
			var o = this.options;

			//Create and append the visible helper
			this.helper = this.currentItem.clone().appendTo(this.currentItem[0].parentNode);
			this.helper.css('position', 'absolute');

			//Find out the next positioned parent
			this.offsetParent = (function(cp) {
				while(cp) {
					if(cp.style && (/(absolute|relative|fixed)/).test($.css(cp,'position'))) return $(cp);
					cp = cp.parentNode ? cp.parentNode : null;
				}; return $("body");		
			})(this.helper[0].parentNode);
			
			//Prepare variables for position generation
			this.elementOffset = this.currentItem.offset();
			this.offsetParentOffset = this.offsetParent.offset();
			var elementPosition = { left: this.elementOffset.left - this.offsetParentOffset.left, top: this.elementOffset.top - this.offsetParentOffset.top };
			this._pageX = e.pageX; this._pageY = e.pageY;
			this.clickOffset = { left: e.pageX - this.elementOffset.left, top: e.pageY - this.elementOffset.top };
			var r = this.helper.css('position') == 'relative';
			
			//Generate the original position
			this.originalPosition = {
				left: (r ? parseInt(this.helper.css('left')) || 0 : elementPosition.left + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollLeft)),
				top: (r ? parseInt(this.helper.css('top')) || 0 : elementPosition.top + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollTop))
			};
			
			//Generate a flexible offset that will later be subtracted from e.pageX/Y
			this.offset = {left: e.pageX - this.originalPosition.left, top: e.pageY - this.originalPosition.top };

			//Save the first time position
			this.position = { top: e.pageY - this.offset.top, left: e.pageX - this.offset.left };
			this.positionAbs = { left: e.pageX - this.clickOffset.left, top: e.pageY - this.clickOffset.top };

			//Call plugins and callbacks
			this.propagate("start", e);

			//Save and store the helper proportions
			this.helperProportions = { width: this.helper.outerWidth(), height: this.helper.outerHeight() };
			
			//Set the original element visibility to hidden to still fill out the white space	
			$(this.currentItem).css('visibility', 'hidden');
			
			//Refresh the droppable positions
			this.refreshPositions();

			return false;
						
		},
		stop: function(e) {

			//Call plugins and trigger callbacks
			this.propagate("stop", e);

			//TODO: Propagate the change callback if the DOM position has changed
			if(true) this.propagate("update", e);
			
			if(this.cancelHelperRemoval) return false;			
			$(this.currentItem).css('visibility', 'visible');
			this.helper.remove();

			return false;
			
		},
		drag: function(e) {

			//Compute the helpers position
			this.direction = (this.floating && this.positionAbs.left > e.pageX - this.clickOffset.left) || (this.positionAbs.top > e.pageY - this.clickOffset.top) ? 'down' : 'up';
			this.position = { top: e.pageY - this.offset.top, left: e.pageX - this.offset.left };
			this.positionAbs = { left: e.pageX - this.clickOffset.left, top: e.pageY - this.clickOffset.top };

			//Rearrange
			for (var i = this.items.length - 1; i >= 0; i--) {
				if(this.intersectsWith(this.items[i]) && this.items[i].item[0] != this.currentItem[0] && !this.currentItem[0].contains(this.items[i].item[0])) {
					//Rearrange the DOM
					this.items[i].item[this.direction == 'down' ? 'before' : 'after'](this.currentItem);
					this.refreshPositions(); //Precompute after each DOM insertion, NOT on mousemove
					break;
				}
			}

			//Call plugins and callbacks
			this.propagate("sort", e);
			
			this.helper.css({ left: this.position.left+'px', top: this.position.top+'px' }); // Stick the helper to the cursor
			return false;
			
		}
	});

})(jQuery);
