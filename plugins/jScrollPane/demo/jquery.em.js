/**
 * @projectDescription Monitor Font Size Changes with jQuery
 *
 * @version 1.0a
 * @author Dave Cardwell
 *
 * jQuery-Em - r$Revision: 8 $ ($Date: 2007-08-17 16:49:19 +0100 (Fri, 17 Aug 2007) $)
 * http://davecardwell.co.uk/javascript/jquery/plugins/jquery-em/
 *
 * Copyright ©2007 Dave Cardwell <http://davecardwell.co.uk/>
 * Dual licensed under the MIT (MIT-LICENSE.txt) and
 * GPL (GPL-LICENSE.txt) licenses.
 */

// Upon $(document).ready()…
jQuery(function($) {
    // Set up default options.
    $.em = $.extend({
        /**
         * The number of milliseconds to wait when polling for changes to the
         * font size.
         *
         * @example $.em.delay = 400;
         * @desc Defaults to 200ms.
         *
         * @property
         * @name delay
         * @type Number
         * @cat Plugins/Em
         */
        delay: 200,
        
        /**
         * The element used to detect changes to the font size.
         *
         * @example $.em.element = $('<div />')[0];
         * @desc Default is an empty, absolutely positioned, 100em-wide <div>.
         *
         * @private
         * @property
         * @name element
         * @type Element
         * @cat Plugins/Em
         */
        element: $('<div />').css({ left:     '-100em',
                                    position: 'absolute',
                                    width:    '100em' })
                             .prependTo(document.body)[0],
        
        /**
         * The action to perform when a change in the font size is detected.
         *
         * @example $.em.action = function() { ... }
         * @desc The default action is to trigger a global “emchange” event.
         * You probably shouldn’t change this behaviour as other plugins may
         * rely on it.
         *
         * @example $(document).bind('emchange', function(e, cur, prev) {...})
         * @desc Any functions triggered on this event are passed the current
         * font size, and last known font size as additional parameters.
         *
         * @private
         * @property
         * @name action
         * @type Function
         * @cat Plugins/Em
         * @see current
         * @see previous
         */
        action: function() {
            var currentWidth = $.em.element.offsetWidth / 100;
            
            // If the font size has changed since we last checked…
            if ( currentWidth != $.em.current ) {
                /**
                 * The previous value of the user agent’s font size. See
                 * $.em.current for caveats.
                 *
                 * @example $.em.previous;
                 * @result 16
                 *
                 * @property
                 * @name previous
                 * @type Number
                 * @cat Plugins/Em
                 * @see current
                 */
                $.em.previous = $.em.current;
                
                /**
                 * The current value of the user agent’s font size. As with
                 * $.em.previous, this value may be subject to minor browser
                 * rounding errors that mean it should not be relied upon as
                 * an absolute value.
                 *
                 * @example $.em.current;
                 * @result 14
                 *
                 * @property
                 * @name current
                 * @type Number
                 * @cat Plugins/Em
                 * @see previous
                 */
                $.em.current = currentWidth;
                
                $.event.trigger('emchange', [$.em.current, $.em.previous]);
            }
        }
    }, $.em );
    
    // Store the initial pixel value of the user agent’s font size.
    $.em.current = $.em.element.offsetWidth / 100;
    
    // Try to use Internet Explorer’s proprietary “setExpression” method…
    try {
        $.em.element.style.setExpression(
            'width', 'function() {jQuery.em.action(); return "100em";}()' 
        );
    }
    // …otherwise fall back to polling for changes.
    catch(e) {
        /**
         * When the polling method is being used, $.em.iid stores the
         * intervalID should you want to cancel with clearInterval().
         *
         * @example window.clearInterval( $.em.iid );
         * 
         * @property
         * @name iid
         * @type Number
         * @cat Plugins/Em
         */
        $.em.iid = window.setInterval( $.em.action, $.em.delay );
    }
});
