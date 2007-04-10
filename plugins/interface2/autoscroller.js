/**
 * Interface Elements for jQuery
 * Autoscroller
 * 
 * http://interface.eyecon.ro
 * 
 * Copyright (c) 2006 Stefan Petre
 * Dual licensed under the MIT (MIT-LICENSE.txt) 
 * and GPL (GPL-LICENSE.txt) licenses.
 *   
 *
 */

/**
 * Utility object that helps to make custom autoscrollers.
 * 
 * @example
 *		$('div.dragMe').Draggable(
 *			{
 *				onStart : function()
 *				{
 *					$.iAutoscroller.start(this, document.getElementsByTagName('body'));
 *				},
 *				onStop : function()
 *				{
 *					$.iAutoscroller.stop();
 *				}
 *			}
 *		);
 *
 * @description Utility object that helps to make custom autoscrollers
 * @type jQuery
 * @cat Plugins/Interface
 * @author Stefan Petre
 */

(function($) {
	$.autoscroller = {
		timer: null,
		elToScroll: null,
		elsToScroll: null,
		proxy: 20,
		step: 10,
		/**
		 * This is called to start autoscrolling
		 * @param DOMElement el the element used as reference
		 * @param Array els collection of elements to scroll
		 * @param Integer step the pixels scroll on each step
		 * @param Integer interval miliseconds between each step
		 */
		start: function( els, step, proxy, interval)
		{
			window.clearInterval(jQuery.autoscroller.timer);
			$.autoscroller.elsToScroll = $(els).each(function(){
				this.scrollData = $.extend(
					$.iUtil.getPosition(this),
					$.iUtil.getSize(this),
					$.iUtil.getScroll(this)
				);
			});
			$.autoscroller.proxy = parseInt(proxy)||20;
			$.autoscroller.step = parseInt(step)||10;
			$.autoscroller.timer = window.setInterval(jQuery.autoscroller.doScroll, parseInt(interval)||40);
		},
		
		//private function
		doScroll : function()
		{
			$.autoscroller.elsToScroll.each(function(){$.DDM.pointer;
				if (this.scrollData.y <= $.DDM.pointer.y && this.scrollData.y + $.autoscroller.proxy >= $.DDM.pointer.y) {
					this.scrollTop = this.scrollTop - $.autoscroller.step;
				} else if(this.scrollData.y + this.scrollData.hb >= $.DDM.pointer.y && this.scrollData.y + this.scrollData.hb - $.autoscroller.proxy <= $.DDM.pointer.y) {
					this.scrollTop = this.scrollTop + $.autoscroller.step;
				}
				if (this.scrollData.x <= $.DDM.pointer.x && this.scrollData.x + $.autoscroller.proxy >= $.DDM.pointer.x) {
					this.scrollLeft = this.scrollLeft - $.autoscroller.step;
				} else if(this.scrollData.x + this.scrollData.wb >= $.DDM.pointer.x && this.scrollData.x + this.scrollData.wb - $.autoscroller.proxy <= $.DDM.pointer.x) {
					this.scrollLeft = this.scrollLeft + $.autoscroller.step;
				}
			});
		},
		/**
		 * This is called to stop autoscrolling
		 */
		stop: function()
		{
			window.clearInterval(jQuery.autoscroller.timer);
			jQuery.autoscroller.elToScroll = null;
			jQuery.autoscroller.elsToScroll = null;
			for (i in jQuery.autoscroller.elsToScroll) {
				jQuery.iAutoscroller.elsToScroll[i].parentData = null;
			}
		}
	};
 })(jQuery);