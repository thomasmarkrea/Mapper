// TODO: use d3.dispatch to handle events?
//       https://bl.ocks.org/mbostock/5872848

// load data
d3.queue()
	.defer(d3.json, 'data/countries_topo.json')
	.defer(d3.json, 'data/market_data.json')
	.await(startApp);

// set up events
var dispatch = d3.dispatch('draw_map', 'draw_options', 'update');
dispatch.on('draw_options', drawOptions);
dispatch.on('draw_map', drawMap);
dispatch.on('update', update);


function startApp(error, countries, market_data) {
  if(error) throw error;
  // select(market_data);
  // map(countries);
  dispatch.call('draw_options', this, market_data);
  // dispatch.call('draw_map', this, countries);
}

function drawOptions(data) {
  // create map of our market data
  var data_map = d3.map(data);

  // loop through data and build 'select' elements
  var attribute_keys = set(data_map, 'key', null);

  attribute_keys.each(function(key) {
    var attribute_values = set(data_map, 'value', key);

    var select = d3.select('body')
      .append('select')
        .attr('id', key)
        .on('change', changeEvent);

    select.selectAll()
      .data(attribute_values.values())
      .enter()
      .append('option')
        .property('value', function(d){ return d; })
        .text(function(d){ return d; });
  });

  function changeEvent() {
    console.log(this);
    console.log(event);

    var field = event.srcElement.id;
    var target = event.target.value;

    console.log(field);
    console.log(target);

    clear_map();
    id_countries(data, target, key);

    // companies.forEach(function(company, i){
    //   if(company.name == event.target.value){
    //     company.markets.forEach(function(market, i){
    //       var selector = '.'+market;
    //       svg.selectAll(selector)
    //         .style('fill', '#009cde');
    //     });
    //   }
    // });
  }
}

function set(data, type, key) {
  console.log(data);
  console.log(type);
  console.log(key);

  var set = d3.set();

  data.each(function(value) {
    var local_set = d3.set();
    if(type=='key') local_set = fetchAttributeKeys(value);
    if(type=='value') local_set = fetchAttributeValues(value, key);

    local_set.each(function(value) {
      set.add(value);
    });
  });

  console.log(set);
  return set;
}

function fetchAttributeKeys(value) {
  console.log(value);

  var attributes = value.attributes;
  var keys = d3.keys(attributes);
  var attribute_keys = d3.set(keys);

  console.log(attribute_keys);
  return attribute_keys;
}

function fetchAttributeValues(value, key) {
  console.log(value);
  console.log(key);

  var attributes = value.attributes;
  var attribute_values = d3.set(attributes[key]);

  console.log(attribute_values);
  return attribute_values;
}

function clear_map() {
  var svg = d3.select('svg');

  svg.selectAll('path')
    .style('fill', '#000');
}

function id_countries(data, target, key) {
  countries = d3.set();

  data.each(function(value) {
    var set = d3.set(data[key]);
    if(set.has(target)) {

      countries.add()
    }
  })
}

function drawMap(countries) {
  var width = 960;
  var height = 500;

  var svg = d3.select('body')
      .append('svg')
      .attr('class', 'map')
      .attr('width', width)
      .attr('height', height);

  var projection = d3.geoNaturalEarth()
      .scale(167)
      .translate([width / 2, height / 2])
      .precision(0.1);

  var path = d3.geoPath()
      .projection(projection);

  var features = topojson.feature(countries, countries.objects.countries_min_fil).features;
  var mesh = topojson.mesh(countries, countries.objects.countries_min_fil, function(a, b) { return a !== b; });

  svg.selectAll()
    .data(features)
    .enter()
    .append('path')
      .attr('class', function(d) { return d.properties.iso_code; })
      .attr('d', path);

  svg.append('path')
    .datum(mesh)
    .attr('class', 'mesh')
    .attr('d', path);
}
