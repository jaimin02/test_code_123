var iUserNo;
var nProductTypeID;
var viewmode;
var ModuleName = "Product Type";

$(function () {
    iUserNo = $("#hdnuserid").val();
    nProductTypeID = null;
    GetViewMode();
    GetProductType();

    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('.modal').modal('hide');

});

$("#btnPmsProductTypeSave").on("click", function () {
    
    $("#loader").attr("style", "display:block");
    var Operation;
    var btnOperaion = (document.getElementById("spnPmsProductTypeSave").innerText).toLowerCase().trim();

    $("#txtProductType").val($.trim($("#txtProductType").val()));
    if (btnOperaion == "save") {
        Operation = 1;
    }
    else if (btnOperaion == "update") {
        Operation = 2;
    }
    var InsertPMSProductType = {
        nProductTypeID: nProductTypeID,
        vProductType: $('#txtProductType').val(),
        vRemark: $('#txtRemarks').val(),
        iModifyBy: $("#hdnuserid").val(),
        DATAOPMODE: Operation,
        vLocationCode: $("#hdnUserLocationCode").val(),

    }

    var InsertProductTypeData = {
        Url: BaseUrl + "PmsProductType/InsertEditProductType",
        SuccessMethod: "SuccessMethod",
        Data: InsertPMSProductType
    }

    if (validateform() == false)
    {
        $("#loader").attr("style", "display:none");
    }
    else {
        InsertPmsProductTypeMaster(InsertProductTypeData.Url, InsertProductTypeData.SuccessMethod, InsertProductTypeData.Data);
    }
    $("#loader").attr("style", "display:none");
});

$("#btnPmsProductTypeClear").on("click", function ()
{
    jQuery("#spnPmsProductTypeSave").text('Save');
    $('#btnPmsProductTypeSave').removeAttr("title");
    $('#btnPmsProductTypeSave').attr("title", "Save");
    document.getElementById("divRemarkProductType").style.display = "none";
    $('#txtProductType').val("");
    $('#txtRemarks').val("");
});

$("#btnPmsProductTypeExit").on("click", function ()
{
    ConfirmAlertBox(ModuleName, $("#RedirectToHome").val());
    
});

var InsertPmsProductTypeMaster = function (Url, SuccessMethod, Data) {
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
    $('#txtProductType').val("");
    $('#txtRemarks').val("");
    GetProductType();

    var btnOperaion = (document.getElementById("spnPmsProductTypeSave").innerText).toLowerCase().trim();

    if (btnOperaion == "save") {
        SuccessorErrorMessageAlertBox("Product Type saved successfully.", ModuleName);
        
    }
    else if (btnOperaion == "update") {
        document.getElementById("divRemarkProductType").style.display = "none";
        jQuery("#spnPmsProductTypeSave").text('Save');
        $('#btnPmsProductTypeSave').removeAttr("title");
        $('#btnPmsProductTypeSave').attr("title", "Save");
        SuccessorErrorMessageAlertBox("Product Type updated successfully.", ModuleName);
        
    }
    else if (btnOperaion == "delete") {
        document.getElementById("divRemarkProductType").style.display = "none";
        jQuery("#spnPmsProductTypeSave").text('Save');
        $('#btnPmsProductTypeSave').removeAttr("title");
        $('#btnPmsProductTypeSave').attr("title", "Save");
        SuccessorErrorMessageAlertBox("Product Type inactivated successfully.", ModuleName);
        
    }
}

