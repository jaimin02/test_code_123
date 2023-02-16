/// <reference path="General.js" />
var ConfirmMessage = 'Are You Sure You Want To Exit ?';
var vOperationCode = 0;
var vSponserCode;
var vSponserName;
var nSponserno;

$(document).ready(function () {
    nUserNo = null;
    $('#SponserDetailsModel').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('#divAuditTrial').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('#SponserDetailsModel').modal('hide')
    $('#divAuditTrial').modal('hide')
    vSponserCode = document.getElementById('txtSponserCode');
    vSponserName = document.getElementById('txtSponserName');
    GetOperationDetails();
});


function GetOperationDetails() {
    var Url = BaseUrl + "RecordFetcher/ExecuteDataTable";
    var ExecuteDataSetData = {
        Table_Name_1: "view_SponserMst",
        //WhereCondition_1: "cStatusIndi <> 'C'",
        DataRetrieval_1: 2,
    }
    GetJsonData(ExecuteDataSetData);

    var ActivityDataset = [];
    for (var i = 0; i < jsonData.length; i++) {
        var InDataset = [];
        InDataset.push(jsonData[i].vSponserCode, jsonData[i].vSponserName, jsonData[i].nSponserNo,
        '', '', "", jsonData[i].cStatusIndi);
        ActivityDataset.push(InDataset);
    }
    jsonData = "";
    var otableSiteDetails = $('#tblSponserDetailsData').dataTable({
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
        "fnCreatedRow": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {

            $('td:eq(2)', nRow).append('<center><a data-toggle="modal" title="Edit" data-options="splash-2 splash-ef-15" data-target="#SponserDetailsModel" attrid="' + aData[6]
            + '" onclick="SponserEdit(this)" style="cursor:pointer;" vSponserCode="' + aData[0] + '" vSponserName="' + aData[1]
            + '" nSponserNo="' + aData[2] + '" cStatusIndi="' + aData[6]
            + '" class="btn btn-primary btn-rounded btn-sm btn-ef btn-ef-5 btn-ef-5a mb-0"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a></center>');

            if (aData[6] == 'D') {
                $('td:eq(3)', nRow).append('<center><a title="Active" data-toggle="modal" data-options="splash-2 splash-ef-15" data-target="#SponserDetailsModel" attrid="' + aData[6]
                + '" onclick="SponserActiveInactive(this)" style="cursor:pointer;" vSponserCode="' + aData[0] + '" vSponserName="' + aData[1]
                   + '" nSponserNo="' + aData[2] + '" cStatusIndi="' + aData[6]
                + '" <i class="btn btn-primary btn-sm btn-rounded btn-ef btn-ef-5 btn-ef-5a mb-10"><i class="fa fa-check-circle"></i> <span>Active</span></a></div></center>');
                $(nRow).addClass('highlight');
                //$('td', nRow).eq(4).addClass('disabled');
            } else {
                $('td:eq(3)', nRow).append('<center><a title="Inactive" data-toggle="modal" data-options="splash-2 splash-ef-15" data-target="#SponserDetailsModel" attrid="' + aData[6]
               + '" onclick="SponserActiveInactive(this)" style="cursor:pointer;" vSponserCode="' + aData[0] + '" vSponserName="' + aData[1]
                + '" nSponserNo="' + aData[2] + '" cStatusIndi="' + aData[6]
               + '" <i class="btn btn-primary btn-sm btn-rounded btn-ef btn-ef-5 btn-ef-5a mb-10"><i class="fa fa-close"></i> <span>Inactive</span></a></div></center>');
            }

            $('td:eq(4)', nRow).append('<center><a data-toggle="modal" title="Audit" data-options="splash-2 splash-ef-15" data-target="#SponserDetailsModel" attrid="' + aData[6]
               + '" onclick="SponserAuditTrail(this)" style="cursor:pointer;" vSponserCode="' + aData[0] + '" vSponserName="' + aData[1]
               + '" nSponserNo="' + aData[2] + '" cStatusIndi="' + aData[6]
               + '" class="btn btn-primary btn-rounded btn-sm btn-ef btn-ef-5 btn-ef-5a mb-0"><i class="fa fa-fw fa-edit"></i><span>Audit</span></a></center>');

        },
        "columnDefs": [
            {
                "targets": [2, 6],
                "visible": false,
                "searchable": false
            },

            { "bSortable": false, "targets": 4 },
            { "bSortable": false, "targets": 5 },
        ],
        "aoColumns": [
            { "sTitle": "Sponser Code" },
            { "sTitle": "Sponser Name" },
            { "sTitle": "Sponser No" },
            { "sTitle": "Edit" },
            { "sTitle": "Inactive" },
             { "sTitle": "Audit" },
        ],
        "oLanguage": {
            "sEmptyTable": "No Record Found",
        },
    });

}

