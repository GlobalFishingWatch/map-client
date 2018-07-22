# Layers


## Types

### Static Layers

Declared in workspaces/directory as `"type": "CartoDBAnimation"`, and detailed the GL JSON.

### Basemap Layers

Workspace defines the `basemap` layer currently used, as well as `basemapOptions` layers. Both types are detailed in the GL JSON.

### Activity Layers

Declared in workspaces/directory as  `"type": "ClusterAnimation"`.

Defined in workspaces/directory, the PIXI JS renderer takes it from there: Activity layers don't exist in the GL JSON.


## Structure

```
                                                             -> GL layer
Workspace/directory layer or basemap <---> GL JSON source <---> GL layer
                                                             -> GL layer
```

See <a href="https://github.com/GlobalFishingWatch/map-client/blob/develop/app/src/map/gl-styles/style.json">current GL JSON file in use</a>.

Layers are uniquely identified by an id. This id is declared in workspaces/directory, and **matches a <a href="https://www.mapbox.com/mapbox-gl-js/style-spec/#root-sources">source</a> declared in the GL JSON**.  

```
"sources" {
  "mpant": {
    "metadata": {
      "gfw:carto-sql": "SELECT the_geom, the_geom_webmercator, cartodb_id, name, name as reporting_name, 'mpant:' || mpa_id as region_id, 'mpant:' || mpa_id as reporting_id FROM mpant",
      "gfw:popups": [
        { "id": "name" },
        { "id": "POLYGON_LAYERS_AREA" }
      ]
    },
    "type": "vector"
  }, ...
}
```

Currently used type of sources are:
- <a href="https://www.mapbox.com/mapbox-gl-js/style-spec/#sources-geojson">geojson</a> for custom layers
- <a href="https://www.mapbox.com/mapbox-gl-js/style-spec/#sources-raster">raster</a> for basemaps and basemap labels (currently only point to the GMaps API)
- <a href="https://www.mapbox.com/mapbox-gl-js/style-spec/#sources-vector">vector</a> for Static Layers and basemap options. All hosted on our Carto instance ATM.

Each source is then used by one or more GL layers, which defines the visual appeareance of the layer (before workspace modifications). Here a GL layer for polygons, a GL layer for labels:

```
"layers": [
  {
    "type": "fill",
    "id": "mpant",
    "source": "mpant",
    "source-layer": "mpant",
    "layout": { 
      "visibility": "none"
    },
    "paint": {},
    "interactive": true
  },
  {
    "type": "symbol",
    "id": "mpant-labels",
    "source": "mpant",
    "source-layer": "mpant",
    "layout": {
      "visibility": "none",
      "text-field": "{name}",
      "text-font": [
        "Roboto Mono Light"
      ],
      "text-size": 10
    },
    "paint": {}
  }, ...
]
```

Notes:
- GL layers own `id` is irrelevant. `source` and `source-layer` have to have the same value, which is the id of the source (`source-layer` actually matches the id used in `mapconfig` when instanciating an anonymous Carto layer)
- For label layers, the value used in `text-field` must match polygon properties aka a column name in Carto. 


## Mapbox GL JSON extensions

### root.metadata

#### gfw:basemap-layers

Defines basemap layers and basemap options available in the map.

```
"metadata": {
  "gfw:basemap-layers": [
    { "id": "satellite", "label": "Satellite" },
    { "id": "north-star", "label": "North Star" },
    { "id": "labels", "isOption": true },
    { "id": "graticules", "isOption": true },
    { "id": "bathymetry", "isOption": true }
  ]
}
```

### source.metadata

```
"sources" {
  "protectedplanet": {
    "metadata": {
      "gfw:carto-sql": "SELECT * from protectedplanet",
      "gfw:popups": [
        { "id": "name" },
        { "id": "iucn_cat", "label": "IUCN Category" },
        ...
      ]
    },
    ...
  },
```


#### gfw:carto-sql

For sources hosted on Carto, the SQL query to use when instanciating the layer.

#### gfw:popups 

Defines what fields should appear on popups.
- `id` : mandatory, must match a polygon property aka a column name in Carto. 
- `label` : the display label for the field, if omitted falls back to `id`.  