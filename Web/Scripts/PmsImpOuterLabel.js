var productIds = new Object();
var actionname;
var DocTypeCode;
var RefModule;
var LocationIndicator;
var setworkspaceid = "";
var QuantityRefModule;
var viewmode;
var totalavailableqty = 0;
var ModuleName = $("#hndActionName").val();
var TransferIndi = "";
var nTransactionNoQA = "";
var nTransactionDtlNoQA = "";
var cTransferIndi = "";
var UserTypeCode = "";
var ModuleName = "IMP Outer Label";
var vProjectNo = "";

$(document).ready(function () {

    GetViewMode();

    $("#spnwelcome").html($("#hdnusername").val());
    $("#spnLoginTime").html($("#hdnlogintime").val());
    CheckSetProject();
    //GetProductType();
   
    //Get Project No
    var GetProjectNo =
    {
        //Url: BaseUrl + "PmsProductBatch/GetProjectNo",
        Url: BaseUrl + "PmsGeneral/GetScopeWiseProject",
        SuccessMethod: "SuccessMethod"
    }
    $('#ddlProjectNodashboard').on('change keyup', function () {
        if ($('#ddlProjectNodashboard').val().length == 2) {
            var ProjectNoDataTemp = {
                //vProjectNo: $('#ddlProjectNodashboard').val(),
                iUserId: $("#hdnuserid").val(),
                vStudyCode: $('#ddlProjectNodashboard').val()
                //vProjectTypeCode: $("#hdnscopevalues").val(),
            }
            GetPmsProjectNoProductReceipt(GetProjectNo.Url, GetProjectNo.SuccessMethod, ProjectNoDataTemp);
        }
        else if ($('#ddlProjectNodashboard').val().length < 2) {
            $("#ddlProjectNodashboard").autocomplete({
                source: "",
                change: function (event, ui) { },
                select: function (event, ui) {
                    vProjectNo = ui.item.value;
                    $('#ddlProjectNodashboard').val(vProjectNo);

                    GetProductType();
                },
            });
        }
    });

    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('.modal').modal('hide');

    $('#txtDate').datetimepicker({
        format: 'DD-MMMM-YYYY',
    });

});

//$("#ddlProjectNodashboard").on("blur", function () {
//    GetProductType();
//});

$("#ddlProductType").on("change", function () {
    GetProductName();
});

$("#Product").on("change", function () {
    GetBatchLotNo();
});

function GetProductReturnDetail() {

    if (productIds[$('#ddlProjectNodashboard').val()] != undefined) {
        setworkspaceid = productIds[$('#ddlProjectNodashboard').val()];
    }

    var userId = $("#hdnuserid").val();

    var DataValue = {
        vWorkSpaceId: setworkspaceid,
        vDocTypeCode: DocTypeCode,
        iUserID: userId
    }
    var DataDetails = {
        Url: BaseUrl + "PmsStudyProductReceipt/StudyProductReceiptData",
        SuccessMethod: "SuccessMethod",
        Data: DataValue,
    }
    GetProductDatail(DataDetails.Url, DataDetails.SuccessMethod, DataDetails.Data);
    //GetProductName();

}

function GetProductDatail(url, SuccessMethod, DataValue) {

    $.ajax({
        url: url,
        type: 'POST',
        data: DataValue,
        async: false,
        success: GetData,
        error: function () {
            SuccessorErrorMessageAlertBox("Data not found.", ModuleName);
        }
    });

}

