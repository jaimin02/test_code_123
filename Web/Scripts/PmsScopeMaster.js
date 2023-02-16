var ModuleName = "Scope Master"
var viewmode;
var scopemstno;

$(document).ready(function () {
    iUserNo = $("#hdnuserid").val();
    $('#ddlProjectMst').multiselect({
        nonSelectedText: 'Select ScopeValue',
        buttonClass: 'form-control',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        numberDisplayed: 1,
    });
    $('#vScopeName').hide();
    $('#vScopeValuesText').hide();
    $("#BtnClear").css("visibility", "hidden");
    GetScopeValue();
    GetScopeData();

});

function GetScopeList() {
    jsonData = "";
    var ExecuteDataSetData = {
        Table_Name_1: "ScopeMst",
        WhereCondition_1: "cStatusIndi <> 'D' ",
        DataRetrieval_1: 3,
    }
    GetJsonData(ExecuteDataSetData);
    $("#ddlScope").empty();
    for (var i = 0; i < jsonData.length; i++) {
        $("#ddlScope").append($("<option></option>").val(jsonData[i].nScopeNo).html(jsonData[i].vScopeName));
    }
}

function GetScopeValue() {
    jsonData = "";
    var ExecuteDataSetData = {
        Table_Name_1: "View_GetProjectNumber",
        WhereCondition_1: "cStatusIndi <> 'C'",
        DataRetrieval_1: 3,
    }
    GetJsonData(ExecuteDataSetData);
    $("#ddlProjectMst").empty();
    for (var i = 0; i < jsonData.length; i++) {
        $("#ddlProjectMst").append($("<option></option>").val(jsonData[i].nStudyNo).html('[' + jsonData[i].vStudyCode + ']' + jsonData[i].vStudyName));
        $('#ddlProjectMst').multiselect('rebuild');

    }
}

$("#BtnSave").on("click", function () {
    var scopeValue = [], scopename, saveButtonText, scope, strScopevalueComma, data;

    saveButtonText = document.getElementById('BtnSave').text;
    scopeName = document.getElementById('txtScopeName').value;
    scopeValue = $('select#ddlProjectMst').val();
    scope = $('select#ddlScope').val();

    var scopeValueText = $.map($("#ddlProjectMst option:selected"), function (el, i) {
        return $(el).text();
    });

    var strScopevalueCommaText = scopeValueText.join();

    if (saveButtonText == "Save") {
        if (scopeName == "") {
            //alert("Please enter scope name");
            ValidationAlertBox('Please enter scope name.', "txtScopeName", ModuleName);
            return false;
        }
        if (scopeValue == null) {
            //alert("Please select scope value.");
            ValidationAlertBox('Please select scope value.', "ddlProjectMst", ModuleName);
            return false;
        }
        strScopevalueComma = scopeValue.join();

        data = {
            //nScopeNo: 1,
            vScopeName: scopeName,
            //vTableName: 'ProjectTypeMst',
            //vColumnName: 'vProjectTypeCode',
            vScopeValues: strScopevalueComma,
            vScopeValuesText: strScopevalueCommaText,
            iModifyBy: document.getElementById('hdnuserid').value,
            cStatusIndi: 'N',
            DATAOPMODE: 1,
            vRemark: ''
        };

    } else {
        if (scope == null) {
            //alert("Please select scope name.");
            ValidationAlertBox('Please select scope name.', "ddlScope", ModuleName);
            return false;
        }
        if (scopeValue == null) {
            //alert("Please select scope value.");
            ValidationAlertBox('Please select scope value.', "ddlProjectMst", ModuleName);
            return false;
        }
        strScopevalueComma = scopeValue.join();
        data = {
            nScopeNo: $("#ddlScope option:selected").val(),
            vScopeName: $("#ddlScope option:selected").text(),
            //vTableName: 'ProjectTypeMst',
            //vColumnName: 'vProjectTypeCode',
            vScopeValues: strScopevalueComma,
            vScopeValuesText: strScopevalueCommaText,
            iModifyBy: document.getElementById('hdnuserid').value,
            cStatusIndi: 'E',
            DATAOPMODE: 2,
            vRemark: ''
        };
    }

    $.ajax({
        url: BaseUrl + "PmsScopeMaster/InsertDataUserMaster",
        type: 'POST',
        data: data,
        success: SuccessMethod,
        error: function () {
            alert("Error To Get Insert_Update Scope Master.");
            SuccessorErrorMessageAlertBox("Error To Get Insert_Update Scope Master.", ModuleName);
        }
    });
});

function SuccessMethod(jsondata) {
    GetScopeData();
    //alert(jsondata);
    SuccessorErrorMessageAlertBox(jsondata, ModuleName);
    $("#txtScopeName").val("");
    document.getElementById('ddlScope').style.visibility = 'hidden';
    $('#txtScopeName')[0].style.visibility = 'visible';
    $("#ddlProjectMst").multiselect("clearSelection");
    $("#BtnSave")[0].text = 'Save';
    return false;
}

