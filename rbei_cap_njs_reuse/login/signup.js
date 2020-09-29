const express = require('express')
const router = express.Router()
const triggerEmail=require('../email/email.js')

 router.post('/signup', async (req, res) => {
 	
 	let {email,idno,name,ntid,dept,username}=req.body
 	let client=req.db;
 	if(!email.endsWith('bosch.com')){
 		return res.status(400).send({msg:'not a bosch user'})
 	}
 	let usernameQ="select USERNAME from RBEI_TOOL_REUSE_REP_T_MD_USER where USERNAME='"+username+"'"
 	try{
 	let usernamelist= await client.exec(usernameQ)
 	
 	if(usernamelist.length>0){
 		return res.status(400).send({msg:"user name already exist"})
 	}
 	
 	let userinsertQ="insert into RBEI_TOOL_REUSE_REP_T_MD_USER (EMAIL_ID,IDNO,NAME,NTID,DEPT,USERNAME,TYPE,REGD_ON,STATUS) values('"+email+"','"+idno+"','"+name+"','"+ntid+"','"+dept+"','"+username+"','U',CURRENT_TIMESTAMP,'')"
 	
 	let result= await client.exec(userinsertQ)
 	// console.log(result)
 	let adminsQ="select EMAIL_ID FROM RBEI_TOOL_REUSE_REP_T_MD_USER where TYPE='A'";
 	let admin=await client.exec(adminsQ)
 	let admins=[]
 	// console.log(admin)
 	for(let i=0;i<admin.length;i++){
 		// console.log(admin[i].EMAIL_ID)
 		admins.push(admin[i].EMAIL_ID)
 	}
 	let content={}
 	content.to=admins.toString()
 	content.subject='New User registration'
 	content.html=`<p>${name} has registered to your application with ${email}.<p><br>
 	<p>Please validate the user<p>`
 	// console.log(content)
 	let temail=await triggerEmail(content)
 	// console.log(temail)
 	res.status(201).send({msg:'user created. Approval in progress'})
 	}
 	catch(e){
 		// console.log(e)
 		if(e.code===301){
 			return res.status(400).send({msg:'email already exist'})
 		}
 		res.status(500).send(e)
 		console.log(e)
 	}
 })
 
 module.exports = router