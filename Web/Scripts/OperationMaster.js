var ConfirmMessage = 'Are You Sure You Want To Exit ?';
var vOperationCode=0;
var vOperationName;
var vOperationPath;
var vParentOperationCode;
var iSeqNo;

$(document).ready(function () {
    nUserNo = null;
    $('#OperationDetailsModel').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('#divAuditTrial').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('#OperationDetailsModel').modal('hide')
    $('#divAuditTrial').modal('hide')
    vParentOperationCode = document.getElementById('ddlParent');
    vOperationName = document.getElementById('txtOpearationName');
    vOperationPath = document.getElementById('txtOperationPath');
    iSeqNo = document.getElementById('txtSequenceNo');
    GetParentOperationList();
    GetOperationDetails();
});

function GetParentOperationList() {
    jsonData = "";
    var ExecuteDataSetData = {
        Table_Name_1: "OperationMst",
        WhereCondition_1: "cStatusIndi <> 'C'",
        DataRetrieval_1: 3,
    }
    GetJsonData(ExecuteDataSetData);
    $("#ddlParent").empty().append('<option selected="selected" value="">Please Select Parent Operation</option>');
    for (var i = 0; i < jsonData.length; i++) {
        $("#ddlParent").append($("<option></option>").val(jsonData[i].vOperationCode).html(jsonData[i].vOperationName));
    }
}

