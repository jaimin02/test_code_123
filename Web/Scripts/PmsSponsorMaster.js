var ConfirmMessage = 'Are You Sure You Want To Exit ?';
var vOperationCode = 0;
var vSponsorCode;
var vSponsorName;
var nSponsorno;

$(document).ready(function () {
    nUserNo = null;
    $('#SponsorDetailsModel').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('#divAuditTrial').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('#SponsorDetailsModel').modal('hide')
    $('#divAuditTrial').modal('hide')
    vSponsorCode = document.getElementById('txtSponsorCode');
    vSponsorName = document.getElementById('txtSponsorName');
    GetOperationDetails();
});


function GetOperationDetails() {
    var Url = BaseUrl + "RecordFetcher/ExecuteDataTable";
    var ExecuteDataSetData = {
        Table_Name_1: "view_SponsorMst",
        //WhereCondition_1: "cStatusIndi <> 'C'",
        DataRetrieval_1: 2,
    }
    GetJsonData(ExecuteDataSetData);

    var ActivityDataset = [];
    for (var i = 0; i < jsonData.length; i++) {
        var InDataset = [];
        InDataset.push(jsonData[i].vSponsorCode, jsonData[i].vSponsorName, jsonData[i].nSponsorNo, 
        '', '',"", jsonData[i].cStatusIndi);
        ActivityDataset.push(InDataset);
    }
    jsonData = "";
    var otableSiteDetails = $('#tblSponsorDetailsData').dataTable({
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

            $('td:eq(2)', nRow).append('<center><a data-toggle="modal" title="Edit" data-options="splash-2 splash-ef-15" data-target="#SponsorDetailsModel" attrid="' + aData[6]
            + '" onclick="SponsorEdit(this)" style="cursor:pointer;" vSponsorCode="' + aData[0] + '" vSponsorName="' + aData[1]
            + '" nSponsorNo="' + aData[2] + '" cStatusIndi="' + aData[6] 
            + '" class="btn btn-primary btn-rounded btn-sm btn-ef btn-ef-5 btn-ef-5a mb-0"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a></center>');

            if (aData[6] == 'C') {
                $('td:eq(3)', nRow).append('<center><a title="Active" data-toggle="modal" data-options="splash-2 splash-ef-15" data-target="#SponsorDetailsModel" attrid="' + aData[6]
                + '" onclick="SponsorActiveInactive(this)" style="cursor:pointer;" vSponsorCode="' + aData[0] + '" vSponsorName="' + aData[1]
                   + '" nSponsorNo="' + aData[2] + '" cStatusIndi="' + aData[6]
                + '" <i class="btn btn-primary btn-sm btn-rounded btn-ef btn-ef-5 btn-ef-5a mb-10"><i class="fa fa-check-circle"></i> <span>Active</span></a></div></center>');
                $(nRow).addClass('highlight');
                $('td', nRow).eq(4).addClass('disabled');
            } else {
                $('td:eq(3)', nRow).append('<center><a title="Inactive" data-toggle="modal" data-options="splash-2 splash-ef-15" data-target="#SponsorDetailsModel" attrid="' + aData[6]
               + '" onclick="SponsorActiveInactive(this)" style="cursor:pointer;" vSponsorCode="' + aData[0] + '" vSponsorName="' + aData[1]
                + '" nSponsorNo="' + aData[2] + '" cStatusIndi="' + aData[6]
               + '" <i class="btn btn-primary btn-sm btn-rounded btn-ef btn-ef-5 btn-ef-5a mb-10"><i class="fa fa-close"></i> <span>Inactive</span></a></div></center>');
            }

            $('td:eq(4)', nRow).append('<center><a data-toggle="modal" title="Audit" data-options="splash-2 splash-ef-15" data-target="#SponsorDetailsModel" attrid="' + aData[6]
               + '" onclick="SponsorAuditTrail(this)" style="cursor:pointer;" vSponsorCode="' + aData[0] + '" vSponsorName="' + aData[1]
               + '" nSponsorNo="' + aData[2] + '" cStatusIndi="' + aData[6]
               + '" class="btn btn-primary btn-rounded btn-sm btn-ef btn-ef-5 btn-ef-5a mb-0"><i class="fa fa-fw fa-edit"></i><span>Audit</span></a></center>');

        },
        "columnDefs": [
            {
                "targets": [2,6],
                "visible": false,
                "searchable": false
            },

            { "bSortable": false, "targets": 4 },
            { "bSortable": false, "targets": 5 },
        ],
        "aoColumns": [
            { "sTitle": "Sponsor Code" },
            { "sTitle": "Sponsor Name" },
            { "sTitle": "Sponsor No" },
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
    ClearTextBoxDetailPart();
    $("#titleMode").text('Mode:-Add');
    document.getElementById("btnSaveSponsorDetails").value = "Save"
    document.getElementById("btnSaveSponsorDetails").title = "Save";
    //$("#btnSaveSponsorDetails").attr("disabled", true);
    $("#btnSaveSponsorDetails").attr("style", "display:inline");
    $("#btnClearSponsorDetails").attr("style", "display:inline");
    $("#divRemarks")[0].style.display = "none";
});

$("#btnSaveSponsorDetails").on("click", function () {
    if (validateform() == false) {
        return false;
    }
    var Operation;
    var btnOperaion = (document.getElementById("btnSaveSponsorDetails").value).toLowerCase();

    if (btnOperaion == "save") {

        Operation = 1;
        var SaveOperationMasterData = {
            vSponsorCode: vSponsorCode.value,
            vSponsorName: vSponsorName.value,
            iModifyBy: document.getElementById('hdnuserid').value,
            vRemark: document.getElementById('txtRemarks').value,
            cStatusIndi: 'N',
            DATAOPMODE: Operation
        }
        SaveOperationMaster(BaseUrl + "PmsSponsorMaster/InsertDataSponsorMaster", "SuccessMethod", SaveOperationMasterData);
    }
    else {

        if (isBlank(document.getElementById("txtRemarks").value)) {
            alert('Please Enter Remarks');
            return false;
        }

        Operation = 2;
        var SaveOperationMasterData = {
            vSponsorCode: vSponsorCode.value,
            vSponsorName: vSponsorName.value,
            iModifyBy: document.getElementById('hdnuserid').value,
            vRemark: document.getElementById('txtRemarks').value,
            cStatusIndi: 'E',
            DATAOPMODE: Operation
        }
        if (btnOperaion == "inactive") {
            SaveOperationMasterData["cStatusIndi"] = "C";
            SaveOperationMasterData["DATAOPMODE"] = 3;
        }
        SaveOperationMaster(BaseUrl + "PmsSponsorMaster/InsertDataSponsorMaster", "SuccessMethod", SaveOperationMasterData);
    }
    ClearTextBoxDetailPart();
    $("#SponsorDetailsModel").modal('hide');
    GetOperationDetails();
});

$("#btnClearSponsorDetails").on("click", function () {
    ClearTextBoxDetailPart();
});

function SponsorAuditTrail(e) {
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

    nSponsorno = $(e).attr("nSponsorno");

    $(vSponsorCode).val($(e).attr("vSponsorCode"));
    $(vSponsorName).val($(e).attr("vSponsorName"));

    $("#btnSaveSponsorDetails").attr("style", "display:none");
    $("#btnClearSponsorDetails").attr("style", "display:none");
    $(document.getElementsByClassName("divRemarkUser")).hide();
}

function ClearTextBoxDetailPart() {
    vSponsorCode.value = "";
    vSponsorName.value = "";
    //$('#btnSaveSponsorDetails').prop('disabled', true);
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
      
    if (isBlank(document.getElementById("txtSponsorCode").value)) {
        alert('Please Enter Sponsor Code');
        return false;
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
            alert("Error while saving details of Sponsor Masters.");
        }
    });

    function SuccessInsertData(response) {
        alert(response);
    }
};

