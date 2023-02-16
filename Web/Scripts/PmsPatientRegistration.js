var workspaceIds = new Object();
var CountryName = new Object();
var ModuleName = "Patient Registration";
var setWorkspaceId;
var setCountryName;
var ParentWorkSpaceID = "";
var ProtocolNo = "";
var SiteNo = "";
var SponserName = "";
var objData = [];
var Mail = "";
var TransactionID = "";
var TransactionDate = "";
var TransactionBy = "";
var iDataStatus = 1;
var vSubId = "";
var cIsbtnShow = 'N';
var cIsRescreening = '';
var vinformcondate = '';
var vPrevinformcondate = '';
var SetProjectNo = '';
var disReScrDtl = false;
var vSiteNo = '';

$(document).ready(function () {

   
    var vProfileList = $("#hdnUserButtonRights").val();
    var vProfileCode = $("#hdnUserTypeCode").val();

    //if (vProfileList.indexOf(vProfileCode) != -1) {
    //    cIsbtnShow = 'Y';
    //    $(".cls-hidden").attr("style", "display:contents");
    //}
    //else {
    //    $(".cls-hidden").attr("style", "display:none");
    //}

    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('.modal').modal('hide');

    // GetAllParentPRoject();
    //CheckSetProject();
    BindDateOfBirht();
    //GetSetProtocol();
    SetProjectNo = sessionStorage.getItem("ProtocolNo");

    var GetAllPmsProjectNo = {
        Url: BaseUrl + "PmsProductBatch/GetSetChildProjectNo",
        SuccessMethod: "SuccessMethod",
    }
       

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



    $(".allowalphabets").bind('keydown', function (event) {
        var key = event.which;
        if (key >= 48 && key <= 57) {
            event.preventDefault();
        }
    });

    $("#txtSubjectNo").on("keyup", function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            $("#btnGo")[0].click();
        }
    });
});

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
            ValidationAlertBox("Site Not Found !", "txtProjectNoDashboard", ModuleName);
        }
    });
    function SuccessMethod(jsonData) {
        var strdata = "";
        jsonData = jsonData.Table
        if (jsonData.length > 0) {
            var jsonObj = jsonData;
            var sourceArr = [];

            for (var i = 0; i < jsonObj.length; i++) {
                sourceArr.push(jsonObj[i].vProjectNo);
                workspaceIds[jsonObj[i].vProjectNo] = jsonObj[i].vWorkspaceId;
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

$('#ddlProjectNo').on('propertychange input change keyup paste mouseup', function () {
    var GetAllPmsProjectNo = {
        Url: BaseUrl + "PmsGeneral/GetScopeWiseProject",
        SuccessMethod: "SuccessMethod",
    }
    if ($('#ddlProjectNo').val().length == 2) {

        var ProjectNoDataTemp = {
            iUserId: $("#hdnuserid").val(),
            vStudyCode: $("#ddlProjectNo").val(),
        }


        GetAllPmsProjectNoData(GetAllPmsProjectNo.Url, GetAllPmsProjectNo.SuccessMethod, ProjectNoDataTemp);
        //  GetAllParentPRoject();
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


function GetParentWorkSpaceID() {
    if (workspaceIds[$('#ddlProjectNo').val()] != undefined) {
        setWorkspaceId = workspaceIds[$('#ddlProjectNo').val()];
    }
    if (setWorkspaceId == "" || setWorkspaceId == undefined) {
        return false;
    }

    PostData = {
        nStudyNo : setWorkspaceId,
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
        success: function (jsonData)
        {
            //ParentWorkSpaceID = jsonData[0].nParentStudyNo;
            ProtocolNo = jsonData.Table[0].vstudycode;
        },
        error: function () {
            //SuccessorErrorMessageAlertBox("Record Not Found.", ModuleName);
        }
    });

   
    
}

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
        success: function (jsonData) {
            if (jsonData.length > 0) {
                $('#ddlProjectNo').val(jsonData[0].vProjectNo);
                setWorkspaceId = jsonData[0].vWorkSpaceId;
                //GetParentWorkSpaceID();
            }
            else {
                $('#ddlProjectNo').val('');
            }
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Product not found.", ModuleName);
        }
    });
}

$('#ddlProjectNo').on('blur', function () {
    //checkChildSiteNo();
    //GetParentWorkSpaceID();
});

function checkChildSiteNo() {

    var cIsMatch = false;
    var vWorkSpaceNo = $('#ddlProjectNo').val();

    if (vWorkSpaceNo == "") {
        return false;
    }
    var ProjectNoDataTemp = {
        vProjectNo: vWorkSpaceNo,
        iUserId: $("#hdnuserid").val(),
        vProjectTypeCode: $("#hdnscopevalues").val(),
        strworkspacetype: "C",
        setProjectNo: sessionStorage.getItem("ProtocolNo")
    }

    $.ajax({
        url: BaseUrl + "PmsProductBatch/GetSetChildProjectNo",
        type: 'GET',
        async: false,
        data: { id: ProjectNoDataTemp.iUserId, projectno: ProjectNoDataTemp.vProjectNo, typecode: ProjectNoDataTemp.vProjectTypeCode, strworkspacetype: ProjectNoDataTemp.strworkspacetype, setProjectNo: ProjectNoDataTemp.setProjectNo },
        success: function (jsonData) {
            var jsonObj = jsonData;
            for (var i = 0; i < jsonObj.length; i++) {
                if (vWorkSpaceNo == jsonObj[i].vProjectNo) {
                    cIsMatch = true;
                    productIds[jsonObj[i].vProjectNo] = jsonObj[i].vWorkspaceId;
                }
            }
        },
        error: function () {
            setworkspaceid = '';
            $('#ddlProjectNo').val('');
            $('#ddlProjectNo').focus();
            SuccessorErrorMessageAlertBox("Site not found.", ModuleName);
        }
    });

    if (cIsMatch == false) {
        setworkspaceid = '';
        $('#ddlProjectNo').val('');
        $('#ddlProjectNo').focus();
        ValidationAlertBox("Please select valid Site No.", "ddlProjectNo", ModuleName);
    }
    else if (cIsMatch == true) {
        vProjectNo = vWorkSpaceNo;

        if (productIds[vProjectNo] != undefined) {
            setworkspaceid = productIds[vProjectNo];
        }
        else {
            setworkspaceid = '';
            $('#ddlProjectNo').val('');
            $('#ddlProjectNo').focus();
            ValidationAlertBox("Please select valid Site No.", "ddlProjectNo", ModuleName);
        }
    }
}


$('#btnGo').on('click', function () {

    var PostData;
    var bolWithSubjectId;
    var DOB = $('#ddlDate').val() + '-' + $('#ddlMonth').val() + '-' + $('#ddlYear').val();
    $('#dvRemarks').attr('style', 'display:none');
    if (isBlank(document.getElementById('txtSubjectNo').value)) {
        if (!ValidateForIdentification()) {
            return false;
        }

        var MonthIndex = ("JanFebMarAprMayJunJulAugSepOctNovDec".indexOf($('#ddlMonth').val()) / 3 + 1);
        var CheckDOB = $('#ddlDate').val() + '/' + MonthIndex + '/' + $('#ddlYear').val();
        if (!isValidDate(CheckDOB)) {
            ValidationAlertBox("Invalid date selection.", "ddlDate", ModuleName);
            return false;
        }

        if (!dobValidate(DOB)) {
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
    GetParentWorkSpaceID();
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

    function SuccessMethod(jsonData)
    {
        iDataStatus = 1;
        jsonData = jsonData.Table;
        if (jsonData.length != 0)
        {
            $("#hdnRandomizationNo").val(jsonData[0].vRandomizationNo);
            $("#hdnMySubjectNo").val(jsonData[0].vMySubjectNo);
            $("#hdnBirthDate").val(jsonData[0].dBirthDate);
            $("#hdnPatientRegistrationDate").val(jsonData[0].dPatientRegistrationDate);
            $("#hdnInitials").val(jsonData[0].vInitials);
            $("#hdnTreatementArm").val(jsonData[0].iTreatementArm);
            vSubId = jsonData[0].vSubjectId;
            vSiteNo = $("#ddlProjectNo").val();
            if (bolWithSubjectId == "1") {
                $("#txtSubjectNo").val(jsonData[0].vMySubjectNo);
                    fnSuccessResponseUpdate();
                    iDataStatus = 2;
            }    
        }
        else {
            if (bolWithSubjectId == "0") {
                $('#ddlProjectNo').prop('disabled', true);
                $('#fdSubjectDetail').prop('disabled', true);
                var strDate = $('#ddlDate').val();
                var strMonth = $('#ddlMonth').val();
                DOB = strDate + '-' + strMonth + '-' + $('#ddlYear').val();
                NewEnrollmentShow(DOB);
            }
            else {
                ValidationAlertBox("Records Not Found.", "txtSubjectNo", ModuleName);
            }
        }
    }
});


function GetTreatmentArm()
{
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


$('#btnEnrollmentClear').on('click', function () {
    PageResetScreening();
});


$('#btnReScreening').on('click', function () {
    cIsRescreening = 'Y';
    var strDate = $('#ddlDate').val();
    var strMonth = $('#ddlMonth').val();
    var DOB = strDate + '-' + strMonth + '-' + $('#ddlYear').val();
    $("#divConfirmScreen").modal('hide');
    if ($('#hdnMySubjectNo').val() == $('#ddlSubjectNoRe').val())
    {
        var ScreeningDate = new Date($("#hdnScreenFailureDate").val());
        var today = new Date();
        var Difference_In_Time = today.getTime() - ScreeningDate.getTime();
        var Days = Math.floor(Difference_In_Time / (1000 * 3600 * 24));
        if (Days > 60) {
            ValidationAlertBox("After 60 Days you can not Re-screening.", "ddlSubjectNoRe", ModuleName);
            return false;
        }
        $("#fdPreScreening").show();
        $("#txtPreInformedconsentDate").val($("#hdnInformedConsentDate").val());
        $("#txtPreScreeningDate").val($("#hdnScreeningDate").val());
        $(':input', '#fdPreScreening').prop('disabled', true);
        ReEnrollmentShow(DOB);
        return true;
    }
    else {
        ReSetDeatil();
        ReEnrollmentShow(DOB);
    }
});
$('#btnReScreenCancel').on('click', function () {
    $("#divConfirmScreen").modal('hide');
});
function ReEnrollmentShow(DOB) {
    dob = new Date(DOB);
    var today = new Date();
    var age = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));
    $('#txtAge').val(age);
    $("#fdEnrollment").show();


}


function ReSetDeatil() {
    $("#txtSubjectNo").val($("#ddlSubjectNoRe").val());

    PostData = {
        WhereCondition_1: "vWorkSpaceId = '" + setWorkspaceId + "' AND vMySubjectNo='" + $('#ddlSubjectNoRe').val() + "'",
    }

    var GetScreening = {
        Url: BaseUrl + "PmsRecordFetch/View_WorkspaceSubjectMst",
        Data: PostData,
        SuccessMethod: "SuccessMethod"
    }
    $.ajax({
        url: GetScreening.Url,
        type: 'POST',
        data: GetScreening.Data,
        async: false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Record Not Found.", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        iDataStatus = 1;
        jsonData = jsonData.Table;
        if (jsonData.length != 0) {
            alert("A:" + jsonData[0].vWorkspaceSubjectId);
            TransactionID = jsonData[0].vWorkspaceSubjectId;
            TransactionBy = jsonData[0].TransactionBy;
            TransactionDate = jsonData[0].TransactionDate;
            $("#hdnRandomizationNo").val(jsonData[0].vRandomizationNo);
            $("#hdnMySubjectNo").val(jsonData[0].vMySubjectNo);
            $("#hdnBirthDate").val(jsonData[0].dBirthDate);
            $("#hdnScreeningDate").val(jsonData[0].dScreeningDate);
            $("#hdnInformedConsentDate").val(jsonData[0].InformedConstentDate);
            $("#hdnInitials").val(jsonData[0].vInitials);
            $("#hdnGender").val(jsonData[0].cSEx);
            $("#hdnCountryName").val(jsonData[0].vCountryName);
            $("#hdnInclusionExclusionCriteria").val(jsonData[0].cInclusionExclusionCriteria);
            $("#hdnParentid").val(jsonData[0].vWorkspaceSubjectId);
            $("#ddlSubjectNo").empty();
            $("#hdnIsAge").val(jsonData[0]["cIsAge"]);
            $("#hdnPriorTreatmentStatus").val(jsonData[0].vPriorTreatmentStatus);
            $("#hdnArmPatientStatus").val(jsonData[0].cIsPKarmpatient);
            $("#hdnInformedConsentDate").val(jsonData[0].InformedConstentDate);
            vSubId = jsonData[0].vSubjectId;
            for (var i = 0; i < jsonData.length; i++) {
                $("#ddlSubjectNo").append($("<option></option>").val(jsonData[i].vMySubjectNo).html(jsonData[i].vMySubjectNo));
            }
            $("#txtSubjectNo").val(jsonData[0].vMySubjectNo);
        }
    }
}


function PageResetScreening() {
    $('#btnListGO').attr('style', 'display:block');
    $('#ddlProjectNo').prop('disabled', false);
    $('#fdSubjectDetail').prop('disabled', false);
    $("#fdEnrollment").hide();
    $("#txtInitials").val("");
    $("#ddlDate").val("0");
    $("#ddlMonth").val("0");
    $("#ddlYear").val("0");
    $("#txtSubjectNo").val("");
    $("#hdnMySubjectNo").val("");
    $("#txtSubjectNo").prop('disabled', false);
    $("#txtPatientId").val("");
    $("#txtPatientRegistrationDate").val(moment().format("DD-MMM-YYYY"));
    $("#txtRemark").val("");
    $("#ddlTreatmentArm").val(0);
    $(':input', '#fdSubjectDetail').prop('disabled', false);
    $('#divHr').attr('style', 'display:block');
    $('#divSubjectNo').attr('style', 'display:block');
    $('#lblNote').attr('style', 'display:block');
    iDataStatus = 1;
    vSubId = "";
}

function PageReset() {
    $('#btnListGO').attr('style', 'display:block');

    $('#ddlProjectNo').prop('disabled', false);
    $('#fdSubjectDetail').prop('disabled', false);
    $('#fdSubjectDetail').attr('style', 'display:block');
    $('#fdEnrollment').prop('disabled', false);


    $("#txtRandomizationNo").val("");
    $("#txtVisitName").val("");

    $("#hdnRandomizationNo").val("");
    $("#hdnMySubjectNo").val("");
    $("#hdnBirthDate").val("");
    $("#hdnInitials").val("");
    $("#hdnParentid").val("");


    $("#fdEnrollment").hide();
    $("#fdRandomization").hide();
    TransactionID = "";
    TransactionDate = "";
    TransactionBy = "";
}

$('#btnContinue').on('click', function () {
    if (!ValidateForEnrollment()) {
        return false;
    }

    var MonthIndex = ("JanFebMarAprMayJunJulAugSepOctNovDec".indexOf($('#ddlMonth').val()) / 3 + 1);
    var CheckDOB = $('#ddlDate').val() + '/' + MonthIndex + '/' + $('#ddlYear').val();
    if (!isValidDate(CheckDOB)) {
        ValidationAlertBox("Invalid date selection.", "ddlDate", ModuleName);
        return false;
    }

    var SiteNo = $('#ddlProjectNo').val();
    var Initials = $('#txtInitials').val().toUpperCase();
    var DOB = $('#ddlDate').val() + '-' + $('#ddlMonth').val() + '-' + $('#ddlYear').val();
    var InformedconsentDate = $('#txtPatientRegistrationDate').val();
    var PatientId = $('#txtPatientId').val();
    var Treatement = $("#ddlTreatmentArm option:selected").text();
    var Remarks = $("#txtRemark").val();

    if (!dobValidate(DOB)) {
        return false;
    }

    $('#txtConfirmSiteNo').val(SiteNo);
    //$('#txtConfirmInitials').val(Initials);
    //$('#txtConfirmDOB').val(DOB);
    $('#txtConfirmInitials').val("XXXXX");
    $('#txtConfirmDOB').val("XX-XXX-XXXX");
    $('#txtConfirmPatientRegistrationDate').val(InformedconsentDate);
    $('#txtConfirmPatientId').val(PatientId);
    $('#txtConfirmTreatmentArm').val(Treatement);

    if (iDataStatus == 2) {
        $('#dvConfirmRemarks').attr('style', 'display:block');
        $('#txtConfirmRemarks').val(Remarks);
    }
    else {
        $('#dvConfirmRemarks').attr('style', 'display:none');
        $('#txtConfirmRemarks').val("");
    }

    $("#divConfirm").modal('show');
    return false;
});

$('#btnSaveAndContinue').on('click', function () {

    var DOB = $('#ddlDate').val() + '-' + $('#ddlMonth').val() + '-' + $('#ddlYear').val();

    var strInitials = $("#txtInitials").val().toUpperCase();
    var setData = {
        vWorkSpaceId: setWorkspaceId,
        vSubjectID: iDataStatus == 2 ? vSubId : "0000000000",
        vFirstName: strInitials.split("")[0].toUpperCase(),
        vMiddleName: strInitials.split("")[1].toUpperCase(),
        vSurName: strInitials.split("")[2].toUpperCase(),
        vInitials: strInitials.toUpperCase(),
        dBirthDate: DOB,
        dPatientRegistrationDate: $("#txtPatientRegistrationDate").val(),
        iModifyBy: $("#hdnuserid").val(),
        cStatusIndi: iDataStatus == 2 ? "E" : "N",
        vSiteNo: setWorkspaceId,
        vRemark: $("#txtRemark").val(),
        DATAMODE: iDataStatus,
        vLocationCode: $("#hdnUserLocationCode").val(),
        iTreatementArm: $("#ddlTreatmentArm").val(),
        vMySubjectNoNew: $("#txtPatientId").val()
    }

    var GetScreening = {
        Url: BaseUrl + "PmsRecordSave/Save_SubjectMaster",
        Data: setData,
        SuccessMethod: "SuccessMethod"
    }

    $.ajax({
        url: GetScreening.Url,
        type: 'POST',
        data: GetScreening.Data,
        //async: false,
        beforeSend: function () {
            $('.MasterLoaderExtra').show();
        },
        complete: function () {
            $('.MasterLoaderExtra').hide();
        },
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Error while saving data.", ModuleName);
            return false;
        }
    });

    function SuccessMethod(jsonData) {
        if (jsonData == null) {
            SuccessorErrorMessageAlertBox("Data not found", ModuleName);
            return false;
        }
        if (jsonData.length == 0) {
            SuccessorErrorMessageAlertBox("Data not found", ModuleName);
            return false;
        }

        if (jsonData.length > 0) {
            if (jsonData[0]["Status"] == "0") {
                SuccessorErrorMessageAlertBox("Error while saving data from database.", ModuleName);
                $("#divConfirm").modal('hide');
                return false;
            }
            else if (jsonData[0]["Status"] == "1") {
                vSubId = jsonData[0]["SubjectID"];
                TransactionID = jsonData[0]["TransactionID"];
                TransactionDate = jsonData[0]["TransactionDate"];
                TransactionBy = jsonData[0]["TransactionBy"];
                vSiteNo = jsonData[0]["vSiteNo"];
                fnSuccessResponseData();
                return true;
            }
            else if (jsonData[0]["Status"] == "2") {
                SuccessorErrorMessageAlertBox("Site has reached patient screen capping limit. Please contact to project manager", ModuleName);
                $("#divConfirm").modal('hide');
                return false;
            }
        }
    }
});

function SendEmail(nTransactionNo, ActivityDataset, vSubjectNo) {
    var PostData = {
        vWorkSpaceID: setWorkspaceId,
        //vOperation: iDataStatus == 2 ? 'Screening Update' : 'Screening',
        vOperation: (iDataStatus == 2 ? 'Patient Registration Update' : 'Patient Registration'),
        nTransactionNo: nTransactionNo,
        vProtocolNo: ProtocolNo + ' - Patient Number :' + vSubjectNo,
        vData: JSON.stringify(ActivityDataset)
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

function NewEnrollmentShow(DOB) {


    dob = new Date(DOB);
    var today = new Date();
    var age = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));

    GetTreatmentArm();
    $('#txtPatientRegistrationDate').datetimepicker({ format: 'DD-MMM-YYYY', maxDate: new Date(), minDate: moment().subtract(2, 'd').format('DD-MMM-YYYY') });
    $("#txtPatientRegistrationDate").val(moment().format("DD-MMM-YYYY"));

    $("#fdEnrollment").show();
    //$("#fdRandomization").show();
    $(':input', '#fdSubjectDetail').prop('disabled', true);

    $('#lblNote').attr('style', 'display:none');
    $('#btnListGO').attr('style', 'display:none');

    $('#divHr').attr('style', 'display:none');
    $('#divSubjectNo').attr('style', 'display:none');

    $("#btnContinue").attr("title", "Continue");
    $("#spnContinue").html("Continue");
}

function ConfirmMessageBoxPatientNo(ModuleName, strConfirmMessage) {
    var strdata = "";
    strdata += "<div class='modal-dialog' style='width:450px'>";
    strdata += "<div class='DTED_Lightbox_Content' style='height: auto; width: 530px;'>";
    strdata += "<div class='modal-content modal-content-AlertPromt'>";
    strdata += "<div class='modal-header modalheader'>"
    strdata += "<button type='button' class='Close' onClick='CancelReturnFuncaton()'>&times;</button>"
    strdata += "<h4 class='modal-title modaltitle text-center'><label id='lblmsg' class='text-center' style='color:black'>" + ModuleName + "</label></h4></div>";
    strdata += "<div class='modal-body' style='padding:0px'><div class='box-body'>"
    strdata += "<label id='lblmsg' class='text-center'>" + strConfirmMessage + "</label>";
    strdata += "</div></div>";
    strdata += "<div class='modal-footer modalfooter' style='padding-right: 95px;'>";
    if ($('#hdnReScreeningRequired').val() == "YES") {
        strdata += "<button type='button' class='btn btn-success' onclick='ReScreeningConfirmMessageBox()'><i class='fa fa-plus'></i>Re-Screening</button>"
    }
    //strdata += "<button type='button' class='btn btn-success' onclick='YesReturnFunction()'><i class='fa fa-plus'></i>New Screening</button>"
    strdata += "<button type='button' class='btn btn-primary' onClick=fnSuccessResponseNext()><i class='glyphicon glyphicon-print'></i>&nbsp;&nbsp;Print</button>"
    strdata += "<button type='button' class='btn btn-default' onClick=CancelReturnFuncaton()><i class='fa fa-times'></i>Cancel</button>"

    //strdata += "<a data-toggle='modal' id='btnResponsePrint' data-tooltip='tooltip' title='Print'>"
    //strdata += "<i class='btn btn-success btn-rounded btn-ef btn-ef-5 btn-ef-5a'>"
    //strdata += "<i class='glyphicon glyphicon-floppy-saved'></i>"
    //strdata += "<span>New Screening</span></i></a>"

    //strdata += "<a data-toggle='modal' id='btnResponsePrint' data-tooltip='tooltip' title='Print'>"
    //strdata += "<i class='btn bg-olive btn-rounded btn-ef btn-ef-5 btn-ef-5a'>"
    //strdata += "<i class='glyphicon glyphicon-print'></i>"
    //strdata += "<span id='spnPrint'>Print</span></i></a>"

    strdata += "</div></div></div></div>"

    $("#AlertMessagePopup").append(strdata);
    $("#AlertMessagePopup").modal('show');
}
function ConfirmMessageBox(ModuleName, strConfirmMessage) {
    var strdata = "";
    strdata += "<div class='modal-dialog' style='width:450px'>";
    strdata += "<div class='DTED_Lightbox_Content' style='height: auto;'>";
    strdata += "<div class='modal-content modal-content-AlertPromt'>";
    strdata += "<div class='modal-header modalheader'>"
    strdata += "<button type='button' class='Close' onClick='CancelReturnFuncaton()'>&times;</button>"
    strdata += "<h4 class='modal-title modaltitle text-center'><label id='lblmsg' class='text-center' style='color:black'>" + ModuleName + "</label></h4></div>";
    strdata += "<div class='modal-body' style='padding:0px'><div class='box-body'>"
    strdata += "<label id='lblmsg' class='text-center'>" + strConfirmMessage + "</label>";
    strdata += "</div></div>";
    strdata += "<div class='modal-footer modalfooter'>";
    strdata += "<button type='button' class='btn btn-success' onclick='YesReturnFunction()'><i class='fa fa-plus'></i>New Screening</button>"
    strdata += "<button type='button' class='btn btn-primary' onClick=fnSuccessResponseNext()><i class='glyphicon glyphicon-print'></i>&nbsp;&nbsp;Print</button>"
    strdata += "<button type='button' class='btn btn-default' onClick=CancelReturnFuncaton()><i class='fa fa-times'></i>Cancel</button>"

    //strdata += "<a data-toggle='modal' id='btnResponsePrint' data-tooltip='tooltip' title='Print'>"
    //strdata += "<i class='btn btn-success btn-rounded btn-ef btn-ef-5 btn-ef-5a'>"
    //strdata += "<i class='glyphicon glyphicon-floppy-saved'></i>"
    //strdata += "<span>New Screening</span></i></a>"

    //strdata += "<a data-toggle='modal' id='btnResponsePrint' data-tooltip='tooltip' title='Print'>"
    //strdata += "<i class='btn bg-olive btn-rounded btn-ef btn-ef-5 btn-ef-5a'>"
    //strdata += "<i class='glyphicon glyphicon-print'></i>"
    //strdata += "<span id='spnPrint'>Print</span></i></a>"

    strdata += "</div></div></div></div>"

    $("#AlertMessagePopup").append(strdata);
    $("#AlertMessagePopup").modal('show');
}
function ReScreeningConfirmMessageBox() {

    var dScreenFailureDate = new Date($("#hdnScreenFailureDate").val());
    var d = 30 * 24 * 60 * 60 * 1000; // add 30 days
    var dReScreeningDate = new Date(dScreenFailureDate.getTime() + d);

    var today = new Date();
    var day_2Remain = new Date(today);
    day_2Remain.setDate(day_2Remain.getDate() - 2);

    $("#AlertMessagePopup").html("");
    $("#AlertMessagePopup").modal('hide')


    $("#rblMale").attr('disabled', 'disabled');
    $("#rblFemale").attr('disabled', 'disabled');
    $("#rblNonSmoker").attr('disabled', 'disabled');
    $("#rblSmoker").attr('disabled', 'disabled');

    $("#divConfirmScreen").modal('show');

    if ($("#hdnGender").val() == "M") {
        $("#rblMale").attr('checked', 'checked');
    }
    else {
        $("#rblFemale").attr('checked', 'checked');
    }
    if ($("#hdnSmokingHistory").val() == "N") {
        $("#rblNonSmoker").attr('checked', 'checked');
    }
    else {
        $("#rblSmoker").attr('checked', 'checked');
    }

    var finalDate = "";
    if (new Date(dScreenFailureDate) > new Date(day_2Remain.toDateString())) {
        finalDate = new Date(dScreenFailureDate);
    }
    else if (new Date(day_2Remain.toDateString() > new Date(dScreenFailureDate))) {
        finalDate = new Date(day_2Remain.toDateString());
    }
    $("#txtInformedconsentDate").datetimepicker({ format: 'DD-MMM-YYYY', minDate: new Date(finalDate), maxDate: new Date() });
    $("#txtInformedconsentDate").val(moment(new Date()).format('DD-MMM-YYYY'));
    $("#txtScreeningDate").datetimepicker({ format: 'DD-MMM-YYYY', minDate: new Date(finalDate), maxDate: new Date() });
    $("#txtScreeningDate").val(moment(new Date()).format('DD-MMM-YYYY'));
    $(':input', '#fdSubjectDetail').prop('disabled', true);
}

function YesReturnFunction() {
    $("#AlertMessagePopup").html("");
    $("#AlertMessagePopup").modal('hide');
    $("#hdnParentid").val("");

    var strDate = $('#ddlDate').val();
    var strMonth = $('#ddlMonth').val();

    if ($("#hdnGender").val() == "M") {
        $("#rblMale").attr('checked', 'checked');
    }
    else {
        $("#rblFemale").attr('checked', 'checked');
    }
    if ($("#hdnSmokingHistory").val() == "N") {
        $("#rblNonSmoker").attr('checked', 'checked');
    }
    else {
        $("#rblSmoker").attr('checked', 'checked');
    }
    $("#txtInformedconsentDate").val($("#hdnInformedConsentDate").val());

    var DOB = strDate + '-' + strMonth + '-' + $('#ddlYear').val();

    NewEnrollmentShow(DOB);
}

function NextReturnFuncaton() {
    $("#AlertMessagePopup").modal('hide');
    $("#AlertMessagePopup").html("");
    $('#divHr').attr('style', 'display:none');
    $('#btnListGO').attr('style', 'display:none');

    var dob = new Date($("#hdnBirthDate").val());
    var today = new Date();
    var age = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));
    $('#txtAge').val(age);

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

    $("#fdEnrollment").show();
    $('#fdEnrollment').prop('disabled', true);
    $("#fdRandomization").show();
    $('#ddlProjectNo').prop('disabled', true);
    $('#fdSubjectDetail').prop('disabled', true);
    $('#btnListSaveAndContinue').attr('style', 'display:none');

}

function GetNextVisitName() {
    var PostData = {
        vWorkSpaceId: setWorkspaceId,
        vSubjectId: $("#hdnMySubjectNo").val(),
        vRandomizationNo: $("#hdnRandomizationNo").val(),
    }

    $.ajax({
        url: BaseUrl + "PMSRandomization/Proc_GetNextVisitName",
        type: 'POST',
        data: PostData,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Data Not Found !", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        if (jsonData.length > 0) {
            $("#txtVisitName").val(jsonData[0].VisitName);
        }
        else {
            $("#txtVisitName").val("");
        }
    }
}

function CancelReturnFuncaton() {
    $("#AlertMessagePopup").modal('hide');
    $("#AlertMessagePopup").html("");
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
    var minOffset = 18, maxOffset = 200;
    var thisYear = (new Date()).getFullYear();
    for (var i = minOffset; i <= maxOffset; i++) {
        var year = thisYear - i;
        $("#ddlYear").append($("<option></option>").val(year).html(year));
    }
}

function ValidateForEnrollment() {
    if (Dropdown_Validation(document.getElementById("ddlProjectNo"))) {
        ValidationAlertBox("Please select Site No.", "ddlProjectNo", ModuleName);
        return false;
    }
    if (setWorkspaceId == "" || setWorkspaceId == undefined) {
        ValidationAlertBox("Please select Site No.", "ddlProjectNo", ModuleName);
        return false;
    }

    if (isBlank(document.getElementById('txtPatientRegistrationDate').value)) {
        ValidationAlertBox("Please select Patient Registration Date.", "txtPatientRegistrationDate", ModuleName);
        return false;
    }

    if (isBlank(document.getElementById('txtPatientId').value)) {
        ValidationAlertBox("Please select Patient Id.", "txtPatientId", ModuleName);
        return false;
    }

    if (isBlank(document.getElementById('ddlTreatmentArm').value)) {
        ValidationAlertBox("Please select Treatment Arm.", "ddlTreatmentArm", ModuleName);
        return false;
    }
    
    if (iDataStatus == 2) {
        if (isBlank(document.getElementById('txtRemark').value)) {
            ValidationAlertBox("Please enter Remark.", "txtRemark", ModuleName);
            return false;
        }
    }

    return true;
}

function ValidateForIdentification() {

    if (Dropdown_Validation(document.getElementById("ddlProjectNo"))) {
        ValidationAlertBox("Please select Site No.", "ddlProjectNo", ModuleName)
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

function ValidateForRandomization() {
    var CheckIMP_NonIMP = 0;        //0= false, 1=IMP, 2=WithNonIMP

    if (Dropdown_Validation(document.getElementById("ddlProjectNo"))) {
        ValidationAlertBox("Please select Site No.", "ddlProjectNo", ModuleName);
        return false;
    }
    if (setWorkspaceId == "" || setWorkspaceId == undefined) {
        ValidationAlertBox("Please select Site No.", "ddlProjectNo", ModuleName);
        return false;
    }

    if (isBlank(document.getElementById('txtWeight').value)) {
        ValidationAlertBox("Please enter Body Weight.", "txtWeight", ModuleName);
        return false;
    }
    else {
        if (isBlank(document.getElementById('txtHeight').value) && Dropdown_Validation(document.getElementById('ddlTargetAUC')) && isBlank(document.getElementById('txtSerumCreatinine').value) && Dropdown_Validation(document.getElementById("ddlDoseNonIMP"))) {
            CheckIMP_NonIMP = 1;
        }
        else {
            if (isBlank(document.getElementById('txtHeight').value)) {
                ValidationAlertBox("Please enter Body Weight.", "txtHeight", ModuleName);
                return false;
            }
            if (Dropdown_Validation(document.getElementById('ddlTargetAUC'))) {
                ValidationAlertBox("Please select Target AUC.", "ddlTargetAUC", ModuleName);
                return false;
            }
            if (isBlank(document.getElementById('txtSerumCreatinine').value)) {
                ValidationAlertBox("Please enter Body Weight.", "txtSerumCreatinine", ModuleName);
                return false;
            }
            if (Dropdown_Validation(document.getElementById("ddlDoseNonIMP"))) {
                ValidationAlertBox("Please select Site.", "ddlDoseNonIMP", ModuleName);
                return false;
            }
            CheckIMP_NonIMP = 2;
        }
    }

    return CheckIMP_NonIMP;
}

function GetSubjectDetails(DOB, vIntials, vSubjectNo) {


}

$('#btnResponsePrint').on('click', function () {
    //fnSuccessResponse();
    printDiv();
});

function printDiv() {
    //var divToPrint = document.getElementById('tblResponseDtl');
    //var newWin = window.open('', 'Print-Window');
    //newWin.document.open();
    //newWin.document.write('<html><body onload="window.print()">' + divToPrint.outerHTML + '</body></html>');
    //newWin.document.close();
    //setTimeout(function () { newWin.close(); }, 10);

    $("#tblResponseDtl").attr("style", "border-collapse: collapse");
    document.getElementById("tblResponseDtl").deleteTHead();
    $('#tblResponseDtl  tr').each(function () {
        $('td:eq(0)', this).attr({ "width": "25%" });
        $('td:eq(1)', this).attr({ "width": "50%" });
    });

    var d = new Date($.now());
    var currentdate = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

    var divToPrint = document.getElementById("tblResponseDtl");
    newWin = window.open("");
    //newWin.document.write(divToPrint.outerHTML);
    newWin.document.write('<html><body onload="window.print()">Printing Date & Time : ' + currentdate + '<br/>' + divToPrint.outerHTML + '</body></html>');
    newWin.print();
    newWin.close();
}

function fnSuccessPopup() {
    var ActivityDataset = [];
    var data = [];
    var datalist = {};

    for (var i = 0; i < objData.length; i++) {
        var InDataset = [];
        if (objData[i].x == "Initials") {
            InDataset.push(objData[i].x, "XXXXX");
        }
        else if (objData[i].x == "Date of Birth") {
            InDataset.push(objData[i].x, "XX-XXX-XXXX");
        }
        else {
            InDataset.push(objData[i].x, objData[i].y);
        }
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
           { "sTitle": "Details" },
           { "sTitle": "Response" },
        ],
        "columnDefs": [
            { "width": "25%", "targets": 0 },
            { "width": "50%", "targets": 1 },
        ],
        "oLanguage": {
            "sEmptyTable": "No Record Found",
        },
    });
    $("#divResponse").modal('show');
    return false;
}

function fnSuccessResponseData() {

    objData = [];
    objData.push({ x: "Transaction ID", y: TransactionID });
    objData.push({ x: "Transaction By", y: TransactionBy });
    objData.push({ x: "Transaction Date & Time", y: TransactionDate });
    objData.push({ x: "Protocol No", y: ProtocolNo });
    objData.push({ x: "Site Id", y: vSiteNo });
    //objData.push({ x: "Patient Initials", y: $('#txtInitials').val().toUpperCase() });
    //objData.push({ x: "Date of Birth", y: $("#ddlDate :selected").text() + "-" + $("#ddlMonth :selected").text() + "-" + $("#ddlYear :selected").text() });
    objData.push({ x: "Patient Initials", y: "XXXXX" });
    objData.push({ x: "Date of Birth", y: "XX-XXX-XXXX" });
    objData.push({ x: "Patient Registration Date", y: $("#txtPatientRegistrationDate").val() });
    objData.push({ x: "Patient Id", y: $("#txtPatientId").val() });
    objData.push({ x: "Treatment Arm", y: $("#ddlTreatmentArm option:selected").text() });
   
    if (iDataStatus == 2) {
        objData.push({ x: "Remark ", y: $('#txtRemark').val() });
    }

    //if (Mail == "Y") {
        //if ($('#hdnISSendEmailForTransaction').val() == 1) {
            SendEmail(TransactionID, objData, $('#hdnMySubjectNo').val());
        //}
    //}

    $('#lblResponseTitle').attr('style', 'display:block');
    $('#dvSubjectList').attr('style', 'display:none');

    fnSuccessPopup();
}

function fnSuccessResponseNext() {

    $("#AlertMessagePopup").html("");
    $("#AlertMessagePopup").modal('hide');

    var dob = new Date($("#hdnBirthDate").val());
    var today = new Date();
    var age = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));

    
    objData = [];
    objData.push({ x: "Transaction ID", y: TransactionID });
    objData.push({ x: "Transaction By", y: TransactionBy });
    objData.push({ x: "Transaction Date & Time", y: TransactionDate });
    objData.push({ x: "Protocol No", y: ProtocolNo });
    objData.push({ x: "Site Id", y: vSiteNo });
    //objData.push({ x: "Patient Initials", y: $('#txtInitials').val().toUpperCase() });
    //objData.push({ x: "Date of Birth", y: $("#ddlDate :selected").text() + "-" + $("#ddlMonth :selected").text() + "-" + $("#ddlYear :selected").text() });
    objData.push({ x: "Patient Initials", y: "XXXXX" });
    objData.push({ x: "Date of Birth", y: "XX-XXX-XXXX" });
    objData.push({ x: "Patient Registration Date", y: $("#txtPatientRegistrationDate").val() });
    objData.push({ x: "Patient Id", y: $("#txtPatientId").val() });
    objData.push({ x: "Treatment Arm", y: $("#ddlTreatmentArm option:selected").text() });

    $('#lblResponseTitle').attr('style', 'display:none');
    $('#dvSubjectList').attr('style', 'display:block');
    fnSuccessPopup();
}

