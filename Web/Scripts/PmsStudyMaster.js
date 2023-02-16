var ConfirmMessage = 'Are You Sure You Want To Exit ?';
var vStudyCode;
var vStudyName;
var nStudyNo;
var vSponsorName;
var vSubmission; //added by dharini 13-12-2022
var vPhase; //added by dharini 13-12-2022
var vOtherDetails; //added by dharini 13-12-2022
var ModuleName = "Study Master";
var Operation;
var btnOperaion;
var btninactiveName;

$(document).ready(function () {
    nUserNo = null;
    $('#StudyDetailsModel').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('#divAuditTrial').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('#StudyDetailsModel').modal('hide')
    $('#divAuditTrial').modal('hide')
    vStudyCode = document.getElementById('txtStudyCode');
    vStudyName = document.getElementById('txtStudyName');
    vSponsorName = document.getElementById('txtSponsorName');
    vSubmission = document.getElementById('txtSubmission'); //added by dharini 13-12-2022
    vPhase = document.getElementById('txtPhase'); //added by dharini 13-12-2022
    vOtherDetails = document.getElementById('txtOtherDetails'); //added by dharini 13-12-2022

    GetParentClientList();
    GetStudyMasterDetails();
    GetSponserList();
});

function GetParentClientList() {
    jsonData = "";
    var ExecuteDataSetData = {
        Table_Name_1: "ClientMst",
        WhereCondition_1: "cStatusIndi <> 'C'",
        DataRetrieval_1: 3,
    }
    GetJsonData(ExecuteDataSetData);
    $("#ddlClient").empty().append('<option selected="selected" value="">Please Select Client</option>');
    for (var i = 0; i < jsonData.length; i++) {
        $("#ddlClient").append($("<option></option>").val(jsonData[i].nClientNo).html(jsonData[i].vClientName));
    }
}

