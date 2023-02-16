var iUserId;
var workspaceId = new Object();
var ModuleName = "Kit Creation"
var nProductTypeID = 0;
var vTreatmentType = "";
var ExtraKitDataObject;
var TotalNoofKitGenerated = 0;
var vProjectTypeCode;
var setworkspaceid = "";
//$(function () {
$(document).ready(function () {

    //CheckSetProjectGeneral("ddlProjectNo");
    CheckSetProject();
    //GetAllParentPRoject();
    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('.modal').modal('hide');

    var GetProjectNo = {
        Url: BaseUrl + "PmsGeneral/GetScopeWiseProject",
        SuccessMethod: "SuccessMethod"
    }

    $('#ddlProjectNo').on('change keyup paste mouseup', function () {

        if ($('#ddlProjectNo').val().length == 2) {
            var ProjectNoDataTemp = {
                //vWorkSpaceID: $('#ddlProjectNo').val(),
                iUserId: $("#hdnuserid").val(),
                vStudyCode: $('#ddlProjectNo').val()
                //vProjectTypeCode: $("#hdnscopevalues").val(),
            }
            //CheckSetProject();
            GetAllParentPRoject(GetProjectNo.Url, GetProjectNo.SuccessMethod, ProjectNoDataTemp);
        }
        else if ($('#ddlProjectNo').val().length < 2) {
            $("#ddlProjectNo").autocomplete({
                source: "",
                change: function (event, ui) {
                    //var keyEvent = $.Event("Keydown");
                    //keyEvent.KeyCode = $.ui.keyCode.DOWN;
                    //$(this).trigger(keyEvent);
                },
                select: function (event, ui) {
                    vProjectNo = ui.item.value;
                    $('#ddlProjectNo').val(vProjectNo);
                    GetKitTypeDetail();
                },
            });
        }
    });

    $('#ddlStorageArea').multiselect({
        nonSelectedText: 'Please Select StorageArea',
        buttonClass: 'form-control',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        numberDisplayed: 2,
    });

    $('#ddlApplicableForVisit').multiselect({
        nonSelectedText: 'Please Select Visit',
        buttonClass: 'form-control',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        numberDisplayed: 2,
    });

    if (setworkspaceid != "") {
        GetKitTypeDetail();
    }
});

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
    // For Server use

    $.ajax({
        type: "GET",
        url: BaseUrl + "PmsGeneral/GetSetProjectDetails",
        data: { id: PassData.iUserId },
        dataType: "json",
        async: false,
        success: function (jsonData) {
            if (jsonData.length > 0) {
                $('#ddlProjectNo').val(jsonData[0].vProjectNo);
                setworkspaceid = jsonData[0].vWorkSpaceId;
            }
            else {
                $('#ddlProjectNo').val('');
            }
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Project not found.", ModuleName);
        }
    });
}


var GetAllParentPRoject = function (Url, SuccessMethod, ProjectNoDataTemp) {
    $.ajax({
        url: Url,
        type: 'GET',
        data: { iUserId: ProjectNoDataTemp.iUserId ,vStudyCode : ProjectNoDataTemp.vStudyCode},
        async: false,
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("Protocol No Not Found !", "ddlProjectNo", ModuleName);

        }
    });
    function SuccessMethod(jsonData) {
        var jsonObj = jsonData;
        var sourceArr = [];

        for (var i = 0; i < jsonObj.length; i++) {
            sourceArr.push("[ " + jsonObj[i].vStudyCode + " ]" + " " + jsonObj[i].vStudyName);
            workspaceId["[ " + jsonObj[i].vStudyCode + " ]" + " " + jsonObj[i].vStudyName] = jsonObj[i].nStudyNo;
        }

        $("#ddlProjectNo").autocomplete({
            source: sourceArr,
            change: function (event, ui) {
            },
            select: function (event, ui) {
                GetKitTypeDetail();
            }
        });

    }
}

var GetAllParentPRoject_Old = function () {
    var ProjectNoDataTemp =
    {
        //vProjectNo: "",
        //iUserId: $("#hdnuserid").val(),
        //vProjectTypeCode: $("#hdnscopevalues").val(),
        vProjectNo: $('#ddlProjectNodashboard').val(),
        iUserId: $("#hdnuserid").val(),
        vProjectTypeCode: $("#hdnscopevalues").val(),
        cParentChildIndi: "P"
    }
    $.ajax({
        url: BaseUrl + "PmsRecordFetch/AllParentProject",
        type: 'POST',
        data: ProjectNoDataTemp,
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("Protocol No Not Found !", "ddlProjectNo", ModuleName);
        }
    });
    function SuccessMethod(jsonData) {

        var strdata = "";
        jsonData = jsonData.Table
        if (jsonData.length > 0) {
            var jsonObj = jsonData;
            var sourceArr = [];

            for (var i = 0; i < jsonObj.length; i++) {
                sourceArr.push("[ " + jsonObj[i].vStudyCode + " ]" + " " + jsonObj[i].vStudyName);
                workspaceId["[ " + jsonObj[i].vStudyCode + " ]" + " " + jsonObj[i].vStudyName] = jsonObj[i].nStudyNo;

                //sourceArr.push("[ " + jsonObj[i].vProjectNo + " ]" + " " + jsonObj[i].vRequestId);
                //workspaceId["[ " + jsonObj[i].vProjectNo + " ]" + " " + jsonObj[i].vRequestId] = jsonObj[i].vWorkspaceId;
            }
            $("#ddlProjectNo").autocomplete({
                source: sourceArr,
                change: function (event, ui) {
                },
                select: function (event, ui) {
                    GetKitTypeDetail();
                    //$('#ddlProjectNo').blur();
                }
            });
        }

    }
}

