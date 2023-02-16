var ModuleName = "Define Kit";
var workspaceIds = new Object();
var setWorkspaceId = "";
var kitdefine = {};
var kitdefine1 = [];
var KitTypeData;
var ControlBind = "";

$(document).ready(function () {
    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('.modal').modal('hide');

    // GetAllParentPRoject();
    var GetProjectNo = {
        Url: BaseUrl + "PmsGeneral/ProjectNumber",
        SuccessMethod: "SuccessMethod"
    }

    $('#ddlProjectNo').on('change keyup paste mouseup', function () {

        if ($('#ddlProjectNo').val().length == 2) {
            var ProjectNoDataTemp = {
                vWorkSpaceID: $('#ddlProjectNodashboard').val(),
                iUserId: $("#hdnuserid").val(),
                vProjectTypeCode: $("#hdnscopevalues").val(),
            }
            GetAllParentPRoject(GetProjectNo.Url, GetProjectNo.SuccessMethod, ProjectNoDataTemp);
        }
        else if ($('#ddlProjectNo').val().length < 2) {
            $("#ddlProjectNo").autocomplete({
                source: "",
                change: function (event, ui) { },
                select: function (event, ui) {
                    vProjectNo = ui.item.value;
                    setWorkspaceId = ui.item.value;
                    $('#ddlProjectNo').val(vProjectNo);
                    GetKitTypeDetail();
                    GetProductType();
                },
            });
        }
    });

    if (setWorkspaceId != "") { }
    GetKitTypeDetail();

    $('input:radio[name=optradio]').change(function () {
        $('#txtDosedQty').val("");
        $("#ddlApplicableForVisit").multiselect("clearSelection");
        $("#ddlApplicableForVisit").multiselect('refresh');

        if (this.id == 'rdRandomization') {
            TreatmentTypeControlBind();
            GetProductType();
            $('#txtDosedQty').prop('disabled', true);
        }
        else if (this.id == 'rdOther') {
            TreatmentTypeOtherControlBind();
            GetProductTypeforKitCreationOther();
            $('#txtDosedQty').prop('disabled', false);
        }
        TreatmentType();
    });

    $('#ddlApplicableForVisit').multiselect({
        nonSelectedText: 'Please Select Visit',
        buttonClass: 'form-control',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        numberDisplayed: 2,
    });
});

var GetAllParentPRoject = function (Url, SuccessMethod, ProjectNoDataTemp) {
    $.ajax({
        url: Url,
        type: 'POST',
        data: ProjectNoDataTemp,
        async: false,
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("Protocol No Not Found !", "ddlProjectNo", ModuleName);

        }
    });
    function SuccessMethod(jsonData) {
        var jsonObj = jsonData;
        var sourceArr = [];

        for (var i = 0; i < jsonObj.length; i++) {
            sourceArr.push("[ " + jsonObj[i].vStudyCode + " ]" + " " + jsonObj[i].vStudyName);
            workspaceIds["[ " + jsonObj[i].vStudyCode + " ]" + " " + jsonObj[i].vStudyName] = jsonObj[i].nStudyNo;
        }

        $("#ddlProjectNo").autocomplete({
            source: sourceArr,
            change: function (event, ui) {
            },
            select: function (event, ui) {
                GetKitTypeDetail();
                GetProductType();
            }
        });

    }
}


//$('#ddlProjectNo').on('blur', function () {
//    GetKitTypeDetail();
//    GetProductType();
//})

var GetAllParentPRoject_old = function () {
    var ProjectNoDataTemp =
    {
        cParentChildIndi: "P"
    }
    $.ajax({
        url: BaseUrl + "PmsRecordFetch/AllParentProject",
        type: 'POST',
        data: ProjectNoDataTemp,
        success: function (jsonData) {
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
        },
        error: function () {
            ValidationAlertBox("Project Not Found !", "ddlProjectNo", ModuleName);
        }
    });
}

$("#btnExitPmsKitDefine").on("click", function () {
    $('#ddlProjectNo').prop('disabled', false);
    ConfirmAlertBox(ModuleName);
});

