/// <reference path="General.js" />

$(function () {
    //alert(window.sessionStorage.getItem("UserNameWithProfile"));
    test = new Date();
    //$("#spnLoginTime").html(test);
    $("#spnwelcome").html(window.sessionStorage.getItem("UserNameWithProfile"));

    var GetallPmsPeriodData = {
        Url: BaseUrl + "pmsperiod/GetAllPmsPeriod",
        SuccessMethod: "SuccessMethod"
    }
    GetAllPmsPeriodMaster(GetallPmsPeriodData.Url, GetallPmsPeriodData.SuccessMethod);
    
    $('.datepicker').datepicker({ format: 'dd/mm/yyyy', autoclose: true });
    $("#btnaddPmsPeriod").on("click", function (){
        var InsertData = {
            vPmsPeriodName:$("#vPmsPeriodName").val(),
            dPeriodStartDate: $("#dPeriodStartDate").val(),
            dPeriodEndDate: $("#dPeriodEndDate").val(),
            dPeriodEvaluationStartDate: $("#dPeriodEvaluationStartDate").val(),
            dPeriodEvaluationEndDate: $("#dPeriodEvaluationEndDate").val()
        }
    });
});

var GetAllPmsPeriodMaster = function (Url, SuccessMethod) {

    $.ajax({
        url: Url,
        type: 'GET',
        success: SuccessMethod,
        error: function () {
            alert("Error");
        }
    });

    function SuccessMethod(jsonData) {
        var strdata = "";
        if (jsonData.length > 0) {
           
            for (var i = 0; i < jsonData.length; i++) {
                var ActiveInactiveData = (jsonData[i].cIsactive == 'A') ? 'Active' : 'Inactive';
                strdata += "<tr>";
                strdata += "<td></td>";
                strdata += "<td>" + jsonData[i].vPmsPeriodName + "</td>";
                strdata += "<td>" + jsonData[i].dPeriodStartDate + "</td>";
                strdata += "<td>" + jsonData[i].dPeriodEndDate + "</td>";
                strdata += "<td>" + jsonData[i].dPeriodEvaluationStartDate + "</td>";
                strdata += "<td>" + jsonData[i].dPeriodEvaluationEndDate + "</td>";
                strdata += "<td>" + jsonData[i].dModifyOn + "</td>";
                strdata += "<td>" + jsonData[i].vModifyByname + "</td>";
                strdata += "<td>" + ActiveInactiveData + "</td>";
                strdata += '<td>';
                strdata += '<a href="Javascript:void(0);" id="' + jsonData[i].nPmsPeriodId + '" class="clsdelete"><i class="fa fa-fw fa-trash-o"></i></a>';
                strdata += '<a href="Javascript:void(0);" id="' + jsonData[i].nPmsPeriodId + '" class="clsEdit"><i class="fa fa-fw fa-edit"></i></a>';
                strdata += "</td>";
                strdata += "</tr>";
            }
            
            $(".TbodyPmsList").append(strdata);
        }
        ConvertToDataTable("tblPmsPerriod");
    }
}

var InsertPmsPeriodMaster = function (Url, SuccessMethod) {
    $.ajax({
        url: Url,
        type: 'GET',
        success: SuccessMethod,
        error: function () {
            alert("Error");
        }
    });
}
