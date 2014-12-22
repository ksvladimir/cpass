(function() {
  var passNames = null;
  var isValid = null;

  function getPassword(event) {
    if (isValid === null)
      return; // Not inited yet

    var passname = document.f.passname.value;

    // The popup will be destroyed if gpg-agent pops up and chrome looses focus.
    // Hence, we invoke pass in the background context.
    chrome.extension.getBackgroundPage().getPassword(
        passname, isValid ? 'get' : 'generate');

    self.close();

    event.stopPropagation();
    event.preventDefault();
    return false;
  }

  function updatePassName(event) {
    if (passNames === null)
      return; // Not inited yet

    var passname = document.f.passname.value;
    document.f.submit.disabled = (passname.length == 0);
    var newIsValid = (passname in passNames);
    if (newIsValid != isValid) {
      isValid = newIsValid;
      if (isValid) {
        document.f.passname.classList.add('valid-pass-name');
        document.f.submit.innerText = 'Get password';
      } else {
        document.f.passname.classList.remove('valid-pass-name');
        document.f.submit.innerText = 'Generate password';
      }
    }
  }

  function getDomain(url) {
    console.log(url);
    var match = url.match(/\/\/([^/:]+)($|[/:])/);
    if (match) return match[1].split('.').slice(-2).join('.');
    else return '';
  }

  document.f.addEventListener("submit", getPassword);
  document.f.passname.addEventListener("input", updatePassName);
  document.f.passname.focus();

  // Get list of all valid pass-names
  chrome.runtime.sendNativeMessage(
    'com.ksvladimir.cpass',
    {action: "get-pass-names"},
    function (response) {
      if (response) {
        passNames = response;
        updatePassName();
      } else {
        if (chrome.runtime.lastError)
          chrome.extension.getBackgroundPage().error(
            'cannot get passwords list:\n' + chrome.runtime.lastError.message);
        self.close();
      }
    }
  );

  // Get current tab URL
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    var domain = getDomain(tabs[0].url);
    if (domain)
      document.f.passname.value = domain;
    updatePassName();
  });
})();
