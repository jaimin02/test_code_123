var workspaceIds = new Object();
var CountryName = new Object();
var ModuleName = "Randomization/Dispensing Visit";
var setWorkspaceId;
var setCountryName;
var ParentWorkSpaceID = "";
var objData = [];
var KitFinalData = [];
var IsNonIMPFlag = "";
var vImpKitNo = "";
var vNonImpCarboplatinKitNo = "";
var vNonImpPaclitaxelKitNo = "";
var FirstVisit = "";
var VisitNo = 0;
var TargetAUC_Global = "";
var DoseValuePaclitaxel_Global = "";
var ValidateForDispansing = "";
var WithValidation = "Y";
var NonIMPVisitUpto = 7;
var NextVisitDays = 21;
var ProtocolNo = "";
var SponserName = "";
var TransactionID = "";
var TransactionDate = "";
var CarboplatinKitQty = "";
var PaclitaxelQty = "";
var ProjectManager = "";
var cEditVisit = 'N';
var PreviousVisitNo = 0;
var PreviousVisitName = '';
var cIsbtnShow = 'N';
var SetProjectNo = '';
var vSiteNo = '';
var cIsCountryWarning = 'N';


$(document).ready(function () {

    var vProfileList = $("#hdnUserButtonRights").val();
    var vProfileCode = $("#hdnUserTypeCode").val();

    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('.modal').modal('hide');


    BindDateOfBirht();
    SetProjectNo = sessionStorage.getItem("ProtocolNo");

    var GetAllPmsProjectNo = {
        Url: BaseUrl + "PmsProductBatch/GetSetChildProjectNo",
        SuccessMethod: "SuccessMethod",
    }
    
    $("#txtRandomizationDate").val(moment().format("DD-MMM-YYYY"));

    $(".allownumericwithdecimal").on("keypress keyup blur", function (event) {
        $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
        if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
    });

    $(".allownumericwithoutdecimal").on("keypress keyup blur", function (event) {
        $(this).val($(this).val().replace(/[^\d].+/, ""));
        if ((event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
    });

    window.addEventListener('beforeunload', function (e) {
        // call ajax function here
        //	e.returnValue = '';  //if alert required then open it
        fnRemoveFromTempRandomization();
    });

    $("#txtSubjectNo").on("keyup", function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            $("#btnGo")[0].click();
        }
    });

    $("#txtPassword").on("keyup", function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            $("#btnESingAuthOK")[0].click();
        }
    });

    $('#ddlAvailableKit').multiselect({
        nonSelectedText: 'Please Select Kit',
        buttonClass: 'form-control',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        numberDisplayed: 2,
    });
});



$('#ddlProjectNo').on('propertychange input change keyup paste mouseup', function () {
    var GetAllPmsProjectNo = {
        Url: BaseUrl + "PmsGeneral/GetScopeWiseProject",
        SuccessMethod: "SuccessMethod",
    }
    if ($('#ddlProjectNo').val().length == 2) {
        //var ProjectNoDataTemp = {
        //    vProjectNo: $('#ddlProjectNo').val(),
        //    iUserId: $("#hdnuserid").val(),
        //    vProjectTypeCode: $("#hdnscopevalues").val(),
        //    strworkspacetype: "C",
        //    setProjectNo: sessionStorage.getItem("ProtocolNo")
        //}
        var ProjectNoDataTemp = {
            iUserId: $("#hdnuserid").val(),
            vStudyCode: $("#ddlProjectNo").val(),
        }

        GetAllPmsProjectNoData(GetAllPmsProjectNo.Url, GetAllPmsProjectNo.SuccessMethod, ProjectNoDataTemp);
    }
    else if ($('#ddlProjectNo').val().length < 2) {
        $("#ddlProjectNo").autocomplete({
            source: "",
            change: function (event, ui) { },
            select: function (event, ui) {
                vProjectNo = ui.item.value;
                $('#ddlProjectNo').val(vProjectNo);

                if (workspaceIds[$('#ddlProjectNo').val()] != undefined) {
                    setWorkspaceId = workspaceIds[$('#ddlProjectNo').val()];
                }
                if (isBlank(document.getElementById('ddlProjectNo').value)) {
                    SetDefaultValue();
                    return false;
                }
            }
        });
    }
});

var GetAllPmsProjectNoData = function (Url, SuccessMethod, ProjectNoDataTemp) {
    $.ajax({
        url: Url,
        type: 'GET',
        //data: { id: ProjectNoDataTemp.iUserId, projectno: ProjectNoDataTemp.vProjectNo, typecode: ProjectNoDataTemp.vProjectTypeCode, strworkspacetype: ProjectNoDataTemp.strworkspacetype, setProjectNo: ProjectNoDataTemp.setProjectNo },
        data: { iUserId: ProjectNoDataTemp.iUserId, vStudyCode: ProjectNoDataTemp.vStudyCode },
        success: function (jsonData) {
            var jsonObj = jsonData;
            var sourceArr = [];
            for (var i = 0; i < jsonObj.length; i++) {
                sourceArr.push(jsonObj[i].vStudyCode);
                workspaceIds[jsonObj[i].vStudyCode] = jsonObj[i].nStudyNo;
            }
            $("#ddlProjectNo").autocomplete({
                source: sourceArr,
                change: function (event, ui) { }
            });
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Site not found.", ModuleName);
        }
    });
}





$('#ddlProjectNo').on('blur', function () {
    //GetParentWorkSpaceID();
});

