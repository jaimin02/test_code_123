var ConfirmMessage = 'Are You Sure You Want To Exit ?';
var iUserId, nSiteNo, vSiteName, vDeptCode, vDeptName, vFirstName, vLastName, vLoginName, vEmailId, vPhoneNo, vExtNo, vRemark,
txtNewPass, txtConfirmPass, cStatusIndi, nUserTypeNo, cIsAdAuth, vADName, vScopeName, vUserName, iuseridActive, vLoginPassActive, cStatusIndi,vOperation;

$(document).ready(function () {
    iUserId = null;
    $('#UserDetailsModel').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('#divAuditTrial').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('#UserDetailsModel').modal('hide')
    $('#divAuditTrial').modal('hide')

    vFirstName = document.getElementById('txtFirstName');
    vLastName = document.getElementById('txtLastName');
    vUserName = document.getElementById('txtUserName');
    vLoginName = document.getElementById('txtUserName');
    vEmailId = document.getElementById('txtEmailId');
    vPhoneNo = document.getElementById('txtPhoneNo');
    vExtNo = document.getElementById('txtExtNo');
    vRemark = document.getElementById('txtRemarks');
    txtNewPass = document.getElementById('txtNewPass');
    txtConfirmPass = document.getElementById('txtConfirmPass');
    vADName = document.getElementById('txtAdName');
    $('#lblIsMFSEmail').hide();
    $('#lblIsMFASMS').hide();
    $('#chkIsMFSEmail').hide();
    $('#chkIsMFASMS').hide();
    $('#chkIsMFSEmail').prop('checked', false);
    $('#chkIsMFASMS').prop('checked', false);
    $('#ddlUserType').multiselect({
        nonSelectedText: 'Please Select User Type',
        buttonClass: 'form-control',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        numberDisplayed: 1,
    });

    GetDepartmentList();
    GetScopeList();
    GetUserDetails();
    GetLocationList();
    GetUserTypeList();
});


$('#chkIsAdActive').change(function () {

    $("#txtAdName").prop("disabled", !$(this).is(':checked'));
});


function ShowHideUserDetails() {

    var ExecuteDataSetData = {
        Table_Name_1: "ParameterListMst",
        DataRetrieval_1: 3,
        WhereCondition_1: "nParameterId = " + 4
    }
    jsonData = "";
    GetJsonData(ExecuteDataSetData);
    var jsonObj = jsonData;
    if (jsonObj.length != 0) {
        if (jsonObj[0].vParameterValue == "Y") {
            $("#chkIsAdActive").show();
            $(document.getElementsByClassName("divAdUser")).show();
        }
    }
}


function GetDepartmentList() {
    jsonData = "";
    var ExecuteDataSetData = {
        Table_Name_1: "DeptMst",
        WhereCondition_1: "cStatusIndi <> 'C'",
        DataRetrieval_1: 3,
    }
    GetJsonData(ExecuteDataSetData);
    $("#ddlDepartment").empty();
    for (var i = 0; i < jsonData.length; i++) {
        $("#ddlDepartment").append($("<option></option>").val(jsonData[i].nDeptNo).html(jsonData[i].vDeptName));

    }
}

function GetLocationList() {
    jsonData = "";
    var ExecuteDataSetData = {
        Table_Name_1: "LocationMst",
        WhereCondition_1: "cStatusIndi <> 'C'",
        DataRetrieval_1: 3,
    }
    GetJsonData(ExecuteDataSetData);
    $("#ddlLocation").empty();
    for (var i = 0; i < jsonData.length; i++) {
        $("#ddlLocation").append($("<option></option>").val(jsonData[i].nLocationNo).html(jsonData[i].vLocationName));

    }
}


function GetUserTypeList() {
    jsonData = "";
    var ExecuteDataSetData = {
        Table_Name_1: "UserTypeMst",
        WhereCondition_1: "cStatusIndi <> 'C'",
        DataRetrieval_1: 3,
    }
    GetJsonData(ExecuteDataSetData);

    //$('#ddlUserType option').each(function () {
    //    $(this).remove();
    //});

    if (jsonData.length > 0) {
        $("#ddlUserType").empty();
        for (var i = 0; i < jsonData.length; i++) {
            $("#ddlUserType").append($("<option></option>").val(jsonData[i].vUserTypeCode).html(jsonData[i].vUserTypeName));
            $('#ddlUserType').multiselect('rebuild');
        }
    }
}

