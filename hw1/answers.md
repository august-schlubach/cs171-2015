1.1 The DOM Inspector shows the elements on a page in a series of parent-child relationships whereas HTML source is plain markup. The DOM Inspector is particularly useful in exploring dynamically generated DOM elements that do not show in the page source. HTML source is useful for debugging, reading Javascript, and following links to externally included assets such as CSS and JS files.

1.2 The table is generated dynamically by D3. The data comes from countries_2012.json.

2. It would be interesting to be able to set thresholds for GDP, population, and life expectancy. I would do this with a combination of a drop down select widget ('more than', 'less than') and an input field for an arbitrary value.

3.1 Aggregation by latitude is possible since we have the data. I would divide the countries into 4 segments: North, Tropic of Cancer - Equator, Equator - Tropic of Capricorn, and South. Population and GDP would be particularly interesting to view across these bands. I would use an on/off radio button setup similar to continent aggregation for latitude aggregation. 

4.1 Years is an array of objects containing GDP, life expectancy, population and some economic metrics for each year in the specified period.

