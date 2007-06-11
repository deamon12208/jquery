//-----------------------------------------------------------------------------------
// Services for managing signup operations
//-----------------------------------------------------------------------------------
var MktSignup = {
  code: null
}

MktSignup.init = function(code) {
  MktSignup.code = code;

}

// PageLoad function
// This function is called when:
// 1. after calling $.historyInit();
// 2. after calling $.historyLoad();
// 3. after pushing "Go Back" button of a browser
MktSignup.pageload = function(hash) {
  var form = $("form[@type='actionForm']");
  
  if(hash == '') {
    // restore ajax loaded state
    form.ajaxSubmit( {  url: MktSignup.getUrlPrefix() + '/signup/profileInfo' + /code/ + MktSignup.code,
                    success: MktSignup.ajaxSuccess } );
  } else if (hash == 'billingInfo') {
    form.ajaxSubmit( {  url: MktSignup.getUrlPrefix() + '/signup/billingInfo' + /code/ + MktSignup.code,
                    success: MktSignup.ajaxSuccess } );
  } else if (hash == 'signupComplete') {
    form.ajaxSubmit( {  url: MktSignup.getUrlPrefix() + '/signup/signupComplete',
                    success: MktSignup.ajaxSuccess } );
  }
}

MktSignup.parseResults = function(responseText) {
  var results = {success: false, errorType: null, errorHTML: "did not get started", jsonObject: null };
  var htmlGuard = "+++JSON-END-SENTINEL+++";
  var response = null;
  var debug = null;

  var guardIx = responseText.indexOf(htmlGuard, 0);

  // this stuff strips out the symfony debug html if present at the end.
  // Would be nice to make it work in the debug version of app
  if (guardIx != -1) {
    var response = responseText.substring(0, guardIx);
    if (responseText.length > (guardIx + htmlGuard.length)) {
      debug = responseText.substring(guardIx + htmlGuard.length);
    }
  } else {
    var response = responseText;
  }

  if (!response || response.length == 0) {
    results.errorType = 'Marketo System Error';
    results.errorHTML = 'Error processing signup. Please try again later.';
    return results;
  }

  // results is an object with a JSONResults member containing
  //  -- a sections member which is an array of section names
  //  -- a member object for each section name with that name
  // results also has an HTMLResults member which again has
  //  -- a sections member which is an array that lists the sections
  //  -- a member for each section whose value is a string of HTML
  try {
    results.jsonObject = eval( '(' + response + ')' );
    if (results.jsonObject == false) {
      // same story as an exception ...
      results.errorHTML = 'Problem with server response (1): ' + response;
    } else {
      if ((isDefined(results.jsonObject.JSONResults)) && (isDefined(results.jsonObject.HTMLResults))) {
        results.success = true;
        results.errorHTML = "";
      } else {
        // same story as an exception ...
        results.errorHTML = 'Problem with server response (2): ' + response;
      }
    }
  } catch (e) {
    // If the response doesn't parse as JSON, then we may have had a PHP
    // error on the server in which case the response contains some html describing
    // the error.
    results.errorHTML = 'Problem with server response (3): ' + response;
  }

  return results; 
}

MktSignup.getUrlPrefix = function() {
  // check to see if "/search_dev.php is  present in our location and if so
  // prepend it to the url to make debug and production mode consistent for a session
  if (window.location.pathname.indexOf("/search_dev.php") == 0) {
    var prefix = "/search_dev.php";
  } else {
    var prefix = "";
  }
  return prefix;
}

MktSignup.showErrorMessage = function(message) {
  scrollTo(0,0);
  $(".error").show();
  $(".error span").html(message);
   
  stopWait($(".formButton"));
}

MktSignup.doPresentLogin = function(userId, doWelcome) {
  var url = MktSignup.getUrlPrefix() + '/homepage/login?userEmail=' + userId;
  
  if (doWelcome) {
    url += '&welcome=true';
  }

  window.location.replace(url);
}

