var workspaceIds = new Object();
var setWorkspaceId = "";
var ModuleName = "Product Label Creation"


$(document).ready(function () {

    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('.modal').modal('hide');

    CheckSetProjectGeneral("txtProjectNoDashboard");
    if (setWorkspaceId != undefined) {
        //GetProductType();
        //GetbarcodeKitBoxData();
    }

    GetAllParentPRoject();
    GetStudyProductLabelData();

    if ($("#hdnClientName").val() != "lambda") {
        $("#divTabletPerLabel").attr("style", "display:none")
        $("#txtNoofTablet").val("1");
        $("#txtNoofLabel").prop("disabled", true);

    }
});

$('#txtProjectNoDashboard').on('blur', function () {
    setWorkspaceId = workspaceIds[$('#txtProjectNoDashboard').val()];
    GetStudyProductLabelData();
});

var GetAllParentPRoject = function () {
    var ProjectNoDataTemp =
    {
        cParentChildIndi: "P"
    }
    $.ajax({
        url: BaseUrl + "PmsRecordFetch/AllParentProject",
        type: 'POST',
        data: ProjectNoDataTemp,
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("Project Not Found !", "txtProjectNoDashboard", ModuleName);
        }
    });
    function SuccessMethod(jsonData) {
        jsonData = jsonData.Table
        if (jsonData.length > 0) {
            var jsonObj = jsonData;
            var sourceArr = [];

            for (var i = 0; i < jsonObj.length; i++) {
                sourceArr.push("[ " + jsonObj[i].vProjectNo + " ]" + " " + jsonObj[i].vRequestId);
                workspaceIds["[ " + jsonObj[i].vProjectNo + " ]" + " " + jsonObj[i].vRequestId] = jsonObj[i].vWorkspaceId;
            }
            $("#txtProjectNoDashboard").autocomplete({
                source: sourceArr,
                change: function (event, ui) {
                },
                select: function (event, ui) {
                    $('#txtProjectNoDashboard').blur();
                }
            });
        }
    }
}

$('#btnAddProductlabel').on('click', function () {
    if (isBlank(document.getElementById('txtProjectNoDashboard').value)) {
        ValidationAlertBox("Please Enter Project No !", "txtProjectNoDashboard", ModuleName);
        return false;
    }

    if (StudySetupCount() == false) {
        ValidationAlertBox("Without define Study Setup, You Can Not Create Label !")
        return false;
    }


    $("#titleMode").text('Mode:-Add');
    $("#txtProjectNo").val($("#txtProjectNoDashboard").val());
    GetProductType();
    $("#tblPMSProductLabelTemp thead").hide();
    $("#tblPMSProductLabelTemp tbody tr").remove();
    $("#btnSavePMSProductLabel").hide();
});

