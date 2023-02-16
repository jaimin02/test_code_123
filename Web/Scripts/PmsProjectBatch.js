/// <reference path="General.js" />
var productIds = new Object();
var retentionqty;
var verificationqty;
var oldretentionqty;
var oldverificationqty;
var newretentionqty;
var newverificationqty;
var setworkspaceid="";
var viewmode;
var ModuleName = "Product Information"
var TransferIndi = "";
var reexpirydate = "";
var vProjectNo = "";
var locationForAudit = "";

$(function () {
    CheckSetProject();

    GetViewMode();


    if (setworkspaceid != "") {
        BindData();
    }
    else {
        GetProductType();
    }

    iUserNo = $("#hdnuserid").val();
    $("#spnwelcome").html($("#hdnusername").val());
    $("#spnLoginTime").html($("#hdnlogintime").val());
    $("#DDLProjectNo").prop('disabled', 'disabled');

    $("#tblLotMaster").hide();
    $("#divhide").hide();

    var GetPmsProductBatchProjectNo = {
        //Url: BaseUrl + "PmsProductBatch/GetProjectNo_New",
        Url: BaseUrl + "PmsGeneral/GetScopeWiseProject",
        SuccessMethod: "SuccessMethod"
    }

    $('#ddlProjectNodashboard').on('change keyup paste mouseup', function () {
        if ($('#ddlProjectNodashboard').val().length == 2) {
            var ProjectNoDataTemp = {
                //vProjectNo: $('#ddlProjectNodashboard').val(),
                iUserId: $("#hdnuserid").val(),
                vStudyCode: $('#ddlProjectNodashboard').val(),
                //vProjectTypeCode: $("#hdnscopevalues").val(),
            }
            GetAllPmsProductbatchProjectNo(GetPmsProductBatchProjectNo.Url, GetPmsProductBatchProjectNo.SuccessMethod, ProjectNoDataTemp);

        }
        else if ($('#ddlProjectNodashboard').val().length < 2) {
            $("#ddlProjectNodashboard").autocomplete({
                source: "",
                change: function (event, ui) { },
                select: function (event, ui) {
                    vProjectNo = ui.item.value;
                    $('#ddlProjectNodashboard').val(vProjectNo);
                    BindData();


                },
            });
        }
    });

    $("#btnaddPmsProductbatch").on("click", function () {
        $("#loader").attr("style", "display:block");
        var Result = false;
        var cIsMfgDate = "";
        if ($('#chkMfgDate').is(":checked")) {
            if ($("#mfgdate1").val() != "") {
                cIsMfgDate = 'M';
            }
            else {
                cIsMfgDate = 'D';
            }
        }
        else {
            cIsMfgDate = 'D';
        }

        var cIsExpDate = "";
        if ($("#chkexpDate").is(":visible")) {
            if ($('#chkexpDate').is(":checked")) {
                cIsExpDate = 'M'
            }
            else {
                cIsExpDate = 'D'
            }
        }
        else {
            cIsExpDate = 'D'
        }


        var btntext = (document.getElementById("spnPmsProductbatch").innerText).toLowerCase().trim()

        if (btntext == "save") {
            if ($("#BatchProductNo").val() == "") {
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

                var data = HTMLtbl.getData($('#tblLotMaster'));  // passing that table's ID //
                for (i = 0; i < data.length; i++) {
                    var storedata = data[i];
                    var InsertPMSProductbatchData = {
                        Projectno: storedata[15],
                        ProductNo: storedata[14],
                        Batchno: storedata[2],
                        ManufacturedBy: storedata[3],
                        MfgDate: storedata[4],
                        ExpiryDate: storedata[5],
                        Batchtype: storedata[6],
                        Description: storedata[7],
                        MarketedBy: storedata[8],
                        LabelClaim: storedata[9],
                        DistributedBy: storedata[10],
                        PackDesc: storedata[11],
                        AdditionalRemarks: storedata[12],
                        MarketAuthorization: storedata[13],
                        RetentionDate: storedata[16],
                        RetentionPeriod: storedata[17],
                        RetentionQty: storedata[18],
                        cAssayVerified: storedata[19],
                        cRetQtyConfirmed: storedata[20],
                        cSodVapVerification: storedata[21],
                        cProductCheck: storedata[22],
                        ModifyBy: $("#hdnuserid").val(),
                        cSaveContinueFlag: "S",
                        cReTestDate: storedata[23],
                        iVerificationQty: storedata[24],
                        vMenufacturedFor: storedata[25],
                        cIsMfgDate: cIsMfgDate,
                        cIsExpDate: cIsExpDate
                    }
                    var InsertProductBatchData = {
                        Url: BaseUrl + "PmsProductbatch/InsertEditPmsProductBatch",
                        SuccessMethod: "SuccessMethod",
                        Data: InsertPMSProductbatchData
                    }
                    InsertPmsProductbatchmaster(InsertProductBatchData.Url, InsertProductBatchData.SuccessMethod, InsertProductBatchData.Data);
                    Result = true;
                    GetAllPmsProductBatchData();
                }
                if (Result == true) {
                    SuccessorErrorMessageAlertBox("Product Information saved successfully.", ModuleName);
                }
            }
            else if ($("#BatchProductNo").val() != "") {

                var mfgdate = "";
                if ($('#chkMfgDate').is(":checked")) {
                    mfgdate = $("#mfgdate1").val()
                }
                else {
                    mfgdate = $("#mfgdate").val()
                }

                var expdate = "";
                if ($('#chkexpDate').is(":visible")) {
                    if ($('#chkexpDate').is(":checked")) {
                        expdate = $("#expirydate1").val()
                    }
                    else {
                        expdate = $("#expirydate").val()
                    }
                }
                else {
                    if ($("ddlReTestExpiry").val() == "O") {
                        expdate = ""
                    }
                    else {
                        expdate = $("#expirydate").val()
                    }
                }
              


                var InsertPMSProductbatchData = {
                    Projectno: $("#ProjectID").val(),
                    ProductNo: $("#ddlProductName").val(),
                    Batchno: $("#BatchLotNo").val(),
                    ManufacturedBy: $("#ManufacturedBy").val(),
                    MfgDate: mfgdate,
                    ExpiryDate: expdate,
                    Batchtype: $("#ddlBatchType").val(),
                    Description: $("#Description").val(),
                    MarketedBy: $("#MarketedBy").val(),
                    LabelClaim: $("#LabelClaim").val(),
                    DistributedBy: $("#DistributedBy").val(),
                    PackDesc: $("#PackDesc").val(),
                    AdditionalRemarks: $("#txtAdditionalRemarks").val(),
                    MarketAuthorization: $("#MarketAuthorization").val(),
                    ProductBatchNo: $("#BatchProductNo").val(),
                    Remarks: $("#Remarks").val(),
                    RetentionDate: $("#txtRetentionDate").val(),
                    RetentionPeriod: $("#txtRetentionPeriod").val(),
                    RetentionQty: $("#txtRetentionQty").val(),
                    cAssayVerified: $("#ddlAssayVerified").val(),
                    cRetQtyConfirmed: $("#ddlRetQtyConfirmed").val(),
                    cSodVapVerification: $("#ddlSodVapVerification").val(),
                    cProductCheck: $("#ddlProductCheck").val(),
                    ModifyBy: $("#hdnuserid").val(),
                    cSaveContinueFlag: "S",
                    cReTestDate: $("#ddlReTestExpiry :selected").val(),
                    iVerificationQty: $("#txtVerificationQty").val(),
                    vMenufacturedFor: $("#MenufacturedFor").val(),
                    cIsMfgDate: cIsMfgDate,
                    cIsExpDate: cIsExpDate

                }
                var InsertProductBatchData = {
                    Url: BaseUrl + "PmsProductbatch/InsertEditPmsProductBatch",
                    SuccessMethod: "SuccessMethod",
                    Data: InsertPMSProductbatchData
                }
                InsertPmsProductbatchmaster(InsertProductBatchData.Url, InsertProductBatchData.SuccessMethod, InsertProductBatchData.Data);
                GetAllPmsProductBatchData();
            }

        }
        else if (btntext == "update") {
            TransferIndi = "P";
            if (validateform() == false) { }
            else {
                var mfgdate = "";
                if ($('#chkMfgDate').is(":checked")) {
                    mfgdate = $("#mfgdate1").val()
                }
                else {
                    mfgdate = $("#mfgdate").val()
                }

                var expdate = "";
                if ($('#chkexpDate').is(":visible")) {
                    if ($('#chkexpDate').is(":checked")) {
                        expdate = $("#expirydate1").val()
                    }
                    else {
                        expdate = $("#expirydate").val()
                    }
                }
                else {
                    if ($("ddlReTestExpiry").val() == "O") {
                        expdate = ""
                    }
                    else {
                        expdate = $("#expirydate").val()
                    }
                }

                var InsertPMSProductbatchData = {
                    Projectno: $("#ProjectID").val(),
                    ProductNo: $("#ddlProductName").val(),
                    Batchno: $("#BatchLotNo").val(),
                    ManufacturedBy: $("#ManufacturedBy").val(),
                    MfgDate: mfgdate,
                    ExpiryDate: expdate,
                    Batchtype: $("#ddlBatchType").val(),
                    Description: $("#Description").val(),
                    MarketedBy: $("#MarketedBy").val(),
                    LabelClaim: $("#LabelClaim").val(),
                    DistributedBy: $("#DistributedBy").val(),
                    PackDesc: $("#PackDesc").val(),
                    AdditionalRemarks: $("#txtAdditionalRemarks").val(),
                    MarketAuthorization: $("#MarketAuthorization").val(),
                    ProductBatchNo: $("#BatchProductNo").val(),
                    Remarks: $("#Remarks").val(),
                    RetentionDate: $("#txtRetentionDate").val(),
                    RetentionPeriod: $("#txtRetentionPeriod").val(),
                    RetentionQty: $("#txtRetentionQty").val(),
                    cAssayVerified: $("#ddlAssayVerified").val(),
                    cRetQtyConfirmed: $("#ddlRetQtyConfirmed").val(),
                    cSodVapVerification: $("#ddlSodVapVerification").val(),
                    cProductCheck: $("#ddlProductCheck").val(),
                    ModifyBy: $("#hdnuserid").val(),
                    cSaveContinueFlag: "S",
                    cReTestDate: $("#ddlReTestExpiry :selected").val(),
                    iVerificationQty: $("#txtVerificationQty").val(),
                    vMenufacturedFor: $("#MenufacturedFor").val(),
                    cIsMfgDate: cIsMfgDate,
                    cIsExpDate: cIsExpDate

                }
                var InsertProductBatchData = {
                    Url: BaseUrl + "PmsProductbatch/InsertEditPmsProductBatch",
                    SuccessMethod: "SuccessMethod",
                    Data: InsertPMSProductbatchData
                }
                InsertPmsProductbatchmaster(InsertProductBatchData.Url, InsertProductBatchData.SuccessMethod, InsertProductBatchData.Data);
                GetAllPmsProductBatchData();
                Result = true;
            }
            if (Result == true) {
                SuccessorErrorMessageAlertBox("Product Information updated successfully.", ModuleName);
            }
        }
        $("#loader").attr("style", "display:none");
    })

    $("#btnaddPmsSaveContinue").on("click", function () {
        $("#loader").attr("style", "display:block");
        //var btntext = document.getElementById("btnaddPmsSaveContinue").innerText
        var btntext = document.getElementById("btnaddPmsSaveContinue").value;
        if (btntext == "Save & Continue") {
            if ($("#BatchProductNo").val() == "") {
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
                var data = HTMLtbl.getData($('#tblLotMaster'));  // passing that table's ID //
                for (i = 0; i < data.length; i++) {
                    var storedata = data[i];
                    var InsertPMSProductbatchData = {
                        Projectno: storedata[15],
                        ProductNo: storedata[14],
                        Batchno: storedata[2],
                        ManufacturedBy: storedata[3],
                        MfgDate: storedata[4],
                        ExpiryDate: storedata[5],
                        Batchtype: storedata[6],
                        Description: storedata[7],
                        MarketedBy: storedata[8],
                        LabelClaim: storedata[9],
                        DistributedBy: storedata[10],
                        PackDesc: storedata[11],
                        AdditionalRemarks: storedata[12],
                        MarketAuthorization: storedata[13],
                        RetentionDate: storedata[16],
                        RetentionPeriod: storedata[17],
                        RetentionQty: storedata[18],
                        cAssayVerified: storedata[19],
                        cRetQtyConfirmed: storedata[20],
                        cSodVapVerification: storedata[21],
                        cProductCheck: storedata[22],
                        cReTestDate: storedata[23],
                        ModifyBy: $("#hdnuserid").val(),
                        cSaveContinueFlag: "C"
                    }
                    var InsertProductBatchData = {
                        Url: BaseUrl + "PmsProductbatch/InsertEditPmsProductBatch",
                        SuccessMethod: "SuccessMethod",
                        Data: InsertPMSProductbatchData
                    }
                    InsertPmsProductbatchmaster(InsertProductBatchData.Url, InsertProductBatchData.SuccessMethod, InsertProductBatchData.Data);
                    GetAllPmsProductBatchData();
                }
            }
            else if ($("#BatchProductNo").val() != "") {
                var mfgdate = "";
                if ($('#chkMfgDate').is(":checked")) {
                    mfgdate = $("#mfgdate1").val()
                }
                else {
                    mfgdate = $("#mfgdate").val()
                }

                var InsertPMSProductbatchData = {
                    Projectno: $("#ProjectID").val(),
                    ProductNo: $("#ddlProductName").val(),
                    Batchno: $("#BatchLotNo").val(),
                    ManufacturedBy: $("#ManufacturedBy").val(),
                    MfgDate: mfgdate,
                    ExpiryDate: $("#expirydate").val(),
                    Batchtype: $("#ddlBatchType").val(),
                    Description: $("#Description").val(),
                    MarketedBy: $("#MarketedBy").val(),
                    LabelClaim: $("#LabelClaim").val(),
                    DistributedBy: $("#DistributedBy").val(),
                    PackDesc: $("#PackDesc").val(),
                    AdditionalRemarks: $("#txtAdditionalRemarks").val(),
                    MarketAuthorization: $("#MarketAuthorization").val(),
                    ProductBatchNo: $("#BatchProductNo").val(),
                    Remarks: $("#Remarks").val(),
                    RetentionDate: $("#txtRetentionDate").val(),
                    RetentionPeriod: $("#txtRetentionPeriod").val(),
                    RetentionQty: $("#txtRetentionQty").val(),
                    cAssayVerified: $("#ddlAssayVerified").val(),
                    cRetQtyConfirmed: $("#ddlRetQtyConfirmed").val(),
                    cSodVapVerification: $("#ddlSodVapVerification").val(),
                    cProductCheck: $("#ddlProductCheck").val(),
                    ModifyBy: $("#hdnuserid").val(),
                    cSaveContinueFlag: "C",
                    cReTestDate: $("#ddlReTestExpiry :selected").val(),
                }
                var InsertProductBatchData = {
                    Url: BaseUrl + "PmsProductbatch/InsertEditPmsProductBatch",
                    SuccessMethod: "SuccessMethod",
                    Data: InsertPMSProductbatchData
                }
                InsertPmsProductbatchmaster(InsertProductBatchData.Url, InsertProductBatchData.SuccessMethod, InsertProductBatchData.Data);
                GetAllPmsProductBatchData();
            }

        }
        $("#loader").attr("style", "display:none");

    })

    $("#ddlProductType").on("change", function () {
        GetProduct();
    });

    $("#ddlProductName").on("change", function () {
        var btntext = (document.getElementById("spnPmsProductbatch").innerText).toLowerCase().trim()
        if (btntext == "save") {
            GetProductBatchDataForTransfer();
        }
    });

    $("#btnExitPmsStorageLocation").on("click", function () {
        $('#ddlProjectNodashboard').prop('disabled', false);
        ConfirmAlertBox(ModuleName);
    });

    $("#btnClearPmsStorageLocation").on("click", function () {
        closepopup();
    });

    $("#btnAddProductBatch").on("click", function () {
        closepopup();
        reexpirydate = "";
        $("#DDLProjectNo").val($("#ddlProjectNodashboard").val());
        jQuery("#titleMode").text('Mode:-Add');
        jQuery("#spnPmsProductbatch").text('Save');

        $('#btnaddPmsProductbatch').removeAttr("title");
        $('#btnaddPmsProductbatch').attr("title", "Save");
        $("#ddlProductName").removeAttr("disabled");
        $("#ddlProductName").empty().append('<option selected="selected" value="0">Please Select Product</option>');
        $("#btnAddLot").show();
        $("#divRemarks").attr("style", "display:none");
        $("#DDLProjectNo").val($("#ddlProjectNodashboard").val());
        $('.AuditControl').each(function () { this.style.display = "none"; });
        $('.form-control').each(function () {
            $(this).attr('disabled', false);
        });

        $("#btnaddPmsProductbatch").attr("style", "display:inline");
        $("#btnClearPmsStorageLocation").attr("style", "display:inline");
        $("#btnaddPmsSaveContinue").attr("style", "display:none");

        if (isBlank(document.getElementById('ddlProjectNodashboard').value)) {
            SuccessorErrorMessageAlertBox("Please enter Project no.", ModuleName);
            return false;
        }
        $("#tblLotMaster tbody tr").remove();
        $("#tblLotMaster thead").hide();

        $("#DDLProjectNo").prop('disabled', 'disabled');
        $("#btnaddPmsProductbatch").hide();
        GetProductType();

        $("#chkexpDate").show();
        $("#chkMfgDate").show();
        $('#dateNA').show();

        $("#chkMfgDate").prop('checked', false);
        $("#chkexpDate").prop('checked', false);
        $('#expirydate').val('');
        $('#expirydate1').val('');
        $('#mfgdate').val('');
        $('#mfgdate1').val('');
        $('#mfgdate1').val('');
        $('#expirydate').show();
        $('#mfgdate').show();
        $('#expirydate1').hide();
        $('#mfgdate1').hide();
        //$("#ProductBatchModel").modal('show');
    });

    $("#ddlProjectNodashboard").on("blur", function () {
        BindData();
    });



    var date = new Date();
    $('#expirydate').datetimepicker({ format: 'DD-MMM-YYYY', minDate: new Date(), });
    $('#expirydate1').datetimepicker({ format: 'MMM-YYYY', minDate: new Date(), });

    $('#mfgdate').datetimepicker({ format: 'DD-MMM-YYYY', maxDate: new Date() });
    //$('#mfgdate').datetimepicker({ format: 'DD-MMM-YYYY', maxDate: new Date() });
    $('#txtRetentionDate').datetimepicker({ format: 'DD-MMMM-YYYY', });

    $('#mfgdate1').datetimepicker({ format: 'MMM-YYYY', maxDate: new Date() });

    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('.modal').modal('hide');
});

