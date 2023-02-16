/// <reference path="General.js" />
var iUserNo;
var viewmode;
var ModuleName = "Storage Location"
$(function () {
    $('#myModal').modal({
        backdrop: 'static',
        keyboard: false
    })
    $('#myModal').modal('hide');

    iUserNo = $("#hdnuserid").val();
    $("#divlocationno").hide();


    var FilterData = {
        ModifyBy: $("#hdnuserid").val(),
        vLocationCode: $("#hdnUserLocationCode").val()
    }
    var GetallStorageLocationData = {
        Url: BaseUrl + "PmsStorageLocation/AllStorageLocationData",
        type: 'POST',
        data: FilterData,
        SuccessMethod: "SuccessMethod"
    }
    GetAllPmsPeriodMaster(GetallStorageLocationData.Url, GetallStorageLocationData.data);

    var GetallLocationMasterData = {
        Url: BaseUrl + "PmsStorageLocation/GetAllStorageLocationMst",
        SuccessMethod: "SuccessMethod"
    }
    GetAllPmsStorageLocationMaster(GetallLocationMasterData.Url, GetallLocationMasterData.SuccessMethod);

    $('#InActiveDate').datepicker({ format: 'dd/mm/yyyy', autoclose: true });

    $("#BtnCancel").on("click", function () {
        document.getElementById('rightstable').style.visibility = "hidden";
    });

    $("#btnaddPmsStorageLocation").on("click", function () {
       
        $("#loader").attr("style", "display:block");
        var locationcondcntrl;
        if ($("#strgConditionYes").is(":checked")) {
            locationcondcntrl = "Y";
        }
        else if ($("#strgConditionNo").is(":checked")) {
            locationcondcntrl = "N";
        }

        var InsertPMSStorageData = {
            LocationNo: $("#LocationNo").val(),
            LocationName: $("#StorageName").val(),
            LocationType: $("#ddlType").val(),
            LocationId: $("#LocationID").val(),
            ProjectNo: $("#ProjectNo").val(),
            LocationAdd1: $("#Address1").val(),
            LocationAdd2: $("#Address2").val(),
            LocationCity: $("#City").val(),
            LocationCountry: $("#Country").val(),
            LocationPinZipCode: $("#PINZIPCode").val(),
            LocationContactPerson: $("#ContactPerson").val(),
            LocationPharmacist: $("#Pharmacist").val(),
            LocationDescription: $("#LocationDesc").val(),
            LocationCndtncntrl: locationcondcntrl,
            LocationMinTemp: $("#MinTemp").val(),
            LocationMaxTemp: $("#MaxTemp").val(),
            LocationMinHumidity: $("#MinHumidity").val(),
            LocationMaxHumidity: $("#MaxHumidity").val(),
            Remarks: $("#Remarks").val(),
            ModifyBy: $("#hdnuserid").val(),
            vLocationCode: $("#hdnUserLocationCode").val()

        }
        var InsertStorageLocationData = {
            Url: BaseUrl + "PmsStorageLocation/InsertEditPmsStorageLocation",
            SuccessMethod: "SuccessMethod",
            Data: InsertPMSStorageData
        }

        if (ValidateForm()) {
            InsertPmsStorageLocationMaster(InsertStorageLocationData.Url, InsertStorageLocationData.SuccessMethod, InsertStorageLocationData.Data);
            $("#loader").attr("style", "display:none");

        } else {
            $("#loader").attr("style", "display:none");
            return false;
        }
    });

    $("#close").on("Click", function () {
        $("#StorageLocationModel").modal('hide');

    });

    $("#btnAddRights").click(function () {
        clearRights();
        document.getElementById('rightstable').style.visibility = "visible";
        if ($("#DDLUserList").val() == "0") {
            $('#BtnSaveRights').prop('disabled', true);

        }

        $("#DDLUserList").click(function () {
            if ($("#DDLUserList").val() == "0") {
                $('#BtnSaveRights').prop('disabled', true);

            }
            else {
                $('#BtnSaveRights').prop('disabled', false);
            }

        });
    });

    $("#BtnSaveRights").click(function () {

        $('#DDLUserList').prop('disabled', false);
        var btntext = document.getElementById('BtnSaveRights').value;

        if (btntext == "Save") {

            var bReadAccess;
            var bWriteAccess;
            if ($("#ReadAccess").is(":checked")) {
                bReadAccess = "Y";
            }
            else {
                bReadAccess = "N";
            }
            if ($("#WriteAccess").is(":checked")) {
                bWriteAccess = "Y";
            }
            else {
                bWriteAccess = "N";
            }
            var AddUserRights = {

                vStorageLocationNo: window.sessionStorage.getItem("LocationId"),
                bReadAccess: bReadAccess,
                bWriteAccess: bWriteAccess,
                iUserNo: $("#DDLUserList").val(),
                UserName: window.sessionStorage.getItem("UserNameWithProfile"),
                vActiveFlag: "Y",
                dAccessWithdrawnDate: $("#InActiveDate").val(),
                ModifyBy: $("#hdnuserid").val()

            }

            var SaveUserRights = {
                Url: BaseUrl + "PmsStorageLocation/PostAddUserRights",
                SuccessMethod: "SuccessMethod",
                Data: AddUserRights
            }
            InsertUserRights(SaveUserRights.Url, SaveUserRights.SuccessMethod, SaveUserRights.Data);
        }
        else if (btntext == "Update") {


            var bReadAccess;
            var bWriteAccess;
            if ($("#ReadAccess").is(":checked")) {
                bReadAccess = "Y";
            }
            else {
                bReadAccess = "N";
            }
            if ($("#WriteAccess").is(":checked")) {
                bWriteAccess = "Y";
            }
            else {
                bWriteAccess = "N";
            }
            var EditUserRights = {

                vStorageLocationNo: window.sessionStorage.getItem("LocationId"),
                bReadAccess: bReadAccess,
                bWriteAccess: bWriteAccess,
                iUserNo: $("#DDLUserList").val(),
                UserName: window.sessionStorage.getItem("UserNameWithProfile"),
                vActiveFlag: "Y",
                dAccessWithdrawnDate: $("#InActiveDate").val(),
                ModifyBy: $("#hdnuserid").val()

            }

            var EditUserRightsData = {
                Url: BaseUrl + "PmsStorageLocation/PostEditUserRights",
                SuccessMethod: "SuccessMethod",
                Data: EditUserRights
            }
            EditUserRightsMaster(EditUserRightsData.Url, EditUserRightsData.SuccessMethod, EditUserRightsData.Data);
        }
    });

    $("#btnExitPmsStorageLocation").on("click", function () {
        ConfirmAlertBox(ModuleName, $("#RedirectToHome").val());

    });

    $("#btnClearPmsStorageLocation").on("click", function () {
        clearTextBox();
    });

    $("#BtnCleaRights").click(function () {
        clearRights();

    });

    FetchUserList();

    GetViewMode();

});

