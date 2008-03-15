<div id="containerDemo"></div>

<script type="text/javascript">
	
	var model = {
		
		renderAt: '#containerDemo',
		
		title: 'Resizable Demos',
		
		demos: [
			
			{
				title: 'Image Resizing',
				html: '<img id="resizebleImage" src="img/puppy.jpg">',
				destroy: '$("#resizebleImage").resizable("destroy");',
				
				options: [ 
					{	desc: 'Transparent Axis',	source: '$("#resizebleImage").resizable({ transparent:true });' },
					{	desc: 'Transparent Axis, minWidth',	source: '$("#resizebleImage").resizable({ transparent:true, minWidth: 100 });' },
					{	desc: 'Transparent Axis 3',	source: '$("#resizebleImage").resizable({ transparent:true });' }
				]
			},
			
			{
				title: 'Textarea Resizing',
				html: '<textarea id="resizebleTextarea">I am a textarea!</textarea>',
				destroy: '$("#resizebleTextarea").resizable("destroy");',
				options: [ 
					{	desc: 'Simple Resizing',	source: '$("#resizebleTextarea").resizable();' },
					{	desc: 'Transparent Axis 2',	source: '$("#resizebleTextarea").resizable({ transparent:true });' },
					{	desc: 'Transparent Axis 3',	source: '$("#resizebleTextarea").resizable({ transparent:true });' }
				]
			}
			
		]
		
	};
	
	$(window).load(function(){
	
		uiRenderDemo(model);
		
	});
	
</script>