var nStorageAreaNo;
var viewmode;
var ModuleName = "Storage Area"

$(document).ready(function () {
    GetStorageLocation();
    GetStorageType();
    iStorageAreaNo = null;
    GetStorageAreaData();
    $("#tblStorageArea").hide();

    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('.modal').modal('hide');

    GetViewMode();
});

function GetStorageLocation() {
    var FilterData = {
        ModifyBy: $("#hdnuserid").val(),
        vLocationCode: $("#hdnUserLocationCode").val()
    }
    GetPmsStorageLocation = {
        Url: BaseUrl + "PmsStorageLocation/AllStorageLocationData",
        SuccessMethod: "SuccessMethod",
    }

    $.ajax({
        url: GetPmsStorageLocation.Url,
        type: 'POST',
        data:FilterData,
        asyc:false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Storage Location not found.", ModuleName);
            
        }
    });

    function SuccessMethod(jsonData) {
        if (jsonData.length > 0) {
            $("#ddlStorageLocation").empty().append('<option selected="selected" value="0">Please Select Storage Location</option>');
            for (var i = 0; i < jsonData.length; i++) {
                if (jsonData[i].StatusIndi != 'D') {
                    $("#ddlStorageLocation").append($("<option></option>").val(jsonData[i].StorageLocationNo).html(jsonData[i].StorageLocationName));
                }
            }
        }
    }
}

function GetStorageType() {
    GetPmsStorageType = {
        Url: BaseUrl + "PmsStorageArea/GetStorageType/" + $("#hdnUserLocationCode").val() + "",
        SuccessMethod: "SuccessMethod",
    }

    // For Server use

    $.ajax({
        type: "GET",
        url: BaseUrl + "PmsStorageArea/GetStoragetype",
        data: { id: $("#hdnUserLocationCode").val() },
        //contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Storage Type not found", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        if (jsonData.length > 0) {
            $("#ddlStorageType").empty().append('<option selected="selected" value="0">Please Select Storage Type</option>');
            for (var i = 0; i < jsonData.length; i++) {
                $("#ddlStorageType").append($("<option></option>").val(jsonData[i].nStorageTypeId).html(jsonData[i].vStorageType));
            }
        }
    }
}

function AddTempPmsStorageArea() {

    if (validateform() == false) { }
    else
    {
        $("#tbodyStorageArea").append('<tr><td>' + $("#ddlStorageLocation :selected").text() + '</td><td>' + $("#ddlStorageType :selected").text() + '</td><td>' + $("#txtStorageArea").val() + '</td><td>' + $("#txtCompartment").val() + '</td><td>' + $("#txtRack").val() + '</td>><td class="hidetd">' + $("#ddlStorageLocation :selected").val() + '</td>><td  class="hidetd">' + $("#ddlStorageType :selected").val() + '</td><td id="trRemove"><span class="glyphicon glyphicon-remove"></span></td></tr>')
        $(".hidetd").hide();
        $("#tblStorageArea thead").show();
        $("#tblStorageArea").show();
        $("#btnaddPmsStorageArea").show();
        ClearTextBoxDetailPart();
    }
}

$("#tblStorageArea").on('click', '#trRemove', function () {
    $(this).closest('tr').remove();
    if ($("#tblStorageArea tr").length == 1) {
        $("#tblStorageArea").hide();
        $("#btnaddPmsStorageArea").hide();
    }
    else {
        $("#tblStorageArea").show();
        $("#btnaddPmsStorageArea").show();
    }
});

