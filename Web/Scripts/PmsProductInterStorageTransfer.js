var productIds = new Object();
var setWorkspaceId = "";
var totalavailableqty;
var totalqtyStock;
var viewmode;
var ModuleName = 'Product Inter Transfer'
var Transferindi;
var vProjectNo = "";
var result = false;
var setTransactionNo = "";
var setStudyCode = "";
var StageCode = "";
var StageName = "";
var ValidUserTypeCode;
var reviewerFlag = false;

$(document).ready(function () {

    UserTypeCode = $("#hdnUserTypeCode").val();

    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('.modal').modal('hide');

    var GetWorkflowUserRightsData = {
        vUserTypeCode: $("#hdnUserTypeCode").val(),
        vDocTypeCode: 'ZIST',
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

                if (StageName == "QA") {
                    StageCode = "";
                    $("#btnAddProductInterStorageTransfer").hide();
                }
            }
        }
    });

    CheckSetProject();
    if (setWorkspaceId != "") {
        BindData();
    }

    GetViewMode();

    iUserNo = $("#hdnuserid").val();
    var MenuId = $("#hdnOperationcode").val();
    iUserNo = $("#hdnuserid").val();
    $("#spnwelcome").html($("#hdnusername").val());
    $("#spnLoginTime").html($("#hdnlogintime").val());
    $("#divexport").css("visibility", "hidden");
    $("#ProjectNo").prop('disabled', 'disabled');

    $("#tblProductInterStorageTransferAdd").hide();

    //Get Project No
    var GetPmsProductInterStorageTransferProjectNo = {
        //Url: BaseUrl + "PmsProductBatch/GetProjectNo",
        Url: BaseUrl + "PmsGeneral/GetScopeWiseProject",
        SuccessMethod: "SuccessMethod",
    }

    $('#ddlProjectNodashboard').on('change keyup paste mouseup', function () {
        if ($('#ddlProjectNodashboard').val().length == 2) {

            var ProjectNoDataTemp = {
                //vProjectNo: $('#ddlProjectNodashboard').val(),
                iUserId: $("#hdnuserid").val(),
                vStudyCode: $('#ddlProjectNodashboard').val()
                //vProjectTypeCode: $("#hdnscopevalues").val(),
            }

            GetAllPmsProductInterStorageTransferProjectNo(GetPmsProductInterStorageTransferProjectNo.Url, GetPmsProductInterStorageTransferProjectNo.SuccessMethod, ProjectNoDataTemp);

        }
        else if ($('#ddlProjectNodashboard').val().length < 2) {
            $("#ddlProjectNodashboard").autocomplete({
                source: "",
                change: function (event, ui) { },
                select: function (event, ui) {
                    vProjectNo = ui.item.value;
                    $('#ddlProjectNodashboard').val(vProjectNo);
                    BindData();
                }

            });
        }
    });

    // Get From Storage Name
    GetPmsProductInterStorageTransferFromStrage = {
        Url: BaseUrl + "PmsProductInterStorageTransfer/GetToStorageLocationName",
        SuccessMethod: "SuccessMethod",
    }
    GetAllPmsProductInterStorageTransferFromStorage(GetPmsProductInterStorageTransferFromStrage.Url, GetPmsProductInterStorageTransferFromStrage.SuccessMethod);



    //Get Reason Master
    var id = MenuId;
    var GetPmsProductInterStorageTransferReasonDesc = {
        Url: BaseUrl + "PMSGeneral/ReasonLocationWise",
        SuccessMethod: "SuccessMethod",
    }
    GetAllPmsProductInterStorageTransferReason(GetPmsProductInterStorageTransferReasonDesc.Url, GetPmsProductInterStorageTransferReasonDesc.SuccessMethod);

    // Get Storage Area
    $('#StorageArea').multiselect({
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
});

$("#btnAddProductInterStorageTransfer").on("click", function () {
    $(".headercontrol").prop('disabled', '');
    $("#FromStorage").prop('disabled', '');
    $('#ProjectNo').val($('#ddlProjectNodashboard').val());

    $("#StorageArea  option:selected").prop("selected", false);
    $("#StorageArea  option").remove();
    $('#StorageArea').multiselect('rebuild');

    clearDetailsPartData();
    clearHeaderPartData();
    jQuery("#titleMode").text('Mode:-Add');
    jQuery("#spnSaveProductInterStorageTransfer").text('Save');
    //if (UserTypeCode == ViewOnlyUser) {
    //    $("#btnAddTempProduct").hide();
    //}
    //else {
    //    $("#btnAddTempProduct").show();
    //}
    $("#btnAddTempProduct").show();
    $("#tblProductInterStorageTransferAdd tbody tr").remove();
    $("#tblProductInterStorageTransferAdd thead").hide();

    if (isBlank(document.getElementById('ddlProjectNodashboard').value)) {
        ValidationAlertBox("Please enter Project No.", "ddlProjectNodashboard", ModuleName);
        return false;
    }
    $("#divOther")[0].style.display = 'none'
    $("#ToStorage").empty().append('<option selected="selected" value="0">Please Select To Storage</option>');
    $("select#FromStorage")[0].selectedIndex = 0;
    $("select#ToStorage")[0].selectedIndex = 0;
    GetProductType();
    document.getElementById("divProduct").style.display = "none";
    document.getElementById("divKit").style.display = "none";
});

$("#btnAddTempProduct").on("click", function () {

    AddTempData();

    if (Dropdown_Validation(document.getElementById("FromStorage"))) {
        $("#FromStorage").prop('disabled', '');
    } else {
        $("#FromStorage").prop('disabled', 'disabled');
    }
    if ($("#tblProductInterStorageTransferAdd tr").length == 1) {
        $("#tblProductInterStorageTransferAdd").hide();
        $("#btnSavePmsProductInterStorageTransfer").hide();
        $(".headercontrol").prop('disabled', '');
    }
    else {
        $("#tblProductInterStorageTransferAdd").show();
        $("#btnSavePmsProductInterStorageTransfer").show();
        $(".headercontrol").attr('disabled', 'disabled');
    }


    //var CheckQaReview = {
    //    vWorkSpaceId: setWorkspaceId,
    //    vDocTypeCode: "ZSTK",
    //    nProductNo: $("#Product :selected").val(),
    //    nStudyProductBatchNo: $("#BatchLotNo :selected").val()
    //}
    //var CheckQaReviewData = {
    //    Url: BaseUrl + "PmsProductInterStorageTransfer/CheckIsQAReviewDone",
    //    SuccessMethod: "SuccessMethod",
    //    Data: CheckQaReview,
    //}

    //CheckQaReviewFunction(CheckQaReviewData.Url, CheckQaReviewData.SuccessMethod, CheckQaReviewData.Data);



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
            if ($("#tblProductInterStorageTransferAdd tr").length == 1) {
                $("#tblProductInterStorageTransferAdd").hide();
                $("#btnSavePmsProductInterStorageTransfer").hide();
                $(".headercontrol").prop('disabled', '');
            }
            else {
                $("#tblProductInterStorageTransferAdd").show();
                $("#btnSavePmsProductInterStorageTransfer").show();
                $(".headercontrol").attr('disabled', 'disabled');
            }
        }
        else {
            SuccessorErrorMessageAlertBox("QA Review is Pending.", ModuleName);
        }
    }
}


