sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"sap/f/library"
], function (BaseController, MessageBox, Utilities, History, fioriLibrary) {
	"use strict";

	return BaseController.extend("RBEI_UI5.rbei_ui5_reuse_rep.controller.ObjectsDetailsPage", {
		handleRouteMatched: function (oEvent) {
			var sAppId = "App5ecd0d7b14c2661de83cd81e";

			var oParams = {};

			if (oEvent.mParameters.data.context) {
				this.sContext = oEvent.mParameters.data.context;

			} else {
				if (this.getOwnerComponent().getComponentData()) {
					var patternConvert = function (oParam) {
						if (Object.keys(oParam).length !== 0) {
							for (var prop in oParam) {
								if (prop !== "sourcePrototype" && prop.includes("Set")) {
									return prop + "(" + oParam[prop][0] + ")";
								}
							}
						}
					};

					this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);
				}
			}

			if (!this.sContext) {
				this.sContext = "DB_DATASet('1')";
			}

			var oPath;

			if (this.sContext) {
				oPath = {
					path: "/" + this.sContext,
					parameters: oParams
				};
				this.getView().bindObject(oPath);
			}

		},
		_onButtonPress: function (oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext();
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("ToolPage");
			// return new Promise(function(fnResolve) {

			// 	this.doNavigate("ToolPage", oBindingContext, fnResolve, "");
			// }.bind(this)).catch(function(err) {
			// 	if (err !== undefined) {
			// 		MessageBox.error(err.message);
			// 	}
			// });

		},
		doNavigate: function (sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			var oModel = (oBindingContext) ? oBindingContext.getModel() : null;

			var sEntityNameSet;
			if (sPath !== null && sPath !== "") {
				if (sPath.substring(0, 1) === "/") {
					sPath = sPath.substring(1);
				}
				sEntityNameSet = sPath.split("(")[0];
			}
			var sNavigationPropertyName;
			var sMasterContext = this.sMasterContext ? this.sMasterContext : sPath;

			if (sEntityNameSet !== null) {
				sNavigationPropertyName = sViaRelation || this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(sEntityNameSet,
					sRouteName);
			}
			if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
				if (sNavigationPropertyName === "") {
					this.oRouter.navTo(sRouteName, {
						context: sPath,
						masterContext: sMasterContext
					}, false);
				} else {
					oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function (bindingContext) {
						if (bindingContext) {
							sPath = bindingContext.getPath();
							if (sPath.substring(0, 1) === "/") {
								sPath = sPath.substring(1);
							}
						} else {
							sPath = "undefined";
						}

						// If the navigation is a 1-n, sPath would be "undefined" as this is not supported in Build
						if (sPath === "undefined") {
							this.oRouter.navTo(sRouteName);
						} else {
							this.oRouter.navTo(sRouteName, {
								context: sPath,
								masterContext: sMasterContext
							}, false);
						}
					}.bind(this));
				}
			} else {
				this.oRouter.navTo(sRouteName);
			}

			if (typeof fnPromiseResolve === "function") {
				fnPromiseResolve();
			}

		},
		onInit: function () {
			// debugger;
			var oOwnerComponent = this.getOwnerComponent();

			this.oRouter = oOwnerComponent.getRouter();
			this.oModel = oOwnerComponent.getModel();

			// this.oRouter.getRoute("TargetView1").attachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("ObjectsDetailsPage").attachPatternMatched(this._onProductMatched, this);
			// var oOwnerComponent = this.getOwnerComponent();

			// this.oRouter = oOwnerComponent.getRouter();
			// this.oModel = oOwnerComponent.getModel("products");

			// this.getOwnerComponent().getRouter().getRoute("ObjectsDetailsPage").attachPatternMatched(this._onObjectMatched, this); 

			// var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// this.oRouter.getRoute("ObjectsDetailsPage").attachPatternMatched(this._onObjectMatched, this);
			// oRouter.getTarget("ObjectsDetailsPage").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
		},

		_onProductMatched: function () {
			// debugger;
			this.oModel = this.getOwnerComponent().getModel("products");
			var settingsModel = this.getOwnerComponent().getModel("products");
			// var settingModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(settingsModel, "settingModel");
			// this.getView().byId("idfm").setText(settingsModel[0].SUB_MODULE);
			// var oOwnerComponent = this.getOwnerComponent();
			// this.oModel = oOwnerComponent.getModel("products");

			// var sRouteData = JSON.parse(oEvent.getParameter("arguments").product);
			// var finalData = [];
			// finalData.push(sRouteData[0].CONTACT_GROUP);
			// finalData.push(sRouteData[0].OBJECT_NAME.replaceAll(".", "/"));
			// finalData.push(sRouteData[0].OBJECT_TYPE);
			// finalData.push(sRouteData[0].REUSPR);
			// finalData.push(sRouteData[0].SYSTEM_ID);
			// finalData.push(sRouteData[0].TAGS);
			// var settingModel = new sap.ui.model.json.JSONModel({
			// 	data: finalData
			// });
			// this.getView().setModel(this.oModel, "settingModel");
			// var key0 = oEvent.getParameter("arguments").id2;
			// key0 = key0.replaceAll(".", "/");
			// var key = oEvent.getParameter("arguments").productsPath;
			// var key1 = oEvent.getParameter("arguments").id;
			// var key2 = oEvent.getParameter("arguments").id1;
			// var key3 = oEvent.getParameter("arguments").id3;
			// var key4 = oEvent.getParameter("arguments").id4;
			// var per = key4.concat("%");
			// this.getView().byId("idfm").setText(key);
			// this.getView().byId("idfm1").setText(key1);
			// this.getView().byId("idfm2").setText(key2);
			// this.getView().byId("idfm3").setText(key3);
			// this.getView().byId("objName").setText(key0);
			// this.getView().byId("pind1").setPercentValue(per);
			// this.getView().byId("pind1").setDisplayValue(per);
		},
		handleClose: function () {
			// var sNextLayout = "OneColumn";
			// var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// oRouter.navTo("ToolPage", {layout: sNextLayout});
			debugger;
			var oFCL = this.oView.getParent().getParent();
			oFCL.setLayout(fioriLibrary.LayoutType.OneColumn);
			
			this.getOwnerComponent().getRouter().navTo("TargetView1",{
					 	layout: sap.f.LayoutType.OneColumn 
					 });
		}
	});
}, /* bExport= */ true);