function GetScopeList() {
    jsonData = "";
    var ExecuteDataSetData = {
        Table_Name_1: "ScopeMst",
        WhereCondition_1: "cStatusIndi <> 'C'",
        DataRetrieval_1: 3,
    }
    GetJsonData(ExecuteDataSetData);
    $("#ddlScope").empty();
    for (var i = 0; i < jsonData.length; i++) {
        $("#ddlScope").append($("<option></option>").val(jsonData[i].nScopeNo).html(jsonData[i].vScopeName));

    }
}


function GetUserDetails() {

    var Url = BaseUrl + "RecordFetcher/ExecuteDataTable";
    var ExecuteDataSetData = {
        Table_Name_1: "View_UserMstHdr",
        DataRetrieval_1: 2,
    }
    GetJsonData(ExecuteDataSetData);

    var ActivityDataset = [];
    for (var i = 0; i < jsonData.length; i++) {
        var InDataset = [];
        InDataset.push('', jsonData[i].vFirstName, jsonData[i].vLastName, jsonData[i].vLoginName, jsonData[i].vEmailId, jsonData[i].vPhoneNo,
       jsonData[i].vExtNo, jsonData[i].vDeptName, jsonData[i].vScopeName, '', jsonData[i].vDeptCode, jsonData[i].nScopeNo, jsonData[i].UserType, jsonData[i].isMFA
       , jsonData[i].isMFAEmail, jsonData[i].isMFASms);
        ActivityDataset.push(InDataset);
    }
    jsonData = "";
    var otableSiteDetails = $('#tblUserDetailsData').dataTable({
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
        //"sScrollX": "100%",
        //"sScrollXInner": "1600" /* It varies dynamically if number of columns increases */,
        "fnCreatedRow": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {

            $('td:eq(0)', nRow).append('<a title="Scrop" attrid="' + aData[1]
            + '" Onclick=ShowScrop(this) style="cursor:pointer;" vLoginName="' + aData[3] + '" class="icons-list"><div><i class="fa fa-plus-square"></i></div></a>');



            $('td:eq(9)', nRow).append('<center><a data-toggle="modal" title="Edit" data-options="splash-2 splash-ef-15" data-target="#UserDetailsModel" attrid="' + aData[1]
            + '" onclick="UserEdit(this)" style="cursor:pointer;" vFirstName="' + aData[1] + '" vLastName="' + aData[2] + '" vLoginName="' + aData[3]
            + '" vEmailId="' + aData[4] + '" vPhoneNo="' + aData[5] + '" vExtNo="' + aData[6] + '" vDeptName="' + aData[7] + '" vScopeName="' + aData[8]
            + '" vDeptCode="' + aData[10] + '" nScopeNo="' + aData[11] + '" UserType="' + aData[12] + '" isMFA="' + aData[13] + '" isMFAEmail="' + aData[14] + '" isMFASms="' + aData[15]
            + '" class="btn btn-sm btn-primary btn-rounded btn-sm btn-ef btn-ef-5 btn-ef-5a mb-0"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a></center>');

        },
        "columnDefs": [
            {
                "targets": [10, 11, 12,13,14,15],
                "visible": false,
                "searchable": false
            },

        ],
        "aoColumns": [
            { "sTitle": "" },
            { "sTitle": "First Name" },
            { "sTitle": "Last Name" },
            { "sTitle": "User Name" },
            { "sTitle": "Email Id" },
            { "sTitle": "Phone No." },
            { "sTitle": "Ext No." },
            { "sTitle": "Department" },
            { "sTitle": "Scope" },
            { "sTitle": "Edit" },
            { "sTitle": "" },
            { "sTitle": "" },
            { "sTitle": "" },
            { "sTitle": "" },
            { "sTitle": "" },
            { "sTitle": "" },

        ],
        "oLanguage": {
            "sEmptyTable": "No Record Found",
        },
    });

}


$("#btnAddUser").on("click", function () {
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
    $('#txtUserName').val('');
    $('.AuditControl').each(function () { this.style.display = "none"; });
    ClearTextBoxDetailPart();
    jQuery("#titleMode").text('Mode:-Add');
    document.getElementById("btnSaveUserDetails").value = "Save"
    document.getElementById("btnSaveUserDetails").title = "Save";
    //$("#btnSaveUserDetails").attr("disabled", true);
    $("#btnSaveUserDetails").attr("style", "display:inline");
    $("#btnClearUserDetails").attr("style", "display:inline");
    $(document.getElementsByClassName("divRemarkUser")).hide();
    $("#divRemarklbl")[0].style.display = 'none';
    $("#divRemarktxt")[0].style.display = 'none';
});