$("#btnExitPmsProductInterStorageTransfer").on("click", function () {
    ConfirmAlertBox(ModuleName);
});

$("#btnClearPmsProductInterStorageTransfer").on("click", function () {
    clearHeaderPartData();
    clearDetailsPartData();
    $("#btnAddTempProduct").show();
    $("#tblProductInterStorageTransferAdd tbody tr").remove();
    $("#tblProductInterStorageTransferAdd thead").hide();
});

$("#ddlProjectNodashboard").on("blur", function () {
    BindData();
});

$("#Product").on("change", function () {
    GetbatchLotNo();
});

$("#btnSavePmsProductInterStorageTransfer").on("click", function () {
    $("#btnSavePmsProductInterStorageTransfer").hide();
    var data = $('table#tblProductInterStorageTransferAdd').find('tbody').find('tr');
    var StoreData = [];
    var TempKitNo = "";
    for (i = 0; i < data.length; i++) {
        if ($(data[i]).find('td:eq(3)').html() == "undefined") {
            TempKitNo = "";
        }
        else {
            TempKitNo = $(data[i]).find('td:eq(3)').html();
        }

        var InsertPmsProductReceipt1 = {
            vWorkSpaceId: setWorkspaceId,
            nStorageLocationNo: $(data[i]).find('td:eq(13)').html(),
            nToStorageLocationNo: $(data[i]).find('td:eq(14)').html(),
            vDocTypeCode: "ZIST",
            nTransactionNo: "1",
            iModifyBy: $("#hdnuserid").val(),
            nProductTypeID: $(data[i]).find('td:eq(5)').html(),

            iNoOfContainers: $(data[i]).find('td:eq(11)').html(),
            cTransferIndi: Transferindi,
        }
        var InsertProductInterStorageTransferData = {
            Url: BaseUrl + "PmsStudyProductReceipt/InsertPmsProductReceiptHeader",
            SuccessMethod: "SuccessMethod",
            Data: InsertPmsProductReceipt1,
        }

        InsertPmsProductInterStorageTransferMaster(InsertProductInterStorageTransferData.Url, InsertProductInterStorageTransferData.SuccessMethod, InsertProductInterStorageTransferData.Data, $(data[i]));
    }
    if (result == true) {
        SuccessorErrorMessageAlertBox("Inter storage transfer saved successfully.", ModuleName);
    }

    GetDashboardData();
    //$("#loader").attr("style", "display:none");
    $("#btnSavePmsProductInterStorageTransfer").show();

});

$("#ddlProductType").on("change", function () {
    Transferindi = $("#ddlTransferIndi").val();
    if (Transferindi == "P") {
        GetProductName();
    }
    else if (Transferindi == "K") {
        GetKit();
    }
});

//For all selected storage type value 
$("#ToStorage").on("change", function () {

    var GETStorageArea = {
        Url: BaseUrl + "PmsGeneral/ALLStorageAreaData",
        SuccessMethod: "SuccessMethod"
    }

    var FilterData = {
        nStorageTypeId: $("#ToStorage :selected").val(),
        vLocationCode: $("#hdnUserLocationCode").val(),
    }

    GetAllPmsProductInterStorageTransferStorageArea(GETStorageArea.Url, FilterData);
});

$("#BatchLotNo").on("change", function () {
    if ($("#BatchLotNo").val() != "0") {
        getUnit();

    }
    else {
        $("#ddlUnit").val(0).attr('disabled', false);
        $("#divUnit").hide();
    }

    ProductInterStorageTransfer();
});

$("#Reason").on("change", function () {
    if ($("#Reason :selected").text() == "Other") {
        $("#txtOther").val("");
        $("#divOther")[0].style.display = 'block';
    }
    else {
        $("#txtOther").val("");
        $("#divOther")[0].style.display = 'none';
    }
});



$("#Quantity").on("blur", function () {
    QuantityValidation();
    ProductInterStorageTransfer();
});

var InsertPmsProductInterStorageTransferMaster = function (Url, SuccessMethod, Data, gridData) {
    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        async: false,
        success: SuccessInsertData,
        error: function () {
            SuccessorErrorMessageAlertBox("Error in insert header part.", ModuleName);
        }
    });
    function SuccessInsertData(response) {

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

        //var data = $('table#tblProductInterStorageTransferAdd').find('tbody').find('tr');
        //FromStorageInsertData(gridData, setWorkspaceId, response)
        //var data = HTMLtbl.getData($('#tblProductInterStorageTransferAdd'));
        var StoreData = [];
        var TempKitNo = "";
        // for (i = 0; i < data.length; i++) {
        if (gridData.find('td:eq(3)').html() == "undefined") {
            TempKitNo = "";
        }
        else {
            TempKitNo = gridData.find('td:eq(3)').html();
        }
        var InsertPmsProductReceipt2 = {
            nTransactionNo: response,
            nProductNo: gridData.find('td:eq(5)').html(),
            nStudyProductBatchNo: gridData.find('td:eq(7)').html(),
            vBatchLotNo: gridData.find('td:eq(1)').html(),
            iReceivedQty: gridData.find('td:eq(2)').html(),
            iModifyBy: $("#hdnuserid").val(),
            vStorageArea: gridData.find('td:eq(6)').html(),
            vWorkSpaceId: setWorkspaceId,
            vDocTypeCode: "ZIST",
            nReasonNo: gridData.find('td:eq(4)').html(),
            dExpiryDate: "1900-01-01 00:00:00.000",
            nStorageLocationNo: gridData.find('td:eq(13)').html(),
            nToStorageLocationNo: gridData.find('td:eq(14)').html(),
            vOtherReason: gridData.find('td:eq(15)').html(),
            cProductFlag: "P",
            cLocationIndicator: "P",
            vRefModule: "QM",
            cAddSub: "A",
            cTransferIndi: Transferindi,
            vKitNo: TempKitNo,
            iNoOfContainers: gridData.find('td:eq(11)').html(),
            vUnit: gridData.find('td:eq(12)').html(),
            vStorageType: gridData.find('td:eq(16)').html(),
            iStageCode: 201
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
            clearDetailsPartData();
            clearHeaderPartData();
            $("#btnSavePmsProductInterStorageTransfer").hide();
            GetDashboardData();
            result = true;
        }
        //}


    }

}

