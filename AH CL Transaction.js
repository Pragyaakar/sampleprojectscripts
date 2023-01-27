/**
 * @NApiVersion 2.0
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 * @UpdatedDate 12/01/2023
 * @Author Mahesh,raheena
 */
define(['N/search', 'N/currentRecord', 'N/record'],
    function (search, currentRecord, rec) {
        var record = currentRecord.get();
        /**
         * @param {Array} classificRecFieldIds - This array is defined with the classification record field ids.
         * @param {object} mappingClassifcObj -  This object is defined with the clasification record's field ids and suite let field ids.
         * @param {object} mappingConfigRecObj -  This object is defined with the configuaration record's field ids and suite let field ids.
         */
        var classificRecFieldIds = [
            "custrecord1393",
            "name",
            "custrecord_ahformname",
            "custrecord1396",
            "custrecord1395",
            "custrecord1398",
            "custrecord1397",
            "custrecord1399",
            "custrecord1402",
            "custrecord1400",
            "custrecord1401",
        ];
        var mappingClassifcObj = {
            custrecord1396: 'custpage_subsidiary',
            custrecord1395: 'custpage_department',
            custrecord1398: 'custpage_location',
            custrecord1397: 'custpage_class',
            custrecord1399: 'custpage_country',
            custrecord1402: 'custpage_leave',
            custrecord1400: 'custpage_attendance',
            custrecord1401: 'custpage_comp',
        }
        var mappingConfigRecObj = {
            custrecord_subscr: 'custpage_subsidiary',
            custrecord_deptcr: 'custpage_department',
            custrecord_loccr: 'custpage_location',
            custrecord_classcr: 'custpage_class',
            custrecord_countcr: 'custpage_country',
            custrecord_elconfig: 'custpage_leave',
            custrecord_custseg1cr: 'custpage_attendance',
            custrecord_compoff: 'custpage_comp',
        }

        try {
            function fieldChanged(context) {
                if (context.fieldId == 'custpage_tran_type') {
                    var formFieldObj = record.getField('custpage_forms');
                    var classificFieldObj = record.getField('custpage_class_rec');
                    formFieldObj.removeSelectOption({
                        value: null
                    });
                    classificFieldObj.removeSelectOption({
                        value: null
                    });
                    formFieldObj.insertSelectOption({
                        value: 0,
                        text: ''
                    });
                    var transId = record.getValue('custpage_tran_type');
                    removeAllLines();
                    if (transId) {
                        deSelectAllFields(false);
                        addConfigLines(transId);
                        var searchObj = search.create({
                            type: "customrecord544",
                            filters: [
                                ["custrecord_rec_type", "anyof", transId]
                            ],
                            columns: [
                                search.createColumn({
                                    name: "name",
                                    sort: search.Sort.ASC,
                                    label: "Name"
                                })
                            ]
                        });
                        var resultSet = searchObj.run();
                        var myPagedData = searchObj.runPaged({ //0 units initially it is 5 units now it uses 0 units
                            pageSize: 1000
                        });
                        //log.debug("itemSearchObj result count", myPagedData.count);
                        if (myPagedData.count > 0) {
                            for (var i = 0; i <= myPagedData.pageRanges.length; i++) {
                                var pageRange = myPagedData.pageRanges[i];
                                if (pageRange) {
                                    var currentPage = myPagedData.fetch({
                                        index: pageRange.index
                                    });
                                    for (var j = 0; j < currentPage.data.length; j++) {
                                        var result = currentPage.data[j];
                                        if (result) {
                                            formFieldObj.insertSelectOption({
                                                value: result.id,
                                                text: result.getValue({
                                                    name: 'name',
                                                    label: 'Name'
                                                })
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (context.fieldId == 'custpage_forms') { // start of form field
                    var form_val = record.getValue({
                        fieldId: 'custpage_forms'
                    });
                    var recType = record.getValue({
                        fieldId: 'custpage_tran_type'
                    });
                    var classFieldObj = record.getField('custpage_class_rec');
                    classFieldObj.removeSelectOption({
                        value: null
                    });
                    deSelectAllFields(true);
                    updateLineCheckBox('custpage_id', 'T', false)
                    if (form_val != 0 && recType) {
                        var customrecord_ahclsSearchObj = search.create({ // classification 407 update search
                            type: "customrecord_ahcls",
                            filters: [
                                ["custrecord_ahformname", "allof", form_val],
                                "AND",
                                ["custrecord1393", "anyof", recType]
                            ],
                            columns: [
                                search.createColumn({
                                    name: 'name',
                                    label: "Name"
                                }),
                            ]
                        });
                        classFieldObj.insertSelectOption({
                            value: 0,
                            text: ''
                        });
                        var resultSet = customrecord_ahclsSearchObj.run();
                        var myPagedData = customrecord_ahclsSearchObj.runPaged({ //0 units initially it is 5 units now it uses 0 units
                            pageSize: 1000
                        });
                        if (myPagedData.count > 0) {
                            classFieldObj.isDisabled = false;
                            for (var i = 0; i <= myPagedData.pageRanges.length; i++) {
                                var pageRange = myPagedData.pageRanges[i];
                                if (pageRange) {
                                    var currentPage = myPagedData.fetch({
                                        index: pageRange.index
                                    });
                                    for (var j = 0; j < currentPage.data.length; j++) {
                                        var result = currentPage.data[j];
                                        if (result) {
                                            classFieldObj.insertSelectOption({
                                                value: result.id,
                                                text: result.getValue({
                                                    name: "name",
                                                    label: "Name"
                                                })
                                            });
                                        }
                                    }
                                }
                            }
                        } else {
                            alert("There is no Classification Record for the selected forms. Create a classification record");
                            record.setValue({
                                fieldId: 'custpage_class_rec',
                                value: ''
                            })
                            classFieldObj.isDisabled = true;
                            deSelectAllFields(false);
                        }
                    }
                }
                if (context.fieldId == 'custpage_class_rec') {
                    var classRecid = record.getValue({
                        fieldId: 'custpage_class_rec'
                    });
                    updateLineCheckBox('custpage_id', 'T', false)
                    if (classRecid != 0) {
                        var classRecLookObj = search.lookupFields({
                            type: 'customrecord_ahcls',
                            id: classRecid,
                            columns: classificRecFieldIds
                        });
                        var clasMapFieldIds = Object.keys(mappingClassifcObj);
                        for (var fieldIndex in clasMapFieldIds) {
                            var fieldId = clasMapFieldIds[fieldIndex];
                            if (fieldId) {
                                record.setValue({
                                    fieldId: mappingClassifcObj[fieldId],
                                    value: classRecLookObj[fieldId]
                                });
                                if (classRecLookObj[fieldId])
                                    record.getField(mappingClassifcObj[fieldId]).isDisabled = false;
                                else
                                    record.getField(mappingClassifcObj[fieldId]).isDisabled = true;
                            }
                        }
                    } else {
                        deSelectAllFields(true);
                    }
                }
                if (context.fieldId == 'custpage_id') {
                    var get_check = record.getCurrentSublistValue({
                        sublistId: 'custpage_sublist',
                        fieldId: 'custpage_id'
                    });
                    if (get_check == true) {
                        var numLines = record.getLineCount({
                            sublistId: 'custpage_sublist'
                        });
                        var configRecId = record.getCurrentSublistValue({
                            sublistId: 'custpage_sublist',
                            fieldId: 'custpage_configrecid'
                        });
                        setConfigDetails(configRecId);
                        var currentLineNumber = record.getCurrentSublistIndex({
                            sublistId: 'custpage_sublist'
                        });
                        if (numLines == currentLineNumber + 1) {
                            var lineNumber = record.findSublistLineWithValue({
                                sublistId: 'custpage_sublist',
                                fieldId: 'custpage_id',
                                value: 'T'
                            });
                            if (lineNumber > 0) {
                                record.selectLine({
                                    sublistId: 'custpage_sublist',
                                    line: lineNumber
                                });
                                record.setCurrentSublistValue({
                                    sublistId: 'custpage_sublist',
                                    fieldId: 'custpage_id',
                                    value: false
                                });
                                record.commitLine({
                                    sublistId: 'custpage_sublist'
                                });
                            } else {
                                for (var index = 0; index < numLines; index++) {
                                    record.selectLine({
                                        sublistId: 'custpage_sublist',
                                        line: index
                                    });
                                    if (currentLineNumber != index) {
                                        record.setCurrentSublistValue({
                                            sublistId: 'custpage_sublist',
                                            fieldId: 'custpage_id',
                                            value: false
                                        });
                                    } else {
                                        record.setCurrentSublistValue({
                                            sublistId: 'custpage_sublist',
                                            fieldId: 'custpage_id',
                                            value: true,
                                            ignoreFieldChange: true
                                        })
                                    }
                                    var get_check = record.getCurrentSublistValue({
                                        sublistId: 'custpage_sublist',
                                        fieldId: 'custpage_id'
                                    });
                                    var recid = record.getCurrentSublistValue({
                                        sublistId: 'custpage_sublist',
                                        fieldId: 'custpage_configrecid'
                                    });
                                    if (get_check == true && recid) {
                                        record.commitLine({
                                            sublistId: 'custpage_sublist'
                                        });
                                    }
                                }
                            }
                        } else {
                            for (var index = 0; index < numLines; index++) {
                                record.selectLine({
                                    sublistId: 'custpage_sublist',
                                    line: index
                                });
                                var recid = record.getCurrentSublistValue({
                                    sublistId: 'custpage_sublist',
                                    fieldId: 'custpage_configrecid'
                                });
                                if (!recid)
                                    record.cancelLine({
                                        sublistId: 'custpage_sublist'
                                    })
                                if (currentLineNumber != index) {
                                    record.setCurrentSublistValue({
                                        sublistId: 'custpage_sublist',
                                        fieldId: 'custpage_id',
                                        value: false
                                    });
                                } else {
                                    record.setCurrentSublistValue({
                                        sublistId: 'custpage_sublist',
                                        fieldId: 'custpage_id',
                                        value: true,
                                        ignoreFieldChange: true
                                    })
                                }
                                var get_check = record.getCurrentSublistValue({
                                    sublistId: 'custpage_sublist',
                                    fieldId: 'custpage_id'
                                });
                                if (get_check == true && recid) {
                                    record.commitLine({
                                        sublistId: 'custpage_sublist'
                                    });
                                }
                            }
                        }
                    }
                }
            }

            function saveRecord(context) {
                var transId = record.getValue({
                    fieldId: 'custpage_tran_type'
                });
                if (!transId) {
                    alert('Please select a Record type field value.');
                    return false;
                }

                var lineNumber = record.findSublistLineWithValue({
                    sublistId: 'custpage_sublist',
                    fieldId: 'custpage_id',
                    value: 'T'
                });
                if (lineNumber < 0) { //if no lines selected in the sublist then below code will select based on the criteria.
                    var forms = record.getValue({
                        fieldId: 'custpage_forms'
                    });
                    var clasficRecId = record.getValue({
                        fieldId: 'custpage_class_rec'
                    });
                    if (!forms) {
                        alert('Please select a Forms and classification records or select line level checkbox.');
                        return false;
                    } else {
                        if (!clasficRecId || clasficRecId == 0) {
                            alert('Please select a classification records or select line level checkbox.');
                            return false;
                        }
                    }
                }
                //update code pop up 356-378
                if (lineNumber >= 0 || clasficRecId) { //if lines is selected in the sublist then below code will select based on the confg.	
                    var numLines = record.getLineCount({
                        sublistId: 'custpage_sublist'
                    });
                    var arr = [];
                    var clasMapFieldIds = Object.values(mappingClassifcObj);
                    for (var fieldIndex in clasMapFieldIds) {
                        var fieldId1 = record.getValue({
                            fieldId: clasMapFieldIds[fieldIndex]
                        });
                        arr.push(fieldId1);
                    }

                    var k = 0;
                    for (var i in arr) {
                        if (arr[i] == 'false' || arr[i] == false) {
                            k = k + 1;
                        }
                    }
                    if (k == arr.length) {
                        alert("It's mandatory to select at least one field in the enabled classification fields");
                        return false;
                    }
                    var configId = getConfigRec(transId);
                    if (configId) {
                        alert('The Configuration Record found with the Id ' + configId)
                        updateLineCheckBox('custpage_configrecid', configId, true);
                        return true;
                    } else {
                        alert('The Configuration Record is not matched with this criteria.');
                        return true;
                    }
                } else {
                    var configId = record.getSublistValue({
                        sublistId: 'custpage_sublist',
                        fieldId: 'custpage_configrecid',
                        line: lineNumber
                    });
                    if (configId) {
                        alert('The Configuration Record found with the Id ' + configId)
                    }
                }
                return true;
            }

            function validateLine(context) {
                var recid = record.getCurrentSublistValue({
                    sublistId: 'custpage_sublist',
                    fieldId: 'custpage_configrecid'
                });
                if (!recid) {
                    record.cancelLine({
                        sublistId: 'custpage_sublist'
                    })
                    return false;
                } else {
                    return true;
                }
            }
            /** This function is used to check/uncheck the sublist checkbox.
             * @param {string} fieldId - this string is defined as a field id for searching the line to check/uncheck the checkbox.
             * @param {string/boolean} value - this value is defined as a field value for searching the line to check/uncheck the checkbox.
             * @param {boolean} checkBoxValue - this boolean is used to check/uncheck the checkbox.
             * @returns {null}
             */
            function updateLineCheckBox(fieldId, value, checkBoxValue) {
                var lineNumber = record.findSublistLineWithValue({
                    sublistId: 'custpage_sublist',
                    fieldId: fieldId,
                    value: value
                });
                if (lineNumber >= 0) {
                    record.selectLine({
                        sublistId: 'custpage_sublist',
                        line: lineNumber
                    });
                    record.setCurrentSublistValue({
                        sublistId: 'custpage_sublist',
                        fieldId: 'custpage_id',
                        value: checkBoxValue
                    });
                    record.commitLine({
                        sublistId: 'custpage_sublist'
                    });
                }
            }
            /** This function is used to get the configuaration record values and set that values in the sublist.
             * @param {number} configRecId - this number is defined as a configuaration record internal id.
             * @returns {null}
             */
            function setConfigDetails(configRecId) {
                var configMapFieldIds = Object.keys(mappingConfigRecObj); //keys of mapping object['custrecord_subscr','custrecord_deptcr'.....]
                var configRecLookObj = search.lookupFields({
                    type: 'customrecord_configrecord',
                    id: configRecId,
                    columns: configMapFieldIds
                });
                for (var fieldIndex in configMapFieldIds) { //for( var fieldIndex=0;fieldIndex<configMapFieldIds.length;fieldIndex++)
                    var fieldId = configMapFieldIds[fieldIndex]; //custrecord_subscr
                    if (fieldId) {
                        record.setValue({
                            fieldId: mappingConfigRecObj[fieldId],
                            value: configRecLookObj[fieldId]
                        });
                        if (configRecLookObj[fieldId])
                            record.getField(mappingConfigRecObj[fieldId]).isDisabled = false;
                        else
                            record.getField(mappingConfigRecObj[fieldId]).isDisabled = true;
                    }
                }
            }
            /** This function is used to uncheck all the classification fields and disabled/enabled that fields.
             * @param {boolean} isDisebled - This boolean is used to disabled/enabled all the fields.
             * @returns {null}
             */
            function deSelectAllFields(isDisebled) {
                var clasMapFieldIds = Object.keys(mappingClassifcObj);
                for (var fieldIndex in clasMapFieldIds) {
                    var fieldId = clasMapFieldIds[fieldIndex];
                    if (fieldId) {
                        record.setValue({
                            fieldId: mappingClassifcObj[fieldId],
                            value: false
                        });
                        record.getField(mappingClassifcObj[fieldId]).isDisabled = isDisebled;
                    }
                }
            }
            /** This function is used to add the configuaration record details in the sublist.
             * @param {number} transId - This number is defined as record type option id and this will be used to get the configuaration records.
             * @returns {null}
             */
            function addConfigLines(transId) {
                /* record.getSublist({
                    sublistId: 'custpage_sublist'
                }).getColumn({
                    fieldId: 'custpage_id'
                }).isDisabled = false */
                var configSearchObj = search.create({
                    type: "customrecord_configrecord",
                    filters: [
                        ["custrecord_transtypecr", "anyof", transId],
                    ],
                    columns: [
                        search.createColumn({
                            name: "name",
                            sort: search.Sort.ASC,
                            label: "ID"
                        }),
                        search.createColumn({
                            name: "custrecord_transtypecr",
                            label: "Transaction Type"
                        }),
                        search.createColumn({
                            name: "custrecord_configform",
                            label: "Form Name"
                        }),
                        search.createColumn({
                            name: "custrecord_custseg1cr",
                            label: "Attendance"
                        }),
                        search.createColumn({
                            name: "custrecord_deptcr",
                            label: "Department"

                        }),
                        search.createColumn({
                            name: "custrecord_subscr",
                            label: "Subsidiary"
                        }),
                        search.createColumn({
                            name: "custrecord_classcr",
                            label: "Class"
                        }),
                        search.createColumn({
                            name: "custrecord_countcr",
                            label: "Country"
                        }),
                        search.createColumn({
                            name: "custrecord_loccr",
                            label: "Location"
                        }),
                        search.createColumn({
                            name: "custrecord_compoff",
                            label: "COMPOFF"
                        }),
                        search.createColumn({
                            name: "custrecord_elconfig",
                            label: "EARNED LEAVE"
                        })
                    ]
                });
                var resultSet = configSearchObj.run();
                var myPagedData = configSearchObj.runPaged({ //0 units initially it is 5 units now it uses 0 units
                    pageSize: 1000
                });
                if (myPagedData.count > 0) {
                    // execute 2 times
                    for (var i = 0; i <= myPagedData.pageRanges.length; i++) {
                        var pageRange = myPagedData.pageRanges[i];
                        if (pageRange) {
                            var currentPage = myPagedData.fetch({
                                index: pageRange.index
                            });
                            //execute 1000 times
                            for (var j = 0; j < currentPage.data.length; j++) {
                                var result = currentPage.data[j];
                                if (result) {
                                    var configRecId = result.id;
                                    if (configRecId) {
                                        record.selectNewLine({
                                            sublistId: 'custpage_sublist',
                                        });
                                        record.setCurrentSublistValue({
                                            sublistId: 'custpage_sublist',
                                            fieldId: 'custpage_configrecid',
                                            value: configRecId
                                        });
                                        record.setCurrentSublistValue({
                                            sublistId: 'custpage_sublist',
                                            fieldId: 'custpage_configrecname',
                                            value: result.getValue({
                                                name: "name",
                                            })
                                        });
                                        record.setCurrentSublistValue({
                                            sublistId: 'custpage_sublist',
                                            fieldId: 'custpage_rec_type',
                                            value: result.getText({
                                                name: "custrecord_transtypecr",
                                                label: "Transaction Type"
                                            })
                                        });
                                        record.setCurrentSublistValue({
                                            sublistId: 'custpage_sublist',
                                            fieldId: 'custpage_formvalue',
                                            value: result.getText({
                                                name: "custrecord_configform",
                                                label: "Form Name"
                                            })
                                        });
                                        var dept_type = result.getValue({
                                            name: "custrecord_deptcr",
                                            label: "Department"
                                        });
                                        var sub_type = result.getValue({
                                            name: "custrecord_subscr",
                                            label: "Subsidiary"
                                        });
                                        var loc_type = result.getValue({
                                            name: "custrecord_loccr",
                                            label: "Location"
                                        });
                                        var cls_type = result.getValue({
                                            name: "custrecord_classcr",
                                            label: "Class"
                                        });
                                        var ct_type = result.getValue({
                                            name: "custrecord_countcr",
                                            label: "POseg"
                                        });
                                        var at_type = result.getValue({
                                            name: "custrecord_custseg1cr",
                                            label: "Attendance"
                                        });
                                        var coff_type = result.getValue({
                                            name: "custrecord_compoff",
                                            label: "COMPOFF"
                                        });
                                        var earnl_type = result.getValue({
                                            name: "custrecord_elconfig",
                                            label: "EARNED LEAVE"
                                        });
                                        var seg_cls = "";
                                        if (dept_type == true)
                                            seg_cls += "Department,";
                                        if (sub_type == true)
                                            seg_cls += "Subsidiary,";
                                        if (loc_type == true)
                                            seg_cls += "Location,";
                                        if (cls_type == true)
                                            seg_cls += "Class,";
                                        if (ct_type == true)
                                            seg_cls += "Poseg,";
                                        if (at_type == true)
                                            seg_cls += "Attendance,";
                                        if (coff_type == true)
                                            seg_cls += "CompOff,";
                                        if (earnl_type == true)
                                            seg_cls += "EarnedLeave,";
                                        record.setCurrentSublistValue({
                                            sublistId: 'custpage_sublist',
                                            fieldId: 'custpage_values',
                                            value: seg_cls
                                        });
                                        record.commitLine({
                                            sublistId: 'custpage_sublist'
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }
            /** This function is used to remove all the lines in the sublist.
             * @returns {null}
             */
            function removeAllLines() {
                var numLines = record.getLineCount({
                    sublistId: 'custpage_sublist'
                });
                for (var scount = 0; scount < numLines; scount++) {
                    record.removeLine({
                        sublistId: 'custpage_sublist',
                        line: 0
                    });
                }
            }
            /** This function is used to get the configuaration record id to check the sublist checkbox for that line.
             * @param {number} transId - This number is defined as record type option id and this will be used to get the configuaration record.
             * @returns {number/boolean} if we found the result then return configuation record id else return false
             */
            function getConfigRec(transId) {
                var configrecordSearchObj = search.create({
                    type: "customrecord_configrecord",
                    filters: [
                        ["custrecord_transtypecr", "anyof", transId],
                    ]
                });
                var configMapFieldIds = Object.keys(mappingConfigRecObj);
                for (var fieldIndex in configMapFieldIds) {
                    var fieldId = configMapFieldIds[fieldIndex];
                    if (fieldId) {
                        configrecordSearchObj.filters.push(search.createFilter({
                            name: fieldId,
                            operator: search.Operator.IS,
                            values: record.getValue({
                                fieldId: mappingConfigRecObj[fieldId]
                            })
                        }));
                    }
                }
                var searchResult = configrecordSearchObj.run().getRange({
                    start: 0,
                    end: 1
                });
                if (searchResult.length != 0) {
                    return searchResult[0].id;
                } else
                    return false;
            }
        } catch (e) {
            log.error('Unexpected Error', e);
            context.response.write('Unexpected Error. Please Contact your Administrator. Error:: ' + e);
        }
        return {
            fieldChanged: fieldChanged,
            saveRecord: saveRecord,
            validateLine: validateLine
        };
    });