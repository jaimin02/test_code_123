var productIds = new Object();
var childProjectId = new Object();
var actionname;
var DocTypeCode;
var RefModule;
var LocationIndicator;
var setworkspaceid = "";
var QuantityRefModule;
var viewmode;
var totalavailableqty = 0;
var ModuleName = "Product Transfer";
var TransferIndi = "";
var vProjectNo = "";
var StageCode = "";
var StageName = "";
var ValidUserTypeCode;
var reviewerFlag = false;

$(document).ready(function () {

    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('.modal').modal('hide');

    var GetWorkflowUserRightsData = {
        vUserTypeCode: $("#hdnUserTypeCode").val(),
        vDocTypeCode: 'ZSTN',
    }

    var GetWorkflowUserRights = {
        Url: BaseUrl + "PmsStudyProductReceipt/GetPmsProductReceiptWorkflowRights",
        Data: GetWorkflowUserRightsData
    }

    $.ajax({
        url: GetWorkflowUserRights.Url,
        type: 'POST',
        async: false,
        data: GetWorkflowUserRights.Data,
        success: function (jsonResult) {

            if (jsonResult.length > 0) {
                StageCode = jsonResult[0].StageCode;
                ValidUserTypeCode = jsonResult[0].UserTypeCode;
                StageName = jsonResult[0].StageName;

                if (StageName == "PM") {
                    StageCode = "";
                    $("#btnAddProductData").hide();
                }
            }
        }
    });

    GetActionName();
    GetViewMode();

    $("#spnwelcome").html($("#hdnusername").val());
    $("#spnLoginTime").html($("#hdnlogintime").val());
    CheckSetProject();

    if (setworkspaceid != "") {
        BindData();
    }
    //Get Project No
    var GetProjectNo =
    {
        Url: BaseUrl + "PmsGeneral/GetScopeWiseProject",
        SuccessMethod: "SuccessMethod"
    }

    //Get GetProtocolAndSite
    var GetProtocolAndSite =
    {
        Url: BaseUrl + "PmsProductBatch/GetProtocolAndSite",
        SuccessMethod: "SuccessMethod"
    }

    $('#ddlProjectNodashboard').on('change keyup', function () {
        if ($('#ddlProjectNodashboard').val().length == 2) {
           
            //var ProjectNoDataTemp = {
            //    vStudyCode: $("#ddlProjectNodashboard").val(),
            //}

            var ProjectNoDataTemp = {
                iUserId: $("#hdnuserid").val(),
                vStudyCode: $("#ddlProjectNodashboard").val(),
            }

            GetPmsProjectNoProductReceiptForParentProject(GetProjectNo.Url, GetProjectNo.SuccessMethod, ProjectNoDataTemp);
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

    $('#ddlStorageArea').multiselect({
        nonSelectedText: 'Please Select StorageArea',
        buttonClass: 'form-control',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        numberDisplayed: 2,
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

    $('#txtDate').datetimepicker({
        format: 'DD-MMMM-YYYY',
    });

    $('#txtShipmentDate').datetimepicker({
        format: 'DD-MMMM-YYYY',
        showClose: true,
    });
});

$('#ddlToProjectNo').on('change keyup', function () {
    var GetProtocolAndSite =
    {
        //Url: BaseUrl + "PmsProductBatch/GetProjectNo",
        Url: BaseUrl + "PmsProductBatch/GetProtocolAndSite",
        SuccessMethod: "SuccessMethod"
    }

    if ($('#ddlToProjectNo').val().length == 2) {
        var ProjectNoDataTemp = {
            //vStudyCode: $("#ProjectNo").val().split('[')[1].split(']')[0].replaceAll(/\s/g, '')
            vStudyCode: $("#ProjectNo").val().match(/\[(.*?)\]/)[1].replaceAll(/\s/g, ''),
        }
        //GetPmsProjectNoProductReceipt(GetProjectNo.Url, GetProjectNo.SuccessMethod, ProjectNoDataTemp);
        GetPmsProjectNoProductReceipt(GetProtocolAndSite.Url, GetProtocolAndSite.SuccessMethod, ProjectNoDataTemp);
    }
    else if ($('#ddlToProjectNo').val().length < 2) {
        $("#ddlToProjectNo").autocomplete({
            source: "",
            change: function (event, ui) { }
        });
    }
});

$("#ddlProjectNodashboard").on("blur", function () {
    BindData();
});

$("#ddlToProjectNo").on("blur", function () {
    if ($("#ddlToProjectNo").val() == 'undefined')//|| $("#ddlToProjectNo").val() == ""
    {
            ValidationAlertBox("To Project Number is not valid.", "ddlToProjectNo", ModuleName);
            return false;
    }

    //Get Site Details By Site No
    var Data = {
        vStudyCode: $("#ddlToProjectNo").val().match(/\[(.*?)\]/)[1].replaceAll(/\s/g, ''),
    }
  
    $.ajax({
        url: BaseUrl + "PmsProductBatch/GetProtocolAndSiteByView?vStudyCode=" + Data.vStudyCode,
        type: 'GET',
        success: SuccessMethod,
        async: false,
        error: function () {
            SuccessorErrorMessageAlertBox("ProjectNo is not found.", ModuleName);
        }
    });
    function SuccessMethod(jsonData) {
        var jsonObj = jsonData;
        $("#txtPIName").val(jsonObj[0].vPIName);
        $("#txtSiteAddress").val(jsonObj[0].vSiteAddress);
        $("#txtConPerson").val(jsonObj[0].ContactPerson)
    }

});

$("#Product").on("change", function () {
    $("#txtQuantity").val("");
    GetBatchLotNo();
    $('#ddlReason').val(0).attr("selected", "selected");
    $("#ddlStorageArea").multiselect("clearSelection");
    $("#ddlStorageArea").multiselect('refresh');
    $("#txtNoOfContainers").val('');
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
    $("#ddlStorageArea").multiselect("clearSelection");
    $("#ddlStorageArea").multiselect('refresh');
    $("#txtNoOfContainers").val('');
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
    AddTempData();
});

$("#btnAddProductData").on("click", function () {
    $("#ProjectNo").val($("#ddlProjectNodashboard").val());

    if (isBlank(document.getElementById('ddlProjectNodashboard').value)) {
        ValidationAlertBox("Please enter Project No.", "ddlProjectNodashboard", ModuleName);
        return false;
    }

    GetProductType();
    GetReason();

    ClearHeaderDetail();
    ClearDetailPartData();
    document.getElementById("divProduct").style.display = "none";
    $(".divkit").attr("style", "display:none");

    document.getElementById('title').innerHTML = 'Product/Kit Transfer';
    jQuery("#titleMode").text('Mode:-Add');
    $("#ProjectNo").prop("disabled", "disabled");

    var GETStorageArea = {
        Url: BaseUrl + "PmsGeneral/ALLStorageAreaData",
        SuccessMethod: "SuccessMethod"
    }
    var FilterData = {
        nStorageTypeId: $("#ToStorage :selected").val(),
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

$("#txtQuantity").on("blur", function () {
    QualityCheck();
    QuantityValidation();
});

$("#ddlTransferIndi").on("change", function () {

    ClearDetailPartData();
    TransferIndi = $("#ddlTransferIndi").val();

    if (TransferIndi == "P") {
        if ($("#ddlProductType").val() != "0") {
            $("#divProductCategory").attr("style", "display:inline");
            $(".divkit").attr("style", "display:none");
            $("#ddlProductCategory").val("0");
        }
    }
    else if (TransferIndi == "K") {
        if ($("#ddlProductType").val() != "0") {
            $(".divkit").attr("style", "display:block");
            document.getElementById("divProductCategory").style.display = "none";
            document.getElementById("divProductWithLabel").style.display = "none";
            document.getElementById("divProduct").style.display = "none";
            GetKitType();
        }
    }
    else {
        document.getElementById("divProduct").style.display = "none";
        $(".divkit").attr("style", "display:none");
    }
});

$("#ddlProductType").on("change", function () {
    ClearDetailPartData();
    TransferIndi = $("#ddlTransferIndi").val();
    var TempProductType = $("#ddlProductType").val();

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
    ClearDetailPartData();

    var ProductCategory = $("#ddlProductCategory").val()

    if (ProductCategory == "With") {
        $("#divProduct").attr("style", "display:none");
        $("#divProductWithLabel").attr("style", "display:block");
        $("#divUnit").attr("style", "display:none");
        GetStudyProductLabel();
    }
    else if (ProductCategory == "Without") {
        GetProductName();
        $("#divProductWithLabel").attr("style", "display:none");
        $("#divProduct").attr("style", "display:Block");
    }
    else {
        $("#divProductWithLabel").attr("style", "display:none");
        $("#divProduct").attr("style", "display:none");
    }
});

function GetExportToExcelDetails() {
    if (productIds[$('#ddlProjectNodashboard').val()] != undefined) {
        setworkspaceid = productIds[$('#ddlProjectNodashboard').val()];
    }

    var Data_Export = {
        vWorkSpaceId: setworkspaceid,
        vDocTypeCode: DocTypeCode,
    }
    var url = WebUrl + "PmsProductTransfer/GetExportToExcelDetails";
    $.ajax({
        url: url,
        type: 'GET',
        async: false,  // double click solution
        data: Data_Export,
        success: function (data) {
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Data not found in export to excel.", ModuleName);
        }
    });
}

function GetProductReturnDetail() {
    if (productIds[$('#ddlProjectNodashboard').val()] != undefined) {
        setworkspaceid = productIds[$('#ddlProjectNodashboard').val()];
    }
    var userId = $("#hdnuserid").val();

    if ($('#ddlProjectNodashboard').val() != undefined)
        var projectno = $('#ddlProjectNodashboard').val().split('[')[1].split(']')[0].toString().replace(/\s+/g, '');

    if (setworkspaceid != "") {
        var DataValue = {
            vWorkSpaceId: setworkspaceid,
            vDocTypeCode: DocTypeCode,
            iUserID: userId,
            vStudyCode: projectno,
            iStageCode: StageCode
        }
        var DataDetails = {
            Url: BaseUrl + "PmsStudyProductReceipt/StudyProductReceiptData",
            SuccessMethod: "SuccessMethod",
            Data: DataValue,
        }
        GetProductDatail(DataDetails.Url, DataDetails.SuccessMethod, DataDetails.Data);
    }
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
    var noOfContainer = "";
    var UserTypeCode = $("#hdnUserTypeCode").val();


    for (var i = 0; i < jsonData.length; i++) {
        var InDataset = [];
        var PMAproover = "";
        srno = i + 1;

        PMreview = "";
        var review = "";

        if (StageName == "PM") {
            PMAproover = "<a data-tooltip='tooltip' title='edit' data-target='#ViewAuthenticate' class='btnedit' vStageName="
                                      + "'" + StageName + "'" + "Onclick=pmsStudyViewAuthenticate(this) nTransactionNo='" + jsonData[i].nTransactionNo
                                      + "' nSPTransactionDtlNo='" + jsonData[i].nTransactionDtlNo
                                      + "'  cIsQAReview='" + jsonData[i].cIsQAReview
                                      + "'  iModifyBy ='" + jsonData[i].iModifyBy + "'"
                                      + "' StageName='" + StageName + "'"
                                      + "style='cursor:pointer;'><i class='btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a'><i class='fa fa-fw fa-edit'></i><span>"
                                      + "PM Review" + "</span></a>"
        }

        if (jsonData[i].cIsQAReview == 'N') {
            //ReviewRemarks = "";
            review = 'Pending'
        }
        else if (jsonData[i].cIsQAReview == 'R') {
            //ReviewRemarks = "";
            review = 'Rejected'
        } else {
            //ReviewRemarks = jsonData[i].vRemarks
            review = 'Approved'
        }

        if (jsonData[i].iNoOfContainers == "0") {
            noOfContainer = "";
        }
        else {
            noOfContainer = jsonData[i].iNoOfContainers
        }
        InDataset.push(PMAproover, review, jsonData[i].vQARemarks, jsonData[i].iQAReviewBy, jsonData[i].dQAReviewOn, jsonData[i].vStudyCode,
                        jsonData[i].vToProjectNo, jsonData[i].vProductType, jsonData[i].cTransferIndi, jsonData[i].vProductName,
                        jsonData[i].vBatchLotNo, jsonData[i].iReceivedQty, jsonData[i].vUnit, jsonData[i].vKitNo, jsonData[i].vReceiptRefNo,
                        jsonData[i].vSendTo, jsonData[i].vReasonDesc, jsonData[i].vStorageAreaName, noOfContainer, jsonData[i].vStorageType,
                        jsonData[i].vModifyBy + "/</br>" + jsonData[i].dModifyOn);
        ActivityDataset.push(InDataset);
    }

    if (ActivityDataset.length == 0) {
        $("#divexport").css("visibility", "hidden");
    }
    else {
        $("#divexport").css("visibility", "visible");
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
        "aoColumns":
            [
            { "sTitle": "PM Approver" },
            { "sTitle": "PM Review" },
            { "sTitle": "Verified Remarks" },
            { "sTitle": "Verified By" },
            { "sTitle": "Verified On" },
            { "sTitle": "Project No" },
            { "sTitle": "To Project No" },
            { "sTitle": "Product/Kit Type" },
            { "sTitle": "Product Indication" },
            { "sTitle": "Product Name" },
            { "sTitle": "Batch/Lot/Lot No" },
            { "sTitle": "Quantity" },
                  { "sTitle": "Unit" },
            { "sTitle": "Kit/Label No" },
            { "sTitle": "Reference No" },
            { "sTitle": "Send To" },
            { "sTitle": "Reason" },
            { "sTitle": "Storage Area" },
            { "sTitle": "No Bin/Pallet/Crate/Locker/Container/Shelf/Box/Boxes/Rack" },
            { "sTitle": "Type Of Storage" },
            { "sTitle": "Transfer By" },
            
            ],
        "columnDefs":
            [{ "width": "2%", "targets": 0 },
            { "width": "3%", "targets": 1 },
            { "width": "3%", "targets": 2 },
            { "width": "5%", "targets": 3 },
            { "width": "4%", "targets": 4 },
            { "width": "3%", "targets": 5 },
            { "width": "2%", "targets": 6 },
            { "width": "3%", "targets": 7 },
            { "width": "3%", "targets": 8 },
            { "width": "4%", "targets": 9 },
            { "width": "4%", "targets": 10 },
            { "width": "3%", "targets": 11 },
            { "width": "4%", "targets": 12 },
            { "width": "4%", "targets": 13 },
            { "width": "7%", "targets": 14 },
            { "width": "7%", "targets": 15 }

            ],
        "oLanguage": {
            "sEmptyTable": "No Record Found",
        },
    });
    if ($("#hdnUserTypeCode").val() == ValidUserTypeCode) {
        var table = $('#tblPmsProductData').DataTable();
        table.column(0).visible(true);
        table.column(1).visible(true);
    }
    else {
        var table = $('#tblPmsProductData').DataTable();
        table.column(0).visible(false);
    }
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
        url: BaseUrl + "PmsGeneral/QtyDetailForProductTransfer",
        type: 'POST',
        data: QualityCheckData,
        async: false,
        success: function (response) {
            var totalqty = $("#txtQuantity").val();
            totalavailableqty = response;
            if (parseInt(response) < parseInt(totalqty)) {
                $("#txtQuantity").val("");
                ValidationAlertBox("Current Stock is " + response + ".", "ddlReason", ModuleName);
                return false;
            }
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Quantity not found.", ModuleName);
        }
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
            ValidationAlertBox("Storage Area not found.", "ddlStorageArea", ModuleName);
        }
    });
}

var GetPmsProjectNoProductReceipt = function (Url, SuccessMethod, ProjectNoDataTemp) {
    $.ajax({
        url: Url,
        type: 'GET',
        data: { vStudyCode: ProjectNoDataTemp.vStudyCode },
        async: false,
        success: function (jsonData) {
            var jsonObj = jsonData;
            var sourceArr = [];
            for (var i = 0; i < jsonObj.length; i++) {
                sourceArr.push("[ " + jsonObj[i].vStudyCode + " ]" + " " + jsonObj[i].vStudyName);
                childProjectId["[ " + jsonObj[i].vStudyCode + " ]" + " " + jsonObj[i].vStudyName] = jsonObj[i].nStudyNo;
            }
           
            $("#ddlToProjectNo").autocomplete({
                source: sourceArr,
                change: function (event, ui) { }
            });
        },
        error: function () {
            ValidationAlertBox("Project not found.", "ddlToProjectNo", ModuleName);
        }
    });
}



var GetPmsProjectNoProductReceiptForParentProject = function (Url, SuccessMethod, ProjectNoDataTemp) {
    $.ajax({
        url: Url,
        type: 'GET',
        //data: { vStudyCode: ProjectNoDataTemp.vStudyCode },
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
                    $("#Product").append($("<option></option>").val(jsonData[i].nProductNo).html(jsonData[i].vProductName + "   [" + jsonData[i].vProductStrength + "]")).prop('disabled', false);
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
    $("#txtQuantity").val("");
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

        var LabelNo = [];
        var setLabelNo = $.map($("#ddlProductLabel option:selected"), function (eLabel, i) {
            LabelNo.push($(eLabel).text());
        });

        var totallength = 1;
        if (TransferIndi == "K") {
            totallength = KitNo.length;
            var data = $('table#tblProductReturnAdd').find('tbody').find('tr');

            for (j = 0; j < totallength; j++) {
                for (i = 0; i < data.length; i++) {
                    if (KitNo[j] == $(data[i]).find('td:eq(5)').html()) {
                        ValidationAlertBox(KitNo[j] + " already exist in below table.", "ddlKit", ModuleName);
                        return false;
                        break;
                    }
                }
            }
        }
        else if (TransferIndi == "P") {
            var ProductCategory = $("#ddlProductCategory").val()
            if (ProductCategory == "Without") {
                totallength = 1;
            }
            else if (ProductCategory == "With") {
                totallength = LabelNo.length;
                var data = $('table#tblProductReturnAdd').find('tbody').find('tr');

                for (j = 0; j < totallength; j++) {
                    for (i = 0; i < data.length; i++) {
                        if (LabelNo[j] == $(data[i]).find('td:eq(6)').html()) {
                            ValidationAlertBox(LabelNo[j] + " already exist in below table.", "ddlKit", ModuleName);
                            return false;
                            break;
                        }
                    }
                }
            }
        }

        for (i = 0; i < totallength; i++) {
            var selMulti = $.map($("#ddlStorageArea option:selected"), function (el, i) {
                return $(el).text();
            });

            strdata += "<tr>";
            strdata += "<td>" + $("#ddlReason :selected").text() + "</td>";
            strdata += "<td>" + (selMulti.join(", ")) + "</td>";
            strdata += "<td class='hideproduct'>" + $("#Product :selected").text() + "</td>";
            strdata += "<td class='hideproduct'>" + $("#BatchLotNo :selected").text() + "</td>";
            strdata += "<td class='hideproduct'>" + $("#txtQuantity").val() + "</td>";
            strdata += "<td class='hidekit'>" + KitNo[i] + "</td>";
            strdata += "<td class='hideProductWithLabel'>" + LabelNo[i] + "</td>";
            strdata += "<td>" + $("#Remarks").val() + "</td>";
            strdata += "<td class='hidetd'>" + $("#Product :selected").val() + "</td>";
            strdata += "<td class='hidetd'>" + $("#BatchLotNo :selected").val() + "</td>";
            strdata += "<td class='hidetd'>" + $("#ddlStorageArea").val() + "</td>";
            strdata += "<td class='hidetd'>" + $("#ddlReason :selected").val() + "</td>";
            strdata += "<td class='hidetd'>" + $("#txtUsableStock").val() + "</td>";
            strdata += "<td class='hidetd'>" + $("#txtRetentionQuantity").val() + "</td>";
            strdata += "<td class='hidetd'>" + $("#txtVerificationQuantity").val() + "</td>";
            strdata += "<td class='hidetd'>" + $("#txtUnusedQuantity").val() + "</td>";
            strdata += "<td class='hidetd'>" + $("#txtArchive").val() + "</td>";
            strdata += "<td id='trRemove'><span class='glyphicon glyphicon-remove' ></span></td>";
            strdata += "<td class='hidetd'>" + $("#txtNoOfContainers").val() + "</td>";
            strdata += "<td class='hidetd'>" + $("#ddlUnit").val() + "</td>";
            strdata += "<td class='hidetd'>" + $("#ddlSelectStorage").val() + "</td>";
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
    $("#txtNoOfContainers").val("");
    $('#ddlUnit').val(0).attr("selected", "selected").prop("disabled", false);
    $("#divUnit").hide();

}

function ClearHeaderDetail() {
    $("#txtReferenceNo").val("");
    $("#txtSendTo").val("");
    $("#ShipmentNo").val("");
    $('#ddlProductType').val(0).attr("selected", "selected");
    $("#tblProductReturnAdd tbody tr").remove();
    $("#tblProductReturnAdd thead").hide();
    $('#txtDate').data("DateTimePicker").clear();
    $("#ddlToProjectNo").val("");
    $(".headercontrol").prop('disabled', '');
    $('#ddlTransferIndi').val(0).attr("selected", "selected");
    $('#ddlProductCategory').val(0).attr("selected", "selected");
    $('#btnSavePmsProduct').hide();
    $("#txtPIName").val("");
    $("#txtSiteAddress").val("");
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

    if (TransferIndi == "P" && $("#ddlProductCategory").val() == "With") {
        TransferIndi = "L";
    }

    var InsertPmsProductReceipt1 = {
        vWorkSpaceId: setworkspaceid,
        vReceiptRefNo: $("#txtReferenceNo").val(),
        vDocTypeCode: DocTypeCode,
        iModifyBy: $("#hdnuserid").val(),
        vSendTo: $("#txtSendTo").val(),
        vShipmentNo: $("#ShipmentNo").val(),
        vToWorkSpaceId: childProjectId[$('#ddlToProjectNo').val()],
        nStorageLocationNo: $('#ToStorage').val(),
        nProductTypeID: $('#ddlProductType :selected').val(),
        dReceiptDate: $("#txtDate").val(),
        cTransferIndi: TransferIndi,
        nKitTypeNo: $("#ddlKitType").val(),
        iNoOfContainers: $("#txtNoOfContainers").val(),
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

        var data = $('table#tblProductReturnAdd').find('tbody').find('tr:visible');
        var TempKitNo;
        var LabelNo = "";
        var StoreData = [];
        var productno;
        if (productIds[$('#ProjectNo').val()] != undefined) {
            setworkspaceid = productIds[$('#ProjectNo').val()];
        }

        for (i = 0; i < data.length; i++) {
            if ($(data[i]).find('td:eq(5)').html() == "undefined") {
                TempKitNo = "";
            }
            else {
                TempKitNo = $(data[i]).find('td:eq(5)').html();
            }

            if ($(data[i]).find('td:eq(6)').html() == "undefined") {
                LabelNo = "";
            }
            else {
                LabelNo = $(data[i]).find('td:eq(6)').html();
            }

            if(TransferIndi == "K")
            {
                productno = $("#ddlKitType").val();
            }
            else
            {
                productno = $(data[i]).find('td:eq(8)').html();
            }
            var InsertPmsProductReceipt2 = {
                nTransactionNo: TransactionNo,
                vWorkSpaceId: setworkspaceid,
                nReasonNo: $(data[i]).find('td:eq(11)').html(),
                vStorageArea: $(data[i]).find('td:eq(10)').html(),
                nProductNo: productno,
                nStudyProductBatchNo: $(data[i]).find('td:eq(9)').html(),
                iReceivedQty: $(data[i]).find('td:eq(4)').html(),
                vRemarks: $(data[i]).find('td:eq(7)').html(),
                vDocTypeCode: DocTypeCode,
                vRefModule: RefModule,
                iStockQty: $(data[i]).find('td:eq(4)').html(),
                cLocationIndicator: LocationIndicator,
                iModifyBy: $("#hdnuserid").val(),
                vToWorkSpaceId: childProjectId[$('#ddlToProjectNo').val()],
                cAddSub: "S",
                cTransferIndi: TransferIndi,
                vKitNo: TempKitNo,
                vStudyProductLabelNo: LabelNo,
                iNoOfContainers: $(data[i]).find('td:eq(18)').html(),
                vUnit: $(data[i]).find('td:eq(19)').html(),
                nToStorageLocationNo: 1 ,  // Static pass 1 for prime location in transactionaldtl table
                vStorageType: $(data[i]).find('td:eq(20)').html(),
                iStageCode: 201,
                vTempRequirement: $("#txtTemperature").val(),
                vShipmentDate: $("#txtShipmentDate").val()
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
                success: function (response) {
                    GetProductReturnDetail();
                    $("#btnSavePmsProduct").hide();
                    $("#ProductModel").modal('hide');
                },
                error: function () {
                    SuccessorErrorMessageAlertBox("Error to save data in details portion.", ModuleName);
                }
            });
        }
    }
    SuccessorErrorMessageAlertBox("Product Transfer saved successfully.", ModuleName);
}

function ValidateForm() {
    if (isBlank(document.getElementById('ddlToProjectNo').value)) {
        ValidationAlertBox("Please enter To Project Number.", "ddlToProjectNo", ModuleName);
        return false;
    }
    else if (Dropdown_Validation(document.getElementById("ddlProductType"))) {
        ValidationAlertBox("Please select Product/Kit Type.", "ddlProductType", ModuleName);
        return false;
    }
    else if (isBlank(document.getElementById('ProjectNo').value)) {
        ValidationAlertBox("Please enter Project Number.", "ProjectNo", ModuleName);
        return false;
    }
    else if (isBlank(document.getElementById('txtSendTo').value)) {
        ValidationAlertBox("Please enter Send To.", "txtSendTo", ModuleName);
        return false;
    }
    else if (Dropdown_Validation(document.getElementById('ddlTransferIndi'))) {
        ValidationAlertBox("Please select Product Indication.", "ddlTransferIndi", ModuleName);
        return false;
    }

    if ($("#ddlTransferIndi").val() == "P") {
        if (Dropdown_Validation(document.getElementById('ddlProductCategory'))) {
            ValidationAlertBox("Please select Product Category.", "ddlProductCategory", ModuleName);
            return false;
        }
    }


    if (TransferIndi == "P" && $("#ddlProductCategory").val() == "Without") {
        if (Dropdown_Validation(document.getElementById("Product"))) {
            ValidationAlertBox("Please select Product.", "Product", ModuleName);
            return false;
        }
        else if (Dropdown_Validation(document.getElementById("BatchLotNo"))) {
            ValidationAlertBox("Please select Batch/Lot/Lot No.", "BatchLotNo", ModuleName);
            return false;
        }
        else if (isBlank(document.getElementById('txtQuantity').value)) {
            ValidationAlertBox("Please enter Quantity.", "txtQuantity", ModuleName);
            return false;
        }
        else if (parseInt(document.getElementById('txtQuantity').value) == 0 && ($('#txtQuantity').val()).length <= 12) {
            document.getElementById('txtQuantity').value = "";
            return false;
        }
    }
    else if (TransferIndi == "K") {
        if (isBlank(document.getElementById('ddlKit').value)) {
            ValidationAlertBox("Please select Kit.", "ddlKit", ModuleName);
            return false;
        }
    }
    else if (TransferIndi == "P" && $("#ddlProductCategory").val() == "With") {
        if (isBlank(document.getElementById('ddlProductLabel').value)) {
            ValidationAlertBox("Please select Product Label.", "ddlProductLabel", ModuleName);
            return false;
        }
    }

    if (Dropdown_Validation(document.getElementById("ddlReason"))) {
        ValidationAlertBox("Please select Reason.", "ddlReason", ModuleName);
        return false;
    }

    if (isBlank(document.getElementById('ddlStorageArea').value)) {
        ValidationAlertBox("Please select Storage Area.", "ddlStorageArea", ModuleName);
        return false;
    }

    if (isBlank(document.getElementById('txtNoOfContainers').value)) {
        ValidationAlertBox("Please enter No Bin/Pallet/Crate/Locker/Container/Shelf/Box/Boxes/Rack.", "txtNoOfContainers", ModuleName);
        return false;
    }

    if (document.getElementById('ddlToProjectNo').value == document.getElementById('ProjectNo').value) {
        ValidationAlertBox("From Project and To Project cannot same.", "ddlToProjectNo", ModuleName);
        return false;
    }

    if ($('#ddlToProjectNo').val() == undefined || $('#ddlToProjectNo').val() == "") {
        ValidationAlertBox("To Project Number is not valid.", "ddlToProjectNo", ModuleName);
        return false;
    }

    return true;
}

function GetActionName() {
    actionname = $("#hndActionName").val();
    document.getElementById("divsento").style.display = "block";
    document.getElementById("divdate").style.display = "none";
    document.getElementById('h1_id').innerHTML = 'Product Transfer';
    document.getElementById('titleid').innerHTML = 'Product Transfer';
    document.getElementById("btnAddProductData").innerText = "+ Shipment Request Generation";
    document.getElementById("StorageAreaID").style.display = "block";
    DocTypeCode = "ZSTN";
    RefModule = "TR";
    LocationIndicator = "P";
    QuantityRefModule = "PD";
    $("#QuantityRetrunTextBox").removeClass("col-sm-10").addClass("col-sm-12");
}

function GetDashboardData(ActivityDataset) {
    if (ActivityDataset.length == 0) {
        $("#divexport").css("visibility", "hidden");
    }
    else {
        $("#divexport").show();
    }
    columnname = "Transfer By"
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
        "sScrollX": "100%",
        "sScrollXInner": "2000" /* It varies dynamically if number of columns increases */,
        "aoColumns":
            [{ "sTitle": "Project No" },
            { "sTitle": "To Project No" },
            { "sTitle": "Product/Kit Type" },
            { "sTitle": "Product Indication" },
            { "sTitle": "Reference No" },
            { "sTitle": "Send To" },
            { "sTitle": "Reason" },
            { "sTitle": "Storage Area" },
            { "sTitle": "Product Name" },
            { "sTitle": "Batch/Lot/Lot No" },
            { "sTitle": "Kit No" },
            { "sTitle": "Quantity" },
            { "sTitle": "Transfer By" }],
        "columnDefs":
            [{ "width": "2%", "targets": 0 },
            { "width": "3%", "targets": 1 },
            { "width": "3%", "targets": 2 },
            { "width": "2%", "targets": 3 },
            { "width": "2%", "targets": 4 },
            { "width": "7%", "targets": 5 },
            { "width": "6%", "targets": 6 },
            { "width": "8%", "targets": 7 },
            { "width": "2%", "targets": 8 },
            { "width": "2%", "targets": 9 },
            { "width": "6%", "targets": 10 }],
        "oLanguage": {
            "sEmptyTable": "No Record Found",
        },
    });
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
    //var GetProductType = {
    //    Url: BaseUrl + "PmsGeneral/GetProductType/" + setworkspaceid,
    //    SuccessMethod: "SuccessMethod"
    //}

    var GetProductType = {
        Url: BaseUrl + "PmsGeneral/GetProductType_New/" + setworkspaceid,
        SuccessMethod: "SuccessMethod"
    }

    // For server

    $.ajax({
        type: "GET",
        url: GetProductType.Url,
        data: { id: setworkspaceid },
        // contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Product Type not found.", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        $("#ddlProductType").empty().append('<option selected="selected" value="0">Please Select Product/Kit Type</option>');
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

    // For Server use

    $.ajax({
        type: "GET",
        url: BaseUrl + "PmsGeneral/GetSetProjectDetails",
        data: { id: PassData.iUserId },
        //contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (jsonData) {
            if (jsonData.length > 0) {
                $('#ddlProjectNodashboard').val(jsonData[0].vProjectNo);
                setworkspaceid = jsonData[0].vWorkSpaceId;
            }
            else {
                $('#ddlProjectNodashboard').val('');
            }
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Project not found.", ModuleName);
        }
    });



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
        ValidationAlertBox("Current Stock is " + totalavailableqty + ".", "BatchLotNo", ModuleName);
        $("#txtQuantity").val("");
        return false;
    }
}

function QuantatiyAllocation() {
    if (productIds[$('#DDLProjectNoList').val()] != undefined) {
        setworkspaceid = productIds[$('#DDLProjectNoList').val()];
    }

    var QualityCheckData = {
        vWorkSpaceId: setworkspaceid,
        vProductNo: $("#Product :selected").val(),
        nStudyProductBatchNo: $("#BatchLotNo :selected").val(),
        vRefModule: "PD",
        vDocTypeCode: DocTypeCode
    }

    $.ajax({
        url: BaseUrl + "PmsGeneral/QuantityAllocation",
        type: 'POST',
        data: QualityCheckData,
        success: SuccessQuantityCheck,
        async: false,
        error: function () {
            ValidationAlertBox("Quantity not found.", "BatchLotNo", ModuleName);
        }
    });

    function SuccessQuantityCheck(jsonData) {
        var HTMLtbl =
      {
          getData: function (table) {
              var data = [];
              table.find('tr').not(':first').each(function (rowIndex, r) {
                  var cols = [];
                  $(this).find('td').each(function (colIndex, c) {

                      if ($(this).children(':text,:hidden,textarea,select').length > 0)
                          cols.push($(this).children('input,textarea,select').val().trim());

                      else if ($(this).children(':checkbox').length > 0)
                          cols.push($(this).children(':checkbox').is(':checked') ? 1 : 0);
                      else
                          cols.push($(this).text().trim());
                  });
                  data.push(cols);
              });
              return data;
          }
      }
        var data = HTMLtbl.getData($('#tblProductReturnAdd'));

        var iReceivedQty = 0
        var iStockQty = 0
        var iRetentionQty = 0
        var iVerificationQty = 0
        var iNonSalableClStockQty = 0
        var iArchiveQty = 0

        for (i = 0; i < data.length; i++) {
            var storedata = data[i];
            iReceivedQty = parseInt(iReceivedQty) + parseInt((RecdQty == "") ? "0" : "0");
            iRetentionQty = parseInt(iRetentionQty) + parseInt((storedata[11] == "") ? "0" : storedata[11]);
            iVerificationQty = parseInt(iVerificationQty) + parseInt((storedata[12] == "") ? "0" : storedata[12]);
            iNonSalableClStockQty = parseInt(iNonSalableClStockQty) + parseInt((storedata[13] == "") ? "0" : storedata[13]);
            iArchiveQty = parseInt(iArchiveQty) + parseInt((storedata[14] == "") ? "0" : storedata[14]);
        }

        if (jsonData.length > 0) {
            document.getElementById('lblUsableStock').innerHTML = parseInt((jsonData[0].iSalableClStockQty == "") ? "0" : jsonData[0].iSalableClStockQty) - parseInt(iReceivedQty);
            document.getElementById('lblRetentionQuantity').innerHTML = parseInt((jsonData[0].RetentionQty == "") ? "0" : jsonData[0].RetentionQty) - parseInt(iRetentionQty);
            document.getElementById('lblVerificationQuantity').innerHTML = parseInt((jsonData[0].VerificationQty == "") ? "0" : jsonData[0].VerificationQty) - parseInt(iVerificationQty);
            document.getElementById('lblUnusedQty').innerHTML = parseInt((jsonData[0].NonSalableClStockQty == "") ? "0" : jsonData[0].NonSalableClStockQty) - parseInt(iNonSalableClStockQty);

            AvailableQtyTemp = (jsonData[0].iSalableClStockQty == "") ? "0" : jsonData[0].iSalableClStockQty;
            RetentionQtyTemp = (jsonData[0].RetentionQty == "") ? "0" : jsonData[0].RetentionQty;
            VerificationQtyTemp = (jsonData[0].VerificationQty == "") ? "0" : jsonData[0].VerificationQty;
            UnusedQtyTemp = (jsonData[0].NonSalableClStockQty == "") ? "0" : jsonData[0].NonSalableClStockQty;

            if (jsonData[0].iSalableClStockQty == "" || document.getElementById('lblUsableStock').innerHTML == "0") {
                $("#txtUsableStock").prop('disabled', 'disabled');
            }
            else {
                $("#txtUsableStock").removeAttr("disabled");
            }

            if (jsonData[0].RetentionQty == "" || document.getElementById('lblRetentionQuantity').innerHTML == "0") {
                $("#txtRetentionQuantity").prop('disabled', 'disabled');
            }
            else {
                $("#txtRetentionQuantity").removeAttr("disabled");
            }

            if (jsonData[0].VerificationQty == "" || document.getElementById('lblVerificationQuantity').innerHTML == "0") {
                $("#txtVerificationQuantity").prop('disabled', 'disabled');
            }
            else {
                $("#txtVerificationQuantity").removeAttr("disabled");
            }

            if (jsonData[0].NonSalableClStockQty == "" || document.getElementById('lblUnusedQty').innerHTML == "0") {
                $("#txtUnusedQuantity").prop('disabled', 'disabled');
            }
            else {
                $("#txtUnusedQuantity").removeAttr("disabled");
            }
            var totalAvailableStock = parseInt(jsonData[0].iSalableClStockQty) + parseInt(jsonData[0].RetentionQty) + parseInt(jsonData[0].VerificationQty) + parseInt(jsonData[0].NonSalableClStockQty);
            document.getElementById('lblAvailableQuantity').innerHTML = parseInt((totalAvailableStock == "") ? "0" : totalAvailableStock) - (parseInt(iReceivedQty) + parseInt(iRetentionQty) + parseInt(iVerificationQty) + parseInt(iNonSalableClStockQty));
        }
    }
}

function ArchiveQuantatiyAllocation() {
    if (productIds[$('#DDLProjectNoList').val()] != undefined) {
        setworkspaceid = productIds[$('#DDLProjectNoList').val()];
    }

    var QualityCheckData = {
        vWorkSpaceId: setworkspaceid,
        vProductNo: $("#Product :selected").val(),
        nStudyProductBatchNo: $("#BatchLotNo :selected").val(),
        vRefModule: "PD",
        vDocTypeCode: DocTypeCode
    }

    $.ajax({
        url: BaseUrl + "PmsGeneral/QuantityAllocation",
        type: 'POST',
        data: QualityCheckData,
        success: SuccessQuantityCheck,
        async: false,
        error: function () {
            ValidationAlertBox("Quantity not found.", "BatchLotNo", ModuleName);
        }
    });

    function SuccessQuantityCheck(jsonData) {

        var HTMLtbl =
        {
            getData: function (table) {
                var data = [];
                table.find('tr').not(':first').each(function (rowIndex, r) {
                    var cols = [];
                    $(this).find('td').each(function (colIndex, c) {

                        if ($(this).children(':text,:hidden,textarea,select').length > 0)
                            cols.push($(this).children('input,textarea,select').val().trim());

                        else if ($(this).children(':checkbox').length > 0)
                            cols.push($(this).children(':checkbox').is(':checked') ? 1 : 0);
                        else
                            cols.push($(this).text().trim());
                    });
                    data.push(cols);
                });
                return data;
            }
        }
        var data = HTMLtbl.getData($('#tblProductReturnAdd'));
        var iArchiveQty = 0
        for (i = 0; i < data.length; i++) {
            var storedata = data[i];
            iArchiveQty = parseInt(iArchiveQty) + parseInt((storedata[14] == "") ? "0" : storedata[14]);
        }

        if (jsonData.length > 0) {
            document.getElementById('lblArchive').innerHTML = parseInt((jsonData[0].ArchiveQty == "" || jsonData[0].ArchiveQty == null) ? "0" : jsonData[0].ArchiveQty) - parseInt(iArchiveQty);
            ArchiveQtyTemp = (jsonData[0].ArchiveQty == "") ? "0" : jsonData[0].ArchiveQty;
            if (jsonData[0].ArchiveQty == "" || document.getElementById('lblArchive').innerHTML == "0") {
                $("#txtArchive").prop('disabled', 'disabled');
            }
            else {
                $("#txtArchive").removeAttr("disabled");
            }
            var totalAvailableStock = parseInt(ArchiveQtyTemp) - parseInt(iArchiveQty);
            document.getElementById('lblArchiveAvailableQuantity').innerHTML = (totalAvailableStock == "") ? "0" : totalAvailableStock;
        }
    }
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

function GetKit() {
    $('#divkit .multiselect-container li').remove();

    var PostData = {
        vWorkSpaceID: setworkspaceid,
        nProductTypeID: $("#ddlProductType").val(),
        nKitTypeNo: $("#ddlKitType").val(),
    }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/Proc_GetAvailableKitNo",
        type: 'POST',
        data: PostData,
        success: function (jsonData) {
            if (jsonData.length >= 0) {
                $('#ddlKit').multiselect('rebuild');
            }

            $('#ddlKit option').each(function () {
                $(this).remove();
            });

            for (var i = 0; i < jsonData.length; i++) {
                $("#ddlKit").append($("<option></option>").val(jsonData[i].vKitNo).html(jsonData[i].vKitNo));
                $('#ddlKit').multiselect('rebuild');
            }
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Kit data is not found.", ModuleName);
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
                success: SuccessMethodKitCreationDtl,
                error: function () {
                    //SuccessorErrorMessageAlertBox("Kit Type Data Is not found.", ModuleName);
                    ValidationAlertBox("Kit Type data is not found.", "ddlKitType", ModuleName);
                }
            });

            function SuccessMethodKitCreationDtl(jsonData) {
                jsonData = jsonData.Table;
                $("#ddlKitType").empty().append('<option selected="selected" value="0">Please Select Kit Type</option>');
                for (var i = 0; i < jsonData.length; i++) {
                    $("#ddlKitType").append($("<option></option>").val(jsonData[i].nKitTypeNo).html(jsonData[i].vKitTypeDesc));
                }
            }
        },
        error: function () {
            ValidationAlertBox("Kit Type Data Is not found.", "ddlKitType", ModuleName);
        }
    });
}

$("#ddlKitType").on("change", function () {
    GetKit();
});

function GetStudyProductLabel() {
    var PostData = {
        vWorkSpaceID: setworkspaceid,
        nProductTypeID: $("#ddlProductType").val(),
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
            SuccessorErrorMessageAlertBox("Kit data is not found.", ModuleName);
        }
    });
}