function FromStorageInsertData(gridData, setWorkspaceId, response) {
    var StoreData = [];
    var TempKitNo = "";
    // for (i = 0; i < data.length; i++) {
    if (gridData.find('td:eq(3)').html() == "undefined") {
        TempKitNo = "";
    }
    else {
        TempKitNo = gridData.find('td:eq(3)').html();
    }
    var InsertPmsProductReceipt2 = {
        nTransactionNo: response,
        nProductNo: gridData.find('td:eq(5)').html(),
        nStudyProductBatchNo: gridData.find('td:eq(7)').html(),
        vBatchLotNo: gridData.find('td:eq(1)').html(),
        iReceivedQty: gridData.find('td:eq(2)').html(),
        iModifyBy: $("#hdnuserid").val(),
        vStorageArea: gridData.find('td:eq(6)').html(),
        vWorkSpaceId: setWorkspaceId,
        vDocTypeCode: "ZIST",
        nReasonNo: gridData.find('td:eq(4)').html(),
        dExpiryDate: "1900-01-01 00:00:00.000",
        nStorageLocationNo: gridData.find('td:eq(13)').html(),
        nToStorageLocationNo: gridData.find('td:eq(13)').html(),
        vOtherReason: gridData.find('td:eq(15)').html(),
        cProductFlag: "P",
        cLocationIndicator: "P",
        vRefModule: "QM",
        cAddSub: "S",
        cTransferIndi: Transferindi,
        vKitNo: TempKitNo,
        iNoOfContainers: gridData.find('td:eq(11)').html(),
        vUnit: gridData.find('td:eq(12)').html()

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
        clearDetailsPartData();
        clearHeaderPartData();
        $("#btnSavePmsProductInterStorageTransfer").hide();
        GetDashboardData();
        result = true;
    }
    //}
}

var GetAllPmsProductInterStorageTransferFromStorage = function (Url, SuccessMethod) {


    $.ajax({
        url: Url,
        type: 'GET',
        data: { nStorageTypeId: '0', vLocationCode: $("#hdnUserLocationCode").val() },
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Previous Storage status not found.", ModuleName);
        }
    });

    //$.ajax({
    //    url: Url,
    //    type: 'GET',
    //    success: SuccessMethod,
    //    error: function () {
    //        SuccessorErrorMessageAlertBox("Previous Storage status not found.", ModuleName);
    //    }
    //});

    function SuccessMethod(jsonData) {
        if (jsonData.length > 0) {
            for (var i = 0; i < jsonData.length; i++) {
                for (var i = 0; i < jsonData.length; i++) {
                    $("#FromStorage").append($("<option></option>").val(jsonData[i].nStorageTypeId).html(jsonData[i].vStorageType));
                }
            }
        }
    }
}

$("#FromStorage").on("change", function () {

    $("select#ddlProductType").prop('selectedIndex', 0);
    $("select#ddlTransferIndi").prop('selectedIndex', 0);
    $("#divProduct").attr("style", "display:none");
    $("#divKit").attr("style", "display:none");
    $("select#Product").prop('selectedIndex', 0);
    $("select#BatchLotNo").prop('selectedIndex', 0);
    $("#ddlUnit").val(0).attr('disabled', false);
    $("#divUnit").hide();

    // Get To Storage Name
    GetPmsProductInterStorageTransferToStrage = {
        Url: BaseUrl + "PmsProductInterStorageTransfer/GetToStorageLocationName",
        SuccessMethod: "SuccessMethod",
    }
    GetAllPmsProductInterStorageTransferToStorage(GetPmsProductInterStorageTransferToStrage.Url, GetPmsProductInterStorageTransferToStrage.SuccessMethod);
});