var GetAllPmsPeriodMaster = function (Url, FilterData) {
    $('#tblPmsStorageLocation > tbody > tr:nth-child(n+1)').remove();
    $.ajax({
        url: Url,
        type: 'POST',
        data: FilterData,
        asyc: false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Data Not Found !", ModuleName);

        }
    });
    function SuccessMethod(jsonData) {
       
        var strdata = "";
        var Edit_c;
        var UserRights_c;
        var InActive_c;
        var ActivityDataset = [];
        for (var i = 0; i < jsonData.length; i++) {
            var InDataset = [];
            var locationtype
            //if (jsonData[i].StorageLocationType == "C") {
            //    locationtype = "Central"
            //}
            //else if (jsonData[i].StorageLocationType == "D") {
            //    locationtype = "Distribution Center"
            //}
            //else if (jsonData[i].StorageLocationType == "S") {
            //    locationtype = "Site"
            //}

            if (jsonData[i].StorageLocationType == "L") {
                locationtype = "Locker"
            }
            else if (jsonData[i].StorageLocationType == "R") {
                locationtype = "Racks"
            }
            else if (jsonData[i].StorageLocationType == "C") {
                locationtype = "compactor"
            }

            if (jsonData[i].StatusIndi == "D") {
                Edit_c = '<a data-tooltip="tooltip" title="Edit" class="disabled"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a>'
                UserRights_c = '<a data-tooltip="tooltip" title="User Rights" class="disabled"><i class="fa fa-user-plus"></i></a>';
                InActive_c = '<a data-tooltip="tooltip" title="InActive" class="disabled"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a mb-10"><i class="glyphicon glyphicon-remove"></i> <span>InActive</span></a>';

            }
            else {
                if (viewmode == "OnlyView") {
                    Edit_c = '<a data-tooltip="tooltip" title="Edit" class="disabled viewmode"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a viewmode"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a>'
                    InActive_c = '<a data-tooltip="tooltip" title="InActive" class="disabled viewmode"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a mb-10"><i class="glyphicon glyphicon-remove"></i> <span>InActive</span></a>';
                }
                else {
                    Edit_c = '<a data-toggle="modal" data-tooltip="tooltip" id="EditViewMode" title="Edit" data-target="#StorageLocationModel" attrid="' + jsonData[i].StorageLocationNo + '" class="btnedit" Onclick=SelectionData("' + jsonData[i].StorageLocationNo + '") style="cursor:pointer;" data-backdrop="false"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a>'
                    InActive_c = '<a href="Javascript:void(0);" data-tooltip="tooltip1" title="InActive" class="clsEdit" onclick=PmsStorageLocatinoInActive(this) locno="' + jsonData[i].StorageLocationNo + '" locname="' + jsonData[i].StorageLocationName + '" loctype="' + jsonData[i].StorageLocationName + '" loctype="' + jsonData[i].StorageLocationName + '"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a mb-10"><i class="glyphicon glyphicon-remove"></i> <span>InActive</span></a>';
                }
                UserRights_c = '<a href="Javascript:void(0);" data-backdrop="false" data-toggle="modal"  data-tooltip="tooltip" title="User Rights" data-target="#StorageLctnUserAccessRights"  class="clsEdit" onclick=getUserRightsListByLocation(this) locno="' + jsonData[i].StorageLocationNo + '" locname="' + jsonData[i].StorageLocationName + '"  ><i class="fa fa-user-plus"></i></a>';

            }

            var AuditTrail_c = '<a data-toggle="modal" data-tooltip="tooltip" title="Audit Trail" data-target="#StorageLocationModel" attrid="' + jsonData[i].StorageLocationNo + '" class="btnedit" Onclick=AudiTrailData("' + jsonData[i].StorageLocationNo + '") style="cursor:pointer;"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-file-text-o"></i><span>Audit</span></a>';

            InDataset.push(jsonData[i].StorageLocationNo, locationtype, jsonData[i].StorageLocationName, Edit_c, AuditTrail_c, UserRights_c, InActive_c, jsonData[i].StatusIndi, i + 1);
            ActivityDataset.push(InDataset);
        }
        otableStorageLocation = $('#tblPmsStorageLocation').dataTable({
            "bJQueryUI": true,
            "sPaginationType": "full_numbers",
            "bLengthChange": true,
            "iDisplayLength": 10,
            "bProcessing": true,
            "bSort": true,
            "autoWidth": true,
            "aaData": ActivityDataset,
            "bInfo": true,
            "bDestroy": true,
            //"sScrollY": "200px",
            //"sScrollX": "1%",
            //"sScrollXInner": "1260" /* It varies dynamically if number of columns increases */,
            "aoColumns":
                [
                    { "sTitle": "Storage Location No" },
                    { "sTitle": "Type" },
                    { "sTitle": "Storage Location Name" },
                    { "sTitle": "Edit" },
                    { "sTitle": "Audit Trail" },
                    { "sTitle": "User Rights" },
                    { "sTitle": "InActive" },
                    { "sTitle": "StatusIndi" },
                    { "sTitle": "ID" },
                ],
            "columnDefs": [
            {
                "targets": [0, 5, 7, 8],
                "visible": false,
                "searchable": false,
            },

            { "bSortable": false, "targets": [3, 4, 5, 6] },

            { "width": "1%", "targets": 0 },
            { "width": "10%", "targets": 1 },
            { "width": "10%", "targets": 2 },
            { "width": "2%", "targets": 3 },
            { "width": "2%", "targets": 4 },
            { "width": "2%", "targets": 5 },
            { "width": "2%", "targets": 6 },


            ],


            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },

            "createdRow": function (row, data, index) {
                if (data[7] == "D") {
                    $(row).addClass('highlight');
                    //$('td', row).eq(2).find("a").find("i").removeClass('fa fa-fw fa-edit');
                    //$('td', row).eq(2).find("a").find("i").addClass('glyphicon glyphicon-ban-circle');
                    //$('td', row).eq(4).find("a").find("i").addClass('glyphicon glyphicon-ban-circle');
                }
            }

        });

        if (iUserNo == 1) {

            otableStorageLocation = $('#tblPmsStorageLocation').dataTable({
                "bJQueryUI": true,
                "sPaginationType": "full_numbers",
                "bLengthChange": true,
                "iDisplayLength": 10,
                "bProcessing": true,
                "bSort": true,
                "autoWidth": true,
                "aaData": ActivityDataset,
                "bInfo": true,
                "bDestroy": true,
                "columnDefs": [
                    {
                        "targets": [5],
                        "visible": true,
                        "searchable": false,
                    },
                    {
                        "targets": [0, 7, 8],
                        "visible": false,
                        "searchable": false,
                    },


                { "bSortable": false, "targets": [3, 4, 5, 6] },

                { "width": "1%", "targets": 0 },
                { "width": "10%", "targets": 1 },
                { "width": "10%", "targets": 2 },
                { "width": "7%", "targets": 3 },
                { "width": "5%", "targets": 4 },
                { "width": "5%", "targets": 5 },
                { "width": "5%", "targets": 6 },
                ],

                "oLanguage": {
                    "sEmptyTable": "No Record Found",
                },

                "createdRow": function (row, data, index) {
                    if (data[7] == "D") {
                        $(row).addClass('highlight');
                    }
                }

            });
        }
    }

}

