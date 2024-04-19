

# intentions
# ::pseudo code::
# get file names

# open & parse
# check if template; if output should I stop for some random reason

# for templates get input files
# run and save


import chevron
import os
from os.path import isfile,islink,isdir
p=print

class Eobj:pass

C = Eobj
C.isTemplateStr = '{{{"makestache_template"}}}'
C.isTemplateStr2 = 'THIS_FILE_IS_A_MAKESTACHE_TEMPLATE'
C.isNotTemplateStr =  'this_file_is_not_a_makestache_template'

# this string prolly shouldn't appear in any files you wouldn't want to actually overwrite
C.ALLOW_TEMPLATE_OVERWRITE =  "BUILT_FILE_" + "OVERWRITE_ALLOWED"






# output_filename # mustache_var


p("MAKE.PY")
p("MAKESTACHE")

def wfile(file_name,out):
	f = open(file_name,"w")
	f.write(out)
	f.close()
def rfile(file_name):
	f = open(file_name,"r")
	ftxt = f.read()
	f.close()
	return ftxt


# TODO:rename this class
class JsObj(dict):
	pass
	def __init__(self,*a,**kw):
		super().__init__(*a,**kw)
		self._template_paths = []
	def _maybe_path(self,name, *a,**kw):
		# p("_maybe_path",name)
		if "*" in name:
			if name not in self._template_paths:
				p("possible dependency",name)
				self._template_paths.append(name)
	def __getattr__(self, name):
		# p(">>>>",name,self)
		return self.__getitem__(name)
	def __getitem__(self, name):
		self._maybe_path(name)
		# p("__getitem__","*" in name,name)
		ret = super().__getitem__(name)
		return ret
	def __setattr__(self, name, val):
		return self.__setitem__(name, val)
	def __delattr__(self, name):
		return self.__delitem__(name)



# yeah yeah I know where reading the same junk
def is_template_file(file_name):
	r={
	"is_template":0
	}
	ftxt = ""
	try:
		# ftxt = rfile(file_name)
		# with open(file_path, "r") as file:
		with open(file_name, "r") as file:
			ftxt = file.read()
			r["is_template"] = is_template_ftxt(ftxt)
	except Exception as excp:
		p("\t\\t\tFILE ERR:::",file_name)
		p("")

	# p("LRN",len(ftxt))
	return r



def is_template_ftxt(ftxt):
	ret = 0
	if C.isTemplateStr in ftxt or C.isTemplateStr2 in ftxt:
		ret =1
	if C.isNotTemplateStr in ftxt:
		ret = 0
	return ret



# this should be called render or somthing
def parse(ftxt):
	p("PARSE")
	# o={}
	_o={
	}


	o=JsObj(_o)
	out = chevron.render(ftxt,o)
	# p(out)
	p("o.idk?")
	p("~",o._template_paths,"~")
	mdict = get_calculated_templates(o._template_paths)
	o2 = {**o,**mdict["file_stache_dict"],
	"output_filename":mdict["outfile"]["path"],
	}
	out2 = chevron.render(ftxt,o2)
	if C.isTemplateStr in ftxt:
		p("IS A TEMPLATE!!!!!!!!!!!!!!!!!!!")
	else:
		p("IS NOT A TEMPLATE!!!!!!!!!!!!!!!!!!!")
		p("THE WE WILL NOT write")
		return ""

	os.chdir(tglob["OUT_DIR"])

	# dbg_out
	# wfile("mgen1.js",out)
	# wfile("mgen2.js",out2)
	p()
	if mdict["output_ok"]:
		p(mdict["outfile"]["_path"])
		p("WRITING TO:",mdict["outfile"]["path"])
		wfile(mdict["outfile"]["path"],out2)
		p("FILE WRITTEN")
	else:
		p("BUILD_NOT FINALIZED")



def get_calculated_templates(arr):
	# we assume we're in the right dir and don't worry about anything
	ret = {}
	file_deps = {}
	for en in arr:
		file_content_path = en.replace("@*","",1)
		file_content_path = file_content_path.replace("*",".")
		file_deps[en] = {
		"path":file_content_path,
		"content":":::__BAD_PATH__::: does the show go on?",
		}


	# now we get our paths
	file_stache_dict = {}
	for var_name,file_data in file_deps.items():
		if ">" in var_name:continue
		ftxt = rfile(file_data["path"])
		file_stache_dict[var_name]=ftxt
		# file_deps[var_name]["content"]=ftxt


	# get_out_put_path and set output_ok key
	for en in (_en for _en in file_deps if (">" in _en or 0)):
		v = file_deps[en]
		ret["outfile"]= {
		"_path":v["path"].split(">")[-1],
		}


	os.chdir(tglob["OUT_DIR"]) 
	ret["output_ok"]=None
	current_output_contents=None


	assert ret["outfile"]["_path"][0] not in r"\/" , "\033[36m \n\twe won't allow absolute paths that easily\033[0m"
	full_path = os.path.abspath(ret["outfile"]["_path"])
	ret["outfile"]["path"] = full_path
	if os.path.isfile(ret["outfile"]["path"]):
		current_output_contents = rfile(ret["outfile"]["path"])
		if C.ALLOW_TEMPLATE_OVERWRITE in current_output_contents:
			ret["output_ok"]="ALLOW_TEMPLATE_OVERWRITE"
		else:
			ret["output_ok"]= False

	else:
		ret["output_ok"]=1
	p("current_output_ EXIST?",bool(current_output_contents))
	p(":ALLOW_TEMPLATE_OVERWRITE??",ret["output_ok"])


	return {
	"file_deps":file_deps,
	"file_stache_dict":file_stache_dict,
	**ret
	}

def parse_possible_template(fn):
	ftxt = rfile(fn)
	parse(ftxt)



def dev_main():
	p("DEV_MAIN")

	os.chdir(tglob["IN_DIR"])  

	# for en in os.walk(r"C:\ws\repos\script_utils\makestache"):
	# for en in os.listdir(r"C:\ws\repos\script_utils\makestache"):

	# for now lets skip links you're not really safe im not checking of thinking about junctions or whatever


	o = {}
	p("checking files...")
	# for en in os.scandir(r"C:\ws\repos\script_utils\makestache"):
	for en in os.scandir():
		if isfile(en):
			o[en] = is_template_file(en)
			# p([en],isfile(en))
			# p(en.name,en.path)
			if (o[en]["is_template"]):
				p(":",en.path,"TEMPLATE")
			else:
				p(en.path)
			# p(en.path,"is_template:",bool(o[en]["is_template"]))
			r'''
			for en2 in dir(en):
				if en2[:2]=="__":
					continue
				p(en2)
			return
			# '''

	p("parse_possible_template")
	p()
	for k,v in o.items():
		if not v["is_template"]:continue
		p(k)
		p(v)
		p()
		parse_possible_template(k)
# this will prolly be a pain later
tglob = {
	# "file_cache":{}
}
tglob["OUT_DIR"] = r"C:\ws\repos\script_utils\makestache\test_out"
tglob["IN_DIR"] = r"C:\ws\repos\script_utils\makestache\test_src"
tglob["OUT_DIR"] = r"C:\ws\repos\script_utils\makestache\test_src"

tglob["IN_DIR"]  = os.path.abspath(r"./js_client")
tglob["OUT_DIR"] = os.path.abspath(r"./js_client")


orig_dir = os.getcwd()


dev_main()
os.chdir(orig_dir)

# this should exist only on the authors computer (it copies make.py to here so i can run make.py twice and get any file changes)
if os.path.isfile("udep.bat"):
	os.system("udep.bat")

