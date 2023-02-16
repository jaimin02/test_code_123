var productIds = new Object();
var ModuleName = "Product Receipt Note";
var TransferIndi = "";
var vProjectNo = "";

$(document).ready(function () {

    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('.modal').modal('hide');

    var GetProjectNo =
        {
            Url: BaseUrl + "PmsGeneral/GetScopeWiseProject",
            SuccessMethod: "SuccessMethod"
        }

    $('#btnExitPmsProductReceiptNote').on("click", function () {
        ConfirmAlertBox(ModuleName, $("#RedirectToHome").val());
    });

    $('#ddlProjectNo').on('change keyup', function () {
        if ($('#ddlProjectNo').val().length == 2) {
            var ProjectNoDataTemp = {
                //vProjectNo: $('#ddlProjectNo').val(),
                iUserId: $("#hdnuserid").val(),
                vStudyCode: $('#ddlProjectNo').val()
                //vProjectTypeCode: $("#hdnscopevalues").val(),
            }

            GetProjectNoDtl(GetProjectNo.Url, GetProjectNo.SuccessMethod, ProjectNoDataTemp);
        }
        else if ($('#ddlProjectNo').val().length < 2) {
            $("#ddlProjectNo").autocomplete({
                source: "",
                change: function (event, ui) { },
                select: function (event, ui) {
                    vProjectNo = ui.item.value;
                    $('#ddlProjectNo').val(vProjectNo);

                    GetRefDocumentNo(productIds[$('#ddlProjectNo').val()]);
                },
            });
        }
    });

    //$('#ddlProjectNo').on('blur', function () {
    //    GetRefDocumentNo(productIds[$('#ddlProjectNo').val()]);
    //});

    $('#ddlDocumentNo').on('change', function () {
        if (productIds[$('#ddlProjectNo').val()] == "") {
            ValidationAlertBox("Please select Peoject No.", "ddlProjectNo", ModuleName);
            return false;
        }
        //else {
        //    GetDispatchDetails($('#ddlDocumentNo').val());
        //}
    });

    GetViewMode();

    $('#DdlDamageKit').multiselect({
        nonSelectedText: 'Please Select Damage Kit',
        buttonClass: 'form-control',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        numberDisplayed: 2,
    });

    $('#dRecdDate').datetimepicker({
        format: 'DD-MMMM-YYYY',
        showClose: true,
    });
});

var GetProjectNoDtl = function (Url, SuccessMethod, ProjectNoDataTemp) {
    $.ajax({
        url: Url,
        type: 'GET',
        //data: { id: ProjectNoDataTemp.iUserId, projectno: ProjectNoDataTemp.vProjectNo, typecode: ProjectNoDataTemp.vProjectTypeCode },
        data: { iUserId: ProjectNoDataTemp.iUserId, vStudyCode: ProjectNoDataTemp.vStudyCode },
        async: false,
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("Error to binder Project No.", "ddlProjectNo", ModuleName);
        }
    });
    function SuccessMethod(jsonData) {
        var jsonObj = jsonData;
        var sourceArr = [];
        for (var i = 0; i < jsonObj.length; i++) {
            sourceArr.push("[ " + jsonObj[i].vStudyCode + " ]" + " " + jsonObj[i].vStudyName);
            productIds["[ " + jsonObj[i].vStudyCode + " ]" + " " + jsonObj[i].vStudyName] = jsonObj[i].nStudyNo;
        }
        $("#ddlProjectNo").autocomplete({
            source: sourceArr,
            change: function (event, ui) {
                $('.ui-menu-item').html(ui.item.value);
            },
        });
    }
}

