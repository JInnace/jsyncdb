import gmod
p=print


# should this really be a class
# class Eobj:pass


gx = gmod.gx
import json

from simple_websocket import Server
from simple_websocket.ws import Base

import base64

OKBLUE = '\033[94m'
ENDC = '\033[0m'

import inspect

def ws_disconn(sock,*a,**kw):
	gx.dicard_on_close(sock)
	ending = json.dumps({
			"type":"jm_tmp_dev_sto_rec","from":"self.channel_name",
			"CLIENT_KEY":"ws_sto",
			"sto_event_type": "user_disconnected",
			"group_name":sock.slf["channel_name"],
			"from????":sock.slf["channel_name"],
			# "group_name":"self.group_name",
			"channel_name":sock.slf["channel_name"],

			})

	p("ending:::::::::::::::::::::::::")
	p(ending)


	# gx.send_to_channel("all_groups",ending,"SENED")
	gx.send_to_channel(sock.slf["group_name"],ending,"SENED")

		# await self.channel_layer.group_send(self.group_name,)

	# sock.send(json.dumps({"type":"jm_tmp_dev_sto_rec","from":"self.channel_name",
	# gx.send_to_channel("all_groups",json.dumps({"type":"jm_tmp_dev_sto_rec","from":"self.channel_name",
	# 		"CLIENT_KEY":"ws_sto",
	# 		"sto_event_type": "user_disconnected",
	# 		"group_name":"self.group_name",
	# 		"channel_name":"self.channel_name",

	# 		}),"sender")

	# p("DISCONNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN",a,kw)
	

	pass




def ws_conn(sock,*a,**kw):

	# return

	sock.slf = {}
	sock.slf["channel_id"] = hash(sock)
	sock.slf["channel_name"] = str(sock.slf["channel_id"])
	sock.slf["group_name"] =  gx.parse_qs(sock.environ["QUERY_STRING"]).get("room","NO_ROOM")

	gmod.glob["all_ws_conn"].add(sock)
	
	# gx.parse_qs

	gx.add_to_channel(sock,"all_groups")
	old_group_size = gx.add_to_channel(sock,sock.slf["group_name"])

	p(OKBLUE,"ws_conn",a,kw,ENDC)
	# return
	sock_info(sock)
	# my_int = sock.slf["channel_id"]


	# p(struct.pack("<i",my_int))
	# p(base64.b64encode(bytes(str(sock.slf["channel_id"]),"ascii")))
	# p(sock.slf["channel_id"].to_bytes(8,"big"))
	# p(base64.b64encode(bytes(sock.slf["channel_id"])))
	# p(base64.b64encode((sock.slf["channel_id"]).to_bytes(1)))
	p(sock.slf)
	p()
	p()



	sock.send(json.dumps({
		"CLIENT_KEY":"ws_sto",
		"sto_event_type": "connection_info",
		"channel_name":sock.slf["channel_name"],
		"group_name":"group_name",
		"z":"z",
	}))


	# r'''
	sock.send(json.dumps(
		{
		"CLIENT_KEY": "ws_sto",
		"group_count": old_group_size+1,
		"sto_event_type": "group_count",
		# "ws_conn":"???",


		}))
	# '''
	# r'''

	# '''
# _check_sendfile_params
# OKBLUE = '\033[94m'
# ENDC = '\033[0m'
c2 =  '\033[34m'
c1 =  '\033[32m'
def oinfo(o):
	p(o)

	for en in dir(o):
		if en[:2]=="__":continue
		attr=getattr(o,en,"NO ATTR")
		p((en + "\t").expandtabs(21),c1,type(attr),"'\033[0m'")
		# p(en)
	p()
def sock_info(sock):
	p('\033[31m',"sock_info",ENDC)
	p("[[")
	oinfo(sock)
	oinfo(sock.sock)
	p("]]")
	p(sock.environ)
	for k,v in sock.environ.items():
		p(k)
		# p(c2,k,ENDC)
		p(c2,v,ENDC)
		# p(v)
	p(sock.environ["QUERY_STRING"])
	p(gx.parse_qs(sock.environ["QUERY_STRING"]).get("room","NO_ROOM"))
	p(type(sock),"....")

	for en in dir(sock):

		# p(en)
		# p("\033[36m",type(attr),ENDC,sep="")
		attr=getattr(sock,en,"NO ATTR")
		sock.sock.__class__

		# p()

	# p("WS.",inspect.getfile(sock.ws.__class__))
	# p("SOCK.",inspect.getfile(sock.sock.__class__))
	# p("SOCK.",inspect.getfile(sock.sock.send))

def handle_msg(sock,txt_msg,*a,**kw):
	# [a,kw]
	# p(":::::",sock.environ)
	# p("handle_msg!!!!!!!!!!!!!!!!!!",sock,txt_msg)
	# sock_info(sock)
	# gx.send_to_channel("all_groups",txt_msg,"sender")
	try:
		data = json.loads(txt_msg)
		# gx.send_to_channel("all_groups",txt_msg,"sender")
		# gx.group_jsend("",data,sock)


		gx.group_jsend(sock.slf["group_name"],data,sock)
		# gx.send_to_channel(sock.slf["group_name"],txt_msg,"sender")
		


		# p("J",type(data),data)
	except Exception as Err:
		p("handle_msg ERR:",Err)





# def _custom_close(*a,**kw):
def _custom_close(self,reason=None, message=None):
	p("_custom_close",reason,message)
	if True:
		gx.ws_disconn(self,reason=reason, message=message)
		Base.close(self,reason=reason, message=message)
	# try:
	# except Exception as E:
		# p("_custom_close EXCEPTION!",E)

	# p(Base.close)
	# p(super().close(*a,**kw))
# Base.close("self",reason="reason?", message="..message")
Server.close =_custom_close




def msgtest():
	p("msgtest")
	p(len(gmod.glob["all_ws_conn"]))
	for en in gmod.glob["all_ws_conn"]:
		p(en)
		# en.close()
		p(en.sock)
		for en2 in dir(en.sock):pass
			# p(en2)
			# en.send("::CLOSE::")
		en.send("::CLOSE::")

		# p(inspect.getsource(en.sock.close))
		# p(inspect.getfile(en.sock.close))

		# en.sock.close()
		# en.connected =0



msgtest()

gmod.gx.ws_disconn = ws_disconn
gmod.gx.ws_conn = ws_conn
gmod.gx.handle_msg = handle_msg


# _group_msg("ZZZ",1,2,3,4,5,6)

# msg="q"