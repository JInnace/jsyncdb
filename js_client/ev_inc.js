clog=console.log


function eval_txtarea(){
	var exe = $(".eval_txt")[0].value
	// if ()
	var is_empty = exe.replace(/\s/g,"")
	if (!is_empty){return}

	var r = {
		exe
	}

	// r.exe = exe
    try {
      exe = exe.replace(/[“”]/g,'"')
      exe = exe.replace(/[’‘]/g,"'")

      // eval($(".eval_txt")[0].value)
      r.result = eval(exe)
      r.status = 0
    } catch (err){
    	r.err=err
      r.result = err
      console.error(err)
      // clog(err + "...")
      // $(".eval_result")[0].innerHTML=err+""
      r.status = "error"
    }
    glob_u.data.eval_history.unshift(r)
    $(".eval_txt")[0].value = ""
    glob_u.data.eval_tmp = ""
    glob_u.data.eval_index = -1
    $(".eval_result")[0].innerHTML =r.result


}

function set_text_area(index){

	if(index == -1){
		$(".eval_txt")[0].value = glob_u.data.eval_tmp 
	} else {
		var o = glob_u.data.eval_history[index]
		$(".eval_txt")[0].value = o.exe
		if (o.status == "err"){

		} else {

		}
		$(".eval_result")[0].innerHTML = `[${index}] result when run:\n` + o.result
	}
}

function mv_eval_index(chr){
	// if (chr == "b")
	var eval_len = glob_u.data.eval_index.length 
  	switch (chr){
  		case "b":
  		if (glob_u.data.eval_index >= eval_len-1){
  			// no_further
  			clog("no_further +")
  		} else if(glob_u.data.eval_index == -1) {
  			glob_u.data.eval_tmp = $(".eval_txt")[0].value
  			glob_u.data.eval_index += 1
  			set_text_area(glob_u.data.eval_index)


  		} else {
  			glob_u.data.eval_index += 1
  			set_text_area(glob_u.data.eval_index)
  		}
  		break
  		case "f":
  			if (glob_u.data.eval_index == 0){
  				glob_u.data.eval_index -= 1
  			set_text_area(glob_u.data.eval_index)
  			$(".eval_result")[0].innerHTML = ""

  			} else if (glob_u.data.eval_index == -1){
  			clog("no_further -")

  			} else{
  				glob_u.data.eval_index -= 1
  			set_text_area(glob_u.data.eval_index)

  			}
  		break
  	}

}


  function _evl_btn_h(event,node){
  	clog("_evl_btn_h",event,node,[event,node])
  	// clog(node.dataset.)
  	switch (node.dataset.ev_type){
  		case "b":
  		clog("case b")
  		mv_eval_index(node.dataset.ev_type)
  		break
  		case "f":
  		clog("case f")
  		mv_eval_index(node.dataset.ev_type)
  		break
  		case "e":
  		clog("case e")
  		eval_txtarea()
  		break
  		case "keyup":
  		if (event.keyCode == 13){
  		eval_txtarea()

  		}
  		clog("case keydown")
  		break
  	}

  }
  function _eval_h(event,node){
  	clog("_eval_h",event,node)
  }
  function _eval_h2(event,node){

    clog([event,node,this])
    $(".eval_result")[0].innerHTML +="."
    try {
      // eval($(".eval_txt")[0].value)
      clog("e",eval(node.value))
    } catch (err){
      console.error(err)
      clog(err + "...")
      $(".eval_result")[0].innerHTML=err+""
    }

   $(".eval_result")[0].innerHTML += event.code+ " : " + (event.shiftKey+0) + " : " + (event.altKey+0)
  }



function add_xtra_shortcut(){
	window.m=msto
}
glob_u.cb.ws.reg_cb(add_xtra_shortcut,"WS_MSTO_INITED","add_xtra_shortcut")



glob_u.data.eval_history = []

glob_u.data.eval_index = -1
glob_u.data.eval_tmp = ""

