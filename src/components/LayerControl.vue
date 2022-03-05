<template>
  <div id="layer-control-panel" :class="props.isShow ? '' : 'h'">
    <el-tree :data="props.layers" />
    <el-button :icon="DArrowLeft" :class="['btn-hide-layers']" @click="hidenLayers" />
  </div>
</template>

<script lang="ts" setup>
  import { DArrowLeft } from '@element-plus/icons-vue';

  const props = defineProps<{
    layers: any;
    isShow: boolean;
  }>();

  const emits = defineEmits<{
    (e: 'hide:isShow', data: boolean): void;
  }>();

  const hidenLayers = () => {
    emits('hide:isShow', false);
  };
</script>

<style lang="scss" scoped>
  #layer-control-panel {
    width: 20rem;
    height: 93%;
    position: absolute;
    top: 2rem;
    left: 1rem;
    z-index: 1;
    border: 1px solid #e5e5e5;
    background-color: #fff;
  }

  .btn-hide-layers {
    width: 3rem;
    height: 3rem;
    position: absolute;
    right: -3rem;
    top: -1px;
    border-left: none;
  }
</style>
