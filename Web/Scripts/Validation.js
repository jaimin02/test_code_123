//-------------------------------------------------------------------
// Validate Numeric Value(val, fieldname)
// Returns true if the value is numeric.
//-------------------------------------------------------------------
function isNumeric(val, fieldname) {
    if (isNaN(val) == true) {
        //alert("Please Enter a Numeric Value");
        document.all[fieldname].focus();
        document.all[fieldname].value = "";
        return true;
    }
    else {
        return false;
    }
}
//-------------------------------------------------------------------
// isBlank(value)
//   Returns true if value only contains spaces
//-------------------------------------------------------------------

function isBlank(FieldVal) {
    if (FieldVal == null) {
        return true;

    }
    for (var i = 0; i < FieldVal.length; i++) {
        if ((FieldVal.charAt(i) != ' ') && (FieldVal.charAt(i) != "\t") && (FieldVal.charAt(i) != "\r") && (FieldVal.charAt(i) != "\n")) {
            return false;
        }
    }
    return true;
}



///----------------------------------------------------------------------
/// for checking validations like numeric & non numeric etc
function checkVal(value, fieldname, val) {

    switch (val) {
        case '0':
            return true;
            break;
        case '1':
            var checkOK = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ";
            var checkStr = value;
            var allValid = true;
            for (i = 0; i < checkStr.length; i++) {
                ch = checkStr.charAt(i);
                for (j = 0; j < checkOK.length; j++)
                    if (ch == checkOK.charAt(j))
                        break;
                if (j == checkOK.length) {
                    allValid = false;
                    break;
                }
            }
            if (!allValid) {
                alert("Only space and letters are allowed.");
                document.all[fieldname].value = "";
                document.all[fieldname].focus();
                return (false);
            }
            break;
        case '2':

            var checkOK = "0123456789";
            var checkStr = value;
            var allValid = true;
            var allNum = "";
            for (i = 0; i < checkStr.length; i++) {
                ch = checkStr.charAt(i);
                for (j = 0; j < checkOK.length; j++)
                    if (ch == checkOK.charAt(j))
                        break;
                if (j == checkOK.length) {
                    allValid = false;
                    break;
                }
                if (ch != ",")
                    allNum += ch;
            }
            if (!allValid) {


                document.all[fieldname].value = "";
                document.all[fieldname].focus();
                return (false);
            }
            return true;
            break;

        case '3':
            var checkOK = "!@#$%^&*()_+-=\|;:<,>.?/";
            var checkStr = value;
            var allValid = true;
            for (i = 0; i < checkStr.length; i++) {
                ch = checkStr.charAt(i);
                for (j = 0; j < checkOK.length; j++)
                    if (ch == checkOK.charAt(j))
                        break;
                if (j == checkOK.length) {
                    allValid = false;
                    break;
                }
            }
            if (!allValid) {
                alert("only special characters are allowed.");
                document.all[fieldname].value = "";
                return (false);
            }
            break;

        case '4':
            var checkOK = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ";
            var checkStr = value;
            var allValid = true;
            for (i = 0; i < checkStr.length; i++) {
                ch = checkStr.charAt(i);
                for (j = 0; j < checkOK.length; j++)
                    if (ch == checkOK.charAt(j))
                        break;
                if (j == checkOK.length) {
                    allValid = false;
                    break;
                }
            }
            if (!allValid) {
                alert("Only letters and numeric characters are allowed.");
                document.all[fieldname].value = "";
                document.all[fieldname].focus();
                return (false);
            }
            return true;
            break;

        case '5':
            var checkOK = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=\|;:<,>.?/";
            var checkStr = value;
            var allValid = true;
            for (i = 0; i < checkStr.length; i++) {
                ch = checkStr.charAt(i);
                for (j = 0; j < checkOK.length; j++)
                    if (ch == checkOK.charAt(j))
                        break;
                if (j == checkOK.length) {
                    allValid = false;
                    break;
                }
            }
            if (!allValid) {
                alert("Only letters and special characters are allowed.");
                document.all[fieldname].value = "";
                document.all[fieldname].focus();
                return (false);
            }
            break;

        case '6':
            var checkOK = "0123456789!@#$%^&*()_+-=\|;:<,>.?/";
            var checkStr = value;
            var allValid = true;
            for (i = 0; i < checkStr.length; i++) {
                ch = checkStr.charAt(i);
                for (j = 0; j < checkOK.length; j++)
                    if (ch == checkOK.charAt(j))
                        break;
                if (j == checkOK.length) {
                    allValid = false;
                    break;
                }
            }
            if (!allValid) {
                alert("only numeric and special characters are allowed.");
                document.all[fieldname].value = "";
                return (false);
            }
            break;
        case '7':
            var checkOK = "0123456789.";
            var checkStr = value;
            var allValid = true;
            var allNum = "";
            for (i = 0; i < checkStr.length; i++) {
                ch = checkStr.charAt(i);
                for (j = 0; j < checkOK.length; j++)
                    if (ch == checkOK.charAt(j))
                        break;
                if (j == checkOK.length) {
                    allValid = false;
                    break;
                }
                if (ch != ",")
                    allNum += ch;
            }
            if (!allValid) {
                return (false);
            }
            return true;
            break;

        case '8':
            var checkStr = value;
            if (checkStr == "") {
                document.all[fieldname].value = "";
                //  document.all[fieldname].focus();
                return (false);
            }
            return true;
            break;

        case '9':
            var checkOK = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";
            var checkStr = value;
            var allValid = true;
            var allNum = "";
            for (i = 0; i < checkStr.length; i++) {
                ch = checkStr.charAt(i);
                for (j = 0; j < checkOK.length; j++)
                    if (ch == checkOK.charAt(j))
                        break;
                if (j == checkOK.length) {
                    allValid = false;
                    break;
                }
                if (ch != ",")
                    allNum += ch;
            }
            if (!allValid) {
                alert("Only Use _ as Special Character");
                document.all[fieldname].value = "";
                document.all[fieldname].focus();
                return (false);
            }
            return true;
            break;

        case '10':
            var checkOK = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=\|;:<,>.?/ ";
            var checkStr = value;
            var allValid = true;
            var allNum = "";
            for (i = 0; i < checkStr.length; i++) {
                ch = checkStr.charAt(i);
                for (j = 0; j < checkOK.length; j++)
                    if (ch == checkOK.charAt(j))
                        break;
                if (j == checkOK.length) {
                    allValid = false;
                    break;
                }
                if (ch != ",")
                    allNum += ch;
            }
            if (!allValid) {
                alert("Please Enter Proper Value");
                document.all[fieldname].value = "";
                document.all[fieldname].focus();
                return (false);
            }
            return true;
            break;

        case '11':
            var checkOK = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-. ";
            var checkStr = value;
            var allValid = true;
            var allNum = "";
            for (i = 0; i < checkStr.length; i++) {
                ch = checkStr.charAt(i);
                for (j = 0; j < checkOK.length; j++)
                    if (ch == checkOK.charAt(j))
                        break;
                if (j == checkOK.length) {
                    allValid = false;
                    break;
                }
                if (ch != ",")
                    allNum += ch;
            }
            if (!allValid) {
                alert("Special characters are not allowed. Please enter proper remarks");
                return (false);
            }
            return true;
            break;

        case '12':
            //var checkNo = "0123456789";
            //var checkChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";        
            var checkStr = value;
            // var allValid = true;
            //        for (i=0; i < checkStr.length; i++)
            //        {
            //            ch = checkStr.charAt(i);
            //            for (j = 0;  j < checkNo.length;  j++)
            //            {
            //                if (ch == checkNo.charAt(j))
            //                break;
            //                if (j == checkNo.length)
            //                {
            //                    allValid = false;
            //                    break;
            //                }
            //            } 
            //            for (j = 0;  j < checkChar.length;  j++)
            //            {
            //                if (ch == checkChar.charAt(j))
            //                break;
            //                if (j == checkChar.length)
            //                {
            //                    allValid = false;
            //                    break;
            //                }
            //            }
            //        }
            //        if (!allValid)
            //        {
            //        return (false);
            //        }
            //        return true;
            //           
            var alphaExp = "/^[0-9]+$/";
            var charExp = "/^[a-zA-Z]+$/";
            var num = "false";
            var ch = "false";
            var newPassword = checkStr;

            if (newPassword.match(alphaExp)) {
                num = "true";
            }
            else {
                num = "false";
            }
            if (newPassword.match(charExp)) {
                ch = "true";
            }
            else {
                ch = "false";
            }

            if (ch == "true" && num == "true")
                return false;
            else {
                return true;
            }
            return true;
            break;

        case '13':
            var checkOK = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            var checkStr = value;
            var allValid = true;
            for (i = 0; i < checkStr.length; i++) {
                ch = checkStr.charAt(i);
                for (j = 0; j < checkOK.length; j++)
                    if (ch == checkOK.charAt(j))
                        break;
                if (j == checkOK.length) {
                    allValid = false;
                    break;
                }
            }
            if (!allValid) {
                alert("Only Alphabets are allowed.");
                fieldname.value = "";
                fieldname.focus();
                return (false);
            }
            break;

        default: alert("oh u have all rights " + val);
    }
}

