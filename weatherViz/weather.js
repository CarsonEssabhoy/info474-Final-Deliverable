
var svg = d3.select('svg');

// Variables for the chosen city
city = 'Charlotte, North Carolina';
file = 'CLT.csv';

// Variables for the checkboxes
actual_average = true;
actual_min = false;
actual_max = false;
average_min = false;
average_max = false;
record_min = false;
record_max = false;

// For when the user changes the city they are looking at
function onCategoryChanged() {
    var select = d3.select('#categorySelect').node();
    // Get current value of select element
    city = select.options[select.selectedIndex].text;

    //Get value in select element
    file = select.options[select.selectedIndex].value + '.csv';

    // Update chart with the selected city and file
    updateChart();
}

// For all checkboxes
function actualAverage() {
    actual_average = document.getElementById('actual_average').checked;
    if(actual_average) {
        showActualAverage();
    } else {
        svg.selectAll('.actual_average').remove()
    }
}

function actualMin() {
    actual_min = document.getElementById('actual_min').checked;
    if(actual_min) {
        showActualMin();
    } else {
        svg.selectAll('.actual_min').remove()
    }
}

function actualMax() {
    actual_max = document.getElementById('actual_max').checked;
    if(actual_max) {
        showActualMax();
    } else {
        svg.selectAll('.actual_max').remove()
    }
}

function averageMin() {
    average_min = document.getElementById('average_min').checked;
    if(average_min) {
        showAverageMin();
    } else {
        svg.selectAll('.average_min').remove()
    }
}

function averageMax() {
    average_max = document.getElementById('average_max').checked;
    if(average_max) {
        showAverageMax();
    } else {
        svg.selectAll('.average_max').remove()
    }
}

function recordMin() {
    record_min = document.getElementById('record_min').checked;
    if(record_min) {
        showRecordMin();
    } else {
        svg.selectAll('.record_min').remove()
    }
}

function recordMax() {
    record_max = document.getElementById('record_max').checked;
    if(record_max) {
        showRecordMax();
    } else {
        svg.selectAll('.record_max').remove()
    }
}

// Restarts the Visualization
function restartViz() {
    updateChart();
}

// Hand code the svg dimensions, you can also use +svg.attr('width') or +svg.attr('height')
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

// Define a padding object
// This will space out the trellis subplots
var padding = {t: 100, r: 20, b: 60, l: 60};

// Compute the dimensions of the trellis plots, assuming a 2x2 layout matrix.
trellisWidth = svgWidth * 0.9 - padding.l - padding.r;
trellisHeight = svgHeight * 0.9 - padding.t - padding.b;

// As an example for how to layout elements with our variables
// Lets create .background rects for the trellis plots
svg.selectAll('.background')
    .data(['A']) // dummy data
    .enter()
    .append('rect') // Append 4 rectangles
    .attr('class', 'background')
    .attr('width', trellisWidth) // Use our trellis dimensions
    .attr('height', trellisHeight)
    .attr('transform', function(d, i) {
        // Position based on the matrix array indices.
        // i = 1 for column 1, row 0)
        var tx = (i % 2) * (trellisWidth + padding.l + padding.r) + padding.l;
        var ty = Math.floor(i / 2) * (trellisHeight + padding.t + padding.b) + padding.t;
        return 'translate('+[tx, ty]+')';
    });

var parseDate = d3.timeParse('%Y-%m-%d');
// To speed things up, we have already computed the domains for your scales
var dateDomain = [new Date(2014, 6), new Date(2015, 6)];
var tempDomain = [-30, 125];


var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-12, 0])
    .html(function(d) {
        return "<h5>"+d['name']+"</h5>";
    });
svg.call(toolTip);

