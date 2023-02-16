var iUserNo;
var nStatusofStockID;
var viewmode;
var ModuleName = "Status Of Stock";

$(function () {
    iUserNo = $("#hdnuserid").val();
    nStatusofStockID = null;
    GetViewMode();
    GetStatusofStock();

    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('.modal').modal('hide');

});

$("#btnPmsStatusStockSave").on("click", function () {

    $("#loader").attr("style", "display:block");
    var Operation;
    var btnOperaion = (document.getElementById("spnStatusStockSave").innerText).toLowerCase().trim();

    $("#txtStatusofStock").val($.trim($("#txtStatusofStock").val()));
    if (btnOperaion == "save") {
        Operation = 1;
    }
    else if (btnOperaion == "update") {
        Operation = 2;
    }
    var InsertPmsStatusofStock = {
        nStatusofStockID: nStatusofStockID,
        vStatusofStock: $('#txtStatusofStock').val(),
        vRemark: $('#txtRemarks').val(),
        iModifyBy: $("#hdnuserid").val(),
        DATAOPMODE: Operation,
        vLocationCode: $("#hdnUserLocationCode").val(),

    }

    var InsertPmsStatusofStockData = {
        Url: BaseUrl + "PmsStatusofStock/InsertEditStatusofStock",
        SuccessMethod: "SuccessMethod",
        Data: InsertPmsStatusofStock
    }

    if (validateform() == false) {
        $("#loader").attr("style", "display:none");
    }
    else {
        InsertPmsStatusofStockMaster(InsertPmsStatusofStockData.Url, InsertPmsStatusofStockData.SuccessMethod, InsertPmsStatusofStockData.Data);
    }
    $("#loader").attr("style", "display:none");
});

$("#btnPmsStatusStockClear").on("click", function () {
    jQuery("#spnStatusStockSave").text('Save');
    $('#btnPmsStatusStockSave').removeAttr("title");
    $('#btnPmsStatusStockSave').attr("title", "Save");
    document.getElementById("divRemarkStatusStock").style.display = "none";
    $('#txtStatusofStock').val("");
    $('#txtRemarks').val("");
});

$("#btnPmsStatusStockExit").on("click", function () {
    ConfirmAlertBox(ModuleName, $("#RedirectToHome").val());
});

var InsertPmsStatusofStockMaster = function (Url, SuccessMethod, Data) {
    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        success: SuccessInsertMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Error to save data.", ModuleName);
        }
    });
}

function SuccessInsertMethod() {
    $('#txtStatusofStock').val("");
    $('#txtRemarks').val("");
    GetStatusofStock();

    var btnOperaion = (document.getElementById("spnStatusStockSave").innerText).toLowerCase().trim();

    if (btnOperaion == "save") {
        SuccessorErrorMessageAlertBox("Status of Stock Saved Successfully.", ModuleName);
    }
    else if (btnOperaion == "update") {
        document.getElementById("divRemarkStatusStock").style.display = "none";
        jQuery("#spnStatusStockSave").text('Save');
        $('#btnPmsStatusStockSave').removeAttr("title");
        $('#btnPmsStatusStockSave').attr("title", "Save");
        SuccessorErrorMessageAlertBox("Status of Stock Updated Successfully.", ModuleName);
    }
    else if (btnOperaion == "delete") {
        document.getElementById("divRemarkStatusStock").style.display = "none";
        jQuery("#spnStatusStockSave").text('Save');
        $('#btnPmsStatusStockSave').removeAttr("title");
        $('#btnPmsStatusStockSave').attr("title", "Save");
        SuccessorErrorMessageAlertBox("Status of Stock InActivated Successfully.", ModuleName);
    }
}