function GetRefDocumentNo(workspaceId) {
    var RefDocData = {
        vWorkSpaceId: workspaceId,
        vDocTypeCode: 'ZGRN'
    }

    $.ajax({
        url: BaseUrl + "PmsGeneral/RefDocumentNo",
        type: 'POST',
        data: RefDocData,
        async: false,
        success: Success,
        error: function () {
            ValidationAlertBox("Dispatch Ref Number is not found.", "ddlDocumentNo", ModuleName);
        }
    });

    function Success(jsonData) {
        if (jsonData.length > 0) {
            $("#ddlDocumentNo").empty().append('<option selected="selected" value="0">Please Select Dispatch Ref No</option>');
            for (var i = 0; i < jsonData.length; i++) {
                $("#ddlDocumentNo").append($("<option></option>").val(jsonData[i].vDocumentNo).html(jsonData[i].vDocumentNo));
            }
        }
        else {
            $("#ddlDocumentNo").empty().append('<option selected="selected" value="0">Please Select Dispatch Ref No</option>');
            //SuccessorErrorMessageAlertBox("Dispatch Reference Number is not found.", ModuleName);
            ValidationAlertBox("Dispatch Reference Number is not found.", "ddlDocumentNo", ModuleName);
            return false;

        }
    }
}

function GetDispatchDetails(DocumentNo) {
    var DispatchDetails = {
        vToWorkSpaceId: productIds[$('#ddlProjectNo').val()],
        iUserID: $("#hdnuserid").val(),
        vDocumentNo: DocumentNo,
        cTransferIndi: TransferIndi
    }

    $.ajax({
        url: BaseUrl + "PmsGeneral/DispatchDetails",
        type: 'POST',
        data: DispatchDetails,
        async: false,
        success: Success,
        error: function () {
            SuccessorErrorMessageAlertBox("Data not found.", ModuleName);
        }
    });
    function Success(jsonData) {
        $('#DdlDamageKit option').each(function () {
            $(this).remove();
        });

        var ActivityDataset = [];
        var columns;
        var KitLabelNo = "";

        if (jsonData.length != 0) {
            $("#btnSavePmsProductReceiptNote").show();
        }
        else {
            $("#btnSavePmsProductReceiptNote").hide();
        }

        if (TransferIndi == "K" || TransferIndi == "L") {
            columns = [0, 1, 2, 4, 5, 6, 13];
        }
        else if (TransferIndi == "P") { 
            columns = [0, 1, 2, 7, 13];
        }

        for (var i = 0; i < jsonData.length; i++) {
            var InDataset = [];

            if (TransferIndi == "K") {
                KitLabelNo = jsonData[i].vKitNo;
            }
            else if (TransferIndi == "L") {
                KitLabelNo = jsonData[i].vStudyProductLabelNo;
            }

            InDataset.push(jsonData[i].vWorkSpaceID, jsonData[i].nProductNo, jsonData[i].nStudyProductBatchNo, jsonData[i].vProjectNo, jsonData[i].vProductName,
                           jsonData[i].vBatchLotNo, jsonData[i].iReceivedQty, KitLabelNo, jsonData[i].dExpDate, jsonData[i].vLrNo, jsonData[i].dLRDate,
                           jsonData[i].nCarton, jsonData[i].vRemark, jsonData[i].vModifyBy + "/</br>" + jsonData[i].dModifyOn);//Remove MFGDate And Add ExpDate 
            ActivityDataset.push(InDataset);

            $("#DdlDamageKit").append($("<option></option>").val(KitLabelNo).html(KitLabelNo));
            $('#DdlDamageKit').multiselect('rebuild');
        }
        otable = $('#tblPmsProductDispatchData').dataTable({
            "bJQueryUI": true,
            "sPaginationType": "full_numbers",
            "bLengthChange": true,
            "bProcessing": true,
            "bSort": true,
            "autoWidth": false,
            "bInfo": true,
            "aaData": ActivityDataset,
            "bDestroy": true,
            "sScrollX": "100%",
            "sScrollXInner": "1600" /* It varies dynamically if number of columns increases */,
            "oLanguage": {
                "sEmptyTable": "No Record found"
            },
            "aoColumns": [
                { "sTitle": "vWorkSpaceId" },
                { "sTitle": "Product No" },
                { "sTitle": "Batch No" },
                { "sTitle": "Project No " },
                { "sTitle": "Product Name" },
                { "sTitle": "Batch No" },
                { "sTitle": "Quantity" },
                { "sTitle": "Kit/Label No" },
                //{ "sTitle": "Mfg Date" },Remove Mfg Date By Jignesh Gandhi On 27012023
                { "sTitle": "Exp Date" },//Add Exp Date By Jignesh Gandhi On 27012023
                { "sTitle": "LR No" },
                { "sTitle": "LR Date" },
                { "sTitle": "Carton" },
                { "sTitle": "Remarks" },
               { "sTitle": "Transfer By" },
            ],
            "columnDefs": [
                {
                    "targets": columns,
                    "visible": false,
                    "searchable": false,
                },
            ],
        });
    }
}

