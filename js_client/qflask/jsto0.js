msto_z = {
	conference:{
		events:{},
	},
	participants:{},
	ws_channels:{},
}
// glob_u.fns.get_local_sto_id = get_local_sto_id
// glob_u.fns.get_ws_channel_name = get_ws_channel_name
// glob_u.fns.get_session_sto_id = get_session_sto_id






function get_local_sto_id(){
	return glob_u.data.jsync_local_id
}
function get_session_sto_id(){
	return glob_u.data.jsync_session_id
}

function get_ws_channel_name(){
	return glob_u.data.channel_name

}