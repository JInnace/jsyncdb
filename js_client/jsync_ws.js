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
	setTimeout(this.params.fns.reconnect,1000)
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
