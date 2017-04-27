/*
function proper(word){
  var firstChar = word.charAt(0);
  var rest = word.slice(1, word.length);
  firstChar = firstChar.toUpperCase();
  return (firstChar + rest);
};
*/

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
  location = capitalizeEachWord(location);
  while (location.search(" ") != -1){
    location = location.replace(" ", "-");
  };

  var codeArr = ag.split("_");
  var code = codeArr[0];
  var url = "https://www.viatorcom.de/de/7132/";
  return url + location + "/" + code + "-ttd";
};
