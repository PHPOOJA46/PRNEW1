sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
    function (Controller) {
        "use strict";

        return Controller.extend("zprcreatenew.controller.PRDisplay", {
            onInit: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("PRDisplay").attachPatternMatched(this._onObjectMatched, this);
            },

            _onObjectMatched: function (oevent) {
                var oMdl = this.getOwnerComponent().getModel();
                var aFilters = [];
                var that = this;
                /*   aFilters.push(new sap.ui.model.Filter("Erfdate", sap.ui.model.FilterOperator.EQ, sMatdocno));
                   aFilters.push(new sap.ui.model.Filter("Elifn", sap.ui.model.FilterOperator.EQ, sMatdocno));
                   aFilters.push(new sap.ui.model.Filter("Banfn", sap.ui.model.FilterOperator.EQ, sMatdocno));
                   aFilters.push(new sap.ui.model.Filter("Estak", sap.ui.model.FilterOperator.EQ, sMatdocno));
   */
                oMdl.read("/PRSearchSet", {
                    urlParameters: {
                        "filters": aFilters
                    },
                    success: function (oData) {
                        var aPRList = [];
                        aPRList = oData;
                        var oModel = new sap.ui.model.json.JSONModel(aPRList);
                        that.getView().setModel(oModel, "PRListModel");
                    }.bind(this),
                    error: function (oError) {
                        console.log(oData);
                    }.bind(this)
                });
            },

            onBack: function () {
                this.getOwnerComponent().getRouter().navTo("RoutePRCreation");
            },

            onGo: function (oEvent) {
                var PRNo = oEvent.getSource().getBindingContext("PRListModel").getObject().Banfn;
                this.getOwnerComponent().getRouter().navTo("PRPreview", {
                    PRPreview: PRNo
                }, true);
            }
        });
    });