function GetStudyMasterDetails() {
    var Url = BaseUrl + "RecordFetcher/ExecuteDataTable";
    var ExecuteDataSetData = {
        Table_Name_1: "View_StudyMst",
        DataRetrieval_1: 2,
    }
    GetJsonData(ExecuteDataSetData);

    var ActivityDataset = [];
    for (var i = 0; i < jsonData.length; i++) {
        var InDataset = [];
        InDataset.push(jsonData[i].nStudyNo, jsonData[i].vStudyName, jsonData[i].vStudyCode, jsonData[i].vClientName, jsonData[i].vSponsorName, "", "", "","", jsonData[i].nClientNo, jsonData[i].cStatusIndi,jsonData[i].vSubmission,jsonData[i].vPhase,jsonData[i].vOtherDetails);
        ActivityDataset.push(InDataset);
    }
    jsonData = "";
    var otableSiteDetails = $('#tblStudyDetailsData').dataTable({
        "bJQueryUI": true,
        "sPaginationType": "full_numbers",
        "bLengthChange": true,
        "iDisplayLength": 10,
        "bProcessing": true,
        "bSort": true,
        "autoWidth": true,
        "aaData": ActivityDataset,
        "aaSorting": [],
        "bInfo": true,
        "bAutoWidth": false,
        "bDestroy": true,
        "fnCreatedRow": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {

            $('td:eq(4)', nRow).append('<center><a data-toggle="modal" title="Edit" data-options="splash-2 splash-ef-15" data-target="#StudyDetailsModel" attrid="' + '" onclick="OperationEdit(this)" style="cursor:pointer;" vStudyCode="' + aData[2] + '" vStudyName="' + aData[1]
             + '"nStudyNo="' + aData[0] + '" nClientNo="' + aData[9] + '" vSponsorName="' + aData[4] + '"vSubmission="' + aData[11] + '"vPhase="' + aData[12] + '"vOtherDetails="' + aData[13] //added last 3 fields by dharini 22-12-2022
            + '" class="btn btn-primary btn-rounded btn-sm btn-ef btn-ef-5 btn-ef-5a mb-0"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a></center>');


            if (aData[10] == 'D') {
                $('td:eq(5)', nRow).append('<center><a title="Active" data-toggle="modal" data-options="splash-2 splash-ef-15"  nStudyNo="' + aData[0]
                 + '" onclick="StudyActiveInactive(this)" style="cursor:pointer;" vStudyCode="' + aData[2] + '" vStudyName="' + aData[1] + '" vSponsorName="' + aData[4] + '"vSubmission="' + aData[11] + '"vPhase="' + aData[12] + '"vOtherDetails="' + aData[13]  //added last 3 fields by dharini 22-12-2022
                 + '" <i class="btn btn-primary btn-sm btn-rounded btn-ef btn-ef-5 btn-ef-5a mb-10"><i class="fa fa-close"></i> <span>Active</span></a></div></center>');
                $(nRow).addClass('highlight');
                //$('td', nRow).eq(4).addClass('disabled');
            } else {
                $('td:eq(5)', nRow).append('<center><a title="Inactive" data-toggle="modal" data-options="splash-2 splash-ef-15"  nStudyNo="' + aData[0]
              + '" onclick="StudyActiveInactive(this)" style="cursor:pointer;" vStudyCode="' + aData[2] + '" vStudyName="' + aData[1] + '" vSponsorName="' + aData[4] + '"vSubmission="' + aData[11] + '"vPhase="' + aData[12] + '"vOtherDetails="' + aData[13]  //added last 3 fields by dharini 22-12-2022
              + '" <i class="btn btn-primary btn-sm btn-rounded btn-ef btn-ef-5 btn-ef-5a mb-10"><i class="fa fa-close"></i> <span>Inactive</span></a></div></center>');
            }

            $('td:eq(6)', nRow).append('<center><a title="Inactive" data-toggle="modal" data-options="splash-2 splash-ef-15" data-target="#StudyDetailsModel" nStudyNo="' + aData[0]
            + '" onclick="StudyAudit(this)" style="cursor:pointer;" vStudyCode="' + aData[2] + '" vStudyName="' + aData[1] + '" nClientNo="' + aData[9] + '" vSponsorName="' + aData[4] + '"vSubmission="' + aData[11] + '"vPhase="' + aData[12] + '"vOtherDetails="' + aData[13]  //added last 3 fields by dharini 22-12-2022
            + '" <i class="btn btn-primary btn-sm btn-rounded btn-ef btn-ef-5 btn-ef-5a mb-10"><i class="fa fa-close"></i> <span>Audit</span></a></div></center>');

            $('td:eq(7)', nRow).append('<center><a title="UserAttach" data-toggle="modal" data-options="splash-2 splash-ef-15" data-target="#UserAttachModel" onclick="Get_UserActivity(this)" style="cursor:pointer;" nSiteNo="' + aData[0] + '"vSubmission="' + aData[11] + '"vPhase="' + aData[12] + '"vOtherDetails="' + aData[13]  //added last 3 fields by dharini 22-12-2022
              + '" vSiteNumber="' + aData[2] + '" vStudyCode="' + aData[9] + '" vSiteName="' + aData[2] + '" vSiteAddress="' + aData[3] + '" vPIName="' + aData[4] + '"nStudyNo="' + aData[10]
            + '" <i class="btn btn-primary btn-sm btn-rounded btn-ef btn-ef-5 btn-ef-5a mb-10"><i class="fa fa-close"></i> <span>Attach</span></a></div></center>');

            if (aData[10] == 'D') {
                $(nRow).addClass('highlight');
                $('td', nRow).eq(3).addClass('disabled');
                $('td', nRow).eq(7).addClass('disabled');
                $('td', nRow).eq(0).css('color', '#333');
                $('td', nRow).eq(1).css('color', '#333');
                $('td', nRow).eq(2).css('color', '#333');
                $('td', nRow).eq(4).addClass('disabled');
            }
        },



        "columnDefs": [
            { "bSortable": false, "targets": 0, "visible": false },
            { "bSortable": false, "targets": 4 },
        ],
        "aoColumns": [
            { "sTitle": "Study No" },
            //{ "sTitle": "Study Name" },
            { "sTitle": "Molecule Name" }, // added by dharini 13-12-2022
            //{ "sTitle": "Study Code" },
            { "sTitle": "Protocol No" }, // added by dharini 13-12-2022
            { "sTitle": "Client Name" },
            { "sTitle": "Sponsor Name" },
            { "sTitle": "Edit" },
            { "sTitle": "Inactive" },
            { "sTitle": "Audit" },
            { "sTitle": "User Attach" }
        ],
        "oLanguage": {
            "sEmptyTable": "No Record Found",
        },
    });

}

