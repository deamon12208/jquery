/*  
===============================================================================
Chili is a code highlighter based on jQuery
...............................................................................
                                               Copyright 2007 / Andrea Ercolino
-------------------------------------------------------------------------------
LICENSE: http://www.opensource.org/licenses/mit-license.php
MANUAL:  http://www.mondotondo.com/aercolino/noteslog/?page_id=79
UPDATES: http://www.mondotondo.com/aercolino/noteslog/?cat=8
===============================================================================
*/


ChiliBook = {
/* this object must stay global */ 

	  version:            "1.5" // 2007/01/26

	, elementPath:        "code" // elementPath is a jQuery selector for the element to highlight
	, elementClass:       "" // elementClass is the class of the element addressed by elementPath

	, recipeLoading:      true
	, recipeFolder:       "" // it will be used this way: recipeFolder + recipeName + '.js'
	, stylesheetLoading:  true
	, stylesheetFolder:   "" // it will be used this way: stylesheetFolder + recipeName + '.css'

	, defaultReplacement: '<span class="$0">$$</span>'

	, replaceSpace:       "&#160;"                   // use an empty string for not replacing 
	, replaceTab:         "&#160;&#160;&#160;&#160;" // use an empty string for not replacing
	, replaceNewLine:     "&#160;<br/>"              // use an empty string for not replacing

	, recipes:            {} //repository
};


