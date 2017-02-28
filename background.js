// —————————————————————————————————————————————
// Detection clic sur bouton extension
// —————————————————————————————————————————————
chrome.browserAction.onClicked.addListener(function(tab) {
	// chrome.tabs.create({'index'})
	chrome.tabs.create({'index':0,'url': 'https://www.linkedin.com/mynetwork/invite-connect/connections/','active': true}, function(tab) {	
	});
});