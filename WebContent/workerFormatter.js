/**
 * Adapted the code in to order to run in a web worker. 
 * 
 * Original author: Benjamin Hollis
 */

var options;

function htmlEncode(t) {
	return t != null ? t.toString().replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : '';
}

function decorateWithSpan(value, className) {
	return '<span class="' + className + '">' + htmlEncode(value) + '</span>';
}

function maybeDate(value) {
	if ( !options.formatDates )
		return false;
	var valueType = typeof value;
	if (valueType == "string" && !isNaN(parseInt(value)) && isFinite(value) ){
		value = parseInt(value);
		valueType = "number";
	}
	if (valueType == "number") {
		if (value > 946684800 && value < 2145916800)
			return new Date(value * 1000);
		else if (value > 946684800000 && value < 2145916800000)
			return new Date(value);
	} else if (valueType == "string") {
		if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value))
			return new Date(value);
	}
	return false;
}

function valueToHTML(value) {
	var valueType = typeof value, output = "", asDate = maybeDate(value);
	if (value == null)
		output += decorateWithSpan("null", "type-null");
	else if (value && value.constructor == Array)
		output += arrayToHTML(value);
	else if (valueType == "object")
		output += objectToHTML(value);
	else if (valueType == "number")
		output += decorateWithSpan(value, "type-number");
	else if (valueType == "string")
		if (/^(http|https):\/\/[^\s]+$/.test(value))
			output += decorateWithSpan('"', "type-string") + '<a href="' + value + '">' + htmlEncode(value) + '</a>' + decorateWithSpan('"', "type-string");
		else if (options.formatMultilineStrings && (value.match(/\n/g) || []).length > 2)
			output += '<div class="type-string-multiline">' + htmlEncode(value) + '</div>';
		else
			output += decorateWithSpan('"' + value + '"', "type-string");
	else if (valueType == "boolean")
		output += decorateWithSpan(value, "type-boolean");

	if ( asDate ){
		output +=  ' <span class="type-date">/* [<b>' + asDate.toUTCString() + '</b>], [<b>' + asDate.toLocaleString() + '</b>] */</span>';
	}
	return output;
}

function arrayToHTML(json) {
	var i, length, output = '<div class="collapser"></div>[<span class="ellipsis"></span><ul class="array collapsible">', hasContents = false;
	for (i = 0, length = json.length; i < length; i++) {
		hasContents = true;
		output += '<li><div class="hoverable">';
		output += valueToHTML(json[i]);
		if (i < length - 1)
			output += ',';
		output += '</div></li>';
	}
	output += '</ul>]';
	if (!hasContents)
		output = "[ ]";
	return output;
}

function keyToHTML(value) {
	var valueType = typeof value, output = "", asDate = maybeDate(value);
	if (valueType == "string"){
		if (/^(http|https):\/\/[^\s]+$/.test(value))
			output += '<a href="' + value + '">' + htmlEncode(value) + '</a>';
		else
			output += htmlEncode(value);
	}
	if (asDate) {
		output += ' <span class="type-date">/* [<b>' + asDate.toUTCString() + '</b>], [<b>' + asDate.toLocaleString()
				+ '</b>] */</span>';
	}
	return output;
}

function objectToHTML(json) {
	var i, key, length, keys = Object.keys(json), output = '<div class="collapser"></div>{<span class="ellipsis"></span><ul class="obj collapsible">', hasContents = false;
	for (i = 0, length = keys.length; i < length; i++) {
		key = keys[i];
		hasContents = true;
		output += '<li><div class="hoverable">';
		output += '<span class="property">' + keyToHTML(key) + '</span>: ';
		output += valueToHTML(json[key]);
		if (i < length - 1)
			output += ',';
		output += '</div></li>';
	}
	output += '</ul>}';
	if (!hasContents)
		output = "{ }";
	return output;
}

function jsonToHTML(json, fnName) {
	var output = '';
	if (fnName)
		output += '<div class="callback-function">' + fnName + '(</div>';
	output += '<div id="json">';
	output += valueToHTML(json);
	output += '</div>';
	if (fnName)
		output += '<div class="callback-function">)</div>';
	return output;
}

addEventListener("message", function(event) {
	var object;
	console.log(event.data);
	if (event.data.hasOwnProperty("options")){
		options = event.data.options;
	}
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
		html : jsonToHTML(object, event.data.fnName)
	});
}, false);
