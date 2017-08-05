
var width = 960,
    height = 500;

var projection = d3.geo.naturalEarth()
    .scale(167)
    .translate([width / 2, height / 2])
    .precision(0.1);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var areas=["FR", "DE"];
var areadata={};
_.each(areas, function(a) {
  areadata[a]=a.charCodeAt(0);
});

var color = d3.scale.quantize().range([
            "rgb(198,219,239)",
            "rgb(158,202,225)",
            "rgb(107,174,214)",
            "rgb(66,146,198)",
            "rgb(33,113,181)",
            "rgb(8,81,156)",
            "rgb(8,48,107)"]);

color.domain(d3.extent(_.toArray(areadata)));

d3.json("data/countries_topo.json", function(error, countries) {
  console.log(countries);
  console.log(topojson.feature(countries, countries.objects.countries_min).features);

  svg.selectAll(".countries")
      .data(topojson.feature(countries, countries.objects.countries_min).features)
    .enter().append("path")
      .attr("class", function(d) { console.log(d); return d.properties.name; })
      .attr("d", path)
      .style("fill", function(d) {
        var value = areadata[d.properties.iso_code];
        if (value) {
                return color(value);
        } else {
                return "#AAA";
        }
      })
      .append("svg:title")
            .attr("transform", function (d) { return "translate(" + path.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .text(function (d) { return d.name; });
  svg.append("path")
      .datum(topojson.mesh(countries, countries.objects.countries_min))
      .attr("class", "mesh")
      .attr("d", path);
});