$("#txtNoOfContainers").on('keypress', function (e) {
    debugger;
    var regExp = /[a-z]/i;
    var value = String.fromCharCode(e.which) || e.key;
    if (regExp.test(value)) {
        e.preventDefault();
        return false;
    }
});

$("#txtQuantity").on('keypress', function (e) {
    debugger;
    var regExp = /[a-z]/i;
    var value = String.fromCharCode(e.which) || e.key;
    if (regExp.test(value)) {
        e.preventDefault();
        return false;
    }
});



$('#ddlSelectStorage').on("change", function () {

    BindTypeOfStorage();
});


function BindTypeOfStorage() {
    if ($("#ddlSelectStorage").val() == "0") {
        $("#divStorage").attr('style', 'display:none');
        ValidationAlertBox("Please Select any storage area.", "ddlSelectStorage", ModuleName);
    }
    if ($("#ddlSelectStorage").val() == "Bin") {
        $('#lblstorage').html('No. of Bin *');
        $("#divStorage").attr('style', 'display:block');
    }
    if ($("#ddlSelectStorage").val() == "Pallet") {
        $('#lblstorage').html('No. of Pallet *');
        $("#divStorage").attr('style', 'display:block');
    }
    if ($("#ddlSelectStorage").val() == "Crate") {
        $('#lblstorage').html('No. of Crate *');
        $("#divStorage").attr('style', 'display:block');
    }
    if ($("#ddlSelectStorage").val() == "Locker") {
        $('#lblstorage').html('No. of Locker *');
        $("#divStorage").attr('style', 'display:block');
    }
    if ($("#ddlSelectStorage").val() == "Container") {
        $('#lblstorage').html('No. of Container *');
        $("#divStorage").attr('style', 'display:block');
    }
    if ($("#ddlSelectStorage").val() == "Shelf") {
        $('#lblstorage').html('No. of Shelf *');
        $("#divStorage").attr('style', 'display:block');
    }
    if ($("#ddlSelectStorage").val() == "Box") {
        $('#lblstorage').html('No. of Box *');
        $("#divStorage").attr('style', 'display:block');
    }
    if ($("#ddlSelectStorage").val() == "Boxes") {
        $('#lblstorage').html('No. of Boxes *');
        $("#divStorage").attr('style', 'display:block');
    }
    if ($("#ddlSelectStorage").val() == "Rack") {
        $('#lblstorage').html('No. of Rack *');
        $("#divStorage").attr('style', 'display:block');
    }
}

