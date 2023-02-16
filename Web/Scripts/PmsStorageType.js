var iUserNo;
var nStorageTypeID;
var viewmode;
var ModuleName = "Storage Type"

$(document).ready(function () {
    //alert($("#hdnUserLocationCode").val());
});

$(function () {
    iUserNo = $("#hdnuserid").val();
    nStorageTypeID = null;
    GetStorageType();

    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('.modal').modal('hide');

    GetViewMode();

});

$("#btnPmsStorageTypeSave").on("click", function () {
    var Operation;
    var btnOperaion = (document.getElementById("spnPmsStorageType").innerText).toLowerCase().trim()

    if (btnOperaion == "save") {
        Operation = 1;
    }
    else if (btnOperaion == "update") {
        Operation = 2;
    }


    var InsertPMSStorageType = {
        nStorageTypeID: nStorageTypeID,
        vStorageType: $('#txtStorageType').val(),
        vRemark: $('#txtRemarks').val(),
        iModifyBy: $("#hdnuserid").val(),
        vLocationCode: $("#hdnUserLocationCode").val(),
        DATAOPMODE: Operation
    }

    var InsertStorageTypeData = {
        Url: BaseUrl + "PmsStorageType/InsertEditStorageType",
        SuccessMethod: "SuccessMethod",
        Data: InsertPMSStorageType
    }

    if (validateform() == false) { }
    else {
        InsertPmsStroageTypeMaster(InsertStorageTypeData.Url, InsertStorageTypeData.SuccessMethod, InsertStorageTypeData.Data);
    }

});

$("#btnPmsStorageTypeClear").on("click", function () {
    $("#spnPmsStorageType").text('Save');
    $('#btnPmsStorageTypeSave').removeAttr("title");
    $('#btnPmsStorageTypeSave').attr("title", "Save");
    document.getElementById("divRemarkStorageType").style.display = "none";
    $('#txtStorageType').val("");
    $('#txtRemarks').val("");
});

$("#btnPmsStorageTypeExit").on("click", function () {
    ConfirmAlertBox(ModuleName, $("#RedirectToHome").val());
});

var InsertPmsStroageTypeMaster = function (Url, SuccessMethod, Data) {
    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        success: SuccessInsertMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Error in Insert Data.", ModuleName);
            
        }
    });
}

function SuccessInsertMethod() {

    var btnOperaion = (document.getElementById("spnPmsStorageType").innerText).toLowerCase().trim()

    if (btnOperaion == "save") {
        SuccessorErrorMessageAlertBox("Storage Type saved Successfully.", ModuleName);
        
    }
    else if (btnOperaion == "update") {
        document.getElementById("divRemarkStorageType").style.display = "none";
        $("#spnPmsStorageType").text('Save');
        SuccessorErrorMessageAlertBox("Storage Type updated Successfully.", ModuleName);
        
        
    }
    else if (btnOperaion == "delete") {
        document.getElementById("divRemarkStorageType").style.display = "none";
        $("#spnPmsStorageType").text('Save');
        SuccessorErrorMessageAlertBox("Storage Type inactivated Successfully.", ModuleName);
        
    }

    $('#txtStorageType').val("");
    $('#txtRemarks').val("");
    GetStorageType();
}

