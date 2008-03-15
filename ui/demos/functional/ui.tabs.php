<style>

#divTabs {
	height:30px;
}

</style>

<div id="containerDemo"></div>

<script type="text/javascript">

	var model = {

		renderAt: '#containerDemo',

		title: 'Tabs Demos',

		demos: [

			{
				title: 'Simple Tabs',
				html: ['<div><ul id="divTabs" class="flora">',
							'<li><a href="#fragment-1"><span>One</span></a></li>',
                			'<li><a href="#fragment-2"><span>Two</span></a></li>',
                			'<li><a href="#fragment-3"><span>Three</span></a></li>',
            			'</ul>',
            			'<div id="fragment-1">',
                			'<p>First tab is active by default:</p>',
                			'<pre><code>$("#example > ul").tabs();</code></pre>',
						'</div>',
            			'<div id="fragment-2">',
                			'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                			'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
            			'</div>',
            			'<div id="fragment-3">',
                			'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                			'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                			'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
            			'</div></div>'].join(''),
				destroy: '$("#divTabs").tabs("destroy");',

				options: [
					{	desc: 'Simple Dialog',	source: '$("#divTabs").tabs();' },
					{	desc: 'Simple Cloned Dialog',	source: '$("#divTabs").clone().tabs();' },
                    {	desc: 'Simple Empty Dialog',	source: '$("#divTabs").tabs();' },
                    {	desc: 'Simple Detached Dialog',	source: '$("<div/>").tabs();' }
				]
			}
/*
			{
				title: 'Simple image drag',
				html: '<img id="dragImage" src="img/puppy.jpg" style="width: 228px; height:157px;">',
				destroy: '$("#dragImage").draggable("destroy");',

				options: [
					{	desc: 'Simple Drag',	source: '$("#dragImage").draggable();' },
					{	desc: 'Simple Drag on axis x',	source: '$("#dragImage").draggable({axis:"x"});' }
				]
			}
*/
		]

	};

	$(window).load(function(){

		uiRenderDemo(model);

	});

</script>
