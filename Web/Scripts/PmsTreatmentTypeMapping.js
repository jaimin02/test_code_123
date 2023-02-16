var ModuleName;
var workspaceIds = new Object();
var TempFormulationType;
var KitTypeMappingData;
var nTreatmentTypeNoforDelete;
var setWorkspaceId = "";
var vProjectNo = "";

$(document).ready(function () {


    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('.modal').modal('hide');

    CheckSetProjectGeneral("txtProjectNoDashboard");


    $('input:radio[name=optradio]').change(function () {
        if (this.id == 'rdTreatment') {
            TreatmentTypeMapping();
        }
        else if (this.id == 'rdKit') {
            KitTypeMapping();
        }
        //else if (this.id == 'rdCombinational') {
        //    CombinationTypeMapping();
        //}
    });

    //$('#ddlActivity').multiselect({
    //    nonSelectedText: 'Please Select Activity',
    //    buttonClass: 'form-control',
    //    enableFiltering: true,
    //    enableCaseInsensitiveFiltering: true,
    //    numberDisplayed: 2,
    //});

    if (setWorkspaceId != undefined) {
        if ($('#rdTreatment').is(':checked') == true) {
            TreatmentTypeMapping();
        }
        else if ($('#rdKit').is(':checked') == true) {
            KitTypeMapping();
        }
        //else if ($('#rdCombinational').is(':checked') == true) {
        //    CombinationTypeMapping();
        //}
    }

    $('#txtProjectNoDashboard').on('change keyup paste mouseup', function () {
        var GetPmsProductBatchProjectNo =
            {
                Url: BaseUrl + "PmsGeneral/GetScopeWiseProject",
                SuccessMethod: "SuccessMethod"
            }

        if ($('#txtProjectNoDashboard').val().length == 2) {
            var ProjectNoDataTemp = {
                //vProjectNo: $('#txtProjectNoDashboard').val(),
                //iUserId: $("#hdnuserid").val(),
                //vProjectTypeCode: $("#hdnscopevalues").val(),
                iUserId: $("#hdnuserid").val(),
                vStudyCode: $('#txtProjectNoDashboard').val()
            }
            GetAllPmsProductbatchProjectNo(GetPmsProductBatchProjectNo.Url, GetPmsProductBatchProjectNo.SuccessMethod, ProjectNoDataTemp);

        }
        else if ($('#txtProjectNoDashboard').val().length < 2) {
            $("#txtProjectNoDashboard").autocomplete({
                source: "",
                change: function (event, ui) { },
                select: function (event, ui) {
                    vProjectNo = ui.item.value;
                    $('#txtProjectNoDashboard').val(vProjectNo);
                    $('#txtProjectNoDashboard').blur();

                }

            });
        }
    });
});



//$('#DDLProjectNo').on('change keyup paste mouseup', function () {
//    var GetPmsProductBatchProjectNo = {
//        Url: BaseUrl + "PmsProductBatch/GetProjectNo",
//        SuccessMethod: "SuccessMethod"
//    }

//    if ($('#DDLProjectNo').val().length == 2) {
//        var ProjectNoDataTemp = {
//            vProjectNo: $('#DDLProjectNo').val(),
//            iUserId: $("#hdnuserid").val(),
//            vProjectTypeCode: $("#hdnscopevalues").val(),
//        }
//        GetAllPmsProductbatchProjectNo(GetPmsProductBatchProjectNo.Url, GetPmsProductBatchProjectNo.SuccessMethod, ProjectNoDataTemp);

//    }
//    else if ($('#DDLProjectNo').val().length < 2) {
//        $("#DDLProjectNo").autocomplete({
//            source: "",
//            change: function (event, ui) { },
//            select: function (event, ui) {
//                $('#DDLProjectNo').blur();
//            }

//        });
//    }
//});

$('#txtProjectNoDashboard').on('blur', function () {
    if (workspaceIds[$('#txtProjectNoDashboard').val()] != undefined) {
        setWorkspaceId = workspaceIds[$('#txtProjectNoDashboard').val()];
    }
    if (setWorkspaceId == "" || setWorkspaceId == undefined) {
        ValidationAlertBox("Please enter Project No.", "DDLProjectNo", ModuleName);
        return false;
    }
    if ($('#rdTreatment').is(':checked') == true) {
        TreatmentTypeMapping();
    }
    else if ($('#rdKit').is(':checked') == true) {
        KitTypeMapping();
    }
});

//$('#DDLProjectNo').on('blur', function () {
//    if (workspaceIds[$('#DDLProjectNo').val()] != undefined) {
//        setWorkspaceIdForCombo = workspaceIds[$('#DDLProjectNo').val()];
//    }
//});


function GetTreatmentTypeMappingData() {
    if (setWorkspaceId == undefined) {
        setWorkspaceId = "";
    }
    var wStr = "vWorkspaceId = " + setWorkspaceId + ""
    var WhereData = {
        WhereCondition_1: wStr,
        columnName_1: "Distinct vFormulationType,vProductType,iQty,cEditFlag,nProductTypeID,nTreatmentTypeNo"
    }
    if (setWorkspaceId != "") {
        $.ajax({
            url: BaseUrl + "PmsRecordFetch/View_TreatmentTypeMapping",
            type: 'POST',
            data: WhereData,
            async: false,
            success: SuccessTreatTypeMappingData,
        });

        function SuccessTreatTypeMappingData(data) {
            data = data.Table;

            var ActivityDataset = [];
            var $ddlProductType = "";
            var $txtQty = "";
            var $chkEdit = "";
            var $btnDelete = "";

            if (data.length > 0) {
                $("#btnSavePmsTreatmentType").attr("style", "display:inline");
            }
            else {
                $("#btnSavePmsTreatmentType").attr("style", "display:none");
            }

            for (var i = 0; i < data.length; i++) {
                var InDataset = [];
                $ddlProductType = data[i].vProductType;
                if (data[i].iQty == null || data[i].iQty == 0) {
                    $txtQty = '<input type="text" id="txtQty' + data[i].vFormulationType + '" placeholder="Quantity" class="form-control" style="height: 26px"/>';
                    $btnDelete = '<a class="disabled viewmode"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a mb-10"><i class="fa fa-trash-o"></i> <span>Delete</span></a>';
                }
                else {
                    $txtQty = data[i].iQty;
                    $btnDelete = '<a href="Javascript:void(0);" title="Delete" onclick="PmsTreatmentTypeDelete(this)" vFormulationType = "' + data[i].vFormulationType
                                   + '" vProductType = "' + data[i].vProductType + '" nTreatmentTypeNo = "' + data[i].nTreatmentTypeNo + '"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a mb-10"><i class="fa fa-trash-o"></i><span>Delete</span></i></a>'
                }

                if (data[i].cEditFlag == null) {
                    $chkEdit = '<input class="chk" type="checkbox" name="case" id=chk' + data[i].vFormulationType + ' value="' + data[i].vFormulationType + '"/>';
                }
                else if (data[i].cEditFlag == "N") {
                    if (data[i].iQty == null || data[i].iQty == 0) {
                        $chkEdit = '<input class="chk" type="checkbox" name="case" id=chk' + data[i].vFormulationType + ' value="' + data[i].vFormulationType + '"/>';
                    }
                    else {
                        $chkEdit = '<input class="chk" type="checkbox" name="case" id=chk' + data[i].vFormulationType + ' value="' + data[i].vFormulationType + '" disabled/>';
                    }
                }
                else if (data[i].cEditFlag == "Y") {
                    if (data[i].iQty == null || data[i].iQty == 0) {
                        $chkEdit = '<input class="chk" type="checkbox" name="case" id=chk' + data[i].vFormulationType + ' value="' + data[i].vFormulationType + '"/>';
                    }
                    else {
                        $chkEdit = '<input class="chk" type="checkbox" name="case" id=chk' + data[i].vFormulationType + ' value="' + data[i].vFormulationType + '" disabled checked="checked"/>';
                    }
                }
                else {
                    $chkEdit = '<input class="chk" type="checkbox" name="case" id=chk' + data[i].vFormulationType + ' value="' + data[i].vFormulationType + '" checked="checked" disabled/>';
                }

                InDataset.push(data[i].vFormulationType, $ddlProductType, $txtQty, $chkEdit, $btnDelete, data[i].nProductTypeID, data[i].nTreatmentTypeNo);
                ActivityDataset.push(InDataset);
            }


            otableProjectWiseAuditTrail = $('#tblPmsTreatmentTypeMapping').dataTable({
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
                   { "sTitle": "Treatment" },
                   { "sTitle": "Product Type" },
                   { "sTitle": "Quantity" },
                   { "sTitle": "Edit Applicable" },
                   { "sTitle": "Delete" },
                   { "sTitle": "nProductTypeID" },
                   { "sTitle": "nTreatmentTypeNo" },
                ],
                "columnDefs": [
                    { "width": "6%", "targets": 0 },
                    { "width": "20%", "targets": 1 },
                    { "width": "15%", "targets": 2 },
                    { "width": "15%", "targets": 3 },
                    { "width": "15%", "targets": 4 },

                    {
                        "targets": [5, 6],
                        "visible": false,
                        "searchable": false
                    },
                ],
                "oLanguage": {
                    "sEmptyTable": "No Record Found",
                },
            });
            //GetProductType();
        }
    }
}

