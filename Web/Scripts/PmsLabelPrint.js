var workspaceId = new Object();
var viewmode;
var ModuleName = "Label Print"
var StudyType = "";

$(document).ready(function () {
    $('#ddlKitLabel').multiselect({
        nonSelectedText: 'Please Select Kit',
        buttonClass: 'form-control',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        numberDisplayed: 2,
    });

    $('#ddlProductLabel').multiselect({
        nonSelectedText: 'Please Select Product Label',
        buttonClass: 'form-control',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        numberDisplayed: 2,
    });
    GetProductType();
});

var GetAllParentPRoject = function (Url, SuccessMethod, ProjectNoDataTemp) {
    //var ProjectNoDataTemp =
    //{
    //    cParentChildIndi: "P"
    //}
    $.ajax({
        url: Url,
        type: 'GET',
        data: { id: ProjectNoDataTemp.iUserId, projectno: ProjectNoDataTemp.vProjectNo, typecode: ProjectNoDataTemp.vProjectTypeCode },
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("Project Not Found !", "ddlProjectNo", ModuleName);
        }
    });
    function SuccessMethod(jsonData) {

        var strdata = "";
        //jsonData = jsonData.Table
        if (jsonData.length > 0) {
            var jsonObj = jsonData;
            var sourceArr = [];

            for (var i = 0; i < jsonObj.length; i++) {
                sourceArr.push("[ " + jsonObj[i].vStudyCode + " ]" + " " + jsonObj[i].vStudyName);
                workspaceId["[ " + jsonObj[i].vStudyCode + " ]" + " " + jsonObj[i].vStudyName] = jsonObj[i].nStudyNo;
            }
            $("#txtProjectNo").autocomplete({
                source: sourceArr,
                change: function (event, ui) {
                },
                select: function (event, ui) {
                    $('#txtProjectNo').blur();
                }
            });
        }

    }
}

$('#txtProjectNo').on('change keyup paste mouseup', function () {
    if ($('#txtProjectNo').val().length == 2) {

        var GetAllPmsProjectNo = {
            Url: BaseUrl + "PmsProductBatch/GetProjectNo_New",
            SuccessMethod: "SuccessMethod",
        }

        var ProjectNoDataTemp = {
            vProjectNo: $('#txtProjectNo').val(),
            iUserId: $("#hdnuserid").val(),
            vProjectTypeCode: $("#hdnscopevalues").val(),
        }
        GetAllParentPRoject(GetAllPmsProjectNo.Url, GetAllPmsProjectNo.SuccessMethod, ProjectNoDataTemp);
    }
    else if ($('#txtProjectNo').val().length < 2) {
        $("#txtProjectNo").autocomplete({
            source: "",
            change: function (event, ui) { }
        });
    }
});

$('#txtProjectNo').on('blur', function () {
    if ($('#txtProjectNo').val() != "") {
        if (workspaceId[$('#txtProjectNo').val()] == undefined) {
            ValidationAlertBox("Please Enter Proper Project !", "txtProjectNo", ModuleName);
            return false;
        }
        else {
            GetStudyType();
            GetProductType();
        }
    }
});

$('#ddlLablename').on('change', function () {
    $("#vLabelPrint").val($('#ddlLablename').val());
});

$('#ddlRandomizationno').on('change', function () {
    $("#vRandomizationNo").val($('#ddlRandomizationno').val())
})

