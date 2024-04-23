




function on_sio_msg(){
	clog("on_sio_msg",arguments,this)

}
function on_jio_msg(msg){
	clog("on_jio_msg",arguments,this)
	var scope="PLACEHOLDER_scope" 
	var info="PLACEHOLDER_info" 
	var _o={
		msg,
		data:JSON.parse(msg),
	} 
	mhndlr_rld_2(_o,scope,info)

}
function onAny(){
	clog("onAny",arguments,this)

}
function on_sio_open(){
	clog("on_sio_open",arguments,this)
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
return "rx1"
}

function create_sio_conn(){
	var conn = {

	}
	// var socket = io.connect('http://' + document.domain + ':' + location.port + "/echo");
	// namespace
	opts = {
		// path:"rx2",

		"qstr":"QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ"
	}
	var socket = io.connect('http://' + document.domain + ':' + location.port + `?room=${get_room_name()}`,opts);
	// var socket = io.connect('http://' + document.domain + ':' + location.port + `?room=z`,opts);
	// var socket = io.connect('http://' + document.domain + ':' + location.port ,opts);
	conn.socket = socket

        socket.on('connect', on_sio_open);
        socket.on('response', on_sio_msg);
        socket.on('jsync.io', on_jio_msg);
        socket.on('jsync.io2', on_jio_msg);
        socket.on('message', on_sio_msg);
        socket.onAny( onAny);


	return conn

}
// mhndlr_rld_2
function tmsgx4(m){
	var socket = glob_u.ws.sockets.ws1
	// var jsend = socket.params.fns.jsend
	var t = {
		key:"tmp_dev_sto",
	}
	glob_u.fns.merge_partial_template(m,t)
	// clog("tmsgx4",{key:m.key,sto_event_type:m.sto_event_type,CLIENT_KEY:m.CLIENT_KEY},{m,t})
	trc_sto("tmsgx4",m)

	// jsend(m)
	// JSON.stringify(m)
	// glob_u.ws.sockets.sio1.socket.emit("jsync.io",JSON.stringify(m))
	glob_u.ws.sockets.sio1.socket.emit("jsync.io2",JSON.stringify(m))
	// glob_u.ws.sockets.sio1.socket.emit("jsync.io.all",JSON.stringify(m))

}




window.glob_u.ws = window.glob_u.ws || {
	sockets:{},
	fns:{},
	flags:{},
} 


glob_u.ws.sockets.sio1 = create_sio_conn()