
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