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
  import InfoList from './InfoList.vue';

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
        path: 'https://cdn.jsdelivr.net/npm/gdal3.js@2.0.2/dist/package',
        useWorker: false,
      });
      gdalProcess(fucMode.value, fileList);
    }
  }

  async function gdalProcess(mode, fileList) {
    // console.log(Gdal, fileList);
    const result = await Gdal.open(fileList);
    // console.log(result, result.dataset, typeof result.dataset);
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
