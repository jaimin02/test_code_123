var productIds = new Object();
var viewmode;
var ModuleName = "Study Product"
var setworkspaceid = "";
var vProjectNo = "";
var locationForAudit = "";
var isDisabled = "";

$(function () {
    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('.modal').modal('hide');

    $("#divexport").hide();

    iUserNo = $("#hdnuserid").val();
    GetProductForm();
    $("#spnwelcome").html($("#hdnusername").val());
    $("#spnLoginTime").html($("#hdnlogintime").val());


    $('#datepicker1').datetimepicker({ format: 'DD-MMMM-YYYY', maxDate: new Date(), });
    $('#datepicker2').datetimepicker({ format: 'DD-MMMM-YYYY', maxDate: new Date(), });
    GetViewMode();
    GetSponsorName();

    $('#DDLPrdctForm').on('change keyup paste mouseup', function () {
        if ($('#DDLPrdctForm').val().length == 2) {
            GetProductForm();
        }
        else if ($('#DDLPrdctForm').val().length < 2) {
            $("#DDLPrdctForm").autocomplete({
                source: "",
                change: function (event, ui) { },

            });
        }

    });

    var GetAllPmsProjectNo = {
        Url: BaseUrl + "PmsGeneral/GetScopeWiseProject",
        SuccessMethod: "SuccessMethod",

    }
    $('#DDLProjectNoList').on('change keyup paste mouseup', function () {
        if ($('#DDLProjectNoList').val().length == 2) {
            var ProjectNoDataTemp = {
                //vProjectNo: $('#DDLProjectNoList').val(),
                iUserId: $("#hdnuserid").val(),
                vStudyCode: $('#DDLProjectNoList').val()
                //vProjectTypeCode: $("#hdnscopevalues").val(),
            }
            GetAllPmsProjectNoData(GetAllPmsProjectNo.Url, GetAllPmsProjectNo.SuccessMethod, ProjectNoDataTemp);
        }
        else if ($('#DDLProjectNoList').val().length < 2) {
            $("#DDLProjectNoList").autocomplete({
                source: "",
                change: function (event, ui) { },
                select: function (event, ui) {
                    vProjectNo = ui.item.value;
                    $('#DDLProjectNoList').val(vProjectNo);
                    BindData();
                    var charindi = "N"
                    GetTransferProductDetails(charindi);
                },
            });

        }
    });

    $('#DDLProjectNo').on('change keyup paste mouseup', function () {
        if ($('#DDLProjectNo').val().length == 2) {
            var ProjectNoDataTemp = {
                vProjectNo: $('#DDLProjectNo').val(),
                iUserId: $("#hdnuserid").val(),
                vProjectTypeCode: $("#hdnscopevalues").val(),
            }
            GetAllPmsProjectNoData(GetAllPmsProjectNo.Url, GetAllPmsProjectNo.SuccessMethod, ProjectNoDataTemp);
        }
        else if ($('#DDLProjectNo').val().length < 2) {
            $("#DDLProjectNo").autocomplete({
                source: "",
                change: function (event, ui) { },
                select: function (event, ui) {
                    vProjectNo = ui.item.value;
                    $('#DDLProjectNoList').val(vProjectNo);
                    BindData();
                    var charindi = "N"
                    GetTransferProductDetails(charindi);
                },
            });
        }
    });



    CheckSetProject();
    if (setworkspaceid != "") {
        BindData();
    }

});

$("#DDLProjectNoList").on("blur", function () {
    BindData();
    var charindi = "N"
    GetTransferProductDetails(charindi);
});

$("#ProductTransferDetails").on("click", function () {
    var charindi = "Y";
    GetTransferProductDetailsNew(charindi);
});

$("#btnAddStudyProductData").on("click", function () {
    jQuery("#spnPmsStudyProduct").text('Save');
    $("#btnaddPmsStudyProduct").attr("style", "display:inline");
    $("#btnClearPmsStudyProduct").attr("style", "display:inline");
    $('.form-control').each(function () {
        $(this).attr('disabled', false);
    });

    if (isBlank(document.getElementById('DDLProjectNoList').value)) {
        SuccessorErrorMessageAlertBox("Please enter Project No.", ModuleName);

        return false;
    }

    var btntext = (document.getElementById("spnPmsStudyProduct").innerText).toLowerCase().trim()
    if (btntext == "save") {
        SaveAttribute();
    }
    else if (btntext == "update") {
        EditAttribute();
    }

    $('.AuditControl').each(function () { this.style.display = "none"; });
    var rowLength = $("#tblPmsStudyProduct > tbody").children.length;
    var oCells;

    var DataNotFound = $('#tblPmsStudyProduct').find('tr').find('td').text();
    if (DataNotFound == "No Record Found" || DataNotFound == "No data available in table") {
        rowLength = rowLength - 1;
    }

    GetProductType('Yes');
    GetApprovalDate();
});

$("#btnClearPmsStudyProduct").on("click", function () {
    ClearTextBox();
});

$("#btnExitPmsStudyProduct").on("click", function () {
    $('#DDLProjectNoList').prop('disabled', false);
    ConfirmAlertBox(ModuleName);

});

