var map;
var infoBar;
var regions = [];

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
    var interface = document.getElementById("choose-active");
    interface.classList.remove("hidden");
    // hide welcome message
    var welcome = document.getElementById("get-started");
    welcome.classList.add("hidden");

    // initialize region object
    var polygonCoords = getPolygonCoords(polygon);
    const polygonArea = google.maps.geometry.spherical.computeArea(polygon.getPath());
    var region = {
      name: "Region " + String(regions.length + 1),
      id: generateId(),
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

/////////////
// SIDEBAR //
/////////////

// adds given region to dropdown
function addToDropdown(region) {
  const dropdown = document.getElementById("active-region");

  let option = document.createElement("option");
  option.setAttribute('value', region.name);

  let optionText = document.createTextNode(region.name);
  option.appendChild(optionText);

  dropdown.appendChild(option);
}

// switches active region on dropdown change
const dropdown = document.getElementById("active-region");
dropdown.addEventListener("change", function() {
  const selectedOption = dropdown.selectedIndex;
  activeRegion = regions[selectedOption];
  console.log(activeRegion);
});