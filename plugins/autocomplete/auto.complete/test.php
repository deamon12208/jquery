<link rel="stylesheet" type="text/css" href="auto.complete.css" />
<script type="text/javascript" src="jquery.js"></script>
<script type="text/javascript" src="auto.complete.js"></script>

<script>

function selectItem(li) { 

}

function formatItem(row) { 
	return row; 
}

$(document).ready(function() {
	$("#suggest").autocomplete('search.php', { minChars:1, matchSubset:1, matchContains:1, cacheLength:10, onItemSelect:selectItem, formatItem:formatItem, selectOnly:1, mode:"multiple",multipleSeparator:"|" });
	$("#suggestsingle").autocomplete('search.php', { minChars:1, matchSubset:1, matchContains:1, cacheLength:10, onItemSelect:selectItem, formatItem:formatItem, selectOnly:1 });
});
</script>

Multiple: <br>
<textarea id='suggest' cols='40' rows='5'></textarea>
<br><br>
Single: <br>
<textarea id='suggestsingle' cols='40' rows='1'></textarea>

