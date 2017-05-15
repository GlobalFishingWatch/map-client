# Changelog

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
