let map;
let infoBar;
let regions = [];

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
      coords: polygonCoords,
      name: "Region " + String(regions.length + 1),
      area: polygonArea
    }
    
    // set active region
    let activeRegion = region;

    regions.push(region);
    addToDropdown(region);
    
    // nonessential alert
    alert(`Polygon area: ${region.area.toLocaleString('en-US', {maximumFractionDigits: 0})} square meters`);
    console.log(getPolygonCoords(polygon));
  });

  google.maps.event.addListener(drawingManager, "click", (polygon) => {
    activeRegion = polygon;
    console.log("click");
  });
}

// gets coordinates of polygon
function getPolygonCoords(poly) {
  var len = poly.getPath().getLength();
  var coordinates = []
  for (var i = 0; i < len; i++) {
    coordinates.push(poly.getPath().getAt(i).toUrlValue(10));
  }
  return coordinates;
}

// adds given region to dropdown
function addToDropdown(region) {
  const dropdown = document.getElementById("active-region");

  let option = document.createElement("option");
  option.setAttribute('value', region.name);

  let optionText = document.createTextNode(region.name);
  option.appendChild(optionText);

  dropdown.appendChild(option);
}