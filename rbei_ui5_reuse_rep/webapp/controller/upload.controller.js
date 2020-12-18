sap.ui.define([
	'jquery.sap.global',
	"sap/ui/core/mvc/Controller",
	"sap/ui/export/Spreadsheet",
	"Repository/Repository/libs/jszip",
	"Repository/Repository/libs/xlsx",
	"sap/ui/model/json/JSONModel",
], function (jQuery, Controller, Spreadsheet, jszip, xlsx, JSONModel) {
	"use strict";
	var data;
	var Result = [];
	return Controller.extend("RBEI_UI5.rbei_ui5_reuse_rep.controller.upload", {
		onInit: function () {
			var testdata = [];
			var oModel = new JSONModel({
				data: testdata
			});
			this.getView().setModel(oModel);
		},
		onTemplate: function () {
			window.open("https://ltyqpn0ulhw4bkzcbei-cap-njs-reuse.cfapps.us10.hana.ondemand.com/bulk/sample")
		},
		onPressReview1: function (oEvent) {
			debugger;
			var oWizardStep = oEvent.getSource();
			var oFirstStep = oWizardStep.getSteps()[0];
			oWizardStep.goToStep(oFirstStep);
		},
		onUpload: function (oEvent) {
			debugger;
			var oTable = this.getView().byId("table0").getModel();
			var oFileUploader = this.byId("AttachUploader");
			var file = jQuery.sap.domById(oFileUploader.getId() + "-fu").files[0];
			var reader = new FileReader();
			reader.onload = function (e) {
					debugger;
					data = e.target.result;
					var workbook = XLSX.read(data, {
						type: 'binary'
					});
					workbook.SheetNames.forEach(function (sheetName) {
						debugger;
						var excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
						for (var i = 3; i < excelData.length; i++) {
							// var excelData1 = {
							// 	excelData1 = excelData[i];
							// };
							Result.push(excelData[i]);
						}
						// if (excelData.length > 0) {
						// 	result[sheetName] = excelData;
						// }
						oTable.setData({
							data: Result
						});
					});
				},
				reader.readAsBinaryString(file);
		},
		onSave: function (oEvent) {
			debugger;
			var formData = new FormData();
			var oFileUploader = this.byId("AttachUploader");
			var file = jQuery.sap.domById(oFileUploader.getId() + "-fu").files[0];
			formData.append("MyKey", file);
			try {
				if (file) {
					this._bUploading = true;
					var oHeaders;
					// var sUrl = "/sap/opu/odata/sap/ZCOMP_POC_SRV/";
					// var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
					// sap.ui.getCore().setModel(oModel);

					oHeaders = {
						"slug": "QF",
						"DataServiceVersion": "2.0",
						"X-CSRF-Token": "Fetch"
					};
					/*******************To Upload File************************/
					var oURL = "https://5wqyij10g9bexh91bei-cap-njs-reuse.cfapps.us10.hana.ondemand.com/bulk/insert";
					debugger;
					jQuery.ajax({
						type: "POST",
						url: oURL,
						async: false,
						headers: oHeaders,
						cache: false,
						processData: false,
						dataType: "json",
						contentType: false,
						data: formData,
						success: function (data) {
							debugger;
							var rec = data.getElementsByTagName("entry")[0].children[5].getAttribute("src");
							sap.m.MessageToast.show("File Uploaded Successfully" + rec);
						},
						error: function (error) {
							debugger;
							sap.m.MessageToast.show("File Uploaded ");
						}
					});
				}
			} catch (oException) {
				jQuery.sap.log.error("File upload failed: \n" + oException.message);
			}
		}
	});
});