function fnSuccessResponseUpdate() {

    GetTreatmentArm();
    $("#ddlProjectNo").prop("disabled", true);
    $("#txtAuditSiteNo").val("");
    $("#txtAuditPatientNumber").val("");
    $("#txtInitials").val($("#hdnInitials").val());
    $("#ddlDate").val($("#hdnBirthDate").val().split('-')[0]);
    $("#ddlMonth").val($("#hdnBirthDate").val().split('-')[1]);
    $("#ddlYear").val($("#hdnBirthDate").val().split('-')[2]);

    $('#txtPatientRegistrationDate').datetimepicker({ format: 'DD-MMM-YYYY', maxDate: $("#hdnPatientRegistrationDate").val(), minDate: $("#hdnPatientRegistrationDate").val() });
    $("#txtPatientRegistrationDate").val(moment().format("DD-MMM-YYYY"));

    //$("#txtPatientRegistrationDate").datetimepicker({ format: 'DD-MMM-YYYY', minDate: new Date($("#hdnPatientRegistrationDate").val()), maxDate: new Date($("#hdnPatientRegistrationDate").val()) });
    //$("#txtPatientRegistrationDate").val(moment(new Date()).format('DD-MMM-YYYY'));

    //$("#txtPatientRegistrationDate").val($("#hdnPatientRegistrationDate").val());
    $("#txtPatientId").val($("#hdnMySubjectNo").val());
    $("#ddlTreatmentArm").val($("#hdnTreatementArm").val());


    $("#fdEnrollment").show();

    $('#lblNote').attr('style', 'display:none');
    $('#btnListGO').attr('style', 'display:none');

    $('#divHr').attr('style', 'display:block');
    $('#divSubjectNo').attr('style', 'display:block');
    $("#txtSubjectNo").prop("disabled", true);

    $('#dvRemarks').attr('style', 'display:block');

    $("#btnContinue").attr("title", "Update");
    $("#spnContinue").html("Update");
}