$("#BtnEdit").on("click", function () {
    $('#txtScopeName')[0].style.visibility = 'hidden';
    document.getElementById('ddlScope').style.visibility = 'visible';
    $("#BtnSave")[0].text = 'Update';
    $("#ddlProjectMst").multiselect("clearSelection");
    GetScopeList();
});

$("#BtnExit").on("click", function () {
    ConfirmAlertBox(ModuleName, $("#RedirectToHome").val());
});

$("#ddlScope").change(function () {
    var scopeValue = [];
    jsonData = "";

    var ExecuteDataSetData = {
        Table_Name_1: "ScopeMst",
        WhereCondition_1: "vScopeName='" + $('option:selected', this).text() + "' And cStatusIndi <> 'C'",
        DataRetrieval_1: 3,
    }
    GetJsonData(ExecuteDataSetData);
    for (var i = 0; i < jsonData.length; i++) {
        scopeValue = jsonData[0].vScopeValues.split(',');
        $("#ddlProjectMst").val(scopeValue);
        $("#ddlProjectMst").multiselect("refresh");

    }
});


var GetPmsProjectNoProductReceipt = function (Url, SuccessMethod, ProjectNoDataTemp) {

    $.ajax({
        url: Url,
        type: 'GET',
        data: { id: ProjectNoDataTemp.iUserId, projectno: ProjectNoDataTemp.vProjectNo, typecode: ProjectNoDataTemp.vProjectTypeCode },
        async: false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Project not found.", ModuleName);

        }
    });
    function SuccessMethod(jsonData) {
        var jsonObj = jsonData;
        var sourceArr = [];
        for (var i = 0; i < jsonObj.length; i++) {
            sourceArr.push("[ " + jsonObj[i].vStudyCode + " ]" + " " + jsonObj[i].vStudyName);
            productIds["[ " + jsonObj[i].vStudyCode + " ]" + " " + jsonObj[i].vStudyName] = jsonObj[i].nStudyNo;
        }
        $("#ddlProjectNo").autocomplete({
            source: sourceArr,
            change: function (event, ui) { }
        });

    }
}

function GetScopeData() {
    //var StorageAreaData = {
    //    Url: BaseUrl + "PmsStorageType/GetStoragetype/" + $("#hdnUserLocationCode").val() + "",
    //    SuccessMethod: "SuccessMethod"
    //}

    // For Server use

    $.ajax({
        type: "GET",
        url: BaseUrl + "PmsScopeMaster/GetScopeData",
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
                //Edit_c = '<a data-tooltip="tooltip" title="Edit" class="disabled"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a>'
                InActive_c = '<a data-tooltip="tooltip" title="Inactive" class="disabled"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="glyphicon glyphicon-remove"></i> <span>Inactive</span></a>';
            }
            else {
                //Edit_c = '<a title="Edit" attrid="' + jsonData[i].nScopeMasterNo + '" Onclick=EditScope(this) style="cursor:pointer;" nStorageTypeID="' + jsonData[i].nScopeMasterNo + '" vScopeName="' + jsonData[i].vScopeName + '"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a>'
                InActive_c = '<a title="Inactive" attrid="' + jsonData[i].nScopeNo + '"  Onclick=ScopeInactive(this) style="cursor:pointer;" nScopeNo="' + jsonData[i].nScopeNo + '" vScopeName ="' + jsonData[i].vScopeName + '" vScopeValues ="' + jsonData[i].vScopeValues + '" vScopeValuesText ="' + jsonData[i].ScopeValue + '"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="glyphicon glyphicon-remove"></i> <span>Inactive</span></a>';
            }

            InDataset.push(i + 1, jsonData[i].vScopeName, jsonData[i].ScopeValue, InActive_c, '', jsonData[i].cStatusIndi, jsonData[i].nScopeNo);
            ActivityDataset.push(InDataset);
        }
        otable = $('#tblScopeData').dataTable({
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
                $('td:eq(4)', nRow).append('<a href="Javascript:void(0);" title="Audit Trail" data-toggle="modal" data-target="#ScopeAudit" onclick=AuditTrailScope(this) nScopeNo="' + aData[6] + '" vScopeName="' + aData[1] + '" ScopeValue="' + aData[2] + '"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-file-text-o"></i><span>Audit</span></a>');

                if (aData[5] == "D") {
                    $(nRow).addClass('highlight');
                    $('td', nRow).eq(3).addClass('disabled');
                    //$('td', nRow).eq(4).addClass('disabled');
                }

            },
            "columnDefs": [
                {
                    "targets": [5, 6],
                    "visible": false,
                    "searchable": false
                },
                { "width": "2%", "targets": 0 },
                { "width": "5%", "targets": 1 },
                { "width": "5%", "targets": 2 },
                { "width": "2%", "targets": 3 },
                { "width": "2%", "targets": 4 }
            ],
            "aoColumns": [
                { "sTitle": "Sr No" },
                { "sTitle": "Scope Name" },
                { "sTitle": "Scope Values" },
                { "sTitle": "Inactive" },
                { "sTitle": "Audit" },
            ],
            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },
        });
    }
}

