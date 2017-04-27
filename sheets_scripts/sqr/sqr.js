function myFunction() {
  var inputSheet = SpreadsheetApp.getActive().getSheetByName("input");
  var inputDataRange = inputSheet.getDataRange();

  var outputSheet = SpreadsheetApp.getActive().getSheetByName("results");


  var allTokens = {};

  for (var i = 1; i < 3; i++){
    var row = inputDataRange.getValues()[i];

    var term = row[0];
    var tokens = term.split(" ");

    var impressions = row[1];
    var clicks = row[2];
    var cost = row[3];
    var conversions = row[4];


    for (var j = 0; j < tokens.length; j++){
      var token = tokens[j];
      if (allTokens[token]){
      //already exists
        allTokens[token].impressions += impressions;
        allTokens[token].clicks += clicks;
        allTokens[token].cost += cost;
        allTokens[token].conversions += conversions;
      } else {
      //new token
        allTokens[token] = {
          impressions: impressions,
          clicks: clicks,
          cost: cost,
          conversions: conversions
        };
      };
    };
  };

  Logger.log(allTokens);

}
