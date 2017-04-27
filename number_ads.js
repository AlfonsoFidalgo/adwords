var ids = ['693-010-4845', '566-539-1010', '378-157-4700', '819-454-6904', '853-904-8575', '402-919-6740', '907-227-7983', '812-508-7055', '868-309-7680'];
var spreadSheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1LhIZtLfcjj2t0T50cmRL1vc8wP71-IwUm8wYl3y-S20/edit#gid=0");
var sheetName = AdWordsApp.currentAccount().getName();

function main() {
  var accounts = MccApp.accounts().withIds(ids);
  accounts.executeInParallel("countAds", "callBack");
};


function countAds(){
  var sheet = putHeadings();
  var campaigns = AdWordsApp.campaigns()
  .withCondition("Status = ENABLED")
  .withCondition("Name DOES_NOT_CONTAIN_IGNORE_CASE 'dsa)'")
  .withCondition("Name DOES_NOT_CONTAIN_IGNORE_CASE 'DYN'")
  .orderBy('Impressions DESC')
  .forDateRange("LAST_7_DAYS")
  .get();
  while (campaigns.hasNext()){
    var campaign = campaigns.next();
    var adGroups = campaign.adGroups()
    .withCondition("Status = ENABLED")
    .orderBy('Impressions DESC')
    .forDateRange("LAST_7_DAYS")
    .get();
    while (adGroups.hasNext()){
      var adGroup = adGroups.next();
      var ads = adGroup.ads().withCondition("Status = ENABLED").get();
      var numNormalAds = 0;
      var numExtendedAds = 0;
      while(ads.hasNext()){
        var ad = ads.next();
        if (ad.isType().expandedTextAd()){
          numExtendedAds++;
        } else {
          numNormalAds++;
        };
      }


      var output = [campaign.getName(), adGroup.getName(), numNormalAds, numExtendedAds];
      sheet.appendRow(output);
    };

  };
};


function putHeadings(){
  if (!spreadSheet.getSheetByName(sheetName)){ //exists?
    spreadSheet.insertSheet(sheetName);
    var sheet = spreadSheet.getSheetByName(sheetName);
    sheet.clear();
    sheet.appendRow(["Campaign", "Ad Group", "Num normal Ads","Num expanded Ads" ]);
  } else {
    var sheet = spreadSheet.getSheetByName(sheetName);
    sheet.clear();
    sheet.clearContents();
    sheet.appendRow(["Campaign", "Ad Group", "Num normal Ads","Num expanded Ads"]);
  };
  return sheet;
}

function callBack(){
  Logger.log("done");
}
