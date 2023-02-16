var productIds = new Object();
var actionname;
var DocTypeCode;
var RefModule;
var LocationIndicator;
var setworkspaceid = "";
var QuantityRefModule;
var viewmode;
var totalavailableqty = 0;
var ModuleName = "Product Destroy";
var TransferIndi = "";
var vProjectNo = "";

$(document).ready(function () {

    GetActionName();
    GetViewMode();
    $("#txtDate").attr("autocomplete", "off");
    $("#spnwelcome").html($("#hdnusername").val());
    $("#spnLoginTime").html($("#hdnlogintime").val());
    CheckSetProject();

    if (setworkspaceid != "") {
        BindData();
    }

    var GetProjectNo = {
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

                    BindData();
                },
            });
        }
    });

    GetPmsQualityCheckToStrage = {
        Url: BaseUrl + "PmsQualityCheckMovement/GetFromStorageLocationName",
        SuccessMethod: "SuccessMethod",
    }
    GetAllPmsQualityCheckToStorage(GetPmsQualityCheckToStrage.Url, GetPmsQualityCheckToStrage.SuccessMethod);

    $('#ddlToProjectNo').on('change keyup', function () {
        if ($('#ddlToProjectNo').val().length == 2) {
            var ProjectNoDataTemp = {
                vProjectNo: $('#ddlToProjectNo').val(),
                iUserId: $("#hdnuserid").val(),
                vProjectTypeCode: $("#hdnscopevalues").val(),
            }
            GetPmsProjectNoProductReceipt(GetProjectNo.Url, GetProjectNo.SuccessMethod, ProjectNoDataTemp);
        }
        else if ($('#ddlToProjectNo').val().length < 2) {
            $("#ddlToProjectNo").autocomplete({
                source: "",
                change: function (event, ui) { }
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
        maxDate: new Date(),
    });

    $('#ddlKit').multiselect({
        nonSelectedText: 'Please Select Kit',
        buttonClass: 'form-control',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        numberDisplayed: 2,
    });

    $('#ddlProductLabel').multiselect({
        nonSelectedText: 'Please Select Product Label',
        buttonClass: 'form-control',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        numberDisplayed: 2,
    });

});

$("#ddlProjectNodashboard").on("blur", function () {
    BindData();
});

$("#ddlProductType").on("change", function () {
    ClearDetailPartData();
    TransferIndi = $("#ddlTransferIndi").val();
    var TempProductType = $("#ddlProductType").val();

    if (TempProductType != "0") {
        if (TransferIndi == "P") {
            $("#divProductData").attr("style", "display:inline");
            $("#divKitData").attr("style", "display:none");
            $("#divKitType").attr('style', 'display:none');
            $("#divProductCategory").attr('style', 'display:block');
            GetProductName();
        }
        else if (TransferIndi == "K") {
            $("#divProductData").attr("style", "display:none");
            $("#divKitData").attr("style", "display:inline");
            $("#divKitType").attr('style', 'display:block');
            $("#divProductCategory").attr('style', 'display:none');
            GetKitType();
        }
        else {
            $("#divProductData").attr("style", "display:none");
            $("#divKitData").attr("style", "display:none");
            $("#divKitType").attr('style', 'display:none');
            $("#divProductCategory").attr('style', 'display:none');
        }
    }
    else {
        $("#divKitType").attr('style', 'display:none');
        $("#divProductCategory").attr('style', 'display:none');
        $("#divProductData").attr("style", "display:none");
        $("#divKitData").attr("style", "display:none");
    }

});

$("#ddlTransferIndi").on('change', function () {
    ClearDetailPartData();
    TransferIndi = $("#ddlTransferIndi").val();
    $("#ddlProductCategory").val("0");
    $("#ddlKitType").val("0");

    if (TransferIndi == "P") {
        if ($("#ddlProductType").val() != "0") {
            $("#divProductData").attr('style', 'display:none');
            $("#divKitData").attr('style', 'display:none');
            $("#divKitType").attr('style', 'display:none');
            $("#divProductCategory").attr('style', 'display:block');
            //GetProductName();
        }
    }
    else if (TransferIndi == "K") {
        if ($("#ddlProductType").val() != "0") {
            $("#divProductData").attr('style', 'display:none');
            $("#divKitData").attr('style', 'display:none');
            $("#divKitType").attr('style', 'display:block');
            $("#divProductCategory").attr('style', 'display:none');
            GetKitType();
            //GetKit();
        }
    }
    else {
        $("#divKitType").attr('style', 'display:none');
        $("#divProductCategory").attr('style', 'display:none');
        $("#divProductData").attr('style', 'display:none');
        $("#divKitData").attr('style', 'display:none');
    }
});

$("#Product").on("change", function () {
    $("#txtQuantity").val("");
    $('#ddlReason').val(0).attr("selected", "selected");
    GetBatchLotNo();
    $("#ddlUnit").val(0).attr('disabled', false);
    $("#divUnit").hide();
});

$("#BatchLotNo").on("change", function () {
    if ($("#BatchLotNo").val() != "0") {
        getUnit();
    }
    else {
        $("#ddlUnit").val(0).attr('disabled', false);
        $("#divUnit").hide();
    }
    $("#txtQuantity").val("");
    $('#ddlReason').val(0).attr("selected", "selected");
});

function getUnit() {
    debugger;
    var QualityCheckData = {
        vWorkSpaceId: setworkspaceid,
        nProductNo: $("#Product :selected").val(),
        nStudyProductBatchNo: $("#BatchLotNo :selected").val(),
        vDocTypeCode: "ZSTK"
    }

    $.ajax({
        url: BaseUrl + "PmsQualityCheckMovement/UnitDetail",
        type: 'POST',
        async: false,
        data: QualityCheckData,
        success: Success,
        error: function () {
            ValidationAlertBox("Quantity not found.", "Product", ModuleName);
        }
    });
    function Success(response) {
        debugger;
        $("#divUnit").show();
        $("#ddlUnit").val(response).attr('disabled', 'disabled');
    }
}

$("#btnAddTempProductReturn").on("click", function () {
    var CheckQaReview = {
        vWorkSpaceId: setworkspaceid,
        vDocTypeCode: "ZARC",
        nProductNo: $("#Product :selected").val(),
        nStudyProductBatchNo: $("#BatchLotNo :selected").val()
    }
    var CheckQaReviewData = {
        Url: BaseUrl + "PmsQualityCheckMovement/CheckIsQAReviewDone",
        SuccessMethod: "SuccessMethod",
        Data: CheckQaReview,
    }

    CheckQaReviewFunction(CheckQaReviewData.Url, CheckQaReviewData.SuccessMethod, CheckQaReviewData.Data);

});

var CheckQaReviewFunction = function (Url, SuccessMethod, Data) {
    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        async: false,
        success: SuccessInsertData,
        error: function () {
            SuccessorErrorMessageAlertBox("Error in checking QA Review.", ModuleName);
        }
    });
    function SuccessInsertData(response) {
        if (response == "success") {
            AddTempData();
        }
        else {
            SuccessorErrorMessageAlertBox("QA Review still Pending", ModuleName);
        }
    }
}