$('#btnGo').on('click', function () {
    var PostData;
    var bolWithSubjectId;
    var DOB = $('#ddlDate').val() + '-' + $('#ddlMonth').val() + '-' + $('#ddlYear').val();


    if ($("#hdnFlag").val() == "2") {
        PostData = {
            WhereCondition_1: "vWorkSpaceId = '" + setWorkspaceId + "' AND vMySubjectNo='" + $('#ddlSubjectNo').val() + "'",
        }
        bolWithSubjectId = "1";
    }
    else if (isBlank(document.getElementById('txtSubjectNo').value)) {
        if (!ValidateForIdentification()) {
            return false;
        }
        PostData = {
            WhereCondition_1: "vWorkSpaceId = '" + setWorkspaceId + "' AND vInitials = '" + $('#txtInitials').val().toUpperCase() + "' AND dBirthDate='" + DOB + "'",
        }
        bolWithSubjectId = "0";
    }
    else {
        if (isBlank(document.getElementById('txtSubjectNo').value)) {
            ValidationAlertBox("Please enter SubjectNo.", "txtSubjectNo", ModuleName);
        }
        if (Dropdown_Validation(document.getElementById("ddlProjectNo"))) {
            ValidationAlertBox("Please select Site No.", "ddlProjectNo", ModuleName);
            return false;
        }
        if (setWorkspaceId == "" || setWorkspaceId == undefined) {
            ValidationAlertBox("Please select Site No.", "ddlProjectNo", ModuleName);
            return false;
        }

        PostData = {
            WhereCondition_1: "vWorkSpaceId = '" + setWorkspaceId + "' AND vMySubjectNo='" + $('#txtSubjectNo').val() + "'",
        }
        bolWithSubjectId = "1";
    }

    var GetScreening = {
        Url: BaseUrl + "PmsRecordFetch/View_WorkspaceSubjectMstForPatientRegistration",
        Data: PostData,
        SuccessMethod: "SuccessMethod"
    }
    $.ajax({
        url: GetScreening.Url,
        type: 'POST',
        data: GetScreening.Data,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Record Not Found.", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        jsonData = jsonData.Table;
        if (jsonData.length != 0) {

            
            $("#hdnRandomizationNo").val(jsonData[0].vRandomizationNo);
            $("#hdnMySubjectNo").val(jsonData[0].vMySubjectNo);
            $("#hdnBirthDate").val(jsonData[0].dBirthDate);
            $("#hdnPatientRegistrationDate").val(jsonData[0].dPatientRegistrationDate);
            $("#hdnInitials").val(jsonData[0].vInitials);
            $("#hdnTreatementArm").val(jsonData[0].iTreatementArm);
            

            vSiteNo = jsonData[0].vSiteNo;
            if (jsonData.length == 1) {
                if (jsonData[0].cSubStudyStatus == "F") {
                    ValidationAlertBox("Entered Patient Number has marked as Screen Failure, you cannot proceed further.", "txtInitials", ModuleName);
                }
                else if (jsonData[0].cSubStudyStatus == "T") {
                    ValidationAlertBox("Entered Patient Number has already completed Patient Status Change update, you cannot proceed further.", "txtInitials", ModuleName);
                }
                else if (jsonData[0].cSubStudyStatus == "S") {
                    ValidationAlertBox("Entered Patient Number has already completed End of Study, you cannot proceed further.", "txtInitials", ModuleName);
                }
                else {
                    NextReturnFuncaton();
                }
            }
            else if (jsonData.length >= 2) {
                $("#ddlSubjectNo").empty();
                for (var i = 0; i < jsonData.length; i++) {
                    $("#ddlSubjectNo").append($("<option></option>").val(jsonData[i].vMySubjectNo).html(jsonData[i].vMySubjectNo));
                }
                $("#hdnFlag").val("2");
                $('#divHr').attr('style', 'display:none');
                $('#divSubjectNo').attr('style', 'display:none');
                $('#dvSubjectList').attr('style', 'display:block');
            }
        }
        else {
            ValidationAlertBox("Records Not Found.", "txtSubjectNo", ModuleName);
        }
    }
});


$('#btnRemarksContinueVisitClose').on('click', function () {
    $('#txtContinueVisitRemarks').val("");
});

$('#btnRemarksContinueVisitSave').on('click', function () {
    if ($.trim($("#txtContinueVisitRemarks").val()) == "") {
        ValidationAlertBox("Please enter Reason to Continue Visit.", "txtContinueVisitRemarks", ModuleName);
        return false;
    }
    $('#hdnContinueVisitRemarks').val($("#txtContinueVisitRemarks").val());
    $("#divRemarksForContinueVisit").modal('hide');
    $("#txtContinueVisitRemarks").val("");
    NextReturnFuncaton();
});





function ValidateForIdentification() {

    if (Dropdown_Validation(document.getElementById("ddlProjectNo"))) {
        ValidationAlertBox("Please select Site No.", "ddlProjectNo", ModuleName);
        return false;
    }

    if (setWorkspaceId == "" || setWorkspaceId == undefined) {
        ValidationAlertBox("Please select Site No.", "ddlProjectNo", ModuleName);
        return false;
    }

    if (isBlank(document.getElementById('txtInitials').value)) {
        ValidationAlertBox("Please enter Initials.", "txtInitials", ModuleName);
        return false;
    }
    if ($("#txtInitials").val().length != 3) {
        ValidationAlertBox("Limit to 3 alphabets.", "txtInitials", ModuleName);
        return false
    }
    if (Dropdown_Validation(document.getElementById("ddlDate"))) {
        ValidationAlertBox("Please select Date.", "ddlDate", ModuleName);
        return false;
    }
    if (Dropdown_Validation(document.getElementById("ddlMonth"))) {
        ValidationAlertBox("Please select Month.", "ddlMonth", ModuleName);
        return false;
    }
    if (Dropdown_Validation(document.getElementById("ddlYear"))) {
        ValidationAlertBox("Please select Year.", "ddlYear", ModuleName);
        return false;
    }
    return true;
}

function isNumericKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31
    && (charCode < 48 || charCode > 57))
        return true;
    return false;
}
function onlyAlphabate(e) {
    var regex = new RegExp("^[a-zA-Z]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        //$('.error').hide();
        //$('.error').text('');
        return true;
    }
    else {
        e.preventDefault();
        //$('.error').show();
        //$('.error').text('Please enter alphabate only');
        AlertBoxForValidation("Please enter alphabate only.", "txtInitials", ModuleName);
        return false;
    }
}

function allowOnlyDigit(e) {
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        AlertBoxForValidation("Please enter numeric value only (Without decimal point).", "txtHeight", ModuleName);
        return false;
    }
}

function BindDateOfBirht() {

    $("#ddlDate").empty().append('<option selected="selected" value="0">DD</option>');
    //$("#ddlDate").append('<option value="UK">UK</option>');
    for (i = 1; i <= 31; i++) {
        var strDate = i.toString();
        if (i.toString().length == 1) {
            strDate = "0" + i.toString();
        }
        $("#ddlDate").append($("<option></option>").val(strDate).html(strDate));
    }

    $("#ddlMonth").empty().append('<option selected="selected" value="0">MMM</option>');
    //$("#ddlMonth").append('<option value="UKU">UKU</option>');
    var monthNameList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    for (var i = 0; i < monthNameList.length; i++) {
        $("#ddlMonth").append($("<option></option>").val(monthNameList[i]).html(monthNameList[i]));
    }

    $("#ddlYear").empty().append('<option selected="selected" value="0">YYYY</option>');
    var minOffset = 0, maxOffset = 200;
    var thisYear = (new Date()).getFullYear();
    for (var i = minOffset; i <= maxOffset; i++) {
        var year = thisYear - i;
        $("#ddlYear").append($("<option></option>").val(year).html(year));
    }
}

