var iUserNo;
var productIds = new Object();
var filenames1 = [];
var filenames2 = [];
var pathname;
var setworkspaceid;
var viewmode;
var ModuleName = "Kit Upload";
var remarksMandatory = false;
var GridData = "";
var studytype = "";
var nProductTypeID = 0;

$(document).ready(function () {

    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('.modal').modal('hide');

    CheckSetProject();
    var GetProjectNo = {
        //Url: BaseUrl + "PmsProductBatch/GetProjectNo",
        Url: BaseUrl + "PmsGeneral/GetScopeWiseProject",
        SuccessMethod: "SuccessMethod"
    }
    $('#DDLProjectNo').on('change keyup', function () {
        if ($('#DDLProjectNo').val().length == 2) {
            var ProjectNoDataTemp = {
                //vProjectNo: $('#DDLProjectNo').val(),
                iUserId: $("#hdnuserid").val(),
                vStudyCode: $('#DDLProjectNo').val()
                //vProjectTypeCode: $("#hdnscopevalues").val(),
            }
            GetAllParentPRoject(GetProjectNo.Url, GetProjectNo.SuccessMethod, ProjectNoDataTemp);
        }
        else if ($('#DDLProjectNo').val().length < 2) {
            $("#DDLProjectNo").autocomplete({
                source: "",
                change: function (event, ui) { },
                select: function (event, ui) {
                    vProjectNo = ui.item.value;
                    $('#DDLProjectNo').val(vProjectNo);
                },
            });
        }
    });

    if (setworkspaceid != undefined) {
        $('#fileToUpload').prop("disabled", false);
    }

    $('#ddlStorageArea').multiselect({
        nonSelectedText: 'Please Select StorageArea',
        buttonClass: 'form-control',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        numberDisplayed: 2,
    });

    if (setworkspaceid != undefined) {
        ViewMyProject();
        GetProductType();
        GetStorageArea();
        GetKitTypeDetail();
    }
});

$(function () {
    var GetPmsDocMasterProjectNo = {
        Url: BaseUrl + "PmsProductBatch/GetProjectNo",
        SuccessMethod: "SuccessMethod",
    }

    $("#fileToUpload").change(function (e) {
        //if ($("#fileToUpload").val().toLowerCase().lastIndexOf(".csv") == -1) {
        //    SuccessorErrorMessageAlertBox("Please Upload Only .csv Extention File !" , ModuleName);
        //    $("#fileToUpload").val('');
        //    return false;
        //}
        if (productIds[$('#DDLProjectNo').val()] != undefined) {
            setworkspaceid = productIds[$('#DDLProjectNo').val()];
        }
        var fileUpload = $("#fileToUpload");
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
        if (!regex.test(fileUpload.val().toLowerCase())) {
            SuccessorErrorMessageAlertBox("Please Upload Only .csv Extention File !", ModuleName);
            fileUpload.val('');
            return false;
        }
    });
});

var GetAllParentPRoject = function (Url, SuccessMethod, ProjectNoDataTemp) {

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
            $("#DDLProjectNo").autocomplete({
                source: sourceArr,
                change: function (event, ui) { }
            });
        },
        error: function () {
            ValidationAlertBox("Project not found.", "ddlProjectNodashboard", ModuleName);
        }
    });
}