function clearData() {
    $('#ddlProductType').val(0).attr("selected", "selected");
    $('#ddlTreatmentType').val(0).attr("selected", "selected");
    $("#txtDosedQty").val("");
    $('#tblKitDefineTemp tbody').text('');
    $('#tblKitDefineTemp').hide();
    $('#btnSavePmsKitDefine').hide();
    $("#ddlApplicableForVisit").multiselect("clearSelection");
    $("#ddlApplicableForVisit").multiselect('refresh');
    $('#rdRandomization').prop('checked', true);
    $('#optradio').prop('checked', false);
    TreatmentTypeControlBind();
    GetProductType();
    $('#txtDosedQty').prop('disabled', true);
    TreatmentType();
}

function AddKitDefine() {
    if (StudySetupCount() == false) {
        ValidationAlertBox("Without define Study Setup, You Can Not Create Kit Type !")
        return false;
    }

    if (isBlank(document.getElementById('ddlProjectNo').value)) {
        ValidationAlertBox("Please Enter Project No !", "ddlProjectNo", ModuleName);
        return false;
    }

    $('#rdRandomization').prop('checked', true);
    $('#optradio').prop('checked', false);

    if ($('#rdRandomization').is(':checked') == true) {
        TreatmentTypeControlBind()
        GetProductType();
        $('#txtDosedQty').prop('disabled', true);
    }
    else if ($('#rdOther').is(':checked') == true) {
        TreatmentTypeOtherControlBind()
        GetProductTypeforKitCreationOther();
        $('#txtDosedQty').prop('disabled', false);
    }

    TreatmentType();
    jQuery("#titleMode").text('Mode:-Add');
    $("#txtProjectNo").val($("#ddlProjectNo").val());
    clearData();
    GetVisit();
    
    $('#KitDefineModel').modal('show');
}

function AddTempData() {
    if (validateform() != false) {
        if (CheckRecordExist()) {
            return false;
        }
        $("#tblKitDefineTemp").show();
        var strdata = "";
        strdata += "<tr>";
        strdata += "<td>" + ($('#ddlProjectNo').val().split("[").pop().split(']')[0].trim()).replace('-', '') + $("#ddlProductType :selected").text() + '-' + padLeft(parseInt($("#txtDosedQty").val()), 3) + "</td>";

        strdata += "<td>" + $("#ddlTreatmentType :selected").text() + "</td>";
        strdata += "<td>" + $("#ddlProductType :selected").text() + "</td>";

        
        strdata += "<td>" + $("#txtDosedQty").val() + "</td>";
        strdata += "<td>" + $("#ddlApplicableForVisit").val() + "</td>";
        strdata += "<td class='hidetd'>" + setWorkspaceId + "</td>";

        if ($('#rdRandomization').is(':checked') == true) {
            strdata += "<td class='hidetd'>" + $("#ddlProductType :selected").val() + "</td>";
            strdata += "<td class='hidetd'>" + $("#ddlTreatmentType :selected").val() + "</td>";
        }
        else if ($('#rdOther').is(':checked') == true) {
            strdata += "<td class='hidetd'>" + $("#ddlProductType :selected").val() + "</td>";
            strdata += "<td class='hidetd'>" + $("#ddlTreatmentType :selected").val() + "</td>";
        }
        strdata += "<td id='trRemove'><span class='glyphicon glyphicon-remove'></span></td>";
        strdata += "</tr>";

        $("#tblKitDefineTemp").append(strdata);
        $("#btnSavePmsKitDefine").show();
        $(".hidetd").hide();

        $('#ddlProductType').val(0).attr("selected", "selected");
        $("#txtDosedQty").val("");
        $('#ddlTreatmentType').val(0).attr("selected", "selected");
        $("#ddlApplicableForVisit").multiselect("clearSelection");
        $("#ddlApplicableForVisit").multiselect('refresh');

    }
}

$("#tblKitDefineTemp").on('click', '#trRemove', function () {
    $(this).closest('tr').remove();

    if ($("#tblKitDefineTemp tbody tr").length != 0) {
        $("#tblKitDefineTemp").show();
        $("#btnSavePmsKitDefine").show();
    }
    else {
        $("#tblKitDefineTemp").hide();
        $('#btnSavePmsKitDefine').hide();
    }
});

