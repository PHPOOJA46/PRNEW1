sap.ui.define([
    "zprcreatenew/controller/BaseController"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
    function (Controller) {
        "use strict";
        var aLineItemArr = [], oPRHeaderObj = {}, SubmitFlag = "", Attarray = [], createpagekey = "";
        return Controller.extend("zprcreatenew.controller.PRCreation", {
            onInit: function (oEvent, a) {
                this._fetchToken();
                if (!a) {
                    this.onSelectionChange("", "CreatePr");
                }
                this.fillReqCoding();
                this.fillcurrency();
                this.fillMeasure();
                this.onValueHelp();
                aLineItemArr = [], oPRHeaderObj = {}, SubmitFlag = "";
                oPRHeaderObj.Text = "";
                oPRHeaderObj.Elifn = "";
                oPRHeaderObj.Waers = "";
                oPRHeaderObj.Txz01 = "";
                oPRHeaderObj.Text1 = "";
                oPRHeaderObj.Menge = "";
                oPRHeaderObj.Meins = "";
                oPRHeaderObj.Preis = "";
                oPRHeaderObj.Land1 = "";
                oPRHeaderObj.Lfdat = "";
                oPRHeaderObj.Knttp = "";
                oPRHeaderObj.Bkgrp = "";
                oPRHeaderObj.Matkl = "";
                oPRHeaderObj.Bnfpo = "";
                oPRHeaderObj.Rlwrt = "";
                oPRHeaderObj.Building = "";
              //  oPRHeaderObj.VendorName = "";
                oPRHeaderObj.Name1 = "";
                oPRHeaderObj.Street = "";
                oPRHeaderObj.PostCode = "";
                oPRHeaderObj.City = "";
                oPRHeaderObj.Land1 = "";
                oPRHeaderObj.Sakto = "";
                var oModel = new sap.ui.model.json.JSONModel(oPRHeaderObj);
                this.getView().setModel(oModel, "PRHeaderModel");
                sap.ui.getCore().setModel(oModel, "PRHeaderModel");
                var oLineItemModel = new sap.ui.model.json.JSONModel(aLineItemArr);
                sap.ui.getCore().setModel(oLineItemModel, "LineItemModel");
            },

            _fetchToken: function () {
                var token;
                $.ajax({
                    // url: this._getRuntimeBaseURL() + "/bpmworkflowruntime/rest/v1/xsrf-token",
                    url:  this._getRuntimeBaseURL() + "/bpmworkflowruntime/v1/xsrf-token",
                    method: "GET",
                    async: false,
                    headers: {
                        "X-CSRF-Token": "Fetch"
                    },
                    success: function (result, xhr, data) {
                        token = data.getResponseHeader("X-CSRF-Token");
                    }
                });
                return token;
            },

            onPress: function () {
                this.AttDestroy();
                // this.onInit("","a");
                this.onSelectionChange("", "CreatePr");
                this.getOwnerComponent().getRouter().navTo("PRDisplay", {
                    Display: "sPoNumber"
                }, true);
            },

            onLineItemSave1: function (oEvent) {
                this.onLineItemSave();
                this.dialogClose();
            },

            onSelectionChange: function (oEvent, key) {
                if (key) {
                    var selectedkey = key;

                    this.getView().byId("PRType").setSelectedKey(key);
                } else {
                    var selectedkey = oEvent.getSource().getSelectedKey();
                }

                createpagekey = selectedkey;
                this.getOwnerComponent().lineitem = "";
                this.getOwnerComponent().items = [];
                this.getOwnerComponent().lineno = "";
                aLineItemArr = [], oPRHeaderObj = {}, SubmitFlag = "";
                if (selectedkey === "CreatePr") {
                    this.getView().byId("CreatePr").setVisible(true);
                    this.getView().byId("CreateMulPr").setVisible(false);
                    //this.onInit();
                    if (!key) {
                        //this.onObjectMatched("","a");
                        this.onInit("", "a");

                    }
                } else if (selectedkey === "CreateMulPr") {
                    this.getView().byId("CreatePr").setVisible(false);
                    this.getView().byId("CreateMulPr").setVisible(true);
                    //this.onInit();
                    if (!key) {
                        //this.onObjectMatched("","a");
                        this.onInit("", "a");
                    }
                } else {
                    this.onPress();
                }
            },

            
            selectchange: function (SelectedKey) {
                if (sap.ui.getCore().getModel("LineItemModel")) {
                    var oLineItem = sap.ui.getCore().getModel("LineItemModel").getData();
                    var selectedobj = oLineItem.filter(function (oLineItem) {
                        return oLineItem.Bnfpo == SelectedKey;
                    });

                    var obj1 = selectedobj[0];
                    var obj = {};
                    obj.LAND1 = obj1.Land1;
                    obj.WERKS = obj1.Building;
                    obj.NAME1 = obj1.Name1;
                    obj.STRAS = obj1.Street;
                    obj.PSTLZ = obj1.PostCode;
                    obj.ORT01 = obj1.City;
                    // HeaderMod.DelvAdrTyp = obj1.DelvAdrTyp;
                    var oModel1 = new sap.ui.model.json.JSONModel(obj);
                    this.getView().setModel(oModel1, "DeliveryAddModel");


                    var oModel = new sap.ui.model.json.JSONModel(selectedobj[0]);
                    this.getView().setModel(oModel, "PRLineItemModel");
                    sap.ui.getCore().setModel(oModel, "PRLineItemModel");
                }
            },

            onPRBackPress: function (oEvent) {
                this.AttDestroy();
                this.getOwnerComponent().getRouter().navTo("PRPreview", {
                    PRPreview: "sPoNumber",
                    PRCopy: "0"
                }, true);
            },

            onLineItemSave: function (oEvent, key) {
                var oLineItem = sap.ui.getCore().getModel("PRLineItemModel").getData();
                var HeaderData = this.getView().getModel("PRHeaderModel").getData();
                if (sap.ui.getCore().getModel("LineItemModel")) {
                    var oLineItem1 = sap.ui.getCore().getModel("LineItemModel").getData();
                    if (key) {
                        var SelectedKey = key;
                        oLineItem.Bnfpo = key;
                    } else {
                        var SelectedKey = oLineItem.Bnfpo;
                    }
                    var selectedobj = oLineItem1.filter(function (oLineItem2) {
                        return oLineItem2.Bnfpo == SelectedKey;
                    });
                    if (!selectedobj.length) {
                        aLineItemArr.push(oLineItem);
                    } else {
                        if (selectedobj.length > 0) {
                            selectedobj = oLineItem;
                        } else {
                            aLineItemArr.push(oLineItem);
                        }
                    }
                } else {
                    aLineItemArr.push(oLineItem);
                }
                var finalValue = "0";
                aLineItemArr.forEach(function (val, idx) {
                    var itemValue = val.Menge * val.Preis;
                    val.Gswrt = itemValue.toString();
                    finalValue = parseFloat(finalValue) + parseFloat(itemValue);
                });
                finalValue = parseFloat(finalValue).toFixed(2);
                if (isNaN(finalValue) === true) {
                    finalValue = 0;
                }
                HeaderData.Rlwrt = finalValue;
                this.getOwnerComponent().lineitem = finalValue;
                this.getView().getModel("PRHeaderModel").setProperty("/Rlwrt", this.getOwnerComponent().lineitem);
                var oLineItemModel = new sap.ui.model.json.JSONModel(aLineItemArr);
                sap.ui.getCore().setModel(oLineItemModel, "LineItemModel");
                this.getOwnerComponent().Close = "";
                //  this.dialogClose();
            },

            onPreview: function (oEvent) {
                var valid = this.onSaveSubmitPrew();
                if (valid !== "a") {

                    this.onLineItemSave();
                    this.dialogClose();
                    //this.onInit("","a");
                    this.getOwnerComponent().getRouter().navTo("PRPreview", {
                        PRPreview: "X",
                        PRCopy: "0"
                    }, true);
                }
            },

            onLineSubmit: function (oEvent) {
                // this.dialogClose();
                this.onLineItemSave();
                SubmitFlag = "X";
                this.onSubmit();
            },

            onAddLineItemData: function (oEvent) {
                var flag = "";
                var valid = this.onSaveSubmitPrew();
                if (valid !== "a") {
                    this.onLineItemSave();
                    if (createpagekey === "CreatePr") {
                        var flag = "No";
                    }
                    this.onFillLineItemData(flag);
                }
            },

            handleRemovePress: function (oEvent) {
                //   sap.ui.getCore().setBusy(true);
                sap.ui.getCore().byId("idPRCDialog").setBusy(true);
                var oLineItem = {};
                oLineItem = sap.ui.getCore().getModel("PRLineItemModel").getData();
                var Array = this.getOwnerComponent().items;
                var index = "";
                if (sap.ui.getCore().getModel("LineItemModel")) {
                    var oLineItem1 = sap.ui.getCore().getModel("LineItemModel").getData();
                    var SelectedKey = oLineItem.Bnfpo;
                    var flag = "";

                    oLineItem1.forEach(function (val, idx) {
                        if (val.Bnfpo === SelectedKey) {
                            index = idx;
                            oLineItem1.splice(idx, 1);
                            Array.splice(idx, 1);
                            flag = "X";
                        }
                    });


                    if (flag === "X") {
                        var finalValue = "0";
                        oLineItem1.forEach(function (val, idx) {
                            var itemValue = val.Menge * val.Preis;
                            val.Gswrt = itemValue.toString();
                            finalValue = parseFloat(finalValue) + parseFloat(itemValue);
                        });
                        finalValue = parseFloat(finalValue).toFixed(2);
                        if (isNaN(finalValue) === true) {
                            finalValue = 0;
                        }
                        //    HeaderData.Rlwrt = finalValue;
                        this.getOwnerComponent().lineitem = finalValue;
                        this.getView().getModel("PRHeaderModel").setProperty("/Rlwrt", this.getOwnerComponent().lineitem);
                        //  this.dialogClose();

                        sap.m.MessageBox.success("Data has been deleted", {
                            title: "Success",
                        });

                        var data = {};
                        oLineItem1.forEach(function (val, idx) {
                            data = val;
                        });

                        oLineItem = data;
                        if (data.Bnfpo) {
                            this.getOwnerComponent().lineno = data.Bnfpo;
                        }
                        //this.getOwnerComponent().lineno = this.getOwnerComponent().lineno - 10;
                        if (this.getOwnerComponent().items.length === 0 || (createpagekey === "CreateMulPr" && oLineItem1.length <= 0)) {
                            this.getOwnerComponent().lineno = "10";
                            var obj = { Bnfpo: this.getOwnerComponent().lineno }
                            this.getOwnerComponent().items.push(obj);
                            var typ = "Yes";
                            if (createpagekey === "CreateMulPr") {
                                typ = "No";
                                this.onclearlineitem(oLineItem);
                                //this.getOwnerComponent().Close = "";
                            }
                            this.onFillLineItemData(typ);
                        } else {
                            var oModel = new sap.ui.model.json.JSONModel(oLineItem);
                            this.getView().setModel(oModel, "PRLineItemModel");
                            sap.ui.getCore().setModel(oModel, "PRLineItemModel");
                        }
                        var oModel = new sap.ui.model.json.JSONModel(this.getOwnerComponent().items);
                        this.getView().setModel(oModel, "PRLineModel");
                        sap.ui.getCore().setModel(oModel, "PRLineModel");
                        sap.ui.getCore().getModel("PRLineModel").refresh(true);
                    } else {
                        /*  oPRLineItemObj.Kostl = "";
                      oPRLineItemObj.Aufnr = "";
                      oPRLineItemObj.Prctr = "";
                      oPRLineItemObj.Zzempno = "";
                      oPRLineItemObj.Isbn = "";
                      oPRLineItemObj.Batch = "";*/
                        var data = "";
                        oLineItem1.forEach(function (val, idx) {
                            data = val;
                        });


                        Array.forEach(function (val, idx) {
                            if (val.Bnfpo === SelectedKey) {
                                index = idx;
                                Array.splice(idx, 1);
                            }
                        });

                        oLineItem1.forEach(function (val, idx) {
                            var itemValue = val.Menge * val.Preis;
                            val.Gswrt = itemValue.toString();
                            finalValue = parseFloat(finalValue) + parseFloat(itemValue);
                        });
                        finalValue = parseFloat(finalValue).toFixed(2);
                        if (isNaN(finalValue) === true) {
                            finalValue = 0;
                        }
                        //    HeaderData.Rlwrt = finalValue;
                        this.getOwnerComponent().lineitem = finalValue;
                        this.getView().getModel("PRHeaderModel").setProperty("/Rlwrt", this.getOwnerComponent().lineitem);


                        this.getOwnerComponent().Close = "X";

                        if (this.getOwnerComponent().items.length === 0 || (createpagekey === "CreateMulPr" && oLineItem1.length <= 0)) {
                            this.getOwnerComponent().lineno = "10";
                            var obj = { Bnfpo: this.getOwnerComponent().lineno }
                            this.getOwnerComponent().items.push(obj);
                            var typ = "Yes";
                            if (createpagekey === "CreateMulPr") {
                                typ = "No";
                                this.onclearlineitem(oLineItem);
                                //this.getOwnerComponent().Close = "";
                            }
                            this.onFillLineItemData(typ);
                        } else {
                            oLineItem = data;
                            var oModel = new sap.ui.model.json.JSONModel(oLineItem);
                            this.getView().setModel(oModel, "PRLineItemModel");
                            sap.ui.getCore().setModel(oModel, "PRLineItemModel");
                        }

                    }
                } else {
                    sap.m.MessageBox.information("Line Item cannot be deleted", {
                        title: "Information",
                    });
                }

                sap.ui.getCore().byId("idPRCDialog").setBusy(false);
            },

            setSubFlag: function (type) {
                SubmitFlag = type;
            },

            onSubmit1: function (oEvent) {
                SubmitFlag = "";
                this.onSubmit(oEvent);
            },

            onSubmit: function (oEvent) {
                this.getView().setBusy(true);
                var that = this;
                var oMdl = this.getOwnerComponent().getModel();
                var function1 = "";
                if (this.getView().byId("PRType").getSelectedKey() !== "CreateMulPr") {
                    function1 = this._fnrequiredinput1();
                } else {
                    function1 = this._fnrequiredinput();
                }
                var valid = this.fnrequiredInputValidation(function1, this);
                if (!valid) {
                    this.getView().setBusy(false);
                    this.fnMessageBox("ERROR", sap.m.MessageBox.Icon.ERROR, "Please enter the mandatory fields");
                    //  MessageToast.show("Mandatory fields are missing");
                    return;
                }
                var Status = "Saved";
                var LineStatus = "Saved";
                if (SubmitFlag === "X") {
                    Status = "Submitted";
                    LineStatus = "In Progress"
                }
                if (this.getOwnerComponent().lineitem === "") {

                    this.getOwnerComponent().lineitem = oPRHeaderObj.Menge * oPRHeaderObj.Preis;
                    // this.getOwnerComponent().lineitem = parseFloat(finalValue) + parseFloat(itemValue);

                }
                var oFinalObj = {};
                oFinalObj.Banfn = "";
                oFinalObj.Text = oPRHeaderObj.Text;
                oFinalObj.Elifn = oPRHeaderObj.Elifn;
                oFinalObj.Waers = oPRHeaderObj.Waers;
                oFinalObj.Zestak = Status;
                oFinalObj.Rlwrt = this.getOwnerComponent().lineitem.toString();
                oFinalObj.Name1= this.getOwnerComponent().VendorName;
                // oFinalObj.Gswrt = oPRHeaderObj.Gswrt;
                if (aLineItemArr.length === 0) {
                    if (sap.ui.getCore().getModel("PRLineItemModel")) {
                        var obj = sap.ui.getCore().getModel("PRLineItemModel").getData();
                        aLineItemArr.push((obj));
                    } else {
                        var oPRLineItemObj = {};
                        oPRLineItemObj.Text = oPRHeaderObj.Text;
                        oPRLineItemObj.Elifn = oPRHeaderObj.Elifn;
                        oPRLineItemObj.Waers = oPRHeaderObj.Waers;
                        oPRLineItemObj.Bnfpo = "10";
                        oPRLineItemObj.Txz01 = oPRHeaderObj.Txz01;
                        oPRLineItemObj.Text1 = oPRHeaderObj.Text1;
                        oPRLineItemObj.Menge = oPRHeaderObj.Menge;
                        oPRLineItemObj.Land1 = oPRHeaderObj.Land1;
                        oPRLineItemObj.Meins = oPRHeaderObj.Meins;
                        oPRLineItemObj.Preis = oPRHeaderObj.Preis;
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
                        oPRLineItemObj.Building = oPRHeaderObj.Building;
                        oPRLineItemObj.Name1 = oPRHeaderObj.Name1;
                        oPRLineItemObj.Street = oPRHeaderObj.Street;
                        oPRLineItemObj.PostCode = oPRHeaderObj.PostCode;
                        oPRLineItemObj.City = oPRHeaderObj.City;
                        oPRLineItemObj.Land1 = oPRHeaderObj.Land1;
                        oPRLineItemObj.DelvAdrTyp = 0;
                        var itemValue = oPRLineItemObj.Menge * oPRLineItemObj.Preis;

                        oPRLineItemObj.Gswrt = itemValue.toString();
                        aLineItemArr.push(oPRLineItemObj);
                    }
                }
                aLineItemArr.forEach(function (val, index) {
                    val.Elifn = oFinalObj.Elifn;
                    if (val.Lfdat !== "") {
                        if (val.Lfdat.includes("T00:00:00") !== true) {
                            val.Lfdat = val.Lfdat + "T00:00:00";
                        }
                    } else {
                        val.Lfdat = null;
                    }
                    val.Zestak = LineStatus;
                    if (val.Menge === "") {
                        val.Menge = "0";
                    }
                    if (val.Preis === "") {
                        val.Preis = "0";
                    }

                    if (val.Gswrt === "") {
                        val.Gswrt = "0";
                    }
                    
                    if(val.Text1){
                        val.Text = val.Text1;
                    }
                    delete val.Rlwrt;
                    delete val.Text1;
                    //delete val.DelvAdrTyp;
                });

                oFinalObj.HdrToItemNav = aLineItemArr;
                oMdl.create("/PRHeaderSet", oFinalObj, {
                    success: function (oData) {
                        var aPRList = [];
                        var sAlert = "PR has been successfully created";
                        sap.m.MessageBox.success(sAlert, {
                            title: "Success",
                            actions: [sap.m.MessageBox.Action.OK],
                            onClose: function (oAction) {
                                window.location.reload(true);
                            }
                        });
                        // this.getOwnerComponent().location.reload(true);
                    }.bind(this),
                    error: function (oError) {
                        var MsgType = "";
                        var arr = [];
                        var sAlert = JSON.parse(oError.responseText).error.message.value;
                        if (JSON.parse(oError.responseText).error.innererror.errordetails[0]) {
                            arr = JSON.parse(oError.responseText).error.innererror.errordetails;

                            MsgType = JSON.parse(oError.responseText).error.innererror.errordetails[0].severity;
                        }
                        if (MsgType === "success") {
                            this.onStartUpload();
                            if (SubmitFlag !== "X") {
                                var split1 = sAlert.split("is");
                                var split2 = split1[0].split(".");
                                this.PRNum = split2[1].trim();
                                this.getOwnerComponent().PRNum = this.PRNum;
                            } else {
                                var Msg = JSON.parse(oError.responseText).error.innererror.errordetails[0].message;
                                sAlert = Msg;
                                var split1 = Msg.split("Purchase Requisition");
                                var split2 = split1[1].split("is");
                                this.PRNum = split2[0].trim();
                                this.getOwnerComponent().PRNum = this.PRNum;
                            }
                            this.onStartUpload(this.PRNum);
                            if (SubmitFlag === "X") {
                                this.onWorkflow(this.getOwnerComponent().PRNum);
                            }
                            this.getView().setBusy(false);
                            sap.m.MessageBox.success(sAlert, {
                                title: "Success",
                                actions: [sap.m.MessageBox.Action.OK],
                                onClose: function (oAction) {
                                    window.location.reload(true);
                                }
                            });
                            //  
                        } else {
                            this.getView().setBusy(false);
                            if (arr.length > 0) {
                                this.onMsgDisplay();
                                var oModel = new sap.ui.model.json.JSONModel(arr);
                                sap.ui.getCore().setModel(oModel, "ErrorMsgModel");
                                this.getView().setModel(oModel, "ErrorMsgModel");
                            } else {
                                sap.m.MessageBox.error(sAlert, {
                                    title: "Error",
                                });
                            }
                        }
                    }.bind(this)
                });


            },

            handleCodingReqHelp: function (oevent) {
                sap.ui.controller("zprcreatenew.controller.BaseController").handleCodingReqHelp(oevent, this);
            },
            handleMaterialValueHelp: function (oevent) {
                sap.ui.controller("zprcreatenew.controller.BaseController").handleMaterialValueHelp(oevent, this);
            },
            onValueHelpMatLineItemPress: function (evt) {
                sap.ui.controller("zprcreatenew.controller.BaseController").onValueHelpMatLineItemPress(evt, this);
            },
            handlePRMatValueHelp: function (oevent) {
                sap.ui.controller("zprcreatenew.controller.BaseController").handlePRMatValueHelp(oevent, this);
            },
            handleCostCenterValueHelp: function (oevent) {
                sap.ui.controller("zprcreatenew.controller.BaseController").handleCostCenterValueHelp(oevent, this);
            },
            onValueHelpCostLineItemPress: function (evt) {
                sap.ui.controller("zprcreatenew.controller.BaseController").onValueHelpCostLineItemPress(evt, this);
            },
            handleIntOrderHelp: function (evt) {
                sap.ui.controller("zprcreatenew.controller.BaseController").handleIntOrderHelp(evt, this);
            },
            onValueHelpInternalLineItemPress: function (evt) {
                sap.ui.controller("zprcreatenew.controller.BaseController").onValueHelpInternalLineItemPress(evt, this);
            },
            handleIsbnBatchValueHelp: function (evt) {
                sap.ui.controller("zprcreatenew.controller.BaseController").handleIsbnBatchValueHelp(evt, this);
            },
            onValueHelpISBNLineItemPress: function (evt) {
                sap.ui.controller("zprcreatenew.controller.BaseController").onValueHelpISBNLineItemPress(evt, this);
            },
            handleIsbnISBNValueHelp: function (evt) {
                sap.ui.controller("zprcreatenew.controller.BaseController").handleIsbnISBNValueHelp(evt, this);
            },
            handleVendorHelp: function (evt) {
                sap.ui.controller("zprcreatenew.controller.BaseController").handleVendorHelp(evt, this);
            },
            onValueHelpVendorLineItemPress: function (evt) {

                sap.ui.controller("zprcreatenew.controller.BaseController").onValueHelpVendorLineItemPress(evt, this);
            },
            handleMeasureHelp: function (evt) {
                sap.ui.controller("zprcreatenew.controller.BaseController").handleMeasureHelp(evt, this);
            },

          
            onSelectAddress: function (evt) {
                var oBtn = evt.getParameters().selectedIndex;
                if (oBtn === 1) {
                    evt.getSource().getParent().getContent()[1].getModel("DeliveryAddModel").getData().results = ""
                    evt.getSource().getParent().getContent()[1].getModel("DeliveryAddModel").refresh();
                    this.onSetDeliveryLocation([Name, Buiding, Street, City, PostalCode, Country], true);
                } else {
                    this.onDelLoc();
                    this.onSetDeliveryLocation([Name, Buiding, Street, City, PostalCode, Country], false);                                          // this.getView().setModel(this.oMod,"DeliveryAddModel");                    
                }
            },

            onDelLoc: function () {
                if (this.getOwnerComponent().plants !== "") {
                    var tat = this;
                    this.oModel = this.getOwnerComponent().getModel("valuehelp");
                    var oFilter = [new sap.ui.model.Filter("WERKS", sap.ui.model.FilterOperator.EQ, "1021")];
                    this.getView().setBusy(true);
                    this.oModel.read("/DeliveryAddrSet", {
                        filters: oFilter,
                        success: function (odata) {
                            var obj = {};
                            if (odata.results) {
                                obj = odata.results[0];
                            }
                            tat.oMod = new sap.ui.model.json.JSONModel(obj);
                            tat.getView().setModel(tat.oMod, "DeliveryAddModel");
                            tat.getView().setBusy(false);
                        },
                        error: function (e) {
                        }
                    });
                } else {
                    sap.m.MessageBox.information("Company Code is not found for selected requisition type", {
                        title: "Information",
                    });
                }
            },

            onLineItemSelect: function (oEvent) {
                /*  sap.m.MessageBox.error("please save the line item before navigating to the other line item", {
                      title: "Error",
                  });*/
                var that = this;
                var SelectedKey = oEvent.getSource().getSelectedKey();

                //   var LastKey = oEvent.getSource().getLastValue();
                //   var Source = oEvent.getSource();
                /*sap.m.MessageBox.show(
                    "please save the changes of the line item before navigating to the other line item ", {
                    icon: sap.m.MessageBox.Icon.WARNING,
                    title: "Warning",
                    actions: ["Navigate", sap.m.MessageBox.Action.OK],
                    emphasizedAction: "Navigate",
                    onClose: function (oAction) {
                        if (oAction !== 'OK') {
              that.selectchange(SelectedKey);
                        
                    }else{
                        Source.setSelectedKey(LastKey);
                    }
                }
                    });*/
                /*  sap.m.MessageBox.show(
                           "please save the changes of the line item before navigating to the other line item ", {
                           icon: sap.m.MessageBox.Icon.WARNING,
                           title: "Warning",
                           actions: ["Navigate", sap.m.MessageBox.Action.OK],
                           emphasizedAction: "Navigate",
                           onClose: function (oAction) {
                               if (oAction !== 'OK') {
                                 
                      // var HeaderMod = sap.ui.getCore().getModel("PRHeaderModel").getData();
                       if (sap.ui.getCore().getModel("LineItemModel")) {
                           var oLineItem = sap.ui.getCore().getModel("LineItemModel").getData();
                           var selectedobj = oLineItem.filter(function (oLineItem) {
                               return oLineItem.Bnfpo == SelectedKey;
                           });
       
                           var obj1 = selectedobj[0];
                           var obj = {};
                           if(obj1.Land1){
                           obj.LAND1 = obj1.Land1;
                           obj.WERKS = obj1.Building ;
                           obj.NAME1 = obj1.Name1;
                           obj.STRAS = obj1.Street;
                           obj.PSTLZ = obj1.PostCode;
                           obj.ORT01 = obj1.City;
                           }
                          // HeaderMod.DelvAdrTyp = obj1.DelvAdrTyp;
                           var oModel1 = new sap.ui.model.json.JSONModel(obj);
                           that.getView().setModel(oModel1,"DeliveryAddModel");
                           
                           var oModel = new sap.ui.model.json.JSONModel(selectedobj[0]);
                           that.getView().setModel(oModel,"PRLineItemModel");
                           that.getView().getModel("PRLineItemModel").refresh(true);
                           sap.ui.getCore().setModel(oModel, "PRLineItemModel");
                           sap.ui.getCore().getModel("PRLineItemModel").refresh(true);
                       }
                               }else{
                                   Source.setSelectedKey(LastKey);
                                   SelectedKey = LastKey;
                                   if (sap.ui.getCore().getModel("LineItemModel")) {
                                       var oLineItem = sap.ui.getCore().getModel("LineItemModel").getData();
                                       var selectedobj = oLineItem.filter(function (oLineItem) {
                                           return oLineItem.Bnfpo == SelectedKey;
                                       });
                   
                                       var obj1 = selectedobj[0];
                                       var obj = {};
                                       if(obj1.Land1){
                                       obj.LAND1 = obj1.Land1;
                                       obj.WERKS = obj1.Building ;
                                       obj.NAME1 = obj1.Name1;
                                       obj.STRAS = obj1.Street;
                                       obj.PSTLZ = obj1.PostCode;
                                       obj.ORT01 = obj1.City;
                                       }
                                      // HeaderMod.DelvAdrTyp = obj1.DelvAdrTyp;
                                       var oModel1 = new sap.ui.model.json.JSONModel(obj);
                                       that.getView().setModel(oModel1,"DeliveryAddModel");
                                       
                                       var oModel = new sap.ui.model.json.JSONModel(selectedobj[0]);
                                       that.getView().setModel(oModel,"PRLineItemModel");
                                       that.getView().getModel("PRLineItemModel").refresh(true);
                                       sap.ui.getCore().setModel(oModel, "PRLineItemModel");
                                       sap.ui.getCore().getModel("PRLineItemModel").getRefresh(true);
                                   }
                               }
                           }
                       }
                       )*/
                /*  if(this.getOwnerComponent().lastlinekey === ""){
                     var ui = sap.ui.getCore().byId("idReqItemNo").getDomRef();
                     var op = ui.innerText;
                     var yu = op.split("\n");
                     this.getOwnerComponent().lastlinekey = yu[0];
                     console.log(this.getOwnerComponent().lastlinekey);
                    }*/
                var function1 = "";
                function1 = this._fnrequiredinput2();
                /*  if (sap.ui.getCore().byId("idReqType").getSelectedKey() === "K") {
                      function1 = function1.concat(["CostCenterFrag"]);
                  } else if (sap.ui.getCore().byId("idReqType").getSelectedKey() === "F") {
                      function1 = function1.concat(["IntOrderFrag"]);
                  } else if (sap.ui.getCore().byId("idReqType").getSelectedKey() === "8") {
                      function1 = function1.concat(["ProfitCenterFrag"]);
                  } else if (sap.ui.getCore().byId("idReqType").getSelectedKey() === "9") {
                      function1 = function1.concat(["IsbnFrag", "BatchFrag"]);
                  } else {
                      function1 = this._fnrequiredinput2();
                  }*/
                var valid = this.fnrequiredInputValidation1(function1, this);
                if (!valid) {
                    valid = "a";
                }
                // var valid = this.onSaveSubmitPrew();
                if (valid !== "a") {

                    // this.onFillLineItemData();

                    var SelectedKey = this.getOwnerComponent().lastlinekey;
                    // var HeaderMod = sap.ui.getCore().getModel("PRHeaderModel").getData();
                    if (sap.ui.getCore().getModel("LineItemModel")) {
                        var oLineItem = sap.ui.getCore().getModel("LineItemModel").getData();
                        var selectedobj = oLineItem.filter(function (oLineItem) {
                            return oLineItem.Bnfpo == SelectedKey;
                        });

                        if (selectedobj[0]) {
                            /* var obj1 = selectedobj[0];
                             var obj = {};
                             if(obj1.Land1){
                             obj.LAND1 = obj1.Land1;
                             obj.WERKS = obj1.Building ;
                             obj.NAME1 = obj1.Name1;
                             obj.STRAS = obj1.Street;
                             obj.PSTLZ = obj1.PostCode;
                             obj.ORT01 = obj1.City;
                             }
                            // HeaderMod.DelvAdrTyp = obj1.DelvAdrTyp;
                             var oModel1 = new sap.ui.model.json.JSONModel(obj);
                             this.getView().setModel(oModel1,"DeliveryAddModel");
                                 
                           
                             var oModel = new sap.ui.model.json.JSONModel(selectedobj[0]);
                             this.getView().setModel(oModel,"PRLineItemModel");
                             this.getView().setModel(oModel,"PRLineietmModel");
                             sap.ui.getCore().setModel(oModel, "PRLineItemModel");*/
                        }
                        //else{
                        this.onLineItemSave("", SelectedKey);
                        var Selkey = oEvent.getSource().getSelectedKey();
                        var oLineItem = sap.ui.getCore().getModel("LineItemModel").getData();
                        var selectedobj = oLineItem.filter(function (oLineItem) {
                            return oLineItem.Bnfpo == Selkey;
                        });

                        if (selectedobj[0]) {
                            var obj1 = selectedobj[0];
                            var obj = {};
                            if (obj1.Land1) {
                                obj.LAND1 = obj1.Land1;
                                obj.WERKS = obj1.Building;
                                obj.NAME1 = obj1.Name1;
                                obj.STRAS = obj1.Street;
                                obj.PSTLZ = obj1.PostCode;
                                obj.ORT01 = obj1.City;
                            }
                            // HeaderMod.DelvAdrTyp = obj1.DelvAdrTyp;
                            var oModel1 = new sap.ui.model.json.JSONModel(obj);
                            this.getView().setModel(oModel1, "DeliveryAddModel");


                            var oModel = new sap.ui.model.json.JSONModel(selectedobj[0]);
                            this.getView().setModel(oModel, "PRLineItemModel");
                            this.getView().setModel(oModel, "PRLineietmModel");
                            sap.ui.getCore().setModel(oModel, "PRLineItemModel");
                            this.getView().getModel("PRLineItemModel").refresh(true);
                            sap.ui.getCore().getModel("PRLineItemModel").refresh(true);
                            this.getView().getModel("PRHeaderModel").refresh(true);
                            this.getOwnerComponent().accountassign = selectedobj[0].Knttp;
                            this.setCodingVisibility(selectedobj[0].Knttp);
                            this.setCodingInputFilters(selectedobj[0]);

                        } else {
                            var oPRHeaderObj = sap.ui.getCore().getModel("PRHeaderModel").getData();
                            var oPRHeaderObj = sap.ui.getCore().getModel("PRHeaderModel").getData();
                            var oPRLineItemObj = {};
                            //   oPRLineItemObj.Text = oPRHeaderObj.Text;
                            oPRLineItemObj.Text = oPRHeaderObj.Text;
                            oPRLineItemObj.Elifn = oPRHeaderObj.Elifn;
                            oPRLineItemObj.Waers = oPRHeaderObj.Waers;
                            oPRLineItemObj.Bnfpo = Selkey;
                            oPRLineItemObj.Txz01 = oPRHeaderObj.Txz01;
                            oPRLineItemObj.Text1 = oPRHeaderObj.Text1;
                            oPRLineItemObj.Menge = oPRHeaderObj.Menge;
                            oPRLineItemObj.Land1 = oPRHeaderObj.Land1;
                            oPRLineItemObj.Meins = oPRHeaderObj.Meins;
                            oPRLineItemObj.Preis = oPRHeaderObj.Preis;
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
                            oPRLineItemObj.Building = oPRHeaderObj.Building;
                            oPRLineItemObj.Name1 = oPRHeaderObj.Name1;
                            oPRLineItemObj.Street = oPRHeaderObj.Street;
                            oPRLineItemObj.PostCode = oPRHeaderObj.PostCode;
                            oPRLineItemObj.City = oPRHeaderObj.City;
                            oPRLineItemObj.Land1 = oPRHeaderObj.Land1;
                            oPRLineItemObj.DelvAdrTyp = 0;
                            if (oPRHeaderObj.Sakto === "") {
                                oPRHeaderObj.Sakto = this.getOwnerComponent().GLAccount;
                            }
                            oPRLineItemObj.Sakto = oPRHeaderObj.Sakto;

                            var oModel = new sap.ui.model.json.JSONModel(oPRLineItemObj);
                            sap.ui.getCore().setModel(oModel, "PRLineItemModel");
                            this.getView().setModel(oModel, "PRLineItemModel");
                             this.setCodingVisibility(oPRLineItemObj.Knttp);
                             this.setCodingInputFilters(oPRLineItemObj);
                            this.getView().getModel("PRLineItemModel").refresh(true);
                            sap.ui.getCore().getModel("PRLineItemModel").refresh(true);
                            this.getView().getModel("PRHeaderModel").refresh(true);
                            //  this.getOwnerComponent().accountassign = selectedobj[0].Knttp;
                        }

                    }
                    // }
                } else {
                    sap.m.MessageBox.error("Please enter mandatory field values", {
                        title: "Error",
                    });
                  
                    oEvent.getSource().setSelectedKey(this.getOwnerComponent().lastlinekey);
                

                }
                // this.getOwnerComponent().lastlinekey = Selkey;
            },


            onDeliverySubmit: function (evt) {
                //  var obj=evt.getSource().getModel("DeliveryAddModel").getData().results[0];
                var obj = evt.getSource().getModel("DeliveryAddModel").getData();
                // var heaadMod = sap.ui.getCore().getModel("PRHeaderModel").getData();
                var ar = obj.LAND1, a1 = obj.WERKS, a2 = obj.NAME1, a3 = obj.STRAS, a4 = obj.PSTLZ, a5 = obj.ORT01;
                if (sap.ui.getCore().getModel("PRLineItemModel")) {
                    var Fragdata = sap.ui.getCore().getModel("PRLineItemModel").getData();
                    Fragdata.Land1 = ar;
                    Fragdata.Building = a1;
                    Fragdata.Name1 = a2;
                    Fragdata.Street = a3;
                    Fragdata.PostCode = a4;
                    Fragdata.City = a5;
                    Fragdata.DelvAdrTyp = sap.ui.getCore().byId("rbg3").getSelectedIndex();
                }
                //if()
                //   heaadMod.Land1 = ar;
                /*  
                  heaadMod.Building = a1;
                  heaadMod.Name1 = a2;
                  heaadMod.Street = a3;
                  heaadMod.PostCode = a4;
                  heaadMod.City = a5;
                  heaadMod.DelvAdrTyp = sap.ui.getCore().byId("rbg3").getSelectedIndex();*/
                //evt.getSource().getModel("DeliveryAddModel").setData(heaadMod);
                this.OnCloseDialog(evt);
                /*  var oMode1 = new sap.ui.model.json.JSONModel(Fragdata);
                  this.getView().setModel(oMode1,"PRLineItemModel");*/
                sap.ui.getCore().getModel("PRLineItemModel").refresh(true);
                sap.ui.getCore().getModel("PRHeaderModel").refresh();
            },
            handleDeliveryLoc: function (oevent, octrl) {
                if (!octrl) {
                    octrl = this;
                }
                // octrl.DelLoc();
                var Lineobj = sap.ui.getCore().getModel("PRLineItemModel").getData();
                var flag = false;
                if (Lineobj.DelvAdrTyp === 1) {
                    flag = true
                } else {
                    if (this.getOwnerComponent().plants !== "") {
                        this.onDelLoc();
                    } else {
                        sap.m.MessageBox.information("Company Code is not found for selected requisition type", {
                            title: "Information",
                        });
                        return;
                    }
                }
                this.fnValueHelpDialogOpen(oevent, octrl._DeliveryLocation, "DeliveryLocation", octrl, "x");

                this.onSetDeliveryLocation([Name, Buiding, Street, City, PostalCode, Country], flag);                                          // this.getView().setModel(this.oMod,"DeliveryAddModel");                    
                if (sap.ui.getCore().byId("rbg3")) {
                    sap.ui.getCore().byId("rbg3").setSelectedIndex(Lineobj.DelvAdrTyp);
                }
                //this.onDelLoc();
            },

            onSubmitPR: function (oEvent) {
                var chkflag = "";
                var msg = "Please fill mandatory field values for line item";
                // var FinalData = this.getView().getModel("PRPreviewModel").getData();
                // FinalData.HdrToItemNav.results.forEach(function (val, index) {
                aLineItemArr.forEach(function (val, index) {
                    var itemflg = "";
                    if (val.Bkgrp === "") {
                        chkflag = "X";
                        itemflg = "X";
                    }

                    if (val.Matkl === "") {
                        chkflag = "X";
                        itemflg = "X";
                    }

                    if (val.Knttp === "9") {
                        if (val.Isbn === "") {
                            chkflag = "X";
                            itemflg = "X";
                        }

                    } else if (val.Knttp === "K") {
                        if (val.Kostl === "") {
                            chkflag = "X";
                            itemflg = "X";
                        }
                    } else if (val.Knttp === "F") {
                        if (val.Aufnr === "") {
                            chkflag = "X";
                            itemflg = "X";
                        }
                    } else if (val.Knttp === "8") {
                        if (val.Prctr === "") {
                            chkflag = "X";
                            itemflg = "X";
                        }
                    } else {
                        chkflag = "X";
                        itemflg = "X";
                    }

                    if (itemflg === "X") {
                        msg = msg + " " + val.Bnfpo + ",";
                    }
                    //itemflg = val.Bnfpo;
                    // }

                });
                if (chkflag === "") {
                    SubmitFlag = "X";
                    this.onSubmit();
                } else {
                    //var msg = "Please fill mandatory field values for line item" + "  " + itemflg;
                    sap.m.MessageBox.error(msg, {
                        title: "Error",
                    });
                }
            },

            afterchange2: function (oEvent) {
                var sNumber = "";
                var value = oEvent.getSource().getValue();
                var bNotnumber = isNaN(value);
                if (bNotnumber == false) {
                    var Val = parseFloat(value).toFixed(2);
                    Val = Val.toString();
                    oEvent.getSource().setValue(Val);
                    var finalValue = "0";
                    var key1 = "";
                    if (this.getView().getModel("PRLineItemModel")) {
                        key1 = this.getView().getModel("PRLineItemModel").getData().Bnfpo;
                    }
                    aLineItemArr.forEach(function (val, idx) {
                        if (key1 !== val.Bnfpo) {
                            var itemValue = val.Menge * val.Preis;
                            val.Gswrt = itemValue.toString();
                            finalValue = parseFloat(finalValue) + parseFloat(itemValue);
                        }
                    });
                    if (sap.ui.getCore().byId("idUnitPrc")) {

                        var Menge = sap.ui.getCore().byId("idItemQnt").getValue();
                        var Price = sap.ui.getCore().byId("idUnitPrc").getValue();
                        var itemValue = Menge * Price;
                        //val.Gswrt = itemValue.toString();
                        finalValue = parseFloat(finalValue) + parseFloat(itemValue);
                    }
                    finalValue = parseFloat(finalValue).toFixed(2);
                    if (isNaN(finalValue) === true) {
                        finalValue = 0;
                    }

                    //HeaderData.Rlwrt = finalValue;
                    this.getOwnerComponent().lineitem = finalValue;
                    this.getView().getModel("PRHeaderModel").setProperty("/Rlwrt", this.getOwnerComponent().lineitem);
                }
                else {
                    oEvent.getSource().setValue(sNumber);
                }
            },

            afterchange1: function (oEvent) {
                var sNumber = "";
                var value = oEvent.getSource().getValue();
                var bNotnumber = isNaN(value);
                if (bNotnumber == false) {
                    var Val = parseFloat(value).toFixed(3);
                    Val = Val.toString();
                    oEvent.getSource().setValue(Val);
                    var finalValue = "0";
                    var key1 = "";
                    if (this.getView().getModel("PRLineItemModel")) {
                        key1 = this.getView().getModel("PRLineItemModel").getData().Bnfpo;
                    }
                    aLineItemArr.forEach(function (val, idx) {
                        if (key1 !== val.Bnfpo) {
                            var itemValue = val.Menge * val.Preis;
                            val.Gswrt = itemValue.toString();
                            finalValue = parseFloat(finalValue) + parseFloat(itemValue);
                        }
                    });
                    if (sap.ui.getCore().byId("idUnitPrc")) {

                        var Menge = sap.ui.getCore().byId("idItemQnt").getValue();
                        var Price = sap.ui.getCore().byId("idUnitPrc").getValue();
                        var itemValue = Menge * Price;
                        //val.Gswrt = itemValue.toString();
                        finalValue = parseFloat(finalValue) + parseFloat(itemValue);
                    }
                    finalValue = parseFloat(finalValue).toFixed(2);
                    if (isNaN(finalValue) === true) {
                        finalValue = 0;
                    }

                    //HeaderData.Rlwrt = finalValue;
                    this.getOwnerComponent().lineitem = finalValue;
                    this.getView().getModel("PRHeaderModel").setProperty("/Rlwrt", this.getOwnerComponent().lineitem);
                }
                else {
                    oEvent.getSource().setValue(sNumber);
                }
            },

        });
    });
