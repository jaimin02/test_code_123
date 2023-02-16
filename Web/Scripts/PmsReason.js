/// <reference path="General.js" />
var retVal = true;
var nReasonNo;
var viewmode = "";
var ModuleName = "Reason";

$(function () {

    $("#DivReasonNo").hide();

    $("#btnSave").click(function () {
        var btntext = (document.getElementById("spnSave").innerText).toLowerCase().trim()

        if (btntext == "save") {
            if (Dropdown_Validation(document.getElementById("DDLOperation"))) {
                ValidationAlertBox("Please select Operation.", "DDLOperation","Reason Master");
                return false;
            }
            if (isBlank(document.getElementById('txtReasonDesc').value)) {
                ValidationAlertBox("Please enter Reason.", "txtReasonDesc","Reason Master");
                
                return false;
            }
            if (validation() == false) { }
            else {
                var ReasonDetailData = {
                    nReasonNo: $("#txtReasonNo").val(),
                    vReasonDesc: $("#txtReasonDesc").val(),
                    cStatusIndi: 'N',
                    vRemark: $("#txtRemark").val(),
                    iModifyBy: $("#hdnuserid").val(),
                    vOperationCode: $("#DDLOperation").val(),
                    vLocationCode: $("#hdnUserLocationCode").val(),
                }
                var SaveResonDetail = {
                    Url: BaseUrl + "PmsReason/PostAddUpdateReasonData",
                    SuccessMethod: "SuccessMethod",
                    Data: ReasonDetailData
                }
                InsertUpdateReasonDetailMaster(SaveResonDetail.Url, SaveResonDetail.SuccessMethod, SaveResonDetail.Data);
                GetAllReasonData();
                ClearData();
            }
        }
        else if (btntext == "update") {
            if (validation() == false) {

            }
            else {
                var ReasonDetailData = {
                    nReasonNo: $("#txtReasonNo").val(),
                    vReasonDesc: $("#txtReasonDesc").val(),
                    vRemark: $("#txtRemark").val(),
                    iModifyBy: $("#hdnuserid").val(),
                    vOperationCode: $("#DDLOperation").val(),
                    cStatusIndi: 'E',
                    vLocationCode: $("#hdnUserLocationCode").val(),

                }
                var SaveResonDetail = {
                    Url: BaseUrl + "PmsReason/PostAddUpdateReasonData",
                    SuccessMethod: "SuccessMethod",
                    Data: ReasonDetailData
                }
                InsertUpdateReasonDetailMaster(SaveResonDetail.Url, SaveResonDetail.SuccessMethod, SaveResonDetail.Data);
                SaveDetail();
                GetAllReasonData();
                ClearData();
            }
        }
    });

    $("#btnExit").click(function () {
        ConfirmAlertBox(ModuleName, $("#RedirectToHome").val());
        
    });

    $('#btnAddReason').click(function () {
        $('.AuditControl').each(function () { this.style.display = "none"; });
        $('.form-control').each(function () {
            $(this).attr('disabled', false);
        });
        $("#btnSave").attr("style", "display:inline");
        $("#btnClear").attr("style", "display:inline");

        $("#titleMode").text('Mode:-Add');
        $("#DivReasonNo").hide();
        $("#spnSave").text('Save');
        $('#btnSave').removeAttr("title");
        $('#btnSave').attr("title", "Save");
        ClearData();
    });

    GetAllReasonData();

    $("#btnClear").click(function () {
        ClearData();
    });

    var GetAllOperationData = {
        Url: BaseUrl + "PmsReason/GetOperationTypeDataTable/",
        SuccessMethod: "SuccessMethod",
    }
    GetOprationDetailMaster(GetAllOperationData.Url, GetAllOperationData.SuccessMethod)

    
    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('.modal').modal('hide');
    GetViewMode();
});

