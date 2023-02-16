var productIds = new Object();
var actionname;
var DocTypeCode;
var RefModule;
var LocationIndicator;
var setworkspaceid = "";
var QuantityRefModule;
var viewmode;
var totalavailableqty = 0;
var ModuleName = "Product/Kit Transfer";
var TransferIndi = "";

$(document).ready(function () {

    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('.modal').modal('hide');

    GetViewMode();
    GetStorageLocation();

    $("#spnwelcome").html($("#hdnusername").val());
    $("#spnLoginTime").html($("#hdnlogintime").val());
    CheckSetProject();

    if (setworkspaceid != "") {
        BindData();
    }
    //Get Project No
    var GetProjectNo =
    {
        Url: BaseUrl + "PmsProductBatch/GetProjectNo",
        SuccessMethod: "SuccessMethod"
    }

    $('#ddlProjectNodashboard').on('change keyup', function () {
        if ($('#ddlProjectNodashboard').val().length == 2) {
            var ProjectNoDataTemp = {
                vProjectNo: $('#ddlProjectNodashboard').val(),
                iUserId: $("#hdnuserid").val(),
                vProjectTypeCode: $("#hdnscopevalues").val(),
            }
            GetPmsProjectNoProductReceipt(GetProjectNo.Url, GetProjectNo.SuccessMethod, ProjectNoDataTemp);
        }
        else if ($('#ddlProjectNodashboard').val().length < 2) {
            $("#ddlProjectNodashboard").autocomplete({
                source: "",
                change: function (event, ui) { }
            });
        }
    });

    GetPmsQualityCheckToStrage = {
        Url: BaseUrl + "PmsQualityCheckMovement/GetFromStorageLocationName",
        SuccessMethod: "SuccessMethod",
    }
    GetAllPmsQualityCheckToStorage(GetPmsQualityCheckToStrage.Url, GetPmsQualityCheckToStrage.SuccessMethod);

    $('#ddlStorageArea').multiselect({
        nonSelectedText: 'Please Select StorageArea',
        buttonClass: 'form-control',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        numberDisplayed: 2,
    });
});

$("#Product").on("change", function () {
    GetBatchLotNo();
});

$("#btnAddTempProductReturn").on("click", function () {
    AddTempData();
});

$("#btnAddProductData").on("click", function () {
    GetProductType();
    GetReason();

    ClearHeaderDetail();
    ClearDetailPartData();
    

    jQuery("#titleMode").text('Mode:-Add');
    $("#ProjectNo").prop("disabled", "disabled");


    var GETStorageArea = {
        Url: BaseUrl + "PmsGeneral/ALLStorageAreaData",
        SuccessMethod: "SuccessMethod"
    }
    var FilterData = {
        nStorageTypeId: 2,
        vLocationCode: $("#hdnUserLocationCode").val(),
    }
    GetStorageArea(GETStorageArea.Url, FilterData);
});

$("#btnExitPmsProduct").on("click", function () {
    ConfirmAlertBox(ModuleName);
});

$("#btnClearPmsProduct").on("click", function () {
    ClearHeaderDetail();
    ClearDetailPartData();
    $(".divkit").attr("style", "display:none");
    document.getElementById("divProduct").style.display = "none";
});

$("#ddlProductType").on("change", function () {
    TransferIndi = $("#ddlTransferIndi").val();
    var TempProductType = $("#ddlProductType").val();

    GetProductName();
    return true;
    if (TempProductType != "0") {
        if (TransferIndi == "P") {
            $("#divProduct").attr("style", "display:inline");
            $("#divkit").attr("style", "display:none");
            GetProductName();
        }
        else if (TransferIndi == "K") {
            $("#divProduct").attr("style", "display:none");
            $("#divkit").attr("style", "display:inline");
            GetKitType();
        }
        else {
            $("#divProduct").attr("style", "display:none");
            $("#divkit").attr("style", "display:none");
        }
    }
    else {
        $("#divProduct").attr("style", "display:none");
        $("#divkit").attr("style", "display:none");
    }
});

$("#ddlProductCategory").on("change", function () {
    GetProductName();
});

function GetProductReturnDetail() {
    if (productIds[$('#ddlProjectNodashboard').val()] != undefined) {
        setworkspaceid = productIds[$('#ddlProjectNodashboard').val()];
    }

    GetData('');
}

