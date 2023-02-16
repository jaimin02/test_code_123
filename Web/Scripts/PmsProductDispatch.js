var productIds = new Object();
var productIds2 = new Object();
var IUserNo;
var viewmode;
var ModuleName = "Product Dispatch";
var vProjectNo = "";
var DateAndTimeFlag = "N";

$(document).ready(function () {
    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('.modal').modal('hide');

    //$(".abctest").datetime();

    iUserNo = $("#hdnuserid").val();
    $("#spnwelcome").html($("#hdnusername").val());
    $("#spnLoginTime").html($("#hdnlogintime").val());

    var GetPmsProductDispatchProjectNo = {
        //Url: BaseUrl + "PmsProductBatch/GetProjectNo",
        Url: BaseUrl + "PmsGeneral/GetScopeWiseProject",
        SuccessMethod: "SuccessMethod"
    }

    $('#btnExitPmsProductDispatch').on("click", function () {
        ConfirmAlertBox(ModuleName, $("#RedirectToHome").val());
    });

    $('#DDLProjectNoFrom').on('change keyup paste mouseup', function () {
        if ($('#DDLProjectNoFrom').val().length == 2) {
            var ProjectNoDataTemp = {
                //vProjectNo: $('#DDLProjectNoFrom').val(),
                iUserId: $("#hdnuserid").val(),
                vStudyCode: $('#DDLProjectNoFrom').val()
                //vProjectTypeCode: $("#hdnscopevalues").val(),
            }
            GetAllPmsProductDispatchProjectNo(GetPmsProductDispatchProjectNo.Url, GetPmsProductDispatchProjectNo.SuccessMethod, ProjectNoDataTemp);

        }
        else if ($('#DDLProjectNoFrom').val().length < 2) {
            $("#DDLProjectNoFrom").autocomplete({
                source: "",
                change: function (event, ui) { },
                select: function (event, ui) {
                    vProjectNo = ui.item.value;
                    $('#DDLProjectNoFrom').val(vProjectNo);

                    ToProjectNo();
                },
            });
        }
    });

    $("#DDLProjectNoFrom").on("blur", function () {
        ToProjectNo();
    });

    $("#DDLProjectNoTo").on("blur", function () {
        GetSendTO();
    });
    GetDocTypeCode();
    GetViewMode();


});

var GetAllPmsProductDispatchProjectNo = function (Url, SuccessMethod, ProjectNoDataTemp) {
    $.ajax({
        url: Url,
        type: 'GET',
        //data: { id: ProjectNoDataTemp.iUserId, projectno: ProjectNoDataTemp.vProjectNo, typecode: ProjectNoDataTemp.vProjectTypeCode },
        data: { iUserId: ProjectNoDataTemp.iUserId, vStudyCode: ProjectNoDataTemp.vStudyCode },
        async: false,
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("Project not found.", "DDLProjectNoFrom", ModuleName);
        }
    });
    function SuccessMethod(jsonData) {
        var jsonObj = jsonData;
        var sourceArr = [];

        for (var i = 0; i < jsonObj.length; i++) {
            sourceArr.push("[ " + jsonObj[i].vStudyCode + " ]" + " " + jsonObj[i].vStudyName);
            productIds["[ " + jsonObj[i].vStudyCode + " ]" + " " + jsonObj[i].vStudyName] = jsonObj[i].nStudyNo;
        }

        $("#DDLProjectNoFrom").autocomplete({
            source: sourceArr,
            change: function (event, ui) { }
        });

        $("#DDLProjectNoTo").autocomplete({
            source: sourceArr,
            change: function (event, ui) { }
        });
    }
}

$("#btnPmsProductDispatchView").on("click", function () {
    if (ValidationForm() == false) {
        return false;
    }
    PendingDispatchData();
});

