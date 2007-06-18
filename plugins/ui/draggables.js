(function($) {
	
	var num = function(el, prop) {
		return parseInt($.css(el.jquery?el[0]:el,prop))||0;
	};
	
	$.ui.ddmanager = {
		current: null,
		droppables: []
	};
	
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
			helper: o.helper ? o.helper : 'clone',
			preventionDistance: o.preventionDistance ? o.preventionDistance : 0,
			dragPrevention: o.dragPrevention ? o.dragPrevention.toLowerCase().split(',') : ['input','textarea','button'],
			cursorAt: { top: ((o.cursorAt && o.cursorAt.top) ? o.cursorAt.top : 0), left: ((o.cursorAt && o.cursorAt.left) ? o.cursorAt.left : 0), bottom: ((o.cursorAt && o.cursorAt.bottom) ? o.cursorAt.bottom : 0), right: ((o.cursorAt && o.cursorAt.right) ? o.cursorAt.right : 0) },
			cursorAtIgnore: (!o.cursorAt) ? true : false, //Internal property
			wrapHelper: o.wrapHelper != undefined ? o.wrapHelper : true,
			appendTo: o.appendTo ? o.appendTo : 'parent'
		});
		o = this.options; //Just Lazyness
		
		if(o.helper == 'clone' || o.helper == 'original') {

			// Let's save the margins for better reference
			o.margins = {
				top: num(el,'marginTop'),
				left: num(el,'marginLeft'),
				bottom: num(el,'marginBottom'),
				right: num(el,'marginRight')
			};

			// We have to add margins to our cursorAt
			if(o.cursorAt.top != 0) o.cursorAt.top += o.margins.top;
			if(o.cursorAt.left != 0) o.cursorAt.left += o.margins.left;
			if(o.cursorAt.bottom != 0) o.cursorAt.bottom += o.margins.bottom;
			if(o.cursorAt.right != 0) o.cursorAt.right += o.margins.right;
			
		} else {
			o.margins = { top: 0, left: 0, right: 0, bottom: 0 };
		}
		
		var self = this;
		o.handle.bind('mousedown', function(e) { // Bind the mousedown event
			return self.click.apply(self, [e]);	
		});
		
	}
	
	$.extend($.ui.draggable.prototype, {
		plugins: {},
		pos: null,
		opos: null,
		currentTarget: null,
		lastTarget: null,
		helper: null,
		timer: null,
		slowMode: false,
		element: null,
		init: false,
		execPlugins: function(type) {
			var o = this.options;
			if(this.plugins[type]) {
				for(var i=0;i<this.plugins[type].length;i++) {
					this.plugins[type][i].call(this);	
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
	
				$(document).bind('mouseup', self.mouseup);
				$(document).bind('mousemove', self.mousemove);
	
				self.opos = $.ui.getPointer(e); // Get the original mouse position

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
				
			if(typeof o.helper == 'function') { //If helper is a function, use the node returned by it
				this.helper = o.helper.apply(this.element, [e]);
			} else { //No custom helper
				if(o.helper == 'clone') this.helper = $(this.element).clone()[0];
				if(o.helper == 'original') this.helper = this.element;
			}
			
			if(o.appendTo == 'parent') { // Let's see if we have a positioned parent
				var curParent = this.element.parentNode;
				while (curParent) {
					if(curParent.style && ($(curParent).css('position') == 'relative' || $(curParent).css('position') == 'absolute')) {
						o.pp = curParent;
						o.po = $(curParent).offset({ border: false });
						o.ppOverflow = !!($(o.pp).css('overflow') == 'auto' || $(o.pp).css('overflow') == 'scroll'); //TODO!
						break;	
					}
					curParent = curParent.parentNode ? curParent.parentNode : null;
				};
				
				if(!o.pp) o.po = { top: 0, left: 0 };
			}
			
			this.pos = this.opos; //Use the actual clicked position
			
			if(o.cursorAtIgnore) { // If we want to pick the element where we clicked, we borrow cursorAt and add margins
				o.cursorAt.left = this.pos[0] - o.curOffset.left + o.margins.left;
				o.cursorAt.top = this.pos[1] - o.curOffset.top + o.margins.top;
			}

			//Save the real mouse position
			this.rpos = [this.pos[0],this.pos[1]];
			
			if(o.pp) { // If we have a positioned parent, we pick the draggable relative to it
				this.pos[0] -= o.po.left;
				this.pos[1] -= o.po.top;
			}
			
			this.slowMode = (o.cursorAt && (o.cursorAt.top-o.margins.top > 0 || o.cursorAt.bottom-o.margins.bottom > 0) && (o.cursorAt.left-o.margins.left > 0 || o.cursorAt.right-o.margins.right > 0)) ? true : false; //If cursorAt is within the helper, set slowMode to true

			$(this.helper).css('left', o.curOffset.left+'px').css('top', o.curOffset.top+'px').css('position', 'absolute').appendTo((o.appendTo == 'parent' ? this.element.parentNode : o.appendTo)); // Append the helper

			// Remap right/bottom properties for cursorAt to left/top
			if(o.cursorAt.right && !o.cursorAt.left) o.cursorAt.left = o.helper.offsetWidth+o.margins.right+o.margins.left - o.cursorAt.right;
			if(o.cursorAt.bottom && !o.cursorAt.top) o.cursorAt.top = o.helper.offsetHeight+o.margins.top+o.margins.bottom - o.cursorAt.bottom;
		
			/* Only after we have appended the helper, we compute the offsets
			 * for the slowMode! This is important, so the user aready see's
			 * something going on.
			 */
			if(this.slowMode && $.ui.droppable) {
				var m = $.ui.ddmanager.droppables;
				for(var i=0;i<m.length;i++) { m[i].offset = $(m[i].item.element).offset({ border: false }); }
			}
		
			this.init = true;
			$.ui.ddmanager.current = this;	

			if(o.onStart) o.onStart.apply(this.element, [this.helper]); // Trigger the onStart callback
			this.execPlugins('start');
			return false;
						
		},
		stop: function(e) {			
			
			var o = this.options;
			
			var self = this;
			$(document).unbind('mouseup', self.mouseup);
			$(document).unbind('mousemove', self.mousemove);

			if(this.init == false)
				return this.opos = this.pos = null;
			
			if(o.onStop) o.onStop.apply(this.element, [this.helper, this.pos, [o.curOffset.left - o.po.left,o.curOffset.top - o.po.top],this]);
			this.execPlugins('stop');

			if(this.slowMode && $.ui.droppable) { //If cursorAt is within the helper, we must use our drop manager
				var m = $.ui.ddmanager.droppables;
				for(var i=0;i<m.length;i++) {
					var cO = m[i].offset;
					if((this.pos[0] > cO.left && this.pos[0] < cO.left + m[i].item.element.offsetWidth) && (this.pos[1] > cO.top && this.pos[1] < cO.top + m[i].item.element.offsetHeight)) {
						m[i].item.drop.call(m[i].item);
					}
				}
			}
				
			if(this.helper != this.element && !this.helper.keepMe) // Remove helper, if it's not the original node
				$(this.helper).remove();

			this.init = false;
			$.ui.ddmanager.current = null;	
			this.opos = this.pos = this.helper = null; // Clear temp variables
			
			return false;
			
		},
		drag: function(e) {

			if ($.browser.msie && !e.button) return this.stop.apply(this, [e]); // check for IE mouseup when moving into the document again
			var o = this.options;
			
			this.pos = $.ui.getPointer(e); //Get the current mouse position
			this.rpos = [this.pos[0],this.pos[1]]; //Save the absolute mouse position for later use
			
			if(o.pp) { //If we have a positioned parent, use a relative position
				this.pos[0] -= o.po.left;
				this.pos[1] -= o.po.top;	
			}

			if( (Math.abs(this.pos[0]-this.opos[0]) > o.preventionDistance || Math.abs(this.pos[1]-this.opos[1]) > o.preventionDistance) && this.init == false) //If position is more than x pixels from original position, start dragging
				this.start.apply(this,[e]);			
			else {
				if(this.init == false) return false;
			}
		
			if(o.onDrag) var retPos = o.onDrag.apply(this.element, [this.helper,this.pos,this.opos,o.cursorAt]);
			if(retPos) { // If something came back from our callback, use it as modified position
				if(retPos.x) this.pos[0] = retPos.x;
				if(retPos.y) this.pos[1] = retPos.y;	
			}
			
			
			if(this.slowMode && $.ui.droppable) { // If cursorAt is within the helper, we must use our drop manager to look where we are
				var m = $.ui.ddmanager.droppables;
				for(var i=0;i<m.length;i++) {
					var cO = m[i].offset;
					if((this.pos[0] > cO.left && this.pos[0] < cO.left + m[i].item.element.offsetWidth) && (this.pos[1] > cO.top && this.pos[1] < cO.top + m[i].item.element.offsetHeight)) {
						if(m[i].over == 0) { m[i].out = 0; m[i].over = 1; m[i].item.hover.call(m[i].item); }
					} else {
						if(m[i].out == 0) { m[i].out = 1; m[i].over = 0; m[i].item.out.call(m[i].item); }
					}
				}
			}

			this.pos = [this.pos[0]-(o.cursorAt.left ? o.cursorAt.left : 0), this.pos[1]-(o.cursorAt.top ? o.cursorAt.top : 0)];
			this.execPlugins('drag');

			$(this.helper).css('left', this.pos[0]+'px').css('top', this.pos[1]+'px'); // Stick the helper to the cursor
			return false;
			
		}
	});

 })($);