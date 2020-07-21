"use strict";
var express = require('express');
var router = express.Router();
const path = require('path');

let json2array=function (json){
	let result;
    let result1=[];
    // console.log(json)
    for(let i=0;i<json.length;i++){
    result = [];
    let temp=json[i];
    var keys = Object.keys(temp);
    keys.forEach(function(key){
        result.push(temp[key]);
    });
    result1.push(result);
    }
    return result1;
};

router.post('/insert', (req, res) => {
	let client=req.db;
	let date_ob = new Date();
	let date = ("0" + date_ob.getDate()).slice(-2);
	let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
	let year = date_ob.getFullYear();
	let hours = date_ob.getHours();
	let minutes = date_ob.getMinutes();
	let seconds = date_ob.getSeconds();
	let dates= year+ '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
	
	let values = req.body.array;
	
	values=json2array(values);
	
	for(let i=0;i<values.length;i++){
		values[i].push(dates);
		for(let j=0;j<7;j++){
			values[i][j]=values[i][j].toUpperCase();
			}
	}
	console.log(values);
	// console.log(values)
	let insert='INSERT INTO RBEI_TOOL_REUSE_REP_T_MD_OBJ_TAG_REPO (MODULE,SUB_MODULE,OBJECT_TYPE,OBJECT_NAME,SYSTEM_ID,TAG_DOMAIN,TAGS,FUNC_GROUP,DEV_CLASS,REUSPR,CONTACT_ID,CONTACT_GROUP,DOCUMENT_LINK,DESCRIPTION,C_CREATED_BY,C_CREATED_ON) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
	client.prepare(insert,(err,statement)=>{

		if(!err){
			statement.exec(values,(error,result)=>{
				if(!error){
					console.log(result);
					let response={rows_inserted:result};
					res.send(response);
				}
				else{
				let status=statement.getRowStatus();
				let msg={status,message:error.message};
				console.log(msg);
				res.send(msg);
			}
			});
			
		}
		
		else{
			res.send(err);
			console.log(err);
		}

	});

});

router.get('/sample',(req,res)=>{
	let file=path.join(__dirname,'../data_collection_sample/Data_Collection_Template.xlsx');
	console.log(__dirname);
	console.log(file);
	res.sendFile(file);
});


module.exports = router;