function fileUpload() {
    var projectType = $('#ddlProductType :selected').val();
    var ddlTransferIndi = $('#ddlTransferIndi :selected').val();
    var ddlProduct = $('#ddlProduct :selected').val();
    var ddlkit = $('#ddlkit :selected').val();
    var Productname = $('#ddlkit :selected').text();
    var ddlBatchLot = $('#ddlBatchLot :selected').val();
    var ddlStorageArea = $("#ddlStorageArea :selected").val();

    if (window.FormData !== undefined) {
        var fileUpload = $("#fileToUpload").get(0);
        var files = fileUpload.files;

        var fileData = new FormData();

        for (var i = 0; i < files.length; i++) {
            var filename = files[i].name;
            filename = filename.replace(' ', '_');
            fileData.append(filename, files[i]);
        }
        if (productIds[$('#DDLProjectNo').val()] != undefined) {
            setworkspaceid = productIds[$('#DDLProjectNo').val()];
        }

        fileData.append('vWorkSpaceId', setworkspaceid);
        fileData.append('studytype', projectType);
        fileData.append('cExtraKit', 'N');
        fileData.append('vRemark', $('#txtRemarks').val());
        fileData.append('nStudyProductBatchNo', ddlBatchLot);
        fileData.append('vStorageArea', ddlStorageArea);
        fileData.append('nStudyProductBatchNo', ddlBatchLot);
        fileData.append('nProductNo', ddlProduct);
        fileData.append('nKitTypeNo', ddlkit);
        fileData.append('ProductName', Productname);

        $("#loader").css("display", "block");
        $('.MasterLoader').show();
        $.ajax({
            url: WebUrl + "PmsKitUpload/PmsKitUpload",
            type: "POST",
            contentType: false, // Not to set any content header  
            processData: false, // Not to process data  
            data: fileData,
            async: false,
            success: function (result) {
                if (result == "File Upload Successfully !") {
                    GetKitTypeDetail();
                    clearControl()
                    SuccessorErrorMessageAlertBox("File Upload Successfully !", ModuleName);
                    return true;
                }
                alert(result);
                $('#fileToUpload').val('')
                return false;
            },
            error: function (err) {
                SuccessorErrorMessageAlertBox(err.statusText + " !", ModuleName);
            }
        });
    }
    else {
        SuccessorErrorMessageAlertBox("FormData is not supported. !", ModuleName);
    }
}

$('#btnExitKitUpload').on("click", function () {
    ConfirmAlertBox(ModuleName, $("#RedirectToHome").val());
});

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
            $('#DDLProjectNo').val(jsonData[0].vProjectNo);
            setworkspaceid = jsonData[0].vWorkSpaceId;
        }
        else {
            $('#DDLProjectNo').val('');
        }
    }
}

$('#DDLProjectNo').on("blur", function () {
    if (productIds[$('#DDLProjectNo').val()] != undefined) {
        setworkspaceid = productIds[$('#DDLProjectNo').val()];
    }
    else {
        setworkspaceid = "";
    }
    GetStorageArea();
    ViewMyProject();
    GetProductType();
    GetKitTypeDetail();
});

$('#btnSaveKitUpload').on("click", function () {
    var SubjectRandomize = true;
    //var wStr = "vParentWorkSpaceID = " + setworkspaceid + " and ISNULL(vRandomizationNo,'') <> ''"
    //var WhereData = {
    //    WhereCondition_1: wStr,
    //    columnName_1: "COUNT(*) as [TotalCount]"
    //}
    //if (setworkspaceid != "") {
    //    $.ajax({
    //        url: BaseUrl + "PmsRecordFetch/View_WorkspaceSubjectMst",
    //        type: 'POST',
    //        data: WhereData,
    //        async: false,
    //        success: function (data) {
    //            data = data.Table;
    //            if (data[0].TotalCount != 0) {
    //                SuccessorErrorMessageAlertBox("You Can Not Upload File, Because Subjectis Randomized As Per Uploded File !", ModuleName);
    //                SubjectRandomize = false;
    //            }
    //        }
    //    });
    //}

    if (SubjectRandomize == true) {
        if (Validation()) {
            fileUpload();
        }
    }
});