function PageResetScreening(clearSubjectNo) {
    VisitNo = 0;
    ValidateForDispansing = "";
    TargetAUC_Global = "";
    DoseValuePaclitaxel_Global = "";
    $('#btnListGO').attr('style', 'display:block');
    $('#ddlProjectNo').prop('disabled', false);
    $(':input', '#fdSubjectDetail').prop('disabled', false);
    $("#fdEnrollment").hide();

    $("#txtInitials").val("");
    $("#ddlDate").val("0");
    $("#ddlMonth").val("0");
    $("#ddlYear").val("0");
    if (clearSubjectNo != "No") {
        $("#txtSubjectNo").val("");
        $("#hdnMySubjectNo").val("");
    }
    $("#txtRandomizationNo").val("");
    $("#hdnRandomizationNo").val("");

    $('#divHr').attr('style', 'display:block');
    $('#divSubjectNo').attr('style', 'display:block');
    $("#hdnFlag").val("");

    $("#ddlSubjectNo").empty();
    $('#dvSubjectList').attr('style', 'display:none');
    TransactionID = "";
    TransactionDate = "";
    IsNonIMPFlag = "";
    $('#divRemarksTargetAUC').attr('style', 'display:none');
    $('#divRemarksDoseValue').attr('style', 'display:none');
    $("#txtRemarksTargetAUC").val("");
    $("#txtRemarksDoseValue").val("");
    //$("#ddlAvailableKit").empty();
    $("#divAvailableKit").hide();
    $("#ddlAvailableKit").val(0);
    cEditVisit = 'N';
    PreviousVisitNo = 0;
    PreviousVisitName = '';


}

function PageResetRandomization() {

    VisitNo = 0;
    ValidateForDispansing = "";
    TargetAUC_Global = "";
    DoseValuePaclitaxel_Global = "";
    $("#txtScreeningDate").val("");
    $("#txtAge").val("");
    $("#rblFemale").prop('checked', false);
    $("#rblMale").prop('checked', false);
    $("#rblNonSmoker").prop('checked', false);
    $("#rblSmoker").prop('checked', false);
    //$("#ddlCountry").val("0");
    $("#txtCountry").val("");
    $("#ddlStudyProduct").val(0);
    $("#txtRandomizationNo").val("");
    $("#txtVisitName").val("");
    $("#txtWeight").val("");
    $("#txtHeight").val("");
    $("#ddlTargetAUC").val("0");
    $("#txtSerumCreatinine").val("");
    $("#ddlDoseNonIMP").val("0");
    $("#rblConfirmYes").prop('checked', false);
    $("#rblConfirmNo").prop('checked', false);
    $("#txtIMPDose").val("");
    $("#txtCarboplatinDose").val("");
    $("#txtPaclitaxelDose").val("");
    $('#ddlTargetAUC').prop('disabled', false);
    $('#ddlTargetAUC').val('0');
    $('#ddlDoseNonIMP').prop('disabled', false);
    $('#ddlDoseNonIMP').val('0');

    $("#hdnRandomizationNo").val("");
    $("#hdnMySubjectNo").val("");
    $("#hdnBirthDate").val("");
    $("#hdnScreeningDate").val("");
    $("#hdnInitials").val("");
    $("#hdnGender").val("");
    $("#hdnSmokingHistory").val("");
    $("#hdnCountryName").val("");
    $("#hdnInclusionExclusionCriteria").val("");
    $("#hdnCarboplatinID").val("");
    $("#hdnPaclitaxelID").val("");
    $("#hdnGFR").val("");
    $("#hdnDuBois").val("");

    $("#fdEnrollment").hide();
    $("#fdRandomization").hide();
    FirstVisit = "";

    $("#rblSafetyParametersYes").prop('checked', false);
    $("#rblSafetyParametersNo").prop('checked', false);
    $("#rblContinueYes").prop('checked', false);
    $("#rblContinueNo").prop('checked', false);
    $('#divNextQue').attr('style', 'display:none');
    $('#btnSubmit').prop('disabled', false);
    $('#divContinueYesNo').attr('style', 'display:none');

    $("#txtRandomizationDate").val(moment().format("DD-MMM-YYYY"));
    TransactionID = "";
    TransactionDate = "";
    IsNonIMPFlag = "";
    $('#divRemarksTargetAUC').attr('style', 'display:none');
    $('#divRemarksDoseValue').attr('style', 'display:none');
    $("#txtRemarksTargetAUC").val("");
    $("#txtRemarksDoseValue").val("");
}

$('#btnSubmitClear').on('click', function () {
    PageResetScreening("");
    PageResetRandomization();
});

$('#btnGoClear').on('click', function () {
    PageResetScreening("");
});

$('#btnGoExit').on('click', function () {
    ConfirmAlertBox(ModuleName, $("#RedirectToHome").val());
});

$('#btnSubmitExit').on('click', function () {
    ConfirmAlertBox(ModuleName, $("#RedirectToHome").val());
});

function NextReturnFuncaton() {

    GetNextVisitName();
    GetTreatmentArm();
    var txtVisitName = $("#txtVisitName").val();

    if (txtVisitName != '' && txtVisitName != undefined && cAllowforNextVisit == 'N' && (txtVisitName == 'VISIT 20')) {
        ValidationAlertBox("Patient cannot perform any visit further! Please perform End of Study form", "btnGo", ModuleName);
        return false;
    }
    if (txtVisitName != '' && $("#hdnRandomizationNo").val() != "") {
        if (WithValidation == "Y") {
            if (ValidateForDispansing != "Y") {
                //ValidationAlertBox("Patient cannot perform visit within/outside visit window period. Please contact monitor for details", "btnGo", ModuleName);
                if (txtVisitName != 'VISIT 2') {
                    ValidationConfirmAlertBox(ModuleName, "This visit is outside of visit window. Do you want to continue?");
                    return false;
                }
            }
        }
    }

    if (cEditVisit == "Y") {
        return false;
    }


    if ($("#txtVisitName").val() == "") {
        return false;
    }

    $('#divHr').attr('style', 'display:none');
    $('#btnListGO').attr('style', 'display:none');
    $('#ddlProjectNo').prop('disabled', true);
    $(':input', '#fdSubjectDetail').prop('disabled', true);
    $("#txtInitials").val($("#hdnInitials").val());
    $("#ddlDate").val($("#hdnBirthDate").val().split("-")[0]);
    $("#ddlMonth").val($("#hdnBirthDate").val().split("-")[1]);
    $("#ddlYear").val($("#hdnBirthDate").val().split("-")[2]);
    $("#txtRandomizationNo").val($("#hdnRandomizationNo").val());
    $("#txtPatientRegistrationDate").val($("#hdnPatientRegistrationDate").val());
    $("#txtPatientId").val($("#hdnMySubjectNo").val());
    $("#ddlTreatmentArm").val($("#hdnTreatementArm").val());
    $('#ddlTreatmentArm').prop('disabled', false);
    $('#txtPatientId').prop('disabled', true);
    $('#txtPatientRegistrationDate').prop('disabled', true);
    GetParentProjectCode();
    GetParentWorkSpaceID();
    GetStudyProduct();
    var dob = new Date($("#hdnBirthDate").val());
    $("#fdEnrollment").show();
   
    $("#fdRandomization").show();

    $('#btnListSaveAndContinue').attr('style', 'display:none');

    //Check Randomization 
    if ($("#hdnRandomizationNo").val() == "") {
        FirstVisit = "Y";
        $("#legRandomization").text("Randomization Details");
        $('#divInclusionExclusion').attr('style', 'display:block');
        $('#btnSubmit').prop('disabled', false);
        $("#fdEnrollment").show();
        $("#lblRandomizationDateText").text("Randomization Date");
    }
    else {
        FirstVisit = "N";
        $("#legRandomization").text("Kit Allocation Details");
        $('#divInclusionExclusion').attr('style', 'display:none');
        $('#btnSubmit').prop('disabled', true);
        $("#fdEnrollment").hide();
        $("#lblRandomizationDateText").text("Visit Date");
    }
}