$("#btnClearPmsProductReceiptNote").on("click", function () {
    $("#ddlProjectNo").val("");
    $('#ddlDocumentNo').val(0).attr("selected", "selected");
    $('#ddlConditionofProducts').val(0).attr("selected", "selected");
    $('#Remarks').val("");
    $('#ddlTransferIndi').val("0");
    $("#DdlDamageKit").multiselect("clearSelection");
    $("#DdlDamageKit").multiselect('refresh');
    $('#dRecdDate').val("");
    $('#ddlMinMax').val("0");

    if ($.fn.DataTable.isDataTable('#tblPmsProductDispatchData')) {
        $('#tblPmsProductDispatchData').DataTable().destroy();
    }
    $('#tblPmsProductDispatchData').empty();
    $('#tblPmsProductDispatchData thead').empty();

});

$("#btnSavePmsProductReceiptNote").on("click", function () {

    if (Dropdown_Validation(document.getElementById("ddlConditionofProducts"))) {
        ValidationAlertBox("Please select Condition of Product Receipt.", "ddlConditionofProducts", ModuleName);
        return false;
    }

    var conditionofproducts = $("#ddlConditionofProducts").val();
    if (conditionofproducts == "O") {
        if (isBlank(document.getElementById('Remarks').value)) {
            ValidationAlertBox("Please enter Remarks.", "Remarks", ModuleName);
            return false;
        }
    }

    if (TransferIndi == "K" || TransferIndi == "L") {
        if ($("#DdlDamageKit").val() != null) {
            if (conditionofproducts == "O") {
                if (isBlank(document.getElementById('Remarks').value)) {
                    ValidationAlertBox("Please enter Remarks.", "Remarks", ModuleName);
                    return false;
                }
            }
        }

        SaveKitDataHeaderandDetail();
    }
    else if (TransferIndi == "P") {

        var vWorkspaceId = otable.fnGetData(0)[0];
        var nBatchNo = otable.fnGetData(0)[2];
        var TempLRNO = otable.fnGetData(0)[9];
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

        var data = HTMLtbl.getData($('#tblPmsProductDispatchData'));  // passing that table's ID //
        for (i = 0; i < data.length; i++) {
            var storedata = data[i];
            var InsertPMSProductReceiptNoteData = {
                vToWorkSpaceId: vWorkspaceId,
                iModifyBy: $("#hdnuserid").val(),
                vDocumentNo: $("#ddlDocumentNo").val(),
                vRemark: $("#Remarks").val(),
                vWorkSpaceID: productIds[$('#ddlProjectNo').val()],
                vLrNo: TempLRNO,
                vDocTypeCode: "ZGRN",
                cTransferIndi: TransferIndi,
                vdRecdDate: $("#dRecdDate").val(),
                dMinMax: $("#ddlMinMax").val(),
            }
            $.ajax({
                url: BaseUrl + "PmsStudyProductReceipt/InsertPmsProductReceiptHeader",
                type: 'POST',
                data: InsertPMSProductReceiptNoteData,
                async: false,
                success: SuccessMethodProductReceipt,
                error: function () {
                    SuccessorErrorMessageAlertBox("Error to insert data in header part.", ModuleName);
                }
            });

            function SuccessMethodProductReceipt(TransactionNo) {
                var InsertPmsProductReceipt2 = {
                    nTransactionNo: TransactionNo,
                    vToWorkSpaceId: productIds[$('#ddlProjectNo').val()],
                    cLocationIndicator: 'Q',
                    iModifyBy: $("#hdnuserid").val(),
                    vRemark: $("#Remarks").val(),
                    iReceivedQty: otable.fnGetData(0)[6],
                    vDocTypeCode: "ZGRN",
                    vWorkspaceId: vWorkspaceId,
                    nProductNo: otable.fnGetData(0)[1],
                    nStudyProductBatchNo: otable.fnGetData(0)[2],
                    cAddSub: "A",
                    cConditionProducts: $("#ddlConditionofProducts").val(),
                    cTransferIndi: TransferIndi,
                    vKitNo: otable.fnGetData(0)[7],
                    nStorageLocationNo: 1
                }

                var InsertProductReceiptData2 =
                {
                    Url: BaseUrl + "PmsStudyProductReceipt/InsertPmsProductReceiptDetails",
                    SuccessMethod: "SuccessMethod",
                    Data: InsertPmsProductReceipt2
                }

                $.ajax({
                    url: InsertProductReceiptData2.Url,
                    type: 'POST',
                    data: InsertProductReceiptData2.Data,
                    async: false,
                    success: SuccessInsertDataReceipt,
                    error: function () {
                        SuccessorErrorMessageAlertBox("Error to insert data in detail part.", ModuleName);
                    }
                });
                function SuccessInsertDataReceipt(response) {

                    $("#ddlDocumentNo").empty().append('<option selected="selected" value="0">Please Select Dispatch Ref No</option>');
                    GetDispatchDetails($('#ddlDocumentNo').val());
                    $("#Remarks").val("");
                    $('#dRecdDate').val("");
                    $('#ddlMinMax').val("0");
                    $("#ddlProjectNo").val("");
                    $("#btnSavePmsProductReceiptNote").hide();
                    //$("#remarks").hide();//Comment By Jignesh Gandhi On 30012023
                    $("#ddlConditionofProducts").val("0");
                    $('#ddlTransferIndi').val("0");
                    $('#DdlDamageKit option').each(function () {
                        $(this).remove();
                    });
                    $('#DdlDamageKit').multiselect('rebuild');
                    $("#divDamageKit").attr("style", "display:none");
                    SuccessorErrorMessageAlertBox("Product Receipt Note saved successfully.", ModuleName);
                }
            }
        }
    }
});

