var iUserNo;
var productIds = new Object();
var filenames1 = [];
var filenames2 = [];
var pathname;
var setworkspaceid;
var viewmode;
var ModuleName = "Upload Randomization";
var remarksMandatory = false;
var GridData = "";

$(document).ready(function () {

    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('.modal').modal('hide');

    CheckSetProject();
    GetAllParentPRoject();
    if (setworkspaceid != undefined) {
        $('#fileToUpload').prop("disabled", false);
    }
    if (setworkspaceid != undefined) {
        GetRandomizationDetailData();
        ViewMyProject();
    }

});

$(function () {
    var GetPmsDocMasterProjectNo = {
        Url: BaseUrl + "PmsProductBatch/GetProjectNo",
        SuccessMethod: "SuccessMethod",
    }

    $("#fileToUpload").change(function (e) {
        //if ($("#fileToUpload").val().toLowerCase().lastIndexOf(".csv") == -1) {
        //    SuccessorErrorMessageAlertBox("Please Upload Only .csv Extention File !" , ModuleName);
        //    $("#fileToUpload").val('');
        //    return false;
        //}
        if (productIds[$('#DDLProjectNo').val()] != undefined) {
            setworkspaceid = productIds[$('#DDLProjectNo').val()];
        }
        var fileUpload = $("#fileToUpload");
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
        if (!regex.test(fileUpload.val().toLowerCase())) {
            SuccessorErrorMessageAlertBox("Please Upload Only .csv Extention File !", ModuleName);
            fileUpload.val('');
            return false;
        }
        //if (typeof (FileReader) == "undefined") {
        //    SuccessorErrorMessageAlertBox("This browser does not support HTML5.", ModuleName);
        //    fileUpload.val('');
        //    return false;
        //}

        //var filesArr = $("#fileToUpload")[0].files;

        //[].forEach.call(filesArr,function (f) {
        //    var reader = new FileReader();
        //    var fullpathname;
        //    reader.onload = function (e) {
        //        fullpathname = f.name;
        //        $("#tbodygallary").append('<tr><td style="width:100%"><a href = ' + e.target.result + ' style="display:table;color:black" target="_blank">' + f.name + '</a></td><td id="tdImage"><span id="ImageDelete" class="glyphicon glyphicon-remove"></td><td id="hidetd" style = "display:none">' + fullpathname + '</td> <td style = "display:none">' + f.name + '</d> <td style = "display:none">' + setworkspaceid + '</td> </tr>')
        //        filenames1.push(f.name);
        //        filenames2.push(fullpathname);
        //    }
        //    reader.readAsText(f);
        //    //reader.readAsDataURL(f);
        //})
        //$("#fileToUpload").val("");
    });
});

var GetAllParentPRoject = function () {
    var ProjectNoDataTemp =
    {
        cParentChildIndi: "P"
    }
    $.ajax({
        url: BaseUrl + "PmsRecordFetch/AllParentProject", 
        type: 'POST',
        data: ProjectNoDataTemp,
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("Project Not Found !", "DDLProjectNo", ModuleName);
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
                productIds["[ " + jsonObj[i].vProjectNo + " ]" + " " + jsonObj[i].vRequestId] = jsonObj[i].vWorkspaceId;
            }
            $("#DDLProjectNo").autocomplete({
                source: sourceArr,
                change: function (event, ui) {
                },
                select:function(event,ui){
                    $('#DDLProjectNo').blur();
                }
            });
        }
    }
}

