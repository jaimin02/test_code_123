var productIds = new Object();
var ProductNoArry = [];
var vProductNo = "";
var setworkspaceid = "";
var ModuleName = "Product Movement Report";

$(function () {
    $('#dFromDate').datetimepicker({ format: 'DD-MMMM-YYYY', });
    $('#dToDate').datetimepicker({ format: 'DD-MMMM-YYYY', });

    var dt = new Date();
    jQuery('#dFromDate').data("DateTimePicker").maxDate(dt);

    jQuery('#dToDate').data("DateTimePicker").maxDate(dt);
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

    $("#btnClear").on("click", function () {
        cleardata();
    });

    $("#btnGo").on("click", function () {
        if (ValidateForm()) {
            document.getElementById('StockReport').style.visibility = "visible";
            $('#collapseOne').collapse('hide');
            $('#collapseTwo').collapse('show');

            if (productIds[$('#DDLProjectNo').val()] != undefined) {
                setworkspaceid = productIds[$('#DDLProjectNo').val()];
            }
            var Data_s = {
                dFromDate: $("#dFromDate").val(),
                dTodate: $("#dToDate").val(),
                TranIndi: $("#ddlType :selected").val()
            }
            var GetStockReportData = {
                Url: BaseUrl + "PmsGeneralReport/ProductReceiptReport",
                SuccessMethod: "SuccessMethod",
                Data: Data_s
            }
            GetAllStockReceiptReport(GetStockReportData.Url, GetStockReportData.SuccessMethod, GetStockReportData.Data);
           
        }
    });
});

function cleardata() {
    $("#dFromDate").val("");
    $('#dFromDate').data("DateTimePicker").clear();
    $("#dToDate").val("");
    $('#dToDate').data("DateTimePicker").clear();
    $("#StockReport").hide();
    $('#collapseTwo').collapse('hide');
    $("#divexport").hide();
    
    $("#ddlType").val("0");

    var ActivityDataset = [];
    otable = $('#tblPmsStockReportReceipt').dataTable({
        "bJQueryUI": true,
        "sPaginationType": "full_numbers",
        "bLengthChange": true,
        "iDisplayLength": 10,
        "bProcessing": true,
        "bSort": true,
        "autoWidth": false,
        "aaData": ActivityDataset,
        "bInfo": true,
        "aaSorting": [],
        "bAutoWidth": false,
        "bDestroy": true,
        "sScrollX": "100%",
        "sScrollXInner": "2200" /* It varies dynamically if number of columns increases */,
        "oLanguage": {
            "sEmptyTable": "No Record Found",
        },
        "aoColumns": [
            { "sTitle": "From Project" },
            { "sTitle": "To Project" },
            { "sTitle": "Receipt No" },
            { "sTitle": "Receipt Date" },
            { "sTitle": "Dispatch Ref. No" },
            { "sTitle": "Transporter Name" },
            { "sTitle": "LR No." },
            { "sTitle": "LR Date" },
            { "sTitle": "Product Type" },
            { "sTitle": "Product Name" },
            { "sTitle": "Batch/Lot/Lot No" },
            { "sTitle": "Received Qty" },
            { "sTitle": "No Bin/Pallet/Crate/Locker/Container/Shelf/Box/Boxes/Rack" },
            { "sTitle": "Receipt By" }
        ],
        "columnDefs": [
            { "width": "4%", "targets": 0 },
            { "width": "4%", "targets": 1 },
            { "width": "3%", "targets": 2 },
            { "width": "5%", "targets": 3 },
            { "width": "4%", "targets": 4 },
            { "width": "5%", "targets": 5 },
            { "width": "3%", "targets": 6 },
            { "width": "4%", "targets": 7 },
            { "width": "4%", "targets": 8 },
            { "width": "7%", "targets": 9 },
            { "width": "4%", "targets": 10 },
            { "width": "4%", "targets": 11 },
            { "width": "3%", "targets": 12 },
            { "width": "8%", "targets": 13 },
        ],
    });

}

function toggleIcon(e) {
    $(e.target)
        .prev('.panel-heading')
        .find(".more-less")
        .toggleClass('  glyphicon-plus glyphicon-minus');
}

function ValidateForm() {
    var FromDate = new Date($('#dFromDate').val());
    var toDate = new Date($('#dToDate').val())

    if ($("#dFromDate").val() == 0) {
        ValidationAlertBox("Please select From Date.", "dFromDate", ModuleName);
        return false;
    }
    else if ($("#dToDate").val() == 0) {
        ValidationAlertBox("Please select To date.", "dToDate", ModuleName);
        return false;
    }
    else if (FromDate > toDate) {
        ValidationAlertBox("From Date should be less than To Date.", "dToDate", ModuleName);
        return false;
    }
    else if (Dropdown_Validation(document.getElementById("ddlType"))) {
        ValidationAlertBox("Please select Report Type.", "ddlType", ModuleName);
        return false;
    }
    else
    {
        return true;
    }
}

