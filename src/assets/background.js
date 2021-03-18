/* chrome.identity.getAccounts((accounts) => {
    console.log('extension start')
    console.log(accounts)
}) */

chrome.runtime.onInstalled.addListener(() => {
  chrome.webNavigation.onCompleted.addListener(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([{ id }]) => {
      chrome.pageAction.show(id);
    });
  }, { url: [{ urlMatches: 'google.com' }] });
});
