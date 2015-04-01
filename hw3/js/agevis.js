/**
 * Created by Hendrik Strobelt (hendrik.strobelt.com) on 1/28/15.
 */



/*
 *
 * ======================================================
 * We follow the vis template of init - wrangle - update
 * ======================================================
 *
 * */

/**
 * AgeVis object for HW3 of CS171
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
AgeVis = function(_parentElement, _data, _metaData){
    this.parentElement = _parentElement;
    this.data = _data;
    this.metaData = _metaData;
    this.displayData = [];


    // TODO: define all constants here
    this.margin = {top: 10, right: 20, bottom: 30, left: 20}
    this.h = 310;
    this.w = 230;

    this.initVis();

}


/**
 * Method that sets up the SVG and the variables
 */
AgeVis.prototype.initVis = function(){

    var that = this; // read about the this


    //TODO: construct or select SVG
    //TODO: create axis and scales
    var yScale = d3.scale.linear()
        .range([this.h, 0]);

    var xScale = d3.scale.linear()
        .range([0, this.w]);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    var svg = d3.select(this.parentElement).append("svg")
        .attr('id', 'ageVis-svg')
        .attr("width", this.w)
        .attr("height", this.h)
      .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    svg.append("g")
        .attr("class", "y-age axis");

    this.yAxis = yAxis;
    this.yScale = yScale;
    this.xScale = xScale;    
    this.svg = svg;

    // filter, aggregate, modify data
    this.wrangleData(null);

    // call the update method
    this.updateVis();
}


/**
 * Method to wrangle the data. In this case it takes an options object
 * @param _filterFunction - a function that filters data or "null" if none
 */
AgeVis.prototype.wrangleData= function(_filterFunction){

    // displayData should hold the data which is visualized
    this.displayData = this.filterAndAggregate(_filterFunction);

    //// you might be able to pass some options,
    //// if you don't pass options -- set the default options
    //// the default is: var options = {filter: function(){return true;} }
    //var options = _options || {filter: function(){return true;}};





}



/**
 * the drawing function - should use the D3 selection, enter, exit
 */
AgeVis.prototype.updateVis = function(){

    // Dear JS hipster,
    // you might be able to pass some options as parameter _option
    // But it's not needed to solve the task.
    // var options = _options || {};


    // TODO: implement...
    // TODO: ...update scales
    // TODO: ...update graphs
    var that = this;
    svg = this.svg;

    // TODO: implement update graphs (D3: update, enter, exit)

    that.yScale.domain([d3.max(this.displayData, function(d) { return d.age; }), 0]);    
    that.xScale.domain([0, d3.max(this.displayData, function(d) { return d.count; })]);    

    area = d3.svg.area()
        .x(function(d) { return that.xScale(d.count);  })
        .y0(that.h)
        .y1(function(d) { return that.yScale(d.age); });

    svg.append("path")
        .datum(this.displayData)
        .attr("class", "area")
        .attr("d", area);

    d3.select('.y-age')
        .call(that.yAxis);




}


/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
AgeVis.prototype.onSelectionChange= function (selectionStart, selectionEnd){
    filterByDate = function() { 
        return true; 
    };

    // TODO: call wrangle function

    this.updateVis();


}


/*
*
* ==================================
* From here on only HELPER functions
* ==================================
*
* */



/**
 * The aggregate function that creates the counts for each age for a given filter.
 * @param _filter - A filter can be, e.g.,  a function that is only true for data of a given time range
 * @returns {Array|*}
 */
AgeVis.prototype.filterAndAggregate = function(_filter){
    filterData = this.data;

    // Set filter to a function that accepts all items
    // ONLY if the parameter _filter is NOT null use this parameter
    // var filter = function(){return true;}
    // if (_filter != null){
    //     filter = _filter;
    // }
    // //Dear JS hipster, a more hip variant of this construct would be:
    var filter = _filter || function(){return true;}

    var that = this;

    // create an array of values for age 0-100
    var res = d3.range(100).map(function () {
        return 0;
    });
    for (var i=0;i<filterData.length;i++) {
        if (filter(filterData[0])) {
            for (var v=0;v<100;v++) {
                if (!isNaN(filterData[i].ages[v])) { 
                    res[v] += filterData[i].ages[v];
                }
            }
        }
    }
    upData = [];
    d3.map(res, function(d,i){
        upData.push({ age : i, count : d });
    });

    // accumulate all values that fulfill the filter criterion

    // TODO: implement the function that filters the data and sums the values

    return upData;

}




