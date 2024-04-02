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

var loggedinuser;

// JORDAN:
// log in and sign up functionality - fields should be first, last, email, password, and a checkbox to opt out of leaderboard
// if possible the login/signup pages should be a popup rather than navigating to a new page
// if that's too hard nbd

// Open sign in
document.getElementById('signup-btn').addEventListener('click', function() {
  document.getElementById('signup-form-popup').style.display = 'block';
  document.body.classList.add('active-popup');
});

// Submit sign in
document.getElementById("signup-submit-btn").addEventListener('click', (e) => {
  e.preventDefault();
  const signupform = document.getElementById('signup-form');
  var first = signupform.firstname.value;
  var last = signupform.lastname.value;
  var email = signupform.email.value;
  var password = signupform.password.value;
  var optout = document.getElementsByName("optout")[0].checked;

  db.collection('users').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
      if (doc.data()['email'].toLowerCase() == email.toLowerCase()) {
        alert("An account with this email already exists. Please try again.")
      }
      else {
        db.collection("users").add({
          first:first,
          last:last,
          email:email,
          password:password,
          optout:optout
        })
        .then((docRef) => {
          console.log("Document with ID: ", docRef.id);
          alert("Account created with email " + email + ". Please sign in.")
        })
        .catch((error) => {
          console.error("Error: ", error)
        })
      }
    })
  })
});

// Close sign in
document.getElementById('login-btn').addEventListener('click', function() {
  document.getElementById('login-form-popup').style.display = 'block';
  document.body.classList.add('active-popup');
});

// Open log in
document.getElementById('signup-submit-btn').addEventListener('click', function() {
  document.getElementById('signup-form-popup').style.display = 'none';
  document.body.classList.remove('active-popup');
});

// Submit log in
document.getElementById("login-submit-btn").addEventListener('click', (e) => {
  e.preventDefault();
  const loginform = document.getElementById('login-form');
  var email = loginform.email.value;
  var password = loginform.password.value;
  db.collection('users').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
      if (doc.data()['email'].toLowerCase() == email.toLowerCase()) {
        if (doc.data()['password'] == password) {
          loggedinuser = doc; 
          console.log(loggedinuser.data())
        }
        else {
          console.log('error from password');
        }
      }
      else {
        console.log('error from email');
      }
    })
  })
});

// Close log in
document.getElementById('login-close-btn').addEventListener('click', function() {
  document.getElementById('login-form-popup').style.display = 'none';
  document.body.classList.remove('active-popup');
});



document.getElementById("walk-submit").addEventListener('click', function() {
  // add a record to firebase
});
// log a walk - add a new walk to the user's account including the date and mileage



walksDiv = document.getElementById("walks")
walks = // import list of current user's walks here



leaderboardDiv = document.getElementById("leaderboard")
//users = // import list of all users and all their walks so i can make a leaderboard out of it, include whether or not they opted out of leaderboard when signing up