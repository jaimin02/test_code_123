var BaseUrl;
var WebUrl;
var ConfirmMessage = 'Are you sure you want to exit ?';
var UnUsedMessage = "Test";
var SuccessMessage = "Success"
var setWorkspaceId;
//var WebUrl = "http://localhost/PharmacyManagement/";
var InActiveColor = "";
var Location = "";
$(document).ready(function () {
    var url = window.location.href
    var str1 = window.location.href;
    var str2 = ":57074";
    //InActiveColor = "#D2D2D2";
    if (str1.indexOf(str2) != -1) {
        WebUrl = "http://90.0.0.110/SST/SST_LCS/";
        BaseUrl = "http://90.0.0.110/SST/SST_LCSAPI/API/";
    }
    else {
        WebUrl = "http://90.0.0.110/SST/SST_LCS/";
        BaseUrl = "http://90.0.0.110/SST/SST_LCSAPI/API/";
    }
});

function ConvertToDataTable(Id) {
    var Id = $('#' + Id).DataTable({
        "columnDefs": [{
            "bJQueryUI": true,
            "sPaginationType": "full_numbers",
            "bLengthChange": true,
            "iDisplayLength": 10,
            "bProcessing": true,
            "bSort": false,
            "autoWidth": true,
            "bInfo": true,
            "bDestroy": true,
        }],
        "oLanguage": {
            "sEmptyTable": "No Record Found",
        },
        "order": [[1, 'asc']]
    });
}

function GetWindowBounds() {
    var e = 0,
        t = 0;
    return window.innerHeight || window.innerWidth ? (e = screen.height, t = screen.width) : document.documentElement.clientHeight || document.documentElement.clientWidth ? (e = screen.height, t = screen.width) : (document.body.clientHeight || document.body.clientWidth) && (e = screen.height, t = screen.width), {
        Width: t,
        Height: e
    }
}

function CopyTextValues(e, t) {
    t.value = e.value
}

function BodyScrollHeight() {
    var e, t;
    return document.innerHeight ? (e = window.pageXOffset, t = window.pageYOffset) : document.documentElement && document.documentElement.clientHeight ? (e = document.documentElement.scrollLeft, t = document.documentElement.scrollTop) : document.body && document.body.clientHeight && (e = document.body.scrollLeft, t = document.body.scrollTop), {
        xScr: e,
        yScr: t
    }
}

function GetElementTopLeft(e) {
    var t, n, i;
    for (t = e.offsetLeft, n = e.offsetTop, i = e.offsetParent; null != i;) t += i.offsetLeft, n += i.offsetTop, i = i.offsetParent;
    return {
        PosX: t,
        PosY: n
    }
}

function GetBMI(e, t) {
    try {
        t = parseFloat(t)
    } catch (n) {
        return alert("Invalid Weight, Please Enter valid weight !!!"), null
    }
    try {
        e = parseFloat(e)
    } catch (n) {
        return alert("Invalid Height, Please Enter valid height !!!"), null
    }
    try {
        var i = parseFloat(e) / 100;
        i = Math.pow(i, 2);
        var r = parseFloat(t) / parseFloat(i);
        return r = GetRoundedNumber(r, 2)
    } catch (n) {
        return alert(n.description), null
    }
}

function GetRoundedNumber(e, t) {
    var n = Math.round(parseFloat(e) * Math.pow(10, t));
    return n = parseFloat(n) / Math.pow(10, t)
}

function SetCenter(e) {
    var t = document.getElementById(e),
        n = BodyScrollHeight(),
        i = Sys.UI.DomElement.getBounds(t),
        r = GetWindowBounds(),
        o = Math.round(r.Width / 2) - Math.round(i.width / 2),
        a = Math.round(r.Height / 2) - Math.round(i.height / 2);
    o += n.xScr, a += n.yScr, Sys.UI.DomElement.setLocation(t, o, a)
}

