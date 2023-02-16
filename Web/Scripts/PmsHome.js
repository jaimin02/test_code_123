

$(document).ready(function () {
    
    UserAuthentication();
});
function UserAuthentication() {
    var username = $('#hdnUserName').val();
    //var password = 'sarjen123';
    var usertypecode = $('#hdnUserTypeCode').val();
    var loginDetails = {
        vUserName: username,
        vUserTypeCode: usertypecode
    };
    $.ajax({
        url: BaseUrl + "PmsLogin/PostLoginAuthentication",
        type: 'POST',
        data: loginDetails,
        dataType: 'json',
        async: false,
        success: LoginAuthentication_Success,
        error: function (ex) {
            //alert('Login Failed. Try Again.!: ' + ex);
        }
    });
}
function LoginAuthentication_Success(jsonData) {
    //var result = true;
    if (jsonData.Data.length != 0) {
        window.sessionStorage.setItem("UserNameWithProfile", jsonData.Data[0].UserNameWithProfile);
        var UserDetails = {};
        UserDetails.iUserId = jsonData.Data[0].iUserId;
        UserDetails.vUserName = jsonData.Data[0].vUserName;
        UserDetails.vLoginName = jsonData.Data[0].vLoginName;
        UserDetails.vLoginPass = jsonData.Data[0].vLoginPass;
        UserDetails.vUserTypeCode = jsonData.Data[0].vUserTypeCode;
        UserDetails.vUserTypeName = jsonData.Data[0].vUserTypeName;
        UserDetails.vLocationCode = jsonData.Data[0].vLocationCode;
        UserDetails.vLocationName = jsonData.Data[0].vLocationName;
        UserDetails.vTimeZoneName = jsonData.Data[0].vTimeZoneName;
        UserDetails.vFirstName = jsonData.Data[0].vFirstName;
        UserDetails.vLastName = jsonData.Data[0].vLastName;
        UserDetails.nScopeNo = jsonData.Data[0].nScopeNo;
        UserDetails.vScopeName = jsonData.Data[0].vScopeName;
        UserDetails.vScopeValues = jsonData.Data[0].vScopeValues;
        UserDetails.iWorkflowStageId = jsonData.Data[0].iWorkflowStageId;
        UserDetails.UserNameWithProfile = jsonData.Data[0].UserNameWithProfile;
        UserDetails.OperationCode = $("#hdnOprationCode").val();

        $.ajax({
            type: "POST",
            url: WebUrl + "PMSHome/UserDetails",
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
    else {
        $('#txtusername').val('');
        $('#txtpassword').val('');
        $('#ddlProfile').val('');
        $('#ddlProfile').empty();
        //alert('Login Failed. Try Again.! ');
        result = false;
    }
    return result;
}