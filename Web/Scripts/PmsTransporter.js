/// <reference path="General.js" />
var iUserNo;
var tempTransporterID;
var viewmode;
var ModuleName = "Transporter Master";


$(function () {
    iUserNo = $("#hdnuserid").val();

    $("#btnExitPmsTransporter").on("click", function () {
        ConfirmAlertBox(ModuleName);
        
    });
    $("#txtContactPerson").keypress(function (e) {
        var key = e.keyCode;
        if (key >= 48 && key <= 57) {
            e.preventDefault();
        }
    });

    $("#btnClearPmsTransporter").on("click", function () {
        clearTextBox();
        $("#transportid").val("");
        $("#transportcode").val("");
    });

    var GetallTransportData = {
        Url: BaseUrl + "PmsTransporterMaster/AllTransporterData",
        SuccessMethod: "SuccessMethod"
    }
    GetAllPmsTransportData(GetallTransportData.Url, GetallTransportData.SuccessMethod);


    $("#btnaddPmsTransporter").on("click", function () {
        var InsertPMSTransporter =
            {
            nTransporterNo: $("#transportid").val(),
            vTransporterCode: $("#transportcode").val(),
            vTransportType: $("#txtTransportType").val(),
            vTransporterName: $("#txtTransporterName").val(),
            vOfficeAddr1: $("#txtOfficeAddress1").val(),
            vOfficeAddr2: $("#txtOfficeAddress2").val(),
            vOfficePlace: $("#txtOfficePlace").val(),
            vPinCode: $("#txtPinCode").val(),
            vOfficePhone: $("#txtOfficePhone").val(),
            vMobilePhone: $("#txtMobileNumber").val(),
            vEmailId: $("#txtEmailID").val(),
            vFaxPhone: $("#txtFaxNumber").val(),
            vPermitNo: $("#txtPermitNumber").val(),
            vContactPerson: $("#txtContactPerson").val(),
            vUserCode: "",
            vRemark: $("#txtRemarks").val(),
            iModifyBy: $("#hdnuserid").val(),
            //dModifyOn: $("#MinHumidity").val(),
            cStatusIndi: "",
            vLocationCode: $("#hdnUserLocationCode").val(),
        }

        var InsertTransporterData = {
            Url: BaseUrl + "PmsTransporterMaster/InsertEditPmsTransporter",
            SuccessMethod: "SuccessMethod",
            Data: InsertPMSTransporter
        }

        if (validateform() == false) { }
        else {
            InsertPmsTransporterMaster(InsertTransporterData.Url, InsertTransporterData.SuccessMethod, InsertTransporterData.Data);
        }

    });

    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('.modal').modal('hide');

    GetViewMode();
});

