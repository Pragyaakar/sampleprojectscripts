/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * @UpdatedDate 12/01/2023, 13/01/2023
 * @Author Mahesh, vaishnavi
 */
define(['N/ui/serverWidget', 'N/record', 'N/search', 'N/redirect'],
    function (serverWidget, record, search, redirect) {
        /**
         * @param {object} mappingPrefRecObj -  this object is defined with the Preference record's field ids and suite let field ids.
         * @param {object} mappingAppRecObj - this object is defined with the Approval Rule Record's field ids and suitelet field ids.
         */
        var mappingPrefRecObj = {
            'custrecord_presubs': 'custpage_subsidiary',
            'custrecord_predept': 'custpage_department',
            'custrecord_preloc': 'custpage_location',
            'custrecord_precls': 'custpage_class',
            'custrecord_precnt': 'custpage_country',
            'custrecord_precs1': 'custpage_att',
            'custrecord_prefcomp': 'custpage_comp',
            'custrecord_prefel': 'custpage_earn',

            // 'custrecord1484':'custpage_slevel',
            // 'custrecord1485':'custpage_mlevel',
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

        var mappingAppRecObj = {
            'custrecordcustrecord_presubs': 'custpage_subsidiary',
            'custrecordcustrecord_predept': 'custpage_department',
            'custrecordcustrecord_preloc': 'custpage_location',
            'custrecordcustrecord_precls': 'custpage_class',
            'custrecord1466': 'custpage_country',
            'custrecord1478': 'custpage_att',
            'custrecord1479': 'custpage_comp',
            'custrecord1480': 'custpage_earn',
            // 'custrecord1477':'custpage_recform',

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

        function onRequest(context) {
            try {
                var request = context.request;
                if (request.method === 'GET') {
                    log.debug('Script Start', 'suitelet script Starts.');
                    var form = serverWidget.createForm({
                        title: 'Preference'
                    });
                    form.addFieldGroup({
                        id: 'custpage_new_grp',
                        label: 'Classification & Segments'
                    });
                    log.debug('params', JSON.stringify(request.parameters))
                    var configrecid = request.parameters.custscript_recordid;
                    var configRecLink = form.addField({
                        id: 'custpage_configrecid',
                        type: serverWidget.FieldType.SELECT,
                        label: 'Configuration Record Link',
                        source: 'customrecord_configrecord',
                        container: 'custpage_new_grp'
                    });
                    if (Number(configrecid) > 0)
                        configRecLink.defaultValue = configrecid;
                    configRecLink.updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    });
                    var configRecType = form.addField({
                        id: 'custpage_typerecord',
                        type: serverWidget.FieldType.SELECT,
                        label: 'Configuration Record Type',
                        source: 'customlist_tl',
                        container: 'custpage_new_grp'
                    });
                    configRecType.defaultValue = request.parameters.custscript_rectype;
                    configRecType.updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    });
                    var formsList = form.addField({
                        id: 'custpage_recform',
                        type: serverWidget.FieldType.MULTISELECT,
                        label: 'Configuration Record Form',
                        source: 'customrecord544',
                        container: 'custpage_new_grp'
                    });
                    var formIds = JSON.parse(request.parameters.custscript_body_recform);
                    formsList.defaultValue = formIds;
                    formsList.updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    });
                    var pref_link = form.addField({
                        id: 'custpage_preflink',
                        type: serverWidget.FieldType.SELECT,
                        label: 'Preference Record',
                        source: 'customrecord_pre',
                        container: 'custpage_new_grp'
                    });
                    pref_link.updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    });
                    // var mclsb = form.addField({
                    // 	id: 'custpage_bcls',
                    // 	type: serverWidget.FieldType.CHECKBOX,
                    // 	label: 'Multilevel Classification',
                    // 	container: 'custpage_new_grp'

                    // });
                    var subsvalue = request.parameters.custscript_subs;
                    if (subsvalue == "T") {
                        var Subsidiary1 = form.addField({
                            id: 'custpage_subsidiary_m',
                            type: serverWidget.FieldType.MULTISELECT,
                            label: 'Subsidiary',
                            source: 'subsidiary',
                            container: 'custpage_new_grp'
                        });
                    }
                    var locationvalue = request.parameters.custscript_loc;
                    if (locationvalue == "T") {
                        var Location1 = form.addField({
                            id: 'custpage_location_m',
                            type: serverWidget.FieldType.MULTISELECT,
                            label: 'Location',
                            source: 'location',
                            container: 'custpage_new_grp'
                        });
                    }
                    var deptvalue = request.parameters.custscript_dept;
                    if (deptvalue == "T") {
                        var Department1 = form.addField({
                            id: 'custpage_department_m',
                            type: serverWidget.FieldType.MULTISELECT,
                            label: 'Department',
                            source: 'department',
                            container: 'custpage_new_grp'
                        });
                    }
                    var classValue = request.parameters.custscript_class;
                    if (classValue == "T") {
                        var Class1 = form.addField({
                            id: 'custpage_class_m',
                            type: serverWidget.FieldType.MULTISELECT,
                            label: 'Class',
                            source: 'classification',
                            container: 'custpage_new_grp'
                        });
                    }
                    var ctvalue = request.parameters.custscript_ct;
                    if (ctvalue == "T") {
                        var POseg1 = form.addField({
                            id: 'custpage_poseg_m',
                            type: serverWidget.FieldType.MULTISELECT,
                            label: 'POseg',
                            source: 'customrecord_cseg_po',
                            container: 'custpage_new_grp'
                        });
                    }
                    var sublist = form.addSublist({
                        id: 'custpage_sublist',
                        type: serverWidget.SublistType.INLINEEDITOR,
                        label: 'Approval Rule List'
                    });
                    sublist.addField({
                        id: 'custpage_formvalue',
                        label: 'Form',
                        type: serverWidget.FieldType.SELECT,
                        source: 'customrecord544',
                    });
                    /* sublistForms.updateDisplayType({
                    	displayType: serverWidget.FieldDisplayType.DISABLED
                    }); */
                    var mcls = sublist.addField({
                        id: 'custpage_mclassification',
                        type: serverWidget.FieldType.CHECKBOX,
                        label: 'Multilevel Classification',

                    });
                    // mcls.updateDisplayType({
                    // 	displayType: serverWidget.FieldDisplayType.DISABLED
                    var subsvalue = request.parameters.custscript_subs;
                    if (subsvalue == "T") {
                        var subs = sublist.addField({
                            id: 'custpage_subsidiary',
                            type: serverWidget.FieldType.SELECT,
                            label: 'Subsidiary',
                            source: 'subsidiary',
                        });
                        // subs.isMandatory = true;
                    }
                    var deptvalue = request.parameters.custscript_dept;
                    if (deptvalue == "T") {
                        var dept = sublist.addField({
                            id: 'custpage_department',
                            type: serverWidget.FieldType.SELECT,
                            label: 'Department',
                            source: 'department',
                        });
                        // dept.isMandatory = true;
                    }
                    var locationvalue = request.parameters.custscript_loc;
                    if (locationvalue == "T") {
                        var loc = sublist.addField({
                            id: 'custpage_location',
                            type: serverWidget.FieldType.SELECT,
                            label: 'Location',
                            source: 'location',
                        });
                        // loc.isMandatory = true;
                    }
                    var classValue = request.parameters.custscript_class;
                    if (classValue == "T") {
                        var cls = sublist.addField({
                            id: 'custpage_class',
                            type: serverWidget.FieldType.SELECT,
                            label: 'Class',
                            source: 'classification',
                        });
                        // cls.isMandatory = true;
                    }
                    var ctvalue = request.parameters.custscript_ct;
                    if (ctvalue == "T") {
                        var ct = sublist.addField({
                            id: 'custpage_country',
                            type: serverWidget.FieldType.SELECT,
                            label: 'POseg',
                            source: 'customrecord_cseg_po',
                        });
                        // ct.isMandatory = true;
                    }
                    var attvalue = request.parameters.custscript_att;
                    if (attvalue == "T") {
                        var att = sublist.addField({
                            id: 'custpage_att',
                            type: serverWidget.FieldType.SELECT,
                            label: 'Attendance',
                            source: 'customrecord_cseg_attendance'
                        });
                        att.isMandatory = true;
                    }
                    var compoffvalue = request.parameters.custscript_comp;
                    if (compoffvalue == "T") {
                        var comp = sublist.addField({
                            id: 'custpage_comp',
                            type: serverWidget.FieldType.SELECT,
                            label: 'CompOff',
                            source: 'customrecord_cseg_compoff',
                        });
                        comp.isMandatory = true;
                    }
                    var earn_value = request.parameters.custscript_leave;
                    if (earn_value == "T") {
                        var earn = sublist.addField({
                            id: 'custpage_earn',
                            type: serverWidget.FieldType.SELECT,
                            label: 'Earned Leave',
                            source: 'customrecord_cseg_earnedleave',
                        });
                        earn.defaultValue = 1;
                        earn.isMandatory = true;
                    }
                    sublist.addField({
                        id: 'custpage_slevel',
                        type: serverWidget.FieldType.CHECKBOX,
                        label: 'Single Level Approval',
                    });
                    sublist.addField({
                        id: 'custpage_mlevel',
                        type: serverWidget.FieldType.CHECKBOX,
                        label: 'Multiple Level Approval',
                    });
                    sublist.addField({
                        id: 'custpage_exce_for_approval',
                        type: serverWidget.FieldType.CHECKBOX,
                        label: 'Exception For Approval',
                    });
                    sublist.addField({
                        id: 'custpage_role_or_user',
                        type: serverWidget.FieldType.CHECKBOX,
                        label: 'Role Based/User Based',
                    });
                    sublist.addField({
                        id: 'custpage_amount_based',
                        type: serverWidget.FieldType.CHECKBOX,
                        label: 'Amount Based',
                    });
                    sublist.addField({
                        id: 'custpage_role',
                        type: serverWidget.FieldType.SELECT,
                        label: 'Role Approval',
                        source: 'role',
                    });
                    sublist.addField({
                        id: 'custpage_user',
                        type: serverWidget.FieldType.SELECT,
                        label: 'User',
                        //source: 'role',
                    });
                    var alevel = sublist.addField({
                        id: 'custpage_approver',
                        type: serverWidget.FieldType.SELECT,
                        label: 'Approval Level',
                        source: 'customlist_al',
                    });
                    alevel.isMandatory = true;
                    var first_app = sublist.addField({
                        id: 'custpage_first',
                        type: serverWidget.FieldType.SELECT,
                        label: 'First Approver',
                        source: 'employee',
                    });
                    first_app.updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    });
                    var second_app = sublist.addField({
                        id: 'custpage_second',
                        type: serverWidget.FieldType.SELECT,
                        label: 'Second Approver',
                        source: 'employee',
                    });
                    second_app.updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    });
                    var third_app = sublist.addField({
                        id: 'custpage_third',
                        type: serverWidget.FieldType.SELECT,
                        label: 'Third Approver',
                        source: 'employee',
                    });
                    third_app.updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    });
                    var fourth_app = sublist.addField({
                        id: 'custpage_fourth',
                        type: serverWidget.FieldType.SELECT,
                        label: 'Fourth Approver',
                        source: 'employee',
                    });
                    fourth_app.updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    });
                    var fifth_app = sublist.addField({
                        id: 'custpage_fifth',
                        type: serverWidget.FieldType.SELECT,
                        label: 'Fifth Approver',
                        source: 'employee',
                    });
                    fifth_app.updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    });
                    var sixth_app = sublist.addField({
                        id: 'custpage_sixth',
                        type: serverWidget.FieldType.SELECT,
                        label: 'Sixth Approver',
                        source: 'employee',
                    });
                    sixth_app.updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    });
                    var seventh_app = sublist.addField({
                        id: 'custpage_seventh',
                        type: serverWidget.FieldType.SELECT,
                        label: 'Seventh Approver',
                        source: 'employee',
                    });
                    seventh_app.updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    });
                    var approveRecFieldObj = sublist.addField({
                        id: 'custpage_approverecid',
                        type: serverWidget.FieldType.SELECT,
                        label: 'Approval Record',
                        source: 'customrecord538',
                    });
                    approveRecFieldObj.updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    });
                    log.debug("configrecid", configrecid);
                    if (configrecid) { // added if condition to check the val
                        var configLookupObj = getLookupObjectWithValues(search.lookupFields({
                            type: 'customrecord_configrecord',
                            id: configrecid,
                            columns: [
                                'custrecord_configform',
                                'custrecord1460',
                            ]
                        }));
                        log.debug('configLookupObj', JSON.stringify(configLookupObj))
                        var preffLookupObj = {};
                        var prefFieldsArr = Object.keys(mappingPrefRecObj);
                        if (configLookupObj.custrecord1460[0].value) { //preferenece rec Id
                            pref_link.defaultValue = configLookupObj.custrecord1460[0].value;
                            var pref_val = configLookupObj.custrecord1460[0].value; //preferenece rec Id
                            var prefeObj = record.load({
                                type: 'customrecord_pre',
                                id: pref_val,
                                isDynamic: true,
                            });
                            for (var preFieldId in prefFieldsArr) {
                                if (prefFieldsArr[preFieldId]) {
                                    preffLookupObj[prefFieldsArr[preFieldId]] = prefeObj.getValue({
                                        fieldId: prefFieldsArr[preFieldId]
                                    })
                                }
                            }
                            var lineCount = prefeObj.getLineCount({
                                sublistId: 'recmachcustrecord1471'
                            });
                            log.debug('appr Count', lineCount);
                            if (lineCount <= 0) {
                                pref_val = ''
                            }
                            for (var apprInd = 0; apprInd < lineCount; apprInd++) {
                                prefeObj.selectLine({
                                    sublistId: 'recmachcustrecord1471',
                                    line: apprInd
                                });
                                var apprId = prefeObj.getCurrentSublistValue({
                                    sublistId: 'recmachcustrecord1471',
                                    fieldId: 'id'
                                })
                                log.debug('appr Id', apprId);
                                sublist.setSublistValue({
                                    id: 'custpage_approverecid',
                                    line: apprInd,
                                    value: apprId,
                                });

                                var apprKeys = Object.keys(mappingAppRecObj);
                                apprKeys.push('custrecord1477')
                                apprKeys.push('custrecord_single_level_approver')
                                apprKeys.push('custrecord_multiple_level_approver')
                                var apprLookupObj = getLookupObjectWithValues(search.lookupFields({
                                    type: 'customrecord538',
                                    id: apprId,
                                    columns: apprKeys
                                }));
                                log.debug('apprLookupObj', apprLookupObj)
                                setLineFields(sublist, apprInd, apprLookupObj.custrecord1477[0].value, apprLookupObj, Object.keys(mappingAppRecObj), mappingAppRecObj)
                            }
                            /* preffLookupObj = getLookupObjectWithValues(search.lookupFields({
                            	type: 'customrecord_pre',
                            	id: configLookupObj.custrecord1460[0].value,
                            	columns: prefFieldsArr
                            })); */
                            log.debug('preffLookupObj', JSON.stringify(preffLookupObj))
                        }
                        // fetch the form from creteria (configuration sublist) to preff page config Record form (line 408 to 414)	
                        var formArray = [];
                        for (var formInd = 0; formInd < configLookupObj.custrecord_configform.length; formInd++) {
                            formArray.push(configLookupObj.custrecord_configform[formInd].value)
                        }
                        formsList.defaultValue = formArray;

                        if ((request.parameters.custscript_line_recform.length > 0) && (!pref_val)) {
                            // if (request.parameters.custscript_line_recform.length > 0){
                            var formsIdsArray = [];
                            for (var formInd = 0; formInd < configLookupObj.custrecord_configform.length; formInd++) {
                                // formsIdsArray.push(configLookupObj.custrecord_configform[formInd].value)
                                if (configLookupObj.custrecord_configform[formInd].value) {
                                    setLineFields(sublist, formInd, configLookupObj.custrecord_configform[formInd].value, preffLookupObj, prefFieldsArr, mappingPrefRecObj)
                                }
                            }
                            // formsList.defaultValue = formsIdsArray;
                        }

                    } else {
                        for (var formIndex = 0; formIndex < formIds.length; formIndex++) {
                            setLineFields(sublist, formIndex, formIds[formIndex], '', '', mappingPrefRecObj)
                        }
                    }
                    form.addSubmitButton({
                        label: 'Submit'
                    });
                    form.clientScriptModulePath = 'SuiteScripts/CS_AH_PREF.js';
                    context.response.writePage(form);
                } else {
                    redirect.toSuitelet({
                        scriptId: 'customscript_ah_sl_type',
                        deploymentId: 'customdeploy_ah_sl_trans_deploy',
                    });
                }
            } catch (e) {
                log.debug('onRequest:error', e);
            } finally {
                log.debug('Script End', 'suitelet script ends.');
            }
        }
        /**This function is used to set default values to the sublist fields.
         * @param {object} sublist - sublist object which you want to set the default values to the fields.
         * @param {number} line -  line number of the sublist.
         * @param {number} value - form value
         * @param {object} preffLookupObj - this is the preference record lookup object which has field ids and values of that record.
         * @param {Array} prefFieldsArr - this array is used to define the preference record's field ids.
         * @param {object}mappingPrefRecObj - this is the mapping object to set the line values
         * @returns {null}
         */
        function setLineFields(sublist, line, formValue, preffLookupObj, prefFieldsArr, mappingPrefRecObj) {
            log.debug('line', line);
            log.debug('formValue', formValue);
            if (formValue) {
                sublist.setSublistValue({
                    id: 'custpage_formvalue',
                    line: line,
                    value: formValue,
                });

                if (preffLookupObj) {
                    for (var mapFieldInd in prefFieldsArr) {
                        var fieldId = prefFieldsArr[mapFieldInd]; //frms
                        if (preffLookupObj[fieldId]) {
                            log.debug({
                                title: 'fieldId',
                                details: fieldId
                            })
                            log.debug({
                                title: 'Suite let Field Id',
                                details: mappingPrefRecObj[fieldId] //approvalmapp
                            })
                            // log.debug({
                            // 	title: 'Suite let Value',
                            // 	details: preffLookupObj[fieldId][0].value //obj_app
                            // })
                            log.debug("preffLookupObj[fieldId]", preffLookupObj[fieldId]);
                            if (fieldId == "custrecord_single_level_approver") {
                                sublist.setSublistValue({
                                    id: "custpage_slevel",
                                    line: line,
                                    value: preffLookupObj[fieldId] ? 'T' : 'F',
                                });
                            } else if (fieldId == "custrecord_multiple_level_approver") {
                                sublist.setSublistValue({
                                    id: "custpage_mlevel",
                                    line: line,
                                    value: preffLookupObj[fieldId] ? 'T' : 'F',
                                });
                            } else if (preffLookupObj[fieldId][0].value != 0 && mappingPrefRecObj[fieldId] && preffLookupObj[fieldId][0].value) // && mappingPrefRecObj[fieldId]
                                sublist.setSublistValue({
                                    id: mappingPrefRecObj[fieldId],
                                    line: line,
                                    value: preffLookupObj[fieldId][0].value,
                                });
                        }
                    }
                }
            }
        }
        /**This function is used to push the empty object if the lookup obj has an empty array.
         * @param {object} lookupObj - this lookup object which has field ids and values of record.
         * @returns {object} same object will return.
         */
        function getLookupObjectWithValues(lookupObj) {
            var object = {};
            object.value = 0;
            object.text = '';
            var fieldsArray = Object.keys(lookupObj); //['custrecord_configform','custrecord1460']
            for (var fieldInd in fieldsArray) {
                if (typeof (lookupObj[fieldsArray[fieldInd]]) == 'object') {
                    if (lookupObj[fieldsArray[fieldInd]][0] == undefined || lookupObj[fieldsArray[fieldInd]][0] == null) {
                        lookupObj[fieldsArray[fieldInd]].push(object);
                    }
                }
            }

            return lookupObj;

        }

        return {
            onRequest: onRequest
        };
    });