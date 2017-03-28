var url = "search?location=glen allen, va&radius=20";

function search() {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if(xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      var businesses = JSON.parse(xmlHttp.responseText);
      processResults(businesses);
    }
  };
  xmlHttp.open("GET", url, true);
  xmlHttp.send(null);
}

function processResults(results) {
  console.log(results);
}