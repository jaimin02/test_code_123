var iUserNo;
var productIds = new Object();
var filenames1 = [];
var filenames2 = [];
var setworkspaceid;
var viewmode;
var ModuleName = "Kit Activation";
var studytype = "";
var nProductTypeID = 0;
var maxLength = 200;

$(document).ready(function () {

    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('.modal').modal('hide');

    CheckSetProject();
    var GetProjectNo = {
        //Url: BaseUrl + "PmsProductBatch/GetProjectNo",
        Url: BaseUrl + "PmsGeneral/GetScopeWiseProject",
        SuccessMethod: "SuccessMethod"
    }
    $('#DDLProjectNo').on('change keyup', function () {
        if ($('#DDLProjectNo').val().length == 2) {
            var ProjectNoDataTemp = {
                //vProjectNo: $('#DDLProjectNo').val(),
                iUserId: $("#hdnuserid").val(),
                vStudyCode: $('#DDLProjectNo').val()
                //vProjectTypeCode: $("#hdnscopevalues").val(),
            }
            GetAllParentPRoject(GetProjectNo.Url, GetProjectNo.SuccessMethod, ProjectNoDataTemp);
        }
        else if ($('#DDLProjectNo').val().length < 2) {
            $("#DDLProjectNo").autocomplete({
                source: "",
                change: function (event, ui) { },
                select: function (event, ui) {
                    vProjectNo = ui.item.value;
                    $('#DDLProjectNo').val(vProjectNo);
                },
            });
        }
    });

    //GetAllParentPRoject();
    $('#ExpiryDate').datepicker({ format: 'dd-MM-yyyy', autoclose: true });
    $('#StartDate').datepicker({ format: 'dd-MM-yyyy', autoclose: true });
    $('#EndDate').datepicker({ format: 'dd-MM-yyyy', autoclose: true });

    $('#ddlKit').multiselect({
        nonSelectedText: 'Please Select Kit',
        buttonClass: 'form-control',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        numberDisplayed: 2,
        includeSelectAllOption: true,
    });
    if (setworkspaceid != undefined) {
        ViewMyProject();
        GetProductType();
    }
});
var GetAllParentPRoject = function (Url, SuccessMethod, ProjectNoDataTemp) {

    $.ajax({
        url: Url,
        type: 'GET',
        //data: { id: ProjectNoDataTemp.iUserId, projectno: ProjectNoDataTemp.vProjectNo, typecode: ProjectNoDataTemp.vProjectTypeCode },
        data: { iUserId: ProjectNoDataTemp.iUserId, vStudyCode: ProjectNoDataTemp.vStudyCode },
        async: false,
        success: function (jsonData) {
            var jsonObj = jsonData;
            var sourceArr = [];
            for (var i = 0; i < jsonObj.length; i++) {
                sourceArr.push("[ " + jsonObj[i].vStudyCode + " ]" + " " + jsonObj[i].vStudyName);
                productIds["[ " + jsonObj[i].vStudyCode + " ]" + " " + jsonObj[i].vStudyName] = jsonObj[i].nStudyNo;
            }
            $("#DDLProjectNo").autocomplete({
                source: sourceArr,
                change: function (event, ui) { }
            });
        },
        error: function () {
            ValidationAlertBox("Project not found.", "ddlProjectNodashboard", ModuleName);
        }
    });
}

$('#txtRemarks').keyup(function () {
    var textlen = maxLength - $(this).val().length;
    $('#rchars').text(textlen);
});

$('#btnExitKitActivation').on("click", function () {
    ConfirmAlertBox(ModuleName, $("#RedirectToHome").val());
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
        type: "GET",
        url: BaseUrl + "PmsGeneral/GetSetProjectDetails",
        data: { id: PassData.iUserId },
        dataType: "json",
        async: false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Project not found.", ModuleName);
        }
    });
    function SuccessMethod(jsonData) {
        if (jsonData.length > 0) {
            $('#DDLProjectNo').val(jsonData[0].vProjectNo);
            setworkspaceid = jsonData[0].vWorkSpaceId;
        }
        else {
            $('#DDLProjectNo').val('');
        }
    }
}

$('#DDLProjectNo').on("blur", function () {
    if (productIds[$('#DDLProjectNo').val()] != undefined) {
        setworkspaceid = productIds[$('#DDLProjectNo').val()];
    }
    else {
        setworkspaceid = "";
    }

    ViewMyProject();
    GetProductType();
});

