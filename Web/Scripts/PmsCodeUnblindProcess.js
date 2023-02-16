var workspaceIds = new Object();
var ModuleName = "Code Unblind Process"
var StudySetUpResult = [];
var totalcount;

$(document).ready(function () {
    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('.modal').modal('hide');
    GetAllParentPRoject();
});

$('#txtProjectNodashboard').on('blur', function () {
    if (workspaceIds[$('#txtProjectNodashboard').val()] != undefined) {
        setWorkspaceId = workspaceIds[$('#txtProjectNodashboard').val()];
    }


    GetStudyProductKitDispensingDtlVisitWise();
    ExportTOEXCEL();
});

var GetAllPmsProductbatchProjectNo = function (Url, SuccessMethod, ProjectNoDataTemp) {
    $.ajax({
        url: Url,
        type: 'GET',
        data: { id: ProjectNoDataTemp.iUserId, projectno: ProjectNoDataTemp.vProjectNo, typecode: ProjectNoDataTemp.vProjectTypeCode },
        async: false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("No Project Bound !", ModuleName);
        }
    });
    function SuccessMethod(jsonData) {
        var jsonObj = jsonData;
        var sourceArr = [];

        for (var i = 0; i < jsonObj.length; i++) {
            sourceArr.push("[ " + jsonObj[i].vProjectNo + " ]" + " " + jsonObj[i].vRequestId);
            workspaceIds["[ " + jsonObj[i].vProjectNo + " ]" + " " + jsonObj[i].vRequestId] = jsonObj[i].vWorkspaceId;
        }

        $("#txtProjectNodashboard").autocomplete({
            source: sourceArr,
            change: function (event, ui) { }
        });
    }
}

$("#btnCodeUnblindProcess").on("click", function () {
    if (isBlank(document.getElementById('ddlProjectNo').value)) {
        ValidationAlertBox("Please Enter Project No !", "ddlProjectNo", ModuleName);
        return false;
    }
});

function ESighAuth() {
    $("#txtUserName").val($("#hdnUserName").val() + "- (" + $("#hdnUserTypeName").val() + ")")
    var today = new Date();
    var date = today.getDate();
    var month = today.getMonth() //January is 0!
    var MonthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (date < 10) {
        date = '0' + date;
    }
    var currentdate = date + '-' + MonthList[month] + '-' + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes();
    $("#txtDateTime").val(currentdate)
    $("#txtPassword").val("");
}