// **** How to properly load data ****
function updateChart() {
    d3.csv(file).then(function(dataset) {
        //Removes original chart
        svg.selectAll('.city').remove()

        cityData = dataset;

        // Parses through original data
        for(let i = 0; i < dataset.length; i++) {
            dataset[i].date = parseDate(dataset[i].date)
            
        }

        // Creates groups for each company
        cityGroup = svg.append('g')
            .attr('class', 'city')
            .attr('transform', 'translate('+ 60 + ',' + 100 + ')')

        // Creates X Scale
        xScale = d3.scaleTime()
            .domain(dateDomain)
            .range([0, trellisWidth])
        
        // Creates Y Scale
        yScale = d3.scaleLinear()
            .domain(tempDomain)
            .range([trellisHeight, 0])

        // Create Grids
        var xGrid = d3.axisTop(xScale)
            .tickSize(-trellisHeight, 0, 0)
            .tickFormat('');

        var yGrid = d3.axisLeft(yScale)
            .tickSize(-trellisWidth, 0, 0)
            .tickFormat('')

        svg.selectAll('.city')
            .append('g')
            .call(xGrid)
            .attr('class', 'x grid')

        svg.selectAll('.city')
            .append('g')
            .call(yGrid)
            .attr('class', 'y grid')


        // Goes through each checkbox value to determine what lines to put on the chart
        if(actual_average) {
            showActualAverage();
        }
        if(actual_min) {
            showActualMin();
        }
        if(actual_max) {
            showActualMax();
        }
        if(average_min) {
            showAverageMin();
        }
        if(average_max) {
            showAverageMax();
        }
        if(record_min) {
            showRecordMin();
        }
        if(record_max) {
            showRecordMax();
        }

        // Create X Axis
        var xAxis = d3.axisBottom(xScale);

        // Create Y Axis
        var yAxis = d3.axisLeft(yScale);

        // Add Axis to each chart
        svg.selectAll('.city')
            .append('g')
            .call(xAxis)
            .attr('transform', 'translate('+ 0 + ',' + trellisHeight + ')')
            .attr('class', 'xAxis')

        svg.selectAll('.city')
            .append('g')
            .call(yAxis)
            .attr('class', 'yAxis')
        

        // Create Axis Labels
        svg.selectAll('.xAxis')
            .append('text')
            .text('Date (by Month)')
            .attr('class', 'x axis-label')
            .style('fill', '#333')
            .style('display', 'center')
            .attr('x', 415)
            .attr('y', 35)

        svg.selectAll('.yAxis')
            .append('text')
            .text('Average Temperature per Day (°F)')
            .attr('class', 'y axis-label')
            .style('fill', '#333')
            .style('display', 'center')
            .attr('x', -230)
            .attr('y', -30)
            .attr('transform', "rotate(-90)")

        //Creates chart header
        svg.selectAll('.city')
            .append('text')
            .attr('class', 'city-label')
            .attr('x', 415)
            .attr('y', -35)
            .text("Temperature per day in " + city)
    });
}


// Plots the actual average temperature for the dataset
function showActualAverage() {
    // Creates Line Interpolator
    var lineInterpolate = d3.line()
    .x(function(d){
        return xScale(d.date)
    })
    .y(function(d){
        return yScale(d.actual_mean_temp)
    })

   // Creates path and data points for the company line
   var temps = cityGroup.selectAll('.actual_average')
       .data(cityData)
       .enter()
       .append('circle')
       .attr('class', 'actual_average')
       .attr('cx', d=> xScale(d.date))
       .attr('cy', d=> yScale(d.actual_mean_temp))
       .attr('r', 3)
       .attr('opacity', 0)
       .on('mouseover', function(d) {
           var date = d.date + "";
           date = date.substring(0, 15);
           return toolTip.show(d.actual_mean_temp + "°F on " + date);
       })
       .on('mouseout', toolTip.hide)

   var tempPath = cityGroup.append('path')
       .attr('class', 'actual_average')
       .attr('d', lineInterpolate(cityData))
       .attr('stroke', 'black')

   const length = tempPath.node().getTotalLength();

   tempPath.attr("stroke-dasharray", length + " " + length)
        .attr("stroke-dashoffset", length)
        .transition()
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0)
        .duration(8000)
}


