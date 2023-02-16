var ModuleName = "Minimum Inventory";
var workspaceIds = new Object();
var MinInventory = {};
var MinInventoryDtl = [];
var viewmode = "";
var nStudyProductMinInventoryDtlNo = "";
var ChildProjectObject;

$(document).ready(function () {
    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('.modal').modal('hide');

    CheckSetProjectGeneral("txtProjectNoDashboard");
    GetAllParentPRoject();
    GetStudyProductMinInventoryDtl();

    if (setWorkspaceId != "") {
        KitType();
        ChildProject();
        $("#txtProjectNo").val($("#txtProjectNoDashboard").val());
    }
    GetViewMode();
});

function AddMinimumInventory() {
    if (ChildProjectObject.length == 0) {
        ValidationAlertBox("Site Not Found for Project - " + $("#txtProjectNoDashboard").val() + " !", "txtProjectNoDashboard", ModuleName);
        return false;
    }

    document.getElementById("divsite").style.display = "none";
    $('.form-control').each(function () {
        $(this).attr('disabled', false);
    });
    $('.AuditControl').each(function () { this.style.display = "none"; });

    jQuery("#titleMode").text('Mode:-Add');
    $("#txtProjectNo").val($("#txtProjectNoDashboard").val());
    if (isBlank(document.getElementById('txtProjectNoDashboard').value)) {
        ValidationAlertBox("Please Enter Project No !", "txtProjectNoDashboard", ModuleName);
        return false;
    }
    document.getElementById("DivEditRemark").style.display = "none";
    jQuery("#spnMinimumInventory").text('Save');
    $("#btnAddTempMinimumInventory").show();
    $("#tblMinimumInventoryTemp tbody tr").remove();
    $("#tblMinimumInventoryTemp thead").hide();
    clearData();
    $("#txtProjectNo").attr('disabled', true);
    $("#btnClearPmsMinimumInventory").show();
    $('#MinimumInventoryModel').modal('show');
}

function AddTempData() {
    var strdata = "";
    var result = false;
    var DataTableRows = $("#tblMinimumInventory").dataTable().fnGetNodes();
    if (validateform() != false)
    {
        for (var i = 0; i < ChildProjectObject.length; i++)
        {
            for (var j = 0; j < DataTableRows.length; j++) {
                var DataTableKit = $(DataTableRows[j]).find('td:eq(2)').html();
                var DataTableChildWorkSpaceID = otableMinimumInventoryDtl.fnGetData(j - 0)[6];

                if (ChildProjectObject[i].vWorkspaceId == DataTableChildWorkSpaceID && DataTableKit == $("#ddlKitType :selected").text()) {
                    //ValidationAlertBox("Minimum Inventory Defined For All Child Site for Kit Type " + $("#ddlKitType :selected").text() + " !", "ddlKitType", ModuleName);
                    result = true;
                }
            }

            if (result == false)
            {
                strdata += "<tr>";
                strdata += "<td align='center'>" + $("#txtProjectNo").val() + "</td>";
                strdata += "<td align='center'>" + "[ " + ChildProjectObject[i].vProjectNo + " ]" + " " + ChildProjectObject[i].vRequestId + "</td>";
                strdata += "<td align='center'>" + $("#ddlKitType :selected").text() + "</td>";
                strdata += "<td align='center'><input type='number' class='form-control qtycontrol' id='txtTempQty" + ChildProjectObject[i].vWorkspaceId + "' style='height: 26px' min='1' value='" + $("#txtMinQty").val() + "' /></td>";

                strdata += "<td id='trRemove' align='center'><span class='glyphicon glyphicon-remove' title='Remove'></span></td>";
                strdata += "<td class='hidetd'>" + ChildProjectObject[i].vWorkspaceId + "</td>";
                strdata += "<td class='hidetd'>" + $("#ddlKitType").val() + "</td>";
                strdata += "</tr>";

            }
            result = false;
        }
    }

    if (strdata != "") {
        $("#tbodyMinimumInventoryTemp").append(strdata);
        $("#tblMinimumInventoryTemp").show();
        $("#tblMinimumInventoryTemp thead").show();
        $("#btnSavePmsMinimumInventory").attr("style", "display:inline");
        $(".hidetd").hide();
        clearData();
    }
    else {
        if ($("#ddlKitType").val() == 0) {
            return false;
        }
        else if ($("#txtMinQty").val() == "" || $("#txtMinQty").val() == "0") {
            return false;
        }
        ValidationAlertBox("Minimum Inventory Defined For All Child Site for Kit Type " + $("#ddlKitType :selected").text() + " !", "ddlKitType", ModuleName);
    }   
}

