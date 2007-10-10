jQuery(document).ready(function() {
		if (location.protocol == "file:") {
			jQuery("br:eq(1)").after('<div id="notice">Warning: this demo (e.g. the Flash Upload part) CAN NOT run on a local file system.<br />You will need to run this from a hosted environment (apache or any other webserver)</div>');
		}
});