function fileUpload() {
    var studytype = $('#ddlProjectType :selected').text();
    var randomizationtype = $('#dllRandomization').val();
    var cApplyBalanceOn = $('#ddlApplyBalanceOn').val();

    if (window.FormData !== undefined) {
        var fileUpload = $("#fileToUpload").get(0);
        var files = fileUpload.files;
        
        var fileData = new FormData();
        
        for (var i = 0; i < files.length; i++) {
            var filename = files[i].name;
            filename = filename.replace(' ', '_');
            fileData.append(filename, files[i]);
        }
        if (productIds[$('#DDLProjectNo').val()] != undefined) {
            setworkspaceid = productIds[$('#DDLProjectNo').val()];
        }

        fileData.append('vWorkSpaceId', setworkspaceid);
        fileData.append('studytype', studytype);
        fileData.append('randomizationtype', randomizationtype);
        fileData.append('cApplyBalanceOn', cApplyBalanceOn);
        fileData.append('vRemark', $('#txtRemarks').val());

        $("#loader").css("display", "block");
        $('.MasterLoader').show();
        $.ajax({
            url: WebUrl + "PmsUploadRandomization/PmsUploadRandomization"  ,
            type: "POST",
            contentType: false, // Not to set any content header  
            processData: false, // Not to process data  
            //data: UploadRandomization,
            data: fileData,
            async: false,
            success: function (result) {
                var tmpresult = result.substring(0, 16);
                var tmpsubjectNo = result.substring(16, result.length);
                if (tmpresult == "strOldSubjectNo:") {
                    var Istrue = confirm("Randomization File Is Already Uploaded For This Project And Subject ( " + tmpsubjectNo + " ). This Upload Will Delete Previous Data. Do You Still Want To Continue ?");
                    if (Istrue == true) {
                        $("#spnRandomizationRatio").attr('disabled', 'disabled');
                        DeleteSubjectFromRandomization(tmpsubjectNo);
                        Update_TreatmentTypeMapping();
                        return true;
                    }
                    else {
                        $("#spnRandomizationRatio").attr('disabled', 'disabled');
                        $('#fileToUpload').val("");
                        return false;
                    }
                }
                else {
                    $("#spnRandomizationRatio").attr('disabled', '');
                    if (GridData.length == 0) {
                        //AddStudySetup(vBalanceRatio, cApplyBalanceOn, $('#txtRemarks').val());
                    }

                    SuccessorErrorMessageAlertBox(result , ModuleName);
                    $('#dllRandomization').val(0).attr("selected", "selected");
                    $('#fileToUpload').val("");
                    $('#txtRemarks').val("");
                    GetRandomizationDetailData();
                    if ($('table#tblUploadRandomization').find('tbody').find('tr').length > 1) {

                    }
                }
            },
            error: function (err) {
                SuccessorErrorMessageAlertBox(err.statusText + " !", ModuleName);
            }
        });
    }
    else {
        SuccessorErrorMessageAlertBox("FormData is not supported. !", ModuleName);
    }
}

$('#btnExitUploadRandomization').on("click", function () {
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
        url: Url,
        type: 'GET',
        async: false,
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("Project Not Found !", "DDLProjectNo", ModuleName);
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

    GetRandomizationDetailData();
    ViewMyProject();
});

