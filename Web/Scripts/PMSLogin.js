var Flag_ValidateBlocked = "false"
var GUID = (GUID() + GUID() + "-" + GUID() + "-4" + GUID().substr(0, 3) + "-" + GUID() + "-" + GUID() + GUID() + GUID()).toLowerCase();
$(function () {
    var GetallPmsPeriodData = {
        Url: BaseUrl + "PmsLogin/",
        SuccessMethod: "SuccessMethod"
    }
});


$(document).ready(function () {
    window.sessionStorage.setItem("UserNameWithProfile", "");
    $('#txtusername').focus();
    var animating = false,
        submitPhase1 = 1100,
        submitPhase2 = 400,
        logoutPhase1 = 800,
        $login = $(".login"),
        $app = $(".app");

    function ripple(elem, e) {
        $(".ripple").remove();
        var elTop = elem.offset().top,
            elLeft = elem.offset().left,
            x = e.pageX - elLeft,
            y = e.pageY - elTop;
        var $ripple = $("<div class='ripple'></div>");
        $ripple.css({ top: y, left: x });
        elem.append($ripple);
    };

    $(document).on("click", ".login__submit", function (e) {

        $("#loader").attr("style", "display:block");

        var url = $("#RedirectTo").val();

        if ($("#txtusername").val() == '') {
            //alert('Please Enter User Name !')
            ValidationAlertBox("Please Enter User Name !", "txtusername", "Login");
            $("#loader").attr("style", "display:none");
            $("#txtusername").focus();
            return false;
        }
        if ($("#txtpassword").val() == '') {
            //alert('Please Enter Password !')
            ValidationAlertBox("Please Enter Password !", "txtpassword", "Login");
            $("#loader").attr("style", "display:none");
            $("#txtpassword").focus();
            return false;
        }
        if ($("#ddlProfile").val() == null) {
            //alert('Please Select Profile !')
            ValidationAlertBox("Please Select Profile !", "ddlProfile", "Login");
            $("#loader").attr("style", "display:none");
            $("#ddlProfile").focus();
            return false;
        }


        if ($('#txtVerify').val() == "false") {
            GetUserOTPInfo();
        }
        if ($('#txtVerify').val() == "") {
            $('#txtotp').val('');
            $('#txtVerify').val(false);
            return false;
        }

        if (!UserAuthentication()) {
            if (Flag_ValidateBlocked == "true") {
                $('#txtusername').val('');
                $('#txtpassword').val('');
                $('#ddlProfile').val('');
                $('#ddlProfile').empty();
                $("#loader").attr("style", "display:none");
                return false;
            }
            AssingLoginFailureDetails();
            $('#txtusername').val('');
            $('#txtpassword').val('');
            $('#ddlProfile').val('');
            $('#ddlProfile').empty();

            //alert('Login Failed. Try Again');
            ValidationAlertBox("Login Failed. Try Again", "txtusername", "Login");
            $("#loader").attr("style", "display:none");
            return false;

        }
        if (Flag_ValidateBlocked == "true") {
            $('#txtusername').val('');
            $('#txtpassword').val('');
            $('#ddlProfile').val('');
            $('#ddlProfile').empty();
            $("#loader").attr("style", "display:none");
            return false;
        }
        //if (animating) return;
        animating = true;
        var that = this;
        ripple($(that), e);
        $(that).addClass("processing");
        setTimeout(function () {
            $(that).addClass("success");
            setTimeout(function () {
                //$login.hide();
                location.href = url;
                //$login.addClass("inactive");
                animating = false;
                //$(that).removeClass("success processing");

            }, submitPhase2);
        }, submitPhase1);

    });

});

function GetProfile() {
    $("#loader").attr("style", "display:block");
    var username = $('#txtusername').val();
    $('#ddlProfile').val('');
    $('#ddlProfile').empty();
    $.ajax({
        url: BaseUrl + "PmsLogin/GetUserprofile",
        type: 'GET',
        data: { id: username },
        dataType: 'json',
        success: SuccessMethod,
        async: false,
        error: function (ex) {
           // alert('Failed to retrieve Sub Categories : ' + ex);
        }
    });

    function SuccessMethod(jsonData) {
        if (jsonData.length != 0) {
            //window.sessionStorage.setItem("UserNameWithProfile", jsonData.UserNameWithProfile);
        }
        $.each(jsonData, function (i, items) {
            $("#ddlProfile").append($("<option></option>").val(this['vUserTypeCode']).html(this['vUserTypeName']));
        });
    }
    $("#loader").attr("style", "display:none");
    return false;
}

