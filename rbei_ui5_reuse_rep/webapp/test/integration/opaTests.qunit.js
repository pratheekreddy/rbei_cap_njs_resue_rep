/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"RBEI_UI5/rbei_ui5_reuse_rep/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});