function GetProductType() {
    var GetProductType = {
        Url: BaseUrl + "PmsGeneral/GetProductType/" + setWorkspaceId,
        SuccessMethod: "SuccessMethod"
    }

    var FilterData = {
        vLocationCode: $("#hdnUserLocationCode").val()
    }

    $.ajax({
        url: GetProductType.Url,
        type: 'GET',
        success: function (jsonData) {
            $("#ddlProductType").empty().append('<option selected="selected" value="0">Please Select Product Type</option>');
            for (var i = 0; i < jsonData.length; i++) {
                $("#ddlProductType").append($("<option></option>").val(jsonData[i].nProductTypeID).html(jsonData[i].vProductType));
            }
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Product Type Not Found !", ModuleName);
            return false;
        },
        async:false,
    });
}

function CheckRecordExist() {
    GetKitTypeDetail();
    var jsonData = KitTypeData;

    if ($('#rdRandomization').is(':checked') == true) {
        for (i = 0; i < $("#ddlApplicableForVisit").val().length; i++)
        {
            var ddlapplicableforvisit = $("#ddlApplicableForVisit").val()[i]
            for (var j = 0; j < jsonData.length; j++) {
                var ApplicableForVisit = jsonData[j].vApplicableVisit
                if (ApplicableForVisit.indexOf(ddlapplicableforvisit) != -1 && jsonData[j].vTreatmentType == $("#ddlTreatmentType :selected").val()) {
                    ValidationAlertBox("Kit Type For " + ddlapplicableforvisit + " Already Exist in Database !", "ddlProductType", ModuleName);
                    return true;
                    break;
                }
            }
        }
    }
    else if ($('#rdOther').is(':checked') == true) {
        if ($("#ddlApplicableForVisit").val() != null) {
            for (i = 0; i < $("#ddlApplicableForVisit").val().length; i++) {
                var ddlapplicableforvisit = $("#ddlApplicableForVisit").val()[i]
                for (var j = 0; j < jsonData.length; j++) {
                    var ApplicableForVisit = jsonData[j].vApplicableVisit;
                    if (ApplicableForVisit.indexOf(ddlapplicableforvisit) != -1 && $("#ddlProductType :selected").val() == jsonData[j].nProductTypeID && $("#ddlTreatmentType :selected").val() == jsonData[j].vTreatmentType && $("#txtDosedQty").val() == jsonData[j].iDoseQty) {
                        ValidationAlertBox("Kit Type For " + ddlapplicableforvisit + " Already Exist in Database !", "ddlProductType", ModuleName);
                        return true;
                        break;
                    }
                }
            }
        }
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
    var TableData = HTMLtbl.getData($('#tblKitDefineTemp'));
    if (TableData != undefined)
    {
        for (i = 0; i < TableData.length; i++)
        {
            if (TableData[i][6] == $("#ddlProductType :selected").val() && parseInt(TableData[i][3]) == parseInt($("#txtDosedQty").val()))
            {
                ValidationAlertBox("This Record Exist in Below Table !", "ddlProductType", ModuleName);
                return true;
            }
        }
    }
    return false;
}

$('#btnSavePmsKitDefine').on('click', function () {
    //if (CheckRecordExist()) {
    //    return false;
    //}
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
    var TableData = HTMLtbl.getData($('#tblKitDefineTemp'));
    var KitTypeData1 = [];
    for (i = 0; i < TableData.length; i++)
    {
        KitTypeData1.push({
            nProductTypeNo: TableData[i][6],
            vWorkSpaceId: TableData[i][5],
            iDoseQty: TableData[i][3],
            vKitTypeDesc: TableData[i][0],
            iModifyBy: $("#hdnuserid").val(),
            vApplicableVisit: TableData[i][4],
            vTreatmentType: TableData[i][1],
        });
    }

    $.ajax({
        url: BaseUrl + "PmsRecordSave/Save_KitType",
        type: 'POST',
        data: { '': KitTypeData1 },
        async:false,
        success: function (response) {
            SuccessorErrorMessageAlertBox("Record Saved Successfully !", ModuleName);
            GetKitTypeDetail();
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Error To Save Data in Kit Type !", ModuleName);
        }
    });
});

function GetKitTypeDetail() {
    if (workspaceIds[$('#ddlProjectNo').val()] != undefined) {
        setWorkspaceId = workspaceIds[$('#ddlProjectNo').val()];
    }
    if (setWorkspaceId == "") {
        return false;
    }
    var PostData = {
        WhereCondition_1: 'vWorkSpaceId = ' + setWorkspaceId + ' Order By iDoseQty'
    }
    $.ajax({
        url: BaseUrl + "PmsRecordFetch/View_StudyProductKitTypeMst",
        type: 'POST',
        data: PostData,
        success: SuccessMethod,
        async:false,
        error: function () {
            SuccessorErrorMessageAlertBox("Kit Type Data Is Not Found !", ModuleName);
        }
    });

    function SuccessMethod(jsonKitTypeData) {

        var ActivityDataset = [];
        KitTypeData = "";
        KitTypeData = jsonKitTypeData.Table;
        var jsonData = jsonKitTypeData.Table;
        for (var i = 0; i < jsonData.length; i++) {
            var InDataset = [];
            var InActive_c;
            InDataset.push(jsonData[i].vKitTypeDesc, jsonData[i].vTreatmentType, jsonData[i].vProductType, jsonData[i].iDoseQty,
                           jsonData[i].vApplicableVisit, jsonData[i].vModifyBy, jsonData[i].dModifyOn);
            ActivityDataset.push(InDataset);
        }
        otable = $('#tblKitDefineData').dataTable({
            "bJQueryUI": true,
            "sPaginationType": "full_numbers",
            "bLengthChange": true,
            "bProcessing": true,
            "bSort": true,
            "autoWidth": false,
            "aaData": ActivityDataset,
            "bInfo": true,
            "bDestroy": true,
            "aaSorting": [],
            "aoColumns": [
                { "sTitle": "Kit Description" },
                { "sTitle": "Treatment Type" },
                { "sTitle": "Kit Type" },
                { "sTitle": "Dose Qty" },
                { "sTitle": "Applicable Visit" },
                { "sTitle": "Created By" },
                { "sTitle": "Created On" },
                
            ],
            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },
        });
    }
}