function GetProductType() {
    if (workspaceIds[$('#txtProjectNoDashboard').val()] != undefined) {
        setWorkspaceId = workspaceIds[$('#txtProjectNoDashboard').val()];
    }

    var GetProductType = {
        Url: BaseUrl + "PmsGeneral/GetProductType/" + setWorkspaceId,
        SuccessMethod: "SuccessMethod"
    }

    $.ajax({
        url: GetProductType.Url,
        type: 'GET',
        async: false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Product Type Not Found !", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        $("#ddlProductType").empty().append('<option selected="selected" value="0">Please Select Product Type</option>');
        for (var i = 0; i < jsonData.length; i++) {
            $("#ddlProductType").append($("<option></option>").val(jsonData[i].nProductTypeID).html(jsonData[i].vProductType));
        }
    }
}

$('#ddlProductType').on('change', function () {
    var GetProductNameData = {
        vWorkSpaceId: setWorkspaceId,
        nProductTypeID: $("#ddlProductType").val(),
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
        if (jsonData.length > 0) {
            $("#ddlProductName").empty().append('<option selected="selected" value="0">Please Select Product Name</option>');
            for (var i = 0; i < jsonData.length; i++)
                $("#ddlProductName").append($("<option></option>").val(jsonData[i].nProductNo).html(jsonData[i].vProductName));
        }
        else {
            $("#ddlProductName").empty().append('<option selected="selected" value="0">Please Select Product Name</option>');
        }
    }
});

$('#ddlProductName').on('change', function () {
    var GetPmsStudyReceiptBatchLotNo = {
        Url: BaseUrl + "PmsStudyProductReceipt/GetBatchLotNo",
        SuccessMethod: "SuccessMethod"
    }
    $.ajax({
        url: GetPmsStudyReceiptBatchLotNo.Url,
        type: 'GET',
        async: false,
        success: SuccessMethod,
        data: { id: setWorkspaceId, projectno: $("#ddlProductName").val() },
        error: function () {
            ValidationAlertBox("Batch/Lot Not Found !", "Product", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        if (jsonData.length > 0) {
            $("#ddlBatchLotNo").empty().append('<option selected="selected" value="0">Please Select Batch/Lot No</option>');
            for (var i = 0; i < jsonData.length; i++)
                $("#ddlBatchLotNo").append($("<option></option>").val(jsonData[i].nStudyProductBatchNo).html(jsonData[i].vBatchLotNo));
        }
        else {
            $("#ddlBatchLotNo").empty().append('<option selected="selected" value="0">Please Select Batch/Lot No</option>');
        }
    }
});

function CheckQty() {
    var MyRowsData = $('table#tblPMSProductLabelTemp').find('tbody').find('tr');
    var ProductLabelQty = 0;
    for (var i = 0; i < MyRowsData.length; i++) {
        var ProductType = $(MyRowsData[i]).find('td:eq(5)').html()
        if (ProductType == $("#ddlProductType").val()) {
            var TotalQty = parseInt($(MyRowsData[i]).find('td:eq(3)').html()) * parseInt($(MyRowsData[i]).find('td:eq(4)').html())
            ProductLabelQty += TotalQty;
        }
    }

    var CurrentQty = parseInt($("#txtNoofTablet").val() * parseInt($("#txtNoofLabel").val()));
    ProductLabelQty += CurrentQty;

    var status = false;
    var QualityCheckData = {
        vWorkSpaceId: setWorkspaceId,
        vProductNo: $("#ddlProductName :selected").val(),
        nStudyProductBatchNo: $("#ddlBatchLotNo :selected").val(),
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
        if (parseInt(response) < parseInt(ProductLabelQty)) {
            ValidationAlertBox("Current Stock Is " + response + " !", "txtNoofTablet", ModuleName);
            status = false;
        }
        else {
            status = true;
        }
    }
    return status;
}

function fnAddTempProductLabel() {
    var tempdata = "";
    if (Validateform()) {
        tempdata += "<tr>";
        tempdata += "<td>" + $('#ddlProductType :selected').text() + "</td>";
        tempdata += "<td>" + $('#ddlProductName :selected').text() + "</td>";
        tempdata += "<td>" + $('#ddlBatchLotNo :selected').text() + "</td>";
        tempdata += "<td>" + $('#txtNoofTablet').val() + "</td>";
        tempdata += "<td>" + $('#txtNoofLabel').val() + "</td>";
        tempdata += "<td class='hidetd'>" + $('#ddlProductType').val() + "</td>";
        tempdata += "<td class='hidetd'>" + $('#ddlProductName').val() + "</td>";
        tempdata += "<td class='hidetd'>" + $('#ddlBatchLotNo').val() + "</td>";
        tempdata += "<td id='trRemove'><span class='glyphicon glyphicon-remove'></span></td>";
        tempdata += "</tr>";
        $("#tbodyPMSPRoductLabelTemp").append(tempdata);
        $("#tblPMSProductLabelTemp thead").show();
        $("#tblPMSProductLabelTemp").show();
        $(".hidetd").attr("style", "display:none");
        $("#btnSavePMSProductLabel").attr("style", "display:Inline");
        ClearData();
    }   
}

$("#tblPMSProductLabelTemp").on('click', '#trRemove', function () {
    $(this).closest('tr').remove();

    if ($("#tblPMSProductLabelTemp tbody tr").length != 0) {
        $("#tblPMSProductLabelTemp").attr("style", "display:inline")
        $("#btnSavePMSProductLabel").attr("style", "display:none");
    }
    else {
        $("#tblPMSProductLabelTemp").attr("style", "display:none")
        $("#btnSavePMSProductLabel").attr("style", "display:none");
    }
});

function ClearData() {
    $("#ddlProductType").val(0);
    $("#ddlProductName").val(0);
    $("#ddlBatchLotNo").val(0);
    $("#txtNoofTablet").val("");
    $("#txtNoofLabel").val("");
}

$('#btnClearPMSProductLabel').on('click', function () {
    $("#tblPMSProductLabelTemp tbody tr").remove();
    $("#tblPMSProductLabelTemp thead").hide();
    ClearData();
});

$('#btnSavePMSProductLabel').on('click', function () {
    
    var ProductLabelDataDetail = [];
    var vProjectNo = $("#txtProjectNoDashboard").val().split("]")[0].split("[")[1].trim().split(" ")[1].replace("-", "");

    if (vProjectNo.length == 5) {
        vProjectNo = "0" + vProjectNo;
    }

    var MyRows = $('table#tblPMSProductLabelTemp').find('tbody').find('tr');

    for (var i = 0; i < MyRows.length; i++) {
        var ProductLabelData = {};
        ProductLabelData = {
            vWorkSpaceID: setWorkspaceId,
            nProductTypeID: $(MyRows[i]).find('td:eq(5)').html(),
            nProductNo: $(MyRows[i]).find('td:eq(6)').html(),
            nStudyProductBatchNo: $(MyRows[i]).find('td:eq(7)').html(),
            iNoofTablet: $(MyRows[i]).find('td:eq(3)').html(),
            iNoofLabel: $(MyRows[i]).find('td:eq(4)').html(),
            iModifyBy: $("#hdnuserid").val(),
            cStatusIndi: "N",
            DATAOPMODE: "1",
            vProjectNo: vProjectNo,
            iTotalQty: parseInt($(MyRows[i]).find('td:eq(3)').html()) * parseInt($(MyRows[i]).find('td:eq(4)').html()),
        }
        ProductLabelDataDetail.push(ProductLabelData)
    }
    

    $.ajax({
        url: BaseUrl + "PmsRecordSave/Save_StudyProductLabelCreationDtl",
        type: 'POST',
        data: { '': ProductLabelDataDetail },
        success: function (jsonData) {
            SuccessorErrorMessageAlertBox("Data Saved Successfully !", ModuleName);
            ClearData();
            GetStudyProductLabelData();
            $("#tblPMSProductLabelTemp tbody tr").remove();
            $("#tblPMSProductLabelTemp thead").hide();
        },
        async: false,
        error: function () {
            SuccessorErrorMessageAlertBox("There is not Data Save For Product Label Creation !", ModuleName);
        }
    });
});

function Validateform() {
    if (Dropdown_Validation(document.getElementById("ddlProductType"))) {
        ValidationAlertBox("Please Select Product Type !", "ddlProductType", ModuleName);
        return false;
    }

    if (Dropdown_Validation(document.getElementById("ddlProductName"))) {
        ValidationAlertBox("Please Select Product Name !", "ddlProductName", ModuleName);
        return false;
    }

    if (Dropdown_Validation(document.getElementById("ddlBatchLotNo"))) {
        ValidationAlertBox("Please Select Batch/Lot No !", "ddlBatchLotNo", ModuleName);
        return false;
    }

    if (isBlank(document.getElementById('txtNoofTablet').value)) {
        ValidationAlertBox("Please Enter Number of Tablet Per Label !", "txtNoofTablet", ModuleName);
        return false;
    }

    if (isBlank(document.getElementById('txtNoofLabel').value)) {
        ValidationAlertBox("Please Enter No of Label !", "txtNoofLabel", ModuleName);
        return false;
    }

    if (CheckQty() == false) {
        return false;
    }
    return true;
}

function GetStudyProductLabelData() {
    var SiteWiseView = "";
    var TotalLabel = "";
    var WhereData = {
        vWorkSpaceId: setWorkspaceId,
    }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/Proc_StudyProductLabelStockHoAndSite",
        type: 'POST',
        data: WhereData,
        success: function (jsonData) {            
            var ActivityDataset = [];
            for (var i = 0; i < jsonData.length; i++) {
                var InDataset = [];


                SiteWiseView = "<a data-toggle='modal' data-tooltip='tooltip' title='Site Wise View' data-target='#ModalLabelSiteWiseData' Onclick=fnGetStudyProductLabelSiteDetail(this); nProductNo='"
                                + jsonData[i].nProductNo + "' nProductTypeID ='" + jsonData[i].nProductTypeID
                               + "' style='cursor:pointer;'><i class='btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a'><i class='fa fa-search'></i><span>Site Wise</span></a>";

                TotalLabel = "<a data-toggle='modal' data-tooltip='tooltip' title='Site Wise View' data-target='#ModalLabelCreationData' Onclick= fnGetStudyProductLabelCreationDetail(this); nProductNo='"
                                + jsonData[i].nProductNo + "' nStudyProductBatchNo='" + jsonData[i].nStudyProductBatchNo + "' nProductTypeID = '"+ jsonData[i].nProductTypeID 
                                +"' style='cursor:pointer;'><i class='btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a'><i class='fa fa-search'></i><span>View</span></a>";

                InDataset.push(jsonData[i].vProductType, jsonData[i].vProductName, jsonData[i].vBatchLotNo,
                               jsonData[i].StockAtHO, jsonData[i].StockAtSite, SiteWiseView, TotalLabel);
                ActivityDataset.push(InDataset);
            }

            var otableProjectWiseAuditTrail = $('#tblPMSStudyProductLabelData').dataTable({
                "bJQueryUI": true,
                "sPaginationType": "full_numbers",
                "bLengthChange": true,
                "iDisplayLength": 10,
                "bProcessing": true,
                "bSort": true,
                "aaData": ActivityDataset,
                "aaSorting": [],
                "bInfo": true,
                "bAutoWidth": false,
                "bDestroy": true,
                "aoColumns": [
                   { "sTitle": "Product Type" },
                   { "sTitle": "Product Name" },
                   { "sTitle": "Batch/Lot No" },
                   { "sTitle": "Stock At HO" },
                   { "sTitle": "Stock At Site" },
                   { "sTitle": "Site Wise Stock" },
                   { "sTitle": "View" },

                ],
                "columnDefs": [
                    {
                        //"targets": [3],
                        //"visible": false,
                    },
                ],
                "oLanguage": {
                    "sEmptyTable": "No Record Found",
                },
            });
        },
        async: false,
        error: function () {
            SuccessorErrorMessageAlertBox("Barcode Kit Box Not Found !", ModuleName);
        }
    });

}

function fnGetStudyProductLabelCreationDetail(e) {
    var nProductTypeID = e.attributes['nproducttypeid'].value;
    var nProductNo = e.attributes['nproductno'].value;
    var nStudyProductBatchNo = e.attributes['nstudyproductbatchno'].value;

    var PostData = {
        WhereCondition_1: "nProductNo = '" + nProductNo + "' and nProductTypeID = '" + nProductTypeID + "' and nStudyProductBatchNo = '"
                           + nStudyProductBatchNo + "' and vWorkSpaceID = '" + setWorkspaceId + "' and cStatusIndi <> 'D'"
    }
    $.ajax({
        url: BaseUrl + "PmsRecordFetch/View_StudyProductLabelCreationDtl",
        type: 'POST',
        data: PostData,
        success: function (jsonData) {
            jsonData = jsonData.Table;
            var ActivityDataset = [];
            for (var i = 0; i < jsonData.length; i++) {
                var InDataset = [];
                InDataset.push(jsonData[i].vStudyProductLabelNo, jsonData[i].iNoofTablet, jsonData[i].iModifyBy,
                               jsonData[i].dModifyOn);
                ActivityDataset.push(InDataset);
            }

            otableKitCreationDetails = $('#tblPMSStudyProductLabelCreationData').dataTable({
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
                     { "sTitle": "Label No" },
                     { "sTitle": "No of Tablet Per Label" },
                     { "sTitle": "Generated By" },
                     { "sTitle": "Generated On" },
                ],
                "oLanguage": {
                    "sEmptyTable": "No Record Found",
                },
            });

        },
        error: function () {
            SuccessorErrorMessageAlertBox("Kit Type Data Is Not Found !", ModuleName);
        }
    });
}

function fnGetStudyProductLabelSiteDetail(e) {
    var nProductTypeID = e.attributes['nproducttypeid'].value;

    var PostData = {
        vWorkSpaceID    :setWorkspaceId,
        cTransferIndi   :"L",
        nProductTypeID  :nProductTypeID
    }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/Proc_GetSiteWiseQtyForKit",
        type: 'POST',
        data: PostData,
        success: function (jsonData) {
            var ActivityDataset = [];
            var jsonData = jsonData.StockAtSite;
            for (var i = 0; i < jsonData.length; i++) {
                var InDataset = [];
                InDataset.push(jsonData[i].vProjectNo,jsonData[i].iSalableClStockQty);
                ActivityDataset.push(InDataset);
            }
            otable = $('#tblPMSStudyProductLabelSiteWiseData').dataTable({
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
                     { "sTitle": "No Of Label" },
                ],
                "oLanguage": {
                    "sEmptyTable": "No Record Found",
                },
            });
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Site Wise Label Data Not Found !", ModuleName);
        }
    });
}