// Plots the actual min temperature for the dataset
function showActualMin() {
    // Creates Line Interpolator
    var lineInterpolate = d3.line()
    .x(function(d){
        return xScale(d.date)
    })
    .y(function(d){
        return yScale(d.actual_min_temp)
    })

   // Creates path and data points for the company line
   var temps = cityGroup.selectAll('.actual_min')
       .data(cityData)
       .enter()
       .append('circle')
       .attr('class', 'actual_min')
       .attr('cx', d=> xScale(d.date))
       .attr('cy', d=> yScale(d.actual_min_temp))
       .attr('r', 3)
       .attr('opacity', 0)
       .on('mouseover', function(d) {
           var date = d.date + "";
           date = date.substring(0, 15);
           return toolTip.show(d.actual_min_temp + "°F on " + date);
       })
       .on('mouseout', toolTip.hide)


   var tempPath = cityGroup.append('path')
       .attr('class', 'actual_min')
       .attr('d', lineInterpolate(cityData))
       .attr('stroke', 'green')

   const length = tempPath.node().getTotalLength();

   tempPath.attr("stroke-dasharray", length + " " + length)
   .attr("stroke-dashoffset", length)
     .transition()
     .ease(d3.easeLinear)
     .attr("stroke-dashoffset", 0)
     .duration(8000)

}

// Plots the actual max temperature for the dataset
function showActualMax() {
    // Creates Line Interpolator
    var lineInterpolate = d3.line()
    .x(function(d){
        return xScale(d.date)
    })
    .y(function(d){
        return yScale(d.actual_max_temp)
    })

   // Creates path and data points for the company line
   var temps = cityGroup.selectAll('.actual_max')
        .data(cityData)
        .enter()
        .append('circle')
        .attr('class', 'actual_max')
        .attr('cx', d=> xScale(d.date))
        .attr('cy', d=> yScale(d.actual_max_temp))
        .attr('r', 3)
        .attr('opacity', 0)
        .on('mouseover', function(d) {
            var date = d.date + "";
            date = date.substring(0, 15);
            return toolTip.show(d.actual_max_temp + "°F on " + date);
        })
        .on('mouseout', toolTip.hide)


   var tempPath = cityGroup.append('path')
       .attr('class', 'actual_max')
       .attr('d', lineInterpolate(cityData))
       .attr('stroke', 'yellow')

   const length = tempPath.node().getTotalLength();

   tempPath.attr("stroke-dasharray", length + " " + length)
   .attr("stroke-dashoffset", length)
     .transition()
     .ease(d3.easeLinear)
     .attr("stroke-dashoffset", 0)
     .duration(8000)
}


// Plots the average min temperature for the dataset
function showAverageMin() {
    // Creates Line Interpolator
    var lineInterpolate = d3.line()
    .x(function(d){
        return xScale(d.date)
    })
    .y(function(d){
        return yScale(d.average_min_temp)
    })

   // Creates path and data points for the company line
   var temps = cityGroup.selectAll('.average_min')
       .data(cityData)
       .enter()
       .append('circle')
       .attr('class', 'average_min')
       .attr('cx', d=> xScale(d.date))
       .attr('cy', d=> yScale(d.average_min_temp))
       .attr('r', 3)
       .attr('opacity', 0)
       .on('mouseover', function(d) {
           var date = d.date + "";
           date = date.substring(0, 15);
           return toolTip.show(d.average_min_temp + "°F on " + date);
       })
       .on('mouseout', toolTip.hide)

    
   var tempPath = cityGroup.append('path')
       .attr('class', 'average_min')
       .attr('d', lineInterpolate(cityData))
       .attr('stroke', 'steelblue')

   const length = tempPath.node().getTotalLength();

   tempPath.attr("stroke-dasharray", length + " " + length)
   .attr("stroke-dashoffset", length)
     .transition()
     .ease(d3.easeLinear)
     .attr("stroke-dashoffset", 0)
     .duration(8000)
}