$("#btnSaveUserDetails").on("click", function () {

    var Operation;
    var btnOperaion = (document.getElementById("btnSaveUserDetails").value).toLowerCase();
    vOperation = btnOperaion;
    if (validateform() == false) {
        return false;
    }
   
    cIsAdAuth = 'Y';
    //for (var i = 0; i < $(ddlUserType).val().length; i++) {


    if (btnOperaion == "save") {

        Operation = 1;

        var SaveUserMasterData = {
            nUserTypeNo: 0,
            vFirstName: $.trim(vFirstName.value),
            vLastName: $.trim(vLastName.value),
            vUserName: $.trim(txtUserName.value),
            vLoginName: $.trim(vLoginName.value),
            vLoginPass: $.trim(vLoginName.value),
            nScopeNo: $.trim($(ddlScope).val().toString()),
            //vUserTypeCode: $.trim($(ddlUserType).val()[i].toString()),
            vEmailId: $.trim(vEmailId.value),
            vPhoneNo: $.trim(vPhoneNo.value),
            vExtNo: $.trim(vExtNo.value),
            cLockFlag: 'N',
            nCreatedBy: $("#hdnuserid").val(),
            iModifyBy: $("#hdnuserid").val(),
            cStatusIndi: 'N',
            DATAOPMODE: Operation,
            cIsAdAuth: cIsAdAuth,
            vDeptCode: $.trim($(ddlDepartment).val().toString()),
            vLocationCode: $.trim($(ddlLocation).val().toString()),
            vRemark: $.trim(vRemark.value),
            isMFA : $('#chkIsMFA').is(":checked") == true ? "Y" : "N",
            isMFAEmail : $('#chkIsMFSEmail').is(":checked") == true ? "Y" : "N",
            isMFASms : $('#chkIsMFASMS').is(":checked") == true ? "Y" : "N",
            //vADName: $.trim(vADName.value)
        }

        for (var iIndex = 0; iIndex < $(ddlUserType).val().length; iIndex++) {
            SaveUserMasterData["vUserTypeCode"] = $(ddlUserType).val()[iIndex]
            SaveUserMaster(BaseUrl + "PmsUserMaster/InsertDataUserMaster", "SuccessMethod", SaveUserMasterData);
        }

    }
    else {
        Operation = 2;

        var SaveUserMasterData = {
            nUserTypeNo: 0,
            iUserId: $.trim(iUserId),
            vFirstName: $.trim(vFirstName.value),
            vLastName: $.trim(vLastName.value),
            vUserName: $.trim(txtUserName.value),
            vLoginName: $.trim(vLoginName.value),
            vLoginPass: $.trim(vLoginName.value),
            nScopeNo: $.trim($(ddlScope).val().toString()),
            //vUserTypeCode: $.trim($(ddlUserType).val()[i].toString()),
            vEmailId: $.trim(vEmailId.value),
            vPhoneNo: $.trim(vPhoneNo.value),
            vExtNo: $.trim(vExtNo.value),
            cLockFlag: 'N',
            nCreatedBy: $("#hdnuserid").val(),
            iModifyBy: $("#hdnuserid").val(),
            cStatusIndi: 'E',
            DATAOPMODE: Operation,
            cIsAdAuth: cIsAdAuth,
            vDeptCode: $.trim($(ddlDepartment).val().toString()),
            vLocationCode: $.trim($(ddlLocation).val().toString()),
            vRemark: $.trim(vRemark.value),
            isMFA: $('#chkIsMFA').is(":checked") == true ? "Y" : "N",
            isMFAEmail: $('#chkIsMFSEmail').is(":checked") == true ? "Y" : "N",
            isMFASms: $('#chkIsMFASMS').is(":checked") == true ? "Y" : "N",
            // vADName: $.trim(vADName.value)
        }


        var arrayAllProfile = [];
        var arrayAllProfile = $('#ddlUserType').children('option').map(function (i, e) {
            return e.value || e.innerText;
        }).get();

        for (var i = 0; i < $(ddlUserType).val().length; i++) {
            index = arrayAllProfile.indexOf($(ddlUserType).val()[i]);
            if (index > -1) {
                arrayAllProfile.splice(index, 1);
            }
        }

        if (arrayAllProfile != null) {
            if (arrayAllProfile.length > 0) {
                for (var iIndex = 0; iIndex < $(arrayAllProfile)[iIndex]; iIndex++) {

                    SaveUserMasterData["vUserTypeCode"] = $(arrayAllProfile)[iIndex]
                    SaveUserMasterData["cStatusIndi"] = "C";
                    SaveUserMasterData["DATAOPMODE"] = 2;
                    SaveUserMaster(BaseUrl + "PmsUserMaster/InsertDataUserMaster", "SuccessMethod", SaveUserMasterData);

                }
            }
        }

        for (var iIndex = 0; iIndex < $(ddlUserType).val().length; iIndex++) {
            SaveUserMasterData["nUserTypeNo"] = $(ddlUserType).val()[iIndex]
            SaveUserMasterData["cStatusIndi"] = "E";
            SaveUserMasterData["vUserTypeCode"] = $(ddlUserType).val()[iIndex]
            SaveUserMasterData["DATAOPMODE"] = 2;
            SaveUserMaster(BaseUrl + "PmsUserMaster/InsertDataUserMaster", "SuccessMethod", SaveUserMasterData);

        }

    }
    //ValidationAlertBox("User details saved Successfully.", "User Master");
    if (Operation == 1) {
        SuccessorErrorMessageAlertBox("User details saved Successfully.", "User Master");
    }
    else if (Operation == 2)
    {
        SuccessorErrorMessageAlertBox("User details updated Successfully.", "User Master");
    }

    ClearTextBoxDetailPart();
    $("#UserDetailsModel").modal("hide");
    GetUserDetails();
});

