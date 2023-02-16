/// <reference path:"General.js" />
var productIds = new Object();
var nProductNo;
var nStudyProductBatchNo = "";
var nBatchNo;
var TotalQuantity;
var vWorkSpaceId;
var setworkspaceid = "";
var ModuleName = "IMP Consumption";

$(function () {
    CheckSetProject();

    iUserNo = $("#hdnuserid").val();
    $("#spnwelcome").html($("#hdnusername").val());
    $("#spnLoginTime").html($("#hdnlogintime").val());
    var GetAllPmsProjectNo = {
        Url: BaseUrl + "PmsProductBatch/GetProjectNo",
        SuccessMethod: "SuccessMethod",
    }

    $('#btnExitPage').on("click", function () {
        ConfirmAlertBox(ModuleName, $("#RedirectToHome").val());
    });

    GetProductType();

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
                change: function (event, ui) { }
            });
        }
    });

    $('#DDLProjectNo').on("blur", function () {
        if (productIds[$('#DDLProjectNo').val()] != undefined) {
            setworkspaceid = productIds[$('#DDLProjectNo').val()];
        }
        //GetDispenseAuthorizationForBlindedStudy();
        if (isBlank(document.getElementById('DDLProjectNo').value)) {
            SetDefaultValue();
            return false;
        }
        GetProductType();
    });

    $('#DDLProductType').on("change", function () {
        GetProductName();
    });

    $('#DDLProduct').on("change", function () {
        GetBatchLotNo();
    });

    $('#btnExit').on("click", function () {
        document.getElementById('dispensedata').style.visibility = "hidden";
        document.getElementById('tblPmsProductDispenseData').style.visibility = "hidden";
    });

    $('#btnClear').on("click", function () {
        SetDefaultValue();
    });

    var GetAllPmsProjectNoData = function (Url, SuccessMethod, ProjectNoDataTemp) {
        $.ajax({
            url: Url,
            type: 'GET',
            data: { id: ProjectNoDataTemp.iUserId, projectno: ProjectNoDataTemp.vProjectNo, typecode: ProjectNoDataTemp.vProjectTypeCode },
            async: false,
            success: function (jsonData) {
                var jsonObj = jsonData;
                var sourceArr = [];
                for (var i = 0; i < jsonObj.length; i++) {
                    sourceArr.push("[ " + jsonObj[i].vProjectNo + " ]" + " " + jsonObj[i].vRequestId);
                    productIds["[ " + jsonObj[i].vProjectNo + " ]" + " " + jsonObj[i].vRequestId] = jsonObj[i].vWorkspaceId;
                }
                $("#DDLProjectNo").autocomplete({
                    source: sourceArr,
                    change: function (event, ui) { }
                });
            },
            error: function () {
                SuccessorErrorMessageAlertBox("Project Not Found !", ModuleName);
            }
        });
    }
});

$("#btnAdd").on("click", function () {
    var strdata = "";
    strdata += "<tr>";
    strdata += "<td>" + $("#DDLProductType :selected").text() + "</td>";
    strdata += "<td>" + $("#DDLProduct :selected").text() + "</td>";
    strdata += "<td>" + $("#ddlBatchLotNo :selected").text() + "</td>";
    strdata += "<td>" + $("#txtBarcode").val() + "</td>";
    strdata += "<td id='trRemove'><span class='glyphicon glyphicon-remove' ></span></td>";
    strdata += "<td class='hidetd'>" + $("#DDLProductType").val() + "</td>";
    strdata += "<td class='hidetd'>" + $("#DDLProduct").val() + "</td>";
    strdata += "<td class='hidetd'>" + $("#ddlBatchLotNo").val() + "</td>";
    strdata += "</tr>";
    $("#tbodyIMPConsumption").append(strdata);
    $("#tblPMSIMPConsumption").show();
    $("#txtBarcode").val("");
    $(".hidetd").hide();
    $("#btnSaveIMPConsumption").show();
});

