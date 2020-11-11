sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"RBEI_UI5/rbei_ui5_reuse_rep/model/models",
	"sap/ui/model/json/JSONModel"
], function (UIComponent, Device, models, JSONModel) {
	"use strict";

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
			var oProductsModel;
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			oProductsModel = new JSONModel();
			this.setModel(oProductsModel, 'products');
			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
		},
		_onBeforeRouteMatched: function (oEvent) {
			var oModel = this.getModel(),
				sLayout = oEvent.getParameters().arguments.layout;

			// If there is no layout parameter, set a default layout (normally OneColumn)
			if (!sLayout) {
				sLayout = fioriLibrary.LayoutType.OneColumn;
			}

			oModel.setProperty("/layout", sLayout);
		}
	});
});