//-----------------------------------------------------------------------------
( function($) {
//main
$( function() {

	function cook( ingredients, recipe ) {

		function prepareStep( stepName, step ) {
			var exp = ( typeof step.exp == "string" ) ? step.exp : step.exp.source;
			steps.push( {
				stepName: stepName
				, exp: "(" + exp + ")"
				, length: 1                         // add 1 to account for the newly added parentheses
					+ (exp                          // count number of submatches in here
						.replace( /\\./g, "%" )     // disable any escaped character
						.replace( /\[.*?\]/g, "%" ) // disable any character class
						.match( /\((?!\?)/g )       // match any open parenthesis, not followed by a ?
					|| []                           // make sure it is an empty array if there are no matches
					).length                        // get the number of matches
				, replacement: (step.replacement) ? step.replacement : ChiliBook.defaultReplacement 
			} );
		} // function prepareStep( stepName, step )
	
		function knowHow() {
			var prevLength = 0;
			var exps = new Array;
			for (var i = 0; i < steps.length; i++) {
				var exp = steps[ i ].exp;
				// adjust backreferences
				exp = exp.replace( /\\\\|\\(\d+)/g, function( m, aNum ) {
					return !aNum ? m : "\\" + ( prevLength + 1 + parseInt( aNum ) );
				} );
				exps.push( exp );
				prevLength += steps[ i ].length;
			}
			var source = exps.join( "|" );
			return new RegExp( source, (recipe.ignoreCase) ? "gi" : "g" );
		} // function knowHow()

		function escapeHTML( str ) {
			return str.replace( /&/g, "&amp;" ).replace( /</g, "&lt;" );
		} // function escapeHTML( str )

		function replaceSpaces( str ) {
			return str.replace( / +/g, function( spaces ) {
				return spaces.replace( / /g, replaceSpace );
			} );
		} // function replaceSpaces( str )

		function filter( str ) {
			str = escapeHTML( str );
			if( replaceSpace ) {
				str = replaceSpaces( str );
			}
			return str;
		} // function filter( str )

		function chef( matched ) {
			var i = 0;  // iterate steps
			var j = 1;	// iterate chef's arguments
			var step;
			while (step = steps[ i++ ]) {
				var aux = arguments; // this unmasks chef's arguments inside the next function
				if (aux[ j ]) {
					var pattern = /(\\\$)|(?:\$\$)|(?:\$(\d+))/g;
					var replacement = step.replacement
						.replace( pattern, function( m, escaped, K ) {
							var bit = '';
							if( escaped ) {       /* \$ */ 
								return "$";
							}
							else if( !K ) {       /* $$ */ 
								return filter( aux[ j ] );
							}
							else if( K == "0" ) { /* $0 */ 
								return step.stepName;
							}
							else {                /* $K */
								return filter( aux[ j+parseInt(K,10) ] );
							}
						} );

					var offset = arguments[ arguments.length - 2 ];
					var input = arguments[ arguments.length - 1 ];
					var unmatched = input.substring( lastIndex, offset );
					lastIndex = offset + matched.length; // lastIndex for the next call to chef

					perfect += filter( unmatched ) + replacement; // use perfect for all the replacing
					return replacement;
				} 
				else {
					j+= step.length;
				}
			}
		} // function chef( matched )

		var replaceSpace = ChiliBook.replaceSpace;
		var steps = new Array;
		for (var stepName in recipe.steps) {
			prepareStep( stepName, recipe.steps[ stepName ] );
		}

		var perfect = ""; //replace doesn't provide a handle to the ongoing partially replaced string
		var lastIndex = 0; //regexp.lastIndex is available after a string.match, but not in a string.replace
		ingredients.replace( knowHow(), chef );
		var lastUnmatched = ingredients.substring( lastIndex, ingredients.length );
		perfect += filter( lastUnmatched );

		return perfect;

	} // function cook( ingredients, recipe )

	function checkCSS( recipe, stylesheetPath ) {
		var id = recipe.cssId;

		if( !( id && $( '#' + id ).length > 0 ) ) {
			recipe.cssId = "css_" + (new Date()).valueOf();
			var link = '<link rel="stylesheet" type="text/css"'
					+   ' id="' + recipe.cssId   + '"'
					+ ' href="' + stylesheetPath + '">'
			;
			if ($.browser.msie) {
				var domLink = document.createElement( link );
				var $domLink = $(domLink);
				$("head").append( $domLink );
			}
			else {
				$("head").append( link );
			}
		}
	} // function checkCSS( recipeName )

	function makeDish( el, recipe ) {
//		var ingredients = $(el).text();
		var ingredients = el.childNodes[0].data;

		// hack for IE: IE uses \r in lieu of \n
		ingredients = ingredients.replace(/\r\n?/g, "\n");

		var dish = cook( ingredients, recipe ); // all happens here
	
		if( ChiliBook.replaceTab ) {
			dish = dish.replace( /\t/g, ChiliBook.replaceTab );
		}
		if( ChiliBook.replaceNewLine ) {
			dish = dish.replace( /\n/g, ChiliBook.replaceNewLine );
		}

		$(el).html( dish );
	} // function makeDish( el )

	function getPath( recipeName, options ) {
		var settingsDef = {
			  recipeFolder:     ChiliBook.recipeFolder
			, recipeFile:       recipeName + ".js"
			, stylesheetFolder: ChiliBook.stylesheetFolder
			, stylesheetFile:   recipeName + ".css"
		};
		var settings;
		if( options && typeof options == "object" )
			settings = $.extend( settingsDef, options );
		else
			settings = settingsDef;
		return {
			  recipe    : settings.recipeFolder     + settings.recipeFile
			, stylesheet: settings.stylesheetFolder + settings.stylesheetFile
		};
	} //function getPath( recipeName, options )


//-----------------------------------------------------------------------------
// initializations
	if( $.metaobjects ) $.metaobjects({ selector: "object.chili" });
	var selectClass = new RegExp( "\\b" + ChiliBook.elementClass + "\\b", "gi" );

//-----------------------------------------------------------------------------
// the coloring starts here
	$( ChiliBook.elementPath ).each( function() {
		var el = this;
		var elClass = $(el).attr( "class" );
		if( !elClass ) return;
		var recipeName = $.trim( elClass.replace( selectClass, "" ) );
		if( '' != recipeName ) {
			var path = getPath( recipeName, el.chili );
			var recipe = ChiliBook.recipes[ path.recipe ];
			if( !recipe ) {
				try {
// FIXME version 2.0 (I hope)
// currently in a dynamic setup, if there is not enough delay between an access to the 
// repository and the previous download request, then the same recipe is downloaded twice
// 
//					ChiliBook.recipes[ recipePath ] = {}; //placeholder
// 
// I tried to use the the above line as a fix, but it does not work as expected: a recipe is 
// downloaded once but the elements coreesponding to subsequent requests don't get highlighted 
// because makeDish is called with an empty object, instead of waiting
					$.getJSON( path.recipe, function( recipeLoaded ) {
						ChiliBook.recipes[ path.recipe ] = recipeLoaded;
						if( ChiliBook.stylesheetLoading ) {
							checkCSS( recipeLoaded, path.stylesheet );
						}
						makeDish( el, recipeLoaded );
					} );
				}
				catch (recipeNotAvailable) {
					alert( "recipe unavailable for: " + recipeName + '@' + recipePath );
				}
			}
			else {
				makeDish( el, recipe );
			}
		}
	} );
//-----------------------------------------------------------------------------

} );
} ) ( jQuery );

ChiliBook.recipes[ "javascript.js" ] = 
{
	steps: {
		  mlcom   : { exp: /\/\*[^*]*\*+(?:[^\/][^*]*\*+)*\// }
		, com     : { exp: /\/\/.*/ }
		, regexp  : { exp: /\/[^\/\\\n]*(?:\\.[^\/\\\n]*)*\/[gim]*/ }
		, string  : { exp: /(?:\'[^\'\\\n]*(?:\\.[^\'\\\n]*)*\')|(?:\"[^\"\\\n]*(?:\\.[^\"\\\n]*)*\")/ }
		, numbers : { exp: /\b[+-]?(?:\d*\.?\d+|\d+\.?\d*)(?:[eE][+-]?\d+)?\b/ }
		, keywords: { exp: /\b(arguments|break|case|catch|continue|default|delete|do|else|false|for|function|if|in|instanceof|new|null|return|switch|this|true|try|typeof|var|void|while|with)\b/ }
		, jquery  : { exp: /(\$|jQuery)/ }
		, global  : { exp: /\b(toString|valueOf|window|element|prototype|constructor|document|escape|unescape|parseInt|parseFloat|setTimeout|clearTimeout|setInterval|clearInterval|NaN|isNaN|Infinity)\b/ }
	}
};

ChiliBook.recipes[ "html.js" ] = 
{
	steps: {		
		  mlcom : { exp: /\<!--(?:.|\n)*?--\>/ }
		, tag   : { exp: /(?:\<\w+)|(?:\>)|(?:\<\/\w+\>)|(?:\/\>)/ }
		, aname : { exp: /\s+\w+(?=\s*=)/ }
        , avalue: { exp: /([\"\'])(?:(?:[^\1\\\r\n]*?(?:\1\1|\\.))*[^\1\\\r\n]*?)\1/ }
		, entity: { exp: /&[\w#]+?;/ }
	}
}; 