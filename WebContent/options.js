function initOptions() {
	var bgPage = chrome.extension.getBackgroundPage(), options = localStorage.options ? JSON.parse(localStorage.options) : {};
	var safeMethodInput = document.getElementById("safeMethodInput"), injectInFrameInput = document.getElementById("injectInFrameInput"), addContextMenuInput = document.getElementById("addContextMenuInput");
	var defaultCollapseObject = document.getElementById("defaultCollapseObject");
	var defaultCollapseArrays = document.getElementById("defaultCollapseArrays");
	safeMethodInput.checked = options.safeMethod;
	injectInFrameInput.checked = options.injectInFrame;
	addContextMenuInput.checked = options.addContextMenu;
	defaultCollapseArrays.checked = options.collapseArrays;
	defaultCollapseObject.checked = options.collapseObjects;
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
	defaultCollapseObject.addEventListener("change", function() {
		options.collapseObjects = defaultCollapseObject.checked;
		localStorage.options = JSON.stringify(options);
	});
	defaultCollapseArrays.addEventListener("change", function() {
		options.collapseArrays = defaultCollapseArrays.checked;
		localStorage.options = JSON.stringify(options);
	});
	document.getElementById("open-editor").addEventListener("click", function() {
		location.href = "csseditor.html";
	}, false);
}

addEventListener("load", initOptions, false);
