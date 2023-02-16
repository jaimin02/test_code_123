
var productIds = new Object();
var ProductNoArry = [];
var vProductNo = "";
var setworkspaceid = "";
var ModuleName = "Product Stock Report";

$(function () {
    CheckSetProject();
    
    $('#DDLProduct').multiselect({
        nonSelectedText: 'Please Select Product',
        buttonClass: 'form-control',
        buttonWidth: '55%',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        numberDisplayed: 2,
        onDropdownHidden: function (event) {
            GetBatchLotNo();
        }
    });

    $('#DDLBatchLot').multiselect({
        nonSelectedText: 'Please Select Batch/Lot/Lot No',
        buttonClass: 'form-control',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        numberDisplayed: 2,
    });


    GetProductName();

    //$('#dFromDate').datetimepicker({ format: 'DD-MMMM-YYYY', });
    //$('#dToDate').datetimepicker({ format: 'DD-MMMM-YYYY', maxDate: new Date() });

    //var dt = new Date();
    //jQuery('#dFromDate').data("DateTimePicker").maxDate(dt);

    //jQuery('#dToDate').data("DateTimePicker").minDate(dt);
    //$("#dToDate").val('');

    //jQuery("#dFromDate").on("dp.change", function (e) {
    //    jQuery('#dToDate').data("DateTimePicker").minDate(e.date);
    //});
    //jQuery("#dToDate").on("dp.change", function (e) {
    //    jQuery('#dFromDate').data("DateTimePicker").maxDate(e.date);
    //});

    $('.panel-group').on('hidden.bs.collapse', toggleIcon);
    $('.panel-group').on('shown.bs.collapse', toggleIcon);

    $('#collapseOne').collapse('show');


    $('#headingOne').on("click", function () {
        $('#collapseOne').collapse('show');
        $('#collapseTwo').collapse('hide');

    });

    $('#headingTwo').on("click", function () {
        $('#collapseOne').collapse('hide');
        $('#collapseTwo').collapse('show');
    });

    $('#btnExit').on("click", function () {
        ConfirmAlertBox(ModuleName, $("#RedirectToHome").val());
    });

    $('#DDLBatchLot').multiselect({
        nonSelectedText: 'Please Select Batch/Lot/Lot No',
        buttonClass: 'form-control',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        numberDisplayed: 2,

    });

    //GetProject No-----------------
    var GetProjectNo = {
        //Url: BaseUrl + "PmsProductBatch/GetProjectNo",
        Url: BaseUrl + "PmsGeneral/GetScopeWiseProject",
        SuccessMethod: "SuccessMethod"
    }
    $('#DDLProjectNo').on('change keyup paste mouseup', function () {

        if ($('#DDLProjectNo').val().length == 2) {
            var ProjectNoDataTemp = {
                //vProjectNo: $('#DDLProjectNo').val(),
                iUserId: $("#hdnuserid").val(),
                vStudyCode: $('#DDLProjectNo').val()
                //vProjectTypeCode: $("#hdnscopevalues").val(),
            }
            GetPmsProjectNoStockReport(GetProjectNo.Url, GetProjectNo.SuccessMethod, ProjectNoDataTemp);
        }
        else if ($('#DDLProjectNo').val().length < 2) {
            $("#DDLProjectNo").autocomplete({
                source: "",
                change: function (event, ui) { },
                select: function (event, ui) {
                    vProjectNo = ui.item.value;
                    $('#DDLProjectNo').val(vProjectNo);

                    BindData();
                   
                },
            });
        }
    });


    $("#btnGo").on("click", function () {

        var nProductNo = "";
        var nBatchNo = "";
        if (ValidateForm()) {
            document.getElementById('StockReport').style.visibility = "visible";


            $('#collapseOne').collapse('hide');
            $('#collapseTwo').collapse('show');


            //Multiple Product No

            var nProductNoStr = $("#DDLProduct").val();
            nProductNo = nProductNoStr.toString()

            nProductNo = ',' + nProductNo + ',';
            //MultipleBatchNo

            var nBatchNoStr = $("#DDLBatchLot").val();
            nBatchNo = nBatchNoStr.toString()

            nBatchNo = ',' + nBatchNo + ',';

            if (productIds[$('#DDLProjectNo').val()] != undefined) {
                setworkspaceid = productIds[$('#DDLProjectNo').val()];
            }
            var Data_s = {
                vWorkSpaceId: setworkspaceid,
                nBatchNo: nBatchNo,
                //dFromDate: $("#dFromDate").val(),
                //dTodate: $("#dToDate").val(),
                nProductNo: nProductNo

            }
            var GetStockReportData = {
                Url: BaseUrl + "PmsGeneralReport/PostStockReportDetail",
                SuccessMethod: "SuccessMethod",
                Data: Data_s
            }
            GetAllStockReportDetailMaster(GetStockReportData.Url, GetStockReportData.SuccessMethod, GetStockReportData.Data);
            //document.getElementById('divexport').style.visibility = "visible";


        }
    });
    $("#btnClear").on("click", function () {

        cleardata();

    });
});