function validateform()
{
    if ($('#rdRandomization').is(':checked') == true) {
        if (Dropdown_Validation(document.getElementById("ddlTreatmentType"))) {
            ValidationAlertBox("Please Select Treatment Type !", "ddlTreatmentType", ModuleName);
            return false;
        }
        if (Dropdown_Validation(document.getElementById("ddlProductType"))) {
            ValidationAlertBox("Please Select Product Type !", "ddlProductType", ModuleName);
            return false;
        }

    }
    else if ($('#rdOther').is(':checked') == true) {
        if (Dropdown_Validation(document.getElementById("ddlProductType"))) {
            ValidationAlertBox("Please Select Product Type !", "ddlProductType", ModuleName);
            return false;
        }

        if (Dropdown_Validation(document.getElementById("ddlTreatmentType"))) {
            ValidationAlertBox("Please Select Treatment Type !", "ddlTreatmentType", ModuleName);
            return false;
        }
    }

    if (isBlank(document.getElementById('txtDosedQty').value)) {
        ValidationAlertBox("Please Enter Dosed Quantity !", "txtDosedQty", ModuleName);
        return false;
    }
    if ((document.getElementById('txtDosedQty').value).trim() == "0" || parseInt(document.getElementById('txtDosedQty').value) > 999  ) {
        ValidationAlertBox("Please Enter Valid Dosed Quantity !", "txtDosedQty", ModuleName);
        return false;
    }

    if ($('#ddlApplicableForVisit').val() == null) {
        ValidationAlertBox("Please Select At Least One Visit !", "ddlApplicableForVisit", ModuleName);
        return false;
    }
}