$('#ddlProjectNo').on('blur', function () {
    GetKitTypeDetail();
    //GetVisit();
});

function GetKitTypeDetail() {
    if (workspaceId[$('#ddlProjectNo').val()] != undefined) {
        setworkspaceid = workspaceId[$('#ddlProjectNo').val()];
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
        //KitTypeData = jsonKitTypeData.Table;
        //var jsonData = jsonKitTypeData.Table;

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

                $('td:eq(5)', nRow).append('<a data-toggle="modal" data-tooltip="tooltip" title="Add" data-target="#DataRandonizationView" Onclick= AddKitCreation(this); nKitTypeNo ="' + aData[7]
                                           + '" vKitTypeDesc="' + aData[8] + '"  nProductTypeID="' + aData[9] + '" vProductType="' + aData[10] + '" iDoseQty="' + aData[11] + '" vTreatmentType = "' + aData[12]
                                           + '"  style="cursor:pointer;"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-plus"></i><span>Add</span></a>');

                if (aData[10] != 'Non IMP') {
                    $('td:eq(6)', nRow).append('<a data-toggle="modal" data-tooltip="tooltip" title="View" data-target="#KitCreationDetails"  Onclick= GetKitCreationDetail(this);  nKitTypeNo="' + aData[7]
                               + '"  style="cursor:pointer;"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-search"></i><span>View</span></a>');
                }
            },

            "aoColumns": [
                { "sTitle": "Kit Description" },
                { "sTitle": "Product Type" },
                { "sTitle": "Stock At HO" },
                { "sTitle": "Stock At Site" },
                { "sTitle": "Site Wise" },
                { "sTitle": "Add Kit" },
                { "sTitle": "View" },
            ],
            "columnDefs": [
                { "bSortable": false, "targets": [4, 5, 6] },
            ],
            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },
        });
    }
}

function AddKitCreation(e) {
    var nKitTypeNo = e.attributes['nKitTypeNo'].value;
    var vKitTypeDesc = e.attributes['vKitTypeDesc'].value;
    nProductTypeID = e.attributes['nProductTypeID'].value;
    var vProductType = e.attributes['vProductType'].value;
    var iDoseQty = e.attributes['iDoseQty'].value;
    vTreatmentType = e.attributes['vTreatmentType'].value;

    clearData();
    $('#btnSavePmsKitCreation').hide();
    $('#tblKitCreationTemp').hide();
    $("#divtblKitCreationTemp").hide();
    $('#tblKitCreationTemp tbody').text('');

    $("#titleMode").text('Mode:-Add');
    $("#txtProjectNo").val($("#ddlProjectNo").val());
    if (isBlank(document.getElementById('txtProjectNo').value)) {
        ValidationAlertBox("Please Enter Protocol No !", "txtProjectNo", ModuleName);
        return false;
    }
    ////Fill Data
    $("#ddlKitType").empty().append('<option  value="0">Please Select Kit Type</option>');
    $("#ddlKitType").append($("<option selected='selected'></option>").val(nKitTypeNo).html(vKitTypeDesc));
    $('#txtQtyKit').val(iDoseQty);

    GetProjectType();
    GetProduct(nProductTypeID);
    GetStorageArea();
    //GetVisit();
    $('#KitCreationModel').modal('show');

}

