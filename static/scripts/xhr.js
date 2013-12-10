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

JHR_POST = function (url, fun_success, data, fun_error) {
	var x = new XMLHttpRequest();
	x.responseJSON = null;
	x.onreadystatechange = function () {
		if (x.readyState != 4)
			return;
		try {
			x.responseJSON = JSON.parse(x.responseText);
			fun_success(x.responseJSON);
		} catch (e) {
			fun_error(x.responseText, e);
		}
	}
	x.open("POST", url, false);
	x.setRequestHeader('Accept', 'application/json');
	x.setRequestHeader('Content-Type', 'application/json');
	x.send(JSON.stringify(data));
	return x;
}
