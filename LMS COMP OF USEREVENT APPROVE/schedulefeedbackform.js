/**
 *@NApiVersion 2.x
 *@NScriptType ScheduledScript
 */
define(["N/search", "N/url", "N/email", 'N/config'],
    function (search, url, email, config) {
        function execute(context) {
            try {
                log.debug("Schedule Script", 'Script Begins');
                var companyInfo = config.load({
                    type: config.Type.COMPANY_PREFERENCES,
                    isDynamic: true
                });
                var NoOfDays = companyInfo.getText({
                    fieldId: 'custscript_ns_aft_no_of_days_feed_emails'
                }).trim().replace(/ /g, '');
                var mySearch = search.create({
                    type: search.Type.SALES_ORDER,
                    filters: [
                        ["status", "anyof", "SalesOrd:G"],
                        "AND",
                        ["mainline", "is", "T"],
                        "AND",
                        ["custbody_ns_aft_sales_prod_feed_receiv", "is", "F"],
                        /* "AND",
                        ["datecreated", "within", "lastweek"] */
                    ],
                    columns: [
                        "tranid",
                        "entity",
                        "trandate",
                        "item",
                        "quantity",
                        "rate",
                        "tobeemailed",
                        'custbody_ns_aft_sales_prod_feed_receiv'
                    ],
                });
                if (NoOfDays) {
                    mySearch.filters.push(search.createFilter({
                        name: 'datecreated',
                        operator: search.Operator.ONORAFTER,
                        values: NoOfDays,
                    }));
                }
                var searchResultCount = mySearch.runPaged().count;
                log.debug("Sales Orders result count", searchResultCount);
                mySearch.run().each(function (result) {
                    var resultid = result.id;
                    var soName = result.getValue({
                        name: "tranid"
                    });
                    log.debug("Sales Orders Details", "Sales order internal Id: " + resultid + " :: Name: " + soName);
                    var Custname = result.getValue({
                        name: "entity"
                    });
                    log.debug("Sales Orders Details", "Customer Internal Id: " + Custname);
                    if (!Custname) {
                        log.audit({
                            title: 'Script Terminating',
                            details: 'This sales order has no customer.'
                        });
                        return true;
                    }
                    var isReceived = result.getValue({
                        name: "custbody_ns_aft_sales_prod_feed_receiv"
                    });
                    log.debug("Sales Orders Details", "Review Received: " + isReceived);
                    if (isReceived) {
                        log.audit({
                            title: 'Script Terminating',
                            details: 'This sales order has already reviewed. The necesary checkbox enabled.'
                        });
                        return true;
                    }
                    var custEmail = search.lookupFields({
                        type: search.Type.CUSTOMER,
                        id: Custname,
                        columns: ["email"],
                    }).email;
                    if (!custEmail) {
                        log.audit({
                            title: 'Script Terminating',
                            details: 'This customer record does not have email id in email field.'
                        });
                        return true;
                    }
                    log.debug("Sales Orders Details", "Customer Email: " + custEmail);
                    var suiteletURL = url.resolveScript({
                        scriptId: 'customscript_sl_product_feedback',
                        deploymentId: 'customdeployslidd_product_feedback',
                        params: {
                            'soId': resultid,
                            'isReceived': isReceived
                        },
                        returnExternalUrl: true,
                    });
                    log.debug("Feedback url", suiteletURL);
                    var html = "< html >< body ><p > < a href = " + suiteletURL + " > Click Here < /a></p > < /body> </html > "
                    email.send({
                        author: 1650, //sender internal id//1675
                        recipients: custEmail,
                        subject: 'Product Feedback',
                        body: html + " To give the products feedback for the sales order " + soName + "."
                    });
                    log.debug("email", 'email sent to the respective customer.');
                    return true; //if you want to send emails to all sales orders then set return true.
                });
            } catch (e) {
                log.error("error", e);
            }
        }
        return {
            execute: execute,
        };
    });