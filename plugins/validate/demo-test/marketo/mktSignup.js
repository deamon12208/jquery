 $(document).ready(function(){

  $(".resize").vjustify();
  $("div.buttonSubmit").hoverClass("buttonSubmitHover");

  // tooltip
  $(".tooltip").hoverIntent(
    function() {
      $(this).siblings("div.tooltip").show("medium");
    },
    function(){
      $(this).siblings("div.tooltip").hide("medium");
    }
  );
  $(".tooltip").click(
    function() {
      $(this).siblings("div.tooltip").show();
      $(this).unbind('mouseover');
      $(this).unbind('mouseout');
    }
  );

  if ($.browser.safari == true) {
    $("body").addClass("safari");
  }

  //form validation
  $("form input").focus(
    function() {
      $(this).parents("tr").removeClass("errorRow");
    }
  );

  $("form input").keypress(
    function() {
      $(this).parents("tr").removeClass("errorRow")
    }
  );

  //email validation
  $("input[@uitype=email]").blur(
    function() {
      var x = this.value;
      var err = '';
      var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

      if (x.length > 0) {
        if (filter.test(x)) { //passed
          // Ajax call to check for duplicate user name.
          var dup = false;

          if (dup) {
            // !!!BAC: Make link to forgot password page.
            err = "Sorry, that email is already registered.<br />If you forgot your password, click here.";
          }
        }
        else { // failed
          err = "Invalid format.  Example: you@yourdomain.com";
        }
      }

      if (err.length > 0) {
        $(this).val("");
        $(this).siblings("div.formError").empty().html(err).css("display","");

        // Need to focus via setTimeout after blur returns
        var self = $(this);
        setTimeout(function(){ self.parents("tr:first").addClass("errorRow"); }, 100);
        setTimeout(function(){ self.focus() }, 0);
      }
      else {
        $(this).parents("tr").removeClass("errorRow");
      }
    }
  );

  //password validation
  $("input[@type=password]").blur(
    function() {
      var x = this.value;
      var err = '';

      // Optional attribute which specifies other password field which must
      // match this one.
      var matchPassword = $(this).attr("match_password");

      if (x.length > 0) {
        if (x.length < 6) {
          err = "Password must be at least 6 characters";
        }
        else if (!/\D/.test(x)) {
          err = "Password must contain at least 1 letter.";
        }
        else if (!/\d/.test(x)) {
          err = "Password must contain at least 1 number.";
        }
        else if (matchPassword != null && matchPassword.length > 0) {
          var otherPw = $('#'+matchPassword).val();

          if (otherPw.length > 0 && otherPw != x) {
            err = "Passwords do not match; please retype.";
          }
        }
      }

      if (err.length > 0) {
        $(this).val("");
        $(this).siblings("div.formError").empty().html(err);

        // Need to focus via setTimeout after blur returns
        var self = $(this);
        setTimeout(function(){ self.parents("tr:first").addClass("errorRow"); }, 100);
        setTimeout(function(){ self.focus() }, 0);
      }
      else {
        $(this).parents("tr:first").removeClass("errorRow");
      }
    }
  );

  // check for required Fields
  $("form .formButton").click(
    function() {

      $("tr.errorRow").removeClass("errorRow");

      var inputArrayEmpty = $("tr.required input[@value='']");
      inputArrayEmpty = inputArrayEmpty.not($("div.subTableDiv:hidden input"));
      inputArrayEmpty = inputArrayEmpty.not($(".hidden"));

      inputArrayEmpty = inputArrayEmpty.add($("select option:selected[@value='']").parent("select"));
      inputArrayEmpty = inputArrayEmpty.not($("div.subTableDiv:hidden select"));

      var trArray = $(inputArrayEmpty).parents("tr").not(".subTable");

      if (trArray.length > 0) {
        $(trArray).addClass("errorRow");
        scrollTo(0,0);
        $(".error").show();

        if (trArray.length < 2) {
          $(".error span").html('You missed ' + trArray.length + ' field.  It has been highlighted below');
        }
        else {
          $(".error span").html('You missed ' + trArray.length + ' fields.  They have been highlighted below');
        }

        hideOverlay();
        return false;
      }

      else {
        startWait(this);

        var formKey = '';
        var extractRE = /([^\/]+)$/i;
        var found = extractRE.exec(this.form.action);

        if (found != null) {
          formKey = found[1];
        }
        $.historyLoad(formKey);
        return false;
      }
    }
  );

  $("input.phone").maskedinput("(999) 999-9999");
  $("input.zipcode").maskedinput("99999");
  $("input.ccDefault").maskedinput("9999 9999 9999 9999");
  $("input.ccAmex").maskedinput("9999 999999 99999");

  $("form select.creditCardType").change(
    function() {
      switch ($(this).val()){
        case 'amex':
          $("input.ccDefault").hide().addClass("hidden");
          $("input.ccAmex").val("").show().removeClass("hidden").focus();
          break;
        default:
          $("input.ccDefault").show().removeClass("hidden");
          $("input.ccAmex").hide().addClass("hidden");
          break;
      }
    }
  );

  $("form select").change(
    function() {
      $(this).parents("tr:first").removeClass("errorRow");
    }
  );

  $("input.ccNumber").blur(
    function() {
      hiddenStrValue = $(this).val().replace(new RegExp("[^0-9]{1,}", "gi"), "");
      $(this).siblings("input.hidden").val(hiddenStrValue);
    }
  );

  $("input.toggleCheck").click(
    function() {
      if (this.checked == true) {
        $(this).parents("tr").next("tr.subTable").find("div").slideUp("medium");
        $(".resize").animate({ height: 450}, 500);
        hideOverlay();
      }
      else {
        $(this).parents("tr").next("tr.subTable").find("div").slideDown("medium");
        $(".resize").animate({ height: 800}, 400);
        hideOverlay();
      }
    }
  );


});

jQuery.fn.vjustify=function() {
    var maxHeight=0;
    $(".resize").css("height","auto");
    this.each(function(){
        if (this.offsetHeight>maxHeight) {
          maxHeight=this.offsetHeight;
        }
    });
    this.each(function(){
        $(this).height(maxHeight + "px");
        if (this.offsetHeight>maxHeight) {
            $(this).height((maxHeight-(this.offsetHeight-maxHeight))+"px");
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