var GetAllPmsProductbatchProjectNo = function (Url, SuccessMethod, ProjectNoDataTemp) {

    $.ajax({
        url: Url,
        type: 'GET',
        data: { iUserId: ProjectNoDataTemp.iUserId, vStudyCode: ProjectNoDataTemp.vStudyCode },
        async: false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("No Project found.", ModuleName);

        }
    });
    function SuccessMethod(jsonData) {
        var jsonObj = jsonData;
        var sourceArr = [];

        for (var i = 0; i < jsonObj.length; i++) {
            sourceArr.push("[ " + jsonObj[i].vStudyCode + " ]" + " " + jsonObj[i].vStudyName);
            productIds["[ " + jsonObj[i].vStudyCode + " ]" + " " + jsonObj[i].vStudyName] = jsonObj[i].nStudyNo;
        }

        $("#ddlProjectNodashboard").autocomplete({
            source: sourceArr,
            change: function (event, ui) { }
        });

        $("#DDLProjectNo").autocomplete({
            source: sourceArr,
            change: function (event, ui) { }
        });
    }
}

var InsertPmsProductbatchmaster = function (Url, SuccessMethod, Data) {
    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        async: false,
        success: SuccessInsertData,
        error: function () {
            SuccessorErrorMessageAlertBox("Error in insert data.", ModuleName);

        }
    });
    function SuccessInsertData(response) {
        GetAllPmsProductBatchData();
        //if ((document.getElementById("spnPmsProductbatch").innerText).toLowerCase().trim() == "save") {
        //    //SuccessorErrorMessageAlertBox("Data Save Successfully !", ModuleName);
        //}
        //else {
        //    SuccessorErrorMessageAlertBox(response, ModuleName);
        //}


        $("#tblLotMaster tbody tr").remove();
        $("#tblLotMaster thead").hide();
        $("#btnaddPmsProductbatch").hide();
        var result = response.d;
        closepopup();
    }
}

