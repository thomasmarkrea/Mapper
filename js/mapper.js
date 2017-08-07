var width = 960;
var height = 500;

var select = d3.select('body')
  .append('select')
  .on('change', changeEvent);

var svg = d3.select("body")
    .append("svg")
    .attr("class", "map")
    .attr("width", width)
    .attr("height", height);

var projection = d3.geo.naturalEarth()
    .scale(167)
    .translate([width / 2, height / 2])
    .precision(0.1);

var path = d3.geo.path()
    .projection(projection);

d3.json("data/countries_topo.json", function(error, countries) {
  if(error) throw error;
  console.log(countries);

  svg.selectAll()
    .data(topojson.feature(countries, countries.objects.countries_min_fil).features)
    .enter()
    .append("path")
      .attr("class", function(d) { return d.properties.iso_code; })
      .attr("d", path);

  svg.append("path")
    .datum(topojson.mesh(countries, countries.objects.countries_min_fil, function(a, b) { return a !== b; }))
    .attr("class", "mesh")
    .attr("d", path);
});

d3.json('data/market_data.json', function(error, data) {
  if(error) throw error;
  console.log(data);

  var companies = d3.keys(data.companies);
  console.log(companies);

  select.selectAll('.options')
    .data(companies)
    .enter()
    .append('option')
      .property('value', function(d, i){ return d; })
      .text(function(d, i){ return d; });
});

function changeEvent(){
  console.log(d3.event);
  console.log(d3.event.target.value);
}