function GetRandomizationDetailData() {
    if (productIds[$('#DDLProjectNo').val()] != undefined) {
        setworkspaceid = productIds[$('#DDLProjectNo').val()];
    }
    var projectid = setworkspaceid;
    var PostData = {
        vWorkSpaceId: projectid
    }
    $.ajax({
        url: BaseUrl + "PmsRecordFetch/RandomizationDetailData",
        type: 'POST',
        data: PostData,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("RandomizationDetail Data Is Not Found !", ModuleName);
        }
    });

    function SuccessMethod(jsonData)
    {
        GridData = jsonData;
        var ActivityDataset = [];
        if (jsonData.length > 0)
        {
            $('#remarkmandatory').css('display', '');
            $("#spnRandomizationRatio").css('display', 'none');
            remarksMandatory = true;
            //$("#txtRandomizationRatio").val(jsonData[0].vBalanceRatio);
            $("#ddlApplyBalanceOn").val(jsonData[0].cApplyBalanceOn);
            //$('#txtRandomizationRatio').prop("disabled", true);
            $('#ddlApplyBalanceOn').prop("disabled", true);
        }
        else {
            $('#remarkmandatory').css('display', 'none');
            $("#spnRandomizationRatio").css('display', '');
            remarksMandatory = false;
            //$('#txtRandomizationRatio').prop("disabled", true);
            $('#ddlApplyBalanceOn').prop("disabled", false);
            //$("#txtRandomizationRatio").val("");
            $("#ddlApplyBalanceOn").val("0");
            
        }
        for (var i = 0; i < jsonData.length; i++)
        {
            var InDataset = [];
            var InActive_c;
            InDataset.push('',jsonData[i].vProjectNo, jsonData[i].vProjectTypeName, jsonData[i].cRandomizationType,
                           jsonData[i].Range, jsonData[i].vUploadedBy, jsonData[i].dUploadedOn,
                           jsonData[i].vRemarks, jsonData[i].nFileNo, '');
            ActivityDataset.push(InDataset);
        }
        otable = $('#tblUploadRandomization').dataTable({
            "bJQueryUI": true,
            "sPaginationType": "full_numbers",
            "bLengthChange": true,
            "bProcessing": true,
            "bSort": true,
            "autoWidth": false,
            "aaData": ActivityDataset,
            "bInfo": true,
            "bDestroy": true,
            //"sScrollX": "100%",
            //"sScrollXInner": "1260" ,
            "aaSorting": [],
            "fnCreatedRow": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $('td:eq(0)', nRow).append('<a data-toggle="modal" data-tooltip="tooltip" title="View" data-target="#modalRandomizationRatio" Onclick=RandomizationRatio(this) style="cursor:pointer;"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="glyphicon glyphicon-plus"></i><span>Add Balance Ratio</span></a>');
                $('td:eq(7)', nRow).append('<a data-toggle="modal" data-tooltip="tooltip" title="View" data-target="#DataRandonizationView" Onclick=ViewUploadRandomization(this) nFile="' + aData[8] + '" style="cursor:pointer;"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="fa fa-search"></i><span>View</span></a>');
            },
            "aoColumns": [
                { "sTitle": "Add Balance Ratio" },
                { "sTitle": "Project No" },
                { "sTitle": "Project Type" },
                { "sTitle": "Randomization Type" },
                { "sTitle": "Range" },
                { "sTitle": "Uploaded By" },
                { "sTitle": "Uploaded On" },
                { "sTitle": "Remarks" },
                { "sTitle": "File No" },
                { "sTitle": "Views" },
            ],
            "columnDefs": [
               {
                   "targets": [7,8],
                   "visible": false,
                   "searchable": false
               },
               { "bSortable": false, "targets": [0,7] },
                 
            ],
            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },
        });
    }
}

function ViewUploadRandomization(e) {
    var nFileNo = ""
    var WorkspaceID = "";
    nFileNo = e.attributes.nfile.value;
    var wStr = "vWorkspaceId = " + setworkspaceid + " and nFileNo = '" + nFileNo + "' "
    var WhereData = {
        WhereCondition_1: wStr
    }
    if (setworkspaceid != "") {
        $.ajax({
            url: BaseUrl + "PmsRecordFetch/ViewRandomizationDetailData",
            type: 'POST',
            data: WhereData,
            async: false,
            success: function (data) {
                //$('#tblRandomizationView').attr("IsTable", "has");
                var aaDataSet = [];
                var range = null;
                data = data.Table;
                var srNo = 1;
                for (var Row = 0; Row < data.length; Row++) {
                    var InDataSet = [];
                    InDataSet.push(srNo, data[Row].vProjectNo, data[Row].iMySubjectNo, data[Row].vApplicableVisit, data[Row].vProductType, data[Row].vRandomizationcode, data[Row].vFormulationType);
                    range = " [" + data[0].iMySubjectNo + " - " + data[Row].iMySubjectNo + "]";
                    srNo = srNo + 1;
                    aaDataSet.push(InDataSet);
                }
                $('#lblRANDOMIZATIONDETAILSFOR').text("RANDOMIZATION DETAILS FOR" + range);
                
                otableUploadRandomization = $('#tblRandomizationView').dataTable({
                    "bJQueryUI": true,
                    "sPaginationType": "full_numbers",
                    "bLengthChange": true,
                    "iDisplayLength": 10,
                    "bProcessing": true,
                    "bSort": true,
                    "aaData": aaDataSet,
                    "aaSorting": [],
                    "bInfo": true,
                    "bAutoWidth": false,
                    "bDestroy": true,
                    "aoColumns": [
                        {
                            "sTitle": "#",
                        },
                        { "sTitle": "Project No" },
                        { "sTitle": "Randomization Code" },
                        { "sTitle": "Visit" },
                        { "sTitle": "Product Type" },
                        { "sTitle": "RandomizationCode" },
                        { "sTitle": "Randomization Type" },

                    ],
                    "aoColumnDefs": [
                                { 'bSortable': false, 'aTargets': [0] },
                                {"targets": [5],"visible": false,"searchable": false},
                    ],
                    "oLanguage": {
                        "sEmptyTable": "No Record Found",
                    }
                });
            },
        });
    }
}

