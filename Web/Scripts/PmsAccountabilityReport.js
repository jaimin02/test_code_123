var productIds = new Object();
var setWorkspaceId = "";
var totalbalance = "";
var ProductName;
var BatchNo;
var ModuleName = "Accountability Report";

$(function () {
    CheckSetProject();
    if (setWorkspaceId != "") {
        BindData();
    }

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
                },
            });
        }
    });

    $("#ddlProjectNodashboard").on("blur", function () {
        BindData();
    });
});

var GetAllPmsQualityCheckProjectNo = function (Url, SuccessMethod, ProjectNoDataTemp) {
    $.ajax({
        url: Url,
        type: 'GET',
        //data: ProjectNoDataTemp,
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

}

function GetDashboardData() {

    var GetDashboardData = {
        vWorkSpaceId: setWorkspaceId,
        iUserID: $("#hdnuserid").val()
    }

    var GetPMSAccountabilityData = {
        Url: BaseUrl + "PmsGeneralReport/PostGetAccountabilityReport",
        SuccessMethod: "SuccessMethod",
        Data: GetDashboardData
    }
    $.ajax({
        url: GetPMSAccountabilityData.Url,
        type: 'POST',
        data: GetPMSAccountabilityData.Data,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Data not found.", ModuleName);
        }
    });

    function SuccessMethod(jsonData)
    {
        if (jsonData == null)
        {
            SuccessorErrorMessageAlertBox("Data not found", ModuleName);
            return false;
        }
        if (jsonData.length == 0) {
            $("#divexport").hide();
        }
        else {
            $("#divexport").show();
        }
        var srno;
        BatchNo = "";
        ProductName = "";
        var ActivityDataset = [];
        $("#divexport").css("visibility", "visible");
        for (var i = 0; i < jsonData.length; i++) {
            var InDataset = [];
            srno = i + 1;

            InDataset.push(srno, jsonData[i].vProjectNo, jsonData[i].dModifyOn,
                jsonData[i].vProductType, jsonData[i].vProductName, jsonData[i].vBatchLotNo,
                jsonData[i].TotalQty,  jsonData[i].RetentionQty,
                jsonData[i].VerificationQty,
                //jsonData[i].DispensedQty,
                jsonData[i].TransferedQty,
                jsonData[i].ReturnedQty, jsonData[i].UnUsedQty, jsonData[i].ArchivedQty, jsonData[i].DestroyedQty
                //jsonData[i].CurrentBalance, jsonData[i].TotalBalance
                );
            ActivityDataset.push(InDataset);
        }
        otable = $('#tblPmsAccountibilityData').dataTable({
            "bJQueryUI": true,
            "sPaginationType": "full_numbers",
            "bLengthChange": true,
            "iDisplayLength": 10,
            "bProcessing": true,
            "bSort": true,
            "autoWidth": true,
            "aaData": ActivityDataset,
            "bInfo": true,
            "bAutoWidth": false,
            "aaSorting": [],
            "bDestroy": true,
            //"sScrollY": "200px",
            "sScrollX": "100%",
            "sScrollXInner": "2200" /* It varies dynamically if number of columns increases */,
            "aoColumns": [
                { "sTitle": "Sr No" },
                { "sTitle": "Project No" },
                { "sTitle": "Date" },
                { "sTitle": "Product Type" },
                { "sTitle": "Product Name" },
                { "sTitle": "Batch/Lot/Lot No" },
                { "sTitle": "Receipt Qty" },
                //{ "sTitle": "Avalaible Qty" },
                { "sTitle": "Retention Qty" },
                { "sTitle": "Verification Qty" },
                //{ "sTitle": "Dispense Qty" },
                { "sTitle": "Transfer Qty" },
                { "sTitle": "Return Qty" },
                { "sTitle": "UnUsedIMP Qty" },
                { "sTitle": "Archive Qty" },
                { "sTitle": "Destroyed Qty" },
                //{ "sTitle": "Current Balance" },
                //{ "sTitle": "Total Balance" },
                
                
            ],
            "columnDefs": [
                { "width": "2%", "targets": 0 },
                { "width": "3%", "targets": 1 },
                { "width": "4%", "targets": 2 },
                { "width": "7%", "targets": 3 },
                { "width": "4%", "targets": 4 },
                { "width": "3%", "targets": 5 },
                { "width": "2%", "targets": 6 },
                { "width": "2%", "targets": 7 },
                { "width": "2%", "targets": 8 },
                { "width": "2%", "targets": 9 },
                { "width": "2%", "targets": 10 },
                { "width": "3%", "targets": 11 },
                { "width": "2%", "targets": 12 },
                { "width": "3%", "targets": 13 },
                //{ "width": "3%", "targets": 14 },
                //{ "width": "3%", "targets": 15 },
                //{ "width": "3%", "targets": 16 },
            ],
        });
    }

}

function BindData() {
    if (productIds[$('#ddlProjectNodashboard').val()] != undefined) {
        setWorkspaceId = productIds[$('#ddlProjectNodashboard').val()];
    }
    var projectid = setWorkspaceId;
    var url = WebUrl + "PmsStudyProduct/GetSessionDetail";

    if (projectid > 0) {
        GetDashboardData();
        GetExportToExcelDetails();
    }
    else {
        $("#divexport").css("visibility", "hidden");
        SuccessorErrorMessageAlertBox("Please select Project No.", ModuleName);
    }
}

function GetExportToExcelDetails() {
    if (productIds[$('#ddlProjectNodashboard').val()] != undefined) {
        setworkspaceid = productIds[$('#ddlProjectNodashboard').val()];
    }

    var Data_s = {
        vWorkSpaceId: setWorkspaceId,
        nBatchNo: "",
        dFromDate: "",
        dTodate: "",
        nProductNo: ""
    }

    //var url = WebUrl + "PmsStudyProductReceipt/GetExportToExcelDetails";
    var url = WebUrl + "PmsAccountability/GetSessionDetail";
    $.ajax({
        url: url,
        type: 'get',
        data: Data_s,

        success: function (data) {

        },
        error: function () {
            SuccessorErrorMessageAlertBox("Error in export to excel details.", ModuleName);
        }
    });
}
