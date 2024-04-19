"use strict";

// makestache template info {{{makestache_template_info}}}
// the following string tells my make scripts its fine to overwtite this the library would have had a template str in the middle of the str
// BUILT_FILE_{{{"makestache_template"}}}OVERWRITE_ALLOWED
// {{{out_file_hint>jsync_lib*js}}} ... {{{output_filename}}}
{{#is_makestache_template}}
THIS_FILE_IS_A_MAKESTACHE_TEMPLATE
{{/is_makestache_template}}
// /* */ 

(function (){
var isProxy,tlu,msto_z
var pf,msto_prx


// jsync:dep.js
// ------------------------------------------------------------------------------------------------
{{{jsync_dep*js}}}
// jsync:ord.js
// ------------------------------------------------------------------------------------------------
{{{jsync_ord*js}}}
// jsync:ws.js
// ------------------------------------------------------------------------------------------------
{{{jsync_ws*js}}}
// jsync:sto.js
// ------------------------------------------------------------------------------------------------
{{{jsync_sto*js}}}
// jsync:init.js
// ------------------------------------------------------------------------------------------------
{{{jsync_init*js}}}

// jsync:test.js
// ------------------------------------------------------------------------------------------------
{{{jsync_test*js}}}




// glob_u.fns.get_room_name=get_room_name
// window.ds_test=ds_test
// glob_u.fns.ds_test=ds_test
// window.msto_prx=msto_prx

})()