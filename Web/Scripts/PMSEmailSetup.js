var productIds = new Object();
var cIsTestSite = new Object();
var retentionqty;
var verificationqty;
var oldretentionqty;
var oldverificationqty;
var newretentionqty;
var newverificationqty;
var viewmode;
var ModuleName = "Email Setup"
var TransferIndi = "";
var reexpirydate = "";
var vProjectNo = "";
var setworkspaceid = "";
var locationForAudit = "";
var SetupId = "";
var workspaceIds = new Object();

$(function () {

    // Get User
    $('#ddlEmailUser').multiselect({
        nonSelectedText: 'Please Select User',
        buttonClass: 'form-control',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        numberDisplayed: 2,
    });
    $('#ddlOperation').multiselect({
        nonSelectedText: 'Please Select Operation',
        buttonClass: 'form-control',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        numberDisplayed: 2,
    });

    CheckSetProject();
    //BindData();

    iUserNo = $("#hdnuserid").val();
    $("#spnwelcome").html($("#hdnusername").val());
    $("#spnLoginTime").html($("#hdnlogintime").val());

    $("#tblLotMaster").hide();
    $("#divhide").hide();

    //Get Project No
    var GetAllPmsProjectNo = {
        Url: BaseUrl + "PmsGeneral/GetScopeWiseProject",
        SuccessMethod: "SuccessMethod",
    }

    $('#ddlProjectNodashboard').on('change keyup', function () {
        if ($('#ddlProjectNodashboard').val().length == 2) {
            var ProjectNoDataTemp = {
                iUserId: $("#hdnuserid").val(),
                vStudyCode: $("#ddlProjectNodashboard").val(),
            }
            GetPmsProjectNoProductReceipt(GetAllPmsProjectNo.Url, GetAllPmsProjectNo.SuccessMethod, ProjectNoDataTemp);
            //GetAllParentPRoject();
        }
        else if ($('#ddlProjectNodashboard').val().length < 2) {
            $("#ddlProjectNodashboard").autocomplete({
                source: "",
                change: function (event, ui) { },
                select: function (event, ui) {
                    vProjectNo = ui.item.value;
                    $('#ddlProjectNodashboard').val(vProjectNo);

                    if (productIds[$('#ddlProjectNodashboard').val()] != undefined) {
                        setworkspaceid = productIds[$('#ddlProjectNodashboard').val()];
                    }
                    //$('#ddlProjectNodashboard').blur();
                    BindData();
                },
            });
        }
    });

    $("#btnAddEmailSetup").on("click", function () {
        $("#ProjectNo").val($("#ddlProjectNodashboard").val());
        $("#ProjectNo").prop("disabled", "disabled");

        if (isBlank(document.getElementById('ddlProjectNodashboard').value) || setworkspaceid == "") {
            ValidationAlertBox("Please enter Project No.", "ddlProjectNodashboard", ModuleName);
            return false;
        }

        $('#ddlEmailUser option').each(function () {
            $(this).remove();
        });
        $('#ddlEmailUser').multiselect('rebuild');

        $('#ddlOperation option').each(function () {
            $('#ddlOperation option:selected').removeAttr('selected');

        });
        $('#ddlOperation').multiselect('rebuild');

        $("#loader").attr("style", "display:block");
        var Result = false;
        //$('#ddlOperation').val('');
        GetProfile()
        $("#loader").attr("style", "display:none");
    })

    $("#ddlEmailProfile").on("change", function () {
        GetUser();
    });

    $("#btnExitPmsEmailSetup").on("click", function () {
        $('#ddlProjectNodashboard').prop('disabled', false);
        ConfirmAlertBox(ModuleName);
    });

    $("#btnaddPmsEmailSetup").on("click", function () {
        if (!validateform()) {
            return;
        }

        var EmailUser = $("#ddlEmailUser").val();
        var sUser = ''

        for (var i = 0; i < EmailUser.length; i++) {
            sUser = sUser + EmailUser[i] + ','
        }

        sUser = sUser.substring(0, sUser.length - 1);
        var userrole = $("input[name='userrole']:checked").val();


        var EmailOperation = $("#ddlOperation :selected").text();
        var sOperation = ''


        var sOperation = $("#ddlOperation :selected").map(function () {
            return $(this).text();
        }).get().join(',');

         var InsertUser = {
            vworkspaceId: setworkspaceid,
            //vOperation: $("#ddlOperation :selected").text(),
            vOperation: sOperation,
            vUserTypeCode: $("#ddlEmailProfile :selected").val(),
            iUserId: sUser,
            vRemark: '',
            iModifyBy: $("#hdnuserid").val(),
            cStatusIndi: 'N',
            vUserRole: userrole, //$("input[name='userrole']:checked").val() === toString("undefined") ? "" : $("input[name='userrole']:checked").val(),
            DATAOPMODE: 1
        }

        var GetPMSInsertUser = {
            Url: BaseUrl + "PmsGeneralReport/PostInsertEmailSetup",
            SuccessMethod: "SuccessMethod",
            Data: InsertUser
        }

        $.ajax({
            url: GetPMSInsertUser.Url,
            type: 'POST',
            data: GetPMSInsertUser.Data,
            success: SuccessMethod,
            async: false,
            error: function () {
                SuccessorErrorMessageAlertBox("Data not found.", ModuleName);
            }
        });

        function SuccessMethod(jsonData) {
            if (jsonData == null) {
                SuccessorErrorMessageAlertBox("Data not found", ModuleName);
                return false;
            }
            if (jsonData.length > 0) {
                if (jsonData[0]["ReturnStatus"] == "0") {
                    ValidationAlertBox(jsonData[0]["ReturnMessage"], "", ModuleName);
                    return false;
                }
                else if (jsonData[0]["ReturnStatus"] == "1") {
                    SuccessorErrorMessageAlertBox(jsonData[0]['ReturnMessage'], ModuleName);
                    BindData();
                    return true;
                }
            }
        }
    });

    $("#btnClearPmsEmailSetup").on("click", function () {
        $('#ddlOperation').val(0);
        $('#ddlEmailProfile').val(0);

        $('#ddlEmailUser option').each(function () {
            $(this).remove();
        });
        $('#ddlEmailUser').multiselect('rebuild');

        $('#ddlOperation option').each(function () {
            $('#ddlOperation option:selected').removeAttr('selected');

        });
        $('#ddlOperation').multiselect('rebuild');

    });

});