function DeleteSubjectFromRandomization(imysubjectno) {
    var objData;
    if ($('#ddlProjectType').val() == "1") {
        var objDataTemp = {
            vUpdateColumnNameWithValue: " cStatusIndi = 'D'",
            WhereCondition_1: " vWorkspaceId = '" + setworkspaceid + "' AND iMySubjectNo IN (" + imysubjectno + ")",
        }
        objData = objDataTemp;

    }
    else {
        var objDataTemp = {
            vUpdateColumnNameWithValue: " cStatusIndi = 'D'",
            WhereCondition_1: " vWorkspaceId = '" + setworkspaceid + "' AND vRandomizationcode IN (" + imysubjectno + ")",
        }
        objData = objDataTemp;
    }
   
    $.ajax({
        url: BaseUrl + "PmsRecordSave/Update_RandomizationDetail",
        type: 'POST',
        data: objData,
        async:false,
        success: SuccessMethod,
        error: function () {
            
        }
    });
    function SuccessMethod(jsonData) {
        if (Validation()) {
            fileUpload();
        }
    }
}

function Update_TreatmentTypeMapping() {
    var objDataTemp = {
        vUpdateColumnNameWithValue: " cStatusIndi = 'D'",
        WhereCondition_1: " vWorkspaceId = '" + setworkspaceid ,
    }
    $.ajax({
        url: BaseUrl + "PmsRecordSave/Update_TreatmentTypeMapping",
        type: 'POST',
        data: objDataTemp,
        async: false,
        success: SuccessMethod,
        error: function () {

        }
    });
    function SuccessMethod(jsonData) {
        
    }
}

$('#btnSaveUploadRandomization').on("click", function () {
    var SubjectRandomize = true;
    //var wStr = "vParentWorkSpaceID = " + setworkspaceid + " and ISNULL(vRandomizationNo,'') <> ''"
    //var WhereData = {
    //    WhereCondition_1: wStr,
    //    columnName_1: "COUNT(*) as [TotalCount]"
    //}
    //if (setworkspaceid != "") {
    //    $.ajax({
    //        url: BaseUrl + "PmsRecordFetch/View_WorkspaceSubjectMst",
    //        type: 'POST',
    //        data: WhereData,
    //        async: false,
    //        success: function (data) {
    //            data = data.Table;
    //            if (data[0].TotalCount != 0) {
    //                SuccessorErrorMessageAlertBox("You Can Not Upload File, Because Subjectis Randomized As Per Uploded File !", ModuleName);
    //                SubjectRandomize = false;
    //            }
    //        }
    //    });
    //}

    if (SubjectRandomize == true) {
        if (Validation()) {
            fileUpload();
        }
    }
});