$('#DDLProjectNo').on('blur', function () {
    BindData();
});

function GetProductName() {
    $('#DDLProduct option').each(function () {
        $(this).remove();
    });
   
    var GetProductNameData = {
        vWorkSpaceId: setworkspaceid,
        nProductTypeID: 0,
        cTransferIndi:'P'
    }

    var GetPmsQualityCheckProductName = {
        Url: BaseUrl + "PMSGeneral/ProductName",
        SuccessMethod: "SuccessMethod",
        Data: GetProductNameData,
    }

    $.ajax({
        url: GetPmsQualityCheckProductName.Url,
        type: 'POST',
        async: false,
        data: GetPmsQualityCheckProductName.Data,
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("Product not found.", "DDLProduct", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        $("#DDLProduct").multiselect("clearSelection");
        $("#DDLBatchLot").multiselect("clearSelection");
        $('.multiselect-container li').remove();
        var strdata = "";
        if (jsonData.length > 0) {
            for (var i = 0; i < jsonData.length; i++)
                $("#DDLProduct").append($("<option></option>").val(jsonData[i].nProductNo).html(jsonData[i].vProductName));
            $('#DDLProduct').multiselect('rebuild');
        }
        else {
            $("#DDLProduct").empty().append('<option selected="selected" value="0">Please Select Product</option>');
        }
    }
}

var GetPmsProjectNoStockReport = function (Url, SuccessMethod, ProjectNoDataTemp) {
    $.ajax({
        url: Url,
        type: 'GET',
        //data: { id: ProjectNoDataTemp.iUserId, projectno: ProjectNoDataTemp.vProjectNo, typecode: ProjectNoDataTemp.vProjectTypeCode },
        data: { iUserId: ProjectNoDataTemp.iUserId, vStudyCode: ProjectNoDataTemp.vStudyCode },
        async: false,
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("Project not found.", "DDLProjectNo", ModuleName);
        }
    });
    function SuccessMethod(jsonData) {
        var jsonObj = jsonData;
        var sourceArr = [];
        //for (var i = 0; i < jsonObj.length; i++) {
        //    sourceArr.push("[ " + jsonObj[i].vProjectNo + " ]" + " " + jsonObj[i].vRequestId);
        //    productIds["[ " + jsonObj[i].vProjectNo + " ]" + " " + jsonObj[i].vRequestId] = jsonObj[i].vWorkspaceId;
        //}

        for (var i = 0; i < jsonObj.length; i++) {
            sourceArr.push("[ " + jsonObj[i].vStudyCode + " ]" + " " + jsonObj[i].vStudyName);
            productIds["[ " + jsonObj[i].vStudyCode + " ]" + " " + jsonObj[i].vStudyName] = jsonObj[i].nStudyNo;
        }

        $("#DDLProjectNo").autocomplete({
            source: sourceArr,
            change: function (event, ui) { }
        });

    }
}

function ValidateForm() {
    var FromDate = new Date($('#dFromDate').val());
    var toDate = new Date($('#dToDate').val())

    if (isBlank(document.getElementById('DDLProjectNo').value)) {
        ValidationAlertBox("Please select Project No.", "DDLProjectNo", ModuleName);
        return false
    }

    else if (isBlank(document.getElementById('DDLProduct').value)) {
        ValidationAlertBox("Please select Product.", "DDLProduct", ModuleName);
        return false;
    }
    else if (isBlank(document.getElementById('DDLBatchLot').value)) {
        ValidationAlertBox("Please select Batch/Lot/Lot No.", "DDLBatchLot", ModuleName);
        return false;
    }
    else if ($("#dFromDate").val() == "") {
        ValidationAlertBox("Please select From Date.", "dFromDate", ModuleName);
        return false;
    }
    else if ($("#dToDate").val() == "") {
        ValidationAlertBox("Please select To date.", "dToDate", ModuleName);
        return false;
    }
    else if (FromDate > toDate) {
        ValidationAlertBox("From Date should be less than to date.", "dToDate", ModuleName);
        return false;
    }
    else {
        return true;
    }
}

function toggleIcon(e) {
    $(e.target)
        .prev('.panel-heading')
        .find(".more-less")
        .toggleClass('  glyphicon-plus glyphicon-minus');
}

function GetBatchLotNo() {
    var projectid = setworkspaceid;
    var productid = $("#DDLProduct").val().toString();

    $.ajax({
        url: BaseUrl + "PmsStudyProductReceipt/GetBatchLotNo",
        type: 'GET',
        data: { id: projectid, projectno: productid },
        async: false,
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("Batch/Lot/Lot No not found.", "DDLBatchLot", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        $('#DDLBatchLot option').each(function () {
            $(this).remove();
        });

        var strdata = "";
        if (jsonData.length > 0) {
            for (var i = 0; i < jsonData.length; i++)
                $("#DDLBatchLot").append($("<option></option>").val(jsonData[i].nStudyProductBatchNo).html(jsonData[i].vBatchLotNo));
            $('#DDLBatchLot').multiselect('rebuild');
        }
        else {
            $("#DDLBatchLot").empty().append('<option selected="selected" value="0">Please Select Batch/Lot/Lot No </option>');
        }
    }
}

var GetAllStockReportDetailMaster = function (Url, SuccessMethod, Data) {

    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        async: false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Data not found.", ModuleName);
        }
    });
    function SuccessMethod(jsonData) {

        var strdata = "";
        var tr = "";

        if (jsonData.length > 0) {
            document.getElementById('divexport').style.visibility = "visible";
        }
        else {
            document.getElementById('divexport').style.visibility = "hidden";
        }

        var ActivityDataset = [];
        for (var i = 0; i < jsonData.length; i++) {
            var InDataset = [];
            //if (jsonData[i].cLocationIndicator == "P") {
            //    jsonData[i].cLocationIndicator = "Prime";
            //}
            //else if (jsonData[i].cLocationIndicator == "Q") {
            //    jsonData[i].cLocationIndicator = "Quarantine";
            //}
            InDataset.push(jsonData[i].vWorkSpaceId, jsonData[i].vProjectNo, jsonData[i].vProductName, jsonData[i].vProductType, jsonData[i].vBatchLotNo, jsonData[i].RetentionQty, jsonData[i].VerificationQty, jsonData[i].TotalQty, jsonData[i].vStorageType);
            ActivityDataset.push(InDataset);
        }

        otable = $('#tblPmsStockReport').dataTable({
            "bJQueryUI": true,
            "sPaginationType": "full_numbers",
            "bLengthChange": true,
            "bProcessing": true,
            "bSort": true,
            "autoWidth": false,
            "bInfo": true,
            "aaData": ActivityDataset,
            "bDestroy": true,
            "oLanguage": {
                "sEmptyTable": "No Record found"
            },
            "sScrollX": "100%",
            "sScrollXInner": "1300" /* It varies dynamically if number of columns increases */,

            "aoColumns": [
                { "sTitle": "vWorkSpaceId" },
                { "sTitle": "Project No" },
                { "sTitle": "Product " },
                { "sTitle": "Product  Type " },
                { "sTitle": "Batch/Lot/Lot No " },
                //{ "sTitle": "Total Qty" },
                { "sTitle": "Retetion Qty" },
                { "sTitle": "Verification Qty" },
                { "sTitle": "Current Stock" },
                { "sTitle": "Storage Location" },
            ],
            "columnDefs": [
               {
                   "targets": [0],
                   "visible": false,
               }
            ],
        });
        GetStockParaSessionDetail();
    }


}

