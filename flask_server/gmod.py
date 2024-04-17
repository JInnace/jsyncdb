# import gmod2


print("===========================================================================================================================================")


OKBLUE = '\033[94m'
ENDC = '\033[0m'

# print("GLOBA_REINIT" ,OKBLUE,"###################################################################",ENDC)

glob = {}
dbg_glob = {}





glob["WSGI_RLD_HANDLERS"] = []
def before_mod_rld(mod,*a,**kw):
	h = getattr(mod,"MOD_RLD_HANDLERS",None)
	print("before_mod_rld:",mod,h)
	cnt=0
	while h:
		fn=h.pop()
		print(cnt)
		cnt+=1

		fn()

def reg_mod_rld_handler(mod,fn,*a,**kw):
	h = getattr(mod,"MOD_RLD_HANDLERS",None)
	if h is None:
		mod.MOD_RLD_HANDLERS = []
		h= mod.MOD_RLD_HANDLERS
	h.append(fn)
	print("reg_mod_rld_handler:",h,mod)



def unreg_rld_handler(fn,*a,**kw):
	if fn in glob["WSGI_RLD_HANDLERS"]:
		print("unreg_rld_handler",fn)
		glob["WSGI_RLD_HANDLERS"].remove(fn)
	else:
		print("unreg_rld_handler~~~",fn)
		# print()


def reg_rld_handler(fn,*a,**kw):
	glob["WSGI_RLD_HANDLERS"].append(fn)
def before_wsgi_rld(s=""):
	print("before_wsgi_rld:",s)
	cnt=0
	while glob["WSGI_RLD_HANDLERS"]:
		fn=glob["WSGI_RLD_HANDLERS"].pop()
		print(cnt)
		cnt+=1

		fn()






# or should we do import
# is this better or the worst way we shall find out
def W():
	return glob