$("#btnAddProductData").on("click", function () {
    $("#ProjectNo").val($("#ddlProjectNodashboard").val());

    if (isBlank(document.getElementById('ddlProjectNodashboard').value)) {
        ValidationAlertBox("Please enter Project No.", "ddlProjectNodashboard", ModuleName);
        return false;
    }
    $("#txtDate").attr("autocomplete", "off");
    GetProductType();
    GetReason();
    var btnOperaion = (document.getElementById("btnAddProductData").innerText).toLowerCase();
    ClearHeaderDetail();
    ClearDetailPartData();

    document.getElementById('title').innerHTML = 'Product Destroy';
    jQuery("#titleMode").text('Mode:-Add');
    $("#ProjectNo").prop("disabled", "disabled");

});

$("#btnExitPmsProduct").on("click", function () {
    ConfirmAlertBox(ModuleName);
});

$("#btnClearPmsProduct").on("click", function () {
    ClearHeaderDetail();
    ClearDetailPartData();
    $("#divProductData").attr('style', 'display:none');
    $("#divKitData").attr('style', 'display:none');
});

$("#txtQuantity").on("blur", function () {
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

    if (QualityCheck())
        QuantityValidation();
});

function GetExportToExcelDetails() {
    if (productIds[$('#ddlProjectNodashboard').val()] != undefined) {
        setworkspaceid = productIds[$('#ddlProjectNodashboard').val()];
    }

    var Data_Export = {
        vWorkSpaceId: setworkspaceid,
        vDocTypeCode: DocTypeCode,
    }

    var url = WebUrl + "PmsProductDestroy/GetExportToExcelDetails";
    $.ajax({
        url: url,
        type: 'GET',
        async: false,  // double click solution
        data: Data_Export,
        success: function (data) { },
        error: function () { SuccessorErrorMessageAlertBox("Data not found in export to excel.", ModuleName); }
    });
}

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
    for (var i = 0; i < jsonData.length; i++) {
        var InDataset = [];
        date = jsonData[i].dReceiptDate.split(" ");
        InDataset.push(jsonData[i].vStudyCode, jsonData[i].vProductType, jsonData[i].cTransferIndi,
                       jsonData[i].vProductName, jsonData[i].vBatchLotNo, jsonData[i].vKitNo, jsonData[i].iReceivedQty, jsonData[i].vUnit,
                       jsonData[i].vReceiptRefNo, date[0], jsonData[i].vReasonDesc, jsonData[i].vRemarks,
                       jsonData[i].vModifyBy + "/</br>" + jsonData[i].dModifyOn);
        ActivityDataset.push(InDataset);
    }

    GetDashboardData(ActivityDataset);
}

