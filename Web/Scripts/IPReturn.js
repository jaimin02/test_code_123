var productIds = new Object();
var setworkspaceid = "";
var vnProductNo;
var flag;
var ModuleName = "IP Return/Adjustment";
var TransferIndi = "";
var SaveContinueFlag;
var viewmode;
var reexpirydate = "";
var nTransactionNoQA = "";
var nTransactionDtlNoQA = "";
var vProjectNo = "";
var UserTypeCode;

$(document).ready(function () {

    UserTypeCode = $("#hdnUserTypeCode").val();

    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('.modal').modal('hide');

    CheckSetProject();

    if (setworkspaceid != "") {
        BindData();
    }

    $("#spnwelcome").html($("#hdnusername").val());
    $("#spnLoginTime").html($("#hdnlogintime").val());
    $("#tblStudyProductReceiptAdd").hide();
    $('#ExpiryDate').datepicker({ format: 'dd-MM-yyyy', autoclose: true });
    //$("#RecdQty").prop('disabled', '');
    $("#divexport").css("visibility", "hidden");

    GetViewMode();

    var GetProjectNo = {
        Url: BaseUrl + "PmsGeneral/ProjectNumber",
        SuccessMethod: "SuccessMethod"
    }

    $('#ddlProjectNodashboard').on('change keyup paste mouseup', function () {

        if ($('#ddlProjectNodashboard').val().length == 2) {
            var ProjectNoDataTemp = {
                vWorkSpaceID: $('#ddlProjectNodashboard').val(),
                iUserId: $("#hdnuserid").val(),
                vProjectTypeCode: $("#hdnscopevalues").val(),
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
                    //$('#ddlProjectNodashboard').blur();
                },
            });
        }
    });

    //Get Transaport Mode
    var GetAllTransportMode = {
        //Url: BaseUrl + "PmsGeneral/GetAllTransportMode",  ''' Chnage Fo Location Wise
        Url: BaseUrl + "PmsTransporterMaster/AllTransporterData",
        SuccessMethod: "SuccessMethod"
    }
    GetPmsProductReceiptTransportMode(GetAllTransportMode.Url, GetAllTransportMode.SuccessMethod, "No");

    $("#btnSavePmsProductReceipt").on("click", function () {
        //$("#btnSavePmsProductReceipt").hide();
        //$("#btnSaveContinuePmsProductReceipt").hide();
        $("#loader").attr("style", "display:block");
        if (productIds[$('#ProjectNo').val()] != undefined) {
            setworkspaceid = productIds[$('#ProjectNo').val()];
        }
        var CheckOrNot = "1";

        // check qty for StudyProductBatchStockMst
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
        var dataCheck = HTMLtbl.getData($('#tblStudyProductReceiptAdd'));
        for (i = 0; i < dataCheck.length; i++) {
            var storedatacheck = dataCheck[i];
            var checkqtydata =
            {
                vWorkSpaceId: setworkspaceid,
                nProductNo: storedatacheck[7],
                nStudyProductBatchNo: storedatacheck[9],
                nStorageLocationNo: $("#StorageName :selected").val(),
                iQty: storedatacheck[3],
            }
            var checkqtydata1 = {
                Url: BaseUrl + "IPReturn/Proc_CheckforSSAN_StudyProductBatchStockMst",
                SuccessMethod: "SuccessMethod",
                Data: checkqtydata
            }
            $.ajax({
                url: checkqtydata1.Url,
                type: 'POST',
                async: false,
                data: checkqtydata1.Data,
                success: Successcheckqtydata,
                error: function () {
                    ValidationAlertBox("Error to check for IPReturn qty in StudyProductBatchStockMst.", "RecdQty", ModuleName);
                    return false;
                }
            });

            function Successcheckqtydata(response) {
                if (response == "N") {
                    ValidationAlertBox("Record not found in StudyProductBatchStockMst for selected product and storage location.", "RecdQty", ModuleName);
                    CheckOrNot = "0";
                    return false;
                } else if (response != "Y" && response != "N") {
                    ValidationAlertBox("IPReturn qty not more than " + response + ".", "RecdQty", ModuleName);
                    CheckOrNot = "0";
                    return false;
                }
            }
        }
        // end
        if (CheckOrNot == "1") {

            var ntransactionno = $("#nTransactionno").val();
            var nspttransactiondtlno = $("#nSPTTransactionDtlNo").val();
            var purpose = "";

            if (ntransactionno == "" && nspttransactiondtlno == "") {
                var InsertPmsProductReceipt1 = {
                    vWorkSpaceId: setworkspaceid,
                    nStorageLocationNo: $("#StorageName").val(),
                    vReceivedFrom: $("#RecdFromLocation").val(),
                    vReceiptRefNo: $("#RefNo").val(),
                    vShipmentNo: "",
                    iModifyBy: $("#hdnuserid").val(),
                    vDocTypeCode: "ASAN",
                    nTransactionNo: "1",
                    nTransporterNo: 0,
                    vOtherTransportName: "",
                    dReceiptDate: $("#txtReceiptDateTime").val(),
                    nProductTypeID: $("#ddlProductType :selected").val(),
                    cSaveContinueFlag: "S",
                    vConditionofPackRecd: $("#txtConditionofPackRecd").val(),
                    cTransferIndi: TransferIndi,
                    cReceiptType: "",
                }
            }
            else if (ntransactionno != "" && nspttransactiondtlno != "") {
                var InsertPmsProductReceipt1 = {
                    vWorkSpaceId: setworkspaceid,
                    nStorageLocationNo: $("#StorageName").val(),
                    vReceivedFrom: $("#RecdFromLocation").val(),
                    vReceiptRefNo: $("#RefNo").val(),
                    vShipmentNo: "",
                    iModifyBy: $("#hdnuserid").val(),
                    vDocTypeCode: "ASAN",
                    nTransactionNo: $("#nTransactionno").val(),
                    nTransporterNo: 0,
                    vOtherTransportName: "",
                    dReceiptDate: $("#txtReceiptDateTime").val(),
                    nProductTypeID: $("#ddlProductType :selected").val(),
                    cSaveContinueFlag: "S",
                    DataOPMode: 3,
                    vConditionofPackRecd: $("#txtConditionofPackRecd").val(),
                    cTransferIndi: TransferIndi,
                    cReceiptType: "",
                }
            }

            var InsertProductReceiptData = {
                Url: BaseUrl + "IPReturn/InsertPmsProductReceiptHeader",
                SuccessMethod: "SuccessMethod",
                Data: InsertPmsProductReceipt1
            }

            if (ValidateForm() == false) { }
            else {
                InsertPmsProductReceiptMaster(InsertProductReceiptData.Url, InsertProductReceiptData.SuccessMethod, InsertProductReceiptData.Data);
                if (setworkspaceid != "") {
                    GetDashBoardData();
                }
            }
            $("#loader").attr("style", "display:none");
        }
    });

    $('#StorageArea').multiselect({
        nonSelectedText: 'Please Select StorageArea',
        buttonClass: 'form-control',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        numberDisplayed: 2,
    });

    $('#txtReceiptDateTime').datetimepicker({
        //maxDate: new Date(),
        format: 'DD-MMMM-YYYY HH:mm',
        showClose: true,
    });

    $('#COADate').datepicker({ format: 'dd-MM-yyyy', autoclose: true });
    $('#GMPDate').datepicker({ format: 'dd-MM-yyyy', autoclose: true });

    //$('#COADate').datetimepicker({
    //    format: 'DD-MMMM-YYYY HH:mm',
    //    showClose: true,
    //});
    //$('#GMPDate').datetimepicker({
    //    format: 'DD-MMMM-YYYY HH:mm',
    //    showClose: true,
    //});

});

function TransferIndication(SaveContinueFlag) {
    TransferIndi = $("#ddlTransferIndi").val();
    var TempProductType = $("#ddlProductType").val();

    if (TransferIndi == "P") {
        if (TempProductType != '0') {
            $(".hideproduct").attr('style', 'display:inline');

            $("#divRecdQty").attr('style', 'display:inline');
            $("#divUnit").attr('style', 'display:none');
            $(".hidekit").attr('style', 'display:none');
            //$("#RecdQty").attr('disabled', 'disabled');
            jQuery("#lblRecdQty").text('Qty *');
            $("#RecdQty").attr("placeholder", "Qty")
            if (SaveContinueFlag != true) {
                GetProductName();
            }
        }
    }
    else if (TransferIndi == "K") {
        if (TempProductType != '0') {
            $(".hideproduct").attr('style', 'display:none');
            $("#divRecdQty").attr('style', 'display:inline');
            $("#divUnit").attr('style', 'display:none');
            $(".hidekit").attr('style', 'display:inline');
            //$("#RecdQty").prop('disabled', '');
            jQuery("#lblRecdQty").text('Qty *');
            $("#RecdQty").attr("placeholder", "Qty")
        }
    }
    else {
        $(".hideproduct").attr('style', 'display:none');
        $(".hidekit").attr('style', 'display:none');
        $("#divRecdQty").attr('style', 'display:none');
        $("#divUnit").attr('style', 'display:none');
    }
    $("#BatchLotNo").prop('disabled', false);
    //$("#NoofBoxes").prop('disabled', false);

}

$("#ddlTransferIndi").on("change", function () {
    TransferIndi = $("#ddlTransferIndi").val();

    TransferIndication();
    if (TransferIndi == "K") {
        CheckProductOrBatchForKit();
        $("#divTransferReceiptType").attr('style', 'display:none');
    }
    else if (TransferIndi == "P") {
        $("#divTransferReceiptType").attr('style', 'display:none');
    }
});