var GetAllPmsStorageLocationMaster = function (Url, SuccessMethod) {
    $.ajax({
        url: Url,
        type: 'GET',
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Error To Bind Data", ModuleName);

        }
    });

    function SuccessMethod(jsonData) {
        var strdata = "";
        if (jsonData.length > 0) {
            $("#Product").empty().append('<option selected="selected" value="0">Please Select Location</option>');
            for (var i = 0; i < jsonData.length; i++)
                $("#ddlLocationMst").append($("<option></option>").val(jsonData[i].vLocationCode).html(jsonData[i].vLocationName));
        }
        else {
            $("#ddlLocationMst").empty().append('<option selected="selected" value="0">Please Select Location</option>');
        }
    }
}

var InsertPmsStorageLocationMaster = function (Url, SuccessMethod, Data) {
    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        asyc: false,
        success: SuccessInsertData,
        error: function () {
            SuccessorErrorMessageAlertBox("Error To Save Data !", ModuleName);

        }
    });

    function SuccessInsertData(response) {
        SuccessorErrorMessageAlertBox(response, ModuleName);

        clearTextBox();

        var FilterData = {
            ModifyBy: $("#hdnuserid").val(),
            vLocationCode: $("#hdnUserLocationCode").val()
        }
        var GetallStorageLocationData1 = {
            Url: BaseUrl + "PmsStorageLocation/AllStorageLocationData",
            type: 'POST',
            asyc: false,
            data: FilterData,
            SuccessMethod: "SuccessMethod"
        }
        GetAllPmsPeriodMaster(GetallStorageLocationData1.Url, GetallStorageLocationData1.data);
        //$("#StorageLocationModel").modal('hide');
    }
}

