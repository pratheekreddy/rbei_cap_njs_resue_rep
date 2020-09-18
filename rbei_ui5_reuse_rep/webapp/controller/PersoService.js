sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";

	// Very simple page-context personalization
	// persistence service, not for productive use!
	var DemoPersoService = {

		oData : {
			_persoSchemaVersion: "1.0",
			aColumns : [
				{
					id: "perso-idProductsTable-idmodule",
					order: 0,
					text: "Module",
					visible: true
				},
				{
					id: "perso-idProductsTable-idsubmodule",
					order: 1,
					text: "Sub-Module",
					visible: true
				},
				{
					id: "perso-idProductsTable-idobjType",
					order: 2,
					text: "Object Type",
					visible: false
				},
				{
					id: "perso-idProductsTable-idobjName",
					order: 3,
					text: "Object Name",
					visible: true
				},
				{
					id: "perso-idProductsTable-idobjDesc",
					order: 4,
					text: "Object Description",
					visible: true
				},
				{
					id: "perso-idProductsTable-idContact",
					order: 5,
					text: "Contact Group",
					visible: true
				}
			]
		},

		getPersData : function () {
			var oDeferred = new jQuery.Deferred();
			if (!this._oBundle) {
				this._oBundle = this.oData;
			}
			var oBundle = this._oBundle;
			oDeferred.resolve(oBundle);
			return oDeferred.promise();
		},

		setPersData : function (oBundle) {
			var oDeferred = new jQuery.Deferred();
			this._oBundle = oBundle;
			oDeferred.resolve();
			return oDeferred.promise();
		},

		resetPersData : function () {
			var oDeferred = new jQuery.Deferred();
			var oInitialData = {
					_persoSchemaVersion: "1.0",
					aColumns : [
				{
					id: "perso-idProductsTable-idmodule",
					order: 0,
					text: "Module",
					visible: true
				},
				{
					id: "perso-idProductsTable-idsubmodule",
					order: 1,
					text: "Sub-Module",
					visible: true
				},
				{
					id: "perso-idProductsTable-idobjType",
					order: 2,
					text: "Object Type",
					visible: false
				},
				{
					id: "perso-idProductsTable-idobjName",
					order: 3,
					text: "Object Name",
					visible: true
				},
				{
					id: "perso-idProductsTable-idobjDesc",
					order: 4,
					text: "Object Description",
					visible: true
				},
				{
					id: "perso-idProductsTable-idContact",
					order: 5,
					text: "Contact Group",
					visible: true
				}
			]
			};

			//set personalization
			this._oBundle = oInitialData;

			//reset personalization, i.e. display table as defined
	//		this._oBundle = null;

			oDeferred.resolve();
			return oDeferred.promise();
		},

		//this caption callback will modify the TablePersoDialog' entry for the 'Weight' column
		//to 'Weight (Important!)', but will leave all other column names as they are.
		getCaption : function (oColumn) {/*
			if (oColumn.getHeader() && oColumn.getHeader().getText) {
				if (oColumn.getHeader().getText() === "Weight") {
					return "Weight (Important!)";
				}
			}
			return null;
		*/},

		getGroup : function(oColumn) {/*
			if ( oColumn.getId().indexOf('productCol') != -1 ||
					oColumn.getId().indexOf('supplierCol') != -1) {
				return "Primary Group";
			}
			return "Secondary Group";
		*/}
	};

	return DemoPersoService;

});