function validation() {
    if (Dropdown_Validation(document.getElementById("DDLOperation"))) {
        ValidationAlertBox("Please select Operation.", "DDLOperation", "Reason Master");
        
        return false;
    }
    if (isBlank(document.getElementById('txtReasonDesc').value)) {
        ValidationAlertBox("Please enter Reason.", "txtReasonDesc", "Reason Master");
        
        return false;
    }

    if ((document.getElementById("spnSave").innerText).toLowerCase().trim() == "update") {
        if (isBlank(document.getElementById('txtRemark').value)) {
            ValidationAlertBox("Please enter Remarks.", "txtRemark", "Reason Master");
            
            return false;
        }
    }

    var ReasonDesc = $("#txtReasonDesc").val().trim();
    var opName = $("#DDLOperation option:selected").text();
    var oTable = document.getElementById('tblReasonMaster');
    var i;
    var rowLength = $("#tblReasonMaster").find("tr").not("thead tr").length
    var oCells;

    var DataNotFound = $('#tblReasonMaster').find('tr').find('td').text();
    if (DataNotFound == "No Record Found") {
        rowLength = rowLength - 1;
    }

    var rows = $("#tblReasonMaster").dataTable().fnGetNodes();

    var rowsData = $("#tblReasonMaster").dataTable().fnGetData();

    for (i = 0; i < rows.length; i++) {
        if (opName.toUpperCase() == $(rows[i]).find("td:eq(0)").html().trim().toUpperCase()) {
            if (ReasonDesc.toUpperCase() == $(rows[i]).find("td:eq(1)").html().trim().toUpperCase()) {
                if (rowsData[i][10] != 'D') {
                    var ReasonNo = otable.fnGetData(i)[0];
                    if (ReasonNo != nReasonNo) {
                        ValidationAlertBox("This Reason Name already exists.", "txtReasonDesc", "Reason Master");

                        return false;
                        break;
                    }
                }
            }
        }
    }
}

var InsertUpdateReasonDetailMaster = function (Url, Success, Data) {
    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        success: SuccessInsertData,
        error: function () {
            SuccessorErrorMessageAlertBox("Error to save data in Reason Master.", "Reason Master");
            
        }
    });

    function SuccessInsertData(response) {
        GetAllReasonData();
        ClearData();
        var result = response;
        if (result == "N") {
            SuccessorErrorMessageAlertBox("Reason saved successfully.", "Reason Master");
            
        }
        else if (result == "E") {
            SuccessorErrorMessageAlertBox("Reason updated successfully.", "Reason Master");
            
        }
        else if (result == "D") {
            SuccessorErrorMessageAlertBox("Reason inactivated successfully.", "Reason Master");
            
        }
        ClearData();
    }
}

function GetAllReasonData() {
    var GetReasonData = {
        Url: BaseUrl + "PmsReason/AllReasonData",
        SuccessMethod: "SuccessMethod"
    }
    var FilterData = {
        vLocationCode: $("#hdnUserLocationCode").val()
    }
    $.ajax({
        url: GetReasonData.Url,
        type: 'POST',
        asyc: false,
        data :FilterData,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Error to show data in Reason Master.", "Reason Master");
            
        }
    });
    function SuccessMethod(jsonData) {
        var strdata = "";
        if (jsonData.length > 0) {
            $("#divexport").show();
        }
        else {
            $("#divexport").hide();
        }
        var ActivityDataset = [];
        for (var i = 0; i < jsonData.length; i++) {
            var InDataset = [];
            var Edit_c = "";
            var InActive_c = "";

            if (viewmode == "OnlyView") {
                Edit_c = '<a data-tooltip="tooltip" title="Edit" class="disabled"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a>'
                InActive_c = '<a data-tooltip="tooltip" title="Inactive" class="disabled"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="glyphicon glyphicon-remove"></i> <span>Inactive</span></a>';
            }
            else {
                Edit_c = '<a data-toggle="modal" data-tooltip="tooltip" title="Edit" attrid="' + jsonData[i].nReasonNo + '" class="btnedit" data-toggle="modal" data-target="#ReasonModel" Onclick=EditData(this) id="' + jsonData[i].nReasonNo + '" Desc="' + jsonData[i].vReasonDesc + '" OperationCode="' + jsonData[i].vOperationCode + '"  style="cursor:pointer;"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a>'
                InActive_c = '<a href="Javascript:void(0);" data-tooltip="tooltip1" title="Inactive" class="clsEdit" onclick=DeleteReason(this)  Id="' + jsonData[i].nReasonNo + '" Desc="' + jsonData[i].vOperationName + '"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="glyphicon glyphicon-remove"></i> <span>Inactive</span></a>';
            }

            InDataset.push(jsonData[i].nReasonNo, jsonData[i].vOperationName, jsonData[i].vReasonDesc, jsonData[i].vRemark, jsonData[i].iModifyBy,
                          jsonData[i].dModifyOn, Edit_c, '', InActive_c, jsonData[i].vOperationCode, jsonData[i].cStatusIndi)
            ActivityDataset.push(InDataset);

        }
        otable = $('#tblReasonMaster').dataTable({
            "bJQueryUI": true,
            "sPaginationType": "full_numbers",
            "bLengthChange": true,
            //"iDisplayLength": 10,
            "bProcessing": true,
            "bSort": true,
            "autoWidth": false,
            "aaData": ActivityDataset,
            "bInfo": true,
            "bDestroy": true,
            "sScrollX": "100%",
            "sScrollXInner": "1260" /* It varies dynamically if number of columns increases */,
            "fnCreatedRow": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $('td:eq(3)', nRow).append('<a data-toggle="modal" data-tooltip="tooltip" title="Audit Trail" data-target="#ReasonModel" attrid="' + aData[0] + '" class="btnedit" Onclick=AuditTrailReason(this) id="' + aData[0] + '" Desc="' + aData[2] + '" OperationCode="' + aData[9] + '" style="cursor:pointer;"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-file-text-o"></i><span>Audit</span></a>');
                if (aData[10] == 'D') {
                    $(nRow).addClass('highlight');
                    $('td', nRow).eq(2).addClass('disabled');
                    $('td', nRow).eq(4).addClass('disabled');
                }
            },
            "aoColumns": [
                { "sTitle": "Reason No" },
                { "sTitle": "Operation Name" },
                { "sTitle": "Reason" },
                { "sTitle": "Remarks" },
                { "sTitle": "Modify By" },
                { "sTitle": "Modify On" },
                { "sTitle": "Edit" },
                { "sTitle": "Audit Trail" },
                { "sTitle": "Inactive" },
            ],
            "columnDefs": [
                {
                    "targets": [0, 3, 4, 5],
                    "visible": false,
                    "searchable": false
                },

                { "width": "60%", "targets": 2 },
                { "width": "9%", "targets": 6 },
                { "width": "9%", "targets": 7 },
                { "width": "9%", "targets": 8 },
                { "bSortable": false, "targets": [6,7,8] },
            ],
            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },

        });
    }


}