// Plots the average max temperature for the dataset
function showAverageMax() {
    // Creates Line Interpolator
    var lineInterpolate = d3.line()
    .x(function(d){
        return xScale(d.date)
    })
    .y(function(d){
        return yScale(d.average_max_temp)
    })

   // Creates path and data points for the company line
   var temps = cityGroup.selectAll('.average_max')
       .data(cityData)
       .enter()
       .append('circle')
       .attr('class', 'average_max')
       .attr('cx', d=> xScale(d.date))
       .attr('cy', d=> yScale(d.average_max_temp))
       .attr('r', 3)
       .attr('opacity', 0)
       .on('mouseover', function(d) {
           var date = d.date + "";
           date = date.substring(0, 15);
           return toolTip.show(d.average_max_temp + "°F on " + date);
       })
       .on('mouseout', toolTip.hide)


   var tempPath = cityGroup.append('path')
       .attr('class', 'average_max')
       .attr('d', lineInterpolate(cityData))
       .attr('stroke', 'orange')

   const length = tempPath.node().getTotalLength();

   tempPath.attr("stroke-dasharray", length + " " + length)
   .attr("stroke-dashoffset", length)
     .transition()
     .ease(d3.easeLinear)
     .attr("stroke-dashoffset", 0)
     .duration(8000)
}

// Plots the record min temperature for the dataset
function showRecordMin() {
    // Creates Line Interpolator
    var lineInterpolate = d3.line()
    .x(function(d){
        return xScale(d.date)
    })
    .y(function(d){
        return yScale(d.record_min_temp)
    })

   // Creates path and data points for the company line
   var temps = cityGroup.selectAll('.record_min')
       .data(cityData)
       .enter()
       .append('circle')
       .attr('class', 'record_min')
       .attr('cx', d=> xScale(d.date))
       .attr('cy', d=> yScale(d.record_min_temp))
       .attr('r', 3)
       .attr('opacity', 0)
       .on('mouseover', function(d) {
           var date = d.date + "";
           date = date.substring(0, 15);
           return toolTip.show(d.record_min_temp + "°F on " + date);
       })
       .on('mouseout', toolTip.hide)


   var tempPath = cityGroup.append('path')
       .attr('class', 'record_min')
       .attr('d', lineInterpolate(cityData))
       .attr('stroke', 'purple')

   const length = tempPath.node().getTotalLength();

   tempPath.attr("stroke-dasharray", length + " " + length)
   .attr("stroke-dashoffset", length)
     .transition()
     .ease(d3.easeLinear)
     .attr("stroke-dashoffset", 0)
     .duration(8000)
}


// Plots the record max temperature for the dataset
function showRecordMax() {
    // Creates Line Interpolator
    var lineInterpolate = d3.line()
    .x(function(d){
        return xScale(d.date)
    })
    .y(function(d){
        return yScale(d.record_max_temp)
    })

   // Creates path and data points for the company line
   var temps = cityGroup.selectAll('.record_max')
       .data(cityData)
       .enter()
       .append('circle')
       .attr('class', 'record_max')
       .attr('cx', d=> xScale(d.date))
       .attr('cy', d=> yScale(d.record_max_temp))
       .attr('r', 3)
       .attr('opacity', 0)
       .on('mouseover', function(d) {
           var date = d.date + "";
           date = date.substring(0, 15);
           return toolTip.show(d.record_max_temp + "°F on " + date);
       })
       .on('mouseout', toolTip.hide)


   var tempPath = cityGroup.append('path')
       .attr('class', 'record_max')
       .attr('d', lineInterpolate(cityData))
       .attr('stroke', 'red')

   const length = tempPath.node().getTotalLength();

   tempPath.attr("stroke-dasharray", length + " " + length)
   .attr("stroke-dashoffset", length)
     .transition()
     .ease(d3.easeLinear)
     .attr("stroke-dashoffset", 0)
     .duration(8000)
}

updateChart(file, city);