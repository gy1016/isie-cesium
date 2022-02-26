<template>
  <header :class="`search-box`">
    <div class="search-box-content">
      <div v-for="(item, index) in config" :key="index" class="search-field">
        <div class="search-field-name">{{ item.name }}</div>
        <el-input
          v-if="item.component === 'input'"
          v-bind="item.props"
          size="small"
          v-model="item.value"
        />
        <el-select
          v-else-if="item.component === 'select'"
          v-bind="item.props"
          size="small"
          v-model="item.value"
          clearable
          filterable
        >
          <el-option
            v-for="(s, i) in (item.option || {}).list || []"
            :key="i"
            :value="s[(item.option || {}).value || 'value']"
            :label="s[(item.option || {}).label || 'label']"
          />
        </el-select>
        <el-date-picker
          v-else-if="item.component === 'daterange'"
          size="small"
          :type="(item.props || {}).type || 'daterange'"
          v-bind="item.props"
          v-model="item.value"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
        <component v-else v-bind="item.props" :is="item.component" @change="item.change || ''" />
      </div>
    </div>
    <div class="search-button">
      <el-button type="primary" @click="onSearch">查询</el-button>
      <el-button @click="onResetSearch">重置</el-button>
    </div>
  </header>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    config: Array<SearchConfig>;
  }>();
  const emit = defineEmits(['search', 'reset']);

  const onSearch = () => {
    emit('search', props.config);
  };

  const onResetSearch = () => {
    props.config.forEach((_: SearchConfig) => {
      _.value = '';
      if (_?.label) {
        _.label = '';
      }
    });
    emit('reset');
    emit('search', props.config);
  };
</script>

<style lang="scss" scoped>
  .search-box {
    width: 100%;
    min-height: 50px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0.1rem 0;
    position: relative;
    background: #fff;

    &-content {
      flex: 1;
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }

    .search-field {
      height: 100%;
      display: flex;
      align-items: center;

      &-name {
        padding: 0 0.1rem;
        min-width: 1.2rem;
        text-align: right;
        white-space: nowrap;
      }
      .el-input,
      .el-select,
      .el-cascader,
      .el-date-editor {
        width: 10rem;
      }
    }

    .search-button {
      display: flex;
      align-items: center;
      height: 0.6rem;
      padding-right: 0.1rem;
    }
  }
</style>
