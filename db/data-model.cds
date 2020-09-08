namespace rbei.tool.reuse_rep;

entity T_MD_OBJ_TAG_REPO {
	//	ID				:	Integer;//  generated always as identity(start with 1 increment by 1);
	key MODULE			:	String(15);
	key SUB_MODULE		:	String(50);
	key OBJECT_TYPE		:	String(4);
	key OBJECT_NAME		:	String(50);
	key	SYSTEM_ID		:	String(10);
		TAG_DOMAIN		:	String(1);
		TAGS			:	String(500);
		FUNC_GROUP		:	String(50);
		DEV_CLASS		:	String(50);
		REUSPR			:	Integer;
		CONTACT_ID		:	String(50);
		CONTACT_GROUP	:	String(25);
		DOCUMENT_LINK	:	String(150);
		DESCRIPTION		:	String(500);
		C_CREATED_BY	:	String(256);
		C_CREATED_ON	:	Timestamp;
		C_CHANGED_BY	:	String(256);
		C_CHANGED_ON	:	Timestamp;
		TARGET_TEAMS	:	String(25);
		USAGE_SCEN		:	String(25);
		IMPL_STEPS		:	String(150);
		EFFORTS_SAVED	:	Integer;
};

entity T_MD_MOD_MASTER{
	key MODULE			:	String(15);
	key SUB_MODULE		:	String(50);	
}

entity T_MD_OBJ_TYP_MASTER{
	key OBJECT_TYPE		:	String(4);
		OBJ_DESC		:	String(100);
}
entity T_PROJ_TYPE_MASTER{
	key ID				:	Integer;
		VALUE			:	String(50);
}

entity T_TEAMS_MASTER{
	key ID				:	Integer;
		VALUE			:	String(70);
}

define view V_DROPDOWN as select from T_MD_OBJ_TAG_REPO distinct
{
	key T_MD_OBJ_TAG_REPO.MODULE, key T_MD_OBJ_TAG_REPO.SUB_MODULE
};

define view V_OBJ_TYPE as select from T_MD_OBJ_TAG_REPO distinct
{
	key T_MD_OBJ_TAG_REPO.OBJECT_TYPE
};

define view V_OBJ_NAME as select from T_MD_OBJ_TAG_REPO distinct
{
	key T_MD_OBJ_TAG_REPO.OBJECT_NAME
};

define view V_SYS_ID as select from T_MD_OBJ_TAG_REPO distinct
{
	key T_MD_OBJ_TAG_REPO.SYSTEM_ID
};

define view V_FUNC_GRP as select from T_MD_OBJ_TAG_REPO distinct
{
	key T_MD_OBJ_TAG_REPO.FUNC_GROUP
};

define view V_DEV_CLASS as select from T_MD_OBJ_TAG_REPO distinct
{
	key T_MD_OBJ_TAG_REPO.DEV_CLASS
};

define view V_CONTACT_ID as select from T_MD_OBJ_TAG_REPO distinct
{
	key T_MD_OBJ_TAG_REPO.CONTACT_ID
};

define view V_CONTACT_GROUP as select from T_MD_OBJ_TAG_REPO distinct
{
	key T_MD_OBJ_TAG_REPO.CONTACT_GROUP
};

define view V_TARGET_TEAMS as select from T_MD_OBJ_TAG_REPO distinct
{
	key T_MD_OBJ_TAG_REPO.TARGET_TEAMS
};

define view V_USAGE_SCEN as select from T_MD_OBJ_TAG_REPO distinct
{
	key T_MD_OBJ_TAG_REPO.USAGE_SCEN
};

define view V_IMPL_STEPS as select from T_MD_OBJ_TAG_REPO distinct
{
	key T_MD_OBJ_TAG_REPO.IMPL_STEPS
};

VIEW V_OBJ_REPO (SEARCH :String(100)) as select from T_MD_OBJ_TAG_REPO{*}
where CONTAINS(TAGS, :SEARCH, FUZZY(0.7,'similarCalculationMode=searchCompare'));


VIEW V_FUZZY_SEARCH ( TAG : String(100)) AS SELECT 
FROM T_MD_OBJ_TAG_REPO
{
	key TAGS,
	key	OBJECT_NAME
}
WHERE CONTAINS(TAGS, :TAG, FUZZY(0.7,'similarCalculationMode=searchCompare'));
