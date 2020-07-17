"use strict";
var express = require('express');
var router = express.Router();

router.get('/search', (req, res) => {
	let client=req.db;
	let module=req.query.module;
	let sub_module=req.query.sub_module;
	let query;
	if(!module && !sub_module){
		 query="SELECT  distinct MODULE FROM RBEI_TOOL_REUSE_REP_T_MD_OBJ_TAG_REPO where TAG_DOMAIN='D'";
	}
	else if(module && !sub_module){
		// module=module.toUpperCase();
		query="SELECT  distinct SUB_MODULE FROM RBEI_TOOL_REUSE_REP_T_MD_OBJ_TAG_REPO WHERE MODULE='"+module+"'and TAG_DOMAIN='D'";
	}
	else{
		// module=module.toUpperCase();
		// sub_module=sub_module.toUpperCase();
		query="SELECT  MODULE,SUB_MODULE,OBJECT_TYPE,OBJECT_NAME,SYSTEM_ID FROM RBEI_TOOL_REUSE_REP_T_MD_OBJ_TAG_REPO where MODULE='"+module+"' and SUB_MODULE='"+sub_module+"' and TAG_DOMAIN='D'";
	}
	console.log(query);
	client.exec(query,(error,result)=>{
		if(!error){
			res.send(result);
			// console.log(result);
		}
		else{
			res.send(error);
		}
	});
});

router.get('/domain',(req,res)=>{
	let client=req.db;
	let domain=req.query.type;
	let query="select * from RBEI_TOOL_REUSE_REP_T_MD_OBJ_TAG_REPO where TAG_DOMAIN='"+domain+"'";
	client.exec(query,(error,result)=>{
		if(!error){
			res.send(result);
		}
		else{
			res.send(error);
		}
	});
});

module.exports = router;