//--------------------------
//For Checking Date Format

function isDate(dateStr) {
    var datePat = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/;
    var matchArray = dateStr.match(datePat); // is the format ok?

    if (matchArray == null) {
        alert("Please enter date as either dd/mm/yyyy or dd-mm-yyyy.");
        return false;
    }

    day = matchArray[1]; // p@rse date into variables
    month = matchArray[3];
    year = matchArray[5];

    //month = matchArray[3]; // p@rse date into variables
    //day = matchArray[1];
    //year = matchArray[5];

    if (month < 1 || month > 12) { // check month range
        alert("Month must be between 1 and 12.");
        return false;
    }

    if (day < 1 || day > 31) {
        alert("Day must be between 1 and 31.");
        return false;
    }

    if ((month == 4 || month == 6 || month == 9 || month == 11) && day == 31) {
        alert("Month " + month + " doesn`t have 31 days!")
        return false;
    }

    if (month == 2) { // check for february 29th
        var isleap = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));
        if (day > 29 || (day == 29 && !isleap)) {
            alert("February " + year + " doesn`t have " + day + " days!");
            return false;
        }
    }
    return true; // date is valid
}


// Email Address Validation

function validemail(fieldname, fieldvalue) {
    var emailID = fieldname;
    var email = fieldvalue;

    if (echeck(email) == false) {

        document.all[fieldname].value = "";
        document.all[fieldname].focus();
        return false;
    }
    return true
}

