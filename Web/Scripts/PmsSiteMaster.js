var ConfirmMessage = 'Are You Sure You Want To Exit ?';
var ModuleName = "Site Master";
var Operation;
var vsiteLocation;
var vchildProject;
var vsitename;
var vpiname;
var vSiteNumber, nstudyno;
var nsiteNo;
var productIds = new Object();
var studynoId;
var ContactPerson; //added by dharini 27-01-2023
var ContactNumber; //added by dharini 27-01-2023
var EmailAddress; //added by dharini 27-01-2023

$(document).ready(function () {

    ContactPerson = document.getElementById('txtContactPerson'); //added by dharini 27-01-2023
    ContactNumber = document.getElementById('txtContactNumber'); //added by dharini 27-01-2023
    EmailAddress = document.getElementById('txtEmailAddress'); //added by dharini 27-01-2023

    $('#divAuditTrial').modal('hide');

    var GetAllPmsProjectNo = {
        Url: BaseUrl + "PmsProductBatch/GetProjectNo_New",
        SuccessMethod: "SuccessMethod",
    }

    $('#DDLProjectNoList').on('change keyup paste mouseup', function () {
        if ($('#DDLProjectNoList').val().length == 2) {
            var ProjectNoDataTemp = {
                vProjectNo: $('#DDLProjectNoList').val(),
                iUserId: $("#hdnuserid").val(),
                vProjectTypeCode: $("#hdnscopevalues").val(),
            }
            GetAllProjectNo(GetAllPmsProjectNo.Url, GetAllPmsProjectNo.SuccessMethod, ProjectNoDataTemp);
        }
        else if ($('#DDLProjectNoList').val().length < 2) {
            $("#DDLProjectNoList").autocomplete({
                source: "",
                change: function (event, ui) { },
                select: function (event, ui) {
                    vProjectNo = ui.item.value;
                    $('#DDLProjectNoList').val(vProjectNo);
                    AutoIncrementSiteNumber();
                },
            });
        }

    });
    GetSiteMasterDetails();
});

function AutoIncrementSiteNumber() {

    $.ajax({
        type: "GET",
        url: BaseUrl + "PmsSiteMaster/GetSiteChildCount",
        data: { id: productIds[$('#DDLProjectNoList').val()] },
        dataType: "json",
        async: false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Site Project not found.", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        var siteNo = $('#DDLProjectNoList').val().split('[')[1].split(']')[0].toString().trim();

        var str = "" + jsonData
        var pad = "00"
        var numberAppend = pad.substring(0, pad.length - str.length) + str;

        if (siteNo != undefined && siteNo != null) {
            $('#txtSiteNo').val(siteNo + "-" + numberAppend);
        }
    }
}


var GetAllProjectNo = function (Url, SuccessMethod, ProjectNoDataTemp) {
    $.ajax({
        url: Url,
        type: 'GET',
        data: { id: ProjectNoDataTemp.iUserId, projectno: ProjectNoDataTemp.vProjectNo, typecode: ProjectNoDataTemp.vProjectTypeCode },
        async: false,
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("Project not found.", "DDLProjectNoFrom", ModuleName);
        }
    });
    function SuccessMethod(jsonData) {
        var jsonObj = jsonData;
        var sourceArr = [];

        for (var i = 0; i < jsonObj.length; i++) {
            sourceArr.push("[ " + jsonObj[i].vStudyCode + " ]" + " " + jsonObj[i].vStudyName);
            productIds["[ " + jsonObj[i].vStudyCode + " ]" + " " + jsonObj[i].vStudyName] = jsonObj[i].nStudyNo;
        }

        $("#DDLProjectNoList").autocomplete({
            source: sourceArr,
            change: function (event, ui) { }
        });

    }
}