function Validation() {
    if (isBlank(document.getElementById('DDLProjectNo').value)) {
        ValidationAlertBox("Please Select Project Number !", "DDLProjectNo", ModuleName);
        return false;
    }

    if (Dropdown_Validation(document.getElementById("ddlTransferIndi"))) {
        ValidationAlertBox("Please select Kit Indication.", "ddlTransferIndi", ModuleName);
        return false;
    }
    if (Dropdown_Validation(document.getElementById("ddlProductType"))) {
        ValidationAlertBox("please select study type !", "ddlProductType", ModuleName);
        return false;
    }

    if (Dropdown_Validation(document.getElementById("ddlkit"))) {
        ValidationAlertBox("Please Select kit product .", "ddlkit", ModuleName);
        return false;
    }

    if (Dropdown_Validation(document.getElementById("ddlProduct"))) {
        ValidationAlertBox("Please Select Product .", "ddlProduct", ModuleName);
        return false;
    }

    if (Dropdown_Validation(document.getElementById("ddlBatchLot"))) {
        ValidationAlertBox("Please Select Batch/Lot No .", "ddlBatchLot", ModuleName);
        return false;
    }

    if (isBlank(document.getElementById('ddlStorageArea').value)) {
        ValidationAlertBox("Please enter Storage Area.", "ddlStorageArea", ModuleName);
        return false;
    }


    if (isBlank($('#fileToUpload').val())) {
        ValidationAlertBox("Please Select File !", "fileToUpload", ModuleName);
        return false;
    }
    if (isBlank($('#txtRemarks').val())) {
        ValidationAlertBox("Please Enter Remarks !", "txtRemarks", ModuleName);
        return false;
    }
    return true;
}

function clearControl() {
    $('#fileToUpload').val('')
    $('#txtRemarks').val("");
    //$('#DDLProjectNo').val("");


    $('#ddlProductType').val(0).attr("selected", "selected");
    $('#ddlTransferIndi').val(0).attr("selected", "selected");
    $("#ddlProduct").empty().append('<option selected="selected" value="0">Please Select Product</option>');
    $("#ddlkit").empty().append('<option selected="selected" value="0">Please select kit product</option>');
    $('#ddlBatchLot').empty().append('<option selected="selected" value="0">Please Select Batch/Lot/Lot No</option>');

    $("#ddlStorageArea").multiselect("clearSelection");
    $("#ddlStorageArea").multiselect('refresh');
}

function ViewMyProject() {
    $("#ddlProjectType").empty().append('<option selected="selected" value="0">Please Select Project Type</option>');
    var wStr = "vWorkspaceId = " + setworkspaceid + ""
    var WhereData = {
        WhereCondition_1: wStr,
        columnName_1: "Top 1 vProjectTypeCode,vProjectTypeName"
    }
    if (setworkspaceid != "") {
        $.ajax({
            url: BaseUrl + "PmsRecordFetch/View_MyProjects_FromBiznet",
            type: 'POST',
            data: WhereData,
            async: false,
            success: function (data) {
                data = data.Table;
                studytype = data[0].vProjectTypeCode;
            }
        });
    }
}

