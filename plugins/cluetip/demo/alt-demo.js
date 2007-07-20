$(document).ready(function() {
  $('a.basic').cluetip({arrows:true, dropShadow: false});
  $('a.custom-width').cluetip({width: '200px', arrows:true, dropShadow: false});
  $('h4').cluetip({attribute: 'id', hoverClass: 'highlight', arrows:true, dropShadow: false});
  $('#sticky').cluetip({'sticky': true, arrows:true, dropShadow: false});
  $('#examples a:eq(4)').cluetip({
    hoverClass: 'highlight',
    sticky: true,
    closePosition: 'bottom',
    closeText: '<img src="cross.png" alt="close" />',
    truncate: 60,
    arrows:true, 
    dropShadow: false
  });
  $('a.load-local').cluetip({local:true, arrows:true, sticky: true, dropShadow: false});
  $('#clickme').cluetip({activation: 'click', arrows:true, dropShadow: false});
  $('span[@title]').css('background', 'yellow').cluetip({splitTitle: '|', arrows:true, dropShadow: false});
  
});



//unrelated to clueTip -- just for the demo page...
$(document).ready(function() {
  $('#container > div').hide().append('<a class="back-to-top" href="#top">back to top</a>');
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
  