function GetStudyProductKitDispensingDtlVisitWise() {
    $.ajax({
        url: BaseUrl + "PmsRecordFetch/GetKitDispensingDtlVisitWise/" + setWorkspaceId,
        type: 'GET',
        success: SuccessMethod,
        async: false,
        error: function () {
            SuccessorErrorMessageAlertBox("Data Not Found !", ModuleName);

        }
    });

    function SuccessMethod(jsonData)
    {
        var tableHeaders;
        var ActivityDataset = [];
        var columnno = [4];

        if (jsonData.length > 0) {
            document.getElementById("divexport").style.display = "block";
            document.getElementById("divCodeUnblindProcessData").style.display = "block";
            tableHeaders = "";
            var columnHeader;
            columnHeader = jsonData[0];
            var Edit = "Code Unblind";
            var $Edit = '';
            var totalrowcount = 0;
            

            $.each(columnHeader, function (key, value) {
                if (key == "Randomization No") {
                    tableHeaders += "{\"sTitle\" : \"" + key + "\"},";
                    tableHeaders += "{\"sTitle\" : \"" + Edit + "\"},";
                }
                else {
                    tableHeaders += "{\"sTitle\" : \"" + key + "\"},";
                }
            });

            tableHeaders = "[" + tableHeaders + ",]";
            tableHeaders = tableHeaders.replace(",,", "");

            // For Dynamic Column Data
            for (var i = 0; i < jsonData.length; i++) {
                var ColumnValue = "";
                var ColumnData;
                ColumnData = jsonData[i];
                $.each(ColumnData, function (key, value) {
                    if (key == "Randomization No") {
                        ColumnValue += "'" + value + "',";
                        ColumnValue += "'" + $Edit + "',";
                    }
                    else {
                        ColumnValue += "'" + value + "',";
                    }

                    if (key.indexOf("Unblind") == 0)
                    {
                        totalrowcount ++;
                    }
                });
                ColumnValue = "[" + ColumnValue + ",]";
                ColumnValue = ColumnValue.replace(",,", "")
                ColumnValue = ColumnValue.replace(/'/g, '"');
                ColumnValue = eval('(' + ColumnValue + ')');
                ActivityDataset.push(ColumnValue);
            }

            totalcount = Object.keys(jsonData[0]).length
            for (j = 6; j <= totalcount; j = j + 2) {
                columnno.push(j);
            }

            var otableProjectWiseAuditTrail = $('#tblPmsCodeUnblindProcessData').dataTable({
                "bJQueryUI": true,
                "sPaginationType": "full_numbers",
                "bLengthChange": true,
                "iDisplayLength": 10,
                "bProcessing": true,
                "bSort": false,
                "aaData": ActivityDataset,
                "aaSorting": [],
                "bInfo": true,
                "bAutoWidth": false,
                "bDestroy": true,
                "aoColumns": eval('(' + tableHeaders + ')'),
                "oLanguage": {
                    "sEmptyTable": "No Record Found",
                },
                "fnCreatedRow": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    //$('td:eq(3)', nRow).append('<a title="Code Unblinding" attrid="' + aData[0]
                    //    + '" class="btnedit" Onclick=ModalCodeUnblindProcess(this) vRandomizationNo = "' + aData[2] + '"  vSubjectID = "' + aData[1] + '" cDispenseType = "'+ aData[4] 
                    //    + '" vProjectNO = "' + aData[0] + '" vKitNo = "'+ aData[5] +'") style="cursor:pointer;"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-edit"></i><span>Code Unblind</span></a>');

                    $('td:eq(3)', nRow).append('<a title="Code Unblinding" attrid="' + aData[0]
                        + '" class="btnedit" Onclick=ModalCodeUnblindProcess(this) vRandomizationNo = "' + aData[2] + '"  vSubjectID = "' + aData[1] + '" cDispenseType = "' + aData[4]
                        + '" vProjectNO = "' + aData[0] + '" vKitNo = "' + aData[5] + '") style="cursor:pointer;"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-edit"></i><span>Code Unblind</span></a>');

                    var incrementno = 2;
                    for (i = 6; i < aData.length; i = i + 2) {
                        var rownumber = i - incrementno;
                        if (aData[i] == "Y") {
                            $('td', nRow).eq(rownumber).addClass('hightlightUnblindedKit');
                            $('td:eq(' + rownumber + ')', nRow).append(" -  " + '<i class="fa fa-eye" aria-hidden="true" title="Unblined detail" style="font-size:1.5em" data-toggle="modal" data-target="#CodeUnblindDetails" onClick="CodeUnblindedDetails(this)" vKitNo = ' +
                                        aData[i - 1] + ' vRandomizationNo = ' + aData[2] + '></i>')
                        }
                        incrementno = incrementno + 1;
                    }
                },
                "sScrollX": "100%",
                "columnDefs": [{
                    "targets": columnno,
                    "visible": false,
                    "searchable": false
                }],
            });
        }
        else {
            SuccessorErrorMessageAlertBox("No Details Found For Selected Project", ModuleName);
            document.getElementById("divexport").style.display = "none";
            document.getElementById("divCodeUnblindProcessData").style.display = "none";
            return false;
        }
    }
}

function ModalCodeUnblindProcess(e) {
    $('#txtProjectNo').val($(e).attr("vProjectNO"));
    $('#txtSubjectID').val($(e).attr("vSubjectID"));
    $('#txtRandomizationNo').val($(e).attr("vRandomizationNo"));
    GetDiscontinueSubject($(e).attr("vSubjectID"), $(e).attr("vRandomizationNo"));
    $("#hdnDispenseType").val($(e).attr("cDispenseType"));
    $("#txtKitNo").val($(e).attr("vKitNo"));
}

function GetDiscontinueSubject(SubjectID, Randomizationno) {
    var wStr = "vWorkspaceId = " + setWorkspaceId + " AND vMySubjectNo = '" + SubjectID + "' and vRandomizationNo = '" + Randomizationno + "'"
    var WhereData = {
        WhereCondition_1: wStr,
        columnName_1: "Top 1 cDisContinue"
    }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/View_StudyProductDispensingDtl",
        type: 'POST',
        data: WhereData,
        async: false,
        success: SuccessResult,
        error: function () {
            SuccessorErrorMessageAlertBox("Error To Get Kit Dispensing Data !", ModuleName);
        }
    });

    function SuccessResult(jsonData) {
        var JsonObj = jsonData.Table;

        if (JsonObj[0].cDisContinue == "Y") {
            $('#ModalCodeUnblindProcess').modal('show');
            GetVisit();
        }
        else {
            SuccessorErrorMessageAlertBox("Please Discontinue the Subject First then You Can Unblind the Subject. !", ModuleName);
        }
    }
}

