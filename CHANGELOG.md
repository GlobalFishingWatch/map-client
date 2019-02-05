# Changelog

## 3.2.0

### Added
- Add the ability to handle WMS with multiple layers. Relates to [#912](https://github.com/GlobalFishingWatch/map-client/issues/912)

## 3.1.2

### Fixed
- Fixed an issue where a vessel track and info would be loaded twice when having it both pinned and displayed in a given workspace ([#1006](https://github.com/GlobalFishingWatch/map-client/issues/1006))

## 3.1.0

### Added
- Users can now upload custom layers in raster tiles format ([#997](https://github.com/GlobalFishingWatch/map-client/issues/997))
- Users can now upload custom layers in WMS format ([#912](https://github.com/GlobalFishingWatch/map-client/issues/912))
- Popups will now appear with custom GeoJSON layers, showing all properties available in each polygon ([#996](https://github.com/GlobalFishingWatch/map-client/issues/996))

## 3.0.7
### Changed
- Fixed timestamp displays to be in UTC rather than local times (in VIIRS info, hover tooltips, and encounters panel) ([#999](https://github.com/GlobalFishingWatch/map-client/issues/999))

## 3.0.6
- Added support for line and point custom layers

## 3.0.5
- Bigger tolerance radius when clicking on activity layers

## 3.0.4
- Fixed issue when adding more than one filter group

## 3.0.3
- Fixed styles loading issue

## 3.0.2
- Fixed custom layer loading from workspace

## 3.0.1
- Fixed displaying activity layers when resizing viewport

## 3.0.0
- Allow custom Mapbox GL JSON style in workspaces - [#943](https://github.com/GlobalFishingWatch/map-client/pull/943)
- Deeper zoom levels up to 14, even when activity layer tiles are not visible - [#942](https://github.com/GlobalFishingWatch/map-client/pull/942)
- Added button to fold right control panel - [#945](https://github.com/GlobalFishingWatch/map-client/pull/945)
  - Right panel automatically expands when clicking on a vessel on the map - [#966](https://github.com/GlobalFishingWatch/map-client/pull/966)
- Miniglobe is now displayed in right control panel - [#945](https://github.com/GlobalFishingWatch/map-client/pull/945)
  - Miniglobe now shows the viewed region accurately
- Added a button to fit the viewport and timebar to vessel tracks
- Removed automatic fit to viewport and timebar when clicking on a vessel search result (can now be done by explicitely clicking the button)
- Clicking the (i) vessel button again now hides vessel details
- Harmonisation of icons and various small UI fixes

## 2.4.0 RC2
- Fixed issue that preventend building in production mode

## 2.4.0 RC1
- Support for PBF tilesets
- Support for layers without temporal extents
- Support for layers with only tracks and no displayable activity (Reefer layer)
- Encounters layer
- Fixed broken responsive endpoint in vessel/encounters panels

## 2.3.2
- Fix issue where report/subscription submission would not disable report mode

## 2.3.1
- Fix issue where report/subscription filters were passed using the wrong API parameter

## 2.3.0
- Improve conversion of old filter workspaces to new filter groups
- Show layers as unselected when creating new filters
- Improve close interactions on subscriptions functionality

## 2.3.0 RC2
- Restore one-time report functionality on new subscriptions interface
- Fix issue with filter select CSS on production settings
- Fix issue where layers with no filter headers would crash the filters functionality
- Fix regression on filter warning message 

## 2.3.0 RC1
- Add and style scroll bars for modal boxes
- Fix new filters backwards compatibility with old workspaces 

## 2.3.0 Beta 1
- Add new filters interface
- Add new subscription functionality

## 2.2.3
- Fix path to social network cards
- Fix issue where header logo would overflow mobile map

## 2.2.2
- Replaced logo

## 2.2.1
- Rename "Fishing Layers" to "Activity Layers"

## 2.2.1 RC2
- Fixed issue in vessel search results when highlighting MMSI

## 2.2.1 RC1
- Fix latitude displayed twice in hover coordinates
- Moved 'beta' label to footer while keeping the old logo for now

## 2.2.0
- Enforce minimum 1 day period on timebar
- Temporarily hide map legend
- Fix some issues regarding cross-browser compatibility
- Fix some styling issues
- Add more colors to layer and track color picker

## 2.2.0 RC1
- General design and code overhaul
- Code refactoring for better management and extensibility
- UI changes to optimize screen usage
- UI review on vessel history and search result modals
- Sidebar reorganisation, panel-based navigation replaced accordion
- Replaced hue selectors by palette selectors
- Added minimap
- Added heatmap legend
- Added playback speed controls and saving in workspace
- Added "North Star" basemap
- Full update on dependencies to latest versions
- Add "Area of Interest"
   - Drawing new areas
   - Recoloring
   - Renaming
   - Saving to workspace
   - Loading from workspace
- Merged basemaps switcher into layers panel
- Add interface for new filter group logic

## 2.1.6 RC4
- Revert Preact to React
- Revert `react-day-picker` to `react-datepicker`

## 2.1.6 RC3
- Revert `react-sanfona` update
- Fix GA tracking of layer transparency change
- Add GA tracking of layer hue change
- Fix GA tracking of page view

## 2.1.6 RC2
- Add missing `YeahMonthForm` component

## 2.1.6 RC1
- Replace `react-datepicker` with `react-day-picker`
- Remove `react-google-maps` for a native goggle maps usage
- Update `react-sanfona`, `node-sass` and `sass-loader`
- Bump `node` and `npm` version dependencies
- Refactor CSS structure
- Improve vessel rendering by removing part of the frames

## 2.1.5
- Fix issue preventing map from rendering on some situations

## 2.1.4
- Fix issue on track rendering
- Improve performance on track rendering
- Replace React with Preact
- Distinct GA events for inner position and extent
- Add GA event for layer opacity

## 2.1.3
- Add support for accelerated playback using console commands

## 2.1.2
- Update basemap URLs

## 2.1.1
- Fix permissions issue on logout
- Fix vessel info loading for guest users
- Improve vessel detail loading error handling

## 2.1.0
- Fix bug that prevents first attempt to save workspace for sharing
- Fix issue on loading pinned vessels tileset

## 2.1.0 Beta 2
- Search on added but disabled fishing effort layers
- Add warning when reporting with non-reportable layers
- Fix support for multiple fishing event layers
- Add support for dynamic vessel detail info

## 2.0.3
- Replace "CartoDB" with "CARTO"

## 2.0.2
- Fix issue where welcome modal would show unneeded scrollbars on desktop screen sizes

## 2.0.1
- Fix issue where welcome modal would not be closeable on certain screen resolutions

## 2.0.0
- Do not redirect to base domain on logout
- Decouple basemap label from name
- Replace "satellite" basemap with "hybrid"
- Remove "Map" and add "Home" to menus
- Dismissible legacy version banner
- Fixed loading error when loading map from a custom path, ie not at the root of the website
- Fix issue where fishing layers loaded as invisible would never load when made visible
- Load workspace id from legacy structure
- On embedded mode, open site on new tab
- Fallback to canvas when WebGL is not available and display a performance warning
- Shorter timeline labels for small viewports
- Fix date pickers on iOs
- Hide site menu on embed mode

## 2.0.0 RC10
- Date pickers years selectors
- Date pickers now allows selection anywhere in the overall time range
- Allow multiple polygons in report
- Send layer name to report
- Temporarily remove rendering of vessel track outside of inner time range
- Don't resize viewport on toggle custom layer visibility
- Fixed loader style on Safari
- Pinned vessels: fixed a bug where typing a custom would be very slow when pinned track was visible
- Pinned vessels: fallback title when vessel name is not present
- Fix issues with loading pinned and selected vessels from workspace
- Fixed sidebar scrolling issues
- Fixed panel gap when embedding map without footer
- Welcome modal responsive for desktop
- Search vessels across multiple heatmap layers
- Fixed various issue with reports and reports polygons
- Fixed share embedded URL
- Fix map center loading from workspace
- Have map follow the COMPLETE_MAP_RENDER value on embedded mode
}
## 2.0.0 RC9
- Fix regression on heatmap interactivity

## 2.0.0 RC8
- Detect missing tileset ids
- Disable vessel history for guest users
- Fix extends and heatmap lookup on legacy workspaces
- Fix welcome modal styles
- Set minimum frame to 1 day
- Fix fast zoom issue
- Fix max hue issue
- Fix tracks jump on map pan
- More progressive track dots scaling
- Adjust track dot size depending on z level
- Remove class field from vessel details
- Fixed frozen heatmap while zooming
- Load fishing hours description literal from json file
- Fix issue where user would always appear as logged int