$("#btnAddstudy").on("click", function () {

    $('.form-control').each(function () {
        $(this).attr('disabled', false);
        if ($(this).hasClass("parsley-success")) {
            $(this).removeClass("parsley-success");
        }
        else {
            if ($(this).hasClass("parsley-error")) {
                $(this).removeClass("parsley-error")
            }
            if ($(this).next().hasClass("filled")) {
                $(this).next().removeClass("filled")
            }
        }
    });
    Operation = "save";
    $('.AuditControl').each(function () { this.style.display = "none"; });
    ClearTextBoxDetailPart();
    $('#divRemark').hide();
    $("#titleMode").text('Mode:-Add');
    document.getElementById("btnSaveStudyDetails").value = "Save"
    document.getElementById("btnSaveStudyDetails").title = "Save";
    $("#btnSaveStudyDetails").attr("style", "display:inline");
    $("#btnClearStudyDetails").attr("style", "display:inline");
});

$("#btnSaveStudyDetails").on("click", function () {

    btnOperaion = (document.getElementById("btnSaveStudyDetails").value).toLowerCase();
    if (validateform() == false) {
        return false;
    }

    if (btnOperaion == "save") {

        Operation = 1;
        var SaveStudyMasterData = {
            vStudyCode: vStudyCode.value,
            vStudyName: vStudyName.value,
            nClientNo: $('#ddlClient').val(),
            //vSponsorName: vSponsorName.value,
            vSponsorName: $('#txtSponsorName').val(),
            vRemark: '',
            iModifyBy: document.getElementById('hdnuserid').value,
            cStatusIndi: 'N',
            DATAOPMODE: Operation,
            vSubmission: $('#txtSubmission').val(), //added by dharini 13-12-2022
            vPhase: $('#txtPhase').val(), //added by dharini 13-12-2022
            vOtherDetails: $('#txtOtherDetails').val() //added by dharini 13-12-2022
        }

        SaveStudyMaster(BaseUrl + "PmsStudyMaster/save_StudyMaster", "SuccessMethod", SaveStudyMasterData);
    }
    else {
        if (btnOperaion == "update") {
            Operation = 2;
            var SaveStudyMasterData = {

                nStudyNo: nStudyNo,
                vStudyCode: vStudyCode.value,
                vStudyName: vStudyName.value,
                nClientNo: $('#ddlClient').val(),
                //vSponsorName: vSponsorName.value,
                vSponsorName: $('#txtSponsorName').val(),
                vRemark: $('#txtRemark').val(),
                iModifyBy: document.getElementById('hdnuserid').value,
                cStatusIndi: 'E',
                DATAOPMODE: Operation,
                vSubmission: $('#txtSubmission').val(), //added by dharini 13-12-2022
                vPhase: $('#txtPhase').val(), //added by dharini 13-12-2022
                vOtherDetails: $('#txtOtherDetails').val() //added by dharini 13-12-2022
            }
            SaveStudyMaster(BaseUrl + "PmsStudyMaster/save_StudyMaster", "SuccessMethod", SaveStudyMasterData);
        }

    }
    ClearTextBoxDetailPart();
    $("#StudyDetailsModel").modal('hide');
    //GetParentOperationList();
    GetStudyMasterDetails();
});


