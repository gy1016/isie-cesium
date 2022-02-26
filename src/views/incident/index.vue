<template>
  <div id="admin">
    <base-search :config="filterSearch" />
    <base-table :config="tableConfig" :query-data-method="getTableData" />
  </div>
</template>

<script lang="ts" setup>
  import BaseSearch from '@/components/BaseSearch.vue';
  import BaseTable from '@/components/BaseTable.vue';
  import { reactive } from 'vue';

  const filterSearch: Array<SearchConfig> = [
    { key: 'surveyDate', name: '上报日期:', value: '', component: 'daterange' },
    { key: 'defectGradeId', name: '等级:', value: '', component: 'select', option: { list: [] } },
    { key: 'reformStage', name: '状态:', value: '', component: 'select', option: { list: [] } },
  ];

  let curRow = reactive({});

  const onRowClick = (row: any) => {
    curRow = row;
    console.log(curRow);
  };

  const tableConfig: BaseTableConfig = {
    column: [
      {
        prop: 'defectCode',
        label: '编号',
        width: 150,
      },
      { prop: 'domainTypeName', label: '类型', width: 100 },
      { prop: 'mainTypeName', label: '大类' },
      { prop: 'subTypeName', label: '小类', width: 100 },
      { prop: 'defectGradeName', label: '等级', width: 100 },
      { prop: 'urbanName', label: '所在市域', width: 100 },
      { prop: 'districtName', label: '所在区县', width: 100 },
      { prop: 'streetName', label: '所在街道', width: 100 },
      { prop: 'roadName', label: '所在道路', width: 100 },
      { prop: 'address', label: '地址', width: 120 },
      { prop: 'reformStage', label: '状态' },
      { prop: 'surveyDate', label: '上报日期', width: 120 },
      { prop: 'checkUnitName', label: '排查单位', width: 100 },
      { prop: 'defectResourceName', label: '隐患来源', width: 100 },
      { prop: 'defectDesc', label: '隐患描述', width: 200 },
    ],
    highlightCurrentRow: true,
    rowClick: onRowClick,
    showSelection: false,
    showIndex: false,
    rowKey: 'id',
  };

  const getTableData = ({ page, size }: any) => {
    console.log(page, size);
  };
</script>

<style lang="scss" scoped>
  #admin {
    width: 100%;
    height: 100%;
    @include flex(column, flex-start, center, nowrap);
  }
</style>
