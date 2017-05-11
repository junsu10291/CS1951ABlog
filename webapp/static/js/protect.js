/////////////////////////////////////
// Step 1: Write accessor functions //
//////////////////////////////////////

// Accessor functions for the four dimensions of our data
// For each of these, assume that d looks like the following:
// {"name": string, "income": number, "lifeExpectancy": number,
//  "population": number, "region": string}
glodata = [];

function x(d) {
  return d.x * 27 + 670
    // Return nation's income
}
function y(d) {
  return d.y * 15 + 400
    // Return nation's lifeExpectancy
}
function radius(d) {
  return d.count
    // Return nation's population
}
function color(d) {
  return d.label
    // Return nation's region
}
function name(d) {
  return d.name
    // Return nation's name
}

function kind(d) {
  return d.categories
}

function id(d) {
  return d.id
}

//////////////
// Provided //
//////////////
console.log('hey')
// Chart dimensions
var margin = {top: 19.5, right: 19.5, bottom: 19.5, left: 39.5};
var width = 1300 - margin.right;
var height = 800 - margin.top - margin.bottom;

qcluster = 12

// Various scales
var xScale = d3.scaleLinear().domain([-25, 25]).range([0, width]),
    yScale = d3.scaleLinear().domain([-24, 24]).range([height, 0]),
    radiusScale = d3.scaleSqrt().domain([100, 6414]).range([0, 40]),
    colorScale = d3.scaleOrdinal(d3.schemeCategory20);

//The x & y axes
var xAxis = d3.axisBottom(xScale).ticks(12, d3.format(",d")),
    yAxis = d3.axisLeft(yScale);

// Create the SVG container and set the origin
var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
   .attr("class", "axis")
   .attr("transform", "translate(0," + height+ ")")
   .call(xAxis);

svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0,0)")
    .call(yAxis);

cluster ={};
// Load the data.

console.log(document.location.pathname)
d3.json("../data/cluster.json", function(data){
  for(i=0;i<20;i++){
    key = String(Object.keys(data[i]));
    value = String(Object.values(data[i]));
    console.log(key)
    console.log(value)
    cluster[key] = value;
    //console.log(Object.values(data[i]))
    //cluster_name[parseInt(Object.keys(data[i]))] = String(Object.values(data[i]))
  
// Load the data.{{url_for('static', filename='data/data.json')}}
  d3.json("../data/data.json", function(data) {

    function interpolateData(point) {
      return data.map(function(d) {
        return {
          name: d.name,
          label: d.label,
          x: d.x,
          y: d.y,
          categories: d.categories,
          count: d.review_count,
          id: d.busi
        };
      })
    }

    function order(a, b) {
      return radius(b) - radius(a);
    }

    // console.log(interpolateData(data))

    // console.log(data[0])
    // console.log(x(data[0]))
    var dot = svg.append("g");
       //console.log(interpolateData(data); 

       dot.selectAll("circle")
        .data(interpolateData(data))
        .enter().append("circle")
        .attr("class", "dot")
        .attr("id", function(d) { return id(d); })
        .attr("cx", function(d) { return x(d); })
        .attr("cy", function(d) { return y(d); })
        .attr("r", function(d) { return radiusScale(radius(d)); })
        .style("fill", function(d) { 
          return colorScale(color(d)); })
        .sort(order)
        .append("title")
        .text(function(d){
          if(color(d)==qcluster){
            return name(d);
          }else{
            return cluster[String(color(d))]; 
        
          }
    });

    console.log("hello")

    d3.json("../data/user.json", function(data) {
      glodata = data
    });
  });
}

});

function onIdSearch() {
        busiId = document.getElementById("user").value
        console.log(busiId)
        ratedList = glodata[busiId]

        if (ratedList != undefined) {
            console.log(ratedList)
            console.log(ratedList.length)
          //d3.selectAll("circle").style("fill", "white").attr("stroke-opacity", 0.9);
          for (let i = 0; i < ratedList.length; i++) {
            console.log('hhelasdfasdfsao')
            console.log(ratedList)
            console.log(ratedList[i])
            d3.select("circle[id='"+ratedList[i]+"']").attr("r", 10).style("fill", "yellow");
            setInterval(function (){
              d3.select("circle[id='"+ratedList[i]+"']")
                .transition().duration(100).attr("display", "none")
                .transition().duration(100).attr("display", "show");
                //.transition().duration(100).attr("r", 9)
                //.transition().duration(100).attr("r", 5);
              }, 100);
            //document.getElementById(ratedList[i]).style("fill", "yellow").attr("r", 5);
            //d3.select("#"+ratedList[i]).style("fill", "yellow").attr("r", 5);
          }
        }
      }





// d3.json("../data/nations.json", function(nations) {

//   /////////////////////////////////////////
//   // Functions provided for your utility //
//   /////////////////////////////////////////

//   // A bisector since many nation's data is sparsely-defined.
//   // We provide this to make it easier to linearly interpolate between years.
//   var bisect = d3.bisector(function(d) { return d[0]; });

//   // Interpolates the dataset for the given (fractional) year.
//   function interpolateData(year) {
//     return nations.map(function(d) {
//       return {
//         name: d.name,
//         region: d.region,
//         income: interpolateValues(d.income, year),
//         population: interpolateValues(d.population, year),
//         lifeExpectancy: interpolateValues(d.lifeExpectancy, year)
//       };
//     });
//   }