function GetStorageType() {
    var StorageAreaData = {
        Url: BaseUrl + "PmsStorageType/GetStoragetype/" + $("#hdnUserLocationCode").val() + "",
        SuccessMethod: "SuccessMethod"
    }

    // For Server use

    $.ajax({
        type: "GET",
        url: BaseUrl + "PmsStorageType/GetStoragetype",
        data: { id: $("#hdnUserLocationCode").val() },
        //contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessGetMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Data not found.", ModuleName);
        }
    });
      

    function SuccessGetMethod(jsonData) {
        
        var ActivityDataset = [];
        for (var i = 0; i < jsonData.length; i++) {
            var InDataset = [];
            var Edit_c = "";
            var InActive_c = "";
            srno = i + 1;
            
            if (viewmode == "OnlyView") {
                Edit_c = '<a data-tooltip="tooltip" title="Edit" class="disabled"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a>'
                InActive_c = '<a data-tooltip="tooltip" title="Inactive" class="disabled"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="glyphicon glyphicon-remove"></i> <span>Inactive</span></a>';
            }
            else {
                Edit_c = '<a title="Edit" attrid="' + jsonData[i].nStorageTypeId + '" Onclick=EditStorageType(this) style="cursor:pointer;" nStorageTypeID="' + jsonData[i].nStorageTypeId + '" vStorageType="' + jsonData[i].vStorageType + '"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a>'
                InActive_c = '<a title="Inactive" attrid="' + jsonData[i].nStorageTypeId + '"  Onclick=pmsStorageTypeDelete(this) style="cursor:pointer;" nStorageTypeID="' + jsonData[i].nStorageTypeId + '" vStorageType ="' + jsonData[i].vStorageType + '"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="glyphicon glyphicon-remove"></i> <span>Inactive</span></a>';
            }


            InDataset.push(jsonData[i].nStorageTypeId, i + 1, jsonData[i].vStorageType, Edit_c, '', InActive_c, jsonData[i].cStatusIndi);
            ActivityDataset.push(InDataset);
        }
        otable = $('#tblStorageTypeMst').dataTable({
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
            //"sScrollY": "200px",
            "sScrollX": "100%",
            "sScrollXInner": "1242" /* It varies dynamically if number of columns increases */,
            "fnCreatedRow": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $('td:eq(3)', nRow).append('<a href="Javascript:void(0);" title="Audit Trail" data-toggle="modal" data-target="#StorageTypeAudit" onclick=pmsStorageTypeAuditTrail(this) nStorageTypeID="' + aData[0] + '"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-file-text-o"></i><span>Audit</span></a>');

                if (aData[6] == "D") {
                    $(nRow).addClass('highlight');
                    $('td', nRow).eq(2).addClass('disabled');
                    $('td', nRow).eq(4).addClass('disabled');
                }

            },
            "columnDefs": [
                {
                    "targets": [0,6],
                    "visible": false,
                    "searchable": false
                },
                { "width": "5%", "targets": 1 },
                { "width": "25%", "targets": 2 },
                { "width": "5%", "targets": 3 },
                { "width": "5%", "targets": 4 },
                { "width": "5%", "targets": 5 },
                { "bSortable": false, "targets": 3 },
                { "bSortable": false, "targets": 4 },
                { "bSortable": false, "targets": 5 },
            ],
            "aoColumns": [
                { "sTitle": "StorageArea No" },
                { "sTitle": "Sr No" },
                //{ "sTitle": "Storage Type" },
                { "sTitle": "Location Room" },  // added by dharini 13-12-2022
                { "sTitle": "Edit" },
                { "sTitle": "Audit Trail" },
                { "sTitle": "Inactive" },
            ],
            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },
        });
    }



}

function EditStorageType(e) {
    nStorageTypeID = $(e).attr("nStorageTypeID");
    $('#txtStorageType').val($(e).attr("vStorageType"));
    $("#spnPmsStorageType").text('Update');
    document.getElementById("divRemarkStorageType").style.display = "block";
    $("#txtRemarks").show();
    $('#btnPmsStorageTypeSave').removeAttr("title");
    $('#btnPmsStorageTypeSave').attr("title", "Update");
}

