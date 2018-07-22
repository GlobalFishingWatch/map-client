# Workspaces

## Workspace parameters

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

As of v1:
```
{
  vessels: [[seriesgroup/uvi0, tilesetId0, series0], ..., [seriesgroup/uviN, tilesetIdN,seriesN]],  // merges with workspace pinned vessels, first vessel of the array is shownVessel, series is an optional argument for each vessel
  view: [zoom, longitude, latitude], // overrides workspace-set view
  innerExtent: [start, end], // overrides workspace
  outerExtent: [start, end] // overrides workspace
  version: int // the version will tell the client the structure of the params
}
```

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