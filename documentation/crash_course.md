#### Some initial context (when I started working on the project in Aug 2016)

- the map client had to be done with the Google Maps API (Google being a partner of the project)
- Skytruth is working on the backend (tilesets, and API services), and has been developing the initial client prototype
- before we started working on the map, Skytruth developed an [initial prototype that is still visible](http://globalfishingwatch.org/legacy-map) (you need to authenticate an account validated by Skytruth). This prototype is very fast, because all the rendering logic is happening on the GPU. The downside is that this logic is written in GLSL shaders, which a difficult to maintain in the context of a complex web app. That is the reason why we started working on a React based version.
- initially we offered to develop a version based on canvas (that is, pure CPU rendering), before having to move to WebGL, because the type of rendering we were looking to achieve was not possible with reasonable performance. I described that iterative process [in that blogpost](https://medium.com/vizzuality-blog/saving-the-with-how-we-used-webgl-and-pixi-js-for-temporal-mapping-2cffaed60b91)
-

![](https://github.com/Vizzuality/GlobalFishingWatch/blob/develop/documentation/timebar.png?raw=true)

#### Activity Layers data

- the core of the app are what we call 'Activity Layers' (formerly 'Fishing Layers'), which are the animated layers.
  - AIS data was the initial data we had
  - VMS data, provided by Indonesian authorities, was added later
  - there are more, mostly used in private workspaces, like shark activity
  - a lot more are programmed for future releases (peruvian data, etc)
- the rest of the layers ('Map Layers') are simple CARTO layers
- the points data for the Activity layers are loaded as binary tiles, generated and served by Skytruth.
- these tiles contain point data, each point data containing:
  - __lat/lon__ coordinates
  - a UTC __timestamp__ in ms
  - a __weight__ value that represents the weight of a cluster (ie at low zoom levels, points are aggregated to a single point with a high weight)
  - a __sigma__ value that represents the amount of fishing for a given point or cluster
  - a __seriesgroup__ that uniquely identifies a vessel. When that value is negative, it means we have a cluster of different vessels.
  - a __series__ that uniquely identifies a __vessel track__. A vessel can have several tracks (separated by time), a track will have one ore more individual points.
- in our implementation, weight translates as rendered point opacity and sigma as rendered point brush size (see below for details about rendering). I originally kind of reverse-engineered the rendering in the initial prototype by [groping around](https://github.com/Vizzuality/GlobalFishingWatch/blob/53842ee989fbd899fa09efb97c9e66bda60ce926/app/src/util/heatmapTileData.js#L183). It's important to note that this is zoom-dependant. Here's the detailed explanation provided by Egil (afterwards):
```
 it's very simple: Imagine a cluster point in a "side view", where "x" is radially outwards from the center of the point, and y is the intensity of that pixel. In this view, the point will look like a bell curve, centered on origo. The height of the bell curve is the weight value, and the width of one standard deviation from the center of the bell curve is the sigma value. Now, in reality intensity can't go to infinity. So these values (0,inf) are mapped using a sigmoid-looking scale that gives a nice (0,1) range, which in turn is mapped to a color gradient. The exact color gradient, and the shape of this sigmoid, is mostly an aesthetic question, while the bell curve and one-standard-deviation rule is a mathematical consequence of how cluster weight and sigma are calculated on the server side.
 That is, weight = sum(cluster.weight) and sigma = sqrt(stddev(cluster.lat)^2 + stddev(cluster.lon)^2)
 ```
- this point data is not stored as an array of points, but rather with a series of arrays, one for each of the points values (an array for lats, an array for weights, etc) stored as [__vectors__](https://github.com/Vizzuality/GlobalFishingWatch/blob/53842ee989fbd899fa09efb97c9e66bda60ce926/app/src/util/heatmapTileData.js#L107) (an optimized array-like data structure that contains only values of a single primitive type, in this case Numbers in a Float32Array).
- opacity, radius, as well as worldX and worldY (projected lon and lat) are computed **just after a tile is loaded**, to avoid having to do this at display/playback, which would cause frames to be skipped / slow FPS.
- those vectors are then translated into a data structure that is optimized for fast playback. The idea is to group them by days, so that when animation starts, the renderer will only have to access the points that are related to the currently visible time range. We end up with a data structure like this:
```
playbackData = [
  0: {
    worldX: [1567.3242, 2342.453, 3423.456],
    opacity: [0.2, 0.3, 0.5],
    series: [1, 2, 3],
    ...
  },
  1: {
    worldX:...
  },
  ...
]
```
The indexes (0,1,2, etc) match days, that is: 0 is [the first displayable day](https://github.com/Vizzuality/GlobalFishingWatch/blob/53842ee989fbd899fa09efb97c9e66bda60ce926/app/src/config.js#L13). For each day, we have an object that represents a __'frame'__.
- a given tile contains data for one year. When the outer displayed time range is expanded to more than 1 year, more tiles are loaded (for the same geographic position), and data is concatenated to the existing playback data.


#### Tiles, Google Maps and React

- A single WebGL canvas is used (taking the size of the whole viewport), rather than one canvas per tile. The reason for this is that it's much faster, and in most configurations the number of WebGL canvasses has a hard limit per browser tab (a typical map view contains 16 - 24 tiles)
- But the actual data fetching is driven by a [tiled layer](https://github.com/Vizzuality/GlobalFishingWatch/blob/53842ee989fbd899fa09efb97c9e66bda60ce926/app/src/components/Layers/TiledLayer.js), even though it displays nothing. This layer implements the methods defined in Google Maps' `MapType` [interface](https://developers.google.com/maps/documentation/javascript/maptypes), principally `getTile` when user panning or zooming causes a new tile to be displayed, and `releaseTile` when a tile gets off the viewport.
- Those two callbacks directly link to redux actions callbacks (see [component](https://github.com/Vizzuality/GlobalFishingWatch/blob/53842ee989fbd899fa09efb97c9e66bda60ce926/app/src/components/Layers/MapLayers.jsx#L167) and [reducer](https://github.com/Vizzuality/GlobalFishingWatch/blob/53842ee989fbd899fa09efb97c9e66bda60ce926/app/src/containers/Layers/MapLayers.js#L26))
- From there the redux part of the application takes care of fetching, merging, and converting tile data ([heatmap actions](https://github.com/Vizzuality/GlobalFishingWatch/blob/53842ee989fbd899fa09efb97c9e66bda60ce926/app/src/actions/heatmap.js))
- When data in playback-friendly mode is ready, it is sent to the renderer: [GLContainer](https://github.com/Vizzuality/GlobalFishingWatch/blob/53842ee989fbd899fa09efb97c9e66bda60ce926/app/src/components/Layers/GLContainer.js). This renderer extends a [custom](https://github.com/Vizzuality/GlobalFishingWatch/blob/53842ee989fbd899fa09efb97c9e66bda60ce926/app/src/components/Layers/BaseOverlay.js) Google Maps [`OverlayView` (search OverlayView in the page)](https://developers.google.com/maps/documentation/javascript/reference). This class is normally not meant for layers but rather for UI elements, but it works neatly for us as the GLContainer never moves in terms of DOM positioning: points world coordinates (in pixels) are directly used, after adding an offset related to where the user panned.

#### Rendering activity Layers

- The point rendering has 3 distinct brush types:
  - heatmap, that is brushes overlaid on top of each others (the brushes are radial gradients)
  - circles, displayed when zoomed in
  - bullseye for the encounters layer
- The challenge from the start was to be able to display those custom brushes, while maintaining reasonable performance and maintainability at the same time. A 2D games rendering engine, Pixi.js was considered a good enough compromise (before switching to a fully WebGL solution, see 'Future Plans' below).
- Essentially what Pixi does is abstracting away WebGL rendering logic, giving a hierarchical way to deal with graphical objects: containers, and particles that can be simply be positioned with x and y, scaled, faded with opacity, etc.
- The heatmap layers are organized with the following structure:

```
- GLContainer: the container that makes the link between Google Maps, the data, and the Pixi side
  - HeatmapLayer: matches an activity layer (as in, a layer displayed as such in the UI)
    - HeatmapSubLayer: one per used color in every activity layer (filters, see explanation below)
  - 1 HeatmapLayer for the hover highlight
    - HeatmapSubLayer
  - TracksLayer: a distinct and unique container to display all vessel tracks
```

- When changing the point brush type (heatmap/circle/bullseye) or when changing the point color, this translates in the Pixi world into changing the textures for those points. Swapping a texture on a Pixi object/particle (that is, in WebGL, a quad geometry or 2 triangles), means doing a costly GPU draw call. For that reason, it is more efficient to render all possible brushes into a spritesheet or texture atlas (it works similarly to the popular technique of CSS spritesheets), then changing the texture frame or offsets, rather than having a texture per brush and swapping the texture. What this means is that all heatmap points use a single texture, that is a matrix of brushes, 3 brush types on the x axis, 32 colors on the y axis. That spritesheet is [rendered once in GLContainer](https://github.com/Vizzuality/GlobalFishingWatch/blob/53842ee989fbd899fa09efb97c9e66bda60ce926/app/src/components/Layers/GLContainer.js#L80).

```
        heatmap    circle   bullseye
red       •          ◦         ⦿
orange    •          ◦         ⦿
yellow    •          ◦         ⦿
...

```

- Circling back to the hierarchy of containers: the UI layers drive the number of `HeatmapLayers`, then the number of colors used within a layer drive the number of `HeatmapSubLayers` inside a `HeatmapLayer`. A few examples:
  - One AIS layer without any filters :

  ```
  - GLContainer
    - HeatmapLayer (AIS)
      - HeatmapSubLayer using the color applied globally to the AIS layer
    - 1 HeatmapLayer for the hover highlight
      - HeatmapSubLayer
    - TracksLayer
  ```
  - One VMS layer without filters, plus one AIS layer with a filter for France and Spain :

  ```
  - GLContainer
    - HeatmapLayer (VMS)
      - HeatmapSubLayer using the color applied globally to the VMS layer
    - HeatmapLayer (AIS)
      - HeatmapSubLayer using the color applied to the french vessels
      - HeatmapSubLayer using the color applied to the spanish vessels
    - 1 HeatmapLayer for the hover highlight
      - HeatmapSubLayer
    - TracksLayer
  ```


- Pooling: to avoid garbage collection happening in the middle of an animation, causing UI freeze, sprites are not created on the fly, as the numbers of points that we need to display grows or shrinks. Instead, an initial pool of sprites is created, that contains a [larger number of sprites than needed](https://github.com/Vizzuality/GlobalFishingWatch/blob/53842ee989fbd899fa09efb97c9e66bda60ce926/app/src/components/Layers/HeatmapSubLayer.js#L72). The unneeded sprites for a given frame are moved [off screen](https://github.com/Vizzuality/GlobalFishingWatch/blob/53842ee989fbd899fa09efb97c9e66bda60ce926/app/src/components/Layers/HeatmapSubLayer.js#L89), rather than discarded. The pool is resized (ie sprites are instantiated or destroyed) only when the number of sprites needed changes drastically (typically when adding a layer or changing time span, rather than in the middle of an animation)

#### Tracks

Tracks are similar to the heatmap in a few ways:
- they are rendered in WebGL by pixi
- they belong to the GLContainer
- they are loaded as binary data, also split across years
- worldX and worldY are computed at load time from lat/lon

But otherwise they differ in that:
- they are loaded 'on demand', when clicking on an heatmap vessel
- they are note loaded as tiles: there's a single API call for a given year, whatever the geographical position
- they are not rendered with a ParticlesContainer, but with Pixi's [drawing primitives](https://github.com/Vizzuality/GlobalFishingWatch/blob/53842ee989fbd899fa09efb97c9e66bda60ce926/app/src/components/Layers/TracksLayer.js#L114), very similar to the Canvas drawing API


#### Other endpoints

For a given tileset, along with heatmap tiles, there are a few extra endpoints:
- `sub/seriesgroup=xxx` return tracks for a vessel in binary tiles format
- `sub/seriesgroup=xxx/info` gives data for a vessel, to fill the VesselInfo panel
- `reports`
- ...

Look at the [Swagger spec](http://globalfishingwatch.io/api-docs/console/?url=https://api-dot-world-fishing-827.appspot.com/api/v2) made for more details.

#### Future plans: Encounters and MVT/PBF tiles

Encounters feature spec (endpoints):
https://docs.google.com/document/d/1mShlwVt8u5StMSei5kW7z40uwQfhF3oWHP4OnPuIXDA/edit#

About the future use of MVT/PBF tiles for activity layers:
https://github.com/Vizzuality/GlobalFishingWatch/pull/632#issuecomment-316102836

About the pending Encounters PR, that uses MVT/PBF tiles
https://github.com/Vizzuality/GlobalFishingWatch/pull/842

The playground repo for vector tiles:
https://github.com/Vizzuality/GlobalFishingWatch-vector


## Have fun! 🐟