function clearTextBox() {
    $("#Remarks").val("");
    $("#StorageName").val("");
    $("#MinTemp").val("");
    $("#MaxTemp").val("");
    $("#MinHumidity").val("");
    $("#MaxHumidity").val("");
    $("#ddlType").val("0");
    $("#strgConditionYes").prop("checked", true);

}

function ValidateForm() {
    var min = document.getElementById('MinHumidity').value;
    var max = document.getElementById('MaxHumidity').value;
    var mintemp = document.getElementById('MinTemp').value;
    var maxtemp = document.getElementById('MaxTemp').value;

    if (isBlank(document.getElementById('StorageName').value)) {
        ValidationAlertBox("Please Enter Location Name !", "StorageName", ModuleName);

        return false;
    }

    else if (Dropdown_Validation(document.getElementById("ddlType"))) {
        ValidationAlertBox("Please Select Location Type !", "ddlType", ModuleName);

        return false;
    }
    else if (!CheckNumericLength(mintemp, 1, 500)) {
        ValidationAlertBox("Please Enter Min Temp Between 1 To 500 !", "MinTemp", ModuleName);

        return false;
    }
    else if (!CheckNumericLength(maxtemp, 1, 500)) {
        ValidationAlertBox("Please Enter Max Temp Between 1 To 500 !", "MaxTemp", ModuleName);

        return false;
    }
    else if (!CheckNumericLength(min, 1, 500)) {
        ValidationAlertBox("Please Enter Min Humidity Between 1 To 500 !", "MinHumidity", ModuleName);

        return false;
    }
    else if (!CheckNumericLength(max, 1, 500)) {
        ValidationAlertBox("Please Enter Max Humidity Between 1 To 500 !", "MaxHumidity", ModuleName);

        return false;
    }
    else if (isNumeric(document.getElementById('MinTemp').value, document.getElementById('MinTemp').id)) {
        ValidationAlertBox("Please Enter Minimum Temp Only Numeric !", "MinTemp", ModuleName);

        return false;
    }
    else if (isNumeric(document.getElementById('MaxTemp').value, document.getElementById('MaxTemp').id)) {
        ValidationAlertBox("Please Enter Maximum Temp In Only Numeric !", "MaxTemp", ModuleName);

        return false;
    }
    else if (isNumeric(document.getElementById('MinHumidity').value, document.getElementById('MinHumidity').id)) {
        ValidationAlertBox("Please Enter Minimum Humidity In Only Numeric !", "MinHumidity", ModuleName);

        return false;
    }
    else if (isNumeric(document.getElementById('MaxHumidity').value, document.getElementById('MaxHumidity').id)) {
        ValidationAlertBox("Please Enter Maximum Humidity In Only Numeric !", "MaxHumidity", ModuleName);

        return false;
    }
    else if (parseInt(max) < parseInt(min)) {
        ValidationAlertBox("Max Humidity Should be Grater Than Min Humidity !", "MaxHumidity", ModuleName);

        return false;
    }
    else if (parseInt(maxtemp) < parseInt(mintemp)) {
        ValidationAlertBox("Max Temp Should be Grater Than Min Temp !", "MaxTemp", ModuleName);

        return false;
    }
    else if (isBlank(document.getElementById('Remarks').value) && (document.getElementById("spnPmsStorageLocation").innerText).toLowerCase().trim() == "update") {
        ValidationAlertBox("Please Enter Remarks !", "Remarks", ModuleName);

        return false;
    }
    else if ((document.getElementById("spnPmsStorageLocation").innerText).toLowerCase().trim() == "save") {
        var StorageName = ($("#StorageName").val()).trim();
        var LocationType = ($("#ddlType :selected").text()).trim();
        var rows = $("#tblPmsStorageLocation").dataTable().fnGetNodes();

        for (i = 0; i < rows.length; i++) {
            if (LocationType.split("(")[0].toUpperCase() == $(rows[i]).find("td:eq(0)").html().trim().toUpperCase()) {
                if (StorageName.toUpperCase() == $(rows[i]).find("td:eq(1)").html().trim().toUpperCase()) {
                    ValidationAlertBox("This Storage Name Already Exists !", "StorageName", ModuleName);

                    return false;
                    break;
                }
            }
        }
        return true;
    }
    else if ((document.getElementById("spnPmsStorageLocation").innerText).toLowerCase().trim() == "update") {
        var StorageName = ($("#StorageName").val()).trim();
        var LocationType = ($("#ddlType :selected").text()).trim();
        var i;
        var rows = $("#tblPmsStorageLocation").dataTable().fnGetNodes();

        for (i = 0; i < rows.length; i++) {
            if (LocationType.split("(")[0].toUpperCase() == $(rows[i]).find("td:eq(0)").html().trim().toUpperCase()) {
                if (StorageName.toUpperCase() == otableStorageLocation.fnGetData(i)[2].trim().toUpperCase()) {
                    var StorageAreaNo = otableStorageLocation.fnGetData(i - 0)[0];
                    if (StorageAreaNo != $("#LocationNo").val()) {
                        ValidationAlertBox("This Storage Name Already Exists !", "StorageName", ModuleName);

                        return false;
                        break;
                    }
                }
            }
        }
        return true;
    }
    else { return true; }
}

