/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 */
define(["N/ui/serverWidget", "N/log", "N/record"], function (
    serverWidget,
    log,
    record
) {
    /**
     * @param {SuiteletContext.onRequest} context
     */
    function onRequest(context) {
        try {
            if (context.request.method === "GET") {
                var form = serverWidget.createForm({
                    id: "reject",
                    title: "Reject",
                })
                var select = form.addField({
                    id: "custpage_reason",
                    type: serverWidget.FieldType.TEXT,
                    label: "Reason for Rejecting the Record"

                });
                var idField = form.addField({
                    id: "custpage_id",
                    type: serverWidget.FieldType.TEXT,
                    label: "Id"

                });
                idField.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                })
                idField.defaultValue = context.request.parameters["recordId"];
                TypeField = form.addField({
                    id: "custpage_type",
                    type: serverWidget.FieldType.TEXT,
                    label: "Type"

                });
                TypeField.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                })
                TypeField.defaultValue = context.request.parameters["recordType"];
                form.addSubmitButton({
                    label: "Submit Reason",
                })


                context.response.writePage(form)


            } else {




                var saveId = context.request.parameters["custpage_id"];
                var saveType = context.request.parameters["custpage_type"];
                log.debug("Id password", saveId + "--" + saveType)
                var otherId = record.load({
                    type: "customrecord_lms_comp_off_",
                    id: saveId,
                    isDynamic: true
                });
                log.debug("ID and type", saveType + saveId);
                otherId.setValue({
                    fieldId: 'custrecord1473',
                    value: context.request.parameters["custpage_reason"]
                });
                otherId.setValue({
                    fieldId: 'custrecord_lms_request_status',
                    value: 5
                });
                log.debug("ID and type", saveType + saveId);
                otherId.save();
                context.response.write("<script>parent.location.reload();</script>");



            }

        } catch (e) {
            log.error();
            (e.name, e.message);
        }
    }
    return {
        onRequest: onRequest,
    }
})