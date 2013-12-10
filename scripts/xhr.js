var JHR_GET = function(url, fun) {
	var xhr = new XMLHttpRequest();
	xhr.responseJSON = null;
	xhr.onreadystatechange = function () {
		if (xhr.readyState != 4)
			return;
		xhr.responseJSON = JSON.parse(xhr.responseText);
		fun(xhr.responseJSON);
	}
	xhr.open("GET", url, true);
	xhr.setRequestHeader('Accept', 'application/json');
	xhr.send();
	return xhr;
}

JHR_POST = function (url, fun, data) {
	var x = new XMLHttpRequest();
	x.responseJSON = null;
	x.onreadystatechange = function () {
		if (x.readyState != 4)
			return;
		x.responseJSON = JSON.parse(x.responseText);
		fun(x.responseJSON);
	}
	x.open("POST", url, false);
	x.setRequestHeader('Accept', 'application/json');
	x.setRequestHeader('Content-Type', 'application/json');
	x.send(JSON.stringify(data));
	return x;
}
