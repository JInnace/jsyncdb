function db_display(){


	if(!window.msto_prx){
		return
	}	

	var db = jc(msto_prx)

	var k,v
	var pretty = {}
	var ws_channel = glob_u.fns.get_ws_channel_name()
	var id = glob_u.fns.get_local_sto_id()
	for ([k,v] of Object.entries(db)){
		if (k == "ws_channels"){
			pretty["SPAN_OPEN"]="1"
		}
		if (k == "participants"){
			pretty["SPAN_A2"]="1"
		}
		pretty[k] = v
		
		if (k == "ws_channels"){
			pretty["SPAN_CLOSE"]="1"
		}
		if (k == "participants"){
			pretty["SPAN_B2"]="1"
		}


	}
	db = jc(pretty)
	pretty.participants = {}
	pretty.ws_channels = {}
	
	for ([k,v] of Object.entries(db.participants)){
		if (k == id){
			pretty.participants["SPAN_2"]="1"
		}
		pretty.participants[k] = v
		if (k == id){
			pretty.participants["SPAN_C2"]="1"
		}
	} 
	for ([k,v] of Object.entries(db.ws_channels)){
		if (k == ws_channel){
			pretty.ws_channels["SPAN_2"]="1"
		}
		pretty.ws_channels[k] = v
		if (k == ws_channel){
			pretty.ws_channels["SPAN_C2"]="1"
		}
	} 
	

	var json_str = JSON.stringify(pretty,"","   ")
	json_str = json_str.replaceAll(/\s+"SPAN_OPEN[^\n<]*/g,'<span class="wperm">')
	json_str = json_str.replaceAll(/\s+"SPAN_A2[^\n<]*/g,'<span class="wperm">')
	json_str = json_str.replaceAll(/\s+"SPAN_CLOSE[^\n<]*/g,"</span>")
	json_str = json_str.replaceAll(/\s+"SPAN_B2[^\n<]*/g,"</span>")


	json_str = json_str.replaceAll(/\s+"SPAN_2.*/g,'<span class="wperm2">')
	json_str = json_str.replaceAll(/\s+"SPAN_C2.*/g,"</span>")
	// clog(json_str)
	$(".db_disp")[0].innerHTML = json_str
}

// glob_u.fns.get_ws_channel_name

window.nginx_v1_t2 = {
	"target_server_name":`<!--#echo var="target_server_name"-->`,
	"ssl_server_name":`<!--#echo var="ssl_server_name"-->`,

    ssl_certificate: `/etc/letsencrypt/live/<!--#echo var="target_server_name"-->/fullchain.pem`,
    ssl_certificate_key: `/etc/letsencrypt/live/<!--#echo var="target_server_name"-->/privkey.pem`,

}

glob_u.cb.ws.reg_cb(db_display,"WS_MESSAGE:","db_display",101)
db_display()
