/**
 *@NApiVersion 2.0
 *@NScriptType MassUpdateScript
 */
define(['N/record', 'N/search'],
    function (record, search) {
        function each(params) {


            var customrecord_configrecordSearchObj = search.create({
                type: "customrecord516",
                filters: [],
                columns: [
                    search.createColumn({
                        name: "scriptid",
                        sort: search.Sort.ASC,
                        label: "Script ID"
                    })
                ]
            });

            var searchResultCount = customrecord_configrecordSearchObj.run().getRange({
                start: 0,
                end: 1000
            });

            if (searchResultCount.length != 0) {
                for (var i in searchResultCount) {
                    var c_id = searchResultCount[i].id;
                    log.debug("Customid1", c_id);
                    if (c_id)
                        log.debug("Customiddelete2", c_id);
                    var featureRecord = record.delete({
                        type: 'customrecord516',
                        id: c_id,
                    });
                }
            }


        }
        return {
            each: each
        };
    });