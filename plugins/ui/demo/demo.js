$(function(){
  // Menu - to be replaced by Tabs 3
  $("#nav").idTabs(true);
  if(window.location.hash)
    $("#nav a[@href='"+window.location.hash+"']").click();

  // Default Tab - info page (don't clutter the view source)
  $.ajax({url:"info.html",success:function(r){
    $(r).hide().prependTo("#demos");
    if(!$("#demos .demo:visible").length) $("#info").show();
  }});
  $("#header h1 span").click(function(){ $("#nav a[@href='#info']").click(); });
});

