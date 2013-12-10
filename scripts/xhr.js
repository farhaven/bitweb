var JHR = function(url, fun, data) {
	var xhr = new XMLHttpRequest();
	xhr.responseJSON = null;
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			xhr.responseJSON = JSON.parse(xhr.responseText);
			fun(xhr.responseJSON, xhr);
		}
	}
	if (data == null) {
		xhr.open("GET", url, true);
	} else {
		xhr.open("POST", url, true);
	}
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(data);
	return xhr;
}
