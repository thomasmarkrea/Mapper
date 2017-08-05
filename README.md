# Mapper
Tool for mapping locations based on JSON input file.

## Manipulating Shape Files

### Download Data
```bash
# download map data
mkdir data
cd data/
wget 'http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/110m/cultural/ne_110m_admin_0_countries.zip'
unzip ne_110m_admin_0_countries.zip
```

### Install Tools
```bash
# install tools
npm install -g shapefile
npm install -g topojson
npm install -g ndjson-cli
```

### Manipulate Data

Convert binary .shp file to human readable [newline-delimted](http://ndjson.org/) [GeoJSON](https://tools.ietf.org/html/rfc7946) so it's easier to work with from the command line:
```bash
shp2json ne_110m_admin_0_countries.shp | ndjson-split 'd.features' > countries.ndjson
```

Extract the fields we need:
```bash
cat countries.ndjson | ndjson-map '{type: d.type, properties: {name: d.properties.name, iso_code: d.properties.iso_a2, scalerank: d.properties.scalerank}, geometry: d.geometry}' > countries_min.ndjson
```

Convert to TopoJSON to reduce file size and
```bash
# convert to TopoJSON
geo2topo -n countries_min.ndjson > countries_topo.json
```
