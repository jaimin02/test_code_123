var workspaceIds = new Object();
var ModuleName = "Patient Randomization";

$(document).ready(function () {
    CheckSetProjectGeneral("txtProjectNodashboard");
    if (setWorkspaceId != undefined) {
        if (setWorkspaceId != "" ) {
            GetPatientRandomizationData();
        }
    }
});

$('#txtProjectNodashboard').on('change keyup paste mouseup', function () {
    var GetPmsProductBatchProjectNo = {
        Url: BaseUrl + "PmsProductBatch/GetProjectNo",
        SuccessMethod: "SuccessMethod"
    }

    if ($('#txtProjectNodashboard').val().length == 2) {
        var ProjectNoDataTemp = {
            vProjectNo: $('#txtProjectNodashboard').val(),
            iUserId: $("#hdnuserid").val(),
            vProjectTypeCode: $("#hdnscopevalues").val(),
        }
        GetAllPmsProductbatchProjectNo(GetPmsProductBatchProjectNo.Url, GetPmsProductBatchProjectNo.SuccessMethod, ProjectNoDataTemp);

    }
    else if ($('#txtProjectNodashboard').val().length < 2) {
        $("#txtProjectNodashboard").autocomplete({
            source: "",
            change: function (event, ui) { }
        });
    }
});

var GetAllPmsProductbatchProjectNo = function (Url, SuccessMethod, ProjectNoDataTemp) {

    $.ajax({
        url: Url,
        type: 'GET',
        data: { id: ProjectNoDataTemp.iUserId, projectno: ProjectNoDataTemp.vProjectNo, typecode: ProjectNoDataTemp.vProjectTypeCode },
        async: false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("No Project Bound !", ModuleName);
        }
    });
    function SuccessMethod(jsonData){
        var jsonObj = jsonData;
        var sourceArr = [];

        for (var i = 0; i < jsonObj.length; i++){
            sourceArr.push("[ " + jsonObj[i].vProjectNo + " ]" + " " + jsonObj[i].vRequestId);
            workspaceIds["[ " + jsonObj[i].vProjectNo + " ]" + " " + jsonObj[i].vRequestId] = jsonObj[i].vWorkspaceId;
        }

        $("#txtProjectNodashboard").autocomplete({
            source: sourceArr,
            change: function (event, ui){ }
        });
    }
}

$('#txtProjectNodashboard').on('blur', function (){
    if (workspaceIds[$('#txtProjectNodashboard').val()] != undefined){
        setWorkspaceId = workspaceIds[$('#txtProjectNodashboard').val()];
        GetPatientRandomizationData();
    }
});

function GetPatientRandomizationData(){
    var wStr = "vWorkspaceId = " + setWorkspaceId + " and cStatusIndi <> 'D'"
    var WhereData = {
        WhereCondition_1: wStr,
    }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/View_PatientRandomization",
        type: 'POST',
        data: WhereData,
        async: false,
        success: SuccessResult,
        error: function () {
            alert("No Data Found for Patient Randomization !");
        }
    });

    function SuccessResult(jsonData) {
        var JsonObj = jsonData.Table;
        var status_c;
        var ActivityDataset = [];

        if (JsonObj.length == 0) {
            $("#ExportButton").attr("style", "display:none");
        }
        else {
            $("#ExportButton").attr("style", "display:inline");
        }

        for (var i = 0; i < JsonObj.length; i++) {
            var InDataset = [];

            if (JsonObj[i].vRandomizationNo == "") {
                status_c = '<span class="fa fa-user" style="margin-left: 40%;"></span>';
            }
            else {
                status_c = '<span class="fa fa-check-circle" style="margin-left: 40%;"></span>';
            }

            InDataset.push(JsonObj[i].vProjectNo, JsonObj[i].vMySubjectNo, status_c, JsonObj[i].vRandomizationNo, JsonObj[i].vModifyBy, JsonObj[i].dModifyOn);
            ActivityDataset.push(InDataset);
        }
        GetWorKSpaceID();

        var otableProjectWiseAuditTrail = $('#tblPmsPatientRandomization').dataTable({
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
               { "sTitle": "Project" },
               { "sTitle": "Subject No" },
               { "sTitle": "Status" },
               { "sTitle": "Randomization No" },
               { "sTitle": "Performed By" },
               { "sTitle": "Performed Date" },

            ],
            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },
        });
    }
}



function GetWorKSpaceID() {

    var url = WebUrl + "PmsPatientRandomization/GetWorkspaceId";
    $.ajax({
        url: url,
        type: 'get',
        data: { id: setWorkspaceId },
        async: false,
        success: function (response) {
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Project Not Found !", ModuleName);

        }
    });
}