function CheckSetProject() {
    var PassData = {
        iUserId: $("#hdnuserid").val()
    }
    var UrlDetails =
    {
        Url: BaseUrl + "PmsGeneral/GetSetProjectDetails/" + $("#hdnuserid").val(),
        SuccessMethod: "SuccessMethod"
    }
    GetProjectDetails(UrlDetails.Url, UrlDetails.SuccessMethod, PassData);
}

var GetProjectDetails = function (Url, SuccessMethod, PassData) {
    $.ajax({
        url: Url,
        type: 'GET',
        //async: false,
        success: function (jsonData) {
            if (jsonData.length > 0) {
                $('#ddlProjectNodashboard').val(jsonData[0].vProjectNo);
                setworkspaceid = jsonData[0].vWorkSpaceId;
            }
            else {
                $('#ddlProjectNodashboard').val('');
                setworkspaceid = '';
            }
        },
        error: function () {
            ValidationAlertBox("Protocol not found.", "ddlProjectNodashboard", ModuleName);
        }
    });
}

var GetPmsProjectNoProductReceipt = function (Url, SuccessMethod, ProjectNoDataTemp) {
    $.ajax({
        url: Url,
        type: 'GET',
        //data: { id: ProjectNoDataTemp.iUserId, projectno: ProjectNoDataTemp.vProjectNo, typecode: ProjectNoDataTemp.vProjectTypeCode },
        data: { iUserId: ProjectNoDataTemp.iUserId, vStudyCode: ProjectNoDataTemp.vStudyCode },
        //async: false,
        success: function (jsonData) {
            var jsonObj = jsonData;
            var sourceArr = [];
            for (var i = 0; i < jsonObj.length; i++) {
                sourceArr.push(jsonObj[i].vStudyCode);
                productIds[jsonObj[i].vStudyCode] = jsonObj[i].nStudyNo;
            }
            $("#ddlProjectNodashboard").autocomplete({
                source: sourceArr,
                change: function (event, ui) { }
            });
        },
        error: function () {
            ValidationAlertBox("Protocol No not found.", "ddlProjectNodashboard", ModuleName);
        }
    });
}


