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


//unrelated to clueTip -- just for this page...
$('h3:gt(0)').before('<a href="#top">back to top</a>');

});