function Validation() {
    if (isBlank(document.getElementById('DDLProjectNo').value)) {
        ValidationAlertBox("Please Select Project Number !", "DDLProjectNo", ModuleName);
        return false;
    }
    if (Dropdown_Validation(document.getElementById("ddlProjectType"))) {
        ValidationAlertBox("Please Select Study Type !", "ddlProjectType", ModuleName);
        return false;
    }
    if (Dropdown_Validation(document.getElementById("dllRandomization"))) {
        ValidationAlertBox("Please Select Randomization Type !", "dllRandomization", ModuleName);
        return false;
    }
    if (Dropdown_Validation(document.getElementById("ddlApplyBalanceOn"))) {
        ValidationAlertBox("Please Select Apply Balance On !", "ddlApplyBalanceOn", ModuleName);
        return false;
    }
    if (isBlank($('#fileToUpload').val())) {
        ValidationAlertBox("Please Select File !", "fileToUpload", ModuleName);
        return false;
    }
    if (remarksMandatory == true && isBlank($('#txtRemarks').val())) {
        ValidationAlertBox("Please Enter Remarks !", "txtRemarks", ModuleName);
        return false;
    }
    return true;
}

function clearControl()
{
    $('#dllRandomization').val(0).attr("selected", "selected");
    $('#fileToUpload').val("");
    $('#txtRemarks').val("");
    $('#DDLProjectNo').val("");
    $('#ddlProjectType').val(0).attr("selected", "selected");

    if (GridData.length == 0) {
        $('#ddlApplyBalanceOn').val("0");
        //$('#txtRandomizationRatio').val("");
    }
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
                $('#ddlProjectType').prop("disabled", true);
                if (data.length != 0) {
                    $("#ddlProjectType").append($("<option selected='selected'></option>").val(data[0].vProjectTypeCode).html(data[0].vProjectTypeName));
                    
                }
            }
        });
    }
}

function addMoreRows() {
    if (Dropdown_Validation(document.getElementById("ddlTreatmentType"))) {
        ValidationAlertBox("Please Select Treatment Type !", "ddlTreatmentType", ModuleName);
        return false;
    }

    if (Dropdown_Validation(document.getElementById("ddlProductType"))) {
        ValidationAlertBox("Please Select Product Type !", "ddlProductType", ModuleName);
        return false;
    }

    if (isBlank(document.getElementById('txtProductTypeRatio').value)) {
        ValidationAlertBox("Please Enter Randomization Ratio !", "txtProductTypeRatio", ModuleName);
        return false;
    }

    var MyRows = $('table#tblProductTypeRandomizationRatio').find('tbody').find('tr');
    for (var i = 0; i < MyRows.length; i++)
    {
        var ProductTypeValue = $(MyRows[i]).find('td:eq(1)').html();
        var TreatmentTypeValue = $(MyRows[i]).find('td:eq(0)').html();

        if (TreatmentTypeValue == $("#ddlTreatmentType :selected").text()) {
            ValidationAlertBox("This Treatment Type Already Added !", "ddlTreatmentType", ModuleName);
            return false;
        }



        if (TreatmentTypeValue == $("#ddlTreatmentType :selected").text()) {
            if (ProductTypeValue == $("#ddlProductType :selected").text()) {
                ValidationAlertBox("This Product Type Already Added !", "ddlProductType", ModuleName);
                return false;
            }
        }
    }

    var strdata;
    strdata += "<tr>";
    strdata += "<td align='center'>" + $("#ddlTreatmentType :selected").text() + "</td>";
    strdata += "<td align='center'>" + $("#ddlProductType :selected").text() + "</td>";
    strdata += "<td align='center'>" + $("#txtProductTypeRatio").val() + "</td>";
    strdata += "<td id='trRemove' align='center'><span class='glyphicon glyphicon-remove' title='Remove'></span></td>";
    strdata += "<td class='hidetd'>" + $("#ddlProductType :selected").text() + " - " + $("#txtProductTypeRatio").val() + "</td>";
    strdata += "<td class='hidetd'>" + $("#ddlProductType").val() + "</td>";
    strdata += "</tr>";
    $("#tbodyProductTypeRandomizationRatio").append(strdata);
    $("#tblProductTypeRandomizationRatio thead").show();
    $("#tblProductTypeRandomizationRatio").show();
    $(".hidetd").hide();
    $("#txtProductTypeRatio").val("");
    $("#ddlProductType").val("0");
    $("#ddlTreatmentType").val("0");
    $("#btnSaveRandomization").show();
}