var GetAllPmsProductbatchProjectNo = function (Url, SuccessMethod, ProjectNoDataTemp) {

    $.ajax({
        url: Url,
        type: 'GET',
        //data: { id: ProjectNoDataTemp.iUserId, projectno: ProjectNoDataTemp.vProjectNo, typecode: ProjectNoDataTemp.vProjectTypeCode },
        data: { iUserId: ProjectNoDataTemp.iUserId, vStudyCode: ProjectNoDataTemp.vStudyCode },
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
            sourceArr.push("[ " + jsonObj[i].vStudyCode + " ]");
            //workspaceIds["[ " + jsonObj[i].vProjectNo + " ]" + " " + jsonObj[i].vRequestId] = jsonObj[i].vWorkspaceId;
            workspaceIds["[ " + jsonObj[i].vStudyCode + " ]"] = jsonObj[i].nStudyNo
        }

        $("#txtProjectNoDashboard").autocomplete({
            source: sourceArr,
            change: function (event, ui) { },
            select: function (event, ui) {
                nStudyNo = ui.item.value;
                $('#txtProjectNoDashboard').val(nStudyNo);
                $('#txtProjectNoDashboard').blur();
            }
        });
    }
}

function GetProductType() {
    if (setWorkspaceId != "") {
        var GetProductType = {
            Url: BaseUrl + "PmsGeneral/GetProductType/" + setWorkspaceId,
            SuccessMethod: "SuccessMethod"
        }

        $.ajax({
            url: GetProductType.Url,
            type: 'GET',
            success: SuccessMethod,
            error: function () {
                SuccessorErrorMessageAlertBox("Product Type Not Found !", ModuleName);

                return false;
            }
        });

        function SuccessMethod(jsonData) {
            $(".ddlProductType").empty().append('<option selected="selected" value="0">Please Select Product Type</option>');
            for (var i = 0; i < jsonData.length; i++) {
                $(".ddlProductType").append($("<option></option>").val(jsonData[i].nProductTypeID).html(jsonData[i].vProductType));
            }
        }
    }
}

$('#btnExitPmsTreatmentType').on('click', function () {
    ConfirmAlertBox(ModuleName, $("#RedirectToHome").val());
});

$('#btnSavePmsTreatmentType').on('click', function () {
    var iQty;
    var nProductTypeID;
    var vFormulationType;
    var cEditFlag;
    var MyRows = $('table#tblPmsTreatmentTypeMapping').find('tbody').find('tr');
    var TreatmentType = {};
    var TreatmentTypeResult = [];
    var count = 0;
    var nTreatmentTypeNo;
    for (var i = 0; i < MyRows.length; i++) {
        vFormulationType = $(MyRows[i]).find('td:eq(0)').html();
        iQty = $("input[id*=txtQty" + vFormulationType + "]").val();


        if (iQty != undefined) {
            nProductTypeID = otableProjectWiseAuditTrail.fnGetData(i)[5];
            nTreatmentTypeNo = otableProjectWiseAuditTrail.fnGetData(i)[6];

            if (nProductTypeID != null && iQty != '') {
                count++;
                var checkbox = $(MyRows[i]).find('td:eq(3) input').is(':checked');
                if (checkbox == true) {
                    cEditFlag = "Y";
                }
                else {
                    cEditFlag = "N";
                }

                if (iQty != '') {
                    TreatmentType = {};
                    TreatmentType = {
                        vWorkSpaceID: setWorkspaceId,
                        vFormulationType: vFormulationType,
                        nProductTypeID: nProductTypeID,
                        iQty: iQty,
                        cEditFlag: cEditFlag,
                        vSubmission: $(MyRows[i]).find('td:eq(4)').html(),
                        iModifyBy: $("#hdnuserid").val(),
                        DATAOPMODE: "1",
                        nTreatmentTypeNo: nTreatmentTypeNo
                        //vFormulationType: vFormulationType,
                    }
                    TreatmentTypeResult.push(TreatmentType);
                }
            }
        }
    }


    if (count != 0) {
        $.ajax({
            url: BaseUrl + "PmsRecordSave/Save_TreatmentTypeMapping",
            type: 'POST',
            data: { '': TreatmentTypeResult },
            success: function (data) {
                GetTreatmentTypeMappingData();
                SuccessorErrorMessageAlertBox("Data Saved Successfully !", ModuleName);
            },
            error: function () {
                SuccessorErrorMessageAlertBox("Error !", ModuleName);
            }
        });
    }
    else {
        SuccessorErrorMessageAlertBox("There is No Data to Save !", ModuleName);
    }
});

function PmsTreatmentTypeDelete(e) {
    TempFormulationType = $(e).attr("vFormulationType");
    var vProductType = $(e).attr("vProductType");
    nTreatmentTypeNoforDelete = $(e).attr("nTreatmentTypeNo");

    var wStr = "vWorkspaceId = " + setWorkspaceId + " and vProductType = '" + vProductType + "'"
    var WhereData = {
        WhereCondition_1: wStr,
        columnName_1: "COUNT(*) as [TotalCOUNT]"
    }
    if (setWorkspaceId != "") {
        $.ajax({
            url: BaseUrl + "PmsRecordFetch/View_StudyProductKitTypeMst",
            type: 'POST',
            data: WhereData,
            async: false,
            success: SuccessTreatTypeMappingData,
        });

        function SuccessTreatTypeMappingData(data) {
            data = data.Table;
            if (data.length > 0) {
                if (data[0].TotalCOUNT == 0) {
                    $('#myModal').modal('show');
                    $("#txtRemark").val("");

                }
                else {
                    SuccessorErrorMessageAlertBox("Kit Type is Defined for Product Type " + vProductType + ", So You Can Not Delete Treatment Type !", ModuleName);
                    return false;
                }
            }
            else {
                $('#myModal').modal('show');
                $("#txtRemark").val("");
            }
        }
    }
}

