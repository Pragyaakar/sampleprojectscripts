/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(["N/record"], function (record) {
    function saveRecord(context) {
        try {
            var currentRecord = context.currentRecord;
            //var currentFieldId = context.fieldId;
            //line count
            var numLines = currentRecord.getLineCount({
                sublistId: "custpage_sublistid",
            });
            log.debug("linecount", numLines);
            var comment = "";
            var rating = "";

            for (var i = 0; i < numLines; i++) {
                //get_comment
                comment = currentRecord.getSublistValue({
                    sublistId: "custpage_sublistid",
                    fieldId: "custpage_commentid",
                    line: i,
                });
                log.debug("Comment", comment);
                //get_rating
                rating = currentRecord.getSublistValue({
                    sublistId: "custpage_sublistid",
                    fieldId: "custpage_ratingid",
                    line: i,
                });
                log.debug("Rating", rating);


            }

            if (!comment && !rating) {
                alert("please enter Comment And Rating");
                return false;
            } else if (!comment) {
                alert("Please enter Comment");
                return false;
            } else if (!rating) {
                alert("Please enter Rating");
                return false;
            }

            return true;
        } catch (error) {
            log.debug("error", error);
            alert(error);
        }
    }
    return {
        saveRecord: saveRecord,
    };
});