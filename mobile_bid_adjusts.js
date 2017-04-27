var dateRange = 'LAST_7_DAYS';
var MobCplTarget = 0.90; //2 means that we allow mobile CPL to be up to twice desktop's, 1 would be same CPL...

var campaignIterator = AdWordsApp.campaigns()
.withCondition('ConvertedClicks > 0')
.withCondition("Name DOES_NOT_CONTAIN 'DYN MKT'")
//.withCondition("Name DOES_NOT_CONTAIN 'DSA'")
.withCondition("Name DOES_NOT_CONTAIN 'RLSA'")
.withCondition("Name DOES_NOT_CONTAIN_IGNORE_CASE 'brand'")
.withCondition("Name DOES_NOT_CONTAIN 'DSK'")
.forDateRange(dateRange)
.get();

function bidUp(currentModifier, desktopCPL, mobileCPL, mobTargetCPL){
  var percentage = (mobileCPL - mobTargetCPL) / mobTargetCPL;
  percentage = Math.abs(percentage);
  //return currentModifier + (percentage * currentModifier);
  var maxInc = 1.7;
  return Math.min(maxInc, (currentModifier + (percentage * currentModifier)));
};

function bidDown(currentModifier, desktopCPL, mobileCPL, mobTargetCPL){
  var percentage = (mobileCPL - mobTargetCPL) / mobTargetCPL;
  percentage = Math.abs(percentage);
  //return currentModifier - (percentage * currentModifier);
  var maxRed = 0.05;
  return Math.max(maxRed, (currentModifier - (percentage * currentModifier)));
};


function main() {
  while (campaignIterator.hasNext()){
    var campaign = campaignIterator.next();
    var stats = campaign.getStatsFor(dateRange);

    var mobile = campaign.targeting().platforms().mobile();
    var mobStats = mobile.get().next().getStatsFor(dateRange);

    var desktop = campaign.targeting().platforms().desktop();
    var desktopStats = desktop.get().next().getStatsFor(dateRange);

    var mobileCPL = mobStats.getCost()/mobStats.getConvertedClicks();
    var desktopCPL = desktopStats.getCost()/desktopStats.getConvertedClicks();


    var currentModifier = campaign.targeting().platforms().mobile().get().next().getBidModifier();
    var mobTargetCPL = MobCplTarget * desktopCPL;

    if (mobileCPL > mobTargetCPL) {
      var newModifier = bidDown(currentModifier, desktopCPL, mobileCPL, mobTargetCPL);
      //reduce bid modifier
      //var reduction = currentModifier * 0.9;
      //var maxRed = 0.5;
      campaign.targeting().platforms().mobile().get().next().setBidModifier(newModifier);
    } else if (mobileCPL < mobTargetCPL) {
      var newModifier = bidUp(currentModifier, desktopCPL, mobileCPL, mobTargetCPL);
      //increase bid modifier
      //var increase = currentModifier * 1.1;
      //var maxInc = 1.5;
      campaign.targeting().platforms().mobile().get().next().setBidModifier(newModifier);
    };
  };
}
