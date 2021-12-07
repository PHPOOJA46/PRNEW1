sap.ui.define([
    "zprcreatenew/controller/BaseController"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
    function (Controller) {
        "use strict";
        //  var SortOrder =  sap.ui.table.SortOrder;
        return Controller.extend("zprcreatenew.controller.PRDisplay", {
            onInit: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("PRDisplay").attachPatternMatched(this._onObjectMatched, this);
            },

            _onObjectMatched: function (oevent) {
                this.onValueHelp();
                this._bSortColumnDescending = true;
                var oMdl = this.getOwnerComponent().getModel();
                this.getOwnerComponent().lineitem = "";
                var aFilters = [];
                var that = this;
                var Stat = "";
                this.getOwnerComponent().lineitem = "";
                this.getOwnerComponent().lineno = "";
                this.getOwnerComponent().items = [];
                this.getOwnerComponent().plants = "";
                this.getOwnerComponent().accountassign = "";
                this.getOwnerComponent().GLAccount = "";
                this.getOwnerComponent().lastlinekey = "";
                this.getOwnerComponent().Close = "";
                this.getOwnerComponent().VendorName = "";
                var PR = this.getView().byId("PRNo").getValue();
                var CreatedDate = this.getView().byId("CreatedOn").getValue();
                // var Stat = this.getView().byId("Status").getSelectedKey();
                if (this.getView().byId("Status").getSelectedItem() !== null) {
                    Stat = this.getView().byId("Status").getSelectedItem().getText();
                }
                var ProfitCenter = this.getView().byId("profit").getValue();
                var CostCenter = this.getView().byId("costcenter").getValue();
                var Vendor = this.getView().byId("Vendor").getValue();
                var Isbn = this.getView().byId("isbn").getValue();
                var IntOrder = this.getView().byId("Internalorder").getValue();
                if (PR !== "") {
                    aFilters.push(new sap.ui.model.Filter("Banfn", sap.ui.model.FilterOperator.EQ, PR));
                }

                if (CreatedDate !== "") {
                    aFilters.push(new sap.ui.model.Filter("Erfdate", sap.ui.model.FilterOperator.EQ, CreatedDate));
                }

                if (Vendor !== "") {
                    aFilters.push(new sap.ui.model.Filter("Elifn", sap.ui.model.FilterOperator.EQ, Vendor));
                }
                if (Stat !== "") {
                    aFilters.push(new sap.ui.model.Filter("Zestak", sap.ui.model.FilterOperator.EQ, Stat));
                }
                if (ProfitCenter !== "") {
                    aFilters.push(new sap.ui.model.Filter("Prctr", sap.ui.model.FilterOperator.EQ, ProfitCenter));
                }

                if (CostCenter !== "") {
                    aFilters.push(new sap.ui.model.Filter("Kostl", sap.ui.model.FilterOperator.EQ, CostCenter));
                }
                if (Isbn !== "") {
                    aFilters.push(new sap.ui.model.Filter("Isbn", sap.ui.model.FilterOperator.EQ, Isbn));
                }
                if (IntOrder !== "") {
                    aFilters.push(new sap.ui.model.Filter("Aufnr", sap.ui.model.FilterOperator.EQ, IntOrder));
                }

                oMdl.read("/PRSearchSet", {
                    filters: aFilters,
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
                var tat = this;
                this.oModel = this.getOwnerComponent().getModel("valuehelp");
                this.oModel.read("/PRStatusSet", {
                    success: function (odata) {
                        var oMod = odata.results;
                        var oJson = new sap.ui.model.json.JSONModel(oMod);
                        tat.getView().setModel(oJson, "oComboModel");
                    },
                    error: function (e) {
                        var err = e;
                    }
                })
            },

            /* onPRCopy: function (oEvent) {
                 var PRNo = this.getView().byId("PRDisplay").getSelectedItem().getBindingContext("PRListModel").getObject();
                 this.getOwnerComponent().getRouter().navTo("PRPreview", {
                     PRPreview: PRNo,
                     PRCopy: "X"
                 }, true);
             },*/

            /*onBack: function () {
                this.getOwnerComponent().getRouter().navTo("RoutePRCreation");
            },*/

            handleSortButtonPressed: function (oEvent) {
                var oTable = this.getView().byId("PRDisplay");
                var oItems = oTable.getBinding("items");
                var aSorters = [];
                var bDescending = this._bSortColumnDescending ? true : false;
                aSorters.push(new sap.ui.model.Sorter("Banfn", bDescending));
                oItems.sort(aSorters);
                this._bSortColumnDescending = !this._bSortColumnDescending;
            },

            onGo: function (oEvent) {
                var PRNo = oEvent.getSource().getBindingContext("PRListModel").getObject().Banfn;
                this.getOwnerComponent().getRouter().navTo("PRPreview", {
                    PRPreview: PRNo,
                    PRCopy: "0"
                }, true);
            },

            handleVendorHelp: function (oevent) {
                sap.ui.controller("zprcreatenew.controller.BaseController").handleVendorHelp(oevent, this);
            },
            OnCloseDialog: function (oevent) {
                sap.ui.controller("zprcreatenew.controller.BaseController").OnCloseDialog(oevent);
            },
            onValueHelpVendorLineItemPress: function (evt) {
                sap.ui.controller("zprcreatenew.controller.BaseController").onValueHelpVendorLineItemPress(evt, this);
            },
            onCreatePR: function () {
                var tat = this;
                sap.m.MessageBox.warning("Do you want to create new PR ?", {
                    actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                    emphasizedAction: sap.m.MessageBox.Action.OK,
                    onClose: function (sAction) {
                        if (sAction === "OK") {
                            tat.getOwnerComponent().getRouter().navTo("RoutePRCreation");
                        }
                    }
                });
            },
            //pratik changes
            onBack: function () {
                this.getOwnerComponent().getRouter().navTo("RoutePRCreation");
                /*  var tat = this;
                  sap.m.MessageBox.warning("Do you want to navigate back ?", {
                      actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                      emphasizedAction: sap.m.MessageBox.Action.OK,
                      onClose: function (sAction) {
                          if (sAction === "OK") {
                              tat.getOwnerComponent().getRouter().navTo("RoutePRCreation");
                          }
                      }
                  });*/
            },

            onPRCopy: function (oEvent) {
                var a = this.getView().byId("PRDisplay").getSelectedItem();
                if (a === null) {
                    sap.m.MessageBox.warning("Please select at least one PR no. to copy.", {
                        actions: [sap.m.MessageBox.Action.CANCEL],
                        emphasizedAction: sap.m.MessageBox.Action.OK,
                        onClose: function (sAction) {
                        }
                    });
                } else {
                    var PRNo = a.getBindingContext("PRListModel").getObject().Banfn;
                    this.getOwnerComponent().getRouter().navTo("PRPreview", {
                        PRPreview: PRNo,
                        PRCopy: "X"
                    }, true);
                }
            },
        });
    });
