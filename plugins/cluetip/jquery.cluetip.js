/*
 * jQuery clueTip plugin
 * Version 0.5  (07/07/2007)
 * @depends jQuery v1.1.1
 * @depends Dimensions plugin 
 *
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 *
 * @name clueTip
 * @type jQuery
 * @cat Plugins/tooltip
 * @return jQuery
 * @author Karl Swedberg
 */
 
 /*
 * @credit Inspired by Cody Lindley's jTip (http://www.codylindley.com)
 * @credit Thanks to Shelane Enos and Glen Lipka for the feature ideas 
 * @credit Thanks to Jonathan Chaffer, as always, for help with the hard parts. :-)
 */
 
 /**
 * 
 * Displays a highly customizable tooltip when the user hovers (default) or clicks (optional) the matched element. 
 * By default, the clueTip plugin loads a page indicated by the "rel" attribute via ajax and displays its contents.
 * If a "title" attribute is specified, its value is used as the clueTip's heading.
 * The attribute to be used for both the body and the heading of the clueTip is user-configurable. 
 * Optionally, the clueTip's body can display content from an element on the same page.
 * * Just indicate the element's id (e.g. "#some-id") in the rel attribute.
 * Optionally, the clueTip's body can display content from the title attribute, when a delimiter is indicated. 
 * * The string before the first instance of the delimiter is set as the clueTip's heading.
 * * All subsequent strings are wrapped in separate DIVs and placed in the clueTip's body.
 * The clueTip plugin allows for many, many more options. Pleasee see the examples and the option descriptions below...
 * 
 * 
 * @example $('#tip).cluetip();
 * @desc This is the most basic clueTip. It displays a 275px-wide clueTip on mouseover of the element with an ID of "tip." On mouseout, the clueTip is hidden.
 *
 *
 * @example $('a.clue').cluetip({
 *  hoverClass: 'highlight',
 *  sticky: true,
 *  closePosition: 'bottom',
 *  closeText: '<img src="cross.png" alt="close" />',
 *  truncate: 60,
 *  ajaxSettings: {
 *    type: 'POST'
 *  }
 * });
 * @desc Displays a clueTip on mouseover of all <a> elements with class="clue". The hovered element gets a class of "highlight" added to it (so that it can be styled appropriately. This is esp. useful for non-anchor elements.). The clueTip is "sticky," which means that it will not be hidden until the user either clicks on its "close" text/graphic or displays another clueTip. The "close" text/graphic is set to diplay at the bottom of the clueTip (default is top) and display an image rather than the default "Close" text. Moreover, the body of the clueTip is truncated to the first 60 characters, which are followed by an ellipsis (...). Finally, the clueTip retrieves the content using POST rather than the $.ajax method's default "GET."
 * 
 *
 *
 * @param Object defaults (optional) Customize your clueTips
 * @option Number width: default is 275. The width of the clueTip
 * @option Boolean local: default is false. Whether to use content from the same page (using ID) for clueTip body
 * @option Boolean hideLocal: default is true. If local option is set to true, determine whether local content to be shown in clueTip should be hidden at its original location. 
 * @option String attribute default is 'rel'. The attribute to be used for the URL of the ajaxed content
 * @option String titleAttribute: default is 'title'. The attribute to be used for the clueTip's heading, if the attribute exists for the hovered element.
 * @option String splitTitle: default is '' (empty string). A character used to split the title attribute into the clueTip title and divs within the clueTip body; if used, the clueTip will be populated only by the title attribute, 
 * @option String hoverClass: default is empty string. designate one to apply to the hovered element
 * @option String waitImage: default is 'wait.gif'
 * @option Boolean sticky: default is false. Set to true to keep the clueTip visible until the user either closes it manually by clicking on the CloseText or display another clueTip.
 * @option String activation: default is 'hover'. Set to 'toggle' to force the user to click the element in order to activate the clueTip.
 * @option String closePosition: default is 'top'. Set to 'bottom' to put the closeText at the bottom of the clueTip body
 * @option String closeText: default is 'Close'. This determines the text to be clicked to close a clueTip when sticky is set to true.
 * @option Number truncate: default is 0. Set to some number greater than 0 to truncate the text in the body of the clueTip. This also removes all HTML/images from the clueTip body.
 * @option Boolean pngFix: default is true. Fixes png transparency for the clueTip in IE<=6. change to false to disable it.
 * @option Boolean hoverIntent: default is true. If jquery.hoverintent.js plugin is included in <head>, hoverIntent() will be used instead of hover()
 * @option Object ajaxProcess: Default is function(data) { data = $(data).not('style, meta, link, script, title); return data; } . When getting clueTip content via ajax, allows processing of it before it's displayed. The default value strips out elements typically found in the <head> that might interfere with current page.
 * @option Object ajaxSettings: allows you to pass in standard $.ajax() parameters for specifying dataType, error, success, etc. Default is { dataType: 'html'}
 *
 */

