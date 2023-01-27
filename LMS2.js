/**
 * @NApiVersion 2.0
 * @NScriptType clientScript
 * @NModuleScope Public
 *
 *Name       : CompOff UI validation from/to date
 *Purpose    : CompOff Validation from Ui
 *Created On : 02-Jan-2023
 *Author     : Binod Kamat
 *Script Type : clientScript
 *Version    : 2.0
 *
 */

define(['N/record', 'N/ui/dialog', 'N/search'], function (record, dialog, search) {


    function saveRecord(context) {
        try {

            var record = context.currentRecord
            var fromDate = record.getValue("custrecord_comp_off_date");
            var comhrs = record.getValue("custrecord_lms_total_hours");
            var toDate = record.getValue("custrecord_comp_off_date_to");
            log.debug(fromDate.getDay() + "from : to " + toDate.getDay());
            const ar = [0, 6]

            function weekendTest(val) {
                for (i = 0; i < ar.length; i++) {
                    if (ar[i] == val) {
                        return true;
                    }
                }
            }
            if (comhrs >= 21) {
                alert("The maximum Comp off you can apply for is 20 hours. ");
                return false;
            }
            if ((Date.parse(toDate) - Date.parse(fromDate)) < 0) {
                alert("Check : From Date  and  To Date  properly");
                return false;
            }
            if ((Date.parse(new Date()) - Date.parse(fromDate)) < 0) {
                alert("Check : future Date is no applicable");
                return false;
            } else if ((Date.parse(toDate) - Date.parse(fromDate)) > 3 * 24 * 60 * 60 * 1000) {
                alert("Check : From Date  and  To Date  properly");
                return false;
            } else if (weekendTest(fromDate.getDay()) && weekendTest(toDate.getDay())) {

                return true;
            } else {
                alert("Check : Compoff can be applied on a Saturday, Sunday, or holiday.");
                return false;
            }



        } catch (e) {
            log.error("Name : " + e.name + " : Message  :" + e.message);
        }
    }

    return {
        saveRecord: saveRecord
    }
});