$("#btnAddOperation").on("click", function () {
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
    $("#txtSponserCode").val("");
    ClearTextBoxDetailPart();
    $("#titleMode").text('Mode:-Add');
    document.getElementById("btnSaveSponserDetails").value = "Save"
    document.getElementById("btnSaveSponserDetails").title = "Save";
    //$("#btnSaveSponserDetails").attr("disabled", true);
    $("#btnSaveSponserDetails").attr("style", "display:inline");
    $("#btnClearSponserDetails").attr("style", "display:inline");
    $("#divRemarks")[0].style.display = "none";
});

$("#btnSaveSponserDetails").on("click", function () {
    if (validateform() == false) {
        return false;
    }
    var Operation;
    var btnOperaion = (document.getElementById("btnSaveSponserDetails").value).toLowerCase();

    if (btnOperaion == "save") {

        Operation = 1;
        var SaveOperationMasterData = {
            vSponserCode: vSponserCode.value,
            vSponserName: vSponserName.value,
            iModifyBy: document.getElementById('hdnuserid').value,
            vRemark: document.getElementById('txtRemarks').value,
            cStatusIndi: 'N',
            DATAOPMODE: Operation
        }
        SaveOperationMaster(BaseUrl + "PmsSponserMaster/InsertDataSponserMaster", "SuccessMethod", SaveOperationMasterData);
    }
    else {

        Operation = 2;
        var SaveOperationMasterData = {
            vSponserCode: vSponserCode.value,
            vSponserName: vSponserName.value,
            iModifyBy: document.getElementById('hdnuserid').value,
            vRemark: document.getElementById('txtRemarks').value,
            cStatusIndi: 'E',
            DATAOPMODE: Operation
        }
        if (btnOperaion == "inactive") {
            SaveOperationMasterData["cStatusIndi"] = "D";
            SaveOperationMasterData["DATAOPMODE"] = 3;
        }
        if (btnOperaion == "active") {
            SaveOperationMasterData["cStatusIndi"] = "A";
            SaveOperationMasterData["DATAOPMODE"] = 4;
        }


        SaveOperationMaster(BaseUrl + "PmsSponserMaster/InsertDataSponserMaster", "SuccessMethod", SaveOperationMasterData);
    }
    ClearTextBoxDetailPart();
    $("#SponserDetailsModel").modal('hide');
    GetOperationDetails();
});

$("#btnClearSponserDetails").on("click", function () {
    ClearTextBoxDetailPart();
});

