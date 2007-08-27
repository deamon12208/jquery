// Menu - to be replaced by Tabs 3
$(function(){
  $("#nav").idTabs(true);
  if(window.location.hash)
    $("#nav a[@href='"+window.location.hash+"']").click();
});