$("#btnaddPmsStorageArea").on("click", function () {
    $("#loader").attr("style", "display:block");
    var Operation;
    var btnOperaion = (document.getElementById("spnaddPmsStorageArea").innerText).toLowerCase().trim()

    if (btnOperaion == "save") {
        Operation = 1;
        var HTMLtbl =
        {
            getData: function (table) {
                var data = [];
                table.find('tr').not(':first').each(function (rowIndex, r) {
                    var cols = [];
                    $(this).find('td').each(function (colIndex, c) {

                        if ($(this).children(':text,:hidden,textarea,select').length > 0)
                            cols.push($(this).children('input,textarea,select').val().trim());

                        else if ($(this).children(':checkbox').length > 0)
                            cols.push($(this).children(':checkbox').is(':checked') ? 1 : 0);
                        else
                            cols.push($(this).text().trim());
                    });
                    data.push(cols);
                });
                return data;
            }
        }

        var data = HTMLtbl.getData($('#tblStorageArea'));  // passing that table's ID //

        for (i = 0; i < data.length; i++) {
            var storedata = data[i];
            var InsertPMSStorageAreaData = {
                nStorageAreaNo: nStorageAreaNo,
                nStorageLocationNo: storedata[5],
                nStorageTypeId: storedata[6],
                vStorageAreaName: storedata[2],
                vCompartmentName: storedata[3],
                vRackName: storedata[4],
                vRemark: $("#txtRemarks").val(),
                iModifyBy: $("#hdnuserid").val(),
                DATAOPMODE: Operation,
                vLocationCode: $("#hdnUserLocationCode").val(),

            }

            var InsertStorageAreaData = {
                Url: BaseUrl + "PmsStorageArea/InsertEditPmsStorageArea",
                SuccessMethod: "SuccessMethod",
                Data: InsertPMSStorageAreaData
            }
            InsertPmsStorageAreaMaster(InsertStorageAreaData.Url, InsertStorageAreaData.SuccessMethod, InsertStorageAreaData.Data);
        }
        SuccessorErrorMessageAlertBox("Storage Area saved successfully.", ModuleName);
        
        GetStorageAreaData();
    }
    else if (btnOperaion == "update") {
        Operation = 2;
        var InsertPMSStorageAreaData = {
            nStorageAreaNo: nStorageAreaNo,
            nStorageLocationNo: $("#ddlStorageLocation").val(),
            nStorageTypeId: $("#ddlStorageType").val(),
            vStorageAreaName: $("#txtStorageArea").val(),
            vCompartmentName: $("#txtCompartment").val(),
            vRackName: $("#txtRack").val(),
            vRemark: $("#txtRemarks").val(),
            iModifyBy: $("#hdnuserid").val(),
            DATAOPMODE: Operation
        }

        var InsertStorageAreaData = {
            Url: BaseUrl + "PmsStorageArea/InsertEditPmsStorageArea",
            SuccessMethod: "SuccessMethod",
            Data: InsertPMSStorageAreaData
        }

        if (validateform() == false) {
            $("#loader").attr("style", "display:none");
            return false;
        }
        else {
            InsertPmsStorageAreaMaster(InsertStorageAreaData.Url, InsertStorageAreaData.SuccessMethod, InsertStorageAreaData.Data);
            SuccessorErrorMessageAlertBox("Storage Area updated successfully.", ModuleName);
            
            
        }
    }
    $("#loader").attr("style", "display:none");
})

$("#ddlStorageLocation").on("change", function () {
    LocationType();
});

$("#btnaddPmsStorageArea").on("click", function () {

});

$("#btnExitPmsStorageArea").on("click", function () {
    ConfirmAlertBox(ModuleName, $("#RedirectToHome").val());
    
});

$("#btnClearPmsStorageArea").on("click", function () {
    ClearTextBoxDetailPart();
    ClearTextBoxHeaderPart();
});