$('#btnDelete').on('click', function () {
    var TreatmentType = {};
    var TreatmentTypeResult = [];

    if (isBlank(document.getElementById('txtRemark').value)) {
        ValidationAlertBox("Please Enter Remark !", "txtRemark", ModuleName);
        return false;
    }

    TreatmentType = {
        vWorkSpaceID: setWorkspaceId,
        vFormulationType: TempFormulationType,
        iModifyBy: $("#hdnuserid").val(),
        DATAOPMODE: "3",
        vRemark: $("#txtRemark").val(),
        nTreatmentTypeNo: nTreatmentTypeNoforDelete,
    }
    TreatmentTypeResult.push(TreatmentType);

    $.ajax({
        url: BaseUrl + "PmsRecordSave/Save_TreatmentTypeMapping",
        type: 'POST',
        data: { '': TreatmentTypeResult },
        success: function (data) {
            GetTreatmentTypeMappingData();
            SuccessorErrorMessageAlertBox("Data Deleted Successfully !", ModuleName);
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Error !", ModuleName);
        }
    });
});

function GetKitTypeMappingData() {

    var wStr = "vWorkspaceId = '" + setWorkspaceId + "' and cStatusIndi <> 'D'"
    var WhereData = {
        WhereCondition_1: wStr,
    }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/View_StudyProductKitTypeMapping",
        type: 'POST',
        data: WhereData,
        async: false,
        success: SuccessResult,
        error: function () {
            alert("Error To Get Project Wise Audit Trail !");
        }
    });

    function SuccessResult(jsonData) {
        var JsonObj = jsonData.Table;
        KitTypeMappingData = jsonData.Table
        var ActivityDataset = [];
        //console.log(JSON.stringify(jsonData))
        if (JsonObj.length > 0) {
            for (var i = 0; i < JsonObj.length; i++) {
                var InDataset = [];
                var NonDispensingVisitvalue = JsonObj[i].cIsNonDispensingVisit == "Y" ? "Yes" : "No"
                var NonDispensingVisit = JsonObj[i].cIsNonDispensingVisit == "Y" ? "checked" : "unchecked"
                InDataset.push(JsonObj[i].vApplicableVisit, JsonObj[i].vActivityName, "<input type='hidden' class='hdnkiTypeMapping' value='" + JsonObj[i].nKitTypeMappingNo + "'><input type='checkbox'  class='cIsNonDispensingVisit' " + NonDispensingVisit + " value='" + NonDispensingVisitvalue + "' style='margin-left: 90px;' disabled>", "<a  class='NonDispensingVisitEdit' style='cursor: pointer;' title='Edit' >Edit</a>", JsonObj[i].vModifyBy, JsonObj[i].dModifyOn);
                ActivityDataset.push(InDataset);
            }
        }
        else {
            ActivityDataset = [];
        }

        otableMinimumInventoryDtl = $('#tblPMSKitTypeMapping').dataTable({
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
                //{ "sTitle": "Kit Type MappingNo" },
               { "sTitle": "Visit Name" },
               { "sTitle": "Activity " },
               { "sTitle": "Non Dispensing Visit" },
               { "sTitle": "Action " },
               { "sTitle": "Kit Type Mapping By" },
               { "sTitle": "Kit Type Mapping On" },
            ],
            "columnDefs": [
                //{ "bVisible": false, "aTargets": [0] }
            ],
            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },

        });

    }
}
//fnSetColumnVis(1, false);
//$(".NonDispensingVisitEdit").click(function () {
//    alert(8)
//})




function KitTypeMapping() {
    ModuleName = "Activity Visit Mapping";
    $("#divtreatment").attr("style", "display:none");
    $("#divKit").attr("style", "display:block");
    $("#btnCombinationalTypeMapping").attr("style", "display:none");
    $("#btnKitTypeMapping").attr("style", "display:block");

    if (setWorkspaceId == "" || setWorkspaceId == undefined) {
        //ValidationAlertBox("Please enter Project No.", "DDLProjectNo", ModuleName);
        return false;
    }

    GetActivity();
    GetVisit();
    GetKitTypeMappingData();
}

function TreatmentTypeMapping() {
    ModuleName = "Treatment Type Mapping";
    $("#divtreatment").attr("style", "display:block");
    $("#divKit").attr("style", "display:none");
    $("#btnKitTypeMapping").attr("style", "display:none");

    GetTreatmentTypeMappingData();

}

