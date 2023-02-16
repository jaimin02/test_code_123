var iUserNo;
var productIds = new Object();
var filenames1 = [];
var filenames2 = [];
var pathname;
var setworkspaceid;
var viewmode;
var ModuleName = "Document Master";
var nFileNo;

$(document).ready(function () {
    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('.modal').modal('hide');

    CheckSetProject();
    GetViewMode();

    if (setworkspaceid != undefined) {
        $('#fileToUpload').prop("disabled", false);
    }
    else {
        $('#fileToUpload').attr("disabled", "disabled");
    }
    var GetAllOperationData = {
        Url: BaseUrl + "PmsReason/GetOperationTypeDataTable/",
        SuccessMethod: "SuccessMethod",
    }
    GetOprationDetailMaster(GetAllOperationData.Url, GetAllOperationData.SuccessMethod)

    if (setworkspaceid != undefined) {
        GetDocumentData();
    }

});

var GetOprationDetailMaster = function (Url, SuccessMethod) {
    $.ajax({
        url: Url,
        type: 'GET',
        success: SuccessMethod,
        error: function () {

        }
    });
    function SuccessMethod(jsonData) {
        var strdata = "";
        if (jsonData.length > 0) {
            var ActivityDataset = [];
            $("#DDLOperation").empty();
            for (var i = 0; i < jsonData.length; i++) {
                if (jsonData.length > 0) {
                    $("#DDLOperation").empty().append('<option selected="selected" value="0">Please Select Operation</option>');
                    for (var i = 0; i < jsonData.length; i++)
                        $("#DDLOperation").append($("<option></option>").val(jsonData[i].vOperationCode).html([jsonData[i].vOperationName]));

                }
                else {
                    $("#DDLOperation").empty().append('<option selected="selected" value="0">Please Select Operation</option>');
                }

            }
        }
    }
}