function CheckProductOrBatchForKit() {
    if ($("#ddlProductType").val() == "0") {
        ValidationAlertBox("Please select Product Type.", "ddlProjectNodashboard", ModuleName);
        $("#ddlTransferIndi").val("0")
        return false;
    }

    if (productIds[$('#ddlProjectNodashboard').val()] != undefined) {
        setworkspaceid = productIds[$('#ddlProjectNodashboard').val()];
    }

    var GetProductNameData = {
        vWorkSpaceId: setworkspaceid,
        nProductTypeID: $("#ddlProductType").val(),
        cTransferIndi: TransferIndi
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
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("Product not found.", "ddlProductType", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        var nProductNo = "";
        if (jsonData.length > 0) {
            nProductNo = jsonData[0].nProductNo;

            var GetPmsStudyReceiptBatchLotNo = {
                Url: BaseUrl + "IPReturn/GetBatchLotNo",
                SuccessMethod: "SuccessMethod"
            }
            $.ajax({
                url: GetPmsStudyReceiptBatchLotNo.Url,
                type: 'GET',
                async: false,
                success: function (jsonData) {
                    if (jsonData.length > 0) {
                        $("#ExpiryDate").val(jsonData[0].ExpiryDate);
                    }
                    else {
                        ValidationAlertBox("Please fill Study Product Batch data.", "ddlTransferIndi", ModuleName);
                        $('#ddlTransferIndi').val("0");
                    }
                },
                data: { id: setworkspaceid, projectno: nProductNo },
                error: function () {
                    ValidationAlertBox("Batch/Lot/Lot No not found.", "Product", ModuleName);
                }
            });
        }
        else {
            ValidationAlertBox("Please fill Study Product data.", "ddlTransferIndi", ModuleName);
            $('#ddlTransferIndi').val("0");
        }
    }
}

$("#TransportMode").on("change", function () {
    var Transportmodename = $("#TransportMode :selected").text();
    if (Transportmodename.toLowerCase() == 'other') {
        $("#divOtherTransportMode").hide();
        vOtherTransportMode.focus();
    }
    else {
        $("#divOtherTransportMode").hide();
    }
});

$("#btnCloseRemark").on("click", function () {
    $("#btnSaveContinuePmsProductReceipt").hide();
});

$("#btnClearPmsProductReceipt").on("click", function () {
    clearheaderpart();
    cleardetailspart();
    $("#btnAddTempProduct").show();
    $("#tblStudyProductReceiptAdd tbody tr").remove();
    $("#tblStudyProductReceiptAdd thead").hide();
    $('#txtReason').val("");
    $("#ProductReceiptRemarks").modal('hide');
});

$("#btnExitPmsProductReceipt").on("click", function () {
    ConfirmAlertBox(ModuleName);
});

$("#ddlProjectNodashboard").on("blur", function () {
    BindData();
});

$("#Product").on("change", function () {
    flag = "Y"
    GetBatchLotNo();
});

$("#BatchType").on("change", function () {
    GetBatchLotNo();
});

$("#BatchLotNo").on("change", function () {
    GetExpiryDate();
});

$("#ddlProductType").on("change", function () {
    TransferIndi = $("#ddlTransferIndi").val();
    var TempProductType = $("#ddlProductType").val();

    if (TempProductType != "0") {
        if (TransferIndi == "P") {
            $(".hideproduct").attr('style', 'display:inline');
            $("#divRecdQty").attr('style', 'display:inline');
            $("#divUnit").attr('style', 'display:none');
            $(".hidekit").attr('style', 'display:none');
            //$("#RecdQty").attr('disabled', 'disabled');
            jQuery("#lblRecdQty").text('Qty *');
            $("#RecdQty").attr("placeholder", "Qty")
            GetProductName();

            if (ReceiptType == "T") {
                GetTransferQtyForReceipt();
            }
            else {
                $("#RecdQty").val("");
                $("#NoofBoxes").val("");
                $("#NoofBoxes").prop('disabled', '');
                $("#NoofQty").val("");
                $("#NoofQty").prop('disabled', '');
            }
        }
        else if (TransferIndi == "K") {
            //$("#ddlTransferIndi").val("0")
            $(".hideproduct").attr('style', 'display:none');
            $("#divRecdQty").attr('style', 'display:inline');
            $("#divUnit").attr('style', 'display:none');
            $(".hidekit").attr('style', 'display:inline');
            $("#RecdQty").prop('disabled', '');
            jQuery("#lblRecdQty").text('Qty *');
            $("#RecdQty").attr("placeholder", "Qty")
        }
        else {
            $(".hideproduct").attr('style', 'display:none');
            $(".hidekit").attr('style', 'display:none');
            $("#divRecdQty").attr('style', 'display:none');
            $("#divUnit").attr('style', 'display:none');
        }
    }
    else {
        $(".hideproduct").attr('style', 'display:none');
        $(".hidekit").attr('style', 'display:none');
        $("#divRecdQty").attr('style', 'display:none');
        $("#divUnit").attr('style', 'display:none');
    }
});

$("#btnSave").on("click", function () {
    SaveandContinue();
});

$("#btnSaveContinuePmsProductReceipt").on("click", function () {
    $("#btnSaveContinuePmsProductReceipt").hide();
    $("#loader").attr("style", "display:block");
    var ntransactionno = $("#nTransactionno").val();
    var nspttransactiondtlno = $("#nSPTTransactionDtlNo").val();

    if (ntransactionno == "" && nspttransactiondtlno == "") {
        SaveandContinue();
    }
    else if (ntransactionno != "" && nspttransactiondtlno != "") {
        $('#txtReason').prop('disabled', false);
        $('#txtReason').val("");
        $("#ProductReceiptRemarks").modal('show');
    }
    $("#loader").attr("style", "display:none");
});

$("#btnAddStudyProduct").on("click", function () {
    $(".headercontrol").prop('disabled', '');
    $("#lblRemarks").text("Remarks *");
    if (isBlank(document.getElementById('ddlProjectNodashboard').value)) {
        $("#btnSaveContinuePmsProductReceipt").hide();
        $("#btnSavePmsProductReceipt").show();
        ValidationAlertBox("Please enter Project No.", "ddlProjectNodashboard", ModuleName);
        return false;
    }

    $("#ProjectNo").val($("#ddlProjectNodashboard").val())
    $("#ProjectNo").prop('disabled', 'disabled');
    jQuery("#titleMode").text('Mode:-Add');
    jQuery("#spnSaveProductReceipt").text('Save');
    jQuery("#spnSaveContinue").text('Save & Continue');
    if (UserTypeCode == ViewOnlyUser) {
        $("#btnAddTempProductReceipt").hide();
    }
    else {
        $("#btnAddTempProductReceipt").show();
    }
    $("#tblStudyProductReceiptAdd tbody tr").remove();
    $("#tblStudyProductReceiptAdd thead").hide();
    $("#btnSavePmsProductReceipt").hide();
    $("#btnSaveContinuePmsProductReceipt").hide();
    $("#divOtherTransportMode").hide();

    clearData();
    GetProductType();
    TransferIndication();
    //Get Transaport Mode
    var GetAllTransportMode = {
        //Url: BaseUrl + "PmsGeneral/GetAllTransportMode",  ''' Chnage Fo Location Wise
        Url: BaseUrl + "PmsTransporterMaster/AllTransporterData",
        SuccessMethod: "SuccessMethod"
    }
    GetPmsProductReceiptTransportMode(GetAllTransportMode.Url, GetAllTransportMode.SuccessMethod, "No");


    var GETStorageArea = {
        Url: BaseUrl + "PmsGeneral/ALLStorageAreaData",
        SuccessMethod: "SuccessMethod"
    }
    var FilterData = {
        nStorageTypeId: $("#StorageName :selected").val(),
        vLocationCode: $("#hdnUserLocationCode").val(),
    }
    GetPmsProductReceiptStorageArea(GETStorageArea.Url, FilterData);
    document.getElementById('divTransferReceiptType').style.display = "none";
    $("#ddlPurpose").val('Please Select Purpose');
    $("#divCOAdate").hide();
    $("#divGMPdate").hide();
    $("#divTempNumber").hide();

});

$("#btnAddTempProductReceipt").on("click", function () {
    //if ($("#ddlTransferIndi").val() == "0") {
    //    ValidationAlertBox("Please Select Product Indication !", "ddlTransferIndi", ModuleName);
    //    return false;
    //}

    //if (TransferIndi == "K") {
    //    if (isBlank(document.getElementById('txtNoofKit').value)) {
    //        ValidationAlertBox("Please Enter No of Kit !", "txtNoofKit", ModuleName);
    //        return false;
    //    }
    //}

    AddTempPmsProductReceiptData();
    if ($("#tblStudyProductReceiptAdd tbody tr").length != 0) {
        $(".headercontrol").attr('disabled', 'disabled');
    }
    else {
        $(".headercontrol").prop('disabled', '');
    }
});

var GetPmsProductReceiptStorageArea = function (Url, FilterData) {
    $('#StorageArea option').each(function () {
        $(this).remove();
    });

    $.ajax({
        url: Url,
        type: 'POST',
        async: false,
        data: FilterData,
        success: function (jsonData) {
            $("#StorageArea").multiselect("clearSelection");
            $("#StorageArea").multiselect('refresh');
            if (jsonData.length > 0) {
                for (var i = 0; i < jsonData.length; i++) {
                    $("#StorageArea").append($("<option></option>").val(jsonData[i].nStorageAreaNo).html(jsonData[i].vStorageAreaName + " | " + jsonData[i].vCompartmentName + " | " + jsonData[i].vRackName));
                    $('#StorageArea').multiselect('rebuild');
                }
            }
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Storage Area not found.", ModuleName);
        }
    });
}

//Get Project No
var GetPmsProjectNoProductReceipt = function (Url, SuccessMethod, ProjectNoDataTemp) {
    $.ajax({
        url: Url,
        type: 'POST',
        data: ProjectNoDataTemp,
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
            sourceArr.push("[ " + jsonObj[i].vProjectNo + " ]" + " " + jsonObj[i].vRequestId);
            productIds["[ " + jsonObj[i].vProjectNo + " ]" + " " + jsonObj[i].vRequestId] = jsonObj[i].vWorkspaceId;
        }
        $("#ddlProjectNodashboard").autocomplete({
            source: sourceArr,
            change: function (event, ui) { },
            select: function (event, ui) {
                vProjectNo = ui.item.value;
                $('#ddlProjectNodashboard').val(vProjectNo);
                BindData();
                //$('#ddlProjectNodashboard').blur();
            },
        });
    }
}

//Get All Transport Mode
var GetPmsProductReceiptTransportMode = function (Url, SuccessMethod, value) {
    var FilterData = {
        vLocationCode: $("#hdnUserLocationCode").val()
    }
    $.ajax({
        url: Url,
        type: 'POST',
        async: false,
        data: FilterData,
        success: function (jsonData) {
            if (jsonData.length > 0) {
                $("#TransportMode").empty().append('<option selected="selected" value="0">Please Select Transporter Name</option>');
                for (var i = 0; i < jsonData.length; i++) {
                    if (value == "No") {
                        if (jsonData[i].cStatusIndi != 'D') {
                            $("#TransportMode").append($("<option></option>").val(jsonData[i].nTransporterNo).html(jsonData[i].vTransporterName));
                        }
                    }
                    else if (value == "Yes") {
                        $("#TransportMode").append($("<option></option>").val(jsonData[i].nTransporterNo).html(jsonData[i].vTransporterName));
                    }

                }
            }
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Transporter not found.", ModuleName);
        }
    });
}

// Get Storage Name As Per Project No
function GetStorageName() {
    var GetPmsStoragename = {
        Url: BaseUrl + "IPReturn/GetStoragename",
        SuccessMethod: "SuccessMethod"
    }
    $.ajax({
        url: GetPmsStoragename.Url,
        type: 'GET',
        success: function (jsonData) {
            if (jsonData.length > 0) {
                $("#StorageName").append('<option selected="selected" value="0">Please Select Storage Name</option>');
                for (var i = 0; i < jsonData.length; i++) {
                    $("#StorageName").append($("<option></option>").val(jsonData[i].nStorageTypeId).html(jsonData[i].vStorageType));
                }
                //$("#StorageName").prop('disabled', 'disabled');
            }
            else {
                $("#StorageName").empty().append('<option selected="selected" value="0">Please Select Storage Name</option>');
            }
        },
        async: false,
        error: function () {
            SuccessorErrorMessageAlertBox("Storage Area not found.", ModuleName);
        }
    });
}

function AddTempPmsProductReceiptData() {
    var storagearea = $("#StorageArea").val();
    var PurposeName = "";
    var COADate = "";
    var GMPDate = "";
    var TempNumber = "";
    reexpirydate = "";


    if (storagearea == null) {
        storagearea = "0";
    }
    else {
        storagearea = $("#StorageArea").val().toString();
    }

    if ($("#ddlPurpose :selected").text().toLowerCase() == "other") {
        PurposeName = $("#vOtherPurpose").val()
    }
    else {
        PurposeName = $("#ddlPurpose :selected").text()
    }

    var txtreceiptdate = document.getElementById('txtReceiptDateTime').value;
    var abc = txtreceiptdate.split(" ");
    if (CheckDateMoreThenToday(abc[0])) {
        txtReceiptDateTime.value = "";
        ValidationAlertBox("Receipt Date & Time should not be greater than Current Date & Time.", "txtReceiptDateTime", ModuleName);
        return false;
    }
    var strdata = "";
    if ($("#ddlCoaRecd").val() == 'Y') {
        COADate = $("#COADate").val()
    }
    else {
        COADate = "";
    }

    if ($("#ddlGmpRecd").val() == 'Y') {
        GMPDate = $("#GMPDate").val()
    }
    else {
        GMPDate = "";
    }

    if ($("#ddlTempRecd").val() == 'Y') {
        TempNumber = $("#tempNumber").val()
    }
    else {
        TempNumber = "";
    }

    if (ValidateForm() == false) { }
    else
    {
        //check validation for same product and batch not add multipal time
        if ($("#ddlTransferIndi").val() == "P") {
            var data = $('table#tblStudyProductReceiptAdd').find('tbody').find('tr');
            for (i = 0; i < data.length; i++) {
                if ($("#Product :selected").text() == $(data[i]).find('td:eq(0)').html()
                    && $("#BatchLotNo :selected").text() == $(data[i]).find('td:eq(1)').html()) {
                    ValidationAlertBox($("#Product :selected").text() + " product already exist in below table.", "Product", ModuleName);
                    return false;
                    break;
                }
            }
        }
        //end
        // check qty for StudyProductBatchStockMst
        var CheckOrNot = "1";
        var checkqtydata =
        {
            vWorkSpaceId: setworkspaceid,
            nProductNo: $("#Product :selected").val(),
            nStudyProductBatchNo: $("#BatchLotNo :selected").val(),
            nStorageLocationNo: $("#StorageName :selected").val(),
            iQty: $("#RecdQty").val(),
        }
        var checkqtydata1 = {
            Url: BaseUrl + "IPReturn/Proc_CheckforSSAN_StudyProductBatchStockMst",
            SuccessMethod: "SuccessMethod",
            Data: checkqtydata
        }
        $.ajax({
            url: checkqtydata1.Url,
            type: 'POST',
            async: false,
            data: checkqtydata1.Data,
            success: Successcheckqtydata,
            error: function () {
                ValidationAlertBox("Error to check for IPReturn qty in StudyProductBatchStockMst.", "RecdQty", ModuleName);
                return false;
            }
        });

        function Successcheckqtydata(response) {
            if (response == "N") {
                ValidationAlertBox("Record not found in StudyProductBatchStockMst for selected product and storage location.", "RecdQty", ModuleName);
                CheckOrNot = "0";
                return false;
            } else if (response != "Y" && response != "N") {
                ValidationAlertBox("IPReturn qty not more than " + response + ".", "RecdQty", ModuleName);
                CheckOrNot = "0";
                return false;
            }
        }
        // end
        if (CheckOrNot == "1") {


            strdata += "<tr>";
            strdata += "<td class='hideproduct'>" + $("#Product :selected").text() + "</td>";
            strdata += "<td class='hideproduct'>" + $("#BatchLotNo :selected").text() + "</td>";
            strdata += "<td>" + $("#ExpiryDate").val() + "</td>";
            strdata += "<td>" + $("#RecdQty").val() + "</td>";
            strdata += "<td class='hidekit'>" + $("#txtNoofKit").val() + "</td>";
            strdata += "<td class='hidetd'>" + $("#NoofBoxes").val() + "</td>";
            strdata += "<td class='hidetd'>" + $("#NoofQty").val() + "</td>";
            strdata += "<td class='hidetd'>" + $("#Product :selected").val() + "</td>";
            strdata += "<td class='hidetd'>" + storagearea + "</td>";
            strdata += "<td class='hidetd'>" + $("#BatchLotNo :selected").val() + "</td>";
            strdata += "<td class='hidetd'>" + $("#ddlConditionofProducts").val() + "</td>";
            strdata += "<td>" + $("#txtRemarks").val() + "</td>";
            strdata += "<td id='trRemove'><span class='glyphicon glyphicon-remove'></span></td>";
            strdata += "<td class='hidetd'>" + $("#txtVerifyQuantityRecd").val() + "</td>";
            strdata += "<td class='hidetd'>" + $("#txtNoOfContainers").val() + "</td>";
            strdata += "<td class='hidetd'>" + $("#ddlTempRecd :selected").val() + "</td>";
            strdata += "<td class='hidetd'>" + $("#ddlCoaRecd :selected").val() + "</td>";
            strdata += "<td class='hidetd'>" + $("#ddlGmpRecd :selected").val() + "</td>";
            strdata += "<td class='hidetd'>" + COADate + "</td>";
            strdata += "<td class='hidetd'>" + GMPDate + "</td>";
            strdata += "<td class='hidetd'>" + PurposeName + "</td>";
            strdata += "<td class='hidetd'>" + TempNumber + "</td>";
            strdata += "<td class='hidetd'>" + $("#ddlUnit :selected").text() + "</td>";

            strdata += "</tr>";

            $("#tbodyStudyProductReceiptAdd").append(strdata);
            $("#tblStudyProductReceiptAdd thead").show();
            $("#tblStudyProductReceiptAdd tbody tr").show();
            $("#tblStudyProductReceiptAdd").show();
            $("#btnSavePmsProductReceipt").show();
            $("#btnSaveContinuePmsProductReceipt").hide();
            $(".hidetd").hide();
            cleardetailspart();

            if (TransferIndi == "P") {
                $(".hideproduct").removeAttr("style");
                $(".hidekit").attr("style", "display:none");
            }
            else if (TransferIndi == "K") {
                $(".hidekit").removeAttr("style");
                $(".hideproduct").attr("style", "display:none");
            }
        }
    }
}

function clearData() {
    clearheaderpart();
    cleardetailspart();
}

var InsertPmsProductReceiptMaster = function (Url, SuccessMethod, Data) {
    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        success: SuccessInsertData,
        async: false,
        error: function () {
            SuccessorErrorMessageAlertBox("Data not found.", ModuleName);
        }
    });

    function SuccessInsertData(response) {
        if ($("#ddlTransferIndi").val() == "P") {
            InsertTrnasactionDtlForProduct(response);
        }
        else if ($("#ddlTransferIndi").val() == "K") {
            InsertTrnasactionDtlForKit(response);
        }
    }
}

function InsertTrnasactionDtlForProduct(response) {
    var PurposeName = "";
    var COADate = "";
    var TempNumber = "";
    var GMPDate = "";
    var cIsExpDate = "";
    var ntransactionno = $("#nTransactionno").val();
    var nspttransactiondtlno = $("#nSPTTransactionDtlNo").val();

    if ($("#ExpiryDate").val() != "") {
        if ($("#ExpiryDate").val().split("-").length == 3) {
            var cIsExpDate = 'D';
        }
        else {
            cIsExpDate = 'M';

        }
    }
    else {
        cIsExpDate = 'D';
    }

    if (ntransactionno == "" && nspttransactiondtlno == "") {
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

        var data = HTMLtbl.getData($('#tblStudyProductReceiptAdd'));
        var StoreData = [];
        for (i = 0; i < data.length; i++) {
            var storedata = data[i];
            var InsertPmsProductReceipt2 =
            {
                nTransactionNo: response,
                //nSrNo: "1",
                nProductNo: storedata[7],
                nStudyProductBatchNo: storedata[9],
                iReceivedQty: storedata[3],
                iNoOfBoxes: 0,
                iNoOfQtyBox: 0,
                dExpiryDate: storedata[2],
                iModifyBy: $("#hdnuserid").val(),
                vStorageArea: storedata[8],
                vWorkSpaceId: setworkspaceid,
                vDocTypeCode: "ASAN",
                vGRNNO: $("#RefNo").val(),
                nStorageLocationNo: $("#StorageName :selected").val(),
                cProductFlag: "Q",
                cLocationIndicator: "Q",
                vRefModule: "SR",
                cConditionProducts: storedata[10],
                vRemarks: storedata[11],
                cSaveContinueFlag: "S",
                vVerificationofQtyRecd: storedata[13],
                cAddSub: "S",
                nNoofKit: storedata[4],
                cTransferIndi: TransferIndi,
                cKitReceivedStatus: 'M',
                iNoOfContainers: storedata[14],
                cIsTempRecd: storedata[15],
                cIsCOARecd: storedata[16],
                cIsGMPRecd: storedata[17],
                dCOAdate: storedata[18],
                dGMPdate: storedata[19],
                vPurpose: storedata[20],
                nTempNumber: storedata[21],
                vUnit: storedata[22],
                cIsExpDate: cIsExpDate,
                vBatchLotNo: storedata[1],
                nToStorageLocationNo: $("#StorageName :selected").val(),

            }

            var InsertProductReceiptData2 = {
                Url: BaseUrl + "IPReturn/InsertPmsProductReceiptDetails",
                SuccessMethod: "SuccessMethod",
                Data: InsertPmsProductReceipt2
            }

            $.ajax({
                url: InsertProductReceiptData2.Url,
                type: 'POST',
                async: false,
                data: InsertProductReceiptData2.Data,
                success: SuccessInsertDataReceipt,
                error: function () {
                    SuccessorErrorMessageAlertBox("Error to save data in details portion.", ModuleName);
                    return false;

                }
            });

            function SuccessInsertDataReceipt(response) {
                clearData();
                $("#tblStudyProductReceiptAdd thead").hide();
                $("#tblStudyProductReceiptAdd tbody tr").remove();
                $("#btnSavePmsProductReceipt").hide();
                ProjectNo.focus();
                GetDashBoardData();


            }
        }
        SuccessorErrorMessageAlertBox("IP Return/Adjustment saved successfully.", ModuleName);
    }
    else if (ntransactionno != "" && nspttransactiondtlno != "") {
        var storagearea = $("#StorageArea").val();
        if (storagearea == null) {
            storagearea = "0";
        }
        else {
            storagearea = $("#StorageArea").val().toString();
        }

        if ($("#ddlPurpose :selected").text().toLowerCase() == "other") {
            PurposeName = $("#vOtherPurpose").val()
        }
        else {
            PurposeName = $("#ddlPurpose :selected").text()
        }

        if ($("#ddlCoaRecd").val() == 'Y') {
            COADate = $("#COADate").val()
        }
        else {
            COADate = "";
        }

        if ($("#ddlGmpRecd").val() == 'Y') {
            GMPDate = $("#GMPDate").val()
        }
        else {
            GMPDate = "";
        }

        if ($("#ddlTempRecd").val() == 'Y') {
            TempNumber = $("#tempNumber").val()
        }
        else {
            TempNumber = "";
        }

        var InsertPmsProductReceipt2 =
            {
                nTransactionNo: $("#nTransactionno").val(),
                nTransactionDtlNo: $("#nSPTTransactionDtlNo").val(),
                nProductNo: $("#Product :selected").val(),
                nStudyProductBatchNo: $("#BatchLotNo :selected").val(),
                iReceivedQty: $("#RecdQty").val(),
                iNoOfBoxes: 0,
                iNoOfQtyBox: 0,
                dExpiryDate: $("#ExpiryDate").val(),
                iModifyBy: $("#hdnuserid").val(),
                vStorageArea: storagearea,
                vWorkSpaceId: setworkspaceid,
                vDocTypeCode: "ASAN",
                vGRNNO: $("#RefNo").val(),
                nStorageLocationNo: $("#StorageName :selected").val(),
                cProductFlag: "Q",
                cLocationIndicator: "Q",
                vRefModule: "SR",
                cConditionProducts: $("#ddlConditionofProducts").val(),
                vRemarks: $("#txtRemarks").val(),
                cSaveContinueFlag: "S",
                DataOPMode: "2",
                vVerificationofQtyRecd: $("#txtVerifyQuantityRecd").val(),
                cAddSub: "S",
                cKitReceivedStatus: 'M',
                iNoOfContainers: $("#txtNoOfContainers").val(),
                cIsTempRecd: $("#ddlTempRecd").val(),
                cIsCOARecd: $("#ddlCoaRecd").val(),
                cIsGMPRecd: $("#ddlGmpRecd").val(),
                dCOAdate: COADate,
                dGMPdate: GMPDate,
                vPurpose: PurposeName,
                nTempNumber: TempNumber,
                vUnit: $("#ddlUnit").val(),
                cIsExpDate: cIsExpDate,
                vBatchLotNo: $("#BatchLotNo :selected").text(),
                nToStorageLocationNo: $("#StorageName :selected").val(),

            }

        var InsertProductReceiptData2 = {
            Url: BaseUrl + "IPReturn/InsertPmsProductReceiptDetails",
            SuccessMethod: "SuccessMethod",
            Data: InsertPmsProductReceipt2
        }

        $.ajax({
            url: InsertProductReceiptData2.Url,
            type: 'POST',
            data: InsertProductReceiptData2.Data,
            success: SuccessInsertDataReceipt,
            error: function () {
                SuccessorErrorMessageAlertBox("Error to save data in details portion.", ModuleName);
                return false;
            }
        });

        function SuccessInsertDataReceipt(response) {
            clearData();
            $("#tblStudyProductReceiptAdd thead").hide();
            $("#tblStudyProductReceiptAdd tbody tr").remove();
            $("#btnSavePmsProductReceipt").hide();
            ProjectNo.focus();
            GetDashBoardData();
            SuccessorErrorMessageAlertBox("IP Return/Adjustment saved successfully.", ModuleName);

        }
    }
}