function GetStatusofStock() {
    var StatusofStockData = {
        Url: BaseUrl + "PmsStatusofStock/AllStatusofStock",
        SuccessMethod: "SuccessMethod"
    }
    var FilterData = {
        vLocationCode: $("#hdnUserLocationCode").val()
    }
    $.ajax({
        url: StatusofStockData.Url,
        type: 'POST',
        asyc: false,
        data: FilterData,
        success: SuccessGetMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Data not found.", ModuleName);
        }
    });

    function SuccessGetMethod(jsonData) {
        var Edit_c;
        var InActive_c;
        var srno;
        var ActivityDataset = [];
        for (var i = 0; i < jsonData.length; i++) {
            var InDataset = [];
            srno = i + 1;
            if (viewmode == "OnlyView") {
                Edit_c = '<a data-tooltip="tooltip" title="Edit" class="disabled"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a>'
                InActive_c = '<a data-tooltip="tooltip" title="Inactive" class="disabled"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="glyphicon glyphicon-remove"></i> <span>Inactive</span></a>';
            }
            else {
                Edit_c = '<a title="Edit" attrid="' + jsonData[i].nStatusofStockID + '" onclick=EditStatusofStock(this) style="cursor:pointer;" nStatusofStockID="' + jsonData[i].nStatusofStockID + '" vStatusofStock="' + jsonData[i].vStatusofStock + '"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a>'
                InActive_c = '<a href="Javascript:void(0);"  title="Inactive" id="1" onclick=pmsStatusofStockDelete(this) nStatusofStockID="' + jsonData[i].nStatusofStockID + '" vStatusofStock ="' + jsonData[i].vStatusofStock + '"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="glyphicon glyphicon-remove"></i> <span>Inactive</span></a>'
            }
            InDataset.push(jsonData[i].nStatusofStockID, srno, jsonData[i].vStatusofStock, Edit_c, '', InActive_c, jsonData[i].cStatusIndi);
            ActivityDataset.push(InDataset);
        }
        otable = $('#tblStatusStockMst').dataTable({
            "bJQueryUI": true,
            "sPaginationType": "full_numbers",
            "bLengthChange": true,
            "iDisplayLength": 10,
            "bProcessing": true,
            "bSort": true,
            "autoWidth": false,
            "aaData": ActivityDataset,
            "bInfo": true,
            "bDestroy": true,
            "sScrollX": "100%",
            "sScrollXInner": "1258" /* It varies dynamically if number of columns increases */,
            "fnCreatedRow": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $('td:eq(3)', nRow).append('<a href="Javascript:void(0);" title="Audit Trail" data-toggle="modal" data-target="#StatusofStockAudit" onclick=pmsStatusofSrockAuditTrail(this) nStatusofStockID="' + aData[0] + '"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-file-text-o"></i><span>Audit</span></a>');
                if (aData[6] == "D") {
                    $(nRow).addClass('highlight');
                    $('td', nRow).eq(2).addClass('disabled');
                    $('td', nRow).eq(4).addClass('disabled');
                }

            },
            "columnDefs": [
                {
                    "targets": [0, 6],
                    "visible": false,
                    "searchable": false
                },
                { "bSortable": false, "targets": [3, 4, 5] },
                { "width": "1%", "targets": 1 },
                { "width": "10%", "targets": 2 },
                { "width": "1%", "targets": 3 },
                { "width": "1%", "targets": 4 },
                { "width": "1%", "targets": 5 },
            ],
            "aoColumns": [
                { "sTitle": "StatusofStockArea No" },
                { "sTitle": "Sr No" },
                { "sTitle": "Status Of Stock" },
                { "sTitle": "Edit" },
                { "sTitle": "Audit Trail" },
                { "sTitle": "Inactive" },
                { "sTitle": "StatusINDI" },
            ],
            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },
        });
    }
}

function EditStatusofStock(e) {
    nStatusofStockID = $(e).attr("nStatusofStockID");
    $('#txtStatusofStock').val($(e).attr("vStatusofStock"));
    jQuery("#spnStatusStockSave").text('Update');
    $('#btnPmsStatusStockSave').removeAttr("title");
    $('#btnPmsStatusStockSave').attr("title", "Update");
    document.getElementById("divRemarkStatusStock").style.display = "block";
    $("#txtRemarks").show();
}


function validateform() {
    var rowsData = $("#tblStatusStockMst").dataTable().fnGetData();

    if (isBlank(document.getElementById('txtStatusofStock').value)) {
        ValidationAlertBox("Please Enter Status Of Stock.", "txtStatusofStock", ModuleName);
        return false;
    }
    else if ((isBlank(document.getElementById('txtRemarks').value)) && (document.getElementById("spnStatusStockSave").innerText).toLowerCase().trim() == "update") {
        ValidationAlertBox("Please Enter Remarks.", "txtRemarks", ModuleName);
        return false;
    }

    else if (document.getElementById("spnStatusStockSave").innerText.toLowerCase().trim() == "save") {
        $("#txtStatusofStock").val($.trim($("#txtStatusofStock").val()));
        var StoregeAreaName = $("#txtStatusofStock").val()
        var rows = $("#tblStatusStockMst").dataTable().fnGetNodes();

        for (i = 0; i < rows.length; i++) {
            if (StoregeAreaName.toUpperCase() == $(rows[i]).find("td:eq(1)").html().trim().toUpperCase()) {
                if (rowsData[i][6] != 'D') {
                    ValidationAlertBox("This Status of Stock already exists.", "txtStatusofStock", ModuleName);
                    return false;
                    break;
                }
            }
        }
        return true;
    }
    else if ((document.getElementById("spnStatusStockSave").innerText).toLowerCase().trim() == "update") {
        var StoregeTypeName = ($("#txtStatusofStock").val()).trim();
        var rows = $("#tblStatusStockMst").dataTable().fnGetNodes();
        for (i = 0; i < rows.length; i++) {
            if (StoregeTypeName.toUpperCase() == $(rows[i]).find("td:eq(1)").html().trim().toUpperCase()) {
                if (rowsData[i][6] != 'D') {
                    var StatusofStockNo = otable.fnGetData(i - 0)[0];
                    if (StatusofStockNo != nStatusofStockID) {
                        ValidationAlertBox("This Status of Stock already exists.", "txtStatusofStock", ModuleName);
                        return false;
                        break;
                    }
                }
            }
        }
        return true;
    }
}


