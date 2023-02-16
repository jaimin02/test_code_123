var workspaceIds = new Object();
var ModuleName = "Kit Allocation";
var setWorkspaceId;
var TempKitNoforAllocate;
var KitAllocatedFromBiznet = true;
var ParentWorkSpaceID = "";
var SubjectFailureORDiscontinue;

$(document).ready(function () {
    //CheckSetProjectGeneral("ddlProjectNodashboard");
    //if (setWorkspaceId != "") {
    //    console.log(setWorkspaceId);
    //}
    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('.modal').modal('hide');

    GetAllParentPRoject();
});

$('#ddlProjectNo').on('blur', function () {
    GetParentWorkSpaceID();
    GetVisit();
    GetKitDispensingData();
});

function GetParentWorkSpaceID() {

    if (workspaceIds[$('#ddlProjectNo').val()] != undefined) {
        setWorkspaceId = workspaceIds[$('#ddlProjectNo').val()];
    }

    if (setWorkspaceId == "" || setWorkspaceId == undefined) {
        return false;
    }

    var PostData = {
        WhereCondition_1: 'vWorkSpaceId = ' + setWorkspaceId + '',
        columnName_1: 'Top 1 ParentWorkspaceId',
    }
    $.ajax({
        url: BaseUrl + "PmsRecordFetch/View_MyProjects_FromBiznet",
        type: 'POST',
        data: PostData,
        success: function (jsonData) {
            jsonData = jsonData.Table;
            ParentWorkSpaceID = jsonData[0].ParentWorkspaceId
        },
        async: false,
        error: function () {
            SuccessorErrorMessageAlertBox("Kit Type Data Is Not Found !", ModuleName);
        }
    });
}

