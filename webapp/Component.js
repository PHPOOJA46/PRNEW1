sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"zprcreatenew/model/models"
], function (UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("zprcreatenew.Component", {

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
            this.lineitem = "";
            this.lineno = "";
            this.items = [];
            this.plants = "";
            this.accountassign = "";
            this.GLAccount = "";
            this.Close = "";
            this.lastlinekey = "";
            this.VendorName = "";
            this.errormsg = "";
			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
            //this.abc = "123";
		}
     
	});
});