//Added by Rakesh
function GetProductType() {

    if (setworkspaceid != "") {
        var GetProductType = {
            Url: BaseUrl + "PmsGeneral/GetProductType/" + setworkspaceid,
            SuccessMethod: "SuccessMethod"
        }

        $.ajax({
            type: "GET",
            url: BaseUrl + "PmsGeneral/GetProductType",
            data: { id: setworkspaceid },
            success: SuccessMethod,
            error: function () {
                SuccessorErrorMessageAlertBox("Product Type not found.", ModuleName);
                return false;
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

$('#ddlProductType').on("change", function () {
    var nProductTypeID = $("#ddlProductType :selected").val()
    GetKit(nProductTypeID);
    GetProduct(nProductTypeID);
})

function GetKit(nProductTypeID) {
    var GetProductNameData = {
        vWorkSpaceId: setworkspaceid,
        nProductTypeID: nProductTypeID,
        cTransferIndi: "K",
    }

    var GetPmsProductBatchProductName = {
        Url: BaseUrl + "PMSGeneral/ProductName",
        SuccessMethod: "SuccessMethod",
        Data: GetProductNameData,
    }

    $.ajax({
        url: GetPmsProductBatchProductName.Url,
        type: 'POST',
        data: GetPmsProductBatchProductName.Data,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("No kit Product Found  !", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        var strdata = "";
        if (jsonData.length > 0) {
            $("#ddlkit").empty().append('<option selected="selected" value="0">Please select kit product</option>');
            for (var i = 0; i < jsonData.length; i++)
                $("#ddlkit").append($("<option></option>").val(jsonData[i].nProductNo).html(jsonData[i].vProductName));
        }
        else {
            $("#ddlkit").empty().append('<option selected="selected" value="0">Please Select Kit product</option>');
        }
    }
}


function GetProduct(nProductTypeID) {
    var GetProductNameData = {
        vWorkSpaceId: setworkspaceid,
        nProductTypeID: nProductTypeID,
        cTransferIndi: "P",
    }

    var GetPmsProductBatchProductName = {
        Url: BaseUrl + "PMSGeneral/ProductName",
        SuccessMethod: "SuccessMethod",
        Data: GetProductNameData,
    }

    $.ajax({
        url: GetPmsProductBatchProductName.Url,
        type: 'POST',
        data: GetPmsProductBatchProductName.Data,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("No Product Found  !", ModuleName);
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

var GetStorageArea = function () {

    $('#ddlStorageArea option').each(function () {
        $(this).remove();
    });
    var FilterData = {
        nStorageTypeId: 1,
        vLocationCode: $("#hdnUserLocationCode").val(),
    }

    $.ajax({
        url: BaseUrl + "PmsGeneral/ALLStorageAreaData",
        type: 'POST',
        data: FilterData,
        asyc: false,
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("Storage Area Not Found !", "ddlStorageArea", ModuleName);
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

$('#ddlkit').on('change', function () {
    $('#productNameNote').css("display", "block");
});

$('#ddlProduct').on('change', function () {
    GetBatchLotNo();
});

function GetBatchLotNo() {
    var projectid = setworkspaceid;
    var ProductNo = $('#ddlProduct').val();
    var GetPmsStudyReceiptBatchLotNo = {
        Url: BaseUrl + "PmsStudyProductReceipt/GetBatchLotNo",
        SuccessMethod: "SuccessMethod"
    }
    $.ajax({
        url: GetPmsStudyReceiptBatchLotNo.Url,
        type: 'GET',
        async: false,
        success: SuccessMethod,
        data: { id: projectid, projectno: ProductNo },
        error: function () {
            ValidationAlertBox("Batch/Lot Not Found !", "ddlBatchLot", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        var strdata = "";
        if (jsonData.length > 0) {
            $("#ddlBatchLot").empty().append('<option selected="selected" value="0">Please Select Batch/Lot No</option>');
            for (var i = 0; i < jsonData.length; i++)
                $("#ddlBatchLot").append($("<option></option>").val(jsonData[i].nStudyProductBatchNo).html(jsonData[i].vBatchLotNo));
        }
        else {
            $("#ddlBatchLot").empty().append('<option selected="selected" value="0">Please Select Batch/Lot No</option>');
        }
    }
}

// Get Grid data
function GetKitTypeDetail() {
    if (productIds[$('#ddlProjectNo').val()] != undefined) {
        setworkspaceid = productIds[$('#ddlProjectNo').val()];
    }
    if (setworkspaceid == "" || setworkspaceid == undefined) {
        return false;
    }

    var PostData = {
        vWorkSpaceID: setworkspaceid,
    }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/Proc_GetKitCreationHOandSiteWiseStock",
        type: 'POST',
        data: PostData,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Kit Data Is Not Found !", ModuleName);
        }
    });


    function SuccessMethod(jsonKitTypeData) {
        var StockAtHO = jsonKitTypeData.StockAtHO

        SessionVariableforExport();
        if (StockAtHO.length < 0) {
            $('#ExportButton').attr('style', 'display:none');
        }
        else if (StockAtHO.length > 0) {

            $('#ExportButton').attr('style', 'display:inline');
        }

        var StockAtSiteQty;
        var ActivityDataset = [];

        for (var i = 0; i < StockAtHO.length; i++) {
            var InDataset = [];
            var InActive_c;

            InDataset.push(StockAtHO[i].KitType, StockAtHO[i].vProductType, StockAtHO[i].StockAtHO, StockAtHO[i].StockAtSite, '', '', '', StockAtHO[i].nKitTYpeNo,
                          StockAtHO[i].KitType, StockAtHO[i].nProductTypeID, StockAtHO[i].vProductType, StockAtHO[i].iDoseQty, StockAtHO[i].vTreatmentType);
            ActivityDataset.push(InDataset);
        }
        otable = $('#tblPmsKitTypeDefineDtl').dataTable({
            "bJQueryUI": true,
            "sPaginationType": "full_numbers",
            "bLengthChange": true,
            "bProcessing": true,
            "bSort": true,
            //"order": [],
            "autoWidth": false,
            "aaData": ActivityDataset,
            "bInfo": true,
            "bDestroy": true,
            "aaSorting": [],
            "fnCreatedRow": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $('td:eq(4)', nRow).append('<a data-toggle="modal" data-tooltip="tooltip" title="Site Wise View" data-target="#KitSiteDetails" Onclick= GetSiteDetails(this); nKitTypeNo="' + aData[7]
                                            + '" iDoseQty="' + aData[11] + '" style="cursor:pointer;"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-search"></i><span>View</span></a>');

                if (aData[10] != 'Non IMP') {
                    $('td:eq(5)', nRow).append('<a data-toggle="modal" data-tooltip="tooltip" title="View" data-target="#KitCreationDetails"  Onclick= GetKitCreationDetail(this);  nKitTypeNo="' + aData[7]
                               + '"  style="cursor:pointer;"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-search"></i><span>View</span></a>');
                }
            },

            "aoColumns": [
                { "sTitle": "Kit Description" },
                { "sTitle": "Product Type" },
                { "sTitle": "Stock At HO" },
                { "sTitle": "Stock At Site" },
                { "sTitle": "Site Wise" },
                { "sTitle": "View" },

            ],
            "columnDefs": [
                { "bSortable": false, "targets": [4, 5] },
            ],
            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },
        });
    }
}

function SessionVariableforExport() {
    var url = WebUrl + "PmsKitCreation/GetSessionVariable";
    $.ajax({
        url: url,
        type: 'get',
        data: { id: setWorkspaceId },
        async: false,
        success: function (response) {
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Protocol No Not Found !", ModuleName);

        }
    });
}

function GetSiteDetails(e) {
    var nKitTypeNo = e.attributes['nKitTypeNo'].value;
    var iDoseQty = e.attributes['iDoseQty'].value;

    var PostData = {
        vWorkSpaceID: setworkspaceid,
        iDoseQty: iDoseQty,
        nKitTypeNo: nKitTypeNo,
        cTransferIndi: "K",
        nProductTypeID: "0"
    }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/Proc_GetSiteWiseQtyForKit",
        type: 'POST',
        data: PostData,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Kit Data Is Not Found !", ModuleName);
        }
    });

    function SuccessMethod(jsonKitTypeData) {
        var ActivityDataset = [];
        var jsonData = jsonKitTypeData.StockAtSite;
        for (var i = 0; i < jsonData.length; i++) {
            var InDataset = [];
            var InActive_c;
            InDataset.push(jsonData[i].vProjectNo, jsonData[i].MinimumStock, jsonData[i].iSalableClStockQty);
            ActivityDataset.push(InDataset);
        }
        otable = $('#tblSiteDetails').dataTable({
            "bJQueryUI": true,
            "sPaginationType": "full_numbers",
            "bLengthChange": true,
            "bProcessing": true,
            "bSort": true,
            "autoWidth": false,
            "aaData": ActivityDataset,
            "bInfo": true,
            "bDestroy": true,
            "aaSorting": [],
            "aoColumns": [
                 { "sTitle": "Site" },
                 { "sTitle": "Minimum Stock" },
                 { "sTitle": "No Of Kit" },
            ],
            "fnCreatedRow": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                if (aData[1] > aData[2]) {
                    $('td', nRow).eq(2).addClass('hightlightUnblindedKit');
                }
            },
            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },
        });
    }
}

function GetKitCreationDetail(e) {

    var nKitTypeNo = e.attributes['nKitTypeNo'].value;

    var PostData = {
        WhereCondition_1: 'nKitTypeNo = ' + nKitTypeNo + ' Order by nKitCreationNo Desc'
    }
    $.ajax({
        url: BaseUrl + "PmsRecordFetch/View_StudyProductKitCreationDtl",
        type: 'POST',
        data: PostData,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Kit Type Data Is Not Found !", ModuleName);
        }
    });

    function SuccessMethod(jsonKitTypeData) {
        var count = 0;
        var ActivityDataset = [];
        KitTypeData = jsonKitTypeData.Table;
        var jsonData = jsonKitTypeData.Table;
        for (var i = 0; i < jsonData.length; i++) {
            var InDataset = [];
            var InActive_c;
            InDataset.push('', jsonData[i].vKitNo, jsonData[i].vProductType, jsonData[i].vModifyBy, jsonData[i].dModifyOn);
            ActivityDataset.push(InDataset);
        }
        otableKitCreationDetails = $('#tblKitCreationDetails').dataTable({
            "bJQueryUI": true,
            "sPaginationType": "full_numbers",
            "bLengthChange": true,
            "bProcessing": true,
            "bSort": true,
            //"order":[],
            "autoWidth": false,
            "aaData": ActivityDataset,
            "bInfo": true,
            "bDestroy": true,
            "aaSorting": [],
            "fnCreatedRow": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                count++;
                $('td:eq(0)', nRow).append('<span id="spnimg' + count + '" class="fa fa-plus-circle" onclick="ExtraKitData(' + count + ')" style="font-size:20px;margin-left:10px;" title="Extra Kit Details"/>');
            },
            "aoColumns": [
                 { "sTitle": "" },
                 { "sTitle": "Kit No." },
                 { "sTitle": "Kit Type" },
                 { "sTitle": "Created By" },
                 { "sTitle": "Created On" },



            ],
            "columnDefs": [
                { "bSortable": false, "targets": [0] },
            ],
            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },
        });
    }

}

function ExtraKitData(count) {
    var tr = $("#tblKitCreationDetails").closest('tr');
    var row = otableKitCreationDetails.api().row(count - 1)
    if (row.child.isShown()) {
        // This row is already open - close it
        row.child.hide();
        $("#spnimg" + count + "").removeClass('fa-minus-circle').addClass('fa-plus-circle');
    }
    else {
        // Open this row
        row.child(format(row.data())).show();
        $("#spnimg" + count + "").removeClass('fa-plus-circle').addClass('fa-minus-circle');
    }
}

function format(d) {
    var stradata = "";
    // `d` is the original data object for the row
    var projectNo = $('#DDLProjectNo').val();
    projectNo = projectNo.split("[");
    var new_ProjectNo = projectNo[1].split("]");
    var PostData = {
        WhereCondition_1: "vKitNo = '" + d[1] + "' and vProjectNo= '" + new_ProjectNo[0].trim().trimStart() + "'"
    }
    $.ajax({
        url: BaseUrl + "PmsRecordFetch/View_StudyProductKitCreationSubDtl",
        type: 'POST',
        data: PostData,
        async: false,
        success: function (jsondata) {
            ExtraKitDataObject = jsondata.Table;
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Kit Type Data Is Not Found !", ModuleName);
        }
    });


    stradata += "<table id='tblExtraKitDetail' border='1' class='table table-bordered table-striped dataTable no-footer' style='width: 80%; margin-left: 10%;'>";
    stradata += "<thead><tr><th>Kit Type</th><th>Product</th><th>Qty/Kit</th><th>Batch/Lot</th><th>Created By</th><th>Created Ont</th></tr></thead>";
    stradata += "<tbody>"

    if (ExtraKitDataObject.length != 0) {
        for (var i = 0; i < ExtraKitDataObject.length; i++) {
            stradata += "<tr><td style=text-align:center>" + ExtraKitDataObject[i].vProductType
                        + "</td><td style=text-align:center>" + ExtraKitDataObject[i].vProductName
                        + "</td><td style=text-align:center>" + ExtraKitDataObject[i].DoseQty
                        + "</td><td style=text-align:center>" + ExtraKitDataObject[i].vBatchLotNo
                        + "</td><td style=text-align:center>" + ExtraKitDataObject[i].vModifyBy
                        + "</td><td style=text-align:center>" + ExtraKitDataObject[i].dModifyOn + "</td></tr>";
        }
    }
    else {
        stradata += "<tr><td colspan='6'>There is Not Data Found</td></tr>";
    }

    stradata += "</tbody></table>";
    return stradata;
}