from __future__ import print_function

import flask

import jsonrpclib
import threading
import json
import os.path

import auth

app = flask.Flask(__name__, static_url_path='')
app.debug = True

class ThreadsafeJsonRPCServer(jsonrpclib.Server):
	def __init__(self, *args, **kwargs):
		self.threadlock = threading.Lock()
		jsonrpclib.Server.__init__(self, *args, **kwargs)

	def _run_request(self, request, notify=None):
		self.threadlock.acquire()
		rv = jsonrpclib.Server._run_request(self, request, notify)
		self.threadlock.release()
		return rv

class BitcoinConfig(object):
	def __init__(self, path="~/.bitcoin/bitcoin.conf"):
		self.user = ""
		self.host = "localhost:8332"
		self.pwd  = ""

		with open(os.path.expanduser(path), 'r') as fh:
			for l in fh.readlines():
				l = l.strip().split('=')
				if l[0] == 'rpcuser':
					self.user = l[1]
				elif l[0] == 'rpcpassword':
					self.pwd = l[1]

		self.host = "http://" + self.user + \
			":" + self.pwd + \
			"@" + self.host

	def getRPCServerAddress(self):
		return self.host

def escapeHTML(txt, escapeNL=False):
	txt = txt.replace('&', '&amp;')
	txt = txt.replace('<', '&lt;')
	txt = txt.replace('>', '&gt;')
	if escapeNL:
		txt = txt.replace('\n', '<br/>\n')
	return txt

if __name__ == "__main__":
	b = BitcoinConfig()
	s = ThreadsafeJsonRPCServer(b.getRPCServerAddress())

	@app.route('/')
	@auth.required(app)
	def landing_page():
		return flask.render_template('home.html', username=flask.request.authorization.username)

	@app.route('/btc/getalladdresses')
	@auth.required(app)
	def btc_getalladdresses():
		addrs = {}
		for acc in s.listaccounts():
			key = acc if acc != "" else "default"
			addrs[key] = s.getaddressesbyaccount(acc)
		return json.dumps(addrs, indent=2)

	@app.route('/btc/help')
	@app.route('/btc/help/<command>')
	@auth.required(app)
	def btc_help_page(command=None):
		txt = ""
		if command is None:
			for l in s.help().splitlines():
				l = escapeHTML(l).split(' ', 1)
				txt += "<a href=\"/btc/help/" + l[0] + "\">"
				txt += l[0] + "</a>"
				if len(l) == 2:
					txt += " " + l[1]
				txt += "<br/>\n"
		else:
			help = str(s.help(command)).split('\n', 1)
			tmp = help[0].split(' ', 1)
			if len(tmp) > 1:
				help[0] = tmp[0]
				help[1] = tmp[1] + "\n" + help[1]
			txt = "<a href=\"/btc/" + help[0] + "\">" + help[0] + "</a>"
			if len(help) > 1:
				txt += "<br/>\n" + escapeHTML(help[1], escapeNL=True)
		return txt

	@app.route('/btc/listaccounts')
	@auth.required(app)
	def btc_list_accounts():
		txt = s.listaccounts()
		txt["default"] = txt[""]
		del txt[""]
		txt = json.dumps(txt, indent=2)
		if "application/json" not in flask.request.headers.get("Accept", []):
			txt = escapeHTML(txt, escapeNL=False)
			txt = "<pre>" + txt + "</pre>"
		return txt

	@app.route("/btc/getnewaddress", methods=["POST"])
	@auth.required(app)
	def btc_get_new_address():
		name = flask.request.json["name"]
		app.logger.debug("creating new addr for \"%s\"", str(name))
		return json.dumps({ "addr": s.getnewaddress(name) }, indent=2)

	@app.route('/btc/<command>')
	@auth.required(app)
	def btc_generic_command(command):
		txt = json.dumps(s.__getattr__(command)(), indent=2)
		if "application/json" not in flask.request.headers.get("Accept", []):
			txt = escapeHTML(txt, escapeNL=False)
			txt = "<pre>" + txt + "</pre>"
		return txt

	# app.run(ssl_context=(cert_file, pkey_file))
	# app.run(ssl_context='adhoc')
	app.run(threaded=True)
