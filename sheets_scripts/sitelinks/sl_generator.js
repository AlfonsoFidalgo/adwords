function siteLinks (){
  var resultsSheet = SpreadsheetApp.getActive().getSheetByName("results");
  var range = SpreadsheetApp.getActive().getSheetByName("test").getDataRange();
  resultsSheet.clear();
  for(var i = 0; i < range.getNumRows(); i++){
    //inicializa arrays
    var output = [];
    var campaigns = [];
    var ags = [];

    //pilla la info
    var inputUrl = range.getValues()[i][2];
    var campaign = range.getValues()[i][0];
    var ag = range.getValues()[i][1];

    //pilla los links
    var texts = attractionText(inputUrl);
    var url = attractionUrl(inputUrl);

    //rellena de ags y campañas hasta igualar arrays
    for(var n = 0; n < texts.length; n++){
      campaigns.push(campaign);
      ags.push(ag);
    };

    //genera array bidimensional output
    output.push(campaigns);
    output.push(ags);
    output.push(texts);
    output.push(url);

    //volcado en sheet
    volcado(resultsSheet, output);
  };
};





function volcado(sheet, matriz){
  var lastRow = sheet.getLastRow();
  for (var cols = 0; cols < matriz.length; cols++){
    for(var j = 0; j < matriz[cols].length; j++){
      sheet.getRange(j + 1 + lastRow, cols + 1).setValue(matriz[cols][j]);
    };
  };
};
