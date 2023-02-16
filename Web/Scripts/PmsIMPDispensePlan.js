var ModuleName = "IMP Dispense Plan";
var workspaceIds = new Object();
var TempDosingType = "";
var TempQty = "";
var MultipleStudyDoseCount = 0;
var TotalDoses;
var ProductTypeJsonData;
var DosingDetailData = {};
var DosingDetailDataResult = [];
var vDosingBarCode = "";

$(document).ready(function () {
    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('.modal').modal('hide');

    CheckSetProjectGeneral("txtProjectNoDashboard");
    if (setWorkspaceId != undefined) {
        GetPeriod();
    }
});

$('#txtProjectNoDashboard').on('change keyup paste mouseup', function () {
    var GetPmsProductBatchProjectNo = {
        Url: BaseUrl + "PmsProductBatch/GetProjectNo",
        SuccessMethod: "SuccessMethod"
    }

    if ($('#txtProjectNoDashboard').val().length == 2) {
        var ProjectNoDataTemp = {
            vProjectNo: $('#txtProjectNoDashboard').val(),
            iUserId: $("#hdnuserid").val(),
            vProjectTypeCode: $("#hdnscopevalues").val(),
        }
        GetAllPmsProductbatchProjectNo(GetPmsProductBatchProjectNo.Url, GetPmsProductBatchProjectNo.SuccessMethod, ProjectNoDataTemp);

    }
    else if ($('#txtProjectNoDashboard').val().length < 2) {
        $("#txtProjectNoDashboard").autocomplete({
            source: "",
            change: function (event, ui) { },
            select: function (event, ui) {
                $('#txtProjectNoDashboard').blur();
            }

        });
    }
});

$('#txtProjectNoDashboard').on('blur', function () {
    if (workspaceIds[$('#txtProjectNoDashboard').val()] != undefined) {
        setWorkspaceId = workspaceIds[$('#txtProjectNoDashboard').val()];
        GetPeriod();
    }
});

$('#btnGenerateBarCode').on('click', function () {
    ClearDataGenerateIpLabel();
    if (Validateform()) {
        $("#tblTempGenerateIPLabel tbody tr").remove();
        $("#tblTempGenerateIPLabel").hide();
        DosingDetail()
    }
});

$('#btnGo').on('click', function () {
    if (Validateform()) {
        GeneratedIPLabel();
    }
});

$('#btnOKDayDoseInfo').on('click', function () {
    if (ValidationForMultidose() == true) {
        $('#ModalDayDoseInfo').modal('hide');
    }
});

$('#btnIPLabelEditQty').on('click', function () {
    var wStr = "vWorkspaceId = " + setWorkspaceId + " and cEditFlag = 'Y'"
    var WhereData = {
        WhereCondition_1: wStr,
        columnName_1: "Distinct vFormulationType,vProductType,iQty,nProductTypeID"
    }
    if (setWorkspaceId != "") {
        $.ajax({
            url: BaseUrl + "PmsRecordFetch/View_TreatmentTypeMapping",
            type: 'POST',
            data: WhereData,
            async: false,
            success: SuccessTreatTypeMappingData,
        });

        function SuccessTreatTypeMappingData(data) {
            data = data.Table;

            var ActivityDataset = [];
            var $txtRemarks = "";
            var $txtQty = "";


            if (data.length > 0) {
                $('#ModalQuantityModification').modal('show');
            }
            else {
                $('#ModalQuantityModification').modal('hide');
            }


            for (var i = 0; i < data.length; i++) {
                var InDataset = [];
                $txtQty = '<input type="number" id="txtQty' + data[i].vFormulationType + '" placeholder="Quantity" class="form-control qtycontrol" style="height: 26px"/>';
                $txtRemarks = '<input type="text" id="txtRemarks' + data[i].vFormulationType + '" placeholder="Remarks" class="form-control" style="height: 50px;width:100%"/>';

                InDataset.push(data[i].vProductType, data[i].iQty, $txtQty, $txtRemarks, data[i].vFormulationType, data[i].nProductTypeID);
                ActivityDataset.push(InDataset);
            }

            otableQuantityModification = $('#tblQuantityModification').dataTable({
                "bJQueryUI": true,
                "sPaginationType": "full_numbers",
                "bLengthChange": false,
                "bProcessing": true,
                "bSort": false,
                "aaData": ActivityDataset,
                "aaSorting": [],
                "bInfo": false,
                "bAutoWidth": false,
                "bDestroy": true,
                "aoColumns": [
                   { "sTitle": "Treatment Type" },
                   { "sTitle": "Quantity" },
                   { "sTitle": "Updated Qty" },
                   { "sTitle": "Remarks" },
                   { "sTitle": "TreatmentType" },
                   { "sTitle": "nProductTypeID" },
                ],
                "oLanguage": {
                    "sEmptyTable": "No Record Found",
                },
                "columnDefs": [{
                    "targets": [4, 5],
                    "visible": false,
                    "searchable": false
                }],
            });
        }
    }
});

