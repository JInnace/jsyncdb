

import gmod

import inspect
import flask.sansio.scaffold

print(",,,")

p=print

sock = gmod.glob["sock"] 
app = gmod.glob["app"] 

# if not "" in gmod.glob

OKBLUE = '\033[94m'
ENDC = '\033[0m'

gx = gmod.gx

def um_info(o):
	p()
	# return
	for en in dir(o):
		# if "url" not in en:continue
		attr = getattr(o,en,"NO ATTR")
		p(OKBLUE,en,ENDC)
		p(attr)
	p()
	# for r in app.url_map.iter_rules:
		# p(:)
	# for en in o:
		# p(en)

def what(*a,**kw):
	p("WHAT",a,kw)

def what2(*a,**kw):
	p("WHAT2",a,kw)

def route_or_replace_v0(*a,**kw):
	o ={
	"rld":0
	}
	p("QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ.")
	def dec(fn):
		p("QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ")
		p(fn.__name__,fn)
		p(inspect.getsource(fn))
		# if app._got_first_request or fn.__name__ in app.view_functions:
		if fn.__name__ in app.view_functions:
			o["rld"]=1
			# if started and not app.view_functions no real change??
			p("...fr 0",fn,a,kw)

			# app.view_functions[fn.__name__] = fn
			app.view_functions[fn.__name__] = flask.sansio.scaffold.setupmethod(what2)
			return fn
		else:
			return sock.route(*a,**kw)(fn)
			pass
	if o["rld"]:
		return what
	else:
		return dec

# def 





def route_or_replace(path,*a,**kw):
	o = {"rld":0}
	def dec(fn):
		if fn.__name__ in app.view_functions:
			o["rld"]=1
			p("RLD!!!")
		else:
			return sock.route(path,*a,**kw)(fn)
	p("route_or_replace",o,path,a,kw)
	if o["rld"]:
		return what
	else:
		return dec




def sinfo(o):
	for en in dir(o):
		attr = getattr(o,en,"NO ATTR")
		p(OKBLUE,en,ENDC)
		# p("\033[48;5;57m",en,ENDC)
		# p("\033[36m",en,ENDC)
		p(attr)		
		# p(en)

def oinfo(o,n="!"):
	for en in dir(o):
		attr = getattr(o,en,"NO ATTR")
		p('\033[33m',en,ENDC,sep='')
		p(attr)		
		# p(en)
# @sock.route('/echo_c1')


def gmod_once():
	if not app._got_first_request:
		gmod.glob["all_ws_conn"] = set()
		gmod.glob["groups"] = {}

gmod_once()

p()


p("app._got_first_request",app._got_first_request)


# um_info(app)

# p(app.view_functions)



def echo_coll(sock,*a,**kw):
	p("echo_coll m7",sock,sock.connected,a,kw)
	gmod.gx.ws_conn(sock,*a,**kw)
	# sinfo(sock.sock)
	# gmod.glob["all_ws_conn"].add(sock)
	# gx.add_to_channel(sock,"N1")
	# gx.add_to_channel(sock,"N4")
	# gmod.glob["all_ws_conn"].add(sock)
	# p(type(sock))

	# p(inspect.getsource(sock.accept))
	# p(inspect.getsource(sock.sock.send))
	# p(inspect.getsource(sock.sock.__class__))
	# p(inspect.getfile(sock.sock.__class__))
	# p(sock.sock.send)
	# oinfo(sock.sock)
	while True:
		data = sock.receive()
		gx.handle_msg(sock,data,z=[a,kw])
		# p(inspect.getfile(sock.__class__),data)
		# p(":",inspect.getfile(sock.receive),data)
		if data == "throw_err":
			p("throwing_err")
			raise data
		elif data == "s2":
			p("::::s2...")
			# cls_abc.abc123()
		sock.send(data)
	p("ENDIIII")


app.config['SOCK_SERVER_OPTIONS'] = {'ping_interval': 10}
# r'''
@route_or_replace('/echo_c1')
def _echo_coll(*a,**kw):
	# p("_echo_coll")
	return echo_coll(*a,**kw)
	# p("echo_coll m1")
	# while True:
	# 	data = sock.receive()
	# 	sock.send(data)

# '''
for en,fn in app.view_functions.items():
	p(en,"\n\t.",fn)



r'''

# def echo234(*a,**kw):
# @route_or_replace('/<path:path>')



@sock.route('/<path:path>')
def echo234(sock,*a,**kw):
	p("E2.2sa2............................",a,kw)
	# return
	while True:
		data = sock.receive()
		sock.send(data)
		for en in dir(sock):
			p(en)

gmod.glob["echo234"]  = app.view_functions["echo234"]
# '''




r'''
def echo2345(*a,**kw):
	try:
		p("zzz",__class__)
	except Exception as E:
		p(":",E)
	p("E2.2sa2...........................?",sock,a,kw)
	# return
	while True:
		data = sock.receive()
		sock.send(data)
		for en in dir(sock):
			p(en)


# p(gmod.glob["echo234"])
p("***********************************************************")
p(inspect.getsource(app.view_functions["echo234"]))
p("***********************************************************..............")

# app.view_functions["echo234"] = gmod.glob["echo234"]
app.view_functions["echo234"] = echo2345
# '''

# p(inspect.getsource(echo234))
# p(echo234)


# um_info(app.url_map)
# p(app.url_map)
# p(app.url_map.iter_rules)
