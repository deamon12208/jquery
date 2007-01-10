/**
 * Interface Elements for jQuery
 * FX - drop
 * 
 * http://interface.eyecon.ro
 * 
 * Copyright (c) 2006 Stefan Petre
 * Dual licensed under the MIT (MIT-LICENSE.txt) 
 * and GPL (GPL-LICENSE.txt) licenses.
 *   
 *
 */

jQuery.fn.extend(
	{
		DropOutDown : function (speed, callback, easing) {
			return this.queue('interfaceFX',function(){
				new jQuery.fx.DropOutDirectiont(this, speed, callback, 'down', 'out', easing);
			});
		},
		
		DropInDown : function (speed, callback, easing) {
			return this.queue('interfaceFX',function(){
				new jQuery.fx.DropOutDirectiont(this,  speed, callback, 'down', 'in', easing);
			});
		},
		
		DropToggleDown : function (speed, callback, easing) {
			return this.queue('interfaceFX',function(){
				new jQuery.fx.DropOutDirectiont(this,  speed, callback, 'down', 'toggle', easing);
			});
		},
		
		DropOutUp : function (speed, callback, easing) {
			return this.queue('interfaceFX',function(){
				new jQuery.fx.DropOutDirectiont(this, speed, callback, 'up', 'out', easing);
			});
		},
		
		DropInUp : function (speed, callback, easing) {
			return this.queue('interfaceFX',function(){
				new jQuery.fx.DropOutDirectiont(this,  speed, callback, 'up', 'in', easing);
			});
		},
		
		DropToggleUp : function (speed, callback, easing) {
			return this.queue('interfaceFX',function(){
				new jQuery.fx.DropOutDirectiont(this,  speed, callback, 'up', 'toggle', easing);
			});
		},
		
		DropOutLeft : function (speed, callback, easing) {
			return this.queue('interfaceFX',function(){
				new jQuery.fx.DropOutDirectiont(this, speed, callback, 'left', 'out', easing);
			});
		},
		
		DropInLeft : function (speed, callback, easing) {
			return this.queue('interfaceFX',function(){
				new jQuery.fx.DropOutDirectiont(this,  speed, callback, 'left', 'in', easing);
			});
		},
		
		DropToggleLeft : function (speed, callback, easing) {
			return this.queue('interfaceFX',function(){
				new jQuery.fx.DropOutDirectiont(this,  speed, callback, 'left', 'toggle', easing);
			});
		},
		
		DropOutRight : function (speed, callback, easing) {
			return this.queue('interfaceFX',function(){
				new jQuery.fx.DropOutDirectiont(this, speed, callback, 'right', 'out', easing);
			});
		},
		
		DropInRight : function (speed, callback, easing) {
			return this.queue('interfaceFX',function(){
				new jQuery.fx.DropOutDirectiont(this,  speed, callback, 'right', 'in', easing);
			});
		},
		
		DropToggleRight : function (speed, callback, easing) {
			return this.queue('interfaceFX',function(){
				new jQuery.fx.DropOutDirectiont(this,  speed, callback, 'right', 'toggle', easing);
			});
		}
	}
);

jQuery.fx.DropOutDirectiont = function (e, speed, callback, direction, type, easing)
{
	if (!jQuery.fxCheckTag(e)) {
		jQuery.dequeue(e, 'interfaceFX');
		return false;
	}
	var z = this;
	z.el = jQuery(e);
	z.easing = typeof callback == 'string' ? callback : easing||null;
	z.oldStyle = {};
	z.oldStyle.position = z.el.css('position');
	z.oldStyle.top = z.el.css('top');
	z.oldStyle.left = z.el.css('left');
	if (!e.ifxFirstDisplay)
		e.ifxFirstDisplay = z.el.css('display');
	if ( type == 'toggle') {
		type = z.el.css('display') == 'none' ? 'in' : 'out';
	}
	z.el.show();
	
	if (z.oldStyle.position != 'relative' && z.oldStyle.position != 'absolute') {
		z.el.css('position', 'relative');
	}
	z.type = type;
	callback = typeof callback == 'function' ? callback : null;
	/*sizes = ['em','px','pt','%'];
	for(i in sizes) {
		if (z.oldStyle.top.indexOf(sizes[i])>0) {
			z.topUnit = sizes[1];
			z.topSize = parseFloat(z.oldStyle.top)||0;
		}
		if (z.oldStyle.left.indexOf(sizes[i])>0) {
			z.leftUnit = sizes[1];
			z.leftSize = parseFloat(z.oldStyle.left)||0;
		}
	}*/
	
	directionIncrement = 1;
	switch (direction){
		case 'up':
			z.e = new jQuery.fx(z.el.get(0), jQuery.speed(speed - 15, z.easing,callback), 'top');
			z.point = parseFloat(z.oldStyle.top)||0;
			z.unit = z.topUnit;
			directionIncrement = -1;
		break;
		case 'down':
			z.e = new jQuery.fx(z.el.get(0), jQuery.speed(speed - 15, z.easing,callback), 'top');
			z.point = parseFloat(z.oldStyle.top)||0;
			z.unit = z.topUnit;
		break;
		case 'right':
			z.e = new jQuery.fx(z.el.get(0), jQuery.speed(speed - 15, z.easing,callback), 'left');
			z.point = parseFloat(z.oldStyle.left)||0;
			z.unit = z.leftUnit;
		break;
		case 'left':
			z.e = new jQuery.fx(z.el.get(0), jQuery.speed(speed - 15, z.easing,callback), 'left');
			z.point = parseFloat(z.oldStyle.left)||0;
			z.unit = z.leftUnit;
			directionIncrement = -1;
		break;
	}
	z.e2 = new jQuery.fx(
		z.el.get(0),
		jQuery.speed
		(
		 	speed, z.easing,
			function()
			{
				z.el.css(z.oldStyle);
				if (z.type == 'out') {
					z.el.css('display', 'none');
				} else 
					z.el.css('display', z.el.get(0).ifxFirstDisplay == 'none' ? 'block' : z.el.get(0).ifxFirstDisplay);
				
				jQuery.dequeue(z.el.get(0), 'interfaceFX');
			}
		 ),
		'opacity'
	);
	if (type == 'in') {
		z.e.custom(z.point+ 100*directionIncrement, z.point);
		z.e2.custom(0,1);
	} else {
		z.e.custom(z.point, z.point + 100*directionIncrement);
		z.e2.custom(1,0);
	}
};