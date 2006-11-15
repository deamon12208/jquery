/**
 * @author Paul Bakaus
 */
var animateStyleIsRunning = [];
jQuery.fn.animateStyle = function(c1,c2) {
	var colorIntervals = [];
	var colorTimers = [];

	return jQuery(this).each(function(){
			
		var aniString = {};
		var aniDuration = c2;
		var oldStyleAttr = ($(this).attr("style") || '');
		/* Stupidly in IE, style is a object.. */
		if(typeof oldStyleAttr == 'object') oldStyleAttr = oldStyleAttr["cssText"];
		
		/* Let's check if a animation is already running on the same element. */
		if(animateStyleIsRunning[this] == true) return; else animateStyleIsRunning[this] = true;

		/* Create and append a dummy element for computing the styles
		 * on the new class. It will not be visible, of course.
		 */
		var dummyEl = this.cloneNode(true);
		$(dummyEl).html($(this).html());

		$(this.parentNode).append(dummyEl);
		
		/* Set new style on dummy */
		$(dummyEl).attr("style", c1);
		$(dummyEl).css("visibility", "hidden").css("position", "absolute");		

		if(document.defaultView) {
			var oldStyle = document.defaultView.getComputedStyle(this,null);
			var newStyle = document.defaultView.getComputedStyle(dummyEl,null);
		} else {
			var oldStyle = this.currentStyle;
			var newStyle = dummyEl.currentStyle;
		}

		/* The main function to form the object for animation */
		if(window.console != undefined) console.log("Animating element to style "+c1+" with the following properties:");
		
		for(var n in newStyle) {
			if( typeof newStyle[n] != "function" && newStyle[n] /* No functions and null properties */
				&& n.indexOf("Moz") == -1 && n.indexOf("length") == -1 /* No mozilla spezific render properties. */
				&& newStyle[n] != oldStyle[n] /* Only values that have changed are used for the animation */
			)
			{ 
				/* At this part, we suggest, that all changes the user made are:
				 * 1) Numeric changes (Integer) or
				 * 2) Color changes
				 * We cannot insert strings into animate
				 * (there is no way anyway to animate a solid border to an outset one).
				 */
	
				if(n.indexOf("Color") == -1 && n.indexOf("color") == -1) {
					if(!isNaN(parseInt(newStyle[n].replace(/px/, "")))) {
	
	                	/* If it's not positioned, remove position values because of performance */
	                    if(oldStyle.position != "static"  || (oldStyle.position == "static" && n != "left" && n != "top" && n != "bottom" && n != "right"))
	                    {
							if(window.console != undefined) console.log(n+": "+parseInt(newStyle[n].replace(/px/, "")));  /* Debug line */
							aniString[n] = parseInt(newStyle[n].replace(/px/, ""));	/* Remove px from every value and convert to integer */
	                	}
	                } else {
						/* If non-integer, set it directly */
						if(n != "visibility" && n != "position") $(this).css(n, newStyle[n]);
					}
				} else {
					/* Okay this is the tricky part...
					 * let's start the color fading.
					 */
					
					animateColor(this,n,oldStyle[n],newStyle[n], aniDuration,oldStyleAttr);
					if(window.console != undefined) console.log(n+": "+newStyle[n]);  /* Debug line */
				}
			}
		}

		/* Finally, we'll do the animation with our newly constructed animation
		 * object with our changed values.
		 */
		$(this).animate(aniString, aniDuration, function() {
			
			/* Change style attribute back to original.
			 * For stupid IE, we need to clear the damn object.
			 */
			if(typeof $(this).attr("style") == 'object') {
				$(this).attr("style")["cssText"] = "";
				$(this).attr("style")["cssText"] = oldStyleAttr;
			} else {
				$(this).attr("style", oldStyleAttr);	
			}
			
			/* Remove the dummy */
			$(dummyEl).remove();
			
			/* Set Queue property to false */
			animateStyleIsRunning[this] = false;
		});
	});

	/* Our color animation function */
	function animateColor(that,prop,oldColor,newColor, aniDuration,oldStyleAttr) {
		var nSC,oSC;
		/* Workaround for special case 'transparent':
		 * We need to set it to white, fading from transparent to red
		 * is just very difficult.
		 */
		if(oldColor == "transparent") { oSC = [255,255,255]; } else {
			if(oldColor.substr(0, 3) == "rgb") oSC = oldColor.substr(4).replace(/\)/, "").split(","); /* It's a gecko rgb value */
			if(oldColor.substr(0, 1) == "#" && oldColor.length == 7) oSC = [parseInt(oldColor.substr(1,2),16),parseInt(oldColor.substr(3,2),16),parseInt(oldColor.substr(5,2),16)]; /* it's a hex value.. */
			if(oldColor.substr(0, 1) == "#" && oldColor.length == 4) oSC = [parseInt(oldColor.substr(1,1)+oldColor.substr(1,1),16),parseInt(oldColor.substr(2,1)+oldColor.substr(2,1),16),parseInt(oldColor.substr(3,1)+oldColor.substr(3,1),16)]; /* it's a short hex value.. */
			/* No luck with them? Then it's something written */
			if(oldColor.substr(0, 3) != "rgb" && oldColor.substr(0, 1) != "#") oSC = colorToArray(oldColor);
		}
		if(newColor == "transparent") {
			nSC = [255,255,255]	
		} else {
			if(newColor.substr(0, 3) == "rgb") nSC = newColor.substr(4).replace(/\)/, "").split(","); /* It's a gecko rgb value */
			if(newColor.substr(0, 1) == "#" && newColor.length == 7) nSC = [parseInt(newColor.substr(1,2),16),parseInt(newColor.substr(3,2),16),parseInt(newColor.substr(5,2),16)]; /* it's a hex value.. */
			if(newColor.substr(0, 1) == "#" && newColor.length == 4) nSC = [parseInt(newColor.substr(1,1)+newColor.substr(1,1),16),parseInt(newColor.substr(2,1)+newColor.substr(2,1),16),parseInt(newColor.substr(3,1)+newColor.substr(3,1),16)]; /* it's a short hex value.. */
			/* No luck with them? Then it's something written */
			if(newColor.substr(0, 3) != "rgb" && newColor.substr(0, 1) != "#") nSC = colorToArray(newColor);		
		}
		
		var diffR = parseInt(nSC[0]) - parseInt(oSC[0]);
		var diffG = parseInt(nSC[1]) - parseInt(oSC[1]);
		var diffB = parseInt(nSC[2]) - parseInt(oSC[2]);
		
		colorTimers[prop] = 0;
		colorIntervals[prop] = window.setInterval(intervalColor,20);
		
		function intervalColor() {
			colorTimers[prop] = colorTimers[prop] + 20;

			var newR = Math.round(parseInt(oSC[0]) + (diffR/aniDuration)*colorTimers[prop]);
			var newG = Math.round(parseInt(oSC[1]) + (diffG/aniDuration)*colorTimers[prop]);
			var newB = Math.round(parseInt(oSC[2]) + (diffB/aniDuration)*colorTimers[prop]);
			$(that).css(prop, "rgb("+newR+","+newG+","+newB+")");
			
			if(colorTimers[prop] == aniDuration) {
				window.clearInterval(colorIntervals[prop]);
				/* CLEAR THE DAMN HARDCODED CSS STYLE TAG!!! FINALLY!! */
				if(typeof $(that).attr("style") == 'object') {
					$(that).attr("style")["cssText"] = "";
					$(that).attr("style")["cssText"] = oldStyleAttr;
				}					
			}	
		};

		function colorToArray(cColor) {
			switch(cColor) {
				case 'aqua':
					return [0,255,255];
					break;
				case 'azure':
					return [240,255,255];
					break;
				case 'beige':
					return [245,245,220];
					break;
				case 'black':
					return [0,0,0];
					break;
				case 'blue':
					return [0,0,255];
					break;
				case 'brown':
					return [165,42,42];
					break;
				case 'cyan':
					return [0,255,255];
					break;
				case 'darkblue':
					return [0,0,139];
					break;
				case 'darkcyan':
					return [0,139,139];
					break;
				case 'darkgrey':
					return [169,169,169];
					break;
				case 'darkgreen':
					return [0,100,0];
					break;
				case 'darkkhaki':
					return [189,183,107];
					break;
				case 'darkmagenta':
					return [139,0,139];
					break;
				case 'darkolivegreen':
					return [85,107,47];
					break;
				case 'darkorange':
					return [255,140,0];
					break;
				case 'darkorchid':
					return [153,50,204];
					break;
				case 'darkred':
					return [139,0,0];
					break;
				case 'darksalmon':
					return [233,150,122];
					break;
				case 'darkviolet':
					return [148,0,211];
					break;
				case 'fuchsia':
					return [255,0,255];
					break;
				case 'gold':
					return [255,215,0];
					break;
				case 'green':
					return [0,128,0];
					break;
				case 'indigo':
					return [75,0,130];
					break;
				case 'khaki':
					return [240,230,140];
					break;
				case 'lightblue':
					return [173,216,230];
					break;
				case 'lightcyan':
					return [224,255,255];
					break;
				case 'lightgreen':
					return [144,238,144];
					break;
				case 'lightgrey':
					return [211,211,211];
					break;
				case 'lightpink':
					return [255,182,193];
					break;
				case 'lightyellow':
					return [255,255,224];
					break;
				case 'lime':
					return [0,255,0];
					break;
				case 'magenta':
					return [255,0,255];
					break;
				case 'maroon':
					return [128,0,0];
					break;
				case 'navy':
					return [0,0,128];
					break;
				case 'olive':
					return [128,128,0];
					break;
				case 'orange':
					return [255,165,0];
					break;
				case 'pink':
					return [255,192,203];
					break;
				case 'purple':
					return [128,0,128];
					break;
				case 'red':
					return [255,0,0];
					break;
				case 'silver':
					return [192,192,192];
					break;
				case '238,130,238':
					return [238,130,238];
					break;
				case 'white':
					return [255,255,255];
					break;
				case 'yellow':
					return [255,255,0]
				default:
					return [0,0,0];
					break;
			}	
		};				
	};
};