var GetAllPmsTransportData = function (Url, SuccessMethod) {
    var FilterData = {
        vLocationCode: $("#hdnUserLocationCode").val()
    }
    $.ajax({
        url: Url,
        type: 'POST',
        asyc: false,
        data:FilterData,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Error to show data.", ModuleName);
            
        }
    });

    function SuccessMethod(jsonData) {
        if (jsonData.length == 0) {
            $("#divexport").hide();
        }
        else {
            $("#divexport").css("visibility", "visible");
        }

        var ActivityDataset = [];
        for (var i = 0; i < jsonData.length; i++) {
            var Edit_c = "";
            var InActive_c = "";

            if (viewmode == "OnlyView") {
                Edit_c = '<a data-tooltip="tooltip" title="Edit" class="disabled"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a>'
                InActive_c = '<a data-tooltip="tooltip" title="Inactive" class="disabled"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="glyphicon glyphicon-remove"></i> <span>Inactive</span></a>';
            }
            else {
                Edit_c = '<a data-toggle="modal" data-tooltip="tooltip" title="Edit" data-target="#TransporterModel" attrid="' + jsonData[i].nTransporterNo + '" class="btnedit" Onclick=SelectionData("' + jsonData[i].nTransporterNo + '") style="cursor:pointer;"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a>';
                InActive_c = '<a href="Javascript:void(0);" data-tooltip="tooltip1" title="Inactive" class="clsEdit" onclick=PmsTransporterInActive(this) id="' + jsonData[i].nTransporterNo + '" name="' + jsonData[i].vTransporterName + '"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="glyphicon glyphicon-remove"></i> <span>Inactive</span></a>';
            }

            var InDataset = [];
            InDataset.push(jsonData[i].nTransporterNo, jsonData[i].vTransportType, jsonData[i].vTransporterName, jsonData[i].vOfficePlace, 
                           jsonData[i].vContactPerson, Edit_c, '', InActive_c, jsonData[i].cStatusIndi);
            ActivityDataset.push(InDataset);
        }
        otableTransporter = $('#tblPmsTransporter').dataTable({
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
            "sScrollXInner": "1255" /* It varies dynamically if number of columns increases */,
            "fnCreatedRow": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $('td:eq(5)', nRow).append('<a href="Javascript:void(0);" data-tooltip="tooltip" title="Audit Trail" data-toggle="modal" data-target="#TransporterModel" id="1" class="clsEdit" onclick=pmsTransportAuditTrail("' + aData[0] + '")><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-file-text-o"></i><span>Audit</span></a>');

                if (aData[8] == "D") {
                    $(nRow).addClass('highlight');
                    $('td', nRow).eq(4).addClass('disabled');
                    $('td', nRow).eq(6).addClass('disabled');
                }

            },
            "aoColumns": [
                        { "sTitle": "ID" },
                        { "sTitle": "Transporter Type" },
                        { "sTitle": "Transporter Name" },
                        { "sTitle": "Office Place" },
                        { "sTitle": "Contact Person" },
                        { "sTitle": "Edit" },
                        { "sTitle": "Audit Trail" },
                        { "sTitle": "Inactive" },
                        { "sTitle": "StatusIndi" }
            ],
            "columnDefs": [
                {
                    "targets": [0,8],
                    "visible": false,
                    "searchable": false,
                },
                { "bSortable": false, "targets": [5,6,7] },
                { "width": "2%", "targets": 0 },
                { "width": "8%", "targets": 1 },
                { "width": "5%", "targets": 2 },
                { "width": "5%", "targets": 3 },
                { "width": "5%", "targets": 4 },
                { "width": "3%", "targets": 5 },
                { "width": "3%", "targets": 6 },
                { "width": "3%", "targets": 7 }
            ],
            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },
        });
    }
}

var InsertPmsTransporterMaster = function (Url, SuccessMethod, Data) {
    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        success: SuccessInsertData,
        error: function () {
            SuccessorErrorMessageAlertBox("Error to insert data.", ModuleName);
            
        }
    });

    function SuccessInsertData(response)
    {
        var result = response.d;
        SuccessorErrorMessageAlertBox(response + ".", ModuleName);
        clearTextBox();
        $("#transportid").val("");
        $("#transportcode").val("");
        var GetallTransportData = {
            Url: BaseUrl + "PmsTransporterMaster/AllTransporterData",
            SuccessMethod: "SuccessMethod"
        }
        GetAllPmsTransportData(GetallTransportData.Url, GetallTransportData.SuccessMethod);
        //$("#TransporterModel").modal('hide');
    }
}

function AddTransporter() {
    $('.form-control').each(function () {
        $(this).attr('disabled', false);
    });

    $("#btnaddPmsTransporter").attr("style", "display:inline");
    $("#btnClearPmsTransporter").attr("style", "display:inline");

    $('.AuditControl').each(function () { this.style.display = "none"; });

    jQuery("#titleMode").text('Mode:-Add');
    jQuery("#spnSave").text('Save');
    //document.getElementById("btnaddPmsTransporter").innerText = "Save";
    $('#btnaddPmsTransporter').removeAttr("title");
    $('#btnaddPmsTransporter').attr("title", "Save");
    $("#hidediv").hide()
    clearTextBox();
    $("#transportid").val("")
    $("#transportcode").val("")
}

