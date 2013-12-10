Bitweb
======

Bitweb is a work in progress web frontend for the `bitcoind` bitcoin command line client. This is very much WIP, so don't run it on your main bitcoin installation with 1000 BTC in your `wallet.dat`!

Requirements
------------

* python 2.7
* py-jsonrpclib
* flask

Setup
-----

Start bitcoind with `bitcoind -daemon`, then run `python bitweb.py`. Once the web server is running, point your browser to `http://localhost:5000`. The user name is `gbe`, the password is `secret`. As you can see, WIP. Transferring money does not work yet, but you can get all sorts of information from bitcoind.

Acknowledgements
----------------

The fancy CSS is due to [http://getbootstrap.com](Twitter Bootstrap).