$('#ddlSubjectNo').on('change', function () {
    $("#txtSubjectNo").val($("#ddlSubjectNo").val());

    PostData = {
        WhereCondition_1: "vWorkSpaceId = '" + setWorkspaceId + "' AND vMySubjectNo='" + $('#ddlSubjectNo').val() + "'",
    }

    var GetScreening = {
        Url: BaseUrl + "PmsRecordFetch/View_WorkspaceSubjectMst",
        Data: PostData,
        SuccessMethod: "SuccessMethod"
    }
    $.ajax({
        url: GetScreening.Url,
        type: 'POST',
        data: GetScreening.Data,
        async: false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Record Not Found.", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        jsonData = jsonData.Table;
        if (jsonData.length != 0) {

            vSubId = jsonData[0].vSubjectId;
            TransactionID = jsonData[0].vWorkspaceSubjectId;
            TransactionDate = jsonData[0].TransactionDate;
            TransactionBy = jsonData[0].TransactionBy;
            $("#hdnRandomizationNo").val(jsonData[0].vRandomizationNo);
            $("#hdnMySubjectNo").val(jsonData[0].vMySubjectNo);
            $("#hdnBirthDate").val(jsonData[0].dBirthDate);
            $("#hdnScreeningDate").val(jsonData[0].dScreeningDate);
            $("#hdnInitials").val(jsonData[0].vInitials);
            $("#hdnGender").val(jsonData[0].cSEx);
            $("#hdnSmokingHistory").val(jsonData[0].cSmokingStatus);
            $("#hdnCountryName").val(jsonData[0].vCountryName);
            $("#hdnInclusionExclusionCriteria").val(jsonData[0].cInclusionExclusionCriteria);

            var dob = new Date($("#hdnBirthDate").val());
            var today = new Date();
            var age = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));

            var Gender = "";
            var SmokingHistory = "";
            if ($('#hdnGender').val() == "M") {
                Gender = "Male";
            }
            else if ($('#hdnGender').val() == "F") {
                Gender = "Female";
            }
            if ($('#hdnSmokingHistory').val() == "S") {
                SmokingHistory = "Smoker";
            }
            else if ($('#hdnSmokingHistory').val() == "N") {
                SmokingHistory = "Non-Smoker";
            }

            objData = [];
            objData.push({ x: "Transaction ID", y: TransactionID });
            objData.push({ x: "Transaction By", y: TransactionBy });
            objData.push({ x: "Transaction Date & Time", y: TransactionDate });
            objData.push({ x: "Protocol No", y: ProtocolNo });
            objData.push({ x: "Sponsor Name", y: SponserName });
            objData.push({ x: "Site Id", y: vSiteNo });
            objData.push({ x: "Patient Number", y: $('#hdnMySubjectNo').val() });
            objData.push({ x: "Initials", y: $('#hdnInitials').val().toUpperCase() });
            objData.push({ x: "Date of Birth", y: $('#hdnBirthDate').val() });
            objData.push({ x: "Screening Date", y: $('#hdnScreeningDate').val() });
            objData.push({ x: "Age", y: age });
            objData.push({ x: "Gender ", y: Gender });
            objData.push({ x: "Smoking History ", y: SmokingHistory });
            objData.push({ x: "Country of Enrollment ", y: $('#hdnCountryName').val() });

            $('#lblResponseTitle').attr('style', 'display:none');
            $('#dvSubjectList').attr('style', 'display:block');

            var ActivityDataset = [];
            var data = [];
            var datalist = {};

            for (var i = 0; i < objData.length; i++) {
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
                   { "sTitle": "Details" },
                   { "sTitle": "Response" },
                ],
                "columnDefs": [
                    { "width": "25%", "targets": 0 },
                    { "width": "50%", "targets": 1 },
                ],

                "oLanguage": {
                    "sEmptyTable": "No Record Found",
                },
            });
        }
    }
});

