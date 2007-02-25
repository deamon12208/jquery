/*
 * Ext - JS Library 1.0 Alpha 2
 * Copyright(c) 2006-2007, Jack Slocum.
 * 
 * http://www.extjs.com/license.txt
 */

Ext.util.DelayedTask=function(fn,_2,_3){var _4=null;this.delay=function(_5,_6,_7,_8){if(_4){clearTimeout(_4);}fn=_6||fn;_2=_7||_2;_3=_8||_3;_4=setTimeout(fn.createDelegate(_2,_3),_5);};this.cancel=function(){if(_4){clearTimeout(_4);_4=null;}};};