function EditScope(e) {
    nScopeMasterNo = $(e).attr("nScopeMasterNo");
    $('#txtScopeName').val($(e).attr("vScopeName"));
    $("#BtnSave").text('Update');
    document.getElementById("divRemarkScope").style.display = "block";
    $("#txtRemarks").show();
    $('#BtnSave').removeAttr("title");
    $('#BtnSave').attr("title", "Update");
}

function ScopeInactive(e) {
    //$('#txtReason').prop('disabled', false);
    //$('#txtReason').val("");
    nScopeNo = $(e).attr("nScopeNo");
    var ScopeName = $(e).attr("vScopeName");
    vScopeName = ScopeName;
    vScopeValues = $(e).attr("vScopeValues");
    vScopeValuesText = $(e).attr("vScopeValuesText");
    //$('#txtScopeName').val(ScopeName);
    $("#ScopeInctive").modal('show');
    //document.getElementById("divRemarkStorageType").style.display = "none";
    $("#spnPmsStorageType").text('delete');
}

$("#btnInActiveSave").on("click", function () {

    if (isBlank(document.getElementById('txtReason').value)) {
        ValidationAlertBox("Please enter remarks to inactive Scope", "txtReason", ModuleName);

        return false;
    }


    var InActiveScopeData = {
        nScopeNo: nScopeNo,
        vScopeName: vScopeName,
        //vScopeName: $("#ddlScope option:selected").text(),
        //vTableName: 'ProjectTypeMst',
        //vColumnName: 'vProjectTypeCode',
        vScopeValues: vScopeValues,
        vScopeValuesText: vScopeValuesText,
        iModifyBy: document.getElementById('hdnuserid').value,
        cStatusIndi: 'D',
        DATAOPMODE: 3,
        vRemark: $('#txtReason').val(),
        //nScopeMstNo: nScopeMasterNo
    }

    var InActiveScope = {
        Url: BaseUrl + "PmsScopeMaster/InsertUpdateScopeMaster",
        SuccessMethod: "SuccessMethod",
        Data: InActiveScopeData
    }
    InsertPmsScopeMaster(InActiveScope.Url, InActiveScope.SuccessMethod, InActiveScope.Data);
    $("#txtStorageType").val("");
    $("#StorageTypeInctive").modal('hide');
    $("#txtReason").val("");
});

var InsertPmsScopeMaster = function (Url, SuccessMethod, Data) {
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

    SuccessorErrorMessageAlertBox("Scope inactivated Successfully.", ModuleName);
    $("#ScopeInctive").hide();
    $('#txtRemarks').val("");
    GetScopeData();
}


function AuditTrailScope(e) {
    jQuery("#titleMode").text('Audit Trail');
    $('.AuditControl').each(function () { this.style.display = "inline"; });
    $('.form-control').each(function () {
        $(this).attr('disabled', true);
    });
    var ScopeName = $(e).attr('vScopeName');
    var ScopeValue = $(e).attr('ScopeValue');
    $('#vScopeName').show();
    $('#vScopeValues').show();
    $('#txtScopeName').val(ScopeName);
    $('#ddlProjectMst').val(ScopeValue);
    $("#BtnSave").css("visibility", "hidden");
    $("#BtnEdit").css("visibility", "hidden");
    $("#BtnClear").css("visibility", "visible");
    nScopeNo = $(e).attr("nScopeNo");
    $('#tblReasonAuditTrial > tbody > tr:nth-child(n+1)').remove();
}

function AuditTrail(e) {

    var str = e.id;
    var title = $(e).attr("titlename");
    var MasterFieldName = $(e).attr("MasterFieldName");
    var MasterTableName = $(e).attr("MasterTableName");
    var cCommaSeprate = $(e).attr("cCommaSeprate");
    var vJoinvMasterFieldName = $(e).attr("vJoinvMasterFieldName");
    var fieldname = str;

    nStorageTypeID = $(e).attr("nStorageTypeID");
    var Data = {
        vTableName: "ScopeMstHistory",
        vIdName: "nScopeNo",
        vIdValue: nScopeNo,
        vFieldName: str,
        iUserId: document.getElementById('hdnuserid').value,
        vMasterFieldName: MasterFieldName,
        vMasterTableName: MasterTableName,
    }

    $('#tblScopeAuditTrial > tbody > tr:nth-child(n+1)').remove();

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

            InDataset.push(jsonData[i].vFieldName, jsonData[i].Operation, jsonData[i].vRemark, jsonData[i].vModifyBy, jsonData[i].dModifyOn);
            ActivityDataset.push(InDataset);

        }
        otable = $('#tblScopeAuditTrial').dataTable({
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


$("#BtnClear").on("click", function () {
    $('.AuditControl').each(function () { this.style.display = "inline"; });
    $('.form-control').each(function () {
        $(this).attr('disabled', false);
    });
    $('#vScopeName').hide();
    $('#vScopeValuesText').hide();
    $("#txtScopeName").val("");
    $("#ddlProjectMst").val("");
    $("#BtnClear").css("visibility", "hidden");
    $("#BtnSave").css("visibility", "visible");
    $("#BtnEdit").css("visibility", "visible");
});