$("#btnApplyQtyModification").on("click", function () {
    var TreatmentType = {};
    var TreatmentTypeResult = [];
    //$("input[id*=txtDispatchDate" + documentno + "]").val(),
    var rows = $("#tblQuantityModification").dataTable().fnGetNodes();
    for (i = 0; i < rows.length; i++) {
        var formulationtype = otableQuantityModification.fnGetData(i - 0)[4];
        if ($("input[id*=txtQty" + formulationtype + "]").val() > 0) {
            
            TreatmentType = {};
            TreatmentType = {
                vWorkSpaceID: setWorkspaceId,
                vFormulationType: formulationtype,
                nProductTypeID: otableQuantityModification.fnGetData(i - 0)[5],
                iQty: $("input[id*=txtQty" + formulationtype + "]").val(),
                cEditFlag: "Y",
                vRemark: $("input[id*=txtRemarks" + formulationtype + "]").val(),
                iModifyBy: $("#hdnuserid").val(),
                DATAOPMODE: "2"
            }
            TreatmentTypeResult.push(TreatmentType);
        }
    }

    $.ajax({
        url: BaseUrl + "PmsRecordSave/Save_TreatmentTypeMapping",
        type: 'POST',
        data: { '': TreatmentTypeResult },
        success: function (data) {
            TempIPLable();
            $('#ModalQuantityModification').modal('hide');
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Error !", ModuleName);
        }
    });


});

$("#btnSaveGenerateIPLabel").on("click", function () {

    if (ValidateformQuantity() == false) {
        return false;
    }
    Save_DosingDetail();
});

$("#btnClearGenerateIPLabel").on("click", function ()
{
    ClearDataGenerateIpLabel();
})

$("#tblTempGenerateIPLabel").on('click', '#trRemove', function () {
    $(this).closest('tr').remove();
    if ($("#tblTempGenerateIPLabel tr").length == 1) {
        $("#tblTempGenerateIPLabel").hide();
        $("#btnSaveGenerateIPLabel").attr("style", "display:none");
    }
    else {
        $("#tblTempGenerateIPLabel").show();
        $("#btnSaveGenerateIPLabel").attr("style", "display:inline");

    }
});

var GetAllPmsProductbatchProjectNo = function (Url, SuccessMethod, ProjectNoDataTemp) {
    $.ajax({
        url: Url,
        type: 'GET',
        data: { id: ProjectNoDataTemp.iUserId, projectno: ProjectNoDataTemp.vProjectNo, typecode: ProjectNoDataTemp.vProjectTypeCode },
        async: false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("No Project Bound !", ModuleName);
        }
    });
    function SuccessMethod(jsonData) {
        var jsonObj = jsonData;
        var sourceArr = [];

        for (var i = 0; i < jsonObj.length; i++) {
            sourceArr.push("[ " + jsonObj[i].vProjectNo + " ]" + " " + jsonObj[i].vRequestId);
            workspaceIds["[ " + jsonObj[i].vProjectNo + " ]" + " " + jsonObj[i].vRequestId] = jsonObj[i].vWorkspaceId;
        }

        $("#txtProjectNoDashboard").autocomplete({
            source: sourceArr,
            change: function (event, ui) { }
        });
    }
}

function GetPeriod() {
    var wStr = "vWorkspaceId = " + setWorkspaceId + ""
    var WhereData = {
        WhereCondition_1: wStr,
        //columnName_1: "Distinct iPeriod"
        columnName_1: 'Distinct vWorkspaceId ,vNodeDisplayName,iPeriod',
    }
    $.ajax({
        url: BaseUrl + "PmsRecordFetch/View_WorkSpaceNodeDetail",
        type: 'POST',
        data: WhereData,
        async: false,
        success: function (data) {
            data = data.Table;
            $("#ddlPeriod").empty().append('<option selected="selected" value="0">Please Select Period</option>');
            for (var i = 0; i < data.length; i++) {
                $("#ddlPeriod").append($("<option></option>").val(data[i].iPeriod).html(data[i].vNodeDisplayName));
            }
        }
    });
}