function GetData(jsonData) {
    var srno;
    var ActivityDataset = [];
    $("#divexport").css("visibility", "visible");
    var date;

    if (ActivityDataset.length == 0) {
        $("#divexport").css("visibility", "hidden");
    }
    else {
        $("#divexport").show();
    }

    var otable = $('#tblPmsProductData').dataTable({
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
        //"sScrollY": "200px",
        "sScrollX": "100%",
        "sScrollXInner": "2000" /* It varies dynamically if number of columns increases */,
        "aoColumns": [
            { "sTitle": "From Location" },
            { "sTitle": "To Location" },
            { "sTitle": "Product" },
            { "sTitle": "Reference No" },
            { "sTitle": "Product Name" },
            { "sTitle": "Batch/Lot/Lot No" },
            { "sTitle": "Quantity" },
            { "sTitle": "Reason" },
            { "sTitle": "Storage Area" },
            { "sTitle": "Remarks" },
            { "sTitle": "Transfer By" },

        ],
        "columnDefs": [
            { "width": "2%", "targets": 0 },
            { "width": "3%", "targets": 1 },
            { "width": "3%", "targets": 2 },
            { "width": "2%", "targets": 3 },
            { "width": "4%", "targets": 4 },
            { "width": "3%", "targets": 5 },
            { "width": "2%", "targets": 6 },
            { "width": "3%", "targets": 7 },
            { "width": "3%", "targets": 8 },
            { "width": "4%", "targets": 9 },
            { "width": "3%", "targets": 10 },

        ],
        "oLanguage": {
            "sEmptyTable": "No Record Found",
        },
    });

}

var GetStorageArea = function (Url, FilterData) {
    $('#ddlStorageArea option').each(function () {
        $(this).remove();
    });
    $.ajax({
        url: Url,
        type: 'POST',
        data: FilterData,
        asyc: false,
        success: function (jsonData) {
            if (jsonData.length > 0) {
                for (var i = 0; i < jsonData.length; i++) {
                    $("#ddlStorageArea").append($("<option></option>").val(jsonData[i].nStorageAreaNo).html(jsonData[i].vStorageAreaName + " | " + jsonData[i].vCompartmentName + " | " + jsonData[i].vRackName));
                    $('#ddlStorageArea').multiselect('rebuild');
                }
            }
        },
        error: function () {
            ValidationAlertBox("Storage Area Not Found !", "ddlStorageArea", ModuleName);
        }
    });
}

var GetPmsProjectNoProductReceipt = function (Url, SuccessMethod, ProjectNoDataTemp) {
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
            ValidationAlertBox("Project Not Found !", "ddlProjectNodashboard", ModuleName);
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
            ValidationAlertBox("Product Not Found !", "Product", ModuleName);
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
            ValidationAlertBox("Batch/Lot/Lot No Not Found !", "Product", ModuleName);
        }
    });
}

function ValidateForm() {
    if (Dropdown_Validation(document.getElementById("ddlFromLocation"))) {
        ValidationAlertBox("Please Select From Location !", "ddlFromLocation", ModuleName);
        return false;
    }
    else if (Dropdown_Validation(document.getElementById("ddlToLocation"))) {
        ValidationAlertBox("Please Select To Location !", "ddlToLocation", ModuleName);
        return false;
    }
    else if (Dropdown_Validation(document.getElementById("Product"))) {
        ValidationAlertBox("Please Select Product !", "Product", ModuleName);
        return false;
    }
    else if (Dropdown_Validation(document.getElementById("BatchLotNo"))) {
        ValidationAlertBox("Please Select Batch/Lot/Lot No.", "BatchLotNo", ModuleName);
        return false;
    }
    else if (isBlank(document.getElementById('txtQuantity').value)) {
        ValidationAlertBox("Please Enter Quantity !", "txtQuantity", ModuleName);
        return false;
    }
    else if (Dropdown_Validation(document.getElementById("ddlReason"))) {
        ValidationAlertBox("Please Select Reason !", "ddlReason", ModuleName);
        return false;
    }
    else if (isBlank(document.getElementById('ddlStorageArea').value)) {
        ValidationAlertBox("Please Select Storage Area !", "ddlStorageArea", ModuleName);
        return false;
    }
    else if (isBlank(document.getElementById('Remarks').value)) {
        ValidationAlertBox("Please Enter Remarks !", "Remarks", ModuleName);
        return false;
    }

    return true;
}

