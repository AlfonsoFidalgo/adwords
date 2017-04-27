function main() {
  var ids = ['693-010-4845', '566-539-1010', '378-157-4700', '819-454-6904', '853-904-8575', '402-919-6740', '907-227-7983', '812-508-7055', '868-309-7680'];
  var accounts = MccApp.accounts().withIds(ids);
  accounts.executeInParallel("audiences", "callBack");
};

function audiences(){
  var campaigns = AdWordsApp.campaigns()
  .withCondition("Name DOES_NOT_CONTAIN_IGNORE_CASE 'DYN'")
  .withCondition("Name DOES_NOT_CONTAIN_IGNORE_CASE 'DSK'")
  .withCondition("Cost > 30")
  .forDateRange("LAST_14_DAYS")
  .orderBy("Cost DESC")
  .get();

  while (campaigns.hasNext()){
    var campaign = campaigns.next();
    adjustAudiences(campaign);
  };
};


function adjustAudiences(campaign){
  var ags = campaign.adGroups().withCondition("Cost > 20").forDateRange("LAST_14_DAYS").get();

  while (ags.hasNext()){
    var ag = ags.next();
    var agStats = ag.getStatsFor("LAST_14_DAYS");
    var agCost = agStats.getCost();
    var agConv = agStats.getConversions();
    var agCPL = agCost/agConv;
    var agPosition = agStats.getAveragePosition();


    var audiences = ag.targeting().audiences().get();
    while (audiences.hasNext()){
      var audience = audiences.next();
      var audienceStats = audience.getStatsFor("LAST_14_DAYS");
      var audienceCost = audienceStats.getCost();
      var audienceConv = audienceStats.getConversions();
      var audiencePosition = audienceStats.getAveragePosition();

      if (audienceConv > 0){
      //audience converted, evaluate CPL
        optimiseConvertingAudience(agCPL, audience, audienceConv, audienceCost, audiencePosition);
      } else if (audienceCost > 20){
      //audience hasn't converted, evaluate cost
        var bidAdjust = Math.max(audience.bidding().getBidModifier() / 1.1, 0.10);
        audience.bidding().setBidModifier(bidAdjust);
      };
    };
  };
};


function optimiseConvertingAudience(agCPL, audience, audienceConv, audienceCost, audiencePosition) {
  var audienceCPL = audienceCost/audienceConv;
  if (audienceCPL / agCPL > 1.1){
  //audience 10% more expensive than the average ad group
    var bidAdjust = Math.max(audience.bidding().getBidModifier() / 1.1, 0.10);
    audience.bidding().setBidModifier(bidAdjust);
  } else if (audienceCPL / agCPL < 0.9 && audiencePosition > 1.5){
  //profitable audience in bad position
    var bidAdjust = Math.min(audience.bidding().getBidModifier() * 1.1, 1.5);
    audience.bidding().setBidModifier(bidAdjust);
  };
};

function callBack(){
  Logger.log("all ok");
};
