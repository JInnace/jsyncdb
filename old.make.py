import chevron



files={
"jsync_dep"  : "jsync_dep.js",
"jsync_ord"  : "jsync_ord.js",
"jsync_ws"   : "jsync_ws.js",
"jsync_sto"  : "jsync_sto.js",
"jsync_test" : "jsync_test.js",
"jsync_test2" : "jsync_test2.js",
"jsync_init" : "jsync_init.js",
}

def wfile(file_name,out):
	f = open(file_name,"w")
	f.write(out)
	f.close()
def rfile(file_name):
	f = open(file_name,"r")
	ftxt = f.read()
	f.close()
	return ftxt

# C:\bspace\repos\jc4\ign4\indx\jsyncdb\jsync_lib_template.js
def run_now():
	path = r"C:\bspace\repos\jc4\ign4\indx\jsyncdb" + "\\"
	files2 = {}
	for k,v in files.items():
		ftxt = rfile(path+v)
		files2[k] = ftxt
	template = rfile(path+"jsync_lib_template.js")
	out = chevron.render(template,files2)
	# wfile("jsync_lib_out.js",out)
	wfile(path+"jsync_lib.js",out)

# run_now()
print("This was the old file I used to render the template the new one should keep all (or) most logic in the template")