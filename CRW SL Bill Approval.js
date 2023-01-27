/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/email', 'N/record', 'N/redirect', 'N/runtime', 'N/search', 'N/url', 'N/render', 'N/file'],
		/**
		 * @param {email} email
		 * @param {record} record
		 * @param {redirect} redirect
		 * @param {runtime} runtime
		 * @param {search} search
		 * @param {url} url
		 */
		function(email, record, redirect, runtime, search, url, render, file) {


	/***********Global Variables*************/
	var suiteletCalled     = ['customscript_crw_sl_bill_approval','customdeploy_crw_sl_bill_approval'];
	var approveImgFileName = 'poApproved.gif'; // GIF image name which is stored in Filecabinet
	var rejectImgFileName  = 'poReject.gif';
	var failureImgFileName = 'PoFailure.gif';
	var preloaderImage     = 'Popreloader.gif';
	/**
	 * Definition of the Suitelet script trigger point.
	 *
	 * @param {Object} context
	 * @param {ServerRequest} context.request - Encapsulation of the incoming request
	 * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
	 * @Since 2015.2
	 */
	function onRequest(context) {
		try{
			var recordId       = context.request.parameters.recId;
			var action         = context.request.parameters.action;
			var emailApprover  = context.request.parameters.approver;
			var urlData        = context.request.parameters.field1;
			var recordApproval = context.request.parameters.redir;
			var htmlPasscode   = context.request.parameters.PassCode;
			var rejComments    = context.request.parameters.Comments;
			var userRole       = context.request.parameters.role;
			var approvalMode   = context.request.parameters.mode;

			var suiteletUrl    = url.resolveScript({scriptId: suiteletCalled[0],deploymentId: suiteletCalled[1],returnExternalUrl: true});

			var billRec = record.load({type : record.Type.VENDOR_BILL,id : recordId});
			var itemLines           = billRec.getLineCount({sublistId: 'item'   	 	 });
			var expenseLines        = billRec.getLineCount({sublistId: 'expense'		 });
			var referenceNumber     = billRec.getValue({fieldId : 'tranid'});
			if(!isEmpty(referenceNumber)){
				documentNumber = referenceNumber;
			}else{
				documentNumber = billRec.getValue({fieldId : 'transactionnumber'});
			}
			var vendor              = billRec.getText ({ fieldId : 'entity'     		 });
			var total               = billRec.getText ({ fieldId : 'total' 				 });
			var approvedByText      = billRec.getText({ fieldId : 'custbody_last_approved_by'  });
			var billCreator         = billRec.getValue({fieldId : 'custbody_createdby'         });
			var billCreatorText     = billRec.getText({ fieldId : 'custbody_createdby'         }); 
			var currentApprover     = billRec.getValue({fieldId : 'custbody_crw_next_approver' });
			var currentApproverText = billRec.getText({ fieldId : 'custbody_crw_next_approver' });
			var firstApprover       = billRec.getValue({fieldId : 'custbody_first_approver'});
			var secondApprover      = billRec.getValue({fieldId : 'custbody8' 			 });
			var thirdApprover       = billRec.getValue({fieldId : 'custbody9' 			 });
			var fourthApprover      = billRec.getValue({fieldId : 'custbody10'			 });
			var financeApprover     = billRec.getValue({fieldId : 'custbody_crw_finance_approver'});
			var firstApproverText   = billRec.getText({ fieldId : 'custbody7'                  });
			var secondApproverText  = billRec.getText({ fieldId : 'custbody8'                  });
			var thirdApproverText   = billRec.getText({ fieldId : 'custbody9'                  });
			var fourthApproverText  = billRec.getText({ fieldId : 'custbody10'                 });
			var financeApproverText = billRec.getText({ fieldId : 'custbody_crw_finance_approver'});
			var stage               = billRec.getValue({fieldId : 'custbody_stage'             });
			var approvedByviaWebpage= billRec.getValue({fieldId : 'custbody_approved_by'       });
			var approvedByviaNS     = billRec.getValue({fieldId : 'custbody_crw_approved_by_via_netsuite'});
			var rejectedBy          = billRec.getValue({fieldId : 'custbody_rejected_by'       });
			var recPasscode         = billRec.getValue({fieldId : 'custbody_crw_po_appr_passcode'});
			var isEdited            = billRec.getValue({fieldId : 'custbody_crw_po_approval_edited'});
			var skippedApprovers    = billRec.getValue({fieldId : 'custbody_crw_approvers_skipped'});
			var editedNumber        = Number(billRec.getValue({fieldId : 'custbody_crw_po_edited_number'}));	
			var memo                = billRec.getValue({fieldId:'memo'});
			var nextApprover        = '';
			var nextApproverText    = '';
			var actionPerformed     = '';
			var result              = 'failed';
			log.debug('financeApprover',financeApprover+' and '+financeApproverText);
			log.debug('approvedBy',approvedByviaWebpage+' and '+approvedByviaNS+' and '+emailApprover);
			log.debug('log',approvedByviaWebpage.indexOf(emailApprover)+' and '+approvedByviaNS.indexOf(emailApprover));

			var itemLines      = billRec.getLineCount({sublistId:'item'});
			var expenselines   = billRec.getLineCount({sublistId:'expense'});
			var tableData      = '<div>';
			if(itemLines > 0){
				tableData    += '<h5 style="text-align: left;"><b style="padding-right:70px;"><u>Item Sublist</u></b></h5><div style="height:10px;"></div><table>';
				tableData += '<thead><tr><th>Item</th><th>Description</th><th>Quantity</th><th>Unit Rate</th><th>Amount</th><th>Currency</th><th>Property Hierarchy</th><th>Cost Center</th></tr></thead><tbody>';
				for(var r=0; r<itemLines; r++){
					tableData += '<tr><td>'+billRec.getSublistText({sublistId:'item',fieldId:'item',line:r});+'</td>';
					tableData += '<td>'+billRec.getSublistValue({sublistId:'item',fieldId:'description',line:r});+'</td>';
					tableData += '<td>'+billRec.getSublistValue({sublistId:'item',fieldId:'quantity',line:r});+'</td>';
					tableData += '<td>'+billRec.getSublistValue({sublistId:'item',fieldId:'rate',line:r});+'</td>';
					tableData += '<td>'+billRec.getSublistValue({sublistId:'item',fieldId:'amount',line:r});+'</td>';
                  	tableData += '<td>' + billRec.getText({ fieldId:'currency', line:r }); +'</td>';
                  tableData += '<td>'+billRec.getSublistText({sublistId:'item',fieldId:'class',line:r});+'</td>';
					tableData += '<td>'+billRec.getSublistText({sublistId:'item',fieldId:'department',line:r});+'</td></tr>';
				}
				tableData    += '</tbody></table><div style="height:15px;"></div>';
			}
			if(expenselines > 0){
				tableData    += '<h5 style="text-align: left;"><b style="padding-right:70px;"><u>Expense Sublist</u></b></h5><div style="height:10px;"></div><table>';
				tableData += '<thead><tr><th>Account</th><th>Amount</th><th>Currency</th><th>Memo</th><th>Property Hierarchy</th><th>Cost Center</th></tr></thead><tbody>';
				for(var q=0; q<expenselines; q++){
					tableData += '<tr><td>'+billRec.getSublistText({sublistId:'expense',fieldId:'account',line:q});+'</td>';
					tableData += '<td>'+billRec.getSublistText({sublistId:'expense',fieldId:'amount',line:q});+'</td>';
                  tableData += '<td>' + billRec.getText({ fieldId:'currency', line:q}); +'</td>';
					tableData += '<td>'+billRec.getSublistValue({sublistId:'expense',fieldId:'memo',line:q});+'</td>';
					tableData += '<td>'+billRec.getSublistText({sublistId:'expense',fieldId:'class',line:q});+'</td>';
					tableData += '<td>'+billRec.getSublistText({sublistId:'expense',fieldId:'department',line:q});+'</td></tr>';
				}
				tableData    += '</tbody></table>';
			}
			tableData    += '</div>';


			if( !isEmpty(recPasscode)){
				recPasscode = JSON.parse(recPasscode);
				if(!isEmpty(htmlPasscode)){
					log.debug('Passcode on Record - '+recPasscode[emailApprover], 'submitted Passcode - '+htmlPasscode);
					if(recPasscode[emailApprover] != htmlPasscode){
						context.response.write('Incorrect Passcode');
						return;
					}
				}
			}
			log.debug('stage- '+stage,'emailApprover-'+emailApprover+', userRole-'+userRole);

			if(action == 'approve'){

				try{
					var emailSent = false;
					if(stage == 4 && (financeApprover.indexOf(emailApprover) != -1 || userRole == '3')){

						billRec.setValue({fieldId: 'custbody_stage'            , value:'5'      });
						billRec.setValue({fieldId: 'custbody_last_approved_by' , value: emailApprover});
						billRec.setValue({fieldId: 'custbody_crw_next_approver', value: ''      });
						if(approvalMode == 'vianetsuite'){	
							approvedByviaNS.push(emailApprover);
							billRec.setValue({fieldId: 'custbody_crw_approved_by_via_netsuite', value: approvedByviaNS});
						}else{
							approvedByviaWebpage.push(emailApprover);
							billRec.setValue({fieldId: 'custbody_approved_by', value: approvedByviaWebpage});							
						}
						delete recPasscode[financeApprover];
						billRec.setValue({fieldId: 'custbody_crw_po_appr_passcode', value: JSON.stringify(recPasscode)});
						if(userRole == '3'){
							for(var app=0; app<financeApprover.length; app++){
								skippedApprovers.push(financeApprover[app]);			
							}							
							log.debug('skippedApprovers',skippedApprovers);
							billRec.setValue({fieldId: 'custbody_crw_approvers_skipped',value:skippedApprovers});
						}
						nextApprover = '';

					}else if(stage == 3 && (emailApprover == fourthApprover || userRole == '3')){
						if(approvedByviaNS.indexOf(financeApprover) == -1 && approvedByviaWebpage.indexOf(financeApprover) == -1 && financeApprover != emailApprover && skippedApprovers.indexOf(financeApprover) == -1){
							nextApprover     = financeApprover;
							nextApproverText = financeApproverText;
							stage            = 4;
						}else{
							nextApprover     = financeApprover;
							nextApproverText = financeApproverText;
							stage            = 4;
						}
						billRec.setValue({fieldId: 'custbody_stage'            , value:stage        });
						billRec.setValue({fieldId: 'custbody_last_approved_by' , value: emailApprover});
						billRec.setValue({fieldId: 'custbody_crw_next_approver', value: nextApprover});
						//		approvedBy.push(emailApprover);
						//		billRec.setValue({fieldId: 'custbody_approved_by', value: approvedBy});
						if(approvalMode == 'vianetsuite'){	
							approvedByviaNS.push(emailApprover);
							billRec.setValue({fieldId: 'custbody_crw_approved_by_via_netsuite', value: approvedByviaNS});
						}else{
							approvedByviaWebpage.push(emailApprover);
							billRec.setValue({fieldId: 'custbody_approved_by', value: approvedByviaWebpage});							
						}
						if(userRole == '3'){
							skippedApprovers.push(fourthApprover);
							billRec.setValue({fieldId: 'custbody_crw_approvers_skipped',value:skippedApprovers});
						}
						delete recPasscode[fourthApprover];
						billRec.setValue({fieldId: 'custbody_crw_po_appr_passcode', value: JSON.stringify(recPasscode)});
						/*
					if(approvedBy.indexOf(fifthApprover) == -1 && fifthApprover != emailApprover && skippedApprovers.indexOf(fifthApprover) == -1){
						nextApprover     = fifthApprover;
						nextApproverText = fifthApproverText;
						stage            = 4;
					}
					log.debug('nextApprover'+nextApprover);
					billRec.setValue({fieldId: 'custbody_stage'            , value:stage        });
					billRec.setValue({fieldId: 'custbody_last_approved_by' , value: emailApprover});
					billRec.setValue({fieldId: 'custbody_crw_next_approver', value: nextApprover});
					approvedBy.push(emailApprover);
					billRec.setValue({fieldId: 'custbody_approved_by', value: approvedBy});
					if(userRole == '3'){
						skippedApprovers.push(fourthApprover);
						billRec.setValue({fieldId: 'custbody_crw_approvers_skipped',value:skippedApprovers});
					}
					delete recPasscode[fourthApprover];
					billRec.setValue({fieldId: 'custbody_crw_po_appr_passcode', value: JSON.stringify(recPasscode)});
						 */

						//4th approver has clicked the approve button. There are no further approvers, PO status will be changes to approved
						/*billRec.setValue({fieldId: 'custbody_stage'            , value:'4'      });
						billRec.setValue({fieldId: 'custbody_last_approved_by' , value: emailApprover});
						billRec.setValue({fieldId: 'custbody_crw_next_approver', value: ''      });
						approvedBy.push(emailApprover);
						billRec.setValue({fieldId: 'custbody_approved_by', value: approvedBy});
						delete recPasscode[fourthApprover];
						billRec.setValue({fieldId: 'custbody_crw_po_appr_passcode', value: JSON.stringify(recPasscode)});
						if(userRole == '3'){
							skippedApprovers.push(fourthApprover);
							billRec.setValue({fieldId: 'custbody_crw_approvers_skipped',value:skippedApprovers});
						}
						nextApprover = '';*/
					}else if(stage == 2  && (emailApprover == thirdApprover || userRole == '3')){
						if((approvedByviaNS.indexOf(fourthApprover) == -1 && approvedByviaWebpage.indexOf(fourthApprover) == -1 && fourthApprover != emailApprover && skippedApprovers.indexOf(fourthApprover) == -1) && (fourthApprover != null && fourthApprover != '' && fourthApprover != undefined)){
							nextApprover     = fourthApprover;
							nextApproverText = fourthApproverText;
							stage            = 3;
						}else{
							nextApprover     = financeApprover;
							nextApproverText = financeApproverText;
							stage            = 4;
						}/*else if(approvedBy.indexOf(financeApprover) == -1 && financeApprover != emailApprover && skippedApprovers.indexOf(financeApprover) == -1){
							nextApprover     = financeApprover;
							nextApproverText = financeApproverText;
							stage            = 4;
						}*/
						/*else if(approvedBy.indexOf(fifthApprover) == -1 && fifthApprover != emailApprover && skippedApprovers.indexOf(fifthApprover) == -1){
						nextApprover     = fifthApprover;
						nextApproverText = fifthApproverText;
						stage            = 4;
					}*/
						billRec.setValue({fieldId: 'custbody_stage'            , value:stage        });
						billRec.setValue({fieldId: 'custbody_last_approved_by' , value: emailApprover});
						billRec.setValue({fieldId: 'custbody_crw_next_approver', value: nextApprover});
						//	approvedBy.push(emailApprover);
						//	billRec.setValue({fieldId: 'custbody_approved_by', value: approvedBy});
						if(approvalMode == 'vianetsuite'){	
							approvedByviaNS.push(emailApprover);
							billRec.setValue({fieldId: 'custbody_crw_approved_by_via_netsuite', value: approvedByviaNS});
						}else{
							approvedByviaWebpage.push(emailApprover);
							billRec.setValue({fieldId: 'custbody_approved_by', value: approvedByviaWebpage});							
						}
						if(userRole == '3'){
							skippedApprovers.push(thirdApprover);
							billRec.setValue({fieldId: 'custbody_crw_approvers_skipped',value:skippedApprovers});
						}
						delete recPasscode[thirdApprover];
						billRec.setValue({fieldId: 'custbody_crw_po_appr_passcode', value: JSON.stringify(recPasscode)});

					}else if(stage == 1 && (emailApprover == secondApprover || userRole == '3')){
						if((approvedByviaNS.indexOf(thirdApprover) == -1 && approvedByviaWebpage.indexOf(thirdApprover) == -1 && thirdApprover != emailApprover && skippedApprovers.indexOf(thirdApprover) == -1) && (thirdApprover != null && thirdApprover != '' && thirdApprover != undefined)){ //email approver can be administrator
							nextApprover     = thirdApprover;
							nextApproverText = thirdApproverText;
							stage            = 2;
						}else if((approvedByviaNS.indexOf(fourthApprover) == -1 && approvedByviaWebpage.indexOf(fourthApprover) == -1 && fourthApprover != emailApprover && skippedApprovers.indexOf(fourthApprover) == -1) && (fourthApprover != null && fourthApprover != '' && fourthApprover != undefined)){
							nextApprover     = fourthApprover;
							nextApproverText = fourthApproverText;
							stage            = 3;
						}else{
							nextApprover     = financeApprover;
							nextApproverText = financeApproverText;
							stage            = 4;
						}/*else if(approvedBy.indexOf(financeApprover) == -1 && financeApprover != emailApprover && skippedApprovers.indexOf(financeApprover) == -1){
							nextApprover     = financeApprover;
							nextApproverText = financeApproverText;
							stage            = 4;
						}*/
						/*else if(approvedBy.indexOf(fifthApprover) == -1 && fifthApprover != emailApprover && skippedApprovers.indexOf(fifthApprover) == -1){
						nextApprover     = fifthApprover;
						nextApproverText = fifthApproverText;
						stage            = 4;
					}*/
						billRec.setValue({fieldId: 'custbody_stage'            , value:stage        });
						billRec.setValue({fieldId: 'custbody_last_approved_by' , value: emailApprover});
						billRec.setValue({fieldId: 'custbody_crw_next_approver', value: nextApprover});
						//		approvedBy.push(emailApprover);
						//		billRec.setValue({fieldId: 'custbody_approved_by', value: approvedBy});
						if(approvalMode == 'vianetsuite'){	
							approvedByviaNS.push(emailApprover);
							billRec.setValue({fieldId: 'custbody_crw_approved_by_via_netsuite', value: approvedByviaNS});
						}else{
							approvedByviaWebpage.push(emailApprover);
							billRec.setValue({fieldId: 'custbody_approved_by', value: approvedByviaWebpage});							
						}
						if(userRole == '3'){
							skippedApprovers.push(secondApprover);
							billRec.setValue({fieldId: 'custbody_crw_approvers_skipped',value:skippedApprovers});
						}
						delete recPasscode[secondApprover];
						billRec.setValue({fieldId: 'custbody_crw_po_appr_passcode', value: JSON.stringify(recPasscode)});
					}else if((stage ==  0 && emailApprover == firstApprover) || (stage ==  0 && userRole == '3')){
						if( firstApprover ==  secondApprover || emailApprover == secondApprover){
							if(firstApprover == thirdApprover || emailApprover == thirdApprover){
								if(firstApprover == fourthApprover || emailApprover == fourthApprover){
									/*if(firstApprover == financeApprover || emailApprover == financeApprover){
										nextApprover     = '';
										nextApproverText = '';
										stage            = 5;
									}else{
										nextApprover     = financeApprover;
										nextApproverText = financeApproverText;
										stage            = 4;
									}*/
									nextApprover     = financeApprover;
									nextApproverText = financeApproverText;
									stage            = 4;
								}else{
									if(fourthApprover != null && fourthApprover != '' && fourthApprover != undefined){
										nextApprover     = fourthApprover;
										nextApproverText = fourthApproverText;
										stage            = 3;
									}else{
										nextApprover     = financeApprover;
										nextApproverText = financeApproverText;
										stage            = 4;
									}
								}
							}else{
								if(thirdApprover != null && thirdApprover != '' && thirdApprover != undefined){
									nextApprover     = thirdApprover;
									nextApproverText = thirdApproverText;
									stage            = 2;
								}else{
									nextApprover     = financeApprover;
									nextApproverText = financeApproverText;
									stage            = 4;									
								}
							}
						}else{
							if(secondApprover != null && secondApprover != '' && secondApprover != undefined){
								nextApprover     = secondApprover;
								nextApproverText = secondApproverText;
								stage            = 1;
							}else{
								nextApprover     = financeApprover;
								nextApproverText = financeApproverText;
								stage            = 4;
							}
						}
						log.debug('stage at 0',stage+' and '+nextApprover);
						billRec.setValue({fieldId: 'custbody_stage'            , value:stage        });
						billRec.setValue({fieldId: 'custbody_last_approved_by' , value: emailApprover});
						billRec.setValue({fieldId: 'custbody_crw_next_approver', value: nextApprover});
						//		approvedBy.push(emailApprover);
						//		billRec.setValue({fieldId: 'custbody_approved_by', value: approvedBy});
						if(approvalMode == 'vianetsuite'){	
							approvedByviaNS.push(emailApprover);
							billRec.setValue({fieldId: 'custbody_crw_approved_by_via_netsuite', value: approvedByviaNS});
						}else{
							approvedByviaWebpage.push(emailApprover);
							log.debug('approvedByviaWebpage',approvedByviaWebpage);
							billRec.setValue({fieldId: 'custbody_approved_by', value: approvedByviaWebpage});							
						}
						if(userRole == '3'){
							skippedApprovers.push(firstApprover);
							billRec.setValue({fieldId: 'custbody_crw_approvers_skipped',value:skippedApprovers});
						}
						delete recPasscode[firstApprover];
						billRec.setValue({fieldId: 'custbody_crw_po_appr_passcode', value: JSON.stringify(recPasscode)});
					}
					// Add a Note
					if(rejComments != null && rejComments != '' && rejComments != undefined){
						var noteRec = record.create({type: 'note',isDynamic: true});
						noteRec.setValue({fieldId : 'title'      , value : 'Approved'});
						noteRec.setValue({fieldId : 'author'     , value : emailApprover});
						noteRec.setValue({fieldId : 'transaction', value : recordId});
						noteRec.setValue({fieldId : 'note'       , value : rejComments});
						noteRec.setValue({fieldId : 'custrecord_crw_po_edited', value :editedNumber});
						noteRec.save({ignoreMandatoryFields : true});
					}
					//search on usernotes
					var returnedTable = approversDataInEmail(recordId,editedNumber,firstApproverText,secondApproverText,thirdApproverText,fourthApproverText,itemLines,expenseLines);

					if( nextApprover != '' && nextApprover != null && nextApprover != undefined){
						log.debug('nextApprover.length',nextApprover.length+' and '+Array.isArray(nextApprover));
						if((Array.isArray(nextApprover) == 'true' || Array.isArray(nextApprover) == true) && nextApprover.length>1){
							for(na=0; na<nextApprover.length; na++){
								log.debug('nextApprover',nextApprover);
								if(emailApprover != null && emailApprover != '' && documentNumber != null && documentNumber != '' && recordId != null && recordId != '' && suiteletUrl != null && suiteletUrl != '' && recPasscode[nextApprover[na]] != null && recPasscode[nextApprover[na]] != '' ){
									var status = 'Pending Approval';
									emailSent  = sendEmail(emailApprover,nextApprover[na],nextApproverText[na],documentNumber,recordId,status,suiteletUrl,recPasscode[nextApprover[na]],isEdited,null,returnedTable,tableData);
								}
							}							
						}else{
							log.debug('nextApprover',nextApprover);
							if(emailApprover != null && emailApprover != '' && documentNumber != null && documentNumber != '' && recordId != null && recordId != '' && suiteletUrl != null && suiteletUrl != '' && recPasscode[nextApprover] != null && recPasscode[nextApprover] != '' ){
								var status = 'Pending Approval';
								emailSent  = sendEmail(emailApprover,nextApprover,nextApproverText,documentNumber,recordId,status,suiteletUrl,recPasscode[nextApprover],isEdited,null,returnedTable,tableData);
							}
						}
						log.debug(emailApprover+' and '+documentNumber+' and '+recordId,recPasscode[nextApprover]);

					}else{
						//If First approver and fourthApprover are same, then there's no to send the mail again to fourth approver since ha had already approved it in 1st stage, so we will approve it as there are no further approvers
						billRec.setValue({fieldId: 'approvalstatus', value: 2});
						if(emailApprover != null && emailApprover != '' && billCreator != null && billCreator != '' && documentNumber != null && documentNumber != '' && recordId != null && recordId != '' ){
							var status = 'Approved';
							emailSent = sendEmail(emailApprover,billCreator,billCreatorText,documentNumber,recordId,status,null,null,null,null,returnedTable,tableData);
						}
					}
					var savedRecId = billRec.save({ignoreMandatoryFields:true});
					log.debug('savedRecId',savedRecId+' and '+emailSent);
					if( savedRecId == null || savedRecId == '' || savedRecId == undefined || emailSent != true){
						result = 'failed';
					}else{
						result = 'approved';
					}
				}catch(e){
					log.error('Error occured in Approving part for Bill:'+recordId,e);
					result = 'failed';
				}
				if( recordApproval == 'redir'){
					if(recordId != null && recordId != '' && recordId!= undefined){
						redirect.toRecord({type : record.Type.VENDOR_BILL, id : recordId});
					}else{
						context.response.write('Unexpected Error. Please Contact your administrator.');
					}
				}else{
					log.debug('result',result);
					context.response.write(result);
					return;
				}

			}else if( action == 'reject'){
				try{
					billRec.setValue({fieldId: 'approvalstatus'               ,value: 3});
					billRec.setValue({fieldId: 'custbody_rejected_by'         ,value: emailApprover});
					billRec.setValue({fieldId: 'custbody_crw_next_approver'   ,value: ''});
					billRec.setValue({fieldId: 'custbody11'                   ,value: rejComments});
					billRec.setValue({fieldId: 'custbody_crw_po_appr_passcode', value: ''});
					//Add a note
					if(rejComments != null && rejComments != '' && rejComments != undefined){
						var noteRec = record.create({type: 'note',isDynamic: true});
						noteRec.setValue({fieldId : 'title'      , value : 'Rejected'});
						noteRec.setValue({fieldId : 'author'     , value : emailApprover});
						noteRec.setValue({fieldId : 'transaction', value : recordId});
						noteRec.setValue({fieldId : 'note'       , value : rejComments});
						noteRec.setValue({fieldId : 'custrecord_crw_po_edited', value :editedNumber});
						var noteRecId = noteRec.save({ignoreMandatoryFields : true});		
						log.debug('noteRecId',noteRecId);

					}

					var returnedTable = approversDataInEmail(recordId,editedNumber,firstApproverText,secondApproverText,thirdApproverText,fourthApproverText/*,fifthApproverText*/,itemLines,expenseLines);

					if(emailApprover != null && emailApprover != '' && billCreator != null &&billCreator != '' && documentNumber != null && documentNumber != '' && recordId != null && recordId != ''){
						var status = 'Rejected';
						var emailsent = sendEmail(emailApprover,billCreator,billCreatorText,documentNumber,recordId,status,null,null,null,rejComments,returnedTable,tableData);
					}else{
						result = 'mail not sent';
					}
					var savedRecId = billRec.save({ignoreMandatoryFields : true});
					if( savedRecId != null && savedRecId != '' && savedRecId != undefined && result != 'mail not sent'){
						result = 'rejected';
					}else{
						result = 'failed';
					}
				}catch(e){
					log.error('Error occured while rejecting the PO id:'+ recordId,e);
					result = 'failed';
				}
				if( recordApproval == 'redir'){
					if(recordId != null && recordId != '' && recordId!= undefined){
						redirect.toRecord({type : record.Type.VENDOR_BILL, id : recordId});
					}else{
						context.response.write('Unexpected Error. Please Contact your administrator.');
					}
				}else{
					log.debug('result',result);
					context.response.write(result);
					return;
				}
			}else{
				var approveImageUrl = getUrl(approveImgFileName);
				var rejectImageUrl  = getUrl(rejectImgFileName);
				var FailureImageUrl = getUrl(failureImgFileName);
				var loaderImageUrl  = getUrl(preloaderImage);
				/*if(stage == 0 && approvedByviaNS.indexOf(billRec.getValue({fieldId : 'custbody8'})) == -1 && approvedByviaWebpage.indexOf(billRec.getValue({fieldId : 'custbody8'})) == -1 && billRec.getValue({fieldId : 'custbody8'}) != emailApprover){
					if(isEmpty(secondApprover) && isEmpty(thirdApprover) && isEmpty(fourthApprover)){
						nextApprover     = billRec.getValue({fieldId : 'custbody_crw_finance_approver'});
						nextApproverText = billRec.getText({fieldId : 'custbody_crw_finance_approver'});
					}else{
						nextApprover     = billRec.getValue({fieldId : 'custbody8'});//2nd approver
						nextApproverText = billRec.getText({fieldId : 'custbody8'});
					}
				}*/if(stage ==  0 || userRole == '3'){
					if( firstApprover ==  secondApprover || emailApprover == secondApprover){
						if(firstApprover == thirdApprover || emailApprover == thirdApprover){
							if(firstApprover == fourthApprover || emailApprover == fourthApprover){
								nextApprover     = financeApprover;
								nextApproverText = financeApproverText;
							}else{
								if(fourthApprover != null && fourthApprover != '' && fourthApprover != undefined){
									nextApprover     = fourthApprover;
									nextApproverText = fourthApproverText;
								}else{
									nextApprover     = financeApprover;
									nextApproverText = financeApproverText;
								}
							}
						}else{
							if(thirdApprover != null && thirdApprover != '' && thirdApprover != undefined){
								nextApprover     = thirdApprover;
								nextApproverText = thirdApproverText;
							}else{
								nextApprover     = financeApprover;
								nextApproverText = financeApproverText;
							}
						}
					}else{
						if(secondApprover != null && secondApprover != '' && secondApprover != undefined){
							nextApprover     = secondApprover;
							nextApproverText = secondApproverText;
						}else{
							nextApprover     = financeApprover;
							nextApproverText = financeApproverText;
						}
					}
				}else if(stage == 1 && (emailApprover == secondApprover || userRole == '3')){
					if((approvedByviaNS.indexOf(thirdApprover) == -1 && approvedByviaWebpage.indexOf(thirdApprover) == -1) && (thirdApprover != null && thirdApprover != '' && thirdApprover != undefined)){ //email approver can be administrator
						nextApprover     = thirdApprover;
						nextApproverText = thirdApproverText;
					}else if((approvedByviaNS.indexOf(fourthApprover) == -1 && approvedByviaWebpage.indexOf(fourthApprover) == -1) && (fourthApprover != null && fourthApprover != '' && fourthApprover != undefined)){
						nextApprover     = fourthApprover;
						nextApproverText = fourthApproverText;
					}else{
						nextApprover     = financeApprover;
						nextApproverText = financeApproverText;
					}
				}else if(stage == 2  || userRole == '3'){
					if((approvedByviaNS.indexOf(fourthApprover) == -1 && approvedByviaWebpage.indexOf(fourthApprover) == -1) && (fourthApprover != null && fourthApprover != '' && fourthApprover != undefined)){
						nextApprover     = fourthApprover;
						nextApproverText = fourthApproverText;
					}else{
						nextApprover     = financeApprover;
						nextApproverText = financeApproverText;
					}
				}else if(stage == 3 || userRole == '3'){
					if(approvedByviaNS.indexOf(financeApprover) == -1 && approvedByviaWebpage.indexOf(financeApprover) == -1){
						nextApprover     = financeApprover;
						nextApproverText = financeApproverText;
					}else{
						nextApprover     = financeApprover;
						nextApproverText = financeApproverText;
					}
				}/*else if((stage == 1 || stage == 0) && approvedByviaNS.indexOf(billRec.getValue({fieldId : 'custbody9'})) == -1 && approvedByviaWebpage.indexOf(billRec.getValue({fieldId : 'custbody9'})) == -1  && billRec.getValue({fieldId : 'custbody9'}) != emailApprover){
					if(isEmpty(thirdApprover) && isEmpty(fourthApprover)){
						nextApprover     = billRec.getValue({fieldId : 'custbody_crw_finance_approver'});
						nextApproverText = billRec.getText({fieldId : 'custbody_crw_finance_approver'});
					}else{
						nextApprover     = billRec.getValue({fieldId : 'custbody9'});//3rd approver
						nextApproverText = billRec.getText({fieldId : 'custbody9'});
					}
				}else if((stage == 2 || stage == 1 || stage == 0) && approvedByviaNS.indexOf(billRec.getValue({fieldId : 'custbody10'})) == -1 && approvedByviaWebpage.indexOf(billRec.getValue({fieldId : 'custbody10'})) == -1  && billRec.getValue({fieldId : 'custbody10'}) != emailApprover){
					if(isEmpty(fourthApprover)){
						nextApprover     = billRec.getValue({fieldId : 'custbody_crw_finance_approver'});
						nextApproverText = billRec.getText({fieldId : 'custbody_crw_finance_approver'});
					}else{
						nextApprover     = billRec.getValue({fieldId : 'custbody10'});//4th approver
						nextApproverText = billRec.getText({fieldId : 'custbody10'});
					}
				}*//*else if((stage == 3 ||  stage == 2 || stage == 1 || stage == 0) && approvedByviaNS.indexOf(billRec.getValue({fieldId : 'custbody_crw_finance_approver'})) == -1  && approvedByviaWebpage.indexOf(billRec.getValue({fieldId : 'custbody_crw_finance_approver'})) == -1 && billRec.getValue({fieldId : 'custbody_crw_finance_approver'}) != emailApprover){
					nextApprover     = billRec.getValue({fieldId : 'custbody_crw_finance_approver'});//finance approver
					nextApproverText = billRec.getText({fieldId : 'custbody_crw_finance_approver'});
					log.debug('nextApproverText',nextApproverText);
				}*/
				var domainUrl   = url.resolveDomain({hostType: url.HostType.APPLICATION});	
				var billLink     = "https://"+domainUrl+url.resolveRecord({recordType: 'vendorbill',recordId: recordId});

				var xhtml  = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"><html><head>';
				xhtml += '<meta charset="utf-8">';
				xhtml += '<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">';
				xhtml += '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">';
				xhtml += '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">';
				xhtml += '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>';
				xhtml += '<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js"></script>';
				xhtml += '<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>'; //$("#myModal").modal("show");
				xhtml += '<style>.pre-loader {position: fixed;left: 0px;top: 0px;width: 100%;height: 100%;z-index: 9999;background: url("'+loaderImageUrl+'") center no-repeat #fff;opacity: 0.5;filter: alpha(opacity=50);}.modal {top: 25%;}</style>';
				xhtml += '<script>function linesAction(){var id=event.target.id;var lines=$("#linetable tr").length;if(lines>0){var jsonData={"approved":[],"rejected":[]};var table = document.getElementById("linetable");if(id == "approveall"){for(var i=1;i<lines;i++){var Id = table.rows[i].cells[0].id;$("#all_"+Id).removeClass("fa fa-exclamation-triangle");$("#all_"+Id).removeClass("fa fa-close");$("#all_"+Id).addClass("fa fa-check");$("#all_"+Id).css("color","green");jsonData["approved"].push(Id);}';
				xhtml += '}else if(id == "rejectall"){for(var i=1;i<lines;i++){var Id = table.rows[i].cells[0].id;$("#all_"+Id).removeClass("fa fa-exclamation-triangle");$("#all_"+Id).removeClass("fa fa-check");$("#all_"+Id).addClass("fa fa-close");$("#all_"+Id).css("color","red");jsonData["rejected"].push(Id);}}$("#jsondata").val(JSON.stringify(jsonData));}}</script>';
				xhtml += '<script>function approvePO(){var passCode = $("#passcode").val();var Comment = $("#comments").val();if(passCode != null && passCode != "" && passCode != undefined){$("#preloader").addClass("pre-loader");$.ajax({url: "'+suiteletUrl+'",type: "POST",data:{action:"approve",recId:'+recordId+',approver:'+emailApprover+',PassCode:passCode,Comments:Comment},success: function(response){$("#preloader").removeClass("pre-loader");if(response=="Incorrect Passcode"){alert("Incorrect Passcode.");}else{ if(response=="approved"){$("#approveimg").css("display","block");}else{$("#failureimg").css("display","block");}$("#imgblock").show();$("#mainblock").hide();}}});}else{alert("Please Enter Passcode.");}}</script>';
				xhtml += '<script>function rejectPO(){var passCode = $("#passcode").val();var Comment = $("#comments").val();if(Comment != null && Comment != "" && Comment != undefined){if(passCode != null && passCode != "" && passCode != undefined){$("#preloader").addClass("pre-loader");$.ajax({url: "'+suiteletUrl+'",type: "POST",data:{action:"reject",recId:'+recordId+',approver:'+emailApprover+',PassCode:passCode,Comments:Comment},success: function(response){$("#preloader").removeClass("pre-loader");if(response=="Incorrect Passcode"){alert("Incorrect Passcode.");}else{if(response=="rejected"){$("#rejectimg").css("display","block");}else{$("#failureimg").css("display","block");}$("#imgblock").show();$("#mainblock").hide();}}});}else{alert("Please Enter Passcode.");}}else{alert("Please enter comments to reject the Vendor Bill.");}}</script>';
				xhtml += '<script>function modalFunc(){var Comment=$("#comments").val();if(Comment== null||Comment==""||Comment==undefined){alert("Please enter comments to reject the Vendor Bill.");}else{var data1=$("#jsondata").val();var passCode = $("#passcode").val();$("#preloader").addClass("pre-loader");if(data1 != null && data1 != "" && data1 != undefined){';
				xhtml += '$.ajax({url: "'+suiteletUrl+'",type: "POST",data:{field1:data1,recId:'+recordId+',approver:'+emailApprover+',PassCode:passCode,Comments:comments},success: function(response){$("#preloader").removeClass("pre-loader");if(response=="Incorrect Passcode"){alert("Incorrect Passcode.");}else{';
				xhtml += 'if(response == "rejected"){$("#rejectimg").css("display","block");}else if(response == "approved"){$("#approveimg").css("display","block");}else{$("#failureimg").css("display","block");	}$("#imgblock").show();$("#mainblock").hide();}}});';
				xhtml += '}else if(data1 == null || data1 == "" || data1 == undefined){$.ajax({url: "'+suiteletUrl+'",type: "POST",data:{action:"reject",recId:'+recordId+',approver:'+emailApprover+',PassCode:passCode,Comments:comments},success: function(response){$("#preloader").removeClass("pre-loader");';
				xhtml += 'if(response=="Incorrect Passcode"){alert("Incorrect Passcode.");}else{if(response=="rejected"){$("#rejectimg").css("display","block");}else{$("#failureimg").css("display","block");}$("#imgblock").show();$("#mainblock").hide();}}});}}}</script>';
				xhtml += '<script>function approved(){var id=(event.target.id).split("_")[1];$("#all_"+id).removeClass("fa fa-exclamation-triangle");$("#all_"+id).removeClass("fa fa-close");$("#all_"+id).addClass("fa fa-check");$("#all_"+id).css("color","green");';
				xhtml += 'var jsonData=$("#jsondata").val();if(jsonData!= null &&jsonData != ""){var jsonData=JSON.parse(jsonData);if(jsonData["rejected"] != null &&jsonData["rejected"] != "" && jsonData["rejected"] != undefined){';
				xhtml += 'if(jsonData["rejected"].length>0){if(jsonData["rejected"].indexOf(id)!=-1){jsonData["rejected"].splice([jsonData["rejected"].indexOf(id)],1);}if(jsonData["approved"].indexOf(id)==-1){jsonData["approved"].push(id);}}else{if(jsonData["approved"].indexOf(id)==-1){jsonData["approved"].push(id);}}}else{if(jsonData["approved"].indexOf(id)==-1){jsonData["approved"].push(id);}}}else{var jsonData={"approved":[],"rejected":[]};jsonData["approved"].push(id);}$("#jsondata").val(JSON.stringify(jsonData));}</script>';
				xhtml += '<script>function rejected(){var id=(event.target.id).split("_")[1];$("#all_"+id).removeClass("fa fa-exclamation-triangle");$("#all_"+id).removeClass("fa fa-check");$("#all_"+id).addClass("fa fa-close");$("#all_"+id).css("color","red");';
				xhtml += 'var jsonData=$("#jsondata").val();if(jsonData != null &&jsonData != ""){var jsonData=JSON.parse(jsonData);if(jsonData["approved"] != null &&jsonData["approved"] != "" && jsonData["approved"] != undefined){';
				xhtml += 'if(jsonData["approved"].length>0){if(jsonData["approved"].indexOf(id)!=-1){ jsonData["approved"].splice([jsonData["approved"].indexOf(id)],1);}if(jsonData["rejected"].indexOf(id)==-1){jsonData["rejected"].push(id);}}else{if(jsonData["rejected"].indexOf(id)==-1){jsonData["rejected"].push(id);}}}else{if(jsonData["rejected"].indexOf(id)==-1){jsonData["rejected"].push(id);}}}else{var jsonData = {"approved":[],"rejected":[]};jsonData["rejected"].push(id);}$("#jsondata").val(JSON.stringify(jsonData));}</script>';
				xhtml += '<script>function submitButton(){var passCode = $("#passcode").val();var Comment = $("#comments").val();var flag    = true;if(passCode != null && passCode != "" && passCode != undefined){var lines=$("#linetable tr").length;var data1=$("#jsondata").val();if(data1 != null && data1 != "" && data1 != undefined){';
				xhtml += 'var parsedata=JSON.parse(data1);if((lines-1) != (parsedata["approved"].length+parsedata["rejected"].length)){alert("Please Approve/Reject all the lines.");}else{if(parsedata["rejected"].length>0){if(Comment == null || Comment == "" || Comment == undefined){alert("Please enter comments to reject the Vendor Bill.");flag = false;}}';
				xhtml += 'if(flag == true){$("#preloader").addClass("pre-loader");$.ajax({url: "'+suiteletUrl+'",type: "POST",data:{field1:data1,recId:'+recordId+',approver:'+emailApprover+',PassCode:passCode,Comments:Comment},success: function(response){$("#preloader").removeClass("pre-loader");if(response=="Incorrect Passcode"){alert("Incorrect Passcode.");}else{if(response == "rejected"){$("#rejectimg").css("display","block");}else if(response=="approved"){$("#approveimg").css("display","block");}else{$("#failureimg").css("display","block");}$("#imgblock").show();$("#mainblock").hide();}}});}}}else{alert("Please Select atleast one line to Approve/Reject.");}}else{alert("Please Enter Passcode.");}}</script>';
				xhtml += '</head><body><center><div id="preloader"></div><div class="modal fade" id="myModal" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-body"><b>Rejected Comments</b><center><textarea id="commentsId" style="width: 300px;"></textarea></center>';
				xhtml += '</br><button type="button" id="add_comment" style="float:right;" class="button small" data-dismiss="modal" onclick="modalFunc()">SUBMIT</button><br/></div></div></div></div>';
				xhtml += '<div id="imgblock" class="row" style="width:400px;margin-top:15%; margin-right:0px;margin-left:0px;display:none">';
				if(approveImageUrl != '' && rejectImageUrl != '' && FailureImageUrl != ''){
					xhtml += '<p id="approveimg" style="display:none">Bill - '+documentNumber+' is Approved.<br/><img src='+ approveImageUrl + ' style= "width:200px;height:200px"></p>';
					xhtml += '<p id="rejectimg"  style="display:none">Bill - '+documentNumber+' is Rejected.<br/><img src='+ rejectImageUrl + ' style= "width:200px;height:200px"></p>';
					xhtml += '<p id="failureimg" style="display:none">Status of Bill - '+documentNumber+' is not changed. Please try again.<br/><img src='+ FailureImageUrl + ' style= "width:200px;height:200px"></p>';
				}else{
					var error = "Approve Image/Reject Image/Failure Image is null";
					log.error('Approve Image/Reject Image/Failure Image is null','Approve Image/Reject Image/Failure Image is null');
					throw error;
				}
				if(rejectedBy != null && rejectedBy != '' && rejectedBy != undefined){
					xhtml += '</div><div id="mainblock" class="row" style="width:100%;max-width:500px;margin-top:15%; margin-right:0px;margin-left:0px;">';
					xhtml += '<p id="rejectimg">Bill - '+documentNumber+' is Rejected.<br/><img src='+ rejectImageUrl + ' style= "width:200px;height:200px"></p>';
				}else if((approvedByviaNS.indexOf(emailApprover) != -1 || approvedByviaWebpage.indexOf(emailApprover) != -1) || recPasscode[emailApprover] == null || recPasscode[emailApprover] == '' || recPasscode[emailApprover] == undefined ){
					xhtml += '</div><div id="mainblock" class="row" style="width:100%;max-width:500px;margin-top:15%; margin-right:0px;margin-left:0px;">';
					xhtml += '<p id="approveimg">Bill - '+documentNumber+' is Approved.<br/><img src='+ approveImageUrl + ' style= "width:200px;height:200px"></p>';
				}else if(approvedByviaNS.indexOf(emailApprover) == -1 && approvedByviaWebpage.indexOf(emailApprover) == -1){
					xhtml += '</div><div id="mainblock" class="row" style="width:100%;max-width:500px; margin-top:3%;margin-right:0px;margin-left:0px;">';
					xhtml += '<div><div class="col-xs-12" style="background-color:white;"><h2>Vendor Bill</h2></div></br>';
					xhtml += '<div class="col-xs-12" style="background-color:white;white-space:nowrap;">Bill - '+documentNumber+' is Pending Approval.</div></br></br></br>';
					xhtml += '<div style="height:15px;"></div>';
					xhtml += '<input type="textarea" id="jsondata" style="display:none">';
					xhtml += '<div class="table-responsive"><table class="table" style="margin-left : auto; margin-right : auto;"><thead><tr><th>Fields</th><th>Values</th></tr></thead>';
					xhtml += '<tbody><tr><td>Vendor</td><td>'+vendor+'</td></tr>';
					xhtml += '<tr><td>Total Amount</td><td>'+total+'</td></tr>';
					xhtml += '<tr><td>Memo</td><td>'+memo+'</td></tr>';
					xhtml += '<tr><td>Bill Creator</td><td>'+billCreatorText+'</td></tr>';
					xhtml += '<tr><td>Last Approved By </td><td>'+approvedByText+'</td></tr>';
					xhtml += '<tr><td>Next Approver</td><td>'+nextApproverText+'</td></tr>';
					xhtml += '<tr><td>Record Link</td><td><a href= "'+billLink+'">Click here to View the Record.</a></td></tr>';
					xhtml += '</tbody></table>';

					if(itemLines > 0 || expenseLines > 0){

						if(itemLines>0){
							xhtml += '<div class="table-responsive"><h5 style="text-align: left;"><b style="padding-right:70px;"><u>Item Sublist</u></b><div style="height:15px;"></div>';
							xhtml += '<table class="table table-bordered" id="itemtable" >'; //style="border: 0px solid;"
							xhtml += '<thead><tr><th>Item</th><th>Description</th><th>Quantity</th><th>Unit Rate</th><th>Amount</th></tr></thead><tbody>';
							for(var j=0;j<itemLines;j++){
								xhtml += '<tr><td>'+billRec.getSublistText({sublistId:'item',fieldId:'item',line:j});+'</td>';
								xhtml += '<td>'+billRec.getSublistValue({sublistId:'item',fieldId:'description',line:j});+'</td>';
								xhtml += '<td>'+billRec.getSublistValue({sublistId:'item',fieldId:'quantity',line:j});+'</td>';
								xhtml += '<td>'+billRec.getSublistValue({sublistId:'item',fieldId:'rate',line:j});+'</td>';
								xhtml += '<td>'+billRec.getSublistValue({sublistId:'item',fieldId:'amount',line:j});+'</td></tr>';
							}
							xhtml += '</tbody></table>';
							xhtml += '</div>';
						}
						if(expenseLines > 0){
							xhtml += '<div class="table-responsive"><h5 style="text-align: left;"><b style="padding-right:70px;"><u>Expense Sublist</u></b><div style="height:15px;"></div>';
							xhtml += '<table class="table table-bordered" id="expensetable" >'; //style="border: 0px solid;"
							xhtml += '<thead><tr><th>Account</th><th>Amount</th></tr></thead><tbody>';
							for(var j=0;j<expenseLines;j++){
								xhtml += '<tr><td>'+billRec.getSublistText({sublistId:'expense',fieldId:'account',line:j});+'</td>';
								xhtml += '<td>'+billRec.getSublistValue({sublistId:'expense',fieldId:'amount',line:j});+'</td></tr>';
							}
							xhtml += '</tbody></table>';
							xhtml += '</div>';
						}
						// xhtml += '<br><table class="table" style="border: none !important;"><tbody><tr><td style="border: none !important;"><label for="passcode">Enter Passcode:</label></td><td><input type="text" id="passcode"></td></tr></tbody></table><br><br>';
						xhtml += '<div><table class="table" style="border: none !important;"><tbody><tr><td style="border: none !important;"><label for="comments">Enter Comments:</label></td><td style="border: none !important;"><textarea name="Comments" id="comments" style="width:70%"></textarea></td></tr>';
						xhtml += '<tr><td style="border: none !important;"><label for="passcode">Enter Passcode:</label></td><td style="border: none !important;"><input type="text" id="passcode" style="width:70%"></td></tr>';
						xhtml += '<tr><td style="border: none !important;"><button style="width:100px;height:35px;" onclick="approvePO()" >Approve</button></td>';
						xhtml += '<td style="border: none !important;"><button style="width:100px;height:35px;" onclick="rejectPO()">Reject</button></td></tr></tbody></table></div>';

						/*xhtml += '<tr><td style="border: none !important;" ></td></tr><tr><td style="border: none !important;"><label for="passcode">Enter Passcode:</label></td>';
			xhtml += '<td style="border: none !important;"><input type="text" id="passcode"></td></tr></tbody></table>';
			xhtml += '<div style="height:15px;"></div>';*/
					}
				}else{
					xhtml += '<p id="failureimg">Status of Bill - '+documentNumber+' is not changed. Please try again.<br/><img src='+ FailureImageUrl + ' style= "width:200px;height:200px"></p>';
				}
				xhtml += '</div></div> </center></body></html>';
				context.response.write(xhtml);
			}

		}catch(err){
			log.error('Error occurred in suitelet main function',err);
		}
	}

	return {
		onRequest: onRequest
	};

	function getUrl(fileName) {
		try{
			var url = '';
			var searchObject = search.create({
				type: search.Type.FOLDER,
				columns : [{name : 'url',join : 'file'}],
				filters : [{name:'name',join:'file',operator:'is',values:fileName}]
			});

			if( searchObject != null && searchObject != '' && searchObject != undefined){
				var searchResults = searchObject.run().getRange({start : 0,end : 1});
				if(searchResults.length>=1){
					url = searchResults[0].getValue({name : 'url',join : 'file'});
				}
			}
		}catch(err) {
			log.error("Error during returnClientScriptInternalId", err);
			url = '';
		}
		return url;
	}

	function approversDataInEmail(recId,editedNum,firstAppr,secondAppr,thirdAppr,fourthAppr/*,fifthAppr*/,itemLnes,expenseLnes){	
		try{	
			var userNoteAuthor  = new Array();	
			var userNoteComment = new Array();	
			var tableData       = '<table><thead><tr><td>Cost Center</td><td>Approver Name</td>';	
			var userNotesSearch = search.create({	
				type: search.Type.NOTE,	
				columns: [{name:'author'},{name:'title'},{name:'note'},{name:'internalid'},{name:'custrecord_crw_po_edited'}],	
				filters: [{name:'internalid',join:'transaction',operator:'anyof',values:recId},	
				          {name:'mainline',join:'transaction',operator:'is',values:["T"]},	
				          {name:'custrecord_crw_po_edited',operator:'greaterthanorequalto',values:editedNum}]	
			});	
			var Results = userNotesSearch.run().getRange({start:0,end:1000});	
			if(Results != null & Results != '' && Results != undefined){	
				if(Results.length>0){	
					tableData += '<td>Comments</td></tr></thead><tbody>';	
					for(var k=0;k<Results.length;k++){	
						userNoteAuthor.push(Results[k].getText({name:'author'}));	
						userNoteComment.push(Results[k].getValue({name:'note'}));	
					}	
				}	
			}else{	
				tableData += '</tr></thead><tbody>';	
			}	

			/*if(currentForm == expenseCustomForm){	
				var filter        = new Array();	
				filter.push(search.createFilter({name:'internalid',operator:'is',values:recId}));	
				filter.push(search.createFilter({name:'mainline',operator:'is',values:["F"]}));
				if(itemLnes>0){	
					filter.push(search.createFilter({name:'internalid',join:'item',operator:'noneof',values:["@NONE@"]}));	
				}else if(expenseLnes>0){	
					filter.push(search.createFilter({name:'internalid',join:'item',operator:'anyof',values:["@NONE@"]}));	
				}	
				var approverSearch = search.create({	
					type: search.Type.PURCHASE_ORDER,	
					filters: filter,	
					columns: [{name:'custcol_crw_approver',summary:'GROUP'},{name:'department',summary:'GROUP'}],	
				});	
				var apprSearchResults = approverSearch.run().getRange({start:0,end:1000});	
				if( apprSearchResults.length>0){	
					for(var z=0;z<apprSearchResults.length;z++){	
						tableData += '<tr><td>'+apprSearchResults[z].getText({name:'department',summary:'GROUP'})+'</td><td>'+apprSearchResults[z].getText({name:'custcol_crw_approver',summary:'GROUP'})+'</td>';	
						var returnData = commentsData(userNoteAuthor,apprSearchResults[z].getText({name:'custcol_crw_approver',summary:'GROUP'}),userNoteComment);	
						tableData += returnData;	
					}	
				}	
			}else{	
				tableData += '<tr><td>'+ccenter+'</td><td>'+firstAppr+'</td>';	
				var returnData = commentsData(userNoteAuthor,firstAppr,userNoteComment);	
				tableData += returnData;	
			}*/	

			//Add all other approvers and cost centers	
			if(secondAppr != null && secondAppr != '' && secondAppr != undefined){	
				tableData += '<tr><td>2nd Approver</td><td>'+secondAppr+'</td>';	
				var returnData = commentsData(userNoteAuthor,secondAppr,userNoteComment);	
				tableData += returnData;	
			}	
			if(thirdAppr != null && thirdAppr != '' && thirdAppr != undefined){	
				tableData += '<tr><td>3rd Approver</td><td>'+thirdAppr+'</td>';	
				var returnData = commentsData(userNoteAuthor,thirdAppr,userNoteComment);	
				tableData += returnData;	
			}	
			if(fourthAppr != null && fourthAppr != '' && fourthAppr != undefined){	
				tableData += '<tr><td>4th Approver</td><td>'+fourthAppr+'</td>';	
				var returnData = commentsData(userNoteAuthor,fourthAppr,userNoteComment);	
				tableData += returnData;	
			}	
			/*if(fifthAppr != null && fifthAppr != '' && fifthAppr != undefined){	
				tableData += '<tr><td>5th Approver</td><td>'+fifthAppr+'</td>';	
				var returnData = commentsData(userNoteAuthor,fifthAppr,userNoteComment);	
				tableData += returnData;	
			}	*/
			tableData += '</tbody></table>';	
		}catch(e){	
			log.error('Error Occured in ApproversDataInEmail Function',e);	
			tableData = '';	
		}	
		return tableData;	
	}	


	function sendEmail(approver,nextApprover,nextApproverText,documentNumber,recordId,status,suiteletUrl,mailPasscode,isEdited,rejComment,ApprData,tableData){
		var emailSent = false;
		try{
			var redirectUrl = suiteletUrl+'&recId='+recordId+'&approver='+nextApprover;
			log.debug('redirectUrl',redirectUrl);
			var html =  '<html>';
			log.debug('html',html);
			if((ApprData != null && ApprData != '' && ApprData != undefined) || (tableData != null && tableData != '' && tableData != undefined)){	
				html += '<head><style>table {border-collapse: collapse;border: 1px solid black;} th, td {border: 1px solid black;padding: 8px;}</style></head>';	
			}	
			html += '<body>';
			if(status == 'Approved'){
				log.debug('Approved');
				html += 'Hi '+nextApproverText+',<br/><br/>Bill - '+documentNumber+' is Approved.'
			}else if(status == 'Rejected'){
				log.debug('Rejected');
				html += 'Hi '+nextApproverText+',<br/><br/>Bill - '+documentNumber+' is Rejected.';
				if(rejComment != '' && rejComment != null && rejComment != undefined){
					html += '<br/><br/>Comments : '+rejComment+'.';
				}
			}else if(status == 'Pending Approval'){
				log.debug('Pending Approval');
				html += 'Hi '+nextApproverText+',<br/><br/>Bill - '+documentNumber+' is Pending Approval.<br/><br/>';
				if( isEdited == true){
					html += 'Vendor Bill is changed. Please review and Approve it again.<br/>';
				}
				html += '<b>Use the Passcode: </b>'+mailPasscode+'<br/>';
				html += 'Please Click <a href= "'+redirectUrl+'"> here</a> to Approve/Reject the Invoice.<br/><br/>';
				html += '<b>Note: </b> Passcode should be entered before you Submit(Approve/Reject) the form and it can be used only once.';
			}
			if(ApprData != null && ApprData != '' && ApprData != undefined){	
				html += '<br/><br/>';	
				html += ApprData;	
			}
			log.debug('ApprData',ApprData);

			if(tableData != null && tableData != '' && tableData != undefined){	
				html += '<br/><br/>';	
				html += tableData;	
			}

			html += '<br/><br/>Thanks.</body></html>';
			log.debug('html',html);

			var billRelatedFileSearch = search.create({
				type: "vendorbill",
				filters:
					[  ["type","anyof","VendBill"], 
					   "AND", 
					   ["internalid","anyof",recordId], 
					   "AND", 
					   ["mainline","is","T"]
					],
					columns:
						[
						 search.createColumn({name: "internalid", join: "file", label: "Internal ID"})
						 ]
			});
			var searchResult = billRelatedFileSearch.run().getRange({
				start: 0,
				end: 100
			});
			var billFileObjArray = new Array();
			for (var fl = 0; fl < searchResult.length; fl++) {
				var fileInternalid = searchResult[fl].getValue({
					name: 'internalid', 
					join: 'file'
				});
				log.debug('fileInternalid',fileInternalid);
				if(!isEmpty(fileInternalid)){
					billFileObjArray[fl] = file.load({
						id: fileInternalid
					});
				}
			}

			if(!isEmpty(billFileObjArray)){
				var billFile = billFileObjArray;
			}else{
				var billFile = render.transaction({entityId : Number(recordId),printMode : render.PrintMode.HTML});				
				billFile = [billFile];
			}
			if( billFile  != null && billFile != '' && billFile != undefined){
				email.send({
					author      : approver,
					recipients  : nextApprover,
					subject     : 'Bill - '+documentNumber+' is '+status+'.',
					body        : html,
					attachments : billFile
				});
				emailSent = true
			}
		}catch(ERR){
			log.error('Error occured in sendEmail function',ERR);
			emailSent = false;
		}
		log.debug('emailSent',emailSent);
		return emailSent;
	}
});


/**
 * Function checks whether a string is empty
 * 
 * @param {string} stValue - string to be evaluated
 * @return {boolean} true if string is empty
 */
function isEmpty(stValue) {
	return ((stValue === '' || stValue == null || stValue == undefined)
			|| (stValue.constructor === Array && stValue.length == 0) || (stValue.constructor === Object && (function(
					v) {
				for ( var k in v)
					return false;
				return true;
			})(stValue)));
}