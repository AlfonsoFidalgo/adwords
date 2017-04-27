var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1tVWcZ6YwACn_IQYcbsMF60LERzARLnnBAsXkrmEmpZ0/edit#gid=258136828");
var sheetBR = ss.getSheetByName("raw");
var sheetDaily = ss.getSheetByName("daily");

function update() {
  //Arrastra hacia abajo para actualizar
  var lastRowNum = sheetDaily.getLastRow();//integer, row number
  //Logger.log(lastRowNum);
  var lastRow = sheetDaily.getRange(lastRowNum, 1, 1, 43); //range, ayer
  var nextRow = sheetDaily.getRange(lastRowNum + 1, 1, 1, 43); //range, hoy
  lastRow.copyTo(nextRow);
  copyValue();
};

function copyValue() {
  //Copia el dia anterior como valor
  var lastRowNum = sheetDaily.getLastRow(); //(num)
  //var lastRow = sheet.getRange(lastRowNum, 1, 1, 21); //hoy (range), porque update se ha ejecutado ya
  var yesterdayRow = sheetDaily.getRange(lastRowNum - 1, 1, 1, 38); //ayer (range)
  var yesterdayValues = yesterdayRow.getValues(); //yesterday's values. These should be pasted yesterday, after today has been populated
  yesterdayRow.copyValuesToRange(sheetDaily, 1, 38, lastRowNum - 1, lastRowNum - 1);
  report();
};


function report() {
  sheetBR.clear();
  var report = AdWordsApp.report("SELECT Date, AccountDescriptiveName, CampaignName, Device, Labels, Impressions, Clicks, Cost, Conversions, ConversionValue, AveragePosition FROM CAMPAIGN_PERFORMANCE_REPORT WHERE Impressions > 0 DURING YESTERDAY");
  var rows = report.rows();
  while (rows.hasNext()){
    var row = rows.next();
    if (row.Labels != '["DYN REMARKETING"]'){
      if(row.Device === "Mobile devices with full browsers"){
        var output = [row.Date, row.AccountDescriptiveName, row.CampaignName, "MOBILE", row.Impressions, row.Clicks, row.Cost, row.Conversions, row.ConversionValue, row.AveragePosition, row.Impressions * row.AveragePosition];
      } else {
        var label = row.Labels.replace("[","").replace("]","").replace('"',"").replace('"',"");
        var output = [row.Date, row.AccountDescriptiveName, row.CampaignName, label, row.Impressions, row.Clicks, row.Cost, row.Conversions, row.ConversionValue, row.AveragePosition, row.Impressions * row.AveragePosition];
      };
      sheetBR.appendRow(output);
    };
  };
};


function main(){
  update();
  //report();
}; 
