sap.ui.define([
    "zprcreatenew/controller/BaseController"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
    function (Controller) {
        "use strict";
        var aLineItemArr = [], oPRHeaderObj = {}, SubmitFlag = "";
        return Controller.extend("zprcreatenew.controller.PRCreation", {
            onInit: function () {
                window.lineitem = "";
                aLineItemArr = [];
                oPRHeaderObj.Text = "";
                oPRHeaderObj.Elifn = "";
                oPRHeaderObj.Waers = "";
                oPRHeaderObj.Txz01 = "";
                oPRHeaderObj.Text = "";
                oPRHeaderObj.Menge = "";
                oPRHeaderObj.Meins = "";
                oPRHeaderObj.Peinh = "";
                oPRHeaderObj.Land1 = "";
                oPRHeaderObj.Lfdat = "";
                oPRHeaderObj.Knttp = "";
                oPRHeaderObj.Bkgrp = "";
                oPRHeaderObj.Matkl = "";
                oPRHeaderObj.Bnfpo = "";
                oPRHeaderObj.Rlwrt = ""
                // oPRHeaderObj.Gswrt = "";
                var oModel = new sap.ui.model.json.JSONModel(oPRHeaderObj);
                this.getView().setModel(oModel, "PRHeaderModel");
                sap.ui.getCore().setModel(oModel, "PRHeaderModel");
            },

            onPress: function () {
                this.getOwnerComponent().getRouter().navTo("PRDisplay", {
                    Display: "sPoNumber"
                }, true);
            },

            onSelectionChange: function (oEvent) {
                var selectedkey = oEvent.getSource().getSelectedKey();
                if (selectedkey === "CreatePr") {
                    this.getView().byId("CreatePr").setVisible(true);
                    this.getView().byId("CreateMulPr").setVisible(false);
                    this.onInit();

                } else if (selectedkey === "CreateMulPr") {
                    this.getView().byId("CreatePr").setVisible(false);
                    this.getView().byId("CreateMulPr").setVisible(true);
                    this.onInit();
                } else {
                    this.onPress();
                }
            },

            onLineItemSelect: function (oEvent) {
                var SelectedKey = oEvent.getSource().getSelectedKey();
                if (sap.ui.getCore().getModel("LineItemModel")) {
                    var oLineItem = sap.ui.getCore().getModel("LineItemModel").getData();
                    var selectedobj = oLineItem.filter(function (oLineItem) {
                        return oLineItem.Bnfpo == SelectedKey;
                    });
                    var oModel = new sap.ui.model.json.JSONModel(selectedobj[0]);
                    sap.ui.getCore().setModel(oModel, "PRLineItemModel");
                }
            },

            onPRBackPress: function (oEvent) {
                this.getOwnerComponent().getRouter().navTo("PRPreview", {
                    PRPreview: "sPoNumber"
                }, true);
            },

            onLineItemSave: function (oEvent) {
                var oLineItem = sap.ui.getCore().getModel("PRLineItemModel").getData();
                var HeaderData = this.getView().getModel("PRHeaderModel").getData();
                if (sap.ui.getCore().getModel("LineItemModel")) {
                    var oLineItem1 = sap.ui.getCore().getModel("LineItemModel").getData();
                    var SelectedKey = oLineItem.Bnfpo;
                    var selectedobj = oLineItem1.filter(function (oLineItem2) {
                        return oLineItem2.Bnfpo == SelectedKey;
                    });
                    if (selectedobj.length > 0) {
                        selectedobj = oLineItem;

                    } else {
                        aLineItemArr.push(oLineItem);
                    }
                } else {
                    aLineItemArr.push(oLineItem);
                }
                var finalValue = "0";
                aLineItemArr.forEach(function (val, idx) {
                    var itemValue = val.Menge * val.Peinh;
                    finalValue = parseFloat(finalValue) + parseFloat(itemValue);
                });
                HeaderData.Rlwrt = finalValue;
                window.lineitem = finalValue;
                var oLineItemModel = new sap.ui.model.json.JSONModel(aLineItemArr);
                sap.ui.getCore().setModel(oLineItemModel, "LineItemModel");
                this.dialogClose();
            },

            onPreview: function (oEvent) {
                this.onLineItemSave();
                this.getOwnerComponent().getRouter().navTo("PRPreview", {
                    PRPreview: "X"
                }, true);
            },

            onLineSubmit: function (oEvent) {
                // this.dialogClose();
                this.onLineItemSave();
                SubmitFlag = "X";
                this.onSubmit();
            },

            onAddLineItemData: function (oEvent) {
                this.onLineItemSave();
                this.onFillLineItemData();
            },

            handleRemovePress: function (oEvent) {
                var oLineItem = sap.ui.getCore().getModel("PRLineItemModel").getData();
                var Array = this.LineArr;
                if (sap.ui.getCore().getModel("LineItemModel")) {
                    var oLineItem1 = sap.ui.getCore().getModel("LineItemModel").getData();
                    var SelectedKey = oLineItem.Bnfpo;
                    var flag = "";
                    oLineItem1.forEach(function (val, idx) {
                        if (val.Bnfpo === SelectedKey) {
                            oLineItem1.splice(idx, 1);
                            Array.splice(idx, 1);
                            flag = "X";
                        }
                    });

                    if (flag === "X") {
                        this.dialogClose();
                        sap.m.MessageBox.success("Data has been deleted", {
                            title: "Success",
                        });
                    }
                }
            },



            onSubmit: function (oEvent) {
                var oMdl = this.getOwnerComponent().getModel();
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
                aLineItemArr.forEach(function (val, index) {
                    val.Lfdat = val.Lfdat + "T00:00:00";
                    val.Estak = Status;
                    delete val.Rlwrt;
                });

                oFinalObj.HdrToItemNav = aLineItemArr;
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