$("#btnInActiveSave").on("click", function () {
    if (isBlank(document.getElementById('txtReason').value)) {
        ValidationAlertBox("Please enter remarks to Inactive Storage Area.", "txtReason", ModuleName);
        
        return false;
    }


    var InActiveStorageTypeData = {
        nStorageAreaNo: nStorageAreaNo,
        nStorageLocationNo: $("#ddlStorageLocation").val(),
        nStorageTypeId: $("#ddlStorageType").val(),
        vStorageAreaName: $("#txtStorageArea").val(),
        vCompartmentName: $("#txtCompartment").val(),
        vRackName: $("#txtRack").val(),
        vRemark: $('#txtRemarks').val(),
        iModifyBy: $("#hdnuserid").val(),
        vRemark: $("#txtReason").val(),
        vLocationCode: $("#hdnUserLocationCode").val(),
        DATAOPMODE: "3"
    }

    var InsertStorageAreaData = {
        Url: BaseUrl + "PmsStorageArea/InsertEditPmsStorageArea",
        SuccessMethod: "SuccessMethod",
        Data: InActiveStorageTypeData
    }


    InsertPmsStorageAreaMaster(InsertStorageAreaData.Url, InsertStorageAreaData.SuccessMethod, InsertStorageAreaData.Data);
    $("#txtReason").val("");
    GetStorageAreaData();
    $("#txtStorageType").val("");
    SuccessorErrorMessageAlertBox("Storage Area Inactivated successfully.", ModuleName);
    
});

var InsertPmsStorageAreaMaster = function (Url, SuccessMethod, Data) {
    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        async: false,
        success: SuccessInsertData,
        error: function () {
            SuccessorErrorMessageAlertBox("Error in insert data in Storage Area.", ModuleName);
            
        }
    });

    function SuccessInsertData(response) {
        $("#tblStorageArea tbody tr").remove();
        $("#tblStorageArea thead").hide();
        $("#btnaddPmsStorageArea").hide();
        var result = response.d;
        GetStorageAreaData();
    }
};

function GetStorageAreaData() {
    GetPmsStorageAreaData = {
        Url: BaseUrl + "PmsStorageArea/AllStorageArea",
        SuccessMethod: "SuccessMethod",
    }
    var FilterData = {
        vLocationCode: $("#hdnUserLocationCode").val()
    }
    $.ajax({
        url: GetPmsStorageAreaData.Url,
        type: 'POST',
        data:FilterData,
        asyc: false,
        success: SuccessMethod,
        asyn:false,
        error: function () {
            SuccessorErrorMessageAlertBox("No Storage Type found.", ModuleName);
            
        }
    });

    function SuccessMethod(jsonData) {
        var ActivityDataset = [];
        for (var i = 0; i < jsonData.length; i++) {
            var InDataset = [];
            var Edit_c;
            var InActive_C;
            if (viewmode == "OnlyView") {
                Edit_c = '<a data-tooltip="tooltip" title="Edit" class="disabled"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a>'
                InActive_c = '<a data-tooltip="tooltip" title="Inactive" class="disabled"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a mb-10"><i class="glyphicon glyphicon-remove"></i> <span>Inactive</span></a>';
            }
            else {
                Edit_c = '<a data-toggle="modal" title="Edit" data-target="#StorageAreaModel" attrid="' + jsonData[i].nStorageAreaNo + '" Onclick=EditStorageArea(this) style="cursor:pointer;" nStorageAreaNo="' + jsonData[i].nStorageAreaNo + '" nStorageLocationNo="' + jsonData[i].nStorageLocationNo + '" nStorageTypeId="' + jsonData[i].nStorageTypeId + '" vStorageAreaName="' + jsonData[i].vStorageAreaName + '" vCompartmentName="' + jsonData[i].vCompartmentName + '" vRackName="' + jsonData[i].vRackName + '"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a>'
                InActive_c = '<a href="Javascript:void(0);"  title="Inactive" onclick=pmsStorageAreaDelete(this) nStorageAreaNo="' + jsonData[i].nStorageAreaNo + '"  vStorageAreaName="' + jsonData[i].vStorageAreaName + '"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a mb-10"><i class="glyphicon glyphicon-remove"></i> <span>Inactive</span></a>'
            }

            InDataset.push(jsonData[i].nStorageAreaNo, jsonData[i].nStorageLocationNo, jsonData[i].nStorageTypeId, jsonData[i].vStorageLocationName,
                           jsonData[i].vStorageType, jsonData[i].vStorageAreaName, jsonData[i].vCompartmentName, jsonData[i].vRackName,
                           Edit_c, '', InActive_c, jsonData[i].cStatusIndi);
            ActivityDataset.push(InDataset);
        }
        otableStorageArea = $('#tblPmsStorageAreaData').dataTable({
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
            "responsive": true,
            "sScrollX": "100%",
            "sScrollXInner": "1260" /* It varies dynamically if number of columns increases */,
            "fnCreatedRow": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $('td:eq(6)', nRow).append('<a href="Javascript:void(0);" title="Audit Trail" data-toggle="modal" data-target="#StorageAreaModel" onclick=pmsStorageAreaAuditTrail(this) nStorageAreaNo="' + aData[0] + '" nStorageLocationNo="' + aData[1] + '" nStorageTypeId="' + aData[2] + '" vStorageAreaName="' + aData[5] + '" vCompartmentName="' + aData[6] + '" vRackName="' + aData[7] + '"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-file-text-o"></i><span>Audit</span></a>');

                if (aData[11] == 'D') {
                    $(nRow).addClass('highlight');
                    $('td', nRow).eq(5).addClass('disabled');
                    $('td', nRow).eq(7).addClass('disabled');

                }
            },
            "columnDefs": [
                {
                    "targets": [0, 1, 2,11],
                    "visible": false,
                    "searchable": false
                },
                { "width": "10%", "targets": 3 },
                { "width": "3%", "targets": 4 },
                { "width": "3%", "targets": 5 },
                { "width": "3%", "targets": 6 },
                { "width": "3%", "targets": 7 },
                { "width": "2%", "targets": 8 },
                { "width": "3%", "targets": 9 },
                { "width": "2%", "targets": 10 },
                { "bSortable": false, "targets": 8 },
                { "bSortable": false, "targets": 9 },
                { "bSortable": false, "targets": 10 },

            ],
            "aoColumns": [
                { "sTitle": "Storage Area No" },
                { "sTitle": "Storage Location No" },
                { "sTitle": "Storage Type Id" },
                { "sTitle": "Storage Location Name" },
                { "sTitle": "Storage Type" },
                { "sTitle": "Storage Area" },
                { "sTitle": "Compartment Name" },
                { "sTitle": "Rack Name" },
                { "sTitle": "Edit" },
                { "sTitle": "Audit Trail" },
                { "sTitle": "Inactive" },
                { "sTitle": "cStatusIndi" },

            ],
            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },
        });
    }
}

