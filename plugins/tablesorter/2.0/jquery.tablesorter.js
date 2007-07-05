(function($) {

	$.extend({
		tablesorter: new function() {
			
			var config = {
				
				findAllRowsExp: '/tbody:first/tr',
				findAllCellsExp: 'td',
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
			}
			
			/* sorting methods */
			
			function multisort(sortList,cache) {
				
				if(config.debug) { var sortTime = new Date(); }
				var sortWrapper = '';
				var dynamicExp = "sortWrapper = function(a,b) {";
					
					for(var i=0; i < sortList.length; i++) {
						
						var s = (getCachedSortType(i) == 'text') ? 'sortText' : 'sortNumeric';

						var c = 'exp' + i;
						dynamicExp += 'var ' + c + ' = ' + s + '(a[' + sortList[i] + '],b[' + sortList[i] + ']);';
						dynamicExp += 'if(' + c + ') { return ' + c + ' }';
						dynamicExp += ' else {';
						
						
					}
						
					for(var i=0; i < sortList.length; i++) {
						dynamicExp += '}';
					}
				dynamicExp += 'return 0'	
				dynamicExp += '};'	
				
				eval(dynamicExp);
				cache.normalized.sort(sortWrapper);
				
				if(config.debug) { benchmark('Sorting on ' + sortList.length + ' columns:', sortTime); }
				
				return cache;
			}
			
			function sortText(a,b) {
				return ((a < b) ? -1 : ((a > b) ? 1 : 0));
	 		}
			
	 		function sortNumeric(a,b) {
				return a-b;
			}
			
			function getCachedSortType(c) {
				return 'text';
			}
			
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
			}
			
			/* public methods */
		
			this.construct = function(settings) {
				
				return this.each(function() {
					
					// build the cache for the tbody cells
					var cache = buildCache(this);
					
					
					// apply easy methods that trigger binded events
					$(this).bind('update',function() {

						cache = buildCache(this);
					
					}).bind('sorton',function(e,sortList) {
						
						
						appendToTable(this,multisort(sortList,cache));
						
					});
					
				});
			};
			
			this.update = function() {
				return this.each(function() {
					$(this).trigger('update');
				});
			};
			
			this.sorton = function(sortList) {
				return this.each(function() {
					$(this).trigger('sorton',[sortList]);
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