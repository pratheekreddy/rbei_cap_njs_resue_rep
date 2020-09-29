const cds = require('@sap/cds')

module.exports = cds.service.impl(srv => {
	const {proj_type,team_type,search_result}=srv.entities
	let i;
	srv.after('READ','obj_repo',async (result)=>{

		// for (let each of result){
		// 	if(each.USAGE_SCEN==undefined){
				
		// 	}else{
		// 		if(each.USAGE_SCEN=='N/A'){}else{
		// 	let target=[]
		// 	let filter=each.USAGE_SCEN.split(',')

		// 	if(filter.length>0){
		// 	let list=await cds.run( SELECT.from(proj_type).where('ID in',filter))
		// 		list.forEach(item=>{
		// 			target.push(item.VALUE)
		// 		})

		// 		each.USAGE_SCEN=target
		// 	}
		// 	}
		// 	}
		// 	if(each.TARGET_TEAMS==undefined){}
		// 	else{
		// 		if(each.TARGET_TEAMS=='N/A'){}else{
		// 		let teams=[]
		// 		let tfilter=each.TARGET_TEAMS.split(',')
	
		// 		if(tfilter.length>0){
		// 		let list=await cds.run( SELECT.from(team_type).where('ID in',tfilter))
		// 			list.forEach(item=>{
		// 				teams.push(item.VALUE)
		// 			})
	
		// 			each.TARGET_TEAMS=teams
		// 		}
		// 	}
		// 	}
		// }

	})
	srv.before('READ','search_result', async (req)=>{
		// console.log(req.params)
	})
	
	srv.after('READ',['search_result'], async (result,req)=>{
		let search=req.params[0].TAG
		let flag=''
		if(search===undefined){
			search=req.params[0].SEARCH
		}
		if(search==='*'){
			console.log(search)
		}else{
			
			// console.log(result.length==0)
			if(result.length==0){
				flag='X'
			}
			let j=await cds.run("SELECT last_value(ID order by ID ) as i FROM RBEI_TOOL_REUSE_REP_T_SEARCH_VALUE")
			// console.log(j)
			if(j.length==0){
				i=0;
			}
			else{
				// console.log(j[0].I)
				i=j[0].I;
				i++;
			}
			let result1=await cds.run("insert into RBEI_TOOL_REUSE_REP_T_SEARCH_VALUE (ID,SEARCH,FLAG,DATE) values ("+i+",'"+search+"','"+flag+"',CURRENT_DATE)")
			// console.log(result1)
			//i++;
		}
	})
	
	srv.after('READ','search_result', async (result,req)=>{
		// if(result.length===0){
		// console.log(req.params)
		// let search=req.params[0].TAG
		// // console.log(search)
		// let m_result=await cds.run("SELECT OBJECT_NAME,tags FROM RBEI_TOOL_REUSE_REP_T_MD_OBJ_TAG_REPO WHERE CONTAINS (DESCRIPTION, '"+search+"', FUZZY (0.7,'similarCalculationMode=searchCompare'))")
		// // console.log(m_result)
		// result=[...m_result]
		// }
		// let i=0;
		// for(let each of result){
		// 	console.log(each);
			
		// }
		// console.log(i)
	})
})