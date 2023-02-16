var productIds = new Object();
var filenames1 = [];
var setworkspaceid = "";
var totalavailableqty;
var AvailableQtyTemp = "";
var RetentionQtyTemp = "";
var VerificationQtyTemp = "";
var UnusedQtyTemp = "";
var ModuleName = "Product Archive"
var TransferIndi = "";
var cTransferIndi = "";
var nTransactionNoQA = "";
var nTransactionDtlNoQA = "";
var vProjectNo = "";


$(document).ready(function () {
    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('.modal').modal('hide');

    CheckSetProject();
    $("#btnCancel").on("click", function () {
        $("#txtRemark").val('');
        $("#txtPassword").val('');
    });
    if (setworkspaceid != "") {
        BindData();
    }

    $("#spnwelcome").html($("#hdnusername").val());
    $("#spnLoginTime").html($("#hdnlogintime").val());
    $("#tblStudyProductArchiveAdd").hide();

    $('#ExpiryDate').datepicker({ format: 'dd-mm-yyyy', autoclose: true });

    GetReason();
    GetProductName();
    if (setworkspaceid != undefined) {
        //GetBatchLotNo(0);
    }



    var GetProjectNo = {
        //Url: BaseUrl + "PmsProductBatch/GetProjectNo",
        Url: BaseUrl + "PmsGeneral/GetScopeWiseProject",
        SuccessMethod: "SuccessMethod"
    }

    $('#DDLProjectNoList').on('change keyup paste mouseup', function () {
        if ($('#DDLProjectNoList').val().length == 2) {
            var ProjectNoDataTemp = {
                //vProjectNo: $('#DDLProjectNoList').val(),
                iUserId: $("#hdnuserid").val(),
                vStudyCode: $('#DDLProjectNoList').val()
                //vProjectTypeCode: $("#hdnscopevalues").val(),
            }
            GetPmsProjectNoProductReceipt(GetProjectNo.Url, GetProjectNo.SuccessMethod, ProjectNoDataTemp);
        }
        else if ($('#DDLProjectNoList').val().length < 2) {
            $("#DDLProjectNoList").autocomplete({
                source: "",
                change: function (event, ui) { },
                select: function (event, ui) {
                    vProjectNo = ui.item.value;
                    $('#DDLProjectNoList').val(vProjectNo);

                    BindData();
                },
            });
        }
    });

    GetPmsQualityCheckFromStrage = {
        Url: BaseUrl + "PmsQualityCheckMovement/GetFromStorageLocationName",
        SuccessMethod: "SuccessMethod",
    }
    GetAllPmsQualityCheckFromStorage(GetPmsQualityCheckFromStrage.Url, GetPmsQualityCheckFromStrage.SuccessMethod);



    $('#btnProductArchive').on('click', function () {
        clearData();
        $("#loader").attr("style", "display:none");
        if (isBlank(document.getElementById('DDLProjectNoList').value)) {
            ValidationAlertBox("Please enter Project No.", "DDLProjectNoList", ModuleName);
            return false;
        }

        $("#DDLProjectNo").val($("#DDLProjectNoList").val());
        $('#DDLProjectNo').prop('disabled', true);
        jQuery("#titleMode").text('Mode:-Add');
        document.getElementById("divProductCategory").style.display = "none";
        document.getElementById("divKitType").style.display = "none";
        document.getElementById("ProductLabel").style.display = "none";
        document.getElementById("KitData").style.display = "none";
        document.getElementById("ProductData").style.display = "none";

        var GETStorageArea = {
            Url: BaseUrl + "PmsGeneral/ALLStorageAreaData",
            SuccessMethod: "SuccessMethod"
        }
        var FilterData = {
            nStorageTypeId: $("#ddlFromStorage :selected").val(),
            vLocationCode: $("#hdnUserLocationCode").val(),
        }

        GetPmsProductReceiptStorageArea(GETStorageArea.Url, FilterData);
    });

    var GETStorageArea = {
        Url: BaseUrl + "PmsGeneral/ALLStorageAreaData",
        SuccessMethod: "SuccessMethod"
    }
    var FilterData = {
        nStorageTypeId: $("#ddlFromStorage :selected").val(),
        vLocationCode: $("#hdnUserLocationCode").val(),
    }
    GetPmsProductReceiptStorageArea(GETStorageArea.Url, FilterData);



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

    GetViewMode();

});

$("#tblStudyProductArchiveAdd").on('click', '#trremove', function () {
    $(this).closest('tr').remove();
});

$('#btnExitPmsProductReceipt').on('click', function () {
    ConfirmAlertBox(ModuleName);
});

$("#txtQuantity").on("blur", function () {
    QualityCheck();
    QuantityValidation();
});

$("#ddlProductType").on("change", function () {
    clearDetailsPartData();
    TransferIndi = $("#ddlTransferIndi").val();
    var TempProductType = $("#ddlProductType").val();

    if (TempProductType != "0") {
        if (TransferIndi == "P") {
            $("#divProductCategory").attr("style", "display:block");
            $("#divKitType").attr("style", "display:none");
            GetProductName();
        }
        else if (TransferIndi == "K") {
            $("#divProductCategory").attr("style", "display:none");
            $("#divKitType").attr("style", "display:block");
        }
        else {
            $("#divProductCategory").attr("style", "display:none");
            $("#divKitType").attr("style", "display:none");
        }
    }
    else {
        $("#divProductCategory").attr("style", "display:none");
        $("#divKitType").attr("style", "display:none");
        $("#ProductData").attr("style", "display:none");
        $("#KitData").attr("style", "display:none");
    }
});

$("#DDLProjectNoList").on("blur", function () {
    BindData();
});