function validateform() {
    var rowsData = $("#tblStorageTypeMst").dataTable().fnGetData();
    if (isBlank(document.getElementById('txtStorageType').value)) {
        ValidationAlertBox("Please enter Storage Type.", "txtStorageType", ModuleName);
        return false;
    }

    else if ((isBlank(document.getElementById('txtRemarks').value)) && (document.getElementById("spnPmsStorageType").innerText).toLowerCase().trim() == "update") {
        ValidationAlertBox("Please enter Remarks.", "txtRemarks", ModuleName);
        return false;
    }

    else if ((document.getElementById("spnPmsStorageType").innerText).toLowerCase().trim() == "save") {
        var StoregeAreaName = ($("#txtStorageType").val()).trim();
        var rows = $("#tblStorageTypeMst").dataTable().fnGetNodes();
        
        for (i = 0; i < rows.length; i++) {
            if (StoregeAreaName.toUpperCase() == $(rows[i]).find("td:eq(1)").html().trim().toUpperCase()) {
                if (rowsData[i][6] != 'D') {
                    ValidationAlertBox("This Storage Type name already exists.", "txtStorageType", ModuleName);
                    return false;
                    break;
                }
            }

        }
        return true;
    }

    else if ((document.getElementById("spnPmsStorageType").innerText).toLowerCase().trim() == "update") {
        var StoregeTypeName = ($("#txtStorageType").val()).trim();
        //var oTable = document.getElementById('tblStorageTypeMst');
        var rows = $("#tblStorageTypeMst").dataTable().fnGetNodes();
        for (i = 0; i < rows.length; i++) {
            if (StoregeTypeName.toUpperCase() == $(rows[i]).find("td:eq(1)").html().trim().toUpperCase()) {
                if (rowsData[i][6] != 'D') {
                    var StorageTypeNo = otable.fnGetData(i - 0)[0];
                    if (StorageTypeNo != nStorageTypeID) {
                        ValidationAlertBox("This Storage Type name already exists.", "txtStorageType", ModuleName);
                        return false;
                        break;
                    }
                }
            }
        }
        return true;
    }
}

function pmsStorageTypeAuditTrail(e) {
    var str = e.id;
    var title = "Storage Type";
    var fieldname = "vStorageType";
    //var locationno = $(e).attr("nStorageTypeID");;
    nStorageTypeID = $(e).attr("nStorageTypeID");

    var Data = {
        vTableName: "StorageTypeMstHIstory",
        vIdName: "nStorageTypeId",
        vIdValue: nStorageTypeID,
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
            //InDataset.push(jsonData[i].vFieldName, jsonData[i].Operation, (jsonData[i].vDesciprtion == "" ? "" : title + ' ' + jsonData[i].vDesciprtion), jsonData[i].vRemark, jsonData[i].vModifyBy, jsonData[i].dModifyOn);
            InDataset.push(jsonData[i].vFieldName, jsonData[i].Operation, jsonData[i].vRemark, jsonData[i].vModifyBy, jsonData[i].dModifyOn);
            ActivityDataset.push(InDataset);
        }
        otableAudit = $('#tblStorageAuditTrial').dataTable({
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
                         //{ "sTitle": " Desciprtion " },
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

function pmsStorageTypeDelete(e) {
    $('#txtReason').prop('disabled', false);
    $('#txtReason').val("");
    nStorageTypeID = $(e).attr("nStorageTypeID");
    var storagetype = $(e).attr("vStorageType");
    $('#txtStorageType').val(storagetype);
    $("#StorageTypeInctive").modal('show');
    document.getElementById("divRemarkStorageType").style.display = "none";
    $("#spnPmsStorageType").text('delete');
}

$("#btnInActiveSave").on("click", function () {
    if (isBlank(document.getElementById('txtReason').value)) {
        ValidationAlertBox("Please enter remarks to inactive Storage Type", "txtReason", ModuleName);
        
        return false;
    }

    var InActiveStorageTypeData = {
        nStorageTypeID: nStorageTypeID,
        vStorageType: $('#txtStorageType').val(),
        vRemark: $('#txtReason').val(),
        iModifyBy: $("#hdnuserid").val(),
        vLocationCode: $("#hdnUserLocationCode").val(),
        DATAOPMODE: "3"
    }

    var InActiveStorageType = {
        Url: BaseUrl + "PmsStorageType/InsertEditStorageType",
        SuccessMethod: "SuccessMethod",
        Data: InActiveStorageTypeData
    }
    InsertPmsStroageTypeMaster(InActiveStorageType.Url, InActiveStorageType.SuccessMethod, InActiveStorageType.Data);
    $("#txtStorageType").val("");
    $("#StorageTypeInctive").modal('hide');
    $("#txtReason").val("");
});

$("#btnInActiveClose").on("click", function () {
    $("#txtStorageType").val("");
    $("#txtRemarks").val("");
    $("#txtRemarks").hide();
    $("#spnPmsStorageType").text('Save');
    $("#StorageTypeInctive").modal('hide');
});