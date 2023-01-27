const externalIdFieldMap = {
    'employee': 'custentity_empid',
    'department': 'custrecord_sxrd_costcenter_number',
 
    /* TO DEPLOY
    'subsidiary': 'custrecord_sub_externalid',
    'location': 'custrecord_loc_externalid',
    'class': 'custrecord_loc_externalid',
    'inventoryitem': 'custitem_externalid',
    'kititem': 'custitem_externalid', 
    'itemgroup': 'custitem_externalid', 
    'noninventoryitem': 'custitem_externalid', 
    'serviceitem': 'custitem_externalid', 
    'otherchargeitem': 'custitem_externalid',
    'vendor': 'custentity_externalid',
    'customer': 'custentity_externalid',
    'contact': 'custentity_externalid',
    'job': 'custentity_externalid',
    'purchaserequisition': 'custbody_externalid',
    'purchaseorder': 'custbody_externalid', 
    'itemreceipt': 'custbody_externalid', 
    'vendorbill': 'custbody_externalid', 
    'vendorpayment': 'custbody_externalid',
    'vendorreturnauthorization': 'custbody_externalid',
    'vendorcredit': 'custbody_externalid',
    'opportunity': 'custbody_externalid',
    'estimate': 'custbody_externalid',
    'cashsale': 'custbody_externalid',
    'salesorder': 'custbody_externalid',
    'itemfulfillment': 'custbody_externalid',
    'invoice': 'custbody_externalid',
    'customerpayment': 'custbody_externalid',
    'returnauthorization': 'custbody_externalid',
    'creditmemo': 'custbody_externalid',
    'customerrefund': 'custbody_externalid',
    'expensereport': 'custbody_externalid',
    'inventoryadjustment': 'custbody_externalid', 
    'transferorder': 'custbody_externalid',
    'event': 'custevent_externalid',
    'phonecall': 'custevent_externalid',
    'task': 'custevent_externalid',
    */
};

function afterSubmit(type){
    if (type == 'create' || type == 'edit'){
        try {
            setExternalId(type);
        }
        catch (error){
            if (error instanceof nlobjError) {
                var errorMsg = "Code: " + error.getCode() + " Details: " + error.getDetails();
                nlapiLogExecution('error', 'An error occurred.', errorMsg);
            }
            else {
                nlapiLogExecution('error', 'An unknown error occurred.', error.toString());
            }
        }
    }
}

function setExternalId(type){

    var recordType = nlapiGetRecordType();
    var fieldName = externalIdFieldMap[recordType];

    nlapiLogExecution('AUDIT', 'Record Type: ' + recordType, 'Field Name: ' + fieldName);

    if (type == 'create'){
        var newExternalID = nlapiGetFieldValue(fieldName);
        nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'externalid', newExternalID);
    }
    else if (type == 'edit'){
        var oldRecord = nlapiGetOldRecord();
        var newRecord = nlapiGetNewRecord();

        var oldExternalID = oldRecord.getFieldValue(fieldName);
        var newExternalID = newRecord.getFieldValue(fieldName);

        if (oldExternalID != newExternalID){
            nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'externalid', newExternalID);
            nlapiLogExecution('DEBUG', 'External ID Set', newExternalID);
        }
    }
}