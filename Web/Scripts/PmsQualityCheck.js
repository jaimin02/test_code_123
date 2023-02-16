var productIds = new Object();
var setWorkspaceId="";
var totalavailableqty;
var viewmode;
var ModuleName = 'Product Movement'
var Transferindi;
var vProjectNo = "";
var StageCode = "";
var StageName = "";
var reviewerFlag = false;
var ValidUserTypeCode;

$(document).ready(function () {

    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('.modal').modal('hide');

    var GetWorkflowUserRightsData = {
        vUserTypeCode: $("#hdnUserTypeCode").val(),
        vDocTypeCode: 'ZMIA',
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
                    StageCode = ""
                    $("#btnAddQualityMoement").hide();
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

    $("#tblQualityCheckAdd").hide();

    

    //Get Project No
    var GetPmsQualityCheckProjectNo = {
        //Url: BaseUrl + "PmsProductBatch/GetProjectNo_New",
        Url: BaseUrl + "PmsGeneral/GetScopeWiseProject",
        SuccessMethod: "SuccessMethod",
    }

    $('#ddlProjectNodashboard').on('change keyup paste mouseup', function () {
        if ($('#ddlProjectNodashboard').val().length == 2) {
            var ProjectNoDataTemp = {
                
                //vProjectNo: $('#ddlProjectNodashboard').val(),
                iUserId: $("#hdnuserid").val(),
                vStudyCode: $('#ddlProjectNodashboard').val(),
                //vProjectTypeCode: $("#hdnscopevalues").val(),
            }
            GetAllPmsQualityCheckProjectNo(GetPmsQualityCheckProjectNo.Url, GetPmsQualityCheckProjectNo.SuccessMethod, ProjectNoDataTemp);

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
    GetPmsQualityCheckFromStrage = {
        Url: BaseUrl + "PmsQualityCheckMovement/GetFromStorageLocationName",
        SuccessMethod: "SuccessMethod",
    }
    GetAllPmsQualityCheckFromStorage(GetPmsQualityCheckFromStrage.Url, GetPmsQualityCheckFromStrage.SuccessMethod);

    // Get To Storage Name
    GetPmsQualityCheckToStrage = {
        Url: BaseUrl + "PmsQualityCheckMovement/GetToStorageLocationName",
        SuccessMethod: "SuccessMethod",
    }
    GetAllPmsQualityCheckToStorage(GetPmsQualityCheckToStrage.Url, GetPmsQualityCheckToStrage.SuccessMethod);

    //Get Reason Master
    var id = MenuId;
    var GetPmsQualityCheckReasonDesc = {
        Url: BaseUrl + "PMSGeneral/ReasonLocationWise",
        SuccessMethod: "SuccessMethod",
    }
    GetAllPmsQualityCheckReason(GetPmsQualityCheckReasonDesc.Url, GetPmsQualityCheckReasonDesc.SuccessMethod);

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

$("#btnAddQualityMoement").on("click", function () {
    $(".headercontrol").prop('disabled', '');
    $('#ProjectNo').val($('#ddlProjectNodashboard').val());
    clearDetailsPartData();
    clearHeaderPartData();
    jQuery("#titleMode").text('Mode:-Add');
    jQuery("#spnSaveQualityCheck").text('Save');
    $("#btnAddTempProduct").show();
    $("#tblQualityCheckAdd tbody tr").remove();
    $("#tblQualityCheckAdd thead").hide();
    QualityCheck();

    var GETStorageArea = {
        Url: BaseUrl + "PmsGeneral/ALLStorageAreaData",
        SuccessMethod: "SuccessMethod"
    }
    var FilterData = {
        nStorageTypeId: $("#ToStorage :selected").val(),
        vLocationCode: $("#hdnUserLocationCode").val(),
    }

    GetAllPmsQualityCheckStorageArea(GETStorageArea.Url, FilterData);


    if (isBlank(document.getElementById('ddlProjectNodashboard').value)) {
        ValidationAlertBox("Please enter Project No.", "ddlProjectNodashboard", ModuleName);
        return false;
    }

    GetProductType();
    document.getElementById("divProduct").style.display = "none";
    document.getElementById("divKit").style.display = "none";
});

$("#btnAddTempProduct").on("click", function () {

    AddTempData();
    if ($("#tblQualityCheckAdd tr").length == 1) {
        $("#tblQualityCheckAdd").hide();
        $("#btnSavePmsQualityCheck").hide();
        $(".headercontrol").prop('disabled', '');
    }
    else {
        $("#tblQualityCheckAdd").show();
        $("#btnSavePmsQualityCheck").show();
        $(".headercontrol").attr('disabled', 'disabled');
    }


    //var CheckQaReview = {
    //    vWorkSpaceId: setWorkspaceId,
    //    vDocTypeCode: "ZSTK",
    //    nProductNo: $("#Product :selected").val(),
    //    nStudyProductBatchNo: $("#BatchLotNo :selected").val()
    //}
    //var CheckQaReviewData = {
    //    Url: BaseUrl + "PmsQualityCheckMovement/CheckIsQAReviewDone",
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
            if ($("#tblQualityCheckAdd tr").length == 1) {
                $("#tblQualityCheckAdd").hide();
                $("#btnSavePmsQualityCheck").hide();
                $(".headercontrol").prop('disabled', '');
            }
            else {
                $("#tblQualityCheckAdd").show();
                $("#btnSavePmsQualityCheck").show();
                $(".headercontrol").attr('disabled', 'disabled');
            }
        }
        else {
            SuccessorErrorMessageAlertBox("QA Review is Pending.", ModuleName);
        }
    }
}


$("#btnExitPmsQualityCheck").on("click", function () {
    ConfirmAlertBox(ModuleName);
});

$("#btnClearPmsQualityCheck").on("click", function () {
    clearHeaderPartData();
    clearDetailsPartData();
    $("#btnAddTempProduct").show();
    $("#tblQualityCheckAdd tbody tr").remove();
    $("#tblQualityCheckAdd thead").hide();
});

$("#ddlProjectNodashboard").on("blur", function () {
    BindData();
});

$("#Product").on("change", function () {
    GetbatchLotNo();
});

$("#btnSavePmsQualityCheck").on("click", function () {
    $("#btnSavePmsQualityCheck").hide();
    var InsertPmsProductReceipt1 = {
        vWorkSpaceId: setWorkspaceId,
        nStorageLocationNo: $("#ToStorage :selected").val(),
        vDocTypeCode: "ZMIA",
        nTransactionNo: "1",
        iModifyBy: $("#hdnuserid").val(),
        nProductTypeID: $("#ddlProductType").val(),
        iNoOfContainers: $("#txtNoOfContainers").val(),
        cTransferIndi: Transferindi,
    }
    var InsertQualityCheckData = {
        Url: BaseUrl + "PmsStudyProductReceipt/InsertPmsProductReceiptHeader",
        SuccessMethod: "SuccessMethod",
        Data: InsertPmsProductReceipt1,
    }

    InsertPmsQualityCheckMaster(InsertQualityCheckData.Url, InsertQualityCheckData.SuccessMethod, InsertQualityCheckData.Data);
    GetDashboardData();
    //$("#loader").attr("style", "display:none");
    $("#btnSavePmsQualityCheck").show();
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

$("#BatchLotNo").on("change", function () {
    if ($("#BatchLotNo").val() != "0") {
        getUnit();
    }
    else {
        $("#ddlUnit").val(0).attr('disabled', false);
        $("#divUnit").hide();
    }
    
    QualityCheck();
});

$("#Quantity").on("blur", function () {
    QuantityValidation();
    QualityCheck();
});

var InsertPmsQualityCheckMaster = function (Url, SuccessMethod, Data) {
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
        var result = false;
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

        var data = $('table#tblQualityCheckAdd').find('tbody').find('tr');

        //var data = HTMLtbl.getData($('#tblQualityCheckAdd'));
        var StoreData = [];
        var TempKitNo = "";
        for (i = 0; i < data.length; i++) {
            if ($(data[i]).find('td:eq(3)').html() == "undefined") {
                TempKitNo = "";
            }
            else {
                TempKitNo = $(data[i]).find('td:eq(3)').html();
            }
            var InsertPmsProductReceipt2 = {
                nTransactionNo: response,
                nProductNo: $(data[i]).find('td:eq(5)').html(),
                nStudyProductBatchNo: $(data[i]).find('td:eq(7)').html(),
                iReceivedQty: $(data[i]).find('td:eq(2)').html(),
                iModifyBy: $("#hdnuserid").val(),
                vStorageArea: $(data[i]).find('td:eq(6)').html(),
                vWorkSpaceId: setWorkspaceId,
                vDocTypeCode: "ZMIA",
                nReasonNo: $(data[i]).find('td:eq(4)').html(),
                dExpiryDate: "1900-01-01 00:00:00.000",
                nStorageLocationNo: $("#ToStorage").val(),
                cProductFlag: "P",
                cLocationIndicator: "P",
                vRefModule: "QM",
                cAddSub: "A",
                cTransferIndi: Transferindi,
                vKitNo: TempKitNo,
                iNoOfContainers: $(data[i]).find('td:eq(9)').html(),
                vUnit: $(data[i]).find('td:eq(10)').html(),
                vStorageType: $(data[i]).find('td:eq(11)').html(),
                iStageCode: 301

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
                $("#btnSavePmsQualityCheck").hide();
                GetDashboardData();
                result = true;
            }
        }
        if (result == true) {
            SuccessorErrorMessageAlertBox("Product Movement saved successfully.", ModuleName);
        }
        
    }
}

var GetAllPmsQualityCheckFromStorage = function (Url, SuccessMethod) {
    $.ajax({
        url: Url,
        type: 'GET',
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Previous Storage status not found.", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        if (jsonData.length > 0) {
            for (var i = 0; i < jsonData.length; i++) {
                $("#FromStorage").empty().append($("<option></option>").val(jsonData[i].nStorageTypeId).html(jsonData[i].vStorageType));
            }
            $("#FromStorage").prop('disabled', 'disabled');
        }
    }
}

var GetAllPmsQualityCheckToStorage = function (Url, SuccessMethod) {
    $.ajax({
        url: Url,
        type: 'GET',
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Current Storage Status not found.", ModuleName);
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

var GetAllPmsQualityCheckReason = function (Url, SuccessMethod) {
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

var GetAllPmsQualityCheckProjectNo = function (Url, SuccessMethod, ProjectNoDataTemp) {
    $.ajax({
        url: Url,
        type: 'GET',
        //data: ProjectNoDataTemp,
        //data: { id: ProjectNoDataTemp.iUserId, projectno: ProjectNoDataTemp.vProjectNo, typecode: ProjectNoDataTemp.vProjectTypeCode },
        data: { iUserId: ProjectNoDataTemp.iUserId, vStudyCode: ProjectNoDataTemp.vStudyCode },
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
                sourceArr.push("[ " + jsonObj[i].vStudyCode + " ]" + " " + jsonObj[i].vStudyName);
                productIds["[ " + jsonObj[i].vStudyCode + " ]" + " " + jsonObj[i].vStudyName] = jsonObj[i].nStudyNo;
            }
            $("#ddlProjectNodashboard").autocomplete({
                source: sourceArr,
                change: function (event, ui) { }
            });
        }
    }
}

var GetAllPmsQualityCheckStorageArea = function (Url, FilterData) {
    $('#StorageArea option').each(function () {
        $(this).remove();
    });

    $.ajax({
        url: Url,
        type: 'POST',
        data:FilterData,
        asyc:false,
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("Storage Area not found.", "BatchLotNo", ModuleName);
        }
    });
    function SuccessMethod(jsonData) {
        var strdata = "";
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

    var GetPmsQualityCheckProductName = {
        Url: BaseUrl + "PMSGeneral/ProductName",
        SuccessMethod: "SuccessMethod",
        Data: GetProductNameData,
    }

    $.ajax({
        url: GetPmsQualityCheckProductName.Url,
        type: 'POST',
        data: GetPmsQualityCheckProductName.Data,
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

    var GetPmsQualityCheckBatchLotNo =
    {
        Url: BaseUrl + "PmsStudyProductReceipt/GetBatchLotNo",
        SuccessMethod: "SuccessMethod"
    }

    $.ajax({
        url: GetPmsQualityCheckBatchLotNo.Url,
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
            var data = $('table#tblQualityCheckAdd').find('tbody').find('tr');
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
            strdata += "<td id='trRemove'><span class='glyphicon glyphicon-remove' ></span></td>";
            strdata += "<td class='hidetd'>" + $("#txtNoOfContainers").val() + "</td>";
            strdata += "<td class='hidetd'>" + $("#ddlUnit").val() + "</td>";
            strdata += "<td class='hidetd'>" + $("#ddlSelectStorage :selected").val() + "</td>";
            strdata += "</tr>";
        }

        $("#tbodyQualityCheckAdd").append(strdata);
        $("#tblQualityCheckAdd thead").show();
        $("#tblQualityCheckAdd").show();
        $("#btnSavePmsQualityCheck").show();
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
    $("#ddlUnit").val(0).attr('disabled',false);
    $("#divUnit").hide();
    $("#divStorage").attr('style', 'display:none');
}

function clearHeaderPartData() {
    //$("#ProjectNo").val("");
    $("#tblQualityCheckAdd tbody tr").remove();
    $("#tblQualityCheckAdd thead").hide();
    $('#ddlProductType').val(0).attr("selected", "selected");
    $('#ddlTransferIndi').val(0).attr("selected", "selected");
}

function validateform() {

    if (isBlank(document.getElementById('ProjectNo').value)) {
        ValidationAlertBox("Please enter Project No.", "ProjectNo", ModuleName);
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

$("#tblQualityCheckAdd").on('click', '#trRemove', function () {
    $(this).closest('tr').remove();
    if ($("#tblQualityCheckAdd tr").length == 1) {
        $("#tblQualityCheckAdd").hide();
        $("#btnSavePmsQualityCheck").hide();
        $(".headercontrol").prop('disabled', '');
    }
    else {
        $("#tblQualityCheckAdd").show();
        $("#btnSavePmsQualityCheck").show();
        $(".headercontrol").attr('disabled', 'disabled');
    }
});


function getUnit() {    
    var QualityCheckData = {
        vWorkSpaceId: setWorkspaceId,
        nProductNo: $("#Product :selected").val(),
        nStudyProductBatchNo: $("#BatchLotNo :selected").val(),
        vDocTypeCode: "ZSTK"
    }

    $.ajax({
        url: BaseUrl + "PmsQualityCheckMovement/UnitDetail",
        type: 'POST',
        async:false,
        data: QualityCheckData,
        success: Success,
        error: function () {
            ValidationAlertBox("Quantity not found.", "Product", ModuleName);
        }
    });
    function Success(response) {      
        $("#divUnit").show();
        $("#ddlUnit").val(response).attr('disabled','disabled');
    }
}

function QualityCheck() {
    var QualityCheckData = {
        vWorkSpaceId: setWorkspaceId,
        vProductNo: $("#Product :selected").val(),
        nStudyProductBatchNo: $("#BatchLotNo :selected").val(),
        vRefModule: "QM"
    }

    $.ajax({
        url: BaseUrl + "PmsGeneral/QtyDetail",
        type: 'POST',
        data: QualityCheckData,
        success: Success,
        error: function () {
            ValidationAlertBox("Quantity not found.", "Product", ModuleName);
        }
    });
    function Success(response) {
        var totalqty = $("#Quantity").val();
        totalavailableqty = response;
        //$("#avlstk").val(totalavailableqty);
        $("#avlstk").html(totalavailableqty);
        if (parseInt(response) < parseInt(totalqty)) {
            ValidationAlertBox("Current Stock is " + totalavailableqty + " .", "Product", ModuleName);
            $("#Quantity").val("");
            return false;
        }
    }
}

function GetDashboardData() {
    var GetDashboardData = {
        vWorkSpaceId: setWorkspaceId,
        vDocTypeCode: "ZMIA",
        iUserID: $("#hdnuserid").val(),
        iStageCode: StageCode
    }

    var GetPMSQualityMovementData = {
        Url: BaseUrl + "PmsQualityCheckMovement/QualityMovementData",
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

            QAreview = ""

            if (StageName == "QA") {
                QAreview = "<a data-tooltip='tooltip' title='edit' data-target='#ViewAuthenticate' class='btnedit' vStageName="
                                   + "'" + StageName + "'" + "Onclick=pmsStudyViewAuthenticate(this) nTransactionNo='" + jsonData[i].nTransactionNo
                                   + "' nSPTransactionDtlNo='" + jsonData[i].nTransactionDtlNo
                                   + "'  cIsQAReview='" + jsonData[i].cIsQAReview
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



            InDataset.push(QAreview, jsonData[i].cIsQAReviewText, jsonData[i].vQARemarks, jsonData[i].iQAReviewBy, jsonData[i].dQAReviewOn, jsonData[i].vStudyCode, jsonData[i].ProductKitIndication, jsonData[i].vStorageLocationName, jsonData[i].vProductType,
                           jsonData[i].vProductName, jsonData[i].vBatchLotNo, jsonData[i].vReasonDesc, jsonData[i].iReceivedQty, jsonData[i].vUnit,
                           jsonData[i].vStorageAreaName, NoOfContainers, jsonData[i].vStorageType, jsonData[i].vModifyBy + " /</br> " + jsonData[i].dModifyOn);
            ActivityDataset.push(InDataset);
        }
        otable = $('#tblPmsQualityMovementData').dataTable({
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
            "sScrollXInner": "100%"  /* It varies dynamically if number of columns increases */,
            "aoColumns": [
                { "sTitle": "QA Approve" },
                { "sTitle": "Verified Review" },
                { "sTitle": "Verified Remarks" },
                { "sTitle": "Verified By" },
                { "sTitle": "Verified On" },
                { "sTitle": "Project No" },
                { "sTitle": "Product Indication" },
                { "sTitle": "Storage Location" },
                { "sTitle": "Product Type" },
                { "sTitle": "Product Name" },
                { "sTitle": "Batch Lot No" },
                //{ "sTitle": "Kit No" },
                { "sTitle": "Reason" },
                { "sTitle": "Quantity" },
                { "sTitle": "Unit" },
                { "sTitle": "Storage Area" },
                { "sTitle": "No Bin/Pallet/Crate/Locker/Container/Shelf/Box/Boxes/Rack" },
                { "sTitle": "Type of Storage" },
                { "sTitle": "Quality Checked By" },

            ],
            "columnDefs": [
                {
                    "targets": [11, 13, 15, 16],
                    "visible": false,
                    "searchable": false
                },
                { "width": "1%", "targets": 0 },
                { "width": "1%", "targets": 1 },
                { "width": "1%", "targets": 2 },
                { "width": "1%", "targets": 3 },
                { "width": "1%", "targets": 4 },
                { "width": "2%", "targets": 5 },
                { "width": "2%", "targets": 6 },
                { "width": "2%", "targets": 6 },
                { "width": "2%", "targets": 7 },
                { "width": "2%", "targets": 8 },
                { "width": "2%", "targets": 9 },
                { "width": "2%", "targets": 10 },
                { "width": "2%", "targets": 11 },
                { "width": "2%", "targets": 12 },
                { "width": "2%", "targets": 13 },
                { "width": "2%", "targets": 14 },
                { "width": "2%", "targets": 15 },
            ],
            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },
        });

        if ($("#hdnUserTypeCode").val() == ValidUserTypeCode) {
            var table = $('#tblPmsQualityMovementData').DataTable();
            table.column(0).visible(true);
            table.column(1).visible(true);
            table.column(2).visible(true);
            table.column(3).visible(true);
            table.column(4).visible(true);
        }
        else {
            var table = $('#tblPmsQualityMovementData').DataTable();
            //Changed by rinkal
            table.column(0).visible(false);
        }
    }
}

//------------------- Added by Yash ----------------------

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

//Added by Yash
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
            vDocTypeCode: 'ZMIA',
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


    //$("#hdnStageName").val("");
};

//Added by Yash
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
            vDocTypeCode: 'ZMIA',
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

//Added by Yash
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

//Added by Yash
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
//-------------------------------------------------------

function GetExportToExcelDetails() {
    var Data_Export = {
        vWorkSpaceId: setWorkspaceId,
        vDocTypeCode: "ZMIA",
    }

    var url = WebUrl + "PmsStudyProductReceipt/GetExportToExcelDetails";
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

    // For server

    $.ajax({
        type: "GET",
        url: BaseUrl + "PmsGeneral/GetProductType",
        data: { id: setWorkspaceId },
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
    }
    else {
        $("#divexport").css("visibility", "hidden");
    }
}

function QuantityValidation() {
    var batchno = $("#BatchLotNo").val();
    var productno = $("#Product").val();

    var table = document.getElementById('tblQualityCheckAdd'),
    rows = table.getElementsByTagName('tr'),
    i, j, cells, customerId;
    var totalqty = 0;
    for (i = 0, j = rows.length; i < j; ++i) {
        cells = rows[i].getElementsByTagName('td');
        if (!cells.length) {
            continue;
        }
        if (productno == cells[5].innerHTML) {
            if (batchno == cells[7].innerHTML)
            {
                totalqty = parseInt(totalqty) + parseInt(cells[3].innerHTML);
            }
        }
    }

    var totalnetqty = 0;
    totalnetqty = parseInt(totalqty) + parseInt($("#Quantity").val());

    if (parseInt(totalavailableqty) < parseInt(totalnetqty))
    {
        ValidationAlertBox("Current Stock is " + totalavailableqty + " .", "Product", ModuleName);
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
    debugger;
    var regExp = /[a-z]/i;
    var value = String.fromCharCode(e.which) || e.key;
    if (regExp.test(value)) {
        e.preventDefault();
        return false;
    }
});


$("#Quantity").on('keypress', function (e) {
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