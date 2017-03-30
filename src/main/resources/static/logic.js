var url = "search?latitude=38.431506999999996&longitude=-78.86769&term=food&radius=3218";
var allBusinesses;
var spinnerBusinesses;
var displayNames;
var rotation = 0;
var angularVelocity;
var angularAcceleration;
var canvas;
var context;
var colors = ["#0080ff", "#00ff00", "#00ffff", "#ff0000", "#ff00ff"]

function reset() {
  rotation = 0;
  context.resetTransform();
  context.clearRect(0, 0, 500, 500);
}

function init() {
  canvas = document.getElementById("cvs");
  context = canvas.getContext("2d");
  context.font = "24px sans-serif";
  reset();
  context.fillText("Nothing to display", 250, 250);
}

function search() {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if(xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      processResults(xmlHttp.responseText);
    }
  };
  xmlHttp.open("GET", url, true);
  xmlHttp.send(null);
  reset();
  context.fillText("Loading...", 250, 250);
}

function getSelectedBusiness() {
  return spinnerBusinesses[(spinnerBusinesses.length - Math.round(spinnerBusinesses.length*(rotation % (2*Math.PI))/(2*Math.PI))) % spinnerBusinesses.length];
}

function spin() {
  angularVelocity = 10 + Math.random() * 25;
  angularAcceleration = -1;
  window.requestAnimationFrame(drawSpinner);
}

function drawSpinner(timestamp) {
  context.clearRect(0, 0, 500, 500);
  context.rotate(angularVelocity/60);
  rotation += angularVelocity/60;
  for(var i = 0; i < displayNames.length; i++) {
    context.fillStyle = colors[i % colors.length];
    context.beginPath();
    context.moveTo(0, 0);
    context.arc(0, 0, 240, -Math.PI/displayNames.length, Math.PI/displayNames.length);
    context.lineTo(0, 0);
    context.fill();
    context.stroke();
    
    context.fillStyle = "#000000";
    var name = displayNames[i];
    var width = context.measureText(name).width;
    context.fillText(name, 237 - width, 10);
    angularVelocity = Math.max(0, angularVelocity + angularAcceleration/60);
    context.rotate(2*Math.PI/displayNames.length);
  }
  var nextFrame = window.requestAnimationFrame(drawSpinner);
  if(angularVelocity <= 0) {
    window.cancelAnimationFrame(nextFrame);
    //console.log(spinnerBusinesses[(spinnerBusinesses.length - Math.round(spinnerBusinesses.length*(rotation % (2*Math.PI))/(2*Math.PI))) % spinnerBusinesses.length].name);
    console.log(getSelectedBusiness());
  }
}

function initSpinner() {
  reset();
  context.translate(250, 250);
  
  if(spinnerBusinesses.length > 0) {
    displayNames = [];
    for(var i = 0; i < spinnerBusinesses.length; i++) {
      var name = spinnerBusinesses[i].name;
      var width = context.measureText(name).width;
      while(width > 202) {
        name = name.substring(0, name.length - 4) + "...";
        width = context.measureText(name).width;
      }
      displayNames[i] = name;
    }
    
    spin();
  } else {
    var errorText = "No matches found";
    var width = context.measureText(errorText).width;
    context.fillText(errorText, -width/2, 10);
  }
}

function processResults(results) {
  // Parse the JSON response
  allBusinesses = JSON.parse(results).businesses;
  
  // Copy contents of allBusinesses to spinnerBusinesses
  spinnerBusinesses = allBusinesses.slice();
  
  // Remove random businesses until spinnerBusinesses has 10 or fewer elements
  while(spinnerBusinesses.length > 10) {
    spinnerBusinesses.splice(Math.floor(Math.random() * spinnerBusinesses.length), 1);
  }
  
  initSpinner();
}