function GetDateFromString(e) {
    var t, n, i, r, o = new Date;
    if (e.indexOf("-") > -1 ? e = e.replace(/-/g, "/") : e.indexOf(".") > -1 && (e = e.replace(/./g, "/")), -1 == e.indexOf("/")) return err = "Invalid Date: No or Unknown Seperator Used !!!", "";
    if (t = e.split("/"), 3 != t.length) return null;
    if (n = t[0], parseFloat(n) < 1 || parseFloat(n) > 31) return "";
    if (o.setDate(n), i = isNaN(t[1]) ? ConvertMonthToInt(t[1]) : t[1], i = parseFloat(i), 1 > i || i > 12) return "";
    if (i -= 1, o.setMonth(i, n), r = t[2], 2 == r.toString().length) r = parseInt(r) < cCUTOFFYEAR ? "20" + r : "19" + r, o.setFullYear(r, i, n);
    else {
        if (4 != r.toString().length) return "";
        o.setFullYear(r, i, n)
    }
    return o
}

function GetDateDifference(e, t) {
    var n, i, r, o, a, s = GetDateFromString(e),
        l = GetDateFromString(t);
    return s > l ? {
        Years: 0,
        Days: 0
    } : (n = l - s, i = parseFloat(n) / 1e3, mins = i / 60, r = mins / 60, o = r / 24, a = Math.round(Math.floor(o / 365.25)), o = Math.round(o % 365.25), {
        Years: a,
        Days: o
    })
}

function ConvertMonthToInt(e) {
    switch (e.toUpperCase()) {
        case "JAN":
        case "JANUARY":
            return 1;
        case "FEB":
            //case "FEBURARY":
        case "FEBRUARY":
            return 2;
        case "MAR":
        case "MARCH":
            return 3;
        case "APR":
        case "APRIL":
            return 4;
        case "MAY":
            return 5;
        case "JUN":
        case "JUNE":
            return 6;
        case "JUL":
        case "JULY":
            return 7;
        case "AUG":
        case "AUGUST":
            return 8;
        case "SEP":
        case "SEPTEMBER":
            return 9;
        case "OCT":
        case "OCTOBER":
            return 10;
        case "NOV":
        case "NOVEMBER":
            return 11;
        case "DEC":
        case "DECEMBER":
            return 12
    }
}

function ConvertIntToMonth(e) {
    switch (e) {
        case "1":
            return "Jan";
        case "2":
            return "Feb";
        case "3":
            return "Mar";
        case "4":
            return "Apr";
        case "5":
            return "May";
        case "6":
            return "Jun";
        case "7":
            return "Jul";
        case "8":
            return "Aug";
        case "9":
            return "Sep";
        case "10":
            return "Oct";
        case "11":
            return "Nov";
        case "12":
            return "Dec"
    }
}

function DateConvert(e, t) {
    if (0 == e.length) return !0;
    if (e.length < 8) return t.value = "", t.focus(), alert("Please Enter Date in DDMMYYYY or dd-Mon-YYYY format only."), !1;
    if (e.length > 8) {
        var n = GetDateFromString(e);
        return "" != n && !isNaN(n) || -1 != e.indexOf("UK") && -1 != e.indexOf("UNK") && -1 != e.indexOf("UKUK") ? !0 : (n = new Date, t.value = (n.getDate().toString().length < 2 ? "0" + n.getDate().toString() : n.getDate().toString()) + "-" + cMONTHNAMES[n.getMonth()] + "-" + n.getFullYear().toString(), !1)
    }
    var i = e.substr(0, 2),
        r = e.substr(2, 2),
        o = e.substr(4, 4);
    if (i > 31 || r > 12 || 1 > i || 1 > r) return t.value = "", t.focus(), alert("Please Enter Date in DDMMYYYY or dd-Mon-YYYY format only."), !1;
    if (1800 > o) return t.value = "", t.focus(), alert("Please Enter Valid Year."), !1;
    var a = cMONTHNAMES[r - 1];
    return e = i.toString() + "-" + r + "-" + o.toString(), isDate(e) ? (t.value = i.toString() + "-" + a + "-" + o.toString(), !0) : (t.value = "", t.focus(), !1)
}

