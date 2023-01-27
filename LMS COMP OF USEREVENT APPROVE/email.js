/** 
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */

define(['N/record', 'N/search', 'N/runtime', 'N/ui/serverWidget', 'N/email'],
    function (record, search, runtime, serverWidget, email) {

        function afterSubmit(scriptContext) {
            try {
                log.debug('scriptContext.type', scriptContext.type);

                var newRecord = scriptContext.newRecord;
                var poRec = record.load({
                    type: newRecord.type,
                    id: newRecord.id
                });

                var obj_record = scriptContext.newRecord;
                var i_recordId = scriptContext.newRecord.id;
                var s_record_type = scriptContext.newRecord.type;
                var currentrecord = scriptContext.currentRecord;
                var user = runtime.getCurrentUser();
                log.debug("user", user);

                if (scriptContext.type == scriptContext.UserEventType.EDIT) {
                    var status = poRec.getValue({
                        fieldId: 'custbody_ah_approval_status'
                    });
                    log.debug('status', status);
                    var documentsNumber = newRecord.getValue({
                        fieldId: 'tranid'
                    });
                    log.debug('documentNumbertest', documentsNumber);
                    var documentNumber = poRec.getValue({
                        fieldId: 'tranid'
                    });
                    log.debug('documentNumber', documentNumber);
                    var firstapp = newRecord.getValue({
                        fieldId: 'custbody_ah_first_approver'
                    });
                    log.debug("firstapp ", firstapp);
                    var firstappt = newRecord.getText({
                        fieldId: 'custbody_ah_first_approver'
                    });
                    log.debug("firstappt text value", firstappt);
                    var secondapp = newRecord.getValue({
                        fieldId: 'custbody_ah_second_approver'
                    });
                    log.debug("secondapp ", secondapp);
                    var thirdapp = newRecord.getValue({
                        fieldId: 'custbody_ah_third_approver'
                    });
                    log.debug("thirdapp ", thirdapp);
                    var fourthapp = newRecord.getValue({
                        fieldId: 'custbody_ah_fourth_approver'
                    });
                    log.debug("fourthapp ", fourthapp);
                    var fifthapp = newRecord.getValue({
                        fieldId: 'custbody_ah_fifth_approver'
                    });
                    log.debug("fifthapp ", fifthapp);
                    var sixthapp = newRecord.getValue({
                        fieldId: 'custbody_ah_sixth_approver'
                    });
                    log.debug("sixthapp ", sixthapp);
                    var seventhapp = newRecord.getValue({
                        fieldId: 'custbody_ah_seventh_approver'
                    });
                    log.debug("seventhapp ", seventhapp);

                    var userObj = runtime.getCurrentUser();
                    log.debug("userObj ", userObj);
                }

                // var subject = 'Purchase Order';
                // var authorId = 1667;//internal id of the sender  
                // var recipientEmail = 'vaishnavi.late@infosys.com';

                // Lookup Start For Customer
                var author = user.id;
                log.debug('author ', author);


                var custNumber = newRecord.getValue({
                    fieldId: 'custbody_ah_first_approver'
                });
                log.debug('custNumber', custNumber);

                //array = [firstapp, secondapp, thirdapp, fourthapp,fifthapp, sixthapp, seventhapp ]
                //log.debug("array.length", array.length);

                //for (var i = 0; i <= array.length; i++){
                // if (Approved by ==  )

                //var custNumber = newRecord.getValue({
                //  fieldId: 'custbody_ah_first_approver'
                //});
                //log.debug('custNumber', custNumber);

                //var custNumber = newRecord.getText({
                //  fieldId: 'custbody_ah_first_approver'
                //});
                //log.debug('custNumber', custNumber);

                //}

                var custEmail = "";

                if (custNumber) {
                    var customerLookup = search.lookupFields({
                        type: search.Type.EMPLOYEE,
                        id: custNumber,
                        columns: ['email']
                    });
                    log.debug('customerLookup', customerLookup);

                    if (customerLookup != '') {
                        custEmail = customerLookup.email;
                    }
                    log.debug('custEmail: ' + custEmail);
                } else {
                    custEmail = '';
                }
                // Lookup End For Customer


                //  email.send({
                //      author: author,
                //      recipients: custEmail,
                //      subject: subject,
                //      body:'test mail'
                //  });
                //  log.debug('email');

                var html = '<html>';
                if (firstapp != null && firstapp != '' && firstapp != undefined) {
                    html += '<head><style>table {border-collapse: collapse;border: 1px solid black;} th, td {border: 1px solid black;padding: 8px;}</style></head>';
                }
                html += '<body>Hi ' + firstappt + ',<br/><br/>PO - ' + documentNumber + ' is Pending Approval.<br/><br/>';

                html += '<br/><br/>Thanks.</body></html>';
                email.send({
                    author: author,
                    recipients: custEmail,
                    subject: 'PO - ' + documentNumber + ' is pending approval.',
                    body: html,

                });
                log.debug('Email sent', 'document Number - ' + documentNumber);

            } catch (err) {
                log.error('Error occurred in beforeload function', err);
            }
        }

        return {
            afterSubmit: afterSubmit
        };
    });