function validateform() {

    if (isBlank(document.getElementById('ProjectNo').value) && setworkspaceid == "") {
        ValidationAlertBox("Please enter Project No.", "ProjectNo", ModuleName);
        return false;
    }
    if (Dropdown_Validation(document.getElementById("ddlOperation"))) {
        ValidationAlertBox("Please select Operation.", "ddlOperation", ModuleName);
        return false;
    }
    if (Dropdown_Validation(document.getElementById("ddlEmailProfile"))) {
        ValidationAlertBox("Please select Profile.", "ddlEmailProfile", ModuleName);
        return false;
    }
    if (Dropdown_Validation(document.getElementById("ddlEmailUser"))) {
        ValidationAlertBox("Please select User.", "ddlEmailUser", ModuleName);
        return false;
    }
    if ($("#ddlOperation option:selected").val() == 9) {
        if (isBlank($("input[name='userrole']:checked").val())) {
            ValidationAlertBox("Please Select User Role.", "userrolecls", ModuleName);
            return false;
        }
    }
    return true;
}



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

        $('#ddlEmailProfile option').each(function () {
            $(this).remove();
        });

        $("#ddlEmailProfile").empty().append('<option selected="selected" value="0">Please Select Profile</option>');

        $.each(jsonData, function (i, items) {
            $("#ddlEmailProfile").append($("<option></option>").val(jsonData[i].vUserTypeCode).html(jsonData[i].vUserTypeName));
        });

    }
}