$('#btnPrint').on("click", function () {
    if (isBlank(document.getElementById('txtProjectNo').value)) {
        ValidationAlertBox("Please Enter Project !", "txtProjectNo", ModuleName);
        return false;
    }
    else if (isBlank(document.getElementById('txtStudytype').value)) {
        ValidationAlertBox("Please Enter Study Type !", "txtStudytype", ModuleName);
        return false;
    }
    else if (Dropdown_Validation(document.getElementById("ddlProductKitIndi"))) {
        ValidationAlertBox("Please Select Product Indication !", "ddlProductKitIndi", ModuleName);
        return false;
    }
    else if (Dropdown_Validation(document.getElementById("ddlProductType"))) {
        ValidationAlertBox("Please Select Product Type !", "ddlProductType", ModuleName);
        return false;
    }
    if ($("#ddlProductKitIndi").val() == "K") {
        if (Dropdown_Validation(document.getElementById("ddlKitType"))) {
            ValidationAlertBox("Please Select Kit Type !", "ddlKitType", ModuleName);
            return false;
        }
        else if (isBlank(document.getElementById('ddlKitLabel').value)) {
            ValidationAlertBox("Please Select Kit Number !", "ddlKitLabel", ModuleName);
            return false;
        }
    }
    else if ($("#ddlProductKitIndi").val() == "P") {
        if (document.getElementById('ddlProductLabel').value == "") {
            ValidationAlertBox("Please Select Product Label Number !", "ddlProductLabel", ModuleName);
            return false;
        }
    }
    if (Dropdown_Validation(document.getElementById("ddltypeofLabel"))) {
        ValidationAlertBox("Please Select Label Name You Want To Print !", "ddltypeofLabel", ModuleName);
        return false;
    }
    //if (Dropdown_Validation(document.getElementById("ddlLablename"))) {
    //    ValidationAlertBox("Please Select Label Name You Want To Print!", "ddlLablename", ModuleName);
    //    return false;
    //}

    //if (isBlank(document.getElementById('txtnoofPrint').value)) {
    //    ValidationAlertBox("Please Enter No of Copy You Want To Print !", "txtnoofPrint", ModuleName);
    //    return false;
    //}
    SessionVariable();
    return true;
});

$('#ddlProductKitIndi').on("change", function () {
    if ($("#ddlProductKitIndi").val() == "P") {
        document.getElementById('divProductLabel').style.display = 'block';
        document.getElementById('divKitLabel').style.display = 'none';

        if ($("#ddlProductType").val() != "0") {
            GetProductLabel();
        }
    }
    else if ($("#ddlProductKitIndi").val() == "K") {
        document.getElementById('divProductLabel').style.display = 'none';
        document.getElementById('divKitLabel').style.display = 'block';

        if ($("#ddlProductType").val() != "0") {
            GetKitType();
        }
    }
    else {
        document.getElementById('divProductLabel').style.display = 'none';
        document.getElementById('divKitLabel').style.display = 'none';
    }
});

$('#ddlProductType').on("change", function () {

    $('#ddlKitLabel option').each(function () {
        $(this).remove();
    });
    $('#ddlKitLabel').multiselect('rebuild');

    $('#ddlProductLabel option').each(function () {
        $(this).remove();
    });
    $('#ddlProductLabel').multiselect('rebuild');

    if ($("#ddlProductKitIndi").val() == "P") {
        document.getElementById('divProductLabel').style.display = 'block';
        document.getElementById('divKitLabel').style.display = 'none';
        GetProductLabel();
    }
    else if ($("#ddlProductKitIndi").val() == "K") {
        document.getElementById('divProductLabel').style.display = 'none';
        document.getElementById('divKitLabel').style.display = 'block';
        GetKitType();
    }
    else {
        document.getElementById('divProductLabel').style.display = 'none';
        document.getElementById('divKitLabel').style.display = 'none';
    }
});

$('#ddlKitType').on('change', function () {

    $('#ddlKitLabel option').each(function () {
        $(this).remove();
    });
    $('#ddlKitLabel').multiselect('rebuild');

    if ($('#ddlKitType').val() != 0) {
        GetKit();
    }

});