function GetData(jsonData) {
    var srno;
    var ActivityDataset = [];
    $("#divexport").css("visibility", "visible");
    var date;
    var View;
    var QAreview;
    if (DocTypeCode == "ZRE2") {
        for (var i = 0; i < jsonData.length; i++) {
            var InDataset = [];
            srno = i + 1;
            date = jsonData[i].dReceiptDate.split(" ");
            UserTypeCode = $("#hdnUserTypeCode").val();
            if (UserTypeCode.includes($("#hdnUserProfile").val())) {
                QAreview = "<a data-toggle='modal' data-tooltip='tooltip' title='QA Review'  attrid=' + aData[0] + ' class='btnview' Onclick=pmsStudyViewAuthenticate(this) nTransactionNo='" + jsonData[i].nTransactionNo
                            + "' nSPTransactionDtlNo='" + jsonData[i].nTransactionDtlNo + "' cIsQAReview='" + jsonData[i].cIsQAReview + "' cTransferIndi='" + jsonData[i].cTransferIndi + "' style='cursor:pointer;'><i class='btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a'><i class='fa fa-fw fa-edit'></i><span>QA Review</span></a>"

            }
            else {
                //Changed by rinkal
                //QAreview = "<a data-toggle='modal' data-tooltip='tooltip' title='edit' data-target='#ViewAuthenticate' class='btnedit' style='cursor:pointer;'><i class='btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a'><i class='fa fa-fw fa-edit'></i><span>QA Review</span></a>"

                QAreview = "<a data-toggle='modal' data-tooltip='tooltip' title='QA Review'  attrid=' + aData[0] + ' class='btnview' Onclick=pmsStudyViewAuthenticate(this) nTransactionNo='" + jsonData[i].nTransactionNo
                                  + "' nSPTransactionDtlNo='" + jsonData[i].nTransactionDtlNo + "' cIsQAReview='" + jsonData[i].cIsQAReview + "' cTransferIndi='" + jsonData[i].cTransferIndi + "' style='cursor:pointer;'><i class='btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a'><i class='fa fa-fw fa-edit'></i><span>QA Review</span></a>"

            }
            View = "<a data-toggle='modal' data-tooltip='tooltip' title='View' data-target='#ProductModel' attrid=' + aData[0] + ' class='btnedit' Onclick=pmsStudyProductReceiptSelectionData(this) nTransactionNo='" + jsonData[i].nTransactionNo
                                + "' nSPTransactionDtlNo='" + jsonData[i].nTransactionDtlNo + "' nProductTypeID = '" + jsonData[i].nProductTypeID + "' nProductNo = '"
                                + jsonData[i].nProductNo + "' nStudyProductBatchNo = '" + jsonData[i].nStudyProductBatchNo + "'  cTransferIndi='"
                                + jsonData[i].cTransferIndi + "' style='cursor:pointer;'><i class='btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a'><i class='fa fa-fw fa-edit'></i><span>View</span></a>"


            InDataset.push(jsonData[i].vProjectNo, jsonData[i].cTransferIndi, jsonData[i].vKitNo, jsonData[i].vProductType,
                           jsonData[i].vReceiptRefNo, jsonData[i].vSendTo, date[0], jsonData[i].vReasonDesc,
                           jsonData[i].vStorageAreaName, jsonData[i].iNoOfContainers, jsonData[i].vProductName, jsonData[i].vBatchLotNo, jsonData[i].iReceivedQty,
                           jsonData[i].vRemarks, jsonData[i].vModifyBy + "/</br>" + jsonData[i].dModifyOn, View, QAreview, jsonData[i].cIsQAReview);
            ActivityDataset.push(InDataset);
        }
    }
    else if (DocTypeCode == "ZDES") {
        for (var i = 0; i < jsonData.length; i++) {
            var InDataset = [];
            date = jsonData[i].dReceiptDate.split(" ");
            InDataset.push(jsonData[i].vProjectNo, jsonData[i].vProductType, jsonData[i].vReceiptRefNo, date[0], jsonData[i].vReasonDesc, jsonData[i].vProductName, jsonData[i].vBatchLotNo, jsonData[i].iReceivedQty, jsonData[i].vRemarks, jsonData[i].vModifyBy + "/</br>" + jsonData[i].dModifyOn);
            ActivityDataset.push(InDataset);
        }
    }
    else {
        for (var i = 0; i < jsonData.length; i++) {
            var InDataset = [];
            srno = i + 1;
            InDataset.push(jsonData[i].vProjectNo, jsonData[i].vToProjectNo, jsonData[i].vProductType, jsonData[i].vReceiptRefNo, jsonData[i].vSendTo, jsonData[i].vReasonDesc, jsonData[i].vStorageAreaName, jsonData[i].vProductName, jsonData[i].vBatchLotNo, jsonData[i].iReceivedQty, jsonData[i].vModifyBy + "/</br>" + jsonData[i].dModifyOn);
            ActivityDataset.push(InDataset);
        }
    }

    GetDashboardData(ActivityDataset);
}

