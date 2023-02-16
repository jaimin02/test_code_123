var workspaceIds = new Object();
var ModuleName = "Study Setup";


$(document).ready(function () {
    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('.modal').modal('hide');

    CheckSetProjectGeneral("txtProjectNoDashboard");
    if (setWorkspaceId != undefined) {
        GetProductType();
        GetStudyProductDesignData();
    }
});

function AddStudySetUp() {
    var wStr = "vWorkspaceId = " + setWorkspaceId + ""
    var WhereData = {
        WhereCondition_1: wStr,
    }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/View_StudyProductDesignMst",
        type: 'POST',
        data: WhereData,
        async: false,
        success: SuccessResult,
        error: function () {
            alert("No Data Found for Study Product Setup !");
        }
    });

    function SuccessResult(jsonData) {
        jsonData = jsonData.Table;
        ClearData();
        $("#ddlApplyBalanceOn").val("0");
        //if (jsonData.length > 0)
        //{
        //if (jsonData[0].cRandomizationType != "-") {
        //    ValidationAlertBox("You Already Done Study Setup !", "txtProjectNoDashboard", ModuleName);
        //    return false;
        //}

        //var RandomizationRatio = "";
        //var Treatmenttypemapping = "";
        //for (i = 0; i < jsonData.length; i++) {
        //    if (i == jsonData.length - 1) {
        //        RandomizationRatio += jsonData[i].vRandomizationRatio;
        //        Treatmenttypemapping += jsonData[i].vFormulationType;
        //    }
        //    else {
        //        RandomizationRatio += jsonData[i].vRandomizationRatio + ":";
        //        Treatmenttypemapping += jsonData[i].vFormulationType + ":";
        //    }
        //}

        if (jsonData[0] != undefined) {
            $("#ddlApplyBalanceOn").prop('disabled', 'disabled');

            $("#ddlApplyBalanceOn").val(jsonData[0].cApplyBalanceOn.charAt(0));
            // $("#txtRandomizationRatio").val(RandomizationRatio);
            $("#hdnFormulationType").val(Treatmenttypemapping);
        }


        jQuery("#titleMode").text('Mode:-Add');
        $("#txtProjectNo").val($("#txtProjectNoDashboard").val());
        if (isBlank(document.getElementById('txtProjectNoDashboard').value)) {
            ValidationAlertBox("Please Enter Project No !", "txtProjectNoDashboard", ModuleName);
            return false;
        }
        PrincipalInvestigator();

        ViewMyProject();
        $("#ddlDoseType").val("0");
        $("#tblStudySetUpTemp thead").hide();
        $("#tblStudySetUpTemp tbody tr").remove();
        $("#btnSavePmsStudySetUp").hide();
        $("#tblProductTypeRandomizationRatio thead").hide();
        $("#tblProductTypeRandomizationRatio tbody tr").remove();
        $("#btnSaveRandomization").hide();
        $("#txtRandomizationRatio").removeAttr("title");

        if ($("#ddlPMName").val() == null) {
            $("#ddlPMName").val(0);
            $("#ddlPMName").prop('disabled', '');
        }
        // }
        $('#StudySetUpModel').modal('show');
        //else {
        //    ValidationAlertBox("First Upload Randomization File,Then Define Study Setup. !", "txtProjectNoDashboard", ModuleName);
        //    return false;
        //}

    }
}

