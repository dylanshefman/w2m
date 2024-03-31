/////////
// MAP //
/////////

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

//////////
// USER //
//////////



// JORDAN:

loginBtn = document.getElementById("login-btn")
signupBtn = document.getElementById("signup-btn")
// log in and sign up functionality - fields should be first, last, email, password, and a checkbox to opt out of leaderboard
// if possible the login/signup pages should be a popup rather than navigating to a new page
// if that's too hard nbd



walkSubmit = document.getElementById("walk-submit")
// log a walk - add a new walk to the user's account including the date and mileage



walksDiv = document.getElementById("walks")
walks = // import list of current user's walks here



leaderboardDiv = document.getElementById("leaderboard")
users = // import list of all users and all their walks so i can make a leaderboard out of it, include whether or not they opted out of leaderboard when signing up