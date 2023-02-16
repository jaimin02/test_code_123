var productIds = new Object();
var setworkspaceid = "";
var ModuleName = "Stock Receipt Report"

$(function () {
    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('.modal').modal('hide');

    CheckSetProject();

    var iUserNo = $("#hdnuserid").val();

    $('#dFromDate').datetimepicker({ format: 'DD-MMMM-YYYY', });
    $('#dToDate').datetimepicker({ format: 'DD-MMMM-YYYY', maxDate:new Date()});

    var dt = new Date();
    jQuery('#dFromDate').data("DateTimePicker").maxDate(dt);

    //jQuery('#dToDate').data("DateTimePicker").minDate(dt);
    $("#dToDate").val('');

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

    $('#DDLBatchLot').multiselect({
        nonSelectedText: 'Please Select Batch/Lot/Lot No',
        buttonClass: 'form-control',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        numberDisplayed: 2,
    });

    $('#DDLProductType').multiselect({
        nonSelectedText: 'Please Select Product Type',
        buttonClass: 'form-control',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        numberDisplayed: 2,
        onDropdownHidden: function (event) {
            GetBatchLotNo();
        }
    });

    //GetProject No
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
                    $('#ddlProjectNodashboard').val(vProjectNo);

                    //GetProductType();
                    GetProductName();
                },
            });
        }
    });

    $('#DDLProjectNo').on('blur', function () {
        //GetProductType();
        GetProductName();
    });

    $("#btnGo").on("click", function () {
        var nProductNo = "";
        var nBatchNo = "";

        if (ValidateForm()) {
            document.getElementById('StockReceiptReport').style.visibility = "visible";
            $('#collapseOne').collapse('hide');
            $('#collapseTwo').collapse('show');




            //Multiple Product No

            var nProductNoStr = $("#DDLProductType").val();
            nProductNo = nProductNoStr.toString()

            nProductNo = ',' + nProductNo + ',';
            //MultipleBatchNo

            var nBatchNoStr = $("#DDLBatchLot").val();
            nBatchNo = nBatchNoStr.toString()

            nBatchNo = ',' + nBatchNo + ',';
                      
            var Data_s = {
                vWorkSpaceId: setworkspaceid,
                dFromDate: $("#dFromDate").val(),
                dTodate: $("#dToDate").val(),
                nProductNo: nProductNo,
                nBatchNo: nBatchNo
            }

            var GetStockReceiptReportData = {
                Url: BaseUrl + "PmsGeneralReport/PostStockReceiptReportDetail",
                SuccessMethod: "SuccessMethod",
                Data: Data_s
            }

            GetAllStockReceiptReportDetailMaster(GetStockReceiptReportData.Url, GetStockReceiptReportData.SuccessMethod, GetStockReceiptReportData.Data);

        }
    });

    $("#btnClear").on("click", function () {
        cleardata();
    });

    if (setworkspaceid != "") {
        //GetProductType();
        GetProductName();
    }
});