$("#btnClearUserDetails").on("click", function () {
    ClearTextBoxDetailPart();
});

$("#btnExitUserDetails").on("click", function () {
    var result = confirm(ConfirmMessage);
    if (result) {
        $("#UserDetailsModel").modal("hide");
    }
    else {
        return false;
    }
});

function ClearTextBoxDetailPart() {
    vFirstName.value = ""
    vLastName.value = ""
    // vLoginName.value = ""
    vLoginName.value = (document.getElementById("btnSaveUserDetails").value).toLowerCase() == "save" ? vLoginName.value = "" : vLoginName.value
    vEmailId.value = ""
    vPhoneNo.value = ""
    vExtNo.value = ""
    vRemark.value = ""
    //document.getElementById('chkIsAdActive').checked = false;
    // vADName.value = "";   
    $(txtNewPass).val("");
    $(txtConfirmPass).val("");
    $("#ddlUserType").multiselect("clearSelection");
    $("#ddlUserType").multiselect('refresh');
    $('#btnChangePass').prop('disabled', true);

    $('#lblIsMFSEmail').hide();
    $('#lblIsMFASMS').hide();
    $('#chkIsMFSEmail').hide();
    $('#chkIsMFASMS').hide();
    $('#chkIsMFSEmail').prop('checked', false);
    $('#chkIsMFASMS').prop('checked', false);
    $('#chkIsMFA').prop('checked', false);

    //$('#btnSaveUserDetails').prop('disabled', true);
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

function ShowScrop(e) {

    if ($(e.children).find("i").hasClass("fa fa-plus-square")) {
        $(e.children).find("i").removeClass("fa fa-plus-square");
        $(e.children).find("i").addClass("fa fa-minus-square");
        var Url = BaseUrl + "RecordFetcher/ExecuteDataTable";
        var ScropExecuteDataSetData = {
            Table_Name_1: "View_UserMst",
            WhereCondition_1: "vLoginName='" + $(e).attr("vLoginName") + "'",
            DataRetrieval_1: 3,
        }

        var AuditTrail = "";
        GetJsonData(ScropExecuteDataSetData);
        if (jsonData.length > 0) {
            var ScropActivityDataset = [];
            var InDatasetFound = [];
            for (var i = 0; i < jsonData.length; i++) {
                var InDataset = [];

                AuditTrail = '<center><a title="Audit Trail" data-toggle="modal" data-options="splash-2 splash-ef-15" data-target="#UserDetailsModel" attrid="' + jsonData[i].iUserId
                             + '" onclick="UserAuditTrail(this)" style="cursor:pointer;" vFirstName="' + jsonData[i].vFirstName + '" vLastName="' + jsonData[i].vLastName + '" vLoginName="' + jsonData[i].vLoginName
                            + '" vEmailId="' + jsonData[i].vEmailId + '" vPhoneNo="' + jsonData[i].vPhoneNo + '" vExtNo="' + jsonData[i].vExtNo
                            + '" vDeptName="' + jsonData[i].vDeptName + '"vScopeName="' + jsonData[i].vScopeName + '"vDeptCode="' + jsonData[i].vDeptCode + '"nScopeNo="' + jsonData[i].nScopeNo
                            + '"iUserId="' + jsonData[i].iUserId + '" vUserTypeCode="' + jsonData[i].vUserTypeCode + '" vUserTypeName="' + jsonData[i].vUserTypeName + '" vADName="' + jsonData[i].vADName + '" cIsAdAuth="' + jsonData[i].cIsAdAuth + '"cStatusIndi="' + jsonData[i].cStatusIndi
                             + '" class="btn btn-primary btn-sm btn-rounded btn-ef btn-ef-5 btn-ef-5a mb-0"><i class="fa fa-list"></i> <span>Audit</span></a></center>';

                // if (jsonData[i].cStatusIndi != "C") {
                InDataset.push(jsonData[i].iUserId, jsonData[i].vUserTypeName, '', '', '', jsonData[i].cStatusIndi, jsonData[i].vLoginPass, AuditTrail, jsonData[i].cBlockedFlag);
                if (JSON.stringify(ScropActivityDataset) == "[]") {
                    ScropActivityDataset.push(InDataset);
                    InDatasetFound.push(jsonData[i].vUserTypeName);
                }
                else if (JSON.stringify(InDatasetFound).indexOf(jsonData[i].vUserTypeName) == -1) {
                    ScropActivityDataset.push(InDataset);
                    InDatasetFound.push(jsonData[i].vUserTypeName);
                }
                //}
            }
            jsonData = "";

            var rowIndex = $(e).parent().parent().closest('tr').prevAll().length;
            var scroll;
            var $tr = $('.dataTable[id$="tblUserDetailsData"]').get(0).insertRow(rowIndex + 2)
            var $td = $('<td>', { colspan: "14" }).appendTo($tr);
            var $div = $('<div class="row">').appendTo($td);
            var $div1 = $('<div class="col-sm-12">').appendTo($div);
            var $table = $('<table align=Left id="' + $(e).attr("vFirstName") + '" class="table table-striped table-bordered" cellspacing="0" cellpadding="0" border="0" width="100%">').appendTo($div1)

            var otableScropDetails = $('#' + $(e).attr("vFirstName")).dataTable({
                "bLengthChange": true,
                "iDisplayLength": 10,
                "bProcessing": true,
                "autoWidth": false,
                "bSort": false,
                "searching": false,
                "paging": false,
                "aaData": ScropActivityDataset,
                "bInfo": false,
                "bDestroy": true,
                "responsive": true,
                "sScrollX": "100%",
                "sScrollXInner": "1200" /* It varies dynamically if number of columns increases */,
                "fnCreatedRow": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    if (aData[8] == 'B' || aData[5] == 'C') {
                        $('td:eq(1)', nRow).append('<center>Reset Password</center>');
                        //$('td:eq(2)', nRow).append('<center><a title="Active" onclick="UserInactive(this)" class="icons-list" vLoginPass="' + aData[7]
                        //    + '" cStatusIndi="' + aData[5] + '" iUserId="' + aData[0] + '"><div class="size-30x30"><i class="fa fa-check-circle"></i></div></a></center>');

                        $('td:eq(2)', nRow).append('<center><a title="Active" onclick="UserInactive(this)" class="icons-list" vLoginPass="' + aData[6]
                                + '" cStatusIndi="' + aData[5] + '" iUserId="' + aData[0] + '"><div><i class="btn btn-primary btn-sm btn-rounded btn-ef btn-ef-5 btn-ef-5a mb-10"><i class="fa fa-check-circle"></i> <span>Active</span></a></div></a></center>');

                        $('td:eq(3)', nRow).append('<center>Unlock</center>');
                        $(nRow).addClass('highlight');
                    }
                    else {
                        $('td:eq(2)', nRow).append('<center><a title="Inactive" onclick="UserInactive(this)" class="icons-list" vLoginPass="' + aData[6]
                            + '" cStatusIndi="' + aData[5] + '" iUserId="' + aData[0] + '"><div><i class="btn btn-primary btn-sm btn-rounded btn-ef btn-ef-5 btn-ef-5a mb-10"><i class="fa fa-close"></i> <span>Inactive</span></a></div></a></center>');
                        if (aData[6] == 'Y') {
                            $('td:eq(3)', nRow).append('<center><a href="" onclick="UserUnlock(this)" vLoginPass="' + aData[6]
                            + '" cStatusIndi="' + aData[5] + '" iUserId="' + aData[0] + '">Unlock</a></center>');
                            $('td:eq(1)', nRow).append('<center>Reset Password</center>');
                        }
                        else {
                            $('td:eq(3)', nRow).append('<center>Unlock</center>');
                            $('td:eq(1)', nRow).append('<center><a href="" data-toggle="modal" data-options="splash-2 splash-ef-15" data-target="#divChangePassword" onClick="iUserId=' + aData[0]
                           + '">Reset Password</a></center>');
                        }
                    }

                },
                "columnDefs": [
                    {
                        "targets": [0, 5, 6],
                        "visible": false,
                        "searchable": false
                    }
                ],
                "aoColumns": [
                    { "sTitle": "User No" },
                    { "sTitle": "Profile" },
                    { "sTitle": "Reset Password" },
                    { "sTitle": "Active/Inactive" },
                    { "sTitle": "Unlock" },
                    { "sTitle": "Status Indi" },
                    { "sTitle": "Unlock" },
                    { "sTitle": "Audit Trail" },
                ],
                "oLanguage": {
                    "sEmptyTable": "No Record Found",
                },
            });

        }
    }
    else {
        $(e).parent().parent().next().children().children().fadeOut('slow', function () {
            setTimeout($(e).parent().parent().next().remove(), 10);
        });
        $(e.children).find("i").removeClass("fa fa-minus-square");
        $(e.children).find("i").addClass("fa fa-plus-square");
    }

}

