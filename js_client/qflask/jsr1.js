function pfnf(o){
	return  function(resolve, reject){
		o.resolve=resolve
		o.reject=reject
	}
}




function ws_sto_connected(argument) {
	// body...
	clog("ws_sto_connected DO NOTHING")
	glob_u.prom.init_db_resolve.resolved_inited = 1
	glob_u.prom.init_db_resolve.resolved_inited = 2
}

clog("....")