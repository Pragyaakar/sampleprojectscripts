          /**
           *@NApiVersion 2.x
           *@NScriptType Restlet
           */
          define(['N/record', 'N/error', 'N/search'],
              function (record, error, search) {

                  // Get a standard NetSuite record
                  function _get(context) {

                      var salesorderSearchObj = search.create({
                          type: "salesorder",
                          filters: [
                              ["type", "anyof", "SalesOrd"],
                              "AND",
                              ["status", "anyof", "SalesOrd:B"],
                              "AND",
                              ["mainline", "is", "T"]
                          ],
                          columns: []
                      });
                      var searchResult = salesorderSearchObj.run().getRange({
                          start: 0,
                          end: 1000
                      });
                      log.debug('searchResultinside close ', searchResult);
                      log.debug('searchResult.length inside close ', searchResult.length);
                      var new_id = {};
                      if (searchResult.length != 0) {
                          for (var soid in searchResult) {
                              var c_id = searchResult[soid].id;
                              new_id["soid" + soid] = c_id;



                          }
                          log.debug('new_id', JSON.stringify(new_id));

                      }
                      return JSON.stringify(new_id);

                      //   return JSON.stringify(record.load({
                      //       type: context.recordtype,
                      //       id: context.id
                      //   }));
                  }
                  // Delete a standard NetSuite record
                  //   function _delete(context) {
                  //       doValidation([context.recordtype, context.id], ['recordtype', 'id'], 'DELETE');
                  //       record.delete({
                  //           type: context.recordtype,
                  //           id: context.id
                  //       });
                  //       return String(context.id);
                  //   }
                  // Create a NetSuite record from request params
                  //   function post(context) {
                  //       doValidation([context.recordtype], ['recordtype'], 'POST');
                  //       var rec = record.create({
                  //           type: context.recordtype
                  //       });
                  //       for (var fldName in context)
                  //           if (context.hasOwnProperty(fldName))
                  //               if (fldName !== 'recordtype')
                  //                   rec.setValue(fldName, context[fldName]);
                  //       var recordId = rec.save();
                  //       return String(recordId);
                  //   }
                  // Upsert a NetSuite record from request param
                  //   function put(context) {
                  //       doValidation([context.recordtype, context.id], ['recordtype', 'id'], 'PUT');
                  //       var rec = record.load({
                  //           type: context.recordtype,
                  //           id: context.id
                  //       });
                  //       for (var fldName in context)
                  //           if (context.hasOwnProperty(fldName))
                  //               if (fldName !== 'recordtype' && fldName !== 'id')
                  //                   rec.setValue(fldName, context[fldName]);
                  //       rec.save();
                  //       return JSON.stringify(rec);
                  //   }
                  return {
                      get: _get
                      // delete: _delete,
                      //post: post,
                      //put: put
                  };
              });