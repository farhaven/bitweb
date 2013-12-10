function home_list_addresses() {
	elem = document.createElement("li");
	elem.innerHTML = "Waiting for bitcoind to answer";
	list = document.getElementById("addresses");
	list.innerHTML = "";
	list.appendChild(elem);

	JHR("/btc/getalladdresses", function (data, jhr) {
		list.innerHTML = "";
		for (idx in data.addresses) {
			var c = document.createElement('li');
			c.innerHTML = "<pre>" + data.addresses[idx] + "</pre>";
			list.appendChild(c);
		}
	})
}

function home_display_balance () {
	JHR("/btc/getinfo", function (data, jhr) {
		span = document.getElementById("balance");
		span.innerHTML = data.balance + " BTC";
	})
}

function home_get_new_address () {
	e = document.getElementById('accountname');
	name = e.value;
	if ((name == null) || (name == "default"))
		name = "";
	console.log('requesting new address for ' + e.value);
	JHR("/btc/getnewaddress/" + name, function (data, jhr) {
		document.getElementById('addresses').innerHTML = "<li>Please wait...</li>";
		home_list_addresses();
	});
}

function home_init() {
	home_list_addresses();
	home_display_balance();
}
