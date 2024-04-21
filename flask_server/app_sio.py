from flask import Flask, render_template
from flask_socketio import SocketIO

import flask

app = Flask(__name__,template_folder = r"../js_client")
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

p=print

@app.route('/')
def index():
    print("INDEX")
    return render_template('index.html')

@app.route('/f1/<path:path>')
def r2(path):
    p("????,...",path)
    return flask.send_file(r"../js_client/"+ path)
    return flask.send_file(r"../js_client", path)
    return flask.send_file('../js_client/jquery-3.5.1.min.js')
    # return flask.send_from_directory('templates', path)
    return flask.send_from_directory('./', path)


@app.route('/<path:path>')
def r1(path):
    p("????,aaaa,...",path)
    return flask.send_from_directory(r"../js_client", path)
    return flask.send_file('../js_client/jquery-3.5.1.min.js')
    # return flask.send_from_directory('templates', path)
    return flask.send_from_directory('./', path)


@socketio.on('message')
def handle_message(data):
	print('received message: ' + data)


@socketio.on('json')
def handle_json(json):
	print('received json: ' + str(json))




if __name__ == '__main__':
    socketio.run(app,debug=True,host='0.0.0.0')