function GetAllPmsProductBatchData() {
    reexpirydate = "";
    if (productIds[$('#ddlProjectNodashboard').val()] != undefined) {
        setworkspaceid = productIds[$('#ddlProjectNodashboard').val()];
    }
    var GetPMSProductBatchData = {
        Url: BaseUrl + "PmsProductBatch/GetAllProductBatchData/" + setworkspaceid + "",
        SuccessMethod: "SuccessMethod"
    }

    // For Server use

    $.ajax({
        type: "GET",
        url: BaseUrl + "PmsProductBatch/GetAllProductBatchData",
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
        var UserTypeCode = "";
        if (jsonData.length == 0) {
            $("#divexport").hide();
        }
        else {
            $("#divexport").show();
        }
        var Edit_c = "";
        var ActivityDataset = [];
        UserTypeCode = $("#hdnUserTypeCode").val();

        if (setworkspaceid != undefined) {
            for (var i = 0; i < jsonData.length; i++) {

                var InDataset = [];

                if (viewmode == "OnlyView") {
                    Edit_c = '<a data-tooltip="tooltip" title="Edit" class="disabled"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a>'
                }
                else {
                    if ($("#hdnUserProfile").val().includes(UserTypeCode)) {
                        Edit_c = '<a data-tooltip="tooltip" title="Edit" class="disabled"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a>'
                    }
                    else {
                        Edit_c = '<a data-toggle="modal" data-tooltip="tooltip" title="Edit" data-target="#ProductBatchModel" attrid="' + jsonData[i].nStudyProductBatchNo + '" class="btnedit" Onclick=SelectionDataProductBatch("' + jsonData[i].nStudyProductBatchNo + '") style="cursor:pointer;"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a>'
                    }
                }

                InDataset.push(jsonData[i].nStudyProductBatchNo, jsonData[i].vStudyCode, jsonData[i].cTransferIndi, jsonData[i].vProductName, jsonData[i].vBatchLotNo, jsonData[i].MfgDate,
                               jsonData[i].ExpDate, Edit_c, '', jsonData[i].cSaveContinueFlag, jsonData[i].vProductType, jsonData[i].cBatchLotType);
                ActivityDataset.push(InDataset);
            }
            otable = $('#tblPmsProductbatchData').dataTable({
                "bJQueryUI": true,
                "sPaginationType": "full_numbers",
                "bLengthChange": true,
                "iDisplayLength": 10,
                "bProcessing": true,
                "bSort": true,
                "autoWidth": false,
                "aaData": ActivityDataset,
                "bInfo": true,
                "bDestroy": true,
                //"sScrollY": "200px",
                "sScrollX": "117%",
                "sScrollXInner": "1260" /* It varies dynamically if number of columns increases */,
                "fnCreatedRow": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    $('td:eq(7)', nRow).append('<a data-toggle="modal" data-tooltip="tooltip" title="Audit Trail" data-target="#ProductBatchModel" attrid="' + aData[0]
                                         + '" class="btnedit" Onclick=AuditTrailProductBatch("' + aData[0] + '") style="cursor:pointer;"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-file-text-o"></i><span>Audit</span></a>');
                },
                "aoColumns": [
                    { "sTitle": "Product Batch No" },
                    { "sTitle": "Project No" },
                    { "sTitle": "Product Indication" },
                    { "sTitle": "Product Name" },
                    { "sTitle": "Batch/Lot/Lot No" },
                    { "sTitle": "Mfg Date" },
                    { "sTitle": "Re-Test / Expiry / Provisional Expiry Date" },
                    { "sTitle": "Edit" },
                    { "sTitle": "Audit Trail" },

                ],
                "columnDefs": [
                    {
                        "targets": [0, 9, 11, 10],
                        "visible": false,
                        "searchable": false
                    },
                    { "bSortable": false, "targets": [7, 8] },
                    { "width": "4%", "targets": 1 },
                    { "width": "5%", "targets": 2 },
                    { "width": "4%", "targets": 3 },
                    { "width": "4%", "targets": 4 },
                    { "width": "6%", "targets": 5 },
                    { "width": "8%", "targets": 6 },
                    { "width": "2%", "targets": 7 },
                    { "width": "3%", "targets": 8 },

                ],
                "oLanguage": {
                    "sEmptyTable": "No Record Found",
                },
            });
        }
    }
}

function GetProduct() {
    if (productIds[$('#ddlProjectNodashboard').val()] != undefined) {
        setworkspaceid = productIds[$('#ddlProjectNodashboard').val()];
    }

    var GetProductNameData = {
        vWorkSpaceId: setworkspaceid,
        nProductTypeID: $("#ddlProductType").val(),
        cTransferIndi: $("#ddlTransferIndi").val(),
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
            SuccessorErrorMessageAlertBox("No Product found.", ModuleName);

        }
    });

    function SuccessMethod(jsonData) {
        var strdata = "";
        if (jsonData.length > 0) {
            $("#ddlProductName").empty().append('<option selected="selected" value="0">Please Select Product</option>');
            for (var i = 0; i < jsonData.length; i++)
                $("#ddlProductName").append($("<option></option>").val(jsonData[i].nProductNo).html(jsonData[i].vProductName));
        }
        else {
            $("#ddlProductName").empty().append('<option selected="selected" value="0">Please Select Product</option>');
        }
    }
}

function AddTempPmsProductbatch() {
    var strdata = "";
    if (validateform() == false) { }
    else
    {
        var mfgdate = "";
        if ($('#chkMfgDate').is(":checked")) {
           
            mfgdate = $("#mfgdate1").val()
        }
        else {
            mfgdate = $("#mfgdate").val()
        }

        var expdate = "";
        if ($('#chkexpDate').is(":checked")) {
            expdate = $("#expirydate1").val()
        }
        else {
            expdate = $("#expirydate").val()
        }


        strdata += "<tr>";
        strdata += "<td>" + $("#DDLProjectNo").val() + "</td>";
        strdata += "<td>" + $("#ddlProductName :selected").text() + "</td>";
        strdata += "<td>" + $("#BatchLotNo").val() + "</td>";
        strdata += "<td>" + $("#ManufacturedBy").val() + "</td>";
        strdata += "<td>" + mfgdate + "</td>";
        strdata += "<td>" + expdate + "</td>";
        strdata += "<td class='hidetd'>" + $("#ddlBatchType").val() + "</td>";
        strdata += "<td class='hidetd'>" + $("#Description").val() + "</td>";
        strdata += "<td class='hidetd'>" + $("#MarketedBy").val() + "</td>";
        strdata += "<td class='hidetd'>" + $("#LabelClaim").val() + "</td>";
        strdata += "<td class='hidetd'>" + $("#DistributedBy").val() + "</td>";
        strdata += "<td class='hidetd'>" + $("#PackDesc").val() + "</td>";
        strdata += "<td class='hidetd'>" + $("#txtAdditionalRemarks").val() + "</td>";
        strdata += "<td class='hidetd'>" + $("#MarketAuthorization").val() + "</td>";
        strdata += "<td class='hidetd'>" + $("#ddlProductName").val() + "</td>";
        strdata += "<td class='hidetd'>" + setworkspaceid + "</td>";
        strdata += "<td class='hidetd'>" + $("#txtRetentionDate").val() + "</td>";
        strdata += "<td class='hidetd'>" + $("#txtRetentionPeriod").val() + "</td>";
        strdata += "<td class='hidetd'>" + $("#txtRetentionQty").val() + "</td>";
        strdata += "<td class='hidetd'>" + $("#ddlAssayVerified :selected").val() + "</td>";
        strdata += "<td class='hidetd'>" + $("#ddlRetQtyConfirmed :selected").val() + "</td>";
        strdata += "<td class='hidetd'>" + $("#ddlSodVapVerification :selected").val() + "</td>";
        strdata += "<td class='hidetd'>" + $("#ddlProductCheck :selected").val() + "</td>";
        strdata += "<td class='hidetd'>" + $("#ddlReTestExpiry :selected").val() + "</td>";
        strdata += "<td class='hidetd'>" + $("#txtVerificationQty").val() + "</td>";
        strdata += "<td class='hidetd'>" + $("#MenufacturedFor").val() + "</td>";
        strdata += "<td id='trRemove'><span class='glyphicon glyphicon-remove'></span></td>";
        strdata += "</tr>";
        $("#tblLotMaster").append(strdata);
        $(".hidetd").hide();
        $("#tblLotMaster thead").show();
        $("#tblLotMaster").show();
        //$("#btnaddPmsProductbatch").show();
        $("#btnaddPmsProductbatch").attr("style", "display:inline");
        $("#btnaddPmsSaveContinue").attr("style", "display:none");
        closepopup();
    }
}

function closepopup() {
    var btntext = (document.getElementById("spnPmsProductbatch").innerText).toLowerCase().trim();
    if (btntext == "save") {
        $("#BatchProductNo").val("");
        $('#ddlProductType').val(0).attr("selected", "selected");
        $('#ddlProductName').val(0).attr("selected", "selected");
    }
    $("#BatchLotNo").val("");
    $("#ManufacturedBy").val("");
    $("#Description").val("");
    $("#MarketedBy").val("");
    $("#LabelClaim").val("");
    $("#DistributedBy").val("");
    $("#PackDesc").val("");
    $("#MarketAuthorization").val("");
    $("#Remarks").val("");
    $("#txtAdditionalRemarks").val("");
    $("#ddlBatchType").val(0);
    //$("#expirydate").val("");
    //$('#expirydate').data("DateTimePicker").clear();
    $("#mfgdate").val("");
    $('#mfgdate').data("DateTimePicker").clear();
    $("#txtRetentionDate").val("");
    $('#txtRetentionDate').data("DateTimePicker").clear();
    $("#txtRetentionPeriod").val("");
    $("#txtRetentionQty").val("");
    $("#mfgdate").attr("placeholder", "Manufacturing Date")
    $("#expirydate").attr("placeholder", "Re-Test/Expiry/Provisional Expiry Date");
    $("#txtRetentionDate").attr("placeholder", "Retention Start Date");
    $("#txtRetentionPeriod").attr("placeholder", "Retention Period");
    $('#ddlSodVapVerification').val("0").attr("selected", "selected");
    $('#ddlAssayVerified').val("0").attr("selected", "selected");
    $('#ddlRetQtyConfirmed').val("0").attr("selected", "selected");
    $('#ddlProductCheck').val("0").attr("selected", "selected");
    //$('#ddlReTestExpiry').val("0").attr("selected", "selected");
    $("#txtVerificationQty").val("");
    //$('#ddlTransferIndi').val("0");

    $("#MenufacturedFor").val('');
}

