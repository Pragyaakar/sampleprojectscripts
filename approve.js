/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 * @author Aakanksha
 * @date 16/01/23
 */
define(['N/currentRecord', 'N/log', 'N/record', 'N/ui/dialog', "N/runtime", "N/url", "N/https", "N/search", "N/email"],
    function (currentRecord, log, record, dialog, runtime, url, https, search, email) {
        /**
         * Function to be executed after page is initialized.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
         *
         * @since 2015.2
         */
        function pageInit(scriptContext) {
            // this code is used to set the value of status,approvedBy,NextapprovedBy,rejectedBy in make copy mode

        }

        /**
         * Function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @since 2015.2
         */
        function fieldChanged(scriptContext) {

        }
        /**
         * Function to be executed when field is slaved.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field namev
         *
         * @since 2015.2
         */
        function postSourcing(scriptContext) {

        }
        /**
         * Function to be executed after sublist is inserted, removed, or edited.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @since 2015.2
         */
        function sublistChanged(scriptContext) {

        }
        /**
         * Function to be executed after line is selected.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @since 2015.2
         */
        function lineInit(scriptContext) {

        }
        /**
         * Validation function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @returns {boolean} Return true if field is valid
         *
         * @since 2015.2
         */
        function validateField(scriptContext) {

        }

        /**
         * Validation function to be executed when sublist line is committed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateLine(scriptContext) {

        }

        /**
         * Validation function to be executed when sublist line is inserted.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateInsert(scriptContext) {

        }

        /**
         * Validation function to be executed when record is deleted.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateDelete(scriptContext) {

        }

        /**
         * Validation function to be executed when record is saved.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @returns {boolean} Return true if record is valid
         *
         * @since 2015.2
         */
        function saveRecord(scriptContext) {

        }

        function onSubmitForApproval() {

            var rec = currentRecord.get();
            var custRec = record.load({
                type: rec.type,
                id: rec.id
            });
            var user = runtime.getCurrentUser();
            var author = user.id;
            var documentNumber = custRec.getValue({
                fieldId: 'tranid'
            });
            var status = custRec.getValue({
                fieldId: 'custbody_ah_approval_status'
            });
            var newdept = custRec.getValue({
                fieldId: 'department'
            });
            var newloc = custRec.getValue({
                fieldId: 'location'
            });
            var newcls = custRec.getValue({
                fieldId: 'class'
            });
            var newposeg = custRec.getValue({
                fieldId: 'custbody22'
            });
            var newsubs = custRec.getValue({
                fieldId: 'subsidiary'
            });

            var customrecord_appruleSearchObj = search.create({
                type: "customrecord538",
                filters: [
                    ["custrecordcustrecord_presubs", "anyof", newsubs],
                    "AND",
                    ["custrecordcustrecord_predept", "anyof", newdept],
                    "AND",
                    ["custrecordcustrecord_precls", "anyof", newcls],
                    "AND",
                    ["custrecordcustrecord_preloc", "anyof", newloc],
                    "AND",
                    ["custrecord1466", "anyof", newposeg]
                ],
                columns: [
                    search.createColumn({
                        name: "custrecord1471",
                        label: "Preference Link"
                    }),
                    search.createColumn({
                        name: "custrecordcustrecord_prefirst",
                        label: "First Approver"
                    })
                ]
            });

            var searchResult = customrecord_appruleSearchObj.run().getRange({
                start: 0,
                end: 10
            });
            if (searchResult.length != 0) {
                var newnext = searchResult[0].getValue({
                    name: "custrecordcustrecord_prefirst",
                    label: "First Approver"
                });
                var info = searchResult[0].getValue({
                    name: "custrecord1471",
                    label: "info field"
                });
                var purchId = record.submitFields({
                    type: rec.type,
                    id: rec.id,
                    values: {
                        'custbody_ah_approval_status': 6,
                        'custbody23': info,
                        'custbody_ah_next_approver': newnext,
                        'custbody_ah_temp': 7
                    }
                });
                sendEmailPending(newnext, documentNumber, author);
            }
            window.location.reload()
        }

        function onApproveButtonClick() {
            var rec = currentRecord.get();
            // do whatever processing...
            var custRec = record.load({
                type: rec.type,
                id: rec.id
            });
            var firstapp = custRec.getValue('custbody_ah_next_approver');
            var firstappt = custRec.getText('custbody_ah_next_approver');
            var user = runtime.getCurrentUser();
            var author = user.id;
            var documentNumber = custRec.getValue({
                fieldId: 'tranid'
            });
            var custEmail = custRec.getValue('custbody_ah_cl_created_by');
            var ll_lastap = custRec.getValue('custbody_ah_last_approved_by');
            var arrap = [];
            if (isNotEmpty(firstapp)) {
                var temp = custRec.setValue({
                    fieldId: 'custbody_ah_approval_status',
                    value: 6
                });
                var lastapp = custRec.setValue({
                    fieldId: 'custbody_ah_last_approved_by',
                    value: firstapp
                });
            }
            var last_approver = custRec.getValue({
                fieldId: 'custbody_ah_last_approved_by'
            });
            var apby_approvern = custRec.getValue({
                fieldId: 'custbody_ah_approved_by'
            });
            var next_approver = custRec.getValue({
                fieldId: 'custbody_ah_next_approver'
            });
            var status = custRec.getValue({
                fieldId: 'custbody_ah_approval_status'
            });
            var newdept = custRec.getValue({
                fieldId: 'department'
            });
            var newloc = custRec.getValue({
                fieldId: 'location'
            });
            var newcls = custRec.getValue({
                fieldId: 'class'
            });
            var newposeg = custRec.getValue({
                fieldId: 'custbody22'
            });
            var newsubs = custRec.getValue({
                fieldId: 'subsidiary'
            });
            var customrecord_appruleSearchObj = search.create({
                type: "customrecord538",
                filters: [
                    ["custrecordcustrecord_presubs", "anyof", newsubs],
                    "AND",
                    ["custrecordcustrecord_predept", "anyof", newdept],
                    "AND",
                    ["custrecordcustrecord_precls", "anyof", newcls],
                    "AND",
                    ["custrecordcustrecord_preloc", "anyof", newloc],
                    "AND",
                    ["custrecord1466", "anyof", newposeg]
                ],
                columns: [
                    search.createColumn({
                        name: "custrecord1471",
                        label: "Preference Link"
                    }),
                    search.createColumn({
                        name: "custrecordcustrecord_prefirst",
                        label: "First Approver"
                    }),
                    search.createColumn({
                        name: "custrecordcustrecord_presecond",
                        label: "Second Approver"
                    }),
                    search.createColumn({
                        name: "custrecordcustrecord_prethird",
                        label: "Third Approver"
                    }),
                    search.createColumn({
                        name: "custrecordcustrecord_fourth",
                        label: "Fourth Approver"
                    }),
                    search.createColumn({
                        name: "custrecordcustrecord_prefifth",
                        label: "Fifth Approver"
                    }),
                    search.createColumn({
                        name: "custrecordcustrecord_sixth",
                        label: "Sixth Approver"
                    }),
                    search.createColumn({
                        name: "custrecordcustrecord_ahseven",
                        label: "Seventh Approver"
                    }),
                    search.createColumn({
                        name: "custrecordcustrecord_preal",
                        label: "Approval Level"
                    })

                ]
            });
            var searchResult = customrecord_appruleSearchObj.run().getRange({
                start: 0,
                end: 10
            });
            var nwar = [];
            if (searchResult.length != 0) {
                var pf_id = searchResult[0].id;
                var firstapps = searchResult[0].getValue({
                    name: "custrecordcustrecord_prefirst",
                    label: "First Approver"
                });
                if (isNotEmpty(firstapps)) {}
                var secondapps = searchResult[0].getValue({
                    name: "custrecordcustrecord_presecond",
                    label: "Second Approver"
                });
                if (isNotEmpty(secondapps)) {}
                var thirdapps = searchResult[0].getValue({
                    name: "custrecordcustrecord_prethird",
                    label: "Third Approver"
                });
                if (isNotEmpty(thirdapps)) {}
                var fourthapps = searchResult[0].getValue({
                    name: "custrecordcustrecord_fourth",
                    label: "Fourth Approver"
                });
                if (isNotEmpty(fourthapps)) {}
                var fifthapps = searchResult[0].getValue({
                    name: "custrecordcustrecord_prefifth",
                    label: "Fifth Approver"
                });
                if (isNotEmpty(fifthapps)) {}
                var sixthapps = searchResult[0].getValue({
                    name: "custrecordcustrecord_sixth",
                    label: "Sixth Approver"
                });
                if (isNotEmpty(sixthapps)) {}
                var seventhapps = searchResult[0].getValue({
                    name: "custrecordcustrecord_ahseven",
                    label: "Seventh Approver"
                });
                if (isNotEmpty(seventhapps)) {}
                var applevel = searchResult[0].getValue({
                    name: "custrecordcustrecord_preal",
                    label: "Approval Level"
                });
                var applev_char = applevel.charAt(applevel.length - 1);
                var applev_int = parseInt(applev_char);
            }
            var apby_approver;
            if ((last_approver == firstapps) && (ll_lastap == '')) //&&(ll_lastap =='')
            {
                arrap.push(firstapps);
                var apby_approver = custRec.setValue({
                    fieldId: 'custbody_ah_approved_by',
                    value: arrap
                });
                var length = arrap.length;
                sendEmailApproved(last_approver, documentNumber, author, custEmail);
            } else if ((last_approver == secondapps) && (ll_lastap == firstapps)) //&&(ll_lastap == firstapps )
            {
                arrap.push(firstapps);
                arrap.push(secondapps);
                var apby_approver = custRec.setValue({
                    fieldId: 'custbody_ah_approved_by',
                    value: arrap
                });
                var length = arrap.length;
                sendEmailApproved(last_approver, documentNumber, author, custEmail);
            } else if ((last_approver == thirdapps) && (ll_lastap == secondapps)) //&&(ll_lastap == secondapps )
            {
                arrap.push(firstapps);
                arrap.push(secondapps);
                arrap.push(thirdapps);
                var apby_approver = custRec.setValue({
                    fieldId: 'custbody_ah_approved_by',
                    value: arrap
                });
                var length = arrap.length;
                sendEmailApproved(last_approver, documentNumber, author, custEmail);
            } else if ((last_approver == fourthapps) && (ll_lastap == thirdapps)) {
                arrap.push(firstapps);
                arrap.push(secondapps);
                arrap.push(thirdapps);
                arrap.push(fourthapps);
                var apby_approver = custRec.setValue({
                    fieldId: 'custbody_ah_approved_by',
                    value: arrap
                });
                var length = arrap.length;
                sendEmailApproved(last_approver, documentNumber, author, custEmail);
            } else if ((last_approver == fifthapps) && (ll_lastap == fourthapps)) {
                arrap.push(firstapps);
                arrap.push(secondapps);
                arrap.push(thirdapps);
                arrap.push(fourthapps);
                arrap.push(fifthapps);
                var apby_approver = custRec.setValue({
                    fieldId: 'custbody_ah_approved_by',
                    value: arrap
                });
                var length = arrap.length;
                sendEmailApproved(last_approver, documentNumber, author, custEmail);
            }
            if (((last_approver == firstapps) && (applev_int > 1) && ((arrap[0] == firstapps) && (length < 2)))) {
                custRec.setValue({
                    fieldId: 'custbody_ah_next_approver',
                    value: secondapps
                });
                var nexts_app = custRec.getValue('custbody_ah_next_approver');
                sendEmailPending(nexts_app, documentNumber, author);
            } else if ((last_approver == secondapps) && (applev_int > 2) && ((arrap[0] == firstapps) && (arrap[1] == secondapps) && (length < 3))) //approved_by == first && approved by==second
            {
                custRec.setValue({
                    fieldId: 'custbody_ah_next_approver',
                    value: thirdapps
                });
                var nexts_app = custRec.getValue('custbody_ah_next_approver');
                sendEmailPending(nexts_app, documentNumber, author);
            } else if ((last_approver == thirdapps) && (applev_int > 3) && ((arrap[0] == firstapps) && (arrap[1] == secondapps) && (arrap[2] == thirdapps) && (length < 4))) {
                custRec.setValue({
                    fieldId: 'custbody_ah_next_approver',
                    value: fourthapps
                });
                var nexts_app = custRec.getValue('custbody_ah_next_approver');
                sendEmailPending(nexts_app, documentNumber, author);
            } else if ((last_approver == fourthapps) && (applev_int > 4) && ((arrap[0] == firstapps) && (arrap[1] == secondapps) && (arrap[2] == thirdapps) && (arrap[3] == fourthapps) && (length < 5))) {
                custRec.setValue({
                    fieldId: 'custbody_ah_next_approver',
                    value: fifthapps
                });
                var nexts_app = custRec.getValue('custbody_ah_next_approver');
                sendEmailPending(nexts_app, documentNumber, author);
            } else {
                custRec.setValue({
                    fieldId: 'custbody_ah_next_approver',
                    value: null
                });
                custRec.setValue({
                    fieldId: 'custbody_ah_approval_status',
                    value: 4
                });
            }

            custRec.save();
            window.location.reload()
        }

        function onRejectButtonClick() {
            //this is the script id on the script record for the suitelet (not the deployment)
            var rec = currentRecord.get();
            // do whatever processing...
            var custRec = record.load({
                type: rec.type,
                id: rec.id
            });
            var firstapp = custRec.getValue('custbody_ah_next_approver');
            var location = custRec.getValue('location');
            var user = runtime.getCurrentUser();
            var last_approver = user.id;
            var documentNumber = custRec.getValue({
                fieldId: 'tranid'
            });
            var custEmail = custRec.getValue('custbody_ah_cl_created_by');
            var suiteletURL = url.resolveScript({
                scriptId: "customscript_ahsurejectreason",
                deploymentId: "customdeploy_rejectreason",
                returnExternalUrl: false,
            });
            suiteletURL += '&recordId=' + rec.id + '&recordType=' + rec.type + '&firstapp=' + firstapp + '&documentNumber=' + documentNumber + '&custEmail=' + custEmail;
            nlExtOpenWindow(suiteletURL, 'Reject Reason', 400, 300);

            var reject = custRec.setValue({
                fieldId: 'custbody_ah_approval_status',
                value: 5
            }); // reject status
            var reason = custRec.getText('custbody_rejreason');
            custRec.save();
            var newreject = custRec.getValue('custbody_rejreason');
        }

        function onResubmitButtonClick() {
            var rec = currentRecord.get();
            var custRec = record.load({
                type: rec.type,
                id: rec.id
            });
            var user = runtime.getCurrentUser();
            var author = user.id;
            var documentNumber = custRec.getValue({
                fieldId: 'tranid'
            });
            var status = custRec.getValue({
                fieldId: 'custbody_ah_approval_status'
            });
            var newdept = custRec.getValue({
                fieldId: 'department'
            });
            var newloc = custRec.getValue({
                fieldId: 'location'
            });
            var newcls = custRec.getValue({
                fieldId: 'class'
            });
            var newposeg = custRec.getValue({
                fieldId: 'custbody22'
            });
            var newsubs = custRec.getValue({
                fieldId: 'subsidiary'
            });

            var customrecord_appruleSearchObj = search.create({
                type: "customrecord538",
                filters: [
                    ["custrecordcustrecord_presubs", "anyof", newsubs],
                    "AND",
                    ["custrecordcustrecord_predept", "anyof", newdept],
                    "AND",
                    ["custrecordcustrecord_precls", "anyof", newcls],
                    "AND",
                    ["custrecordcustrecord_preloc", "anyof", newloc],
                    "AND",
                    ["custrecord1466", "anyof", newposeg]
                ],
                columns: [
                    search.createColumn({
                        name: "custrecord1471",
                        label: "Preference Link"
                    }),
                    search.createColumn({
                        name: "custrecordcustrecord_prefirst",
                        label: "First Approver"
                    })
                ]
            });
            var searchResult = customrecord_appruleSearchObj.run().getRange({
                start: 0,
                end: 10
            });
            if (searchResult.length != 0) {
                var newnext = searchResult[0].getValue({
                    name: "custrecordcustrecord_prefirst",
                    label: "First Approver"
                });
                var info = searchResult[0].getValue({
                    name: "custrecord1471",
                    label: "info field"
                });
                var purchId = record.submitFields({
                    type: rec.type,
                    id: rec.id,
                    values: {
                        'custbody_ah_approval_status': 6,
                        'custbody23': info,
                        'custbody_ah_next_approver': newnext,
                        'custbody_ah_temp': 7,
                        'custbody_ah_last_approved_by': null,
                        'custbody_rejreason': null,
                        'custbody_ah_rejected_by': null,
                        'custbody_ah_approved_by': null
                    }
                });
                sendEmailPending(newnext, documentNumber, author);
            }
            window.location.reload()
        }

        function sendEmailApproved(last_approver1, documentNumber1, author1, custEmail1) {
            var html = '<html>';
            if (last_approver1 != null && last_approver1 != '' && last_approver1 != undefined) {
                html += '<head><style>table {border-collapse: collapse;border: 1px solid black;} th, td {border: 1px solid black;padding: 8px;}</style></head>';
            }
            html += '<body>Hi ' + last_approver1 + ',<br/><br/>approved the PO - ' + documentNumber1 + ' <br/><br/>';
            html += '<br/><br/>Thanks.</body></html>';
            email.send({
                author: author1,
                recipients: [custEmail1],
                cc: [custEmail1],
                subject: 'PO - ' + documentNumber1 + ' is approved.',
                body: html,
            });

        }

        function sendEmailPending(nexts_app1, documentNumber1, author1) {
            var html = '<html>';
            if (nexts_app1 != null && nexts_app1 != '' && nexts_app1 != undefined) {
                html += '<head><style>table {border-collapse: collapse;border: 1px solid black;} th, td {border: 1px solid black;padding: 8px;}</style></head>';
            }
            html += '<body>Hi ' + nexts_app1 + ',<br/><br/>PO - ' + documentNumber1 + ' is Pending for Approval.<br/><br/>';
            html += '<br/><br/>Thanks.</body></html>';
            email.send({
                author: author1,
                recipients: nexts_app1,
                subject: 'PO - ' + documentNumber1 + ' is  pending approval.',
                body: html,
            });
        }

        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            postSourcing: postSourcing,
            sublistChanged: sublistChanged,
            lineInit: lineInit,
            validateField: validateField,
            validateLine: validateLine,
            validateInsert: validateInsert,
            validateDelete: validateDelete,
            saveRecord: saveRecord,
            onApproveButtonClick: onApproveButtonClick,
            onRejectButtonClick: onRejectButtonClick,
            onSubmitForApproval: onSubmitForApproval,
            onResubmitButtonClick: onResubmitButtonClick,
            sendEmailApproved: sendEmailApproved,
            sendEmailPending: sendEmailPending
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