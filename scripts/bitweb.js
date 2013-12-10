function home_list_accounts () {
	elem = document.createElement("li");
	elem.innerHTML = "Waiting for bitcoind to answer";
	list = document.getElementById("accounts");
	list.innerHTML = "";
	list.appendChild(elem);

	JHR("/btc/listaccounts", function (data, jhr) {
		list.innerHTML = "";
		for (var acc in data) {
			if (!data.hasOwnProperty(acc))
				continue;
			var c = document.createElement('li');
			c.innerHTML = acc + ": " + data[acc];
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

function home_init() {
	home_list_accounts();
	home_display_balance();
}
