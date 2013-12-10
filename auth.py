from functools import wraps
import flask

def check_auth(username, password):
	return username == "gbe" and password == "secret"

def authenticate():
	""" Send 401 to enable basic auth """
	return flask.Response(
			'Not authorized.', 401,
			{ 'WWW-Authenticate': 'Basic realm="Login Required"' })

def required(app):
	def rv(f):
		@wraps(f)
		def decorated(*args, **kwargs):
			auth = flask.request.authorization
			if not auth or not check_auth(auth.username, auth.password):
				return authenticate()
			# app.logger.debug('authenticated %s', auth.username)
			return f(*args, **kwargs)
		return decorated
	return rv
