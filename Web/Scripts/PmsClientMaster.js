var ConfirmMessage = 'Are You Sure You Want To Exit ?';
var vOperationCode = 0;
var vClientCode;
var vClientName;
var nclientno;
var Operation;

$(document).ready(function () {
    nUserNo = null;
    $('#ClientDetailsModel').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('#divAuditTrial').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('#ClientDetailsModel').modal('hide')
    $('#divAuditTrial').modal('hide')
    vClientCode = document.getElementById('txtClientCode');
    vClientName = document.getElementById('txtClientName');
    GetOperationDetails();
});


function GetOperationDetails() {
    var Url = BaseUrl + "RecordFetcher/ExecuteDataTable";
    var ExecuteDataSetData = {
        Table_Name_1: "view_clientMst",
        //WhereCondition_1: "cStatusIndi <> 'C'",
        DataRetrieval_1: 2,
    }
    GetJsonData(ExecuteDataSetData);

    var ActivityDataset = [];
    for (var i = 0; i < jsonData.length; i++) {
        var InDataset = [];
        InDataset.push(jsonData[i].vClientCode, jsonData[i].vClientName, jsonData[i].nClientNo, 
        '', '',"", jsonData[i].cStatusIndi);
        ActivityDataset.push(InDataset);
    }
    jsonData = "";
    var otableSiteDetails = $('#tblClientDetailsData').dataTable({
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

            $('td:eq(2)', nRow).append('<center><a data-toggle="modal" title="Edit" data-options="splash-2 splash-ef-15" data-target="#ClientDetailsModel" attrid="' + aData[6]
            + '" onclick="ClientEdit(this)" style="cursor:pointer;" vClientCode="' + aData[0] + '" vClientName="' + aData[1]
            + '" nClientNo="' + aData[2] + '" cStatusIndi="' + aData[6] 
            + '" class="btn btn-primary btn-rounded btn-sm btn-ef btn-ef-5 btn-ef-5a mb-0"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a></center>');

            if (aData[6] == 'D') {
                $('td:eq(3)', nRow).append('<center><a title="Active" data-toggle="modal" data-options="splash-2 splash-ef-15" data-target="#ClientDetailsModel" attrid="' + aData[6]
                + '" onclick="ClientActiveInactive(this)" style="cursor:pointer;" vClientCode="' + aData[0] + '" vClientName="' + aData[1]
                   + '" nClientNo="' + aData[2] + '" cStatusIndi="' + aData[6]
                + '" <i class="btn btn-primary btn-sm btn-rounded btn-ef btn-ef-5 btn-ef-5a mb-10"><i class="fa fa-check-circle"></i> <span>Active</span></a></div></center>');
                $(nRow).addClass('highlight');
            } else {
                $('td:eq(3)', nRow).append('<center><a title="Inactive" data-toggle="modal" data-options="splash-2 splash-ef-15" data-target="#ClientDetailsModel" attrid="' + aData[6]
               + '" onclick="ClientActiveInactive(this)" style="cursor:pointer;" vClientCode="' + aData[0] + '" vClientName="' + aData[1]
                + '" nClientNo="' + aData[2] + '" cStatusIndi="' + aData[6]
               + '" <i class="btn btn-primary btn-sm btn-rounded btn-ef btn-ef-5 btn-ef-5a mb-10"><i class="fa fa-close"></i> <span>Inactive</span></a></div></center>');
            }

            $('td:eq(4)', nRow).append('<center><a data-toggle="modal" title="Audit" data-options="splash-2 splash-ef-15" data-target="#ClientDetailsModel" attrid="' + aData[6]
               + '" onclick="ClientAuditTrail(this)" style="cursor:pointer;" vClientCode="' + aData[0] + '" vClientName="' + aData[1]
               + '" nClientNo="' + aData[2] + '" cStatusIndi="' + aData[6]
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
            { "sTitle": "Client Code" },
            { "sTitle": "Client Name" },
            { "sTitle": "Client No" },
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
    $("#titleMode").text('Mode:-Add');
    ClearTextBoxDetailPart();
    document.getElementById("btnSaveClientDetails").value = "Save"
    document.getElementById("btnSaveClientDetails").title = "Save";
    //$("#btnSaveClientDetails").attr("disabled", true);
    $("#btnSaveClientDetails").attr("style", "display:inline");
    $("#btnClearClientDetails").attr("style", "display:inline");
    $("#divRemarks")[0].style.display = "none";
});

$("#btnSaveClientDetails").on("click", function () {
    if (validateform() == false) {
        return false;
    }
    
    var btnOperaion = (document.getElementById("btnSaveClientDetails").value).toLowerCase();

    if (btnOperaion == "save") {

        Operation = 1;
        var SaveOperationMasterData = {
            vClientCode: vClientCode.value,
            vClientName: vClientName.value,
            iModifyBy: document.getElementById('hdnuserid').value,
            vRemark: document.getElementById('txtRemarks').value,
            cStatusIndi: 'N',
            DATAOPMODE: Operation
        }
        SaveOperationMaster(BaseUrl + "PmsClientMaster/InsertDataClientMaster", "SuccessMethod", SaveOperationMasterData);
    }
    else {

        Operation = 2;
        var SaveOperationMasterData = {
            vClientCode: vClientCode.value,
            vClientName: vClientName.value,
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
        SaveOperationMaster(BaseUrl + "PmsClientMaster/InsertDataClientMaster", "SuccessMethod", SaveOperationMasterData);
    }
    ClearTextBoxDetailPart();
    $("#ClientDetailsModel").modal('hide');
    GetOperationDetails();
});

$("#btnClearClientDetails").on("click", function () {
    ClearTextBoxDetailPart();
});

function ClientAuditTrail(e) {
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

    nclientno = $(e).attr("nclientno");

    $(vClientCode).val($(e).attr("vClientCode"));
    $(vClientName).val($(e).attr("vClientName"));

    $("#btnSaveClientDetails").attr("style", "display:none");
    $("#btnClearClientDetails").attr("style", "display:none");
    $(document.getElementsByClassName("divRemarkUser")).hide();
}

function ClearTextBoxDetailPart() {
    if ($("#titleMode").text() == "Mode:-Add")
    {
        vClientCode.value = "";
        vClientName.value = "";
        document.getElementById('txtClientCode').value = "";
        document.getElementById('txtClientName').value = "";
        $('#txtRemarks').val('');
        //$('#btnSaveClientDetails').prop('disabled', true);
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
    else if ($("#titleMode").text() == "Mode:-Edit") {
        vClientName.value = "";
        document.getElementById('txtClientName').value = "";
        $('#txtRemarks').val('');
        //$('#btnSaveClientDetails').prop('disabled', true);
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
    else {
        vClientCode.value = "";
        vClientName.value = "";
        $('#txtRemarks').val('');
        //$('#btnSaveClientDetails').prop('disabled', true);
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
}

function validateform() {
    Operation = (document.getElementById("btnSaveClientDetails").value).toLowerCase();
    if (isBlank(document.getElementById("txtClientCode").value)) {
        ValidationAlertBox('Please Enter Client Code', "txtClientCode", "Client Master");
        return false;
    }
    if (isBlank(document.getElementById("txtClientName").value)) {
        ValidationAlertBox('Please Enter Client Name', "txtClientName", "Client Master");
        return false;
    }
    if (Operation == "update" || Operation == "inactive" || Operation=="active") {
        if (isBlank(document.getElementById('txtRemarks').value)) {
            ValidationAlertBox("Please Enter Remark.", "txtRemarks", "Client Master");
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
            SuccessorErrorMessageAlertBox("Error while saving details of client Masters.", "Client Master");
        }
    });

    function SuccessInsertData(response) {
        SuccessorErrorMessageAlertBox(response,"Client Master");
    }
};

function ClientEdit(e) {
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
    $(vClientCode).val($(e).attr("vClientCode"));
    $(vClientName).val($(e).attr("vClientName"));
    document.getElementById("txtClientCode").disabled = true;
    document.getElementById("divRemarks").style.display = 'block';
    document.getElementById("btnSaveClientDetails").value = "Update";
    document.getElementById("btnSaveClientDetails").title = "Update";
    //$("#btnSaveClientDetails").attr("disabled", true);
    $("#btnSaveClientDetails").attr("style", "display:inline");
    $("#btnClearClientDetails").attr("style", "display:inline");
}

function ClientActiveInactive(e) {
    $('.form-control').each(function () {
        //$(this).attr('disabled', true);
        if ($(this).hasClass("parsley-success")) {
            $(this).removeClass("parsley-success");
        }
    });
    $('.AuditControl').each(function () { this.style.display = "none"; });

    document.getElementById("txtRemarks").value = "";
    document.getElementById("txtClientCode").disabled = true;
    document.getElementById("txtClientName").disabled = true;
    document.getElementById("txtRemarks").disabled = false;

    $(vClientCode).val($(e).attr("vClientCode"));
    $(vClientName).val($(e).attr("vClientName"));
    if (e.parentNode.innerText.toLowerCase() == "active") {
        $("#titleMode").text('Mode:-Active');
        document.getElementById("btnSaveClientDetails").value = "Active"
        document.getElementById("btnSaveClientDetails").title = "Active";
    }
    else {
        $("#titleMode").text('Mode:-Inactive');
        document.getElementById("btnSaveClientDetails").value = "Inactive"
        document.getElementById("btnSaveClientDetails").title = "Inactive";
    }

    document.getElementById("divRemarks").style.display = 'block';
    $("#btnSaveClientDetails").attr("disabled", false);
    $("#btnSaveClientDetails").attr("style", "display:inline");
    $("#btnClearClientDetails").attr("style", "display:none");
}

function PopupClose() {
    $("#divAuditTrial").modal('hide');
    $("#ClientDetailsModel").modal('show');
}

function ClientFieldWiseAuditTrail(e) {

    $("#UserDetailsModel").modal("hide");
    var str = e.id;
    var title = $(e).attr("titlename");
    var MasterFieldName = $(e).attr("MasterFieldName");
    var MasterTableName = $(e).attr("MasterTableName");
    var cCommaSeprate = $(e).attr("cCommaSeprate");
    var vJoinvMasterFieldName = $(e).attr("vJoinvMasterFieldName");
    var fieldname = str;
 
    var Data = {
        vTableName: "ClientMstHistory",
        vIdName: "nClientNo",
        vIdValue: nclientno,
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
            SuccessorErrorMessageAlertBox("Error To Get AuditTrail.","Client Master");
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
        otableAuditTrail = $('#tblClientDetailsAuditTrial').dataTable({
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