function ExitModule() {
    ConfirmAlertBox(ModuleName);
}

$('#ddlBatchLotNo').on('change', function () {
    var PostData = {
        WhereCondition_1: "vWorkSpaceId = '" + setWorkspaceId + "' and nProductNo = '" + $("#ddlProductName").val() + "' and nStudyProductBatchNo = '" + $("#ddlBatchLotNo").val() + "'"
    }
    if ($("#ddlBatchLotNo").val() != 0) {
        $.ajax({
            url: BaseUrl + "PmsRecordFetch/ExpiryDateofProduct",
            type: 'POST',
            data: PostData,
            success: function (JsonExpDate) {
                if (JsonExpDate.Table.length != 0) {
                    var expdate = new Date(Date.parse(JsonExpDate.Table[0].dExpDate));
                    var TodayDate = new Date();

                    if (expdate < TodayDate) {
                        var monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
                        var date = new Date(expdate)
                        date.setDate(date.getDate())
                        date = date.getDate() + "-" + monthNames[date.getMonth()] + "-" + date.getFullYear();
                        ValidationAlertBox("" + $("#ddlProductName :selected").text() + " is Expired on " + date + ", So You Can Not Create Label for This Product !", "ddlBatchLotNo", ModuleName);
                        $("#ddlBatchLotNo").val(0);
                        return false;
                    }
                    else {
                        if ($("#hdnClientName").val() != "lambda") {
                            GetQuantity();
                        }
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

function GetQuantity() {
    var status = false;
    var QualityCheckData = {
        vWorkSpaceId: setWorkspaceId,
        vProductNo: $("#ddlProductName :selected").val(),
        nStudyProductBatchNo: $("#ddlBatchLotNo :selected").val(),
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
        $("#txtNoofLabel").val(parseInt(response))
    }
    return status;
}

function StudySetupCount() {
    var result = true;
    var PostData = {
        vWorkSpaceID: setWorkspaceId,
    }

    if (setWorkspaceId != "") {
        $.ajax({
            url: BaseUrl + "PmsRecordFetch/Proc_GetStudyProductDesignMst",
            type: 'POST',
            data: PostData,
            async: false,
            success: function (jsonData) {
                if (jsonData.length == 0) {
                    result = false;
                }
            }
        });
    }
    return result;
}