function DosingData(Dosingtype) {
    $("#tblDayDoseInfo tbody tr").remove();
    $("#tblDayDoseInfo thead").hide();

    if (Dosingtype == "S") {
        $(".DayDoseQty").attr('disabled', true);
        $(".DayDoseQty").val("1");
        jQuery("#lblDosingQty").text('Single Dose');
    }
    else if (Dosingtype == "M") {
        $(".DayDoseQty").attr('disabled', false);
        $(".DayDoseQty").attr('onchange', 'MultiPleDoseDistribute()');
        $(".DayDoseQty").val("");
        jQuery("#lblDosingQty").text('Multi Dose');
    }
    $('#ModalDayDoseInfo').modal('show');
}

function TempIPLable() {
    if (isBlank(document.getElementById('txtFromSubject').value)) {
        ValidationAlertBox("Please Enter From Subject No !", "txtFromSubject", ModuleName);
        return false;
    }

    if (isBlank(document.getElementById('txtToSubject').value)) {
        ValidationAlertBox("Please Enter To Subject No !", "txtToSubject", ModuleName);
        return false;
    }

    if (isBlank(document.getElementById('txtNoofDays').value) && TempDosingType == "Multi Dose") {
        ValidationAlertBox("Please Enter No Of Days !", "txtNoofDays", ModuleName);
        return false;
    }
    if (isBlank(document.getElementById('txtNoofDose').value) && TempDosingType == "Multi Dose") {
        ValidationAlertBox("Please Enter No Of Dose !", "txtNoofDose", ModuleName);
        return false;
    }

    if (!ValidateSubjectIDAvailableORNOT()) {
        ValidationAlertBox("Barcode Labels Already Exist. First Delete Labels and Generate Again!", "txtToSubject", ModuleName);
        $("#tblTempGenerateIPLabel tbody tr").remove();
        $("#tblTempGenerateIPLabel").hide();
        $("#btnSaveGenerateIPLabel").attr("style", "display:none");
        return false;
    }

    if (!ValidateRandomizationDetail()) {
        ValidationAlertBox("Randomization Details for the Entered Subject Range is Not Found. </br> Please Upload CSV File for the same.", "txtToSubject", ModuleName);
        $("#tblTempGenerateIPLabel tbody tr").remove();
        $("#tblTempGenerateIPLabel").hide();
        $("#btnSaveGenerateIPLabel").attr("style", "display:none");
        return false;
    }
    
    var cDoseFlag;
    if (TempDosingType == "Single Dose") {
        cDoseFlag = 'S'
    }
    else if (TempDosingType == "Multi Dose") {
        cDoseFlag = 'M'
    }

    var FilterData =
    {
        vWorkspaceId: setWorkspaceId,
        iPeriod: $("#ddlPeriod").val(),
        vRandomizationFromCode: $("#txtFromSubject").val(),
        vRandomizationToCode: $("#txtToSubject").val(),
        iDose: $("#txtNoofDose").val(),
        cDoseFlag: cDoseFlag,
    }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/Proc_GetGenrateIPLabelMatrix",
        type: 'POST',
        data: FilterData,
        async: false,
        success: SuccessRandomizationDtl,
        error: function () {
            SuccessorErrorMessageAlertBox("Error To Get Randomization Detail !", ModuleName);
        }
    });

    function SuccessRandomizationDtl(jsondata) {
        $("#btnIPLabelEditQty").attr("style", "display:none");
        if (jsondata.Table.length > 0) {
            $("#btnSaveGenerateIPLabel").attr("style", "display:inline");   
        }
        else {
            $("#btnSaveGenerateIPLabel").attr("style", "display:none");
        }

        
        var strdata = "";
        ProductTypeJsonData = jsondata.Table1;
        $("#tblTempGenerateIPLabel tbody tr").remove();
        if (jsondata.Table.length > 0) {
            
            if (TempDosingType == "Single Dose")
            {
                $("#btnIPLabelEditQty").attr("style", "display:none");
                $(".DayDoseQty").val("1");
                for (i = 0; i < jsondata.Table.length; i++)
                {
                    strdata += "<tr>";
                    strdata += "<td>" + jsondata.Table[i].vRandomizationcode + "</td>";
                    strdata += "<td>" + jsondata.Table[i].vProductType + "</td>";
                    strdata += "<td>" + $(".DayDoseQty").val() + "</td>";
                    strdata += "<td>" + $(".DayDoseQty").val() + "</td>";
                    strdata += "<td>1</td>";
                    strdata += "<td class='hidetd'>" + jsondata.Table[i].nProductTypeId + "</td>";
                    strdata += "<td id='trRemove'><span class='glyphicon glyphicon-remove'></span></td>";
                    strdata += "</tr>";
                }
                
            }
            else if (TempDosingType == "Multi Dose") {
                
                MultiDoseGrid(jsondata);
            }

            $("#tbltbodytempGenerateIPLabel").append(strdata);
            $("#tblTempGenerateIPLabel thead").show();
            $("#tblTempGenerateIPLabel").show();
        }
    }
}