function GetNextVisitName() {
    var cIsAllowNextVisit = '';
    if ($('#hdnContinueVisitRemarks').val() != '' && $('#hdnContinueVisitRemarks').val() != undefined) {
        cIsAllowNextVisit = 'Y';
    }
    var PostData = {
        vWorkSpaceId: setWorkspaceId,
        vSubjectId: $("#hdnMySubjectNo").val(),
        vRandomizationNo: $("#hdnRandomizationNo").val(),
        cIsAllowNextVisit: cIsAllowNextVisit
    }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/Proc_GetNextVisitName",
        type: 'POST',
        async: false,
        data: PostData,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Data Not Found !", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {

        if (jsonData.length > 0) {

            $("#txtVisitName").val(jsonData[0].VisitName);
            VisitNo = jsonData[0].VisitNo;
            PreviousVisitNo = jsonData[0].PreviousVisitNo;
            PreviousVisitName = jsonData[0].PreviousVisitName;
            cAllowforNextVisit = jsonData[0].cAllowforNextVisit;

            if (jsonData[0].VisitName == "VISIT 2") {
                $(".cls-hidden").attr("style", "display:none");
            }
            else
            {
                $('#spanEdit').text("Edit Visit " + (parseInt(VisitNo) - 1));
                $('#spanCancel').text("Cancel Visit " + (parseInt(VisitNo) - 1));
                $('#spanEdit').text("Edit Visit " + VisitNo);
                $('#spanCancel').text("Cancel Visit " + VisitNo);
                $('.cls-hidden').attr('style', 'display:contents');

            }
        }
        else
        {
            $(".cls-hidden").attr("style", "display:none");
            $("#txtVisitName").val("");
            VisitNo = 0;
            SuccessorErrorMessageAlertBox("Visit Not Found !", ModuleName);
            return false;
        }
    }
}

function GetTreatmentArm() {
    jsonData = "";
    var ExecuteDataSetData = {
        Table_Name_1: "ProductTypeMst",
        WhereCondition_1: "cStatusIndi <> 'C'",
        DataRetrieval_1: 3,
    }
    GetJsonData(ExecuteDataSetData);
    $("#ddlTreatmentArm").empty().append('<option selected="selected" value="">Please Select Parent Operation</option>');
    for (var i = 0; i < jsonData.length; i++) {
        $("#ddlTreatmentArm").append($("<option></option>").val(jsonData[i].nProductTypeID).html(jsonData[i].vProductType));
    }
}

function GetStudyProduct()
{

    PostData = {
        WhereCondition_1: "vWorkSpaceId = '" + ParentWorkSpaceID + "' AND nProductTypeID='" + $('#ddlTreatmentArm').val() + "'",
    }

    var StudyProduct = {
        Url: BaseUrl + "PmsRecordFetch/View_StudyProductMst",
        Data: PostData,
        SuccessMethod: "SuccessMethod"
    }

    $.ajax({
        url: StudyProduct.Url,
        type: 'POST',
        data: StudyProduct.Data,
        success: SuccessMethod,
        error: function () {
            //SuccessorErrorMessageAlertBox("Record Not Found.", ModuleName);
        }
    });

    function SuccessMethod(data)
    {
        $("#ddlStudyProduct").empty().append('<option selected="selected" value="">Please Select Product/Kit</option>');
        for (var i = 0; i < data.Table.length; i++) {
            //$("#ddlStudyProduct").append($("<option></option>").val(data.Table[i].nProductNo).html(data.Table[i].vProductName));
            $("#ddlStudyProduct").append($("<option cProductKitIndication='" + data.Table[i].cProductKitIndication + "'></option>").val(data.Table[i].nProductNo).html(data.Table[i].vProductName));
            //$("#ddlStudyProduct").append($("<option></option>").val(data.Table[i].nProductNo).html(data.Table[i].vProductName + " | " + data.Table[i].cProductKitIndication ));
        }
    }
}

$("#ddlTreatmentArm").change(function () {
    GetStudyProduct();
    $("#divAvailableKit").hide();
    $("#divProductQuantity").hide();
});

$("#ddlStudyProduct").change(function () {

    var cProductKitIndication = $('#ddlStudyProduct option:selected').attr("cProductKitIndication");
    if (cProductKitIndication == "P")
    {
        $("#divProductQuantity").show();
        $("#divAvailableKit").hide();
    }
    else
    {
        GetKit();
        $("#divAvailableKit").show();
        $("#divProductQuantity").hide();
    }
});


function GetKit() {
    $('#divkit .multiselect-container li').remove();
    if (workspaceIds[$('#ddlProjectNo').val()] != undefined) {
        setWorkspaceId = workspaceIds[$('#ddlProjectNo').val()];
    }
    if (setWorkspaceId == "" || setWorkspaceId == undefined) {
        return false;
    }
    var PostData = {
        vWorkSpaceID: setWorkspaceId,
        nProductTypeID: $("#ddlTreatmentArm").val(),
        nKitTypeNo: $("#ddlStudyProduct").val(),
    }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/Proc_GetAvailableKitNo",
        type: 'POST',
        data: PostData,
        success: function (jsonData) {
            if (jsonData.length >= 0) {
                $('#ddlAvailableKit').multiselect('rebuild');
            }

            $('#ddlAvailableKit option').each(function () {
                $(this).remove();
            });

            for (var i = 0; i < jsonData.length; i++) {
                $("#ddlAvailableKit").append($("<option nStudyProductBatchNo =" + jsonData[i].nStudyProductBatchNo + "></option>").val(jsonData[i].vKitNo).html(jsonData[i].vKitNo));
                $('#ddlAvailableKit').multiselect('rebuild');
            }
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Kit data is not found.", ModuleName);
        }
    });
}