function GetProjectType() {
    var ProjectData = {
        vWorkSpaceID: setworkspaceid,
    }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/Proc_GetProjectType",
        type: 'POST',
        data: ProjectData,
        success: SuccessMethodForProjectCode,
        error: function () {
            SuccessorErrorMessageAlertBox("Kit !", ModuleName);
        }
    });

    function SuccessMethodForProjectCode(data) {

        if (data.PROJECTTYPEDATA.length != 0) {
            var a = data.PROJECTTYPEDATA;
            var projectcode = a[0].vProjectTypeCode;
            vProjectTypeCode = projectcode;

            document.getElementById("txtQtyKit").disabled = false;
        }
        //if (vProjectTypeCode == "0002") {
        //    document.getElementById("txtQtyKit").disabled = false;
        //}

        //if (vProjectTypeCode == "0014") {
        //    document.getElementById("txtQtyKit").disabled = true;
        //}

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
        async : false,
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
        nStorageTypeId: 1, //80,
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

$('#ddlProduct').on('change', function () {
    GetBatchLotNo();
});

$('#ddlBatchLot').on('change', function () {
    var PostData = {
        WhereCondition_1: "vWorkSpaceId = '" + setworkspaceid + "' and nProductNo = '" + $("#ddlProduct").val() + "' and nStudyProductBatchNo = '" + $("#ddlBatchLot").val() + "'"
    }
    if ($("#ddlBatchLot").val() != 0) {
        $.ajax({
            url: BaseUrl + "PmsRecordFetch/ExpiryDateofProduct",
            type: 'POST',
            data: PostData,
            success: function (jsonData) {
                if (jsonData.Table.length != 0) {

                    var expdate = new Date(Date.parse(jsonData.Table[0].dExpDate));
                    var TodayDate = new Date();

                    if (expdate < TodayDate) {
                        var monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
                        var date = new Date(expdate)
                        date.setDate(date.getDate())
                        date = date.getDate() + "-" + monthNames[date.getMonth()] + "-" + date.getFullYear();
                        ValidationAlertBox("" + $("#ddlProduct :selected").text() + " is Expired on " + date + ", So You Can Not Create Kit for This Product !", "ddlBatchLot", ModuleName);
                        $("#ddlBatchLot").val(0);
                        return false;
                    }
                }
            },
            async: false,
            error: function () {
                SuccessorErrorMessageAlertBox("Kit Type Data Is Not Found !", ModuleName);
            }
        });
    }
});

function GetBatchLotNo() {
    var projectid = workspaceId[$('#ddlProjectNo').val()];
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
        data: { id: setworkspaceid, projectno: ProductNo },
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

function clearData() {
    TempDataClear();
    $('#tblKitCreationTemp tbody').text('');
    $('#tblKitCreationTemp').hide();
    $("#divtblKitCreationTemp").hide();
    $('#btnSavePmsKitCreation').hide();
    $('#ddlProduct').prop("disabled", false);
    $('#ddlBatchLot').prop("disabled", false);
    $('#ddlProduct').val(0).attr("selected", "selected");
    $('#ddlBatchLot').val(0).attr("selected", "selected");
    $('#tblExtraKitAttach tbody').text('');
    $('#tblExtraKitAttach').hide();
}

function TempDataClear() {
    //$("#txtNoOfKit").val("");
    $('#ddlProduct').val(0).attr("selected", "selected");
    $('#ddlBatchLot').val(0).attr("selected", "selected");
    $("#ddlStorageArea").multiselect("clearSelection");
    $("#ddlStorageArea").multiselect('refresh');
    $("#ddlApplicableForVisit").multiselect("clearSelection");
    $("#ddlApplicableForVisit").multiselect('refresh');
    $("#txtRemarks").val("");
    //$("#txtQtyKit").val("");
}

$("#tblKitCreationTemp").on('click', '#trRemove', function () {
    $(this).closest('tr').remove();

    if ($("#tblKitCreationTemp tbody tr").length != 0) {
        $("#tblKitCreationTemp").show();
        $("#btnSavePmsKitCreation").show();
        $("#divtblKitCreationTemp").show();
        $("#divtblKitCreationTemp").show();
    }
    else {
        $("#tblKitCreationTemp").hide();
        $('#btnSavePmsKitCreation').hide();
        $("#divtblKitCreationTemp").hide();
        $("#divtblKitCreationTemp").hide();
        $('#ddlProduct').prop("disabled", false);
        $('#ddlBatchLot').prop("disabled", false);
    }
});

function AddTempData() {
    if (OtherQuantityCheck() == false) {
        return false;
    }

    if (validateform() != false) {
        $("#tblKitCreationTemp").show();
        $("#divtblKitCreationTemp").show();
        //for (i = 1; i <= parseInt($("#txtNoOfKit").val()) ; i++) {
        var strdata = "";
        strdata += "<tr>";
        strdata += "<td>" + $('#txtProjectNo').val() + "</td>";
        strdata += "<td>" + $("#ddlKitType :selected").text() + "</td>";
        strdata += "<td>" + $("#txtQtyKit").val() + "</td>";
        strdata += "<td>" + $("#ddlProduct :selected").text() + "</td>";
        strdata += "<td>" + $("#ddlBatchLot :selected").text() + "</td>";
        //strdata += "<td>" + 1 + "</td>";
        strdata += "<td>" + $("#ddlStorageArea :selected").text() + "</td>";
        strdata += "<td>" + $("#txtRemarks").val() + "</td>";
        strdata += "<td class='hidetd'>" + setworkspaceid + "</td>";
        strdata += "<td class='hidetd'>" + $("#ddlKitType :selected").val() + "</td>";
        strdata += "<td class='hidetd'>" + $("#ddlProduct :selected").val() + "</td>";
        strdata += "<td class='hidetd'>" + $("#ddlBatchLot :selected").val() + "</td>";
        strdata += "<td class='hidetd'>" + $("#ddlStorageArea").val() + "</td>";
        strdata += "<td id='trRemove'><span class='glyphicon glyphicon-remove'></span></td>";
        strdata += "</tr>";
        $("#tblKitCreationTemp").append(strdata);
        $("#btnSavePmsKitCreation").show();
        $(".hidetd").hide();
        //}

        //$('#ddlProduct').attr("disabled", "disabled");
        //$('#ddlBatchLot').attr("disabled", "disabled");
        //TotalNoofKitGenerated = $("#txtNoOfKit").val();
        TempDataClear();
    }
}

function OtherQuantityCheck() {
    var status = true;

    if (workspaceId[$('#ddlProjectNo').val()] != undefined) {
        setworkspaceid = workspaceId[$('#ddlProjectNo').val()];
    }
    if (setworkspaceid == "" || setworkspaceid == undefined) {
        return false;
    }
    var ExtraKitTableLength = $('table#tblExtraKitAttach').find('tbody').find('tr');

    for (var i = 0; i < ExtraKitTableLength.length; i++) {
        var KitQty = $(ExtraKitTableLength[i]).find('td:eq(1)').html();
        var nProductNo = $(ExtraKitTableLength[i]).find('td:eq(6)').html();
        var nStudyProductBatchNo = $(ExtraKitTableLength[i]).find('td:eq(7)').html();
        var ProductName = $(ExtraKitTableLength[i]).find('td:eq(2)').html();
        var BatchLotNo = $(ExtraKitTableLength[i]).find('td:eq(3)').html();
        var TotalQuantity = parseInt(KitQty) * parseInt($("#txtNoOfKit").val());

        var QualityCheckData = {
            vWorkSpaceId: setworkspaceid,
            vProductNo: nProductNo,
            nStudyProductBatchNo: nStudyProductBatchNo,
            vRefModule: 'PD'
        }

        var URLQty = BaseUrl + "PmsGeneral/QtyDetail";
        $.ajax({
            url: URLQty,
            type: 'POST',
            data: QualityCheckData,
            async: false,
            success: Success,
            error: function () {
                SuccessorErrorMessageAlertBox("Quantity Not Found !", ModuleName);
                status = false;
            }
        });

        function Success(response) {
            if (parseInt(response) < parseInt(TotalQuantity)) {
                ValidationAlertBox("Current Stock Is " + response + " for Product " + ProductName + " and Batch/Lot No " + BatchLotNo + "!", "txtNoOfKit", ModuleName);
                status = false;
            }
            else {
                status = true;
            }
        }
        if (status == false) {
            break;
        }
    }

    return status;
}

//$('#btnSavePmsKitCreation').on('click', function () {

//    var HTMLtbl =
//    {
//        getData: function (table) {
//            var data = [];
//            table.find('tr').not(':first').each(function (rowIndex, r) {
//                var cols = [];
//                $(this).find('td').each(function (colIndex, c) {

//                    if ($(this).children(':text,:hidden,textarea,select').length > 0)
//                        cols.push($(this).children('input,textarea,select').val().trim());

//                    else if ($(this).children(':checkbox').length > 0)
//                        cols.push($(this).children(':checkbox').is(':checked') ? 1 : 0);
//                    else
//                        cols.push($(this).text().trim());
//                });
//                data.push(cols);
//            });
//            return data;
//        }
//    }

//    var TableData = HTMLtbl.getData($('#tblKitCreationTemp'));
//    var KitCreateData = [];
//    var QtyKit = 0;

//    for (i = 0; i < TableData.length; i++)
//    {
//        KitCreateData.push({
//            vWorkSpaceId: TableData[i][8],
//            nKitTypeNo: TableData[i][9],
//            iDoseQty: TableData[i][2],
//            nProductNo: TableData[i][10],
//            nStudyProductBatchNo: TableData[i][11],
//            //iNoOfKit: TableData[i][5],
//            vStorageArea: TableData[i][12],
//            vRemark: TableData[i][7],
//            iModifyBy: $("#hdnuserid").val(),
//            nProductTypeID :nProductTypeID,
//        });
//        QtyKit = parseInt(QtyKit) + parseInt(TableData[i][2]);
//    }

//    if (CheckQty(QtyKit) == false) {
//        return false;
//    }
//    else {

//    }


//    $.ajax({
//        url: BaseUrl + "PmsRecordSave/Save_StudyProductKitCreationDtl",
//        type: 'POST',
//        data: { '': KitCreateData },
//        //data: KitCreateData,
//        success: SuccessInsertData,
//        async: false,
//        error: function () {
//            SuccessorErrorMessageAlertBox("Error To Save Data in Kit Type !", ModuleName);

//        }
//    });

//    function SuccessInsertData(response)
//    {
//        ExtraKitAttachment(response);
//        //SuccessorErrorMessageAlertBox("Record Saved Successfully !", ModuleName);
//        //GetKitTypeDetail();
//        //$('.Close').click();
//    }
//});

function GetVisit() {
    $('#ddlApplicableForVisit option').each(function () {
        $(this).remove();
    });
    if (workspaceId[$('#ddlProjectNo').val()] != undefined) {
        setworkspaceid = workspaceId[$('#ddlProjectNo').val()];
    }
    if (setworkspaceid == "" || setworkspaceid == undefined) {
        return false;
    }
    var PostData = {
        WhereCondition_1: "vWorkSpaceId = '" + setworkspaceid + "' AND vNodeDisplayName <> ''  Order By iPeriod",
        columnName_1: 'Distinct vWorkspaceId ,vNodeDisplayName,iPeriod',
    }
    $.ajax({
        url: BaseUrl + "PmsRecordFetch/View_WorkSpaceNodeDetail",
        type: 'POST',
        data: PostData,
        success: SuccessMethod,
        async: false,
        error: function () {
            SuccessorErrorMessageAlertBox("Period Not Found !", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        jsonData = jsonData.Table;
        if (jsonData.length > 0) {
            for (var i = 0; i < jsonData.length; i++)
                $("#ddlApplicableForVisit").append($("<option></option>").val(jsonData[i].vNodeDisplayName).html(jsonData[i].vNodeDisplayName));
            $('#ddlApplicableForVisit').multiselect('rebuild');

        }
        else {
            //$("#ddlApplicableForVisit").empty().append('<option selected="selected" value="0">Please Select Visit</option>');
        }
    }
}


function validateform() {
    var QtyPerKitValue = document.getElementById("txtQtyKit").value
    if (Dropdown_Validation(document.getElementById("ddlKitType"))) {
        ValidationAlertBox("Please Select Kit Type !", "ddlKitType", ModuleName);
        return false;
    }

    if (vProjectTypeCode == "0002") {
        if (isBlank(document.getElementById("txtQtyKit").value)) {
            ValidationAlertBox("Please Enter Qty / Kit .", "txtQtyKit", ModuleName);
            return false;
        }
    }
    if (Dropdown_Validation(document.getElementById("ddlProduct"))) {
        ValidationAlertBox("Please Select Product .", "ddlProduct", ModuleName);
        return false;
    }

    if (Dropdown_Validation(document.getElementById("ddlBatchLot"))) {
        ValidationAlertBox("Please Select Batch/Lot No .", "ddlBatchLot", ModuleName);
        return false;
    }
    if (QtyPerKitValue.startsWith ('0')) {
        ValidationAlertBox("Qty / Kit Value Should Be Greater Than Zero .", "txtQtyKit", ModuleName);
        return false;
    }

//add validation for already exist product and batch
var HTMLtblTemp =
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
var TableDataTemp = HTMLtblTemp.getData($('#tblKitCreationTemp'));
if (TableDataTemp.length > 0) {
    for (var m = 0; m < TableDataTemp.length; m++) {
        if (TableDataTemp[m][9] == $("#ddlProduct :selected").val() && TableDataTemp[m][10] == $("#ddlBatchLot :selected").val()) {
            ValidationAlertBox($("#ddlProduct :selected").text() + " Material and " + $("#ddlBatchLot :selected").text() + " Batch/Lot/Lot No Already Exist!", "btnAddTempKitCreation", ModuleName);
            return false;
        }
    }
}

//if (isBlank(document.getElementById('txtNoOfKit').value)) {
//    ValidationAlertBox("Please Enter No of Kit !", "txtNoOfKit", ModuleName);
//    return false;
//}

//if ((document.getElementById('txtNoOfKit').value).trim() == "0") {
//    ValidationAlertBox("Please Enter Valid No Of Kit !", "txtNoOfKit", ModuleName);
//    return false;
//}

//if ($('#ddlApplicableForVisit').val() == null) {
//    ValidationAlertBox("Please Select At Least One Visit !", "txtNoOfKit", ModuleName);
//    return false;
//}
}

function CheckQty(kitqty, nProductNo, nStudyProductBatchNo) {
    var status = false;
    setworkspaceid = workspaceId[$('#ddlProjectNo').val()];

    var QualityCheckData = {
        vWorkSpaceId: setworkspaceid,
        vProductNo: nProductNo,
        nStudyProductBatchNo: nStudyProductBatchNo,
        vRefModule: 'PD'
    }

    var URLQty = BaseUrl + "PmsGeneral/QtyDetail";
    $.ajax({
        url: URLQty,
        type: 'POST',
        data: QualityCheckData,
        async: false,
        success: Success,
        error: function () {
            SuccessorErrorMessageAlertBox("Quantity Not Found !", ModuleName);
            status = false;
        }
    });

    function Success(response) {
        if (parseInt(response) < parseInt(kitqty)) {
            ValidationAlertBox("Current Stock Is  " + response + " !", "txtNoOfKit", ModuleName);
            status = false;
        }
        else {
            status = true;
        }
    }
    return status;
}

function SessionVariableforExport() {
    var url = WebUrl + "PmsKitCreation/GetSessionVariable";
    $.ajax({
        url: url,
        type: 'get',
        data: { id: setworkspaceid },
        async: false,
        success: function (response) {
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Protocol No Not Found !", ModuleName);
        }
    });
}

function AddAnotherKit() {
    $("#txtAnotherKitTypeQty").val('');
    $("#ddlAnotherProduct").empty().append($("<option></option>").val("0").html("Please Select Product"));
    $("#ddlAnotherBatch").empty().append($("<option></option>").val("0").html("Please Select Batch/Lot No"));
    $('#AddAnotherKit').modal('show');
    GetAnotherKitType();
}

function GetAnotherKitType() {
    if (workspaceId[$('#ddlProjectNo').val()] != undefined) {
        setworkspaceid = workspaceId[$('#ddlProjectNo').val()];
    }
    if (setworkspaceid == "" || setworkspaceid == undefined) {
        return false;
    }

    var PostData = {
        WhereCondition_1: "vWorkSpaceId = '" + setworkspaceid + "' and vTreatmentType = '" + vTreatmentType + "' and vKitTypeDesc <> '" + $("#ddlKitType :selected").text() + "'"
        //and vKitTypedesc <> '" + $("#ddlKitType :selected").text() + "'";
    }
    $.ajax({
        url: BaseUrl + "PmsRecordFetch/View_StudyProductKitTypeMst",
        type: 'POST',
        data: PostData,
        success: SuccessMethod,
        async: false,
        error: function () {
            SuccessorErrorMessageAlertBox("Kit Type Data Is Not Found !", ModuleName);
        }
    });

    function SuccessMethod(jsonKitTypeData) {
        jsonData = jsonKitTypeData.Table;
        if (jsonData.length > 0) {
            $("#ddlAnotherKitType").empty().append('<option selected="selected" value="0">Please Select Kit</option>');
            for (var i = 0; i < jsonData.length; i++)
                $("#ddlAnotherKitType").append($("<option></option>").val(jsonData[i].nKitTypeNo).html(jsonData[i].vKitTypeDesc));
        }
        else {
            $("#ddlAnotherKitType").empty().append('<option selected="selected" value="0">Please Select Kit</option>');
        }
    }
}

$('#ddlAnotherKitType').on('change', function () {
    if (workspaceId[$('#ddlProjectNo').val()] != undefined) {
        setworkspaceid = workspaceId[$('#ddlProjectNo').val()];
    }
    if (setworkspaceid == "" || setworkspaceid == undefined) {
        return false;
    }

    var PostData = {
        vWorkSpaceId: setworkspaceid,
        vTreatmentType: vTreatmentType,
        vKitTypeDesc: $("#ddlAnotherKitType :selected").text(),
    }
    $.ajax({
        url: BaseUrl + "PmsRecordFetch/Proc_GetKitTypeWithouMapping",
        type: 'POST',
        data: PostData,
        success: function (jsonData) {
            jsonData = jsonData.Table;
            if (jsonData.length != 0) {
                var PostData = {
                    WhereCondition_1: "vWorkSpaceId = '" + setworkspaceid + "' and nProductNo = '" + jsonData[0].nProductNo + "' and nStudyProductBatchNo = '" + jsonData[0].nStudyProductBatchNo + "'"
                }

                $.ajax({
                    url: BaseUrl + "PmsRecordFetch/ExpiryDateofProduct",
                    type: 'POST',
                    data: PostData,
                    success: function (JsonExpDate) {
                        var expdate = new Date(Date.parse(JsonExpDate.Table[0].dExpDate));
                        var TodayDate = new Date();

                        if (expdate < TodayDate) {
                            var monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
                            var date = new Date(expdate)
                            date.setDate(date.getDate())
                            date = date.getDate() + "-" + monthNames[date.getMonth()] + "-" + date.getFullYear();
                            ValidationAlertBox("" + jsonData[0].vProductName + " is Expiried on " + date + ", So You Can Not Create Kit for This Product !", "ddlBatchLot", ModuleName);
                            $("#ddlBatchLot").val(0);
                            return false;
                        }
                        else {
                            $("#txtAnotherKitTypeQty").val(jsonData[0].iDoseQty);
                            $("#ddlAnotherProduct").empty().append($("<option></option>").val(jsonData[0].nProductNo).html(jsonData[0].vProductName));
                            $("#ddlAnotherBatch").empty().append($("<option></option>").val(jsonData[0].nStudyProductBatchNo).html(jsonData[0].vBatchLotNo));
                        }
                    },
                    async: false,
                    error: function () {
                        SuccessorErrorMessageAlertBox("Kit Type Data Is Not Found !", ModuleName);
                    }
                });
            }
            else {
                $("#txtAnotherKitTypeQty").val(0);
                $("#ddlAnotherProduct").empty().append($("<option></option>").val("0").html("Please Select Product"));
                $("#ddlAnotherBatch").empty().append($("<option></option>").val("0").html("Please Select Batch/Lot No"));
            }
        },
        async: false,
        error: function () {
            SuccessorErrorMessageAlertBox("Kit Type Data Is Not Found !", ModuleName);
        }
    });
});

function AddAnotherKitTemp() {
    if (Dropdown_Validation(document.getElementById("ddlAnotherKitType"))) {
        $("#ddlAnotherKitType").val("0");
        $("#txtAnotherKitTypeQty").val("0");
        $("#ddlAnotherProduct").empty().append('<option  value="0">Please Select Product</option>');
        $("#ddlAnotherBatch").empty().append('<option  value="0">Please Select Batch/Lot Number</option>');
        ValidationAlertBox("Please Select Kit Type !", "ddlAnotherKitType", ModuleName);
        return false;
    }

    var MyRows = $('table#tblExtraKitAttach').find('tbody').find('tr');
    for (var i = 0; i < MyRows.length; i++) {
        var kittype = $(MyRows[i]).find('td:eq(0)').html()

        if (kittype == $('#ddlAnotherKitType :selected').text()) {
            $("#ddlAnotherKitType").val("0");
            $("#txtAnotherKitTypeQty").val("0");
            $("#ddlAnotherProduct").empty().append('<option  value="0">Please Select Product</option>');
            $("#ddlAnotherBatch").empty().append('<option  value="0">Please Select Batch/Lot Number</option>');
            ValidationAlertBox("This Kit Type Already Added!", "ddlAnotherKitType", ModuleName);
            return false;
        }
    }

    var strdata = "";
    //var MyRows = $('table#tblExtraKitAttach').find('tbody').find('tr');
    //for (var i = 0; i < MyRows.length; i++) {
    strdata += "<tr>";
    strdata += "<td >" + $('#ddlAnotherKitType :selected').text() + "</td>";
    strdata += "<td >" + $("#txtAnotherKitTypeQty").val() + "</td>";
    strdata += "<td >" + $("#ddlAnotherProduct :selected").text() + "</td>";
    strdata += "<td>" + $("#ddlAnotherBatch :selected").text() + "</td>";
    strdata += "<td id='trRemove'><span class='glyphicon glyphicon-remove'></span></td>";
    strdata += "<td class='hidetd'>" + $("#ddlAnotherKitType").val() + "</td>";
    strdata += "<td class='hidetd'>" + $("#ddlAnotherProduct").val() + "</td>";
    strdata += "<td class='hidetd'>" + $("#ddlAnotherBatch").val() + "</td>";
    strdata += "</tr>";

    //}

    $("#tblExtraKitAttach").append(strdata);
    $(".hidetd").hide();
    $("#tblExtraKitAttach").show();
    $("#ddlAnotherKitType").val("0");
    $("#txtAnotherKitTypeQty").val("0");
    $("#ddlAnotherProduct").empty().append('<option  value="0">Please Select Product</option>');
    $("#ddlAnotherBatch").empty().append('<option  value="0">Please Select Batch/Lot Number</option>');
}

function ExtraKitAttachment(response) {
    var ExtraKitAttach = [];
    var ExtraKitAttachFinal = [];
    var MyRows = $('table#tblExtraKitAttach').find('tbody').find('tr');

    for (var i = 0; i < MyRows.length; i++) {
        ExtraKitAttach =
        {
            //iDoseQty: $(MyRows[i]).find('td:eq(1)').html(),
            iDoseQty: parseInt(TotalNoofKitGenerated) * parseInt($(MyRows[i]).find('td:eq(1)').html()),
            nProductNo: $(MyRows[i]).find('td:eq(6)').html(),
            nStudyProductBatchNo: $(MyRows[i]).find('td:eq(7)').html(),
            nKitTypeNo: $(MyRows[i]).find('td:eq(5)').html(),
            nTransactionNo: response,
            cExtraKit: "Y",
            vWorkSpaceID: setworkspaceid,
        }
        ExtraKitAttachFinal.push(ExtraKitAttach);
    };

    if (MyRows.length != 0) {
        $.ajax({
            url: BaseUrl + "PmsRecordSave/Save_StudyProductKitCreationDtl",
            type: 'POST',
            data: { '': ExtraKitAttachFinal },
            //data: KitCreateData,
            success: SuccessInsertData,
            async: false,
            error: function () {
                SuccessorErrorMessageAlertBox("Error To Save Data in Kit Type !", ModuleName);
            }
        });

        function SuccessInsertData(response) {
            $('#tblExtraKitAttach tbody').text('');
            $('#tblExtraKitAttach').hide();
            SuccessorErrorMessageAlertBox("Record Saved Successfully !", ModuleName);
            GetKitTypeDetail();
        }
    }
    else {
        SuccessorErrorMessageAlertBox("Record Saved Successfully !", ModuleName);
        GetKitTypeDetail();
    }
}

$("#tblExtraKitAttach").on('click', '#trRemove', function () {
    $(this).closest('tr').remove();

    if ($("#tblExtraKitAttach tbody tr").length != 0) {
        $("#tblExtraKitAttach").show();
    }
    else {
        $("#tblExtraKitAttach").hide();
    }
});


function format(d) {
    var stradata = "";
    // `d` is the original data object for the row
    var PostData = {
        WhereCondition_1: "vKitNo = '" + d[1] + "' and vWorkSpaceId = '" + setworkspaceid + "'"
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

function NoOfKitPopUp() {
    $("#txtNoOfKit").val('');
    $("#NoOfKitDetails").modal('show');
}

$("#btnSaveNoOfKit").on("click", function () {
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
    var TableData = HTMLtbl.getData($('#tblKitCreationTemp'));
    var KitCreateData = [];
    var QtyKit = $("#txtQtyKit").val();//0;
    var Qty = $("#txtNoOfKit").val();
    var counter = 0;
    var status = "";
    var Printproductname = "";
    var Printavailablestock = 0;

    $('.MasterLoaderExtra').show();
    //Check validation for stock
    for (var c = 0; c < TableData.length; c++) {
        if (status == "Y" || status == "") {
            var PostData = {
                vWorkSpaceId: setworkspaceid,
                nProductNo: TableData[c][9],
                nStudyProductBatchNo: TableData[c][10],
                nStorageLocationNo: 1, //80,
            }
            $.ajax({
                url: BaseUrl + "PmsRecordFetch/CheckAvailableStock",
                type: 'POST',
                data: PostData,
                async: false,
                success: function (response) {
                    var totalavailableqty = response;
                    var RequiredStock = parseInt(TableData[c][2]) * Qty;
                    if (totalavailableqty == 0) {
                        status = "N";
                        Printproductname = TableData[c][3];
                        Printavailablestock = totalavailableqty;
                    }
                    else if (RequiredStock > totalavailableqty) {
                        status = "N";
                        Printproductname = TableData[c][3];
                        Printavailablestock = totalavailableqty;
                    }
                    else {
                        status = "Y";
                    }
                },
                error: function () {
                    ValidationAlertBox("Error while check stock!", "btnSaveNoOfKit", ModuleName);
                }
            });
        }
        else {
            break;
        }
    }
    if (status != "") {
        if (status == "Y") {
            for (i = 0; i < TableData.length; i++) {
                if (counter == 0) {
                    KitCreateData.push({
                        vWorkSpaceId: TableData[i][7],
                        nKitTypeNo: TableData[i][8],
                        iDoseQty: TableData[i][2],
                        nProductNo: TableData[i][9],
                        nStudyProductBatchNo: TableData[i][10],
                        iNoOfKit: $("#txtNoOfKit").val(),
                        vStorageArea: TableData[i][11],
                        vRemark: TableData[i][6],
                        iModifyBy: $("#hdnuserid").val(),
                        nProductTypeID: nProductTypeID,
                        iKitNo: 1
                    });

                }
                else {
                    KitCreateData.push({
                        vWorkSpaceId: TableData[i][7],
                        nKitTypeNo: TableData[i][8],
                        iDoseQty: TableData[i][2],
                        nProductNo: TableData[i][9],
                        nStudyProductBatchNo: TableData[i][10],
                        iNoOfKit: $("#txtNoOfKit").val(),
                        vStorageArea: TableData[i][11],
                        vRemark: TableData[i][6],
                        iModifyBy: $("#hdnuserid").val(),
                        nProductTypeID: nProductTypeID,
                        iKitNo: 0
                    });
                }

                if (counter == (TableData.length - 1)) {
                    counter = 0
                }
                else {
                    counter++;
                }
                QtyKit = parseInt(TableData[i][2]) * $("#txtNoOfKit").val();
            }
            $.ajax({
                url: BaseUrl + "PmsRecordSave/Save_StudyProductKitCreationDtl",
                type: 'POST',
                data: { '': KitCreateData },
                success: SuccessInsertData,
                async: false,
                error: function () {
                    ValidationAlertBox("Error To Save Data in Kit Type !", "btnSaveNoOfKit", ModuleName);
                }
            });
            function SuccessInsertData(response) {
                ExtraKitAttachment(response);
            }
        } else if (status == "N") {
            ValidationAlertBox("Stock Not Available for " + Printproductname + ". Available stock is " + parseInt(Printavailablestock) + ".", "btnSaveNoOfKit", ModuleName);
        }
    }
    else {
        ValidationAlertBox("Error while check stock!", "btnSaveNoOfKit", ModuleName);
    }
    $('.MasterLoaderExtra').hide();
});

