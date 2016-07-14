import Bounds from "./Bounds";

const getBounds = function (map) {
  const bounds = map.getBounds();
  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();
  const bottom = sw.lat();
  const left = sw.lng();
  const top = ne.lat();
  const right = ne.lng();
  return {
    top: top,
    left: left,
    right: right,
    bottom: bottom
  }
};

const TileBounds = function () {
};
TileBounds.world = new Bounds([-180, -90, 180, 90]);
TileBounds.tileParamsForRegion = function (args) {
  let bounds = args.bounds;
  const tilesPerScreen = args.tilesPerScreen;

  const origBounds = new Bounds(bounds);
  bounds = origBounds.unwrapDateLine(TileBounds.world);

  const res = {
    bounds: origBounds,
    unwrappedBounds: bounds,
    width: bounds.getWidth(),
    height: bounds.getHeight(),
    worldwidth: TileBounds.world.getWidth(),
    worldheight: TileBounds.world.getHeight(),

    toString: function () {
      return "\n" + Object.items(this
        ).filter(function (item) {
            return item.key != "toString" && item.key != "stack";
          }
        ).map(function (item) {
            return "  " + item.key + "=" + item.value.toString();
          }
        ).join("\n") + "\n";
    }
  };

  res.level = Math.ceil(Math.log(res.worldwidth / (res.width / Math.sqrt(tilesPerScreen)), 2));

  res.tilewidth = res.worldwidth / Math.pow(2, res.level);
  res.tileheight = res.worldheight / Math.pow(2, res.level);

  res.tileleft = res.tilewidth * Math.floor(bounds.left / res.tilewidth);
  res.tileright = res.tilewidth * Math.ceil(bounds.right / res.tilewidth);
  res.tilebottom = res.tileheight * Math.floor(bounds.bottom / res.tileheight);
  res.tiletop = res.tileheight * Math.ceil(bounds.top / res.tileheight);

  res.tilesx = (res.tileright - res.tileleft) / res.tilewidth;
  res.tilesy = (res.tiletop - res.tilebottom) / res.tileheight;

  return res;
};

TileBounds.tileBoundsForRegion = function (args) {
  /* Returns a list of tile bounds covering a region. */
  const bounds = args.bounds;
  const tilesPerScreen = args.tilesPerScreen;

  const params = TileBounds.tileParamsForRegion(args);

  let res = [];
  for (let x = 0; x < params.tilesx; x++) {
    for (let y = 0; y < params.tilesy; y++) {
      res.push(new Bounds([
        params.tileleft + x * params.tilewidth,
        params.tilebottom + y * params.tileheight,
        params.tileleft + (x + 1) * params.tilewidth,
        params.tilebottom + (y + 1) * params.tileheight
      ]).rewrapDateLine(TileBounds.world));
    }
  }

  return {
    set: res,
    tilesPerScreen: 1,
    params: params
  }
};


const getTiles = function (bounds) {
  return TileBounds.tileBoundsForRegion({bounds: bounds, tilesPerScreen: 32});
}

const getUrls = function (map) {
  let bounds = getBounds(map);
  return getTiles(bounds).set;
}

export default getUrls;
