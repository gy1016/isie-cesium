<template>
  <div id="gdal-info-list">
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item :title="info.dsName" name="1" v-for="info in fileInfoList">
        <div>driverName: {{ info.driverName }}</div>
        <div>dsName: {{ info.dsName }}</div>
        <div>featureCount: {{ info.featureCount }}</div>
        <div>layers: {{ info.layers }}</div>
        <div>type: {{ info.type }}</div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
  import { ref } from 'vue';

  defineProps({
    fileInfoList: {
      type: Array,
      required: true,
    },
  });

  const activeNames = ref(['1']);
  const handleChange = (val) => {
    console.log(val);
  };
</script>

<style lang="scss" scoped>
  #gdal-info-list {
    position: absolute;
    top: 5rem;
    left: 1rem;
  }
</style>