function validateform() {
    if (Dropdown_Validation(document.getElementById("ddlKitType"))) {
        ValidationAlertBox("Please Select Kit Type !", "ddlKitType", ModuleName);
        return false;
    }

    if (isBlank(document.getElementById('txtMinQty').value)) {
        ValidationAlertBox("Please Enter Minimum Quantity !", "txtMinQty", ModuleName);
        return false;
    }

    if ($("#txtMinQty").val() <= 0) {
        ValidationAlertBox("Minimum Quantity Should Be Greater Than Zero !", "txtMinQty", ModuleName);
        return false;
    }

    var btntext = (document.getElementById("spnMinimumInventory").innerText).toLowerCase().trim()
    if (btntext == "update") {
        if (isBlank(document.getElementById('txtRemark').value)) {
            ValidationAlertBox("Please Enter Remark !", "txtRemark", ModuleName);
            return false;
        }
    }

    if (btntext == "save") {
        GetStudyProductMinInventoryDtl();
        var MyRows = $('table#tblMinimumInventoryTemp').find('tbody').find('tr');
        for (var i = 0; i < MyRows.length; i++) {
            var Site = $(MyRows[i]).find('td:eq(1)').html()
            var KitType = $(MyRows[i]).find('td:eq(2)').html()

            if (Site == $("#ddlSite :selected").text() && KitType == $("#ddlKitType :selected").text()) {
                ValidationAlertBox("This Record Already Exist in Table !", "ddlKitType", ModuleName); 
                return false;
            }
        }
    }
    return true;
}

function clearData() {
    var btntext = (document.getElementById("spnMinimumInventory").innerText).toLowerCase().trim()
    if (btntext == "save") {
        $("#ddlSite").val("0");
        $("#ddlKitType").val("0");
    }
    $("#txtRemark").val("");
    $("#txtMinQty").val("");
}

$("#tblMinimumInventoryTemp").on('click', '#trRemove', function () {
    $(this).closest('tr').remove();
    if ($("#tblMinimumInventoryTemp tr").length == 1) {
        $("#tblMinimumInventoryTemp").hide();
        $("#btnSavePmsMinimumInventory").attr("style", "display:none");
    }
    else {
        $("#tblMinimumInventoryTemp").show();
        $("#btnSavePmsMinimumInventory").attr("style", "display:inline");
    }
});

$("#btnExitPmsMinimumInventory").on("click", function () {
    ConfirmAlertBox(ModuleName);
});

$("#btnClearPmsMinimumInventory").on("click", function () {
    clearData();
    $("#tblMinimumInventoryTemp tbody tr").remove();
    $("#tblMinimumInventoryTemp thead").hide();
});

function ChildProject() {
    var wStr = "vWorkSpaceID <> ParentWorkspaceId and ParentWorkspaceId = '" + setWorkspaceId + "' and cIsTestSite = 'N'"

    var WhereData = {
        WhereCondition_1: wStr,
        columnName_1: "Distinct vWorkspaceId,vProjectNo,vRequestId"
    }

    if (setWorkspaceId != "") {
        $.ajax({
            url: BaseUrl + "PmsRecordFetch/View_MyProjects_FromBiznet",
            type: 'POST',
            data: WhereData,
            async: false,
            success: function (data) {
                ChildProjectObject = data.Table;
                $("#ddlSite").empty().append('<option selected="selected" value="0">Please Select Site</option>');
                for (var i = 0; i < ChildProjectObject.length; i++) {
                    $("#ddlSite").append($("<option></option>").val(ChildProjectObject[i].vWorkspaceId).html("[ " + ChildProjectObject[i].vProjectNo + " ]" + " " + ChildProjectObject[i].vRequestId));
                }
            }
        });
    }
}

function KitType() {
    var wStr = "vWorkSpaceID = '" + setWorkspaceId + "'"

    var WhereData = {
        WhereCondition_1: wStr,
        columnName_1: "Distinct nKitTypeNo,vKitTypeDesc"
    }

    if (setWorkspaceId != "") {
        $.ajax({
            url: BaseUrl + "PmsRecordFetch/View_StudyProductKitTypeMst",
            type: 'POST',
            data: WhereData,
            async: false,
            success: function (data) {
                var jsonobj = data.Table;
                $("#ddlKitType").empty().append('<option selected="selected" value="0">Please Select Kit Type</option>');
                for (var i = 0; i < jsonobj.length; i++) {
                    $("#ddlKitType").append($("<option></option>").val(jsonobj[i].nKitTypeNo).html(jsonobj[i].vKitTypeDesc));
                }
            }
        });
    }
}

