from flask import Flask, render_template
from flask_sock import Sock
import flask
import hot_reload_mod_i2
import gmod

# app = Flask(__name__)
app = Flask(__name__,template_folder = r"../js_client")


sock = Sock(app)




gmod.glob["sock"] = sock
gmod.glob["app"] = app

class Eobj():
	pass

eobj = Eobj()
gmod.gx =eobj

import rld_m0
import rld_m1
import rld_m2
import rld_m3
# import rld_m4
# import rld_m5

p=print


@app.route('/')
def index():
	print("::::::::::::::;")
	# return render_template('jsyncdb_index_v5.html')
	return render_template('index.html')

# r'''
@app.route('/shared_libs/<path:path>')
def send_report2(path):
	return flask.send_file('templates/jquery-3.5.1.min.js')

@app.route('/<path:path>')
def send_report(path):
	return flask.send_from_directory('templates', path)
	# return flask.send_from_directory('./', path)
# '''


@sock.route('/echo')
def echo(sock):
	while True:
		data = sock.receive()
		sock.send(data)



# @sock.route('/echo_c1')
# def echo_coll(sock):
# 	p("echo_coll app")
# 	while True:
# 		data = sock.receive()
# 		sock.send(data)





# @sock.route('/<path:path>')
# def echo23(sock,*a,**kw):
#	 p("E2",a,kw)
#	 while True:
#		 data = sock.receive()
#		 sock.send(data)
#		 for en in dir(sock):
#			 p(en)
# p("echo23",echo23)


# p("~83293298383838383")
r'''
for en in dir(sock):
	print(".",en)

for en in dir(app):
	print("~",en)
'''



import inspect
print("APP_ORIG",sock.route)
print("APP_ORIG",app.route)
print("APP_ORIG",inspect.getfile(app.route))
print("APP_ORIG",app.url_map)
if __name__ == '__main__':
	pass
	# socketio.run(app, debug=True)
	app.run(debug=True,host='0.0.0.0')
	# sock.run(app,host='0.0.0.0', debug=True,allow_unsafe_werkzeug=True)