function GetParentWorkSpaceID()
{
    if (workspaceIds[$('#ddlProjectNo').val()] != undefined) {
        setWorkspaceId = workspaceIds[$('#ddlProjectNo').val()];
    }
    if (setWorkspaceId == "" || setWorkspaceId == undefined) {
        return false;
    }
    //var PostData = {
    //    WhereCondition_1: 'nstudyno = ' + setWorkspaceId + '',
    //    columnName_1: 'Top 1 nParentStudyNo ',
    //}

    var ExecuteDataSetData = {
        Table_Name_1: "StudyMst",
        WhereCondition_1: "nstudyno = " + setWorkspaceId,
        DataRetrieval_1: 3,
    }

    jsonData = "";
    GetJsonData(ExecuteDataSetData);
    ParentWorkSpaceID = jsonData[0].nParentStudyNo;
}

function GetParentProjectCode()
{
    if (workspaceIds[$('#ddlProjectNo').val()] != undefined) {
        setWorkspaceId = workspaceIds[$('#ddlProjectNo').val()];
    }
    if (setWorkspaceId == "" || setWorkspaceId == undefined) {
        return false;
    }

    PostData = {
        nStudyNo: setWorkspaceId,
    }

    var GetParentData = {
        Url: BaseUrl + "PmsRecordSave/Proc_GetParentStudy",
        Data: PostData,
        SuccessMethod: "SuccessMethod"
    }

    $.ajax({
        url: GetParentData.Url,
        type: 'POST',
        data: GetParentData.Data,
        async: false,
        success: function (jsonData) {
            //ParentWorkSpaceID = jsonData[0].nParentStudyNo;
            ProtocolNo = jsonData.Table[0].vstudycode;
        },
        error: function () {
            //SuccessorErrorMessageAlertBox("Record Not Found.", ModuleName);
        }
    });

}


function ValidateForRandomization() {

    if (Dropdown_Validation(document.getElementById("ddlProjectNo"))) {
        ValidationAlertBox("Please select Site No.", "ddlProjectNo", ModuleName);
        return false;
    }
    if (setWorkspaceId == "" || setWorkspaceId == undefined) {
        ValidationAlertBox("Please select Site No.", "ddlProjectNo", ModuleName);
        return false;
    }
    if (Dropdown_Validation(document.getElementById("ddlTreatmentArm")))
    {
        ValidationAlertBox("Please select Treatement Arm", "ddlTreatmentArm", ModuleName);
        return false;
    }
    if (Dropdown_Validation(document.getElementById("ddlStudyProduct")))
    {
        ValidationAlertBox("Please select Product/Kit.", "ddlStudyProduct", ModuleName);
        return false;
    }
    var cProductKitIndication = $('#ddlStudyProduct option:selected').attr("cProductKitIndication");
    if (cProductKitIndication == "P")
    {
        if (isBlank(document.getElementById('txtProductQuantity').value)) {
            ValidationAlertBox("Please add quantity.", "txtProductQuantity", ModuleName);
            return false;
        }
    }
    return true;
}

$('#btnSubmit').on('click', function () {
    ElectronicSignature();
    $("#tblViewKit").modal('show');
});

$("#btnESingAuthOK").on("click", function () {
    var InDataset = [];
    var ActivityDataset = [];

    if (!UserAuthentication()) {
        return false;
    }
    $(".modal").modal('hide');

    var PostData = {
        vWorkspaceId: setWorkspaceId,
        vSubjectID: $("#hdnMySubjectNo").val(),
        nProductTypeId: $("#ddlTreatmentArm option:selected").val(),
        nProductNo: $("#ddlStudyProduct option:selected").val(),
        vKitNo: $("#ddlAvailableKit option:selected").val(),
        iQty: $("#txtProductQuantity").val(),
        vVisit : $("#txtVisitName").val(),
        iModifyBy: $("#hdnuserid").val(),
        cStatusIndi : 'N'
    }

    $.ajax({
        url: BaseUrl + "PmsRecordSave/Save_InsertKitAllocation",
        type: 'POST',
        data: PostData,
        success: SuccessInsertData,
        error: function () {
            SuccessorErrorMessageAlertBox("Error while saving data !", ModuleName);

        }
    });

    function SuccessInsertData(response) {
        if (response.Table.length > 0)
        {

            if (response.Table[0].Status == "1")
            {
                $("#divResponse").modal('show');
                $("#lblResponseTitle").val(response.Table[0].vValidationMsg)
                $('#hdnContinueVisitRemarks').val("");
                TransactionID = response.Table[0].TransactionID;
                TransactionDate = response.Table[0].TransactionDate;
                objData = [];
                objData.push({ x: "Transaction ID", y: TransactionID });
                objData.push({ x: "Transaction By", y: response.Table[0].TransactionBy });
                objData.push({ x: "Transaction Date & Time", y: TransactionDate });
                objData.push({ x: "Protocol No", y: ProtocolNo });
                objData.push({ x: "Site Id", y: $('#ddlProjectNo').val() });
                //objData.push({ x: "Patient Initials", y: $('#hdnInitials').val().toUpperCase() });
                //objData.push({ x: "Date of Birth", y: $('#hdnBirthDate').val() });
                objData.push({ x: "Patient Initials", y: "XXXXX" });
                objData.push({ x: "Date of Birth", y: "XX-XXX-XXXX" });
                objData.push({ x: "Patient Id", y: $('#hdnMySubjectNo').val() });
                objData.push({ x: "Patient Registration Date", y: $("#hdnPatientRegistrationDate").val() });
                //objData.push({ x: "Treatment Arm", y: $("#hdnTreatementArm").val() });
                objData.push({ x: "Visit No.", y: $('#txtVisitName').val() });
                
                SendEmail(0, objData, $('#hdnMySubjectNo').val());

                var ActivityDataset = [];
                var data = [];
                var datalist = {};
                for (var i = 0; i < objData.length; i++) {
                    var InDataset = [];
                    var InDataset = [];
                    InDataset.push(objData[i].x, objData[i].y);
                    ActivityDataset.push(InDataset);
                }

                otabletblviewkitdetails = $('#tblResponseDtl').dataTable({
                    "bJQueryUI": true,
                    "bLengthChange": true,
                    "bProcessing": true,
                    "bSort": false,
                    "aaData": ActivityDataset,
                    "aaSorting": [],
                    "bFilter": false,
                    "bInfo": false,
                    "bAutoWidth": false,
                    "bDestroy": true,
                    "bPaginate": false,
                    "aoColumns": [
                       { "sTitle": "Question" },
                       { "sTitle": "Answer" },
                    ],
                    "columnDefs": [
                        { "width": "50%", "targets": 0 },
                        { "width": "50%", "targets": 1 },
                    ],

                    "oLanguage": {
                        "sEmptyTable": "No Record Found",
                    },
                });

                PageResetScreening("");
                PageResetRandomization();
                return false;
            }
        }
        else {
            SuccessorErrorMessageAlertBox("Error while saving data !", ModuleName);
            return false;
        }
    }
});