function GetVisit() {
    //if (workspaceIds[$('#ddlProjectNo').val()] != undefined) {
    //    setWorkspaceId = workspaceIds[$('#ddlProjectNo').val()];
    //}
    if (ParentWorkSpaceID == "" || ParentWorkSpaceID == undefined) {
        return false;
    }
    var PostData = {
        WhereCondition_1: 'vWorkSpaceId = ' + ParentWorkSpaceID + '',
        //columnName_1: 'Distinct iperiod ,vWorkspaceId'
        //columnName_1: 'Distinct vWorkspaceId ,ParentActivityName,iperiod',
        columnName_1: 'Distinct vWorkspaceId ,vActivityName',
    }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/GetVisitMappingProjectWise/"+ setWorkspaceId +"",
        type: 'GET',
        success: SuccessMethod,
        async: false,
        error: function () {
            SuccessorErrorMessageAlertBox("Kit Type Data Is Not Found !", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        jsonData = jsonData.Table;
        if (jsonData.length > 0) {
            $("#ddlPeriod").empty().append('<option selected="selected" value="0">Please Select Visit</option>');
            for (var i = 0; i < jsonData.length; i++)
                $("#ddlPeriod").append($("<option></option>").val(jsonData[i].vActivityName).html(jsonData[i].vActivityName));
        }
        else {
            $("#ddlPeriod").empty().append('<option selected="selected" value="0">Please Select Visit</option>');
        }
    }
}

$("#ddlPeriod").on('change', function () {
    GetKitDispensingData();
});

function GetKitDispensingData() {
    if (workspaceIds[$('#ddlProjectNo').val()] != undefined) {
        setWorkspaceId = workspaceIds[$('#ddlProjectNo').val()];
    }
    if (setWorkspaceId == "" || setWorkspaceId == undefined) {
        return false;
    }
    var wStr = "vWorkspaceId = " + setWorkspaceId + " AND cStatusIndi <> 'D' AND vNodeDisplayName = '" + $("#ddlPeriod :selected").text() + "'"
    //and cDispenseType in ('K','L')
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
        var JsonObj = jsonData.Table;
        var status_c;
        var ActivityDataset = [];
        var kitno = "";
        
        for (var i = 0; i < JsonObj.length; i++) {
            var InDataset = [];
            if (JsonObj[i].vKitNo == "") {
                JsonObj[i].vModifyBy = "-";
                JsonObj[i].dModifyOn = "-";
                status_c = '<img src="../Content/Images/KitAllocate.png" style="margin-left: 35%;width=35%;height=100%" data-toggle="modal"   vWorkspaceId="'
                            + JsonObj[i].vWorkspaceId + '"  vSubjectID="' + JsonObj[i].vMySubjectNo + '" vRandomizationNo="' + JsonObj[i].vRandomizationNo
                            + '"  iPeriod="' + JsonObj[i].iPeriod + '" vKitNo="' + JsonObj[i].vKitNo + '" vVisit="'
                            + JsonObj[i].vNodeDisplayName + '" cScreenFailure = "' + JsonObj[i].cScreenFailure
                            + '" cDisContinue = "' + JsonObj[i].cDisContinue + '" Onclick= AllocateKitNo(this); >'
                KitNo = JsonObj[i].vKitNo
            }
            else {
                status_c = '<img src="../Content/Images/KitNotAllocate.png" style="margin-left: 35%;width=35%;height=100%" />'
                KitNo = JsonObj[i].vKitNo + "-        " + '<i class="fa fa-eye" aria-hidden="true" title="Kit Detail" style="font-size:1.5em" data-toggle="modal" data-target="#KitDetails" onClick="KitDetails(this)" vKitNo="' +
                        JsonObj[i].vKitNo + '" vRandomizationCode ="' + JsonObj[i].vRandomizationNo + '" cDispenseType = "' + JsonObj[i].cDispenseType + '"></i>'
            }

            InDataset.push(JsonObj[i].vProjectNo, JsonObj[i].vMySubjectNo, JsonObj[i].vRandomizationNo, JsonObj[i].iPeriod,
                           JsonObj[i].vNodeDisplayName, KitNo, status_c, JsonObj[i].vModifyBy, JsonObj[i].dModifyOn);
            ActivityDataset.push(InDataset);
        }

        var otableProjectWiseAuditTrail = $('#tblPmsKitDispensing').dataTable({
            "bJQueryUI": true,
            "sPaginationType": "full_numbers",
            "bLengthChange": true,
            "iDisplayLength": 10,
            "bProcessing": true,
            "bSort": true,
            "aaData": ActivityDataset,
            "aaSorting": [],
            "bInfo": true,
            "bAutoWidth": false,
            "bDestroy": true,
            "aoColumns": [
               { "sTitle": "Project" },
               { "sTitle": "Subject ID" },
               { "sTitle": "Randomization No" },
               { "sTitle": "Visit" },
               { "sTitle": "Visit" },
               { "sTitle": "Kit/Product No" },
               { "sTitle": "Allocate" },
               { "sTitle": "Allocated By" },
               { "sTitle": "Allocated Date" },
            ],
            "columnDefs": [
                {
                    "targets": [3],
                    "visible": false,
                },
            ],
            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },
        });
    }
}
var KitAllocateData = [];

function GetDiscontinueSubject(SubjectID, Randomizationno) {
    var wStr = "vWorkspaceId = " + setWorkspaceId + " AND vMySubjectNo = '" + SubjectID + "' and vRandomizationNo = '" + Randomizationno + "'"
    var WhereData = {
        WhereCondition_1: wStr,
        columnName_1: "Top 1 cDisContinue,cScreenFailure"
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

        if (JsonObj[0].cDisContinue == "Y" || JsonObj[0].cScreenFailure == "Y") {
            SubjectFailureORDiscontinue = true;
        }
        else {
            SubjectFailureORDiscontinue = false;
        }
    }
}

function AllocateKitNo(e) {
    if (e.attributes["cScreenFailure"].value == "Y" || e.attributes["cDisContinue"].value == "Y") {
        SuccessorErrorMessageAlertBox("Kit Can not Allocate Because Subject is Either ScreenFailure or Discontinue !", ModuleName);
        return false;
    }

    GetDiscontinueSubject(e.attributes["vSubjectID"].value, e.attributes["vRandomizationNo"].value);

    if (SubjectFailureORDiscontinue == true) {
        SuccessorErrorMessageAlertBox("You Can Not Unblind This Subject </br>First Discontinue this Subject!", ModuleName);
        return false;
    }

    
    if (e.attributes["vRandomizationNo"].value == "") {
        SuccessorErrorMessageAlertBox("Selected Subject is Not Randomised So You CanNot Allocate Kit !", ModuleName);
        return false;
    }
    else
    {
        KitAllocationValidation(e.attributes["vRandomizationNo"].value)
        if (KitAllocatedFromBiznet == true) {
            $("#ModalESignAuth").modal('show');
        }
        else {
            SuccessorErrorMessageAlertBox("Kit is Already Allocated To This Subject !", ModuleName);
            GetKitDispensingData();
            return false;
        }
        
    }

    KitAllocateData = [];
    KitAllocateData.push({
        vWorkspaceId: e.attributes["vWorkspaceId"].value,
        vSubjectID: e.attributes["vSubjectID"].value,
        vRandomizationNo: e.attributes["vRandomizationNo"].value,
        iPeriod: e.attributes["iPeriod"].value,
        vKitNo: e.attributes["vKitNo"].value,
        iModifyBy: $("#hdnuserid").val(),
        vVisit: e.attributes["vVisit"].value
    });
    ElectronicSignature();
}