function AddTempData() {
    var strdata = "";

    var strTitle = "";
    if (ValidateForm() == false) {
        return false;
    }
    else {
        var selMulti = $.map($("#ddlStorageArea option:selected"), function (el, i) {
            return $(el).text();
        });

        strdata += "<tr>";
        strdata += "<td>" + $("#ddlFromLocation :selected").text() + "</td>";
        strdata += "<td>" + $("#ddlToLocation :selected").text() + "</td>";
        strdata += "<td>" + $("#ddlProductType :selected").text() + "</td>";
        strdata += "<td>" + $("#txtReferenceNo").val() + "</td>";
        strdata += "<td>" + $("#Product :selected").text() + "</td>";
        strdata += "<td>" + $("#BatchLotNo :selected").text() + "</td>";
        strdata += "<td>" + $("#txtQuantity").val() + "</td>";
        strdata += "<td>" + $("#ddlReason :selected").text() + "</td>";
        strdata += "<td>" + (selMulti.join(", ")) + "</td>";
        strdata += "<td>" + $("#Remarks").val() + "</td>";
        strdata += "<td id='trRemove'><span class='glyphicon glyphicon-remove' ></span></td>";
        strdata += "</tr>";

        $("#tbodyProductAdd").append(strdata);
        $("#tblProductReturnAdd thead").show();
        $("#tblProductReturnAdd").show();
        $("#btnSavePmsProduct").show();
        $(".hidetd").hide();

        if (TransferIndi == "K") {
            $(".hideproduct").hide();
            $(".hidekit").show();
            $(".hideProductWithLabel").hide();
        }
        else if (TransferIndi == "P") {
            var ProductCategory = $("#ddlProductCategory").val()
            if (ProductCategory == "Without") {
                $(".hideproduct").show();
                $(".hideProductWithLabel").hide();

            }
            else if (ProductCategory = "With") {
                $(".hideProductWithLabel").show();
                $(".hideproduct").hide();
            }
            $(".hidekit").hide();
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
    $("#ddlStorageArea").multiselect("clearSelection");
    $("#ddlStorageArea").multiselect('refresh');
    $("#ddlKit").multiselect("clearSelection");
    $("#ddlKit").multiselect('refresh');

    $("#ddlProductLabel").multiselect("clearSelection");
    $("#ddlProductLabel").multiselect('refresh');
}

function ClearHeaderDetail() {
    $("#txtReferenceNo").val("");
    $("#txtSendTo").val("");
    $("#ShipmentNo").val("");
    $('#ddlProductType').val(0).attr("selected", "selected");
    $("#tblProductReturnAdd tbody tr").remove();
    $("#tblProductReturnAdd thead").hide();
    $("#ddlToProjectNo").val("");
    $(".headercontrol").prop('disabled', '');
    $('#ddlTransferIndi').val(0).attr("selected", "selected");
    $('#ddlProductCategory').val(0).attr("selected", "selected");
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

function GetReason() {
    var FilterData = {
        vOperationCode: '0570',
        vLocationCode: $("#hdnUserLocationCode").val(),
    }
    $.ajax({
        url: BaseUrl + "PmsGeneral/ReasonLocationWise",
        type: 'POST',
        data: FilterData,
        asyc: false,
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("Reason Not Found !", "ddlReason", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        if (jsonData.length > 0) {
            $("#ddlReason").empty().append('<option selected="selected" value="0">Please Select Reason</option>');
            for (var i = 0; i < jsonData.length; i++) {
                $("#ddlReason").append($("<option></option>").val(jsonData[i].nReasonNo).html(jsonData[i].vReasonDesc));
            }
        }
        else {
            $("#ddlReason").empty().append('<option selected="selected" value="0">Please Select Reason</option>');
        }
    }
}

var GetAllPmsQualityCheckToStorage = function (Url, SuccessMethod) {
    $.ajax({
        url: Url,
        type: 'GET',
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("To Storage Not Found !", "ToStorage", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        if (jsonData.length > 0) {
            for (var i = 0; i < jsonData.length; i++) {
                $("#ToStorage").empty().append($("<option></option>").val(jsonData[i].nStorageTypeId).html(jsonData[i].vStorageType));
            }
            $("#ToStorage").prop('disabled', 'disabled');
        }
    }
}

function GetProductType() {
    var GetProductType = {
        Url: BaseUrl + "PmsGeneral/GetProductType/" + setworkspaceid,
        SuccessMethod: "SuccessMethod"
    }

    $.ajax({
        url: GetProductType.Url,
        type: 'GET',
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("Product Type Not Found !", "ddlProductType", ModuleName);
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
        url: Url,
        type: 'GET',
        async: false,
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("Project Not Found !", "ddlProjectNodashboard", ModuleName);
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
}


function GetViewMode() {
    var ViewModeIDWebConfig = $("#hdnViewModeID").val().split(",");
    for (i = 0; i < ViewModeIDWebConfig.length; i++) {
        if ($("#hdnUserTypeCode").val().trim() == ViewModeIDWebConfig[i]) {
            document.getElementById('btnAddProductData').style.visibility = "hidden";
            viewmode = "OnlyView";
            break;
        }
        else {
            viewmode = "";
        }
    }
}

function GetStorageLocation() {
    var PostData = {
        WhereCondition_1: "cStatusIndi <> 'D'",
    }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/StorageLocation",
        type: 'POST',
        data: PostData,
        success: function (jsonData) {
            jsonData = jsonData.Table;
            $("#ddlFromLocation").empty().append('<option selected="selected" value="0">Please Select From Location</option>');
            $("#ddlToLocation").empty().append('<option selected="selected" value="0">Please Select To Location</option>');

            if (jsonData.length > 0) {
                for (var i = 0; i < jsonData.length; i++) {
                    $("#ddlFromLocation").append($("<option></option>").val(jsonData[i].nStorageLocationNo).html(jsonData[i].vStorageLocationName));
                    $("#ddlToLocation").append($("<option></option>").val(jsonData[i].nStorageLocationNo).html(jsonData[i].vStorageLocationName));
                }
            }
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Kit Type Data Is Not Found !", ModuleName);
        }
    });
}