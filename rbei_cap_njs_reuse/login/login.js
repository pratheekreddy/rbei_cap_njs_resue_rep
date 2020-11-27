"use strict";
var express = require('express');
var router = express.Router();
const triggerEmail=require('../email/email.js')

router.get('/otp',async(req,res)=>{
    console.log('Inside get otp route')
	try{
	let userid=req.query.user
	if(userid===undefined){
		let userid=req.query.username
	}
	let userQ="select EMAIL_ID,STATUS from RBEI_TOOL_REUSE_REP_T_MD_USER where (EMAIL_ID='"+userid.toLowerCase()+"' or USERNAME='"+userid+"')"
	console.log(userQ)
	let client=req.db;
	
	let user=await client.exec(userQ)
	console.log(user)
	if(user.length===0){
		return res.status(401).send({ msg : "User not registered "})
	}
	if(user[0].STATUS!='A'){
		return res.status(401).send({ msg : "User is not approved. Please contact Adminstrator!"})
	}
	//TODO: generate, store and send otp
	let otp=Math.round(Math.random() * (900000 - 100000) + 100000);
	let insertQ="update RBEI_TOOL_REUSE_REP_T_MD_USER SET GEN_OTP="+otp+",GEN_OTP_TMSTMP=CURRENT_TIMESTAMP where EMAIL_ID='"+user[0].EMAIL_ID+"'"
	console.log(insertQ)
	let content={}
	content.to=user[0].EMAIL_ID
	content.subject='Login OTP for RBEI-SbS Forum Portal'
	content.html=`<h3>Your OTP is ${otp}. It is valid only for 30 minutes. Do not share it by any means.<h3>`
	let insert= await client.exec(insertQ)
	if(insert===1){
		let temail=await triggerEmail(content)
		console.log(temail)
		res.status(200).send({ msg:"OTP sent to your registered email id!"})
	}
	}
	catch(e){
		console.log(e)
		res.status(500).send(e)
	}
})


router.post('/login', async(req, res) => {
	//destructuring request body
	let {
		user,
		otp
	} = req.body;
	user=user.toLowerCase();
	console.log(user, otp);
	const client = req.db;
	//query to check if OTP is valid.
	let query =
		`SELECT
            EMAIL_ID,
            NAME,
			CASE
				WHEN GEN_OTP = ? THEN
					CASE 
						WHEN SECONDS_BETWEEN(GEN_OTP_TMSTMP, NOW())  <= 1800 THEN 1
						ELSE 0
					END
				ELSE -1
			END AS FLAG,
			TYPE
			FROM RBEI_TOOL_REUSE_REP_T_MD_USER
			WHERE (EMAIL_ID = ? OR USERNAME = ? OR IDNO = ? OR NTID = ?)  AND STATUS = 'A'`;
	try {
		let result = await client.exec(query, [otp, user, user, user, user]);
		console.log(result);

		if (result.length === 0) {
			return res.status(401).send({
				msg: 'unauthorized'
			});
		}
		if (!result[0].FLAG) {
			return res.status(401).send({
				msg: 'OTP expired'
			});
		}
		if (result[0].FLAG === -1) {
			return res.status(401).send({
				msg: 'Invalid OTP'
			});
		}
		const {
			EMAIL_ID,
            TYPE,
            NAME
		} = result[0];

		//query to store token and token generated timestamp in database.
		query =
			`UPDATE RBEI_TOOL_REUSE_REP_T_MD_USER
				SET GEN_RBEI_TOKEN = concat(concat(concat(SYSUUID,SYSUUID),SYSUUID),SYSUUID), GEN_RBEI_TOKEN_TMSTMP = CURRENT_TIMESTAMP
				WHERE EMAIL_ID = ?`;
        await client.exec(query, [EMAIL_ID]);
        query = `SELECT GEN_RBEI_TOKEN FROM RBEI_TOOL_REUSE_REP_T_MD_USER WHERE EMAIL_ID = ?`;
        result = await client.exec(query, [EMAIL_ID]);
		res.send({
			token: result[0].GEN_RBEI_TOKEN,
			type: TYPE,
            email: EMAIL_ID,
            name:NAME
		});
	} catch (error) {
		console.log(error);
	}
})

module.exports=router