function validateform() {

    var email = document.getElementById("txtEmailId").value;
    var expr = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


    if (isBlank(document.getElementById('txtFirstName').value)) {
        ValidationAlertBox('Please Enter First Name', "txtFirstName", "User Master");
        return false;
    }

    if (isBlank(document.getElementById('txtLastName').value)) {
        ValidationAlertBox('Please Enter Last Name', "txtLastName", "User Master");
        return false;
    }

    if (isBlank(document.getElementById('txtUserName').value)) {
        ValidationAlertBox('Please Enter User Name', "txtUserName", "User Master");
        return false;
    }

    if (isBlank(email))
    {
        ValidationAlertBox("Please enter email address.", "", "User Master");
        return false;
    }
    if (!expr.test(email))
    {
        ValidationAlertBox("Invalid email address.", "", "User Master");
        return false;
    }

    if (isBlank(document.getElementById('txtPhoneNo').value)) {
        ValidationAlertBox('Please Enter Phone No', "txtPhoneNo", "User Master");
        return false;
    }

    if (isBlank(document.getElementById('ddlScope').value)) {
        ValidationAlertBox('Please select Scrop.', "ddlScope", "User Master");
        return false;
    }

    if (isBlank(document.getElementById('ddlDepartment').value)) {
        ValidationAlertBox('Please select Department.', "ddlDepartment", "User Master");
        return false;
    }
    if ((document.getElementById("btnSaveUserDetails").value).toLowerCase() != "save") {
        if (isBlank(document.getElementById('txtRemarks').value)) {
            ValidationAlertBox('Please Enter Remarks.', "txtRemarks", "User Master");
            return false;
        }
    }
    
        var rows = $("#tblUserDetailsData").dataTable().fnGetNodes();
        for (i = 0; i < rows.length; i++) {
            if (vLoginName.value.toUpperCase() == $(rows[i]).find("td:eq(3)").html().trim().toUpperCase() && vOperation == 'save') {
                //alert("User Name already exist.")
                ValidationAlertBox('User Name already exist.', "txtUserName", "User Master");
                return false;
                break;
            }
        }
    
    return true;
}