function GetUser() {

    $('#ddlEmailUser option').each(function () {
        $(this).remove();
    });

    var GetUser = {
        vUserTypeCode: $("#ddlEmailProfile :selected").val()
    }

    var GetPMSUser = {
        Url: BaseUrl + "PmsGeneralReport/PostGetUserNameProfileWise",
        SuccessMethod: "SuccessMethod",
        Data: GetUser
    }
    $.ajax({
        url: GetPMSUser.Url,
        type: 'POST',
        data: GetPMSUser.Data,
        success: SuccessMethod,
        async: false,
        error: function () {
            SuccessorErrorMessageAlertBox("Data not found.", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        if (jsonData == null) {
            SuccessorErrorMessageAlertBox("Data not found", ModuleName);
            return false;
        }
        for (var i = 0; i < jsonData.length; i++) {
            $("#ddlEmailUser").append($("<option></option>").val(jsonData[i].iUserId).html(jsonData[i].vUserName));
        }

        $('#ddlEmailUser').multiselect('rebuild');

    }

}

function BindData() {

    var GetPMSGetData = {
        vworkspaceId: setworkspaceid
    }

    var GetPMSGetUser = {
        Url: BaseUrl + "PmsGeneralReport/PostGetEmailSetup",
        SuccessMethod: "SuccessMethod",
        Data: GetPMSGetData
    }
    $.ajax({
        url: GetPMSGetUser.Url,
        type: 'POST',
        data: GetPMSGetUser.Data,
        success: SuccessMethod,
        //async: false,
        error: function () {
            SuccessorErrorMessageAlertBox("Data not found.", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        if (jsonData == null) {
            SuccessorErrorMessageAlertBox("Data not found", ModuleName);
            return false;
        }

        var ActivityDataset = [];
        var InActive_c = "";

        for (var i = 0; i < jsonData.length; i++) {
            var InDataset = [];
            srno = i + 1;

            if (jsonData[i].cStatusIndi == 'D') {
                //InActive_c = '<a title="Inactive" class="disabled" attrid="' + jsonData[i].SetupId + '"  Onclick=pmsEmailInactive(this) style="cursor:pointer;"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="glyphicon glyphicon-remove"></i> <span>Inactive</span></a>';
                InActive_c = '<a title="Inactive" class="disabled" attrid="' + jsonData[i].iEmailSetupId + '"  Onclick=pmsEmailInactive(this) style="cursor:pointer;"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="glyphicon glyphicon-remove"></i> <span>Inactive</span></a>';
            }
            else {
                //InActive_c = '<a title="Inactive" attrid="' + jsonData[i].SetupId + '"  Onclick=pmsEmailInactive(this) style="cursor:pointer;"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="glyphicon glyphicon-remove"></i> <span>Inactive</span></a>';
                InActive_c = '<a title="Inactive" attrid="' + jsonData[i].iEmailSetupId + '"  Onclick=pmsEmailInactive(this) style="cursor:pointer;"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="glyphicon glyphicon-remove"></i> <span>Inactive</span></a>';
            }

            InDataset.push(String(jsonData[i].vProjectNo), String(jsonData[i].vOperation), String(jsonData[i].vUserTypeName), String(jsonData[i].vUserName), String(jsonData[i].vEmailId),
               InActive_c, String(jsonData[i].cStatusIndi));
            ActivityDataset.push(InDataset);
        }


        otable = $('#tblEmailSetupData').dataTable({
            "bJQueryUI": true,
            "sPaginationType": "full_numbers",
            "bLengthChange": true,
            "iDisplayLength": 10,
            "bProcessing": true,
            "bSort": true,
            "autoWidth": true,
            "aaData": ActivityDataset,
            "bInfo": true,
            "bAutoWidth": false,
            "aaSorting": [],
            "bDestroy": true,

            "aoColumns": [
                { "sTitle": "Project No" },
                { "sTitle": "Operation" },
                { "sTitle": "User Type" },
                { "sTitle": "User" },
                { "sTitle": "Email Id" },
                { "sTitle": "Inactive" }
            ],
            "columnDefs": [
            {
                "targets": [],
                "visible": false,
                "searchable": false,
            }],
            "createdRow": function (row, data, index) {
                if (data[6] == "D") {
                    $(row).addClass('highlight');
                }
            }

        });
    }

}


function pmsEmailInactive(e) {

    SetupId = $(e).attr("attrid");
    $("#txtReason").val('')
    $("#EmailInctive").modal('show');
}


$("#btnInActiveSave").on("click", function () {

    if (isBlank(document.getElementById('txtReason').value)) {
        ValidationAlertBox("Please enter remarks for inactive.", "txtReason", ModuleName);
        return false;
    }

    var InsertUser = {
        vworkspaceId: setworkspaceid,
        vOperation: '',
        vUserTypeCode: '',
        iUserId: '',
        vRemark: $("#txtReason").val(),
        iModifyBy: $("#hdnuserid").val(),
        SetupId: SetupId,
        cStatusIndi: 'D',
        DATAOPMODE: 3
    }

    var GetPMSInsertUser = {
        Url: BaseUrl + "PmsGeneralReport/PostInsertEmailSetup",
        SuccessMethod: "SuccessMethod",
        Data: InsertUser
    }
    $.ajax({
        url: GetPMSInsertUser.Url,
        type: 'POST',
        data: GetPMSInsertUser.Data,
        success: SuccessMethod,
        async: false,
        error: function () {
            SuccessorErrorMessageAlertBox("Data not found.", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        if (jsonData == null) {
            SuccessorErrorMessageAlertBox("Data not found", ModuleName);
            return false;
        }
        if (jsonData.length > 0) {
            if (jsonData[0]["ReturnStatus"] == "0") {
                ValidationAlertBox(jsonData[0]["ReturnMessage"], "", ModuleName);
                return false;
            }
            else if (jsonData[0]["ReturnStatus"] == "1") {
                SuccessorErrorMessageAlertBox(jsonData[0]['ReturnMessage'], ModuleName);
                BindData();
                return true;
            }
        }
    }
});
