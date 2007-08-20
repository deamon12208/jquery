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
    	
    	this.initialize();
    };
    
    $.extend($.ui.tabs.prototype, {
        initialize: function(el) {
            
            var self = this;
            this.tabs = $('a:first-child', this.source);
            this.contents = [];
            
            this.tabs.each(function(i, t) {

        	    //var hostname = this.hostname && this.hostname.replace(/:\d*$/, '');
        	    
        	    if (t.hash) {
        	        self.contents.push( $(t.hash)[0] ); // jQuery's add() does not work somehow
        	    } else {
        	        // TODO create and add container
        	    }

        	    //console.log( $(this).attr('href').indexOf('#') == 0 );
        	});
        	
        	this.contents = $(this.contents); // jQueryize
        },
        add: function(url, text, position) {
            /*
                $('ul').tabs({ name: 'myTabs' });
                $.ui.get('myTabs', 'tabs').addTab('#new-tab', 'New Tab', 2);
            */
            var after = position && --position || --this.tabs.length; // append is default
            $('<div id="' + url.replace('#', '') + '"></div>').insertAfter(this.contents[after])
            $('<li><a href="' + url + '">' + text + '</a></li>').insertAfter(this.tabs.eq(after).parents('li:eq(0)'));
            this.tabs.unbind('click');
            this.initialize();
        },
        remove: function(position) {
            /*
                $('ul').tabs({ name: 'myTabs' });
                $.ui.get('myTabs', 'tabs').removeTab(2);
            */
            this.tabs.eq(position).remove();
            this.contents.eq(position).remove();
            this.tabs.unbind('click');
            this.initialize();
        },
        enable: function() {
            
        },
        disable: function() {
              
        },
        show: function() {
            
        },
        reload: function() { // "reload" ?
            
        },
        active: function() {
            
        }
    });
    
    
})(jQuery);

