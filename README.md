# Assignment 3

> CS 448B Data Visualization
>
> Rui Ying / ruiying

Live at https://cs448b.ruiying.io.

## Development

The assignment helped me revisit and apply what we have learned from the Observable notebooks to something new.

The development took roughly 16 hours, of which assessing the scope and improving the performance took the most time.

### Assess the scope

This was my first time writing a D3 application. Since we are required to add controls that may be separate from the svg canvas, I was debating what kind/scope of application I should be aiming for, to have better development experience. I played with Observable notebooks and found it not to my liking because of the special usage of JavaScript. I experimented with incorporating React to make state management easier, considering the need of multiple filters. Eventually I settled with the vanilla HTML/CSS/JavaScript approach.

The vanilla approach enables quick development, but makes efficiently adding third-party libraries difficult. Therefore, I only did the minimum styling. Also, having written the website in vanilla JS, I now miss the convenient and painless statement management modern frameworks bring.

### Improve the performance

I was not ready for the laggy update in the first version of the application, so it took me lots of time to figure out the problem and try to fix the performance issue.

Please correct me if I'm wrong, but it seems D3 can't really handle the update of thousands of elements very efficiently, as shown in https://tommykrueger.com/projects/d3tests/performance-test.php. This may be due to its SVG use, which has limited performance.

Regardless, to solve the issue, there seem to be two ways:

1. Reduce the number of elements that need updating. Since there always can be a case where almost all shops are needed drawing (e.g. most strict filter changes to least strict) and 6000+ elements will be updated, there isn't a determined way to optimize the worst case during one single update.

2. Minimize the number of updates. I used the throttle function to limit how often the update can happen and the debounce function to "wait" for user input, which reduced unnecessary redraws and improved the performance without affecting user control too much.

## Shortcomings

Given more time, I would have improved on the three aspects below:

### Performance

There is slight lag when using the filters, especially when changing the minimum rating slider, which however only happens if there are thousands of added/removed shops in the filtered data at once.

### Styling

It takes more effort to style vanilla HTMLs, so I didn't put too much time in it. Besides, SVG elements aren't responsive like many HTML ones. For example, it's difficult to make the name of the shop wrap automatically when it exceeds the bounding rectangle, so there are tooltips with the overflowing text problem.

### Data sanitizing

CSV data may not be all de-serializable for JavaScript to consume. The application didn't put too much effort in cleaning, parsing or fixing unrecognizable data from the csv data file, so some edge cases aren't handled.

## Libraries

The following third-party libraries except D3 are used:

- [TailwindCSS](https://tailwindcss.com/) provides quick styling.
- [d3-drag](https://github.com/d3/d3-drag) provides drag and drop for elements.
- [lodash](https://lodash.com/) provides utilities such as debounce and throttle.