//   function interpolateValues(values, year) {
//     var i = bisect.left(values, year, 0, values.length - 1),
//         a = values[i];
//     if (i > 0) {
//       var b = values[i - 1],
//           t = (year - a[0]) / (b[0] - a[0]);
//       return a[1] * (1 - t) + b[1] * t;
//     }
//     return a[1];
//   }

//   ///////////////////////
//   // Step 4: Plot dots //
//   ///////////////////////

//   // Add a dot per nation. Initialize the data at 1800, and set the colors.
//   var dot = svg.append("g");
//        console.log(interpolateData(1800));
       
//        dot.selectAll("circle")
//         .data(interpolateData(1800))
//         .enter().append("circle")
//         .attr("class", "dot")
//         .attr("cx", function(d) { return xScale(x(d)); })
//         .attr("cy", function(d) { return yScale(y(d)); })
//         .attr("r", function(d) { return radiusScale(radius(d)); })
//         .style("fill", function(d) { 
//           return colorMap(color(d)); })
//         .sort(order);

//   ///////////////////////////////////
//   // Step 5: Add fluff and overlay //
//   ///////////////////////////////////

//   // Add a title
//   dot.selectAll("circle")
//      .data(interpolateData(1800).sort(order))
//      .append("title")
//      .text(function (d) {
//       return key(d); 
//      });

//   // Add an overlay for the year label.
//   var box = bigyear.node().getBBox();
//   var overlay = svg.append("rect")
//                    .attr("x", box.x)
//                    .attr("y", box.y)
//                    .attr("width", box.width)
//                    .attr("height", box.height)
//                    .attr("class", "overlay");

//   ////////////////////////
//   // Step 6: Transition //
//   ////////////////////////

//   overlay.on("mouseover", mouseoverTwo)

//   function mouseoverTwo() {
//     svg.transition()
//     bigyear.attr("class", "year label active")
//     enableInteraction();
//   }

//   // Start a transition that interpolates the data based on year.
//   svg.transition()
//       .duration(5000)
//       .ease(d3.easeLinear)
//       .tween("year", tweenYear)
//       .on("end", enableInteraction);

 

//   // Positions the dots based on data.
//   function position(dot) {
//     dot .attr("cx", function(d) { return xScale(x(d)); })
//         .attr("cy", function(d) { return yScale(y(d)); })
//         .attr("r", function(d) { return radiusScale(radius(d)); });
//   }

//   // Defines a sort order so that the smallest dots are drawn on top.
 

//   // After the transition finishes, you can mouseover to change the year.
//   function enableInteraction() {
//     // Create a year scale
//     var yearScale = (2009 - 1800) / box.width;

  
//     var polydata = interpolateData(2009);
//     console.log(polydata)
//     var sites = voronoi.polygons(polydata)

//     var polygon = svg.insert("g", ".axis")
//                      .attr("class", "polygons")
//                      .selectAll("path")
//                      .data(sites)
//                      .enter().append("path")
//                      .call(drawPolygons);

//     polygon.append("title")

//     function drawPolygons(polygon) {
//         polygon.attr("d", function(d) { return d ? "M" + d.join("L") + "Z" : null; })
//                .style("fill", "none")
//                .style("pointer-events", "all");
//        polygon.select("title").text(function(d) { return key(d.data)})

//      }

//     // For the year overlay, add mouseover, mouseout, and mousemove events
//     // that 1) toggle the active class on mouseover and out and 2)
//     // change the displayed year on mousemove.

//     overlay
//         .on("mouseover", mouseover)
//         .on("mouseout", mouseout)
//         .on("mousemove", mousemove)
//         .on("touchmove", mousemove);

//     function mouseover() {
//       bigyear.attr("class", "year label active");
//     }

//     function mouseout() {
//       bigyear.attr("class", "year label");
//     }

//     function mousemove() {
//       var point = d3.mouse(this);
//       var t =  1800 + yearScale * (point[0] - 512) + 1;
      
//       dot.selectAll("circle")
//         .data(interpolateData(t))
//         .attr("class", "dot")
//         .attr("cx", function(d) { return xScale(x(d)); })
//         .attr("cy", function(d) { return yScale(y(d)); })
//         .attr("r", function(d) { return radiusScale(radius(d)); })
//         .style("fill", function(d) { 
//           return colorMap(color(d)); })
//         .sort(order);

//       dot.selectAll("circle")
//         .data(interpolateData(t).sort(order))
//         .select("title")
//         .text(function(d) { return key(d);});

//       bigyear.text(t);

//       var sites = voronoi.polygons(interpolateData(t))

//       polygon.data(sites).call(drawPolygons);
//     }
//   }

//   // Tweens the entire chart by first tweening the year, and then the data.
//   // For the interpolated data, the dots and label are redrawn.
//   function tweenYear() {
//     var year = d3.interpolateNumber(1800, 2009);
//     return function(t) { 
//       dot.selectAll("circle")
//         .data(interpolateData(year(t)))
//         .attr("class", "dot")
//         .attr("cx", function(d) { return xScale(x(d)); })
//         .attr("cy", function(d) { return yScale(y(d)); })
//         .attr("r", function(d) { return radiusScale(radius(d)); })
//         .style("fill", function(d) { 
//           return colorMap(color(d)); })
//         .sort(order);

//       dot.selectAll("circle")
//         .data(interpolateData(t).sort(order))
//         .select("title")
//         .text(function(d) { return key(d);});

//       bigyear.text(year(t)); 
//     }
//   }
// });

