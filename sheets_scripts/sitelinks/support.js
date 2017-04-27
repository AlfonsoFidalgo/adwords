function getText(url){
  var startsIn = url.search(">");
  url = url.slice(startsIn + 1, url.length);
  var endsIn = url.search("</a>");
  url = url.slice(0, endsIn);
  return url;
};

function getUrl(url){
  var startsIn = url.search("href=");
  url = url.slice(startsIn + 6, url.length);
  var endsIn = url.search(">");
  url = url.slice(0, endsIn - 14);
  url = "https://www.viatorcom.fr" + url
  return url;
};

function getElementsByClassName(element, classToFind) {
  var data = [];
  var descendants = element.getDescendants();
  descendants.push(element);
  for(i in descendants) {
    var elt = descendants[i].asElement();
    if(elt != null) {
      var classes = elt.getAttribute('class');
      if(classes != null) {
        classes = classes.getValue();
        if(classes == classToFind) data.push(elt);
        else {
          classes = classes.split(' ');
          for(j in classes) {
            if(classes[j] == classToFind) {
              data.push(elt);
              break;
            }
          }
        }
      }
    }
  }
  return data;
};

function getElementsByTagName(element, tagName) {
  var data = [];
  var descendants = element.getDescendants();
  for(i in descendants) {
    var elt = descendants[i].asElement();
    if( elt !=null && elt.getName()== tagName) data.push(elt);
  }
  return data;
};

function getElementById(element, idToFind) {
  var descendants = element.getDescendants();
  for(i in descendants) {
    var elt = descendants[i].asElement();
    if( elt !=null) {
      var id = elt.getAttribute('id');
      if( id !=null && id.getValue()== idToFind) return elt;
    }
  }
};