$('#btnSaveKitActivation').on("click", function () {
    if (Validation()) {
        Savedata();
    }
});

function Savedata() {
    var ddlProduct = $('#ddlProduct :selected').val();
    var ddlBatchLot = $('#ddlBatchLot :selected').val();
    var ddlKit = $('#ddlKit option:selected').toArray().map(item => item.text).join();

    if (productIds[$('#DDLProjectNo').val()] != undefined) {
        setworkspaceid = productIds[$('#DDLProjectNo').val()];
    }

    var Data = {
        vWorkSpaceID: setworkspaceid,
        vKitNo: ddlKit,
        nProductNo: ddlProduct,
        nKitBatchNo: ddlBatchLot,
        iModifyBy: $("#hdnuserid").val(),
        vRemark: $('#txtRemarks').val(),
        dExpiryDate: $("#ExpiryDate").val()
    }//ended

    $("#loader").css("display", "block");
    $('.MasterLoader').show();

    $.ajax({
        url: BaseUrl + "PmsKitActivation/Update_KitActivation",
        type: "POST",
        data: Data,
        async: false,
        success: function (result) {
            SuccessorErrorMessageAlertBox("Save data sucessfully. !", ModuleName);
            clearControl();
        },
        error: function (err) {
            SuccessorErrorMessageAlertBox(err.statusText + " !", ModuleName);
        }
    });

}

function Validation() {
    if (isBlank(document.getElementById('DDLProjectNo').value)) {
        ValidationAlertBox("Please Select Project Number !", "DDLProjectNo", ModuleName);
        return false;
    }

    if (Dropdown_Validation(document.getElementById("ddlTransferIndi"))) {
        ValidationAlertBox("Please Select Kit Indication.", "ddlTransferIndi", ModuleName);
        return false;
    }
    if (Dropdown_Validation(document.getElementById("ddlProductType"))) {
        ValidationAlertBox("Please Select Product type.", "ddlProductType", ModuleName);
        return false;
    }

    if (Dropdown_Validation(document.getElementById("ddlProduct"))) {
        ValidationAlertBox("Please Select Product .", "ddlProduct", ModuleName);
        return false;
    }

    if (isBlank(document.getElementById('ddlKit').value)) {
        ValidationAlertBox("Please Select Kit.", "ddlKit", ModuleName);
        return false;
    }

    if (Dropdown_Validation(document.getElementById("ddlBatchLot"))) {
        ValidationAlertBox("Please Select Batch/Lot No .", "ddlBatchLot", ModuleName);
        return false;
    }


    if (CheckDateLessThenToday(document.getElementById('ExpiryDate').value)) {
        ExpiryDate.value = "";
        ValidationAlertBox("Expiry date should be greater than Current date.", "ExpiryDate", ModuleName);
        return false;
    }

    if (isBlank(document.getElementById('txtRemarks').value)) {
        ValidationAlertBox("Please enter Remarks.", "txtRemarks", ModuleName);
        return false;
    }

    return true;
}

function clearControl() {
    $('#ddlProductType').val(0).attr("selected", "selected");
    $('#ddlTransferIndi').val(0).attr("selected", "selected");
    $('#ddlProduct').val(0).attr("selected", "selected");
    $('#ddlBatchLot').val(0).attr("selected", "selected");
    $('#ddlProductType').val(0).attr("selected", "selected");
    $('#ExpiryDate').datepicker('setDate', null);
    $("#ddlKit").multiselect("clearSelection");
    $("#ddlKit").multiselect('refresh');
    $('#txtRemarks').val("").attr("selected", "selected");
}

function ViewMyProject() {
    $("#ddlProjectType").empty().append('<option selected="selected" value="0">Please Select Project Type</option>');
    var wStr = "vWorkspaceId = " + setworkspaceid + ""
    var WhereData = {
        WhereCondition_1: wStr,
        columnName_1: "Top 1 vProjectTypeCode,vProjectTypeName"
    }
    if (setworkspaceid != "") {
        $.ajax({
            url: BaseUrl + "PmsRecordFetch/View_MyProjects_FromBiznet",
            type: 'POST',
            data: WhereData,
            async: false,
            success: function (data) {
                data = data.Table;
                studytype = data[0].vProjectTypeCode;
            }
        });
    }
}