$("#DDLProduct").on("change", function () {
    GetBatchLotNo($("#DDLProduct").val());
    ClearQuantityonPopup();
    $("#txtQuantity").val("");
    $("#ddlStorageArea").multiselect("clearSelection");
    $("#ddlStorageArea").multiselect('refresh');
    $('#ddlReason').val(0).attr("selected", "selected");
    $("#ddlUnit").val(0).attr('disabled', false);
    $("#divUnit").hide();
});

$("#DDLBatchLotNo").on("change", function () {
    if ($("#DDLBatchLotNo").val() != "0") {
        getUnit();
    }
    else {
        $("#ddlUnit").val(0).attr('disabled', false);
        $("#divUnit").hide();
    }
    ClearQuantityonPopup();
    $("#txtQuantity").val("");
    $("#ddlStorageArea").multiselect("clearSelection");
    $("#ddlStorageArea").multiselect('refresh');
    $('#ddlReason').val(0).attr("selected", "selected");
});

function getUnit() {    
    var QualityCheckData = {
        vWorkSpaceId: setworkspaceid,
        nProductNo: $("#DDLProduct :selected").val(),
        nStudyProductBatchNo: $("#DDLBatchLotNo :selected").val(),
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
        
        $("#divUnit").show();
        $("#ddlUnit").val(response).attr('disabled', 'disabled');
    }
}


$('#QuantityAllocation').on('click', function () {

    if (Dropdown_Validation(document.getElementById("ddlProductType"))) {
        ValidationAlertBox("Please select Product Type.", "ddlProductType", ModuleName);
        return false;
    }

    if (Dropdown_Validation(document.getElementById("DDLProduct"))) {
        ValidationAlertBox("Please select Product.", "ddlProductType", ModuleName);
        return false;
    }

    if (Dropdown_Validation(document.getElementById("DDLBatchLotNo"))) {
        ValidationAlertBox("Please select Batch/Lot/Lot No.", "DDLBatchLotNo", ModuleName);
        return false;
    }

    QuantatiyAllocation();
    $('#ProductArchiveQuantity').modal('show');
});

$("#btnAddTempProduct").on("click", function () {
    AddTempPmsProductReceiptData();
    if ($("#tblStudyProductArchiveAdd tr").length > 1) {
        $('#btnSavePmsProductArchive').show();
        $(".headercontrol").attr('disabled', 'disabled');
    }
    else {
        $(".headercontrol").prop('disabled', '');
    }
    $("#ProductArchive").css("overflow", "scroll");
});

$("#btnSavePmsProductArchive").on("click", function () {
    $('#btnSavePmsProductArchive').hide();
    if (productIds[$('#DDLProjectNo').val()] != undefined) {
        setworkspaceid = productIds[$('#DDLProjectNo').val()];
    }
    var InsertPmsProductArchiveHeader = {
        vWorkSpaceId: setworkspaceid,
        nStorageLocationNo: $("#ddlFromStorage :selected").val(),
        vDocTypeCode: "ZARC",
        nProductTypeID: $("#ddlProductType :selected").val(),
        iModifyBy: $("#hdnuserid").val(),
        cTransferIndi: TransferIndi,
    }
    var InsertProductArchiveData = {
        Url: BaseUrl + "PmsStudyProductReceipt/InsertPmsProductReceiptHeader",
        SuccessMethod: "SuccessMethod",
        Data: InsertPmsProductArchiveHeader
    }
    InsertPmsProductReceiptMaster(InsertProductArchiveData.Url, InsertProductArchiveData.SuccessMethod, InsertProductArchiveData.Data);
});