function GetStockParaSessionDetail() {

    var nProductNo = "";
    var nBatchNo = "";
    var ProductNo_Arr = [];

    $('#DDLProduct :selected').each(function (i, selected) {
        ProductNo_Arr.push({
            nProductNo: $(selected).val()
        });
    });
    for (i = 0; i < ProductNo_Arr.length; i++) {

        nProductNo = nProductNo + ProductNo_Arr[i]["nProductNo"] + ",";

    }
    nProductNo = ',' + nProductNo;
    //MultipleBatchNo
    var BatchNoNo_Arr = [];
    $('#DDLBatchLot :selected').each(function (i, selected) {
        BatchNoNo_Arr.push({
            nBatchNo: $(selected).val()
        });
    });
    for (i = 0; i < BatchNoNo_Arr.length; i++) {

        nBatchNo = nBatchNo + BatchNoNo_Arr[i]["nBatchNo"] + ",";

    }
    nBatchNo = ',' + nBatchNo;
    var Data_s = {
        vWorkSpaceId: setworkspaceid,
        nBatchNo: nBatchNo,
        //dFromDate: $("#dFromDate").val(),
        //dTodate: $("#dToDate").val(),
        nProductNo: nProductNo

    }

    var URLSessionDetails = WebUrl + "ProductStockReport/GetSessionDetail";
    $.ajax({
        url: URLSessionDetails,
        type: 'get',
        data: Data_s,
        async: false,
        success: function (data) {

        },
        error: function () {

        }
    });

}

