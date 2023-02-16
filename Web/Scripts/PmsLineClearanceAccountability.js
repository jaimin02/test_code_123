/// <reference path:"General.js" />
var productIds = new Object();
var iPeriodIds = new Object();
var iActivityId = new Object();
var nProductNo;
var nStudyProductBatchNo = "";
var nBatchNo;
var TotalQuantity;
var vWorkSpaceId;
var setworkspaceid = "";
var ModuleName = "Accountability Line Clearance";
var tab = false;
var UserTypeCode = "";
var vProjectNo = "";

$(function () {
    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('.modal').modal('hide');

    CheckSetProject();

    $('.panel-group').on('hidden.bs.collapse', toggleIcon);
    $('.panel-group').on('shown.bs.collapse', toggleIcon);

    $('#collapse').collapse('show');

    $('#heading').on("click", function () {
        $('#collapse').collapse('show');
        $('#collapseOne').collapse('hide');
        $('#collapseTwo').collapse('hide');
        //$('#collapseThree').collapse('hide');
        $('#collapseFour').collapse('hide');
    });

    $('#headingOne').on("click", function () {
        $('#collapse').collapse('hide');
        $('#collapseOne').collapse('show');
        $('#collapseTwo').collapse('hide');
        //$('#collapseThree').collapse('hide');
        $('#collapseFour').collapse('hide');
        tab = false;
        $("#btnGo")[0].click();
    });

    $('#headingTwo').on("click", function () {
        $('#collapse').collapse('hide');
        $('#collapseOne').collapse('hide');
        $('#collapseTwo').collapse('show');
        //$('#collapseThree').collapse('hide');
        $('#collapseFour').collapse('hide');
        tab = false;
        $("#btnGo")[0].click();
    });

    //$('#headingThree').on("click", function () {
    //    $('#collapse').collapse('hide');
    //    $('#collapseOne').collapse('hide');
    //    $('#collapseTwo').collapse('hide');
    //    //$('#collapseThree').collapse('show');
    //    $('#collapseFour').collapse('hide');
    //    tab = false;
    //    $("#btnGo")[0].click();
    //});

    $('#headingFour').on("click", function () {
        $('#collapse').collapse('hide');
        $('#collapseOne').collapse('hide');
        $('#collapseTwo').collapse('hide');
        //$('#collapseThree').collapse('hide');
        $('#collapseFour').collapse('show');
        tab = false;
        $("#btnGo")[0].click();
    });

    iUserNo = $("#hdnuserid").val();
    $("#spnwelcome").html($("#hdnusername").val());
    $("#spnLoginTime").html($("#hdnlogintime").val());
    var GetAllPmsProjectNo = {
        Url: BaseUrl + "PmsProductBatch/GetProjectNo",
        SuccessMethod: "SuccessMethod",
    }

    $('#btnExitPage').on("click", function () {
        ConfirmAlertBox(ModuleName, $("#RedirectToHome").val());
    });

    GetProductType();
    GetNoOfPeriods();

    $('#DDLProjectNo').on('change keyup paste mouseup', function () {
        if ($('#DDLProjectNo').val().length == 2) {
            var ProjectNoDataTemp = {
                vProjectNo: $('#DDLProjectNo').val(),
                iUserId: $("#hdnuserid").val(),
                vProjectTypeCode: $("#hdnscopevalues").val(),
            }
            GetAllPmsProjectNoData(GetAllPmsProjectNo.Url, GetAllPmsProjectNo.SuccessMethod, ProjectNoDataTemp);
        }
        else if ($('#DDLProjectNo').val().length < 2) {
            $("#DDLProjectNo").autocomplete({
                source: "",
                change: function (event, ui) { },
                select: function (event, ui) {
                    vProjectNo = ui.item.value;
                    $('#DDLProjectNo').val(vProjectNo);

                    if (productIds[$('#DDLProjectNo').val()] != undefined) {
                        setworkspaceid = productIds[$('#DDLProjectNo').val()];
                    }
                    GetDispenseAuthorizationForBlindedStudy();
                    if (isBlank(document.getElementById('DDLProjectNo').value)) {
                        SetDefaultValue();
                        return false;
                    }
                    GetNoOfPeriods();
                    GetProductType();

                }
            });
        }
    });

    $('#DDLProjectNo').on("blur", function () {
        if (productIds[$('#DDLProjectNo').val()] != undefined) {
            setworkspaceid = productIds[$('#DDLProjectNo').val()];
        }
        GetDispenseAuthorizationForBlindedStudy();
        if (isBlank(document.getElementById('DDLProjectNo').value)) {
            SetDefaultValue();
            return false;
        }
        GetNoOfPeriods();
        GetProductType();
    });

    $('#DDLPeriod').on("change", function () {
        if (productIds[$('#DDLProjectNo').val()] != undefined) {
            setworkspaceid = productIds[$('#DDLProjectNo').val()];
        }
        if (isBlank(document.getElementById('DDLProjectNo').value)) {
            SetDefaultValue();
            return false;
        }
        var Data = {
            id: setworkspaceid,
            //iPeriod: iPeriodIds[$('#DDLPeriod').val()]
            iPeriod: $("#DDLPeriod :selected").text()
        }
        var GetActivityList = {
            Url: BaseUrl + "PmsProductDispense/GetActivityList",
            SuccessMethod: "SuccessMethod",
            Data: Data
        }
        GetActivityListDataMaster(GetActivityList.Url, GetActivityList.SuccessMethod, GetActivityList.Data);
    });

    $('#DDLProductType').on("change", function () {
        GetProductName();
    });

    $('#DDLProduct').on("change", function () {
        GetBatchLotNo();
    });

    $('#DDLActivity').on("change", function () {
        if (productIds[$('#DDLProjectNo').val()] != undefined) {
            setworkspaceid = productIds[$('#DDLProjectNo').val()];
        }
        if (isBlank(document.getElementById('DDLActivity').value)) {
            SetDefaultValue();
            return false;
        }
        var Datas = {
            id: setworkspaceid,
            iPeriod: $("#DDLPeriod :selected").text(),
            iNodeId: $("#DDLActivity").val()
        }
        var GetDosingDetail = {
            Url: BaseUrl + "PmsProductDispense/GetDosingDetailData",
            SuccessMethod: "SuccessMethod",
            Data: Datas
        }
        GetDosingDetailMaster(GetDosingDetail.Url, GetDosingDetail.SuccessMethod, GetDosingDetail.Data);
    });

    $('#btnExit').on("click", function () {
        document.getElementById('dispensedata').style.visibility = "hidden";
        document.getElementById('tblPmsProductDispenseData').style.visibility = "hidden";
    });

    $('#btnClear').on("click", function () {
        SetDefaultValue();
    });

    $('#txtDispenseQty').on("change", function () {
        if (productIds[$('#DDLProjectNo').val()] != undefined) {
            setworkspaceid = productIds[$('#DDLProjectNo').val()];
        }
        var QuantityCheck = {
            vWorkSpaceId: setworkspaceid,
            vProductNo: $("#DDLProduct").val(),
            //nStudyProductBatchNo: $("#txtBatchLotNo").text(),
            nStudyProductBatchNo: $("#ddlBatchLotNo").val(),
            vRefModule: "PD",
        }

        var GetPmsQuntitytyCheckProductName = {
            Url: BaseUrl + "PmsGeneral/QtyDetail",
            SuccessMethod: "SuccessMethod",
            Data: QuantityCheck
        }
        QuntityCheckMaster(GetPmsQuntitytyCheckProductName.Url, GetPmsQuntitytyCheckProductName.SuccessMethod, GetPmsQuntitytyCheckProductName.Data);
    });

    $('#DDLDosingNo').on('change', function () {
        tab = true;
        $("#btnGo").click();
    });

    $('#txtBarcode').on('change', function () {
        $("#loader").attr("style", "display:block");

        //if ($('#divexport').css('display') == 'none') {
        //    alert("Dispense Data Not Found");
        //    $("#loader").attr("style", "display:none");
        //    return false;
        //}
        //else {
        var rows = $("#tblPmsProductDispenseData").dataTable().fnGetNodes();
        if (rows.length != 0) {
            if (ChangeBGCOlorOnGunning() == false) {
                $("#loader").attr("style", "display:none");
                return false;
            }

            if (QualityCheck() == false) {
                $("#loader").attr("style", "display:none");
                return false;
            }

            if ($('#txtBarcode').val() == 0) {
                $("#loader").attr("style", "display:none");
                return false;
            }

            //$("#txtDispenseQty").val(qty);
            $("#txtprojectno").val($(rows[i]).find("td:eq(1)").html());
            $("#txtPeriod").val($(rows[i]).find("td:eq(2)").html());
            $("#txtSubjectNo").val($(rows[i]).find("td:eq(5)").html());
            $("#txtDoseNo").val($(rows[i]).find("td:eq(7)").html());

            if ($("#txtDispenseQty").val() == "") {
                SuccessorErrorMessageAlertBox("Quantity is not valid.", ModuleName);
                return false;
            }
            else {
                SaveDispenceDetail();
                tab = true;
                $("#btnGo").click();
                tab = false;
                //$('#collapseOne').collapse('hide');
                //$('#collapseTwo').collapse('show');
            }
        }
        else {
            alert("Dispense Not Found");
        }
        //}
        $("#loader").attr("style", "display:none");
    });

    var GetAllPmsProjectNoData = function (Url, SuccessMethod, ProjectNoDataTemp) {
        $.ajax({
            url: Url,
            type: 'GET',
            data: { id: ProjectNoDataTemp.iUserId, projectno: ProjectNoDataTemp.vProjectNo, typecode: ProjectNoDataTemp.vProjectTypeCode },
            async: false,
            success: function (jsonData) {
                var jsonObj = jsonData;
                var sourceArr = [];
                for (var i = 0; i < jsonObj.length; i++) {
                    sourceArr.push("[ " + jsonObj[i].vProjectNo + " ]" + " " + jsonObj[i].vRequestId);
                    productIds["[ " + jsonObj[i].vProjectNo + " ]" + " " + jsonObj[i].vRequestId] = jsonObj[i].vWorkspaceId;
                }
                $("#DDLProjectNo").autocomplete({
                    source: sourceArr,
                    change: function (event, ui) { }
                });
            },
            error: function () {
                SuccessorErrorMessageAlertBox("Project not found.", ModuleName);
            }
        });
    }

    var GetActivityListDataMaster = function (Url, SuccessMethod, Data) {
        $.ajax({
            url: Url,
            type: 'GET',
            data: Data,
            success: function (jsonData) {
                if (jsonData.length > 0) {
                    $("#DDLActivity").empty().append('<option selected="selected" value="0">Please Select Activity</option>');
                    for (var i = 0; i < jsonData.length; i++) {
                        $("#DDLActivity").append($("<option></option>").val(jsonData[i].vActivityId).html([jsonData[i].vActivityName]));
                    }
                }
                else {
                    $("#DDLActivity").empty().append('<option selected="selected" value="0">No Activity Found</option>');
                }
            },
            error: function () {
                SuccessorErrorMessageAlertBox("Activity not found.", ModuleName);
            }
        });
    }

    var GetDosingDetailMaster = function (Url, SuccessMethod, Data) {
        $.ajax({
            url: Url,
            type: 'GET',
            data: Data,
            success: function (jsonData) {
                if (jsonData.length > 0) {
                    $("#DDLDosingDay").empty().append('<option selected="selected" value="0">Please Select DosingDay</option>');
                    $("#DDLDosingNo").empty().append('<option selected="selected" value="0">Please Select DosingNo</option>');
                    for (var i = 0; i < jsonData.length; i++) {
                        if (jsonData[i].iDoseNo == null || jsonData[i].iDayNo == null) {
                            jsonData[i].iNodeId = "";
                            jsonData[i].iDayNo = "";
                            $("#DDLDosingDay").empty().append('<option selected="selected" value="0">No DosingDay Found</option>');
                            $("#DDLDosingNo").empty().append('<option selected="selected" value="0">No DosingNo Found</option>');
                        }
                        else {
                            $("#DDLDosingNo").append($("<option></option>").val(jsonData[i].iNodeId).html([jsonData[i].iDoseNo]));
                            $("#DDLDosingDay").append($("<option></option>").val(jsonData[i].iNodeId).html([jsonData[i].iDayNo]));
                        }
                    }
                }
                else {
                    $("#DDLDosingDay").empty().append('<option selected="selected" value="0">No DosingDay Found</option>');
                    $("#DDLDosingNo").empty().append('<option selected="selected" value="0">No DosingNo Found</option>');
                }
            },
            error: function () {
                SuccessorErrorMessageAlertBox("Dosing Details not found.", ModuleName);
            }
        });
    }

    //$("#btnGo").on("click", function () {
    //    ExportToPDF();
    //    if (productIds[$('#DDLProjectNo').val()] != undefined) {
    //        setworkspaceid = productIds[$('#DDLProjectNo').val()];
    //    }
    //    if (ValidateForm()) {
    //        if (tab == true) {
    //            $('#collapse').collapse('hide');
    //            $('#collapseOne').collapse('show');
    //            $('#collapseTwo').collapse('hide');
    //            $('#collapseThree').collapse('hide');
    //            $('#collapseFour').collapse('hide');
    //        }
    //        //else {
    //        //    $('#collapseOne').collapse('show');
    //        //    $('#collapseTwo').collapse('hide');
    //        //}

    //        document.getElementById('dispensedata').style.visibility = "visible";
    //        document.getElementById('tblPmsProductDispenseData').style.visibility = "visible";
    //        var Data_s = {
    //            vWorkSpaceId: setworkspaceid,
    //            iPeriod: $("#DDLPeriod :selected").text(),
    //            iDayNo: $("#DDLDosingDay :selected").text(),
    //            iDoseNo: $("#DDLDosingNo :selected").text(),
    //            iModifyBy: $("#hdnuserid").val(),
    //            vProductType: $("#DDLProductType :selected").text(),
    //            nProductTypeID: $("#DDLProductType").val(),
    //            nProductNo: $("#DDLProduct").val(),
    //            nBatchNo: $("#ddlBatchLotNo").val()
    //        }
    //        var GetDispenseDetailData = {
    //            Url: BaseUrl + "PmsProductDispense/PostDetailForBarcodePrint",
    //            SuccessMethod: "SuccessMethod",
    //            Data: Data_s
    //        }
    //        GetAllDispenseDetailMaster(GetDispenseDetailData.Url, GetDispenseDetailData.SuccessMethod, GetDispenseDetailData.Data);
    //        //changeBGClrOfRow();
    //    }
    //});

    GetViewMode();
});

