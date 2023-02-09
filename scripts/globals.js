"use strict";

// coordinates of the four corners of the map shown as the background image
window.minMapLatitude = 37.18648771899753;
window.maxMapLatitude = 38.47788305478268;
window.minMapLongitude = -122.88876018497501;
window.maxMapLongitude = -121.76134928706442;

window.canvasWidth = 1838;
window.canvasHeight = 1270;

window.mapZoom = 9.35 / 80; // mile/pixel

window.intersectionData = [];
window.filteredData = [];
window.minimumRating = 4.0;
window.searchName = "";

window.throttleTime = 1000 / 60; // target 60 fps (0.0167 update rate)
window.debounceTime = 300; // wait for search input (estimated human response time)