//Added by Rakesh
function GetProductType() {

    if (setworkspaceid != "") {
        var GetProductType = {
            Url: BaseUrl + "PmsGeneral/GetProductType/" + setworkspaceid,
            SuccessMethod: "SuccessMethod"
        }

        $.ajax({
            url: GetProductType.Url,
            type: 'GET',
            success: SuccessMethod,
            error: function () {
                SuccessorErrorMessageAlertBox("Product Type not found.", ModuleName);

                return false;
            }
        });

        function SuccessMethod(jsonData) {
            $("#ddlProductType").empty().append('<option selected="selected" value="0">Please Select Product Type</option>');
            for (var i = 0; i < jsonData.length; i++) {
                $("#ddlProductType").append($("<option></option>").val(jsonData[i].nProductTypeID).html(jsonData[i].vProductType));
            }
        }
    }
}

$('#ddlProductType').on("change", function () {
    if ($("#ddlProductType :selected").val() == "0") {
        $("#ddlProduct").find("option:not(:first)").remove();
        clearProductChagedata();
    }
    else {
        var nProductTypeID = $("#ddlProductType :selected").val()
        GetProduct(nProductTypeID);
        clearProductChagedata();
    }
})

function clearProductChagedata() {
    $("#ddlKit  option:selected").prop("selected", false);
    $("#ddlKit  option").remove();
    $('#ddlKit').multiselect('rebuild');
    $("#ddlBatchLot").find("option:not(:first)").remove();
    $('#ExpiryDate').val("");
}

