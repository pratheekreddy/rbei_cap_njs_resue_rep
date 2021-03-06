sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (Controller, MessageToast, MessageBox) {
	"use strict";
	var otplbl, otpinp, otpbtn;

	return Controller.extend("RBEI_UI5.rbei_ui5_reuse_rep.controller.View1", {
		onInit: function () {
			// var URL = "https://s0f2uptm05loklc9bei-cap-njs-reuse.cfapps.eu10.hana.ondemand.com";
			// otplbl = this.getView().byId("otplbl");
			// otpinp = this.getView().byId("otpinp");
			// otpbtn = this.getView().byId("otpbtn");
			// otplbl.setVisible(false);
			// otpinp.setVisible(false);
			// otpbtn.setVisible(false);
			var URL = "/rbei_ui5_reuse_rep_test";
			this.srcModel = new sap.ui.model.odata.ODataModel(URL, true);
			this.getOwnerComponent().getRouter().getRoute("View1").attachPatternMatched(this._onProductMatched, this);                         
		},
		_onProductMatched: function () {
			this.getView().byId("emailinp").setValue("");
			this.getView().byId("otpinp").setValue("");
		},
		onSignin: function (oEvent) {
			debugger;
			var email = this.getView().byId("emailinp").getValue();
			var otp = this.getView().byId("otpinp").getValue();
			var record = {
				user: email,
				otp: otp
			};
			var that = this;
			var mParameters = {
				success: function (oData) {
					var msg = "Login is successful";
					MessageToast.show(msg);
					// MessageBox.show(msg, {
					// 	icon: sap.m.MessageBox.Icon.SUCCESS,
					// 	title: "Success",
					// 	actions: [sap.m.MessageBox.Action.OK],
					// 	onClose: function (oAction) {}.bind(this)
					// });
					// var oRouter = that.getOwnerComponent().getRouter();
					// oRouter.navTo("ToolPage");
					that.getOwnerComponent().getRouter().navTo("TargetView1", {
						layout: sap.f.LayoutType.OneColumn
					});
				},
				error: function (oErroe) {
					var err = oErroe.response.body;
					MessageToast.show(err);
				}
			};
			this.srcModel.create("/user/auth/login", record, mParameters);
		},
		onSignup1: function (oEvent) {
			var email1 = sap.ui.getCore().byId("email1").getValue();
			var uname = sap.ui.getCore().byId("uname").getValue();
			var fname = sap.ui.getCore().byId("fname").getValue();
			var dept = sap.ui.getCore().byId("dept").getValue();
			var eid = sap.ui.getCore().byId("eid").getValue();
			var ntid = sap.ui.getCore().byId("ntid").getValue();
			if (email1 === '' || fname === '' || dept === '') {
				var text = "Enter Mandatory Fields";
				MessageToast.show(text);
			}
			var record = {
				email: email1,
				idno: eid,
				name: fname,
				ntid: ntid,
				dept: dept,
				username: uname
			};
			var mParameters = {
				success: function (oData) {
					var msg = "You have registered Successfully";
					MessageBox.show(msg, {
						icon: sap.m.MessageBox.Icon.SUCCESS,
						title: "Success",
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function (oAction) {}.bind(this)
					});
				},
				error: function (oErroe) {
					var err = oErroe.response.body;
					MessageToast.show(err);
				}
			};
			this.srcModel.create("/user/signup", record, mParameters);
		},
		onSignup: function () {
			if (!this._Dialog) {
				this._Dialog = sap.ui.xmlfragment("RBEI_UI5.rbei_ui5_reuse_rep.view.Signup", this.getView().getController());
				this._Dialog.setModel(this.getView().getModel());
				this.getView().addDependent(this._Dialog);
				this._Dialog.setResizable(false);
			}
			this._Dialog.open();
		},
		handleCancelPress: function () {
			if (!this._Dialog) {
				this._Dialog = sap.ui.xmlfragment("dialogID", "RBEI_UI5.rbei_ui5_reuse_rep.view.Signup", this.getView().getController());
			}
			this._Dialog.close();
		},
		onGetotp: function () {
			// var emaillbl = this.getView().byId("emaillbl");
			// var emailinp = this.getView().byId("emailinp");
			// var emailbtn = this.getView().byId("emailbtn");
			// emaillbl.setVisible(false);
			// emailinp.setVisible(false);
			// emailbtn.setVisible(false);
			// otplbl.setVisible(true);
			// otpinp.setVisible(true);
			// otpbtn.setVisible(true);
			var email = this.getView().byId("emailinp").getValue();
			if (email === "") {
				var text = "please enter a valid username or email";
				MessageToast.show(text); // sap.m.MessageBox.Warning("Fields highlighted are wrong. Kindly correct and save");
			} else {
				var path = "/user/auth/otp?user=" + email;
				var mParameters = {
					success: function (data, response) {
						var message = response.body;
						MessageToast.show(message);
						// MessageBox.show(message, {
						// 	icon: sap.m.MessageBox.Icon.INFORMATION,
						// 	title: "Information",
						// 	actions: [sap.m.MessageBox.Action.OK],
						// 	onClose: function (oAction) {}.bind(this)
						// });
					},
					error: function (error) {
						// your error logic
						var err = error;
					}
				};
				this.srcModel.read(path, mParameters);
			}
		},
		/**
		 *@memberOf RBEI_UI5.rbei_ui5_reuse_rep.controller.View1
		 */
		action: function (oEvent) {
			var that = this;
			var actionParameters = JSON.parse(oEvent.getSource().data("wiring").replace(/'/g, "\""));
			var eventType = oEvent.getId();
			var aTargets = actionParameters[eventType].targets || [];
			aTargets.forEach(function (oTarget) {
				var oControl = that.byId(oTarget.id);
				if (oControl) {
					var oParams = {};
					for (var prop in oTarget.parameters) {
						oParams[prop] = oEvent.getParameter(oTarget.parameters[prop]);
					}
					oControl[oTarget.action](oParams);
				}
			});
			var oNavigation = actionParameters[eventType].navigation;
			if (oNavigation) {
				var oParams = {};
				(oNavigation.keys || []).forEach(function (prop) {
					oParams[prop.name] = encodeURIComponent(JSON.stringify({
						value: oEvent.getSource().getBindingContext(oNavigation.model).getProperty(prop.name),
						type: prop.type
					}));
				});
				if (Object.getOwnPropertyNames(oParams).length !== 0) {
					this.getOwnerComponent().getRouter().navTo(oNavigation.routeName, oParams);
				} else {
					// this.getOwnerComponent().getRouter().navTo(oNavigation.routeName);TargetView1
					this.getOwnerComponent().getRouter().navTo("TargetView1", {
						layout: sap.f.LayoutType.OneColumn
					});
				}
			}
		}
	});
});