var GetAllStockReceiptReportDetailMaster = function (Url, SuccessMethod, Data) {
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
        var ActivityDataset = [];
        var expdate = "";
        var mfgdate = "";
        if (jsonData.length > 0) {
            document.getElementById('divexport').style.visibility = "visible";
        }
        else {
            document.getElementById('divexport').style.visibility = "hidden";
        }

        for (var i = 0; i < jsonData.length; i++) {
            var InDataset = [];
                   

            if (jsonData[i].dExpDate != null) {
                var tempExpDate = jsonData[i].dExpDate.split(" ");
                expdate = tempExpDate[0];
            }

            InDataset.push(jsonData[i].vDocumentNo,
                jsonData[i].vWorkSpaceId,
                jsonData[i].vToWorkSpaceId,
                jsonData[i].vSiteAddress,
                jsonData[i].vBatchLotNo,
                jsonData[i].ProductDescription,
                jsonData[i].vBatchLotNo,
                jsonData[i].dExpDate,
                jsonData[i].Qty
                );
            ActivityDataset.push(InDataset);
        }
        otable = $('#tblPmsStockReceiptReport').dataTable({
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
            "sScrollXInner": "3000" /* It varies dynamically if number of columns increases */,
            "aoColumns": [
                { "sTitle": "Document No" },
                { "sTitle": "Protocol Number" },
                { "sTitle": "Site Number" },
                { "sTitle": "Site Address" },
                { "sTitle": "Batch/Lot/Lot No" },
                { "sTitle": "Product Description" },
                { "sTitle": "Batch Number" },
                { "sTitle": "Expiry Of Product" },
                { "sTitle": "Quantity Of Product" },
            ],
            "columnDefs": [
                {
                    "targets": [0],
                    "visible": false,
                },
                { "width": "4%", "targets": 1 },
                { "width": "5%", "targets": 2 },
                { "width": "5%", "targets": 3 },
                { "width": "5%", "targets": 4 },
                { "width": "4%", "targets": 5 },
                { "width": "5%", "targets": 6 },
                { "width": "5%", "targets": 7 },
                { "width": "5%", "targets": 8 }, 
                { "width": "6%", "targets": 9 },
            ],
        });
        GetStockParaSessionDetail();
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
            SuccessorErrorMessageAlertBox("Project not found.", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        //$('#DDLProduct option').each(function () {
        //    $(this).remove();
        //});
        //$("#DDLProduct").multiselect("clearSelection");

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
    }
}

function toggleIcon(e) {
    $(e.target)
        .prev('.panel-heading')
        .find(".more-less")
        .toggleClass('  glyphicon-plus glyphicon-minus');
}

function ValidateForm() {
    var FromDate = new Date($('#dFromDate').val());
    var toDate = new Date($('#dToDate').val());

    if (isBlank(document.getElementById('DDLProjectNo').value)) {
        ValidationAlertBox("Please enter Project No.", "DDLProjectNo", ModuleName);
        return false
    }

    else if (isBlank(document.getElementById('DDLProductType').value)) {
        ValidationAlertBox("Please select Product Type.", "DDLProductType", ModuleName);
        return false;
    }
    else if (isBlank(document.getElementById('DDLBatchLot').value)) {
        ValidationAlertBox("Please select Batch Lot number.", "DDLBatchLot", ModuleName);
        return false;
    }

    else if ($("#dFromDate").val() == "") {
        ValidationAlertBox("Please select From Date.", "dFromDate", ModuleName);
        return false;
    }

    else if ($("#dToDate").val() == "") {
        ValidationAlertBox("Please select To Date.", "dToDate", ModuleName);
        return false;
    }

    else if (FromDate > toDate) {
        SuccessorErrorMessageAlertBox("From Date should be less than To Date.", ModuleName);
        return false;
    }

    else {
        return true;
    }
}

function GetStockParaSessionDetail() {
    var nProductNo = "";
    var nBatchNo = "";
    var ProductNo_Arr = [];

    //$('#DDLProduct :selected').each(function (i, selected) {
    //    ProductNo_Arr.push({
    //        nProductNo: $(selected).val()
    //    });
    //});

    for (i = 0; i < ProductNo_Arr.length; i++) {
        nProductNo = nProductNo + ProductNo_Arr[i]["nProductNo"] + ",";
    }
    nProductNo = ',' + nProductNo;
    //MultipleBatchNo

    if (productIds[$('#DDLProjectNo').val()] != undefined) {
        setworkspaceid = productIds[$('#DDLProjectNo').val()];
    }
    var Data_s = {
        vWorkSpaceId: setworkspaceid,
        dFromDate: $("#dFromDate").val(),
        dTodate: $("#dToDate").val(),
        nProductNo: nProductNo,
    }

    var url = WebUrl + "PmsStockReceiptReport/GetSessionDetail";
    $.ajax({
        url: url,
        type: 'get',
        data: Data_s,
        async: false,
        success: function (data) {
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Data not found.", ModuleName);
        }
    });
}