function TimeConvert(e, t) {
    var n, i;
    if (0 == e.length) return !0;
    if (e = e.toString().trim(), e.indexOf(":") > -1) {
        if (!(e.split(":").length > 1)) return t.value = "", t.focus(), alert("Please Enter Time in HHMM or HH:MM format only."), !1;
        n = 1 == e.split(":")[0].toString().trim().length ? "0" + e.split(":")[0].toString().trim() : e.split(":")[0].toString().trim(), i = 1 == e.split(":")[1].toString().trim().length ? "0" + e.split(":")[1].toString().trim() : e.split(":")[1].toString().trim()
    } else {
        if (e.length >= 5) return t.value = "", t.focus(), alert("Please Enter Time in HHMM or HH:MM format only."), !1;
        1 == e.length ? (n = "0" + e.toString(), i = "00") : 2 == e.length ? (n = e.toString(), i = "00") : 3 == e.length ? (n = e.substring(0, 2), i = "0" + e.substring(2, 3)) : (n = e.substring(0, 2), i = e.substring(2, 4))
    }
    return n > 23 ? (t.focus(), alert("Hours can not be greater than 23"), !1) : i > 59 ? (t.focus(), alert("Minutes can not be greater than 59"), !1) : (t.value = n.toString() + ":" + i.toString(), !0)
}

function c2f(e) {
    var t;
    return t = 1.8 * e + 32, t = t.toString().substring(0, t.toString().indexOf(".") + 2)
}

function f2c(e) {
    var t;
    return t = 5 / 9 * (e - 32), t = t.toString().substring(0, t.toString().indexOf(".") + 2)
}

function SetCheckUncheckAll(e, t) {
    var n = 0,
        i = e.getElementsByTagName("input");
    for (n = 0; n < i.length; n++)
        if (("checkbox" == i[n].type || "CHECKBOX" == i[n].type) && 0 == i[n].checked) return void (t.checked = !1);
    n == i.length && (t.checked = !0)
}

function CheckBoxListSelection(e, t) {
    var n = e.getElementsByTagName("input");
    for (i = 0; i < n.length; i++) ("checkbox" == n[i].type || "CHECKBOX" == n[i].type) && (n[i].checked = t.checked)
}

function CheckDateLessThenToday(e) {
    var t = new Date;
    if (e.length < 6) return !1;
    if (3 != e.toString().split("-").length) return !1;
    var n = e.substring(e.lastIndexOf("-") + 1);
    2 == n.length && (n = parseInt(n) <= cCUTOFFYEAR ? "20" + n.toString() : "19" + n.toString());
    var i = e.substring(0, e.indexOf("-")),
        r = e.substring(e.indexOf("-") + 1, e.lastIndexOf("-"));
    r = ConvertMonthToInt(r), r = parseFloat(r), r -= 1;
    var o = new Date;
    return o.setFullYear(n, r, i), t = new Date, o > t ? !1 : !0
}

function CheckDateMoreThenToday(e) {
    var t = new Date;
    if (e.length < 6) return !1;
    if (3 != e.toString().split("-").length) return !1;
    var n = e.substring(e.lastIndexOf("-") + 1);
    2 == n.length && (n = parseInt(n) <= cCUTOFFYEAR ? "20" + n.toString() : "19" + n.toString());
    var i = e.substring(0, e.indexOf("-")),
        r = e.substring(e.indexOf("-") + 1, e.lastIndexOf("-"));
    r = ConvertMonthToInt(r), r = parseFloat(r), r -= 1;
    var o = new Date;
    return o.setFullYear(n, r, i), t = new Date, t >= o ? !1 : !0
}

function SessionTimeSet() {
    timerId || (beforeload = (new Date).getTime(), timerId = window.setInterval(DecrementSessionTimeOut, 1e3))
}

function ResetSessionTimer() {
    beforeload = (new Date).getTime()
}