function Validateform() {
    if (Dropdown_Validation(document.getElementById("ddlPeriod"))) {
        ValidationAlertBox("Please Select Period !", "ddlPeriod", ModuleName);
        return false;
    }

    return true;
}

function MultiPleDoseDistribute() {
    $("#tblDayDoseInfo tbody tr").remove();
    $("#tblDayDoseInfo thead").hide();

    var noofdays = $("#txtNoofDays").val();
    TotalDoses = $("#txtNoofDose").val();

    if (parseInt(noofdays) > parseInt(TotalDoses)) {
        ValidationAlertBox("Total Number of Doses Should be Equal to or Greater Than The Total Number of Days !", "txtNoofDose", ModuleName);
        return false;
    }

    if (noofdays > 0 && TotalDoses > 0) {
        var totaldosesdaywise = parseInt(TotalDoses) / parseInt(noofdays);

        if (Math.round(totaldosesdaywise) != totaldosesdaywise) {
            totaldosesdaywise = "";
        }

        var strdata;
        for (i = 0; i < noofdays; i++) {
            var $txtDose = '<input type="text" id="txtDose' + (i + 1) + '" value = "' + totaldosesdaywise
                + '" class="form-control" style="height: 26px" />';
            strdata += "<tr>";
            strdata += "<td>" + (i + 1) + "</td>";
            strdata += "<td>" + $txtDose + "</td>";
            strdata += "</tr>";
        }

        var $txtTotalDoseQty = '<input type="text" id="txtTotalDoseQty" class="form-control" value = ' + TotalDoses
                                + ' style="height: 26px" disabled="disabled" />';
        strdata += "<tr>";
        strdata += "<td>Total</td>";
        strdata += "<td>" + $txtTotalDoseQty + "</td>";
        strdata += "</tr>";

        $("#tbodyDayDoseInfo").append(strdata);
        $("#tblDayDoseInfo thead").show();
        $("#tblDayDoseInfo").show();
        $("#divDayDoseInfo").attr("style", "display:block");
    }
}

function ValidationForMultidose() {
    MultipleStudyDoseCount = 0;
    var MyRows = $('table#tblDayDoseInfo').find('tbody').find('tr');
    if (MyRows.length != 0) {
        for (i = 0; i < MyRows.length - 1; i++) {
            if ($("input[id*=txtDose" + (i + 1) + "]").val() == '') {
                ValidationAlertBox("Doses cannot be blank.Please Enter doses.", "txtNoofDose", ModuleName);
                return false;
            }
            var DoseCount = $("input[id*=txtDose" + (i + 1) + "]").val()
            MultipleStudyDoseCount += parseInt(DoseCount);
        }

        if (MultipleStudyDoseCount > parseInt($("#txtNoofDose").val()) || MultipleStudyDoseCount < parseInt($("#txtNoofDose").val())) {
            ValidationAlertBox("Entered Doses Cannot Be Greater or Less Than The Total Number of Doses.", "txtNoofDose", ModuleName);
            return false;
        }
    }
    return true;
}

function DosingDetail() {
    var wStr = "vWorkspaceId = " + setWorkspaceId + ""
    var WhereData = {
        WhereCondition_1: wStr,
        columnName_1: "Distinct cDoseType"
    }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/View_StudyProductDesignMst",
        type: 'POST',
        data: WhereData,
        async: false,
        success: function (data) {
            data = data.Table;
            if (data.length > 0) {
                if (data[0].cDoseType == "Single Dose") {
                    $("#IconSingleDose").attr("style", "display:inline;font-size:25px;padding-left:35px");
                    $("#IconMultiDose").attr("style", "display:none;");
                    TempDosingType = "Single Dose";
                }
                else if (data[0].cDoseType == "Multi Dose") {
                    $("#IconMultiDose").attr("style", "display:inline;font-size:25px;padding-left:35px");
                    $("#IconSingleDose").attr("style", "display:none");
                    TempDosingType = "Multi Dose";
                }
                $('#ModalGenerateIPLabel').modal('show');
                $("#txtNoofBlankLabel").val("0");
            }
            else {
                SuccessorErrorMessageAlertBox("There is No Study Setup Define for This Project", ModuleName);
            }
        }
    });
}