function AddTempData() {
    if (validateform() != false) {
        $("#btnSavePmsStudySetUp").show();
        $("#tblStudySetUpTemp thead").show();
        $("#tblStudySetUpTemp").show();

        var $Remove = '<span class="glyphicon glyphicon-remove" id="trRemove" title="Remove"></span>';
        var RandomizationRatio = $("#txtRandomizationRatio").val();
        RandomizationRatio = RandomizationRatio.split(":");

        var strdata = "";
        for (i = 0; i < RandomizationRatio.length; i++) {
            if (CheckRecordExist(RandomizationRatio[i]) != false) {
                strdata += "<tr>";
                strdata += "<td align='center'>" + $("#txtProjectNo").val() + "</td>";
                strdata += "<td align='center'>" + RandomizationRatio[i] + "</td>";
                strdata += "<td align='center'>" + $("#ddlApplyBalanceOn :selected").text() + "</td>";
                strdata += "<td align='center'>" + $("#txtProjectType").val() + "</td>";
                strdata += "<td align='center'>" + $("#txtSubmission").val() + "</td>";
                strdata += "<td align='center'>" + $("#txtDrugName").val() + "</td>";
                strdata += "<td align='center'>" + $("#txtExpiryDays").val() + "</td>";
                strdata += "<td align='center'>" + $("#ddlDoseType :selected").text() + "</td>";
                strdata += "<td align='center'>" + $("#ddlRandomizationType :selected").text() + "</td>";
                strdata += "<td align='center'>" + $("#ddlPMName :selected").text() + "</td>";
                strdata += "<td align='center'>" + $("#txtInstruction").val() + "</td>";
                strdata += "<td align='center'>" + $("#txtRouteAdmin").val() + "</td>";
                strdata += "<td align='center'>" + $("#txtRemarks").val() + "</td>";
                //strdata += "<td id='trRemove' align='center'><span class='glyphicon glyphicon-remove' title='Remove'></span></td>";
                strdata += "<td class='hidetd'>" + $("#ddlApplyBalanceOn").val() + "</td>";
                strdata += "<td class='hidetd'>" + $("#ddlDoseType").val() + "</td>";
                strdata += "<td class='hidetd'>" + $("#hdnDrugCode").val() + "</td>";
                strdata += "<td class='hidetd'>" + $("#ddlPMName").val() + "</td>";
                strdata += "</tr>";
            }
        }

        $("#tbodyStudySetUpTemp").append(strdata);
        $("#tblStudySetUpTemp thead").show();
        $("#tblStudySetUpTemp").show();
        $(".hidetd").hide();
        ClearData();
        //var MyRows = $('table#tblStudySetUpTemp').find('tbody').find('tr');
        //if (MyRows.length == 0) {
        //    $("#tblStudySetUpTemp thead").hide();
        //    $("#tblStudySetUpTemp").hide();
        //}
        if ($("#tblStudySetUpTemp tbody tr").length != 0) {
            $("#ddlDoseType").attr('disabled', 'disabled');
            $("#ddlApplyBalanceOn").attr('disabled', 'disabled');
        }
        else {
            $("#ddlDoseType").prop('disabled', '');
            $("#ddlApplyBalanceOn").prop('disabled', '');
        }

    }
}

function validateform() {

    if (Dropdown_Validation(document.getElementById("ddlApplyBalanceOn"))) {
        ValidationAlertBox("Please Select Apply Balance On !", "ddlApplyBalanceOn", ModuleName);
        return false;
    }

    if (isBlank(document.getElementById('txtRandomizationRatio').value)) {
        ValidationAlertBox("Please Enter Randomization Ratio !", "txtRandomizationRatio", ModuleName);
        return false;
    }

    if (isBlank(document.getElementById('txtExpiryDays').value)) {
        ValidationAlertBox("Please Enter Near Expiry Days !", "txtExpiryDays", ModuleName);
        return false;
    }

    if (Dropdown_Validation(document.getElementById("ddlDoseType"))) {
        ValidationAlertBox("Please Select Dose Type !", "ddlDoseType", ModuleName);
        return false;
    }

    if (Dropdown_Validation(document.getElementById("ddlRandomizationType"))) {
        ValidationAlertBox("Please Select Randomization Type !", "ddlRandomizationType", ModuleName);
        return false;
    }

    if (Dropdown_Validation(document.getElementById("ddlPMName"))) {
        ValidationAlertBox("Please Select Project Manager !", "ddlPMName", ModuleName);
        return false;
    }

    if (isBlank(document.getElementById('txtRemarks').value)) {
        ValidationAlertBox("Please Enter Remarks !", "txtRemarks", ModuleName);
        return false;
    }
}

