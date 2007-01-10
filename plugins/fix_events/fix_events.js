jQuery.event._fix = jQuery.event.fix

jQuery.event.fix = function(event) {
	var originalEvent = event;
	event = jQuery.extend({}, originalEvent);

	// check if target is a textnode (safari)
	if (jQuery.browser.safari && event.target.nodeType == 3) {
		// store a copy of the original event object 
		// and clone because target is read only
		
		// get parentnode from textnode
		event.target = originalEvent.target.parentNode;
		
		// add preventDefault and stopPropagation since 
		// they will not work on the clone
		event.preventDefault = function() {
			return originalEvent.preventDefault();
		};
		event.stopPropagation = function() {
			return originalEvent.stopPropagation();
		};
	}  

	// Fix target property, if necessary
	if ( !event.target && event.srcElement )
		event.target = event.srcElement;

  // Fix relatedTarget
  if ( isUndefined(event.relatedTarget) && isDefined(event.fromElement) )
    event.relatedTarget = event.fromElement || event.toElement
    
  // Fix offsetX/offsetY
  if ( isUndefined(event.offsetX) && isDefined(event.layerX) )
    event.offsetX = event.layerX, event.offsetY = event.layerY
  
  // Fix pageX/pageY
  if ( isUndefined(event.pageX) && jQuery.fn.offsetX)
    event.pageX = jQuery(event.target).offset(false).left + event.offsetX,
    event.pageY = jQuery(event.target).offset(false).top  + event.offsetY;
    
  // Fix metaKey
  if( isUndefined(event.metaKey) && isDefined(event.ctrlKey) )
    event.metaKey = event.ctrlKey;
    
  // Add modifiers
  if( isUndefined(event.modifiers) && isDefined(event.ctrlKey) )
    event.modifiers = (event.altKey ? 1 : 0) + (event.ctrlKey ? 2 : 0) + (event.shiftKey ? 4 : 0);
    
  // Add which for click: 1 == left; 2 == middle; 3 == right
  if( isUndefined(event.which) && isDefined(event.button) )
    event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));

  // Add which for keypresses: keyCode
  if( isUndefined(event.which) && isDefined(event.keyCode) )
    event.which = event.keyCode
    
  // Add timeStamp if none exists
  if( isUndefined(event.timeStamp) || event.timeStamp.constructor != Date )
    event.timeStamp = new Date();
    
	// Calculate pageX/Y if missing and clientX/Y available
	if ( typeof event.pageX == "undefined" && typeof event.clientX != "undefined" ) {
		var e = document.documentElement, b = document.body;
		event.pageX = event.clientX + (e.scrollLeft || b.scrollLeft);
		event.pageY = event.clientY + (e.scrollTop || b.scrollTop);
	}
			
	// fix preventDefault and stopPropagation
	if (!event.preventDefault)
		event.preventDefault = function() {
			this.returnValue = false;
		};
		
	if (!event.stopPropagation)
		event.stopPropagation = function() {
			this.cancelBubble = true;
		};
		
	return event;
}

isUndefined = function(n) { return typeof n == "undefined" }
isDefined   = function(n) { return typeof n != "undefined" }