function QualityCheck() {
    if (productIds[$('#ProjectNo').val()] != undefined) {
        setworkspaceid = productIds[$('#ProjectNo').val()];
    }
    var QualityCheckData = {
        vWorkSpaceId: setworkspaceid,
        vProductNo: $("#Product :selected").val(),
        nStudyProductBatchNo: $("#BatchLotNo :selected").val(),
        vRefModule: QuantityRefModule,
        vDocTypeCode: DocTypeCode
    }

    $.ajax({
        url: BaseUrl + "PmsGeneral/ArchiveQuantity",
        type: 'POST',
        data: QualityCheckData,
        async: false,
        success: function (response) {
            var totalqty = $("#txtQuantity").val();
            totalavailableqty = response;
            if (parseInt(response) < parseInt(totalqty)) {
                $("#txtQuantity").val("");

                ValidationAlertBox("Current Stock is " + response + " .", "ddlReason", ModuleName);
                return false;
            }
            else
                return true;
        },
        error: function () {

            SuccessorErrorMessageAlertBox("Quantity not found.", ModuleName);
            return false;
        }
    });
}

var GetPmsProjectNoProductReceipt = function (Url, SuccessMethod, ProjectNoDataTemp) {
    $.ajax({
        url: Url,
        type: 'GET',
        //data: { id: ProjectNoDataTemp.iUserId, projectno: ProjectNoDataTemp.vProjectNo, typecode: ProjectNoDataTemp.vProjectTypeCode },
        data: { iUserId: ProjectNoDataTemp.iUserId, vStudyCode: ProjectNoDataTemp.vStudyCode },
        async: false,
        success: function (jsonData) {
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
        },
        error: function () {
            ValidationAlertBox("Project not found.", "ddlProjectNodashboard", ModuleName);
        }
    });
}

function GetProductName() {
    if (productIds[$('#ProjectNo').val()] != undefined) {
        setworkspaceid = productIds[$('#ProjectNo').val()];
    }

    var projectid = setworkspaceid;
    var ProductData = {
        vWorkSpaceId: projectid,
        nProductTypeID: $("#ddlProductType").val(),
        cTransferIndi: TransferIndi,
    }
    var GetPmsProductReturn = {
        Url: BaseUrl + "PmsGeneral/ProductName",
        SuccessMethod: "SuccessMethod"
    }
    $.ajax({
        url: GetPmsProductReturn.Url,
        type: 'POST',
        data: ProductData,
        success: function (jsonData) {
            if (jsonData.length > 0) {
                $("#Product").empty().append('<option selected="selected" value="0">Please Select Product</option>');
                for (var i = 0; i < jsonData.length; i++)
                    $("#Product").append($("<option></option>").val(jsonData[i].nProductNo).html(jsonData[i].vProductName));
            }
            else {
                $("#Product").empty().append('<option selected="selected" value="0">Please Select Product</option>');
            }
        },
        asyn: false,
        error: function () {
            ValidationAlertBox("Product not found.", "Product", ModuleName);
        }
    });
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
        data: { id: setworkspaceid, projectno: productid },
        success: function (jsonData) {
            if (jsonData.length > 0) {
                $("#BatchLotNo").empty().append('<option selected="selected" value="0">Please Select Batch/Lot/Lot No</option>');
                for (var i = 0; i < jsonData.length; i++)
                    $("#BatchLotNo").append($("<option></option>").val(jsonData[i].nStudyProductBatchNo).html(jsonData[i].vBatchLotNo));
            }
            else {
                $("#BatchLotNo").empty().append('<option selected="selected" value="0">Please Select Batch/Lot/Lot No</option>');
            }
        },
        error: function () {
            ValidationAlertBox("Batch/Lot/Lot No not found.", "Product", ModuleName);
        }
    });
}

