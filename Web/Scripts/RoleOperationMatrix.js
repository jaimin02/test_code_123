var nOperationNo;
var strmenu = "";
var childform;
var checkedNodes = [];
var dataProfile = "";
var datatreeView;
$(document).ready(function () {
    GetUserTypeList();
});

function GetUserTypeList() {
    jsonData = "";
    var ExecuteDataSetData = {
        Table_Name_1: "UserTypeMst",
        WhereCondition_1: "cStatusIndi <> 'C'",
        DataRetrieval_1: 3,
    }
    GetJsonData(ExecuteDataSetData);
    $("#ddlUserType").empty().append('<option selected="selected" value="">Please Select User Type</option>');
    for (var i = 0; i < jsonData.length; i++) {
        $("#ddlUserType").append($("<option></option>").val(jsonData[i].vUserTypeCode).html(jsonData[i].vUserTypeName));
    }
}

$("#ddlUserType").on("change", function () {
    if (this.value.toString() == "") {
        $('#btnSaveDetails').attr("disabled", true);
        return false;
    }
    GetOperationDetails(this.value);
    $('#btnSaveDetails').attr("disabled", false);
});

function GetOperationDetails(e) {   
    var Url = BaseUrl + "RecordFetcher/ExecuteDataTable";
    var ExecuteDataSetData = {
        Table_Name_1: "Execute Proc_GetRoleOperationMatrix '" + e + "'",
        //WhereCondition_1: "cStatusIndi <> 'C'",
        DataRetrieval_1: 4
    }
    GetJsonData(ExecuteDataSetData);


    var childform = jsonData;
    var strmenu = "";
    var cFlag;
    dataProfile = "";
    for (var i = 0; i < jsonData.length; i++) {
      
        cFlag = 0;
        if (jsonData[i].vParentOperationCode == "-999" && jsonData[i].vOperationName != "Home") {

            strmenu += '{id: "' + jsonData[i].vOperationCode + '", text: "' + jsonData[i].vOperationName + '", expanded: true, spriteCssClass: "rootfolder",items:[';

            for (var j = i; j < childform.length; j++) {
                if (jsonData[i].vOperationCode == childform[j].vParentOperationCode) {
                    strmenu += '{id: "' + childform[j].vOperationCode + '", text: "' + childform[j].vOperationName + '", expanded: true, spriteCssClass: "folder"';

                    if (childform[j].cActive == "Y") {
                        strmenu += ", checked: true";
                        dataProfile += childform[j].vOperationCode + ",";
                        cFlag = 1;
                    }
                strmenu += "},";

                }
            }
            if (cFlag == 1) {
                dataProfile = jsonData[i].vOperationCode + "," + dataProfile;
            }
            strmenu = strmenu.substr(0, strmenu.length - 1) + ']},';
       }
    }

    strmenu = '[' + strmenu.substr(0, strmenu.length - 1) + ']';
    var data = eval('(' + strmenu + ')');
   
    var Categories = new kendo.data.HierarchicalDataSource({
        data: data,
    });

    var obj = $("#treeview").parent();
    $("#treeview").remove();
    obj.append("<div id='treeview'>");
    datatreeView = $("#treeview").kendoTreeView({
        checkboxes: {
            checkChildren: true
        },

        check: onCheck,
        dataSource: Categories,
    });

    // function that gathers IDs of checked nodes
    function checkedNodeIds(nodes, checkedNodes) {
        var flag = 0;
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].checked && !nodes[i].hasChildren) {
                if (nodes.parent("li[role='treeitem']") != undefined) {
                    for (var iCheckIndex = 0; iCheckIndex < checkedNodes.length; iCheckIndex++) {
                        if (checkedNodes[iCheckIndex] == nodes.parent("li[role='treeitem']").id) {
                            flag = 1;
                            break;
                        }
                    }
                    if (flag == 0) {
                        checkedNodes.push(nodes.parent("li[role='treeitem']").id);
                    }
                }
                checkedNodes.push(nodes[i].id);
            }

            if (nodes[i].hasChildren) {
                checkedNodeIds(nodes[i].children.view(), checkedNodes);
            }
        }
    }

    // show checked node IDs on datasource change
    function onCheck() {
        checkedNodes = [];
        var treeView = $("#treeview").data("kendoTreeView"),
            message;

        checkedNodeIds(treeView.dataSource.view(), checkedNodes);

        if (checkedNodes.length > 0) {
            message = "IDs of checked nodes: " + checkedNodes.join(",");
        } else {
            message = "No nodes checked.";
        }

        //$("#result").html(message);
    }
    //}
}


$("#btnSaveDetails").on("click", function () {
    var SaveRoleOperationData = {
        nRoleOperationno: 0,
        vUserTypeCode: $('#ddlUserType').val(),
        vOperationCode: 0,
        iModifyBy: document.getElementById('hdnuserid').value,
        cStatusIndi: 'E'
    };
    dataProfile = dataProfile.substr(0, dataProfile.length - 1);
    var Profiledata = dataProfile.split(",");
    for (var iIndex = 0; iIndex < checkedNodes.length; iIndex++) {
        SaveRoleOperationData["vOperationCode"] = checkedNodes[iIndex];
        //alert(SaveRoleOperationData["cStatusIndi"] + " - " + SaveRoleOperationData["nOperationNo"]);
        SaveRoleOperationMatrix(BaseUrl + "PmsRoleOperationMatrix/save_RoleOperationMatrix", "SuccessMethod", SaveRoleOperationData);
        $(Profiledata).each(function (e) {
            if ($(Profiledata)[e] == checkedNodes[iIndex]) {
                Profiledata.splice(e, 1);
            }
        });
    }
    if ($(Profiledata)[0] != "" && (Profiledata)[0] != "undefined" ) { // option added by dharini 13-12-2022 
        for (var iIndex = 0; iIndex < $(Profiledata).length; iIndex++) {
            SaveRoleOperationData["cStatusIndi"] = "C";
            SaveRoleOperationData["vOperationCode"] = $(Profiledata)[iIndex];
            //alert(SaveRoleOperationData["cStatusIndi"] +" - "+SaveRoleOperationData["nOperationNo"]);
            SaveRoleOperationMatrix(BaseUrl + "PmsRoleOperationMatrix/save_RoleOperationMatrix", "SuccessMethod", SaveRoleOperationData);
        }
    }
    //SaveOperationMaster(BaseUrl + "RecordSaver/save_OperationMaster", "SuccessMethod", SaveOperationMasterData);
    alert("Role Operation Matrix details Saved Successfully.");
    $("#ddlUserType").val('');
    var obj = $("#treeview").parent();
    $("#treeview").remove();
    obj.append("<div id='treeview'>");
});



var SaveRoleOperationMatrix = function (Url, SuccessMethod, Data) {
    $.ajax({
        url: Url,
        type: 'POST',
        data: Data,
        async: false,
        success: SuccessInsertData,
        error: function () {
            alert("Error while saving details of Role Operation Matrix Details.");
        }
    });

    function SuccessInsertData(response) {

    }
}