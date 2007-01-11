/**
 * Some notes about keys:
 * 
 * For letters:
 *  * keyup and keydown provide accurate keyCode (same regardless of capital/lowercase)
 *  * keypress provides accurate keyChar (the exact character value of the pressed key)
 *  
 * For arrows and other keys:
 *  * keypress is useless cross-browser
 *  * keyup and keydown provide accurate keyCode
 *  ** 8:   Backspace
 *  ** 9:   Tab
 *  ** 13:  Enter
 *  ** 16:  Shift
 *  ** 17:  Control
 *  ** 18:  Alt
 *  ** 19:  Pause
 *  ** 20:  Caps-Lock
 *  ** 27:  Escape
 *  ** 32:  Space
 *  ** 33:  Page-Up
 *  ** 34:  Page-Down
 *  ** 34:  End
 *  ** 36:  Home
 *  ** 37:  Left Arrow
 *  ** 38:  Up Arrow
 *  ** 39:  Right Arrow
 *  ** 40:  Down Arrow
 *  ** 45:  Insert
 *  ** 46:  Delete
 *  ** 91:  Left Window
 *  ** 92:  Right Window
 *  ** 93:  Select
 *  ** 112: F1
 *  ** 113: F2
 *  ** 114: F3
 *  ** 115: F4
 *  ** 116: F5
 *  ** 117: F6
 *  ** 118: F7
 *  ** 119: F8
 *  ** 120: F9
 *  ** 121: F10
 *  ** 122: F11
 *  ** 123: F12
 *  ** 144: Num-Lock
 *  ** 145: Scroll Lock
 */

(function() {
  var oldFix = jQuery.event.fix;
  jQuery.event.fix = function(event) {
    // Fix target, pageX/pageY, stopPropagation, and preventDefault
    event = oldFix(event) 
  
    // Fix relatedTarget
    if ( isUndefined(event.relatedTarget) && isDefined(event.fromElement) )
      event.relatedTarget = event.fromElement || event.toElement;
    
    // Fix offsetX/offsetY
    if ( isUndefined(event.offsetX) && isDefined(event.pageX) ) {
      event.offsetX = event.pageX - jQuery(event.target).offset(false).left;
      event.offsetY = event.pageY - jQuery(event.target).offset(false).top;
    }  
      
    // Fix metaKey
    if( isUndefined(event.metaKey) && isDefined(event.ctrlKey) )
      event.metaKey = event.ctrlKey;
      
    // Add modifiers
    if( isUndefined(event.modifiers) && isDefined(event.ctrlKey) )
      event.modifiers = (event.altKey ? 1 : 0) + (event.ctrlKey ? 2 : 0) + (event.shiftKey ? 4 : 0);
      
    // Add which for click: 1 == left; 2 == middle; 3 == right
    // Note: button is not normalized, so don't use it
    if( isUndefined(event.which) && isDefined(event.button) )
      event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
  
    // Add which for keypresses: keyCode
    if( isUndefined(event.which) && isDefined(event.keyCode) )
      event.which = event.keyCode;
      
    // Add timeStamp if none exists
    if( isUndefined(event.timeStamp) || event.timeStamp.constructor != Date )
      event.timeStamp = new Date();
      
    // If it's a keypress event, add charCode to IE
    if( isUndefined(event.charCode) && event.type == "keypress" )
      event.charCode = event.keyCode
      
  	return event;  
  }
  
})()

isUndefined = function(n) { return typeof n == "undefined" }
isDefined   = function(n) { return typeof n != "undefined" }