function ExportToPDF() {
    if (productIds[$('#DDLProjectNo').val()] != undefined) {
        setworkspaceid = productIds[$('#DDLProjectNo').val()];
    }

    var Data_s = {
        vWorkSpaceId: setworkspaceid,
        iPeriod: $("#DDLPeriod :selected").text(),
        iDayNo: $("#DDLDosingDay :selected").text(),
        iDoseNo: $("#DDLDosingNo :selected").text(),
        iModifyBy: $("#hdnuserid").val(),
        vProductType: $("#DDLProductType :selected").text(),

        nProductTypeID: $("#DDLProductType").val(),
        nProductNo: $("#DDLProduct").val(),
        nBatchNo: $("#ddlBatchLotNo").val()

    }

    var url = WebUrl + "PmsProductDispense/GetExportToPDFDetails";
    $.ajax({
        url: url,
        type: 'get',
        data: Data_s,

        success: function (data) {

        },
        error: function () {
            SuccessorErrorMessageAlertBox("Error in export to excel details.", ModuleName);
        }
    });
}

var GetAllDispenseDetailMaster = function (Url, SuccessMethod, Data) {
    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Dispense Detail not found.", ModuleName);
        }
    });
    function SuccessMethod(jsonData) {
        if (jsonData.length == 0) {
            $("#divexport").hide();
        }
        else {
            $("#divexport").show();
        }
        var strdata = "";
        var tr = "";
        var ActivityDataset = [];
        for (var i = 0; i < jsonData.length; i++) {
            var $ctrl = '<input class="chk" type="checkbox" name="case" id="' + jsonData[i].vDosingBarCode + '" value="' + i + '" onchange="ChangeCheckBox(this);"  />'
            $("#hdnworkspaceid").css("visibility", "visible");
            var InDataset = [];
            var DispenseDoneBy = jsonData[i].vModifyBy + " / </br> " + jsonData[i].TransactionDate;
            if (DispenseDoneBy == "null / </br> null") {
                DispenseDoneBy = "";
            }
            InDataset.push($ctrl, jsonData[i].vWorkspaceId, jsonData[i].vDosingBarCode, jsonData[i].vProjectNo, jsonData[i].nProductNo, jsonData[i].nBatchNo,
                           jsonData[i].iPeriod, jsonData[i].vProtocolNo, jsonData[i].vProductType, jsonData[i].vMySubjectNo, jsonData[i].vSubjectId,
                           jsonData[i].iDoseNo, jsonData[i].iDayNo, jsonData[i].iDispenseQtyPerSubject, DispenseDoneBy,
                           jsonData[i].ReDespensingRemark, '', '', jsonData[i].nDosingDetailNo, i + 1, jsonData[i].cStatusindi, jsonData[i].iDosedBy);
            ActivityDataset.push(InDataset);
        }
        otabledispense = $('#tblPmsProductDispenseData').dataTable({
            "bJQueryUI": true,
            "sPaginationType": "full_numbers",
            "bLengthChange": true,
            "bProcessing": true,
            "bSort": true,
            "autoWidth": false,
            "bInfo": true,
            "aaData": ActivityDataset,
            "bDestroy": true,
            "aaSorting": [],
            "oLanguage": {
                "sEmptyTable": "No Record found"
            },
            "fnCreatedRow": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                if (aData[14] != "") {
                    $(nRow).addClass('highlightDispense');
                    $('#' + aData[1]).attr("checked", "true")
                }
                if (aData[20] == "D") {
                    $(nRow).removeClass("highlightDispense");
                    $(nRow).addClass('highlight');
                    $('#' + aData[1]).attr("checked", "true")
                }
            },
            "sScrollX": "100%",
            "sScrollXInner": "2000" /* It varies dynamically if number of columns increases */,
            "aoColumns": [{ "sTitle": "<input type='checkbox' id='checkAll' class='hCheck' onchange='ChangeEvent(this)'>All</input>" },
                { "sTitle": "vWorkSpaceId" },
                { "sTitle": "Barcode " },
                { "sTitle": "Project No" },
                { "sTitle": "ProductNo " },
                { "sTitle": "Batch/Lot/Lot No " },
                { "sTitle": "Period" },
                { "sTitle": "Protocol No" },
                { "sTitle": "Product Type" },
                { "sTitle": "Subject No" },
                { "sTitle": "Subject-ID" },
                { "sTitle": "Dose No" },
                { "sTitle": "Day No" },
                { "sTitle": "Qty" },
                { "sTitle": "Dispense Done By" },
                {
                    "sTitle": "ReDispense Remarks",
                    "render": function (data, type, full, meta) {
                        if (full[15] != null && full[15].length > 20) {
                            return '<td tooltip="' + full[15] + '">' + full[15].substring(0, 20) + '..</td>';
                        }
                        else {
                            return full[15];
                        }
                    },
                    'fnCreatedCell': function (nTd, sData, oData, iRow, iCol) {
                        if (sData != null && sData.length > 20) {
                            nTd.title = sData;
                        }
                    }
                },
                {
                    "sTitle": "ReDispensing",
                    "render": function (data, type, full, meta) {
                        if (full[14] != "" && full[20] != "D" && full[21] == null) {
                            return '<img src="../Content/Images/ReDespensing.png" tooltip="ReDespensing" style="width:32px;height:32px;" onclick="ReDespinsingData(this)" data-toggle="modal" data-target="#RemarksModal"  workspaceid="' + full[1] + '"  qty="' + full[12] + '" barcode="' + full[2] + '" "/>  ';
                        }
                        else {
                            //return '<a> <i class="fa fa-medkit" aria-hidden="true"></i> </a>';
                            return '<img src="../Content/Images/ReDespensing.png" alt="Mountain View" style="width:32px;height:32px;">';
                        }
                    }
                },
                {
                    "sTitle": "Detail",
                    "render": function (data, type, full, meta) {
                        return '<input type="button" value="view" onclick="SelectData(this)" data-toggle="modal" data-target="#ViewProductdetail"  Id="' + full[1] + '""/>';
                    }
                },
                { "sTitle": "nDosingDetailNo" },
                { "sTitle": "id" },
            ],
            "columnDefs": [{
                "targets": [0, 1, 4, 5, 18, 19, 20],
                "visible": false,
            },
                { "bSortable": false, "targets": [0, 16, 17] },
                { "width": "2%", "targets": 2 },
                { "width": "2%", "targets": 3 },
                { "width": "0.5%", "targets": 6 },
                { "width": "2%", "targets": 7 },
                { "width": "2%", "targets": 8 },
                { "width": "2%", "targets": 9 },
                { "width": "2%", "targets": 10 },
                { "width": "0.5%", "targets": 11 },
                { "width": "0.5%", "targets": 12 },
                { "width": "0.5%", "targets": 13 },
                { "width": "6%", "targets": 14 },
                { "width": "0.1%", "targets": 15 },
                { "width": "0.1%", "targets": 16 },
                { "width": "0.1%", "targets": 17 }, ],
        });
    }
}