function clearTextBox() {
    $("#txtTransporterName").val("");
    $("#txtOfficeAddress1").val("");
    $("#txtOfficeAddress2").val("");
    $("#txtOfficePlace").val("");
    $("#txtPinCode").val("");
    $("#txtOfficePhone").val("");
    $("#txtMobileNumber").val("");
    $("#txtEmailID").val("");
    $("#txtFaxNumber").val("");
    $("#txtPermitNumber").val("");
    $("#txtContactPerson").val("");
    $("#txtRemarks").val("");
    $("#txtTransportType").val("")
    $("#transportid").val("")
    $("#transportcode").val("")
    $("#txtRemarks").val("");
}

function SelectionData(transportid) {
    $("#hidediv").show()
    jQuery("#titleMode").text('Mode:-Edit');
    //document.getElementById("btnaddPmsTransporter").innerText = "Update";
    jQuery("#spnSave").text('Update');
    $("#txtRemarks").val("");
    $('.form-control').each(function () {
        $(this).attr('disabled', false);
    });

    $("#btnaddPmsTransporter").attr("style", "display:inline");
    $("#btnClearPmsTransporter").attr("style", "display:inline");

    $('.AuditControl').each(function () { this.style.display = "none"; });

    $('#btnaddPmsTransporter').removeAttr("title");
    $('#btnaddPmsTransporter').attr("title", "Update");

    var GetallTransportDataIDWIse = {
        //Url: BaseUrl + "PmsTransporterMaster/GetSelectTransporterData/" + transportid + "",
        Url: BaseUrl + "PmsTransporterMaster/GetSelectTransporterData",
        SuccessMethod: "SuccessMethod"
    }
    //$.ajax({
    //    url: GetallTransportDataIDWIse.Url,
    //    //url: GetallStorageLocationData.Url,
    //    type: 'GET',
    //    data: transportid,
    //    dataType: 'json',
    //    success: SuccessMethod1,
    //    error: function () {
    //        SuccessorErrorMessageAlertBox("Error to show data.", ModuleName);
            
    //    }
    //});


    $.ajax({
        url: GetallTransportDataIDWIse.Url,
        type: 'GET',
        data: { id: transportid },
        dataType: 'json',
        success: SuccessMethod1,
        async: false,
        error: function () {
            SuccessorErrorMessageAlertBox("Error To Show Data!", ModuleName);
        }
    });

}

function SuccessMethod1(jsonData) {
    if (jsonData.length > 0) {
        $("#transportid").val(jsonData[0].nTransporterNo)
        $("#txtTransporterName").val(jsonData[0].vTransporterName)
        $("#transportcode").val(jsonData[0].vTransporterCode)
        $("#txtOfficeAddress1").val(jsonData[0].vOfficeAddr1)
        $("#txtOfficeAddress2").val(jsonData[0].vOfficeAddr2)
        $("#txtOfficePlace").val(jsonData[0].vOfficePlace)
        $("#txtPinCode").val(jsonData[0].vPinCode)
        $("#txtOfficePhone").val(jsonData[0].vOfficePhone)
        $("#txtMobileNumber").val(jsonData[0].vMobilePhone)
        $("#txtEmailID").val(jsonData[0].vEmailId)
        $("#txtFaxNumber").val(jsonData[0].vFaxPhone)
        $("#txtPermitNumber").val(jsonData[0].vPermitNo)
        $("#txtContactPerson").val(jsonData[0].vContactPerson)
        $("#txtTransportType").val(jsonData[0].vTransportType)
        
    }
}

function pmsTransportAuditTrail(transportid) {
    jQuery("#titleMode").text('Audit Trail');

    $('.AuditControl').each(function () { this.style.display = "inline"; });
    $('.form-control').each(function () {
        $(this).attr('disabled', true);
    });
    
    

    $("#btnaddPmsTransporter").attr("style", "display:none");
    $("#btnClearPmsTransporter").attr("style", "display:none");


    var GetAuditTrailData = {
        //Url: BaseUrl + "PmsTransporterMaster/GetSelectTransporterData/" + transportid + "",
        Url: BaseUrl + "PmsTransporterMaster/GetSelectTransporterData",
        SuccessMethod: "SuccessMethod"
    }
    //$.ajax({
    //    url: GetAuditTrailData.Url,
    //    type: 'GET',
    //    success: SuccessMethod1,
    //    error: function () {
    //        SuccessorErrorMessageAlertBox("Error to in Audit Trail.", ModuleName);
            
    //    }
    //});

    $.ajax({
        url: GetAuditTrailData.Url,
        type: 'GET',
        data: { id: transportid },
        dataType: 'json',
        success: SuccessMethod1,
        async: false,
        error: function () {
            SuccessorErrorMessageAlertBox("Error To in Audit Trail !", ModuleName);
        }
    });


    $("#hidediv").hide()

}

