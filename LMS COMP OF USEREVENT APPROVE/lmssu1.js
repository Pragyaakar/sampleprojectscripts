/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 */
define(["N/ui/serverWidget", "N/log", "N/record", "N/url", "N/email", "N/runtime", "N/search"], function (
    serverWidget,
    log,
    record,
    url,
    email,
    runtime, search
) {
    /**
     * @param {SuiteletContext.onRequest} context
     */
    function onRequest(context) {
        try {
            var requestparam = context.request.parameters;
            var rec_id = requestparam.recordId;
            var rec_type = requestparam.recordType;
            var rejectapp = requestparam.author;
            var leaverecid = requestparam.leaveID;
            var custEmail = requestparam.leaveEmpVal;
            //var rejname = requestparam.auname;
            var requestname = requestparam.leaveEmp;
            if (context.request.method === "GET") {

                // var newid = JSON.parse(rec_id);
                // var newtype = JSON.parse(rec_type);
                log.debug("rec_id", rec_id);
                log.debug("rec_type ", rec_type);
                log.debug("rejectapp ", rejectapp);
                log.debug("leaverecid ", leaverecid);
                log.debug("custEmail", custEmail);
                // log.debug("rejname", rejname);
                log.debug("requestname", requestname);
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
                f_app.defaultValue = rejectapp;
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
                documentNumber.defaultValue = leaverecid;
                documentNumber.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                var leaveReq = form.addField({
                    id: "custpage_empname",
                    type: serverWidget.FieldType.TEXT,
                    label: "Employee Name"

                });
                leaveReq.defaultValue = requestname;
                leaveReq.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                // var rejectApp = form.addField({
                //     id: "custpage_newapp",
                //     type: serverWidget.FieldType.TEXT,
                //     label: "Rejector Name"

                // });
                // rejectApp.defaultValue = rejname;
                // rejectApp.updateDisplayType({
                //     displayType: serverWidget.FieldDisplayType.HIDDEN
                // });
                form.addSubmitButton({
                    label: "Submit",
                })


                context.response.writePage(form)


            } else {



                var reasonField = context.request.parameters.custpage_reason;
                var saveid = context.request.parameters.custpage_recid;
                var savetype = context.request.parameters.custpage_rectype;
                var emailsend = context.request.parameters.custpage_firstapp;
                var emailrec = context.request.parameters.custpage_email;
                var lrecord = context.request.parameters.custpage_doc;
                var ename = context.request.parameters.custpage_empname;
                var empl = context.request.parameters.custpage_email;
                //var senderName = context.request.parameters.custpage_newapp;
                // log.debug("rec_id inside else part ", rec_id  );
                log.debug("emailsend", emailsend);
                log.debug("saveid ", saveid);
                log.debug("savetype", savetype);
                log.debug("reasonField", reasonField);
                log.debug("emailrec", emailrec);
                log.debug("lrecord", lrecord);
                log.debug("ename", ename);
                //log.debug("senderName", senderName);
                var userId = runtime.getCurrentUser().id;
                var loadR = search.lookupFields({
                    type: savetype,
                    id: saveid,
                    columns: ['custrecord_lms_approval_status']
                });
                log.debug("lookup value", loadR['custrecord_lms_approval_status'][0]["value"]);
                statusL = loadR['custrecord_lms_approval_status'][0]["value"];
                if (statusL == 7) {
                    var otherId = record.submitFields({
                        type: savetype,
                        id: saveid,
                        values: {
                            'custrecord_lms_leave_reasons': " WITHDRAWN REASON :- " + reasonField + "  : --WITHDRWAN DATE : " + new Date().toLocaleDateString()

                        }
                    });
                } else if (statusL == 8) {
                    var otherId = record.submitFields({
                        type: savetype,
                        id: saveid,
                        values: {
                            'custrecord_lms_leave_reasons': " CANCEL REASON :- " + reasonField + "  : --CANCELLED DATE : " + new Date().toLocaleDateString()

                        }
                    });
                } else if (statusL == 10) {
                    var otherId = record.submitFields({
                        type: savetype,
                        id: saveid,
                        values: {
                            'custrecord_lms_rejection_reason': 'REJECTED "APPROVED LEAVE CANCEL REQUEST " : REASON :  ' + reasonField + "  --REJECTED DATE : " + new Date().toLocaleDateString()

                        }
                    });
                } else if (statusL == 5) {
                    var otherId = record.submitFields({
                        type: savetype,
                        id: saveid,
                        values: {
                            'custrecord_lms_rejection_reason': "REJECTED REQUEST " + reasonField + "  --REJECTED DATE : " + new Date().toLocaleDateString()

                        }
                    });
                    log.debug("Test before mail");
                    // context.response.write('Reason for rejection noted');
                    var html = '<html>';
                    html += '<body>Hi ' + ename + ',<br/><br/>Your Leave Request' + lrecord + '  is rejected  with reason -<--- ' + reasonField + '.---><br/><br/>';

                    html += '<br/><br/>Thanks.</body></html>';
                    email.send({
                        author: emailsend,
                        recipients: emailrec,
                        subject: 'LEAVE REQUEST - ' + lrecord + ' is Rejected.',
                        body: html,

                    });
                    log.debug("Test after mail");


                }

                context.response.write('Reason Noted. . ...');
                // context.response.write("<script>window.opener.location.reload(); </script>");
                // context.response.write("<script>window.opener.location.reload(); </script>");
                context.response.write("<script>parent.location.reload();</script>");



            }

        } catch (e) {
            log.debug('onRequest:error', e);
        }
    }
    return {
        onRequest: onRequest
    }
})