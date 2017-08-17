// load data
d3.queue()
	.defer(d3.json, 'data/countries_topo.json')
	.defer(d3.json, 'data/market_data.json')
	.await(render);

function render(error, countries, market_data) {
  if(error) throw error;
  select(market_data);
  // map(countries);
}

function unique_array(json, key) {
  var unique_array = d3.set();

  json.each(function(v, k, m) {
    var map = d3.map(v);
    var set = d3.set(map.get(key));

    set.each(function(val) {
      unique_array.add(val);
    });
  });

  return unique_array;
}

function select(data) {
  var data_map = d3.map(data);

  var key = 'companies';
  var companies = unique_array(data_map, key);

  var select = d3.select('body')
    .append('select');

  select.selectAll('.options')
    .data(companies.values())
    .enter()
    .append('option')
      .property('value', function(d, i){ console.log(d); return d; })
      .text(function(d, i){ return d; });

  //
  // select.on('change', changeEvent);
  //
  // function changeEvent(){
  //   svg.selectAll('path')
  //     .style('fill', '#000');
  //
  //   companies.forEach(function(company, i){
  //     if(company.name == event.target.value){
  //       company.markets.forEach(function(market, i){
  //         var selector = '.'+market;
  //         svg.selectAll(selector)
  //           .style('fill', '#009cde');
  //       });
  //     }
  //   });
  // }
}

function map(countries) {
  console.log(countries);

  var width = 960;
  var height = 500;

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
}