function PmsTransporterInActive(e) {
    $('#txtReason').prop('disabled', false);
    $('#txtReason').val("");
    var transporterid = $(e).attr("id");
    var transportername = $(e).attr("name");
    tempTransporterID = transporterid;
    $("#TransporterInActive").modal('show');
    SelectionData(transporterid);
}

$("#btnInActiveSave").on("click", function () {
    if (isBlank(document.getElementById('txtReason').value)) {
        ValidationAlertBox("Please enter reason for inactive Transporter.", "txtReason", ModuleName);
        
        return false;
    }

    var INACTIVETransport = {
        nTransporterNo: tempTransporterID,
        vTransporterCode: $("#transportcode").val(),
        vTransporterName: $("#txtTransporterName").val(),
        vOfficeAddr1: $("#txtOfficeAddress1").val(),
        vOfficeAddr2: $("#txtOfficeAddress2").val(),
        vOfficePlace: $("#txtOfficePlace").val(),
        vPinCode: $("#txtPinCode").val(),
        vOfficePhone: $("#txtOfficePhone").val(),
        vMobilePhone: $("#txtMobileNumber").val(),
        vEmailId: $("#txtEmailID").val(),
        vTransportType: $("#txtTransportType").val(),
        vFaxPhone: $("#txtFaxNumber").val(),
        vPermitNo: $("#txtPermitNumber").val(),
        vContactPerson: $("#txtContactPerson").val(),
        vUserCode: "",
        vRemark: $("#txtReason").val(),
        iModifyBy: $("#hdnuserid").val(),
        cStatusIndi: "D",
        vLocationCode: $("#hdnUserLocationCode").val(),
    }

    var InActiveTransporter = {
        Url: BaseUrl + "PmsTransporterMaster/InsertEditPmsTransporter",
        SuccessMethod: "SuccessMethod",
        Data: INACTIVETransport
    }
    InsertPmsTransporterMaster(InActiveTransporter.Url, InActiveTransporter.SuccessMethod, InActiveTransporter.Data);
    $("#transportid").val("");
    $("#transportcode").val("");
    $("#TransporterInActive").modal('hide');
    $("#txtReason").val("");
});

function myTrim(x) {
    return x.replace(/^\s+|\s+$/gm, '');
}

