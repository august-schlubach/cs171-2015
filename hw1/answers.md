## Week 1 Questions

1.1 The DOM Inspector shows the elements on a page as a tree of parent-child relationships whereas HTML source is plain markup. The DOM Inspector is particularly useful in exploring dynamically generated DOM elements that do not show in the page source. HTML source is useful for debugging, reading Javascript, and following links to externally included assets such as CSS and JS files.

1.2 The table in table.html is generated dynamically by D3 then the rows are populated as D3 iterates through the data imported from countries_2012.json.

2. It would be interesting to be able to set thresholds for GDP, population, and life expectancy. I would do this with a combination of a drop down select widget ('more than', 'less than') and an input field for an arbitrary value.

3.1 Aggregation by latitude is possible since we have the data. I would divide the countries into 4 segments: North, Tropic of Cancer - Equator, Equator - Tropic of Capricorn, and South. Population, life expectancy, and GDP would be particularly interesting to view across these bands. I would use a radio button setup similar to continent aggregation for latitude aggregation. 

4.1 Years is an array of objects containing GDP, life expectancy, population and some economic metrics for each year in the specified period.

5.1 HTML is lightweight and relatively quick to prototype with. It excels at displaying tabular data and there are even basic transition effects available via CSS3, but creating a data-intesive interactive visualization such as a complex computer network diagram would be difficult as compared to SVG. SVG also allows for the use of bezier curves, filters, and lighting effects that would be hard to duplicate, if not impossible, in HTML alone.

7.1 As an engineer, I'm drawn to the example of complex computer networks, where tracing a line through myriad connections would be virtually impossible in a static graph. However, given interactivity and the ability to use color and movement the layers of a network can be visually peeled back to reveal connections in a meaningful and understandable manner.

7.2 Interactive charts can offer a layered approach to data allowing you to start at a high level overview, zoom into significant portions of the data, filter and get then get specific detail views. 

7.3 Computational: the ability of a computer to parse and render a data vis 
    Peceptual and Cognitive: the ability for a human to process and store information over time
    Display: the amount of space given versus the amount of data to be displayed

7.4 Semantics provide context which allows complex data to be interpreted for meaning and use. As Munzaner points out, it would not make sense to sum postal codes even though they are numbers.

7.5 Quantitative attributes can be evaluated by arithmetic. Categorical attributes compare items of the same or different types. Ordinal data orders items in a non-quantitative way (cold, warm, hot).

7.6 Position, size, color, shape, motion, orientation, and texture.

7.7 Position
