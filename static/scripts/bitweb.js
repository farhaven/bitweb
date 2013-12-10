function home_list_addresses() {
	elem = document.createElement("li");
	elem.innerHTML = "Waiting for bitcoind to answer";
	list = document.getElementById("addresses");
	list.innerHTML = "";
	list.appendChild(elem);

	JHR_GET("/btc/getalladdresses", function (data) {
		list.innerHTML = "";
		for (acc in data) {
			if (!data.hasOwnProperty(acc))
				continue;
			for (idx in data[acc]) {
				var c = document.createElement('li');
				c.innerHTML = "<code>" + data[acc][idx] + "</code> (" + acc + ")";
				list.appendChild(c);
			}
		}
	})
}

function home_display_balance () {
	JHR_GET("/btc/getinfo", function (data) {
		span = document.getElementById("balance");
		span.innerHTML = data.balance + " BTC";
	})
}

function home_get_new_address () {
	e = document.getElementById('accountname');
	name = e.value;
	if ((name == null) || (name == "default"))
		name = "";
	console.log('requesting new address for "' + name + '"');
	JHR_POST("/btc/getnewaddress", function (data) {
		e = document.createElement('li');
		e.innerHTML = "<code>" + data.addr + "</code> (";
		if (name != "")
			e.innerHTML += name;
		else
			e.innerHTML += "default";
		e.innerHTML += ") (<em>New</em>)";
		document.getElementById('addresses').appendChild(e);
	}, { "name": name });
	return false;
}

function home_init() {
	home_list_addresses();
	home_display_balance();
}