function SendEmail(nTransactionNo, ActivityDataset, vSubjectNo) {
    var PostData = {
        vWorkSpaceID: setWorkspaceId,
        vOperation: 'Randomization/Dispensing Visit',
        nTransactionNo: nTransactionNo,
        vData: JSON.stringify(ActivityDataset),
        vProtocolNo: ProtocolNo + ' - Patient Number :' + vSubjectNo
    }

    $.ajax({
        url: BaseUrl + "PmsGeneral/SendEmail",
        type: 'POST',
        data: PostData,
        //async: false,
        success: function (jsonData) {
            if (jsonData == null) {
                //ValidationAlertBox("Send Email Error.", "", ModuleName);
            }
            if (jsonData.length > 0) {
                //  ValidationAlertBox(jsonData[0]["ReturnMessage"], "", ModuleName);
            }
        },
        error: function () {
            //ValidationAlertBox("Send Email Error.", "", ModuleName);
        }
    });
}


$('#btnResponsePrint').on('click', function () {
    //fnSuccessResponse();
    printDiv();
});

function printDiv() {
    $("#tblResponseDtl").attr("style", "border-collapse: collapse");
    document.getElementById("tblResponseDtl").deleteTHead();
    $('#tblResponseDtl  tr').each(function () {
        $('td:eq(0)', this).attr({ "width": "50%" });
        $('td:eq(1)', this).attr({ "width": "50%" });
    });

    var d = new Date($.now());
    var currentdate = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

    var divToPrint = document.getElementById("tblResponseDtl");
    newWin = window.open("");
    //newWin.document.write(divToPrint.outerHTML);
    newWin.document.write('<html><body onload="window.print()">Printing Date & Time : ' + currentdate + ' <br/>' + divToPrint.outerHTML + '</body></html>');
    newWin.print();
    newWin.close();
}

$('input[type=radio][name=optradio4]').on('change', function () {
    if (this.value == "rbl_SafetyParametersYes") {
        $('#divContinueYesNo').attr('style', 'display:block');
        $("input:radio[id=rblDispensingNo]").prop('checked', true)
    }
    else if (this.value == "rbl_SafetyParametersNo") {
        $('#divContinueYesNo').attr('style', 'display:none');
        $('#divNextQue').attr('style', 'display:none');
        $('#btnSubmit').prop('disabled', true);
        $("#rblContinueYes").prop('checked', false);
        $("#rblContinueNo").prop('checked', false);
        SuccessorErrorMessageAlertBox("Please use Patient Status Change form to update status of this patient !", ModuleName);
        return false;
    }
});

$('input[type=radio][name=optradio5]').on('change', function () {
    if (this.value == "rbl_ContinueYes") {
        $('#divNextQue').attr('style', 'display:block');

        //$('#btnSubmit').attr('style', 'display:block');
        $('#btnSubmit').prop('disabled', false);
    }
    else if (this.value == "rbl_ContinueNo") {
        $('#divNextQue').attr('style', 'display:none');
        $('#btnSubmit').prop('disabled', true);
        SuccessorErrorMessageAlertBox("Please use Patient Status Change form to update status of this patient !", ModuleName);
        return false;
    }
});

$('input[type=radio][name=optradio6]').on('change', function () {
    if (this.value == "rbl_DispensingNo") {
        $('#divDispensingParameters').attr('style', 'display:block');
        var IMPDose = 15 * $('#txtWeight').val();
        $("#txtIMPDose").val(Math.round(IMPDose));
        CheckValidationForCarboplatin();
        CheckValidationForPaclitaxel();
    }
    else if (this.value == "rbl_DispensingYes") {
        $('#txtIMPDose').val("0.00");
        $('#txtCarboplatinDose').val("0.00");
        $('#txtPaclitaxelDose').val("0.00");
    }
});

$('input[type=radio][name=optradio3]').on('change', function () {
    if (this.value == "rbl_ConfirmYes") {
        $('#divNextQue').attr('style', 'display:block');
        $('#btnSubmit').prop('disabled', false);
        return false;
    }
    else if (this.value == "rbl_ConfirmNo") {
        $('#divNextQue').attr('style', 'display:none');
        $('#btnSubmit').prop('disabled', true);
        SuccessorErrorMessageAlertBox("Please use Patient Status Change form to update status of this patient !", ModuleName);
        return false;
    }
});

$('#btnCancel').on('click', function () {
    if (FirstVisit == "Y") {
        fnRemoveFromTempRandomization();
    }
});

$('#btnClosePoppupWindow').on('click', function () {
    if (FirstVisit == "Y") {
        fnRemoveFromTempRandomization();
    }
});

function fnRemoveFromTempRandomization() {
    var PostData = {
        vParentWorkSpaceID: ParentWorkSpaceID,
        vWorkspaceId: setWorkspaceId,
        vSubjectID: $("#hdnMySubjectNo").val(),
        vRandomizationNo: $("#hdnRandomizationNo").val()
    }

    $.ajax({
        url: BaseUrl + "PMSRandomization/RemoveFromTempRandomization",
        type: 'POST',
        data: PostData,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Error while clear temp data !", ModuleName);

        }
    });

    function SuccessMethod(jsonData) {
        if (jsonData != "" && jsonData != undefined) {
            var a = jsonData;
            var iData = a[0];
            if (iData == "1") {
                $("#hdnRandomizationNo").val("");
            }
            return false;
        }
        else {
            SuccessorErrorMessageAlertBox("Error while clear temp data !", ModuleName);
        }
    }
}

