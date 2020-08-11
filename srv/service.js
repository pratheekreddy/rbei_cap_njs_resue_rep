const cds = require('@sap/cds')

module.exports = cds.service.impl(srv => {
	const {proj_type,team_type}=srv.entities

	srv.after('READ','obj_repo',async (result)=>{

		for (let each of result){
			if(each.USAGE_SCEN==undefined){
				
			}else{
				if(each.USAGE_SCEN=='N/A'){}else{
			let target=[]
			let filter=each.USAGE_SCEN.split(',')

			if(filter.length>0){
			let list=await cds.run( SELECT.from(proj_type).where('ID in',filter))
				list.forEach(item=>{
					target.push(item.VALUE)
				})

				each.USAGE_SCEN=target
			}
			}
			}
			if(each.TARGET_TEAMS==undefined){}
			else{
				if(each.TARGET_TEAMS=='N/A'){}else{
				let teams=[]
				let tfilter=each.TARGET_TEAMS.split(',')
	
				if(tfilter.length>0){
				let list=await cds.run( SELECT.from(team_type).where('ID in',tfilter))
					list.forEach(item=>{
						teams.push(item.VALUE)
					})
	
					each.TARGET_TEAMS=teams
				}
			}
			}
		}

	})
})