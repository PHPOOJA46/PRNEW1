sap.ui.define(
    ["sap/ui/core/mvc/Controller", 'sap/m/MessageBox',
        'sap/m/MessageToast', "sap/ui/core/routing/History"],
    function (Controller, MessageBox, MessageToast, History) {
        "use strict";
        var LineItemNo = "";
        this.LineArr = [];
        return Controller.extend("zprcreatenew.controller.BaseController", {
     
            onCodingDetail: function () {
                this._Coding = sap.ui.xmlfragment("zprcreatenew.Fragment.Coding", this);
                this.getView().addDependent(this.__Coding);
                this._Coding.open();
                this.onFillLineItemData();
            },
            onFillLineItemData: function () {
                var oPRLineItemObj = {};
                var oPRHeaderObj = sap.ui.getCore().getModel("PRHeaderModel").getData();
                if (this.getView().byId("PRType").getSelectedKey() !== "CreateMulPr") {
                    if (sap.ui.getCore().getModel("PRLineItemModel")) {
                        var oPRItemObj = sap.ui.getCore().getModel("PRLineItemModel").getData();
                        if (oPRItemObj.length === "0") {
                            LineItemNo = "10";
                            LineArr = [];
                        } else {
                            LineItemNo = parseInt(LineItemNo) + parseInt(10);
                            LineItemNo = LineItemNo.toString();
                            if(!this.LineArr){
                             this.LineArr = [];
                            }
                        }
                    } else {
                        LineItemNo = "10";
                        this.LineArr = [];
                    }
                    this.LineArr.push(oPRLineItemObj);
                } else {
                    LineItemNo = "10";
                }
                if(window.lineitem === ""){
                    //if()
                oPRHeaderObj.Rlwrt = oPRHeaderObj.Menge * oPRHeaderObj.Peinh;
                window.lineitem = oPRHeaderObj.Rlwrt;
                }else{
                    oPRHeaderObj.Rlwrt = window.lineitem;
                }
                oPRLineItemObj.Text = oPRHeaderObj.Text;
                oPRLineItemObj.Elifn = oPRHeaderObj.Elifn;
                oPRLineItemObj.Waers = oPRHeaderObj.Waers;
                oPRLineItemObj.Bnfpo = LineItemNo;
                oPRLineItemObj.Txz01 = oPRHeaderObj.Txz01;
                oPRLineItemObj.Text = oPRHeaderObj.Text;
                oPRLineItemObj.Menge = oPRHeaderObj.Menge;
                oPRLineItemObj.Land1 = oPRHeaderObj.Land1;
                oPRLineItemObj.Meins = oPRHeaderObj.Meins;
                oPRLineItemObj.Peinh = oPRHeaderObj.Peinh;
                oPRLineItemObj.Lfdat = oPRHeaderObj.Lfdat;
                oPRLineItemObj.Knttp = oPRHeaderObj.Knttp;
                oPRLineItemObj.Kostl = "";
                oPRLineItemObj.Aufnr = "";
                oPRLineItemObj.Prctr = "";
                oPRLineItemObj.Bkgrp = oPRHeaderObj.Bkgrp;
                oPRLineItemObj.Zzempno = "";
                oPRLineItemObj.Isbn = "";
                oPRLineItemObj.Batch = "";
                oPRLineItemObj.Matkl = oPRHeaderObj.Matkl;
                oPRLineItemObj.Banfn = "";
                oPRLineItemObj.Rlwrt = oPRHeaderObj.Rlwrt;


                var oModel = new sap.ui.model.json.JSONModel(oPRLineItemObj);
                sap.ui.getCore().setModel(oModel, "PRLineItemModel");

                var oModel = new sap.ui.model.json.JSONModel(this.LineArr);
                sap.ui.getCore().setModel(oModel, "PRLineModel");
                //this.getView().setModel(oModel, "PRLineItemModel");
            },

            dialogClose: function () {
                this._Coding.close();
                this._Coding.destroy();

            },

            handleIntOrderHelp: function (oevent) {
                this._internalHelp = sap.ui.xmlfragment("zprcreatenew.Fragment.InternalOrderHelp", this);
                this.getView().addDependent(this._internalHelp);
                this._internalHelp.open();
            },

            handleVendorHelp: function (oevent) {
                this._VendorHelp = sap.ui.xmlfragment("zprcreatenew.Fragment.VendorHelp", this);
                this.getView().addDependent(this._VendorHelp);
                this._VendorHelp.open();
            },

            handleMeasureHelp: function (oevent) {
                this.MeasureHelp = sap.ui.xmlfragment("zprcreatenew.Fragment.MeasureHelp", this);
                this.getView().addDependent(this.MeasureHelp);
                this.MeasureHelp.open();
            },

            handleCurrencyHelp: function (oevent) {
                this.CurrencyHelp = sap.ui.xmlfragment("zprcreatenew.Fragment.CurrencyHelp", this);
                this.getView().addDependent(this.CurrencyHelp);
                this.CurrencyHelp.open();
            },

            handleCodingReqHelp: function (oevent) {
                this.CodingReqHelp = sap.ui.xmlfragment("zprcreatenew.Fragment.ReqCodingHelp", this);
                this.getView().addDependent(this.CodingReqHelp);
                this.CodingReqHelp.open();
            },

            handlenoofitems: function (oEvent) {
                var noofitems = oEvent.getSource().getValue();
                LineItemNo = 0;
                if (noofitems !== 0) {
                    for (var i = 0; i < noofitems; i++) {
                        LineItemNo = parseInt(LineItemNo) + parseInt(10);
                        LineItemNo = LineItemNo.toString();
                        var obj = {};
                        obj.Bnfpo = LineItemNo;
                        if (!this.LineArr) {
                            this.LineArr = [];
                        }
                        this.LineArr.push(obj);
                    }
                    var oModel = new sap.ui.model.json.JSONModel(this.LineArr);
                    sap.ui.getCore().setModel(oModel, "PRLineModel");
                }
            },
        });
    });
