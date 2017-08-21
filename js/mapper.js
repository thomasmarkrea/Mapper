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

// dispatch events that render the app
function startApp(error, countries_data, market_data) {
  if(error) throw error;
  dispatch.call('draw_options', this, market_data);
  dispatch.call('draw_map', this, countries_data);
}

// render select elements
function drawOptions(data) {
  var data_map = d3.map(data);
  var attribute_keys = set(data_map, 'key', null);

  attribute_keys.each(function(key) {
    var attribute_values = set(data_map, 'value', key);

    var select = d3.select('body')
      .append('select')
        .attr('id', key)
        .on('change', function(){ dispatch.call('update', this, data_map); });

    select.selectAll()
      .data(attribute_values.values())
      .enter()
      .append('option')
        .property('value', function(d){ return d; })
        .text(function(d){ return d; });
  });
}

// create a set of values or keys from an object
function set(data, type, key) {
  var set = d3.set();

  data.each(function(value) {
    var local_set = d3.set();
    if(type=='key') local_set = fetchAttributeKeys(value);
    if(type=='value') local_set = fetchAttributeValues(value, key);

    local_set.each(function(value) {
      set.add(value);
    });
  });

  return set;
}

// returns keys from an object
function fetchAttributeKeys(value) {
  var attributes = value.attributes;
  var keys = d3.keys(attributes);
  var attribute_keys = d3.set(keys);

  return attribute_keys;
}

// returns values from an object
function fetchAttributeValues(value, key) {
  var attributes = value.attributes;
  var attribute_values = d3.set(attributes[key]);

  return attribute_values;
}

// clears map then colours selected countries
function update(data) {
  var field = d3.event.srcElement.id;
  var value = d3.event.target.value;
  var countries = id_countries(data, field, value);

  clear_map();
  colour_map(countries);
}

// returns all countries that match the selected option
function id_countries(data, field, value) {
  countries = d3.set();

  data.each(function(obj) {
    var set = d3.set(obj.attributes[field]);
    if(set.has(value)) countries.add(obj.iso_code);
  });

  return countries;
}

// resets all countries back to their default colour
function clear_map() {
  var svg = d3.select('svg');

  svg.selectAll('path')
    .style('fill', '#000');
}

// colours the selected countries
function colour_map(countries) {
  var svg = d3.select('svg');

  countries.each(function(country) {
    var selector = '.'+country;
    svg.selectAll(selector)
      .style('fill', '#009cde');
  });
}

// render map
function drawMap(data) {
  var width = 960;
  var height = 500;

  var zoom = d3.zoom()
      .on('zoom', zoomed);

  var svg = d3.select('body')
      .append('svg')
      .attr('class', 'map')
      .attr('width', width)
      .attr('height', height)
      .call(zoom);

  var g = svg.append('g');

  var projection = d3.geoNaturalEarth()
      .scale(167)
      .translate([width / 2, height / 2])
      .precision(0.1);

  var path = d3.geoPath()
      .projection(projection);

  var countries = topojson.feature(data, data.objects.countries_min_fil).features;
  var borders = topojson.mesh(data, data.objects.countries_min_fil, function(a, b) { return a !== b; });

  g.selectAll()
    .data(countries)
    .enter()
    .append('path')
      .attr('class', function(d) { return d.properties.iso_code; })
      .attr('d', path);

  g.append('path')
    .datum(borders)
    .attr('class', 'mesh')
    .attr('d', path);

  function zoomed() {
    g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
    g.attr("transform", d3.event.transform);
  }
}