function echeck(str) {

    var at = "@"
    var dot = "."
    var lat = str.indexOf(at)
    var lstr = str.length
    var ldot = str.indexOf(dot)

    if (str.indexOf(at) == -1) {
        return false;
    }

    if (str.indexOf(at) == -1 || str.indexOf(at) == 0 || str.indexOf(at) == lstr) {
        return false;
    }

    if (str.indexOf(dot) == -1 || str.indexOf(dot) == 0 || str.indexOf(dot) == lstr) {
        return false;
    }

    if (str.indexOf(at, (lat + 1)) != -1) {
        return false;
    }

    if (str.substring(lat - 1, lat) == dot || str.substring(lat + 1, lat + 2) == dot) {
        return false;
    }

    if (str.indexOf(dot, (lat + 2)) == -1) {
        return false;
    }

    if (str.indexOf(" ") != -1) {
        return false;
    }

    return true;
}


/// If "val" is BLANK or INTEGER then returns true
/// Else returns false
/// HERE User can Enter INTEGER Value or Leave it Blank
function CheckIntegerOrBlank(val) {
    var digitRegEx = /^[+/-]?\d*$/;

    if (!digitRegEx.test(val)) {
        return false;
    }
    else {
        return true;
    }
}


/// This function returns True if "val" is INTERGER
/// returns False if "val" is BLANK or NON-NUMERIC
/// Here user must enter INTEGER value
function CheckInteger(val) {
    var digitRegEx = /^[+/-]?\d+$/;

    if (!digitRegEx.test(val)) {
        return false;
    }
    else {
        return true;
    }
}

/// If "val" is BLANK or DECIMAL ex "123.00" then returns true
/// Else returns false Ex "113." 
/// HERE User can Enter DECIMAL/FLOAT Value or Leave it Blank
function CheckDecimalOrBlank(val) {
    var decimalRegEx = /^[+|-]?\d*(\.\d+)?$/;
    if (!decimalRegEx.test(val)) {
        return false;
    }
    else {
        return true;
    }
}