$("#btnaddPmsStudyProduct").on("click", function () {
    var btntext = (document.getElementById("spnPmsStudyProduct").innerText).toLowerCase().trim()
    if (btntext == "save") {
        var InsertPMSStudyProductData = {
            WorkspaceId: setworkspaceid,
            PrdctKitIndication: $("#DDLPrdctKitIndi").val(),
            PrdctType: $("#ddlProductType").val(),
            PrdctName: $("#PrdctKitName").val(),
            PrdctForm: $("#DDLPrdctForm").val(),
            PrdctBrandName: $("#PrdctBrandName").val(),
            ActiveIngrdient: $("#ActiveIngrdient").val(),
            PrdctStrength: $("#PrdctStrength").val(),
            PrdctMinTemp: $("#PrdctMinTemp").val(),
            PrdctMaxTemp: $("#PrdctMaxTemp").val(),
            PrdctMinHumidity: $("#PrdctMinHumidity").val(),
            PrdctMaxHumidity: $("#PrdctMaxHumidity").val(),
            IECApprovalDate: $("#datepicker1").val(),
            TlDate: $("#datepicker2").val(),
            Submission: $("#Submission").val(),
            Remark: $("#txtRemarks").val(),
            ModifyBy: $("#hdnuserid").val(),
            //cSaveContinueFlag: "S",
            ProductNo: $("#ProductNo").val(),
            vStorageCondition: $("#txtStorageCondition").val(),
            vClientCode: $("#ddlSponsorName").val(),
        }

        var InsertStudyProductData = {
            Url: BaseUrl + "PmsStudyProduct/InsertDataStudyProduct",
            SuccessMethod: "SuccessMethod",
            Data: InsertPMSStudyProductData
        }
        if (ValidateForm()) {
            InsertStudyProductDataMaster(InsertStudyProductData.Url, InsertStudyProductData.SuccessMethod, InsertStudyProductData.Data);
            //BindGridView();
        }
    }
    if (btntext == "update") {
        var EditPMSStudyProductData = {
            ProductNo: $("#ProductNo").val(),
            WorkspaceId: $("#hdnworkspaceid").val(),
            PrdctKitIndication: $("#DDLPrdctKitIndi").val(),
            PrdctType: $("#ddlProductType").val(),
            PrdctName: $("#PrdctKitName").val(),
            PrdctForm: $("#DDLPrdctForm").val(),
            PrdctBrandName: $("#PrdctBrandName").val(),
            ActiveIngrdient: $("#ActiveIngrdient").val(),
            PrdctStrength: $("#PrdctStrength").val(),
            PrdctMinTemp: $("#PrdctMinTemp").val(),
            PrdctMaxTemp: $("#PrdctMaxTemp").val(),
            PrdctMinHumidity: $("#PrdctMinHumidity").val(),
            PrdctMaxHumidity: $("#PrdctMaxHumidity").val(),
            IECApprovalDate: $("#datepicker1").val(),
            dRetentionDate: $("#Retentiondate").val(),
            RetentionPeriod: $("#RetentionPeriod").val(),
            TlDate: $("#datepicker2").val(),
            Submission: $("#Submission").val(),
            Remark: $("#txtRemarks").val(),
            ModifyBy: $("#hdnuserid").val(),
            //cSaveContinueFlag: "S",
            vStorageCondition: $("#txtStorageCondition").val(),
            vClientCode: $("#ddlSponsorName").val(),
        }

        var EditStudyProductData = {
            Url: BaseUrl + "PmsStudyProduct/EditDataStudyProduct",
            SuccessMethod: "SuccessMethod",
            Data: EditPMSStudyProductData
        }
        if (ValidateForm()) {
            EditStudyProductDataMaster(EditStudyProductData.Url, EditStudyProductData.SuccessMethod, EditStudyProductData.Data);
            BindGridView();
        }
    }
});

$("#ddlProductType").on("change", function () {
    var btntext = (document.getElementById("spnPmsStudyProduct").innerText).toLowerCase().trim()
    if (btntext == "save") {
        GetProductDataFromTransfer();
    }

    var PrdctName = $("#PrdctKitName").val().trim();
    var PrdctType = $("#ddlProductType option:selected").text().trim();
    var oTable = $('#tblPmsStudyProduct').dataTable();
    var i;
    var rowLength = oTable.fnGetData().length;
    var oCells;

    var DataNotFound = $('#tblPmsStudyProduct').find('tr').find('td').text();
    if (DataNotFound == "No Record Found") {
        rowLength = rowLength - 1;
    }
    if (rowLength > 0) {
        for (i = 1; i <= rowLength; i++) {

            if (PrdctName.toUpperCase().trim() == otable.fnGetData(i - 1)[3].toUpperCase().trim()) {
                if (PrdctType.toUpperCase().trim() == otable.fnGetData(i - 1)[2].toUpperCase().trim()) {
                    $('#ddlProductType').val(0);
                    ValidationAlertBox("This Product Type already exists.", "ddlProductType", ModuleName);
                    return false;
                    break;
                }
            }
        }
    }
});

//------------------------GetAllStuydyProductData In Grid---------------------------------------------
var GetAllStudyProductDataMaster = function (Url, SuccessMethod, setworkspaceid) {

    // For Server use

    $.ajax({
        type: "GET",
        url: BaseUrl + "PmsStudyProduct/GetAllStudyProductData",
        data: { id: setworkspaceid },
        //contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Data not found.", ModuleName);
        }
    });


    function SuccessMethod(jsonData) {
        var strdata = "";
        var UserTypeCode = "";

        var Edit_c;
        if (jsonData.length > 0) {
            $("#divexport").show();
        }
        else {
            $("#divexport").hide();
        }
        var ActivityDataset = [];
        UserTypeCode = $("#hdnUserTypeCode").val();

        for (var i = 0; i < jsonData.length; i++) {
            $("#hdnworkspaceid").css("visibility", "visible");
            var InDataset = [];

            if (viewmode == "OnlyView") {
                Edit_c = '<a data-tooltip="tooltip" title="Edit" class="disabled"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a>'
            }
            else {

                if ($("#hdnUserProfile").val().includes(UserTypeCode)) {
                    Edit_c = '<a data-tooltip="tooltip" title="Edit" class="disabled"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a>'
                }
                else {
                    Edit_c = '<a data-toggle="modal" data-tooltip="tooltip" title="Edit" data-target="#StudyProduct" attrid="' + jsonData[i].ProductNO + '" class="btnedit" Onclick=pmsStudyProductEditData("' + jsonData[i].ProductNo + '") style="cursor:pointer;"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a>'
                }
            }

            InDataset.push(jsonData[i].ProductNo, jsonData[i].ProjectNo, jsonData[i].ProductType, jsonData[i].ProductName, jsonData[i].ProductKitIndication, jsonData[i].ProductForm, jsonData[i].ActiveIngradient, jsonData[i].ProductStrength, Edit_c, '');
            ActivityDataset.push(InDataset);
        }

        otable = $('#tblPmsStudyProduct').dataTable({
            "bJQueryUI": true,
            "sPaginationType": "full_numbers",
            "bLengthChange": true,
            "iDisplayLength": 10,
            "bProcessing": true,
            "bSort": true,
            "autoWidth": false,
            "aaData": ActivityDataset,
            "bInfo": true,
            "bAutoWidth": false,
            "bDestroy": true,
            //"sScrollY": "200px",
            "sScrollX": "100%",
            "sScrollXInner": "1260" /* It varies dynamically if number of columns increases */,
            "fnCreatedRow": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $('td:eq(8)', nRow).append('<a data-toggle="modal" data-tooltip="tooltip" title="Audit Trail" data-target="#StudyProduct" attrid="' + aData[0] + '" class="btnedit" Onclick=pmsStudyProductAuditTrail("' + aData[0] + '") style="cursor:pointer;"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-file-text-o"></i><span>Audit</span></a>');
            },
            "columnDefs": [
                {
                    "targets": [0],
                    "visible": false,
                    "searchable": false
                },
                { "bSortable": false, "targets": [8, 9] },
                { "width": "2%", "targets": 1 },
                { "width": "5%", "targets": 2 },
                { "width": "5%", "targets": 3 },
                { "width": "7%", "targets": 4 },
                { "width": "7%", "targets": 5 },
                { "width": "7%", "targets": 6 },
                { "width": "1%", "targets": 7 },
                { "width": "1%", "targets": 8 },
                { "width": "2%", "targets": 9 }
            ],
            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },
        });
    }
}


//------------------------Insert_Update Data In Study Product------------------------------------------