function AuditTrailReason(e) {
    jQuery("#titleMode").text('Audit Trail');
    $("#DivReasonNo").hide();
    $('.AuditControl').each(function () { this.style.display = "inline"; });
    $('.form-control').each(function () {
        $(this).attr('disabled', true);
    });
    $("#btnSave").attr("style", "display:none");
    $("#btnClear").attr("style", "display:none");
    nReasonNo = $(e).attr("Id");
    var Description = $(e).attr("Desc");
    var OperationCode = $(e).attr("OperationCode");
    $('#txtReasonNo').val(nReasonNo);
    $('#txtReasonDesc').val(Description);
    $('#DDLOperation').val(OperationCode);
    $('#tblReasonAuditTrial > tbody > tr:nth-child(n+1)').remove();
}

function AuditTrail(e) {
    var str = e.id;
    var title = $(e).attr("titlename");
    var fieldname = str.substring(4);
    var locationno = $("#txtReasonNo").val();
    var iUserNo = $("#hdnuserid").val();
    var Data = {
        vTableName: "ReasonMstHistory",
        vIdName: "nReasonNo",
        vIdValue: locationno,
        vFieldName: fieldname,
        iUserId: iUserNo
    }

    $('#tblReasonAuditTrial > tbody > tr:nth-child(n+1)').remove();

    $.ajax({
        url: BaseUrl + "PmsGeneral/AuditTrail",
        type: 'POST',
        data: Data,
        async: false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Error to show Audit Trail data.", "Reason Master");
            
        }
    });

    function SuccessMethod(jsonData) {
        var strdata = "";

        var ActivityDataset = [];
        for (var i = 0; i < jsonData.length; i++) {
            var InDataset = [];

            //InDataset.push(jsonData[i].vFieldName, jsonData[i].Operation, title + ' ' + jsonData[i].vDesciprtion, jsonData[i].vRemark, jsonData[i].vModifyBy, jsonData[i].dModifyOn);
            InDataset.push(jsonData[i].vFieldName, jsonData[i].Operation, jsonData[i].vRemark, jsonData[i].vModifyBy, jsonData[i].dModifyOn);
            ActivityDataset.push(InDataset);

        }
        otable = $('#tblReasonAuditTrial').dataTable({
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
                         { "sTitle": "Modify By" },
                         { "sTitle": "Modify On" }
            ],
            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },

        });
    }

}

function EditData(e) {
    $('.AuditControl').each(function () { this.style.display = "none"; });
    $('.form-control').each(function () {
        $(this).attr('disabled', false);
    });
    $("#btnSave").attr("style", "display:inline");
    $("#btnClear").attr("style", "display:inline");

    $("#DivReasonNo").show();
    $("#titleMode").text('Mode:-Edit');
    nReasonNo = $(e).attr("Id");
    var Description = $(e).attr("Desc");
    var OperationCode = $(e).attr("OperationCode");
    $('#txtReasonNo').val(nReasonNo);
    $('#txtReasonDesc').val(Description);
    $('#DDLOperation').val(OperationCode);
    $('#txtReasonNo').prop('disabled', true);
    $("#spnSave").text('Update');
    $('#btnSave').removeAttr("title");
    $('#btnSave').attr("title", "Update");
    $('#txtRemark').val("");
}

