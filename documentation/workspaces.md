# Workspaces

## Workspace parameters

### map:center

A lat, lon pair for the map center.

### map:zoom

The zoom value as a float (non integer values are allowed).

### map:layers

#### type

- `CartoDBAnimation`: static, vector based layers served from a CARTO instance, and rendered by Mapbox GL.
- `ClusterAnimation`: activity layers, rendered by Pixi.

#### opacity

#### color

#### visible

#### gl

The `gl` parameter allows specifying custom Mapbox GL JSON layers, even if they are not set in the <a href="https://github.com/GlobalFishingWatch/map-client/blob/develop/app/src/map/gl-styles/style.json">base GL JSON</a> style. 

`gl` needs two mandatory parameters:
- `source`: A source can set a SQL query on a CARTO table <a href="https://github.com/GlobalFishingWatch/map-client/blob/develop/documentation/layers.md#gfwcarto-sql">as described in the layers documentation</a>, as well as the fields displayed in popups. Source id will automatically be set to the workspace layer id.
- `layers`: One or more GL layers associated to this workspace layer. A vector workspace layer will have typically a GL layer for polygons, and optionally a GL layer for labels. **Important:** the GL `type` (and associated style parameters) must match the corresponding CARTO/PostGIS type, ie: 
  - Polygons table -> `type: "fill"`
  - Lines table -> `type: "line"`
Note: the `source` and `source-layer` are not required as they will be automatically set to the workspace layer id.

For more on available GL layer style options, please refer to the <a href="https://www.mapbox.com/mapbox-gl-js/style-spec/">GL style spec</a>

**Examples**

Simple line layer without labels nor popups:
```
{
  "title":	"Zona Reservada Mar Pacífico Tropical Peruano",
  "type": "CartoDBAnimation",
  "id": "mar_pacifico_peruano",
  "color": "#ff0000",
  "visible": true,
  "gl": {
    "source": {
      "type": "vector",
      "metadata": {
        "gfw:carto-sql": "SELECT * FROM peru_mar_pacifico_tropical"
      }
    },
    "layers": [
      {
        "id": "mar_pacifico_peruano",
        "type": "line",
        "layout": { 
          "visibility": "none"
        },
        "interactive": true
      }
    ]
  }
}
```

Polygon/fill layer with labels and popups:

```
{
  "title":	"South American countries",
  "type": "CartoDBAnimation",
  "id": "samerica_adm0",
  "color": "#ff00ff",
  "visible": true,
  "gl": {
    "source": {
      "type": "vector",
      "metadata": {
        "gfw:carto-sql": "SELECT * FROM samerica_adm0",
        "gfw:popups": [
          { "id": "name" },
          { "id": "adm0_a3" },
          { "id": "POLYGON_LAYERS_AREA" }
        ]
      }
    },
    "layers": [
      {
        "id": "samerica_adm0",
        "type": "fill",
        "layout": { 
          "visibility": "none"
        },
        "interactive": true
      },
      {
        "id": "samerica_adm0-labels",
        "type": "symbol",
        "layout": {
          "visibility": "none",
          "text-field": "{name}",
          "text-font": [
            "Roboto Mono Light"
          ],
          "text-size": 10
        }
      }
    ]
  }
}
```

### timeline

![](https://github.com/Vizzuality/GlobalFishingWatch/blob/develop/documentation/timebar.png?raw=true)

Can be of two formats. To set inner and outer extent to static points in time (expressed as UTC milliseconds):
```
"timeline": {
  "innerExtent": [
    1464739200000,
    1467331200000
  ],
  "outerExtent": [
    1451689200000,
    1480550400000
  ]
}
```

Or use `auto` mode:
```
"timeline": {
  "auto": {
    "daysEndInnerOuterFromToday": 4,
    "daysInnerExtent": 30
  }
}
```

When auto exists on timeline, it replaces the innerExtent and outerExtent parameters.
It's possible to also just set "auto": true, in which case daysEndInnerOuterFromToday(position of the end of the inner and outer extents expressed a number of days from today) and daysInnerExtent (length of the inner extent in days) are set to defaults (4 and 30 days).

## Workspace Override

Some parameters of the loaded workspace can be overriden with URL parameters. Either `paramsPlainText` (raw JSON) or `params` (base64/`atob` encoded JSON).

Example (as of v1):
```
{
  vessels: [[seriesgroup/uvi0, tilesetId0, series0], ..., [seriesgroup/uviN, tilesetIdN,seriesN]],  // merges with workspace pinned vessels, first vessel of the array is shownVessel, series is an optional argument for each vessel
  view: [zoom, longitude, latitude], // overrides workspace-set view
  innerExtent: [start, end], // overrides workspace
  outerExtent: [start, end] // overrides workspace
  version: int // the version will tell the client the structure of the params
}
```

### Supported parameters

#### vessels

`[[seriesgroup/uvi0, tilesetId0, series0], ..., [seriesgroup/uviN, tilesetIdN,seriesN]]`

Adds specified vessels to the current workspace pinned vessels (`pinnedVessels`).
The first vessel provided replaces the current workspace `shownVessel`, if existing.

#### view

`[zoom, longitude, latitude]`

Overrides workspace's `map.center` and `map.zoom`.

#### innerExtent

`[start, end]`

Overrides workspace's `timeline.innerExtent`.

#### outerExtent

`[start, end]`

Overrides workspace's `timeline.outerExtent`.

#### version

Should be `"1"`