$("#ddlConditionofProducts").on("change", function () {
    var conditionofproducts = $("#ddlConditionofProducts").val();

    if ($("#ddlTransferIndi").val() == "P") {
        if (conditionofproducts == "O") {
            //$("#remarks").show();//Comment By Jignesh Gandhi On 30012023
        }
        //else { $("#remarks").hide(); }//Comment By Jignesh Gandhi On 30012023
    }
    else if ($("#ddlTransferIndi").val() == "K" || $("#ddlTransferIndi").val() == "L") {
        $("#DdlDamageKit").multiselect("clearSelection");
        $("#DdlDamageKit").multiselect('refresh');
        if (conditionofproducts == "D") {
            $("#divDamageKit").attr("style", "display:block")
            //$("#remarks").attr("style", "display:block")//Comment By Jignesh Gandhi On 30012023
        }
        else if (conditionofproducts == "O") {
            $("#divDamageKit").attr("style", "display:none")
            //$("#remarks").attr("style", "display:block")//Comment By Jignesh Gandhi On 30012023
        }
        else {
            $("#divDamageKit").attr("style", "display:none")
            //$("#remarks").attr("style", "display:none")//Comment By Jignesh Gandhi On 30012023
        }
    }
    else {
        //$("#remarks").hide();//Comment By Jignesh Gandhi On 30012023
    }





});

