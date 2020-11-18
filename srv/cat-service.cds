using {rbei.tool.reuse_rep as rbei} from '../db/data-model';

service repo @(impl:'service.js'){
	entity obj_repo as projection on rbei.T_MD_OBJ_TAG_REPO; 
	entity obj_repo_search (search :String , score :Decimal(17, 5)) as select from rbei.V_OBJ_REPO(search: :search , score: :score);
	entity teams as projection on rbei.T_TARGET_TEAMS;
	entity usage as projection on rbei.T_USAGE_SCEN;
	entity search_result (tag : String , score:Decimal(17, 5)) AS SELECT from rbei.V_FUZZY_SEARCH (tag: :tag , score: :score) ;
	entity search_value as projection on rbei.T_SEARCH_VALUE;
};

service master{
	entity module as projection on rbei.V_DROPDOWN;
	entity obj_type as projection on rbei.V_OBJ_TYPE;
	entity obj_name as projection on rbei.V_OBJ_NAME;
	entity sys_id as projection on rbei.V_SYS_ID;
	entity func_grp as projection on rbei.V_FUNC_GRP;
	entity dev_clas as projection on rbei.V_DEV_CLASS;
	entity contact_group as projection on rbei.V_CONTACT_GROUP;
	// entity target_teams as projection on rbei.V_TARGET_TEAMS;
	// entity usage_scen as projection on rbei.V_USAGE_SCEN;
	entity impl_steps as projection on rbei.V_IMPL_STEPS;
}