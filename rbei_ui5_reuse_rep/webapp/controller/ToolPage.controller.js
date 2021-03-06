sap.ui.define(["sap/ui/core/mvc/Controller",
		"sap/m/MessageBox",
		"./utilities",
		"./PersoService",
		"sap/ui/core/routing/History",
		"sap/ui/model/json/JSONModel",
		"sap/ui/model/Filter",
		"sap/ui/core/SeparatorItem",
		"sap/ui/model/FilterOperator",
		"sap/m/TablePersoController",
		"sap/f/library"
	],

	function (BaseController, MessageBox, Utilities, PersoService, History, JSONModel, Filter, SeparatorItem, FilterOperator,
		TablePersoController, fioriLibrary) {
		"use strict";

		return BaseController.extend("RBEI_UI5.rbei_ui5_reuse_rep.controller.ToolPage", {

			filterArr: [],
			createViewSettingsDialog: function (sDialogFragmentName) {
				var oDialog = this._mViewSettingsDialogs[sDialogFragmentName];

				if (!oDialog) {
					oDialog = sap.ui.xmlfragment(sDialogFragmentName, this);
					this._mViewSettingsDialogs[sDialogFragmentName] = oDialog;

				}
				return oDialog;
			},

			// suggestion:function(oEvent){ // // debugger; },
			// onSuggest: function (oEvent) {

			// },
			onSuggest: function (oEvent) {
				var newvalue = oEvent.getSource().getValue();
				var t = this;
				if (newvalue === "") {
					newvalue = "*";
				} else {
					jQuery.get({
						url: "/srv_test/repo/search_result(tag='" + newvalue + "',score=0.8)/Set?$skip=0&$top=10",
						success: function (data) {
							var searchmodel = new JSONModel(data.value);
							t.getView().byId("Search").setModel(searchmodel, "searchMdl");
							t.getView().byId("Search").suggest();
						},
						error: function (error) {
							// your error logic

						}
					});
				}
				/*var oSource = oEvent.getSource();
				var sTerm = oEvent.getParameter("suggestValue");
				if (!sTerm) {
					sTerm = "*";
				}
				var serachCnd = "/search_result(TAG='" + sTerm + "')/Set";
				oEvent.getSource().bindAggregation("suggestionItems", serachCnd, new sap.m.SuggestionItem({
					text: "{TAGS}"
				}))

				var oBinding = oEvent.getSource().getBinding("suggestionItems");
				oBinding.attachEventOnce("dataReceived", function () {
					// now activate suggestion popup
					oSource.suggest();
				});*/

			},

			// jQuery.ajax({
			// 	url: "/srv_test/repo/search_result(TAG='SD')/Set",
			// 	method: "GET",
			// 	dataType: "json",
			// 	contentType: "application/json",
			// 	success: jQuery.proxy(successCallbackFunc, this),
			// 	error: jQuery.proxy(errorCallbackFunc, this)

			// });

			// 	this.fnQuery(sSkiptokenUrl, fnSuccess, fnError);
			// successCallbackFunc: function (oEvent) {
			// 		console.log("TriggeedS");
			// 	},
			// 	errorCallbackFunc: function (oEvent) {
			// 		console.log("TriggeedF");
			// 	},
			onClear: function (oEvent) {
				this.getView().byId("Search").setValue(null);
				this.getView().byId("module").setSelectedItems(null);
				this.getView().byId("OBJECT_NAME").setSelectedItems(null);
				this.getView().byId("OBJECT_TYPE").setSelectedItems(null);
				this.getView().byId("CONTACT_GROUP").setSelectedItems(null);
				this.onSearch();
				// var oItems = this.getView().byId("module").getSelectedItems();
				// var oItems = this.getView().byId("module").getSelectedItems()[0].getProperty("text")
			},
			onSearch: function (oEvent) {
				// // // debugger;
				// sap.ui.core.BusyIndicator.show(60000);
				//Filter value 
				// this.oFilter = new Filter(this.filterArr,true);
				var art = this.getView().byId("idsidenav").getSelectedKey();
				if (art === "MigrationArtifacts") {
					var val = "M";
				} else if (art === "DevelopmentArtifacts") {
					val = "D";
				} else {
					val = " ";
				}
				// var quote_str = "'" + val + "'";
				// var domain = "TAG_DOMAIN" + ' ' + "eq" + ' ' + quote_str;
				var domain = new Filter("TAG_DOMAIN", FilterOperator.EQ, val);
				var searchvalue = this.getView().byId("Search").getValue();
				if (searchvalue === "") {
					searchvalue = "*";
				}
				var oFilters = [];
				var modulevalues = []; //this.getView().byId("module").getSelectedItems()[0].getProperty("key");
				var moduledata = this.getView().byId("module").getSelectedItems();
				for (var m = 0; m < this.getView().byId("module").getSelectedItems().length; m++) {
					modulevalues.push(this.getView().byId("module").getSelectedItems()[m].getProperty("key"));
				}
				if (modulevalues.length > 0) {
					var modulefilter = [];
					for (var i = 0; i < modulevalues.length; i++) {
						var filters4 = new Filter({
							path: 'MODULE',
							operator: sap.ui.model.FilterOperator.EQ,
							value1: modulevalues[i]
						});
						modulefilter.push(filters4);
					}
					var filterModule = new Filter({
						filters: modulefilter,
						and: false
					});
					oFilters.push(filterModule);
				}
				//for object name
				var objvalues = []; //this.getView().byId("module").getSelectedItems()[0].getProperty("key");
				for (var m = 0; m < this.getView().byId("OBJECT_NAME").getSelectedItems().length; m++) {
					objvalues.push(this.getView().byId("OBJECT_NAME").getSelectedItems()[m].getProperty("key"));
				}
				if (objvalues.length > 0) {
					var objFilter = [];
					for (var i = 0; i < objvalues.length; i++) {
						var filters4 = new Filter({
							path: 'OBJECT_NAME',
							operator: sap.ui.model.FilterOperator.EQ,
							value1: objvalues[i]
						});
						objFilter.push(filters4);
					}
					var filterObj = new Filter({
						filters: objFilter,
						and: false
					});
					oFilters.push(filterObj);
				}
				//for object type
				var objtypevalues = []; //this.getView().byId("module").getSelectedItems()[0].getProperty("key");
				for (var m = 0; m < this.getView().byId("OBJECT_TYPE").getSelectedItems().length; m++) {
					objtypevalues.push(this.getView().byId("OBJECT_TYPE").getSelectedItems()[m].getProperty("key"));
				}
				if (objtypevalues.length > 0) {
					var objtypeFilter = [];
					for (var i = 0; i < objtypevalues.length; i++) {
						var filters4 = new Filter({
							path: 'OBJECT_TYPE',
							operator: sap.ui.model.FilterOperator.EQ,
							value1: objtypevalues[i]
						});
						objtypeFilter.push(filters4);
					}
					var filterObjtype = new Filter({
						filters: objtypeFilter,
						and: false
					});
					oFilters.push(filterObjtype);
				}

				//for object type
				var contactValues = []; //this.getView().byId("module").getSelectedItems()[0].getProperty("key");
				for (var m = 0; m < this.getView().byId("CONTACT_GROUP").getSelectedItems().length; m++) {
					contactValues.push(this.getView().byId("CONTACT_GROUP").getSelectedItems()[m].getProperty("key"));
				}
				if (contactValues.length > 0) {
					var contactFilter = [];
					for (var i = 0; i < contactValues.length; i++) {
						var filters4 = new Filter({
							path: 'CONTACT_GROUP',
							operator: sap.ui.model.FilterOperator.EQ,
							value1: contactValues[i]
						});
						contactFilter.push(filters4);
					}
					var filterContact = new Filter({
						filters: contactFilter,
						and: false
					});
					oFilters.push(filterContact);
				}
				oFilters.push(domain);
				/*var template = new sap.m.ColumnListItem({
					cells: [
						new sap.m.Text({
							text: "{odata_model>MODULE}"
						}),
						new sap.m.Text({
							text: "{odata_model>SUB_MODULE}"
						}),
						new sap.m.Text({
							text: "{odata_model>OBJECT_TYPE}"
						}),
						new sap.m.Text({
							text: "{odata_model>OBJECT_NAME}"
						}),
						new sap.m.Text({
							text: "{odata_model>DESCRIPTION}"
						}),
						new sap.m.Text({
							text: "{odata_model>CONTACT_GROUP}"
						})
					]
				});*/
				// this.oFilter = new Filter(this.filterArr, true);
				var oTable = this.getView().byId("idProductsTable");
				oTable.getBinding("items").sPath = "/obj_repo_search(search='" + searchvalue + "',score=0.8)/Set";
				oTable.getBinding("items").filter(oFilters, "Application");

				// oTable.bindItems(sPath,template,filter1);
				// if (oTable.getBinding("items")) {
				// 	oTable.getBinding("items").filter(this.oFilter);
				// }

				// var filterinput = this.getView().byId("input"); //Filter iD
				// var sQuery = this.getView().byId("input").getValue(); //Filter value
				// var filters = [];
				// var filters = new sap.ui.model.Filter("FreeSearch", sap.ui.model.FilterOperator.Contains, sQuery);
				//	// // debugger;
				// var aFilters = [];
				// var filterArr = [];
				// var sQuery = oEvent.getSource().getValue();
				// if (sQuery && sQuery.length > 0) {
				// 	var filter1 = new Filter("Module", sap.ui.model.FilterOperator.Contains, sQuery);
				// 	var filter2 = new Filter("Sub-Module", sap.ui.model.FilterOperator.Contains, sQuery);
				// 	var filter3 = new Filter("Object Type", sap.ui.model.FilterOperator.Contains, sQuery);
				// 	var filter = new Filter([filter1, filter2, filter3], false);
				// 	aFilters.push(filter);
				// }
				// // update list binding
				// var list = this.getView().byId("idProductsTable");
				// var binding = list.getBinding("items");
				// binding.filter(aFilters, "Application");
				sap.ui.core.BusyIndicator.hide();
			},
			onPersoButtonPressed: function (oEvent) {
				this._oTPC.openDialog();
			},

			// onSearch: function() {
			// 		// // debugger;
			// 		var aCurrentFilterValues = [];
			// 		// aCurrentFilterValues.push(this.getSelectedItemText(this.oSelectName));
			// 		// this.filterTable(aCurrentFilterValues);
			// 	},
			// getSelectedItemText: function(oSelect) {
			// 	// // debugger;
			// 	return oSelect.getSelectedItem() ? oSelect.getSelectedItem().getKey() : "";
			// },
			// 	getSelect: function(sId) {
			// 	// // debugger;
			// 	return this.getView().byId(sId);
			// },

			onToggleHeader: function () {

				this.getPage().setHeaderExpanded(!this.getPage().getHeaderExpanded());
			},

			_onOverflowToolbarButtonPress: function () {
				this.createViewSettingsDialog("sap.tnt.sample.ToolPage.view.ViewSettingsDialog1").open();
			},
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

				var oPath;

				if (this.sContext) {
					oPath = {
						path: "/" + this.sContext,
						parameters: oParams
					};
					this.getView().bindObject(oPath);
				}

			},
			_onPageNavButtonPress: function (oEvent) {

				var oBindingContext = oEvent.getSource().getBindingContext();

				return new Promise(function (fnResolve) {

					this.doNavigate("Launchpad", oBindingContext, fnResolve, "");
				}.bind(this)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});

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
			_onTableItemPress: function (oEvent) {
				// // // debugger;

				var oBindingContext = oEvent.getParameter("listItem").getBindingContext();

				return new Promise(function (fnResolve) {
					this.doNavigate("ObjectDetailsPage", oBindingContext, fnResolve, "");
				}.bind(this)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});

			},
			_onOverflowToolbarButtonPress8: function (oEvent) {

				this.mSettingsDialogs = this.mSettingsDialogs || {};
				var sSourceId = oEvent.getSource().getId();
				var oDialog = this.mSettingsDialogs["ViewSettingsDialog1"];

				var confirmHandler = function (oConfirmEvent) {
					var self = this;
					var sFilterString = oConfirmEvent.getParameter('filterString');
					var oBindingData = {};

					/* Grouping */
					if (oConfirmEvent.getParameter("groupItem")) {
						var sPath = oConfirmEvent.getParameter("groupItem").getKey();
						oBindingData.groupby = [new sap.ui.model.Sorter(sPath, oConfirmEvent.getParameter("groupDescending"), true)];
					} else {
						// Reset the group by
						oBindingData.groupby = null;
					}

					/* Sorting */
					if (oConfirmEvent.getParameter("sortItem")) {
						var sPath = oConfirmEvent.getParameter("sortItem").getKey();
						oBindingData.sorters = [new sap.ui.model.Sorter(sPath, oConfirmEvent.getParameter("sortDescending"))];
					}

					/* Filtering */
					oBindingData.filters = [];
					// The list of filters that will be applied to the collection
					var oFilter;
					var vValueLT, vValueGT;

					// Simple filters (String)
					var mSimpleFilters = {},
						sKey;
					for (sKey in oConfirmEvent.getParameter("filterKeys")) {
						var aSplit = sKey.split("___");
						var sPath = aSplit[1];
						var sValue1 = aSplit[2];
						var oFilterInfo = new sap.ui.model.Filter(sPath, "EQ", sValue1);

						// Creating a map of filters for each path
						if (!mSimpleFilters[sPath]) {
							mSimpleFilters[sPath] = [oFilterInfo];
						} else {
							mSimpleFilters[sPath].push(oFilterInfo);
						}
					}

					for (var path in mSimpleFilters) {
						// All filters on a same path are combined with a OR
						oBindingData.filters.push(new sap.ui.model.Filter(mSimpleFilters[path], false));
					}

					aCollections.forEach(function (oCollectionItem) {
						var oCollection = self.getView().byId(oCollectionItem.id);
						var oBindingInfo = oCollection.getBindingInfo(oCollectionItem.aggregation);
						var oBindingOptions = this.updateBindingOptions(oCollectionItem.id, oBindingData, sSourceId);
						if (oBindingInfo.model === "kpiModel") {
							oCollection.getObjectBinding().refresh();
						} else {
							oCollection.bindAggregation(oCollectionItem.aggregation, {
								model: oBindingInfo.model,
								path: oBindingInfo.path,
								parameters: oBindingInfo.parameters,
								template: oBindingInfo.template,
								templateShareable: true,
								sorter: oBindingOptions.sorters,
								filters: oBindingOptions.filters
							});
						}

						// Display the filter string if necessary
						if (typeof oCollection.getInfoToolbar === "function") {
							var oToolBar = oCollection.getInfoToolbar();
							if (oToolBar && oToolBar.getContent().length === 1) {
								oToolBar.setVisible(!!sFilterString);
								oToolBar.getContent()[0].setText(sFilterString);
							}
						}
					}, this);
				}.bind(this);

				function resetFiltersHandler() {

				}

				function updateDialogData(filters) {
					var mParams = {
						context: oReferenceCollection.getBindingContext(),
						success: function (oData) {
							var oJsonModelDialogData = {};
							// Loop through each entity
							oData.results.forEach(function (oEntity) {
								// Add the distinct properties in a map
								for (var oKey in oEntity) {
									if (!oJsonModelDialogData[oKey]) {
										oJsonModelDialogData[oKey] = [oEntity[oKey]];
									} else if (oJsonModelDialogData[oKey].indexOf(oEntity[oKey]) === -1) {
										oJsonModelDialogData[oKey].push(oEntity[oKey]);
									}
								}
							});

							var oDialogModel = oDialog.getModel();

							if (!oDialogModel) {
								oDialogModel = new sap.ui.model.json.JSONModel();
								oDialog.setModel(oDialogModel);
							}
							oDialogModel.setData(oJsonModelDialogData);
							oDialog.open();
						}
					};
					var sPath;
					var sModelName = oReferenceCollection.getBindingInfo(aCollections[0].aggregation).model;
					// In KPI mode for charts, getBindingInfo would return the local JSONModel
					if (sModelName === "kpiModel") {
						sPath = oReferenceCollection.getObjectBinding().getPath();
					} else {
						sPath = oReferenceCollection.getBindingInfo(aCollections[0].aggregation).path;
					}
					mParams.filters = filters;
					oModel.read(sPath, mParams);
				}

				if (!oDialog) {
					oDialog = sap.ui.xmlfragment({
						fragmentName: "sap.tnt.sample.ToolPage.view.ViewSettingsDialog1"
					}, this);
					oDialog.attachEvent("confirm", confirmHandler);
					oDialog.attachEvent("resetFilters", resetFiltersHandler);

					this.mSettingsDialogs["ViewSettingsDialog1"] = oDialog;
				}

				var aCollections = [];

				aCollections.push({
					id: "sap_Responsive_Page_0-content-sap_m_IconTabBar-1590496821795-items-sap_m_IconTabFilter-1-content-build_simple_Table-1590496965195",
					aggregation: "items"
				});

				var oReferenceCollection = this.getView().byId(aCollections[0].id);
				var oSourceBindingContext = oReferenceCollection.getBindingContext();
				var oModel = oSourceBindingContext ? oSourceBindingContext.getModel() : this.getView().getModel();

				// toggle compact style
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), oDialog);
				var designTimeFilters = this.mBindingOptions && this.mBindingOptions[aCollections[0].id] && this.mBindingOptions[aCollections[0].id]
					.filters && this.mBindingOptions[aCollections[0].id].filters[undefined];
				updateDialogData(designTimeFilters);

			},
			updateBindingOptions: function (sCollectionId, oBindingData, sSourceId) {
				this.mBindingOptions = this.mBindingOptions || {};
				this.mBindingOptions[sCollectionId] = this.mBindingOptions[sCollectionId] || {};

				var aSorters = this.mBindingOptions[sCollectionId].sorters;
				var aGroupby = this.mBindingOptions[sCollectionId].groupby;

				// If there is no oBindingData parameter, we just need the processed filters and sorters from this function
				if (oBindingData) {
					if (oBindingData.sorters) {
						aSorters = oBindingData.sorters;
					}
					if (oBindingData.groupby || oBindingData.groupby === null) {
						aGroupby = oBindingData.groupby;
					}
					// 1) Update the filters map for the given collection and source
					this.mBindingOptions[sCollectionId].sorters = aSorters;
					this.mBindingOptions[sCollectionId].groupby = aGroupby;
					this.mBindingOptions[sCollectionId].filters = this.mBindingOptions[sCollectionId].filters || {};
					this.mBindingOptions[sCollectionId].filters[sSourceId] = oBindingData.filters || [];
				}

				// 2) Reapply all the filters and sorters
				var aFilters = [];
				for (var key in this.mBindingOptions[sCollectionId].filters) {
					aFilters = aFilters.concat(this.mBindingOptions[sCollectionId].filters[key]);
				}

				// Add the groupby first in the sorters array
				if (aGroupby) {
					aSorters = aSorters ? aGroupby.concat(aSorters) : aGroupby;
				}

				var aFinalFilters = aFilters.length > 0 ? [new sap.ui.model.Filter(aFilters, true)] : undefined;
				return {
					filters: aFinalFilters,
					sorters: aSorters
				};

			},
			getCustomFilter: function (sPath, vValueLT, vValueGT) {
				if (vValueLT !== "" && vValueGT !== "") {
					return new sap.ui.model.Filter([
						new sap.ui.model.Filter(sPath, sap.ui.model.FilterOperator.GT, vValueGT),
						new sap.ui.model.Filter(sPath, sap.ui.model.FilterOperator.LT, vValueLT)
					], true);
				}
				if (vValueLT !== "") {
					return new sap.ui.model.Filter(sPath, sap.ui.model.FilterOperator.LT, vValueLT);
				}
				return new sap.ui.model.Filter(sPath, sap.ui.model.FilterOperator.GT, vValueGT);

			},
			getCustomFilterString: function (bIsNumber, sPath, sOperator, vValueLT, vValueGT) {
				switch (sOperator) {
				case sap.ui.model.FilterOperator.LT:
					return sPath + (bIsNumber ? ' (Less than ' : ' (Before ') + vValueLT + ')';
				case sap.ui.model.FilterOperator.GT:
					return sPath + (bIsNumber ? ' (More than ' : ' (After ') + vValueGT + ')';
				default:
					if (bIsNumber) {
						return sPath + ' (More than ' + vValueGT + ' and less than ' + vValueLT + ')';
					}
					return sPath + ' (After ' + vValueGT + ' and before ' + vValueLT + ')';
				}

			},
			filterCountFormatter: function (sValue1, sValue2) {
				return sValue1 !== "" || sValue2 !== "" ? 1 : 0;

			},
			_onOverflowToolbarButtonPress1: function (oEvent) {

				this.mSettingsDialogs = this.mSettingsDialogs || {};
				var sSourceId = oEvent.getSource().getId();
				var oDialog = this.mSettingsDialogs["ViewSettingsDialog2"];

				var confirmHandler = function (oConfirmEvent) {
					var self = this;
					var sFilterString = oConfirmEvent.getParameter('filterString');
					var oBindingData = {};

					/* Grouping */
					if (oConfirmEvent.getParameter("groupItem")) {
						var sPath = oConfirmEvent.getParameter("groupItem").getKey();
						oBindingData.groupby = [new sap.ui.model.Sorter(sPath, oConfirmEvent.getParameter("groupDescending"), true)];
					} else {
						// Reset the group by
						oBindingData.groupby = null;
					}

					/* Sorting */
					if (oConfirmEvent.getParameter("sortItem")) {
						var sPath = oConfirmEvent.getParameter("sortItem").getKey();
						oBindingData.sorters = [new sap.ui.model.Sorter(sPath, oConfirmEvent.getParameter("sortDescending"))];
					}

					/* Filtering */
					oBindingData.filters = [];
					// The list of filters that will be applied to the collection
					var oFilter;
					var vValueLT, vValueGT;

					// Simple filters (String)
					var mSimpleFilters = {},
						sKey;
					for (sKey in oConfirmEvent.getParameter("filterKeys")) {
						var aSplit = sKey.split("___");
						var sPath = aSplit[1];
						var sValue1 = aSplit[2];
						var oFilterInfo = new sap.ui.model.Filter(sPath, "EQ", sValue1);

						// Creating a map of filters for each path
						if (!mSimpleFilters[sPath]) {
							mSimpleFilters[sPath] = [oFilterInfo];
						} else {
							mSimpleFilters[sPath].push(oFilterInfo);
						}
					}

					for (var path in mSimpleFilters) {
						// All filters on a same path are combined with a OR
						oBindingData.filters.push(new sap.ui.model.Filter(mSimpleFilters[path], false));
					}

					aCollections.forEach(function (oCollectionItem) {
						var oCollection = self.getView().byId(oCollectionItem.id);
						var oBindingInfo = oCollection.getBindingInfo(oCollectionItem.aggregation);
						var oBindingOptions = this.updateBindingOptions(oCollectionItem.id, oBindingData, sSourceId);
						if (oBindingInfo.model === "kpiModel") {
							oCollection.getObjectBinding().refresh();
						} else {
							oCollection.bindAggregation(oCollectionItem.aggregation, {
								model: oBindingInfo.model,
								path: oBindingInfo.path,
								parameters: oBindingInfo.parameters,
								template: oBindingInfo.template,
								templateShareable: true,
								sorter: oBindingOptions.sorters,
								filters: oBindingOptions.filters
							});
						}

						// Display the filter string if necessary
						if (typeof oCollection.getInfoToolbar === "function") {
							var oToolBar = oCollection.getInfoToolbar();
							if (oToolBar && oToolBar.getContent().length === 1) {
								oToolBar.setVisible(!!sFilterString);
								oToolBar.getContent()[0].setText(sFilterString);
							}
						}
					}, this);
				}.bind(this);

				function resetFiltersHandler() {

				}

				function updateDialogData(filters) {
					var mParams = {
						context: oReferenceCollection.getBindingContext(),
						success: function (oData) {
							var oJsonModelDialogData = {};
							// Loop through each entity
							oData.results.forEach(function (oEntity) {
								// Add the distinct properties in a map
								for (var oKey in oEntity) {
									if (!oJsonModelDialogData[oKey]) {
										oJsonModelDialogData[oKey] = [oEntity[oKey]];
									} else if (oJsonModelDialogData[oKey].indexOf(oEntity[oKey]) === -1) {
										oJsonModelDialogData[oKey].push(oEntity[oKey]);
									}
								}
							});

							var oDialogModel = oDialog.getModel();

							if (!oDialogModel) {
								oDialogModel = new sap.ui.model.json.JSONModel();
								oDialog.setModel(oDialogModel);
							}
							oDialogModel.setData(oJsonModelDialogData);
							oDialog.open();
						}
					};
					var sPath;
					var sModelName = oReferenceCollection.getBindingInfo(aCollections[0].aggregation).model;
					// In KPI mode for charts, getBindingInfo would return the local JSONModel
					if (sModelName === "kpiModel") {
						sPath = oReferenceCollection.getObjectBinding().getPath();
					} else {
						sPath = oReferenceCollection.getBindingInfo(aCollections[0].aggregation).path;
					}
					mParams.filters = filters;
					oModel.read(sPath, mParams);
				}

				if (!oDialog) {
					oDialog = sap.ui.xmlfragment({
						fragmentName: "com.sap.build.standard.freestylePrototypeForLookupObjects.view.ViewSettingsDialog2"
					}, this);
					oDialog.attachEvent("confirm", confirmHandler);
					oDialog.attachEvent("resetFilters", resetFiltersHandler);

					this.mSettingsDialogs["ViewSettingsDialog2"] = oDialog;
				}

				var aCollections = [];

				aCollections.push({
					id: "sap_Responsive_Page_0-content-sap_m_IconTabBar-1590496821795-items-sap_m_IconTabFilter-1-content-build_simple_Table-1590496965195",
					aggregation: "items"
				});

				var oReferenceCollection = this.getView().byId(aCollections[0].id);
				var oSourceBindingContext = oReferenceCollection.getBindingContext();
				var oModel = oSourceBindingContext ? oSourceBindingContext.getModel() : this.getView().getModel();

				// toggle compact style
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), oDialog);
				var designTimeFilters = this.mBindingOptions && this.mBindingOptions[aCollections[0].id] && this.mBindingOptions[aCollections[0].id]
					.filters && this.mBindingOptions[aCollections[0].id].filters[undefined];
				updateDialogData(designTimeFilters);

			},
			_onOverflowToolbarButtonPress2: function (oEvent) {
				var oTable = oEvent.getSource().getParent().getParent();
				var sTableId = oTable.getId();
				var oPersoService = {
					oPersoData: {
						_persoSchemaVersion: "1.0",
						aColumns: []
					},
					getPersData: function () {
						var oDeferred = new jQuery.Deferred();
						if (!this._oBundle) {
							this._oBundle = this.oPersoData;
						}
						var oBundle = this._oBundle;
						oDeferred.resolve(oBundle);
						return oDeferred.promise();
					},
					setPersData: function (oBundle) {
						var oDeferred = new jQuery.Deferred();
						this._oBundle = oBundle;
						oDeferred.resolve();
						return oDeferred.promise();
					}
				};

				this._oTPCDialogs = this._oTPCDialogs || {};
				var oTPCDialog = this._oTPCDialogs[sTableId];
				if (!oTPCDialog) {
					jQuery.sap.require("sap.m.TablePersoController");
					oTPCDialog = new sap.m.TablePersoController({
						// parent Table toolbar, second parent table
						// this action is enabled only for table toolbar buttons
						table: this.getView().byId(sTableId),
						persoService: oPersoService
					}).activate();
					this._oTPCDialogs[sTableId] = oTPCDialog;
				}
				this._oTPCDialogs[sTableId].refresh();
				this._oTPCDialogs[sTableId].openDialog();

			},
			_onOverflowToolbarButtonPress3: function () {
				return new Promise(function (fnResolve) {
					var sTargetPos = "center bottom";
					sTargetPos = (sTargetPos === "default") ? undefined : sTargetPos;
					sap.m.MessageToast.show("Development objects will be exported to xlsx or csv file", {
						onClose: fnResolve,
						duration: 3000000 || 3000,
						at: sTargetPos,
						my: sTargetPos
					});
				}).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}

				});

			},
			onRowPress: function (oEvent) {
				var item = oEvent.getParameter("listItem").getCells()[3].getProperty("text");
				item = item.replaceAll("/", ".");
				var item1 = oEvent.getParameter("listItem").getCells()[5].getProperty("text");
				var item2 = oEvent.getParameter("listItem").getCells()[6].getProperty("text");
				var item3 = oEvent.getParameter("listItem").getCells()[7].getProperty("text");
				// var item4 = oEvent.getParameter("listItem").getCells()[3].getProperty("text");
				var item5 = oEvent.getParameter("listItem").getCells()[8].getProperty("text");
				var item6 = oEvent.getParameter("listItem").getCells()[9].getProperty("text");
				// var item = "7";
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				// oRouter.navTo("ObjectsDetailsPage");

				// oRouter.navTo("ObjectsDetailsPage", {
				// 	productsPath: item});

				oRouter.navTo("ObjectsDetailsPage", {
					id2: item,
					productsPath: item1,
					id: item2,
					id1: item3,
					id3: item5,
					id4: item6,
				});

				// return new Promise(function (fnResolve) {

				// 	this.doNavigate("ObjectDetailsPage", oBindingContext, fnResolve, "");
				// }.bind(this)).catch(function (err) {
				// 	if (err !== undefined) {
				// 		MessageBox.error(err.message);
				// 	}
				// });

			},

			_onTableItemPress1: function (oEvent) {
				// debugger;
				var oBindingContext = oEvent.getParameter("listItem").getBindingContext();

				return new Promise(function (fnResolve) {
					this.doNavigate("MigrationDetailsPage", oBindingContext, fnResolve, "");
				}.bind(this)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});

			},
			_onOverflowToolbarButtonPress4: function (oEvent) {

				this.mSettingsDialogs = this.mSettingsDialogs || {};
				var sSourceId = oEvent.getSource().getId();
				var oDialog = this.mSettingsDialogs["ViewSettingsDialog3"];

				var confirmHandler = function (oConfirmEvent) {
					var self = this;
					var sFilterString = oConfirmEvent.getParameter('filterString');
					var oBindingData = {};

					/* Grouping */
					if (oConfirmEvent.getParameter("groupItem")) {
						var sPath = oConfirmEvent.getParameter("groupItem").getKey();
						oBindingData.groupby = [new sap.ui.model.Sorter(sPath, oConfirmEvent.getParameter("groupDescending"), true)];
					} else {
						// Reset the group by
						oBindingData.groupby = null;
					}

					/* Sorting */
					if (oConfirmEvent.getParameter("sortItem")) {
						var sPath = oConfirmEvent.getParameter("sortItem").getKey();
						oBindingData.sorters = [new sap.ui.model.Sorter(sPath, oConfirmEvent.getParameter("sortDescending"))];
					}

					/* Filtering */
					oBindingData.filters = [];
					// The list of filters that will be applied to the collection
					var oFilter;
					var vValueLT, vValueGT;

					// Simple filters (String)
					var mSimpleFilters = {},
						sKey;
					for (sKey in oConfirmEvent.getParameter("filterKeys")) {
						var aSplit = sKey.split("___");
						var sPath = aSplit[1];
						var sValue1 = aSplit[2];
						var oFilterInfo = new sap.ui.model.Filter(sPath, "EQ", sValue1);

						// Creating a map of filters for each path
						if (!mSimpleFilters[sPath]) {
							mSimpleFilters[sPath] = [oFilterInfo];
						} else {
							mSimpleFilters[sPath].push(oFilterInfo);
						}
					}

					for (var path in mSimpleFilters) {
						// All filters on a same path are combined with a OR
						oBindingData.filters.push(new sap.ui.model.Filter(mSimpleFilters[path], false));
					}

					aCollections.forEach(function (oCollectionItem) {
						var oCollection = self.getView().byId(oCollectionItem.id);
						var oBindingInfo = oCollection.getBindingInfo(oCollectionItem.aggregation);
						var oBindingOptions = this.updateBindingOptions(oCollectionItem.id, oBindingData, sSourceId);
						if (oBindingInfo.model === "kpiModel") {
							oCollection.getObjectBinding().refresh();
						} else {
							oCollection.bindAggregation(oCollectionItem.aggregation, {
								model: oBindingInfo.model,
								path: oBindingInfo.path,
								parameters: oBindingInfo.parameters,
								template: oBindingInfo.template,
								templateShareable: true,
								sorter: oBindingOptions.sorters,
								filters: oBindingOptions.filters
							});
						}

						// Display the filter string if necessary
						if (typeof oCollection.getInfoToolbar === "function") {
							var oToolBar = oCollection.getInfoToolbar();
							if (oToolBar && oToolBar.getContent().length === 1) {
								oToolBar.setVisible(!!sFilterString);
								oToolBar.getContent()[0].setText(sFilterString);
							}
						}
					}, this);
				}.bind(this);

				function resetFiltersHandler() {

				}

				function updateDialogData(filters) {
					var mParams = {
						context: oReferenceCollection.getBindingContext(),
						success: function (oData) {
							var oJsonModelDialogData = {};
							// Loop through each entity
							oData.results.forEach(function (oEntity) {
								// Add the distinct properties in a map
								for (var oKey in oEntity) {
									if (!oJsonModelDialogData[oKey]) {
										oJsonModelDialogData[oKey] = [oEntity[oKey]];
									} else if (oJsonModelDialogData[oKey].indexOf(oEntity[oKey]) === -1) {
										oJsonModelDialogData[oKey].push(oEntity[oKey]);
									}
								}
							});

							var oDialogModel = oDialog.getModel();

							if (!oDialogModel) {
								oDialogModel = new sap.ui.model.json.JSONModel();
								oDialog.setModel(oDialogModel);
							}
							oDialogModel.setData(oJsonModelDialogData);
							oDialog.open();
						}
					};
					var sPath;
					var sModelName = oReferenceCollection.getBindingInfo(aCollections[0].aggregation).model;
					// In KPI mode for charts, getBindingInfo would return the local JSONModel
					if (sModelName === "kpiModel") {
						sPath = oReferenceCollection.getObjectBinding().getPath();
					} else {
						sPath = oReferenceCollection.getBindingInfo(aCollections[0].aggregation).path;
					}
					mParams.filters = filters;
					oModel.read(sPath, mParams);
				}

				if (!oDialog) {
					oDialog = sap.ui.xmlfragment({
						fragmentName: "com.sap.build.standard.freestylePrototypeForLookupObjects.view.ViewSettingsDialog3"
					}, this);
					oDialog.attachEvent("confirm", confirmHandler);
					oDialog.attachEvent("resetFilters", resetFiltersHandler);

					this.mSettingsDialogs["ViewSettingsDialog3"] = oDialog;
				}

				var aCollections = [];

				aCollections.push({
					id: "sap_Responsive_Page_0-content-sap_m_IconTabBar-1590496821795-items-sap_m_IconTabFilter-3-content-build_simple_Table-1590571689980",
					aggregation: "items"
				});

				var oReferenceCollection = this.getView().byId(aCollections[0].id);
				var oSourceBindingContext = oReferenceCollection.getBindingContext();
				var oModel = oSourceBindingContext ? oSourceBindingContext.getModel() : this.getView().getModel();

				// toggle compact style
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), oDialog);
				var designTimeFilters = this.mBindingOptions && this.mBindingOptions[aCollections[0].id] && this.mBindingOptions[aCollections[0].id]
					.filters && this.mBindingOptions[aCollections[0].id].filters[undefined];
				updateDialogData(designTimeFilters);

			},
			_onOverflowToolbarButtonPress5: function (oEvent) {

				this.mSettingsDialogs = this.mSettingsDialogs || {};
				var sSourceId = oEvent.getSource().getId();
				var oDialog = this.mSettingsDialogs["ViewSettingsDialog4"];

				var confirmHandler = function (oConfirmEvent) {
					var self = this;
					var sFilterString = oConfirmEvent.getParameter('filterString');
					var oBindingData = {};

					/* Grouping */
					if (oConfirmEvent.getParameter("groupItem")) {
						var sPath = oConfirmEvent.getParameter("groupItem").getKey();
						oBindingData.groupby = [new sap.ui.model.Sorter(sPath, oConfirmEvent.getParameter("groupDescending"), true)];
					} else {
						// Reset the group by
						oBindingData.groupby = null;
					}

					/* Sorting */
					if (oConfirmEvent.getParameter("sortItem")) {
						var sPath = oConfirmEvent.getParameter("sortItem").getKey();
						oBindingData.sorters = [new sap.ui.model.Sorter(sPath, oConfirmEvent.getParameter("sortDescending"))];
					}

					/* Filtering */
					oBindingData.filters = [];
					// The list of filters that will be applied to the collection
					var oFilter;
					var vValueLT, vValueGT;

					// Simple filters (String)
					var mSimpleFilters = {},
						sKey;
					for (sKey in oConfirmEvent.getParameter("filterKeys")) {
						var aSplit = sKey.split("___");
						var sPath = aSplit[1];
						var sValue1 = aSplit[2];
						var oFilterInfo = new sap.ui.model.Filter(sPath, "EQ", sValue1);

						// Creating a map of filters for each path
						if (!mSimpleFilters[sPath]) {
							mSimpleFilters[sPath] = [oFilterInfo];
						} else {
							mSimpleFilters[sPath].push(oFilterInfo);
						}
					}

					for (var path in mSimpleFilters) {
						// All filters on a same path are combined with a OR
						oBindingData.filters.push(new sap.ui.model.Filter(mSimpleFilters[path], false));
					}

					aCollections.forEach(function (oCollectionItem) {
						var oCollection = self.getView().byId(oCollectionItem.id);
						var oBindingInfo = oCollection.getBindingInfo(oCollectionItem.aggregation);
						var oBindingOptions = this.updateBindingOptions(oCollectionItem.id, oBindingData, sSourceId);
						if (oBindingInfo.model === "kpiModel") {
							oCollection.getObjectBinding().refresh();
						} else {
							oCollection.bindAggregation(oCollectionItem.aggregation, {
								model: oBindingInfo.model,
								path: oBindingInfo.path,
								parameters: oBindingInfo.parameters,
								template: oBindingInfo.template,
								templateShareable: true,
								sorter: oBindingOptions.sorters,
								filters: oBindingOptions.filters
							});
						}

						// Display the filter string if necessary
						if (typeof oCollection.getInfoToolbar === "function") {
							var oToolBar = oCollection.getInfoToolbar();
							if (oToolBar && oToolBar.getContent().length === 1) {
								oToolBar.setVisible(!!sFilterString);
								oToolBar.getContent()[0].setText(sFilterString);
							}
						}
					}, this);
				}.bind(this);

				function resetFiltersHandler() {

				}

				function updateDialogData(filters) {
					var mParams = {
						context: oReferenceCollection.getBindingContext(),
						success: function (oData) {
							var oJsonModelDialogData = {};
							// Loop through each entity
							oData.results.forEach(function (oEntity) {
								// Add the distinct properties in a map
								for (var oKey in oEntity) {
									if (!oJsonModelDialogData[oKey]) {
										oJsonModelDialogData[oKey] = [oEntity[oKey]];
									} else if (oJsonModelDialogData[oKey].indexOf(oEntity[oKey]) === -1) {
										oJsonModelDialogData[oKey].push(oEntity[oKey]);
									}
								}
							});

							var oDialogModel = oDialog.getModel();

							if (!oDialogModel) {
								oDialogModel = new sap.ui.model.json.JSONModel();
								oDialog.setModel(oDialogModel);
							}
							oDialogModel.setData(oJsonModelDialogData);
							oDialog.open();
						}
					};
					var sPath;
					var sModelName = oReferenceCollection.getBindingInfo(aCollections[0].aggregation).model;
					// In KPI mode for charts, getBindingInfo would return the local JSONModel
					if (sModelName === "kpiModel") {
						sPath = oReferenceCollection.getObjectBinding().getPath();
					} else {
						sPath = oReferenceCollection.getBindingInfo(aCollections[0].aggregation).path;
					}
					mParams.filters = filters;
					oModel.read(sPath, mParams);
				}

				if (!oDialog) {
					oDialog = sap.ui.xmlfragment({
						fragmentName: "com.sap.build.standard.freestylePrototypeForLookupObjects.view.ViewSettingsDialog4"
					}, this);
					oDialog.attachEvent("confirm", confirmHandler);
					oDialog.attachEvent("resetFilters", resetFiltersHandler);

					this.mSettingsDialogs["ViewSettingsDialog4"] = oDialog;
				}

				var aCollections = [];

				aCollections.push({
					id: "sap_Responsive_Page_0-content-sap_m_IconTabBar-1590496821795-items-sap_m_IconTabFilter-3-content-build_simple_Table-1590571689980",
					aggregation: "items"
				});

				var oReferenceCollection = this.getView().byId(aCollections[0].id);
				var oSourceBindingContext = oReferenceCollection.getBindingContext();
				var oModel = oSourceBindingContext ? oSourceBindingContext.getModel() : this.getView().getModel();

				// toggle compact style
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), oDialog);
				var designTimeFilters = this.mBindingOptions && this.mBindingOptions[aCollections[0].id] && this.mBindingOptions[aCollections[0].id]
					.filters && this.mBindingOptions[aCollections[0].id].filters[undefined];
				updateDialogData(designTimeFilters);

			},
			_onOverflowToolbarButtonPress6: function (oEvent) {
				var oTable = oEvent.getSource().getParent().getParent();
				var sTableId = oTable.getId();
				var oPersoService = {
					oPersoData: {
						_persoSchemaVersion: "1.0",
						aColumns: []
					},
					getPersData: function () {
						var oDeferred = new jQuery.Deferred();
						if (!this._oBundle) {
							this._oBundle = this.oPersoData;
						}
						var oBundle = this._oBundle;
						oDeferred.resolve(oBundle);
						return oDeferred.promise();
					},
					setPersData: function (oBundle) {
						var oDeferred = new jQuery.Deferred();
						this._oBundle = oBundle;
						oDeferred.resolve();
						return oDeferred.promise();
					}
				};

				this._oTPCDialogs = this._oTPCDialogs || {};
				var oTPCDialog = this._oTPCDialogs[sTableId];
				if (!oTPCDialog) {
					jQuery.sap.require("sap.m.TablePersoController");
					oTPCDialog = new sap.m.TablePersoController({
						// parent Table toolbar, second parent table
						// this action is enabled only for table toolbar buttons
						table: this.getView().byId(sTableId),
						persoService: oPersoService
					}).activate();
					this._oTPCDialogs[sTableId] = oTPCDialog;
				}
				this._oTPCDialogs[sTableId].refresh();
				this._oTPCDialogs[sTableId].openDialog();

			},
			_onOverflowToolbarButtonPress7: function () {
				return new Promise(function (fnResolve) {
					var sTargetPos = "center bottom";
					sTargetPos = (sTargetPos === "default") ? undefined : sTargetPos;
					sap.m.MessageToast.show("Migration Objects will be exported to xlsx or csv file", {
						onClose: fnResolve,
						duration: 3000000 || 3000,
						at: sTargetPos,
						my: sTargetPos
					});
				}).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});

			},
			_onRowPress1: function (oEvent) {

				var oBindingContext = oEvent.getSource().getBindingContext();

				return new Promise(function (fnResolve) {

					this.doNavigate("MigrationDetailsPage", oBindingContext, fnResolve, "");
				}.bind(this)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});

			},
			avatarInitialsFormatter: function (sTextValue) {
				return typeof sTextValue === 'string' ? sTextValue.substr(0, 2) : undefined;

			},
			// fnBasicSearch: function (oEvent) {
			// 	// var sQuery = oEvent.getParameter("query");
			// 	var sQuery = oEvent.getSource().getValue().toUpperCase();
			// 	var oTable = this.getView().byId("idProductsTable");
			// 	//FilterOperator
			// 	// var filter = new Filter("MODULE", sap.ui.model.FilterOperator.Contains, selectedItem);
			// 	// 	this._selectedItems(filter, selectedItem, true);
			// 	var aFilters = [];
			// 	var aFinalFilter = [];
			// 	if (sQuery) {

			// 		aFilters.push(new Filter("SUB_MODULE", FilterOperator.Contains, sQuery));
			// 		aFilters.push(new Filter("MODULE", FilterOperator.Contains, sQuery));
			// 		aFilters.push(new Filter("OBJECT_TYPE", FilterOperator.Contains, sQuery));
			// 		aFilters.push(new Filter("OBJECT_NAME", FilterOperator.Contains, sQuery));
			// 		aFilters.push(new Filter("SYSTEM_ID", FilterOperator.Contains, sQuery));
			// 		aFilters.push(new Filter("TAG_DOMAIN", FilterOperator.Contains, sQuery));
			// 		aFilters.push(new Filter("TAGS", FilterOperator.Contains, sQuery));
			// 		aFilters.push(new Filter("FUNC_GROUP", FilterOperator.Contains, sQuery));
			// 		aFilters.push(new Filter("DEV_CLASS", FilterOperator.Contains, sQuery));
			// 		aFilters.push(new Filter("CONTACT_ID", FilterOperator.Contains, sQuery));
			// 		aFilters.push(new Filter("CONTACT_GROUP", FilterOperator.Contains, sQuery));
			// 		aFilters.push(new Filter("DOCUMENT_LINK", FilterOperator.Contains, sQuery));
			// 		aFilters.push(new Filter("DESCRIPTION", FilterOperator.Contains, sQuery));
			// 		aFilters.push(new Filter("C_CREATED_BY", FilterOperator.Contains, sQuery));
			// 		aFilters.push(new Filter("C_CHANGED_BY", FilterOperator.Contains, sQuery));
			// 		aFilters.push(new Filter("TARGET_TEAMS", FilterOperator.Contains, sQuery));
			// 		aFilters.push(new Filter("USAGE_SCEN", FilterOperator.Contains, sQuery));
			// 		aFilters.push(new Filter("IMPL_STEPS", FilterOperator.Contains, sQuery));

			// 		//OBJECT
			// 		aFinalFilter.push(new Filter(aFilters, false));
			// 	}
			// 	if (oTable.getBinding("items")) {
			// 		oTable.getBinding("items").filter(aFinalFilter);
			// 	}
			// },
			onSelectionChange: function (oEvent) {

				// var selectedItems = [];
				// var oSrc = oEvent.getSource();
				// //var oField = oSrc.getId().split("--")[2];
				// var localArr = [];
				// localArr = [...this.filterArr];
				// localArr.forEach(ele => {
				// 	if (ele.sPath === "MODULE" || ele.sPath === "SUB_MODULE")
				// 		this.filterArr.splice(this.filterArr.indexOf(ele), 1);
				// });
				// var aItems = oSrc.getSelectedItems();
				// for (var i = 0; i < aItems.length; i++) {
				// 	var selectedItem = aItems[i].getProperty("text").toUpperCase();
				// 	// selectedItems.push(selectedItem);

				// 	var filter = new Filter("SUB_MODULE", sap.ui.model.FilterOperator.Contains, selectedItem);
				// 	this._selectedItems(filter, selectedItem, false);
				// 	selectedItem = aItems[i].getProperty("key").toUpperCase();
				// 	// selectedItems.push(selectedItem);

				// 	filter = new Filter("MODULE", sap.ui.model.FilterOperator.Contains, selectedItem);
				// 	this._selectedItems(filter, selectedItem, false);
				// }
				// //this.oFilter = 
			},
			onSelection: function (oEvent) {

				// var selectedItems = [];
				// var oSrc = oEvent.getSource();
				// var oField = oSrc.getId().split("--")[2];
				// var localArr = [];
				// localArr = [...this.filterArr];
				// localArr.forEach(ele => {
				// 	if (ele.sPath === oField)
				// 		this.filterArr.splice(this.filterArr.indexOf(ele), 1);
				// });
				// var aItems = oSrc.getSelectedItems();
				// for (var i = 0; i < aItems.length; i++) {
				// 	var selectedItem = aItems[i].getProperty("text").toUpperCase();
				// 	// selectedItems.push(selectedItem);

				// 	var filter = new Filter(oField, sap.ui.model.FilterOperator.Contains, selectedItem);
				// 	this._selectedItems(filter, selectedItem, true);
				// }
				// //this.oFilter = new Filter(filterArr);

			},
			_selectedItems: function (filter, selectedItem, notMOdSub) {

				// var addIt = true;
				// if (notMOdSub) {
				// 	this.filterArr.forEach(ele => {
				// 		if (ele.oValue1 === selectedItem) {
				// 			this.filterArr.splice(this.filterArr.indexOf(ele), 1);
				// 			// addIt = false;
				// 			return;
				// 		} // else
				// 		// else
				// 		// 	addIt = true; // this.filterArr.push(filter);	
				// 	});
				// } else {
				// 	this.filterArr.forEach(ele => {
				// 		if (this.filterArr.length % 2 !== 0)
				// 			return;
				// 		else if (ele.oValue1 === selectedItem) {
				// 			this.filterArr.splice(this.filterArr.indexOf(ele), 2);
				// 			// addIt = false;
				// 			return;
				// 		} // else
				// 		// else
				// 		// 	addIt = true; // this.filterArr.push(filter);	
				// 	});
				// }

				// // if (addIt)
				// this.filterArr.push(filter);
				// // var aSelected = [];
				// // $.each(aItems, function (i, o) {
				// // 	aSelected.push(o.getBindingContext("odata_model").getObject());
				// // });

			},
			onChange: function () {

			},
			onInit: function (oEvent) {
				// this.getView().bindElement({
				// 	path: "/ProductCollection/" + oEvent.getParameter("arguments").productsPath,
				// 	model: "maintain"
				// });
				// var title = this.getView().byId("page1");
				// title.addStyleClass("title");
				// var dataModel = this.getOwnerComponent().getModel("settingModel");
				// this.getView().setModel(dataModel, "DataModel");
				this._mViewSettingsDialogs = {};
				//        	this.oSelectName = this.getSelect("FreeSearch");
				var oFB = this.getView().byId("filterbar");
				if (oFB) {
					// oFB.variantsInitialized();
					var a = oFB.determineFilterItemByName("A");
					var b = oFB.determineFilterItemByName("B");
					var c = oFB.determineFilterItemByName("D");
					//var q = sap.ui.getCore().byId("Search");
				}

				//	this.oSelObjectType = this.getSelect("idObjectType");
				// var oSearchField = oFB.getBasicSearch();
				// var oBasicSearch;
				// if (!oSearchField) {
				// 	oBasicSearch = new sap.m.SearchField({
				// 		showSearchButton: true,
				// 		search: jQuery.proxy(this.fnBasicSearch, this)
				// 	});
				// } else {
				// 	oSearchField = null;
				// }
				var multiCombo = this.getView().byId("idObjectType");
				// if (this.getView().byId("idProductsTable").getBinding("items") === undefined) {} else {
				// 	this.getView().byId("idProductsTable").getBinding("items").changeParameters({
				// 		"$select": "MODULE,SUB_MODULE,OBJECT_TYPE,OBJECT_NAME,DESCRIPTION,CONTACT_GROUP"
				// 	});
				// }
				// oFB.setBasicSearch(oBasicSearch);

				// oBasicSearch.attachBrowserEvent("keyup", function (e) {
				// 	//logic for search

				// 	// this.fnBasicSearch();
				// }.bind(this));
				this._oTPC = new TablePersoController({
					table: this.byId("idProductsTable"),
					//specify the first part of persistence ids e.g. 'demoApp-productsTable-dimensionsCol'
					componentName: "perso",
					persoService: PersoService
				}).activate();
				// var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				// oRouter.getRoute("ToolPage").attachPatternMatched(this._onObjectMatched, this);
				// this.onSearch();
				// this.getOwnerComponent().getRouter().getRoute("ToolPage").attachPatternMatched(this._onObjectMatched, this);
				// this.oRouter = this.getOwnerComponent().getRouter();

			},
			onAfterRendering: function (oEvent) {

				// var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				// oRouter.getRoute("ToolPage").attachPatternMatched(this._onObjectMatched, this);
			},
			_onObjectMatched: function (oEvent) {
				this.onSearch();
			},
			onExit: function () {

				// to destroy templates for bound aggregations when templateShareable is true on exit to prevent duplicateId issue
				var aControls = [{
					"controlId": "sap_Responsive_Page_0-content-sap_m_IconTabBar-1590496821795-items-sap_m_IconTabFilter-1-content-build_simple_Table-1590496965195",
					"groups": ["items"]
				}, {
					"controlId": "sap_Responsive_Page_0-content-sap_m_IconTabBar-1590496821795-items-sap_m_IconTabFilter-3-content-build_simple_Table-1590571689980",
					"groups": ["items"]
				}];
				for (var i = 0; i < aControls.length; i++) {
					var oControl = this.getView().byId(aControls[i].controlId);
					if (oControl) {
						for (var j = 0; j < aControls[i].groups.length; j++) {
							var sAggregationName = aControls[i].groups[j];
							var oBindingInfo = oControl.getBindingInfo(sAggregationName);
							if (oBindingInfo) {
								var oTemplate = oBindingInfo.template;
								oTemplate.destroy();
							}
						}
					}
				}
				var oDialogKey,
					oDialogValue;

				for (oDialogKey in this._mViewSettingsDialogs) {
					oDialogValue = this._mViewSettingsDialogs[oDialogKey];

					if (oDialogValue) {
						oDialogValue.destroy();
					}
				}

			},
			onCollapseExpandPress: function () {
				var oToolPage = this.byId("id-toolpage");
				oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
			},
			onItemSelect: function (oEvent) {
				var oItem = oEvent.getParameter("item");
				if (oItem.getKey() === "MigrationArtifacts" || oItem.getKey() === "DevelopmentArtifacts") {
					this.onSearch();
					this.byId("pageContainer").to(this.getView().createId("DevelopmentArtifacts"));
				} else if (oItem.getKey() === "ChangeanArtifact") {
					var that = this;
					var oModel = new JSONModel();
					jQuery.ajax(sap.ui.require.toUrl("RBEI_UI5/rbei_ui5_reuse_rep/model/maintain.json"), {
						dataType: "json",
						success: function (oData) {
							oModel.setData(oData);
							// this.byId("pageContainer").to(this.getView().setModel(oModel));
							// that.byId("pageContainer").to(that.getView().setModel(oModel));
							that.byId("pageContainer").to(that.getView().createId(oItem.getKey()));
							that.getView().setModel(oModel);
							// 
						}
					});
					return oModel;

				} else if (oItem.getKey() === "") {
					this.getOwnerComponent().getRouter().navTo("View1", {}, true);
				} else {
					this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
				}

				var oFCL = this.oView.getParent().getParent();
				oFCL.setLayout(fioriLibrary.LayoutType.OneColumn);
			},

			//// debugger
			getGroupHeader: function (oGroup) {
				return new SeparatorItem({
					text: oGroup.key
				});
			},
			sortGroups: function (txt) {
				return txt;
			},
			onListItemPress: function (oEvent) {
				debugger;
				var aFilters = [];
				var value, value1, value2, value3, value4;
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				var productPath = oEvent.getSource().getBindingContext("odata_model").getPath();
				var product = productPath.substring(productPath.lastIndexOf("/") + 5).replace(")", "");
				product = "A_ID" + ' ' + "eq" + ' ' + product;
				// product = product.replaceAll("=", " eq ");
				// product = product.replaceAll(",", " and ");
				// var arr = product.split(",");
				// value = arr[0].split("=");
				// var module = value[1];
				// value1 = arr[1].split("=");
				// var submodule = value1[1];
				// value2 = arr[2].split("=");
				// var objtype = value2[1];
				// value3 = arr[3].split("=");
				// var objname = value3[1];
				// value4 = arr[4].split("=");
				// var sysID = value4[1];

				// var filter = new Filter("A_ID", sap.ui.model.FilterOperator.EQ, product);
				// aFilters.push(filter);
				// filter = new Filter("SUB_MODULE", sap.ui.model.FilterOperator.EQ, submodule);
				// aFilters.push(filter);
				// filter = new Filter("OBJECT_TYPE", sap.ui.model.FilterOperator.EQ, objtype);
				// aFilters.push(filter);
				// filter = new Filter("OBJECT_NAME", sap.ui.model.FilterOperator.EQ, objname);
				// aFilters.push(filter);
				// filter = new Filter("SYSTEM_ID", sap.ui.model.FilterOperator.EQ, sysID);
				// aFilters.push(filter);
				// product = "A_ID".concat("eq", "product");
				var newvalue = "*";
				var that = this;
				jQuery.get({
					url: "/srv_test/repo/obj_repo_search(search='" + newvalue + "',score=0.8)/Set?$filter=" + product,
					// filters: [filter],
					success: function (data) {
						debugger;

						that.getOwnerComponent().getModel("products").setData(data.value);
						var settingModel = that.getOwnerComponent().getModel("products").getData();
						// this.getView().setModel(settingModel, "settingModel");
						oRouter.navTo("ObjectsDetailsPage", {
							product: data.value[0].SUB_MODULE,
							layout: sap.f.LayoutType.TwoColumnsMidExpanded
						});
						// t.getView().byId("Search").setModel(searchmodel, "searchMdl");
					},
					error: function (error) {
						// your error logic

					}
				});

				// oRouter.navTo("ObjectsDetailsPage", {layout: fioriLibrary.LayoutType.TwoColumnsMidExpanded});
				// var obj = oEvent.getSource().getAggregation("cells")[3].getText();
				// obj = obj.replaceAll("/", ".");
				// var grp = oEvent.getSource().getAggregation("cells")[5].getText();
				// var tag = oEvent.getSource().getAggregation("cells")[6].getText();
				// var type = oEvent.getSource().getAggregation("cells")[7].getText();
				// var id = oEvent.getSource().getAggregation("cells")[8].getText();
				// var reuse = oEvent.getSource().getAggregation("cells")[9].getText();

				// this.getView().getModel("DataModel").setData({
				// 	OBJECT_NAME: obj,
				// 	CONTACT_GROUP: grp,
				// 	TAGS: tag,
				// 	OBJECT_TYPE: type,
				// 	SYSTEM_ID: id,
				// 	REUSPR: reuse
				// });
				// var array = [];

				// var obj1 = {
				// 	OBJECT_NAME: obj,
				// 	CONTACT_GROUP: grp,
				// 	TAGS: tag,
				// 	OBJECT_TYPE: type,
				// 	SYSTEM_ID: id,
				// 	REUSPR: reuse
				// };
				// array.push(obj1);
				// var product = JSON.stringify(array);
				// // var settingModel = this.getView().getModel("settingModel").getData();

				var oFCL = this.oView.getParent().getParent();
				oFCL.setLayout(fioriLibrary.LayoutType.TwoColumnsBeginExpanded);
			}

		});
	}, /* bExport= */ true);