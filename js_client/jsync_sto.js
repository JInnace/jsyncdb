// FILE:DS0
var Proxy_Permissions,Proxy_Factory

function mhndlr_rld_2(_o,scope,info){
	var dlog =nop
	try {
		var parsed = _o.data
		var o = parsed.payload
		// clog("mhndlr_rld",parsed.sto_event_type,parsed,{_o,scope,info})
		if (window.mhndlr_rld_dbg){
			mhndlr_rld_dbg({m,that,n,parsed,ai,o,arguments})
		}	

		switch (parsed.sto_event_type){
			case "set_msg":
			// if (!glob_u.prom.init_db_resolve.resolved){
			if (!glob_u.prom.init_db_resolve.resolved_inited && _o?.event?.target?.pre_init_msgs){
				_o.event.target.pre_init_msgs.push(_o)
			}
				pf._set_recv(o.path,o.key,o.val)
				// clog("msto_evh?ord")
				glob_u.fns.msto_evh ? glob_u.fns.msto_evh(o,parsed) : 0
				
			break;
			case "group_count":
				// clog("mhndlr_rld group_count",parsed)
				if (parsed.group_count < 2){
				// clog("mhndlr_rld group_count RESOLVE")
					glob_u.prom.init_db_resolve(glob_u.prom.init_db_resolve_timeout_arg)

				}
			break;
			case "event":
			/*
				dlog("~event~",parsed)
				if (window.dispatch_events){
				dispatch_events({parsed,ai,m,that})
				}
			*/
			break;
			case "msg_test":
				dlog("msg_test",parsed)
			break;
			case "db_sync_request":			
				// tmsgx4({sto_event_type:"db_sync_response",payload:pf.root,"CLIENT_KEY":"ws_sto"})
				// if (glob_u.prom.init_db_resolve.resolved){
				if (glob_u.prom.init_db_resolve.resolved_inited == 2){

				tmsgx4({sto_event_type:"db_sync_response",payload:jc(pf.root),request_from:parsed.from,request_rn_from:parsed.request_rn,"CLIENT_KEY":"ws_sto"})
				}

			break;
			case "db_sync_response":

					if (glob_u.prom.init_db_resolve && parsed.request_rn_from  == glob_u.prom.init_db_resolve.rn){
						glob_u.prom.init_db_resolve({aaa:"dsr",pl:parsed.payload})
					}
				// clog("db_sync_response",parsed)
			break;

		}
	} catch (err) {
		clog("mhndlr err:",err)
	}
}


glob_u.fns.msto_evh = function(o,parsed,ai,id){
	// clog("ord_msto_evh")
	if (o.path[0]!="conference" || o.path[1]!="events"){
		return
	}
	glob_u.cb.ws.STO_EVENT.run_cbs(":STO_EVENT",{o,parsed,ai,id})
	if (typeof(o.val) == "object"){
		glob_u.cb.ws.STO_EVENT.run_cbs(o.val.type,{o,parsed,ai,id})
	}
}

glob_u.cb.ws.reg_cb(mhndlr_rld_2,"WS_MESSAGE:ws_sto","WS_MESSAGE:ws_sto")








// FILE:DS1






var dlog = nop

function tmsgx4(m){
	var socket = glob_u.ws.sockets.ws1
	var jsend = socket.params.fns.jsend
	var t = {
		key:"tmp_dev_sto",
	}
	glob_u.fns.merge_partial_template(m,t)
	// clog("tmsgx4",{key:m.key,sto_event_type:m.sto_event_type,CLIENT_KEY:m.CLIENT_KEY},{m,t})
	trc_sto("tmsgx4",m)
	jsend(m)
}


isProxy = Symbol("isProxy")


tlu = {
	object:"",
	string:true,
	number:true,
	undefined:true,
	boolean:true,
}




function type_info(o){
	try {

	var t
	var flags = {
		leaf:false,
		deep_not_prx:false,
		prx:false,
		isObj:false,
		isArr:false,
		els:false,
	}
	t = typeof(o)
	flags.t=t
	if (!(o === null)){
		flags.isArr = Array.isArray(o)
		flags.isObj = Object.prototype == o.__proto__
	}

	if (tlu[t] === true || o === null){
		flags.leaf = true
	} else if (t == "object" && o.__prx){
		flags.prx = true
	} else if (t == "object" && (flags.isArr || flags.isObj)){
		flags.prx = false
		flags.deep_not_prx = true
	} else {
		clog("ELSE")
		flags.els = true
	}
	return flags
	} catch (err){
		clog("type_info err:",err,{flags,o})
	}
}


function deep_prop_v0(o,p){
	try {
	var arr = jc(p)
	var ret = o
	while (arr.length){
		ret = ret[arr.shift()]
	}
	return ret
	} catch(err){console.error("DEEP_PROP ERR:",err)}
}




// delete Proxy_Factory
// {

