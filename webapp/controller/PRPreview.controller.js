sap.ui.define([
    "zprcreatenew/controller/BaseController"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
    function (Controller) {
        "use strict";
        var aLineItemArr = [], SubmitFlag = "";
        return Controller.extend("zprcreatenew.controller.PRPreview", {
            onInit: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("PRPreview").attachPatternMatched(this._onObjectMatched, this);
            },

            _onObjectMatched: function (oEvent) {
                var PRNo = oEvent.getParameter("arguments").PRPreview;
                if (PRNo !== "X") {
                    window.lineitem = "";
                    var that = this;
                    var that1 = this;
                    var oMdl = this.getOwnerComponent().getModel();
                    var Entityset = "/PRHeaderSet('" + PRNo + "')";
                    oMdl.read(Entityset, {
                        urlParameters: {
                            "$expand": "HdrToItemNav"
                        },
                        success: function (oData) {
                            aLineItemArr = oData;
                            var oModel = new sap.ui.model.json.JSONModel(oData);
                            this.getView().setModel(oModel, "PRPreviewModel");
                            sap.ui.getCore().setModel(oModel, "PRHeaderModel");
                        }.bind(this),
                        error: function (oError) {
                            console.log(oData);
                        }.bind(this)
                    });
                } else {
                    var aHeaderData = sap.ui.getCore().getModel("PRHeaderModel").getData();
                    var aLineItemData = sap.ui.getCore().getModel("LineItemModel").getData();
                    var afinalData = aHeaderData;
                    var LineItem = [];
                    LineItem.results = aLineItemData;
                    afinalData.HdrToItemNav = LineItem;
                    aLineItemArr = afinalData;
                    var oModel = new sap.ui.model.json.JSONModel(afinalData);
                    this.getView().setModel(oModel, "PRPreviewModel");
                    sap.ui.getCore().setModel(oModel, "PRHeaderModel");
                }
            },


            onBack: function () {
                this.getOwnerComponent().getRouter().navTo("RoutePRCreation");
            },

            /*onLineItemSave: function (oEvent) {
               var oLineItem = sap.ui.getCore().getModel("PRLineItemModel").getData();
               if (sap.ui.getCore().getModel("PRPreviewModel")) {
                   var oLineItem1 = sap.ui.getCore().getModel("PRPreviewModel").getData();
                    aLineItemArr = oLineItem1;
                   var SelectedKey = oLineItem.Bnfpo;
                   var selectedobj = oLineItem1.filter(function (oLineItem2) {
                       return oLineItem2.Bnfpo == SelectedKey;
                   });
                   if (selectedobj.length > 0) {
                       selectedobj = oLineItem;

                   } else {
                       aLineItemArr.HdrToItemNav.results.push(oLineItem);
                   }
               } else {
                   aLineItemArr.HdrToItemNav.results.push(oLineItem);
               }
               var oLineItemModel = new sap.ui.model.json.JSONModel(aLineItemArr);
               sap.ui.getCore().setModel(oLineItemModel, "PRPreviewModel");
               this.dialogClose();
           },*/

            onPREdit: function (oEvent) {
                var PRData = this.getView().byId("PRPreviewTable").getSelectedItem().getBindingContext("PRPreviewModel").getObject();
                this._Coding = sap.ui.xmlfragment("zprcreatenew.Fragment.Coding", this);
                //   this.getView().addDependent(this.__Coding);
                this._Coding.open();
                var oPRLineItemObj = {};
                var oPRHeaderObj = this.getView().getModel("PRPreviewModel").getData();
                oPRLineItemObj.Text = oPRHeaderObj.Text;
                oPRLineItemObj.Elifn = oPRHeaderObj.Elifn;
                oPRLineItemObj.Waers = oPRHeaderObj.Waers;
                oPRLineItemObj.Bnfpo = PRData.Bnfpo;
                oPRLineItemObj.Txz01 = oPRHeaderObj.Txz01;
                oPRLineItemObj.Text = oPRHeaderObj.Text;
                oPRLineItemObj.Menge = PRData.Menge;
                oPRLineItemObj.Land1 = PRData.Land1;
                oPRLineItemObj.Meins = PRData.Meins;
                oPRLineItemObj.Peinh = PRData.Peinh;
                oPRLineItemObj.Lfdat = PRData.Lfdat;
                oPRLineItemObj.Knttp = PRData.Knttp;
                oPRLineItemObj.Kostl = PRData.Kostl;
                oPRLineItemObj.Aufnr = PRData.Aufnr;
                oPRLineItemObj.Prctr = PRData.Prctr;
                oPRLineItemObj.Bkgrp = PRData.Bkgrp;
                oPRLineItemObj.Zzempno = PRData.Zzempno;
                oPRLineItemObj.Isbn = PRData.Isbn;
                oPRLineItemObj.Batch = PRData.Batch;
                oPRLineItemObj.Matkl = PRData.Matkl;
                var oModel = new sap.ui.model.json.JSONModel(oPRLineItemObj);
                sap.ui.getCore().setModel(oModel, "PRLineItemModel");
                //this.getView().setModel(oModel, "PRLineItemModel");
            },

            onLineItemSave: function (oEvent) {
                var indx = "";
                var oLineItem = sap.ui.getCore().getModel("PRLineItemModel").getData();
                if (this.getView().getModel("PRPreviewModel")) {
                    var oLineItem1 = this.getView().getModel("PRPreviewModel").getData();
                    aLineItemArr = oLineItem1;
                    var SelectedKey = oLineItem.Bnfpo;
                    var selectedobj = oLineItem1.HdrToItemNav.results.filter(function (oLineItem2, idx) {
                        indx = idx;
                        return oLineItem2.Bnfpo == SelectedKey;
                    });
                    if (selectedobj.length > 0) {
                        aLineItemArr.HdrToItemNav.results[indx] = oLineItem;
                        selectedobj = oLineItem;

                    } else {
                        aLineItemArr.HdrToItemNav.results.push(oLineItem);
                    }
                } else {
                    aLineItemArr.HdrToItemNav.results.push(oLineItem);
                }
                var finalValue = "0";
                aLineItemArr.HdrToItemNav.results.forEach(function (val, idx) {
                    var itemValue = val.Menge * val.Peinh;
                    finalValue = parseFloat(finalValue) + parseFloat(itemValue);
                });
                // HeaderData.Rlwrt = finalValue;
                window.lineitem = finalValue;
                var oLineItemModel = new sap.ui.model.json.JSONModel(aLineItemArr);
                this.getView().setModel(oLineItemModel, "PRPreviewModel");
                this.dialogClose();
            },

            onCodingSelect: function (oEvent) {
                if (oEvent.getSource().getSelected() === true) {
                    this.getView().byId("CodingDetails").setVisible(true);
                } else {
                    this.getView().byId("CodingDetails").setVisible(true);
                }

            },

            onSubmitPR: function (oEvent) {
                SubmitFlag = "X";
                this.onSubmit();
            },

            onSubmit: function (oEvent) {
                var oMdl = this.getOwnerComponent().getModel();
                var oPRHeaderObj = aLineItemArr;
                var Status = "Saved";
                if (SubmitFlag === "X") {
                    Status = "Submitted";
                }
                var oFinalObj = {};
                oFinalObj.Banfn = "";
                oFinalObj.Text = oPRHeaderObj.Text;
                oFinalObj.Elifn = oPRHeaderObj.Elifn;
                oFinalObj.Waers = oPRHeaderObj.Waers;
                oFinalObj.Zestak = Status;
                oFinalObj.Rlwrt = window.lineitem.toString();
                // oFinalObj.Gswrt = oPRHeaderObj.Gswrt;
                aLineItemArr.HdrToItemNav.results.forEach(function (val, index) {
                    val.Lfdat = val.Lfdat + "T00:00:00";
                    val.Estak = Status;
                });

                oFinalObj.HdrToItemNav = aLineItemArr.HdrToItemNav.results;
                oMdl.create("/PRHeaderSet", oFinalObj, {
                    success: function (oData) {
                        var aPRList = [];
                        var sAlert = "PR has been successfully created";
                        sap.m.MessageBox.success(sAlert, {
                            title: "Success",
                        });
                    }.bind(this),
                    error: function (oError) {
                        var sAlert = JSON.parse(oError.responseText).error.message.value;
                        sap.m.MessageBox.error(sAlert, {
                            title: "Error",
                        });
                    }.bind(this)
                });
            },

        });
    });
