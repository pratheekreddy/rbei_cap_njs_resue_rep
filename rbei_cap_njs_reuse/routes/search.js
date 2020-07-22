"use strict";
var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
	let str=req.query.search;
	let limit=req.query.limit;
	let tag_domain=req.query.tag_domain;
	let module=req.query.module;
	let sub_module=req.query.sub_module;
	if(!tag_domain){
		tag_domain='D';
	}
	let query="";
	if(!limit){
		limit=7;
	}
	let client=req.db;
	if(!module){
		query="SELECT top "+limit+" OBJECT_NAME,tags,score() as score FROM RBEI_TOOL_REUSE_REP_T_MD_OBJ_TAG_REPO WHERE CONTAINS (tags, '"+str+"', FUZZY (0.7,'similarCalculationMode=searchCompare')) and TAG_DOMAIN='"+tag_domain+"' order by score desc";
	}
	else if(!sub_module){
		query="SELECT top "+limit+" OBJECT_NAME,tags,score() as score FROM RBEI_TOOL_REUSE_REP_T_MD_OBJ_TAG_REPO WHERE CONTAINS (tags, '"+str+"', FUZZY (0.7,'similarCalculationMode=searchCompare')) and TAG_DOMAIN='"+tag_domain+"'and MODULE='"+module+"' order by score desc";
	}
	else{
		query="SELECT top "+limit+" OBJECT_NAME,tags,score() as score FROM RBEI_TOOL_REUSE_REP_T_MD_OBJ_TAG_REPO WHERE CONTAINS (tags, '"+str+"', FUZZY (0.7,'similarCalculationMode=searchCompare')) and TAG_DOMAIN='"+tag_domain+"'and MODULE='"+module+"' and SUB_MODULE='"+sub_module+"' order by score desc";
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

router.get('/result',(req,res)=>{
	let tag=req.query.tag;
	let module=req.query.module;
	let sub_module=req.query.submodule;
	let tag_domain=req.query.tag_doamin;
	let client=req.db;
	let query="";
	if(!tag){
		if(!module & !sub_module){
		query="select MODULE,SUB_MODULE,OBJECT_TYPE,OBJECT_NAME,SYSTEM_ID,DEV_CLASS,REUSPR from RBEI_TOOL_REUSE_REP_T_MD_OBJ_TAG_REPO where TAG_DOMAIN='"+tag_domain+"'";
	}
	else if(!sub_module){
		query="select MODULE,SUB_MODULE,OBJECT_TYPE,OBJECT_NAME,SYSTEM_ID,DEV_CLASS,REUSPR from RBEI_TOOL_REUSE_REP_T_MD_OBJ_TAG_REPO where TAG_DOMAIN='"+tag_domain+"' and MODULE='"+module+"'";
	}
	else{
		query="select MODULE,SUB_MODULE,OBJECT_TYPE,OBJECT_NAME,SYSTEM_ID,DEV_CLASS,REUSPR from RBEI_TOOL_REUSE_REP_T_MD_OBJ_TAG_REPO where TAG_DOMAIN='"+tag_domain+"' and MODULE='"+module+"' and SUB_MODULE='"+sub_module+"'";
	}
	}else{
	if(!module & !sub_module){
		query="select MODULE,SUB_MODULE,OBJECT_TYPE,OBJECT_NAME,SYSTEM_ID,DEV_CLASS,REUSPR from RBEI_TOOL_REUSE_REP_T_MD_OBJ_TAG_REPO where TAG_DOMAIN='"+tag_domain+"' and tags='"+tag+"'";
	}
	else if(!sub_module){
		query="select MODULE,SUB_MODULE,OBJECT_TYPE,OBJECT_NAME,SYSTEM_ID,DEV_CLASS,REUSPR from RBEI_TOOL_REUSE_REP_T_MD_OBJ_TAG_REPO where TAG_DOMAIN='"+tag_domain+"' and tags='"+tag+"' and MODULE='"+module+"'";
	}
	else{
		query="select MODULE,SUB_MODULE,OBJECT_TYPE,OBJECT_NAME,SYSTEM_ID,DEV_CLASS,REUSPR from RBEI_TOOL_REUSE_REP_T_MD_OBJ_TAG_REPO where TAG_DOMAIN='"+tag_domain+"' and tags='"+tag+"' and MODULE='"+module+"' and SUB_MODULE='"+sub_module+"'";
	}
	}
	console.log(query);
	client.exec(query,(error,result)=>{
		if(!error){
			res.send(result);
		}
	});
	
});

router.get('/drill',(req,res)=>{
	
	let module=req.query.module;
	let sub_module=req.query.sub_module;
	let object_type=req.query.object_type;
	let object_name=req.query.object_name;
	let id=req.query.system_id;
	let client=req.db;
	let query="select * from RBEI_TOOL_REUSE_REP_T_MD_OBJ_TAG_REPO where MODULE='"+module+"'and SUB_MODULE='"+sub_module+"'and OBJECT_TYPE='"+object_type+"'and OBJECT_NAME='"+object_name+"'and SYSTEM_ID='"+id+"'";
	console.log(query);
	client.exec(query,(error,result)=>{
		if(!error){
			res.send(result);
		}
	});
});

module.exports = router;