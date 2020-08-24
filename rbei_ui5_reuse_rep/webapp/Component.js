sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"RBEI_UI5/rbei_ui5_reuse_rep/model/models"
], function (UIComponent, Device, models) {
	"use strict";

<<<<<<< HEAD
	var navigationWithContext = {
		"DB_DATASet": {
			"ObjectDetailsPage": ""
		},
		"Sheet1Set": {
			"MigrationDetailsPage": ""
		}
	};

	return UIComponent.extend("RBEI_UI5.rbei_ui5_reuse_rep.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			debugger;
			this.setModel(models.createDeviceModel(), "device");
			this.setModel(new sap.ui.model.json.JSONModel({
				"uri": "/local"
			}), "dataSource");
			var oApplicationModel = new sap.ui.model.json.JSONModel({});
			this.setModel(oApplicationModel, "applicationModel");
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();
=======
	return UIComponent.extend("RBEI_UI5.rbei_ui5_reuse_rep.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
>>>>>>> refs/heads/master
		}
	});
});