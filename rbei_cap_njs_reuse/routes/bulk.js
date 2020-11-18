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

let json2array=function (json,id){
	
	let value={
		value:[],
		teams:[],
		usage:[]
	};
	for(let i=4;i<json.length;i++,id++){
		var row=[];
		var teams=[]
		var usage=[]
		// console.log(json[i])//ABFGHI  126789
		row.push(id)
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
		// row.push(json[i].O);
		// row.push(json[i].P);
		row.push(json[i].Q);
		row.push(json[i].R);
		// console.log(row)
		value.value.push(row);
		teams.push(id)
		usage.push(id)
		teams.push(json[i].O.split(','))
		usage.push(json[i].P.split(','))
		value.teams.push(teams)
		value.usage.push(usage)
	}
	return value;
};

let arr_to_2d=(a)=>{
	let b=[];

	for(let i=0;i<a.length;i++){
	    let id=a[i][0];
	    for(let j=0;j<a[i][1].length;j++){
	        var temp=[]
	        temp.push(id)
	        temp.push(a[i][1][j])
	        b.push(temp)
	    }
	}
	return b;
}

const upload=multer();

router.post('/insert', upload.single('file'), async(req, res) => {
	let client=req.db;
	
	let q_id_query='SELECT 	max("A_ID") as A_ID FROM "RBEI_TOOL_REUSE_REP_T_MD_OBJ_TAG_REPO" '
	let a_id= await client.exec(q_id_query);
	if(a_id.length==0){
		a_id=1
	}
	else{
		a_id=a_id[0].A_ID;
	}
	console.log(a_id,a_id);
	
	let date_ob = new Date();
	let date = ("0" + date_ob.getDate()).slice(-2);
	let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
	let year = date_ob.getFullYear();
	let hours = date_ob.getHours();
	let minutes = date_ob.getMinutes();
	let seconds = date_ob.getSeconds();
	let dates= year+ '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
	
	let file=req.file.buffer;
	// console.log(file);
    const value = excelToJson({
        source:file
    });
	// console.log(value);
	
	let uploded_by=req.body.email;
	
	let valuess=json2array(value.Data,a_id+1);
	let teams=valuess.teams
	let usage=valuess.usage
	
	teams=arr_to_2d(teams)
	usage=arr_to_2d(usage)
	
	// console.log(teams)
	// console.log(usage)
	
	let values=valuess.value
	// console.log(values)
	
	for(let i=0;i<values.length;i++){
		if(values[i][16]==undefined){
			values[i][16]=0;
		}
		for(let j=0;j<17;j++){
			
			if(values[i][j]==undefined){
				values[i][j]='N/A';
			}
		}
		values[i][1]=values[i][1].toLowerCase();
		values[i][2]=values[i][2].toUpperCase();
		values[i][6]=values[i][6].toUpperCase();
		values[i][7]=values[i][7].toUpperCase();
		values[i][8]=values[i][8].toUpperCase();
		values[i][9]=values[i][9].toUpperCase();
		values[i].push(uploded_by);
		values[i].push(dates);
	}
	// console.log(values);
	// console.log(values)ID,MODULE,SUB_MODULE,OBJECT_TYPE,OBJECT_NAME,SYSTEM_ID,TAG_DOMAIN,TAGS,FUNC_GROUP,DEV_CLASS,REUSPR,CONTACT_ID,CONTACT_GROUP,DOCUMENT_LINK,DESCRIPTION,C_CREATED_BY,
	let insertq='INSERT INTO RBEI_TOOL_REUSE_REP_T_MD_OBJ_TAG_REPO (A_ID,TAGS,TAG_DOMAIN,DEV_CLASS,FUNC_GROUP,SYSTEM_ID,MODULE,SUB_MODULE,OBJECT_TYPE,OBJECT_NAME,DESCRIPTION,REUSPR,CONTACT_ID,CONTACT_GROUP,DOCUMENT_LINK,IMPL_STEPS,EFFORTS_SAVED,C_CREATED_BY,C_CREATED_ON) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
	
	let t_insert='INSERT INTO "RBEI_TOOL_REUSE_REP_T_TARGET_TEAMS" (A_ID,TARGET_TEAM) VALUES(?,?)'
	let u_insert='INSERT INTO "RBEI_TOOL_REUSE_REP_T_USAGE_SCEN" (A_ID,USAGE_SCEN) VALUES(?,?)'
	

		client.prepare(t_insert,(e,s)=>{
		if(!e){
			s.exec(teams,(err,t_result)=>{
				if(!err){
					return// return console.log(t_result)
				}
				console.log(err)
				})
			}
		})
		
		client.prepare(u_insert,(e,s)=>{
		if(!e){
			s.exec(usage,(err,t_result)=>{
				if(!err){
					return// return console.log(t_result)
				}
				console.log(err)
				})
			}
		})
		
	
	client.prepare(insertq,(err,statement)=>{
		if(!err){
			statement.exec(values, async (error,result)=>{
				if(!error){
					// console.log(result);
					let status=statement.getRowStatus();
					let msg={status,message:'All rows inserted scussfully'};
					res.send(msg);
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
	// console.log(__dirname);
	// console.log(file);
	res.sendFile(file);
});


module.exports = router;