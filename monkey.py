def engage():
	"""
		Ugly monkey patching because bitcoind indicates error conditions such as
		insufficient funds by raising HTTP status 500. xmlrpclib, which is used by
		jsonrpclib as the transport, then interprets that as "something went wrong with
		the communication" and aborts.
	"""
	import xmlrpclib
	def single_request_tolerant(self, host, handler, request_body, verbose=0):
		h = self.make_connection(host)
		if verbose:
			h.set_debuglevel(1)

		try:
			self.send_request(h, handler, request_body)
			self.send_host(h, host)
			self.send_user_agent(h)
			self.send_content(h, request_body)
			r = h.getresponse(buffering=True)
			if r.status in [200, 500]:
				self.verbose = verbose
				return self.parse_response(r)
		except xmlrpclib.Fault:
			raise
		except Exception:
			self.close()
			raise

		if r.getheader("content-length", 0):
			r.read()
		raise xmlrpclib.ProtocolError(
				host + handler,
				r.status, r.reason, r.msg,)
	xmlrpclib.Transport.single_request = single_request_tolerant