MktSignup.ajaxSuccess = function(responseText, statusText) {
  if (statusText != 'success') {
    MktSignup.showErrorMessage('Error logging in, please try again later. statusText: ' + statusText);
    return;
  }

  var results = MktSignup.parseResults(responseText);
 
  if (!results.success) {
    MktSignup.showErrorMessage(results.errorHTML);
    return;
  }
 
  var JSONResults = results.jsonObject.JSONResults;
  var HTMLResults = results.jsonObject.HTMLResults;
 
  // execute the explicit actions
  if (isArray(JSONResults.actions)) {
    for (ix = 0; ix < JSONResults.actions.length; ix++) {
      var thisAction = JSONResults.actions[ix];
      var action = thisAction;
      var parameters = [];
      if (isDefined(thisAction.action)) {
        action = thisAction.action;
      }
      if (isDefined(thisAction.parameters)) {
        parameters = thisAction.parameters;
      }

      if (action == 'doPresentLogin') {
        MktSignup.doPresentLogin.apply(this, parameters);
      }
      else {
        MktSignup.showErrorMessage('Error logging in, please try again later. action: ' + action);
      }
    }
  }

  // If error message returned, show it.
  if (isDefined(JSONResults.submitError)) {
    MktSignup.showErrorMessage(JSONResults.submitError);
  }
  else {
    $("div.main-content").empty().append(HTMLResults.panelHoldingPen);

    // Now execute all the scripts from the json but with a brief delay
    var scripts = [];
    for (sx = 0; sx < HTMLResults.sections.length; sx++) {
      var id = HTMLResults.sections[sx];
        var theseScripts = HTMLResults[id].extractScripts();
        scripts = scripts.concat(theseScripts);
    }

    if (scripts.length > 0) {
      window.setTimeout(function() {
                          for (var ix = 0; ix < scripts.length; ix++) {
                            eval(scripts[ix]);
                          }
                        }, 0);
    }

    // Perform final page initialization
    MktSignup.pageInit("form[@type='actionForm']");
  }
}

MktSignup.ajaxError = function(request, errorText, exception) {
  MktSignup.showErrorMessage(errorText);
  alert('error:'+errorText);
}

MktSignup.pageInit = function(formId) {
  scrollTo(0,0);
  hideOverlay();
  stopWait();


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

  $("div.action-container").click(
    function() {
      location.href = $(this).attr("rel");
    }
  );

  $("div.action-container").hover(
    function() {
      $(this).addClass("hover");
      var currentTop = parseInt($(this).find("img.action-icon").css("top"),10);
      newTop = currentTop + 300;
      $(this).find("img.action-icon").css("top",newTop)
    },
    function(){
      $(this).removeClass("hover");
      var currentTop = parseInt($(this).find("img.action-icon").css("top"),10);
      newTop = currentTop + -300;
      $(this).find("img.action-icon").css("top",newTop)
    }
  );

  $("div.buttonSubmit").hover(
    function(){
      $(this).addClass("buttonSubmitHover");
    },
    function(){
      $(this).removeClass("buttonSubmitHover");
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
        setTimeout(function(){ self.parents("tr:first").addClass("errorRow"); hideOverlay() }, 100);
        setTimeout(function(){ self.focus() }, 0);
      }
      else {
        $(this).parents("tr").removeClass("errorRow");
        hideOverlay();
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
        setTimeout(function(){ self.parents("tr:first").addClass("errorRow"); hideOverlay() }, 100);
        setTimeout(function(){ self.focus() }, 0);
      }
      else {
        $(this).parents("tr:first").removeClass("errorRow");
        hideOverlay();
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

  if (formId != null) {
    $(formId).ajaxForm( {
      dataType: null,
      success: MktSignup.ajaxSuccess,
      error:   MktSignup.ajaxError } );
  }
}

function hideOverlay() {
	$(".resize").vjustify();
	$("#page-container:hidden").css("visibility","visible");
}

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

function startWait() {
  $("body").css("cursor","wait");
  var originalValue = $(".formButton").attr("value");
  $(".formButton").attr("disabled","true").attr("label",originalValue).attr("value","Please wait");
}

function stopWait() {
  $("body").css("cursor","default");
  var originalValue = $(".formButton").attr("label");
  $(".formButton").removeAttr("disabled").attr("value",originalValue);
}
