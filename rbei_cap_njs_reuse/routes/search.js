"use strict";
var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
	let str=req.query.search;
	let client=req.db;
	let query="SELECT top 7 OBJECT_NAME,tags,score() as score FROM RBEI_TOOL_REUSE_REP_T_MD_OBJ_TAG_REPO WHERE CONTAINS (tags, '"+str+"', FUZZY (0.7,'similarCalculationMode=searchCompare')) order by score desc";
	console.log(query);
	client.exec(query,(error,result)=>{
		if(!error){
			res.send(result);
			// console.log(result);
		}
	});
});

router.get('/tag',(req,res)=>{
	let tag=req.query.tag;
	let client=req.db;
	let query="select MODULE,SUB_MODULE,OBJECT_TYPE,OBJECT_NAME,SYSTEM_ID,DEV_CLASS,REUSPR from RBEI_TOOL_REUSE_REP_T_MD_OBJ_TAG_REPO where tags='"+tag+"'";
	// console.log(query);
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