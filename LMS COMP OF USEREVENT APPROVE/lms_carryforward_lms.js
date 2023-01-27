/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 */
define(['N/search', 'N/record', 'N/log'],
    function (search, record, log) {

        function execute(context) {
            try {
                var loadResults = search.create({
                    type: "customrecord_lms_leave_rule",
                    filters: ['custrecord_lms_carry_forward', 'IS', false],
                    //             leave credited,             leave balance,                   leave type
                    columns: ['custrecord_leave_credired']
                });
                var carryForwardResults = loadResults.run().getRange({
                    start: 0,
                    end: 999
                });
                //-----------

                for (var i = 0; i < carryForwardResults.length; i++) {

                    log.debug(
                        'leave Rule Record', "inside first loop"
                    )

                    var carryForward = carryForwardResults[i];
                    // var leaveRuleId=carryForwardResult["id"];

                    if (carryForward.getText('custrecord_leave_credired') == 'Quarterly') {
                        log.debug(
                            'leave Rule Record Id', carryForward['id']
                        )
                        log.debug(
                            'leave Rule record object', carryForward
                        )

                        var loadR = search.lookupFields({

                            type: carryForward['recordType'],

                            id: carryForward['id'],

                            columns: ['custrecord_leave_credired', 'custrecord_lms_leave_balance_1', 'custrecord_lms_leave_type_', 'custrecord_lms_employee_type_', 'custrecord_lms_employee_subsidiary']

                        });

                        //  log.debug("lookup value", loadR['custrecord_lms_approval_status'][0]["value"]);

                        //   statusL = loadR['custrecord_lms_approval_status'][0]["value"];

                        var creditType = loadR['custrecord_leave_credired'][0]['value'];

                        var leaveBalanceRule = loadR['custrecord_lms_leave_balance_1'];
                        var leaveType = loadR['custrecord_lms_leave_type_'][0]['value'];
                        var employeeType = loadR['custrecord_lms_employee_type_'][0]['value'];

                        var subsidaryRule = loadR['custrecord_lms_employee_subsidiary'][0]['value'];

                        log.debug('Leave Balance ', loadR['custrecord_lms_leave_balance_1']);

                        log.debug(' Leave Rule Data ', ' creditType :  ' + creditType + ' Leave Type: ' + leaveType + ' Employee Type: ' + employeeType + ' Subsidary Rule: ' + subsidaryRule);

                        log.debug(' Leave Rule Data ', ' creditType :  ' + creditType + ' Leave balance rule: ' + Number(leaveBalanceRule) + ' Leave Type: ' + leaveType + ' Employee Type: ' + employeeType + ' Subsidary Rule: ' + subsidaryRule);

                        carryVariable(creditType, Number(leaveBalanceRule) * 0.25, leaveType, employeeType, subsidaryRule);
                    }
                    //-------
                    else if (carryForward.getText('custrecord_leave_credired') == 'Half-Yearly') {

                        log.debug(
                            'leave Rule Record Id', carryForward['id']
                        )
                        log.debug(
                            'leave Rule record object', carryForward
                        )

                        var loadR = search.lookupFields({

                            type: carryForward['recordType'],

                            id: carryForward['id'],

                            columns: ['custrecord_leave_credired', 'custrecord_lms_leave_balance_1', 'custrecord_lms_leave_type_', 'custrecord_lms_employee_type_', 'custrecord_lms_employee_subsidiary']

                        });

                        //  log.debug("lookup value", loadR['custrecord_lms_approval_status'][0]["value"]);

                        //   statusL = loadR['custrecord_lms_approval_status'][0]["value"];

                        var creditType = loadR['custrecord_leave_credired'][0]['value'];

                        var leaveBalanceRule = loadR['custrecord_lms_leave_balance_1'];
                        var leaveType = loadR['custrecord_lms_leave_type_'][0]['value'];
                        var employeeType = loadR['custrecord_lms_employee_type_'][0]['value'];

                        var subsidaryRule = loadR['custrecord_lms_employee_subsidiary'][0]['value'];

                        log.debug('Leave Balance ', loadR['custrecord_lms_leave_balance_1']);

                        log.debug(' Leave Rule Data ', ' creditType :  ' + creditType + ' Leave Type: ' + leaveType + ' Employee Type: ' + employeeType + ' Subsidary Rule: ' + subsidaryRule);

                        log.debug(' Leave Rule Data ', ' creditType :  ' + creditType + ' Leave balance rule: ' + Number(leaveBalanceRule) + ' Leave Type: ' + leaveType + ' Employee Type: ' + employeeType + ' Subsidary Rule: ' + subsidaryRule);

                        carryVariable(creditType, Number(leaveBalanceRule) * 0.5, leaveType, employeeType, subsidaryRule);

                    }
                    //-------
                    else {

                        log.debug(
                            'leave Rule Record Id', carryForward['id']
                        )
                        log.debug(
                            'leave Rule record object', carryForward
                        )

                        var loadR = search.lookupFields({

                            type: carryForward['recordType'],

                            id: carryForward['id'],

                            columns: ['custrecord_leave_credired', 'custrecord_lms_leave_balance_1', 'custrecord_lms_leave_type_', 'custrecord_lms_employee_type_', 'custrecord_lms_employee_subsidiary']

                        });

                        //  log.debug("lookup value", loadR['custrecord_lms_approval_status'][0]["value"]);

                        //   statusL = loadR['custrecord_lms_approval_status'][0]["value"];

                        var creditType = loadR['custrecord_leave_credired'][0]['value'];

                        var leaveBalanceRule = loadR['custrecord_lms_leave_balance_1'];
                        var leaveType = loadR['custrecord_lms_leave_type_'][0]['value'];
                        var employeeType = loadR['custrecord_lms_employee_type_'][0]['value'];

                        var subsidaryRule = loadR['custrecord_lms_employee_subsidiary'][0]['value'];

                        log.debug('Leave Balance ', loadR['custrecord_lms_leave_balance_1']);

                        log.debug(' Leave Rule Data ', ' creditType :  ' + creditType + ' Leave Type: ' + leaveType + ' Employee Type: ' + employeeType + ' Subsidary Rule: ' + subsidaryRule);

                        log.debug(' Leave Rule Data ', ' creditType :  ' + creditType + ' Leave balance rule: ' + Number(leaveBalanceRule) + ' Leave Type: ' + leaveType + ' Employee Type: ' + employeeType + ' Subsidary Rule: ' + subsidaryRule);

                        carryVariable(creditType, Number(leaveBalanceRule), leaveType, employeeType, subsidaryRule);


                    }
                    //------

                }

                function carryVariable(creditType, leaveBalanceRule, leaveType, employeeType, subsidaryRule) {

                    //April july october 100% previous leave balance will pass to next quarter
                    // Jan-- Carry forward--50% & 10 % rule criteria on that rule type which is applicable for carry forward(checkbox is true)in leave rule record


                    var loadResults1 = search.create({
                        type: "customrecord_lms_employee_leave",
                        filters: [
                            ['custrecord_lms_leave_type_1', 'ANYOF', [leaveType]],
                            'AND',
                            ['custrecord_lms_subsidiary', 'ANYOF', [subsidaryRule]],
                            'AND',
                            ['custrecord_lms_employment_type', 'ANYOF', [employeeType]]
                        ],
                        //                  leave balance,                   leave type             joining date
                        columns: ['custrecord_leave_balance_lms', 'custrecord_lms_leave_type_1', 'custrecord_lms_employment_type'

                        ]

                    });
                    var carryForwardResults1 = loadResults1.run().each(function (carryforward1) {

                        /* 
                        log.debug('leave balance actual grater than 90','testing leave balance+1')
                        log.debug('leave balance updated', leaveBalanceactual+1);
                        var otherId = record.submitFields({

                            type: carryForward1['recordType'],

                            id: carryForward1['id'],

                            values: {
    
                                'custrecord_leave_balance_lms':leaveBalanceactual+1
    
    
    
                            }
                           // 'custrecord_leave_balance_lms': leaveBalanceRule*1.5
    
                        });
                    
                    */
                        log.debug('Leave balance Record object', carryforward1);
                        log.debug('Leave balance Record Type', carryForward1['recordType'])



                    });
                }
            } catch (e) {
                log.error(e.name, e.message)
            }
        }

        return {
            execute: execute
        };
    });