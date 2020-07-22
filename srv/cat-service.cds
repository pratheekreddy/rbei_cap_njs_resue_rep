using {rbei.tool.reuse_rep as rbei} from '../db/data-model';

service Repo{
	entity obj_repo as projection on rbei.T_MD_OBJ_TAG_REPO; 
	entity details (module:String,sub_module:String,object_type:String,object_name:String,system_id:String) as SELECT * from rbei.T_MD_OBJ_TAG_REPO 
			where MODULE=:module and SUB_MODULE=:sub_module and OBJECT_TYPE =:object_type and OBJECT_NAME=:object_name and SYSTEM_ID=:system_id;
};

// service generic{
// 	entity tab(tag_domain:String) as select MODULE, SUB_MODULE from rbei.V_GENERIC where TAG_DOMAIN=:tag_domain;
// };