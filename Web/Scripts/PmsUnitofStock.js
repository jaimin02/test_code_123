var iUserNo;
var nUnitofStockID;
var viewmode;
var ModuleName = "Unit Of Stock";

$(function () {
    iUserNo = $("#hdnuserid").val();
    nUnitofStockID = null;
    GetViewMode();
    GetUnitofStock();

    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('.modal').modal('hide');

});


$("#btnPmsUnitStockSave").on("click", function () {

    $("#loader").attr("style", "display:block");
    var Operation;
    var btnOperaion = (document.getElementById("spnUnitStockSave").innerText).toLowerCase().trim();

    $("#txtUnitofStock").val($.trim($("#txtUnitofStock").val()));
    if (btnOperaion == "save") {
        Operation = 1;
    }
    else if (btnOperaion == "update") {
        Operation = 2;
    }
    var InsertPmsUnitofStock = {
        nUnitofStockID: nUnitofStockID,
        vUnitofStock: $('#txtUnitofStock').val(),
        vRemark: $('#txtRemarks').val(),
        iModifyBy: $("#hdnuserid").val(),
        DATAOPMODE: Operation,
        vLocationCode: $("#hdnUserLocationCode").val(),

    }

    var InsertPmsUnitofStockData = {
        Url: BaseUrl + "PmsUnitofStock/InsertEditUnitofStock",
        SuccessMethod: "SuccessMethod",
        Data: InsertPmsUnitofStock
    }

    if (validateform() == false) {
        $("#loader").attr("style", "display:none");
    }
    else {
        InsertPmsUnitofStockMaster(InsertPmsUnitofStockData.Url, InsertPmsUnitofStockData.SuccessMethod, InsertPmsUnitofStockData.Data);
    }
    $("#loader").attr("style", "display:none");
});

$("#btnPmsUnitStockClear").on("click", function () {
    jQuery("#spnUnitStockSave").text('Save');
    $('#btnPmsUnitStockSave').removeAttr("title");
    $('#btnPmsUnitStockSave').attr("title", "Save");
    document.getElementById("divRemarkUnitStock").style.display = "none";
    $('#txtUnitofStock').val("");
    $('#txtRemarks').val("");
});

$("#btnPmsUnitStockExit").on("click", function () {
    ConfirmAlertBox(ModuleName, $("#RedirectToHome").val());

});

var InsertPmsUnitofStockMaster = function (Url, SuccessMethod, Data) {
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
    $('#txtUnitofStock').val("");
    $('#txtRemarks').val("");
    GetUnitofStock();

    var btnOperaion = (document.getElementById("spnUnitStockSave").innerText).toLowerCase().trim();

    if (btnOperaion == "save") {
        SuccessorErrorMessageAlertBox("Unit of Stock saved successfully.", ModuleName);
    }
    else if (btnOperaion == "update") {
        document.getElementById("divRemarkUnitStock").style.display = "none";
        jQuery("#spnUnitStockSave").text('Save');
        $('#btnPmsUnitStockSave').removeAttr("title");
        $('#btnPmsUnitStockSave').attr("title", "Save");
        SuccessorErrorMessageAlertBox("Unit of Stock updated successfully.", ModuleName);
    }
    else if (btnOperaion == "delete") {
        document.getElementById("divRemarkUnitStock").style.display = "none";
        jQuery("#spnUnitStockSave").text('Save');
        $('#btnPmsUnitStockSave').removeAttr("title");
        $('#btnPmsUnitStockSave').attr("title", "Save");
        SuccessorErrorMessageAlertBox("Unit of Stock inactivated successfully.", ModuleName);
    }

}

