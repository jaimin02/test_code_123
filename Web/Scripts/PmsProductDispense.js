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
var ModuleName = "Product Dispense";
var tab = false;
var strBarcode = "";
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

    $('#collapseOne').collapse('show');

    $('#headingOne').on("click", function () {
        $('#collapseOne').collapse('show');
        $('#collapseTwo').collapse('hide');
    });

    $('#headingTwo').on("click", function () {
        $('#collapseOne').collapse('hide');
        $('#collapseTwo').collapse('show');
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
        $("#ddlBatchLotNo").val("0");
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

    //$('#btnExit').on("click", function () {
    //    document.getElementById('dispensedata').style.visibility = "hidden";
    //    document.getElementById('tblPmsProductDispenseData').style.visibility = "hidden";
    //    window.location.href = WebUrl + "PmsHome/Home";
    //});

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
        $("#btnGo").click();
    });

    $('#txtBarcode').on('change', function () {
        $("#loader").attr("style", "display:block");

        if ($('#divexport').css('display') == 'none') {
            alert("Dispense Data Not Found");
            $("#loader").attr("style", "display:none");
            return false;
        }
        else {

            var InsertPmsProductDispense = {
                vWorkSpaceId: setworkspaceid,
                nProductTypeID: $("#DDLProductType").val(),
                nProductNo: $("#DDLProduct").val(),
                nBatchNo: $("#ddlBatchLotNo").val(),
                iPeriod: $("#DDLPeriod :selected").text(),
                iDoseNo: $("#DDLDosingDay :selected").text(),
                iDayNo: $("#DDLDosingNo :selected").text(),
                vBarcode: $('#txtBarcode').val()
            }

            var bFound = false;

            var MyRows = $('table#tblPmsProductDispenseData').find('tbody').find('tr');
            for (var i = 0; i < MyRows.length; i++) {
                var barcode = $(MyRows[i]).find('td:eq(0)').html()
                var period = $(MyRows[i]).find('td:eq(2)').html()
                var product_type = $(MyRows[i]).find('td:eq(4)').html()
                var dose_no = $(MyRows[i]).find('td:eq(7)').html()
                var day_no = $(MyRows[i]).find('td:eq(8)').html()
                

                if (barcode == $('#txtBarcode').val() &&
                    //project_no == $("#DDLProjectNo :selected").text() &&
                    product_type == $("#DDLProductType :selected").text() &&
                    //batch == $("#ddlBatchLotNo :selected").text() &&
                    period == $("#DDLPeriod :selected").text() &&
                    day_no == $("#DDLDosingDay :selected").text() &&
                    dose_no == $("#DDLDosingNo :selected").text()) {
                    bFound = true;
                }
            }

            if (bFound == false) {
                $("#loader").attr("style", "display:none");
                SuccessorErrorMessageAlertBox("Incorrect Barcode.", ModuleName);
                return false;
            }
            var InsertProductDispenseData = {
                Url: BaseUrl + "PmsProductDispense/PmsProductDuringDispense",
                SuccessMethod: "SuccessMethod",
                Data: InsertPmsProductDispense
            }

            InsertPmsProductDuringDispense(InsertProductDispenseData.Url, InsertProductDispenseData.SuccessMethod, InsertProductDispenseData.Data);
             
        }
        $("#loader").attr("style", "display:none");
    });

    var InsertPmsProductDuringDispense = function (Url, SuccessMethod, Data) {
        $.ajax({
            url: Url,
            type: 'POST',
            async: false,
            data: Data,
            //async: false,
            success: function (jsonData) {
                debugger;
                if (jsonData.length > 0) {
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
                }
                else {
                    SuccessorErrorMessageAlertBox("QA/QC Review is pending.", ModuleName);
                }
            },
            error: function () {
                SuccessorErrorMessageAlertBox("Data not found.", ModuleName);
            }
        });
    }

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
                    $("#DDLDosingDay").empty().append('<option selected="selected" value="0">Please Select Dosing Day</option>');
                    $("#DDLDosingNo").empty().append('<option selected="selected" value="0">Please Select Dosing No</option>');
                    for (var i = 0; i < jsonData.length; i++) {
                        if (jsonData[i].iDoseNo == null || jsonData[i].iDayNo == null) {
                            jsonData[i].iNodeId = "";
                            jsonData[i].iDayNo = "";
                            $("#DDLDosingDay").empty().append('<option selected="selected" value="0">No Dosing Day Found</option>');
                            $("#DDLDosingNo").empty().append('<option selected="selected" value="0">No Dosing No Found</option>');
                        }
                        else {
                            $("#DDLDosingNo").append($("<option></option>").val(jsonData[i].iNodeId).html([jsonData[i].iDoseNo]));
                            $("#DDLDosingDay").append($("<option></option>").val(jsonData[i].iNodeId).html([jsonData[i].iDayNo]));
                        }
                    }
                }
                else {
                    $("#DDLDosingDay").empty().append('<option selected="selected" value="0">No Dosing Day Found</option>');
                    $("#DDLDosingNo").empty().append('<option selected="selected" value="0">No Dosing No Found</option>');
                }
            },
            error: function () {
                SuccessorErrorMessageAlertBox("Dosing details not found.", ModuleName);
            }
        });
    }

    $("#btnGo").on("click", function () {
        ExportToPDF();
        $("#txtBarcode").val('');
        if (productIds[$('#DDLProjectNo').val()] != undefined) {
            setworkspaceid = productIds[$('#DDLProjectNo').val()];
        }
        if (ValidateForm()) {
            if (tab == false) {
                $('#collapseOne').collapse('hide');
                $('#collapseTwo').collapse('show');
            }
            else {
                $('#collapseOne').collapse('show');
                $('#collapseTwo').collapse('hide');
            }

            document.getElementById('dispensedata').style.visibility = "visible";
            document.getElementById('tblPmsProductDispenseData').style.visibility = "visible";
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
            //changeBGClrOfRow();
        }
    });

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
            SuccessorErrorMessageAlertBox("Dispense detail not found.", ModuleName);
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
        var review = "";

        var ActivityDataset = [];
        UserTypeCode = $("#hdnUserTypeCode").val();

        for (var i = 0; i < jsonData.length; i++) {
            var $ctrl = '<input class="chk" type="checkbox" name="case" id="' + jsonData[i].vDosingBarCode + '" value="' + i + '" onchange="ChangeCheckBox(this);"  />'
            $("#hdnworkspaceid").css("visibility", "visible");
            var InDataset = [];
            var DispenseDoneBy = jsonData[i].vModifyBy + " / </br> " + jsonData[i].TransactionDate;
            if (DispenseDoneBy == "null / </br> null") {
                DispenseDoneBy = "";
            }
            if (jsonData[i].cIsQAReview == "Y") {
                review = "Approve";
            }
            if (jsonData[i].cIsQAReview == "N") {
                review = "Pending";
            }
            if (jsonData[i].cIsQAReview == "R") {
                review = "Reject";
            }

            InDataset.push($ctrl, jsonData[i].vWorkspaceId, jsonData[i].vDosingBarCode, jsonData[i].vProjectNo, jsonData[i].nProductNo, jsonData[i].nBatchNo,
                           jsonData[i].iPeriod, jsonData[i].vProtocolNo, jsonData[i].vProductType, jsonData[i].vMySubjectNo, jsonData[i].vSubjectId,
                           jsonData[i].iDoseNo, jsonData[i].iDayNo, jsonData[i].iDispenseQtyPerSubject, DispenseDoneBy,
                           jsonData[i].ReDespensingRemark, review, '', '', jsonData[i].nDosingDetailNo, i + 1, jsonData[i].cStatusindi, jsonData[i].iDosedBy, jsonData[i].cIsQAReview);
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
                //if (aData[22] == "Y") {
                //    $(nRow).addClass('highlightPendingQA');
                //}
                //if (aData[22] == "R") {
                //    $(nRow).addClass('highlightRejectedQA');
                //}

                if (aData[14] != "") {
                    $(nRow).addClass('highlightDispense');
                    $('#' + aData[1]).attr("checked", "true")
                }
                if (aData[21] == "D") {
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
                { "sTitle": "QA/QC Review" },
                {
                    "sTitle": "ReDispensing",
                    "render": function (data, type, full, meta) {
                        if (full[14] != "" && full[21] != "D" && full[22] == null) {
                            if ($("#hdnUserProfile").val().includes(UserTypeCode)) {
                                return '<img src="../Content/Images/ReDespensing.png" tooltip="ReDespensing" style="width:32px;height:32px;" data-toggle="modal" "/>  ';
                            }
                            else {
                                return '<img src="../Content/Images/ReDespensing.png" tooltip="ReDespensing" style="width:32px;height:32px;" onclick="ReDespinsingData(this)" data-toggle="modal" data-target="#RemarksModal"  workspaceid="' + full[1] + '"  qty="' + full[12] + '" barcode="' + full[2] + '" "/>  ';
                            }
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
                "targets": [0, 1, 4, 5, 19, 20, 21, 22, 23],
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
                { "width": "0.1%", "targets": 17 },
                { "width": "0.1%", "targets": 18 },

            ],
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
                if (response == "Product Receipt saved successfully.") {
                    $("#txtDispenseQty").val("");
                    $("#txtBarcode").val("");
                    $("#txtbarcode").val("");
                    $("#txtprojectno").val("");
                    $("#txtPeriod").val("");
                    $("#txtSubjectNo").val("");
                    $("#txtDoseNo").val("");
                    $("#txtDayNo").val("");
                    SuccessorErrorMessageAlertBox("Product dispensed successfully.", ModuleName);
                    UpdateGrid();
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
        ValidationAlertBox("Please select Dosing day.", "DDLDosingDay", ModuleName);
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
                       { "sTitle": "Current Stock" },
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
                ValidationAlertBox("Current Stock is " + response + " !", "txtDispenseQty", ModuleName);
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
                    SuccessorErrorMessageAlertBox("Product for this Subject already deleted.", ModuleName);
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
                    SuccessorErrorMessageAlertBox("Product for this Subject already dispensed.", ModuleName);
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
        ValidationAlertBox("Invalid Barcode length.", "txtBarcode", ModuleName);
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
    $("#txtOuterBarcode").val('');
    $('#DDLProjectNo').val('');

    if ($.fn.DataTable.isDataTable('#tblPmsProductDispenseData')) {
        $('#tblPmsProductDispenseData').DataTable().destroy();
    }
    $('#tblPmsProductDispenseData').empty();
    $('#tblPmsProductDispenseData thead').empty();

    $("#divexport").hide();
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
        async: false,
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

    var Data_s = {
        vWorkSpaceId: setworkspaceid,
        nProductTypeID: $("#DDLProductType").val(),
        nProductNo: $("#DDLProduct").val(),
        nBatchNo: $("#ddlBatchLotNo").val()
    }
    var GetProductDetail = {
        Url: BaseUrl + "PmsProductDispense/PostProductDetailByProjectNo/",
        SuccessMethod: "SuccessMethod",
    }

    $.ajax({
        url: GetProductDetail.Url,
        type: 'Post',
        data: Data_s,
        async: false,
        success: function (jsonData) {
            if (jsonData.length > 0) {
                $("#ddlBatchLotNo").empty().append('<option selected="selected" value="0">Please Select Batch/Lot/Lot No</option>');
                for (var i = 0; i < jsonData.length; i++) {
                    $("#ddlBatchLotNo").append($("<option></option>").val(jsonData[i].nStudyProductBatchNo).html(jsonData[i].vBatchLotNo));
                }
            }
            else {
                $("#ddlBatchLotNo").empty().append('<option selected="selected" value="0">Please Select Batch/Lot/Lot No</option>');
            }
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Batch/Lot/Lot No not found.", ModuleName);
        }
    });
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
            async: false,
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

function pmsStudyViewAuthenticate() {
    debugger;
    var getData = $("#tblPmsProductDispenseData").dataTable().fnGetData();
    for (var i = 0; i < getData.length; i++) {
        if (getData[i][23] == 'N') {
            strBarcode = "";
            for (var i = 0; i < getData.length; i++) {
                strBarcode += getData[i][2] + ",";
            }
            $("#ViewAuthenticate").modal('show');
        }
    }
}

$("#btnOk").on("click", function () {
    debugger;
    pwd = $("#txtPassword").val();
    if (isBlank(document.getElementById('txtRemark').value)) {
        ValidationAlertBox("Please enter Remarks.", "txtRemark", ModuleName);
        return false
    }
    else if (isBlank(document.getElementById('txtPassword').value)) {
        ValidationAlertBox("Please enter Password.", "txtPassword", ModuleName);
        return false
    }


    var InsertPmsProductArc1 = {
        barcode: strBarcode,
        vQARemarks: $("#txtRemark").val(),
        vDocTypeCode: 'ZDIS',
        sessionPass: $("#hdnPassword").val(),
        Password: $("#txtPassword").val(),
        cIsQAReview: 'Y',
        iUserId: $("#hdnuserid").val()

    }

    var InsertProductData = {
        Url: BaseUrl + "PmsProductDispense/Insert_ProductDispenseQAApprove",
        SuccessMethod: "SuccessMethod",
        Data: InsertPmsProductArc1
    }
    InsertPmsProductDtlQA(InsertProductData.Url, InsertProductData.SuccessMethod, InsertProductData.Data);
});

var InsertPmsProductDtlQA = function (Url, SuccessMethod, Data) {
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
                $('#collapseOne').collapse('show');
                $('#collapseTwo').collapse('hide');
                SuccessorErrorMessageAlertBox("Product Dispense reviewed successfully.", ModuleName);
            }
            else if (jsonData == "error") {
                $("#ViewAuthenticate").show();
                ValidationAlertBox("Password Authentication fails.", "txtPassword", ModuleName);
            }
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Data not found.", ModuleName);
        }
    });
}

function QaReviewReject() {
    debugger;
    pwd = $("#txtPassword").val();
    if (isBlank(document.getElementById('txtRemark').value)) {
        ValidationAlertBox("Please enter Remarks.", "txtRemark", ModuleName);
        return false
    }
    else if (isBlank(document.getElementById('txtPassword').value)) {
        ValidationAlertBox("Please enter Password.", "txtPassword", ModuleName);
        return false
    }


    var InsertPmsProductArc1 = {
        barcode: strBarcode,
        vQARemarks: $("#txtRemark").val(),
        vDocTypeCode: 'ZDIS',
        sessionPass: $("#hdnPassword").val(),
        Password: $("#txtPassword").val(),
        cIsQAReview: 'R'

    }

    var InsertProductData = {
        Url: BaseUrl + "PmsProductDispense/Insert_ProductDispenseQAApprove",
        SuccessMethod: "SuccessMethod",
        Data: InsertPmsProductArc1
    }
    InsertPmsProductDtlQAReject(InsertProductData.Url, InsertProductData.SuccessMethod, InsertProductData.Data);
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
                $('#collapseOne').collapse('show');
                $('#collapseTwo').collapse('hide');
                SuccessorErrorMessageAlertBox("Data rejected successfully.", ModuleName);
            }
            else if (jsonData == "error") {
                $("#ViewAuthenticate").show();
                ValidationAlertBox("Password Authentication fails.", "txtPassword", ModuleName);
            }
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Data not found.", ModuleName);
        }
    });
}

