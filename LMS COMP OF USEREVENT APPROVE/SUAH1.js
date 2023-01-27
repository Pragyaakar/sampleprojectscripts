/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * @UpdatedDate 12/01/2023, 24/01/2023
 * @Author Mahesh, vaishnavi
 */
define(['N/ui/serverWidget', 'N/redirect', 'N/record'],
    function (serverWidget, redirect, record) {
        function onRequest(context) {
            try {
                if (context.request.method == 'GET') {
                    var form = serverWidget.createForm({
                        title: 'Criteria'
                    });
                    form.addFieldGroup({
                        id: 'custpage_detail',
                        label: 'Transaction Detail'
                    });
                    form.addFieldGroup({
                        id: 'custpage_new_req_link',
                        label: 'Classification'
                    });
                    form.addFieldGroup({
                        id: 'custpage_cseg',
                        label: 'Custom Segments'
                    });
                    form.addFieldGroup({
                        id: 'custpage_config',
                        label: 'Configuration Record Detail'
                    });
                    var field = form.addField({
                        id: 'custpage_tran_type',
                        type: serverWidget.FieldType.SELECT,
                        label: 'Record Type',
                        source: 'customlist_tl', //record type id
                        container: 'custpage_detail'
                    });
                    field.isMandatory = true;
                    var fman = form.addField({
                        id: 'custpage_forms',
                        type: serverWidget.FieldType.MULTISELECT,
                        label: 'Forms',
                        //source: 'customrecord544',
                        container: 'custpage_detail'
                    });
                    //fman.isMandatory = true;
                    var field1 = form.addField({
                        id: 'custpage_class_rec',
                        type: serverWidget.FieldType.SELECT,
                        label: 'Existing Classification Records',
                        //source: 'customlist_tl', //record type id
                        container: 'custpage_detail'
                    });
                    field1.setHelpText({
                        help: "Existing classification combination forms"
                    });
                    // var fieldHelpText = field1.helpText;
                    /*field1.isMandatory = true;
                     form.addField({
                        id: 'custpage_new_class_rec',
                        type: serverWidget.FieldType.INTEGER,
                        label: 'New Classification Record',
                        container: 'custpage_detail'
                    }).updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    }); */

                    form.addField({
                        id: 'custpage_department',
                        type: serverWidget.FieldType.CHECKBOX,
                        label: 'Department',
                        container: 'custpage_new_req_link'
                    }).updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    });
                    form.addField({
                        id: 'custpage_subsidiary',
                        type: serverWidget.FieldType.CHECKBOX,
                        label: 'Subsidiary',
                        container: 'custpage_new_req_link'
                    }).updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    });
                    form.addField({
                        id: 'custpage_location',
                        type: serverWidget.FieldType.CHECKBOX,
                        label: 'Location',
                        container: 'custpage_new_req_link'
                    }).updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    });
                    form.addField({
                        id: 'custpage_class',
                        type: serverWidget.FieldType.CHECKBOX,
                        label: 'Class',
                        container: 'custpage_new_req_link'
                    }).updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    });
                    form.addField({
                        id: 'custpage_country',
                        type: serverWidget.FieldType.CHECKBOX,
                        label: 'POseg',
                        container: 'custpage_new_req_link'
                    }).updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    });
                    form.addField({
                        id: 'custpage_attendance',
                        type: serverWidget.FieldType.CHECKBOX,
                        label: 'Attendance',
                        container: 'custpage_cseg'
                    }).updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    });
                    form.addField({
                        id: 'custpage_comp',
                        type: serverWidget.FieldType.CHECKBOX,
                        label: 'CompOff',
                        container: 'custpage_cseg'
                    }).updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    });
                    form.addField({
                        id: 'custpage_leave',
                        type: serverWidget.FieldType.CHECKBOX,
                        label: 'Earned Leave',
                        container: 'custpage_cseg'
                    }).updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    });
                    var sublist = form.addSublist({
                        id: 'custpage_sublist',
                        type: serverWidget.SublistType.INLINEEDITOR,
                        label: 'Configuration Record List'
                    });
                    var check = sublist.addField({
                        id: 'custpage_id',
                        label: 'Check',
                        type: serverWidget.FieldType.CHECKBOX
                    });
                    /* check.updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.NORMAL //ENTRY
                    }); */
                    var configr_id = sublist.addField({
                        id: 'custpage_configrecid',
                        label: 'Config Id',
                        type: serverWidget.FieldType.TEXT,
                    });
                    configr_id.updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    });
                    var configr_name = sublist.addField({
                        id: 'custpage_configrecname',
                        label: 'Config Name',
                        type: serverWidget.FieldType.TEXT,
                    });
                    configr_name.updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    });
                    var seg_id = sublist.addField({
                        id: 'custpage_values',
                        label: 'Classification & Segments',
                        type: serverWidget.FieldType.TEXT
                    });
                    seg_id.updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    });
                    var rectype_id = sublist.addField({
                        id: 'custpage_rec_type',
                        label: 'Record Type',
                        type: serverWidget.FieldType.TEXT
                    });
                    rectype_id.updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    });
                    var form_id = sublist.addField({
                        id: 'custpage_formvalue',
                        label: 'Form Used',
                        type: serverWidget.FieldType.TEXT
                    });
                    form_id.updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.DISABLED
                    });
                    form.addSubmitButton({
                        id: 'submitbtn',
                        label: 'Submit',
                    });
                    /* form.addButton({
                        id: 'update_config',
                        label: 'Update Configuration Record',
                    }); */
                    form.clientScriptModulePath = 'SuiteScripts/CS_AH_Trans.js';
                    context.response.writePage(form);
                } else {
                    var request = context.request;
                    log.debug('request.parameters', JSON.stringify(request.parameters));
                    var formsArray = [];
                    if (request.parameters.custpage_forms) {
                        if (request.parameters.custpage_forms.length > 1) {
                            formsArray = request.parameters.custpage_forms.split('');
                        } else {
                            formsArray.push(request.parameters.custpage_forms);
                        }
                    }
                    var params = {
                        "custscript_recordid": '',
                        'custscript_line_recform': '', //request.parameters.custpage_forms,
                        'custscript_body_recform': JSON.stringify(formsArray),
                        'custscript_rectype': request.parameters.custpage_tran_type,
                        'custscript_subs': request.parameters.custpage_subsidiary,
                        'custscript_dept': request.parameters.custpage_department,
                        'custscript_loc': request.parameters.custpage_location,
                        "custscript_class": request.parameters.custpage_class,
                        "custscript_ct": request.parameters.custpage_country,
                        "custscript_att": request.parameters.custpage_attendance,
                        'custscript_comp': request.parameters.custpage_comp,
                        'custscript_leave': request.parameters.custpage_leave,
                    }
                    var lines = request.getLineCount({
                        group: "custpage_sublist"
                    });
                    for (var i = 0; i < lines; i++) {
                        var chekBox_value = request.getSublistValue({
                            group: 'custpage_sublist',
                            name: 'custpage_id',
                            line: i
                        });
                        if (chekBox_value == 'T') {
                            params.custscript_recordid = request.getSublistValue({
                                group: 'custpage_sublist',
                                name: 'custpage_configrecid',
                                line: i
                            });
                            params.custscript_line_recform = request.getSublistValue({
                                group: 'custpage_sublist',
                                name: 'custpage_formvalue',
                                line: i
                            });
                            break;
                        }
                    }
                    log.debug('Formatted Params', JSON.stringify(params))
                    redirect.toSuitelet({
                        scriptId: 'customscript_ah_su_pref',
                        deploymentId: 'customdeploy_ah_su_pref_deploy',
                        parameters: params
                    });
                }

            } catch (e) {
                log.debug('onRequest:error', e);
            }
        }
        return {
            onRequest: onRequest
        };
    });