function validateform() {
    if (isBlank(document.getElementById('txtTransporterName').value)) {
        ValidationAlertBox("Please enter Transporter name.", "txtTransporterName", ModuleName);
        
        return false;
    }
    if (!isBlank(document.getElementById('txtPinCode').value)) {
        if (document.getElementById('txtPinCode').value.length != 6) {
            ValidationAlertBox("Please enter 6 digit for Pin code.", "txtPinCode", ModuleName);
            return false;
        }
    }
    if (isNumeric(document.getElementById('txtPinCode').value, document.getElementById('txtPinCode').id)) {
        ValidationAlertBox("Please enter Pin code Number in numeric value.", "txtPinCode", ModuleName);
        return false;
    }

    if (isNumeric(document.getElementById('txtOfficePhone').value, document.getElementById('txtOfficePhone').id)) {
        ValidationAlertBox("Please enter Office Phone in numeric value.", "txtOfficePhone", ModuleName);
        return false;
    }

    if (!isBlank(document.getElementById('txtMobileNumber').value)) {
        if (document.getElementById('txtMobileNumber').value.length != 10) {
            ValidationAlertBox("Please enter 10 digit for Mobile Number.", "txtMobileNumber", ModuleName);
            return false;
        }
    }
    if (isNumeric(document.getElementById('txtMobileNumber').value, document.getElementById('txtMobileNumber').id)) {
        ValidationAlertBox("Please enter Mobile Number in numeric value.", "txtMobileNumber", ModuleName);
        return false;
    }

    if (isNumeric(document.getElementById('txtFaxNumber').value, document.getElementById('txtFaxNumber').id)) {
        ValidationAlertBox("Please enter Fax Number in numeric value.", "txtFaxNumber", ModuleName);
        return false;
    }

   
    
    if (document.getElementById("btnaddPmsTransporter").innerText.replace(" ", "") == "Update") {
        if (isBlank(document.getElementById('txtRemarks').value)) {
            ValidationAlertBox("Please enter Remarks.", "txtRemarks", ModuleName);
            
            return false;
        }
    }

    if ($("#txtEmailID").val() != "") {
        var emailid = $("#txtEmailID").val()
        if (validemail("txtEmailID", emailid) == false)
        {
            ValidationAlertBox("Please enter proper E-Mail Id.", "txtEmailID", ModuleName);
            
            return false;
        }
    }

    var rowsData = $("#tblPmsTransporter").dataTable().fnGetData();
    if (document.getElementById("btnaddPmsTransporter").innerText == "Save ") {
        var transportername = $("#txtTransporterName").val();
        var rows = $("#tblPmsTransporter").dataTable().fnGetNodes();
    
        for (i = 0; i < rows.length; i++) {
            if (transportername.toUpperCase() == $(rows[i]).find("td:eq(1)").html().trim().toUpperCase()) {
                if (rowsData[i][8] != 'D') {
                    ValidationAlertBox("Transporter Name already exists.", "txtTransporterName", ModuleName);
                    return false;
                    break;
                }
            }
        }
    }

    else if ((document.getElementById("btnaddPmsTransporter").innerText.replace(" ", "") == "Update")) {
        var transportername = $("#txtTransporterName").val();
        var rows = $("#tblPmsTransporter").dataTable().fnGetNodes();
        for (i = 0; i < rows.length; i++) {
            if (transportername.toUpperCase() == $(rows[i]).find("td:eq(1)").html().trim().toUpperCase()) {
                if (rowsData[i][8] != 'D') {
                    var TransporterID = otableTransporter.fnGetData(i - 0)[0];
                    if (TransporterID != $("#transportid").val()) {
                        ValidationAlertBox("Transporter Name already exists.", "txtTransporterName", ModuleName);

                        return false;
                        break;
                    }
                }
            }
        }
        return true;
    }
}

function AuditTrail(e) {
    var str = e.id;
    var title = $(e).attr("titlename");
    var fieldname = str.substring(4);
    var transportid = $("#transportid").val();
    var Data = {
        vTableName: "TransporterMstHistory",
        vIdName: "nTransporterNo",
        vIdValue: transportid,
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
            SuccessorErrorMessageAlertBox("Audit Trail data not found.", ModuleName);
            
        }
    });

    function SuccessMethod(jsonData) {
        var strdata = "";
        if (jsonData.length > 0) {
            var ActivityDataset = [];
            for (var i = 0; i < jsonData.length; i++) {
                var InDataset = [];
                //InDataset.push(jsonData[i].vFieldName, jsonData[i].Operation, title + ' ' + jsonData[i].vDesciprtion, jsonData[i].vRemark, jsonData[i].vModifyBy, jsonData[i].dModifyOn);

                InDataset.push(jsonData[i].vFieldName, jsonData[i].Operation, jsonData[i].vRemark, jsonData[i].vModifyBy, jsonData[i].dModifyOn);
                ActivityDataset.push(InDataset);

            }
            otable = $('#tblPmsTransporterAuditTrial').dataTable({
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
                    //{ "sTitle": " Description " },
                    { "sTitle": "Remarks" },
                    { "sTitle": "Modify by" },
                    { "sTitle": "Modify On" }
                ],
                "columnDefs": [
                    { "width": "20%", "targets": 1 },
                    { "width": "20%", "targets": 2 },
                    { "width": "20%", "targets": 3 },
                    { "width": "20%", "targets": 4 },
                    //{ "width": "20%", "targets": 5 },
                ],
                "oLanguage": {
                    "sEmptyTable": "No Record Found",
                },

            });
        }

    }

}