$("#btnInActiveSave").on("click", function () {

    if (isBlank(document.getElementById('txtStudyRemark').value)) {
        ValidationAlertBox("Please Enter Remark !", "txtStudyRemark", ModuleName);
        return false;
    }
    else {
        Operation = 3;
        if (btninactiveName == " Active") {
            var SaveStudyMasterData =
           {
               nStudyNo: nStudyNo,
               vStudyCode: vStudyCode,
               vStudyName: vStudyName,
               vSponsorName: vSponsorName,
               iModifyBy: document.getElementById('hdnuserid').value,
               cStatusIndi: 'A',
               vRemark: $('#txtStudyRemark').val(),
               DATAOPMODE: Operation,
               vSubmission:vSubmission,
               vPhase: vPhase,
               vOtherDetails:vOtherDetails
           }
            SaveStudyMaster(BaseUrl + "PmsStudyMaster/save_StudyMaster", "SuccessMethod", SaveStudyMasterData);
        }
        else {
            var SaveStudyMasterData =
                {
                    nStudyNo: nStudyNo,
                    vStudyCode: vStudyCode,
                    vStudyName: vStudyName,
                    vSponsorName: vSponsorName,
                    iModifyBy: document.getElementById('hdnuserid').value,
                    cStatusIndi: 'D',
                    vRemark: $('#txtStudyRemark').val(),
                    DATAOPMODE: Operation,
                    vSubmission: vSubmission,
                    vPhase: vPhase,
                    vOtherDetails: vOtherDetails
                }
            SaveStudyMaster(BaseUrl + "PmsStudyMaster/save_StudyMaster", "SuccessMethod", SaveStudyMasterData);
        }
    }
});


$("#btnClearStudyDetails").on("click", function () {
    ClearTextBoxDetailPart();
});

$("#btnExitStudyDetails").on("click", function () {
    //var result = confirm(ConfirmMessage);
    //if (result) {
    //    $("#StudyDetailsModel").modal('hide');
    //}
    //else {
    //    return false;
    //}
    ConfirmAlertBox(ModuleName, $("#RedirectToHome").val());
});

function ClearTextBoxDetailPart() {

    if (Operation == "save") {
        vStudyCode.value = "";
        vStudyName.value = "";
        $('#txtSponsorName').val('');
        $('#ddlClient').val('');
        $('#txtSubmission').val(''); //added by dharini 13-12-2022
        $('#txtPhase').val(''); //added by dharini 13-12-2022
        $('#txtOtherDetails').val(''); //added by dharini 13-12-2022
    }
    else if (Operation == "update") {
        $('#ddlClient').val('');
        $('#txtRemark').val('');
        $('#txtSubmission').val(''); //added by dharini 13-12-2022
        $('#txtPhase').val(''); //added by dharini 13-12-2022
        $('#txtOtherDetails').val(''); //added by dharini 13-12-2022
    }
    else {
        vStudyCode.value = "";
        vStudyName.value = "";
        $('#txtSponsorName').val('');
        $('#ddlClient').val('');
        $('#txtSubmission').val(''); //added by dharini 13-12-2022
        $('#txtPhase').val(''); //added by dharini 13-12-2022
        $('#txtOtherDetails').val(''); //added by dharini 13-12-2022
    }
    $('.form-control').each(function () {
        if ($(this).hasClass("parsley-success")) {
            $(this).removeClass("parsley-success");
        }
        else {
            if ($(this).hasClass("parsley-error")) {
                $(this).removeClass("parsley-error")
            }
            if ($(this).next().hasClass("filled")) {
                $(this).next().removeClass("filled")
            }
        }
    });
}

function validateform() {
    if (isBlank(document.getElementById('txtStudyCode').value)) {
        ValidationAlertBox("Please Enter Study Code !", "txtStudyCode", ModuleName);
        return false;
    }
    if (isBlank(document.getElementById('txtStudyName').value)) {
        ValidationAlertBox("Please Enter Study Name !", "txtStudyName", ModuleName);
        return false;
    }
    if (Dropdown_Validation(document.getElementById("ddlClient"))) {
        ValidationAlertBox("Please Select client !", "ddlClient", ModuleName);
        return false;
    }
    if (isBlank(document.getElementById('txtSponsorName').value)) {
        ValidationAlertBox("Please Enter Sponsor Name !", "txtSponsorName", ModuleName);
        return false;
    }
    if (btnOperaion == "update") {
        if (isBlank(document.getElementById('txtRemark').value)) {
            ValidationAlertBox("Please Enter Remark !", "txtRemark", ModuleName);
            return false;
        }
    }
    if (btnOperaion == "save") {
        var rows = $("#tblStudyDetailsData").dataTable().fnGetNodes();
        var StudyName = ($("#txtStudyCode").val()).trim();
        var rowsData = $("#tblStudyDetailsData").dataTable().fnGetData();

        for (i = 0; i < rows.length; i++) {
            if (StudyName.toUpperCase() == $(rows[i]).find("td:eq(1)").html().trim().toUpperCase()) {
                if (rowsData[i][11] != 'D') {
                    ValidationAlertBox("This Study already Exists", "txtStudyCode", ModuleName);
                    return false;
                    break;
                }
            }
        }
    }
    return true;
}