function GetVisit() {
    if (workspaceIds[$('#txtProjectNodashboard').val()] != undefined) {
        setWorkspaceId = workspaceIds[$('#txtProjectNodashboard').val()];
    }

    var PostData = {
        WhereCondition_1: 'vWorkSpaceId = ' + setWorkspaceId + ' AND iperiod <> 0  Order By iperiod',
        columnName_1: 'Distinct vWorkspaceId ,vNodeDisplayName,iPeriod',
    }
    $.ajax({
        url: BaseUrl + "PmsRecordFetch/View_WorkSpaceNodeDetail",
        type: 'POST',
        data: PostData,
        success: SuccessMethod,
        async: false,
        error: function () {
            SuccessorErrorMessageAlertBox("Period Not Found !", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        jsonData = jsonData.Table;
        if (jsonData.length > 0) {
            $("#ddlVisit").empty().append('<option selected="selected" value="0">Please Select Visit</option>');
            for (var i = 0; i < jsonData.length; i++)
                $("#ddlVisit").append($("<option></option>").val(jsonData[i].iPeriod).html(jsonData[i].vNodeDisplayName));
        }
        else {
            $("#ddlVisit").empty().append('<option selected="selected" value="0">Please Select Visit</option>');
        }
    }
}

$("#btnSavePmsProceed").on("click", function () {
    if (Dropdown_Validation(document.getElementById("ddlVisit"))) {
        ValidationAlertBox("Please Select Visit !", "ddlVisit", ModuleName);
        return false;
    }
    //SENDMail();
    GetKitNo();
});

function GetKitNo() {
    $("#txtRemark").val("");

    var PostData = {
        vWorkSpaceID : setWorkspaceId,
        vVisit : $("#ddlVisit :selected").text(),
        vRandomizationNo : $("#txtRandomizationNo").val(),
        vSubjectID: $("#txtSubjectID").val(),
        vKitNo: $("#txtKitNo").val(),
    }
    $.ajax({
        url: BaseUrl + "PmsGeneral/DispensedKitNoVisitWise",
        type: 'POST',
        data: PostData,
        success: SuccessMethodKitNo,
        async: false,
        error: function () {
            SuccessorErrorMessageAlertBox("Kit Not Found !", ModuleName);
        }
    });
    
    function SuccessMethodKitNo(jsonData) {
        if (jsonData.length > 0) {
            $("#txtKitNo").val(jsonData[0].vKitNo)
            if (jsonData[0].cUnblind == "Y") {
                $('#ModalCodeUnblindProcessConfirm').modal('hide');
                ValidationAlertBox("You Already Done Code Unblind for Kit No " + jsonData[0].vKitNo + "", "ddlVisit", ModuleName);
            }
            else if (jsonData[0].cUnblind == "N") {
                $('#ModalCodeUnblindProcessConfirm').modal('show');
            }
        }
        else {
            ValidationAlertBox("There is No Kit/Product Found for " + $("#ddlVisit :selected").text() + "", "ddlVisit", ModuleName);
        }
    }
}

$("#btnExitPmsStudySetUp").on("click", function () {
    ConfirmAlertBox(ModuleName);
});

$("#btnPMSCodeUnblindOK").on("click", function () {
    if (isBlank(document.getElementById('txtRemark').value)) {
        ValidationAlertBox("Please Enter Remark !", "txtRemark", ModuleName);
        return false;
    }
    jQuery("#titleESign").text('Signature Authentication');
    document.getElementById("ESignData").style.display = "block";
    ESighAuth();
    $('#ModalESignAuth').modal('show');
});

$("#btnESingAuthOK").on("click", function () {
    if (UserAuthentication() != false) {
        $('#ModalESignAuth').modal('hide');
        $('#CodeUnblindProductDetail').modal('show');
        GetProductTypeNameBatch();
    }
});

function UserAuthentication() {
    var username = $("#hdnUserName").val();
    var password = $('#txtPassword').val();
    var usertypecode = $('#hdnUserTypeCode').val();
    var result = true;

    if (password == "") {
        ValidationAlertBox("Please Enter Password !", "txtPassword", ModuleName);
        result = false;
    }

    var loginDetails = {
        vUserName: username,
        vLoginPass: password,
        vUserTypeCode: usertypecode,
        vIPAddress: $('#hdnIpAddress').val(),
        vUserAgent: $('#hdnUserAgent').val(),

    };
    $.ajax({
        url: BaseUrl + "PmsLogin/PostLoginAuthentication",
        type: 'POST',
        data: loginDetails,
        dataType: 'json',
        async: false,
        success: OnSuccess,
        error: function (ex) {
            //alert('Login Failed. Try Again.!: ' + ex);
        }
    });

    function OnSuccess(jsonData) {
        if (jsonData.Data.length != 0) {
            if (jsonData.Data[0].cBlockedFlag == 'E') {
                result = false;
                $("#txtPassword").val("");
                ValidationAlertBox("User Authentication Failed ! Please Try Again", "txtPassword", ModuleName);
            }
        }
    }
    return result;
}

function UpdateKitDispensingDtl() {
    var StudySetup = {};
    StudySetUpResult = [];

    StudySetUp = {
        vWorkSpaceId: setWorkspaceId,
        vKitNo: $("#txtKitNo").val(),
        vSubjectID: $("#txtSubjectID").val(),
        vRandomizationNo: $("#txtRandomizationNo").val(),
        vRemark: $("#txtRemark").val(),
        iModifyBy: $("#hdnuserid").val(),
        cStatusIndi: 'E',
        cUnblind: 'Y',
        DATAOPMODE: '2',
        vVisit: $("#ddlVisit :selected").text(),
    }
    StudySetUpResult.push(StudySetUp);

    $.ajax({
        url: BaseUrl + "PmsRecordSave/Save_StudyProductKitDispensingDtl",
        type: 'POST',
        data: { '': StudySetUpResult },
        success: function (data) {            
            $('.modal').modal('hide');
            GetStudyProductKitDispensingDtlVisitWise();
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Error !", ModuleName);
        }
    });
}

function GetProductTypeNameBatch() {
    var strdata = "";
    var DispenseType = $("#hdnDispenseType").val()
    var wStr = "";

    var WhereData = {
        cDispenseType: DispenseType,
        vKitNo: $("#txtKitNo").val(),
        vWorkSpaceID: setWorkspaceId
    }
    $.ajax({
        url: BaseUrl + "PmsRecordFetch/Proc_GetCodeUnblindData",
        type: 'POST',
        data: WhereData,
        async: false,
        success: function (data) {
            $('#tblCodeUnblindProductDetail tbody').empty();
            if (data.length > 0)
            {
                for (var i = 0; i < data.length; i++) {
                    strdata += "<tr>";
                    strdata += "<td>" + data[i].vProductType + "</td>";
                    strdata += "<td>" + data[i].vProductName + "</td>";
                    strdata += "<td>" + data[i].vBatchLotNo + "</td>";
                    strdata += "<td>" + data[i].vProductStrength + "</td>";
                    strdata += "<td>" + data[i].vRandomizationNo + "</td>";
                    strdata += "<td>" + data[i].vTreatmentType + "</td>";
                    strdata += "</tr>";
                }
                $("#tbodyCodeUnblindProductDetail").append(strdata);
            }
        }
    });
}

function SENDMailAfterCodeUnblind(vProductType, vProductName, vBatchLotNo) {
    var MailDetail = {
        ProjectNo: $('#txtProjectNodashboard').val(),
        iPeriod: $("#ddlVisit").val(),
        vSubjectID: $("#txtSubjectID").val(),
        vUserName: $('#ddlProfile :selected').text(),
        vProductType : vProductType,
        vProductName: vProductName,
        vBatchLotNo : vBatchLotNo,

    }

    var url = WebUrl + "PmsCodeUnblindProcess/MailSENDAfterCodeUnblind";
    $.ajax({
        type: 'POST',
        url: url,
        data: MailDetail,
        async: false,
        success: function (html) {
        }
    });
}

function SENDMail() {
    var MailDetail = {
        ProjectNo: $('#txtProjectNodashboard').val(),
        iPeriod : $("#ddlVisit").val(),
        vSubjectID: $("#txtSubjectID").val(),
        vUserName:  $('#ddlProfile :selected').text() 
    }

    var url = WebUrl + "PmsCodeUnblindProcess/MailSEND";
    $.ajax({
        type: 'POST',
        url: url,
        data:MailDetail,
        async: false,
        success: function (html) {
            alert("Test");
        }
    });
}

function ExportTOEXCEL() {
    var url = WebUrl + "PmsCodeUnblindProcess/GetWorkspaceId";
    $.ajax({
        url: url,
        type: 'GET',
        data: { id: setWorkspaceId },
        async: false,
        success: function (response) {
        },
        error: function () {
            SuccessorErrorMessageAlertBox("No Project Found !", ModuleName);
        }
    });
}

var GetAllParentPRoject = function () {
    var ProjectNoDataTemp = {
        cParentChildIndi: "C"
    }
    $.ajax({
        url: BaseUrl + "PmsRecordFetch/AllParentProject",
        type: 'POST',
        data: ProjectNoDataTemp,
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("Project Not Found !", "txtProjectNodashboard", ModuleName);
        }
    });
    function SuccessMethod(jsonData) {
        var strdata = "";
        jsonData = jsonData.Table
        if (jsonData.length > 0) {
            var jsonObj = jsonData;
            var sourceArr = [];

            for (var i = 0; i < jsonObj.length; i++) {
                sourceArr.push("[ " + jsonObj[i].vProjectNo + " ]" + " " + jsonObj[i].vRequestId);
                workspaceIds["[ " + jsonObj[i].vProjectNo + " ]" + " " + jsonObj[i].vRequestId] = jsonObj[i].vWorkspaceId;
            }
            $("#txtProjectNodashboard").autocomplete({
                source: sourceArr,
                change: function (event, ui) {
                },
                select: function (event, ui) {
                    $('#txtProjectNodashboard').blur();
                }
            });
        }
    }
}

function CodeUnblindedDetails(e) {
    var wStr = "vWorkspaceId = " + setWorkspaceId + " AND cStatusIndi <> 'D' AND vKitNo = '" + e.attributes["vKitNo"].value + "'"
    var WhereData = {
        WhereCondition_1: wStr,
    }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/View_StudyProductDispensingDtl",
        type: 'POST',
        data: WhereData,
        async: false,
        success: SuccessResult,
        error: function () {
            alert("Error To Get Kit Dispensing Data !");
        }
    });

    function SuccessResult(jsonData) {
        var strdata = "";
        var ActivityDataset = [];
        var jsonData = jsonData.Table;
        for (var i = 0; i < jsonData.length; i++)
        {
            //$("#tblCodeUnblindDetail").attr("style","display:block")
            $('#tblCodeUnblindDetail tbody').empty();
            if (jsonData.length > 0)
            {
                for (var i = 0; i < jsonData.length; i++) {
                    strdata += "<tr>";
                    strdata += "<td>" + jsonData[i].vKitNo + "</td>";
                    strdata += "<td>" + jsonData[i].vProjectNo + "</td>";
                    strdata += "<td>-</td>";
                    strdata += "<td>" + jsonData[i].vNodeDisplayName + "</td>";
                    strdata += "<td>" + jsonData[i].vUnblindedBy + "</td>";
                    strdata += "<td>" + jsonData[i].dUnblindedOn + "</td>";
                    strdata += "</tr>";
                }
                $("#tbodyCodeUnblindDetail").append(strdata);
            }
        }
        LastDispenseData(setWorkspaceId, e.attributes["vKitNo"].value);
    }
}

