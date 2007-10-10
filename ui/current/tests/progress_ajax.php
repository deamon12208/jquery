<?php 
function p() {
  if (!isset($_SESSION['currentPerecentExceeds'])) {
    print 'here';
    $_SESSION['currentPerecentExceeds'] = FALSE;
    return 5;
  }
  elseif ($_SESSION['currentPerecentExceeds'] != TRUE) {
    if ($_POST['currentPercent'] >= 100) {
      $_SESSION['currentPerecentExceeds'] = TRUE;
      return $_POST['currentPercent'] - 5;
    }
    else {
      return $_POST['currentPercent'] + 5;
    }
  }
  else {
    if ($_POST['currentPercent'] <= 0) {
      $_SESSION['currentPerecentExceeds'] = FALSE;
      return $_POST['currentPercent'] + 5;
    }
    else {
      return $_POST['currentPercent'] - 5;
    }
  }
}
session_start();
print p();