function SponserAuditTrail(e) {
    $('.form-control').each(function () {
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
    document.getElementById("divRemarks").style.display = 'none';

    nSponserno = $(e).attr("nSponserno");

    $(vSponserCode).val($(e).attr("vSponserCode"));
    $(vSponserName).val($(e).attr("vSponserName"));

    $("#btnSaveSponserDetails").attr("style", "display:none");
    $("#btnClearSponserDetails").attr("style", "display:none");
    $(document.getElementsByClassName("divRemarkUser")).hide();
}

function ClearTextBoxDetailPart() {
    //vSponserCode.value = "";
    //$("#txtSponserCode").val("");
    vSponserName.value = "";
    $('#txtRemarks').val('');
    //$('#btnSaveSponserDetails').prop('disabled', true);
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
    Operation = (document.getElementById("btnSaveSponserDetails").value).toLowerCase();
    if (isBlank(document.getElementById("txtSponserCode").value)) {
        ValidationAlertBox("Please Enter Sponser Code.", "txtSponserCode", "Sponser Master");
        return false;
    }
    if (isBlank(document.getElementById("txtSponserName").value)) {
        ValidationAlertBox("Please Enter Sponser Name.", "txtSponserName", "Sponser Master");
        return false;
    }
    if (Operation == "update"|| Operation=="inactive"||Operation=="active") {
        if (isBlank(document.getElementById('txtRemarks').value)) {
            ValidationAlertBox("Please Enter Remark.", "txtRemarks", "Sponser Master");
            return false;
        }
    }
    return true;
}

var SaveOperationMaster = function (Url, SuccessMethod, Data) {
    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        async: false,
        success: SuccessInsertData,
        error: function () {
            ValidationAlertBox("Error while saving details of Sponser Masters.");
        }
    });

    function SuccessInsertData(response) {
        SuccessorErrorMessageAlertBox(response,"Sponser Master");
    }
};

function SponserEdit(e) {
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
    $("#titleMode").text('Mode:-Edit');
    $('#txtRemarks').val('');
    $(vSponserCode).val($(e).attr("vSponserCode"));
    $(vSponserName).val($(e).attr("vSponserName"));
    //document.getElementById("txtSponserCode").disabled = true;
    $("#txtSponserCode").prop('disabled', 'disabled');
    document.getElementById("divRemarks").style.display = 'block';
    document.getElementById("btnSaveSponserDetails").value = "Update";
    document.getElementById("btnSaveSponserDetails").title = "Update";
    //$("#btnSaveSponserDetails").attr("disabled", true);
    $("#btnSaveSponserDetails").attr("style", "display:inline");
    $("#btnClearSponserDetails").attr("style", "display:inline");
}

function SponserActiveInactive(e) {
    $('.form-control').each(function () {
        //$(this).attr('disabled', true);
        if ($(this).hasClass("parsley-success")) {
            $(this).removeClass("parsley-success");
        }
    });
    $('.AuditControl').each(function () { this.style.display = "none"; });

    document.getElementById("txtRemarks").value = "";
    document.getElementById("txtSponserCode").disabled = true;
    document.getElementById("txtSponserName").disabled = true;
    document.getElementById("txtRemarks").disabled = false;

    $(vSponserCode).val($(e).attr("vSponserCode"));
    $(vSponserName).val($(e).attr("vSponserName"));
    if (e.parentNode.innerText.toLowerCase() == "active") {
        $("#titleMode").text('Mode:-Active');
        document.getElementById("btnSaveSponserDetails").value = "Active"
        document.getElementById("btnSaveSponserDetails").title = "Active";
    }
    else {
        $("#titleMode").text('Mode:-Inactive');
        document.getElementById("btnSaveSponserDetails").value = "Inactive"
        document.getElementById("btnSaveSponserDetails").title = "Inactive";
    }

    document.getElementById("divRemarks").style.display = 'block';
    $("#btnSaveSponserDetails").attr("disabled", false);
    $("#btnSaveSponserDetails").attr("style", "display:inline");
    $("#btnClearSponserDetails").attr("style", "display:none");
}

function PopupClose() {
    $("#divAuditTrial").modal('hide');
    $("#SponserDetailsModel").modal('show');
}

function SponserFieldWiseAuditTrail(e) {

    $("#UserDetailsModel").modal("hide");
    var str = e.id;
    var title = $(e).attr("titlename");
    var MasterFieldName = $(e).attr("MasterFieldName");
    var MasterTableName = $(e).attr("MasterTableName");
    var cCommaSeprate = $(e).attr("cCommaSeprate");
    var vJoinvMasterFieldName = $(e).attr("vJoinvMasterFieldName");
    var fieldname = str;

    var Data = {
        vTableName: "SponserMstHistory",
        vIdName: "nSponserNo",
        vIdValue: nSponserno,
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
            ValidationAlertBox("Error To Get AuditTrail.");
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
        otableAuditTrail = $('#tblSponserDetailsAuditTrial').dataTable({
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