$("#btnExitPmsStudySetUp").on("click", function () {
    ConfirmAlertBox(ModuleName);
});

function ClearData() {
    //$("#txtRandomizationRatio").val("");
    $("#txtRandomizationRatio").removeAttr("title");
    $("#txtExpiryDays").val("");
    $("#txtRemarks").val("");
    $("#txtInstruction").val("");
    $("#txtRouteAdmin").val("");

}

$('#txtProjectNoDashboard').on('change keyup paste mouseup', function () {
    var GetPmsProductBatchProjectNo = {
        Url: BaseUrl + "PmsProductBatch/GetProjectNo",
        SuccessMethod: "SuccessMethod"
    }

    if ($('#txtProjectNoDashboard').val().length == 2) {
        var ProjectNoDataTemp = {
            vProjectNo: $('#txtProjectNoDashboard').val(),
            iUserId: $("#hdnuserid").val(),
            vProjectTypeCode: $("#hdnscopevalues").val(),
        }
        GetAllPmsProductbatchProjectNo(GetPmsProductBatchProjectNo.Url, GetPmsProductBatchProjectNo.SuccessMethod, ProjectNoDataTemp);

    }
    else if ($('#txtProjectNoDashboard').val().length < 2) {
        $("#txtProjectNoDashboard").autocomplete({
            source: "",
            change: function (event, ui) { },
            select: function (event, ui) {
                $('#txtProjectNoDashboard').blur();
            }
        });
    }
});

