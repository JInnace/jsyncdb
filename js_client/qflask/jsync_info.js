// console.clear()

clog("JSYNC INFO PLACEHOLDER")


function trc_sto(argument) {
	// body...
	clog("trc_sto",arguments,this)
}

function fn(argument) {
	var r = {
		_o:{},
		o:{},
	}
	// 
	r._o=glob_u.cb.ws.cb_sto
	var k,v,z,z2
	for ([k,v,z] of Object.entries(glob_u.cb.ws.cb_sto)){
		// clog(":",[k,v,z])
		r.o[k]=[]
		for (elm of v){
			clog("::",elm)
			r.o[k].push(elm.cb)
		}
		clog(":",[k,v,z])
		// r.o
	}
	clog(r)
	return r
}

fn()


