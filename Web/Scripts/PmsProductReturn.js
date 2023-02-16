var productIds = new Object();
var actionname;
var DocTypeCode;
var RefModule;
var LocationIndicator;
var setworkspaceid = "";
var QuantityRefModule;
var viewmode;
var totalavailableqty = 0;
var ModuleName = "Product " + $("#hndActionName").val() + "";
var TransferIndi = "";
var nTransactionNoQA = "";
var nTransactionDtlNoQA = "";
var cTransferIndi = "";
var UserTypeCode = "";
var vProjectNo = "";

$(document).ready(function () {

    GetActionName();
    GetViewMode();

    $("#spnwelcome").html($("#hdnusername").val());
    $("#spnLoginTime").html($("#hdnlogintime").val());
    CheckSetProject();

    if (setworkspaceid != "") {
        BindData();
        GetProductType();
        GetReason();
        GetProductName();
        //GetBatchLotNo(0);
    }
    //$("#divexport").css("visibility", "hidden");

    $('#txtPlannedDate').datetimepicker({
        format: 'DD-MMMM-YYYY',
        showClose: true,
    });

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
                    BindData();
                    GetProductType();
                    GetReason();
                    GetProductName();
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

    $("#btnAddProductData").on("click", function () {
        $("#ProjectNo").val($("#ddlProjectNodashboard").val());

        if (isBlank(document.getElementById('ddlProjectNodashboard').value)) {
            ValidationAlertBox("Please enter Project No.", "ddlProjectNodashboard", ModuleName);
            return false;
        }
        else {
            GetProductType();
            GetReason();
            //vStudyCode = $('#ddlProjectNodashboard').val()
            GetSiteParentId();
            
            //GetBatchLotNo(0);

            var btnOperaion = (document.getElementById("btnAddProductData").innerText).toLowerCase();
            ClearHeaderDetail();
            ClearDetailPartData();
            document.getElementById('title').innerHTML = 'Product/Kit Return';
            jQuery("#titleMode").text('Mode:-Add');
            $("#ProjectNo").prop("disabled", "disabled");
            $("#txtNoOfContainers").prop("disabled", false);
            $("#Remarks").prop("disabled", false);
            document.getElementById("divProductCategory").style.display = "none";
            document.getElementById("divKitType").style.display = "none";
            document.getElementById("divkit").style.display = "none";
            document.getElementById("divProduct").style.display = "none";
            document.getElementById("divProductLabel").style.display = "none";

            var GETStorageArea = {
                Url: BaseUrl + "PmsGeneral/ALLStorageAreaData",
                SuccessMethod: "SuccessMethod"
            }
            var FilterData = {
                nStorageTypeId: $("#ToStorage :selected").val(),
                vLocationCode: $("#hdnUserLocationCode").val(),
            }
            GetStorageArea(GETStorageArea.Url, FilterData);
        }
    });

    var GETStorageArea = {
        Url: BaseUrl + "PmsGeneral/ALLStorageAreaData",
        SuccessMethod: "SuccessMethod"
    }
    var FilterData = {
        nStorageTypeId: $("#ToStorage :selected").val(),
        vLocationCode: $("#hdnUserLocationCode").val(),
    }
    GetStorageArea(GETStorageArea.Url, FilterData);


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
        nonSelectedText: 'Please Select Label',
        buttonClass: 'form-control',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        numberDisplayed: 2,
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

function GetSiteParentId() {
    var Getdata = {
        //setworkspaceid : productIds[$('#ddlProjectNodashboard').val()],
        vWorkSpaceId: setworkspaceid,
        vStudyCode: $('#ParentSiteNo').val(),
    }
    $.ajax({
        url: BaseUrl + 'PmsGeneral/GetSiteParentId',
        type: 'POST',
        data: Getdata,
        //success: Success,
        success: Success,
        async: false,
        error: function () {
            ValidationAlertBox("not found.", "listOfParentId", ModuleName);
        }
    });

    function Success(jsonData) {
        $('#ParentSiteNo').val(jsonData[0].vStudyCode).prop('disabled', 'disabled');
        $('#PIName').val(jsonData[0].vPIName).prop('disabled', 'disabled');
        $('#Address').val(jsonData[0].vSiteAddress).prop('disabled', 'disabled');
        //$("#ParentSiteNo").prop('disabled', 'disabled');
        //setworkspaceid = jsonData[0].vWorkSpaceId;
        //ParentSiteNo
    }
}


$("#txtQuantity").on("blur", function () {
    if (ValidateForm() == false) {
        return false;
    }
    QualityCheck();
    QuantityValidation();
});

$("#btnExitPmsProduct").on("click", function () {
    ConfirmAlertBox(ModuleName);
});

$("#btnClearPmsProduct").on("click", function () {
    ClearHeaderDetail();
    ClearDetailPartData();
});

//$("#ddlProjectNodashboard").on("blur", function () {
//    //if (setworkspaceid != "") {
//    BindData();
//    //}
//});

$("#ddlProductType").on("change", function () {
    ClearDetailPartData();
    GetProductName();
    GetKit();
});

$("#Product").on("change", function () {
    GetBatchLotNo();
    $("#txtQuantity").val("");
    ClearQuantityonPopup();
    $('#ddlReason').val(0).attr("selected", "selected");
    $("#ddlStorageArea").multiselect("clearSelection");
    $("#ddlStorageArea").multiselect('refresh');
    $("#txtNoOfContainers").val('');
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
    ClearQuantityonPopup();
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
    if (validateform() == false) {
        return false;
    }
    AddTempData();
});

function GetExportToExcelDetails() {
    if (productIds[$('#ddlProjectNodashboard').val()] != undefined) {
        setworkspaceid = productIds[$('#ddlProjectNodashboard').val()];
    }

    var Data_Export = {
        vWorkSpaceId: setworkspaceid,
        vDocTypeCode: DocTypeCode,
    }

    var url = WebUrl + "PmsProductReturn/GetExportToExcelDetails";
    $.ajax({
        url: url,
        type: 'GET',
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
    var review = "";
    UserTypeCode = $("#hdnUserTypeCode").val();
    if (DocTypeCode == "ZRE2") {
        for (var i = 0; i < jsonData.length; i++) {
            var InDataset = [];
            srno = i + 1;
            date = jsonData[i].dReceiptDate.split(" ");

            if ($("#hdnUserProfile").val().includes(UserTypeCode)) {
                QAreview = "<a data-toggle='modal' data-tooltip='tooltip' title='QA Review'  attrid=' + aData[0] + ' class='btnview' Onclick=pmsStudyViewAuthenticate(this) nTransactionNo='" + jsonData[i].nTransactionNo
                            + "' nSPTransactionDtlNo='" + jsonData[i].nTransactionDtlNo + "' cIsQAReview='" + jsonData[i].cIsQAReview + "' cTransferIndi='" + jsonData[i].cTransferIndi + "' style='cursor:pointer;'><i class='btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a'><i class='fa fa-fw fa-edit'></i><span>QA Review</span></a>"

            }
            else {
                //Changed by rinkal
                //QAreview = "<a data-toggle='modal' data-tooltip='tooltip' title='edit' data-target='#ViewAuthenticate' class='btnedit' style='cursor:pointer;'><i class='btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a'><i class='fa fa-fw fa-edit'></i><span>QA Review</span></a>"

                QAreview = "<a data-toggle='modal' data-tooltip='tooltip' title='QA Review'  attrid=' + aData[0] + ' class='btnview' nTransactionNo='" + jsonData[i].nTransactionNo
                                  + "' nSPTransactionDtlNo='" + jsonData[i].nTransactionDtlNo + "' cIsQAReview='" + jsonData[i].cIsQAReview + "' cTransferIndi='" + jsonData[i].cTransferIndi + "' style='cursor:pointer;'><i class='btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a'><i class='fa fa-fw fa-edit'></i><span>QA Review</span></a>"

            }
            View = "<a data-toggle='modal' data-tooltip='tooltip' newtitle='View' data-target='#ProductModel' attrid=' + aData[0] + ' class='btnedit' Onclick=pmsStudyProductReceiptSelectionData(this) nTransactionNo='" + jsonData[i].nTransactionNo
                                + "' nSPTransactionDtlNo='" + jsonData[i].nTransactionDtlNo + "' nProductTypeID = '" + jsonData[i].nProductTypeID + "' nProductNo = '"
                                + jsonData[i].nProductNo + "' nStudyProductBatchNo = '" + jsonData[i].nStudyProductBatchNo + "'  cTransferIndi='"
                                + jsonData[i].cTransferIndi + "' style='cursor:pointer;'><i class='btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a'><i class='fa fa-fw fa-eye'></i><span>View</span></a>"

            if (jsonData[i].cIsQAReview == 'Y') {
                review = 'Approved'
            }
            else if (jsonData[i].cIsQAReview == 'N') {
                review = 'Pending'
            }
            else if (jsonData[i].cIsQAReview == 'R') {
                review = 'Rejected'
            }

            InDataset.push(jsonData[i].vStudyCode, jsonData[i].cTransferIndi, jsonData[i].vKitNo, jsonData[i].vProductType,
                           jsonData[i].vReceiptRefNo, jsonData[i].vSendTo, date[0], jsonData[i].vReasonDesc,
                           jsonData[i].vStorageAreaName, jsonData[i].iNoOfContainers, jsonData[i].vStorageType, jsonData[i].vProductName, jsonData[i].vBatchLotNo, jsonData[i].iReceivedQty, jsonData[i].vUnit,
                           jsonData[i].vRemarks, jsonData[i].vModifyBy + "/</br>" + jsonData[i].dModifyOn, review, jsonData[i].vQARemarks, jsonData[i].iQAReviewBy, jsonData[i].dQAReviewOn,
                           //jsonData[i].vQARemarks, jsonData[i].iQAReviewBy,jsonData[i].dQAReviewOn,
                           View, QAreview,
                           jsonData[i].cIsQAReview);
            ActivityDataset.push(InDataset);
        }
    }
    else if (DocTypeCode == "ZDES") {
        for (var i = 0; i < jsonData.length; i++) {
            var InDataset = [];
            date = jsonData[i].dReceiptDate.split(" ");
            InDataset.push(jsonData[i].vStudyCode, jsonData[i].vProductType, jsonData[i].vReceiptRefNo, date[0], jsonData[i].vReasonDesc, jsonData[i].vProductName, jsonData[i].vBatchLotNo, jsonData[i].iReceivedQty, jsonData[i].vRemarks, jsonData[i].vModifyBy + "/</br>" + jsonData[i].dModifyOn);
            ActivityDataset.push(InDataset);
        }
    }
    else {
        for (var i = 0; i < jsonData.length; i++) {
            var InDataset = [];
            srno = i + 1;
            InDataset.push(jsonData[i].vStudyCode, jsonData[i].vToProjectNo, jsonData[i].vProductType, jsonData[i].vReceiptRefNo, jsonData[i].vSendTo, jsonData[i].vReasonDesc, jsonData[i].vStorageAreaName, jsonData[i].vProductName, jsonData[i].vBatchLotNo, jsonData[i].iReceivedQty, jsonData[i].vModifyBy + "/</br>" + jsonData[i].dModifyOn);
            ActivityDataset.push(InDataset);
        }
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

    var URLQty;
    if (DocTypeCode == "ZDES") {
        URLQty = BaseUrl + "PmsGeneral/ArchiveQuantity";
    }
    else {
        URLQty = BaseUrl + "PmsGeneral/QtyDetail";
    }

    $.ajax({
        url: URLQty,
        type: 'POST',
        data: QualityCheckData,
        async: false,
        success: Success,
        error: function () {
            SuccessorErrorMessageAlertBox("Quantity not found.", ModuleName);
        }
    });

    function Success(response) {
        var totalqty = $("#txtQuantity").val();
        totalavailableqty = response;
        if (parseInt(response) < parseInt(totalqty)) {
            $("#txtQuantity").val("");
            ValidationAlertBox("Current Stock is " + response + ".", "ddlReason", ModuleName);
            return false;
        }
    }
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

var GetPmsProjectNoProductReceipt = function (Url, SuccessMethod, ProjectNoDataTemp) {
    $.ajax({
        url: Url,
        type: 'GET',
        //data: { id: ProjectNoDataTemp.iUserId, projectno: ProjectNoDataTemp.vProjectNo, typecode: ProjectNoDataTemp.vProjectTypeCode },
        data: { iUserId: ProjectNoDataTemp.iUserId, vStudyCode: ProjectNoDataTemp.vStudyCode },
        async: false,
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("Project not found.", "ddlProjectNodashboard", ModuleName);
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
    //if (productIds[$('#ddlProjectNodashboard').val()] != undefined) {
        //setworkspaceid = productIds[$('#ddlProjectNodashboard').val()];
    //}

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
        async: false,
        error: function () {
            ValidationAlertBox("Product not found.", "Product", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        var strdata = "";
        if (jsonData.length > 0) {
            $("#Product").empty().append('<option selected="selected" value="0">Please Select Product</option>');
            for (var i = 0; i < jsonData.length; i++)
                $("#Product").append($("<option></option>").val(jsonData[i].nProductNo).html(jsonData[i].vProductName + "   [" + jsonData[i].vProductStrength + "]")).prop('disabled', false);
        }
        else {
            $("#Product").empty().append('<option selected="selected" value="0">Please Select Product</option>').prop('disabled', false);
        }
    }
}

function GetBatchLotNo() {
    //if (productIds[$('#ddlProjectNodashboard').val()] != undefined) {
    //    setworkspaceid = productIds[$('#ddlProjectNodashboard').val()];
    //}

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

function AddTempData() {
    var strdata = "";
    var TransferIndi = $("#ddlTransferIndi").val();
    
    if (TransferIndi == "P" && $("#ddlProductCategory").val() == "L") {
        TransferIndi = "L";
    }
    else if (TransferIndi == "P" && $("#ddlProductCategory").val() == "P") {
        TransferIndi = "P";
    }

    var strTitle = "";
    if (ValidateForm() == false) {
        return false;
    }
    else {
        if (TransferIndi == "P") {
            var selMulti = $.map($("#ddlStorageArea option:selected"), function (el, i) {
                return $(el).text();
            });
            strdata += "<tr>";
            strdata += "<td>" + $("#Product :selected").text() + "</td>";
            strdata += "<td>" + $("#BatchLotNo :selected").text() + "</td>";
            strdata += "<td>" + $("#txtQuantity").val() + "</td>";
            strdata += "<td>" + $("#ddlReason :selected").text() + "</td>";
            strdata += "<td>" + (selMulti.join(", ")) + "</td>";
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
            strdata += "<td class='hidetd'>" + $("#ddlSelectStorage :selected").val() + "</td>";
            strdata += "</tr>";
            $("#tbodyProductAdd").append(strdata);
            $("#tblProductReturnAdd").show();
            $("#btnSavePmsProduct").show();
            $(".hidetd").hide();
            ClearDetailPartData();
            $(".headercontrol").attr('disabled', 'disabled');
        }
        else if (TransferIndi == "K" || TransferIndi == "L") {
            var data = $('table#tblProductReturnAddForKit').find('tbody').find('tr');
            var selMulti = $.map($("#ddlStorageArea option:selected"), function (el, i) {
                return $(el).text();
            });

            var selMultiKit
            if (TransferIndi == "K") {
                selMultiKit = $.map($("#ddlKit option:selected"), function (el, i) {
                    return $(el).text();
                });
            }
            else if (TransferIndi == "L") {
                selMultiKit = $.map($("#ddlProductLabel option:selected"), function (el, i) {
                    return $(el).text();
                });
            }


            var ExistKit = "";
            for (i = 0; i < selMultiKit.length; i++) {
                var Exist = false;
                for (j = 0; j < data.length; j++) {
                    if ($(data[j]).find('td:eq(0)').html() == selMultiKit[i]) {
                        ExistKit += selMultiKit[i] + ",";
                        Exist = true;
                    }
                }
                if (Exist == false) {
                    strdata += "<tr>";
                    strdata += "<td>" + (selMultiKit[i]) + "</td>";
                    strdata += "<td>" + $("#ddlReason :selected").text() + "</td>";
                    strdata += "<td>" + (selMulti.join(", ")) + "</td>";
                    strdata += "<td>" + $("#Remarks").val() + "</td>";
                    strdata += "<td class='hidetd'>" + $("#ddlReason :selected").val() + "</td>";
                    strdata += "<td class='hidetd'>" + $("#ddlStorageArea").val() + "</td>";
                    strdata += "<td id='trRemove'><span class='glyphicon glyphicon-remove' ></span></td>";
                    //strdata += "<td>" + $("#txtNoOfContainers").val() + "</td>";
                    strdata += "</tr>";
                }
            }
            if (ExistKit != "") {
                ValidationAlertBox(ExistKit.substring(0, ExistKit.length - 1) + " : already exist in below table", "ddlKit", ModuleName);
            }

            $("#tbodyProductAddForKit").append(strdata);
            $("#tblProductReturnAddForKit").show();
            $("#btnSavePmsProduct").show();
            $(".hidetd").hide();
            ClearDetailPartData();
            $(".headercontrol").attr('disabled', 'disabled');
        }
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
    $("#txtNoOfContainers").val("");
    ClearQuantityonPopup();
    $("#QuantityRetrunIcon").show();
    $("#ArchiveQty").show();
    $("#btnAddTempProductReturn").show();

    $("#btnClearPmsProduct").show();

    $('#ddlUnit').val(0).attr("selected", "selected").prop("disabled", false);
    $("#divUnit").hide();
    $("#divStorage").attr('style', 'display:none');

}

function ClearHeaderDetail() {
    $("#txtReferenceNo").val("");
    $("#txtSendTo").val("0");
    $("#ShipmentNo").val("");
    $('#ddlProductType').val("0");
    $('#ddlTransferIndi').val("0");
    $("#tblProductReturnAdd tbody tr").remove();
    $("#tblProductReturnAdd").hide();
    $("#tblProductReturnAddForKit").hide();
    $("#tblProductReturnAddForKit tbody tr").remove();

    $('#txtDate').data("DateTimePicker").clear();
    $("#ddlToProjectNo").val("");
    $(".headercontrol").prop('disabled', '');
    $("#btnSavePmsProduct").hide();
    document.getElementById("divkit").style.display = "none";
    document.getElementById("divProduct").style.display = "none";
    $('#ddlProductCategory').val("0")
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

$("#tblProductReturnAddForKit").on('click', '#trRemove', function () {
    $(this).closest('tr').remove();
    if ($("#tblProductReturnAddForKit tr").length == 1) {
        $("#tblProductReturnAddForKit").hide();
        $("#btnSavePmsProduct").hide();
        $(".headercontrol").prop('disabled', '');
    }
    else {
        $("#tblProductReturnAddForKit").show();
        $("#btnSavePmsProduct").show();
        $(".headercontrol").attr('disabled', 'disabled');
    }
});

function validateform() {

    var email = document.getElementById("txtEmailAddress").value;
    var expr = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (isBlank(email)) {
        ValidationAlertBox("Please enter email address.", "");
        return false;
    }
    if (!expr.test(email)) {
        ValidationAlertBox("Invalid email address.", "");
        return false;
    }
}
$("#btnSavePmsProduct").on('click', function () {
    
   

    $("#btnSavePmsProduct").hide();
    if (productIds[$('#ddlProjectNodashboard').val()] != undefined) {
        setworkspaceid = productIds[$('#ddlProjectNodashboard').val()];
    }

    var TransferIndi = "";
    if ($("#ddlTransferIndi").val() == "P" && $("#ddlProductCategory").val() == "L") {
        TransferIndi = "L";
    }
    else {
        TransferIndi = $("#ddlTransferIndi").val()
    }

    var InsertPmsProductReceipt1 = {
        vWorkSpaceId: setworkspaceid,
        vReceiptRefNo: $("#txtReferenceNo").val(),
        vDocTypeCode: DocTypeCode,
        iModifyBy: $("#hdnuserid").val(),
        vSendTo: $("#txtSendTo").val(),
        vShipmentNo: $("#ShipmentNo").val(),
        vToWorkSpaceId: productIds[$('#ddlToProjectNo').val()],
        nStorageLocationNo: $('#ToStorage').val(),
        nProductTypeID: $('#ddlProductType :selected').val(),
        dReceiptDate: $("#txtDate").val(),
        cTransferIndi: TransferIndi,
        nKitTypeNo: $("#ddlKitType").val(),
        vTempRequirement: $("#txtTempRequirement").val(),
        vPlanedDate: $("#txtPlannedDate").val(),
        vSiteStaffMember: $("#txtSiteStaffMember").val(),
        vContactPersonName: $("#txtContactPersonName").val(),
        vContactPersonNumber: $("#txtContactPersonNumber").val(),
        vDeclarationOfConfirmation: $("#txtDeclarationOfConfirmation").val(),
        vEmailAddress : $("#txtEmailAddress").val(),
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
        var TransferIndi = "";
        if ($("#ddlTransferIndi").val() == "P" && $("#ddlProductCategory").val() == "L") {
            TransferIndi = "L";
        }
        else {
            TransferIndi = $("#ddlTransferIndi").val()
        }


        if (TransferIndi == "P") {
            Save_DetailsLevelForProduct(TransactionNo, TransferIndi);
        }
        else {
            Save_DetailsLevelForKit(TransactionNo, TransferIndi);
        }
    }
    SuccessorErrorMessageAlertBox("Product Return saved successfully.", ModuleName);
}

function Save_DetailsLevelForProduct(TransactionNo, TransferIndi) {
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
    var StoreData = [];
    if (productIds[$('#ddlProjectNodashboard').val()] != undefined) {
        setworkspaceid = productIds[$('#ddlProjectNodashboard').val()];
    }
    for (i = 0; i < data.length; i++) {
        var storedata = data[i];

        var RecdQty = "";
        if (DocTypeCode == "ZRE2" && storedata[10] != "") {
            RecdQty = storedata[10];
        }
        else {
            RecdQty = 0;
        }

        var InsertPmsProductReceipt2 = {
            nTransactionNo: TransactionNo,
            vWorkSpaceId: setworkspaceid,
            iStockQty: storedata[2],
            vRemarks: storedata[5],
            nProductNo: storedata[6],
            nStudyProductBatchNo: storedata[7],
            vStorageArea: storedata[8],
            nReasonNo: storedata[9],
            iReceivedQty: RecdQty,
            vDocTypeCode: DocTypeCode,
            vRefModule: RefModule,
            cLocationIndicator: LocationIndicator,
            iModifyBy: $("#hdnuserid").val(),
            vToWorkSpaceId: productIds[$('#ddlToProjectNo').val()],
            cAddSub: "S",
            iRetentionQty: storedata[11],
            iVerificationQty: storedata[12],
            iNonSalableClStockQty: storedata[13],
            cTransferIndi: TransferIndi,
            iArchiveQty: storedata[14],
            iNoOfContainers: storedata[16],
            vUnit: storedata[17],
            vStorageType: storedata[18],
            vTempRequirement: $("#txtTempRequirement").val(),
            vPlanedDate: $("#txtPlannedDate").val(),
            vSiteStaffMember: $("#txtSiteStaffMember").val(),
            vContactPersonName: $("#txtContactPersonName").val(),
            vContactPersonNumber: $("#txtContactPersonNumber").val(),
            vDeclarationOfConfirmation: $("#txtDeclarationOfConfirmation").val(),
            vEmailAddress: $("#txtEmailAddress").val(),
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
        }
    }
}

function Save_DetailsLevelForKit(TransactionNo, TransferIndi) {
    var data = $('table#tblProductReturnAddForKit').find('tbody').find('tr');
    var StoreData = [];
    if (productIds[$('#ddlProjectNodashboard').val()] != undefined) {
        setworkspaceid = productIds[$('#ddlProjectNodashboard').val()];
    }

    for (i = 0; i < data.length; i++) {
        if (TransferIndi == "K") {
            var InsertPmsProductReceipt2 = {
                nTransactionNo: TransactionNo,
                vWorkSpaceId: setworkspaceid,
                vRemarks: $(data[i]).find('td:eq(3)').html(),
                vStorageArea: $(data[i]).find('td:eq(5)').html(),
                nReasonNo: $(data[i]).find('td:eq(4)').html(),
                vDocTypeCode: DocTypeCode,
                vRefModule: RefModule,
                cLocationIndicator: LocationIndicator,
                iModifyBy: $("#hdnuserid").val(),
                cAddSub: "S",
                vKitNo: $(data[i]).find('td:eq(0)').html(),
                cTransferIndi: TransferIndi,
                iNoOfContainers: $(data[i]).find('td:eq(7)').html(),
                vTempRequirement: $("#txtTempRequirement").val(),
                vPlanedDate: $("#txtPlannedDate").val(),
                vSiteStaffMember: $("#txtSiteStaffMember").val(),
                vContactPersonName: $("#txtContactPersonName").val(),
                vContactPersonNumber: $("#txtContactPersonNumber").val(),
                vDeclarationOfConfirmation: $("#txtDeclarationOfConfirmation").val(),
                vEmailAddress: $("#txtEmailAddress").val(),
            }
        }
        else if (TransferIndi == "L") {
            var InsertPmsProductReceipt2 = {
                nTransactionNo: TransactionNo,
                vWorkSpaceId: setworkspaceid,
                vRemarks: $(data[i]).find('td:eq(3)').html(),
                vStorageArea: $(data[i]).find('td:eq(5)').html(),
                nReasonNo: $(data[i]).find('td:eq(4)').html(),
                vDocTypeCode: DocTypeCode,
                vRefModule: RefModule,
                cLocationIndicator: LocationIndicator,
                iModifyBy: $("#hdnuserid").val(),
                cAddSub: "S",
                vStudyProductLabelNo: $(data[i]).find('td:eq(0)').html(),
                cTransferIndi: TransferIndi,
                iNoOfContainers: $(data[i]).find('td:eq(7)').html(),
                vTempRequirement: $("#txtTempRequirement").val(),
                vPlanedDate: $("#txtPlannedDate").val(),
                vSiteStaffMember: $("#txtSiteStaffMember").val(),
                vContactPersonName: $("#txtContactPersonName").val(),
                vContactPersonNumber: $("#txtContactPersonNumber").val(),
                vDeclarationOfConfirmation: $("#txtDeclarationOfConfirmation").val(),
                vEmailAddress: $("#txtEmailAddress").val(),
            }
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
    }

    function SuccessInsertDataReceipt(response) {
        GetProductReturnDetail();
        $("#btnSavePmsProduct").hide();
        $("#ProductModel").modal('hide');
    }
}


function ValidateForm() {
    var TransferIndi = "";
    if ($("#ddlTransferIndi").val() == "P" && $("#ddlProductCategory").val() == "L") {
        TransferIndi = "L";
    }
    else {
        TransferIndi = $("#ddlTransferIndi").val()
    }

    if (Dropdown_Validation(document.getElementById("ddlProductType"))) {
        ValidationAlertBox("Please select Product Type.", "ddlProductType", ModuleName);
        return false;
    }

    if (isBlank(document.getElementById('ProjectNo').value)) {
        ValidationAlertBox("Please enter Project Number.", "ProjectNo", ModuleName);
        return false;
    }

    if (Dropdown_Validation(document.getElementById("txtSendTo"))) {
        ValidationAlertBox("Please select Send To.", "txtSendTo", ModuleName);
        return false;
    }

    //if (isBlank(document.getElementById('txtSendTo').value)) {
    //    ValidationAlertBox("Please enter Send To.", "txtSendTo", ModuleName);
    //    return false;
    //}

    if (isBlank(document.getElementById('txtDate').value)) {
        ValidationAlertBox("Please enter date of Return.", "txtDate", ModuleName);
        return false;
    }

    if (Dropdown_Validation(document.getElementById('ddlTransferIndi'))) {
        ValidationAlertBox("Please select Product Indication.", "ddlTransferIndi", ModuleName);
        return false;
    }

    if ($("#ddlTransferIndi").val() == "P") {
        if (Dropdown_Validation(document.getElementById('ddlProductCategory'))) {
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
        if (isBlank(document.getElementById('ddlKitType').value)) {
            ValidationAlertBox("Please select Kit Type.", "ddlKitType", ModuleName);
            return false;
        }
        else if (isBlank(document.getElementById('ddlKit').value)) {
            ValidationAlertBox("Please select Kit.", "ddlKit", ModuleName);
            return false;
        }
    }
    else if (TransferIndi == "L") {
        if (isBlank(document.getElementById('ddlProductCategory').value)) {
            ValidationAlertBox("Please select Product Category.", "ddlProductCategory", ModuleName);
            return false;
        }
        else if (isBlank(document.getElementById('ddlProductLabel').value)) {
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
        ValidationAlertBox("Please enter No of Container.", "txtNoOfContainers", ModuleName);
        return false;
    }

    if (isBlank(document.getElementById('Remarks').value)) {
        ValidationAlertBox("Please enter Remarks.", "Remarks", ModuleName);
        return false;
    }
    return true;
}

function GetActionName() {
    actionname = $("#hndActionName").val();
    if (actionname == "Destroy") {
        document.getElementById('lblDate').innerHTML = 'Date of Destory *';
        document.getElementById("divdate").style.display = "block";
        $("#divdate").attr("placeholder", "Destory Date");
        document.getElementById("divsento").style.display = "none";
        document.getElementById("divToProjectNo").style.display = "none";
        document.getElementById('h1_id').innerHTML = 'Product Destroy';
        document.getElementById('titleid').innerHTML = 'Product Destroy';
        document.getElementById("btnAddProductData").innerText = "+ Add Product Destroy";
        document.getElementById("StorageAreaID").style.display = "none";
        document.getElementById("ArchiveQty").style.display = "none";
        //document.getElementById("ArchiveQty").style.width= "120px";
        DocTypeCode = "ZDES";
        RefModule = "DS";
        LocationIndicator = "Q";
        QuantityRefModule = "PD";
        $("#QuantityRetrunTextBox").removeClass("col-sm-10").addClass("col-sm-12");
        $("#QuantityAllocation").hide();
        $("#txtQuantity").removeAttr("disabled");
    }
    else if (actionname == "Return") {
        document.getElementById("divsento").style.display = "block";
        document.getElementById("divdate").style.display = "block";
        $("#divdate").attr("placeholder", "Return Date");
        document.getElementById("divToProjectNo").style.display = "none";
        document.getElementById('lblDate').innerHTML = 'Date of Return *';
        //document.getElementById('h1_id').innerHTML = 'Product/Kit Return';
        //document.getElementById('titleid').innerHTML = 'Product/Kit Return';
        //document.getElementById("btnAddProductData").innerText = "+ Add Product/Kit Return";
        document.getElementById("StorageAreaID").style.display = "block";
        document.getElementById("ArchiveQty").style.display = "block";
        DocTypeCode = "ZRE2";
        RefModule = "RT";
        LocationIndicator = "Q";
        QuantityRefModule = "PD";
        $("#txtQuantity").prop('disabled', 'disabled');
    }
    else if (actionname == "Transfer") {
        document.getElementById("divsento").style.display = "block";
        document.getElementById("divdate").style.display = "none";
        document.getElementById('h1_id').innerHTML = 'Product Transfer';
        document.getElementById('titleid').innerHTML = 'Product Transfer';
        document.getElementById("btnAddProductData").innerText = "+ Add Product Transfer";
        document.getElementById("StorageAreaID").style.display = "block";
        document.getElementById("ArchiveQty").style.display = "none";
        DocTypeCode = "ZSTN";
        RefModule = "TR";
        LocationIndicator = "P";
        QuantityRefModule = "PD";
        $("#QuantityRetrunTextBox").removeClass("col-sm-10").addClass("col-sm-12");
        $("#QuantityAllocation").hide();
        $("#txtQuantity").removeAttr("disabled");

    }
}

function GetDashboardData(ActivityDataset) {
    if (ActivityDataset.length == 0) {
        $("#divexport").css("visibility", "hidden");
    }
    else {
        $("#divexport").css("visibility", "visible");
        //$("#divexport").show();
    }
    if (setworkspaceid != "") {
        if (DocTypeCode == "ZRE2") {
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
                "sScrollXInner": "2200" /* It varies dynamically if number of columns increases */,
                "fnCreatedRow": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    //if (aData[17] == "Y") {
                    //    $(nRow).addClass('highlightPendingQA');
                    //}
                    //if (aData[17] == "R") {
                    //    $(nRow).addClass('highlightRejectedQA');
                    //}

                },

                "aoColumns": [
                    { "sTitle": "Project No" },
                    { "sTitle": "Product Indication" },
                    { "sTitle": "Kit/Label No" },
                    { "sTitle": "Product Type" },
                    { "sTitle": "Reference No" },
                    { "sTitle": "Send To" },
                    { "sTitle": "Date of Return" },
                    { "sTitle": "Reason" },
                    { "sTitle": "Storage Area" },
                    { "sTitle": "No Bin/Pallet/Crate/Locker/Container/Shelf/Box/Boxes/Rack" },
                    { "sTitle": "Type of Storage" },
                    { "sTitle": "Product Name" },
                    { "sTitle": "Batch/Lot/Lot No" },
                    { "sTitle": "Quantity" },
                    { "sTitle": "Unit" },
                    { "sTitle": "Remarks" },
                    { "sTitle": "Return By" },
                    { "sTitle": "QA Review Status" },
                    { "sTitle": "QA Review Remarks" },
                    { "sTitle": "QA Review By" },
                    { "sTitle": "QA Review On" },
                       //{ "sTitle": "QA Review Remarks" },
                       //  { "sTitle": "QA Review By" },
                       //    { "sTitle": "QA Review On" },
                     { "sTitle": "View" },
                     { "sTitle": "QA Review" },


                ],
                "columnDefs": [
                      {
                          "targets": [22],
                          "visible": false,
                          "searchable": false
                      },

                    { "width": "4%", "targets": 0 },
                    { "width": "7%", "targets": 1 },
                    { "width": "5%", "targets": 2 },
                    { "width": "5%", "targets": 3 },
                    { "width": "4%", "targets": 4 },
                    { "width": "5%", "targets": 5 },
                    { "width": "6%", "targets": 6 },
                    { "width": "7%", "targets": 7 },
                    { "width": "5%", "targets": 8 },
                    { "width": "7%", "targets": 9 },
                    { "width": "5%", "targets": 10 },
                    { "width": "2%", "targets": 11 },
                    { "width": "2%", "targets": 12 },
                    { "width": "6%", "targets": 13 },
                    { "width": "5%", "targets": 14 },
                    { "width": "8%", "targets": 15 },
                    { "width": "2%", "targets": 16 },
                    { "width": "2%", "targets": 17 },
                    { "width": "3%", "targets": 18 },
                       { "width": "3%", "targets": 19 },
                          { "width": "2%", "targets": 20 },
                              { "width": "2%", "targets": 21 },
                              { "width": "2%", "targets": 22 },
                     //{ "width": "2%", "targets": 18 },
                     // { "width": "2%", "targets": 19 },
                     //  { "width": "2%", "targets": 20 },
                ],
                "oLanguage": {
                    "sEmptyTable": "No Record Found",
                },
            });


        }
        else if (DocTypeCode == "ZDES") {
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
                    { "sTitle": "Reference No" },
                    { "sTitle": "Date of Destroy" },
                    { "sTitle": "Reason" },
                    { "sTitle": "Product Name" },
                    { "sTitle": "Batch/Lot/Lot No" },
                    { "sTitle": "Quantity" },
                    { "sTitle": "Remarks" },
                    { "sTitle": "Destroy By" },

                ],
                "columnDefs": [
                    { "width": "2%", "targets": 0 },
                    { "width": "3%", "targets": 1 },
                    { "width": "2%", "targets": 2 },
                    { "width": "3%", "targets": 3 },
                    { "width": "5%", "targets": 4 },
                    { "width": "7%", "targets": 5 },
                    { "width": "5%", "targets": 6 },
                    { "width": "3%", "targets": 7 },
                    { "width": "4%", "targets": 8 },
                    { "width": "5%", "targets": 9 },
                ],
                "oLanguage": {
                    "sEmptyTable": "No Record Found",
                },
            });
        }
        else if (DocTypeCode == "ZSTN") {
            columnname = "Transfer By"
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
                    { "sTitle": "To Project No" },
                    { "sTitle": "Product Type" },
                    { "sTitle": "Reference No" },
                    { "sTitle": "Send To" },
                    { "sTitle": "Reason" },
                    { "sTitle": "Storage Area" },
                    { "sTitle": "Product Name" },
                    { "sTitle": "Batch/Lot/Lot No" },
                    { "sTitle": "Quantity" },
                    { "sTitle": "Transfer By" },

                ],
                "columnDefs": [
                    { "width": "2%", "targets": 0 },
                    { "width": "3%", "targets": 1 },
                    { "width": "3%", "targets": 2 },
                    { "width": "2%", "targets": 3 },
                    { "width": "2%", "targets": 4 },
                    { "width": "7%", "targets": 5 },
                    { "width": "6%", "targets": 6 },
                    { "width": "8%", "targets": 7 },
                    { "width": "2%", "targets": 8 },
                    { "width": "2%", "targets": 9 },
                    { "width": "6%", "targets": 10 },
                ],
                "oLanguage": {
                    "sEmptyTable": "No Record Found",
                },
            });
        }

        if ($("#hdnUserProfile").val().includes(UserTypeCode)) {
            var table = $('#tblPmsProductData').DataTable();
            table.column(21).visible(true);
        }
        else {
            var table = $('#tblPmsProductData').DataTable();
            //Changed by rinkal
            table.column(21).visible(false);

        }
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
        async: false,
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("Reason not found.", "ddlReason", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        if (jsonData.length > 0) {
            $("#ddlReason").empty().append('<option selected="selected" value="0">Please Select Reason</option>');
            for (var i = 0; i < jsonData.length; i++) {
                $("#ddlReason").append($("<option></option>").val(jsonData[i].nReasonNo).html(jsonData[i].vReasonDesc)).prop('disabled', false);
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
        async: false,
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("To Storage not found.", "ToStorage", ModuleName);
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

    // For server

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

    // For Server use

    $.ajax({
        type: "GET",
        url: BaseUrl + "PmsGeneral/GetSetProjectDetails",
        data: { id: PassData.iUserId },
        //contentType: "application/json; charset=utf-8",
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
        ValidationAlertBox("Current Stock is " + totalavailableqty + ".", "BatchLotNo", ModuleName);
        $("#txtQuantity").val("");
        return false;
    }
}

$('#btnCloseForQty').on('click', function () {
    ClearQuantityonPopup();
});

$('#btnCloseArchiveQty').on('click', function () {
    ClearQuantityonPopup();
});

$('#QuantityAllocation').on('click', function () {


    if (!validationForQtyAllocation())
    { return false; }

    QuantatiyAllocation();
    $('#ProductReturnQuantity').modal('show');

});

$('#spnArchiveQty').on('click', function () {

    if (!validationForQtyAllocation())
    { return false; }
    ArchiveQuantatiyAllocation();
    $('#modalArchive').modal('show');

});

function validationForQtyAllocation() {
    if (Dropdown_Validation(document.getElementById("ddlProductType"))) {
        ValidationAlertBox("Please Select Product Type.", "ddlProductType", ModuleName);
        return false;
    }

    if (Dropdown_Validation(document.getElementById("Product"))) {
        ValidationAlertBox("Please Select Product.", "Product", ModuleName);
        return false;
    }

    if (Dropdown_Validation(document.getElementById("BatchLotNo"))) {
        ValidationAlertBox("Please Select Batch/Lot/Lot No.", "BatchLotNo", ModuleName);
        return false;
    }
    return true;
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
        vDocTypeCode: 'ZMIA'
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
            var RecdQty = "";
            if (DocTypeCode == "ZRE2" && storedata[10] != "") {
                RecdQty = storedata[10];
            }
            else {
                RecdQty = "0";
            }

            iReceivedQty = parseInt(iReceivedQty) + parseInt((RecdQty == "") ? "0" : RecdQty);
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
            document.getElementById('lblPendingQAReview').innerHTML = parseInt((jsonData[0].iPendingReview == null) ? "0" : jsonData[0].iPendingReview);
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

function TotalQuantityPopup() {
    var UsableStock = $("#txtUsableStock").val();
    var RetentionQty = $("#txtRetentionQuantity").val();
    var VerificationQty = $("#txtVerificationQuantity").val();
    var UnUsedQty = $("#txtUnusedQuantity").val();

    if (UsableStock == "") {
        UsableStock = "0";
    }
    if (RetentionQty == "") {
        RetentionQty = "0";
    }
    if (VerificationQty == "") {
        VerificationQty = "0";
    }
    if (UnUsedQty == "") {
        UnUsedQty = "0";
    }

    if (parseInt(UsableStock) > (parseInt(AvailableQtyTemp))) {
        $("#txtUsableStock").val("");
        ValidationAlertBox("You can not enter more than Available Stock.", "txtUsableStock", ModuleName);
        return false;
    }

    if (parseInt(RetentionQty) > (parseInt(RetentionQtyTemp))) {
        $("#txtRetentionQuantity").val("");
        ValidationAlertBox("You can not enter more than Retention Stock.", "txtRetentionQuantity", ModuleName);
        return false;
    }

    if (parseInt(VerificationQty) > (parseInt(VerificationQtyTemp))) {
        $("#txtVerificationQuantity").val("");
        ValidationAlertBox("You can not enter more than Verification Stock.", "txtVerificationQuantity", ModuleName);
        return false;
    }

    if (parseInt(UnUsedQty) > (parseInt(UnusedQtyTemp))) {
        $("#txtUnusedQuantity").val("");
        ValidationAlertBox("You can not enter more than Unused Stock.", "txtUnusedQuantity", ModuleName);
        return false;
    }

    var totalQuantity = parseInt(parseInt(UsableStock)) + parseInt(parseInt(RetentionQty)) + parseInt(parseInt(VerificationQty)) + parseInt(parseInt(UnUsedQty));
    document.getElementById('lblTotalQuantity').innerHTML = (totalQuantity == "") ? "0" : totalQuantity;

}

function CheckValidationForArchive() {
    var Archive = $("#txtArchive").val();
    if (Archive == "") {
        Archive = "0";
    }
    if (parseInt(Archive) > (parseInt(ArchiveQtyTemp))) {
        $("#txtArchive").val("");
        ValidationAlertBox("You can not enter more than Archive Stock.", "txtArchive", ModuleName);
        return false;
    }
    document.getElementById('lblTotalArchiveQuantity').innerHTML = (Archive == "") ? "0" : Archive;

}

function ClearQuantityonPopup() {
    $("#txtUsableStock").val("");
    $("#txtRetentionQuantity").val("");
    $("#txtVerificationQuantity").val("");
    $("#txtUnusedQuantity").val("");
    $("#txtArchive").val("");
    document.getElementById('lblTotalQuantity').innerHTML = "0";
    document.getElementById('lblTotalArchiveQuantity').innerHTML = "0";
}

$("#btnSaveQuantatiy").on("click", function () {
    if ($("#txtUsableStock").val() == "") {
        $("#txtUsableStock").val("0");
    }
    if ($("#txtRetentionQuantity").val() == "") {
        $("#txtRetentionQuantity").val("0");
    }
    if ($("#txtVerificationQuantity").val() == "") {
        $("#txtVerificationQuantity").val("0");
    }
    if ($("#txtUnusedQuantity").val() == "") {
        $("#txtUnusedQuantity").val("0");
    }


    var SumQty = $("#txtUsableStock").val() + $("#txtRetentionQuantity").val() + $("#txtVerificationQuantity").val() + $("#txtUnusedQuantity").val();
    var TotalQty = $("#txtUsableStock").val() + " | " + $("#txtRetentionQuantity").val() + " | " + $("#txtVerificationQuantity").val() + " | " + $("#txtUnusedQuantity").val();


    var iPendingReview = document.getElementById('lblPendingQAReview').innerHTML;

    var ttlQty = document.getElementById('lblTotalQuantity').innerHTML
    var avlQty = document.getElementById('lblAvailableQuantity').innerHTML

    if ((parseInt(ttlQty) + parseInt(iPendingReview)) > parseInt(avlQty)) {
        $("#txtQuantity").val('');
        ClearQuantityonPopup();
        ValidationAlertBox("Invalid Quantity. Quantity pending for QA : " + iPendingReview + " .", "txtUsableStock", ModuleName);
    }
    else {
        if (SumQty != 0) {
            $("#txtQuantity").val(TotalQty);
        }
        else {
            $("#txtQuantity").val("");
        }
        $("#ProductReturnQuantity").modal('hide');
    }
});

$("#btnSaveArchiveQuantatiy").on("click", function () {
    if ($("#txtArchive").val() == "") {
        $("#txtUsableStock").val("0");
    }
    var TotalQty = $("#txtArchive").val();
    $("#txtQuantity").val(TotalQty);
    $("#modalArchive").modal('hide');
});

function GetKit() {
    $('#ddlKit option').each(function () {
        $(this).remove();
    });

    var PostData = {
        vWorkSpaceID: setworkspaceid,
        nProductTypeID: $("#ddlProductType").val(),
        nKitTypeNo: $("#ddlKitType").val(),
        vDocTypeCode: 'ZRE2'
    }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/Proc_GetAvailableKitNo",
        type: 'POST',
        data: PostData,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Kit data is not found.", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        if (jsonData.length == 0) {
            $('#ddlKit').multiselect('destroy');

            $('#ddlKit').multiselect({
                nonSelectedText: 'Please Select Kit',
                buttonClass: 'form-control',
                enableFiltering: true,
                enableCaseInsensitiveFiltering: true,
                numberDisplayed: 2,
            });
        }
        for (var i = 0; i < jsonData.length; i++) {
            $("#ddlKit").append($("<option></option>").val(jsonData[i].vKitNo).html(jsonData[i].vKitNo));
            $('#ddlKit').multiselect('rebuild');
        }
    }

}

$("#ddlTransferIndi").on("change", function () {
    var transferindi = $("#ddlTransferIndi").val();

    if (transferindi == "P") {
        document.getElementById("divProductCategory").style.display = "block";
        document.getElementById("divKitType").style.display = "none";
        document.getElementById("divkit").style.display = "none";
        document.getElementById("divProduct").style.display = "none";
        $("#divProductCategory").val(0);
    }
    else if (transferindi == "K") {
        GetKitType();
        document.getElementById("divProductCategory").style.display = "none";
        document.getElementById("divKitType").style.display = "block";
        document.getElementById("divkit").style.display = "none";
        document.getElementById("divProduct").style.display = "none";
    }
    else {
        document.getElementById("divProductCategory").style.display = "none";
        document.getElementById("divKitType").style.display = "none";
        document.getElementById("divkit").style.display = "none";
        document.getElementById("divProduct").style.display = "none";
    }
});

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
                    //ValidationAlertBox("Kit Type Data Is not found.", ModuleName);
                    ValidationAlertBox("Kit type data is not found.", "ddlKitType", ModuleName);
                }
            });
        },
        error: function () {
            ValidationAlertBox("Kit type data is not found.", "ddlKitType", ModuleName);
        }
    });
}

$("#ddlProductCategory").on("change", function () {
    ClearDetailPartData();
    var value = $("#ddlProductCategory").val();
    document.getElementById("divkit").style.display = "none";
    document.getElementById("divKitType").style.display = "none";
    if (value == "P") {
        document.getElementById("divProduct").style.display = "block";
        document.getElementById("divProductLabel").style.display = "none";
        GetProductName();
    }
    else if (value == "L") {
        document.getElementById("divProduct").style.display = "none";
        document.getElementById("divProductLabel").style.display = "block";
        document.getElementById("divUnit").style.display = "none";
        GetStudyProductLabel();
    }

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
            SuccessorErrorMessageAlertBox("Study Product Label not found.", ModuleName);
        }
    });
}


$("#ddlKitType").on("change", function () {
    var value = $("#ddlKitType").val();
    document.getElementById("divProduct").style.display = "none";
    document.getElementById("divProductLabel").style.display = "none";
    document.getElementById("divkit").style.display = "block";
    GetKit();
});

function pmsStudyProductReceiptSelectionData(e) {
    
    SaveContinueFlag = true;
    $("#tblStudyProductReceiptAdd").hide();
    flag = "";
    var nTransactionNo = $(e).attr("nTransactionNo");
    var nTransactionDtlNo = $(e).attr("nSPTransactionDtlNo");
    var nProductTypeID = $(e).attr("nProductTypeID");
    vnProductNo = $(e).attr("nProductNo");
    var nStudyProductBatchNo = $(e).attr("nStudyProductBatchNo");
    var cTransferIndi = $(e).attr("cTransferIndi");
    var vStudyCode = $('#ParentSiteNo').val();
    //vProductStrength
    //var vStudyCode = $(e).attr("vStudyCode");

    if (cTransferIndi == "Product") {
        TransferIndi = "P";
    }
    else if (cTransferIndi == "Kit") {
        TransferIndi = "K";
    }

    GetProductType();
    
    $("#ddlProductType").val(nProductTypeID).attr("selected", "selected").prop("disabled", "disabled");
    GetProductName();
    GetReason();
    GetSiteParentId();

    $("#Product").val(vnProductNo);
    $("#nTransactionno").val(nTransactionNo);
    $("#nSPTTransactionDtlNo").val(nTransactionDtlNo);

    $('#ddlProductType').val(nProductTypeID).attr("selected", "selected").prop("disabled", "disabled");
    GetBatchLotNo();


    $('#BatchLotNo').val(nStudyProductBatchNo).attr("selected", "selected").prop("disabled", "disabled");

    $("#divProduct").show();


    var GetDashBoardSelectionData = {
        nTransactionNo: nTransactionNo,
        nTransactionDtlNo: nTransactionDtlNo,
    }

    var GetPMSStudyProductReceiptSelection = {
        Url: BaseUrl + "PmsStudyProductReceipt/StudyProductSelectionData",
        SuccessMethod: "SuccessMethod",
        Data: GetDashBoardSelectionData
    }

    if ($(e).attr("newtitle") == "View") {
        $.ajax({
            url: GetPMSStudyProductReceiptSelection.Url,
            type: 'POST',
            data: GetPMSStudyProductReceiptSelection.Data,
            async: false,
            success: SuccessMethod,
            error: function () {
                SuccessorErrorMessageAlertBox("Data not found.", ModuleName);
            }
        });

        function SuccessMethod(jsonData) {
            $("#ProjectNo").val($("#ddlProjectNodashboard").val()).prop("disabled", "disabled");
            $('#Product').val(jsonData[0].nProductNo).attr("selected", "selected").prop("disabled", "disabled");
            $('#BatchLotNo').val(jsonData[0].nStudyProductBatchNo).attr("selected", "selected").prop("disabled", "disabled");
            $("#txtReferenceNo").val(jsonData[0].vReceiptRefNo).prop("disabled", "disabled");
            $("#txtSendTo").val(jsonData[0].vSendTo).prop("disabled", "disabled");
            if (jsonData[0].dReceiptDate == "1-1-1900" || jsonData[0].dReceiptDate == "1900-01-01T00:00:00") {
                $("#txtReceiptDateTime").val("").prop("disabled", "disabled");
                $('#txtReceiptDateTime').data("DateTimePicker").clear();
            }
            else {
                var MonthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                var txtreceiptdatetime = jsonData[0].dReceiptDate
                var date = txtreceiptdatetime.split("-");
                var result = date[2].split("T")
                var time = result[1].split(":");
                var monthinid = parseInt(date[1]);
                var datetime = result[0] + "-" + MonthList[monthinid - 1] + "-" + date[0];
                $("#txtDate").val(datetime).prop("disabled", "disabled");
            }
            $("#ddlTransferIndi").val(jsonData[0].cTransferIndi.trim()).prop("disabled", "disabled");
            $("#ddlProductCategory").show();
            $("#ddlProductCategory").val('P').prop("disabled", "disabled")
            $('#BatchLotNo').val(nStudyProductBatchNo).prop("disabled", "disabled");
            $("#txtQuantity").val(jsonData[0].iReceivedQty);

            $("#QuantityRetrunIcon").hide();
            $("#ArchiveQty").hide();
            $("#ddlReason").val(jsonData[0].nReasonNo).attr("selected", "selected").prop("disabled", "disabled")
            $("#ddlSelectStorage").val(jsonData[0].vStorageType).attr("selected", "selected").prop("disabled", "disabled")
            BindTypeOfStorage();
            var data = jsonData[0].vStorageArea
            var dataarray = data.split(",");
            $("#ddlStorageArea").val(dataarray).prop("disabled", "disabled");
            $("#ddlStorageArea").multiselect("refresh");
            jQuery("#titleMode").text('Mode:-View');
            $("#ddlStorageArea").multiselect("disable");

            $("#Remarks").val(jsonData[0].vRemarks).prop("disabled", "disabled");
            
            $("#txtNoOfContainers").val(jsonData[0].iNoOfContainers).prop("disabled", "disabled");

            $("#btnSavePmsProduct").hide();
            $("#btnAddTempProductReturn").hide();
            $("#btnClearPmsProduct").hide();
            $("#tblProductReturnAdd").hide();

            $(".multiselect").prop('disabled', 'disabled');

            $("#divUnit").show();
            $("#ddlUnit").val(jsonData[0].vUnit).prop("disabled", "disabled");
            $("#txtTempRequirement").val(jsonData[0].vTempRequirement).prop("disabled", "disabled");
            $("#txtPlannedDate").val(jsonData[0].vPlanedDate).prop("disabled", "disabled");
            $("#txtSiteStaffMember").val(jsonData[0].vSiteStaffMember).prop("disabled", "disabled");
            $("#txtContactPersonName").val(jsonData[0].vContactPersonName).prop("disabled", "disabled");
            $("#txtContactPersonNumber").val(jsonData[0].vContactPersonnumber).prop("disabled", "disabled");
            $("#txtDeclarationOfConfirmation").val(jsonData[0].vDeclarationOfConfirmation).prop("disabled", "disabled");
            $("#txtEmailAddress").val(jsonData[0].vEmailAddress).prop("disabled", "disabled");


        }
    }
}

function pmsStudyViewAuthenticate(e) {
    debugger;
    nTransactionNoQA = "";
    nTransactionDtlNoQA = "";
    nTransactionNoQA = $(e).attr("nTransactionNo");
    nTransactionDtlNoQA = $(e).attr("nSPTransactionDtlNo");
    var cIsQAReview = $(e).attr("cIsQAReview");
    cTransferIndi = $(e).attr("cTransferIndi");

    if (cIsQAReview == 'Y') {
        return;
    }
    else if (cIsQAReview == 'R') {
        return;
    }
    else {
        $('#ViewAuthenticate').modal('show');
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
        nTransactionNo: nTransactionNoQA,
        nTransactionDtlNo: nTransactionDtlNoQA,
        vQARemarks: $("#txtRemark").val(),
        vDocTypeCode: 'ZRE2',
        cTransferIndi: cTransferIndi,
        sessionPass: $("#hdnPassword").val(),
        Password: $("#txtPassword").val(),
        iUserId: $("#hdnuserid").val()

    }

    var InsertProductData = {
        Url: BaseUrl + "PmsProductReturn/InsertPmsProductReturnDtlQA",
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
                SuccessorErrorMessageAlertBox("Product Return reviewed successfully.", ModuleName);
                GetProductReturnDetail();
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


    var InsertPmsProductRet1 = {
        nTransactionNo: nTransactionNoQA,
        nTransactionDtlNo: nTransactionDtlNoQA,
        vDocTypeCode: 'ZMIA',
        sessionPass: $("#hdnPassword").val(),
        Password: $("#txtPassword").val(),
        vQARemarks: $("#txtRemark").val(),
        iUserId: $("#hdnuserid").val(),
        cIsQAReview: 'R',
        iUserId: $("#hdnuserid").val()
    }

    var InsertProductData = {
        Url: BaseUrl + "PmsProductReturn/InsertPmsProductReturnDtlQARejected",
        SuccessMethod: "SuccessMethod",
        Data: InsertPmsProductRet1
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
                SuccessorErrorMessageAlertBox("Product Return rejected successfully.", ModuleName);
                GetProductReturnDetail();
            }
            else if (jsonData == "error") {
                $("#ViewAuthenticate").show();
                ValidationAlertBox("Password Authentication Fails.", "txtPassword", ModuleName);
            }
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Data not found.", ModuleName);
        }
    });
}

$("#txtNoOfContainers").on('keypress', function (e) {
   
    var regExp = /[a-z]/i;
    var value = String.fromCharCode(e.which) || e.key;
    if (regExp.test(value)) {
        e.preventDefault();
        return false;
    }


});


$("#txtUsableStock").on('keypress', function (e) {
   
    var regExp = /[a-z]/i;
    var value = String.fromCharCode(e.which) || e.key;
    if (regExp.test(value)) {
        e.preventDefault();
        return false;
    }
});

$("#txtRetentionQuantity").on('keypress', function (e) {
   
    var regExp = /[a-z]/i;
    var value = String.fromCharCode(e.which) || e.key;
    if (regExp.test(value)) {
        e.preventDefault();
        return false;
    }
});

$("#txtVerificationQuantity").on('keypress', function (e) {
    debugger;
    var regExp = /[a-z]/i;
    var value = String.fromCharCode(e.which) || e.key;
    if (regExp.test(value)) {
        e.preventDefault();
        return false;
    }
});

$("#txtUnusedQuantity").on('keypress', function (e) {
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