function UserAuthentication() {
    var username = $('#txtusername').val();
    var password = $('#txtpassword').val();
    var usertypecode = $('#ddlProfile').val();

    var loginDetails = {
        vUserName: username,
        vLoginPass: password,
        vUserTypeCode: usertypecode,
        vIPAddress: $('#hdnIpAddress').val(),
        vUserAgent: $('#hdnUserAgent').val(),
        vGUID: GUID,

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

    return result;
}
var result = true;

function OnSuccess(jsonData) {
    //var result = true;
    //AssingLoginFailureDetails(jsonData);
    //ValidateBlocked(jsonData);
    var user = $('#txtusername').val();
    var currentUserAgent = $('#hdnUserAgent').val();
    var resultLogin = true;

    if (jsonData.Data.length != 0) {
        if (jsonData.Data[0].cBlockedFlag == 'Y') {
            //alert("Your username is locked due to multiple incorrect login attempts !!!");
            ValidationAlertBox("Your username is locked due to multiple incorrect login attempts !!!", "txtusername", "Login");
            resultLogin = false;
        }
        else if (jsonData.Data[0].cBlockedFlag == 'E') {
            //alert("Login Failed. Try Again.! ");
            ValidationAlertBox("Login Failed. Try Again.!", "txtusername", "Login");
            resultLogin = false;
        }
        else if (jsonData.Data[0].cLockFlag == 'Y' && jsonData.Data[0].cInactive == 'Y') {
            //alert("Your username is locked, as the user is inactive since 30 days, Please contact Administrator.");
            ValidationAlertBox("Your username is locked, as the user is inactive since 30 days, Please contact Administrator.", "txtusername", "Login");
            resultLogin = false;
        }
        else if (jsonData.Data[0].cLockFlag == 'Y' && jsonData.Data[0].cInactive == 'N') {
            //alert("Your username is locked due to multiple incorrect login attempts, Please contact Administrator.");
            ValidationAlertBox("Your username is locked due to multiple incorrect login attempts, Please contact Administrator.", "txtusername", "Login");
            resultLogin = false;
        }
        else if (jsonData.Data[0].cLockFlag == 'N' && jsonData.Data[0].cInactive == 'Y') {
            //alert("Your username is locked, as the user is inactive since 30 days !!!");
            ValidationAlertBox("Your username is locked, as the user is inactive since 30 days !!!", "txtusername", "Login");
            resultLogin = false;
        }
        else if (jsonData.Data[0].MaxLoginMins > 0) {
            //alert("User Already Logged-In. Wait for " + jsonData.Data[0].MaxLoginMins.toString() + " Minutes and Try Again.");
            if (confirm("\"" + user + "\" is already logged in " + jsonData.Data[0].vUserAgent + " Browser of " + jsonData.Data[0].vIPAddress + " System. " + "Are you sure want to continue Login with Current " + currentUserAgent + " Browser of " + $('#hdnIpAddress').val() + " System")) {
                var SaveUserLoginData = {
                    iUserId: jsonData.Data[0].iUserId,
                    vIPAddress: $('#hdnIpAddress').val(),
                    vUTCHourDiff: jsonData.Data[0].vUTCHourDiff,
                    vUserAgent: jsonData.Data[0].vUserAgent,
                    vGUID: GUID,
                    DataopMode: 1
                }
                $.ajax({
                    url: BaseUrl + "PmsLogin/save_UserLoginDetails",
                    type: 'POST',
                    data: SaveUserLoginData,
                    async: false,
                    success: function () { },
                    error: function () {
                        //alert("Error while saving details of User Login details !");
                        SuccessorErrorMessageAlertBox("Error while saving details of User Login details !", "User Master");

                    }
                });


            }
            else {
                resultLogin = false;
            }
        }
        if (resultLogin != false) {

            window.sessionStorage.setItem("UserNameWithProfile", jsonData.Data[0].UserNameWithProfile);
            var UserDetails = {};
            UserDetails.iUserId = jsonData.Data[0].iUserId;
            UserDetails.iUserGroupCode = jsonData.Data[0].iUserGroupCode;
            UserDetails.vUserGroupName = jsonData.Data[0].vUserGroupName;
            UserDetails.vUserName = jsonData.Data[0].vUserName;
            UserDetails.vLoginName = jsonData.Data[0].vLoginName;
            UserDetails.vLoginPass = jsonData.Data[0].vLoginPass;
            UserDetails.vUserTypeCode = $('#ddlProfile').val();
            UserDetails.vUserTypeName = jsonData.Data[0].vUserTypeName;
            UserDetails.vDeptCode = jsonData.Data[0].vDeptCode;
            UserDetails.vDeptName = jsonData.Data[0].vDeptName;
            UserDetails.vLocationCode = jsonData.Data[0].vLocationCode;
            UserDetails.vLocationName = jsonData.Data[0].vLocationName;
            UserDetails.vTimeZoneName = jsonData.Data[0].vTimeZoneName;
            UserDetails.vLocationInitiate = jsonData.Data[0].vLocationInitiate;
            UserDetails.vEmailId = jsonData.Data[0].vEmailId;
            UserDetails.vPhoneNo = jsonData.Data[0].vPhoneNo;
            UserDetails.vExtNo = jsonData.Data[0].vExtNo;
            UserDetails.vRemark = jsonData.Data[0].vRemark;
            UserDetails.iModifyBy = jsonData.Data[0].iModifyBy;
            UserDetails.dModifyOn = jsonData.Data[0].dModifyOn;
            UserDetails.cStatusIndi = jsonData.Data[0].cStatusIndi;
            UserDetails.vFirstName = jsonData.Data[0].vFirstName;
            UserDetails.vLastName = jsonData.Data[0].vLastName;
            UserDetails.nScopeNo = jsonData.Data[0].nScopeNo;
            UserDetails.vScopeName = jsonData.Data[0].vScopeName;
            UserDetails.vScopeValues = jsonData.Data[0].vScopeValues;
            UserDetails.iWorkflowStageId = jsonData.Data[0].iWorkflowStageId;
            UserDetails.cIsEDCUser = jsonData.Data[0].cIsEDCUser;
            UserDetails.dFromDate = jsonData.Data[0].dFromDate;
            UserDetails.dToDate = jsonData.Data[0].dToDate;
            UserDetails.ModifierName = jsonData.Data[0].ModifierName;
            UserDetails.UserNameWithProfile = jsonData.Data[0].UserNameWithProfile;
            UserDetails.tmp_dModifyOn = jsonData.Data[0].tmp_dModifyOn;
            UserDetails.OperationCode = $("#hdnOprationCode").val();
            UserDetails.tmp_dModifyOn = jsonData.Data[0].tmp_dModifyOn;
            UserDetails.UserWise_CurrDateTime = jsonData.Data[0].UserWise_CurrDateTime;
            UserDetails.dLastLoggdInTime = jsonData.Data[0].dLastLoggdInTime;
            UserDetails.vGUID = GUID;
            UserDetails.cExpired = jsonData.Data[0].cExpired;


            $.ajax({
                type: "POST",
                url: WebUrl + "PMSLogin/UserDetails",
                data: JSON.stringify(UserDetails),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false,
                success: OnSuccess1,
                error: OnErrorCall
            });
            function OnSuccess1(jsonData) {
                //alert(jsonData);
            }
            function OnErrorCall(ex) {
                //alert(ex);
            }
            result = true;
        }

    }
    else {

        //alert('Login Failed. Try Again.! ');
        result = false;
    }
    return result;
}
function showLoadingImage() {
    //$('#loader').append('<div id="loading-image"><img src="path/to/loading.gif" alt="Loading..." /></div>');
    //$('#loader').append('<div id="modal"> <img src="~/Content/Images/circle-bub_fluoGreen.gif"/> </div>');
}
function ValidateBlocked(jsonData) {
    var username = $('#txtusername').val();
    var password = $('#txtpassword').val();
    var usertypecode = $('#ddlProfile').val();

    var Obj_Login = {
        vUserName: username,
        vUserTypeCode: usertypecode
    };
    $.ajax({
        url: BaseUrl + "PmsLogin/ValidateBlockedData",
        type: 'POST',
        data: Obj_Login,
        async: false,
        success: success_ValidateBlockData,
        error: function () {
            //alert("Data Not Found !");
            ValidationAlertBox("Data Not Found !", "txtusername", "Login");

        }
    });
    function success_ValidateBlockData(jsonData_ValidateBlockData) {

        var str = jsonData_ValidateBlockData;
        if (jsonData_ValidateBlockData == null) {
            $("#loader").attr("style", "display:none");
            return false;
        }
        for (var i = 0; i < jsonData_ValidateBlockData.length; i++) {
            if (jsonData_ValidateBlockData[0].cBlockedFlag == "B") {
                Flag_ValidateBlocked = "true";
                //alert("Your username is locked due to multiple incorrect login attempts. Please contact your Administrator!");
                ValidationAlertBox("Your username is locked due to multiple incorrect login attempts. Please contact your Administrator!", "txtusername", "Login");
                $("#loader").attr("style", "display:none");
                return false;
            }
            else {
                Flag_ValidateBlocked = "false";

            }
        }
    }
}



function AssingLoginFailureDetails() {
    var username = $('#txtusername').val();
    var password = $('#txtpassword').val();
    var usertypecode = $('#ddlProfile').val();
    var Obj_Login = {
        vUserName: username,
        vUserTypeCode: usertypecode
    };

    $.ajax({
        url: BaseUrl + "PmsLogin/AssingLoginFailureDetails",
        type: 'POST',
        data: Obj_Login,
        async: false,
        success: success_ValidateBlockData,
        error: function () {
            //alert("No Insert Data in FailureDetails !");
            ValidationAlertBox("No Insert Data in FailureDetails !", "txtusername", "Login");
        }
    });

    function success_ValidateBlockData(jsonData_ValidateBlockData) {

    }
}



// 2FA Authentication Implemetation
$(document).on("click", ".login__otp", function (e) {
    var url = $("#RedirectTo").val();

    if ($("#txtusername").val() == '') {
        alert('Please Enter User Name !')
        $("#loader").attr("style", "display:none");
        $("#txtusername").focus();
        return false;
    }
    if ($("#txtpassword").val() == '') {
        alert('Please Enter Password !')
        $("#loader").attr("style", "display:none");
        $("#txtpassword").focus();
        return false; m
    }
    if ($("#ddlProfile").val() == null) {
        alert('Please Select Profile !')
        $("#loader").attr("style", "display:none");
        $("#ddlProfile").focus();
        return false;
    }

    var username = $('#txtusername').val();
    var password = $('#txtpassword').val();
    var usertypecode = $('#ddlProfile').val();

    var loginDetails = {
        vUserName: username,
        vLoginPass: password,
        vUserTypeCode: usertypecode,
        vIPAddress: $('#hdnIpAddress').val(),
        vUserAgent: $('#hdnUserAgent').val(),
        vGUID: GUID,

    };
    $.ajax({
        url: BaseUrl + "PmsLogin/PostLoginAuthentication_2MFA",
        type: 'POST',
        data: loginDetails,
        dataType: 'json',
        async: false,
        success: OnSuccessOtp,
        error: function (ex) {
            //alert('Login Failed. Try Again.!: ' + ex);
        }
    });

});


function OnSuccessOtp(jsonData) {
    var user = $('#txtusername').val();
    var currentUserAgent = $('#hdnUserAgent').val();
    var resultLogin = true;

    if (jsonData.Data.length != 0) {
        if (jsonData.Data[0].IsMFA == 'Y') {
            $('#dvotp').css("display", "block");

            loadTimer();
            var username = $('#txtusername').val();
            var password = $('#txtpassword').val();
            var usertypecode = $('#ddlProfile').val();

            $.ajax({
                url: BaseUrl + "PmsLogin/GetOTP",
                type: 'GET',
                data: { usernameotp: username, usertypecode },
                dataType: 'json',
                async: false,
                success: OnSuccessOtpSend,
                error: OnErrorCallOtp
            });

            function OnSuccessOtpSend() {
                $("#lblOtpmsg").css("display", "block");
                $(".login__row").css("display", "block");
                $("#lblOtpEmailMsg").css("display", "block");
                $("#lblOtpSmsMsg").css("display", "block");
                if (jsonData.Data[0].isMFAEmail == 'Y') {
                    if (jsonData.Data[0].vEmailId != '') {
                        var user_Email = jsonData.Data[0].vEmailId
                        var Email, LastEmail, EmailText;
                        Email = user_Email.substring(0, 2);
                        LastEmail = user_Email.split("@");
                        EmailText = "Email : " + Email + "********" + "@" + LastEmail[1];
                        $("#lblOtpEmailMsg").html(EmailText);
                    }
                }


                if (jsonData.Data[0].isMFASms == 'Y') {
                    if (jsonData.Data[0].vPhoneNo != '') {
                        var user_Mobile = jsonData.Data[0].vPhoneNo
                        var MObile, LastMobile, MobileText;
                        MObile = user_Mobile.substring(0, 2);
                        LastMobile = user_Mobile.substring(8)
                        MobileText = "Sms : " + MObile + "********" + LastMobile;
                        $("#lblOtpSmsMsg").html(MobileText);
                    }
                }
                $(".login__submit").css("display", "block");
                $(".login__otp").css("display", "none");
                result = true;
                return true;

            }

            function OnErrorCallOtp(ex)
            {
                result = false;
                alert("Error while getting OTP");
                return false;
            }
        }
        else {
            $('#txtVerify').val(true);
            $(".login__submit").trigger("click");
        }
    }
    else {

        //alert('Login Failed. Try Again.! ');
        result = false;
    }
    return result;
}


$(document).on("click", ".login__resendOtp", function (e) {
    var url = $("#RedirectTo").val();
    //$("#loader").attr("style", "display:block");
    if ($("#txtusername").val() == '') {
        alert('Please Enter User Name !')
        $("#loader").attr("style", "display:none");
        $("#txtusername").focus();
        return false;
    }
    if ($("#txtpassword").val() == '') {
        alert('Please Enter Password !')
        $("#loader").attr("style", "display:none");
        $("#txtpassword").focus();
        return false; m
    }
    if ($("#ddlProfile").val() == null) {
        alert('Please Select Profile !')
        $("#loader").attr("style", "display:none");
        $("#ddlProfile").focus();
        return false;
    }

    var username = $('#txtusername').val();
    var password = $('#txtpassword').val();
    var usertypecode = $('#ddlProfile').val();

    var loginDetails = {
        vUserName: username,
        vLoginPass: password,
        vUserTypeCode: usertypecode,
        vIPAddress: $('#hdnIpAddress').val(),
        vUserAgent: $('#hdnUserAgent').val(),
        vGUID: GUID,

    };
    $.ajax({
        url: BaseUrl + "PmsLogin/PostLoginAuthentication",
        type: 'POST',
        data: loginDetails,
        dataType: 'json',
        async: false,
        success: OnSuccessResendOtp,
        error: function (ex) {
            //alert('Login Failed. Try Again.!: ' + ex);
        }
    });

});



let timerOn = true;
function timer(remaining) {

    var m = Math.floor(remaining / 60);
    var s = remaining % 60;

    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;
    document.getElementById('timer').innerHTML = m + ':' + s;
    remaining -= 1;

    if (remaining >= 0 && timerOn) {
        setTimeout(function () {
            timer(remaining);
        }, 1000);
        return;
    }
    if (remaining <= 1) {
        // Do validate stuff here
        document.getElementById("lnkresendOTP").style.display = "block";
        document.getElementById('timer').style.visibility = 'hidden';
        document.getElementById('txttimer').style.visibility = 'hidden';

        timer = false;
        return;
    }
    else {
        //document.getElementById("lnkresendOTP").innerHTML = "Nilay!";
        //document.getElementById('<%=lnkresendOTP.ClientID%>').style.display = "block";
        //document.getElementById('<%=lnkresendOTP.ClientID%>').disabled = true
        return;
    }

    // Do timeout stuff here
    alert('Timeout for otp');
}

timer(120);

document.getElementById('timer').innerHTML = 01 + ":" + 11;

loadTimer();

function loadTimer() {
   
    var timer2 = "01:00";
    var interval = setInterval(function () {
        var timer = timer2.split(':');
        //by parsing integer, I avoid all extra string processing
        var minutes = parseInt(timer[0], 10);
        var seconds = parseInt(timer[1], 10);
        --seconds;
        minutes = (seconds < 0) ? --minutes : minutes;
        if (minutes < 0) {
            clearInterval(interval);
            $("#loadTimer").css({ "display": "none" });
            $("#lnkresendOTP").css({ "display": "block" });
        }

        seconds = (seconds < 0) ? 59 : seconds;
        seconds = (seconds < 10) ? '0' + seconds : seconds;
        //minutes = (minutes < 10) ?  minutes : minutes;
        $('#timer').html(minutes + ':' + seconds);
        timer2 = minutes + ':' + seconds;
    }, 1000);
}

function checkSecond(sec) {
    if (sec < 10 && sec >= 0) { sec = "0" + sec }; // add zero in front of numbers < 10
    if (sec < 0) { sec = "59" };
    return sec;
}

function OnSuccessResendOtp(jsonData) {
    var user = $('#txtusername').val();
    var currentUserAgent = $('#hdnUserAgent').val();
    var resultLogin = true;

    if (jsonData.Data.length != 0) {
        if (jsonData.Data[0].IsMFA == 'Y') {

            $('#dvotp').css("display", "block");
            $("#loadTimer").css({ "display": "block" });
            $("#lnkresendOTP").css({ "display": "none" });
            loadTimer();
            $("#lnkresendOTP").css({ "display": "none" });
            var username = $('#txtusername').val();
            var password = $('#txtpassword').val();
            var usertypecode = $('#ddlProfile').val();

            $.ajax({
                url: BaseUrl + "PmsLogin/GetOTP",
                type: 'GET',
                data: { usernameotp: username, usertypecode },
                dataType: 'json',
                async: false,
                success: OnSuccessResendOtp,
                error: OnErrorCallResendOtp
            });

            function OnSuccessResendOtp() {
                $("#lblOtpmsg").css("display", "block");
                $(".login__row").css("display", "block");
                $("#lblOtpEmailMsg").css("display", "block");
                $("#lblOtpSmsMsg").css("display", "block");
                if (jsonData.Data[0].isMFAEmail == 'Y') {
                    if (jsonData.Data[0].vEmailId != '') {
                        var user_Email = jsonData.Data[0].vEmailId
                        var Email, LastEmail, EmailText;
                        Email = user_Email.substring(0, 2);
                        LastEmail = user_Email.split("@");
                        EmailText = "Email : " + Email + "********" + "@" + LastEmail[1];
                        $("#lblOtpEmailMsg").html(EmailText);
                    }
                }


                if (jsonData.Data[0].isMFASms == 'Y') {
                    if (jsonData.Data[0].vPhoneNo != '') {
                        var user_Mobile = jsonData.Data[0].vPhoneNo
                        var MObile, LastMobile, MobileText;
                        MObile = user_Mobile.substring(0, 2);
                        LastMobile = user_Mobile.substring(8)
                        MobileText = "Sms : " + MObile + "********" + LastMobile;
                        $("#lblOtpSmsMsg").html(MobileText);
                    }
                }


                $(".login__submit").css("display", "block");
                $(".login__otp").css("display", "none");
                result = true;
                return true;

            }

            function OnErrorCallResendOtp(ex) {
                result = false;
                return false;
            }
        }
        else {
            $('#txtVerify').val(true);
            $(".login__submit").trigger("click");
        }
    }
    else {

        //alert('Login Failed. Try Again.! ');
        result = false;
    }
    return result;
}


function GetUserOTPInfo() {
    $("#loader").attr("style", "display:block");
    var username = $('#txtusername').val();

    $.ajax({
        url: BaseUrl + "PmsLogin/GetUserOTPInfo",
        type: 'GET',
        data: { id: username },
        dataType: 'json',
        success: SuccessOtpInfoMethod,
        async: false,
        error: function (ex) {
            alert('Failed to retrieve Sub Categories : ' + ex);
        }
    });

    function SuccessOtpInfoMethod(jsonData) {
        if (jsonData.length != 0) {
            var OTP = $('#txtotp').val();
            var ValidOTP = false;
            for (let i = 0; i < jsonData.length; i++) {
                if (jsonData[i].vOTPNo == OTP) {
                    ValidOTP = true;
                    break;
                }
            }
            // alert("A" + ValidOTP);
            if (ValidOTP) {
                $('#txtVerify').val(true);
                //$(".login__submit").trigger("click");
            }
            else {
                alert("Not a Valid Enter otp !");
                $('#txtVerify').val('');
                //alert('Not a Valid Enter otp !')
                $("#loader").attr("style", "display:none");
                $("#txtotp").focus();
                return false;
            }

        }

        $.each(jsonData, function (i, items) {
            $("#ddlProfile").append($("<option></option>").val(this['vUserTypeCode']).html(this['vUserTypeName']));
        });
    }

    return true;
}