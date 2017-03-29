var url = "search?latitude=38.431506999999996&longitude=-78.86769&term=food&radius=3218";
var allBusinesses;
var spinnerBusinesses;
var canvas;
var context;
var colors = ["#0080ff", "#00ff00", "#00ffff", "#ff0000", "#ff00ff"]

function search() {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if(xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      processResults(xmlHttp.responseText);
    }
  };
  xmlHttp.open("GET", url, true);
  xmlHttp.send(null);
}

function initSpinner() {
  canvas = document.getElementById("cvs");
  context = canvas.getContext("2d");
  context.translate(250, 250);
  context.font = "24px sans-serif";
  
  for(var i = 0; i < spinnerBusinesses.length; i++) {
    context.fillStyle = colors[i % colors.length];
    context.beginPath();
    context.moveTo(0, 0);
    context.arc(0, 0, 240, -Math.PI/spinnerBusinesses.length, Math.PI/spinnerBusinesses.length);
    context.lineTo(0, 0);
    context.fill();
    context.stroke();
    
    context.fillStyle = "#000000";
    var name = spinnerBusinesses[i].name;
    var width = context.measureText(name).width;
    while(width > 202) {
      name = name.substring(0, name.length - 4) + "...";
      width = context.measureText(name).width;
    }
    context.fillText(name, 237 - width, 10);
    context.rotate(2*Math.PI/spinnerBusinesses.length);
  }
}

function processResults(results) {
  // Parse the JSON response
  allBusinesses = JSON.parse(results).businesses;
  console.log(allBusinesses);
  
  // Copy contents of allBusinesses to spinnerBusinesses
  spinnerBusinesses = allBusinesses.slice();
  
  // Remove random businesses until spinnerBusinesses has 10 or fewer elements
  while(spinnerBusinesses.length > 10) {
    spinnerBusinesses.splice(Math.floor(Math.random() * spinnerBusinesses.length), 1);
  }
  console.log(spinnerBusinesses);
  
  initSpinner();
}