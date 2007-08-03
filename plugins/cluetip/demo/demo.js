$(document).ready(function() {

//default theme
  $('a.basic').cluetip();
  $('a.custom-width').cluetip({width: '200px', showTitle: false,sticky: true});
  $('h4').cluetip({attribute: 'id', hoverClass: 'highlight'});
  $('#sticky').cluetip({'sticky': true});
  $('#examples a:eq(4)').cluetip({
    hoverClass: 'highlight',
    sticky: true,
    closePosition: 'bottom',
    closeText: '<img src="cross.png" alt="close" />',
    truncate: 60
  });
  $('a.load-local').cluetip({local:true, cursor: 'pointer'});
  $('#clickme').cluetip({activation: 'click'});
  $('span[@title]').css('background', 'yellow').cluetip({splitTitle: '|'});

// jTip theme
  $('.jt').cluetip({cluetipClass: 'jtip', arrows: true, dropShadow: false,
    fx: {
      open: 'slideDown', 
      openSpeed: 'slow',
      close: 'fadeOut',
      closeSpeed: 'fast'
    }
  });

// Rounded Corner theme
  $('ol.rounded a').cluetip({cluetipClass: 'rounded', dropShadow: false, sticky: true});
  
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
    // return false;
  }).filter(':first').addClass('active');
  $('div.html, div.jquery').next().css('display', 'none').end().click(function() {
    $(this).next().toggle('fast');
  });
});
  