var InsertPmsProductDispenseHdrMaster = function (Url, SuccessMethod, Data) {
    var values = [];
    var tblhdr = [];
    var name;
    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        async: false,
        success: SuccessInsertData,
        error: function () {
        }
    });

    function SuccessInsertData(response) {
        if (productIds[$('#DDLProjectNo').val()] != undefined) {
            setworkspaceid = productIds[$('#DDLProjectNo').val()];
        }
        id = $("#txtBarcode").val();
        var InsertPmsProductDispensDtl = {
            nTransactionNo: response,
            nSrNo: "1",
            vWorkSpaceId: setworkspaceid,
            nProductNo: $("#DDLProduct").val(),
            //nStudyProductBatchNo: $("#txtBatchLotNo").text(),
            nStudyProductBatchNo: $("#ddlBatchLotNo").val(),
            iReceivedQty: $("#txtDispenseQty").val(),
            iSubjectNo: $("#txtSubjectNo").val(),
            iDayNo: $("#txtDayNo").val(),
            iDoseNo: $("#txtDoseNo").val(),
            iPeridNo: $("#txtPeriod").val(),
            vBarCode: $("#txtBarcode").val(),
            vProjectNo: $("#txtprojectno").val(),
            cProductFlag: "P",
            iModifyBy: $("#hdnuserid").val(),
            vDocTypeCode: "ZDIS",
            vRefModule: "PM",
            dDispenseDate: "",
            nReasonNo: 0,
            nRefDocNo: response,
            vDocTypeCode: "ZDIS",
            cLocationIndicator: "P",
            cAddSub: "S",
            vRemark: "ReDispensing:" + $('#txtRemarks').val()
        }

        var InsertProductDispenseDtlData = {
            Url: BaseUrl + "PmsStudyProductReceipt/InsertTransctionDtlData",
            SuccessMethod: "SuccessMethod",
            Data: InsertPmsProductDispensDtl
        }

        $.ajax({
            url: InsertProductDispenseDtlData.Url,
            type: 'POST',
            async: false,
            data: InsertProductDispenseDtlData.Data,
            success: function (response) {
                if (response == "Line Clearance Saved Successfully") {
                    $("#txtDispenseQty").val("");
                    $("#txtBarcode").val("");
                    $("#txtbarcode").val("");
                    $("#txtprojectno").val("");
                    $("#txtPeriod").val("");
                    $("#txtSubjectNo").val("");
                    $("#txtDoseNo").val("");
                    $("#txtDayNo").val("");
                    UpdateGrid();
                    SuccessorErrorMessageAlertBox("Product Dispensed successfully.", ModuleName);
                }
            },
            error: function () { }
        });
    }
}

function GetNoOfPeriods() {
    if (setworkspaceid != "") {
        var GetAllPmsNoOfPeriods = {
            Url: BaseUrl + "PmsProductDispense/GetNoOfPeriod/" + setworkspaceid,
            SuccessMethod: "SuccessMethod",
        }

        $.ajax({
            url: BaseUrl + "PmsProductDispense/GetNoOfPeriod/" + setworkspaceid,
            type: 'GET',
            success: function (jsonData) {
                if (jsonData.length > 0) {
                    $("#DDLPeriod").empty().append('<option selected="selected" value="0">Please Select Period</option>');
                    for (var i = 0; i < jsonData.length; i++) {
                        $("#DDLPeriod").append($("<option></option>").val(jsonData[i].WorkSpaceId).html([jsonData[i].TotalNoOfPeriods]));
                    }
                }
                else {
                    $("#DDLPeriod").empty().append('<option selected="selected" value="0">No Period Found</option>');
                }
            },
            error: function () {
                SuccessorErrorMessageAlertBox("Period not found.", ModuleName);
            }
        });
    }
}

function ValidateForm() {
    if (isBlank(document.getElementById('DDLProjectNo').value)) {
        ValidationAlertBox("Please select Project No.", "DDLProjectNo", ModuleName);
        return false
    }

    else if ($("#DDLProductType").val() == 0) {
        ValidationAlertBox("Please select Product Type.", "DDLProductType", ModuleName);
        return false;
    }

    else if ($("#DDLProduct").val() == 0) {
        ValidationAlertBox("Please select Product.", "DDLProduct", ModuleName);
        return false;
    }

    else if ($("#ddlBatchLotNo").val() == 0) {
        ValidationAlertBox("Please select Batch/Lot/Lot No.", "ddlBatchLotNo", ModuleName);
        return false;
    }

    else if ($("#DDLPeriod").val() == 0) {
        ValidationAlertBox("Please select Period.", "DDLPeriod", ModuleName);
        return false;
    }
    else if ($("#DDLActivity").val() == 0) {
        ValidationAlertBox("Please select Activity.", "DDLActivity", ModuleName);
        return false;
    }
    else if ($("#DDLDosingDay").val() == 0) {
        ValidationAlertBox("Please select Dosing Day.", "DDLDosingDay", ModuleName);
        return false;
    }
    else if ($("#DDLDosingNo").val() == 0) {
        ValidationAlertBox("Please select Dosing No.", "DDLDosingNo", ModuleName);
        return false;
    }
    else {
        return true;
    }
}

function SelectData(e) {
    if (productIds[$('#DDLProjectNo').val()] != undefined) {
        setworkspaceid = productIds[$('#DDLProjectNo').val()];
    }
    var Data_s = {
        vWorkSpaceId: setworkspaceid,
        nProductTypeID: $("#DDLProductType").val(),
        nProductNo: $("#DDLProduct").val(),
        nBatchNo: $("#ddlBatchLotNo").val()

    }
    var GetProductDetail = {
        Url: BaseUrl + "PmsProductDispense/PostProductDetailByProjectNo/",
        SuccessMethod: "SuccessMethod",
        Data: Data_s
    }

    GetProductDetailMaster(GetProductDetail.Url, GetProductDetail.SuccessMethod, GetProductDetail.Data)
}

var GetProductDetailMaster = function (Url, SuccessMethod, Data) {
    $.ajax({
        url: Url,
        type: 'Post',
        data: Data,
        success: SuccessData,
        error: function () {
            SuccessorErrorMessageAlertBox("Product not found.", ModuleName);
        }
    });

    function SuccessData(jsonData) {
        if (jsonData.length > 0) {
            var ActivityDataset = [];
            for (var i = 0; i < jsonData.length; i++) {
                var InDataset = [];
                InDataset.push(jsonData[i].vProductName, jsonData[i].vProductType, jsonData[i].vBatchLotNo, jsonData[i].TotalQty);
                ActivityDataset.push(InDataset);
            }
            otable = $('#tblProductDetail').dataTable({
                "bJQueryUI": true,
                "sPaginationType": "full_numbers",
                "bLengthChange": true,
                "iDisplayLength": 10,
                "bProcessing": true,
                "bSort": false,
                "autoWidth": true,
                "aaData": ActivityDataset,
                "bInfo": true,
                "bDestroy": true,
                "oLanguage": {
                    "sEmptyTable": "No Record Found",
                },
                "aoColumns": [
                       { "sTitle": "ProductName" },
                       { "sTitle": "Product Type" },
                       { "sTitle": "Batch/Lot/Lot No" },
                       { "sTitle": "Qty" },
                ],
            });
        }
        else {
            $('#tblProductDetail').dataTable({
                "bDestroy": true,
                "oLanguage": {
                    "sEmptyTable": "No Record Found",
                },
            });
        }
    }
}

function GetProjectData(vWorkSpaceId) {
    var GetProjectDetail = {
        Url: BaseUrl + "PmsProductDispense/GetProductDetailByProjectNo/" + vWorkSpaceId,
        SuccessMethod: "SuccessMethod",
    }
    GetProjectDetailMaster(GetProjectDetail.Url, GetProjectDetail.SuccessMethod)
}

var GetProjectDetailMaster = function (Url, SuccessMethod) {
    $.ajax({
        url: Url,
        type: 'get',
        async: false,
        success: function (jsonData) {
            if (jsonData.length > 0) {
                for (var i = 0; i < jsonData.length; i++) {
                    nStudyProductBatchNo = jsonData[i].nStudyProductBatchNo;
                    nStudyProductBatchNo = nStudyProductBatchNo + ","
                    nProductNo = jsonData[0].nProductNo;
                }
            }
            else {
                $("#txtDispenseQty").val('');
                txtDispenseQty.focus();
                ValidationAlertBox("Quantity not defined.", "txtDispenseQty", ModuleName);
            }
        },
        error: function () {
        }
    });
}

var QuntityCheckMaster = function (Url, SuccessMethod, Data) {
    var flag = true;
    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        async: false,
        success: function (response) {
            TotalQuantity = ($("#txtDispenseQty").val());
            if (TotalQuantity == 0) {
                $("#txtDispenseQty").val('');
                ValidationAlertBox("Please enter Valid Quantity.", "txtDispenseQty", ModuleName);
                flag = false;
            }
            if (parseInt(response) < parseInt(TotalQuantity)) {
                $("#txtDispenseQty").val('');
                ValidationAlertBox("Current Stock is " + response + ".", "txtDispenseQty", ModuleName);
                flag = false;
            }
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Data not found.", ModuleName);
        }
    });
    return flag;
}

function ChangeEvent(id) {
    if (id.checked == true) {
        $('.chk').each(function () { //loop through each checkbox
            this.checked = true;  //select all checkboxes with class "checkbox1"               
        });
    } else {
        $('.chk').each(function () { //loop through each checkbox
            this.checked = false; //deselect all checkboxes with class "checkbox1"                       
        });
    }
}

function changeBGClrOfRow() {
    var DispenseDate;
    var RowNo;
    var rowLength = $("#tblPmsProductDispenseData").find("tr").not("thead tr").length;
    for (i = 1; i <= rowLength; i++) {
        DispenseDate = otabledispense.fnGetData(i - 1)[12];
        if (DispenseDate != null) {
            RowNo = otabledispense.fnGetData(i - 1)[15];
            $("#tblPmsProductDispenseData").find("tr:eq(" + RowNo + ")").css("background", "Lightblue");
            var cont = $("#tblPmsProductDispenseData").find("tr:eq(" + RowNo + ")");
            var chk = cont.children().children().eq(0);
            var id = $(chk).attr('id');
            if ($('#' + id).is(':checked') == false) {
                $('#' + id).prop('checked', true);
            }
            $('#' + id).prop('disabled', true);
        }
    }
}

function ChangeCheckBox(id) {
    var rowIndex = id.value;
    rowIndex++;

    if (id.checked == true) {
        $("#tblPmsProductDispenseData").find("tr:eq(" + rowIndex + ")").css("background", "LightBlue");
        rowIndex--;
    }
    else {
        $("#tblPmsProductDispenseData").find("tr:eq(" + rowIndex + ")").css("background", "white");

        if (rowIndex % 2 == 0) {
            $("#tblPmsProductDispenseData").find("tr:eq(" + rowIndex + ")").css("background", "#f3f3f3");
        }
        else {
            $("#tblPmsProductDispenseData").find("tr:eq(" + rowIndex + ")").css("background", "white");
        }
    }
}