var GetAllPmsQualityCheckFromStorage = function (Url, SuccessMethod) {
    $.ajax({
        url: Url,
        type: 'GET',
        async: false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("From Storage not found.", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        if (jsonData.length > 0) {
            for (var i = 0; i < jsonData.length; i++) {
                $("#ddlFromStorage").empty().append($("<option></option>").val(jsonData[i].nStorageTypeId).html(jsonData[i].vStorageType));
            }
            $("#ddlFromStorage").prop('disabled', 'disabled');
        }
    }
}

var GetPmsProductReceiptStorageArea = function (Url, FilterData) {

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

//Get Project No
var GetPmsProjectNoProductReceipt = function (Url, SuccessMethod, ProjectNoDataTemp) {
    $.ajax({
        url: Url,
        type: 'GET',
        //data: { id: ProjectNoDataTemp.iUserId, projectno: ProjectNoDataTemp.vProjectNo, typecode: ProjectNoDataTemp.vProjectTypeCode },
        data: { iUserId: ProjectNoDataTemp.iUserId, vStudyCode: ProjectNoDataTemp.vStudyCode },
        async: false,
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

        $("#DDLProjectNoList").autocomplete({
            source: sourceArr,
            change: function (event, ui) { }
        });
    }
}

function AddTempPmsProductReceiptData() {
    var strtable;
    if (ValidateForm() == false) { }
    else
    {
        var totallength;


        var KitNo = [];
        var setKitNo = $.map($("#ddlKit option:selected"), function (ekit, i) {
            KitNo.push($(ekit).text());
        });

        var StudyProductLabelNo = [];
        var setStudyProductLabelNo = $.map($("#ddlProductLabel option:selected"), function (ekit, i) {
            StudyProductLabelNo.push($(ekit).text());
        });

        totallength = StudyProductLabelNo.length;
        if (TransferIndi == "K") {
            totallength = KitNo.length;
            var data = $('table#tblStudyProductArchiveAdd').find('tbody').find('tr');
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
        else if (TransferIndi == "L") {
            totallength = StudyProductLabelNo.length;
        }
        else if (TransferIndi == "P") {
            totallength = 1;
        }

        for (i = 0; i < totallength; i++) {
            strtable += "<tr>";
            strtable += "<td class='hideproduct'>" + $("#DDLProduct :selected").text() + "</td>";
            strtable += "<td>" + $("#ddlProductType :selected").text() + "</td>";
            strtable += "<td class='hidelabel'>" + StudyProductLabelNo[i] + "</td>";
            strtable += "<td class='hidekit'>" + KitNo[i] + "</td>";
            strtable += "<td class='hideproduct'>" + $("#DDLBatchLotNo :selected").text() + "</td>";
            strtable += "<td class='hideproduct'>" + $("#txtQuantity").val() + "</td>";
            strtable += "<td>" + $("#txtRemarks").val() + "</td>";
            strtable += "<td class='hidetd'>" + $("#DDLProduct :selected").val() + "</td>";
            strtable += "<td class='hidetd'>" + $("#DDLBatchLotNo :selected").val() + "</td>";
            strtable += "<td class='hidetd'>" + $("#ddlStorageArea :selected").val() + "</td>";
            strtable += "<td class='hidetd'>" + $("#ddlReason :selected").val() + "</td>";
            strtable += "<td class='hidetd'>" + $("#txtUsableStock").val() + "</td>";
            strtable += "<td class='hidetd'>" + $("#txtRetentionQuantity").val() + "</td>";
            strtable += "<td class='hidetd'>" + $("#txtVerificationQuantity").val() + "</td>";
            strtable += "<td class='hidetd'>" + $("#txtUnusedQuantity").val() + "</td>";
            strtable += "<td id='trRemove'><span class='glyphicon glyphicon-remove'</span></td>";
            strtable += "<td class='hidetd'>" + $("#txtNoOfContainers").val() + "</td>";
            strtable += "<td class='hidetd'>" + $("#ddlUnit").val() + "</td>";
            strtable += "<td class='hidetd'>" + $("#ddlSelectStorage :selected").val() + "</td>";
            strtable += "</tr>";
        }

        $("#tbodyStudyProductArchiveAdd").append(strtable);
        $("#tblStudyProductArchiveAdd thead").show();
        $("#tblStudyProductArchiveAdd").show();
        $("#btnSavePmsProductArchive").show();
        $(".hidetd").hide();

        if (TransferIndi == "P") {
            $(".hideproduct").show();
            $(".hidekit").hide();
            $(".hidelabel").hide();
        }
        else if (TransferIndi == "K") {
            $(".hideproduct").hide();
            $(".hidekit").show();
            $(".hidelabel").hide();
        }
        else if (TransferIndi == "L") {
            $(".hideproduct").hide();
            $(".hidekit").hide();
            $(".hidelabel").show();
        }
        clearDetailsPartData();
    }
}

var InsertPmsProductReceiptMaster = function (Url, SuccessMethod, Data) {
    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        success: SuccessInsertData,
        error: function () {
            SuccessorErrorMessageAlertBox("Error to save data.", ModuleName);
        }
    });

    function SuccessInsertData(response) {
        if (productIds[$('#DDLProjectNo').val()] != undefined) {
            setworkspaceid = productIds[$('#DDLProjectNo').val()];
        }
        var data = $('table#tblStudyProductArchiveAdd').find('tbody').find('tr');
        var TempKitNo;
        var TempLableNo;


        for (i = 0; i < data.length; i++) {

            if ($(data[i]).find('td:eq(3)').html() == "undefined") {
                TempKitNo = "";
            }
            else {
                TempKitNo = $(data[i]).find('td:eq(3)').html();
            }

            if ($(data[i]).find('td:eq(2)').html() == "undefined") {
                TempLableNo = "";
            }
            else {
                TempLableNo = $(data[i]).find('td:eq(2)').html();
            }




            var InsertPmsProductReceipt2 = {
                nTransactionNo: response,
                nSrNo: "1",
                nProductNo: $(data[i]).find('td:eq(7)').html(),
                nStudyProductBatchNo: $(data[i]).find('td:eq(8)').html(),
                iReceivedQty: $(data[i]).find('td:eq(11)').html(),
                iModifyBy: $("#hdnuserid").val(),
                vStorageArea: $(data[i]).find('td:eq(9)').html(),
                vWorkSpaceId: setworkspaceid,
                vDocTypeCode: "ZARC",
                nReasonNo: $(data[i]).find('td:eq(10)').html(),
                dExpiryDate: "1900-01-01 00:00:00.000",
                nStorageLocationNo: $("#ddlFromStorage :selected").val(),
                cProductFlag: "Q",
                cLocationIndicator: "Q",
                vRefModule: "AR",
                cProductArchiveFlag: "Y",
                cAddSub: "S",
                vRemarks: $(data[i]).find('td:eq(6)').html(),
                iRetentionQty: $(data[i]).find('td:eq(12)').html(),
                iVerificationQty: $(data[i]).find('td:eq(13)').html(),
                iNonSalableClStockQty: $(data[i]).find('td:eq(14)').html(),
                cTransferIndi: TransferIndi,
                vKitNo: TempKitNo,
                vStudyProductLabelNo: TempLableNo,
                iNoOfContainers: $(data[i]).find('td:eq(16)').html(),
                vUnit: $(data[i]).find('td:eq(17)').html(),
                vStorageType: $(data[i]).find('td:eq(18)').html()
            }
            var InsertProductArchiveDetails = {
                Url: BaseUrl + "PmsStudyProductReceipt/InsertPmsProductReceiptDetails",
                SuccessMethod: "SuccessMethod",
                Data: InsertPmsProductReceipt2
            }
            $.ajax({
                url: InsertProductArchiveDetails.Url,
                type: 'POST',
                async: false,
                data: InsertProductArchiveDetails.Data,
                success: SuccessInsertDataReceipt,
                error: function () {
                    SuccessorErrorMessageAlertBox("Error to insert data of details part.", ModuleName);
                }
            });

            function SuccessInsertDataReceipt(response) {
                clearData();
                GetDashBoardData();
            }
        }
        SuccessorErrorMessageAlertBox("Product Archive saved successfully.", ModuleName);
    }
}

function ValidateForm() {
    if (isBlank(document.getElementById('DDLProjectNo').value)) {
        ValidationAlertBox("Please select Project Number.", "DDLProjectNo", ModuleName);
        return false;
    }

    if (Dropdown_Validation(document.getElementById("ddlProductType"))) {
        ValidationAlertBox("Please select Product Type.", "ddlProductType", ModuleName);
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
        if (Dropdown_Validation(document.getElementById("DDLProduct"))) {
            ValidationAlertBox("Please select Product.", "DDLProduct", ModuleName);
            return false;
        }

        if (Dropdown_Validation(document.getElementById("DDLBatchLotNo"))) {
            ValidationAlertBox("Please select Batch/Lot/Lot No.", "DDLBatchLotNo", ModuleName);
            return false;
        }

        if (isBlank(document.getElementById('txtQuantity').value)) {
            ValidationAlertBox("Please enter Quantity.", "txtQuantity", ModuleName);
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
        if (Dropdown_Validation(document.getElementById("ddlProductCategory"))) {
            ValidationAlertBox("Please select Product Category.", "ddlProductCategory", ModuleName);
            return false;
        }

        if (isBlank(document.getElementById('ddlProductLabel').value)) {
            ValidationAlertBox("Please select Product Label.", "ddlProductLabel", ModuleName);
            return false;
        }
    }

    if (isBlank(document.getElementById('ddlStorageArea').value)) {
        ValidationAlertBox("Please select Storage Area.", "ddlStorageArea", ModuleName);
        return false;
    }

    if (isBlank(document.getElementById('txtNoOfContainers').value)) {
        ValidationAlertBox("Please enter No of Container.", "txtNoOfContainers", ModuleName);
        return false;
    }

    if (Dropdown_Validation(document.getElementById("ddlReason"))) {
        ValidationAlertBox("Please select Reason.", "ddlReason", ModuleName);
        return false;
    }

    if (isBlank(document.getElementById('txtRemarks').value)) {
        ValidationAlertBox("Please enter Remarks.", "txtRemarks", ModuleName);
        return false;
    }
}

function GetProductName() {
    if (productIds[$('#DDLProjectNoList').val()] != undefined) {
        setworkspaceid = productIds[$('#DDLProjectNoList').val()];
    }

    var GetProductNameData = {
        vWorkSpaceId: setworkspaceid,
        nProductTypeID: $("#ddlProductType").val(),
        cTransferIndi: TransferIndi,
    }

    var GetPmsStudyArchiveProductName = {
        Url: BaseUrl + "PMSGeneral/ProductName",
        SuccessMethod: "SuccessMethod",
        Data: GetProductNameData,
    }

    $.ajax({
        url: GetPmsStudyArchiveProductName.Url,
        type: 'POST',
        success: SuccessMethod,
        async: false,
        data: GetPmsStudyArchiveProductName.Data,
        error: function () {
            ValidationAlertBox("Product not found.", "ddlProductType", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        if (jsonData.length > 0) {
            $("#DDLProduct").empty().append('<option selected="selected" value="0">Please Select Product</option>');
            for (var i = 0; i < jsonData.length; i++)
                $("#DDLProduct").append($("<option></option>").val(jsonData[i].nProductNo).html(jsonData[i].vProductName));
        }
        else {
            $("#DDLProduct").empty().append('<option selected="selected" value="0">Please Select Product</option>');
        }
    }
}

function GetBatchLotNo(productid) {
    if (productIds[$('#DDLProjectNo').val()] != undefined) {
        setworkspaceid = productIds[$('#DDLProjectNo').val()];
    }

    var projectid = setworkspaceid;

    var GetPmsQualityCheckBatchLotNo = {
        Url: BaseUrl + "PmsStudyProductReceipt/GetBatchLotNo",
        SuccessMethod: "SuccessMethod"
    }

    $.ajax({
        url: GetPmsQualityCheckBatchLotNo.Url,
        type: 'GET',
        data: { id: projectid, projectno: productid },
        success: SuccessMethod,
        async: false,
        error: function () {
            ValidationAlertBox("Batch/Lot/Lot No not found.", "DDLProduct", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        var strdata = "";
        if (jsonData.length > 0) {
            $("#DDLBatchLotNo").empty().append('<option selected="selected" value="0">Please Select Batch/Lot/Lot No</option>');
            for (var i = 0; i < jsonData.length; i++)
                $("#DDLBatchLotNo").append($("<option></option>").val(jsonData[i].nStudyProductBatchNo).html(jsonData[i].vBatchLotNo));
        }
        else {
            $("#DDLBatchLotNo").empty().append('<option selected="selected" value="0">Please Select Batch/Lot/Lot No</option>');
        }
        //$("#DDLBatchLotNo").val(batchno);
    }
}

function clearDetailsPartData() {
    $('#DDLProduct').val(0).attr("selected", "selected");
    $('#DDLBatchLotNo').val(0).attr("selected", "selected");
    $('#ddlReason').val(0).attr("selected", "selected");
    $("#txtRemarks").val("");
    $("#txtQuantity").val("");
    $("#ddlStorageArea").multiselect("clearSelection");
    $("#ddlStorageArea").multiselect('refresh');
    $('#btnSavePmsProductArchive').hide();
    ClearQuantityonPopup();
    $("#ddlKit").multiselect("clearSelection");
    $("#ddlKit").multiselect('refresh');
    $("#txtNoOfContainers").val("");
    $("#divStorage").attr('style', 'display:none');
}

function clearHeaderPartData() {
    $('#ddlProductType').val(0).attr("selected", "selected");
    $('#ddlTransferIndi').val("0")
    $('#ddlProductCategory').val("0")
}

function clearData() {
    clearHeaderPartData();
    clearDetailsPartData();
    $("#btnAddTempProduct").show();
    $("#tblStudyProductArchiveAdd tbody tr").remove();
    $("#tblStudyProductArchiveAdd thead").hide();
    $(".headercontrol").prop('disabled', '');
    $("#ProductData").attr("style", "display:none");
    $("#KitData").attr("style", "display:none");
    $("#txtNoOfContainers").removeAttr('disabled');
    $("#txtRemarks").removeAttr('disabled');
    $("#ddlReason").removeAttr('disabled');
    $("#QuantityAllocation").show();
    $("#btnClearPmsProductReceipt").show();
    $('#ddlUnit').val(0).attr("selected", "selected").prop("disabled", false);
    $("#divUnit").hide();
    $("#divStorage").attr('style', 'display:none');

}

$("#tblStudyProductArchiveAdd").on('click', '#trRemove', function () {
    $(this).closest('tr').remove();
    if ($("#tblStudyProductArchiveAdd tr").length == 1) {
        $("#tblStudyProductArchiveAdd").hide();
        $('#btnSavePmsProductArchive').hide();
        $(".headercontrol").prop('disabled', '');
    }
    else {
        $("#tblStudyProductArchiveAdd").show();
        $(".headercontrol").attr('disabled', 'disabled');
    }
});

function GetDashBoardData() {


    if (productIds[$('#DDLProjectNoList').val()] != undefined) {
        setworkspaceid = productIds[$('#DDLProjectNoList').val()];
    }
    if (setworkspaceid != undefined) {
        var GetDashboardData = {
            vWorkSpaceId: setworkspaceid,
            vDocTypeCode: "ZARC",
            iUserID: $("#hdnuserid").val()
        }

        var GetPMSStudyProductArchiveData =
        {
            Url: BaseUrl + "PmsStudyProductReceipt/StudyProductArchiveData",
            SuccessMethod: "SuccessMethod",
            Data: GetDashboardData
        }

        $.ajax({
            url: GetPMSStudyProductArchiveData.Url,
            type: 'POST',
            data: GetPMSStudyProductArchiveData.Data,
            success: SuccessMethod,
            error: function () {
                SuccessorErrorMessageAlertBox("Data not found.", ModuleName);
            }
        });

        function SuccessMethod(jsonData) {

            if (jsonData.length > 0) {
                //$("#divexport").css("visibility", "visible");
                document.getElementById("divexport").style.display = "block";
            }
            else {
                //$("#divexport").css("visibility", "hidden");
                document.getElementById("divexport").style.display = "none";
            }

            var ActivityDataset = [];
            var View;
            var QAreview;
            var UserTypeCode = "";
            var review = "";
            UserTypeCode = $("#hdnUserTypeCode").val();
            for (var i = 0; i < jsonData.length; i++) {
                var InDataset = [];

                if ($("#hdnUserProfile").val().includes(UserTypeCode)) {
                    QAreview = "<a data-toggle='modal' data-tooltip='tooltip' title='QA Review'  attrid=' + aData[0] + ' class='btnview' Onclick=pmsStudyViewAuthenticate(this) nTransactionNo='" + jsonData[i].nTransactionNo
                                  + "' nSPTransactionDtlNo='" + jsonData[i].nTransactionDtlNo + "' cIsQAReview='" + jsonData[i].cIsQAReview + "' style='cursor:pointer;'><i class='btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a'><i class='fa fa-fw fa-edit'></i><span>QA Review</span></a>"


                }
                else {
                    //Changed by rinkal

                    QAreview = "<a data-toggle='modal' data-tooltip='tooltip' title='QA Review'  attrid=' + aData[0] + ' class='btnview' Onclick=pmsStudyViewAuthenticate(this) nTransactionNo='" + jsonData[i].nTransactionNo
                                + "' nSPTransactionDtlNo='" + jsonData[i].nTransactionDtlNo + "' style='cursor:pointer;'><i class='btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a'><i class='fa fa-fw fa-edit'></i><span>QA Review</span></a>"

                }
                View = "<a data-toggle='modal' data-tooltip='tooltip' newtitle='View' data-target='#ProductArchive' attrid=' + aData[0] + ' class='btnedit' Onclick=pmsStudyProductReceiptSelectionData(this) nTransactionNo='" + jsonData[i].nTransactionNo
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

                InDataset.push(jsonData[i].vStudyCode, jsonData[i].cTransferIndi, jsonData[i].vKitNo, jsonData[i].vProductType, jsonData[i].vProductName,
                               jsonData[i].vBatchLotNo, jsonData[i].iReceivedQty, jsonData[i].vUnit, jsonData[i].vStorageAreaName, jsonData[i].iNoOfContainers, jsonData[i].vStorageType,
                               jsonData[i].vReasonDesc, jsonData[i].vRemarks, jsonData[i].vModifyBy + jsonData[i].dModifyOn + " /</br> ", review, jsonData[i].vQARemarks, jsonData[i].iQAReviewBy, jsonData[i].dQAReviewOn, View, QAreview,
                               jsonData[i].nTransactionNo, jsonData[i].nTransactionDtlNo, jsonData[i].cIsQAReview);
                ActivityDataset.push(InDataset);
            }
            otable = $('#tblPmsProductArchivedData').dataTable({
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
                "sScrollXInner": "1800" /* It varies dynamically if number of columns increases */,
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
                    { "sTitle": "Product Name" },
                    { "sTitle": "Batch/Lot/Lot No" },
                    { "sTitle": "Quantity" },
                    { "sTitle": "Unit" },
                    { "sTitle": "Storage Area" },
                    { "sTitle": "No Bin/Pallet/Crate/Locker/Container/Shelf/Box/Boxes/Rack" },
                    { "sTitle": "Type Of Storage" },
                    { "sTitle": "Reason" },
                    { "sTitle": "Remarks" },
                    { "sTitle": "Archive By" },
                    { "sTitle": "QA Review" },
                    { "sTitle": "QA Review Remarks" },
                    { "sTitle": "QA Review By" },
                    { "sTitle": "QA Review On" },
                    { "sTitle": "View" },
                    { "sTitle": "QA Review" },
                ],
                "columnDefs": [
                     {
                         "targets": [19, 20, 21],
                         "visible": false,
                         "searchable": false
                     },
                { "width": "4%", "targets": 0 },
                { "width": "8%", "targets": 1 },
                { "width": "6%", "targets": 2 },
                { "width": "6%", "targets": 3 },
                { "width": "6%", "targets": 4 },
                { "width": "6%", "targets": 5 },
                { "width": "2%", "targets": 6 },
                { "width": "8%", "targets": 7 },
                { "width": "4%", "targets": 8 },
                { "width": "9%", "targets": 9 },
                { "width": "9%", "targets": 10 },
                { "width": "3%", "targets": 11 },
                { "width": "10%", "targets": 12 },
                { "width": "3%", "targets": 13 },
                { "width": "3%", "targets": 14 },
                { "width": "3%", "targets": 15 },
                { "width": "3%", "targets": 16 },
                { "width": "3%", "targets": 17 },
                { "width": "3%", "targets": 18 },
                { "width": "3%", "targets": 19 },
                { "width": "3%", "targets": 20 },
                { "width": "3%", "targets": 21 }
                ],
                "oLanguage": {
                    "sEmptyTable": "No Record Found",
                },
            });
            if ($("#hdnUserProfile").val().includes(UserTypeCode)) {
                var table = $('#tblPmsProductArchivedData').DataTable();
                table.column(19).visible(true);
                table.column(18).visible(true);
            }
            else {
                var table = $('#tblPmsProductArchivedData').DataTable();
                //Changed by rinkal
                table.column(19).visible(false);
                table.column(18).visible(true);
            }

        }
    }
}

function GetReason() {
    var FilterData = {
        vOperationCode: $("#hdnOperationcode").val(),
        vLocationCode: $("#hdnUserLocationCode").val(),
    }
    $.ajax({
        //url: BaseUrl + "PmsGeneral/GetReasonDesc/" + $("#hdnOperationcode").val() + "",
        url: BaseUrl + "PmsGeneral/ReasonLocationWise",
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

function QualityCheck() {
    if (productIds[$('#DDLProjectNoList').val()] != undefined) {
        setworkspaceid = productIds[$('#DDLProjectNoList').val()];
    }

    var QualityCheckData = {
        vWorkSpaceId: setworkspaceid,
        vProductNo: $("#DDLProduct :selected").val(),
        nStudyProductBatchNo: $("#DDLBatchLotNo :selected").val(),
        vRefModule: "PD",
        vDocTypeCode: "ZARC"
    }

    $.ajax({
        url: BaseUrl + "PmsGeneral/QtyDetail",
        type: 'POST',
        data: QualityCheckData,
        success: Success,
        async: false,
        error: function () {
            ValidationAlertBox("Quantity not found.", "DDLBatchLotNo", ModuleName);
        }
    });
    function Success(response) {
        var totalqty = $("#txtQuantity").val();
        if (parseInt(response) < parseInt(totalqty)) {
            //txtQuantity.focus();
            totalavailableqty = response;
            $("#txtQuantity").val("");
            ValidationAlertBox("Current Stock Is " + response + " !", "ddlStorageArea", ModuleName);
            return false;
        }
    }
}

function GetExportToExcelDetails() {
    if (productIds[$('#DDLProjectNoList').val()] != undefined) {
        setworkspaceid = productIds[$('#DDLProjectNoList').val()];
    }
    var Data_Export = {
        vWorkSpaceId: setworkspaceid,
        vDocTypeCode: "ZARC",
    }

    var url = WebUrl + "PmsStudyProductArchive/GetExportToExcelDetails";
    $.ajax({
        url: url,
        type: 'get',
        data: Data_Export,
        async: false,
        success: function (data) {

        },
        error: function () {
            SuccessorErrorMessageAlertBox("Error in export to excel session details.", ModuleName);
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
            $('#DDLProjectNoList').val(jsonData[0].vProjectNo);
            setworkspaceid = jsonData[0].vWorkSpaceId;
        }
        else {
            $('#DDLProjectNoList').val('');
        }
    }
}

function BindData() {
    GetDashBoardData();
    GetExportToExcelDetails();
    GetProductType();

}

function QuantityValidation() {
    var batchno = $("#DDLBatchLotNo").val();
    var productno = $("#DDLProduct").val();

    var table = document.getElementById('tblStudyProductArchiveAdd'),
    rows = table.getElementsByTagName('tr'),
    i, j, cells, customerId;
    var totalqty = 0;
    for (i = 0, j = rows.length; i < j; ++i) {
        cells = rows[i].getElementsByTagName('td');
        if (!cells.length) {
            continue;
        }
        if (productno == cells[5].innerHTML) {
            if (batchno == cells[6].innerHTML) {
                totalqty = parseInt(totalqty) + parseInt(cells[3].innerHTML);
            }
        }
    }

    var totalnetqty = 0;
    totalnetqty = parseInt(totalqty) + parseInt($("#txtQuantity").val());
    if (parseInt(totalavailableqty) < parseInt(totalnetqty)) {
        ValidationAlertBox("Current Stock is " + totalavailableqty + " !", "ddlStorageArea", ModuleName);
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
        vProductNo: $("#DDLProduct :selected").val(),
        nStudyProductBatchNo: $("#DDLBatchLotNo :selected").val(),
        vRefModule: "PD",
        vDocTypeCode: "ZARC"
    }

    $.ajax({
        url: BaseUrl + "PmsGeneral/QuantityAllocation",
        type: 'POST',
        data: QualityCheckData,
        success: SuccessQuantityCheck,
        async: false,
        error: function () {
            ValidationAlertBox("Quantity not found.", "ddlStorageArea", ModuleName);
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

        var data = HTMLtbl.getData($('#tblStudyProductArchiveAdd'));

        var iReceivedQty = 0
        var iStockQty = 0
        var iRetentionQty = 0
        var iVerificationQty = 0
        var iNonSalableClStockQty = 0
        var iArchiveQty = 0

        for (i = 0; i < data.length; i++) {
            var storedata = data[i];
            var RecdQty = storedata[9];

            iReceivedQty = parseInt(iReceivedQty) + parseInt((RecdQty == "") ? "0" : RecdQty);
            iRetentionQty = parseInt(iRetentionQty) + parseInt((storedata[11] == "") ? "0" : storedata[10]);
            iVerificationQty = parseInt(iVerificationQty) + parseInt((storedata[12] == "") ? "0" : storedata[11]);
            iNonSalableClStockQty = parseInt(iNonSalableClStockQty) + parseInt((storedata[13] == "") ? "0" : storedata[12]);

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
        else {
            document.getElementById('lblUsableStock').innerHTML = "0";
            document.getElementById('lblRetentionQuantity').innerHTML = "0";
            document.getElementById('lblVerificationQuantity').innerHTML = "0";
            document.getElementById('lblUnusedQty').innerHTML = "0";
            document.getElementById('lblAvailableQuantity').innerHTML = "0";

            AvailableQtyTemp =  "0";
            RetentionQtyTemp = "0" ;
            VerificationQtyTemp = "0";
            UnusedQtyTemp = "0";

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
        ValidationAlertBox("You can not enter more than Available Stock.", "ddlStorageArea", ModuleName);
        return false;
    }

    if (parseInt(RetentionQty) > (parseInt(RetentionQtyTemp))) {
        $("#txtRetentionQuantity").val("");
        ValidationAlertBox("You can not enter more than Retention Stock.", "ddlStorageArea", ModuleName);
        return false;
    }

    if (parseInt(VerificationQty) > (parseInt(VerificationQtyTemp))) {
        $("#txtVerificationQuantity").val("");
        ValidationAlertBox("You can not enter more than Verification Stock.", "ddlStorageArea", ModuleName);
        return false;
    }

    if (parseInt(UnUsedQty) > (parseInt(UnusedQtyTemp))) {
        $("#txtUnusedQuantity").val("");
        ValidationAlertBox("You can not enter more than Unused Stock !", "ddlStorageArea", ModuleName);
        return false;
    }

    var totalQuantity = parseInt(parseInt(UsableStock)) + parseInt(parseInt(RetentionQty)) + parseInt(parseInt(VerificationQty)) + parseInt(parseInt(UnUsedQty));
    document.getElementById('lblTotalQuantity').innerHTML = (totalQuantity == "") ? "0" : totalQuantity;

}

function ClearQuantityonPopup() {
    $("#txtUsableStock").val("");
    $("#txtRetentionQuantity").val("");
    $("#txtVerificationQuantity").val("");
    $("#txtUnusedQuantity").val("");
    document.getElementById('lblTotalQuantity').innerHTML = "0";
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

    var TotalQty = $("#txtUsableStock").val() + " | " + $("#txtRetentionQuantity").val() + " | " + $("#txtVerificationQuantity").val() + " | " + $("#txtUnusedQuantity").val();
    var sumQty = $("#txtUsableStock").val() + $("#txtRetentionQuantity").val() + $("#txtVerificationQuantity").val() + $("#txtUnusedQuantity").val();

    var iPendingReview = document.getElementById('lblPendingQAReview').innerHTML;
    var ttlQty = document.getElementById('lblTotalQuantity').innerHTML
    var avlQty = document.getElementById('lblAvailableQuantity').innerHTML



    if ((parseInt(ttlQty) + parseInt(iPendingReview)) > parseInt(avlQty)) {
        $("#txtQuantity").val('');
        ClearQuantityonPopup();
        ValidationAlertBox("Invalid Quantity. Quantity pending for QA : " + iPendingReview + "  !", "txtUsableStock", ModuleName);
    }
    else {
        if (sumQty == 0) {
            $("#txtQuantity").val("");
        }
        else {
            $("#txtQuantity").val(TotalQty);
        }
        $("#ProductArchiveQuantity").modal('hide');
    }

});

$("#ddlTransferIndi").on("change", function () {
    clearDetailsPartData();
    TransferIndi = $("#ddlTransferIndi").val();
    $("#KitData").attr("style", "display:none");
    $("#ProductData").attr("style", "display:none");

    if (TransferIndi == "P") {
        $("#divProductCategory").attr("style", "display:block");
        $("#divKitType").attr("style", "display:none");
    }
    else if (TransferIndi == "K") {
        $("#divProductCategory").attr("style", "display:none");
        $("#divKitType").attr("style", "display:block");
        GetKitType();
    }
    else {
        $("#divProductCategory").attr("style", "display:none");
        $("#divKitType").attr("style", "display:none");
    }



    //if (TransferIndi == "P") {
    //    if ($("#ddlProductType").val() != "0") {
    //        $("#ProductData").attr("style", "display:inline");
    //        $("#KitData").attr("style", "display:none");
    //        GetProductName();
    //    }
    //}
    //else if (TransferIndi == "K") {
    //    if ($("#ddlProductType").val() != "0") {
    //        $("#ProductData").attr("style", "display:none");
    //        $("#KitData").attr("style", "display:inline");
    //        GetKit();
    //    }
    //}
    //else {
    //    $("#ProductData").attr("style", "display:none");
    //    $("#KitData").attr("style", "display:none");
    //}
});

function GetKit() {
    $('#ddlKit option').each(function () {
        $(this).remove();
    });


    var PostData = {
        vWorkSpaceID: setworkspaceid,
        nProductTypeID: $("#ddlProductType").val(),
        nKitTypeNo: $("#ddlKitType").val(),
    }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/Proc_GetAvailableKitNo",
        type: 'POST',
        data: PostData,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Kit Data Is not found.", ModuleName);
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

$("#ddlKitType").on("change", function () {
    var value = $("#ddlKitType").val();
    document.getElementById("ProductData").style.display = "none";
    document.getElementById("divProductCategory").style.display = "none";
    document.getElementById("KitData").style.display = "block";
    GetKit();
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
                    SuccessorErrorMessageAlertBox("Kit Type Data is not found.", ModuleName);
                }
            });
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Kit Type Data is not found.", ModuleName);
        }
    });
}

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

$("#ddlProductCategory").on("change", function () {
    clearDetailsPartData();
    var value = $("#ddlProductCategory").val();
    document.getElementById("KitData").style.display = "none";
    document.getElementById("ProductData").style.display = "none";

    if (value == "P") {
        TransferIndi = "P";
        document.getElementById("ProductData").style.display = "block";
        document.getElementById("ProductLabel").style.display = "none";
        $("#DDLProduct").val(0).prop("disabled", false);

        $('#DDLBatchLotNo').val(0).prop("disabled", false);

        GetProductName();

    }
    else if (value == "L") {
        TransferIndi = "L";
        document.getElementById("ProductData").style.display = "none";
        document.getElementById("ProductLabel").style.display = "block";
        document.getElementById("divUnit").style.display = "none";
        GetStudyProductLabel();

    }
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

    if (cTransferIndi == "Product") {
        TransferIndi = "P";
    }
    else if (cTransferIndi == "Kit") {
        TransferIndi = "K";
    }

    GetProductName();

    $("#DDLProduct").val(vnProductNo);
    $("#nTransactionno").val(nTransactionNo);
    $("#nSPTTransactionDtlNo").val(nTransactionDtlNo);

    $('#ddlProductType').val(nProductTypeID).attr("selected", "selected");
    $("#ProductData").show();

    GetBatchLotNo(vnProductNo);
    $("#DDLBatchLotNo").val(nStudyProductBatchNo)
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

            $("#divProductCategory").show();
            $("#DDLProduct").val(jsonData[0].nProductNo).prop("disabled", "disabled");

            $('#DDLBatchLotNo').val(nStudyProductBatchNo).prop("disabled", "disabled");

            $("#ddlProductCategory").show();
            $("#QuantityAllocation").hide();

            $("#ddlProductCategory").val('P').prop("disabled", "disabled");

            $("#divUnit").show();
            $("#ddlUnit").val(jsonData[0].vUnit).prop("disabled", "disabled");

            $("#txtRemarks").val(jsonData[0].vRemarks).prop("disabled", "disabled");
            $("#btnSavePmsProductArchive").hide();
            $("#btnAddTempProduct").hide();
            $("#btnClearPmsProductReceipt").hide();

            $("#DDLProjectNo").val($("#DDLProjectNoList").val()).prop("disabled", "disabled")
            $("#ddlReason").val(jsonData[0].nReasonNo).attr("selected", "selected").prop("disabled", "disabled")
            $("#txtQuantity").val(jsonData[0].iReceivedQty);

            $("#DDLProjectNo").prop('disabled', 'disabled');
            $(".headercontrol").prop('disabled', 'disabled');

            // For Selection of Storage Area
            var data = jsonData[0].vStorageArea
            var dataarray = data.split(",");
            $("#ddlStorageArea").val(dataarray).prop("disabled", "disabled");
            $("#ddlStorageArea").multiselect("refresh");
            jQuery("#titleMode").text('Mode:-View');
            $("#ddlStorageArea").multiselect("disable");
            $("#ddlTransferIndi").val(jsonData[0].cTransferIndi.trim()).prop("disabled", "disabled");
            $("#ddlTransferIndi").prop("disabled", "disabled");
            $("#ddlProductType").prop("disabled", "disabled");
            $("#txtNoOfContainers").val(jsonData[0].iNoOfContainers).prop("disabled", "disabled");
            $(".multiselect").prop('disabled', 'disabled');

        }
    }
}


function pmsStudyViewAuthenticate(e) {
    nTransactionNoQA = "";
    nTransactionDtlNoQA = "";
    nTransactionNoQA = $(e).attr("nTransactionNo");
    nTransactionDtlNoQA = $(e).attr("nSPTransactionDtlNo");
    var cIsQAReview = $(e).attr("cIsQAReview");

    if (cIsQAReview == 'Y') {
        return;
    }
    else {
        $('#ViewAuthenticate').modal('show');
    }
}

$("#btnOk").on("click", function () { 
    pwd = $("#txtPassword").val();
    TransferIndi = "P";
    if (isBlank(document.getElementById('txtRemark').value)) {
        ValidationAlertBox("Please enter Remarks.", "txtRemarks", ModuleName);
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
        vDocTypeCode: 'ZARC',
        cTransferIndi: TransferIndi,
        sessionPass: $("#hdnPassword").val(),
        Password: $("#txtPassword").val(),
        iUserId: $("#hdnuserid").val(),

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
            
            if (jsonData == "success") {
                $("#ViewAuthenticate").hide();
                $("#txtRemark").val('');
                $("#txtPassword").val('');
                GetDashBoardData();
                SuccessorErrorMessageAlertBox("Product Archive reviewed successfully.", ModuleName);
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
        vDocTypeCode: 'ZARC',
        sessionPass: $("#hdnPassword").val(),
        Password: $("#txtPassword").val(),
        vQARemarks: $("#txtRemark").val(),
        cIsQAReview: 'R',
        iUserId: $("#hdnuserid").val(),
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
            
            if (jsonData == "success") {
                $("#ViewAuthenticate").hide();
                $("#txtRemark").val('');
                $("#txtPassword").val('');
                SuccessorErrorMessageAlertBox("Product Archive rejected successfully.", ModuleName);
                GetDashBoardData();
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
  
    var regExp = /[a-z]/i;
    var value = String.fromCharCode(e.which) || e.key;
    if (regExp.test(value)) {
        e.preventDefault();
        return false;
    }
});

$("#txtUnusedQuantity").on('keypress', function (e) {
  
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