(function($) { 
    
  var $cluetip, $cluetipInner, $cluetipOuter;
  var msie6 = $.browser.msie && ($.browser.version && $.browser.version < 7 || (/5\.5|6.0/).test(navigator.userAgent));

  $.fn.cluetip = function(options) {
    
    // set up default options
    var defaults = {
      width: 275,
      local: false,
      hideLocal: true,
      attribute: 'rel',
      titleAttribute: 'title',
      splitTitle: '',
      hoverClass: '',
      waitImage: 'wait.gif',
      sticky: false,
      activation: 'hover',
      closePosition: 'top',
      closeText: 'Close',
      truncate: 0,
      pngFix: true,
      hoverIntent: true,
      ajaxProcess: function(data) {
        data = $(data).not('style, meta, link, script, title');
        return data;
      },
      ajaxSettings: {
        dataType: 'html'
      }
    };
    
    if (options && options.ajaxSettings) {
      $.extend(defaults.ajaxSettings, options.ajaxSettings);
      delete options.ajaxSettings;
    }
    
    $.extend(defaults, options);
    
    return this.each(function() {
      // start out with no contents (for ajax activation)
      var cluetipContents = false;
      // create the cluetip divs
      if (!$cluetip) {
        $cluetipInner = $('<div id="cluetip-inner"></div>');
        $cluetipOuter = $('<div id="cluetip-outer"></div>')
        .append($cluetipInner);
        
        $cluetip = $('<div></div>')
          .attr({'id': 'cluetip'})
          .css({position: 'absolute'})
        .append($cluetipOuter)
        .appendTo('body')
        .hide();
      }
      // FIXME: pngFix is broken ;) possibly get Jörn's version from toolt
      if (defaults.pngFix && msie6) {
				var image = $(this).css('backgroundImage');
				if (image.match(/^url\(["']?(.*\.png)["']?\)$/i)) {
					image = RegExp.$1;
					$cluetip.css({
						'backgroundImage': 'none',
						'filter': "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=crop, src='" + image + "')"
					});
				}
      }
      var $this = $(this);      
      var tipAttribute = $this.attr(defaults.attribute);
      if (!tipAttribute) return true;
      
      // if hideLocal is set to true, initially hide the local content that will be displayed in the clueTip
      if (defaults.local && defaults.hideLocal) {
        $(tipAttribute).hide();
      }
      // vertical measurement variables
      var tipHeight, wHeight;
      var sTop, offTop, posY;

      // horizontal measurement variables
      var tipWidth = parseInt(defaults.width, 10);
      var offWidth = this.offsetWidth;
      var offLeft, posX, docWidth;
      
      // parse the title
      var tipParts,
       tipTitle = (defaults.attribute != 'title') ? $this.attr(defaults.titleAttribute) : '';
      if (defaults.splitTitle) {
        tipParts = tipTitle.split(defaults.splitTitle);
        tipTitle = tipParts.shift();
      }
      var localContent;
      
// close cluetip and reset title attribute if one exists
      var cluetipClose = function() {
        $cluetipOuter.css('backgroundImage', 'url(' + defaults.waitImage + ')');
        $cluetipInner.empty().parent().parent().hide();
        if (tipTitle) {
          $this.attr('title', tipTitle);
        }
      };

// get dimensions and options for cluetip and prepare it to be shown
      var cluetipShow = function(bpY) {
        tipHeight = $cluetip.outerHeight();

        if ($this.css('display') == 'block') {
          $cluetip.css({top: (bpY - 10) + 'px'});

        }
        else {
          $cluetip.css({top: posY + 'px'});
        }

        if (defaults.truncate) {
          var $truncloaded = $cluetipInner.text().slice(0,defaults.truncate) + '...';
          $cluetipInner.html($truncloaded);
        }
        if ( posY + tipHeight > sTop + wHeight ) {
          if (tipHeight >= wHeight) {
            $cluetip.css({top: (sTop) + 'px'});            
          } else {
            $cluetip.css({top: (sTop + wHeight - tipHeight - 10) + 'px'});
          }
        } 

        if (defaults.sticky) {
          var $closeLink = $('<a href="#" id="cluetip-close">' + defaults.closeText + '</a>');
          (defaults.closePosition == 'bottom') ? $cluetipInner.append($closeLink) : $cluetipInner.prepend($closeLink);
          $closeLink.click(function() {
            cluetipClose();
            return false;
          });
        }
        if (tipTitle) { 
          $cluetipInner.prepend('<h3 id="cluetip-title">' + tipTitle + '</h3>');
        }
        $cluetip.show();
        $cluetipOuter.css('backgroundImage', 'none');         
      };

/***************************************      
* ACTIVATION
****************************************/

// activate by click
    if (defaults.activation == 'click'||defaults.activation == 'toggle') {
      $this.toggle(function(event) {
        activate(event);
        this.blur();
        return false;
      }, function(event) {
        inactivate(event);
        this.blur();
        return false;
      });
// activate by hover
  // clicking is returned false if cluetip url is same as href url
    } else {
      $this.click(function() {
        if (tipAttribute == $this.attr('href')) {
          return false;
        }
      });
    
      $this[($.fn.hoverIntent) && defaults.hoverIntent ? 'hoverIntent' : 'hover'](function(event) {
        activate(event);
      }, function(event) {
        inactivate(event);
      });
    }
    
//activate clueTip
      var activate = function(event) {
        if (tipAttribute == $this.attr('href')) {
          $this.css('cursor', 'help');
        }
        if (tipTitle) {
          $this.removeAttr('title');          
        }
        if (defaults.hoverClass) {
          $this.addClass(defaults.hoverClass);
        }
        
        sTop = $(document).scrollTop();
        offTop = $this.offset().top;
        offLeft = $this.offset().left;
        docWidth = $(document).width();
        posX = (offWidth > offLeft && offLeft > tipWidth)
          || offLeft + offWidth + tipWidth > docWidth 
          ? offLeft - tipWidth - 15 
          : offWidth + offLeft + 15;
        posY = offTop - 10;

        $cluetip.css({width: defaults.width});
        if ($this.css('display') != 'block' && posX >=0) {
          $cluetip.css({left: posX + 'px'});
        } else {
          if (event.pageX + tipWidth > docWidth) {
            $cluetip.css({left: (event.pageX - tipWidth - 30) + 'px'});
          } else {
            $cluetip.css({left: (event.pageX + 30) + 'px'});
          }
          var pY = event.pageY;
        }
        wHeight = $(window).height();

/***************************************
* load the title attribute only (or user-selected attribute). 
* clueTip title is the string before the first delimiter
* subsequent delimiters place clueTip body text on separate lines
***************************************/
        if (tipParts) {
          for (var i=0; i < tipParts.length; i++){
            if (i == 0) {
              $cluetipInner.html(tipParts[i]);
            } else { 
              $cluetipInner.append('<div class="split-body">' + tipParts[i] + '</div>');
            }            
          };
          cluetipShow(pY);


/***************************************
* load external file via ajax          
***************************************/
        } else if (!defaults.local && tipAttribute.indexOf('#') != 0) {
          if (cluetipContents) {
            $cluetipInner.html(cluetipContents);
            cluetipShow(pY);
          }
          else {
            var ajaxSettings = defaults.ajaxSettings;
            ajaxSettings.url = tipAttribute;
            ajaxSettings.success = function(data) {
              cluetipContents = defaults.ajaxProcess(data);
              $cluetipInner.html(cluetipContents);
              cluetipShow(pY);
            };
            $.ajax(ajaxSettings);
          }

/***************************************
* load an element from the same page
***************************************/
        } else if (defaults.local && tipAttribute.indexOf('#') == 0){
          var localContent = $(tipAttribute).html();
          $cluetipInner.html(localContent);
          cluetipShow(pY);
        }
      };
 // on mouseout...    
      var inactivate = function() {
        if (defaults.sticky == false) {
          cluetipClose();
        };
        if (defaults.hoverClass) {
          $this.removeClass(defaults.hoverClass);
        }
      };
      
    });
  };  
  
})(jQuery);