$('#txtProjectNoDashboard').on('blur', function () {
    if (workspaceIds[$('#txtProjectNoDashboard').val()] != undefined) {
        setWorkspaceId = workspaceIds[$('#txtProjectNoDashboard').val()];
    }
    GetStudyProductDesignData();
    GetProductType();
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
    function SuccessMethod(jsonData) {
        var jsonObj = jsonData;
        var sourceArr = [];

        for (var i = 0; i < jsonObj.length; i++) {
            sourceArr.push("[ " + jsonObj[i].vStudyCode + " ]" + " " + jsonObj[i].vStudyName);
            workspaceIds["[ " + jsonObj[i].vStudyCode + " ]" + " " + jsonObj[i].vStudyName] = jsonObj[i].nStudyNo;
        }

        $("#txtProjectNoDashboard").autocomplete({
            source: sourceArr,
            change: function (event, ui) { }
        });
    }
}

$("#tblStudySetUpTemp").on('click', '#trRemove', function () {
    $(this).closest('tr').remove();
    if ($("#tblStudySetUpTemp tr").length == 1) {
        $("#tblStudySetUpTemp").hide();
        $("#btnSavePmsStudySetUp").attr("style", "display:none");
        $("#ddlDoseType").prop('disabled', '');
        $("#ddlDoseType").val("0");
        $("#ddlApplyBalanceOn").prop('disabled', '');
        $("#ddlApplyBalanceOn").val("0");
    }
    else {
        $("#tblStudySetUpTemp").show();
        $("#btnSavePmsStudySetUp").attr("style", "display:inline");
        $("#ddlDoseType").attr('disabled', 'disabled');
        $("#ddlApplyBalanceOn").attr('disabled', 'disabled');
    }
});

$("#btnSavePmsStudySetUp").on("click", function () {
    GetStudyProductDesignData();

    var StudySetUp = {};
    var StudySetUpResult = [];


    var treatmenttypemapping = $("#hdnFormulationType").val().split(":");

    var MyRows = $('table#tblStudySetUpTemp').find('tbody').find('tr');
    for (var i = 0; i < MyRows.length; i++) {
        StudySetUp = {
            vWorkSpaceID: setWorkspaceId,
            vRandomizationRatio: $(MyRows[i]).find('td:eq(1)').html(),
            cApplyBalanceOn: $(MyRows[i]).find('td:eq(13)').html(),
            vProjectTypeCode: $("#hdnProjectTypeCode").val(),
            vSubmission: $(MyRows[i]).find('td:eq(4)').html(),
            vDrugCode: $("#hdnDrugCode").val(),
            vRemarks: $(MyRows[i]).find('td:eq(12)').html(),
            iModifyBy: $("#hdnuserid").val(),
            iExpiryDays: $(MyRows[i]).find('td:eq(6)').html(),
            cDoseType: $(MyRows[i]).find('td:eq(14)').html(),
            iProjectManagerID: $(MyRows[i]).find('td:eq(16)').html(),
            vInstruction: $(MyRows[i]).find('td:eq(10)').html(),
            vRouteAdmin: $(MyRows[i]).find('td:eq(11)').html(),
            cRandomizationType: $(MyRows[i]).find('td:eq(8)').html().charAt(0),
            vFormulationType: treatmenttypemapping[i],
        }
        StudySetUpResult.push(StudySetUp);
    }

    $.ajax({
        url: BaseUrl + "PmsRecordSave/Save_StudyProductDesign",
        type: 'POST',
        data: { '': StudySetUpResult },
        success: function (data) {
            $("#ddlDoseType").val("0");
            $("#ddlApplyBalanceOn").val("0");
            GetStudyProductDesignData();
            SuccessorErrorMessageAlertBox("Data Saved Successfully !", ModuleName);

        },
        error: function () {
            SuccessorErrorMessageAlertBox("Error !", ModuleName);
        }
    });
});

$("#btnClearPmsStudySetUp").on("click", function () {
    ClearData();
    $("#tblStudySetUpTemp thead").hide();
    $("#tblStudySetUpTemp tbody tr").remove();
    $("#btnSavePmsStudySetUp").hide();
    $("#ddlDoseType").prop('disabled', '');
    $("#ddlDoseType").val("0");
    //$("#ddlApplyBalanceOn").prop('disabled', '');
    //$("#ddlApplyBalanceOn").val("0");
    $("#ddlRandomizationType").prop('disabled', '');
    $("#ddlRandomizationType").val("0");

});

function addMoreRows() {
    if (Dropdown_Validation(document.getElementById("ddlProductType"))) {
        ValidationAlertBox("Please Select Product Type !", "ddlProductType", ModuleName);
        return false;
    }

    if (isBlank(document.getElementById('txtProductTypeRatio').value)) {
        ValidationAlertBox("Please Enter Randomization Ratio !", "txtProductTypeRatio", ModuleName);
        return false;
    }

    var MyRows = $('table#tblProductTypeRandomizationRatio').find('tbody').find('tr');
    for (var i = 0; i < MyRows.length; i++) {
        var ProductTypeValue = $(MyRows[i]).find('td:eq(0)').html();
        if (ProductTypeValue == $("#ddlProductType :selected").text()) {
            ValidationAlertBox("This Product Type Already Added !", "ddlProductType", ModuleName);
            return false;
        }

    }

    var strdata;
    strdata += "<tr>";
    strdata += "<td align='center'>" + $("#ddlProductType :selected").text() + "</td>";
    strdata += "<td align='center'>" + $("#txtProductTypeRatio").val() + "</td>";
    strdata += "<td id='trRemove' align='center'><span class='glyphicon glyphicon-remove' title='Remove'></span></td>";
    strdata += "<td class='hidetd'>" + $("#ddlProductType :selected").text() + " - " + $("#txtProductTypeRatio").val() + "</td>";
    strdata += "</tr>";
    $("#tbodyProductTypeRandomizationRatio").append(strdata);
    $("#tblProductTypeRandomizationRatio thead").show();
    $("#tblProductTypeRandomizationRatio").show();
    $(".hidetd").hide();
    $("#txtProductTypeRatio").val("");
    $("#ddlProductType").val("0");
    $("#btnSaveRandomization").show();
}

function GetProductType() {
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

$("#tblProductTypeRandomizationRatio").on('click', '#trRemove', function () {
    $(this).closest('tr').remove();
    if ($("#tblProductTypeRandomizationRatio tr").length == 1) {
        $("#tblProductTypeRandomizationRatio").hide();
        $("#btnSaveRandomization").attr("style", "display:none");
    }
    else {
        $("#tblProductTypeRandomizationRatio").show();
        $("#btnSaveRandomization").attr("style", "display:inline");

    }
});

$("#btnSaveRandomization").on("click", function () {
    var MyRows = $('table#tblProductTypeRandomizationRatio').find('tbody').find('tr');
    var RandomizationRatio = "";
    for (var i = 0; i < MyRows.length; i++) {
        var ProductTypeRatio = $(MyRows[i]).find('td:eq(3)').html();
        RandomizationRatio += ProductTypeRatio + ":"
    }
    RandomizationRatio += "-"
    RandomizationRatio = RandomizationRatio.replace(":-", "");
    $("#txtRandomizationRatio").val(RandomizationRatio);
    $('#modalRandomizationRatio').modal('hide');

    $("#txtRandomizationRatio").attr("title", RandomizationRatio);

});

function ViewMyProject() {
    var wStr = "nStudyno = " + setWorkspaceId + ""
    var WhereData = {
        WhereCondition_1: wStr,
        columnName_1: "Top 1 vProjectTypeCode,vProjectTypeName,vDrugCode,vDrugName,vRegionName,iProjectManagerId"
    }
    if (setWorkspaceId != "") {
        $.ajax({
            url: BaseUrl + "PmsRecordFetch/View_MyProjects_FromBiznet",
            type: 'POST',
            data: WhereData,
            async: false,
            success: function (data) {
                data = data.Table;
                //$("#hdnDrugCode").val(data[0].vDrugCode);
                // $("#hdnProjectTypeCode").val(data[0].vProjectTypeCode);
                // $("#txtProjectType").val(data[0].vProjectTypeName);
                //$("#txtDrugName").val(data[0].vDrugName);
                //$("#txtSubmission").val(data[0].vRegionName);
                //$("#ddlPMName").val(data[0].iProjectManagerId);
            }
        });
    }
}

function GetStudyProductDesignData() {
    var wStr = "vWorkspaceId = " + setWorkspaceId + ""
    var WhereData = {
        WhereCondition_1: wStr,
    }

    var WhereData = {
        vWorkSpaceID: setWorkspaceId,
    }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/Proc_GetStudyProductDesignMst",
        type: 'POST',
        data: WhereData,
        async: false,
        success: SuccessResult,
        error: function () {
            alert("Erro To Get Data of Study Setup");
        }
    });

    function SuccessResult(jsonData) {
        var ActivityDataset = [];
        var JsonObj = jsonData;
        //if (JsonObj.length > 0) { 
        //}
        //else {
        //}

        if (JsonObj.length > 0) {
            $("#ExportButton").attr("style", "display:none");
            if (JsonObj[0].cRandomizationType == "-") {
                ActivityDataset = [];
            }
            else {
                ExportToExcelSessionVariable();
                $("#ExportButton").attr("style", "display:inline");
                for (var i = 0; i < JsonObj.length; i++) {
                    var InDataset = [];
                    InDataset.push(JsonObj[i].vProjectNo, JsonObj[i].vProjectTypeName, JsonObj[i].vDrugName, JsonObj[i].cApplyBalanceOn, JsonObj[i].vRandomizationRatio,
                                   JsonObj[i].vSubmission, JsonObj[i].iExpiryDays, JsonObj[i].cDoseType, JsonObj[i].cRandomizationType, JsonObj[i].ProjectManagerWithProfile,
                                   JsonObj[i].vInstruction, JsonObj[i].vRouteAdmin, JsonObj[i].vRemark, JsonObj[i].vModifyBy + " /</br> " + JsonObj[i].dModifyOn);
                    ActivityDataset.push(InDataset);
                }
            }
        }

        var otableProjectWiseAuditTrail = $('#tblPmsStudySetupData').dataTable({
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
            "sScrollX": "100%",
            "sScrollXInner": "2200" /* It varies dynamically if number of columns increases */,
            "aoColumns": [
               { "sTitle": "Project No" },
               { "sTitle": "Project Type" },
               { "sTitle": "Drug Name" },
               { "sTitle": "Apply Balance On" },
               { "sTitle": "Balance Ratio" },
               { "sTitle": "Submission" },
               { "sTitle": "Near Expiry Days" },
               { "sTitle": "Dose Type" },
               { "sTitle": "Randomization Type" },
               { "sTitle": "Project Manager" },
               { "sTitle": "Special Instruction" },
               { "sTitle": "Route Of Administration" },
               { "sTitle": "Remarks" },
               { "sTitle": "Study Design Defined By" },
            ],
            "columnDefs": [
                { "width": "5%", "targets": 0 },
                { "width": "6%", "targets": 1 },
                { "width": "10%", "targets": 2 },
                { "width": "7%", "targets": 3 },
                { "width": "7%", "targets": 4 },
                { "width": "6%", "targets": 5 },
                { "width": "7%", "targets": 6 },
                { "width": "6%", "targets": 7 },
                { "width": "8%", "targets": 8 },
                { "width": "7%", "targets": 9 },
                { "width": "8%", "targets": 10 },
                { "width": "9%", "targets": 11 },
                { "width": "4%", "targets": 12 },
                { "width": "20%", "targets": 13 },
            ],
            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },
        });
    }
}