function GetUnitofStock() {
    var UnitofStockData = {
        Url: BaseUrl + "PmsUnitofStock/AllUnitofStock",
        SuccessMethod: "SuccessMethod"
    }
    var FilterData = {
        vLocationCode: $("#hdnUserLocationCode").val()
    }
    $.ajax({
        url: UnitofStockData.Url,
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
                Edit_c = '<a title="Edit" attrid="' + jsonData[i].nUnitofStockID + '" onclick=EditUnitofStock(this) style="cursor:pointer;" nUnitofStockID="' + jsonData[i].nUnitofStockID + '" vUnitofStock="' + jsonData[i].vUnitofStock + '"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a>'
                InActive_c = '<a href="Javascript:void(0);"  title="Inactive" id="1" onclick=pmsUnitofStockDelete(this) nUnitofStockID="' + jsonData[i].nUnitofStockID + '" vUnitofStock ="' + jsonData[i].vUnitofStock + '"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="glyphicon glyphicon-remove"></i> <span>Inactive</span></a>'
            }
            InDataset.push(jsonData[i].nUnitofStockID, srno, jsonData[i].vUnitofStock, Edit_c, '', InActive_c, jsonData[i].cStatusIndi);
            ActivityDataset.push(InDataset);
        }
        otable = $('#tblUnitStockMst').dataTable({
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
                $('td:eq(3)', nRow).append('<a href="Javascript:void(0);" title="Audit Trail" data-toggle="modal" data-target="#UnitofStockAudit" onclick=pmsUnitofSrockAuditTrail(this) nUnitofStockID="' + aData[0] + '"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-file-text-o"></i><span>Audit</span></a>');
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
                { "sTitle": "UnitodStockArea No" },
                { "sTitle": "Sr No" },
                { "sTitle": "Unit Of Stock" },
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

function EditUnitofStock(e) {
    nUnitofStockID = $(e).attr("nUnitofStockID");
    $('#txtUnitofStock').val($(e).attr("vUnitofStock"));
    jQuery("#spnUnitStockSave").text('Update');
    $('#btnPmsUnitStockSave').removeAttr("title");
    $('#btnPmsUnitStockSave').attr("title", "Update");
    document.getElementById("divRemarkUnitStock").style.display = "block";
    $("#txtRemarks").show();
}

function validateform() {
    var rowsData = $("#tblUnitStockMst").dataTable().fnGetData();

    if (isBlank(document.getElementById('txtUnitofStock').value)) {
        ValidationAlertBox("Please Enter Unit Of Stock.", "txtUnitofStock", ModuleName);
        return false;
    }
    else if ((isBlank(document.getElementById('txtRemarks').value)) && (document.getElementById("spnUnitStockSave").innerText).toLowerCase().trim() == "update") {
        ValidationAlertBox("Please Enter Remarks.", "txtRemarks", ModuleName);
        return false;
    }

    else if (document.getElementById("spnUnitStockSave").innerText.toLowerCase().trim() == "save") {
        $("#txtUnitofStock").val($.trim($("#txtUnitofStock").val()));
        var StoregeAreaName = $("#txtUnitofStock").val()
        var rows = $("#tblUnitStockMst").dataTable().fnGetNodes();

        for (i = 0; i < rows.length; i++) {
            if (StoregeAreaName.toUpperCase() == $(rows[i]).find("td:eq(1)").html().trim().toUpperCase()) {
                if (rowsData[i][6] != 'D') {
                    ValidationAlertBox("This Unit of Stock already exists.", "txtUnitofStock", ModuleName);
                    return false;
                    break;
                }
            }
        }
        return true;
    }
    else if ((document.getElementById("spnUnitStockSave").innerText).toLowerCase().trim() == "update") {
        var StoregeTypeName = ($("#txtUnitofStock").val()).trim();
        var rows = $("#tblUnitStockMst").dataTable().fnGetNodes();
        for (i = 0; i < rows.length; i++) {
            if (StoregeTypeName.toUpperCase() == $(rows[i]).find("td:eq(1)").html().trim().toUpperCase()) {
                if (rowsData[i][6] != 'D') {
                    var UnitofStockNo = otable.fnGetData(i - 0)[0];
                    if (UnitofStockNo != nUnitofStockID) {
                        ValidationAlertBox("This Unit of Stock already exists.", "txtUnitofStock", ModuleName);
                        return false;
                        break;
                    }
                }
            }
        }
        return true;
    }
}

function pmsUnitofSrockAuditTrail(e) {
    var str = e.id;
    var title = "Unit Of Stock";
    var fieldname = "vUnitofStock";
    nUnitofStockID = $(e).attr("nUnitofStockID");

    var Data = {
        vTableName: "UnitofStockMstHistory",
        vIdName: "nUnitofStockID",
        vIdValue: nUnitofStockID,
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
        otable1 = $('#tblUnitStockTrial').dataTable({
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

function pmsUnitofStockDelete(e) {
    $('#txtReason').prop('disabled', false);
    $("#txtReason").val("");
    nUnitofStockID = $(e).attr("nUnitofStockID")
    var UnitofStock = $(e).attr("vUnitofStock")

    $('#txtUnitofStock').val(UnitofStock);

    $("#UnitStockInctive").modal('show');

    jQuery("#spnUnitStockSave").text('delete');
    document.getElementById("divRemarkUnitStock").style.display = "none";
}


$("#btnInActiveSave").on("click", function () {
    if (isBlank(document.getElementById('txtReason').value)) {
        ValidationAlertBox("Please enter reason for inactive Unit of Stock.", "txtReason", ModuleName);

        return false;
    }

    var InActiveUnitofStockData = {
        nUnitofStockID: nUnitofStockID,
        vUnitofStock: $('#txtUnitofStock').val(),
        vRemark: $('#txtReason').val(),
        iModifyBy: $("#hdnuserid").val(),
        DATAOPMODE: "3",
        vLocationCode: $("#hdnUserLocationCode").val()
    }
    var InActiveUnitofStock = {
        Url: BaseUrl + "PmsUnitofStock/InsertEditUnitofStock",
        SuccessMethod: "SuccessMethod",
        Data: InActiveUnitofStockData
    }

    InsertPmsUnitofStockMaster(InActiveUnitofStock.Url, InActiveUnitofStock.SuccessMethod, InActiveUnitofStock.Data);
    $("#txtUnitofStock").val("");
    $("#txtReason").val("");
});

$("#btnInActiveClose").on("click", function () {
    $("#txtUnitofStock").val("");
    $("#txtRemarks").val("");
    $("#txtRemarks").hide();
    $("#UnitStockInctive").modal('hide');
    jQuery("#spnUnitStockSave").text('Save');
    $('#btnPmsUnitStockSave').removeAttr("title");
    $('#btnPmsUnitStockSave').attr("title", "Save");
});