//-------- Added By Yash ----------

function pmsStudyViewAuthenticate(e) {

    nTransactionNoQA = "";
    nTransactionDtlNoQA = "";
    nTransactionNoQA = $(e).attr("nTransactionNo");
    nTransactionDtlNoQA = $(e).attr("nSPTransactionDtlNo");
    var cIsQAReview = $(e).attr("cIsQAReview");
    StageName = $(e).attr("StageName");
    var iModifyByTransaction = $(e).attr("iModifyBy");

    if (cIsQAReview == 'Y') {
        return;
    }
    if (cIsQAReview == 'R') {
        return;
    }
    else {
        if (StageName == "PM") {
            CheckSameUserTransaction(iModifyByTransaction);
        }

        if (reviewerFlag == true)
            $('#ViewAuthenticate').modal('show');
        //document.getElementById("ViewAuthenticate").style.display = "block";
    }

}

function QaReviewApproved() {
    //StageName = $("#hdnStageName").val();
    TransferIndi = 'P';
    pwd = $("#txtPassword").val();
    var username = $("#hdn").val();
    if (isBlank(document.getElementById('txtRemark').value)) {
        ValidationAlertBox("Please enter Remarks.", "txtRemarks", ModuleName);
        return false
    }
    else if (isBlank(document.getElementById('txtPassword').value)) {
        ValidationAlertBox("Please enter Password.", "txtPassword", ModuleName);
        return false
    }

    var InsertPmsProductReceipt1 = {
        nTransactionNo: nTransactionNoQA,
        nTransactionDtlNo: nTransactionDtlNoQA,
        vQARemarks: $("#txtRemark").val(),
        sessionPass: $("#hdnPassword").val(),
        Password: $("#txtPassword").val(),
        iUserId: $("#hdnuserid").val(),
        vDocTypeCode: 'ZSTN',
        cTransferIndi: TransferIndi,
        cIsQAReview: 'Y',
        iStageCode: 401
    }

    var InsertProductReceiptData = {
        Url: BaseUrl + "PmsStudyProductReceipt/InsertPmsProductReceiptDtlQA",
        SuccessMethod: "SuccessMethod",
        Data: InsertPmsProductReceipt1
    }
    InsertPmsProductReceiptDtlQA(InsertProductReceiptData.Url, InsertProductReceiptData.SuccessMethod, InsertProductReceiptData.Data);
};

