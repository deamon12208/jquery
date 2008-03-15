<style>

.draggable {
	width: 100px;
	height: 40px;
	top: 10px;
	right: 10px;
	background-color: #68BFEF;
	border: 2px solid #0090DF;
	padding: 5px;	
}

</style>

<div id="containerDemo"></div>

<script type="text/javascript">
	
	var model = {
		
		renderAt: '#containerDemo',
		
		title: 'Draggable Demos',
		
		demos: [
			
			{
				title: 'Simple div drag',
				html: '<div id="divDrag" class="draggable">I am a div!</div><br>',
				destroy: '$("#divDrag").draggable("destroy");',
				
				options: [ 
					{	desc: 'Simple Drag',	source: '$("#divDrag").draggable();' },
					{	desc: 'Simple Drag on axis x',	source: '$("#divDrag").draggable({axis:"x"});' }
				]
			},
			
			{
				title: 'Simple image drag',
				html: '<img id="dragImage" src="img/puppy.jpg" style="width: 228px; height:157px;">',
				destroy: '$("#dragImage").draggable("destroy");',
				
				options: [ 
					{	desc: 'Simple Drag',	source: '$("#dragImage").draggable();' },
					{	desc: 'Simple Drag on axis x',	source: '$("#dragImage").draggable({axis:"x"});' }
				]
			}
			
		]
		
	};
	
	$(function(){
	
		uiRenderDemo(model);
		
	});
	
</script>