function GetSiteMasterDetails() {
    var Url = BaseUrl + "RecordFetcher/ExecuteDataTable";
    var ExecuteDataSetData = {
        Table_Name_1: "View_SiteMst",
        DataRetrieval_1: 2,
    }
    GetJsonData(ExecuteDataSetData);

    var ActivityDataset = [];
    for (var i = 0; i < jsonData.length; i++) {
        var InDataset = [];
        InDataset.push(jsonData[i].nSiteNo, jsonData[i].vSiteNumber, jsonData[i].vSiteName, jsonData[i].vSiteAddress, jsonData[i].vPIName, "", "", "", "", jsonData[i].cStatusIndi, jsonData[i].vStudyCode, jsonData[i].nStudyno, jsonData[i].ContactPerson, jsonData[i].ContactNumber, jsonData[i].EmailAddress);
        ActivityDataset.push(InDataset);
    }
    jsonData = "";
    var otableSiteDetails = $('#tblSiteMaster').dataTable({
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

            $('td:eq(4)', nRow).append('<center><a data-toggle="modal" title="Edit" data-options="splash-2 splash-ef-15" data-target="#SiteCreationModel" attrid="' + '" onclick="OperationEdit(this)" style="cursor:pointer;" nSiteNo="' + aData[0]
             + '" vSiteNumber="' + aData[1] + '" vStudyCode="' + aData[10] + '" vSiteName="' + aData[2] + '" vSiteAddress="' + aData[3] + '" vPIName="' + aData[4] + '"nStudyNo="' + aData[11] + '"ContactPerson="' + aData[12] + '"ContactNumber="' + aData[13] + '"EmailAddress="' + aData[14]
            + '" class="btn btn-primary btn-rounded btn-sm btn-ef btn-ef-5 btn-ef-5a mb-0"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a></center>');


            $('td:eq(5)', nRow).append('<center><a title="Inactive" data-toggle="modal" data-options="splash-2 splash-ef-15"  onclick="SiteInactive(this)" style="cursor:pointer;" nSiteNo="' + aData[0]
              + '" vSiteNumber="' + aData[1] + '" vStudyCode="' + aData[10] + '" vSiteName="' + aData[2] + '" vPIName="' + aData[4] + '" vSiteAddress="' + aData[3] + '"nStudyNo="' + aData[11] + '" <i class="btn btn-primary btn-sm btn-rounded btn-ef btn-ef-5 btn-ef-5a mb-10"><i class="fa fa-close"></i> <span>Inactive</span></a></div></center>');


            $('td:eq(6)', nRow).append('<center><a title="Audit" data-toggle="modal" data-options="splash-2 splash-ef-15" data-target="#SiteCreationModel" onclick="SiteAudit(this)" style="cursor:pointer;" nSiteNo="' + aData[0]
              + '" vSiteNumber="' + aData[1] + '" vStudyCode="' + aData[10] + '" vSiteName="' + aData[2] + '" vSiteAddress="' + aData[3] + '" vPIName="' + aData[4] + '"nStudyNo="' + aData[11] + '"ContactPerson="' + aData[12] + '"ContactNumber="' + aData[13] + '"EmailAddress="' + aData[14]
            + '" <i class="btn btn-primary btn-sm btn-rounded btn-ef btn-ef-5 btn-ef-5a mb-10"><i class="fa fa-close"></i> <span>Audit</span></a></div></center>');

            $('td:eq(7)', nRow).append('<center><a title="UserAttach" data-toggle="modal" data-options="splash-2 splash-ef-15" data-target="#UserAttachModel" onclick="Get_UserActivity(this)" style="cursor:pointer;" nSiteNo="' + aData[0]
              + '" vSiteNumber="' + aData[1] + '" vStudyCode="' + aData[10] + '" vSiteName="' + aData[2] + '" vSiteAddress="' + aData[3] + '" vPIName="' + aData[4] + '"nStudyNo="' + aData[11] + '"ContactPerson="' + aData[12] + '"ContactNumber="' + aData[13] + '"EmailAddress="' + aData[14]
            + '" <i class="btn btn-primary btn-sm btn-rounded btn-ef btn-ef-5 btn-ef-5a mb-10"><i class="fa fa-close"></i> <span>Attach</span></a></div></center>');

            if (aData[9] == 'D') {
                $(nRow).addClass('highlight');
                $('td', nRow).eq(5).addClass('disabled');
                $('td', nRow).eq(4).addClass('disabled');
                $('td', nRow).eq(7).addClass('disabled');
                $('td', nRow).eq(0).css('color', '#333');
                $('td', nRow).eq(1).css('color', '#333');
                $('td', nRow).eq(2).css('color', '#333');
                $('td', nRow).eq(4).addClass('disabled');
            }
        },



        "columnDefs": [
            { "bSortable": false, "targets": 0, "visible": false },
            { "bSortable": false, "targets": 5 },
        ],
        "aoColumns": [
            { "sTitle": "Site No" },
            { "sTitle": "Site Number" },
            { "sTitle": "Site Name" },
            { "sTitle": "Site Address" },
            { "sTitle": "PI Name" },
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
    $('#txtRemark').val('');
    //$("#txtStudyCode").attr('disabled', 'disabled');
    //$("#txtStudyName").attr('disabled', 'disabled');
    $("#DDLProjectNoList").attr('disabled', 'disabled');
    $("#txtSiteNo").attr('disabled', 'disabled');
    $('.AuditControl').each(function () { this.style.display = "none"; });
    $("#titleMode").text('Mode:-Edit');
    $("#txtSiteNo").val($(e).attr("vSiteNumber"));
    $("#txtSiteName").val($(e).attr("vSiteName"));
    $("#txtSiteAddress").val($(e).attr("vSiteAddress"));
    $("#txtPIName").val($(e).attr("vPIName"));
    $("#DDLProjectNoList").val($(e).attr("vStudyCode"));
    $("#txtContactPerson").val($(e).attr("ContactPerson")); //added by dharini 27-01-2023
    $("#txtContactNumber").val($(e).attr("ContactNumber"));  //added by dharini 27-01-2023
    $("#txtEmailAddress").val($(e).attr("EmailAddress"));  //added by dharini 27-01-2023
    nsiteNo = $(e).attr("nSiteNo");
    studynoId = $(e).attr("nStudyNo");
    document.getElementById("btnSaveSite").value = "Update";
    document.getElementById("btnSaveSite").title = "Update";
    $("#btnSaveSite").attr("style", "display:inline");
    $("#btnClearSiteDetails").attr("style", "display:inline");
}


$("#btnAddSite").on("click", function () {
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
    $('#divRemark').hide();
    $("#titleMode").text('Mode:-Add');
    document.getElementById("btnSaveSite").value = "Save"
    document.getElementById("btnSaveSite").title = "Save";
    $("#btnSaveSite").attr("style", "display:inline");
    $("#btnClearSiteDetails").attr("style", "display:inline");
    ClearTextBoxDetailPart();
});


$("#btnSaveSite").on("click", function () {
    btnOperaion = (document.getElementById("btnSaveSite").value).toLowerCase();
    if (validateform() == false) {
        return false;
    }

    if (productIds[$('#DDLProjectNoList').val()] != undefined) {
        studynoId = productIds[$('#DDLProjectNoList').val()];
    }



    if (btnOperaion == "save") {

        Operation = 1;
        var SaveSiteMasterData = {
            vRemark: '',
            nStudyNo: studynoId,
            iModifyBy: document.getElementById('hdnuserid').value,
            cStatusIndi: 'N',
            vSiteNumber: $('#txtSiteNo').val().replaceAll(/\s/g, ''),
            vSiteName: $('#txtSiteName').val().replaceAll(/\s/g, ''),
            vSiteAddress: $('#txtSiteAddress').val(),
            vPIName: $('#txtPIName').val(),
            DATAOPMODE: Operation,
            nParentStudyNo: studynoId,
            ContactPerson: $('#txtContactPerson').val(), //added by dharini 27-01-2023
            ContactNumber: $('#txtContactNumber').val(), //added by dharini 27-01-2023
            EmailAddress: $('#txtEmailAddress').val() //added by dharini 27-01-2023
        }

        SaveSiteMaster(BaseUrl + "PmsSiteMaster/save_SiteMaster", "SuccessMethod", SaveSiteMasterData);
    }
    else {
        if (btnOperaion == "update") {
            Operation = 2;
            var SaveSiteMasterData = {
                nStudyNo: nsiteNo,
                vRemark: $('#txtRemark').val(),
                iModifyBy: document.getElementById('hdnuserid').value,
                cStatusIndi: 'E',
                vStudyCode: $('#DDLProjectNoList').val(),
                vSiteNumber: $('#txtSiteNo').val(),
                vSiteName: $('#txtSiteName').val(),
                vSiteAddress: $('#txtSiteAddress').val(),
                vPIName: $('#txtPIName').val(),
                DATAOPMODE: Operation,
                nParentStudyNo: studynoId,
                ContactPerson: $('#txtContactPerson').val(), //added by dharini 27-01-2023
                ContactNumber: $('#txtContactNumber').val(), //added by dharini 27-01-2023
                EmailAddress: $('#txtEmailAddress').val() //added by dharini 27-01-2023

            }
            SaveSiteMaster(BaseUrl + "PmsSiteMaster/save_SiteMaster", "SuccessMethod", SaveSiteMasterData);
        }

    }
    ClearTextBoxDetailPart();
    $("#SiteCreationModel").modal('hide');
    GetSiteMasterDetails();
});


var SaveSiteMaster = function (Url, SuccessMethod, Data) {
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
        SuccessorErrorMessageAlertBox(response, ModuleName);
        //location.reload();
    }
};


function validateform() {

    if (Dropdown_Validation(document.getElementById("DDLProjectNoList"))) {
        ValidationAlertBox("Please select Project.", "DDLProjectNoList", ModuleName);
        return false;
    }
    if (isBlank(document.getElementById('txtSiteNo').value)) {
        ValidationAlertBox("Please enter site no !", "txtSiteNo", ModuleName);
        return false;
    }
    if (isBlank(document.getElementById('txtSiteName').value)) {
        ValidationAlertBox("Please enter site name !", "txtSiteName", ModuleName);
        return false;
    }
    if (isBlank(document.getElementById('txtSiteAddress').value)) {
        ValidationAlertBox("Please enter site Address !", "txtSiteAddress", ModuleName);
        return false;
    }
    if (isBlank(document.getElementById('txtPIName').value)) {
        ValidationAlertBox("Please enter PI name !", "txtPIName", ModuleName);
        return false;
    }
    if (btnOperaion == "update") {
        if (isBlank(document.getElementById('txtRemark').value)) {
            ValidationAlertBox("Please Enter Remark !", "txtRemark", ModuleName);
            return false;
        }
    }
    if (btnOperaion == "save") {
        var rows = $("#tblSiteMaster").dataTable().fnGetNodes();
        var StudyName = $("#DDLProjectNoList").val().split('[')[1].split(']')[0].replaceAll(/\s/g, '').trim();
        var SiteNumber = ($("#txtSiteNo").val()).replaceAll(/\s/g, '').trim();
        var rowsData = $("#tblSiteMaster").dataTable().fnGetData();

        for (i = 0; i < rows.length; i++) {
            if (SiteNumber.toUpperCase() == $(rows[i]).find("td:eq(0)").html().trim().toUpperCase()) {
                if (rowsData[i][8] != 'D') {
                    ValidationAlertBox("This site already exists", "txtSiteNo", ModuleName);
                    return false;
                    break;
                }
            }
            if (SiteNumber == StudyName) {
                ValidationAlertBox("Site name and study number can not be same", "txtSiteNo", ModuleName);
                return false;
                break;
            }
        }
    }
    return true;
}


function SiteInactive(e) {
    $('#txtSiteRemark').val('');
    nsiteNo = $(e).attr("nsiteno");
    vsiteLocation = $(e).attr("vsiteaddress");
    vsitename = $(e).attr("vsitename");
    vSiteNumber = $(e).attr("vsitenumber");
    vpiname = $(e).attr("vpiname");
    nstudyno = $(e).attr("nstudyno");
    $("#SiteRemarkModal").modal('show');
    document.getElementById("btnSaveSite").value = "Inactive"
    document.getElementById("btnSaveSite").title = "Inactive";
}


$("#btnInActiveSave").on("click", function () {

    if (isBlank(document.getElementById('txtSiteRemark').value)) {
        ValidationAlertBox("Please enter remark !", "txtSiteRemark", ModuleName);
        return false;
    }
    else {
        Operation = 3;
        var SaveSiteMasterData =
            {
                //nSiteNo: nsiteNo,
                vSiteAddress: vsiteLocation,
                vsitename: vsitename,
                vSiteNumber: vSiteNumber,
                vpiname: vpiname,
                nStudyNo: nsiteNo,
                vRemark: $('#txtSiteRemark').val(),
                iModifyBy: document.getElementById('hdnuserid').value,
                cStatusIndi: 'D',
                DATAOPMODE: Operation
            }
        SaveSiteMaster(BaseUrl + "PmsSiteMaster/save_SiteMaster", "SuccessMethod", SaveSiteMasterData);
        GetSiteMasterDetails();
    }
});


function SiteFieldWiseAuditTrail(e) {

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
        vIdValue: nsiteNo,
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


function SiteAudit(e) {
    $('#divRemark').show();
    $("#DDLProjectNoList").attr('disabled', 'disabled');
    $("#txtSiteNo").attr('disabled', 'disabled');
    $("#txtSiteName").attr('disabled', 'disabled');
    $("#txtSiteAddress").attr('disabled', 'disabled');
    $("#txtPIName").attr('disabled', 'disabled');
    $("#txtRemark").attr('disabled', 'disabled');
    $('.AuditControl').each(function () { this.style.display = "inline"; });
    $("#titleMode").text('Mode:-Audit');
    $(vsiteLocation).val($(e).attr("vSiteLocation"));
    $(vchildProject).val($(e).attr("vChildProject"));

    $("#txtSiteNo").val($(e).attr("vSiteNumber"));
    $("#txtSiteName").val($(e).attr("vSiteName"));
    $("#txtSiteAddress").val($(e).attr("vSiteAddress"));
    $("#txtPIName").val($(e).attr("vPIName"));
    $("#DDLProjectNoList").val($(e).attr("vStudyCode"));

    nsiteNo = $(e).attr("nSiteNo");
    $('#divRemark').hide();
    document.getElementById("btnSaveSite").value = "Audit";
    document.getElementById("btnSaveSite").title = "Audit";
    $("#btnSaveSite").attr("style", "display:none");
    $("#btnClearSiteDetails").attr("style", "display:none");
    $("#txtContactPerson").val($(e).attr("ContactPerson"));
    $("#txtContactNumber").val($(e).attr("ContactNumber"));
    $("#txtEmailAddress").val($(e).attr("EmailAddress"));

}

function ClearTextBoxDetailPart() {

    if (Operation == "save") {
        $("#txtSiteNo")[0].value = "";
        $("#txtSiteName")[0].value = "";
        $("#txtSiteAddress")[0].value = "";
        $("#txtPIName")[0].value = "";
        $('#DDLProjectNoList').val('');
        $("#txtContactPerson")[0].value = "";
        $("#txtEmailAddress")[0].value = "";
        $("#txtContactNumber")[0].value = "";
    }
    else if (Operation == "update") {
        //$('#ddlProjectNo').val('');
        $('#txtSiteName').val("");
        $('#txtSiteAddress').val("");
        $('#txtPIName').val("");
        $('#txtRemark').val('');
        $('#txtContactPerson').val('');
        $('#txtEmailAddress').val('');
        $('#txtContactNumber').val('');
    }
    else {
        $("#txtSiteNo")[0].value = "";
        $("#txtSiteName")[0].value = "";
        $("#txtSiteAddress")[0].value = "";
        $("#txtPIName")[0].value = "";
        $("#txtContactPerson")[0].value = "";
        $("#txtEmailAddress")[0].value = "";
        $("#txtContactNumber")[0].value = "";
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

$("#btnClearSiteDetails").on("click", function () {
    ClearTextBoxDetailPart();
});

$("#btnExitSiteDetails").on("click", function () {
    //var result = confirm(ConfirmMessage);
    //if (result) {
    //    $("#SiteCreationModel").modal('hide');
    //}
    //else {
    //    return false;
    //}
    ConfirmAlertBox(ModuleName, $("#RedirectToHome").val());
});

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