Proxy_Factory = class Proxy_Factory {
	constructor(o,n="dflt"){
		this.db = o
		this.n = n
		this.hidden_props = ["add_proxy","_set","walker","walker_start","prxy"]
		this._pub_cb =[]
		this.__prx = true
		this.SymPrx = Symbol("SymPrx")
	}
	init(o){
		this.root = o
	}
	sync(o){
		this.root = jc(o.root)
		o._pub_cb.push(this._set_recv.bind(this))
	}
	get prxy(){
		return this
	}

	_set(o,k,v,prx,a0){
		this.obj[k]=prx
	}
	set_pub(obj, prop, val,receiver){
		this._set_pub(obj.__path_arr, prop, jx(val))
	}
	_set_pub(path,key,val){
		var k,v
			var arg = {
				"CLIENT_KEY":"ws_sto",
				"sto_event_type":"set_msg",
				"payload":{path,key,val},}

			tmsgx4(arg,
			)
		for (v of this._pub_cb){
			v(path,key,val)

		}
	}

	_set_recv(path,prop,val,id){
		console.trace("_set_recv",{path,prop,val,id})

		var p = path
		var nprop = deep_prop_v0(this.root,p)
		var dpth = nprop.__dpth
		if (tlu[typeof(val)]){
		nprop._set(nprop,prop,val,val)
		} else {
		nprop._set(nprop,prop,val,new Proxy(val,this))
		nprop[prop].add_proxy(nprop,prop,val,dpth+1)
		}
		this.walker(nprop[prop],{},dpth+2)
	}

	set(obj, prop, val,receiver){
		if (obj[prop] === val){
			return Reflect.set(...arguments)
		}

		this.set_pub(obj, prop, val,receiver)
		this.event_proc("set")

		if ("__prx" == prop){
			this.__prx=val
			return this.__prx
		}

		if (typeof(val) === "object" && val != null && !(val.__prx)){
			var ret = Reflect.set(...arguments)
			this.set_obj(obj, prop, val,receiver)
			return ret
		}

		return Reflect.set(...arguments)
	}
	get(obj, prop,receiver){
		if (this.hidden_props.includes(prop)){
			switch (prop){
				case "add_proxy":
				return this.add_proxy.bind(this)
			break;
				case "prxy":
				return this
				case "_set":
				return this._set.bind({that:this,obj, prop,receiver})
				case "walker_start":
				return this.walker_start
				case "walker":
				return this.walker
			break;
			}
		}

		if (isProxy == prop){ return true }
		if ("__prx" == prop){ return this.__prx }

		return Reflect.get(...arguments)
	}
	add_proxy(o,k,v,dpth){
		var xpath = o.__path
		var apath = o.__path_arr
		this.event_proc("add_proxy")
		if (!apath){
			apath=[]
		}

		if (!xpath){
			xpath="ROOT!"
		}

		Object.defineProperty(v,"__path_arr",Object.assign({value:apath.concat(k),},this.baseProp))
		Object.defineProperty(v,"__path",Object.assign({value:xpath+":"+k,},this.baseProp))
		Object.defineProperty(v,"__dpth",Object.assign({value:dpth,},this.baseProp))
		// Object.defineProperty(v,"__dbg",Object.assign({value:{},},this.baseProp))

	}
	set_obj(obj, prop, val,receiver){
		var dpth = obj.__dpth
		var tf = {}
		var dbg_obj = {}
		this.walker(receiver,tf,dpth,dbg_obj)
		if (dbg_obj.depth_err){
			clog("MAX DEPTH?",dbg_obj,{obj, prop, val,receiver})
		}
	}

	walker(o,tfo,dpth=0,dbg_obj={"t":"unused"}){
		// if (dpth > 7){
		if (dpth > 15){
			dbg_obj.depth_err=1
			console.error("MAX DEPTH",{o,tfo,dpth,dbg_obj})
			return
		}
		var k,v
		var tf
			for ([k,v] of Object.entries(o)){
				tf = type_info(v)
				if (tf.deep_not_prx){
					o._set(o,k,v,new Proxy(v,this.prxy))
					o[k].add_proxy(o,k,v,dpth)
				this.walker(o[k],tf,dpth+1,dbg_obj)
				}
			}
	}
	walker_start(o,dpth){
		var tf = type_info(o)
		o.add_proxy({},[],o,-1)
		this.walker(o,tf,0)
	}
	event_proc(e){}
}
window.Proxy_Factory = Proxy_Factory

Proxy_Factory.prototype.baseProp={
	writable: true,
	enumerable: false,
	// enumerable: true,
	configurable: true,
	}
// }




function arr_match(m,o){
	var k,v
	var r = 0
	for ([k,v] of Object.entries(m || {})){
		if (o[k] != v.valueOf()){
			r += 1
			return !r
		}
	}
	return !r
}

// permissions_def = {
window.permissions_def = window.permissions_def || {
	participants:{
		m:["participants"],
		fn(set_scope,match){

			if (match.fp[1] == "rejx")
				throw "permission err"
			return
		},
	}
}



// {
Proxy_Permissions = class Proxy_Permissions extends Proxy_Factory {
		constructor(a,a1){
			super(...arguments)
		}
		set(obj, prop, val,receiver){
			var k,v
			var r
			var matched
			var fp = obj.__path_arr.concat(prop)
			for ([k,v] of Object.entries(permissions_def)){
				matched = arr_match(v.m,fp)
				if (matched){
					r = v.fn({that:this,obj, prop, val,receiver},{fp,k,v}) || {}
				}
			}
			return super.set(obj, prop, val,receiver)
		}
		_set(){
			super._set(...arguments)
		}
	}
	window.Proxy_Permissions = Proxy_Permissions
// }


// clog("???")
