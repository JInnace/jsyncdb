

from werkzeug import _reloader
p=print

import typing as t
import threading

import sys
import os
import importlib
import traceback


custom_rld_substr = "rld"
custom_rld_list = []
mscope={
	"ReloaderLoop_trigger_reload": _reloader.ReloaderLoop.trigger_reload,
	"WatchdogReloaderLoop_trigger_reload": _reloader.WatchdogReloaderLoop.trigger_reload,
}

def reset_mtime(reloader,file_path):
		old_time = reloader.mtimes.get(file_path)
		mtime = os.stat(file_path).st_mtime
		reloader.mtimes[file_path]=mtime

		return {
			"old_time":old_time,
			"new_time":mtime,
		}


def search_for_mod_by_path(file_path):
	# for module in list(sys.modules.values()):
	for mod_name,module in list(sys.modules.items()):
		mod_path = getattr(module, "__file__", None) 
		if file_path == mod_path:
			return module
		# if not module:
			# p("iojdwoqjdqoidjqwoidj")
		# if not name:
			# p(mod_name,module,type(module))
		# p("~",name)




def path_match_rld_mod(file_path):
	if file_path is None:
		return file_path
	return file_path in custom_rld_list or custom_rld_substr in file_path
def maybe_custom_reload(reloader,file_path):

	# if file_path in custom_rld_list or custom_rld_substr in file_path:
	if path_match_rld_mod(file_path):

		# p(dir(reloader))
		st= reset_mtime(reloader,file_path)
		mod = search_for_mod_by_path(file_path)

		#TODO: this is the important part refactor out later
		if mod:
			# gmod.before_mod_rld(mod)
			# reimp = importlib.reload(mod)
			try:
				pass
				reimp = importlib.reload(mod)
			except Exception as E:
				p("EXC@@@@@@@@@@@@")
				print(traceback.format_exc())

		else:
			reimp="~~"
			p("module not found with path:",file_path)
		# importlib.reload(None)
		# module==type(sys.modules["rld_m1"])
		# p(type(sys.modules["rld_m1"]),)

		# p("maybe_custom_reload!!!",st,reimp)
		return 1
		

	r'''
	try:
		cnt=0
		while gmod.glob["on_before_app_reload"]:
			gmod.glob["on_before_app_reload"].pop()()
			print("BEFORE RELOAD,,",cnt,OKBLUE3,"###################################################################",ENDC)
		pass
	except Exception as E:
		print("I WOULD PANIC BUT PANIC HAS NOT BEEN IMPLIMENTED",E)

	pass
	# '''



def t_rld1(self,file_path,*args,**kwargs):
	# p("extra_files",args[0].extra_files)

	p("t_rld1",self,file_path,args,kwargs)
	p("```````````````````````````````````````")
	p()
	# if (file_path == r"C:\ws\repos\flask_apps\flask_example\rld_m2.py"):
		# p("~~~%%%%%%%%%%%%%%%%%%%%%%5")
		# return


	if maybe_custom_reload(self,file_path):
		pass
	else:
		# gmod.before_wsgi_rld("will rld")
		p("...................")
		mscope["ReloaderLoop_trigger_reload"](self,file_path,*args,**kwargs)
		p("...................>")
	# p("exclude_patterns",args[0].exclude_patterns)


	
def t_rld2(*args,**kwargs):
	p("t_rld2",args,kwargs)
	mscope["WatchdogReloaderLoop_trigger_reload"](*args,**kwargs)

_reloader.ReloaderLoop.trigger_reload = t_rld1
_reloader.WatchdogReloaderLoop.trigger_reload = t_rld2


def run_with_reloader2(
	main_func: t.Callable[[], None],
	extra_files: t.Iterable[str] | None = None,
	exclude_patterns: t.Iterable[str] | None = None,
	interval: int | float = 1,
	reloader_type: str = "auto",
) -> None:
	"""Run the given function in an independent Python interpreter."""
	import signal
	import os
	print("")
	print("")
	print("")
	print("")
	print("run_with_reloader2!")
	print("RLDI",main_func,extra_files,exclude_patterns,interval,reloader_type)

	signal.signal(signal.SIGTERM, lambda *args: sys.exit(0))
	reloader = _reloader.reloader_loops[reloader_type](
		extra_files=extra_files, exclude_patterns=exclude_patterns, interval=interval
	)
	mscope["reloader"]=reloader

	try:
		if os.environ.get("WERKZEUG_RUN_MAIN") == "true":
			_reloader.ensure_echo_on()
			t = threading.Thread(target=main_func, args=())
			t.daemon = True

			# Enter the reloader to set up initial state, then start
			# the app thread and reloader update loop.
			with reloader:
				t.start()
				reloader.run()
		else:
			# gmod.before_wsgi_rld("restart_with_reloader")
			sys.exit(reloader.restart_with_reloader())
	except KeyboardInterrupt:
		# gmod.before_wsgi_rld("um actually exiting")
		pass


_reloader.run_with_reloader = run_with_reloader2