(function($) {

	$.extend({
		tablesorterPager: new function() {
			
			function appendPager(table) {
				var p = $("<div>").addClass("tablesorterPager").append(
							$("<form>").append(	
									$("<input type=button value='<'>").addClass("prev")
								)
								.append(
									$("<input type=text value=1' >").addClass("page")
								).append(
									$("<span>").addClass("seperator").html("/")
								).append(
									$("<input type=text value=1 readonly=readonly>").addClass("pages")
								).append(
									$("<input type=button value='>' >").addClass("next")
								)
							);	
						
				$(table).after(p);
				return p;
			}
			
			function updatePageTotals(config) {
				
				var s = $("input.pages",config.pagerContainer).val(config.pages);
				
			}
			
			function updatePage(config) {
				
				var s = $("input.page",config.pagerContainer).val((config.page+1));	
			}
			
			function moveToPage(table) {
				var c = table.config;
				if(c.page < 0 || c.page > (c.pages-1)) {
					c.page = 0;
				}
				updatePage(c);
				renderTable(table,c.rowsCopy);
			}
			
			function renderTable(table,rows) {
				
				var c = table.config;
				var s = c.page * c.size;
				var e = (s + c.size);
				if(e > rows.length ) {
					e = rows.length;
				}
				$('tbody:first',table).html(rows.slice(s,e).join(""));
			}
			
			
			this.construct = function(settings) {
				
			
				
				return this.each(function() {	
					var pager = appendPager(this), table = this;
					
					config = $.extend(this.config, $.tablesorterPager.defaults, settings);
					config.pagerContainer = pager; 
					
					$(this).trigger("appendCache");
					
					$("input.next",pager).click(function() {
						var c = table.config;
						c.page++;
						if(c.page >= (c.pages-1)) {
							c.page = (c.pages-1);
						}
						moveToPage(table);
					});
					$("input.prev",pager).click(function() {
						var c = table.config;
						c.page--;
						if(c.page <= 0) {
							c.page = 0;
						}
						moveToPage(table);
					});
					$("input.page",pager).change(function() {
						var c = table.config;
						c.page = (parseInt($(this).val())-1);
						moveToPage(table);
					});
				});
			};
			
			this.appender = function(table,rows) {
				
				var config = table.config;
				
				config.rowsCopy = rows;
				
				config.pages = Math.ceil(rows.length / config.size);
				
				updatePageTotals(config);
				
				renderTable(table,rows);
			};
			this.defaults = {
				size: 10,
				offset: 0,
				page: 0,
				pages: 0,
				appender: this.appender
			};
			
		}
	});
	// extend plugin scope
	$.fn.extend({
        tablesorterPager: $.tablesorterPager.construct
	});
	
})(jQuery);				