function QaReviewReject() {
    TransferIndi = 'P';
    pwd = $("#txtPassword").val();
    if (isBlank(document.getElementById('txtRemark').value)) {
        ValidationAlertBox("Please enter Remarks.", "txtRemark", ModuleName);
        return false
    }
    else if (isBlank(document.getElementById('txtPassword').value)) {
        ValidationAlertBox("Please enter Password.", "txtPassword", ModuleName);
        return false
    }

    var InsertPmsProductRet1 = {
        nTransactionNo: nTransactionNoQA,
        nTransactionDtlNo: nTransactionDtlNoQA,
        vDocTypeCode: 'ZSTN',
        sessionPass: $("#hdnPassword").val(),
        Password: $("#txtPassword").val(),
        vQARemarks: $("#txtRemark").val(),
        cIsQAReview: 'R',
        iUserId: $("#hdnuserid").val(),
        cTransferIndi: TransferIndi,
        iStageCode: 0
    }

    var InsertProductData = {
        Url: BaseUrl + "PmsProductReturn/InsertPmsProductReturnDtlQARejected",
        SuccessMethod: "SuccessMethod",
        Data: InsertPmsProductRet1
    }

    InsertPmsProductDtlQAReject(InsertProductData.Url, InsertProductData.SuccessMethod, InsertProductData.Data);
    
}