function InsertTrnasactionDtlForKit(response) {
    var ntransactionno = $("#nTransactionno").val();
    var nspttransactiondtlno = $("#nSPTTransactionDtlNo").val();

    if (ntransactionno == "" && nspttransactiondtlno == "") {
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

        var data = HTMLtbl.getData($('#tblStudyProductReceiptAdd'));
        var StoreData = [];

        for (i = 0; i < data.length; i++) {
            //Start for
            var storedata = data[i];
            for (j = 0 ; j < parseInt(storedata[4]) ; j++) {
                var InsertPmsProductReceipt2 =
                {
                    nTransactionNo: response,
                    nProductNo: storedata[7],
                    nStudyProductBatchNo: storedata[9],
                    iReceivedQty: storedata[3],
                    iNoOfBoxes: 0,
                    iNoOfQtyBox: 0,
                    dExpiryDate: storedata[2],
                    iModifyBy: $("#hdnuserid").val(),
                    vStorageArea: storedata[8],
                    vWorkSpaceId: setworkspaceid,
                    vDocTypeCode: "ASAN",
                    vGRNNO: $("#RefNo").val(),
                    nStorageLocationNo: $("#StorageName :selected").val(),
                    cProductFlag: "Q",
                    cLocationIndicator: "Q",
                    vRefModule: "SR",
                    cConditionProducts: storedata[10],
                    vRemarks: storedata[11],
                    cSaveContinueFlag: "S",
                    vVerificationofQtyRecd: storedata[13],
                    cAddSub: "S",
                    nNoofKit: 1,
                    cTransferIndi: TransferIndi,
                    cKitReceivedStatus: 'D',
                    vBatchLotNo: storedata[1],
                    nToStorageLocationNo: $("#StorageName :selected").val(),
                }

                var InsertProductReceiptData2 = {
                    Url: BaseUrl + "IPReturn/InsertPmsProductReceiptDetails",
                    SuccessMethod: "SuccessMethod",
                    Data: InsertPmsProductReceipt2
                }

                $.ajax({
                    url: InsertProductReceiptData2.Url,
                    type: 'POST',
                    data: InsertProductReceiptData2.Data,
                    success: SuccessInsertDataReceipt,
                    async: false,
                    error: function () {
                        SuccessorErrorMessageAlertBox("Error to save data in details portion.", ModuleName);
                        return false;
                    }
                });

                function SuccessInsertDataReceipt(response) {
                    clearData();
                    $("#tblStudyProductReceiptAdd thead").hide();
                    $("#tblStudyProductReceiptAdd tbody tr").remove();
                    $("#btnSavePmsProductReceipt").hide();
                    ProjectNo.focus();
                    GetDashBoardData();


                }
            }
            //end for
            SuccessorErrorMessageAlertBox("IP Return/Adjustment saved successfully.", ModuleName);
        }
    }
    else if (ntransactionno != "" && nspttransactiondtlno != "") {
        var storagearea = $("#StorageArea").val();
        if (storagearea == null) {
            storagearea = "0";
        }
        else {
            storagearea = $("#StorageArea").val().toString();
        }
        var InsertPmsProductReceipt2 =
            {
                nTransactionNo: $("#nTransactionno").val(),
                nTransactionDtlNo: $("#nSPTTransactionDtlNo").val(),
                nProductNo: $("#Product :selected").val(),
                nStudyProductBatchNo: $("#BatchLotNo :selected").val(),
                iReceivedQty: $("#RecdQty").val(),
                iNoOfBoxes: 0,
                iNoOfQtyBox: 0,
                dExpiryDate: $("#ExpiryDate").val(),
                iModifyBy: $("#hdnuserid").val(),
                vStorageArea: storagearea,
                vWorkSpaceId: setworkspaceid,
                vDocTypeCode: "ASAN",
                vGRNNO: $("#RefNo").val(),
                nStorageLocationNo: $("#StorageName :selected").val(),
                cProductFlag: "Q",
                cLocationIndicator: "Q",
                vRefModule: "SR",
                cConditionProducts: $("#ddlConditionofProducts").val(),
                vRemarks: $("#txtRemarks").val(),
                cSaveContinueFlag: "S",
                DataOPMode: "2",
                vVerificationofQtyRecd: $("#txtVerifyQuantityRecd").val(),
                cAddSub: "S",
                cKitReceivedStatus: 'D',
                cTransferIndi: TransferIndi,
                nNoofKit: 1,
                vBatchLotNo: $("#BatchLotNo :selected").text(),
                nToStorageLocationNo: $("#StorageName :selected").val(),
            }

        var InsertProductReceiptData2 = {
            Url: BaseUrl + "IPReturn/InsertPmsProductReceiptDetails",
            SuccessMethod: "SuccessMethod",
            Data: InsertPmsProductReceipt2
        }

        $.ajax({
            url: InsertProductReceiptData2.Url,
            type: 'POST',
            data: InsertProductReceiptData2.Data,
            success: SuccessInsertDataReceipt,
            async: false,
            error: function () {
                SuccessorErrorMessageAlertBox("Error to save data in details portion.", ModuleName);
                return false;
            }
        });

        function SuccessInsertDataReceipt(response) {
            clearData();
            $("#tblStudyProductReceiptAdd thead").hide();
            $("#tblStudyProductReceiptAdd tbody tr").remove();
            $("#btnSavePmsProductReceipt").hide();
            ProjectNo.focus();
            GetDashBoardData();
            SuccessorErrorMessageAlertBox("IP Return/Adjustment saved successfully.", ModuleName);

        }
    }
}

function InsertTrnasactionDtlForProductSaveAndContinue(response) {
    var ntransactionno = $("#nTransactionno").val();
    var nspttransactiondtlno = $("#nSPTTransactionDtlNo").val();
    var cKitReceivedStatus;
    if ($("#ddlTransferIndi").val() == "K") {
        cKitReceivedStatus = 'D';
    }
    else {
        cKitReceivedStatus = 'M';
    }

    if (ntransactionno == "" && nspttransactiondtlno == "") {
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

        var data = HTMLtbl.getData($('#tblStudyProductReceiptAdd'));
        var StoreData = [];
        for (i = 0; i < data.length; i++) {
            var storedata = data[i];
            var InsertPmsProductReceipt2 =
            {
                nTransactionNo: response,
                //nSrNo: "1",
                nProductNo: storedata[7],
                nStudyProductBatchNo: storedata[9],
                iReceivedQty: storedata[3],
                iNoOfBoxes: 0,
                iNoOfQtyBox: 0,
                dExpiryDate: storedata[2],
                iModifyBy: $("#hdnuserid").val(),
                vStorageArea: storedata[8],
                vWorkSpaceId: setworkspaceid,
                vDocTypeCode: "ASAN",
                vGRNNO: $("#RefNo").val(),
                nStorageLocationNo: $("#StorageName :selected").val(),
                cProductFlag: "Q",
                cLocationIndicator: "Q",
                vRefModule: "SR",
                cConditionProducts: storedata[10],
                vRemarks: storedata[11],
                cSaveContinueFlag: "C",
                vVerificationofQtyRecd: storedata[13],
                nNoofKit: storedata[4],
                cTransferIndi: TransferIndi,
                cKitReceivedStatus: cKitReceivedStatus,
                iNoOfContainers: storedata[14],
                cIsTempRecd: storedata[15],
                cIsCOARecd: storedata[16],
                cIsGMPRecd: storedata[17],
                dCOAdate: storedata[18],
                dGMPdate: storedata[19],
                vPurpose: storedata[20],
                nTempNumber: storedata[21],
                vUnit: storedata[22],
                vBatchLotNo: storedata[1],
                nToStorageLocationNo: $("#StorageName :selected").val(),
            }

            var InsertProductReceiptData2 = {
                Url: BaseUrl + "IPReturn/InsertPmsProductReceiptDetails",
                SuccessMethod: "SuccessMethod",
                Data: InsertPmsProductReceipt2
            }

            $.ajax({
                url: InsertProductReceiptData2.Url,
                type: 'POST',
                data: InsertProductReceiptData2.Data,
                success: function (response) {
                    clearData();
                    $("#tblStudyProductReceiptAdd thead").hide();
                    $("#tblStudyProductReceiptAdd tbody tr").remove();
                    $("#btnSavePmsProductReceipt").hide();
                    ProjectNo.focus();
                    GetDashBoardData();
                    $('#txtReason').val("");
                },
                error: function () {
                    SuccessorErrorMessageAlertBox("Error to save data in details portion.", ModuleName);
                    return false;
                }
            });
        }
        SuccessorErrorMessageAlertBox("IP Return/Adjustment saved successfully.", ModuleName);
    }
    else if (ntransactionno != "" && nspttransactiondtlno != "") {
        var storagearea = $("#StorageArea").val();
        if (storagearea == null) {
            storagearea = "0";
        }
        else {
            storagearea = $("#StorageArea").val().toString();
        }
        var InsertPmsProductReceipt2 =
            {
                nTransactionNo: $("#nTransactionno").val(),
                nTransactionDtlNo: $("#nSPTTransactionDtlNo").val(),
                nProductNo: $("#Product :selected").val(),
                nStudyProductBatchNo: $("#BatchLotNo :selected").val(),
                iReceivedQty: $("#RecdQty").val(),
                iNoOfBoxes: 0,
                iNoOfQtyBox: 0,
                dExpiryDate: $("#ExpiryDate").val(),
                iModifyBy: $("#hdnuserid").val(),
                vStorageArea: storagearea,
                vWorkSpaceId: setworkspaceid,
                vDocTypeCode: "ASAN",
                vGRNNO: $("#RefNo").val(),
                nStorageLocationNo: $("#StorageName :selected").val(),
                cProductFlag: "Q",
                cLocationIndicator: "Q",
                vRefModule: "SR",
                cConditionProducts: $("#ddlConditionofProducts").val(),
                vRemarks: $("#txtReason").val() + " " + $("#txtRemarks").val(),
                cSaveContinueFlag: "C",
                DataOPMode: "2",
                vVerificationofQtyRecd: $("#txtVerifyQuantityRecd").val(),
                cKitReceivedStatus: cKitReceivedStatus,
                iNoOfContainers: $("#txtNoOfContainers").val(),
                cIsTempRecd: $("#ddlTempRecd :selected").val(),
                cIsCOARecd: $("#ddlCoaRecd :selected").val(),
                cIsGMPRecd: $("#ddlGmpRecd :selected").val(),
                dCOAdate: $("#COADate").val(),
                dGMPdate: $("#GMPDate").val(),
                vPurpose: "",
                nTempNumber: $("#tempNumber").val(),
                vUnit: $("#ddlUnit").val(),
                vBatchLotNo: $("#BatchLotNo :selected").text(),
                nToStorageLocationNo: $("#StorageName :selected").val(),
            }

        var InsertProductReceiptData2 = {
            Url: BaseUrl + "IPReturn/InsertPmsProductReceiptDetails",
            SuccessMethod: "SuccessMethod",
            Data: InsertPmsProductReceipt2
        }

        $.ajax({
            url: InsertProductReceiptData2.Url,
            type: 'POST',
            data: InsertProductReceiptData2.Data,
            success: function (response) {
                clearData();
                $("#tblStudyProductReceiptAdd thead").hide();
                $("#tblStudyProductReceiptAdd tbody tr").remove();
                $("#btnSavePmsProductReceipt").hide();
                ProjectNo.focus();
                GetDashBoardData();
                $('#txtReason').val("");
                SuccessorErrorMessageAlertBox("IP Return/Adjustment saved successfully.", ModuleName);
            },
            error: function () {
                SuccessorErrorMessageAlertBox("Error to save data in details portion.", ModuleName);
                return false;
            }
        });
    }
}

function InsertTrnasactionDtlForKitSaveAndContinue(response) {
    var ntransactionno = $("#nTransactionno").val();
    var nspttransactiondtlno = $("#nSPTTransactionDtlNo").val();
    var cKitReceivedStatus;
    if ($("#ddlTransferIndi").val() == "K") {
        cKitReceivedStatus = 'D';
    }
    else {
        cKitReceivedStatus = 'M';
    }

    if (ntransactionno == "" && nspttransactiondtlno == "") {
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

        var data = HTMLtbl.getData($('#tblStudyProductReceiptAdd'));
        var StoreData = [];
        for (i = 0; i < data.length; i++) {
            var storedata = data[i];
            for (j = 0 ; j < parseInt(storedata[4]) ; j++) {
                var InsertPmsProductReceipt2 =
                {
                    nTransactionNo: response,
                    nProductNo: storedata[7],
                    nStudyProductBatchNo: storedata[9],
                    iReceivedQty: storedata[3],
                    iNoOfBoxes: 0,
                    iNoOfQtyBox: 0,
                    dExpiryDate: storedata[2],
                    iModifyBy: $("#hdnuserid").val(),
                    vStorageArea: storedata[8],
                    vWorkSpaceId: setworkspaceid,
                    vDocTypeCode: "ASAN",
                    vGRNNO: $("#RefNo").val(),
                    nStorageLocationNo: $("#StorageName :selected").val(),
                    cProductFlag: "Q",
                    cLocationIndicator: "Q",
                    vRefModule: "SR",
                    cConditionProducts: storedata[10],
                    vRemarks: storedata[11],
                    cSaveContinueFlag: "C",
                    vVerificationofQtyRecd: storedata[13],
                    nNoofKit: storedata[4],
                    cTransferIndi: TransferIndi,
                    cKitReceivedStatus: cKitReceivedStatus,
                    nNoofKit: 1,
                    vBatchLotNo: storedata[1],
                    nToStorageLocationNo: $("#StorageName :selected").val(),
                }

                var InsertProductReceiptData2 = {
                    Url: BaseUrl + "IPReturn/InsertPmsProductReceiptDetails",
                    SuccessMethod: "SuccessMethod",
                    Data: InsertPmsProductReceipt2
                }
                $.ajax({
                    url: InsertProductReceiptData2.Url,
                    type: 'POST',
                    data: InsertProductReceiptData2.Data,
                    success: function (response) {
                        clearData();
                        $("#tblStudyProductReceiptAdd thead").hide();
                        $("#tblStudyProductReceiptAdd tbody tr").remove();
                        $("#btnSavePmsProductReceipt").hide();
                        ProjectNo.focus();
                        GetDashBoardData();
                        $('#txtReason').val("");
                    },
                    async: false,
                    error: function () {
                        SuccessorErrorMessageAlertBox("Error to save data in details portion.", ModuleName);
                        return false;
                    }
                });
            }
        }
    }
    else if (ntransactionno != "" && nspttransactiondtlno != "") {
        var storagearea = $("#StorageArea").val();
        if (storagearea == null) {
            storagearea = "0";
        }
        else {
            storagearea = $("#StorageArea").val().toString();
        }
        var InsertPmsProductReceipt2 =
            {
                nTransactionNo: $("#nTransactionno").val(),
                nTransactionDtlNo: $("#nSPTTransactionDtlNo").val(),
                nProductNo: $("#Product :selected").val(),
                nStudyProductBatchNo: $("#BatchLotNo :selected").val(),
                iReceivedQty: $("#RecdQty").val(),
                iNoOfBoxes: 0,
                iNoOfQtyBox: 0,
                dExpiryDate: $("#ExpiryDate").val(),
                iModifyBy: $("#hdnuserid").val(),
                vStorageArea: storagearea,
                vWorkSpaceId: setworkspaceid,
                vDocTypeCode: "ASAN",
                vGRNNO: $("#RefNo").val(),
                nStorageLocationNo: $("#StorageName :selected").val(),
                cProductFlag: "Q",
                cLocationIndicator: "Q",
                vRefModule: "SR",
                cConditionProducts: $("#ddlConditionofProducts").val(),
                vRemarks: $("#txtRemarks").val(),
                cSaveContinueFlag: "C",
                DataOPMode: "2",
                vVerificationofQtyRecd: $("#txtVerifyQuantityRecd").val(),
                cKitReceivedStatus: cKitReceivedStatus,
                cTransferIndi: TransferIndi,
                nNoofKit: 1,
                vBatchLotNo: $("#BatchLotNo :selected").text(),
                nToStorageLocationNo: $("#StorageName :selected").val(),
            }

        var InsertProductReceiptData2 = {
            Url: BaseUrl + "IPReturn/InsertPmsProductReceiptDetails",
            SuccessMethod: "SuccessMethod",
            Data: InsertPmsProductReceipt2
        }

        $.ajax({
            url: InsertProductReceiptData2.Url,
            type: 'POST',
            data: InsertProductReceiptData2.Data,
            success: function (response) {
                clearData();
                $("#tblStudyProductReceiptAdd thead").hide();
                $("#tblStudyProductReceiptAdd tbody tr").remove();
                $("#btnSavePmsProductReceipt").hide();
                ProjectNo.focus();
                GetDashBoardData();
                $('#txtReason').val("");
            },
            async: false,
            error: function () {
                SuccessorErrorMessageAlertBox("Error to save data in details portion.", ModuleName);
                return false;
            }
        });
    }
    SuccessorErrorMessageAlertBox("IP Return/Adjustment saved successfully.", ModuleName);
}