function EditStorageArea(e) {
    $('.form-control').each(function () {
        $(this).attr('disabled', false);
    });
    $("#btnaddPmsStorageArea").attr("style", "display:inline");
    $("#btnClearPmsStorageArea").attr("style", "display:inline");

    $('.AuditControl').each(function () { this.style.display = "none"; });
    jQuery("#titleMode").text('Mode:-Edit');
    jQuery("#spnaddPmsStorageArea").text('Update');
    $('#btnaddPmsStorageArea').removeAttr("title");
    $('#btnaddPmsStorageArea').attr("title", "Update");
    nStorageAreaNo = $(e).attr("nStorageAreaNo");
    $('#txtStorageArea').val($(e).attr("vStorageAreaName"));
    $('#txtCompartment').val($(e).attr("vCompartmentName"));
    $('#txtRack').val($(e).attr("vRackName"));
    $('#ddlStorageLocation').val($(e).attr("nStorageLocationNo"));
    $('#ddlStorageType').val($(e).attr("nStorageTypeId"));
    $("#btnAddLot").hide();
    $('#txtRemarks').val('');
    document.getElementById("divRemarkStorageArea").style.display = "block";
    $("#btnaddPmsStorageArea").show();
    $("#tblStorageArea tbody tr").remove();
    $("#tblStorageArea thead").hide();
    LocationType();
}

function ClearTextBoxHeaderPart() {
    $('#ddlStorageLocation').val("0");
    $('#ddlStorageType').val("0");
    $("#ddlLocationType").empty().append('<option selected="selected" value="0">Please Select Location Type</option>');
}