$('#txtOuterBarcode').on('change', function () {
    debugger;
    if ($("#txtOuterBarcode").val() != "") {
        var arrBarcode = $("#txtOuterBarcode").val().split("-");

        if (arrBarcode.length == 4) {
            var InsertPmsProductDispensHdr = {
                vWorkSpaceId: arrBarcode[0],
                nProductNo: arrBarcode[2],
                nProductTypeID: arrBarcode[1],
                nBatchNo: arrBarcode[3]

            }

            setworkspaceid = arrBarcode[0];

            var InsertProductDispenseHdrData = {
                Url: BaseUrl + "PmsProductDispense/PmsGetInfoFromOuterBarcode",
                SuccessMethod: "SuccessMethod",
                Data: InsertPmsProductDispensHdr
            }

            GetInfoFromOuterBarcode(InsertProductDispenseHdrData.Url, InsertProductDispenseHdrData.SuccessMethod, InsertProductDispenseHdrData.Data);
        }
    }

});

var GetInfoFromOuterBarcode = function (Url, SuccessMethod, Data) {

    $.ajax({
        url: Url,
        type: 'POST',
        async: false,
        data: Data,
        //async: false,
        success: SuccessInsertData,
        error: function () {
            SuccessorErrorMessageAlertBox("Data not found.", ModuleName);
        }
    });

    function SuccessInsertData(response) {
        debugger;
        if (response.length > 0) {
            debugger;
            var arrBarcode = $("#txtOuterBarcode").val().split("-");

            $("#DDLProjectNo").val(response[0].ProjectNo);
            GetNoOfPeriods();
            GetProductType();

            $("#DDLProjectNo").val(response[0].ProjectNo);

            for (var i = 0; i < response.length ; i++) {
                $("#DDLProduct").append($("<option></option>").val(response[i].nProductNo).html(response[i].vProductName));
                $("#ddlBatchLotNo").append($("<option></option>").val(response[i].nStudyProductBatchNo).html(response[i].vBatchLotNo));
            }


            $("#DDLProductType").val(arrBarcode[1]);
            $("#DDLProduct").val(arrBarcode[2]);

            $("#ddlBatchLotNo").val(arrBarcode[3]);
            $('#DDLActivity').val(0).attr("selected", "selected");
            $('#DDLDosingDay').val(0).attr("selected", "selected");
            $('#DDLDosingNo').val(0).attr("selected", "selected");

            $("#txtOuterBarcode").val('');

        }
        else {
            SetDefaultValue();
        }

    }
}