$('#btnGoClear').on('click', function () {
    PageResetScreening();
});

$('#btnGoExit').on('click', function () {
    ConfirmAlertBox(ModuleName, $("#RedirectToHome").val());
});
$('#btnEnrollmentExit').on('click', function () {
    ConfirmAlertBox(ModuleName, $("#RedirectToHome").val());
});


function dobValidate(b) {
    var today = new Date();
    var nowyear = today.getFullYear();
    var nowmonth = today.getMonth();
    var nowday = today.getDate();
    //var b = document.getElementById('<%=TextBox2.ClientID%>').value;

    var birth = new Date(b);

    var birthyear = birth.getFullYear();
    var birthmonth = birth.getMonth();
    var birthday = birth.getDate();

    var age = nowyear - birthyear;
    var age_month = nowmonth - birthmonth;
    var age_day = nowday - birthday;

    if (age > 999) {
        ValidationAlertBox("Age cannot be more than 999 Years. Please enter correct age.", "ddlDate", ModuleName);
        return false;
    }
    if (age_month < 0 || (age_month == 0 && age_day < 0)) {
        age = parseInt(age) - 1;

    }
    if ((age == 18 && age_month <= 0 && age_day <= 0) || age < 19) {
        ValidationAlertBox("Age should be 19 years or above. Please enter a valid Date of Birth.", "ddlDate", ModuleName);
        return false;
    }
    return true;
}

