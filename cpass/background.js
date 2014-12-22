var badgeTimeout = 0;
var badgeTimer = null;

function startBadgeTimer(seconds) {
  clearTimeout(badgeTimer);
  badgeTimeout = seconds;
  updateBadgeTimer();
}

function updateBadgeTimer() {
  if (badgeTimeout >= 1) {
    chrome.browserAction.setBadgeText({'text': badgeTimeout.toString()});
    badgeTimer = setTimeout(updateBadgeTimer, 1000);
    badgeTimeout = badgeTimeout - 1;
  } else {
    chrome.browserAction.setBadgeText({'text': ''});
  }
}

function error(message) {
  setTimeout(function() { alert('Error: ' + message) }, 0);
}

function getPassword(passname, op) {
  chrome.runtime.sendNativeMessage(
    'com.ksvladimir.cpass',
    {
      action: op + '-password',
      passname: passname
    },
    function (response) {
      if (response && response['result'] == 'success') {
        chrome.extension.getBackgroundPage().startBadgeTimer(45);
      } else {
        if (response && response.error)
          error('cannot ' + op + ' password:\n' + response.error);
      }
    }
  );
}

