$(function() {
  $('.code .code-opener').toggle(function() {
    $(this).parent().addClass('collapsed').find('.code-container').animate({ height: 'hide' });
    return false;
  },function() {
     $(this).parent().removeClass('collapsed').find('.code-container').animate({ height: 'show' });
     return false;
  });
  $('.code .code-opener').click();
})