function FillRandomizationNo() {
    var url = WebUrl + "LabelPrint/GetRandomizationData";
    $.ajax({
        url: url,
        type: 'GET',
        data: { id: WorkSpaceIDs[$('#DDLProjectNo').val()] },
        success: function (data) {
            if (data != "") {
                var jsonData = jQuery.parseJSON(data);
                if (jsonData.length > 0) {
                    $("#ddlRandomizationno").empty().append('<option selected="selected" value="0">Please Select Randomization No</option>');
                    for (var i = 0; i < jsonData.length; i++)
                        $("#ddlRandomizationno").append($("<option></option>").val(jsonData[i].vRandomizationNo).html(jsonData[i].vRandomizationNo));
                }
                else {
                    $("#ddlRandomizationno").empty().append('<option selected="selected" value="0">Please Select Randomization No</option>');
                }
            }
            else {
                $("#ddlRandomizationno").empty().append('<option selected="selected" value="0">Please Select Randomization No</option>');
            }
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Randomization Number Not Found !", ModuleName);
        }
    });
}

function GetStudyType() {
    var PostData = {
        WhereCondition_1: 'vWorkSpaceID = ' + workspaceId[$('#txtProjectNo').val()],
        columnName_1: "Distinct cRandomizationType"
    }
    $.ajax({
        url: BaseUrl + "PmsRecordFetch/ViewRandomizationDetailData",
        type: 'POST',
        data: PostData,
        success: function (jsonData) {
            if (jsonData.Table[0].cRandomizationType == "1") {
                $("#txtStudytype").val("Normal");
                StudyType = "1";
            }
            else if (jsonData.Table[0].cRandomizationType == "2") {
                $("#txtStudytype").val("Double Blinded");
                StudyType = "2"
            }
            
        },
        error: function () {
            SuccessorErrorMessageAlertBox("StudyType Not Found !", ModuleName);
        }
    });
}

function GetKitType() {
    var PostData = {
        WhereCondition_1: "vWorkSpaceID = '" + workspaceId[$('#txtProjectNo').val()] + "' and nProductTypeID = '" + $("#ddlProductType").val() + "'",
    }
    
    $.ajax({
        url: BaseUrl + "PmsRecordFetch/View_StudyProductKitTypeMst",
        type: 'POST',
        data: PostData,
        async: false,
        success: function (JsonData) {
            JsonData = JsonData.Table;
            $("#ddlKitType").empty().append('<option selected="selected" value="0">Please Select Kit Type</option>');
            for (var i = 0; i < JsonData.length; i++) {
                $("#ddlKitType").append($("<option></option>").val(JsonData[i].nKitTypeNo).html(JsonData[i].vKitTypeDesc));
            }
        },
        error: function () {
            ValidationAlertBox("Kit Type Data Is Not Found !", "ddlKitType", ModuleName);
        }
    });
}

function GetKit() {
    $('#ddlKitLabel .multiselect-container li').remove();

    var PostData = {
        WhereCondition_1: "vWorkSpaceID = '" + workspaceId[$('#txtProjectNo').val()] + "' and nKitTypeNo = '"+ $("#ddlKitType").val() +"'",
    }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/View_StudyProductKitCreationDtl",
        type: 'POST',
        data: PostData,
        success: function (jsonData) {
            jsonData = jsonData.Table;

            if (jsonData.length >= 0) {
                $('#ddlKitLabel').multiselect('rebuild');
            }

            $('#ddlKitLabel option').each(function () {
                $(this).remove();
            });

            for (var i = 0; i < jsonData.length; i++) {
                $("#ddlKitLabel").append($("<option></option>").val(jsonData[i].vKitNo).html(jsonData[i].vKitNo));
                $('#ddlKitLabel').multiselect('rebuild');
            }
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Kit Data Is Not Found !", ModuleName);
        }
    });
}

function GetProductLabel() {
    var PostData = {
        WhereCondition_1: "vWorkSpaceID = '" + workspaceId[$('#txtProjectNo').val()] + "' and nProductTypeID = '"+ $("#ddlProductType").val() +"'",
    }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/View_StudyProductLabelCreationDtl",
        type: 'POST',
        data: PostData,
        async: false,
        success: function (JsonData) {
            JsonData = JsonData.Table;

            if (JsonData.length >= 0) {
                $('#ddlProductLabel').multiselect('rebuild');
            }

            $('#ddlProductLabel option').each(function () {
                $(this).remove();
            });

            for (var i = 0; i < JsonData.length; i++) {
                $("#ddlProductLabel").append($("<option></option>").val(JsonData[i].vStudyProductLabelNo).html(JsonData[i].vStudyProductLabelNo));
                $('#ddlProductLabel').multiselect('rebuild');
            }
        },
        error: function () {
            ValidationAlertBox("Product Label Not Found !", "ddlProductLabel", ModuleName);
        }
    });
}