function AddTempData() {
    var strdata = "";

    var strTitle = "";
    if (ValidateForm() == false) {
        return false;
    }
    else {
        if (isBlank(document.getElementById('Remarks').value)) {
            ValidationAlertBox("Please enter Remarks.", "Remarks", ModuleName);
            return false;
        }

        var KitNo = [];
        var setKitNo = $.map($("#ddlKit option:selected"), function (ekit, i) {
            KitNo.push($(ekit).text());
        });

        var StudyProductLabelNo = [];
        var setLabelNo = $.map($("#ddlProductLabel option:selected"), function (eLabelNo, i) {
            StudyProductLabelNo.push($(eLabelNo).text());
        });

        var totallength = 1;
        if (TransferIndi == "K") {
            totallength = KitNo.length;
            var data = $('table#tblProductReturnAdd').find('tbody').find('tr');
            for (j = 0; j < totallength; j++) {
                for (i = 0; i < data.length; i++) {
                    if (KitNo[j] == $(data[i]).find('td:eq(3)').html()) {
                        ValidationAlertBox(KitNo[j] + " already exist in below table.", "ddlKit", ModuleName);
                        return false;
                        break;
                    }
                }
            }
        }
        else if (TransferIndi == "P") {
            totallength = 1;
        }

        for (i = 0; i < totallength; i++) {
            strdata += "<tr>";
            strdata += "<td class='hideproduct'>" + $("#Product :selected").text() + "</td>";
            strdata += "<td class='hideproduct'>" + $("#BatchLotNo :selected").text() + "</td>";
            strdata += "<td class='hideproduct'>" + $("#txtQuantity").val() + "</td>";
            strdata += "<td class='hidelabel'>" + StudyProductLabelNo[i] + "</td>";
            strdata += "<td class='hidekit'>" + KitNo[i] + "</td>";
            strdata += "<td>" + $("#ddlReason :selected").text() + "</td>";
            strdata += "<td>" + $("#Remarks").val() + "</td>";
            strdata += "<td class='hidetd'>" + $("#Product :selected").val() + "</td>";
            strdata += "<td class='hidetd'>" + $("#BatchLotNo :selected").val() + "</td>";
            strdata += "<td class='hidetd'>" + $("#ddlReason :selected").val() + "</td>";
            strdata += "<td class='hidetd'>" + $("#txtUsableStock").val() + "</td>";
            strdata += "<td id='trRemove'><span class='glyphicon glyphicon-remove' ></span></td>";
            strdata += "<td class='hidetd'>" + $("#ddlUnit").val() + "</td>";
            strdata += "</tr>";
        }

        $("#tbodyProductAdd").append(strdata);
        $("#tblProductReturnAdd thead").show();
        $("#tblProductReturnAdd").show();
        $("#btnSavePmsProduct").show();
        $(".hidetd").hide();

        if (TransferIndi == "K") {
            $(".hideproduct").hide();
            $(".hidekit").show();
            $(".hidelabel").hide();
        }
        else if (TransferIndi == "P") {
            $(".hideproduct").show();
            $(".hidekit").hide();
            $(".hidelabel").hide();
        }
        else if (TransferIndi == "L") {
            $(".hideproduct").hide();
            $(".hidekit").hide();
            $(".hidelabel").show();
        }

        ClearDetailPartData();
        $(".headercontrol").attr('disabled', 'disabled');
    }
}

function ClearDetailPartData() {
    $('#Product').val(0).attr("selected", "selected");
    $('#BatchLotNo').val(0).attr("selected", "selected");
    $('#ddlReason').val(0).attr("selected", "selected");
    $("#txtQuantity").val("");
    $("#Refno").val("");
    $("#Remarks").val("");
    $("#ddlKit").multiselect("clearSelection");
    $("#ddlKit").multiselect('refresh');
    document.getElementById('divKitData').style.display = 'none';
    document.getElementById('divProductData').style.display = 'none';
    document.getElementById('divProductLabel').style.display = 'none';

    $('#ddlUnit').val(0).attr("selected", "selected").prop("disabled", false);
    $("#divUnit").hide();
}

function ClearHeaderDetail() {
    $("#txtReferenceNo").val("");
    $("#tblProductReturnAdd tbody tr").remove();
    $("#tblProductReturnAdd thead").hide();
    $('#txtDate').data("DateTimePicker").clear();
    $("#ddlToProjectNo").val("");
    $(".headercontrol").prop('disabled', '');
    $('#ddlTransferIndi').val("0")
    $('#ddlProductType').val("0");
    $("#ddlProductCategory").val("0");
    document.getElementById('divProductCategory').style.display = "none";
    document.getElementById('divKitType').style.display = "none";

}

