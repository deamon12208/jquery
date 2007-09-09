$(function(){
	$("#refreshimg").click(function(){
		$.post('newsession.php');
		$("#captchaimage").load('image_req.php');
		return false;
	});
	$("#captchaform").submit(function(){
		$.get("process.php", {
			captcha: $("#captcha").val()
		}, function(valid) {
			if(valid) {
				$("#captcha").css({
					border: '1px solid #49c24f',
					background: '#bcffbf'
				});
			} else {
				$("#captcha").css({
					border: '1px solid #c24949',
					background: '#ffbcbc'
				});
			}
		});
		return false;
	});
});