$("#tblPMSIMPConsumption").on('click', '#trRemove', function () {
    $(this).closest('tr').remove();
    if ($("#tblPMSIMPConsumption tr").length == 1) {
        $("#tblPMSIMPConsumption").hide();
        $("#btnSaveIMPConsumption").hide();
    }
    else {
        $("#tblPMSIMPConsumption").show();
        $("#btnSaveIMPConsumption").show();
    }
});

function SetDefaultValue() {
    $('#DDLProductType').val(0).attr("selected", "selected");
    $('#DDLProduct').val(0).attr("selected", "selected");
    $('#ddlBatchLotNo').val(0).attr("selected", "selected");
}

function GetProductName() {
    if (productIds[$('#DDLProjectNo').val()] != undefined) {
        setworkspaceid = productIds[$('#DDLProjectNo').val()];
    }

    var GetProductNameData = {
        vWorkSpaceId: setworkspaceid,
        nProductTypeID: $("#DDLProductType").val(),
        cTransferIndi: 'P',
    }

    var GetPmsStudyReceiptProductName = {
        Url: BaseUrl + "PMSGeneral/ProductName",
        SuccessMethod: "SuccessMethod",
        Data: GetProductNameData,
    }

    $.ajax({
        url: GetPmsStudyReceiptProductName.Url,
        type: 'POST',
        data: GetPmsStudyReceiptProductName.Data,
        success: function (jsonData) {
            var strdata = "";
            if (jsonData.length > 0) {
                $("#DDLProduct").empty().append('<option selected="selected" value="0">Please Select Product</option>');
                for (var i = 0; i < jsonData.length; i++)
                    $("#DDLProduct").append($("<option></option>").val(jsonData[i].nProductNo).html(jsonData[i].vProductName));
            }
            else {
                $("#DDLProduct").empty().append('<option selected="selected" value="0">Please Select Product</option>');
            }
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Product Not Found !", ModuleName);
        }
    });
}

function GetBatchLotNo() {
    if (productIds[$('#DDLProjectNo').val()] != undefined) {
        setworkspaceid = productIds[$('#DDLProjectNo').val()];
    }

    var nProductNo = $("#DDLProduct").val();

    var Data_s = {
        vWorkSpaceId: setworkspaceid,
        nProductTypeID: $("#DDLProductType").val(),
        nProductNo: $("#DDLProduct").val(),
        nBatchNo: $("#ddlBatchLotNo").val()
    }
    var GetProductDetail = {
        Url: BaseUrl + "PmsProductDispense/PostProductDetailByProjectNo/",
        SuccessMethod: "SuccessMethod",
    }

    $.ajax({
        url: GetProductDetail.Url,
        type: 'Post',
        data: Data_s,
        async: false,
        success: function (jsonData) {
            if (jsonData.length > 0) {
                $("#ddlBatchLotNo").empty().append('<option selected="selected" value="0">Please Select Batch/Lot/Lot No</option>');
                for (var i = 0; i < jsonData.length; i++) {
                    $("#ddlBatchLotNo").append($("<option></option>").val(jsonData[i].nStudyProductBatchNo).html(jsonData[i].vBatchLotNo));
                }
            }
            else {
                $("#ddlBatchLotNo").empty().append('<option selected="selected" value="0">Please Select Batch/Lot/Lot No</option>');
            }
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Batch/Lot Not Found !", ModuleName);
        }
    });
}

function GetProductType() {
    if (setworkspaceid != "") {
        var GetProductType = {
            Url: BaseUrl + "PmsGeneral/GetProductType/" + setworkspaceid,
            SuccessMethod: "SuccessMethod"
        }
        $.ajax({
            url: GetProductType.Url,
            type: 'GET',
            success: function (jsonData) {
                $("#DDLProductType").empty().append('<option selected="selected" value="0">Please Select Product Type</option>');
                for (var i = 0; i < jsonData.length; i++) {
                    $("#DDLProductType").append($("<option></option>").val(jsonData[i].nProductTypeID).html(jsonData[i].vProductType));
                }
            },
            error: function () {
                SuccessorErrorMessageAlertBox("Product Type Not Found !", ModuleName);
            }
        });
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
    $.ajax({
        url: Url,
        type: 'GET',
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
            SuccessorErrorMessageAlertBox("Product Not Found !", ModuleName);
        }
    });
}