function AudiTrailData(locationno) {
    jQuery("#titleMode").text('Audit Trail');

    $('.AuditControl').each(function () { this.style.display = "inline"; });
    $('.form-control').each(function () {
        $(this).attr('disabled', true);
    });

    $("#btnaddPmsStorageLocation").attr("style", "display:none");
    $("#btnClearPmsStorageLocation").attr("style", "display:none");

    $("#divlocationno").hide();

    $("#LocationNo").removeAttr("value")
    $("#LocationNo").attr("disabled", "disabled");
    var GetallStorageLocationData = {
        Url: BaseUrl + "PmsStorageLocation/GetSelectStorageLocationData/" + locationno + "",
        SuccessMethod: "SuccessMethod"
    }

    // For Server use

    $.ajax({
        type: "GET",
        url: BaseUrl + "PmsStorageLocation/GetSelectStorageLocationData",
        data: { id: locationno },
        //contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessMethod1 ,
        error: function () {
            SuccessorErrorMessageAlertBox("Error To Get Audit Trail !", ModuleName);
        }
    });

}

function SelectionData(locationno) {
    $('.AuditControl').each(function () { this.style.display = "none"; });

    $('.form-control').each(function () {
        $(this).attr('disabled', false);
    });

    $("#btnaddPmsStorageLocation").attr("style", "display:inline");
    $("#btnClearPmsStorageLocation").attr("style", "display:inline");

    jQuery("#titleMode").text('Mode:-Edit');
    getUserRightsByLocation(locationno, iUserNo);
    $("#divlocationno").show();
    $("#LocationNo").removeAttr("value")
    $("#LocationNo").attr("disabled", "disabled");
    jQuery("#spnPmsStorageLocation").text('Update');
    $('#btnaddPmsStorageLocation').removeAttr("title");
    $('#btnaddPmsStorageLocation').attr("title", "Update");

    var GetallStorageLocationData = {
        Url: BaseUrl + "PmsStorageLocation/GetSelectStorageLocationData/" + locationno + "",
        SuccessMethod: "SuccessMethod"
    }

    // For Server use

    $.ajax({
        type: "GET",
        url: BaseUrl + "PmsStorageLocation/GetSelectStorageLocationData",
        data: { id: locationno },
       // contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessMethod1,
        error: function () {
            SuccessorErrorMessageAlertBox("Error To Select Data For Edit", ModuleName);
        }
    });
}

function SuccessMethod1(jsonData) {
    var strdata = "";
    $("#Remarks").val("");
    if (jsonData.length > 0) {
        $("#LocationNo").val(jsonData[0].StorageLocationNo)
        $("#StorageName").val(jsonData[0].StorageLocationName)
        $("#ddlType").val(jsonData[0].StorageLocationType)
        $("#LocationID").val(jsonData[0].StorageLocationId)
        $("#ProjectNo").val(jsonData[0].vWorkSpaceId)
        $("#Address1").val(jsonData[0].Address1)
        $("#Address2").val(jsonData[0].Address2)
        $("#City").val(jsonData[0].City)
        $("#Country").val(jsonData[0].Country)
        $("#PINZIPCode").val(jsonData[0].PinZipCode)
        $("#ContactPerson").val(jsonData[0].ContactPerson)
        $("#Pharmacist").val(jsonData[0].Pharmacist)
        $("#LocationDesc").val(jsonData[0].Description)
        $("#MinTemp").val(jsonData[0].MinTemp)
        $("#MaxTemp").val(jsonData[0].MaxTemp)
        $("#MinHumidity").val(jsonData[0].MinHumidity)
        $("#MaxHumidity").val(jsonData[0].MaxHumidity)
        if (jsonData[0].ConditionControl == "Y") {
            $("#strgConditionYes").prop("checked", true);
        }
        else if (jsonData[0].ConditionControl == "N") {
            $("#strgConditionNo").prop("checked", true);
        }
    }
}

