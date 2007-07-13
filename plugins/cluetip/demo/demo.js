$(document).ready(function() {
  $('a.basic').cluetip();
  $('a.custom-width').cluetip({width: '200px'});
  $('h4').cluetip({attribute: 'id', hoverClass: 'highlight'});
  $('#sticky').cluetip({'sticky': true});
  $('#examples a:eq(4)').cluetip({
    hoverClass: 'highlight',
    sticky: true,
    closePosition: 'bottom',
    closeText: '<img src="cross.png" alt="close" />',
    truncate: 60,
    ajaxSettings: {
      type: 'POST'
    }
  });
  $('a.load-local').cluetip({local:true});
  $('#clickme').cluetip({activation: 'click'});
  $('span[@title]').css('background', 'yellow').cluetip({splitTitle: '|'});
  
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
  