function validateform() {

    if (Dropdown_Validation(document.getElementById("ddlTransferIndi"))) {
        ValidationAlertBox("Please select Product Indication.", "ddlTransferIndi", ModuleName);
        return false;
    }

    if (Dropdown_Validation(document.getElementById("ddlProductType"))) {
        ValidationAlertBox("Please select Product Type.", "ddlProductType", ModuleName);
        return false;
    }

    if (Dropdown_Validation(document.getElementById("ddlProductName"))) {
        ValidationAlertBox("Please select Product Name.", "ddlProductName", ModuleName);
        return false;
    }

    if (TransferIndi == "P") {
        if (Dropdown_Validation(document.getElementById("ddlBatchType"))) {
            ValidationAlertBox("Please select Batch/Lot/Lot No Type.", "ddlBatchType", ModuleName);
            return false;
        }

        if (isBlank(document.getElementById('BatchLotNo').value)) {
            ValidationAlertBox("Please enter Batch/Lot/Lot No.", "BatchLotNo", ModuleName);
            return false;
        }
    }

    if (Dropdown_Validation(document.getElementById("ddlReTestExpiry"))) {
        ValidationAlertBox("Please select Re-Test/Expiry/Provisional Expiry Date.", "ddlReTestExpiry", ModuleName);
        return false;
    }


    if ($("#ddlReTestExpiry").val() != "0" && $("#ddlReTestExpiry").val().toLowerCase() != "o") {

        if ($('#chkexpDate').is(":checked")) {
            expiry_date = $("#expirydate1").val()
        }
        else {
            expiry_date = $("#expirydate").val()
        }

        //if ($('#expirydate1').is(":visible")) {
        //    expiry_date = $("#expirydate1").val()
        //}
        //else {
        //    expiry_date = $("#expirydate").val()
        //}

        if (isBlank(expiry_date)) {
            ValidationAlertBox("Please enter Re-Test/Expiry/Provisional Expiry Date.", "expirydate", ModuleName);
            return false;
        }
    }

    if (CheckDateMoreThenToday(document.getElementById('mfgdate').value)) {
        mfgdate.value = "";
        ValidationAlertBox("Manufacturing date should be less than Current date.", "mfgdate", ModuleName);
        return false;
    }


    if ($('#chkMfgDate').is(":checked")) {
        Mfg_date = $("#mfgdate1").val()
    }
    else {
        Mfg_date = $("#mfgdate").val()
    }

    if ($('#chkexpDate').is(":checked")) {
        expiry_date = $("#expirydate1").val();
        //expiry_date.getFullYear() 
    }
    else {
        expiry_date = $("#expirydate").val()
    }



    if (Date.parse(Mfg_date) > Date.parse(expiry_date)) {
        ValidationAlertBox("Mfg date should not greater then Expiry date.", "mfgdate", ModuleName);
        return false;
    }

    var newexpirydate = document.getElementById('expirydate').value;
    if (reexpirydate != newexpirydate) {
        if (CheckDateLessThenToday(document.getElementById('expirydate').value)) {
            expirydate.value = "";
            expirydate.focus();
            ValidationAlertBox("Expiry date should be greater than Current date.", "expirydate", ModuleName);
            return false;
        }
    }
    if ((document.getElementById("spnPmsProductbatch").innerText).toLowerCase().trim() == "update") {
        if (isBlank(document.getElementById('Remarks').value)) {
            ValidationAlertBox("Please enter Remarks.", "Remarks", ModuleName);
            return false;
        }
    }

    if ((document.getElementById("spnPmsProductbatch").innerText).toLowerCase().trim() == "update") {
        var ProductName = ($("#ddlProductName :selected").text()).trim();
        var ProductType = ($("#ddlProductType :selected").text()).trim();
        var BatchType = ($("#ddlBatchType :selected").text()).trim();
        var BatchLotNo = $("#BatchLotNo").val();


        var rows = $("#tblPmsProductbatchData").dataTable().fnGetData();

        for (i = 0; i < rows.length; i++) {

            if (ProductType.toUpperCase() == rows[i][10].trim().toUpperCase()) {
                if (ProductName.toUpperCase() == rows[i][3].trim().toUpperCase()) {
                    if (BatchType.toUpperCase() == rows[i][11].trim().toUpperCase()) {
                        if (BatchLotNo.toUpperCase() == rows[i][4].trim().toUpperCase()) {
                            var batchNo = rows[i - 0][0];
                            if (batchNo != $("#BatchProductNo").val()) {
                                ValidationAlertBox("This Batch/Lot/Lot No already exists.", "BatchLotNo", ModuleName);
                                return false;
                                break;
                            }

                        }
                    }
                }
            }
        }
        return true;
    }

    if ((document.getElementById("btnAddLot").innerText).toLowerCase().trim() == "add") {
        var ProductName = ($("#ddlProductName :selected").text()).trim();
        var ProductType = ($("#ddlProductType :selected").text()).trim();
        var BatchType = ($("#ddlBatchType :selected").text()).trim();
        var BatchLotNo = $("#BatchLotNo").val();


        var rows = $("#tblPmsProductbatchData").dataTable().fnGetData();

        for (i = 0; i < rows.length; i++) {

            if (ProductType.toUpperCase() == rows[i][10].trim().toUpperCase()) {
                if (ProductName.toUpperCase() == rows[i][3].trim().toUpperCase()) {
                    if (BatchType.toUpperCase() == rows[i][11].trim().toUpperCase()) {
                        if (BatchLotNo.toUpperCase() == rows[i][4].trim().toUpperCase()) {
                            ValidationAlertBox("This Batch/Lot/Lot No already exists.", "BatchLotNo", ModuleName);
                            return false;
                            break;
                        }
                    }
                }
            }
        }
        return true;
    }



}

function SelectionDataProductBatch(batchno) {
    $('.AuditControl').each(function () { this.style.display = "none"; });
    $('.form-control').each(function () {
        0
        $(this).attr('disabled', false);
    });
    $("#btnaddPmsProductbatch").attr("style", "display:inline");
    $("#btnClearPmsStorageLocation").attr("style", "display:inline");
    jQuery("#titleMode").text('Mode:-Edit');
    $("#Remarks").val("");
    jQuery("#spnPmsProductbatch").text('Update');
    $('#btnaddPmsProductbatch').removeAttr("title");
    $('#btnaddPmsProductbatch').attr("title", "Update");
    $("#btnaddPmsProductbatch").show();
    $("#btnAddLot").hide();
    $("#divRemarks").attr("style", "display:inline");
    $("#ddlTransferIndi").prop('disabled', 'disabled');
    $("#ddlReTestExpiry").prop('disabled', 'disabled');
    var GetallProductBatchData = {
        Url: BaseUrl + "PmsProductBatch/GetSelectProductBatchData/" + batchno + "",
        SuccessMethod: "SuccessMethod"
    }

    // For Server use

    $.ajax({
        type: "GET",
        url: BaseUrl + "PmsProductBatch/GetSelectProductBatchData",
        data: { id: batchno },
       // contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessMethod1,
        error: function () {
            SuccessorErrorMessageAlertBox("Error to edit data.", ModuleName);
        }
    });
    
}