$("#btnContinue").on("click", function () {

    var ContinueYes = "";

    if ($("#hdnRandomizationNo").val() == "") {
        var InclusionExclusionCriteria = '';
        if ($("input[name='optradio3']:checked").val() == "rbl_ConfirmYes") {
            InclusionExclusionCriteria = 'Y';
        }
        else if ($("input[name='optradio3']:checked").val() == "rbl_ConfirmNo") {
            InclusionExclusionCriteria = 'N';
        }
    }

    var returnVal = ValidateForRandomization();  //0= false, 1=IMP, 2=WithNonIMP
    if (returnVal == false) {
        return false;
    }
    $("#txtConSiteNo").val($("#ddlProjectNo").val());
    $("#txtConSubjectNo").val($("#txtSubjectNo").val());
    $("#txtConVisitNo").val($("#txtVisitName").val());
    $("#txtConVisitDate").val($("#txtRandomizationDate").val());
    $("#ConfirmtxtPatientRegistrationDate").val($("#txtPatientRegistrationDate").val());
    $("#ConfirmtxtPatientId").val($("#txtPatientId").val());
    $("#ConfirmtxtTreatmentArm").val($("#ddlTreatmentArm option:selected").text());
    $("#ConfirmtxtProductKit").val($("#ddlStudyProduct option:selected").text());
    
    var cProductKitIndication = $('#ddlStudyProduct option:selected').attr("cProductKitIndication");
    if (cProductKitIndication == "P")
    {
        $("#ConfirmtxtProductQuantity").val($("#txtProductQuantity").val());
        $("#dvConfirmtxtProductQuantity").show();
        $("#dvConfirmtxtAvailableKit").hide();
    }
    else
    {
        $("#ConfirmtxtAvailableKit").val($("#ddlAvailableKit option:selected").val());
        $("#dvConfirmtxtProductQuantity").hide();
        $("#dvConfirmtxtAvailableKit").show();
    }
    if (FirstVisit != "Y") {
        $("#lblConVisitDate").html("Visit Date");
    }
    else {
        $("#lblConVisitDate").html("Randomization Date");
    }

    if ($('#txtVisitName').val() == "VISIT 2") {
        var objPatientData = {
            vWorkSpaceId: setWorkspaceId,
            cIsPKarmpatient: $("#hdnArmPatientStatus").val(),
            vSubjectID: $("#txtSubjectNo").val().trim(),
            iModifyBy: $("#hdnuserid").val(),
        }
        var hasResponse = ValidateBeforeRandomization(objPatientData);
        if (parseInt(hasResponse) == 1) {
            hasResponse = true;
        }
        else if (parseInt(hasResponse) == -3) {
            hasResponse = true;
        }
        else if (parseInt(hasResponse) == -4) {
            SuccessorErrorMessageAlertBox("Stop: Randomization limit reached for selected Country", ModuleName);
            hasResponse = false;
        }
        else if (parseInt(hasResponse) == -5 || parseInt(hasResponse) == 0) {
            SuccessorErrorMessageAlertBox("Error while processing data", ModuleName);
            hasResponse = false;
        }
        else {
            hasResponse = true;  //Changes from false to True by Chaitali
        }
        if (hasResponse == true) {
            setTimeout(function () {
                $("#divConfirm").modal('show');

            }, 1000);
            return false;
        }
    }
    else {
        $("#divConfirm").modal('show');
        return false;
    }
});


function ValidateBeforeRandomization(patientDataset) {
    var res;
    var objPatientData = {
        vWorkSpaceId: patientDataset.vWorkSpaceId,
        vCountryName: patientDataset.vCountryName,
        vSubjectID: patientDataset.vSubjectID,
        iModifyBy: patientDataset.iModifyBy,
    }

    $.ajax({
        url: BaseUrl + "PMSRandomization/Proc_ValidateSubjectForRandomization0289",
        type: 'POST',
        async: false,
        data: objPatientData,
        success: SuccessMethod,
        error: function (response) {
            if (parseInt(response) == 0) {
                SuccessorErrorMessageAlertBox("Invalid", ModuleName);
                return true;
            }
        }
    });

    function SuccessMethod(response) {
        res = response;
    }
    return res;
}


function GetPriviousVisitData() {
    var PostData = {
        vWorkSpaceId: setWorkspaceId,
        vSubjectId: $("#hdnMySubjectNo").val(),
    }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/Proc_GetPreviousVisitData",
        type: 'POST',
        async: false,
        data: PostData,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Data Not Found !", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {

        if (jsonData.length > 0) {

            $("#txtVisitName").val(jsonData[0].VisitName);
            VisitNo = jsonData[0].VisitNo;

                GetStudyProduct();
                cEditVisit = 'Y'
                $('#divHr').attr('style', 'display:none');
                $('#btnListGO').attr('style', 'display:none');
                $('#ddlProjectNo').prop('disabled', true);
                $(':input', '#fdSubjectDetail').prop('disabled', true);

                $("#txtInitials").val("XXXXX");
                $("#ddlDate").val(0);
                $("#ddlMonth").val(0);
                $("#ddlYear").val(0);
                //$("#txtInitials").val($("#hdnInitials").val());
                //$("#ddlDate").val($("#hdnBirthDate").val().split("-")[0]);
                //$("#ddlMonth").val($("#hdnBirthDate").val().split("-")[1]);
                //$("#ddlYear").val($("#hdnBirthDate").val().split("-")[2]);

                $('#divHr').attr('style', 'display:none');
                $('#btnListGO').attr('style', 'display:none');
                $('#ddlProjectNo').prop('disabled', true);
                $(':input', '#fdSubjectDetail').prop('disabled', true);
             
                $("#txtRandomizationNo").val($("#hdnRandomizationNo").val());
                $("#txtPatientRegistrationDate").val($("#hdnPatientRegistrationDate").val());
                $("#txtPatientId").val($("#hdnMySubjectNo").val());
                $("#ddlTreatmentArm").val($("#hdnTreatementArm").val());
                $('#ddlTreatmentArm').prop('disabled', false);
                $('#txtPatientId').prop('disabled', true);
                $('#txtPatientRegistrationDate').prop('disabled', true);
                $("#ddlAvailableKit").val(0);
                
                $("#ddlStudyProduct").val(0);        
                //var dob = new Date($("#hdnBirthDate").val());
                $("#fdEnrollment").show();
                $("#fdRandomization").show();
                $('#btnListSaveAndContinue').attr('style', 'display:none');
                FirstVisit = "N";
                $('#btnSubmit').prop('disabled', true);
                $('.cls-hidden').attr('style', 'display:none');
           
        }
        else {
            //$("#btnViewAuditTrail").attr("style", "display:none");
        }
    }
}

function PageResetNewVisit() {
    $("#rblSafetyParametersYes").prop('checked', false);
    $("#rblSafetyParametersNo").prop('checked', false);
    $("#rblContinueYes").prop('checked', false);
    $("#rblContinueNo").prop('checked', false);
    $("#txtWeight").val("");
    $("#txtSerumCreatinine").val("");
    $('#ddlTargetAUC').val(0);
    $("#ddlDoseNonIMP").val(0);
    $("#txtSerumCreatinine").val("");
    $("#txtRemarksTargetAUC").val("");
    $("#txtRemarksDoseValue").val("");
    $("#txtIMPDose").val("");
    $("#txtCarboplatinDose").val("");
    $("#txtPaclitaxelDose").val("");

    $("#divContinueYesNo").attr("style", "display:none");
    $("#divNextQue").attr("style", "display:none");
    //$(".cls-hidden").attr("style", "display:none");
}

function ShowRemarks() {
    $("#txtRemarks").val("");
    $("#divRemarks").modal('show');
}