function cleardata() {
    $('#DDLProjectNo').val("");
    //$("#DDLProduct").multiselect("clearSelection");
    $("#DDLProductType").multiselect("clearSelection");
    $('.multiselect-container li').remove();

    $("#dFromDate").val("");
    $("#dToDate").val("");
    $("#divexport").hide();
    //$("#StockReceiptReport").hide();
    $('#collapseTwo').collapse('hide');
    $('#dFromDate').data("DateTimePicker").clear();
    $('#dToDate').data("DateTimePicker").clear();
    var ActivityDataset = [];
    otable = $('#tblPmsStockReceiptReport').dataTable({
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
        "sScrollXInner": "3000" /* It varies dynamically if number of columns increases */,
        "aoColumns": [
            { "sTitle": "vWorkSpaceId" },
            { "sTitle": "Project No" },
            { "sTitle": "Product" },
            { "sTitle": "Product Type" },
            { "sTitle": "Batch/Lot/Lot No" },
            { "sTitle": "Stock Qty" },
            { "sTitle": "Retention Qty" },
            { "sTitle": "Verification Qty" },
            { "sTitle": "Total Stock" },
            { "sTitle": "Storage Location Name " },
            { "sTitle": "Received From" },
            { "sTitle": "Storage Area Name" },
            { "sTitle": "Reference No" },
            { "sTitle": "Shipment No" },
            { "sTitle": "Transporter Name" },
            //{ "sTitle": "Product Condition" },
            { "sTitle": "Receipt Date" },
            { "sTitle": "Mfg Date" },
            { "sTitle": "Expiry Date" },
        ],
        "columnDefs": [
            {
                "targets": [0],
                "visible": false,
            },
            { "width": "4%", "targets": 1 },
            { "width": "5%", "targets": 2 },
            { "width": "5%", "targets": 3 },
            { "width": "5%", "targets": 4 },
            { "width": "4%", "targets": 5 },
            { "width": "5%", "targets": 6 },
            { "width": "5%", "targets": 7 },
            { "width": "5%", "targets": 8 },
            { "width": "6%", "targets": 9 },
            { "width": "5%", "targets": 10 },
            { "width": "9%", "targets": 11 },
            { "width": "5%", "targets": 12 },
            { "width": "5%", "targets": 13 },
            { "width": "5%", "targets": 14 },
            { "width": "5%", "targets": 15 },
            { "width": "8%", "targets": 16 },
            { "width": "5%", "targets": 17 },
            //{ "width": "5%", "targets": 18 },
        ],
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
        type: "GET",
        url: BaseUrl + "PmsGeneral/GetSetProjectDetails",
        data: { id: PassData.iUserId },
        //contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (jsonData) {
            if (jsonData.length > 0) {
                $('#ddlProjectNodashboard').val(jsonData[0].vProjectNo);
                setworkspaceid = jsonData[0].vWorkSpaceId;
            }
            else {
                $('#ddlProjectNodashboard').val('');
            }
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Project not found.", ModuleName);
        }
    });

}


function GetBatchLotNo() {
    var projectid = setworkspaceid;
    var productid = $("#DDLProductType").val().toString();

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

function GetProductName() {
    $('#DDLProductType option').each(function () {
        $(this).remove();
    });

    if (productIds[$('#DDLProjectNo').val()] != undefined) {
        setworkspaceid = productIds[$('#DDLProjectNo').val()];
    }

    var GetProductNameData = {
        vWorkSpaceId: setworkspaceid,
        nProductTypeID: 0,
        cTransferIndi: 'P'
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
        $("#DDLProductType").multiselect("clearSelection");
        $("#DDLBatchLot").multiselect("clearSelection");
        $('.multiselect-container li').remove();
        var strdata = "";
        if (jsonData.length > 0) {
            for (var i = 0; i < jsonData.length; i++)
                $("#DDLProductType").append($("<option></option>").val(jsonData[i].nProductNo).html(jsonData[i].vProductName));
            $('#DDLProductType').multiselect('rebuild');
        }
        else {
            $("#DDLProductType").empty().append('<option selected="selected" value="0">Please Select Product</option>');
        }
    }
}