function ClearTextBoxDetailPart() {
    $('#txtStorageArea').val("");
    $('#txtCompartment').val("");
    $('#txtRack').val("");
    $("#txtRemarks").val("");
}

function validateform() {
    var rowsData = $("#tblPmsStorageAreaData").dataTable().fnGetData();
    if (Dropdown_Validation(document.getElementById("ddlStorageType"))) {
        ValidationAlertBox("Please select Storage Type.", "ddlStorageType", ModuleName);
        return false;
    }

    if (Dropdown_Validation(document.getElementById("ddlStorageLocation"))) {
        ValidationAlertBox("Please select Storage Location.", "ddlStorageLocation", ModuleName);
        return false;
    }

    if (isBlank(document.getElementById('txtStorageArea').value)) {
        ValidationAlertBox("Please enter Storage Area.", "txtStorageArea", ModuleName);
        return false;
    }

    if (isBlank(document.getElementById('txtCompartment').value)) {
        ValidationAlertBox("Please enter Compartment.", "txtCompartment", ModuleName);
        return false;
    }

    if (isBlank(document.getElementById('txtRack').value)) {
        ValidationAlertBox("Please enter Rack.", "txtRack", ModuleName);
        return false;
    }

    //if (isNumeric(document.getElementById('txtRack').value, document.getElementById('txtRack').id)) {
    //    ValidationAlertBox("Please enter Rack in numeric value.", "txtRack", ModuleName);
    //    return false;
    //}


    if ((isBlank(document.getElementById('txtRemarks').value)) && (document.getElementById("spnaddPmsStorageArea").innerText).toLowerCase().trim() == "update") {
        ValidationAlertBox("Please enter Remarks.", "txtRemarks", ModuleName);
        return false;
    }

    if ((document.getElementById("spnaddPmsStorageArea").innerText).toLowerCase().trim() == "save") {
        if (document.getElementById("btnAddLot").innerText == "Add") {
            var StoregeAreaName = ($("#txtStorageArea").val()).trim();
            var CompartmentName = ($("#txtCompartment").val()).trim();
            var RackName = ($("#txtRack").val()).trim();
            var ErrorMessage = "";
            var table = $("#tblStorageArea tbody");
            table.find('tr').each(function (i) {
                var $tds = $(this).find('td');
                var tempStorageArea = $tds.eq(2).text();
                var tempCompartmentName = $tds.eq(3).text();
                var temprack = $tds.eq(4).text();

                if (tempStorageArea.trim().toUpperCase() == StoregeAreaName.trim().toUpperCase())
                {
                    if (tempCompartmentName.trim().toUpperCase() == CompartmentName.trim().toUpperCase())
                    {
                        if (temprack.trim().toUpperCase() == RackName.trim().toUpperCase())
                        {
                            ErrorMessage = "This Storage Area,Compartment and Rack already added in table";
                            return false;
                        }
                    }
                }
            });

            if (ErrorMessage != "") {
                ValidationAlertBox(ErrorMessage, "txtRack", ModuleName);
                return false;
            }

            var rows = $("#tblPmsStorageAreaData").dataTable().fnGetNodes();
           

            for (i = 0; i < rows.length; i++) {
                if (StoregeAreaName.toUpperCase() == $(rows[i]).find("td:eq(2)").html().trim().toUpperCase()) {
                    if (CompartmentName.toUpperCase() == $(rows[i]).find("td:eq(3)").html().trim().toUpperCase()) {
                        if (RackName.toUpperCase() == $(rows[i]).find("td:eq(4)").html().trim().toUpperCase()) {
                            if (rowsData[i][11] != 'D') {
                                ValidationAlertBox("This Storage Area already added by you", "txtRack", ModuleName);
                                return false;
                                break;
                            }
                        }
                    }
                }
            }
            return true;
        }

        else if ((document.getElementById("spnaddPmsStorageArea").innerText).toLowerCase().trim() == "save") {
            var StoregeAreaName = ($("#txtStorageArea").val()).trim();
            var CompartmentName = ($("#txtCompartment").val()).trim();
            var RackName = ($("#txtRack").val()).trim();
            var rows = $("#tblPmsStorageAreaData").dataTable().fnGetNodes();
            var rowsData = $("#tblPmsStorageAreaData").dataTable().fnGetData();

            for (i = 0; i < rows.length; i++) {
                if (StoregeAreaName.toUpperCase() == $(rows[i]).find("td:eq(2)").html().trim().toUpperCase()) {
                    if (CompartmentName.toUpperCase() == $(rows[i]).find("td:eq(3)").html().trim().toUpperCase()) {
                        if (RackName.toUpperCase() == $(rows[i]).find("td:eq(4)").html().trim().toUpperCase()) {

                            if (rowsData[i][11] != 'D') {
                                ValidationAlertBox("This Storage Area already exists.", "txtRack", ModuleName);

                                return false;
                                break;
                            }
                        }
                    }
                }

            }
            return true;
        }
    }
    else if ((document.getElementById("spnaddPmsStorageArea").innerText).toLowerCase().trim() == "update") {
        var StoregeAreaName = ($("#txtStorageArea").val()).trim();
        var CompartmentName = ($("#txtCompartment").val()).trim();
        var RackName = ($("#txtRack").val()).trim();
        var rows = $("#tblPmsStorageAreaData").dataTable().fnGetNodes();

        for (i = 0; i < rows.length; i++) {
            if (StoregeAreaName.toUpperCase() == $(rows[i]).find("td:eq(2)").html().trim().toUpperCase()) {
                if (CompartmentName.toUpperCase() == $(rows[i]).find("td:eq(3)").html().trim().toUpperCase()) {
                    if (RackName.toUpperCase() == $(rows[i]).find("td:eq(4)").html().trim().toUpperCase()) {
                        if (rowsData[i][11] != 'D') {
                            var StorageAreaNo = otableStorageArea.fnGetData(i)[0];
                            if (StorageAreaNo != nStorageAreaNo) {
                                ValidationAlertBox("This Storage Area already exists.", "txtRack", ModuleName);

                                return false;
                                break;
                            }
                        }
                    }
                }
            }
        }
        return true;
    }


    //else { return true; }

}