function isValidDate(s) {
    //Date Format   dd/mm/yyyy    31/09/2011
    var bits = s.split('/');
    var d = new Date(bits[2] + '/' + bits[1] + '/' + bits[0]);
    return !!(d && (d.getMonth() + 1) == bits[1] && d.getDate() == Number(bits[0]));
}

$('#btnResponseCancel').on('click', function () {
    $("#divConfirm").modal('hide');
    PageResetScreening();
});

$('.btnCloseResponse').on('click', function () {
    $("#divConfirm").modal('hide');
    PageResetScreening();
});
$(".btnCloseScreeningAudit").on("click", function () {
    $("#divtblScreeningAudit").modal('hide');
    //$("#divConfirm").modal('show');
});

$("#btnScreeningAudit").on("click", function () {
    ScreeningAudit();
});
$("#btnScreeningPupUpAudit").on("click", function () {
    $("#divConfirm").modal('hide');
    ScreeningAudit();
});

function ScreeningAudit() {
    $("#txtAuditSiteNo").val($("#ddlProjectNo").val());
    $("#txtAuditPatientNumber").val($("#txtSubjectNo").val());

    var AuditScreeningData = {
        vSubjectID: vSubId
    }
    $.ajax({
        url: BaseUrl + "PmsRecordFetch/ScreeningAuditTrail",
        type: 'POST',
        data: AuditScreeningData,
        success: SuccessAuditMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Record Not Found.", ModuleName);
        }
    });

    function SuccessAuditMethod(jsonData) {
        var ActivityDataset = [];
        var columns = [];
        for (var i = 0; i < jsonData.length; i++) {


            var InDataset = [];
            InDataset.push(
                //jsonData[i].vInitials,
                //jsonData[i].dBirthDate,
                "XXXXX",
                "XX-XXX-XXXX",
                jsonData[i].dPatientRegistrationDate,
                jsonData[i].vMySubjectNo,
                jsonData[i].vProductType,
                jsonData[i].vRemark,
                jsonData[i].iModifyBy,
                jsonData[i].dModifyOn);

            ActivityDataset.push(InDataset);
        }
        if (disReScrDtl == false) {
            //columns = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
        }
        otableScreeningAuditTrial = $('#tblScreeningAuditTrial').dataTable({
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
                { "sTitle": "Initials" },
                { "sTitle": "Date of Birth" },
                { "sTitle": "Patient Registration Date" },
                { "sTitle": "Patient Id" },
                { "sTitle": "Treatement Arm" },
                { "sTitle": "Remarks" },
                { "sTitle": "Modify by" },
                { "sTitle": "Modify On" }
            ],
            "columnDefs": [
                { "width": "8%",  "targets":  0 },
                { "width": "12%", "targets":  1 },
                { "width": "13%", "targets":  2 },
                { "width": "8%",  "targets":  3 },
                { "width": "14%", "targets":  4 },
                { "width": "18%", "targets":  5 },
                { "width": "18%", "targets":  6 },
                { "width": "18%", "targets":  7 },
            ],
            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },
        });

        $("#divtblScreeningAudit").modal('show');
    }
}

