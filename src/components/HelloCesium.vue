<template>
  <div id="cesiumContainer"></div>
</template>

<script lang="ts">
  import * as Cesium from 'cesium';
  import { onMounted } from '@vue/runtime-core';

  Cesium.Ion.defaultAccessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZTJmMmVkMy0wNDRiLTQ1ZjktYjRjMi1jNDRhM2VkYjYxZjEiLCJpZCI6NTYzMDcsImlhdCI6MTYyMTM4OTAxOX0.qurAqe_Vv9dNRnYiMiJ5LdeIrzq1q9VkNSldOJdcjRc';

  export default {
    name: 'HelloCesium',
    setup() {
      onMounted(() => {
        const viewer = new Cesium.Viewer('cesiumContainer', {
          geocoder: false, // 位置查找工具
          homeButton: false, // 视角返回初始位置
          sceneModePicker: false, // 选择视角的模式（球体、平铺、斜视平铺）
          baseLayerPicker: false, // 图层选择器（地形影像服务）
          navigationHelpButton: false, // 导航帮助(手势，鼠标)
          animation: false, // 左下角仪表盘（动画器件）
          timeline: false, // 底部时间线
          fullscreenButton: false, // 全屏
          vrButton: false, // VR
          terrainProvider: Cesium.createWorldTerrain(),
        });
        // 去除版权信息
        (viewer.cesiumWidget.creditContainer as any).style.display = 'none';
      });
    },
  };
</script>

<style>
  #cesiumContainer {
    height: calc(100vh - 40px);
    width: 100%;
  }
</style>