function GetDocTypeCode() {
    $.ajax({
        url: BaseUrl + "PmsProductDispatch/GetDocTypeCode",
        type: 'GET',
        success: DocTypeCodeSucess,
        error: function () {
            SuccessorErrorMessageAlertBox("Reason not found.", ModuleName);
        }
    });

    function DocTypeCodeSucess(jsonData) {
        if (jsonData.length > 0) {
            $("#ddlDocumentType").empty().append('<option selected="selected" value="0">Please Select Reason</option>');
            for (var i = 0; i < jsonData.length; i++) {
                $("#ddlDocumentType").append($("<option></option>").val(jsonData[i].vDocTypeCode).html(jsonData[i].vDocTypeDesc));
            }
        }
        else {
            $("#ddlDocumentType").empty().append('<option selected="selected" value="0">Please Select Reason</option>');
        }
    }
}

function PendingDispatchData() {
    $('.modal-backdrop').remove();
    var PmsProductDispatchData = {
        vWorkSpaceID: productIds[$('#DDLProjectNoFrom').val()],
        vDocTypeCode: $("#ddlDocumentType").val(),
        iUserID: $("#hdnuserid").val(),
        dfromDate: $("#txtDateFrom").val(),
        dtoDate: $("#txtDateTo").val(),
        vToWorkSpaceID: $("#DDLProjectNoTo").val(),
        cTransferIndi: $("#ddlTransferIndi").val(),
        vSendTo: $("#ddlLocation").val()
    }
    $.ajax({
        url: BaseUrl + "PmsProductDispatch/ProductDispatchData",
        type: 'POST',
        data: PmsProductDispatchData,
        success: SuccessMethodDispatchData,
        error: function () {
            SuccessorErrorMessageAlertBox("Dispatch Data not found.", ModuleName);
        }
    });

    function SuccessMethodDispatchData(jsonData) {
        var TransferIndi = $("#ddlTransferIndi").val()
        var columns;
        var ActivityDataset = [];
        if (TransferIndi == "P" || TransferIndi == "L") {
            columns = [6]
        }
        else if (TransferIndi == "K") {
            columns = []
        }

        for (var i = 0; i < jsonData.length; i++) {
            $("#btnSavePmsProductDispatch").show();
            if (jsonData[i].vLRNO != null) {
                var $ctrl = "";
                var $txtdispatchdocno = jsonData[i].vDispatchDocNo;
                var $txtdispatchdocdate = jsonData[i].dDispatchDocDate;
                var $ddlTransport = jsonData[i].vTransporterName;
                var $txtLRNO = jsonData[i].vLRNO;
                var $txtLRdate = jsonData[i].dLRDate;
                var $txtcarton = jsonData[i].nCarton;
                var $txtDataLogger = jsonData[i].vDataLoggerId;
                var $txtDataLoggerTime = jsonData[i].vDataloggersStartTime;
                var $txtTempStartingData = jsonData[i].vTemperaturestartData;
                var $txtStorageCondition = jsonData[i].vStorageCondition;
                var $txtSpecificInstruction = jsonData[i].vSpecificinstruction;
                var $txtStoretemp = jsonData[i].vStoredtemperature;
                var $txtRemarks = jsonData[i].DispatchRemark;
                var DispatchBy = jsonData[i].vModifyBy + "/ <br>" + jsonData[i].dModifyOn
            }

            else {
                var $ctrl = '<input class="chk" type="checkbox" name="case" id=chk' + jsonData[i].vDocumentNo + ' value="' + jsonData[i].vDocumentNo + '" onchange="ChangeCheckBox(this);"  />';
                var $txtdispatchdocno = '<input type="text" id="txtDispatchDoc' + jsonData[i].vDocumentNo + '" placeholder="Dispatch Doc" class="form-control" style="height: 26px" disabled="disabled"/>';
                var $txtdispatchdocdate = '<input type="text" id="txtDispatchDate' + jsonData[i].vDocumentNo + '" placeholder="Dispatch Date" class="form-control abctest" style="height: 26px" disabled="disabled"/>';

                var $ddlTransport = '<select class="form-control" id="ddlTransport' + jsonData[i].vDocumentNo + '"" style="padding: 3px 12px; height: 26px" disabled="disabled""></select>';
                TransportMaster(jsonData[i].vDocumentNo);
                var $txtLRNO = '<input type="text" id="txtLRNO' + jsonData[i].vDocumentNo + '" placeholder="AWB No" class="form-control" style="height: 26px" disabled="disabled"/>';
                var $txtLRdate = '<input type="text" id="txtLRDate' + jsonData[i].vDocumentNo + '" placeholder="LR Date" class="form-control" style="height: 26px" disabled="disabled"/>';

                var $txtcarton = '<input type="text" id="txtcarton' + jsonData[i].vDocumentNo + '" placeholder="Carton" class="form-control" style="height: 26px" disabled="disabled"/>';
                var $txtDataLogger = '<input type="text" id="txtDataLogger' + jsonData[i].vDocumentNo + '" placeholder="Data Logger" class="form-control" style="height: 26px" disabled="disabled"/>';
                var $txtDataLoggerTime = '<input type="text" id="txtDataLoggerTime' + jsonData[i].vDocumentNo + '" placeholder="Data Logger" class="form-control" style="height: 26px" disabled="disabled"/>';
                var $txtTempStartingData = '<input type="text" id="txtTempStartingData' + jsonData[i].vDocumentNo + '" placeholder="Data Logger" class="form-control" style="height: 26px" disabled="disabled"/>';
                var $txtStorageCondition = '<input type="text" id="txtStorageCondition' + jsonData[i].vDocumentNo + '" placeholder="Data Logger" class="form-control" style="height: 26px" disabled="disabled"/>';
                var $txtSpecificInstruction = '<input type="text" id="txtSpecificInstruction' + jsonData[i].vDocumentNo + '" placeholder="Data Logger" class="form-control" style="height: 26px" disabled="disabled"/>';
                var $txtStoretemp = '<input type="text" id="txtStoretemp' + jsonData[i].vDocumentNo + '" placeholder="Data Logger" class="form-control" style="height: 26px" disabled="disabled"/>';
                var $txtRemarks = '<textarea class="form-control" cols="20" id="txtRemarks' + jsonData[i].vDocumentNo + '" name="txtRemarks" placeholder="Remarks" rows="2" disabled="disabled"></textarea>';
                var DispatchBy = "";
            }

            var InDataset = [];
            InDataset.push($ctrl, jsonData[i].vProductName, jsonData[i].vBatchLotNo, jsonData[i].dExpDate, jsonData[i].iReceivedQty, jsonData[i].vDocumentNo, jsonData[i].vKitTypeDesc, jsonData[i].dTransactionDate,
                           jsonData[i].vProjectNo, $txtdispatchdocno, $txtdispatchdocdate, $ddlTransport,
                           $txtLRNO, $txtLRdate, $txtcarton, $txtDataLogger, $txtDataLoggerTime, $txtTempStartingData, $txtStorageCondition, $txtSpecificInstruction , $txtStoretemp , $txtRemarks, DispatchBy);
            ActivityDataset.push(InDataset);
        }
        otable = $('#tblPmsProductDispatchData').dataTable({
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
            "aoColumns": [
                { "sTitle": "Select" },
                { "sTitle": "Product Name" },
                { "sTitle": "Batch No" },
                { "sTitle": "Expired Date" },
                { "sTitle": "Qty" },
                { "sTitle": "Document Number" },
                { "sTitle": "Kit Type" },
                { "sTitle": "Document Date" },
                { "sTitle": "Protocol No" },
                { "sTitle": "Dispatch Doc No" },
                { "sTitle": "Dispatch Doc Date" },
                { "sTitle": "Transporter" },
                { "sTitle": "AWB No" },
                { "sTitle": "LR Date" },
                { "sTitle": "Carton" },
                { "sTitle": "Logger ID" },
                { "sTitle": "loggers start time" },
                { "sTitle": "Storage condition" },
                { "sTitle": "Specific instruction" },
                { "sTitle": " store at temperature" },
                { "sTitle": "Product interchange" },
                { "sTitle": "Remarks" },
                { "sTitle": "Dispatch By" },
            ],
            "columnDefs": [
                { "width": "0.1%", "bSortable": false, "targets": 0 },
                { "width": "1%", "targets": 1 },
                { "width": "1%", "targets": 2 },
                { "width": "2%", "targets": 3 },
                { "width": "0.5%", "targets": 4 },
                { "width": "1%", "targets": 5 },
                { "width": "1%", "targets": 6 },
                { "width": "1%", "targets": 7 },
                { "width": "1%", "targets": 8 },
                { "width": "1%", "targets": 9 },
                { "width": "0.2%", "targets": 10 },
                { "width": "2%", "targets": 11 },
                { "width": "2.5%", "targets": 12, },
                { "width": "1%", "targets": 13 },
                { "width": "1%", "targets": 14 },
                { "width": "2%", "targets": 15 },
                { "width": "2%", "targets": 16 },
                { "width": "2%", "targets": 17 },
                { "width": "2%", "targets": 18 },
                { "width": "2%", "targets": 19 },
                { "width": "2%", "targets": 20 },
                { "width": "2%", "targets": 21 },
                { "width": "2%", "targets": 22 },
                {
                    "targets": columns,
                    "visible": false,
                    "searchable": false
                },

            ],


        });
    }
}