function MultiDoseGrid(jsonobj) {
    $("#btnIPLabelEditQty").attr("style", "display:inline");
    var MyRows = $('table#tblDayDoseInfo').find('tbody').find('tr');
    var totaldays = $("#txtNoofDays").val();
    var temptotaldose;
    var strdata = "";
    jsonobj = jsonobj.Table;
    if (jsonobj.length > 0) {
        for (i = 0; i < jsonobj.length; i++) {

            if (MyRows.length != 0) {
                for (j = 0; j < MyRows.length - 1; j++) {
                    temptotaldose = $("input[id*=txtDose" + (j + 1) + "]").val();
                    for (k = 0; k < parseInt(temptotaldose) ; k++) {
                        strdata += "<tr>";
                        strdata += "<td>" + jsonobj[i].vRandomizationcode + "</td>";
                        strdata += "<td>" + jsonobj[i].vProductType + "</td>";
                        strdata += "<td>" + (j + 1) + "</td>";
                        strdata += "<td>" + (k + 1) + "</td>";
                        strdata += "<td>" + jsonobj[i].iQty + "</td>";
                        strdata += "<td class='hidetd'>" + jsonobj[i].nProductTypeId + "</td>";
                        strdata += "<td id='trRemove'><span class='glyphicon glyphicon-remove'></span></td>";
                        strdata += "</tr>";
                    }   
                }
            }
        }
        $("#tbltbodytempGenerateIPLabel").append(strdata);
        $("#tblTempGenerateIPLabel thead").show();
        $("#tblTempGenerateIPLabel").show();
    }
}

function ValidateformQuantity() {
    var result = true;
    var MyRows = $('table#tblTempGenerateIPLabel').find('tbody').find('tr');
    var arrProductType = [];
    if (ProductTypeJsonData.length > 0) {
        for (i = 0; i < ProductTypeJsonData.length; i++) {
            var tempQty = 0;
            var tempTypeId = 0;
            for (j = 0; j < MyRows.length; j++) {
                if (ProductTypeJsonData[i].nProductTypeId == $(MyRows[j]).find('td:eq(5)').html()) {
                    tempQty = parseInt(tempQty) + parseInt($(MyRows[j]).find('td:eq(4)').html());
                }
            }
            arrProductType.push({
                key: ProductTypeJsonData[i].nProductTypeId,
                value: tempQty
            });
        }
    }
    if (arrProductType.length > 0) {
        for (i = 0; i < arrProductType.length; i++) {
            var QuantityCheck = {
                vWorkSpaceID: setWorkspaceId,
                nProductTypeID: parseInt(arrProductType[i].key),
                cTransferINdi : "P",
            }
            $.ajax({
                url: BaseUrl + "PmsRecordFetch/Proc_GetQuantityForGenerateIPLabel",
                type: 'POST',
                data: QuantityCheck,
                async: false,
                success: function (jsondata) {
                    if (parseInt(arrProductType[i].value) > parseInt(jsondata.Table[0].AvailableQty))
                    {
                        ValidationAlertBox("You Have Added Treatment Type: Test. </br> Quantity for Barcode is " + parseInt(arrProductType[i].value) + " : &  </br> Available Quantity is " + jsondata.Table[0].AvailableQty + " !", "ddlPeriod", ModuleName);
                        result = false;
                    }
                },
            });
            if (result == false)
            {
                result = false;
                break;
            }
        }
    }
    return result;
}

function Save_DosingDetail() {
    DosingDetailDataResult = [];
    var MyRows = $('table#tblTempGenerateIPLabel').find('tbody').find('tr');
    for (i = 0; i < MyRows.length; i++) {
        DosingDetailData = {};
        DosingDetailData = {
            vWorkSpaceID: setWorkspaceId,
            iPeriod: $("#ddlPeriod").val(),
            iMySubjectNo: 0,
            iDoseNo: $(MyRows[i]).find('td:eq(3)').html(),
            iDayNo: $(MyRows[i]).find('td:eq(2)').html(),
            vRandomizationcode: $(MyRows[i]).find('td:eq(0)').html(),
            nProductTypeID: $(MyRows[i]).find('td:eq(5)').html(),
            iDispenseQtyPerSubject: $(MyRows[i]).find('td:eq(4)').html(),
            cDispenseStatus: "N",
            iModifyBy: $("#hdnuserid").val(),
            DATAOPMODE: "1"
        }
        DosingDetailDataResult.push(DosingDetailData);
    }

    $.ajax({
        url: BaseUrl + "PmsRecordSave/Save_DosingDetail",
        type: 'POST',
        data: { '': DosingDetailDataResult },
        success: function (data) {
            GeneratedIPLabel();
            SuccessorErrorMessageAlertBox("Data Saved Successfully !", ModuleName); 
        },
        error: function () {
            //SuccessorErrorMessageAlertBox("Error !", ModuleName);
            alert("Error");
        }
    });
}

