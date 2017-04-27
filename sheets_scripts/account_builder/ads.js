function getAgList(){
  var agRange = sheet.getRange(3, 4, numLocations * numTemplate,2);

  var campaign = agRange.getValues()[0][1];
  var ag = agRange.getValues()[0][0];
  var location = campaign.replace("German - ","");
  var row = [campaign, ag, location];
  SpreadsheetApp.getActive().getSheetByName("agList").appendRow(row);

  for (var i = 0; i < agRange.getNumRows(); i++){
    var nextCampaign = agRange.getValues()[i][1];
    var nextAg = agRange.getValues()[i][0];
    var nextLocation = nextCampaign.replace("German - ","");
    var nextRow = [nextCampaign, nextAg, nextLocation];

    if (nextAg != ag){
      SpreadsheetApp.getActive().getSheetByName("agList").appendRow(nextRow);
      campaign = nextCampaign;
      ag = nextAg;
      location = nextLocation;
      row = nextRow;
    };
  };
};



function build(){

  //getAgList();
  var locations = SpreadsheetApp.getActive().getSheetByName("agList");

  //iterate through locations to pick info
  for (var i = 1; i < locations.getDataRange().getNumRows() + 1; i++){
    var row = locations.getRange(i, 1, 1, 3);
    var campaign = row.getValues()[0][0];
    var ag       = row.getValues()[0][1];
    var loc      = row.getValues()[0][2];
    loc = loc.replace("German - ", "");

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

////////////////
