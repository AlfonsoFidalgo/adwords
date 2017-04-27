function main() {
  var ids = ['693-010-4845', '566-539-1010', '378-157-4700', '819-454-6904', '853-904-8575', '402-919-6740'];
  var accounts = MccApp.accounts().withIds(ids);
  accounts.executeInParallel("geoMods", "callBack");
};


function geoMods(){
  var campaigns = AdWordsApp.campaigns()
  .withCondition("Name DOES_NOT_CONTAIN_IGNORE_CASE 'GDN'")
  .withCondition("Name DOES_NOT_CONTAIN_IGNORE_CASE 'DYN'")
    .withCondition("Name DOES_NOT_CONTAIN_IGNORE_CASE 'brand'")
  .withCondition("Status = ENABLED")
  .withCondition("Conversions > 0")
  .forDateRange("LAST_14_DAYS")
  .get();

  while (campaigns.hasNext()){
    var campaign = campaigns.next();
    var stats = campaign.getStatsFor("LAST_14_DAYS");
    var locations = campaign.targeting().targetedLocations().get();
    var campaignCpl = stats.getCost() / stats.getConversions();
    //Logger.log(campaign.getName());
    //Logger.log("CPL: " + campaignCpl);

    while (locations.hasNext()){
      var location = locations.next();
      var locationStats = location.getStatsFor("LAST_14_DAYS");
      var locationConv = locationStats.getConversions();
      var locationCpl = locationStats.getCost() / locationConv;
      var locationPosition = locationStats.getAveragePosition();

      if (locationConv > 0){
        if (locationCpl / campaignCpl > 1.1){
          //Logger.log(location.getName() + " " + locationCpl + " " + campaignCpl);
          var mod = Math.max(location.getBidModifier() / 1.1, 0.5);
          //Logger.log("modifier: " + mod);
          location.setBidModifier(mod);
          //Logger.log("new modifier: " + location.getBidModifier());
        } else if (locationCpl / campaignCpl < 0.9 && locationPosition > 1.5) {
          var mod = Math.min(location.getBidModifier() * 1.1, 1.5);
          location.setBidModifier(mod);
        };
      } else {
        if (locationStats.getCost() > 20){
          var mod = Math.max(location.getBidModifier() / 1.1, 0.5);
          location.setBidModifier(mod);
        };
      };
    };
  };
};

function callBack(){
  Logger.log("Script completed");
}
