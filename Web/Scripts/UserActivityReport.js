var ModuleName = "UserActivityLog";
$(function () {
    $('#dFromDate').datetimepicker({ format: 'DD-MMMM-YYYY', });
    $('#dToDate').datetimepicker({ format: 'DD-MMMM-YYYY', maxDate: new Date() });
    var dt = new Date();
    jQuery('#dFromDate').data("DateTimePicker").maxDate(dt);

    //$('#ddlUserMst').multiselect({
    //    nonSelectedText: '--Select--',
    //    buttonClass: 'form-control',
    //    enableFiltering: true,
    //    enableCaseInsensitiveFiltering: true,
    //    numberDisplayed: 1,
    //});
});

$("#btnGo").on("click", function () {
    if ($("#ddlUserActivity option:selected").val() == '0') {
        //alert("Please select report type.", ModuleName);
        ValidationAlertBox("Please select report type.", "", ModuleName);
        return false;
    }
    else if ($("#ddlUserActivity option:selected").val() == "1") {
        GetUserMst();
        $("#spnactivity").text('User *');
        $("#dvActivity").attr("style", "display:inline");
        $("#ddlUserActivity").attr('disabled', 'disabled');
    }
    else if ($("#ddlUserActivity option:selected").val() == "2") {
        GetSiteMst();
        $("#spnactivity").text('Site *');
        $("#dvActivity").attr("style", "display:inline");
        $("#ddlUserActivity").attr('disabled', 'disabled');
    }
   
});
function GetSiteMst(){
    jsonData = "";
    var ExecuteDataSetData = {
        Table_Name_1: "View_SiteMst",
        WhereCondition_1: "cStatusIndi <> 'C' and vStudyCode IS NOT NULL",
        DataRetrieval_1: 3,
    }
    GetJsonData(ExecuteDataSetData);
    $("#ddlUserMst").empty();
    $("#ddlUserMst").append($("<option></option>").val(0).html('Please Select Site'));
    for (var i = 0; i < jsonData.length; i++) {
        $("#ddlUserMst").append($("<option></option>").val(jsonData[i].nSiteNo).html(jsonData[i].vStudyCode));
        //$('#ddlUserMst').multiselect('rebuild');
    }
}

function GetUserMst() {
    jsonData = "";
    var ExecuteDataSetData = {
        Table_Name_1: "View_UserMst",
        WhereCondition_1: "cStatusIndi <> 'C'",
        DataRetrieval_1: 3,
    }
    GetJsonData(ExecuteDataSetData);
    $("#ddlUserMst").empty();
    $("#ddlUserMst").append($("<option></option>").val(0).html('Please Select User'));
    for (var i = 0; i < jsonData.length; i++) {
        $("#ddlUserMst").append($("<option></option>").val(jsonData[i].iUserId).html('[' + jsonData[i].vLoginName + '] [' + jsonData[i].vUserTypeName + ']'));
        //$('#ddlUserMst').multiselect('rebuild');
    }
}

$("#btnUserActivity").on("click", function () {
    if ($("#ddlUserMst option:selected").val() == '0' && $("#ddlUserMst option:selected").text() == 'Please Select User') {
        ValidationAlertBox("Please select user.", "ddlUserMst", ModuleName);
        return false;
    }
    else if ($("#ddlUserMst option:selected").val() == '0' && $("#ddlUserMst option:selected").text() == 'Please Select Site') {
        ValidationAlertBox("Please select site.", "ddlUserMst", ModuleName);
        return false;
    }
    else if ($("#dFromDate").val() == "") {
        ValidationAlertBox("Please select fromdate.", "dFromDate", ModuleName);
        return false;
    }
    else if ($("#dToDate").val() == "") {
        ValidationAlertBox("Please select todate.", "dToDate", ModuleName);
        return false;
    }
   
    var vMode;
    if ($("#ddlUserActivity option:selected").val() == "1") {
        var Data = {
            vMode: "UserWise",
            iUserId: $("#ddlUserMst option:selected").val().toString(),
            nStudyNo: 0,
            dFromDate: document.getElementById("dFromDate").value.toString(),
            dToDate: document.getElementById("dToDate").value.toString()
        }
    }
    else if ($("#ddlUserActivity option:selected").val() == "2") {
        var Data = {
            vMode: "StudyWise",
            iUserId: 0,
            nStudyNo: $("#ddlUserMst option:selected").val().toString(),
            dFromDate: document.getElementById("dFromDate").value.toString(),
            dToDate: document.getElementById("dToDate").value.toString()
        }
    }
    GetUserActivityLogReport(BaseUrl + "UserActivityLogReport/ObtainUserActivity", "SuccessMethod", Data);
});