$("#tblProductReturnAdd").on('click', '#trRemove', function () {
    $(this).closest('tr').remove();
    if ($("#tblProductReturnAdd tr").length == 1) {
        $("#tblProductReturnAdd").hide();
        $("#btnSavePmsProduct").hide();
        $(".headercontrol").prop('disabled', '');
    }
    else {
        $("#tblProductReturnAdd").show();
        $("#btnSavePmsProduct").show();
        $(".headercontrol").attr('disabled', 'disabled');
    }
});

$("#btnSavePmsProduct").on('click', function () {
    $("#btnSavePmsProduct").hide();
    if (productIds[$('#ProjectNo').val()] != undefined) {
        setworkspaceid = productIds[$('#ProjectNo').val()];
    }
    var InsertPmsProductReceipt1 = {
        vWorkSpaceId: setworkspaceid,
        vReceiptRefNo: $("#txtReferenceNo").val(),
        vDocTypeCode: DocTypeCode,
        iModifyBy: $("#hdnuserid").val(),
        nStorageLocationNo: $('#ToStorage').val(),
        nProductTypeID: $('#ddlProductType :selected').val(),
        dReceiptDate: $("#txtDate").val(),
        cTransferIndi: TransferIndi,
    }
    var InsertQualityCheckData = {
        Url: BaseUrl + "PmsStudyProductReceipt/InsertPmsProductReceiptHeader",
        SuccessMethod: "SuccessMethod",
        Data: InsertPmsProductReceipt1,
    }
    InsertPmsQualityCheckMaster(InsertQualityCheckData.Url, InsertQualityCheckData.SuccessMethod, InsertQualityCheckData.Data);
    GetProductReturnDetail();
});

var InsertPmsQualityCheckMaster = function (Url, SuccessMethod, Data) {
    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        success: SuccessInsertData,
        error: function () {
            SuccessorErrorMessageAlertBox("Error in insert data.", ModuleName);
        }
    });
    function SuccessInsertData(TransactionNo) {
        var data = $('table#tblProductReturnAdd').find('tbody').find('tr');

        if (productIds[$('#ProjectNo').val()] != undefined) {
            setworkspaceid = productIds[$('#ProjectNo').val()];
        }

        var TempKitNo = "";
        var TempLabelNo = "";
        for (i = 0; i < data.length; i++) {
            if ($(data[i]).find('td:eq(3)').html() == "undefined") {
                TempLabelNo = "";
            }
            else {
                TempLabelNo = $(data[i]).find('td:eq(3)').html();
            }


            if ($(data[i]).find('td:eq(4)').html() == "undefined") {
                TempKitNo = "";
            }
            else {
                TempKitNo = $(data[i]).find('td:eq(4)').html();
            }


            var InsertPmsProductReceipt2 = {
                nTransactionNo: TransactionNo,
                vWorkSpaceId: setworkspaceid,
                nReasonNo: $(data[i]).find('td:eq(9)').html(),
                nProductNo: $(data[i]).find('td:eq(7)').html(),
                nStudyProductBatchNo: $(data[i]).find('td:eq(8)').html(),
                iReceivedQty: $(data[i]).find('td:eq(2)').html(),
                vRemarks: $(data[i]).find('td:eq(6)').html(),
                vDocTypeCode: DocTypeCode,
                vRefModule: RefModule,
                iStockQty: $(data[i]).find('td:eq(2)').html(),
                cLocationIndicator: LocationIndicator,
                iModifyBy: $("#hdnuserid").val(),
                vToWorkSpaceId: productIds[$('#ddlToProjectNo').val()],
                cAddSub: "S",
                cTransferIndi: TransferIndi,
                vKitNo: TempKitNo,
                vStudyProductLabelNo: TempLabelNo,
                vUnit: $(data[i]).find('td:eq(12)').html(),
            }

            var InsertProductReceiptData2 =
            {
                Url: BaseUrl + "PmsStudyProductReceipt/InsertPmsProductReceiptDetails",
                SuccessMethod: "SuccessMethod",
                Data: InsertPmsProductReceipt2
            }

            $.ajax({
                url: InsertProductReceiptData2.Url,
                type: 'POST',
                data: InsertProductReceiptData2.Data,
                async: false,
                success: SuccessInsertDataReceipt,
                error: function () {
                    SuccessorErrorMessageAlertBox("Error to save data in details portion.", ModuleName);
                }
            });
            function SuccessInsertDataReceipt(response) {
                GetProductReturnDetail();
                $("#btnSavePmsProduct").hide();
                $("#ProductModel").modal('hide');
                SuccessorErrorMessageAlertBox("Product Destroy saved successfully.", ModuleName);
            }
        }
    }
}

