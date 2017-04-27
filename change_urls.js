/*
Created 09-Dec-2016 by AFG

creates new ETA and old ads with English taxonomy, in the specified ad groups from a Google Sheet
clears keyword level urls
pauses ETA and standard text ads with localised url
labels paused ads and new ones

Google Sheet: https://docs.google.com/spreadsheets/d/1vs8fuqGaHHetum5kmXV7RDPDP_6L4-QAwJjyMO7LfdI/edit#gid=0
Labels:
URL_English
URL_Local
*/

var id = "1vs8fuqGaHHetum5kmXV7RDPDP_6L4-QAwJjyMO7LfdI";

function main() {
  var dataRange = SpreadsheetApp.openById(id).getDataRange();
  for (var i = 0; i < dataRange.getNumRows(); i++){
    var row = dataRange.getValues()[i];
    changeUrls(row);
  };
};

function changeUrls (data){
  var campaignName = data[0];
  var agName = data[1];
  var url = data[2];
  var campaign = AdWordsApp.campaigns().withCondition("Name = '" + campaignName + "'").get().next();
  var ag = campaign.adGroups().withCondition("Name = '" + agName + "'").get().next();

  var ads = ag.ads().withCondition("Status = 'ENABLED'").get();
  while (ads.hasNext()){
    var ad = ads.next();

    if (ad.getType() == "EXPANDED_TEXT_AD") {
      var headlinePart1 = ad.getHeadlinePart1();
      var headlinePart2 = ad.getHeadlinePart2();
      var description = ad.getDescription();
      var urlPath1 = ad.getPath1();
      var urlPath2 = ad.getPath2();
      var finalUrl = url;

      ag.newAd().expandedTextAdBuilder()
      .withHeadlinePart1(headlinePart1)
      .withHeadlinePart2(headlinePart2)
      .withDescription(description)
      .withPath1(urlPath1)
      .withPath2(urlPath2)
      .withFinalUrl(finalUrl)
      .build().getResult().applyLabel("URL_English");

      ad.pause();
      ad.applyLabel("URL_Local");
    } else {
      var headline = ad.getHeadline();
      var description1 = ad.getDescription1();
      var description2 = ad.getDescription2();
      var displayUrl = ad.getDisplayUrl();
      var finalUrl = url;

      ag.newTextAdBuilder()
      .withHeadline(headline)
      .withDescription1(description1)
      .withDescription2(description2)
      .withDisplayUrl(displayUrl)
      .withFinalUrl(finalUrl)
      .build().getResult().applyLabel("URL_English");


      ad.pause();
      ad.applyLabel("URL_Local");
    }
  }
//----  We are ignoring this bit to speed the process up. Keywords will need to be synched from SEM tool
//  var kws = ag.keywords().get();
//  while (kws.hasNext()){
//    var kw = kws.next();
//    kw.urls().clearMobileFinalUrl();
//    kw.urls().clearFinalUrl();
//  }
  Logger.log(ag.getName() + " urls updated");
} 