var GetAllStockReceiptReport = function (Url, SuccessMethod, Data) {

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
        if (jsonData.length > 0) {
            document.getElementById('divexport').style.visibility = "visible";
            //$("#divexport").show();
        }
        else {
            document.getElementById('divexport').style.visibility = "hidden";
            //$("#divexport").hide();
        }


        var strdata = "";
        var tr = "";
        var reporttype = $("#ddlType :selected").text();
        
        if (reporttype == "Product Receipt") {
            $("#StockReportReceipt").show();
            $("#StockReport").hide();
            var ActivityDataset = [];
            for (var i = 0; i < jsonData.length; i++) {
                var InDataset = [];
                InDataset.push(jsonData[i].FromProject, jsonData[i].ToProject, jsonData[i].ReceiptNo, jsonData[i].ReceiptDate, jsonData[i].DispatchRefNo, jsonData[i].TransporterName, jsonData[i].LRNo, jsonData[i].LRDate, jsonData[i].StudyProductType, jsonData[i].StudyProduct, jsonData[i].StudyProductBatch, jsonData[i].ReceivedQty, jsonData[i].Box, jsonData[i].vModifyBy + "/ </br> " + jsonData[i].dModifyOn);
                ActivityDataset.push(InDataset);
            }
            otable = $('#tblPmsStockReportReceipt').dataTable({
                "bJQueryUI": true,
                "sPaginationType": "full_numbers",
                "bLengthChange": true,
                "iDisplayLength": 10,
                "bProcessing": true,
                "bSort": true,
                "autoWidth": false,
                "aaData": ActivityDataset,
                "bInfo": true,
                "aaSorting": [],
                "bAutoWidth": false,
                "bDestroy": true,
                "sScrollX": "100%",
                "sScrollXInner": "2200" /* It varies dynamically if number of columns increases */,
                "oLanguage": {
                    "sEmptyTable": "No Record Found",
                },
                "aoColumns": [
                    { "sTitle": "From Project" },
                    { "sTitle": "To Project" },
                    { "sTitle": "Receipt No" },
                    { "sTitle": "Receipt Date" },
                    { "sTitle": "Dispatch Ref. No" },
                    { "sTitle": "Transporter Name" },
                    { "sTitle": "LR No." },
                    { "sTitle": "LR Date" },
                    { "sTitle": "Product Type" },
                    { "sTitle": "Product Name" },
                    { "sTitle": "Batch/Lot/Lot No" },
                    { "sTitle": "Received Qty" },
                    { "sTitle": "No Bin/Pallet/Crate/Locker/Container/Shelf/Box/Boxes/Rack" },
                    { "sTitle": "Receipt By" }
                ],
                "columnDefs": [
                    { "width": "4%", "targets": 0 },
                    { "width": "4%", "targets": 1 },
                    { "width": "3%", "targets": 2 },
                    { "width": "5%", "targets": 3 },
                    { "width": "4%", "targets": 4 },
                    { "width": "5%", "targets": 5 },
                    { "width": "3%", "targets": 6 },
                    { "width": "4%", "targets": 7 },
                    { "width": "4%", "targets": 8 },
                    { "width": "7%", "targets": 9 },
                    { "width": "4%", "targets": 10 },
                    { "width": "4%", "targets": 11 },
                    { "width": "3%", "targets": 12 },
                    { "width": "8%", "targets": 13 },
                ],
            });
        }

        else if (reporttype == "Product Transfer") {
            $("#StockReportReceipt").hide();
            $("#StockReport").show();
            var ActivityDataset = [];
            for (var i = 0; i < jsonData.length; i++) {
                var InDataset = [];
                InDataset.push(jsonData[i].FromProject, jsonData[i].ToProject, jsonData[i].TransferNo, jsonData[i].TransferDate, jsonData[i].TransporterName, jsonData[i].LRNo, jsonData[i].LRDate, jsonData[i].StudyProductType, jsonData[i].StudyProduct, jsonData[i].StudyProductBatch, jsonData[i].TransferQty, jsonData[i].Box, jsonData[i].vModifyBy + "/ </br> " + jsonData[i].dModifyOn);
                ActivityDataset.push(InDataset);
            }
            otable = $('#tblPmsStockReport').dataTable({
                "bJQueryUI": true,
                "sPaginationType": "full_numbers",
                "bLengthChange": true,
                "iDisplayLength": 10,
                "bProcessing": true,
                "bSort": true,
                "autoWidth": false,
                "aaData": ActivityDataset,
                "bInfo": true,
                "aaSorting": [],
                "bAutoWidth": false,
                "bDestroy": true,
                "sScrollX": "100%",
                "sScrollXInner": "2000" /* It varies dynamically if number of columns increases */,
                "oLanguage": {
                    "sEmptyTable": "No Record Found",
                },
                "aoColumns": [
                    { "sTitle": "From Project" },
                    { "sTitle": "To Project" },
                    { "sTitle": "Transfer No" },
                    { "sTitle": "Transfer Date" },
                    { "sTitle": "Transporter Name" },
                    { "sTitle": "LR No." },
                    { "sTitle": "LR Date" },
                    { "sTitle": "Product Type" },
                    { "sTitle": "Product Name" }, 
                    { "sTitle": "Batch/Lot/Lot No" },
                    { "sTitle": "Transfer Qty" },
                    { "sTitle": "No Bin/Pallet/Crate/Locker/Container/Shelf/Box/Boxes/Rack" },
                    { "sTitle": "Transfer By" },
                ],
                "columnDefs": [
                    { "width": "3%", "targets": 0 },
                    { "width": "3%", "targets": 1 },
                    { "width": "3%", "targets": 2 },
                    { "width": "4%", "targets": 3 },                    
                    { "width": "4%", "targets": 4 },
                    { "width": "3%", "targets": 5 },
                    { "width": "3%", "targets": 6 },
                    { "width": "4%", "targets": 7 },
                    { "width": "7%", "targets": 8 },
                    { "width": "4%", "targets": 9 },
                    { "width": "2%", "targets": 10 },
                    { "width": "2%", "targets": 11 },
                    { "width": "8%", "targets": 12 },
                ],
            });
        }

        else if (reporttype == "Product Dispatch") {
            $("#StockReportReceipt").hide();
            $("#StockReport").show();
            var ActivityDataset = [];
            for (var i = 0; i < jsonData.length; i++) {
                var InDataset = [];
                InDataset.push(jsonData[i].FromProject, jsonData[i].ToProject, jsonData[i].DispatchRefNo, jsonData[i].ReceiptDate, jsonData[i].TransporterName, jsonData[i].LRNo, jsonData[i].LRDate, jsonData[i].StudyProductType, jsonData[i].StudyProduct, jsonData[i].StudyProductBatch, jsonData[i].TransferedQty, jsonData[i].Box ,jsonData[i].vModifyBy + "/ </br> " + jsonData[i].dModifyOn);
                ActivityDataset.push(InDataset);
            }
            otable = $('#tblPmsStockReport').dataTable({
                "bJQueryUI": true,
                "sPaginationType": "full_numbers",
                "bLengthChange": true,
                "iDisplayLength": 10,
                "bProcessing": true,
                "bSort": true,
                "autoWidth": false,
                "aaData": ActivityDataset,
                "bInfo": true,
                "aaSorting": [],
                "bAutoWidth": false,
                "bDestroy": true,
                "sScrollX": "100%",
                "sScrollXInner": "2000" /* It varies dynamically if number of columns increases */,
                "oLanguage": {
                    "sEmptyTable": "No Record Found",
                },
                "aoColumns": [
                    { "sTitle": "From Project" },
                    { "sTitle": "To Project" },
                    { "sTitle": "Dispatch Ref No" },
                    { "sTitle": "Receipt Date" },
                    { "sTitle": "Transporter Name" },
                    { "sTitle": "LR No." },
                    { "sTitle": "LR Date" },
                    { "sTitle": "Product Type" },
                    { "sTitle": "Product Name" },
                    { "sTitle": "Batch/Lot/Lot No" },
                    { "sTitle": "Transfered Qty" },
                    { "sTitle": "No Bin/Pallet/Crate/Locker/Container/Shelf/Box/Boxes/Rack" },
                    { "sTitle": "Dispatch By" }
                ],
                "columnDefs": [
                    { "width": "3%", "targets": 0 },
                    { "width": "3%", "targets": 1 },
                    { "width": "3%", "targets": 2 },
                    { "width": "4%", "targets": 3 },
                    { "width": "4%", "targets": 4 },
                    { "width": "3%", "targets": 5 },
                    { "width": "3%", "targets": 6 },
                    { "width": "4%", "targets": 7 },
                    { "width": "7%", "targets": 8 },
                    { "width": "4%", "targets": 9 },
                    { "width": "2%", "targets": 10 },
                    { "width": "2%", "targets": 11 },
                    { "width": "8%", "targets": 12,  },
                ],
            });
        }
        GetStockParaSessionDetail();
    }
}


function GetStockParaSessionDetail() {
    var Data_Export = {
        dFromDate: $("#dFromDate").val(),
        dTodate: $("#dToDate").val(),
        TranIndi: $("#ddlType :selected").val()
    }

    var URLSessionDetails = WebUrl + "PmsProductReceiptReport/GetSessionDetail";
    $.ajax({
        url: URLSessionDetails,
        type: 'get',
        data: Data_Export,
        //async: false,
        success: function (data) {
        },
        error: function () {
        }
    });
}