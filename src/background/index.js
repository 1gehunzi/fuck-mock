let ftdWindow = null;

chrome.windows.onRemoved.addListener((windowId) => {
	if (ftdWindow && ftdWindow.id === windowId) {
		console.log(`Close the window!`);
		chrome.browserAction.setBadgeText({text: ""});
		ftdWindow = null;
	}
});

// chrome.notifications.onClicked.addListener((notificationId) => {
// 	if (ftdWindow && notificationId.startsWith(`net.focustodo`)) {
// 		console.log(`Click notification!`);
// 		const info = {
// 			focused: true
// 		};
// 		chrome.windows.update(ftdWindow.id, info);
// 		chrome.notifications.clear(notificationId);
// 	}
// });

chrome.browserAction.onClicked.addListener(function() {
	console.log(`browserAction.onClicked`);
	if (ftdWindow) {
		console.log("The window exists!");
		const info = {
			focused: true
		};
		chrome.windows.update(ftdWindow.id, info, (w) => {
			if (!w) {
				console.log(`Error: The window does not exist!`);
				ftdWindow = null;
			}
		});
	} else {
		chrome.storage.sync.get(['windowSize'], function(result) {
			console.log(`storage.sync`);
			let width = 1000;
			let height = 700;
			if (result.windowSize) {
				width = parseInt(result.windowSize.width);
				height = parseInt(result.windowSize.height);
			}
		    const left = parseInt((window.screen.width - width) / 2);
		    const top = parseInt((window.screen.height - height) / 2);
		    console.log(`${left} ${top} ${width} ${height}`);

		    chrome.windows.create({
		      url: chrome.runtime.getURL("webContent.html"),
		      type: "popup",
		      left, top, width, height
		    }, function(window) {
		    	ftdWindow = window;
		    });
		});
	}
});

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
// 	console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
//     if (request.greeting === "hello") {
//       	sendResponse({farewell: "goodbye"});
//     }
// });

console.log(`background.js loaded`);
