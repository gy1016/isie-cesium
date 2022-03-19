<template>
  <div id="gdal-tools-bar">
    <div class="gdal-tool-item" :key="item.key" v-for="item in tools" @click="toolClick(item.key)">
      <i :class="`iconfont ${item.icon}`"></i>
    </div>
    <input type="file" ref="fileSelector" style="display: none" @change="processFile" />
  </div>
  <info-list v-if="infoResults.length" :fileInfoList="infoResults" />
</template>

<script setup>
  import { ref } from 'vue';
  import { saveAs } from 'file-saver';
  import InfoList from './InfoList.vue';

  const GdalPath = 'https://cdn.jsdelivr.net/npm/gdal3.js@2.0.2/dist/package';
  // 'https://cdn.jsdelivr.net/npm/gdal3.js@2.0.2/dist/package'
  // 'https://static.hotdry.top/npm/gdal3.js'

  let Gdal;
  // 1 -> shpInfo;  2 -> shpConvert;  3 -> rashterInfo;  4 -> rasterConvert;
  let fucMode = ref(null);
  // getInfo set result
  let infoResults = ref([]);

  // interface IGdalToolProps {
  //   key: number;
  //   name: string;
  //   label: string;
  //   icon: string;
  // }

  const fileSelector = ref(null);

  let tools = [
    {
      key: 1,
      name: 'shpInfo',
      label: '矢量信息',
      icon: 'icon-shpinfo',
    },
    {
      key: 2,
      name: 'shpConvert',
      label: '矢量转换',
      icon: 'icon-convert',
    },
    {
      key: 3,
      name: 'rasterInfo',
      label: '栅格信息',
      icon: 'icon-raster',
    },
    {
      key: 4,
      name: 'rasterConvert',
      label: '栅格转换',
      icon: 'icon-convert',
    },
  ];

  function toolClick(key) {
    fucMode.value = key;
    fileSelector.value?.click();
  }

  async function processFile() {
    if (!fileSelector.value) return -1;
    const fileList = fileSelector.value.files;
    if (Gdal) {
      gdalProcess(fucMode.value, fileList);
    } else {
      Gdal = await initGdalJs({
        path: GdalPath,
        useWorker: false,
      });
      gdalProcess(fucMode.value, fileList);
    }
  }

  async function gdalProcess(mode, fileList) {
    const result = await Gdal.open(fileList);
    switch (mode) {
      case 1:
        getDataInfo(result);
        break;
      case 2:
        convertToGeojson(result);
        break;
      case 3:
        getDataInfo(result);
        break;
      case 4:
        getDataInfo(result);
        break;
      default:
        console.log('no function selected');
    }
    console.log('gdalProcess finish!');
    return result;
  }

  // 获取shp类型文件信息
  async function getDataInfo(result) {
    for await (let r of result.datasets) {
      let info = Gdal.getInfo(r);
      info.then((res) => {
        infoResults.value.push(res);
      });
    }

    infoResults.value.forEach((info, idx) => {
      console.log(info, idx);
    });
  }

  // 将shp.zip转成geojson
  // 这个只支持输入一个文件吧
  async function convertToGeojson(result) {
    const shpZip = result.datasets[0];
    const options = ['-f', 'GeoJSON', '-t_srs', 'EPSG:4326'];
    const output = await Gdal.ogr2ogr(shpZip, options);
    const bytes = await Gdal.getFileBytes(output);
    const geojsonStr = String.fromCharCode.apply(null, bytes);
    // 直接下载文件梭哈
    saveAs(new Blob([geojsonStr]), 'output.geojson');
    console.log(JSON.parse(geojsonStr));
  }
</script>

<style lang="scss" scoped>
  #gdal-tools-bar {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    gap: 2rem;
    background-color: #e5e5e5;
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    padding: 0px 1rem;
  }

  .gdal-tool-item {
    width: 2.4rem;
    height: 2.4rem;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
</style>