function DecrementSessionTimeOut() {
    afterload = (new Date).getTime(), timeDiff = 60 * parseInt(ACTUAL_SESSIONTIME) - Math.round((afterload - beforeload) / 1e3) - 60, 299 == timeDiff && ($find("mdlSessionTimeoutWarning").show(), null != document.getElementById("ctl00_divSessionTimeoutWarning") || void 0 != document.getElementById("ctl00_divSessionTimeoutWarning") ? document.getElementById("ctl00_divSessionTimeoutWarning").style.display = "block" : document.getElementById("divSessionTimeoutWarning").style.display = "block"), timeDiff <= 0 && (null != document.getElementById("ctl00_divSessionTimeoutWarning") || void 0 != document.getElementById("ctl00_divSessionTimeoutWarning") ? "block" == document.getElementById("ctl00_divSessionTimeoutWarning").style.display && ($find("mdlSessionTimeoutWarning").hide(), document.getElementById("ctl00_divSessionTimeoutWarning").style.display = "none") : "block" == document.getElementById("divSessionTimeoutWarning").style.display && ($find("mdlSessionTimeoutWarning").hide(), document.getElementById("divSessionTimeoutWarning").style.display = "none"), alert("Your session has expired!"), window.location.href = window.location.href.indexOf("/CDMS/") >= 0 || window.location.href.indexOf("/BA/") >= 0 ? "/../Logoutpage.aspx?mode=expire" : "Logoutpage.aspx?mode=expire", window.clearInterval(timerId)), timeDiffsec = Math.floor(timeDiff % 60), timeDiffmin = Math.floor(timeDiff / 60), timeDiffhr = Math.floor(timeDiffmin / 60), timeDiffmin >= 60 && (timeDiffhr = Math.floor(timeDiffmin / 60), timeDiffmin -= 60 * timeDiffhr), timeDiffhr <= 9 && timeDiffhr >= 0 && (timeDiffhr = "0" + timeDiffhr), timeDiffmin <= 9 && timeDiffhr >= 0 && (timeDiffmin = "0" + timeDiffmin), timeDiffsec <= 9 && timeDiffhr >= 0 && (timeDiffsec = "0" + timeDiffsec), document.getElementById("timerText").innerHTML = timeDiffhr + ":" + timeDiffmin + ":" + timeDiffsec + " "
}

function btnContinueWorking_Click() {
    1 == sessionFlag && (null != document.getElementById("ctl00_divSessionTimeoutWarning") || void 0 != document.getElementById("ctl00_divSessionTimeoutWarning") ? "block" == document.getElementById("ctl00_divSessionTimeoutWarning").style.display && ($find("mdlSessionTimeoutWarning").hide(), document.getElementById("ctl00_divSessionTimeoutWarning").style.display = "none") : "block" == document.getElementById("divSessionTimeoutWarning").style.display && ($find("mdlSessionTimeoutWarning").hide(), document.getElementById("divSessionTimeoutWarning").style.display = "none"), ResetSessionTimer())
}

function closeSessionDiv() {
    return sessionFlag = !1, $find("mdlSessionTimeoutWarning").hide(), null != document.getElementById("ctl00_divSessionTimeoutWarning") || void 0 != document.getElementById("ctl00_divSessionTimeoutWarning") ? document.getElementById("ctl00_divSessionTimeoutWarning").style.display = "none" : document.getElementById("divSessionTimeoutWarning").style.display = "none", !0
}

function CheckStandardDate(e, t, n, i) {
    var r = $("#" + t).val(),
        o = $("#" + n).val(),
        a = $("#" + i).val();
    if ("" != r && "00" != r.toUpperCase() && "" != o && "00" != o.toUpperCase() && "" != a && "0000" != a.toUpperCase()) {
        if (!CheckDateLessThenToday(r + "-" + $("#" + n).find("option:selected").text() + "-" + a)) return alert("Date should be less than current date."), e.selectedIndex = 0, e.focus(), !1;
        if ((4 == +o || 6 == +o || 9 == +o || 11 == +o) && 31 == +r) return alert("Please enter valid date."), e.selectedIndex = 0, e.focus(), !1;
        if (2 == +o) {
            var s = +a % 4 == 0 && (+a % 100 != 0 || +a % 400 == 0);
            if (+r > 29 || 29 == +r && !s) return alert("Please enter valid date."), e.selectedIndex = 0, e.focus(), !1
        }
    }
}
null == String.prototype.allTrim && (String.prototype.trim = function () {
    var e = this.replace(/^\s+/, "");
    return e = this.replace(/\s+$/, "")
});
var cCUTOFFYEAR = 30,
    cMONTHNAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// only Positive Value

// Custom Popup and Related Function
function ValidationAlertBox(Message, ButtonID, ModuleName) {
    var strdata = "";
    strdata += "<div class='modal-dialog modal-lg' style='width:450px'>";
    strdata += "<div class='DTED_Lightbox_Content' style='height: auto;'>";
    strdata += "<div class='modal-content modal-content-AlertPromt'>";
    strdata += "<div class='modal-header modalheader'>"
    strdata += "<button type='button' class='Close' onclick='CancelPromt()'>&times;</button>"
    strdata += "<h4 class='modal-title modaltitle text-center'><span class='fa fa-warning' style='color:red'>&nbsp&nbsp<label id='lblmsg' class='text-center' style='color:black'>" + ModuleName + "</label></span></h4></div>";
    strdata += "<div class='modal-body' style='padding:0px'><div class='box-body'>"
    strdata += "<label id='lblmsg'>" + Message + "</label>";
    strdata += "</div></div>";
    strdata += "<div class='modal-footer modalfooter' style='text-align:right;border-top: 2px solid #e5e5e5;padding: 7px;'>";
    strdata += "<button data-bb-handler='confirm' type='button' class='btn btn-primary' onclick='popupclose(UnUsedMessage,"
                + ButtonID + ")'><i class='fa fa-check'></i> OK</button>"
    strdata += "</div></div>"
    strdata += "</div></div>"
    $("#AlertPopup").append(strdata);
    $("#AlertPopup").modal('show');
}

