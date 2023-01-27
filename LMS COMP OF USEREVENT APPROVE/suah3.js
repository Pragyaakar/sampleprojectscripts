/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 */
define(["N/ui/serverWidget", "N/log", "N/record", "N/url", "N/email"], function (
    serverWidget,
    log,
    record,
    url,
    email
) {
    /**
     * @param {SuiteletContext.onRequest} context
     */
    function onRequest(context) {
        try {
            var requestparam = context.request.parameters;
            var rec_id = requestparam.recordId;
            var rec_type = requestparam.recordType;
            var firstapp = requestparam.firstapp;
            var documentNumber_doc = requestparam.documentNumber;
            var custEmail = requestparam.custEmail;
            if (context.request.method === "GET") {

                // var newid = JSON.parse(rec_id);
                // var newtype = JSON.parse(rec_type);
                log.debug("rec_id", rec_id);
                log.debug("firstapp ", firstapp);
                log.debug("documentNumber ", documentNumber);
                log.debug("custEmail", custEmail);
                //    log.debug("newid ",newid );
                //    log.debug("newtype",newtype);


                var form = serverWidget.createForm({
                    id: "reject",
                    title: "Reject",
                })
                //  form.clientScriptModulePath = 'SuiteScripts/ApproveButtonClientScript.js';
                var select = form.addField({
                    id: "custpage_reason",
                    type: serverWidget.FieldType.TEXT,
                    label: "Reason for Rejecting the Record"

                });
                select.isMandatory = true;
                var selid = form.addField({
                    id: "custpage_recid",
                    type: serverWidget.FieldType.TEXT,
                    label: "Record ID"

                });
                selid.defaultValue = rec_id;
                selid.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                var seltype = form.addField({
                    id: "custpage_rectype",
                    type: serverWidget.FieldType.TEXT,
                    label: "Record Type"

                });
                seltype.defaultValue = rec_type;
                seltype.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                var f_app = form.addField({
                    id: "custpage_firstapp",
                    type: serverWidget.FieldType.TEXT,
                    label: "Record Type"

                });
                f_app.defaultValue = firstapp;
                log.debug(" f_app", f_app);
                f_app.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                var custemail = form.addField({
                    id: "custpage_email",
                    type: serverWidget.FieldType.TEXT,
                    label: "Email Id"

                });
                custemail.defaultValue = custEmail;
                custemail.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                var documentNumber = form.addField({
                    id: "custpage_doc",
                    type: serverWidget.FieldType.TEXT,
                    label: "Document Number"

                });
                documentNumber.defaultValue = documentNumber_doc;
                documentNumber.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                form.addSubmitButton({
                    label: "Submit",
                })


                context.response.writePage(form)


            } else {



                var reasonField = context.request.parameters.custpage_reason;
                var saveid = context.request.parameters.custpage_recid;
                var savetype = context.request.parameters.custpage_rectype;
                var fstapp = context.request.parameters.custpage_firstapp;
                var custEmail = context.request.parameters.custpage_email;
                var documentNumber = context.request.parameters.custpage_doc;
                // log.debug("rec_id inside else part ", rec_id  );
                log.debug("fstapp ", fstapp);
                log.debug("saveid ", saveid);
                log.debug("savetype", savetype);
                log.debug("reasonField", reasonField);
                log.debug("custEmail", custEmail);
                log.debug("documentNumber", documentNumber);
                var otherId = record.submitFields({
                    type: savetype,
                    id: saveid,
                    values: {
                        'custbody_rejreason': reasonField,
                        'custbody_ah_rejected_by': fstapp,
                        'custbody_ah_next_approver': null
                    }
                });

                // context.response.write('Reason for rejection noted');


                var html = '<html>';

                if (fstapp != null && fstapp != '' && fstapp != undefined) {

                    html += '<head><style>table {border-collapse: collapse;border: 1px solid black;} th, td {border: 1px solid black;padding: 8px;}</style></head>';
                }
                html += '<body>Hi ' + custEmail + ',<br/><br/>Your PO - ' + documentNumber + '  is rejected  with reason - ' + reasonField + ' <br/><br/>';

                html += '<br/><br/>Thanks.</body></html>';
                email.send({
                    author: fstapp,
                    recipients: [custEmail],
                    cc: [custEmail],
                    subject: 'PO - ' + documentNumber + ' is rejected.',
                    body: html,

                });
                context.response.write('Reason for rejection noted');
                // context.response.write("<script>window.opener.location.reload(); </script>");
                // context.response.write("<script>window.opener.location.reload(); </script>");
                context.response.write("<script>parent.location.reload();</script>");



            }

        } catch (e) {
            log.debug('onRequest:error', e);
        }
    }
    return {
        onRequest: onRequest,
    }
})