/* jQuery UI Tabs (Tabs 3)
 * 
 */
(function($) {
 
 	// if the UI scope is not availalable, add it
	$.ui = $.ui || {};
    
    $.fn.tabs = function(initial, options) {
    	if (initial && initial.constructor == Object) {
    	    options = initial;
    	    initial = null;
    	}
    	options = options || {};
    	
    	// first get initial tab from options
    	initial = initial && initial.constructor == Number && --initial || 0;
    	
    	return this.each(function() {
    		new $.ui.tabs(this, $.extend(options, { initial: initial }));
    	});
    };
    
    // create chainable tabs methods
    $.each(['add', 'remove'], function(i, method) {
        $.fn[method + 'Tab'] = function() {
            var args = arguments;
            return this.each(function() {
                this.jQueryTabs[method].apply(this.jQueryTabs, args);
            });
        };
    });
    
    /*$.fn.addTab = function(url, text, position) { // TODO callback?
        var args = arguments;
        return this.each(function() {
            this.jQueryTabs.add.apply(this.jQueryTabs, args);
        });
    };
    
    $.fn.removeTab = function(position) {
        var args = arguments;
        return this.each(function() {
            this.jQueryTabs.remove.apply(this.jQueryTabs, args);
        });
    };*/
    
    $.fn.enableTab = function(position) {
        return this.each(function() {
            
        });
    };
    
    $.fn.disableTab = function(position) {
        return this.each(function() {
            
        });
    };
    
    $.fn.showTab = function(position) {
        return this.each(function() {
            
        });
    };
    
    $.fn.reloadTab = function(position, url) {
        // frequently requested: if url is passed reload tab with that url
        return this.each(function() {
            
        });
    };
    
    $.fn.activeTab = function() {
        // returns number or element?
    };

    $.ui.tabs = function(el, options) {
    	
    	this.source = el;
    	
    	this.options = $.extend({
            initial: 0,
            /*disabled: null,*/
            // TODO bookmarkable: $.ajaxHistory ? true : false,
            spinner: 'Loading&#8230;',
            hashPrefix: 'tab-',
            /*fxFade: null,
            fxSlide: null,
            fxShow: null,
            fxHide: null,*/
            fxSpeed: 'normal',
            /*fxShowSpeed: null,
            fxHideSpeed: null,*/
            click: null,
            show: null,
            navClass: 'tabs-nav',
            selectedClass: 'tabs-selected',
            disabledClass: 'tabs-disabled',
            containerClass: 'tabs-container',
            hideClass: 'tabs-hide',
            loadingClass: 'tabs-loading'
        }, options);    	
    	
    	this.tabify();
    };
    
    $.extend($.ui.tabs.prototype, {        
        tabify: function() {
              
            this.$tabs = $('a:first-child', this.source);
            this.$containers = $([]);
            
            var instance = this;
            var $source = $(this.source), options = this.options;
            
            this.$tabs.each(function(i, a) {
        	    if (a.hash) { // inline tab
        	        instance.$containers = instance.$containers.add(a.hash); // jQuery's add() does not work somehow
        	    } else { // remote tab
        	        // TODO create and add container
        	    }
        	});
        	
        	// Try to retrieve initial tab from fragment identifier in url if present,
            // otherwise try to find selected class attribute on <li>.
        	this.$tabs.each(function(i, a) {
                if (location.hash) {
                    if (a.hash == location.hash) {
                        options.initial = i;
                        // prevent page scroll to fragment
                        //if (($.browser.msie || $.browser.opera) && !options.remote) {
                        if ($.browser.msie || $.browser.opera) {
                            var $toShow = $(location.hash);
                            var toShowId = toShow.attr('id');
                            $toShow.attr('id', '');
                            setTimeout(function() {
                                $toShow.attr('id', toShowId); // restore id
                            }, 500);
                        }
                        scrollTo(0, 0);
                        return false; // break
                    }
                } else if ( $(a).parents('li:eq(0)').is('li.' + options.selectedClass) ) {
                    options.initial = i;
                    return false; // break
                }
        	});
        	
            // attach necessary classes for styling if not present
            $source.is('.' + options.navClass) || $source.addClass(options.navClass);
            this.$containers.each(function() {
                var $this = $(this);
                $this.is('.' + options.containerClass) || $this.addClass(options.containerClass);
            });
            
            // highlight tab accordingly
            this.$containers.filter(':eq(' + options.initial + ')').show().end().not(':eq(' + options.initial + ')').addClass(options.hideClass);
            $('li', $source).removeClass(options.selectedClass).eq(options.initial).addClass(options.selectedClass); // eventually need to remove classes in case hash takes precedence over class
            
            // trigger load of initial tab
            // TODO
            //tabs.eq(options.initial).trigger('loadRemoteTab').end();
        	
        	// setup animations
            var showAnim = {}, hideAnim = {}, showSpeed = options.fxShowSpeed || options.fxSpeed, hideSpeed = options.fxHideSpeed || options.fxSpeed;
            if (options.fxSlide || options.fxFade) {
                if (options.fxSlide) {
                    showAnim['height'] = 'show';
                    hideAnim['height'] = 'hide';
                }
                if (options.fxFade) {
                    showAnim['opacity'] = 'show';
                    hideAnim['opacity'] = 'hide';
                }
            } else {
                if (options.fxShow) {
                    showAnim = options.fxShow;
                } else { // use some kind of animation to prevent browser scrolling to the tab
                    showAnim['min-width'] = 0; // avoid opacity, causes flicker in Firefox
                    showSpeed = 1; // as little as 1 is sufficient
                }
                if (options.fxHide) {
                    hideAnim = options.fxHide;
                } else { // use some kind of animation to prevent browser scrolling to the tab
                    hideAnim['min-width'] = 0; // avoid opacity, causes flicker in Firefox
                    hideSpeed = 1; // as little as 1 is sufficient
                }
            }
        	
        	var $containers = this.$containers;
        	
        	
        	// attach click event
            this.$tabs.bind('click', function(e) {

                //var trueClick = e.clientX; // add to history only if true click occured, not a triggered click
                var clicked = this, $li = $(this).parents('li:eq(0)'), $show = $(this.hash), $hide = $containers.filter(':visible');

                // if animation is still running, tab is selected or disabled or onClick callback returns false stop here
                // check if onClick returns false last so that it is not executed for a disabled tab
                if ($source['locked'] || $li.is('.' + options.selectedClass, '.' + options.disabledClass) 
                    || typeof onClick == 'function' && onClick(this, $show[0], $hide[0]) === false) {
                    this.blur();
                    return false;
                }

                $source['locked'] = true;

                // show new tab
                if ($show.size()) {

                    // prevent scrollbar scrolling to 0 and than back in IE7, happens only if bookmarking/history is enabled
                    if ($.browser.msie && options.bookmarkable) {
                        var showId = this.hash.replace('#', '');
                        $show.attr('id', '');
                        setTimeout(function() {
                            $show.attr('id', showId); // restore id
                        }, 0);
                    }

                    var resetCSS = { display: '', overflow: '', height: '' };
                    if (!$.browser.msie) { // not in IE to prevent ClearType font issue
                        resetCSS['opacity'] = '';
                    }

                    // switch tab, animation prevents browser scrolling to the fragment
                    function switchTab() {
                        /*if (options.bookmarkable && trueClick) { // add to history only if true click occured, not a triggered click
                            $.ajaxHistory.update(clicked.hash);
                        }*/
                        $hide.animate(hideAnim, hideSpeed, function() { //
                            $(clicked).parents('li:eq(0)').addClass(options.selectedClass).siblings().removeClass(options.selectedClass);
                            $hide.addClass(options.hideClass).css(resetCSS); // maintain flexible height and accessibility in print etc.                        
                            if (typeof onHide == 'function') {
                                onHide(clicked, $show[0], $hide[0]);
                            }
                            if (!(options.fxSlide || options.fxFade || options.fxShow)) {
                                $show.css('display', 'block'); // prevent occasionally occuring flicker in Firefox cause by gap between showing and hiding the tab containers
                            }
                            $show.animate(showAnim, showSpeed, function() {
                                $show.removeClass(options.hideClass).css(resetCSS); // maintain flexible height and accessibility in print etc.
                                if ($.browser.msie) {
                                    $hide[0].style.filter = '';
                                    $show[0].style.filter = '';
                                }
                                if (typeof onShow == 'function') {
                                    onShow(clicked, $show[0], $hide[0]);
                                }
                                $source['locked'] = null;
                            });
                        });
                    }
                    switchTab();

                    /*if (!options.remote) {
                        switchTab();
                    } else {
                        $(clicked).trigger('loadRemoteTab', [switchTab]);
                    }*/

                } else {
                    alert('There is no such container.');
                }

                // Set scrollbar to saved position - need to use timeout with 0 to prevent browser scroll to target of hash
                var scrollX = window.pageXOffset || document.documentElement && document.documentElement.scrollLeft || document.body.scrollLeft || 0;
                var scrollY = window.pageYOffset || document.documentElement && document.documentElement.scrollTop || document.body.scrollTop || 0;
                setTimeout(function() {
                    scrollTo(scrollX, scrollY);
                }, 0);

                this.blur(); // prevent IE from keeping other link focussed when using the back button

                //return options.bookmarkable && !!trueClick; // convert trueClick == undefined to Boolean required in IE
                return false;
                
            });
        	
        	// TODO attach instance as expando?
        	this.source['jQueryTabs'] = this;
        },
        add: function(url, text, position) { // TODO callback
            if (url && text) {
                position = position || this.$tabs.length + 1;
                if (position > this.$tabs.length) {
                    var method = 'insertAfter';
                    position = this.$tabs.length - 1;
                } else {
                    var method = 'insertBefore';
                    --position;
                }
                $('<div id="' + url.replace('#', '') + '"></div>')[method](this.$containers[position])
                $('<li><a href="' + url + '"><span>' + text + '</span></a></li>')[method](this.$tabs.eq(position).parents('li:eq(0)'));            
                this.$tabs.unbind('click'); // TODO specify function
                this.tabify();
            } else {
                alert('jQuery UI Tabs: Not enough arguments to add tab.'); // TODO use throw?
            }           
        },
        remove: function(position) { // TODO callback
            if (position && position.constructor == Number) {
                --position;
                this.$tabs.unbind('click'); // TODO specify function
                this.$tabs.eq(position).parents('li:eq(0)').remove();
                this.$containers.eq(position).remove();
                this.tabify();
            }
        },
        enable: function(position) { // TODO callback
            
        },
        disable: function(position) { // TODO callback
            
        },
        show: function(position) { // TODO callback
            
        },
        reload: function(position, url) { // TODO callback
            
        }
    });
    
    
})(jQuery);