function UpdateGrid() {
    if (productIds[$('#DDLProjectNo').val()] != undefined) {
        setworkspaceid = productIds[$('#DDLProjectNo').val()];
    }
    var Data_s = {
        vWorkSpaceId: setworkspaceid,
        iPeriod: $("#DDLPeriod :selected").text(),
        iDayNo: $("#DDLDosingDay :selected").text(),
        iDoseNo: $("#DDLDosingNo :selected").text(),
        iModifyBy: $("#hdnuserid").val(),
        vProductType: $("#DDLProductType :selected").text(),

        nProductTypeID: $("#DDLProductType").val(),
        nProductNo: $("#DDLProduct").val(),
        nBatchNo: $("#ddlBatchLotNo").val()

    }
    var GetDispenseDetailData = {
        Url: BaseUrl + "PmsProductDispense/PostDetailForBarcodePrint",
        SuccessMethod: "SuccessMethod",
        Data: Data_s
    }
    GetAllDispenseDetailMaster(GetDispenseDetailData.Url, GetDispenseDetailData.SuccessMethod, GetDispenseDetailData.Data);

}

function ChangeBGCOlorOnGunning() {
    $.ajax({
        async: false,
    });
    var table = $("#tblPmsProductDispenseData").dataTable();
    var RowNo;
    var count;
    var qty = "";
    var dispensedate = "";
    var len = ($('#txtBarcode').val()).length;
    var rows = $("#tblPmsProductDispenseData").dataTable().fnGetNodes();
    if (len == 10) {
        for (i = 0; i <= rows.length; i++) {
            BarcodeValue = $(rows[i]).find("td:eq(0)").html();
            if (BarcodeValue == $('#txtBarcode').val()) {
                dispensedate = otabledispense.fnGetData(i - 0)[14];
                var dispensestatus = otabledispense.fnGetData(i - 0)[19];
                if (dispensestatus == "D") {
                    $('#txtBarcode').val('');
                    SuccessorErrorMessageAlertBox("Product for this subject already deleted.", ModuleName);
                    return false;
                    break;
                }
                if (dispensedate == null || dispensedate == "") {
                    qty = otabledispense.fnGetData(i - 0)[13];
                    $("#txtDispenseQty").val(qty);
                    $("#txtprojectno").val($(rows[i]).find("td:eq(1)").html());
                    $("#txtPeriod").val($(rows[i]).find("td:eq(2)").html());
                    $("#txtSubjectNo").val($(rows[i]).find("td:eq(5)").html());
                    $("#txtDoseNo").val($(rows[i]).find("td:eq(7)").html());
                    $("#txtDayNo").val($(rows[i]).find("td:eq(8)").html());
                    RowNo = i;
                    var srno = i + 1;
                    return true;
                    break;
                }
                else {
                    $('#txtBarcode').val('');
                    SuccessorErrorMessageAlertBox("Product for this subject already dispensed.", ModuleName);
                    return false;
                    break;
                }
            }
            else {
                count = i;
            }
        }
        if (count > 1) {
            $('#txtBarcode').val('');
            ValidationAlertBox("This Barcode does not match with record.", "txtBarcode", ModuleName);
            return false;
        }
    }
    else {
        $('#txtBarcode').val('');
        ValidationAlertBox("invalid barcode length.", "txtBarcode", ModuleName);
        return false;
    }
}

function SaveDispenceDetail() {
    if ($('#txtBarcode').val() == 0) {
        $('#txtBarcode').val('');
        ValidationAlertBox("Please enter valid Qty.", "txtDispenseQty", ModuleName);
        return false;
    }
    if (productIds[$('#DDLProjectNo').val()] != undefined) {
        setworkspaceid = productIds[$('#DDLProjectNo').val()];
    }

    var InsertPmsProductDispensHdr = {
        vWorkSpaceId: setworkspaceid,
        nStorageLocationNo: "0",
        nSponsorNo: "0",
        nTransactionNo: "0",
        nProductNo: "",
        vReceivedFrom: "",
        vShipmentNo: "",
        vRefNo: "",
        vDocTypeCode: "ZDIS",
        iPeridNo: $("#DDLPeriod :selected").text(),
        iModifyBy: $("#hdnuserid").val(),
        nTransportMode: "0",
        vOtherTransportName: "",
        vDiscrepanciesNoted: "",
        vSendReceivedName: "",
        cTransactionType: "",
        nProductTypeId: $('#DDLProductType').val(),
        vRemark: $('#txtRemarks').val(),
        cTransferIndi: "P",
    }

    var InsertProductDispenseHdrData = {
        Url: BaseUrl + "PmsStudyProductReceipt/InsertPmsProductReceiptHeader",
        SuccessMethod: "SuccessMethod",
        Data: InsertPmsProductDispensHdr
    }
    InsertPmsProductDispenseHdrMaster(InsertProductDispenseHdrData.Url, InsertProductDispenseHdrData.SuccessMethod, InsertProductDispenseHdrData.Data);
}

function SetDefaultValue() {
    $('#DDLPeriod').val(0).attr("selected", "selected");
    $('#DDLActivity').val(0).attr("selected", "selected");
    $('#DDLDosingDay').val(0).attr("selected", "selected");
    $('#DDLDosingNo').val(0).attr("selected", "selected");
    $('#DDLProductType').val(0).attr("selected", "selected");
    $('#DDLProduct').val(0).attr("selected", "selected");
    //$('#txtBatchLotNo').val("");
    $('#ddlBatchLotNo').val(0).attr("selected", "selected");
}

function toggleIcon(e) {
    $(e.target)
        .prev('.panel-heading')
        .find(".more-less")
        .toggleClass('glyphicon-plus glyphicon-minus');
}

function GetProductName() {
    if (productIds[$('#DDLProjectNo').val()] != undefined) {
        setworkspaceid = productIds[$('#DDLProjectNo').val()];
    }

    var GetProductNameData = {
        vWorkSpaceId: setworkspaceid,
        nProductTypeID: $("#DDLProductType").val(),
        cTransferIndi: 'P',
    }

    var GetPmsStudyReceiptProductName = {
        Url: BaseUrl + "PMSGeneral/ProductName",
        SuccessMethod: "SuccessMethod",
        Data: GetProductNameData,
    }

    $.ajax({
        url: GetPmsStudyReceiptProductName.Url,
        type: 'POST',
        data: GetPmsStudyReceiptProductName.Data,
        success: function (jsonData) {
            var strdata = "";
            if (jsonData.length > 0) {
                $("#DDLProduct").empty().append('<option selected="selected" value="0">Please Select Product</option>');
                for (var i = 0; i < jsonData.length; i++)
                    $("#DDLProduct").append($("<option></option>").val(jsonData[i].nProductNo).html(jsonData[i].vProductName));
            }
            else {
                $("#DDLProduct").empty().append('<option selected="selected" value="0">Please Select Product</option>');
            }
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Product not found.", ModuleName);
        }
    });
}