$('#ddlDate').on('change', function () {
    ChangeAge();
});
$('#ddlMonth').on('change', function () {
    ChangeAge();
});
$('#ddlYear').on('change', function () {
    ChangeAge();
});
function ChangeAge() {
    if (String($('#ddlDate').val()) != "" && String($('#ddlMonth').val()) != "" && String($('#ddlYear').val()) != "") {
        dob = new Date(String($('#ddlDate').val()) + "-" + String($('#ddlMonth').val()) + "-" + String($('#ddlYear').val()));
        var today = new Date();
        var age = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));
        $('#txtAge').val(age);
    }
    else {
        $('#txtAge').val('');
    }
}

function ExportToExcelPdf(DataOpMode) {

    var isValue = 'Y';
    var TableData = new Array();

    $('#tblScreeningAuditTrial tr').each(function (row, tr) {
        if ($(tr).find('td:eq(0)').text() == 'No Record Found') {
            isValue = 'N';
            SuccessorErrorMessageAlertBox("No Records found", alertName);
            return false;
        }
            TableData[row] = {
                "vInitials": $(tr).find('td:eq(0)').text(),
                "dBirthDate": $(tr).find('td:eq(1)').text(),
                "dPatientRegistrationDate": $(tr).find('td:eq(2)').text(),
                "vMySubjectNo": $(tr).find('td:eq(3)').text(),
                "vProductType": $(tr).find('td:eq(4)').text(),
                "vRemark": $(tr).find('td:eq(5)').text(),
                "iModifyBy": $(tr).find('td:eq(6)').text(),
                "dModifyOn": $(tr).find('td:eq(7)').text(),
            }
    });
    TableData.shift();  // first row will be empty - so remove

    if (TableData.length > 0 && isValue == 'Y') {

        var Data_Export = {
            vToWorkSpaceId: $("#ddlProjectNo").val(),
            vSubjectID: $("#txtSubjectNo").val(),
            vAuditDTO: JSON.stringify(TableData),
            DataOpMode: DataOpMode
        }

        var url = WebUrl + "PmsPatientRegistration/ExportDetailsSet";
        $.ajax({
            url: url,
            type: 'GET',
            data: Data_Export,
            success: function (data) {
                window.location.href = WebUrl + 'PmsPatientRegistration/ExportToExcelPDF';
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