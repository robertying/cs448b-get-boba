"use strict";

d3.select("#minimumRating").on("input", async function (event) {
  window.minimumRating = parseFloat(this.value);
  d3.select("#minimumRatingNumber").text(window.minimumRating.toFixed(1));
});

d3.select("#searchNameInput").on("input", async function (event) {
  window.searchName = this.value.trim();
});

d3.select("#applyButton").on("click", async function (event) {
  window.filterDots();
});