function GetBatchLotNo() {
    if (productIds[$('#DDLProjectNo').val()] != undefined) {
        setworkspaceid = productIds[$('#DDLProjectNo').val()];
    }

    var nProductNo = $("#DDLProduct").val();

    var GetPmsStudyReceiptBatchLotNo = {
        Url: BaseUrl + "PmsStudyProductReceipt/GetBatchLotNo",
        SuccessMethod: "SuccessMethod"
    }
    $.ajax({
        url: GetPmsStudyReceiptBatchLotNo.Url,
        type: 'GET',
        async: false,
        success: SuccessMethod,
        data: { id: setworkspaceid, projectno: nProductNo },
        error: function () {
            ValidationAlertBox("Batch/Lot/Lot not found.", "Product", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        if (jsonData.length > 0) {
            $("#ddlBatchLotNo").empty().append('<option selected="selected" value="0">Please Select Batch/Lot/Lot No</option>');
            for (var i = 0; i < jsonData.length; i++) {
                $("#ddlBatchLotNo").append($("<option></option>").val(jsonData[i].nStudyProductBatchNo).html(jsonData[i].vBatchLotNo));
            }
        }
        else {
            $("#ddlBatchLotNo").empty().append('<option selected="selected" value="0">Please Select Batch/Lot/Lot No</option>');
        }
    }

}

function GetProductType() {
    if (setworkspaceid != "") {
        var GetProductType = {
            Url: BaseUrl + "PmsGeneral/GetProductType/" + setworkspaceid,
            SuccessMethod: "SuccessMethod"
        }
        $.ajax({
            url: GetProductType.Url,
            type: 'GET',
            success: function (jsonData) {
                $("#DDLProductType").empty().append('<option selected="selected" value="0">Please Select Product Type</option>');
                for (var i = 0; i < jsonData.length; i++) {
                    $("#DDLProductType").append($("<option></option>").val(jsonData[i].nProductTypeID).html(jsonData[i].vProductType));
                }
            },
            error: function () {
                SuccessorErrorMessageAlertBox("Product Type not found.", ModuleName);
            }
        });
    }
}

function CheckSetProject() {
    var PassData = {
        iUserId: $("#hdnuserid").val()
    }
    var UrlDetails =
    {
        Url: BaseUrl + "PmsGeneral/GetSetProjectDetails/" + $("#hdnuserid").val(),
        SuccessMethod: "SuccessMethod"
    }
    GetProjectDetails(UrlDetails.Url, UrlDetails.SuccessMethod, PassData);
}

var GetProjectDetails = function (Url, SuccessMethod, PassData) {
    $.ajax({
        url: Url,
        type: 'GET',
        async: false,
        success: function (jsonData) {
            if (jsonData.length > 0) {
                $('#DDLProjectNo').val(jsonData[0].vProjectNo);
                setworkspaceid = jsonData[0].vWorkSpaceId;
            }
            else {
                $('#DDLProjectNo').val('');
            }
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Product not found.", ModuleName);
        }
    });
}

function QualityCheck() {
    var flag = true;
    if (productIds[$('#DDLProjectNo').val()] != undefined) {
        setworkspaceid = productIds[$('#DDLProjectNo').val()];
    }
    var QuantityCheck = {
        vWorkSpaceId: setworkspaceid,
        vProductNo: $("#DDLProduct").val(),
        nStudyProductBatchNo: $("#ddlBatchLotNo").val(),
        vRefModule: "PD",
    }

    var GetPmsQuntitytyCheckProductName = {
        Url: BaseUrl + "PmsGeneral/QtyDetail",
        SuccessMethod: "SuccessMethod",
        Data: QuantityCheck
    }
    if (QuntityCheckMaster(GetPmsQuntitytyCheckProductName.Url, GetPmsQuntitytyCheckProductName.SuccessMethod, GetPmsQuntitytyCheckProductName.Data) == false) {
        flag = false;
    }
    return flag;
}

function GetViewMode() {
    var ViewModeIDWebConfig = $("#hdnViewModeID").val().split(",");
    for (i = 0; i < ViewModeIDWebConfig.length; i++) {
        if ($("#hdnUserTypeCode").val().trim() == ViewModeIDWebConfig[i]) {
            $('#txtBarcode').prop('disabled', true);
            viewmode = "OnlyView";
            break;
        }
        else {
            viewmode = "";
        }
    }
}

$("#btnSaveRemarks").on("click", function () {
    if ($('#txtRemarks').val().trim() == "") {
        ValidationAlertBox("Please enter Remarks.", "txtRemarks", ModuleName);
        return false;
    }
    else {
        if (QualityCheck() == false) {
            $('#txtRemarks').val('');
            return false;
        }

        if ($('#txtBarcode').val() == 0) {
            return false;
        }
        SaveDispenceDetail();
        $("#txtBarcode").val('');
        $('#txtRemarks').val('');
        $('#btnCloseRemarks').click();
    }
});

function ReDespinsingData(e) {
    document.getElementById("lblReDispensingQty").innerText = e.attributes.qty.value;
    $("#txtDispenseQty").val(e.attributes.qty.value);
    $('#txtBarcode').val(e.attributes.barcode.value)
    $('#txtRemarks').val('');
}

function GetDispenseAuthorizationForBlindedStudy() {
    var result = true;
    var Data = {
        vWorkSpaceID: setworkspaceid,
        vUserTypeCode: $("#hdnUserTypeCode").val()
    }

    $.ajax({
        url: BaseUrl + "PmsProductDispense/DispenseAuthorizationforBlindedStudy",
        type: 'POST',
        data: Data,
        async: false,
        success: function (response) {
            if (response[0].Column1 == "0") {
                SuccessorErrorMessageAlertBox("You have not rights to access this functionality.", ModuleName);
                $("#DDLProjectNo").val("");
            }
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Data not found for blinded study.", ModuleName);
        }
    });
}


$("#btnGo").click(function () {
    ExportToPDF();
    if (productIds[$('#DDLProjectNo').val()] != undefined) {
        setworkspaceid = productIds[$('#DDLProjectNo').val()];
    }
    if (ValidateForm()) {
        if (tab == true) {
            $('#collapse').collapse('hide');
            $('#collapseOne').collapse('show');
            $('#collapseTwo').collapse('hide');
            // $('#collapseThree').collapse('hide');
            $('#collapseFour').collapse('hide');
        }

        var FilterData = {
            vWorkSpaceId: setworkspaceid,
            nProductTypeID: $("#DDLProductType").val(),
            nProductNo: $("#DDLProduct").val(),
            nBatchNo: $("#ddlBatchLotNo :selected").val(),
            iPeriod: $("#DDLPeriod :selected").text(),
            vActivityId: $("#DDLActivity").val(),
            iDoseNo: $("#DDLDosingDay :selected").text(),
            iDayNo: $("#DDLDosingNo :selected").text(),
            Mode: "ACCOUNTABILITY"


        }

        var GetLineClearanceData = {
            Url: BaseUrl + "PmsLineClearance/LineClearanceData",
            SuccessMethod: "SuccessMethod",
            Data: FilterData
        }
        GetAllLineClearance(GetLineClearanceData.Url, GetLineClearanceData.SuccessMethod, GetLineClearanceData.Data);



    }
});

var GetAllLineClearance = function (Url, SuccessMethod, Data) {
    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Dispense Detail not found.", ModuleName);
        }
    });
    function SuccessMethod(jsonData) {

        var ActivityDataset = [];
        var label = [];
        var $ddlProductType = "";
        var $txtQty = "";
        var $txtLabel = "";
        var $chkEdit = "";
        var $btnDelete = "";
        var tableid = "";
        var divid = "";
        var review = "";
        UserTypeCode = $("#hdnUserTypeCode").val();

        if ($('#collapseOne').attr('aria-expanded') == "true") {
            var ActivityDataset = [];

            for (var i = 0; i < jsonData.Accordian1.length; i++) {
                var InDataset = [];
                if (jsonData.Accordian1[i].cIsQAReview == 'Y') {
                    review = 'Approve'
                }
                else if (jsonData.Accordian1[i].cIsQAReview == 'R') {
                    review = 'Reject'
                }
                else if (jsonData.Accordian1[i].cIsQAReview == 'N') {
                    review = 'Pending'
                }

                $radioYes = '<input class="radio" type="radio" name=radio_' + [i + 1] + ' id=chkYes_' + [1] + [i + 1] + ' value="Yes"/>';
                $radioNo = '<input class="radio" type="radio" name=radio_' + [i + 1] + ' id=chkNo_' + [1] + [i + 1] + ' value="No"/>';

                InDataset.push(i + 1, jsonData.Accordian1[i].vCheckPoints, $radioYes, $radioNo, jsonData.Accordian1[i].vUserName, jsonData.Accordian1[i].dModifyOn, review, '', '', jsonData.Accordian1[i].nLineClearanceDtlNo, jsonData.Accordian1[i].cIsYesNo, jsonData.Accordian1[i].cIsQAReview, jsonData.Accordian1[i].vWorkSpaceId, jsonData.Accordian1[i].nProductNo, jsonData.Accordian1[i].nProductTypeID, jsonData.Accordian1[i].nStudyProductBatchNo, jsonData.Accordian1[i].iPeriod);
                ActivityDataset.push(InDataset);

            }
            tableid = "tblPmsLineClearance1";
            divid = "LineClearance1"

        }
        else if ($('#collapseTwo').attr('aria-expanded') == "true") {
            var ActivityDataset = [];

            for (var i = 0; i < jsonData.Accordian2.length ; i++) {
                if (jsonData.Accordian2[i].cIsQAReview == 'Y') {
                    review = 'Approve'
                }
                else if (jsonData.Accordian2[i].cIsQAReview == 'R') {
                    review = 'Reject'
                }
                else if (jsonData.Accordian2[i].cIsQAReview == 'N') {
                    review = 'Pending'
                }

                var InDataset = [];
                $radioYes = '<input class="radio" type="radio" name=radio_' + [i + 1] + ' id=chkYes_' + [2] + [i + 1] + ' value="Yes"/>';
                $radioNo = '<input class="radio" type="radio" name=radio_' + [i + 1] + ' id=chkNo_' + [2] + [i + 1] + ' value="No"/>';

                InDataset.push(i + 1, jsonData.Accordian2[i].vCheckPoints, $radioYes, $radioNo, jsonData.Accordian2[i].vUserName, jsonData.Accordian2[i].dModifyOn, review, '', '', jsonData.Accordian2[i].nLineClearanceDtlNo, jsonData.Accordian2[i].cIsYesNo, jsonData.Accordian2[i].cIsQAReview, jsonData.Accordian2[i].vWorkSpaceId, jsonData.Accordian2[i].nProductNo, jsonData.Accordian2[i].nProductTypeID, jsonData.Accordian2[i].nStudyProductBatchNo, jsonData.Accordian2[i].iPeriod);
                ActivityDataset.push(InDataset);

            }
            tableid = "tblPmsLineClearance2";
            divid = "LineClearance2";
        }

            //else if ($('#collapseThree').attr('aria-expanded') == "true") {
            //    var ActivityDataset = [];

            //    for (var i = 0; i < jsonData.Accordian3.length ; i++) {
            //        var InDataset = [];
            //        if (jsonData.Accordian3[i].cIsQAReview == 'Y') {
            //            review = 'Approve'
            //        }
            //        else if (jsonData.Accordian3[i].cIsQAReview == 'R') {
            //            review = 'Reject'
            //        }
            //        else if (jsonData.Accordian3[i].cIsQAReview == 'N') {
            //            review = 'Pending'
            //        }

            //        $radioYes = '<input class="radio" type="radio" name=radio_' + [i + 1] + ' id=chkYes_' + [3] + [i + 1] + ' value="Yes"/>';
            //        $radioNo = '<input class="radio" type="radio" name=radio_' + [i + 1] + ' id=chkNo_' + [3] + [i + 1] + ' value="No"/>';

            //        InDataset.push(i + 1, jsonData.Accordian3[i].vCheckPoints, $radioYes, $radioNo, jsonData.Accordian3[i].vUserName, jsonData.Accordian3[i].dModifyOn, review,'', '', jsonData.Accordian3[i].nLineClearanceDtlNo, jsonData.Accordian3[i].cIsYesNo, jsonData.Accordian3[i].cIsQAReview, jsonData.Accordian3[i].vWorkSpaceId, jsonData.Accordian3[i].nProductNo, jsonData.Accordian3[i].nProductTypeID, jsonData.Accordian3[i].nStudyProductBatchNo, jsonData.Accordian3[i].iPeriod);
            //        ActivityDataset.push(InDataset);

            //    }
            //    tableid = "tblPmsLineClearance3";
            //    divid = "LineClearance3";
            //}

        else if ($('#collapseFour').attr('aria-expanded') == "true") {
            var ActivityDataset = [];

            for (var i = 0; i < jsonData.Accordian4.length  ; i++) {
                var InDataset = [];
                if (jsonData.Accordian4[i].cIsQAReview == 'Y') {
                    review = 'Approve'
                }
                else if (jsonData.Accordian4[i].cIsQAReview == 'R') {
                    review = 'Reject'
                }
                else if (jsonData.Accordian4[i].cIsQAReview == 'N') {
                    review = 'Pending'
                }

                $radioYes = '<input class="radio" type="radio" name=radio_' + [i + 1] + ' id=chkYes_' + [4] + [i + 1] + ' value="Yes"/>';
                $radioNo = '<input class="radio" type="radio" name=radio_' + [i + 1] + ' id=chkNo_' + [4] + [i + 1] + ' value="No"/>';

                InDataset.push(i + 1, jsonData.Accordian4[i].vCheckPoints, $radioYes, $radioNo, jsonData.Accordian4[i].vUserName, jsonData.Accordian4[i].dModifyOn, review, '', '', jsonData.Accordian4[i].nLineClearanceDtlNo, jsonData.Accordian4[i].cIsYesNo, jsonData.Accordian4[i].cIsQAReview, jsonData.Accordian4[i].vWorkSpaceId, jsonData.Accordian4[i].nProductNo, jsonData.Accordian4[i].nProductTypeID, jsonData.Accordian4[i].nStudyProductBatchNo, jsonData.Accordian4[i].iPeriod);
                ActivityDataset.push(InDataset);

            }
            tableid = "tblPmsLineClearance4";
            divid = "LineClearance4";
        }

        document.getElementById(divid).style.visibility = "visible";
        document.getElementById(tableid).style.visibility = "visible";

        otableProjectWiseAuditTrail = $('#' + tableid).dataTable({
            "bJQueryUI": true,
            "sPaginationType": "full_numbers",
            "bLengthChange": true,
            "iDisplayLength": 10,
            "bProcessing": true,
            "bSort": true,
            "aaData": ActivityDataset,
            "aaSorting": [],
            "bInfo": true,
            "bAutoWidth": false,
            "bDestroy": true,
            "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                debugger;
                if (aData[12] == setworkspaceid && aData[13] == $("#DDLProduct :selected").val() && aData[14] == $("#DDLProductType :selected").val() && aData[15] == $("#ddlBatchLotNo :selected").val() && aData[16] == $("#DDLPeriod :selected").text()) {
                    if (aData[10] == "Yes") {

                        $(nRow).find('input[name="radio_' + (iDisplayIndex + 1) + '"][value="' + aData[10] + '"]').prop('checked', true);
                        //$(nRow).find('input[name="radio_' + (iDisplayIndex + 1) + '"][value="' + aData[7] + '"]').attr('disabled', true);
                    }
                    else if (aData[10] == "No") {
                        $(nRow).find('input[name="radio_' + (iDisplayIndex + 1) + '"][value="' + aData[10] + '"]').prop('checked', true);
                        //$(nRow).find('input[name="radio_' + (iDisplayIndex + 1) + '"][value="' + aData[7] + '"]').attr('disabled', true);
                    }

                    if (aData[10] == "undefined") {
                        $(nRow).find('input[name="radio_' + (iDisplayIndex + 1) + '"][value="Yes"]').attr('disabled', false);
                        $(nRow).find('input[name="radio_' + (iDisplayIndex + 1) + '"][value="No"]').attr('disabled', false);
                        $("#btnPmsSave1").show();
                        $("#btnPmsSave2").show();
                        $("#btnPmsSave3").show();
                        $("#btnPmsSave4").show();
                    }


                    if (aData[11] == 'Y') {
                        $("#btnPmsSave1").hide();
                        $("#btnPmsSave2").hide();
                        $("#btnPmsSave3").hide();
                        $("#btnPmsSave4").hide();
                        $(nRow).find('input[name="radio_' + (iDisplayIndex + 1) + '"][value="Yes"]').attr('disabled', true);
                        $(nRow).find('input[name="radio_' + (iDisplayIndex + 1) + '"][value="No"]').attr('disabled', true);
                        $("#btnQA1").hide();
                        $("#btnQA2").hide();
                        $("#btnQA3").hide();
                        $("#btnQA4").hide();


                    }
                    else if (aData[11] == 'R') {
                        $("#btnPmsSave1").hide();
                        $("#btnPmsSave2").hide();
                        $("#btnPmsSave3").hide();
                        $("#btnPmsSave4").hide();
                        $(nRow).find('input[name="radio_' + (iDisplayIndex + 1) + '"][value="Yes"]').attr('disabled', true);
                        $(nRow).find('input[name="radio_' + (iDisplayIndex + 1) + '"][value="No"]').attr('disabled', true);
                        $("#btnQA1").hide();
                        $("#btnQA2").hide();
                        $("#btnQA3").hide();
                        $("#btnQA4").hide();

                    }
                    else if (aData[11] == 'N') {

                        $("#btnQA1").show();
                        $("#btnQA2").show();
                        $("#btnQA3").show();
                        $("#btnQA4").show();

                        if (aData[9] != "undefined") {
                            $(nRow).find('input[name="radio_' + (iDisplayIndex + 1) + '"][value="Yes"]').attr('disabled', true);
                            $(nRow).find('input[name="radio_' + (iDisplayIndex + 1) + '"][value="No"]').attr('disabled', true);
                            $("#btnPmsSave1").hide();
                            $("#btnPmsSave2").hide();
                            $("#btnPmsSave3").hide();
                            $("#btnPmsSave4").hide();
                        }
                    }

                }
                else {
                    $("#btnQA1").show();
                    $("#btnQA2").show();
                    $("#btnQA3").show();
                    $("#btnQA4").show();
                    $("#btnPmsSave1").show();
                    $("#btnPmsSave2").show();
                    $("#btnPmsSave3").show();
                    $("#btnPmsSave4").show();
                }

            },
            "fnCreatedRow": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                //if (aData[11] == "Y") {
                //    $(nRow).addClass('highlightPendingQA');
                //}
                //if (aData[11] == "R") {
                //    $(nRow).addClass('highlightRejectedQA');
                //}


                $('td:eq(8)', nRow).append('<a data-toggle="modal" data-tooltip="tooltip" title="Audit"  Onclick= GetAuditTrail(this); nLineClearanceDtlNo="' + aData[9] + '" style="cursor:pointer;"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-clipboard"></i><span>Audit</span></a>');

                if ($("#hdnUserProfile").val().includes(UserTypeCode)) {
                    $('td:eq(7)', nRow).append('<a data-toggle="modal" data-tooltip="tooltip" title="Edit" style="cursor:pointer;"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a>');
                }
                else {
                    $('td:eq(7)', nRow).append('<a data-toggle="modal" data-tooltip="tooltip" title="Edit"  Onclick= EditData(this);  nLineClearanceDtlNo="' + aData[9] + '" style="cursor:pointer;"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a>');
                }
            },

            "aoColumns": [
               { "sTitle": "Sr. No" },
               { "sTitle": "Check Points" },
               { "sTitle": "Yes" },
               { "sTitle": "No" },
               { "sTitle": "Modify By" },
               { "sTitle": "Modify On" },
               { "sTitle": "Review" },
               { "sTitle": "Edit" },
                { "sTitle": "Audit" },
            ],

            "columnDefs": [
                { "width": "2%", "targets": 0 },
                { "width": "15%", "targets": 1 },
                { "width": "2%", "targets": 2 },
                { "width": "2%", "targets": 3 },
                { "width": "2%", "targets": 4 },
                { "width": "2%", "targets": 5 },
                { "width": "2%", "targets": 6 },
                { "width": "2%", "targets": 7 },
                { "width": "2%", "targets": 8 },

                {
                    "targets": [9, 10, 11, 12, 13, 14, 15, 16],
                    "visible": false,
                },
                  {
                      "targets": [9, 10, 11, 12, 13, 14, 15, 16],
                      render: function (data, type, row) {
                          return data == null ? '' : data
                      }
                  },



            ],
            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },
        });

        if ($("#hdnUserProfile").val().includes(UserTypeCode)) {
            var table = $('#' + tableid).DataTable();
            table.column(7).visible(false);

        }
        else {
            var table = $('#' + tableid).DataTable();

            table.column(7).visible(true);

        }
        var table = $('#' + tableid).DataTable();
        table.column(6).visible(false);
    }
}