var GetAllParentPRoject = function () {
    var ProjectNoDataTemp =
    {
        //vProjectNo: "",
        //iUserId: $("#hdnuserid").val(),
        //vProjectTypeCode: $("#hdnscopevalues").val(),
        cParentChildIndi: "P"
    }
    $.ajax({
        url: BaseUrl + "PmsRecordFetch/AllParentProject",
        type: 'POST',
        data: ProjectNoDataTemp,
        async: false,
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("Project Not Found !", "txtProjectNoDashboard", ModuleName);
        }
    });
    function SuccessMethod(jsonData) {

        var strdata = "";
        jsonData = jsonData.Table
        if (jsonData.length > 0) {
            var jsonObj = jsonData;
            var sourceArr = [];

            for (var i = 0; i < jsonObj.length; i++) {
                sourceArr.push("[ " + jsonObj[i].vProjectNo + " ]" + " " + jsonObj[i].vRequestId);
                workspaceIds["[ " + jsonObj[i].vProjectNo + " ]" + " " + jsonObj[i].vRequestId] = jsonObj[i].vWorkspaceId;
            }
            $("#txtProjectNoDashboard").autocomplete({
                source: sourceArr,
                change: function (event, ui) {
                },
                select: function (event, ui) {
                    $('#txtProjectNoDashboard').blur();
                }
            });
        }

    }
}

$('#txtProjectNoDashboard').on("blur", function () {
    if (workspaceIds[$('#txtProjectNoDashboard').val()] != undefined) {
        setWorkspaceId = workspaceIds[$('#txtProjectNoDashboard').val()];
        KitType();
        ChildProject();
        GetStudyProductMinInventoryDtl();
    }
    else {
        setWorkspaceId = "";
    }
});

$('#btnSavePmsMinimumInventory').on("click", function () {
    MinInventory = {};
    MinInventoryDtl = [];
    var btntext = (document.getElementById("spnMinimumInventory").innerText).toLowerCase().trim()
    if (btntext == 'save')
    {
        var MyRows = $('table#tblMinimumInventoryTemp').find('tbody').find('tr');
        for (var i = 0; i < MyRows.length; i++) {
            MinInventory = {
                vWorkSpaceID: setWorkspaceId,
                vCWorkSpaceID: $(MyRows[i]).find('td:eq(5)').html(),
                nKitTypeNo: $(MyRows[i]).find('td:eq(6)').html(),
                iQty: $("input[id*=txtTempQty" + $(MyRows[i]).find('td:eq(5)').html() + "]").val(),
                iModifyBy: $("#hdnuserid").val(),
            }
            MinInventoryDtl.push(MinInventory);
        }

        var DataTableRows = $("#tblMinimumInventory").dataTable().fnGetNodes();
        for (var i = 0; i < MyRows.length; i++) {
            var Kit = $(MyRows[i]).find('td:eq(2)').html()
            var ChildWorkSpaceID = $(MyRows[i]).find('td:eq(5)').html()
            for (var j = 0; j < DataTableRows.length; j++) {
                var DataTableKit = $(DataTableRows[j]).find('td:eq(2)').html()
                var DataTableChildWorkSpaceID = otableMinimumInventoryDtl.fnGetData(j - 0)[6]

                if (Kit == DataTableKit && ChildWorkSpaceID == DataTableChildWorkSpaceID) {
                    ValidationAlertBox("Minimum Inventory Already Defined for </br> Kit No " + Kit + " and </br> Site No " + $(MyRows[i]).find('td:eq(1)').html() + "",
                                        "txtProjectNo", ModuleName);
                    return false;
                }
            }
        }
        InsertEditMinimumInventory();
    }
    else if (btntext == 'update')
    {
        if (validateform() == true) {
            MinInventory = {
                vWorkSpaceID: setWorkspaceId,
                vCWorkSpaceID: $("#ddlSite").val(),
                nKitTypeNo: $("#ddlKitType").val(),
                iQty: $("#txtMinQty").val(),
                vRemark: $("#txtRemark").val(),
                iModifyBy: $("#hdnuserid").val(),
                cStatusIndi: 'E',
                DATAOPMODE: '2',
                nStudyProductMinInventoryDtlNo: nStudyProductMinInventoryDtlNo,
            }
            MinInventoryDtl.push(MinInventory);
            InsertEditMinimumInventory();
        }
    }
});

