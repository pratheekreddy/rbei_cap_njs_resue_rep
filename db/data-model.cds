namespace rbei.tool.reuse_rep;

entity T_MD_OBJ_TAG_REPO {
	key MODULE			:	String(5);
	key SUB_MODULE		:	String(15);
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
		DOCUMENT_LINK	:	String(100);
		DESCRIPTION		:	String(200);
		C_CREATED_BY	:	String(256);
		C_CREATED_ON	:	Timestamp;
		C_CHANGED_BY	:	String(256);
		C_CHANGED_ON	:	Timestamp;
};