<template>
  <div id="gdal-tools-bar">
    <div class="gdal-tool-item" :key="item.key" v-for="item in tools" @click="toolClick">
      <i :class="`iconfont ${item.icon}`"></i>
    </div>
    <input type="file" ref="fileSelector" style="display: none" @change="processFile" />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import initGdalJs from 'gdal3.js';

  interface IGdalToolProps {
    key: number;
    name: string;
    label: string;
    icon: string;
  }

  const fileSelector = ref<HTMLInputElement | null>(null);
  console.log(initGdalJs);

  let tools: IGdalToolProps[] = [
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
      name: 'info',
      label: '栅格转换',
      icon: 'icon-convert',
    },
  ];

  function toolClick() {
    fileSelector.value?.click();
  }

  async function processFile() {
    if (!fileSelector.value) return -1;
    // const fileList = fileSelector.value.files;
    // const Gdal = await initGdalJs({ path: './gdal' });
    // const result = await Gdal.open(fileList);
    // console.log(result);
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