function GetOperationDetails() {
    var Url = BaseUrl + "RecordFetcher/ExecuteDataTable";
    var ExecuteDataSetData = {
        Table_Name_1: "View_OperationMst",
        //WhereCondition_1: "cStatusIndi <> 'C'",
        DataRetrieval_1: 2,
    }
    GetJsonData(ExecuteDataSetData);

    var ActivityDataset = [];
    for (var i = 0; i < jsonData.length; i++) {
        var InDataset = [];
        InDataset.push(jsonData[i].vOperationName, jsonData[i].vOperationPath, jsonData[i].vParentOperationName, jsonData[i].iSeqNo,
        '', '', jsonData[i].vOperationCode, jsonData[i].vParentOperationCode, jsonData[i].cStatusIndi);
        ActivityDataset.push(InDataset);
    }
    jsonData = "";
    var otableSiteDetails = $('#tblOperationDetailsData').dataTable({
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

            $('td:eq(4)', nRow).append('<center><a data-toggle="modal" title="Edit" data-options="splash-2 splash-ef-15" data-target="#OperationDetailsModel" attrid="' + aData[6]
            + '" onclick="OperationEdit(this)" style="cursor:pointer;" vOperationName="' + aData[0] + '" vOperationPath="' + aData[1]
            + '" vParentOperationCode="' + aData[7] + '" iSeqNo="' + aData[3] + '"vOperationCode="'+ aData[6]
            + '" class="btn btn-primary btn-rounded btn-sm btn-ef btn-ef-5 btn-ef-5a mb-0"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a></center>');

            if (aData[8] == 'C') {
                $('td:eq(5)', nRow).append('<center><a title="Active" data-toggle="modal" data-options="splash-2 splash-ef-15" data-target="#OperationDetailsModel" attrid="' + aData[6]
                + '" onclick="OperationActiveInactive(this)" style="cursor:pointer;" vOperationName="' + aData[0] + '" vOperationPath="' + aData[1]
                + '" vParentOperationCode="' + aData[7] + '" iSeqNo="' + aData[3] + '" cStatusIndi="' + aData[8] + '"vOperationCode="'+ aData[6]
                + '" <i class="btn btn-primary btn-sm btn-rounded btn-ef btn-ef-5 btn-ef-5a mb-10"><i class="fa fa-check-circle"></i> <span>Active</span></a></div></center>');
                $(nRow).addClass('highlight');
                $('td', nRow).eq(4).addClass('disabled');
            } else {
                $('td:eq(5)', nRow).append('<center><a title="Inactive" data-toggle="modal" data-options="splash-2 splash-ef-15" data-target="#OperationDetailsModel" attrid="' + aData[6]
               + '" onclick="OperationActiveInactive(this)" style="cursor:pointer;" vOperationName="' + aData[0] + '" vOperationPath="' + aData[1]
               + '" vParentOperationCode="' + aData[7] + '" iSeqNo="' + aData[3] + '" cStatusIndi="' + aData[8] + '"vOperationCode="' +aData[6]
               + '" <i class="btn btn-primary btn-sm btn-rounded btn-ef btn-ef-5 btn-ef-5a mb-10"><i class="fa fa-close"></i> <span>Inactive</span></a></div></center>');
            }

        },
        "columnDefs": [
            {
                "targets": [6, 7, 8],
                "visible": false,
                "searchable": false
            },

            { "bSortable": false, "targets": 4 },
            { "bSortable": false, "targets": 5 },
        ],
        "aoColumns": [
            { "sTitle": "Operation Name" },
            { "sTitle": "Operation Path" },
            { "sTitle": "Parent Operation Name" },
            { "sTitle": "Sequence No." },
            { "sTitle": "Edit" },
            { "sTitle": "Inactive" },
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
    document.getElementById("btnSaveOperationDetails").value = "Save"
    document.getElementById("btnSaveOperationDetails").title = "Save";
    $("#btnSaveOperationDetails").attr("disabled", true);
    $("#btnSaveOperationDetails").attr("style", "display:inline");
    $("#btnClearOperationDetails").attr("style", "display:inline");
});

$("#btnSaveOperationDetails").on("click", function () {
    if (validateform() == false) {
        return false;
    }
    var Operation;
    var btnOperaion = (document.getElementById("btnSaveOperationDetails").value).toLowerCase();

    if (btnOperaion == "save") {

        Operation = 1;
        var SaveOperationMasterData = {
            vOperationCode: document.getElementById("txtOpetationCode").value,
            vOperationName: vOperationName.value,
            vOperationPath: vOperationPath.value,
            vParentOperationCode: $(vParentOperationCode).val(),
            iSeqNo: iSeqNo.value,
            iModifyBy: document.getElementById('hdnuserid').value,
            cStatusIndi: 'N',
            DATAOPMODE: Operation
        }
        SaveOperationMaster(BaseUrl + "PmsOperationMaster/save_OperationMaster", "SuccessMethod", SaveOperationMasterData);
    }
    else {
        Operation = 2;
        var SaveOperationMasterData = {
            vOperationCode: vOperationCode,
            vOperationName: vOperationName.value,
            vOperationPath: vOperationPath.value,
            vParentOperationCode: $(vParentOperationCode).val(),
            iSeqNo: iSeqNo.value,
            iModifyBy: document.getElementById('hdnuserid').value,
            cStatusIndi: 'E',
            DATAOPMODE: Operation
        }
        if (btnOperaion == "inactive") {
            SaveOperationMasterData["cStatusIndi"] = "C";
            SaveOperationMasterData["DATAOPMODE"] = 3;
        }
        SaveOperationMaster(BaseUrl + "PmsOperationMaster/save_OperationMaster", "SuccessMethod", SaveOperationMasterData);
    }
    ClearTextBoxDetailPart();
    $("#OperationDetailsModel").modal('hide');
    GetParentOperationList();
    GetOperationDetails();
});

$("#btnClearOperationDetails").on("click", function () {
    ClearTextBoxDetailPart();
});

$("#btnExitOperationDetails").on("click", function () {
    var result = confirm(ConfirmMessage);
    if (result) {
        $("#OperationDetailsModel").modal('hide');
    }
    else {
        return false;
    }
});

function ClearTextBoxDetailPart() {
    iSeqNo.value = "";
    $(vParentOperationCode).val("");
    $('#btnSaveOperationDetails').prop('disabled', true);
    if (($("#titleMode").text().split('-')[1].split('"')[0].toString().replace(/\s+/g, '') == "Add")) {
        $("#txtOpearationName").val("");
        $("#txtOperationPath").val("");
        $("#txtOpetationCode").val("");
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

    var rows = $("#tblOperationDetailsData").dataTable().fnGetNodes();
    for (i = 0; i < rows.length; i++) {
        if (vOperationName.value.toUpperCase() == $(rows[i]).find("td:eq(0)").html().trim().toUpperCase()) {
            if ($(rows[i]).find("td:eq(4)").find("a").attr("attrid") != vOperationCode) {
                alert("This Operation Name already exist in system.")
                return false;
                break;
            }
        }
    }
    var ExecuteDataSetData = {
        Table_Name_1: "OperationMst",
        WhereCondition_1: "vParentOperationCode=" + $(vParentOperationCode).val() + " AND iSeqNo=" + iSeqNo.value + " AND vOperationCode<>" + vOperationCode,
        DataRetrieval_1: 3,
    }
    GetJsonData(ExecuteDataSetData);
    if (jsonData.length > 0) {
        //alert("Sequence No. already exist in system.")
       // return false;
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
            alert("Error while saving details of User Masters.");
        }
    });

    function SuccessInsertData(response) {
        alert(response);
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
    $('.AuditControl').each(function () { this.style.display = "none"; });
    $("#titleMode").text('Mode:-Edit');
    vOperationCode = $(e).attr("attrid");
    document.getElementById('txtOpetationCode').value = vOperationCode;
    $(vOperationName).val($(e).attr("vOperationName"));
    $("#txtOpearationName").prop('disabled', 'disabled');
    $("#txtOperationPath").prop('disabled', 'disabled');
    $("#txtOpetationCode").prop('disabled', 'disabled');  
    $(vOperationPath).val($(e).attr("vOperationPath"));
    $(iSeqNo).val($(e).attr("iSeqNo"));
    $(vParentOperationCode).val($(e).attr("vParentOperationCode"));
    document.getElementById("btnSaveOperationDetails").value = "Update";
    document.getElementById("btnSaveOperationDetails").title = "Update";
    $("#btnSaveOperationDetails").attr("disabled", true);
    $("#btnSaveOperationDetails").attr("style", "display:inline");
    $("#btnClearOperationDetails").attr("style", "display:inline");
}

function OperationActiveInactive(e) {
    $('.form-control').each(function () {
        $(this).attr('disabled', true);
        if ($(this).hasClass("parsley-success")) {
            $(this).removeClass("parsley-success");
        }
    });
    $('.AuditControl').each(function () { this.style.display = "none"; });

    vOperationCode = $(e).attr("attrid");
    $(vOperationName).val($(e).attr("vOperationName"));
    $(vOperationPath).val($(e).attr("vOperationPath"));
    $(iSeqNo).val($(e).attr("iSeqNo"));
    $(vParentOperationCode).val($(e).attr("vParentOperationCode"));
    if (e.parentNode.innerText.toLowerCase() == "active") {
        $("#titleMode").text('Mode:-Active');
        document.getElementById("btnSaveOperationDetails").value = "Active"
        document.getElementById("btnSaveOperationDetails").title = "Active";
    }
    else {
        $("#titleMode").text('Mode:-Inactive');
        document.getElementById("btnSaveOperationDetails").value = "Inactive"
        document.getElementById("btnSaveOperationDetails").title = "Inactive";
    }
    $("#btnSaveOperationDetails").attr("disabled", false);
    $("#btnSaveOperationDetails").attr("style", "display:inline");
    $("#btnClearOperationDetails").attr("style", "display:none");
}