var GetAllPmsProductInterStorageTransferToStorage = function (Url, SuccessMethod) {
    $.ajax({
        url: Url,
        type: 'GET',
        data: { nStorageTypeId: $("#FromStorage").val(), vLocationCode: $("#hdnUserLocationCode").val() },
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Current Storage Status not found.", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        // $("#ToStorage").empty();
        if (jsonData.length > 0) {
            $("#ToStorage").empty().append('<option selected="selected" value="0">Please Select To Storage</option>');
            for (var i = 0; i < jsonData.length; i++) {
                for (var i = 0; i < jsonData.length; i++) {
                    $("#ToStorage").append($("<option></option>").val(jsonData[i].nStorageTypeId).html(jsonData[i].vStorageType));
                }
            }
        }
        else {
            $("#ToStorage").empty().append('<option selected="selected" value="0">Please Select To Storage</option>');
        }
    }
}

var GetAllPmsProductInterStorageTransferReason = function (Url, SuccessMethod) {
    var FilterData = {
        vOperationCode: $("#hdnOperationcode").val(),
        vLocationCode: $("#hdnUserLocationCode").val(),
    }
    $.ajax({
        url: Url,
        type: 'POST',
        data: FilterData,
        asyc: false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Reason not found.", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        if (jsonData.length > 0) {
            $("#Reason").empty().append('<option selected="selected" value="0">Please Select Reason</option>');
            for (var i = 0; i < jsonData.length; i++) {
                $("#Reason").append($("<option></option>").val(jsonData[i].nReasonNo).html(jsonData[i].vReasonDesc));
            }
        }
        else {
            $("#Reason").empty().append('<option selected="selected" value="0">Please Select Reason</option>');
        }
    }
}

var GetAllPmsProductInterStorageTransferProjectNo = function (Url, SuccessMethod, ProjectNoDataTemp) {
    $.ajax({
        url: Url,
        type: 'GET',
        async: false,
        //data: { id: ProjectNoDataTemp.iUserId, projectno: ProjectNoDataTemp.vProjectNo, typecode: ProjectNoDataTemp.vProjectTypeCode },
        data: { iUserId: ProjectNoDataTemp.iUserId, vStudyCode: ProjectNoDataTemp.vStudyCode },
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Project not found.", ModuleName);
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

    }
}


var GetAllPmsProductInterStorageTransferStorageArea = function (Url, FilterData) {
    $("#StorageArea  option:selected").prop("selected", false);
    $("#StorageArea  option").remove();
    $('#StorageArea').multiselect('rebuild');

    $.ajax({
        url: Url,
        type: 'POST',
        data: FilterData,
        asyc: false,
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("Storage Area not found.", "BatchLotNo", ModuleName);
        }
    });
    function SuccessMethod(jsonData) {
        var strdata = "";
        $("#StorageArea").empty();
        if (jsonData.length > 0) {
            for (var i = 0; i < jsonData.length; i++) {
                $("#StorageArea").append($("<option></option>").val(jsonData[i].nStorageAreaNo).html(jsonData[i].vStorageAreaName + " | " + jsonData[i].vCompartmentName + " | " + jsonData[i].vRackName));
                $('#StorageArea').multiselect('rebuild');
            }
        }
    }
}

function GetProductName() {
    var GetProductNameData = {
        vWorkSpaceId: setWorkspaceId,
        nProductTypeID: $("#ddlProductType").val(),
        cTransferIndi: Transferindi
    }

    var GetPmsProductInterStorageTransferProductName = {
        Url: BaseUrl + "PMSGeneral/ProductName",
        SuccessMethod: "SuccessMethod",
        Data: GetProductNameData,
    }

    $.ajax({
        url: GetPmsProductInterStorageTransferProductName.Url,
        type: 'POST',
        data: GetPmsProductInterStorageTransferProductName.Data,
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("Product not found.", "Product", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        var strdata = "";
        if (jsonData.length > 0) {
            $("#Product").empty().append('<option selected="selected" value="0">Please Select Product</option>');
            for (var i = 0; i < jsonData.length; i++)
                $("#Product").append($("<option></option>").val(jsonData[i].nProductNo).html(jsonData[i].vProductName));
        }
        else {
            $("#Product").empty().append('<option selected="selected" value="0">Please Select Product</option>');
        }
    }
}

function GetbatchLotNo() {
    var projectid = setWorkspaceId;
    var productid = $("#Product").val();

    var GetPmsProductInterStorageTransferBatchLotNo =
    {
        Url: BaseUrl + "PmsStudyProductReceipt/GetBatchLotNo",
        SuccessMethod: "SuccessMethod"
    }

    $.ajax({
        url: GetPmsProductInterStorageTransferBatchLotNo.Url,
        type: 'GET',
        data: { id: projectid, projectno: productid },
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("Batch/Lot/Lot No not found.", "BatchLotNo", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        var strdata = "";
        if (jsonData.length > 0) {
            $("#BatchLotNo").empty().append('<option selected="selected" value="0">Please Select Batch/Lot/Lot No</option>');
            for (var i = 0; i < jsonData.length; i++)
                $("#BatchLotNo").append($("<option></option>").val(jsonData[i].nStudyProductBatchNo).html(jsonData[i].vBatchLotNo));
        }
        else {
            $("#BatchLotNo").empty().append('<option selected="selected" value="0">Please Select Batch/Lot/Lot No</option>');
        }
    }
}

function AddTempData() {
    var strdata = "";
    var totallength;
    var KitNo = [];

    if (validateform() == false)
    { }
    else
    {
        var setKitNo = $.map($("#ddlKit option:selected"), function (ekit, i) {
            KitNo.push($(ekit).text());
        });


        if (Transferindi == "K") {
            totallength = KitNo.length;
            var data = $('table#tblProductInterStorageTransferAdd').find('tbody').find('tr');
            for (j = 0; j < totallength; j++) {
                for (i = 0; i < data.length; i++) {
                    if (KitNo[j] == $(data[i]).find('td:eq(2)').html()) {
                        ValidationAlertBox(KitNo[j] + " already exist in below table.", "ddlKit", ModuleName);
                        return false;
                        break;
                    }
                }
            }
        }
        else if (Transferindi == "P") {
            totallength = 1;
            var data = $('table#tblProductInterStorageTransferAdd').find('tbody').find('tr');
            for (j = 0; j < totallength; j++) {
                for (i = 0; i < data.length; i++) {
                    if ($("#ToStorage :selected").val() == $(data[i]).find('td:eq(14)').html()
                        && $("#Product :selected").text() == $(data[i]).find('td:eq(0)').html()
                        && $("#BatchLotNo :selected").text() == $(data[i]).find('td:eq(1)').html()) {
                        ValidationAlertBox("Selected data already exist in below table.", "ToStorage", ModuleName);
                        return false;
                        break;
                    }
                }
            }
        }

        for (i = 0; i < totallength; i++) {
            strdata += "<tr>";
            strdata += "<td class='hideproduct'>" + $("#Product :selected").text() + "</td>";
            strdata += "<td class='hideproduct'>" + $("#BatchLotNo :selected").text() + "</td>";
            strdata += "<td class='hideproduct'>" + $("#Quantity").val() + "</td>";
            //strdata += "<td class='hidekit'>" + KitNo[i] + "</td>";
            strdata += "<td>" + $("#Reason :selected").text() + "</td>";
            strdata += "<td class='hidetd'>" + $("#Reason :selected").val() + "</td>";
            strdata += "<td class='hidetd'>" + $("#Product :selected").val() + "</td>";
            strdata += "<td class='hidetd'>" + $("#StorageArea").val() + "</td>";
            strdata += "<td class='hidetd'>" + $("#BatchLotNo :selected").val() + "</td>";
            strdata += "<td class='hideproduct'>" + $("#FromStorage :selected").text() + "</td>";
            strdata += "<td class='hideproduct'>" + $("#ToStorage :selected").text() + "</td>";
            strdata += "<td id='trRemove'><span class='glyphicon glyphicon-remove' ></span></td>";
            strdata += "<td class='hidetd'>" + $("#txtNoOfContainers").val() + "</td>";
            strdata += "<td class='hidetd'>" + $("#ddlUnit").val() + "</td>";
            strdata += "<td class='hidetd'>" + $("#FromStorage :selected").val() + "</td>";
            strdata += "<td class='hidetd'>" + $("#ToStorage :selected").val() + "</td>";
            strdata += "<td class='hidetd'>" + $("#txtOther").val() + "</td>";
            strdata += "<td class='hidetd'>" + $("#ddlSelectStorage").val() + "</td>";
            strdata += "</tr>";
        }

        $("#tbodyProductInterStorageTransferAdd").append(strdata);
        $("#tblProductInterStorageTransferAdd thead").show();
        $("#tblProductInterStorageTransferAdd").show();
        $("#btnSavePmsProductInterStorageTransfer").show();
        $(".hidetd").hide();

        if (Transferindi == "P") {
            $(".hideproduct").show();
            $(".hidekit").hide();
        }
        else if (Transferindi == "K") {
            $(".hideproduct").hide();
            $(".hidekit").show();
        }

        clearDetailsPartData();
        $("select#ToStorage")[0].selectedIndex = 0;
        $("#StorageArea  option:selected").prop("selected", false);
        $("#StorageArea  option").remove();
        $('#StorageArea').multiselect('rebuild');

    }
}

function clearDetailsPartData() {
    $('#Product').val(0).attr("selected", "selected");
    $('#BatchLotNo').val(0).attr("selected", "selected");
    $('#Reason').val(0).attr("selected", "selected");
    $("#StorageArea").multiselect("clearSelection");
    $("#Quantity").val("");
    $("#ddlKit").multiselect("clearSelection");
    $("#txtNoOfContainers").val("");
    $("#ddlUnit").val(0).attr('disabled', false);
    $("#divUnit").hide();
    $("#txtOther").val("");
    $("#divStorage").attr('style', 'display:none');
}

function clearHeaderPartData() {
    //$("#ProjectNo").val("");
    $("#tblProductInterStorageTransferAdd tbody tr").remove();
    $("#tblProductInterStorageTransferAdd thead").hide();
    $('#ddlProductType').val(0).attr("selected", "selected").attr('disabled', false);
    $('#ddlTransferIndi').val(0).attr("selected", "selected").attr('disabled', false);
    $('#FromStorage').val(0).attr("selected", "selected").attr('disabled', false);

}

function validateform() {

    if (isBlank(document.getElementById('ProjectNo').value)) {
        ValidationAlertBox("Please enter Project No.", "ProjectNo", ModuleName);
        return false;
    }
    if (Dropdown_Validation(document.getElementById("FromStorage"))) {
        ValidationAlertBox("Please select From Storage.", "FromStorage", ModuleName);
        return false;
    }
    if (Dropdown_Validation(document.getElementById("ToStorage"))) {
        ValidationAlertBox("Please select To Storage.", "ToStorage", ModuleName);
        return false;
    }

    if (Dropdown_Validation(document.getElementById("ddlProductType"))) {
        ValidationAlertBox("Please select Product Type.", "ddlProductType", ModuleName);
        return false;
    }

    if (Transferindi == "P") {
        if (Dropdown_Validation(document.getElementById("Product"))) {
            ValidationAlertBox("Please select Product Name.", "Product", ModuleName);
            return false;
        }

        if (Dropdown_Validation(document.getElementById("BatchLotNo"))) {
            ValidationAlertBox("Please select Batch/Lot/Lot No.", "BatchLotNo", ModuleName);
            return false;
        }

        if (isBlank(document.getElementById('Quantity').value)) {
            ValidationAlertBox("Please enter Quantity.", "Quantity", ModuleName);
            return false;
        }
    }
    else if (Transferindi == "K") {
        if (isBlank(document.getElementById('ddlKit').value)) {
            ValidationAlertBox("Please select Kit.", "ddlKit", ModuleName);
            return false;
        }
    }

    if (Dropdown_Validation(document.getElementById("ddlTransferIndi"))) {
        ValidationAlertBox("Please select Product Indication.", "ddlTransferIndi", ModuleName);
        return false;
    }

    if (Dropdown_Validation(document.getElementById("Reason"))) {
        ValidationAlertBox("Please select Reason.", "Reason", ModuleName);
        return false;
    }

    if ($("#Reason :selected").text() == "Other") {
        if (isBlank(document.getElementById('txtOther').value)) {
            ValidationAlertBox("Please Enter Other Reason.", "txtOther", ModuleName);
            return false;
        }
    }

    if (isBlank(document.getElementById('StorageArea').value)) {
        ValidationAlertBox("Please select Storage Area.", "StorageArea", ModuleName);
        return false;
    }

    if (isBlank(document.getElementById('txtNoOfContainers').value)) {
        ValidationAlertBox("Please enter No Bin/Pallet/Crate/Locker/Container/Shelf/Box/Boxes/Rack.", "txtNoOfContainers", ModuleName);
        return false;
    }

    else if (!CheckNumericLength(document.getElementById('Quantity').value, 1, 50000000)) {
        ValidationAlertBox("Please enter proper Quantity.", "Quantity", ModuleName);
        return false;
    }
}

function clearData() {
    clearDetailsPartData();
    clearHeaderPartData();
}

$("#tblProductInterStorageTransferAdd").on('click', '#trRemove', function () {
    $(this).closest('tr').remove();
    if ($("#tblProductInterStorageTransferAdd tr").length == 1) {
        $("#tblProductInterStorageTransferAdd").hide();
        $("#btnSavePmsProductInterStorageTransfer").hide();
        $(".headercontrol").prop('disabled', '');
    }
    else {
        $("#tblProductInterStorageTransferAdd").show();
        $("#btnSavePmsProductInterStorageTransfer").show();
        $(".headercontrol").attr('disabled', 'disabled');
    }
});


function getUnit() {

    var ProductInterStorageTransferData = {
        vWorkSpaceId: setWorkspaceId,
        nProductNo: $("#Product :selected").val(),
        nStudyProductBatchNo: $("#BatchLotNo :selected").val(),
        vDocTypeCode: "ZSTK"
    }

    $.ajax({
        url: BaseUrl + "PmsProductInterStorageTransfer/UnitDetail",
        type: 'POST',
        async: false,
        data: ProductInterStorageTransferData,
        success: Success,
        error: function () {
            ValidationAlertBox("Quantity not found.", "Product", ModuleName);
        }
    });
    function Success(response) {

        $("#divUnit").show();
        $("#ddlUnit").val(response).attr('disabled', 'disabled');
    }
}

function ProductInterStorageTransfer() {

    if (Dropdown_Validation(document.getElementById("BatchLotNo"))) {
        ValidationAlertBox("Please select Batch/Lot/Lot No.", "BatchLotNo", ModuleName);
        return false;
    }

    var ProductInterStorageTransferData = {
        vWorkSpaceId: setWorkspaceId,
        nProductNo: $("#Product :selected").val(),
        nStudyProductBatchNo: $("#BatchLotNo :selected").val(),
        nStorageLocationNo: $("#FromStorage :selected").val()
    }

    $.ajax({
        url: BaseUrl + "PmsProductInterStorageTransfer/CheckAvailableStock",
        type: 'POST',
        data: ProductInterStorageTransferData,
        success: Success,
        error: function () {
            ValidationAlertBox("Quantity not found.", "Product", ModuleName);
        }
    });
    function Success(response) {
        var totalqty = $("#Quantity").val();
        totalavailableqty = response;
        if (parseInt(response) < parseInt(totalqty)) {
            ValidationAlertBox("Current Stock is " + parseInt(totalavailableqty), "Product", ModuleName);
            $("#Quantity").val("");
            return false;
        }
    }
}

function GetDashboardData() {

    var GetDashboardData = {
        vWorkSpaceId: setWorkspaceId,
        vDocTypeCode: "ZIST",
        iUserID: $("#hdnuserid").val()
    }

    var GetPMSQualityMovementData = {
        Url: BaseUrl + "PmsProductInterStorageTransfer/ProductInterStorageTransferData",
        SuccessMethod: "SuccessMethod",
        Data: GetDashboardData
    }
    $.ajax({
        url: GetPMSQualityMovementData.Url,
        type: 'POST',
        data: GetPMSQualityMovementData.Data,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Data not found.", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        if (jsonData.length == 0) {
            $("#divexport").hide();
        }
        else {
            $("#divexport").show();
        }
        var ActivityDataset = [];
        var NoOfContainers = "";
        $("#divexport").css("visibility", "visible");
        for (var i = 0; i < jsonData.length; i++) {

            var InDataset = [];
            srno = i + 1;
            if (jsonData[i].iNoOfContainers == 0) {
                NoOfContainers = '';
            }
            else {
                NoOfContainers = jsonData[i].iNoOfContainers;
            }

            Print = '<a data-tooltip="tooltip" id="btnPrint' + jsonData[i].nTransactionNo + '" data="' + jsonData[i].nTransactionNo + "#" + jsonData[i].vProjectNo + "#" + jsonData[i].vSponserName + "#" + jsonData[i].vSiteName + "#" + jsonData[i].nSiteNo + "#" + jsonData[i].vPIName + "#" + jsonData[i].vBatchLotNo + "#" + jsonData[i].vStorageLocationName + "#" + jsonData[i].nSrNo + "#" + jsonData[i].dCreatedOn + "#" + jsonData[i].vKitNo + "#" + jsonData[i].vReasonDesc + '", title="Print" onclick="ExportToPrint(this)"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-print"></i><span>Print</span></a>'
            //Audit = '<a data-tooltip="tooltip" id="btnPrint" title="Print" onclick="ExportToPrint(' + "'" + jsonData[i].nTransactionNo + "'" + ',' + "'" + jsonData[i].dExpiryDate + "'" + ',' + "'" + jsonData[i].vKitNo + "'" + ',' + "'" + jsonData[i].vReasonDesc + "'" + ',' + "'" + jsonData[i].iReceivedQty + "'" + ',' + "'" + jsonData[i].totalqty + "'" + ',' + "'" + jsonData[i].totalavailableqty + "'" + ',' + "'" + jsonData[i].vStorageLocationName + "'" + ')"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-print"></i><span>Audit</span></a>'

            QAreview = ""

            if (StageName == "QA") {
                QAreview = "<a data-tooltip='tooltip' title='edit' data-target='#ViewAuthenticate' class='btnedit' vStageName="
                                   + "'" + StageName + "'" + "Onclick=pmsStudyViewAuthenticate(this) nTransactionNo='" + jsonData[i].nTransactionNo
                                   + "' nSPTransactionDtlNo='" + jsonData[i].nTransactionDtlNo
                                   + "'  cIsQAReview='" + (jsonData[i].iStageCode == "401" ? 'Y' : 'N')
                                   + "'  iModifyBy ='" + jsonData[i].iModifyBy + "'"
                                   + "' StageName='" + StageName + "'"
                                   + "style='cursor:pointer;'><i class='btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a'><i class='fa fa-fw fa-edit'></i><span>"
                                   + "QA Review" + "</span></a>"

                if (jsonData[i].iStageCode == "301" && jsonData[i].cIsQAReview == 'Y') {
                    //ReviewRemarks = "";
                    review = 'Pending'
                } else {
                    //ReviewRemarks = jsonData[i].vRemarks
                    review = 'Approved'
                }
            }


            InDataset.push(QAreview, jsonData[i].cIsQAReviewText, jsonData[i].vQARemarks, jsonData[i].iQAReviewBy, jsonData[i].dQAReviewOn, jsonData[i].vProjectNo, jsonData[i].ProductKitIndication, jsonData[i].vStorageLocationName, jsonData[i].vToStorageLocationName, jsonData[i].vProductType,
                           jsonData[i].vProductName, jsonData[i].vBatchLotNo, jsonData[i].vReasonDesc, jsonData[i].iReceivedQty, jsonData[i].vUnit,
                           jsonData[i].vStorageAreaName, NoOfContainers, jsonData[i].vStorageType, jsonData[i].vModifyBy + " /</br> " + jsonData[i].dModifyOn, "", "", "", "", Print);
            ActivityDataset.push(InDataset);
        }
        otable = $('#tblPmsProductInterStorageTransferData').dataTable({
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
            "sScrollXInner": "1800" /* It varies dynamically if number of columns increases */,
            "aoColumns": [
                { "sTitle": "QA Approve" },
                { "sTitle": "Verified Review" },
                { "sTitle": "Verified Remarks" },
                { "sTitle": "Verified By" },
                { "sTitle": "Verified On" },
                { "sTitle": "Project No" },
                { "sTitle": "Product Indication" },
                { "sTitle": "From Location" },
                { "sTitle": "To Location" },
                { "sTitle": "Product Type" },
                { "sTitle": "Product Name" },
                { "sTitle": "Batch Lot No" },
                { "sTitle": "Reason" },
                { "sTitle": "Quantity" },
                { "sTitle": "Unit" },
                { "sTitle": "Storage Area" },
                { "sTitle": "No Bin/Pallet/Crate/Locker/Container/Shelf/Box/Boxes/Rack" },
                { "sTitle": "Type Of Storage" },
                { "sTitle": "Quality Checked By" },
                 { "sTitle": "QA Review Status" },
                { "sTitle": "QA Review Remarks" },
                { "sTitle": "QA Review By" },
                { "sTitle": "QA Review On" },
                { "sTitle": "Print" },
                //{ "sTitle": "Audit" }

            ],
            "columnDefs": [
                { "width": "2%", "targets": 0 },
                { "width": "2%", "targets": 1 },
                { "width": "2%", "targets": 2 },
                { "width": "2%", "targets": 3 },
                { "width": "2%", "targets": 4 },
                { "width": "2%", "targets": 5 },
                { "width": "6%", "targets": 6 },
                { "width": "5%", "targets": 7 },
                { "width": "5%", "targets": 8 },
                { "width": "4%", "targets": 9 },
                { "width": "6%", "targets": 10 },
                { "width": "4%", "targets": 11 },
                { "width": "2%", "targets": 12 },
                { "width": "2%", "targets": 13 },
                { "width": "5%", "targets": 14 },
                { "width": "5%", "targets": 15 },
                { "width": "5%", "targets": 16 },
                { "width": "7%", "targets": 17 },
                { "width": "7%", "targets": 18 },
                //{ "width": "7%", "targets": 19 },
            ],
        });
        if ($("#hdnUserTypeCode").val() == ValidUserTypeCode) {
            var table = $('#tblPmsProductInterStorageTransferData').DataTable();
            table.column(0).visible(true);
        }
        else {
            var table = $('#tblPmsProductInterStorageTransferData').DataTable();
            //Changed by rinkal
            table.column(0).visible(false);
        }
    }
}


function ExportToPrint() {
    var url = WebUrl + "PmsProductInterStorageTransfer/ExportToPrint";

    $.ajax({
        url: url,
        type: 'POST',
        data: {
            vWorkSpaceId: setWorkspaceId,
            nTransactionNo: $("#nTransactionNo").val(),
            vStudyCode: $("#vStudyCode").val(),
            vSponserName: $("#nTransactionNo").val(),
            vSiteName: $("#nTransactionNo").val(),
            vSiteNo: $("#nTransactionNo").val(),
            vPIName: $("#nTransactionNo").val(),
            nSrNo: $("#nSrNo").val(),
            vProductName: $("#vProductName").val(),
            vProductType: $("#vProductType").val(),
            vBatchLotNo: $("#vBatchLotNo").val(),
            dExpiryDate: $("#dExpiryDate").val(),
            vKitNo: $("#vKitNo").val(),
            vReasonDesc: $("#vReasonDesc").val(),
            iReceivedQty: $("iReceivedQty").val(),
            totalqty: $("#totalqty").val(),
            totalavailableqty: $("#totalavailableqty").val(),
            vStorageLocationName: $("#vStorageLocationName").val(),
            vRemarks: $("#vRemarks").val(),
        },
        async: false,
        success: function (response) {
            var a = window.open('', '', 'height=500, width=500');
            a.document.write(response);
            a.document.close();
            a.print();
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Data not found in export to print.", ModuleName);
        }
    });
}



//$("#btn_").on("click", function () {
//    printProductData();
//});





function GetExportToExcelDetails() {
    debugger;
    var Data_Export = {
        vWorkSpaceId: setWorkspaceId,
        vDocTypeCode: "ZIST",
    }

    var url = WebUrl + "PmsProductInterStorageTransfer/GetExportToExcelDetails";
    $.ajax({
        url: url,
        type: 'get',
        async: false, // double click solution
        data: Data_Export,
        success: function (data) {

        },
        error: function () {
            SuccessorErrorMessageAlertBox("Data not found in export to excel.", ModuleName);
        }
    });
}

function GetProductType() {
    var GetProductType = {
        Url: BaseUrl + "PmsGeneral/GetProductType/" + setWorkspaceId,
        SuccessMethod: "SuccessMethod"
    }

    $.ajax({
        url: GetProductType.Url,
        type: 'GET',
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
        url: Url,
        type: 'GET',
        async: false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Project not found.", ModuleName);
        }
    });
    function SuccessMethod(jsonData) {
        if (jsonData.length > 0) {
            $('#ddlProjectNodashboard').val(jsonData[0].vProjectNo);
            setWorkspaceId = jsonData[0].vWorkSpaceId;
        }
        else {
            $('#ddlProjectNodashboard').val('');
        }
    }
}

function BindData() {
    if (productIds[$('#ddlProjectNodashboard').val()] != undefined) {
        setWorkspaceId = productIds[$('#ddlProjectNodashboard').val()];
    }
    var projectid = setWorkspaceId;
    var url = WebUrl + "PmsStudyProduct/GetWorkspaceId";
    $.ajax({
        url: url,
        type: 'get',
        data: { id: projectid, UserName: $("#hdnusername").val() },
        async: false,
        success: function (data) {

        },
        error: function () {
            SuccessorErrorMessageAlertBox("Project not found.", ModuleName);
        }
    });

    if (projectid > 0) {
        GetDashboardData();
        GetExportToExcelDetails();
        //ExportToPrint();
    }
    else {
        $("#divexport").css("visibility", "hidden");
    }
}

function QuantityValidation() {
    var batchno = $("#BatchLotNo").val();
    var productno = $("#Product").val();

    var table = document.getElementById('tblProductInterStorageTransferAdd'),
    rows = table.getElementsByTagName('tr'),
    i, j, cells, customerId;
    var totalqty = 0;
    for (i = 0, j = rows.length; i < j; ++i) {
        cells = rows[i].getElementsByTagName('td');
        if (!cells.length) {
            continue;
        }
        if (productno == cells[5].innerHTML) {
            if (batchno == cells[7].innerHTML) {
                totalqty = parseInt(totalqty) + parseInt(cells[2].innerHTML);
            }
        }
    }
    totalqtyStock = totalavailableqty;
    var totalnetqty = 0;
    totalnetqty = parseInt(totalqty) + parseInt($("#Quantity").val());
    if (rows.length >= 2)
        totalavailableqty = totalavailableqty - parseInt(totalqty)


    if (parseInt(totalqtyStock) < parseInt(totalnetqty)) {
        ValidationAlertBox("Current Stock is " + parseInt(totalavailableqty), "Product", ModuleName);
        $("#Quantity").val("");
        return false;
    }
}

$("#ddlTransferIndi").on("change", function () {
    Transferindi = $("#ddlTransferIndi").val();

    if (Transferindi == "P") {
        $("#divProduct").attr("style", "display:inline");
        $("#divKit").attr("style", "display:none");
        GetProductName();
    }
    else if (Transferindi == "K") {
        $("#divProduct").attr("style", "display:none");
        $("#divKit").attr("style", "display:inline");
        GetKit();
    }
    else {
        $("#divProduct").attr("style", "display:none");
        $("#divKit").attr("style", "display:none");
    }
});

function GetKit() {
    $('#divKit .multiselect-container li').remove();

    var PostData = {
        vWorkSpaceID: setWorkspaceId,
        nProductTypeID: $("#ddlProductType").val(),
        vDocTypeCode: 'ZSTK'
    }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/Proc_GetAvailableKitNo",
        type: 'POST',
        data: PostData,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Kit Data is not found.", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        for (var i = 0; i < jsonData.length; i++) {
            $("#ddlKit").append($("<option></option>").val(jsonData[i].vKitNo).html(jsonData[i].vKitNo));
            $('#ddlKit').multiselect('rebuild');
        }
    }
}

$("#txtNoOfContainers").on('keypress', function (e) {

    var regExp = /[a-z]/i;
    var value = String.fromCharCode(e.which) || e.key;
    if (regExp.test(value)) {
        e.preventDefault();
        return false;
    }
});


$("#Quantity").on('keypress', function (e) {

    var regExp = /[a-z]/i;
    var value = String.fromCharCode(e.which) || e.key;
    if (regExp.test(value)) {
        e.preventDefault();
        return false;
    }
});

//---------Added By Anjali Prajapati-------------
function viewProjectDocument(e) {

    //var vdoc_id = $("#" + e.id).attr("id");
    var id = setWorkspaceId;
    var projectno = $("#hdnuserid").val();

    if (productIds[$('#DDLProjectNo').val()] != undefined) {
        setWorkspaceId = productIds[$('#DDLProjectNo').val()];
    }
    if (setWorkspaceId == undefined) {
        return false;
    }
    var Data = {
        id: setWorkspaceId,
        projectno: $("#hdnuserid").val(),
    }

    var GetFile = {
        //Url: BaseUrl + "PmsDocumentMaster/GetFilePathDataProjectWise/" + productIds[$('#DDLProjectNo').val()] + "",
        Url: BaseUrl + "PmsDocumentMaster/GetFilePathDataProjectWise/",
        SuccessMethod: "SuccessMethod",
        Data: Data
    }
    GetAllFile(GetFile.Url, GetFile.SuccessMethod, GetFile.Data);
}

var GetAllFile = function (Url, SuccessMethod, Data) {

    $.ajax({
        url: Url,
        type: 'GET',
        data: Data,
        async: false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Data Not Found", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        $("#myTable tr td").remove();
        for (var i = 0; i < jsonData.length; i++) {

            var OperationName = jsonData[i].vOperationName;
            if (OperationName == ModuleName) {

                var FilePath = jsonData[i].vFilePath;
                var FileName = FilePath.split("/")[FilePath.split("/").length - 1];
                $("#ViewDocument").modal.show;
                $("#mbody").append($('#myTable').append('<tr><td>' + '<u><a href = ' + FilePath + ' style="display:table;" target="_blank">' + FileName + '</a></u>' + '</td></tr>'));
            }
        }

    }

    function SuccessMethod1(jsonData) {

        var flag = 'Y';
        if (jsonData.length <= 0) {
            SuccessorErrorMessageAlertBox("Document Not Attached", ModuleName);
            flag = 'N';
            return false;
        }
        else {

            for (var i = 0; i < jsonData.length; i++) {

                var OperationName = jsonData[i].vOperationName;
                if (OperationName == ModuleName) {
                    //for (var i = 0; i < jsonData.length; i++) {
                    var Filename = jsonData[i].vFilePath;
                    var ext = Filename.split(".")[Filename.split(".").length - 1];//For get PDF Ext.
                    flag = 'Y';
                    if (ext == "pdf") {
                        $("#ViewDocument").modal.show;
                        $("#mbody").append($('<iframe name="frame1" id="ifviewDocument" style="height: 391px; width: 100%;" runat="server"></iframe>').attr("src", Filename));
                        flag = 'Y';
                        return false;
                    }
                    else if (ext != "pdf") {
                        var Filename = jsonData[i].vFilePath;
                        var iframe;
                        iframe = document.getElementById("hiddenDownloader");
                        if (iframe == null) {
                            iframe = document.createElement('iframe');
                            iframe.id = "hiddenDownloader";
                            iframe.style.visibility = 'none';
                            document.body.appendChild(iframe);
                        }
                        iframe.src = Filename;
                        flag = 'Y';
                        return false;
                    }
                    else {
                        //SuccessorErrorMessageAlertBox("This Module has no Document", ModuleName);
                        flag = 'N';
                        //return false;
                    }
                    //}
                }
                else {
                    //SuccessorErrorMessageAlertBox("Document Not Attached", ModuleName);
                    flag = 'N';
                    //return false;
                }

                //return flag;
            }

            if (flag == 'N') {
                SuccessorErrorMessageAlertBox("Document Not Attached", ModuleName);
            }

        }
    }
}


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
//---------End-----------------

//--------------------- Added By Yash ------------------------------

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
        if (StageName == "QA") {
            CheckSameUserTransaction(iModifyByTransaction);
        }

        if (reviewerFlag == true)
            $('#ViewAuthenticate').modal('show');
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
        vDocTypeCode: 'ZIST',
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
        vDocTypeCode: 'ZIST',
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
                GetDashboardData();
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
                GetDashboardData();
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

//------------------------------------------------------------------