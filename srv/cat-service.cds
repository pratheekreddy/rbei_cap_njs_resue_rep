using {rbei.tool.reuse_rep as rbei} from '../db/data-model';

service repo{
	entity obj_repo as projection on rbei.T_MD_OBJ_TAG_REPO; 
	// entity details (module:String,sub_module:String,object_type:String,object_name:String,system_id:String) as SELECT * from rbei.T_MD_OBJ_TAG_REPO 
	// 		where MODULE=:module and SUB_MODULE=:sub_module and OBJECT_TYPE =:object_type and OBJECT_NAME=:object_name and SYSTEM_ID=:system_id;
	// entity CV_SEARCH_RESULT (IP_TAG_DOMAIN : String, IP_TAG : String, IP_MODULE : String, IP_SUB_MODULE : String) as SELECT * from rbei.CV_SEARCH_RESULT (IP_TAG_DOMAIN: :IP_TAG_DOMAIN, IP_TAG: :IP_TAG, IP_MODULE: :IP_MODULE, IP_SUB_MODULE: :IP_SUB_MODULE);
	entity dropdown as projection on rbei.V_DROPDOWN;
	// entity dropdown as select distinct MODULE, SUB_MODULE from rbei.T_MD_OBJ_TAG_REPO {KEY MODULE,KEY SUB_MODULE};
};