function userEventAfterSubmit(type){
	try{
	if (((type == 'edit' && nlapiGetFieldValue('custbody22')!='T') || (type == 'create')) && (nlapiGetFieldValue('custbody25')=='T')) {   
    	var recipient = nlapiGetFieldValue('custbody_fun_po_contact')

    	var srch = nlapiLoadSearch('transaction', 'customsearch_fun_dummy_po');
		nlapiLogExecution('DEBUG', srch)

		var filters = new Array();
		filters[0] = new nlobjSearchFilter('internalid', null, 'anyof', nlapiGetRecordId());
		filters[1] = new nlobjSearchFilter('mainline', null, 'is', 'T');

		srch.setFilters(filters);

		var srchResultSet = srch.runSearch();

		var srchRes = srchResultSet.getResults(0,1000);

		var columns = new Array();
		columns = srchRes[0].getAllColumns();

		var attachments = new Array();

		//Loop through search results and store it to attachments
		for(var i = 0; i < srchRes.length; i++) {
			nlapiLogExecution('DEBUG', i);
			var currFile = srchRes[i].getValue(columns[0]);
			if(currFile != null && currFile != ''){
				attachments[i] = nlapiLoadFile(currFile);   
			}

		}
		var soRecord  = nlapiLoadRecord( nlapiGetRecordType(), nlapiGetRecordId() );
		var tranID = soRecord.getFieldValue('tranid');
		nlapiLogExecution('DEBUG','tranID',tranID); 

		var recipientEmail = nlapiLookupField('employee', recipient, 'email');
		var cc = ('Accounts.Payable@funimation.com');
		nlapiLogExecution('DEBUG', 'recipient', recipientEmail)
		var subject = 'Purchase Order# ' + tranID +' missing Purchase Order.';
		
		var vendorName = nlapiGetFieldText('entity','text','Name','LEFT');
		var tranDate = nlapiGetFieldValue('trandate');
		var amount = nlapiGetFieldValue('total');

		var rec = new Array();
		rec['transaction'] = nlapiGetRecordId(); 
		nlapiLogExecution('DEBUG', 'nlapiGetRecordId', nlapiGetRecordId());
		nlapiLogExecution('DEBUG', 'sender', nlapiGetUser());

		if( nlapiGetFieldValue('custbody_fun_po_contact') != null && nlapiGetFieldValue('custbody_fun_po_contact') != ''){
			nlapiSendEmail(nlapiGetUser(), recipientEmail, subject, 'Hello, <br> <br> We received Bill from ' + vendorName + ' on ' + tranDate + ' in amount of $' + amount + ' that is missing Purchase Order in NetSuite.<br>A dummy Purchase Order#  <B>'+ tranID +'</B> has been created, could you please review Purchase Order# <B>' + tranID +'</B> based on the Bill documents attached.<br><B>**</B>To convert this Dummy PO to Original PO, please mark <B>"DUMMY PO FOR BILL RECEIVED IN ADV. OF PO"</B> as False.<br> Please also provide and attach additional supporting document in case blanket PO date required to be updated.<br> <br> Please let Accounts Payable Department know if you have any questions.', cc, null, rec, attachments);
		}

		var soRecord  = nlapiLoadRecord( nlapiGetRecordType(), nlapiGetRecordId() );
		soRecord.setFieldValue('custbody22','T');

		var submittedRec  = nlapiSubmitRecord(soRecord,true,true);
		nlapiLogExecution('DEBUG', 'custbody22', submittedRec)	

		
	}
	}catch(e){
		nlapiLogExecution('ERROR','Error Occured in record Id - '+nlapiGetRecordId(),e);
	}
}