function SaveUserMaster(Url, SuccessMethod, Data) {
    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        async: false,
        success: SuccessInsertData,
        error: function () {
            SuccessorErrorMessageAlertBox("Error while saving details of User Masters.", "User Master");
        }
    });

    function SuccessInsertData(response) {
        //SuccessorErrorMessageAlertBox(response, "User Master");
        //if (response[0].strMessage == null)
        //    return false
        //else
        //alert(response[0].strMessage);
    }
};

function UserEdit(e) {

    $("#divRemarklbl")[0].style.display = 'block';
    $("#divRemarktxt")[0].style.display = 'block';

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

    $('.AuditControl').each(function () { this.style.display = "none"; });
    jQuery("#titleMode").text('Mode:-Edit');
    iUserId = $(e).attr("iUserId");
    $(vFirstName).val($(e).attr("vFirstName"));
    $(vLastName).val($(e).attr("vLastName"));
    $(vLoginName).val($(e).attr("vLoginName"));
    $(vEmailId).val($(e).attr("vEmailId"));
    $(vPhoneNo).val($(e).attr("vPhoneNo"));
    $(vExtNo).val($(e).attr("vExtNo"));
    $(vADName).val($(e).attr("vADName"));
    if ($(e).attr("isMFA") == 'Y') {
        $('#chkIsMFA').prop('checked', true);
        $('#lblIsMFSEmail').show();
        $('#lblIsMFASMS').show();
        $('#chkIsMFSEmail').show();
        $('#chkIsMFASMS').show();
    }
    else
    {
        $('#chkIsMFA').prop('checked', false);
        $('#lblIsMFSEmail').hide();
        $('#lblIsMFASMS').hide();
        $('#chkIsMFSEmail').hide();
        $('#chkIsMFASMS').hide();
    }
    if ($(e).attr("isMFAEmail") == 'Y') {
        $('#chkIsMFSEmail').prop('checked', true);
    }
    else {
        $('#chkIsMFSEmail').prop('checked', false);
    }
    if ($(e).attr("isMFASms") == 'Y') {
        $('#chkIsMFASMS').prop('checked', true);
    }
    else {
        $('#chkIsMFASMS').prop('checked', false);
    }
    cIsAdAuth = 'Y';
    $('#txtRemarks').val('');
    $(vLoginName).attr("disabled", true);
    document.getElementById("btnSaveUserDetails").value = "Update";
    document.getElementById("btnSaveUserDetails").title = "Update";

    $("#btnSaveUserDetails").attr("style", "display:inline");
    $("#btnClearUserDetails").attr("style", "display:inline");
    $(document.getElementsByClassName("divRemarkUser")).show();

    dataDept = $(e).attr("vdeptcode");
    var dataarray = dataDept.split(",");
    $("#ddlDepartment")[0].value = dataarray;

    dataScrop = $(e).attr("nScopeNo");
    var dataarrays = dataScrop.split(",");
    $("#ddlScope")[0].value = dataarrays;

    dataUsertype = $(e).attr("UserType");
    var dataarrays = dataUsertype.split(",");
    // $("#ddlUserType")[0].value = dataarrays;
    $("#ddlUserType").multiselect("clearSelection");
    $("#ddlUserType").val(dataarrays);
    $("#ddlUserType").multiselect("refresh");

}


