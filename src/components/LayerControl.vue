<template>
  <div id="layer-control-panel" :class="props.isShow ? '' : 'h'">
    <el-tree
      :data="props.layers"
      show-checkbox
      node-key="id"
      :default-checked-keys="[0]"
      @check-change="toggleVisble"
    />
    <el-button :icon="DArrowLeft" :class="['btn-hide-layers']" @click="hidenLayers" />
  </div>
</template>

<script lang="ts" setup>
  import { DArrowLeft } from '@element-plus/icons-vue';

  const props = defineProps<{
    layers: ILayers[];
    isShow: boolean;
  }>();

  const emits = defineEmits<{
    (e: 'hide:isShow', data: boolean): void;
  }>();

  const hidenLayers = () => {
    emits('hide:isShow', false);
  };

  const toggleVisble = (node: any, checked: boolean) => {
    node.layer.setVisible(checked);
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
