var productIds = new Object();
var vWorkSpaceId;
var nSetProjectNo;
var vProjectNo = "";
var ModuleName = "Set Project"

$(document).ready(function ()
{
    CheckSetProject();
    var GetProjectNo =
    {
        Url: BaseUrl + "PmsGeneral/GetScopeWiseProject",
        SuccessMethod: "SuccessMethod"
    }
    $('#ddlProjectNo').on('change keyup', function () {
        if ($('#ddlProjectNo').val().length == 2) {
            var ProjectNoDataTemp = {
                //vProjectNo: $('#ddlProjectNo').val(),
                iUserId: $("#hdnuserid").val(),
                vStudyCode: $('#ddlProjectNo').val()
                //vProjectTypeCode: $("#hdnscopevalues").val(),
            }
            GetPmsProjectNoProductReceipt(GetProjectNo.Url, GetProjectNo.SuccessMethod, ProjectNoDataTemp);
        }
        else if ($('#ddlProjectNo').val().length < 2) {
            $("#ddlProjectNo").autocomplete({
                source: "",
                change: function (event, ui) { },
                select: function (event, ui) {
                    vProjectNo = ui.item.value;
                    $('#ddlProjectNodashboard').val(vProjectNo);
                },
            });
        }
    });

    $('#btnSetProject').on('click', function () {
        $("#loader").attr("style", "display:block");
        if ($('#ddlProjectNo').val() != "") {
            if ((nSetProjectNo != "" && nSetProjectNo != undefined)) {
                InsertSetProjectData();
            }
            else if (productIds[$('#ddlProjectNo').val()] != "") {
                InsertSetProjectData();
            }
           
        }
        else {
            ValidationAlertBox("Please enter Project No.", "ddlProjectNo", ModuleName);
            $("#loader").attr("style", "display:none");
            return false;
        }
        $("#loader").attr("style", "display:none");

    });

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
        var jsonObj = jsonData;
        var sourceArr = [];
        if (jsonData.length > 0) {
            $('#btnSetProject').val('UnSetProject');
            document.getElementById("btnSetProject").innerHTML = "Unset Project";
            vWorkSpaceId = jsonData[0].vWorkSpaceId;
            nSetProjectNo = jsonData[0].nSetProjectNo;
            $('#ddlProjectNo').val(jsonData[0].vProjectNo);
            $('#ddlProjectNo').prop('disabled', true);
        }
        else {
            $('#btnSetProject').val('SetProject');
            document.getElementById("btnSetProject").innerHTML = "Set Project";
            vWorkSpaceId = "";
            $('#ddlProjectNo').val('');
            $('#ddlProjectNo').prop('disabled', false);
        }

    }

}

var GetPmsProjectNoProductReceipt = function (Url, SuccessMethod, ProjectNoDataTemp) {

    $.ajax({
        url: Url,
        type: 'GET',
        data: { iUserId: ProjectNoDataTemp.iUserId, vStudyCode: ProjectNoDataTemp.vStudyCode },
        async: false,
        success: SuccessMethod,
        error: function () {
            SuccessorErrorMessageAlertBox("Project not found.", ModuleName);
            
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
            change: function (event, ui) { }
        });

    }
}

var InsertSetProjectData = function () {
    var btntext = document.getElementById("btnSetProject").value
    if (btntext == "SetProject") {
        var PassData = {
            iUserId: $("#hdnuserid").val(),
            vWorkSpaceId: productIds[$('#ddlProjectNo').val()],
            vProjectNo: $('#ddlProjectNo').val(),
            DATAOPMODE: 1

        }

        var UrlDetails =
        {
            Url: BaseUrl + "PmsGeneral/Insert_SetProjectMst",
            SuccessMethod: "SuccessMethod"
        }

        $.ajax({
            url: UrlDetails.Url,
            type: 'POST',
            data: PassData,
            async: false,
            success: Successfully,
            error: function () {
                SuccessorErrorMessageAlertBox("Failed to set project.", ModuleName);
                
            }
        });
        function Successfully(jsonData) {
            var jsonObj = jsonData;
            var sourceArr = [];
            if (jsonData.length > 0) {
                $('#btnSetProject').val('UnSetProject');
                document.getElementById("btnSetProject").innerHTML = "Unset Project";
                vWorkSpaceId = jsonData[0].vWorkSpaceId;
                nSetProjectNo = jsonData[0].nSetProjectNo;
                $('#ddlProjectNo').val(jsonData[0].vProjectNo);
                $('#ddlProjectNo').prop('disabled', true);
            }
        }
    }
    else if (btntext == "UnSetProject") {
        var PassData = {
            iUserId: $("#hdnuserid").val(),
            vWorkSpaceId: productIds[$('#ddlProjectNo').val()],
            vProjectNo: $('#ddlProjectNo').val(),
            nSetProjectNo: nSetProjectNo,
            DATAOPMODE: 3
        }

        var UrlDetails =
        {
            Url: BaseUrl + "PmsGeneral/Insert_SetProjectMst",
            SuccessMethod: "SuccessMethod"
        }

        $.ajax({
            url: UrlDetails.Url,
            type: 'POST',
            data: PassData,
            async: false,
            success: EditSuccessfully,
            error: function () {
                SuccessorErrorMessageAlertBox("Failed to unset project.", ModuleName);
                
            }
        });

        function EditSuccessfully(response) {
            $('#btnSetProject').val('SetProject');
            document.getElementById("btnSetProject").innerHTML = "Set Project";
            vWorkSpaceId = "";
            $('#ddlProjectNo').val('');
            $('#ddlProjectNo').prop('disabled', false);
        }
    }
}