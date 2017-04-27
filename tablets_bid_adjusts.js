function main() {
  var ids = ['693-010-4845', '566-539-1010', '378-157-4700', '819-454-6904', '853-904-8575', '402-919-6740', '907-227-7983', '812-508-7055', '868-309-7680'];
  var accounts = MccApp.accounts().withIds(ids);
  accounts.executeInParallel("tabletAdjust", "callBack");
};


function tabletAdjust(){
  var dateRange = 'LAST_14_DAYS';
  var tabCplTarget = 1; //2 means that we allow mobile CPL to be up to twice desktop's, 1 would be same CPL...

  var campaignIterator = AdWordsApp.campaigns()
  .withCondition('Conversions > 0')
  .withCondition("Name DOES_NOT_CONTAIN 'DYN MKT'")
  //.withCondition("Name DOES_NOT_CONTAIN 'DSA'")
  .withCondition("Name DOES_NOT_CONTAIN 'RLSA'")
  .withCondition("Name DOES_NOT_CONTAIN_IGNORE_CASE 'mobile'")
  .withCondition("Name DOES_NOT_CONTAIN_IGNORE_CASE 'brand'")
  .withCondition("Name DOES_NOT_CONTAIN 'DSK'")
  .forDateRange(dateRange)
  .get();

  while (campaignIterator.hasNext()){
    var campaign = campaignIterator.next();
    var stats = campaign.getStatsFor(dateRange);

    var tablet = campaign.targeting().platforms().tablet();
    var tabStats = tablet.get().next().getStatsFor(dateRange);

    var desktop = campaign.targeting().platforms().desktop();
    var desktopStats = desktop.get().next().getStatsFor(dateRange);

    var tabletCPL = tabStats.getCost()/tabStats.getConversions();
    var desktopCPL = desktopStats.getCost()/desktopStats.getConversions();


    var currentModifier = campaign.targeting().platforms().tablet().get().next().getBidModifier();
    var tabTargetCPL = tabCplTarget * desktopCPL;

    if (tabletCPL > tabTargetCPL) {
      var newModifier = bidDown(currentModifier, desktopCPL, tabletCPL, tabTargetCPL);
      //reduce bid modifier
      //var reduction = currentModifier * 0.9;
      //var maxRed = 0.5;
      campaign.targeting().platforms().tablet().get().next().setBidModifier(newModifier);
    } else if (tabletCPL < tabTargetCPL) {
      var newModifier = bidUp(currentModifier, desktopCPL, tabletCPL, tabTargetCPL);
      //increase bid modifier
      //var increase = currentModifier * 1.1;
      //var maxInc = 1.5;
      campaign.targeting().platforms().tablet().get().next().setBidModifier(newModifier);
    };
  };
};

function bidUp(currentModifier, desktopCPL, tabletCPL, tabTargetCPL){
  var percentage = (tabletCPL - tabTargetCPL) / tabTargetCPL;
  percentage = Math.abs(percentage);
  //return currentModifier + (percentage * currentModifier);
  var maxInc = 1.7;
  return Math.min(maxInc, (currentModifier + (percentage * currentModifier)));
};

function bidDown(currentModifier, desktopCPL, tabletCPL, tabTargetCPL){
  var percentage = (tabletCPL - tabTargetCPL) / tabTargetCPL;
  percentage = Math.abs(percentage);
  //return currentModifier - (percentage * currentModifier);
  var maxRed = 0.70;
  return Math.max(maxRed, (currentModifier - (percentage * currentModifier)));
};

function callBack(){
  Logger.log("all good");
}
