/**
 * Adapted the code in to order to run in a web worker. 
 * 
 * Original author: Benjamin Hollis
 */

function htmlEncode(t) {
	return t != null ? t.toString().replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : '';
}

function decorateWithSpan(value, className) {
	return '<span class="' + className + '">' + htmlEncode(value) + '</span>';
}

function valueToHTML(value, collapseArrays, collapseObjects) {
	var valueType = typeof value, output = "";
	if (value == null)
		output += decorateWithSpan("null", "type-null");
	else if (value && value.constructor == Array)
		output += arrayToHTML(value, collapseArrays, collapseObjects);
	else if (valueType == "object")
		output += objectToHTML(value, collapseArrays, collapseObjects);
	else if (valueType == "number")
		output += decorateWithSpan(value, "type-number");
	else if (valueType == "string")
		if (/^(http|https):\/\/[^\s]+$/.test(value))
			output += decorateWithSpan('"', "type-string") + '<a href="' + value + '">' + htmlEncode(value) + '</a>' + decorateWithSpan('"', "type-string");
		else
			output += decorateWithSpan('"' + value + '"', "type-string");
	else if (valueType == "boolean")
		output += decorateWithSpan(value, "type-boolean");

	return output;
}

function arrayToHTML(json, collapseArrays, collapseObjects) {
	var collapsableClass = "collapsible";
	if (collapseArrays) {
		collapsableClass += " collapsed";
	}
	var i, length, output = '<div class="collapser"></div>[<span class="ellipsis"></span><ul class="array ' + collapsableClass + '">', hasContents = false;
	for (i = 0, length = json.length; i < length; i++) {
		hasContents = true;
		var classes = 'hoverable';
		if (collapseObjects) {
			classes += " collapsed";
		}
		output += '<li><div class="' + classes + '">';
		output += valueToHTML(json[i], collapseArrays, collapseObjects);
		if (i < length - 1)
			output += ',';
		output += '</div></li>';
	}
	output += '</ul>]';
	if (!hasContents)
		output = "[ ]";
	return output;
}

function objectToHTML(json, collapseArrays, collapseObjects) {
	var collapsableClass = "collapsible";
	var i, key, length, keys = Object.keys(json), output = '<div class="collapser"></div>{<span class="ellipsis"></span><ul class="obj ' + collapsableClass + '">', hasContents = false;
	for (i = 0, length = keys.length; i < length; i++) {
		key = keys[i];
		hasContents = true;
		var classes = 'hoverable';
		if (collapseArrays) {
			classes += " collapsed";
		}
		output += '<li><div class="' + classes + '">';
		output += '<span class="property">' + htmlEncode(key) + '</span>: ';
		output += valueToHTML(json[key], collapseArrays, collapseObjects);
		if (i < length - 1)
			output += ',';
		output += '</div></li>';
	}
	output += '</ul>}';
	if (!hasContents)
		output = "{ }";
	return output;
}

function jsonToHTML(json, fnName, collapseArrays, collapseObjects) {
	var output = '';
	if (fnName)
		output += '<div class="callback-function">' + fnName + '(</div>';
	output += '<div id="json">';
	output += valueToHTML(json, collapseArrays, collapseObjects);
	output += '</div>';
	if (fnName)
		output += '<div class="callback-function">)</div>';
	return output;
}

addEventListener("message", function(event) {
	var object;
	try {
		object = JSON.parse(event.data.json);
	} catch (e) {
		postMessage({
			error : true
		});
		return;
	}
	postMessage({
		onjsonToHTML : true,
		html : jsonToHTML(object, event.data.fnName, event.data.collapseArrays, event.data.collapseObjects)
	});
}, false);
