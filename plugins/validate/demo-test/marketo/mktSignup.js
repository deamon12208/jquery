 $(document).ready(function(){
 	
	jQuery.validator.messages.required = " ";
	$("form").validate({
		focusInvalid: false,
		focusCleanup: true,
		onkeyup: false,
		errorContainer: $("div.error"),
		subformRequired: function(input) {
			return $("#bill_to_co").is(":checked") && input.parents(".subTable").length;
		},
		invalidHandler: function() {
			var errors = this.numberOfInvalids();
			var message = errors < 2
				? 'You missed 1 field. It has been highlighted below'
				: 'You missed ' + errors + ' fields.  They have been highlighted below';
			$("div.error span").html(message);
		},
		submitHandler: function() {
			alert("submit! use link below to go to the other step");
		}
	});

  $(".resize").vjustify();
  $("div.buttonSubmit").hoverClass("buttonSubmitHover");

  // tooltip
  $("img.tooltip").hoverIntent(
    function() {
      $(this).next().slideDown();
    },
    function(){
      $(this).next().slideUp();
    }
  );

  if ($.browser.safari) {
    $("body").addClass("safari");
  }

  //form validation
  $("form input").focus(function() {
      $(this).parents("tr").removeClass("errorRow");
  }).keypress(function() {
      $(this).parents("tr").removeClass("errorRow")
  });
  
  $("input.phone").maskedinput("(999) 999-9999");
  $("input.zipcode").maskedinput("99999");
  var creditcard = $("#creditcard").maskedinput("9999 9999 9999 9999");

  $("#cc_type").change(
    function() {
      switch ($(this).val()){
        case 'amex':
          creditcard.maskedinput("9999 999999 99999");
          break;
        default:
          creditcard.maskedinput("9999 9999 9999 9999");
          break;
      }
    }
  );

  $("form select").change(function() {
      $(this).parents("tr:first").removeClass("errorRow");
  });

  $("input.ccNumber").blur(function() {
      hiddenStrValue = $(this).val().replace(new RegExp("[^0-9]{1,}", "gi"), "");
      $(this).siblings("input.hidden").val(hiddenStrValue);
  });

  var subTableDiv = $("div.subTableDiv");
  var toggleCheck = $("input.toggleCheck");
  toggleCheck.is(":checked")
  	? subTableDiv.hide()
	: subTableDiv.show();
  $("input.toggleCheck").click(function() {
      if (this.checked == true) {
        subTableDiv.slideUp("medium");
      } else {
        subTableDiv.slideDown("medium");
      }
  });


});

$.fn.vjustify = function() {
    var maxHeight=0;
    $(".resize").css("height","auto");
    this.each(function(){
        if (this.offsetHeight > maxHeight) {
          maxHeight = this.offsetHeight;
        }
    });
    this.each(function(){
        $(this).height(maxHeight);
        if (this.offsetHeight > maxHeight) {
            $(this).height((maxHeight-(this.offsetHeight-maxHeight)));
        }
    });
};

$.fn.hoverClass = function(classname) {
	return this.hover(function() {
		$(this).addClass(classname);
	}, function() {
		$(this).removeClass(classname);
	});
};