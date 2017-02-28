// —————————————————————————————————————————————
// Detection clic sur bouton extension
// —————————————————————————————————————————————
chrome.browserAction.onClicked.addListener(function(tab) {
	// chrome.tabs.create({'index'})
	chrome.tabs.create({'index':0,'url': 'https://github.com/Tchangang/LinkVit/blob/master/README.md','active': true}, function(tab) {	
	});
});