"use strict";

d3.select("#minimumRating").on("input", function (event) {
  window.minimumRating = parseFloat(this.value);
  d3.select("#minimumRatingNumber").text(window.minimumRating.toFixed(1));

  window.filterDots();
});

d3.select("#searchNameInput").on(
  "input",
  _.debounce(function (event) {
    window.searchName = this.value.trim();

    window.filterDots();
  }, window.debounceTime)
);
