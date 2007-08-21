/* jQuery UI Tabs (Tabs 3)
 * 
 */
(function($) {
    
    $.fn.tabs = function(initial, options) {
    	if (initial && initial.constructor == Object) {
    	    options = initial;
    	    initial = null;
    	}
    	
    	return this.each(function() {
    		new $.ui.tabs(this, $.extend((options || {}), { initial: (initial || 0) }));
    	});
    };

    $.ui.tabs = function(el, options) {
    	
    	this.options = $.extend({
    	    initial: 0
    	}, options);
    	this.source = el;
    	
    	if (options.name) {
    	    $.ui.add(options.name, 'tabs', this);
		}
    	
    	this.tabify();
    };
    
    $.extend($.ui.tabs.prototype, {
        tabify: function(el) {
            
            var self = this;
            this.tabs = $('a:first-child', this.source);
            this.contents = [];
            
            this.tabs.each(function(i, t) {

        	    //var hostname = this.hostname && this.hostname.replace(/:\d*$/, '');
        	    
        	    if (t.hash) { // inline tab
        	        self.contents.push( $(t.hash)[0] ); // jQuery's add() does not work somehow
        	    } else { // remote tab
        	        // TODO create and add container
        	    }

        	    //console.log( $(this).attr('href').indexOf('#') == 0 );
        	});
        	
        	this.contents = $(this.contents); // jQueryize here, add() in the first place doesn't seem to work
        },
        add: function(url, text, position) { // TODO callback?
            /*
                $('ul').tabs({ name: 'myTabs' });
                $.ui.get('myTabs', 'tabs')[0].add('#new-tab', 'New Tab', 2);
            */
            position = position || this.tabs.length + 1;
            if (position > this.tabs.length) {
                var method = 'insertAfter';
                position = this.tabs.length - 1;
            } else {
                var method = 'insertBefore';
                --position;
            }
            $('<div id="' + url.replace('#', '') + '"></div>')[method](this.contents[position])
            $('<li><a href="' + url + '"><span>' + text + '</span></a></li>')[method](this.tabs.eq(position).parents('li:eq(0)'));            
            this.tabs.unbind('click');
            this.tabify();
        },
        remove: function(position) {
            /*
                $('ul').tabs({ name: 'myTabs' });
                $.ui.get('myTabs', 'tabs')[0].remove(2);
            */
            if (position && position.constructor == Number) {
                --position;
                this.tabs.unbind('click');
                this.tabs.eq(position).parents('li:eq(0)').remove();
                this.contents.eq(position).remove();
                this.tabify();
            }
        },
        enable: function() {
            
        },
        disable: function() {
              
        },
        show: function() {
            
        },
        reload: function() {
            
        },
        active: function() {
            
        }
    });
    
    
})(jQuery);

