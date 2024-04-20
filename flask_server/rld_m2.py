

import gmod

import inspect
import flask.sansio.scaffold

import threading
import base64

print(",,,")

p=print

sock = gmod.glob["sock"] 
app = gmod.glob["app"] 


def um_info(o):
	p()
	# return
	for en in dir(o):
		# if "url" not in en:continue
		p(en)
	p()
	# for en in o:
		# p(en)

r'''
@sock.route('/<path:path>')
def echo2345(sock,*a,**kw):
	p("E2..",a,kw)
	while True:
		data = sock.receive()
		sock.send(data)
		for en in dir(sock):
			p(en)
# '''
import json
def group_jsend(group,o,sender):
	# if type(sender=="")
		# sock.slf["channel_id"]
	slf = getattr(sender,"slf",None)
	_from = "IDK"
	if slf:
		_from= slf["channel_name"]
	# _from = "IDK"
	# slf["group"]
	o["from"]=_from
	p("SLF:",slf,sender)
	msg = json.dumps(o)
	send_to_channel(group,msg,sender)

def send_to_channel(name,message,sender):
	group = gmod.glob["groups"].get(name,set())

	for en in group:
		pass
		p("....",en._srv_rec)
		# en._group_send(name,message)
		# en._srv_rec(name,message)
		en._srv_rec([name,message,sender])
		# en.(name,message)




def add_to_channel(sock,name):
	pass
	gmod.glob["groups"].setdefault(name,set())
	group = gmod.glob["groups"].get(name)
	old_group_size = len(group)
	group.add(sock)
	return old_group_size

	# gmod.glob["groups"].setdefault

def dicard_on_close(sock):
	gmod.glob["all_ws_conn"].discard(sock)
	for name,group in gmod.glob["groups"].items():
		group.discard(sock)
def discard_closed():
	cnt = 0
	doomed = []
	p("~~~~~~~~~~~~~~~~~~~~~~~~~~")
	p(gmod.glob["all_ws_conn"])
	for en in gmod.glob["all_ws_conn"]:
		cnt +=1
		if not en.connected:
			# doomed.append(en)
			doomed += (en,)
		p(en,cnt,en.connected)
		# gmod.glob["all_ws_conn"].discard(en)
	gmod.glob["all_ws_conn"].difference_update(doomed)
	doomed_groups = []
	groups = gmod.glob["groups"]
	for name,group in groups.items():
		group.difference_update(doomed)
		if not len(group):
			doomed_groups.append(name)
	for name in doomed_groups:
		print("EMPTY:",name)
		del groups[name]

	p(doomed)
def runinfo():
	# gmod.glob["groups"]={}
	
	# p("..",gmod.glob["groups"])

	# return
	# p("Q",gmod.glob["groups"])
	for name,group in gmod.glob["groups"].items():
		p(name,":::",len(group))
	if app._got_first_request:
		p(len(gmod.glob["all_ws_conn"]))
		for en in gmod.glob["all_ws_conn"]:
			p(en,en.connected)
			p(hash(1),hash(2),hash(en))
		# for e2 in dir(en):
			# p(e2)
		discard_closed()

# empty str if no =
# overwrites for multiple vals
def parse_qs(s):
	o={}
	for param in s.split("&"):
		kv = (*param.split("=",1),"")
		o[kv[0]]=kv[1]
	return o

try:
	runinfo()
except Exception as E:
	p("ERR:",E)

class cls_abc:
	def abc123(*a,**kw):
		p("abc123",a,kw)

gmod.gx.group_jsend = group_jsend
gmod.gx.send_to_channel = send_to_channel
gmod.gx.add_to_channel = add_to_channel
gmod.gx.dicard_on_close = dicard_on_close
gmod.gx.discard_closed = discard_closed
gmod.gx.parse_qs = parse_qs



# class flask_channels


cnt=0
for thread in threading.enumerate(): 
	print(cnt,thread.name)
	cnt+=1