$("#btnRemarksSave").on("click", function () {
    if ($.trim($("#txtRemarks").val()) == "") {
        ValidationAlertBox("Please enter Reason For Cancel Visit.", "txtRemarks", ModuleName);
        return false;
    }

    var PostData = {
        vWorkspaceId: setWorkspaceId,
        vSubjectID: $("#hdnMySubjectNo").val(),
        vRandomizationNo: $("#hdnRandomizationNo").val(),
        vVisit: PreviousVisitName,
        iModifyBy: $("#hdnuserid").val(),
        vRemark: $.trim($("#txtRemarks").val())
    }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/Proc_CancelPatientVisit",
        type: 'POST',
        data: PostData,
        success: SuccessInsertData,
        error: function () {
            SuccessorErrorMessageAlertBox("Error To Cancel Patient Visit !", ModuleName);

        }
    });

    function SuccessInsertData(response) {
        if (response.length > 0) {
            if (response == "1") {
                $("#divRemarks").modal('hide');

                SuccessorErrorMessageAlertBox(PreviousVisitName + " Cancelled Successfully", ModuleName);

                $("#fdRandomization").attr("style", "display:none");
                $('.cls-hidden').attr('style', 'display:none');
                PageResetScreening("");

                //PageResetNewVisit();
                //NextReturnFuncaton();
            }
            else {
                SuccessorErrorMessageAlertBox("Error To Cancel Patient Visit !", ModuleName);
            }
        }
        else {
            SuccessorErrorMessageAlertBox("Error To Cancel Patient Visit !", ModuleName);
        }
    }
});

$("#btnViewAuditTrail").on("click", function () {
    AuditTrailOfpatient();
});

function AuditTrailOfpatient() {
    if (isBlank(document.getElementById('txtSubjectNo').value)) {
        if (!ValidateForIdentification()) {
            return false;
        }
    }
    else {
        if (isBlank(document.getElementById('txtSubjectNo').value)) {
            ValidationAlertBox("Please enter SubjectNo.", "txtSubjectNo", ModuleName);
        }
        if (Dropdown_Validation(document.getElementById("ddlProjectNo"))) {
            ValidationAlertBox("Please select Site No.", "ddlProjectNo", ModuleName);
            return false;
        }
        if (setWorkspaceId == "" || setWorkspaceId == undefined) {
            ValidationAlertBox("Please select Site No.", "ddlProjectNo", ModuleName);
            return false;
        }
    }

    $("#txtAuditSiteNo").val($("#ddlProjectNo").val());
    $("#txtAuditPatientNumber").val($("#txtSubjectNo").val());

    if ($.fn.DataTable.isDataTable('#tblAuditTrial')) {
        $('#tblAuditTrial').DataTable().destroy();
    }
    $('#tblAuditTrial').empty();
    $('#tblAuditTrial thead').empty();

    var AuditData = {
        vWorkSpaceId: String(setWorkspaceId),
        vSubjectID: $("#hdnMySubjectNo").val(),
        vVisit: PreviousVisitName,    //$("#txtVisitName").val(),
        DATAMODE: "2"
    }
    $.ajax({
        url: BaseUrl + "PmsRecordFetch/Proc_AuditTrailOfSubject",
        type: 'POST',
        data: AuditData,
        success: SuccessAuditMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Record Not Found.", ModuleName);
        }
    });

    function SuccessAuditMethod(jsonData) {

        var ActivityDataset = [];
        for (var i = 0; i < jsonData.length; i++) {
            var InDataset = [];

            InDataset.push(jsonData[i].vVisitNo, jsonData[i].vVisitDate, jsonData[i].vModifyBy, jsonData[i].vCancelBy, jsonData[i].vCancelRemark);

            ActivityDataset.push(InDataset);
        }

        otableAuditTrial = $('#tblAuditTrial').dataTable({
            "bJQueryUI": true,
            "sPaginationType": "full_numbers",
            "bLengthChange": false,
            "iDisplayLength": 10,
            "bProcessing": true,
            "autoWidth": false,
            "aaData": ActivityDataset,
            "bInfo": true,
            "aaSorting": [],
            "bAutoWidth": false,
            "bDestroy": true,
            "sScrollX": "100%",
            "sScrollXInner": "3000", /* It varies dynamically if number of columns increases */
            "aoColumns": [
                { "sTitle": "Visit No." },
                { "sTitle": "Visit Date" },
                { "sTitle": "Modify On" },
                { "sTitle": "Cancel By" },
                { "sTitle": "Reason For Cancel" }
            ],
            "columnDefs": [
                { "width": "80px", "targets": 0 },
                { "width": "100px", "targets": 1 },
                { "width": "185px", "targets": 2 },
                { "width": "220px", "targets": 3 },
                { "width": "70px", "targets": 4 },
            ],
            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },
        });

        $("#divtblAudit").modal('show');

        //otableAuditTrial.fnAdjustColumnSizing();
        //$('#tblAuditTrial tr').find('td:eq(0)').click;
    }
}

function ExportToExcelPdf(DataOpMode) {

    var isValue = 'Y';
    var TableData = new Array();

    $('#tblAuditTrial tr').each(function (row, tr) {

        if ($(tr).find('td:eq(0)').text() == 'No Record Found') {
            isValue = 'N';
            SuccessorErrorMessageAlertBox("No Records found", ModuleName);
            return false;
        }

        TableData[row] = {
            "vVisitNo": $(tr).find('td:eq(0)').text(),
            "vVisitDate": $(tr).find('td:eq(1)').text(),
            "vModifyBy": $(tr).find('td:eq(2)').text(),
            "vCancelBy": $(tr).find('td:eq(3)').text(),
            "vCancelRemark": $(tr).find('td:eq(4)').text()
        }
    });
    TableData.shift();  // first row will be empty - so remove

    if (TableData.length > 0 && isValue == 'Y') {

        var Data_Export = {
            vToWorkSpaceId: $("#txtAuditSiteNo").val(),
            vSubjectID: $("#txtAuditPatientNumber").val(),
            vAuditDTO: JSON.stringify(TableData),
            DataOpMode: DataOpMode
        }

        var url = WebUrl + "PmsRandomization/ExportDetailsSet";
        $.ajax({
            url: url,
            type: 'GET',
            data: Data_Export,
            success: function (data) {
                window.location.href = WebUrl + 'PmsRandomization/ExportToExcelPDF';
            },
            error: function () {
                SuccessorErrorMessageAlertBox("Data not found in export to " + DataOpMode + ".", ModuleName);
            }
        });
    }
}
function GetSetProtocol() {

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/GetSetProtocolMst/" + $("#hdnuserid").val(),
        type: 'GET',
        success: SuccessAuditMethod
    });

    function SuccessAuditMethod(jsonData) {
        if (jsonData.length > 0)
            SetProjectNo = jsonData[0].vProjectNo;
    }
}

function SendEmailForWarning(nTransactionNo, clsWarningFlag, vSubjectNo, dataSet) {
    var PostData = {
        vWorkSpaceID: ParentWorkSpaceID,
        vOperation: "Warning for " + clsWarningFlag,
        nTransactionNo: nTransactionNo,
        vProtocolNo: ProtocolNo + ' - Patient Number :' + vSubjectNo,
        vData: JSON.stringify(dataSet)
    }

    $.ajax({
        url: BaseUrl + "PmsGeneral/SendEmail",
        type: 'POST',
        data: PostData,
        //async: false,
        success: function (jsonData) {
            if (jsonData == null) {
            }
            if (jsonData.length > 0) {
            }
        },
        error: function () {
        }
    });
}