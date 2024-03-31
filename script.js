/////////
// MAP //
/////////

// instantiate map and add landmarks
var map = L.map('map').setView([43.8, -84.584726], 7);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

landmarks = [
  {name: "Milan", lat: 42.084905, lon: -83.683072},
  {name: "Fenton", lat: 42.797731, lon: -83.704868},
  {name: "Frankenmuth", lat: 43.331589, lon: -83.738242},
  {name: "Standish", lat: 43.982767, lon: -83.959743},
  {name: "Roscommon", lat: 44.498532, lon: -84.592481},
  {name: "Vanderbilt", lat: 45.142606, lon: -84.663216},
  {name: "St. Ignace", lat: 45.872606, lon: -84.730787}
]
landmarks.forEach(function(landmark) {
  L.circleMarker([landmark.lat, landmark.lon], { radius: 5 }).addTo(map).bindTooltip(landmark.name, {
    permanent: true,
    direction: "right",
    className: "label-text"}).openTooltip();
});

document.addEventListener("DOMContentLoaded", function() {
  var signupBtn = document.getElementById("signupBtn");
  var signupBox = document.getElementById("signupBox");

  signupBtn.addEventListener("click", function() {
    if (signupBox.style.display === "none") {
      signupBox.style.display = "block";
    } else {
      signupBox.style.display = "none";
    }
  });
});