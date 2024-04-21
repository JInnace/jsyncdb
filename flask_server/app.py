from flask import Flask, render_template
from flask_sock import Sock
import flask
import hot_reload_mod_i2
import gmod

import os

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
	return render_template('jsyncdb_index_v5.html')
	return render_template('index.html')

# r'''
@app.route('/shared_libs/<path:path>')
def send_report2(path):
	p("?????")
	# p("?????")
	return flask.send_file('../js_client/jquery-3.5.1.min.js')

@app.route('/viewsrc2/<path:path>')
def view_src2(path):
	p(">>>>>>>>>>>>>>>>>>>>????????",path)
	# return flask.send_from_directory('templates', path)
	# open()

	with open(r"../js_client/" + path, "r") as file:
		ftxt = file.read()
		# r["is_template"] = is_template_ftxt(ftxt)

	# ret= flask.send_from_directory(r"../js_client", path)
	# p("view_src",type(ret),ret)

	return "<plaintext>" + ftxt + "</plaintext>"
	return "<xmp>" + ftxt + "</xmp>"
	return "<code>" + ftxt + "</code>"
	return "<pre><code>" + ftxt + "</code></pre>"



@app.route('/<path:path>')
def send_report(path):
	p("????,...",path)
	# return flask.send_from_directory('templates', path)
	return flask.send_from_directory(r"../js_client", path)
	return flask.send_from_directory('./', path)
# '''

@app.route('/viewsrc/<path:path>')
def view_src(path):
	p(">>>>>>>>>>>>>>>>>>>>????????")
	# return flask.send_from_directory('templates', path)
	ret= flask.send_from_directory(r"../js_client", path)
	p("view_src",ret)
	return ret



@sock.route('/echo')
def echo(sock):
	while True:
		data = sock.receive()
		sock.send(data)


@sock.route('/echo_all')
def echo_all(sock):
	gmod.gx.add_to_channel(sock,"echo_all")
	# send_to_channel("echo_all",msg,"sender")
	while True:
		data = sock.receive()
		# ws.send(data)
		gmod.gx.send_to_channel("echo_all",data,"sender")



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

p(inspect.getsource(app.route))




# generated by bing seems to work
@app.route("/ldir")
def list_directory():
	# Get the list of files and directories
	# items = os.listdir(DIRECTORY_PATH)
	items = os.listdir("../js_client")

	# Filter out hidden files and directories
	items = [item for item in items if not item.startswith(".")]

	# Create an HTML string with the list of items as links
	html_content = "<h1>Contents of the Directory</h1><ul>"
	html_links = ""
	html_src_links = ""
	other_links = ""
	for item in items:
		p([item])
		if "html" in item:
			html_src_links += f"<li><a href='viewsrc2/{item}'>src:{item}</a></li>"
			html_links += f"<li><a href='{item}'>{item}</a></li>"
		else:
			other_links += f"<li><a href='{item}'>{item}</a></li>"
		# link = (request.path + '/' if request.path != '/' else '') + item
	html_content+=html_links
	html_content+="<br>"
	html_content+=other_links
	html_content+="<br>"
	html_content+="VIEW SRC: its actually < pre >"
	html_content+="<br>"
	html_content+="<br>"
	html_content+=html_src_links
	html_content += "</ul>"

	# Return the HTML content directly
	return html_content
# end generated by bing









import inspect
print("APP_ORIG",sock.route)
print("APP_ORIG",app.route)
print("APP_ORIG",inspect.getfile(app.route))
print("APP_ORIG",app.url_map)
if __name__ == '__main__':
	pass
	# socketio.run(app, debug=True)
	# app.run(debug=True,host='0.0.0.0')
	# app.run(debug=True,host='0.0.0.0',port="5001")
	app.run(debug=True,host='0.0.0.0',port="5000")
	# sock.run(app,host='0.0.0.0', debug=True,allow_unsafe_werkzeug=True)