$('#chkIsMFA').change(function () {

    if ($('#chkIsMFA').is(":checked") == true)
    {
        $('#lblIsMFSEmail').show();
        $('#lblIsMFASMS').show();
        $('#chkIsMFSEmail').show();
        $('#chkIsMFASMS').show();
    }
    else
    {
        $('#lblIsMFSEmail').hide();
        $('#lblIsMFASMS').hide();
        $('#chkIsMFSEmail').hide();
        $('#chkIsMFASMS').hide();
        $('#chkIsMFSEmail').prop('checked', false);
        $('#chkIsMFASMS').prop('checked', false);
    }
});
function UserAuditTrail(e) {
    $('.form-control').each(function () {
        if ($(this)[0].id != "txtNewPass" && $(this)[0].id != "txtConfirmPass")
            $(this).attr('disabled', true);
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
    $('.AuditControl').each(function () { this.style.display = "inline"; });
    jQuery("#titleMode").text('Audit Trail');
    iUserId = $(e).attr("iUserId");
    $(vFirstName).val($(e).attr("vFirstName"));
    $(vLastName).val($(e).attr("vLastName"));
    $(vLoginName).val($(e).attr("vLoginName"));
    $(vEmailId).val($(e).attr("vEmailId"));
    $(vPhoneNo).val($(e).attr("vPhoneNo"));
    $(vExtNo).val($(e).attr("vExtNo"));
    $("#btnSaveUserDetails").attr("style", "display:none");
    $("#btnClearUserDetails").attr("style", "display:none");
    $(document.getElementsByClassName("divRemarkUser")).hide();

    $("#divRemarklbl").attr("style", "display:none");
    $("#divRemarktxt").attr("style", "display:none");

    dataDept = $(e).attr("vdeptcode");
    var dataarray = dataDept.split(",");
    $("#ddlDepartment")[0].value = dataarray;

    dataScrop = $(e).attr("nscopeno");
    var dataarrays = dataScrop.split(",");
    $("#ddlScope")[0].value = dataarrays;

    dataUsertype = $(e).attr("vusertypecode");
    //var dataarrays = dataUsertype.split(",");
    $("#ddlUserType").multiselect("clearSelection");
    $("#ddlUserType").val(dataUsertype);
    $("#ddlUserType").multiselect("refresh");


}

function PopupClose() {
    $("#divAuditTrial").modal('hide');
    $("#UserDetailsModel").modal('show');
}

function UserFieldWiseAuditTrail(e) {

    $("#UserDetailsModel").modal("hide");
    var str = e.id;
    var title = $(e).attr("titlename");
    var MasterFieldName = $(e).attr("MasterFieldName");
    var MasterTableName = $(e).attr("MasterTableName");
    var cCommaSeprate = $(e).attr("cCommaSeprate");
    var vJoinvMasterFieldName = $(e).attr("vJoinvMasterFieldName");
    var fieldname = str;
    //var LoginName = $(vLoginName).val();
    var LoginName = iUserId;
    var Data = {
        vTableName: "UserMstHistory",
        vAuditFieldName: "iUserId",
        vAuditFieldValue: iUserId,
        vFieldName: fieldname,
        vMasterFieldName: MasterFieldName,
        vMasterTableName: MasterTableName,
        cCommaSeprate: cCommaSeprate,
        vJoinvMasterFieldName: vJoinvMasterFieldName,
        //iUserId: iUserNo
    }

    $.ajax({
        url: BaseUrl + "PmsUserMaster/Proc_GetAuditTrail",
        type: 'POST',
        data: Data,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Error To Get AuditTrail.", "User Master");
        }
    });

    function SuccessMethod(jsonData) {
        var strdata = "";
        //if (jsonData.length > 0) {
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


$("#btnInActiveSave").on("click", function () {
    if (isBlank(document.getElementById('txtReason').value)) {
        ValidationAlertBox("Please enter remarks for Inactive User Master.", "txtReason", "User Master");

        return false;
    }

    if (cStatusIndi == "C")
        var cActiveInactive = 'E';
    else
        var cActiveInactive = 'C';
    var SaveUserMasterData = {
        iUserId: iuseridActive,
        vLoginPass: vLoginPassActive,
        cLockFlag: 'N',
        iModifyBy: iuseridActive,
        cStatusIndi: cActiveInactive,
        vRemark: $("#txtReason").val(),
        DATAOPMODE: 3
    }
    SaveUserMaster(BaseUrl + "PmsUserMaster/InsertDataUserMaster", "SuccessMethod", SaveUserMasterData);
    SuccessorErrorMessageAlertBox("User Active/Deactive save Successfully.", "User Master");
    $("#UserMasterInctive").modal('hide');
    GetUserDetails();
});

function UserInactive(e) {
    document.getElementById('txtReason').value = "";
    $("#txtReason").prop("disabled", false);

    $("#UserMasterInctive").modal('show');

    iuseridActive = $(e).attr("iuserid");
    vLoginPassActive = $(e).attr("vLoginPass");
    cStatusIndi = $(e).attr("cStatusIndi");

}

function UserUnlock(e) {

    if (confirm("Are You Sure You Want To Continue ?")) {
        var SaveUserMasterData = {
            iUserId: $(e).attr("iUserId"),
            vLoginPass: $(e).attr("vLoginPass"),
            cLockFlag: 'N',
            nModifyBy: $("#hdnuserid").val(),
            cStatusIndi: 'E',
            DATAOPMODE: 3
        }
        SaveUserMaster(BaseUrl + "PmsUserMaster/InsertDataUserMaster", "SuccessMethod", SaveUserMasterData);
        SuccessorErrorMessageAlertBox("User details saved Successfully", "User Master");
        GetUserDetails();
    }
}

$("#btnChangePass").on("click", function () {

    var SaveUserMasterData = {
        iUserId: iUserId,
        vLoginPass: $(txtNewPass).val(),
        cLockFlag: 'N',
        iModifyBy: iUserId,
        cStatusIndi: 'E',
        DATAOPMODE: 4
    }
    $.ajax({
        url: BaseUrl + "PmsUserMaster/InsertDataUserMaster",
        type: 'POST',
        data: SaveUserMasterData,
        async: false,
        success: SuccessInsertData1,
        error: function () {
            SuccessorErrorMessageAlertBox("Error while saving details of User Masters.", "User Master");
        }
    });

    function SuccessInsertData1(jsonData) {

        if (jsonData.length != 0) {
            alert((jsonData[0].strMessage).toString());
        }
        else {
            alert("User details Saved Successfully.");
            $("#hdnExpired").val('N');
            $("#hdnLoginPass").val($(txtNewPass).val());
            $("#divChangePassword").modal('hide');

            $.ajax({
                type: "GET",
                url: WebUrl + "Home/UpdateExpired",
                data: { strPassword: $(txtNewPass).val() },
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false,
                success: OnSuccessUpdate,
                error: OnErrorCallUpdate
            });
            function OnSuccessUpdate(jsonData) {
            }
            function OnErrorCallUpdate(ex) {
            }
            GetUserDetails();
        }
    }
    $('#divChangePassword').modal('hide')

    ClearTextBoxDetailPart();

});

$("#btnClearChangepass").on("click", function () {
    ClearTextBoxDetailPart();
});

$("#btnExitChangepass").on("click", function () {
    var result = confirm(ConfirmMessage);
    if (result) {
        $("#divChangePassword").modal('hide');
    }
    else {
        return false;
    }
})