$('#btnESingAuthOK').on('click', function () {
    SaveKitDispensing();
});

function SaveKitDispensing() {
        if (!UserAuthentication()) {
        return false;
    }
    $(".modal").modal('hide');
    $.ajax({
        url: BaseUrl + "PmsRecordSave/Save_StudyProductKitDispensingDtl",
        type: 'POST',
        data: { '': KitAllocateData },
        success: SuccessInsertData,
        error: function () {
            SuccessorErrorMessageAlertBox("Error To Save Data in Kit Type !", ModuleName);

        }
    });

    function SuccessInsertData(response) {
        if (response.Table[0].vKitNo != undefined) {
            SuccessorErrorMessageAlertBox("Kit No " + response.Table[0].vKitNo + " Successfully Allocated !", ModuleName);
            GetKitDispensingData();
            //GetEmail(response.Table[0].vKitNo, setWorkspaceId);
        }
        else {
            SuccessorErrorMessageAlertBox(response.Table[0].Column1, ModuleName);
        }
    }
}

function GetEmail(vKitNo, WorkSpaceID) {
    var ProjectNoDataTemp = {
        WhereCondition_1: "vWorkSpaceID = '" + WorkSpaceID + "'",
        columnName_1: "vEmailID,vProjectNo"
    }
    $.ajax({
        url: BaseUrl + "PmsRecordFetch/view_workspaceprotocoldetail",
        type: 'POST',
        data: ProjectNoDataTemp,
        async: false,
        success: function (jsonData) {
            jsonData = jsonData.Table;
            if (jsonData[0].vEmailID != "") {
                GetEmailToProjectManager(vKitNo, jsonData[0].vProjectNo, jsonData[0].vEmailID)
            }
        },
        error: function () {
            ValidationAlertBox("Project Not Found !", "txtProjectNoDashboard", ModuleName);
        }
    });
}

function GetEmailToProjectManager(KitNo, ProjectNo,EmailID) {
    var PostData = {
        vKitNo: KitNo,
        vProjectNo: ProjectNo,
        vEmailID: EmailID
    }


    $.ajax({
        url: WebUrl + "PmsKitDispensing/SendEmailToPM",
        type: 'POST',
        data: ProjectNoDataTemp,
        async: false,
        success: function (jsonData) {
            jsonData = jsonData.Table;
            //alert(jsonData);
        },
        error: function () {
            ValidationAlertBox("Project Not Found !", "txtProjectNoDashboard", ModuleName);
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
            ValidationAlertBox("Project Not Found !", "txtProjectNoDashboard", ModuleName);
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
            $("#ddlProjectNo").autocomplete({
                source: sourceArr,
                change: function (event, ui) {
                },
                select: function (event, ui) {
                    $('#ddlProjectNo').blur();
                }
            });
        }

    }
}

function KitDetails(e) {
    var nKitTypeNo = e.attributes['vKitNo'].value;
    var vRandomizationNo = e.attributes['vRandomizationCode'].value;
    var cdispensetype = e.attributes['cDispenseType'].value;

    var PostData = {
        vWorkSpaceId: setWorkspaceId,
        vRandomizationcode: vRandomizationNo
    }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/Proc_GetDoubleBlindedCOUNT",
        type: 'POST',
        data: PostData,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Data Not Found !", ModuleName);
        }
    });

    function SuccessMethod(jsonKitTypeData) {
        if (jsonKitTypeData[0].TotalCOUNT >= 1)
        {
            if (cdispensetype == "K") {
                KitDispensingDetails(nKitTypeNo);
            }
            else if (cdispensetype == "L") {
                LabelDispensingDetails(nKitTypeNo);
            }
            
        }
        else {
            SuccessorErrorMessageAlertBox("This Project is Double Blinded, So You Can Not See Detail !", ModuleName);
        }
        
    }  
}

