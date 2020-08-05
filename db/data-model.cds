namespace rbei.tool.reuse_rep;

entity T_MD_OBJ_TAG_REPO {
		ID				:	Integer;
	key MODULE			:	String(15);
	key SUB_MODULE		:	String(50);
	key OBJECT_TYPE		:	String(4);
	key OBJECT_NAME		:	String(50);
	key	SYSTEM_ID		:	String(6);
		TAG_DOMAIN		:	String(1);
		TAGS			:	String(500);
		FUNC_GROUP		:	String(50);
		DEV_CLASS		:	String(50);
		REUSPR			:	Integer;
		CONTACT_ID		:	String(50);
		CONTACT_GROUP	:	String(10);
		DOCUMENT_LINK	:	String(150);
		DESCRIPTION		:	String(500);
		C_CREATED_BY	:	String(256);
		C_CREATED_ON	:	Timestamp;
		C_CHANGED_BY	:	String(256);
		C_CHANGED_ON	:	Timestamp;
		IMPL_STEPS		:	String(150);
		EFFORTS_SAVED	:	Integer;
};

entity T_MD_MOD_MASTER{
	key MODULE			:	String(15);
	key SUB_MODULE		:	String(50);	
}

entity TMD_OBJ_TYP_MASTER{
	key OBJECT_TYPE		:	String(4);
		OBJ_DESC		:	String(100);
}

define view V_DROPDOWN as select from T_MD_OBJ_TAG_REPO distinct
{
	key T_MD_OBJ_TAG_REPO.MODULE, key T_MD_OBJ_TAG_REPO.SUB_MODULE
};
