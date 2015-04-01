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
 * CountVis object for HW3 of CS171
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @param _eventHandler -- the Eventhandling Object to emit data to (see Task 4)
 * @constructor
 */
CountVis = function(_parentElement, _data, _metaData, _eventHandler){
    this.parentElement = _parentElement;
    this.data = _data;
    this.metaData = _metaData;
    this.eventHandler = _eventHandler;
    this.displayData = [];


    // TODO: define all "constants" here
    this.margin = {top: 30, right: 20, bottom: 30, left: 80}
    this.h = 330;
    this.w = 850;

    this.initVis();
}


/**
 * Method that sets up the SVG and the variables
 */
CountVis.prototype.initVis = function(){

    var that = this; // read about the this

    //TODO: implement here all things that don't change
    //TODO: implement here all things that need an initial status
    // Examples are:
    // - construct SVG layout
    // - create axis
    // -  implement brushing !!
    // --- ONLY FOR BONUS ---  implement zooming


    xScale = d3.time.scale()
        .range([0, 750]);

    yScale = d3.scale.linear()
        .range([280, 0]);

    xAxis = d3.svg.axis()
        .scale(xScale)
        .ticks(8)
        .orient("bottom");

    yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");


    svg = d3.select(this.parentElement).append("svg")
        .attr('id', 'countVis-svg')
        .attr("width", this.w)
        .attr("height", this.h)
      .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0,280)")
      .append("text")
        .attr("x", 750)
        .attr("y", 290)      
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Date");

    svg.append("g")
        .attr("class", "y axis")
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Count");


    brush = d3.svg.brush()
        .on('brush', function() {
            that.eventHandler['empty'] = that.brush.empty();
            that.eventHandler['extent'] = that.brush.extent();
        });

    svg.append("g")
     .attr("class", "brush");


    this.xAxis = xAxis;
    this.yAxis = yAxis;
    this.xScale = xScale;
    this.yScale = yScale;
    this.svg = svg;
    this.brush = brush

    // //TODO: implement the slider -- see example at http://bl.ocks.org/mbostock/6452972
    this.addSlider(this.svg)

    // filter, aggregate, modify data
    this.wrangleData();

    // call the update method
    this.updateVis();
}



/**
 * Method to wrangle the data. In this case it takes an options object
  */
CountVis.prototype.wrangleData= function(){

    // displayData should hold the data which is visualized
    // pretty simple in this case -- no modifications needed
    this.displayData = this.data;
    //console.log(this.displayData);
}

/**
 * the drawing function - should use the D3 selection, enter, exit
 * @param _options -- only needed if different kinds of updates are needed
 */
CountVis.prototype.updateVis = function(){
    var that = this;
    svg = this.svg;

    // TODO: implement update graphs (D3: update, enter, exit)

    that.xScale.domain(d3.extent(this.displayData, function(d) { return d.time; }));
    that.yScale.domain([0, d3.max(this.displayData, function(d) { return d.count; })]);    

    area = d3.svg.area()
        .x(function(d) { return that.xScale(d.time);  })
        .y0(280)
        .y1(function(d) { return that.yScale(d.count); });

    svg.append("path")
        .datum(this.displayData)
        .attr("class", "area")
        .attr("d", area);

    d3.select('.x')
        .call(this.xAxis);

    d3.select('.y')
        .call(this.yAxis);

    // handle brushing
    this.brush.x(this.xScale);
    svg.select('.brush')
        .call(this.brush)
      .selectAll('rect')
        .attr('height', 280)
}

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
CountVis.prototype.onSelectionChange= function (selectionStart, selectionEnd){

    // TODO: call wrangle function

    // do nothing -- no update when brushing


}


/*
 *
 * ==================================
 * From here on only HELPER functions
 * ==================================
 *
 * */





/**
 * creates the y axis slider
 * @param svg -- the svg element
 */
CountVis.prototype.addSlider = function(svg){
    var that = this;

    // TODO: Think of what is domain and what is range for the y axis slider !!
    var sliderScale = d3.scale.linear().domain([0,200]).range([0,200])

    var sliderDragged = function(){
        var value = Math.max(0, Math.min(200,d3.event.y));

        var sliderValue = sliderScale.invert(value);

        // TODO: do something here to deform the y scale
        //console.log("Y Axis Slider value: ", sliderValue);


        d3.select(this)
            .attr("y", function () {
                return sliderScale(sliderValue);
            })

        that.updateVis({});
    }
    var sliderDragBehaviour = d3.behavior.drag()
        .on("drag", sliderDragged)

    var sliderGroup = svg.append("g").attr({
        class:"sliderGroup",
        "transform":"translate("+'-80'+","+30+")"
    })

    sliderGroup.append("rect").attr({
        class:"sliderBg",
        x:5,
        width:10,
        height:200
    }).style({
        fill:"lightgray"
    })

    sliderGroup.append("rect").attr({
        "class":"sliderHandle",
        y:0,
        width:20,
        height:10,
        rx:2,
        ry:2
    }).style({
        fill:"#333333"
    }).call(sliderDragBehaviour)


}