function GetProduct(nProductTypeID) {
    var GetProductNameData = {
        vWorkSpaceId: setworkspaceid,
        nProductTypeID: nProductTypeID,
        cTransferIndi: "K",
    }

    var GetPmsProductBatchProductName = {
        Url: BaseUrl + "PMSGeneral/ProductName",
        SuccessMethod: "SuccessMethod",
        Data: GetProductNameData,
    }

    $.ajax({
        url: GetPmsProductBatchProductName.Url,
        type: 'POST',
        data: GetPmsProductBatchProductName.Data,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("No Product Found  !", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        var strdata = "";
        if (jsonData.length > 0) {
            $("#ddlProduct").empty().append('<option selected="selected" value="0">Please Select Product</option>');
            for (var i = 0; i < jsonData.length; i++)
                $("#ddlProduct").append($("<option></option>").val(jsonData[i].nProductNo).html(jsonData[i].vProductName));
        }
        else {
            $("#ddlProduct").empty().append('<option selected="selected" value="0">Please Select Product</option>');
        }
    }
}

var GetKit = function () {

    $('#ddlKit option').each(function () {
        $(this).remove();
    });

    $.ajax({
        url: BaseUrl + "PmsKitActivation/GetInActiveKitDtl",
        type: 'GET',
        data: { vWorkSpaceID: setworkspaceid, nProductNo: $("#ddlProduct").val() },
        asyc: false,
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("Kit Data Not Found !", "ddlKit", ModuleName);
        }
    });
    function SuccessMethod(jsonData) {
        var strdata = "";
        if (jsonData.length > 0) {
            for (var i = 0; i < jsonData.length; i++) {
                $("#ddlKit").append($("<option></option>").val(jsonData[i].nKitCreationNo).html(jsonData[i].vKitNo));
                $('#ddlKit').multiselect('rebuild');
            }
        }
    }
}

$('#ddlProduct').on('change', function () {
    clearProductChagedata();
    GetBatchLotNo();
    GetKit();
});

function GetBatchLotNo() {
    var projectid = setworkspaceid;
    var ProductNo = $('#ddlProduct').val();
    var GetPmsStudyReceiptBatchLotNo = {
        Url: BaseUrl + "PmsStudyProductReceipt/GetBatchLotNo",
        SuccessMethod: "SuccessMethod"
    }
    $.ajax({
        url: GetPmsStudyReceiptBatchLotNo.Url,
        type: 'GET',
        async: false,
        success: SuccessMethod,
        data: { id: projectid, projectno: ProductNo },
        error: function () {
            ValidationAlertBox("Batch/Lot Not Found !", "ddlProduct", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        var strdata = "";
        if (jsonData.length > 0) {
            $("#ddlBatchLot").empty().append('<option selected="selected" value="0">Please Select Batch/Lot No</option>');
            for (var i = 0; i < jsonData.length; i++)
                $("#ddlBatchLot").append($("<option></option>").val(jsonData[i].nStudyProductBatchNo).html(jsonData[i].vBatchLotNo));
        }
        else {
            $("#ddlBatchLot").empty().append('<option selected="selected" value="0">Please Select Batch/Lot No</option>');
        }
    }
}




$("#ddlBatchLot").on("change", function () {
    GetExpiryDate();
});

function GetExpiryDate() {
    var ExpiryDatedata = {
        vWorkSpaceId: setworkspaceid,
        nProductNo: $("#ddlProduct").val(),
        nStudyProductBatchNo: $("#ddlBatchLot").val(),
    }

    var GetPMSStudyProductReceiptExpiryData = {
        Url: BaseUrl + "PmsStudyProductReceipt/ExpiryDate",
        SuccessMethod: "SuccessMethod",
        Data: ExpiryDatedata
    }

    $.ajax({
        url: GetPMSStudyProductReceiptExpiryData.Url,
        type: "POST",
        data: GetPMSStudyProductReceiptExpiryData.Data,
        success: function (jsonData) {
            if (jsonData.length == 0) {
                $("#ExpiryDate").val("");
            }
            else {
                if (jsonData[0].dExpDate == "1900-01-01T00:00:00") {
                    $("#ExpiryDate").val("");
                }
                else {
                    var MonthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    var tmpexpirtydate = jsonData[0].dExpDate
                    var date = tmpexpirtydate.split("-");
                    var result = date[2].split("T")
                    var time = result[1].split(":");
                    var monthinid = parseInt(date[1]);

                    if (jsonData[0].cIsExpDate == "M") {
                        var datetime = MonthList[monthinid - 1] + "-" + date[0];
                    } else {
                        var datetime = result[0] + "-" + MonthList[monthinid - 1] + "-" + date[0];
                    }

                    $("#ExpiryDate").val(datetime);
                }
            }
        },
        error: function () {
            ValidationAlertBox("Expiry Date not found.", "BatchLotNo", ModuleName);
        }
    });
};

$('#btnKitAudit').on("click", function () {
    $('#StartDate').datepicker('setDate', null);
    $('#EndDate').datepicker('setDate', null);
    $('#tblKitActivationDetails_wrapper').css("display", "none");
    $("#KitActivationDetails").modal('show');
});

$('#btnGoKitActivation').on("click", function () {

    if (isBlank(document.getElementById('StartDate').value)) {
        ValidationAlertBox("Please select Start date !", "StartDate", ModuleName);
        return false;
    }

    if (isBlank(document.getElementById('EndDate').value)) {
        ValidationAlertBox("Please select End date !", "EndDate", ModuleName);
        return false;
    }


    if (productIds[$('#ddlProjectNo').val()] != undefined) {
        setworkspaceid = productIds[$('#ddlProjectNo').val()];
    }
    if (setworkspaceid == "" || setworkspaceid == undefined) {
        return false;
    }

    var PostData = {
        vWorkSpaceID: setworkspaceid,
        dStartDate: $('#StartDate').val(),
        dEndDate: $('#EndDate').val(),
    }

    $.ajax({
        url: BaseUrl + "PmsKitActivation/KitActivation_Audit",
        type: 'POST',
        data: PostData,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Audit data Not Found !", ModuleName);
        }
    });


    function SuccessMethod(jsonKitTypeData) {
        var StockAtHO = jsonKitTypeData;

        var ActivityDataset = [];

        if (StockAtHO != undefined) {
            for (var i = 0; i < StockAtHO.length; i++) {
                var InDataset = [];
                var InActive_c;
                //StockAtHO[i].ActivatedOn = StockAtHO[i].ActivatedOn.replace('T', ' ');

                InDataset.push(StockAtHO[i].ProjectNo, StockAtHO[i].KitName, StockAtHO[i].KitNo, StockAtHO[i].ActivatedOn, StockAtHO[i].ActivatedBy);
                ActivityDataset.push(InDataset);
            }
            otable = $('#tblKitActivationDetails').dataTable({
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
                "fnCreatedRow": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                },

                "aoColumns": [
                    { "sTitle": "ProjectNo" },
                    { "sTitle": "Kit Name" },
                    { "sTitle": "Kit No" },
                    { "sTitle": "Activated On" },
                    { "sTitle": "Activated By" },
                ],
                "oLanguage": {
                    "sEmptyTable": "No Record Found",
                },
            });
        }
        else {
            alert("Data not available");
            return false;
        }
    }
});
