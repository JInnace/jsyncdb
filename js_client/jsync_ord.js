

{



var dflt_opts = {
	// sort_fn:gen_sort_attr("override_level"),
	sort_fn:glob_u.fns.gen_sort_attr("override_level"),
	log_level:0,
	// ns:"",
}





class BoundObj{
	constructor(){
		this.init()
	}

    init(){
        let k,v,i,j
        for ([k,v] of Object.entries(Object.getOwnPropertyDescriptors(this.__proto__))){
            if (k.endsWith("_ub") && typeof(v.value) == "function"){
                // clog("UB",k,k.slice(1,-3))
                j = v.value.bind(this)
                j.meta_str = "bound_fn"
                this[k.slice(1,-3)] = j
            }
        }
        

    }
    /*
	mx2_ub(){
		clog("Mx2")
	}
    */


}
function resolveNow(){}  
async function resolveSoon(){}  


// class reg_cb_ord{
class reg_cb_ord extends BoundObj{
	// con
	constructor(opts){
		super()
		this.opts = Object.assign({},dflt_opts,opts)
		this.r = Object.assign(this,dflt_opts,opts)

		// this.sort_fn = this.opts

		this.cb_sto = {}
		this.batch = {}
		this._orig_opts = opts
		// clog("v2 ",this)
	}

	_promise_test_ub(arg1){
		// clog()
		console.log("promise_test",{that:this,arg1})
		// console.log("promise_test",{that:this,opts:this.opts,arg1})
	}
	promise_test_init(){
		var p = new Promise((resolve,reject)=>{
			resolve("Promise.~")
		})
		p.then(this.promise_test)

		console.log("promise_test_init",{that:this,opts:this.opts})

	}
	_batch_run_ub(){
		this.batch.WillRun = false
		var batched_events = this.batch.batched_events
		var i,k,v
		for ([k,v] of Object.entries(batched_events.combinable)){
			this.run_cbs(v.key,v.arg_obj)
		}
		for ([k,v] of Object.entries(batched_events.unique)){
			this.run_cbs(v.key,v.arg_obj)
		}
			this.batch.batched_events = {
				combinable:{},
				unique:[],
			}
	
	}

	_req_batch_run_ub(key,arg_obj,combine){
		if (this.batch.WillRun != true) {
			this.batch.WillRun = true
			this.batch.batched_events = {
				combinable:{},
				unique:[],
			}
			new Promise((resolve,reject)=>{
				resolve("Promise.~")
			}).then(this.batch_run)

		}  
		if (this.batch.WillRun == true){
			if (combine){
				this.batch.batched_events.combinable[key] = {key,arg_obj,combine}
			} else {
				this.batch.batched_events.unique.push({key,arg_obj,combine})
	
			}
		}
		if (!(this.batch.WillRun == true ||this.batch.WillRun == false )){
			console.error("::")
			throw "req_batch_run err"
		}
	}

	_reg_cb_ub(cb,key_name,cb_name,override_level = 100,push=1){

		if (typeof(cb) != "function"){
			console.error("callback is not a function. setting push=r","\ncb:",cb)
			push = "r"
			// console.error("callback:",cb," is not a function")
		}
		// var this.cb_sto = {}
		var cb_sort = nop
	
		if (!this.cb_sto[key_name]){
			this.cb_sto[key_name] = []
		}
		// this.cb_sto[key_name].find(find_html_cb,{fn_key:cb_name})
		// splice_out_ti(this.cb_sto[key_name],this.cb_sto[key_name].find(find_html_cb,{fn_key:cb_name}))
		// var cbo0= this.cb_sto[key_name].find(glob_td.fn.find_html_cb,{fn_key:cb_name})
		// var cbo0= this.cb_sto[key_name].find(find_attr,{fn_key:cb_name})
		var cbo0= this.cb_sto[key_name].find(glob_u.fns.find_attr,{attr:"fn_key",val:cb_name})
		// clog(cbo0)
		glob_u.fns.splice_out(this.cb_sto[key_name],cbo0)
		// tn2t.arr.
	
		// splice_out_cb
		let cb_obj = {
			cb,
			hkey:key_name,
			fn_key:cb_name,
			override_level,
		}
		if (push=="r"){
	
		} else if (push){
			this.cb_sto[key_name].push(cb_obj)
		} else {
			this.cb_sto[key_name].unshift(cb_obj)
		}
		this.cb_sto[key_name].sort(this.sort_fn)


	}
	_run_cbs_ub(key,arg_obj){
	
		var k,v
		var o = {
			// html_key:key,cbs:glob_mx.html_cb[key],
		}
	
			// dlog("RUN_HOOK_CB??",key,glob_mx.hook_cb[key])
			// clog("ORD:RUN",key,arg_obj)
		try {
	
			this.opts.log_level  ? clog("run_cbs",arg_obj,o,{that:this,hkey:key,cbs:this.cb_sto[key]}) : 0
			var rmv_fns = []
	
	
		for ([k,v] of Object.entries(this.cb_sto[key]|| {}) ) {
			// dlog("RUN_HOOK_CB:",k)
			// clog("run_html_cbs:",k,v)

			this.opts.log_level > 1 ? clog("run_cbs_e",arg_obj,o,{that:this,hkey:key,cbs:this.cb_sto[key],k,v}) : 0
			v.cb(arg_obj,o,{that:this,hkey:key,cbs:this.cb_sto[key],k,v})
			if (v.remove_after_exe){
				rmv_fns.push(v)
			}
			// v(o)
		}

		for ([k,v] of Object.entries(rmv_fns|| {}) ) {
			glob_u.fns.splice_out(this.cb_sto[key],v)
		}




		// return {arg_obj,o,{that:this,hkey:key,cbs:this.cb_sto[key]}}
		return {arg_obj,o,info:{that:this,hkey:key,cbs:this.cb_sto[key],rmv_fns}}
		} catch(err){
			console.error("ti_v_cb err:",err)
		}

	}

}

window.glob_u.cls.reg_cb_ord = reg_cb_ord






}