function saveDetails() {
    debugger;
    var data = [];
    var datalist = {};
    var $cIsYEsNo = "";

    if ($('#collapseOne').attr('aria-expanded') == "true") {
        var acc1 = $("#tblPmsLineClearance1").dataTable().fnGetData();

        for (var i = 0; i < acc1.length; i++) {
            $cIsYEsNo = "";
            //if ($("input[id='chkYes_" + [1] + [i + 1] + "' ]").is(':enabled')) {
            if ($("#tblPmsLineClearance1 input[name='radio_" + (i + 1) + "']:checked").val() == "Yes") {
                //if ($("input[id='chkYes_" + [1] + [i + 1] + "' ]").is(':enabled')) {
                $cIsYEsNo = 'Y'
                //}
                //else {
                //    continue;
                //}
            }
            else if ($("#tblPmsLineClearance1 input[name='radio_" + (i + 1) + "']:checked").val() == "No") {
                //if ($("input[id='chkNo_" + [1] + [i + 1] + "' ]").is(':enabled')) {
                $cIsYEsNo = 'N'
                //}
                //else {
                //    continue;
                //}
            }
            else if ($("#tblPmsLineClearance1 input[name='radio_" + (i + 1) + "']:checked").val() == undefined) {
                //if ($("input[id='chkYes_" + [1] + [i + 1] + "' ]").is(':enabled')) {
                $cIsYEsNo = 'U'
                //}
                //else {
                //    continue;
                //}
            }

            //if ($cIsYEsNo != "") {
            datalist = {
                nLineClearanceDtlNo: acc1[i][9],
                cIsYesNo: $cIsYEsNo
            }
            data.push(datalist)
            //}
        }
    }


    else if ($('#collapseTwo').attr('aria-expanded') == "true") {
        var acc1 = $("#tblPmsLineClearance2").dataTable().fnGetData();

        for (var i = 0; i < acc1.length; i++) {
            $cIsYEsNo = "";
            if ($("#tblPmsLineClearance2 input[name='radio_" + (i + 1) + "']:checked").val() == "Yes") {
                //if ($("input[id='chkYes_" + [2] + [i + 1] + "' ]").is(':enabled')) {
                $cIsYEsNo = 'Y'
                //}
            }
            else if ($("#tblPmsLineClearance2 input[name='radio_" + (i + 1) + "']:checked").val() == "No") {
                //if ($("input[id='chkNo_" + [2] + [i + 1] + "' ]").is(':enabled')) {
                $cIsYEsNo = 'N'
                //}
            }
            else if ($("#tblPmsLineClearance2 input[name='radio_" + (i + 1) + "']:checked").val() == undefined) {
                //if ($("input[id='chkYes_" + [2] + [i + 1] + "' ]").is(':enabled')) {
                $cIsYEsNo = 'U'
                //}
            }

            //if ($cIsYEsNo != "") {
            datalist = {
                nLineClearanceDtlNo: acc1[i][9],
                cIsYesNo: $cIsYEsNo
            }
            data.push(datalist)
            //}

        }
    }

        //else if ($('#collapseThree').attr('aria-expanded') == "true") {
        //    var acc1 = $("#tblPmsLineClearance3").dataTable().fnGetData();

        //    for (var i = 0; i < acc1.length; i++) {
        //        $cIsYEsNo = "";
        //        if ($("#tblPmsLineClearance3 input[name='radio_" + (i + 1) + "']:checked").val() == "Yes") {
        //            //if ($("input[id='chkYes_" + [3] + [i + 1] + "' ]").is(':enabled')) {
        //                $cIsYEsNo = 'Y'
        //            //}
        //        }
        //        else if ($("#tblPmsLineClearance3 input[name='radio_" + (i + 1) + "']:checked").val() == "No") {
        //            //if ($("input[id='chkNo_" + [3] + [i + 1] + "' ]").is(':enabled')) {
        //                $cIsYEsNo = 'N'
        //            //}
        //        }
        //        else if ($("#tblPmsLineClearance3 input[name='radio_" + (i + 1) + "']:checked").val() == undefined) {
        //            //if ($("input[id='chkYes_" + [3] + [i + 1] + "' ]").is(':enabled')) {
        //                $cIsYEsNo = 'U'
        //            //}
        //        }

        //        //if ($cIsYEsNo != "") {
        //            datalist = {
        //                nLineClearanceDtlNo: acc1[i][9],
        //                cIsYesNo: $cIsYEsNo
        //            }
        //            data.push(datalist)
        //        //}
        //    }
        //}

    else if ($('#collapseFour').attr('aria-expanded') == "true") {
        var acc1 = $("#tblPmsLineClearance4").dataTable().fnGetData();

        for (var i = 0; i < acc1.length; i++) {
            $cIsYEsNo = "";
            if ($("#tblPmsLineClearance4 input[name='radio_" + (i + 1) + "']:checked").val() == "Yes") {
                //if ($("input[id='chkYes_" + [4] + [i + 1] + "' ]").is(':enabled')) {
                $cIsYEsNo = 'Y'
                //}
            }
            else if ($("#tblPmsLineClearance4 input[name='radio_" + (i + 1) + "']:checked").val() == "No") {
                //if ($("input[id='chkNo_" + [4] + [i + 1] + "' ]").is(':enabled')) {
                $cIsYEsNo = 'N'
                //}
            }
            else if ($("#tblPmsLineClearance4 input[name='radio_" + (i + 1) + "']:checked").val() == undefined) {
                //if ($("input[id='chkYes_" + [4] + [i + 1] + "' ]").is(':enabled')) {
                $cIsYEsNo = 'U'
                //}
            }

            //if ($cIsYEsNo != "") {
            datalist = {
                nLineClearanceDtlNo: acc1[i][9],
                cIsYesNo: $cIsYEsNo
            }
            data.push(datalist)
            //}
        }
    }



    var Data = {
        vWorkSpaceId: setworkspaceid,
        iPeriod: $("#DDLPeriod :selected").text(),
        nProductTypeID: $("#DDLProductType :selected").val(),
        nProductNo: $("#DDLProduct :selected").val(),
        nBatchNo: $("#ddlBatchLotNo :selected").val(),
        vActivityId: $("#DDLActivity :selected").val(),
        iDayNo: $("#DDLDosingDay :selected").text(),
        iDoseNo: $("#DDLDosingNo :selected").text(),
        vData: JSON.stringify(data),
        iModifyBy: $("#hdnuserid").val()
    }

    var GetSaveLineClearance = {
        Url: BaseUrl + "PmsLineClearance/InsertPmsLineClearance",
        SuccessMethod: "SuccessMethod",
        Data: Data
    }
    GetSaveLineClearanceData(GetSaveLineClearance.Url, GetSaveLineClearance.SuccessMethod, GetSaveLineClearance.Data);

}

