
from simple_websocket import Server
from simple_websocket.ws import Base


p=print



def _srv_rec(self,msg,*a,**kw):
	# print("QQQQQQQQQQQQQQQQQQQQQQQQQKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK")
	# p("_srv_rec","FROM_GROUPFROM_GROUPFROM_GROUPFROM_GROUP",self.connected,a,kw)
	# p("_srv_rec","FROM_GROUPFROM_GROUPFROM_GROUPFROM_GROUP",self.connected,msg)
	# self.send("FROM_GROUP")
	self.send(msg[1])



Server._srv_rec =_srv_rec