function InsertEditMinimumInventory() {
    $.ajax({
        url: BaseUrl + "PmsRecordSave/Save_StudyProductMinInventoryDtl",
        type: 'POST',
        data: { '': MinInventoryDtl },
        success: function (data) {
            $("#btnSavePmsMinimumInventory").attr("style", "display:none");
            var btntext = (document.getElementById("spnMinimumInventory").innerText).toLowerCase().trim()
            if (btntext == "update") {
                SuccessorErrorMessageAlertBox("Minimum Inventory updated successfully.", ModuleName);
            }
            else {
                SuccessorErrorMessageAlertBox("Data Saved Successfully !", ModuleName);
            }
            GetStudyProductMinInventoryDtl();
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Error !", ModuleName);
        }
    });
}

function GetStudyProductMinInventoryDtl() {
    if (setWorkspaceId != undefined && setWorkspaceId != "") {
        var wStr = "vWorkspaceId = " + setWorkspaceId + ""
        var WhereData = {
            WhereCondition_1: wStr,
        }

        $.ajax({
            url: BaseUrl + "PmsRecordFetch/View_StudyProductMinInventoryDtl",
            type: 'POST',
            data: WhereData,
            async: false,
            success: SuccessResult,
            error: function () {
                alert("Error To Get Project Wise Audit Trail !");
            }
        });

        function SuccessResult(jsonData) {
            var JsonObj = jsonData.Table;
            var Edit_c = "";
            var AuditTrail_c = "";
            MinInventory = {};
            MinInventoryDtl = [];

            if (JsonObj.length > 0) {
                $("#ExportButton").attr("style", "display:inline");
                GetSessionVariable();
            }
            else {
                $("#ExportButton").attr("style", "display:none");
            }

            var ActivityDataset = [];
            for (var i = 0; i < JsonObj.length; i++) {
                var InDataset = [];

                if (viewmode == "OnlyView") {
                    Edit_c = '<a data-tooltip="tooltip" title="Edit" class="disabled"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-edit"></i><span>Edit</span></a>'
                }
                else {
                    Edit_c = '<a data-toggle="modal" data-tooltip="tooltip" title="Edit" class="btnedit" data-toggle="modal" Onclick=EditMinInventoryData(this) id="' +
                              JsonObj[i].nStudyProductMinInventoryDtlNo + '" Site="' + JsonObj[i].vCWorkSpaceID + '" KitType="' +
                              JsonObj[i].nKitTypeNo + '"  Qty ="' + JsonObj[i].iQty + '" style="cursor:pointer;"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"> ' +
                              ' <i class="fa fa-fw fa-edit"></i><span>Edit</span></a>'
                }

                AuditTrail_c = '<a data-toggle="modal" data-tooltip="tooltip" title="Audit Trail" data-target="#MinimumInventoryModel" ' +
                                 ' attrid="' + JsonObj[i].nStudyProductMinInventoryDtlNo + '" class="btnedit" Onclick=AuditTrailMinimumInventory(this) id="' + JsonObj[i].nStudyProductMinInventoryDtlNo
                                 + '" Site="' + JsonObj[i].vCWorkSpaceID + '" KitType="' + JsonObj[i].nKitTypeNo + '" Qty ="' + JsonObj[i].iQty + '" style="cursor:pointer;">' +
                                 '<i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-fw fa-file-text-o"></i><span>Audit</span></a>';


                InDataset.push(JsonObj[i].vProjectNo, JsonObj[i].SiteName, JsonObj[i].vKitTypeDesc, JsonObj[i].iQty,
                               Edit_c, AuditTrail_c, JsonObj[i].vCWorkSpaceID);
                ActivityDataset.push(InDataset);


                MinInventory = {
                    vCWorkSpaceID: JsonObj[i].vCWorkSpaceID,
                    vKitTypeDesc: JsonObj[i].vKitTypeDesc,
                }
                MinInventoryDtl.push(MinInventory);
            }

            otableMinimumInventoryDtl = $('#tblMinimumInventory').dataTable({
                "bJQueryUI": true,
                "sPaginationType": "full_numbers",
                "bLengthChange": true,
                "iDisplayLength": 10,
                "bProcessing": true,
                "bSort": true,
                "aaData": ActivityDataset,
                "aaSorting": [],
                "bInfo": true,
                "bAutoWidth": false,
                "bDestroy": true,
                "aoColumns": [
                   { "sTitle": "Project" },
                   { "sTitle": "Site" },
                   { "sTitle": "Kit Type" },
                   { "sTitle": "Quantity" },
                   { "sTitle": "Edit" },
                   { "sTitle": "Audit Trail" },
                   { "sTitle": "ChildWorkSpaceID" },

                ],
                "columnDefs": [
                    {
                        "targets": [6],
                        "visible": false,
                        "searchable": false
                    },
                    { "bSortable": false, "targets": [4, 5] },
                ],
                "oLanguage": {
                    "sEmptyTable": "No Record Found",
                },
            });
        }
    }
}

