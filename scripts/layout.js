"use strict";

// make sure the svg canvas is the same size of the map
new ResizeObserver(() => {
  const map = document.getElementById("map");
  const { width, height } = map.getBoundingClientRect();
  window.canvasWidth = width;
  window.canvasHeight = height;
  d3.select("#root").attr("width", width).attr("height", height);

  // redraw if layout changes
  if (window.svg) {
    window.svg.selectAll("*").remove();
    window.draw();
  }
}).observe(document.getElementById("map"));
