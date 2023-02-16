var productIds = new Object();
var setWorkspaceId = "";
var viewmode = "";
var ModuleName = "Unused IMP"
var TransferIndi = "";
var vProjectNo = "";

$(document).ready(function () {
    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('.modal').modal('hide');

   // GetViewMode();

    CheckSetProject();
    GetStorageLocation();
    
    if (setWorkspaceId != "") {
        BindData();
    }

  

    var MenuId = $("#hdnOperationcode").val();
    $("#spnwelcome").html($("#hdnusername").val());
    $("#spnLoginTime").html($("#hdnlogintime").val());
    $("#divexport").css("visibility", "hidden");
    $("#ProjectNo").prop('disabled', 'disabled');


    var GetPmsQualityCheckProjectNo = {
        //Url: BaseUrl + "PmsGeneral/ProjectNumber",
        Url: BaseUrl + "PmsGeneral/GetScopeWiseProject",
        SuccessMethod: "SuccessMethod",
    }
    $('#ddlProjectNodashboard').on('change keyup paste mouseup', function () {
        if ($('#ddlProjectNodashboard').val().length == 2) {
            var ProjectNoDataTemp = {
                //vWorkSpaceID: $('#ddlProjectNodashboard').val(),
                iUserId: $("#hdnuserid").val(),
                vStudyCode: $('#ddlProjectNodashboard').val()
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
    }); ValidationAlertBox

    $("#ddlProjectNodashboard").on("blur", function () {
        BindData();
    });
    
   
    $('#ddlStorageArea').multiselect({
        nonSelectedText: 'Please Select Storage Area',
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

});

$("#ddlProjectNodashboard").on("blur", function () {
    BindData();
});


var GetAllPmsQualityCheckProjectNo = function (Url, SuccessMethod, ProjectNoDataTemp) {
    $.ajax({
        url: Url,
        type: 'GET',
        //data: ProjectNoDataTemp,
        data: { iUserId: ProjectNoDataTemp.iUserId, vStudyCode: ProjectNoDataTemp.vStudyCode },
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("Project not found.", "ddlProjectNodashboard", ModuleName);
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

function CheckSetProject() {
    var PassData = {
        iUserId: $("#hdnuserid").val()
    }

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
                setWorkspaceId = jsonData[0].vWorkSpaceId;
            }
            else {
                $('#ddlProjectNodashboard').val('');
            }
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Project not found.", ModuleName);
        }
    });

    //$.ajax({
    //    url: BaseUrl + "PmsGeneral/GetSetProjectDetails/" + $("#hdnuserid").val(),
    //    type: 'GET',
    //    async: false,
    //    success: SuccessMethod,
    //    error: function () {
    //        ValidationAlertBox("Project not found.", "ddlProjectNodashboard", ModuleName);
    //    }
    //});
    //function SuccessMethod(jsonData) {
    //    if (jsonData.length > 0) {
    //        $('#ddlProjectNodashboard').val(jsonData[0].vProjectNo);
    //        setWorkspaceId = jsonData[0].vWorkSpaceId;
    //    }
    //    else {
    //        $('#ddlProjectNodashboard').val('');
    //    }
    //}
}

function GetExportToExcelDetails() {
    var Data_Export = {
        vWorkSpaceId: setWorkspaceId,
        vDocTypeCode: "ZUNI",
    }

    var url = WebUrl + "PmsStudyProductReceipt/GetExportToExcelDetails";
    $.ajax({
        url: url,
        type: 'get',
        data: Data_Export,
        success: function (data) {

        },
        error: function () {
            SuccessorErrorMessageAlertBox("Data not found in export to excel.", ModuleName);
        }
    });
}

function BindData() {
    if (productIds[$('#ddlProjectNodashboard').val()] != undefined) {
        setWorkspaceId = productIds[$('#ddlProjectNodashboard').val()];
    }

    var projectid = setWorkspaceId;
    if (projectid > 0) {
        GetDashboardData();
        GetExportToExcelDetails();
    }
    else {
        $("#divexport").css("visibility", "hidden");
    }
}

$("#btnAddUnusedIMP").on("click", function () {
    $("#btnSavePmsUnusedIMP").show();
    $('#ddlProjectNo').val($('#ddlProjectNodashboard').val());
    jQuery("#titleMode").text('Mode:-Add');
    
    if (isBlank(document.getElementById('ddlProjectNodashboard').value)) {
        ValidationAlertBox("Please enter Project No.", "ddlProjectNodashboard", ModuleName);
        return false;
    }

    ProductType();
    GetStorageArea();
    clearData();

});

$("#btnExitPmsUnusedIMP").on("click", function () {
    ConfirmAlertBox(ModuleName);
});

$("#ddlTransferIndi").on("change", function () {
    TransferIndi = $("#ddlTransferIndi").val();
    var TempProductType = $("#ddlProductType").val();

    if (TransferIndi == "P") {
        if (TempProductType != "0") {
            //$(".hideproduct").attr("style", "display:inline");
            $(".hidekit").attr("style", "display:none");
            $("#divProductCategory").attr("style", "display:inline");
            //GetProductName();
        }
    }
    else if (TransferIndi == "K") {
        if (TempProductType != 0) {
            $(".hideproduct").attr("style", "display:none");
            $(".hidekit").attr("style", "display:inline");
            $("#divProductCategory").attr("style", "display:none");
            //GetKit();
            GetKitType();
        }
    }
    else {
        $('.hideproduct').attr("style", "display:none");
        $(".hidekit").attr("style", "display:none");
        $("#divProductCategory").attr("style", "display:none");
    }
});

function clearData() {
    $('#ddlProductType').val(0).attr("selected", "selected");
    $('#ddlProduct').val(0).attr("selected", "selected");
    $('#ddlBatchLotNo').val(0).attr("selected", "selected");
    $('#ddlUnUsedStatus').val('N').attr("selected", "selected");
    $("#ddlStorageArea").multiselect("clearSelection");
    $("#txtQuantity").val("");
    $("#txtRemarks").val("");
    $("#txtSubjectNo").val("");
    $("#ddlTransferIndi").val("0");
    $("#ddlKit").multiselect("clearSelection");
    $("#ddlKit").multiselect('refresh');
    $("#ddlProductLabel").multiselect("clearSelection");
    $("#ddlProductLabel").multiselect('refresh');
    $(".hideproduct").hide();
    $(".hidekit").hide();
    $("#ddlProductCategory").val(0).attr("selected", "selected");
    $("#divProductCategory").hide();
    $("#divProductLabel").hide();
    $("#txtNoOfContainers").val('');

    $('#ddlUnit').val(0).attr("selected", "selected").prop("disabled", false);
    $("#divUnit").hide();
}

function ProductType() {

    if (setWorkspaceId != "") {
        var GetProductType = {
            Url: BaseUrl + "PmsGeneral/GetProductType/" + setWorkspaceId,
            SuccessMethod: "SuccessMethod"
        }

        // For Server use

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

   
}

function GetProductName() {
    var GetProductNameData = {
        vWorkSpaceId: setWorkspaceId,
        nProductTypeID: $("#ddlProductType").val(),
        cTransferIndi: TransferIndi
    }

    var GetPmsUnusedIMPProductName = {
        Url: BaseUrl + "PMSGeneral/ProductName",
        SuccessMethod: "SuccessMethod",
        Data: GetProductNameData,
    }

    $.ajax({
        url: GetPmsUnusedIMPProductName.Url,
        type: 'POST',
        data: GetPmsUnusedIMPProductName.Data,
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("Product not found.", "ddlProduct", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        var strdata = "";
        if (jsonData.length > 0) {
            $("#ddlProduct").empty().append('<option selected="selected" value="0">Please Select Product</option>');
            for (var i = 0; i < jsonData.length; i++)
                $("#ddlProduct").append($("<option></option>").val(jsonData[i].nProductNo).html(jsonData[i].vProductName));
        }
        else {
            $("#ddlProduct").empty().append('<option selected="selected" value="0">Please Select Product</option>');
        }
    }
}

$("#ddlProductType").on("change", function () {
    TransferIndi = $("#ddlTransferIndi").val();
    var TempProductTYpe = $("#ddlProductType").val();

    if (TempProductTYpe != '0') {
        if (TransferIndi == "P") {
            $(".hideproduct").attr("style", "display:none");
            $(".hidekit").attr("style", "display:none");
            $("#divProductCategory").attr("style", "display:inline");
            $("#ddlUnUsedStatus").val('N');
            $("#ddlProductCategory").val(0);
            GetProductName();

        }
        else if (TransferIndi == "K") {
            $(".hideproduct").attr("style", "display:none");
            $(".hidekit").attr("style", "display:inline");
            $("#divProductCategory").attr("style", "display:none");
            GetKitType();
        }
        else {
           
            $("#hideproduct").attr("style", "display:none");
            $("#hidekit").attr("style", "display:none");
            $("#divProductCategory").attr("style", "display:none");
        }
    }
    $("#ddlUnUsedStatus").val('N');
    $("#ddlStorageArea").multiselect("clearSelection");
    $("#txtQuantity").val("");
    $("#txtSubjectNo").val("");
    $("#txtNoOfContainers").val('');
});

function GetBatchLotNo() {
    var projectid = setWorkspaceId;
    var productid = $("#ddlProduct").val();

    var GetPmsUnusedIMPBatchLotNo = {
        Url: BaseUrl + "PmsStudyProductReceipt/GetBatchLotNo",
        SuccessMethod: "SuccessMethod"
    }

    $.ajax({
        url: GetPmsUnusedIMPBatchLotNo.Url,
        type: 'GET',
        data: { id: projectid, projectno: productid },
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("Batch/Lot/Lot No not found.", "ddlBatchLotNo", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        var strdata = "";
        if (jsonData.length > 0) {
            $("#ddlBatchLotNo").empty().append('<option selected="selected" value="0">Please Select Batch/Lot/Lot No</option>');
            for (var i = 0; i < jsonData.length; i++)
                $("#ddlBatchLotNo").append($("<option></option>").val(jsonData[i].nStudyProductBatchNo).html(jsonData[i].vBatchLotNo));
        }
        else {
            $("#ddlBatchLotNo").empty().append('<option selected="selected" value="0">Please Select Batch/Lot/Lot No</option>');
        }
    }
}

$("#ddlProduct").on("change", function () {
    GetBatchLotNo();
    $("#txtSubjectNo").val("");
    $("#ddlStorageArea").multiselect("clearSelection");
    $("#txtNoOfContainers").val("");
    $("#txtRemarks").val("");
    $("#txtQuantity").val("");
    $("#txtQuantity").val("");
    $("#divUnit").hide();
});

$("#ddlBatchLotNo").on("change", function () {
    if ($("#ddlBatchLotNo").val() != "0") {
        getUnit();
    }
    else {
        $("#ddlUnit").val(0).attr('disabled', false);
        $("#divUnit").hide();
    }

    $("#txtQuantity").val("");
    $("#ddlStorageArea").multiselect("clearSelection");
});

function getUnit() {
    debugger;
    var QualityCheckData = {
        vWorkSpaceId: setWorkspaceId,
        nProductNo: $("#ddlProduct :selected").val(),
        nStudyProductBatchNo: $("#ddlBatchLotNo :selected").val(),
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

function GetStorageLocation() {
    $.ajax({
        url: BaseUrl + "PmsQualityCheckMovement/GetToStorageLocationName",
        type: 'GET',
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("Storage Location not found.", "ddlStorageLocation", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        if (jsonData.length > 0) {
            for (var i = 0; i < jsonData.length; i++) {
                $("#ddlStorageLocation").empty().append($("<option></option>").val(jsonData[i].nStorageTypeId).html(jsonData[i].vStorageType));
            }
            $("#ddlStorageLocation").prop('disabled', 'disabled');
        }
    }
}

function QualityCheck() {
    var QualityCheckData = {
        vWorkSpaceId: setWorkspaceId,
        vProductNo: $("#ddlProduct :selected").val(),
        vDocTypeCode:"ZUNI",
        nStudyProductBatchNo: $("#ddlBatchLotNo :selected").val(), 
        vRefModule: "PD",
        cUnUsedStatus: $("#ddlUnUsedStatus :selected").val(),
    }

    $.ajax({
        url: BaseUrl + "PmsGeneral/QtyDetail",
        type: 'POST',
        data: QualityCheckData,
        success: Success,
        error: function () {
            ValidationAlertBox("Quantity not found.", "ddlStorageArea", ModuleName);
        }
    });
    function Success(response) {
        var totalqty = $("#txtQuantity").val();
        totalavailableqty = response;
        if (parseInt(response) < parseInt(totalqty)) {
            $("#txtQuantity").val("");
            ValidationAlertBox("Current Stock is " + response + " !", "ddlStorageArea", ModuleName);
            return false;
        }
    }
}

$("#txtQuantity").on("blur", function () {
    if (parseInt($("#txtQuantity").val()) == "0") {
        $("#txtQuantity").val('');
        return false;
    }
    else {
     
        QualityCheck();
    }
});

$("#btnSavePmsUnusedIMP").on("click", function () {

    $("#btnSavePmsUnusedIMP").hide();
    if (Validateform() == false) {
        $("#btnSavePmsUnusedIMP").show();
        return false;
    }
    else {
        var storagearea = $("#ddlStorageArea").val();
        var KitNo = [];
        if (storagearea == null) {
            storagearea = "0";
        }
        else {
            storagearea = $("#ddlStorageArea").val().toString();
        }

        var setKitNo = $.map($("#ddlKit option:selected"), function (ekit, i) {
            KitNo.push($(ekit).text());
        });

        var LabelNo = [];
        var setLabelNo = $.map($("#ddlProductLabel option:selected"), function (eLabel, i) {
            LabelNo.push($(eLabel).text());
        });

        var TotalLength;
        if (TransferIndi == "P") {
            var ProductCategory = $("#ddlProductCategory").val()
            if (ProductCategory == "L") {
                TotalLength = LabelNo.length;
                TransferIndi = "L";
            }
            else if (ProductCategory == "P") {
                TotalLength = 1;
            }
            
        }
        else if (TransferIndi == "K") {
            TotalLength = KitNo.length;
        }


        for (i = 0; i < TotalLength; i++) {

            var InsertPmsUnUsedIMP = {
                vWorkSpaceId: setWorkspaceId,
                nProductTypeID: $("#ddlProductType :selected").val(),
                nProductNo: $("#ddlProduct :selected").val(),
                nStudyProductBatchNo: $("#ddlBatchLotNo :selected").val(),
                vStorageArea: storagearea,
                iUnUsedQty: $("#txtQuantity").val(),
                cLocationIndicator: "P",
                vRemark: $("#txtRemarks").val(),
                iModifyBy: $("#hdnuserid").val(),
                vSubjectNo: $("#txtSubjectNo").val(),
                cUnUsedStatus: $("#ddlUnUsedStatus").val(),
                cTransferIndi: TransferIndi,
                vKitNo: KitNo[i],
                vStudyProductLabelNo: LabelNo[i],
                iNoOfContainers: $("#txtNoOfContainers").val(),
                vUnit: $("#ddlUnit").val()
            }
            var InsertUnusedIMPData = {
                Url: BaseUrl + "PmsUnusedIMP/InsertPMSUnsedIMP",
                SuccessMethod: "SuccessMethod",
                Data: InsertPmsUnUsedIMP,
            }

            InsertPmsUnusedIMPMaster(InsertUnusedIMPData.Url, InsertUnusedIMPData.SuccessMethod, InsertUnusedIMPData.Data);
        }
        $("#btnSavePmsUnusedIMP").show();
    }
});

var InsertPmsUnusedIMPMaster = function (Url, SuccessMethod, Data) {
    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        success: SuccessInsertData,
        error: function () {
            clearData();
            GetDashboardData();
            SuccessorErrorMessageAlertBox("Error to Save data. \n Please try again.", ModuleName);
        }
    });

    function SuccessInsertData(response) {
        //alert(response);
        clearData();
        GetDashboardData();
        SuccessorErrorMessageAlertBox("Unused IMP saved successfully", ModuleName);
    }
}

function GetDashboardData() {
    var GetDashboardData = {
        vWorkSpaceID: setWorkspaceId,
        iUserID: $("#hdnuserid").val()
    }

    $.ajax({
        url: BaseUrl + "PmsUnUsedIMP/UnUsedIMPDetails",
        type: 'POST',
        data: GetDashboardData,
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
        var expdate = "";
        var savecontinueedit;
        var audittrail;
        var ActivityDataset = [];
        $("#divexport").css("visibility", "visible");
        for (var i = 0; i < jsonData.length; i++) {
            var InDataset = [];
            InDataset.push(jsonData[i].vProjectNo, jsonData[i].vProductType, jsonData[i].cProductKitIndication, jsonData[i].vProductName, jsonData[i].vBatchLotNo, jsonData[i].iUnUsedQty, jsonData[i].vUnit,
                           jsonData[i].vRemark, jsonData[i].vStorageAreaName, jsonData[i].vSubjectNo, jsonData[i].cUnUsedStatus,
                           jsonData[i].vModifyBy + " /</br> " + jsonData[i].dModifyOn);
            ActivityDataset.push(InDataset);
        }
        otable = $('#tblPmsUnUsedIMPData').dataTable({
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
            "sScrollXInner": "1850" /* It varies dynamically if number of columns increases */,
            "aoColumns": [
                { "sTitle": "Project No" },
                { "sTitle": "Product Type" },
                { "sTitle": "Product Indication" },
                { "sTitle": "Product Name" },
                { "sTitle": "Batch/Lot/Lot No" },
                { "sTitle": "Unused Qty" },
                  { "sTitle": "Unit" },
                { "sTitle": "Remarks" },
                { "sTitle": "Storage Area" },
                { "sTitle": "Subject" },
                { "sTitle": "Unused Status" },
                { "sTitle": "Recorded By" },
            ],
            "columnDefs": [
                     {
                         targets: [6],
                         render: function (data, type, row) {
                             return data == null ? '' : data
                         }
                     },
            ],

            //"columnDefs": [
            //    { "width": "10%", "targets": 0 },
            //    { "width": "6%", "targets": 1 },
            //    { "width": "9%", "targets": 2 },
            //    { "width": "10%", "targets": 3 },
            //    { "width": "5%", "targets": 4 },
            //    { "width": "10%", "targets": 5 },
            //    { "width": "8%", "targets": 6 },
            //    { "width": "8%", "targets": 7 },
            //    { "width": "10%", "targets": 8 },
            //    { "width": "10%", "targets": 9 },
            //],
            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },
        });
    }
}

function Validateform() {

    if (Dropdown_Validation(document.getElementById("ddlTransferIndi"))) {
        ValidationAlertBox("Please select Product Indication.", "ddlTransferIndi", ModuleName);
        return false;
    }

    
    if (Dropdown_Validation(document.getElementById("ddlProductType"))) {
        ValidationAlertBox("Please select Product Type.", "ddlProductType", ModuleName);
        return false;
    }

    if ($("#ddlUnUsedStatus").val() == "N") {
        ValidationAlertBox("Please select Unused Status.", "ddlUnUsedStatus", ModuleName);
        return false;
    }

    if (TransferIndi == "P") {
        if (Dropdown_Validation(document.getElementById('ddlProductCategory'))) {
            ValidationAlertBox("Please select Product Category.", "ddlProductCategory", ModuleName);
            return false;
        }
    }


    if (TransferIndi == "P" && $("#ddlProductCategory :selected").text() == "Without Label") {
        if (Dropdown_Validation(document.getElementById("ddlProduct"))) {
            ValidationAlertBox("Please select Product.", "ddlProduct", ModuleName);
            return false;
        }

        if (Dropdown_Validation(document.getElementById("ddlBatchLotNo"))) {
            ValidationAlertBox("Please select Batch/Lot/Lot No.", "ddlBatchLotNo", ModuleName);
            return false;
        }

        if (isBlank(document.getElementById('txtQuantity').value)) {
            ValidationAlertBox("Please enter Unused Quantity.", "txtQuantity", ModuleName);
            return false;
        }
    }
    else if (TransferIndi == "K") {
        if (isBlank(document.getElementById('ddlKit').value)) {
            ValidationAlertBox("Please select atlease One Kit.", "ddlKit", ModuleName);
            return false;
        }
    }
    else if (TransferIndi == "P" && $("#ddlProductCategory :selected").text() == "With Label") {
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
        ValidationAlertBox("Please enter No Bin/Pallet/Crate/Locker/Container/Shelf/Box/Boxes/Rack.", "txtNoOfContainers", ModuleName);
        return false;
    }

    if (isBlank(document.getElementById('txtRemarks').value)) {
        ValidationAlertBox("Please enter Remarks.", "txtRemarks", ModuleName);
        return false;
    }
}

function GetKitType() {
    $.ajax({
        url: BaseUrl + "PmsRecordFetch/GetKitTypeNumber/" + setWorkspaceId + "",
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
                    ValidationAlertBox("Kit Type data is not found.", "ddlKitType", ModuleName);
                }
            });
        },
        error: function () {
            ValidationAlertBox("Kit Type data is not found.", "ddlKitType", ModuleName);
        }
    });
}

function GetKit() {
    $('#divkit .multiselect-container li').remove();

    var PostData = {
        vWorkSpaceID: setWorkspaceId,
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
            SuccessorErrorMessageAlertBox("Kit Data is not found.", ModuleName);
        }
    });
}

$("#ddlProductCategory").on("change", function () {

    $("#txtSubjectNo").val("");
    $("#ddlStorageArea").multiselect("clearSelection");
    $("#txtNoOfContainers").val("");
    $("#txtRemarks").val("");
    $("#txtQuantity").val("");

    var ProductCategory = $("#ddlProductCategory").val()
    if (ProductCategory == "L") {
        $(".hideproduct").attr("style", "display:none");
        $("#divProductLabel").attr("style", "display:block");
        document.getElementById("divUnit").style.display = "none";
        GetStudyProductLabel();
    }
    else if (ProductCategory == "P") {
        
        GetProductName();
        $("#divProductLabel").attr("style", "display:none");
        $(".hideproduct").attr("style", "display:Block");
        $("#txtQuantity").val('');
    }
    else {
        $("#divProductLabel").attr("style", "display:none");
        $("#divProduct").attr("style", "display:none");
    }
});

function GetStudyProductLabel() {
    var PostData = {
        vWorkSpaceID: setWorkspaceId,
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
            SuccessorErrorMessageAlertBox("Kit Data is not found.", ModuleName);
        }
    });
}

//function GetKit() {
//    $('#hidekit .multiselect-container li').remove();

//    var PostData = {
//        vWorkSpaceID: setWorkspaceId,
//        nProductTypeID: $("#ddlProductType").val(),
//    }

//    $.ajax({
//        url: BaseUrl + "PmsRecordFetch/Proc_GetAvailableKitNo",
//        type: 'POST',
//        data: PostData,
//        success: SuccessMethod,
//        error: function () {
//            SuccessorErrorMessageAlertBox("Kit Data Is not found.", ModuleName);
//        }
//    });

//    function SuccessMethod(jsonData) {
//        if (jsonData.length == 0) {
//            $('#ddlKit').multiselect('destroy');

//            $('#ddlKit').multiselect({
//                nonSelectedText: 'Please Select Kit',
//                buttonClass: 'form-control',
//                enableFiltering: true,
//                enableCaseInsensitiveFiltering: true,
//                numberDisplayed: 2,
//            });
//        }
//        for (var i = 0; i < jsonData.length; i++) {
//            $("#ddlKit").append($("<option></option>").val(jsonData[i].vKitNo).html(jsonData[i].vKitNo));
//            $('#ddlKit').multiselect('rebuild');
//        }
//    }
//}

$("#ddlKitType").on("change", function () {
    GetKit();
});

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