function GeneratedIPLabel() {
    var wStr = "vWorkspaceId = '" + setWorkspaceId + "' and iPeriod = '"+ $("#ddlPeriod").val() +"' and cStatusIndi <> 'D'"
    var WhereData = {
        WhereCondition_1: wStr,
        columnName_1: "vDosingBarCode,vProjectNo,iPeriod,vSubjectID,vRandomizationcode"
    }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/View_DosingDetail",
        type: 'POST',
        data: WhereData,
        async: false,
        success: SucessDosingDetailData,
    });

    function SucessDosingDetailData(jsonData) {
        jsonData = jsonData.Table;
        var ActivityDataset = [];
        var $txtRemarks = "";
        var $txtQty = "";
        var Check_Box = "";
        var Print_Icon = "";        
        var View = "";
        var Delete_IPLable = "";

        if (jsonData.length > 0) {
            $("#btnIPlabelDelete").attr("style", "display:inline");
        }
        else {
            $("#btnIPlabelDelete").attr("style", "display:none");
        }


        for (var i = 0; i < jsonData.length; i++) {
            var InDataset = [];
            Check_Box = '<input class="chk" type="checkbox" name="SelectUnSelect" id=chk1' + jsonData[i].vDosingBarCode + ' value="' + jsonData[i].vDosingBarCode
                    + '" onchange="checkChange();" />';

            Print_Icon = '<a title="Print" attrid="' + jsonData[i].vDosingBarCode + '" style="cursor:pointer;"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="glyphicon glyphicon-print"></i><span>Print</span></a>'

            View = '<a data-toggle="modal" data-tooltip="tooltip" title="View" data-target="#ModalIPLabelDetails" attrid="1" class="btnedit" onclick="GenerateIDLabelDetails(this)" vDosingBarCode = "' + jsonData[i].vDosingBarCode
                          + '" style="cursor:pointer;"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-search"></i><span>View</span></i></a>'

            Delete_IPLable = '<a title="Delete" attrid="' + jsonData[i].vDosingBarCode + '" style="cursor:pointer;" onclick="DeleteIPLabelConfirmation(this)" vDosingBarCode = "'+ jsonData[i].vDosingBarCode +'"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-trash-o"></i><span>Delete</span></a>'
           
            InDataset.push(Check_Box, jsonData[i].vDosingBarCode, jsonData[i].vProjectNo, jsonData[i].iPeriod, jsonData[i].vSubjectID,
                           jsonData[i].vRandomizationcode, Print_Icon, View, Delete_IPLable);

            ActivityDataset.push(InDataset);
        }

        otableQuantityModification = $('#tblGeneratedIPLabel').dataTable({
            "bJQueryUI": true,
            "sPaginationType": "full_numbers",
            "bLengthChange": true,
            "bProcessing": true,
            "bSort": false,
            "aaData": ActivityDataset,
            "aaSorting": [],
            "bInfo": false,
            "bAutoWidth": false,
            "bDestroy": true,
            "aoColumns": [
               { "sTitle": "<input type='checkbox' id='chkAll' onchange='checkall(this);' />" },
               { "sTitle": "Barcode" },
               { "sTitle": "Project No" },
               { "sTitle": "Period" },
               { "sTitle": "Subject ID" },
               { "sTitle": "Randomization No" },
               { "sTitle": "Print" },
               { "sTitle": "View" },
               { "sTitle": "Delete" },
            ],
            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },
        });
    }
}

function checkall(objcheck) {
    $('#tblGeneratedIPLabel input:checkbox').not(objcheck).prop('checked', objcheck.checked);
};

function checkChange() {
    var icheckValue = $("#tblGeneratedIPLabel input[name=SelectUnSelect]:checked").length.toString();
    var iTotalValue = $("#tblGeneratedIPLabel input[name=SelectUnSelect]").length.toString();
    if (icheckValue == 0) {
        $("#chkAll").prop("indeterminate", false);
        $('#chkAll').prop("checked", false);
    }
    else if (iTotalValue == icheckValue) {
        $("#chkAll").prop("indeterminate", false);
        $('#chkAll').prop("checked", true);
    }
    else {
        $('#chkAll').prop("checked", false);
        $("#chkAll").prop("indeterminate", true);
    }
}

