<template>
  <div id="ol-panel">
    <el-button
      :icon="DArrowRight"
      :class="['btn-show-layers', isShow ? 'h' : '']"
      @click="toggleLayers"
    ></el-button>
    <layer-control :layers="layers" :isShow="isShow" @hide:isShow="toggleLayers" />
    <div id="ol-map"></div>
  </div>
</template>

<script setup lang="ts">
  import 'ol/ol.css';
  import Map from 'ol/Map';
  import View from 'ol/View';
  import { WMTS } from 'ol/source';
  import OSM from 'ol/source/OSM';
  import WMTSTileGrid from 'ol/tilegrid/WMTS';
  import TileLayer from 'ol/layer/Tile';
  import Projection from 'ol/proj/Projection';
  import { onMounted, ref } from 'vue';
  import { DArrowRight } from '@element-plus/icons-vue';
  import { defaults } from 'ol/control';
  import LayerControl from '@/components/LayerControl.vue';

  let isShow = ref(false);
  const toggleLayers = () => {
    isShow.value = !isShow.value;
  };

  let layers = ref([
    {
      label: 'C_M11.tif',
    },
    {
      label: 'C_M12.tif',
    },
    {
      label: 'C_M13.tif',
    },
    {
      label: 'C_M14.tif',
    },
    {
      label: 'C_M15.tif',
    },
  ]);

  const projection = new Projection({
    code: 'EPSG:4326',
    units: 'degrees',
    axisOrientation: 'neu',
  });

  const resolutions = [
    0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125,
    0.0054931640625, 0.00274658203125, 0.001373291015625, 6.866455078125e-4, 3.4332275390625e-4,
    1.71661376953125e-4, 8.58306884765625e-5, 4.291534423828125e-5, 2.1457672119140625e-5,
    1.0728836059570312e-5, 5.364418029785156e-6, 2.682209014892578e-6, 1.341104507446289e-6,
    6.705522537231445e-7, 3.3527612686157227e-7,
  ];

  const constructSource = (): WMTS => {
    let url = 'http://121.199.160.202:8081/geoserver/gwc/service/wmts?';
    let baseParams = [
      'VERSION',
      'LAYER',
      'STYLE',
      'TILEMATRIX',
      'TILEMATRIXSET',
      'SERVICE',
      'FORMAT',
    ];

    const params = {
      VERSION: '1.0.0',
      LAYER: 'gy_workspace:C_M11.Npp_500m.tif',
      STYLE: '',
      TILEMATRIX: [
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
      ],
      TILEMATRIXSET: 'EPSG:4326',
      SERVICE: 'WMTS',
      FORMAT: 'image/png',
    };

    for (let param in params) {
      if (baseParams.indexOf(param.toUpperCase()) < 0) {
        url = url + param + '=' + params[param] + '&';
      }
    }
    url = url.slice(0, -1);

    const source = new WMTS({
      url: url,
      layer: params['LAYER'],
      matrixSet: params['TILEMATRIXSET'],
      format: params['FORMAT'],
      projection: projection,
      tileGrid: new WMTSTileGrid({
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
  };

  onMounted(() => {
    const olMap = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new TileLayer({
          source: constructSource(),
        }),
      ],
      target: 'ol-map',
      view: new View({
        center: [0, 0],
        zoom: 2,
        resolutions: resolutions,
        projection: projection,
        extent: [-180.0, -90.0, 180.0, 90.0],
      }),
      controls: defaults({
        attributionOptions: {
          collapsible: false,
        },
        attribution: false,
        rotate: false,
        zoom: false,
      }),
    });
    olMap
      .getView()
      .fit([108.10399577622215, 28.909848884487218, 116.2351456388866, 33.40733260122735]);
  });
</script>

<style src="./index.scss"></style>
