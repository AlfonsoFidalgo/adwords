function attractionText(input){

  var html = UrlFetchApp.fetch(input).getContentText();
  var doc = Xml.parse(html, true);
  var bodyHtml = doc.html.body.toXmlString();
  doc = XmlService.parse(bodyHtml);
  var root = doc.getRootElement();

  var listCategories = getElementsByClassName(root, "list-bordered smaller mtn")[1];
  var list = getElementsByTagName(listCategories, "li");
  var output = [];

  for (var i = 1; i < list.length - 1; i++){
    var element = list[i];
    var link = getElementsByTagName(element, "a")[0];
    var url = XmlService.getRawFormat().format(link);
    var text = getText(url);
    output.push(text);
  };
  return output;
};


function attractionUrl(input){

  var html = UrlFetchApp.fetch(input).getContentText();
  var doc = Xml.parse(html, true);
  var bodyHtml = doc.html.body.toXmlString();
  doc = XmlService.parse(bodyHtml);
  var root = doc.getRootElement();

  var listCategories = getElementsByClassName(root, "list-bordered smaller mtn")[1];
  var list = getElementsByTagName(listCategories, "li");
  var output = [];

  for (var i = 1; i < list.length - 1; i++){
    var element = list[i];
    var link = getElementsByTagName(element, "a")[0];
    var url = XmlService.getRawFormat().format(link);
    var finalUrl = getUrl(url);
    output.push(finalUrl);
  };
  return output;
};


function getText(url){
  var startsIn = url.search(">");
  url = url.slice(startsIn + 1, url.length);
  var endsIn = url.search("</a>");
  url = url.slice(0, endsIn);
  return url;
};

function getUrl(url){
  var domain = SpreadsheetApp.getActive().getSheetByName("test").getRange(3, 5).getValue();
  var startsIn = url.search("href=");
  url = url.slice(startsIn + 6, url.length);
  var endsIn = url.search(">");
  url = url.slice(0, endsIn - 14);
  url = domain + url
  return url;
};