function StorageArea() {
    $('.form-control').each(function () {
        $(this).attr('disabled', false);
    });
    $("#btnaddPmsStorageArea").attr("style", "display:inline");
    $("#btnClearPmsStorageArea").attr("style", "display:inline");

    $('.AuditControl').each(function () { this.style.display = "none"; });
    ClearTextBoxDetailPart();
    ClearTextBoxHeaderPart();
    jQuery("#titleMode").text('Mode:-Add');
    document.getElementById("divRemarkStorageArea").style.display = "none";
    jQuery("#spnaddPmsStorageArea").text('Save');
    $("#btnAddLot").show();
    $("#tblStorageArea tbody tr").remove();
    $("#tblStorageArea thead").hide();

}

function pmsStorageAreaDelete(e) {
    $('#txtReason').prop('disabled', false);
    $("#txtReason").val("");
    nStorageAreaNo = $(e).attr("nStorageAreaNo");
    var StorageAreaName = $(e).attr("vStorageAreaName");
    //document.getElementById("btnaddPmsStorageArea").innerText = "delete"
   
    SelectionData(nStorageAreaNo);
}

function pmsStorageAreaAuditTrail(e) {
    jQuery("#titleMode").text('Audit Trail');
    $("#divRemarkStorageArea").attr("style", "display:none");
    $("#divRemarkStorageArea").attr("style", "display:none");
    $("#btnAddLot").attr("style", "display:none");
    
    $('.AuditControl').each(function () { this.style.display = "inline"; });
    $('.form-control').each(function () {
        $(this).attr('disabled', true);
    });
    $("#btnaddPmsStorageArea").attr("style", "display:none");
    $("#btnClearPmsStorageArea").attr("style", "display:none");
    nStorageAreaNo = $(e).attr("nStorageAreaNo");
    $('#txtStorageArea').val($(e).attr("vStorageAreaName"));
    $('#txtCompartment').val($(e).attr("vCompartmentName"));
    $('#txtRack').val($(e).attr("vRackName"));
    $('#ddlStorageLocation').val($(e).attr("nStorageLocationNo"));
    $('#ddlStorageType').val($(e).attr("nStorageTypeId"));
    LocationType();
}

