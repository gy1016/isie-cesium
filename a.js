function init() {
  function ScaleControl(opt_options) {
    var options = opt_options || {};

    var element = document.createElement('div');
    element.setAttribute('id', 'scale');
    element.className = 'ol-scale-value';

    ol.control.Control.call(this, {
      element: element,
      target: options.target,
    });
  }
  ol.inherits(ScaleControl, ol.control.Control);
  ScaleControl.prototype.setMap = function (map) {
    map.on(
      'postrender',
      function () {
        var view = map.getView();
        var resolution = view.getResolution();
        var dpi = 90.71428571428572;
        var mpu = map.getView().getProjection().getMetersPerUnit();
        var scale = resolution * mpu * 39.37 * dpi;

        if (scale >= 9500 && scale <= 950000) {
          scale = Math.round(scale / 1000) + 'K';
        } else if (scale >= 950000) {
          scale = Math.round(scale / 1000000) + 'M';
        } else {
          scale = Math.round(scale);
        }
        document.getElementById('scale').innerHTML = 'Scale = 1 : ' + scale;
      },
      this,
    );
    ol.control.Control.prototype.setMap.call(this, map);
  };

  function ZoomControl(opt_options) {
    var options = opt_options || {};

    var element = document.createElement('div');
    element.setAttribute('id', 'zoom');
    element.className = 'ol-zoom-value';

    ol.control.Control.call(this, {
      element: element,
      target: options.target,
    });
  }
  ol.inherits(ZoomControl, ol.control.Control);
  ZoomControl.prototype.setMap = function (map) {
    map.on(
      'moveend',
      function () {
        var view = map.getView();
        document.getElementById('zoom').innerHTML = 'Zoom level = ' + view.getZoom();
      },
      this,
    );
    ol.control.Control.prototype.setMap.call(this, map);
  };

  var gridsetName = 'EPSG:4326';
  var gridNames = [
    'EPSG:4326:0',
    'EPSG:4326:1',
    'EPSG:4326:2',
    'EPSG:4326:3',
    'EPSG:4326:4',
    'EPSG:4326:5',
    'EPSG:4326:6',
    'EPSG:4326:7',
    'EPSG:4326:8',
    'EPSG:4326:9',
    'EPSG:4326:10',
    'EPSG:4326:11',
    'EPSG:4326:12',
    'EPSG:4326:13',
    'EPSG:4326:14',
    'EPSG:4326:15',
    'EPSG:4326:16',
    'EPSG:4326:17',
    'EPSG:4326:18',
    'EPSG:4326:19',
    'EPSG:4326:20',
    'EPSG:4326:21',
  ];
  var baseUrl = '../service/wmts';
  var style = '';
  var format = 'image/png';
  var infoFormat = 'text/html';
  var layerName = 'gy_workspace:C_M11.Npp_500m.tif';
  var projection = new ol.proj.Projection({
    code: 'EPSG:4326',
    units: 'degrees',
    axisOrientation: 'neu',
  });
  var resolutions = [
    0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125,
    0.0054931640625, 0.00274658203125, 0.001373291015625, 6.866455078125e-4, 3.4332275390625e-4,
    1.71661376953125e-4, 8.58306884765625e-5, 4.291534423828125e-5, 2.1457672119140625e-5,
    1.0728836059570312e-5, 5.364418029785156e-6, 2.682209014892578e-6, 1.341104507446289e-6,
    6.705522537231445e-7, 3.3527612686157227e-7,
  ];
  baseParams = ['VERSION', 'LAYER', 'STYLE', 'TILEMATRIX', 'TILEMATRIXSET', 'SERVICE', 'FORMAT'];

  params = {
    VERSION: '1.0.0',
    LAYER: layerName,
    STYLE: style,
    TILEMATRIX: gridNames,
    TILEMATRIXSET: gridsetName,
    SERVICE: 'WMTS',
    FORMAT: format,
  };

  function constructSource() {
    var url = baseUrl + '?';
    for (var param in params) {
      if (baseParams.indexOf(param.toUpperCase()) < 0) {
        url = url + param + '=' + params[param] + '&';
      }
    }
    url = url.slice(0, -1);

    var source = new ol.source.WMTS({
      url: url,
      layer: params['LAYER'],
      matrixSet: params['TILEMATRIXSET'],
      format: params['FORMAT'],
      projection: projection,
      tileGrid: new ol.tilegrid.WMTS({
        tileSize: [256, 256],
        extent: [-180.0, -90.0, 180.0, 90.0],
        origin: [-180.0, 90.0],
        resolutions: resolutions,
        matrixIds: params['TILEMATRIX'],
      }),
      style: params['STYLE'],
      wrapX: true,
    });
    return source;
  }

  var layer = new ol.layer.Tile({
    source: constructSource(),
  });

  var view = new ol.View({
    center: [0, 0],
    zoom: 2,
    resolutions: resolutions,
    projection: projection,
    extent: [-180.0, -90.0, 180.0, 90.0],
  });

  var map = new ol.Map({
    controls: ol.control
      .defaults({ attribution: false })
      .extend([new ol.control.MousePosition(), new ScaleControl(), new ZoomControl()]),
    layers: [layer],
    target: 'map',
    view: view,
  });
  map
    .getView()
    .fit(
      [108.10399577622215, 28.909848884487218, 116.2351456388866, 33.40733260122735],
      map.getSize(),
    );

  window.setParam = function (name, value) {
    if (name == 'STYLES') {
      name = 'STYLE';
    }
    params[name] = value;
    layer.setSource(constructSource());
    map.updateSize();
  };

  map.on('singleclick', function (evt) {
    document.getElementById('info').innerHTML = '';

    var source = layer.getSource();
    var resolution = view.getResolution();
    var tilegrid = source.getTileGrid();
    var tileResolutions = tilegrid.getResolutions();
    var zoomIdx,
      diff = Infinity;

    for (var i = 0; i < tileResolutions.length; i++) {
      var tileResolution = tileResolutions[i];
      var diffP = Math.abs(resolution - tileResolution);
      if (diffP < diff) {
        diff = diffP;
        zoomIdx = i;
      }
      if (tileResolution < resolution) {
        break;
      }
    }
    var tileSize = tilegrid.getTileSize(zoomIdx);
    var tileOrigin = tilegrid.getOrigin(zoomIdx);

    var fx = (evt.coordinate[0] - tileOrigin[0]) / (resolution * tileSize[0]);
    var fy = (tileOrigin[1] - evt.coordinate[1]) / (resolution * tileSize[1]);
    var tileCol = Math.floor(fx);
    var tileRow = Math.floor(fy);
    var tileI = Math.floor((fx - tileCol) * tileSize[0]);
    var tileJ = Math.floor((fy - tileRow) * tileSize[1]);
    var matrixIds = tilegrid.getMatrixIds()[zoomIdx];
    var matrixSet = source.getMatrixSet();

    var url = baseUrl + '?';
    for (var param in params) {
      if (param.toUpperCase() == 'TILEMATRIX') {
        url = url + 'TILEMATRIX=' + matrixIds + '&';
      } else {
        url = url + param + '=' + params[param] + '&';
      }
    }

    url =
      url +
      'SERVICE=WMTS&REQUEST=GetFeatureInfo' +
      '&INFOFORMAT=' +
      infoFormat +
      '&TileCol=' +
      tileCol +
      '&TileRow=' +
      tileRow +
      '&I=' +
      tileI +
      '&J=' +
      tileJ;

    if (url) {
      document.getElementById('info').innerHTML = 'Loading... please wait...';
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
          if (xmlhttp.status == 200) {
            document.getElementById('info').innerHTML = xmlhttp.responseText;
          } else {
            document.getElementById('info').innerHTML = '';
          }
        }
      };
      xmlhttp.open('GET', url, true);
      xmlhttp.send();
    }
  });
}
