<template>
  <div class="base-table">
    <el-table
      ref="table"
      :data="data"
      v-loading="loading"
      :highlight-current-row="config.highlightCurrentRow"
      :row-key="config.rowKey"
      :header-cell-style="headerCellStyle"
      :show-summary="config.showSummary"
      @row-click="onRowClick"
      @selection-change="selectionChange"
    >
      <el-table-column
        v-if="config.showIndex"
        type="index"
        label="序号"
        align="center"
      ></el-table-column>
      <el-table-column
        v-if="config.showSelection"
        type="selection"
        :reserve-selection="true"
      ></el-table-column>
      <el-table-column
        v-for="(item, index) in config.column"
        :align="config.align || 'center'"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :fixed="item.fixed"
        :show-overflow-tooltip="true"
      >
        <template #default="{ row }">
          <div
            @click="onClickItem(item, row)"
            :class="['tabel-text', { 'allow-click': !!item.onClick }]"
          >
            <span>{{ onShowNullData(row[item.prop]) }}</span>
          </div>
        </template>
      </el-table-column>
      <slot name="other"></slot>
    </el-table>
    <el-pagination
      v-show="(config || {}).showPagination === undefined ? true : config.showPagination"
      @size-change="onSize"
      @current-change="onCurrent"
      :current-page="pagination.page"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
    ></el-pagination>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { ElMessage } from 'element-plus';

  const props = defineProps<{
    config: BaseTableConfig;
    queryDataMethod: Function;
  }>();

  let data = ref<any>([]);
  let allData = ref<any>([]);
  let loading = ref(false);

  const headerCellStyle = reactive({
    background: '#f2f2f2',
    padding: 0,
  });

  const pagination = reactive({
    page: 1,
    size: 10,
    total: 0,
  });

  const onRowClick = (row: any, column: any, event: any) => {
    if (props.config.rowClick && typeof props.config.rowClick === 'function') {
      props.config.rowClick(row, column, event);
    }
  };

  const onClickItem = (item: any, row: any) => {
    if (item.onClick) item.onClick(row);
  };

  const onShowNullData = (data: any) => {
    return data ?? '--';
  };

  const selectionChange = (selection: any) => {
    if (props.config.selectionChange && typeof props.config.selectionChange === 'function') {
      props.config.selectionChange(selection);
    }
  };

  const onSize = (num: number) => {
    pagination.page = 1;
    pagination.size = num;
    const { page, size } = pagination;
    if (props.config.isFrontPage) {
      data.value = allData.value.slice((page - 1) * size, page * size);
    } else {
      getData();
    }
  };

  const onCurrent = (num: number) => {
    pagination.page = num;
    const { page, size } = pagination;
    if (props.config.isFrontPage) {
      data.value = allData.value.slice((page - 1) * size, page * size);
    } else {
      pagination.page = num;
      getData();
    }
  };

  const getData = async () => {
    loading.value = true;
    try {
      let data = await props.queryDataMethod(pagination);
      const { page, size } = pagination;
      allData.value = data.list;
      if (props.config.isFrontPage) {
        data = allData.value.slice((page - 1) * size, page * size);
      } else {
        data = allData.value;
      }
      pagination.total = data.total;
    } catch (err) {
      ElMessage({
        message: '查询列表失败',
        type: 'warning',
      });
    }
  };
</script>

<style lang="scss" scoped>
  .base-table {
    width: 100%;
    height: 100;

    .allow-click {
      cursor: pointer;
      color: #409eff;
    }

    .tabel-text {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .el-pagination {
    position: absolute;
    bottom: 0.2rem;
    right: 0.2rem;
    margin-top: 0.1rem;
    text-align: right;
  }

  .el-table {
    &:deep .el-table__body-wrapper {
      min-height: 4.9rem;
      overflow-y: auto;
    }
  }

  .header-cell {
    background: #f2f2f2;
  }
</style>
