using {rbei.tool.reuse_rep as rbei} from '../db/data-model';

service repo @(impl:'service.js'){
	entity obj_repo as projection on rbei.T_MD_OBJ_TAG_REPO; 
	// entity dev as select from rbei.T_MD_OBJ_TAG_REPO where TAG_DOMAIN='D';
	// entity mig as select from rbei.T_MD_OBJ_TAG_REPO where TAG_DOMAIN='M';
	entity obj_repo_search (SEARCH :String) as select from rbei.V_OBJ_REPO(SEARCH: :SEARCH);
	entity proj_type as projection on rbei.T_PROJ_TYPE_MASTER;
	entity team_type as projection on rbei.T_TEAMS_MASTER;
	entity search_result (TAG : String) AS SELECT from rbei.V_FUZZY_SEARCH (TAG: :TAG) 
};

service master{
	entity module as projection on rbei.T_MD_MOD_MASTER;
	entity obj_type as projection on rbei.V_OBJ_TYPE;
	entity obj_name as projection on rbei.V_OBJ_NAME;
	entity sys_id as projection on rbei.V_SYS_ID;
	entity func_grp as projection on rbei.V_FUNC_GRP;
	entity dev_clas as projection on rbei.V_DEV_CLASS;
	entity contact_group as projection on rbei.V_CONTACT_GROUP;
	entity target_teams as projection on rbei.V_TARGET_TEAMS;
	entity usage_scen as projection on rbei.V_USAGE_SCEN;
	entity impl_steps as projection on rbei.V_IMPL_STEPS;
}