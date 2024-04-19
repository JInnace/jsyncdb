








function jsyncdb_init_helper(){
	// clog("WS_HELPER")
	var fns = window.glob_u.ws.fns
	var room_name=glob_u.fns.get_room_name()

	let ws_protocol = "wss:"
	location.protocol == "https:" ?  "was already set to wss:" : ws_protocol = "ws:"

	var o = {

		include_participants_data:1, 
		include_ws_channel_data:1, // required for participants_data to work
		// msto.participants and msto.ws_channels will be defined in either case so we don't need to handle cases where some users enable this and some don't
		AutoReconnect:false,


		// the following options attributes 

		
		url:'wss://' + window.location.hostname  +`/djc_srv/ws/chat/${room_name}`,
		url: `${ws_protocol}//${location.hostname}:5000/echo_c1${location.search}`,
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
// window.dev_flag = 1
function set_rldi_int(){
	window?.rldi?.setint?.(400)
}
addEventListener("load",set_rldi_int)
jsyncdb_init_helper()

// window?.rldi?.setint?.(400)
// window.rldi.setint(400)
// clog("????")
