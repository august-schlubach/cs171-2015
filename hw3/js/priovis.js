PrioVis = function(_parentElement, _data, _metaData, _eventHandler){

    this.parentElement = _parentElement;
    this.data = _data;
    this.metaData = _metaData;
    this.eventHandler = _eventHandler;
    this.displayData = [];

    // variables for the comparison functionality
    this.saveStart = null;
    this.saveEnd = null;
    this.cacheData = d3.range(0,16). map(function(){return 0;});
    this.circleRadius = 0;

    // define all "constants" here
    this.margin = {top: 30, right: 20, bottom: 30, left: 80}
    this.h = 550;
    this.w = 850;
    this.duration = 300;

    this.initVis();
}

/**
 * Method that sets up the SVG and the variables
 */
PrioVis.prototype.initVis = function(){

    var yScale = d3.scale.linear()
        .range([290, 0]);

    var color = d3.scale.category20b();

    var xScale = d3.scale.ordinal()
        .rangeRoundBands([0, 750], .2, .2);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    var svg = d3.select(this.parentElement).append("svg")
        .attr('id', 'prioVis-svg')
        .attr("width", this.w)
        .attr("height", this.h)
      .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    svg.append("g")
        .attr("id", "prio-data-g");

    svg.append("g")
        .attr("id", "saved-prio-data-g");        
        
    svg.append("g")
        .attr("class", "x-prio axis")
        .attr("transform", "translate(0,290)");

    svg.append("g")
        .attr("class", "y-prio axis");
               
    // make these variables properties of the PrioVis object
    this.yAxis  = yAxis;
    this.xAxis  = xAxis;
    this.yScale = yScale;
    this.xScale = xScale; 
    this.color  = color;   
    this.svg    = svg;

    // filter, aggregate, modify data
    this.wrangleData(null);

    // call the update method
    this.updateVis();
}

/**
 * Method to wrangle the data. In this case it takes an options object
 * @param _filterFunction - a function that filters data or "null" if none
 */
PrioVis.prototype.wrangleData= function(_filterFunction){

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
PrioVis.prototype.updateVis = function(){

    // var options = _options || {};

    var that = this;
    svg = this.svg;

    that.xScale.domain(this.displayData.map(function(d) { return d.title; }));    
    var maxD = d3.max(this.displayData, function(d) { return d.total; });
    var maxC = d3.max(this.displayData, function(d) { return d.saved; });
    that.yScale.domain([0, Math.max(maxC,maxD)]);
    //that.yScale.domain([0, 900000]);
  

    var g = d3.select('#prio-data-g');
    var bar = g.selectAll(".bar")
        .data(that.displayData);

    bar.enter().append("rect")
        .attr("class", "bar")
        .attr("fill", function(d,i) { return that.color(i); })
        .attr("width", 40)
        .attr("height", function(d) { return 290-that.yScale(d.total); })
        .attr("x", function(d) { return that.xScale(d.title); } )
        .attr("y", function(d) { return that.yScale(d.total); } );
    bar.exit().remove();
    bar.transition()
        .duration(this.duration)
        .attr("y", function(d) { return that.yScale(d.total); })
        .attr("height", function(d) { return 290-that.yScale(d.total); });         


    var g = d3.select('#saved-prio-data-g');
    var circle = g.selectAll(".circle")
        .data(that.displayData);

    circle.enter().append("circle")
        .attr("class", "circle")
        .attr('r', this.circleRadius)
        .attr("cx", function(d) { return that.xScale(d.title) + 20; } )
        .attr("cy", function(d) { return that.yScale(d.saved); } );
    circle.exit().remove();
    circle.transition()
        .duration(this.duration)
        .attr('r', this.circleRadius)
        .attr("cy", function(d) { return that.yScale(d.saved); });


    d3.select('.y-prio')
        .transition().duration(this.duration).ease("sin-in-out")
        .call(that.yAxis);

    d3.select('.x-prio')
        .call(that.xAxis)        
        .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)" 
                });
}


/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
PrioVis.prototype.onSelectionChange= function (selectionStart, selectionEnd){
    filterByDate = function(date) { 
        if (!selectionStart) { return true };
        if ((date>=selectionStart) && (date<=selectionEnd)) {
            return true; 
        }
        else {
            return false;
        }
    };

    this.wrangleData(filterByDate);
    this.updateVis();
}


PrioVis.prototype.saveSelection = function (selectionStart, selectionEnd){
    this.saveStart = null;
    this.saveEnd   = null;
    this.cacheData = d3.range(0,16). map(function(){return 0;});
    this.wrangleData(filterByDate);       
    this.updateVis();  

    this.saveStart    = selectionStart;
    this.saveEnd      = selectionEnd;
    this.cacheData    = this.displayData;
    this.circleRadius = 5;
    this.wrangleData(filterByDate);
    this.updateVis();
}

PrioVis.prototype.clearSelection = function (){
    this.saveStart    = null;
    this.saveEnd      = null;
    this.cacheData    = d3.range(0,16). map(function(){return 0;});
    this.circleRadius = 0;    
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
PrioVis.prototype.filterAndAggregate = function(_filter){

    filterData = this.data;
    cacheData = this.cacheData;
    // Set filter to a function that accepts all items
    // ONLY if the parameter _filter is NOT null use this parameter
    var filter = _filter || function(){return true;}

    var displayMetaData = new Array();
    for (var x=0;x<16;x++) {
        displayMetaData.push(this.metaData.priorities[x]['item-title']);
    }

    // create an array of values for prio sums
    var res = d3.range(0,16). map(function(){return 0;})
    for (var i=0;i<filterData.length;i++) {
        if (filter(filterData[i].time)) {
            for (var v=0;v<16;v++) {
                key = 'sum(p' + v + ')';
                if (!isNaN(filterData[i].prio[v])) {                     
                    res[v] += filterData[i].prio[v];
                }
            }
        }
    }
    var aggregateData = new Array();
    for (var v=0;v<16;v++) {
        var saved;
        if (cacheData[v]) {
            saved = cacheData[v].saved;
        }
        else {
            saved = res[v];
        }
        aggregateData.push({ title: displayMetaData[v], total: res[v], saved: saved });
    }

    return aggregateData;
}