$("#tblStorageArea").on('click', '#trRemove', function () {
    $(this).closest('tr').remove();
    if ($("#tblStorageArea tr").length == 1) {
        $("#tblStorageArea").hide();
        $("#btnaddPmsStorageArea").hide();
    }
    else {
        $("#tblStorageArea").show();
        $("#btnaddPmsStorageArea").show();
    }
});

function AuditTrail(e) {
    var str = e.id;
    var title = $(e).attr("titlename");
    var fieldname = str.substring(4);
    var iUserNo = $("#hdnuserid").val();
    var Data = {
        vTableName: "StorageAreaMstHistory",
        vIdName: "iStorageAreaNo",
        vIdValue: nStorageAreaNo,
        vFieldName: fieldname,
        iUserId: iUserNo
    }

    $('#tblPmsTransporterAuditTrial > tbody > tr:nth-child(n+1)').remove();
    $.ajax({
        url: BaseUrl + "PmsGeneral/AuditTrail",
        type: 'POST',
        data: Data,
        async: false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("No data found in Audit Trail.", ModuleName);
            
        }
    });

    function SuccessMethod(jsonData) {
        var strdata = "";
        var locationtype;
        var Desciprtion;

        var ActivityDataset = [];
        for (var i = 0; i < jsonData.length; i++) {
            var InDataset = [];

            if ("cStorageLocationType" == fieldname) {

                if (jsonData[i].vFieldName == "L") {
                    locationtype = "Locker";
                }
                else if (jsonData[i].vFieldName == "R") {
                    locationtype = "Racks";
                }
                else if (jsonData[i].vFieldName == "C") {
                    locationtype = "Compactor";
                }

                if ((jsonData[i].vDesciprtion).match(/L To R/))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("L To R", "Locker To Racks");
                else if ((jsonData[i].vDesciprtion).match(/L To C/))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("L To C", "Locker To Compactor");
                else if (jsonData[i].vDesciprtion.match("R To L "))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("R To L", "Racks To Locker");
                else if (jsonData[i].vDesciprtion.match("R To C"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("R To C", "Racks To Center");
                else if (jsonData[i].vDesciprtion.match("C To R"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("C To R", "Compactor To Racks");
                else if (jsonData[i].vDesciprtion.match("C To L"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("C To L", "Compactor To Locker");
                else
                    Desciprtion = jsonData[i].vDesciprtion + " " + locationtype;

                //InDataset.push(locationtype, jsonData[i].Operation, title + ' ' + Desciprtion, jsonData[i].vRemark, jsonData[i].vModifyBy, jsonData[i].dModifyOn);
                InDataset.push(locationtype, jsonData[i].Operation,  jsonData[i].vRemark, jsonData[i].vModifyBy, jsonData[i].dModifyOn);
            }
            else {
                //InDataset.push(jsonData[i].vFieldName, jsonData[i].Operation, title + ' ' + jsonData[i].vDesciprtion, jsonData[i].vRemark, jsonData[i].vModifyBy, jsonData[i].dModifyOn);
                InDataset.push(jsonData[i].vFieldName, jsonData[i].Operation, jsonData[i].vRemark, jsonData[i].vModifyBy, jsonData[i].dModifyOn);
            }
            ActivityDataset.push(InDataset);


        }
        otable = $('#tblPmsStorageAreaAuditTrial').dataTable({
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
                         { "sTitle": "Operations" },
                         //{ "sTitle": " Description " },
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

function StorageArea() {
    $('.form-control').each(function () {
        $(this).attr('disabled', false);
    });
    //$("#btnaddPmsStorageArea").attr("style", "display:inline");
    $("#btnClearPmsStorageArea").attr("style", "display:inline");

    $('.AuditControl').each(function () { this.style.display = "none"; });
    ClearTextBoxDetailPart();
    ClearTextBoxHeaderPart();
    jQuery("#titleMode").text('Mode:-Add');
    document.getElementById("divRemarkStorageArea").style.display = "none";
    jQuery("#spnaddPmsStorageArea").text('Save');
    $("#btnAddLot").show();
    $("#tblStorageArea tbody tr").remove();
    $("#tblStorageArea thead").hide();
    $("#btnaddPmsStorageArea").hide();

}

function LocationType() {
    var storagelocation = $("#ddlStorageLocation :selected").val();

    // For Server use

    $.ajax({
        type: "GET",
        url: BaseUrl + "PmsStorageArea/GetLocationType",
        data: { id: storagelocation },
       // contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessMethodLocationType,
        error: function () {
            SuccessorErrorMessageAlertBox("Location Type not found.", ModuleName);
        }
    });


    function SuccessMethodLocationType(jsonData) {
        if (jsonData.length > 0) {
            //$("#ddlStorageLocation").empty().append('<option selected="selected" value="0">Please Select Location Type</option>');
            for (var i = 0; i < jsonData.length; i++) {
                var locationtypename;
                if (jsonData[i].cStorageLocationType == "L") {
                    locationtypename = "Locker";
                }
                else if (jsonData[i].cStorageLocationType == "R") {
                    locationtypename = "Racks";
                }
                else if (jsonData[i].cStorageLocationType == "C") {
                    locationtypename = "compactor";
                }
                $("#ddlLocationType").empty().append($("<option></option>").val(jsonData[i].StorageLocationNo).html(locationtypename));
            }
        }
        else {
            $("#ddlLocationType").empty().append('<option selected="selected" value="0">Please Select Location Type</option>');
        }

       // $("#ddlLocationType").empty();
       // $("#ddlLocationType").append($("<option></option>").val("L").html("Locker"));
        //$("#ddlLocationType").append($("<option></option>").val("R").html("Racks"));
        //$("#ddlLocationType").append($("<option></option>").val("C").html("compactor"));
    }
}

function SelectionData(transportid) {
    jQuery("#spnaddPmsStorageArea").text('delete');
    $("#StorageAreaInctive").modal('show');

    //document.getElementById("btnaddPmsTransporter").innerText = "Update";
    jQuery("#spnSave").text('Update');
    $("#txtRemarks").val("");
    $('.form-control').each(function () {
        $(this).attr('disabled', false);
    });
    
    $("#btnaddPmsStorageArea").attr("style", "display:inline");
    $("#btnClearPmsStorageArea").attr("style", "display:inline");

    $('.AuditControl').each(function () { this.style.display = "none"; });
   
    $('#btnaddPmsStorageArea').removeAttr("title");

    $('#btnaddPmsStorageArea').attr("title", "Delete");

    var storagelocation = transportid;
    GetPmsStorageType = {

        url: BaseUrl + "PmsStorageArea/GetSelectStorageData/" + transportid,
        SuccessMethod: "SuccessMethod",
    }

    // For Server use

    $.ajax({
        type: "GET",
        url: BaseUrl + "PmsStorageArea/GetSelectStorageData",
        data: { id: transportid },
        //contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Storage Type not found", ModuleName);
        }
    });



    function SuccessMethod1(jsonData) {
        if (jsonData.length > 0) {
            nStorageAreaNo = jsonData[0].nStorageAreaNo;
            $('#txtStorageArea').val(jsonData[0].vStorageAreaName);
            $('#txtCompartment').val(jsonData[0].vCompartmentName);
            $('#txtRack').val(jsonData[0].vRackName);
            $('#ddlStorageLocation :selected').val(jsonData[0].nStorageLocationNo);
            $('#ddlStorageType :selected').val(jsonData[0].nStorageTypeId);
            $('#txtRemarks').val(jsonData[0].vRemark);

        }
    }
    
}




