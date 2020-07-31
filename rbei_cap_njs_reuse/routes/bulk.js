"use strict";
var express = require('express');
var router = express.Router();
const path = require('path');
const excelToJson = require('convert-excel-to-json');
const multer=require('multer');



// let json2array=function (json){
// 	let result;
//     let result1=[];
//    // let json=json1.Sheet1;
//     // console.log(json)
//     for(let i=4;i<json.length;i++){
//     result = [];
//     let temp=json[i];
//     var keys = Object.keys(temp);
//     keys.forEach(function(key){
//         result.push(temp[key]);
//     });
//     result1.push(result);
//     }
//     return result1;
// };

let json2array=function (json){
	
	let value=[];
	for(let i=4;i<json.length;i++){
		var row=[];
		
		// console.log(json[i])//ABFGHI  126789
		row.push(json[i].A);
		row.push(json[i].B);
		row.push(json[i].C);
		row.push(json[i].D);
		row.push(json[i].E);
		row.push(json[i].F);
		row.push(json[i].G);
		row.push(json[i].H);
		row.push(json[i].I);
		row.push(json[i].J);
		row.push(json[i].K);
		row.push(json[i].L);
		row.push(json[i].M);
		row.push(json[i].N);
		value.push(row);
	}
	return value;
};

const upload=multer();

router.post('/insert', upload.single('file'),(req, res) => {
	let client=req.db;
	let date_ob = new Date();
	let date = ("0" + date_ob.getDate()).slice(-2);
	let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
	let year = date_ob.getFullYear();
	let hours = date_ob.getHours();
	let minutes = date_ob.getMinutes();
	let seconds = date_ob.getSeconds();
	let dates= year+ '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
	
	// let values = req.body.array;
	let file=req.file.buffer;
	// console.log(file);
    const value = excelToJson({
        source:file
    });
	// console.log(value);
	
	let uploded_by='pratheekreddy.katta@in.bosch.com';
	let values=json2array(value.Sheet1);
	for(let i=0;i<values.length;i++){
		for(let j=0;j<14;j++){
			if(values[i][j]==undefined){
				values[i][j]='N/A'
			}
		}
		values[i][0]=values[i][0].toUpperCase()
		values[i][1]=values[i][1].toUpperCase()
		values[i][5]=values[i][5].toUpperCase()
		values[i][6]=values[i][6].toUpperCase()
		values[i][7]=values[i][7].toUpperCase()
		values[i][8]=values[i][8].toUpperCase()
		values[i].push(uploded_by);
		values[i].push(dates);
		// for(let j=0;j<7;j++){
		// 	values[i][j]=values[i][j].toUpperCase();
		// 	}
	}
	console.log(values);
	// console.log(values)MODULE,SUB_MODULE,OBJECT_TYPE,OBJECT_NAME,SYSTEM_ID,TAG_DOMAIN,TAGS,FUNC_GROUP,DEV_CLASS,REUSPR,CONTACT_ID,CONTACT_GROUP,DOCUMENT_LINK,DESCRIPTION,C_CREATED_BY,
	let insertq='INSERT INTO RBEI_TOOL_REUSE_REP_T_MD_OBJ_TAG_REPO (TAGS,TAG_DOMAIN,DEV_CLASS,FUNC_GROUP,SYSTEM_ID,MODULE,SUB_MODULE,OBJECT_TYPE,OBJECT_NAME,DESCRIPTION,REUSPR,CONTACT_ID,CONTACT_GROUP,DOCUMENT_LINK,C_CREATED_BY,C_CREATED_ON) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
	client.prepare(insertq,(err,statement)=>{

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