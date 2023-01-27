/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 */
define(['N/search', 'N/record'],
    function (search, record) {

        function execute(context) {
            try {
                var loadResults = search.create({
                    type: "customrecord_lms_leave_rule",
                    filters: ['custrecord_lms_carry_forward', 'IS', true],
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

                        carryVariable(creditType, Number(leaveBalanceRule), leaveType, employeeType, subsidaryRule);
                    }
                    //-------
                    else if (carryForward.getText('custrecord_leave_credired') == 'Half-Yearly') {
                        var value2 = carryForward.getValue('custrecord_lms_leave_balance_1') / 2;
                        carryVariable();
                    }
                    //-------
                    else if ((carryForward.getText('custrecord_leave_credired') == 'Anually' || carryForward.getValue('custrecord_leave_credired') == '')) {
                        var value3 = carryForward.getValue('custrecord_lms_leave_balance_1');
                        carryVariable();
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
                    var carryForwardResults1 = loadResults1.run().getRange({
                        start: 0,
                        end: 999
                    });
                    //--------
                    log.debug('leave balance Record Object', carryForward1);
                    log.debug('No of leave balance record', carryForwardResults1.length)

                    for (var i = 0; i < carryForwardResults1.length; i++) {

                        var carryForward1 = carryForwardResults1[i];
                        var leaveBalanceR = search.lookupFields({

                            type: carryForward1['recordType'],

                            id: carryForward1['id'],

                            columns: ['custrecord_leave_balance_lms', 'custrecord_lms_leave_type_1', 'custrecord_lms_employment_type']

                        });
                        log.debug('Updated ', 'Id number updated :' + carryForward1['id']);


                        var leaveBalanceactual = Number(leaveBalanceR['custrecord_leave_balance_lms']);
                        if (leaveBalanceactual == NaN || (leaveBalanceactual instanceof Error)) {
                            log.debug('Error ', 'Due to leave balance ' + leaveBalanceactual);
                            continue;
                        }
                        var leaveTypeB = leaveBalanceR['custrecord_lms_leave_type_1'][0]['value'];
                        var employementType = leaveBalanceR['custrecord_lms_employment_type'][0]['value'];

                        log.debug('leave balance actual', leaveBalanceactual);

                        if (leaveBalanceactual >= leaveBalanceRule * 0.5 && leaveBalanceactual < leaveBalanceRule * 0.9) {
                            log.debug('Leave balance Actual greater than equal to 50 and less than 90', 'for testing actual balance+1')
                            log.debug('leave balance updated', leaveBalanceactual + 1);
                            var otherId = record.submitFields({

                                type: carryForward1['recordType'],

                                id: carryForward1['id'],

                                values: {

                                    'custrecord_leave_balance_lms': leaveBalanceactual + 1



                                }
                                // 'custrecord_leave_balance_lms': (leaveBalanceRule*0.75)

                            });
                        }

                        if (leaveBalanceactual < leaveBalanceRule * 0.5) {
                            log.debug('leave balance actual less than 50', 'testing actual balance+0.5')
                            log.debug('leave balance updated', leaveBalanceactual + 0.5);
                            var otherId = record.submitFields({

                                type: carryForward1['recordType'],

                                id: carryForward1['id'],

                                values: {

                                    'custrecord_leave_balance_lms': leaveBalanceactual + 0.5



                                }
                                // 'custrecord_leave_balance_lms': leaveBalanceRule*0.25

                            });
                        }
                        if (leaveBalanceactual > leaveBalanceRule * 0.9) {
                            log.debug('leave balance actual grater than 90', 'testing leave balance+1')
                            log.debug('leave balance updated', leaveBalanceactual + 1);
                            var otherId = record.submitFields({

                                type: carryForward1['recordType'],

                                id: carryForward1['id'],

                                values: {

                                    'custrecord_leave_balance_lms': leaveBalanceactual + 1



                                }
                                // 'custrecord_leave_balance_lms': leaveBalanceRule*1.5

                            });
                        }



                    }
                }
            } catch (e) {
                log.error(e.name, e.message)
            }
        }

        return {
            execute: execute
        };
    });