function ClearData() {
    $("#txtProjectNo").val("");
    $("#txtStudytype").val("");
    $("#ddlProductKitIndi").val("0");
    $("#ddlProductType").val("0");
    document.getElementById('divProductLabel').style.display = "none";
    document.getElementById('divKitLabel').style.display = "none";
    $("#ddltypeofLabel").val("0");
    $("#ddlKitType").val("0");
    $('#ddlKitLabel option').each(function () {
        $(this).remove();
    });
    $('#ddlKitLabel').multiselect('rebuild');

    $('#ddlProductLabel option').each(function () {
        $(this).remove();
    });
    $('#ddlProductLabel').multiselect('rebuild');
}

function ExitModule() {
    ConfirmAlertBox(ModuleName, $("#RedirectToHome").val());
}

function SessionVariable() {
    var vKitNo = "";
    var vStudyProductLabelNo = "";

    if ($("#ddlProductKitIndi").val() == "K") {
        vKitNo = $("#ddlKitLabel").val().toString();
    }
    else if ($("#ddlProductKitIndi").val() == "P") {
        vStudyProductLabelNo = $("#ddlProductLabel").val().toString();
    }

    var SessionData = {
        vWorkSpaceID: workspaceId[$('#txtProjectNo').val()],
        vKitNo: vKitNo,
        nKitTypeNo: $("#ddlKitType").val(),
        vLabelPrint: $("#ddltypeofLabel").val(),
        cTransferIndi: $("#ddlProductKitIndi").val(),
        vStudyProductLabelNo: vStudyProductLabelNo,
        vStudyType: StudyType,
    }

    $.ajax({
        url: WebUrl + "LabelPrint/SessionVariable",
        type: 'POST',
        async: false,
        data: SessionData,
        success: function (response) {
            return "true";
        },
        error: function () {
            return "false";
        }
    });
}

function GetProductType() {
    var GetProductType = {
        Url: BaseUrl + "PmsGeneral/GetProductType/" + workspaceId[$('#txtProjectNo').val()],
        SuccessMethod: "SuccessMethod"
    }

    $.ajax({
        url: GetProductType.Url,
        type: 'GET',
        async: false,
        success: function (jsonData) {
            $("#ddlProductType").empty().append('<option selected="selected" value="0">Please Select Product Type</option>');
            for (var i = 0; i < jsonData.length; i++) {
                $("#ddlProductType").append($("<option></option>").val(jsonData[i].nProductTypeID).html(jsonData[i].vProductType));
            }
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Product Type Not Found !", ModuleName);
        }
    });
}

function LabelPreview() {
    var labelvalue = $("#ddltypeofLabel").val();

    if (labelvalue == 0) {
        ValidationAlertBox("Please Select Type of Label !", "ddltypeofLabel", ModuleName);
        return false;
    }

    if (labelvalue == 1) {
        $("#alabelpreview").attr("href", "../Content/Images/Label1.png")
    }
    else if (labelvalue == 2) {
        $("#alabelpreview").attr("href", "../Content/Images/Label2.png")
    }
    else if (labelvalue == 3) {
        $("#alabelpreview").attr("href", "../Content/Images/Label3.png")
    }
    else if (labelvalue == 4) {
        $("#alabelpreview").attr("href", "../Content/Images/Label4.png")
    }
    else if (labelvalue == 5) {
        $("#alabelpreview").attr("href", "../Content/Images/Label5.png")
    }

    $("#alabelpreview").attr("target", "_blank")
}