var GetUserActivityLogReport = function (Url, SuccessMethod, Data) {
    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        async: false,
        success: SuccessMethod,
        dataType: 'json',
        error: function () {
            SuccessorErrorMessageAlertBox("Error while Get details of Attached User.", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        var strdata = "";
        var ActivityDataset = [];
        if (jsonData != null) {
            for (var i = 0; i < jsonData.length; i++) {
                var InDataset = [];
                InDataset.push(jsonData[i].vUserName,
                              (jsonData[i].vStudyCode == null ? "" : jsonData[i].vStudyCode),
                              jsonData[i].vStudyName,
                              jsonData[i].dChangeDate,
                              jsonData[i].vAuditRemark);
                ActivityDataset.push(InDataset);

            }
        }
        
        otableAuditTrail = $('#tblActivityLogMaster').dataTable({
            "bJQueryUI": true,
            "sPaginationType": "full_numbers",
            "bLengthChange": true,
            "iDisplayLength": 10,
            "bProcessing": true,
            "bSort": false,
            "autoWidth": true,
            "aaData": ActivityDataset,
            "bInfo": true,
            "bDestroy": true,
            "aoColumns": [
                         { "sTitle": "User Name" },
                         { "sTitle": "Study Code" },
                         { "sTitle": "Study Name" },
                         { "sTitle": "Change Date" },
                         { "sTitle": "Audit Remark" }
            ],
            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },
        });
    }

}
$("#btnExitUserActivity").on("click", function () {
    ConfirmAlertBox(ModuleName, $("#RedirectToHome").val());
});

//function ExporttoExcel() {
//    if ($("#ddlUserMst option:selected").val() == '0' && $("#ddlUserMst option:selected").text() == 'Please Select User') {
//        ValidationAlertBox("Please select user.", "ddlUserMst", ModuleName);
//        return false;
//    }
//    else if ($("#ddlUserMst option:selected").val() == '0' && $("#ddlUserMst option:selected").text() == 'Please Select Site') {
//        ValidationAlertBox("Please select site.", "ddlUserMst", ModuleName);
//        return false;
//    }
//    else if ($("#dFromDate").val() == "") {
//        ValidationAlertBox("Please select fromdate.", "dFromDate", ModuleName);
//        return false;
//    }
//    else if ($("#dToDate").val() == "") {
//        ValidationAlertBox("Please select todate.", "dToDate", ModuleName);
//        return false;
//    }
//    if ($("#ddlUserActivity option:selected").val() == "1") {
//        vMode = "UserWise";
//        iUserId = $("#ddlUserMst option:selected").val().toString();
//        nStudyNo = 0;
//    }
//    else if ($("#ddlUserActivity option:selected").val() == "2") {
//        vMode = "StudyWise";
//        iUserId = 0;
//        nStudyNo = $("#ddlUserMst option:selected").val().toString();
//    }
//    dFromDate = document.getElementById("dFromDate").value.toString();
//    dToDate = document.getElementById("dToDate").value.toString();
//    var nClientNo = $("#ddlClientIndex").val();
//    window.location.href = (WebUrl + "/UserActivityLogReport/ExportToExcel/0?vMode=" + vMode + "&iUserId=" + iUserId + "&nStudyNo=" + nStudyNo + "&dFromDate=" + dFromDate + "&dToDate=" + dToDate);

//}