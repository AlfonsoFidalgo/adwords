//select sheet
var sheet = SpreadsheetApp.getActive().getSheetByName("start");
var kwTemplate = SpreadsheetApp.getActive().getSheetByName("kwTemplate");
var agSheet = SpreadsheetApp.getActive().getSheetByName("AgList");

//number of locations and templates
var numLocations = sheet.getRange(2, 6).getValues()[0];
var numTemplate = sheet.getRange(2,7).getValues()[0];


//select ranges
var columnLocations = sheet.getRange(3, 1, numLocations);
var columnCodes = sheet.getRange(3, 2, numLocations);

var columnTemplate = kwTemplate.getRange(2, 1, numTemplate);
var columnAdGroup = kwTemplate.getRange(2, 2, numTemplate);
var columnOutput = sheet.getRange(3, 3, numLocations * numTemplate, 3); //row, col, num rows, num cols


//functions
function builder() {
  SpreadsheetApp.getActive().getSheetByName("agList").clear();
  var account = sheet.getRange(1, 7).getValues()[0];
  var values = [];

  for (var i = 1; i <= numLocations; i++){
    //var location = columnLocations.getCell(i, 1).getValue();
    var location = sheet.getRange(i+2, 1).getValues()[0][0];

    for (var j = 1; j <= numTemplate; j++){
      //var template = columnTemplate.getCell(j, 1).getValue();
      var template = kwTemplate.getRange(j+1, 1).getValues()[0][0];

      if ((template.search("\\+") != -1) && (location.search(" ") != -1)){
        var kwLocation = location.replace(" ", " +");
        template = template.replace("LOCATION", kwLocation);
      } else {
        template = template.replace("LOCATION", location);
      };

      //var adgroup = columnAdGroup.getCell(j, 1).getValue();
      var adgroup = kwTemplate.getRange(j+1, 2).getValues()[0][0];

      adgroup = adgroup.replace("LOCATION", capitalizeEachWord(location));

      //var code = columnCodes.getCell(i, 1).getValue();
      var code = sheet.getRange(i+2, 2).getValues()[0][0];

      adgroup = adgroup.replace("CODE", code);

      var keyword = new Array(template, adgroup, account + " - " + capitalizeEachWord(location));
      values.push(keyword);
    };
  };
  columnOutput.setValues(values);
  build();
};



function clearOutput(){
  columnOutput.clear();
  SpreadsheetApp.getActive().getSheetByName("ads").getRange("A2:H").clear();
};