function SuccessMethod1(jsonData) {    
    $("#tblLotMaster tbody tr").remove();
    $("#tblLotMaster thead").hide();
    var strdata = "";
    if (jsonData.length > 0) {
        $("#DDLProjectNo").val($("#ddlProjectNodashboard").val());

        $("#BatchProductNo").val(jsonData[0].nStudyProductBatchNo);
        $('#DDLProjectNo').val(jsonData[0].vStudyCode).attr("selected", "selected");
        $('#ddlProductType').val(jsonData[0].nProductTypeID).attr("selected", "selected");
        $("#ProjectID").val(jsonData[0].ProjectID);
        $("#ddlProductName").empty().append($("<option></option>").val(jsonData[0].nProductNo).html(jsonData[0].vProductName));
        $('#ddlBatchType').val(jsonData[0].cBatchLotType).attr("selected", "selected");
        $("#ddlProductName").prop('disabled', 'disabled');
        $("#DDLProjectNo").prop('disabled', 'disabled');
        $("#ddlProductType").prop('disabled', 'disabled');
        $("#BatchLotNo").val(jsonData[0].vBatchLotNo);
        $("#ManufacturedBy").val(jsonData[0].vManufacturedBy);
        $("#Description").val(jsonData[0].vDescription);
        $("#MarketedBy").val(jsonData[0].vMarketedBy);
        $("#LabelClaim").val(jsonData[0].vLabelClaim);
        $("#DistributedBy").val(jsonData[0].vDistributedBy);
        $("#PackDesc").val(jsonData[0].vDescriptionOnPack);
        $("#txtAdditionalRemarks").val(jsonData[0].vAdditionalRemark);
        $("#MarketAuthorization").val(jsonData[0].vMarketAuthorization);
        //$("#txtRetentionPeriod").val(jsonData[0].iRetentionPeriod);
        $("#txtRetentionQty").val(jsonData[0].iRetentionQty);
        $('#ddlAssayVerified').val(jsonData[0].cAssayVerified).attr("selected", "selected");
        $('#ddlRetQtyConfirmed').val(jsonData[0].cRetQtyConfirmed).attr("selected", "selected");
        $('#ddlSodVapVerification').val(jsonData[0].cSodVapVerification).attr("selected", "selected");
        $('#ddlProductCheck').val(jsonData[0].cProductCheck).attr("selected", "selected");
        $('#ddlReTestExpiry').val(jsonData[0].cReTestDate).attr("selected", "selected");

        $('#MenufacturedFor').val(jsonData[0].vMenufacturedFor).attr("selected", "selected");


        if ($("#ddlReTestExpiry").val().trim().toLowerCase() == "o") {
            $("#expirydate").val('');
            $("#expirydate").attr('disabled', 'disabled');
        }
        else {

            if (jsonData[0].cIsExpDate == "M") {
                $("#expirydate1").val('');
                $("#expirydate1").attr('disabled', 'disabled');

            } else {
                $("#expirydate").val('');
                $("#expirydate").attr('disabled', 'disabled');
            }
        }

        $("#chkexpDate").show();
        $("#chkMfgDate").show();
        $('#txtVerificationQty').val(jsonData[0].iVerificationQty).attr("selected", "selected");

        oldretentionqty = parseInt(jsonData[0].iRetentionQty);
        oldverificationqty = parseInt(jsonData[0].iVerificationQty);
        $("#ddlTransferIndi").val(jsonData[0].cProductKitIndication);

        if (jsonData[0].cProductKitIndication == "P") {
            $(".hidekit").attr("style", "display:inline");
        }
        else if (jsonData[0].cProductKitIndication == "K") {
            $(".hidekit").attr("style", "display:inline");
        }
        else {
            $(".hidekit").attr("style", "display:inline");
        }

        if (jsonData[0].dMfgDate == "1900-01-01T00:00:00") {

            if (jsonData[0].cIsMfgDate == "M") {
                $("#mfgdate1").show();
                $("#mfgdate").hide();
                $("#mfgdate1").val("");
                $('#mfgdate1').data("DateTimePicker").clear();
                $("#mfgdate1").attr("placeholder", "Not Applicable")
            }
            else {
                $("#mfgdate").show();
                $("#mfgdate1").hide();
                $("#mfgdate").val("");
                $('#mfgdate').data("DateTimePicker").clear();
                $("#mfgdate").attr("placeholder", "Not Applicable")
            }

        }
        else {
            var MonthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var tmpmfgdate = jsonData[0].dMfgDate
            var date = tmpmfgdate.split("-");
            var result = date[2].split("T")
            var time = result[1].split(":");
            var monthinid = parseInt(date[1]);
            if (jsonData[0].cIsMfgDate == "M") {
                var datetime = MonthList[monthinid - 1] + "-" + date[0];
            } else {
                var datetime = result[0] + "-" + MonthList[monthinid - 1] + "-" + date[0];
            }

            if (jsonData[0].cIsMfgDate == "M") {

                $('#mfgdate').val('');
                $('#mfgdate1').val('');
                $("#mfgdate").css('display', 'none');
                $("#mfgdate1").css('display', 'block');
                $('#mfgdate').data("DateTimePicker").clear();
                $('#mfgdate1').data("DateTimePicker").clear();
                $('#mfgdate1').datetimepicker({ format: 'MMM-YYYY', maxDate: new Date() });
                $("#mfgdate1").val(datetime);
            }
            else {
                $('#mfgdate').val('');
                $('#mfgdate1').val('');
                $("#mfgdate").css('display', 'block');
                $("#mfgdate1").css('display', 'none')
                $('#mfgdate').data("DateTimePicker").clear();
                $('#mfgdate1').data("DateTimePicker").clear();
                $('#mfgdate').datetimepicker({ format: 'DD-MMM-YYYY', maxDate: new Date() });
                $("#mfgdate").val(datetime);
            }
        }

        if (jsonData[0].cIsMfgDate == "M") {
            $('#chkMfgDate').prop('checked', true)

        } else {
            $('#chkMfgDate').prop('checked', false)
        }

        if (jsonData[0].cIsExpDate == "M") {
            var isDisabled = $("#expirydate1").prop('disabled');
            if (isDisabled) {
                $('#chkexpDate').prop('checked', true);
                $('#dateNA').show();
                //$('#chkexpDate').hide();
                //$('#dateNA').hide();
            }
            else {
                $('#chkexpDate').prop('checked', false)
            }   

        } else {
            var isDisabled = $("#expirydate").prop('disabled');
            if (isDisabled) {
                $('#chkexpDate').prop('checked', false);
                $('#dateNA').show();
                //$('#chkexpDate').hide();
                //$('#dateNA').hide();
            }
            else {
                $('#chkexpDate').prop('checked', false)
            }

        }

        if (jsonData[0].dExpDate == "1900-01-01T00:00:00") {
            $("#expirydate").val("");
            $('#expirydate').data("DateTimePicker").clear();
            $("#expirydate").attr("placeholder", "Not Applicable")
        }
        else {
            var MonthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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

            if (jsonData[0].cIsExpDate == "M") {

                $("#expirydate").css('display', 'none');
                $("#expirydate1").css('display', 'block')
                $('#expirydate').data("DateTimePicker").clear();
                $('#expirydate1').data("DateTimePicker").clear();
                $('#expirydate1').datetimepicker({ format: 'MMM-YYYY', maxDate: new Date() });
                $("#expirydate1").val(datetime);
            }
            else {
                $("#expirydate").css('display', 'block');
                $("#expirydate1").css('display', 'none')
                $('#expirydate').data("DateTimePicker").clear();
                $('#expirydate1').data("DateTimePicker").clear();
                $('#expirydate').datetimepicker({ format: 'DD-MMM-YYYY', maxDate: new Date() });
                $("#expirydate").val(datetime);
            }

            reexpirydate = datetime;

        }


        if (jsonData[0].dRetentionDate == "1900-01-01T00:00:00") {
            $("#txtRetentionDate").val("");
            $('#txtRetentionDate').data("DateTimePicker").clear();
            $("#txtRetentionDate").attr("placeholder", "Not Applicable")
        }
        else {
            var MonthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var tmpretetiondate = jsonData[0].dRetentionDate
            var date = tmpretetiondate.split("-");
            var result = date[2].split("T")
            var time = result[1].split(":");
            var monthinid = parseInt(date[1]);
            var datetime = result[0] + "-" + MonthList[monthinid - 1] + "-" + date[0];
            $("#txtRetentionDate").val(datetime);

        }

        if (jsonData[0].iRetentionPeriod == "0") {
            $("#txtRetentionPeriod").attr("placeholder", "Not Applicable")
        }
        else {
            $("#txtRetentionPeriod").val(jsonData[0].iRetentionPeriod);
        }

        if (jsonData[0].cSaveContinueFlag == "C") {
            document.getElementById("btnaddPmsProductbatch").innerText = "Save";
            $("#btnaddPmsSaveContinue").attr("style", "display:none");
        }
        else if (jsonData[0].cSaveContinueFlag == "S") {
            $("#btnaddPmsSaveContinue").attr("style", "display:none");
        }

        if ($("#titleMode").text() == "Audit Trail") {
            $("#btnaddPmsSaveContinue").attr("style", "display:none");
        }

    }
}

