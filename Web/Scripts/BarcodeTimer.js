var inputStart, inputStop, firstKey, lastKey, timing, userFinishedEntering;
var minChars = 10;

$("#txtOuterBarcode").keypress(function (e) {
   

   
    if (timing) {
        clearTimeout(timing);
    }

   
    if (e.which == 13) {
        e.preventDefault();
        if ($("#txtOuterBarcode").val().length >= minChars) {
            userFinishedEntering = true; 
            inputComplete();
        }
    }
    else {
        inputStop = performance.now();
        lastKey = e.which;
        userFinishedEntering = false;
        if (!inputStart) {
            firstKey = e.which;
            inputStart = inputStop;
            $("body").on("blur", "#txtOuterBarcode", inputBlur);
        }
        timing = setTimeout(inputTimeoutHandler, 50);
    }
});


function inputBlur() {
    clearTimeout(timing);
    if ($("#txtOuterBarcode").val().length >= minChars) {
        userFinishedEntering = true;
        inputComplete();
    }
};

function isScannerInput() {
    //if ($("#txtOuterBarcode").prop('checked') == false) {
        if ((inputStop - inputStart) <= 300 && (inputStop - inputStart) >= 38) {
            return true;
        }
        else {
            $("#txtOuterBarcode").val("");
            inputStart = null;
            return false;
        }

  
}


function isUserFinishedEntering() {
    return !isScannerInput() && userFinishedEntering;
}

function inputTimeoutHandler() {
    clearTimeout(timing);
    if (!isUserFinishedEntering() || $("#txtOuterBarcode").val().length < 12) {
        return;
    }
    else {
        reportValues();
    }
}

function inputComplete() {
    $("body").off("blur", "#txtOuterBarcode", inputBlur);
    reportValues();
}

function reportValues() {

    if (!inputStart) {

        $("#txtOuterBarcode").focus().select();
    } else {
        var inputMethod = isScannerInput() ? "Scanner" : "Keyboard";
        $("#txtOuterBarcode").focus().select();
        inputStart = null;
    }
}

$("#txtOuterBarcode").focus();