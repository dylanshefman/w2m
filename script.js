var map;
var infoBar;
var regions = [];
const dropdown = document.getElementById("active-region");
const deleteButton = document.getElementById("delete-region");

/////////
// MAP //
/////////

function initialize() {
  // set up map
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 39.101871, lng: -94.582927 },
    zoom: 15,
  });

  // set up drawing manager
  const drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.POLYGON,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [google.maps.drawing.OverlayType.POLYGON],
    },
  });
  drawingManager.setMap(map);

  // generates a unique id among those created in current session
  var id = 0;
  function generateId() {
    id++;
    return id;
  }

  // add event listener for when region is completed
  google.maps.event.addListener(drawingManager, "polygoncomplete", (polygon) => {

    // show region manipulation interface
    let interface = document.getElementById("choose-active");
    interface.classList.remove("hidden");
    deleteButton.classList.remove("hidden");
    // hide welcome message
    let welcome = document.getElementById("get-started");
    welcome.classList.add("hidden");

    // initialize region object
    var polygonCoords = getPolygonCoords(polygon);
    const polygonArea = google.maps.geometry.spherical.computeArea(polygon.getPath());
    let newId = generateId();
    var region = {
      name: "Region " + String(newId),
      id: newId,
      coords: polygonCoords,
      area: polygonArea,
      poly: polygon
    }
    
    regions.push(region);
    addToDropdown(region);
    setActiveRegion(region);
    
    // nonessential alert
    alert(`Polygon area: ${region.area.toLocaleString('en-US', {maximumFractionDigits: 0})} square meters`);
    console.log(getPolygonCoords(polygon));
    console.log(regions)
  });
}

// gets coordinates of polygon
function getPolygonCoords(poly) {
  let len = poly.getPath().getLength();
  let coordinates = []
  for (let i = 0; i < len; i++) {
    let coordStrings = poly.getPath().getAt(i).toUrlValue(10).split(",");
    let coordFloats = [];
    for (let j = 0; j < coordStrings.length; j++) {
      coordFloats.push(parseFloat(coordStrings[j]));
    }
    coordinates.push(coordFloats);
  }
  return coordinates;
}

function setActiveRegion(region) {
  activeRegion = region;
  setActiveStyle(region);
  dropdown.value = region.name;

  for (let i = 0; i < regions.length; i++) {
    if (regions[i].id != region.id) {
      setInactiveStyle(regions[i]);
    }
  }
}

function setActiveStyle(region) {
  region.poly.setOptions({strokeWeight: 4.0});
}
function setInactiveStyle(region) {
  region.poly.setOptions({strokeWeight: 2.0});
}

//////////////
// DROPDOWN //
//////////////

// adds given region to dropdown
function addToDropdown(region) {
  let option = document.createElement("option");
  option.setAttribute('value', region.name);

  let optionText = document.createTextNode(region.name);
  option.appendChild(optionText);

  dropdown.appendChild(option);
}

// switches active region on dropdown change
dropdown.addEventListener("change", function() {
  setActiveRegion(regions[dropdown.selectedIndex]);
});

function setActiveDropdown(region) {
  if (activeRegion.id == region.id) { return; }
  dropdown.value = region.name;
}

/////////////
// SIDEBAR //
/////////////

deleteButton.addEventListener("click", function() {
  for (let i = 0; i < regions.length; i++) {
    if (regions[i].id == activeRegion.id) {
      dropdown.remove(i);
      regions[i].poly.setMap(null);
      regions.splice(i, 1);
      break;
    }
  }
  if (regions.length > 0) {
    setActiveRegion(regions[regions.length - 1]);
  }
  else {
    activeRegion = null;
    resetSidebar();
  }
  console.log(regions);
})

function resetSidebar() {
  // hide region manipulation interface
  let interface = document.getElementById("choose-active");
  interface.classList.add("hidden");
  deleteButton.classList.add("hidden");
  // show welcome message
  let welcome = document.getElementById("get-started");
  welcome.classList.remove("hidden");
}

var rename = document.getElementById("rename-text");
rename.addEventListener("click", function() {
  activeRegion.name = rename.innerHTML;
})