function GetVisit() {

    if (workspaceIds[$('#txtProjectNoDashboard').val()] != undefined) {
        setWorkspaceId = workspaceIds[$('#txtProjectNoDashboard').val()];
    }

    var PostData = {
        WhereCondition_1: "vWorkSpaceId = '" + setWorkspaceId + "' and cStatusIndi <> 'D' Order by iPeriod",
        columnName_1: 'Distinct vApplicableVisit,iPeriod',
    }
    $.ajax({
        url: BaseUrl + "PmsRecordFetch/ViewRandomizationDetailData",
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
        $("#ddlVisitName").empty().append('<option selected="selected" value="0">Please Select Visit</option>');
        $("#ddlVisitName").append('<option value="1">Visit2</option>');
        $("#ddlVisitName").append('<option value="2">Visit3</option>');
        $("#ddlVisitName").append('<option value="3">Visit4</option>');
        $("#ddlVisitName").append('<option value="4">Visit5</option>');
        $("#ddlVisitName").append('<option value="5">Visit6</option>');
        $("#ddlVisitName").append('<option value="6">Visit7</option>');
        $("#ddlVisitName").append('<option value="7">Visit8</option>');
        $("#ddlVisitName").append('<option value="8">Visit9</option>');
        $("#ddlVisitName").append('<option value="9">Visit10</option>');
        $("#ddlVisitName").append('<option value="10">Visit11</option>');
        $("#ddlVisitName").append('<option value="11">Visit12</option>');
        $("#ddlVisitName").append('<option value="12">Visit13</option>');
        $("#ddlVisitName").append('<option value="13">Visit14</option>');
        $("#ddlVisitName").append('<option value="14">Visit15</option>');
        $("#ddlVisitName").append('<option value="15">Visit16</option>');
        $("#ddlVisitName").append('<option value="16">Visit17</option>');
        $("#ddlVisitName").append('<option value="17">Visit18</option>');
        $("#ddlVisitName").append('<option value="18">Visit19</option>');
        $("#ddlVisitName").append('<option value="19">Visit20</option>');
        $("#ddlVisitName").append('<option value="20">Visit21</option>');
        $("#ddlVisitName").append('<option value="21">Visit22</option>');
        $("#ddlVisitName").append('<option value="22">Visit23</option>');
        $("#ddlVisitName").append('<option value="23">Visit24</option>');
        $("#ddlVisitName").append('<option value="24">Visit25</option>');
        //for (var i = 0; i < jsonData.length; i++) {
        //    $("#ddlVisitName").append($("<option></option>").val(jsonData[i].vApplicableVisit).html(jsonData[i].vApplicableVisit));
        //}
    }
}

function GetActivity() {
    $('#ddlActivity option').each(function () {
        $(this).remove();
    });
    if (workspaceIds[$('#txtProjectNoDashboard').val()] != undefined) {
        setWorkspaceId = workspaceIds[$('#txtProjectNoDashboard').val()];
    }
    if (setWorkspaceId == "" || setWorkspaceId == undefined) {
        return false;
    }
    var PostData = {
        WhereCondition_1: "vWorkSpaceId = '" + setWorkspaceId + "' AND vNodeDisplayName <> ''  Order By iNodeNo",
        columnName_1: 'Distinct vWorkspaceId ,vNodeDisplayName,iNodeNo',
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
        $("#ddlActivity").append('<option value="VISIT 2">VISIT 2</option>');
        $("#ddlActivity").append('<option value="VISIT 3">VISIT 3</option>');
        $("#ddlActivity").append('<option value="VISIT 4">VISIT 4</option>');
        $("#ddlActivity").append('<option value="VISIT 5">VISIT 5</option>');
        $("#ddlActivity").append('<option value="VISIT 6">VISIT 6</option>');
        $("#ddlActivity").append('<option value="VISIT 7">VISIT 7</option>');
        $("#ddlActivity").append('<option value="VISIT 8">VISIT 8</option>');
        $("#ddlActivity").append('<option value="VISIT 9">VISIT 9</option>');
        $("#ddlActivity").append('<option value="VISIT 10">VISIT 10</option>');
        $("#ddlActivity").append('<option value="VISIT 11">VISIT 11</option>');
        $("#ddlActivity").append('<option value="VISIT 12">VISIT 12</option>');
        $("#ddlActivity").append('<option value="VISIT 13">VISIT 13</option>');
        $("#ddlActivity").append('<option value="VISIT 14">VISIT 14</option>');
        $("#ddlActivity").append('<option value="VISIT 15">VISIT 15</option>');
        $("#ddlActivity").append('<option value="VISIT 16">VISIT 16</option>');
        $("#ddlActivity").append('<option value="VISIT 17">VISIT 17</option>');
        $("#ddlActivity").append('<option value="VISIT 18">VISIT 18</option>');
        $("#ddlActivity").append('<option value="VISIT 19">VISIT 19</option>');
        $("#ddlActivity").append('<option value="VISIT 20">VISIT 20</option>');
        $("#ddlActivity").append('<option value="VISIT 21">VISIT 21</option>');
        $("#ddlActivity").append('<option value="VISIT 22">VISIT 22</option>');
        $("#ddlActivity").append('<option value="VISIT 23">VISIT 23</option>');
        $("#ddlActivity").append('<option value="VISIT 24">VISIT 24</option>');
        $("#ddlActivity").append('<option value="VISIT 25">VISIT 25</option>');
        if (jsonData.length > 0) {
            for (var i = 0; i < jsonData.length; i++) {
                $("#ddlActivity").append($("<option></option>").val(jsonData[i].vNodeDisplayName).html(jsonData[i].vNodeDisplayName));
                $('#ddlActivity').multiselect('rebuild');
            }
        }
    }
}

function AddTempDataKitMapping() {
    if (Dropdown_Validation(document.getElementById("ddlVisitName"))) {
        ValidationAlertBox("Please Select Visit Name !", "ddlVisitName", ModuleName);
        return false;
    }

    if ($('#ddlActivity').val() == null) {
        ValidationAlertBox("Please Select At Least One Activity!", "ddlActivity", ModuleName);
        return false;
    }

    if (CheckRecordExist() == true) {
        var lengthofActivity = $("#ddlActivity").val().length;
        for (var i = 0; i < lengthofActivity ; i++) {
            var strdata = "";
            strdata += "<tr>";
            strdata += "<td>" + $("#ddlVisitName option:selected").text(); + "</td>";
            strdata += "<td>" + $("#ddlActivity").val()[i] + "</td>";

            if ($('#chkNonDispensingVisit').is(":checked")) {
                strdata += "<td>Yes</td>";
            }
            else {
                strdata += "<td>No</td>";
            }

            strdata += "<td id='trRemove'><span class='glyphicon glyphicon-remove'></span></td>";
            strdata += "</tr>";
            $("#tbodyKitMappingTemp").append(strdata);
        }


        $("#btnSaveKitMapping").attr("style", "display:inline");
        $("#tblKitMappingTemp").show();
        $("#ddlActivity").multiselect("clearSelection");
        $("#ddlActivity").multiselect('refresh');
        $('#ddlVisitName').val(0);
        $('#chkNonDispensingVisit').prop('checked', false);
    }
}

function clearData() {
    $("#ddlActivity").multiselect("clearSelection");
    $("#ddlActivity").multiselect('refresh');
    $('#ddlVisitName').val(0);
    $('#tblKitMappingTemp tbody').text('');
    $('#tblKitMappingTemp').hide();
    $('#chkNonDispensingVisit').prop('checked', false);
    document.getElementById('btnSaveKitMapping').style.display = 'none';
}

//function CombinationTypeMapping() {
//    ModuleName = "Combinational Type Mapping";
//    $("#divtreatment").attr("style", "display:none");
//    $("#divKit").attr("style", "display:none");
//    $("#btnKitTypeMapping").attr("style", "display:none");
//    $("#btnCombinationalTypeMapping").attr("style", "display:block");
//    $("#DDLProjectNo").val($("#txtProjectNoDashboard").val()).prop('disabled', true);
//    //GetActivity();
//    //GetVisit();
//    //GetKitTypeMappingData();
//}


//$(".NonDispensingVisitEdit").on("click", function () {
$(function () {
    var all_tr = $('tr');
    $(document).on("click", ".NonDispensingVisitEdit", function () {
        $(".cIsNonDispensingVisit").attr("disabled", "disabled");
        $(".NonDispensingVisitUpdate").text("Edit");
        var $row = $(this).closest("tr");
        //$row.find(".cIsNonDispensingVisit").attr("disabled", "disabled");
        //$(".NonDispensingVisitUpdate").text("Edit");
        //$row.find(".NonDispensingVisitUpdate").addClass("NonDispensingVisitEdit");
        //$row.find(".NonDispensingVisitUpdate").removeClass("NonDispensingVisitUpdate");
        //if ($row[0].rowIndex > 0)
        //{
        $row.find(".cIsNonDispensingVisit").removeAttr("disabled");
        $row.find(".NonDispensingVisitEdit").addClass("NonDispensingVisitUpdate");
        $row.find(".NonDispensingVisitEdit").removeClass("NonDispensingVisitEdit");
        $row.find(".NonDispensingVisitUpdate").text("Update");
        $row.find(".NonDispensingVisitUpdate").attr('title', 'Update');
        //}

        //var result = confirm('Are You Sure You Want To Edit ?');
        //if (result) {
        //    $row.find(".cIsNonDispensingVisit").removeAttr("disabled");
        //} else {
        //    $row.find(".cIsNonDispensingVisit").attr("disabled", true);
        //}

    })
});


//Highlight row when selected.
//$(function () {
//    $(document).on("click", ".NonDispensingVisitEdit", function () {
//        debugger
//        // new code
//        if (isEditing) {
//            $row.find(".cIsNonDispensingVisit").removeAttr("disabled");
//            return;
//        }
//        $row.find(".cIsNonDispensingVisit").attr("disabled", true);
//        $('.NonDispensingVisitEdit').removeClass('selectedRow');
//        $(this).addClass('selectedRow');
//    });
//});



$(document).on('click', ".NonDispensingVisitUpdate", function () {
    var KitTypeMapping = {};
    var KitTypeMappingDtl = [];

    //var result = ConfirmAlertBoxKit(ModuleName, 'Are You Sure You Want To Update ?');
    //if (result) {
    var $row = $(this).closest("tr");
    KitTypeMapping = {
        vWorkSpaceID: setWorkspaceId,
        nKitTypeMappingNo: $row.find(".hdnkiTypeMapping").val(),
        vApplicableVisit: $row.find('td:eq(0)').html(),
        vActivityName: $row.find('td:eq(1)').html(),
        cIsNonDispensingVisit: String($row.find(".cIsNonDispensingVisit").val()).toLowerCase() == "yes" ? "Y" : "N",//String($row.find('td:eq(2)').html()).toLowerCase() == "yes" ? "Y" : "N",
        iModifyBy: $("#hdnuserid").val(),
        cStatusIndi: 'N',
        DATAOPMODE: '2',
    }
    //console.log(JSON.stringify(KitTypeMapping))

    KitTypeMappingDtl.push(KitTypeMapping);

    var InsertProductDispenseHdrData = {
        Url: BaseUrl + "PmsRecordSave/Save_StudyProductKitTypeMapping",
        SuccessMethod: "SuccessMethod",
        Data: KitTypeMappingDtl
    }
    var result = ConfirmAlertBoxKit(ModuleName, 'Are You Sure You Want To Update ?', InsertProductDispenseHdrData);
    // ConfirmAlertFunction(InsertProductDispenseHdrData)
    //} else {
    //    //$row.find(".cIsNonDispensingVisit").attr("disabled", true);
    //}
});
function ConfirmAlertBoxKit(ModuleName, strConfirmMessage, InsertProductDispenseHdrData) {
    //sessionStorage.setItem("InsertData",InsertProductDispenseHdrData);
    var data = InsertProductDispenseHdrData;
    var strdata = "";
    strdata += "<div class='modal-dialog' style='width:450px'>";
    strdata += "<div class='DTED_Lightbox_Content' style='height: auto;'>";
    strdata += "<div class='modal-content modal-content-AlertPromt'>";
    strdata += "<div class='modal-header modalheader'>"
    strdata += "<button type='button' class='Close' onClick='CancelPromt()'>&times;</button>"
    strdata += "<h4 class='modal-title modaltitle text-center'><label id='lblmsg' class='text-center' style='color:black'>" + ModuleName + "</label></h4></div>";
    strdata += "<div class='modal-body' style='padding:0px'><div class='box-body'>"
    if (strConfirmMessage == undefined) {
        strdata += "<span class='fa  fa-question-circle' style='color:red'></span><label id='lblmsg' class='text-center'>" + ConfirmMessage + "</label>";
    }
    else {
        strdata += "<span class='fa  fa-question-circle' style='color:red'></span><label id='lblmsg' class='text-center'>" + strConfirmMessage + "</label>";
    }
    strdata += "</div></div>";
    strdata += "<div class='modal-footer modalfooter'>";
    strdata += "<button type='button' class='btn btn-primary' onclick='ConfirmAlertFunction(" + JSON.stringify(InsertProductDispenseHdrData) + ")'><i class='fa fa-check'></i> Confirm</button>"
    strdata += "<button type='button' class='btn btn-default' onClick=CancelPromt()><i class='fa fa-times'></i>Cancel</button>"
    strdata += "</div></div></div></div>"
    $("#AlertPopup").append(strdata);
    $("#AlertPopup").modal('show');
}
function ConfirmAlertFunction(InsertProductDispenseHdrData) {

    $("#AlertPopup").modal('hide');
    $("#AlertPopup").html("");

    StudyProductKitTypeMapping_insertupdate(InsertProductDispenseHdrData.Url, InsertProductDispenseHdrData.SuccessMethod, InsertProductDispenseHdrData.Data);

}

function CancelPromt() {
    $("#AlertPopup").modal('hide');
    $("#AlertPopup").html("");
}
function StudyProductKitTypeMapping_insertupdate(Url, SuccessMethod, Data) {

    var KitTypeMappingDtl = [];
    KitTypeMappingDtl = Data;
    $.ajax({
        url: BaseUrl + "PmsRecordSave/Save_StudyProductKitTypeMapping",
        type: 'POST',
        data: { '': KitTypeMappingDtl },
        success: function (data) {
            var $row = $(this).closest("tr");
            $row.find(".cIsNonDispensingVisit").attr("disabled", "disabled");
            $row.find(".NonDispensingVisitEdit").addClass("NonDispensingVisitEdit");
            $row.find(".NonDispensingVisitEdit").removeClass("NonDispensingVisitUpdate");
            $(".NonDispensingVisitEdit").text("Edit")
            SuccessorErrorMessageAlertBox("Data Update Successfully !", ModuleName);
            setTimeout(function () {
                $("div").removeClass("modal-backdrop fade in")
            }, 100);

            GetKitTypeMappingData();
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Error !", ModuleName);
        }
    });
    //$.ajax({
    //    url: Url,//BaseUrl + "PmsRecordSave/Save_StudyProductKitTypeMapping",
    //    type: 'POST',
    //    data: { '': KitTypeMappingDtl },
    //    success: function (data) {
    //        var $row = $(this).closest("tr");
    //        $row.find(".cIsNonDispensingVisit").attr("disabled", "disabled");
    //        $row.find(".NonDispensingVisitEdit").addClass("NonDispensingVisitEdit");
    //        $row.find(".NonDispensingVisitEdit").removeClass("NonDispensingVisitUpdate");
    //        $(".NonDispensingVisitEdit").text("Edit")
    //        function SuccessInsertData(response) {

    //            if (response.length > 0) {
    //                SuccessorErrorMessageAlertBox("Data Update Successfully !", ModuleName);
    //                GetKitTypeMappingData();
    //            }
    //        };
    //    },
    //    error: function () {
    //        SuccessorErrorMessageAlertBox("Error !", ModuleName);
    //    }
    //});
}
$(document).on('change', ".cIsNonDispensingVisit", function () {
    if ($(this).is(':checked')) {
        $(this).attr('value', 'Yes');
    } else {
        $(this).attr('value', 'No');
    }

    $('#checkbox-value').text($('#checkbox1').val());
});
$("#btnExitKitMapping").on('click', function () {
    ConfirmAlertBox(ModuleName);
});

$("#tblKitMappingTemp").on('click', '#trRemove', function () {
    $(this).closest('tr').remove();

    if ($("#tblKitMappingTemp tbody tr").length != 0) {
        $("#tblKitMappingTemp").show();
        $("#btnSaveKitMapping").show();
    }
    else {
        $("#tblKitMappingTemp").hide();
        $('#btnSaveKitMapping').hide();
    }
});

$('#btnKitTypeMapping').on('click', function () {
    if (setWorkspaceId == "" || setWorkspaceId == undefined) {
        ValidationAlertBox("Please enter Project No.", "DDLProjectNo", ModuleName);
        return false;
    }
    $("#btnSaveKitMapping").attr("style", "display:none");
    clearData();
});

$('#btnSaveKitMapping').on('click', function () {
    var KitTypeMapping = {};
    var KitTypeMappingDtl = [];

    if (CheckRecordExist() == true) {
        var MyRows = $('table#tblKitMappingTemp').find('tbody').find('tr');
        for (var i = 0; i < MyRows.length; i++) {
            KitTypeMapping = {
                vWorkSpaceID: setWorkspaceId,
                vApplicableVisit: $(MyRows[i]).find('td:eq(0)').html(),
                vActivityName: $(MyRows[i]).find('td:eq(1)').html(),
                cIsNonDispensingVisit: String($(MyRows[i]).find('td:eq(2)').html()).toLowerCase() == "yes" ? "Y" : "N",
                iModifyBy: $("#hdnuserid").val(),
                cStatusIndi: 'N',
                DATAOPMODE: '1',
            }
            KitTypeMappingDtl.push(KitTypeMapping);
        }

        $.ajax({
            url: BaseUrl + "PmsRecordSave/Save_StudyProductKitTypeMapping",
            type: 'POST',
            data: { '': KitTypeMappingDtl },
            success: function (data) {
                $("#btnSavePmsMinimumInventory").attr("style", "display:none");
                SuccessorErrorMessageAlertBox("Data Saved Successfully !", ModuleName);
                GetKitTypeMappingData();
            },
            error: function () {
                SuccessorErrorMessageAlertBox("Error !", ModuleName);
            }
        });
    }
});

function CheckRecordExist() {

    if ($("#ddlActivity").val() != null) {
        var ActivityLength = $("#ddlActivity").val().length

        var MyRows = $('table#tblKitMappingTemp').find('tbody').find('tr');
        for (var i = 0; i < MyRows.length; i++) {
            var Visit = $(MyRows[i]).find('td:eq(0)').html()
            var Activity = $(MyRows[i]).find('td:eq(1)').html()

            for (var j = 0; j < ActivityLength; j++) {
                //  Visit == $("#ddlVisitName :selected").text()

                if (Activity == $("#ddlActivity").val()[j]) {
                    ValidationAlertBox("This Record Already Exist in Table !", "ddlActivity", ModuleName);
                    return false;
                }
            }
        }
    }

    var KitTypeMappingTempData = $('table#tblKitMappingTemp').find('tbody').find('tr');
    //KitTypeMappingData;

    for (var i = 0; i < KitTypeMappingData.length; i++) {
        var Activity = KitTypeMappingData[i].vActivityName;

        for (var j = 0; j < KitTypeMappingTempData.length; j++) {
            var ActivityKitTypeMappingTemp = $(KitTypeMappingTempData[j]).find('td:eq(1)').html()

            if (Activity == ActivityKitTypeMappingTemp) {
                ValidationAlertBox("" + Activity + " Activity Already Exist !", "ddlVisitName", ModuleName);
                return false;
            }
        }
    }
    return true;
}

$('#btnExitKitTypeMapping').on('click', function () {
    ConfirmAlertBox(ModuleName, $("#RedirectToHome").val());
});

function AddTempDataCombinationalMapping() {

    if (isBlank(document.getElementById('DDLProjectNo').value)) {
        ValidationAlertBox("Please enter Project No.", "DDLProjectNo", ModuleName);
        return false
    }

    else if ($("#DDLProductType").val() == 0) {
        ValidationAlertBox("Please select Product Type.", "DDLProductType", ModuleName);
        return false;
    }

    else if (isBlank(document.getElementById('txtKitNo').value)) {
        ValidationAlertBox("Please enter Kit Batch/Lot/Lot No.", "txtKitNo", ModuleName);
        return false
    }


    else if ($("#DDLProduct").val() == 0) {
        ValidationAlertBox("Please select Product.", "DDLProduct", ModuleName);
        return false;
    }

    else if ($("#ddlBatchLotNo").val() == 0) {
        ValidationAlertBox("Please select Batch/Lot/Lot No.", "ddlBatchLotNo", ModuleName);
        return false;
    }
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

    if ($("#tblCombinationalMappingTemp").is(":visible")) {
        var data = HTMLtbl.getData($('#tblCombinationalMappingTemp'));
        var StoreData = [];
        for (i = 0; i < data.length; i++) {
            var storedata = data[i];

            if (storedata[2] == $("#DDLProduct :selected").text()) {
                if (storedata[3] == $("#ddlBatchLotNo :selected").text()) {

                    ValidationAlertBox("error", "tblCombinationalMappingTemp", ModuleName);
                    return false;
                    break;
                }
            }
        }
    }


    var InsertPmsProductDispensHdr = {
        vWorkSpaceId: setWorkspaceId,
        nProductTypeID: $("#DDLProductType").val(),
        nProductNo: $("#DDLProduct").val(),
        nBatchNo: $("#ddlBatchLotNo").val(),
    }
    var InsertProductDispenseHdrData = {
        Url: BaseUrl + "PmsProductDispense/PmsGetInfoForCombinational",
        SuccessMethod: "SuccessMethod",
        Data: InsertPmsProductDispensHdr
    }

    getcombinationalData(InsertProductDispenseHdrData.Url, InsertProductDispenseHdrData.SuccessMethod, InsertProductDispenseHdrData.Data);
}

var getcombinationalData = function (Url, SuccessMethod, Data) {

    $.ajax({
        url: Url,
        type: 'POST',
        async: false,
        data: Data,
        //async: false,
        success: SuccessInsertData,
        error: function () {
            SuccessorErrorMessageAlertBox("Data not found.", ModuleName);
        }
    });

    function SuccessInsertData(response) {

        if (response.length > 0) {
            for (var i = 0; i < response.length ; i++) {
                var strdata = "";
                strdata += "<tr>";
                strdata += "<td>" + response[i].ProjectNo + "</td>";
                strdata += "<td>" + response[i].vProductType + "</td>";
                strdata += "<td>" + $("#txtKitNo").val() + "</td>";
                strdata += "<td>" + response[i].vProductName + "</td>";
                strdata += "<td>" + response[i].vBatchLotNo + "</td>";
                strdata += "<td>" + response[i].iSalableClStockQty + "</td>";
                $txtQty = '<input type="text" id="txtQty_' + response[i].nStudyProductBatchStockNo + '" placeholder="Quantity" class="form-control Qty" style="height: 26px" onkeypress="return isNumberKey(event)"/>';
                strdata += "<td>" + $txtQty + "</td>";
                strdata += "<td id='trRemove'><span class='glyphicon glyphicon-remove'></span></td>";
                strdata += "<td class='hide'>" + response[i].nProductTypeID + "</td>";
                strdata += "<td class='hide'>" + response[i].nProductNo + "</td>";
                strdata += "<td class='hide'>" + response[i].nStudyProductBatchNo + "</td>";
                $txtEdit = '<a data-tooltip="tooltip" title="Edit"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a>';
                $txtAudit = '<a data-tooltip="tooltip" title="Audit"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-file-text-o"></i><span>Audit</span></a>';

                strdata += "<td>" + $txtEdit + "</td>";
                strdata += "<td>" + $txtAudit + "</td>";

                strdata += "</tr>";
                $("#tbodyCombinationalMappingTemp").append(strdata);
            }

            $("#btnSaveCombinationalMapping").attr("style", "display:inline");
            $(".hide").hide();
            $("#tblCombinationalMappingTemp").show();
            $("#DDLProductType").prop('disabled', 'disabled');
            $("#txtKitNo").prop('disabled', 'disabled');
            $("#DDLProduct").val(0);
            $('#ddlBatchLotNo').val(0);
        }

    }
}

function GetProductType() {
    if (setWorkspaceId != "") {
        var GetProductType = {
            Url: BaseUrl + "PmsGeneral/GetProductType/" + setWorkspaceId,
            SuccessMethod: "SuccessMethod"
        }
        $.ajax({
            url: GetProductType.Url,
            type: 'GET',
            async: false,
            success: function (jsonData) {
                $("#DDLProductType").empty().append('<option selected="selected" value="0">Please Select Product Type</option>');
                for (var i = 0; i < jsonData.length; i++) {
                    $("#DDLProductType").append($("<option></option>").val(jsonData[i].nProductTypeID).html(jsonData[i].vProductType));
                }
            },
            error: function () {
                SuccessorErrorMessageAlertBox("Product Type not found.", ModuleName);
            }
        });
    }
}

$('#DDLProductType').on("change", function () {
    GetProductName();
    $("#ddlBatchLotNo").val("0");
});

function GetProductName() {
    if (workspaceIds[$('#txtProjectNoDashboard').val()] != undefined) {
        setWorkspaceId = workspaceIds[$('#txtProjectNoDashboard').val()];
    }

    var GetProductNameData = {
        vWorkSpaceId: setWorkspaceId,
        nProductTypeID: $("#DDLProductType").val(),
        cTransferIndi: 'P',
    }

    var GetPmsStudyReceiptProductName = {
        Url: BaseUrl + "PMSGeneral/ProductName",
        SuccessMethod: "SuccessMethod",
        Data: GetProductNameData,
    }

    $.ajax({
        url: GetPmsStudyReceiptProductName.Url,
        type: 'POST',
        async: false,
        data: GetPmsStudyReceiptProductName.Data,
        success: function (jsonData) {
            var strdata = "";
            if (jsonData.length > 0) {
                $("#DDLProduct").empty().append('<option selected="selected" value="0">Please Select Product</option>');
                for (var i = 0; i < jsonData.length; i++)
                    $("#DDLProduct").append($("<option></option>").val(jsonData[i].nProductNo).html(jsonData[i].vProductName));
            }
            else {
                $("#DDLProduct").empty().append('<option selected="selected" value="0">Please Select Product</option>');
            }
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Product not found.", ModuleName);
        }
    });
}

$('#DDLProduct').on("change", function () {
    GetBatchLotNo();
});

function GetBatchLotNo() {
    if (workspaceIds[$('#txtProjectNoDashboard').val()] != undefined) {
        setWorkspaceId = workspaceIds[$('#txtProjectNoDashboard').val()];
    }

    var nProductNo = $("#DDLProduct").val();

    var Data_s = {
        vWorkSpaceId: setWorkspaceId,
        nProductTypeID: $("#DDLProductType").val(),
        nProductNo: $("#DDLProduct").val(),
        nBatchNo: $("#ddlBatchLotNo").val()
    }
    var GetProductDetail = {
        Url: BaseUrl + "PmsProductDispense/PostProductDetailByProjectNo/",
        SuccessMethod: "SuccessMethod",
    }

    $.ajax({
        url: GetProductDetail.Url,
        type: 'Post',
        data: Data_s,
        async: false,
        success: function (jsonData) {
            if (jsonData.length > 0) {
                $("#ddlBatchLotNo").empty().append('<option selected="selected" value="0">Please Select Batch/Lot/Lot No</option>');
                for (var i = 0; i < jsonData.length; i++) {
                    $("#ddlBatchLotNo").append($("<option></option>").val(jsonData[i].nStudyProductBatchNo).html(jsonData[i].vBatchLotNo));
                }
            }
            else {
                $("#ddlBatchLotNo").empty().append('<option selected="selected" value="0">Please Select Batch/Lot/Lot No</option>');
            }
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Batch/Lot/Lot No not found.", ModuleName);
        }
    });
}

$("#btnCombinationalTypeMapping").on('click', function () {

    $("#tbodyCombinationalMappingTemp").empty();
    GetProductType();
    getCombinationalDrug();
    $("#CombinationalTypeModel").modal('show');
    $("#btnSaveCombinationalMapping").attr("style", "display:none");
});


$("#tblCombinationalMappingTemp").on('click', '#trRemove', function () {
    $(this).closest('tr').remove();

    if ($("#tblCombinationalMappingTemp tbody tr").length != 0) {
        $("#tblCombinationalMappingTemp").show();
        $("#btnSaveCombinationalMapping").show();
    }
    else {
        $("#tblCombinationalMappingTemp").hide();
        $('#btnSaveCombinationalMapping').hide();
    }
});

function isNumberKey(e) {
    var regExp = /[a-z]/i;
    var value = String.fromCharCode(e.which) || e.key;
    if (regExp.test(value)) {
        e.preventDefault();
        return false;
    }

    document.all ? k = e.keyCode : k = e.which;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
}

$("#btnClearCombinationalMapping").on('click', function () {
    $("#DDLProductType").val(0).prop('disabled', false);
    $("#txtKitNo").val('').prop('disabled', false);
    $("#DDLProduct").val(0);
    $("#ddlBatchLotNo").val(0);
    $('#tblCombinationalMappingTemp tbody').text('');
    $('#tblCombinationalMappingTemp').hide();
    document.getElementById('btnSaveCombinationalMapping').style.display = 'none';
});


$("#btnSaveCombinationalMapping").on('click', function () {


    var row = $("#tblCombinationalMappingTemp").dataTable().fnGetNodes();
    var rowData = $("#tblCombinationalMappingTemp").dataTable().fnGetData();
    var id = "";
    var value = "";
    var productType = "";
    var productName = "";
    var batchName = "";

    //for (var i = 0 ; i < row.length; i++) {
    //    var totalQty = rowData[i][4];

    //    var userInputStock = $(row[i]).find("td:eq(5)")[0].getElementsByTagName('input')[0].value;

    //    if ($(row[i]).find("td:eq(5)")[0].getElementsByTagName('input')[0].value != "") {
    //        if (parseInt(userInputStock) > (parseInt(totalQty))) {
    //            $(row[i]).find("td:eq(5)")[0].getElementsByTagName('input')[0].value = "";
    //            ValidationAlertBox("You can not enter more than Available Stock.", $(row[i]).find("td:eq(5)")[0].getElementsByTagName('input')[0].id, ModuleName);
    //            return false;
    //        }

    //        if (i != 0) {
    //            if (productType == $(row[i]).find("td:eq(7)")[0].innerHTML) {
    //                id += $(row[i]).find("td:eq(5)")[0].getElementsByTagName('input')[0].id.split("_")[1] + ",";
    //                value = parseInt(value) + parseInt($(row[i]).find("td:eq(5)")[0].getElementsByTagName('input')[0].value);
    //                productName += $(row[i]).find("td:eq(8)")[0].innerHTML + ",";
    //                batchName += $(row[i]).find("td:eq(9)")[0].innerHTML + ",";

    //            }
    //        }
    //        else {
    //            productType = $(row[i]).find("td:eq(7)")[0].innerHTML;
    //            id += $(row[i]).find("td:eq(5)")[0].getElementsByTagName('input')[0].id.split("_")[1] + ",";
    //            value += parseInt($(row[i]).find("td:eq(5)")[0].getElementsByTagName('input')[0].value);
    //            productName += $(row[i]).find("td:eq(8)")[0].innerHTML + ",";
    //            batchName += $(row[i]).find("td:eq(9)")[0].innerHTML + ",";
    //        }
    //    }
    //}

    //var Id = id.substring(0, id.length - 1);
    //var ProductName = productName.substring(0, productName.length - 1);
    //var BatchName = batchName.substring(0, batchName.length - 1);


    var listOfObjects = [];
    var a = ["ProductTypeName", "nProductTypeId", "nKitNo", "ProductName", "nProductNo", "BatchName", "nBatchNo", "iCombinationalQty"]
    for (var i = 0 ; i < row.length; i++) {
        if ($("#" + $(row[i]).find("td:eq(6)")[0].getElementsByTagName('input')[0].id).prop('disabled') == false) {
            var listCombination = {};
            listCombination["ProductTypeName"] = $(row[i]).find("td:eq(1)")[0].innerHTML;
            listCombination["nProductTypeId"] = $(row[i]).find("td:eq(8)")[0].innerHTML;
            listCombination["nKitNo"] = $(row[i]).find("td:eq(2)")[0].innerHTML;
            listCombination["ProductName"] = $(row[i]).find("td:eq(3)")[0].innerHTML;
            listCombination["nProductNo"] = $(row[i]).find("td:eq(9)")[0].innerHTML;
            listCombination["BatchName"] = $(row[i]).find("td:eq(4)")[0].innerHTML;
            listCombination["nBatchNo"] = $(row[i]).find("td:eq(10)")[0].innerHTML;
            listCombination["vWorkSpaceId"] = setWorkspaceId;
            listCombination["iUserId"] = $("#hdnuserid").val();
            listCombination["iCombinationalQty"] = parseInt($(row[i]).find("td:eq(6)")[0].getElementsByTagName('input')[0].value);
            listOfObjects.push(listCombination);
        }

    }

    //var InsertProductDispenseHdr = {
    //    nProductTypeId: productType,
    //    nProductNo: ProductName,
    //    nBatchNo: BatchName,
    //    vWorkSpaceId: setWorkspaceId,
    //    iCombinationalQty: value
    //}

    //var InsertProductDispenseHdr = {
    //    combinational: listOfObjects
    //}

    var InsertProductDispenseHdrData = {
        Url: BaseUrl + "PmsProductDispense/InsertCombinationalInfo",
        SuccessMethod: "SuccessMethod",
        Data: listOfObjects
    }

    InsertCombinationalInfo(InsertProductDispenseHdrData.Url, InsertProductDispenseHdrData.SuccessMethod, InsertProductDispenseHdrData.Data);

});


var InsertCombinationalInfo = function (Url, SuccessMethod, Data) {

    $.ajax({
        url: Url,
        type: 'POST',
        async: false,
        data: { '': Data },
        success: SuccessInsertData,
        error: function () {
            SuccessorErrorMessageAlertBox("Data not found.", ModuleName);
        }
    });

    function SuccessInsertData(response) {

        if (response == "success") {
            SuccessorErrorMessageAlertBox("Combiantional Mapping saved successfully.", ModuleName);
            $("#CombinationalTypeModel").modal('hide');
        }
    }
}

function getCombinationalDrug() {


    var GetCombinational = {
        vWorkSpaceId: setWorkspaceId,

    }
    var InsertProductDispenseHdrData = {
        Url: BaseUrl + "PmsProductDispense/CombinationalInfo",
        SuccessMethod: "SuccessMethod",
        Data: GetCombinational
    }

    CombinationalInfo(InsertProductDispenseHdrData.Url, InsertProductDispenseHdrData.SuccessMethod, InsertProductDispenseHdrData.Data);
}

var CombinationalInfo = function (Url, SuccessMethod, Data) {
    $.ajax({
        url: Url,
        type: 'POST',
        async: false,
        data: Data,
        success: SuccessInsertData,
        error: function () {
            SuccessorErrorMessageAlertBox("Data not found.", ModuleName);
        }
    });

    function SuccessInsertData(response) {

        if (response.length > 0) {
            $("#CombinationalTypeModel").modal('show');
            for (var i = 0; i < response.length ; i++) {
                var strdata = "";
                strdata += "<tr>";
                strdata += "<td>" + response[i].vProjectNo + "</td>";
                strdata += "<td>" + response[i].vProductType + "</td>";
                strdata += "<td>" + response[i].nKitNo + "</td>";
                strdata += "<td>" + response[i].vProductName + "</td>";
                strdata += "<td>" + response[i].vBatchLotNo + "</td>";
                strdata += "<td>" + response[i].iSalableClStockQty + "</td>";
                $txtQty = '<input type="text" id="txtQty_' + response[i].nStudyProductBatchStockNo + '" value = "' + response[i].iDispenseQty + '" placeholder="Quantity" class="form-control Qty" style="height: 26px;" onkeypress="return isNumberKey(event)" disabled/>';
                strdata += "<td>" + $txtQty + "</td>";
                strdata += "<td></td>";
                strdata += "<td class='hide'>" + response[i].nProductTypeID + "</td>";
                strdata += "<td class='hide'>" + response[i].nProductNo + "</td>";
                strdata += "<td class='hide'>" + response[i].nStudyProductBatchNo + "</td>";
                $txtEdit = '<a data-tooltip="tooltip" title="Edit" id="txtedit_' + response[i].nStudyProductBatchStockNo + '" onclick=getEdit(this);><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a>';
                $txtAudit = '<a data-tooltip="tooltip" title="Audit" id="txtedit_' + response[i].nCombinationalMst + '" onclick=getAudit(this);><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-file-text-o"></i><span>Audit</span></a>';

                strdata += "<td>" + $txtEdit + "</td>";
                strdata += "<td>" + $txtAudit + "</td>";
                strdata += "</tr>";
                $("#tbodyCombinationalMappingTemp").append(strdata);
            }

            //$("#btnSaveCombinationalMapping").attr("style", "display:inline");
            $(".hide").hide();
            $("#tblCombinationalMappingTemp").show();
        }

    }
}

function getEdit(e) {

    var id = e.id.split("_")[1];
    $("#btnSaveCombinationalMapping").attr("style", "display:inline");
    $("#txtQty_" + id).prop('disabled', false);
}

function getAudit(e) {

    var id = e.id.split("_")[1];
    var Data = {
        nCombinationalMst: id
    }

    $('#tblPmsProductBatchAuditTrial > tbody > tr:nth-child(n+1)').remove();

    $.ajax({
        url: BaseUrl + "PmsProductDispense/AuditTrail",
        type: 'POST',
        data: Data,
        async: false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Audit Trail data not found.", ModuleName);

        }
    });

    function SuccessMethod(jsonData) {

        var ActivityDataset = [];
        for (var i = 0; i < jsonData.length; i++) {
            var InDataset = [];
            InDataset.push(jsonData[i].vProjectNo, jsonData[i].vProductType, jsonData[i].nKitNo, jsonData[i].vProductName, jsonData[i].vBatchLotNo, jsonData[i].iSalableClStockQty,
                jsonData[i].iDispenseQty, jsonData[i].vUserName,
                jsonData[i].dModifyOn);
            ActivityDataset.push(InDataset);
        }
        $("#ComboAuditTrial").modal('show');
        otable = $('#tblCombinationalAuditTrial').dataTable({
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
                { "sTitle": "Project No" },
                { "sTitle": "Product Type" },
                  { "sTitle": "Kit Batch/Lot/Lot No" },
                { "sTitle": " Product Name " },
                { "sTitle": "Batch/Lot/Lot No" },
                { "sTitle": "Total Quantity" },
                { "sTitle": "Quantity" },
                { "sTitle": "Modify By" },
                { "sTitle": "Modify On" }
            ],
            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },
        });


    }

}