var SaveStudyMaster = function (Url, SuccessMethod, Data) {
    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        async: false,
        success: SuccessInsertData,
        error: function () {
            SuccessorErrorMessageAlertBox("Error while saving details of Study Masters.", ModuleName);
        }
    });

    function SuccessInsertData(response) {
        GetStudyMasterDetails();
        ClearTextBoxDetailPart();
        SuccessorErrorMessageAlertBox(response, ModuleName);
        //location.reload();
    }
};

function OperationEdit(e) {

    $('.form-control').each(function () {
        $(this).attr('disabled', false);
        if ($(this).hasClass("parsley-success")) {
            $(this).removeClass("parsley-success");
        }
        else {
            if ($(this).hasClass("parsley-error")) {
                $(this).removeClass("parsley-error")
            }
            if ($(this).next().hasClass("filled")) {
                $(this).next().removeClass("filled")
            }
        }
    });
    Operation = "update";
    $('#divRemark').show();
    $("#txtStudyCode").attr('disabled', 'disabled');
    $("#txtStudyName").attr('disabled', 'disabled');
    $('.AuditControl').each(function () { this.style.display = "none"; });
    $("#titleMode").text('Mode:-Edit');
    $(vStudyCode).val($(e).attr("vStudyCode"));
    $(vStudyName).val($(e).attr("vStudyName"));
    //$(vSponsorName).val($(e).attr("vSponsorName"));
    $('#txtSponsorName').val($(e).attr("vSponsorName"));
    nStudyNo = $(e).attr("nstudyno");
    $("#ddlClient").val($(e).attr("nClientNo"));
    $("#txtSubmission").val($(e).attr("vSubmission")); //added by dharini 13-12-2022
    $("#txtPhase").val($(e).attr("vPhase"));  //added by dharini 13-12-2022
    $("#txtOtherDetails").val($(e).attr("vOtherDetails"));  //added by dharini 13-12-2022
    document.getElementById("btnSaveStudyDetails").value = "Update";
    document.getElementById("btnSaveStudyDetails").title = "Update";
    $("#btnSaveStudyDetails").attr("style", "display:inline");
    $("#btnClearStudyDetails").attr("style", "display:inline");

    
}


function StudyActiveInactive(e) {
    btninactiveName = "";
    btninactiveName = e.text.trim();
    $('#txtStudyRemark').val('');
    nStudyNo = $(e).attr("nstudyno");
    vStudyCode = $(e).attr("vstudycode");;
    vStudyName = $(e).attr("vstudyname");;
    vSponsorName = $(e).attr("vSponsorName");;
    $("#StudyRemarkModal").modal('show');
    document.getElementById("btnSaveStudyDetails").value = "Inactive"
    document.getElementById("btnSaveStudyDetails").title = "Inactive";
}


function StudyAudit(e) {
    $('#divRemark').show();
    $("#txtStudyCode").attr('disabled', 'disabled');
    $("#txtStudyName").attr('disabled', 'disabled');
    $("#ddlClient").attr('disabled', 'disabled');
    $("#txtRemark").attr('disabled', 'disabled');
    $("#txtSponsorName").attr('disabled', 'disabled');
    $('.AuditControl').each(function () { this.style.display = "inline"; });
    $("#titleMode").text('Mode:-Audit');
    $(vStudyCode).val($(e).attr("vStudyCode"));
    $(vStudyName).val($(e).attr("vStudyName"));
    $(vSponsorName).val($(e).attr("vSponsorName"));
    $(vSubmission).val($(e).attr("vSubmission")); //added by dharini 13-12-2022
    $(vPhase).val($(e).attr("vPhase")); //added by dharini 13-12-2022
    $(vOtherDetails).val($(e).attr("vOtherDetails")); //added by dharini 13-12-2022
    nStudyNo = $(e).attr("nstudyno");
    $('#divRemark').hide();
    $("#ddlClient").val($(e).attr("nClientNo"));
    document.getElementById("btnSaveStudyDetails").value = "Audit";
    document.getElementById("btnSaveStudyDetails").title = "Audit";
    $("#btnSaveStudyDetails").attr("style", "display:none");
    $("#btnClearStudyDetails").attr("style", "display:none");
    
}

