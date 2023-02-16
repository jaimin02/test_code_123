var WorkSpaceIDs = new Object();
var viewmode;
var ModuleName = "Kit Report";

$(document).ready(function () {
    CheckSetProject();

    if (typeof (setworkspaceid) != 'undefined') {
        GetWeeklyPendingVisitWiseKitReport();
    }

});

$('#ddlProjectNo').on('change keyup paste mouseup', function () {
    if ($('#ddlProjectNo').val().length == 2)
    {
        var ProjectNoDataTemp = {
            vWorkSpaceID: $('#ddlProjectNo').val()
        }
        GetPmsProjectNoProductReceipt(ProjectNoDataTemp);
    }
    else if ($('#ddlProjectNo').val().length < 2) {
        $("#ddlProjectNo").autocomplete({
            source: "",
            change: function (event, ui) { }
        });
    }
});

var GetPmsProjectNoProductReceipt = function (ProjectNoDataTemp) {
    $.ajax({
        url: WebUrl + "PMSKitReport/ProjectNumber",
        type: 'POST',
        data: ProjectNoDataTemp,
        async: false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Project not found.", ModuleName);
        }
    });
    function SuccessMethod(jsonData) {
        var jsonObj = jQuery.parseJSON(jsonData);
        var sourceArr = [];
        for (var i = 0; i < jsonObj.length; i++) {
            sourceArr.push("[ " + jsonObj[i].vProjectNo + " ]" + " " + jsonObj[i].vRequestId);
            WorkSpaceIDs["[ " + jsonObj[i].vProjectNo + " ]" + " " + jsonObj[i].vRequestId] = jsonObj[i].vWorkspaceId;
        }
        $("#ddlProjectNo").autocomplete({
            source: sourceArr,
            change: function (event, ui) { }
        });
    }
}

$("#ddlProjectNo").on('blur', function () {
    GetWeeklyPendingVisitWiseKitReport();
});

function GetWeeklyPendingVisitWiseKitReport() {
    if (WorkSpaceIDs[$('#ddlProjectNo').val()] != undefined) {
        setworkspaceid = WorkSpaceIDs[$('#ddlProjectNo').val()];
    }
    if (setworkspaceid == "") {
        return false;
    }

    var ActivityDataset = [];
    var ProjectNoDataTemp = {
        vWorkSpaceID : setworkspaceid,
    }

    $.ajax({
        url: WebUrl + "PMSKitReport/Proc_WeeklyPendingVisitWiseKit",
        type: 'POST',
        data: ProjectNoDataTemp,
        async: false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Project not found.", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        if (jsonData == "")
        {
            $("#divexport").attr("style", "display:none");
            ActivityDataset = [];
        }
        else {
            GETWorkSpaceIDForExportData();
            $("#divexport").attr("style", "display:block");
            var jsonObj = jQuery.parseJSON(jsonData);
            for (var i = 0; i < jsonObj.length; i++)
            {
                var InDataset = [];
                InDataset.push(jsonObj[i].Site, jsonObj[i].KitType, jsonObj[i].StockQty, jsonObj[i].MinimumQuantity,
                               jsonObj[i].Week1, jsonObj[i].Week2, jsonObj[i].Week3, jsonObj[i].Week4);
                ActivityDataset.push(InDataset);
            }
        }

        otable = $('#tblPmsKitReportData').dataTable({
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
                { "sTitle": "Kit Type" },
                { "sTitle": "Stock Qty" },
                { "sTitle": "Minimum Quantity" },
                { "sTitle": "Week 1" },
                { "sTitle": "Week 2" },
                { "sTitle": "Week 3" },
                { "sTitle": "Week 4" },

            ],
            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },
        });
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
        dataType: "json",
        async: false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Project not found.", ModuleName);
        }
    });
    function SuccessMethod(jsonData) {
        if (jsonData.length > 0) {
            $('#ddlProjectNo').val(jsonData[0].vProjectNo);
            setworkspaceid = jsonData[0].vWorkSpaceId;
        }
        else {
            $('#ddlProjectNo').val('');
        }
    }
}

function GETWorkSpaceIDForExportData() {
    if (WorkSpaceIDs[$('#ddlProjectNo').val()] != undefined) {
        setworkspaceid = WorkSpaceIDs[$('#ddlProjectNo').val()];
    }

    
    var url = WebUrl + "PmsKitReport/GetWorkSpaceIDForExportData/" + setworkspaceid + "";
    $.ajax({
        url: url,
        type: 'GET',
        success: function (data)
        {},
        error: function ()
        {
            SuccessorErrorMessageAlertBox("Error in export to excel details.", ModuleName);
        }
    });
}