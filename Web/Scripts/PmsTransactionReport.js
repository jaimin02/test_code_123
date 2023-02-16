var productIds = new Object();
var ProductNoArry = [];
var vProductNo = "";
var setworkspaceid = "";
var ModuleName = "Transaction Report";

$(function () {

    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('.modal').modal('hide');

    $('#txtReceivedFromDate').datetimepicker({ format: 'DD-MMMM-YYYY', });
    $('#txtReceivedToDate').datetimepicker({ format: 'DD-MMMM-YYYY', });


    $('#txtRetentionFromDate').datetimepicker({ format: 'DD-MMMM-YYYY', });
    $('#txtRetentionToDate').datetimepicker({ format: 'DD-MMMM-YYYY', });

    var dt = new Date();
    jQuery('#txtReceivedFromDate').data("DateTimePicker").maxDate(dt);

    jQuery('#txtReceivedToDate').data("DateTimePicker").minDate(dt);
    $("#txtReceivedToDate").val('');


    //jQuery("#txtReceivedFromDate").on("dp.change", function (e) {
    //    jQuery('#txtReceivedToDate').data("DateTimePicker").minDate(e.date);
    //});
    //jQuery("#txtReceivedToDate").on("dp.change", function (e) {
    //    jQuery('#txtReceivedFromDate').data("DateTimePicker").maxDate(e.date);
    //});

    //jQuery("#txtRetentionFromDate").on("dp.change", function (e) {
    //    jQuery('#txtRetentionToDate').data("DateTimePicker").minDate(e.date);
    //});
    //jQuery("#txtRetentionToDate").on("dp.change", function (e) {
    //    jQuery('#txtRetentionFromDate').data("DateTimePicker").maxDate(e.date);
    //});


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

    $('#btnExit').on("click", function () {
        ConfirmAlertBox(ModuleName, $("#RedirectToHome").val());
    });

    $("#btnClear").on("click", function () {
        cleardata();
    });

    $("#btnGo").on("click", function () {
        if (ValidateForm()) {
            document.getElementById('StockReport').style.visibility = "visible";
            $('#collapseOne').collapse('hide');
            $('#collapseTwo').collapse('show');

            var Data_s = {
                dFromDate: $("#txtReceivedFromDate").val(),
                dTodate: $("#txtReceivedToDate").val(),
                nStorageArea: $("#ddlStorageArea").val(),
                dRetentionFromDate: $("#txtRetentionFromDate").val(),
                dRetentionToDate: $("#txtRetentionToDate").val(),
                vWorkSpaceId: setworkspaceid,
            }
            var GetRetentionReportData = {
                Url: BaseUrl + "PmsGeneralReport/RetentionReport",
                SuccessMethod: "SuccessMethod",
                Data: Data_s
            }
            GetAllRtentionReceiptReport(GetRetentionReportData.Url, GetRetentionReportData.SuccessMethod, GetRetentionReportData.Data);
            document.getElementById('divexport').style.visibility = "visible";


        }
    });

    var GetPmsRetentionReportProjectNo = {
        Url: BaseUrl + "PmsGeneral/ProjectNumber",
        SuccessMethod: "SuccessMethod",
    }
    $('#ddlProjectNodashboard').on('change keyup paste mouseup', function () {
        if ($('#ddlProjectNodashboard').val().length == 2) {
            var ProjectNoDataTemp = {
                vWorkSpaceID: $('#ddlProjectNodashboard').val(),
                iUserId: $("#hdnuserid").val(),
                vProjectTypeCode: $("#hdnscopevalues").val(),
            }
            GetAllPmsRetentionReportProjectNo(GetPmsRetentionReportProjectNo.Url, GetPmsRetentionReportProjectNo.SuccessMethod, ProjectNoDataTemp);

        }
        else if ($('#ddlProjectNodashboard').val().length < 2) {
            $("#ddlProjectNodashboard").autocomplete({
                source: "",
                change: function (event, ui) { }
            });
        }
    });

    getTransactionType();

    $('#ddlTransactionType').multiselect({
        nonSelectedText: 'Please Select Transaction',
        buttonClass: 'form-control',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        numberDisplayed: 2,
        includeSelectAllOption: true,
    });
});

