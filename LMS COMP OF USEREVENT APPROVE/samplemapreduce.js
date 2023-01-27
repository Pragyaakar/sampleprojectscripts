/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 */
define(['N/search', 'N/record', 'N/email', 'N/runtime', 'N/error'],
    function (search, record, email, runtime, error) {
        function handleErrorAndSendNotification(e, stage) {
            log.error(' NOTIFICATION : Stage: ' + stage + ' failed', e);

            var author = -5;
            var recipients = 'notify@example.com';
            var subject = 'Map/Reduce script ' + runtime.getCurrentScript().id + ' failed for stage: ' + stage;
            var body = 'An error occurred with the following information:\n' +
                'Error code: ' + e.name + '\n' +
                'Error msg: ' + e.message;

            email.send({
                author: author,
                recipients: recipients,
                subject: subject,
                body: body
            });
        }

        function handleErrorIfAny(summary) {
            var inputSummary = summary.inputSummary;
            var mapSummary = summary.mapSummary;
            var reduceSummary = summary.reduceSummary;

            if (inputSummary.error) {
                log.debug("INPUT SUMMARY", "ERROR");
                var e = error.create({
                    name: 'INPUT_STAGE_FAILED',
                    message: inputSummary.error
                });
                handleErrorAndSendNotification(e, 'getInputData');
            }

            handleErrorInStage('map', mapSummary);
            handleErrorInStage('reduce', reduceSummary);
        }

        function handleErrorInStage(stage, summary) {
            var errorMsg = [];
            summary.errors.iterator().each(function (key, value) {
                var msg = 'Failure to accept payment from customer id: ' + key + '. Error was: ' + JSON.parse(value).message + '\n';
                errorMsg.push(msg);
                return true;
            });
            if (errorMsg.length > 0) {
                var e = error.create({
                    name: 'RECORD_TRANSFORM_FAILED',
                    message: JSON.stringify(errorMsg)
                });
                handleErrorAndSendNotification(e, stage);
            }
            log.debug(" SUMMARY" + stage, "ERROR : " + errorMsg);
        }





        function getInputData() {
            log.debug("GET INPUT DATA STAGE", "DONE");
            return search.create({
                type: record.Type.SALES_ORDER,
                filters: [
                    ['status', "ANYOF", ['Closed', "Billed", 1, 3, 4, 2]]
                ],
                columns: ['entity'],
                title: 'Open SALE ORDER Search'
            });
        }

        function map(context) {
            log.debug("MAP STAGE", "DONE");
            var searchResult = JSON.parse(context.value);
            var salesorderId = searchResult.id;
            var entityId = searchResult.values.entity.value;



            context.write({
                key: entityId,
                value: salesorderId
            });

        }

        function reduce(context) {
            log.debug("REDUCE STAGE", "DONE");
            var customerId = context.key;

            var saleso = record.load({
                type: record.Type.SALES_ORDER,
                id: context.key
            });


            saleso.setText({
                fieldId: 'status',
                text: "open"
            })

            var custId = saleso.save();

            context.write({
                key: custId
            });
        }

        function summarize(summary) {
            log.debug("SUMMARY STAGE", "DONE");
            handleErrorIfAny(summary);
        }

        return {
            getInputData: getInputData,
            map: map,
            reduce: reduce,
            summarize: summarize
        };
    });