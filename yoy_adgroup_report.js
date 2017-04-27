eval(DriveApp.getFileById("0ByV0tXkqPimSeGo0bklHNWFhaGM").getBlob().getDataAsString());

//moment().format("YYYYMMDD")
//yesterday => moment().subtract(1, 'days').format("YYYYMMDD")
//weekago => moment().subtract(7, 'days').format("YYYYMMDD")
//---------GLOBAL VARIABLES-------------//

var spreadSheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1Kqm12lru4WIhjQ8mQEjnzu8Pth4Wv852s-paL34YFLs/edit#gid=0");
var sheet = spreadSheet.getSheetByName("ES");

var lastSevenDaysA = moment().subtract(1, 'days').format("YYYYMMDD");
var lastSevenDaysB = moment().subtract(7, 'days').format("YYYYMMDD");

var yearAgoA = moment().subtract(1, 'years').subtract(1, 'days').format("YYYYMMDD");
var yearAgoB = moment().subtract(1, 'years').subtract(7, 'days').format("YYYYMMDD");

var campaigns = AdWordsApp.campaigns()
.withCondition("Name DOES_NOT_CONTAIN 'GDN'")
.withCondition("Name DOES_NOT_CONTAIN 'RLSA'")
.withCondition("Name DOES_NOT_CONTAIN 'DSA'")
.withCondition("Name DOES_NOT_CONTAIN 'DSK'")
.orderBy("Impressions DESC")
.forDateRange(yearAgoB, yearAgoA)
.get();

//---------FUNCTIONS-------------//

function main() {
  clearSheet(sheet);
  while(campaigns.hasNext()){
    var campaign = campaigns.next();
    var ags = campaign.adGroups()
    .orderBy("Impressions DESC")
    .forDateRange(yearAgoB, yearAgoA)
    .get();
    outputReport(campaign, ags);
  };
};

function outputReport(campaign, ags){
   while (ags.hasNext()){
     var ag = ags.next();
     var statsLast7Days = ag.getStatsFor(lastSevenDaysB, lastSevenDaysA);
     var statsYearAgo = ag.getStatsFor(yearAgoB, yearAgoA);

     var impressionsLast7Days = statsLast7Days.getImpressions();
     var impressionsYearAgo = statsYearAgo.getImpressions();
     var varImp = (((impressionsLast7Days - impressionsYearAgo)/impressionsYearAgo) * 100).toFixed(2) + "%";

     var positionLast7Days = statsLast7Days.getAveragePosition();
     var positionYearAgo = statsYearAgo.getAveragePosition();
     var varPos = (((positionLast7Days - positionYearAgo)/positionYearAgo) * 100).toFixed(2) + "%";

     var costLast7Days = statsLast7Days.getCost();
     var costYearAgo = statsYearAgo.getCost();
     var varCost = (((costLast7Days - costYearAgo)/costYearAgo) * 100).toFixed(2) + "%";

     var clicksLast7Days = statsLast7Days.getClicks();
     var clicksYearAgo = statsYearAgo.getClicks();
     var varClicks = (((clicksLast7Days - clicksYearAgo)/clicksYearAgo) * 100).toFixed(2) + "%";

     var convLast7Days = statsLast7Days.getConversions();
     var convYearAgo = statsYearAgo.getConversions();
     var varConv = (((convLast7Days - convYearAgo)/convYearAgo) * 100).toFixed(2) + "%";

     if (impressionsLast7Days !=0 && impressionsYearAgo != 0){
       var output = [campaign.getName(), ag.getName(), impressionsLast7Days, impressionsYearAgo, varImp, positionLast7Days, positionYearAgo, varPos, costLast7Days, costYearAgo, varCost, clicksLast7Days, clicksYearAgo, varClicks, convLast7Days, convYearAgo, varConv];
       sheet.appendRow(output);
     };
   };
};

function clearSheet(sheet){
  sheet.getRange("A3:Q").clear();
};
