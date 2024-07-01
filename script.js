/////////
// MAP //
/////////

var map = L.map('map').setView([43.8, -84.584726], 7);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

landmarks = [
  { name: "Milan", lat: 42.084905, lon: -83.683072 },
  { name: "Fenton", lat: 42.797731, lon: -83.704868 },
  { name: "Frankenmuth", lat: 43.331589, lon: -83.738242 },
  { name: "Standish", lat: 43.982767, lon: -83.959743 },
  { name: "Roscommon", lat: 44.498532, lon: -84.592481 },
  { name: "Vanderbilt", lat: 45.142606, lon: -84.663216 },
  { name: "St. Ignace", lat: 45.872606, lon: -84.730787 }
]

function plotCities() {
  landmarks.forEach(function(landmark) {
    L.circleMarker([landmark.lat, landmark.lon], { radius: 5 }).addTo(map).bindTooltip(landmark.name, {
      permanent: true,
      direction: "right",
      className: "label-text",
      fontFamily: '"Poppins", sans serif'
    }).openTooltip();
  });
}

var trips = [
  {origin: 0, dest: 1},
  {origin: 1, dest: 2},
  {origin: 2, dest: 3},
  {origin: 3, dest: 4},
  {origin: 4, dest: 5},
  {origin: 5, dest: 6},
  {origin: 6, dest: 5},
  {origin: 5, dest: 4},
  {origin: 4, dest: 3},
  {origin: 3, dest: 2},
  {origin: 2, dest: 1},
  {origin: 1, dest: 0},
];

for (var i = 0; i < trips.length; i++) {
  var trip = trips[i];

  var origin = trip["origin"];
  var originObj = landmarks[origin];
  var originCoords = { lon: originObj.lon, lat: originObj.lat };

  var dest = trip["dest"];
  var destObj = landmarks[dest];
  var destCoords = { lon: destObj.lon, lat: destObj.lat };

  trip["dist"] = distance(originCoords, destCoords);
  var cumulative = 0;
  for (let j = i; j >= 0; j--) {
    cumulative += trip["dist"];
  }
  trip["cumulative"] = parseFloat(cumulative.toFixed(2));
}
var x = trips[2];

