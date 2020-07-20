using {rbei.tool.reuse_rep as rbei} from '../db/data-model';

service Repo{
	entity obj_repo as projection on rbei.T_MD_OBJ_TAG_REPO; 
}