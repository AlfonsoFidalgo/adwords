var sheet = SpreadsheetApp.openById("12R01LmxlLo4Reup1PqjzplCSS_iU3COuAuGPFiRLqRU");
var inputRange = sheet.getRangeByName("A3:A52");
var outputRange = sheet.getRangeByName("B3:W52");
var dateRange = "LAST_14_DAYS";
var labelName = "New_Ads_11.11.16"


function main() {
  outputRange.clear();
  var results = [];
  for (var i = 0; i < inputRange.getNumRows(); i++){
    var agName = inputRange.getValues()[i][0];
    var adGroup = AdWordsApp.adGroups().withCondition("Name = '" + agName + "'").get().next();
    var cost = getAgCost(adGroup);
    var output = getAdsData(adGroup, cost);
    results.push(output);
  };
  outputRange.setValues(results);
};

function getAgCost(ag) {
  var stats = ag.getStatsFor(dateRange);
  var cost = stats.getCost();
  return cost;
};



function getAdsData(ag, cost){
  var output = [];
  var statsOldAds = [0, 0, 0, 0]; // imp, clicks, cost, conversions
  var statsOldEtas = [0, 0, 0, 0]; // imp, clicks, cost, conversions
  var statsNewEtas = [0, 0, 0, 0]; // imp, clicks, cost, conversions

  var ads = ag.ads().withCondition("Impressions > 0").forDateRange(dateRange).get();
  while (ads.hasNext()){
    var ad = ads.next();
    if (ad.getType() === "TEXT_AD") {

      var statsOldAd = ad.getStatsFor(dateRange);
      var impOldAd = statsOldAd.getImpressions();
      var clicksOldAd = statsOldAd.getClicks();
      var costOldAd = statsOldAd.getCost();
      var convOldAd = statsOldAd.getConversions();

      statsOldAds[0] += impOldAd;
      statsOldAds[1] += clicksOldAd;
      statsOldAds[2] += costOldAd;
      statsOldAds[3] += convOldAd;

    } else if (ad.getType() === "EXPANDED_TEXT_AD"){
      var labels = ad.labels().get();
      var newEta = false;
      while (labels.hasNext()){
        var label = labels.next();
        if (label.getName() === labelName) {
          newEta = true;
        }
      }
      if (newEta){
        var statsOldEta = ad.getStatsFor(dateRange);
        var impOldEta = statsOldEta.getImpressions();
        var clicksOldEta = statsOldEta.getClicks();
        var costOldEta = statsOldEta.getCost();
        var convOldEta = statsOldEta.getConversions();

        statsOldEtas[0] += impOldEta;
        statsOldEtas[1] += clicksOldEta;
        statsOldEtas[2] += costOldEta;
        statsOldEtas[3] += convOldEta;
      } else {
        var statsNewEta = ad.getStatsFor(dateRange);
        var impNewEta = statsNewEta.getImpressions();
        var clicksNewEta = statsNewEta.getClicks();
        var costNewEta = statsNewEta.getCost();
        var convNewEta = statsNewEta.getConversions();

        statsNewEtas[0] += impNewEta;
        statsNewEtas[1] += clicksNewEta;
        statsNewEtas[2] += costNewEta;
        statsNewEtas[3] += convNewEta;
      };
    };
  };
  var line = [
                cost,
                statsOldAds[0], //Impressions
                statsOldEtas[0],
                statsNewEtas[0],
                statsOldAds[1], //Clicks
                statsOldEtas[1],
                statsNewEtas[1],
                statsOldAds[2], //Cost
                statsOldEtas[2],
                statsNewEtas[2],
                statsOldAds[3], //Conversions
                statsOldEtas[3],
                statsNewEtas[3],
                statsOldAds[1] / statsOldAds[0], //CTR
                statsOldEtas[1] / statsOldEtas[0],
                statsNewEtas[1] / statsNewEtas[0],
                statsOldAds[2] / statsOldAds[1],//CPC
                statsOldEtas[2] / statsOldEtas[1],
                statsNewEtas[2] / statsNewEtas[1],
                statsOldAds[3] / statsOldAds[1],//CVR
                statsOldEtas[3] / statsOldEtas[1],
                statsNewEtas[3] / statsNewEtas[1]
               ];
  return line;
};