function GetProductType() {
    var ProductTypeData = {
        Url: BaseUrl + "PmsProductType/AllProductType",
        SuccessMethod: "SuccessMethod"
    }
    var FilterData = {
        vLocationCode: $("#hdnUserLocationCode").val()
    }
    $.ajax({
        url: ProductTypeData.Url,
        type: 'POST',
        asyc: false,
        data:FilterData ,
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
                Edit_c = '<a title="Edit" attrid="' + jsonData[i].nProductTypeID + '" Onclick=EditProductType(this) style="cursor:pointer;" nProductTypeID="' + jsonData[i].nProductTypeID + '" vProductType="' + jsonData[i].vProductType + '"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a>'
                InActive_c = '<a href="Javascript:void(0);"  title="Inactive" id="1" onclick=pmsProductTypeDelete(this) nProductTypeID="' + jsonData[i].nProductTypeID + '" vProductType ="' + jsonData[i].vProductType + '"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="glyphicon glyphicon-remove"></i> <span>Inactive</span></a>'
            }
            InDataset.push(jsonData[i].nProductTypeID, srno, jsonData[i].vProductType, Edit_c, '', InActive_c, jsonData[i].cStatusIndi);
            ActivityDataset.push(InDataset);
        }
        otable = $('#tblProductTypeMst').dataTable({
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
                $('td:eq(3)', nRow).append('<a href="Javascript:void(0);" title="Audit Trail" data-toggle="modal" data-target="#ProductTypeAudit" onclick=pmsProductTypeAuditTrail(this) nProductTypeID="' + aData[0] + '"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-file-text-o"></i><span>Audit</span></a>');
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
                { "bSortable": false, "targets": [3,4,5] },
                { "width": "1%", "targets": 1 },
                { "width": "10%", "targets": 2 },
                { "width": "1%", "targets": 3 },
                { "width": "1%", "targets": 4 },
                { "width": "1%", "targets": 5 },
            ],
            "aoColumns": [
                { "sTitle": "ProductArea No" },
                { "sTitle": "Sr No" },
                { "sTitle": "Product Type" },
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

function EditProductType(e) {
    nProductTypeID = $(e).attr("nProductTypeID");
    $('#txtProductType').val($(e).attr("vProductType"));
    jQuery("#spnPmsProductTypeSave").text('Update');
    $('#btnPmsProductTypeSave').removeAttr("title");
    $('#btnPmsProductTypeSave').attr("title", "Update");
    document.getElementById("divRemarkProductType").style.display = "block";
    $("#txtRemarks").show();
}

function validateform() {
    var rowsData = $("#tblProductTypeMst").dataTable().fnGetData();
    if (isBlank(document.getElementById('txtProductType').value)) {
        ValidationAlertBox("Please enter Product Type.", "txtProductType", ModuleName);
        
        return false;
    }

    else if ((isBlank(document.getElementById('txtRemarks').value)) && (document.getElementById("spnPmsProductTypeSave").innerText).toLowerCase().trim() == "update") {
        ValidationAlertBox("Please enter Remarks.", "txtRemarks", ModuleName);
        
        return false;
    }

  

    else if (document.getElementById("spnPmsProductTypeSave").innerText.toLowerCase().trim() == "save") {
        $("#txtProductType").val($.trim($("#txtProductType").val()));
        var StoregeAreaName = $("#txtProductType").val()
        var rows = $("#tblProductTypeMst").dataTable().fnGetNodes();
    

        for (i = 0; i < rows.length; i++) {
            if (StoregeAreaName.toUpperCase() == $(rows[i]).find("td:eq(1)").html().trim().toUpperCase()) {
                if (rowsData[i][6] != 'D') {
                    ValidationAlertBox("This Product Type already exists.", "txtProductType", ModuleName);
                    return false;
                    break;
                }
            }

        }
        return true;
    }
    else if ((document.getElementById("spnPmsProductTypeSave").innerText).toLowerCase().trim() == "update") {
        var StoregeTypeName = ($("#txtProductType").val()).trim();
        var rows = $("#tblProductTypeMst").dataTable().fnGetNodes();
        for (i = 0; i < rows.length; i++) {
            if (StoregeTypeName.toUpperCase() == $(rows[i]).find("td:eq(1)").html().trim().toUpperCase()) {
                if (rowsData[i][6] != 'D') {
                    var ProductTypeNo = otable.fnGetData(i - 0)[0];
                    if (ProductTypeNo != nProductTypeID) {
                        ValidationAlertBox("This Product Type already exists.", "txtProductType", ModuleName);

                        return false;
                        break;
                    }
                }
            }
        }
        return true;
    }
}

function pmsProductTypeAuditTrail(e) {
    var str = e.id;
    var title = "Product Type";
    var fieldname = "vProductType";
    nProductTypeID = $(e).attr("nProductTypeID");

    var Data = {
        vTableName: "ProductTypeMstHIstory",
        vIdName: "nProductTypeId",
        vIdValue: nProductTypeID,
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
        otable1 = $('#tblProductAuditTrial').dataTable({
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
                         //{ "sTitle": "Description " },
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

function pmsProductTypeDelete(e) {
    $('#txtReason').prop('disabled', false);
    $("#txtReason").val("");
    nProductTypeID = $(e).attr("nProductTypeID")
    var ProductType = $(e).attr("vProductType")

    $('#txtProductType').val(ProductType);

    $("#ProductTypeInctive").modal('show');

    jQuery("#spnPmsProductTypeSave").text('delete');
    document.getElementById("divRemarkProductType").style.display = "none";
}

$("#btnInActiveSave").on("click", function () {
    if (isBlank(document.getElementById('txtReason').value)) {
        ValidationAlertBox("Please enter reason for inactive Product Type.", "txtReason", ModuleName);
        
        return false;
    }

    var InActiveProductTypeData = {
        nProductTypeID: nProductTypeID,
        vProductType: $('#txtProductType').val(),
        vRemark: $('#txtReason').val(),
        iModifyBy: $("#hdnuserid").val(),
        DATAOPMODE: "3",
        vLocationCode: $("#hdnUserLocationCode").val()
    }
    var InActiveProductType = {
        Url: BaseUrl + "PmsProductType/InsertEditProductType",
        SuccessMethod: "SuccessMethod",
        Data: InActiveProductTypeData
    }

    InsertPmsProductTypeMaster(InActiveProductType.Url, InActiveProductType.SuccessMethod, InActiveProductType.Data);
    $("#txtProductType").val("");
    $("#txtReason").val("");
});

$("#btnInActiveClose").on("click", function () {
    $("#txtProductType").val("");
    $("#txtRemarks").val("");
    $("#txtRemarks").hide();
    $("#ProductTypeInctive").modal('hide');
    jQuery("#spnPmsProductTypeSave").text('Save');
    $('#btnPmsProductTypeSave').removeAttr("title");
    $('#btnPmsProductTypeSave').attr("title", "Save");
});

//function GetViewMode() {
//    var ViewModeIDWebConfig = $("#hdnViewModeID").val().split(",");
//    for (i = 0; i < ViewModeIDWebConfig.length; i++) {
//        if ($("#hdnUserTypeCode").val().trim() == ViewModeIDWebConfig[i]) {
//            document.getElementById('btnPmsProductTypeSave').style.visibility = "hidden";
//            viewmode = "OnlyView";
//            break;
//        }
//        else {
//            viewmode = "";
//        }
//    }
//}