$("#ddlTransferIndi").on("change", function () {
    TransferIndi = $("#ddlTransferIndi").val();
    var DocumentNo = $("#ddlDocumentNo").val();
    GetDispatchDetails(DocumentNo);


    if ($("#ddlConditionofProducts").val() == "D" && $("#ddlTransferIndi").val() == "K") {
        $("#divDamageKit").attr("style", "display:block")
       // $("#remarks").attr("style", "display:block")  //Comment By Jignesh Gandhi On 30012023
    }
    else {
        $("#divDamageKit").attr("style", "display:none")
        //$("#remarks").attr("style", "display:none")   //Comment By Jignesh Gandhi On 30012023
    }
});

function SaveKitDataHeaderandDetail() {
    var Result = true;
    var tblPmsProductDispatchData = $('table#tblPmsProductDispatchData').find('tbody').find('tr');
    var vWorkspaceId = otable.fnGetData(0)[0];
    var nBatchNo = otable.fnGetData(0)[2];
    var vLRNo = otable.fnGetData(0)[9];
    var tableLength = $("#tblPmsProductDispatchData").dataTable().fnGetNodes().length;


    //var storedata = data[i];
    var InsertPMSProductReceiptNoteData = {
        vToWorkSpaceId: vWorkspaceId,
        iModifyBy: $("#hdnuserid").val(),
        vDocumentNo: $("#ddlDocumentNo").val(),
        vRemark: $("#Remarks").val(),
        vWorkSpaceID: productIds[$('#ddlProjectNo').val()],
        vLrNo: vLRNo,
        vDocTypeCode: "ZGRN",
        cTransferIndi: TransferIndi,
    }
    $.ajax({
        url: BaseUrl + "PmsStudyProductReceipt/InsertPmsProductReceiptHeader",
        type: 'POST',
        data: InsertPMSProductReceiptNoteData,
        async: false,
        success: SuccessMethodProductReceipt,
        error: function () {
            SuccessorErrorMessageAlertBox("Error to insert data in header part.", ModuleName);
        }
    });

    function SuccessMethodProductReceipt(TransactionNo) {
        var KitNo = "";
        var cDamageKit = "N";
        var iNonSalableClStockQty = 0;
        for (i = 0; i < tableLength; i++) {
            cDamageKit = "N";
            iNonSalableClStockQty = 0;
            KitNo = otable.fnGetData(0)[7]
            var TempKitNo = otable.fnGetData(0)[7]
            var conditionofproducts = $("#ddlConditionofProducts").val();
            if ($("#DdlDamageKit").val() != null) {
                if (conditionofproducts == "D" && ($("#ddlTransferIndi").val() == "K" || $("#ddlTransferIndi").val() == "L")) {
                    var TempKitNo = otable.fnGetData(i)[7]
                    for (var j = 0; j < $("#DdlDamageKit").val().length ; j++) {
                        if (TempKitNo == $("#DdlDamageKit").val()[j]) {
                            cDamageKit = "Y";
                            iNonSalableClStockQty = "1";
                        }
                    }
                }
            }

            if (TransferIndi == "K") {
                var InsertPmsProductReceipt2 = {
                    nTransactionNo: TransactionNo,
                    vToWorkSpaceId: productIds[$('#ddlProjectNo').val()],
                    cLocationIndicator: 'Q',
                    iModifyBy: $("#hdnuserid").val(),
                    vRemark: $("#Remarks").val(),
                    iReceivedQty: otable.fnGetData(i)[6],
                    vDocTypeCode: "ZGRN",
                    vWorkspaceId: vWorkspaceId,
                    nProductNo: otable.fnGetData(i)[1],
                    nStudyProductBatchNo: otable.fnGetData(i)[2],
                    cAddSub: "A",
                    cConditionProducts: $("#ddlConditionofProducts").val(),
                    cTransferIndi: TransferIndi,
                    vKitNo: otable.fnGetData(i)[7],
                    cDamageKit: cDamageKit,
                    iNonSalableClStockQty: iNonSalableClStockQty,
                    nStorageLocationNo: 1
                }
            }
            else if (TransferIndi == "L") {
                var InsertPmsProductReceipt2 = {
                    nTransactionNo: TransactionNo,
                    vToWorkSpaceId: productIds[$('#ddlProjectNo').val()],
                    cLocationIndicator: 'Q',
                    iModifyBy: $("#hdnuserid").val(),
                    vRemark: $("#Remarks").val(),
                    iReceivedQty: otable.fnGetData(i)[6],
                    vDocTypeCode: "ZGRN",
                    vWorkspaceId: vWorkspaceId,
                    nProductNo: otable.fnGetData(i)[1],
                    nStudyProductBatchNo: otable.fnGetData(i)[2],
                    cAddSub: "A",
                    cConditionProducts: $("#ddlConditionofProducts").val(),
                    cTransferIndi: TransferIndi,
                    vStudyProductLabelNo: otable.fnGetData(i)[7],
                    cDamageKit: cDamageKit,
                    iNonSalableClStockQty: iNonSalableClStockQty,
                    nStorageLocationNo: 1
                }
            }

            var InsertProductReceiptData2 =
            {
                Url: BaseUrl + "PmsStudyProductReceipt/InsertPmsProductReceiptDetails",
                SuccessMethod: "SuccessMethod",
                Data: InsertPmsProductReceipt2
            }

            $.ajax({
                url: InsertProductReceiptData2.Url,
                type: 'POST',
                data: InsertProductReceiptData2.Data,
                async: false,
                success: SuccessInsertDataReceipt,
                error: function () {
                    SuccessorErrorMessageAlertBox("Error to insert data in detail part.", ModuleName);
                    Result = false;
                }
            });
            function SuccessInsertDataReceipt(response) {
                Result = true;
            }
        }
        if (Result == true) {
            INSERT_KitDataSave(TransactionNo, productIds[$('#ddlProjectNo').val()], KitNo);
        }
    }
}

