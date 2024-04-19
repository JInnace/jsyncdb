
// window.w = window.w || {}


// w.clog = console.log
var clog = console.log
// var clog = w.clog

// clog("??")
function nop(){}

window.glob_u = window.glob_u || {
	cb:{},
	fns:{},
	cls:{},
	tvar:{},
	data:{},
	prom:{},
	rrefs:{},
	xj:{},
	templates:{},
}

glob_u.fns.gen_sort_attr = function gen_sort_attr(attr){
	return function gsort(a0,a1){
		if (a0[attr] > a1[attr]){
		return 1
		} else if (a0[attr] < a1[attr]){
		return -1
		} else {
		return 0
		}
	}
}
glob_u.fns.find_attr = function find_attr(elm,indx,arr){
	if (elm && elm[this.attr] == this.val){
		return 1
	}
}

glob_u.fns.splice_out = function splice_out(arr,elm){
	let i = arr.indexOf(elm)
	if (i != -1){
		return arr.splice(i,1)
	}
}



function jclone(obj){
	return Array.isArray(obj) ?  $.extend(true,[],obj) :  $.extend(true,{},obj)
}
function jx(obj){
	return JSON.parse(JSON.stringify(obj))
}

function jclone_rval(obj){
	if (typeof(obj) != "object"){
		return obj
	} else if (Array.isArray(obj)) {
		return $.extend(true,[],obj)
	} else {
		return $.extend(true,{},obj)
	}

}

// window.jc = jclone
window.jc = jclone_rval





// TODO:JFI eventually merge 
// j9\dev_dep\misc_dev.js

glob_u.fns.gen_ord_decs = function(ord,cb_prefix){
	var reg_cb = function(cb,key_name,cb_name,override_level,push){
		return ord.reg_cb(cb,cb_prefix+key_name,cb_name,override_level,push)
	}

	var run_cbs_lz = function(key,arg_obj,lazy=1){
		if (lazy && cb_prefix+key in ord.cb_sto){
			return ord.run_cbs(cb_prefix+key,arg_obj)
		}
	}
	var run_cbs = function(key,arg_obj){
			return ord.run_cbs(cb_prefix+key,arg_obj)
		// split out later maybe?
	}
	function req_batch_run(key,arg_obj,combine){
			return ord.req_batch_run(cb_prefix+key,arg_obj)

	}

	reg_cb.ord = ord
	reg_cb.cb_prefix = cb_prefix
	run_cbs.ord = ord
	run_cbs.cb_prefix = cb_prefix

	run_cbs_lz.ord = ord
	run_cbs_lz.cb_prefix = cb_prefix
	return {reg_cb,run_cbs,run_cbs_lz,req_batch_run}
}


// duplicated in jdev0
glob_u.fns.merge_partial_template = function merge_partial_template(main,template){
	let t = $.extend(true,{},template,main)
	return $.extend(true,main,t)
}

