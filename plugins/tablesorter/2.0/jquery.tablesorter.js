(function($) {

	$.extend({
		tablesorter: new function() {
			
			var config = {
				css: {
					header: 'header',
					orderAsc: 'headerSortUp',
					orderDesc: 'headerSortDown'
				},	
				sorting: {
					initialOrder: 'asc',
					multisortKey: 'shiftKey'
				},
				xpath: {
					findAllHeaders: '/thead:first/tr/th'
				},
				parsers: {
				
				},
				debug: true
				
				
			};
			
			var parsers = [];
			
			/* debuging utils */
			function benchmark(label,stamp) {
				if (typeof console != "undefined" && typeof console.debug != "undefined") {
					console.log(label,(new Date().getTime() - stamp.getTime()) + 'ms');
				} else {
					//alert(label + ',' + (new Date().getTime() - stamp.getTime()) + 'ms');
				}
			}
						
			/* parsers utils */
			
			function buildParserCache(table) {
				
				var list = [];
				var cells = table.tBodies[0].rows[0].cells;
				
				for (var i=0;i < cells.length; i++) {
					list.push(detectParserForColumn(cells[i]));
				}
				return list;
			};
			
			function detectParserForColumn(node) {
				
				for(var i=1; i < parsers.length; i++) {
					if(parsers[i].is(getElementText(node))) {
						return parsers[i];
					}
				}
				
				// 0 is always the generic parser (text)
				return parsers[0];
			}
			
			
			/* utils */
			function buildCache(table) {
				
				if(table.config.debug) { var cacheTime = new Date(); }
				
				var totalRows = (table.tBodies[0] && table.tBodies[0].rows.length) || 0;
				var cache = {row: [], normalized: []};
			
			
			
			
  					
					for (var i=0;i < totalRows; i++) {
					
						/** Add the table data to main data array */
						var cur = table.tBodies[0].rows[i];
						var totalCells = cur.cells.length;
						var cols = [];
						cache.row.push(cur);
						var j = 0;
						for(var j=0; j < totalCells; j++) {
						
							cols.push(table.config.parsers[j].format(getElementText(cur.cells[j])));
							j++;
						}
						
						// add position for rowCache
						cols.push(i);
						cache.normalized.push(cols);
					};
				
				if(table.config.debug) { benchmark('Building cache for ' + totalRows + ' rows:', cacheTime); }
				
				return cache;
			};
			
			function getElementText(node) {
				return node.innerHTML;
			};
			
			function appendToTable(table,cache) {
				
				if(table.config.debug) {var appendTime = new Date()}
				
				var totalRows = cache.normalized.length;
				var checkCell = (cache.normalized[0].length-1);
				var tableBody = $('tbody:first',table).empty();
				
	
				for (var i=0;i < totalRows; i++) {
					
					var rowPos = cache.normalized[i][checkCell];
				
					tableBody.append($(cache.row[rowPos]));
					
					
				}	
				
				if(table.config.debug) { benchmark('Rebuilt table:', appendTime); }
			};
			
			function buildHeaders(table) {
				
				if(table.config.debug) { var time = new Date(); }
				
				var order = formatSortingOrder(table.config.sorting.initialOrder);
				
				var $headers = $(table.config.xpath.findAllHeaders,table).each(function(i) {
					this.column = i;
					this.order = order;
				}).addClass(table.config.css.header); 
				
				
				if(table.config.debug) { benchmark('Built headers:', time); }
				
				return $headers;
				
			};
			
			function formatSortingOrder(v) {
				
				if(typeof v != "Number") {
					i = (v.toLowerCase() == "desc") ? 1 : 0;
				} else {
					i = (v == (0 || 1)) ? v : 0;
				}
				return i;
			}
			
			function isValueInArray(v, a) {
				for(var i=0; i < a.length; i++) {
					if(a[i][0] == v) {
						return true;	
					}
				}
				return false;
			}
			
			function mergeConfig(settings) {
				return $.extend(config, settings);
				
			};
			
			function resetHeadersCss(list,o,c) {
				for(var i=0; i < list.length; i++) {
					$('th:eq(' + list[i][0] + ')', o.parent()).removeClass(c[0]).removeClass(c[1]);
				}
			}
			
			/* sorting methods */
			function multisort(table,sortList,cache) {
				
				if(table.config.debug) { var sortTime = new Date(); }
				
				var sortWrapper;
				
				var dynamicExp = "sortWrapper = function(a,b) {";
				
					
				for(var i=0; i < sortList.length; i++) {
					
					var c = sortList[i][0];
					var order = sortList[i][1];
					var s = (getCachedSortType(table.config.parsers,c) == 'text') ? ((order == 0) ? 'sortText' : 'sortTextDesc') : ((order == 0) ? 'sortNumeric' : 'sortNumericDesc');
					
					
					
					var e = 'e' + i;
					
					dynamicExp += 'var ' + e + ' = ' + s + '(a[' + c + '],b[' + c + ']);';
					dynamicExp += 'if(' + e + ') { return ' + e + ' }';
					dynamicExp += ' else {';
				}
					
				for(var i=0; i < sortList.length; i++) {
					dynamicExp += '}';
				}
				
				dynamicExp += 'return 0'	
				dynamicExp += '};'	
				
				eval(dynamicExp);
				
				cache.normalized.sort(sortWrapper);
				
				if(table.config.debug) { benchmark('Sorting on ' + sortList.length + ' columns and dir ' + order+ ' time:', sortTime); }
				
				return cache;
			};
			
			function sortText(a,b) {
				return ((a < b) ? -1 : ((a > b) ? 1 : 0));
			};
			
			function sortTextDesc(a,b) {
				return ((b < a) ? -1 : ((b > a) ? 1 : 0))
			};	
			
	 		function sortNumeric(a,b) {
				return a-b;
			};
			
			function sortNumericDesc(a,b) {
				return b-a;
			};
			
			function getCachedSortType(parsers,i) {
				return parsers[i].type;
			};
				
			/* events */
			
			
			
			/* public methods */
		
			this.construct = function(settings) {
				
				// override default settings
				var config = mergeConfig(settings);
				
				return this.each(function() {
					
					// 
					var $this, $document,$headers, cache, shiftDown = 0, sortOrder, sortList = [];
					
					// add settings to table object, expandos...
					this.config = config;
					
					// try to auto detect column type, and store in tables config
					this.config.parsers = buildParserCache(this);
					
					// store common expression for speed					
					$this = $(this);
					$document = $(document);
					
					// build the cache for the tbody cells
					cache = buildCache(this);
					
					
					// build headers
					$headers = buildHeaders(this);
					
					// apply event handling to headers
					// this is to big, perhaps break it out?
					$headers.click(function(e) {
						// store exp, for speed
						var $cell = $(this);
						
						// get current column index
						var i = this.column;
						
						// get current column sort order
						var d = this.order % 2;
						
						// get the css class names, could be done else where.
						var c = [config.css.orderAsc,config.css.orderDesc];
						
						// user only whants to sort on one column
						if(!shiftDown) {
							
							// reset all headers in case we want to reset from a multi column sort
							resetHeadersCss(sortList,$cell, c); 
							
							// flush the sort list
							sortList = [];
							
							// add column to sort list
							sortList.push([i,d]);
							
						// multi column sorting	
						} else {
							// the user has clicked on an all ready sortet column.
							if(isValueInArray(i,sortList)) {	 
								
								// revers the sorting direction for all tables.
								for(var j=0; j < sortList.length; j++) {
									if(sortList[j][0] == i) {
										sortList[j][1] = d;
									}				
								}	
							} else {
								// add column to sort list array
								sortList.push([i,d]);
							}
							// only class name if there are more then one columns to sort.
							if(sortList.length > 1) {
								// get current sort order
								//d = sortOrder % 2;
								// loop the sort column list
								for(var i=0; i < sortList.length; i++) {
										// remove and add new css classes
										//$('th:eq(' + sortList[i][0] + ')', $cell.parent()).removeClass(c[0]).removeClass(c[1]).addClass(c[d]);	
								};
							};
						};
						// only store order if the user has clicked on one column
						if(sortList.length == 1) {
							// store order for later use
							
							
						}
						// add and remove css class names for the headers
						$cell.removeClass(c[0]).removeClass(c[1]).addClass(c[d]);
						// call the sorting method		
						$this.sorton(sortList);
						
						// update order (desc or asc)
						this.order++;
						
						// stop normal event by returning false
						return false;
						
					});
					
					$document.keydown(function(e) {
						// enable multi sorting if key matches config 
						shiftDown = e[config.sorting.multisortKey];
					}).keyup(function(e) {
						// disable multi sorting
						shiftDown = 0;
					});
					
					// apply easy methods that trigger binded events
					$this.bind('update',function() {
						// rebuild the cache map
						cache = buildCache(this);
					}).bind('sorton',function(e,sortList) {
						// sort the table and append it to the dom
						appendToTable(this,multisort(this,sortList,cache));
					});
				});
			};
			
			this.update = function() {
				return this.each(function() {
					$(this).trigger('update');
				});
			};
			
			this.sorton = function(sortList,direction) {
				return this.each(function() {
					$(this).trigger('sorton',[sortList]);
				});
			};
			
			this.addParser = function(parser) {
				parsers.push(parser);
			};
			
			this.formatFloat = function(s) {
				var i = parseFloat(s);
				return (isNaN(i)) ? 0 : i;
			};
			this.formatInt = function(s) {
				var i = parseInt(s);
				return (isNaN(i)) ? 0 : i;
			};
			
		}
	});
		
	// extend plugin scope
	$.fn.extend({
        tablesorter: $.tablesorter.construct,
		update: $.tablesorter.update,
		sorton: $.tablesorter.sorton
	});
	
	// add parsers
	$.tablesorter.addParser({
		id: 'generic',
		is: function(s) {
			return true;
		},
		format: function(s) {
			return $.trim(s.toLowerCase());
		},
		type: 'text'
	});
	
	$.tablesorter.addParser({
		id: 'integer',
		is: function(s) {
			return s.match(new RegExp(/^\d+$/));
		},
		format: function(s) {
			return $.tablesorter.formatInt(s);
		},
		type: 'numeric'
	})
					
})(jQuery);	