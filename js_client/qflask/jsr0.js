
function init_mu(){

	var k,v
	clog("INIT_MU",performance.now())
	var rr = {}
	var prom1 = new Promise(pfnf(rr));
	prom1.then(init_db).then(ws_sto_connected)
	glob_u.prom.init_db_resolve_timeout_arg = {aaa:"timedout",pl:msto_z}

	setTimeout(rr.resolve,5000,glob_u.prom.init_db_resolve_timeout_arg)
	var rn = ((Math.random()+"").replace("0.","") - 0).toString(16)

	tmsgx4({sto_event_type:"db_sync_request","CLIENT_KEY":"ws_sto",request_rn:rn})
	clog("tmsgx4 iunit_mu",tmsgx4)
	glob_u.prom.init_db_resolve = rr.resolve
	glob_u.prom.init_db_resolve.rn = rn

}




function init_db(objx){
	// clog("init_db~")
	console.trace("init_db")
	trc_sto("init_db",{})
	glob_u.prom.init_db_resolve.resolved=1
	var glob_mx = glob_u.data
		var obj

	if (objx.participants){obj = objx} else {obj = objx.pl}
pf = new Proxy_Permissions({},"pf")
msto_prx = new Proxy(obj,pf)
window.msto_prx=msto_prx
// window.msto_prx0 =msto_prx
pf.init(msto_prx)
msto_prx.walker_start(msto_prx)
glob_mx.init_db=true

var dbl_proxy_obj = {
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
window.msto=new Proxy(msto_prx, DBL_Proxy)


}




function init_mu_delay(argument) {
	// body...
	clog("INIT_MU DELAYED",performance.now())
	setTimeout(init_mu,100)
	
}


addEventListener("load",init_mu_delay)
rldi.setint(500)
window.rld_int=500