function ValidateForm() {
    if (Dropdown_Validation(document.getElementById("ddlProductType"))) {
        ValidationAlertBox("Please select Product Type.", "ddlProductType", ModuleName);
        return false;
    }

    if (isBlank(document.getElementById('ProjectNo').value)) {
        ValidationAlertBox("Please enter Project Number.", "ProjectNo", ModuleName);
        return false;
    }

    if (isBlank(document.getElementById('txtDate').value)) {
        ValidationAlertBox("Please enter date of Destroy.", "txtDate", ModuleName);
        return false;
    }

    if (Dropdown_Validation(document.getElementById("ddlTransferIndi"))) {
        ValidationAlertBox("Please select Product Indication.", "ddlTransferIndi", ModuleName);
        return false;
    }

    if ($("#ddlTransferIndi").val() == "P") {
        if (Dropdown_Validation(document.getElementById("ddlProductCategory"))) {
            ValidationAlertBox("Please select Product Category.", "ddlProductCategory", ModuleName);
            return false;
        }
    }


    if (TransferIndi == "P") {
        if (Dropdown_Validation(document.getElementById("Product"))) {
            ValidationAlertBox("Please select Product.", "Product", ModuleName);
            return false;
        }

        if (Dropdown_Validation(document.getElementById("BatchLotNo"))) {
            ValidationAlertBox("Please select Batch/Lot/Lot No.", "BatchLotNo", ModuleName);
            return false;
        }

        if (isBlank(document.getElementById('txtQuantity').value)) {
            ValidationAlertBox("Please enter Quantity.", "txtQuantity", ModuleName);
            return false;
        }
        else if (parseInt(document.getElementById('txtQuantity').value) == 0 && ($('#txtQuantity').val()).length <= 12) {
            document.getElementById('txtQuantity').value = "";
            return false;
        }
    }
    else if (TransferIndi == "K") {
        if (Dropdown_Validation(document.getElementById("ddlKitType"))) {
            ValidationAlertBox("Please select Kit Type.", "ddlKitType", ModuleName);
            return false;
        }

        if (isBlank(document.getElementById('ddlKit').value)) {
            ValidationAlertBox("Please select Kit.", "ddlKit", ModuleName);
            return false;
        }
    }
    else if (TransferIndi == "L") {
        if (isBlank(document.getElementById('ddlProductLabel').value)) {
            ValidationAlertBox("Please select Product Label.", "ddlProductLabel", ModuleName);
            return false;
        }
    }
    if (Dropdown_Validation(document.getElementById("ddlReason"))) {
        ValidationAlertBox("Please select Reason.", "ddlReason", ModuleName);
        return false;
    }
    return true;
}

function GetActionName() {
    actionname = $("#hndActionName").val();
    DocTypeCode = "ZDES";
    RefModule = "DS";
    LocationIndicator = "Q";
    QuantityRefModule = "PD";
}

function GetDashboardData(ActivityDataset) {
    if (ActivityDataset.length == 0) {
        $("#divexport").css("visibility", "hidden");
    }
    else {
        $("#divexport").show();
    }
    if (setworkspaceid != "") {
        otable = $('#tblPmsProductData').dataTable({
            "bJQueryUI": true,
            "sPaginationType": "full_numbers",
            "bLengthChange": true,
            "iDisplayLength": 10,
            "bProcessing": true,
            "bSort": true,
            "autoWidth": true,
            "aaData": ActivityDataset,
            "aaSorting": [],
            "bInfo": true,
            "bAutoWidth": false,
            "bDestroy": true,
            "sScrollX": "100%",
            "sScrollXInner": "2000" /* It varies dynamically if number of columns increases */,
            "aoColumns": [
                { "sTitle": "Project No" },
                { "sTitle": "Product Type" },
                { "sTitle": "Product Indication" },
                { "sTitle": "Product Name" },
                { "sTitle": "Batch/Lot/Lot No" },
                { "sTitle": "Kit/Label No" },
                { "sTitle": "Quantity" },
                { "sTitle": "Unit" },
                { "sTitle": "Reference No" },
                { "sTitle": "Date of Destroy" },
                { "sTitle": "Reason" },
                { "sTitle": "Remarks" },
                { "sTitle": "Destroy By" },

            ],
            "columnDefs": [
                { "width": "2%", "targets": 0 },
                { "width": "3%", "targets": 1 },
                { "width": "5%", "targets": 2 },
                { "width": "4%", "targets": 3 },
                { "width": "4%", "targets": 4 },
                { "width": "3%", "targets": 5 },
                { "width": "3%", "targets": 6 },
                { "width": "3%", "targets": 7 },
                { "width": "5%", "targets": 8 },
                { "width": "3%", "targets": 9 },
                { "width": "4%", "targets": 10 },
                { "width": "4%", "targets": 11 },
                { "width": "7%", "targets": 12 },
            ],
            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },
        });
    }
}