function AuditTrail(e) {
   
    var str = e.id;
    var title = $(e).attr("titlename");
    var fieldname = str.substring(4);
    var locationno = $("#LocationNo").val();
    var Data = {
        vTableName: "StorageLocationMstHistory",
        vIdName: "nStorageLocationNo",
        vIdValue: locationno,
        vFieldName: fieldname,
        iUserId: iUserNo
    }

    $('#tblPmsStorageAuditTrial > tbody > tr:nth-child(n+1)').remove();
    $.ajax({
        url: BaseUrl + "PmsGeneral/AuditTrail",
        type: 'POST',
        data: Data,
        async: false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Error To Get AuditTrail !", ModuleName);

        }
    });

    function SuccessMethod(jsonData) {
        var strdata = "";
        //if (jsonData.length > 0) {
        var ActivityDataset = [];
        for (var i = 0; i < jsonData.length; i++) {
            var InDataset = [];
            var locationtype;
            var Desciprtion;

            if ("cStorageLocationType" == fieldname) {

                if (jsonData[i].vFieldName == "L") {
                    locationtype = "Locker"
                }
                else if (jsonData[i].vFieldName == "R") {
                    locationtype = "Racks"
                }
                else if (jsonData[i].vFieldName == "C") {
                    locationtype = "compactor"
                }

                //if (jsonData[i].vFieldName == "C") {
                //    locationtype = "Central"
                //}
                //else if (jsonData[i].vFieldName == "D") {
                //    locationtype = "Distribution Center"
                //}
                //else if (jsonData[i].vFieldName == "S") {
                //    locationtype = "Site"
                //}

                if ((jsonData[i].vDesciprtion).match(/D To S/))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("D To S", "Distribution Center To Site");
                else if ((jsonData[i].vDesciprtion).match(/D To C/))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("D To C", "Distribution Center To Central");
                else if (jsonData[i].vDesciprtion.match("S To D"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("S To D", "Site To Distribution Center");
                else if (jsonData[i].vDesciprtion.match("S To C"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("S To C", "Site To Center");
                else if (jsonData[i].vDesciprtion.match("C To S"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("C To S", "Center To Site");
                else if (jsonData[i].vDesciprtion.match("C To D"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("C To D", "Center To Distribution Center");
                else
                    Desciprtion = jsonData[i].vDesciprtion + " " + locationtype;

                InDataset.push(locationtype, jsonData[i].Operation, title + ' ' + Desciprtion, jsonData[i].vRemark, jsonData[i].vModifyBy, jsonData[i].dModifyOn);
            }
            else {
                InDataset.push(jsonData[i].vFieldName, jsonData[i].Operation, (jsonData[i].vDesciprtion == null ? "" : title + ' ' + jsonData[i].vDesciprtion), jsonData[i].vRemark, jsonData[i].vModifyBy, jsonData[i].dModifyOn);
            }
            ActivityDataset.push(InDataset);
        }
        otable = $('#tblPmsStorageAuditTrial').dataTable({
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
                         { "sTitle": " Description " },
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

function AddStorageLocation() {
    jQuery("#titleMode").text('Mode:-Add');
    $('.form-control').each(function () {
        $(this).attr('disabled', false);
    });
    $("#btnaddPmsStorageLocation").attr("style", "display:inline");
    $("#btnClearPmsStorageLocation").attr("style", "display:inline");

    $('.AuditControl').each(function () { this.style.display = "none"; });

    $('#btnaddPmsStorageLocation').removeAttr("title");
    $('#btnaddPmsStorageLocation').attr("title", "Save");
    jQuery("#spnPmsStorageLocation").text('Save');
    $("#LocationNo").val("");
    $("#divlocationno").hide();
    clearTextBox();
}

function pmsStorageAuditTrail(locationno) {
    $('#tblPmsStorageAuditTrial > tbody > tr:nth-child(n+1)').remove();
    var GetallStorageLocationData = {
        Url: BaseUrl + "PmsStorageLocation/GetAuditTrailData/" + locationno + "",
        SuccessMethod: "SuccessMethod"
    }
    $.ajax({
        url: GetallStorageLocationData.Url,
        type: 'GET',
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Error To Get AuditTrail !", ModuleName);

        }
    });
    function SuccessMethod(jsonData) {
        var strdata = "";
        if (jsonData.length > 0) {
            var ActivityDataset = [];
            for (var i = 0; i < jsonData.length; i++) {
                var InDataset = [];
                var locationtype
                if (jsonData[i].cStorageLocationType == "C") {
                    locationtype = "Central"
                }
                else if (jsonData[i].cStorageLocationType == "D") {
                    locationtype = "Distribution Center"
                }
                else if (jsonData[i].cStorageLocationType == "S") {
                    locationtype = "Site"
                }

                InDataset.push(jsonData[i].vStorageLocationName, locationtype, jsonData[i].Operation, jsonData[i].vRemark, jsonData[i].vModifyBy, jsonData[i].dModifyOn);
                ActivityDataset.push(InDataset);
            }
            otable = $('#tblPmsStorageAuditTrial').dataTable({
                "bJQueryUI": true,
                "sPaginationType": "full_numbers",
                "bLengthChange": true,
                "iDisplayLength": 10,
                "bProcessing": true,
                "bSort": true,
                "autoWidth": true,
                "aaData": ActivityDataset,
                "bInfo": true,
                "bDestroy": true,
                "aoColumns": [
                             { "sTitle": "Location Name" },
                             { "sTitle": "Location Type" },
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
}

//---------------------Added By SImki-Rights Module--------------------------------

function FetchUserList() {
    $.ajax({
        url: BaseUrl + "PmsStorageLocation/GetUserListData",
        type: 'GET',
        data: {},
        dataType: 'json',
        success: function (data) {
            $("#DDLUserList").append("<option value='0'>--Select--</option>");
            $.each(data, function (i, items) {
                $("#DDLUserList").append($("<option></option>").val(this['iUserId']).html(this['vUserName']));
            });
        },
        error: function (ex) {
            SuccessorErrorMessageAlertBox("Failed to retrieve Sub Categories : '" + ex + "'", ModuleName);

        }
    });
    return false;
}

var InsertUserRights = function (Url, SuccessMethod, Data) {
    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        success: SuccessInsertData,
        error: function () {
            SuccessorErrorMessageAlertBox("Error To Save UserRights !", ModuleName);

        }
    });

    function SuccessInsertData(response) {
        var result = response;
        if (result == "Data Saved Successfully") {
            SuccessorErrorMessageAlertBox("User Rights Added Successfully", ModuleName);

        }
    }
}

var EditUserRightsMaster = function (Url, SuccessMethod, Data) {
    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        success: SuccessUpdateData,
        error: function () {
            SuccessorErrorMessageAlertBox("Error to Edit UserRights !", ModuleName);

        }
    });

    function SuccessUpdateData(response) {
        var result = response;
        if (result == "Data Saved Successfully") {
            SuccessorErrorMessageAlertBox("User Rights Updated Successfully !", ModuleName);

            //$("#StorageLctnUserAccessRights").modal('hide');
            //$("#StorageLctnUserAccessRights").modal('hide');
            //$("#StorageLctnUserAccessRights").modal('hide');
            document.getElementById('rightstable').style.visibility = "hidden";
            clearRights();
        }
    }
}

var GetUserRightsListByLocationNo = function (Url, SuccessMethod, data) {
    document.getElementById('rightstable').style.visibility = "hidden";
    clearRights();
    $('#tblUserRights > tbody > tr:nth-child(n+1)').remove();

    $.ajax({
        url: Url,
        data: data,

        type: 'GET',
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Error to Fetch Rights By Location !", ModuleName);

        }
    });

    function SuccessMethod(jsonData) {
        var strdata = "";
        var ActivityDataset = [];
        for (var i = 0; i < jsonData.length; i++) {
            var InDataset = [];
            if (jsonData[i].Read == "Y") {
                jsonData[i].Read = "Read";
            }
            else { jsonData[i].Read = "-" }

            if (jsonData[i].Write == "Y") {
                jsonData[i].Write = "Write";
            }
            else { jsonData[i].Write = "-" }
            if (jsonData[i].InactivatedDate == "1900-01-01 00:00:00.000" || jsonData[i].InactivatedDate == null) {
                jsonData[i].InactivatedDate = "-";
            }

            InDataset.push(jsonData[i].nStorageLocationNo, jsonData[i].UserName, jsonData[i].Read, jsonData[i].Write, jsonData[i].ActivatedDate, jsonData[i].InactivatedDate, jsonData[i].iUserNo, '');
            ActivityDataset.push(InDataset);
        }
        otable = $('#tblUserRights').dataTable({
            "bJQueryUI": true,
            "sPaginationType": "full_numbers",
            "bLengthChange": true,
            "iDisplayLength": 10,
            "bProcessing": true,
            "bSort": true,
            "autoWidth": true,
            "aaData": ActivityDataset,
            "bInfo": true,
            "bDestroy": true,
            "fnCreatedRow": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $('td:eq(6)', nRow).append('<a data-toggle="modal" data-tooltip="tooltip" title="Edit" class="btnedit" Onclick=SelectRightsData(this) style="cursor:pointer;" Id="' + aData[0] + '" UserName="' + aData[1] + '" Read="' + aData[2] + '" Write="' + aData[3] + '" ActiveDate="' + aData[4] + '" Inactivedate="' + aData[5] + '" UserNo="' + aData[6] + '"  ><i class="fa fa-fw fa-edit"></i></a> ');
            },
            "columnDefs": [
                   {
                       "targets": [6],
                       "visible": false,
                       "searchable": false
                   },
                   { "bSortable": false, "targets": [7] },
            ],
            "aoColumns": [
                    { "sTitle": "Location No" },

                        { "sTitle": "UserName" },
                        { "sTitle": "Read Access" },
                        { "sTitle": "Write Access" },
                        { "sTitle": "Activated Date" },
                        { "sTitle": "InActivated Date" },
                          { "sTitle": "UserId" },
                         { "sTitle": "Edit" },

            ],
            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },
        });
    }
}

function getUserRightsListByLocation(e) {

    if ($("#DDLUserList").val() == "0") {
        $('#BtnSaveRights').prop('disabled', true);
    }
    document.getElementById("LblLocNo").innerText = $(e).attr("locname");
    var locationno = $(e).attr("locno");
    window.sessionStorage.setItem("LocationId", locationno)
    var UserDataMaster = {
        id: $(e).attr("locno"),
        iUserNo: iUserNo
    }
    var GetUserRIghtsListByLctnNo = {
        Url: BaseUrl + "PmsStorageLocation/GetUserRightsDataListByLctnNo" + "/",
        SuccessMethod: "SuccessMethod",
        Id: UserDataMaster
    }
    GetUserRightsListByLocationNo(GetUserRIghtsListByLctnNo.Url, GetUserRIghtsListByLctnNo.SuccessMethod, GetUserRIghtsListByLctnNo.Id);
}

function getUserRightsByLocation(locationno, iUserNo) {
    jQuery.support.cors = true;

    $.ajax({
        url: BaseUrl + "PmsStorageLocation/GetUserRightsForLctnData/",
        type: 'GET',
        dataType: 'json',
        async: false,
        data: {
            id: locationno,
            iUserNo: iUserNo
        },
        success: function (data) {
            WriteResponses(data);
        },
        error: function (x, y, z) {
            alert(x + '\n' + y + '\n' + z);
        }
    });

    function WriteResponses(data) {
        $('#StorageLocationModel :input').attr('disabled', false);
        var ActivityDataset = [];
        for (var Row = 0; Row < data.length; Row++) {
            var InDataset = [];
            if (data[Row].Read == "Y" && data[Row].Write == "Y") {
                $('#StorageLocationModel :input').attr('disabled', false);
            }
            else {
                $('#StorageLocationModel :input').attr('disabled', true);
                $('#btnExitPmsStorageLocation').attr('disabled', false);
            }
        }
    }
}

function SelectRightsData(e) {

    $('#InActiveDate').val("");
    var Inactivedate = $(e).attr("Inactivedate");
    if (Inactivedate != '-') {
        document.getElementById('rightstable').style.visibility = "hidden";
        $(this).attr('disabled', true);
        SuccessorErrorMessageAlertBox("You Can Not Update Rights...Please Add Rights Again....", ModuleName);

    }
    else {
        if ($('#DDLUserList').val() == "0") {
            $('#BtnSaveRights').prop('disabled', false);
        }
        $('#DDLUserList').prop('disabled', true);
        document.getElementById('rightstable').style.visibility = "hidden";
        document.getElementById('rightstable').style.visibility = "visible";
        document.getElementById('BtnSaveRights').value = "Update";

        var Id = $(e).attr("UserNo");
        var Read = $(e).attr("Read");
        var Write = $(e).attr("Write");
        var UserName = $(e).attr("UserName");

        $("#DDLUserList").val(Id);
        if (Read == "Read") {
            $("#ReadAccess").prop("checked", true);
        }
        else if (Read == "-") {
            $("#ReadAccess").prop("checked", false);
        }
        if (Write == "Write") {
            $("#WriteAccess").prop("checked", true);
        }
        else if (Write == "-") {
            $("#WriteAccess").prop("checked", false);
        }
    }
}

function clearRights() {
    document.getElementById('BtnSaveRights').value = "Save";
    $('#DDLUserList').prop('disabled', false);
    $("#DDLUserList").val("0");
    $("#WriteAccess").prop("checked", false);
    $("#ReadAccess").prop("checked", false);
}

// Added By Arpit
function PmsStorageLocatinoInActive(e) {
    $('#txtReason').prop('disabled', false);
    $("#txtReason").val("");
    var locationname = $(e).attr("locname")
    var locationno = $(e).attr("locno")
    $("#LocationNo").val(locationno);
    //SelectionData(locationno);

    if (locationname == "Quarantine" || locationname == "Prime") {
        SuccessorErrorMessageAlertBox("You Can Not InActive " + locationname + " Location !", ModuleName);

        return false;
    }
    else {
        $("#myModal").modal('show');
    }
}

$("#btnInActiveSave").on("click", function () {
    if (isBlank(document.getElementById('txtReason').value)) {
        ValidationAlertBox("Please Enter Remarks to InActive Storage Location", "txtReason", ModuleName);

        return false;
    }

    var INACTIVELocation = {
        LocationNo: $("#LocationNo").val(),
        ModifyBy: $("#hdnuserid").val(),
        cStatusIndi: "D",
        LocationName: $("#StorageName").val(),
        LocationMinTemp: $("#MinTemp").val(),
        LocationMaxTemp: $("#MaxTemp").val(),
        LocationMinHumidity: $("#MinHumidity").val(),
        LocationMaxHumidity: $("#MaxHumidity").val(),
        LocationType: $("#ddlType").val(),
        Remarks: $("#txtReason").val(),
    }
    var InActiveStorageLocation = {
        Url: BaseUrl + "PmsStorageLocation/InsertEditPmsStorageLocation",
        SuccessMethod: "SuccessMethod",
        Data: INACTIVELocation
    }
    InsertPmsStorageLocationMaster(InActiveStorageLocation.Url, InActiveStorageLocation.SuccessMethod, InActiveStorageLocation.Data);
    $("#myModal").modal('hide');
    $("#LocationNo").val("");
    $("#txtReason").val("");
});
