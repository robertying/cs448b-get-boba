"use strict";

(async () => {
  // load dataset
  window.dataset = await d3.csv("./assets/asst3_yelp.csv");

  // preprocess dataset
  window.dataset = window.dataset.map((d) => {
    const latitude = parseFloat(d.coordinates.split(",")[0]);
    const longitude = parseFloat(d.coordinates.split(",")[1]);
    return {
      ...d,
      latitude,
      longitude,
    };
  });

  window.svg = d3.select("#root");

  draw();
  window.draw = draw;
})();

function draw() {
  calculateMapping();
  drawCircles();
  initializeDots();
  drawLegends();
  drawTooltip();
  window.updateDots();
  window.filterDots();
}

function calculateMapping() {
  // longitude/latitude mapping to canvas coordinates
  window.xScale = d3
    .scaleLinear()
    .domain([window.minMapLongitude, window.maxMapLongitude])
    .range([0, window.canvasWidth]);
  window.yScale = d3
    .scaleLinear()
    .domain([window.minMapLatitude, window.maxMapLatitude])
    .range([window.canvasHeight, 0]);
}

function drawLegends() {
  const legendsGroup = window.svg
    .append("g")
    .attr("id", "legendsGroup")
    .style("transform", `translate(${window.canvasWidth - 110}px, 10px)`);

  // create a white background
  legendsGroup
    .append("rect")
    .attr("id", "legendsGroup")
    .attr("width", 100)
    .attr("height", 100)
    .attr("fill", "#99d0ff");

  legendsGroup
    .append("text")
    .attr("x", 10)
    .attr("y", 24)
    .attr("fill", "black")
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .text("Shops");

  const legends = [
    { name: "Filtered", color: "green" },
    { name: "Intersection", color: "green" },
    { name: "Rest", color: "lightgray" },
  ];

  const legendItems = legendsGroup
    .selectAll("g")
    .data(legends, (d) => d.name)
    .join("g")
    .attr("transform", (d, index) => `translate(10, ${32 + index * 20})`);

  legendItems
    .append("circle")
    .attr("cx", 4)
    .attr("cy", 12)
    .attr("r", (d) => (d.name === "Filtered" ? "0.3rem" : "0.2rem"))
    .attr("stroke-width", "0.1rem")
    .attr("stroke", (d) => (d.name === "Filtered" ? "white" : "none"))
    .attr("fill", (d) => d.color);

  legendItems
    .append("text")
    .attr("x", 14)
    .attr("y", 15)
    .attr("fill", "black")
    .style("font-size", "12px")
    .text((d) => d.name);
}

function drawCircles() {
  // handle drag of circles
  const dragHandler = d3.drag().on("drag", function (event) {
    // update circle position
    d3.select(this).attr("cx", event.x).attr("cy", event.y);

    window.updateDots();
  });

  const circleA = window.svg
    .append("circle")
    .attr("id", "circleA")
    .attr("cx", 335)
    .attr("cy", 676)
    .attr("r", d3.select("#circleASize").attr("value"))
    .attr("fill", "rgba(241, 148, 138, 0.5)")
    .attr("stroke", "rgb(241, 148, 138)")
    .style("cursor", "grab")
    .call(dragHandler);
  const circleB = window.svg
    .append("circle")
    .attr("id", "circleB")
    .attr("cx", 414)
    .attr("cy", 751)
    .attr("r", d3.select("#circleBSize").attr("value"))
    .attr("fill", "rgba(133, 193, 233, 0.5)")
    .attr("stroke", "rgb(133, 193, 233)")
    .style("cursor", "grab")
    .call(dragHandler);

  updateSliderMiles();

  // change circle size based on slider
  d3.select("#circleASize").on("input", function () {
    circleA.attr("r", this.value);
    window.updateDots();
    updateSliderMiles();
  });
  d3.select("#circleBSize").on("input", function () {
    circleB.attr("r", this.value);
    window.updateDots();
    updateSliderMiles();
  });

  function updateSliderMiles() {
    d3.select("#circleASizeMile").text(
      parseFloat(d3.select("#circleA").attr("r") * window.mapZoom).toFixed(2) +
        " miles"
    );
    d3.select("#circleBSizeMile").text(
      parseFloat(d3.select("#circleB").attr("r") * window.mapZoom).toFixed(2) +
        " miles"
    );
  }
}