function distance(coord1, coord2) {
    const R = 3958.8; // radius of the Earth in miles
    const lat1 = toRadians(coord1.lat);
    const lon1 = toRadians(coord1.lon);
    const lat2 = toRadians(coord2.lat);
    const lon2 = toRadians(coord2.lon);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;

    return parseFloat(distance.toFixed(2));
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function plotLines() {
  displayTotalMileage().then((total) => {
    var farthestIndex = 0;
    var lastPoint = [landmarks[trips[0].origin].lat, landmarks[trips[0].origin].lon]
    while (total > trips[farthestIndex].cumulative) {
      lastPoint = plotFullLine(farthestIndex);
      farthestIndex++;
    }
    if (farthestIndex < trips.length) {
      var remainder;
      if (farthestIndex === 0) {
        remainder = total;
      } else {
        remainder = total - trips[farthestIndex - 1].cumulative;
      }
      lastPoint = plotPartialLine(parseFloat(farthestIndex), parseFloat(remainder));
    }
  });
}

function plotFullLine(idx) {
  originCoords = [landmarks[trips[idx].origin].lat, landmarks[trips[idx].origin].lon];
  destCoords = [landmarks[trips[idx].dest].lat, landmarks[trips[idx].dest].lon];
  var opacity;
  if (idx <= 5) {
    opacity = 0.5;
  } else {
    opacity = 1;
  }
  var polyline = L.polyline([originCoords, destCoords], {color: 'red', weight: 6, opacity: opacity}).addTo(map);
  return destCoords;
}

function plotPartialLine(idx, d) {
  var trip = trips[idx];
  const totalDist = trip.dist;

  var origin = trip["origin"];
  var originObj = landmarks[origin];
  var originCoords = { lon: originObj.lon, lat: originObj.lat };

  var dest = trip["dest"];
  var destObj = landmarks[dest];
  var destCoords = { lon: destObj.lon, lat: destObj.lat };

  const ratio = d / totalDist;

  var latIntermediate = originCoords.lat + (destCoords.lat - originCoords.lat) * ratio;
  var lonIntermediate = originCoords.lon + (destCoords.lon - originCoords.lon) * ratio;

  var opacity, fillColor;
  if (idx <= 5) {
    opacity = 0.5;
    fillColor = "#F98980";
  } else {
    opacity = 1;
    fillColor = "red";
  }

  L.polyline([[originCoords.lat, originCoords.lon], [latIntermediate, lonIntermediate]], {color: 'red', weight: 6, opacity: opacity}).addTo(map);
  L.circle([latIntermediate, lonIntermediate], {fillColor: fillColor, fillOpacity: 1, opacity: 0, radius: 10000}).addTo(map);

  return [latIntermediate, lonIntermediate];
}


//////////
// USER //
//////////

document.addEventListener("DOMContentLoaded", displayTotalMileage);

const signupBtn = document.getElementById("signup-btn");
const signupSubmit = document.getElementById("signup-submit-btn");
const signupClose = document.getElementById("signup-close-btn");
var currentUser;

// Open sign up
signupBtn.addEventListener('click', function() {
  document.getElementById('signup-form-popup').style.display = 'block';
  document.body.classList.add('active-popup');
});

// Submit sign up
signupSubmit.addEventListener('click', (e) => {
  e.preventDefault();
  const signupform = document.getElementById('signup-form');
  var username = signupform.username.value;
  var password = signupform.password.value;
  var optout = document.getElementById("optout").checked;
  var displayName = "";
  if (!optout) {
    displayName = signupform.displayName.value;
  }

  // Check if the username already exists
  db.collection('users').where('username', '==', username.toLowerCase()).get().then((snapshot) => {
    if (!snapshot.empty) {
      alert("An account with this username already exists. Please try again.");
    } else {
      // Add the new user
      db.collection("users").add({
        username: username,
        password: password,
        optout: optout,
        displayName: displayName,
        mileage: [],
        dates: []
      })
      .then((docRef) => {
        console.log("Document with ID: ", docRef.id);
        alert("Account created with username " + username + ". Please sign in.");
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
    }
  }).catch((error) => {
    console.error("Error checking username: ", error);
  });
});


// Close sign up
signupClose.addEventListener('click', function() {
  document.getElementById('signup-form-popup').style.display = 'none';
  document.body.classList.remove('active-popup');
});


const loginBtn = document.getElementById("login-btn");
const loginSubmit = document.getElementById("login-submit-btn");
const loginClose = document.getElementById("login-close-btn");

// Open log in
loginBtn.addEventListener('click', function() {
  document.getElementById('login-form-popup').style.display = 'block';
  document.body.classList.add('active-popup');
});

// Submit log in
document.getElementById("login-submit-btn").addEventListener('click', (e) => {
  e.preventDefault();
  const loginform = document.getElementById('login-form');
  var username = loginform.username.value;
  var password = loginform.password.value;
  db.collection('users').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
      if (doc.data()['username'].toLowerCase() == username.toLowerCase()) {
        if (doc.data()['password'] == password) {
          currentUser = doc.data();
          cleanHeader();
          cleanMessages();
          cleanWalks();
          displayLeaderboard();
          displayWalks();
          document.getElementById('login-form-popup').style.display = 'none';
          document.body.classList.remove('active-popup');
          return;
        }
        else {
          alert("Incorrect password");
        }
      }
    })
  })
});

// Close log in
loginClose.addEventListener('click', function() {
  document.getElementById('login-form-popup').style.display = 'none';
  document.body.classList.remove('active-popup');
});

function cleanHeader() {
  signupBtn.remove();
  loginBtn.remove();

  const header = document.getElementById("header");
  let usernameElement = document.createElement('p');
  usernameElement.textContent = `Welcome, ${currentUser.username}`;
  header.appendChild(usernameElement);
}

function cleanMessages() {
  document.getElementById("leaderboard-message").remove();
}

function cleanWalks() {
  document.getElementById("sign-in-log-walk").remove();
  document.getElementById("me").classList.remove("hidden");
  document.getElementById("log-walk-div").classList.remove("hidden");
}


logWalk = document.getElementById("log-walk")