var GetPmsProjectNoProductReceipt = function (Url, SuccessMethod, ProjectNoDataTemp) {
    $.ajax({
        url: Url,
        type: 'GET',
        //data: { id: ProjectNoDataTemp.iUserId, projectno: ProjectNoDataTemp.vProjectNo, typecode: ProjectNoDataTemp.vProjectTypeCode },
        data: { iUserId: ProjectNoDataTemp.iUserId, vStudyCode: ProjectNoDataTemp.vStudyCode },
        async: false,
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("Project not found .", "ddlProjectNodashboard", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        var jsonObj = jsonData;
        var sourceArr = [];
        for (var i = 0; i < jsonObj.length; i++) {
            sourceArr.push("[ " + jsonObj[i].vStudyCode + " ]" + " " + jsonObj[i].vStudyName);
            productIds["[ " + jsonObj[i].vStudyCode + " ]" + " " + jsonObj[i].vStudyName] = jsonObj[i].nStudyNo;
        }
        $("#ddlProjectNodashboard").autocomplete({
            source: sourceArr,
            change: function (event, ui) { }
        });

        $("#ddlToProjectNo").autocomplete({
            source: sourceArr,
            change: function (event, ui) { }
        });
    }
}

function GetProductName() {
    if (productIds[$('#ProjectNo').val()] != undefined) {
        setworkspaceid = productIds[$('#ProjectNo').val()];
    }

    var projectid = setworkspaceid;
    var ProductData = {
        vWorkSpaceId: projectid,
        nProductTypeID: $("#ddlProductType").val(),
        cTransferIndi: $("#ddlTransferIndi").val(),


    }
    var GetPmsProductReturn = {
        Url: BaseUrl + "PmsGeneral/ProductName",
        SuccessMethod: "SuccessMethod"
    }
    $.ajax({
        url: GetPmsProductReturn.Url,
        type: 'POST',
        data: ProductData,
        success: SuccessMethod,
        asyc: false,
        error: function () {
            ValidationAlertBox("Product not found.", "Product", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        var strdata = "";
        if (jsonData.length > 0) {
            $("#Product").empty().append('<option selected="selected" value="0">Please Select Product</option>');
            for (var i = 0; i < jsonData.length; i++)
                $("#Product").append($("<option></option>").val(jsonData[i].nProductNo).html(jsonData[i].vProductName)).prop('disabled', false);
        }
        else {
            $("#Product").empty().append('<option selected="selected" value="0">Please Select Product</option>').prop('disabled', false);
        }
    }
}

function GetBatchLotNo() {
    if (productIds[$('#ProjectNo').val()] != undefined) {
        setworkspaceid = productIds[$('#ProjectNo').val()];
    }

    var productid = $("#Product").val();
    var GetPmsQualityCheckBatchLotNo = {
        Url: BaseUrl + "PmsStudyProductReceipt/GetBatchLotNo",
        SuccessMethod: "SuccessMethod"
    }

    $.ajax({
        url: GetPmsQualityCheckBatchLotNo.Url,
        type: 'GET',
        async: false,
        data: { id: setworkspaceid, projectno: productid },
        success: SuccessMethod,

        error: function () {
            ValidationAlertBox("Batch/Lot/Lot No not found.", "Product", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        var strdata = "";
        if (jsonData.length > 0) {
            $("#BatchLotNo").empty().append('<option selected="selected" value="0">Please Select Batch/Lot/Lot No</option>');
            for (var i = 0; i < jsonData.length; i++)
                $("#BatchLotNo").append($("<option></option>").val(jsonData[i].nStudyProductBatchNo).html(jsonData[i].vBatchLotNo)).prop('disabled', false);
        }
        else {
            $("#BatchLotNo").empty().append('<option selected="selected" value="0">Please Select Batch/Lot/Lot No</option>').prop('disabled', false);
        }
    }
}

function ClearDetailPartData() {    
    $('#Product').val(0).attr("selected", "selected");
    $('#BatchLotNo').val(0).attr("selected", "selected");
}

function ValidateForm() {

    if (isBlank(document.getElementById('ddlProjectNodashboard').value)) {
        ValidationAlertBox("Please enter Project No.", "ddlProjectNodashboard", ModuleName);
        return false;
    }

    if (Dropdown_Validation(document.getElementById("ddlProductType"))) {
        ValidationAlertBox("Please select Product Type.", "ddlProductType", ModuleName);
        return false;
    }

    if (Dropdown_Validation(document.getElementById("Product"))) {
        ValidationAlertBox("Please select Product.", "Product", ModuleName);
        return false;
    }
    if (Dropdown_Validation(document.getElementById("BatchLotNo"))) {
        ValidationAlertBox("Please select Batch/Lot/Lot No.", "BatchLotNo", ModuleName);
        return false;
    }

    if (isBlank(document.getElementById('txtNoOfLabels').value)) {
        ValidationAlertBox("Please enter No of Labels.", "txtNoOfLabels", ModuleName);
        return false;
    }

    if (document.getElementById('txtNoOfLabels').value == "0") {
        ValidationAlertBox("No of Labels can not be zero.", "txtNoOfLabels", ModuleName);
        return false;
    }
   
    return true;
}

function GetProductType() {

    if (productIds[$('#ddlProjectNodashboard').val()] != undefined) {
        setworkspaceid = productIds[$('#ddlProjectNodashboard').val()];
    }
    $.ajax({
        type: "GET",
        url: BaseUrl + "PmsGeneral/GetProductType",
        data: { id: setworkspaceid },
        //contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Product Type not found.", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        $("#ddlProductType").empty().append('<option selected="selected" value="0">Please Select Product Type</option>');
        for (var i = 0; i < jsonData.length; i++) {
            $("#ddlProductType").append($("<option></option>").val(jsonData[i].nProductTypeID).html(jsonData[i].vProductType));
        }
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
        type: "GET",
        url: BaseUrl + "PmsGeneral/GetSetProjectDetails",
        data: { id: PassData.iUserId },
        dataType: "json",
        async: false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Project not found.", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        if (jsonData.length > 0) {
            $('#ddlProjectNodashboard').val(jsonData[0].vProjectNo);
            setworkspaceid = jsonData[0].vWorkSpaceId;
            GetProductType();
        }
        else {
            $('#ddlProjectNodashboard').val('');
        }
    }
}

function getValue() {
    if (ValidateForm()) {
        var InsertPmsProductReceipt1 = {
            vWorkSpaceId: setworkspaceid,
            nStudyProductNo: $("#ddlProjectNodashboard").val(),
            nProductTypeID: $("#ddlProductType").val(),
            nProductNo: $("#Product").val(),
            nStudyProductBatchNo: $("#BatchLotNo").val(),
            iNoOfContainers: $("#txtNoOfLabels").val()
        }

        var InsertProductReceiptData = {
            Url: WebUrl + "ImpOuterLabel/GetExportToExcelDetails",
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
            window.location.href = '../ImpOuterLabel/ExportToPDF'
          
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Data not found.", ModuleName);
        }
    });
    return false;
}

$("#btnExitPmsProduct").on("click", function () {
    ConfirmAlertBox(ModuleName, $("#RedirectToHome").val());
});

$("#btnClearPmsProduct").on("click", function () {
    $("#ddlProjectNodashboard").val("");
    $('#ddlProductType').val(0).attr("selected", "selected");
    $('#Product').val(0).attr("selected", "selected");
    $('#BatchLotNo').val(0).attr("selected", "selected");
    $("#txtNoOfLabels").val("");
});

$("#txtNoOfLabels").on('keypress', function (e) {    
    var regExp = /[a-z]/i;
    var value = String.fromCharCode(e.which) || e.key;
    if (regExp.test(value)) {
        e.preventDefault();
        return false;
    }
});