function DeleteReason(e) {
    $('#txtReason').prop('disabled', false);
    
    $('#txtReason').val("");
    $("#ProjectNo").prop('disabled', 'disabled');
    var ReasonNo = $(e).attr("Id");
    //var desc = $(e).attr("Desc");
    $("#ReasonInctive").modal('show');
    nReasonNo = ReasonNo;

    SelectionData(ReasonNo);
}

var GetOprationDetailMaster = function (Url, SuccessMethod) {
    $.ajax({
        url: Url,
        type: 'GET',
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Error to bind Operation.", "Reason Master");
            
        }
    });
    function SuccessMethod(jsonData) {
        var strdata = "";
        if (jsonData.length > 0) {
            var ActivityDataset = [];
            $("#DDLOperation").empty().append('<option selected="selected" value="0">Please Select Operation</option>');
            var operationName = "Study Product,Product Information,Product Receipt,Study Setup,Kit Type,Minimum Inventory,Kit Creation,Kit Allocation";
            for (var i = 0; i < jsonData.length; i++) {
                if (!operationName.includes(jsonData[i].vOperationName)) {
                    $("#DDLOperation").append($("<option></option>").val(jsonData[i].vOperationCode).html([jsonData[i].vOperationName]));
                }
            }
        }
    }
}

function SaveDetail() {
    $("#spnSave").text('Save');
    $('#btnSave').removeAttr("title");
    $('#btnSave').attr("title", "Save");
}

function ClearData() {
    //$("#DivReasonNo").hide();
    $('#txtReasonDesc').val("");
    $('#txtRemark').val("");
    $('#DDLOperation').val(0);

}

$("#btnInActiveSave").click(function () {
    if (isBlank(document.getElementById('txtReason').value)) {
        ValidationAlertBox("Please enter remarks for inactive Reason.", "txtReason", "Reason Master");
        
        return false;
    }

    var ReasonDetailData = {
        nReasonNo: nReasonNo,
        vReasonDesc: $('#txtReasonDesc').val(),
        cStatusIndi: 'D',
        vRemark: $("#txtRemark").val(),
        iModifyBy: $("#hdnuserid").val(),
        vOperationCode: $("#DDLOperation").val(),
        vRemark: $("#txtReason").val(),
        vLocationCode: $("#hdnUserLocationCode").val(),
    }
    var SaveResonDetail = {
        Url: BaseUrl + "PmsReason/PostAddUpdateReasonData",
        SuccessMethod: "SuccessMethod",
        Data: ReasonDetailData
    }

    InsertUpdateReasonDetailMaster(SaveResonDetail.Url, SaveResonDetail.SuccessMethod, SaveResonDetail.Data);
    GetAllReasonData();
    ClearData();
    $("#LocationNo").val("");
    $("#txtReason").val("");
});

function SelectionData(ReasonNo) {
    $('.AuditControl').each(function () { this.style.display = "none"; });
    $('.form-control').each(function () {
        $(this).attr('disabled', false);
    });
    $("#btnSave").attr("style", "display:inline");
    $("#btnClear").attr("style", "display:inline");

   // $("#DivReasonNo").modal('show');
    $("#DivReasonNo").show();
    $("#titleMode").text('Mode:-Edit');

    //var Description = $(e).attr("Desc");
    //var OperationCode = $(e).attr("OperationCode");
    //$('#txtReasonNo').val(nReasonNo);
    //$('#txtReasonDesc').val(Description);
    //$('#DDLOperation').val(OperationCode);
    //$('#txtReasonNo').prop('disabled', true);
    //$("#spnSave").text('Update');
    //$('#btnSave').removeAttr("title");
    //$('#btnSave').attr("title", "delete");
    //$('#txtRemark').val("");

    GetPmsStorageType = {

        url: BaseUrl + "PmsReason/GetSelectReasonData/" + nReasonNo,
        SuccessMethod: "SuccessMethod",
    }

    // For Server use

    $.ajax({
        type: "GET",
        url: BaseUrl + "PmsReason/GetSelectReasonData",
        data: { id: nReasonNo },
       // contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessMethod1,
        error: function () {
            SuccessorErrorMessageAlertBox("Reason not found.", ModuleName);
        }
    });



    function SuccessMethod1(jsonData) {
        if (jsonData.length > 0) {
            $('#txtReasonNo').val(jsonData[0].nReasonNo);
            $('#txtReasonDesc').val(jsonData[0].vReasonDesc);
            $('#DDLOperation').val(jsonData[0].vOperationCode);

        }
    }

}
