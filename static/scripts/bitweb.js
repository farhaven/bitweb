function home_get_blockchain_url(addr) {
	var url = "https://blockchain.info/address/" + addr;
	return "<a href=\"" + url + "\">" + addr + "</a>";
}

function home_append_address(acc, addr, newentry) {
	var root = document.getElementById("addresslist-" + acc);
	if (root == null) {
		var list = document.getElementById("addresslist");
		root = document.createElement("dt");
		root.innerHTML = acc;
		list.appendChild(root);

		tmp = document.createElement("dd");
		root.appendChild(tmp);

		root = document.createElement("ul");
		root.id = "addresslist-" + acc;
		tmp.appendChild(root);
	}

	var c = document.createElement('li');
	c.innerHTML = home_get_blockchain_url(addr);
	if (newentry)
		c.innerHTML += " (<strong>New</strong>)";
	root.appendChild(c);
}

function home_list_addresses() {
	elem = document.createElement("li");
	elem.innerHTML = "Waiting for bitcoind to answer";
	list = document.getElementById("addresslist");
	list.innerHTML = "";
	list.appendChild(elem);

	JHR_GET("/btc/getalladdresses", function (data) {
		list.innerHTML = "";
		for (acc in data) {
			if (!data.hasOwnProperty(acc))
				continue;
			for (idx in data[acc]) {
				home_append_address(acc, data[acc][idx]);
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
	var e = document.getElementById('accountname');
	var name = e.value;
	if ((name == null) || (name == "default"))
		name = "";
	JHR_POST("/btc/getnewaddress", function (data) {
		if (name != "")
			home_append_address(name, data.addr, true);
		else
			home_append_address("default", data.addr, true);
	}, { "name": name });
	return false;
}

function home_transfer () {
	var e_amount = document.getElementById("transfer_amount");
	var e_target = document.getElementById("transfer_target");
	var e_account = document.getElementById("transfer_account");
	var e_info = document.getElementById("transfer_info");
	var e_alert = document.getElementById("transfer_alert");
	var e_submit = document.getElementById("transfer_submit");

	console.log("Would send " + e_amount.value + " BTC to " + e_target.value + " now (via \"" + e_account.value + "\")");

	var data = {
		"amount": parseFloat(e_amount.value),
		"target": e_target.value,
		"account": e_account.value
	};

	e_alert.style.visibility = "hidden";
	e_info.style.visibility = "hidden";
	e_submit.disabled = true;
	e_submit.innerHTML = "Please wait...";

	JHR_POST("/btc/sendfrom", function (data) {
		if (data["status"] != "error") {
			console.log("success: " + JSON.stringify(data));
			e_alert.style.visibility = "hidden";
			var url = "https://blockchain.info/tx/" + data.txid;
			e_info.innerHTML = "<a href=\"" + url + "\">" + data.txid + "</a>";
			e_info.style.visibility = "visible";
		} else {
			console.log("a] error: " + data["message"]);
			e_alert.innerHTML = data["message"];
			e_alert.style.visibility = "visible";
		}

		e_submit.disabled = false;
		e_submit.innerHTML = "Transfer Bitcoins";
	}, data, function (data, error) {
		console.log("b] data: " + data);
		console.log("b] error:" + error);

		e_alert.innerHTML = error;
		e_alert.style.visibility = "visible";
		e_info.style.visibility = "hidden";
		e_submit.disabled = false;
		e_submit.innerHTML = "Transfer Bitcoins";
	});
	return false;
}

function home_init() {
	home_list_addresses();
	home_display_balance();
}