function GetReason() {
    var FilterData = {
        vOperationCode: $("#hdnOperationcode").val(),
        vLocationCode: $("#hdnUserLocationCode").val(),
    }
    $.ajax({
        url: BaseUrl + "PmsGeneral/ReasonLocationWise",
        type: 'POST',
        data: FilterData,
        asyc: false,
        success: function (jsonData) {
            if (jsonData.length > 0) {
                $("#ddlReason").empty().append('<option selected="selected" value="0">Please Select Reason</option>');
                for (var i = 0; i < jsonData.length; i++) {
                    $("#ddlReason").append($("<option></option>").val(jsonData[i].nReasonNo).html(jsonData[i].vReasonDesc));
                }
            }
            else {
                $("#ddlReason").empty().append('<option selected="selected" value="0">Please Select Reason</option>');
            }
        },
        error: function () {
            ValidationAlertBox("Reason not found.", "ddlReason", ModuleName);
        }
    });
}

var GetAllPmsQualityCheckToStorage = function (Url, SuccessMethod) {
    $.ajax({
        url: Url,
        type: 'GET',
        success: function (jsonData) {
            if (jsonData.length > 0) {
                for (var i = 0; i < jsonData.length; i++) {
                    $("#ToStorage").empty().append($("<option></option>").val(jsonData[i].nStorageTypeId).html(jsonData[i].vStorageType));
                }
                $("#ToStorage").prop('disabled', 'disabled');
            }
        },
        error: function () {
            ValidationAlertBox("To Storage not found.", "ToStorage", ModuleName);
        }
    });
}

function GetProductType() {
    var GetProductType = {
        Url: BaseUrl + "PmsGeneral/GetProductType/" + setworkspaceid,
        SuccessMethod: "SuccessMethod"
    }

    // For server
    $.ajax({
        type: "GET",
        url: BaseUrl + "PmsGeneral/GetProductType",
        data: { id: setworkspaceid },
       // contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (jsonData) {
            $("#ddlProductType").empty().append('<option selected="selected" value="0">Please Select Product Type</option>');
            for (var i = 0; i < jsonData.length; i++) {
                $("#ddlProductType").append($("<option></option>").val(jsonData[i].nProductTypeID).html(jsonData[i].vProductType));
            }
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Product Type not found.", ModuleName);
        }
    });

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

    // For Server use

    $.ajax({
        type: "GET",
        url: BaseUrl + "PmsGeneral/GetSetProjectDetails",
        data: { id: PassData.iUserId },
       // contentType: "application/json; charset=utf-8",
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
        }
        else {
            $('#ddlProjectNodashboard').val('');
        }
    }
}

function BindData() {
    GetProductReturnDetail();
    GetExportToExcelDetails();
}

function QuantityValidation() {
    var batchno = $("#BatchLotNo").val();
    var productno = $("#Product").val();

    var table = document.getElementById('tblProductReturnAdd'),
    rows = table.getElementsByTagName('tr'),
    i, j, cells, customerId;
    var totalqty = 0;
    for (i = 0, j = rows.length; i < j; ++i) {
        cells = rows[i].getElementsByTagName('td');
        if (!cells.length) {
            continue;
        }
        if (productno == cells[6].innerHTML) {
            if (batchno == cells[7].innerHTML) {
                totalqty = parseInt(totalqty) + parseInt(cells[4].innerHTML);
            }
        }
    }

    var totalnetqty = 0;
    totalnetqty = parseInt(totalqty) + parseInt($("#txtQuantity").val());
    if (parseInt(totalavailableqty) < parseInt(totalnetqty)) {
        ValidationAlertBox("Current Stock is " + totalavailableqty + " .", "BatchLotNo", ModuleName);
        $("#txtQuantity").val("");
        return false;
    }
}

