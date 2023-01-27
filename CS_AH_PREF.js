/**
 * @NApiVersion 2.0
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 * @UpdatedDate 12/01/2023
 * @Author Mahesh
 */
define(['N/search', 'N/currentRecord', 'N/record'],
    function (search, currentRecord, rec) {
        var record = currentRecord.get();
        /**
         * @param {Array} approverLevelFields - this array is defined with the sublist's approval level field ids.
         * @param {object} mappingConfigRecObj -  this object is defined with the configuaration record's field ids and suite let field ids.
         * @param {object} mappingApprovRecObj -  this object is defined with the Approval rule record's field ids and suite let field ids.
         * @param {object} mappingPrefRecObj -  this object is defined with the Preference record's field ids and suite let field ids.
         */
        var approverLevelFields = [
            'custpage_approver',
            'custpage_first',
            'custpage_second',
            'custpage_third',
            'custpage_fourth',
            'custpage_fifth',
            'custpage_sixth',
            'custpage_seventh',
        ]
        var mappingConfigRecObj = {
            'custrecord_subscr': 'custpage_subsidiary',
            'custrecord_deptcr': 'custpage_department',
            'custrecord_loccr': 'custpage_location',
            'custrecord_classcr': 'custpage_class',
            'custrecord_countcr': 'custpage_country',
            'custrecord_custseg1cr': 'custpage_att',
            'custrecord_compoff': 'custpage_comp',
            'custrecord_elconfig': 'custpage_earn',
        }
        var mappingApprovRecObj = {
            'custrecordcustrecord_presubs': 'custpage_subsidiary',
            'custrecordcustrecord_predept': 'custpage_department',
            'custrecordcustrecord_preloc': 'custpage_location',
            'custrecordcustrecord_precls': 'custpage_class',
            'custrecord1466': 'custpage_country',
            'custrecord_precs1': 'custpage_att',
            'custrecord_prefcomp': 'custpage_comp',
            'custrecord_prefel': 'custpage_earn',

            'custrecord_single_level_approver': 'custpage_slevel',
            'custrecord_multiple_level_approver': 'custpage_mlevel',
            'custrecordcustrecord_preal': 'custpage_approver',
            'custrecord1467': 'custpage_role',
            'custrecordcustrecord_prefirst': 'custpage_first',
            'custrecordcustrecord_presecond': 'custpage_second',
            'custrecordcustrecord_prethird': 'custpage_third',
            'custrecordcustrecord_fourth': 'custpage_fourth',
            'custrecordcustrecord_prefifth': 'custpage_fifth',
            'custrecordcustrecord_sixth': 'custpage_sixth',
            'custrecordcustrecord_ahseven': 'custpage_seventh',
        }
        var mappingPrefRecObj = {
            'custrecord_presubs': 'custpage_subsidiary',
            'custrecord_predept': 'custpage_department',
            'custrecord_preloc': 'custpage_location',
            'custrecord_precls': 'custpage_class',
            'custrecord_precnt': 'custpage_country',
            'custrecord_precs1': 'custpage_att',
            'custrecord_prefcomp': 'custpage_comp',
            'custrecord_prefel': 'custpage_earn',


            'custrecord1484': 'custpage_slevel',
            'custrecord1485': 'custpage_mlevel',
            'custrecord_preal': 'custpage_approver',
            'custrecord_role': 'custpage_role',
            'custrecord_prefirst': 'custpage_first',
            'custrecord_presecond': 'custpage_second',
            'custrecord_prethird': 'custpage_third',
            'custrecord_fourth': 'custpage_fourth',
            'custrecord_prefifth': 'custpage_fifth',
            'custrecord_sixth': 'custpage_sixth',
            'custrecord_ahseven': 'custpage_seventh',
        }
        try {
            function fieldChanged(context) {
                if (context.fieldId == 'custpage_formvalue') {
                    var sublistform = record.getCurrentSublistValue({
                        sublistId: 'custpage_sublist',
                        fieldId: 'custpage_formvalue',
                    });
                    var configForm = record.getValue({
                        fieldId: 'custpage_recform',
                    });
                    var stform = configForm.toString();
                    var formsArray = [];
                    if (configForm) {
                        if (configForm.length > 1) {
                            formsArray = stform.split(',');
                        } else {
                            formsArray.push(configForm);
                        }
                    }
                    var k = 0;
                    for (var form = 0; form < formsArray.length; form++) {

                        if (formsArray[form] != sublistform) {
                            k = k + 1;
                        }
                    }

                    if (formsArray.length == k) {
                        alert("select the forms which are selected in the configuration record form ");



                    }
                }
                if (context.fieldId == 'custpage_approver') {
                    var approverLevel = record.getCurrentSublistValue({
                        sublistId: 'custpage_sublist',
                        fieldId: 'custpage_approver',
                    });
                    for (var levelFieldInd in approverLevelFields) {
                        if (approverLevel >= 1) {
                            if (levelFieldInd > approverLevel) {
                                disableSublistField('custpage_sublist', approverLevelFields[levelFieldInd], true);
                                record.setCurrentSublistValue({
                                    sublistId: 'custpage_sublist',
                                    fieldId: approverLevelFields[levelFieldInd],
                                    value: '',
                                });
                            } else {
                                disableSublistField('custpage_sublist', approverLevelFields[levelFieldInd], false);
                            }
                        } else {
                            if (approverLevelFields[levelFieldInd] != 'custpage_approver') {
                                disableSublistField('custpage_sublist', approverLevelFields[levelFieldInd], true);
                                record.setCurrentSublistValue({
                                    sublistId: 'custpage_sublist',
                                    fieldId: approverLevelFields[levelFieldInd],
                                    value: '',
                                });
                            }
                        }
                    }
                    if (approverLevel == 1) {
                        record.setCurrentSublistValue({
                            sublistId: 'custpage_sublist',
                            fieldId: 'custpage_slevel',
                            value: true,
                            ignoreFieldChange: true
                        });
                        record.setCurrentSublistValue({
                            sublistId: 'custpage_sublist',
                            fieldId: 'custpage_mlevel',
                            value: false,
                            ignoreFieldChange: true
                        });
                        disableSublistField('custpage_sublist', 'custpage_mlevel', true);
                        disableSublistField('custpage_sublist', 'custpage_slevel', false);
                    } else if (!approverLevel) {
                        record.setCurrentSublistValue({
                            sublistId: 'custpage_sublist',
                            fieldId: 'custpage_slevel',
                            value: false,
                            ignoreFieldChange: true
                        });
                        record.setCurrentSublistValue({
                            sublistId: 'custpage_sublist',
                            fieldId: 'custpage_mlevel',
                            value: false,
                            ignoreFieldChange: true
                        });
                        disableSublistField('custpage_sublist', 'custpage_mlevel', false);
                        disableSublistField('custpage_sublist', 'custpage_slevel', false);
                    } else {
                        record.setCurrentSublistValue({
                            sublistId: 'custpage_sublist',
                            fieldId: 'custpage_mlevel',
                            value: true,
                            ignoreFieldChange: true
                        });
                        record.setCurrentSublistValue({
                            sublistId: 'custpage_sublist',
                            fieldId: 'custpage_slevel',
                            value: false,
                            ignoreFieldChange: true
                        });
                        disableSublistField('custpage_sublist', 'custpage_mlevel', false);
                        disableSublistField('custpage_sublist', 'custpage_slevel', true);
                    }
                }
                if (context.fieldId == 'custpage_slevel') {
                    var slevel = record.getCurrentSublistValue({
                        sublistId: 'custpage_sublist',
                        fieldId: 'custpage_slevel',
                    });
                    if (slevel == true) {
                        record.setCurrentSublistValue({
                            sublistId: 'custpage_sublist',
                            fieldId: 'custpage_mlevel',
                            value: false,
                        });
                        record.setCurrentSublistValue({
                            sublistId: 'custpage_sublist',
                            fieldId: 'custpage_approver',
                            value: 1,
                        });
                        disableSublistField('custpage_sublist', 'custpage_mlevel', true);
                        disableSublistField('custpage_sublist', 'custpage_approver', true);
                    } else {
                        record.setCurrentSublistValue({
                            sublistId: 'custpage_sublist',
                            fieldId: 'custpage_approver',
                            value: '',
                        });
                        disableSublistField('custpage_sublist', 'custpage_mlevel', false);
                        disableSublistField('custpage_sublist', 'custpage_approver', false);
                    }

                }
                if (context.fieldId == 'custpage_mlevel') {
                    var mlevel = record.getCurrentSublistValue({
                        sublistId: 'custpage_sublist',
                        fieldId: 'custpage_mlevel'
                    });
                    if (mlevel == true) {
                        record.setCurrentSublistValue({
                            sublistId: 'custpage_sublist',
                            fieldId: 'custpage_slevel',
                            value: false,
                        });
                        record.setCurrentSublistValue({
                            sublistId: 'custpage_sublist',
                            fieldId: 'custpage_approver',
                            value: 2,
                        });
                        disableSublistField('custpage_sublist', 'custpage_approver', false);
                        disableSublistField('custpage_sublist', 'custpage_slevel', true);
                    } else {
                        record.setCurrentSublistValue({
                            sublistId: 'custpage_sublist',
                            fieldId: 'custpage_approver',
                            value: '',
                        });
                        disableSublistField('custpage_sublist', 'custpage_slevel', false);
                    }
                }
            }

            function saveRecord(context) {
                var configRecId = record.getValue({
                    fieldId: 'custpage_configrecid'
                });
                var prefRecId = record.getValue({
                    fieldId: 'custpage_preflink'
                })
                var recType = record.getValue({
                    fieldId: 'custpage_typerecord'
                })
                var lineFieldIds = Object.values(mappingPrefRecObj);
                var formsArray = [];
                var configRecValues = {};
                configRecValues.custrecord_transtypecr = recType;
                var prefRecValues = {};
                prefRecValues.custrecord_ahrecord = recType;
                var lineCount = record.getLineCount({
                    sublistId: 'custpage_sublist'
                });
                for (var line = 0; line < lineCount; line++) {
                    var approvRecValues = {};
                    approvRecValues.custrecord_recordtype = recType;
                    var formId = record.getSublistValue({
                        sublistId: 'custpage_sublist',
                        fieldId: 'custpage_formvalue',
                        line: line
                    });
                    approvRecValues.custrecord1477 = formId;
                    prefRecValues.custrecord_preform = formId;
                    formsArray.push(formId);
                    for (var lineFieldInd = 0; lineFieldInd < lineFieldIds.length; lineFieldInd++) {
                        var lineFieldValue = record.getSublistValue({
                            sublistId: 'custpage_sublist',
                            fieldId: lineFieldIds[lineFieldInd],
                            line: line
                        });
                        var columnObj = record.getSublist({
                            sublistId: 'custpage_sublist'
                        }).getColumn({
                            fieldId: lineFieldIds[lineFieldInd]
                        });
                        if (columnObj) {
                            if (columnObj.label) { //this code is used to show the alerts when mandatory fields not selected.
                                var classifiFieldIds = Object.values(mappingConfigRecObj);
                                if (classifiFieldIds.indexOf(lineFieldIds[lineFieldInd]) >= 0) {
                                    if (!lineFieldValue) {
                                        alert('Please select a ' + columnObj.label);
                                        return false;
                                    }
                                }
                                if (lineFieldIds[lineFieldInd] == 'custpage_approver') {
                                    var approverLevel = lineFieldValue;
                                    if (!approverLevel) {
                                        alert('Please select a ' + columnObj.label);
                                        return false;
                                    }
                                    for (var approverInd = 1; approverInd <= approverLevel; approverInd++) {
                                        var approver = record.getSublistValue({
                                            sublistId: 'custpage_sublist',
                                            fieldId: approverLevelFields[approverInd],
                                            line: line
                                        });

                                        if (!approver || approver == 0) {
                                            alert('Please select a approver Level ' + approverInd);
                                            return false;
                                        }

                                    }
                                }
                            }
                        }
                        if (lineFieldValue && lineFieldValue != "0") {

                            mappingKeysWithFieldValues(mappingConfigRecObj, lineFieldIds[lineFieldInd], lineFieldValue == 0 || !lineFieldValue ? '' : lineFieldValue, configRecValues)
                            mappingKeysWithFieldValues(mappingPrefRecObj, lineFieldIds[lineFieldInd], lineFieldValue == 0 || !lineFieldValue ? '' : lineFieldValue, prefRecValues)
                            mappingKeysWithFieldValues(mappingApprovRecObj, lineFieldIds[lineFieldInd], lineFieldValue == 0 || !lineFieldValue ? '' : lineFieldValue, approvRecValues)
                        }
                    }
                    if (!configRecId) {
                        configRecId = createCustomRecord('customrecord_configrecord', configRecValues);
                        alert('New Configuration Record has created with Id: ' + configRecId)
                    }
                    prefRecValues.custrecord_configlink = configRecId;
                    if (!prefRecId) {
                        prefRecId = createCustomRecord('customrecord_pre', prefRecValues);
                        alert('New Preference Record has created with Id: ' + prefRecId)
                    }
                    approvRecValues.custrecord1471 = prefRecId;
                    var approvRecId = record.getSublistValue({
                        sublistId: 'custpage_sublist',
                        fieldId: 'custpage_approverecid',
                        line: line
                    });
                    var newRec = false;
                    if (!approvRecId) {
                        var approvRecId = searchApprovalRec(approvRecValues);
                        if (!approvRecId) {
                            newRec = true;
                            approvRecId = createCustomRecord('customrecord538', approvRecValues);
                            alert('New Approval Rule Record has created with Id: ' + approvRecId)
                        }
                    }
                    if (!newRec) {
                        alert('Approval Rule Record is exist for the line number' + line + ' with the Id: ' + approvRecId);
                        approvRecId = rec.submitFields({
                            type: 'customrecord538',
                            id: approvRecId,
                            values: approvRecValues,
                        });
                    }
                }
                if (configRecId)
                    rec.submitFields({
                        type: 'customrecord_configrecord',
                        id: configRecId,
                        values: {
                            'custrecord1460': prefRecId,
                            'custrecord_configform': formsArray
                        },
                    });
                return true;
            }
            /**This function is used to disabled the sublist fields.
             * @param {string} sublistId - sublist id which you want to disable/enable the fields for this sublist.
             * @param {string} fieldId -  field id which you want to disable/enable the fields.
             * @param {boolean} value - true then the field will be disabled else enabled that field.
             * @returns {null}
             */
            function disableSublistField(sublistId, fieldId, value) {
                record.getSublist({
                    sublistId: sublistId
                }).getColumn({
                    fieldId: fieldId
                }).isDisabled = value;
            }
            /**This function is used to map the custom record fields ids with the suitelet values to the mainObj.
             * @param {object} mappingObj - This object will be used to mapp the custom record field ids with the suitelet field ids.
             * @param {string} fieldId -  field id which you want to append the key and value to the mainObj.
             * @param {boolean/string/null} value - value of the field which you want to append to the mainObj .
             * @param {object} mainObj - This Object will be used to create/update/search the custom records.
             * @returns {null}
             */
            function mappingKeysWithFieldValues(mappingObj, fieldId, value, mainObj) {
                var objValues = Object.values(mappingObj);
                var objKeys = Object.keys(mappingObj);
                var index = objValues.indexOf(fieldId);
                if (index >= 0) {
                    mainObj[objKeys[index]] = value
                }
            }

            /**This function is used to create the custom records.
             * @param {string} recType - this param will define the record type that you want to create
             * @param {object} fieldsObj -  This Object will define the field ids as keys and value as values of that fields.
             * @returns {number}   return the record internal id.
             */
            function createCustomRecord(recType, fieldsObj) {
                var recObj = rec.create({
                    type: recType,
                    isDynamic: true,
                });
                var fieldIds = Object.keys(fieldsObj);
                for (var fieldInd = 0; fieldInd < fieldIds.length; fieldInd++) {
                    if (recType == 'customrecord_configrecord') {
                        if (fieldIds[fieldInd] == 'custrecord_configform') {
                            recObj.setValue({
                                fieldId: fieldIds[fieldInd],
                                value: fieldsObj[fieldIds[fieldInd]]
                            });
                        } else if (fieldIds[fieldInd] == 'custrecord_transtypecr') {
                            recObj.setValue({
                                fieldId: fieldIds[fieldInd],
                                value: fieldsObj[fieldIds[fieldInd]]
                            });
                        } else {
                            recObj.setValue({
                                fieldId: fieldIds[fieldInd],
                                value: true
                            });
                        }
                    } else {
                        recObj.setValue({
                            fieldId: fieldIds[fieldInd],
                            value: fieldsObj[fieldIds[fieldInd]]
                        });
                    }
                }
                return recObj.save();
            }
            /** This function is used to search the approval rule records.
             * @param {object} approvRecValues -  This Object will define the field ids as keys and value as values of that fields.
             * @returns {number / boolean}   return resulted record internal id else return false.
             */
            function searchApprovalRec(approvRecValues) {
                var customrecord538SearchObj = search.create({
                    type: "customrecord538",
                    filters: [
                        ["custrecordcustrecord_predept", "anyof", approvRecValues.hasOwnProperty("custrecordcustrecord_predept") ? approvRecValues.custrecordcustrecord_predept ? approvRecValues.custrecordcustrecord_predept : "@NONE@" : "@NONE@"],
                        "AND",
                        ["custrecordcustrecord_precls", "anyof", approvRecValues.hasOwnProperty("custrecordcustrecord_precls") ? approvRecValues.custrecordcustrecord_precls ? approvRecValues.custrecordcustrecord_precls : "@NONE@" : "@NONE@"],
                        "AND",
                        ["custrecord1477", "anyof", approvRecValues.hasOwnProperty("custrecord1477") ? approvRecValues.custrecord1477 ? approvRecValues.custrecord1477 : "@NONE@" : "@NONE@"],
                        "AND",
                        ["custrecordcustrecord_preloc", "anyof", approvRecValues.hasOwnProperty("custrecordcustrecord_preloc") ? approvRecValues.custrecordcustrecord_preloc ? approvRecValues.custrecordcustrecord_preloc : "@NONE@" : "@NONE@"],
                        "AND",
                        ["custrecordcustrecord_presubs", "anyof", approvRecValues.hasOwnProperty("custrecordcustrecord_presubs") ? approvRecValues.custrecordcustrecord_presubs ? approvRecValues.custrecordcustrecord_presubs : "@NONE@" : "@NONE@"],
                        "AND",
                        ["custrecord1466", "anyof", approvRecValues.hasOwnProperty("custrecord1466") ? approvRecValues.custrecord1466 ? approvRecValues.custrecord1466 : "@NONE@" : "@NONE@"],
                        "AND",
                        ["custrecord_recordtype", "anyof", approvRecValues.hasOwnProperty("custrecord_recordtype") ? approvRecValues.custrecord_recordtype ? approvRecValues.custrecord_recordtype : "@NONE@" : "@NONE@"],
                        "AND",
                        ["custrecord1479", "anyof", approvRecValues.hasOwnProperty("custrecord1479") ? approvRecValues.custrecord1479 ? approvRecValues.custrecord1479 : "@NONE@" : "@NONE@"],
                        "AND",
                        ["custrecord1478", "anyof", approvRecValues.hasOwnProperty("custrecord1478") ? approvRecValues.custrecord1478 ? approvRecValues.custrecord1478 : "@NONE@" : "@NONE@"],
                        "AND",
                        ["custrecord1480", "anyof", approvRecValues.hasOwnProperty("custrecord1480") ? approvRecValues.custrecord1480 ? approvRecValues.custrecord1480 : "@NONE@" : "@NONE@"]
                    ],
                    columns: [
                        search.createColumn({
                            name: "scriptid",
                            sort: search.Sort.ASC,
                            label: "Script ID"
                        }),
                        search.createColumn({
                            name: "custrecord1471",
                            label: "Preference Link"
                        }),
                        search.createColumn({
                            name: "custrecord_recordtype",
                            label: "Record Type"
                        })
                    ]
                });
                var pagedData = customrecord538SearchObj.runPaged({
                    pageSize: 1
                });
                if (pagedData.count > 0) {
                    var currentPage = pagedData.fetch(0);
                    var result = currentPage.data[0];
                    return result.id
                } else {
                    return false;
                }
            }
        } catch (e) {
            alert('Catch Block Error:: ' + e)
            log.debug('Unexpected Error', e);
        }
        return {
            fieldChanged: fieldChanged,
            saveRecord: saveRecord,
        };

    });