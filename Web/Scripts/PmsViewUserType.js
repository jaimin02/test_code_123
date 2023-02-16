var ModuleName = "View Mode User Type";
var nViewUserTypeDtlNo = "";
var rows;

$(document).ready(function () {
    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('.modal').modal('hide');

    $('#ddlProfileUserWise').multiselect({
        nonSelectedText: 'Please Select Profile',
        buttonClass: 'form-control',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        numberDisplayed: 2,
    });

    $('#ddlEmailProfile').multiselect({
        nonSelectedText: 'Please Select Profile',
        buttonClass: 'form-control',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        numberDisplayed: 2,
    });
    GetProfile();
    GetViewUserTypeCode();

    //rows = $("#tblViewUserModeUserType").dataTable().fnGetNodes();
    //if (rows.length > 0) {
    //    ProfileSelect();
    //}
    GetViewMode();
});

function GetProfile() {
    var objExecuteDataTable =
        {
            WhereCondition_1: " cstatusindi <> 'D' ORDER By vUserTypeName ",
            columnName_1: "vUserTypeCode,vUserTypeName"
        }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/FetchAllProfile",
        type: 'POST',
        data: objExecuteDataTable,
        dataType: 'json',
        success: SuccessMethodProfile,
        async: false,
        error: function (ex) {
            SuccessorErrorMessageAlertBox("Failed to retrieve Profile !", ModuleName);
        }
    });

    function SuccessMethodProfile(jsonData) {
        jsonData = jsonData.Table;
        $('#ddlProfileUserWise option').each(function () {
            $(this).remove();
        });
        $('#ddlEmailProfile option').each(function () {
            $(this).remove();
        });
        if (jsonData.length != 0) {
            //window.sessionStorage.setItem("UserNameWithProfile", jsonData.UserNameWithProfile);
        }
        $.each(jsonData, function (i, items) {
            $("#ddlProfileUserWise").append($("<option></option>").val(jsonData[i].vUserTypeCode).html(jsonData[i].vUserTypeName));
            $('#ddlProfileUserWise').multiselect('rebuild');
            $("#ddlEmailProfile").append($("<option></option>").val(jsonData[i].vUserTypeCode).html(jsonData[i].vUserTypeName));
            $('#ddlEmailProfile').multiselect('rebuild');
        });

        
    }
}

$("#btnPMSViewUserType").on("click", function (e) {
    if (isBlank(document.getElementById('txtDescription').value)) {
        ValidationAlertBox("Please Enter Description !", "txtDescription", ModuleName);
        return false;
    }

    var ProfileWiseUserCode = $("#ddlProfileUserWise").val();
    if (ProfileWiseUserCode == null) {
        ProfileWiseUserCode = "0";
    }
    else {
        ProfileWiseUserCode = $("#ddlProfileUserWise").val().toString();
    }

    var ProfileCodeEmail = $("#ddlEmailProfile").val();
    if (ProfileCodeEmail == null) {
        ProfileCodeEmail = "0";
    }
    else {
        ProfileCodeEmail = $("#ddlEmailProfile").val().toString();
    }

    var DATAOPMODE;
    var alertmessage = "";
    rows = $("#tblViewUserModeUserType").dataTable().fnGetNodes();
    
    if (rows.length == 0) {
        DATAOPMODE = 1;
        alertmessage = "Data Saved Successfully"
    }
    else {
        DATAOPMODE = 2;
        alertmessage = "Data Updated Successfully"
    }


    var InsertViewUserTypeCode = {
        nViewUserTypeDtlNo: nViewUserTypeDtlNo,
        vUserTypeCodeReadOnly: ProfileWiseUserCode,
        vUserTypeCodeEmail: ProfileCodeEmail,
        vDescription: $("#txtDescription").val(),
        cActiveFlag: "Y",
        iModifyBy: $("#hdnuserid").val(),
        DATAOPMODE : DATAOPMODE,

    }

    $.ajax({
        url: BaseUrl + "PmsRecordSave/Save_StudyProductViewUserTypeDtl",
        type: 'POST',
        data: InsertViewUserTypeCode,
        success: SuccessInsertData,
        error: function () {
            SuccessorErrorMessageAlertBox("Error In Insert Data !", ModuleName);
        }
    });

    function SuccessInsertData(TransactionNo) {
        SuccessorErrorMessageAlertBox(alertmessage, ModuleName);
        cleardata();
        GetViewUserTypeCode();
    }


});

