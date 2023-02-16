var ModuleName = "Change Password";

$(function () {

    

    $("#BtnSubmit").on("click", function () {

        if (!CheckVal())
            return false;

         var PMSChangePwdDatat = {
            OldPassword: $('#txtOldPassWord').val(),
            NewPassword: $('#txtNewPassword').val(),
            ConfirmNewPassword: $('#txtNewConfPass').val(),
            iUserId: $("#hdnuserid").val(),
            iModifyBy: $("#hdnuserid").val(),
            cStatusIndi: 'N'
         }

         var Proc_PMSChangePwdDatat = {
             Url: BaseUrl + "PmsChangePwd/Insert_ChangePassword",
             SuccessMethod: "SuccessMethod",
             Data: PMSChangePwdDatat
         }

         $.ajax({
             url: Proc_PMSChangePwdDatat.Url,
             type: 'POST',
             data: Proc_PMSChangePwdDatat.Data,
             //async: false,
             success: SuccessMethod,
             error: function () {
                 SuccessorErrorMessageAlertBox("Error in process..", ModuleName);
             }
         });
        
         function SuccessMethod(jsonData) {
             if (jsonData == null) {
                 return false
             }
             $('#txtOldPassWord').val(''), // added by dharini 25-01-2023
             $('#txtNewPassword').val(''), // added by dharini 25-01-2023
             $('#txtNewConfPass').val('') // added by dharini 25-01-2023
             //var jsonDataTable = jsonData.Table
             //var jsonDataTable2 = jsonData.Table1

             //if (jsonDataTable.length > 0) {
             //    if (jsonDataTable[0]["Staus"] == "0") {
             //        SuccessorErrorMessageAlertBox(jsonDataTable2[0]["strMessage"], ModuleName);
             //        return false
             //    }
             //    if (jsonDataTable[0]["Staus"] == "1") {
             //        alert(jsonDataTable2[0]["strMessage"]);
             //        window.location.href = WebUrl + "PmsHome/Home";
             //        return true
             //    }
             //}
             SuccessorErrorMessageAlertBox("Password Updated Successfully !", ModuleName); // added by dharini 25-01-2023
         }

    });


    $("#btnCancel").on("click", function () {
        ConfirmAlertBox(ModuleName, WebUrl + "PmsHome/Home");

    });
    
})

function CheckVal() {
    var Password = document.getElementById('txtNewPassword').value;
    if (!checkVal(document.getElementById('txtOldPassWord').value, 'txtOldPassWord', '8')) {
        SuccessorErrorMessageAlertBox("Please enter Old Password.", ModuleName);
        $('#txtOldPassWord').focus();
        return false;
    }
    else if (!checkVal(document.getElementById('txtNewPassword').value, 'txtNewPassword', '8')) {
        SuccessorErrorMessageAlertBox("Please enter New Password.", ModuleName);
        $('#txtNewPassword').focus();
        return false;
    }

    else if (!checkVal(document.getElementById('txtNewConfPass').value, 'txtNewConfPass', '8')) {
        SuccessorErrorMessageAlertBox("Please enter New Confirm Password.", ModuleName);
        $('#txtNewConfPass').focus();
        return false;
    }

    else if (Password.length < 8) {
        SuccessorErrorMessageAlertBox("Password length should be minimum eight characters.", ModuleName);
        $('#txtNewPassword').focus();
        return false;
    }
    else if ((document.getElementById('txtNewConfPass').value != document.getElementById('txtNewPassword').value)) {
        SuccessorErrorMessageAlertBox("New Password and Confirm New Password does not match.", ModuleName);
        $('#txtNewConfPass').focus();
        return false;
    }

    else {
        return ValidatePassword();
    }
}

function ValidatePassword() {
    var passwordstrength = document.getElementById('txtNewPassword');
    var regex = new Array();
    regex.push("[A-Z]"); //Uppercase Alphabet.
    regex.push("[a-z]"); //Lowercase Alphabet.
    regex.push("[0-9]"); //Digit.
    regex.push("[-()<>!@#$%^&*]"); //Special Character.

    var passed = 0;
    for (var i = 0; i < regex.length; i++) {
        if (new RegExp(regex[i]).test(passwordstrength.value)) {
            passed++;
        }
    }

    if (passed > 3 && passwordstrength.value.length >= 8) {
        return true;
    }
    else {
        SuccessorErrorMessageAlertBox("Password must be minimum eight characters.\nPassword must contain at least 1 capital letter,\n\n1 small letter, 1 number and 1 special character.\n\nFor special characters you can pick one of these -,(,!,@,#,$,),%,<,>", ModuleName);
        return false;
    }

}

function RestrictSpace() {
    if (event.keyCode == 32) {
        return false;
    }
}