$(function () {
    var GetPmsDocMasterProjectNo = {
        Url: BaseUrl + "PmsProductBatch/GetProjectNo",
        SuccessMethod: "SuccessMethod",
    }

    $('#DDLProjectNo').on('change keyup paste mouseup', function () {
        if ($('#DDLProjectNo').val().length == 2) {
            var ProjectNoDataTemp = {
                vProjectNo: $('#DDLProjectNo').val(),
                iUserId: $("#hdnuserid").val(),
                vProjectTypeCode: $("#hdnscopevalues").val(),
            }
            GetAllPmsDocMasterProjectNo(GetPmsDocMasterProjectNo.Url, GetPmsDocMasterProjectNo.SuccessMethod, ProjectNoDataTemp);

        }
        else if ($('#DDLProjectNo').val().length < 2) {
            $("#DDLProjectNo").autocomplete({
                source: "",
                change: function (event, ui) { }
            });
        }
    });

    $("#fileToUpload").change(function (e) {
        $("#tblgallary").show();
        var files = e.target.files;
        var filesArr = Array.prototype.slice.call(files);
        var filename = filesArr[0].name;
        var split = filename.split(".");
        var extension = split[1];

        if (extension == "msi" || extension == "msm" ||
            extension == "msp" || extension == "mst" ||
            extension == "idt" || extension == "cub" ||
            extension == "pcp" || extension == "exe" ||
            extension == "zip" || extension == "rar") {
            SuccessorErrorMessageAlertBox("Selected file format is not supported.", ModuleName);
            $("#fileToUpload").val("");
            return false;
        }

        fileUpload();
        if (productIds[$('#DDLProjectNo').val()] != undefined) {
            setworkspaceid = productIds[$('#DDLProjectNo').val()];
        }
        filesArr.forEach(function (f) {
            var reader = new FileReader();
            var fullpathname;
            reader.onload = function (e) {
                fullpathname = pathname.concat(f.name);
                $("#tbodygallary").append('<tr><td style="width:100%"><a href = ' + e.target.result + ' style="display:table;color:black" target="_blank">' + f.name + '</a></td><td id="tdImage"><span id="ImageDelete" class="glyphicon glyphicon-remove"></td><td id="hidetd" style = "display:none">' + fullpathname + '</td> <td style = "display:none">' + f.name + '</d> <td style = "display:none">' + setworkspaceid + '</td> </tr>')
                filenames1.push(f.name);
                filenames2.push(fullpathname);
            }
            reader.readAsDataURL(f);
        })
        $("#fileToUpload").val("");
    });

    $("#btnSavePmsDocumentMaster").on("click", function () {
        
        //document.getElementById('btnSavePmsDocumentMaster').style.visibility = "hidden";

        var HTMLtbl =
            {
                getData: function (table) {
                    var data = [];
                    table.find('tr').each(function (rowIndex, r) {
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
        if (productIds[$('#DDLProjectNo').val()] != undefined) {
            setworkspaceid = productIds[$('#DDLProjectNo').val()];
        }
        var data = HTMLtbl.getData($('#tblgallary'));
        var operationCode = $('#DDLOperation').val();
        var RefNo = $('#txtRefeNo').val();
        var Discription = $('#txtDescription').val();
        var Remarks = $('#txtRemarks').val();
        
        if (setworkspaceid == "") {
            ValidationAlertBox("Please select Project .", "DDLProjectNo", ModuleName);
            return false;
        }

        if (validateform() == false) {
            return false;
        }
        else {
            for (i = 0; i < data.length; i++) {
                var storedata = data[i];
                var filename = storedata[0];
                filename = filename.replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_');
                var FileUploadData = {
                    vWorkSpaceID: setworkspaceid,
                    vOperationCode: operationCode,
                    vRefNo: RefNo,
                    vDescription: Discription,
                    vFilePath: "../Documents/" + setworkspaceid + "/" + filename,
                    vRemark: Remarks,
                    iModifyBy: $("#hdnuserid").val(),
                    DATAOPMODE: 1
                }

                var InsertFileUploadPath = {
                    Url: BaseUrl + "PmsDocumentMaster/FileUpload",
                    SuccessMethod: "SuccessMethod",
                    Data: FileUploadData
                }
                InsertPmsDocumentMaster(InsertFileUploadPath.Url, InsertFileUploadPath.SuccessMethod, InsertFileUploadPath.Data);
            }
            ClearField();
            SuccessorErrorMessageAlertBox("File uploaded successfully .", ModuleName);
        }
    });

    $("#DDLProjectNo").on("blur", function () {
        GetDocumentData();
        if ($("#DDLProjectNo").val() != "") {
            $(".clsPmsDocMasterData").show();
        }
    });

});

function GetDocumentData() {
    ClearField();
    if (productIds[$('#DDLProjectNo').val()] != undefined) {
        setworkspaceid = productIds[$('#DDLProjectNo').val()];
    }
    if (setworkspaceid == undefined) {
        return false;
    }
    var Data = {
        id: setworkspaceid,
        projectno: $("#hdnuserid").val()
    }
    var GetFileName = {
        //Url: BaseUrl + "PmsDocumentMaster/GetFilePathDataProjectWise/" + productIds[$('#DDLProjectNo').val()] + "",
        Url: BaseUrl + "PmsDocumentMaster/GetFilePathDataProjectWise/",
        SuccessMethod: "SuccessMethod",
        Data: Data
    }
    GetAllFilePathProjectWise(GetFileName.Url, GetFileName.SuccessMethod, GetFileName.Data);
    if (setworkspaceid != undefined) {
        $('#fileToUpload').prop("disabled", false);
    }
    else {
        $('#fileToUpload').attr("disabled", "disabled");
    }

    $('#tblgallary tr').each(function () {
        var filename = $(this).find("td").eq(3).html();
        var workspaceId = $(this).find("td").eq(4).html();
        DeleteFile(filename, workspaceId);
        $(this).closest('tr').remove();
    });
}

var GetAllFilePathProjectWise = function (Url, SuccessMethod, Data) {
    $.ajax({
        url: Url,
        type: 'GET',
        data: Data,
        async: false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Not found .", ModuleName);
        }
    });

    function SuccessMethod(jsonData) {
        var strdata = "";
        var ActivityDataset = [];
        for (var i = 0; i < jsonData.length; i++) {
            var InDataset = [];
            var srno = i + 1;
            var imagename = jsonData[i].vFilePath.split("/");
            var InActive_c;
            if (viewmode == "OnlyView") {
                InActive_c = '<a data-tooltip="tooltip" title="Inactive" class="disabled"><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="glyphicon glyphicon-remove"></i> <span>Inactive</span></a>';
            }
            else {
                InActive_c = '<a href="Javascript:void(0);" data-tooltip="tooltip1" title="Inactive" class="clsEdit" onclick=PmsDocumentMasterDelete(this) id="' + jsonData[i].nFileNo + '" imagename="' + jsonData[i].vFilePath + '"  ><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="glyphicon glyphicon-remove"></i> <span>Inactive</span></a>'
            }


            InDataset.push(jsonData[i].nFileNo, jsonData[i].vProjectNo, jsonData[i].vOperationName, jsonData[i].vRefNo, jsonData[i].vDescription, '', jsonData[i].vFilePath, jsonData[i].vRemark, jsonData[i].iModifyBy, jsonData[i].dModifyOn, InActive_c, imagename[3], jsonData[i].cStatusIndi);
            ActivityDataset.push(InDataset);
        }
        otable = $('#tblPmsDocMasterData').dataTable({
            "bJQueryUI": true,
            "sPaginationType": "full_numbers",
            "bLengthChange": true,
            "iDisplayLength": 10,
            "bProcessing": true,
            "bSort": true,
            "autoWidth": true,
            "aaData": ActivityDataset,
            "bInfo": true,
            "bDestroy": true,
            "fnCreatedRow": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $('td:eq(4)', nRow).append('<u><a href = ' + aData[6] + ' style="display:table;" target="_blank">' + aData[11] + '</a></u>');
                //$('td:eq(7)', nRow).append('<a href="Javascript:void(0);" data-tooltip="tooltip1" title="In-Active" class="clsEdit" onclick=PmsDocumentMasterDelete(this) id="' + aData[0] + '" imagename="' + aData[5] + '"  ><i class="btn btn-primary btn-rounded btn-ef btn-ef-5 btn-ef-5a"><i class="glyphicon glyphicon-remove"></i> <span>In-Active</span></a>');
                if (aData[12] == 'D') {
                    $(nRow).addClass('highlight');
                    $('td', nRow).eq(8).addClass('disabled');
                    $('td', nRow).eq(4).addClass('disabled');
                }
            },
            "aoColumns": [
                        //{ "sTitle": "Sr No" },
                        { "sTitle": "File No" },
                        { "sTitle": "Project No" },
                        { "sTitle": "Operation Name" },
                        { "sTitle": "Ref No" },
                        { "sTitle": "Description" },
                        { "sTitle": "File Name" },
                        { "sTitle": "File Path" },
                        { "sTitle": "Remarks" },
                        { "sTitle": "Modify By" },
                        { "sTitle": "Modify On" },
                        { "sTitle": "Inactive" },
                        { "sTitle": "ImageName" },
                        

            ],
            "columnDefs": [
                   {
                       "targets": [0, 6, 11],
                       "visible": false,
                       "searchable": false,
                   },
                    { "width": "15px", "targets": 10 },
            ],

            "oLanguage": {
                "sEmptyTable": "No Record Found",
            },

        });

    }
}

var GetAllPmsDocMasterProjectNo = function (Url, SuccessMethod) {
    var ProjectNoDataTemp =
    {
        vProjectNo: "",
        iUserId: $("#hdnuserid").val(),
        vProjectTypeCode: $("#hdnscopevalues").val(),
    }

    $.ajax({
        url: Url,
        type: 'GET',
        data: { id: ProjectNoDataTemp.iUserId, projectno: ProjectNoDataTemp.vProjectNo, typecode: ProjectNoDataTemp.vProjectTypeCode },
        async: false,
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("Project not found.", "DDLProjectNo", ModuleName);
        }
    });
    function SuccessMethod(jsonData) {
        var strdata = "";
        if (jsonData.length > 0) {
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
}

var InsertPmsDocumentMaster = function (Url, SuccessMethod, Data) {
    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        async: false,
        success: SuccessInsertData,
        error: function () {
            ValidationAlertBox("Error in file upload .", "DDLProjectNo", ModuleName);
            return false;
        }
    });

    function SuccessInsertData(response) {

        $("#tblgallary tbody tr").remove();
        $("#tblgallary thead").hide();
        if (productIds[$('#DDLProjectNo').val()] != undefined) {
            setworkspaceid = productIds[$('#DDLProjectNo').val()];
        }
        var Data = {
            id: setworkspaceid,
            projectno: $("#hdnuserid").val()
        }
        var GetFileName = {
            Url: BaseUrl + "PmsDocumentMaster/GetFilePathDataProjectWise/" + setworkspaceid + "",
            SuccessMethod: "SuccessMethod",
            Data: Data
        }
        GetAllFilePathProjectWise(GetFileName.Url, GetFileName.SuccessMethod, GetFileName.Data);
    }
}

function fileUpload() {
    if (window.FormData !== undefined) {

        var fileUpload = $("#fileToUpload").get(0);
        var files = fileUpload.files;

        // Create FormData object  
        var fileData = new FormData();
        // Looping over all files and add it to FormData object  
        for (var i = 0; i < files.length; i++) {
            var filename = files[i].name;
            filename = filename.replace(' ', '_');
            fileData.append(filename, files[i]);
        }
        if (productIds[$('#DDLProjectNo').val()] != undefined) {
            setworkspaceid = productIds[$('#DDLProjectNo').val()];
        }

        $.ajax({
            url: WebUrl + "PmsDocumentMaster/PmsDocumentUpload/" + setworkspaceid,
            type: "POST",
            contentType: false, // Not to set any content header  
            processData: false, // Not to process data  
            data: fileData,
            async: false,
            success: function (result) {
                pathname = result;
            },
            error: function (err) {
                SuccessorErrorMessageAlertBox(err.statusText + " .", ModuleName);
            }
        });
    }
    else {
        SuccessorErrorMessageAlertBox("FormData is not supported. ", ModuleName);
    }
}

$("#tblgallary").on('click', '#tdImage', function () {
    var filename = $(this).closest('tr').find('td:eq(0)').text();
    if (productIds[$('#DDLProjectNo').val()] != undefined) {
        setworkspaceid = productIds[$('#DDLProjectNo').val()];
    }
    filenames1.splice($.inArray(filename, filenames1), 1);
    $(this).closest('tr').remove();
    DeleteFile(filename, setworkspaceid);
});

function DeleteFile(FileName, workspaceId) {
    $.ajax({
        url: '/PmsDocumentMaster/FileDelete',
        type: "POST",
        async: false,
        data: { filename: FileName, id: workspaceId },
        success: function (result) {
        },
        error: function (err) {
            SuccessorErrorMessageAlertBox(err.statusText+ " .", ModuleName);
        }
    });
}



//function PmsDocumentMasterDelete(e) {
//    var imagename = $(e).attr("imagename")
//    var id = $(e).attr("id")
//    var result = confirm('Are you sure you want to Inactive ' + imagename + ' File?');
//    if (result) {

//        var FileDelete =
//        {
//            nFileNo: id,
//            DATAOPMODE: 3
//        }

//        var InActiveFileUpload = {
//            Url: BaseUrl + "PmsDocumentMaster/FileUpload",
//            SuccessMethod: "SuccessMethod",
//            Data: FileDelete
//        }
//        InsertPmsDocumentMaster(InActiveFileUpload.Url, InActiveFileUpload.SuccessMethod, InActiveFileUpload.Data);
//        if (productIds[$('#DDLProjectNo').val()] != undefined) {
//            setworkspaceid = productIds[$('#DDLProjectNo').val()];
//        }
//        var Data = {
//            id: setworkspaceid,
//            projectno: $("#hdnuserid").val()
//        }
//        var GetFileName = {
//            Url: BaseUrl + "PmsDocumentMaster/GetFilePathDataProjectWise/" + setworkspaceid + "",
//            SuccessMethod: "SuccessMethod",
//            Data: Data
//        }
//        GetAllFilePathProjectWise(GetFileName.Url, GetFileName.SuccessMethod, GetFileName.Data);
//        //alert("File Deleted Successfully !!")
//    }
//    else {
//        return false;
//    }

//}

function PmsDocumentMasterDelete(e) {
 
    nFileNo = $(e).attr("id");
    var filePath = $(e).attr("imagename");
    $("#DocumentMasterInctive").modal('show');
}

$("#btnInActiveSave").on("click", function () {
    if (isBlank(document.getElementById('txtReason').value)) {
        ValidationAlertBox("Please enter remarks for inactive Storage Type.", "txtReason", ModuleName);
        return false;
    }

    var FileDelete =
          {
              nFileNo: nFileNo,
              DATAOPMODE: 3,
              vRemark: $("#txtReason").val()
          }

          var InActiveFileUpload = {
              Url: BaseUrl + "PmsDocumentMaster/FileUpload",
              SuccessMethod: "SuccessMethod",
              Data: FileDelete
          }
          InsertPmsDocumentMaster(InActiveFileUpload.Url, InActiveFileUpload.SuccessMethod, InActiveFileUpload.Data);
          if (productIds[$('#DDLProjectNo').val()] != undefined) {
              setworkspaceid = productIds[$('#DDLProjectNo').val()];
          }
          var Data = {
              id: setworkspaceid,
              projectno: $("#hdnuserid").val()
          }
          var GetFileName = {
              Url: BaseUrl + "PmsDocumentMaster/GetFilePathDataProjectWise/" + setworkspaceid + "",
              SuccessMethod: "SuccessMethod",
              Data: Data
          }
          GetAllFilePathProjectWise(GetFileName.Url, GetFileName.SuccessMethod, GetFileName.Data);
          SuccessorErrorMessageAlertBox("Document Master inactivated successfully.", ModuleName);

});

$("#btnInActiveClose").on("click", function () {
    //$("#txtStorageType").val("");
    //$("#txtRemarks").val("");
    //$("#txtRemarks").hide();
    //$("#spnPmsStorageType").text('Save');
    $("#DocumentMasterInctive").modal('hide');
});

$("#btnClearPmsDocumentMaster").on("click", function () {
    $('#DDLProjectNo').val('');
    ClearField();
    if (document.getElementById("DDLProjectNo").selectedIndex = "0") {
        $('.clsPmsDocMasterData').hide();
    }
});

$('#btnExitPmsDocumentMaster').on("click", function () {
    ConfirmAlertBox(ModuleName, $("#RedirectToHome").val());
});
function ClearField() {
    document.getElementById("DDLOperation").selectedIndex = "0"
    //$("#DDLOperation").val("0");
    $('#txtDescription').val('');
    $('#txtRefeNo').val('');
    $('#txtRemarks').val('');

    $('#tblgallary tr').each(function () {
        var filename = $(this).find("td").eq(3).html();
        var workspaceId = $(this).find("td").eq(4).html();
        DeleteFile(filename, workspaceId);
        $(this).closest('tr').remove();
    });
}
function validateform() {
    if (isBlank(document.getElementById('DDLProjectNo').value)) {
        ValidationAlertBox("Please select Project No .", "DDLProjectNo", ModuleName);
        return false;
    }
    else if ((document.getElementById('DDLOperation').selectedIndex == 0)) {
        ValidationAlertBox("Please select Operation. ", "DDLOperation", ModuleName);
        return false;
    }
    else if (tbodygallary.children.length == 0) {
        ValidationAlertBox("At least one File is needed for database attach. ", "DDLOperation", ModuleName);
        return false;
    }
    return true;
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
        dataType: "json",
        async: false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Project not found.", ModuleName);
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

//function GetViewMode() {
//    var ViewModeIDWebConfig = $("#hdnViewModeID").val().split(",");
//    for (i = 0; i < ViewModeIDWebConfig.length; i++) {
//        if ($("#hdnUserTypeCode").val().trim() == ViewModeIDWebConfig[i]) {
//            document.getElementById('btnSavePmsDocumentMaster').style.visibility = "hidden";
//            $('#fileToUpload').prop('disabled', true);
//            viewmode = "OnlyView";
//            break;
//        }
//        else {
//            viewmode = "";
//        }
//    }
//}