function GetViewUserTypeCode() {
    var tablename = "StudyProductViewUserTypeDtl";

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/GetStudyProductViewUserTypeCode/ " + tablename + "",
        type: 'GET',
        async: false,
        success: function (data) {
            
            var InDataset = [];
            var ActivityDataset = [];


            for (var i = 0; i < data.length; i++) {
                InDataset = [];
                InDataset.push(data[i].nViewUserTypeDtlNo, data[i].vUserTypeCodeReadOnly, data[i].vUserTypeCodeEmail, data[i].vUserTypeNameReadOnly, data[i].vUserTypeNameEmail, data[i].vDescription,
                               data[i].cActiveFlag, data[i].vModifyBy, data[i].dModifyOn, '');
                ActivityDataset.push(InDataset);

                var dataarray = data[i].vUserTypeCodeReadOnly.split(",");
                $("#ddlProfileUserWise").val(dataarray);
                $("#ddlProfileUserWise").multiselect("refresh");

                var arrayEmail = data[i].vUserTypeCodeEmail.split(",");
                $("#ddlEmailProfile").val(arrayEmail);
                $("#ddlEmailProfile").multiselect("refresh");
            }

            otable = $('#tblViewUserModeUserType').dataTable({
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
                //"sScrollX": "117%",
                //"sScrollXInner": "1260" /* It varies dynamically if number of columns increases */,
                "fnCreatedRow": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    $('td:eq(6)', nRow).append('<a data-toggle="modal" data-tooltip="tooltip" title="Audit Trail" data-target="#ViewModeUserType" attrid="' + aData[0] + '" class="btnedit" Onclick=AuditTrailUserTypeCode() style="cursor:pointer;"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-file-text-o"></i><span>Audit</span></a>');
                },
                "aoColumns": [
                    { "sTitle": "nViewUserTypeDtlNo" },
                    { "sTitle": "vUserTypeCode" },
                    { "sTitle": "vUserTypeCode1" },
                    { "sTitle": "Profile For Read Only" },
                    { "sTitle": "Profile For Email" },
                    { "sTitle": "Description" },
                    { "sTitle": "Active Flag" },
                    { "sTitle": "Modify By" },
                    { "sTitle": "Modify On" },
                    { "sTitle": "Audit Trail" },

                ],
                "columnDefs": [
                    {
                        "targets": [0, 1,2],
                        "visible": false,
                        "searchable": false
                    },
                    //{ "bSortable": false, "targets": [6, 7] },
                ],
                "oLanguage": {
                    "sEmptyTable": "No Record Found",
                },
            });
        }
    });
}

function ProfileSelect() {
    var dataarray = otable.fnGetData(0 - 0)[1].split(",");
    $("#ddlProfileUserWise").val(dataarray);
    $("#ddlProfileUserWise").multiselect("refresh");
    nViewUserTypeDtlNo = otable.fnGetData(0 - 0)[0];
}

function AuditTrailUserTypeCode() {
    var tablename = "StudyProductViewUserTypeDtlHistory";

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/GetStudyProductViewUserTypeCode/ " + tablename + "",
        type: 'GET',
        async: false,
        success: function (data) {

            var InDataset = [];
            var ActivityDataset = [];


            for (var i = 0; i < data.length; i++) {
                InDataset = [];
                InDataset.push(data[i].vUserTypeNameReadOnly, data[i].vUserTypeNameEmail, data[i].vDescription,
                               data[i].cActiveFlag, data[i].vModifyBy, data[i].dModifyOn);
                ActivityDataset.push(InDataset);
            }

            otable = $('#tblViewModeUserTypeAuditTrial').dataTable({
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
                    { "sTitle": "Profile For Read Only" },
                    { "sTitle": "Profile For Email" },
                    { "sTitle": "Description" },
                    { "sTitle": "Active Flag" },
                    { "sTitle": "Modify By" },
                    { "sTitle": "Modify On" },

                ],
                "oLanguage": {
                    "sEmptyTable": "No Record Found",
                },
            });
        }
    });
}

function cleardata() {
    $("#txtDescription").val("");
}

$("#btnPMSViewUserTypeClearExit").on("click", function (e) {
    ConfirmAlertBox(ModuleName, $("#RedirectToHome").val());
});