function GetSiteParentId() {
    var Getdata = {
        vWorkSpaceId: $("#DDLProjectNoTo").val(),
    }
    $.ajax({
        url: BaseUrl + 'PmsGeneral/GetSiteParentId',
        type: 'POST',
        data: Getdata,
        success: Success,
        async: false,
        error: function () {
            ValidationAlertBox("not found.", "listOfParentId", ModuleName);
        }
    });

    function Success(jsonData) {
        $('#PIName').val(jsonData[0].vPIName).prop('disabled', 'disabled');
        $('#ProductName').val(jsonData[0].vPIName).prop('disabled', 'disabled');
        
    }
}




function TransportMaster(id) {
    $.ajax({
        url: BaseUrl + "PmsGeneral/GetAllTransportMode",
        type: 'GET',
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Transporter not found.", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        var strdata = "";
        if (jsonData.length > 0) {
            $("#ddlTransport" + id + "").empty().append('<option selected="selected" value="0">Please Select Transport Mode</option>');
            //$("#txtDispatchDate" + id + "").datepicker({ format: 'dd-MM-yyyy', autoclose: true });
            $("#txtLRDate" + id + "").datepicker({ format: 'dd-MM-yyyy', autoclose: true });
            $("#txtDispatchDate" + id + "").datetimepicker({ format: 'DD-MMM-YYYY hh:mm:ss' });
            $("#txtDataLoggerTime" + id + "").datetimepicker({ format: 'DD-MMM-YYYY hh:mm:ss' });
            for (var i = 0; i < jsonData.length; i++) {
                if (jsonData[i].vLocationCode == $("#hdnUserLocationCode").val()) {
                    $("#ddlTransport" + id + "").append($("<option></option>").val(jsonData[i].nTransporterNo).html(jsonData[i].vTransporterName));
                }
            }
        }
    }
}

function ChangeCheckBox(id) {
    if (id.checked == true) {
        $("#txtDispatchDoc" + id.value + "").removeAttr("disabled");
        $("#txtDispatchDate" + id.value + "").removeAttr("disabled");
        $("#ddlTransport" + id.value + "").removeAttr("disabled");
        $("#txtLRNO" + id.value + "").removeAttr("disabled");
        $("#txtLRDate" + id.value + "").removeAttr("disabled");
        $("#txtcarton" + id.value + "").removeAttr("disabled");
        $("#txtDataLogger" + id.value + "").removeAttr("disabled");
        $("#txtDataLoggerTime" + id.value + "").removeAttr("disabled");
        $("#txtTempStartingData" + id.value + "").removeAttr("disabled");
        $("#txtStorageCondition" + id.value + "").removeAttr("disabled");
        $("#txtSpecificInstruction" + id.value + "").removeAttr("disabled");
        $("#txtStoretemp" + id.value + "").removeAttr("disabled");
        $("#txtRemarks" + id.value + "").removeAttr("disabled");

    }
    else {
        $("#txtDispatchDoc" + id.value + "").attr("disabled", "disabled");
        $("#txtDispatchDate" + id.value + "").attr("disabled", "disabled");
        $("#ddlTransport" + id.value + "").attr("disabled", "disabled");
        $("#txtLRNO" + id.value + "").attr("disabled", "disabled");
        $("#txtLRDate" + id.value + "").attr("disabled", "disabled");
        $("#txtcarton" + id.value + "").attr("disabled", "disabled");
        $("#txtDataLogger" + id.value + "").attr("disabled", "disabled");
        $("#txtDataLoggerTime" + id.value + "").attr("disabled", "disabled");
        $("#txtTempStartingData" + id.value + "").attr("disabled", "disabled");
        $("#txtStorageCondition" + id.value + "").attr("disabled", "disabled");
        $("#txtSpecificInstruction" + id.value + "").attr("disabled", "disabled");
        $("#txtStoretemp" + id.value + "").attr("disabled", "disabled");
        $("#txtRemarks" + id.value + "").attr("disabled", "disabled");


        $("#txtDispatchDoc" + id.value + "").val("");
        $("#txtDispatchDate" + id.value + "").val("");
        $("#ddlTransport" + id.value + "").val("0");
        $("#txtLRNO" + id.value + "").val("");
        $("#txtLRDate" + id.value + "").val("");
        $("#txtcarton" + id.value + "").val("");
        $("#txtDataLogger" + id.value + "").val("");
        $("#txtDataLoggerTime" + id.value + "").val("");
        $("#txtTempStartingData" + id.value + "").val("");
        $("#txtStorageCondition" + id.value + "").val("");
        $("#txtSpecificInstruction" + id.value + "").val("");
        $("#txtStoretemp" + id.value + "").val("");
        $("#txtRemarks" + id.value + "").val("");
    }
}

$("#btnSavePmsProductDispatch").on("click", function () {
    var bSuccess = false;
        confirmalertbox(ModuleName);
        
   
});
function SuccessInsertData() {
    $('.modal-backdrop').remove();
    $("#AlertPopup").modal('hide');
    $("#AlertPopup").html("");
    PendingDispatchData();
    bSuccess = true;
}
function confirmalertbox(ModuleName) {
    var strdata = "";
    strdata += "<div class='modal-dialog' style='width:450px'>";
    strdata += "<div class='DTED_Lightbox_Content' style='height: auto;'>";
    strdata += "<div class='modal-content modal-content-AlertPromt'>";
    strdata += "<div class='modal-header modalheader'>"
    strdata += "<button type='button' class='Close' onClick='CancelPromt()'>&times;</button>"
    strdata += "<h4 class='modal-title modaltitle text-center'><label id='lblmsg' class='text-center' style='color:black'>" + ModuleName + "</label></h4></div>";
    strdata += "<div class='modal-body' style='padding:0px'><div class='box-body'>"
    strdata += "<span class='fa  fa-question-circle' style='color:red'></span><label id='lblmsg' class='text-center'>Are you sure dipatch prodyuct</label>";
    strdata += "</div></div>";
    strdata += "<div class='modal-footer modalfooter'>";
    strdata += "<button type='button' class='btn btn-primary' onclick='ConfirmAlertFunction()'><i class='fa fa-check'></i> Confirm</button>"
    strdata += "<button type='button' class='btn btn-default' onClick=CancelPromt()><i class='fa fa-times'></i>Cancel</button>"
    strdata += "</div></div></div></div>"
    $("#AlertPopup").append(strdata);
    $("#AlertPopup").modal('show');

}
function ConfirmAlertFunction(ModuleName) {
    //$("#modal-dialog").modal('hide');
    $(".modal-backdrop.in").hide();
    $('.modal-backdrop').remove();
    $('.DTED_Lightbox_Content').remove();
    //$('.modal-backdrop').remove();
    //$('.modal-backdrop').remove();
    $("#AlertPopup").modal('hide');
    $("#AlertPopup").html("");

    $("#tblPmsProductDispatchData input[name=case]:checked").each(function () {
        var documentno = $(this).closest("tr").find('td')[5].innerHTML;
        var transporterid = document.getElementById('ddlTransport' + documentno + '');
        var kittype = $(this).closest("tr").find('td')[6].innerHTML;

        if ($("input[id*=txtDispatchDoc" + documentno + "]").val() == "") {
            ValidationAlertBox("Please enter dispatch doc no for document no " + documentno + ".", "ddlTransferIndi", ModuleName);
            return false;
        }

        if ($("input[id*=txtDispatchDate" + documentno + "]").val() == "") {
            ValidationAlertBox("Please enter dispatch doc date for document no " + documentno + " .", "ddlTransferIndi", ModuleName);
            return false;
        }
        if (transporterid.options[transporterid.selectedIndex].value == "0") {
            ValidationAlertBox("Please select transporter name for document no " + documentno + ".", "ddlTransferIndi", ModuleName);
            return false;
        }
        if ($("input[id*=txtLRNO" + documentno + "]").val() == "") {
            ValidationAlertBox("Please enter AWB No for document no " + documentno + ".", "ddlTransferIndi", ModuleName);
            return false;
        }

        if ($("input[id*=txtLRDate" + documentno + "]").val() == "") {
            ValidationAlertBox("Please enter LR Date for document no " + documentno + ".", "ddlTransferIndi", ModuleName);
            return false;
        }

        if ($("input[id*=txtcarton" + documentno + "]").val() == "") {
            ValidationAlertBox("Please enter Carton for document no " + documentno + ".", "ddlTransferIndi", ModuleName);
            return false;
        }

        if (isNumeric((document.getElementById('txtcarton' + documentno).value), 'txtcarton' + documentno)) {
            ValidationAlertBox("Please enter Carton for document no " + documentno + " in numeric value.", "ddlTransferIndi", ModuleName);
            return false;
        }

        if ($("input[id*=txtDataLogger" + documentno + "]").val() == "") {
            ValidationAlertBox("Please enter data logger no " + documentno + ".", "txtDataLogger", ModuleName);
            return false;
        }

        if ($("input[id*=txtDataLoggerTime" + documentno + "]").val() == "") {
            ValidationAlertBox("Please enter Tempeture Starting Date" + documentno + ".", "txtDataLoggerTime", ModuleName);
            return false;
        }

        if ($("input[id*=txtTempStartingData" + documentno + "]").val() == "") {
            ValidationAlertBox("Please enter Tempeture Starting Date" + documentno + ".", "txtTempStartingDate", ModuleName);
            return false;
        }
        //krisj 
        if ($("input[id*=txtStorageCondition" + documentno + "]").val() == "") {
            ValidationAlertBox("Please enter Storage Condition" + documentno + ".", "txtStorageCondition", ModuleName);
            return false;
        }

        if ($("input[id*=txtSpecificInstruction" + documentno + "]").val() == "") {
            ValidationAlertBox("Please enter Specific instruction" + documentno + ".", "txtSpecificInstruction", ModuleName);
            return false;
        }

        if ($("input[id*=txtStoretemp" + documentno + "]").val() == "") {
            ValidationAlertBox("Please enter Tempeture Starting Date" + documentno + ".", "txtStoretemp", ModuleName);
            return false;
        }

        if ($("textarea[id*=txtRemarks" + documentno + "]").val() == "") {
            ValidationAlertBox("Please enter Remarks for document no " + documentno + ".", "ddlTransferIndi    ", ModuleName);
            return false;
        }
       
        var DispatchData =
        {
            vDispatchDocNo: $("input[id*=txtDispatchDoc" + documentno + "]").val(),
            dDispatchDocDate: $("input[id*=txtDispatchDate" + documentno + "]").val(),
            vDocumentNo: documentno,
            vDocTypeCode: "ZDSP",
            vLRNo: $("input[id*=txtLRNO" + documentno + "]").val(),
            dLRDate: $("input[id*=txtLRDate" + documentno + "]").val(),
            nCarton: $("input[id*=txtcarton" + documentno + "]").val(),
            nTransporterNo: transporterid.options[transporterid.selectedIndex].value,
            vWorkSpaceID: productIds[$('#DDLProjectNoFrom').val()],
            iModifyBy: $("#hdnuserid").val(),
            DataOPMode: 2,
            vDataLoggerId: $("input[id*=txtDataLogger" + documentno + "]").val(),
            vDataloggerStartTime: $("input[id*=txtDataLoggerTime" + documentno + "]").val(),
            vTemperaturestartData: $("input[id*=txtTempStartingData" + documentno + "]").val(),
            vStorageCondition: $("input[id*=txtStorageCondition" + documentno + "]").val(),
            vSpecificinstruction: $("input[id*=txtSpecificInstruction" + documentno + "]").val(),
            vStoredtemperature: $("input[id*=txtStoretemp" + documentno + "]").val(),
            vRemark: $("textarea[id*=txtRemarks" + documentno + "]").val(),
            cTransferIndi: $("#ddlTransferIndi").val(),
        }
    
        $.ajax({
            url: BaseUrl + "PmsStudyProductReceipt/InsertPmsProductReceiptHeader",
            type: 'POST',
            data: DispatchData,
            async: false,
            success: SuccessInsertData,
            error: function () {
                SuccessorErrorMessageAlertBox("Error at insert data.", ModuleName);
            }
        });

    });
    if (bSuccess == true) {
        //.modal-backdrop
        //$('.modal-backdrop').remove();
        //$(".modal-backdrop.in").hide();
        //$('.modal').modal('hide');
        //$("#AlertPopup").html("");
        SuccessorErrorMessageAlertBox("Product Dispatch saved successfully.", ModuleName);
        $("div").removeClass("modal-backdrop fade in")
        $('.modal-backdrop').remove();
        $(".modal-backdrop.in").hide();
    }
   


}
function CancelPromt() {
    $("#AlertPopup").modal('hide');
    $("#AlertPopup").html("");
}

$("#btnClearPmsProductDispatch").on("click", function () {

    $("#DDLProjectNoFrom").val("");
    $("#DDLProjectNoTo").val("0");
    $('#ddlDocumentType').val(0).attr("selected", "selected");
    $("#ddlLocation").val(0).attr("selected", "selected");
    $("#ddlTransferIndi").val(0).attr("selected", "selected");

    if ($.fn.DataTable.isDataTable('#tblPmsProductDispatchData')) {
        $('#tblPmsProductDispatchData').DataTable().destroy();
    }
    $('#tblPmsProductDispatchData').empty();
    $('#tblPmsProductDispatchData thead').empty();



    //if($("#btnSavePmsProductDispatch").is(":visible")){
    //    var ActivityDataset = [];
    //    $("#tblPmsProductDispatchData tbody tr").remove();
    //    otable = $('#tblPmsProductDispatchData').dataTable({
    //        "bDestroy": true,
    //        "bJQueryUI": true,
    //        "aaData": ActivityDataset,
    //        "aaSorting": [],
    //        "bAutoWidth": false,
    //        "bDestroy": true,
    //        "sScrollX": "100%",
    //        "sScrollXInner": "2200" /* It varies dynamically if number of columns increases */,
    //        "oLanguage": {
    //            "sEmptyTable": "No Record Found",
    //        },
    //        "columnDefs": [
    //                { "width": "0.1%", "bSortable": false, "targets": 0 },
    //                { "width": "1%", "targets": 1 },
    //                { "width": "2%", "targets": 2 },
    //                { "width": "2%", "targets": 3 },
    //                { "width": "0.5%", "targets": 4 },
    //                { "width": "1%", "targets": 5 },
    //                { "width": "1%", "targets": 6 },
    //                { "width": "1%", "targets": 7 },
    //                { "width": "1%", "targets": 8 },
    //                { "width": "1%", "targets": 9 },
    //                { "width": "0.2%", "targets": 10 },
    //                { "width": "2%", "targets": 11 },
    //                { "width": "2.5%", "targets": 12, },

    //        ],
    //    });
    //}
});

function ToProjectNo() {
    var Data = {
        vWorkSpaceId: productIds[$('#DDLProjectNoFrom').val()],
        vToWorkSpaceId: $("#DDLProjectNoTo").val(),
    }
    var GetProductType = {
        Url: BaseUrl + "PmsProductDispatch/ProjectNoAndSendTo",
        SuccessMethod: "SuccessMethod"
    }

    $.ajax({
        url: GetProductType.Url,
        type: 'POST',
        data: Data,
        async: false,
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("To Project not found.", "DDLProjectNoTo", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        $("#DDLProjectNoTo").empty().append('<option selected="selected" value="0">Please Select Project No</option>');
        $("#ddlLocation").empty().append('<option selected="selected" value="0">Please Select Send To</option>');
        for (var i = 0; i < jsonData.Table.length; i++) {
            $("#DDLProjectNoTo").append($("<option></option>").val(jsonData.Table[i].nstudyno).html(jsonData.Table[i].vWorkSpaceId));
        }
        for (var i = 0; i < jsonData.Table1.length; i++) {
            $("#ddlLocation").append($("<option></option>").val(jsonData.Table1[i].vSendTo).html(jsonData.Table1[i].vSendTo));
        }
    }
}

function GetSendTO() {
    var Data = {
        vWorkSpaceId: productIds[$('#DDLProjectNoFrom').val()],
        vToWorkSpaceId: $("#DDLProjectNoTo").val(),
    }
    var GetProductType = {
        Url: BaseUrl + "PmsProductDispatch/ProjectNoAndSendTo",
        SuccessMethod: "SuccessMethod"
    }
    $.ajax({
        url: GetProductType.Url,
        type: 'POST',
        data: Data,
        async: false,
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("Send To not found.", "ddlLocation", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        $("#ddlLocation").empty().append('<option selected="selected" value="0">Please Select Send To</option>');
        for (var i = 0; i < jsonData.Table1.length; i++) {
            $("#ddlLocation").append($("<option></option>").val(jsonData.Table1[i].vSendTo).html(jsonData.Table1[i].vSendTo));
        }
    }
    GetSiteParentId();
}




function ValidationForm() {
    if (isBlank(document.getElementById('DDLProjectNoFrom').value)) {
        ValidationAlertBox("Please select From Project No.", "DDLProjectNoFrom", ModuleName);
        return false
    }

    else if ($("#DDLProjectNoTo").val() == 0) {
        ValidationAlertBox("Please select To Project No.", "DDLProjectNoTo", ModuleName);
        return false;
    }
    else if ($("#ddlDocumentType").val() == 0) {
        ValidationAlertBox("Please select Reason.", "ddlDocumentType", ModuleName);
        return false;
    }

    else if ($("#ddlTransferIndi").val() == 0) {
        ValidationAlertBox("Please select Product Indication.", "ddlTransferIndi", ModuleName);
        return false;
    }
    return true;
}

//function AppendDateAndTime(e) {
//    if (DateAndTimeFlag != 'Y') {
//        $('#' + e.id).datetimepicker({format: 'DD-MMMM-YYYY hh:mm:ss',showClose: true,});
//        DateAndTimeFlag = 'Y';
//    }
//}