logWalk.addEventListener('submit', async function(event) {
  event.preventDefault();

  // Get the date and mileage from the form
  var date = logWalk.date.value;
  var mileage = parseFloat(logWalk.mileage.value);

  // Get the username of the logged-in user
  var username = currentUser["username"];

  // Fetch the user's record from Firebase Firestore
  db.collection('users').where('username', '==', username).get().then((snapshot) => {
      if (snapshot.empty) {
          console.log('No matching user found.');
          return;
      }

      // Assuming there's only one user with this username
      var userRef = snapshot.docs[0].ref;
      userRef.get().then((doc) => {
          if (doc.exists) {
              var userData = doc.data();

              // Update the dates and mileage arrays
              if (!userData.dates) {
                  userData.dates = [date];
              } else {
                  userData.dates.push(date);
              }

              if (!userData.mileage) {
                  userData.mileage = [mileage];
              } else {
                  userData.mileage.push(mileage);
              }

              // Update the user's record in Firebase Firestore
              userRef.update(userData).then(() => {
                  console.log('Walk logged successfully.');
              }).catch((error) => {
                  console.error('Error updating user record:', error);
              });
          } else {
              console.log('No data available for this user.');
          }
      }).catch((error) => {
          console.error('Error getting user document:', error);
      });
  }).catch((error) => {
      console.error('Error fetching user:', error);
  });
  await displayTotalMileage();
  alert("Walk logged successfully!");
});

async function displayTotalMileage() {
  var totalMileage = 0;
  try {
    const snapshot = await db.collection('users').get();
    snapshot.forEach((doc) => {
      var userData = doc.data();
      var mileages = userData.mileage || [];
      mileages.forEach(function(entry) {
        totalMileage += parseFloat(entry);
      });
    });
    document.getElementById("total-mileage").innerHTML = `${totalMileage.toFixed(2)} miles`;
    return totalMileage;
  } catch (error) {
    console.error('Error getting user documents:', error);
    return 0;
  }
}

async function getLeaderboard() {
  var users = [];
  try {
    const snapshot = await db.collection('users').get();
    snapshot.forEach((doc) => {
      var userData = doc.data();
      var mileages = userData.mileage || [];
      var totalMileage = 0;
      mileages.forEach(function(entry) {
        totalMileage += parseFloat(entry);
      });
      userData["totalMileage"] = totalMileage;
      users.push(userData);
    });
    
    return users;
  } catch (error) {
    console.error('Error getting user documents:', error);
    return 0;
  }
}

async function displayLeaderboard() {
  try {
    const users = await getLeaderboard();
    users.sort((a, b) => b.totalMileage - a.totalMileage);
    
    const lbTable = document.getElementById("leaderboard-content");

    var filteredUsers = users.filter(user => !user.optout);
      filteredUsers.forEach((user, rank) => {
        let userRow = document.createElement('tr');
        userRow.classList.add("user-div");

        // create rank element
        let rankElement = document.createElement("td");
        rankElement.textContent = rank + 1;
        rankElement.classList.add("rank");

        // create username element
        let displayNameElement = document.createElement('td');
        displayNameElement.textContent = user.displayName;
        if (user.username == currentUser.username) {
          displayNameElement.classList.add("bold");
        }
        
        // create mileage element
        let mileageElement = document.createElement('td');
        mileageElement.textContent = user.totalMileage;
        
        // add elements to leaderboard
        userRow.appendChild(rankElement);
        userRow.appendChild(displayNameElement);
        userRow.appendChild(mileageElement);
        
        lbTable.appendChild(userRow);
      });
  }
  catch(error) {
    console.log("error");
  }
}

function displayWalks() {
  var dates = currentUser.dates;
  var mileages = currentUser.mileage;
  var walks = [];
  for (let i = 0; i < dates.length; i++) {
    walks.push({date: new Date(dates[i]), mileage: mileages[i]});
  }
  walks.sort((a, b) => b.date - a.date);

  const walksTable = document.getElementById("walks");
  for (let i = 0; i < walks.length; i++) {
    
    // create row
    const row = document.createElement("tr");
    row.classList.add("walk");

    // create date element
    const dateP = document.createElement("td");
    dateP.textContent = walks[i].date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    // create mileage element
    const mileageP = document.createElement("td");
    mileageP.textContent = `${walks[i].mileage} mi`;
    
    // add elements to external div
    row.appendChild(dateP);
    row.appendChild(mileageP);
    walksTable.appendChild(row);
  }
}

const optout = document.getElementById('optout');
const displayNameBox = document.getElementById('displayName');
const displayLabel = document.getElementById('displayLabel')

function toggleDisplayNameBox() {
  if (optout.checked) {
      displayNameBox.classList.add('hidden');
      displayLabel.classList.add('hidden');
  } else {
      displayNameBox.classList.remove('hidden');
      displayLabel.classList.remove('hidden');
  }
}

optout.addEventListener('click', function() {
  toggleDisplayNameBox();
});

plotLines();
plotCities();