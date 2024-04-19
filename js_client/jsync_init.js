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
	// clog("handle_pre_init_msgs")
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


