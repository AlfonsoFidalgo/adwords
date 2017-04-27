var resultsSheet = SpreadsheetApp.getActive().getSheetByName("results");
var range = SpreadsheetApp.getActive().getSheetByName("test").getDataRange();
resultsSheet.clear();

function siteLinks2() {
  var texts = firstRow();
  var url = attractionUrl(range.getValues()[0][2]);

  for(var i = 1; i < range.getNumRows(); i++){
    var output = [];
    var campaigns = [];
    var ags = [];

    //takes input values
    var campaign = range.getValues()[i][0];
    var ag = range.getValues()[i][1];
    var inputUrl = range.getValues()[i][2];

    if (inputUrl == range.getValues()[i-1][2]){ //repeated url, no need to read landing page
      for(var n = 0; n < texts.length; n++){
        campaigns.push(campaign);
        ags.push(ag);
      };

      output.push(campaigns);
      output.push(ags);
      output.push(texts);
      output.push(url);
      volcado(resultsSheet, output);
    } else {
      //with inputUrl, reads the url to takes the links -> TIME CONSUMING!!
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
};


function volcado(sheet, matriz){
  var lastRow = sheet.getLastRow();
  for (var cols = 0; cols < matriz.length; cols++){
    for(var j = 0; j < matriz[cols].length; j++){
      sheet.getRange(j + 1 + lastRow, cols + 1).setValue(matriz[cols][j]);
    };
  };
};


//handles the first row of the input file
function firstRow(){
  var output = [];
  var campaigns = [];
  var ags = [];

  var firstCampaign = range.getValues()[0][0];
  var firstAdGroup = range.getValues()[0][1];
  var firstInputUrl = range.getValues()[0][2];

  var texts = attractionText(firstInputUrl);
  var url = attractionUrl(firstInputUrl);

  for(var n = 0; n < texts.length; n++){
    campaigns.push(firstCampaign);
    ags.push(firstAdGroup);
  };

  output.push(campaigns);
  output.push(ags);
  output.push(texts);
  output.push(url);

  volcado(resultsSheet, output);
  return texts;
};
