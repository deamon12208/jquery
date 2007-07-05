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
					initialOrder: 'asc'
				},
				xpath: {
					findAllHeaders: '/thead:first/tr/th'
				},
				debug: true
				
			};
			
			/* debuging utils */
			function benchmark(label,stamp) {
				if (typeof console != "undefined" && typeof console.debug != "undefined") {
					console.log(label,(new Date().getTime() - stamp.getTime()) + 'ms');
				} else {
					alert(label + ',' + (new Date().getTime() - stamp.getTime()) + 'ms');
				}
			}
						
			/* utils */
			function buildCache(table) {
				
				if(config.debug) { var cacheTime = new Date(); }
				
				var totalRows = (table.tBodies[0] && table.tBodies[0].rows.length) || 0;
				var cache = {row: [], normalized: []};
			
				for (var i=0;i < totalRows; i++) {
					/** Add the table data to main data array */
					var cur = table.tBodies[0].rows[i];
					var totalCells = cur.cells.length;
					var cols = [];
					cache.row.push(cur);
					for(var j=0; j < totalCells; j++) {
						cols.push(getElementText(cur.cells[j]));
					}
					// add position for rowCache
					cols.push(i);
					cache.normalized.push(cols);
				}
				
				if(config.debug) { benchmark('Building cache for ' + totalRows + ' rows:', cacheTime); }
				
				return cache;
			};
			
			function getElementText(node) {
				return node.innerHTML;
			};
			
			function appendToTable(table,cache) {
				
				if(config.debug) {var appendTime = new Date()}
				
				var totalRows = cache.normalized.length;
				var checkCell = (cache.normalized[0].length-1);
				var tableBody = $('tbody:first',table).empty();
				
				for (var i=0;i < totalRows; i++) {
					
					var rowPos = cache.normalized[i][checkCell];
				
					tableBody.append($(cache.row[rowPos]));
					
					
				}	
				
				if(config.debug) { benchmark('Rebuilt table:', appendTime); }
			};
			
			function buildHeaders(table) {
				
				if(config.debug) { var time = new Date(); }
				
				var headers = $(config.xpath.findAllHeaders,table).each(function(i) {
					
					
					this.column = i;
					this.order = formatSortingOrder(config.sorting.initialOrder);
					
					
					
				}).addClass(config.css.header); 
				
				
				if(config.debug) { benchmark('Built headers:', time); }
				
				return headers;
				
			};
			
			function formatSortingOrder(val) {
				
				if(typeof val != "Number") {
					i = (val.toLowerCase() == "desc") ? 1 : 0;
				} else {
					i = (val == (0 || 1)) ? val : 0;
				}
				return i;
			}
			
			function isValueInArray(val, arr) {
				for(var i=0; i < arr.length; i++) {
					if(arr[i] == val) {
						return true;	
					}
				}
				return false;
			}
			
			function getConfig(settings) {
				return $.extend(config, settings);
				
			};
			
			function resetHeadersCss(list,o,c) {
				for(var i=0; i < list.length; i++) {
					$('th:eq(' + list[i] + ')', o.parent()).removeClass(c[0]).removeClass(c[1]);
				}
			}
			
			/* sorting methods */
			function multisort(sortList,order,cache) {
				
				if(config.debug) { var sortTime = new Date(); }
				
				var sortWrapper;
				var dynamicExp = "sortWrapper = function(a,b) {";
					
				for(var i=0; i < sortList.length; i++) {
					var s = (getCachedSortType(i) == 'text') ? ((order == 0) ? 'sortText' : 'sortTextDesc') : ((order == 0) ? 'sortNumeric' : 'sortNumericDesc');
					var c = sortList[i];
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
				
				if(config.debug) { benchmark('Sorting on ' + sortList.length + ' columns and dir ' + order+ ' time:', sortTime); }
				
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
			
			function getCachedSortType(c) {
				return 'text';
			};
			
			
			/* public methods */
		
			this.construct = function(settings) {
				
				return this.each(function() {
					
					// 
					var $this, $document,$headers, cache, config, shiftDown, sortOrder, sortList = [];
					
					config = getConfig(settings);
										
					$this = $(this);
					
					$document = $(document);
					
					//
					shiftDown = 0;
					
					// build the cache for the tbody cells
					cache = buildCache(this);
					
					// build headers
					$headers = buildHeaders(this);
					
					// apply event handling to headers
					$headers.click(function(e) {
						
						var i = this.column;
						var d = this.order % 2;
						var css = [config.css.orderAsc,config.css.orderDesc];
						var $cell = $(this);
						if(!shiftDown) {
							
							resetHeadersCss(sortList,$cell, css); 
							
							sortList = [];
							
							sortList.push(i);
							
						} else {
							// value exists
							if(isValueInArray(i,sortList)) {
								sortOrder++; 	
								
								// apply css class for all selected elements
								
								
								
								
							} else {
								
								sortList.push(i);
							}
							
							d = sortOrder % 2;
							
							
							
							if(sortList.length > 1) {
								for(var i=0; i < sortList.length; i++) {
										$('th:eq(' + sortList[i] + ')', $cell.parent()).addClass(css[d]).removeClass(css[(d == 0) ? 1 : 0]);	
										
								};
							};
							
						
						}
						
						if(sortList.length == 1) {
							sortOrder = this.order;
							$cell.addClass(css[d]).removeClass(css[(d == 0) ? 1 : 0]);
							
						}
						
						
						
						
						
						
								
						$this.sorton(sortList,d);
						
						// update order (desc or asc)
						this.order++;
						
						
					});
					
					$document.keydown(function(e) {
						shiftDown = 1;
						
					}).keyup(function(e) {
						shiftDown = 0;
					});
					
					
					// apply easy methods that trigger binded events
					$this.bind('update',function() {

						cache = buildCache(this);
					
					}).bind('sorton',function(e,sortList,direction) {
						
						
						appendToTable(this,multisort(sortList,direction,cache));
						
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
					$(this).trigger('sorton',[sortList,direction]);
				});
			};
		}
	});	
		
	
	$.fn.extend({
        tablesorter: $.tablesorter.construct,
		update: $.tablesorter.update,
		sorton: $.tablesorter.sorton
	});
					
})(jQuery);	