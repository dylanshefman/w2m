let map;
let infoBar;

function initialize() {
  // Set up the map
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 39.101871, lng: -94.582927 },
    zoom: 15,
  });

  // Set up the Drawing Manager
  const drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.POLYGON,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [google.maps.drawing.OverlayType.POLYGON],
    },
  });
  drawingManager.setMap(map);

  // Add an event listener for when the polygon is completed
  var polygons = [];
  google.maps.event.addListener(drawingManager, "polygoncomplete", (polygon) => {
    polygons.push(polygon);
    const area = google.maps.geometry.spherical.computeArea(polygon.getPath());
    alert(`Polygon area: ${area.toLocaleString('en-US', {maximumFractionDigits: 0})} square meters`);
  });
}


function calculateArea() {
  const area = google.maps.geometry.spherical.computeArea(selectedShape.getPath());
  areaLabel.innerHTML = (area / 1000000).toFixed(2) + " km²";
}