var InsertStudyProductDataMaster = function (Url, SuccessMethod, Data) {
    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        async: false,
        success: SuccessInsertData,
        error: function () {
            SuccessorErrorMessageAlertBox("Error found at insert.", ModuleName);

        }
    });

    function SuccessInsertData(response) {
        BindGridView();
        $("#Div_ProductNo").css("display", "none");
        ClearTextBox();
        $("#tblPmsStudyProduct").dataTable().fnDraw();
        SuccessorErrorMessageAlertBox(response, ModuleName);


    }
}

var GetAllProjectNoMaster = function (Url, SuccessMethod) {

    $.ajax({
        url: Url,
        type: 'GET',
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Project not found.", ModuleName);

        }
    });

    function SuccessMethod(jsonData) {
        $("#DDLProjectNo").empty().append('<option selected="selected" value="0">Please select</option>');
        $.each(jsonData, function (i, items) {
            $("#DDLProjectNo").append($("<option></option>").val(this['IProjectCode']).html(this['vProjectNo']));
        });
    }
}

function ValidateForm() {
    var minHumidity = document.getElementById('PrdctMinHumidity').value;
    var maxHumidity = document.getElementById('PrdctMaxHumidity').value;
    var mintemp = document.getElementById('PrdctMinTemp').value;
    var maxtemp = document.getElementById('PrdctMaxTemp').value;
    var btntext = (document.getElementById("spnPmsStudyProduct").innerText).toLowerCase().trim()

    if (Dropdown_Validation(document.getElementById("DDLProjectNo"))) {
        ValidationAlertBox("Please select Project.", "DDLProjectNo", ModuleName);
        return false;
    }
    else if (Dropdown_Validation(document.getElementById("DDLPrdctKitIndi"))) {
        ValidationAlertBox("Please select Product Indication.", "DDLPrdctKitIndi", ModuleName);
        return false;
    }
    else if (isBlank(document.getElementById('PrdctKitName').value)) {
        ValidationAlertBox("Please enter Product Name.", "PrdctKitName", ModuleName);
        return false;
    }
    else if (Dropdown_Validation(document.getElementById("ddlProductType"))) {
        ValidationAlertBox("Please select Product Type.", "ddlProductType", ModuleName);
        return false;
    }
    else if (isBlank(document.getElementById('PrdctStrength').value)) {
        ValidationAlertBox("Please enter Product Strength.", "PrdctStrength", ModuleName);
        return false
    }
    else if (Dropdown_Validation(document.getElementById("DDLPrdctForm"))) {
        ValidationAlertBox("Please select Product Form.", "DDLPrdctForm", ModuleName);
        return false;
    }

    else if (isBlank(document.getElementById('txtStorageCondition').value)) {
        ValidationAlertBox("Please enter Storage Condition.", "txtStorageCondition", ModuleName);
        return false;
    }

    else if (!CheckDecimalLength(mintemp, -100.0, 500.0)) {
        ValidationAlertBox("Please enter Min Temp between -100 to 500.", "PrdctMinTemp", ModuleName);

        return false;
    }
    else if (!CheckDecimalLength(maxtemp, -100.0, 500.0)) {
        ValidationAlertBox("Please enter Max Temp between -100 to 500.", "PrdctMaxTemp", ModuleName);

        return false;
    }

    else if (isNumeric(document.getElementById('PrdctMinTemp').value, document.getElementById('PrdctMinTemp').id)) {
        ValidationAlertBox("Minimum temp should be numeric.", "PrdctMinTemp", ModuleName);
        return false;
    }
    else if (isNumeric(document.getElementById('PrdctMaxTemp').value, document.getElementById('PrdctMaxTemp').id)) {
        ValidationAlertBox("Maximum temp should be numeric.", "PrdctMaxTemp", ModuleName);
        return false;
    }
    else if (parseInt(maxtemp) < parseInt(mintemp)) {
        ValidationAlertBox("Max temp should be greater than min temp.", "PrdctMaxTemp", ModuleName);
        return false;
    }
    else if (parseFloat(maxtemp) < parseFloat(mintemp)) {
        ValidationAlertBox("Max temp should be greater than min temp.", "PrdctMaxTemp", ModuleName);
        return false;
    }

    else if (isNumeric(document.getElementById('PrdctMinHumidity').value, document.getElementById('PrdctMinHumidity').id)) {
        ValidationAlertBox("Minimum humidity should be numeric.", "PrdctMinHumidity", ModuleName);
        return false;
    }
    else if (isNumeric(document.getElementById('PrdctMaxHumidity').value, document.getElementById('PrdctMaxHumidity').id)) {
        ValidationAlertBox("Maximum humidity should be numeric.", "PrdctMinHumidity", ModuleName);
        return false;
    }
    else if (parseInt(maxHumidity) < parseInt(minHumidity)) {
        ValidationAlertBox("Max humidity should be greater than min humidity.", "PrdctMinHumidity", ModuleName);
        return false;
    }
    else if (parseFloat(maxHumidity) < parseFloat(minHumidity)) {
        ValidationAlertBox("Max humidity should be greater than min humidity.", "PrdctMinHumidity", ModuleName);
        return false;
    }
    else if (!CheckNumericLength(minHumidity, 0, 100)) {
        ValidationAlertBox("Please enter Min Humidity between 0 to 100.", "PrdctMinHumidity", ModuleName);

        return false;
    }
    else if (!CheckDecimalLength(minHumidity, 0.0, 100.0)) {
        ValidationAlertBox("Please enter Min Humidity between 0 to 100.", "PrdctMinHumidity", ModuleName);

        return false;
    }
    else if (!CheckNumericLength(maxHumidity, 0, 100)) {
        ValidationAlertBox("Please enter Max Humidity between 0 to 100.", "PrdctMaxHumidity", ModuleName);

        return false;
    }

    else if (!CheckDecimalLength(maxHumidity, 0.0, 100.0)) {
        ValidationAlertBox("Please enter Max Humidity between 0 to 100.", "PrdctMaxHumidity", ModuleName);

        return false;
    }

    else if (btntext == "update" && isBlank(document.getElementById('txtRemarks').value)) {
        ValidationAlertBox("Please enter Remarks.", "txtRemarks", ModuleName);
        return false;
    }
    else if (CheckDateMoreThenToday(document.getElementById('datepicker1').value)) {
        datepicker1.value = "";
        ValidationAlertBox("IEC Approval date should not be greater than current date.", "datepicker1", ModuleName);
        return false;
    }
    else if (CheckDateMoreThenToday(document.getElementById('datepicker2').value)) {
        datepicker2.value = "";
        ValidationAlertBox("TL date should not be greater than current date.", "datepicker2", ModuleName);
        return false;
    }

    else {
        return true;
    }
}

