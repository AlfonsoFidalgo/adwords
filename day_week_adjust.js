
function main() {
  var campaigns = AdWordsApp.campaigns().withCondition("Name DOES_NOT_CONTAIN_IGNORE_CASE 'DYN'").withCondition("Name CONTAINS 'DSA'").withCondition("ConvertedClicks > 0").forDateRange("LAST_7_DAYS").get();
  Logger.log(campaigns.totalNumEntities() + " campaigns to be looked into");

  while (campaigns.hasNext()){
    var campaign = campaigns.next();
    optimise(campaign);
  };
};

function optimise(campaign){
  var campStats = campaign.getStatsFor("LAST_7_DAYS");
  var CPA = campStats.getCost() / campStats.getConvertedClicks();

  var schedules = campaign.targeting().adSchedules().get();
  while (schedules.hasNext()){
    var schedule = schedules.next();

    var schStats = schedule.getStatsFor("LAST_7_DAYS");
    if (schStats.getConvertedClicks() == 0){
      //day with 0 conversions, bid down
      schedule.setBidModifier(Math.max((schedule.getBidModifier() / 1.1),0.5));
    } else {
      var schCPA = schStats.getCost() / schStats.getConvertedClicks();
      if (schCPA / CPA > 1.1){
        //need to bid down
        schedule.setBidModifier(Math.max((schedule.getBidModifier() / 1.1),0.5));
      } else if (schCPA / CPA < 0.9) {
        //bid up
        schedule.setBidModifier(Math.min((schedule.getBidModifier() * 1.1),1.5));
      };
    };
  };
};


/*


//funtion I used to copy schedules accross all campaigns

function main(){
  var campaign = AdWordsApp.campaigns().withCondition("Name = 'Spanish - Alaska'").get().next();
  var scheduleModel = campaign.targeting().adSchedules().get();

  while (scheduleModel.hasNext()){
    var sch = scheduleModel.next();
    var otherCampaigns = AdWordsApp.campaigns().withCondition("Name != 'Spanish - Alaska'").withCondition("Name DOES_NOT_CONTAIN 'DYN'").withCondition("Name DOES_NOT_CONTAIN 'GDN'").get();
    while (otherCampaigns.hasNext()){
      var otherCamp = otherCampaigns.next();
      otherCamp.addAdSchedule(sch);
    };
  };
};

*/