function INSERT_KitDataSave(Transactionno, WorkSpaceID, KitNo) {
    var POSTData = {
        vWorkSpaceID: WorkSpaceID,
        nTransactionNo: Transactionno,
        vKitNo: KitNo
    }

    $.ajax({
        url: BaseUrl + "PmsRecordSave/Insert_ProductKitDataAfterGRN",
        type: 'POST',
        data: POSTData,
        success: function () {
            $("#ddlDocumentNo").empty().append('<option selected="selected" value="0">Please Select Dispatch Ref No</option>');
            GetDispatchDetails($('#ddlDocumentNo').val());
            $("#Remarks").val("");
            $('#dRecdDate').val("");
            $('#ddlMinMax').val("0");
            $("#ddlProjectNo").val("");
            $("#btnSavePmsProductReceiptNote").hide();
            //$("#remarks").hide();//Comment By Jignesh Gandhi On 30012023
            $("#ddlConditionofProducts").val("0");
            $('#ddlTransferIndi').val("0");
            $('#DdlDamageKit option').each(function () {
                $(this).remove();
            });
            $('#DdlDamageKit').multiselect('rebuild');
            $("#divDamageKit").attr("style", "display:none");
            SuccessorErrorMessageAlertBox("Product Receipt Note saved successfully.", ModuleName);
        },
        async: false,
        error: function () {
            SuccessorErrorMessageAlertBox("Error to save data in Kit Type.", ModuleName);

        }
    });
}