function GetVisit() {
    $('#ddlApplicableForVisit option').each(function () {
        $(this).remove();
    });
    if (workspaceIds[$('#ddlProjectNo').val()] != undefined) {
        setWorkspaceId = workspaceIds[$('#ddlProjectNo').val()];
    }
    if (setWorkspaceId == "" || setWorkspaceId == undefined) {
        return false;
    }

    var PostData = {
        WhereCondition_1: "vWorkSpaceId = '" + setWorkspaceId + "' and cStatusIndi <> 'D'",
        columnName_1: 'Distinct vApplicableVisit',
    }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/ViewRandomizationDetailData",
        type: 'POST',
        data: PostData,
        success: function (jsonData) {
            jsonData = jsonData.Table;

            if (jsonData.length > 0) {
                for (var i = 0; i < jsonData.length; i++) {
                    $("#ddlApplicableForVisit").append($("<option></option>").val(jsonData[i].vApplicableVisit).html(jsonData[i].vApplicableVisit));
                    $('#ddlApplicableForVisit').multiselect('rebuild');
                }
            }
        },
        async: false,
        error: function () {
            SuccessorErrorMessageAlertBox("Period Not Found !", ModuleName);
        }
    });
}

$('#ddlProductType').on('change', function () {
    GetDosedQty();
});

function GetDosedQty() {
    var PostData = {
        WhereCondition_1: 'vWorkSpaceId = ' + setWorkspaceId + ' and nProductTypeID = ' + $("#ddlProductType").val() + '',
        columnName_1: 'Top 1 ISNULL(iQty,0) as [Qty]',
    }
    $.ajax({
        url: BaseUrl + "PmsRecordFetch/View_TreatmentTypeMapping",
        type: 'POST',
        data: PostData,
        success: SuccessMethod,
        async:false,
        error: function () {
            SuccessorErrorMessageAlertBox("Quantity Not Found !", ModuleName);
        }
    });

    function SuccessMethod(JsonData) {
        JsonData = JsonData.Table;
        if (JsonData.length > 0) {
            var qty = JsonData[0].Qty;

            if (qty == 0) {
                ValidationAlertBox("Quantity is Not Valid", "ddlProjectNo", ModuleName);
                $('#btnAddTempKitDefine').prop('disabled', true);
            }
            else {
                $("#txtDosedQty").val(qty);
                $('#btnAddTempKitDefine').prop('disabled', false);
            }
        }
        else {
            ValidationAlertBox("Quantity Not Found ! </br> First Define Quantity in TreatmentType Mapping !", "ddlProjectNo", ModuleName);
            $('#btnAddTempKitDefine').prop('disabled', true);
            $("#txtDosedQty").val("");
        }
    }
}

function TreatmentTypeControlBind() {
    ControlBind = "";
    $("#treatmenttypediv").html("");
    ControlBind += "<div class='col-sm-4 form-group'>";
    ControlBind += "<div class='col-sm-12'>";
    ControlBind += "<label>Treatment Type *</label></div>";
    ControlBind += "<div class='col-sm-12'>";
    ControlBind += "<select class='form-control' id='ddlTreatmentType' style='height: 26px;padding:2px 6px;' onchange='ProductandQty()'></select>";
    ControlBind += "</div></div>";
    ControlBind += "<div class='col-sm-4 form-group'>";
    ControlBind += "<div class='col-sm-12'>";
    ControlBind += "<label>Product Type *</label></div>";
    ControlBind += "<div class='col-sm-12'>";
    ControlBind += "<select class='form-control' id='ddlProductType' style='height: 26px;padding:2px 6px;' disabled></select>";
    ControlBind += "</div></div>";
    $("#treatmenttypediv").append(ControlBind);
}

function TreatmentTypeOtherControlBind() {
    ControlBind = "";
    $("#treatmenttypediv").html("");
    ControlBind += "<div class='col-sm-4 form-group'>";
    ControlBind += "<div class='col-sm-12'>";
    ControlBind += "<label>Product Type *</label></div>";
    ControlBind += "<div class='col-sm-12'>";
    ControlBind += "<select class='form-control' id='ddlProductType' style='height: 26px;padding:2px 6px;'></select>";
    ControlBind += "</div></div>";
    ControlBind += "<div class='col-sm-4 form-group'>";
    ControlBind += "<div class='col-sm-12'>";
    ControlBind += "<label>Treatment Type *</label></div>";
    ControlBind += "<div class='col-sm-12'>";
    ControlBind += "<select class='form-control' id='ddlTreatmentType' style='height: 26px;padding:2px 6px;'></select>";
    ControlBind += "</div></div>";

    $("#treatmenttypediv").append(ControlBind);
}