function GetKit() {
    $('#divKitData .multiselect-container li').remove();

    var PostData = {
        vWorkSpaceID: setworkspaceid,
        nProductTypeID: $("#ddlProductType").val(),
        vDocTypeCode: 'ZDES',
        nKitTypeNo: $("#ddlKitType").val(),
    }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/Proc_GetAvailableKitNo",
        type: 'POST',
        data: PostData,
        success: function (jsonData) {
            $('#ddlKit option').each(function () {
                $(this).remove();
            });

            for (var i = 0; i < jsonData.length; i++) {
                $("#ddlKit").append($("<option></option>").val(jsonData[i].vKitNo).html(jsonData[i].vKitNo));
                $('#ddlKit').multiselect('rebuild');
            }
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Kit Data is not found.", ModuleName);
        }
    });
}

function GetKitType() {
    $.ajax({
        url: BaseUrl + "PmsRecordFetch/GetKitTypeNumber/" + setworkspaceid + "",
        type: 'GET',
        async: false,
        success: function (JsonData) {
            var KitNo = "";
            for (var i = 0; i < JsonData.length; i++) {
                KitNo += JsonData[i].nKitTypeNo + ","
            }
            KitNo += "-";

            var PostData = {
                WhereCondition_1: "nKitTypeNo in (" + KitNo.split(",-")[0] + ") AND nProductTypeID IN (" + $("#ddlProductType").val() + ")",
                columnName_1: "Distinct nKitTypeNo,vKitTypeDesc",
            }

            $.ajax({
                url: BaseUrl + "PmsRecordFetch/View_StudyProductKitCreationDtl",
                type: 'POST',
                data: PostData,
                async: false,
                success: function (jsonData) {
                    jsonData = jsonData.Table;
                    $("#ddlKitType").empty().append('<option selected="selected" value="0">Please Select Kit Type</option>');
                    for (var i = 0; i < jsonData.length; i++) {
                        $("#ddlKitType").append($("<option></option>").val(jsonData[i].nKitTypeNo).html(jsonData[i].vKitTypeDesc));
                    }
                },
                error: function () {
                    ValidationAlertBox("Kit Type Data is not found.", "ddlKitType", ModuleName);
                }
            });
        },
        error: function () {
            ValidationAlertBox("Kit Type Data is not found.", "ddlKitType", ModuleName);
        }
    });
}

$("#ddlKitType").on("change", function () {
    //var value = $("#ddlKitType").val();
    document.getElementById("divProductData").style.display = "none";
    document.getElementById("divProductLabel").style.display = "none";
    document.getElementById("divKitData").style.display = "block";
    GetKit();
});

$("#ddlProductCategory").on("change", function () {
    ClearDetailPartData();
    var value = $("#ddlProductCategory").val();
    document.getElementById("divKitData").style.display = "none";
    document.getElementById("divKitType").style.display = "none";
    TransferIndi = value;

    if (value == "P") {
        document.getElementById("divProductData").style.display = "block";
        document.getElementById("divProductLabel").style.display = "none";
        GetProductName();
    }
    else if (value == "L") {
        document.getElementById("divProductData").style.display = "none";
        document.getElementById("divProductLabel").style.display = "block";
        document.getElementById("divUnit").style.display = "none";
        GetStudyProductLabel();
    }
});

function GetStudyProductLabel() {
    var PostData = {
        vWorkSpaceID: setworkspaceid,
        nProductTypeID: $("#ddlProductType").val(),
        vDocTypeCode: "ZDES",
    }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/Proc_GetAvailableProductLabelNo",
        type: 'POST',
        data: PostData,
        success: function (jsonData) {
            if (jsonData.length >= 0) {
                $('#ddlProductLabel').multiselect('rebuild');
            }

            $('#ddlProductLabel option').each(function () {
                $(this).remove();
            });

            for (var i = 0; i < jsonData.length; i++) {
                $("#ddlProductLabel").append($("<option></option>").val(jsonData[i].vStudyProductLabelNo).html(jsonData[i].vStudyProductLabelNo));
                $('#ddlProductLabel').multiselect('rebuild');
            }
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Study Product Label not found.", ModuleName);
        }
    });
}

$("#txtQuantity").on('keypress', function (e) {
    debugger;
    var regExp = /[a-z]/i;
    var value = String.fromCharCode(e.which) || e.key;
    if (regExp.test(value)) {
        e.preventDefault();
        return false;
    }
});