

function set_rld_int(){rldi.setint(600)}
if (document.readyState != "complete"){
	window.addEventListener("load",set_rld_int)
} else {set_rld_int()}


clog("QFLASK")


function rfn_construct(){
	clog("RFN:construct")
	return Reflect.construct(...arguments)
}

ws_prx = {
	construct: rfn_construct,
}


function dec_socket(){
	clog("WebSocket!!!")
	window.WebSocket_orig =window.WebSocket_orig || WebSocket
	window.WebSocket_prx = new Proxy(window.WebSocket_orig,ws_prx)
	window.WebSocket = window.WebSocket_prx
// URL = new Proxy(URL_orig,rprox2)


}



dec_socket()


s = new WebSocket("wss://jsyncdb.com/djc_srv/ws/chat/sto_demo")