function pmsStatusofSrockAuditTrail(e) {
    var str = e.id;
    var title = "Status Of Stock";
    var fieldname = "vStatusofStock";
    nStatusofStockID = $(e).attr("nStatusofStockID");

    var Data = {
        vTableName: "StatusofStockMstHistory",
        vIdName: "nStatusofStockID",
        vIdValue: nStatusofStockID,
        vFieldName: fieldname,
        iUserId: iUserNo
    }

    $.ajax({
        url: BaseUrl + "PmsGeneral/AuditTrail",
        type: 'POST',
        data: Data,
        async: false,
        success: SuccessAuditMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Error in Audit Trail.", ModuleName);

        }
    });

    function SuccessAuditMethod(jsonData) {
        var ActivityDataset = [];
        for (var i = 0; i < jsonData.length; i++) {
            var InDataset = [];
            InDataset.push(jsonData[i].vFieldName, jsonData[i].Operation, jsonData[i].vRemark, jsonData[i].vModifyBy, jsonData[i].dModifyOn);
            ActivityDataset.push(InDataset);
        }
        otable1 = $('#tblStatusStockTrial').dataTable({
            "bJQueryUI": true,
            "sPaginationType": "full_numbers",
            "bLengthChange": true,
            "iDisplayLength": 10,
            "bProcessing": true,
            "bSort": false,
            "autoWidth": false,
            "aaData": ActivityDataset,
            "bInfo": true,
            "bDestroy": true,
            "aoColumns": [
                { "sTitle": "" + title + "" },
                         { "sTitle": "Operations" },
                         { "sTitle": "Remarks" },
                         { "sTitle": "Modify by" },
                         { "sTitle": "Modify On" }
            ],
            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },
        });
    }
}

function pmsStatusofStockDelete(e) {
    $('#txtReason').prop('disabled', false);
    $("#txtReason").val("");
    nStatusofStockID = $(e).attr("nStatusofStockID")
    var StatusofStock = $(e).attr("vStatusofStock")

    $('#txtStatusofStock').val(StatusofStock);

    $("#StatusStockInctive").modal('show');

    jQuery("#spnStatusStockSave").text('delete');
    document.getElementById("divRemarkStatusStock").style.display = "none";
}



$("#btnInActiveSave").on("click", function () {
    if (isBlank(document.getElementById('txtReason').value)) {
        ValidationAlertBox("Please enter reason for inactive Status of Stock.", "txtReason", ModuleName);

        return false;
    }

    var InActiveStatusofStockData = {
        nStatusofStockID: nStatusofStockID,
        vStatusofStock: $('#txtStatusofStock').val(),
        vRemark: $('#txtReason').val(),
        iModifyBy: $("#hdnuserid").val(),
        DATAOPMODE: "3",
        vLocationCode: $("#hdnUserLocationCode").val()
    }
    var InActiveStatusofStock = {
        Url: BaseUrl + "PmsStatusofStock/InsertEditStatusofStock",
        SuccessMethod: "SuccessMethod",
        Data: InActiveStatusofStockData
    }

    InsertPmsStatusofStockMaster(InActiveStatusofStock.Url, InActiveStatusofStock.SuccessMethod, InActiveStatusofStock.Data);
    $("#txtStatusofStock").val("");
    $("#txtReason").val("");
});

$("#btnInActiveClose").on("click", function () {
    $("#txtStatusofStock").val("");
    $("#txtRemarks").val("");
    $("#txtRemarks").hide();
    $("#StatusStockInctive").modal('hide');
    jQuery("#spnStatusStockSave").text('Save');
    $('#btnPmsStatusStockSave').removeAttr("title");
    $('#btnPmsStatusStockSave').attr("title", "Save");
});