function SponsorEdit(e) {
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
    $(vSponsorCode).val($(e).attr("vSponsorCode"));
    $(vSponsorName).val($(e).attr("vSponsorName"));
    document.getElementById("txtSponsorCode").disabled = true;
    document.getElementById("divRemarks").style.display = 'block';
    document.getElementById("btnSaveSponsorDetails").value = "Update";
    document.getElementById("btnSaveSponsorDetails").title = "Update";
    //$("#btnSaveSponsorDetails").attr("disabled", true);
    $("#btnSaveSponsorDetails").attr("style", "display:inline");
    $("#btnClearSponsorDetails").attr("style", "display:inline");
}

function SponsorActiveInactive(e) {
    $('.form-control').each(function () {
        //$(this).attr('disabled', true);
        if ($(this).hasClass("parsley-success")) {
            $(this).removeClass("parsley-success");
        }
    });
    $('.AuditControl').each(function () { this.style.display = "none"; });

    document.getElementById("txtRemarks").value = "";
    document.getElementById("txtSponsorCode").disabled = true;
    document.getElementById("txtSponsorName").disabled = true;
    document.getElementById("txtRemarks").disabled = false;

    $(vSponsorCode).val($(e).attr("vSponsorCode"));
    $(vSponsorName).val($(e).attr("vSponsorName"));
    if (e.parentNode.innerText.toLowerCase() == "active") {
        $("#titleMode").text('Mode:-Active');
        document.getElementById("btnSaveSponsorDetails").value = "Active"
        document.getElementById("btnSaveSponsorDetails").title = "Active";
    }
    else {
        $("#titleMode").text('Mode:-Inactive');
        document.getElementById("btnSaveSponsorDetails").value = "Inactive"
        document.getElementById("btnSaveSponsorDetails").title = "Inactive";
    }

    document.getElementById("divRemarks").style.display = 'block';
    $("#btnSaveSponsorDetails").attr("disabled", false);
    $("#btnSaveSponsorDetails").attr("style", "display:inline");
    $("#btnClearSponsorDetails").attr("style", "display:none");
}

function PopupClose() {
    $("#divAuditTrial").modal('hide');
    $("#SponsorDetailsModel").modal('show');
}

function SponsorFieldWiseAuditTrail(e) {

    $("#UserDetailsModel").modal("hide");
    var str = e.id;
    var title = $(e).attr("titlename");
    var MasterFieldName = $(e).attr("MasterFieldName");
    var MasterTableName = $(e).attr("MasterTableName");
    var cCommaSeprate = $(e).attr("cCommaSeprate");
    var vJoinvMasterFieldName = $(e).attr("vJoinvMasterFieldName");
    var fieldname = str;
 
    var Data = {
        vTableName: "SponsorMstHistory",
        vIdName: "nSponsorNo",
        vIdValue: nSponsorno,
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
            alert("Error To Get AuditTrail.");
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
        otableAuditTrail = $('#tblSponsorDetailsAuditTrial').dataTable({
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