function popupclose(Message, ButtonID, ModuleName) {
    if (Message == "Success") {
        $(".modal").modal('hide');
        $("#AlertPopup").html("");
    }
    else if (Message == "Test") {
        $("#AlertPopup").modal('hide');
        $("#AlertPopup").html("");
        ButtonID.focus();
    }
}

function ConfirmAlertBox(ModuleName, LocationName, strConfirmMessage) {
    Location = LocationName;
    var strdata = "";
    strdata += "<div class='modal-dialog' style='width:450px'>";
    strdata += "<div class='DTED_Lightbox_Content' style='height: auto;'>";
    strdata += "<div class='modal-content modal-content-AlertPromt'>";
    strdata += "<div class='modal-header modalheader'>"
    strdata += "<button type='button' class='Close' onClick='CancelPromt()'>&times;</button>"
    strdata += "<h4 class='modal-title modaltitle text-center'><label id='lblmsg' class='text-center' style='color:black'>" + ModuleName + "</label></h4></div>";
    strdata += "<div class='modal-body' style='padding:0px'><div class='box-body'>"
    if (strConfirmMessage == undefined) {
        strdata += "<span class='fa  fa-question-circle' style='color:red'></span><label id='lblmsg' class='text-center'>" + ConfirmMessage + "</label>";
    }
    else {
        strdata += "<span class='fa  fa-question-circle' style='color:red'></span><label id='lblmsg' class='text-center'>" + strConfirmMessage + "</label>";
    }
    strdata += "</div></div>";
    strdata += "<div class='modal-footer modalfooter'>";
    strdata += "<button type='button' class='btn btn-primary' onclick='AlertFunction()'><i class='fa fa-check'></i> Confirm</button>"
    strdata += "<button type='button' class='btn btn-default' onClick=CancelPromt()><i class='fa fa-times'></i>Cancel</button>"
    strdata += "</div></div></div></div>"
    $("#AlertPopup").append(strdata);
    $("#AlertPopup").modal('show');
}

function AlertFunction() {
    $(".modal").modal('hide');
    $("#AlertPopup").html("");

    if (Location != undefined) {
        var url = Location;
        location.href = url;
    }
    Location = "";
}

function CancelPromt() {
    $("#AlertPopup").modal('hide');
    $("#AlertPopup").html("");
}

function SuccessorErrorMessageAlertBox(Message, ModuleName) {
    var strdata = "";
    strdata += "<div class='modal-dialog modal-lg' style='width:450px'>";
    strdata += "<div class='DTED_Lightbox_Content' style='height: auto;'>";
    strdata += "<div class='modal-content modal-content-AlertPromt'>";
    strdata += "<div class='modal-header modalheader'>"
    strdata += "<button type='button' class='Close' onclick='CancelPromt()'>&times;</button>"
    strdata += "<h4 class='modal-title modaltitle text-center'><label id='lblmsg' class='text-center' style='color:black'>" + ModuleName + "</label></h4></div>";
    strdata += "<div class='modal-body' style='padding:0px'><div class='box-body'>"
    strdata += "<label id='lblmsg' class='text-center'>" + Message + "</label>";
    strdata += "</div></div>";
    strdata += "<div class='modal-footer modalfooter' style='text-align:right;border-top: 2px solid #e5e5e5;padding: 7px;'>";
    strdata += "<button data-bb-handler='confirm' type='button' class='btn btn-primary' onclick='popupclose(SuccessMessage)'><i class='fa fa-check'></i> OK</button>"
    strdata += "</div></div>"
    strdata += "</div></div>"
    $("#AlertPopup").append(strdata);
    $("#AlertPopup").modal('show');
}