function LastDispenseData(WorkSpaceID) {
    var wStr = "vWorkspaceId = " + setWorkspaceId + " AND cStatusIndi <> 'D'"
    var WhereData = {
        WhereCondition_1: wStr,
        columnName_1: "TOP 1 vNodeDisplayName,vProjectNo,vKitNo,vUnblindedBy,dUnblindedOn",
        OrderBy_1: "order by nKitDispensingNo desc",
    }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/View_StudyProductDispensingDtl",
        type: 'POST',
        data: WhereData,
        async: false,
        success: function (jsonData) {
            var strdata = "";
            var jsonData = jsonData.Table;
            for (var i = 0; i < jsonData.length; i++) {
                strdata += "<tr>";
                strdata += "<td>" + jsonData[i].vKitNo + "</td>";
                strdata += "<td>" + jsonData[i].vProjectNo + "</td>";
                strdata += "<td>" + jsonData[i].vNodeDisplayName + "</td>";
                strdata += "<td>-</td>";
                strdata += "<td>" + jsonData[i].vUnblindedBy + "</td>";
                strdata += "<td>" + jsonData[i].dUnblindedOn + "</td>";
                strdata += "</tr>";
            }
            $("#tbodyCodeUnblindDetail").append(strdata);
        },
        error: function () {
            alert("Error To Get Kit Dispensing Data !");
        }
    });
}