function EditMinInventoryData(e) {

    document.getElementById("divsite").style.display = "inline";
    $('.form-control').each(function () {
        $(this).attr('disabled', true);
    });
    $('.AuditControl').each(function () { this.style.display = "none"; });

    $("#titleMode").text('Mode:-Edit');
    nStudyProductMinInventoryDtlNo = $(e).attr("Id");
    $("#ddlSite").val($(e).attr("Site"));
    $("#ddlKitType").val($(e).attr("KitType"));
    $("#txtMinQty").val($(e).attr("Qty"));
    jQuery("#spnMinimumInventory").text('Update');
    $('#btnSavePmsMinimumInventory').removeAttr("title");
    $('#btnSavePmsMinimumInventory').attr("title", "Update");
    $("#btnAddTempMinimumInventory").hide();
    $('#txtRemark').val('');
    document.getElementById("DivEditRemark").style.display = "block";
    $("#btnSavePmsMinimumInventory").show();
    $("#btnClearPmsMinimumInventory").show();
    $("#tblMinimumInventoryTemp tbody tr").remove();
    $("#tblMinimumInventoryTemp thead").hide();
    $("#txtMinQty").attr('disabled', false);
    $("#txtRemark").attr('disabled', false);
    $("#txtProjectNoDashboard").attr('disabled', false);
    $("#txtProjectNo").val($("#txtProjectNoDashboard").val());

    $('#MinimumInventoryModel').modal('show');
}

function AuditTrailMinimumInventory(e) {
    $("#titleMode").text('Mode:-Audit Trail');
    nStudyProductMinInventoryDtlNo = $(e).attr("Id");
    $("#ddlSite").val($(e).attr("Site"));
    $("#ddlKitType").val($(e).attr("KitType"));
    $("#txtMinQty").val($(e).attr("Qty"));
    $("#btnAddTempMinimumInventory").hide();
    $('#txtRemark').val('');
    document.getElementById("DivEditRemark").style.display = "none";
    $("#btnSavePmsMinimumInventory").hide();
    $("#tblMinimumInventoryTemp tbody tr").remove();
    $("#tblMinimumInventoryTemp thead").hide();
    $('.AuditControl').each(function () { this.style.display = "inline"; });
    $('.form-control').each(function () {
        $(this).attr('disabled', true);
    });

    $("#btnSavePmsMinimumInventory").attr("style", "display:none");
    $("#btnClearPmsMinimumInventory").attr("style", "display:none");
    $("#txtProjectNoDashboard").attr('disabled', false);
}

function AuditTrail(e) {
    var str = e.id;
    var title = $(e).attr("titlename");
    var fieldname = str.substring(4);
    var iUserNo = $("#hdnuserid").val();
    var MasterFieldName = $(e).attr("MasterFieldName");
    var MasterTableName = $(e).attr("MasterTableName");
    var Data = {
        vTableName: "StudyProductMinInventoryDtlHistory",
        vIdName: "nStudyProductMinInventoryDtlNo",
        vIdValue: nStudyProductMinInventoryDtlNo,
        vFieldName: fieldname,
        iUserId: iUserNo,
        vMasterFieldName: MasterFieldName,
        vMasterTableName: MasterTableName
    }

    $('#tblPmsMiminumInventoryAuditTrial > tbody > tr:nth-child(n+1)').remove();
    $.ajax({
        url: BaseUrl + "PmsGeneral/AuditTrail",
        type: 'POST',
        data: Data,
        async: false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("No Data Found in Audit Trail !", ModuleName);

        }
    });

    function SuccessMethod(jsonData) {
        var strdata = "";
        var locationtype;
        var Desciprtion;

        var ActivityDataset = [];
        for (var i = 0; i < jsonData.length; i++) {
            var InDataset = [];

            InDataset.push(jsonData[i].vFieldName, jsonData[i].Operation, title + ' ' + jsonData[i].vDesciprtion, jsonData[i].vRemark, jsonData[i].vModifyBy, jsonData[i].dModifyOn);
            ActivityDataset.push(InDataset);

        }
        otable = $('#tblPmsMiminumInventoryAuditTrial').dataTable({
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
                         { "sTitle": " Description " },
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

function GetSessionVariable() {
    var url = WebUrl + "PmsMinimumInventory/GetSessionData";
    $.ajax({
        url: url,
        type: 'get',
        data: { id: setWorkspaceId },
        async: false,
        success: function (response) {
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Project Not Found !", ModuleName);
        }
    });
}