function findAndRemove(array, property, value) {
    array.forEach(function (result, index) {
        if (result[property] == value) {
            //Remove from array
            array.splice(index, 1);
        }
    });
}

function CheckSetProjectGeneral(ControlName) {
    var PassData = {
        iUserId: $("#hdnuserid").val()
    }

    $.ajax({
        url: BaseUrl + "PmsGeneral/GetSetProjectDetails/" + $("#hdnuserid").val(),
        type: 'GET',
        async: false,
        success: SuccessMethod,
        error: function () {
            ValidationAlertBox("Project Not Found !", ControlName, ModuleName);
        }
    });
    function SuccessMethod(jsonData) {
        if (jsonData.length > 0) {
            $('#' + ControlName + '').val(jsonData[0].vProjectNo);
            setWorkspaceId = jsonData[0].vWorkSpaceId;

        }
        else {
            $('#' + ControlName + '').val('');
        }
    }
}

function padLeft(nr, n, str) {
    return Array(n - String(nr).length + 1).join(str || '0') + nr;
}
// Added by arpit for E Sign
function ElectronicSignature() {
    $("#txtUserName").val($("#hdnUserName").val() + "- (" + $("#ddlProfile :selected").text() + ")")
    var today = new Date();
    var month = today.getMonth() + 1//Start From ZERO
    var currentdate = padLeft(today.getDate(), 2) + '-' + ConvertIntToMonth((month).toString()) + '-' + today.getFullYear() + " " + padLeft(today.getHours(), 2) + ":" + padLeft(today.getMinutes(), 2);
    $("#txtDateTime").val(currentdate)
    $("#txtPassword").val("");
}

function UserAuthentication() {
    var username = $("#hdnUserName").val();
    var password = $('#txtPassword').val();
    var usertypecode = $('#hdnUserTypeCode').val();
    var result = true;

    if (password == "") {
        ValidationAlertBox("Please Enter Password !", "txtPassword", ModuleName);
        result = fal;
    }

    var loginDetails = {
        vUserName: username,
        vLoginPass: password,
        vUserTypeCode: usertypecode,
        vIPAddress: $('#hdnIpAddress').val(),
        vUserAgent: $('#hdnUserAgent').val(),

    };
    $.ajax({
        url: BaseUrl + "PmsLogin/PostLoginAuthentication",
        type: 'POST',
        data: loginDetails,
        dataType: 'json',
        async: false,
        success: OnSuccess,
        error: function (ex) {
            //alert('Login Failed. Try Again.!: ' + ex);
        }
    });

    function OnSuccess(jsonData) {
        if (jsonData.Data.length != 0) {
            if (jsonData.Data[0].cBlockedFlag == 'E') {
                result = false;
                $("#txtPassword").val("");
                ValidationAlertBox("User Authentication Failed ! Please Try Again", "txtPassword", ModuleName);
            }
        }
    }
    return result;
}

function GetViewMode() {
    var tablename = "StudyProductViewUserTypeDtl";

    $.ajax({
        url: BaseUrl + "PmsRecordFetch/GetStudyProductViewUserTypeCode/ " + tablename + "",
        type: 'GET',
        async: false,
        success: function (data) {
            if (data.length != 0) {
                ViewModeIDWebConfig = data[0].vUserTypeCodeReadOnly.split(",");
                for (i = 0; i < ViewModeIDWebConfig.length; i++) {
                    if ($("#hdnUserTypeCode").val().trim() == ViewModeIDWebConfig[i]) {
                        $(".viewmode").attr("style", "display:none");
                        viewmode = "OnlyView";
                        break;
                    }
                    else {
                        viewmode = "";
                    }
                }
            }

        }
    });
}

function GUID() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function GetJsonData(Data) {
    jsonData = "";
    var Url = BaseUrl + "PmsRecordFetch/ExecuteDataTable";
    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        async: false,
        dataType: "json",
        success: function (Result) {
            jsonData = Result;
            return jsonData;
        },
        error: function () {
            alert("No Details Found.");
        }
    });
}

function GetJsonDataSet(Data) {
    var Url = BaseUrl + "PmsRecordFetch/ViewRandomizationDetailData";
    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        async: false,
        dataType: "json",
        success: function (Result) {
            jsonData = Result;
            return jsonData;
        },
        error: function () {
            alert("No Details Found.");
        }
    });
}