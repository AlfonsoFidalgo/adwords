/// MAIN ///

function build(){
  var locations = SpreadsheetApp.getActive().getSheetByName("Builder");

  //iterate through locations to pick info
  for (var i = 2; i < locations.getDataRange().getNumRows() + 1; i++){
    var row = locations.getRange(i, 1, 1, 3);
    var campaign = row.getValues()[0][0];
    var ag       = row.getValues()[0][1];
    var loc      = row.getValues()[0][2];

    var adCopy = goToTemplate(campaign, ag, loc);
    putInSheet(adCopy);
  };
};


////////////////////////////////////////////////////////////////////////////////


function goToTemplate(campaign, group, location){
  var headlines2 = getLines2();

  var templates = SpreadsheetApp.getActive().getSheetByName("Template");


  for (var i = 1; i < templates.getDataRange().getNumRows() + 1; i++){
    var row = templates.getRange(i, 1, 1, 3);

    //We get the headline and description lines 1
    var headline1 = row.getValues()[0][0].replace("Location", location);
    headline1 = capitalizeEachWord(headline1);

    var description = row.getValues()[0][1].replace("Location", location);
    description = capitalizeEachWord(description);


    //if lengths are ok, then build the ad
    if ((headline1.length < 31) && (description.length < 81)){

      //create display url with location and category
      //var displayUrl = createDisplayUrl(location, row.getValues()[0][3]);
      var url = buildUrl(location, group);
      var path1 = createPath1(location);
      var adsOutput = [];
      for (var j = 0; j < headlines2.length; j++){
        var headline2 = headlines2[j];
        var output = [campaign, group, headline1, headline2, description, path1, "Tours", url];
        adsOutput.push(output);
      };
      return adsOutput;
    };

  };
};


/// HELPER FUNCTIONS ///

function capitalizeEachWord(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

////////////////////////////////////////////////////////////////////////////////

function putInSheet(arr){
  var ss = SpreadsheetApp.getActive().getSheetByName("ads");
  for (var i = 0; i < arr.length; i++){
    ss.appendRow(arr[i]);
  };
};

////////////////////////////////////////////////////////////////////////////////

function createDisplayUrl(location, category){
  var displayUrl = "es.viator.com/";
  var locationUrl = capitalizeEachWord(location);
  Logger.log(locationUrl);


  while (locationUrl.search(" ") != -1){
    locationUrl = locationUrl.replace(" ", "");
  };


  if ((displayUrl + locationUrl).length < 36){
    if ((displayUrl + locationUrl + "-" + category).length < 36){
      displayUrl += locationUrl + "-" + category;
    } else {
      displayUrl += locationUrl;
    };
  } else {
    displayUrl += category;
  };
  return displayUrl;
};
////////////////////////////////////////////////////////////////////////////////

function createPath1(destination){
  destination = capitalizeEachWord(destination);

  while (destination.search(" ") != -1){
    destination = destination.replace(" ","");
  };

  if (destination.length < 16){
    return destination;
  } else {
    return "DESTINATION TOO LONG FOR PATH";
  };

};

////////////////////////////////////////////////////////////////////////////////

function getLines2(){
  var output = [];
  var lines2 = SpreadsheetApp.getActive().getSheetByName("Headline 2").getDataRange().getValues();

  for (var i = 0; i < lines2.length; i++){
    output.push(lines2[i][0]);
  };

  return output;
};

////////////////////////////////////////////////////////////////////////////////

function buildUrl (location, ag){
  while (location.search(" ") != -1){
    location = location.replace(" ", "-");
  };

  var codeArr = ag.split("_");
  var code = codeArr[0];
  var url = "https://www.viatorcom.de/de/7132/";
  return url + location + "/" + code + "-ttd";
}