function initializeDots() {
  const dotsGroup = window.svg.append("g").attr("id", "dotsGroup");

  window.dots = dotsGroup
    .selectAll("circle")
    .data(window.dataset, (d) => d.id)
    .join("circle")
    .attr("opacity", 0.5)
    .attr("fill", "lightgray")
    .attr("cx", (d) => window.xScale(d.longitude))
    .attr("cy", (d) => window.yScale(d.latitude))
    .attr("r", "0.1rem")
    .attr("stroke-width", "0.10rem")
    .on("mouseover", function (event, d) {
      window.svg.select("#tooltip-name").text(d.name);
      window.svg.select("#tooltip-rating").text(d.rating);
      window.svg
        .select("#tooltip-category")
        .text(d.categories.split(",").join(", "));
      window.svg.select("#tooltip-phone").text(d.phone ?? "No number provided");
      window.svg
        .select("#tooltip-address")
        .text(
          JSON.parse(d.address.replace(/'/g, '"'))[1]
            ? JSON.parse(d.address.replace(/'/g, '"'))[0] +
                ",   " +
                JSON.parse(d.address.replace(/'/g, '"'))[1]
            : JSON.parse(d.address.replace(/'/g, '"'))[0]
        );
      window.svg.select("#tooltip-image").attr("href", d.image_url);
      drawRating(d.rating);
      window.svg
        .select("#tooltip")
        .attr(
          "transform",
          `translate(${window.xScale(d.longitude) + 4}, ${
            window.yScale(d.latitude) - 250 - 4
          })`
        )
        .style("display", "block");
      const circle = d3.select(this);
      const originalStroke = circle.attr("stroke");
      circle.attr("originalStroke", originalStroke).attr("stroke", "black");
    })
    .on("mouseout", function (event, d) {
      svg.select("#tooltip").style("display", "none");
      d3.select(this).attr("stroke", d3.select(this).attr("originalStroke"));
    });
}

function drawTooltip() {
  window.tooltip = window.svg
    .append("g")
    .attr("id", "tooltip")
    .style("display", "none");
  tooltip
    .append("rect")
    .attr("width", 300)
    .attr("height", 250)
    .attr("fill", "white")
    .style(
      "box-shadow",
      "0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 12px 17px 2px rgba(0, 0, 0, 0.14), 0px 5px 22px 4px rgba(0, 0, 0, 0.12)"
    );
  tooltip
    .append("text")
    .attr("id", "tooltip-name")
    .attr("x", 20)
    .attr("y", 30)
    .attr("font-size", "14px")
    .attr("font-weight", "bold")
    .attr("fill", "black");
  tooltip
    .append("text")
    .attr("id", "tooltip-rating")
    .attr("x", 20)
    .attr("y", 50)
    .attr("font-size", "12px")
    .attr("fill", "black");
  tooltip
    .append("text")
    .attr("id", "tooltip-category")
    .attr("x", 20)
    .attr("y", 70)
    .attr("font-size", "12px")
    .attr("fill", "gray");
  tooltip
    .append("text")
    .attr("id", "tooltip-phone")
    .attr("x", 20)
    .attr("y", 90)
    .attr("font-size", "12px")
    .attr("fill", "black");
  tooltip
    .append("text")
    .attr("id", "tooltip-address")
    .attr("x", 20)
    .attr("y", 110)
    .attr("font-size", "12px")
    .attr("fill", "black");
  tooltip
    .append("image")
    .attr("id", "tooltip-image")
    .attr("x", 10)
    .attr("y", 125)
    .attr("width", 250)
    .attr("height", 110);
}

function drawRating(rating) {
  let ratingGroup = window.tooltip.select("#tooltip-stars");
  if (ratingGroup.empty()) {
    ratingGroup = window.tooltip.append("g").attr("id", "tooltip-stars");
  } else {
    ratingGroup.selectAll("*").remove();
  }

  for (let i = 0; i < Math.round(rating); i++) {
    ratingGroup
      .append("path")
      .attr("d", d3.symbol().type(d3.symbolStar).size(40))
      .attr("fill", "yellow")
      .attr("stroke", "orange")
      .attr("transform", `translate(${i * 16}, 0)`);
  }

  ratingGroup.style("transform", "translate(52px, 46px)");
}

window.updateDots = _.throttle(async function () {
  const sizeA = d3.select("#circleA").attr("r");
  const sizeB = d3.select("#circleB").attr("r");
  const xA = d3.select("#circleA").attr("cx");
  const yA = d3.select("#circleA").attr("cy");
  const xB = d3.select("#circleB").attr("cx");
  const yB = d3.select("#circleB").attr("cy");

  // calculate intersection
  const newIntersectionData = window.dataset.filter((d) => {
    const x = window.xScale(d.longitude);
    const y = window.yScale(d.latitude);
    const distA = Math.sqrt((x - xA) ** 2 + (y - yA) ** 2);
    const distB = Math.sqrt((x - xB) ** 2 + (y - yB) ** 2);
    return distA < sizeA && distB < sizeB;
  });

  const intersectionToRemoveData = window.intersectionData.filter(
    (d) => !newIntersectionData.includes(d)
  );
  window.intersectionData = newIntersectionData;

  // only update the dots that are not in the intersection
  // to reduce d3 operations
  window.dots
    .data(intersectionToRemoveData, (d) => d.id)
    .attr("fill", "lightgray");

  window.dots.data(newIntersectionData, (d) => d.id).attr("fill", "green");
}, 100);

window.filterDots = _.throttle(async function () {
  const minimumRating = window.minimumRating;
  const searchName = window.searchName;

  // filter by minimum rating
  let filteredData = window.intersectionData.filter(
    (d) => parseFloat(d.rating) >= minimumRating
  );

  // filter by name
  if (searchName) {
    filteredData = filteredData.filter((d) =>
      d.name.toLowerCase().includes(searchName.toLowerCase())
    );
  }

  // update shop count
  d3.select("#shopsFoundCount").text(filteredData.length);

  window.dots
    .data(filteredData, (d) => d.id)
    .join(
      (enter) => enter,
      (update) => update.attr("stroke", "white").attr("r", "0.2rem"),
      (exit) => exit.attr("stroke", "none").attr("r", "0.1rem")
    );
}, 100);