function AuditTrailProductBatch(batchno) {
    jQuery("#titleMode").text('Audit Trail');
    $("#divRemarks").attr("style", "display:none");

    $('.form-control').each(function () {
        $(this).attr('disabled', true);
    });

    $("#btnaddPmsProductbatch").attr("style", "display:none");
    $("#btnClearPmsStorageLocation").attr("style", "display:none");
    $("#btnAddLot").attr("style", "display:none");
    $('#ddlProjectNodashboard').prop('disabled', false);

    locationForAudit = "";
    locationForAudit = batchno;

    var GetallStudyProductData = {
        Url: BaseUrl + "PmsStudyProduct/StudyProductAuditTrailColor",
        SuccessMethod: "SuccessMethod"
    }

    var FilterData = {
        ProductNo: batchno,
        vPageName: 'Product Information'
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



    var GetallProductBatchData = {
        Url: BaseUrl + "PmsProductBatch/GetSelectProductBatchData/" + locationForAudit + "",
        SuccessMethod: "SuccessMethod"
    }

    // For Server use

    $.ajax({
        type: "GET",
        url: BaseUrl + "PmsProductBatch/GetSelectProductBatchData",
        data: { id: locationForAudit },
        //contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessMethod2,
        error: function () {
            SuccessorErrorMessageAlertBox("Error to show Audit Trail data.", ModuleName);
        }
    });
   
}

function SuccessMethod2(jsonData) {
    
    $("#tblLotMaster tbody tr").remove();
    $("#tblLotMaster thead").hide();
    var strdata = "";
    if (jsonData.length > 0) {
        $("#BatchProductNo").val(jsonData[0].nStudyProductBatchNo);
        $('#DDLProjectNo').val(jsonData[0].vStudyCode).attr("selected", "selected");
        $('#ddlProductType').val(jsonData[0].nProductTypeID).attr("selected", "selected");
        $("#ProjectID").val(jsonData[0].ProjectID);
        $("#ddlProductName").empty().append($("<option></option>").val(jsonData[0].nProductNo).html(jsonData[0].vProductName));
        $('#ddlBatchType').val(jsonData[0].cBatchLotType).attr("selected", "selected");
        $("#ddlProductName").prop('disabled', 'disabled');
        $("#DDLProjectNo").prop('disabled', 'disabled');
        $("#ddlProductType").prop('disabled', 'disabled');
        $("#BatchLotNo").val(jsonData[0].vBatchLotNo);
        $("#ManufacturedBy").val(jsonData[0].vManufacturedBy);
        $("#Description").val(jsonData[0].vDescription);
        $("#MarketedBy").val(jsonData[0].vMarketedBy);
        $("#LabelClaim").val(jsonData[0].vLabelClaim);
        $("#DistributedBy").val(jsonData[0].vDistributedBy);
        $("#PackDesc").val(jsonData[0].vDescriptionOnPack);
        $("#txtAdditionalRemarks").val(jsonData[0].vAdditionalRemark);
        $("#MarketAuthorization").val(jsonData[0].vMarketAuthorization);
        //$("#txtRetentionPeriod").val(jsonData[0].iRetentionPeriod);
        $("#txtRetentionQty").val(jsonData[0].iRetentionQty);
        $('#ddlAssayVerified').val(jsonData[0].cAssayVerified).attr("selected", "selected");
        $('#ddlRetQtyConfirmed').val(jsonData[0].cRetQtyConfirmed).attr("selected", "selected");
        $('#ddlSodVapVerification').val(jsonData[0].cSodVapVerification).attr("selected", "selected");
        $('#ddlProductCheck').val(jsonData[0].cProductCheck).attr("selected", "selected");
        $('#ddlReTestExpiry').val(jsonData[0].cReTestDate).attr("selected", "selected");

        $('#MenufacturedFor').val(jsonData[0].vMenufacturedFor).attr("selected", "selected");


        if ($("#ddlReTestExpiry").val().trim().toLowerCase() == "o") {
            $("#expirydate").val('');
            $("#expirydate").attr('disabled', 'disabled');
        }
        else {

            if (jsonData[0].cIsExpDate == "M") {
                $("#expirydate1").val('');
                $("#expirydate1").attr('disabled', 'disabled');

            } else {
                $("#expirydate").val('');
                $("#expirydate").attr('disabled', 'disabled');
            }
        }

        $("#chkexpDate").hide();
        $("#chkMfgDate").hide();
        $('#txtVerificationQty').val(jsonData[0].iVerificationQty).attr("selected", "selected");

        oldretentionqty = parseInt(jsonData[0].iRetentionQty);
        oldverificationqty = parseInt(jsonData[0].iVerificationQty);
        $("#ddlTransferIndi").val(jsonData[0].cProductKitIndication);

        if (jsonData[0].cProductKitIndication == "P") {
            $(".hidekit").attr("style", "display:inline");
        }
        else if (jsonData[0].cProductKitIndication == "K") {
            $(".hidekit").attr("style", "display:inline");
        }
        else {
            $(".hidekit").attr("style", "display:inline");
        }

        if (jsonData[0].dMfgDate == "1900-01-01T00:00:00") {
            if (jsonData[0].cIsMfgDate == "M") {
                $("#mfgdate1").show();
                $("#mfgdate").hide();
                $("#mfgdate1").val("");
                $('#mfgdate1').data("DateTimePicker").clear();
                $("#mfgdate1").attr("placeholder", "Not Applicable")
            }
            else {
                $("#mfgdate").show();
                $("#mfgdate1").hide();
                $("#mfgdate").val("");
                $('#mfgdate').data("DateTimePicker").clear();
                $("#mfgdate").attr("placeholder", "Not Applicable")
            }
        }
        else {
            var MonthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var tmpmfgdate = jsonData[0].dMfgDate
            var date = tmpmfgdate.split("-");
            var result = date[2].split("T")
            var time = result[1].split(":");
            var monthinid = parseInt(date[1]);
            if (jsonData[0].cIsMfgDate == "M") {
                var datetime = MonthList[monthinid - 1] + "-" + date[0];
            } else {
                var datetime = result[0] + "-" + MonthList[monthinid - 1] + "-" + date[0];
            }

            if (jsonData[0].cIsMfgDate == "M") {
                $("#mfgdate").css('display', 'none');
                $("#mfgdate1").css('display', 'block');
                $('#mfgdate').data("DateTimePicker").clear();
                $('#mfgdate1').data("DateTimePicker").clear();
                $('#mfgdate1').datetimepicker({ format: 'MMM-YYYY', maxDate: new Date() });
                $("#mfgdate1").val(datetime);
            }
            else {
                $("#mfgdate").css('display', 'block');
                $("#mfgdate1").css('display', 'none')
                $('#mfgdate').data("DateTimePicker").clear();
                $('#mfgdate1').data("DateTimePicker").clear();
                $('#mfgdate').datetimepicker({ format: 'DD-MMM-YYYY', maxDate: new Date() });
                $("#mfgdate").val(datetime);
            }
        }

        if (jsonData[0].cIsMfgDate == "M") {
            $('#chkMfgDate').prop('checked', true)

        } else {
            $('#chkMfgDate').prop('checked', false)
        }

        if (jsonData[0].cIsExpDate == "M") {
            var isDisabled = $("#expirydate1").prop('disabled');
            if (isDisabled) {
                $('#chkexpDate').prop('checked', true)
                $('#dateNA').show();

                //$('#chkexpDate').hide();
                //$('#dateNA').hide();
            }
            else {
                $('#chkexpDate').prop('checked', false)
            }

            $('#chkexpDate').prop('checked', true)
            $('#dateNA').show();

        } else {
            var isDisabled = $("#expirydate").prop('disabled');
            if (isDisabled) {
                $('#chkexpDate').prop('checked', false)
                //$('#chkexpDate').hide();
                $('#dateNA').show();
            }
            else {
                $('#chkexpDate').prop('checked', false)
            }

        }

        if (jsonData[0].dExpDate == "1900-01-01T00:00:00") {
            $("#expirydate").val("");
            $('#expirydate').data("DateTimePicker").clear();
            $("#expirydate").attr("placeholder", "Not Applicable")
        }
        else {
            var MonthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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

            if (jsonData[0].cIsExpDate == "M") {

                $("#expirydate").css('display', 'none');
                $("#expirydate1").css('display', 'block')
                $('#expirydate').data("DateTimePicker").clear();
                $('#expirydate1').data("DateTimePicker").clear();
                $('#expirydate1').datetimepicker({ format: 'MMM-YYYY', maxDate: new Date() });
                $("#expirydate1").val(datetime);
            }
            else {
                $("#expirydate").css('display', 'block');
                $("#expirydate1").css('display', 'none')
                $('#expirydate').data("DateTimePicker").clear();
                $('#expirydate1').data("DateTimePicker").clear();
                $('#expirydate').datetimepicker({ format: 'DD-MMM-YYYY', maxDate: new Date() });
                $("#expirydate").val(datetime);
            }

            reexpirydate = datetime;

        }


        if (jsonData[0].dRetentionDate == "1900-01-01T00:00:00") {
            $("#txtRetentionDate").val("");
            $('#txtRetentionDate').data("DateTimePicker").clear();
            $("#txtRetentionDate").attr("placeholder", "Not Applicable")
        }
        else {
            var MonthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var tmpretetiondate = jsonData[0].dRetentionDate
            var date = tmpretetiondate.split("-");
            var result = date[2].split("T")
            var time = result[1].split(":");
            var monthinid = parseInt(date[1]);
            var datetime = result[0] + "-" + MonthList[monthinid - 1] + "-" + date[0];
            $("#txtRetentionDate").val(datetime);

        }

        if (jsonData[0].iRetentionPeriod == "0") {
            $("#txtRetentionPeriod").attr("placeholder", "Not Applicable")
        }
        else {
            $("#txtRetentionPeriod").val(jsonData[0].iRetentionPeriod);
        }

        if (jsonData[0].cSaveContinueFlag == "C") {
            document.getElementById("btnaddPmsProductbatch").innerText = "Save";
            $("#btnaddPmsSaveContinue").attr("style", "display:none");
        }
        else if (jsonData[0].cSaveContinueFlag == "S") {
            $("#btnaddPmsSaveContinue").attr("style", "display:none");
        }

        if ($("#titleMode").text() == "Audit Trail") {
            $("#btnaddPmsSaveContinue").attr("style", "display:none");
        }

    }
}

function AuditTrail(e) {
    var str = e.id;
    var title = $(e).attr("titlename");
    var fieldname = str.substring(4);
    var batchlotno = $("#BatchProductNo").val();

    var Data = {
        vTableName: "StudyProductBatchMstHistory",
        vIdName: "nStudyProductBatchNo",
        vIdValue: batchlotno,
        vFieldName: fieldname,
        iUserId: iUserNo
    }
    $('#tblPmsProductBatchAuditTrial > tbody > tr:nth-child(n+1)').remove();
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
        var ActivityDataset = [];
        for (var i = 0; i < jsonData.length; i++) {
            var InDataset = [];
            var batchtype = "";
            var tempdate = "";
            var tempdesc = "";
            var Desciprtion = "";

            if ("cBatchLotType" == fieldname) {
                if (jsonData[i].vFieldName == "B") {
                    batchtype = "Batch"
                }
                else if (jsonData[i].vFieldName == "L") {
                    batchtype = "Lot"
                }
                // addded by ketan for full name
                if ((jsonData[i].vDesciprtion).match("B To L"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("B To L", "Batch To Lot");
                else if ((jsonData[i].vDesciprtion).match("L To B"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("L To B", "Lot To Batch");

                //InDataset.push(batchtype, jsonData[i].Operation, (jsonData[i].vDesciprtion == "" ? "" : title + ' ' + Desciprtion), jsonData[i].vRemark, jsonData[i].vModifyBy, jsonData[i].dModifyOn);

                InDataset.push(batchtype, jsonData[i].Operation, jsonData[i].vRemark, jsonData[i].vModifyBy, jsonData[i].dModifyOn);
            }
            else if ("cReTestDate" == fieldname) {
                if (jsonData[i].vFieldName == "Y") {
                    batchtype = "Re-Test Date"
                }
                else if (jsonData[i].vFieldName == "N") {
                    batchtype = "Expiry Date"
                }
                else if (jsonData[i].vFieldName == "P") {
                    batchtype = "Provisional Expiry Date"
                }
                else if (jsonData[i].vFieldName == "O") {
                    batchtype = "NA"
                }

                // addded by ketan for full name
                if ((jsonData[i].vDesciprtion).match("Y To N"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("Y To N", "Re-Test Date To Expiry Date");
                else if ((jsonData[i].vDesciprtion).match("N To Y"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("N To Y", "Expiry Date To Re-Test Date");

                //InDataset.push(batchtype, jsonData[i].Operation, (jsonData[i].vDesciprtion == "" ? "" : title + ' ' + Desciprtion), jsonData[i].vRemark, jsonData[i].vModifyBy, jsonData[i].dModifyOn);

                InDataset.push(batchtype, jsonData[i].Operation, jsonData[i].vRemark, jsonData[i].vModifyBy, jsonData[i].dModifyOn);
            }
            else if ("cProductCheck" == fieldname) {
                if (jsonData[i].vFieldName == "C") {
                    batchtype = "COA"
                }
                else if (jsonData[i].vFieldName == "S") {
                    batchtype = "SPC"
                }
                else if (jsonData[i].vFieldName == "P") {
                    batchtype = "Package"
                }

                if ((jsonData[i].vDesciprtion).match("C To S"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("C To S", "COA To SPC");
                else if ((jsonData[i].vDesciprtion).match("S To C"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("S To C", "SPC To COA");
                else if ((jsonData[i].vDesciprtion).match("C To P"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("C To P", "COA To Package");
                else if ((jsonData[i].vDesciprtion).match("P To C"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("P To C", "Package To COA");
                else if ((jsonData[i].vDesciprtion).match("S To P"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("S To P", "SPC To Package");
                else if ((jsonData[i].vDesciprtion).match("P To S"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("P To S", "Package To SPC");
                else if ((jsonData[i].vDesciprtion).match("0 To C"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("0 To C", " To COA");
                else if ((jsonData[i].vDesciprtion).match("0 To S"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("0 To S", " To SPC");
                else if ((jsonData[i].vDesciprtion).match("0 To P"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("0 To P", " To Package");
                else if ((jsonData[i].vDesciprtion).match("C To 0"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("C To 0", "COA To ");
                else if ((jsonData[i].vDesciprtion).match("S To 0"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("S To 0", "SPC To ");
                else if ((jsonData[i].vDesciprtion).match("P To 0"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("P To 0", "Package To ");

                //InDataset.push(batchtype, jsonData[i].Operation, (jsonData[i].vDesciprtion == "" ? "" : title + ' ' + Desciprtion), jsonData[i].vRemark, jsonData[i].vModifyBy, jsonData[i].dModifyOn);

                InDataset.push(batchtype, jsonData[i].Operation, jsonData[i].vRemark, jsonData[i].vModifyBy, jsonData[i].dModifyOn);

            }
            else if ("cSodVapVerification" == fieldname || "cAssayVerified" == fieldname || "cRetQtyConfirmed" == fieldname) {
                if (jsonData[i].vFieldName == "Y") {
                    batchtype = "Yes"
                }
                else if (jsonData[i].vFieldName == "N") {
                    batchtype = "No"
                }
                else if (jsonData[i].vFieldName == "O") {
                    batchtype = "NA"
                }
                if ((jsonData[i].vDesciprtion).match("Y To N"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("Y To N", "Yes To No");
                else if ((jsonData[i].vDesciprtion).match("N To Y"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("N To Y", "No To Yes");
                else if ((jsonData[i].vDesciprtion).match("Y To O"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("Y To O", "Yes To N/AP");
                else if ((jsonData[i].vDesciprtion).match("O To Y"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("O To Y", "N/AP To Yes");
                else if ((jsonData[i].vDesciprtion).match("N To O"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("N To O", "No To N/AP");
                else if ((jsonData[i].vDesciprtion).match("O To N"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("O To N", "N/AP To No");
                else if ((jsonData[i].vDesciprtion).match("0 To Y"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("0 To Y", " To Yes");
                else if ((jsonData[i].vDesciprtion).match("0 To N"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("0 To N", " To No");
                else if ((jsonData[i].vDesciprtion).match("0 To O"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("0 To O", " To N/AP");
                else if ((jsonData[i].vDesciprtion).match("Y To 0"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("Y To 0", "Yes To ");
                else if ((jsonData[i].vDesciprtion).match("N To 0"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("N To 0", "No To ");
                else if ((jsonData[i].vDesciprtion).match("O To 0"))
                    Desciprtion = (jsonData[i].vDesciprtion).replace("O To 0", "N/AP To ");

                //InDataset.push(batchtype, jsonData[i].Operation, (jsonData[i].vDesciprtion == "" ? "" : title + ' ' + Desciprtion), jsonData[i].vRemark, jsonData[i].vModifyBy, jsonData[i].dModifyOn);

                InDataset.push(batchtype, jsonData[i].Operation, jsonData[i].vRemark, jsonData[i].vModifyBy, jsonData[i].dModifyOn);
            }
            else if ("dMfgDate" == fieldname || "dExpDate" == fieldname || "dRetentionDate" == fieldname) {
                if (jsonData[i].vFieldName == "01-Jan-1900") {
                    tempdate = "";
                }
                else {
                    if ("dMfgDate" == fieldname) {
                        if (jsonData[i].cIsMfgDate == "M") {
                            tempdate = jsonData[i].vFieldName.split("-")[1] + "-" + jsonData[i].vFieldName.split("-")[2]
                        }
                        else {
                            tempdate = jsonData[i].vFieldName;
                        }
                    }
                    else if ("dExpDate" == fieldname) {
                        if (jsonData[i].cIsExpDate == "M") {
                            tempdate = jsonData[i].vFieldName.split("-")[1] + "-" + jsonData[i].vFieldName.split("-")[2]
                        }
                        else {
                            tempdate = jsonData[i].vFieldName;
                        }
                    }
                    else if ("dRetentionDate" == fieldname) {
                        tempdate = jsonData[i].vFieldName;
                    }

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
                //InDataset.push(jsonData[i].vFieldName, jsonData[i].Operation, (jsonData[i].vDesciprtion == "" ? "" : title + ' ' + jsonData[i].vDesciprtion), jsonData[i].vRemark, jsonData[i].vModifyBy, jsonData[i].dModifyOn);

                InDataset.push(jsonData[i].vFieldName, jsonData[i].Operation, jsonData[i].vRemark, jsonData[i].vModifyBy, jsonData[i].dModifyOn);
            }
            ActivityDataset.push(InDataset);
        }
        otable = $('#tblPmsProductBatchAuditTrial').dataTable({
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
                //{ "sTitle": " Description " },
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

function GetProductType() {

    if (setworkspaceid != "") {
        var GetProductType = {
            Url: BaseUrl + "PmsGeneral/GetProductType/" + setworkspaceid,
            SuccessMethod: "SuccessMethod"
        }

        // For Server use

        $.ajax({
            type: "GET",
            url: BaseUrl + "PmsGeneral/GetProductType",
            data: { id: setworkspaceid },
            //contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: SuccessMethod,
            error: function () {
                SuccessorErrorMessageAlertBox("Product Type not found.", ModuleName);
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

$("#tblLotMaster").on('click', '#trRemove', function () {
    $(this).closest('tr').remove();
    if ($("#tblLotMaster tr").length == 1) {
        $("#tblLotMaster").hide();
        $("#btnaddPmsProductbatch").hide();
        $("#btnaddPmsSaveContinue").attr("style", "display:none");
    }
    else {
        $("#tblLotMaster").show();
        $("#btnaddPmsProductbatch").show();

    }
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

    // For Server use

    $.ajax({
        type: "GET",
        url: BaseUrl + "PmsGeneral/GetSetProjectDetails",
        data: { id: PassData.iUserId },
       // contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Project not found.", ModuleName);
        }
    });
    

    function SuccessMethod(jsonData) {
        if (jsonData.length > 0) {
            $('#ddlProjectNodashboard').val(jsonData[0].vProjectNo);
            setworkspaceid = jsonData[0].vWorkSpaceId;
        }
        else {
            $('#ddlProjectNodashboard').val('');
        }
    }
}

function BindData() {
    if (productIds[$('#ddlProjectNodashboard').val()] != undefined) {
        setworkspaceid = productIds[$('#ddlProjectNodashboard').val()];
    }

    var url = WebUrl + "PmsProductBatch/GetWorkspaceId";
    $.ajax({
        url: url,
        type: 'GET',
        data: { id: setworkspaceid, UserName: $("#hdnusername").val() },
        async: false,
        success: function (response) {
        },
        error: function () {
            SuccessorErrorMessageAlertBox("No Project found.", ModuleName);

        }
    });

    GetProductType();
    //GetProduct();
    GetAllPmsProductBatchData();
}

function GetQtyCheck() {
    var QualityCheckData = {
        vWorkSpaceId: setworkspaceid,
        nProductNo: $("#ddlProductName :selected").val(),
        nStudyProductBatchNo: $("#BatchProductNo").val(),
        iVerificationQty: $("#txtVerificationQty").val(),
        iRetentionQty: $("#txtRetentionQty").val(),
        //vRefModule: "QM"
    }

    $.ajax({
        url: BaseUrl + "PmsGeneral/QtyDetailForVerification",
        type: 'POST',
        data: QualityCheckData,
        success: Success,
        error: function () {
            SuccessorErrorMessageAlertBox("Data not found.", ModuleName);

        }
    });

    function Success(jsonData) {
        var totalqty = parseInt(retentionqty) + parseInt(verificationqty);
        //totalavailableqty = response;
        var totalstock;
        if (jsonData[0].TotalStock == undefined) {
            totalstock = 0;
        }
        else {
            totalstock = jsonData[0].TotalStock;
        }
        if (jsonData[0].Column1 == "0") {
            $("#txtRetentionQty").val("");
            $("#txtVerificationQty").val("");
            ValidationAlertBox("Entered Quantity is more then Received Quantity ! Current Stock is " + totalstock + " !", "txtVerificationQty", ModuleName);

            return false;
        }
    }
}

$("#txtRetentionQty").on("blur", function () {
    var tempretentionqty;
    var btntext = (document.getElementById("spnPmsProductbatch").innerText).toLowerCase().trim();
    if (btntext == "save") {
        if ($("#txtRetentionQty").val() != "") {
            tempretentionqty = parseInt($("#txtRetentionQty").val());
            if (tempretentionqty > "0") {
                $("#txtRetentionQty").val("");
                ValidationAlertBox("Retention Quantity is not allowed before Product Receipt.", "txtRetentionQty", ModuleName);

                return false
            }
        }
    }
    else if (btntext == "update") {
        if ($("#txtRetentionQty").val() == "") {
            retentionqty = "0"
        }
        else {
            retentionqty = parseInt($("#txtRetentionQty").val())
        }

        if ($("#txtVerificationQty").val() == "") {
            verificationqty = "0"
        }
        else {
            verificationqty = parseInt($("#txtVerificationQty").val());
        }

        var totalqty = parseInt(retentionqty) + parseInt(verificationqty);
        var oldqty = oldretentionqty + oldverificationqty

        if (oldqty >= totalqty) {

        }
        else {
            if (totalqty != "NaN") {

                if (GetQtyCheck() == false) {
                    return false;
                }
            }
        }
    }
});

$("#txtVerificationQty").on("blur", function () {

    var tempverification;
    var btntext = (document.getElementById("spnPmsProductbatch").innerText).toLowerCase().trim();
    if (btntext == "save") {
        if ($("#txtVerificationQty").val() != "") {
            tempverification = parseInt($("#txtVerificationQty").val());
            if (tempverification > "0") {
                $("#txtVerificationQty").val("");
                ValidationAlertBox("Verification Quantity is not allowed before Product Receipt.", "txtVerificationQty", ModuleName);

                return false
            }
        }
    }
    else if (btntext == "update") {
        if ($("#txtRetentionQty").val() == "") {
            retentionqty = "0"
        }
        else {
            retentionqty = parseInt($("#txtRetentionQty").val())
        }

        if ($("#txtVerificationQty").val() == "") {
            verificationqty = "0"
        }
        else {
            verificationqty = parseInt($("#txtVerificationQty").val());
        }

        var totalqty = parseInt(retentionqty) + parseInt(verificationqty);
        var oldqty = oldretentionqty + oldverificationqty

        if (oldqty >= totalqty) {

        }
        else {
            if (totalqty != "NaN") {
                if (GetQtyCheck() == false) {
                    return false;
                }
            }
        }
    }
});

function GetProductBatchDataForTransfer() {
    var ProductTransferData =
    {
        vWorkSpaceId: setworkspaceid,
        nProductTypeID: $("#ddlProductType :selected").val()
    }

    $.ajax({
        url: BaseUrl + "PmsProductBatch/StudyProductBatchDataForTransfer",
        type: "POST",
        data: ProductTransferData,
        success: SuccessMethodStudyProductDataForTransfer,
        error: function () {
            SuccessorErrorMessageAlertBox("No data found.", ModuleName);

        }
    });

    function SuccessMethodStudyProductDataForTransfer(jsonData) {
        if (jsonData.length != 0) {
            $('#ddlBatchType').val(jsonData[0].cBatchLotType).attr("selected", "selected");
            $("#DDLProjectNo").prop('disabled', 'disabled');
            $("#BatchLotNo").val(jsonData[0].vBatchLotNo);
            $("#ManufacturedBy").val(jsonData[0].vManufacturedBy);
            $("#Description").val(jsonData[0].vDescription);
            $("#MarketedBy").val(jsonData[0].vMarketedBy);
            $("#LabelClaim").val(jsonData[0].vLabelClaim);
            $("#DistributedBy").val(jsonData[0].vDistributedBy);
            $("#PackDesc").val(jsonData[0].vDescriptionOnPack);
            $("#txtAdditionalRemarks").val(jsonData[0].vAdditionalRemark);
            $("#MarketAuthorization").val(jsonData[0].vMarketAuthorization);
            $("#txtRetentionQty").val(jsonData[0].iRetentionQty);
            $('#ddlAssayVerified').val(jsonData[0].cAssayVerified).attr("selected", "selected");
            $('#ddlRetQtyConfirmed').val(jsonData[0].cRetQtyConfirmed).attr("selected", "selected");
            $('#ddlSodVapVerification').val(jsonData[0].cSodVapVerification).attr("selected", "selected");
            $('#ddlProductCheck').val(jsonData[0].cProductCheck).attr("selected", "selected");
            $('#ddlReTestExpiry').val(jsonData[0].cReTestDate).attr("selected", "selected");
            $('#txtVerificationQty').val(jsonData[0].iVerificationQty).attr("selected", "selected");
            $('#ddlReTestExpiry').val(jsonData[0].cReTestDate).attr("selected", "selected");
            oldretentionqty = parseInt(jsonData[0].iRetentionQty);
            oldverificationqty = parseInt(jsonData[0].iVerificationQty);

            if (jsonData[0].dMfgDate == "1900-01-01T00:00:00") {
                $("#mfgdate").val("");
                $('#mfgdate').data("DateTimePicker").clear();
            }
            else {
                var MonthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                var tmpmfgdate = jsonData[0].dMfgDate
                var date = tmpmfgdate.split("-");
                var result = date[2].split("T")
                var time = result[1].split(":");
                var monthinid = parseInt(date[1]);
                var datetime = result[0] + "-" + MonthList[monthinid - 1] + "-" + date[0];
                $("#mfgdate").val(datetime);
            }

            if (jsonData[0].dExpDate == "1900-01-01T00:00:00") {
                $("#expirydate").val("");
                $('#expirydate').data("DateTimePicker").clear();
            }
            else {
                var MonthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                var tmpexpirtydate = jsonData[0].dExpDate
                var date = tmpexpirtydate.split("-");
                var result = date[2].split("T")
                var time = result[1].split(":");
                var monthinid = parseInt(date[1]);
                var datetime = result[0] + "-" + MonthList[monthinid - 1] + "-" + date[0];
                $("#expirydate").val(datetime);
            }


            if (jsonData[0].dRetentionDate == "1900-01-01T00:00:00") {
                $("#txtRetentionDate").val("");
                $('#txtRetentionDate').data("DateTimePicker").clear();
            }
            else {
                var MonthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                var tmpretetiondate = jsonData[0].dRetentionDate
                var date = tmpretetiondate.split("-");
                var result = date[2].split("T")
                var time = result[1].split(":");
                var monthinid = parseInt(date[1]);
                var datetime = result[0] + "-" + MonthList[monthinid - 1] + "-" + date[0];
                $("#txtRetentionDate").val(datetime);


            }
        }
        else {
            $("#BatchProductNo").val("");
            $("#BatchLotNo").val("");
            $("#ManufacturedBy").val("");
            $("#Description").val("");
            $("#MarketedBy").val("");
            $("#LabelClaim").val("");

            $("#DistributedBy").val("");
            $("#PackDesc").val("");
            $("#MarketAuthorization").val("");
            $("#Remarks").val("");
            $("#txtAdditionalRemarks").val("");
            $("#ddlBatchType").val(0);
            $("#expirydate").val("");
            $('#expirydate').data("DateTimePicker").clear();
            $("#mfgdate").val("");
            $('#mfgdate').data("DateTimePicker").clear();
            $("#txtRetentionDate").val("");
            $('#txtRetentionDate').data("DateTimePicker").clear();
            $("#txtRetentionPeriod").val("");
            $("#txtRetentionQty").val("");
            $("#mfgdate").attr("placeholder", "Manufacturing Date")
            $("#expirydate").attr("placeholder", "Re-Test/Expiry/Provisional Expiry Date")
            $("#txtRetentionDate").attr("placeholder", "Retention Start Date");
            $("#txtRetentionPeriod").attr("placeholder", "Retention Period");
            $('#ddlSodVapVerification').val("0").attr("selected", "selected");
            $('#ddlAssayVerified').val("0").attr("selected", "selected");
            $('#ddlRetQtyConfirmed').val("0").attr("selected", "selected");
            $('#ddlProductCheck').val("0").attr("selected", "selected");
            $('#ddlReTestExpiry').val("0").attr("selected", "selected");
            $("#txtVerificationQty").val("");
        }
    }
}

$("#ddlTransferIndi").on("change", function () {
    TransferIndi = $("#ddlTransferIndi").val();

    $("#ddlProductType").val("0");
    $("#ddlProductName").val("0");
    $("#ddlBatchType").val("0");
    $("#BatchLotNo").val("");

    if (TransferIndi == "P") {
        $(".hidekit").attr("style", "display:inline");
        $("#txtRetentionQty").attr('disabled', false);
        $("#txtVerificationQty").attr('disabled', false);
        $("#txtRetentionQty").val("");
        $("#txtVerificationQty").val("");
    }
    else if (TransferIndi == "K") {
        $(".hidekit").attr("style", "display:hidekit");
        $("#txtRetentionQty").attr('disabled', true);
        $("#txtVerificationQty").attr('disabled', true);
        $("#txtRetentionQty").val("0");
        $("#txtVerificationQty").val("0");
    }
    else {
        $(".hidekit").attr("style", "display:hidekit");
        $("#txtRetentionQty").attr('disabled', false);
        $("#txtVerificationQty").attr('disabled', false);
        $("#txtRetentionQty").val("");
        $("#txtVerificationQty").val("");
    }
});

$("#ddlReTestExpiry").on("change", function () {
    if ($("#ddlReTestExpiry").val().trim().toLowerCase() == "o") {
        $("#expirydate").val('');
        $("#expirydate").show();
        $("#expirydate1").hide();
        $("#expirydate").attr('disabled', 'disabled');
        $("#chkexpDate").hide();
        $('#chkexpDate').prop('checked', false);
        $('#dateNA').hide();
    }
    else {
        if ($("#chkexpDate").prop("checked") == true) {
            $("#chkexpDate").show();
            $('#dateNA').show();
            $("#expirydate").hide();
            $("#expirydate1").show();
            $("#expirydate1").val('');
            $("#expirydate1").attr('disabled', false);

        } else {
            $("#chkexpDate").show();
            $('#dateNA').show();
            $("#expirydate").show();
            $("#expirydate1").hide();
            $("#expirydate").val('');
            $("#expirydate").attr('disabled', false);
        }
    }
});

$("#mfgdate").keypress(function (event) { event.preventDefault(); });

$("#expirydate").keypress(function (event) { event.preventDefault(); });

$("#txtRetentionDate").keypress(function (event) { event.preventDefault(); });

$('#chkMfgDate').change(function () {
    if ($(this).is(":checked")) {
        $("#mfgdate").css('display', 'none');
        $("#mfgdate1").css('display', 'block')
        $('#mfgdate').data("DateTimePicker").clear();
        $('#mfgdate1').data("DateTimePicker").clear();
        $('#mfgdate1').datetimepicker({ format: 'MMM-YYYY', maxDate: new Date() });
    }
    else {
        $("#mfgdate").css('display', 'block');
        $("#mfgdate1").css('display', 'none')
        $('#mfgdate').data("DateTimePicker").clear();
        $('#mfgdate1').data("DateTimePicker").clear();
        $('#mfgdate').datetimepicker({ format: 'DD-MMM-YYYY', maxDate: new Date() });
    }

});

$('#chkexpDate').change(function () {
    if ($(this).is(":checked")) {
        $("#expirydate").css('display', 'none');
        $("#expirydate1").css('display', 'block')
        $("#expirydate1").attr('disabled', false);
        $('#expirydate').data("DateTimePicker").clear();
        $('#expirydate1').data("DateTimePicker").clear();
        $('#expirydate1').datetimepicker({ format: 'MMM-YYYY', maxDate: new Date() });
    }
    else {
        $("#expirydate").css('display', 'block');
        $("#expirydate1").css('display', 'none');
        $("#expirydate").attr('disabled', false);
        $('#expirydate').data("DateTimePicker").clear();
        $('#expirydate1').data("DateTimePicker").clear();
        $('#expirydate').datetimepicker({ format: 'DD-MMM-YYYY', maxDate: new Date() });
    }

});