var GetSaveLineClearanceData = function (Url, SuccessMethod, Data) {
    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Line Clearance not found.", ModuleName);
        }
    });
    function SuccessMethod(jsonData) {
        debugger;
        if (jsonData == "success") {
            $('#collapse').collapse('show');
            $('#collapseOne').collapse('hide');
            $('#collapseTwo').collapse('hide');
            // $('#collapseThree').collapse('hide');
            $('#collapseFour').collapse('hide');
            SuccessorErrorMessageAlertBox("Line Clearance saved successfully.", ModuleName);
            //$('#collapseOne').accordion("refresh");

        }
    }
}


$("#btnOk").click(function () {
    debugger;
    var data = [];
    var datalist = {};
    var pwd = "";
    var $cIsYEsNo = "";
    pwd = $("#txtPassword").val();
    var username = $("#hdn").val();
    if (isBlank(document.getElementById('txtRemarks').value)) {
        ValidationAlertBox("Please enter Remarks.", "txtRemarks", ModuleName);
        return false
    }
    else if (isBlank(document.getElementById('txtPassword').value)) {
        ValidationAlertBox("Please enter Password.", "txtPassword", ModuleName);
        return false
    }

    if ($('#collapseOne').attr('aria-expanded') == "true") {
        var acc1 = $("#tblPmsLineClearance1").dataTable().fnGetData();

        for (var i = 0; i < acc1.length; i++) {
            $cIsYEsNo = "";
            if ($("input[name='radio_" + (i + 1) + "']:checked").val() == "Yes") {
                $cIsYEsNo = 'Y'
            }
            else if ($("input[name='radio_" + (i + 1) + "']:checked").val() == "No") {
                $cIsYEsNo = 'N'
            }
            else if ($("input[name='radio_" + (i + 1) + "']:checked").val() == undefined) {
                $cIsYEsNo = 'U'
            }

            datalist = {
                nLineClearanceDtlNo: acc1[i][9],
                cIsYesNo: $cIsYEsNo
            }
            data.push(datalist)
        }
    }
    else if ($('#collapseTwo').attr('aria-expanded') == "true") {
        var acc1 = $("#tblPmsLineClearance2").dataTable().fnGetData();

        for (var i = 0; i < acc1.length; i++) {
            $cIsYEsNo = "";
            if ($("input[name='radio_" + (i + 1) + "']:checked").val() == "Yes") {
                $cIsYEsNo = 'Y'
            }
            else if ($("input[name='radio_" + (i + 1) + "']:checked").val() == "No") {
                $cIsYEsNo = 'N'
            }
            else if ($("input[name='radio_" + (i + 1) + "']:checked").val() == undefined) {
                $cIsYEsNo = 'U'
            }

            datalist = {
                nLineClearanceDtlNo: acc1[i][9],
                cIsYesNo: $cIsYEsNo
            }
            data.push(datalist)
        }
    }
        //else if ($('#collapseThree').attr('aria-expanded') == "true") {
        //    var acc1 = $("#tblPmsLineClearance3").dataTable().fnGetData();

        //    for (var i = 0; i < acc1.length; i++) {
        //        $cIsYEsNo = "";
        //        if ($("input[name='radio_" + (i + 1) + "']:checked").val() == "Yes") {
        //            $cIsYEsNo = 'Y'
        //        }
        //        else if ($("input[name='radio_" + (i + 1) + "']:checked").val() == "No") {
        //            $cIsYEsNo = 'N'
        //        }
        //        else if ($("input[name='radio_" + (i + 1) + "']:checked").val() == undefined) {
        //            $cIsYEsNo = 'U'
        //        }

        //        datalist = {
        //            nLineClearanceDtlNo: acc1[i][9],
        //            cIsYesNo: $cIsYEsNo
        //        }
        //        data.push(datalist)
        //    }
        //}
    else if ($('#collapseFour').attr('aria-expanded') == "true") {
        var acc1 = $("#tblPmsLineClearance4").dataTable().fnGetData();

        for (var i = 0; i < acc1.length; i++) {
            $cIsYEsNo = "";
            if ($("input[name='radio_" + (i + 1) + "']:checked").val() == "Yes") {
                $cIsYEsNo = 'Y'
            }
            else if ($("input[name='radio_" + (i + 1) + "']:checked").val() == "No") {
                $cIsYEsNo = 'N'
            }
            else if ($("input[name='radio_" + (i + 1) + "']:checked").val() == undefined) {
                $cIsYEsNo = 'U'
            }

            datalist = {
                nLineClearanceDtlNo: acc1[i][9],
                cIsYesNo: $cIsYEsNo
            }
            data.push(datalist)
        }
    }

    var data = {
        Password: pwd,
        iModifyBy: $("#hdnuserid").val(),
        vRemarks: $("#txtRemarks").val(),
        vData: JSON.stringify(data),
        sessionPass: $("#hdnPassword").val(),
        cIsQAReview: 'Y',
        vWorkSpaceId: setworkspaceid,
        nProductTypeID: $("#DDLProductType").val(),
        nProductNo: $("#DDLProduct").val(),
        nBatchNo: $("#ddlBatchLotNo :selected").val(),
        iPeriod: $("#DDLPeriod :selected").text(),
        vActivityId: $("#DDLActivity").val(),
        iDoseNo: $("#DDLDosingDay :selected").text(),
        iDayNo: $("#DDLDosingNo :selected").text(),

    }


    var GetAuthenticate = {
        Url: BaseUrl + "PmsLineClearance/InsertPmsLineClearanceForQA",
        SuccessMethod: "SuccessMethod",
        Data: data
    }
    GetAuthenticateData(GetAuthenticate.Url, GetAuthenticate.SuccessMethod, GetAuthenticate.Data);


});

var GetAuthenticateData = function (Url, SuccessMethod, Data) {
    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Authenticaion not found.", ModuleName);
        }
    });
    function SuccessMethod(jsonData) {
        debugger;
        if (jsonData == "success") {
            $("#ViewAuthenticate").hide();
            $("#txtRemarks").val('');
            $("#txtPassword").val('');
            $('#collapse').collapse('show');
            $('#collapseOne').collapse('hide');
            $('#collapseTwo').collapse('hide');
            //$('#collapseThree').collapse('hide');
            $('#collapseFour').collapse('hide');
            SuccessorErrorMessageAlertBox("Line Clearance reviewed successfully.", ModuleName);
        }
        else if (jsonData == "error") {
            $("#ViewAuthenticate").show();
            ValidationAlertBox("Password Authentication fails.", "txtPassword", ModuleName);
        }

    }
}

function EditData(e) {
    debugger;
    var nLineClearanceDtlNo = e.attributes.nLineClearanceDtlNo.value;
    if ($('#collapseOne').attr('aria-expanded') == "true") {
        var acc1 = $("#tblPmsLineClearance1").dataTable().fnGetData();

        if (acc1[0][11] == 'Y') {
            SuccessorErrorMessageAlertBox("QA review is done so data can not change.", ModuleName);
            return false;
        }
        if (acc1[0][11] == 'R') {
            SuccessorErrorMessageAlertBox("QA review is done so data can not change.", ModuleName);
            return false;
        }
        else {
            for (var i = 0; i < acc1.length; i++) {
                var data = $("#tblPmsLineClearance1").dataTable().fnGetData(i);
                if (data[9] == nLineClearanceDtlNo) {
                    $("#chkYes_" + [1] + [i + 1] + "").attr('disabled', false);
                    $("#chkNo_" + [1] + [i + 1] + "").attr('disabled', false);
                    $("#btnPmsSave1").show();
                }
                else {
                    continue;
                }
            }

        }
    }
    else if ($('#collapseTwo').attr('aria-expanded') == "true") {
        var acc1 = $("#tblPmsLineClearance2").dataTable().fnGetData();

        if (acc1[0][11] == 'Y') {
            SuccessorErrorMessageAlertBox("QA review is done so data can not change !", ModuleName);
            return false;
        }
        if (acc1[0][11] == 'R') {
            SuccessorErrorMessageAlertBox("QA review is done so data can not change.", ModuleName);
            return false;
        }
        else {
            for (var i = 0; i < acc1.length; i++) {
                var data = $("#tblPmsLineClearance2").dataTable().fnGetData(i);
                if (data[9] == nLineClearanceDtlNo) {
                    $("#chkYes_" + [2] + [i + 1] + "").attr('disabled', false);
                    $("#chkNo_" + [2] + [i + 1] + "").attr('disabled', false);
                    $("#btnPmsSave2").show();
                }
                else {
                    continue;
                }
            }

        }
    }
        //else if ($('#collapseThree').attr('aria-expanded') == "true") {
        //    var acc1 = $("#tblPmsLineClearance3").dataTable().fnGetData();

        //    if (acc1[0][11] == 'Y') {
        //        SuccessorErrorMessageAlertBox("QA review is done so data can not change !", ModuleName);
        //    }
        //    if (acc1[0][11] == 'R') {
        //        SuccessorErrorMessageAlertBox("QA review is done so data can not change.", ModuleName);
        //    }
        //    else {
        //        for (var i = 0; i < acc1.length; i++) {
        //            var data = $("#tblPmsLineClearance3").dataTable().fnGetData(i);
        //            if (data[9] == nLineClearanceDtlNo) {
        //                $("#chkYes_" + [3] + [i + 1] + "").attr('disabled', false);
        //                $("#chkNo_" + [3] + [i + 1] + "").attr('disabled', false);
        //                $("#btnPmsSave3").show();
        //            }
        //            else {
        //                continue;
        //            }
        //        }

        //    }
        //}
    else if ($('#collapseFour').attr('aria-expanded') == "true") {
        var acc1 = $("#tblPmsLineClearance4").dataTable().fnGetData();

        if (acc1[0][11] == 'Y') {
            SuccessorErrorMessageAlertBox("QA review is done so data can not change !", ModuleName);
            return false;
        }
        if (acc1[0][11] == 'R') {
            SuccessorErrorMessageAlertBox("QA review is done so data can not change.", ModuleName);
            return false;
        }
        else {
            for (var i = 0; i < acc1.length; i++) {
                var data = $("#tblPmsLineClearance4").dataTable().fnGetData(i);
                if (data[9] == nLineClearanceDtlNo) {
                    $("#chkYes_" + [4] + [i + 1] + "").attr('disabled', false);
                    $("#chkNo_" + [4] + [i + 1] + "").attr('disabled', false);
                    $("#btnPmsSave4").show();
                }
                else {
                    continue;
                }
            }

        }
    }
}

