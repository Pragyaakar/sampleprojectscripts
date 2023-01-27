/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 * @author Raheena
 * @date 25/01/23
 */
define(['N/currentRecord', 'N/log', 'N/record', 'N/ui/dialog', "N/runtime", "N/url", "N/https", "N/search", "N/email"],
    function (currentRecord, log, record, dialog, runtime, url, https, search, email) {
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

        function saveRecord(scriptContext) {

            try {

                var obj_record = currentRecord.get();

                var rec_type = obj_record.getValue('custrecord1393');
                alert("rec_type" + rec_type);
                var name_forms = obj_record.getValue('custrecordname');
                alert("name_forms" + name_forms);
                alert('length of forms' + name_forms.length);
                var sub = obj_record.getValue('custrecord1396');
                // log.debug("sub",sub);
                var dept = obj_record.getValue('custrecord1395');
                var loc = obj_record.getValue('custrecord1398');
                var cls = obj_record.getValue('custrecord1397');
                var poseg = obj_record.getValue('custrecord1399');
                var earned_leave = obj_record.getValue('custrecord1402');
                var Attendance = obj_record.getValue('custrecord1400');
                var comp_off = obj_record.getValue('custrecord1401');


                var customrecord_ahclsSearchObj = search.create({
                    type: "customrecord_ahcls",
                    filters: [
                        ["custrecord1393", "anyof", rec_type],
                        "AND",
                        ["custrecord_ahformname", "allof", "3", "1"],

                        // ["custrecord_ahformname","anyof",name_forms]
                        //    ["custrecordname","anyof","name_forms"],

                    ],
                    columns: [
                        search.createColumn({
                            name: "internalid",
                            label: "Internal ID"
                        }),
                        search.createColumn({
                            name: "custrecord_ahformname",
                            label: "List of Form"
                        })

                    ]
                });
                var searchResult = customrecord_ahclsSearchObj.run().getRange({
                    start: 0,
                    end: 10
                });

                if (searchResult.length != 0) {
                    alert('searchResultlength' + searchResult.length);
                    return false;
                }



            } catch (err) {
                log.error('Err', err);
            }

        }

        return {

            saveRecord: saveRecord,

        };
    });