function GetProductType() {
    var GetProductType = {
        Url: BaseUrl + "PmsGeneral/GetProductType/" + setworkspaceid,
        SuccessMethod: "SuccessMethod"
    }

    $.ajax({
        url: GetProductType.Url,
        type: 'GET',
        async: false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Product Type Not Found !", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        $("#ddlProductType").empty().append('<option selected="selected" value="0">Please Select Product Type</option>');
        for (var i = 0; i < jsonData.length; i++) {
            $("#ddlProductType").append($("<option></option>").val(jsonData[i].nProductTypeID).html(jsonData[i].vProductType));
        }
    }
}

$("#tblProductTypeRandomizationRatio").on('click', '#trRemove', function () {
    $(this).closest('tr').remove();
    if ($("#tblProductTypeRandomizationRatio tr").length == 1) {
        $("#tblProductTypeRandomizationRatio").hide();
        $("#btnSaveRandomization").attr("style", "display:none");
    }
    else {
        $("#tblProductTypeRandomizationRatio").show();
        $("#btnSaveRandomization").attr("style", "display:inline");
    }
});

$("#btnSaveRandomization").on("click", function () {
    var MyRows = $('table#tblProductTypeRandomizationRatio').find('tbody').find('tr');
    var RandomizationRatio = "";
    var TreatmentType = "";
    var nProductTypeID = "";
    for (var i = 0; i < MyRows.length; i++) {
        var ProductTypeRatio = $(MyRows[i]).find('td:eq(4)').html();
        RandomizationRatio += ProductTypeRatio + ":"
        TreatmentType += $(MyRows[i]).find('td:eq(0)').html() + "-"
        nProductTypeID += $(MyRows[i]).find('td:eq(5)').html() + "-"
    }

    RandomizationRatio += "-"
    RandomizationRatio = RandomizationRatio.replace(":-", "");
    UpdateRandomzationDetail(RandomizationRatio, nProductTypeID,TreatmentType);
    AddStudySetup(RandomizationRatio, $("#ddlApplyBalanceOn").val(), "", TreatmentType, nProductTypeID);
});

function AddStudySetup(vBalanceRatio, cApplyBalanceOn, Remarks, TreatmentType,nProductTypeID) {
    var StudySetUp = {};
    var StudySetUpResult = [];
    var BalanceRatio = vBalanceRatio.split(":");
    var FormulationType = TreatmentType.split("-");

    var ProductTypeID = nProductTypeID.split("-");

    for (var i = 0; i < BalanceRatio.length; i++)
    {
        StudySetUp = {
            vWorkSpaceID: setworkspaceid,
            vRandomizationRatio: BalanceRatio[i],
            cApplyBalanceOn: cApplyBalanceOn,
            vRemarks: Remarks,
            iModifyBy: $("#hdnuserid").val(),
            DATAOPMODE: "1",
            vProjectTypeCode: $("#ddlProjectType").val(),
            vFormulationType: FormulationType[i],
            nProductTypeID : ProductTypeID[i],
        }
        StudySetUpResult.push(StudySetUp);
    }

    $.ajax({
        url: BaseUrl + "PmsRecordSave/Save_StudyProductDesign",
        type: 'POST',
        data: { '': StudySetUpResult },
        async: false,
        success: function (data) {
            SuccessorErrorMessageAlertBox("Balance Ratio Saved Successfully !", ModuleName);
            $('#modalRandomizationRatio').modal('hide');
            //UpdateRandomzationDetail();
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Error !", ModuleName);
        }
    });
}

function RandomizationRatio() {
    var PostData = {
        WhereCondition_1: "vWorkSpaceId = '" + setworkspaceid + "' order by dModifyOn",
        columnName_1: 'vFormulationType,vRandomizationRatio',
    }

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/View_StudyProductDesignMst",
        type: 'POST',
        data: PostData,
        success: SuccessMethod,
        async: false,
        error: function () {
            SuccessorErrorMessageAlertBox("Data Not Found !", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        jsonData = jsonData.Table;

        
        
        $("#tbodyProductTypeRandomizationRatio").html("");
        if (jsonData.length != 0) {
            $("#divBalanceRatio").attr("style", "display:none");
            var strdata;
            for (var i = 0; i < jsonData.length; i++) {
                var RandomizationRatio = jsonData[i].vRandomizationRatio.split("-")
                strdata += "<tr>";
                strdata += "<td align='center'>" + jsonData[i].vFormulationType + "</td>";
                strdata += "<td align='center'>" + RandomizationRatio[0] + "</td>";
                strdata += "<td align='center'>" + RandomizationRatio[1] + "</td>";
                strdata += "<td class= 'hidetd' id='trRemove' align='center'><span class='glyphicon glyphicon-remove' title='Remove'></span></td>";
                strdata += "</tr>";
            }
           
            $("#tbodyProductTypeRandomizationRatio").append(strdata);
            $("#tblProductTypeRandomizationRatio thead").show();
            $("#tblProductTypeRandomizationRatio").show();
            $(".hidetd").hide();
            $(".hideremove").hide();
            $("#btnSaveRandomization").attr("style", "display:none");

        }
        else {
        $("#divBalanceRatio").attr("style", "display:inline");
        GetProductType();
        GetTreatmentTYpe();
        $("#tblProductTypeRandomizationRatio thead").hide();
        $("#tblProductTypeRandomizationRatio tbody tr").remove();
        $("#btnSaveRandomization").hide();
        $("#txtProductTypeRatio").val("");
        $("#ddlProductType").val("0");
        $(".hideremove").show();
        }
    }

    //$('#modalRandomizationRatio').modal('show');
}

function GetTreatmentTYpe()
{
    if (productIds[$('#DDLProjectNo').val()] != undefined) {
        setworkspaceid = productIds[$('#DDLProjectNo').val()];
    }
    var projectid = setworkspaceid;
    var PostData = {
        WhereCondition_1: "vWorkSpaceID = '" + setworkspaceid + "' and cStatusIndi <> 'D' order by vFormulationType desc",
        columnName_1: "DISTINCT vFormulationType"
    }
    $.ajax({
        url: BaseUrl + "PmsRecordFetch/ViewRandomizationDetailData",
        type: 'POST',
        data: PostData,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("RandomizationDetail Data Is Not Found !", ModuleName);
        }
    });

    function SuccessMethod(jsonData)
    {
        jsonData = jsonData.Table;
        $("#ddlTreatmentType").empty().append('<option selected="selected" value="0">Please Select Treatment Type</option>');
        for (var i = 0; i < jsonData.length; i++) {
            $("#ddlTreatmentType").append($("<option></option>").val(jsonData[i].vFormulationType).html(jsonData[i].vFormulationType));
        }
    }
}

function UpdateRandomzationDetail(RandomizationRatio, nProductTypeID, TreatmentType) {
    var RandomationDetail = {};
    var RandomationDetailResult = [];
    var BalanceRatio = RandomizationRatio.split(":");
    var ProductTypeID = nProductTypeID.split("-");
    var FormulationType = TreatmentType.split("-");

    for (var i = 0; i < BalanceRatio.length; i++) {
        RandomationDetail = {
            vWorkSpaceID: setworkspaceid,
            nProductTypeID: ProductTypeID[i],
            DATAOPMODE: 2,
            vFormulationType: FormulationType[i],
        }
        RandomationDetailResult.push(RandomationDetail);
    }

    $.ajax({
        url: BaseUrl + "PmsRecordSave/Update_RandomizationDetailProductType",
        type: 'POST',
        data: { '': RandomationDetailResult },
        async: false,
        success: function (data) {
        },
        error: function () {
            SuccessorErrorMessageAlertBox("Error !", ModuleName);
        }
    });
}