function GetAuditTrail(e) {
    debugger;
    var nLineClearanceDtlNo = e.attributes.nLineClearanceDtlNo.value;

    var Data = {
        nLineClearanceDtlNo: nLineClearanceDtlNo,
        vWorkSpaceId: setworkspaceid,
        nProductTypeID: $("#DDLProductType").val(),
        nProductNo: $("#DDLProduct").val(),
        nBatchNo: $("#ddlBatchLotNo :selected").val(),
        iPeriod: $("#DDLPeriod :selected").text(),
        vActivityId: $("#DDLActivity").val(),
        iDoseNo: $("#DDLDosingDay :selected").text(),
        iDayNo: $("#DDLDosingNo :selected").text()

    }

    var GetLineClearanceData = {
        Url: BaseUrl + "PmsLineClearance/LineClearanceAuditData",
        SuccessMethod: "SuccessMethod",
        Data: Data
    }
    GetAllLineClearanceAuditData(GetLineClearanceData.Url, GetLineClearanceData.SuccessMethod, GetLineClearanceData.Data);
}

var GetAllLineClearanceAuditData = function (Url, SuccessMethod, Data) {
    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Audit not found.", ModuleName);
        }
    });
    function SuccessMethod(jsonData) {
        debugger;
        var ActivityDataset = [];
        var operation = "";
        $('#mdlAuditTrail').modal('show');

        for (var i = 0; i < jsonData.length; i++) {

            var InDataset = [];
            if (jsonData[i].iQAReviewBy != null) {
                operation = "Review"
            }
            else {
                operation = jsonData[i].Operation
            }

            //InDataset.push(jsonData[i].vCheckPoints, jsonData[i].cIsYesNo, jsonData[i].vUserName, jsonData[i].dModifyOn, jsonData[i].iLineClearanceHstNo
            InDataset.push(jsonData[i].vCheckPoints, jsonData[i].cIsYesNo, jsonData[i].vUserName, jsonData[i].dModifyOn, operation, jsonData[i].iLineClearanceHstNo
                            );
            ActivityDataset.push(InDataset);
        }
        otable = $('#tblAuditTrail').dataTable({
            "bJQueryUI": true,
            "sPaginationType": "full_numbers",
            "bLengthChange": true,
            "bProcessing": true,
            "bSort": true,
            "autoWidth": false,
            "aaData": ActivityDataset,
            "bInfo": true,
            "bDestroy": true,
            "aaSorting": [],

            "aoColumns": [
                { "sTitle": "Check Points" },
                { "sTitle": "Value" },
                { "sTitle": "Modify By" },
                { "sTitle": "Modify On" },
                { "sTitle": "Operation" },

            ],
            "columnDefs": [
            { "width": "15%", "targets": 0 },
            { "width": "2%", "targets": 1 },
            { "width": "2%", "targets": 2 },
            { "width": "2%", "targets": 3 },
            { "width": "2%", "targets": 4 },
        {
            "targets": [5],
            "visible": false,
        }
            ],
            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },
        });


    }
}

function CloseAuthenticate() {
    debugger;
    $("#txtRemarks").val('');
    $("#txtPassword").val('');
    $('#ViewAuthenticate').modal('hide');
}


function QaReviewReject() {
    debugger;
    var data = [];
    var datalist = {};
    var pwd = "";
    var $cIsYEsNo = "";
    pwd = $("#txtPassword").val();
    var username = $("#hdn").val();
    if (isBlank(document.getElementById('txtRemarks').value)) {
        ValidationAlertBox("Please enter Remarks.", "txtRemarks", ModuleName);
        return false
    }
    else if (isBlank(document.getElementById('txtPassword').value)) {
        ValidationAlertBox("Please enter Password.", "txtPassword", ModuleName);
        return false
    }

    if ($('#collapseOne').attr('aria-expanded') == "true") {
        var acc1 = $("#tblPmsLineClearance1").dataTable().fnGetData();

        for (var i = 0; i < acc1.length; i++) {
            $cIsYEsNo = "";
            if ($("input[name='radio_" + (i + 1) + "']:checked").val() == "Yes") {
                $cIsYEsNo = 'Y'
            }
            else if ($("input[name='radio_" + (i + 1) + "']:checked").val() == "No") {
                $cIsYEsNo = 'N'
            }
            else if ($("input[name='radio_" + (i + 1) + "']:checked").val() == undefined) {
                $cIsYEsNo = 'U'
            }

            datalist = {
                nLineClearanceDtlNo: acc1[i][9],
                cIsYesNo: $cIsYEsNo
            }
            data.push(datalist)
        }
    }
    else if ($('#collapseTwo').attr('aria-expanded') == "true") {
        var acc1 = $("#tblPmsLineClearance2").dataTable().fnGetData();

        for (var i = 0; i < acc1.length; i++) {
            $cIsYEsNo = "";
            if ($("input[name='radio_" + (i + 1) + "']:checked").val() == "Yes") {
                $cIsYEsNo = 'Y'
            }
            else if ($("input[name='radio_" + (i + 1) + "']:checked").val() == "No") {
                $cIsYEsNo = 'N'
            }
            else if ($("input[name='radio_" + (i + 1) + "']:checked").val() == undefined) {
                $cIsYEsNo = 'U'
            }

            datalist = {
                nLineClearanceDtlNo: acc1[i][9],
                cIsYesNo: $cIsYEsNo
            }
            data.push(datalist)
        }
    }
        //else if ($('#collapseThree').attr('aria-expanded') == "true") {
        //    var acc1 = $("#tblPmsLineClearance3").dataTable().fnGetData();

        //    for (var i = 0; i < acc1.length; i++) {
        //        $cIsYEsNo = "";
        //        if ($("input[name='radio_" + (i + 1) + "']:checked").val() == "Yes") {
        //            $cIsYEsNo = 'Y'
        //        }
        //        else if ($("input[name='radio_" + (i + 1) + "']:checked").val() == "No") {
        //            $cIsYEsNo = 'N'
        //        }
        //        else if ($("input[name='radio_" + (i + 1) + "']:checked").val() == undefined) {
        //            $cIsYEsNo = 'U'
        //        }

        //        datalist = {
        //            nLineClearanceDtlNo: acc1[i][9],
        //            cIsYesNo: $cIsYEsNo
        //        }
        //        data.push(datalist)
        //    }
        //}
    else if ($('#collapseFour').attr('aria-expanded') == "true") {
        var acc1 = $("#tblPmsLineClearance4").dataTable().fnGetData();

        for (var i = 0; i < acc1.length; i++) {
            $cIsYEsNo = "";
            if ($("input[name='radio_" + (i + 1) + "']:checked").val() == "Yes") {
                $cIsYEsNo = 'Y'
            }
            else if ($("input[name='radio_" + (i + 1) + "']:checked").val() == "No") {
                $cIsYEsNo = 'N'
            }
            else if ($("input[name='radio_" + (i + 1) + "']:checked").val() == undefined) {
                $cIsYEsNo = 'U'
            }

            datalist = {
                nLineClearanceDtlNo: acc1[i][9],
                cIsYesNo: $cIsYEsNo
            }
            data.push(datalist)
        }
    }

    var data = {
        Password: pwd,
        iModifyBy: $("#hdnuserid").val(),
        vRemarks: $("#txtRemarks").val(),
        vData: JSON.stringify(data),
        sessionPass: $("#hdnPassword").val(),
        cIsQAReview: 'R',
        vWorkSpaceId: setworkspaceid,
        nProductTypeID: $("#DDLProductType").val(),
        nProductNo: $("#DDLProduct").val(),
        nBatchNo: $("#ddlBatchLotNo :selected").val(),
        iPeriod: $("#DDLPeriod :selected").text(),
        vActivityId: $("#DDLActivity").val(),
        iDoseNo: $("#DDLDosingDay :selected").text(),
        iDayNo: $("#DDLDosingNo :selected").text()
    }


    var GetAuthenticate = {
        Url: BaseUrl + "PmsLineClearance/InsertPmsLineClearanceForQA",
        SuccessMethod: "SuccessMethod",
        Data: data
    }
    InsertPmsProductDtlQAReject(GetAuthenticate.Url, GetAuthenticate.SuccessMethod, GetAuthenticate.Data);

}

var InsertPmsProductDtlQAReject = function (Url, SuccessMethod, Data) {
    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        //async: false,
        success: function (jsonData) {
            debugger;
            if (jsonData == "success") {
                $("#ViewAuthenticate").hide();
                $("#txtRemark").val('');
                $("#txtPassword").val('');
                $('#collapse').collapse('show');
                $('#collapseOne').collapse('hide');
                $('#collapseTwo').collapse('hide');
                //$('#collapseThree').collapse('hide');
                $('#collapseFour').collapse('hide');
                SuccessorErrorMessageAlertBox("Line Clearance rejected successfully.", ModuleName);
            }
            else if (jsonData == "error") {
                $("#ViewAuthenticate").show();
                ValidationAlertBox("Password Authentication Fails !", "txtPassword", ModuleName);
            }
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Data not found.", ModuleName);
        }
    });
}

function pmsStudyViewAuthenticate(e) {
    debugger;
    var a = e.id;
    var lastChar = a[a.length - 1];
    var row = $("#tblPmsLineClearance" + lastChar).dataTable().fnGetData();

    if (row[0][11] == "Y") {
        return;
    }
    else if (row[0][11] == 'R') {
        return;
    }
    else if (row[0][11] == 'N') {
        $('#ViewAuthenticate').modal('show');
    }

}