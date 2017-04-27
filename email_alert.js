var ids = ['693-010-4845']; //, '566-539-1010', '378-157-4700', '819-454-6904', '853-904-8575', '402-919-6740'];
var recipients = "afidalgo@viator.com, damadori@viator.com, cdobignies@viator.com";
function main() {
  var accounts = MccApp.accounts().withIds(ids);
  accounts.executeInParallel("alerts", "callBack");
};

function alerts(){
  var account = AdWordsApp.currentAccount();

  var campaigns = AdWordsApp.campaigns().withCondition("Name CONTAINS '(DSA)'")
  .withCondition("Clicks > 0")
  .forDateRange("LAST_7_DAYS")
  .get();

    var costYesterday = 0;
  var costLast7Days = 0;
  while (campaigns.hasNext()){
    var campaign = campaigns.next();
    var statsYesterday = campaign.getStatsFor("YESTERDAY");
    var statsLast7Days = campaign.getStatsFor("LAST_7_DAYS");

    costYesterday += statsYesterday.getCost();
    costLast7Days += statsLast7Days.getCost();
  };

  var avgCost = costLast7Days/7;

  var accountName = account.getName();
  if (costYesterday/avgCost > 1.5){
    Logger.log(accountName +" spent too much");

  } else if (costYesterday/avgCost < 0.5){
    Logger.log(accountName +" spent too little");
  } else {
    Logger.log(accountName + " looks ok");
  }
}

function callBack(results){
  Logger.log(results[0].getJson);
}




//EMAIL FUNCTIONS

function alertCostIncrease(avgCost, costYesterday){
  var percentage = (costYesterday/avgCost) * 100;
  var subject = accountName + " increased spend by " + percentage.toFixed(2) + "%";
  var body = "<p>DSA campaigns in " + accountName + " spent yesterday " + percentage.toFixed(2) + "% more than the average during last 7 days</p>";
  body += "<img src=\"https://s-media-cache-ak0.pinimg.com/originals/35/7a/af/357aaf5b5773efe7975ab7208d3c8e87.jpg\">"
  MailApp.sendEmail({
    to: recipients,
    subject: subject,
    htmlBody: body
  });
};

function alertCostDecrease(avgCost, costYesterday){
  var percentage = 100 - ((costYesterday/avgCost) * 100);
  var subject = accountName + " decreased spend by " + percentage.toFixed(2) + "%";
  var body = "<p>DSA campaigns in " + accountName + " spent yesterday " + percentage.toFixed(2) + "% less than the average during last 7 days</p>";
  body += "<img src=\"https://s-media-cache-ak0.pinimg.com/originals/35/7a/af/357aaf5b5773efe7975ab7208d3c8e87.jpg\">"
  MailApp.sendEmail({
    to: recipients,
    subject: subject,
    htmlBody: body
  });
};