function GenerateIDLabelDetails(e) {
    vDosingBarCode = $(e).attr("vDosingBarCode");

    var wStr = "vWorkspaceId = '" + setWorkspaceId + "' and iPeriod = '" + $("#ddlPeriod").val() +
                "' and cStatusIndi <> 'D' and vDosingBarCode = '" + vDosingBarCode + "'"
    var WhereData = {
        WhereCondition_1: wStr,
        columnName_1: "vDosingBarCode,vProductName,vBatchLotNo,iDayNo,iDoseNo,dExpiryDate,iDispenseQtyPerSubject,iModifyBy,dModifyOn"
    }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/View_DosingDetail",
        type: 'POST',
        data: WhereData,
        async: false,
        success: SuccessIPLableGeneration,
    });
    
    function SuccessIPLableGeneration(jsonData) {
        jsonData = jsonData.Table;
        var ActivityDataset = [];


        for (var i = 0; i < jsonData.length; i++) {
            var InDataset = [];

            InDataset.push(jsonData[i].vDosingBarCode, jsonData[i].vProductName, jsonData[i].vBatchLotNo, jsonData[i].iDayNo,
                           jsonData[i].iDoseNo, jsonData[i].dExpiryDate, jsonData[i].iDispenseQtyPerSubject,
                           jsonData[i].iModifyBy + "</br>" + jsonData[i].dModifyOn);

            ActivityDataset.push(InDataset);
        }

        otableQuantityModification = $('#tblIPLableDetails').dataTable({
            "bJQueryUI": true,
            "sPaginationType": "full_numbers",
            "bLengthChange": false,
            "bProcessing": true,
            "bSort": false,
            "aaData": ActivityDataset,
            "aaSorting": [],
            "bInfo": false,
            "bAutoWidth": false,
            "bDestroy": true,
            "aoColumns": [
               { "sTitle": "Barcode" },
               { "sTitle": "Drug" },
               { "sTitle": "Batch" },
               { "sTitle": "Day" },
               { "sTitle": "Dose" },
               { "sTitle": "Expiry Date / Re-Test Date" },
               { "sTitle": "Qty" },
               { "sTitle": "Generated By" },
            ],
            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },
        });
    }
    
}

function DeleteIPLabelConfirmation(e) {
    $('#txtRemark').val('');
    vDosingBarCode = "";
    vDosingBarCode = $(e).attr("vDosingBarCode");

    if (vDosingBarCode == undefined) {
        if ($("#tblGeneratedIPLabel input[name=SelectUnSelect]:checked").length <= 0) {
            ValidationAlertBox("Please Select Atleast One or More Barcode !", "ddlPeriod", ModuleName);
            return false;
        }
    }

    $('#modalRemarks').modal('show');   
}
                                                                                                        
function DeleteIPLabel() {

    if($('#txtRemark').val().toString().trim() =="" )
    {
        ValidationAlertBox("Please Enter Remarks !", "txtRemark", ModuleName);
        return false;
    }

    DosingDetailDataResult = [];
    if (vDosingBarCode == undefined) {
        var ROWNUMBER = 0;
        $("#tblGeneratedIPLabel input[name=SelectUnSelect]:checked").each(function () {
            var RequestNo = $("#tblGeneratedIPLabel input[name=SelectUnSelect]:checked")[ROWNUMBER];
            vDosingBarCode = RequestNo.value;

            DosingDetailData = {};
            DosingDetailData = {
                vWorkSpaceID: setWorkspaceId,
                vDosingBarCode: vDosingBarCode,
                iModifyBy: $("#hdnuserid").val(),
                DATAOPMODE: "3",
                cStatusIndi: "D",
                vRemark: $("#txtRemark").val()
            }
            DosingDetailDataResult.push(DosingDetailData);
            ROWNUMBER = parseInt(ROWNUMBER) + 1;
        });
    }
    else {
        DosingDetailData = {};
        DosingDetailData = {
            vWorkSpaceID: setWorkspaceId,
            vDosingBarCode: vDosingBarCode,
            iModifyBy: $("#hdnuserid").val(),
            DATAOPMODE: "3",
            cStatusIndi: "D",
        }
        DosingDetailDataResult.push(DosingDetailData);
    }

    $.ajax({
        url: BaseUrl + "PmsRecordSave/Save_DosingDetail",
        type: 'POST',
        data: { '': DosingDetailDataResult },
        success: function (data) {
            SuccessorErrorMessageAlertBox("Data Deleted Successfully !", ModuleName);
            GeneratedIPLabel();
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Error !", ModuleName);
        }
    });

}

function ValidateSubjectIDAvailableORNOT() {
    var result = true;

    var wStr = "vWorkspaceId = '" + setWorkspaceId + "' and iPeriod = '" + $("#ddlPeriod").val()
            + "' and vRandomizationCode Between '" + $("#txtFromSubject").val() + "' and '"
            + $("#txtToSubject").val() + "' and cStatusIndi <> 'D'"

    var WhereData = {
        WhereCondition_1: wStr,
        //columnName_1: "vRandomizationcode,vProductType,iQty"
    }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/View_DosingDetail",
        type: 'POST',
        data: WhereData,
        async: false,
        success: function (data) {
            if (data.Table.length > 0)
            {
                result = false;
            }
        },
    });
    return result;
}

