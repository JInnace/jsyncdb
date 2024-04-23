function html_info(){
	var get_room_name = window.get_room_name || glob_u.fns.get_room_name

	window?.rldi?.setint?.(400)
	var domain_prefix = location.hostname.split(".").slice(0,-2).join(".")
	var root_div= document.querySelector("#root_div")
	root_div.innerHTML=""
	var n =document.createElement("SPAN",{})
	n.innerHTML = `<div>${domain_prefix}</div><div>room name: ${get_room_name()}</div>
<div><span>jsyncdb:</span><span id="jsyncdb_state">uninitialized</span></div>
	`
	root_div.append(n)
}


function ds_test2(){
	// clog("ds_test2!")
	// window.ds_test ?ds_test():glob_u.fns.ds_test()
	jsyncdb_init_helper()
	// glob_u.fns.ds_test
	// ds_test()
}


// 


function jsyncdb_init_helper(){
	// clog("WS_HELPER")
	var fns = window.glob_u.ws.fns
	var room_name=glob_u.fns.get_room_name()
	// z2="z"

	let ws_protocol = "wss:"
	location.protocol == "https:" ?  "was already set to wss:" : ws_protocol = "ws:"
	var port = location.port || "5000"

	// location.protocol ? 

	var o = {

		include_participants_data:1, 
		include_ws_channel_data:1, // required for participants_data to work
		// msto.participants and msto.ws_channels will be defined in either case so we don't need to handle cases where some users enable this and some don't
		AutoReconnect:false,


		// the following options attributes 


		url:'wss://' + window.location.hostname  +`/djc_srv/ws/chat/${room_name}`,
		url: `wss://${location.hostname}:${port}/echo_c1${location.search}`,
		url: `${ws_protocol}//${location.hostname}:${port}/echo_c1${location.search}`,
		// url: `${ws_protocol}//${location.hostname}:5000/echo${location.search}`,
		// url: `${ws_protocol}//${location.hostname}:5000/echo_all${location.search}`,
		// o.url = 
		socket_name:"ws1",
		ord:glob_u.cb.ws,


		methods:{
		onmessage:fns.onmessage,
		onclose:fns.onclose,
		onerror:fns.onerror,
		onopen:fns.onopen,
		},


		fns:{


		},
	}

	var socket = window.glob_u.fns.connect_ws(o)
	// clog({socket})
}





// if 

window.dev_flag = 1
addEventListener("load",html_info)

// addEventListener("load",ds_test2)


function update_ui(o,scope,info){
	var clog =console.log
	clog("update_ui",{o,scope,info})
	// hard coding stuff that will probably change here
	switch(info.hkey) {
		case "WS_OPEN:":
		$("#jsyncdb_state").text("connecting...")
		break;
		case "WS_CLOSE:":
		$("#jsyncdb_state").text("disconnected")
		break;
		case "WS_MSTO_INITED":
		$("#jsyncdb_state").text("connected")
		break;
		default:
	}
 

}

// function get_room_name() {
// 	// return "room/name"
// 	return "room_name"
// }

glob_u.cb.ws.reg_cb(update_ui,"WS_OPEN:","update_ui")
glob_u.cb.ws.reg_cb(update_ui,"WS_CLOSE:","update_ui")
glob_u.cb.ws.reg_cb(update_ui,"WS_MSTO_INITED","update_ui")

// addEventListener("load",db_display)

// msto.example = {key:"val",z:"undefined"}
// clog("??")