function getTransactionType() {
    debugger;
    $('#ddlTransactionType option').each(function () {
        $(this).remove();
    });

    GetPmsStorageAreaData = {
        //Url: BaseUrl + "PmsStorageArea/AllStorageArea",
       
        Url: BaseUrl + "PmsTransaction/GetTransactionDataMaster",
        SuccessMethod: "SuccessMethod",
    }

    //var FilterData = {
    //    nStorageTypeId: $("#ddlStorageLocation :selected").val(),
    //    vLocationCode: $("#hdnUserLocationCode").val(),
    //}
    $.ajax({
        url: GetPmsStorageAreaData.Url,
        type: 'GET',
        //data: FilterData,
        asyc: false,
        success: SuccessMethod,
        asyn: false,
        error: function () {
            ValidationAlertBox("Transaction Type not found.", "ddlTransactionType", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        var strdata = "";
        if (jsonData.length > 0) {
            for (var i = 0; i < jsonData.length; i++) {
                if (jsonData[i].cStatusIndi != 'D') {
                    $("#ddlTransactionType").append($("<option></option>").val(jsonData[i].vDocTypeCode).html(jsonData[i].vDocTypeDesc));
                    $('#ddlTransactionType').multiselect('rebuild');
                }
            }
        }
    }

}

function cleardata() {

    //$("#StockReport").hide();
    $('#collapseTwo').collapse('hide');
    $("#divexport").hide();
    $("#ddlProjectNodashboard").val("");
    $("#txtReceivedFromDate").val("");
    $('#txtReceivedFromDate').data("DateTimePicker").clear();
    $("#txtReceivedToDate").val("");
    $('#txtReceivedToDate').data("DateTimePicker").clear();

    $("#ddlTransactionType").multiselect("clearSelection");
    $("#ddlTransactionType").multiselect('refresh');
    //ActivityDataset = [];
    //otable = $('#tblPmsRetentionReport').dataTable({
    //    "bJQueryUI": true,
    //    "sPaginationType": "full_numbers",
    //    "bLengthChange": true,
    //    "iDisplayLength": 10,
    //    "bProcessing": true,
    //    "bSort": true,
    //    "autoWidth": false,
    //    "aaData": ActivityDataset,
    //    "bInfo": true,
    //    "aaSorting": [],
    //    "bAutoWidth": false,
    //    "bDestroy": true,
    //    "sScrollX": "100%",
    //    "sScrollXInner": "2000" /* It varies dynamically if number of columns increases */,
    //    "oLanguage": {
    //        "sEmptyTable": "No Record Found",
    //    },
    //    "aoColumns": [
    //        { "sTitle": "Receipt Type" },
    //        { "sTitle": "Project No" },
    //        { "sTitle": "Date Of Receipt" },
    //        { "sTitle": "Sponsor Name" },
    //        { "sTitle": "Product Type" },
    //        { "sTitle": "Product Name" },
    //        { "sTitle": "Batch/Lot No." },
    //        { "sTitle": "Mfg Date" },
    //        { "sTitle": "Exp./Retest Date" },
    //        { "sTitle": "Qty Recived" },
    //        { "sTitle": "Balance Qty" },
    //        { "sTitle": "Retention Qty" },
    //        { "sTitle": "Due date of Retention" },
    //        { "sTitle": "Storage Area" },
    //    ],
    //    "columnDefs": [

    //    ],
    //});


}

function toggleIcon(e) {
    $(e.target)
        .prev('.panel-heading')
        .find(".more-less")
        .toggleClass('  glyphicon-plus glyphicon-minus');
}

function ValidateForm() {


    if ($("#txtReceivedFromDate").val() == "" || $("#txtReceivedToDate").val() == "") {
        if ($("#txtReceivedFromDate").val() == "") {
            ValidationAlertBox("Please select Transaction Start Date.", "txtReceivedFromDate", ModuleName);
            return false;
        }
        if ($("#txtReceivedToDate").val() == "") {
            ValidationAlertBox("Please select Transaction To Date.", "txtReceivedToDate", ModuleName);
            return false;
        }
    }
    return true;


}

var GetAllPmsRetentionReportProjectNo = function (Url, SuccessMethod, ProjectNoDataTemp) {
    $.ajax({
        url: Url,
        type: 'POST',
        data: ProjectNoDataTemp,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Project not found.", ModuleName);
        }
    });
    function SuccessMethod(jsonData) {
        var strdata = "";
        if (jsonData.length > 0) {
            var jsonObj = jsonData;
            var sourceArr = [];
            for (var i = 0; i < jsonObj.length; i++) {
                sourceArr.push("[ " + jsonObj[i].vProjectNo + " ]" + " " + jsonObj[i].vRequestId);
                productIds["[ " + jsonObj[i].vProjectNo + " ]" + " " + jsonObj[i].vRequestId] = jsonObj[i].vWorkspaceId;
            }
            $("#ddlProjectNodashboard").autocomplete({
                source: sourceArr,
                change: function (event, ui) { }
            });
        }
    }
}

var GetAllPmsRetentionStorageArea = function (Url, SuccessMethod) {
    $('#StorageArea option').each(function () {
        $(this).remove();
    });

    GetPmsStorageAreaData = {
        Url: BaseUrl + "PmsStorageArea/AllStorageArea",
        SuccessMethod: "SuccessMethod",
    }
    var FilterData = {
        vLocationCode: $("#hdnUserLocationCode").val()
    }
    $.ajax({
        url: GetPmsStorageAreaData.Url,
        type: 'POST',
        data: FilterData,
        asyc: false,
        success: SuccessMethod,
        asyn: false,
        error: function () {
            ValidationAlertBox("Storage Type not found.", "ddlStorageArea", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        var strdata = "";
        if (jsonData.length > 0) {
            for (var i = 0; i < jsonData.length; i++) {
                if (jsonData[i].cStatusIndi != 'D') {
                    $("#ddlStorageArea").append($("<option></option>").val(jsonData[i].nStorageAreaNo).html(jsonData[i].vStorageAreaName + " | " + jsonData[i].vCompartmentName + " | " + jsonData[i].vRackName));
                    $('#ddlStorageArea').multiselect('rebuild');
                }
            }
        }
    }
}

function GetStorageArea() {
    $('#ddlStorageArea option').each(function () {
        $(this).remove();
    });
    var GETStorageArea = {
        Url: BaseUrl + "PmsGeneral/ALLStorageAreaData",
        SuccessMethod: "SuccessMethod"
    }
    var FilterData = {
        nStorageTypeId: $("#ddlStorageLocation :selected").val(),
        vLocationCode: $("#hdnUserLocationCode").val(),
    }
    $.ajax({
        url: GETStorageArea.Url,
        type: 'POST',
        data: FilterData,
        asyc: false,
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("Storage Area not found.", "ddlStorageArea", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        var strdata = "";
        if (jsonData.length > 0) {
            for (var i = 0; i < jsonData.length; i++) {
                $("#ddlStorageArea").append($("<option></option>").val(jsonData[i].nStorageAreaNo).html(jsonData[i].vStorageAreaName + " | " + jsonData[i].vCompartmentName + " | " + jsonData[i].vRackName));
                $('#ddlStorageArea').multiselect('rebuild');
            }
        }
    }
}

var GetAllRtentionReceiptReport = function (Url, SuccessMethod, Data) {
    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        async: false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Data not found.", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        ActivityDataset = [];
        var duedateofRetention = "";
        for (var i = 0; i < jsonData.length; i++) {
            var InDataset = [];

            if (jsonData[i].DuedateofRetention == "1900-01-01T00:00:00") {
                jsonData[i].DuedateofRetention = "";
            }
            InDataset.push(jsonData[i].ReceiptType, jsonData[i].ProjectNo, jsonData[i].DateOfReceipt, jsonData[i].SponsorName, jsonData[i].ProductType,
                           jsonData[i].ProductName, jsonData[i].BatchLotNo, jsonData[i].MfgDate, jsonData[i].ExpRetestDate
                          , jsonData[i].QtyRecived, jsonData[i].BalanceQty, jsonData[i].RetentionQty, jsonData[i].DuedateofRetention, jsonData[i].StorageArea);
            ActivityDataset.push(InDataset);
        }
        otable = $('#tblPmsRetentionReport').dataTable({
            "bJQueryUI": true,
            "sPaginationType": "full_numbers",
            "bLengthChange": true,
            "iDisplayLength": 10,
            "bProcessing": true,
            "bSort": true,
            "autoWidth": false,
            "aaData": ActivityDataset,
            "bInfo": true,
            "aaSorting": [],
            "bAutoWidth": false,
            "bDestroy": true,
            "sScrollX": "100%",
            "sScrollXInner": "2000" /* It varies dynamically if number of columns increases */,
            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },
            "aoColumns": [
                { "sTitle": "Receipt Type" },
                { "sTitle": "Project No" },
                { "sTitle": "Date Of Receipt" },
                { "sTitle": "Sponsor Name" },
                { "sTitle": "Product Type" },
                { "sTitle": "Product Name" },
                { "sTitle": "Batch/Lot/Lot No." },
                { "sTitle": "Mfg Date" },
                { "sTitle": "RE-Test/Expiry/Provisional expiry date" },
                { "sTitle": "Qty Recived" },
                { "sTitle": "Balance Qty" },
                { "sTitle": "Retention Qty" },
                { "sTitle": "Due date of Retention" },
                { "sTitle": "Storage Area" },
            ],
            "columnDefs": [

            ],
        });
    }
    GetStockParaSessionDetail();
};


function GetStockParaSessionDetail() {
    var Data_Export = {
        dFromDate: $("#txtReceivedFromDate").val(),
        dTodate: $("#txtReceivedToDate").val(),

        dRetentionFromDate: $("#txtRetentionFromDate").val(),
        dRetentionToDate: $("#txtRetentionToDate").val(),

        nStorageArea: $("#ddlStorageArea").val(),
        vWorkSpaceId: setworkspaceid,
    }
    var URLSessionDetails = WebUrl + "PMSRetentionReport/GetSessionDetail";
    $.ajax({
        url: URLSessionDetails,
        type: 'get',
        data: Data_Export,
        //async: false,
        success: function (data) {
        },
        error: function () {
        }
    });
}


function getValue() {
    if (ValidateForm()) {
        var InsertPmsProductReceipt1 = {
            dFromDate: $("#txtReceivedFromDate").val(),
            dTodate: $("#txtReceivedToDate").val(),
        }

        var InsertProductReceiptData = {
            Url: WebUrl + "PmsTransaction/GetExportToExcelDetails",
            SuccessMethod: "SuccessMethod",
            Data: InsertPmsProductReceipt1
        }
        GetPDF(InsertProductReceiptData.Url, InsertProductReceiptData.SuccessMethod, InsertProductReceiptData.Data);
    }

}

var GetPDF = function (Url, SuccessMethod, Data) {
    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        success: function (jsonData) {
            window.location.href = '../PmsTransaction/ExportToExcel'

        },
        error: function () {
            SuccessorErrorMessageAlertBox("Data not found.", ModuleName);
        }
    });
    return false;
}