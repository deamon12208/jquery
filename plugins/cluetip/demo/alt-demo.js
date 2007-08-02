$(document).ready(function() {
  $('a.basic').cluetip({arrows:true, dropShadow: false, cluetipClass: 'jtip'});
  $('a.custom-width').cluetip({width: '200px', arrows:true, dropShadow: false, cluetipClass: 'jtip'});
  $('h4').cluetip({attribute: 'id', hoverClass: 'highlight', arrows:true, dropShadow: false, cluetipClass: 'jtip'});
  $('#sticky').cluetip({'sticky': true, arrows:true, dropShadow: false, cluetipClass: 'jtip'});
  $('#examples a:eq(4)').cluetip({
    hoverClass: 'highlight',
    sticky: true,
    closePosition: 'bottom',
    closeText: '<img src="cross.png" alt="close" />',
    truncate: 60,
    arrows:true, 
    dropShadow: false, 
    cluetipClass: 'jtip'
  });
  $('a.load-local').cluetip({local:true, arrows:true, sticky: true, dropShadow: false, cluetipClass: 'jtip'});
  $('#clickme').cluetip({activation: 'click', arrows:true, dropShadow: false, cluetipClass: 'jtip'});
  $('span[@title]').css('background', 'yellow').cluetip({splitTitle: '|', arrows:true, dropShadow: false, cluetipClass: 'jtip'});
  
});



//unrelated to clueTip -- just for the demo page...
$(document).ready(function() {
  $('#container > div:gt(0)').hide().append('<a class="back-to-top" href="#top">back to top</a>');
  $('#navigation a').click(function() {
    var $this = $(this);
    var hash = $this.attr('href');
    $(hash).siblings(':visible').hide();
    $(hash).slideDown('fast');
    $('#navigation a').removeClass('active');
    $this.addClass('active');
    return false;
  });
});
  