function TreatmentType() {
    var PostData = {
        WhereCondition_1: 'vWorkSpaceId = ' + setWorkspaceId + '',
        columnname_1: "distinct vFormulationType"
    }
    $.ajax({
        url: BaseUrl + "PmsRecordFetch/ViewRandomizationDetailData",
        type: 'POST',
        data: PostData,
        success: SuccessMethod,
        async:false,
        error: function () {
            SuccessorErrorMessageAlertBox("Kit Type Data Is Not Found !", ModuleName);
        }
    });

    function SuccessMethod(jsonData)
    {
        jsonData = jsonData.Table;
        $("#ddlTreatmentType").empty().append('<option selected="selected" value="0">Please Select Treatment Type</option>');
        for (var i = 0; i < jsonData.length; i++) {
            $("#ddlTreatmentType").append($("<option></option>").val(jsonData[i].vFormulationType).html(jsonData[i].vFormulationType));
        }
    }
}

function ProductandQty() {
    var PostData = {
        WhereCondition_1: "vWorkSpaceId = '" + setWorkspaceId + "' and vFormulationType = '" + $("#ddlTreatmentType").val() + "'",
        columnName_1: 'Top 1 ISNULL(iQty,0) as [Qty],nProductTypeID',
    }
    $.ajax({
        url: BaseUrl + "PmsRecordFetch/View_TreatmentTypeMapping",
        type: 'POST',
        data: PostData,
        success: SuccessMethod,
        async: false,
        error: function () {
            SuccessorErrorMessageAlertBox("Quantity Not Found !", ModuleName);
        }
    });

    function SuccessMethod(JsonData)
    {
        JsonData = JsonData.Table;
        if (JsonData.length > 0)
        {
            var qty = JsonData[0].Qty;

            if (qty == 0) {
                ValidationAlertBox("Quantity is Not Valid", "ddlProjectNo", ModuleName);
                $('#btnAddTempKitDefine').prop('disabled', true);
                $('#ddlProductType').prop('disabled', true);
            }
            else {
                $("#txtDosedQty").val(qty);
                $('#btnAddTempKitDefine').prop('disabled', false);
                $("#ddlProductType").val(JsonData[0].nProductTypeID);
                $('#ddlProductType').prop('disabled', true);
            }
        }
        else {
            ValidationAlertBox("Quantity Not Found ! </br> First Define Quantity in TreatmentType Mapping !", "ddlProjectNo", ModuleName);
            $('#btnAddTempKitDefine').prop('disabled', true);
            $("#txtDosedQty").val("");
            $("#ddlProductType").val(0);
        }
    }
}

function GetProductTypeforKitCreationOther() {
    $.ajax({
        url: BaseUrl + "PmsRecordFetch/GetProductTypeforKitCreationOther/" + setWorkspaceId + "",
        type: 'GET',
        success: function (jsonData) {
            if (jsonData.length > 0) {
                for (var i = 0; i < jsonData.length; i++) {
                    $("#ddlProductType").empty().append('<option selected="selected" value="0">Please Select Product Type</option>');
                    for (var i = 0; i < jsonData.length; i++) {
                        $("#ddlProductType").append($("<option></option>").val(jsonData[i].nProductTYpeID).html(jsonData[i].vProductType));
                    }
                }
            }
        },
        async: false,
        error: function () {
            SuccessorErrorMessageAlertBox("Product Type Not Found !", ModuleName);
        }
    });
}

function StudySetupCount() {
    var result = true;
    var PostData = {
        vWorkSpaceID: setWorkspaceId,
    }

    if (setWorkspaceId != "") {
        $.ajax({
            url: BaseUrl + "PmsRecordFetch/Proc_GetStudyProductDesignMst",
            type: 'POST',
            data: PostData,
            async: false,
            success: function (jsonData)
            {
                if (jsonData.length == 0)
                {
                    result = false;
                }
            }
        });
    }
    return result;
}