function pmsStudyProductAuditTrail(locationno) {
    jQuery("#titleMode").text('Audit Trail');
    $("#Div_ProductNo").css("display", "none");

    $('.form-control').each(function () {
        $(this).attr('disabled', false);
    });

    $("#btnaddPmsStudyProduct").attr("style", "display:none");
    $("#btnClearPmsStudyProduct").attr("style", "display:none");
    locationForAudit = "";
    locationForAudit = locationno;

    var GetallStudyProductData = {
        Url: BaseUrl + "PmsStudyProduct/StudyProductAuditTrailColor",
        SuccessMethod: "SuccessMethod"
    }

    var FilterData = {
        ProductNo: locationno,
        vPageName: 'Study Product'
    }

    $.ajax({
        url: GetallStudyProductData.Url,
        type: 'POST',
        async: false,
        data: FilterData,
        success: SuccessMethodData1,
        error: function () {
            SuccessorErrorMessageAlertBox("Approval Date not found.", ModuleName);
        }
    });

}

function SuccessMethodData1(response) {

    $('.AuditControl').each(function () { this.style.display = "inline"; });
    $('.AuditControl').css('backgroundColor', 'white');

    if (response.length > 0) {
        $('.AuditControl').each(function () { this.style.display = "inline"; });
        $('.AuditControl').css('backgroundColor', 'white');
        for (var i = 0; i < response.length; i++) {
            //if (response[i].HistryCount > 1) {
            $("#spn_" + response[i].ModifiedField).css('backgroundColor', 'red');
            //}
        }
    }

    GetProductType('No');
    var GetallStudyProductData = {
        Url: BaseUrl + "PmsStudyProduct/GetStudyProductDataByProductNo/" + locationForAudit + "",
        SuccessMethod: "SuccessMethod"
    }

    // For Server use

    $.ajax({
        type: "GET",
        url: BaseUrl + "PmsStudyProduct/GetStudyProductDataByProductNo",
        data: { id: locationForAudit },
        //contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessMethodDataAudit,
        error: function () {
            SuccessorErrorMessageAlertBox("Error to show Audit Trail data.", ModuleName);
        }
    });


}

function SuccessMethodDataAudit(data) {

    var PrdctFrmText = "";
    for (var Row = 0; Row < data.length; Row++) {
        $("#DDLProjectNo").val($("#DDLProjectNoList").val()).prop('disabled', true);
        $('#DDLPrdctKitIndi').val(data[Row].PrdctKitIndication).attr("selected", "selected").prop('disabled', true);

        $('#ddlProductType').val(data[Row].PrdctType).attr("selected", "selected").prop('disabled', true);
        $("#DDLPrdctKitIndi").val(data[Row].PrdctKitIndication).prop('disabled', true);
        $("#PrdctKitName").val(data[Row].PrdctName).prop('disabled', true);


        $("#ddlProductType").val(data[Row].PrdctType).prop('disabled', true)
        $("#hdnworkspaceid").val(data[Row].WorkspaceId).prop('disabled', true);
        $("#ProductNo").val(data[Row].ProductNo).prop('disabled', true);

        $("#DDLPrdctForm").val(data[Row].PrdctForm).prop('disabled', true);
        $("#PrdctBrandName").val(data[Row].PrdctBrandName).prop('disabled', true);
        $("#ActiveIngrdient").val(data[Row].ActiveIngrdient).prop('disabled', true);
        $("#PrdctStrength").val(data[Row].PrdctStrength).prop('disabled', true);
        $("#PrdctMinTemp").val(data[Row].PrdctMinTemp).prop('disabled', true);
        $("#PrdctMaxTemp").val(data[Row].PrdctMaxTemp).prop('disabled', true);
        $("#PrdctMinHumidity").val(data[Row].PrdctMinHumidity).prop('disabled', true);
        $("#PrdctMaxHumidity").val(data[Row].PrdctMaxHumidity).prop('disabled', true);
        $("#Submission").val(data[Row].Submission).prop('disabled', true);
        $("#txtStorageCondition").val(data[Row].vStorageCondition).prop('disabled', true);
        $('#ddlSponsorName').val(data[Row].vClientCode).attr("selected", "selected").prop('disabled', true);
        $("#txtRemarks").val("").prop('disabled', true);

        if (data[Row].IECApprovalDate == "1-1-1900") {
            $("#datepicker1").val("").prop('disabled', true);
            $('#datepicker1').data("DateTimePicker").clear();
        }
        else {
            var MonthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var IECApprovalDate = data[Row].IECApprovalDate
            var date = IECApprovalDate.split("-");
            var result = date[2].split("T")
            var monthinid = parseInt(date[1]);
            var datetime = date[0] + "-" + MonthList[monthinid - 1] + "-" + result[0];
            $("#datepicker1").val(datetime).prop('disabled', true);
        }

        if (data[Row].TlDate == "1-1-1900") {
            $("#datepicker2").val("").prop('disabled', true);
            $('#datepicker2').data("DateTimePicker").clear();

            //$('#datepicker2').datepicker('setDate', 'm');
            //$('#datepicker2').datepicker('setDate', null);
        }
        else {
            var MonthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var TlDate = data[Row].TlDate
            var date = TlDate.split("-");
            var result = date[2].split("T")
            var monthinid = parseInt(date[1]);
            var datetime = date[0] + "-" + MonthList[monthinid - 1] + "-" + result[0];
            $("#datepicker2").val(datetime).prop('disabled', true);
        }
    }
}