function KitDispensingDetails(nKitTypeNo) {
    var Viewname = "";
    var KitTypeDesc = "";
    var PostData = {
        WhereCondition_1: "vKitNo = '" + nKitTypeNo + "'"
    }
    Viewname = "View_StudyProductKitCreationDtl";
    
    
    $.ajax({
        url: BaseUrl + "PmsRecordFetch/" + Viewname + "",
        type: 'POST',
        data: PostData,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Kit Type Data Is Not Found !", ModuleName);
        }
    });

    function SuccessMethod(jsonKitTypeData) {
        var ActivityDataset = [];
        var jsonData = jsonKitTypeData.Table;
        for (var i = 0; i < jsonData.length; i++) {
            var InDataset = [];
            var InActive_c;

            InDataset.push(jsonData[i].vKitNo, jsonData[i].vKitTypeDesc, jsonData[i].vProductType, jsonData[i].vProductName, jsonData[i].vBatchLotNo, jsonData[i].DoseQty);
            ActivityDataset.push(InDataset);
        }

        otable = $('#tblStudyProductKitDetails').dataTable({
            "bJQueryUI": true,
            "sPaginationType": "full_numbers",
            "bLengthChange": false,
            "bProcessing": true,
            "bSort": false,
            "autoWidth": false,
            "aaData": ActivityDataset,
            "bInfo": true,
            "bDestroy": true,
            "aaSorting": [],
            "aoColumns": [
                 { "sTitle": "Kit No" },
                 { "sTitle": "Kit Type" },
                 { "sTitle": "Product Type" },
                 { "sTitle": "Product Name" },
                 { "sTitle": "Batch/Lot No." },
                 { "sTitle": "Quantity" },
            ],
            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },
        });
    }
}

function KitAllocationValidation(RandomizationNo) {
    var wStr = "";
    wStr = "vWorkspaceId = " + setWorkspaceId + " AND cStatusIndi <> 'D' AND vNodeDisplayName = '" + $("#ddlPeriod :selected").text() + "'"
    wStr += " and vRandomizationNo = '" + RandomizationNo + "'"

    var WhereData = {
        WhereCondition_1: wStr,
        ColumnName_1: "vKitno as [TotalCount]",
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
        jsonData = jsonData.Table;
        if (jsonData[0].TotalCount == 0) {
            KitAllocatedFromBiznet = true;
        }
        else {
            KitAllocatedFromBiznet = false;
        }
    }
}

function LabelDispensingDetails(vStudyProductLabelNo) {
    var Viewname = "";
    var KitTypeDesc = "";
    var PostData = {
        WhereCondition_1: "vStudyProductLabelNo = '" + vStudyProductLabelNo + "'"
    }
    Viewname = "View_StudyProductLabelCreationDtl";

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/" + Viewname + "",
        type: 'POST',
        data: PostData,
        success: function (jsonLabelData) {
            var ActivityDataset = [];
            var jsonData = jsonLabelData.Table;
            for (var i = 0; i < jsonData.length; i++) {
                var InDataset = [];
                InDataset.push(jsonData[i].vStudyProductLabelNo, jsonData[i].vProductType, jsonData[i].vProductName, jsonData[i].vBatchLotNo, jsonData[i].iNoofTablet);
                ActivityDataset.push(InDataset);
            }

            otable = $('#tblStudyProductKitDetails').dataTable({
                "bJQueryUI": true,
                "sPaginationType": "full_numbers",
                "bLengthChange": false,
                "bProcessing": true,
                "bSort": false,
                "autoWidth": false,
                "aaData": ActivityDataset,
                "bInfo": true,
                "bDestroy": true,
                "aaSorting": [],
                "aoColumns": [
                     { "sTitle": "Label No" },
                     { "sTitle": "Product Type" },
                     { "sTitle": "Product Name" },
                     { "sTitle": "Batch/Lot No." },
                     { "sTitle": "Quantity" },
                ],
                "oLanguage": {
                    "sEmptyTable": "No Record Found",
                },
            });
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Label Data Is Not Found !", ModuleName);
        }
    });
}