function RandomizationRatio() {
    $("#tblProductTypeRandomizationRatio thead").hide();
    $("#tblProductTypeRandomizationRatio tbody tr").remove();
    $("#btnSaveRandomization").hide();
    $("#txtProductTypeRatio").val("");
    $("#ddlProductType").val("0");
    // $('#modalRandomizationRatio').modal('show');
}

function CheckRecordExist(RandomizationRatio) {
    GetStudyProductDesignData();
    var MyRows = $('table#tblPmsStudySetupData').find('tbody').find('tr');
    for (var i = 0; i < MyRows.length; i++) {
        var TempRandomizationRatio = $(MyRows[i]).find('td:eq(0)').html();
        var ApplyBalanceOn = $(MyRows[i]).find('td:eq(1)').html();

        if (ApplyBalanceOn == $("#ddlApplyBalanceOn :selected").text() && TempRandomizationRatio == RandomizationRatio) {
            ValidationAlertBox("This Record Exist in Below Table !", "txtProjectNo", ModuleName);
            return false;
        }

    }

    return true;
}

function PrincipalInvestigator() {
    $.ajax({
        url: WebUrl + "PmsStudySetup/View_ProjectManager",
        type: 'POST',
        success: SuccessMethod,
        async: false,
        error: function () {
            SuccessorErrorMessageAlertBox("Project Not Found !", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        var jsonObj = jQuery.parseJSON(jsonData);
        if (jsonObj.length > 0) {
            $("#ddlPMName").attr('disabled', 'disabled');
            $("#ddlPMName").empty().append('<option selected="selected" value="0">Please Select Project Manager</option>');
            for (var i = 0; i < jsonObj.length; i++)
                $("#ddlPMName").append($("<option></option>").val(jsonObj[i].iUserId).html(jsonObj[i].ProjectManagerWithProfile));
        }
        else {
            $("#ddlPMName").attr('disabled', '');
            $("#ddlPMName").empty().append('<option selected="selected" value="0">Please Select Project Manager</option>');
        }
    }
}

function PrincipalInvestigatorbyDefault() {
    var WhereData = {
        vWorkSpaceID: setWorkspaceId,
    }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/View_MyProjects_FromBiznet",
        type: 'POST',
        success: SuccessMethod,
        async: false,
        data: WhereData,
        error: function () {
            SuccessorErrorMessageAlertBox("Project Not Found !", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        if (jsonData.length > 0) {
            //$("#ddlPMName").val(jsonData[0].vPIName);
        }
    }
}

function ExportToExcelSessionVariable() {
    var url = WebUrl + "PmsStudySetup/GetExportToExcel";
    $.ajax({
        url: url,
        type: 'GET',
        data: { id: setWorkspaceId },
        async: false,
        success: function (response) {
        },
        error: function () {
            SuccessorErrorMessageAlertBox("No Project Found !", ModuleName);

        }
    });
}