var InsertPmsProductReceiptDtlQA = function (Url, SuccessMethod, Data) {
    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        //async: false,
        success: function (jsonData) {
            if (jsonData == "success") {
                $("#ViewAuthenticate").hide();
                $("#txtRemark").val('');
                $("#txtPassword").val('');
                GetData();
                SuccessorErrorMessageAlertBox("Product Receipt reviewed successfully.", ModuleName);
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

var InsertPmsProductDtlQAReject = function (Url, SuccessMethod, Data) {
    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        //async: false,
        success: function (jsonData) {
            if (jsonData == "success") {
                $("#ViewAuthenticate").hide();
                $("#txtRemark").val('');
                $("#txtPassword").val('');
                SuccessorErrorMessageAlertBox("Product Receipt rejected successfully.", ModuleName);
                GetData();
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

function CheckSameUserTransaction(iUserId) {
    var CheckSameUserTransaction = {
        iUserId: $("#hdnuserid").val(),
        iUserIdTransaction: iUserId
    }

    var CheckSameUserTransactionData = {
        Url: BaseUrl + "PmsGeneral/CheckSameUserTransaction",
        Data: CheckSameUserTransaction
    }

    $.ajax({
        url: CheckSameUserTransactionData.Url,
        type: 'POST',
        async: false,
        data: CheckSameUserTransactionData.Data,
        success: function (jsonResult) {
            if (jsonResult[0].RetCode == 0)
                return SuccessorErrorMessageAlertBox("You have no rights to verifing review", ModuleName);
            else
                reviewerFlag = true;
        },
        error: function (ex) {
            SuccessorErrorMessageAlertBox("Error While Saving Product Receipt Data.", ModuleName);
        }
    });
}
//---------------------------------