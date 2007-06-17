(function($) {
	
	$.fn.draggable = function(o) {
		this.each(function() {
			new $.ui.draggable(this,o);	
		});
	}
	
	$.fn.undraggable = function() {
		
	}
	
	$.ui.draggable = function(el,o) {
	
		if(!o) var o = {};

		this.element = el;
		this.options = {};
		$.extend(this.options, o);
		$.extend(this.options, {
			handle : o.handle ? ($(o.handle, el)[0] ? $(o.handle, el) : $(el)) : $(el),
			onStart : o.onStart ? o.onStart : false,
			onStop : o.onStop ? o.onStop : false,
			onDrag : o.onDrag ? o.onDrag : false,
			helper: o.helper ? o.helper : "clone",
			preventionDistance: o.preventionDistance ? o.preventionDistance : 0,
			preventionTimeout: o.preventionTimeout != false ? o.preventionTimeout : false,
			dragPrevention: o.dragPrevention ? o.dragPrevention.toLowerCase().split(",") : ["input","textarea","button"],
			cursorAt: { top: ((o.cursorAt && o.cursorAt.top) ? o.cursorAt.top : 0), left: ((o.cursorAt && o.cursorAt.left) ? o.cursorAt.left : 0), bottom: ((o.cursorAt && o.cursorAt.bottom) ? o.cursorAt.bottom : 0), right: ((o.cursorAt && o.cursorAt.right) ? o.cursorAt.right : 0) },
			cursorAtIgnore: (!o.cursorAt) ? true : false, //Internal property
			wrapHelper: o.wrapHelper != undefined ? o.wrapHelper : true,
			scroll: o.scroll != undefined ? o.scroll : 20,
			appendTo: o.appendTo ? o.appendTo : "parent",
			axis: o.axis ? o.axis : null,
			grid: o.grid ? o.grid : null,
			containment: o.containment ? (o.containment == "parent" ? el.parentNode : o.containment) : null,
			init: false //Internal property
		});
		var o2 = this.options; //Just Lazyness
		
		if(o2.helper == "clone" || o2.helper == "original") {

			// Let's save the margins for better reference
			o2.margins = {
				top: parseInt($(el).css("marginTop")) || 0,
				left: parseInt($(el).css("marginLeft")) || 0,
				bottom: parseInt($(el).css("marginBottom")) || 0,
				right: parseInt($(el).css("marginRight")) || 0
			};

			// We have to add margins to our cursorAt
			if(o2.cursorAt.top != 0) o2.cursorAt.top += o2.margins.top;
			if(o2.cursorAt.left != 0) o2.cursorAt.left += o2.margins.left;
			if(o2.cursorAt.bottom != 0) o2.cursorAt.bottom += o2.margins.bottom;
			if(o2.cursorAt.right != 0) o2.cursorAt.right += o2.margins.right;
			
		} else {
			o2.margins = { top: 0, left: 0, right: 0, bottom: 0 };
		}
		
		var self = this;

		o2.handle.bind("mousedown", function(e) { // Bind the mousedown event
			return self.click.apply(self, [e]);	
		});
		
	}
	
	$.extend($.ui.draggable.prototype, {
		debug: false,
		plugins: {},
		position: null,
		oldPosition: null,
		currentTarget: null,
		lastTarget: null,
		helper: null,
		timer: null,
		slowMode: false,
		element: null,
		execPlugins: function(type) {
			var o = this.options;
			if(this.plugins[type]) {
				for(var i=0;i<this.plugins[type].length;i++) {
					this.plugins[type][i].apply(this.element, [this.helper, this.position, [o.curOffset.left - o.ppOffset.left,o.curOffset.top - o.ppOffset.top],this]);	
				}	
			}			
		},
		destroy: function() { // Destroy this draggable
			
		},
		click: function(e) {
			
			// Prevent execution on defined elements
			var targetName = (e.target) ? e.target.nodeName.toLowerCase() : e.srcElement.nodeName.toLowerCase();
			for(var i=0;i<this.options.dragPrevention.length;i++) {
				if(targetName == this.options.dragPrevention[i]) return true;
			}

			var self = this;
			this.mouseup = function(e) {
					return self.stop.apply(self, [e]);
			}
			this.mousemove = function(e) {
					return self.drag.apply(self, [e]);
			}
			
			var initFunc = function() { //This function get's called at bottom or after timeout
	
				$(document).bind("mouseup", self.mouseup);
				$(document).bind("mousemove", self.mousemove);
	
				self.oldPosition = $.ui.getPointer(e); // Get the original mouse position

			}
			
			if(this.options.preventionTimeout) { //use prevention timeout
				if(this.timer) clearInterval(this.timer);
				this.timer = setTimeout(function() { initFunc(); }, this.options.preventionTimeout);
				return false;
			}
		
			initFunc();
			return false;
			
		},
		start: function(e) {
			
			var o = this.options;
			o.curOffset = $(this.element).offset({ border: false }); //get the current offset
				
			if(typeof o.helper == "function") { //If helper is a function, use the node returned by it
				this.helper = o.helper.apply(this.element, [e]);
			} else { //No custom helper
				if(o.helper == "clone") this.helper = $(this.element).clone()[0];
				if(o.helper == "original") this.helper = this.element;
			}
			
			if(o.appendTo == "parent") { // Let's see if we have a positioned parent
				var curParent = this.element.parentNode;
				while (curParent) {
					if(curParent.style && ($(curParent).css("position") == "relative" || $(curParent).css("position") == "absolute")) {
						o.pp = curParent;
						o.ppOffset = $(curParent).offset({ border: false });
						o.ppOverflow = !!($(o.pp).css("overflow") == "auto" || $(o.pp).css("overflow") == "scroll"); //TODO!
						break;	
					}
					curParent = curParent.parentNode ? curParent.parentNode : null;
				};
				
				if(!o.pp) o.ppOffset = { top: 0, left: 0 };
			}
			
			this.position = this.oldPosition; //Use the actual clicked position
			
			if(o.cursorAtIgnore) { // If we want to pick the element where we clicked, we borrow cursorAt and add margins
				o.cursorAt.left = this.position[0] - o.curOffset.left + o.margins.left;
				o.cursorAt.top = this.position[1] - o.curOffset.top + o.margins.top;
			}

			//Save the real mouse position
			this.realPosition = [this.position[0],this.position[1]];
			
			if(o.pp) { // If we have a positioned parent, we pick the draggable relative to it
				this.position[0] -= o.ppOffset.left;
				this.position[1] -= o.ppOffset.top;	
			}
			
			if(o.containment && o.cursorAtIgnore) { //Get the containment
				if(o.containment.left == undefined) {
					
					if(o.containment == 'window') {
						o.containment = {
							top: 0-o.margins.top-o.ppOffset.top,
							left: 0-o.margins.left-o.ppOffset.left,
							right: $(window).width()-o.margins.right-o.ppOffset.left,
							bottom: $(window).height()-o.margins.bottom-o.ppOffset.top
						}	
					} else { //I'm a node, so compute top/left/right/bottom
						
						var conEl = $(o.containment)[0];
						var conOffset = $(o.containment).offset({ border: false });
	
						o.containment = {
							top: conOffset.top-o.ppOffset.top-o.margins.top,
							left: conOffset.left-o.ppOffset.left-o.margins.left,
							right: conOffset.left-o.ppOffset.left+(conEl.offsetWidth || conEl.scrollWidth)-o.margins.right,
							bottom: conOffset.top-o.ppOffset.top+(conEl.offsetHeight || conEl.scrollHeight)-o.margins.bottom
						}	
					
					}
					
				}
			}
			
			this.slowMode = (o.cursorAt && (o.cursorAt.top-o.margins.top > 0 || o.cursorAt.bottom-o.margins.bottom > 0) && (o.cursorAt.left-o.margins.left > 0 || o.cursorAt.right-o.margins.right > 0)) ? true : false; //If cursorAt is within the helper, set slowMode to true

			$(this.helper).css("left", o.curOffset.left+"px").css("top", o.curOffset.top+"px").css("position", "absolute").appendTo((o.appendTo == "parent" ? this.element.parentNode : o.appendTo)); // Append the helper

			// Remap right/bottom properties for cursorAt to left/top
			if(o.cursorAt.right && !o.cursorAt.left) o.cursorAt.left = o.helper.offsetWidth+o.margins.right+o.margins.left - o.cursorAt.right;
			if(o.cursorAt.bottom && !o.cursorAt.top) o.cursorAt.top = o.helper.offsetHeight+o.margins.top+o.margins.bottom - o.cursorAt.bottom;
		
			/* Only after we have appended the helper, we compute the offsets
			 * for the slowMode! This is important, so the user aready see's
			 * something going on.
			 */
			if(this.slowMode && $.ui.droppable) {
				var m = d.manager;
				for(var i=0;i<m.length;i++) { m[i].offset = $(m[i].item).offset({ border: false }); }
			}
		
			o.init = true;	

			if(o.onStart) o.onStart.apply(this.element, [this.helper]); // Trigger the onStart callback
			this.execPlugins("start");
			return false;
						
		},
		stop: function(e) {			
			
			var o = this.options;
			
			var self = this;
			$(document).unbind("mouseup", self.mouseup);
			$(document).unbind("mousemove", self.mousemove);

			if(o.init == false) return this.oldPosition = this.position = null; // If init is false, just set properties to null
			
			if(o.onStop) o.onStop.apply(this.element, [this.helper, this.position, [o.curOffset.left - o.ppOffset.left,o.curOffset.top - o.ppOffset.top],this]); //Trigger the onStop callback
			
			//Execute plugins
			this.execPlugins("stop");

			if(this.slowMode && $.ui.droppable) { //If cursorAt is within the helper, we must use our drop manager
				var m = d.manager;
				for(var i=0;i<m.length;i++) {
					var cO = m[i].offset;
					if((this.position[0] > cO.left && this.position[0] < cO.left + m[i].item.offsetWidth) && (this.position[1] > cO.top && this.position[1] < cO.top + m[i].item.offsetHeight)) {
						d.evDrop.apply(m[i].item);
					}
				}
			}
				
			if(this.helper != this.element && !this.helper.keepMe) $(this.helper).remove();	// Remove helper, if it's not the real deal (the origin)

			o.init = false;
			this.oldPosition = this.position = this.helper = null; // Clear temp variables
			
			return false;
			
		},
		drag: function(e) {

			if ($.browser.msie && !e.button) return this.stop.apply(this, [e]); // check for IE mouseup when moving into the document again
			var o = this.options;
			
			this.position = $.ui.getPointer(e); //Get the current mouse position
			
			//Save the real mouse position
			this.realPosition = [this.position[0],this.position[1]];
			
			if(o.pp) { //If we have a positioned parent, use a relative position
				this.position[0] -= o.ppOffset.left;
				this.position[1] -= o.ppOffset.top;	
			}

			if( (Math.abs(this.position[0]-this.oldPosition[0]) > o.preventionDistance || Math.abs(this.position[1]-this.oldPosition[1]) > o.preventionDistance) && o.init == false) //If position is more than x pixels from original position, start dragging
				this.start.apply(this,[e]);			
			else {
				if(o.init == false) return false;
			}
		
			if(o.onDrag) var retPos = o.onDrag.apply(this.element, [this.helper,this.position,this.oldPosition,o.cursorAt]); //Trigger the onDrag callback
			if(retPos) { // If something came back from our callback, use it as modified position
				if(retPos.x) this.position[0] = retPos.x;
				if(retPos.y) this.position[1] = retPos.y;	
			}
			
			
			if(this.slowMode && $.ui.droppable) { // If cursorAt is within the helper, we must use our drop manager to look where we are
				var m = d.manager;
				for(var i=0;i<m.length;i++) {
					var cO = m[i].offset;
					if((this.position[0] > cO.left && this.position[0] < cO.left + m[i].item.offsetWidth) && (this.position[1] > cO.top && this.position[1] < cO.top + m[i].item.offsetHeight)) {
						if(m[i].over == 0) { m[i].out = 0; m[i].over = 1; d.evHover.apply(m[i].item); }
					} else {
						if(m[i].out == 0) { m[i].out = 1; m[i].over = 0; d.evOut.apply(m[i].item); }
					}
				}
			}
			
			/* If wrapHelper is set to true (and we have a defined cursorAt),
			 * wrap the helper when coming to a side of the screen.
			 */
			if(o.wrapHelper && !o.cursorAtIgnore) {
				
				if(!o.pp || !o.ppOverflow) {
					var wx = $(window).width() - ($.browser.mozilla ? 20 : 0);
					var sx = $(document).scrollLeft();
					
					var wy = $(window).height();
					var sy = $(document).scrollTop();	
				} else {
					var wx = o.pp.offsetWidth + o.ppOffset.left - 20;
					var sx = o.pp.scrollLeft;
					
					var wy = o.pp.offsetHeight + o.ppOffset.top - 20;
					var sy = o.pp.scrollTop;						
				}
				
				var xOffset = ((this.realPosition[0]-o.cursorAt.left - wx + this.helper.offsetWidth+o.margins.right) - sx > 0 || (this.realPosition[0]-o.cursorAt.left+o.margins.left) - sx < 0) ? (this.helper.offsetWidth+o.margins.left+o.margins.right - o.cursorAt.left * 2) : 0;
				
				var yOffset = ((this.realPosition[1]-o.cursorAt.top - wy + this.helper.offsetHeight+o.margins.bottom) - sy > 0 || (this.realPosition[1]-o.cursorAt.top+o.margins.top) - sy < 0) ? (this.helper.offsetHeight+o.margins.top+o.margins.bottom - o.cursorAt.top * 2) : 0;
				
			} else {
				var xOffset = 0;
				var yOffset = 0;	
			}
			
			if(o.scroll) { // Auto scrolling
				if(o.pp && o.ppOverflow) { // If we have a positioned parent, we only scroll in this one
					// TODO: Extremely strange issues are waiting here..handle with care
				} else {
					if((this.realPosition[1] - $(window).height()) - $(document).scrollTop() > -10) window.scrollBy(0,o.scroll);
					if(this.realPosition[1] - $(document).scrollTop() < 10) window.scrollBy(0,-o.scroll);
					if((this.realPosition[0] - $(window).width()) - $(document).scrollLeft() > -10) window.scrollBy(o.scroll,0);
					if(this.realPosition[0] - $(document).scrollLeft() < 10) window.scrollBy(-o.scroll,0);
				}
			}

			/* map new helper left/top values to temp vars */
			var nt = this.position[1]-yOffset-(o.cursorAt.top ? o.cursorAt.top : 0);
			var nl = this.position[0]-xOffset-(o.cursorAt.left ? o.cursorAt.left : 0);

			if(o.axis && o.cursorAtIgnore) { // If we have a axis or containment, use it. Cannot be used with cursorAt.
				switch(o.axis) {
					case "y":
						nt = o.curOffset.top - o.margins.top - o.ppOffset.top; break;
					case "x":
						nl = o.curOffset.left - o.margins.left - o.ppOffset.left; break;
				}					
			}
			
			if(o.grid && o.cursorAtIgnore) { //Let's use the grid if we have one. Cannot be used with cursorAt.
				nl = o.curOffset.left + o.margins.left - o.ppOffset.left + Math.round((nl - o.curOffset.left - o.margins.left + o.ppOffset.left) / o.grid[0]) * o.grid[0];
				nt = o.curOffset.top + o.margins.top - o.ppOffset.top + Math.round((nt - o.curOffset.top - o.margins.top + o.ppOffset.top) / o.grid[1]) * o.grid[1];
			}
			
			if(o.containment && o.cursorAtIgnore) { // Stick to a defined containment. Cannot be used with cursorAt.
				if((nl < o.containment.left)) nl = o.containment.left;
				if((nt < o.containment.top)) nt = o.containment.top;
				if(nl+$(this.helper)[0].offsetWidth > o.containment.right) nl = o.containment.right-$(this.helper)[0].offsetWidth;
				if(nt+$(this.helper)[0].offsetHeight > o.containment.bottom) nt = o.containment.bottom-$(this.helper)[0].offsetHeight;
			}

			$(this.helper).css("left", nl+"px").css("top", nt+"px"); // Stick the helper to the cursor
			return false;
			
		}
	});

 })($);