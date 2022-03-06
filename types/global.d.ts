declare interface AnyObject<T = any> {
  [key: string]: T;
}

declare type AnyFunction = (...args: any[]) => any;

declare interface SearchConfig extends AnyObject {
  key: string; // 字段关键字
  name: string; // 字段名
  component: componentSelection; // 组件
  value: any; // 储存选择、输入的值
  change?: any;
  option?: SearchOption; // 配合component为select使用
  props?: AnyObject; // 根据需求配置其他属性
}

declare interface TableColumn {
  prop: string;
  label: string;
  width?: number;
  fixed?: boolean | string;
  children?: Arrat<TableColumn>; // 多级表头，递归嵌套
  onClick?: (row: any) => any;
}

declare interface BaseTableConfig extends AnyObject {
  rowKey?: string | ((row: any) => any); // 配合showSelection为true时使用，指定唯一关键字，用于跨页选择
  showIndex?: boolean; // 是否使用序号
  showSelection?: boolean; // 是否显示选选框
  showPagination?: boolean; // 是否显示分页选择器
  column: Array<TableColumn>;
  align?: 'left' | 'center' | 'right'; // 表格对其方式
  highlightCurrentRow?: boolean; // 是否点击单列时，高亮显示该列
  rowClick?: (...arg: any) => any;
  isFrontPage?: boolean; // 是否前端分页
  showSummary?: boolean; // 是否末尾显示统计行
}

interface ILayers {
  id: number;
  label: string;
  layer: any;
  initVis?: boolean;
}