var InsertPmsProductReceiptMaster1 = function (Url, SuccessMethod, Data) {
    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        //async: false,
        success: function (response) {
            if ($("#ddlTransferIndi").val() == "P") {
                InsertTrnasactionDtlForProductSaveAndContinue(response);
            }
            else if ($("#ddlTransferIndi").val() == "K") {
                InsertTrnasactionDtlForKitSaveAndContinue(response);
            }
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Data not found.", ModuleName);
        }
    });
}


function GetProductName() {
    if (productIds[$('#ddlProjectNodashboard').val()] != undefined) {
        setworkspaceid = productIds[$('#ddlProjectNodashboard').val()];
    }

    var GetProductNameData = {
        vWorkSpaceId: setworkspaceid,
        nProductTypeID: $("#ddlProductType").val(),
        cTransferIndi: TransferIndi
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
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("Product not found.", "ddlProductType", ModuleName);
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
    //var projectid = productIds[$('#ProjectNo').val()];
    var projectid = setworkspaceid;

    if ($("#nTransactionno").val() == "" && $("#nSPTTransactionDtlNo").val() == "") {
        var productid = $("#Product").val();
    }
    else {
        var productid = vnProductNo;
    }

    if (flag == "Y") {
        var productid = $("#Product").val();
    }

    var GetPmsStudyReceiptBatchLotNo = {
        Url: BaseUrl + "IPReturn/GetBatchLotNo",
        SuccessMethod: "SuccessMethod"
    }
    $.ajax({
        url: GetPmsStudyReceiptBatchLotNo.Url,
        type: 'GET',
        async: false,
        success: SuccessMethod,
        data: { id: projectid, projectno: productid },
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

$("#tblStudyProductReceiptAdd").on('click', '#trRemove', function () {
    $(this).closest('tr').remove();
    if ($("#tblStudyProductReceiptAdd tbody tr").length != 0) {
        $("#tblStudyProductReceiptAdd").show();
        $("#btnSavePmsProductReceipt").show();
        $("#btnSaveContinuePmsProductReceipt").hide();
        $(".headercontrol").attr('disabled', 'disabled');
    }
    else {
        $("#tblStudyProductReceiptAdd").hide();
        $("#btnSavePmsProductReceipt").hide();
        $("#btnSaveContinuePmsProductReceipt").hide();
        $(".headercontrol").prop('disabled', '');
    }
});

function RecdQtyfunction() {
    var NoofBoxes = document.getElementById('NoofBoxes').value;;
    var noofQtyPerBox = document.getElementById('NoofQty').value;;
    document.getElementById('RecdQty').value = NoofBoxes * noofQtyPerBox;
}

function cleardetailspart() {
    $('#Product').val(0).attr("selected", "selected");
    $('#BatchLotNo').val(0).attr("selected", "selected");
    $("#NoofQty").val("").prop("disabled", false);
    //$("#RecdQty").val("").prop("disabled", false);
    $("#RecdQty").val("");
    $("#ExpiryDate").val("");
    $("#NoofBoxes").val("");
    $('#ddlConditionofProducts').val(0).attr("selected", "selected").prop("disabled", false);
    $("#txtRemarks").val("").prop("disabled", false);
    $("#txtVerifyQuantityRecd").val("");
    $("#StorageArea").multiselect("clearSelection");
    $("#StorageArea").multiselect('refresh');
    $("#txtNoofKit").val("");
    $("#txtNoOfContainers").val("").prop("disabled", false);
    $('#ddlTempRecd').val('Y').attr("selected", "selected").prop("disabled", false);
    $('#ddlCoaRecd').val('Y').attr("selected", "selected").prop("disabled", false);
    $('#ddlGmpRecd').val('Y').attr("selected", "selected").prop("disabled", false);
    $('#ddlPurpose').val('Please Select Purpose').attr("selected", "selected").prop("disabled", false);
    $("#divOtherPurpose").hide();
    $("#divCOAdate").hide();
    $("#divTempNumber").hide();
    $("#divGMPdate").hide();
    $("#GMPDate").val("");
    $("#COADate").val("");
    $("#tempNumber").val("");
    $('#ddlUnit').val(0).attr("selected", "selected").prop("disabled", false);
    $('#GMPDate').datepicker('setDate', null).datepicker('fill');
    $('#COADate').datepicker('setDate', null).datepicker('fill');
    //$('#GMPDate').data("DateTimePicker").clear();
    //$('#COADate').data("DateTimePicker").clear();
    $('#GMPDate').prop("disabled", false);
    $('#COADate').prop("disabled", false);
    $('#tempNumber').prop("disabled", false);
}

function clearheaderpart() {
    $("#RecdFromLocation").val("");
    $('#TransportMode').val(0).attr("selected", "selected");
    $("#RefNo").val("");
    $("#ShipmentNo").val("");
    $("#vOtherTransportMode").val("");
    $("#divOtherTransportMode").hide();
    $('#ddlProductType').val(0).attr("selected", "selected");
    $("#nSPTTransactionDtlNo").val("")
    $("#nTransactionno").val("")
    $("#txtConditionofPackRecd").val("");
    $('#txtReceiptDateTime').data("DateTimePicker").clear();
    $('#ddlTransferIndi').val("0");
    $(".headercontrol").prop('disabled', '');
    //$("#btnSavePmsProductReceipt").hide();
    //$("#btnSaveContinuePmsProductReceipt").hide();
    $("#ddlReceiptType").val("0");
    $('#StorageName').val(0).attr("selected", "selected");

}

function GetDashBoardData() {
    reexpirydate = "";
    if (productIds[$('#ddlProjectNodashboard').val()] != undefined) {
        setworkspaceid = productIds[$('#ddlProjectNodashboard').val()];
    }
    var projectid = setworkspaceid;
    var doctype = "ASAN";

    var GetDashboardData = {
        vWorkSpaceId: setworkspaceid,
        vDocTypeCode: "ASAN",
        iUserID: $("#hdnuserid").val()
    }

    var GetPMSStudyProductReceiptData =
    {
        Url: BaseUrl + "IPReturn/StudyProductReceiptData",
        SuccessMethod: "SuccessMethod",
        Data: GetDashboardData
    }

    $.ajax({
        url: GetPMSStudyProductReceiptData.Url,
        type: 'POST',
        aync: false,
        data: GetPMSStudyProductReceiptData.Data,
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("Data not found.", "Product", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        if (jsonData.length == 0) {
            $("#divexport").hide();
        }
        else {
            $("#divexport").show();
        }
        var UserTypeCode = "";
        var savecontinueedit;
        var audittrail;
        var receiptdate = "";
        $("#divexport").css("visibility", "visible");
        var ActivityDataset = [];
        var View;
        var QAreview;
        var review = "";
        var NoOfContainers = "";
        UserTypeCode = $("#hdnUserTypeCode").val();
        for (var i = 0; i < jsonData.length; i++) {

            if (jsonData[i].dReceiptDate != null) {
                var tempreceiptdate = jsonData[i].dReceiptDate.split(" ");
                receiptdate = tempreceiptdate[0] + " " + tempreceiptdate[1];
            }

            if (viewmode == "OnlyView") {

                savecontinueedit = '<a data-tooltip="tooltip" title="Data Entry Continue" class="disabled"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a>'
            }
            else {

                if ($("#hdnUserProfile").val().includes(UserTypeCode)) {
                    savecontinueedit = '<a data-tooltip="tooltip" title="Data Entry Continue" class="disabled"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a>'
                }
                if ($("#hdnUserProfile").val().includes(UserTypeCode)) {
                    QAreview = "<a data-toggle='modal' data-tooltip='tooltip' title='QA Review'  attrid=' + aData[0] + ' class='btnview' Onclick=pmsStudyViewAuthenticate(this) nTransactionNo='" + jsonData[i].nTransactionNo
                                 + "' nSPTransactionDtlNo='" + jsonData[i].nTransactionDtlNo + "' cSaveContinueFlag = '" + jsonData[i].cSaveContinueFlag +
                                 "'  cIsQAReview='" + jsonData[i].cIsQAReview + "' style='cursor:pointer;'><i class='btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a'><i class='fa fa-fw fa-edit'></i><span>QA Review</span></a>"


                }
                else {
                    //Changed by rinkal
                    QAreview = "<a data-toggle='modal' data-tooltip='tooltip' title='edit' data-target='#ViewAuthenticate' class='btnedit' style='cursor:pointer;'><i class='btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a'><i class='fa fa-fw fa-edit'></i><span>QA Review</span></a>"

                }
                if (jsonData[i].cSaveContinueFlag == "C") {
                    if ($("#hdnUserProfile").val().includes(UserTypeCode)) {
                        savecontinueedit = '<a data-tooltip="tooltip" title="Data Entry Continue" class="disabled"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a>'
                    }
                    else {
                        savecontinueedit = "<a data-toggle='modal' data-tooltip='tooltip' title='Data Entry Continue' data-target='#ProductReceiptModel' attrid=' + aData[0] + ' class='btnedit' Onclick=pmsStudyProductReceiptSelectionData(this) nTransactionNo='" + jsonData[i].nTransactionNo
                                           + "' nSPTransactionDtlNo='" + jsonData[i].nTransactionDtlNo + "' nProductTypeID = '" + jsonData[i].nProductTypeID + "' nProductNo = '"
                                           + jsonData[i].nProductNo + "' nStudyProductBatchNo = '" + jsonData[i].nStudyProductBatchNo + "'  cTransferIndi='"
                                           + jsonData[i].cTransferIndi + "' style='cursor:pointer;'><i class='btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a'><i class='fa fa-fw fa-edit'></i><span>Edit</span></a>"
                    }
                }
                else if (jsonData[i].cSaveContinueFlag == "S" && jsonData[i].cIsQAReview == "R") {
                    if ($("#hdnUserProfile").val().includes(UserTypeCode)) {
                        savecontinueedit = '<a data-tooltip="tooltip" title="Data Entry Continue" class="disabled"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a>'
                    }
                    else {
                        savecontinueedit = "<a data-toggle='modal' data-tooltip='tooltip' title='Data Entry Continue' data-target='#ProductReceiptModel' attrid=' + aData[0] + ' class='btnedit' Onclick=pmsStudyProductReceiptSelectionData(this) nTransactionNo='" + jsonData[i].nTransactionNo
                                    + "' nSPTransactionDtlNo='" + jsonData[i].nTransactionDtlNo + "' nProductTypeID = '" + jsonData[i].nProductTypeID + "' nProductNo = '"
                                    + jsonData[i].nProductNo + "' nStudyProductBatchNo = '" + jsonData[i].nStudyProductBatchNo + "'  cTransferIndi='"
                                    + jsonData[i].cTransferIndi + "' style='cursor:pointer;'><i class='btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a'><i class='fa fa-fw fa-edit'></i><span>Edit</span></a>"
                    }
                }
                else {
                    savecontinueedit = '<a data-tooltip="tooltip" title="Data Entry Continue" class="disabled"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a>'
                }



            }
            View = "<a data-toggle='modal' data-tooltip='tooltip' title='View' data-target='#ProductReceiptModel' attrid=' + aData[0] + ' class='btnedit' Onclick=pmsStudyProductReceiptSelectionData(this) nTransactionNo='" + jsonData[i].nTransactionNo
                                     + "' nSPTransactionDtlNo='" + jsonData[i].nTransactionDtlNo + "' nProductTypeID = '" + jsonData[i].nProductTypeID + "' nProductNo = '"
                                     + jsonData[i].nProductNo + "' nStudyProductBatchNo = '" + jsonData[i].nStudyProductBatchNo + "'  cTransferIndi='"
                                     + jsonData[i].cTransferIndi + "' style='cursor:pointer;'><i class='btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a'><i class='fa fa-eye'></i><span>View</span></a>"


            audittrail = "<a data-toggle='modal' data-tooltip='tooltip' title='Audit Trail' data-target='#ProductReceiptHdrAudit' attrid='" + jsonData[i].nTransactionNo + "' Onclick=pmsProductReceiptAuditTrail('" + jsonData[i].nTransactionNo + "') style='cursor:pointer;'><i class='btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a'><i class='fa fa-fw fa-file-text-o'></i><span>Audit</span></a>";
            var InDataset = [];
            if (jsonData[i].cIsQAReview == 'Y') {
                review = 'Approved'
            }
            else if (jsonData[i].cIsQAReview == 'N') {
                review = 'Pending'
            }
            else if (jsonData[i].cIsQAReview == 'R') {
                review = 'Rejected'
            }

            if (jsonData[i].iNoOfContainers == 0) {
                NoOfContainers = '';
            }
            else {
                NoOfContainers = jsonData[i].iNoOfContainers;
            }

            InDataset.push(jsonData[i].vProjectNo, jsonData[i].vStorageLocationName, jsonData[i].vReceivedFrom, receiptdate, jsonData[i].vReceiptRefNo,
                           jsonData[i].vShipmentNo, jsonData[i].vProductType, jsonData[i].vConditionofPackRecd, jsonData[i].vTransporterName, jsonData[i].ReceiptType,
                           jsonData[i].vProductName, jsonData[i].vBatchLotNo, jsonData[i].dExpiryDate, jsonData[i].iNoOfBoxes, jsonData[i].iNoOfQtyBox,
                           jsonData[i].iReceivedQty, jsonData[i].vUnit, jsonData[i].vStorageAreaName, NoOfContainers, jsonData[i].cIsTempRecd, jsonData[i].cIsCOARecd,
                           jsonData[i].cIsGMPRecd, jsonData[i].dCOAdate, jsonData[i].dGMPdate, jsonData[i].vPurpose, jsonData[i].cConditionProducts, jsonData[i].vRemarks,
                           jsonData[i].cTransferIndi, review, savecontinueedit, audittrail, jsonData[i].nTransactionNo, jsonData[i].nTransactionDtlNo,
                           jsonData[i].cSaveContinueFlag, jsonData[i].nProductTypeID, View, QAreview, jsonData[i].cIsQAReview);

            ActivityDataset.push(InDataset);
        }
        otable = $('#tblPmsProductReceiptData').dataTable({
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
            "sScrollXInner": "4200" /* It varies dynamically if number of columns increases */,
            "fnCreatedRow": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                //if (aData[36] == "Y") {
                //    $(nRow).addClass('highlightPendingQA');
                //}
                //if (aData[36] == "R") {
                //    $(nRow).addClass('highlightRejectedQA');
                //}
                if (aData[33] == "C") {
                    $(nRow).addClass('highlightSaveContinue');
                }


            },
            "aoColumns": [
               { "sTitle": "Project No" }, //0
               { "sTitle": "Storage Location" }, //1
               { "sTitle": "Received From" }, //2
               { "sTitle": "Received Date & Time" },//3
               { "sTitle": "Reference No" },//4
               { "sTitle": "Shipment No" },//5
               { "sTitle": "Product Type" },//6
               { "sTitle": "Condition of pack received" },//7
               { "sTitle": "Transporter Name" },//8
               { "sTitle": "Receipt Type" },//9
               { "sTitle": "Product Name" },//10
               { "sTitle": "Batch/Lot/Lot No" },//11
               { "sTitle": "Re-test/Expiry/Provisional expiry date" },//12
               { "sTitle": "No. of Boxes" },//13
               { "sTitle": "Qty Per Box" },//14
               { "sTitle": "Received Qty" },//15
                { "sTitle": "Unit" },//16
               { "sTitle": "Storage Area" },//17
               { "sTitle": "No Bin/Pallet/Crate/Locker/Container/Shelf/Box/Boxes/Rack" },//18
               { "sTitle": "Temp data logger received" },//19
               { "sTitle": "COA received" },//20
               { "sTitle": "GMP Certificate received" },//21
               { "sTitle": "COA Receipt date" },//22
               { "sTitle": "GMP Receipt date" },//23
               { "sTitle": "Purpose" },//24
               { "sTitle": "Condition of Goods" },//25
               { "sTitle": "Remarks" },//26
               { "sTitle": "Product Indication" },//27
               { "sTitle": "QA Review" },//28
               { "sTitle": "Data Entry Continue" },//29
               { "sTitle": "Audit Trail" },//30
               { "sTitle": "HeaderNo" },//31
               { "sTitle": "DetailsNo" },//32
               { "sTitle": "Flag" },//33
               { "sTitle": "nProductTypeID" },//34
               { "sTitle": "View" },//35
               { "sTitle": "QA Review" },//36
            ],
            "columnDefs": [
                {
                    "targets": [31, 32, 33, 34, 29, 19, 12, 30, 9, 5, 7, 8, 13, 14, 7, 24, 20, 22, 21, 23, 16, 18, 25],
                    "visible": false,
                    "searchable": false
                },

                { "bSortable": false, "targets": [28, 29] },
                { "width": "3%", "targets": 0 },
                { "width": "4%", "targets": 1 },
                { "width": "4%", "targets": 2 },
                { "width": "4%", "targets": 3 },
                { "width": "3%", "targets": 4 },
                { "width": "3%", "targets": 5 },
                { "width": "3%", "targets": 6 },
                { "width": "4%", "targets": 7 },
                { "width": "4%", "targets": 8 },
                { "width": "3%", "targets": 9 },
                { "width": "3%", "targets": 10 },
                { "width": "3%", "targets": 11 },
                { "width": "4%", "targets": 12 },
                { "width": "3%", "targets": 13 },
                { "width": "4%", "targets": 14 },
                { "width": "6%", "targets": 15 },
                { "width": "5%", "targets": 16 },
                { "width": "5%", "targets": 17 },
                { "width": "4%", "targets": 18 },
                { "width": "3.8%", "targets": 19 },
                { "width": "4%", "targets": 20 },
                { "width": "3%", "targets": 21 },
                { "width": "3%", "targets": 22 },
                { "width": "3%", "targets": 23 },
                { "width": "3%", "targets": 24 },
                { "width": "3%", "targets": 25 },
                { "width": "3%", "targets": 26 },
                { "width": "3%", "targets": 27 },
                { "width": "3%", "targets": 28 },
                   { "width": "3%", "targets": 29 },

                 { "width": "3%", "targets": 34 },
                  {
                      "width": "3%", "targets": 35,
                  },
                   {
                       "width": "3%", "targets": 36,
                   },

            ],
            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },
        });

        if ($("#hdnUserProfile").val().includes(UserTypeCode)) {
            var table = $('#tblPmsProductReceiptData').DataTable();
            table.column(36).visible(true);
            table.column(28).visible(true);
        }
        else {
            var table = $('#tblPmsProductReceiptData').DataTable();
            //Changed by rinkal
            table.column(36).visible(false);
            table.column(28).visible(true);
        }
        if (UserTypeCode == ViewOnlyUser) {
            HideEditColumn();
            HideInActiveColumn();
        }

    }
}

function GetExpiryDate() {
    var ExpiryDatedata = {
        vWorkSpaceId: setworkspaceid,
        nProductNo: $("#Product").val(),
        nStudyProductBatchNo: $("#BatchLotNo").val(),
    }

    var GetPMSStudyProductReceiptExpiryData = {
        Url: BaseUrl + "IPReturn/ExpiryDate",
        SuccessMethod: "SuccessMethod",
        Data: ExpiryDatedata
    }

    $.ajax({
        url: GetPMSStudyProductReceiptExpiryData.Url,
        type: "POST",
        data: GetPMSStudyProductReceiptExpiryData.Data,
        success: function (jsonData) {
            if (jsonData.length == 0) {
                $("#ExpiryDate").val("");
            }
            else {
                if (jsonData[0].dExpDate == "1900-01-01T00:00:00") {
                    $("#ExpiryDate").val("");
                }
                else {
                    var MonthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    var tmpexpirtydate = jsonData[0].dExpDate
                    var date = tmpexpirtydate.split("-");
                    var result = date[2].split("T")
                    var time = result[1].split(":");
                    var monthinid = parseInt(date[1]);

                    if (jsonData[0].cIsExpDate == "M") {
                        var datetime = MonthList[monthinid - 1] + "-" + date[0];
                    } else {
                        var datetime = result[0] + "-" + MonthList[monthinid - 1] + "-" + date[0];
                    }

                    $("#ExpiryDate").val(datetime);
                }
            }
        },
        error: function () {
            ValidationAlertBox("Expiry Date not found.", "BatchLotNo", ModuleName);
        }
    });
};

function GetExportToExcelDetails() {
    if (productIds[$('#ddlProjectNodashboard').val()] != undefined) {
        setworkspaceid = productIds[$('#ddlProjectNodashboard').val()];
    }
    var Data_Export = {
        vWorkSpaceId: setworkspaceid,
        vDocTypeCode: "ASAN",
    }
    var url = WebUrl + "IPReturn/GetExportToExcelDetails";
    $.ajax({
        url: url,
        type: 'get',
        data: Data_Export,

        success: function (data) {

        },
        error: function () {
            SuccessorErrorMessageAlertBox("Error in export to excel details.", ModuleName);
        }
    });
}

function GetProductType() {
    var GetProductType = {
        Url: BaseUrl + "PmsGeneral/GetProductType/" + setworkspaceid,
        SuccessMethod: "SuccessMethod"
    }

    $.ajax({
        url: GetProductType.Url,
        type: 'GET',
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
    var UrlDetails = {
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
    if (productIds[$('#ddlProjectNodashboard').val()] != undefined) {
        setworkspaceid = productIds[$('#ddlProjectNodashboard').val()];
    }

    var url = WebUrl + "PmsStudyProduct/GetWorkspaceId";
    $.ajax({
        url: url,
        type: 'get',
        data: { id: setworkspaceid, UserName: $("#hdnusername").val() },
        async: false,
        success: function (data) {
        },
        error: function () {
        }
    });

    if (setworkspaceid != "") {
        GetProductType();
        GetDashBoardData();
        GetStorageName();
        GetExportToExcelDetails();
    }
    else {
        $("#divexport").css("visibility", "hidden");
        //alert('Please Select ProjectNo');
    }
}

function pmsStudyProductReceiptSelectionData(e) {
    SaveContinueFlag = true;
    $("#lblRemarks").text("Remarks *");
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

    $("#nTransactionno").val(nTransactionNo);
    $("#nSPTTransactionDtlNo").val(nTransactionDtlNo);

    $('#ddlProductType').val(nProductTypeID).attr("selected", "selected");
    GetProductName();
    GetBatchLotNo();

    var GETStorageArea = {
        Url: BaseUrl + "PmsGeneral/ALLStorageAreaData",
        SuccessMethod: "SuccessMethod"
    }
    var FilterData = {
        nStorageTypeId: $("#StorageName :selected").val(),
        vLocationCode: $("#hdnUserLocationCode").val(),
    }
    GetPmsProductReceiptStorageArea(GETStorageArea.Url, FilterData);

    var GetDashBoardSelectionData = {
        nTransactionNo: nTransactionNo,
        nTransactionDtlNo: nTransactionDtlNo,
    }

    var GetPMSStudyProductReceiptSelection = {
        Url: BaseUrl + "IPReturn/StudyProductSelectionData",
        SuccessMethod: "SuccessMethod",
        Data: GetDashBoardSelectionData
    }

    if (e.title == "Data Entry Continue") {
        var GetAllTransportMode = {
            //Url: BaseUrl + "PmsGeneral/GetAllTransportMode",  ''' Chnage Fo Location Wise
            Url: BaseUrl + "PmsTransporterMaster/AllTransporterData",
            SuccessMethod: "SuccessMethod"
        }
        GetPmsProductReceiptTransportMode(GetAllTransportMode.Url, GetAllTransportMode.SuccessMethod, "No");

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

            if (jsonData[0].cIsQAReview == "R") {
                $('#Product').val(jsonData[0].nProductNo).attr("selected", "selected").prop("disabled", "disabled");
                $('#BatchLotNo').val(jsonData[0].nStudyProductBatchNo).attr("selected", "selected").prop("disabled", "disabled");
                $("#RecdFromLocation").val(jsonData[0].vReceivedFrom).prop("disabled", false);
                if (jsonData[0].dReceiptDate == "1-1-1900" || jsonData[0].dReceiptDate == "1900-01-01T00:00:00") {
                    $("#txtReceiptDateTime").val("").prop("disabled", false);
                    $('#txtReceiptDateTime').data("DateTimePicker").clear();
                }
                else {
                    var MonthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    var txtreceiptdatetime = jsonData[0].dReceiptDate
                    var date = txtreceiptdatetime.split("-");
                    var result = date[2].split("T")
                    var time = result[1].split(":");
                    var monthinid = parseInt(date[1]);
                    var datetime = result[0] + "-" + MonthList[monthinid - 1] + "-" + date[0] + " " + time[0] + ":" + time[1];
                    $("#txtReceiptDateTime").val(datetime).prop("disabled", false);
                }
                $("#RefNo").val(jsonData[0].vReceiptRefNo).prop("disabled", false);
                $("#ShipmentNo").val(jsonData[0].vShipmentNo).prop("disabled", false);

                // For Transporter
                $('#TransportMode').val(jsonData[0].nTransporterNo).attr("selected", "selected").prop("disabled", false);
                var Transportmodename = $("#TransportMode :selected").text();
                if (Transportmodename.toLowerCase() == 'other') {
                    $("#divOtherTransportMode").hide();
                    vOtherTransportMode.focus();
                }
                else {
                    $("#divOtherTransportMode").hide();
                }


                if (jsonData[0].dExpiryDate == "1-1-1900" || jsonData[0].dExpiryDate == "1900-01-01T00:00:00" || jsonData[0].dExpiryDate == "1990-01-01T00:00:00") {
                    $("#ExpiryDate").val("");
                    $("#ExpiryDate").attr("placeholder", "Not Applicable")
                }
                else {
                    //$("#ExpiryDate").val(jsonData[0].dExpiryDate);
                    //reexpirydate = jsonData[0].dExpiryDate;
                    if (jsonData[0].dExpiryDate != null) {
                        var MonthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                        var tmpexpirtydate = jsonData[0].dExpiryDate
                        var date = tmpexpirtydate.split("-");
                        var result = date[2].split("T")
                        var time = result[1].split(":");
                        var monthinid = parseInt(date[1]);
                        if (jsonData[0].cIsExpDate == "M") {
                            var datetime = MonthList[monthinid - 1] + "-" + date[0];
                        } else {
                            var datetime = result[0] + "-" + MonthList[monthinid - 1] + "-" + date[0];
                        }

                        $("#ExpiryDate").val(datetime);
                    }

                }

                $("#vOtherTransportMode").val(jsonData[0].vOtherTransportName).prop("disabled", false);
                $("#txtConditionofPackRecd").val(jsonData[0].vConditionofPackRecd).prop("disabled", false);
                $("#NoofBoxes").val(jsonData[0].iNoOfBoxes).prop("disabled", "disabled");
                $("#NoofQty").val(jsonData[0].iNoOfQtyBox).prop("disabled", "disabled");
                $("#txtVerifyQuantityRecd").val(jsonData[0].vVerificationofQtyRecd);
                $("#RecdQty").val(jsonData[0].iReceivedQty).prop("disabled", "");
                $("#ddlConditionofProducts").val(jsonData[0].cConditionProducts).prop("disabled", false);
                $("#txtRemarks").prop("disabled", false);
                $("#btnSavePmsProductReceipt").show();
                $("#btnSaveContinuePmsProductReceipt").hide();
                $("#btnClearPmsProductReceipt").hide();
                $("#btnAddTempProductReceipt").hide();
                $("#ProjectNo").val($("#ddlProjectNodashboard").val())
                $("#ProjectNo").prop('disabled', 'disabled');
                //$(".headercontrol").prop('disabled', '');

                // For Selection of Storage Area
                var data = jsonData[0].vStorageArea
                var dataarray = data.split(",");
                $("#StorageArea").val(dataarray);
                $("#StorageArea").multiselect("refresh");
                jQuery("#titleMode").text('Mode:-Edit');

                $("#ddlTransferIndi").val(jsonData[0].cTransferIndi.trim());
                TransferIndication(SaveContinueFlag);
                if (TransferIndi == "K") {
                    $("#txtNoofKit").val("1");
                    $("#txtNoofKit").prop("disabled", "disabled");
                    $("#divTransferReceiptType").attr('style', 'display:none');
                }
                else if (TransferIndi == "P") {
                    $("#divTransferReceiptType").attr('style', 'display:none');
                }
                else {
                    $("#divTransferReceiptType").attr('style', 'display:none');
                }

                $("#ddlReceiptType").val(jsonData[0].cReceiptType).prop("disabled", false);
                $("#ddlTransferIndi").prop("disabled", "disabled");
                $("#ddlProductType").prop("disabled", "disabled");

                $("#txtNoOfContainers").val(jsonData[0].iNoOfContainers).prop("disabled", false);

                $("#ddlTempRecd").val(jsonData[0].cIsTempRecd.trim()).attr("selected", "selected").prop("disabled", false);
                $("#ddlCoaRecd").val(jsonData[0].cIsCOARecd.trim()).attr("selected", "selected").prop("disabled", false);
                $("#ddlGmpRecd").val(jsonData[0].cIsGMPRecd.trim()).attr("selected", "selected").prop("disabled", false);

                if (jsonData[0].cIsTempRecd.trim().toLowerCase() == "y") {
                    $("#divTempNumber").hide();
                    //rinkal
                    $("#tempNumber").val(jsonData[0].nTempNumber).prop("disabled", false);
                }
                else {
                    $("#divTempNumber").hide();
                }

                if (jsonData[0].cIsCOARecd.trim().toLowerCase() == "y") {
                    if (jsonData[0].dCOAdate == "1-1-1900" || jsonData[0].dCOAdate == "1900-01-01T00:00:00" || jsonData[0].dCOAdate == "1990-01-01T00:00:00") {
                        $("#COADate").val("").prop("disabled", false);
                        $("#COADate").attr("placeholder", "COA Receipt Date")
                    }
                    else {
                        var MonthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                        var txtCOAdatetime = jsonData[0].dCOAdate
                        var date = txtCOAdatetime.split("-");
                        var result = date[2].split("T")
                        var time = result[1].split(":");
                        var monthinid = parseInt(date[1]);
                        var datetime = result[0] + "-" + MonthList[monthinid - 1] + "-" + date[0];
                        $("#COADate").val(datetime).prop("disabled", false);
                    }
                }
                else {
                    $("#divCOAdate").hide();
                }
                if (jsonData[0].cIsGMPRecd.trim().toLowerCase() == "y") {
                    if (jsonData[0].dGMPdate == "1-1-1900" || jsonData[0].dGMPdate == "1900-01-01T00:00:00" || jsonData[0].dGMPdate == "1990-01-01T00:00:00") {
                        $("#GMPDate").val("").prop("disabled", false);
                        $('#GMPDate').attr("placeholder", "GMP Receipt Date")
                    }
                    else {
                        var MonthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                        var txtGMPdatetime = jsonData[0].dGMPdate
                        var date = txtGMPdatetime.split("-");
                        var result = date[2].split("T")
                        var time = result[1].split(":");
                        var monthinid = parseInt(date[1]);
                        var datetime = result[0] + "-" + MonthList[monthinid - 1] + "-" + date[0];
                        $("#GMPDate").val(datetime).prop("disabled", false);
                    }
                }
                else {
                    $("#divGMPdate").hide();
                }
                if (jsonData[0].vPurpose.toLowerCase() == "other") {
                    $("#divOtherPurpose").show();
                    $("#vOtherPurpose").val(jsonData[0].vPurpose).prop("disabled", false);

                }
                else {
                    if (jsonData[0].vPurpose == '') {
                        $("#ddlPurpose").val('Please Select Purpose').attr("selected", "selected").prop("disabled", false);
                    }
                    else {
                        $("#ddlPurpose").val(jsonData[0].vPurpose).attr("selected", "selected").prop("disabled", false);
                    }
                    //$("#ddlPurpose").text(jsonData[0].vPurpose).attr("selected", "selected").prop("disabled", false);

                    $("#divOtherPurpose").hide();

                }
                $('#BatchLotNo').val(jsonData[0].nStudyProductBatchNo).attr("selected", "selected").prop("disabled", "disabled");
                $("#NoofBoxes").val(jsonData[0].iNoOfBoxes).prop("disabled", "disabled");

                $("#ddlUnit").val(jsonData[0].vUnit).prop("disabled", false);
            }
            else {
                $('#Product').val(jsonData[0].nProductNo).attr("selected", "selected").prop("disabled", false);
                $('#BatchLotNo').val(jsonData[0].nStudyProductBatchNo).attr("selected", "selected").prop("disabled", false);
                $("#RecdFromLocation").val(jsonData[0].vReceivedFrom).prop("disabled", false);
                if (jsonData[0].dReceiptDate == "1-1-1900" || jsonData[0].dReceiptDate == "1900-01-01T00:00:00") {
                    $("#txtReceiptDateTime").val("").prop("disabled", false);
                    $('#txtReceiptDateTime').data("DateTimePicker").clear();
                }
                else {
                    var MonthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    var txtreceiptdatetime = jsonData[0].dReceiptDate
                    var date = txtreceiptdatetime.split("-");
                    var result = date[2].split("T")
                    var time = result[1].split(":");
                    var monthinid = parseInt(date[1]);
                    var datetime = result[0] + "-" + MonthList[monthinid - 1] + "-" + date[0] + " " + time[0] + ":" + time[1];
                    $("#txtReceiptDateTime").val(datetime).prop("disabled", false);
                }
                $("#RefNo").val(jsonData[0].vReceiptRefNo).prop("disabled", false);
                $("#ShipmentNo").val(jsonData[0].vShipmentNo).prop("disabled", false);

                // For Transporter
                $('#TransportMode').val(jsonData[0].nTransporterNo).attr("selected", "selected").prop("disabled", false);
                var Transportmodename = $("#TransportMode :selected").text();
                if (Transportmodename.toLowerCase() == 'other') {
                    $("#divOtherTransportMode").hide();
                    vOtherTransportMode.focus();
                }
                else {
                    $("#divOtherTransportMode").hide();
                }

                if (jsonData[0].dExpiryDate == "1-1-1900" || jsonData[0].dExpiryDate == "1900-01-01T00:00:00" || jsonData[0].dExpiryDate == "1990-01-01T00:00:00") {
                    $("#ExpiryDate").val("");
                    $("#ExpiryDate").attr("placeholder", "Not Applicable")
                }
                else {
                    //$("#ExpiryDate").val(jsonData[0].dExpiryDate);
                    //reexpirydate = jsonData[0].dExpiryDate;
                    if (jsonData[0].dExpiryDate != null) {
                        var MonthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                        var tmpexpirtydate = jsonData[0].dExpiryDate
                        var date = tmpexpirtydate.split("-");
                        var result = date[2].split("T")
                        var time = result[1].split(":");
                        var monthinid = parseInt(date[1]);

                        if (jsonData[0].cIsExpDate == "M") {
                            var datetime = MonthList[monthinid - 1] + "-" + date[0];
                        } else {
                            var datetime = result[0] + "-" + MonthList[monthinid - 1] + "-" + date[0];
                        }


                        $("#ExpiryDate").val(datetime);
                    }
                    else {
                        $("#ExpiryDate").attr("placeholder", "Re-test/Expiry/Provisional expiry date")
                    }

                }

                $("#vOtherTransportMode").val(jsonData[0].vOtherTransportName).prop("disabled", false);
                $("#txtConditionofPackRecd").val(jsonData[0].vConditionofPackRecd).prop("disabled", false);
                $("#NoofBoxes").val(jsonData[0].iNoOfBoxes).prop("disabled", false);
                $("#NoofQty").val(jsonData[0].iNoOfQtyBox).prop("disabled", false);
                $("#txtVerifyQuantityRecd").val(jsonData[0].vVerificationofQtyRecd);
                $("#RecdQty").val(jsonData[0].iReceivedQty).prop("disabled", false);
                $("#ddlConditionofProducts").val(jsonData[0].cConditionProducts).prop("disabled", false);
                $("#txtRemarks").prop("disabled", false);
                $("#btnSavePmsProductReceipt").show();
                $("#btnSaveContinuePmsProductReceipt").hide();
                $("#btnClearPmsProductReceipt").show();
                $("#btnAddTempProductReceipt").hide();
                $("#ProjectNo").val($("#ddlProjectNodashboard").val())
                $("#ProjectNo").prop('disabled', 'disabled');
                $(".headercontrol").prop('disabled', '');

                // For Selection of Storage Area
                var data = jsonData[0].vStorageArea
                var dataarray = data.split(",");
                $("#StorageArea").val(dataarray);
                $("#StorageArea").multiselect("refresh");
                jQuery("#titleMode").text('Mode:-Edit');

                $("#ddlTransferIndi").val(jsonData[0].cTransferIndi.trim());
                TransferIndication(SaveContinueFlag);
                if (TransferIndi == "K") {
                    $("#txtNoofKit").val("1");
                    $("#txtNoofKit").prop("disabled", "disabled");
                    $("#divTransferReceiptType").attr('style', 'display:none');
                }
                else if (TransferIndi == "P") {
                    $("#divTransferReceiptType").attr('style', 'display:none');
                }
                else {
                    $("#divTransferReceiptType").attr('style', 'display:none');
                }

                $("#ddlReceiptType").val(jsonData[0].cReceiptType).prop("disabled", false);
                $("#ddlTransferIndi").prop("disabled", false);
                $("#ddlProductType").prop("disabled", false);

                $("#txtNoOfContainers").val(jsonData[0].iNoOfContainers).prop("disabled", false);

                $("#ddlTempRecd").val(jsonData[0].cIsTempRecd.trim()).attr("selected", "selected").prop("disabled", false);
                $("#ddlCoaRecd").val(jsonData[0].cIsCOARecd.trim()).attr("selected", "selected").prop("disabled", false);
                $("#ddlGmpRecd").val(jsonData[0].cIsGMPRecd.trim()).attr("selected", "selected").prop("disabled", false);
                $("#ddlUnit").val(jsonData[0].vUnit).prop("disabled", false);

                if (jsonData[0].cIsTempRecd.trim().toLowerCase() == "y") {
                    $("#divTempNumber").hide();
                    //rinkal
                    $("#tempNumber").val(jsonData[0].nTempNumber).prop("disabled", false);
                }
                else {
                    $("#divTempNumber").hide();
                }

                if (jsonData[0].cIsCOARecd.trim().toLowerCase() == "y") {
                    if (jsonData[0].dCOAdate == "1-1-1900" || jsonData[0].dCOAdate == "1900-01-01T00:00:00" || jsonData[0].dCOAdate == "1990-01-01T00:00:00") {
                        $("#COADate").val("").prop("disabled", false);
                        $("#COADate").attr("placeholder", "COA Receipt Date")
                    }
                    else {
                        var MonthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                        var txtCOAdatetime = jsonData[0].dCOAdate
                        var date = txtCOAdatetime.split("-");
                        var result = date[2].split("T")
                        var time = result[1].split(":");
                        var monthinid = parseInt(date[1]);
                        var datetime = result[0] + "-" + MonthList[monthinid - 1] + "-" + date[0];
                        $("#COADate").val(datetime).prop("disabled", false);
                    }
                }
                else {
                    $("#divCOAdate").hide();
                }
                if (jsonData[0].cIsGMPRecd.trim().toLowerCase() == "y") {
                    if (jsonData[0].dGMPdate == "1-1-1900" || jsonData[0].dGMPdate == "1900-01-01T00:00:00" || jsonData[0].dGMPdate == "1990-01-01T00:00:00") {
                        $("#GMPDate").val("").prop("disabled", false);
                        $('#GMPDate').attr("placeholder", "GMP Receipt Date")
                    }
                    else {
                        var MonthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                        var txtGMPdatetime = jsonData[0].dGMPdate
                        var date = txtGMPdatetime.split("-");
                        var result = date[2].split("T")
                        var time = result[1].split(":");
                        var monthinid = parseInt(date[1]);
                        var datetime = result[0] + "-" + MonthList[monthinid - 1] + "-" + date[0];
                        $("#GMPDate").val(datetime).prop("disabled", false);
                    }
                }
                else {
                    $("#divGMPdate").hide();
                }
                if (jsonData[0].vPurpose.toLowerCase() == "other") {
                    $("#divOtherPurpose").show();
                    $("#vOtherPurpose").val(jsonData[0].vPurpose).prop("disabled", false);

                }
                else {
                    if (jsonData[0].vPurpose == '') {
                        $("#ddlPurpose").val('Please Select Purpose').attr("selected", "selected").prop("disabled", false);
                    }
                    else {
                        $("#ddlPurpose").val(jsonData[0].vPurpose).attr("selected", "selected").prop("disabled", false);
                    }
                    //$("#ddlPurpose").text(jsonData[0].vPurpose).attr("selected", "selected").prop("disabled", false);

                    $("#divOtherPurpose").hide();

                }
            }


        }
    }
    else if (e.title == "View") {
        var GetAllTransportMode = {
            //Url: BaseUrl + "PmsGeneral/GetAllTransportMode",  ''' Chnage Fo Location Wise
            Url: BaseUrl + "PmsTransporterMaster/AllTransporterData",
            SuccessMethod: "SuccessMethod"
        }
        GetPmsProductReceiptTransportMode(GetAllTransportMode.Url, GetAllTransportMode.SuccessMethod, "Yes");


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
            $('#Product').val(jsonData[0].nProductNo).attr("selected", "selected").prop("disabled", "disabled");
            $('#BatchLotNo').val(jsonData[0].nStudyProductBatchNo).attr("selected", "selected").prop("disabled", "disabled");
            $("#RecdFromLocation").val(jsonData[0].vReceivedFrom).prop("disabled", "disabled");
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
                var datetime = result[0] + "-" + MonthList[monthinid - 1] + "-" + date[0] + " " + time[0] + ":" + time[1];
                $("#txtReceiptDateTime").val(datetime).prop("disabled", "disabled");
            }
            $("#RefNo").val(jsonData[0].vReceiptRefNo).prop("disabled", "disabled");
            $("#ShipmentNo").val(jsonData[0].vShipmentNo).prop("disabled", "disabled");
            $("#ddlUnit").val(jsonData[0].vUnit).prop("disabled", "disabled");

            // For Transporter
            $('#TransportMode').val(jsonData[0].nTransporterNo).attr("selected", "selected").prop("disabled", "disabled");
            var Transportmodename = $("#TransportMode :selected").text();
            if (Transportmodename.toLowerCase() == 'other') {
                $("#divOtherTransportMode").hide();
                vOtherTransportMode.focus();
            }
            else {
                $("#divOtherTransportMode").hide();
            }

            if (jsonData[0].dExpiryDate == "1-1-1900" || jsonData[0].dExpiryDate == "1900-01-01T00:00:00" || jsonData[0].dExpiryDate == "1990-01-01T00:00:00") {
                $("#ExpiryDate").val("").prop("disabled", "disabled");
                $("#ExpiryDate").attr("placeholder", "Not Applicable")
            }
            else {
                //$("#ExpiryDate").val(jsonData[0].dExpiryDate).prop("disabled", "disabled");
                //reexpirydate = jsonData[0].dExpiryDate;
                if (jsonData[0].dExpiryDate != null) {
                    var MonthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    var tmpexpirtydate = jsonData[0].dExpiryDate
                    var date = tmpexpirtydate.split("-");
                    var result = date[2].split("T")
                    var time = result[1].split(":");
                    var monthinid = parseInt(date[1]);

                    if (jsonData[0].cIsExpDate == "M") {
                        var datetime = MonthList[monthinid - 1] + "-" + date[0];
                    } else {
                        var datetime = result[0] + "-" + MonthList[monthinid - 1] + "-" + date[0];
                    }


                    $("#ExpiryDate").val(datetime);
                }

            }

            $("#vOtherTransportMode").val(jsonData[0].vOtherTransportName).prop("disabled", "disabled");
            $("#txtConditionofPackRecd").val(jsonData[0].vConditionofPackRecd).prop("disabled", "disabled");
            $("#NoofBoxes").val(jsonData[0].iNoOfBoxes).prop("disabled", "disabled");
            $("#NoofQty").val(jsonData[0].iNoOfQtyBox).prop("disabled", "disabled");
            $("#txtVerifyQuantityRecd").val(jsonData[0].vVerificationofQtyRecd).prop("disabled", "disabled");
            $("#RecdQty").val(jsonData[0].iReceivedQty).prop("disabled", "disabled");
            $("#ddlConditionofProducts").val(jsonData[0].cConditionProducts).prop("disabled", "disabled");
            $("#txtRemarks").val(jsonData[0].vRemarks).prop("disabled", "disabled");
            $("#btnSavePmsProductReceipt").hide();
            $("#btnSaveContinuePmsProductReceipt").hide();
            $("#btnAddTempProductReceipt").hide();
            $("#btnClearPmsProductReceipt").hide();

            $("#ProjectNo").val($("#ddlProjectNodashboard").val()).prop("disabled", "disabled")
            $("#ProjectNo").prop('disabled', 'disabled');
            $(".headercontrol").prop('disabled', 'disabled');
            $(".multiselect ").prop('disabled', 'disabled')
            // For Selection of Storage Area
            var data = jsonData[0].vStorageArea
            var dataarray = data.split(",");
            $("#StorageArea").val(dataarray).prop("disabled", "disabled");
            $("#StorageArea").multiselect("refresh");
            jQuery("#titleMode").text('Mode:-View');

            $("#ddlTransferIndi").val(jsonData[0].cTransferIndi.trim()).prop("disabled", "disabled");
            TransferIndication(SaveContinueFlag);
            if (TransferIndi == "K") {
                $("#txtNoofKit").val("1");
                $("#txtNoofKit").prop("disabled", "disabled");
                $("#divTransferReceiptType").attr('style', 'display:none');
            }
            else if (TransferIndi == "P") {
                $("#divTransferReceiptType").attr('style', 'display:none');
            }
            else {
                $("#divTransferReceiptType").attr('style', 'display:none');
            }

            $("#ddlReceiptType").val(jsonData[0].cReceiptType).prop("disabled", "disabled");
            $("#ddlTransferIndi").prop("disabled", "disabled");
            $("#ddlProductType").prop("disabled", "disabled");

            $("#txtNoOfContainers").val(jsonData[0].iNoOfContainers).prop("disabled", "disabled");

            $("#ddlTempRecd").val(jsonData[0].cIsTempRecd.trim()).attr("selected", "selected").prop("disabled", "disabled");
            $("#ddlCoaRecd").val(jsonData[0].cIsCOARecd.trim()).attr("selected", "selected").prop("disabled", "disabled");
            $("#ddlGmpRecd").val(jsonData[0].cIsGMPRecd.trim()).attr("selected", "selected").prop("disabled", "disabled");

            if (jsonData[0].cIsTempRecd.trim().toLowerCase() == "y") {
                $("#divTempNumber").hide();
                //rinkal
                $("#tempNumber").val(jsonData[0].nTempNumber).prop("disabled", "disabled");
            }
            else {
                $("#divTempNumber").hide();
            }

            if (jsonData[0].cIsCOARecd.trim().toLowerCase() == "y") {
                if (jsonData[0].dCOAdate == "1-1-1900" || jsonData[0].dCOAdate == "1900-01-01T00:00:00" || jsonData[0].dCOAdate == "1990-01-01T00:00:00") {
                    $("#COADate").val("").prop("disabled", "disabled");
                    $("#COADate").attr("placeholder", "COA Receipt Date");
                }
                else {
                    var MonthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    var txtCOAdatetime = jsonData[0].dCOAdate
                    var date = txtCOAdatetime.split("-");
                    var result = date[2].split("T")
                    var time = result[1].split(":");
                    var monthinid = parseInt(date[1]);
                    var datetime = result[0] + "-" + MonthList[monthinid - 1] + "-" + date[0] + " " + time[0] + ":" + time[1];
                    $("#COADate").val(datetime).prop("disabled", "disabled");
                }
            }
            else {
                $("#divCOAdate").hide();
            }
            if (jsonData[0].cIsGMPRecd.trim().toLowerCase() == "y") {
                if (jsonData[0].dGMPdate == "1-1-1900" || jsonData[0].dGMPdate == "1900-01-01T00:00:00" || jsonData[0].dGMPdate == "1990-01-01T00:00:00") {
                    $("#GMPDate").val("").prop("disabled", "disabled");
                    $("#GMPDate").attr("placeholder", "GMP Receipt Date");
                }
                else {
                    var MonthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    var txtGMPdatetime = jsonData[0].dGMPdate
                    var date = txtGMPdatetime.split("-");
                    var result = date[2].split("T")
                    var time = result[1].split(":");
                    var monthinid = parseInt(date[1]);
                    var datetime = result[0] + "-" + MonthList[monthinid - 1] + "-" + date[0];
                    $("#GMPDate").val(datetime).prop("disabled", "disabled");
                }
            }
            else {
                $("#divGMPdate").hide();
            }
            if (jsonData[0].vPurpose.toLowerCase() == "other") {
                $("#divOtherPurpose").show();
                $("#vOtherPurpose").val(jsonData[0].vPurpose).prop("disabled", "disabled");

            }
            else {
                $("#ddlPurpose").val(jsonData[0].vPurpose).attr("selected", "selected").prop("disabled", "disabled");
                $("#divOtherPurpose").hide();

            }
            $('#BatchLotNo').val(jsonData[0].nStudyProductBatchNo).attr("selected", "selected").prop("disabled", "disabled");
            $("#NoofBoxes").val(jsonData[0].iNoOfBoxes).prop("disabled", "disabled");
        }
    }
}

function pmsProductReceiptAuditTrail(nTransactionNo) {
    ExportToExcelAuditTrail(nTransactionNo);

    $.ajax({
        url: BaseUrl + "IPReturn/GetProductReceiptAudit/" + nTransactionNo + "",
        type: 'GET',
        success: SuccessAuditTrail,
        error: function () {
            SuccessorErrorMessageAlertBox("Audit Trail data not found.", ModuleName);
        }
    });

    function SuccessAuditTrail(jsonData) {
        var ActivityDataset = [];
        for (var i = 0; i < jsonData.length; i++) {
            var InDataset = [];
            var receiptdate = "";
            var operation = "";

            if (jsonData[i].iQAReviewBy != null) {
                operation = "Review"
            }
            else {
                operation = jsonData[i].Operation
            }

            if (jsonData[i].dReceiptDate != null) {
                var tempreceiptdate = jsonData[i].dReceiptDate.split(" ");
                receiptdate = tempreceiptdate[0] + " " + tempreceiptdate[1];
            }
            InDataset.push(
                jsonData[i].vProjectNo, jsonData[i].vStorageLocationName, jsonData[i].vReceivedFrom, receiptdate, jsonData[i].vReceiptRefNo,
                jsonData[i].vShipmentNo, jsonData[i].cProductType, jsonData[i].vConditionofPackRecd, jsonData[i].Transporter, jsonData[i].ReceiptType,
                jsonData[i].vProductName,
                jsonData[i].vBatchLotNo, jsonData[i].dExpiryDate, jsonData[i].iNoOfBoxes, jsonData[i].iNoOfQtyBox, jsonData[i].iReceivedQty, jsonData[i].vUnit,
                jsonData[i].vStorageAreaName, jsonData[i].iNoOfContainers, jsonData[i].cIsTempRecd, jsonData[i].nTempNumber, jsonData[i].cIsCOARecd, jsonData[i].cIsGMPRecd,
                 jsonData[i].dCOAdate, jsonData[i].dGMPdate, jsonData[i].vPurpose, jsonData[i].cConditionProducts, jsonData[i].AdditionalRemarks,
                 operation,
               jsonData[i].vModifyBy, jsonData[i].dModifyOn, jsonData[i].cIsQAReview, jsonData[i].vQARemarks, jsonData[i].iQAReviewBy, jsonData[i].dQAReviewOn);

            ActivityDataset.push(InDataset);
        }
        otable = $('#tblProductReceiptAuditTrail').dataTable({
            "bJQueryUI": true,
            "sPaginationType": "full_numbers",
            "bLengthChange": true,
            "iDisplayLength": 10,
            "bProcessing": true,
            "bSort": false,
            "autoWidth": false,
            "aaData": ActivityDataset,
            "bInfo": true,
            "bAutoWidth": false,
            "bDestroy": true,
            "sScrollX": "100%",
            "sScrollXInner": "4000" /* It varies dynamically if number of columns increases */,
            "fnCreatedRow": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                if (aData[28] == "C") {
                    $(nRow).addClass('highlightSaveContinue');
                }
            },
            "aoColumns": [
                 { "sTitle": "Project No" },//0
                { "sTitle": "Storage Location" },//1
                { "sTitle": "Received From" },//2
                { "sTitle": "Receipt Date" },//3
                { "sTitle": "Reference No" },//4
                { "sTitle": "Shipment No" },//5
                { "sTitle": "Product Type" },//6
                { "sTitle": "Condition of pack received" },//7
                { "sTitle": "Transporter Name" },//8
                { "sTitle": "Receipt Type" },//9
                { "sTitle": "Product Name" },//10
                { "sTitle": "Batch/Lot/Lot No" },//11
                { "sTitle": "Re-test/Expiry/Provisional expiry date" },//12
                { "sTitle": "Noof Boxes" },//13
                { "sTitle": "No of Qty Per Box" },//14
                { "sTitle": "Received Qty" },//15
                  { "sTitle": "Unit" },//16
                { "sTitle": "Storage Area" },//17
                { "sTitle": "No Bin/Pallet/Crate/Locker/Container/Shelf/Box/Boxes/Rack" },//18
                { "sTitle": "Temperature Data Logger" },//19
                { "sTitle": "Temperature Data Logger Number" },//20
                { "sTitle": "COA received" },//21
                { "sTitle": "GMP Certificate received" },//22
                { "sTitle": "COA receipt date" },//23
                { "sTitle": "GMP receipt date" },//24
                { "sTitle": "Purpose" },//25
                { "sTitle": "Condition of Products" },//26
                { "sTitle": "Remarks" }, //27   //Additional Remarks
                { "sTitle": "Operation" },//28
                //{ "sTitle": "Remarks" },
                { "sTitle": "Modify By" },//29
                { "sTitle": "Modify On" },//30
                { "sTitle": "QA Review Status" },//31
                { "sTitle": "QA Review Remarks" },//32
                { "sTitle": "QA Review By" },//33
                { "sTitle": "QA Review On" },//34
            ],
            "columnDefs": [
                   {
                       targets: [20, 31, 32, 33, 34, 9, 5, 7, 8, 13, 14, 26, 25, 21, 23, 22, 24, 18, 16, 18],
                       render: function (data, type, row) {
                           return data == null ? '' : data
                       }
                   },

                { "width": "3%", "targets": 0 },
                { "width": "4%", "targets": 1 },
                { "width": "3%", "targets": 2 },
                { "width": "3%", "targets": 3 },
                { "width": "3%", "targets": 4 },
                { "width": "4%", "targets": 5 },
                { "width": "5%", "targets": 6 },
                { "width": "5%", "targets": 7 },
                { "width": "4%", "targets": 8 },
                { "width": "4%", "targets": 9 },
                { "width": "4%", "targets": 10 },
                { "width": "4%", "targets": 11 },
                { "width": "3%", "targets": 12 },
                { "width": "4%", "targets": 13 },
                { "width": "3%", "targets": 14 },
                { "width": "3%", "targets": 15 },
                { "width": "3%", "targets": 16 },
                { "width": "3%", "targets": 17 },
                { "width": "3%", "targets": 18 },
                { "width": "3%", "targets": 19 },
                { "width": "5%", "targets": 20 },
                { "width": "5%", "targets": 21 },
                { "width": "4%", "targets": 22 },
                { "width": "4%", "targets": 23 },
                { "width": "4%", "targets": 24 },
                { "width": "4%", "targets": 25 },
                { "width": "4%", "targets": 26 },
                { "width": "4%", "targets": 27 },
                { "width": "4%", "targets": 28 },
                { "width": "5%", "targets": 29 },
                { "width": "4%", "targets": 30 },
                { "width": "4%", "targets": 31 },
                { "width": "4%", "targets": 32 },
                { "width": "4%", "targets": 33 },
                { "width": "4%", "targets": 34 },

            ],
            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },
        });
    }
}

function ExportToExcelAuditTrail(nTransactionNo) {
    var Data_Export = {
        nTransactionNo: nTransactionNo,
    }
    var url = WebUrl + "IPReturn/GetExportToExcelDetailsAuditTrail";
    $.ajax({
        url: url,
        type: 'get',
        data: { id: nTransactionNo },
        success: function (data) {

        },
        error: function () {
            SuccessorErrorMessageAlertBox("Error in export to excel details.", ModuleName);
        }
    });
}

function SaveandContinue() {
    var ntransactionno = $("#nTransactionno").val();
    var nspttransactiondtlno = $("#nSPTTransactionDtlNo").val();

    if (ntransactionno != "" && nspttransactiondtlno != "") {
        if (isBlank(document.getElementById('txtReason').value)) {
            $("#btnSaveContinuePmsProductReceipt").hide();
            $("#btnSavePmsProductReceipt").show();
            ValidationAlertBox("Please enter Remarks.", "txtReason", ModuleName);
            return false;
        }
    }
    if (productIds[$('#ProjectNo').val()] != undefined) {
        setworkspaceid = productIds[$('#ProjectNo').val()];
    }

    if (ntransactionno == "" && nspttransactiondtlno == "") {
        var InsertPmsProductReceipt1 = {
            vWorkSpaceId: setworkspaceid,
            nStorageLocationNo: $("#StorageName").val(),
            vReceivedFrom: $("#RecdFromLocation").val(),
            vReceiptRefNo: $("#RefNo").val(),
            vShipmentNo: "",
            iModifyBy: $("#hdnuserid").val(),
            vDocTypeCode: "ASAN",
            nTransactionNo: "1",
            nTransporterNo: $("#TransportMode :selected").val(),
            vOtherTransportName: $("#vOtherTransportMode").val(),
            dReceiptDate: $("#txtReceiptDateTime").val(),
            nProductTypeID: $("#ddlProductType :selected").val(),
            cSaveContinueFlag: "C",
            vConditionofPackRecd: $("#txtConditionofPackRecd").val(),
            vRemarks: $("#txtReason").val(),
            cTransferIndi: TransferIndi,
            cReceiptType: "",
        }
    }
    else if (ntransactionno != "" && nspttransactiondtlno != "") {
        var InsertPmsProductReceipt1 = {
            vWorkSpaceId: setworkspaceid,
            nStorageLocationNo: $("#StorageName").val(),
            vReceivedFrom: $("#RecdFromLocation").val(),
            vReceiptRefNo: $("#RefNo").val(),
            vShipmentNo: "",
            iModifyBy: $("#hdnuserid").val(),
            vDocTypeCode: "ASAN",
            nTransactionNo: $("#nTransactionno").val(),
            nTransporterNo: $("#TransportMode :selected").val(),
            vOtherTransportName: $("#vOtherTransportMode").val(),
            dReceiptDate: $("#txtReceiptDateTime").val(),
            nProductTypeID: $("#ddlProductType :selected").val(),
            cSaveContinueFlag: "C",
            DataOPMode: 3,
            vConditionofPackRecd: $("#txtConditionofPackRecd").val(),
            vRemarks: $("#txtReason").val(),
            cTransferIndi: TransferIndi,
            cReceiptType: "",
        }
    }
    var InsertProductReceiptData = {
        Url: BaseUrl + "IPReturn/InsertPmsProductReceiptHeader",
        SuccessMethod: "SuccessMethod",
        Data: InsertPmsProductReceipt1
    }
    InsertPmsProductReceiptMaster1(InsertProductReceiptData.Url, InsertProductReceiptData.SuccessMethod, InsertProductReceiptData.Data);
}

$("#ddlReceiptType").on("change", function () {
    var ReceiptType = $("#ddlReceiptType").val();

    if (ReceiptType == "T") {
        GetTransferQtyForReceipt();
    }
    else if (SaveContinueFlag == true) { }
    else {
        $("#RecdQty").val("");
        $("#NoofBoxes").val("");
        $("#NoofBoxes").prop('disabled', '');
        $("#NoofQty").val("");
        $("#NoofQty").prop('disabled', '');
    }
});

function GetTransferQtyForReceipt() {
    var nProductTYpeID = $("#ddlProductType").val();
    var PMSStudyProductDatat = {
        vWorkSpaceID: setworkspaceid,
        nProductTypeID: nProductTYpeID
    }

    var Proc_GetTransferQtyForReceipt = {
        Url: BaseUrl + "PmsGeneral/Proc_GetTransferQtyForReceipt",
        SuccessMethod: "SuccessMethod",
        Data: PMSStudyProductDatat
    }

    $.ajax({
        url: Proc_GetTransferQtyForReceipt.Url,
        type: 'POST',
        data: Proc_GetTransferQtyForReceipt.Data,
        async: false,
        success: SuccessMethod,
        error: function () {
            alert("Data not found.");
            ValidationAlertBox("Data not found.", "ddlReceiptType", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        if (jsonData == null) {
            ValidationAlertBox("By Transfer Quantity is zero so you can not select By Transfer option.", "ddlReceiptType", ModuleName);
            $("#ddlReceiptType").val("0");
            $("#NoofBoxes").prop('disabled', '');
            $("#NoofQty").prop('disabled', '');
        }
        else if (jsonData.length > 0) {
            if (jsonData[0].iReceivedQty != 0) {
                $("#RecdQty").val(jsonData[0].iReceivedQty);
                $("#NoofBoxes").val("0");
                $("#NoofBoxes").prop('disabled', 'disabled');
                $("#NoofQty").val("0");
                $("#NoofQty").prop('disabled', 'disabled');
            }
            else {
                $("#RecdQty").val("");
                $("#NoofBoxes").val("0");
                $("#NoofBoxes").prop('disabled', '');
                $("#NoofQty").val("0");
                $("#NoofQty").prop('disabled', '');
                ValidationAlertBox("By Transfer Quantity is zero so you can not select By Transfer option.", "ddlReceiptType", ModuleName);
                $("#ddlReceiptType").val("0");
            }
        }
    }
}

$("#ddlPurpose").on("change", function () {
    var purposename = $("#ddlPurpose :selected").text();
    if (purposename.toLowerCase() == 'other') {
        $("#vOtherPurpose").val('');
        $("#divOtherPurpose").show();
        vOtherPurpose.focus();
    }
    else {
        $("#divOtherPurpose").hide();
    }
});

$("#ddlTempRecd").on("change", function () {
    var purposename = $("#ddlTempRecd :selected").text();
    if (purposename.toLowerCase() == 'yes') {
        tempNumber.value = "";
        $("#divTempNumber").hide();
        tempNumber.focus();
    }
    else {
        $("#divTempNumber").hide();
    }
});

$("#ddlGmpRecd").on("change", function () {
    var purposename = $("#ddlGmpRecd :selected").text();
    if (purposename.toLowerCase() == 'yes') {
        $("#divGMPdate").hide();
        GMPDate.focus();
    }
    else {
        $("#divGMPdate").hide();
    }
});

$("#ddlCoaRecd").on("change", function () {
    var purposename = $("#ddlCoaRecd :selected").text();
    if (purposename.toLowerCase() == 'yes') {
        $("#divCOAdate").hide();
        COADate.focus();
    }
    else {
        $("#divCOAdate").hide();
    }
});

function pmsStudyViewAuthenticate(e) {
    nTransactionNoQA = "";
    nTransactionDtlNoQA = "";
    nTransactionNoQA = $(e).attr("nTransactionNo");
    nTransactionDtlNoQA = $(e).attr("nSPTransactionDtlNo");
    var cSaveContinueFlagQA = $(e).attr("cSaveContinueFlag");
    var cIsQAReview = $(e).attr("cIsQAReview");

    if (cSaveContinueFlagQA == 'C') {
        ValidationAlertBox("This Receipt is in Edit mode.", "tblPmsProductReceiptData", ModuleName);
        return false;
    }
    if (cIsQAReview == 'Y') {
        return;
    }
    if (cIsQAReview == 'R') {
        return;
    }
    else {
        $('#ViewAuthenticate').modal('show');
    }

}

$("#btnOk").on("click", function () {
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
        vDocTypeCode: 'ASAN',
        cTransferIndi: TransferIndi,
        cIsQAReview: 'Y'

    }

    var InsertProductReceiptData = {
        Url: BaseUrl + "IPReturn/InsertPmsProductReceiptDtlQA",
        SuccessMethod: "SuccessMethod",
        Data: InsertPmsProductReceipt1
    }
    InsertPmsProductReceiptDtlQA(InsertProductReceiptData.Url, InsertProductReceiptData.SuccessMethod, InsertProductReceiptData.Data);
});

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
                GetDashBoardData();
                SuccessorErrorMessageAlertBox("IP Return/Adjustment reviewed successfully.", ModuleName);
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
        vDocTypeCode: 'ASAN',
        sessionPass: $("#hdnPassword").val(),
        Password: $("#txtPassword").val(),
        vQARemarks: $("#txtRemark").val(),
        cIsQAReview: 'R',
        iUserId: $("#hdnuserid").val(),
        cTransferIndi: TransferIndi,
    }

    //var InsertProductData = {
    //    Url: BaseUrl + "IPReturn/InsertPmsProductReceiptDtlQARejected",
    //    SuccessMethod: "SuccessMethod",
    //    Data: InsertPmsProductRet1
    //}
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
                SuccessorErrorMessageAlertBox("IP Return/Adjustment rejected successfully.", ModuleName);
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

function ValidateForm() {
    if (isBlank(document.getElementById('ProjectNo').value)) {
        ValidationAlertBox("Please Select Project !", "ProjectNo", ModuleName);
        return false;
    }
    if (Dropdown_Validation(document.getElementById("StorageName"))) {

        ValidationAlertBox("Please select Storage Name.", "StorageName", ModuleName);
        return false;
    }

    var ntransactionno = $("#nTransactionno").val();
    var nspttransactiondtlno = $("#nSPTTransactionDtlNo").val();
    var btntext = (document.getElementById("spnSaveProductReceipt").innerText).toLowerCase().trim()

    if (ntransactionno != "" && nspttransactiondtlno != "") {
        if (!$("#btnSaveContinuePmsProductReceipt").is(":visible")) {
            if (btntext == "save") {
                if (isBlank(document.getElementById('txtReceiptDateTime').value)) {
                    $("#btnSavePmsProductReceipt").show();
                    ValidationAlertBox("Please enter Receipt Date & Time.", "txtReceiptDateTime", ModuleName);
                    return false;
                }

                if (Dropdown_Validation(document.getElementById("ddlProductType"))) {

                    $("#btnSavePmsProductReceipt").show();
                    ValidationAlertBox("Please select Product Type.", "ddlProductType", ModuleName);
                    return false;
                }

                if (Dropdown_Validation(document.getElementById("ddlTransferIndi"))) {

                    $("#btnSavePmsProductReceipt").show();
                    ValidationAlertBox("Please select Product Indication.", "ddlTransferIndi", ModuleName);
                    return false;
                }

                //if (Dropdown_Validation(document.getElementById("TransportMode"))) {

                //    $("#btnSavePmsProductReceipt").show();
                //    ValidationAlertBox("Please select Transporter Name.", "TransportMode", ModuleName);
                //    return false;
                //}

                //if ($("#TransportMode :selected").text().toLowerCase() == "other") {
                //    if (isBlank(document.getElementById('vOtherTransportMode').value)) {

                //        $("#btnSavePmsProductReceipt").show();
                //        ValidationAlertBox("Please enter Other Transport Mode Name.", "vOtherTransportMode", ModuleName);
                //        return false;
                //    }
                //}

                //if ($("#ddlTransferIndi").val() == "P") {
                //    if (Dropdown_Validation(document.getElementById("ddlReceiptType"))) {
                //        ValidationAlertBox("Please select Receipt Type.", "ddlReceiptType", ModuleName);
                //        ddlReceiptType.focus();

                //        $("#btnSavePmsProductReceipt").show();
                //        return false;
                //    }
                //}


                if (TransferIndi == "P") {
                    if (Dropdown_Validation(document.getElementById("Product"))) {

                        $("#btnSavePmsProductReceipt").show();
                        ValidationAlertBox("Please select Product.", "Product", ModuleName);
                        return false;
                    }

                    if (Dropdown_Validation(document.getElementById("BatchLotNo"))) {

                        $("#btnSavePmsProductReceipt").show();
                        ValidationAlertBox("Please select Batch/Lot/Lot No.", "BatchLotNo", ModuleName);
                        return false;
                    }

                    if (isBlank(document.getElementById('NoofBoxes').value) || document.getElementById('NoofBoxes').value == "0") {

                        $("#btnSavePmsProductReceipt").show();
                        ValidationAlertBox("Please enter Number of Boxes.", "NoofBoxes", ModuleName);
                        return false;
                    }

                    if (isBlank(document.getElementById('NoofQty').value) || document.getElementById('NoofQty').value == "0") {

                        $("#btnSavePmsProductReceipt").show();
                        ValidationAlertBox("Please enter Number of Quantity.", "NoofQty", ModuleName);
                        return false;
                    }
                }
                else if (TransferIndi == "K") {
                    if (isBlank(document.getElementById('txtNoofKit').value) || document.getElementById('txtNoofKit').value == "0") {

                        $("#btnSavePmsProductReceipt").show();
                        ValidationAlertBox("Please enter Number of Kit.", "txtNoofKit", ModuleName);
                        return false;
                    }
                }

                if (isBlank(document.getElementById('RecdQty').value) || document.getElementById('RecdQty').value == "0") {

                    $("#btnSavePmsProductReceipt").show();
                    ValidationAlertBox("Please enter Received Quantity.", "RecdQty", ModuleName);
                    return false;
                }

                //if (Dropdown_Validation(document.getElementById("ddlUnit")) || document.getElementById("ddlUnit").value == "") {
                //    ValidationAlertBox("Please select Unit.", "ddlUnit", ModuleName);
                //    return false;
                //}

                //if ($("#ddlTempRecd").val() == "Y") {
                //    if (isBlank(document.getElementById('tempNumber').value) || document.getElementById('tempNumber').value <= 0) {
                //        ValidationAlertBox("Please enter Temperature data logger number.", "tempNumber", ModuleName);
                //        return false;
                //    }
                //}

                //if ($("#ddlCoaRecd").val() == "Y") {
                //    if (isBlank(document.getElementById('COADate').value)) {
                //        ValidationAlertBox("Please enter COA receipt date.", "COADate", ModuleName);
                //        return false;
                //    }
                //}
                //if ($("#ddlGmpRecd").val() == "Y") {
                //    if (isBlank(document.getElementById('GMPDate').value)) {
                //        ValidationAlertBox("Please enter GMP receipt date.", "GMPDate", ModuleName);
                //        return false;
                //    }
                //}

                //if (isBlank(document.getElementById('txtNoOfContainers').value) || document.getElementById('txtNoOfContainers').value <= 0) {
                //    ValidationAlertBox("Please enter No of Container.", "txtNoOfContainers", ModuleName);
                //    return false;
                //}

                if (isBlank(document.getElementById('StorageArea').value)) {

                    $("#btnSavePmsProductReceipt").show();
                    ValidationAlertBox("Please enter Storage Area.", "StorageArea", ModuleName);
                    return false;
                }

                if (isBlank(document.getElementById('txtRemarks').value)) {

                    $("#btnSavePmsProductReceipt").show();
                    ValidationAlertBox("Please enter Remarks.", "txtRemarks", ModuleName);
                    return false;
                }

            }
        } else {

            if (btntext == "save") {
                if (isBlank(document.getElementById('txtReceiptDateTime').value)) {
                    $("#btnSaveContinuePmsProductReceipt").hide();
                    $("#btnSavePmsProductReceipt").show();
                    ValidationAlertBox("Please enter Receipt Date & Time.", "txtReceiptDateTime", ModuleName);
                    return false;
                }

                if (Dropdown_Validation(document.getElementById("ddlProductType"))) {
                    $("#btnSaveContinuePmsProductReceipt").hide();
                    $("#btnSavePmsProductReceipt").show();
                    ValidationAlertBox("Please select Product Type.", "ddlProductType", ModuleName);
                    return false;
                }

                if (Dropdown_Validation(document.getElementById("ddlTransferIndi"))) {
                    $("#btnSaveContinuePmsProductReceipt").hide();
                    $("#btnSavePmsProductReceipt").show();
                    ValidationAlertBox("Please select Product Indication.", "ddlTransferIndi", ModuleName);
                    return false;
                }

                //if (Dropdown_Validation(document.getElementById("TransportMode"))) {
                //    $("#btnSaveContinuePmsProductReceipt").hide();
                //    $("#btnSavePmsProductReceipt").show();
                //    ValidationAlertBox("Please select Transporter Name.", "TransportMode", ModuleName);
                //    return false;
                //}

                //if ($("#TransportMode :selected").text().toLowerCase() == "other") {
                //    if (isBlank(document.getElementById('vOtherTransportMode').value)) {
                //        $("#btnSaveContinuePmsProductReceipt").hide();
                //        $("#btnSavePmsProductReceipt").show();
                //        ValidationAlertBox("Please enter Other Transport Mode Name.", "vOtherTransportMode", ModuleName);
                //        return false;
                //    }
                //}

                //if ($("#ddlTransferIndi").val() == "P") {
                //    if (Dropdown_Validation(document.getElementById("ddlReceiptType"))) {
                //        ValidationAlertBox("Please select Receipt Type.", "ddlReceiptType", ModuleName);
                //        ddlReceiptType.focus();
                //        $("#btnSaveContinuePmsProductReceipt").hide();
                //        $("#btnSavePmsProductReceipt").show();
                //        return false;
                //    }
                //}


                if (TransferIndi == "P") {
                    if (Dropdown_Validation(document.getElementById("Product"))) {
                        $("#btnSaveContinuePmsProductReceipt").hide();
                        $("#btnSavePmsProductReceipt").show();
                        ValidationAlertBox("Please select Product.", "Product", ModuleName);
                        return false;
                    }

                    if (Dropdown_Validation(document.getElementById("BatchLotNo"))) {
                        $("#btnSaveContinuePmsProductReceipt").hide();
                        $("#btnSavePmsProductReceipt").show();
                        ValidationAlertBox("Please select Batch/Lot/Lot No.", "BatchLotNo", ModuleName);
                        return false;
                    }

                    if (isBlank(document.getElementById('NoofBoxes').value) || document.getElementById('NoofBoxes').value == "0") {
                        $("#btnSaveContinuePmsProductReceipt").hide();
                        $("#btnSavePmsProductReceipt").show();
                        ValidationAlertBox("Please enter Number of Boxes.", "NoofBoxes", ModuleName);
                        return false;
                    }

                    if (isBlank(document.getElementById('NoofQty').value) || document.getElementById('NoofQty').value == "0") {
                        $("#btnSaveContinuePmsProductReceipt").hide();
                        $("#btnSavePmsProductReceipt").show();
                        ValidationAlertBox("Please enter Number of Quantity.", "NoofQty", ModuleName);
                        return false;
                    }
                }
                else if (TransferIndi == "K") {
                    if (isBlank(document.getElementById('txtNoofKit').value) || document.getElementById('txtNoofKit').value == "0") {
                        $("#btnSaveContinuePmsProductReceipt").hide();
                        $("#btnSavePmsProductReceipt").show();
                        ValidationAlertBox("Please enter Number of Kit.", "txtNoofKit", ModuleName);
                        return false;
                    }
                }

                if (isBlank(document.getElementById('RecdQty').value) || document.getElementById('RecdQty').value == "0") {
                    $("#btnSaveContinuePmsProductReceipt").hide();
                    $("#btnSavePmsProductReceipt").show();
                    ValidationAlertBox("Please enter Received Quantity.", "RecdQty", ModuleName);
                    return false;
                }

                //if (Dropdown_Validation(document.getElementById("ddlUnit")) || document.getElementById("ddlUnit").value == "") {
                //    $("#btnSaveContinuePmsProductReceipt").hide();
                //    $("#btnSavePmsProductReceipt").show();
                //    ValidationAlertBox("Please select Unit.", "ddlUnit", ModuleName);
                //    return false;
                //}

                //if ($("#ddlTempRecd").val() == "Y") {
                //    if (isBlank(document.getElementById('tempNumber').value) || document.getElementById('tempNumber').value <= 0) {
                //        ValidationAlertBox("Please enter Temperature data logger number.", "tempNumber", ModuleName);
                //        return false;
                //    }
                //}

                //if ($("#ddlCoaRecd").val() == "Y") {
                //    if (isBlank(document.getElementById('COADate').value)) {
                //        ValidationAlertBox("Please enter COA receipt date.", "COADate", ModuleName);
                //        return false;
                //    }
                //}
                //if ($("#ddlGmpRecd").val() == "Y") {
                //    if (isBlank(document.getElementById('GMPDate').value)) {
                //        ValidationAlertBox("Please enter GMP receipt date.", "GMPDate", ModuleName);
                //        return false;
                //    }
                //}

                //if (isBlank(document.getElementById('txtNoOfContainers').value) || document.getElementById('txtNoOfContainers').value <= 0) {
                //    ValidationAlertBox("Please enter No of Container.", "txtNoOfContainers", ModuleName);
                //    return false;
                //}

                if (isBlank(document.getElementById('StorageArea').value)) {
                    $("#btnSaveContinuePmsProductReceipt").hide();
                    $("#btnSavePmsProductReceipt").show();
                    ValidationAlertBox("Please enter Storage Area.", "StorageArea", ModuleName);
                    return false;
                }

                if (isBlank(document.getElementById('txtRemarks').value)) {
                    $("#btnSaveContinuePmsProductReceipt").hide();
                    $("#btnSavePmsProductReceipt").show();
                    ValidationAlertBox("Please enter Remarks.", "txtRemarks", ModuleName);
                    return false;
                }

            }
        }
    }
    else {
        if (btntext == "save") {
            if (isBlank(document.getElementById('txtReceiptDateTime').value)) {
                //$("#btnSaveContinuePmsProductReceipt").show();
                //$("#btnSavePmsProductReceipt").show();
                ValidationAlertBox("Please enter Receipt Date & Time.", "txtReceiptDateTime", ModuleName);
                return false;
            }

            if (Dropdown_Validation(document.getElementById("ddlProductType"))) {
                //$("#btnSaveContinuePmsProductReceipt").show();
                //$("#btnSavePmsProductReceipt").show();
                ValidationAlertBox("Please select Product Type.", "ddlProductType", ModuleName);
                return false;
            }

            if (Dropdown_Validation(document.getElementById("ddlTransferIndi"))) {
                //$("#btnSaveContinuePmsProductReceipt").show();
                //$("#btnSavePmsProductReceipt").show();
                ValidationAlertBox("Please select Product Indication.", "ddlTransferIndi", ModuleName);
                return false;
            }

            //if (Dropdown_Validation(document.getElementById("TransportMode"))) {
            //    //$("#btnSaveContinuePmsProductReceipt").show();
            //    //$("#btnSavePmsProductReceipt").show();
            //    ValidationAlertBox("Please select Transporter Name.", "TransportMode", ModuleName);
            //    return false;
            //}

            //if ($("#TransportMode :selected").text().toLowerCase() == "other") {
            //    if (isBlank(document.getElementById('vOtherTransportMode').value)) {
            //        //$("#btnSaveContinuePmsProductReceipt").show();
            //        //$("#btnSavePmsProductReceipt").show();
            //        ValidationAlertBox("Please enter Other Transport Mode Name.", "vOtherTransportMode", ModuleName);
            //        return false;
            //    }
            //}

            //if ($("#ddlTransferIndi").val() == "P") {
            //    if (Dropdown_Validation(document.getElementById("ddlReceiptType"))) {
            //        ValidationAlertBox("Please select Receipt Type.", "ddlReceiptType", ModuleName);
            //        ddlReceiptType.focus();
            //        //$("#btnSaveContinuePmsProductReceipt").show();
            //        //$("#btnSavePmsProductReceipt").show();
            //        return false;
            //    }
            //}


            var table = $("#tblStudyProductReceiptAdd tbody");
            var ErrorMessage = "";
            table.find('tr').each(function (i) {
                var $tds = $(this).find('td');
                var productId = $tds.eq(0).text();
                var batchid = $tds.eq(1).text();
                var qty = $tds.eq(3).text();
                var storageArea = $tds.eq(8).text();
                var remarks = $tds.eq(11).text();
                var noofkit = $tds.eq(4).text();

                var cIsTempRecd = $tds.eq(15).text();
                var TempLogger = $tds.eq(21).text();
                var IsCOArecd = $tds.eq(16).text();
                var IsGMPrecd = $tds.eq(17).text();
                var COADate = $tds.eq(18).text();
                var GMPDate = $tds.eq(19).text();
                var NoOfContainers = $tds.eq(14).text();
                var Unit = $tds.eq(22).text();

                if (TransferIndi == "P") {
                    if (productId == "Please Select Product") {
                        ErrorMessage = "Please Select Product.";
                        $("#btnSaveContinuePmsProductReceipt").hide();
                        $("#btnSavePmsProductReceipt").show();
                        return false;

                    }
                    else if (batchid == "Please Select Batch/Lot/Lot No") {
                        ErrorMessage = "Please Select Batch/Lot/Lot No.";
                        $("#btnSaveContinuePmsProductReceipt").hide();
                        $("#btnSavePmsProductReceipt").show();
                        return false;
                    }
                    else if (qty == "" || qty == "0") {
                        ErrorMessage = "Please Enter Qty.";
                        $("#btnSaveContinuePmsProductReceipt").hide();
                        $("#btnSavePmsProductReceipt").show();
                        return false;
                    }
                }
                else if (TransferIndi == "K") {
                    if (noofkit == "" || noofkit == "0") {
                        ErrorMessage = "Please Enter Number of Kit.";
                        $("#btnSaveContinuePmsProductReceipt").hide();
                        $("#btnSavePmsProductReceipt").show();
                        return false;
                    }
                }

                //if (Unit == "Please Select Unit") {
                //    ErrorMessage = "Please Select Unit.";
                //    $("#btnSaveContinuePmsProductReceipt").hide();
                //    $("#btnSavePmsProductReceipt").show();
                //    return false;
                //}

                //if (cIsTempRecd == "Y") {
                //    if (TempLogger == "") {
                //        ErrorMessage = "Please Select Temperature data logger number.";
                //        $("#btnSaveContinuePmsProductReceipt").hide();
                //        $("#btnSavePmsProductReceipt").show();
                //        return false;

                //    }
                //}

                //if (IsCOArecd == "Y") {
                //    if (COADate == "") {
                //        ErrorMessage = "Please Select COA Receipt Date.";
                //        $("#btnSaveContinuePmsProductReceipt").hide();
                //        $("#btnSavePmsProductReceipt").show();
                //        return false;

                //    }

                //}
                //if (IsGMPrecd == "Y") {
                //    if (GMPDate == "") {
                //        ErrorMessage = "Please Select GMP Receipt Date.";
                //        $("#btnSaveContinuePmsProductReceipt").hide();
                //        $("#btnSavePmsProductReceipt").show();
                //        return false;

                //    }
                //}

                //if (NoOfContainers == "" || NoOfContainers == "0") {
                //    ErrorMessage = "Please enter No Bin/Pallet/Crate/Locker/Container/Shelf/Box/Boxes/Rack.";
                //    $("#btnSaveContinuePmsProductReceipt").hide();
                //    $("#btnSavePmsProductReceipt").show();
                //    return false;
                //}


                if (storageArea == "0") {
                    ErrorMessage = "Please Select Storage Area.";
                    $("#btnSaveContinuePmsProductReceipt").hide();
                    $("#btnSavePmsProductReceipt").show();
                    return false;
                }
                if (remarks == "") {
                    ErrorMessage = "Please Enter Remarks.";
                    $("#btnSaveContinuePmsProductReceipt").hide();
                    $("#btnSavePmsProductReceipt").show();
                    return false;
                }
            });

            if (ErrorMessage != "") {
                ValidationAlertBox(ErrorMessage, "vOtherTransportMode", ModuleName);
                return false;
            }

            //if ($("#ddlCoaRecd").val() == "Y") {
            //    if (isBlank(document.getElementById('COADate').value)) {
            //        ValidationAlertBox("Please enter COA date.", "COADate", ModuleName);
            //        return false;
            //    }
            //}
            //if ($("#ddlGmpRecd").val() == "Y") {
            //    if (isBlank(document.getElementById('GMPDate').value)) {
            //        ValidationAlertBox("Please enter GMP date.", "GMPDate", ModuleName);
            //        return false;
            //    }
            //}

            //if (isBlank(document.getElementById('txtNoOfContainers').value)) {
            //    ValidationAlertBox("Please enter No of Container.", "txtNoOfContainers", ModuleName);
            //    return false;
            //}

            //if (isBlank(document.getElementById('StorageArea').value)) {
            //    //$("#btnSaveContinuePmsProductReceipt").show();
            //    //$("#btnSavePmsProductReceipt").show();
            //    ValidationAlertBox("Please enter Storage Area.", "StorageArea", ModuleName);
            //    return false;
            //}

        }
    }

    if (CheckDateLessThenToday(document.getElementById('ExpiryDate').value)) {
        ExpiryDate.value = "";
        ValidationAlertBox("Expiry date should be greater than Current date.", "ExpiryDate", ModuleName);
        return false;
    }

    var txtreceiptdate = document.getElementById('txtReceiptDateTime').value;
    var abc = txtreceiptdate.split(" ");

    if (CheckDateMoreThenToday(abc[0])) {
        txtReceiptDateTime.value = "";
        ValidationAlertBox("Receipt date should be less than Current date.", "txtReceiptDateTime", ModuleName);
        return false;
    }
}

$("#txtReceiptDateTime").keypress(function (event) { event.preventDefault(); });

$("#COADate").keypress(function (event) { event.preventDefault(); });

$("#GMPDate").keypress(function (event) { event.preventDefault(); });

function RestrictAlphabet(e) {

    var regExp = /[a-z]/i;
    var value = String.fromCharCode(e.which) || e.key;
    if (regExp.test(value)) {
        e.preventDefault();
        return false;
    }
}
//---------Added By Anjali Prajapati-------------
function viewProjectDocument(e) {

    //var vdoc_id = $("#" + e.id).attr("id");
    var id = setworkspaceid;
    var projectno = $("#hdnuserid").val();

    if (productIds[$('#DDLProjectNo').val()] != undefined) {
        setworkspaceid = productIds[$('#DDLProjectNo').val()];
    }
    if (setworkspaceid == undefined) {
        return false;
    }
    var Data = {
        id: setworkspaceid,
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
                    for (var i = 0; i < jsonData.length; i++) {
                        var Filename = jsonData[i].vFilePath;
                        var ext = Filename.split(".")[Filename.split(".").length - 1];//For get PDF Ext.
                        flag = 'Y';
                        if (ext == "pdf") {
                            $("#ViewDocument").modal.show;
                            $("#mbody").append($('<iframe name="frame1" id="ifviewDocument" style="height: 391px; width: 100%;" runat="server"></iframe>').attr("src", Filename));
                            flag = 'Y';
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
                        }
                        else {
                            SuccessorErrorMessageAlertBox("This Module has no Document", ModuleName);
                            flag = 'N';
                            return false;
                        }
                    }
                }
                else {
                    SuccessorErrorMessageAlertBox("Document Not Attached", ModuleName);
                    flag = 'N';
                    return false;
                }
                return flag;
            }
        }
    }
}

function ShowToolTip(Product) {
    var ToolTip = document.getElementById(Product);
    ToolTip.title = $("#Product :selected").text();
}
//---------End-----------------

$("#StorageName").on("change", function () {
    var GETStorageArea = {
        Url: BaseUrl + "PmsGeneral/ALLStorageAreaData",
        SuccessMethod: "SuccessMethod"
    }
    var FilterData = {
        nStorageTypeId: $("#StorageName :selected").val(),
        vLocationCode: $("#hdnUserLocationCode").val(),
    }
    GetPmsProductReceiptStorageArea(GETStorageArea.Url, FilterData);
});
