var allBusinesses;
var spinnerBusinesses;
var displayNames;
var rotation = 0;
var angularVelocity;
var angularAcceleration;
var canvas;
var context;
var loc;
var nextFrame;
var colors = ["#0080ff", "#00ff00", "#00ffff", "#ff0000", "#ff00ff"];

function stopSpin() {
  window.cancelAnimationFrame(nextFrame);
  document.getElementById("spinButton").removeAttribute("disabled");
  document.getElementById("searchButton").removeAttribute("disabled");
  document.getElementById("stopSpinButton").disabled = "true";
}

function useCurrentLocationChanged() {
  if(document.getElementById("useCurrentLocation").checked) {
    document.getElementById("location").value = "";
  }
}

function locationChanged() {
  if(document.getElementById("location").value !== "") {
    document.getElementById("useCurrentLocation").checked = false;
  }
}

function showDetails(business) {
  var detailsPane = document.getElementById("detailsPane");
  detailsPane.innerHTML = "<a href=\"" + business.url + "\" class=\"name\">" + business.name + "</a>";
  if(business.price !== null) {
    document.getElementsByClassName("name")[0].innerHTML += " - (" + business.price + ")";
  }
  for(var i = 0; i < business.location.display_address.length; i++) {
    detailsPane.innerHTML += "<p class=\"address\">" + business.location.display_address[i] + "</p>";
  }
  detailsPane.innerHTML += "<p class=\"phone\">" + business.display_phone + "</p>";
  detailsPane.innerHTML += "<img src=\"" + business.rating + ".png\" class=\"rating\" />";
  detailsPane.innerHTML += "<a href=\"" + business.url + "\" class=\"yelpLink\"><img src=\"Yelp_trademark_RGB_outline.png\" width=\"75px\" /></a>";
  detailsPane.innerHTML += "<p class=\"reviewCount\">" + business.review_count + " reviews</p>";
  detailsPane.innerHTML += "<img src=\"" + business.image_url + "\" width=\"300px\" class=\"image\" />";
}

function setLocation(position) {
  loc = position;
}

function reset() {
  rotation = 0;
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, 500, 500);
}

function init() {
  // Make sure we're using https so chrome will let us use geolocation
  if(window.location.protocol != "https:" && window.location.hostname != "localhost") {
    window.location.href = "https://wheel-of-food.herokuapp.com/";
  }
  canvas = document.getElementById("cvs");
  context = canvas.getContext("2d");
  context.font = "24px sans-serif";
  reset();
  spinning = false;
  document.getElementById("spinButton").disabled="true";
  document.getElementById("stopSpinButton").disabled = "true";
  var width = context.measureText("Nothing to display").width;
  context.fillText("Nothing to display", 250 - width/2, 260);
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setLocation);
  } else {
    document.getElementById("useCurrentLocation").checked = false;
    document.getElementById("useCurrentLocation").disabled = "true";
  }
}

function search() {
  document.getElementById("detailsPane").innerHTML = "";
  var url = "/search";
  if(document.getElementById("useCurrentLocation").checked) {
    if(loc === undefined) {
      alert("Cannot access location");
      return;
    } else {
      url += "?latitude=" + loc.coords.latitude;
      url += "&longitude=" + loc.coords.longitude;
    }
  } else {
    if(document.getElementById("location").value !== "") {
      url += "?location=" + document.getElementById("location").value;
    } else {
      alert("No location specified");
      return;
    }
  }
  if(document.getElementById("radius").value !== "") {
    url += "&radius=" + Math.round(parseInt(document.getElementById("radius").value) * 1609.344);
  }
  if(document.getElementById("openNow").checked) {
    url += "&open_now=true";
  }
  
  var prices = [];
  if(document.getElementById("priceOne").checked) {
    prices.push(1);
  }
  if(document.getElementById("priceTwo").checked) {
    prices.push(2);
  }
  if(document.getElementById("priceThree").checked) {
    prices.push(3);
  }
  if(document.getElementById("priceFour").checked) {
    prices.push(4);
  }
  if(prices.length > 0) {
    url += "&price=" + prices.toString();
  }
  if(document.getElementById("term").value.trim().length > 0) {
    url += "&term=" + document.getElementById("term").value.trim();
  }
  
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if(xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      processResults(xmlHttp.responseText);
    }
  };
  xmlHttp.open("GET", url, true);
  xmlHttp.send(null);
  reset();
  var width = context.measureText("Loading...").width;
  context.fillText("Loading...", 250 - width/2, 260);
  document.getElementById("searchButton").disabled="true";
  document.getElementById("spinButton").disabled="true";
}

function getSelectedBusiness() {
  return spinnerBusinesses[(spinnerBusinesses.length - Math.round(spinnerBusinesses.length*((rotation) % (2*Math.PI))/(2*Math.PI))) % spinnerBusinesses.length];
}

function spin() {
  document.getElementById("spinButton").disabled="true";
  document.getElementById("searchButton").disabled="true";
  document.getElementById("stopSpinButton").removeAttribute("disabled");
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
    context.arc(0, 0, 245, -Math.PI/displayNames.length, Math.PI/displayNames.length);
    context.lineTo(0, 0);
    context.fill();
    context.stroke();
    
    context.fillStyle = "#000000";
    var name = displayNames[i];
    var width = context.measureText(name).width;
    context.fillText(name, 242 - width, 10);
    angularVelocity = Math.max(0, angularVelocity + angularAcceleration/60);
    context.rotate(2*Math.PI/displayNames.length);
  }
  showDetails(getSelectedBusiness());
  nextFrame = window.requestAnimationFrame(drawSpinner);
  if(angularVelocity <= 0) {
    stopSpin();
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
      while(width > 207) {
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
    document.getElementById("searchButton").removeAttribute("disabled");
  }
}

function processResults(results) {
  // Parse the JSON response
  allBusinesses = JSON.parse(results);
  
  // Copy contents of allBusinesses to spinnerBusinesses
  spinnerBusinesses = allBusinesses.slice();
  
  // Remove random businesses until spinnerBusinesses has 10 or fewer elements
  while(spinnerBusinesses.length > 10) {
    spinnerBusinesses.splice(Math.floor(Math.random() * spinnerBusinesses.length), 1);
  }
  
  initSpinner();
}