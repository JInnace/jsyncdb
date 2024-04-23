"use strict";

// makestache template info 
// the following string tells my make scripts its fine to overwtite this the library would have had a template str in the middle of the str
// BUILT_FILE_OVERWRITE_ALLOWED
//  ... C:\ws\repos\jitsi_main\jsync\jsyncdb\js_client\jsync_lib.js
// /* */ 

(function (){
var isProxy,tlu,msto_z
var pf,msto_prx


// jsync:dep.js
// ------------------------------------------------------------------------------------------------

// window.w = window.w || {}


// w.clog = console.log
var clog = console.log
// var clog = w.clog

// clog("??")
function nop(){}

window.glob_u = window.glob_u || {
	cb:{},
	fns:{},
	cls:{},
	tvar:{},
	data:{},
	prom:{},
	rrefs:{},
	xj:{},
	templates:{},
}

glob_u.fns.gen_sort_attr = function gen_sort_attr(attr){
	return function gsort(a0,a1){
		if (a0[attr] > a1[attr]){
		return 1
		} else if (a0[attr] < a1[attr]){
		return -1
		} else {
		return 0
		}
	}
}
glob_u.fns.find_attr = function find_attr(elm,indx,arr){
	if (elm && elm[this.attr] == this.val){
		return 1
	}
}

glob_u.fns.splice_out = function splice_out(arr,elm){
	let i = arr.indexOf(elm)
	if (i != -1){
		return arr.splice(i,1)
	}
}



function jclone(obj){
	return Array.isArray(obj) ?  $.extend(true,[],obj) :  $.extend(true,{},obj)
}
function jx(obj){
	return JSON.parse(JSON.stringify(obj))
}

function jclone_rval(obj){
	if (typeof(obj) != "object"){
		return obj
	} else if (Array.isArray(obj)) {
		return $.extend(true,[],obj)
	} else {
		return $.extend(true,{},obj)
	}

}

// window.jc = jclone
window.jc = jclone_rval





// TODO:JFI eventually merge 
// j9\dev_dep\misc_dev.js

glob_u.fns.gen_ord_decs = function(ord,cb_prefix){
	var reg_cb = function(cb,key_name,cb_name,override_level,push){
		return ord.reg_cb(cb,cb_prefix+key_name,cb_name,override_level,push)
	}

	var run_cbs_lz = function(key,arg_obj,lazy=1){
		if (lazy && cb_prefix+key in ord.cb_sto){
			return ord.run_cbs(cb_prefix+key,arg_obj)
		}
	}
	var run_cbs = function(key,arg_obj){
			return ord.run_cbs(cb_prefix+key,arg_obj)
		// split out later maybe?
	}
	function req_batch_run(key,arg_obj,combine){
			return ord.req_batch_run(cb_prefix+key,arg_obj)

	}

	reg_cb.ord = ord
	reg_cb.cb_prefix = cb_prefix
	run_cbs.ord = ord
	run_cbs.cb_prefix = cb_prefix

	run_cbs_lz.ord = ord
	run_cbs_lz.cb_prefix = cb_prefix
	return {reg_cb,run_cbs,run_cbs_lz,req_batch_run}
}


// duplicated in jdev0
glob_u.fns.merge_partial_template = function merge_partial_template(main,template){
	let t = $.extend(true,{},template,main)
	return $.extend(true,main,t)
}


// jsync:ord.js
// ------------------------------------------------------------------------------------------------


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






// jsync:ws.js
// ------------------------------------------------------------------------------------------------
// FILE:WS0

// TODO:JFI this file probably causes memory leaks


window.glob_u.ws = window.glob_u.ws || {
	sockets:{},
	fns:{},
	flags:{},
} 

window.glob_u.trc = window.glob_u.trc || {
	arr:[],
}



// TODO:JFI I should factor out my development junk
function trc_sto(s,o){
	if (!glob_u?.prom?.init_db_resolve?.resolved){
	var elm = {name:s,o,timestamp:Date.now()}
	glob_u.trc.arr.push(elm)
	// clog("_trc:sto",s,o.sto_event_type,elm.timestamp,o)
	}	
}



window.glob_u.ws.fns.reconnect = function reconnect(o,close_event){
	connect_ws(o.params)
}


// TODO:JFI These event handlers are less generic now


window.glob_u.ws.fns.onclose = function onclose(event){
	clog("WS_CLOSE",{that:this,readyState:this.readyState,args:[...arguments]})
	// glob_u.ws.sockets.ws1.params.ord.run_cbs("WS_CLOSE:",{event,that:this})
	glob_u.ws.sockets[this.params.socket_name].params.ord.run_cbs("WS_CLOSE:",{event,that:this})
	// setTimeout(this.params.fns.reconnect,1000)
	let  timeout0 = this.params.timeout0 || 100
	let timeout_multi = this.params.timeout_multi || 3000
	let t =timeout_multi
	// let now = Date.now()
	if (this.params.HAS_OPENED && timeout_multi<Date.now()-this.params.OPEN_TIME){
		t=timeout0
	}
	// clog(":TIME:",now,this.params.OPEN_TIME,now-this.params.OPEN_TIME)
	this.params.HAS_OPENED = 0
	setTimeout(this.params.fns.reconnect,t)
}

window.glob_u.ws.fns.onmessage = function onmessage(event){
	// clog("WS_MESSAGE",{that:this,args:[...arguments]})
	// glob_u.ws.sockets.ws1.params.ord.run_cbs("WS_MESSAGE:",{event,that:this})
	glob_u.ws.sockets[this.params.socket_name].params.ord.run_cbs("WS_MESSAGE:",{event,that:this})
}

window.glob_u.ws.fns.onerror = function onerror(event){
	// clog("WS_ERROR",{that:this,args:[...arguments]})
	// glob_u.ws.sockets.ws1.params.ord.run_cbs("WS_ERROR:",{event,that:this})
	glob_u.ws.sockets[this.params.socket_name].params.ord.run_cbs("WS_ERROR:",{event,that:this})


}
window.glob_u.ws.fns.onopen = function onopen(event){
	this.params.HAS_OPENED = 1
	this.params.OPEN_TIME = Date.now()
	
	// clog("WS_OPEN???",{that:this,args:[...arguments]},{on_open_once:this.on_open_once,on_open_cbs:this.params.on_open_cbs})
	// glob_u.ws.sockets.ws1.params.ord.run_cbs("WS_OPEN:",{event,that:this})
	glob_u.ws.sockets[this.params.socket_name].params.ord.run_cbs("WS_OPEN:",{event,that:this})
	return
		var cb
	if (this.on_open_once){
		for (cb of this.on_open_once){
			cb(event,this)
		}
	if (this?.params?.on_open_cbs){
		for (cb of this?.params?.on_open_cbs){
			cb(event,this)
		}
	}
}
}


window.glob_u.ws.fns.ws_fns_factory = function ws_fns_factory(socket_opts){
	var socket_name = socket_opts.socket_name
	// const sockets = 
	var v1 = "init"
	var fns = {
		get_socket(o){
			return glob_u.ws.sockets[socket_name]
		},
		reconnect(){
			var socket = fns.get_socket()
			clog("RECONNECT",socket_opts,socket,socket?.DoNotReconnect)
			// if (socket.DoNotReconnect || socket.params.DoNotReconnect || glob_u.ws?.flags?.DoNotReconnect){
			if (socket.DoNotReconnect || !socket.params.AutoReconnect || glob_u.ws?.flags?.DoNotReconnect){
				clog("RECONNECTION NOT ATTEMPTED",socket_opts)
				return
			} else {

			}

			connect_ws(socket_opts)
		},
		log_var(o){
			clog("var:",v1)
			return v1
		},
		set_var(val){
			v1 = val
			return v1
		},
		send_text(o){
			var socket = fns.get_socket()
			clog("send_text",{that:this,fns})
			socket.send(JSON.stringify(o));
		},
		jsend(o){
			var socket = fns.get_socket()
			// clog("!!!",{that:this,fns})
			socket.send(JSON.stringify(o));
		},
	} 
	return fns
}


function connect_ws(o= {}){
	// clog("connect_ws:",o,jc(o))
	glob_u.fns.merge_partial_template(o,{on_open_cbs:[]})
	var sockets = window.glob_u.ws.sockets
	var old_socket = sockets[o.socket_name]
	if (old_socket && old_socket.readyState == 1){
		clog(`WS ${o.socket_name} is already CONNECTED:`,old_socket , o)
		return

	} else if (old_socket && (old_socket.readyState != 3 && old_socket.readyState != undefined )){
		clog(`WS ${o.socket_name} exsists and in not closed:`,old_socket , o)
		return

	}

	var socket = new WebSocket(o.url)
	socket.on_open_once = []
	socket.pre_init_msgs = []
	socket.params = o
	// if ()
	Object.assign(o.fns, window.glob_u.ws.fns.ws_fns_factory(o))
	// Object.assign(o.fns2, window.glob_u.ws.fns.ws_fns_factory(o))

	Object.assign(socket,o.methods)

	sockets[o.socket_name]=socket
	// o.jsend ?    socket.jsend = o.jsend: 0
	// clog("CONNECTING WS:",{o,socket})
	return [socket,old_socket]
}





// FILE:WS1





function create_ws_ord(){
	if (!glob_u.cb.ws){

	var ord = new glob_u.cls.reg_cb_ord()
	glob_u.cb.ws = ord
	glob_u.cb.ws.reg_cb = ord.reg_cb
	glob_u.cb.ws.run_cbs = ord.run_cbs

		glob_u.cb.ws.STO_EVENT =  glob_u.fns.gen_ord_decs(glob_u.cb.ws,"STO_EVENT:")

	// glob_u.cb.ord_v1.estr =  glob_u.fns.gen_ord_decs(glob_u.cb.ord_v1.ord,"")
	// glob_u.cb.ord_v1.run_cbs_lz = glob_u.cb.ord_v1.estr.run_cbs_lz
	// glob_u.cb.ord_v1.ord.run_cbs_lz = glob_u.cb.ord_v1.run_cbs_lz



	}
}


window.glob_u.ws.fns.dispatch = function dispatch(o,obj_x,info){
	var event = o.event
	// socket = o.that
	// clog("jtx dispatch",{o,obj_x,info,that:this})
	var data = JSON.parse(event.data)
	// clog("WS_dispatch",data,socket.params.ord,data["CLIENT_KEY"])
	// clog("trc:sto:ws_rec",data.CLIENT_KEY,data.sto_event_type,data)

	trc_sto("ws_rec",data)
	glob_u.ws.sockets.ws1.params.ord.run_cbs("WS_MESSAGE:"+data["CLIENT_KEY"],{event,that:this,data})
		return
	if (e.arguments[0].type == "message"){

	var data = JSON.parse(e.arguments[0].data)

    if ("type" in data && ws_handlers[data.type]){
		ws_handlers[data.type](data,{that:e.that,event:e.arguments[0]})
    } else {
    	clog("NO HANDLER FOR",data.type)
    }

	clog("~WS",data,e)
	} else if  (e.arguments[0].type == "open") {
		ws_handlers.on_open(e)
	}

}


function ws_reload(){
	try{
		if ((!glob_u.ws.sockets.ws1 || glob_u.ws.sockets.ws1.readyState == 3 || glob_u.ws.sockets.ws1.readyState == undefined)){
			ws_helper()
		} else {
		glob_u.ws.sockets.ws1.close()
		clog(glob_u.ws.sockets.ws1,glob_u.ws.sockets.ws1.readyState)
		glob_u.ws.sockets.ws1.onclose = ws_helper
		}

	} catch (err){
		clog(err)
	}
}


function get_room_name(){
	// return 
	var s=location.search
	// if s[0]=="?"){}
	s[0]=="?" ?  s = s.slice(1):0
	var param
	for (param of s.split("&")){

		let kv = param.split("=")
		if (kv[0]=="room"){
			return kv[1]
		}
		clog("::",param,kv)
		// clog("::",param,kv,"")
	}

	// var 
	return "room_name"
	var room_name=location.pathname.match(/\/loc.([^\/]*)\//)
	if (room_name){
		room_name = room_name[1]
	} else {
	room_name = location.pathname.split("/").pop()

	}
	return room_name

}
// function get_room_name(){
function get_room_name_old(){

	var room_name=location.pathname.match(/\/loc.([^\/]*)\//)
	if (room_name){
		room_name = room_name[1]
	} else {
	room_name = location.pathname.split("/").pop()

	}
	return room_name

}




function ws_helper(){
	clog("WS_HELPER")
	var fns = window.glob_u.ws.fns
	var o = {
		include_participants_data:1, 
		include_ws_channel_data:1, // required for participants_data to work
		// msto.participants and masto.ws_channels will be defined in either case so we don't need to handle cases where some users enable this and some don't
		AutoReconnect:false,
		AutoReconnect:true,
		url:'wss://' + window.location.hostname  +`/djc_srv/ws/chat/${get_room_name()}`,
		socket_name:"ws1",
		ord:glob_u.cb.ws,

		methods:{
		onmessage:fns.dispatch,
		onclose:fns.onclose,
		onerror:fns.onerror,
		onopen:fns.onopen,
		},



		methods:{
		onmessage:fns.onmessage,
		onclose:fns.onclose,
		onerror:fns.onerror,
		onopen:fns.onopen,
		},


		fns:{


		// reconnect:fns.reconnect,
		},
	}
	/*
	if (window.glob_u.ws.ws1 && window.glob_u.ws.ws1.readyState == 1){
		clog("WS ws1 is CONNECTED:",window.glob_u.ws.ws1)
		return
	}
	*/
	var socket = connect_ws(o)
	// clog({socket})
}
window.glob_u.fns.connect_ws = connect_ws
glob_u.fns.get_room_name=get_room_name
create_ws_ord()
glob_u.cb.ws.reg_cb(window.glob_u.ws.fns.dispatch,"WS_MESSAGE:","WS_MESSAGE")

// jsync:sto.js
// ------------------------------------------------------------------------------------------------
// FILE:DS0
var Proxy_Permissions,Proxy_Factory

function mhndlr_rld_2(_o,scope,info){
	// clog("jtx mhndlr_rld_2",{_o,scope,info,that:this})
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
			// if (!glob_u.prom.init_db_resolve.resolved_inited){
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

// jsync:init.js
// ------------------------------------------------------------------------------------------------
function pfnf(o){
	return  function(resolve, reject){
		o.resolve=resolve
		o.reject=reject
	}
}

msto_z = {
	conference:{
		events:{},
	},
	participants:{},
	ws_channels:{},
}






var DBL_Proxy0 = {
	set(obj, prop, val,receiver){
		clog({obj, prop, val,receiver})
		// return Reflect.set(...arguments)
	

		if (Object.getOwnPropertyNames(obj).includes(prop)){
		return Reflect.set(...arguments)

	} else {
		return obj._wrapped_proxy[prop]=val
		// return Reflect.set(...arguments)
		
	}


	},
	get(obj, prop,receiver){
		clog({obj, prop,receiver},Object.getOwnPropertyNames(obj))
		if (Object.getOwnPropertyNames(obj).includes(prop)){
		return Reflect.get(...arguments)

	} else {
		return obj._wrapped_proxy[prop]
		// return Reflect.get(...arguments)

	}
	},
}






var DBL_Proxy1 = {
	set(obj, prop, val,receiver){
		// clog({obj, prop, val,receiver})
		// return Reflect.set(...arguments)
	

		if (Object.getOwnPropertyNames(pf.dbl_proxy_obj).includes(prop)){
		// if (Object.getOwnPropertyNames(obj).includes(prop)){
		return pf.dbl_proxy_obj[prop]=val

	} else {
		return Reflect.set(...arguments)
		// return Reflect.set(...arguments)
		
	}


	},
	get(obj, prop,receiver){
		// clog({obj, prop,receiver},Object.getOwnPropertyNames(obj))
		if (Object.getOwnPropertyNames(pf.dbl_proxy_obj).includes(prop)){

		return pf.dbl_proxy_obj[prop]
	} else {
		return Reflect.get(...arguments)
		// return Reflect.get(...arguments)

	}
	},
}





var DBL_Proxy = {
	set(obj, prop, val,receiver){
		// clog({obj, prop, val,receiver})
		// return Reflect.set(...arguments)
	

		if (Object.getOwnPropertyNames(pf.dbl_proxy_obj).includes(prop)){
		// if (Object.getOwnPropertyNames(obj).includes(prop)){
		return pf.dbl_proxy_obj[prop]=val

	} else {
		return obj[prop] = val
		// TODO: make sure this proxy doesn't cause other similar bugs
		// return Reflect.set(...arguments)		
	}


	},
	getOwnPropertyDescriptor(obj, prop){
		if (Object.getOwnPropertyNames(pf.dbl_proxy_obj).includes(prop)){

		return Reflect.getOwnPropertyDescriptor(pf.dbl_proxy_obj, prop)
		} else {
		return Reflect.getOwnPropertyDescriptor(obj, prop)

		}
	},
	get(obj, prop,receiver){
		// clog({obj, prop,receiver},Object.getOwnPropertyNames(obj))
		if (Object.getOwnPropertyNames(pf.dbl_proxy_obj).includes(prop)){

		return pf.dbl_proxy_obj[prop]
	} else {
		return Reflect.get(...arguments)
		// return Reflect.get(...arguments)

	}
	},
  ownKeys(target) {
    var target_keys = Reflect.ownKeys(target);
    var extra_keys = Reflect.ownKeys(pf.dbl_proxy_obj);
    // clog("ownKeys",{target_keys,extra_keys})
  	
    return [...target_keys,...extra_keys]
  },
}








function init_db(objx){
	// clog("init_db~")
	console.trace("init_db")
	trc_sto("init_db",{})
	glob_u.prom.init_db_resolve.resolved=1
	var glob_mx = glob_u.data
		var obj
		// clog("init_dbx",objx,{arguments,that:this})
	if (objx.participants){
		obj = objx
	} else {
		obj = objx.pl
	}

	// clog("INIT DB...",objx,obj,jc({obj,objx}))
pf = new Proxy_Permissions({},"pf")
msto_prx = new Proxy(obj,pf)
window.msto_prx=msto_prx
// window.msto_prx0 =msto_prx
pf.init(msto_prx)
msto_prx.walker_start(msto_prx)
glob_mx.init_db=true

// TODO:JFI make msto a class instance maybe
   /*
window.msto = {
	...pf.root,
	// participants:pf.root.participants,
	// conference:pf.root.conference,
	// my_data:pf.root.participants[glob_mx.local_id],

		get my_channel(){
			return msto.ws_channels[get_ws_channel_name()]
			// my_data("pfx get k1")
		},
		set my_channel(val){
			clog("pfx set my_channel")
			msto.ws_channels[get_ws_channel_name()] = val
		},


		get my_data(){
			return msto.participants[get_local_sto_id()]
		},
		set my_data(val){
			clog("pfx set my_data")
			msto.participants[get_local_sto_id()] = val

		},


	private_local:{},
}
     // */
// window.msto

var dbl_proxy_obj = {
	// _wrapped_proxy:pf.root,
	// _wrapped_proxy2:pf.root,
		get my_channel(){
			return msto.ws_channels[get_ws_channel_name()]
			// my_data("pfx get k1")
		},
		set my_channel(val){
			clog("pfx set my_channel")
			msto.ws_channels[get_ws_channel_name()] = val
		},


		get my_data(){
			return msto.participants[get_local_sto_id()]
		},
		set my_data(val){
			clog("pfx set my_data")
			msto.participants[get_local_sto_id()] = val

		},
		private_local:{},


}
pf.dbl_proxy_obj=dbl_proxy_obj


// window.dbl_proxy=new Proxy(dbl_proxy_obj, DBL_Proxy)
// window.msto=new Proxy(dbl_proxy_obj, DBL_Proxy)
window.msto=new Proxy(msto_prx, DBL_Proxy)


}





function handle_pre_init_msgs(){
	clog("handle_pre_init_msgs")
	var k,v,i
	var _o
	glob_u.prom.init_db_resolve.resolved_inited = 1
	for (v of glob_u.ws.sockets.ws1.pre_init_msgs){
		if (v.data.sto_event_type == "set_msg"){
			msto.my_data.rehandle=1
			_o={...v,data:jc(v.data)}
			mhndlr_rld_2(_o,{type:"rehandle"})
		}
	}
	glob_u.prom.init_db_resolve.resolved_inited = 2
}

function ws_sto_connected(a,b){

	glob_u.cb.ws.run_cbs("WS_MSTO_INITED")

handle_pre_init_msgs()
	// clog("ws_sto_connected",a,b,this)
}


function init_mu(){

	var k,v

	var rr = {}
	var prom1 = new Promise(pfnf(rr));
	prom1.then(init_db).then(ws_sto_connected)
	glob_u.prom.init_db_resolve_timeout_arg = {aaa:"timedout",pl:msto_z}

	setTimeout(rr.resolve,5000,glob_u.prom.init_db_resolve_timeout_arg)
	var rn = ((Math.random()+"").replace("0.","") - 0).toString(16)

	tmsgx4({sto_event_type:"db_sync_request","CLIENT_KEY":"ws_sto",request_rn:rn})
	glob_u.prom.init_db_resolve = rr.resolve
	glob_u.prom.init_db_resolve.rn = rn

}


function ord_init_once(o,scope,info){
	// clog("ord_init_once:",{o,scope,info})
	init_mu()

	// info.cbs[info.k].remove_after_exe = 1 
}

glob_u.cb.ws.reg_cb(ord_init_once,"WS_OPEN:","ord_init_once")
function ds_test(){
	glob_u.cb.ws.reg_cb(ord_init_once,"WS_OPEN:","ord_init_once")
	ws_reload()
}



glob_u.fns.ds_test=ds_test




// jsync:test.js
// ------------------------------------------------------------------------------------------------

// clog("/////////")

// msto_sc_proxy
// permissions_def
// connection_info_handler

//      /*
function get_local_sto_id(){
	return glob_u.data.jsync_local_id
}
function get_session_sto_id(){
	return glob_u.data.jsync_session_id
}

function get_ws_channel_name(){
	return glob_u.data.channel_name

}

function gen_djc_srv_id(){
	// I don't know how often this will generate duplicates

	var djc_srv_id = localStorage.djc_srv_id
	var djc_srv_id_vers =  localStorage.djc_srv_id_vers
	const current_id_vers = 0.0
	if (Number(djc_srv_id_vers) < current_id_vers || !(djc_srv_id)){
		clog("????")
		localStorage.djc_srv_id = ((Math.random()+"").replace("0.","") - 0).toString(16)
		localStorage.djc_srv_id_vers = current_id_vers
	}
	glob_u.data.djc_srv_id = localStorage.djc_srv_id
	clog("djc_srv_id:",{version:localStorage.djc_srv_id_vers,id:localStorage.djc_srv_id})

}



function init_msto_user_data(o,scope,info){
	var ws_channel_name = get_ws_channel_name()


	var local_sto_id = get_local_sto_id()
	// clog("init_msto_user_data???",{local_sto_id,ws_channel_name,o,scope,info})
	if (!glob_u.ws.sockets.ws1.params.include_ws_channel_data){return}
	msto.ws_channels[ws_channel_name]=msto.ws_channels[ws_channel_name] || {id:local_sto_id}


	if (!glob_u.ws.sockets.ws1.params.include_participants_data){return}
	msto.participants[local_sto_id]=msto.participants[local_sto_id] || {}
	// clog("init_msto_user_dataw???")




}

glob_u.cb.ws.reg_cb(init_msto_user_data,"WS_MSTO_INITED","init_msto_user_data")


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
//     */
// jsync_local_id
// jsync_local_vers
// jsync_session_id
// jsync_session_vers
// jsync_id
// jsync_vers



window.permissions_def = {
	participants:{
		m:["participants"],
		fn(set_scope,match){
			if (match.fp[1] != get_local_sto_id()){
				console.error("permission err:participants",set_scope,match)
				// console.trace("permission err:participants")
				throw "permission err"
			}
			return
		},
	},
	ws_channels:{
		m:["ws_channels"],

		fn(set_scope,match){
			if (match.fp[1] != get_ws_channel_name()){
				console.error("permission err:ws_channels",set_scope,match)
				throw "permission err"
			}
		}
	},
}



window.permissions_def0 = {
	/*
	ws_channels:{
		m:["ws_channels"],

		fn(set_scope,match){
			if (match.fp[1] != window.glob_u.data.channel_name){
				console.error("permission err:ws_channels",set_scope,match)
				throw "permission err"
			}
		}
	},
	*/

	user_channels:{
		m:["user_channels"],

		fn(set_scope,match){
			if (match.fp[1] != get_ws_channel_name()){
				console.error("permission err:user_channels",set_scope,match)
				throw "permission err"
			}
		}
	},


	user_data_sessions:{
		m:["user_data_sessions"],
		fn(set_scope,match){
			if (match.fp[1] != get_session_sto_id()){
				console.error("permission err:user_data_sessions",set_scope,match)
				// console.trace("permission err:participants")
				throw "permission err"
			}
			return
		},
	},
	user_data_local:{
		m:["user_data_local"],
		fn(set_scope,match){
			if (match.fp[1] != get_local_sto_id()){
				console.error("permission err:user_data_local",set_scope,match)
				// console.trace("permission err:participants")
				throw "permission err"
			}
			return
		},
	},
	/*
	participants:{
		m:["participants"],
		fn(set_scope,match){
			if (match.fp[1] != window.glob_u.data.djc_srv_id){
				console.error("permission err:participants",set_scope,match)
				// console.trace("permission err:participants")
				throw "permission err"
			}
			return
		},
	}
	*/

}







function ensure_jsync_id_is_set(storage_,base_name){
	var storage = storage_
	var id_name = base_name + "_id"
	var vers_name = base_name + "_vers"
	var djc_srv_id = storage[id_name]
	var djc_srv_id_vers =  storage[vers_name]
	const current_id_vers = 0.0
	if (Number(djc_srv_id_vers) < current_id_vers || !(djc_srv_id)){
		storage[id_name] = ((Math.random()+"").replace("0.","") - 0).toString(16)
		storage[vers_name] = current_id_vers
	}
	glob_u.data[id_name] = storage[id_name]
	// clog("djc_srv_id:",{version:localStorage.djc_srv_id_vers,id:localStorage.djc_srv_id})

}
ensure_jsync_id_is_set(localStorage,"jsync_local")
ensure_jsync_id_is_set(sessionStorage,"jsync_session")

// function user_disconnected_compatibility_handler(o,scope,info){



// TODO:Fix bug caused by a user disconnecting before the connection is properly established
function connection_info_handler(o,scope,info){
	if (o.data.sto_event_type=="connection_info"){
	// clog("connection_info_handler:",o,scope,info)
		glob_u.data.group_name = o.data.group_name
		glob_u.data.channel_name = o.data.channel_name
		clog("jsyncdb connected","room name:",glob_u.data.group_name)
	} else if (o.data.sto_event_type=="user_disconnected"){
	var last_conn =1
	var k,v
	var ws_conn_data = jc(msto.ws_channels[o.data.channel_name])
	delete msto.ws_channels[o.data.channel_name]
		for ([k,v] of Object.entries(msto.ws_channels)){
		if (v.id == ws_conn_data.id){
			last_conn = 0
		}
	}
	if (last_conn){
		// clog("DELlast_conn" ,ws_conn_data.id)
		delete msto.participants[ws_conn_data.id]
	}
		clog("user_disconnected:",o.data.channel_name)
		return
		if (msto.user_channels){
			delete msto.user_channels[o.data.channel_name]
		}
	


		if (msto.user_channels){
			for ([k,v] of Object.entries(msto.user_channels)){
				if (v.id == ws_conn_data.id){
					last_conn = 0
				}
			}
		}
	if (last_conn){
		clog("DELlast_conn" ,ws_conn_data.id)
		delete msto.user_data_local[ws_conn_data.id]
	}

	}
}

glob_u.cb.ws.reg_cb(connection_info_handler,"WS_MESSAGE:ws_sto","connection_info_handler")



function ds_test3(){
	glob_u.cb.ws.reg_cb(ord_init_once,"WS_OPEN:","ord_init_once")
	ws_reload()
}

glob_u.fns.get_local_sto_id = get_local_sto_id
glob_u.fns.get_ws_channel_name = get_ws_channel_name
glob_u.fns.get_session_sto_id = get_session_sto_id

// console.log("??...")


// clog("???")
// 




// glob_u.fns.get_room_name=get_room_name
// window.ds_test=ds_test
// glob_u.fns.ds_test=ds_test
// window.msto_prx=msto_prx

})()