function cleardata() {

    $('#DDLProjectNo').val("");
    $("#DDLProduct").multiselect("clearSelection");
    $("#DDLBatchLot").multiselect("clearSelection");
    $('.multiselect-container li').remove();

    $("#dFromDate").val("");
    $("#dToDate").val("");
    $("#divexport").hide();
    $('#dFromDate').data("DateTimePicker").clear();
    $('#dToDate').data("DateTimePicker").clear();

    var ActivityDataset = [];
    $("#tblPmsStockReport tbody tr").remove();
    otable = $('#tblPmsStockReport').dataTable({
        "bDestroy": true,
        "bJQueryUI": true,
        "aaData": ActivityDataset,
        "oLanguage": {
            "sEmptyTable": "No Record Found",
        },
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
    // For Server use

    $.ajax({
        type: "GET",
        url: BaseUrl + "PmsGeneral/GetSetProjectDetails",
        data: { id: PassData.iUserId },
        //contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (jsonData) {
                    if (jsonData.length > 0) {
                        $('#DDLProjectNo').val(jsonData[0].vProjectNo);
                        setworkspaceid = jsonData[0].vWorkSpaceId;
                    }
                    else {
                        $('#DDLProjectNo').val('');
                    }
                },
        error: function () {
            SuccessorErrorMessageAlertBox("Project not found.", ModuleName);
        }
    });
   
}

function GetProductType() {
    $('#DDLProductType option').each(function () {
        $(this).remove();
    });

    var GetProductType = {
        Url: BaseUrl + "PmsGeneral/GetProductType/" + setWorkspaceId,
        SuccessMethod: "SuccessMethod"
    }


    // For Server use

    $.ajax({
        type: "GET",
        url: BaseUrl + "PmsGeneral/GetProductType",
        data: { id: setWorkspaceId },
       // contentType: "application/json; charset=utf-8",
        dataType: "json",
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

function BindData() {
    if (productIds[$('#DDLProjectNo').val()] != undefined) {
        setworkspaceid = productIds[$('#DDLProjectNo').val()];
    }
    var projectid = setworkspaceid;
    var url = WebUrl + "PmsStudyProduct/GetSessionDetail";
     

    if (projectid > 0) {
        GetProductName();
        //GetExportToExcelDetails();
    }
    else {
        $("#divexport").css("visibility", "hidden");
        //alert('Please Select ProjectNo');
    }
}