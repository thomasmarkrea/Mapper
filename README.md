# Mapper
Tool for mapping locations based on JSON input file.

## Manipulating Map Data

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
# initial install (adds to dependencies in package.json file)
npm install -D shapefile
npm install -D topojson

# will install all dependencies from package.json file
npm install
```

### Convert to GeoJSON
```bash
# convert to GeoJSON
shp2json ne_110m_admin_0_countries.shp -o countries_geo.json
```


### Convert to TopoJSON
Reduces file size
```bash
# convert to TopoJSON
geo2topo countries=countries_geo.json > countries_topo.json
```
