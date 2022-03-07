<template>
  <div id="isie-navigation">
    <aside>
      <div class="nav-aside-icon"></div>
      <div class="nav-aside-title">
        <p class="aside-title-zn">空间信息工程研究所</p>
        <p class="aside-title-en">Institute of Spatial Information Engineering</p>
      </div>
    </aside>
    <div class="isie-module">
      <div class="isie-module-container">
        <div
          class="nav-module-item"
          v-for="menu in templateMenus"
          :key="menu.path"
          :style="{ background: menu.background }"
          @click="menuItemClick(menu.path)"
        >
          <div class="module-item-icon">
            <i :class="`iconfont ${menu?.icon} isie-nav-icon`"></i>
          </div>
          <div class="module-item-name">{{ menu.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { IModuleProps } from '#/menu';
  import router from '@/router';

  const templateMenus: Array<IModuleProps> = [
    {
      name: '三维展示',
      path: 'cesium',
      icon: 'icon-earth',
      background: '#009dff',
    },
    {
      name: '二维展示',
      path: 'leaft',
      icon: 'icon-map',
      background: '#8D65E8',
    },
    {
      name: '湖北碳汇',
      path: 'openlayers',
      icon: 'icon-map',
      background: '#A8B260',
    },
    {
      name: '隐患管理',
      path: 'incident',
      icon: 'icon-incident',
      background: '#D8B260',
    },
    {
      name: '地形展示',
      path: 'terrian',
      icon: 'icon-incident',
      background: '#B8B260',
    },
  ];

  const menuItemClick = (path: string) => {
    router.push(path);
  };
</script>

<style lang="scss" src="./index.scss"></style>