function StudyFieldWiseAuditTrail(e) {

    var str = e.id;
    var title = $(e).attr("titlename");
    var MasterFieldName = $(e).attr("MasterFieldName");
    var MasterTableName = $(e).attr("MasterTableName");
    var cCommaSeprate = $(e).attr("cCommaSeprate");
    var vJoinvMasterFieldName = $(e).attr("vJoinvMasterFieldName");
    var fieldname = str;

    var Data = {
        vTableName: "StudyMstHistory",
        vIdName: "nStudyNo",
        vIdValue: nStudyNo,
        vFieldName: str,
        iUserId: document.getElementById('hdnuserid').value,
        vMasterFieldName: MasterFieldName,
        vMasterTableName: MasterTableName,
    }

    $.ajax({
        url: BaseUrl + "PmsGeneral/AuditTrail",
        type: 'POST',
        data: Data,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Error To Get AuditTrail.", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        var strdata = "";
        var ActivityDataset = [];
        for (var i = 0; i < jsonData.length; i++) {
            var InDataset = [];
            InDataset.push(jsonData[i].vFieldName,
                          (jsonData[i].vDesciprtion == null ? "" : title + ' ' + jsonData[i].vDesciprtion),
                          jsonData[i].Operation,
                          jsonData[i].vRemark,
                          jsonData[i].vModifyBy,
                          jsonData[i].dModifyOn);
            ActivityDataset.push(InDataset);

        }
        otableAuditTrail = $('#tblUserDetailsAuditTrial').dataTable({
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
                         { "sTitle": "" + title + "" },
                         { "sTitle": "Description" },
                         { "sTitle": "Operations" },
                         { "sTitle": "Remarks" },
                         { "sTitle": "Modified By" },
                         { "sTitle": "Modified On" }
            ],
            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },
        });
    }
}
function GetSponserList() {
    jsonData = "";
    var ExecuteDataSetData = {
        Table_Name_1: "SponserMst",
        WhereCondition_1: "cStatusIndi <> 'D'",
        DataRetrieval_1: 3,
    }
    GetJsonData(ExecuteDataSetData);
    $("#txtSponsorName").empty().append('<option selected="selected" value="">Please Select Sponser</option>');
    for (var i = 0; i < jsonData.length; i++) {
        $("#txtSponsorName").append($("<option></option>").val(jsonData[i].vSponserName).html(jsonData[i].vSponserName));
    }
}


function Get_UserActivity(e) {

    iUserNo = $("#hdnuserid").val();
    $('#ddlUserMst').multiselect({
        nonSelectedText: 'Select UserName',
        buttonClass: 'form-control',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        numberDisplayed: 1,
    });
    GetUserMst($(e).attr("nSiteNo").toString());


    var AttachedUserData = {

        vStudyCode: $(e).attr("vSiteNumber").toString(),
        Mode: 'ExistUser',
        iUserId: '0'
    }

    var AllAttachedUserData = {

        vStudyCode: $(e).attr("vSiteNumber").toString(),
        Mode: 'AllExistUser',
        iUserId: '0'
    }

    GetAttachedUser(BaseUrl + "PmsSiteMaster/UserActivity", "SuccessMethod", AttachedUserData);
    GetAllAttachedUser(BaseUrl + "PmsSiteMaster/UserActivity", "SuccessMethod", AllAttachedUserData);

}

function GetUserMst(nSiteNo) {
    jsonData = "";
    var ExecuteDataSetData = {
        Table_Name_1: "View_UserMst",
        WhereCondition_1: "cStatusIndi <> 'C'",
        DataRetrieval_1: 3,
    }
    GetJsonData(ExecuteDataSetData);
    $("#ddlUserMst").empty();
    for (var i = 0; i < jsonData.length; i++) {
        $("#ddlUserMst").append($("<option></option>").val(jsonData[i].iUserId).html('[' + jsonData[i].vLoginName + '] [' + jsonData[i].vUserTypeName + ']').attr('Default', 'N').attr('DefaultCheck', 'N').attr('nStudyNo', nSiteNo));
        $('#ddlUserMst').multiselect('rebuild');

    }
}

