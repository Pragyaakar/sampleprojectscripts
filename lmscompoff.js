/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/log', 'N/record', 'N/ui/dialog', "N/runtime", "N/url", "N/https", "N/search", "N/email"],
    function (currentRecord, log, record, dialog, runtime, url, https, search, email) {

        function fieldChanged(scriptContext) {

        }

        function onSubmitForApproval() {

            var rec = currentRecord.get();
            var custRec = record.load({
                type: rec.type,
                id: rec.id
            });


            var leaveRec = custRec.setValue({
                fieldId: 'custrecord_lms_request_status',
                value: 3
            });
            custRec.save();
            window.location.reload();
        }

        function onApproveButtonClick() {


            var rec = currentRecord.get();

            var custRec = record.load({
                type: rec.type,
                id: rec.id
            });
            custRec.setValue({
                fieldId: 'custrecord_lms_request_status',
                value: 4
            });
            var CompOfId = custRec.save();
            window.location.reload();

        }

        function onRejectButtonClick() {

            var rec = currentRecord.get();
            var custRec = record.load({
                type: rec.type,
                id: rec.id
            });

            var suiteletURL = url.resolveScript({
                scriptId: "customscript_lms_comp_of_reject",
                deploymentId: "customdeploy_lms_comp_of_reject",
                returnExternalUrl: false,

            });
            suiteletURL += '&recordId=' + rec.id + '&recordType=' + rec.type;
            nlExtOpenWindow(suiteletURL, 'Reject Reason', 400, 300);
            var reject = custRec.setValue({
                fieldId: ' custrecord_lms_request_status',
                value: 5
            }); // reject status
            var reason = custRec.getText('custrecord_compoff_reason');
            custRec.save();



        }






        return {
            fieldChanged: fieldChanged,
            onApproveButtonClick: onApproveButtonClick,
            onRejectButtonClick: onRejectButtonClick,
            onSubmitForApproval: onSubmitForApproval

        };

    });

function isNotEmpty(value) {
    if (value != null && value != 'undefined' && value != undefined && value != '' && value != NaN && value != 'NaN' && value != '- None -')
        return true;
    else
        return false;
}

function isEmpty(value) {
    if (value == null && value == 'undefined' && value == undefined && value == '' && value == NaN && value == 'NaN' && value == '- None -')
        return true;
    else
        return false;
} //