function ValidateRandomizationDetail() {
    var result = true;

    var wStr = "vWorkspaceId = '" + setWorkspaceId + "' and iPeriod = '" + $("#ddlPeriod").val()
            + "' and vRandomizationCode Between '" + $("#txtFromSubject").val() + "' and '"
            + $("#txtToSubject").val() + "' and cStatusIndi <> 'D'"

    var WhereData = {
        WhereCondition_1: wStr,
    }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/ViewRandomizationDetailData",
        type: 'POST',
        data: WhereData,
        async: false,
        success: function (data) {
            if (data.Table.length == 0) {
                result = false;
            }
        },
    });
    return result;
}

function DeletedAuditTrail() {
    if (Dropdown_Validation(document.getElementById("ddlPeriod"))) {
        $('#ModalDeletedAuditTrail').modal('hide');
        ValidationAlertBox("Please Select Period !", "ddlPeriod", ModuleName);
        return false;
    }

    $('#ModalDeletedAuditTrail').modal('show');
    var wStr = "vWorkspaceId = '" + setWorkspaceId + "' and iPeriod = '" + $("#ddlPeriod").val() + "' and cStatusIndi = 'D' order by dModifyOn desc"

    var WhereData = {
        WhereCondition_1: wStr,
        //columnName_1: "vRandomizationcode,vProductType,iQty"
    }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/View_DosingDetail",
        type: 'POST',
        data: WhereData,
        async: false,
        success: function (jsonData) {
            jsonData = jsonData.Table;
            var ActivityDataset = [];

            for (var i = 0; i < jsonData.length; i++) {
                var InDataset = [];

                InDataset.push(jsonData[i].vDosingBarCode, jsonData[i].vProjectNo, jsonData[i].iPeriod, 
                               jsonData[i].vRandomizationcode, jsonData[i].iModifyBy, jsonData[i].dModifyOn);

                ActivityDataset.push(InDataset);
            }

            otableQuantityModification = $('#tblAuditTrail').dataTable({
                "bJQueryUI": true,
                "sPaginationType": "full_numbers",
                "bLengthChange": true,
                "bProcessing": true,
                "bSort": false,
                "aaData": ActivityDataset,
                "aaSorting": [],
                "bInfo": false,
                "bAutoWidth": false,
                "bDestroy": true,
                "aoColumns": [
                   { "sTitle": "Barcode" },
                   { "sTitle": "Project No" },
                   { "sTitle": "Period" },
                   { "sTitle": "Randomization No" },
                   { "sTitle": "Deleted by" },
                   { "sTitle": "Deleted On" },
                ],
                "oLanguage": {
                    "sEmptyTable": "No Record Found",
                },
            });
        },
    });
}

function ClearDataGenerateIpLabel() {
    
    $('#txtFromSubject').val('');
    $('#txtToSubject').val('');
    $('#txtNoofBlankLabel').val('');
}

function EditQtyAuditTrail() {
    $('#ModalEditQtyAuditTrail').modal('show');
    var wStr = "vWorkspaceId = '" + setWorkspaceId + "'"

    var WhereData = {
        vWorkSpaceID: setWorkspaceId,
    }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/Proc_GetTreatmentTypeMappingAuditTrail",
        type: 'POST',
        data: WhereData,
        async: false,
        success: function (jsonData) {
            var ActivityDataset = [];
            jsonData = jsonData.Table;
            for (var i = 0; i < jsonData.length; i++) {
                var InDataset = [];

                InDataset.push(jsonData[i].vProductType, jsonData[i].iQty, jsonData[i].QuantityEditable,
                               jsonData[i].Operation, jsonData[i].vRemark, jsonData[i].vModifyBy, jsonData[i].dModifyOn);

                ActivityDataset.push(InDataset);
            }

            otableQuantityModification = $('#tblEditQtyAuditTrail').dataTable({
                "bJQueryUI": true,
                "sPaginationType": "full_numbers",
                "bLengthChange": true,
                "bProcessing": true,
                "bSort": false,
                "aaData": ActivityDataset,
                "aaSorting": [],
                "bInfo": false,
                "bAutoWidth": false,
                "bDestroy": true,
                "aoColumns": [
                   { "sTitle": "Product Type" },
                   { "sTitle": "Quantity" },
                   { "sTitle": "Quantity Editable" },
                   { "sTitle": "Operation" },
                   { "sTitle": "Remarks" },
                   { "sTitle": "Modify On" },
                   { "sTitle": "Modify By" },
                ],
                "oLanguage": {
                    "sEmptyTable": "No Record Found",
                },
            });
        },
    });
}