function GetAttachedUser(Url, SuccessMethod, Data) {
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
        if (jsonData == "") {

        }
        else {
            var valArr = jsonData.split(',');
            i = 0, size = valArr.length;
            for (i; i < size; i++) {
                $("#ddlUserMst").find("option[value=" + valArr[i] + "]").prop("selected", true)
                $("#ddlUserMst").find("option[value=" + valArr[i] + "]").attr('DefaultCheck', 'Y')
                $("#ddlUserMst").multiselect("refresh")
            }
        }
    }
}
function GetAllAttachedUser(Url, SuccessMethod, Data) {
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
        if (jsonData == "") {

        }
        else {
            var valArr = jsonData.split(',');
            i = 0, size = valArr.length;
            for (i; i < size; i++) {
                $("#ddlUserMst").find("option[value=" + valArr[i] + "]").attr('Default', 'Y')
                $("#ddlUserMst").multiselect("refresh")
            }
        }
    }
}

function GetSelectedTextValue(ddlUserMst) {
    var selectedValue = ddlUserMst.value;
    var selected_option = $('#mySelectBox option:selected');
    if (this.selected) {
        $("#ddlUserMst").find("option[value=" + selectedValue + "]").attr('Change', 'Y');
    }
    else {
        $("#ddlUserMst").find("option[value=" + selectedValue + "]").attr('Change', 'N');
    }
    $("#ddlUserMst").multiselect("refresh");
}

$("#btnSaveUserActivity").on("click", function () {

    if (isBlank(document.getElementById('ddlUserMst').value)) {
        ValidationAlertBox("Please select atleast one User.", "ddlUserMst", ModuleName);
        return false;
    }

    var $el = $("#ddlUserMst");
    $el.find('option').each(function () {
        if (this.selected) {
            if ($(this).attr('Default').toString() == "N" || $(this).attr('DefaultCheck').toString() == "N") {

                var AttachedUserData = {
                    iUserId: $(this).val(),
                    iModifyBy: document.getElementById('hdnuserid').value,
                    nStudyNo: $(this).attr('nStudyNo').toString(),
                    cStatusIndi: "A",
                    vAuditRemark: "Attached User",
                    ExistUser: $(this).attr('Default').toString()
                }

                SaveAttachedUser(BaseUrl + "PmsSiteMaster/SaveUserActivity", "SuccessMethod", AttachedUserData);

                function SaveAttachedUser(Url, SuccessMethod, Data) {
                    $.ajax({
                        url: Url,
                        type: 'POST',
                        data: Data,
                        async: false,
                        success: SuccessMethod,
                        dataType: 'json',
                        error: function () {
                            SuccessorErrorMessageAlertBox("Error while Save details of Attached User.", ModuleName);
                        }
                    });

                    function SuccessInsertData(response) {
                        SuccessorErrorMessageAlertBox(response, ModuleName);
                    }
                }
            }
        }
        else {
            if ($(this).attr('Default').toString() == "Y" && $(this).attr('DefaultCheck').toString() == "Y") {

                var AttachedUserData = {
                    iUserId: $(this).val(),
                    iModifyBy: document.getElementById('hdnuserid').value,
                    nStudyNo: $(this).attr('nStudyNo').toString(),
                    cStatusIndi: "D",
                    vAuditRemark: "Remove User",
                    ExistUser: $(this).attr('Default').toString()
                }

                SaveAttachedUser(BaseUrl + "PmsSiteMaster/SaveUserActivity", "SuccessMethod", AttachedUserData);

                function SaveAttachedUser(Url, SuccessMethod, Data) {
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

                    function SuccessInsertData(response) {
                        SuccessorErrorMessageAlertBox(response, ModuleName);
                        //location.reload();
                    }
                }
            }

        }
    });
    SuccessorErrorMessageAlertBox("User details saved successfully.", ModuleName);
});

$("#btnExitUserActivity").on("click", function () {
    ConfirmAlertBox(ModuleName, $("#RedirectToHome").val());
});