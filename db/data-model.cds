namespace rbei.tool.reuse_rep;

entity T_MD_USER {
	key EMAIL_ID				: String(256);
		IDNO					: String (20);
		NAME					: String(100);
		NTID					: String(20);
		DEPT					: String(30);
		USERNAME				: String(50);
		STATUS					: String(1);
		TYPE					: String(1);
		REGD_ON					: Timestamp;
		CHANGED_ON				: Timestamp;
		GEN_OTP					: Integer;
		GEN_OTP_TMSTMP			: Timestamp;
		GEN_RBEI_TOKEN			: String(400);
		GEN_RBEI_TOKEN_TMSTMP	: Timestamp;
};

entity T_MD_OBJ_TAG_REPO {
	key	A_ID			:	Integer;//  generated always as identity(start with 1 increment by 1);
		MODULE			:	String(15);
		SUB_MODULE		:	String(50);
		OBJECT_TYPE		:	String(4);
		OBJECT_NAME		:	String(50);
		SYSTEM_ID		:	String(10);
		TAG_DOMAIN		:	String(35);
		TAGS			:	String(500);
		FUNC_GROUP		:	String(50);
		DEV_CLASS		:	String(50);
		REUSPR			:	Integer;
		CONTACT_ID		:	String(50);
		CONTACT_GROUP	:	String(25);
		DOCUMENT_LINK	:	String(250);
		DESCRIPTION		:	String(500);
		C_CREATED_BY	:	String(256);
		C_CREATED_ON	:	Timestamp;
		C_CHANGED_BY	:	String(256);
		C_CHANGED_ON	:	Timestamp;
		// TARGET_TEAM		:	Composition of many T_TARGET_TEAMS on TARGET_TEAM.A_ID=$self;
		// USAGE_SCENE		:	Composition of many T_USAGE_SCEN on USAGE_SCENE.A_ID=$self;
		IMPL_STEPS		:	String(250);
		EFFORTS_SAVED	:	Decimal(17,5);
};

entity T_TARGET_TEAMS{
	key A_ID			:	Integer;//Association to T_MD_OBJ_TAG_REPO;
	key	TARGET_TEAM		:	String(50);
}

entity T_USAGE_SCEN{
	key A_ID			:	Integer;//Association to T_MD_OBJ_TAG_REPO;
	key USAGE_SCEN		:	String(50);
}

entity T_SEARCH_VALUE{
	key ID				:	Integer;
		SEARCH			:	String(400);
		FLAG			:	String(1);
		DATE			:	Date;
}

// entity T_PROJ_TYPE_MASTER{
// 	key ID				:	Integer;
// 		VALUE			:	String(50);
// }

// entity T_TEAMS_MASTER{
// 	key ID				:	Integer;
// 		VALUE			:	String(70);
// }

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

// define view V_TARGET_TEAMS as select from T_MD_OBJ_TAG_REPO distinct
// {
// 	key T_MD_OBJ_TAG_REPO.TARGET_TEAM
// };

// define view V_USAGE_SCEN as select from T_MD_OBJ_TAG_REPO distinct
// {
// 	key T_MD_OBJ_TAG_REPO.USAGE_SCENE
// };

define view V_IMPL_STEPS as select from T_MD_OBJ_TAG_REPO distinct
{
	key T_MD_OBJ_TAG_REPO.IMPL_STEPS
};

VIEW V_OBJ_REPO (search :String(100) , score : Decimal(17, 5)) as select from T_MD_OBJ_TAG_REPO{*}
where CONTAINS((TAGS,DESCRIPTION), :search, FUZZY(:score,'similarCalculationMode=searchCompare'));


VIEW V_FUZZY_SEARCH ( tag : String(100) , score : Decimal(17, 5)) AS SELECT 
FROM T_MD_OBJ_TAG_REPO distinct
{
	key TAGS
}
WHERE CONTAINS((TAGS,DESCRIPTION), :tag, FUZZY(:score,'similarCalculationMode=searchCompare'));
