function sqr() {
  var inputSheet = SpreadsheetApp.getActive().getSheetByName("input");
  var inputDataRange = inputSheet.getDataRange();

  var outputSheet = SpreadsheetApp.getActive().getSheetByName("results");


  var allTokens = [];

  for (var i = 1; i < inputDataRange.getNumRows(); i++){
    var row = inputDataRange.getValues()[i];
    Logger.log(row);
    var term = row[0];
    var tokens = term.split(" ");

    var impressions = row[1];
    var clicks = row[2];
    var cost = row[3];
    var conversions = row[4];


    for (var j = 0; j < tokens.length; j++){
      var token = tokens[j];
      var exists = false;

      //we check if the term already exists
      for (var k = 0; k < allTokens.length; k++){
        var tokenInAll = allTokens[k][0];
        if (token == tokenInAll){
          exists = true;
        };
      };


      if (!exists){
        var outputRow = [token, impressions, clicks, cost, conversions];
        allTokens.push(outputRow);
      } else {
        var index = 0;
        var found = false;
        while (!found){
          if (allTokens[index][0] == token){
            found = true;
          } else {
            index++;
          };
        };

        allTokens[index][1] += impressions;
        allTokens[index][2] += clicks;
        allTokens[index][3] += cost;
        allTokens[index][4] += conversions;
      };
    };
  };

  //Logger.log(allTokens);
  for (var l = 0; l < allTokens.length; l++){
    outputSheet.appendRow(allTokens[l]);
  };
}