/// This function returns True if "val" is DECIMAL/FLOAT
/// returns False if "val" is BLANK or NON-NUMERIC
/// Here user must enter DECIMAL/FLOAT value
function CheckDecimal(val) {
    var decimalRegEx = /^[+|-]?\d+(\.\d+)?$/;
    if (!decimalRegEx.test(val)) {
        return false;
    }
    else {
        return true;
    }
}

/// If "val" is AlphaNumeric ex "asd123" then returns true
/// Else returns false 
function CheckAlphaNumeric(val) {
    //var AlphaNumericRegEx = /[a-zA-Z0-9]*/;
    var AlphaNumericRegEx = /^[0-9a-zA-Z.,\n\s]+$/;  //Modify by ketan
    if (!AlphaNumericRegEx.test(val)) {
        return false;
    }
    else {
        return true;
    }
}


/// If "val" is Alphabet ex "asdASDS" then returns true
/// Else returns false 
function CheckAlphabet(val) {
    var AlphaNumericRegEx = /[a-zA-Z]*/;
    if (!AlphaNumericRegEx.test(val)) {
        return false;
    }
    else {
        return true;
    }
}


function CompareDate(FromDt, ToDt) {
    var d1_str = FromDt;
    var d2_str = ToDt;

    d1_str = d1_str.replace(/-/g, '/');
    d2_str = d2_str.replace(/-/g, "/");

    //new Date Format is yyyy/mm/dd    
    d1 = new Date(d1_str.split('/')[2], ConvertMonthInt(d1_str.split('/')[1]), d1_str.split('/')[0]);
    d2 = new Date(d2_str.split('/')[2], ConvertMonthInt(d2_str.split('/')[1]), d2_str.split('/')[0]);

    if (d2.getTime() < d1.getTime()) {
        alert('Fromdate must be smaller then Todate');
        return false;
    }
    else {
        return true;
    }
}
function ConvertMonthInt(MonthNam) {
    switch (MonthNam.toUpperCase()) {
        case 'JAN':
        case 'JANUARY':
            return "01";
            break;
        case 'FEB':
        case 'FEBURARY':
            return "02";
            break;
        case 'MAR':
        case 'MARCH':
            return "03";
            break;
        case 'APR':
        case 'APRIL':
            return "04";
            break;
        case 'MAY':
            return "05";
            break;
        case 'JUN':
        case 'JUNE':
            return "06";
            break;
        case 'JUL':
        case 'JULY':
            return "07";
            break;
        case 'AUG':
        case 'AUGUST':
            return "08";
            break;
        case 'SEP':
        case 'SEPTEMBER':
            return "09";
            break;
        case 'OCT':
        case 'OCTOBER':
            return "10";
            break;
        case 'NOV':
        case 'NOVEMBER':
            return "11";
            break;
        case 'DEC':
        case 'DECEMBER':
            return "12";
            break;
    }
}


//Added by ketan
function formatTime(time, t) {
    var result = false, m;
    var re = /^\s*([01]?\d|2[0-3]):?([0-5]\d)\s*$/;
    if ((m = time.match(re))) {
        result = (m[1].length === 2 ? "" : "0") + m[1] + ":" + m[2];
    }
    else {
        t.value = "";
        alert("Please Enter Time in HHMM or HH:MM format only.");
    }
    return result;
}

function Dropdown_Validation(ddlId) {
    //var empty = document.getElementById(ddlId).value;
    var selectedValue = $(ddlId).val();
    if (selectedValue == 0) {
        //alert('Please select an item');
        return true;
    }
    else {
        return false;
    }

}

function CheckNumericLength(val, min, max) {
    if (val != "") {
        if (parseInt(val) < parseInt(min) || parseInt(val) > parseInt(max)) {
            return false;
        } else {
            return true;
        }
    }
    return true;

}


function CheckDecimalLength(val, min, max) {
    if (val != "") {
        if (parseFloat(val) < parseFloat(min) || parseFloat(val) > parseFloat(max)) {
            return false;
        } else {
            return true;
        }
    }
    return true;

}