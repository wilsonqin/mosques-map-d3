/*
 * By Wilson Qin - Mapping the Mosques of the World with d3
 */

var width = 720,
    height = 540;

// Create an SVG area (width: 1000px, height: 600px)
var svg = d3.select("#chart-area").append("svg")
    .attr("width", width)
    .attr("height", height);

var display = d3.select("#display-area")
  .attr("width", width)
  .attr("max-width", width)
  .attr("height", height)
  .attr("max-height", height);

//Create a mercator projection and specify it in a new geo path generator
var projection = d3.geo.conicEquidistant()
  .scale(140)
  .center([80,0]);

// Load data parallel
queue()
   .defer(d3.json, "data/world.json")
   .defer(d3.json, "data/data.json")
   .await(createVisualization);

function createVisualization(error, world, mdata) {
  // Convert the TopoJSON to GeoJSON
  var world = topojson.feature(world, world.objects.countries).features;

  // Render the world atlas by using the path generator
  var path = d3.geo.path()
    .projection(projection);

  svg.selectAll("path")
    .data(world)
    .enter()
      .append("path")
      .attr("d", path)
      .attr("stroke", 'black')
      .attr("stroke-width", 2)
      .attr("fill", "none");

  var mosques =  mdata.mosques;
  mosques.forEach(function(d, i){
    d.longitude = d.loc[1];
    d.latitude = d.loc[0];
  });

  console.log(mosques);

  var circles = svg.selectAll("circle")
    .data(mosques)
    .enter()
    .append("circle")
    .attr("class", "circle")
    .attr("r", 10)
    .attr("fill", "blue")
    .attr("stroke", "black")
    .attr("stroke-width", 1.5)
    //.attr("fill", function(d){ return (d.country === "United States") ? "blue" : 'red'; });
    .attr("transform", function(d) {
      return "translate(" + projection([d.longitude, d.latitude]) + ")";
    })
    .on('click', function(d){
      display.html("<div class='fact'>"+
        "<h2>"+d.name+"</h2>"+ 
        "<p>"+d.city+", " + d.country + "</p>" +
        "<img src='data/img/"+d.filename[0]+"'/></div>");
      
      d3.select(".fact").attr("width", width).attr('height', height);
    });


  // circles.append("title")
  //   .text(function(d) { return d.name; });
}