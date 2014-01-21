function initOptions() {
	var bgPage = chrome.extension.getBackgroundPage(), options = localStorage.options ? JSON.parse(localStorage.options) : {};
	var safeMethodInput = document.getElementById("safeMethodInput"),
	injectInFrameInput = document.getElementById("injectInFrameInput"),
	addContextMenuInput = document.getElementById("addContextMenuInput"),
	openInReducedViewInput = document.getElementById("openInReducedViewInput");
	safeMethodInput.checked = options.safeMethod;
	injectInFrameInput.checked = options.injectInFrame;
	addContextMenuInput.checked = options.addContextMenu;
	openInReducedViewInput.checked = options.openInReducedView;
	safeMethodInput.addEventListener("change", function() {
		options.safeMethod = safeMethodInput.checked;
		localStorage.options = JSON.stringify(options);
	});
	injectInFrameInput.addEventListener("change", function() {
		options.injectInFrame = injectInFrameInput.checked;
		localStorage.options = JSON.stringify(options);
	});
	addContextMenuInput.addEventListener("change", function() {
		options.addContextMenu = addContextMenuInput.checked;
		localStorage.options = JSON.stringify(options);
		bgPage.refreshMenuEntry();
	});
	openInReducedViewInput.addEventListener("change", function() {
		options.openInReducedView = openInReducedViewInput.checked;
		localStorage.options = JSON.stringify(options);
		bgPage.refreshMenuEntry();
	});
	document.getElementById("open-editor").addEventListener("click", function() {
		location.href = "csseditor.html";
	}, false);
}

addEventListener("load", initOptions, false);