function AuditTrail(e) {
    $("#DDLProjectNoList").attr('disabled', false);
    var str = e.id;
    var title = $(e).attr("titlename");
    var fieldname = str.substring(4);
    var productno = $("#ProductNo").val();
    var Data = {
        vTableName: "StudyProductMstHistory",
        vIdName: "nProductNo",
        vIdValue: productno,
        vFieldName: fieldname,
        iUserId: iUserNo
    }

    $('#tblStudyProductAuditTrail > tbody > tr:nth-child(n+1)').remove();
    $.ajax({
        url: BaseUrl + "PmsGeneral/AuditTrail",
        type: 'POST',
        data: Data,
        async: false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Audit Trail data not found.", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        var strdata = "";
        if (jsonData.length > 0) {
            $("#divexport").show();
        }
        else {
            $("#divexport").hide();
        }
        var ActivityDataset = [];
        for (var i = 0; i < jsonData.length; i++) {
            var InDataset = [];
            var ProductType;
            var ProductKitIndication;
            var Desciprtion;
            if ("cProductType" == fieldname) {
                if (jsonData[i].vFieldName == "T") {
                    ProductType = "Test"
                }
                else if (jsonData[i].vFieldName == "R") {
                    ProductType = "Reference"
                }
                else if (jsonData[i].vFieldName == "P") {
                    ProductType = "Placebo"
                }
                else if (jsonData[i].vFieldName == "C") {
                    ProductType = "Concomitant Medication"
                }
                // addded by ketan for full name
                if ((jsonData[i].vDesciprtion).match("T To R"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("T To R", "Test To Reference");
                else if ((jsonData[i].vDesciprtion).match("T To P"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("T To P", "Test To Placebo");
                else if ((jsonData[i].vDesciprtion).match("T To C"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("T To C", "Test To Concomitant Medication");

                else if ((jsonData[i].vDesciprtion).match("R To T"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("R To T", "Reference To Test");
                else if ((jsonData[i].vDesciprtion).match("R To P"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("R To P", "Reference To Placebo");
                else if ((jsonData[i].vDesciprtion).match("R To C"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("R To C", "Reference To Concomitant Medication");

                else if ((jsonData[i].vDesciprtion).match("P To T"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("P To T", "Placebo To Test");
                else if ((jsonData[i].vDesciprtion).match("P To R"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("P To R", "Placebo To Reference");
                else if ((jsonData[i].vDesciprtion).match("P To T"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("P To C", "Placebo To Concomitant Medication");

                else if ((jsonData[i].vDesciprtion).match("C To T"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("C To T", "Concomitant Medication To Test");
                else if ((jsonData[i].vDesciprtion).match("C To R"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("C To R", "Concomitant Medication To Reference");
                else if ((jsonData[i].vDesciprtion).match("C To P"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("C To P", "Concomitant Medication To Placebo");

                //InDataset.push(ProductType, jsonData[i].Operation, (jsonData[i].vDesciprtion == "" ? "" : title + ' ' + Desciprtion), jsonData[i].vRemark, jsonData[i].vModifyBy, jsonData[i].dModifyOn);

                InDataset.push(ProductType, jsonData[i].Operation, jsonData[i].vRemark, jsonData[i].vModifyBy, jsonData[i].dModifyOn);
            }
            else if ("cProductKitIndication" == fieldname) {
                if (jsonData[i].vFieldName == "P") {
                    ProductKitIndication = "Product"
                }
                else if (jsonData[i].vFieldName == "K") {
                    ProductKitIndication = "Kit"
                }
                // addded by ketan for full name
                if ((jsonData[i].vDesciprtion).match("P To K"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("P To K", "Product To Kit");
                else if ((jsonData[i].vDesciprtion).match("K To P"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("K To P", "Kit To Product");


                //InDataset.push(ProductKitIndication, jsonData[i].Operation, (jsonData[i].vDesciprtion == "" ? "" : title + ' ' + Desciprtion), jsonData[i].vRemark, jsonData[i].vModifyBy, jsonData[i].dModifyOn);
                InDataset.push(ProductKitIndication, jsonData[i].Operation, jsonData[i].vRemark, jsonData[i].vModifyBy, jsonData[i].dModifyOn);
            }
            else if ("dRetentionDate" == fieldname || "dIECApprovalDate" == fieldname || "dTlDate" == fieldname) {
                if (jsonData[i].vFieldName == "01-Jan-1900") {
                    tempdate = "";
                }
                else {
                    tempdate = jsonData[i].vFieldName;
                }

                if ((jsonData[i].vDesciprtion).match("01 Jan 1900")) {
                    tempdesc = (jsonData[i].vDesciprtion).replace("01 Jan 1900", " ");
                }
                else {
                    tempdesc = jsonData[i].vDesciprtion
                }
                //InDataset.push(tempdate, jsonData[i].Operation, (jsonData[i].vDesciprtion == "" ? "" : title + ' ' + tempdesc), jsonData[i].vRemark, jsonData[i].vModifyBy, jsonData[i].dModifyOn);

                InDataset.push(tempdate, jsonData[i].Operation, jsonData[i].vRemark, jsonData[i].vModifyBy, jsonData[i].dModifyOn);
            }
            else {
                InDataset.push(jsonData[i].vFieldName, jsonData[i].Operation, jsonData[i].vRemark, jsonData[i].vModifyBy, jsonData[i].dModifyOn);
            }
            ActivityDataset.push(InDataset);
        }
        otable = $('#tblStudyProductAuditTrail').dataTable({
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
                //{ "sTitle": "Description" },
                { "sTitle": "Remarks" },
                { "sTitle": "Modify by" },
                { "sTitle": "Modify On" }
            ],
            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },
        });
    }
}

function pmsStudyProductEditData(ProductNo) {
    $('.AuditControl').each(function () { this.style.display = "none"; });
    $('.form-control').each(function () {
        $(this).attr('disabled', false);
    });

    $("#btnaddPmsStudyProduct").attr("style", "display:inline");
    $("#btnClearPmsStudyProduct").attr("style", "display:inline");

    EditAttribute();
    GetProductType('Yes');

    var GetallStudyProductData = {
        Url: BaseUrl + "PmsStudyProduct/GetStudyProductVerification/" + ProductNo + "",
        SuccessMethod: "SuccessMethod"
    }


    // For Server use

    $.ajax({
        type: "GET",
        url: BaseUrl + "PmsStudyProduct/GetStudyProductVerification",
        data: { id: ProductNo },
        //contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessMethodData1,
        error: function () {
            SuccessorErrorMessageAlertBox("Error To Get Audit Trail !", ModuleName);
        }
    });


    function SuccessMethodData1(jsonData) {
        if (jsonData == "success") {
            isDisabled = false;
        }
        else {
            isDisabled = true;
        }
        var GetallStudyProductData = {
            Url: BaseUrl + "PmsStudyProduct/GetStudyProductDataByProductNo/" + ProductNo + "",
            SuccessMethod: "SuccessMethod"
        }


        // For Server use

        $.ajax({
            type: "GET",
            url: BaseUrl + "PmsStudyProduct/GetStudyProductDataByProductNo",
            data: { id: ProductNo },
            //contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: SuccessMethodData,
            error: function () {
                SuccessorErrorMessageAlertBox("Data not found.", ModuleName);
            }
        });


    }
}

function SuccessMethodData(data) {

    var PrdctFrmText = "";
    for (var Row = 0; Row < data.length; Row++) {
        $("#DDLProjectNo").val($("#DDLProjectNoList").val());
        $('#DDLPrdctKitIndi').val(data[Row].PrdctKitIndication).attr("selected", "selected");
        if (isDisabled == true) {
            $('#ddlProductType').val(data[Row].PrdctType).attr("selected", "selected").prop('disabled', true);
            $("#DDLPrdctKitIndi").val(data[Row].PrdctKitIndication).prop('disabled', true);
            $("#PrdctKitName").val(data[Row].PrdctName).prop('disabled', true);

        }
        else {
            $('#ddlProductType').val(data[Row].PrdctType).attr("selected", "selected").prop('disabled', false);
            $("#DDLPrdctKitIndi").val(data[Row].PrdctKitIndication).prop('disabled', false);
            $("#PrdctKitName").val(data[Row].PrdctName).prop('disabled', false);

        }
        $("#ddlProductType").val(data[Row].PrdctType)
        $("#hdnworkspaceid").val(data[Row].WorkspaceId);
        $("#ProductNo").val(data[Row].ProductNo);

        $("#DDLPrdctForm").val(data[Row].PrdctForm);
        $("#PrdctBrandName").val(data[Row].PrdctBrandName);
        $("#ActiveIngrdient").val(data[Row].ActiveIngrdient);
        $("#PrdctStrength").val(data[Row].PrdctStrength);
        $("#PrdctMinTemp").val(data[Row].PrdctMinTemp);
        $("#PrdctMaxTemp").val(data[Row].PrdctMaxTemp);
        $("#PrdctMinHumidity").val(data[Row].PrdctMinHumidity);
        $("#PrdctMaxHumidity").val(data[Row].PrdctMaxHumidity);
        $("#Submission").val(data[Row].Submission);
        $("#txtStorageCondition").val(data[Row].vStorageCondition);
        $('#ddlSponsorName').val(data[Row].vClientCode).attr("selected", "selected");
        $("#txtRemarks").val("");

        if (data[Row].IECApprovalDate == "1-1-1900") {
            $("#datepicker1").val("");
            $('#datepicker1').data("DateTimePicker").clear();
        }
        else {
            var MonthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var IECApprovalDate = data[Row].IECApprovalDate
            var date = IECApprovalDate.split("-");
            var result = date[2].split("T")
            var monthinid = parseInt(date[1]);
            var datetime = date[0] + "-" + MonthList[monthinid - 1] + "-" + result[0];
            $("#datepicker1").val(datetime);
        }

        if (data[Row].TlDate == "1-1-1900") {
            $("#datepicker2").val("");
            $('#datepicker2').data("DateTimePicker").clear();

            //$('#datepicker2').datepicker('setDate', 'm');
            //$('#datepicker2').datepicker('setDate', null);
        }
        else {
            var MonthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var TlDate = data[Row].TlDate
            var date = TlDate.split("-");
            var result = date[2].split("T")
            var monthinid = parseInt(date[1]);
            var datetime = date[0] + "-" + MonthList[monthinid - 1] + "-" + result[0];
            $("#datepicker2").val(datetime);
        }
    }
}

function StudyProductEditDataMaster() {
    jQuery("#titleMode").text('Mode:-Edit');
    jQuery("#spnPmsStudyProduct").text('Update');

    var GetallStudyProductData = {
        Url: BaseUrl + "PmsStudyProduct/EditDataStudyProduct",
        SuccessMethod: "SuccessMethod"
    }
    $.ajax({
        url: GetallStudyProductData.Url,
        type: 'Post',
        data: jsonData,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Data not found.", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        $("#Div_ProductNo").css("display", "block");
        ProductNo = $("#ProductNo").val();
        WorkspaceId = setworkspaceid;
        PrdctKitIndication = $("#DDLPrdctKitIndi").val()
        PrdctType = $("#ddlProductType").val();
        PrdctName = $("#PrdctKitName").val();
        PrdctForm: $("#DDLPrdctForm").val(),
        //PrdctForm = $("#PrdctForm").val();
        PrdctBrandName = $("#PrdctBrandName").val();
        ActiveIngrdient = $("#ActiveIngrdient").val();
        PrdctStrength = $("#PrdctStrength").val();
        PrdctMinTemp = $("#PrdctMinTemp").val();
        PrdctMaxTemp = $("#PrdctMaxTemp").val();
        PrdctMinHumidity = $("#PrdctMinHumidity").val();
        PrdctMaxHumidity = $("#PrdctMaxHumidity").val();
        IECApprovalDate = $("#datepicker1").val();
        RetentionPeriod = $("#RetentionPeriod").val();
        TlDate = $("#datepicker2").val();
        Submission = $("#Submission").val();
        Remark = $("#txtRemarks").val();
        this.data(row).draw();
    }
}

var EditStudyProductDataMaster = function (Url, SuccessMethod, Data) {
    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        //async: false,
        success: SuccessUpdateData,
        error: function () {
            SuccessorErrorMessageAlertBox("Error found in edit time.", ModuleName);
        }
    });

    function SuccessUpdateData(response) {
        BindGridView();
        ClearTextBox();
        SuccessorErrorMessageAlertBox(response, ModuleName);
    }
}

function ClearTextBox() {
    var btntext = (document.getElementById("spnPmsStudyProduct").innerText).toLowerCase().trim()
    if (btntext == "save") {
        $("#ProductNo").val("");
        $("#DDLPrdctForm").val("");
        $("#PrdctKitName").val("");
        $('#DDLPrdctKitIndi').val(0).attr("selected", "selected");
    }
    //$('#DDLPrdctKitIndi').val(0).attr("selected", "selected");
    //$("#ddlProductType").val(0).attr("selected", "selected");
    //$("#PrdctKitName").val("");
    $("#DDLPrdctForm").val("");
    $("#PrdctBrandName").val("");
    $("#ActiveIngrdient").val("");
    $("#PrdctStrength").val("");
    $("#PrdctMinTemp").val("");
    $("#PrdctMaxTemp").val("");
    $("#PrdctMinHumidity").val("");
    $("#PrdctMaxHumidity").val("");
    $("#datepicker1").val("");
    $("#RetentionPeriod").val("");
    //$("#datepicker1").val("");
    //$('#datepicker1').data("DateTimePicker").clear();
    $("#datepicker2").val("");
    //$('#datepicker2').data("DateTimePicker").clear();
    $("#Submission").val("");
    $("#txtRemarks").val("");
    $("#txtStorageCondition").val("");
    $("#ddlSponsorName").val(0).attr("selected", "selected");
}

var GetAllPmsProjectNoData = function (Url, SuccessMethod, ProjectNoDataTemp) {
    $.ajax({
        url: Url,
        type: 'GET',
        
        data: { iUserId: ProjectNoDataTemp.iUserId, vStudyCode: ProjectNoDataTemp.vStudyCode },
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

        $("#DDLProjectNoList").autocomplete({
            source: sourceArr,
            change: function (event, ui) { }
        });

        $("#DDLProjectNo").autocomplete({
            source: sourceArr,
            change: function (event, ui) { }
        });
    }
}

function RefreshTable(tableId, urlData) {
    $.getJSON(urlData, null, function (json) {
        table = $(tableId).dataTable();
        oSettings = table.fnSettings();

        table.fnClearTable(this);

        for (var i = 0; i < json.aaData.length; i++) {
            table.oApi._fnAddData(oSettings, json.aaData[i]);
        }

        oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
        table.fnDraw();
    });
}

function SaveAttribute() {
    $("#DDLProjectNo").val($("#DDLProjectNoList").val());
    jQuery("#spnPmsStudyProduct").text('Save');
    jQuery("#titleMode").text('Mode:-Add');
    $("#Div_ProductNo").css("display", "none");
    $('#ProductNo').prop('disabled', true);
    $('#DDLProjectNo').prop('disabled', true);
    $('#btnaddPmsStudyProduct').removeAttr("title");
    $('#btnaddPmsStudyProduct').attr("title", "Save");
    $('.form-control').each(function () {
        $(this).attr('disabled', false);
    });
    $('#DDLProjectNo').prop('disabled', true);
    ClearTextBox();
}

function EditAttribute() {
    $("#DDLProjectNo").val($("#DDLProjectNoList").val());
    jQuery("#titleMode").text('Mode:-Edit');
    jQuery("#spnPmsStudyProduct").text('Update');
    $("#Div_ProductNo").css("display", "block");
    $('#btnaddPmsStudyProduct').removeAttr("title");
    $('#btnaddPmsStudyProduct').attr("title", "Update");
    $('#ProductNo').prop('disabled', true);
    $('#DDLProjectNo').prop('disabled', true);
    ClearTextBox();
    document.getElementById("btnaddPmsSaveContinue").value = "Save & Continue";
    $('#btnaddPmsSaveContinue').attr("data-original-title", "Save & Continue");
}

function GetProductForm() {
    var GetProductForm = {
        Url: BaseUrl + "PmsGeneral/GetProductForm",
        SuccessMethod: "SuccessMethod"
    }
    $.ajax({
        url: GetProductForm.Url,
        type: 'GET',
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Product Form not found.", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        var jsonObj = jsonData;
        var sourceArr = [];

        for (var i = 0; i < jsonObj.length; i++) {
            sourceArr.push(jsonObj[i].vFormulationName);
        }

        $("#DDLPrdctForm").autocomplete({
            source: sourceArr,
            change: function (event, ui) { }
        });
    }
}

function GetProductType(value) {
    var str = "0000000000";
    var GetProductType = {
        //Url: BaseUrl + "PmsGeneral/GetProductType/" + str,   change For Location wise filter
        Url: BaseUrl + "PmsProductType/AllProductType",
        SuccessMethod: "SuccessMethod"
    }
    var FilterData = {
        vLocationCode: $("#hdnUserLocationCode").val()
    }

    $.ajax({
        url: GetProductType.Url,
        type: 'POST',
        async: false,
        data: FilterData,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Product Type not found.", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        $("#ddlProductType").empty().append('<option selected="selected" value="0">Please Select Product Type</option>');
        for (var i = 0; i < jsonData.length; i++) {
            if (value == "Yes") {
                if (jsonData[i].cStatusIndi != 'D') {
                    $("#ddlProductType").append($("<option></option>").val(jsonData[i].nProductTypeID).html(jsonData[i].vProductType));
                }
            }
            else {
                $("#ddlProductType").append($("<option></option>").val(jsonData[i].nProductTypeID).html(jsonData[i].vProductType));
            }
        }
    }
}

function GetApprovalDate() {

    var GetProductType = {
        //Url: BaseUrl + "PmsGeneral/GetProductType/" + str,   change For Location wise filter
        Url: BaseUrl + "PmsStudyProduct/AllApprovalDate",
        SuccessMethod: "SuccessMethod"
    }
    var FilterData = {
        WorkspaceId: setworkspaceid
    }

    $.ajax({
        url: GetProductType.Url,
        type: 'POST',
        asyn: false,
        data: FilterData,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Approval Date not found.", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        if (jsonData.length > 0)
            for (var i = 0; i < jsonData.length; i++) {
                if (jsonData[i].dIECApprovalDate == "1900-01-01T00:00:00") {
                    continue;
                }
                else {
                    var MonthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    var tmpexpirtydate = jsonData[i].dIECApprovalDate
                    var date = tmpexpirtydate.split("-");
                    var result = date[2].split("T")
                    var time = result[1].split(":");
                    var monthinid = parseInt(date[1]);
                    var datetime = result[0] + "-" + MonthList[monthinid - 1] + "-" + date[0];
                    $("#datepicker1").val(datetime);
                    break;
                }
            }
    }
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

    // For Server use

    $.ajax({
        type: "GET",
        url: BaseUrl + "PmsGeneral/GetSetProjectDetails",
        data: { id: PassData.iUserId },
      //  contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Project not found.", ModuleName);
        }
    });


    function SuccessMethod(jsonData) {
        if (jsonData.length > 0) {
            $('#DDLProjectNoList').val(jsonData[0].vProjectNo);
            setworkspaceid = jsonData[0].vWorkSpaceId;
        }
        else {
            $('#DDLProjectNoList').val('');
        }
    }
}

function GetSponsorName() {
    $.ajax({
        url: BaseUrl + "PmsStudyProduct/GetSponsorName",
        type: 'GET',
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Sponsor Name not found.", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        $("#ddlSponsorName").empty().append('<option selected="selected" value="0">Please Select Sponsor Name</option>');
        for (var i = 0; i < jsonData.length; i++) {
            $("#ddlSponsorName").append($("<option></option>").val(jsonData[i].vSponserCode).html(jsonData[i].vSponserName));
        }
    }
}

function GetTransferProductDetails(charindi) {
    var ProductTransferData = {
        vWorkSpaceId: setworkspaceid,
        charIndi: charindi,
    }

    $.ajax({
        url: BaseUrl + "PmsStudyProduct/ProductTransferDetail",
        type: "POST",
        async : false, // double click solution
        data: ProductTransferData,
        success: SuccessMethodProductTrasfer,
        error: function () {
            SuccessorErrorMessageAlertBox("Data not found.", ModuleName);
        }
    });

    function SuccessMethodProductTrasfer(jsonData) {
        if (jsonData.length > 1) {
            $("#StudyProductTransferDetail").modal('show');
            var ActivityDataset = [];
            for (var i = 0; i < jsonData.length; i++) {
                var InDataset = [];
                InDataset.push(jsonData[i].vProjectNo, jsonData[i].vProductName, jsonData[i].vBatchLotNo, jsonData[i].vProductType, jsonData[i].iReceivedQty);
                ActivityDataset.push(InDataset);
            }
            otable = $('#tblStudyProductTransferDetail').dataTable({
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
                "oLanguage": {
                    "sEmptyTable": "No Record Found",
                },
                "aoColumns": [
                    { "sTitle": "Project No" },
                    { "sTitle": "Product Name" },
                    { "sTitle": "Batch/Lot/Lot No" },
                    { "sTitle": "Product Type" },
                    { "sTitle": "Quantity" },
                ],
            });
        }
        else {
            if (jsonData[0].Count != 0) {
                document.getElementById("ProductTransferDetails").style.display = "block";
            }
            else {
                document.getElementById("ProductTransferDetails").style.display = "none";
            }
        }
    }
}

function GetProductDataFromTransfer() {
    var ProductTransferData =
    {
        vWorkSpaceId: setworkspaceid,
        nProductTypeID: $("#ddlProductType :selected").val()
    }

    $.ajax({
        url: BaseUrl + "PmsStudyProduct/StudyProductDataForTransfer",
        type: "POST",
        data: ProductTransferData,
        success: SuccessMethodStudyProductDataForTransfer,
        error: function () {
            SuccessorErrorMessageAlertBox("Data not found.", ModuleName);

        }
    });


    function SuccessMethodStudyProductDataForTransfer(jsonData) {
        if (jsonData.length != 0) {
            $('#DDLPrdctKitIndi').val(jsonData[0].cProductKitIndication).attr("selected", "selected");
            //$('#ddlProductType').val(jsonData[0].PrdctType).attr("selected", "selected");
            $("#DDLPrdctKitIndi").val(jsonData[0].cProductKitIndication)
            //$("#ddlProductType").val(jsonData[0].PrdctType)
            //$("#hdnworkspaceid").val(jsonData[0].WorkspaceId);
            $("#PrdctKitName").val(jsonData[0].vProductName);
            $("#DDLPrdctForm").val(jsonData[0].vProductForm);
            $("#PrdctBrandName").val(jsonData[0].vProductBrandName);
            $("#ActiveIngrdient").val(jsonData[0].vActiveIngredient);
            $("#PrdctStrength").val(jsonData[0].vProductStrength);
            $("#PrdctMinTemp").val(jsonData[0].vProductMinTemp);
            $("#PrdctMaxTemp").val(jsonData[0].vProductMaxTemp);
            $("#PrdctMinHumidity").val(jsonData[0].vProductMinHumidity);
            $("#PrdctMaxHumidity").val(jsonData[0].vProductMaxHumidity);
            $("#Submission").val(jsonData[0].vSubmission);
            $("#txtStorageCondition").val(jsonData[0].vStorageCondition);
            $('#ddlSponsorName').val(jsonData[0].vSponserCode).attr("selected", "selected");
            $("#txtRemarks").val("");

            //if (jsonData[0].dIECApprovalDate == "1-1-1900") {
            //    $("#datepicker1").val("");
            //    $('#datepicker1').data("DateTimePicker").clear();
            //}
            //else {
            //    var MonthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            //    var IECApprovalDate = jsonData[0].dIECApprovalDate
            //    var date = IECApprovalDate.split("-");
            //    var result = date[2].split("T")
            //    var monthinid = parseInt(date[1]);
            //    var datetime = result[0] + "-" + MonthList[monthinid - 1] + "-" + date[0];
            //    $("#datepicker1").val(datetime);
            //}

            if (jsonData[0].dTlDate == "1-1-1900" || jsonData[0].dTlDate == "1900-01-01T00:00:00") {
                $('#datepicker2').datepicker('setDate', 'm');
                $('#datepicker2').datepicker('setDate', null);
            }
            else {
                var MonthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                var TlDate = jsonData[0].dTlDate
                var date = TlDate.split("-");
                var result = date[2].split("T")
                var monthinid = parseInt(date[1]);
                //var datetime = date[0] + "-" + MonthList[monthinid - 1] + "-" + result[0];
                var datetime = result[0] + "-" + MonthList[monthinid - 1] + "-" + date[0];
                $("#datepicker2").val(datetime);
            }
        }
        else {
            $("#ProductNo").val("");
            $("#DDLPrdctForm").val("");
            if (document.getElementById("ProductTransferDetails").style.display == "block") {
                $('#DDLPrdctKitIndi').val(0).attr("selected", "selected");
                $("#PrdctKitName").val("");
            }
            $("#PrdctBrandName").val("");
            $("#ActiveIngrdient").val("");
            $("#PrdctStrength").val("");
            $("#PrdctMinTemp").val("");
            $("#PrdctMaxTemp").val("");
            $("#PrdctMinHumidity").val("");
            $("#PrdctMaxHumidity").val("");
            //$("#datepicker1").val("");
            $("#RetentionPeriod").val("");
            //$("#datepicker1").val("");
            //$('#datepicker1').data("DateTimePicker").clear();
            $("#datepicker2").val("");
            $('#datepicker2').data("DateTimePicker").clear();
            $("#Submission").val("");
            $("#txtRemarks").val("");
            $("#txtStorageCondition").val("");
            $("#ddlSponsorName").val(0).attr("selected", "selected");
        }
    }

}

function GetTransferProductDetailsNew(charindi) {
    var ProductTransferData =
    {
        vWorkSpaceId: setworkspaceid,
        charIndi: charindi,
    }


    $.ajax({
        url: BaseUrl + "PmsStudyProduct/ProductTransferDetail",
        type: "POST",
        data: ProductTransferData,
        success: SuccessMethodProductTrasfer,
        error: function () {
            SuccessorErrorMessageAlertBox("Data not found.", ModuleName);

        }
    });

    function SuccessMethodProductTrasfer(jsonData) {
        if (jsonData.length > 0) {
            //if (jsonData[i].vProjectNo != "") {
            $("#StudyProductTransferDetail").modal('show');
            var ActivityDataset = [];
            for (var i = 0; i < jsonData.length; i++) {
                var InDataset = [];
                InDataset.push(jsonData[i].vProjectNo, jsonData[i].vProductName, jsonData[i].vBatchLotNo, jsonData[i].vProductType, jsonData[i].iReceivedQty);
                ActivityDataset.push(InDataset);
            }
            otable = $('#tblStudyProductTransferDetail').dataTable({
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
                "oLanguage": {
                    "sEmptyTable": "No Record Found",
                },
                "aoColumns": [
                    { "sTitle": "Project No" },
                    { "sTitle": "Product Name" },
                    { "sTitle": "Batch/Lot/Lot No" },
                    { "sTitle": "Product Type" },
                    { "sTitle": "Quantity" },
                ],
            });
        }
    }
}

function GetViewMode() {
    var ViewModeIDWebConfig = $("#hdnViewModeID").val().split(",");
    for (i = 0; i < ViewModeIDWebConfig.length; i++) {
        if ($("#hdnUserTypeCode").val().trim() == ViewModeIDWebConfig[i]) {
            document.getElementById('btnAddStudyProductData').style.visibility = "hidden";
            viewmode = "OnlyView";
            break;
        }
        else {
            viewmode = "";
        }
    }
}

function BindGridView() {
    if (productIds[$('#DDLProjectNoList').val()] != undefined) {
        setworkspaceid = productIds[$('#DDLProjectNoList').val()];
    }
    $('#hdnworkspaceid').val(setworkspaceid);

    $("#tblPmsStudyProduct").css("visibility", "Visible");

    var GetStudyProductData = {
        Url: BaseUrl + "PmsStudyProduct/GetAllStudyProductData" + "/" + setworkspaceid,
        SuccessMethod: "SuccessMethod",
    }
    GetAllStudyProductDataMaster(GetStudyProductData.Url, GetStudyProductData.SuccessMethod, setworkspaceid);
}

function BindData() {
    if (productIds[$('#DDLProjectNoList').val()] != undefined) {
        setworkspaceid = productIds[$('#DDLProjectNoList').val()];
    }
    GetProductType('Yes');
    var url = WebUrl + "PmsStudyProduct/GetWorkspaceId";
    $.ajax({
        url: url,
        type: 'get',
        data: { id: setworkspaceid, UserName: $("#hdnUserName").val() },
        async: false,
        success: function (response) {
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Project not found.", ModuleName);

        }
    });

    if (setworkspaceid != "") {
        BindGridView();
    }
}


function restrictMinus(e) {   
    var inputKeyCode = e.keyCode ? e.keyCode : e.which;

    if (inputKeyCode != null) {
        if (inputKeyCode == 45) e.preventDefault();
    }

}

